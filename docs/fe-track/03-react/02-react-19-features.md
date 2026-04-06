# React 19 New Features / Tính Năng Mới Của React 19

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **Prerequisites**: [React Fundamentals](./01-react-fundamentals.md)
> **See also**: [Hooks Deep Dive](./03-hooks-deep-dive.md) | [Modern React Features](./10-modern-react-features.md)
> **L5 Competencies**: System Design, Architecture Decision, Migration Strategy

---

## Real-World Scenario / Tình Huống Thực Tế

You're maintaining a React 18 app. The codebase has hundreds of `useMemo`, `useCallback`, `React.memo` — everyone is afraid to remove them because "what if it gets slow?". Form submissions require manually managing `isLoading`, `error`, `optimisticData` — each form has 30 lines of boilerplate. Team lead asks: **"What's new in React 19? Should we upgrade? What are the migration risks?"**

Bạn đang maintain React 18 app. Codebase có hàng trăm `useMemo`, `useCallback`, `React.memo` — ai cũng sợ xóa vì "lỡ chậm thì sao?". Form submit phải tự quản lý `isLoading`, `error`, `optimisticData` bằng tay — mỗi form 30 dòng boilerplate. Team lead hỏi: **"React 19 có gì mới? Có nên upgrade không? Rủi ro migration là gì?"**

If you don't understand React 19, you can't answer that question — and more importantly, you're writing code in a way that React is phasing out.

Không hiểu React 19 thì không trả lời được — và quan trọng hơn, bạn đang viết code theo cách React sẽ loại bỏ dần.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Ví dụ:**

Think of React 18 as driving a manual car — you shift gears yourself (useMemo), press the clutch (useCallback), check mirrors manually (memo). React 19 is an automatic car — transmission shifts automatically (Compiler), driving assist (Actions), and built-in GPS (use() API). You still need to know how to drive, but the machine handles the boring parts.

Nghĩ React 18 như lái xe số sàn — tự sang số (useMemo), tự đạp côn (useCallback), tự kiểm tra gương (memo). React 19 là xe số tự động — hộp số tự chuyển (Compiler), hệ thống hỗ trợ (Actions), GPS tích hợp (use() API). Vẫn cần biết lái, nhưng máy lo phần nhàm chán.

| React 18 (Manual / Số sàn)                 | React 19 (Automatic / Số tự động)             |
| ------------------------------------------ | --------------------------------------------- |
| `useMemo(() => expensive, [deps])`         | Compiler auto-detects and memos               |
| Manually manage `loading/error/optimistic` | `useActionState` + `useOptimistic` handles it |
| `forwardRef(Component)`                    | `ref` is a regular prop                       |
| `useEffect` to read Promises               | `use(promise)` during render                  |
| `<Context.Provider value={}>`              | `<Context value={}>` directly                 |

**Why learn this? / Tại sao phải học?**

- Mid+ React interviews now **always ask about React 19** — especially Compiler and Actions. (Phỏng vấn React Mid+ bây giờ **luôn hỏi React 19**.)
- Understanding React 19 = understanding where React is headed → shows you're up-to-date. (Hiểu React 19 = hiểu hướng đi của React.)
- Migration strategy is a real System Design interview question. (Migration strategy là câu hỏi System Design thực tế.)

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
   Remove useMemo/      useActionState     Replace useEffect
   useCallback/memo      useFormStatus      fetch pattern
                         useOptimistic
              │                  │                   │
              └──────────────────┼───────────────────┘
                                 ▼
                    ┌────────────────────────┐
                    │  Other changes:        │
                    │  • ref as prop         │
                    │  • ref cleanup fn      │
                    │  • <Context> directly  │
                    └────────────────────────┘

Learning path / Lộ trình:
React Fundamentals → [YOU ARE HERE] → Hooks Deep Dive → State Management
```

---

## Overview / Tổng Quan

React 19 introduces three major categories of changes: the React Compiler (automatic memoization at build time), Actions (a managed async lifecycle for form submissions), and the `use()` API (reading async resources during render). Together with smaller changes like ref-as-prop and Context simplification, React 19 represents the biggest API shift since Hooks.

React 19 có 3 thay đổi lớn: Compiler tự memo hóa, Actions quản lý form async, và `use()` đọc Promise/Context trong render. Kèm theo nhiều thay đổi nhỏ đơn giản hóa API. Đây là bước nhảy lớn nhất kể từ khi Hooks ra đời.

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. React Compiler / Trình Biên Dịch React

> 🧠 **Memory Hook**: "React Compiler = TypeScript for performance — analyzes code at build time, auto-adds memo without dev writing it."
>
> **Móc nhớ**: "React Compiler = TypeScript cho performance — phân tích code lúc build, tự thêm memo mà dev không phải viết."

**Why does this exist? / Tại sao tồn tại?**

Developers must manually add `useMemo`, `useCallback`, `React.memo` to avoid unnecessary re-renders. But most devs add them wrong (missing deps, too many, or forget entirely).

Dev phải tự thêm `useMemo`, `useCallback`, `React.memo` để tránh re-render thừa. Nhưng phần lớn dev thêm sai (thiếu deps, quá nhiều, hoặc quên).

→ **Why?** Because humans are bad at tracking which dependencies change across renders — that's a job machines do better.

→ **Tại sao?** Vì con người không giỏi track dependency thay đổi qua nhiều render — đó là việc máy làm tốt hơn.

→ **Why?** Because React re-renders the entire subtree when state changes (Virtual DOM design decision) — memoization is a "band-aid" for that design.

→ **Tại sao?** Vì React re-render toàn bộ subtree khi state đổi — memoization là cách "chữa cháy" cho design đó.

#### Layer 1: Everyday Analogy / Tầng 1: Ví dụ đời thường

Imagine writing an essay by hand. Every time you fix one word, you must re-copy the entire essay (= React re-render). Before, you had to manually mark "this paragraph hasn't changed, don't re-copy" (= useMemo). React Compiler is like having a teacher who reads your essay and auto-marks for you: "paragraph 1 keep, paragraph 3 keep, only re-copy paragraph 2".

Hình dung viết bài luận bằng tay. Sửa 1 từ thì phải chép lại toàn bộ (= re-render). Trước phải tự đánh dấu "đoạn này không đổi, không cần chép" (= useMemo). Compiler giống thầy giáo đọc bài rồi tự đánh dấu giùm: "đoạn 1 giữ, đoạn 3 giữ, chỉ chép lại đoạn 2".

#### Layer 2: How It Works / Tầng 2: Cách hoạt động

React Compiler is a **Babel plugin** that runs at build time. It analyzes source code (static analysis) and auto-inserts memoization into the output.

React Compiler là **Babel plugin** chạy lúc build time. Phân tích source code (static analysis) và tự thêm memoization vào output.

```
  SOURCE CODE (you write)            COMPILED OUTPUT (Compiler creates)
  CODE BẠN VIẾT                      OUTPUT COMPILER TẠO
  ─────────────────────              ──────────────────────────────
  function Cart({ items }) {         function Cart({ items }) {
    const total =                      const total = useMemo(
      items.reduce(...)                  () => items.reduce(...),
                                         [items]
    return <div>{total}</div>          );
  }                                    return useMemo(
                                         () => <div>{total}</div>,
                                         [total]
                                       );
                                     }
