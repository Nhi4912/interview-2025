# React Hooks Deep Dive / React Hooks Chi Tiết

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [React Fundamentals](./01-react-fundamentals.md)
> **See also**: [React 19 Features](./02-react-19-features.md) | [Hooks Comprehensive](./07-hooks-comprehensive.md) | [Performance Optimization](./09-performance-optimization.md)
> **L5 Competencies**: State Design, Side-Effect Management, Performance Reasoning

---

## Real-World Scenario / Tình Huống Thực Tế

You just joined a React project. The `Dashboard` component has 12 `useState` calls, 5 `useEffect` calls, and 3 `useMemo` calls. When you click the "Refresh" button, the dashboard flickers and shows old data for one second before updating. The console shows effects running 4 times instead of 1. You add `console.log` to a useEffect and see it runs → cleanups → runs again → cleanups → runs again. You don't know why.

Bạn vừa join dự án React. Component `Dashboard` có 12 cái `useState`, 5 cái `useEffect`, 3 cái `useMemo`. Khi click nút "Refresh", dashboard nhấp nháy rồi hiện data cũ 1 giây trước khi cập nhật. Console log cho thấy effect chạy 4 lần thay vì 1. Bạn thêm `console.log` vào useEffect thì thấy nó chạy → dọn dẹp → chạy lại → dọn dẹp → chạy lại. Bạn không biết tại sao.

Without understanding hooks deeply — how React stores state, when effects run, why the dependency array matters — you'll debug by "trying to remove deps to see what happens" and create new bugs.

Nếu không hiểu hooks sâu — cách React lưu state, khi nào effect chạy, tại sao deps array quan trọng — bạn sẽ debug bằng "thử xoá deps xem sao" và tạo ra bug mới.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Ví dụ liên tưởng:**

Hooks are like **safe deposit boxes at a bank**. Every time a function component renders, it's like you visiting the bank — you don't carry your things with you (local variables disappear when the function finishes). But hooks let you open a safe deposit box (state) — each visit, you open the same box and take out your stuff (useState returns the old value). useEffect is like a note you leave at the bank: "After I leave, please call this API for me".

Hooks giống như **hộp ký gửi ở ngân hàng**. Mỗi lần function component render là 1 lần bạn đến ngân hàng — bạn không mang đồ theo (biến local mất khi function chạy xong). Nhưng hooks cho bạn mở hộp ký gửi (state) — mỗi lần đến, bạn mở đúng hộp đó lấy đồ ra (useState trả lại giá trị cũ). useEffect giống tờ giấy dặn dò bạn gửi ở ngân hàng: "Sau khi tôi về, xin gọi API này cho tôi".

| Without Hooks / Không có Hooks                                               | With Hooks / Có Hooks                                                     |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Function finishes → everything disappears / Chạy xong → mọi thứ mất          | State saved on React fiber, survives re-render / Lưu trên fiber, tồn tại  |
| Must use class components for state / Phải dùng class để có state            | Function components have full capability / Function component đủ khả năng |
| Sharing logic requires HOC/render props / Chia sẻ logic cần HOC/render props | Custom hooks share logic without extra components / Custom hooks gọn hơn  |
| Lifecycle methods scattered / Lifecycle rải rác                              | useEffect groups synchronization logic / useEffect gộp 1 chỗ              |

**Why learn this topic? / Tại sao phải học?**

- **100% of React interviews** will ask about hooks — from Junior "useState vs useReducer" to Senior "design a custom hook" / **100% phỏng vấn React** hỏi hooks — từ Junior đến Senior
- Hooks are the foundation for everything else: state management, performance, patterns / Hooks là nền tảng cho mọi thứ: quản lý state, hiệu suất, patterns
- Misunderstanding hooks = hardest bugs to debug (stale closure, infinite loop, race condition) / Hiểu sai hooks = bug khó debug nhất

---

## Concept Map / Bản Đồ Khái Niệm

```
                         ┌─────────────┐
                         │   HOOKS     │
                         └──────┬──────┘
            ┌───────────────────┼───────────────────┐
            ▼                   ▼                   ▼
     ┌─────────────┐   ┌──────────────┐   ┌──────────────┐
     │ State Hooks │   │ Effect Hooks │   │ Perf Hooks   │
     ├─────────────┤   ├──────────────┤   ├──────────────┤
     │ useState    │   │ useEffect    │   │ useMemo      │
     │ useReducer  │   │ useLayout    │   │ useCallback  │
     └──────┬──────┘   │ Effect       │   └──────────────┘
            │          └──────────────┘
            ▼                                    ▼
     ┌─────────────┐                   ┌──────────────┐
     │ Ref Hook    │                   │ Rules of     │
     │ useRef      │                   │ Hooks        │
     └─────────────┘                   │ (linked list)│
                                       └──────────────┘
```

**Where you are in the learning path / Bạn đang ở đây:**

```
React Fundamentals → [HOOKS DEEP DIVE] → Advanced Patterns → State Management
```

---

## Overview / Tổng Quan

React Hooks are functions that let you "hook into" React's internal state and lifecycle from function components. The six core hooks — useState, useReducer, useEffect, useMemo, useCallback, useRef — cover 95% of use cases. Understanding their internal model (a linked list stored on fiber nodes) is key to avoiding the most common React bugs.

React Hooks là các hàm cho phép function component "móc vào" state và vòng đời (lifecycle) bên trong React. 6 hooks cốt lõi — useState, useReducer, useEffect, useMemo, useCallback, useRef — xử lý 95% trường hợp sử dụng. Hiểu cách chúng hoạt động bên trong (một danh sách liên kết lưu trên các fiber node) là chìa khoá để tránh bug phổ biến nhất trong React.

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. useState — Basic State Management / Quản Lý State Cơ Bản

> 🧠 **Memory Hook**: "useState = a safe deposit box with a key — you store a value, React holds it, and every render you get back exactly that value."
> "useState = hộp ký gửi có khoá — bạn gửi giá trị, React giữ hộ, mỗi render bạn lấy lại đúng giá trị đó."

**Why does this exist? / Tại sao tồn tại?**

When a function component finishes running, all its local variables disappear. We need a way to save values across multiple renders without using classes.
→ **Why?** Because function components are simpler than classes (no `this`, no lifecycle boilerplate), but they need memory.
→ **Why?** Because React's render model is "call the function again from scratch every time state changes" — so memory must live OUTSIDE the function, managed by React.

Khi function component chạy xong thì biến local mất hết. Cần cách lưu giá trị qua nhiều lần render mà không dùng class.
→ **Tại sao?** Vì function component đơn giản hơn class (không có `this`, không có boilerplate), nhưng cần bộ nhớ.
→ **Tại sao?** Vì React render bằng cách "gọi function lại từ đầu mỗi khi state đổi" — bộ nhớ phải nằm NGOÀI function, do React quản lý.

#### Layer 1: Simple Analogy / Ví Dụ Liên Tưởng

Imagine playing a game where you restart the level every time you die. Without a save point (useState), you lose all progress. useState is like a save point — the game restarts (re-render) but you keep your items (state value).

Hãy tưởng tượng bạn chơi game mà mỗi lần chết phải restart level. Nếu không có save point (useState), bạn mất hết tiến trình. useState giống save point — game restart (re-render) nhưng bạn giữ được đồ (state value).

#### Layer 2: How It Works / Cơ Chế Hoạt Động

useState doesn't store state inside the function — it stores it on the **React fiber node**, accessed via a **linked list**.

useState không lưu state trong function — nó lưu trong **React fiber node**, truy cập qua **danh sách liên kết (linked list)**.

```
  Fiber Node for <Counter />
  ┌─────────────────────────────────┐
  │ hooks (linked list):            │
  │                                 │
  │  Hook 0          Hook 1        │
  │  ┌──────────┐   ┌──────────┐  │
  │  │ state: 5 │──▶│ state: "a"│  │
  │  │ queue: []│   │ queue: [] │  │
  │  └──────────┘   └──────────┘  │
  │   (count)         (name)       │
  └─────────────────────────────────┘

  Render 1: useState(0) → read Hook 0 → return 5
  Render 1: useState("") → read Hook 1 → return "a"
```

**setState has 2 forms / setState có 2 dạng:**

```tsx
// Form 1: Pass a new value directly / Dạng 1: Truyền giá trị mới
setCount(10); // state = 10

// Form 2: Pass a function (functional updater) / Dạng 2: Truyền function
setCount((prev) => prev + 1); // state = prevState + 1

// WHY IS FORM 2 IMPORTANT? / TẠI SAO DẠNG 2 QUAN TRỌNG?
// Because closure captures the value at render time:
// Vì closure bắt giá trị tại thời điểm render:
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1); // count = 0 (closure captured)
    setCount(count + 1); // count is still 0 → state = 1, not 2!
    // count vẫn = 0 → state = 1, không phải 2!
  };

  const handleClickCorrect = () => {
    setCount((prev) => prev + 1); // prev = 0 → state = 1
    setCount((prev) => prev + 1); // prev = 1 → state = 2  ✅
  };
}
```

**Batching (React 18+):**

In React 18+, ALL setState calls are batched into a single re-render, even inside setTimeout, Promises, and native events. In React 17, only React event handlers were batched.

