# React Fundamentals / Nền Tảng React

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [JavaScript Closures](../01-javascript/03-closures-comprehensive.md) | [Event Loop](../01-javascript/06-event-loop-async.md)
> **See also**: [Hooks Deep Dive](./03-hooks-deep-dive.md) | [React Patterns](./08-react-patterns-advanced.md)

[Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./02-react-19-features.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Bug tại một team e-commerce 2023:** Engineer build dashboard hiển thị real-time inventory. Dùng vanilla JS:

```javascript
// Update DOM manually on every WebSocket message
ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  document.getElementById("stock-" + data.id).innerText = data.count;
  document.getElementById("price-" + data.id).innerText = data.price;
  // ... 20 more manual updates
};
```

Sau 2 tuần: UI desynced với data, race condition khi nhiều messages cùng lúc, memory leak vì không cleanup event listeners. Toàn bộ codebase là mớ hỗn độn — data ở chỗ này, DOM update ở chỗ khác.

**React giải quyết với một triết lý đơn giản:**

> `UI = f(state)` — Thay đổi state → React tự tính toán và update DOM. Không bao giờ touch DOM manually.

---

## What & Why / Cái Gì & Tại Sao

**Analogy — Excel Spreadsheet:**
Ô A1 là state. Ô B1 có công thức `=A1 * 2`. Khi A1 thay đổi → B1 tự cập nhật — bạn không cần "nói" cho B1 biết. React hoạt động y hệt: component = công thức, state = input, UI = output.

**3 ý tưởng cốt lõi:**

| Ý tưởng                      | Nghĩa là                                       | Tại sao quan trọng                 |
| ---------------------------- | ---------------------------------------------- | ---------------------------------- |
| **Declarative**              | Mô tả UI trông như thế nào, không nói cách làm | Code dễ đọc, ít bug hơn imperative |
| **Component-based**          | UI = cây component nhỏ, reusable               | Tái sử dụng, test độc lập          |
| **Unidirectional data flow** | Data chỉ từ parent → child                     | Predictable, dễ debug              |

---

## Concept Map / Bản Đồ Khái Niệm

```
    [JavaScript: Closures, Events, Async]
                    │
                    ▼
          [REACT FUNDAMENTALS] ← bạn đang ở đây
                    │
    ┌───────────────┼────────────────┐
    ▼               ▼                ▼
[JSX → createElement]  [Virtual DOM]  [Fiber]
  plain objects          reconcile      priority lanes
  immutable desc         diffing O(n)   concurrent mode
    │                    │              │
    └───────────────┬────┘              │
                    ▼                   │
            [Render → Commit Phase]←───┘
            pure calc → DOM flush
                    │
                    ▼
            [Hooks] → [Data Flow] → [Next.js]
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. JSX & React Elements

> 🧠 **Memory Hook:** "JSX = syntax sugar. `<Button color='red' />` compiles to `React.createElement(Button, {color:'red'})` — returns a **plain JS object**, not a DOM node."

**Tại sao tồn tại? / Why does this exist?**
HTML trong JavaScript dễ đọc hơn nested function calls. JSX = developer ergonomics, không phải magic.
→ Tại sao không dùng template strings? → JSX is type-checked by TypeScript, template strings aren't
→ Tại sao React elements immutable? → Immutability enables fast comparison (reference check) in reconciliation

#### Layer 1: JSX compiles to createElement

```jsx
// JSX (what you write)
const element = <Button color="red">Click me</Button>;

// Compiled (what runs) — React 17+ uses jsx() from react/jsx-runtime
const element = React.createElement(Button, { color: 'red' }, 'Click me');

// Result: a plain JS object
{
  type: Button,
  props: { color: 'red', children: 'Click me' },
  key: null,
  ref: null,
}
```

#### Layer 2: Key Rules

```jsx
// 1. Single root — use Fragment to avoid extra DOM node
return (
  <>
    <Header />
    <Main />
  </>
);

// 2. Expressions only in {} — no statements
return <div>{isLoggedIn ? <Dashboard /> : <Login />}</div>;
// ❌ return <div>{if (isLoggedIn) <Dashboard />}</div>;  // syntax error

// 3. className not class, htmlFor not for (maps to DOM properties)
return (
  <label htmlFor="email" className="label">
    Email
  </label>
);

// 4. GOTCHA: {count && <List />} renders "0" when count === 0
// Fix: {count > 0 && <List />} or {count ? <List /> : null}
```

#### Layer 3: Elements are Immutable, Components are Functions

```jsx
// Element: snapshot of UI at a moment in time (immutable)
const el = <h1>Hello</h1>; // cannot mutate el.props.children

// Component: function that produces elements on each call
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>; // new element each render
}