```

**Compiler analysis pipeline / Quy trình phân tích:**

```
  ┌────────────────────────────────────────┐
  │        React Compiler Pipeline         │
  ├────────────────────────────────────────┤
  │  1. Parse AST (syntax tree)            │
  │           ▼                            │
  │  2. Analyze data flow                  │
  │     - Which vars depend on which?      │
  │     - Which values change between      │
  │       renders?                         │
  │           ▼                            │
  │  3. Find "stable regions"              │
  │     - Code that gives same output      │
  │       if input unchanged               │
  │           ▼                            │
  │  4. Wrap with memoization cache        │
  │     - Auto-insert useMemo/useCallback  │
  │       into compiled output             │
  └────────────────────────────────────────┘
```

**Incremental adoption / Áp dụng dần:**

```js
// babel.config.js — only apply to one folder / chỉ áp dụng cho 1 folder
module.exports = {
  plugins: [
    [
      "babel-plugin-react-compiler",
      {
        sources: (filename) => filename.includes("src/components/new/"),
      },
    ],
  ],
};
```

**Audit before enabling / Kiểm tra trước khi bật:**

```bash
npx react-compiler-healthcheck   # scan codebase
npx eslint-plugin-react-compiler # audit per file / audit từng file
```

#### Layer 3: Edge Cases / Tầng 3: Trường hợp đặc biệt

- **Can't compile:** Code that violates Rules of React (mutates state directly, side effects in render). Compiler **silently skips** that file. (Code vi phạm Rules of React → Compiler im lặng skip.)
- **Opt-out directive:** Add `"use no memo"` at the top of a function to make Compiler skip it. (Thêm `"use no memo"` để Compiler bỏ qua.)
- **Doesn't fix everything:** Compiler handles render logic, but **doesn't fix** re-renders from Context (still need context splitting). (Compiler xử lý render, nhưng KHÔNG fix re-render do Context.)
- **Build time increases:** Adds one step to build pipeline — benchmark before deploying. (Build time tăng — đo benchmark trước.)

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                        | Why wrong / Tại sao sai                                            | Correct / Đúng là                                                    |
| ---------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| "Compiler completely replaces useMemo"   | Compiler skips code violating Rules of React                       | Compiler is best-effort — clean code first, Compiler optimizes after |
| "Enable Compiler = app instantly faster" | If code has mutation/side-effects, Compiler skips                  | Audit code quality first with ESLint plugin                          |
| "Delete all memo when using Compiler"    | If Compiler skips a file, that memo is gone                        | Keep old memo — Compiler detects and won't add duplicates            |
| "Compiler fixes re-render problems"      | Compiler only memos render output, doesn't fix Context propagation | Still need context splitting / state colocation                      |

**🎯 Interview Pattern / Nhận dạng câu hỏi:**

- Trigger: "React Compiler", "auto-memoization", "future of useMemo"
- Think of: Build-time static analysis, Babel plugin, incremental adoption
- Opening:
  - 🇬🇧 _"React Compiler analyzes code at build time and auto-inserts memoization — like TypeScript analyzes types. It doesn't replace developer thinking, it automates the mechanical part. Adopted incrementally via Babel plugin config."_
  - 🇻🇳 _"React Compiler phân tích code lúc build và tự thêm memoization — giống TypeScript phân tích type. Không thay thế suy nghĩ của dev, mà automate phần mechanical. Áp dụng dần qua Babel plugin config."_

**🔑 Knowledge Chain / Chuỗi kiến thức:**

- 📚 Prerequisite: [useMemo/useCallback](./03-hooks-deep-dive.md), [Virtual DOM](./01-react-fundamentals.md)
- ➡️ Next: [Performance Optimization](./09-performance-optimization.md)

---

### 2. Actions Pattern / Mô Hình Actions

> 🧠 **Memory Hook**: "Actions = React manages async lifecycle for you — `pending → success/error` automatically, no manual useState."
>
> **Móc nhớ**: "Actions = React quản lý vòng đời async cho bạn — `pending → success/error` tự động, không cần useState thủ công."

**Why does this exist? / Tại sao tồn tại?**

Every form submission needs: loading state, error state, optimistic update, form reset. Devs write 4-5 useState + try/catch per form — repetitive boilerplate.

Mỗi form submit cần: loading, error, optimistic update, form reset. Dev phải viết 4-5 useState + try/catch mỗi form — boilerplate lặp lại.

→ **Why?** Async operations have complex lifecycle (pending/success/error/retry) that simple useState can't model well.

→ **Tại sao?** Async operation có lifecycle phức tạp (pending/success/error/retry) mà useState đơn giản không model được.

→ **Why?** Before v19, React only provided primitives (useState/useEffect) — devs had to compose lifecycle from scratch. Actions raise the abstraction level.

→ **Tại sao?** Trước v19, React chỉ cung cấp primitive — dev tự compose lifecycle. Actions nâng abstraction level lên.

#### Layer 1: Everyday Analogy / Tầng 1: Ví dụ đời thường

Imagine sending a letter at the post office. Before React 19, you had to: (1) write "sending" on the board, (2) give the letter to the clerk, (3) wait, (4) if OK erase the board, if failed write error on the board. React 19 Actions = automated post office: just give the letter, the system auto-shows "processing", auto-reports results, auto-handles errors.

Hình dung gửi thư ở bưu điện. Trước React 19: (1) ghi "đang gửi", (2) đưa thư, (3) đợi, (4) OK thì xóa, thất bại thì ghi lỗi. React 19 Actions = bưu điện tự động: đưa thư thôi, hệ thống tự hiện "đang xử lý", tự thông báo kết quả, tự xử lý lỗi.

#### Layer 2: How It Works / Tầng 2: Cách hoạt động

Actions consist of 3 coordinating hooks / Actions gồm 3 hooks phối hợp:

```
  ┌─────────────────────────────────────────────────────────┐
  │                    ACTIONS TRIO                          │
  ├─────────────────────────────────────────────────────────┤
  │                                                         │
  │  useActionState(action, initialState)                   │
  │  ├── Manages: state + pending + error                   │
  │  ├── Input: async function (prevState, formData)        │
  │  └── Output: [state, formAction, isPending]             │
  │                                                         │
  │  useFormStatus()                                        │
  │  ├── Used in: child component of <form>                 │
  │  ├── Knows: pending status of parent form               │
  │  └── Output: { pending, data, method, action }          │
  │                                                         │
  │  useOptimistic(state, updateFn)                         │
  │  ├── Shows: fake result before server confirms          │
  │  ├── Auto-rollback: if server returns error             │
  │  └── Output: [optimisticState, addOptimistic]           │
  │                                                         │
  └─────────────────────────────────────────────────────────┘
