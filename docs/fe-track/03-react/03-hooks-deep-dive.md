# React Hooks Deep Dive / React Hooks Chi Tiết

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [React Fundamentals](./01-react-fundamentals.md)
> **See also**: [React 19 Features](./02-react-19-features.md) | [Hooks Comprehensive](./07-hooks-comprehensive.md) | [Performance Optimization](./09-performance-optimization.md)
> **L5 Competencies**: State Design, Side-Effect Management, Performance Reasoning

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn vừa join dự án React. Component `Dashboard` có 12 cái `useState`, 5 cái `useEffect`, 3 cái `useMemo`. Khi click button "Refresh", dashboard flicker rồi hiện data cũ 1 giây trước khi cập nhật. Console log cho thấy effect chạy 4 lần thay vì 1. Bạn thêm `console.log` vào useEffect thì thấy nó chạy → cleanup → chạy lại → cleanup → chạy lại. Bạn không biết tại sao.

Nếu không hiểu hooks sâu — cách React lưu state, khi nào effect chạy, tại sao deps array quan trọng — bạn sẽ debug bằng "thử xoá deps xem sao" và tạo ra bug mới.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng:**
Hooks giống như **hộp ký gửi ở ngân hàng**. Function component mỗi lần render là 1 lần bạn đến ngân hàng — bạn không mang đồ theo (function chạy xong thì biến cục bộ mất). Nhưng hooks cho bạn mở hộp ký gửi (state) — mỗi lần đến, bạn mở đúng hộp đó lấy đồ ra (useState trả lại giá trị cũ). useEffect giống tờ giấy dặn dò bạn gửi ở ngân hàng: "Sau khi tôi về, xin gọi API này cho tôi".

| Không có Hooks                                        | Có Hooks                                      |
| ----------------------------------------------------- | --------------------------------------------- |
| Function chạy xong → mọi thứ mất                      | State lưu ở React fiber, tồn tại qua render   |
| Phải dùng class component để có state                 | Function component có đầy đủ khả năng         |
| Logic share phải dùng HOC/render props (wrapper hell) | Custom hooks share logic không thêm component |
| Lifecycle methods (mount/update/unmount) rải rác      | useEffect gộp synchronization logic 1 chỗ     |

**Tại sao phải học topic này?**

- **100% phỏng vấn React** sẽ hỏi hooks — từ Junior "useState vs useReducer" đến Senior "thiết kế custom hook"
- Hooks là nền tảng cho mọi thứ phía sau: state management, performance optimization, patterns
- Hiểu sai hooks = tạo bug khó debug nhất (stale closure, infinite loop, race condition)

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

**Bạn đang ở đây trong lộ trình học:**

```
React Fundamentals → [HOOKS DEEP DIVE] → Advanced Patterns → State Management
```

---

## Overview / Tổng Quan

React Hooks are functions that let you "hook into" React's internal state and lifecycle from function components. The six core hooks — useState, useReducer, useEffect, useMemo, useCallback, useRef — cover 95% of use cases. Understanding their internal model (linked list stored on fiber nodes) is key to avoiding the most common React bugs.

React Hooks là các hàm cho phép function component "móc vào" state và lifecycle nội bộ của React. 6 hooks cốt lõi — useState, useReducer, useEffect, useMemo, useCallback, useRef — xử lý 95% use cases. Hiểu internal model (linked list lưu trên fiber node) là chìa khoá để tránh bug phổ biến nhất trong React.

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. useState / Quản Lý State Cơ Bản

> 🧠 **Memory Hook**: "useState = hộp ký gửi có khoá — bạn gửi giá trị, React giữ hộ, mỗi render bạn lấy lại đúng giá trị đó."

**Tại sao tồn tại? / Why does this exist?**
Function component chạy xong thì biến local mất hết. Cần cách lưu giá trị qua nhiều lần render mà không dùng class.
→ **Why?** Vì function component đơn giản hơn class (không có `this`, không có lifecycle boilerplate), nhưng cần memory.
→ **Why?** Vì React render model là "gọi function lại từ đầu mỗi khi state thay đổi" — memory phải nằm NGOÀI function, do React quản lý.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Hãy tưởng tượng bạn chơi game mà mỗi lần chết phải restart level. Nếu không có save point (useState), bạn mất hết tiến trình. useState giống save point — game restart (re-render) nhưng bạn giữ được đồ (state value).

#### Layer 2: How It Works / Cơ Chế Hoạt Động

useState không lưu state trong function — nó lưu trong **React fiber node**, truy cập qua **linked list**.

```
  Fiber Node cho <Counter />
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

  Render 1: useState(0) → đọc Hook 0 → return 5
  Render 1: useState("") → đọc Hook 1 → return "a"
```

**setState có 2 dạng:**

```tsx
// Dạng 1: Truyền giá trị mới (value form)
setCount(10); // state = 10

// Dạng 2: Truyền function (functional updater)
setCount((prev) => prev + 1); // state = prevState + 1

// TẠI SAO DẠNG 2 QUAN TRỌNG?
// Vì closure capture giá trị tại thời điểm render:
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1); // count = 0 (closure capture)
    setCount(count + 1); // count vẫn = 0 → state = 1, không phải 2!
  };

  const handleClickCorrect = () => {
    setCount((prev) => prev + 1); // prev = 0 → state = 1
    setCount((prev) => prev + 1); // prev = 1 → state = 2  ✅
  };
}
```

**Batching (React 18+):**

```
  React 18+: TẤT CẢ setState đều batched
  ──────────────────────────────────────
  function handleClick() {
    setA(1);      // queued
    setB(2);      // queued
    setC(3);      // queued
  }               // → 1 render duy nhất

  // Kể cả trong setTimeout, Promise, native event:
  setTimeout(() => {
    setA(1);      // queued
    setB(2);      // queued
  }, 100);        // → 1 render duy nhất (React 18+)

  // React 17: chỉ batch trong React event handler
  // setTimeout/Promise → mỗi setState = 1 render riêng
```

**Lazy initializer (cho expensive computation):**

