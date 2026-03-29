# React Hooks Comprehensive / Toàn Bộ Hooks React

| Thuộc tính / Property | Giá trị / Value                                                          |
| --------------------- | ------------------------------------------------------------------------ |
| **Track**             | Frontend — React                                                         |
| **Difficulty**        | 🟡 Mid → 🔴 Senior                                                       |
| **Prerequisites**     | 03-hooks-deep-dive (useState, useEffect, useRef, useMemo, useCallback)   |
| **See also**          | 01-react-fundamentals, 09-performance-optimization, 02-react-19-features |
| **L5 Competencies**   | System Design, Performance Engineering, API Design                       |

---

## Real-World Scenario / Tình Huống Thực Tế

🇬🇧 You're building a **search products** page for an e-commerce platform. Every keystroke triggers an API call and re-renders a list of 10,000 products. Result: the **input lags** — user types "i-p-h" but input only shows "i", making the app feel frozen.

🇻🇳 Bạn đang build trang **tìm kiếm sản phẩm** cho sàn thương mại điện tử. Mỗi ký tự user gõ đều trigger API call và re-render danh sách 10,000 sản phẩm. Kết quả: **ô input bị lag** — user gõ "i-p-h" mà input chỉ hiện "i", cảm giác app bị đơ.

🇬🇧 The senior dev says: "Use `useTransition` for search, `useDeferredValue` for the list, then wrap the external analytics store with `useSyncExternalStore`." You know `useState` and `useEffect` — but **what are these 3 hooks? When to use which? Why not just `debounce`?**

🇻🇳 Senior dev nói: "Dùng `useTransition` cho search, `useDeferredValue` cho danh sách, rồi wrap analytics store bằng `useSyncExternalStore`." Bạn biết `useState` và `useEffect` rồi — nhưng **3 hooks này là gì? Khi nào dùng cái nào? Tại sao không dùng `debounce` như trước?**

🇬🇧 This file takes you from "knowing basic hooks" to "understanding the entire hooks ecosystem" — including concurrency hooks and professional custom hook design.

🇻🇳 File này đưa bạn từ "biết hooks cơ bản" lên "hiểu toàn bộ hooks ecosystem" — bao gồm concurrency hooks và cách thiết kế custom hooks chuyên nghiệp.

---

**Where you are in the learning path / Bạn đang ở đây trong lộ trình:**

```
03-hooks-deep-dive (useState/useEffect/useRef) → [HOOKS COMPREHENSIVE] → 09-performance-optimization
```

---

## Concept Map / Bản Đồ Khái Niệm

```
                        React Hooks Ecosystem
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                     │
    State Hooks          Effect Hooks          Ref Hooks
    ┌─────────┐         ┌──────────┐         ┌─────────┐
    │useState  │         │useEffect │         │useRef   │
    │useReducer│         │useLayout │         │useImper.│
    │useContext│         │  Effect  │         │         │
    └─────────┘         └──────────┘         └─────────┘
          │
          ▼
    Concurrency Hooks (React 18+)
    ┌──────────────────────────────────┐
    │ useTransition    — "Not urgent"  │
    │ useDeferredValue — "Can wait"    │
    │ useSyncExternal  — "Sync outside"│
    │   Store                          │
    └──────────────────────────────────┘
          │
          ▼
    Performance Hooks
    ┌─────────────────────┐
    │ useMemo             │
    │ useCallback         │
    │ useId               │
    └─────────────────────┘
          │
          ▼
    Custom Hooks = Lego blocks
    (Combine all above / Kết hợp tất cả)
```

---

## Overview / Tổng Quan

🇬🇧 React provides ~15 built-in hooks, each solving a specific problem. Understanding **when** to use each hook matters more than memorizing their APIs. Interviewers don't ask "What is the useTransition API?" — they ask **"When would you use useTransition instead of debounce?"** — meaning you need to understand the **problem** each hook solves, not just syntax.

🇻🇳 React cung cấp ~15 hooks, mỗi cái giải quyết 1 vấn đề cụ thể. Hiểu **khi nào** dùng mỗi hook quan trọng hơn thuộc lòng API. Trong phỏng vấn, người ta không hỏi "API của useTransition là gì?" mà hỏi **"Khi nào dùng useTransition thay vì debounce?"** — tức là bạn cần hiểu **bài toán** mỗi hook giải quyết.

🇬🇧 This file focuses on **3 areas you don't know deeply yet**: Concurrency Hooks (React 18), Custom Hook Architecture, and Hooks Lifecycle — complementing your useState/useEffect knowledge from file 03.

🇻🇳 File này tập trung vào **3 nhóm bạn chưa biết sâu**: Concurrency Hooks (React 18), Custom Hook Architecture, và Hooks Lifecycle — bổ sung cho kiến thức useState/useEffect từ file 03.

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. Hooks Taxonomy & Lifecycle / Phân Loại Hooks & Vòng Đời

> 🧠 **Memory Hook**: "Hooks are a **toolbox** — each drawer holds a different tool. Using the wrong drawer = screwing with a hammer."
> 🧠 "Hooks là **hộp công cụ** — mỗi ngăn chứa 1 loại dụng cụ. Dùng sai ngăn = vặn ốc bằng búa."

**Why does this exist? / Tại sao tồn tại?**

🇬🇧 Class components mixed logic into lifecycle methods (componentDidMount contained fetch data + setup listener + animation). Hooks separate logic by **purpose**, not by **timing**.
→ **Why?** Because logic by timing makes code impossible to reuse — you can't "copy componentDidMount" to another component without pulling unrelated code along.
→ **Why?** Because separation of concerns is a core principle: each unit of code should do **one thing** so it's easy to test, debug, and change.

🇻🇳 Class components trộn lẫn logic vào lifecycle methods (componentDidMount chứa cả fetch data + setup listener + animation). Hooks tách logic theo **mục đích**, không theo **thời điểm**.
→ **Tại sao?** Vì logic theo thời điểm khiến code không thể reuse — bạn không thể "copy componentDidMount" sang component khác mà không kéo theo đống code không liên quan.
→ **Tại sao?** Vì separation of concerns (tách biệt mối quan tâm) là nguyên tắc cốt lõi: mỗi đơn vị code nên làm **1 việc duy nhất** để dễ test, dễ debug, dễ thay đổi.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

🇬🇧 Imagine a **car repair toolbox** with 5 drawers:

- **State drawer** (useState, useReducer, useContext): Holds parts you're working on — screws, bolts being removed
- **Effect drawer** (useEffect, useLayoutEffect): Instructions "after assembling, check X"
- **Ref drawer** (useRef, useImperativeHandle): Sticky notes on the machine — reminders that don't affect the process
- **Performance drawer** (useMemo, useCallback): Cache — "already done this, no need to redo"
- **Concurrency drawer** (useTransition, useDeferredValue): Priority system — "urgent first, heavy stuff later"

🇻🇳 Tưởng tượng **hộp công cụ sửa xe** có 5 ngăn:

- **Ngăn State** (useState, useReducer, useContext): Giữ đồ đang dùng — ốc vít, bu lông đang tháo
- **Ngăn Effect** (useEffect, useLayoutEffect): Hướng dẫn "sau khi lắp xong thì kiểm tra X"
- **Ngăn Ref** (useRef, useImperativeHandle): Giấy nhớ dán lên máy — ghi nhớ nhưng không ảnh hưởng quy trình
- **Ngăn Performance** (useMemo, useCallback): Bộ cache — "cái này làm rồi, không cần làm lại"
- **Ngăn Concurrency** (useTransition, useDeferredValue): Hệ thống ưu tiên — "việc gấp làm trước, việc nặng làm sau"

#### Layer 2: How It Works / Cơ Chế Hoạt Động

🇬🇧 React hooks are stored as a **linked list** on each Fiber node. The order of hook calls must be the same every render — that's why "Rules of Hooks" exist.

