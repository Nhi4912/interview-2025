# React Hooks Comprehensive / Toàn Bộ Hooks React

| Thuộc tính          | Giá trị                                                                  |
| ------------------- | ------------------------------------------------------------------------ |
| **Track**           | Frontend — React                                                         |
| **Difficulty**      | 🟡 Mid → 🔴 Senior                                                       |
| **Prerequisites**   | 03-hooks-deep-dive (useState, useEffect, useRef, useMemo, useCallback)   |
| **See also**        | 01-react-fundamentals, 09-performance-optimization, 02-react-19-features |
| **L5 Competencies** | System Design, Performance Engineering, API Design                       |

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn đang build một trang **search products** cho sàn thương mại điện tử. User gõ "iphone" vào ô tìm kiếm — mỗi ký tự gõ ra đều trigger API call và re-render danh sách 10,000 sản phẩm. Kết quả: **ô input lag**, user gõ "i-p-h" mà input chỉ hiện "i", cảm giác app bị đơ.

Senior dev trong team nói: "Dùng `useTransition` cho search, `useDeferredValue` cho danh sách, rồi wrap external analytics store bằng `useSyncExternalStore`."

Bạn biết `useState` và `useEffect` rồi — nhưng **3 hooks này là gì? Khi nào dùng cái nào? Tại sao không dùng `debounce` như trước?**

File này sẽ đưa bạn từ "biết hooks cơ bản" lên "hiểu toàn bộ hooks ecosystem" — bao gồm cả cách thiết kế custom hooks chuyên nghiệp.

---

**Bạn đang ở đây trong lộ trình học:**

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
    │          │         │useInsert.│         │         │
    │          │         │  Effect  │         │         │
    └─────────┘         └──────────┘         └─────────┘
          │
          ▼
    Concurrency Hooks (React 18+)
    ┌──────────────────────────────────┐
    │ useTransition    — "Tôi đang bận"│
    │ useDeferredValue — "Để sau cũng │
    │                    được"         │
    │ useSyncExternal  — "Đồng bộ bên │
    │   Store            ngoài"        │
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
    (Kết hợp tất cả ở trên)
