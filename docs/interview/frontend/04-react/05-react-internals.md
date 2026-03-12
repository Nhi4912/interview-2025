# React Internals - Fiber & Reconciliation

> Hiểu React internals giúp viết code performant và debug issues hiệu quả. Essential cho senior interviews.

---

## Mục Lục

- [Overview](#-overview)
- [Virtual DOM](#-virtual-dom)
- [Reconciliation](#-reconciliation)
- [Fiber Architecture](#-fiber-architecture)
- [Rendering Process](#-rendering-process)
- [Concurrent Features](#-concurrent-features)
- [Câu Hỏi Phỏng Vấn](#-câu-hỏi-phỏng-vấn)

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                REACT RENDERING PIPELINE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   JSX                                                            │
│    │                                                              │
│    ▼                                                              │
│   ┌──────────────────┐                                           │
│   │ React.createElement│  ──► React Element (object)             │
│   └────────┬─────────┘                                           │
│            │                                                      │
│            ▼                                                      │
│   ┌──────────────────┐                                           │
│   │   Fiber Tree     │  ──► Internal work units                  │
│   └────────┬─────────┘                                           │
│            │                                                      │
│            ▼                                                      │
│   ┌──────────────────┐                                           │
│   │  Reconciliation  │  ──► Diff algorithm                       │
│   └────────┬─────────┘                                           │
│            │                                                      │
│            ▼                                                      │
│   ┌──────────────────┐                                           │
│   │   Commit Phase   │  ──► DOM updates                          │
│   └──────────────────┘                                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌳 Virtual DOM

### What is Virtual DOM?

```javascript
// JSX
const element = <h1 className="title">Hello</h1>;

// Compiles to
const element = React.createElement(
    'h1',
    { className: 'title' },
    'Hello'
);

// Creates React Element (plain object)
const element = {
    type: 'h1',
    props: {
        className: 'title',
        children: 'Hello'
    },
    key: null,
    ref: null
};
```

### Virtual DOM Tree

```
┌─────────────────────────────────────────────────────────────────┐
│                     VIRTUAL DOM TREE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   React Component Tree          Virtual DOM                       │
│                                                                   │
│   <App>                         {type: App, props: {...}}        │
│   ├── <Header>         ──►      ├── {type: Header, ...}          │
│   │   └── <h1>                  │   └── {type: 'h1', ...}        │
│   └── <Main>                    └── {type: Main, ...}            │
│       ├── <Article>                 ├── {type: Article, ...}     │
│       └── <Sidebar>                 └── {type: Sidebar, ...}     │
│                                                                   │
│   Benefits:                                                       │
│   • Lightweight (just objects)                                   │
│   • Fast diffing                                                 │
│   • Batch updates                                                │
│   • Cross-platform (React Native)                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Reconciliation

### Diffing Algorithm

```
┌─────────────────────────────────────────────────────────────────┐
│                   RECONCILIATION RULES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Rule 1: Different types = Replace entire subtree               │
│   ┌──────┐      ┌──────┐                                        │
│   │ <div>│  →   │<span>│   = Unmount div, mount span            │
│   └──────┘      └──────┘                                        │
│                                                                   │
│   Rule 2: Same type = Update attributes                          │
│   ┌────────────┐      ┌────────────┐                            │
│   │<div id="a">│  →   │<div id="b">│   = Update id attribute    │
│   └────────────┘      └────────────┘                            │
│                                                                   │
│   Rule 3: Keys identify elements in lists                        │
│   [A, B, C] → [B, A, C]                                          │
│   Without keys: Update all three                                 │
│   With keys: Just reorder                                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Keys in Reconciliation

```jsx
// Without keys - inefficient
// Old: [Item A, Item B, Item C]
// New: [Item D, Item A, Item B, Item C]
// React: "First changed, second changed, third changed, fourth is new"
// Updates ALL items!

// With keys - efficient
// Old: [A:1, B:2, C:3]
// New: [D:4, A:1, B:2, C:3]
// React: "1,2,3 same position changed, 4 is new"
// Only inserts new item!

function List({ items }) {
    return (
        <ul>
            {items.map(item => (
                // ✅ Stable, unique key
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    );
}
```

---

## 🧵 Fiber Architecture

### What is Fiber?

Fiber = Unit of work. Introduced in React 16 to enable:
- Incremental rendering
- Pause/resume work
- Priority-based updates
- Concurrent features

```
┌─────────────────────────────────────────────────────────────────┐
│                      FIBER NODE                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   {                                                               │
│     tag: FunctionComponent,     // Type of fiber                 │
│     type: App,                  // Component function/class      │
│     key: null,                                                   │
│     stateNode: null,            // DOM node for host components  │
│                                                                   │
│     // Fiber Tree Structure                                      │
│     return: parentFiber,        // Parent                        │
│     child: firstChildFiber,     // First child                   │
│     sibling: nextSiblingFiber,  // Next sibling                  │
│                                                                   │
│     // State & Props                                             │
│     pendingProps: {...},                                         │
│     memoizedProps: {...},                                        │
│     memoizedState: {...},       // Hooks linked list             │
│                                                                   │
│     // Effects                                                   │
│     flags: Update,              // Side effects to perform       │
│     nextEffect: fiber,          // Next fiber with effects       │
│                                                                   │
│     // Work scheduling                                           │
│     lanes: SyncLane,            // Priority                      │
│     alternate: workInProgressFiber                               │
│   }                                                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Fiber Tree Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    FIBER TREE TRAVERSAL                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Component Tree:               Fiber Links:                     │
│                                                                   │
│       App                       App ──child──► Header            │
│      /   \                      │                │               │
│   Header  Main                  │              sibling           │
│     |    /    \                 │                │               │
│    Nav  List  Footer            │                ▼               │
│                                 │              Main ───► Footer  │
│                                 │                │               │
│                                 │              child             │
│                                 │                │               │
│                                 │                ▼               │
│                                 │              List              │
│                                 │                                │
│   Each fiber has:                                                │
│   • return → parent                                              │
│   • child → first child                                          │
│   • sibling → next sibling                                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Double Buffering

```
┌─────────────────────────────────────────────────────────────────┐
│                   DOUBLE BUFFERING                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Current Tree                 Work-in-Progress Tree             │
│   (displayed)                  (being built)                     │
│                                                                   │
│   ┌──────────┐                 ┌──────────┐                      │
│   │   App    │ ◄── alternate ──│   App    │                      │
│   └────┬─────┘                 └────┬─────┘                      │
│        │                            │                             │
│   ┌────┴────┐                  ┌────┴────┐                       │
│   │ Header  │                  │ Header  │ (updated)             │
│   └─────────┘                  └─────────┘                       │
│                                                                   │
│   After commit:                                                  │
│   WIP becomes current, old current becomes WIP for next update  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎬 Rendering Process

### Two Phases

```
┌─────────────────────────────────────────────────────────────────┐
│                   RENDER & COMMIT PHASES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   RENDER PHASE (can be interrupted)                              │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ • Pure, no side effects                                  │   │
│   │ • Build fiber tree                                       │   │
│   │ • Calculate changes (diffing)                            │   │
│   │ • Can be paused/aborted/restarted                        │   │
│   │                                                          │   │
│   │ Lifecycle: render, getDerivedStateFromProps             │   │
│   │ Hooks: useMemo, useState (read only)                    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│   COMMIT PHASE (synchronous, cannot be interrupted)             │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ • Apply changes to DOM                                   │   │
│   │ • Run effects                                            │   │
│   │ • Must complete in one go                                │   │
│   │                                                          │   │
│   │ Sub-phases:                                              │   │
│   │ 1. Before mutation: getSnapshotBeforeUpdate             │   │
│   │ 2. Mutation: DOM updates                                 │   │
│   │ 3. Layout: useLayoutEffect, componentDidMount/Update    │   │
│   │ 4. Passive effects: useEffect (async)                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Hooks Storage

```
┌─────────────────────────────────────────────────────────────────┐
│                    HOOKS AS LINKED LIST                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   function Counter() {                                           │
│     const [count, setCount] = useState(0);      // Hook 1       │
│     const [name, setName] = useState('');       // Hook 2       │
│     useEffect(() => { ... }, [count]);          // Hook 3       │
│   }                                                              │
│                                                                   │
│   Fiber.memoizedState:                                           │
│                                                                   │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│   │ Hook 1       │───►│ Hook 2       │───►│ Hook 3       │      │
│   │ state: 0     │    │ state: ''    │    │ effect: {...}│      │
│   │ queue: [...]│    │ queue: [...]│    │ deps: [0]    │      │
│   └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                                   │
│   This is why hooks must be called in same order every render!  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Concurrent Features

### React 18 Concurrent Rendering

```jsx
// Automatic Batching
function handleClick() {
    setCount(c => c + 1);
    setFlag(f => !f);
    // Both updates batched into single re-render
}

// Transitions
function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const [isPending, startTransition] = useTransition();

    const handleChange = (e) => {
        // Urgent: Update input immediately
        setQuery(e.target.value);

        // Non-urgent: Can be interrupted
        startTransition(() => {
            setResults(search(e.target.value));
        });
    };

    return (
        <>
            <input value={query} onChange={handleChange} />
            {isPending ? <Spinner /> : <Results data={results} />}
        </>
    );
}

// Suspense
function ProfilePage() {
    return (
        <Suspense fallback={<Spinner />}>
            <UserProfile />
            <Suspense fallback={<PostsSkeleton />}>
                <UserPosts />
            </Suspense>
        </Suspense>
    );
}
```

### Priority Lanes

```
┌─────────────────────────────────────────────────────────────────┐
│                    UPDATE PRIORITIES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Priority (High → Low)                                          │
│                                                                   │
│   1. SyncLane            ── Discrete user events (click)        │
│   2. InputContinuousLane ── Continuous events (scroll, drag)    │
│   3. DefaultLane         ── Normal updates (setState)           │
│   4. TransitionLane      ── Transitions (startTransition)       │
│   5. IdleLane            ── Low priority (offscreen)            │
│                                                                   │
│   Higher priority updates can interrupt lower priority work     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Virtual DOM là gì? Tại sao cần?**

A: Virtual DOM là lightweight JavaScript representation của real DOM. Benefits:
- Batching multiple updates
- Minimizing real DOM operations (expensive)
- Cross-platform rendering (React Native)

### 🟡 Mid-level

**Q: Giải thích reconciliation algorithm**

A: Reconciliation compares old and new Virtual DOM trees:
1. Different element types → Replace entire subtree
2. Same type → Update attributes only
3. Keys identify elements in lists for efficient reordering
4. O(n) complexity vs O(n³) naive tree diff

**Q: Render phase vs Commit phase?**

A:
- Render: Pure, builds fiber tree, can be interrupted (async)
- Commit: Side effects, DOM updates, must complete synchronously

### 🔴 Senior

**Q: Giải thích Fiber architecture**

A: Fiber là unit of work representing a component. Key features:
- Linked list structure (child, sibling, return)
- Double buffering (current vs WIP tree)
- Incremental rendering (can pause/resume)
- Priority-based scheduling (lanes)
- Enables concurrent features

**Q: Tại sao hooks phải gọi theo thứ tự?**

A: Hooks stored as linked list in fiber's memoizedState. React relies on call order to match hook with its state. Conditional hooks break this mapping.

---

## 📚 Active Recall

1. [ ] Vẽ diagram Fiber tree structure
2. [ ] Giải thích double buffering
3. [ ] So sánh Render vs Commit phase
4. [ ] Tại sao keys quan trọng cho reconciliation?
5. [ ] useTransition work như thế nào?

---

> **Tiếp theo:** [06-performance-optimization.md](./06-performance-optimization.md) - Performance Optimization