🇻🇳 React lưu hooks dưới dạng **linked list** (danh sách liên kết) trên mỗi Fiber node. Thứ tự gọi hooks trong mỗi render phải giống nhau — đó là lý do có "Rules of Hooks".

```
Fiber Node for <SearchPage>
├── hooks: LinkedList
│   ├── [0] useState("") ←── query
│   ├── [1] useEffect(fetchData) ←── sync API
│   ├── [2] useTransition() ←── isPending, startTransition
│   ├── [3] useDeferredValue(query) ←── deferred search
│   ├── [4] useMemo(filterResults) ←── cached computation
│   └── [5] useRef(null) ←── DOM reference
│
│  Execution Order (each render / mỗi render):
│  ──────────────────────────────────────────────
│  1. Render phase: useState → useTransition → useDeferredValue
│                   → useMemo → useRef (read values / đọc giá trị)
│  2. DOM update: React commit changes to DOM
│  3. Effect phase: useLayoutEffect (sync, block paint)
│                   → useEffect (async, after paint)
```

**Hooks Lifecycle Mapping (vs Class) / So sánh với Class:**

| Class Lifecycle            | Hooks Equivalent                          | Note / Ghi chú                            |
| -------------------------- | ----------------------------------------- | ----------------------------------------- |
| `constructor`              | `useState(initialValue)`                  | Runs once only / Chỉ chạy lần đầu         |
| `componentDidMount`        | `useEffect(() => {}, [])`                 | Empty deps = mount                        |
| `componentDidUpdate`       | `useEffect(() => {}, [dep])`              | Deps change = update                      |
| `componentWillUnmount`     | `useEffect(() => { return cleanup }, [])` | Cleanup function                          |
| `shouldComponentUpdate`    | `React.memo` + `useMemo`                  | Outside hooks system / Ngoài hooks system |
| `getDerivedStateFromProps` | Compute in render body                    | No effect needed / Không cần effect       |

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

🇬🇧 **useLayoutEffect vs useEffect**: `useLayoutEffect` runs **synchronously after DOM update, before paint**. Use for DOM measurement (tooltip position, scroll restore). Wrong usage → blocks rendering, app lags.
**useInsertionEffect**: Only for CSS-in-JS libraries (styled-components, emotion). You almost never use it directly.
**useId**: Creates stable unique ID between server and client (SSR hydration). Don't use for list keys.

🇻🇳 **useLayoutEffect vs useEffect**: `useLayoutEffect` chạy **đồng bộ sau DOM update, trước khi browser vẽ**. Dùng khi cần đo DOM (vị trí tooltip, khôi phục scroll). Dùng sai → block rendering, app lag.
**useInsertionEffect**: Chỉ dành cho CSS-in-JS libraries (styled-components, emotion). Bạn gần như không bao giờ dùng trực tiếp.
**useId**: Tạo unique ID ổn định giữa server và client (SSR hydration). Không dùng cho key trong list.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                                              | Why wrong / Tại sao sai                                                                   | Correct / Đúng là                                                                  |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Use `useLayoutEffect` for data fetching / Dùng `useLayoutEffect` để fetch data | Blocks rendering, user sees blank longer / Block rendering, user thấy blank lâu hơn       | `useEffect` for async work, `useLayoutEffect` only for DOM measurement             |
| Call hooks inside if/else / Gọi hooks trong if/else                            | React uses linked list, order must be fixed / React dùng linked list, thứ tự phải cố định | Always call hooks at top level, use conditions inside / Luôn gọi hooks ở top level |
| Use `useId()` as list key / Dùng `useId()` làm key cho list                    | `useId` creates 1 ID per component instance / Tạo 1 ID duy nhất per component             | Key should come from data (id, slug) / Key nên từ data                             |
| Derived state in `useEffect` / Derived state trong `useEffect`                 | Extra render cycle, easy bugs / Thừa 1 render, dễ bug                                     | Compute directly in render body or `useMemo` / Tính trực tiếp trong render body    |

**🎯 Interview Pattern / Mẫu Phỏng Vấn:**

- 🇬🇧 When asked about: "hook categories", "when to use which hook", "hooks lifecycle"
  → Opening: _"React hooks fall into 5 categories by purpose: State, Effect, Ref, Performance, and Concurrency. The key is understanding what problem each group solves — using the wrong group causes bugs or performance issues."_
- 🇻🇳 Khi gặp câu hỏi: "phân loại hooks", "khi nào dùng hook nào", "hooks lifecycle"
  → Mở đầu: _"React hooks chia thành 5 nhóm theo mục đích: State, Effect, Ref, Performance, và Concurrency. Quan trọng nhất là hiểu mỗi nhóm giải quyết bài toán gì — dùng sai nhóm sẽ gây bug hoặc performance issue."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Prerequisite / Cần biết trước: [Hooks Deep Dive](./03-hooks-deep-dive.md) — useState, useEffect, useRef basics
- ➡️ Enables / Để hiểu tiếp: [Performance Optimization](./09-performance-optimization.md) — apply hooks correctly to optimize

---

### 2. useTransition / Marking Updates as "Not Urgent" / Đánh Dấu "Không Gấp"

> 🧠 **Memory Hook**: "useTransition = a **'SLOW LANE'** sign — tells React: 'This update isn't urgent, do it later, don't block user input.'"
> 🧠 "useTransition = biển báo **'ĐƯỜNG CHẬM'** — nói React: 'Cập nhật này không gấp, làm sau được, đừng block input user.'"

**Why does this exist? / Tại sao tồn tại?**

🇬🇧 Before React 18, all state updates had the **same priority**. Typing into an input (needs instant response) and filtering 10,000 items (heavy) both queued equally → input lag.
→ **Why?** Because user perception: if input lags > 100ms, users feel the app is "frozen". But a list updating 300ms late is acceptable.
→ **Why?** Because the human brain distinguishes **direct feedback** (finger types → letter appears) from **indirect results** (filtered list). Concurrent rendering exploits this difference.

🇻🇳 Trước React 18, mọi state update đều có **cùng priority** (độ ưu tiên). Gõ vào input (cần phản hồi ngay) và filter 10,000 items (nặng) đều xếp hàng chờ nhau → input lag.
→ **Tại sao?** Vì user perception: nếu input lag > 100ms, user cảm thấy app "đơ". Nhưng danh sách update chậm 300ms thì user chấp nhận được.
→ **Tại sao?** Vì não người phân biệt **phản hồi trực tiếp** (tay gõ → chữ hiện) và **kết quả gián tiếp** (filter list). Concurrent rendering khai thác sự khác biệt này.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

🇬🇧 You're at a **bank counter**. Two types of customers:

- **VIP customer** (urgent): Just needs 1 signature → done in 5 seconds
- **Regular customer** (non-urgent): Complex paperwork → takes 5 minutes

Without priority: VIP waits 5 minutes behind regular → terrible experience.
`useTransition` = **"Regular customer, please pause — let VIP sign first, then we'll continue."**

User typing = VIP customer (urgent). Filtering list = regular customer (transition).

🇻🇳 Bạn đang ở **quầy ngân hàng**. Có 2 loại khách:

- **Khách VIP** (gấp): Chỉ cần ký 1 chữ ký → xong trong 5 giây
- **Khách thường** (không gấp): Hồ sơ phức tạp → mất 5 phút

Không có ưu tiên: khách VIP phải chờ 5 phút sau khách thường → tệ.
`useTransition` = **"Khách thường ơi, dừng 1 chút — để VIP ký trước rồi tiếp tục nhé."**