```

---

## Overview / Tổng Quan

React provides ~15 built-in hooks, each solving a specific problem. Understanding **when** to use each hook matters more than memorizing their APIs.

React cung cấp ~15 hooks, mỗi cái giải quyết 1 vấn đề cụ thể. Trong phỏng vấn, người ta không hỏi "API của useTransition là gì?" mà hỏi **"Khi nào dùng useTransition thay vì debounce?"** — tức là bạn cần hiểu **bài toán** mà mỗi hook giải quyết, không chỉ cú pháp.

File này tập trung vào **3 nhóm bạn chưa biết sâu**: Concurrency Hooks (React 18), Custom Hook Architecture, và Hooks Lifecycle — để bổ sung cho kiến thức useState/useEffect từ file 03.

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. Hooks Taxonomy & Lifecycle / Phân Loại Hooks & Vòng Đời

> 🧠 **Memory Hook**: "Hooks là **hộp công cụ** — mỗi ngăn chứa 1 loại dụng cụ khác nhau. Dùng sai ngăn = vặn ốc bằng búa."

**Tại sao tồn tại? / Why does this exist?**
Class components trộn lẫn logic vào lifecycle methods (componentDidMount chứa cả fetch data + setup listener + animation). Hooks tách logic theo **mục đích**, không theo **thời điểm**.
→ **Why?** Vì logic theo thời điểm khiến code không thể reuse — bạn không thể "copy componentDidMount" sang component khác mà không kéo theo cả đống unrelated code.
→ **Why?** Vì separation of concerns là nguyên tắc cốt lõi: mỗi đơn vị code nên làm **1 việc duy nhất** để dễ test, dễ debug, dễ thay đổi.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Tưởng tượng **hộp công cụ sửa xe**:

- **Ngăn State** (useState, useReducer, useContext): Giữ đồ đang dùng — ốc vít, bu lông đang tháo
- **Ngăn Effect** (useEffect, useLayoutEffect): Hướng dẫn "sau khi lắp xong thì kiểm tra X"
- **Ngăn Ref** (useRef, useImperativeHandle): Giấy nhớ dán lên máy — ghi nhớ nhưng không ảnh hưởng quy trình
- **Ngăn Performance** (useMemo, useCallback): Bộ cache — "cái này làm rồi, không cần làm lại"
- **Ngăn Concurrency** (useTransition, useDeferredValue): Hệ thống ưu tiên — "việc gấp làm trước, việc nặng làm sau"

#### Layer 2: How It Works / Cơ Chế Hoạt Động

React hooks được lưu dưới dạng **linked list** trên mỗi Fiber node. Thứ tự gọi hooks trong mỗi render phải giống nhau — đó là lý do "Rules of Hooks".

```
Fiber Node cho <SearchPage>
├── hooks: LinkedList
│   ├── [0] useState("") ←── query
│   ├── [1] useEffect(fetchData) ←── sync API
│   ├── [2] useTransition() ←── isPending, startTransition
│   ├── [3] useDeferredValue(query) ←── deferred search
│   ├── [4] useMemo(filterResults) ←── cached computation
│   └── [5] useRef(null) ←── DOM reference
│
│  Execution Order (mỗi render):
│  ──────────────────────────────
│  1. Render phase: useState → useTransition → useDeferredValue
│                   → useMemo → useRef (đọc giá trị)
│  2. DOM update: React commit changes to DOM
│  3. Effect phase: useLayoutEffect (sync, block paint)
│                   → useEffect (async, after paint)
```

**Hooks Lifecycle Mapping (so với Class):**

| Class Lifecycle            | Hooks Equivalent                          | Ghi chú              |
| -------------------------- | ----------------------------------------- | -------------------- |
| `constructor`              | `useState(initialValue)`                  | Chỉ chạy lần đầu     |
| `componentDidMount`        | `useEffect(() => {}, [])`                 | Empty deps = mount   |
| `componentDidUpdate`       | `useEffect(() => {}, [dep])`              | Deps change = update |
| `componentWillUnmount`     | `useEffect(() => { return cleanup }, [])` | Cleanup function     |
| `shouldComponentUpdate`    | `React.memo` + `useMemo`                  | Ngoài hooks system   |
| `getDerivedStateFromProps` | Tính trong render body                    | Không cần effect     |

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **useLayoutEffect vs useEffect**: `useLayoutEffect` chạy **đồng bộ sau DOM update, trước paint**. Dùng khi cần đo DOM (tooltip position, scroll restore). Nếu dùng sai → block rendering, app lag.
- **useInsertionEffect**: Chỉ dành cho CSS-in-JS libraries (styled-components, emotion). Bạn gần như không bao giờ dùng trực tiếp.
- **useId**: Tạo unique ID ổn định giữa server và client (SSR hydration). Không dùng cho key trong list.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                               | Tại sao sai                                      | Đúng là                                                               |
| ------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------- |
| Dùng `useLayoutEffect` cho fetch data | Block rendering, user thấy blank screen lâu hơn  | `useEffect` cho async work, `useLayoutEffect` chỉ cho DOM measurement |
| Gọi hooks trong if/else               | React dùng linked list, thứ tự phải cố định      | Luôn gọi hooks ở top level, dùng condition bên trong                  |
| Dùng `useId()` làm key cho list       | `useId` tạo 1 ID duy nhất per component instance | Key nên từ data (id, slug), không từ hook                             |
| Derived state trong `useEffect`       | Thừa 1 render cycle, dễ bug                      | Tính trực tiếp trong render body hoặc `useMemo`                       |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "phân loại hooks", "khi nào dùng hook nào", "hooks lifecycle"
- → Nhớ đến: 5 ngăn hộp công cụ + lifecycle mapping table
- → Mở đầu trả lời: _"React hooks chia thành 5 nhóm theo mục đích: State, Effect, Ref, Performance, và Concurrency. Điều quan trọng nhất là hiểu mỗi nhóm giải quyết bài toán gì — vì dùng sai nhóm sẽ gây bug hoặc performance issue."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Hooks Deep Dive](./03-hooks-deep-dive.md) — useState, useEffect, useRef cơ bản
- ➡️ Để hiểu tiếp: [Performance Optimization](./09-performance-optimization.md) — áp dụng hooks đúng cách để tối ưu

---

### 2. useTransition / Đánh Dấu "Không Gấp"

> 🧠 **Memory Hook**: "useTransition = biển báo **'ĐƯỜNG CHẬM'** — nói React: 'Cập nhật này không gấp, làm sau được, đừng block input user.'"

**Tại sao tồn tại? / Why does this exist?**
Trước React 18, mọi state update đều có **cùng priority**. Gõ vào input (cần phản hồi ngay) và filter 10,000 items (nặng) đều xếp hàng chờ nhau → input lag.
→ **Why?** Vì user perception: nếu input lag > 100ms, user cảm thấy app "đơ". Nhưng danh sách update chậm 300ms thì user chấp nhận được.
→ **Why?** Vì não người phân biệt **phản hồi trực tiếp** (tay gõ → chữ hiện) và **kết quả gián tiếp** (filter list). Concurrent rendering khai thác sự khác biệt này.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Bạn đang ở **quầy giao dịch ngân hàng**. Có 2 loại khách:

- **Khách VIP** (urgent): Chỉ cần ký 1 chữ ký → xong trong 5 giây
- **Khách thường** (non-urgent): Cần xử lý hồ sơ dài → mất 5 phút

Nếu không có hệ thống ưu tiên: khách VIP phải chờ 5 phút sau khách thường → tệ.
`useTransition` = **"Anh/chị thường ơi, dừng lại 1 chút, để khách VIP ký trước rồi tiếp tục nhé."**

Input user gõ = khách VIP (urgent). Filter danh sách = khách thường (transition).

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
function SearchPage() {
  const [query, setQuery] = useState(""); // Urgent: input value
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState([]); // Non-urgent: filtered list

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value); // ⚡ Urgent — update input ngay lập tức

    startTransition(() => {
      // 🐢 Non-urgent — React có thể interrupt và làm sau
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
      <ProductList items={results} /> {/* Có thể render chậm hơn */}
    </div>
  );
}
```

```
Timeline khi user gõ "iph":

Không có useTransition:
─────────────────────────────────────────────
  gõ "i" → [filter 10K items ████████] → gõ "p" → [filter ████████] → gõ "h"
           input bị block ở đây!          lag tiếp!

Có useTransition:
─────────────────────────────────────────────
  gõ "i" → input update ngay ✓
            [filter bắt đầu ░░░░]
  gõ "p" → input update ngay ✓  ← interrupt filter cũ
            [filter mới ░░░░░░░░]
  gõ "h" → input update ngay ✓  ← interrupt lần nữa
            [filter cuối ████████] → render results
```

**Cơ chế bên trong:**