```tsx
// ❌ Sai: expensiveCalc() chạy MỌI render (dù result bị bỏ)
const [data, setData] = useState(expensiveCalc());

// ✅ Đúng: function chỉ chạy lần render ĐẦU TIÊN
const [data, setData] = useState(() => expensiveCalc());
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Object.is comparison:** `setState(cùng giá trị)` → React skip re-render. Nhưng `setState({...obj})` luôn tạo reference mới → luôn re-render.
- **State update trong render:** Gọi `setState` trong render body gây infinite loop (render → setState → render → ...).
- **Multiple state vs object state:** 3 useState rõ ràng hơn 1 useState({a, b, c}) — trừ khi state phải update cùng lúc.
- **React 18 Strict Mode:** Development mode render 2 lần để phát hiện side-effect impure — đừng hoảng khi thấy log 2 lần.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                    | Tại sao sai                                                                           | Đúng là                                                        |
| ------------------------------------------ | ------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `setCount(count + 1)` gọi 2 lần expect +2  | Closure capture `count` lúc render — cả 2 lần đều dùng cùng `count`                   | Dùng functional updater: `setCount(prev => prev + 1)`          |
| `useState(expensiveCalc())`                | Function chạy mọi render dù chỉ dùng result lần đầu                                   | Lazy init: `useState(() => expensiveCalc())`                   |
| Mutate state trực tiếp: `state.push(item)` | React dùng Object.is so sánh reference — mutation không tạo ref mới → không re-render | Spread: `setState([...state, item])`                           |
| Dùng 1 useState object cho mọi thứ         | Update 1 field phải spread hết: `setState({...s, name: 'new'})` — dễ quên field       | Tách thành nhiều useState, hoặc dùng useReducer nếu > 4 fields |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "useState", "state update", "batching", "closure"
- → Nhớ đến: Fiber linked list, functional updater, Object.is comparison, batching
- → Mở đầu trả lời: _"useState lưu state trên React fiber node dưới dạng linked list — mỗi lần render, React duyệt list theo thứ tự gọi. setState có 2 dạng: value form và functional updater — functional updater quan trọng vì tránh stale closure khi gọi nhiều lần liên tiếp."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [UI = f(state), Component](./01-react-fundamentals.md)
- ➡️ Để hiểu tiếp: [useReducer](#2-usereducer), [Performance Optimization](./09-performance-optimization.md)

---

### 2. useReducer / Quản Lý State Phức Tạp

> 🧠 **Memory Hook**: "useReducer = máy ATM — bạn nhấn nút (dispatch action), máy tự xử lý logic (reducer), bạn nhận kết quả."

**Tại sao tồn tại? / Why does this exist?**
Khi state có nhiều sub-values phụ thuộc nhau (loading + data + error), dùng nhiều useState dẫn đến inconsistent state (loading=false nhưng data=null).
→ **Why?** Vì useState xử lý từng giá trị độc lập — không có cách express "2 giá trị phải đổi cùng lúc".
→ **Why?** Vì state transition logic phức tạp cần tập trung 1 chỗ để test và reason about — giống Redux pattern nhưng local cho 1 component.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

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
  │  │ (mới)   │                                 │
  │  └─────────┘                                 │
  └─────────────────────────────────────────────┘
```

**Ví dụ thực tế — Fetch data:**

```tsx
// State type rõ ràng — mọi combination hợp lệ
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

  // TypeScript tự narrow type theo status
  if (state.status === "loading") return <Spinner />;
  if (state.status === "error") return <Error msg={state.error} />;
  if (state.status === "success") return <List data={state.data} />;
  return <button onClick={loadUsers}>Load</button>;
}
```

**dispatch là stable identity:**

```tsx
// dispatch KHÔNG BAO GIỜ thay đổi reference giữa các render
// → an toàn truyền xuống child component không cần useCallback
<ChildComponent onAction={dispatch} /> // KHÔNG re-render khi parent render
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **useState vs useReducer:** Rule of thumb: nếu `setState` tiếp theo phụ thuộc vào state hiện tại, hoặc state có > 3 sub-values liên quan, dùng useReducer.
- **Reducer phải pure:** Không fetch API, không mutate, không log trong reducer. Side-effect xử lý trong component rồi dispatch kết quả.
- **Lazy initialization:** `useReducer(reducer, arg, init)` — tham số thứ 3 là init function, giống lazy init của useState.
- **Testing advantage:** Reducer là pure function — import vào test file, gọi trực tiếp, không cần render component.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                           | Tại sao sai                                                  | Đúng là                                                   |
| ------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| Side-effect trong reducer (fetch, log)            | Reducer PHẢI pure — React có thể gọi nhiều lần (Strict Mode) | Side-effect trong component, dispatch kết quả             |
| Dùng useReducer cho state đơn giản (1 boolean)    | Over-engineering — useState đủ cho toggle/count              | useReducer khi state > 3 fields hoặc transitions phức tạp |
| Quên handle default case                          | Action type typo → state không thay đổi, không có error      | TypeScript discriminated union + exhaustive check         |
| Mutate state trong reducer: `state.items.push(x)` | Giống useState — phải tạo object/array mới                   | `return { ...state, items: [...state.items, x] }`         |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "useState vs useReducer", "complex state management", "reducer pattern"
- → Nhớ đến: Multiple related sub-values, dispatch stable identity, testable pure function
- → Mở đầu trả lời: _"useReducer tập trung state transition logic vào 1 pure function — dispatch action mô tả 'cái gì xảy ra', reducer quyết định 'state thay đổi thế nào'. Lợi ích: state luôn consistent (loading + data + error đổi cùng lúc), dispatch là stable reference, và reducer test được độc lập không cần render."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [useState](#1-usestate)
- ➡️ Để hiểu tiếp: [State Management / Redux](./05-state-management.md)

---

### 3. useEffect / Đồng Bộ Với Thế Giới Bên Ngoài

> 🧠 **Memory Hook**: "useEffect = cầu nối giữa React world (pure render) và outside world (API, DOM, timer) — ĐỒNG BỘ, không phải lifecycle."

**Tại sao tồn tại? / Why does this exist?**
React render phải pure — cùng props/state, cùng output. Nhưng app thực cần: gọi API, listen event, update `document.title`, connect WebSocket. Cần 1 cơ chế để side-effect chạy SAU render mà không ảnh hưởng render.
→ **Why?** Vì nếu side-effect chạy TRONG render, mỗi re-render sẽ trigger side-effect lại — infinite loop hoặc race condition.
→ **Why?** Vì React cần tự do re-render bất cứ lúc nào (concurrent features) — side-effect phải tách riêng để React kiểm soát timing.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Hãy tưởng tượng bạn trang trí phòng (render). Xong rồi bạn dán tờ giấy nhắc nhở trên cửa: "Khi khách đến (effect), hãy mở nhạc" (fetch data). Nếu bạn sửa phòng (re-render), tờ giấy cũ bị xé (cleanup), dán tờ mới. Và tờ giấy chỉ được thực hiện SAU KHI bạn ra khỏi phòng (after render commit).

#### Layer 2: How It Works / Cơ Chế Hoạt Động

**Mental model đúng: SYNCHRONIZATION, không phải lifecycle.**

```
  ❌ Mental model cũ (lifecycle):
  componentDidMount    → useEffect(fn, [])
  componentDidUpdate   → useEffect(fn, [dep])
  componentWillUnmount → useEffect cleanup

  ✅ Mental model đúng (synchronization):
  "Đồng bộ state X của component với system Y bên ngoài"

  useEffect(() => {
    // START sync: connect to external system
    const ws = new WebSocket(url);
    return () => {
      // STOP sync: disconnect when url changes or unmount
      ws.close();
    };
  }, [url]); // re-sync when url changes