Trong React 18+, TẤT CẢ setState đều được gộp thành 1 lần re-render duy nhất, kể cả trong setTimeout, Promise, native event. React 17 chỉ gộp trong React event handler.

```
  React 18+: ALL setState calls are batched
  ──────────────────────────────────────
  function handleClick() {
    setA(1);      // queued / xếp hàng
    setB(2);      // queued / xếp hàng
    setC(3);      // queued / xếp hàng
  }               // → only 1 render / chỉ 1 render duy nhất

  // Even inside setTimeout, Promise, native events:
  // Kể cả trong setTimeout, Promise, native event:
  setTimeout(() => {
    setA(1);      // queued
    setB(2);      // queued
  }, 100);        // → only 1 render (React 18+) / chỉ 1 render (React 18+)
```

**Lazy initializer (for expensive computation / cho tính toán nặng):**

```tsx
// ❌ Wrong: expensiveCalc() runs EVERY render (result is thrown away)
// ❌ Sai: expensiveCalc() chạy MỌI render (dù kết quả bị bỏ)
const [data, setData] = useState(expensiveCalc());

// ✅ Right: function only runs on the FIRST render
// ✅ Đúng: function chỉ chạy lần render ĐẦU TIÊN
const [data, setData] = useState(() => expensiveCalc());
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Đặc Biệt

- **Object.is comparison:** `setState(same value)` → React skips re-render. But `setState({...obj})` always creates a new reference → always re-renders. / `setState(cùng giá trị)` → React bỏ qua re-render. Nhưng `setState({...obj})` luôn tạo reference mới → luôn re-render.
- **State update during render:** Calling `setState` in the render body causes an infinite loop (render → setState → render → ...). / Gọi `setState` trong thân render gây vòng lặp vô hạn.
- **Multiple useState vs object state:** 3 separate useState calls are clearer than 1 useState({a, b, c}) — unless the states MUST update together. / 3 useState riêng rõ ràng hơn 1 useState gộp — trừ khi state phải đổi cùng lúc.
- **React 18 Strict Mode:** Development mode renders twice to detect impure side-effects — don't panic when you see double logs. / Dev mode render 2 lần để phát hiện side-effect — đừng hoảng khi thấy log 2 lần.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                                 | Why wrong / Tại sao sai                                                                                                                                            | Correct / Đúng là                                                                                          |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `setCount(count + 1)` called twice expects +2 / gọi 2 lần mong +2 | Closure captures `count` at render time — both calls use same `count` / Closure bắt `count` lúc render — cả 2 dùng cùng `count`                                    | Functional updater: `setCount(prev => prev + 1)`                                                           |
| `useState(expensiveCalc())`                                       | Function runs every render even though result only used first time / Chạy mọi render dù chỉ dùng lần đầu                                                           | Lazy init: `useState(() => expensiveCalc())`                                                               |
| Mutating state directly: `state.push(item)` / Thay đổi trực tiếp  | React compares references with Object.is — mutation doesn't create new ref → no re-render / React so sánh reference — mutation không tạo ref mới → không re-render | Spread: `setState([...state, item])`                                                                       |
| One useState object for everything / 1 useState cho mọi thứ       | Updating 1 field requires spreading everything — easy to forget fields / Update 1 field phải spread hết — dễ quên field                                            | Separate useState calls, or useReducer if > 4 fields / Tách nhiều useState, hoặc useReducer nếu > 4 fields |

**🎯 Interview Pattern / Mẫu Phỏng Vấn:**

- **Trigger:** Questions about "useState", "state update", "batching", "closure"
- **Concept:** Fiber linked list, functional updater, Object.is comparison, batching
- **Opening:**
  - 🇬🇧 _"useState stores state on React's fiber node as a linked list — each render, React walks the list in call order. setState has 2 forms: value form and functional updater — the functional updater is important because it avoids stale closures when calling multiple times in a row."_
  - 🇻🇳 _"useState lưu state trên fiber node dưới dạng linked list — mỗi render, React duyệt list theo thứ tự gọi. setState có 2 dạng: truyền giá trị và functional updater — dạng function quan trọng vì tránh stale closure khi gọi nhiều lần liên tiếp."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 **Prerequisite / Cần biết trước**: [UI = f(state), Component](./01-react-fundamentals.md)
- ➡️ **Enables / Để hiểu tiếp**: [useReducer](#2-usereducer), [Performance Optimization](./09-performance-optimization.md)

---

### 2. useReducer — Complex State Management / Quản Lý State Phức Tạp

> 🧠 **Memory Hook**: "useReducer = a vending machine — you press a button (dispatch an action), the machine handles the logic (reducer), you receive the result."
> "useReducer = máy bán nước tự động — bạn bấm nút (dispatch action), máy tự xử lý (reducer), bạn nhận kết quả."

**Why does this exist? / Tại sao tồn tại?**

When state has multiple related sub-values (loading + data + error), using multiple useState leads to inconsistent state (loading=false but data=null).
→ **Why?** Because useState handles each value independently — there's no way to express "2 values must change together".
→ **Why?** Because complex state transition logic needs to be centralized in one place for testing and reasoning — like the Redux pattern but local to one component.

Khi state có nhiều giá trị liên quan (loading + data + error), dùng nhiều useState dẫn đến state không nhất quán (loading=false nhưng data=null).
→ **Tại sao?** Vì useState xử lý từng giá trị riêng lẻ — không có cách nói "2 giá trị phải đổi cùng lúc".
→ **Tại sao?** Vì logic chuyển đổi state phức tạp cần tập trung 1 chỗ để test — giống Redux nhưng cục bộ cho 1 component.

#### Layer 1: Simple Analogy / Ví Dụ Liên Tưởng

Imagine a vending machine. You only press the "Coca" button (dispatch action), and the machine automatically: (1) checks if cans are left, (2) deducts money, (3) pushes the can out. You don't need to know the internal logic — the machine (reducer) receives an action and returns a new state. Benefit: logic is centralized, easy to test, easy to debug.

Hãy tưởng tượng máy bán nước tự động. Bạn chỉ bấm nút "Coca" (dispatch action), máy tự: (1) kiểm tra còn lon không, (2) trừ tiền, (3) đẩy lon ra. Bạn không cần biết logic bên trong — máy (reducer) nhận action và trả về trạng thái mới. Lợi ích: logic tập trung 1 chỗ, dễ test, dễ debug.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
  ┌─────────────────────────────────────────────┐
  │          useReducer Flow                     │
  │                                              │
  │  Component              Reducer              │
  │  ┌───────────┐         ┌───────────────┐    │
  │  │ dispatch  │────────▶│ (state, action)│    │
  │  │ ({type:   │         │     │          │    │
  │  │  "ADD"})  │         │     ▼          │    │
  │  └───────────┘         │  switch(type)  │    │
  │       ▲                │  case "ADD":   │    │
  │       │                │    return      │    │
  │       │                │    newState    │    │
  │  ┌────┴────┐           └───────┬───────┘    │
  │  │ state   │◀──────────────────┘             │
  │  │ (new)   │                                 │
  │  └─────────┘                                 │
  └─────────────────────────────────────────────┘
```

**Practical example — Fetching data / Ví dụ thực tế — Fetch data:**

```tsx
// Clear state type — every combination is valid
// Kiểu state rõ ràng — mọi tổ hợp đều hợp lệ
type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: User[] }
  | { status: "error"; error: string };

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; data: User[] }
  | { type: "FETCH_ERROR"; error: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { status: "loading" };
    case "FETCH_SUCCESS":
      return { status: "success", data: action.data };
    case "FETCH_ERROR":
      return { status: "error", error: action.error };
  }
}

function UserList() {
  const [state, dispatch] = useReducer(reducer, { status: "idle" });

  const loadUsers = async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const data = await fetchUsers();
      dispatch({ type: "FETCH_SUCCESS", data });
    } catch (e) {
      dispatch({ type: "FETCH_ERROR", error: e.message });
    }
  };

  // TypeScript automatically narrows type by status
  // TypeScript tự thu hẹp kiểu theo status
  if (state.status === "loading") return <Spinner />;
  if (state.status === "error") return <Error msg={state.error} />;
  if (state.status === "success") return <List data={state.data} />;
  return <button onClick={loadUsers}>Load</button>;
}
```

**dispatch is a stable identity / dispatch là stable identity:**