1. `startTransition(fn)` đánh dấu state updates bên trong `fn` là **low priority**
2. React bắt đầu render với giá trị mới, nhưng **có thể interrupt** giữa chừng
3. Nếu có urgent update (user gõ tiếp), React **bỏ render cũ**, xử lý urgent trước
4. `isPending = true` trong khi transition đang xử lý → hiện loading indicator

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Không phải debounce**: Debounce delay cố định (300ms). `useTransition` thì React tự quyết — nếu máy nhanh, delay gần 0. Nếu máy chậm, delay tự tăng.
- **Chỉ cho state updates**: Bạn không thể wrap `fetch()` trong `startTransition`. Nó chỉ đánh dấu `setState` bên trong là low priority.
- **Stale results**: Trong lúc pending, user nhìn thấy **kết quả cũ**. Cần design UI để user biết "đang loading" (dùng `isPending`).
- **React 19 Actions**: `useActionState` tự động wrap trong transition — không cần gọi `startTransition` thủ công cho form submissions.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                       | Tại sao sai                                      | Đúng là                                                              |
| --------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| Wrap tất cả setState trong startTransition    | Urgent updates (input, hover) bị delay           | Chỉ wrap non-urgent updates (list filter, tab switch)                |
| Dùng useTransition thay debounce cho API call | useTransition cho render work, không cho network | Debounce/throttle cho API calls, useTransition cho CPU-heavy renders |
| Không dùng isPending                          | User không biết đang loading                     | Luôn show loading state khi isPending = true                         |
| Expect synchronous result                     | Transition là async, result có thể chậm          | Design UI cho trường hợp pending                                     |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "useTransition", "concurrent rendering", "priority updates", "input lag"
- → Nhớ đến: Ngân hàng VIP vs thường, urgent vs non-urgent
- → Mở đầu trả lời: _"useTransition cho phép đánh dấu một state update là non-urgent, để React ưu tiên xử lý urgent updates trước — giống như ngân hàng có 2 hàng đợi: VIP cho giao dịch nhanh và thường cho hồ sơ phức tạp. Khác với debounce, React tự điều chỉnh thời gian chờ dựa trên khả năng máy."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [React Fundamentals — Fiber & Render/Commit](./01-react-fundamentals.md) — hiểu render có thể bị interrupt
- ➡️ Để hiểu tiếp: [Performance Optimization](./09-performance-optimization.md) — kết hợp useTransition với các kỹ thuật khác

---

### 3. useDeferredValue / Giá Trị "Chờ Được"

> 🧠 **Memory Hook**: "useDeferredValue = **bản copy chậm** — như cái bóng đi sau bạn 1 bước. Input chạy trước, danh sách chạy sau."

**Tại sao tồn tại? / Why does this exist?**
Đôi khi bạn **không control được setState** (ví dụ: props từ parent, hoặc value từ library). Bạn không thể wrap trong `startTransition` vì bạn không gọi `setState`.
→ **Why?** Vì component nhận **value từ bên ngoài** (props) — nó không biết ai đã set, chỉ biết value thay đổi và cần re-render.
→ **Why?** Vì React cần cơ chế defer ở **consuming side** (nơi dùng value), không chỉ ở producing side (nơi tạo value).

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Bạn đang xem **live stream** trên mạng chậm. Streamer nói realtime, nhưng video bạn nhận được **chậm 2-3 giây**. Bạn vẫn xem được nội dung, chỉ là phiên bản hơi cũ.

`useDeferredValue(query)` = phiên bản **"live stream chậm"** của `query`. Input hiển thị giá trị mới ngay, nhưng danh sách dùng giá trị cũ cho đến khi React có thời gian render xong.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
function SearchResults({ query }: { query: string }) {
  // query thay đổi ngay khi parent re-render
  // deferredQuery chậm hơn — React render với giá trị cũ trước
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery; // Đang chờ update?

  // useMemo đảm bảo chỉ re-compute khi deferredQuery thay đổi
  const results = useMemo(() => filterProducts(deferredQuery), [deferredQuery]);

  return (
    <div style={{ opacity: isStale ? 0.7 : 1 }}>
      {" "}
      {/* Dim khi stale */}
      {results.map((item) => (
        <ProductCard key={item.id} {...item} />
      ))}
    </div>
  );
}

// Parent component — không cần biết về deferred
function SearchPage() {
  const [query, setQuery] = useState("");
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <SearchResults query={query} /> {/* Pass trực tiếp */}
    </>
  );
}
```

```
So sánh useTransition vs useDeferredValue:

┌──────────────────┬───────────────────────────────────┐
│   useTransition   │     useDeferredValue              │
├──────────────────┼───────────────────────────────────┤
│ Wrap setState     │ Wrap value (props/state)          │
│ Control ở PRODUCER│ Control ở CONSUMER                │
│ Bạn gọi setState │ Bạn nhận value từ bên ngoài       │
│ isPending boolean │ So sánh value !== deferredValue   │
│                   │                                   │
│ startTransition(  │ const deferred =                  │
│   () => setState  │   useDeferredValue(value)         │
│ )                 │                                   │
└──────────────────┴───────────────────────────────────┘

