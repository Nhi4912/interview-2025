# React Performance Optimization / Tối Ưu Hiệu Năng React

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [React Fundamentals](./01-react-fundamentals.md) | [Hooks Deep Dive](./03-hooks-deep-dive.md)
> **See also**: [Core Web Vitals](../06-browser-performance/01-core-web-vitals.md) | [React 19 Features](./02-react-19-features.md)

[← Previous: Advanced Patterns](./08-react-patterns-advanced.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →: Modern React Features](./10-modern-react-features.md)

---

## Real-World Scenario / Tình Huống Thực Tế 🏭

> **Bối cảnh**: Lazada mobile web — `<ProductList>` render 50 items. PM report: scroll lag và
> input delay. Dev thêm `React.memo` vào MỌI component, `useMemo` vào MỌI computed value —
> lag không giảm, code phức tạp hơn. Profile bằng React DevTools Profiler → bottleneck thực sự
> là **một hàm filter không được memo** đang re-compute 200ms mỗi keystroke, không phải children re-render.
>
> **Bài học**: Optimization mà không đo là premature optimization. Rule:
> **Profile first, optimize second**. 80% React performance problems là:
> (1) unnecessary re-renders, (2) expensive computations không memo, (3) large lists không virtualized.

---

## What & Why / Cái Gì & Tại Sao 🤔

**Tương tự đời thường**: Tối ưu React giống tối ưu nhà hàng — không phải thêm đầu bếp (memo mọi thứ),
mà phân tích bottleneck. Hóa ra vấn đề là máy POS chậm (một hàm tính toán). Thêm đầu bếp tốn tiền
nhưng không giúp khi POS vẫn chậm.

**Three causes of React slowness:**
1. **Too many renders** → architectural patterns + React.memo
2. **Expensive renders** → useMemo for heavy computations
3. **Large lists** → virtualization (react-window / @tanstack/virtual)

```
[React Performance Optimization]
        │
        ├── 1. Measure first → React DevTools Profiler
        │
        ├── 2. Render optimization
        │       ├── Architectural: state colocation, composition, context split
        │       ├── React.memo — skip re-render if props unchanged (===)
        │       ├── useCallback — stable function reference for memo'd children
        │       └── useMemo — cache expensive computed values
        │
        ├── 3. Load optimization
        │       ├── Code splitting — React.lazy + Suspense
        │       ├── List virtualization — only render visible items
        │       └── Image/asset optimization — formats, lazy loading, priority
        │
        └── 4. Concurrent features
                ├── useTransition — non-urgent state updates
                └── useDeferredValue — stale value during heavy renders
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Re-render Prevention — Architecture Before Memo / Ngăn Re-render — Kiến Trúc Trước Memo

> 🧠 **Memory Hook**: **"Architecture > memo"** — move state down, lift content up, split context. These three patterns eliminate 80% of re-render issues without any API calls

**Tại sao tồn tại? / Why does this exist?**

React re-renders all children when parent state changes — by design. This is "pessimistic rendering":
assume everything needs update, let diffing figure out what actually changed.

→ **Why?** Vì React không track dependency graph giữa state và component output. Nó không biết
component B không dùng state X — nên re-render tất cả để safe.

→ **Why?** Vì tracking dependencies tự động (à la Vue/Svelte) có complexity cost. React chọn
simplicity (re-render all) + opt-in optimization (memo) thay vì magic reactivity. React Compiler
(React 19) là bước đầu tiên toward automatic optimization.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Re-render trong React giống **họp toàn công ty**: khi CEO (root component) thay đổi quyết định,
MỌI NGƯỜI phải tham dự họp (re-render) dù chỉ 1 team bị ảnh hưởng. Giải pháp: **đừng để CEO
giữ quyết định đó** — chuyển nó xuống team leader (move state down), hoặc cho team họp riêng
(composition pattern).

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
THREE PATTERNS — ranked by effectiveness:

  1. STATE COLOCATION (move state down):
  ─────────────────────────────────────
  ❌ Before:                       ✅ After:
  <App>  ← owns mousePos          <App>
    <Nav />     ← re-renders!       <Nav />         ← NOT affected
    <Content /> ← re-renders!       <Content />     ← NOT affected
    <Cursor pos={mousePos} />        <MouseTracker>  ← owns mousePos
                                       <Cursor />
                                     </MouseTracker>

  2. COMPOSITION (children as props):
  ──────────────────────────────────
  ❌ Before:                       ✅ After:
  <ScrollTracker>                  <ScrollTracker>
    {/* state changes here */}       {children}  ← children DON'T re-render
    <ExpensiveList />                             because they're passed from
  </ScrollTracker>                               parent, not created here

  3. CONTEXT SPLITTING:
  ─────────────────────
  ❌ Before: One big context       ✅ After: Split by update frequency
  <AppContext value={{              <ThemeCtx value={theme}>   ← rare
    theme, user, cart,               <AuthCtx value={user}>   ← rare
    mousePos                           <CartCtx value={cart}>  ← frequent
  }}>                                    <MouseCtx value={pos}> ← very frequent
  {/* ALL consumers re-render        {children}
    on ANY change */}                </MouseCtx>...
```

