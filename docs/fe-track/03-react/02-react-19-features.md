# React 19 New Features / Tính Năng Mới Của React 19

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **Prerequisites**: [React Fundamentals](./01-react-fundamentals.md)
> **See also**: [Hooks Deep Dive](./03-hooks-deep-dive.md) | [Modern React Features](./10-modern-react-features.md)
> **L5 Competencies**: System Design, Architecture Decision, Migration Strategy

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn đang maintain một React 18 app. Codebase có hàng trăm `useMemo`, `useCallback`, `React.memo` — ai cũng sợ xoá vì "xoá lỡ chậm thì sao?". Form submit thì phải tự quản lý `isLoading`, `error`, `optimisticData` bằng tay — mỗi form 30 dòng boilerplate. Team lead hỏi: **"React 19 có gì mới? Có nên upgrade không? Migration risk là gì?"**

Nếu không hiểu React 19, bạn sẽ không trả lời được câu hỏi đó — và quan trọng hơn, bạn đang viết code theo cách sẽ bị React loại bỏ dần.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng:**
Nghĩ React 18 như lái xe số sàn — bạn phải tự sang số (useMemo), tự đạp côn (useCallback), tự kiểm tra gương (memo). React 19 là xe số tự động — hộp số tự chuyển (Compiler), hệ thống hỗ trợ lái (Actions), và GPS tích hợp (use() API). Bạn vẫn cần biết lái, nhưng máy lo phần nhàm chán.

| React 18 (Số sàn)                     | React 19 (Số tự động)                     |
| ------------------------------------- | ----------------------------------------- |
| `useMemo(() => expensive, [deps])`    | Compiler tự detect và memo                |
| Tự quản lý `loading/error/optimistic` | `useActionState` + `useOptimistic` lo hết |
| `forwardRef(Component)`               | `ref` là prop bình thường                 |
| `useEffect` đọc Promise               | `use(promise)` trong render               |
| `<Context.Provider value={}>`         | `<Context value={}>` trực tiếp            |

**Tại sao phải học topic này?**

- Phỏng vấn React ở mức Mid+ bây giờ **luôn hỏi React 19** — đặc biệt Compiler và Actions
- Hiểu React 19 = hiểu hướng đi của React → cho thấy bạn cập nhật, không stuck ở kiến thức cũ
- Migration strategy là câu hỏi System Design thực tế — Senior phải trả lời được

---

## Concept Map / Bản Đồ Khái Niệm

```
                        ┌─────────────────┐
                        │   REACT 19      │
                        └────────┬────────┘
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                   ▼
   ┌──────────────────┐ ┌───────────────┐ ┌─────────────────┐
   │  React Compiler  │ │    Actions    │ │   use() API     │
   │  (auto-memo)     │ │  (form flow)  │ │  (async read)   │
   └──────────────────┘ └───────────────┘ └─────────────────┘
              │                  │                   │
              ▼                  ▼                   ▼
   Loại bỏ useMemo/     useActionState     Thay useEffect
   useCallback/memo      useFormStatus      fetch pattern
                         useOptimistic
              │                  │                   │
              └──────────────────┼───────────────────┘
                                 ▼
                    ┌────────────────────────┐
                    │  Thay đổi nhỏ khác:    │
                    │  • ref as prop         │
                    │  • ref cleanup fn      │
                    │  • <Context> directly  │
                    └────────────────────────┘
```

**Bạn đang ở đây trong lộ trình học:**

```
React Fundamentals → [REACT 19 FEATURES] → Hooks Deep Dive → State Management
```

---

## Overview / Tổng Quan

React 19 introduces three major categories of changes: the React Compiler (automatic memoization at build time), Actions (a managed async lifecycle for form submissions), and the `use()` API (reading async resources during render). Together with smaller changes like ref-as-prop and Context simplification, React 19 represents the biggest API shift since Hooks.

React 19 có 3 thay đổi lớn: Compiler tự memo hoá, Actions quản lý form async, và `use()` đọc Promise/Context trong render. Kèm theo nhiều thay đổi nhỏ giúp đơn giản hoá API. Đây là bước nhảy lớn nhất kể từ khi Hooks ra đời.

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. React Compiler / Trình Biên Dịch React

> 🧠 **Memory Hook**: "React Compiler = TypeScript cho performance — phân tích code lúc build, tự thêm memo mà dev không phải viết."

**Tại sao tồn tại? / Why does this exist?**
Developer phải tự thêm `useMemo`, `useCallback`, `React.memo` để tránh re-render thừa. Nhưng phần lớn dev thêm sai (thiếu deps, quá nhiều, hoặc quên).
→ **Why?** Vì con người không giỏi track dependency thay đổi qua nhiều render — đó là việc máy làm tốt hơn.
→ **Why?** Vì bản chất React re-render toàn bộ subtree khi state thay đổi (Virtual DOM design decision từ đầu) — memoization là cách "chữa cháy" cho design đó.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Hãy tưởng tượng bạn viết bài luận bằng tay. Mỗi lần sửa 1 từ, bạn phải chép lại toàn bộ bài (= React re-render). Trước đây bạn phải tự đánh dấu "đoạn này không đổi, không cần chép lại" (= useMemo). React Compiler giống như có thầy giáo đọc bài bạn và tự đánh dấu giùm: "đoạn 1 giữ nguyên, đoạn 3 giữ nguyên, chỉ chép lại đoạn 2".

#### Layer 2: How It Works / Cơ Chế Hoạt Động

React Compiler là một **Babel plugin** chạy lúc build time. Nó phân tích source code (static analysis) và tự thêm memoization vào output.

```
  SOURCE CODE (bạn viết)          COMPILED OUTPUT (Compiler tạo)
  ─────────────────────           ──────────────────────────────
  function Cart({ items }) {      function Cart({ items }) {
    const total =                   const total = useMemo(
      items.reduce(...)               () => items.reduce(...),
                                      [items]
    return <div>{total}</div>       );
  }                                 return useMemo(
                                      () => <div>{total}</div>,
                                      [total]
                                    );
                                  }
```