Khi nào dùng cái nào?
─────────────────────
Bạn control setState? → useTransition
Bạn nhận props?       → useDeferredValue
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Kết hợp với useMemo**: `useDeferredValue` chỉ defer giá trị. Nếu child component vẫn nhận value mới qua props khác, nó vẫn re-render. Cần `useMemo` hoặc `React.memo` để thực sự skip render.
- **Initial render**: Lần render đầu tiên, `deferredValue === value` (không defer).
- **Không có fixed delay**: React tự quyết khi nào update deferred value — máy nhanh thì gần như instant, máy chậm thì delay lâu hơn.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                     | Tại sao sai                                 | Đúng là                                                                     |
| ------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------- |
| Dùng useDeferredValue mà không kết hợp memo | Component vẫn re-render vì reference mới    | Wrap expensive child trong `React.memo` hoặc dùng `useMemo` cho computation |
| Dùng khi có thể control setState            | Thừa complexity, useTransition đơn giản hơn | useTransition nếu bạn control setState                                      |
| Expect giá trị luôn chậm                    | Initial render trả về value gốc             | Chỉ defer từ render thứ 2 trở đi                                            |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "useDeferredValue vs useTransition", "defer rendering", "stale UI"
- → Nhớ đến: Live stream chậm, producer vs consumer control
- → Mở đầu trả lời: _"useDeferredValue hoạt động ở phía consumer — khi bạn nhận value từ props mà không control được setState. Nó tạo một 'bản copy chậm' để React có thể ưu tiên urgent updates trước, rồi update deferred value sau."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [useTransition](#2-usetransition--đánh-dấu-không-gấp) — hiểu urgent vs non-urgent
- ➡️ Để hiểu tiếp: [Performance Optimization](./09-performance-optimization.md) — kết hợp defer + memo + code splitting

---

### 4. useSyncExternalStore / Đồng Bộ Store Bên Ngoài

> 🧠 **Memory Hook**: "useSyncExternalStore = **adapter ổ cắm điện** — chuyển đổi 'nguồn điện nước ngoài' (external store) sang 'ổ cắm React' để React dùng an toàn."

**Tại sao tồn tại? / Why does this exist?**
Nhiều state management libraries (Redux, Zustand, MobX) lưu state **bên ngoài React**. Khi state thay đổi, React cần biết để re-render — nhưng concurrent rendering có thể gây **tearing** (1 component đọc giá trị cũ, component khác đọc giá trị mới trong cùng 1 render).
→ **Why?** Vì concurrent rendering cho phép React **interrupt và resume** render. Giữa 2 lần đọc, external store có thể đã thay đổi → inconsistency.
→ **Why?** Vì React chỉ đảm bảo consistency cho **internal state** (useState, useReducer). External state cần cơ chế riêng.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Bạn đi du lịch nước ngoài mang theo **sạc điện thoại Việt Nam**. Ổ cắm ở châu Âu khác kiểu. Bạn cần **adapter** (cục chuyển đổi) để:

1. **Cắm vào ổ châu Âu** (subscribe to external store)
2. **Lấy điện ra đúng chuẩn** (getSnapshot — đọc giá trị)
3. **An toàn** không bị giật (tearing-free rendering)

`useSyncExternalStore` = adapter đó. Nó đảm bảo React đọc **consistent snapshot** từ external store, ngay cả khi concurrent rendering.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
import { useSyncExternalStore } from "react";

// External store — nằm ngoài React
const analyticsStore = {
  _listeners: new Set<() => void>(),
  _data: { pageViews: 0, clicks: 0 },

  // subscribe: React gọi để đăng ký lắng nghe thay đổi
  subscribe(listener: () => void) {
    analyticsStore._listeners.add(listener);
    return () => analyticsStore._listeners.delete(listener); // cleanup
  },

  // getSnapshot: React gọi để đọc giá trị HIỆN TẠI
  getSnapshot() {
    return analyticsStore._data; // PHẢI trả về reference ổn định
  },

  // Action: thay đổi data → notify React
  trackClick() {
    analyticsStore._data = { ...analyticsStore._data, clicks: analyticsStore._data.clicks + 1 };
    analyticsStore._listeners.forEach((l) => l()); // Trigger re-render
  },
};

// Component dùng external store
function AnalyticsDashboard() {
  const data = useSyncExternalStore(
    analyticsStore.subscribe, // Cách đăng ký lắng nghe
    analyticsStore.getSnapshot, // Cách đọc giá trị (client)
    analyticsStore.getSnapshot, // Cách đọc giá trị (server SSR)
  );

  return <div>Clicks: {data.clicks}</div>;
}
```

```
Vấn đề Tearing (không có useSyncExternalStore):

  External Store: value = "A"
         │
  ┌──────┴──────┐
  │ Component 1 │ đọc "A" ✓
  │ (render)    │
  └─────────────┘
         │
  ← Store thay đổi: value = "B" →  ← INTERRUPT!
         │
  ┌──────┴──────┐
  │ Component 2 │ đọc "B" ✗ ← SAI! cùng render mà khác giá trị
  │ (render)    │
  └─────────────┘

  → UI inconsistent: Component 1 hiện "A", Component 2 hiện "B"

Với useSyncExternalStore:
  React đọc snapshot 1 lần và dùng cho TOÀN BỘ render
  → Mọi component đều thấy cùng giá trị
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **getSnapshot PHẢI trả reference ổn định**: Nếu mỗi lần gọi tạo object mới (không dùng `===`), React sẽ re-render vô hạn. Cần cache hoặc trả immutable reference.
- **Server rendering**: Tham số thứ 3 (`getServerSnapshot`) bắt buộc nếu dùng SSR. Thường trả default value.
- **Bạn ít khi dùng trực tiếp**: Libraries (Redux, Zustand) đã wrap `useSyncExternalStore` rồi. Bạn cần hiểu khi nào building library hoặc custom store.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                  | Tại sao sai                               | Đúng là                                                |
| ---------------------------------------- | ----------------------------------------- | ------------------------------------------------------ |
| `getSnapshot` trả object mới mỗi lần gọi | Infinite re-render vì reference luôn khác | Cache result, trả cùng reference nếu data không đổi    |
| Quên `getServerSnapshot`                 | SSR crash hoặc hydration mismatch         | Luôn cung cấp server snapshot                          |
| Dùng cho React internal state            | Overkill, useState đủ rồi                 | Chỉ dùng cho external stores (window, third-party lib) |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "tearing", "external store", "useSyncExternalStore", "concurrent rendering consistency"
- → Nhớ đến: Adapter ổ cắm điện, tearing diagram
- → Mở đầu trả lời: _"useSyncExternalStore giải quyết vấn đề tearing trong concurrent rendering — khi external store thay đổi giữa lúc React đang render, các component có thể đọc giá trị không nhất quán. Hook này đảm bảo React đọc 1 snapshot duy nhất cho toàn bộ render tree."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [React Fundamentals — Fiber](./01-react-fundamentals.md) — hiểu concurrent rendering có thể interrupt
- ➡️ Để hiểu tiếp: [State Management](./05-state-management.md) — hiểu tại sao Redux/Zustand cần hook này

---

### 5. Custom Hook Architecture / Kiến Trúc Custom Hook

> 🧠 **Memory Hook**: "Custom hook = **công thức nấu ăn** — bạn gói nhiều bước (state + effect + logic) thành 1 tên gọi, ai cũng có thể nấu lại mà không cần biết chi tiết."

**Tại sao tồn tại? / Why does this exist?**
Components thường có logic lặp lại: fetch data → loading/error state → cleanup. Copy-paste logic này giữa components vi phạm DRY và tạo bugs khi fix 1 chỗ mà quên chỗ khác.
→ **Why?** Vì trước hooks, reuse logic cần HOC hoặc render props — cả 2 đều tạo "wrapper hell" và khó debug.
→ **Why?** Vì hooks cho phép **extract logic mà không thay đổi component tree** — custom hook là function thuần, không render JSX.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Bạn hay nấu ăn. Mỗi món cần bước "pha nước sốt": trộn dầu, giấm, muối, tiêu, khuấy đều. Thay vì viết lại bước này cho mỗi món, bạn tạo **công thức "Sốt cơ bản"** — ghi 1 lần, dùng ở bất kỳ món nào.

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
    const controller = new AbortController(); // Cleanup mechanism

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
    return () => controller.abort(); // Cleanup khi url thay đổi hoặc unmount
  }, [url]);

  return { data, error, isLoading } as const;
}