// React elements compared by type + key, NOT by reference
// === on elements always false (new object each call)
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                            | Tại sao sai                                                  | Đúng là                                       |
| ---------------------------------- | ------------------------------------------------------------ | --------------------------------------------- |
| `{0 && <Component />}` renders "0" | `0` is falsy but JSX renders it                              | `{count > 0 && <Component />}`                |
| `class` instead of `className`     | JSX maps to DOM properties, not HTML attributes              | `className`, `htmlFor`, `onClick` (camelCase) |
| Define component inside render     | New function reference each render → React unmounts/remounts | Define component at module top-level          |

**🎯 Interview Pattern:**

- Khi thấy: "JSX compile thành gì?"
- → Mở đầu: "JSX là syntax sugar compile thành `React.createElement` calls (hoặc `jsx()` từ React 17). Kết quả là plain JS object mô tả UI — không phải DOM node..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: JavaScript objects, function calls
- ➡️ Để hiểu: Virtual DOM & Reconciliation (section 2 dưới)

---

### 2. Virtual DOM & Reconciliation

> 🧠 **Memory Hook:** "Virtual DOM = **draft trước khi in**. React so sánh draft cũ vs mới → chỉ in những thay đổi. O(n) nhờ 2 heuristics: different type = raze & rebuild, same type = update props."

**Tại sao tồn tại? / Why does this exist?**
DOM manipulation trực tiếp là chậm (reflow, repaint) và error-prone. Virtual DOM = in-memory representation.
→ Tại sao không diff toàn bộ DOM? → O(n³) complexity → VDOM với 2 heuristics → O(n)
→ Tại sao không Svelte approach (compiled)? → React's VDOM cho more flexibility at runtime; Svelte faster for simple apps

#### Layer 1: Simple Analogy

Khi sửa tài liệu Word: đừng in lại toàn bộ — chỉ thay trang có thay đổi. Virtual DOM = React compare bản draft trước và bản draft mới, chỉ cập nhật đúng phần DOM thật đã thay đổi.

#### Layer 2: The Diffing Algorithm (2 Heuristics)

```
Heuristic 1: Different element type → raze subtree & rebuild
  Before: <div><Counter /></div>
  After:  <span><Counter /></span>
  → div→span = different type → unmount Counter, mount new Counter
  Consequence: Counter state LOST

Heuristic 2: Same type + matching key → update props, keep instance
  Before: <li key="a">Alice</li>
  After:  <li key="a">Alice Smith</li>
  → same type + same key → just update text content
  Consequence: component state PRESERVED
```

```jsx
// The key heuristic in lists
// ❌ Using index as key — breaks when list reorders
{
  items.map((item, i) => <Item key={i} data={item} />);
}

// ✅ Using stable id as key
{
  items.map((item) => <Item key={item.id} data={item} />);
}
// React can correctly track which items moved/added/removed
```

#### Layer 3: Rendering is NOT DOM Mutation

