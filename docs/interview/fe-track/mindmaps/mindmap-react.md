# React Mind Map - Quick Reference

> Sơ đồ tổng hợp tất cả concepts React quan trọng.

---

## 🗺️ React Core Concepts

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              REACT ECOSYSTEM                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                              ┌─────────────┐                                │
│                              │    REACT    │                                │
│                              └──────┬──────┘                                │
│                                     │                                        │
│      ┌──────────────────────────────┼──────────────────────────────┐        │
│      │                              │                              │        │
│      ▼                              ▼                              ▼        │
│ ┌─────────┐                  ┌─────────────┐               ┌─────────────┐  │
│ │Components│                  │   Hooks     │               │   State     │  │
│ └────┬────┘                  └──────┬──────┘               └──────┬──────┘  │
│      │                              │                              │        │
│ ┌────┴────┐              ┌──────────┼──────────┐         ┌────────┼────────┐│
│ │Function │              │          │          │         │        │        ││
│ │ Class   │              │          │          │         │        │        ││
│ └─────────┘              ▼          ▼          ▼         ▼        ▼        ▼│
│                     useState  useEffect  useRef    Local   Context  Redux  │
│                     useReducer useMemo   useCallback               Zustand │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🪝 Hooks Quick Reference

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 HOOKS                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   STATE HOOKS                                                                │
│   ┌───────────────────────────────────────────────────────────────────────┐ │
│   │ useState     │ Simple state values                                    │ │
│   │ useReducer   │ Complex state with actions                             │ │
│   └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│   EFFECT HOOKS                                                               │
│   ┌───────────────────────────────────────────────────────────────────────┐ │
│   │ useEffect       │ Side effects (fetch, subscriptions)                 │ │
│   │ useLayoutEffect │ Sync DOM mutations (measure, scroll)                │ │
│   │ useInsertionEffect │ CSS-in-JS libraries                              │ │
│   └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│   REF HOOKS                                                                  │
│   ┌───────────────────────────────────────────────────────────────────────┐ │
│   │ useRef             │ Mutable ref, DOM access                          │ │
│   │ useImperativeHandle│ Customize ref value                              │ │
│   └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│   PERFORMANCE HOOKS                                                          │
│   ┌───────────────────────────────────────────────────────────────────────┐ │
│   │ useMemo      │ Memoize computed values                                │ │
│   │ useCallback  │ Memoize functions                                      │ │
│   │ useTransition│ Non-blocking updates                                   │ │
│   │ useDeferredValue│ Defer updates                                       │ │
│   └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│   CONTEXT HOOKS                                                              │
│   ┌───────────────────────────────────────────────────────────────────────┐ │
│   │ useContext │ Read context value                                       │ │
│   └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│   OTHER HOOKS                                                                │
│   ┌───────────────────────────────────────────────────────────────────────┐ │
│   │ useId          │ Generate unique IDs                                  │ │
│   │ useSyncExternalStore│ Subscribe to external store                     │ │
│   │ useDebugValue  │ DevTools label                                       │ │
│   └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Component Patterns

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          COMPONENT PATTERNS                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   COMPOSITION                     LOGIC REUSE                               │
│   ┌─────────────────────┐        ┌─────────────────────┐                   │
│   │ • children prop     │        │ • Custom Hooks ⭐   │                   │
│   │ • Compound Components│        │ • HOC (legacy)     │                   │
│   │ • Render Props      │        │ • Render Props     │                   │
│   │ • Slots pattern     │        └─────────────────────┘                   │
│   └─────────────────────┘                                                   │
│                                                                              │
│   STATE PATTERNS                  PERFORMANCE                               │
│   ┌─────────────────────┐        ┌─────────────────────┐                   │
│   │ • Controlled        │        │ • React.memo        │                   │
│   │ • Uncontrolled      │        │ • useMemo           │                   │
│   │ • State reducer     │        │ • useCallback       │                   │
│   │ • State machine     │        │ • Virtualization    │                   │
│   └─────────────────────┘        │ • Code splitting    │                   │
│                                  └─────────────────────┘                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 State Management Decision Tree

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT DECISION                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Is it server data?                                                         │
│   │                                                                          │
│   ├── YES ──► React Query / SWR / Apollo                                    │
│   │                                                                          │
│   └── NO                                                                     │
│       │                                                                      │
│       ├── Local to one component? ──► useState / useReducer                 │
│       │                                                                      │
│       ├── Shared between few? ──► Lift state up + props                     │
│       │                                                                      │
│       ├── App-wide simple? ──► Context API                                  │
│       │                                                                      │
│       ├── Medium complexity? ──► Zustand                                    │
│       │                                                                      │
│       └── Large enterprise? ──► Redux Toolkit                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Performance Checklist

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PERFORMANCE CHECKLIST                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   RENDERING                                                                  │
│   [ ] State colocated (close to where it's used)                            │
│   [ ] React.memo for expensive pure components                              │
│   [ ] useMemo for expensive computations                                    │
│   [ ] useCallback for callbacks passed to memoized children                 │
│   [ ] Keys are stable and unique                                            │
│                                                                              │
│   BUNDLE                                                                     │
│   [ ] React.lazy for route-based splitting                                  │
│   [ ] Dynamic imports for heavy components                                  │
│   [ ] Tree shaking enabled                                                  │
│   [ ] Bundle analyzed and optimized                                         │
│                                                                              │
│   DATA                                                                       │
│   [ ] Pagination / infinite scroll for lists                                │
│   [ ] Virtualization for long lists (react-window)                          │
│   [ ] Data caching (React Query)                                            │
│   [ ] Optimistic updates                                                    │
│                                                                              │
│   MONITORING                                                                 │
│   [ ] React DevTools Profiler used                                          │
│   [ ] Web Vitals tracked                                                    │
│   [ ] Error boundaries in place                                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing Cheatsheet

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          TESTING QUICK REF                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   QUERIES (by priority)                                                      │
│   ┌───────────────────────────────────────────────────────────────────────┐ │
│   │ 1. getByRole('button', { name: /submit/i })    ── Most accessible     │ │
│   │ 2. getByLabelText('Email')                     ── Form fields         │ │
│   │ 3. getByPlaceholderText('Search...')          ── Input hints         │ │
│   │ 4. getByText('Welcome')                        ── Static text         │ │
│   │ 5. getByTestId('custom-id')                    ── Last resort         │ │
│   └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│   QUERY TYPES                                                                │
│   ┌───────────────────────────────────────────────────────────────────────┐ │
│   │ getBy*   ── Throws if not found (sync)                                │ │
│   │ queryBy* ── Returns null if not found (check non-existence)          │ │
│   │ findBy*  ── Waits for element (async)                                 │ │
│   └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│   USER EVENTS                                                                │
│   ┌───────────────────────────────────────────────────────────────────────┐ │
│   │ const user = userEvent.setup();                                       │ │
│   │ await user.click(button);                                             │ │
│   │ await user.type(input, 'text');                                       │ │
│   │ await user.clear(input);                                              │ │
│   │ await user.selectOptions(select, 'option');                           │ │
│   └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 React Internals Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           REACT INTERNALS                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   JSX ──► React.createElement() ──► React Element (object)                  │
│                                          │                                   │
│                                          ▼                                   │
│                                    Fiber Tree                                │
│                                          │                                   │
│                    ┌─────────────────────┴─────────────────────┐            │
│                    │                                           │            │
│                    ▼                                           ▼            │
│             RENDER PHASE                               COMMIT PHASE         │
│         (can be interrupted)                        (synchronous)           │
│                    │                                           │            │
│        • Build fiber tree                        • DOM updates              │
│        • Diff (reconciliation)                   • Run effects              │
│        • Pure computation                        • Layout effects           │
│                                                  • Passive effects          │
│                                                                              │
│   FIBER NODE:                                                                │
│   { type, key, stateNode, child, sibling, return, memoizedState, flags }   │
│                                                                              │
│   RECONCILIATION RULES:                                                      │
│   1. Different type ──► Replace subtree                                     │
│   2. Same type ──► Update attributes                                        │
│   3. Keys ──► Identify elements in lists                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Interview Quick Answers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TOP INTERVIEW QUESTIONS                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Q: Virtual DOM là gì?                                                      │
│   A: JS object representation của real DOM. Allows diffing & batching.      │
│                                                                              │
│   Q: Tại sao keys quan trọng?                                               │
│   A: Help React identify elements in lists. Efficient reordering.           │
│                                                                              │
│   Q: useEffect vs useLayoutEffect?                                          │
│   A: useEffect: async after paint. useLayoutEffect: sync before paint.      │
│                                                                              │
│   Q: React.memo vs useMemo?                                                 │
│   A: React.memo: memoize component. useMemo: memoize value.                 │
│                                                                              │
│   Q: Controlled vs Uncontrolled?                                            │
│   A: Controlled: React owns state. Uncontrolled: DOM owns state.            │
│                                                                              │
│   Q: Context vs Redux?                                                       │
│   A: Context: simple global state. Redux: complex state + middleware.       │
│                                                                              │
│   Q: HOC vs Custom Hooks?                                                   │
│   A: Custom Hooks preferred. HOC: wrapper hell, prop collision.             │
│                                                                              │
│   Q: Fiber là gì?                                                           │
│   A: Unit of work. Enables incremental rendering & prioritization.          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Related Topics

- [01-react-fundamentals.md](./01-react-fundamentals.md) - Components, JSX, Props
- [02-hooks-deep-dive.md](./02-hooks-deep-dive.md) - All Hooks
- [03-state-management.md](./03-state-management.md) - Context, Redux, Zustand
- [04-component-patterns.md](./04-component-patterns.md) - HOC, Render Props
- [05-react-internals.md](./05-react-internals.md) - Fiber, Reconciliation
- [06-performance-optimization.md](./06-performance-optimization.md) - Memoization
- [07-testing-react.md](./07-testing-react.md) - Testing Library, Jest

---

> **Quick Review Time:** 15 phút mỗi ngày với mindmap này
