# React 19 Features / Tính Năng React 19

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **Prerequisites**: [React Fundamentals](./01-react-fundamentals.md) | [Hooks Deep Dive](./03-hooks-deep-dive.md)
> **See also**: [React Performance](./09-performance-optimization.md) | [Next.js App Router](../04-nextjs/04-nextjs-fundamentals-appRouter.md)

[← Previous](./01-react-fundamentals.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./03-hooks-deep-dive.md)

---

## Real-World Scenario / Tình Huống Thực Tế 🏭

> **Bối cảnh**: Shopee FE team, 2024. Form checkout có 12 input fields. Mỗi keystroke trigger
> re-render toàn bộ form vì state management phức tạp. Devs thêm `useMemo`/`useCallback` ở khắp
> nơi — code khó đọc, dễ bug (stale closure), PR review tranh cãi "có cần memo không?"
>
> React 19 giải quyết 3 vấn đề lớn cùng lúc:
> 1. **React Compiler** tự động memo hóa — xóa sạch `useMemo`/`useCallback` thủ công
> 2. **Actions pattern** (`useActionState`) — form mutation không cần `useState(isLoading)` +
>    `useState(error)` + `try/catch` + `finally setLoading(false)` boilerplate
> 3. **`use()` API** — đọc Context có điều kiện, đọc Promise trong render (không cần useEffect)
>
> **Interview insight**: React 19 là chủ đề hot 2025-2026. Biết `useActionState` vs `useFormStatus`
> và khi nào cần `useOptimistic` giúp bạn stand out.

---

## What & Why / Cái Gì & Tại Sao 🤔

**React 19** là bản major release lớn nhất kể từ Hooks (React 16.8), giải quyết 3 pain points
mà developer phàn nàn nhiều nhất:

**Tương tự đời thường:**
- **React Compiler** = autocorrect trên điện thoại — tự sửa performance issues mà bạn không cần nghĩ
- **Actions** = form bancaire — submit form, ngân hàng xử lý (pending), báo thành công/thất bại (state)
- **`use()`** = đọc sách bất kỳ lúc nào — không bị ép đọc lúc mới mở sách (mount) mà thôi

```
[React 18 — manual optimization]
        │
        │  React 19 improvements
        ▼
[React Compiler] → auto-memoize → no more useMemo/useCallback boilerplate
        │
[Actions Pattern]
        ├── useActionState  — form state + submission + error in one hook
        ├── useFormStatus   — pending/error for nested form components
        └── useOptimistic   — optimistic UI before server confirms
        │
[New APIs]
        ├── use()           — read Context/Promise inside render (no hook rules)
        ├── ref as prop     — no more forwardRef boilerplate
        └── Server Actions  — async functions that run on server from client
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. React Compiler — Automatic Memoization / Memo Hóa Tự Động

> 🧠 **Memory Hook**: **"Compiler = TypeScript for performance"** — TypeScript infers types so you don't write them, React Compiler infers memoization so you don't write useMemo/useCallback

**Tại sao tồn tại? / Why does this exist?**

Manual memoization (`useMemo`, `useCallback`, `React.memo`) là nguồn gốc của hàng loạt bugs:
stale closures, dependency arrays sai, over-memo (memo mọi thứ "phòng xa"), under-memo (quên memo).

→ **Why?** Vì con người không track được dependency graph của entire component tree. Developer hoặc
memo quá nhiều (wasted effort) hoặc quá ít (performance bug).

→ **Why?** Vì React's re-render model (parent re-renders → children re-render) là "pessimistic"
by default. Compiler makes it "optimistic" — chỉ re-render component khi data nó dùng thực sự thay đổi.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Giống TypeScript tự suy luận kiểu (bạn không cần viết `: string` ở mọi nơi), React Compiler
tự suy luận memoization (bạn không cần viết `useMemo` ở mọi nơi). Cả hai đều analyze code tại
build time và thêm optimization tự động.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
React Compiler — Build-time transformation:

  YOUR CODE (input):                 COMPILED OUTPUT:
  ─────────────────                  ──────────────────
  function Price({ item }) {         function Price({ item }) {
    const total = item.price         const $0 = useMemo(
      * item.qty;                      () => item.price * item.qty,
                                       [item.price, item.qty]
    return <span>{total}</span>;       );
  }                                  return useMemo(
                                       () => <span>{$0}</span>,
                                       [$0]
                                     );
                                   }

  WHAT COMPILER ANALYZES:
  1. Static analysis: which variables each expression depends on
  2. Inserts useMemo/useCallback at optimal granularity
  3. Skips re-render when computed value unchanged
  4. Works at EXPRESSION level (finer than component-level React.memo)
```

