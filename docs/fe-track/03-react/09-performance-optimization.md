# Performance Optimization / Toi Uu Hieu Nang
## React - Chapter 9

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **See also**: [React Fundamentals](./01-react-fundamentals.md) | [Hooks Deep Dive](./03-hooks-deep-dive.md) | [Browser Performance](../../fe-track/06-browser-performance/01-core-web-vitals.md)

[← Previous](./08-react-patterns-advanced.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./10-modern-react-features.md)

---

## Tong Quan / Overview

**English:** This chapter covers React performance optimization techniques for interview preparation. It focuses on when and why to optimize, not just how — because premature optimization is the most common mistake interviewers probe for.

**Tieng Viet:** Chuong nay bao gom cac ky thuat toi uu hieu nang React cho phong van. Trong tam la khi nao va tai sao can toi uu, khong chi la cach lam — vi toi uu som la loi pho bien nhat ma interviewer hay hoi.

## Table of Contents / Muc Luc
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
13. [Cau Hoi Phong Van / Interview Q&A](#cau-hoi-phong-van--interview-qa)

---

## Performance Mental Model

### Giai thich / Explanation

**English:** Measure first, optimize bottlenecks, and validate user-perceived wins. Never optimize without profiling data.

**Tieng Viet:** Do dac truoc, toi uu nut nghen, va xac minh cai thien nguoi dung cam nhan duoc. Khong bao gio toi uu khi chua co du lieu profiling.

### Key Points / Y Chinh
- **RAIL model applies to React**: Response (<100ms), Animation (<16ms/frame), Idle (use idle time for deferred work), Load (<1s for critical path). Trong React, moi interaction nen render xong trong 100ms de nguoi dung cam thay "instant".
- **Rendering != DOM update**: React render phase (calling your component function) is cheap; the commit phase (actual DOM mutations) is expensive. Nhieu nguoi nham lan giua hai phase nay — re-render khong phai luc nao cung xau.
- **The biggest win is usually architectural**: Moving state down, lifting state up correctly, or splitting contexts will outperform any amount of `memo()`. Cai thien kien truc luon mang lai hieu qua lon hon bat ky ky thuat memo nao.
- **Profile in production mode**: Development mode adds extra checks (double-rendering in StrictMode, prop validation) that distort measurements. Luon do hieu nang o production build.
- **Core Web Vitals are your target metrics**: LCP, FID/INP, CLS map directly to user experience. Interviewers expect you to connect React optimization to these metrics.
- **React DevTools Profiler > console.time**: The Profiler shows component-level render times, commit frequencies, and what triggered each render. console.time chi do tong thoi gian, khong cho biet component nao gay cham.
- **Avoid premature optimization trap in interviews**: When asked "how to optimize React", start with "I would first measure to identify the bottleneck" — this shows maturity. Bat dau voi "toi se do dac truoc" the hien su truong thanh.
- **80/20 rule**: Typically 20% of components cause 80% of performance issues. Focus on hot paths — lists, frequently updating components, heavy computations.

### Vi du / Example
```tsx
// Profile before optimizing: wrap suspicious subtrees
import { Profiler, ProfilerOnRenderCallback } from 'react';

const onRender: ProfilerOnRenderCallback = (id, phase, actualDuration) => {
  if (actualDuration > 16) {
    console.warn(`Slow render: ${id} took ${actualDuration.toFixed(1)}ms (${phase})`);
  }
};

function App() {
  return (
    <Profiler id="Dashboard" onRender={onRender}>
      <Dashboard />
    </Profiler>
  );
}
```

### Interview Notes / Ghi Chu Phong Van
- Always frame performance answers with "measure first, then optimize" — interviewers penalize premature optimization.
- Show awareness that React's reconciliation is already optimized; your job is to avoid making it do unnecessary work.
- Connect rendering performance to user-facing metrics (INP, LCP) rather than abstract benchmarks.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md)

## React.memo Correct Usage

### Giai thich / Explanation

**English:** `React.memo` is a higher-order component that skips re-rendering when props haven't changed (shallow comparison by default). It only works when props are referentially stable.

**Tieng Viet:** `React.memo` la HOC bo qua re-render khi props khong doi (so sanh nong mac dinh). Chi hieu qua khi props on dinh ve reference.

### Key Points / Y Chinh
- **When to use memo**: Only wrap components that (a) render often with the same props, (b) have expensive render output (deep trees, complex calculations), AND (c) receive referentially stable props. Neu thieu bat ky dieu kien nao, memo co the lam code phuc tap ma khong co loi.
- **Shallow comparison pitfall**: Objects/arrays created inline in JSX (`style={{ color: 'red' }}`, `items={data.filter(...)}`) create new references every render, defeating memo entirely. Day la loi pho bien nhat.
- **Custom comparator trade-off**: `memo(Component, areEqual)` lets you provide a custom comparison, but deep comparison can be more expensive than just re-rendering. Chi dung khi ban biet chinh xac field nao can so sanh.
- **Memo does NOT prevent re-render from context**: If the component consumes a context that changes, memo won't help — it only checks props. Memo khong chan re-render tu context thay doi.
- **Children prop breaks memo**: `<Memoized><Child /></Memoized>` — the `children` prop is a new JSX element each render, so memo is useless. Truyen children qua render prop hoac dung composition pattern.
- **React Compiler (React Forget) will auto-memoize**: In React 19+, the compiler automatically adds memoization. Manual memo will become less necessary, but understanding the concept is still important for interviews.
- **Memo adds memory overhead**: Each memoized component stores the previous props for comparison. In lists with thousands of items, this memory cost adds up. Can nhac giua memory va CPU trade-off.
- **Test memo effectiveness with Profiler**: Before and after wrapping with memo, compare render counts and durations in React DevTools. If no improvement, remove memo to keep code simple.