```tsx
// dispatch NEVER changes reference between renders
// → safe to pass to child components without useCallback
// dispatch KHÔNG BAO GIỜ thay đổi reference giữa các render
// → an toàn truyền xuống child component không cần useCallback
<ChildComponent onAction={dispatch} />
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Đặc Biệt

- **useState vs useReducer:** Rule of thumb: if the next `setState` depends on current state, or state has > 3 related sub-values, use useReducer. / Nếu `setState` tiếp theo phụ thuộc vào state hiện tại, hoặc state có > 3 giá trị liên quan, dùng useReducer.
- **Reducer must be pure:** No fetching, no mutation, no logging in the reducer. Side-effects go in the component, then dispatch the result. / Không fetch API, không mutate, không log trong reducer. Side-effect xử lý trong component rồi dispatch kết quả.
- **Lazy initialization:** `useReducer(reducer, arg, init)` — the 3rd parameter is an init function, like useState's lazy init. / Tham số thứ 3 là hàm khởi tạo, giống lazy init của useState.
- **Testing advantage:** Reducer is a pure function — import into a test file, call directly, no component rendering needed. / Reducer là pure function — import vào file test, gọi trực tiếp, không cần render component.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                           | Why wrong / Tại sao sai                                                                                                | Correct / Đúng là                                                                                             |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Side-effects in reducer (fetch, log)        | Reducer MUST be pure — React may call it multiple times (Strict Mode) / Reducer PHẢI pure — React có thể gọi nhiều lần | Side-effects in component, dispatch results / Side-effect trong component, dispatch kết quả                   |
| useReducer for simple state (1 boolean)     | Over-engineering — useState is enough for toggle/count / Quá phức tạp — useState đủ cho toggle/count                   | useReducer when state > 3 fields or complex transitions / useReducer khi > 3 fields hoặc transitions phức tạp |
| Forgetting default case / Quên default case | Action type typo → state unchanged, no error / Typo action type → state không đổi, không có lỗi                        | TypeScript discriminated union + exhaustive check                                                             |
| Mutating state: `state.items.push(x)`       | Same as useState — must create new object/array / Giống useState — phải tạo mới                                        | `return { ...state, items: [...state.items, x] }`                                                             |

**🎯 Interview Pattern / Mẫu Phỏng Vấn:**

- **Trigger:** "useState vs useReducer", "complex state management", "reducer pattern"
- **Concept:** Multiple related sub-values, dispatch stable identity, testable pure function
- **Opening:**
  - 🇬🇧 _"useReducer centralizes state transition logic into a single pure function — dispatch describes 'what happened', the reducer decides 'how state changes'. Benefits: state is always consistent (loading + data + error change together), dispatch is a stable reference, and the reducer can be tested independently."_
  - 🇻🇳 _"useReducer tập trung logic chuyển đổi state vào 1 pure function — dispatch mô tả 'cái gì xảy ra', reducer quyết định 'state thay đổi thế nào'. Lợi ích: state luôn nhất quán, dispatch là stable reference, và reducer test được độc lập."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 **Prerequisite / Cần biết trước**: [useState](#1-usestate)
- ➡️ **Enables / Để hiểu tiếp**: [State Management / Redux](./05-state-management.md)

---

### 3. useEffect — Synchronizing with the Outside World / Đồng Bộ Với Thế Giới Bên Ngoài

> 🧠 **Memory Hook**: "useEffect = a bridge between the React world (pure rendering) and the outside world (API, DOM, timer) — it's SYNCHRONIZATION, not lifecycle."
> "useEffect = cầu nối giữa React (render thuần túy) và thế giới bên ngoài (API, DOM, timer) — ĐỒNG BỘ, không phải vòng đời."

**Why does this exist? / Tại sao tồn tại?**

React rendering must be pure — same props/state, same output. But real apps need to: call APIs, listen to events, update `document.title`, connect to WebSocket. We need a mechanism for side-effects to run AFTER render without affecting the render itself.
→ **Why?** Because if side-effects run DURING render, every re-render would re-trigger them — causing infinite loops or race conditions.
→ **Why?** Because React needs the freedom to re-render at any time (concurrent features) — side-effects must be separated so React controls the timing.

React render phải thuần túy — cùng props/state, cùng output. Nhưng ứng dụng thực cần: gọi API, nghe sự kiện, cập nhật `document.title`, kết nối WebSocket. Cần cơ chế để side-effect chạy SAU render mà không ảnh hưởng render.
→ **Tại sao?** Vì nếu side-effect chạy TRONG render, mỗi re-render sẽ kích hoạt lại — gây vòng lặp vô hạn hoặc race condition.
→ **Tại sao?** Vì React cần tự do re-render bất cứ lúc nào (concurrent features) — side-effect phải tách riêng để React kiểm soát thời điểm.

#### Layer 1: Simple Analogy / Ví Dụ Liên Tưởng

Imagine you're decorating a room (render). When you're done, you stick a reminder note on the door: "When guests arrive (effect), play music" (fetch data). If you redecorate (re-render), the old note gets torn off (cleanup) and a new one is posted. And the note only gets executed AFTER you leave the room (after render commit).

Hãy tưởng tượng bạn trang trí phòng (render). Xong rồi bạn dán tờ giấy nhắc trên cửa: "Khi khách đến (effect), hãy mở nhạc" (fetch data). Nếu bạn sửa phòng (re-render), tờ giấy cũ bị xé (cleanup), dán tờ mới. Và tờ giấy chỉ được thực hiện SAU KHI bạn ra khỏi phòng (sau render commit).

#### Layer 2: How It Works / Cơ Chế Hoạt Động

**The correct mental model: SYNCHRONIZATION, not lifecycle.**

**Mô hình đúng: ĐỒNG BỘ, không phải vòng đời (lifecycle).**

```
  ❌ Old mental model (lifecycle):
  componentDidMount    → useEffect(fn, [])
  componentDidUpdate   → useEffect(fn, [dep])
  componentWillUnmount → useEffect cleanup

  ✅ Correct mental model (synchronization):
  "Synchronize component state X with external system Y"
  "Đồng bộ state X của component với hệ thống Y bên ngoài"

  useEffect(() => {
    // START sync: connect to external system
    // BẮT ĐẦU đồng bộ: kết nối hệ thống bên ngoài
    const ws = new WebSocket(url);
    return () => {
      // STOP sync: disconnect when url changes or unmount
      // DỪNG đồng bộ: ngắt kết nối khi url đổi hoặc unmount
      ws.close();
    };
  }, [url]); // re-sync when url changes / đồng bộ lại khi url đổi
```

**3 forms of dependency array / 3 dạng dependency array:**

```
  ┌───────────────────────────────────────────────────────────┐
  │  Deps Array             │ When does effect run?           │
  │  Mảng deps              │ Khi nào effect chạy?            │
  ├─────────────────────────┼─────────────────────────────────┤
  │  None / Không truyền    │ AFTER EVERY render              │
  │  useEffect(fn)          │ SAU MỌI render (rarely correct) │
  │                         │                                 │
  │  Empty [] / Mảng rỗng   │ AFTER FIRST render only         │
  │  useEffect(fn, [])      │ Chỉ SAU render ĐẦU TIÊN        │
  │                         │                                 │
  │  With deps [a, b]       │ AFTER renders where a or b      │
  │  useEffect(fn, [a, b])  │ CHANGED (compared by Object.is) │
  │  Có deps                │ SAU render nào a hoặc b ĐỔI     │
  └─────────────────────────┴─────────────────────────────────┘
```

**Execution timeline / Dòng thời gian thực thi:**

```
  Render 1 (mount):
  ┌────────────┐     ┌─────────────┐     ┌──────────────┐
  │ Component  │────▶│ React commit│────▶│ Effect runs  │
  │ returns    │     │ to DOM      │     │ (after paint)│
  │ JSX        │     │             │     │ (sau paint)  │
  └────────────┘     └─────────────┘     └──────────────┘

  Render 2 (deps changed):
  ┌────────────┐     ┌─────────────┐     ┌──────────────┐     ┌──────────┐
  │ Component  │────▶│ React commit│────▶│ CLEANUP runs │────▶│ NEW      │
  │ returns    │     │ to DOM      │     │ (old effect) │     │ effect   │
  │ new JSX    │     │             │     │ (effect cũ)  │     │ runs     │
  └────────────┘     └─────────────┘     └──────────────┘     └──────────┘

  Unmount:
  ┌──────────────┐
  │ CLEANUP runs │  (final time / lần cuối)
  │ (old effect) │
  └──────────────┘
```

**Anti-pattern: Derived state in useEffect / Tính giá trị phụ thuộc trong useEffect:**

```tsx
// ❌ Anti-pattern: computing derived state in effect → double render
// ❌ Sai: tính derived state trong effect → render 2 lần
function FilteredList({ items, query }) {
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    setFiltered(items.filter((i) => i.name.includes(query)));
  }, [items, query]);
  // Problem: renders once with old data, then effect runs, setState, renders again
  // Vấn đề: render 1 lần với data cũ, rồi effect chạy, setState, render lần 2

  return <List data={filtered} />;
}

// ✅ Correct: compute directly in render (or useMemo)
// ✅ Đúng: tính trực tiếp trong render (hoặc useMemo)
function FilteredList({ items, query }) {
  const filtered = useMemo(() => items.filter((i) => i.name.includes(query)), [items, query]);
  // Single render, no flash / 1 render duy nhất, không nhấp nháy
  return <List data={filtered} />;
}
```

**Race condition when fetching data / Race condition khi fetch data:**

```tsx
// ❌ Race condition: user types fast, old response arrives after new one
// ❌ Race condition: user gõ nhanh, response cũ đến sau response mới
useEffect(() => {
  fetch(`/api/search?q=${query}`)
    .then((r) => r.json())
    .then(setResults); // whichever response arrives last "wins" → wrong results
}, [query]);