```

**3 dạng dependency array:**

```
  ┌───────────────────────────────────────────────────────┐
  │  Deps Array             │ Khi nào effect chạy?       │
  ├─────────────────────────┼────────────────────────────┤
  │  Không truyền           │ SAU MỌI render             │
  │  useEffect(fn)          │ (hiếm khi đúng)            │
  │                         │                            │
  │  Mảng rỗng []           │ SAU render ĐẦU TIÊN only  │
  │  useEffect(fn, [])      │ (mount + unmount cleanup)  │
  │                         │                            │
  │  Có deps [a, b]         │ SAU render nào mà          │
  │  useEffect(fn, [a, b])  │ a hoặc b THAY ĐỔI         │
  │                         │ (so sánh Object.is)        │
  └─────────────────────────┴────────────────────────────┘
```

**Execution timeline:**

```
  Render 1 (mount):
  ┌────────────┐     ┌─────────────┐     ┌──────────────┐
  │ Component  │────▶│ React commit│────▶│ Effect runs  │
  │ returns    │     │ to DOM      │     │ (sau paint)  │
  │ JSX        │     │             │     │              │
  └────────────┘     └─────────────┘     └──────────────┘

  Render 2 (deps changed):
  ┌────────────┐     ┌─────────────┐     ┌──────────────┐     ┌──────────┐
  │ Component  │────▶│ React commit│────▶│ CLEANUP runs │────▶│ NEW      │
  │ returns    │     │ to DOM      │     │ (effect cũ)  │     │ effect   │
  │ new JSX    │     │             │     │              │     │ runs     │
  └────────────┘     └─────────────┘     └──────────────┘     └──────────┘

  Unmount:
  ┌──────────────┐
  │ CLEANUP runs │  (lần cuối)
  │ (effect cũ)  │
  └──────────────┘
```

**Anti-pattern: Derived state trong useEffect:**

```tsx
// ❌ Anti-pattern: tính derived state trong effect
function FilteredList({ items, query }) {
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    setFiltered(items.filter((i) => i.name.includes(query)));
  }, [items, query]);
  // Vấn đề: render 1 lần với data cũ, rồi effect chạy, setState, render lần 2
  // → 2 renders thay vì 1, flash of old data

  return <List data={filtered} />;
}

// ✅ Đúng: tính trực tiếp trong render (hoặc useMemo)
function FilteredList({ items, query }) {
  const filtered = useMemo(() => items.filter((i) => i.name.includes(query)), [items, query]);
  // 1 render duy nhất, không flash
  return <List data={filtered} />;
}
```

**Race condition khi fetch data:**

```tsx
// ❌ Race condition: user type nhanh, response cũ đến sau response mới
useEffect(() => {
  fetch(`/api/search?q=${query}`)
    .then((r) => r.json())
    .then(setResults); // response nào đến sau cùng "thắng" → wrong results
}, [query]);