### Vi du / Example
```tsx
import { memo, useCallback } from 'react';

// Good: stable primitive props
const ExpensiveChart = memo(function ExpensiveChart({ data, width }: {
  data: readonly number[];
  width: number;
}) {
  // Imagine expensive SVG calculation here
  return <svg width={width}>{/* ... */}</svg>;
});

// Parent must stabilize the data reference
function Dashboard() {
  const [filter, setFilter] = useState('all');
  // useMemo ensures data reference only changes when rawData or filter changes
  const chartData = useMemo(() => processData(rawData, filter), [rawData, filter]);

  return <ExpensiveChart data={chartData} width={800} />;
}
```

### Interview Notes / Ghi Chu Phong Van
- Explain that memo is shallow by default, and why that matters for objects/arrays.
- Mention that memo without stabilizing props is a code smell, not an optimization.
- Senior-level: discuss how React Compiler will make manual memo obsolete.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md)

## useMemo and useCallback Strategy

### Giai thich / Explanation

**English:** `useMemo` caches computed values; `useCallback` caches function references. Both exist to maintain referential stability, not for raw speed.

**Tieng Viet:** `useMemo` cache gia tri tinh toan; `useCallback` cache tham chieu ham. Ca hai ton tai de giu on dinh reference, khong phai de tang toc do tinh toan.

### Key Points / Y Chinh
- **useMemo is NOT free**: It adds overhead (dependency comparison + storing previous value). Only use when the computation is genuinely expensive (>1ms) OR the result is passed as a prop to a memoized child. useMemo khong mien phi — no them chi phi so sanh dependencies.
- **useCallback is useMemo for functions**: `useCallback(fn, deps)` === `useMemo(() => fn, deps)`. Its primary purpose is stabilizing function props for memoized children, NOT avoiding function creation.
- **Dependency array mistakes cause stale closures**: Missing a dependency means the callback captures old values. ESLint's `exhaustive-deps` rule is your safety net — never disable it without understanding why. Thieu dependency gay ra stale closure.
- **When NOT to use**: Simple computations (filtering a 50-item list), functions only used inside the same component (no memoized child), or values that change every render anyway. Dung thua gay phuc tap khong can thiet.
- **Reference stability chain**: For memo to work, ALL props must be stable. One unstable prop (e.g., inline callback) breaks the entire chain. Mot prop khong on dinh pha vo toan bo chuoi memo.
- **Expensive computation threshold**: Use `console.time` to measure. If computation takes <1ms, the memoization overhead may exceed the savings. Nguong tinh toan dat ~ >1ms.
- **Object pattern**: When passing multiple related values, prefer a single memoized object over multiple memoized primitives: `useMemo(() => ({ x, y, z }), [x, y, z])`. Gom nhieu gia tri vao 1 object memo.
- **React 19 React Compiler auto-detects**: The compiler analyzes your code and automatically inserts useMemo/useCallback where beneficial. Writing clean code without manual memoization will be the recommended approach going forward.

### Vi du / Example
```tsx
import { useMemo, useCallback, memo } from 'react';

function SearchResults({ query, items }: { query: string; items: Item[] }) {
  // useMemo: expensive filtering + sorting on large dataset
  const filtered = useMemo(() => {
    return items
      .filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.relevance - b.relevance);
  }, [query, items]);

  // useCallback: stabilize handler passed to memoized child
  const handleSelect = useCallback((id: string) => {
    analytics.track('select', { id, query });
    navigate(`/item/${id}`);
  }, [query]);

  return <MemoizedList items={filtered} onSelect={handleSelect} />;
}

const MemoizedList = memo(function ItemList({ items, onSelect }: Props) {
  return <ul>{items.map(item => (
    <li key={item.id} onClick={() => onSelect(item.id)}>{item.name}</li>
  ))}</ul>;
});
```

### Interview Notes / Ghi Chu Phong Van
- Key insight: useMemo/useCallback exist for referential stability, not computation speed.
- Common trap: interviewers ask "should you useMemo everything?" — answer is no, explain the overhead.
- Show awareness of the full chain: useMemo/useCallback only help if the consumer (child) is also memoized.

Cross-reference: [Hooks](./03-hooks-deep-dive.md)

## Avoiding Unnecessary Re-renders

### Giai thich / Explanation

**English:** Most performance problems come from unnecessary re-renders cascading through the tree. The solution is usually architectural, not memoization.

**Tieng Viet:** Hau het van de hieu nang den tu re-render khong can thiet lan truyen qua tree. Giai phap thuong la kien truc, khong phai memo.

### Key Points / Y Chinh
- **State colocation**: Move state as close as possible to where it's used. A setState at the root re-renders the entire tree; a setState in a leaf only re-renders that leaf. Dat state gan noi su dung nhat.
- **Component composition ("children as props" pattern)**: Pass the expensive subtree as `children` so the parent can re-render without affecting it. Vi du: `<ScrollTracker><ExpensiveList /></ScrollTracker>` — ExpensiveList won't re-render when scroll position changes.
- **Context splitting**: A single large context that holds both frequently-changing values (mouse position) and rarely-changing values (theme) will re-render ALL consumers on every change. Split into separate contexts. Tach context theo tan suat thay doi.
- **Context value stabilization**: Always memoize the context value object: `useMemo(() => ({ user, permissions }), [user, permissions])`. Without this, every provider render creates a new object reference. Luon memo gia tri context.
- **Key-based remounting vs. re-rendering**: Changing `key` forces unmount + remount (expensive). Only use when you truly need to reset internal state. Key thay doi = unmount + mount moi, khong phai re-render.
- **Extracting frequently-updating parts**: If a timer updates every second, extract it into its own component so the parent tree isn't re-rendered every second. Trich xuat phan cap nhat thuong xuyen thanh component rieng.
- **useRef for values that don't need re-render**: Store mutable values (timers, previous values, DOM refs) in `useRef` instead of `useState` to avoid triggering re-renders. Dung useRef cho gia tri khong can render lai.
- **Batch updates**: React 18+ automatically batches all state updates (including async ones). In older versions, only event handlers were batched. Hieu ve batching giup tranh re-render thua.

