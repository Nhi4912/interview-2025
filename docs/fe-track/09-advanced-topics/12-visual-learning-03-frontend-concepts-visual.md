# Frontend Concepts - Visual Guide

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Understanding Through Diagrams

**English:** Visual representations help understand complex frontend concepts by providing clear mental models and relationships between components.

**Tiếng Việt:** Biểu diễn trực quan giúp hiểu các khái niệm frontend phức tạp bằng cách cung cấp mô hình tư duy rõ ràng và mối quan hệ giữa các thành phần.

## JavaScript Execution

### Call Stack Visualization

```
┌─────────────────────────────────┐
│      JavaScript Engine         │
├─────────────────────────────────┤
│                                 │
│  Call Stack (LIFO)             │
│  ┌───────────────────┐         │
│  │  function3()      │ ← Top   │
│  ├───────────────────┤         │
│  │  function2()      │         │
│  ├───────────────────┤         │
│  │  function1()      │         │
│  ├───────────────────┤         │
│  │  global()         │ ← Bottom│
│  └───────────────────┘         │
│                                 │
│  Heap (Memory)                 │
│  ┌───────────────────┐         │
│  │  Objects          │         │
│  │  Arrays           │         │
│  │  Functions        │         │
│  └───────────────────┘         │
└─────────────────────────────────┘
```

### Event Loop Diagram

```
┌─────────────────────────────────────────────┐
│           JavaScript Runtime                │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐      ┌──────────────┐   │
│  │  Call Stack  │      │   Web APIs   │   │
│  │              │      │              │   │
│  │  execute()   │◄─────│  setTimeout  │   │
│  │              │      │  fetch()     │   │
│  └──────────────┘      │  DOM events  │   │
│         ▲              └──────────────┘   │
│         │                     │           │
│         │                     ▼           │
│         │              ┌──────────────┐   │
│         │              │   Callback   │   │
│         └──────────────│    Queue     │   │
│                        │              │   │
│                        │  callback1() │   │
│                        │  callback2() │   │
│                        └──────────────┘   │
│                               ▲           │
│                               │           │
│                        ┌──────────────┐   │
│                        │  Microtask   │   │
│                        │    Queue     │   │
│                        │              │   │
│                        │  promise1()  │   │
│                        │  promise2()  │   │
│                        └──────────────┘   │
│                                             │
│         Event Loop: Check queues           │
│         1. Execute call stack              │
│         2. Process all microtasks          │
│         3. Process one macrotask           │
│         4. Render if needed                │
│         5. Repeat                          │
└─────────────────────────────────────────────┘
```

## React Component Lifecycle

### Class Component Lifecycle

```
┌─────────────────────────────────────────────┐
│         Component Lifecycle                 │
├─────────────────────────────────────────────┤
│                                             │
│  MOUNTING                                   │
│  ┌──────────────────────────────────────┐  │
│  │  constructor()                       │  │
│  │         ↓                            │  │
│  │  getDerivedStateFromProps()          │  │
│  │         ↓                            │  │
│  │  render()                            │  │
│  │         ↓                            │  │
│  │  componentDidMount()                 │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  UPDATING                                   │
│  ┌──────────────────────────────────────┐  │
│  │  getDerivedStateFromProps()          │  │
│  │         ↓                            │  │
│  │  shouldComponentUpdate()             │  │
│  │         ↓                            │  │
│  │  render()                            │  │
│  │         ↓                            │  │
│  │  getSnapshotBeforeUpdate()           │  │
│  │         ↓                            │  │
│  │  componentDidUpdate()                │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  UNMOUNTING                                 │
│  ┌──────────────────────────────────────┐  │
│  │  componentWillUnmount()              │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Hooks Lifecycle

```
┌─────────────────────────────────────────────┐
│         Hooks Lifecycle                     │
├─────────────────────────────────────────────┤
│                                             │
│  MOUNT                                      │
│  ┌──────────────────────────────────────┐  │
│  │  useState() - initialize             │  │
│  │  useEffect() - setup                 │  │
│  │  useLayoutEffect() - sync setup      │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  UPDATE                                     │
│  ┌──────────────────────────────────────┐  │
│  │  useState() - get current state      │  │
│  │  useEffect() - cleanup + setup       │  │
│  │  useMemo() - recompute if deps      │  │
│  │  useCallback() - recreate if deps   │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  UNMOUNT                                    │
│  ┌──────────────────────────────────────┐  │
│  │  useEffect() - cleanup               │  │
│  │  useLayoutEffect() - cleanup         │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## Browser Rendering Pipeline