```typescript
// ✅ Before React 19: manual memo hell
function ProductList({ products, onSelect }: Props) {
  const sorted = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products]
  );

  const handleSelect = useCallback(
    (id: string) => onSelect(id),
    [onSelect]
  );

  return sorted.map(p => (
    <ProductCard key={p.id} product={p} onSelect={handleSelect} />
  ));
}
const MemoProductCard = React.memo(ProductCard);

// ✅ After React 19 (with Compiler): just write plain code
function ProductList({ products, onSelect }: Props) {
  const sorted = [...products].sort((a, b) => a.name.localeCompare(b.name));

  return sorted.map(p => (
    <ProductCard key={p.id} product={p} onSelect={(id) => onSelect(id)} />
  ));
}
// Compiler auto-memoizes sorted, the arrow function, and ProductCard renders
```

**Incremental adoption:**

```javascript
// babel.config.js — enable per directory
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      sources: (filename) => {
        return filename.includes('src/components/');
        // Start with shared components, expand gradually
      }
    }]
  ]
};

// Opt-out per component with directive:
function LegacyComponent() {
  'use no memo'; // ← escape hatch
  // ...
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Rules of React required**: Compiler assumes pure render functions. Code that mutates during render, reads `Date.now()`, or has side effects in render will produce incorrect memoization
- **Build time**: Compiler adds 10-30% build time — acceptable for most apps
- **`eslint-plugin-react-compiler`**: Run this BEFORE enabling compiler — surfaces violations that would cause wrong behavior
- **Existing memo is redundant**: After compiler, `useMemo`/`useCallback`/`React.memo` are no-ops. Remove them gradually

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "Compiler makes all code fast" | Compiler only optimizes re-renders — doesn't fix O(n²) algorithms or unnecessary API calls | Compiler handles memoization, you still own algorithmic efficiency |
| "I can ignore Rules of React now" | Compiler DEPENDS on purity — violations cause silent wrong behavior (worse than before) | Purity is now mandatory, not just recommended |
| Keeping manual `useMemo` after enabling compiler | Redundant memo adds noise and confusing deps arrays | Remove manual memo after compiler is verified stable |
| "Compiler replaces React.memo entirely" | Compiler memoizes at expression level, React.memo at component level — different granularity | Compiler is generally finer-grained and better |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "React Compiler", "automatic memoization", "useMemo alternatives"
- → Nhớ đến: "TypeScript for performance" — infers memoization at build time
- → Mở đầu trả lời: "React Compiler performs static analysis at build time to automatically insert fine-grained memoization, eliminating the need for manual useMemo, useCallback, and React.memo. It requires code to follow the Rules of React — pure render functions with no side effects — because it assumes purity to determine what can be safely cached."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Hooks — useMemo/useCallback](./03-hooks-deep-dive.md) — understand what the compiler replaces
- ➡️ Để hiểu: [React Performance](./09-performance-optimization.md) — when manual optimization is still needed

---

### 2. Actions Pattern — useActionState, useFormStatus, useOptimistic

> 🧠 **Memory Hook**: **"Actions = managed async lifecycle"** — React handles pending/error/success so you don't manage 3 separate useStates

**Tại sao tồn tại? / Why does this exist?**

Every form mutation before React 19 needed: `const [isLoading, setIsLoading] = useState(false)`,
`const [error, setError] = useState(null)`, `try { setIsLoading(true); await submit(); } catch (e)
{ setError(e); } finally { setIsLoading(false); }`. This boilerplate was in EVERY form component.

→ **Why?** Vì React trước 19 không có first-class concept cho "mutation" — chỉ có "state" và
"effect". Mutation lifecycle (pending → success/error) phải build thủ công.

→ **Why?** Vì Actions integrate với transition system — form submission là transition, UI remains
responsive, multiple submits are queued (no race conditions), và progressive enhancement
(forms work trước khi JS load) becomes possible.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Actions giống **giao dịch ngân hàng online**: bạn nhấn "chuyển tiền" → ngân hàng hiển thị
"đang xử lý" (pending) → thành công hoặc báo lỗi → tài khoản cập nhật. Bạn không cần
tự theo dõi state "đang chuyển"/"đã xong"/"lỗi" — ngân hàng (React) quản lý lifecycle cho bạn.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
Actions Lifecycle:

  User submits form
       │
       ▼
  useActionState wraps action
       │
       ├── isPending = true (automatic)
       │
       ▼
  Async action runs (server or client)
       │
       ├── Success → state updated with result
       │   └── useOptimistic reverts to real data
       │
       └── Error → state updated with error
           └── useOptimistic reverts to previous
       │
       ▼
  isPending = false (automatic)

  Component tree:
  ┌─────────────────────────────────┐
  │ <FormParent>                    │ ← useActionState (owns lifecycle)
  │   ├── useOptimistic (instant UI)│
  │   │                             │
  │   ├── <form action={formAction}>│
  │   │   ├── <Input />             │
  │   │   ├── <Input />             │
  │   │   └── <SubmitBtn />         │ ← useFormStatus (reads pending)
  │   │                             │
  │   └── <ErrorMessage />          │ ← reads state.error
  └─────────────────────────────────┘
```