### Vi du / Example
```tsx
// BAD: All children re-render when position changes
function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}>
      <Cursor position={mousePos} />
      <ExpensiveNavigation />  {/* re-renders on every mouse move! */}
      <ExpensiveContent />     {/* re-renders on every mouse move! */}
    </div>
  );
}

// GOOD: Isolate the fast-changing state
function App() {
  return (
    <div>
      <MouseTracker />          {/* Only this re-renders on mouse move */}
      <ExpensiveNavigation />   {/* Never re-renders from mouse move */}
      <ExpensiveContent />
    </div>
  );
}

function MouseTracker() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}>
      <Cursor position={mousePos} />
    </div>
  );
}
```

### Interview Notes / Ghi Chu Phong Van
- Lead with composition patterns before reaching for memo — this shows architectural thinking.
- "Move state down" and "lift content up" are the two most powerful patterns — explain both with examples.
- Explain the difference between re-render (React calling your function) and DOM update (committing changes).

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md)

## Code Splitting with lazy and Suspense

### Giai thich / Explanation

**English:** Code splitting reduces initial bundle size by loading code on demand. `React.lazy` + `Suspense` make this declarative.

**Tieng Viet:** Code splitting giam kich thuoc bundle ban dau bang cach tai code theo yeu cau. `React.lazy` + `Suspense` lam viec nay khai bao (declarative).

### Key Points / Y Chinh
- **Route-level splitting is the baseline**: Every route should be a lazy-loaded chunk. This is the highest-impact, lowest-effort optimization. Tach theo route la muc toi thieu.
- **Component-level splitting for heavy features**: Modals, charts, rich text editors, and date pickers are good candidates — they're large but not needed immediately. Tach component nang nhu modal, chart, editor.
- **Suspense fallback UX matters**: A blank page during loading is worse than no splitting. Use skeleton screens, not spinners, for content areas. Always match the fallback layout to the loaded content to avoid layout shift (CLS). Fallback nen la skeleton, khong phai spinner.
- **Prefetching strategies**: Preload chunks on hover (`onMouseEnter`), on route match, or during idle time with `requestIdleCallback`. This hides loading latency. Tai truoc khi hover hoac khi idle.
- **Named exports need a wrapper**: `React.lazy` only supports default exports. For named exports, create a re-export file: `export { MyComponent as default } from './MyComponent'`. lazy chi ho tro default export.
- **Error boundaries are required for production**: If the chunk fails to load (network error), Suspense won't catch it. Wrap lazy components with an ErrorBoundary that shows a retry button. Phai co ErrorBoundary de xu ly loi tai chunk.
- **SSR limitation**: `React.lazy` doesn't support SSR natively. For SSR apps (Next.js), use `next/dynamic` or the `@loadable/component` library instead. lazy khong ho tro SSR — dung next/dynamic.
- **Granularity trade-off**: Too many small chunks create waterfall requests; too few large chunks negate the benefit. Aim for chunks between 50KB-150KB gzipped. Qua nhieu chunk nho tao waterfall; qua it chunk lon khong co loi.

### Vi du / Example
```tsx
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Route-level splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

// Prefetch on hover
const ChartModule = lazy(() => import('./components/Chart'));
function ChartButton() {
  const prefetch = () => { import('./components/Chart'); }; // triggers chunk load
  return (
    <button onMouseEnter={prefetch} onClick={() => setShowChart(true)}>
      Show Chart
    </button>
  );
}

// Always pair with ErrorBoundary
function App() {
  return (
    <ErrorBoundary fallback={<RetryMessage />}>
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </ErrorBoundary>
  );
}
```

### Interview Notes / Ghi Chu Phong Van
- Distinguish route-level vs. component-level splitting and when each is appropriate.
- Mention the prefetching pattern — this shows you think about perceived performance, not just bundle size.
- For SSR questions, pivot to `next/dynamic` or `@loadable/component`.

Cross-reference: [Patterns](./08-react-patterns-advanced.md)

## List Virtualization

### Giai thich / Explanation

**English:** Virtualization renders only the visible items in a long list, keeping DOM node count constant regardless of data size. Essential for lists with 1000+ items.

**Tieng Viet:** Virtualization chi render cac item hien thi tren man hinh, giu so luong DOM node khong doi bat ke data lon bao nhieu. Bat buoc cho danh sach 1000+ item.

