# React Performance Optimization / Tối Ưu Hiệu Suất React

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Core Web Vitals](./01-core-web-vitals.md) | [Hooks Deep Dive](../03-react/03-hooks-deep-dive.md)
> **See also**: [React Patterns](../03-react/08-react-patterns-advanced.md) | [Bundle Optimization](./03-bundle-optimization.md)

[← Previous: Core Web Vitals](./01-core-web-vitals.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Bundle Optimization →](./03-bundle-optimization.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**English:** Grab Driver App dashboard: map + order list + chat. Users report: typing in the chat box has 200ms lag. React DevTools Profiler shows `<Map>` — which renders a Mapbox canvas — re-renders on every keystroke. Root cause: chat `inputValue` is in root `<App>` state. Changing it re-renders `<App>` → React checks all children → `<Map>` renders (2ms work × 60fps = wasted).

**Fix path:** (1) colocate chat state down to `<ChatBox>`; (2) wrap `<Map>` in `React.memo`. Keystroke lag disappears.

**Bài học / Lesson:** React performance problems always start at the Profiler, not at the code. "Which component is re-rendering and why?" is always the first question — never apply `useMemo`/`useCallback` by instinct.

---

## What & Why / Cái Gì & Tại Sao

**What**: React performance optimization is the practice of reducing unnecessary work: unnecessary re-renders, unnecessary computations, unnecessary bundle bytes loaded upfront, and unnecessary DOM nodes created.

**Why it matters**: React re-renders the entire subtree by default. A state change in a root component causes React to call every child's render function, compare virtual DOM, and patch the real DOM. At scale (complex component trees, large lists, heavy computations), this default behavior causes visible lag.

**The decision tree:**

```
[User reports lag]
        │
        ▼
[React DevTools Profiler] ← always start here
        │
        ├── Unnecessary re-renders? → React.memo + stable props
        ├── Expensive computation? → useMemo
        ├── Callback recreated? → useCallback
        ├── Large list? → Virtualization (react-window)
        ├── State too high up? → State colocation
        └── Large bundle? → Code splitting + lazy loading
```

---

## Core Concept 1: The Memoization Triad — React.memo, useMemo, useCallback

> 🧠 **Memory Hook**: "Memo = **skip** if inputs unchanged. But memoization itself has a cost — the comparison. Only memo when you've measured the bottleneck."

**Tại sao tồn tại? / Why does this exist?**
React's reconciliation re-calls every child render function by default on parent state change.
→ Why is that a problem? A parent with 20 children means 20 render function calls per state update, regardless of which children actually need to change.
→ Why not cache all renders? Memoization stores the previous result in memory and runs a comparison on every render anyway — for cheap components this costs more than just re-rendering.

### Layer 1: The Three Tools and Their Jobs

```
React.memo     → wraps a COMPONENT, skips re-render if props unchanged (shallow compare)
useMemo        → wraps a COMPUTATION, caches result until deps change
useCallback    → wraps a FUNCTION, caches reference until deps change

Rule: useCallback(fn, deps) === useMemo(() => fn, deps)
```

### Layer 2: When Each Tool Fires

**React.memo — prevent re-render from parent:**

```tsx
// Without memo: re-renders every time Parent renders, even if items is the same
const ProductList = React.memo(({ items }: { items: Product[] }) => {
  return (
    <ul>
      {items.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
});

// Custom comparator: re-render only when product IDs change (ignore lastUpdated)
const UserCard = React.memo(
  ({ user }: { user: User }) => <div>{user.name}</div>,
  (prev, next) => prev.user.id === next.user.id && prev.user.name === next.user.name,
);
```

**useMemo — cache expensive computation:**

```tsx
function ProductList({ products, filter, sortBy }: Props) {
  // ✅ Only recomputes when products, filter, or sortBy change
  const filteredAndSorted = useMemo(
    () =>
      products
        .filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => (sortBy === "price" ? a.price - b.price : a.name.localeCompare(b.name))),
    [products, filter, sortBy],
  );

  return (
    <ul>
      {filteredAndSorted.map((p) => (
        <ProductRow key={p.id} product={p} />
      ))}
    </ul>
  );
}
```

**useCallback — stable function reference for memoized children:**

```tsx
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // ✅ Empty deps because functional updater doesn't close over `todos`
  const handleToggle = useCallback((id: number) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const handleDelete = useCallback((id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} onDelete={handleDelete} />
      ))}
    </>
  );
}

const TodoItem = React.memo(({ todo, onToggle, onDelete }: TodoItemProps) => (
  <div>
    <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />
    <span>{todo.text}</span>
    <button onClick={() => onDelete(todo.id)}>Delete</button>
  </div>
));
```

### Layer 3: The Inline Object / Callback Trap

```tsx
// ❌ This breaks React.memo on Child — new object reference every parent render
<Child config={{ theme: "dark", language: "en" }} />;

// ✅ Hoist constant outside component (if truly static)
const CHART_CONFIG = { theme: "dark", language: "en" };
<Child config={CHART_CONFIG} />;

// ✅ Or useMemo if derived from props/state
const config = useMemo(() => ({ theme, language }), [theme, language]);
<Child config={config} />;
```

**The batching win (React 18):** React 18 batches all `setState` calls by default — even inside `setTimeout` and Promises. Multiple `setState` calls in one event handler = one re-render, not three. This reduces the need for `useReducer` to batch state updates.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                                | Tại sao sai                                                                  | Đúng là                                                                                      |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Wrapping every component in `React.memo`                               | Memoization adds comparison overhead; cheap components are faster without it | Profile first — only memo components that show unnecessary renders in Profiler               |
| `useCallback` without `React.memo` on child                            | Stable callback reference does nothing if child always re-renders anyway     | `useCallback` only works together with `React.memo` on the receiving component               |
| `useMemo` for simple values (`const x = useMemo(() => a + b, [a, b])`) | Comparison cost > computation cost for trivial math                          | Only `useMemo` when computation is measurably slow (sort 1000+ items, regex on large string) |
| Context `value={{ theme, setTheme }}` inline                           | New object every render → all consumers re-render even when value unchanged  | `const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])`                      |

**🎯 Interview Pattern:**

- Khi thấy: "Why is React.memo not working / why does the memoized component still re-render?"
- → Nhớ: Check if a prop is an inline object/function. Stable reference is the prerequisite.
- → Mở đầu: "React.memo uses shallow comparison — if a prop is an object or function created inline in the parent's render, its reference changes every render and memo never skips."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [React Hooks — useMemo/useCallback internals](../03-react/03-hooks-deep-dive.md)
- ➡️ Để hiểu: [React Patterns — State Reducer for stable callbacks](../03-react/08-react-patterns-advanced.md)

---

## Core Concept 2: Load Reduction — State Colocation, Virtualization, Code Splitting

> 🧠 **Memory Hook**: "**State colocation** = move state close to where it's used. **Virtualization** = only render what's visible. **Code splitting** = only load what's needed now."

**Tại sao tồn tại? / Why does this exist?**
Even perfectly memoized components cannot help if state is lifted too high (causes unnecessary re-render surface area), or if the browser must render 10,000 DOM nodes, or if the initial JavaScript bundle is 3MB.
→ Why does rendering 10k DOM nodes cause lag? The browser must do layout calculations for every visible node — even if the user can only see 20.
→ Why does initial bundle size matter? JavaScript is the most expensive resource type per byte — it must be parsed and compiled before any component can render.

### Layer 1: State Colocation

The performance rule: **state should live as close as possible to the components that use it**.

```tsx
// ❌ Chat input state in App → Map re-renders on every keystroke
function App() {
  const [chatInput, setChatInput] = useState("");
  const [orders, setOrders] = useState([]);
  return (
    <>
      <Map /> {/* Re-renders on chatInput change! */}
      <OrderList orders={orders} />
      <ChatBox value={chatInput} onChange={setChatInput} />
    </>
  );
}

// ✅ Chat input state colocated in ChatBox → Map never re-renders
function App() {
  const [orders, setOrders] = useState([]);
  return (
    <>
      <Map /> {/* Never re-renders from chat activity */}
      <OrderList orders={orders} />
      <ChatBox /> {/* Manages its own chatInput state internally */}
    </>
  );
}
```

### Layer 2: Virtualization for Long Lists

```
Without virtualization (10,000 items):
DOM: 10,000 <li> nodes created → layout engine calculates 10,000 positions
Scroll: browser must re-layout on every scroll event → jank

With virtualization (react-window):
DOM: ~20 <li> nodes visible at once → 20 positions calculated
Scroll: React swaps content in existing DOM nodes → smooth 60fps
```

```tsx
import { FixedSizeList } from "react-window";

function VirtualizedProductList({ items }: { items: Product[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      {" "}
      {/* style MUST be applied for positioning to work */}
      <ProductCard product={items[index]} />
    </div>
  );

  return (
    <FixedSizeList height={600} itemCount={items.length} itemSize={80} width="100%">
      {Row}
    </FixedSizeList>
  );
}
```

**Use `@tanstack/virtual` for dynamic row heights** — `react-window` requires fixed heights; TanStack Virtual handles variable-height rows.

### Layer 3: Code Splitting with React.lazy

```tsx
// ❌ Static imports: everything in one bundle
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

// ✅ Dynamic imports: each page is a separate chunk loaded on demand
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));

function App() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

**Lazy loading images** with IntersectionObserver:

```tsx
function LazyImage({ src, alt }: { src: string; alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setLoaded(true);
      },
      { threshold: 0.1 },
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return <img ref={imgRef} src={loaded ? src : undefined} loading="lazy" alt={alt} />;
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                       | Tại sao sai                                                                | Đúng là                                                                                    |
| --------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Lifting all state to root for "global access" | Creates maximum re-render surface area                                     | Use Context or Zustand only for truly global state (auth, theme); colocate everything else |
| Forgetting `style` prop in react-window row   | Items render in wrong positions (all stacked at top)                       | The `style` prop from react-window must be applied to the row wrapper element              |
| `React.lazy` without `Suspense` boundary      | Throws "A React component suspended but no fallback was provided"          | Always wrap `lazy()` components with `<Suspense fallback={...}>`                           |
| Code-splitting every tiny component           | Creates network waterfall — many small chunks slower than one medium chunk | Only split at route level and genuinely heavy libraries (chart libs, PDF renderers)        |

**🎯 Interview Pattern:**

- Khi thấy: "How would you handle a list of 50,000 search results?"
- → Nhớ: Virtualization + consider pagination for very large datasets
- → Mở đầu: "I'd use react-window's FixedSizeList — it renders only the ~20 items in the viewport at any time, keeping DOM nodes constant at ~20 regardless of total list size."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [Core Web Vitals — LCP and INP](./01-core-web-vitals.md)
- ➡️ Để hiểu: [Bundle Optimization — tree shaking and chunk strategy](./03-bundle-optimization.md)

---

## Core Concept 3: Profiling-First Approach

> 🧠 **Memory Hook**: "**Measure, don't guess.** Every premature optimization wastes time and adds complexity. React DevTools Profiler is the only source of truth."

**Tại sao tồn tại? / Why does this exist?**
Developers instinctively add `useMemo` and `useCallback` everywhere when a component feels slow. This is wrong: memoization has overhead, and the actual bottleneck is often in a completely different component.
→ Why does measuring first matter? Adding `useMemo` to a component that renders in 0.1ms does nothing visible but adds ~0.05ms of comparison overhead.
→ Why do people skip profiling? DevTools feels slower than "just adding `useMemo`". But the time saved by identifying the real bottleneck is worth it.

### Layer 1: React DevTools Profiler Workflow

```
1. Open React DevTools → Profiler tab
2. Click ⏺️ Record
3. Perform the slow interaction (type in search, click a tab)
4. Click ⏹️ Stop
5. Read the flame graph:
   - Width = time spent rendering (wider = slower)
   - Color = hot (yellow/red) vs cold (gray = did not render)
   - Hover a bar to see: "Rendered because [prop/state/context] changed"
6. Find the widest unexpected bars — these are your optimization targets
```

**What to look for in the Profiler:**

```
Component: ProductList    renders: 47 times    total: 234ms
                          ↑ This renders 47x for one user interaction — investigate why

Component: UserAvatar     renders: 1 time      total: 0.1ms
                          ↑ This is fine — don't memo it
```

### Layer 2: The Optimization Diagnosis Tree

```
[Profiler shows unexpected re-render]
              │
              ├── Component renders though props didn't change?
              │         └── React.memo (verify props ARE stable)
              │
              ├── Expensive computation in render?
              │         └── useMemo (only if > ~5ms measured)
              │
              ├── Callback prop changing every render?
              │         └── useCallback (pair with React.memo on child)
              │
              ├── Context causing all consumers to re-render?
              │         └── Split context (ThemeContext + AuthContext) or useMemo value
              │
              └── Parent re-renders unnecessarily?
                        └── State colocation — move state closer to consumer
```

### Layer 3: Debouncing & Throttling Input Events

```tsx
// Debounce: wait until user stops typing before searching
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function SearchComponent() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) searchAPI(debouncedQuery);
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

**Debounce vs Throttle:**

```
Debounce: fires AFTER user stops for N ms      → search input, form validation
Throttle: fires AT MOST every N ms             → scroll event, resize, mouse move
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                               | Tại sao sai                                                   | Đúng là                                                                                 |
| ----------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Optimizing without profiling first                    | You might optimize the wrong component                        | Profiler first, always — find the actual bottleneck                                     |
| `useCallback(debounce(...), [])` with lodash debounce | Creates one debounced function but still passes new reference | Use `useRef` to hold the debounce instance: `const fn = useRef(debounce(handler, 300))` |
| Reading Profiler after one interaction                | Anomalies from browser JIT warmup                             | Record 3-5 interactions, look at average, ignore first render                           |

**🎯 Interview Pattern:**

- Khi thấy: "How would you debug a React performance issue?"
- → Nhớ: Profiler → identify component → identify cause → choose right tool
- → Mở đầu: "I'd start with React DevTools Profiler — profile the slow interaction, find the component with the most unexpected renders, read the 'rendered because' tooltip, and then choose the right optimization tool."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [React 19 Features — useTransition for deferred renders](../03-react/02-react-19-features.md)
- ➡️ Để hiểu: [Rendering Optimization Theory — browser paint pipeline](./05-rendering-optimization-theory.md)

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: When do you use `useMemo` vs `useCallback`? What is the relationship between them? / Khi nào dùng useMemo vs useCallback? 🟢 Junior

**A:** `useMemo` caches a **computed value**; `useCallback` caches a **function reference**. They are the same primitive: `useCallback(fn, deps)` is exactly `useMemo(() => fn, deps)`.

**Decision:**

- `useMemo` → when the computation is measurably slow (sorting/filtering 1000+ items, running regex on large text)
- `useCallback` → when the function is passed as a prop to a `React.memo`-wrapped child, OR included in another hook's dependency array

**When neither is needed:**

- Cheap computations (adding numbers, simple string formatting)
- Functions whose children don't use `React.memo`
- Components that re-render infrequently anyway

Tiếng Việt: `useMemo` cache giá trị tính toán, `useCallback` cache function reference — về cơ bản chúng giống nhau. Chỉ dùng khi (1) computation thực sự nặng, hoặc (2) function truyền vào `React.memo` child. Không dùng theo phản xạ.

**💡 Interview Signal:**

- ✅ Strong: States they're the same primitive, gives the "memo only when measured" rule, names when NOT to use them
- ❌ Weak: "useMemo for values, useCallback for functions" (correct but misses the relationship and when-not-to-use)

---

### Q: `React.memo` is on the component but it still re-renders. How do you debug this? / React.memo không hoạt động — debug thế nào? 🟡 Mid

**A:** React.memo uses **shallow comparison** of props. The most common reasons it fails:

1. **Inline object/array**: `<MemoChild config={{ size: 'lg' }} />` — new object reference every parent render. Fix: hoist constant outside component or `useMemo` the value.
2. **Inline function**: `<MemoChild onChange={() => setVal(e)} />` — new function reference every parent render. Fix: `useCallback`.
3. **Context consumer**: if the component reads from a Context that changes, React re-renders regardless of memo.
4. **`children` prop**: JSX passed as `children` is a new element every render. `React.memo` cannot memo components that accept `children` unless you stabilize the children too.

**Debugging**: In React DevTools Profiler, hover over the component bar — the tooltip shows "Rendered because: prop `onChange` changed". That tells you exactly which prop broke memo.

Tiếng Việt: React.memo so sánh nông (shallow) — lỗi thường gặp là object/function inline trong JSX. Dùng Profiler → hover vào component → tooltip "Rendered because: [prop] changed" để xác định prop vi phạm.

**💡 Interview Signal:**

- ✅ Strong: Lists inline object/function trap, Context trap, children trap — and mentions the Profiler tooltip to identify which prop
- ❌ Weak: "Check your useCallback" (only one cause, doesn't mention Profiler)

---

### Q: What is "state colocation" and how does it improve React performance? 🟡 Mid

**A:** State colocation means placing state as close as possible to the components that actually use it — rather than lifting everything to a parent "for convenience".

**Performance impact**: state lives in a component → a state change re-renders that component and its children. If state lives in the root `<App>`, every update re-renders the entire tree. Move it to a leaf component → only that subtree re-renders.

**Example**: chat input in `<App>` causes `<Map>` to re-render on every keystroke. Move `chatInput` state into `<ChatBox>` → `<Map>` never re-renders from chat activity.

**Colocation vs Context**: Context solves "many components need the same value". Colocation solves "only this subtree needs this value". Use Context sparingly — every Context update re-renders all consumers.

Tiếng Việt: state colocation = để state gần nhất với component dùng nó. State ở root → cả tree re-render khi đổi. State ở leaf → chỉ subtree đó re-render. Nguyên tắc: đừng "lift state" cao hơn mức cần thiết.

**💡 Interview Signal:**

- ✅ Strong: Explains the re-render surface area, gives the Grab chat+map example, distinguishes from Context
- ❌ Weak: "Put state where it's needed" (too vague, doesn't explain the re-render scope implication)

---

### Q: Why does rendering 10,000 DOM nodes cause scroll lag? How does virtualization fix it? 🟡 Mid

**A:** The browser's layout engine must calculate **position and dimensions for every DOM node** that exists in the document — even nodes scrolled out of view. With 10,000 `<li>` elements:

- Initial render: layout engine computes 10,000 positions → 200-500ms delay
- Each scroll event: browser re-checks which elements are now visible → expensive reflow

**Virtualization** (react-window, TanStack Virtual) keeps the DOM node count constant:

- Only ~20-30 rows exist in the DOM at any time (those in the viewport + buffer)
- On scroll: React swaps the **content** of those ~20 nodes (no DOM add/remove)
- Result: layout engine always computes 20-30 positions, not 10,000

**Trade-offs**: virtualization requires knowing item height (or measuring it), breaks native `Ctrl+F` search, and adds library complexity. For lists under ~300 items, the overhead may exceed the benefit.

Tiếng Việt: trình duyệt phải tính layout cho tất cả DOM node dù không hiển thị — 10,000 node × layout cost = lag. Virtualization giữ ~20 node trong DOM, thay nội dung thay vì thêm/xóa node. Đánh đổi: cần biết chiều cao item và không hỗ trợ Ctrl+F.

**💡 Interview Signal:**

- ✅ Strong: Explains layout engine cost (not just "too many nodes"), describes the DOM node recycling mechanism, mentions trade-offs
- ❌ Weak: "react-window only renders visible items" (correct but doesn't explain the browser layout problem or the DOM recycling)

---

### Q: Grab's driver map re-renders on every chat keystroke. Walk through your full diagnosis and fix. 🔴 Senior

**A:** **Step 1 — Profiler**: Record keystrokes in React DevTools Profiler. Confirm `<Map>` shows in the flame graph with "Rendered because: parent rendered" as reason (not a prop change).

**Step 2 — Root cause**: `<Map>` re-renders because its parent re-renders. The parent re-renders because `chatInput` state is there. `<Map>` receives no props from `chatInput`, so the re-render is pure waste.

**Step 3 — Choose fix strategy (two options):**

Option A — **State colocation** (preferred): move `chatInput` state from the parent into `<ChatBox>`. `<Map>` no longer shares a parent that changes on keystrokes. Zero memoization needed.

Option B — **`React.memo`** on Map: if state colocation isn't feasible (e.g., `chatInput` is also used elsewhere), wrap `<Map>` in `React.memo`. Ensure its props are stable references.

**Step 4 — Verify**: re-profile after fix. `<Map>` should no longer appear in the flame graph during keystroke recording.

**Why Option A is better**: no memoization overhead, simpler code, and the root cause (state too high) is fixed rather than worked around.

Tiếng Việt: luôn bắt đầu bằng Profiler để xác nhận vấn đề. Hai cách fix: (1) state colocation — di chuyển state xuống `<ChatBox>` để giảm re-render surface; (2) `React.memo` trên `<Map>` nếu không thể colocate. Option 1 ưu tiên hơn vì xử lý gốc rễ.

**💡 Interview Signal:**

- ✅ Strong: Follows Profiler → root cause → two options → verification sequence; explains WHY colocation is preferred over memo
- ❌ Weak: Immediately says "add React.memo to Map" without Profiler step or explaining root cause

---

## 📋 Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Câu hỏi                                                               | Difficulty | Core Concept                      | Key Signal                                                                               |
| --- | --------------------------------------------------------------------- | ---------- | --------------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | When do you use `useMemo` vs `useCallback`?                           | 🟢 Junior  | Memoization primitives            | Same primitive; cite "memo only when measured" rule; they're mirror of each other        |
| 2   | `React.memo` không hoạt động — debug thế nào?                         | 🟡 Mid     | Debugging unnecessary re-renders  | Inline object/function trap, Context trap, children trap; name all 3                     |
| 3   | "State colocation" là gì và cải thiện perf thế nào?                   | 🟡 Mid     | State colocation pattern          | Re-render surface area reduction; Grab chat+map example; distinguish from lifting state  |
| 4   | Tại sao 10,000 DOM nodes gây scroll lag? Virtualization fix?          | 🟡 Mid     | DOM virtualization / windowing    | Layout engine cost (not just "too many nodes"); DOM node recycle mechanism               |
| 5   | Grab's driver map re-renders on every chat keystroke — diagnose & fix | 🔴 Senior  | Cross-concern re-render diagnosis | Profiler → root cause → two options → verification; knows `useRef` for stable references |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"Your React app renders a list of 50,000 products and scrolls at 10fps. Walk me through how you'd fix it."**

**30 giây đầu — mở đầu lý tưởng:**

1. "First I'd profile with React DevTools to confirm the bottleneck is the list render, not something else — scroll handlers, context updates, or parent re-renders."
2. "If confirmed, the root cause is browser layout cost for 50,000 DOM nodes — even offscreen nodes cost layout calculation time."
3. "I'd implement virtualization using react-window's FixedSizeList — it keeps a constant ~20-30 DOM nodes in the viewport and swaps content on scroll instead of creating new nodes."
4. "If row heights vary, I'd use TanStack Virtual instead; and I'd also consider server-side pagination as a complementary strategy — 50,000 products loaded at once is likely a data problem too."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                                                      |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 🔍 Retrieval   | Vẽ lại decision tree "React performance bottleneck → which tool to use" từ trí nhớ — memo, useMemo, useCallback, virtualization, colocation, code splitting. |
| 2   | 🎨 Visual      | Sketch cách react-window hoạt động — bao nhiêu DOM nodes tồn tại khi có 10,000 items? Điều gì xảy ra khi user scroll?                                        |
| 3   | 🛠️ Application | `<Chart>` bên trong `<Dashboard>` re-render mỗi khi `dashboardFilter` thay đổi, dù Chart không dùng filter. Có 2 cách fix — chọn cái nào và tại sao?         |
| 4   | 🐛 Debug       | `const handleClick = useCallback(() => doSomething(userId), []);` — bug này là gì? Hậu quả là gì?                                                            |
| 5   | 🎓 Teach       | Giải thích cho senior developer Go chưa biết React: tại sao `<Map config={{ zoom: 10 }} />` khiến `React.memo` không hoạt động?                              |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                                                                                                |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Re-render không cần thiết → `React.memo` / `useMemo`; Expensive computation → `useMemo`; Unstable function reference → `useCallback`; Danh sách 1000+ items → virtualization; State quá cao → colocation; Bundle lớn → code splitting.   |
| 2   | react-window chỉ render ~10-20 items visible trong "window" cố định height. Tổng DOM nodes: ~20, không phải 10,000. Khi scroll → update `startIndex/endIndex` → unmount items ra ngoài, mount items mới vào — DOM luôn nhỏ.              |
| 3   | Cách 1: `React.memo(Chart)` + ensure Chart props stable; Cách 2: Lift Chart ra ngoài Dashboard render scope (component composition). Cách 1 nếu Chart cần data từ Dashboard; Cách 2 (colocation) nếu Chart hoàn toàn độc lập — sạch hơn. |
| 4   | **Stale closure bug**: `[]` deps rỗng → `handleClick` capture `userId` từ lúc mount → `userId` thay đổi nhưng handler vẫn dùng giá trị cũ. Fix: thêm `userId` vào deps: `useCallback(() => doSomething(userId), [userId])`.              |
| 5   | `{ zoom: 10 }` là object literal → tạo **new reference** mỗi render → `React.memo` dùng `Object.is` để so sánh → thấy reference khác → re-render dù giá trị như nhau. Fix: `useMemo` hoặc định nghĩa object bên ngoài component.         |

> 🎯 **Feynman Prompt:** Giải thích virtualization cho một FE dev mới — dùng ví dụ tờ giấy cuộn có 10,000 dòng chứ không dùng thuật ngữ "DOM nodes" hay "layout engine".

🔁 **Spaced Repetition reminder:** Ôn lại file này sau **3 ngày**, **7 ngày**, và **14 ngày**.

[← Previous: Core Web Vitals](./01-core-web-vitals.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Bundle Optimization →](./03-bundle-optimization.md)

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)
- [Core Web Vitals](./01-core-web-vitals.md) — INP and LCP metrics that React optimizations directly improve
- [Bundle Optimization](./03-bundle-optimization.md) — code splitting and lazy loading as React performance levers
- [Web Performance Comprehensive](./04-web-performance-comprehensive.md) — holistic performance view beyond React-specific tuning
- [Rendering Optimization Theory](./05-rendering-optimization-theory.md) — browser rendering pipeline context for React optimizations

### Khác track (Cross-track)
- [React Performance Optimization](../03-react/09-performance-optimization.md) — deeper React profiling and optimization techniques
- [React 19 Features](../03-react/02-react-19-features.md) — React 19 Compiler and concurrent features reducing manual memos
- [Hooks Deep Dive](../03-react/03-hooks-deep-dive.md) — useMemo, useCallback, and useTransition internals for optimization