```typescript
// ✅ Complete Actions pattern — form with optimistic update
import { useActionState, useOptimistic } from 'react';
import { useFormStatus } from 'react-dom';

// Server or client action
async function addTodo(prevState: State, formData: FormData): Promise<State> {
  const text = formData.get('text') as string;

  try {
    const todo = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ text }),
    }).then(r => r.json());

    return { ...prevState, todos: [...prevState.todos, todo], error: null };
  } catch (e) {
    return { ...prevState, error: 'Failed to add todo' };
  }
}

function TodoForm() {
  const [state, formAction, isPending] = useActionState(addTodo, {
    todos: [],
    error: null,
  });

  // Optimistic: show new todo immediately before server confirms
  const [optimisticTodos, addOptimistic] = useOptimistic(
    state.todos,
    (current, newText: string) => [...current, { id: 'temp', text: newText, pending: true }]
  );

  return (
    <form action={async (formData) => {
      addOptimistic(formData.get('text') as string); // instant UI
      await formAction(formData);                      // actual submission
    }}>
      <input name="text" required />
      <SubmitButton />
      {state.error && <p className="error">{state.error}</p>}
      <ul>
        {optimisticTodos.map(t => (
          <li key={t.id} style={{ opacity: t.pending ? 0.5 : 1 }}>{t.text}</li>
        ))}
      </ul>
    </form>
  );
}

// Reusable submit button — works in ANY form
function SubmitButton() {
  const { pending } = useFormStatus(); // reads from nearest parent <form>
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Add Todo'}
    </button>
  );
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **`useActionState` moved**: Was `useFormState` in react-dom → renamed to `useActionState` in react and works with non-form actions too
- **`useFormStatus` scope**: Only reads from nearest parent `<form>` — must be a CHILD of `<form>`, not the component that renders `<form>`
- **Progressive enhancement**: With Server Actions, `<form action={serverAction}>` works before JS loads — true HTML form behavior
- **Sequential submission**: Multiple rapid submits are queued, not concurrent — prevents race conditions by default
- **Optimistic rollback**: `useOptimistic` automatically reverts when the action completes (success replaces with real data, error reverts to previous)

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Using `useFormStatus` in the same component as `<form>` | `useFormStatus` reads from PARENT form — must be a child component | Extract submit button into a separate component |
| Confusing `useActionState` with `useReducer` | `useActionState` handles async + pending + form integration; `useReducer` is sync-only | Use `useActionState` for server mutations, `useReducer` for complex client state |
| Not handling optimistic rollback on error | `useOptimistic` auto-reverts, but you still need error UI | Always check `state.error` and show user feedback |
| "Actions replace all form handlers" | Actions are for mutations (POST/PUT/DELETE). Read-only forms (search, filters) are fine with `onChange` | Use Actions for writes, events for reads |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "useActionState", "useFormStatus", "useOptimistic", "React 19 forms"
- → Nhớ đến: "Managed async lifecycle" — pending/error/success automatic
- → Mở đầu trả lời: "React 19 introduces the Actions pattern with three hooks that work together: useActionState owns the form's async lifecycle — it wraps the action and returns state plus isPending, eliminating the need for manual loading/error state management. useFormStatus distributes pending state to child components without prop drilling. useOptimistic provides instant UI feedback before the server confirms, with automatic rollback on failure."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Hooks — useState/useReducer](./03-hooks-deep-dive.md) — Actions build on the reducer mental model
- ➡️ Để hiểu: [Next.js Server Actions](../04-nextjs/04-nextjs-fundamentals-appRouter.md) — Actions + `"use server"` = full-stack mutations

---

### 3. use() API, Ref Changes & Other Breaking Changes

> 🧠 **Memory Hook**: **"`use()` = unconditional read"** — unlike hooks, it can be called inside if/else/loops because it reads a value NOW, not sets up a subscription

**Tại sao tồn tại? / Why does this exist?**

`useContext` is subject to Rules of Hooks — can't call inside conditions. But sometimes you
NEED conditional context: `if (isLoggedIn) { const prefs = use(UserPrefsContext); }`.

→ **Why?** Vì `useContext` lưu vào linked list of hook calls (phải cùng order mỗi render).
`use()` KHÔNG lưu vào linked list — nó resolve giá trị tại thời điểm gọi.

→ **Why?** Vì `use()` cũng đọc Promises — cho phép data fetching trong render mà không cần
`useEffect`. Kết hợp với Suspense, tạo ra pattern mới: component "waits" cho data trong render
thay vì mount → fetch → re-render.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

`useContext` giống **đăng ký nhận báo** — bạn đăng ký 1 lần lúc chuyển vào nhà (mount), nhận
báo mỗi sáng (re-render). Không thể đăng ký có điều kiện. `use()` giống **mua báo ở sạp** —
mua khi nào cần, bỏ qua khi không cần. Tự do hơn nhưng cần biết sạp ở đâu (stable reference).

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
use() vs useContext:

  useContext(ThemeCtx)                use(ThemeCtx)
  ───────────────────                ─────────────
  ❌ Can't call in if/else           ✅ Can call anywhere
  ❌ Can't call in loops             ✅ Can call in loops
  ✅ Sets up subscription            ✅ Reads current value
  Stored in hook linked list         NOT stored in linked list

  use() with Promises:
  ───────────────────
  function UserProfile({ userPromise }) {
    const user = use(userPromise);  // suspends until resolved
    return <h1>{user.name}</h1>;
  }

  <Suspense fallback={<Skeleton />}>
    <UserProfile userPromise={fetchUser(id)} />
  </Suspense>
```