// ============================
// Sử dụng — cực kỳ clean
// ============================
function ProductPage({ id }: { id: string }) {
  const { data: product, error, isLoading } = useFetch<Product>(`/api/products/${id}`);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <ProductDetail product={product!} />;
}
```

```
Custom Hook Composition Layers:

Layer 1: Primitive Hooks (React built-in)
┌──────────────────────────────────────────┐
│  useState  useEffect  useRef  useMemo    │
└────────────────────┬─────────────────────┘
                     │ compose
Layer 2: Utility Hooks (tái sử dụng logic đơn)
┌──────────────────────────────────────────┐
│  useDebounce  useLocalStorage  useToggle │
└────────────────────┬─────────────────────┘
                     │ compose
Layer 3: Feature Hooks (logic nghiệp vụ)
┌──────────────────────────────────────────┐
│  useFetch  useForm  useAuth  useCart     │
└────────────────────┬─────────────────────┘
                     │ compose
Layer 4: Page Hooks (orchestrate features)
┌──────────────────────────────────────────┐
│  useCheckoutFlow  useDashboardData       │
└──────────────────────────────────────────┘
```

**Design Principles cho Custom Hooks:**

| Nguyên tắc                   | Giải thích                            | Ví dụ                                               |
| ---------------------------- | ------------------------------------- | --------------------------------------------------- |
| **Single Responsibility**    | 1 hook = 1 concern                    | `useFetch` chỉ fetch, không format data             |
| **Return tuple hoặc object** | Tuple cho ít values, object cho nhiều | `[value, setValue]` vs `{ data, error, isLoading }` |
| **Prefix `use`**             | React lint rule yêu cầu               | `useWindowSize`, không phải `getWindowSize`         |
| **Accept primitives**        | Tránh object trong deps array         | `useFetch(url)` not `useFetch({ url, method })`     |
| **Cleanup**                  | Abort, unsubscribe trong return       | AbortController cho fetch, removeEventListener      |

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Mỗi component gọi hook = instance riêng**: `useFetch` trong ComponentA và ComponentB tạo **2 state riêng biệt**, 2 fetch calls. Muốn share → cần lift state hoặc cache layer (TanStack Query).
- **Closure trap**: Nếu custom hook dùng callback mà reference value cũ (stale closure), cần `useRef` để giữ latest value.
- **Testing**: Custom hook test bằng `renderHook` từ `@testing-library/react-hooks`. Không cần tạo dummy component.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                | Tại sao sai                                  | Đúng là                                   |
| -------------------------------------- | -------------------------------------------- | ----------------------------------------- |
| Hook return quá nhiều thứ              | Interface phức tạp, khó maintain             | Tách thành nhiều hooks nhỏ                |
| Không cleanup trong useEffect          | Memory leak, race condition                  | Luôn return cleanup function              |
| Pass object làm dependency             | Object mới mỗi render → effect chạy liên tục | Destructure, pass primitive values        |
| Nghĩ hooks share state giữa components | Mỗi component có instance riêng              | Dùng Context hoặc external store để share |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "custom hook", "reuse logic", "hook architecture", "extract logic"
- → Nhớ đến: Công thức nấu ăn, 4 composition layers
- → Mở đầu trả lời: _"Custom hook là cách extract và reuse stateful logic mà không thay đổi component tree. Tôi thiết kế theo 4 layers: primitive hooks → utility hooks → feature hooks → page hooks. Nguyên tắc quan trọng nhất là single responsibility và proper cleanup."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Hooks Deep Dive](./03-hooks-deep-dive.md) — hiểu primitive hooks
- ➡️ Để hiểu tiếp: [Advanced Patterns](./04-advanced-patterns.md) — kết hợp custom hooks với compound components

---

## Q&A Section / Câu Hỏi Phỏng Vấn

### Q1: What are the main categories of React hooks? / Phân loại các nhóm hooks trong React? 🟢 Junior

**A:** React hooks fall into 5 categories: **State** (useState, useReducer, useContext), **Effect** (useEffect, useLayoutEffect), **Ref** (useRef, useImperativeHandle), **Performance** (useMemo, useCallback), and **Concurrency** (useTransition, useDeferredValue, useSyncExternalStore).

Mỗi nhóm giải quyết 1 bài toán khác nhau. State giữ dữ liệu, Effect đồng bộ bên ngoài, Ref giữ reference mà không trigger re-render, Performance cache kết quả, Concurrency ưu tiên render. Hiểu phân loại giúp bạn chọn đúng hook cho đúng vấn đề.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Phân loại theo **mục đích** (state/effect/ref/performance/concurrency) và giải thích khi nào dùng nhóm nào
- ❌ Weak: Liệt kê tên hooks mà không giải thích tại sao chúng được nhóm lại

---

### Q2: When should you use useLayoutEffect instead of useEffect? / Khi nào dùng useLayoutEffect thay vì useEffect? 🟢 Junior

**A:** `useLayoutEffect` runs **synchronously after DOM update but before browser paint**. Use it when you need to **measure DOM** (element dimensions, scroll position) or **prevent visual flicker** (positioning a tooltip before user sees it).

`useEffect` chạy **sau khi browser paint** — user đã thấy UI rồi. 99% trường hợp dùng `useEffect`. Chỉ dùng `useLayoutEffect` khi bạn cần **đọc layout DOM** (getBoundingClientRect) hoặc **thay đổi DOM trước khi user thấy** (tránh flicker).

```tsx
// ✅ useLayoutEffect — đo tooltip position trước khi hiện
useLayoutEffect(() => {
  const rect = tooltipRef.current.getBoundingClientRect();
  setPosition({ top: rect.bottom, left: rect.left });
}, [isOpen]);