```
React's 2-phase model:
┌─────────────────────────────────────────────┐
│  RENDER PHASE (pure, interruptible)         │
│  • Call render functions / function bodies  │
│  • Build work-in-progress fiber tree        │
│  • NO side effects, NO DOM touches         │
│  • Can be thrown away and restarted (Concurrent) │
└─────────────────────┬───────────────────────┘
                      │ (after all components rendered)
┌─────────────────────▼───────────────────────┐
│  COMMIT PHASE (synchronous, DOM mutations)  │
│  • beforeMutation → mutation → layout       │
│  • Flush to real DOM (atomically)           │
│  • Run useLayoutEffect                      │
│  • Schedule useEffect                       │
└─────────────────────────────────────────────┘
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                       | Tại sao sai                                                | Đúng là                                                    |
| --------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| "Virtual DOM luôn nhanh hơn direct DOM"       | VDOM overhead không nhỏ — Svelte nhanh hơn cho simple apps | VDOM tốt cho complex UIs với unpredictable update patterns |
| Dùng array index làm key                      | Reorder phá vỡ diffing — state bị assign sai component     | Dùng stable unique id từ data                              |
| Mutation trong render (side effect in render) | Render phase có thể chạy nhiều lần (Concurrent Mode)       | Side effects chỉ trong useEffect / commit phase            |

**🎯 Interview Pattern:**

- Khi thấy: "Virtual DOM là gì? Tại sao key quan trọng?"
- → Mở đầu: "Virtual DOM là in-memory representation của UI. Reconciliation so sánh 2 VDOM trees với O(n) algorithm nhờ 2 heuristics: khác type = rebuild hoàn toàn, cùng type + key = update props..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: JSX & React Elements (section 1)
- ➡️ Để hiểu: Fiber Architecture (section 3), React.memo optimization

---

### 3. Fiber Architecture & Concurrent Mode

> 🧠 **Memory Hook:** "Fiber = React's **scheduler**. Trước Fiber: sync recursive (không dừng được). Sau Fiber: interruptible, prioritized. `startTransition` = 'low priority lane'."

**Tại sao tồn tại? / Why does this exist?**
React 15 reconciliation: sync recursive → không thể interrupt → long tasks blocked main thread → janky UI.
→ Tại sao không Web Workers? → Fiber tree contains DOM references — can't serialize to Worker
→ Fiber solution: represent work as linked list of objects, process incrementally, yield to browser between units

#### Layer 1: Simple Analogy

React 15 = chef nấu 1 món phức tạp không nghỉ — khách chờ mãi. React Fiber = chef chia nhỏ thành steps, giữa mỗi step check "có order gấp không?" — nếu có, xử lý order gấp trước, quay lại sau.

#### Layer 2: Fiber Internals

```
Each Fiber object:
{
  type: Button,           // component function or DOM tag
  stateNode: <dom node>,  // actual DOM node (null until commit)
  child: Fiber,           // first child
  sibling: Fiber,         // next sibling
  return: Fiber,          // parent
  memoizedState: hooks,   // hooks linked list
  lanes: bitmask,         // priority: SyncLane > InputLane > TransitionLane
  flags: bitmask,         // what to do in commit: Update | Placement | Deletion
}

Double buffering:
[current tree] ←────── swapped after commit ──────► [work-in-progress tree]
(on screen)                                          (being built)
```

```jsx
// Priority: startTransition marks update as low-priority
import { useTransition, useState } from "react";

function SearchApp() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    setQuery(e.target.value); // HIGH priority — input stays responsive
    startTransition(() => {
      setResults(heavySearch(e.target.value)); // LOW priority — can be interrupted
    });
  }

  return (
    <>
      <input onChange={handleChange} value={query} />
      {isPending ? <Spinner /> : <ResultsList items={results} />}
    </>
  );
}
```

#### Layer 3: Implications for Code

```
Concurrent Mode changes:
1. render function may be called MULTIPLE TIMES for one update
   → Must be PURE (no side effects in render body)
2. state updates in low-priority transitions may be skipped
   → startTransition is a HINT not a guarantee
3. Suspense + Fiber: throw Promise → React pauses work-in-progress, shows fallback
   → Component can "suspend" data loading
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                           | Tại sao sai                                                | Đúng là                                                        |
| ------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------- |
| Side effects in render body                       | Concurrent mode may call render multiple times             | Side effects only in useEffect                                 |
| `startTransition` cho mọi update                  | It's a hint, not a guarantee — adds overhead               | Only for expensive non-urgent updates (e.g., search filtering) |
| Mutation of state directly: `state.items.push(x)` | React uses reference comparison for state change detection | Always return new reference: `setState([...state.items, x])`   |

**🎯 Interview Pattern:**

- Khi thấy: "Concurrent Mode là gì? Fiber là gì?"
- → Mở đầu: "Fiber là React's incremental work unit — cho phép interrupt và resume rendering. Concurrent Mode dựa trên Fiber để prioritize user interactions over background work..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: Virtual DOM & Reconciliation (section 2)
- ➡️ Để hiểu: useTransition, Suspense, React Server Components

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q1: `UI = f(state)` có nghĩa gì trong React? 🟢 Junior