**Quy tắc Compiler phân tích:**

```
  ┌────────────────────────────────────────┐
  │        React Compiler Pipeline         │
  ├────────────────────────────────────────┤
  │  1. Parse AST (cây cú pháp)           │
  │           ▼                            │
  │  2. Phân tích data flow               │
  │     - Biến nào depend vào biến nào?   │
  │     - Giá trị nào thay đổi giữa       │
  │       các render?                      │
  │           ▼                            │
  │  3. Tìm "stable regions"              │
  │     - Code nào cho cùng output        │
  │       nếu input không đổi?            │
  │           ▼                            │
  │  4. Wrap bằng memoization cache       │
  │     - Thêm useMemo/useCallback tự    │
  │       động vào compiled output        │
  └────────────────────────────────────────┘
```

**Cách adopt dần (incremental adoption):**

```js
// babel.config.js — chỉ áp dụng cho 1 folder
module.exports = {
  plugins: [
    [
      "babel-plugin-react-compiler",
      {
        sources: (filename) => {
          return filename.includes("src/components/new/");
        },
      },
    ],
  ],
};
```

**ESLint plugin kiểm tra trước khi bật:**

```bash
npx react-compiler-healthcheck   # scan codebase
npx eslint-plugin-react-compiler # audit từng file
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Không compile được:** Code vi phạm Rules of React (mutate state trực tiếp, side effect trong render). Compiler sẽ **skip** file đó, không báo lỗi.
- **Directive opt-out:** Thêm `"use no memo"` ở đầu function để Compiler bỏ qua.
- **Không thay thế 100%:** Compiler xử lý render logic, nhưng **không fix** re-render do Context (vẫn cần context splitting).
- **Build time tăng:** Thêm 1 bước vào build pipeline — đo benchmark trước khi deploy.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                               | Tại sao sai                                                                                | Đúng là                                                         |
| ------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| "Compiler thay thế hoàn toàn useMemo" | Compiler skip code violate Rules of React                                                  | Compiler là best-effort — clean code trước, Compiler tối ưu sau |
| "Bật Compiler = app nhanh hơn ngay"   | Nếu code có mutation/side-effect, Compiler skip                                            | Cần audit code quality trước bằng ESLint plugin                 |
| "Xoá hết memo khi dùng Compiler"      | Compiler sinh ra memo tương đương — xoá cũng OK, nhưng nếu Compiler skip file thì mất memo | Giữ memo cũ, Compiler sẽ tự nhận ra và không thêm trùng         |
| "Compiler fix re-render problem"      | Compiler chỉ memo render output, không fix Context propagation                             | Vẫn cần context splitting / state colocation                    |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "React Compiler", "auto-memoization", "tương lai của useMemo"
- → Nhớ đến: Build-time static analysis, Babel plugin, incremental adoption
- → Mở đầu trả lời: _"React Compiler phân tích code lúc build time và tự thêm memoization — giống TypeScript phân tích type. Nó không thay thế developer thinking, mà automate phần mechanical. Áp dụng incremental qua Babel plugin config."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [useMemo/useCallback](./03-hooks-deep-dive.md), [Virtual DOM & Reconciliation](./01-react-fundamentals.md)
- ➡️ Để hiểu tiếp: [Performance Optimization](./09-performance-optimization.md)

---

### 2. Actions Pattern / Mô Hình Actions

> 🧠 **Memory Hook**: "Actions = React quản lý vòng đời async cho bạn — `pending → success/error` tự động, không cần useState thủ công."

**Tại sao tồn tại? / Why does this exist?**
Mỗi form submit cần quản lý: loading state, error state, optimistic update, form reset. Dev phải viết 4-5 useState + try/catch mỗi form — boilerplate lặp đi lặp lại.
→ **Why?** Vì async operation có lifecycle phức tạp (pending/success/error/retry) mà useState đơn giản không model được.
→ **Why?** Vì React trước v19 chỉ cung cấp primitive (useState/useEffect) — dev phải tự compose lifecycle từ primitive. Actions nâng abstraction level lên.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Hãy tưởng tượng bạn gửi thư ở bưu điện. Trước React 19, bạn phải tự: (1) ghi "đang gửi" lên bảng, (2) đưa thư cho nhân viên, (3) đợi, (4) nếu OK thì xoá bảng, nếu thất bại thì ghi lỗi lên bảng. React 19 Actions giống như bưu điện tự động: bạn chỉ đưa thư, hệ thống tự hiển thị "đang xử lý", tự thông báo kết quả, tự xử lý lỗi.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

Actions gồm 3 hooks phối hợp:

```
  ┌─────────────────────────────────────────────────────────┐
  │                    ACTIONS TRIO                          │
  ├─────────────────────────────────────────────────────────┤
  │                                                         │
  │  useActionState(action, initialState)                   │
  │  ├── Quản lý: state + pending + error                  │
  │  ├── Input: async function (prevState, formData)        │
  │  └── Output: [state, formAction, isPending]             │
  │                                                         │
  │  useFormStatus()                                        │
  │  ├── Dùng trong: child component của <form>             │
  │  ├── Biết: pending status của parent form               │
  │  └── Output: { pending, data, method, action }          │
  │                                                         │
  │  useOptimistic(state, updateFn)                         │
  │  ├── Hiển thị: kết quả giả trước khi server confirm    │
  │  ├── Tự rollback: nếu server trả error                 │
  │  └── Output: [optimisticState, addOptimistic]           │
  │                                                         │
  └─────────────────────────────────────────────────────────┘