```tsx
// ✅ Pattern 1: State colocation
// BAD: state at top → entire tree re-renders
function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}>
      <Cursor position={mousePos} />
      <ExpensiveNavigation />  {/* re-renders 60x/sec! */}
      <ExpensiveContent />     {/* re-renders 60x/sec! */}
    </div>
  );
}

// GOOD: isolate fast-changing state
function App() {
  return (
    <>
      <MouseTracker />         {/* only this re-renders */}
      <ExpensiveNavigation />  {/* never re-renders from mouse */}
      <ExpensiveContent />
    </>
  );
}

// ✅ Pattern 2: Composition (children as props)
function ScrollTracker({ children }: { children: ReactNode }) {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div>
      <ProgressBar progress={scrollY / document.body.scrollHeight} />
      {children}  {/* children DON'T re-render on scroll! */}
    </div>
  );
}

// ✅ React.memo — ONLY after architectural patterns fail
const ExpensiveChart = memo(function ExpensiveChart({ data }: { data: readonly number[] }) {
  return <svg>{/* expensive SVG calculation */}</svg>;
});

// Parent MUST stabilize props for memo to work
function Dashboard() {
  const [filter, setFilter] = useState('all');
  const chartData = useMemo(() => processData(rawData, filter), [rawData, filter]);
  const handleClick = useCallback((id: string) => navigate(`/item/${id}`), []);

  return <ExpensiveChart data={chartData} onClick={handleClick} />;
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Memo does NOT prevent context re-renders**: If a memo'd component consumes a context that changes, it still re-renders
- **Children prop breaks memo**: `<Memo><Child/></Memo>` — `children` is new JSX every render → memo useless
- **React.memo adds memory overhead**: Stores previous props for comparison. In lists with thousands of items, this cost adds up
- **React 19 Compiler**: Auto-inserts memo where beneficial — manual memo becomes unnecessary. But understanding WHY is still essential for interviews

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "Just add React.memo to everything" | Memo without stable props is a no-op. Memo adds comparison overhead. | Fix architecture first (state colocation, composition) |
| Inline objects as props to memo'd child | `style={{ color: 'red' }}` creates new ref every render → defeats memo | Extract to constant or `useMemo` |
| "useMemo/useCallback improve raw speed" | They exist for referential stability, not computation speed. The overhead may exceed savings for cheap computations | Only use when the value is passed to a memo'd child OR computation >1ms |
| Optimizing without profiling | You might optimize the wrong thing — like the Lazada example where memo'd children weren't the bottleneck | Always profile first with React DevTools |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "React performance", "unnecessary re-renders", "React.memo"
- → Nhớ đến: "Architecture > memo" — colocation, composition, context split
- → Mở đầu trả lời: "I'd start by profiling with React DevTools to identify the actual bottleneck — most developers jump to React.memo without measuring. The most effective optimizations are architectural: moving state closer to where it's used, using composition to prevent parent re-renders from affecting children, and splitting contexts by update frequency. React.memo is a last resort when these patterns don't apply."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [React Fundamentals — Reconciliation](./01-react-fundamentals.md) — how React decides what to re-render
- ➡️ Để hiểu: [Core Web Vitals — INP](../06-browser-performance/01-core-web-vitals.md) — connecting re-render optimization to user-facing metrics

---

### 2. Code Splitting & List Virtualization / Tách Code & Ảo Hóa Danh Sách

> 🧠 **Memory Hook**: **"Don't ship what you don't show"** — lazy-load invisible routes, virtualize invisible rows

**Tại sao tồn tại? / Why does this exist?**

Average web page ships 400KB+ JS. User trên 3G mobile phải chờ 5-10 giây để parse + execute.
Nhưng user chỉ thấy 1 page tại 1 thời điểm, và chỉ thấy ~20 rows trong list 10,000 items.

→ **Why?** Vì browser phải download, parse, compile, execute TOÀN BỘ JS trước khi interactive.
Mỗi KB JS thêm ~1ms parse time trên mobile.

→ **Why?** Vì đây là trade-off giữa **initial load speed** (load less code) và **navigation speed**
(have code ready). Code splitting + prefetch cho cả hai: load minimum upfront, prefetch rest
during idle time.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

- **Code splitting** giống **buffet thay vì full course dinner**: thay vì bưng tất cả 12 món ra
  lúc đầu (bundle), chỉ bưng món đang ăn (current route), món tiếp theo chuẩn bị sẵn (prefetch).
- **Virtualization** giống **cửa sổ tàu lửa**: bạn chỉ thấy cảnh qua cửa sổ (visible rows),
  không cần toàn bộ quang cảnh 1000km tồn tại cùng lúc trong bộ nhớ.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
CODE SPLITTING — load paths:

  Without splitting:
  [──────── 400KB app.js ────────] → 5s mobile parse
  User waits... waits... interactive!

  With route splitting:
  [── 80KB core.js ──] → 1s parse → interactive!
     └── prefetch: [settings.js] [profile.js] during idle

  With component splitting:
  [── 80KB core.js ──] → interactive!
     └── on hover: [chart.js]  → instant when clicked

VIRTUALIZATION — DOM management:

  Without:  10,000 items → 10,000 DOM nodes → 2s layout
  With:     10,000 items → ~30 DOM nodes → <1ms layout

  ┌──────────────────────────┐
  │  ░░░░ overscan (3)  ░░░░ │  ← rendered but off-screen
  │ ┌──────────────────────┐ │
  │ │ visible item 1       │ │  ← user sees these
  │ │ visible item 2       │ │
  │ │ ...                  │ │
  │ │ visible item 20      │ │
  │ └──────────────────────┘ │
  │  ░░░░ overscan (3)  ░░░░ │  ← rendered but off-screen
  └──────────────────────────┘
     Items 24-9976: NOT in DOM at all
```