**A:** Every component is a pure function (conceptually): given the same state/props, it returns the same UI. React manages "calling" components when state changes and diffing results to update DOM. This model eliminates the need to manually track what DOM elements need updating.

Mỗi component là hàm thuần túy: cùng state/props → cùng UI. React tự gọi lại component khi state thay đổi và so sánh kết quả để update DOM. Model này loại bỏ việc theo dõi thủ công "DOM nào cần update".

**💡 Interview Signal:**

- ✅ Strong: Kết nối đến declarative vs imperative, giải thích unidirectional flow, mention pure function requirement
- ❌ Weak: "React cập nhật DOM khi state thay đổi" — đúng nhưng không giải thích tại sao model này tốt hơn

---

### Q2: Giải thích Virtual DOM và reconciliation 🟢 Junior

**A:** Virtual DOM is an in-memory JavaScript representation of the UI. When state changes, React builds a new VDOM tree, diffs it against the previous tree (reconciliation), and applies only the necessary real DOM mutations. The diffing algorithm is O(n) thanks to two heuristics: (1) different element type → rebuild entire subtree, (2) same type + matching key → update props.

VDOM là cây JS object đại diện UI. Khi state thay đổi, React build VDOM mới, so sánh với VDOM cũ, và chỉ apply thay đổi tối thiểu lên real DOM. Thuật toán O(n) nhờ 2 heuristics: khác type = rebuild, cùng type + key = update props.

**💡 Interview Signal:**

- ✅ Strong: Nêu O(n) complexity và 2 heuristics, biết trade-off (VDOM không luôn nhanh hơn), giải thích được tại sao key quan trọng
- ❌ Weak: "Virtual DOM nhanh hơn real DOM" — oversimplification, Svelte không dùng VDOM vẫn nhanh hơn

---

### Q3: Tại sao dùng `key` prop? Index là key tốt không? 🟡 Mid

**A:** `key` gives React a stable identity for elements across renders, enabling correct diffing in lists. Using array index as key breaks when the list is reordered or filtered: React matches old element at index 2 with new element at index 2 — even if they're completely different items. This causes state to be assigned to the wrong components (e.g., controlled input keeps the old value).

`key` cho React nhận dạng element qua các lần render. Index là key tệ khi list reorder: React match old[2] với new[2] — dù đó là item hoàn toàn khác. State bị assign sai component — ví dụ controlled input giữ value cũ.

```jsx
// Bug: filter removes first item, todos shift up, state(old[1]) → new[0]
{
  todos.map((t, i) => <TodoItem key={i} todo={t} />);
} // ❌

// Fix: stable id
{
  todos.map((t) => <TodoItem key={t.id} todo={t} />);
} // ✅
```

**💡 Interview Signal:**

- ✅ Strong: Giải thích được bug cụ thể (state assigned to wrong item), biết 2 cases index-as-key là OK (static list, no filter/sort)
- ❌ Weak: "Key giúp React render nhanh hơn" — đúng một phần nhưng miss the correctness aspect

---

### Q4: Render phase vs Commit phase khác nhau như thế nào? 🟡 Mid

**A:** **Render phase**: React calls component functions, builds work-in-progress fiber tree. It is **pure** (no DOM mutations) and **interruptible** in Concurrent Mode — React may call render functions multiple times before committing. **Commit phase**: React flushes all changes to real DOM synchronously — this cannot be interrupted. `useLayoutEffect` runs synchronously after DOM mutations. `useEffect` is scheduled after the browser paints.

Render phase: gọi component functions, build fiber tree — thuần túy, có thể interrupt. Commit phase: flush thay đổi lên DOM đồng bộ — không thể interrupt. `useLayoutEffect` chạy đồng bộ sau DOM update, `useEffect` chạy sau khi browser paint.

**💡 Interview Signal:**

- ✅ Strong: Biết render có thể chạy nhiều lần (Concurrent Mode), giải thích side-effects phải ở commit phase, phân biệt `useLayoutEffect` vs `useEffect`
- ❌ Weak: Chỉ mô tả lifecycle mà không đề cập Concurrent Mode implication

---