```typescript
// ✅ use() for conditional context
function Dashboard({ isAdmin }: { isAdmin: boolean }) {
  const theme = use(ThemeContext); // always needed

  if (isAdmin) {
    const adminConfig = use(AdminConfigContext); // conditional!
    return <AdminPanel config={adminConfig} theme={theme} />;
  }

  return <UserPanel theme={theme} />;
}

// ✅ use() for data fetching (replaces useEffect + useState pattern)
async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}

// Parent caches the promise (CRITICAL: must be stable reference)
function App() {
  const [userPromise] = useState(() => fetchUser('123'));

  return (
    <Suspense fallback={<Skeleton />}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}

function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise); // suspends component until resolved
  return <h1>{user.name}</h1>;   // renders AFTER data is ready
}

// ✅ Ref as prop — no more forwardRef boilerplate (React 19)
// Before:
const Input = forwardRef<HTMLInputElement, Props>((props, ref) => (
  <input ref={ref} {...props} />
));

// After (React 19):
function Input({ ref, ...props }: Props & { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />;
}

// ✅ Ref cleanup function (React 19)
<div ref={(node) => {
  const observer = new ResizeObserver(entries => {
    // handle resize
  });
  observer.observe(node);
  return () => observer.disconnect(); // cleanup on unmount!
}} />
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Promise stability**: `use(fetchUser(id))` in render creates new promise each render → infinite suspension. Promise MUST come from cache (parent state, TanStack Query, etc.)
- **Context.Provider deprecated**: React 19 uses `<MyContext>` directly as provider, not `<MyContext.Provider>`. Old syntax shows deprecation warning
- **forwardRef deprecated**: `ref` is now a regular prop. Existing `forwardRef` code works but logs warnings — use codemod to convert
- **String refs removed**: `this.refs.myRef` completely removed (deprecated since React 16)
- **`ReactDOM.render` removed**: Must use `createRoot`. Legacy render API throws in React 19

**Key migration pitfalls:**

| Removed/Changed | Migration |
|-----------------|-----------|
| `useFormState` (react-dom) | → `useActionState` (react) |
| `forwardRef` | → `ref` as regular prop |
| `<Ctx.Provider>` | → `<Ctx>` directly |
| `ReactDOM.render` | → `createRoot().render()` |
| `propTypes`/`defaultProps` on fn components | → TypeScript + JS default params |
| String refs (`this.refs.x`) | → `useRef` / callback refs |

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Creating Promise in render for `use()` | New promise each render → infinite suspend/re-render loop | Cache promise in parent state or use TanStack Query |
| Ref callbacks that accidentally return a value | React 19 treats ANY return value as cleanup function | If your old ref callback returns something, remove the return |
| "use() replaces useContext entirely" | `use()` and `useContext` both work — `use()` adds conditional capability | Use `useContext` for always-needed context, `use()` for conditional |
| Ignoring eslint-plugin-react-compiler before migration | Violations cause silent bugs — worse than no compiler at all | Always audit with ESLint plugin before enabling compiler |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "use() API", "React 19 changes", "forwardRef removal", "migration"
- → Nhớ đến: "`use()` = unconditional read" — not stored in hook linked list
- → Mở đầu trả lời: "The `use()` API intentionally breaks the Rules of Hooks — it can be called inside conditionals and loops because unlike useState or useContext, it's not stored in a linked list of hook calls. It reads the current value of a Context or Promise at call time. For Promises, it integrates with Suspense to pause rendering until data is ready, replacing the useEffect + useState fetch pattern."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Hooks — Rules of Hooks](./03-hooks-deep-dive.md) — understand WHY hooks can't be conditional (linked list)
- ➡️ Để hiểu: [Next.js Server Components](../04-nextjs/04-nextjs-fundamentals-appRouter.md) — `use()` + Suspense + Server Components = new data loading model

---

## Interview Q&A / Hỏi Đáp Phỏng Vấn

### Q1: What problem does React Compiler solve, and what are its limitations? / React Compiler giải quyết vấn đề gì và có hạn chế gì? 🟡 Mid

**A:** React Compiler automatically memoizes components and values at build time, eliminating manual `React.memo`, `useMemo`, and `useCallback`. It performs static analysis to track which values depend on which inputs and inserts fine-grained memoization.

**Limitations:** It requires code to follow the Rules of React (pure render, no side effects during render). Can't optimize dynamic patterns (`eval()`, non-deterministic code, render-time mutations). Increases build time 10-30% in exchange for runtime performance.

Giải thích tiếng Việt: Compiler tự động memo hóa tại build time, loại bỏ nhu cầu memo thủ công. Hạn chế: yêu cầu code tuân thủ Rules of React, không tối ưu được code động hoặc có side effect trong render, tăng build time.

**💡 Interview Signal:**
- ✅ Strong: Explains build-time analysis vs runtime memo, mentions ESLint plugin for auditing, discusses migration strategy
- ❌ Weak: Only says "it auto-memoizes" without understanding the purity requirement

---

### Q2: Explain the relationship between useActionState, useFormStatus, and useOptimistic. / Giải thích mối quan hệ giữa ba hooks. 🔴 Senior

**A:** These three hooks form a complete form mutation system:

- **`useActionState(action, initialState)`** — used in the **parent** that owns the form. Wraps the action and returns `[state, formAction, isPending]`. Manages result/error state and pending status.
- **`useFormStatus()`** — used in **child components** inside `<form>`. Reads `{ pending, data, method, action }` from nearest parent form context. Ideal for reusable submit buttons.
- **`useOptimistic(state, updateFn)`** — provides immediate UI feedback before action completes. Automatically reverts if action fails.

```typescript
// Parent: useActionState (owns lifecycle)
const [state, formAction, isPending] = useActionState(submitOrder, initialState);