```

**Flow hoạt động:**

```
  User click Submit
       │
       ▼
  ┌──────────────┐    ┌──────────────────┐    ┌────────────────┐
  │ useOptimistic│───▶│ useActionState   │───▶│ Server/API     │
  │ show result  │    │ set isPending    │    │ process data   │
  │ immediately  │    │ = true           │    │                │
  └──────────────┘    └──────────────────┘    └───────┬────────┘
                                                      │
                              ┌────────────────────────┤
                              ▼                        ▼
                      ┌──────────────┐        ┌──────────────┐
                      │   Success    │        │    Error     │
                      │ state update │        │ rollback     │
                      │ isPending=   │        │ optimistic   │
                      │ false        │        │ show error   │
                      └──────────────┘        └──────────────┘
```

**Complete code example:**

```tsx
// ---- Action function (có thể tách riêng file) ----
async function updateName(prevState, formData) {
  const name = formData.get("name");
  if (!name || name.length < 2) {
    return { error: "Name must be at least 2 characters" };
  }
  try {
    await api.updateUser({ name });
    return { name, error: null };
  } catch (e) {
    return { ...prevState, error: e.message };
  }
}

// ---- Form Component ----
function ProfileForm({ currentName }) {
  // useActionState quản lý toàn bộ lifecycle
  const [state, formAction, isPending] = useActionState(updateName, {
    name: currentName,
    error: null,
  });

  // useOptimistic hiện kết quả ngay lập tức
  const [optimisticName, setOptimisticName] = useOptimistic(
    state.name,
    (current, newName) => newName,
  );

  return (
    <form
      action={async (formData) => {
        setOptimisticName(formData.get("name")); // UI cập nhật ngay
        await formAction(formData); // gửi lên server
      }}
    >
      <p>Current: {optimisticName}</p>
      <input name="name" disabled={isPending} />
      {state.error && <p style={{ color: "red" }}>{state.error}</p>}
      <SubmitButton />
    </form>
  );
}

// ---- Submit Button dùng useFormStatus ----
function SubmitButton() {
  const { pending } = useFormStatus(); // tự biết parent form đang pending
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </button>
  );
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **useFormStatus chỉ hoạt động trong child:** Phải là component con nằm bên trong `<form>`. Dùng trong cùng component với form sẽ không work.
- **Action function nhận `prevState`:** Khác với event handler thông thường — state là return value của lần gọi trước, giống useReducer.
- **Optimistic rollback:** `useOptimistic` tự rollback khi action function hoàn tất (success hoặc error). Không cần manually reset.
- **Server Actions (Next.js):** `"use server"` directive biến function thành API endpoint — Actions pattern hoạt động cả client lẫn server.
- **Progressive Enhancement:** `<form action={formAction}>` hoạt động ngay cả khi JavaScript chưa load — HTML form gửi bình thường.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                          | Tại sao sai                                                   | Đúng là                                                       |
| ------------------------------------------------ | ------------------------------------------------------------- | ------------------------------------------------------------- |
| Dùng `useFormStatus` cùng component với `<form>` | Hook cần context từ parent form — cùng level không có context | Tách `<SubmitButton>` ra component riêng                      |
| Quên return new state từ action function         | `useActionState` dùng return value làm state mới              | Luôn return object `{ data, error }`                          |
| Dùng `useState` + `try/catch` thay vì Actions    | Boilerplate nhiều, không có pending/optimistic tự động        | Dùng `useActionState` cho form, `useState` cho non-form state |
| Gọi `setOptimisticName` sau `formAction`         | Optimistic phải hiển thị TRƯỚC khi server response            | Gọi `setOptimistic` trước, `formAction` sau                   |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "form handling React 19", "useActionState", "optimistic updates"
- → Nhớ đến: Actions trio (useActionState + useFormStatus + useOptimistic), managed async lifecycle
- → Mở đầu trả lời: _"React 19 Actions quản lý toàn bộ async lifecycle của form: pending state, error handling, và optimistic update — thay vì dev tự compose từ useState + try/catch. Bộ ba hook phối hợp: useActionState quản lý state, useFormStatus cho child components biết trạng thái, useOptimistic hiện kết quả ngay trước khi server confirm."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [useState/useReducer](./03-hooks-deep-dive.md), [Form handling basics](./01-react-fundamentals.md)
- ➡️ Để hiểu tiếp: [State Management](./05-state-management.md), [Server Components](./10-modern-react-features.md)

---

### 3. use() API

> 🧠 **Memory Hook**: "use() = đọc async value trong render — KHÔNG phải hook (không tuân theo Rules of Hooks), nên dùng được trong if/else."

**Tại sao tồn tại? / Why does this exist?**
Trước React 19, đọc data async phải dùng `useEffect` + `useState` (3-state dance: loading/data/error). Hoặc dùng thư viện như React Query. Không có cách native để "đọc Promise trong render".
→ **Why?** Vì React render phải synchronous — Promise là async. Cần 1 primitive nối 2 thế giới.
→ **Why?** Vì Suspense (React 18) đã có khả năng "pause render" — `use()` là API chính thức để trigger Suspense từ component code.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Hãy tưởng tượng bạn đang đọc sách, gặp footnote ghi "xem phụ lục trang 200". Bạn giữ ngón tay ở trang hiện tại (= Suspense giữ vị trí render), lật sang trang 200 đọc xong (= `use()` đợi Promise resolve), rồi quay lại đọc tiếp. Nếu phụ lục chưa in xong (= Promise pending), bạn thấy tờ giấy ghi "đang in..." (= fallback).

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
  ┌──────────────────────────────────────────────────┐
  │              use() vs useEffect                   │
  ├──────────────────────────────────────────────────┤
  │                                                   │
  │  TRƯỚC (useEffect pattern):                      │
  │  ┌─────────────────────────────┐                 │
  │  │ function UserProfile({ id })│                 │
  │  │   const [user, setUser]     │  3 useState     │
  │  │   const [loading, setLoad]  │  + useEffect    │
  │  │   const [error, setError]   │  + cleanup      │
  │  │   useEffect(() => {         │  = 15+ dòng     │
  │  │     fetch(...)              │  boilerplate    │
  │  │       .then(setUser)        │                 │
  │  │       .catch(setError)      │                 │
  │  │   }, [id])                  │                 │
  │  └─────────────────────────────┘                 │
  │                                                   │
  │  SAU (use() + Suspense):                         │
  │  ┌─────────────────────────────┐                 │
  │  │ function UserProfile({ p }) │                 │
  │  │   const user = use(p);      │  1 dòng.       │
  │  │   return <div>{user.name}   │  Suspense lo   │
  │  │   </div>                    │  loading.       │
  │  └─────────────────────────────┘  ErrorBoundary  │
  │                                   lo error.      │
  └──────────────────────────────────────────────────┘