### Key Points / Y Chinh
- **DOM nodes are the bottleneck**: A list of 10,000 items means 10,000+ DOM nodes, which slows layout, paint, and memory. Virtualization keeps only ~20-50 nodes in the DOM at any time. DOM node la nut nghen — virtualization giu chi 20-50 node.
- **react-window vs react-virtuoso**: `react-window` (by Brian Vaughn, React team) is lightweight (~6KB) but requires fixed or known item heights. `react-virtuoso` handles dynamic heights automatically but is larger (~15KB). Chon react-window cho item co dinh, react-virtuoso cho item dong.
- **Variable height items are hard**: If items have different heights, the virtualizer needs to measure them. This causes layout thrashing. Solutions: estimate heights upfront, measure after first render, or use CSS `contain: strict`. Item cao khac nhau can do luong, gay layout thrash.
- **Scroll restoration**: When navigating away and back, restore the scroll position. Libraries like `react-virtuoso` handle this; with `react-window`, you need to save/restore `scrollOffset` manually. Luu va khoi phuc vi tri scroll khi di chuyen trang.
- **Search/filter with virtualization**: Filtering a virtualized list requires resetting the scroll position and recalculating the item count. Don't forget to scroll to top on filter change. Khi filter, reset scroll ve dau.
- **Accessibility**: Virtualized lists can break screen readers because off-screen items don't exist in the DOM. Add `aria-rowcount`, `aria-rowindex`, and ensure keyboard navigation works. Virtualization co the pha vo screen reader — can them aria attributes.
- **Overscan count trade-off**: Rendering a few extra items above and below the viewport (overscan) prevents blank flashes during fast scrolling but increases DOM node count. 3-5 items overscan is typical. Overscan 3-5 item tranh trang trang khi scroll nhanh.
- **Alternative: pagination or infinite scroll**: For some UIs, pagination is simpler and more accessible than virtualization. Virtualization shines for "browse/scan" patterns; pagination is better for "search/find" patterns. Pagination don gian hon va accessible hon cho nhieu truong hop.

### Vi du / Example
```tsx
import { FixedSizeList as List } from 'react-window';

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: Item[];
}

const Row = memo(function Row({ index, style, data }: RowProps) {
  const item = data[index];
  return (
    <div style={style} role="row" aria-rowindex={index + 1}>
      <span>{item.name}</span>
      <span>{item.price}</span>
    </div>
  );
});

function ProductList({ items }: { items: Item[] }) {
  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={50}         // fixed row height
      itemData={items}
      overscanCount={5}
      role="grid"
      aria-rowcount={items.length}
    >
      {Row}
    </List>
  );
}
```

### Interview Notes / Ghi Chu Phong Van
- Know the threshold: virtualization is overkill for <200 items — profile first.
- Mention accessibility pitfalls; this differentiates senior candidates.
- Compare react-window (fixed heights, small) vs react-virtuoso (dynamic heights, larger) and when to pick each.

## Bundle Analysis Workflow

### Giai thich / Explanation

**English:** Bundle analysis identifies what's actually in your JavaScript bundles, finds unexpectedly large dependencies, and guides code splitting decisions.

**Tieng Viet:** Bundle analysis xac dinh nhung gi thuc su nam trong JavaScript bundle, tim cac dependency lon bat ngo, va huong dan quyet dinh code splitting.

### Key Points / Y Chinh
- **webpack-bundle-analyzer is the standard tool**: It generates an interactive treemap showing each module's size (stat, parsed, gzipped). Run with `ANALYZE=true next build` in Next.js. webpack-bundle-analyzer tao treemap tuong tac hien thi kich thuoc module.
- **Source map explorer for production**: Unlike bundle analyzer (which needs webpack stats), `source-map-explorer` works with any source map and shows the actual production bundle composition. Dung source-map-explorer khi khong co webpack stats.
- **Common culprits**: moment.js (300KB+ with all locales — switch to dayjs/date-fns), lodash (import specific functions, not the whole library), icon libraries (import individual icons, not the full set). Cac thu pham pho bien: moment.js, lodash, icon libraries.
- **Tree shaking requirements**: ESM (`import/export`) is required; CommonJS (`require`) cannot be tree-shaken. Check that your dependencies ship ESM builds. Ensure `sideEffects: false` in package.json. Tree shaking can ESM — CommonJS khong the tree-shake.
- **Import cost awareness**: Use the "Import Cost" VS Code extension to see the size of each import inline. Set a team budget: warn at 50KB, error at 100KB for any single import. Dung extension Import Cost de thay kich thuoc import.
- **Dynamic import for optional features**: Features like PDF export, chart rendering, or admin panels that only 10% of users need should be dynamically imported. Day la low-hanging fruit. Dynamic import cho feature chi 10% user can.
- **Duplicate dependency detection**: Multiple versions of the same library (e.g., two versions of `lodash`) inflate bundles. Use `npm ls <package>` or the analyzer to detect duplicates, then resolve with npm `overrides`/`resolutions`. Phat hien duplicate dependency bang npm ls.
- **Set a performance budget**: Define maximum bundle sizes per route (e.g., initial JS <200KB gzipped) and enforce in CI with tools like `bundlesize` or Lighthouse CI. Dat performance budget va kiem tra trong CI.

### Vi du / Example
```bash
# Next.js bundle analysis
ANALYZE=true npm run build

# Source map explorer
npx source-map-explorer build/static/js/*.js

# Check for duplicate dependencies
npm ls lodash
# If multiple versions found:
# Add to package.json: "overrides": { "lodash": "4.17.21" }

# Import specific functions (tree-shakeable)
# BAD:  import _ from 'lodash'           // 70KB
# GOOD: import debounce from 'lodash/debounce'  // 2KB
```

### Interview Notes / Ghi Chu Phong Van
- Demonstrate a workflow: analyze → identify largest modules → apply targeted fix (lazy load, replace library, tree-shake).
- Mention specific numbers (moment.js is 300KB, dayjs is 2KB) to show real-world experience.
- Performance budgets in CI show you think about preventing regressions, not just fixing current issues.

## Profiler API and DevTools

### Giai thich / Explanation

**English:** The React Profiler (both the API and DevTools panel) measures render performance at the component level, showing what rendered, why, and how long it took.

**Tieng Viet:** React Profiler (ca API va DevTools) do hieu nang render o cap component, hien thi cai gi rendered, tai sao, va mat bao lau.