### Q5: Stale closure trong React hooks — nguyên nhân và fix 🔴 Senior

**A:** Each render creates a closure that captures props/state at that render's moment. An async callback or `useEffect` from render N still references render N's state, even if state has since updated to render N+1. This contrasts with class components where `this.state` always reads current.

Mỗi render tạo closure capture props/state tại thời điểm đó. Async callback từ render N vẫn dùng state của render N, dù state đã update thành N+1. Class components luôn đọc `this.state` hiện tại — không bị stale.

```jsx
// Bug: count always 0 in the interval callback
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count); // Always 0 — stale closure!
      setCount(count + 1); // Bug: count + 1 = 0 + 1 = 1, never goes above 1
    }, 1000);
    return () => clearInterval(id);
  }, []); // Empty deps — closure captures count=0 forever
}

// Fix 1: Functional updater — doesn't need to read count
setCount((prev) => prev + 1); // ✅ prev is always latest

// Fix 2: useRef to hold latest value
const countRef = useRef(count);
useEffect(() => {
  countRef.current = count;
}, [count]);
// Then: use countRef.current in callback
```

**💡 Interview Signal:**

- ✅ Strong: Giải thích closure capture tại render time, biết cả 2 fix (functional updater và useRef), đề cập khi nào dùng cái nào
- ❌ Weak: "Thêm count vào dependency array" — đúng nhưng tạo interval mới mỗi giây (không phải intent)

---

### Q6: `key` prop trên component đơn lẻ (không trong list) — dùng để làm gì? 🟡 Mid

**A:** Using `key` on a standalone component forces a **full remount** when the key changes. React sees different `key` = different component instance = destroy old, mount new (all state reset). This is useful for resetting component state when context changes, avoiding complex reset logic in `useEffect`.

Dùng `key` trên component đơn lẻ buộc remount khi key thay đổi. Hữu ích để reset hoàn toàn state khi context thay đổi — sạch hơn `useEffect` reset logic.

```jsx
// When userId changes, UserProfile fully remounts (all state reset)
// No need for useEffect cleanup + reset logic
<UserProfile key={userId} userId={userId} />

// vs complex useEffect reset (error-prone)
// useEffect(() => { resetAllFormFields(); fetchUserData(); }, [userId]);
```

**💡 Interview Signal:**

- ✅ Strong: Đây là documented React pattern ("keyed components"), biết tại sao nó clean hơn useEffect reset, biết trade-off (loses animation/transition state)
- ❌ Weak: Không biết `key` có thể dùng ngoài list

---

### Q7: Design: implement virtualized list cho 100,000 items 🔴 Senior (Create)

**A:** Rendering 100k DOM nodes = crash. Virtualization renders only visible items (~20-50) and recycles DOM nodes as user scrolls.

```jsx
function VirtualList({ items, itemHeight = 50, containerHeight = 500 }) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 1; // +1 for partial
  const endIndex = Math.min(startIndex + visibleCount, items.length);

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <div
      style={{ height: containerHeight, overflow: "auto", position: "relative" }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      {/* Spacer to create scrollable height */}
      <div style={{ height: totalHeight, position: "relative" }}>
        {/* Visible items positioned absolutely */}
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, i) => (
            <div key={items[startIndex + i].id} style={{ height: itemHeight }}>
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// Production: use react-window or react-virtual (handles edge cases)
```

**Key decisions:** debounce scroll handler (can add), use `translateY` not `marginTop` (GPU compositing), key by item.id not index.

**💡 Interview Signal:**

- ✅ Strong: Implement window calculation correctly, explain why translateY over top/marginTop (GPU layer), mention production libraries and their trade-offs
- ❌ Weak: "Use react-window" — OK to mention but need to explain the mechanism

---