### Critical Rendering Path

```
┌─────────────────────────────────────────────┐
│      Critical Rendering Path                │
├─────────────────────────────────────────────┤
│                                             │
│  HTML                    CSS               │
│    ↓                      ↓                │
│  ┌─────────┐         ┌─────────┐          │
│  │   DOM   │         │  CSSOM  │          │
│  │  Tree   │         │  Tree   │          │
│  └─────────┘         └─────────┘          │
│       ↓                   ↓                │
│       └─────────┬─────────┘                │
│                 ↓                          │
│          ┌─────────────┐                   │
│          │   Render    │                   │
│          │    Tree     │                   │
│          └─────────────┘                   │
│                 ↓                          │
│          ┌─────────────┐                   │
│          │   Layout    │                   │
│          │  (Reflow)   │                   │
│          └─────────────┘                   │
│                 ↓                          │
│          ┌─────────────┐                   │
│          │    Paint    │                   │
│          └─────────────┘                   │
│                 ↓                          │
│          ┌─────────────┐                   │
│          │  Composite  │                   │
│          └─────────────┘                   │
│                 ↓                          │
│            Display                         │
└─────────────────────────────────────────────┘
```

### Layer Composition

```
┌─────────────────────────────────────────────┐
│         Composite Layers                    │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Layer 3 (transform, opacity)       │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │  Layer 2 (position: fixed)    │  │   │
│  │  │  ┌─────────────────────────┐  │  │   │
│  │  │  │  Layer 1 (base layer)   │  │  │   │
│  │  │  │                         │  │  │   │
│  │  │  │  <div>Content</div>     │  │  │   │
│  │  │  │                         │  │  │   │
│  │  │  └─────────────────────────┘  │  │   │
│  │  └───────────────────────────────┘  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  GPU Composites layers                      │
│  - No layout/paint needed                   │
│  - Smooth animations                        │
│  - Hardware accelerated                     │
└─────────────────────────────────────────────┘
```

## State Management Flow

### Redux Data Flow

```
┌─────────────────────────────────────────────┐
│           Redux Data Flow                   │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────┐                               │
│  │   View   │                               │
│  └──────────┘                               │
│       │                                     │
│       │ dispatch(action)                    │
│       ↓                                     │
│  ┌──────────┐                               │
│  │  Action  │                               │
│  └──────────┘                               │
│       │                                     │
│       ↓                                     │
│  ┌──────────┐                               │
│  │Middleware│ (optional)                    │
│  └──────────┘                               │
│       │                                     │
│       ↓                                     │
│  ┌──────────┐                               │
│  │ Reducer  │                               │
│  └──────────┘                               │
│       │                                     │
│       │ newState                            │
│       ↓                                     │
│  ┌──────────┐                               │
│  │  Store   │                               │
│  └──────────┘                               │
│       │                                     │
│       │ subscribe                           │
│       ↓                                     │
│  ┌──────────┐                               │
│  │   View   │ (re-render)                   │
│  └──────────┘                               │
└─────────────────────────────────────────────┘
```

### React Context Flow