User gõ input = khách VIP (urgent). Filter danh sách = khách thường (transition).

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
function SearchPage() {
  const [query, setQuery] = useState(""); // Urgent: input value
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState([]); // Non-urgent: filtered list

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value); // ⚡ Urgent — update input immediately / cập nhật input ngay

    startTransition(() => {
      // 🐢 Non-urgent — React can interrupt and do later / React có thể ngắt và làm sau
      const filtered = allProducts.filter((p) =>
        p.name.toLowerCase().includes(value.toLowerCase()),
      );
      setResults(filtered);
    });
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />} {/* Loading indicator */}
      <ProductList items={results} /> {/* Can render later / Có thể render chậm hơn */}
    </div>
  );
}
```

```
Timeline when user types "iph" / Khi user gõ "iph":

WITHOUT useTransition / Không có useTransition:
─────────────────────────────────────────────
  type "i" → [filter 10K items ████████] → type "p" → [filter ████████] → type "h"
             input blocked here!              lag again!
             input bị block ở đây!            lag tiếp!

WITH useTransition / Có useTransition:
─────────────────────────────────────────────
  type "i" → input updates instantly ✓ / input cập nhật ngay ✓
              [filter starts ░░░░]
  type "p" → input updates instantly ✓  ← interrupt old filter / ngắt filter cũ
              [new filter ░░░░░░░░]
  type "h" → input updates instantly ✓  ← interrupt again / ngắt lần nữa
              [final filter ████████] → render results
```

🇬🇧 **How it works internally:**

1. `startTransition(fn)` marks state updates inside `fn` as **low priority**
2. React starts rendering with new value, but **can interrupt** mid-way
3. If an urgent update arrives (user types more), React **drops the old render**, handles urgent first
4. `isPending = true` while transition is processing → show loading indicator

🇻🇳 **Cơ chế bên trong:**

1. `startTransition(fn)` đánh dấu state updates bên trong `fn` là **low priority** (ưu tiên thấp)
2. React bắt đầu render với giá trị mới, nhưng **có thể ngắt** giữa chừng
3. Nếu có urgent update (user gõ tiếp), React **bỏ render cũ**, xử lý urgent trước
4. `isPending = true` trong khi transition đang xử lý → hiện loading indicator

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

🇬🇧 **Not debounce**: Debounce has a fixed delay (300ms). `useTransition` lets React decide — fast machine = near-zero delay, slow machine = longer delay.
**Only for state updates**: You can't wrap `fetch()` in `startTransition`. It only marks `setState` inside as low priority.
**Stale results**: While pending, user sees **old results**. Design UI to show "loading" (use `isPending`).
**React 19 Actions**: `useActionState` automatically wraps in transition — no manual `startTransition` for form submissions.

🇻🇳 **Không phải debounce**: Debounce delay cố định (300ms). `useTransition` thì React tự quyết — máy nhanh thì delay gần 0, máy chậm thì delay tự tăng.
**Chỉ cho state updates**: Bạn không thể wrap `fetch()` trong `startTransition`. Nó chỉ đánh dấu `setState` bên trong là low priority.
**Kết quả cũ**: Trong lúc pending, user nhìn thấy **kết quả cũ**. Cần design UI để user biết "đang loading" (dùng `isPending`).
**React 19 Actions**: `useActionState` tự động wrap trong transition — không cần gọi `startTransition` thủ công cho form.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                                                | Why wrong / Tại sao sai                                                     | Correct / Đúng là                                                    |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Wrap ALL setState in startTransition / Wrap tất cả setState                      | Urgent updates (input, hover) get delayed / Urgent bị delay                 | Only wrap non-urgent (list filter, tab switch) / Chỉ wrap non-urgent |
| Use useTransition instead of debounce for API calls / Dùng thay debounce cho API | useTransition for render work, not network / Cho render, không phải network | Debounce for API calls, useTransition for CPU-heavy renders          |
| Ignore isPending / Không dùng isPending                                          | User doesn't know it's loading / User không biết đang loading               | Always show loading state when isPending = true                      |
| Expect synchronous result / Mong kết quả đồng bộ                                 | Transition is async / Transition là async                                   | Design UI for pending state / Design UI cho trạng thái pending       |

**🎯 Interview Pattern / Mẫu Phỏng Vấn:**

- 🇬🇧 Opening: _"useTransition lets you mark a state update as non-urgent, so React prioritizes urgent updates first — like a bank with 2 queues: VIP for quick transactions and regular for complex paperwork. Unlike debounce, React adjusts the wait time based on machine capability."_
- 🇻🇳 Mở đầu: _"useTransition cho phép đánh dấu state update là non-urgent, để React ưu tiên urgent updates trước — giống ngân hàng có 2 hàng: VIP cho giao dịch nhanh và thường cho hồ sơ phức tạp. Khác debounce, React tự điều chỉnh thời gian chờ dựa trên khả năng máy."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Prerequisite / Cần biết trước: [React Fundamentals — Fiber & Render/Commit](./01-react-fundamentals.md) — understand render can be interrupted
- ➡️ Enables / Để hiểu tiếp: [Performance Optimization](./09-performance-optimization.md) — combine useTransition with other techniques

---

### 3. useDeferredValue / The "Can Wait" Value / Giá Trị "Chờ Được"

> 🧠 **Memory Hook**: "useDeferredValue = a **slow copy** — like your shadow following one step behind. Input runs ahead, list follows behind."
> 🧠 "useDeferredValue = **bản copy chậm** — như cái bóng đi sau bạn 1 bước. Input chạy trước, danh sách chạy sau."

**Why does this exist? / Tại sao tồn tại?**

🇬🇧 Sometimes you **don't control setState** (e.g., props from parent, value from a library). You can't wrap in `startTransition` because you don't call `setState`.
→ **Why?** Because the component receives **value from outside** (props) — it doesn't know who set it, just that the value changed and needs to re-render.
→ **Why?** Because React needs a defer mechanism at the **consuming side** (where value is used), not just at the producing side (where value is created).

🇻🇳 Đôi khi bạn **không control được setState** (ví dụ: props từ parent, value từ library). Bạn không thể wrap trong `startTransition` vì bạn không gọi `setState`.
→ **Tại sao?** Vì component nhận **value từ bên ngoài** (props) — nó không biết ai set, chỉ biết value thay đổi và cần re-render.
→ **Tại sao?** Vì React cần cơ chế defer (trì hoãn) ở **phía consumer** (nơi dùng value), không chỉ ở phía producer (nơi tạo value).

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

🇬🇧 You're watching a **live stream** on slow internet. The streamer talks in real-time, but the video you receive is **2-3 seconds behind**. You still see the content, just a slightly older version.

`useDeferredValue(query)` = the **"slow live stream"** version of `query`. Input shows the new value immediately, but the list uses the old value until React has time to render.

🇻🇳 Bạn đang xem **live stream** trên mạng chậm. Streamer nói realtime, nhưng video bạn nhận được **chậm 2-3 giây**. Bạn vẫn xem được nội dung, chỉ là phiên bản hơi cũ.

`useDeferredValue(query)` = phiên bản **"live stream chậm"** của `query`. Input hiển thị giá trị mới ngay, nhưng danh sách dùng giá trị cũ cho đến khi React render xong.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
function SearchResults({ query }: { query: string }) {
  // query changes immediately when parent re-renders
  // query thay đổi ngay khi parent re-render

  // deferredQuery is slower — React renders with old value first
  // deferredQuery chậm hơn — React render với giá trị cũ trước
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery; // Waiting for update? / Đang chờ update?

  // useMemo ensures recompute only when deferredQuery changes
  // useMemo đảm bảo chỉ tính lại khi deferredQuery thay đổi
  const results = useMemo(() => filterProducts(deferredQuery), [deferredQuery]);

  return (
    <div style={{ opacity: isStale ? 0.7 : 1 }}>
      {" "}
      {/* Dim when stale / Mờ khi cũ */}
      {results.map((item) => (
        <ProductCard key={item.id} {...item} />
      ))}
    </div>
  );
}

// Parent component — doesn't need to know about deferred
// Parent — không cần biết về deferred
function SearchPage() {
  const [query, setQuery] = useState("");
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <SearchResults query={query} /> {/* Pass directly / Pass trực tiếp */}
    </>
  );
}
```