// ✅ Fix: AbortController cancels old request
// ✅ Fix: AbortController huỷ request cũ
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/search?q=${query}`, { signal: controller.signal })
    .then((r) => r.json())
    .then(setResults)
    .catch((e) => {
      if (e.name !== "AbortError") throw e; // ignore abort / bỏ qua abort
    });

  return () => controller.abort(); // cleanup cancels old request / dọn dẹp huỷ request cũ
}, [query]);
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Đặc Biệt

- **Strict Mode double invoke:** React 18 dev mode mounts → unmounts → mounts again to test cleanup. Effect running twice is EXPECTED. / React 18 dev mode mount → unmount → mount lại để test cleanup. Effect chạy 2 lần là BÌNH THƯỜNG.
- **Object/Array deps:** `useEffect(fn, [{ a: 1 }])` → effect runs every render because `{}` !== `{}` (new reference). Need primitive deps or memoize. / Effect chạy mọi render vì `{}` !== `{}`. Cần dùng primitive hoặc memoize.
- **Missing deps:** ESLint `exhaustive-deps` rule requires declaring all dependencies. Suppressing it = creating stale closure bugs. / ESLint bắt buộc khai báo mọi dependency. Tắt = tạo bug stale closure.
- **Effect vs Event handler:** If a side-effect happens because of a USER ACTION (click, submit), put it in the event handler. If it happens because of STATE CHANGE (sync with external system), put it in useEffect. / Nếu side-effect xảy ra do USER CLICK — đặt trong event handler. Nếu do STATE ĐỔI — đặt trong useEffect.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                            | Why wrong / Tại sao sai                                                                       | Correct / Đúng là                                                   |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Derived state in useEffect / Tính derived state trong effect | Double render: old data flash → new data / 2 renders: data cũ nhấp nháy → data mới            | Compute in render or useMemo / Tính trong render hoặc useMemo       |
| Fetching without AbortController                             | Race condition: old response overwrites new / Response cũ ghi đè mới                          | AbortController in cleanup / AbortController trong cleanup          |
| `// eslint-disable exhaustive-deps`                          | Stale closure — effect uses old values / Effect dùng giá trị cũ                               | Add all deps, refactor if needed / Thêm đủ deps, refactor nếu cần   |
| `useEffect(fn)` without deps array                           | Effect runs AFTER EVERY render — usually a bug / Chạy SAU MỌI render — thường là bug          | Add appropriate deps `[dep1, dep2]` / Thêm deps phù hợp             |
| Using useEffect for event handler logic                      | Effect runs after render, not when user clicks / Effect chạy sau render, không phải khi click | Put logic in event handler directly / Đặt logic trong event handler |

**🎯 Interview Pattern / Mẫu Phỏng Vấn:**