```

**Cách hoạt động bên trong:**

```
  Component gọi use(promise)
       │
       ├── Promise đã resolved?
       │   └── YES → return giá trị → render tiếp bình thường
       │
       ├── Promise đang pending?
       │   └── YES → throw promise → Suspense bắt
       │            → hiển thị fallback
       │            → khi resolve, React retry render
       │
       └── Promise bị rejected?
           └── YES → throw error → ErrorBoundary bắt
```

**Code thực tế:**

```tsx
import { use, Suspense } from "react";

// QUAN TRỌNG: Promise phải stable reference (tạo bên ngoài render)
// Sai: use(fetch(...)) — tạo Promise mới mỗi render → infinite loop
// Đúng: nhận promise từ prop hoặc cache
function UserProfile({ userPromise }) {
  const user = use(userPromise); // đọc trực tiếp trong render
  return <h1>{user.name}</h1>;
}

// Có thể dùng trong conditional! (không phải hook)
function MaybeUser({ userPromise, showProfile }) {
  if (!showProfile) return <p>Hidden</p>;
  const user = use(userPromise); // OK trong if block!
  return <h1>{user.name}</h1>;
}

// Suspense + ErrorBoundary wrap bên ngoài
function App() {
  const userPromise = fetchUser(1); // tạo 1 lần, truyền xuống

  return (
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <Suspense fallback={<p>Loading...</p>}>
        <UserProfile userPromise={userPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}
```

**use() cũng đọc được Context:**

```tsx
// Thay thế useContext — nhưng dùng được trong conditional
function ThemeButton({ showTheme }) {
  if (!showTheme) return null;
  const theme = use(ThemeContext); // OK! useContext thì không được
  return <button className={theme}>Click</button>;
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Stable reference bắt buộc:** `use(fetch('/api'))` tạo Promise mới mỗi render → infinite loop. Promise phải từ prop, cache, hoặc module scope.
- **Không phải hook:** `use()` không lưu trong linked list → dùng trong if/loop OK. Nhưng vẫn chỉ gọi trong React component/hook.
- **Cần Suspense boundary:** Nếu không có Suspense wrap, pending Promise sẽ throw lên ErrorBoundary hoặc crash.
- **Streaming SSR:** `use()` + Suspense cho phép stream HTML từ server — component nào ready thì gửi trước.
- **React Query vẫn hữu ích:** `use()` chỉ là primitive — không có cache invalidation, retry, refetch on focus như React Query.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                           | Tại sao sai                                                    | Đúng là                                                              |
| ------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------- |
| `use(fetch('/api/user'))` trong render            | Tạo Promise mới mỗi render → infinite suspend/retry            | Promise phải stable: từ prop, useMemo, hoặc cache ngoài component    |
| Nghĩ `use()` thay thế React Query                 | `use()` là primitive đọc Promise, không có cache/retry/refetch | Dùng `use()` cho simple cases, React Query cho complex data fetching |
| Gọi `use()` mà không có Suspense                  | Pending Promise throw ra ngoài → crash hoặc ErrorBoundary bắt  | Luôn wrap component dùng `use()` trong `<Suspense>`                  |
| Nghĩ `use()` là hook nên phải tuân Rules of Hooks | `use()` KHÔNG phải hook — không lưu trong linked list          | Dùng trong if/for/early return đều OK                                |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "use() API", "đọc Promise trong render", "Suspense data fetching"
- → Nhớ đến: Không phải hook, cần stable reference, throw-to-Suspense mechanism
- → Mở đầu trả lời: _"use() là API mới của React 19 cho phép đọc async value trực tiếp trong render — khác với hook vì không lưu trong linked list, nên dùng được trong conditional. Nó throw Promise pending lên Suspense boundary, và throw error lên ErrorBoundary. Quan trọng nhất: Promise phải là stable reference."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Suspense](./10-modern-react-features.md), [useEffect pattern](./03-hooks-deep-dive.md)
- ➡️ Để hiểu tiếp: [Server Components & Streaming](./10-modern-react-features.md)

---

### 4. Ref Changes / Thay Đổi Về Ref

> 🧠 **Memory Hook**: "React 19: ref là prop bình thường — forwardRef xoá, ref có cleanup như useEffect."

**Tại sao tồn tại? / Why does this exist?**
`forwardRef` là wrapper verbose — mỗi component chỉ để truyền ref phải bọc thêm 1 lớp HOC. Và ref không có cleanup function — khi component unmount, dev phải tự dọn dẹp trong useEffect riêng.
→ **Why?** Vì ref ban đầu được thiết kế là "escape hatch" đặc biệt, không phải prop thông thường. Nhưng thực tế ref được dùng rất phổ biến → cần đơn giản hoá.
→ **Why?** Vì API phức tạp không cần thiết tạo ra cognitive overhead — mỗi lần dùng ref phải nhớ "à, cái này phải forwardRef".

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Trước React 19, muốn đưa chìa khoá (ref) cho nhà bên trong (child component), bạn phải đưa qua trung gian (forwardRef wrapper). Bây giờ bạn đưa thẳng — chìa khoá là đồ vật bình thường, không cần xử lý đặc biệt.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
  TRƯỚC React 19:                       SAU React 19:
  ─────────────────                     ─────────────────
  // Phải dùng forwardRef               // ref là prop thường
  const Input = forwardRef(             function Input({ ref, ...props }) {
    (props, ref) => {                     return <input ref={ref} {...props} />;
      return <input ref={ref}           }
        {...props} />;
    }
  );
```

**Ref cleanup function (mới):**

```
  TRƯỚC: ref callback không có cleanup
  ──────────────────────────────────────
  <div ref={(node) => {
    // gắn observer
    observer.observe(node);
    // KHÔNG CÓ CÁCH CLEANUP!
    // phải dùng useEffect riêng
  }} />

  SAU: ref callback return cleanup function
  ──────────────────────────────────────
  <div ref={(node) => {
    observer.observe(node);
    return () => observer.disconnect(); // cleanup!
  }} />
```

**Ví dụ thực tế — IntersectionObserver với ref cleanup:**

```tsx
function LazyImage({ src }) {
  return (
    <img
      ref={(node) => {
        if (!node) return;
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            node.src = src;
            observer.disconnect();
          }
        });
        observer.observe(node);
        return () => observer.disconnect(); // tự cleanup khi unmount
      }}
    />
  );
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **forwardRef vẫn hoạt động:** Không bị xoá, chỉ deprecated. Codebase cũ vẫn chạy.
- **Ref cleanup timing:** Cleanup chạy khi component unmount HOẶC khi ref callback thay đổi (giống useEffect cleanup).
- **TypeScript:** `ref` prop type tự động infer — không cần `ForwardedRef<T>` nữa.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                               | Tại sao sai                                | Đúng là                                              |
| ------------------------------------- | ------------------------------------------ | ---------------------------------------------------- |
| Vẫn dùng forwardRef cho component mới | forwardRef deprecated trong React 19       | Nhận `ref` như prop bình thường                      |
| Không return cleanup từ ref callback  | Observer/listener leak khi unmount         | Luôn return cleanup function nếu ref gắn side-effect |
| Xoá hết forwardRef ngay khi upgrade   | Migration cần dần dần, forwardRef vẫn work | Để forwardRef cho code cũ, code mới dùng ref-as-prop |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "forwardRef deprecated", "ref changes React 19"
- → Nhớ đến: ref as prop, cleanup function, migration gradual
- → Mở đầu trả lời: _"React 19 biến ref thành prop bình thường — không cần forwardRef wrapper nữa. Thêm vào đó, ref callback giờ có thể return cleanup function, giống useEffect, giúp dọn dẹp observer/listener ngay tại nơi tạo."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [useRef](./03-hooks-deep-dive.md), [Component & Props](./01-react-fundamentals.md)
- ➡️ Để hiểu tiếp: [Advanced Patterns - Imperative Handle](./04-advanced-patterns.md)

