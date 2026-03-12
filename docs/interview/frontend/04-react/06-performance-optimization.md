# React Performance Optimization

> Performance optimization là key skill cho senior developers. Biết khi nào và cách tối ưu = apps nhanh hơn.

---

## Mục Lục

- [Overview](#-overview)
- [Re-render Optimization](#-re-render-optimization)
- [Memoization](#-memoization)
- [Code Splitting](#-code-splitting)
- [Virtualization](#-virtualization)
- [Profiling & Debugging](#-profiling--debugging)
- [Câu Hỏi Phỏng Vấn](#-câu-hỏi-phỏng-vấn)

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│              PERFORMANCE OPTIMIZATION HIERARCHY                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. ARCHITECTURE (Biggest Impact)                               │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ • State colocation (keep state close to where it's used)│   │
│   │ • Component composition                                  │   │
│   │ • Data fetching strategy                                 │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   2. RENDERING OPTIMIZATION                                      │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ • React.memo for expensive components                    │   │
│   │ • useMemo for expensive computations                     │   │
│   │ • useCallback for stable function references             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   3. BUNDLE OPTIMIZATION                                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ • Code splitting with React.lazy                         │   │
│   │ • Tree shaking                                           │   │
│   │ • Bundle analysis                                        │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   4. MICRO-OPTIMIZATIONS (Last Resort)                          │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ • Virtualization for long lists                          │   │
│   │ • Debouncing/throttling                                  │   │
│   │ • Web Workers for heavy computation                      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Re-render Optimization

### Understanding Re-renders

```jsx
// Re-render triggers:
// 1. State change
// 2. Props change
// 3. Parent re-renders
// 4. Context change

// ❌ Problem: Child re-renders even when its props don't change
function Parent() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <button onClick={() => setCount(c => c + 1)}>{count}</button>
            <Child name="John" /> {/* Re-renders every time! */}
        </div>
    );
}

function Child({ name }) {
    console.log('Child rendered');
    return <div>{name}</div>;
}
```

### State Colocation

```jsx
// ❌ Bad: State too high, causes unnecessary re-renders
function App() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div>
            <Header />  {/* Re-renders when searchQuery changes */}
            <SearchBox query={searchQuery} setQuery={setSearchQuery} />
            <Sidebar /> {/* Re-renders when searchQuery changes */}
        </div>
    );
}

// ✅ Good: State colocated where it's used
function App() {
    return (
        <div>
            <Header />
            <SearchBox /> {/* Contains its own state */}
            <Sidebar />
        </div>
    );
}

function SearchBox() {
    const [searchQuery, setSearchQuery] = useState('');
    return <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />;
}
```

### Composition Pattern

```jsx
// ❌ Bad: ExpensiveComponent re-renders when count changes
function Parent() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <button onClick={() => setCount(c => c + 1)}>{count}</button>
            <ExpensiveComponent />
        </div>
    );
}

// ✅ Good: Pass as children - ExpensiveComponent doesn't re-render
function Parent({ children }) {
    const [count, setCount] = useState(0);

    return (
        <div>
            <button onClick={() => setCount(c => c + 1)}>{count}</button>
            {children}
        </div>
    );
}

function App() {
    return (
        <Parent>
            <ExpensiveComponent /> {/* Created in App, not affected by Parent's state */}
        </Parent>
    );
}
```

---

## 📦 Memoization

### React.memo

```jsx
// Memoize component - only re-renders if props change
const ExpensiveList = React.memo(function ExpensiveList({ items }) {
    console.log('ExpensiveList rendered');
    return (
        <ul>
            {items.map(item => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    );
});

// Custom comparison function
const MemoizedComponent = React.memo(
    function Component({ user, onClick }) {
        return <div onClick={onClick}>{user.name}</div>;
    },
    (prevProps, nextProps) => {
        // Return true if props are equal (skip re-render)
        return prevProps.user.id === nextProps.user.id;
    }
);
```

### useMemo

```jsx
function ProductList({ products, filter }) {
    // ✅ Only recompute when products or filter change
    const filteredProducts = useMemo(() => {
        console.log('Filtering...');
        return products.filter(p =>
            p.name.toLowerCase().includes(filter.toLowerCase())
        );
    }, [products, filter]);

    // ✅ Stable object reference
    const style = useMemo(() => ({
        backgroundColor: 'blue',
        color: 'white'
    }), []);

    return (
        <ul style={style}>
            {filteredProducts.map(p => <li key={p.id}>{p.name}</li>)}
        </ul>
    );
}
```

### useCallback

```jsx
function Parent() {
    const [count, setCount] = useState(0);
    const [items, setItems] = useState([]);

    // ❌ Bad: New function every render - Child re-renders
    const handleClick = () => {
        console.log('clicked');
    };

    // ✅ Good: Stable function reference
    const handleClickMemo = useCallback(() => {
        console.log('clicked');
    }, []);

    // ✅ With dependencies
    const addItem = useCallback((item) => {
        setItems(prev => [...prev, item]);
    }, []); // setItems is stable, no need in deps

    return (
        <div>
            <button onClick={() => setCount(c => c + 1)}>{count}</button>
            <MemoizedChild onClick={handleClickMemo} />
        </div>
    );
}

const MemoizedChild = React.memo(function Child({ onClick }) {
    console.log('Child rendered');
    return <button onClick={onClick}>Click me</button>;
});
```

### When NOT to Memoize

```jsx
// ❌ Unnecessary memoization

// 1. Simple computations
const value = useMemo(() => a + b, [a, b]); // Just do: a + b

// 2. Primitives already stable
const handleClick = useCallback(() => setCount(c => c + 1), []);
// If not passed to memoized child, no benefit

// 3. Non-memoized consumers
const style = useMemo(() => ({ color: 'red' }), []);
<div style={style} /> // div is not memoized, so useless

// ✅ Only memoize when:
// - Expensive computation
// - Passing to React.memo child
// - Dependency of other hooks
```

---

## ✂️ Code Splitting

### React.lazy & Suspense

```jsx
// ❌ Before: Everything in one bundle
import HeavyComponent from './HeavyComponent';
import Dashboard from './Dashboard';
import Settings from './Settings';

// ✅ After: Load on demand
const HeavyComponent = lazy(() => import('./HeavyComponent'));
const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </Suspense>
    );
}

// Named exports
const Dashboard = lazy(() =>
    import('./pages').then(module => ({ default: module.Dashboard }))
);

// Preloading
const DashboardPromise = import('./Dashboard');
const Dashboard = lazy(() => DashboardPromise);

// Or preload on hover
function NavLink({ to, children }) {
    const preload = () => {
        if (to === '/dashboard') {
            import('./Dashboard');
        }
    };

    return (
        <Link to={to} onMouseEnter={preload}>
            {children}
        </Link>
    );
}
```

### Route-based Splitting

```jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Checkout = lazy(() => import('./pages/Checkout'));

function App() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
            </Routes>
        </Suspense>
    );
}
```

---

## 📜 Virtualization

### react-window

```jsx
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
    const Row = ({ index, style }) => (
        <div style={style}>
            {items[index].name}
        </div>
    );

    return (
        <FixedSizeList
            height={400}
            itemCount={items.length}
            itemSize={35}
            width="100%"
        >
            {Row}
        </FixedSizeList>
    );
}

// Variable size list
import { VariableSizeList } from 'react-window';

function VariableList({ items }) {
    const getItemSize = index => items[index].height || 50;

    return (
        <VariableSizeList
            height={400}
            itemCount={items.length}
            itemSize={getItemSize}
            width="100%"
        >
            {Row}
        </VariableSizeList>
    );
}
```

### react-virtuoso

```jsx
import { Virtuoso } from 'react-virtuoso';

function VirtualList({ items }) {
    return (
        <Virtuoso
            style={{ height: '400px' }}
            totalCount={items.length}
            itemContent={(index) => (
                <div>{items[index].name}</div>
            )}
        />
    );
}

// With infinite loading
function InfiniteList() {
    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const loadMore = async () => {
        const newItems = await fetchMoreItems();
        setItems(prev => [...prev, ...newItems]);
        setHasMore(newItems.length > 0);
    };

    return (
        <Virtuoso
            style={{ height: '400px' }}
            data={items}
            endReached={loadMore}
            itemContent={(index, item) => (
                <div>{item.name}</div>
            )}
            components={{
                Footer: () => hasMore ? <Loading /> : null
            }}
        />
    );
}
```

---

## 🔍 Profiling & Debugging

### React DevTools Profiler

```
┌─────────────────────────────────────────────────────────────────┐
│                   PROFILER WORKFLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. Open React DevTools → Profiler tab                         │
│   2. Click Record                                                │
│   3. Perform action (click button, navigate, etc.)              │
│   4. Stop recording                                              │
│   5. Analyze:                                                    │
│      • Flamegraph: Which components rendered                     │
│      • Ranked: Slowest components first                          │
│      • Timeline: When renders happened                           │
│                                                                   │
│   Key metrics:                                                   │
│   • Render duration                                              │
│   • Why did this render?                                         │
│   • Commits (batched updates)                                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Why Did You Render

```jsx
// Install: npm install @welldone-software/why-did-you-render

// wdyr.js (import before app)
import React from 'react';

if (process.env.NODE_ENV === 'development') {
    const whyDidYouRender = require('@welldone-software/why-did-you-render');
    whyDidYouRender(React, {
        trackAllPureComponents: true,
    });
}

// Track specific component
function MyComponent(props) {
    // ...
}
MyComponent.whyDidYouRender = true;
```

### Performance Measurement

```jsx
// React.Profiler component
function App() {
    const onRender = (
        id,           // Component id
        phase,        // "mount" or "update"
        actualDuration,
        baseDuration,
        startTime,
        commitTime
    ) => {
        console.log({ id, phase, actualDuration });
    };

    return (
        <Profiler id="App" onRender={onRender}>
            <MainContent />
        </Profiler>
    );
}

// Web Vitals
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: React.memo làm gì?**

A: React.memo là HOC memoize component. Chỉ re-render khi props thay đổi (shallow comparison).

**Q: useMemo vs useCallback?**

A:
- useMemo: Memoize computed **value**
- useCallback: Memoize **function** reference
- `useCallback(fn, deps)` === `useMemo(() => fn, deps)`

### 🟡 Mid-level

**Q: Khi nào KHÔNG nên dùng memoization?**

A:
1. Cheap computations (overhead > benefit)
2. Props always change anyway
3. Consumer not memoized (React.memo)
4. Premature optimization

**Q: Giải thích state colocation**

A: Keep state as close to where it's used as possible. Benefits:
- Fewer re-renders (only affected components update)
- Better code organization
- Easier testing

### 🔴 Senior

**Q: Design performance optimization strategy cho large app**

A:
1. **Measure first**: Profiler, Lighthouse, Web Vitals
2. **Architecture**: State colocation, composition pattern
3. **Bundle**: Code splitting by route, lazy load heavy components
4. **Rendering**: React.memo for expensive components, virtualization for lists
5. **Data**: React Query for caching, pagination/infinite scroll
6. **Monitor**: RUM (Real User Monitoring) in production

---

## 📚 Active Recall

1. [ ] List 3 re-render triggers
2. [ ] Implement memoized list component
3. [ ] When to use React.lazy?
4. [ ] Virtualization cho list 10000 items
5. [ ] Use React DevTools Profiler

---

> **Tiếp theo:** [07-testing-react.md](./07-testing-react.md) - Testing React Applications