- **Trigger:** "useEffect", "side effects", "data fetching", "cleanup"
- **Concept:** Synchronization mental model, 3 deps forms, cleanup timing, race condition
- **Opening:**
  - 🇬🇧 _"useEffect synchronizes component state with an external system — the correct mental model is synchronization, not lifecycle. Effects run after render commit, cleanup runs before the next effect or on unmount. Three common anti-patterns: derived state in effect, fetching without AbortController, and suppressing exhaustive-deps."_
  - 🇻🇳 _"useEffect đồng bộ state component với hệ thống bên ngoài — mô hình đúng là đồng bộ, không phải lifecycle. Effect chạy sau render commit, cleanup chạy trước effect mới hoặc khi unmount. Ba anti-pattern phổ biến: tính derived state trong effect, fetch không có AbortController, và tắt exhaustive-deps."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 **Prerequisite / Cần biết trước**: [useState](#1-usestate), [Render/Commit phases](./01-react-fundamentals.md)
- ➡️ **Enables / Để hiểu tiếp**: [Custom Hooks](./07-hooks-comprehensive.md), [useLayoutEffect](./07-hooks-comprehensive.md)

---

### 4. useMemo & useCallback — Optimizing References / Tối Ưu Reference

> 🧠 **Memory Hook**: "useMemo caches the VALUE, useCallback caches the FUNCTION — both prevent creating unnecessary new references."
> "useMemo lưu GIÁ TRỊ, useCallback lưu HÀM — cả hai tránh tạo reference mới không cần thiết."

**Why does this exist? / Tại sao tồn tại?**

Every render, React creates new objects/functions. Child components receive a new reference → re-render even though the value hasn't changed. With large lists or expensive computations, unnecessary re-renders cause lag.
→ **Why?** Because JavaScript compares objects/functions by reference, not by value: `{a:1} !== {a:1}`.
→ **Why?** Because React re-renders propagate down the entire subtree — 1 unnecessary re-render at the parent = 100 re-renders at the children.

Mỗi render, React tạo object/function mới. Child component nhận reference mới → re-render dù value không đổi. Với list lớn hoặc tính toán nặng, re-render thừa gây lag.
→ **Tại sao?** Vì JavaScript so sánh object/function bằng reference, không bằng giá trị: `{a:1} !== {a:1}`.
→ **Tại sao?** Vì React re-render lan xuống toàn bộ cây component — 1 re-render thừa ở cha = 100 re-render ở con.

#### Layer 1: Simple Analogy / Ví Dụ Liên Tưởng

Imagine you're cooking. Every meal, you cook from scratch (re-render creates everything new). useMemo is like a fridge — cook once, store it, take it out next meal if ingredients haven't changed. useCallback is like a laminated recipe — you don't rewrite the recipe every meal, you reuse the same laminated card.

Hãy tưởng tượng bạn nấu ăn. Mỗi bữa bạn nấu lại từ đầu (re-render tạo mới). useMemo giống tủ lạnh — nấu 1 lần, cất đi, bữa sau lấy ra nếu nguyên liệu không đổi. useCallback giống công thức nấu ăn được ép nhựa — bạn không viết lại công thức mỗi bữa, dùng lại tờ cũ.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
  ┌────────────────────────────────────────────────────┐
  │           useMemo vs useCallback                    │
  ├────────────────────────────────────────────────────┤
  │                                                     │
  │  useMemo(() => value, [deps])                      │
  │  = cache the VALUE (result of the function)        │
  │  = lưu GIÁ TRỊ (kết quả của function)             │
  │                                                     │
  │  useCallback(fn, [deps])                           │
  │  = cache the FUNCTION itself                       │
  │  = lưu chính FUNCTION đó                           │
  │                                                     │
  │  They're equivalent:                               │
  │  Tương đương nhau:                                 │
  │  useCallback(fn, deps) === useMemo(() => fn, deps) │
  │                                                     │
  └────────────────────────────────────────────────────┘
```

**When to use / Khi nào dùng:**

```
  ┌──────────────────────────────────────────────────────┐
  │  USE when / CẦN dùng khi:                           │
  │  1. useMemo: Expensive computation (sort 10K items)  │
  │  2. useCallback: Function passed to React.memo child │
  │  3. useMemo: Object/array used as deps for other     │
  │     useEffect                                        │
  │                                                      │
  │  DON'T USE when / KHÔNG CẦN khi:                    │
  │  1. Cheap computation (string concat, filter < 100)  │
  │  2. Function only used in same component (not        │
  │     passed to memo child)                            │
  │  3. React 19 + Compiler (Compiler adds it for you)   │
  └──────────────────────────────────────────────────────┘
```

**Practical example / Ví dụ thực tế:**

```tsx
function ProductList({ products, query }) {
  // ✅ useMemo: sort/filter 10K products — expensive
  // ✅ useMemo: sắp xếp/lọc 10K sản phẩm — tính toán nặng
  const filtered = useMemo(
    () => products.filter((p) => p.name.includes(query)).sort((a, b) => a.price - b.price),
    [products, query],
  );

  // ✅ useCallback: passed to React.memo child
  // ✅ useCallback: truyền xuống child có React.memo
  const handleSelect = useCallback((id: string) => {
    setSelected(id);
  }, []);

  return filtered.map((p) => <ProductCard key={p.id} product={p} onSelect={handleSelect} />);
}

// Child wrapped in React.memo — skips re-render if props unchanged
// Child bọc React.memo — bỏ qua re-render nếu props không đổi
const ProductCard = React.memo(function ProductCard({ product, onSelect }) {
  return <div onClick={() => onSelect(product.id)}>{product.name}</div>;
});
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Đặc Biệt

- **Cost of memoization:** useMemo/useCallback aren't free — they compare deps every render and store old values in memory. If the computation is cheaper than the comparison, memoization is slower. / useMemo/useCallback không miễn phí — so sánh deps mỗi render, lưu giá trị cũ. Nếu tính toán rẻ hơn so sánh, memoization chậm hơn.
- **React Compiler future:** React 19 Compiler automatically adds memoization — manual useMemo/useCallback will gradually become less needed. / React 19 Compiler tự thêm memoization — useMemo/useCallback thủ công sẽ dần ít cần.
- **Premature optimization:** Measure first (React Profiler), optimize later. Don't memo everything "just in case". / Đo trước (React Profiler), tối ưu sau. Đừng memo mọi thứ "phòng hờ".
- **Reference stability for deps:** If an object is used as a useEffect dep, it must be useMemo'd to prevent the effect from running every render. / Nếu object dùng làm useEffect dep, phải useMemo để tránh effect chạy mọi render.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                        | Why wrong / Tại sao sai                                                                                                              | Correct / Đúng là                                                                                          |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Memo everything "just in case" / Memo mọi thứ "cho chắc" | Overhead: deps comparison + memory > cost of recompute / Tốn kém hơn tính lại                                                        | Only memo when measured benefit exists / Chỉ memo khi đo được benefit                                      |
| useCallback for function only used in JSX                | Function not passed to memo child → memo is useless / Function không truyền xuống memo child → vô ích                                | Only useCallback when function is prop of React.memo child / Chỉ khi function là prop của React.memo child |
| useMemo but deps change every render                     | New object/array each render → 100% cache miss / Object/array mới mỗi render → cache miss 100%                                       | Ensure deps are primitive or stable references / Đảm bảo deps là primitive hoặc stable                     |
| Forgetting React.memo on child / Quên React.memo ở child | useCallback keeps stable ref, but child without memo re-renders anyway / useCallback giữ ref, nhưng child không memo → vẫn re-render | useCallback + React.memo always paired / Luôn đi đôi                                                       |

**🎯 Interview Pattern / Mẫu Phỏng Vấn:**

- **Trigger:** "useMemo vs useCallback", "React.memo", "optimization", "reference equality"
- **Concept:** Cache value vs cache function, useCallback + React.memo paired, measure before optimize
- **Opening:**
  - 🇬🇧 _"useMemo caches computed values, useCallback caches function references — the main purpose is to prevent creating unnecessary new references that cause re-renders in React.memo children. Important: useCallback only matters when the child is wrapped in React.memo, and you should measure performance before optimizing."_
  - 🇻🇳 _"useMemo lưu giá trị tính toán, useCallback lưu reference function — mục đích chính là tránh tạo reference mới gây re-render ở child có React.memo. Quan trọng: useCallback chỉ có ý nghĩa khi child bọc React.memo, và cần đo trước khi tối ưu."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 **Prerequisite / Cần biết trước**: [Reference equality](./01-react-fundamentals.md), [useState](#1-usestate)
- ➡️ **Enables / Để hiểu tiếp**: [Performance Optimization](./09-performance-optimization.md), [React Compiler](./02-react-19-features.md)

---

### 5. useRef — Non-rendering Reference / Tham Chiếu Không Re-render

> 🧠 **Memory Hook**: "useRef = a secret drawer — change `.current` and React DOESN'T KNOW, DOESN'T re-render."
> "useRef = ngăn kéo bí mật — thay đổi `.current` mà React KHÔNG BIẾT, KHÔNG re-render."

**Why does this exist? / Tại sao tồn tại?**

Sometimes you need to keep a value across renders without triggering a re-render: DOM references, timer IDs, previous values, instance variables.
→ **Why?** Because useState triggers a re-render every time you set. Some values need to persist but the UI doesn't need to know (timer ID, observer instance).
→ **Why?** Because React function components run from scratch every render — local variables disappear. We need an "escape hatch" for mutable values unrelated to UI.

Đôi khi cần giữ giá trị qua render mà KHÔNG trigger re-render: DOM reference, timer ID, giá trị trước đó, biến instance.
→ **Tại sao?** Vì useState mỗi lần set → re-render. Có những giá trị cần lưu mà UI không cần biết (timer ID, observer instance).
→ **Tại sao?** Vì function component chạy lại từ đầu mỗi render — biến local mất. Cần "lối thoát" cho giá trị có thể thay đổi mà không liên quan đến UI.

#### Layer 1: Simple Analogy / Ví Dụ Liên Tưởng

Imagine you're taking an exam (render). useState is like the whiteboard at the front — whatever you write, the whole class sees (UI re-renders). useRef is like a notebook in your pocket — you can write as many notes as you want, nobody sees, and it doesn't affect your exam paper.

Hãy tưởng tượng bạn đang thi viết (render). useState giống bảng trắng trước lớp — viết gì lên là cả lớp thấy (UI re-render). useRef giống cuốn sổ tay trong túi — bạn ghi bao nhiêu cũng được, không ai thấy, không ảnh hưởng bài thi.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
  ┌─────────────────────────────────────────────────┐
  │           useRef vs useState                     │
  ├─────────────────────────────────────────────────┤
  │                                                  │
  │  useState:                                       │
  │  setValue(new) → React queues re-render → UI     │
  │  update                                          │
  │                                                  │
  │  useRef:                                         │
  │  ref.current = new → NOTHING HAPPENS             │
  │  (no re-render, React doesn't know)              │
  │                                                  │
  │  Both persist across renders:                    │
  │  Cả hai đều tồn tại qua các lần render:         │
  │  ┌────────────────────────────────────────┐     │
  │  │ Fiber Node                             │     │
  │  │  hooks: [                              │     │
  │  │    { state: 5 },        ← useState    │     │
  │  │    { current: divRef }, ← useRef      │     │
  │  │  ]                                     │     │
  │  └────────────────────────────────────────┘     │
  └─────────────────────────────────────────────────┘
```

**3 main use cases / 3 cách dùng chính:**

```tsx
// USE CASE 1: DOM reference / Tham chiếu DOM
function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus(); // access DOM element directly / truy cập DOM trực tiếp
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}

// USE CASE 2: Mutable value without re-render / Giá trị thay đổi không re-render
function Timer() {
  const intervalRef = useRef<number | null>(null);

  const start = () => {
    intervalRef.current = setInterval(() => {
      console.log("tick");
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // need ref to clear correct interval
      // cần ref để clear đúng interval
    }
  };

  return (
    <>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}

// USE CASE 3: Previous value / Giá trị trước đó
function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef(0);

  useEffect(() => {
    prevCountRef.current = count; // updated AFTER render / cập nhật SAU render
  });

  return (
    <p>
      Now: {count}, Before: {prevCountRef.current}
    </p>
  );
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Đặc Biệt

- **Reading ref.current during render:** Don't — the value may be stale or change mid-render (concurrent features). / Không nên — giá trị có thể cũ hoặc thay đổi giữa render.
- **Callback ref vs useRef:** Callback ref `<div ref={(node) => {...}}>` runs when the DOM node mounts/unmounts — use it when you need to measure size or observe. / Callback ref chạy khi DOM node mount/unmount — dùng khi cần đo kích thước.
- **React 19 ref cleanup:** Callback refs can return a cleanup function — see [React 19 Features](./02-react-19-features.md). / Callback ref có thể trả về cleanup function.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                                   | Why wrong / Tại sao sai                                                                        | Correct / Đúng là                                                             |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Using ref to trigger UI update / Dùng ref để update UI              | ref.current change doesn't re-render → stale UI / Thay đổi ref.current không re-render → UI cũ | Use useState for values shown in UI / Dùng useState cho giá trị hiển thị      |
| Reading ref.current in render return / Đọc ref.current trong render | Concurrent features may read mid-update values / Concurrent có thể đọc giá trị giữa chừng      | Read ref in effect or event handler / Đọc ref trong effect hoặc event handler |
| Forgetting null check / Quên kiểm tra null                          | ref.current is null until DOM mounts / ref.current là null cho đến khi DOM mount               | Always: `ref.current?.focus()` / Luôn kiểm tra null                           |

**🎯 Interview Pattern / Mẫu Phỏng Vấn:**

- **Trigger:** "useRef", "DOM manipulation", "mutable value", "previous value"
- **Concept:** 2 use cases (DOM ref + mutable non-render value), doesn't trigger re-render
- **Opening:**
  - 🇬🇧 _"useRef has 2 main use cases: (1) reference a DOM element for direct manipulation, (2) hold a mutable value across renders without triggering re-render — for example timer IDs, previous values, observer instances. The core difference from useState: changing ref.current doesn't cause a re-render."_
  - 🇻🇳 _"useRef có 2 cách dùng chính: (1) tham chiếu DOM element để thao tác trực tiếp, (2) giữ giá trị có thể thay đổi qua render mà không trigger re-render — ví dụ timer ID, giá trị trước đó, observer instance. Khác biệt cốt lõi với useState: thay đổi ref.current không gây re-render."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 **Prerequisite / Cần biết trước**: [DOM, Component](./01-react-fundamentals.md)
- ➡️ **Enables / Để hiểu tiếp**: [ref changes React 19](./02-react-19-features.md), [Imperative Handle pattern](./04-advanced-patterns.md)

---

### 6. Rules of Hooks (Internal Model) / Luật Của Hooks

> 🧠 **Memory Hook**: "Hooks = a linked list in CALL ORDER — wrong order = wrong state."
> "Hooks = danh sách liên kết theo THỨ TỰ GỌI — sai thứ tự = lấy nhầm state."

**Why does this exist? / Tại sao tồn tại?**

React identifies hooks by their call order in each render, not by name or key. If the order changes (due to conditional/loop), one hook reads another hook's state.
→ **Why?** Because React chose a linked list instead of a named map to simplify the API — developers don't need to name each hook.
→ **Why?** Because this design decision lets custom hooks compose naturally — each hook adds a node to the list, no name collision risk.

React nhận diện hooks bằng thứ tự gọi trong mỗi render, không bằng tên hay key. Nếu thứ tự thay đổi (do if/for), hook này đọc state của hook khác.
→ **Tại sao?** Vì React chọn linked list thay vì map có tên để đơn giản hoá API — dev không cần đặt tên mỗi hook.
→ **Tại sao?** Vì thiết kế này cho phép custom hooks kết hợp tự nhiên — mỗi hook thêm node vào list, không sợ trùng tên.

#### Layer 1: Simple Analogy / Ví Dụ Liên Tưởng

Imagine a row of seats in a movie theater. Each hook is a person sitting in order: seat 1 = useState(count), seat 2 = useEffect(fetch), seat 3 = useRef(input). If during the next movie showing, the person in seat 1 is absent (hook skipped by `if`), everyone shifts up one seat: the person from seat 2 sits in seat 1 → reads count's state instead of fetch's effect. Chaos.

Hãy tưởng tượng hàng ghế trong rạp phim. Mỗi hook là 1 người ngồi theo thứ tự: ghế 1 = useState(count), ghế 2 = useEffect(fetch), ghế 3 = useRef(input). Nếu lần xem phim tiếp, người ghế 1 vắng (hook bị bỏ qua vì `if`), mọi người dồn lên 1 ghế: người ghế 2 ngồi ghế 1 → đọc state của count thay vì effect của fetch. Hỗn loạn.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
  Render 1:                          Render 2 (CORRECT / ĐÚNG):
  ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐
  │Hook 0│──▶│Hook 1│──▶│Hook 2│   │Hook 0│──▶│Hook 1│──▶│Hook 2│
  │count │   │effect│   │ref   │   │count │   │effect│   │ref   │
  │= 5   │   │fetch │   │input │   │= 6   │   │fetch │   │input │
  └──────┘   └──────┘   └──────┘   └──────┘   └──────┘   └──────┘
  Pointer:  0 → 1 → 2              Pointer:  0 → 1 → 2
  ✅ Same order → correct hook      ✅ Cùng thứ tự → đúng hook

  Render 2 (WRONG — skipped hook 0 due to if / SAI — bỏ qua hook 0 vì if):
  ┌──────┐   ┌──────┐
  │Hook 0│──▶│Hook 1│
  │effect │   │ref   │    ← Hook 0 is now effect but reads state = 6
  │= 6?! │   │fetch?!│   ← DISASTER: states mixed up / hỗn loạn
  └──────┘   └──────┘
```

**2 Rules / 2 Luật:**

```
  ╔══════════════════════════════════════════════════════╗
  ║  RULE 1: Only call Hooks at the TOP LEVEL           ║
  ║  Chỉ gọi Hooks ở TRÊN CÙNG                         ║
  ║  — Not inside if, for, while, nested functions       ║
  ║  — Ensures same call order EVERY render              ║
  ║                                                      ║
  ║  RULE 2: Only call Hooks in React FUNCTIONS          ║
  ║  Chỉ gọi Hooks trong FUNCTION React                 ║
  ║  — Function components                               ║
  ║  — Custom hooks (functions starting with "use")      ║
  ║  — NOT in classes, regular functions, callbacks       ║
  ╚══════════════════════════════════════════════════════╝
```

**Violation example and fix / Ví dụ vi phạm và cách sửa:**

```tsx
// ❌ Violates Rule 1: hook inside conditional
// ❌ Vi phạm Rule 1: hook trong điều kiện
function Profile({ userId }) {
  if (!userId) return null;
  const [user, setUser] = useState(null); // BUG: skipped when userId is falsy
  useEffect(() => {
    fetch(userId);
  }, [userId]);
}

// ✅ Fix: hooks before conditional
// ✅ Sửa: hooks trước điều kiện
function Profile({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (!userId) return; // check INSIDE effect, don't skip the effect
    // kiểm tra TRONG effect, không bỏ qua effect
    fetch(userId).then(setUser);
  }, [userId]);

  if (!userId) return null; // early return AFTER hooks / return sớm SAU hooks
  return <div>{user?.name}</div>;
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Đặc Biệt

- **Custom hooks:** Must prefix with "use" — ESLint plugin recognizes and checks the rules. `useCustomHook` OK, `customHook` gets skipped. / Bắt buộc prefix "use" — ESLint nhận diện và kiểm tra. `useCustomHook` OK, `customHook` bị bỏ qua.
- **use() (React 19):** `use()` is NOT a hook — it's not stored in the linked list → can be used in conditionals. This is the only exception. / `use()` KHÔNG phải hook — không lưu trong linked list → dùng trong if/for được. Đây là ngoại lệ duy nhất.
- **ESLint plugin:** `eslint-plugin-react-hooks` is mandatory — don't suppress `exhaustive-deps` or `rules-of-hooks`. / Bắt buộc — không tắt `exhaustive-deps` hay `rules-of-hooks`.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                 | Why wrong / Tại sao sai                                                           | Correct / Đúng là                                                                   |
| --------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Hook inside if/for/while          | Call order changes → states mix between hooks / Thứ tự đổi → state lẫn lộn        | Hooks at top level, condition INSIDE hook / Hooks ở trên cùng, điều kiện TRONG hook |
| Custom hook without "use" prefix  | ESLint doesn't check rules → silent bugs / ESLint không check → bug ẩn            | Always name `useSomething` / Luôn đặt tên `useSomething`                            |
| Suppressing rules-of-hooks ESLint | Allows violations → hard-to-debug runtime bugs / Cho phép vi phạm → bug khó debug | Refactor code instead of suppressing / Refactor thay vì tắt                         |

**🎯 Interview Pattern / Mẫu Phỏng Vấn:**

- **Trigger:** "Rules of Hooks", "why can't you call hooks in if", "hooks internal"
- **Concept:** Linked list, call order, pointer traversal
- **Opening:**
  - 🇬🇧 _"React stores hooks as a linked list on the fiber node — identified by call order, not by name. If the order changes between renders (due to conditionals), hook n reads hook n-1's state. Two rules: top level only, React functions only. The only exception: use() in React 19 is not a hook."_
  - 🇻🇳 _"React lưu hooks dưới dạng linked list trên fiber node — nhận diện bằng thứ tự gọi, không bằng tên. Nếu thứ tự thay đổi giữa render (do if), hook n đọc state của hook n-1. Hai luật: chỉ ở trên cùng, chỉ trong function React. Ngoại lệ duy nhất: use() React 19 không phải hook."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 **Prerequisite / Cần biết trước**: [Fiber Architecture](./01-react-fundamentals.md)
- ➡️ **Enables / Để hiểu tiếp**: [Custom Hooks](./07-hooks-comprehensive.md), [use() API](./02-react-19-features.md)

---

## Q&A Section / Câu Hỏi Phỏng Vấn

### Q1: When do you use the functional updater form of useState? / useState functional updater dùng khi nào? 🟢 Junior

**A:**

🇬🇧 Use the functional updater `setState(prev => prev + 1)` when the new state depends on the previous state. This avoids stale closure issues when multiple updates are batched — the `prev` parameter always has the latest value, while directly referencing state captures the value at render time.

🇻🇳 Dùng functional updater `setState(prev => prev + 1)` khi state mới phụ thuộc vào state cũ. Tránh vấn đề stale closure (bắt giá trị cũ) khi gọi setState nhiều lần liên tiếp — tham số `prev` luôn là giá trị mới nhất, trong khi tham chiếu trực tiếp state bị closure bắt tại thời điểm render.

**💡 Interview Signal / Dấu hiệu trả lời tốt:**

- ✅ Strong: Explains closure capture, gives example of incrementing twice in a row / Giải thích closure bắt giá trị, cho ví dụ tăng 2 lần liên tiếp
- ❌ Weak: Only says "when state depends on previous state" without explaining why (closure) / Chỉ nói "khi phụ thuộc state cũ" mà không giải thích tại sao

---

### Q2: When does the useEffect cleanup function run? / useEffect cleanup chạy khi nào? 🟢 Junior

**A:**

🇬🇧 Cleanup runs in two situations: (1) before the next effect execution (when deps change), and (2) when the component unmounts. This ensures the old synchronization is torn down before a new one starts — preventing memory leaks and stale subscriptions.

🇻🇳 Cleanup chạy 2 lúc: (1) trước khi effect mới chạy (khi deps thay đổi), và (2) khi component unmount (bị gỡ khỏi DOM). Đảm bảo đồng bộ cũ được dọn dẹp trước khi đồng bộ mới bắt đầu — tránh rò rỉ bộ nhớ (memory leak) và subscription cũ.

**💡 Interview Signal / Dấu hiệu trả lời tốt:**

- ✅ Strong: Names BOTH timings (re-run + unmount), uses WebSocket/timer example / Nêu CẢ 2 timing, dùng ví dụ WebSocket/timer
- ❌ Weak: Only says "when unmount" — misses the deps change case / Chỉ nói "khi unmount" — thiếu trường hợp deps đổi

---

### Q3: Why shouldn't you compute derived state in useEffect? / Tại sao không nên tính derived state trong useEffect? 🟡 Mid

**A:**

🇬🇧 Computing derived state in useEffect causes a double render: first render with stale/empty data, then the effect runs, calls setState, triggers a second render with the computed data. This creates a flash of incorrect UI and wastes a render cycle. Instead, compute directly in the render body or use useMemo — single render, no flash.

🇻🇳 Tính derived state (giá trị phụ thuộc) trong useEffect gây render 2 lần: render đầu hiện data cũ/rỗng, rồi effect chạy, setState, render lần 2 với data đúng. Gây nhấp nháy UI sai và lãng phí 1 render. Thay vào đó, tính trực tiếp trong render hoặc dùng useMemo — chỉ 1 render, không nhấp nháy.

```tsx
// ❌ Double render (flash of stale data)
const [filtered, setFiltered] = useState([]);
useEffect(() => {
  setFiltered(items.filter((i) => i.active));
}, [items]);

// ✅ Single render
const filtered = useMemo(() => items.filter((i) => i.active), [items]);
```

**💡 Interview Signal / Dấu hiệu trả lời tốt:**

- ✅ Strong: Explains double render, shows code comparison, knows when useMemo vs direct computation / Giải thích double render, so sánh code, biết khi nào useMemo
- ❌ Weak: Only says "for performance" without explaining the double render mechanism / Chỉ nói "vì hiệu suất" mà không giải thích cơ chế 2 lần render

---

### Q4: useMemo vs useCallback — when to use which? / useMemo vs useCallback — khi nào dùng cái nào? 🟡 Mid

**A:**

🇬🇧 `useMemo(() => value, deps)` caches the return value of a computation. `useCallback(fn, deps)` caches the function itself. They're equivalent: `useCallback(fn, deps)` === `useMemo(() => fn, deps)`. Use useMemo for expensive computations, useCallback when passing functions as props to React.memo children. Neither is useful without React.memo on the receiving component.

🇻🇳 `useMemo` lưu giá trị tính toán, `useCallback` lưu function. Tương đương: `useCallback(fn, deps)` === `useMemo(() => fn, deps)`. Dùng useMemo cho tính toán nặng, useCallback khi truyền function xuống child có React.memo. Cả hai vô ích nếu child không bọc React.memo.

**💡 Interview Signal / Dấu hiệu trả lời tốt:**

- ✅ Strong: Knows they're equivalent, knows useCallback is useless without child memo, mentions React Compiler future / Biết tương đương, biết useCallback vô ích nếu child không memo, đề cập React Compiler
- ❌ Weak: "useMemo for values, useCallback for functions" — correct but missing when they're NEEDED / Đúng nhưng thiếu khi nào CẦN

---

### Q5: How does batching differ between React 18 and React 17? / Batching trong React 18 khác React 17 thế nào? 🟡 Mid

**A:**

🇬🇧 React 17 only batches state updates inside React event handlers (onClick, onChange). Updates in setTimeout, Promises, and native event listeners each trigger a separate re-render. React 18 introduces automatic batching — ALL state updates are batched regardless of where they originate (setTimeout, Promise.then, native events), resulting in fewer re-renders. To opt-out, use `flushSync()`.

🇻🇳 React 17 chỉ gộp (batch) setState trong React event handler (onClick, onChange). setState trong setTimeout, Promise, native event → mỗi cái 1 render riêng. React 18 tự động gộp tất cả — MỌI setState đều gộp, bất kể nơi nào (setTimeout, Promise, native event). Ít re-render hơn. Muốn tắt gộp (opt-out), dùng `flushSync()`.

**💡 Interview Signal / Dấu hiệu trả lời tốt:**

- ✅ Strong: Knows React 17 only batches in React handlers, React 18 batches everywhere, knows `flushSync` opt-out / Biết R17 chỉ batch trong React handler, R18 batch mọi nơi, biết flushSync
- ❌ Weak: Doesn't know React 17 limitation or doesn't know flushSync / Không biết giới hạn R17 hoặc không biết flushSync

---

### Q6: Race condition when fetching data in useEffect — cause and solution? / Race condition khi fetch data trong useEffect — nguyên nhân và giải pháp? 🔴 Senior

**A:**

🇬🇧 The race condition occurs when a component fetches data based on a changing dependency (e.g., search query). If the user types "abc" then "abcd" quickly, the fetch for "abc" might resolve AFTER "abcd" — overwriting correct results with stale data.

**Root cause:** Multiple in-flight requests with no cancellation mechanism. The last response to arrive "wins", regardless of request order.

**Solutions:**

1. **AbortController** (recommended): Cancel the previous request in cleanup
2. **Boolean flag:** `let cancelled = false` in closure, set true in cleanup, check before setState
3. **Library:** React Query/SWR handle this automatically with request identity

```tsx
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/search?q=${query}`, { signal: controller.signal })
    .then((r) => r.json())
    .then(setResults)
    .catch((e) => {
      if (e.name !== "AbortError") throw e;
    });
  return () => controller.abort();
}, [query]);
```

🇻🇳 Race condition xảy ra khi component fetch data theo dependency thay đổi nhanh (ví dụ: từ khoá tìm kiếm). Nếu user gõ "abc" rồi "abcd" nhanh, request "abc" có thể nhận kết quả SAU "abcd" — ghi đè kết quả đúng bằng data cũ.

**Nguyên nhân gốc:** Nhiều request bay cùng lúc mà không có cơ chế huỷ. Response nào đến cuối cùng "thắng", bất kể thứ tự request.

**Giải pháp:** (1) AbortController huỷ request cũ trong cleanup (khuyến nghị), (2) Biến boolean flag, (3) Thư viện React Query/SWR xử lý tự động.

**💡 Interview Signal / Dấu hiệu trả lời tốt:**

- ✅ Strong: Explains mechanism (multiple in-flight), provides AbortController code, knows React Query alternative / Giải thích cơ chế, cho code AbortController, biết React Query
- ❌ Weak: Only says "use loading state" — doesn't solve race condition / Chỉ nói "dùng loading state" — không giải quyết race condition

**🔴 Follow-up Chain:**

1. "Does AbortController work with all async operations?" → AbortController works with fetch, but doesn't cancel Promise.then chains already started. For non-fetch async, use the boolean flag pattern. / AbortController chỉ huỷ fetch, không huỷ Promise.then đã chạy. Cho async khác, dùng boolean flag.
2. "Compare AbortController vs boolean flag pattern." → AbortController actually cancels the network request (saves bandwidth), boolean flag only ignores the result. AbortController preferred for fetch, boolean flag for non-cancellable operations. / AbortController huỷ thật request (tiết kiệm bandwidth), boolean flag chỉ bỏ qua kết quả.
3. "In React 19 with use(), does this race condition still happen?" → use() + Suspense shifts responsibility: the Promise must be a stable reference. If the parent creates a new Promise when deps change, the old one is discarded naturally. But you need a cache layer to avoid re-fetching. / use() + Suspense chuyển trách nhiệm: Promise phải là stable reference. Cần cache layer để tránh re-fetch.

---

### Q7: Design a custom hook `useFetch` — including loading, error, cache, and cancel. / Thiết kế custom hook `useFetch` — bao gồm loading, error, cache, và cancel. 🔴 Senior

**A:**

```tsx
type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 30_000; // 30 seconds

function useFetch<T>(url: string | null, options?: RequestInit): FetchState<T> {
  const [state, dispatch] = useReducer(
    (state: FetchState<T>, action: any): FetchState<T> => {
      switch (action.type) {
        case "LOADING":
          return { status: "loading" };
        case "SUCCESS":
          return { status: "success", data: action.data };
        case "ERROR":
          return { status: "error", error: action.error };
        default:
          return state;
      }
    },
    { status: "idle" },
  );

  useEffect(() => {
    if (!url) return;

    // Check cache / Kiểm tra cache
    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      dispatch({ type: "SUCCESS", data: cached.data });
      return;
    }

    const controller = new AbortController();
    dispatch({ type: "LOADING" });

    fetch(url, { ...options, signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        cache.set(url, { data, timestamp: Date.now() });
        dispatch({ type: "SUCCESS", data });
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          dispatch({ type: "ERROR", error: e.message });
        }
      });

    return () => controller.abort();
  }, [url]); // options intentionally excluded (stable reference expected)

  return state;
}
```

🇬🇧 **Design decisions:** useReducer for consistent state transitions, AbortController for cancellation, Map cache with TTL, discriminated union for TypeScript narrowing, null URL for conditional fetching. **Trade-off:** Simple cache (no stale-while-revalidate, no retry, no refetch-on-focus). Use React Query in production.

🇻🇳 **Quyết định thiết kế:** useReducer cho state chuyển đổi nhất quán, AbortController cho huỷ request, Map cache với TTL (thời gian hết hạn), kiểu discriminated union cho TypeScript tự thu hẹp, URL null để fetch có điều kiện. **Đánh đổi:** Cache đơn giản (không có stale-while-revalidate, retry, refetch-on-focus). Dùng React Query trong production.

**💡 Interview Signal / Dấu hiệu trả lời tốt:**

- ✅ Strong: useReducer for consistent state, AbortController, cache with invalidation, discriminated union type
- ❌ Weak: Multiple separate useState, no cancellation, no cache, no error handling

**🔴 Follow-up Chain:**

1. "What's the problem when multiple components use the same URL?" → Concurrent requests to the same URL → multiple fetches. Fix: request deduplication — check if cache key has a pending Promise, return the same Promise. / Request trùng lặp. Sửa: kiểm tra nếu key có pending Promise, trả về cùng Promise.
2. "How to add retry logic?" → Wrap fetch in a retry function with exponential backoff. Must reset retry count when URL changes. AbortController must abort retries too. / Bọc fetch trong hàm retry với exponential backoff. Reset retry khi URL đổi. AbortController phải huỷ cả retry.
3. "Compare with React Query — when is a custom hook enough?" → Custom hook is enough for < 5 endpoints, no real-time, no pagination. React Query needed when: complex cache invalidation, optimistic updates, pagination, devtools, multiple consumers sharing same key. / Custom hook đủ cho < 5 endpoints. React Query cần khi: cache invalidation phức tạp, optimistic updates, pagination, devtools.

---

### Q8: useLayoutEffect vs useEffect — when MUST you use useLayoutEffect? / useLayoutEffect vs useEffect — khi nào PHẢI dùng useLayoutEffect? 🔴 Senior

**A:**

🇬🇧 Both run after render, but with a critical timing difference:

- `useEffect` runs **after paint** (browser has already shown the update to user)
- `useLayoutEffect` runs **before paint** (blocks browser from painting until effect completes)

```
  ┌──────┐   ┌────────┐   ┌──────────────┐   ┌───────┐   ┌──────────┐
  │Render│──▶│DOM     │──▶│useLayoutEffect│──▶│Browser│──▶│useEffect │
  │      │   │update  │   │(blocks paint) │   │Paint  │   │(async)   │
  └──────┘   └────────┘   └──────────────┘   └───────┘   └──────────┘