---

### 5. Context Simplification & Other Changes / Context Đơn Giản Hoá

> 🧠 **Memory Hook**: "React 19: `<Context>` trực tiếp thay `<Context.Provider>` — bớt 1 tầng nesting."

**Tại sao tồn tại? / Why does this exist?**
`<ThemeContext.Provider value={theme}>` là verbose — `.Provider` là chi tiết implementation không cần thiết. React 19 cho phép `<ThemeContext value={theme}>` trực tiếp.
→ **Why?** Vì API đơn giản hơn = ít lỗi hơn + dễ đọc hơn. Mỗi ký tự thừa là cognitive cost.
→ **Why?** Vì React team đang dọn dẹp technical debt từ API design cũ để chuẩn bị cho React Compiler + Server Components.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Thay vì nói "Tôi gửi thư qua bưu điện trung ương chi nhánh Quận 1" (Context.Provider), bây giờ nói "Tôi gửi thư qua bưu điện Quận 1" (Context). Cùng kết quả, bớt chữ.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
  TRƯỚC React 19:                        SAU React 19:
  ─────────────────                      ─────────────────
  <ThemeContext.Provider value={theme}>   <ThemeContext value={theme}>
    <App />                                <App />
  </ThemeContext.Provider>               </ThemeContext>
```

**Các thay đổi nhỏ khác trong React 19:**

```
  ┌────────────────────────────────────────────────────────┐
  │  Thay đổi              │ Trước          │ Sau          │
  ├────────────────────────┼────────────────┼──────────────┤
  │  Context Provider      │ <Ctx.Provider> │ <Ctx>        │
  │  Document metadata     │ react-helmet   │ <title> etc  │
  │                        │                │ in component │
  │  Stylesheet priority   │ manual <link>  │ precedence   │
  │                        │                │ prop         │
  │  Async scripts         │ manual loading │ dedup by src │
  │  ref                   │ forwardRef()   │ ref as prop  │
  │  Error reporting       │ componentDid   │ onCaughtError│
  │                        │ Catch only     │ + onUncaught │
  └────────────────────────┴────────────────┴──────────────┘
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Context.Provider vẫn hoạt động:** Deprecated nhưng không bị xoá ngay. Codebase cũ an toàn.
- **Document metadata:** `<title>`, `<meta>`, `<link>` viết trong component tự hoist lên `<head>` — không cần thư viện ngoài.
- **Stylesheet `precedence`:** React quản lý thứ tự CSS — `precedence="default"` load trước `precedence="high"`.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                              | Tại sao sai                                          | Đúng là                                     |
| ---------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------- |
| Dùng react-helmet cho `<title>` trong React 19       | React 19 native hỗ trợ document metadata             | Dùng `<title>` trực tiếp trong component    |
| Quên `precedence` prop cho `<link rel="stylesheet">` | Không có precedence → React không quản lý thứ tự CSS | Thêm `precedence` để React dedup + ordering |
| Nghĩ tất cả thay đổi bắt buộc migrate ngay           | Deprecated ≠ removed — code cũ vẫn work              | Migrate dần, ưu tiên code mới dùng API mới  |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "React 19 breaking changes", "migration strategy"
- → Nhớ đến: Context simplification, metadata, ref, progressive migration
- → Mở đầu trả lời: _"React 19 có nhiều thay đổi nhỏ đều hướng tới đơn giản hoá API: Context dùng trực tiếp không cần .Provider, ref thành prop thường, native document metadata. Phần lớn là deprecation không phải breaking — migration dần được."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Context API](./05-state-management.md)
- ➡️ Để hiểu tiếp: [Server Components](./10-modern-react-features.md)