### Key Points / Y Chinh
- **Profiler API (`<Profiler>`)**: Wraps a subtree and calls `onRender(id, phase, actualDuration, baseDuration, startTime, commitTime)`. Use `actualDuration` (time spent rendering changed components) vs `baseDuration` (time to render entire subtree without memo). actualDuration la thoi gian thuc te; baseDuration la thoi gian khong co memo.
- **DevTools "Why did this render?" feature**: Enable "Record why each component rendered" in DevTools settings. It shows whether re-render was caused by props change, state change, or parent re-render. Bat "Record why each component rendered" de biet nguyen nhan re-render.
- **Flamegraph vs Ranked view**: Flamegraph shows the component tree with render times (width = duration). Ranked view sorts by render duration, so the slowest components are at the top. Ranked view sap xep theo thoi gian, tien cho tim component cham nhat.
- **Highlight updates setting**: Enable "Highlight updates when components render" to visually see which parts of the UI re-render during interactions. Blue borders = fast, yellow/red = slow. Bat highlight updates de thay truc quan component nao re-render.
- **Production profiling**: Production builds strip the Profiler by default. To profile production, build with `--profile` flag: `react-scripts build --profile` or set `reactStrictMode: false` in Next.js config. Profile production bang --profile flag.
- **Interaction tracing (deprecated but concept matters)**: The idea of tracing a user interaction through the render pipeline is now handled by browser Performance API and React's `useTransition`. Hieu khai niem trace interaction du API cu da deprecated.
- **Commit frequency analysis**: If a component commits many times per second (e.g., 60 times for a mouse move), that's a signal to debounce or move state. Check the "commits" selector in DevTools. Neu component commit nhieu lan/giay, can debounce hoac chuyen state.
- **Compare before/after**: Always profile before optimizing, apply one change, then profile again. Multiple changes at once make it impossible to attribute improvement. Luon profile truoc va sau, chi thay doi mot thu moi lan.

### Vi du / Example
```tsx
import { Profiler, ProfilerOnRenderCallback } from 'react';

const logRender: ProfilerOnRenderCallback = (
  id,           // "ProductList"
  phase,        // "mount" | "update"
  actualDuration,  // ms spent rendering changed parts
  baseDuration,    // ms to render entire subtree (no memo)
  startTime,
  commitTime
) => {
  // Send to analytics in production
  if (actualDuration > 16) {
    performanceMonitor.reportSlowRender({
      component: id,
      phase,
      duration: actualDuration,
      timestamp: commitTime,
    });
  }
};

function App() {
  return (
    <Profiler id="ProductList" onRender={logRender}>
      <ProductList />
    </Profiler>
  );
}
```

### Interview Notes / Ghi Chu Phong Van
- Know the difference between `actualDuration` and `baseDuration` — this is a common interview question.
- Mention production profiling (most candidates only know dev profiling).
- Show a workflow: Profiler → identify slow component → apply optimization → verify improvement.

## why-did-you-render

### Giai thich / Explanation

**English:** `@welldone-software/why-did-you-render` monkey-patches React to log when components re-render unnecessarily (same props/state producing the same output).

**Tieng Viet:** `why-did-you-render` monkey-patch React de log khi component re-render khong can thiet (cung props/state tao ra cung output).

### Key Points / Y Chinh
- **Setup**: Import before React in your entry point (`wdyr.ts` imported first). Assign `Component.whyDidYouRender = true` to opt-in specific components, or set `trackAllPureComponents: true` globally. Import truoc React va danh dau component can theo doi.
- **What it detects**: (1) Re-renders where props are deep-equal but referentially different (new object/array every render). (2) State updates that produce the same state. (3) Hooks that return new references unnecessarily. Phat hien 3 loai re-render thua.
- **Development only**: Never ship this in production — it adds significant overhead and console noise. Gate behind `process.env.NODE_ENV === 'development'`. Chi dung trong development, khong bao gio ship len production.
- **Common findings**: Inline object props (`style={{ margin: 10 }}`), functions created in render, context value objects not memoized, and selector functions returning new arrays. Cac loi pho bien: inline object, function tao trong render, context value khong memo.
- **Pairs with React.memo**: After wrapping a component with memo, use WDYR to verify that memo is actually preventing re-renders. If WDYR still logs updates, your props aren't stable. Dung WDYR de kiem tra memo co hoat dong khong.
- **Hook tracking**: WDYR can track hooks — it shows which hook (by index) caused a re-render and whether the new value is deep-equal to the old one. Cuc ky huu ich cho debug useEffect va useMemo. WDYR theo doi hook — chi ra hook nao gay re-render.
- **Console output interpretation**: WDYR logs show "prev" and "next" values side by side. If they look identical, the issue is referential inequality. If they differ, the re-render is legitimate. Log hien thi prev/next — neu giong nhau la van de reference.
- **Alternative in React 19+**: The React Compiler makes WDYR largely unnecessary by automatically memoizing. But for React 18 codebases, WDYR remains the best debugging tool for unnecessary re-renders.

### Vi du / Example
```tsx
// wdyr.ts — must be imported FIRST in your app entry point
import React from 'react';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,  // track all memo/PureComponent
    trackHooks: true,              // track hook-caused re-renders
    logOnDifferentValues: false,   // only log unnecessary re-renders
  });
}

// Mark specific components for tracking
function MyExpensiveComponent(props: Props) { /* ... */ }
MyExpensiveComponent.whyDidYouRender = true;
```

### Interview Notes / Ghi Chu Phong Van
- Present WDYR as a debugging tool for development, not a production solution.
- Explain the difference between "referentially different but deep-equal" vs "actually different" — this is the core concept.
- Mention that React Compiler will reduce the need for WDYR in future codebases.

## Concurrent Rendering Benefits

### Giai thich / Explanation

**English:** Concurrent rendering (React 18+) allows React to interrupt long renders, prioritize urgent updates, and keep the UI responsive during heavy computation.

**Tieng Viet:** Concurrent rendering (React 18+) cho phep React gian doan render dai, uu tien update gap, va giu UI phan hoi khi tinh toan nang.