## 📋 Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Câu hỏi                                            | Difficulty | Core Concept       | Key Signal                                   |
| --- | -------------------------------------------------- | ---------- | ------------------ | -------------------------------------------- |
| 1   | `UI = f(state)` có nghĩa gì trong React?           | 🟢 Junior  | React model        | Pure function mental model, deterministic UI |
| 2   | Giải thích Virtual DOM và reconciliation           | 🟢 Junior  | Reconciliation     | Diff algorithm + minimal DOM mutations       |
| 3   | Tại sao dùng `key` prop? Index là key tốt không?   | 🟡 Mid     | Reconciliation     | Index key pitfalls với dynamic lists         |
| 4   | Render phase vs Commit phase khác nhau?            | 🟡 Mid     | React internals    | Pure render vs side-effect commit            |
| 5   | Stale closure trong hooks — nguyên nhân và fix     | 🔴 Senior  | Closure mechanics  | Identify pattern + 3 fix strategies          |
| 6   | `key` prop trên component đơn lẻ — dùng để làm gì? | 🟡 Mid     | Component identity | Force remount để reset state                 |
| 7   | Thiết kế virtualized list cho 100,000 items        | 🔴 Senior  | Performance design | Window calculation + translateY              |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer hỏi cold: **"Giải thích cách React update DOM khi state thay đổi."**

**30 giây đầu — mở đầu lý tưởng:**

1. "React theo model `UI = f(state)`. Khi state thay đổi, React gọi lại component function để tính toán UI mới."
2. "React build Virtual DOM tree mới — in-memory JS object, không phải real DOM. Sau đó so sánh (reconcile) với tree trước đó dùng O(n) diffing algorithm."
3. "Dựa trên diff, React tính toán minimal set of DOM mutations cần thiết — thay vì rebuild toàn bộ DOM."
4. "Các mutations được apply trong Commit Phase — đồng bộ, một lần — đảm bảo user không bao giờ thấy UI ở trạng thái nửa chừng."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                                                |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 🔍 Retrieval   | Vẽ React rendering pipeline từ trí nhớ: state change → Render Phase → Commit Phase → browser paint. Mỗi phase làm gì?                                  |
| 2   | 🎨 Visual      | Giải thích tại sao `{0 && <Component />}` render chữ "0" — vẽ luồng từ JSX → `createElement` → render output.                                          |
| 3   | 🛠️ Application | List 10,000 users với search filter, state là array. Tại sao `key=index` sai khi filter? Khi nào `key=index` là OK?                                    |
| 4   | 🐛 Debug       | Component có stale closure bug trong `useEffect` với `setInterval` — counter không tăng đúng. Identify bug và fix mà không thay đổi interval behavior. |
| 5   | 🎓 Teach       | Giải thích Virtual DOM cho người chỉ biết HTML/CSS — dùng ví dụ Word document và track changes feature.                                                |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Render Phase: gọi component functions, tạo virtual DOM, so sánh (reconciliation) — không side effects. Commit Phase: apply DOM mutations, chạy effects.            |
| 2   | `0 && x` evaluate `0` (falsy) → return `0` (not `false`). JSX render numbers. Fix: `!!count && <Comp />` hoặc `count > 0 && <Comp />` hoặc ternary.                |
| 3   | `key=index` sai khi items có thể reorder/filter: React map key → component state → wrong state paired to wrong item. OK khi: static list, không có state per item. |
| 4   | `setInterval` capture stale `count` từ closure. Fix: dùng functional update `setCount(c => c + 1)` — không cần read current count từ closure.                      |
| 5   | Virtual DOM = "bản nháp" thay đổi. Như Word: bạn edit bản nháp, Word track changes và chỉ apply diff vào document thật — không rewrite toàn bộ page.               |

> 🎯 **Feynman Prompt:** Giải thích tại sao React cần 2 phases (Render + Commit) — tại sao không update DOM ngay trong render? Không dùng thuật ngữ kỹ thuật.
> 🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày** → **7 ngày** → **14 ngày**.

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)
- [Hooks Deep Dive](./03-hooks-deep-dive.md) — hooks build directly on React's render model
- [Hooks Comprehensive](./07-hooks-comprehensive.md) — full hook taxonomy and lifecycle mapping
- [State Management](./05-state-management.md) — where to store state once fundamentals are clear
- [React 19 Features](./02-react-19-features.md) — modern upgrades to the core model covered here

### Khác track (Cross-track)
- [Event Loop & Async](../01-javascript/06-event-loop-async.md) — JS runtime that drives React's scheduling
- [React TypeScript](../02-typescript/05-react-typescript.md) — typing components, props, and events
- [Data Structures Theory](../../shared/01-cs-fundamentals/data-structures-theory.md) — Virtual DOM diffing leverages tree algorithms