// ✅ useEffect — fetch data (không cần đọc DOM)
useEffect(() => {
  fetchData(id);
}, [id]);
```

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu rõ "sync trước paint" vs "async sau paint", cho ví dụ cụ thể (tooltip, scroll restore)
- ❌ Weak: "useLayoutEffect chạy trước useEffect" mà không giải thích **tại sao** điều đó quan trọng

---

### Q3: Explain useTransition vs useDeferredValue — when to use which? / Giải thích useTransition vs useDeferredValue — khi nào dùng cái nào? 🟡 Mid

**A:** Both enable **priority-based rendering** but differ in **who controls the update**:

- `useTransition`: You control the setState call → wrap it in `startTransition()`. Used at the **producer** side.
- `useDeferredValue`: You receive a value (props) you can't control → create a deferred copy. Used at the **consumer** side.

Cách nhớ đơn giản:

- **Bạn gọi setState?** → `useTransition`
- **Bạn nhận props?** → `useDeferredValue`

```tsx
// useTransition — bạn control setState
const [isPending, startTransition] = useTransition();
function handleSearch(query: string) {
  setInput(query); // urgent
  startTransition(() => {
    setFilteredList(filter(query)); // non-urgent
  });
}

// useDeferredValue — bạn nhận value từ parent
function Results({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(() => filter(deferredQuery), [deferredQuery]);
}
```

Cả 2 đều khác debounce: debounce delay cố định bất kể máy nhanh hay chậm. useTransition/useDeferredValue để React **tự quyết** — máy nhanh thì delay gần 0, máy chậm thì delay tăng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Phân biệt producer vs consumer, nêu scenario cụ thể cho mỗi cái, so sánh với debounce
- ❌ Weak: "Cả 2 giống nhau, đều defer updates" mà không phân biệt use case

---

### Q4: What is tearing and how does useSyncExternalStore prevent it? / Tearing là gì và useSyncExternalStore ngăn chặn như thế nào? 🟡 Mid

**A:** **Tearing** is when different parts of the UI show **inconsistent data** from the same source during a single render. It happens with concurrent rendering: React starts rendering Component A (reads value "X"), gets interrupted, external store changes to "Y", React continues rendering Component B (reads "Y") → A shows "X", B shows "Y".

`useSyncExternalStore` prevents this by ensuring React reads a **single consistent snapshot** for the entire render tree.

Tearing xảy ra vì concurrent rendering cho phép React **interrupt giữa chừng**. Trong khoảng thời gian đó, external store (Redux, Zustand, global variable) có thể thay đổi. `useSyncExternalStore` đảm bảo React đọc **1 snapshot duy nhất** cho toàn bộ render — không component nào thấy giá trị khác.

Thực tế bạn ít gặp tearing trực tiếp vì các libraries đã xử lý. Nhưng nếu build custom store hoặc đọc từ `window`/`localStorage`, cần dùng hook này.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích mechanism (interrupt → stale read), nêu ví dụ cụ thể, biết libraries đã wrap hook này
- ❌ Weak: "Tearing là bug" mà không giải thích **tại sao** concurrent rendering gây ra nó

---

### Q5: How do you decide between useReducer and useState? / Khi nào chọn useReducer thay vì useState? 🟡 Mid

**A:** Choose `useReducer` when:

1. **State logic is complex** — multiple related values that change together
2. **Next state depends on previous state** in non-trivial ways
3. **You want testable logic** — reducer is a pure function, easy to unit test
4. **State transitions need documentation** — action types serve as documentation

Dùng `useState` cho state đơn giản (boolean, string, number). Dùng `useReducer` khi state có **nhiều trường liên quan nhau** (form với validation, multi-step wizard, shopping cart).

```tsx
// useState — đơn giản
const [isOpen, setIsOpen] = useState(false);

// useReducer — state phức tạp, nhiều action
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

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu criteria rõ ràng (complex logic, related state, testability), cho ví dụ both sides
- ❌ Weak: "useReducer cho state phức tạp" mà không giải thích **thế nào là phức tạp**

---

### Q6: Design a custom hook `useDebounce` — walk through architecture decisions. / Thiết kế custom hook `useDebounce` — trình bày các quyết định thiết kế. 🔴 Senior

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

// Usage
function Search() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) fetchResults(debouncedQuery);
  }, [debouncedQuery]);
}
```

**Architecture decisions:**

1. **Debounce value, not callback**: Hook nhận `value` thay vì `callback` vì value-based debounce dễ compose hơn (kết hợp với useEffect downstream).
2. **Cleanup pattern**: Mỗi lần `value` thay đổi, cleanup cancel timer cũ → chỉ timer cuối cùng được thực thi.
3. **Generic type `<T>`**: Hoạt động với bất kỳ type nào (string, number, object).
4. **Configurable delay**: Cho phép caller quyết định thời gian debounce.

**Trade-offs:**

- Value-based = thêm 1 render cycle so với callback-based
- Nếu cần debounce **function call**, dùng `useMemo(() => debounce(fn, delay), [fn, delay])` thay vì hook này
- Không xử lý leading edge (fire immediately rồi ignore) — cần thêm `options.leading` parameter

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích cleanup mechanism, trade-off value vs callback, generic typing, extensibility (leading/trailing)
- ❌ Weak: Chỉ show code mà không giải thích tại sao design như vậy

**🔗 Follow-up Chain:**

1. "Nếu cần debounce callback thay vì value thì thay đổi gì?" → `useCallback` + `useMemo(() => debounce(fn), [fn])`
2. "So sánh useDebounce vs useDeferredValue?" → Debounce = fixed delay, deferred = React-controlled adaptive delay
3. "Làm sao test hook này?" → `renderHook` + `act` + `jest.useFakeTimers` để control thời gian

---

### Q7: Explain the Rules of Hooks internals — why can't hooks be conditional? / Giải thích cơ chế internal của Rules of Hooks — tại sao hooks không được đặt trong điều kiện? 🔴 Senior

**A:** React stores hooks as a **linked list** on each Fiber node. During each render, React traverses this list **sequentially by call order**. If hook calls are conditional, the list shifts and React reads the wrong hook's state.

React lưu hooks dưới dạng **linked list** gắn vào Fiber node. Mỗi render, React đi qua list **theo thứ tự gọi** — hook thứ 1 = node thứ 1, hook thứ 2 = node thứ 2...

```
Render 1 (showExtra = true):
  [0] useState("") ←── name
  [1] useState(0)  ←── age
  [2] useState("") ←── extra  ← GỌI vì showExtra = true