### Key Points / Y Chinh
- **Automatic batching**: React 18 batches ALL state updates (including inside setTimeout, Promises, and native event handlers), reducing re-renders. In React 17, only React event handlers were batched. React 18 batch tat ca state updates — React 17 chi batch trong event handler.
- **useTransition for non-urgent updates**: Wrap expensive state updates in `startTransition(() => setState(...))` to mark them as non-urgent. React will keep the UI responsive by yielding to higher-priority updates (typing, clicking). Dung useTransition cho update khong gap — React se uu tien input cua user.
- **useDeferredValue for expensive derived values**: `const deferredQuery = useDeferredValue(query)` gives you a "stale" value during heavy renders. Show the old results while computing new ones, avoiding UI freeze. useDeferredValue tra ve gia tri "cu" trong khi tinh toan gia tri moi.
- **Suspense for data fetching**: Combined with libraries like React Query/SWR or React's `use()` hook, Suspense provides declarative loading states without manual `isLoading` boolean management. Suspense + data fetching library = khai bao loading state.
- **Transitions vs debouncing**: `startTransition` is better than `debounce` for search-as-you-type because it doesn't add artificial delay — it renders as fast as possible while staying responsive. Transition khong them delay nhu debounce — render nhanh nhat co the.
- **Concurrent mode requirements**: Components must be pure (no side effects during render), idempotent (same input = same output), and resilient to being called multiple times. StrictMode double-renders to catch violations. Component can pure, idempotent, va chiu duoc goi nhieu lan.
- **isPending for transition feedback**: `const [isPending, startTransition] = useTransition()` gives you `isPending` to show a subtle loading indicator (opacity change, progress bar) during long transitions. isPending cho phep hien thi loading indicator tinh te.
- **Streaming SSR with Suspense**: Concurrent features enable streaming HTML from the server, sending the shell immediately and filling in Suspense boundaries as data loads. This dramatically improves TTFB and LCP. Streaming SSR gui HTML shell truoc, dien Suspense boundaries sau.

### Vi du / Example
```tsx
import { useState, useTransition, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  // Typing updates immediately (high priority)
  // Filter results update is deferred (low priority)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);  // urgent: update input immediately
  };

  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <input value={query} onChange={handleChange} />
      <div style={{ opacity: query !== deferredQuery ? 0.7 : 1 }}>
        <SearchResults query={deferredQuery} />
      </div>
    </div>
  );
}
```

### Interview Notes / Ghi Chu Phong Van
- Explain the mental model: urgent updates (typing) vs transitions (filtering results).
- Know the difference between useTransition (wraps the update) and useDeferredValue (wraps the value).
- Explain why startTransition is superior to debounce: no artificial delay, works with React's scheduler.

## Server Components for Performance

### Giai thich / Explanation

**English:** React Server Components (RSC) run on the server and send rendered output (not component code) to the client, eliminating JavaScript bundle size for those components.

**Tieng Viet:** React Server Components (RSC) chay tren server va gui output da render (khong phai code component) cho client, loai bo JavaScript bundle cho cac component do.

### Key Points / Y Chinh
- **Zero client-side JS**: Server Components don't add any JavaScript to the client bundle. A 50KB markdown parser used only in a Server Component costs 0KB on the client. Server Component khong them JS nao vao client bundle.
- **Direct database/API access**: Server Components can directly query databases, read files, or call internal APIs without exposing credentials or creating API endpoints. Saves an entire network round-trip. Truy cap truc tiep DB/API khong can endpoint.
- **When to use Client vs Server**: Use Server Components for static content, data fetching, and heavy dependencies. Use Client Components for interactivity (useState, useEffect, event handlers, browser APIs). Server = static/data; Client = interactive/browser API.
- **Serialization boundary**: Props passed from Server to Client Components must be serializable (no functions, classes, or Date objects). This is the "use client" boundary. Props tu Server → Client phai serializable — khong truyen function, class.
- **Streaming and progressive rendering**: RSC output streams progressively. The server sends the first bytes immediately, and Suspense boundaries fill in as data resolves. Users see content faster. RSC stream tung phan — user thay content som hon.
- **Bundle size impact is dramatic**: Large dependencies (syntax highlighters, markdown parsers, date libraries) that only run on the server are completely excluded from the client bundle. In Next.js App Router, this is the default. Dependency chi chay tren server = 0KB client.
- **Composition pattern**: Server Components can import Client Components, but not vice versa. Client Components receive Server Component output as children. This is the core architectural pattern. Server import Client OK; Client khong import Server — truyen qua children.
- **Cache and revalidation**: RSC results can be cached at the edge (CDN) and revalidated on demand (`revalidatePath`/`revalidateTag`). This combines static performance with dynamic data. Cache RSC result tren CDN, revalidate khi can.

### Vi du / Example
```tsx
// app/products/page.tsx — Server Component (default in Next.js App Router)
import { db } from '@/lib/database';        // Direct DB access
import { ProductList } from './ProductList'; // Client Component

export default async function ProductsPage() {
  // This runs on the server — no API endpoint needed
  const products = await db.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  // Pass serializable data to Client Component
  return <ProductList initialProducts={products} />;
}

// app/products/ProductList.tsx — Client Component
'use client';
import { useState } from 'react';

export function ProductList({ initialProducts }: { initialProducts: Product[] }) {
  const [filter, setFilter] = useState('');
  const filtered = initialProducts.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <ul>{filtered.map(p => <li key={p.id}>{p.name}</li>)}</ul>
    </>
  );
}
```

### Interview Notes / Ghi Chu Phong Van
- Clearly explain the mental model: Server Components are about REDUCING client JavaScript, not about server-side rendering (SSR is different).
- Know the serialization boundary rules — what can and cannot cross "use client".
- Mention real-world bundle savings: "We moved our markdown parser to a Server Component and saved 80KB of client JS."