```
Comparison: useTransition vs useDeferredValue
So sánh: useTransition vs useDeferredValue

┌──────────────────┬───────────────────────────────────┐
│   useTransition   │     useDeferredValue              │
├──────────────────┼───────────────────────────────────┤
│ Wraps setState    │ Wraps value (props/state)         │
│ Control at        │ Control at CONSUMER               │
│   PRODUCER        │ You receive value from outside    │
│ You call setState │ Bạn nhận value từ bên ngoài       │
│ isPending boolean │ Compare value !== deferredValue   │
└──────────────────┴───────────────────────────────────┘

When to use which? / Khi nào dùng cái nào?
─────────────────────────────────────────────
You control setState?    → useTransition
You receive props?       → useDeferredValue
Bạn control setState?    → useTransition
Bạn nhận props?          → useDeferredValue
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

🇬🇧 **Must combine with useMemo/React.memo**: `useDeferredValue` only defers the value. If the child still receives new value via other props, it still re-renders. Need `useMemo` or `React.memo` to actually skip render.
**Initial render**: First render, `deferredValue === value` (no deferring).
**No fixed delay**: React decides when to update — fast machine = nearly instant, slow machine = longer delay.

🇻🇳 **Phải kết hợp với useMemo/React.memo**: `useDeferredValue` chỉ defer giá trị. Nếu child component vẫn nhận value mới qua props khác, nó vẫn re-render. Cần `useMemo` hoặc `React.memo` để thực sự skip render.
**Lần render đầu**: `deferredValue === value` (không defer).
**Không có delay cố định**: React tự quyết khi nào update — máy nhanh thì gần instant, máy chậm thì delay lâu hơn.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                                    | Why wrong / Tại sao sai                                          | Correct / Đúng là                                               |
| -------------------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------- |
| useDeferredValue without memo / Dùng mà không kết hợp memo           | Component still re-renders with new reference / Vẫn re-render    | Wrap child in `React.memo` or use `useMemo` for computation     |
| Use when you can control setState / Dùng khi có thể control setState | Unnecessary complexity / Thừa complexity                         | useTransition if you control setState                           |
| Expect value to always be delayed / Mong giá trị luôn chậm           | First render returns original value / Render đầu trả giá trị gốc | Only defers from 2nd render onwards / Chỉ defer từ render thứ 2 |

**🎯 Interview Pattern / Mẫu Phỏng Vấn:**

- 🇬🇧 Opening: _"useDeferredValue works on the consumer side — when you receive a value from props that you can't control. It creates a 'slow copy' so React can prioritize urgent updates first, then update the deferred value later."_
- 🇻🇳 Mở đầu: _"useDeferredValue hoạt động ở phía consumer — khi bạn nhận value từ props mà không control được setState. Nó tạo 'bản copy chậm' để React ưu tiên urgent updates trước, rồi update deferred value sau."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Prerequisite / Cần biết trước: [useTransition](#2-usetransition--marking-updates-as-not-urgent--đánh-dấu-không-gấp) — understand urgent vs non-urgent
- ➡️ Enables / Để hiểu tiếp: [Performance Optimization](./09-performance-optimization.md) — combine defer + memo + code splitting

---

### 4. useSyncExternalStore / Syncing Outside Stores / Đồng Bộ Store Bên Ngoài

> 🧠 **Memory Hook**: "useSyncExternalStore = a **power adapter** — converts 'foreign outlet' (external store) into a 'React plug' so React can use it safely."
> 🧠 "useSyncExternalStore = **adapter ổ cắm điện** — chuyển 'ổ cắm nước ngoài' (external store) sang 'ổ cắm React' để React dùng an toàn."

**Why does this exist? / Tại sao tồn tại?**

🇬🇧 Many state management libraries (Redux, Zustand, MobX) store state **outside React**. When state changes, React needs to know to re-render — but concurrent rendering can cause **tearing** (one component reads old value, another reads new value in the same render).
→ **Why?** Because concurrent rendering lets React **interrupt and resume** renders. Between two reads, the external store may have changed → inconsistency.
→ **Why?** Because React only guarantees consistency for **internal state** (useState, useReducer). External state needs its own mechanism.

🇻🇳 Nhiều state management libraries (Redux, Zustand, MobX) lưu state **bên ngoài React**. Khi state thay đổi, React cần biết để re-render — nhưng concurrent rendering có thể gây **tearing** (1 component đọc giá trị cũ, component khác đọc giá trị mới trong cùng 1 render).
→ **Tại sao?** Vì concurrent rendering cho phép React **ngắt và tiếp tục** render. Giữa 2 lần đọc, external store có thể đã thay đổi → không nhất quán.
→ **Tại sao?** Vì React chỉ đảm bảo nhất quán cho **internal state** (useState, useReducer). External state cần cơ chế riêng.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

🇬🇧 You travel abroad and bring your **Vietnamese phone charger**. European outlets are different. You need an **adapter** to:

1. **Plug into European outlet** (subscribe to external store)
2. **Get correct power output** (getSnapshot — read value)
3. **Stay safe** without getting shocked (tearing-free rendering)

`useSyncExternalStore` = that adapter. It ensures React reads a **consistent snapshot** from the external store, even during concurrent rendering.

🇻🇳 Bạn đi du lịch nước ngoài mang theo **sạc điện thoại Việt Nam**. Ổ cắm châu Âu khác kiểu. Bạn cần **adapter** (cục chuyển đổi) để:

1. **Cắm vào ổ châu Âu** (subscribe vào external store)
2. **Lấy điện ra đúng chuẩn** (getSnapshot — đọc giá trị)
3. **An toàn** không bị giật (tearing-free rendering)

`useSyncExternalStore` = adapter đó. Nó đảm bảo React đọc **snapshot nhất quán** từ external store, ngay cả khi concurrent rendering.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
import { useSyncExternalStore } from "react";

// External store — lives outside React / nằm ngoài React
const analyticsStore = {
  _listeners: new Set<() => void>(),
  _data: { pageViews: 0, clicks: 0 },

  // subscribe: React calls this to register for changes
  // subscribe: React gọi để đăng ký lắng nghe thay đổi
  subscribe(listener: () => void) {
    analyticsStore._listeners.add(listener);
    return () => analyticsStore._listeners.delete(listener); // cleanup
  },

  // getSnapshot: React calls to read CURRENT value
  // getSnapshot: React gọi để đọc giá trị HIỆN TẠI
  getSnapshot() {
    return analyticsStore._data; // MUST return stable reference / PHẢI trả reference ổn định
  },

  // Action: change data → notify React
  // Action: thay đổi data → báo React
  trackClick() {
    analyticsStore._data = {
      ...analyticsStore._data,
      clicks: analyticsStore._data.clicks + 1,
    };
    analyticsStore._listeners.forEach((l) => l()); // Trigger re-render
  },
};

// Component using external store / Component dùng external store
function AnalyticsDashboard() {
  const data = useSyncExternalStore(
    analyticsStore.subscribe, // How to subscribe / Cách đăng ký
    analyticsStore.getSnapshot, // How to read (client) / Cách đọc (client)
    analyticsStore.getSnapshot, // How to read (server SSR) / Cách đọc (server)
  );

  return <div>Clicks: {data.clicks}</div>;
}
```