---

## Q&A Section / Câu Hỏi Phỏng Vấn

### Q1: React Compiler là gì và nó giải quyết vấn đề gì? / What is React Compiler and what problem does it solve? 🟢 Junior

**A:** React Compiler is a build-time tool (Babel plugin) that automatically adds memoization to your React code. It analyzes your components during build and inserts `useMemo`/`useCallback` equivalents where needed, so developers don't have to manually optimize re-renders.

React Compiler là công cụ chạy lúc build (Babel plugin), tự động thêm memoization vào code React. Nó phân tích component và thêm cache ở những chỗ cần thiết — developer không cần tự viết `useMemo`/`useCallback`. Giống TypeScript tự check type, Compiler tự check performance.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Đề cập "build-time static analysis", "Babel plugin", so sánh với TypeScript
- ❌ Weak: Chỉ nói "nó tự optimize" mà không biết cơ chế (build vs runtime) hoặc limitations

---

### Q2: Actions pattern giải quyết gì? Kể tên 3 hooks liên quan. / What does the Actions pattern solve? Name the 3 related hooks. 🟢 Junior

**A:** Actions solve the boilerplate problem of managing async form submissions — pending state, error handling, and optimistic updates. The three hooks are: `useActionState` (manages form state + pending + error), `useFormStatus` (child component reads parent form status), and `useOptimistic` (shows result immediately before server confirms).

Actions giải quyết boilerplate khi submit form async — thay vì 4-5 useState để quản lý loading/error/optimistic, Actions tự lo lifecycle. Ba hooks: `useActionState` quản lý state tổng thể, `useFormStatus` cho child biết form đang pending, `useOptimistic` hiển thị kết quả giả trước khi server xác nhận.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Kể tên đúng 3 hooks, giải thích vai trò từng cái, biết `useFormStatus` phải ở child component
- ❌ Weak: Nhầm lẫn 3 hooks, không biết `useFormStatus` chỉ work trong child

---

### Q3: use() khác useEffect để đọc data async như thế nào? / How does use() differ from useEffect for reading async data? 🟡 Mid

**A:** `useEffect` runs after render — you need separate useState for data/loading/error, and the component renders multiple times (empty → loading → data). `use()` reads the Promise during render — it suspends (via Suspense) until the Promise resolves, then renders once with data. Key difference: `use()` is NOT a hook (not stored in the linked list), so it can be called conditionally. But it requires a stable Promise reference and a Suspense boundary.

`useEffect` chạy SAU render — cần thêm 3 useState (data, loading, error), component render nhiều lần. `use()` đọc Promise TRONG render — suspend cho đến khi resolve, render 1 lần với data. Khác biệt quan trọng: `use()` KHÔNG phải hook (không lưu trong linked list) nên dùng trong if/else được. Nhưng bắt buộc Promise phải stable reference và có Suspense boundary.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích "not a hook", "throw to Suspense", "stable reference requirement"
- ❌ Weak: Chỉ nói "use() tiện hơn useEffect" mà không biết cơ chế Suspense hay stable reference

---

### Q4: forwardRef bị deprecated trong React 19 — thay đổi thế nào? / forwardRef is deprecated in React 19 — what changed? 🟡 Mid

**A:** In React 19, `ref` becomes a regular prop — no wrapper needed. Instead of `forwardRef((props, ref) => ...)`, you write `function Input({ ref, ...props })`. Additionally, ref callbacks can now return a cleanup function (like useEffect cleanup), enabling co-located setup/teardown for observers and listeners.

Trong React 19, `ref` trở thành prop bình thường — không cần forwardRef wrapper. Viết `function Input({ ref, ...props })` trực tiếp. Thêm vào đó, ref callback giờ return được cleanup function (giống useEffect), cho phép gắn observer và cleanup ngay cùng chỗ — không cần useEffect riêng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Biết cả 2 thay đổi (ref as prop + ref cleanup), cho ví dụ IntersectionObserver
- ❌ Weak: Chỉ biết forwardRef deprecated mà không biết alternative hoặc ref cleanup

---

### Q5: So sánh cách tiếp cận memoization thủ công vs React Compiler. Khi nào Compiler không giúp được? / Compare manual memoization vs React Compiler. When does the Compiler fall short? 🟡 Mid

**A:** Manual memoization (useMemo/useCallback/memo) requires developers to correctly identify expensive computations and specify dependency arrays — error-prone and often either over-applied or under-applied. React Compiler automates this through build-time static analysis. However, the Compiler falls short when: (1) code violates Rules of React (mutations, side effects in render) — Compiler silently skips, (2) re-renders caused by Context propagation — Compiler doesn't split contexts, (3) dynamic patterns the static analyzer can't reason about.

Memoization thủ công yêu cầu dev tự xác định computation nào đắt và deps đúng — dễ sai, thường thêm quá nhiều hoặc quá ít. React Compiler tự động hoá qua static analysis lúc build. Nhưng Compiler không giúp khi: (1) code vi phạm Rules of React (mutation, side-effect trong render) — Compiler im lặng skip, (2) re-render do Context propagation — Compiler không split context giùm, (3) pattern dynamic mà static analysis không phân tích được.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu được 2-3 limitations cụ thể, hiểu Compiler là "best-effort" không phải "magic"
- ❌ Weak: Nghĩ Compiler fix tất cả performance problem hoặc không biết limitation