```tsx
// ✅ Route-level splitting (baseline — every app should do this)
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

// ✅ Prefetch on hover — hides latency
const ChartModule = lazy(() => import('./components/Chart'));
function ChartButton() {
  const prefetch = () => { import('./components/Chart'); };
  return (
    <button onMouseEnter={prefetch} onClick={() => setShow(true)}>
      Show Chart
    </button>
  );
}

// ✅ Always pair lazy with ErrorBoundary
function App() {
  return (
    <ErrorBoundary fallback={<RetryMessage />}>
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </ErrorBoundary>
  );
}

// ✅ List virtualization with react-window
import { FixedSizeList } from 'react-window';

const Row = memo(({ index, style, data }: RowProps) => (
  <div style={style} role="row" aria-rowindex={index + 1}>
    <span>{data[index].name}</span>
    <span>{data[index].price}</span>
  </div>
));

function ProductList({ items }: { items: Item[] }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      itemData={items}
      overscanCount={5}
      role="grid"
      aria-rowcount={items.length}
    >
      {Row}
    </FixedSizeList>
  );
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **React.lazy SSR**: Doesn't work with SSR — use `next/dynamic` or `@loadable/component` instead
- **Chunk granularity**: Too many small chunks → waterfall requests. Too few → no benefit. Aim for 50-150KB gzip per chunk
- **Virtualization accessibility**: Off-screen items don't exist in DOM → breaks screen readers. Add `aria-rowcount`/`aria-rowindex`
- **Variable-height items**: Require measurement → layout thrashing. Use `react-virtuoso` (auto-measures) or estimate heights
- **Virtualization threshold**: Overkill for <200 items. Profile first — simple list might be fast enough

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Not code-splitting at all | Initial JS bundle bloats → slow first interaction on mobile | At minimum: route-level splitting for every app |
| Lazy-loading the LCP image | Hero image is the largest visible element — lazy-loading delays LCP | Use `priority` (Next.js) or `loading="eager"` for LCP images |
| Virtualizing a 50-item list | Library overhead > rendering 50 DOM nodes directly | Only virtualize when list >500 items AND causing measured perf issues |
| No ErrorBoundary around Suspense | Network failure → white screen crash | Always wrap lazy components with ErrorBoundary + retry button |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "code splitting", "lazy loading", "list performance", "virtualization"
- → Nhớ đến: "Don't ship what you don't show"
- → Mở đầu trả lời: "Code splitting reduces initial bundle by loading code on demand — route-level splitting is the baseline, component-level for heavy features like charts and modals. For large lists, virtualization renders only visible items, keeping DOM node count constant regardless of data size. Both share the same principle: don't make the browser process what the user can't see."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [ES6 — Dynamic import](../01-javascript/07-es6-features.md) — `import()` syntax enables code splitting
- ➡️ Để hiểu: [Bundle Optimization](../06-browser-performance/03-bundle-optimization.md) — webpack analysis and tree shaking

---

### 3. Profiling, Concurrent Features & Measurement / Profiling, Concurrent & Đo Lường

> 🧠 **Memory Hook**: **"Profile → Identify → Fix → Verify"** — optimization without measurement is guessing

**Tại sao tồn tại? / Why does this exist?**

Developer intuition về performance thường sai. Component bạn nghĩ chậm thì nhanh,
component bạn không nghi ngờ thì gây 80% lag. Profiling cho data thay vì guessing.

→ **Why?** Vì React's rendering model là complex — re-render ≠ DOM update. Một component
re-render 1000 lần nhưng nếu output giống nhau, DOM không thay đổi → user không thấy lag.

→ **Why?** Vì user-facing metric (INP, LCP) mới quan trọng — không phải component render time.
Cần tools connect React internals → browser metrics → user experience.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Profiling giống **khám bệnh trước khi uống thuốc**: bác sĩ đo huyết áp, xét nghiệm máu, rồi
mới kê đơn. Nếu uống thuốc random (thêm memo random), có thể không hiệu quả hoặc gây tác dụng phụ.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
PROFILING WORKFLOW:

  1. IDENTIFY → React DevTools Profiler
     ├── Flamegraph: see component tree with render times
     ├── Ranked view: slowest components at top
     └── "Why did this render?": props? state? parent?

  2. MEASURE → Profiler API
     ├── actualDuration: time rendering CHANGED parts
     ├── baseDuration: time rendering WITHOUT memo
     └── If actual << base → memo is working

  3. FIX → Apply targeted optimization
     └── ONE change at a time, measure again

  4. VERIFY → Core Web Vitals
     ├── LCP < 2.5s (loading speed)
     ├── INP < 200ms (interaction responsiveness)
     └── CLS < 0.1 (visual stability)

CONCURRENT FEATURES — priority-based rendering:

  useTransition: wraps setState as non-urgent
  ───────────────────────────────────────────
  User types "react"  →  Input updates IMMEDIATELY (high priority)
                      →  Filter results update LATER (low priority)
                      →  UI stays responsive during heavy filtering

  useDeferredValue: returns "stale" value during heavy renders
  ──────────────────────────────────────────────────────────
  const deferredQuery = useDeferredValue(query);
  // Shows old results with opacity:0.7 while computing new ones
  // NO artificial delay like debounce — renders ASAP when idle
```