// Optimistic (instant feedback)
const [optimisticItems, addOptimistic] = useOptimistic(state.items, (curr, newItem) => [...curr, newItem]);

// Child: useFormStatus (reads pending without prop drilling)
function SubmitBtn() {
  const { pending } = useFormStatus(); // MUST be inside <form>
  return <button disabled={pending}>{pending ? 'Saving...' : 'Submit'}</button>;
}
```

Giải thích tiếng Việt: Ba hook tạo hệ thống mutation hoàn chỉnh. `useActionState` quản lý lifecycle ở parent (state + pending + error). `useFormStatus` phân phối pending state cho children không cần prop drilling. `useOptimistic` cho UI cảm giác tức thì — tự động revert nếu action fail.

**💡 Interview Signal:**
- ✅ Strong: Explains which hook goes WHERE in component tree, mentions `useFormStatus` must be child of `<form>`
- ❌ Weak: Confuses `useActionState` with `useReducer`, doesn't know `useFormStatus` scoping

---

### Q3: Why is use() not a hook? What implications does this have? / Tại sao use() không phải hook? 🔴 Senior

**A:** `use()` intentionally breaks Rules of Hooks — it can be called inside conditionals, loops, and early returns. This is possible because `use()` is NOT stored in the linked list of hook calls like `useState` or `useEffect`. Instead, it resolves the value at call time.

**Implications:**
1. **Conditional context**: `if (isAdmin) { const config = use(AdminCtx); }` — impossible with `useContext`
2. **Promise in render**: `const data = use(promise)` integrates with Suspense, replacing `useEffect` data fetching
3. **Mental model shift**: Hooks = "subscriptions set up once"; `use()` = "read a value right now"

**Key gotcha:** Promises passed to `use()` must be stable references. Creating a new promise in render causes infinite suspension — the promise resolves, triggers re-render, creates new promise, suspends again forever.

Giải thích tiếng Việt: `use()` không lưu trong linked list hook → có thể gọi trong if/loop. Cho phép đọc context có điều kiện và đọc Promise trong render với Suspense. Promise PHẢI là tham chiếu ổn định (cached) — tạo promise mới trong render gây infinite loop.

**💡 Interview Signal:**
- ✅ Strong: Explains linked list reason, gives conditional context example, warns about promise stability
- ❌ Weak: Only knows "it can be called conditionally" without understanding WHY

---

### Q4: How do Server Components affect application architecture? / Server Components ảnh hưởng architecture thế nào? 🔴 Senior

**A:** Server Components split the component tree into server-executed (zero client JS) and client-executed pieces:

1. **Data layer**: Server Components access databases directly — no API routes needed for reads
2. **Bundle size**: Heavy deps (markdown parsers, ORMs) stay on server. Client only includes interactive components
3. **Composition rules**: Server can render Client (`'use client'`), but NOT vice versa. Client receives Server as `children` (donut pattern)
4. **Caching shifts**: From client-side (React Query) to server/edge (CDN, ISR)

```
Composition Rules:

  ✅ Server renders Client:
  // server-component.tsx
  import ClientBtn from './client-btn'; // 'use client'
  export default function Page() {
    return <ClientBtn />; // works — server renders the boundary
  }

  ✅ Client receives Server as children (donut pattern):
  // client-layout.tsx ('use client')
  export default function Layout({ children }) {
    const [open, setOpen] = useState(false);
    return <div>{children}</div>; // children can be Server Components!
  }

  ❌ Client imports Server:
  // client.tsx ('use client')
  import ServerComp from './server'; // ❌ CANNOT import server into client