---

### Q6: Thiết kế migration strategy từ React 18 lên React 19 cho production app. Rủi ro chính là gì? / Design a migration strategy from React 18 to React 19 for a production app. What are the key risks? 🔴 Senior

**A:** Migration strategy follows a phased approach:

**Phase 1 — Audit:** Run `react-compiler-healthcheck` to identify code that violates Rules of React. Run ESLint plugin to audit per-file. Estimate percentage of code that Compiler can optimize.

**Phase 2 — Enable Compiler incrementally:** Configure Babel plugin to target only new/clean directories first. Monitor bundle size and runtime performance via Core Web Vitals. Gradually expand scope.

**Phase 3 — Migrate API surface:** Replace `forwardRef` with ref-as-prop in new components. Replace `Context.Provider` with `Context` in new code. Adopt Actions pattern for new forms (keep existing useState forms working).

**Phase 4 — Adopt use() cautiously:** Only for new data fetching patterns with Suspense boundaries. Don't replace working useEffect patterns that have caching (React Query etc).

**Key risks:**

- Compiler silently skipping code that violates Rules → performance regression appears "random"
- useFormStatus only works in child components → existing form architectures may need refactoring
- use() requires stable Promise references → easy to cause infinite loops if not careful
- Third-party libraries may not be Compiler-compatible

Chiến lược migration theo phase: (1) Audit code quality bằng healthcheck + ESLint, (2) Bật Compiler cho từng folder mới, (3) Migrate API (forwardRef → ref prop, Context.Provider → Context), (4) Adopt use() cho data fetching mới.

Rủi ro: Compiler skip code sai im lặng, useFormStatus đòi refactor form architecture, use() dễ infinite loop nếu Promise không stable, third-party lib chưa compatible.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Phased approach, mention healthcheck tool, identify silent skip risk, discuss rollback plan
- ❌ Weak: "Upgrade package version and test" — no strategy, no risk assessment

**🔴 Follow-up Chain:**

1. "Bạn sẽ measure thế nào để biết Compiler thực sự improve performance?" → Core Web Vitals (INP, LCP), React Profiler before/after, bundle size comparison, synthetic benchmarks on heavy components
2. "Nếu third-party library không compatible với Compiler, bạn xử lý sao?" → `"use no memo"` directive trên wrapper component, hoặc exclude file/folder qua Babel config `sources` filter
3. "Actions pattern có thay thế hoàn toàn Redux form handling không?" → Actions handle individual form lifecycle, Redux handles cross-component shared state — different concerns. Actions cho local form state, Redux/Zustand cho global state coordination

---

### Q7: use() cần stable reference — thiết kế cache layer cho use() trong production. / use() needs stable references — design a cache layer for use() in production. 🔴 Senior

**A:** The core problem: `use(fetch('/api/user'))` creates a new Promise every render → infinite suspend loop. We need a cache that returns the same Promise for the same key.

```tsx
// Simple cache implementation
const cache = new Map<string, Promise<any>>();

function cachedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  if (!cache.has(key)) {
    cache.set(key, fetcher());
  }
  return cache.get(key)!;
}

// Usage
function UserProfile({ userId }) {
  const user = use(cachedFetch(`user-${userId}`, () => fetchUser(userId)));
  return <h1>{user.name}</h1>;
}
```

**Production considerations:**

- **Cache invalidation:** TTL-based expiry, or manual invalidation on mutation
- **Memory:** WeakMap hoặc LRU cache để tránh memory leak
- **Dedup:** Nếu 2 component cùng fetch user-1 cùng lúc, chỉ 1 request
- **React.cache() (RSC):** Server Components có built-in `cache()` — per-request dedup
- **Real-world:** React Query/SWR already solve this — `use()` là low-level primitive

Vấn đề cốt lõi: `use(fetch(...))` tạo Promise mới mỗi render → vòng lặp vô hạn. Cần cache layer trả cùng Promise cho cùng key. Production cần: TTL, memory management (LRU/WeakMap), request dedup. Thực tế React Query/SWR đã giải quyết — `use()` là primitive, không phải solution hoàn chỉnh.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích tại sao cần stable reference (infinite loop), thiết kế cache với invalidation + dedup, biết React.cache() cho RSC
- ❌ Weak: Chỉ biết "cần stable reference" mà không thiết kế được cache hoặc không biết React Query vẫn cần

**🔴 Follow-up Chain:**

1. "Cache invalidation strategy nào phù hợp với use()?" → TTL cho read-heavy data, mutation-based invalidation cho write-heavy, stale-while-revalidate cho hybrid
2. "So sánh cache layer tự viết vs React Query với use()." → React Query có retry, refetch-on-focus, garbage collection, devtools — tự viết chỉ nên cho simple cases hoặc khi bundle size critical
3. "Trong SSR/RSC context, caching thay đổi thế nào?" → Server: per-request cache (React.cache()), Client: across-requests cache (React Query). Không share cache giữa requests trên server (data isolation).

---

### Q8: Đánh giá trade-off giữa React 19 Actions vs React Hook Form + React Query cho form handling. / Evaluate trade-offs between React 19 Actions vs React Hook Form + React Query for form handling. 🔴 Senior

**A:** This is a architectural comparison between built-in vs ecosystem solutions:

| Tiêu chí           | React 19 Actions             | RHF + React Query                        |
| ------------------ | ---------------------------- | ---------------------------------------- |
| **Bundle size**    | 0 extra (built-in)           | +20-30KB                                 |
| **Learning curve** | New API but small surface    | Established patterns, large docs         |
| **Validation**     | Manual or Zod                | Built-in validation, Zod/Yup integration |
| **Caching**        | None built-in                | Full cache + dedup + retry               |
| **Optimistic**     | `useOptimistic` (basic)      | `useMutation` + `onMutate` (advanced)    |
| **Form state**     | Per-field state in component | Uncontrolled with ref-based perf         |
| **SSR/RSC**        | Native "use server" Actions  | Client-only                              |
| **Ecosystem**      | New, evolving                | Mature, well-tested                      |