```
Tearing Problem (without useSyncExternalStore):
Vấn đề Tearing (không có useSyncExternalStore):

  External Store: value = "A"
         │
  ┌──────┴──────┐
  │ Component 1 │ reads "A" ✓ / đọc "A" ✓
  │ (rendering) │
  └─────────────┘
         │
  ← Store changes: value = "B" →  ← INTERRUPT!
         │
  ┌──────┴──────┐
  │ Component 2 │ reads "B" ✗ ← WRONG! Same render, different values
  │ (rendering) │              ← SAI! Cùng render mà khác giá trị
  └─────────────┘

  → UI inconsistent: Component 1 shows "A", Component 2 shows "B"

WITH useSyncExternalStore:
  React reads snapshot ONCE and uses for ENTIRE render
  React đọc snapshot 1 lần và dùng cho TOÀN BỘ render
  → All components see same value / Mọi component thấy cùng giá trị
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

🇬🇧 **getSnapshot MUST return stable reference**: If each call creates a new object (fails `===`), React infinite re-renders. Cache or return immutable reference.
**Server rendering**: 3rd parameter (`getServerSnapshot`) required for SSR. Usually returns default value.
**You rarely use it directly**: Libraries (Redux, Zustand) already wrap `useSyncExternalStore`. You need it when building libraries or custom stores.

🇻🇳 **getSnapshot PHẢI trả reference ổn định**: Nếu mỗi lần gọi tạo object mới (không pass `===`), React sẽ re-render vô hạn. Cần cache hoặc trả immutable reference.
**Server rendering**: Tham số thứ 3 (`getServerSnapshot`) bắt buộc cho SSR. Thường trả default value.
**Bạn ít khi dùng trực tiếp**: Libraries (Redux, Zustand) đã wrap `useSyncExternalStore` rồi. Bạn cần khi build library hoặc custom store.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                                       | Why wrong / Tại sao sai                                           | Correct / Đúng là                                     |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------- |
| `getSnapshot` returns new object each call / Trả object mới mỗi lần gọi | Infinite re-render, reference always different / Re-render vô hạn | Cache result, return same reference if data unchanged |
| Forget `getServerSnapshot` / Quên tham số server                        | SSR crash or hydration mismatch                                   | Always provide server snapshot                        |
| Use for React internal state / Dùng cho React internal state            | Overkill, useState is enough / Thừa, useState đủ rồi              | Only for external stores (window, third-party lib)    |

**🎯 Interview Pattern / Mẫu Phỏng Vấn:**

- 🇬🇧 Opening: _"useSyncExternalStore solves the tearing problem in concurrent rendering — when an external store changes while React is mid-render, components can read inconsistent values. This hook ensures React reads one snapshot for the entire render tree."_
- 🇻🇳 Mở đầu: _"useSyncExternalStore giải quyết vấn đề tearing trong concurrent rendering — khi external store thay đổi giữa lúc React đang render, các component có thể đọc giá trị không nhất quán. Hook này đảm bảo React đọc 1 snapshot duy nhất cho toàn bộ render tree."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Prerequisite / Cần biết trước: [React Fundamentals — Fiber](./01-react-fundamentals.md) — concurrent rendering can interrupt
- ➡️ Enables / Để hiểu tiếp: [State Management](./05-state-management.md) — why Redux/Zustand need this hook

---

### 5. Custom Hook Architecture / Kiến Trúc Custom Hook

> 🧠 **Memory Hook**: "Custom hook = a **cooking recipe** — you package many steps (state + effect + logic) into one name, anyone can cook it without knowing the details."
> 🧠 "Custom hook = **công thức nấu ăn** — bạn gói nhiều bước (state + effect + logic) thành 1 tên gọi, ai cũng có thể nấu lại mà không cần biết chi tiết."

**Why does this exist? / Tại sao tồn tại?**

🇬🇧 Components often have repeated logic: fetch data → loading/error state → cleanup. Copy-pasting this violates DRY and creates bugs when you fix one place but forget another.
→ **Why?** Before hooks, reusing logic required HOC or render props — both create "wrapper hell" and are hard to debug.
→ **Why?** Because hooks allow **extracting logic without changing the component tree** — a custom hook is a pure function, no JSX.

🇻🇳 Components thường có logic lặp lại: fetch data → loading/error state → cleanup. Copy-paste logic này vi phạm DRY (Don't Repeat Yourself) và tạo bugs khi fix 1 chỗ mà quên chỗ khác.
→ **Tại sao?** Trước hooks, reuse logic cần HOC hoặc render props — cả 2 tạo "wrapper hell" (lồng quá nhiều tầng) và khó debug.
→ **Tại sao?** Vì hooks cho phép **extract logic mà không thay đổi component tree** — custom hook là function thuần, không render JSX.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

🇬🇧 You cook often. Each dish needs the step "make sauce": mix oil, vinegar, salt, pepper, stir well. Instead of writing this for every dish, you create a **"Basic Sauce Recipe"** — write once, use in any dish.

Custom hook = "Basic Sauce Recipe":

- **Input**: ingredients (parameters)
- **Process**: mixing steps (hooks inside)
- **Output**: finished sauce (return values)

🇻🇳 Bạn hay nấu ăn. Mỗi món cần bước "pha nước sốt": trộn dầu, giấm, muối, tiêu, khuấy đều. Thay vì viết lại cho mỗi món, bạn tạo **"Công thức Sốt cơ bản"** — ghi 1 lần, dùng ở bất kỳ món nào.

Custom hook = công thức "Sốt cơ bản":

- **Input**: nguyên liệu (parameters)
- **Process**: các bước pha (hooks bên trong)
- **Output**: nước sốt hoàn chỉnh (return values)

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
// ============================
// Custom Hook: useFetch
// ============================
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController(); // Cleanup mechanism / Cơ chế cleanup

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    return () => controller.abort(); // Cleanup on url change or unmount
  }, [url]);

  return { data, error, isLoading } as const;
}

// ============================
// Usage — extremely clean / Sử dụng — cực kỳ clean
// ============================
function ProductPage({ id }: { id: string }) {
  const { data: product, error, isLoading } = useFetch<Product>(`/api/products/${id}`);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <ProductDetail product={product!} />;
}
```

```
Custom Hook Composition Layers / Các tầng kết hợp:

Layer 1: Primitive Hooks (React built-in)
┌──────────────────────────────────────────┐
│  useState  useEffect  useRef  useMemo    │
└────────────────────┬─────────────────────┘
                     │ compose
Layer 2: Utility Hooks (reuse simple logic / tái sử dụng logic đơn)
┌──────────────────────────────────────────┐
│  useDebounce  useLocalStorage  useToggle │
└────────────────────┬─────────────────────┘
                     │ compose
Layer 3: Feature Hooks (business logic / logic nghiệp vụ)
┌──────────────────────────────────────────┐
│  useFetch  useForm  useAuth  useCart     │
└────────────────────┬─────────────────────┘
                     │ compose
Layer 4: Page Hooks (orchestrate features / điều phối features)
┌──────────────────────────────────────────┐
│  useCheckoutFlow  useDashboardData       │
└──────────────────────────────────────────┘
```

**Design Principles / Nguyên tắc thiết kế:**

| Principle / Nguyên tắc     | Explanation / Giải thích              | Example / Ví dụ                                     |
| -------------------------- | ------------------------------------- | --------------------------------------------------- |
| **Single Responsibility**  | 1 hook = 1 concern                    | `useFetch` only fetches, doesn't format             |
| **Return tuple or object** | Tuple for few values, object for many | `[value, setValue]` vs `{ data, error, isLoading }` |
| **Prefix `use`**           | React lint rule requires it           | `useWindowSize`, not `getWindowSize`                |
| **Accept primitives**      | Avoid objects in deps array           | `useFetch(url)` not `useFetch({ url, method })`     |
| **Cleanup**                | Abort, unsubscribe in return          | AbortController for fetch, removeEventListener      |

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

🇬🇧 **Each component calling a hook = separate instance**: `useFetch` in ComponentA and ComponentB creates **2 separate states**, 2 fetch calls. To share → lift state or use cache layer (TanStack Query).
**Closure trap**: If custom hook uses a callback referencing old values (stale closure), use `useRef` to keep latest value.
**Testing**: Test custom hooks with `renderHook` from `@testing-library/react-hooks`. No need for dummy components.