## Image and Asset Optimization

### Giai thich / Explanation

**English:** Images are typically the largest assets on a page. Proper format selection, sizing, lazy loading, and preloading strategies directly impact LCP and bandwidth.

**Tieng Viet:** Hinh anh thuong la asset lon nhat tren trang. Chon dinh dang dung, kich thuoc phu hop, lazy loading va preloading anh huong truc tiep den LCP va bandwidth.

### Key Points / Y Chinh
- **Next.js Image component**: Automatically serves WebP/AVIF, generates responsive sizes, lazy loads by default, and prevents CLS with required width/height. Always prefer `next/image` over raw `<img>`. next/image tu dong toi uu dinh dang, kich thuoc, lazy load va tranh CLS.
- **LCP image must not be lazy loaded**: The hero image (likely your LCP element) should have `priority={true}` (Next.js) or `loading="eager"` + `fetchpriority="high"`. Lazy loading your LCP image hurts performance. Hinh LCP khong duoc lazy load — dung priority.
- **Modern formats**: WebP is 25-35% smaller than JPEG; AVIF is 50% smaller. Use `<picture>` with fallbacks or let Next.js Image handle format negotiation automatically. WebP nho hon JPEG 25-35%; AVIF nho hon 50%.
- **Responsive images with srcset**: Serve different sizes for different viewports. A 2000px hero image on a 375px phone wastes bandwidth. Use `sizes` attribute to tell the browser which image to download. Dung srcset + sizes de browser tai hinh phu hop voi man hinh.
- **Blur placeholder for perceived performance**: Show a tiny blurred version (10x10px base64 inline) while the full image loads. This eliminates CLS and feels instant. `next/image` supports `placeholder="blur"` out of the box. Blur placeholder giup trang cam thay nhanh hon.
- **Font optimization**: Self-host fonts, use `font-display: swap` to avoid FOIT (flash of invisible text), subset fonts to include only needed characters (Latin vs full Unicode). Self-host font, dung font-display: swap, va subset font.
- **Preload critical assets**: Use `<link rel="preload">` for above-the-fold images, critical fonts, and key CSS. In Next.js, use the `preload` option in `next/font`. Preload asset quan trong cho above-the-fold.
- **SVG optimization**: For icons and illustrations, use inline SVG (no extra HTTP request), or a sprite sheet. Run SVGO to remove metadata and reduce size by 30-60%. Inline SVG cho icon; chay SVGO de giam kich thuoc 30-60%.

### Vi du / Example
```tsx
import Image from 'next/image';

// Hero image — LCP element, must preload
function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Product showcase"
      width={1200}
      height={600}
      priority              // preloads, no lazy loading
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQ..."  // 10px blurred
      sizes="(max-width: 768px) 100vw, 1200px"
    />
  );
}

// Below-the-fold image — lazy loaded by default
function ProductCard({ product }: { product: Product }) {
  return (
    <Image
      src={product.imageUrl}
      alt={product.name}
      width={400}
      height={300}
      // loading="lazy" is default — no need to specify
      placeholder="blur"
      blurDataURL={product.blurHash}
    />
  );
}
```

### Interview Notes / Ghi Chu Phong Van
- Connect image optimization to Core Web Vitals: LCP (hero image speed), CLS (layout shift from images without dimensions).
- Know the difference between `loading="lazy"` (browser-native) and `priority` (framework-level preloading).
- Mention format negotiation: server sends WebP to Chrome, JPEG to Safari 14, AVIF to modern browsers.

Cross-reference: [Browser Performance](../../fe-track/06-browser-performance/01-core-web-vitals.md)

---

## Cau Hoi Phong Van / Interview Q&A

### Q1: When should you use React.memo? / Khi nao nen dung React.memo? 🟢 Junior

**A:** Use React.memo when a component (a) re-renders frequently with the same props, (b) has expensive render output, and (c) receives referentially stable props. Without all three conditions, memo adds complexity without benefit.

Giai thich: memo chi hieu qua khi ca 3 dieu kien thoa man — render thuong xuyen voi cung props, render dat, va props on dinh reference. Thieu mot trong ba thi memo them phuc tap ma khong co loi.

**Key trap:** Inline objects/functions as props defeat memo entirely because they create new references every render. Always stabilize props with useMemo/useCallback before wrapping children with memo.

### Q2: What is the difference between useMemo and useCallback? / useMemo va useCallback khac nhau the nao? 🟢 Junior

**A:** `useCallback(fn, deps)` is syntactic sugar for `useMemo(() => fn, deps)`. useMemo caches a computed value; useCallback caches a function reference. Both maintain referential stability for memoized children.

Giai thich: useCallback la duong cu phap cua useMemo cho function. Ca hai deu giu on dinh reference — useCallback cho function, useMemo cho gia tri tinh toan.

**Key trap:** Neither actually prevents function creation — the function is created every render, but useCallback returns the cached version if deps haven't changed. The savings come from the downstream memo, not from avoiding function creation.

### Q3: How do you prevent unnecessary re-renders without memo? / Lam sao ngan re-render thua khong can memo? 🟡 Mid

**A:** Three architectural patterns are more effective than memo: (1) **State colocation** — move state down to the component that uses it. (2) **Children as props** — pass expensive subtrees as `children` so they don't re-render when parent state changes. (3) **Context splitting** — separate frequently-changing values into their own context.

Giai thich: Ba pattern kien truc hieu qua hon memo: (1) Dat state gan noi dung, (2) Truyen component qua children, (3) Tach context theo tan suat thay doi. Day la cach nghi cua senior — uu tien kien truc truoc ky thuat.

### Q4: Explain useTransition vs useDeferredValue / Giai thich useTransition va useDeferredValue 🟡 Mid