```tsx
// ✅ Profiler API — send render metrics to analytics
import { Profiler, ProfilerOnRenderCallback } from 'react';

const onRender: ProfilerOnRenderCallback = (
  id, phase, actualDuration, baseDuration, startTime, commitTime
) => {
  if (actualDuration > 16) { // > 1 frame budget
    performanceMonitor.report({
      component: id,
      phase,
      actual: actualDuration,
      base: baseDuration,
      memoSavings: baseDuration - actualDuration,
    });
  }
};

function App() {
  return (
    <Profiler id="Dashboard" onRender={onRender}>
      <Dashboard />
    </Profiler>
  );
}

// ✅ useTransition — keep UI responsive during heavy state update
function SearchPage() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)} // instant (high priority)
      />
      <div style={{ opacity: isPending ? 0.7 : 1 }}>
        <SearchResults query={deferredQuery} /> {/* deferred (low priority) */}
      </div>
    </div>
  );
}

// ✅ why-did-you-render — development debugging
// wdyr.ts (import FIRST in entry point)
if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, { trackAllPureComponents: true, trackHooks: true });
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Profile in production mode**: Dev mode double-renders (StrictMode), distorting measurements. Build with `--profile` flag
- **useTransition vs debounce**: Transition has no artificial delay — renders ASAP while staying responsive. Debounce adds fixed delay regardless of device speed
- **useDeferredValue vs useTransition**: Use `useTransition` when you control the `setState`. Use `useDeferredValue` when you receive the value as a prop
- **Bundle analysis tools**: `webpack-bundle-analyzer` for interactive treemap, `source-map-explorer` for production source maps
- **Performance budgets**: Set max bundle sizes per route (e.g., initial JS <200KB gzip) and enforce in CI

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Profiling in development mode | StrictMode double-renders distort measurements | Build with `--profile` for production profiling |
| Using debounce instead of useTransition for search | Debounce adds artificial delay; useTransition renders ASAP | useTransition = no delay, responsive during computation |
| "Re-render = slow" | Re-render (calling component fn) is cheap; DOM update is expensive. React diffs to minimize DOM changes | Only problematic when render creates expensive computation or excessive DOM mutations |
| Multiple changes at once, then measuring | Can't attribute improvement to specific change | One optimization at a time, measure before and after each |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "how to optimize slow React app", "profiling", "useTransition"
- → Nhớ đến: "Profile → Identify → Fix → Verify"
- → Mở đầu trả lời: "I'd start by measuring: run Lighthouse for Core Web Vitals, profile with React DevTools to identify slow components, then apply targeted fixes one at a time. For interaction responsiveness, useTransition marks state updates as non-urgent so the UI stays responsive during heavy computation — it's superior to debounce because it has no artificial delay."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Core Web Vitals — INP](../06-browser-performance/01-core-web-vitals.md) — target metrics for optimization
- ➡️ Để hiểu: [React 19 Compiler](./02-react-19-features.md) — automates most memoization decisions

---

## Interview Q&A / Hỏi Đáp Phỏng Vấn

### Q1: When should you use React.memo, and when does it NOT help? / Khi nào dùng React.memo, khi nào không? 🟢 Junior

**A:** Use React.memo when ALL three conditions are met: (a) component re-renders frequently with the same props, (b) render output is expensive (deep tree, complex SVG), and (c) props are referentially stable.

Memo does NOT help when: inline objects/functions as props create new references every render, the component consumes changing context, or children are passed as JSX (new element each render).

```tsx
// ❌ Memo useless — inline style creates new object every render
<MemoComponent style={{ color: 'red' }} />