// ✅ Fix: AbortController cancel request cũ
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/search?q=${query}`, { signal: controller.signal })
    .then((r) => r.json())
    .then(setResults)
    .catch((e) => {
      if (e.name !== "AbortError") throw e; // ignore abort
    });

  return () => controller.abort(); // cleanup cancel request cũ
}, [query]);
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Strict Mode double invoke:** React 18 dev mode mount → unmount → mount lại để test cleanup. Effect chạy 2 lần là EXPECTED.
- **Object/Array deps:** `useEffect(fn, [{ a: 1 }])` → effect chạy mọi render vì `{}` !== `{}` (reference mới). Cần primitive deps hoặc memoize.
- **Missing deps:** ESLint `exhaustive-deps` rule bắt buộc khai báo mọi dependency. Suppress = tạo stale closure bug.
- **Effect vs Event handler:** Nếu side-effect xảy ra do USER ACTION (click, submit), đặt trong event handler. Nếu xảy ra do STATE CHANGE (sync with external system), đặt trong useEffect.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                | Tại sao sai                                       | Đúng là                                  |
| -------------------------------------- | ------------------------------------------------- | ---------------------------------------- |
| Tính derived state trong useEffect     | 2 renders: 1 cũ + 1 mới — flash of stale data     | Tính trực tiếp trong render hoặc useMemo |
| Fetch data không có AbortController    | Race condition: response cũ overwrite mới         | AbortController trong cleanup            |
| `// eslint-disable exhaustive-deps`    | Stale closure — effect dùng giá trị cũ            | Thêm đủ deps, refactor nếu cần           |
| `useEffect(fn)` không có deps array    | Effect chạy SAU MỌI render — thường là bug        | Thêm deps array phù hợp `[dep1, dep2]`   |
| Dùng useEffect cho event handler logic | Effect chạy sau render, không phải khi user click | Đặt logic trong event handler trực tiếp  |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "useEffect", "side effects", "data fetching", "cleanup"
- → Nhớ đến: Synchronization mental model, 3 dạng deps, cleanup timing, race condition
- → Mở đầu trả lời: _"useEffect đồng bộ component state với external system — mental model đúng là synchronization, không phải lifecycle. Effect chạy sau render commit, cleanup chạy trước effect mới hoặc khi unmount. Ba anti-pattern phổ biến: derived state trong effect, fetch không có AbortController, và suppress exhaustive-deps."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [useState](#1-usestate), [Render/Commit phases](./01-react-fundamentals.md)
- ➡️ Để hiểu tiếp: [Custom Hooks](./07-hooks-comprehensive.md), [useLayoutEffect](./07-hooks-comprehensive.md)

---

### 4. useMemo & useCallback / Tối Ưu Reference

> 🧠 **Memory Hook**: "useMemo cache GIÁ TRỊ, useCallback cache HÀM — cả hai tránh tạo reference mới không cần thiết."

**Tại sao tồn tại? / Why does this exist?**
Mỗi render, React tạo object/function mới. Child component nhận reference mới → re-render dù value không đổi. Với list lớn hoặc expensive computation, re-render thừa gây lag.
→ **Why?** Vì JavaScript so sánh object/function bằng reference, không bằng value: `{a:1} !== {a:1}`.
→ **Why?** Vì React re-render propagates xuống toàn bộ subtree — 1 re-render thừa ở parent = 100 re-render ở children.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Hãy tưởng tượng bạn nấu ăn. Mỗi bữa bạn nấu lại từ đầu (re-render tạo mới). useMemo giống tủ lạnh — nấu 1 lần, cất đi, bữa sau lấy ra ăn nếu nguyên liệu không đổi. useCallback giống công thức nấu ăn được laminate — bạn không viết lại công thức mỗi bữa, dùng lại tờ cũ.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
  ┌────────────────────────────────────────────────────┐
  │           useMemo vs useCallback                    │
  ├────────────────────────────────────────────────────┤
  │                                                     │
  │  useMemo(() => value, [deps])                      │
  │  = cache VALUE (kết quả của function)              │
  │                                                     │
  │  useCallback(fn, [deps])                           │
  │  = cache FUNCTION chính nó                         │
  │                                                     │
  │  Thực chất:                                        │
  │  useCallback(fn, deps) === useMemo(() => fn, deps) │
  │                                                     │
  └────────────────────────────────────────────────────┘
```

**Khi nào cần:**

```
  ┌──────────────────────────────────────────────────────┐
  │  CẦN dùng khi:                                      │
  │  ─────────────────                                   │
  │  1. useMemo: Expensive computation (sort 10K items)  │
  │  2. useCallback: Function truyền xuống React.memo    │
  │     child component                                  │
  │  3. useMemo: Object/array dùng làm deps cho         │
  │     useEffect khác                                   │
  │                                                      │
  │  KHÔNG CẦN khi:                                     │
  │  ─────────────────                                   │
  │  1. Computation nhẹ (string concatenation, simple    │
  │     filter < 100 items)                              │
  │  2. Function chỉ dùng trong component (không         │
  │     truyền xuống memo child)                         │
  │  3. React 19 + Compiler (Compiler tự thêm)          │
  └──────────────────────────────────────────────────────┘
```

**Ví dụ thực tế:**

```tsx
function ProductList({ products, query }) {
  // ✅ useMemo: sort/filter 10K products — expensive
  const filtered = useMemo(
    () => products.filter((p) => p.name.includes(query)).sort((a, b) => a.price - b.price),
    [products, query],
  );

  // ✅ useCallback: truyền xuống React.memo child
  const handleSelect = useCallback((id: string) => {
    setSelected(id);
  }, []);

  return filtered.map((p) => (
    // ProductCard wrapped in React.memo → skip re-render nếu props không đổi
    <ProductCard key={p.id} product={p} onSelect={handleSelect} />
  ));
}

const ProductCard = React.memo(function ProductCard({ product, onSelect }) {
  return <div onClick={() => onSelect(product.id)}>{product.name}</div>;
});
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Cost of memoization:** useMemo/useCallback không free — so sánh deps mỗi render, lưu giá trị cũ trong memory. Nếu computation rẻ hơn comparison, memoization chậm hơn không memo.
- **React Compiler tương lai:** React 19 Compiler tự thêm memoization — useMemo/useCallback manual sẽ dần ít cần.
- **Premature optimization:** Đo trước (React Profiler), optimize sau. Đừng memo mọi thứ "phòng trường hợp".
- **Reference stability cho deps:** Nếu object dùng làm useEffect dep, phải useMemo để tránh effect chạy mọi render.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                                                       | Đúng là                                                   |
| -------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Memo mọi thứ "cho chắc"                      | Overhead: deps comparison + memory > cost of recompute cho cheap operations       | Chỉ memo khi đo được benefit (expensive hoặc child memo)  |
| useCallback cho function chỉ dùng trong JSX  | Function không truyền xuống memo child → memo vô ích                              | Chỉ useCallback khi function là prop của React.memo child |
| useMemo nhưng deps thay đổi mọi render       | Deps là object/array mới mỗi render → useMemo cache miss 100% → tệ hơn không memo | Đảm bảo deps là primitive hoặc stable reference           |
| Quên React.memo ở child khi dùng useCallback | useCallback giữ stable ref, nhưng child không có memo → vẫn re-render             | useCallback + React.memo luôn đi đôi                      |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "useMemo vs useCallback", "React.memo", "optimization", "reference equality"
- → Nhớ đến: Cache value vs cache function, useCallback + React.memo đôi, measure before optimize
- → Mở đầu trả lời: _"useMemo cache giá trị tính toán, useCallback cache function reference — mục đích chính là tránh tạo reference mới không cần thiết, gây re-render ở child component có React.memo. Quan trọng: useCallback chỉ có ý nghĩa khi child component wrapped trong React.memo, và cần đo performance trước khi optimize."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Reference equality](./01-react-fundamentals.md), [useState](#1-usestate)
- ➡️ Để hiểu tiếp: [Performance Optimization](./09-performance-optimization.md), [React Compiler](./02-react-19-features.md)

---

### 5. useRef / Tham Chiếu Không Render

> 🧠 **Memory Hook**: "useRef = ngăn kéo bí mật — thay đổi `.current` mà React KHÔNG BIẾT, KHÔNG re-render."

**Tại sao tồn tại? / Why does this exist?**
Đôi khi cần giữ giá trị qua render mà KHÔNG trigger re-render: DOM reference, timer ID, previous value, instance variable.
→ **Why?** Vì useState mỗi lần set → re-render. Có những giá trị cần persist mà UI không cần biết (timer ID, observer instance).
→ **Why?** Vì React function component chạy lại từ đầu mỗi render — local variable mất. Cần "escape hatch" cho mutable value không liên quan đến UI.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Hãy tưởng tượng bạn đang thi viết văn (render). useState giống bảng trắng trước lớp — viết gì lên là cả lớp thấy (UI re-render). useRef giống cuốn sổ tay trong túi — bạn ghi chú bao nhiêu cũng được, không ai thấy, không ảnh hưởng bài thi.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
  ┌─────────────────────────────────────────────────┐
  │           useRef vs useState                     │
  ├─────────────────────────────────────────────────┤
  │                                                  │
  │  useState:                                       │
  │  setValue(new) → React queue re-render → UI      │
  │  update                                          │
  │                                                  │
  │  useRef:                                         │
  │  ref.current = new → NOTHING HAPPENS             │
  │  (no re-render, React doesn't know)              │
  │                                                  │
  │  Cả hai đều persist qua render:                  │
  │  ┌────────────────────────────────────────┐     │
  │  │ Fiber Node                             │     │
  │  │  hooks: [                              │     │
  │  │    { state: 5 },        ← useState    │     │
  │  │    { current: divRef }, ← useRef      │     │
  │  │  ]                                     │     │
  │  └────────────────────────────────────────┘     │
  └─────────────────────────────────────────────────┘
```

**2 use cases chính:**

```tsx
// USE CASE 1: DOM reference
function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus(); // truy cập DOM element trực tiếp
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}

// USE CASE 2: Mutable value không trigger re-render
function Timer() {
  const intervalRef = useRef<number | null>(null);

  const start = () => {
    intervalRef.current = setInterval(() => {
      console.log("tick");
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // cần ref để clear đúng interval
    }
  };

  return (
    <>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}

// USE CASE 3: Previous value
function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef(0);

  useEffect(() => {
    prevCountRef.current = count; // update SAU render
  });

  return (
    <p>
      Now: {count}, Before: {prevCountRef.current}
    </p>
  );
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Đọc ref.current trong render:** Không nên — giá trị có thể stale hoặc thay đổi giữa render (concurrent features).
- **Callback ref vs useRef:** Callback ref `<div ref={(node) => {...}}>` chạy khi DOM node mount/unmount — dùng khi cần đo kích thước hoặc observe.
- **React 19 ref cleanup:** Callback ref có thể return cleanup function — xem [React 19 Features](./02-react-19-features.md).

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                             | Tại sao sai                                       | Đúng là                                     |
| ----------------------------------- | ------------------------------------------------- | ------------------------------------------- |
| Dùng ref để trigger UI update       | ref.current thay đổi không re-render → UI stale   | Dùng useState cho giá trị hiển thị trong UI |
| Đọc ref.current trong render return | Concurrent features có thể đọc giá trị giữa chừng | Đọc ref trong effect hoặc event handler     |
| Quên check `ref.current !== null`   | ref.current là null cho đến khi DOM mount         | Always null-check: `ref.current?.focus()`   |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "useRef", "DOM manipulation", "mutable value", "previous value"
- → Nhớ đến: 2 use cases (DOM ref + mutable non-render value), không trigger re-render
- → Mở đầu trả lời: _"useRef có 2 use cases chính: (1) tham chiếu DOM element để manipulate trực tiếp, (2) giữ mutable value qua render mà không trigger re-render — ví dụ timer ID, previous value, observer instance. Khác biệt cốt lõi với useState: thay đổi ref.current không gây re-render."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [DOM, Component](./01-react-fundamentals.md)
- ➡️ Để hiểu tiếp: [ref changes React 19](./02-react-19-features.md), [Imperative Handle pattern](./04-advanced-patterns.md)

---

### 6. Rules of Hooks (Internal Model) / Luật Của Hooks

> 🧠 **Memory Hook**: "Hooks = danh sách liên kết theo THỨ TỰ GỌI — gọi sai thứ tự = lấy nhầm state."

**Tại sao tồn tại? / Why does this exist?**
React nhận diện hooks bằng thứ tự gọi trong mỗi render, không bằng tên hay key. Nếu thứ tự thay đổi (do conditional/loop), hook này lấy state của hook khác.
→ **Why?** Vì React chọn linked list thay vì named map để đơn giản hoá API — dev không cần đặt tên cho mỗi hook.
→ **Why?** Vì design decision này cho phép custom hooks compose tự nhiên — mỗi hook thêm node vào list, không sợ name collision.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Hãy tưởng tượng hàng ghế trong rạp phim. Mỗi hook là 1 người ngồi theo thứ tự: ghế 1 = useState(count), ghế 2 = useEffect(fetch), ghế 3 = useRef(input). Nếu lần xem phim tiếp theo, người ghế 1 vắng mặt (hook bị skip vì `if`), mọi người dồn lên 1 ghế: người ghế 2 ngồi ghế 1 → lấy state của count thay vì effect của fetch. Chaos.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
  Render 1:                          Render 2 (ĐÚNG):
  ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐
  │Hook 0│──▶│Hook 1│──▶│Hook 2│   │Hook 0│──▶│Hook 1│──▶│Hook 2│
  │count │   │effect│   │ref   │   │count │   │effect│   │ref   │
  │= 5   │   │fetch │   │input │   │= 6   │   │fetch │   │input │
  └──────┘   └──────┘   └──────┘   └──────┘   └──────┘   └──────┘
  Pointer:  0 → 1 → 2              Pointer:  0 → 1 → 2
  ✅ Thứ tự giống → đúng hook      ✅ Thứ tự giống → đúng hook

  Render 2 (SAI — skip hook 0 vì if):
  ┌──────┐   ┌──────┐
  │Hook 0│──▶│Hook 1│
  │effect │   │ref   │    ← Hook 0 giờ là effect nhưng đọc state = 6
  │= 6?! │   │fetch?!│   ← DISASTER: state lẫn lộn
  └──────┘   └──────┘
```

**2 Rules:**

```
  ╔══════════════════════════════════════════════════════╗
  ║  RULE 1: Chỉ gọi Hooks ở TOP LEVEL                ║
  ║  ─ Không trong if, for, while, nested function      ║
  ║  ─ Đảm bảo thứ tự gọi GIỐNG NHAU mọi render      ║
  ║                                                      ║
  ║  RULE 2: Chỉ gọi Hooks trong React FUNCTION        ║
  ║  ─ Function component                               ║
  ║  ─ Custom hook (function bắt đầu bằng "use")       ║
  ║  ─ KHÔNG gọi trong class, regular function, callback║
  ╚══════════════════════════════════════════════════════╝
```

**Ví dụ vi phạm và fix:**

```tsx
// ❌ Vi phạm Rule 1: hook trong conditional
function Profile({ userId }) {
  if (!userId) return null;
  const [user, setUser] = useState(null); // BUG: skip khi userId falsy
  useEffect(() => {
    fetch(userId);
  }, [userId]);
}

// ✅ Fix: hook trước conditional
function Profile({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (!userId) return; // check TRONG effect, không skip effect
    fetch(userId).then(setUser);
  }, [userId]);

  if (!userId) return null; // early return SAU hooks
  return <div>{user?.name}</div>;
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Custom hooks:** Bắt buộc prefix "use" — ESLint plugin nhận diện và kiểm tra rules. `useCustomHook` OK, `customHook` bị bỏ qua.
- **use() (React 19):** `use()` KHÔNG phải hook — không lưu trong linked list → dùng trong conditional OK. Đây là ngoại lệ duy nhất.
- **ESLint plugin:** `eslint-plugin-react-hooks` bắt buộc — không suppress `exhaustive-deps` hay `rules-of-hooks`.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                        | Tại sao sai                                    | Đúng là                                 |
| ------------------------------ | ---------------------------------------------- | --------------------------------------- |
| Hook trong if/for/while        | Thứ tự gọi thay đổi → state lẫn lộn giữa hooks | Hooks ở top level, condition TRONG hook |
| Custom hook không prefix "use" | ESLint không check rules → bug silent          | Luôn đặt tên `useSomething`             |
| Suppress rules-of-hooks ESLint | Cho phép vi phạm → runtime bug khó debug       | Refactor code thay vì suppress          |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "Rules of Hooks", "tại sao không gọi hook trong if", "hooks internal"
- → Nhớ đến: Linked list, thứ tự gọi, pointer traversal
- → Mở đầu trả lời: _"React lưu hooks dưới dạng linked list trên fiber node — nhận diện bằng thứ tự gọi, không bằng tên. Nếu thứ tự thay đổi giữa render (do conditional), hook n sẽ đọc state của hook n-1. Hai rules: chỉ top level, chỉ trong React function. Ngoại lệ duy nhất: use() React 19 không phải hook."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Fiber Architecture](./01-react-fundamentals.md)
- ➡️ Để hiểu tiếp: [Custom Hooks](./07-hooks-comprehensive.md), [use() API](./02-react-19-features.md)

---

## Q&A Section / Câu Hỏi Phỏng Vấn

### Q1: useState functional updater dùng khi nào? / When do you use the functional updater form of useState? 🟢 Junior

**A:** Use the functional updater `setState(prev => prev + 1)` when the new state depends on the previous state. This avoids stale closure issues when multiple updates are batched — the `prev` parameter always has the latest value, while directly referencing state captures the value at render time.

Dùng functional updater `setState(prev => prev + 1)` khi state mới phụ thuộc vào state cũ. Tránh stale closure khi gọi setState nhiều lần liên tiếp — `prev` luôn là giá trị mới nhất, còn reference trực tiếp bị closure capture tại thời điểm render.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích closure capture, cho ví dụ increment 2 lần liên tiếp
- ❌ Weak: Chỉ nói "khi state phụ thuộc state cũ" mà không biết tại sao (closure)

---

### Q2: useEffect cleanup function chạy khi nào? / When does the useEffect cleanup function run? 🟢 Junior

**A:** Cleanup runs in two situations: (1) before the next effect execution (when deps change), and (2) when the component unmounts. This ensures the old synchronization is torn down before new one starts — preventing memory leaks and stale subscriptions.

Cleanup chạy 2 lúc: (1) trước khi effect mới chạy (khi deps thay đổi), và (2) khi component unmount. Đảm bảo đồng bộ cũ được dọn trước khi đồng bộ mới bắt đầu — tránh memory leak và subscription cũ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu được CẢ 2 timing (re-run + unmount), dùng ví dụ WebSocket/timer
- ❌ Weak: Chỉ nói "khi unmount" — thiếu trường hợp deps change

---

### Q3: Tại sao không nên tính derived state trong useEffect? / Why shouldn't you compute derived state in useEffect? 🟡 Mid

**A:** Computing derived state in useEffect causes a double render: first render with stale/empty data, then effect runs, calls setState, triggers second render with computed data. This creates a flash of incorrect UI and wastes a render cycle. Instead, compute directly in render body or use useMemo — single render, no flash.

Tính derived state trong useEffect gây double render: render đầu hiển thị data cũ/rỗng, rồi effect chạy, setState, trigger render thứ 2 với data đúng. Gây flash UI sai và lãng phí 1 render cycle. Thay vào đó, tính trực tiếp trong render hoặc useMemo — 1 render duy nhất, không flash.

```tsx
// ❌ Double render (flash of stale data)
const [filtered, setFiltered] = useState([]);
useEffect(() => {
  setFiltered(items.filter((i) => i.active));
}, [items]);

// ✅ Single render
const filtered = useMemo(() => items.filter((i) => i.active), [items]);
```

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích double render, cho code so sánh, biết khi nào cần useMemo vs tính trực tiếp
- ❌ Weak: Chỉ nói "vì performance" mà không giải thích double render mechanism

---

### Q4: useMemo vs useCallback — khi nào dùng cái nào? / useMemo vs useCallback — when to use which? 🟡 Mid

**A:** `useMemo(() => value, deps)` caches the return value of a computation. `useCallback(fn, deps)` caches the function itself. They're equivalent: `useCallback(fn, deps)` === `useMemo(() => fn, deps)`. Use useMemo for expensive computations, useCallback when passing functions as props to React.memo children. Neither is useful without React.memo on the receiving component.

`useMemo` cache giá trị tính toán, `useCallback` cache function. Tương đương: `useCallback(fn, deps)` === `useMemo(() => fn, deps)`. Dùng useMemo cho expensive computation, useCallback khi truyền function xuống child có React.memo. Cả hai vô dụng nếu child không wrap React.memo.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Biết equivalence, biết useCallback vô ích nếu child không memo, đề cập React Compiler tương lai
- ❌ Weak: "useMemo cho value, useCallback cho function" — đúng nhưng thiếu khi nào CẦN

---

### Q5: Giải thích batching trong React 18 khác React 17 thế nào? / Explain how batching differs between React 18 and React 17. 🟡 Mid

**A:** React 17 only batches state updates inside React event handlers (onClick, onChange). Updates in setTimeout, Promises, and native event listeners each trigger a separate re-render. React 18 introduces automatic batching — ALL state updates are batched regardless of where they originate (setTimeout, Promise.then, native events), resulting in fewer re-renders. To opt-out, use `flushSync()`.

React 17 chỉ batch trong React event handler. setState trong setTimeout, Promise, native event → mỗi cái 1 render riêng. React 18 automatic batching — TẤT CẢ setState đều batch, bất kể context (setTimeout, Promise, native). Ít re-render hơn. Opt-out bằng `flushSync()`.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Biết React 17 chỉ batch trong React handler, React 18 batch everywhere, biết `flushSync` opt-out
- ❌ Weak: Không biết React 17 limitation hoặc không biết flushSync

---

### Q6: Race condition khi fetch data trong useEffect — nguyên nhân và giải pháp? / Race condition when fetching data in useEffect — cause and solution? 🔴 Senior

**A:** The race condition occurs when a component fetches data based on a changing dependency (e.g., search query). If user types "abc" then "abcd" quickly, the fetch for "abc" might resolve AFTER "abcd" — overwriting correct results with stale data.

**Root cause:** Multiple in-flight requests with no cancellation mechanism. The last response to arrive "wins", regardless of request order.

**Solutions:**

1. **AbortController** (recommended): Cancel previous request in cleanup
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
  return () => controller.abort(); // cancel request cũ khi query đổi
}, [query]);
```

Race condition xảy ra khi component fetch data theo deps thay đổi nhanh. Request cũ resolve SAU request mới → overwrite đúng bằng sai. Fix bằng AbortController trong cleanup — cancel request cũ khi deps đổi. React Query/SWR xử lý tự động.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích mechanism (multiple in-flight), cho code AbortController, biết React Query alternative
- ❌ Weak: Chỉ nói "dùng loading state" — không giải quyết race condition

**🔴 Follow-up Chain:**

1. "AbortController có work với mọi async operation không?" → AbortController work với fetch, nhưng không cancel Promise.then chain đã started. Cho non-fetch async, dùng boolean flag pattern.
2. "So sánh AbortController vs boolean flag pattern." → AbortController actually cancels network request (saves bandwidth), boolean flag chỉ ignore result. AbortController preferred cho fetch, boolean flag cho non-cancellable operations.
3. "Trong React 19 với use(), race condition này còn xảy ra không?" → use() + Suspense shift responsibility lên: Promise phải stable reference. Nếu parent tạo new Promise khi deps change, cũ bị discard tự nhiên. Nhưng cần cache layer để avoid re-fetch.

---

### Q7: Thiết kế custom hook `useFetch` — bao gồm loading, error, cache, và cancel. / Design a custom hook `useFetch` with loading, error, caching, and cancellation. 🔴 Senior

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

    // Check cache
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

**Design decisions explained:**

- **useReducer over useState:** State transitions (loading→success, loading→error) are always consistent
- **Map cache:** Simple TTL-based, module-scope (shared across components)
- **AbortController:** Cancels in-flight request on URL change or unmount
- **Discriminated union:** TypeScript narrows type based on `status` field
- **null URL:** Conditional fetch — pass null to skip

Thiết kế dùng useReducer cho consistent state transitions, AbortController cho cancel, Map cache với TTL. Trade-off: cache đơn giản (không có stale-while-revalidate, retry, refetch-on-focus). Production nên dùng React Query.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: useReducer cho consistent state, AbortController, cache với invalidation, discriminated union type
- ❌ Weak: Nhiều useState rời rạc, không cancel, không cache, không handle error

**🔴 Follow-up Chain:**

1. "Cache này có vấn đề gì khi nhiều component dùng cùng URL?" → Concurrent requests cùng URL → multiple fetches. Fix: request dedup — check if cache key has pending Promise, return cùng Promise.
2. "Làm sao add retry logic?" → Wrap fetch trong retry function với exponential backoff. Nhưng phải reset retry count khi URL change. AbortController phải abort cả retry.
3. "So sánh với React Query — khi nào custom hook đủ?" → Custom hook đủ cho < 5 endpoints, no real-time, no pagination. React Query cần khi: cache invalidation phức tạp, optimistic updates, pagination, devtools, multiple consumers cùng key.

---

### Q8: useLayoutEffect vs useEffect — khi nào PHẢI dùng useLayoutEffect? / useLayoutEffect vs useEffect — when MUST you use useLayoutEffect? 🔴 Senior

**A:** Both run after render, but with critical timing difference:

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
    // Đo kích thước trigger element TRƯỚC KHI paint
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({ top: rect.bottom + 8, left: rect.left });
  }, []); // Nếu dùng useEffect → flash tooltip ở vị trí (0,0) trước khi jump

  return (
    <div ref={tooltipRef} style={position}>
      {children}
    </div>
  );
}
```

