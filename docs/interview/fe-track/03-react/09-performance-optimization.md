# React Performance Optimization
## React - Chapter 9

[← Previous: React Patterns Advanced](./08-react-patterns-advanced.md) | [Back to Table of Contents](../00-table-of-contents.md)

---

## Overview

Performance optimization is crucial for building fast, responsive React applications. This chapter covers techniques, patterns, and best practices for optimizing React performance in production applications.

---

## Table of Contents

1. [Understanding React Performance](#understanding-react-performance)
2. [React.memo](#reactmemo)
3. [useMemo and useCallback](#usememo-and-usecallback)
4. [Code Splitting](#code-splitting)
5. [Lazy Loading](#lazy-loading)
6. [Virtualization](#virtualization)
7. [Debouncing and Throttling](#debouncing-and-throttling)
8. [Optimizing Context](#optimizing-context)
9. [Profiling and Debugging](#profiling-and-debugging)
10. [Production Optimizations](#production-optimizations)
11. [Interview Questions](#interview-questions)

---

## Understanding React Performance

### How React Renders

```
State/Props Change
       ↓
Render Phase (Virtual DOM)
       ↓
Reconciliation (Diffing)
       ↓
Commit Phase (DOM Updates)
       ↓
Browser Paint
```

### Common Performance Issues

1. **Unnecessary Re-renders**: Components re-render when they don't need to
2. **Expensive Calculations**: Heavy computations on every render
3. **Large Bundle Size**: Slow initial load
4. **Memory Leaks**: Unclean subscriptions/listeners
5. **Inefficient Lists**: Poor key usage or missing virtualization

### Measuring Performance

```javascript
// React DevTools Profiler
import { Profiler } from 'react';

function onRenderCallback(
  id, // Component identifier
  phase, // "mount" or "update"
  actualDuration, // Time spent rendering
  baseDuration, // Estimated time without memoization
  startTime, // When render started
  commitTime, // When committed
  interactions // Set of interactions
) {
  console.log(`${id} took ${actualDuration}ms to render`);
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Navigation />
      <Main />
    </Profiler>
  );
}
```

---

## React.memo

### Basic Usage

```javascript
// Without memo: Re-renders on every parent render
function ExpensiveComponent({ data }) {
  console.log('Rendering ExpensiveComponent');
  return <div>{data}</div>;
}

// With memo: Only re-renders when props change
const MemoizedComponent = React.memo(function ExpensiveComponent({ data }) {
  console.log('Rendering ExpensiveComponent');
  return <div>{data}</div>;
});

// Parent component
function Parent() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState('Hello');
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <MemoizedComponent data={data} />
      {/* Only re-renders when data changes, not when count changes */}
    </div>
  );
}
```

### Custom Comparison Function

```javascript
const MemoizedUser = React.memo(
  function UserComponent({ user }) {
    return (
      <div>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip render)
    // Return false if props are different (re-render)
    return prevProps.user.id === nextProps.user.id;
  }
);
```

### When to Use React.memo

```javascript
// ✅ Use memo for:
// 1. Pure functional components
const PureComponent = React.memo(({ data }) => <div>{data}</div>);

// 2. Components that render often with same props
const ListItem = React.memo(({ item }) => <li>{item.name}</li>);

// 3. Components with expensive rendering
const Chart = React.memo(({ data }) => {
  // Expensive chart rendering
  return <canvas />;
});

// ❌ Don't use memo for:
// 1. Components that always receive different props
function AlwaysChanging({ timestamp }) {
  return <div>{timestamp}</div>; // timestamp always changes
}

// 2. Simple components
function Simple({ text }) {
  return <span>{text}</span>; // Memo overhead > render cost
}
```

---

## useMemo and useCallback

### useMemo for Expensive Calculations

```javascript
function ProductList({ products, filter }) {
  // ❌ Without useMemo: Recalculates on every render
  const filteredProducts = products.filter(p => 
    p.category === filter
  ).sort((a, b) => 
    a.price - b.price
  );
  
  // ✅ With useMemo: Only recalculates when dependencies change
  const filteredProducts = useMemo(() => {
    console.log('Filtering and sorting products...');
    return products
      .filter(p => p.category === filter)
      .sort((a, b) => a.price - b.price);
  }, [products, filter]);
  
  return (
    <ul>
      {filteredProducts.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

### useMemo for Referential Equality

```javascript
function Parent() {
  const [count, setCount] = useState(0);
  
  // ❌ New object on every render
  const config = {
    theme: 'dark',
    locale: 'en'
  };
  
  // ✅ Same object reference
  const config = useMemo(() => ({
    theme: 'dark',
    locale: 'en'
  }), []);
  
  return <Child config={config} />;
}

const Child = React.memo(({ config }) => {
  console.log('Child rendered');
  return <div>{config.theme}</div>;
});
```

### useCallback for Function Stability

```javascript
function Parent() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  
  // ❌ New function on every render
  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  // ✅ Stable function reference
  const handleDelete = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []); // No dependencies needed with functional update
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      {items.map(item => (
        <Item key={item.id} item={item} onDelete={handleDelete} />
      ))}
    </div>
  );
}

const Item = React.memo(({ item, onDelete }) => {
  console.log('Item rendered:', item.id);
  return (
    <div>
      {item.name}
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </div>
  );
});
```

### When to Use useMemo and useCallback

```javascript
// ✅ Use useMemo for:
// 1. Expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// 2. Referential equality for child props
const config = useMemo(() => ({ theme, locale }), [theme, locale]);

// 3. Dependencies in other hooks
const filteredItems = useMemo(() => items.filter(predicate), [items]);
useEffect(() => {
  // Use filteredItems
}, [filteredItems]);

// ✅ Use useCallback for:
// 1. Passing to memoized children
const handleClick = useCallback(() => {
  doSomething();
}, []);
<MemoizedChild onClick={handleClick} />

// 2. Dependencies in useEffect
const fetchData = useCallback(() => {
  return fetch('/api/data');
}, []);
useEffect(() => {
  fetchData();
}, [fetchData]);

// ❌ Don't use for:
// 1. Simple calculations
const sum = useMemo(() => a + b, [a, b]); // Overkill

// 2. Primitive values
const doubled = useMemo(() => count * 2, [count]); // Unnecessary
```

---

## Code Splitting

### Dynamic Import

```javascript
// Before: All code in one bundle
import HeavyComponent from './HeavyComponent';

function App() {
  return <HeavyComponent />;
}

// After: Split into separate chunk
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Route-Based Code Splitting

```javascript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy load route components
const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));
const Dashboard = lazy(() => import('./routes/Dashboard'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Component-Based Code Splitting

```javascript
function App() {
  const [showModal, setShowModal] = useState(false);
  
  // Only load modal when needed
  const Modal = lazy(() => import('./Modal'));
  
  return (
    <div>
      <button onClick={() => setShowModal(true)}>Open Modal</button>
      {showModal && (
        <Suspense fallback={<div>Loading modal...</div>}>
          <Modal onClose={() => setShowModal(false)} />
        </Suspense>
      )}
    </div>
  );
}
```

### Named Exports with Lazy

```javascript
// components.js
export function ComponentA() { }
export function ComponentB() { }

// App.js
const ComponentA = lazy(() => 
  import('./components').then(module => ({ default: module.ComponentA }))
);
```

---

## Lazy Loading

### Images

```javascript
// Lazy load images
function LazyImage({ src, alt }) {
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, [src]);
  
  return (
    <img
      ref={imgRef}
      src={imageSrc || 'placeholder.jpg'}
      alt={alt}
      loading="lazy" // Native lazy loading
    />
  );
}
```

### Custom Hook for Lazy Loading

```javascript
function useIntersectionObserver(ref, options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [ref, options]);
  
  return isIntersecting;
}

// Usage
function LazyComponent() {
  const ref = useRef();
  const isVisible = useIntersectionObserver(ref, { threshold: 0.5 });
  
  return (
    <div ref={ref}>
      {isVisible ? <ExpensiveComponent /> : <Placeholder />}
    </div>
  );
}
```

---

## Virtualization

### React Window

```javascript
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}

// Before: Renders 10,000 items
function SlowList({ items }) {
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}

// After: Only renders visible items
function FastList({ items }) {
  return <VirtualizedList items={items} />;
}
```

### Variable Size List

```javascript
import { VariableSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const getItemSize = (index) => {
    // Dynamic height based on content
    return items[index].height || 50;
  };
  
  const Row = ({ index, style }) => (
    <div style={style}>
      <h3>{items[index].title}</h3>
      <p>{items[index].description}</p>
    </div>
  );
  
  return (
    <VariableSizeList
      height={600}
      itemCount={items.length}
      itemSize={getItemSize}
      width="100%"
    >
      {Row}
    </VariableSizeList>
  );
}
```

---

## Debouncing and Throttling

### Debounce

```javascript
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage: Search input
function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Make API call
      fetch(`/api/search?q=${debouncedSearchTerm}`)
        .then(res => res.json())
        .then(setResults);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### Throttle

```javascript
function useThrottle(value, limit) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());
  
  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));
    
    return () => clearTimeout(handler);
  }, [value, limit]);
  
  return throttledValue;
}

// Usage: Scroll handler
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottle(scrollY, 100);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return <div>Scroll position: {throttledScrollY}</div>;
}
```

---

## Optimizing Context

### Split Contexts

```javascript
// ❌ Single context causes all consumers to re-render
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [settings, setSettings] = useState({});
  
  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme, settings, setSettings }}>
      {children}
    </AppContext.Provider>
  );
}

// ✅ Split into separate contexts
const UserContext = createContext();
const ThemeContext = createContext();
const SettingsContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [settings, setSettings] = useState({});
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <SettingsContext.Provider value={{ settings, setSettings }}>
          {children}
        </SettingsContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}
```

### Memoize Context Value

```javascript
// ❌ New object on every render
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ✅ Memoized value
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### Context Selectors

```javascript
// Custom hook with selector
function createContextWithSelector() {
  const Context = createContext();
  
  function Provider({ value, children }) {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }
  
  function useContextSelector(selector) {
    const context = useContext(Context);
    const [state, setState] = useState(() => selector(context));
    
    useEffect(() => {
      setState(selector(context));
    }, [context, selector]);
    
    return state;
  }
  
  return [Provider, useContextSelector];
}

// Usage
const [UserProvider, useUserSelector] = createContextWithSelector();

function UserName() {
  // Only re-renders when name changes
  const name = useUserSelector(user => user.name);
  return <div>{name}</div>;
}
```

---

## Profiling and Debugging

### React DevTools Profiler

```javascript
// 1. Open React DevTools
// 2. Go to Profiler tab
// 3. Click record button
// 4. Interact with app
// 5. Stop recording
// 6. Analyze flame graph

// Look for:
// - Components that render frequently
// - Long render times
// - Unnecessary re-renders
```

### Why Did You Render

```javascript
// Install: npm install @welldone-software/why-did-you-render

// whyDidYouRender.js
import React from 'react';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}

// Component.js
function Component({ data }) {
  return <div>{data}</div>;
}

Component.whyDidYouRender = true;

export default Component;
```

### Performance Marks

```javascript
function ExpensiveComponent() {
  useEffect(() => {
    performance.mark('component-start');
    
    // Expensive operation
    doExpensiveWork();
    
    performance.mark('component-end');
    performance.measure(
      'component-render',
      'component-start',
      'component-end'
    );
    
    const measure = performance.getEntriesByName('component-render')[0];
    console.log(`Render took ${measure.duration}ms`);
  }, []);
  
  return <div>Component</div>;
}
```

---

## Production Optimizations

### Bundle Analysis

```bash
# Analyze bundle size
npm run build -- --stats
npx webpack-bundle-analyzer build/bundle-stats.json

# Look for:
# - Large dependencies
# - Duplicate code
# - Unused code
```

### Tree Shaking

```javascript
// ❌ Imports entire library
import _ from 'lodash';
const result = _.debounce(fn, 300);

// ✅ Import only what you need
import debounce from 'lodash/debounce';
const result = debounce(fn, 300);

// ✅ Or use ES modules
import { debounce } from 'lodash-es';
```

### Production Build

```javascript
// package.json
{
  "scripts": {
    "build": "react-scripts build",
    "build:analyze": "npm run build -- --stats && webpack-bundle-analyzer build/bundle-stats.json"
  }
}

// Optimizations in production:
// - Minification
// - Dead code elimination
// - Source maps (optional)
// - Asset optimization
```

### Service Worker

```javascript
// Register service worker for caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}
```

---

## Interview Questions

### Q1: What causes unnecessary re-renders in React?

**Answer:**
1. **Parent re-renders**: Child components re-render by default
2. **Context changes**: All consumers re-render
3. **New object/array references**: Even if values are same
4. **Inline functions**: New function on every render

**Solutions:**
- React.memo for components
- useMemo for values
- useCallback for functions
- Split contexts

### Q2: When should you use useMemo and useCallback?

**Answer:**
**useMemo:**
- Expensive calculations
- Referential equality for props
- Dependencies in other hooks

**useCallback:**
- Passing to memoized children
- Dependencies in useEffect
- Event handlers in lists

**Don't use for:**
- Simple calculations
- Primitive values
- Every function/value (premature optimization)

### Q3: How do you optimize a large list in React?

**Answer:**
1. **Virtualization**: Use react-window or react-virtualized
2. **Pagination**: Load data in chunks
3. **Memoization**: Memo list items
4. **Stable keys**: Use unique IDs, not array index
5. **Debounce search**: Reduce filter operations

```javascript
const ListItem = React.memo(({ item }) => <li>{item.name}</li>);

function List({ items }) {
  return (
    <FixedSizeList height={600} itemCount={items.length} itemSize={50}>
      {({ index, style }) => (
        <div style={style}>
          <ListItem item={items[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

### Q4: What is code splitting and why is it important?

**Answer:**
Code splitting divides your bundle into smaller chunks that can be loaded on demand.

**Benefits:**
- Faster initial load
- Better caching
- Reduced bandwidth usage

**Methods:**
- Dynamic import()
- React.lazy()
- Route-based splitting

```javascript
const Dashboard = lazy(() => import('./Dashboard'));

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

### Q5: How do you profile React performance?

**Answer:**
1. **React DevTools Profiler**: Flame graph, ranked chart
2. **Chrome DevTools Performance**: Timeline, bottlenecks
3. **why-did-you-render**: Track unnecessary re-renders
4. **Performance API**: Custom measurements
5. **Lighthouse**: Overall performance score

---

## Performance Checklist

### Development
- [ ] Use React DevTools Profiler
- [ ] Enable why-did-you-render
- [ ] Monitor bundle size
- [ ] Check for memory leaks
- [ ] Test on slow devices

### Production
- [ ] Code splitting implemented
- [ ] Images optimized and lazy loaded
- [ ] Large lists virtualized
- [ ] Context optimized
- [ ] Memoization where needed
- [ ] Service worker for caching
- [ ] Bundle analyzed and optimized
- [ ] Source maps configured
- [ ] CDN for static assets

---

## Key Takeaways

1. **Measure first**: Profile before optimizing
2. **React.memo**: Prevent unnecessary re-renders
3. **useMemo/useCallback**: Memoize expensive operations
4. **Code splitting**: Reduce initial bundle size
5. **Virtualization**: Handle large lists efficiently
6. **Debounce/Throttle**: Limit expensive operations
7. **Optimize Context**: Split and memoize
8. **Production build**: Enable all optimizations
9. **Monitor**: Use profiling tools regularly
10. **Don't over-optimize**: Balance performance and maintainability

---

[← Previous: React Patterns Advanced](./08-react-patterns-advanced.md) | [Back to Table of Contents](../00-table-of-contents.md)