🇻🇳 **Mỗi component gọi hook = instance riêng**: `useFetch` trong ComponentA và ComponentB tạo **2 state riêng biệt**, 2 fetch calls. Muốn share → lift state hoặc dùng cache layer (TanStack Query).
**Closure trap**: Nếu custom hook dùng callback reference giá trị cũ (stale closure), cần `useRef` để giữ latest value.
**Testing**: Test custom hook bằng `renderHook` từ `@testing-library/react-hooks`. Không cần tạo dummy component.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                                                   | Why wrong / Tại sao sai                                                           | Correct / Đúng là                                              |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Hook returns too many things / Return quá nhiều thứ                                 | Complex interface, hard to maintain / Interface phức tạp                          | Split into multiple smaller hooks / Tách thành nhiều hooks nhỏ |
| No cleanup in useEffect / Không cleanup                                             | Memory leak, race condition                                                       | Always return cleanup function / Luôn return cleanup           |
| Pass object as dependency / Pass object làm dependency                              | New object each render → effect runs non-stop / Object mới → effect chạy liên tục | Destructure, pass primitive values                             |
| Think hooks share state between components / Nghĩ hooks share state giữa components | Each component has own instance / Mỗi component có instance riêng                 | Use Context or external store to share                         |

**🎯 Interview Pattern / Mẫu Phỏng Vấn:**

- 🇬🇧 Opening: _"Custom hooks extract and reuse stateful logic without changing the component tree. I design them in 4 layers: primitive → utility → feature → page hooks. The most important principles are single responsibility and proper cleanup."_
- 🇻🇳 Mở đầu: _"Custom hook là cách extract và reuse stateful logic mà không thay đổi component tree. Tôi thiết kế theo 4 layers: primitive → utility → feature → page hooks. Nguyên tắc quan trọng nhất là single responsibility và proper cleanup."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Prerequisite / Cần biết trước: [Hooks Deep Dive](./03-hooks-deep-dive.md) — understand primitive hooks
- ➡️ Enables / Để hiểu tiếp: [Advanced Patterns](./04-advanced-patterns.md) — combine custom hooks with compound components

---

## Q&A Section / Câu Hỏi Phỏng Vấn

### Q1: What are the main categories of React hooks? / Phân loại các nhóm hooks trong React? 🟢 Junior

**A:**

🇬🇧 React hooks fall into 5 categories: **State** (useState, useReducer, useContext), **Effect** (useEffect, useLayoutEffect), **Ref** (useRef, useImperativeHandle), **Performance** (useMemo, useCallback), and **Concurrency** (useTransition, useDeferredValue, useSyncExternalStore). Each group solves a different problem. Understanding the categories helps you pick the right hook for the right situation.

🇻🇳 React hooks chia thành 5 nhóm: **State** (useState, useReducer, useContext), **Effect** (useEffect, useLayoutEffect), **Ref** (useRef, useImperativeHandle), **Performance** (useMemo, useCallback), và **Concurrency** (useTransition, useDeferredValue, useSyncExternalStore). Mỗi nhóm giải quyết 1 bài toán khác nhau. Hiểu phân loại giúp bạn chọn đúng hook cho đúng vấn đề.

**💡 Interview Signal:**

- ✅ Strong: Categorizes by **purpose** and explains when to use each group
- ❌ Weak: Lists hook names without explaining why they're grouped together

---

### Q2: When should you use useLayoutEffect instead of useEffect? / Khi nào dùng useLayoutEffect thay vì useEffect? 🟢 Junior

**A:**

🇬🇧 `useLayoutEffect` runs **synchronously after DOM update but before browser paint**. Use it when you need to **measure DOM** (element dimensions, scroll position) or **prevent visual flicker** (positioning a tooltip before user sees it). 99% of the time, use `useEffect`. Only use `useLayoutEffect` when you need to **read layout** (getBoundingClientRect) or **change DOM before user sees it**.

🇻🇳 `useLayoutEffect` chạy **đồng bộ sau DOM update nhưng trước khi browser vẽ lên màn hình**. Dùng khi cần **đo DOM** (kích thước element, vị trí scroll) hoặc **tránh nhấp nháy** (đặt vị trí tooltip trước khi user thấy). 99% trường hợp dùng `useEffect`. Chỉ dùng `useLayoutEffect` khi cần **đọc layout DOM** (getBoundingClientRect) hoặc **thay đổi DOM trước khi user thấy**.

```tsx
// ✅ useLayoutEffect — measure tooltip position before showing
// ✅ useLayoutEffect — đo vị trí tooltip trước khi hiện
useLayoutEffect(() => {
  const rect = tooltipRef.current.getBoundingClientRect();
  setPosition({ top: rect.bottom, left: rect.left });
}, [isOpen]);

// ✅ useEffect — fetch data (no DOM reading needed)
// ✅ useEffect — fetch data (không cần đọc DOM)
useEffect(() => {
  fetchData(id);
}, [id]);
```

**💡 Interview Signal:**

- ✅ Strong: Explains "sync before paint" vs "async after paint", gives specific examples (tooltip, scroll restore)
- ❌ Weak: "useLayoutEffect runs before useEffect" without explaining **why** that matters

---

### Q3: Explain useTransition vs useDeferredValue — when to use which? / Giải thích useTransition vs useDeferredValue — khi nào dùng cái nào? 🟡 Mid

**A:**

🇬🇧 Both enable **priority-based rendering** but differ in **who controls the update**:

- `useTransition`: You control the setState call → wrap it in `startTransition()`. Used at the **producer** side.
- `useDeferredValue`: You receive a value (props) you can't control → create a deferred copy. Used at the **consumer** side.

Simple rule: **You call setState?** → useTransition. **You receive props?** → useDeferredValue. Both differ from debounce: debounce has fixed delay regardless of device speed. useTransition/useDeferredValue let React **adapt** — fast machine = near-zero delay, slow machine = longer delay.

🇻🇳 Cả hai đều cho phép **render theo ưu tiên** nhưng khác ở **ai control update**:

- `useTransition`: Bạn control setState → wrap trong `startTransition()`. Dùng ở phía **producer** (người tạo).
- `useDeferredValue`: Bạn nhận value (props) không control được → tạo bản copy chậm. Dùng ở phía **consumer** (người dùng).

Cách nhớ: **Bạn gọi setState?** → useTransition. **Bạn nhận props?** → useDeferredValue. Cả 2 khác debounce: debounce delay cố định bất kể máy nhanh chậm. useTransition/useDeferredValue để React **tự điều chỉnh** — máy nhanh delay gần 0, máy chậm delay tăng.

```tsx
// useTransition — you control setState / bạn control setState
const [isPending, startTransition] = useTransition();
function handleSearch(query: string) {
  setInput(query); // urgent
  startTransition(() => {
    setFilteredList(filter(query)); // non-urgent
  });
}

// useDeferredValue — you receive value from parent / bạn nhận value từ parent
function Results({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(() => filter(deferredQuery), [deferredQuery]);
}
```

**💡 Interview Signal:**

- ✅ Strong: Distinguishes producer vs consumer, gives specific scenarios, compares with debounce
- ❌ Weak: "Both are similar, both defer updates" without distinguishing use cases

---

### Q4: What is tearing and how does useSyncExternalStore prevent it? / Tearing là gì và useSyncExternalStore ngăn chặn thế nào? 🟡 Mid

**A:**

🇬🇧 **Tearing** is when different parts of the UI show **inconsistent data** from the same source during one render. It happens with concurrent rendering: React starts rendering Component A (reads value "X"), gets interrupted, external store changes to "Y", React continues rendering Component B (reads "Y") → A shows "X", B shows "Y". `useSyncExternalStore` prevents this by reading a **single consistent snapshot** for the entire render tree.