**A:** `useTransition` wraps a state update to mark it as non-urgent — React yields to higher-priority updates (typing). `useDeferredValue` wraps a value to get a "stale" version during heavy renders. Use useTransition when you control the setState call; use useDeferredValue when you receive the value as a prop.

Giai thich: useTransition bao setState la khong gap; useDeferredValue bao gia tri co the dung ban cu. Dung useTransition khi ban kiem soat setState; dung useDeferredValue khi nhan gia tri qua prop.

**Key insight:** Both are superior to debounce because they don't add artificial delay — React renders as fast as possible while staying responsive to user input.

### Q5: How does code splitting improve performance? / Code splitting cai thien hieu nang the nao? 🟢 Junior

**A:** Code splitting reduces the initial JavaScript bundle size by loading code on demand. Route-level splitting (each page is a separate chunk) is the baseline. Component-level splitting (lazy-loading modals, charts, heavy features) provides further gains. Combined with prefetching on hover/idle, users rarely see loading states.

Giai thich: Code splitting giam JS ban dau bang cach tai theo yeu cau. Tach theo route la muc toi thieu, tach component nang cung cap loi ich them. Ket hop voi prefetch khi hover/idle, user it khi thay loading.

### Q6: What is virtualization and when should you use it? / Virtualization la gi va khi nao nen dung? 🟡 Mid

**A:** Virtualization renders only visible items in a long list, keeping DOM node count constant (~20-50 nodes) regardless of data size. Use it when lists exceed ~500-1000 items. Below that threshold, the virtualization library overhead (measuring, scroll handling) may exceed the benefit. Consider pagination as a simpler alternative for search/filter UIs.

Giai thich: Virtualization chi render item hien thi, giu DOM node co dinh. Dung khi list vuot 500-1000 item. Duoi nguong do, overhead cua library co the lon hon loi ich. Pagination don gian hon cho UI tim kiem.

**Key trade-off:** Virtualized lists can break accessibility (screen readers can't see off-screen items). Add `aria-rowcount`/`aria-rowindex` and ensure keyboard navigation works.

### Q7: How do React Server Components improve performance? / React Server Components cai thien hieu nang the nao? 🟡 Mid

**A:** RSC run on the server and send rendered output (not component JS) to the client. This means large dependencies used only for rendering (markdown parsers, syntax highlighters, date formatters) cost zero client-side JavaScript. RSC can also directly access databases, eliminating API round-trips.

Giai thich: RSC chay tren server, gui output da render — khong gui JS. Dependency chi dung de render co gia 0KB client JS. RSC cung truy cap DB truc tiep, bo round-trip API.

**Key distinction:** RSC is NOT the same as SSR. SSR renders to HTML for faster first paint but still sends all component JS. RSC eliminates the JS entirely for server-only components.

### Q8: How do you profile React performance in production? / Lam sao profile hieu nang React tren production? 🔴 Senior

**A:** Production builds strip the Profiler by default. Build with `--profile` flag to keep it. Use the `<Profiler>` API to send render durations to your analytics service. Key metrics: `actualDuration` (time to render changed parts) vs `baseDuration` (time without memoization). Compare these to find where memo is most effective. Supplement with browser Performance API, Lighthouse CI, and real-user monitoring (RUM) via web-vitals library.

Giai thich: Build voi --profile de giu Profiler trong production. Dung API Profiler de gui thoi gian render len analytics. actualDuration vs baseDuration cho biet memo hieu qua o dau. Ket hop voi Performance API, Lighthouse CI, va RUM.

### Q9: What is the React Compiler (React Forget) and how does it change optimization? / React Compiler la gi va no thay doi toi uu hoa nhu the nao? 🔴 Senior

**A:** The React Compiler (formerly React Forget) automatically analyzes your components at build time and inserts memoization (useMemo, useCallback, memo) where it determines they would be beneficial. This means manual memoization becomes largely unnecessary. However, the compiler requires components to follow React's rules (pure, no side effects during render), so it also serves as a code quality enforcement tool.

Giai thich: React Compiler tu dong phan tich va chen memo khi can thiet tai build time. Manual memo tro nen it can thiet. Nhung Compiler yeu cau component tuan thu rules of React (pure, khong side effect khi render), nen no cung la cong cu kiem tra chat luong code.

**Interview impact:** "I write clean React following the rules of hooks and purity. The compiler handles memoization. I focus on architecture — state colocation, component composition, context splitting — rather than sprinkling memo everywhere."

### Q10: Design a performance optimization strategy for a slow React dashboard / Thiet ke chien luoc toi uu cho React dashboard cham 🔴 Senior

**A:** Follow this systematic approach:

1. **Measure**: Run Lighthouse, check Core Web Vitals (LCP, INP, CLS). Profile with React DevTools to identify slow components.
2. **Bundle**: Run webpack-bundle-analyzer. Replace heavy deps (moment→dayjs). Code-split by route. Lazy-load charts and modals.
3. **Rendering**: Use React Profiler to find components that render too often. Apply state colocation, context splitting, composition patterns. Only then consider memo.
4. **Lists**: Virtualize any list >500 items with react-window or react-virtuoso.
5. **Data**: Move data fetching to Server Components where possible. Use streaming SSR for progressive loading.
6. **Assets**: Optimize images (WebP/AVIF, responsive sizes, priority for LCP). Self-host and subset fonts.
7. **Prevent regression**: Set performance budgets in CI. Monitor real-user metrics with web-vitals.

Giai thich: Cach tiep can co he thong: Do dac → Bundle → Rendering → Lists → Data → Assets → Ngan hoi quy. Moi buoc co cong cu va chi so cu the. Day la cach tra loi cho thay tu duy toan dien cua senior engineer.