```

**MUST use useLayoutEffect when:**

1. **Measuring DOM then updating:** Reading element dimensions (getBoundingClientRect) then setting position/size — avoids flash of wrong position
2. **Tooltip/Popover positioning:** Measure trigger element, position tooltip, then paint — no flicker
3. **Scroll position restoration:** Set scrollTop before user sees the content

```tsx
function Tooltip({ triggerRef, children }) {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    // Measure trigger element BEFORE paint
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({ top: rect.bottom + 8, left: rect.left });
  }, []); // If useEffect → flash tooltip at (0,0) before jumping

  return (
    <div ref={tooltipRef} style={position}>
      {children}
    </div>
  );
}
```

**Rule:** Default to `useEffect`. Only switch to `useLayoutEffect` when you SEE visual flicker/flash that needs fixing.

🇻🇳 Cả hai chạy sau render, nhưng thời điểm khác nhau:

- `useEffect` chạy **sau khi vẽ** (trình duyệt đã hiển thị cho user)
- `useLayoutEffect` chạy **trước khi vẽ** (chặn trình duyệt vẽ cho đến khi effect xong)

**PHẢI dùng useLayoutEffect khi:** (1) Đo DOM rồi cập nhật (kích thước, vị trí) — tránh nhấp nháy sai vị trí, (2) Định vị tooltip/popover, (3) Khôi phục vị trí cuộn. **Nguyên tắc:** Mặc định dùng useEffect. Chỉ đổi sang useLayoutEffect khi THẤY nhấp nháy cần sửa.

**💡 Interview Signal / Dấu hiệu trả lời tốt:**

- ✅ Strong: Can draw the timeline (render → DOM → useLayoutEffect → paint → useEffect), gives specific use case (tooltip positioning) / Vẽ được timeline, cho use case cụ thể
- ❌ Weak: "useLayoutEffect runs synchronously" — correct but lacks timing context and when it's needed / Đúng nhưng thiếu thời điểm và khi nào cần

**🔴 Follow-up Chain:**

1. "What's the risk of useLayoutEffect?" → Blocks paint → if the effect takes long, UI freezes. Only use for quick DOM measurements, never for data fetching. / Chặn vẽ → nếu effect chạy lâu, UI đóng băng. Chỉ dùng cho đo DOM nhanh, không fetch data.
2. "What's the issue with useLayoutEffect in SSR?" → Server has no DOM → warning. Fix: check `typeof window`, or use useEffect for SSR-safe code, useLayoutEffect only on client. / Server không có DOM → cảnh báo. Sửa: kiểm tra `typeof window`.
3. "How does React 18's useInsertionEffect differ?" → useInsertionEffect runs BEFORE useLayoutEffect — specifically for CSS-in-JS libraries to inject styles before DOM measurement. App developers almost never need it. / Chạy TRƯỚC useLayoutEffect — dành cho CSS-in-JS inject styles. Dev ứng dụng hầu như không cần.

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| #   | Question                     | Level | Key Point EN                                 | Key Point VI                              |
| --- | ---------------------------- | ----- | -------------------------------------------- | ----------------------------------------- |
| Q1  | Functional updater useState  | 🟢    | Avoids stale closure with multiple updates   | Tránh stale closure khi update nhiều lần  |
| Q2  | useEffect cleanup timing     | 🟢    | Runs before next effect + on unmount         | Chạy trước effect mới + khi unmount       |
| Q3  | Derived state anti-pattern   | 🟡    | Double render, use useMemo instead           | 2 lần render, dùng useMemo thay thế       |
| Q4  | useMemo vs useCallback       | 🟡    | Cache value vs function, needs React.memo    | Cache giá trị vs function, cần React.memo |
| Q5  | Batching React 17 vs 18      | 🟡    | R17 only React handlers, R18 everywhere      | R17 chỉ React handler, R18 mọi nơi        |
| Q6  | Race condition useEffect     | 🔴    | AbortController in cleanup                   | AbortController trong cleanup             |
| Q7  | Design useFetch hook         | 🔴    | useReducer + AbortController + cache         | useReducer + AbortController + cache      |
| Q8  | useLayoutEffect vs useEffect | 🔴    | Before paint vs after paint, DOM measurement | Trước vẽ vs sau vẽ, đo DOM                |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn Bất Ngờ

> 🎯 Interviewer asks cold: **"Explain how React stores hook state internally."**
> 🎯 Interviewer hỏi bất ngờ: **"Giải thích cách React lưu state của hooks bên trong."**

**Ideal 30-second opening / 30 giây đầu — mở đầu lý tưởng:**

🇬🇧

1. "React stores hooks as a linked list on the fiber node — each hook is a node in the list, identified by call order, not by name."
2. "When a component renders, React walks the linked list from the start — hook #1 reads node #1, hook #2 reads node #2. That's why the call order must be the same every render."
3. "In a previous project, I debugged a bug where a teammate put useState inside an if block — states got mixed up because the linked list pointer shifted."
4. "This is also why use() in React 19 isn't a hook — it's not stored in the linked list, so it can be used in conditionals."

🇻🇳

1. "React lưu hooks dưới dạng linked list trên fiber node — mỗi hook là 1 node trong list, nhận diện bằng thứ tự gọi, không bằng tên."
2. "Khi component render, React duyệt linked list từ đầu — hook thứ 1 đọc node thứ 1, hook thứ 2 đọc node thứ 2. Vì vậy thứ tự gọi phải giống nhau mọi render."
3. "Trong dự án trước, tôi từng debug bug khi đồng nghiệp đặt useState trong if block — state bị lẫn lộn vì con trỏ linked list bị lệch."
4. "Đây cũng là lý do use() trong React 19 không phải hook — nó không lưu trong linked list nên dùng trong điều kiện được."

_Then expand based on the interviewer's direction. / Sau đó mở rộng theo hướng interviewer dẫn dắt._

---

## Self-Check / Tự Kiểm Tra ⚡

> **Close the doc before attempting. / Đóng tài liệu lại trước khi làm.**

- [ ] **Retrieval / Nhớ lại**: Write the mechanism of how useState stores state from memory (linked list, fiber node). Compare with Layer 2 of useState. / Viết cơ chế useState lưu state từ trí nhớ.
- [ ] **Visual / Trực quan**: Draw the useEffect execution timeline on paper (render → DOM → useLayoutEffect → paint → useEffect → cleanup). Compare with the ASCII diagram above. / Vẽ timeline useEffect ra giấy.
- [ ] **Application / Áp dụng**: A component fetches data based on a rapidly changing search query — what do you use to prevent race conditions? Write skeleton code. / Component fetch data theo query thay đổi nhanh — dùng gì tránh race condition?
- [ ] **Debug / Gỡ lỗi**: `setCount(count + 1)` called 3 times in a row in one handler, count only increases by 1 — cause? Fix? / `setCount(count + 1)` gọi 3 lần, count chỉ tăng 1 — nguyên nhân? Cách sửa?
- [ ] **Teach / Dạy lại**: Explain Rules of Hooks to a non-programmer using the "movie theater seats" analogy. / Giải thích Rules of Hooks cho người không biết lập trình bằng ví dụ "ghế rạp phim".

💬 **Feynman Prompt:** Explain useEffect to a non-programmer using the analogy "a reminder note on a door". No technical terms. / Giải thích useEffect cho người không biết lập trình, dùng ví dụ "tờ giấy nhắc nhở dán trên cửa". Không dùng thuật ngữ kỹ thuật.

🔁 **Spaced Repetition:** Review this file after **3 days → 7 days → 14 days** to transfer to long-term memory. / Ôn lại file này sau **3 ngày → 7 ngày → 14 ngày**.

---

## Connections / Liên Kết

- ⬅️ **Built on / Xây dựng trên:** [React Fundamentals](./01-react-fundamentals.md) — need to understand component, render, fiber before understanding where hooks are stored / cần hiểu component, render, fiber trước khi hiểu hooks lưu ở đâu
- ➡️ **Enables / Mở đường cho:** [Advanced Patterns](./04-advanced-patterns.md) — custom hooks, compound components use hooks extensively / custom hooks, compound components dùng hooks nhiều
- ➡️ **Enables / Mở đường cho:** [State Management](./05-state-management.md) — Context + useReducer is the foundation for state management / Context + useReducer là nền tảng quản lý state
- ➡️ **Enables / Mở đường cho:** [Performance Optimization](./09-performance-optimization.md) — useMemo, useCallback, React.memo patterns
- 🔗 **Applied in / Áp dụng trong:** Every React application — hooks are the only way to have state/effects in function components / Mọi ứng dụng React — hooks là cách duy nhất có state/effects trong function component