```
┌─────────────────────────────────────────────┐
│         Context Data Flow                   │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  <Provider value={state}>           │   │
│  │                                     │   │
│  │    ┌─────────────────────────────┐ │   │
│  │    │  <Consumer>                 │ │   │
│  │    │    {value => ...}           │ │   │
│  │    │                             │ │   │
│  │    │    ┌─────────────────────┐ │ │   │
│  │    │    │  <Consumer>         │ │ │   │
│  │    │    │    {value => ...}   │ │ │   │
│  │    │    └─────────────────────┘ │ │   │
│  │    └─────────────────────────────┘ │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  All consumers re-render when value changes │
└─────────────────────────────────────────────┘
```

## HTTP Request Flow

### Request/Response Cycle

```
┌─────────────────────────────────────────────┐
│         HTTP Request Flow                   │
├─────────────────────────────────────────────┤
│                                             │
│  Browser                        Server      │
│     │                              │        │
│     │  1. DNS Lookup               │        │
│     │─────────────────────────────→│        │
│     │                              │        │
│     │  2. TCP Handshake            │        │
│     │←────────────────────────────→│        │
│     │                              │        │
│     │  3. TLS Handshake (HTTPS)    │        │
│     │←────────────────────────────→│        │
│     │                              │        │
│     │  4. HTTP Request             │        │
│     │─────────────────────────────→│        │
│     │  GET /api/users              │        │
│     │  Headers: ...                │        │
│     │                              │        │
│     │  5. Server Processing        │        │
│     │                              │        │
│     │  6. HTTP Response            │        │
│     │←─────────────────────────────│        │
│     │  200 OK                      │        │
│     │  Headers: ...                │        │
│     │  Body: {...}                 │        │
│     │                              │        │
│     │  7. Connection Close         │        │
│     │←────────────────────────────→│        │
│                                             │
└─────────────────────────────────────────────┘
```

## CSS Box Model

### Box Model Layers

```
┌─────────────────────────────────────────────┐
│            CSS Box Model                    │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │         Margin (transparent)          │ │
│  │  ┌─────────────────────────────────┐  │ │
│  │  │       Border                    │  │ │
│  │  │  ┌───────────────────────────┐  │  │ │
│  │  │  │     Padding               │  │  │ │
│  │  │  │  ┌─────────────────────┐  │  │  │ │
│  │  │  │  │    Content          │  │  │  │ │
│  │  │  │  │                     │  │  │  │ │
│  │  │  │  │  width × height     │  │  │  │ │
│  │  │  │  │                     │  │  │  │ │
│  │  │  │  └─────────────────────┘  │  │  │ │
│  │  │  └───────────────────────────┘  │  │ │
│  │  └─────────────────────────────────┘  │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  box-sizing: content-box (default)          │
│  Total width = width + padding + border    │
│                                             │
│  box-sizing: border-box                     │
│  Total width = width (includes padding)    │
└─────────────────────────────────────────────┘
```

## Flexbox Layout

### Flex Container

```
┌─────────────────────────────────────────────┐
│         Flexbox Layout                      │
├─────────────────────────────────────────────┤
│                                             │
│  Main Axis (flex-direction: row)           │
│  ┌─────────────────────────────────────┐   │
│  │  ┌────┐  ┌────┐  ┌────┐  ┌────┐    │   │
│  │  │ 1  │  │ 2  │  │ 3  │  │ 4  │    │   │
│  │  └────┘  └────┘  └────┘  └────┘    │   │
│  └─────────────────────────────────────┘   │
│  ↑                                     ↑   │
│  justify-content                            │
│                                             │
│  Cross Axis (flex-direction: column)        │
│  ┌─────┐                                    │
│  │  1  │ ← align-items                      │
│  ├─────┤                                    │
│  │  2  │                                    │
│  ├─────┤                                    │
│  │  3  │                                    │
│  ├─────┤                                    │
│  │  4  │                                    │
│  └─────┘                                    │
└─────────────────────────────────────────────┘
```

## Grid Layout

### Grid Structure