**Rule:** Default to `useEffect`. Only switch to `useLayoutEffect` when you SEE visual flicker/flash that needs fixing.

useLayoutEffect chạy TRƯỚC paint (block browser), useEffect chạy SAU paint (async). Dùng useLayoutEffect khi cần đo DOM rồi update trước khi user thấy — tooltip positioning, scroll restoration, animation setup. Default useEffect, chỉ đổi khi thấy visual flicker.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Vẽ được timeline (render → DOM → useLayoutEffect → paint → useEffect), cho use case cụ thể (tooltip positioning)
- ❌ Weak: "useLayoutEffect chạy synchronous" — đúng nhưng thiếu timing context và khi nào cần

**🔴 Follow-up Chain:**

1. "useLayoutEffect có risk gì?" → Blocks paint → nếu effect chạy lâu, UI freeze. Chỉ dùng cho quick DOM measurements, không fetch data.
2. "Trong SSR, useLayoutEffect có vấn đề gì?" → Server không có DOM → warning. Fix: check typeof window, hoặc dùng useEffect cho SSR-safe code, useLayoutEffect chỉ client.
3. "React 18 useInsertionEffect khác gì?" → useInsertionEffect chạy TRƯỚC useLayoutEffect — dành riêng cho CSS-in-JS library inject styles trước DOM measurement. App developer hầu như không cần.

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| #   | Question                     | Level | Key Point                                                  |
| --- | ---------------------------- | ----- | ---------------------------------------------------------- |
| Q1  | Functional updater useState  | 🟢    | Tránh stale closure khi multiple updates                   |
| Q2  | useEffect cleanup timing     | 🟢    | Chạy trước next effect + khi unmount                       |
| Q3  | Derived state anti-pattern   | 🟡    | Double render, dùng useMemo thay vì effect+setState        |
| Q4  | useMemo vs useCallback       | 🟡    | Cache value vs cache function, cần React.memo ở child      |
| Q5  | Batching React 17 vs 18      | 🟡    | R17 chỉ React handler, R18 everywhere, flushSync opt-out   |
| Q6  | Race condition useEffect     | 🔴    | AbortController trong cleanup, cancel previous request     |
| Q7  | Design useFetch hook         | 🔴    | useReducer + AbortController + cache + discriminated union |
| Q8  | useLayoutEffect vs useEffect | 🔴    | Before paint vs after paint, DOM measurement, tooltip      |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"Giải thích cho tôi cách React lưu state của hooks internally."**