```

**Flow / Luồng hoạt động:**

```
  User clicks Submit
       │
       ▼
  ┌──────────────┐    ┌──────────────────┐    ┌────────────────┐
  │ useOptimistic│───▶│ useActionState   │───▶│ Server/API     │
  │ show result  │    │ isPending = true │    │ process data   │
  │ immediately  │    │                  │    │                │
  └──────────────┘    └──────────────────┘    └───────┬────────┘
                                                      │
                              ┌────────────────────────┤
                              ▼                        ▼
                      ┌──────────────┐        ┌──────────────┐
                      │   Success    │        │    Error     │
                      │ state update │        │ rollback     │
                      │ isPending =  │        │ optimistic   │
                      │ false        │        │ show error   │
                      └──────────────┘        └──────────────┘
```

**Complete code example / Ví dụ code đầy đủ:**

```tsx
// ---- Action function (can be in separate file) ----
// ---- Hàm action (có thể tách file riêng) ----
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
  // useActionState manages entire lifecycle
  // useActionState quản lý toàn bộ lifecycle
  const [state, formAction, isPending] = useActionState(updateName, {
    name: currentName,
    error: null,
  });

  // useOptimistic shows result immediately
  // useOptimistic hiện kết quả ngay lập tức
  const [optimisticName, setOptimisticName] = useOptimistic(
    state.name,
    (current, newName) => newName,
  );

  return (
    <form
      action={async (formData) => {
        setOptimisticName(formData.get("name")); // UI updates instantly
        await formAction(formData); // send to server
      }}
    >
      <p>Current: {optimisticName}</p>
      <input name="name" disabled={isPending} />
      {state.error && <p style={{ color: "red" }}>{state.error}</p>}
      <SubmitButton />
    </form>
  );
}

// ---- Submit Button uses useFormStatus ----
function SubmitButton() {
  const { pending } = useFormStatus(); // auto-knows parent form status
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </button>
  );
}
```

#### Layer 3: Edge Cases / Tầng 3: Trường hợp đặc biệt

- **useFormStatus only works in child components:** Must be a child inside `<form>`. Using it in the same component as the form won't work. (Phải là component con bên trong `<form>`. Dùng cùng component với form sẽ không work.)
- **Action function receives `prevState`:** Different from regular event handlers — state is the return value of the previous call, like useReducer. (Action nhận `prevState` — khác event handler thường.)
- **Optimistic auto-rollback:** `useOptimistic` automatically rolls back when the action function completes (success or error). No manual reset needed. (`useOptimistic` tự rollback khi action hoàn tất.)
- **Server Actions (Next.js):** `"use server"` directive turns a function into an API endpoint — Actions pattern works both client and server. (Server Actions biến function thành API endpoint.)
- **Progressive Enhancement:** `<form action={formAction}>` works even without JavaScript loaded — HTML form submits normally. (Hoạt động ngay cả khi JS chưa load.)

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                               | Why wrong / Tại sao sai                                         | Correct / Đúng là                                             |
| ----------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------- |
| `useFormStatus` in same component as `<form>`   | Hook needs context from parent form — same level has no context | Extract `<SubmitButton>` to a separate component              |
| Forget to return new state from action function | `useActionState` uses return value as new state                 | Always return `{ data, error }` object                        |
| `useState` + `try/catch` instead of Actions     | More boilerplate, no auto pending/optimistic                    | Use `useActionState` for forms, `useState` for non-form state |
| Call `setOptimistic` after `formAction`         | Optimistic must show BEFORE server responds                     | Call `setOptimistic` first, `formAction` second               |

**🎯 Interview Pattern / Nhận dạng câu hỏi:**

- Trigger: "form handling React 19", "useActionState", "optimistic updates"
- Think of: Actions trio (useActionState + useFormStatus + useOptimistic), managed async lifecycle
- Opening:
  - 🇬🇧 _"React 19 Actions manage the entire async lifecycle of form submissions: pending state, error handling, and optimistic updates — instead of devs composing from useState + try/catch. The three hooks coordinate: useActionState manages state, useFormStatus lets child components know the status, useOptimistic shows results before server confirms."_
  - 🇻🇳 _"React 19 Actions quản lý toàn bộ async lifecycle của form: pending, error, optimistic — thay vì dev tự compose từ useState + try/catch. Ba hooks phối hợp: useActionState quản lý state, useFormStatus cho child biết trạng thái, useOptimistic hiện kết quả trước khi server confirm."_

**🔑 Knowledge Chain / Chuỗi kiến thức:**

- 📚 Prerequisite: [useState/useReducer](./03-hooks-deep-dive.md)
- ➡️ Next: [State Management](./05-state-management.md), [Server Components](./10-modern-react-features.md)

---

### 3. use() API

> 🧠 **Memory Hook**: "use() = read async value during render — NOT a hook (doesn't follow Rules of Hooks), so you CAN use it inside if/else."
>
> **Móc nhớ**: "use() = đọc async value trong render — KHÔNG phải hook (không theo Rules of Hooks), nên dùng được trong if/else."

**Why does this exist? / Tại sao tồn tại?**

Before React 19, reading async data required `useEffect` + `useState` (3-state dance: loading/data/error). Or using libraries like React Query. There was no native way to "read a Promise during render".

Trước React 19, đọc data async phải dùng `useEffect` + `useState` (3-state: loading/data/error). Hoặc dùng thư viện như React Query. Không có cách native để "đọc Promise trong render".

→ **Why?** React render must be synchronous — Promises are async. Need a primitive to bridge these two worlds.

→ **Tại sao?** React render phải synchronous — Promise là async. Cần primitive nối 2 thế giới.

→ **Why?** Suspense (React 18) already had the ability to "pause render" — `use()` is the official API to trigger Suspense from component code.

→ **Tại sao?** Suspense (React 18) đã có thể "pause render" — `use()` là API chính thức để trigger Suspense từ component.

#### Layer 1: Everyday Analogy / Tầng 1: Ví dụ đời thường

Imagine reading a book and hitting a footnote: "see appendix page 200". You hold your finger on the current page (= Suspense holds render position), flip to page 200 (= `use()` waits for Promise), read it, then return. If the appendix isn't printed yet (= Promise pending), you see a note saying "printing..." (= fallback).

Hình dung đọc sách gặp footnote: "xem phụ lục trang 200". Giữ ngón tay ở trang hiện tại (= Suspense giữ vị trí), lật sang trang 200 (= `use()` đợi Promise), đọc xong quay lại. Nếu phụ lục chưa in (= pending), thấy tờ giấy "đang in..." (= fallback).

#### Layer 2: How It Works / Tầng 2: Cách hoạt động

```
  ┌──────────────────────────────────────────────────┐
  │              use() vs useEffect                   │
  ├──────────────────────────────────────────────────┤
  │                                                   │
  │  BEFORE (useEffect pattern):                      │
  │  TRƯỚC:                                           │
  │  ┌─────────────────────────────┐                  │
  │  │ function UserProfile({ id })│                  │
  │  │   const [user, setUser]     │  3 useState      │
  │  │   const [loading, setLoad]  │  + useEffect     │
  │  │   const [error, setError]   │  + cleanup       │
  │  │   useEffect(() => {         │  = 15+ lines     │
  │  │     fetch(...)              │  boilerplate     │
  │  │       .then(setUser)        │                  │
  │  │       .catch(setError)      │                  │
  │  │   }, [id])                  │                  │
  │  └─────────────────────────────┘                  │
  │                                                   │
  │  AFTER (use() + Suspense):                        │
  │  SAU:                                             │
  │  ┌─────────────────────────────┐                  │
  │  │ function UserProfile({ p }) │                  │
  │  │   const user = use(p);      │  1 line.        │
  │  │   return <div>{user.name}   │  Suspense       │
  │  │   </div>                    │  handles loading│
  │  └─────────────────────────────┘  ErrorBoundary  │
  │                                   handles error. │
  └──────────────────────────────────────────────────┘