Render 2 (showExtra = false):
  [0] useState("") ←── name ✓
  [1] useState(0)  ←── age ✓
  ← [2] bị skip!

  React nghĩ hook[1] = age, nhưng data ở [1] có thể bị shift
  → STATE SAI, APP CRASH
```

**Tại sao linked list mà không dùng key?**

- Performance: Linked list traverse O(1) per hook, không cần hash lookup
- Simplicity: Không cần developer đặt tên/key cho mỗi hook
- Trade-off: Mất flexibility (no conditional) để đổi lấy performance + simplicity

**Cách React enforce:**

- ESLint plugin `eslint-plugin-react-hooks` kiểm tra static analysis
- Rule: Hooks phải ở **top level** của function component, không trong if/loop/nested function
- Exception: `use()` API trong React 19 — **không** lưu trong linked list → CÓ THỂ dùng conditional

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích linked list mechanism, nêu trade-off (simplicity vs flexibility), biết `use()` exception
- ❌ Weak: "Vì React docs nói vậy" mà không giải thích cơ chế bên trong

**🔗 Follow-up Chain:**

1. "Tại sao React chọn linked list thay vì Map?" → Performance (no hashing overhead) + no key management burden
2. "use() API khác hooks bình thường như thế nào?" → Không lưu trong linked list, React track bằng Promise identity
3. "Nếu bạn thiết kế hooks system từ đầu, bạn chọn cách nào?" → Open-ended: named slots (Svelte-like) vs current approach, trade-offs

---

### Q8: Design a `usePagination` hook for infinite scroll with virtualization. / Thiết kế hook `usePagination` cho infinite scroll kết hợp virtualization. 🔴 Senior

**A:**

```tsx
interface UsePaginationOptions {
  fetchPage: (page: number) => Promise<{ data: Item[]; hasMore: boolean }>;
  pageSize: number;
  threshold?: number; // pixels from bottom to trigger next load
}