**30 giây đầu — mở đầu lý tưởng / Ideal 30-second opening:**

1. "React lưu hooks dưới dạng linked list trên fiber node — mỗi hook là 1 node trong list, nhận diện bằng thứ tự gọi, không bằng tên."
2. "Khi component render, React duyệt linked list từ đầu — hook thứ 1 lấy node thứ 1, hook thứ 2 lấy node thứ 2. Vì vậy thứ tự gọi phải giống nhau mọi render."
3. "Trong dự án trước, tôi từng debug bug stale closure khi teammate đặt useState trong if block — state bị lẫn lộn vì linked list pointer shift."
4. "Đây cũng là lý do tại sao use() trong React 19 không phải hook — nó không lưu trong linked list nên dùng trong conditional được."

_Sau đó mở rộng theo hướng interviewer dẫn dắt._

---

## Self-Check / Tự Kiểm Tra ⚡

> **Đóng tài liệu lại trước khi làm — Close the doc before attempting.**

- [ ] **Retrieval**: Viết cơ chế useState lưu state từ trí nhớ (linked list, fiber node). So sánh với Layer 2 của useState.
- [ ] **Visual**: Vẽ useEffect execution timeline (render → DOM → useLayoutEffect → paint → useEffect → cleanup) ra giấy. So sánh với ASCII diagram trên.
- [ ] **Application**: Component fetch data theo search query đổi nhanh — bạn dùng gì để tránh race condition? Viết skeleton code.
- [ ] **Debug**: `setCount(count + 1)` gọi 3 lần liên tiếp trong 1 handler, count chỉ tăng 1 — nguyên nhân? Fix?
- [ ] **Teach**: Giải thích Rules of Hooks cho người không biết lập trình bằng liên tưởng "ghế trong rạp phim".

💬 **Feynman Prompt:** Giải thích useEffect cho người không biết lập trình, dùng liên tưởng "tờ giấy nhắc nhở dán trên cửa phòng". Không dùng thuật ngữ kỹ thuật.

🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày → 7 ngày → 14 ngày** để chuyển vào long-term memory.

---

## Connections / Liên Kết

- ⬅️ **Built on:** [React Fundamentals](./01-react-fundamentals.md) — cần hiểu component, render, fiber trước khi hiểu hooks lưu ở đâu
- ➡️ **Enables:** [Advanced Patterns](./04-advanced-patterns.md) — custom hooks, compound components dùng hooks extensively
- ➡️ **Enables:** [State Management](./05-state-management.md) — Context + useReducer là foundation cho state management
- ➡️ **Enables:** [Performance Optimization](./09-performance-optimization.md) — useMemo, useCallback, React.memo patterns
- 🔗 **Applied in:** Mọi React application — hooks là cách duy nhất để có state/effects trong function component