```
┌─────────────────────────────────────────────┐
│           CSS Grid Layout                   │
├─────────────────────────────────────────────┤
│                                             │
│  Grid Lines (numbered from 1)               │
│                                             │
│     1      2      3      4                  │
│  1  ┌──────┬──────┬──────┐                  │
│     │      │      │      │                  │
│  2  ├──────┼──────┼──────┤                  │
│     │      │      │      │                  │
│  3  ├──────┼──────┼──────┤                  │
│     │      │      │      │                  │
│  4  └──────┴──────┴──────┘                  │
│                                             │
│  Grid Areas (named regions)                 │
│                                             │
│  ┌─────────────────┬──────────┐            │
│  │     header      │  header  │            │
│  ├──────┬──────────┼──────────┤            │
│  │ nav  │  main    │  main    │            │
│  │      │          │          │            │
│  ├──────┴──────────┴──────────┤            │
│  │       footer               │            │
│  └────────────────────────────┘            │
└─────────────────────────────────────────────┘
```

## Prototype Chain

### Object Inheritance

```
┌─────────────────────────────────────────────┐
│         Prototype Chain                     │
├─────────────────────────────────────────────┤
│                                             │
│  const obj = { name: 'John' }               │
│                                             │
│  obj                                        │
│  ├─ name: 'John'                            │
│  └─ __proto__                               │
│      ↓                                      │
│  Object.prototype                           │
│  ├─ toString()                              │
│  ├─ hasOwnProperty()                        │
│  ├─ valueOf()                               │
│  └─ __proto__                               │
│      ↓                                      │
│  null                                       │
│                                             │
│  Lookup Process:                            │
│  1. Check obj.name → Found ✓                │
│  2. Check obj.toString → Not found          │
│  3. Check Object.prototype.toString → Found ✓│
│  4. Check obj.nonExistent → Not found       │
│  5. Check Object.prototype.nonExistent      │
│     → Not found                             │
│  6. Check null → undefined                  │
└─────────────────────────────────────────────┘
```

## Closure Visualization

### Lexical Environment

```
┌─────────────────────────────────────────────┐
│           Closure Scope                     │
├─────────────────────────────────────────────┤
│                                             │
│  function outer() {                         │
│    const x = 10;  ← Outer scope             │
│                                             │
│    function inner() {                       │
│      console.log(x);  ← Accesses outer x   │
│    }                                        │
│                                             │
│    return inner;                            │
│  }                                          │
│                                             │
│  const fn = outer();                        │
│                                             │
│  Memory Structure:                          │
│  ┌─────────────────────────────────────┐   │
│  │  fn (inner function)                │   │
│  │  ├─ [[Scope]]                       │   │
│  │  │   └─ outer's lexical environment │   │
│  │  │       └─ x: 10                   │   │
│  │  └─ function code                   │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  fn() can still access x even after         │
│  outer() has finished executing             │
└─────────────────────────────────────────────┘
```

## Performance Metrics Timeline

### Core Web Vitals

```
┌─────────────────────────────────────────────┐
│      Performance Metrics Timeline           │
├─────────────────────────────────────────────┤
│                                             │
│  0s ────────────────────────────────── 10s  │
│   │                                         │
│   │ FCP (First Contentful Paint)            │
│   ├──→ 1.8s (Good)                          │
│   │                                         │
│   │ LCP (Largest Contentful Paint)          │
│   ├────────→ 2.5s (Good)                    │
│   │                                         │
│   │ FID (First Input Delay)                 │
│   │ User clicks ──→ Response                │
│   │              100ms (Good)               │
│   │                                         │
│   │ TTI (Time to Interactive)               │
│   ├──────────────→ 3.8s (Good)              │
│   │                                         │
│   │ CLS (Cumulative Layout Shift)           │
│   │ Measures visual stability               │
│   │ Score: 0.1 (Good)                       │
│                                             │
└─────────────────────────────────────────────┘
```

---

[← Back to Algorithm Visualizations](./12-visual-learning-02-algorithm-visualizations.md) | [Next: Testing →](./13-tools-ecosystem-04-testing-tools.md)