```

Giải thích tiếng Việt: Server Components chia tree thành phần server (0 JS client) và phần client. Data access trực tiếp DB (không cần API route), bundle nhẹ hơn, nhưng có quy tắc composition: Server → Client OK, Client → Server NOT OK (chỉ qua children). Caching chuyển từ client sang server/edge.

**💡 Interview Signal:**
- ✅ Strong: Explains donut pattern, discusses caching shift, knows composition constraints
- ❌ Weak: Only says "runs on server, less JS" without architectural implications

---

### Q5: How would you incrementally adopt React Compiler in a large codebase? / Adopt React Compiler từng bước thế nào? 🔴 Senior

**A:** Six-step strategy:

1. **Audit**: Run `eslint-plugin-react-compiler` to surface Rules of React violations
2. **Fix violations**: Most are genuine bugs (render-time mutations, conditional hooks). Improves code regardless of compiler
3. **Enable per-directory**: Babel/SWC plugin config — start with shared UI components
4. **Measure**: Compare bundle size, runtime perf (DevTools Profiler), and build time before/after
5. **Remove manual memo**: After compiler is stable, existing `useMemo`/`useCallback`/`React.memo` are redundant
6. **Monitor production**: Watch for behavior regressions — edge cases with impure code that passed undetected

Giải thích tiếng Việt: 6 bước: audit với ESLint plugin → fix violations → bật compiler theo từng thư mục → đo lường (build time +10-30%, runtime cải thiện) → xóa memo thủ công dần → monitor production.

**💡 Interview Signal:**
- ✅ Strong: Starts with ESLint audit (not blind enable), gives per-directory strategy, mentions measurement
- ❌ Weak: Says "just enable it" without migration strategy

---

### Q6: What is the ref cleanup function pattern in React 19? / Pattern ref cleanup function là gì? 🟡 Mid

**A:** React 19 allows ref callbacks to return a cleanup function, similar to `useEffect` cleanup:

```tsx
// Before: check null for cleanup
<div ref={(node) => {
  if (node) observer.observe(node);
  else observer.disconnect(); // null = unmount
}} />

