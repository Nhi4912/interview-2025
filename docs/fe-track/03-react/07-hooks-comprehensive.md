# Hooks Comprehensive / Tổng Hợp Hooks Nâng Cao

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Hooks Deep Dive](./03-hooks-deep-dive.md) | [React Fundamentals](./01-react-fundamentals.md)
> **See also**: [React Patterns](./08-react-patterns-advanced.md) | [Performance](./09-performance-optimization.md)

[← Previous](./06-testing.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./08-react-patterns-advanced.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**English:** Your team's dashboard at Shopee has three problems: a tab switch causes a 400ms freeze, a live inventory component shows stale data that "flickers" between old and new values during page transitions (concurrent mode tearing), and a shared `useFetch` hook is leaking memory — it calls `setState` on unmounted components during fast navigation. The PM wants all three fixed before the 11.11 sale.

**Tiếng Việt:** Dashboard của team tại Shopee có ba vấn đề: chuyển tab gây lag 400ms, component hiển thị tồn kho bị "tearing" (hiển thị giá trị cũ và mới lẫn lộn), và hook `useFetch` dùng chung bị memory leak vì gọi `setState` sau khi component đã unmount. PM muốn fix trước sale 11.11.

**Why this matters**: All three bugs stem from the same root: not understanding React's concurrent rendering model, hook cleanup lifecycle, and the boundary between React state and external stores.

---

## What & Why / Cái Gì & Tại Sao

**What**: Advanced hooks are React's tool set for concurrent rendering (`useTransition`, `useDeferredValue`, `useSyncExternalStore`), effect timing (`useLayoutEffect`, `useInsertionEffect`), and composable logic extraction (custom hooks, hook composition).

**Why they exist**: Class components had a fatal organization flaw — lifecycle methods (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`) forced you to scatter related logic across three different methods while mixing unrelated logic in one. A WebSocket subscription's setup, cleanup, and error handling were in three different places. Hooks collapse them into one co-located unit.

**Why the concurrent hooks**: React 18's interruptible rendering (Concurrent Mode) introduced a new class of bugs where external state could become inconsistent between renders. `useTransition` / `useDeferredValue` / `useSyncExternalStore` are the answers.

---

## Core Concept 1: Hooks Taxonomy, Rules & Lifecycle Mapping

> 🧠 **Memory Hook**: "Hooks = co-locate by **what**, not by **when**. Class components organized by lifecycle timing; hooks organize by concern."

**Tại sao tồn tại? / Why does this exist?**
Class components mixed unrelated code in one lifecycle and split related code across three.
→ Why? Because lifecycle methods (mount/update/unmount) were the only extension points in the class model.
→ Why is that a problem? A single `componentDidMount` could contain WebSocket setup, analytics tracking, AND data fetching — impossible to extract or reuse without complex mixins.

### Layer 1: Hook Categories / Phân Loại Hook

Think of hooks as power tools organized by job:

```
STATE TOOLS          TIMING TOOLS          IDENTITY TOOLS
─────────────        ────────────          ──────────────
useState             useEffect             useId
useReducer           useLayoutEffect       useRef
                     useInsertionEffect    useImperativeHandle

PERFORMANCE TOOLS    CONCURRENCY TOOLS     STORE TOOLS
─────────────────    ─────────────────     ───────────
useMemo              useTransition         useSyncExternalStore
useCallback          useDeferredValue
```

**Rules of Hooks — the why:**
React tracks each hook's state using an **ordered linked list**. Call order = position in list = identity of that hook's state. Break the order → wrong state for every subsequent hook.

```
// ✅ Safe: always same order
function Good() {
  const [a] = useState(0);  // position 0
  const [b] = useState(0);  // position 1
}

// ❌ Breaks order: position 1 disappears conditionally
function Bad({ show }) {
  const [a] = useState(0);          // position 0
  if (show) const [b] = useState(0); // position 1 → MISSING some renders!
  // next hook thinks it's position 1 but reads position 2's data
}
```

### Layer 2: Lifecycle Mapping / Ánh Xạ Vòng Đời

```
CLASS LIFECYCLE              HOOKS EQUIVALENT
────────────────────────     ────────────────────────────────────────────
componentDidMount            useEffect(fn, [])
                             ⚠️ Strict Mode: runs TWICE in dev (intentional)

componentDidUpdate           useEffect(fn, [dep1, dep2])
                             Granular: runs only when listed deps change

componentWillUnmount         return () => cleanup inside useEffect
                             ⚠️ Also runs before each effect re-run (not just unmount)

shouldComponentUpdate        React.memo + stable props (useMemo/useCallback)

getDerivedStateFromProps     Derive inline during render with useMemo

getSnapshotBeforeUpdate      useLayoutEffect + useRef (no direct equivalent)

componentDidCatch            ❌ NO HOOK EQUIVALENT — must use class ErrorBoundary
getDerivedStateFromError     ❌ NO HOOK EQUIVALENT — use react-error-boundary lib
```

### Layer 3: Effect Execution Order / Thứ Tự Effect

```
DOM committed (React writes to DOM)
          │
          ▼
useInsertionEffect  ← CSS-in-JS style injection only (library authors only)
          │
          ▼
useLayoutEffect     ← DOM measurement, scroll position (synchronous, blocks paint)
          │
          ▼
[Browser paints frame]
          │
          ▼
useEffect           ← subscriptions, fetch, analytics (async, non-blocking)
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                         | Tại sao sai                                           | Đúng là                                                      |
| --------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------ |
| `useEffect(fn, [])` is identical to `componentDidMount`         | React 18 Strict Mode runs it twice in dev             | It's similar but not identical — always write cleanup        |
| Calling a hook inside an `if` or loop                           | Breaks the linked-list ordering React depends on      | Always call at top level; put the condition INSIDE the hook  |
| `useEffect` cleanup runs only on unmount                        | Cleanup also runs before each re-run when deps change | Cleanup runs: on unmount AND before each effect re-execution |
| `getDerivedStateFromProps` → `useEffect` to sync props to state | Causes extra render cycle                             | Derive inline with `useMemo` or compute directly in render   |

**🎯 Interview Pattern:**

- Khi thấy: "Why can't hooks be called inside if statements?"
- → Nhớ: React's linked-list call-order identity
- → Mở đầu: "React identifies each hook by its call order in a linked list — skip a hook conditionally and every subsequent hook reads the wrong state slot."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [React Fundamentals — component lifecycle](./01-react-fundamentals.md)
- ➡️ Để hiểu: [React Patterns — State Reducer pattern](./08-react-patterns-advanced.md)

---

## Core Concept 2: Concurrency Hooks — useTransition, useDeferredValue, useSyncExternalStore

> 🧠 **Memory Hook**: **Transition** = "this update can wait". **Deferred** = "show stale until ready". **SyncExternal** = "don't let renders tear".

**Tại sao tồn tại? / Why does this exist?**
React 18 introduced interruptible rendering — React can pause a render mid-way and restart it.
→ Why? To keep the browser responsive: a user typing in a search box shouldn't be blocked by a 200ms render.
→ Why is that a problem for state? If an external store (Redux, Zustand) updates between render pauses, some components see the new value and others see the old. This inconsistency is called "tearing" — it looks like corrupted data to the user.

### Layer 1: The Priority Mental Model

```
HIGH PRIORITY (cannot interrupt)    LOW PRIORITY (interruptible)
────────────────────────────────    ────────────────────────────
User typing in input                Tab switch rendering 2000 items
Button click feedback               Filtering a large product list
Focus/blur events                   Navigating to a new route
```

`useTransition` and `useDeferredValue` move state updates from the left column to the right — React handles the high-priority work first.

### Layer 2: The Three Hooks Explained

**`useTransition` — control the update source:**

```tsx
const [isPending, startTransition] = useTransition();

// State updater marks the update as low-priority
startTransition(() => {
  setActiveTab(newTab); // React can interrupt and discard this render
});

// Show stale UI while transition is in progress
{
  isPending && <Spinner />;
}
```

**`useDeferredValue` — control the value consumer:**

```tsx
// When you don't own the state setter (it comes from props/context)
const deferredQuery = useDeferredValue(props.query);

// Pass deferred value to expensive component instead of live value
<ProductList query={deferredQuery} />; // re-renders only when React has bandwidth
```

**`useSyncExternalStore` — prevent tearing in concurrent renders:**

```tsx
// Bridge React to any non-React state store
const count = useSyncExternalStore(
  store.subscribe, // notify React when store changes
  store.getSnapshot, // read current value (must be synchronous, stable)
  store.getServerSnapshot, // SSR initial value (required for server rendering)
);
```

**Comparison table:**

```
Hook                 | Who uses it     | Controls                     | Use when
─────────────────────┼─────────────────┼──────────────────────────────┼──────────────────────────
useTransition        | State updater   | Which update is low-priority  | You own the setState call
useDeferredValue     | Value consumer  | Which value gets stale copy   | You receive a prop/context value
useSyncExternalStore | Store consumer  | Reading external store safely | Subscribing to non-React state
```

### Layer 3: Edge Cases & Gotchas

**useTransition gotchas:**

- The callback must call `setState` **synchronously** — cannot wrap `async/await`
- Requires `createRoot` (React 18) — `ReactDOM.render` ignores it
- Child must be wrapped in `React.memo` or it re-renders anyway

**useSyncExternalStore gotchas:**

- `getSnapshot` must return a **stable reference** when the value hasn't changed (use selector memoization)
- Missing `getServerSnapshot` throws during SSR
- Redux Toolkit, Zustand v4+, Jotai all use this hook internally

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                | Tại sao sai                                          | Đúng là                                                                       |
| ------------------------------------------------------ | ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| `startTransition(async () => fetch(...))`              | startTransition callback must be synchronous         | Manage loading state separately; only put the setState inside startTransition |
| `useDeferredValue` without `React.memo` on consumer    | Child re-renders every parent render anyway          | Wrap the heavy component in `React.memo` for useDeferredValue to have effect  |
| `useEffect + useState` for external store subscription | Has a race condition on mount (missed update window) | Use `useSyncExternalStore` — it eliminates the mount gap                      |
| Using `getSnapshot` that returns new object each call  | React sees constant "changes", triggers loop         | Memoize or use primitive return values from getSnapshot                       |

**🎯 Interview Pattern:**

- Khi thấy: "How would you handle a slow render caused by filtering 5000 items as the user types?"
- → Nhớ: useTransition (if you own the state) or useDeferredValue (if you receive the value)
- → Mở đầu: "I'd use `useDeferredValue` on the query value passed to the list — it shows the previous results while React prepares the new render in the background, keeping the input responsive."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [React 19 Features — Concurrent Mode](./02-react-19-features.md)
- ➡️ Để hiểu: [Performance Optimization — memoization strategies](./09-performance-optimization.md)

---

## Core Concept 3: Custom Hook Architecture & Performance Patterns

> 🧠 **Memory Hook**: "Custom hook = **extract logic, not state**. Each call site gets its own state instance. It's like a recipe, not a pot of shared soup."

**Tại sao tồn tại? / Why does this exist?**
Before hooks, sharing stateful logic between class components required render props or HOCs — both introduced extra component tree nodes and "wrapper hell".
→ Why is wrapper hell bad? DevTools showed 8+ layers of `<WithAuth><WithTheme><WithData>` wrappers, making debugging a nightmare.
→ Why can't you just share class instances? Class instances are tied to component instances — you can't extract lifecycle logic without the component itself.

### Layer 1: Composition Mental Model

```
Primitive hooks (from React):     useState, useEffect, useRef
         │
         ▼
Infrastructure hooks:             useFetch, useDebounce, useLocalStorage
         │
         ▼
Domain hooks:                     useProductSearch, useCartTotal, useAuthUser
         │
         ▼
Component:                        <SearchPage /> calls useProductSearch
```

**Single responsibility**: each layer only knows about the layer below it. `useProductSearch` calls `useDebounce` but does not call `useState` directly — it composes.

### Layer 2: Custom Hook Design Rules

```tsx
// ✅ Well-designed custom hook
function useFetch<T>(url: string): { data: T | null; error: Error | null; loading: boolean } {
  const [state, dispatch] = useReducer(fetchReducer, { data: null, error: null, loading: true });

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: "LOADING" });

    fetch(url, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => dispatch({ type: "SUCCESS", data }))
      .catch((err) => {
        if (err.name !== "AbortError") dispatch({ type: "ERROR", error: err });
      });

    return () => controller.abort(); // cleanup: cancel on unmount or url change
  }, [url]);

  return state;
}
```

**Key design rules:**

1. **Name with `use` prefix** — required for ESLint to enforce Rules of Hooks inside
2. **Return stable references** — inline `{ data, error, loading }` creates new object each render; use `useReducer` state directly
3. **Accept config, don't hardcode** — `url` is a parameter, not hardcoded inside
4. **Document cleanup semantics** in JSDoc — what gets cancelled, what side effects occur
5. **Composition over monoliths** — `useProductSearch` = `useDebounce` + `useFetch`, not one giant hook

### Layer 3: Performance Patterns & Pitfalls

**The stale closure trap:**

```tsx
// ❌ Stale closure: count captured at effect creation time
useEffect(() => {
  const id = setInterval(() => {
    console.log(count); // always logs the initial value!
  }, 1000);
  return () => clearInterval(id);
}, []); // count missing from deps

// ✅ Fix 1: add to deps (effect restarts on each count change)
useEffect(() => {
  const id = setInterval(() => console.log(count), 1000);
  return () => clearInterval(id);
}, [count]);

// ✅ Fix 2: ref to latest value (effect never restarts)
const countRef = useRef(count);
useEffect(() => {
  countRef.current = count;
});
useEffect(() => {
  const id = setInterval(() => console.log(countRef.current), 1000);
  return () => clearInterval(id);
}, []);
```

**Context performance trap:**

```tsx
// ❌ Creates new object on every render → all consumers re-render
<ThemeContext.Provider value={{ theme, setTheme }}>

// ✅ Stable reference → consumers only re-render when theme/setTheme change
const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
<ThemeContext.Provider value={value}>
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                      | Tại sao sai                                                    | Đúng là                                                            |
| ------------------------------------------------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------ |
| Returning `{ data, error, loading }` inline from a hook      | New object each render breaks memoization downstream           | Return `useReducer` state directly, or `useMemo` the return object |
| No `AbortController` in `useFetch`                           | setState called on unmounted component on fast navigation      | Always return `() => controller.abort()` from useEffect cleanup    |
| Calling `useMemo`/`useCallback` everywhere by default        | Memoization has memory cost; adds cognitive overhead           | Measure first with Profiler; only memo when bottleneck confirmed   |
| `<Child options={{ size: 'lg' }} />` with `React.memo` child | Inline object is new reference every render → memo never skips | Hoist constant outside component or `useMemo` the options object   |

**🎯 Interview Pattern:**

- Khi thấy: "How would you design a shared data-fetching hook for a team of 20 developers?"
- → Nhớ: composition layers + cancellation contract + stable return value
- → Mở đầu: "I'd design it in two layers: a primitive `useFetch` handling AbortController and state machine, then a domain `useProductData` composing it — with JSDoc specifying which arguments must be stable references."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [Hooks Deep Dive — useEffect cleanup](./03-hooks-deep-dive.md)
- ➡️ Để hiểu: [React Testing — testing custom hooks with renderHook](./06-testing.md)

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What are the Rules of Hooks and why does React require them? / Tại sao React có Rules of Hooks? 🟢 Junior

**A:** Two rules: (1) only call hooks at the top level — never inside loops, conditions, or nested functions; (2) only call hooks from React function components or custom hooks.

The reason is implementation: React tracks hook state using an ordered linked list — one node per `useState`/`useEffect`/etc. call. Position in that list is the only identifier React has for each hook's state. Conditionally skip a hook → every subsequent hook reads the wrong state slot.

Tiếng Việt: React dùng linked list theo thứ tự gọi để track state của mỗi hook — bỏ qua hook có điều kiện sẽ làm mọi hook sau đọc nhầm ô state. ESLint plugin `eslint-plugin-react-hooks` phát hiện vi phạm tự động.

**💡 Interview Signal:**

- ✅ Strong: Names the linked-list implementation, explains why position = identity, mentions ESLint plugin
- ❌ Weak: "Because React needs to track state" (doesn't explain the mechanism)

---

### Q: What is a stale closure in a `useEffect` and how do you fix it? / Stale closure trong useEffect là gì? 🟡 Mid

**A:** A stale closure occurs when a `useEffect` callback closes over a variable (e.g., `count`) from the render at the time the effect was created, but the variable has changed in subsequent renders. The effect "sees" the old value because the closure was never re-created.

**Three fixes:**

1. Add the variable to the dependency array — effect re-creates when it changes.
2. `useRef` to hold latest value: `const ref = useRef(count); useEffect(() => { ref.current = count; })` — read `ref.current` inside the effect.
3. Functional setState form: `setCount(c => c + 1)` avoids reading `count` from the closure.

Tiếng Việt: stale closure xảy ra khi effect dùng giá trị cũ từ lần render trước. Ba cách fix: (1) thêm dependency, (2) dùng `useRef` giữ value mới nhất, (3) dùng functional updater để tránh đọc closure.

**💡 Interview Signal:**

- ✅ Strong: Explains the closure mechanism, gives all three fixes with their trade-offs (ref = no restart; deps = restart; functional = no read)
- ❌ Weak: "Just add it to the dependency array" (only one fix, doesn't mention trade-offs)

---

### Q: What is the difference between `useTransition` and `useDeferredValue`? When do you use each? 🔴 Senior

**A:** Both defer non-urgent rendering, but they operate from different positions:

- **`useTransition`** is used by the _state updater_. Call `startTransition(() => setState(newValue))` where the state update happens. Use when you **own** the state setter (e.g., user clicks a tab, you call `setActiveTab`).
- **`useDeferredValue`** is used by the _value consumer_. Call `const deferred = useDeferredValue(props.query)` in the component rendering the expensive list. Use when you **receive** the value from outside (a prop or context value you don't control).

Trade-off: both require `React.memo` on expensive children to have any effect. Without memoization, React still re-renders the child on every cycle.

Tiếng Việt: `useTransition` đặt ở nguồn update (chỗ `setState`), `useDeferredValue` đặt ở nơi nhận value. Khi không kiểm soát nguồn state, chỉ có thể dùng `useDeferredValue`.

**💡 Interview Signal:**

- ✅ Strong: Identifies "who owns the state" as the decision criterion, mentions `React.memo` requirement
- ❌ Weak: "useTransition is for transitions" (circular definition, doesn't distinguish the two)

---

### Q: How does `useSyncExternalStore` prevent tearing, and when should you use it over `useEffect + useState`? 🔴 Senior

**A:** In concurrent rendering, React may pause and resume a render. If an external store updates between pauses, some components see the old value and others the new — "tearing".

`useSyncExternalStore(subscribe, getSnapshot)` prevents this by:

1. Taking a **synchronous `getSnapshot`** that React calls multiple times during a single render pass.
2. If `getSnapshot` returns a different value between calls (store changed mid-render), React synchronously re-renders to resolve inconsistency.

The `useEffect + setState` subscription pattern has a race: between mount and the effect running, the store may have updated — causing a missed initial value. `useSyncExternalStore` eliminates this window by subscribing before the first paint.

**When to use**: any non-React state components need to subscribe to — Redux store, Zustand store, `window.matchMedia`, `navigator.onLine`. Redux Toolkit and Zustand v4 both use it internally.

Tiếng Việt: `useEffect + useState` có race condition giữa mount và subscribe — `useSyncExternalStore` subscribe ngay từ đầu và detect tearing trong concurrent renders.

**💡 Interview Signal:**

- ✅ Strong: Defines tearing, explains the mount race condition, mentions Redux/Zustand using it internally
- ❌ Weak: "It's more reliable for external stores" (vague, doesn't explain the problem it solves)

---

### Q: How do you design a custom `useFetch` hook that handles race conditions and cleanup? 🟡 Mid

**A:** A production-grade `useFetch` must handle three problems: (1) unmounting mid-request, (2) rapid input changes causing stale responses, (3) invalid intermediate states.

Key implementation points:

- Use `AbortController` to cancel in-flight `fetch` in the cleanup function.
- Use `useReducer` for `{ data, error, loading }` to keep state transitions atomic.
- Accept a URL parameter — memoize config objects at the call site with `useMemo`.

```tsx
useEffect(() => {
  const controller = new AbortController();
  dispatch({ type: "LOADING" });
  fetch(url, { signal: controller.signal })
    .then((r) => r.json())
    .then((data) => dispatch({ type: "SUCCESS", data }))
    .catch((err) => {
      if (err.name !== "AbortError") dispatch({ type: "ERROR", error: err });
    });
  return () => controller.abort();
}, [url]);
```

Tiếng Việt: hai lỗi phổ biến nhất: không cancel khi unmount, và state transition không atomic (loading: false + data: null tồn tại cùng lúc). `AbortController` + `useReducer` giải quyết cả hai.

**💡 Interview Signal:**

- ✅ Strong: Mentions AbortController cleanup, useReducer for atomic state, and the stale response race condition
- ❌ Weak: Only mentions `useState` for loading/data/error separately (doesn't handle intermediate invalid states)

---

### Q: Why is Error Boundary still a class component? What is the hooks equivalent? 🟡 Mid

**A:** Error Boundaries require `getDerivedStateFromError` and `componentDidCatch` — two lifecycle methods with no hook equivalents. React has not added hook alternatives because catching render-phase errors requires intercepting during the rendering pass itself, which the current hooks architecture cannot do.

**Practical solution**: use `react-error-boundary` — provides `<ErrorBoundary>` component, `useErrorBoundary()` hook for throwing errors programmatically, and `withErrorBoundary` HOC.

Tiếng Việt: không có hook nào thay thế Error Boundary — câu bẫy phổ biến trong phỏng vấn. Dùng `react-error-boundary` để bọc function component.

**💡 Interview Signal:**

- ✅ Strong: Names the specific missing lifecycle methods, explains why (render-phase error capture), mentions react-error-boundary
- ❌ Weak: "You can't do it with hooks" (doesn't explain why or offer the solution)

---

### Q: What is the execution order of `useInsertionEffect`, `useLayoutEffect`, and `useEffect`? Why does it matter? 🔴 Senior

**A:** Order: **`useInsertionEffect`** → **`useLayoutEffect`** → **`useEffect`** — all run after DOM commit.

- `useInsertionEffect`: synchronous before layout effects. Can only inject `<style>` tags — cannot read refs or call setState. For CSS-in-JS library authors only.
- `useLayoutEffect`: synchronous after DOM mutation, before browser paints. Safe for DOM measurements (scroll position, element dimensions).
- `useEffect`: asynchronous after paint. Non-blocking — use for subscriptions, fetching, analytics.

Why it matters: if `useLayoutEffect` measures element size but a CSS-in-JS library also uses `useLayoutEffect` for style injection, the measurement may be wrong. `useInsertionEffect` guarantees styles exist before any layout measurement.

Tiếng Việt: thứ tự đảm bảo: style có trước khi measure (`useInsertionEffect` trước `useLayoutEffect`), measure xong trước khi paint (`useLayoutEffect` trước paint), side effects sau khi render (`useEffect` sau paint).

**💡 Interview Signal:**

- ✅ Strong: Names all three, explains the ordering guarantee, gives the CSS-in-JS measurement race condition as the motivation
- ❌ Weak: Only knows `useEffect` vs `useLayoutEffect` — misses `useInsertionEffect` entirely

---

### Q: How does `useId` solve SSR hydration mismatches? 🟡 Mid

**A:** Before `useId`, developers used module-level counters (`let id = 0`) or `Math.random()` for unique HTML `id` attributes. These fail during SSR:

- Module counters reset between server requests but are shared across components in one render — increments differ server vs client.
- `Math.random()` is non-deterministic.

`useId` generates IDs from the component's **position in the React fiber tree**, which is identical on server and client given the same component structure. `<label htmlFor="r0:label">` on server matches `<input id="r0:label">` on client.

**Important**: never use `useId` for list item `key` props — keys must come from data identity, not position.

Tiếng Việt: `useId` tạo ID từ vị trí trong component tree — deterministic, giống nhau trên server và client. Dùng cho `htmlFor`/`id`, `aria-describedby` — không dùng cho `key` prop.

**💡 Interview Signal:**

- ✅ Strong: Explains the module-counter and Math.random() failures, fiber-tree determinism, and the key-prop antipattern
- ❌ Weak: "useId generates unique IDs" (doesn't explain the SSR hydration problem it solves)

---

### Q: What are the common pitfalls when migrating `componentDidUpdate` to hooks? 🟡 Mid

**A:** Three major pitfalls:

1. **Runs on mount too**: `useEffect(fn, [dep])` runs after initial render AND on dep changes. `componentDidUpdate` did NOT run on mount. Guard with: `const mounted = useRef(false); useEffect(() => { if (!mounted.current) { mounted.current = true; return; } fn(); }, [dep])`.

2. **Object dep identity**: if `dep` is an object created inline, `useEffect` sees a new reference every render and runs every time. `componentDidUpdate` compared by explicit `prevProps.x !== this.props.x`.

3. **Cleanup runs more than unmount**: the effect's return function runs before each re-run when deps change, not only on unmount. Expensive cleanup (e.g., cancelling a network request) that you expected to run once now runs on every dep change.

Tiếng Việt: ba bẫy migrate: (1) effect chạy cả lần mount, (2) object dep luôn mới mỗi render, (3) cleanup chạy trước mỗi re-run không chỉ unmount.

**💡 Interview Signal:**

- ✅ Strong: All three pitfalls with concrete solutions (useRef guard, stable refs, cleanup awareness)
- ❌ Weak: Only mentions the dependency array difference

---

### Q: How do you test a custom hook that uses `setTimeout` internally? 🟢 Junior

**A:** Use fake timers from the test framework to control time without actually waiting.

```ts
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it("returns debounced value after delay", () => {
  const { result, rerender } = renderHook(({ val }) => useDebounce(val, 300), {
    initialProps: { val: "a" },
  });
  expect(result.current).toBe("a");

  rerender({ val: "b" });
  expect(result.current).toBe("a"); // still stale

  act(() => vi.advanceTimersByTime(300));
  expect(result.current).toBe("b"); // now updated
});
```

Wrap timer advancement in `act()` so React flushes state updates before assertions. Use `renderHook` to keep tests focused on hook logic without mounting a full component.

Tiếng Việt: dùng `vi.useFakeTimers()` để control thời gian, `act(() => vi.advanceTimersByTime(300))` để advance timer và flush React state, sau đó mới assert.

**💡 Interview Signal:**

- ✅ Strong: Mentions `renderHook`, `act()` wrapper requirement, fake timers — and knows why act() is needed (flush state updates)
- ❌ Weak: "Use setTimeout mock" without mentioning act() wrapping or renderHook

---

## 📋 Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Câu hỏi                                                          | Difficulty | Core Concept      | Key Signal                                               |
| --- | ---------------------------------------------------------------- | ---------- | ----------------- | -------------------------------------------------------- |
| 1   | Rules of Hooks và tại sao React yêu cầu?                         | 🟢 Junior  | Hook internals    | Call order = linked list stability                       |
| 2   | Stale closure trong `useEffect` — nguyên nhân và fix?            | 🟡 Mid     | Closure           | Dep array + functional updater + ref                     |
| 3   | `useTransition` vs `useDeferredValue` — khi nào dùng?            | 🔴 Senior  | Concurrent React  | Initiator vs receiver deferral                           |
| 4   | `useSyncExternalStore` ngăn tearing như thế nào?                 | 🔴 Senior  | Concurrent safety | External store + `getSnapshot` consistency               |
| 5   | Design `useFetch` xử lý race conditions và cleanup               | 🟡 Mid     | Hook design       | AbortController + ignore flag                            |
| 6   | Error Boundary vẫn là class component — tại sao?                 | 🟡 Mid     | React limitations | Không có hooks equivalent cho `getDerivedStateFromError` |
| 7   | Thứ tự `useInsertionEffect` vs `useLayoutEffect` vs `useEffect`? | 🔴 Senior  | Render lifecycle  | CSS-in-JS timing, DOM mutation order                     |
| 8   | `useId` giải quyết SSR hydration mismatch?                       | 🟡 Mid     | SSR               | Server/client stable ID generation                       |
| 9   | Pitfalls khi migrate `componentDidUpdate` sang hooks?            | 🟡 Mid     | Migration         | Prev deps pattern, multiple effects                      |
| 10  | Test custom hook dùng `setTimeout` internally?                   | 🟢 Junior  | Testing           | `jest.useFakeTimers` + `act()`                           |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"Our React 18 app has a search input that freezes the UI for 300ms when filtering 8000 products. How would you fix it without virtualizing the list?"**

**30 giây đầu — mở đầu lý tưởng:**

1. "The freeze happens because filtering 8000 items is synchronous and blocks the browser — I'd make it a low-priority update using React 18 concurrency hooks."
2. "If I own the filter state setter, `useTransition` lets me mark that setState as non-urgent — the input stays responsive while React prepares the filtered list."
3. "If I only receive the query as a prop, I'd use `useDeferredValue` on it in the list component — it shows the previous results as a fade-out while the new ones render."
4. "Both require wrapping the expensive list in `React.memo` — otherwise React re-renders it unconditionally regardless of the deferral."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                               |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Viết ra 5 nhóm hook (state, effect, ref, memo, concurrency) và 1 hook ví dụ cho mỗi nhóm — không nhìn lại.                            |
| 2   | 🎨 Visual      | Vẽ bảng lifecycle mapping: class lifecycle methods → hooks tương đương. Cái nào KHÔNG có hook tương đương?                            |
| 3   | 🛠️ Application | Nhận `props.searchQuery` từ parent, render danh sách 5000 sản phẩm — dùng `useTransition` hay `useDeferredValue`? Tại sao? Viết code. |
| 4   | 🐛 Debug       | `useEffect(() => { fetchData() }, [options])` bị re-run mỗi render dù options không đổi — nguyên nhân gì? Fix thế nào?                |
| 5   | 🎓 Teach       | Giải thích "tearing" trong concurrent React cho developer chưa biết React 18 — dùng ví dụ thực tế trong 2 câu.                        |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                                                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | State: `useState`, `useReducer`. Effect: `useEffect`, `useLayoutEffect`. Ref: `useRef`, `useImperativeHandle`. Memo: `useMemo`, `useCallback`. Concurrency: `useTransition`, `useDeferredValue`. |
| 2   | `componentDidMount` → `useEffect(fn, [])`. `componentDidUpdate` → `useEffect(fn, [deps])`. `componentWillUnmount` → cleanup function. `getSnapshotBeforeUpdate` = không có hook tương đương.     |
| 3   | `useDeferredValue` khi nhận value từ parent (không control state). `useTransition` khi control state update. Dùng `useDeferredValue(searchQuery)` → deferred search với `useMemo` filter.        |
| 4   | `options` là object/array được tạo mới mỗi render → reference thay đổi → deps thay đổi. Fix: `useMemo` cho options, hoặc stringify, hoặc destructure primitives làm deps.                        |
| 5   | Tearing: concurrent mode có thể interrupt render → same `useSelector` trả values khác nhau trong một render pass → UI inconsistent. Như đọc báo bị chia trang giữa chừng.                        |

> 🎯 **Feynman Prompt:** "Giải thích tại sao `useSyncExternalStore` tốt hơn `useEffect + useState` khi subscribe vào Redux store — dùng ví dụ cụ thể mà không dùng thuật ngữ 'tearing'."
> 🔁 **Spaced Repetition reminder:** Ôn lại file này sau **3 ngày**, **7 ngày**, và **14 ngày**.

[← Previous](./06-testing.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./08-react-patterns-advanced.md)

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)
- [React Fundamentals](./01-react-fundamentals.md) — rendering model hooks are layered onto
- [Hooks Deep Dive](./03-hooks-deep-dive.md) — internal mechanics and linked-list model
- [State Management](./05-state-management.md) — escalating beyond useState/useReducer
- [Performance Optimization](./09-performance-optimization.md) — useTransition and useDeferredValue profiling

### Khác track (Cross-track)
- [Closures](../01-javascript/03-closures.md) — stale closure root cause for hook bugs
- [Data Structures Theory](../../shared/01-cs-fundamentals/data-structures-theory.md) — hooks dispatcher implemented as linked list