// ✅ Memo works — props are referentially stable
const style = useMemo(() => ({ color: 'red' }), []);
<MemoComponent style={style} />
```

Giải thích tiếng Việt: Memo chỉ hiệu quả khi cả 3 điều kiện thỏa: re-render thường xuyên + render đắt + props ổn định reference. Inline objects/functions phá vỡ memo vì tạo ref mới mỗi render.

**💡 Interview Signal:**
- ✅ Strong: Lists all 3 conditions, gives specific example of memo failing (inline style), mentions React 19 Compiler making memo auto
- ❌ Weak: Only says "use memo when component re-renders a lot" without understanding reference stability

---

### Q2: How do you prevent unnecessary re-renders WITHOUT memo? / Ngăn re-render thua không cần memo? 🟡 Mid

**A:** Three architectural patterns are more effective than memo:

1. **State colocation**: Move state to the component that uses it → parent tree doesn't re-render
2. **Children as props**: `<Parent>{expensiveChildren}</Parent>` — children don't re-render when Parent's state changes because they're created by Parent's parent
3. **Context splitting**: Separate theme (rare updates) from cart (frequent updates) into different contexts

```tsx
// ✅ Composition: ExpensiveList doesn't re-render on scroll
function ScrollTracker({ children }: { children: ReactNode }) {
  const [scrollY, setScrollY] = useState(0);
  // scrollY changes but children are from PARENT scope → unaffected
  return <div>{children}</div>;
}