interface UsePaginationResult {
  items: Item[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement>; // Attach to bottom sentinel
}

function usePagination({
  fetchPage,
  pageSize,
  threshold = 200,
}: UsePaginationOptions): UsePaginationResult {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Fetch page data
  const loadPage = useCallback(
    async (pageNum: number) => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);
      try {
        const result = await fetchPage(pageNum);
        setItems((prev) => [...prev, ...result.data]);
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
    return () => observer.disconnect();
  }, [page, hasMore, isLoading, loadPage, threshold]);

  // Initial load
  useEffect(() => {
    loadPage(1);
  }, []); // eslint-disable-line

  return { items, isLoading, error, hasMore, sentinelRef };
}
```

**Architecture decisions:**

1. **IntersectionObserver over scroll event**: Performance — no scroll handler firing 60fps, browser-native lazy detection
2. **Sentinel element pattern**: Một `<div ref={sentinelRef} />` ở cuối list. Khi nó visible → load more. Decouple scroll logic khỏi list component.
3. **Accumulate items**: `setItems(prev => [...prev, ...newData])` — append, không replace
4. **Guard conditions**: `isLoading || !hasMore` prevents duplicate fetches

**Kết hợp Virtualization:**
Hook này return `items` array. Render bằng `react-window` hoặc `@tanstack/react-virtual` — chỉ render items trong viewport, sentinel ở cuối virtual list.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: IntersectionObserver thay scroll event, sentinel pattern, guard conditions, virtualization integration
- ❌ Weak: Chỉ dùng `onScroll` + `scrollHeight` check mà không nói về performance implications

**🔗 Follow-up Chain:**

1. "Xử lý race condition khi user scroll nhanh?" → Abort previous fetch, use page number as key
2. "Cache pages khi user scroll ngược lên?" → Keep items array, chỉ virtualize rendering
3. "Reset khi filter thay đổi?" → Reset items/page state, cancel pending fetches

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| #   | Question                          | Level | Key Point                                               |
| --- | --------------------------------- | ----- | ------------------------------------------------------- |
| Q1  | Hook categories                   | 🟢    | 5 nhóm: State, Effect, Ref, Performance, Concurrency    |
| Q2  | useLayoutEffect vs useEffect      | 🟢    | Sync before paint (DOM measure) vs async after paint    |
| Q3  | useTransition vs useDeferredValue | 🟡    | Producer (control setState) vs Consumer (receive props) |
| Q4  | Tearing & useSyncExternalStore    | 🟡    | Consistent snapshot for concurrent rendering            |
| Q5  | useReducer vs useState            | 🟡    | Complex related state + testable transitions            |
| Q6  | Design useDebounce                | 🔴    | Cleanup mechanism, value vs callback, generic typing    |
| Q7  | Rules of Hooks internals          | 🔴    | Linked list, sequential traversal, use() exception      |
| Q8  | Design usePagination              | 🔴    | IntersectionObserver, sentinel pattern, virtualization  |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"Explain the difference between useTransition and useDeferredValue."**

**30 giây đầu — mở đầu lý tưởng / Ideal 30-second opening:**

1. "Cả hai đều enable priority-based rendering trong React 18, nhưng khác nhau ở **vị trí control**."
2. "`useTransition` dùng ở **producer** — khi bạn control setState call, wrap non-urgent update trong startTransition. `useDeferredValue` dùng ở **consumer** — khi bạn nhận value từ props mà không control setState."
3. "Ví dụ thực tế: search page — nếu SearchPage tự manage state thì dùng useTransition. Nếu SearchResults nhận query qua props thì dùng useDeferredValue."
4. "Cả 2 đều khác debounce — debounce delay cố định, còn React tự điều chỉnh delay dựa trên khả năng máy."

_Sau đó mở rộng theo hướng interviewer dẫn dắt._

---

## Self-Check / Tự Kiểm Tra ⚡

> **Đóng tài liệu lại trước khi làm — Close the doc before attempting.**

- [ ] **Retrieval**: Viết 5 nhóm hooks từ trí nhớ, mỗi nhóm ít nhất 2 hooks. So sánh với Concept Map.
- [ ] **Visual**: Vẽ diagram useTransition timeline (gõ "iph") ra giấy. So sánh với ASCII diagram trên.
- [ ] **Application**: User gõ vào search box, results list 5000 items render chậm. Bạn dùng useTransition hay useDeferredValue? Tại sao?
- [ ] **Debug**: Custom hook `useFetch` gọi API 2 lần khi mount — nguyên nhân? Fix?
- [ ] **Teach**: Giải thích useTransition cho người không biết lập trình bằng ví dụ ngân hàng VIP.

💬 **Feynman Prompt:** Giải thích sự khác biệt giữa useTransition và useDeferredValue cho người bạn không biết code, dùng ví dụ ngân hàng 2 hàng đợi. Không dùng thuật ngữ kỹ thuật.

🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày → 7 ngày → 14 ngày** để chuyển vào long-term memory.

---

## Connections / Liên Kết

- ⬅️ **Built on:** [Hooks Deep Dive](./03-hooks-deep-dive.md) — useState/useEffect/useRef là nền tảng cho mọi hook khác
- ➡️ **Enables:** [Performance Optimization](./09-performance-optimization.md) — áp dụng concurrency hooks + custom hooks để tối ưu
- 🔗 **Applied in:** React 18+ concurrent features, state management libraries (Zustand, Redux), form libraries (React Hook Form)