🇻🇳 **Tearing** (xé rách) là khi các phần khác nhau của UI hiện **data không nhất quán** từ cùng 1 nguồn trong 1 lần render. Xảy ra với concurrent rendering: React bắt đầu render Component A (đọc "X"), bị ngắt, external store đổi thành "Y", React tiếp tục render Component B (đọc "Y") → A hiện "X", B hiện "Y". `useSyncExternalStore` ngăn chặn bằng cách đọc **1 snapshot nhất quán** cho toàn bộ render tree.

🇬🇧 In practice you rarely encounter tearing directly because libraries already handle it. But if building a custom store or reading from `window`/`localStorage`, you need this hook.

🇻🇳 Thực tế bạn ít gặp tearing trực tiếp vì các libraries đã xử lý rồi. Nhưng nếu build custom store hoặc đọc từ `window`/`localStorage`, cần dùng hook này.

**💡 Interview Signal:**

- ✅ Strong: Explains mechanism (interrupt → stale read), gives concrete example, knows libraries wrap this
- ❌ Weak: "Tearing is a bug" without explaining **why** concurrent rendering causes it

---

### Q5: How do you decide between useReducer and useState? / Khi nào chọn useReducer thay vì useState? 🟡 Mid

**A:**

🇬🇧 Choose `useReducer` when: (1) **State logic is complex** — multiple related values that change together, (2) **Next state depends on previous state** in non-trivial ways, (3) **You want testable logic** — reducer is a pure function, easy to unit test, (4) **State transitions need documentation** — action types serve as documentation. Use `useState` for simple state (boolean, string, number).

🇻🇳 Dùng `useReducer` khi: (1) **Logic state phức tạp** — nhiều giá trị liên quan thay đổi cùng lúc, (2) **State tiếp theo phụ thuộc state trước** theo cách phức tạp, (3) **Muốn logic testable** — reducer là pure function, dễ unit test, (4) **State transitions cần documentation** — action types đóng vai trò documentation. Dùng `useState` cho state đơn giản (boolean, string, number).

```tsx
// useState — simple / đơn giản
const [isOpen, setIsOpen] = useState(false);

// useReducer — complex state, many actions / state phức tạp, nhiều action
type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QTY"; payload: { id: string; qty: number } }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM":
      return { ...state, items: [...state.items, action.payload] };
    // ... predictable, testable transitions
  }
}

const [cart, dispatch] = useReducer(cartReducer, initialCart);
```

**💡 Interview Signal:**

- ✅ Strong: Clear criteria (complex logic, related state, testability), examples for both sides
- ❌ Weak: "useReducer for complex state" without explaining **what makes it complex**

---

### Q6: Design a custom hook `useDebounce` — walk through architecture decisions. / Thiết kế custom hook `useDebounce` — trình bày quyết định thiết kế. 🔴 Senior

**A:**

```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // Cleanup: cancel timer if value changes
  }, [value, delay]);

  return debouncedValue;
}

// Usage / Sử dụng
function Search() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) fetchResults(debouncedQuery);
  }, [debouncedQuery]);
}
```

🇬🇧 **Architecture decisions:**

1. **Debounce value, not callback**: Hook takes `value` instead of `callback` because value-based debounce composes better with useEffect downstream.
2. **Cleanup pattern**: Each time `value` changes, cleanup cancels old timer → only the last timer executes.
3. **Generic type `<T>`**: Works with any type (string, number, object).
4. **Configurable delay**: Lets caller decide debounce time.

**Trade-offs:** Value-based adds 1 extra render cycle vs callback-based. For debouncing **function calls**, use `useMemo(() => debounce(fn, delay), [fn, delay])` instead. Doesn't handle leading edge — would need `options.leading` parameter.

🇻🇳 **Quyết định thiết kế:**

1. **Debounce value, không phải callback**: Hook nhận `value` vì value-based debounce dễ compose hơn với useEffect phía dưới.
2. **Cleanup pattern**: Mỗi lần `value` đổi, cleanup cancel timer cũ → chỉ timer cuối được thực thi.
3. **Generic type `<T>`**: Hoạt động với bất kỳ type nào.
4. **Delay tùy chỉnh**: Cho caller quyết định thời gian debounce.

**Trade-offs:** Value-based thêm 1 render cycle so với callback-based. Nếu cần debounce **function call**, dùng `useMemo(() => debounce(fn, delay), [fn, delay])`. Không xử lý leading edge — cần thêm `options.leading`.

**💡 Interview Signal:**

- ✅ Strong: Explains cleanup mechanism, trade-off value vs callback, generic typing, extensibility
- ❌ Weak: Shows code without explaining why it's designed that way

**🔗 Follow-up Chain:**

1. "If you need to debounce a callback instead of a value?" → `useCallback` + `useMemo(() => debounce(fn), [fn])`
2. "Compare useDebounce vs useDeferredValue?" → Debounce = fixed delay, deferred = React-controlled adaptive delay
3. "How to test this hook?" → `renderHook` + `act` + `jest.useFakeTimers` to control time

---

### Q7: Explain the Rules of Hooks internals — why can't hooks be conditional? / Cơ chế internal của Rules of Hooks — tại sao hooks không được đặt trong điều kiện? 🔴 Senior

**A:**

🇬🇧 React stores hooks as a **linked list** on each Fiber node. During each render, React traverses this list **sequentially by call order**. If hook calls are conditional, the list shifts and React reads the wrong hook's state.

🇻🇳 React lưu hooks dưới dạng **linked list** (danh sách liên kết) gắn vào Fiber node. Mỗi render, React đi qua list **theo thứ tự gọi** — hook thứ 1 = node thứ 1, hook thứ 2 = node thứ 2. Nếu gọi hooks có điều kiện, list bị lệch và React đọc sai state.

```
Render 1 (showExtra = true):
  [0] useState("") ←── name
  [1] useState(0)  ←── age
  [2] useState("") ←── extra  ← CALLED because showExtra = true

Render 2 (showExtra = false):
  [0] useState("") ←── name ✓
  [1] useState(0)  ←── age ✓
  ← [2] SKIPPED!

  React thinks hook[1] = age, but data at [1] may have shifted
  React nghĩ hook[1] = age, nhưng data ở [1] có thể bị lệch
  → WRONG STATE, APP CRASH / STATE SAI, APP CRASH
```

🇬🇧 **Why linked list and not keys?** Performance: O(1) per hook, no hash lookup. Simplicity: No need for developers to name each hook. Trade-off: Loses flexibility (no conditional) in exchange for performance + simplicity.

**How React enforces:** ESLint plugin `eslint-plugin-react-hooks` does static analysis. Rule: hooks must be at **top level**, not in if/loop/nested function. Exception: `use()` API in React 19 — **not** stored in linked list → CAN be used conditionally.

🇻🇳 **Tại sao linked list mà không dùng key?** Performance: O(1) per hook, không cần hash lookup. Đơn giản: Developer không cần đặt tên cho mỗi hook. Trade-off: Mất flexibility (không conditional) để đổi lấy performance + simplicity.

**Cách React enforce:** ESLint plugin kiểm tra static. Rule: hooks phải ở **top level**, không trong if/loop/nested function. Exception: `use()` API trong React 19 — **không** lưu trong linked list → CÓ THỂ dùng conditional.

**💡 Interview Signal:**

- ✅ Strong: Explains linked list mechanism, states trade-off (simplicity vs flexibility), knows `use()` exception
- ❌ Weak: "Because React docs say so" without explaining internal mechanism

**🔗 Follow-up Chain:**

1. "Why did React choose linked list over Map?" → Performance (no hashing overhead) + no key management burden
2. "How does use() differ from regular hooks?" → Not stored in linked list, React tracks by Promise identity
3. "If you designed hooks from scratch, which approach?" → Open-ended: named slots (Svelte-like) vs current, trade-offs

---