```

**Internal mechanism / Cơ chế bên trong:**

```
  Component calls use(promise)
  Component gọi use(promise)
       │
       ├── Promise already resolved? / Đã resolve?
       │   └── YES → return value → render continues normally
       │
       ├── Promise still pending? / Đang pending?
       │   └── YES → throw promise → Suspense catches it
       │            → shows fallback / hiển thị fallback
       │            → when resolved, React retries render
       │
       └── Promise rejected? / Bị reject?
           └── YES → throw error → ErrorBoundary catches it
```

**Practical code / Code thực tế:**

```tsx
import { use, Suspense } from "react";

// IMPORTANT: Promise must be stable reference (created outside render)
// QUAN TRỌNG: Promise phải stable reference (tạo bên ngoài render)
// Wrong: use(fetch(...)) — creates new Promise every render → infinite loop
// Sai: use(fetch(...)) — tạo Promise mới mỗi render → vòng lặp vô hạn
function UserProfile({ userPromise }) {
  const user = use(userPromise); // read directly during render
  return <h1>{user.name}</h1>;
}

// Can use inside conditional! (not a hook)
// Dùng được trong if! (không phải hook)
function MaybeUser({ userPromise, showProfile }) {
  if (!showProfile) return <p>Hidden</p>;
  const user = use(userPromise); // OK inside if block!
  return <h1>{user.name}</h1>;
}

// use() also reads Context / use() cũng đọc được Context:
function ThemeButton({ showTheme }) {
  if (!showTheme) return null;
  const theme = use(ThemeContext); // OK! useContext can't do this
  return <button className={theme}>Click</button>;
}