**Recommendation:**

- **Small app / new project with RSC:** React 19 Actions — simpler, no extra deps, progressive enhancement
- **Complex forms (multi-step, validation-heavy):** React Hook Form — field-level validation, touched/dirty tracking
- **Data-heavy app (cache, retry, pagination):** React Query + whatever form lib — caching layer is critical
- **Hybrid:** Actions for simple forms, RHF for complex forms, React Query for data fetching — they're not mutually exclusive

Trade-off không phải "chọn 1 bỏ 1" — Actions cho form simple + RSC, RHF cho form phức tạp, React Query cho caching layer. Chúng bổ sung nhau, không thay thế nhau.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Comparison table với tiêu chí cụ thể, recommendation theo use case, biết chúng bổ sung nhau
- ❌ Weak: "Actions thay thế React Hook Form" hoặc "React Hook Form vẫn tốt hơn" — binary thinking

**🔴 Follow-up Chain:**

1. "Trong monorepo có cả RSC và client-heavy pages, bạn chọn thế nào?" → RSC pages dùng Server Actions + useActionState, client pages dùng RHF + React Query. Shared validation schema (Zod) giữa cả hai.
2. "Progressive enhancement quan trọng không?" → Nếu app cần work without JS (accessibility, slow networks), Actions + form action= là lợi thế lớn. RHF client-only không progressive enhance.
3. "Performance comparison cho form với 50+ fields?" → RHF uncontrolled approach wins — chỉ ref, không re-render. Actions re-render toàn form mỗi keystroke nếu không optimize. Nhưng React Compiler có thể bridge gap này.

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| #   | Question                  | Level | Key Point                                                                  |
| --- | ------------------------- | ----- | -------------------------------------------------------------------------- |
| Q1  | React Compiler là gì?     | 🟢    | Build-time Babel plugin, auto-memoization, static analysis                 |
| Q2  | Actions pattern + 3 hooks | 🟢    | useActionState + useFormStatus + useOptimistic, managed async lifecycle    |
| Q3  | use() vs useEffect        | 🟡    | Not a hook, reads in render, throws to Suspense, stable reference required |
| Q4  | forwardRef deprecated     | 🟡    | ref as prop + ref cleanup function                                         |
| Q5  | Manual memo vs Compiler   | 🟡    | Compiler is best-effort, silent skip, no Context fix                       |
| Q6  | Migration strategy 18→19  | 🔴    | Phased: audit → incremental Compiler → API migrate → use() cautious        |
| Q7  | Cache layer cho use()     | 🔴    | Stable ref problem, cache + dedup + invalidation, React Query still useful |
| Q8  | Actions vs RHF + RQ       | 🔴    | Complementary not competing, choose by use case (RSC vs complex forms)     |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"React 19 có gì mới? Nếu bạn phải upgrade production app, bạn bắt đầu từ đâu?"**

**30 giây đầu — mở đầu lý tưởng / Ideal 30-second opening:**

1. "React 19 có 3 thay đổi chính: React Compiler tự thêm memoization lúc build, Actions pattern quản lý form async lifecycle, và use() API đọc Promise trong render."
2. "Compiler hoạt động như TypeScript — static analysis lúc build, không thay đổi runtime behavior, nhưng tự insert useMemo/useCallback."
3. "Ở production app trước đây, tôi sẽ bắt đầu bằng chạy react-compiler-healthcheck để audit code quality, sau đó bật Compiler cho folder mới trước, mở rộng dần."
4. "Rủi ro chính là Compiler im lặng skip code vi phạm Rules of React — cần monitor Core Web Vitals trước và sau khi bật."

_Sau đó mở rộng theo hướng interviewer dẫn dắt._

---

## Self-Check / Tự Kiểm Tra ⚡

> **Đóng tài liệu lại trước khi làm — Close the doc before attempting.**

- [ ] **Retrieval**: Viết 3 thay đổi chính của React 19 từ trí nhớ, mỗi cái 2 câu. So sánh với Overview.
- [ ] **Visual**: Vẽ Actions flow diagram (user click → optimistic → server → success/error) ra giấy. So sánh với ASCII diagram trên.
- [ ] **Application**: Form đăng ký có validation + optimistic update — bạn dùng `useState + try/catch` hay Actions? Viết code skeleton cho cách bạn chọn.
- [ ] **Debug**: `use(fetch('/api/user'))` gây infinite loop — nguyên nhân? Fix? Viết cache function đơn giản.
- [ ] **Teach**: Giải thích React Compiler cho người không biết lập trình bằng liên tưởng "xe số sàn vs số tự động".

💬 **Feynman Prompt:** Giải thích Actions pattern cho người không biết lập trình, dùng liên tưởng "bưu điện tự động". Không dùng thuật ngữ kỹ thuật.

🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày → 7 ngày → 14 ngày** để chuyển vào long-term memory.

---

## Connections / Liên Kết

- ⬅️ **Built on:** [React Fundamentals](./01-react-fundamentals.md) — cần hiểu VDOM, reconciliation, component model trước khi hiểu Compiler optimize gì
- ➡️ **Enables:** [Hooks Deep Dive](./03-hooks-deep-dive.md) — hiểu hook nào Compiler thay thế, hook nào vẫn cần viết tay
- ➡️ **Enables:** [Modern React Features](./10-modern-react-features.md) — Server Components + Streaming SSR tận dụng Actions + use()
- 🔗 **Applied in:** Next.js 14+ (Server Actions), Remix (form actions), production React 19 apps