### Q8: Design a `usePagination` hook for infinite scroll with virtualization. / Thiết kế hook `usePagination` cho infinite scroll kết hợp virtualization. 🔴 Senior

**A:**

```tsx
interface UsePaginationOptions {
  fetchPage: (page: number) => Promise<{ data: Item[]; hasMore: boolean }>;
  pageSize: number;
  threshold?: number; // pixels from bottom to trigger next load
}

function usePagination({ fetchPage, pageSize, threshold = 200 }: UsePaginationOptions) {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Fetch page data / Fetch data theo page
  const loadPage = useCallback(
    async (pageNum: number) => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);
      try {
        const result = await fetchPage(pageNum);
        setItems((prev) => [...prev, ...result.data]); // Append, don't replace
        setHasMore(result.hasMore);
        setPage(pageNum + 1);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Fetch failed"));
      } finally {
        setIsLoading(false);
      }
    },
    [fetchPage, isLoading, hasMore],
  );

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadPage(page);
        }
      },
      { rootMargin: `${threshold}px` },
    );

    observer.observe(sentinel);
    return () => observer.disconnect(); // Cleanup
  }, [page, hasMore, isLoading, loadPage, threshold]);

  // Initial load / Load lần đầu
  useEffect(() => {
    loadPage(1);
  }, []); // eslint-disable-line

  return { items, isLoading, error, hasMore, sentinelRef };
}
```

🇬🇧 **Architecture decisions:**

1. **IntersectionObserver over scroll event**: Performance — no scroll handler firing 60fps, browser-native lazy detection
2. **Sentinel element pattern**: A `<div ref={sentinelRef} />` at the bottom. When visible → load more. Decouples scroll logic from list component.
3. **Accumulate items**: `setItems(prev => [...prev, ...newData])` — append, don't replace
4. **Guard conditions**: `isLoading || !hasMore` prevents duplicate fetches

**Combining with virtualization**: Hook returns `items` array. Render with `react-window` or `@tanstack/react-virtual` — only renders items in viewport, sentinel at the end.

🇻🇳 **Quyết định thiết kế:**

1. **IntersectionObserver thay scroll event**: Performance — không handler chạy 60fps, browser-native
2. **Sentinel element pattern**: Một `<div ref={sentinelRef} />` ở cuối list. Khi visible → load thêm. Tách scroll logic khỏi list component.
3. **Tích lũy items**: `setItems(prev => [...prev, ...newData])` — thêm vào, không thay thế
4. **Guard conditions**: `isLoading || !hasMore` ngăn fetch trùng

**Kết hợp virtualization**: Hook return `items` array. Render bằng `react-window` hoặc `@tanstack/react-virtual` — chỉ render items trong viewport.

**💡 Interview Signal:**

- ✅ Strong: IntersectionObserver over scroll event, sentinel pattern, guard conditions, virtualization integration
- ❌ Weak: Only uses `onScroll` + `scrollHeight` without mentioning performance implications

**🔗 Follow-up Chain:**

1. "Handle race condition when user scrolls fast?" → Abort previous fetch, use page number as key
2. "Cache pages when user scrolls back up?" → Keep items array, only virtualize rendering
3. "Reset when filter changes?" → Reset items/page state, cancel pending fetches

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| #   | Question                          | Level | Key Point                                               |
| --- | --------------------------------- | ----- | ------------------------------------------------------- |
| Q1  | Hook categories                   | 🟢    | 5 groups: State, Effect, Ref, Performance, Concurrency  |
| Q2  | useLayoutEffect vs useEffect      | 🟢    | Sync before paint (DOM measure) vs async after paint    |
| Q3  | useTransition vs useDeferredValue | 🟡    | Producer (control setState) vs Consumer (receive props) |
| Q4  | Tearing & useSyncExternalStore    | 🟡    | Consistent snapshot for concurrent rendering            |
| Q5  | useReducer vs useState            | 🟡    | Complex related state + testable transitions            |
| Q6  | Design useDebounce                | 🔴    | Cleanup mechanism, value vs callback, generic typing    |
| Q7  | Rules of Hooks internals          | 🔴    | Linked list, sequential traversal, use() exception      |
| Q8  | Design usePagination              | 🔴    | IntersectionObserver, sentinel pattern, virtualization  |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn Bất Ngờ

> 🎯 Interviewer asks cold: **"Explain the difference between useTransition and useDeferredValue."**

**🇬🇧 30-second ideal opening:**

1. "Both enable priority-based rendering in React 18, but differ in **where control lives**."
2. "`useTransition` is used at the **producer** — when you control setState, wrap non-urgent updates in startTransition. `useDeferredValue` is used at the **consumer** — when you receive a value from props that you can't control."
3. "Real example: search page — if SearchPage manages its own state, use useTransition. If SearchResults receives query via props, use useDeferredValue."
4. "Both differ from debounce — debounce has a fixed delay, while React adjusts delay based on device capability."

**🇻🇳 30 giây mở đầu lý tưởng:**

1. "Cả hai đều cho phép render theo ưu tiên trong React 18, nhưng khác ở **vị trí control**."
2. "`useTransition` dùng ở phía **producer** — khi bạn control setState, wrap non-urgent update trong startTransition. `useDeferredValue` dùng ở phía **consumer** — khi bạn nhận value từ props mà không control setState."
3. "Ví dụ: search page — nếu SearchPage tự manage state thì dùng useTransition. Nếu SearchResults nhận query qua props thì dùng useDeferredValue."
4. "Cả 2 khác debounce — debounce delay cố định, còn React tự điều chỉnh delay dựa trên khả năng máy."

_Then expand based on interviewer's direction. / Sau đó mở rộng theo hướng interviewer dẫn dắt._

---

## Self-Check / Tự Kiểm Tra ⚡

> **Close the doc before attempting. / Đóng tài liệu lại trước khi làm.**

- [ ] **Retrieval / Nhớ lại**: Write 5 hook categories from memory, at least 2 hooks each. Compare with Concept Map. / Viết 5 nhóm hooks từ trí nhớ, mỗi nhóm ít nhất 2 hooks.
- [ ] **Visual / Hình dung**: Draw the useTransition timeline (typing "iph") on paper. Compare with ASCII diagram. / Vẽ diagram useTransition timeline ra giấy.
- [ ] **Application / Áp dụng**: User types in search box, results list has 5000 items rendering slowly. Do you use useTransition or useDeferredValue? Why? / User gõ vào search, list 5000 items render chậm. Dùng hook nào?
- [ ] **Debug / Gỡ lỗi**: Custom hook `useFetch` calls API twice on mount — cause? Fix? / Custom hook gọi API 2 lần khi mount — nguyên nhân? Fix?
- [ ] **Teach / Giảng lại**: Explain useTransition to a non-programmer using the bank VIP analogy. / Giải thích useTransition cho người không biết code bằng ví dụ ngân hàng VIP.

💬 **Feynman Prompt:** Explain the difference between useTransition and useDeferredValue to a friend who doesn't code, using the bank 2-queue analogy. No technical terms. / Giải thích sự khác biệt cho bạn không biết code, dùng ví dụ ngân hàng 2 hàng đợi. Không thuật ngữ kỹ thuật.

🔁 **Spaced Repetition / Ôn tập cách quãng:** Review this file after **3 days → 7 days → 14 days** to transfer to long-term memory. / Ôn lại file này sau **3 ngày → 7 ngày → 14 ngày**.

---

## Connections / Liên Kết

- ⬅️ **Built on / Dựa trên:** [Hooks Deep Dive](./03-hooks-deep-dive.md) — useState/useEffect/useRef are the foundation for all other hooks
- ➡️ **Enables / Mở ra:** [Performance Optimization](./09-performance-optimization.md) — apply concurrency hooks + custom hooks to optimize
- 🔗 **Applied in / Ứng dụng tại:** React 18+ concurrent features, state management libraries (Zustand, Redux), form libraries (React Hook Form)