// Suspense + ErrorBoundary wrap outside
function App() {
  const userPromise = fetchUser(1); // create once, pass down
  return (
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <Suspense fallback={<p>Loading...</p>}>
        <UserProfile userPromise={userPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}
```

#### Layer 3: Edge Cases / Tầng 3: Trường hợp đặc biệt

- **Stable reference required:** `use(fetch('/api'))` creates a new Promise every render → infinite loop. Promise must come from props, cache, or module scope. (Promise phải từ prop, cache, hoặc module scope.)
- **Not a hook:** `use()` isn't stored in the linked list → OK in if/loop. But still only callable in React components/hooks. (Không lưu trong linked list → dùng trong if/loop OK.)
- **Requires Suspense boundary:** Without Suspense wrapping, a pending Promise will throw to ErrorBoundary or crash. (Không có Suspense → crash.)
- **Streaming SSR:** `use()` + Suspense enables streaming HTML from server — ready components send first. (`use()` + Suspense cho stream HTML từ server.)
- **React Query is still useful:** `use()` is just a primitive — no cache invalidation, retry, refetch on focus. (React Query vẫn hữu ích — `use()` chỉ là primitive.)

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                               | Why wrong / Tại sao sai                                        | Correct / Đúng là                                                      |
| ----------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `use(fetch('/api/user'))` inside render         | Creates new Promise every render → infinite suspend loop       | Promise must be stable: from prop, useMemo, or cache outside component |
| "use() replaces React Query"                    | `use()` is a primitive, no cache/retry/refetch                 | `use()` for simple cases, React Query for complex data fetching        |
| Calling `use()` without Suspense                | Pending Promise throws out → crash or ErrorBoundary catches it | Always wrap use() components in `<Suspense>`                           |
| "use() is a hook so must follow Rules of Hooks" | `use()` is NOT a hook — not stored in linked list              | Can use inside if/for/early return                                     |

**🎯 Interview Pattern / Nhận dạng câu hỏi:**

- Trigger: "use() API", "reading Promise during render", "Suspense data fetching"
- Think of: Not a hook, stable reference needed, throw-to-Suspense mechanism
- Opening:
  - 🇬🇧 _"use() is React 19's new API for reading async values directly during render — unlike hooks, it's not stored in the linked list, so it can be called conditionally. It throws pending Promises to Suspense boundaries and errors to ErrorBoundaries. Most importantly: the Promise must be a stable reference."_
  - 🇻🇳 _"use() là API mới React 19, đọc async value trực tiếp trong render — khác hook vì không lưu trong linked list, nên dùng trong if/else được. Throw Promise pending lên Suspense, throw error lên ErrorBoundary. Quan trọng nhất: Promise phải stable reference."_

**🔑 Knowledge Chain / Chuỗi kiến thức:**

- 📚 Prerequisite: [Suspense](./10-modern-react-features.md), [useEffect](./03-hooks-deep-dive.md)
- ➡️ Next: [Server Components & Streaming](./10-modern-react-features.md)

---

### 4. Ref Changes / Thay Đổi Về Ref

> 🧠 **Memory Hook**: "React 19: ref is a regular prop — forwardRef removed, ref has cleanup like useEffect."
>
> **Móc nhớ**: "React 19: ref là prop bình thường — forwardRef xóa, ref có cleanup như useEffect."

**Why does this exist? / Tại sao tồn tại?**

`forwardRef` is a verbose wrapper — each component just to pass ref needs an extra HOC layer. And ref had no cleanup function — when component unmounts, devs had to clean up in a separate useEffect.

`forwardRef` là wrapper dài dòng — mỗi component chỉ để truyền ref phải bọc thêm 1 lớp. Và ref không có cleanup — khi unmount, phải dọn dẹp trong useEffect riêng.

→ **Why?** Originally ref was designed as a "special escape hatch", not a regular prop. But in practice ref is used very commonly → needs simplification.

→ **Tại sao?** Ban đầu ref được thiết kế là "cửa thoát hiểm" đặc biệt. Nhưng thực tế ref dùng rất phổ biến → cần đơn giản hóa.

#### Layer 1: Everyday Analogy / Tầng 1: Ví dụ đời thường

Before React 19, to give a key (ref) to the house inside (child component), you had to go through an intermediary (forwardRef wrapper). Now you hand it directly — the key is a normal item, no special handling needed.

Trước React 19, muốn đưa chìa khóa (ref) cho nhà bên trong (child), phải qua trung gian (forwardRef). Giờ đưa thẳng — chìa khóa là đồ bình thường, không cần xử lý đặc biệt.

#### Layer 2: How It Works / Tầng 2: Cách hoạt động

```
  BEFORE React 19:                       AFTER React 19:
  TRƯỚC:                                 SAU:
  ─────────────────                      ─────────────────
  // Must use forwardRef                 // ref is regular prop
  const Input = forwardRef(              function Input({ ref, ...props }) {
    (props, ref) => {                      return <input ref={ref} {...props} />;
      return <input ref={ref}            }
        {...props} />;
    }
  );
```

**Ref cleanup function (new) / Ref cleanup (mới):**

```
  BEFORE: ref callback has no cleanup
  TRƯỚC: ref callback không có cleanup
  ──────────────────────────────────────
  <div ref={(node) => {
    observer.observe(node);
    // NO WAY TO CLEANUP! / KHÔNG CÓ CÁCH CLEANUP!
    // need separate useEffect / phải dùng useEffect riêng
  }} />

  AFTER: ref callback returns cleanup function
  SAU: ref callback return cleanup function
  ──────────────────────────────────────
  <div ref={(node) => {
    observer.observe(node);
    return () => observer.disconnect(); // cleanup!
  }} />
```

**Practical example — IntersectionObserver with ref cleanup:**

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
        return () => observer.disconnect(); // auto-cleanup on unmount
      }}
    />
  );
}
```

#### Layer 3: Edge Cases / Tầng 3: Trường hợp đặc biệt

- **forwardRef still works:** Not removed, just deprecated. Old codebases still run fine. (forwardRef vẫn hoạt động — deprecated nhưng không bị xóa.)
- **Ref cleanup timing:** Cleanup runs when component unmounts OR when ref callback changes (like useEffect cleanup). (Cleanup chạy khi unmount HOẶC khi ref callback thay đổi.)
- **TypeScript:** `ref` prop type auto-infers — no need for `ForwardedRef<T>` anymore. (TypeScript tự infer type — không cần `ForwardedRef<T>`.)

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                              | Why wrong / Tại sao sai                             | Correct / Đúng là                                       |
| ---------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| Still using forwardRef for new components      | forwardRef is deprecated in React 19                | Accept `ref` as a regular prop                          |
| Not returning cleanup from ref callback        | Observer/listener leaks when unmounting             | Always return cleanup if ref has side-effects           |
| Removing all forwardRef immediately on upgrade | Migration should be gradual, forwardRef still works | Keep forwardRef for old code, new code uses ref-as-prop |

**🎯 Interview Pattern / Nhận dạng câu hỏi:**

- Trigger: "forwardRef deprecated", "ref changes React 19"
- Opening:
  - 🇬🇧 _"React 19 makes ref a regular prop — no forwardRef wrapper needed. Additionally, ref callbacks can now return cleanup functions, like useEffect, enabling co-located setup/teardown for observers and listeners."_
  - 🇻🇳 _"React 19 biến ref thành prop bình thường — không cần forwardRef. Thêm vào đó, ref callback return được cleanup function giống useEffect, giúp gắn observer và cleanup ngay cùng chỗ."_

**🔑 Knowledge Chain / Chuỗi kiến thức:**

- 📚 Prerequisite: [useRef](./03-hooks-deep-dive.md)
- ➡️ Next: [Advanced Patterns](./04-advanced-patterns.md)

---

### 5. Context Simplification & Other Changes / Context Đơn Giản Hóa & Thay Đổi Khác

> 🧠 **Memory Hook**: "React 19: `<Context>` directly replaces `<Context.Provider>` — one less nesting level."
>
> **Móc nhớ**: "React 19: `<Context>` trực tiếp thay `<Context.Provider>` — bớt 1 tầng nesting."

**Why does this exist? / Tại sao tồn tại?**

`<ThemeContext.Provider value={theme}>` is verbose — `.Provider` is an unnecessary implementation detail. React 19 allows `<ThemeContext value={theme}>` directly.

`<ThemeContext.Provider value={theme}>` dài dòng — `.Provider` là chi tiết không cần thiết. React 19 cho `<ThemeContext value={theme}>` trực tiếp.

→ **Why?** Simpler API = fewer mistakes + easier to read. Every unnecessary character is cognitive cost.

→ **Tại sao?** API đơn giản hơn = ít lỗi hơn + dễ đọc hơn. Mỗi ký tự thừa là cognitive cost.

#### Layer 2: How It Works / Tầng 2: Cách hoạt động

```
  BEFORE React 19:                        AFTER React 19:
  TRƯỚC:                                  SAU:
  ─────────────────                       ─────────────────
  <ThemeContext.Provider value={theme}>    <ThemeContext value={theme}>
    <App />                                 <App />
  </ThemeContext.Provider>                </ThemeContext>
```

**Other small changes in React 19 / Các thay đổi nhỏ khác:**

| Change / Thay đổi   | Before / Trước      | After / Sau                    |
| ------------------- | ------------------- | ------------------------------ |
| Context Provider    | `<Ctx.Provider>`    | `<Ctx>`                        |
| Document metadata   | react-helmet        | `<title>` in component         |
| Stylesheet priority | manual `<link>`     | `precedence` prop              |
| Async scripts       | manual loading      | dedup by src                   |
| ref                 | `forwardRef()`      | ref as prop                    |
| Error reporting     | `componentDidCatch` | `onCaughtError` + `onUncaught` |

#### Layer 3: Edge Cases / Tầng 3: Trường hợp đặc biệt

- **Context.Provider still works:** Deprecated but not removed. Old codebases are safe. (Deprecated nhưng không bị xóa. Code cũ an toàn.)
- **Document metadata:** `<title>`, `<meta>`, `<link>` written in components auto-hoist to `<head>` — no external library needed. (`<title>`, `<meta>` viết trong component tự hoist lên `<head>`.)
- **Stylesheet `precedence`:** React manages CSS order — `precedence="default"` loads before `precedence="high"`. (React quản lý thứ tự CSS.)

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                     | Why wrong / Tại sao sai                       | Correct / Đúng là                           |
| ----------------------------------------------------- | --------------------------------------------- | ------------------------------------------- |
| Using react-helmet for `<title>` in React 19          | React 19 natively supports document metadata  | Use `<title>` directly in component         |
| Forgetting `precedence` for `<link rel="stylesheet">` | Without it, React doesn't manage CSS ordering | Add `precedence` for React dedup + ordering |
| Thinking all changes require immediate migration      | Deprecated ≠ removed — old code still works   | Migrate gradually, new code uses new API    |

**🎯 Interview Pattern / Nhận dạng câu hỏi:**

- Trigger: "React 19 breaking changes", "migration strategy"
- Opening:
  - 🇬🇧 _"React 19 has many small changes all aimed at API simplification: Context used directly without .Provider, ref as a regular prop, native document metadata. Most are deprecations not breaking changes — gradual migration is possible."_
  - 🇻🇳 _"React 19 có nhiều thay đổi nhỏ đều hướng tới đơn giản hóa API: Context dùng trực tiếp không cần .Provider, ref thành prop thường, native document metadata. Phần lớn là deprecation không phải breaking — migrate dần được."_

**🔑 Knowledge Chain / Chuỗi kiến thức:**

- 📚 Prerequisite: [Context API](./05-state-management.md)
- ➡️ Next: [Server Components](./10-modern-react-features.md)

---

## Q&A Section — Interview Questions / Câu Hỏi Phỏng Vấn

### 🟢 Q1: "What is React Compiler and what problem does it solve?" / "React Compiler là gì và giải quyết vấn đề gì?"

**💡 Interview Signal:** Tests basic awareness of React 19's direction.

**Answer / Trả lời:**

🇬🇧 React Compiler is a build-time tool (Babel plugin) that automatically adds memoization to your React code. It analyzes your components during build and inserts `useMemo`/`useCallback` equivalents where needed, so developers don't have to manually optimize re-renders. Like TypeScript checks types, Compiler checks performance.

🇻🇳 React Compiler là công cụ chạy lúc build (Babel plugin), tự động thêm memoization vào code React. Phân tích component và thêm cache ở chỗ cần — dev không cần tự viết `useMemo`/`useCallback`. Giống TypeScript check type, Compiler check performance.

---

### 🟢 Q2: "What does the Actions pattern solve? Name the 3 related hooks." / "Actions pattern giải quyết gì? Kể tên 3 hooks."

**💡 Interview Signal:** Tests knowledge of specific React 19 APIs.

**Answer / Trả lời:**

🇬🇧 Actions solve the boilerplate of managing async form submissions — pending state, error handling, and optimistic updates. The three hooks: `useActionState` (manages form state + pending + error), `useFormStatus` (child component reads parent form status), `useOptimistic` (shows result immediately before server confirms).

🇻🇳 Actions giải quyết boilerplate khi submit form async — thay vì 4-5 useState cho loading/error/optimistic. Ba hooks: `useActionState` quản lý state tổng thể, `useFormStatus` cho child biết form đang pending, `useOptimistic` hiện kết quả trước khi server xác nhận.

---

### 🟡 Q3: "How does use() differ from useEffect for reading async data?" / "use() khác useEffect thế nào khi đọc data async?"

**💡 Interview Signal:** Tests understanding of the mechanism, not just surface API.

**Answer / Trả lời:**

🇬🇧 `useEffect` runs after render — you need separate useState for data/loading/error, and the component renders multiple times (empty → loading → data). `use()` reads the Promise during render — it suspends (via Suspense) until the Promise resolves, then renders once with data. Key difference: `use()` is NOT a hook (not stored in linked list), so it can be called conditionally. But it requires a stable Promise reference and a Suspense boundary.

🇻🇳 `useEffect` chạy SAU render — cần 3 useState (data/loading/error), component render nhiều lần. `use()` đọc Promise TRONG render — suspend cho đến khi resolve, render 1 lần. Khác biệt: `use()` KHÔNG phải hook (không lưu trong linked list) nên dùng trong if/else được. Nhưng cần Promise stable reference và Suspense boundary.

---

### 🟡 Q4: "forwardRef is deprecated in React 19 — what changed?" / "forwardRef deprecated — thay đổi thế nào?"

**💡 Interview Signal:** Tests awareness of API surface changes.

**Answer / Trả lời:**

🇬🇧 In React 19, `ref` becomes a regular prop — no wrapper needed. Instead of `forwardRef((props, ref) => ...)`, write `function Input({ ref, ...props })`. Additionally, ref callbacks can now return cleanup functions (like useEffect), enabling co-located setup/teardown for observers and listeners.

🇻🇳 React 19 biến `ref` thành prop bình thường — không cần forwardRef. Viết `function Input({ ref, ...props })` trực tiếp. Thêm vào đó, ref callback return được cleanup function giống useEffect — gắn observer và cleanup cùng chỗ.

---

### 🟡 Q5: "Compare manual memoization vs React Compiler. When does Compiler fall short?" / "So sánh memo thủ công vs Compiler. Khi nào Compiler không giúp được?"

**💡 Interview Signal:** Tests depth — knows limitations, not just features.

**Answer / Trả lời:**

🇬🇧 Manual memoization requires devs to correctly identify expensive computations and specify deps — error-prone. React Compiler automates this via build-time static analysis. However, Compiler falls short when: (1) code violates Rules of React (mutations, side effects in render) — Compiler silently skips, (2) re-renders from Context propagation — Compiler doesn't split contexts, (3) dynamic patterns the static analyzer can't reason about.

🇻🇳 Memo thủ công yêu cầu dev tự xác định computation đắt và deps đúng — dễ sai. Compiler tự động hóa qua static analysis. Nhưng không giúp khi: (1) code vi phạm Rules of React → skip im lặng, (2) re-render do Context → Compiler không split context, (3) pattern dynamic mà static analysis không phân tích được.

---

### 🔴 Q6: "Design a migration strategy from React 18 to 19 for a production app. Key risks?" / "Thiết kế migration strategy 18→19 cho production app. Rủi ro?"

**💡 Interview Signal:** Senior architectural thinking — phased approach, risk assessment.

**Answer / Trả lời:**

🇬🇧 **Phase 1 — Audit:** Run `react-compiler-healthcheck` to identify Rules of React violations. Run ESLint plugin for per-file audit. Estimate Compiler-optimizable percentage.

**Phase 2 — Compiler incrementally:** Babel plugin targets only new/clean directories first. Monitor bundle size and Core Web Vitals. Gradually expand.

**Phase 3 — Migrate API:** Replace `forwardRef` with ref-as-prop in new components. Replace `Context.Provider` with `Context`. Adopt Actions for new forms.

**Phase 4 — use() cautiously:** Only for new data fetching with Suspense. Don't replace working useEffect+React Query patterns.

**Key risks:** Compiler silently skipping code → "random" performance regressions; useFormStatus requires child component refactoring; use() infinite loops with unstable Promise references; third-party lib compatibility.

🇻🇳 Theo phase: (1) Audit code bằng healthcheck + ESLint, (2) Bật Compiler cho folder mới, (3) Migrate API (forwardRef → ref prop, Context.Provider → Context), (4) use() cho data fetching mới. Rủi ro: Compiler skip im lặng, useFormStatus đòi refactor form, use() infinite loop nếu Promise không stable, lib bên thứ 3 chưa compatible.

🔗 **Follow-up Chain:**

1. → "How would you measure if Compiler actually improves performance?" → Core Web Vitals (INP, LCP), React Profiler before/after, bundle size comparison
2. → "If a third-party library isn't Compiler-compatible, how do you handle it?" → `"use no memo"` directive on wrapper, or exclude via Babel config `sources` filter
3. → "Does Actions pattern completely replace Redux form handling?" → Actions handle individual form lifecycle, Redux handles cross-component shared state — different concerns

---

### 🔴 Q7: "use() needs stable references — design a cache layer for use() in production." / "use() cần stable reference — thiết kế cache layer cho production."

**💡 Interview Signal:** Tests system design ability with new primitives.

**Answer / Trả lời:**

🇬🇧 The core problem: `use(fetch('/api/user'))` creates a new Promise every render → infinite suspend loop. We need a cache that returns the same Promise for the same key.

```tsx
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

**Production considerations:** TTL-based cache invalidation, LRU/WeakMap for memory, request dedup (2 components fetching same key = 1 request), `React.cache()` for Server Components (per-request dedup). Real-world: React Query/SWR already solve this — `use()` is a low-level primitive.

🇻🇳 Vấn đề: `use(fetch(...))` tạo Promise mới mỗi render → vòng lặp vô hạn. Cần cache trả cùng Promise cho cùng key. Production cần: TTL, memory management (LRU/WeakMap), request dedup. Thực tế React Query/SWR đã giải quyết — `use()` chỉ là primitive.

🔗 **Follow-up Chain:**

1. → "Which cache invalidation strategy fits use()?" → TTL for read-heavy, mutation-based for write-heavy, stale-while-revalidate for hybrid
2. → "Compare self-written cache vs React Query with use()." → React Query has retry, refetch-on-focus, GC, devtools — self-write only for simple cases or bundle-size-critical
3. → "In SSR/RSC context, how does caching change?" → Server: per-request cache (React.cache()), Client: cross-request cache (React Query). Never share cache between server requests (data isolation)

---

### 🔴 Q8: "Evaluate trade-offs: React 19 Actions vs React Hook Form + React Query for form handling." / "Đánh giá trade-off: Actions vs RHF + RQ cho form."

**💡 Interview Signal:** Senior architectural comparison — not binary thinking.

**Answer / Trả lời:**

🇬🇧

| Criteria / Tiêu chí | React 19 Actions             | RHF + React Query                        |
| ------------------- | ---------------------------- | ---------------------------------------- |
| **Bundle size**     | 0 extra (built-in)           | +20-30KB                                 |
| **Learning curve**  | New API, small surface       | Established patterns, large docs         |
| **Validation**      | Manual or Zod                | Built-in validation, Zod/Yup integration |
| **Caching**         | None built-in                | Full cache + dedup + retry               |
| **Optimistic**      | `useOptimistic` (basic)      | `useMutation` + `onMutate` (advanced)    |
| **Form state**      | Per-field state in component | Uncontrolled with ref-based performance  |
| **SSR/RSC**         | Native "use server" Actions  | Client-only                              |
| **Ecosystem**       | New, evolving                | Mature, well-tested                      |

**Recommendation:**

- **Small app / new project with RSC:** Actions — simpler, no extra deps, progressive enhancement
- **Complex forms (multi-step, validation-heavy):** RHF — field-level validation, touched/dirty tracking
- **Data-heavy app (cache, retry, pagination):** React Query + whatever form lib
- **Hybrid:** Actions for simple forms, RHF for complex forms, React Query for data — they're complementary, not competing

🇻🇳 Trade-off không phải "chọn 1 bỏ 1" — Actions cho form simple + RSC, RHF cho form phức tạp, React Query cho caching. Chúng bổ sung nhau, không thay thế nhau.

🔗 **Follow-up Chain:**

1. → "In a monorepo with RSC and client-heavy pages, how do you choose?" → RSC pages use Server Actions + useActionState, client pages use RHF + React Query. Shared Zod validation schemas.
2. → "Is progressive enhancement important?" → If app needs to work without JS (accessibility, slow networks), Actions + form action= is a big advantage.
3. → "Performance for 50+ field forms?" → RHF uncontrolled approach wins — refs only, no re-renders. Actions re-render entire form per keystroke unless optimized. But Compiler may bridge this gap.

---

## Q&A Summary / Bảng Tổng Hợp

| #   | Question / Câu hỏi        | Level | Key Point                                                                  |
| --- | ------------------------- | ----- | -------------------------------------------------------------------------- |
| Q1  | React Compiler            | 🟢    | Build-time Babel plugin, auto-memoization, static analysis                 |
| Q2  | Actions pattern + 3 hooks | 🟢    | useActionState + useFormStatus + useOptimistic, managed async lifecycle    |
| Q3  | use() vs useEffect        | 🟡    | Not a hook, reads in render, throws to Suspense, stable reference needed   |
| Q4  | forwardRef deprecated     | 🟡    | ref as prop + ref cleanup function                                         |
| Q5  | Manual memo vs Compiler   | 🟡    | Compiler is best-effort, silent skip, no Context fix                       |
| Q6  | Migration strategy 18→19  | 🔴    | Phased: audit → incremental Compiler → API migrate → use() cautious        |
| Q7  | Cache layer for use()     | 🔴    | Stable ref problem, cache + dedup + invalidation, React Query still useful |
| Q8  | Actions vs RHF + RQ       | 🔴    | Complementary not competing, choose by use case                            |

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

**Question: "What's new in React 19? If you had to upgrade a production app, where would you start?"**

30-second answer:

🇬🇧

1. "React 19 has 3 major changes: Compiler auto-adds memoization at build time, Actions pattern manages form async lifecycle, and use() API reads Promises during render."
2. "The Compiler works like TypeScript — static analysis at build, doesn't change runtime behavior, but auto-inserts useMemo/useCallback."
3. "For a production app, I'd start by running react-compiler-healthcheck to audit code quality, then enable Compiler for new folders first, expand gradually."
4. "Key risk: Compiler silently skips code violating Rules of React — need to monitor Core Web Vitals before and after enabling."

🇻🇳

1. "React 19 có 3 thay đổi chính: Compiler tự thêm memoization lúc build, Actions quản lý form async lifecycle, use() đọc Promise trong render."
2. "Compiler hoạt động như TypeScript — static analysis lúc build, tự insert useMemo/useCallback."
3. "Ở production app, bắt đầu bằng react-compiler-healthcheck audit code, bật Compiler cho folder mới trước, mở rộng dần."
4. "Rủi ro: Compiler im lặng skip code vi phạm Rules of React — cần monitor Core Web Vitals trước/sau."

---

## Self-Check / Tự Kiểm Tra

**Close this document before attempting / Đóng tài liệu trước khi làm:**

- [ ] **Retrieval / Truy hồi**: Write 3 major React 19 changes from memory, 2 sentences each. Compare with Overview. / Viết 3 thay đổi chính từ trí nhớ.
- [ ] **Visual / Hình dung**: Draw Actions flow diagram (user click → optimistic → server → success/error). Compare with ASCII diagram. / Vẽ Actions flow diagram.
- [ ] **Application / Ứng dụng**: Registration form with validation + optimistic update — would you use `useState + try/catch` or Actions? Write skeleton code. / Form đăng ký có validation + optimistic — chọn cách nào?
- [ ] **Debug**: `use(fetch('/api/user'))` causes infinite loop — why? Fix? Write simple cache function. / Nguyên nhân? Fix?
- [ ] **Teach / Dạy lại**: Explain React Compiler to a non-programmer using "manual vs automatic car" analogy. / Giải thích Compiler bằng ví dụ xe số sàn vs tự động.

**Feynman Prompt:** Explain the Actions pattern to a non-programmer using the "automated post office" analogy. No technical jargon. / Giải thích Actions bằng ví dụ "bưu điện tự động" cho người không biết code.

🔁 **Spaced Repetition:** Review after 3 days → 7 days → 14 days. / Ôn lại sau 3 → 7 → 14 ngày.

---

## Connections / Liên Kết

- ⬅️ **Built on**: [React Fundamentals](./01-react-fundamentals.md) — need VDOM, reconciliation, component model to understand what Compiler optimizes
- ➡️ **Enables**: [Hooks Deep Dive](./03-hooks-deep-dive.md) — which hooks Compiler replaces, which still need manual writing
- ➡️ **Enables**: [Modern React Features](./10-modern-react-features.md) — Server Components + Streaming SSR leverage Actions + use()
- 🔗 **Applied in**: Next.js 14+ (Server Actions), Remix (form actions), production React 19 apps

---

## Quick Recap / Tóm Tắt Nhanh

### Key Takeaways / Điểm Chính

- **React Compiler** automatically memoizes components and values — no more manual `useMemo`/`useCallback`/`memo` for most cases; it only works when code follows the Rules of React / React Compiler tự động memo hóa — không cần dùng `useMemo`/`useCallback`/`memo` thủ công; chỉ hoạt động khi code tuân thủ Rules of React.
- **Actions pattern** solves async form/mutation state management with three new hooks: `useActionState` (pending + result), `useFormStatus` (form context), `useOptimistic` (optimistic UI) / Actions pattern giải quyết state form/mutation async với 3 hooks mới.
- **`use()` API** reads a Promise or Context inside render — enables `Suspense`-based data fetching without `useEffect`; the Promise must be stable (cached) / `use()` đọc Promise hoặc Context ngay trong render — cho phép fetch data qua Suspense mà không cần useEffect; Promise phải ổn định.
- **`ref` as prop** — `forwardRef` is deprecated; pass `ref` directly as a regular prop in React 19; ref cleanup functions now supported / `forwardRef` deprecated — truyền `ref` như prop thường; hỗ trợ cleanup function cho ref.
- **Context simplification** — `<Context>` can be used as a provider directly (no `.Provider` suffix); `useDeferredValue` accepts initial value / Dùng `<Context>` trực tiếp làm provider, bỏ `.Provider`.
- **Document metadata** — `<title>`, `<meta>`, `<link>` inside components are automatically hoisted to `<head>` without `react-helmet` / Các tag `<title>`, `<meta>`, `<link>` trong component tự động được đẩy lên `<head>`.

### Interview Tips / Mẹo Phỏng Vấn

- When asked about React Compiler, stress the **condition**: it requires rules of React compliance and currently can't optimize all patterns (e.g., external mutable stores) / Khi hỏi về Compiler, nhấn mạnh điều kiện: code phải tuân thủ Rules of React, không tối ưu được mọi pattern.
- For `use()`, make clear it is **not a replacement for `useEffect`** — it's for reading stable, pre-created Promises inside render, paired with Suspense / `use()` không thay thế `useEffect` — dùng để đọc Promise ổn định trong render, phải đi kèm Suspense.
- Migration risk question: mention **concurrent mode strictness**, `forwardRef` deprecation, and changed `ref` behavior as the top breaking changes in React 18→19 / Câu hỏi migration: đề cập strict mode concurrent, deprecated forwardRef, thay đổi ref là các breaking changes chính.
- Compare `useActionState` to `useState + useEffect` pattern: Actions eliminate the "pending/error state boilerplate" and integrate with `<form>` natively / So sánh `useActionState` với useState + useEffect: Actions loại bỏ boilerplate pending/error và tích hợp native với `<form>`.