<ScrollTracker>
  <ExpensiveList />  {/* never re-renders from scroll! */}
</ScrollTracker>
```

Giải thích tiếng Việt: 3 pattern kiến trúc hiệu quả hơn memo: (1) Đặt state gần nơi dùng, (2) Truyền component qua children (children từ parent scope không bị ảnh hưởng), (3) Tách context theo tần suất thay đổi.

**💡 Interview Signal:**
- ✅ Strong: Explains all 3 patterns with code, mentions that architecture > memo shows senior thinking
- ❌ Weak: Jumps straight to "use React.memo" without considering composition

---

### Q3: Explain useTransition vs useDeferredValue. / Giải thích useTransition vs useDeferredValue. 🟡 Mid

**A:** Both mark work as non-urgent for concurrent rendering, but apply differently:

- **`useTransition`**: Wraps a **setState call** — you mark the update as non-urgent. Returns `[isPending, startTransition]`.
- **`useDeferredValue`**: Wraps a **value** — you get a "stale" version during heavy renders. Input: current value. Output: deferred value.

**Rule**: Use `useTransition` when you control the `setState`. Use `useDeferredValue` when you receive the value as a prop.

Both are superior to debounce: no artificial delay — React renders as fast as possible while staying responsive to user input.

Giải thích tiếng Việt: `useTransition` wrap setState, `useDeferredValue` wrap value. Dùng useTransition khi bạn kiểm soát setState, useDeferredValue khi nhận value qua prop. Cả hai hơn debounce vì không thêm delay giả — React render nhanh nhất có thể.

**💡 Interview Signal:**
- ✅ Strong: Gives clear decision rule (control setState vs receive as prop), compares to debounce
- ❌ Weak: Confuses the two or can't explain when to use which

---

### Q4: How do you profile React performance in production? / Profile React performance trên production? 🔴 Senior

**A:** Production builds strip the Profiler by default. Three approaches:

1. **Build with `--profile` flag**: Keeps Profiler API in production bundle. Use `<Profiler onRender>` to send render durations to analytics.
2. **Key metrics**: `actualDuration` (time rendering changed parts) vs `baseDuration` (time without memo). If actual << base → memo is effective.
3. **RUM via web-vitals**: `web-vitals` library reports INP, LCP, CLS from real users. Correlate React render times with user-facing metrics.

```tsx
// Production: report slow renders to analytics
<Profiler id="ProductList" onRender={(id, phase, actual) => {
  if (actual > 16) analytics.report({ component: id, duration: actual });
}}>
  <ProductList />