// React 19: explicit cleanup
<div ref={(node) => {
  const observer = new ResizeObserver(() => {});
  observer.observe(node);
  return () => observer.disconnect(); // cleanup on unmount!
}} />
```

Use for: ResizeObserver, IntersectionObserver, third-party library setup/teardown. Cleanup pattern is clearer because you close over the exact resources created during setup.

**Migration pitfall**: If your existing ref callbacks accidentally return a value, React 19 treats it as a cleanup function. Previously return values were ignored.

Giải thích tiếng Việt: React 19 cho phép ref callback trả về cleanup function. Trước đây kiểm tra `null` để biết unmount. Pattern mới rõ ràng hơn. Cẩn thận: nếu ref callback cũ vô tình return giá trị, React 19 sẽ coi đó là cleanup function.

**💡 Interview Signal:**
- ✅ Strong: Shows before/after pattern, mentions migration pitfall (accidental return values)
- ❌ Weak: Only knows "refs changed" without specific cleanup mechanism

---

## Interview Q&A Summary / Tổng Kết Q&A

| # | Topic | Difficulty | Key Concept |
|---|-------|-----------|-------------|
| Q1 | React Compiler | 🟡 Mid | Build-time memoization, purity required |
| Q2 | Actions trio | 🔴 Senior | useActionState (parent) + useFormStatus (child) + useOptimistic (instant) |
| Q3 | use() API | 🔴 Senior | Not a hook, no linked list, conditional + Promise |
| Q4 | Server Components | 🔴 Senior | Composition rules, donut pattern, caching shift |
| Q5 | Compiler adoption | 🔴 Senior | ESLint audit → per-directory → measure → remove manual memo |
| Q6 | Ref cleanup | 🟡 Mid | Cleanup function return, migration pitfall |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"What are the most important changes in React 19?"**

**30 giây đầu — mở đầu lý tưởng:**
1. "React 19 has three major categories of changes: the React Compiler for automatic memoization, the Actions pattern for form mutations, and the `use()` API that breaks the Rules of Hooks intentionally."
2. "The Compiler performs build-time static analysis to auto-insert fine-grained memoization, eliminating the need for manual `useMemo`, `useCallback`, and `React.memo` — but it requires code to follow the Rules of React strictly."
3. "The Actions pattern introduces `useActionState` for managing async form lifecycles, `useFormStatus` for distributing pending state to child components, and `useOptimistic` for instant UI feedback with automatic rollback."
4. "There are also breaking changes: `forwardRef` is deprecated in favor of ref-as-prop, `Context.Provider` becomes just `<Context>`, and `ReactDOM.render` is fully removed — apps must use `createRoot`."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| # | Loại | Câu hỏi |
|---|------|---------|
| 1 | 🔍 Retrieval | React Compiler làm gì tại build time? Yêu cầu gì từ code? Hạn chế gì cần biết khi adopt? |
| 2 | 🎨 Visual | Vẽ component tree cho form với `useActionState` (parent), `useFormStatus` (child button), `useOptimistic` (instant list update). |
| 3 | 🛠️ Application | Viết form checkout: submit → pending state → error handling → optimistic update dùng React 19 Actions pattern (không dùng `useState isLoading`). |
| 4 | 🐛 Debug | `use(fetchUser(id))` gọi trong render gây infinite loop. Tại sao? Fix thế nào mà vẫn dùng `use()`? |
| 5 | 🎓 Teach | Giải thích tại sao `use()` có thể gọi trong `if/else` nhưng `useContext` không — dùng ví dụ "đăng ký nhận báo vs mua báo ở sạp". |

### Key Points (tự kiểm tra)

| # | Key Point |
|---|-----------|
| 1 | Compiler auto-memoize theo Rules of Hooks, không cần `useMemo`/`useCallback` thủ công. Yêu cầu: code phải tuân thủ Rules of Hooks. Hạn chế: chưa support toàn bộ patterns. |
| 2 | `<Form>` dùng `useActionState(action, null)` → `formAction`. `<SubmitButton>` dùng `useFormStatus().pending`. `<List>` dùng `useOptimistic(items, (s,n) => [...s,n])`. |
| 3 | `const [state, formAction] = useActionState(checkoutAction, null)`. `useOptimistic` cho instant feedback. `useFormStatus` trong child component cho `pending`. |
| 4 | `fetchUser(id)` tạo new Promise mỗi render → Suspense boundary reset → re-render loop. Fix: cache promise bên ngoài render (useMemo, module-level, hay cache lib). |
| 5 | `useContext` = "đăng ký nhận báo hàng ngày" (subscription, phải ổn định). `use()` = "ra sạp mua báo" (one-time read). Subscription cần Rules of Hooks; one-time read thì không. |

> 🎯 **Feynman Prompt:** Giải thích React Actions pattern cho dev đã biết React 18 — tại sao `useActionState` thay thế pattern `isLoading + error + try/catch`?
🔁 **Spaced Repetition reminder:** Review this file again on 2026-03-22, then 2026-03-26, then 2026-04-02.

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)
- [Modern React Features](./10-modern-react-features.md) — concurrent rendering and Server Components in depth
- [Performance Optimization](./09-performance-optimization.md) — Compiler's memoization fits here
- [React Fundamentals](./01-react-fundamentals.md) — baseline model that React 19 extends
- [State Management](./05-state-management.md) — Actions pattern replaces manual loading state

### Khác track (Cross-track)
- [App Router & Server Components](../04-nextjs/01-app-router-server-components.md) — framework layer for React Server Components
- [React Performance](../06-browser-performance/02-react-performance.md) — browser-level impact of React 19 improvements
- [Architecture Styles](../../shared/05-software-engineering/02-architecture-styles.md) — RSC changes client/server architecture boundaries