</Profiler>
```

Supplement with browser Performance API, Lighthouse CI for automated checks, and webpack-bundle-analyzer for bundle composition.

Giải thích tiếng Việt: Production build xóa Profiler mặc định — build với `--profile` để giữ. Dùng `actualDuration` vs `baseDuration` để đo hiệu quả memo. Kết hợp web-vitals RUM cho metrics thực tế, Lighthouse CI cho checks tự động.

**💡 Interview Signal:**
- ✅ Strong: Knows `--profile` flag, explains actual vs base duration, connects to RUM/Core Web Vitals
- ❌ Weak: Only knows dev profiling, can't explain production measurement

---

### Q5: Design a performance optimization strategy for a slow React dashboard. / Thiết kế chiến lược tối ưu cho React dashboard chậm. 🔴 Senior

**A:** Systematic 7-step approach:

1. **Measure**: Lighthouse + Core Web Vitals (LCP, INP, CLS). React DevTools Profiler for component-level data
2. **Bundle**: `webpack-bundle-analyzer` → replace heavy deps (moment→dayjs), code-split by route, lazy-load charts/modals
3. **Rendering**: Profiler → identify hot components. Apply: state colocation, context splitting, composition. Memo as last resort
4. **Lists**: Virtualize any list >500 items (react-window for fixed heights, react-virtuoso for dynamic)
5. **Data**: Server Components for static content. TanStack Query for client-side caching with stale-while-revalidate
6. **Assets**: next/image for automatic format/size optimization. `priority` for LCP image. Self-host and subset fonts
7. **Prevent regression**: Performance budgets in CI (bundlesize/Lighthouse CI). Monitor RUM with web-vitals

**Key interview point**: Start with "I would measure first" — this shows maturity. Then work top-down: bundle → rendering → lists → assets → prevention.

Giải thích tiếng Việt: 7 bước có hệ thống: Đo → Bundle → Rendering → Lists → Data → Assets → Ngăn hồi quy. Bắt đầu bằng "tôi sẽ đo trước" thể hiện sự trưởng thành. Mỗi bước có tool và metric cụ thể.

**💡 Interview Signal:**
- ✅ Strong: Systematic approach starting with measurement, specific tools at each step, mentions prevention (CI budgets)
- ❌ Weak: Lists random optimizations without prioritization or measurement

---

## Interview Q&A Summary / Tổng Kết Q&A

| # | Topic | Difficulty | Key Concept |
|---|-------|-----------|-------------|
| Q1 | React.memo conditions | 🟢 Junior | 3 conditions: frequent + expensive + stable refs |
| Q2 | Re-render prevention without memo | 🟡 Mid | State colocation, composition, context split |
| Q3 | useTransition vs useDeferredValue | 🟡 Mid | Control setState vs receive value; no delay > debounce |
| Q4 | Production profiling | 🔴 Senior | --profile flag, actual vs base duration, RUM |
| Q5 | Optimization strategy | 🔴 Senior | Measure → Bundle → Render → Lists → Assets → Prevent |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"How do you approach React performance optimization?"**

**30 giây đầu — mở đầu lý tưởng:**
1. "I always start by measuring — running Lighthouse for Core Web Vitals and React DevTools Profiler to identify the actual bottleneck, because optimization without data is just guessing."
2. "The most effective optimizations are usually architectural, not API-level: moving state closer to where it's used, using composition to prevent parent re-renders from cascading, and splitting contexts by update frequency."
3. "For initial load, I ensure route-level code splitting as a baseline and virtualize any list over 500 items. For interaction responsiveness, useTransition marks heavy updates as non-urgent, keeping typing and clicking responsive."
4. "The one anti-pattern I always watch for is premature memo — adding React.memo without stable props is a no-op that adds complexity. In React 19, the Compiler handles memoization automatically, so I focus on architecture instead."

---

## Self-Check / Tự Kiểm Tra ⚡ (Đóng tài liệu lại trước khi làm)

- [ ] **Retrieval**: Viết 3 architectural patterns ngăn re-render từ trí nhớ — mỗi cái 1 câu + ví dụ.
- [ ] **Visual**: Vẽ diagram component tree khi state colocation di chuyển state từ App xuống MouseTracker — components nào tránh được re-render?
- [ ] **Application**: ProductList có 10,000 items, filter input lag 200ms. Profiler cho thấy filter function chậm, không phải children re-render. Bạn fix thế nào? Viết code.
- [ ] **Debug**: `React.memo(Chart)` nhưng Chart vẫn re-render mỗi frame. Props là `{ data, onClick }`. Nguyên nhân? Fix?
- [ ] **Teach**: Giải thích tại sao useTransition tốt hơn debounce cho search, bằng ví dụ "nhà hàng có bồi bàn thông minh vs bộ hẹn giờ cứng".

💬 **Feynman Prompt:** Giải thích tại sao thêm React.memo vào mọi component không phải giải pháp tốt — khi nào memo làm performance tệ hơn?

🔁 **Spaced Repetition reminder:** Review this file again on 2026-03-22, then 2026-03-26, then 2026-04-02.
