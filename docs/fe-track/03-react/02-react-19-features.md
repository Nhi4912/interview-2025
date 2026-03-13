# React 19 Features / Tinh Nang React 19

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [React Fundamentals](./01-react-fundamentals.md) | [Hooks Deep Dive](./03-hooks-deep-dive.md) | [Performance](./09-performance-optimization.md)

[← Previous](./01-react-fundamentals.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./03-hooks-deep-dive.md)

---

## Tong Quan / Overview

**English:** React 19 is a major release that introduces the React Compiler for automatic memoization, Actions for form-based mutations, new hooks (`useActionState`, `useFormStatus`, `useOptimistic`), the `use()` API for reading resources in render, ref-as-prop, native document metadata, asset loading primitives, and stable Server Components. This chapter covers each feature with interview-focused analysis.

**Tieng Viet:** React 19 la ban phat hanh lon gioi thieu React Compiler de tu dong memo hoa, Actions cho form mutation, cac hook moi (`useActionState`, `useFormStatus`, `useOptimistic`), `use()` API de doc resource trong render, ref-as-prop, document metadata goc, asset loading, va Server Components on dinh. Chuong nay phan tich tung tinh nang theo goc nhin phong van.

## Table of Contents / Muc Luc
1. [React Compiler](#react-compiler)
2. [Actions and Form Mutations](#actions-and-form-mutations)
3. [useActionState](#useactionstate)
4. [useFormStatus](#useformstatus)
5. [useOptimistic](#useoptimistic)
6. [use() API](#use-api)
7. [Ref as Prop](#ref-as-prop)
8. [Document Metadata APIs](#document-metadata-apis)
9. [Asset Loading](#asset-loading)
10. [Server Components Integration](#server-components-integration)
11. [Improved Error Reporting](#improved-error-reporting)
12. [Activity (Offscreen evolution)](#activity-offscreen-evolution)
13. [Cau Hoi Phong Van / Interview Q&A](#cau-hoi-phong-van--interview-qa)

---

## React Compiler

### Giai thich / Explanation

**English:** The React Compiler (formerly React Forget) is an optimizing compiler that automatically memoizes components and hooks at build time, eliminating the need for manual `React.memo`, `useMemo`, and `useCallback` in most cases.

**Tieng Viet:** React Compiler (truoc day la React Forget) la trinh bien dich toi uu hoa tu dong memo component va hook tai thoi diem build, loai bo nhu cau su dung `React.memo`, `useMemo`, `useCallback` thu cong trong hau het cac truong hop.

### Key Points / Y Chinh
- The compiler performs static analysis of your component code at build time and inserts fine-grained memoization automatically. It tracks which values are used where, so it memoizes at the value level rather than the component level. (Compiler phan tich tinh ma nguon tai build-time va chen memo tu dong o muc gia tri, khong phai muc component.)
- It enforces the Rules of React (pure render, no side effects during render) — code that violates these rules will either be skipped by the compiler or flagged. In interviews, mention that the compiler is not magic: it requires well-structured code. (Compiler bat buoc tuan thu Rules of React — code vi pham se bi bo qua hoac canh bao.)
- The compiler output is backward-compatible React code — it still uses `useMemo`/`useCallback` under the hood, just auto-inserted. This means you can incrementally adopt it. (Ket qua bien dich la code React tuong thich nguoc — van dung useMemo/useCallback ben duoi, chi la tu dong chen.)
- Trade-off: the compiler increases build time but reduces runtime re-renders. For large codebases with poor memoization discipline, the performance gains can be substantial (30-70% fewer re-renders in Meta's internal benchmarks). (Danh doi: tang thoi gian build nhung giam re-render runtime. Voi codebase lon, hieu suat tang dang ke.)
- The compiler works as a Babel plugin (or SWC plugin). It integrates with existing build tools like Vite, Next.js, and webpack. You can configure it to skip certain files or directories. (Compiler hoat dong nhu Babel/SWC plugin, tich hop voi Vite, Next.js, webpack. Co the cau hinh bo qua file/thu muc cu the.)
- Key interview differentiator: unlike Vue's or Svelte's compile-time optimizations which change the runtime model, React Compiler keeps the same virtual DOM reconciliation — it just makes it smarter about what to skip. (Khac voi Vue/Svelte doi runtime model, React Compiler giu nguyen virtual DOM reconciliation — chi thong minh hon ve viec bo qua gi.)
- The `eslint-plugin-react-compiler` helps identify code that the compiler cannot optimize, such as mutations during render or conditional hook calls. Running this lint rule before enabling the compiler is a best practice. (eslint-plugin-react-compiler giup phat hien code khong the toi uu, nhu mutation trong render hoac hook co dieu kien.)
- In interviews, compare manual vs. compiler memoization: manual `useMemo` risks stale deps and over-memoization; the compiler tracks exact dependencies and only memoizes what changes. But the compiler cannot optimize dynamic patterns like `eval()` or non-deterministic code. (So sanh: useMemo thu cong co nguy co deps cu va over-memo; compiler theo doi chinh xac dependencies nhung khong xu ly duoc eval() hay code khong xac dinh.)

### Vi du / Example
```tsx
// Before React Compiler — manual memoization everywhere
import { memo, useMemo, useCallback } from 'react';

type Row = { id: string; score: number };

const RowView = memo(function RowView({ row }: { row: Row }) {
  return <li>{row.id}: {row.score}</li>;
});

export function ScoreList({ rows }: { rows: Row[] }) {
  const sorted = useMemo(
    () => [...rows].sort((a, b) => b.score - a.score),
    [rows]
  );
  const handleClick = useCallback((id: string) => console.log(id), []);
  return <ul>{sorted.map((r) => <RowView key={r.id} row={r} />)}</ul>;
}

// After React Compiler — write plain code, compiler adds memoization
export function ScoreList({ rows }: { rows: Row[] }) {
  const sorted = [...rows].sort((a, b) => b.score - a.score);
  return (
    <ul>
      {sorted.map((r) => (
        <li key={r.id}>{r.id}: {r.score}</li>
      ))}
    </ul>
  );
}
```

### Interview Notes / Ghi Chu Phong Van
- Lead with "React Compiler eliminates manual memoization by doing it at build time" — this is the one-sentence summary interviewers want.
- Know the constraint: the compiler requires components to follow the Rules of React (pure functions, no side effects in render).
- Be ready to discuss incremental adoption: you can enable it per-file and use the ESLint plugin to audit readiness.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Actions and Form Mutations

### Giai thich / Explanation

**English:** Actions are async functions that handle form submissions with built-in pending, error, and optimistic states. They work with `<form action={fn}>` and replace the manual `onSubmit` + `useState` + `try/catch` pattern.

**Tieng Viet:** Actions la cac ham async xu ly form submission voi trang thai pending, error, va optimistic san co. Chung hoat dong voi `<form action={fn}>` va thay the pattern thu cong `onSubmit` + `useState` + `try/catch`.

### Key Points / Y Chinh
- Actions integrate with React's transition system: when a form action is running, React treats it as a transition, keeping the UI responsive and not blocking user input. The `isPending` state is managed automatically. (Actions tich hop voi transition system: khi action chay, React coi no la transition, giu UI responsive va tu dong quan ly isPending.)
- Server Actions (`'use server'` directive) allow you to define the action function on the server — the client form submits directly to the server function without manually writing API routes. This is a paradigm shift for full-stack React. (Server Actions voi `'use server'` cho phep dinh nghia ham tren server — client form gui truc tiep den server function ma khong can viet API route thu cong.)
- Actions handle sequential submissions correctly: if a user submits a form multiple times rapidly, React processes them in order and uses the final state, avoiding race conditions that plague manual implementations. (Actions xu ly submission lien tiep dung: neu user submit nhieu lan nhanh, React xu ly theo thu tu va dung state cuoi cung, tranh race condition.)
- Progressive enhancement: `<form action={fn}>` works even before JavaScript loads if the action is a server action — the form falls back to native HTML form submission. This is a key interview point for accessibility and resilience. (Progressive enhancement: form hoat dong ca khi JS chua tai neu la server action — fallback ve native HTML form submission.)
- Trade-off vs. React Query/SWR: Actions are best for mutations (create/update/delete), while React Query is better for data fetching with caching, deduplication, and background refetching. In practice, you often use both together. (So sanh voi React Query/SWR: Actions tot cho mutations, React Query tot cho fetching voi cache va dedup. Thuc te thuong dung ca hai.)
- Error handling in Actions is declarative: errors thrown in an action are caught by the nearest Error Boundary, following React's compositional error model rather than imperative try/catch scattered throughout event handlers. (Error handling khai bao: loi trong action duoc Error Boundary bat, theo mo hinh loi tong hop cua React thay vi try/catch rai rac.)
- Actions can return values that update the component state via `useActionState`, enabling a request-response pattern where the server can send back validation errors, redirect URLs, or updated data. (Actions co the tra ve gia tri de cap nhat state qua useActionState, cho phep pattern request-response voi validation error, redirect URL, hoac data moi.)
- Key interview trap: Actions are NOT a replacement for all data fetching. They handle mutations and form submissions. For initial data loading, use Server Components, `use()`, or data fetching libraries. (Bay phong van: Actions KHONG thay the toan bo data fetching. Chung xu ly mutations va form. De tai du lieu ban dau, dung Server Components, use(), hoac thu vien fetch.)

### Vi du / Example
```tsx
// React 19 Action pattern
async function createTodo(formData: FormData) {
  'use server';
  const title = formData.get('title') as string;
  await db.todos.create({ title });
  revalidatePath('/todos');
}

export function TodoForm() {
  return (
    <form action={createTodo}>
      <input name="title" required />
      <SubmitButton />
    </form>
  );
}
```

### Interview Notes / Ghi Chu Phong Van
- Frame Actions as "React's answer to the form mutation problem" — they unify pending/error/success states.
- Mention progressive enhancement as the key differentiator vs. `onSubmit` handlers.
- Know that Actions work on both client and server, but Server Actions are the bigger paradigm shift.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## useActionState

### Giai thich / Explanation

**English:** `useActionState` (renamed from `useFormState`) wraps an action function and returns `[state, formAction, isPending]` — providing a predictable contract between form actions and UI state updates.

**Tieng Viet:** `useActionState` (doi ten tu `useFormState`) bao boc mot action function va tra ve `[state, formAction, isPending]` — cung cap contract ro rang giua form action va cap nhat UI state.

### Key Points / Y Chinh
- Signature: `const [state, formAction, isPending] = useActionState(actionFn, initialState, permalink?)`. The `actionFn` receives `(previousState, formData)` and returns the new state. This is a reducer-like pattern but for async server mutations. (Chu ky: actionFn nhan (previousState, formData) va tra ve state moi. Day la pattern giong reducer nhung cho async server mutation.)
- The `isPending` return value (third element) was added in React 19 — previously you needed `useFormStatus` in a child component. Now the parent component can directly know if its action is pending. (isPending (phan tu thu 3) duoc them trong React 19 — truoc day can useFormStatus trong child component. Bay gio parent biet truc tiep action dang pending.)
- The optional `permalink` parameter enables progressive enhancement for SSR: it specifies the URL to navigate to if JavaScript hasn't loaded yet, ensuring the form works without JS. (Tham so permalink cho phep progressive enhancement voi SSR: chi dinh URL de navigate khi JS chua tai.)
- State management pattern: `useActionState` replaces the combination of `useState` + `useTransition` + manual error state for form submissions. It consolidates three pieces of state into one hook. (Pattern quan ly state: useActionState thay the to hop useState + useTransition + error state thu cong cho form, gop 3 state thanh 1 hook.)
- The state returned by `useActionState` persists across re-renders and reflects the result of the last completed action. If an action fails, you can return an error object as state and render it declaratively. (State tu useActionState ton tai qua cac re-render va phan anh ket qua action hoan thanh cuoi cung. Neu action fail, tra ve error object lam state.)
- Trade-off: `useActionState` is form-centric — it receives `FormData` as input. For non-form mutations (e.g., button clicks with complex payloads), you may still prefer `useTransition` + `useState` or a mutation library. (Danh doi: useActionState tap trung vao form — nhan FormData. Cho mutation khong phai form, co the van can useTransition + useState.)
- Key rename history: React 18 canary had `useFormState` in `react-dom`. React 19 moved it to `react` as `useActionState` because it works beyond just DOM forms (React Native, etc.). Interviewers may test if you know this rename. (Lich su doi ten: React 18 canary co useFormState trong react-dom. React 19 chuyen sang react la useActionState vi hoat dong ngoai DOM forms.)
- Composability: multiple `useActionState` hooks can coexist in the same component for different form actions, each tracking its own state independently. (Kha nang ket hop: nhieu useActionState co the cung ton tai trong mot component cho cac action khac nhau, moi hook theo doi state doc lap.)

### Vi du / Example
```tsx
import { useActionState } from 'react';

type FormState = { error: string | null; success: boolean };

async function updateProfile(prev: FormState, formData: FormData): Promise<FormState> {
  'use server';
  const name = formData.get('name') as string;
  if (name.length < 2) return { error: 'Name too short', success: false };
  await db.users.update({ name });
  return { error: null, success: true };
}

export function ProfileForm() {
  const [state, action, isPending] = useActionState(updateProfile, {
    error: null,
    success: false,
  });

  return (
    <form action={action}>
      <input name="name" required />
      <button disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
      {state.error && <p className="error">{state.error}</p>}
      {state.success && <p className="success">Profile updated!</p>}
    </form>
  );
}
```

### Interview Notes / Ghi Chu Phong Van
- Emphasize the rename from `useFormState` to `useActionState` — this shows you follow React's evolution.
- The key insight is that `useActionState` unifies pending + result state in one hook, replacing 3 separate `useState` calls.
- Compare with `useReducer`: both are (prevState, input) => newState, but `useActionState` is async and tied to form submissions.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## useFormStatus

### Giai thich / Explanation

**English:** `useFormStatus` is a hook from `react-dom` that reads the submission status of the nearest parent `<form>`. It provides `{ pending, data, method, action }` without prop drilling.

**Tieng Viet:** `useFormStatus` la hook tu `react-dom` doc trang thai submission cua `<form>` cha gan nhat. No cung cap `{ pending, data, method, action }` ma khong can prop drilling.

### Key Points / Y Chinh
- `useFormStatus` must be called from a component that is rendered inside a `<form>` — calling it in the same component that renders the `<form>` tag will not work, because it reads from the parent form context. This is the most common interview trap. (useFormStatus phai goi tu component render ben trong <form> — goi trong cung component render <form> se khong hoat dong vi no doc tu parent form context. Day la bay phong van pho bien nhat.)
- It returns `{ pending: boolean, data: FormData | null, method: string, action: string | function }`. The `data` field contains the submitted FormData, useful for showing optimistic previews of what the user submitted. (Tra ve { pending, data, method, action }. Truong data chua FormData da gui, huu ich de hien thi optimistic preview.)
- Primary use case: building reusable submit buttons that automatically disable and show loading state during any form submission, without the parent passing `isLoading` props. (Use case chinh: xay dung nut submit tai su dung tu dong disable va hien loading state khi form dang submit, khong can parent truyen isLoading prop.)
- `useFormStatus` complements `useActionState`: use `useActionState` in the parent for result/error state, and `useFormStatus` in child components for pending UI. Together they cover the full form lifecycle. (useFormStatus bo sung useActionState: dung useActionState o parent cho result/error, useFormStatus o child cho pending UI. Cung nhau cover toan bo form lifecycle.)
- Trade-off: `useFormStatus` only works with native `<form>` elements using the `action` prop. Custom form implementations or non-form submission patterns cannot use this hook. (Danh doi: chi hoat dong voi native <form> dung action prop. Form tu dinh nghia hoac pattern khong phai form khong dung duoc hook nay.)
- The `method` and `action` fields are useful for forms that support multiple submission methods (e.g., a form with both "Save Draft" and "Publish" buttons using `formAction`). (Truong method va action huu ich cho form ho tro nhieu phuong thuc submit, vi du form co ca nut "Save Draft" va "Publish" dung formAction.)
- When combined with Server Components, `useFormStatus` enables a pattern where the form is a Server Component (zero JS) and only the submit button is a Client Component (minimal JS) — maximizing the server-rendered content. (Ket hop voi Server Components: form la Server Component (khong JS), chi nut submit la Client Component (it JS) — toi da hoa noi dung server-rendered.)
- Unlike `useTransition`'s `isPending`, `useFormStatus.pending` is scoped to the specific parent form, not to the entire transition. This distinction matters when multiple forms exist on the same page. (Khac useTransition isPending, useFormStatus.pending chi ap dung cho form cha cu the, khong phai toan bo transition. Quan trong khi nhieu form tren cung trang.)

### Vi du / Example
```tsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

// Usage: SubmitButton must be INSIDE the <form>
export function ContactForm() {
  async function sendMessage(formData: FormData) {
    'use server';
    await db.messages.create({ text: formData.get('message') as string });
  }

  return (
    <form action={sendMessage}>
      <textarea name="message" />
      <SubmitButton /> {/* reads pending from parent form */}
    </form>
  );
}
```

### Interview Notes / Ghi Chu Phong Van
- The key gotcha: `useFormStatus` must be in a **child** component of `<form>`, not the component that renders `<form>`.
- Compare with `useActionState`'s `isPending`: `useFormStatus` is for child components, `useActionState.isPending` is for the parent.
- Mention the reusable `<SubmitButton>` pattern as a practical real-world use case.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## useOptimistic

### Giai thich / Explanation

**English:** `useOptimistic` enables immediate UI updates before an async action completes, automatically reverting if the action fails. It provides a better UX by making interactions feel instant.

**Tieng Viet:** `useOptimistic` cho phep cap nhat UI ngay lap tuc truoc khi async action hoan thanh, tu dong revert neu action fail. Giup UX tot hon bang cach lam tuong tac cam thay tuc thi.

### Key Points / Y Chinh
- Signature: `const [optimisticState, addOptimistic] = useOptimistic(state, updateFn)`. The `updateFn` is `(currentState, optimisticValue) => newState` — a pure reducer that merges the optimistic update. (Chu ky: updateFn la (currentState, optimisticValue) => newState — mot reducer thuan tuy merge optimistic update.)
- The optimistic state automatically reverts to the real state when the Action's async function completes (either success or failure). You do not need to manually reset it. This is the key simplification over manual optimistic update patterns. (State optimistic tu dong revert ve state that khi Action hoan thanh (thanh cong hoac that bai). Khong can reset thu cong — day la diem don gian hoa chinh.)
- `useOptimistic` is designed to work inside Actions/transitions. If you call `addOptimistic` outside of a transition, React will warn you. This coupling ensures the revert mechanism works correctly. (useOptimistic duoc thiet ke de dung trong Actions/transitions. Goi addOptimistic ngoai transition se bi canh bao. Su gan ket nay dam bao co che revert hoat dong dung.)
- Common use case: "like" buttons, message sending, todo toggling — any interaction where the server response is predictable and waiting for confirmation degrades UX. (Use case pho bien: nut "like", gui tin nhan, toggle todo — bat ky tuong tac nao ma phan hoi server du doan duoc va cho xac nhan lam giam UX.)
- Trade-off: optimistic updates assume the server will succeed. For operations with high failure rates (payments, complex validations), showing a pending state via `isPending` is often better than optimistic updates. (Danh doi: optimistic update gia dinh server se thanh cong. Cho thao tac hay fail (thanh toan, validation phuc tap), hien pending state thuong tot hon.)
- You can stack multiple optimistic updates: if a user likes three posts rapidly, each `addOptimistic` call builds on the previous optimistic state, and all revert together when the action completes. (Co the chong nhieu optimistic update: neu user like 3 bai nhanh, moi addOptimistic xay tren state optimistic truoc, va tat ca revert cung luc khi action hoan thanh.)
- Error recovery pattern: when the action fails, the optimistic state reverts. You can then show a toast/notification explaining the failure. The key is that the UI never enters an inconsistent state. (Pattern phuc hoi loi: khi action fail, state optimistic revert. Sau do hien toast/notification giai thich loi. UI khong bao gio o trang thai khong nhat quan.)
- Comparison with React Query's `onMutate` optimistic update: React Query requires manual cache manipulation and rollback. `useOptimistic` is simpler but less powerful — no cache invalidation, no retry, no background sync. (So sanh voi React Query onMutate: React Query can thao tac cache va rollback thu cong. useOptimistic don gian hon nhung kem manh — khong cache invalidation, retry, hay background sync.)

### Vi du / Example
```tsx
import { useOptimistic } from 'react';
import { useActionState } from 'react';

type Message = { id: string; text: string; sending?: boolean };

export function Chat({ messages }: { messages: Message[] }) {
  const [optimisticMessages, addOptimistic] = useOptimistic(
    messages,
    (current: Message[], newMsg: Message) => [...current, { ...newMsg, sending: true }]
  );

  async function sendMessage(formData: FormData) {
    const text = formData.get('message') as string;
    addOptimistic({ id: crypto.randomUUID(), text });
    await fetch('/api/messages', { method: 'POST', body: formData });
  }

  return (
    <>
      {optimisticMessages.map((msg) => (
        <p key={msg.id} style={{ opacity: msg.sending ? 0.6 : 1 }}>
          {msg.text}
        </p>
      ))}
      <form action={sendMessage}>
        <input name="message" />
      </form>
    </>
  );
}
```

### Interview Notes / Ghi Chu Phong Van
- Key insight: `useOptimistic` is a controlled way to show "fake" state that automatically cleans up. No manual rollback code needed.
- Know when NOT to use it: high-failure-rate operations, operations with unpredictable outcomes.
- Compare with React Query's optimistic updates to show depth of understanding.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## use() API

### Giai thich / Explanation

**English:** `use()` is a new React API that reads the value of a resource (Promise or Context) during render. Unlike hooks, it can be called conditionally and inside loops, making it more flexible than `useContext` and enabling Suspense-based data loading.

**Tieng Viet:** `use()` la API React moi doc gia tri cua resource (Promise hoac Context) trong render. Khac voi hooks, no co the goi co dieu kien va trong vong lap, linh hoat hon `useContext` va cho phep tai du lieu dua tren Suspense.

### Key Points / Y Chinh
- `use(promise)` suspends the component until the promise resolves, integrating with `<Suspense>` boundaries. The promise must be created outside the render function (e.g., in a loader, parent component, or module scope) — creating a promise during render causes an infinite loop. (use(promise) suspend component den khi promise resolve, tich hop voi Suspense. Promise phai duoc tao ngoai render — tao trong render gay vong lap vo han.)
- `use(context)` is a drop-in replacement for `useContext(context)`, but with a critical advantage: it can be called inside `if` statements and loops. This enables conditional context reading, which was impossible with `useContext`. (use(context) thay the useContext(context) nhung co the goi trong if va loops. Cho phep doc context co dieu kien, dieu useContext khong lam duoc.)
- `use()` is NOT a hook (no "use" prefix convention for hooks applies). It doesn't follow the Rules of Hooks — this is intentional and a key interview distinction. It's a special API that React treats differently from hooks. (use() KHONG phai hook (khong theo quy tac dat ten hook). Khong tuan thu Rules of Hooks — day la y dinh va diem phan biet quan trong trong phong van.)
- Error handling: when a promise passed to `use()` rejects, the error propagates to the nearest Error Boundary, just like thrown errors in render. No try/catch needed in the component. (Xu ly loi: khi promise bi reject, loi lan toi Error Boundary gan nhat, giong nhu throw error trong render. Khong can try/catch trong component.)
- Trade-off vs. `useEffect` for data fetching: `use()` + Suspense avoids the "render-then-fetch" waterfall because the component suspends before rendering incomplete UI. `useEffect` renders loading state first, then fetches. (So sanh useEffect: use() + Suspense tranh waterfall "render-roi-fetch" vi component suspend truoc khi render UI thieu. useEffect render loading state truoc, roi fetch.)
- The promise passed to `use()` should be a stable reference — typically from a cache, loader, or `useMemo`. If you pass a new promise on every render, the component will suspend infinitely. Libraries like Next.js handle this automatically via their data fetching layer. (Promise truyen vao use() nen la tham chieu on dinh — tu cache, loader, hoac useMemo. Truyen promise moi moi render se suspend vo han. Next.js xu ly tu dong qua data fetching layer.)
- Pattern: `use()` enables the "fetch-then-render" pattern when combined with Server Components. The server pre-fetches data and passes promises to client components, which `use()` unwraps with Suspense. (Pattern: use() cho phep "fetch-then-render" khi ket hop Server Components. Server pre-fetch va truyen promise cho client component, use() unwrap voi Suspense.)
- `use()` supports both thenables and React Contexts. This dual nature makes it a unifying primitive — it reads any "reactive value" that React can track. Future React versions may extend `use()` to support other resource types. (use() ho tro ca thenables va React Context. Tinh chat kep nay lam no thanh primitive thong nhat — doc bat ky "gia tri reactive" nao React co the theo doi.)

### Vi du / Example
```tsx
import { use, Suspense } from 'react';

// Promise created OUTSIDE render (e.g., from a route loader)
async function fetchUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}

// Cache the promise so it's stable across renders
const userCache = new Map<string, Promise<User>>();
function getUserPromise(id: string) {
  if (!userCache.has(id)) {
    userCache.set(id, fetchUser(id));
  }
  return userCache.get(id)!;
}

function UserProfile({ userId }: { userId: string }) {
  const user = use(getUserPromise(userId)); // suspends until resolved
  return <h1>{user.name}</h1>;
}

// Conditional context reading — impossible with useContext
function ThemeLabel({ showTheme }: { showTheme: boolean }) {
  if (showTheme) {
    const theme = use(ThemeContext); // allowed! use() is not a hook
    return <span>{theme}</span>;
  }
  return null;
}

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile userId="123" />
    </Suspense>
  );
}
```

### Interview Notes / Ghi Chu Phong Van
- Key distinction: `use()` is NOT a hook — it can be called conditionally. This breaks the Rules of Hooks intentionally.
- The biggest gotcha: the promise must be stable (cached). Creating a new promise in render = infinite suspend loop.
- Frame `use()` as the bridge between async data and React's render model via Suspense.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Ref as Prop

### Giai thich / Explanation

**English:** In React 19, function components can accept `ref` as a regular prop without `forwardRef`. This removes a major API boilerplate and simplifies component composition.

**Tieng Viet:** Trong React 19, function component co the nhan `ref` nhu prop binh thuong ma khong can `forwardRef`. Dieu nay loai bo boilerplate API lon va don gian hoa viec ket hop component.

### Key Points / Y Chinh
- `forwardRef` is now deprecated in React 19. Function components automatically receive `ref` as a prop alongside other props. This eliminates wrapping components in `forwardRef()` and the associated type complexity. (forwardRef bi deprecated trong React 19. Function component tu dong nhan ref nhu prop. Loai bo viec bao component trong forwardRef() va do phuc tap TypeScript.)
- Migration is straightforward: remove the `forwardRef` wrapper, add `ref` to your props type, and use it directly. React provides a codemod (`react-codemod/remove-forward-ref`) to automate this across large codebases. (Chuyen doi don gian: xoa forwardRef wrapper, them ref vao props type, dung truc tiep. React cung cap codemod de tu dong hoa tren codebase lon.)
- TypeScript simplification: before, `forwardRef<RefType, PropsType>` required two generic parameters. Now, you just include `ref?: React.Ref<RefType>` in your props interface. This is cleaner and more intuitive. (Don gian hoa TypeScript: truoc can hai generic parameter, bay gio chi can ref?: React.Ref<RefType> trong props interface.)
- Ref cleanup functions: React 19 also adds support for returning a cleanup function from ref callbacks (`ref={(node) => { setup(node); return () => cleanup(node); }}`). This replaces the pattern of setting ref to null on unmount. (Ref cleanup function: React 19 them ho tro tra ve cleanup function tu ref callback. Thay the pattern set ref thanh null khi unmount.)
- Backward compatibility: existing `forwardRef` code continues to work in React 19 but will log deprecation warnings. You can migrate incrementally. (Tuong thich nguoc: code forwardRef hien tai van hoat dong trong React 19 nhung se log canh bao deprecated. Co the migrate dan dan.)
- This change makes HOC (Higher-Order Component) and render prop patterns simpler because ref forwarding was one of the main pain points with HOCs — you needed extra wrappers to pass refs through. (Thay doi nay lam HOC va render prop pattern don gian hon vi ref forwarding la mot diem dau chinh voi HOC — can wrapper them de truyen ref.)
- Interview relevance: this is a "cleanup" feature that shows React's commitment to reducing API surface. Mention it alongside other DX improvements like automatic batching (React 18) and the compiler (React 19). (Lien quan phong van: day la tinh nang "don dep" cho thay React cam ket giam API surface. Nhac cung voi auto batching (React 18) va compiler (React 19).)
- The ref prop behaves identically to any other prop in terms of reactivity — changing the ref from the parent will trigger the expected behavior. No special handling needed. (Ref prop hoat dong giong het prop khac ve reactivity — thay doi ref tu parent se trigger hanh vi mong doi. Khong can xu ly dac biet.)

### Vi du / Example
```tsx
// React 18 — forwardRef boilerplate
import { forwardRef } from 'react';

const Input = forwardRef<HTMLInputElement, { label: string }>(
  function Input({ label }, ref) {
    return <input ref={ref} aria-label={label} />;
  }
);

// React 19 — ref as a regular prop
function Input({ label, ref }: { label: string; ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} aria-label={label} />;
}

// Ref cleanup function (new in React 19)
function MeasuredDiv({ children }: { children: React.ReactNode }) {
  return (
    <div ref={(node) => {
      if (node) {
        const observer = new ResizeObserver(() => console.log('resized'));
        observer.observe(node);
        return () => observer.disconnect(); // cleanup!
      }
    }}>
      {children}
    </div>
  );
}
```

### Interview Notes / Ghi Chu Phong Van
- Lead with "forwardRef is deprecated" — this shows you know the latest API.
- Mention the codemod for migration and ref cleanup functions as two related improvements.
- This is a good "did you keep up with React 19?" signal question — interviewers use it to gauge currency.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Document Metadata APIs

### Giai thich / Explanation

**English:** React 19 natively supports rendering `<title>`, `<meta>`, and `<link>` tags anywhere in the component tree, and React automatically hoists them to the document `<head>`. This eliminates the need for libraries like `react-helmet`.

**Tieng Viet:** React 19 ho tro render `<title>`, `<meta>`, va `<link>` o bat ky dau trong component tree, va React tu dong hoist chung len `<head>`. Loai bo nhu cau dung thu vien nhu `react-helmet`.

### Key Points / Y Chinh
- React 19 intercepts `<title>`, `<meta>`, and `<link rel="stylesheet">` during rendering and moves them to `<head>` automatically. This works during SSR, streaming, and client-side rendering. (React 19 chan <title>, <meta>, <link rel="stylesheet"> trong rendering va chuyen len <head> tu dong. Hoat dong voi SSR, streaming, va client rendering.)
- Deduplication: if multiple components render the same `<meta>` tag (e.g., same `name` attribute), React deduplicates them. For `<title>`, the last rendered one wins. This matches user expectations for nested route layouts. (Khong trung lap: neu nhieu component render cung <meta> tag, React loai bo trung. Voi <title>, cai render cuoi cung thang. Phu hop layout route long nhau.)
- This replaces `react-helmet`, `react-helmet-async`, and Next.js `<Head>` component for basic metadata. For advanced SEO needs (structured data, Open Graph), you may still use a dedicated library or framework features. (Thay the react-helmet, react-helmet-async, va Next.js Head cho metadata co ban. Cho SEO nang cao, co the van can thu vien hoac tinh nang framework.)
- Streaming SSR benefit: metadata tags rendered by components are included in the initial HTML stream, ensuring search engine crawlers see correct metadata even with streaming. Previously, client-side helmet libraries would miss the initial SSR pass. (Loi ich SSR streaming: metadata tags duoc bao gom trong HTML stream ban dau, dam bao crawler thay metadata dung. Truoc day, thu vien helmet client-side bo lo SSR pass dau.)
- Component-level SEO: each page/route component can declare its own metadata inline, colocating content and metadata. This is a DX improvement over centralized metadata configuration. (SEO cap component: moi page/route co the khai bao metadata inline, dat noi dung va metadata cung cho. Cai thien DX so voi cau hinh metadata tap trung.)
- `<link rel="stylesheet" precedence="default">` with the `precedence` prop controls stylesheet ordering — React inserts stylesheets in precedence order regardless of where in the tree they are rendered. This solves CSS ordering issues in code-split apps. (precedence prop kiem soat thu tu stylesheet — React chen stylesheet theo thu tu precedence bat ke vi tri trong tree. Giai quyet van de thu tu CSS trong app code-split.)
- Trade-off: for complex metadata scenarios (dynamic OG images, JSON-LD, language alternates), framework-level solutions like Next.js `generateMetadata` provide more power. React 19's built-in support covers the 80% case. (Danh doi: cho metadata phuc tap (OG image dong, JSON-LD), giai phap framework nhu Next.js generateMetadata manh hon. React 19 bao phu 80% truong hop.)
- Interview insight: this feature demonstrates React's trend toward being a "full framework primitive" rather than just a UI library — handling concerns (metadata, assets, data loading) that previously required third-party libraries. (Goc nhin phong van: tinh nang nay cho thay xu huong React tro thanh "full framework primitive" thay vi chi la UI library — xu ly metadata, assets, data loading ma truoc can thu vien ben thu ba.)

### Vi du / Example
```tsx
// Metadata declared inline in a route component
function BlogPost({ post }: { post: Post }) {
  return (
    <article>
      <title>{post.title} | My Blog</title>
      <meta name="description" content={post.excerpt} />
      <meta property="og:title" content={post.title} />
      <link rel="canonical" href={`https://myblog.com/posts/${post.slug}`} />

      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}

// Nested layout — child's <title> overrides parent's
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <title>My Blog</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <nav>...</nav>
      {children} {/* child component's <title> wins */}
    </>
  );
}
```

### Interview Notes / Ghi Chu Phong Van
- Lead with "React 19 eliminates the need for react-helmet" — practical, memorable.
- Mention streaming SSR as the key technical advantage over client-side metadata libraries.
- Know the `precedence` prop for stylesheet ordering — it's a deep-cut interview question.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Asset Loading

### Giai thich / Explanation

**English:** React 19 introduces APIs for preloading assets (`preload`, `preinit`, `prefetchDNS`, `preconnect`) and Suspense integration for stylesheets, fonts, and scripts, preventing flash of unstyled content (FOUC) during navigation.

**Tieng Viet:** React 19 gioi thieu API preload tai nguyen (`preload`, `preinit`, `prefetchDNS`, `preconnect`) va tich hop Suspense cho stylesheet, font, script, ngan flash of unstyled content (FOUC) khi dieu huong.

### Key Points / Y Chinh
- `preload(href, options)` and `preinit(href, options)` from `react-dom` let components declare asset dependencies. `preinit` is for scripts/stylesheets that should load and execute immediately; `preload` is for resources needed soon but not immediately. (preload va preinit tu react-dom cho component khai bao asset dependency. preinit cho script/stylesheet can tai va thuc thi ngay; preload cho resource can som nhung khong ngay.)
- Suspense for stylesheets: `<link rel="stylesheet" precedence="high">` integrates with Suspense — React won't reveal the component's content until the stylesheet has loaded, preventing FOUC. (Suspense cho stylesheet: <link rel="stylesheet" precedence="high"> tich hop Suspense — React khong hien noi dung component cho den khi stylesheet tai xong, ngan FOUC.)
- `prefetchDNS(domain)` and `preconnect(domain)` are lightweight hints that resolve DNS or establish connections early, useful for third-party APIs or CDN resources that the user is likely to need. (prefetchDNS va preconnect la goi y nhe de resolve DNS hoac thiet lap ket noi som, huu ich cho API ben thu ba hoac CDN resource.)
- Async script deduplication: React 19 deduplicates `<script async src="...">` tags — if multiple components render the same script, React ensures it's only loaded once and in the correct order. (Loai bo trung async script: React 19 dam bao script chi tai mot lan du nhieu component render cung script.)
- Trade-off: these APIs are lower-level than framework solutions (Next.js `next/font`, Remix resource routes). For most apps using a framework, the framework handles asset loading automatically. These APIs matter when building without a framework or creating a custom framework. (Danh doi: cac API nay thap cap hon giai phap framework (Next.js next/font, Remix). Voi hau het app dung framework, framework xu ly tu dong. API nay quan trong khi xay dung khong framework hoac tao framework rieng.)
- Performance pattern: call `preload()` early in the component tree (e.g., in a route loader or layout) for resources that child components will need. This starts the download before the child components even render. (Pattern hieu suat: goi preload() som trong component tree cho resource ma child se can. Bat dau download truoc khi child render.)
- Streaming SSR integration: during streaming, React emits `<link rel="preload">` tags in the initial HTML before the component that needs the resource is streamed, giving the browser a head start on downloads. (Tich hop SSR streaming: khi streaming, React phat <link rel="preload"> trong HTML ban dau truoc khi component can resource duoc stream, cho browser bat dau download som.)
- These APIs work in both Server and Client Components, but have the most impact during SSR where they can inject hints into the HTML `<head>` before any JavaScript runs. (Cac API hoat dong trong ca Server va Client Components, nhung co tac dong lon nhat trong SSR khi chung co the chen goi y vao <head> truoc khi JS chay.)

### Vi du / Example
```tsx
import { preload, preinit, prefetchDNS, preconnect } from 'react-dom';

function App() {
  // Preconnect to API server early
  preconnect('https://api.example.com');
  prefetchDNS('https://cdn.example.com');

  // Preload a font the page will use
  preload('/fonts/inter.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });

  // Preinit a critical stylesheet
  preinit('/styles/critical.css', { as: 'style', precedence: 'high' });

  return <MainContent />;
}

// Stylesheet with Suspense integration — prevents FOUC
function DashboardPanel() {
  return (
    <>
      <link rel="stylesheet" href="/styles/dashboard.css" precedence="default" />
      <div className="dashboard">
        <h2>Dashboard</h2>
      </div>
    </>
  );
}
```

### Interview Notes / Ghi Chu Phong Van
- Position these APIs as "React's built-in performance hints" — they give you `<link rel="preload">` semantics at the component level.
- The most impactful point: Suspense for stylesheets prevents FOUC, which was a long-standing React SSR pain point.
- For framework users, acknowledge that frameworks abstract these APIs — but understanding the primitives shows depth.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Server Components Integration

### Giai thich / Explanation

**English:** React 19 stabilizes Server Components (RSC) — components that execute on the server, send serialized output to the client, and include zero JavaScript in the client bundle. They are the default in frameworks like Next.js 13+.

**Tieng Viet:** React 19 on dinh hoa Server Components (RSC) — component thuc thi tren server, gui output da serialize den client, va khong bao gom JavaScript trong client bundle. Chung la mac dinh trong framework nhu Next.js 13+.

### Key Points / Y Chinh
- Server Components run only on the server: they can directly access databases, file systems, and internal APIs without exposing credentials to the client. They send rendered output (RSC payload), not component code, to the browser. (Server Components chi chay tren server: co the truy cap truc tiep database, file system, API noi bo ma khong lo credentials cho client. Gui output da render, khong phai component code.)
- The `'use client'` directive marks a component as a Client Component — it's an explicit opt-in boundary. Everything without this directive is a Server Component by default (in frameworks that support RSC). (Directive 'use client' danh dau Client Component — la ranh gioi chon tham gia ro rang. Moi thu khong co directive nay la Server Component mac dinh.)
- RSC payload format: Server Components serialize to a JSON-like stream that includes rendered HTML, references to Client Components, and data. The client React runtime reconstructs the tree from this payload without downloading Server Component code. (Dinh dang RSC payload: Server Components serialize thanh stream giong JSON bao gom HTML da render, tham chieu den Client Components, va data. Client React runtime tai tao tree tu payload nay.)
- Composition model: Server Components can import and render Client Components, but Client Components cannot import Server Components. However, Client Components can receive Server Components as `children` props (the "donut pattern"). (Mo hinh ket hop: Server Components co the import va render Client Components, nhung Client Components khong the import Server Components. Tuy nhien, Client Components co the nhan Server Components qua children props — "donut pattern".)
- Trade-off: Server Components eliminate client JS but add server compute cost. Every navigation may require a server round-trip (unless cached). For static content this is excellent; for highly interactive UIs, you still need Client Components. (Danh doi: Server Components loai bo client JS nhung them chi phi server compute. Moi navigation co the can server round-trip (tru khi cache). Cho noi dung tinh rat tot; cho UI tuong tac cao, van can Client Components.)
- Data fetching: Server Components can use `async/await` directly — they are async functions. No need for `useEffect`, `useState`, `useQuery`, or any client-side data fetching library for initial data loading. (Data fetching: Server Components dung async/await truc tiep — chung la async function. Khong can useEffect, useState, useQuery, hay bat ky thu vien fetch client-side nao cho tai du lieu ban dau.)
- Caching and revalidation: frameworks implement caching strategies on top of RSC (Next.js uses `revalidatePath`, `revalidateTag`). Understanding that RSC is the primitive and caching is the framework's responsibility is important for interviews. (Caching va revalidation: framework implement chien luoc cache tren RSC (Next.js dung revalidatePath, revalidateTag). Hieu rang RSC la primitive va caching la trach nhiem cua framework.)
- Bundle size impact: moving data-heavy components (charts, tables, markdown renderers) to Server Components can dramatically reduce client bundle size because their dependencies (e.g., `marked`, `highlight.js`, `d3`) stay on the server. (Tac dong bundle size: chuyen component nang du lieu (chart, table, markdown renderer) sang Server Components co the giam dang ke client bundle vi dependencies nhu marked, highlight.js, d3 o lai tren server.)

### Vi du / Example
```tsx
// Server Component (default — no directive needed)
import { db } from '@/lib/db'; // direct database access

async function PostList() {
  const posts = await db.posts.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <LikeButton postId={post.id} initialCount={post.likes} />
        </li>
      ))}
    </ul>
  );
}

// Client Component — interactive, includes JS in bundle
'use client';
import { useState } from 'react';

function LikeButton({ postId, initialCount }: { postId: string; initialCount: number }) {
  const [likes, setLikes] = useState(initialCount);
  return <button onClick={() => setLikes((c) => c + 1)}>{likes} likes</button>;
}
```

### Interview Notes / Ghi Chu Phong Van
- Frame RSC as "zero-JS components that run on the server" — this is the elevator pitch.
- Know the composition rules: Server can render Client, Client can receive Server as children, Client cannot import Server.
- Discuss the trade-off: less client JS vs. more server compute and potential latency.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Improved Error Reporting

### Giai thich / Explanation

**English:** React 19 improves error handling with better error messages, no duplicate logging in development, and new `onCaughtError`/`onUncaughtError`/`onRecoverableError` callbacks on `createRoot`/`hydrateRoot` for granular error management.

**Tieng Viet:** React 19 cai thien xu ly loi voi thong bao loi tot hon, khong log trung lap trong development, va callback moi `onCaughtError`/`onUncaughtError`/`onRecoverableError` tren `createRoot`/`hydrateRoot` cho quan ly loi chi tiet.

### Key Points / Y Chinh
- React 19 removes duplicate console error logging in development mode. Previously, React would log errors twice (once from React, once from the browser) — this caused confusion and noise. Now each error is logged exactly once with a clear stack trace. (React 19 loai bo log loi trung lap trong development mode. Truoc day React log loi 2 lan — gay nham lan. Bay gio moi loi log dung 1 lan voi stack trace ro rang.)
- New root-level error callbacks provide three tiers: `onCaughtError` (caught by an Error Boundary), `onUncaughtError` (not caught, app crashes), and `onRecoverableError` (React recovered automatically, e.g., hydration mismatch fixed by client re-render). (Callback loi moi o root cung cap 3 cap: onCaughtError (Error Boundary bat), onUncaughtError (khong bat duoc, app crash), onRecoverableError (React tu phuc hoi, vi du hydration mismatch sua bang client re-render).)
- `onRecoverableError` is especially important for monitoring: it fires when React silently recovers from hydration mismatches. Without this callback, you would never know your SSR output didn't match the client, which can cause subtle UI bugs. (onRecoverableError dac biet quan trong cho monitoring: fire khi React am tham phuc hoi tu hydration mismatch. Khong co callback nay, ban se khong biet SSR output khong khop client.)
- Error Boundary improvements: error boundaries now receive more detailed error info including the component stack trace as a string, making it easier to log to monitoring services like Sentry or Datadog. (Cai thien Error Boundary: error boundary nhan thong tin loi chi tiet hon bao gom component stack trace, de log den dich vu monitoring nhu Sentry hay Datadog.)
- Hydration error messages in React 19 show a diff between server and client HTML, making it dramatically easier to debug hydration mismatches. Previously, the error messages were vague and unhelpful. (Thong bao loi hydration trong React 19 hien diff giua server va client HTML, de debug hydration mismatch hon nhieu. Truoc day thong bao mo ho va khong huu ich.)
- Trade-off: the improved error reporting adds slightly more development-mode overhead. In production, errors are still lean. The three-tier callback system requires intentional setup but provides much better observability. (Danh doi: error reporting cai thien them overhead development-mode. Production van lean. He thong callback 3 cap can setup co chu dich nhung cung cap observability tot hon.)
- Interview pattern: describe a scenario where `onRecoverableError` would catch a hydration mismatch caused by `Date.now()` or `Math.random()` in SSR, and explain how you'd fix it (move to `useEffect` or use a seed). (Pattern phong van: mo ta tinh huong onRecoverableError bat hydration mismatch do Date.now() hoac Math.random() trong SSR, va giai thich cach sua.)
- Error messages now include the component name and file location in development, making it trivial to trace errors to their source without reading through a long component stack. (Thong bao loi bao gom ten component va vi tri file trong development, de dang truy nguon loi ma khong can doc qua component stack dai.)

### Vi du / Example
```tsx
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root')!, {
  onCaughtError(error, errorInfo) {
    // Error was caught by an Error Boundary
    console.log('Caught by boundary:', error.message);
    console.log('Component stack:', errorInfo.componentStack);
    reportToSentry(error, { componentStack: errorInfo.componentStack });
  },
  onUncaughtError(error, errorInfo) {
    // Error was NOT caught — app will crash
    console.error('Uncaught error:', error);
    showCrashScreen();
  },
  onRecoverableError(error, errorInfo) {
    // React recovered (e.g., hydration mismatch re-rendered on client)
    console.warn('Recoverable:', error.message);
    reportToMonitoring('hydration-mismatch', error);
  },
});

root.render(<App />);
```

### Interview Notes / Ghi Chu Phong Van
- Lead with the three error tiers: caught, uncaught, recoverable — this shows you understand React's error model deeply.
- `onRecoverableError` for hydration mismatch monitoring is a senior-level insight that most candidates miss.
- Mention the dev-mode improvement (no more double error logs) as a practical DX win.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Activity (Offscreen evolution)

### Giai thich / Explanation

**English:** `<Activity>` (formerly Offscreen) is an experimental API that lets React keep component state in memory while the component is visually hidden, enabling instant back/forward navigation and tab switching without remounting.

**Tieng Viet:** `<Activity>` (truoc day la Offscreen) la API thu nghiem cho phep React giu state component trong bo nho khi component bi an truc quan, cho phep dieu huong back/forward va chuyen tab tuc thi ma khong remount.

### Key Points / Y Chinh
- `<Activity mode="hidden">` hides the component visually (similar to `display: none`) but keeps its state, DOM, and effects alive. When switched to `mode="visible"`, the component reappears instantly without re-rendering or re-fetching data. (Activity mode="hidden" an component truc quan nhung giu state, DOM, va effects song. Khi chuyen sang mode="visible", component xuat hien tuc thi khong can re-render hay re-fetch.)
- Primary use case: tab interfaces, wizard/stepper flows, and back/forward navigation caches. Instead of unmounting tabs when the user switches, wrap them in `<Activity>` to preserve their state. (Use case chinh: giao dien tab, wizard/stepper, va cache dieu huong back/forward. Thay vi unmount tab khi chuyen, bao trong Activity de giu state.)
- Effect lifecycle with Activity: when a component is hidden via Activity, its effects are cleaned up (returned cleanup functions run). When the component becomes visible again, effects re-run. This prevents hidden components from maintaining subscriptions or timers. (Lifecycle effect voi Activity: khi component bi an qua Activity, effects duoc don dep. Khi visible lai, effects chay lai. Ngan component an duy tri subscriptions hoac timer.)
- Trade-off: keeping hidden component state in memory increases memory usage. For apps with many heavy views, you need to balance instant switching UX against memory pressure. Activity is best for a small number of important views, not for caching everything. (Danh doi: giu state component an trong bo nho tang su dung memory. Voi app co nhieu view nang, can can bang UX chuyen tuc thi voi ap luc memory. Activity tot nhat cho so luong nho view quan trong.)
- Relationship to `<Suspense>`: Activity and Suspense are complementary. Suspense handles "not yet loaded" (loading state), while Activity handles "previously loaded but currently hidden" (cached state). Together they cover the full lifecycle of content visibility. (Quan he voi Suspense: Activity va Suspense bo sung nhau. Suspense xu ly "chua tai" (loading state), Activity xu ly "da tai nhung dang an" (cached state).)
- Pre-rendering: Activity can pre-render content at low priority before the user navigates to it. For example, pre-rendering the next page in a paginated list while the user reads the current page. (Pre-rendering: Activity co the render truoc noi dung o muc do uu tien thap truoc khi user navigate. Vi du, render truoc trang tiep theo trong danh sach phan trang.)
- This API is still experimental/unstable as of React 19.x — it may change before becoming stable. In interviews, mention it as a forward-looking feature and explain the concept, but note its experimental status. (API nay van thu nghiem trong React 19.x — co the thay doi. Trong phong van, nhac nhu tinh nang huong toi tuong lai va giai thich khai niem, nhung luu y trang thai thu nghiem.)
- Comparison with `keep-alive` in Vue: similar concept — both preserve component state when hidden. React's Activity integrates with the concurrent rendering model, allowing priority-based pre-rendering that Vue's `keep-alive` doesn't support. (So sanh voi keep-alive trong Vue: khai niem tuong tu — ca hai giu state component khi an. Activity cua React tich hop voi concurrent rendering, cho phep pre-rendering theo priority ma Vue keep-alive khong ho tro.)

### Vi du / Example
```tsx
import { Activity, useState } from 'react';

function TabContainer() {
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'settings'>('home');

  return (
    <div>
      <nav>
        <button onClick={() => setActiveTab('home')}>Home</button>
        <button onClick={() => setActiveTab('profile')}>Profile</button>
        <button onClick={() => setActiveTab('settings')}>Settings</button>
      </nav>

      {/* All tabs stay mounted — hidden ones preserve state */}
      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <HomeTab />
      </Activity>
      <Activity mode={activeTab === 'profile' ? 'visible' : 'hidden'}>
        <ProfileTab /> {/* scroll position, form input preserved */}
      </Activity>
      <Activity mode={activeTab === 'settings' ? 'visible' : 'hidden'}>
        <SettingsTab />
      </Activity>
    </div>
  );
}
```

### Interview Notes / Ghi Chu Phong Van
- Position Activity as "Vue's keep-alive for React, but integrated with concurrent rendering."
- Emphasize the effect cleanup behavior — hidden components don't maintain active subscriptions, which is a common concern.
- Note this is experimental — interviewers appreciate candidates who know the stability status of features.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Cau Hoi Phong Van / Interview Q&A

### Q1: What problem does React Compiler solve, and what are its limitations? / React Compiler giai quyet van de gi va co han che gi? 🟡 Mid

**A:** React Compiler automatically memoizes components and values at build time, eliminating the need for manual `React.memo`, `useMemo`, and `useCallback`. It performs static analysis to track which values depend on which inputs and inserts fine-grained memoization.

**Limitations:** It requires code to follow the Rules of React (pure render functions, no side effects during render). It cannot optimize dynamic patterns like `eval()`, non-deterministic code, or code that mutates during render. It increases build time in exchange for runtime performance.

Giải thích tiếng Việt: Compiler tự động memo hóa tại build time, loại bỏ nhu cầu memo thủ công. Hạn chế: yêu cầu code tuân thủ Rules of React, không tối ưu được code động hoặc có side effect trong render.

### Q2: How do Actions differ from traditional onSubmit handlers? / Actions khác gì so với onSubmit handler truyền thống? 🟡 Mid

**A:** Actions integrate with React's transition system to provide automatic `isPending` state, sequential submission handling (no race conditions), and progressive enhancement (forms work before JS loads with Server Actions). Traditional `onSubmit` requires manual state management for loading/error/success, manual race condition handling, and provides no progressive enhancement.

The key architectural difference: Actions treat form submissions as transitions, keeping the UI responsive. `onSubmit` handlers block the UI thread unless you manually implement `startTransition`.

Giải thích tiếng Việt: Actions tích hợp transition system với isPending tự động, xử lý submit tuần tự (không race condition), và progressive enhancement. onSubmit truyền thống cần quản lý state thủ công cho loading/error/success.

### Q3: Explain the relationship between useActionState, useFormStatus, and useOptimistic. / Giải thích mối quan hệ giữa useActionState, useFormStatus, và useOptimistic. 🔴 Senior

**A:** These three hooks form a complete form mutation system:
- **useActionState** is used in the parent component that owns the form. It wraps the action function and returns `[state, formAction, isPending]` — managing the result/error state and pending status.
- **useFormStatus** is used in child components inside the `<form>`. It reads `{ pending, data, method, action }` from the nearest parent form context — ideal for reusable submit buttons that need to know if any form action is running.
- **useOptimistic** provides immediate UI feedback before the action completes, automatically reverting if the action fails.

Together: `useActionState` manages the action lifecycle, `useFormStatus` distributes pending state to children without prop drilling, and `useOptimistic` makes the UI feel instant during the async gap.

Giải thích tiếng Việt: Ba hook tạo thành hệ thống mutation form hoàn chỉnh. useActionState quản lý lifecycle ở parent, useFormStatus phân phối pending state cho children không cần prop drilling, useOptimistic cho UI cảm giác tức thì trong khoảng async.

### Q4: Why is use() not a hook, and what implications does this have? / Tại sao use() không phải là hook, và điều này có ý nghĩa gì? 🔴 Senior

**A:** `use()` intentionally breaks the Rules of Hooks — it can be called inside conditionals, loops, and early returns. This is possible because `use()` is not stored in a linked list of hook calls like `useState` or `useEffect`. Instead, React resolves it at call time by reading the current value of the resource (promise or context).

**Implications:**
1. You can conditionally read context: `if (showTheme) { const theme = use(ThemeContext); }` — impossible with `useContext`.
2. You can read promises in render, integrating with Suspense for data loading without `useEffect`.
3. The mental model is different: hooks are "subscriptions set up once," while `use()` is "read a value right now."

**Key gotcha:** Promises passed to `use()` must be stable references (cached). Creating a new promise in render causes infinite suspension.

Giải thích tiếng Việt: use() cố ý phá vỡ Rules of Hooks — có thể gọi trong if, loops. Không lưu trong linked list hook như useState. Cho phép đọc context có điều kiện và đọc promise trong render với Suspense. Promise phải là tham chiếu ổn định (cached).

### Q5: How do Server Components affect application architecture? / Server Components ảnh hưởng thế nào đến kiến trúc ứng dụng? 🔴 Senior

**A:** Server Components fundamentally change the component model by splitting the tree into server-executed (zero client JS) and client-executed pieces. Architectural impacts:

1. **Data layer:** Server Components access databases directly — no API routes needed for initial data. This eliminates the "API layer" for read operations.
2. **Bundle size:** Heavy dependencies (markdown parsers, date libraries, ORMs) stay on the server. Client bundle only includes interactive components.
3. **Composition rules:** Server can render Client, but not vice versa. Client can receive Server as `children` (donut pattern). This forces a top-down data flow architecture.
4. **Caching:** Server-side rendering means caching moves from client (React Query) to server/edge (CDN, ISR). Different invalidation strategies needed.

**Trade-off:** More server compute, potential latency for every navigation (mitigated by caching), and a new mental model developers must learn.

Giải thích tiếng Việt: Server Components thay đổi mô hình component bằng cách chia tree thành phần server (không JS client) và phần client. Tác động: truy cập DB trực tiếp (không cần API route), giảm bundle size, quy tắc composition mới, và caching chuyển từ client sang server/edge.

### Q6: What is the ref cleanup function pattern in React 19, and when would you use it? / Pattern ref cleanup function trong React 19 là gì, và khi nào dùng? 🟡 Mid

**A:** React 19 allows ref callbacks to return a cleanup function, similar to `useEffect` cleanup. Previously, you had to check for `null` to handle unmount:

```tsx
// Before: check null for cleanup
<div ref={(node) => {
  if (node) { observer.observe(node); }
  else { observer.disconnect(); } // null = unmount
}} />

// React 19: explicit cleanup function
<div ref={(node) => {
  const observer = new ResizeObserver(() => {});
  observer.observe(node);
  return () => observer.disconnect(); // cleanup on unmount
}} />
```

**Use cases:** ResizeObserver, IntersectionObserver, MutationObserver, third-party library initialization/teardown, measuring DOM elements. The cleanup pattern is clearer because you close over the exact resources created during setup.

Giải thích tiếng Việt: React 19 cho phép ref callback trả về cleanup function, giống useEffect cleanup. Trước đây phải kiểm tra null để xử lý unmount. Pattern mới rõ ràng hơn vì closure over chính xác resource được tạo trong setup.

### Q7: Compare React 19's document metadata with react-helmet. / So sánh document metadata của React 19 với react-helmet. 🟡 Mid

**A:** React 19's built-in metadata has three key advantages over react-helmet:

1. **Streaming SSR:** Metadata tags are included in the initial HTML stream. react-helmet-async requires collecting metadata after render and injecting it, which doesn't work with streaming.
2. **No extra dependency:** Built into React — no library to install, no `<HelmetProvider>` wrapper, no risk of the library falling behind React updates.
3. **Precedence-based stylesheet ordering:** The `precedence` prop on `<link>` controls CSS insertion order, solving code-split CSS ordering issues that helmet never addressed.

**When you still need helmet/alternatives:** Complex SEO (JSON-LD structured data, dynamic OG images), or if you need metadata manipulation in event handlers (not render). For most apps, React 19 built-in is sufficient.

Giải thích tiếng Việt: React 19 metadata có 3 ưu điểm: hoạt động với streaming SSR, không cần thêm dependency, và precedence prop kiểm soát thứ tự CSS. Vẫn cần react-helmet cho SEO phức tạp như JSON-LD hoặc OG image động.

### Q8: How would you incrementally adopt React Compiler in a large codebase? / Làm thế nào để adopt React Compiler từng bước trong codebase lớn? 🔴 Senior

**A:** Incremental adoption strategy:

1. **Audit first:** Run `eslint-plugin-react-compiler` across the codebase to identify components that violate the Rules of React (mutations in render, conditional hooks).
2. **Fix violations:** Address ESLint warnings — most are genuine bugs (e.g., mutating props, side effects in render). This improves code quality regardless of compiler adoption.
3. **Enable per-directory:** Configure the Babel/SWC plugin to compile only specific directories first (e.g., shared UI components, then page components).
4. **Measure:** Compare bundle size, runtime performance (React DevTools Profiler), and build times before/after. The compiler may increase build time 10-30%.
5. **Remove manual memoization:** After the compiler is enabled, existing `React.memo`, `useMemo`, `useCallback` are redundant. Remove them gradually — the codemod helps.
6. **Monitor production:** Watch for regressions. The compiler should never change behavior, but edge cases exist with non-pure code that passed undetected.

Giải thích tiếng Việt: Chiến lược adopt từng bước: chạy ESLint plugin để audit, sửa violations, bật compiler theo từng thư mục, đo lường hiệu suất, xóa memo thủ công dần dần, và giám sát production.

### Q9: Explain Activity API and compare it to Vue's keep-alive. / Giải thích Activity API và so sánh với keep-alive của Vue. 🟡 Mid

**A:** Both React's `<Activity>` and Vue's `<keep-alive>` preserve component state when hidden, avoiding remount cost. Key differences:

1. **Concurrent rendering integration:** Activity works with React's concurrent features — hidden components can be pre-rendered at low priority, and their rendering can be interrupted. Vue's keep-alive is synchronous.
2. **Effect lifecycle:** Activity cleans up effects when hidden and re-runs them when visible. Vue's keep-alive uses `activated`/`deactivated` lifecycle hooks — a different abstraction level.
3. **Stability:** Vue's keep-alive is stable and battle-tested. React's Activity is experimental as of React 19 and may change.
4. **Pre-rendering:** Activity supports pre-rendering content before the user navigates to it (e.g., next page in pagination). Vue's keep-alive only caches previously-visited content.

**Trade-off for both:** Memory usage increases with each cached view. Both require careful consideration of which views to cache.

Giải thích tiếng Việt: Cả Activity (React) và keep-alive (Vue) đều giữ state component khi ẩn. Activity tích hợp concurrent rendering và pre-rendering, nhưng còn experimental. keep-alive của Vue ổn định hơn nhưng đồng bộ, không hỗ trợ pre-rendering.

### Q10: What are the most common React 19 migration pitfalls? / Những lỗi thường gặp nhất khi migrate sang React 19 là gì? 🟡 Mid

**A:** Key migration pitfalls:

1. **`useFormState` renamed to `useActionState`** and moved from `react-dom` to `react`. Old imports will break.
2. **`forwardRef` deprecation warnings:** Existing `forwardRef` code works but logs warnings. Use the codemod to convert.
3. **Ref callback cleanup:** If your ref callbacks return a value (accidentally), React 19 will treat it as a cleanup function. Previously, return values were ignored.
4. **String refs removed:** `this.refs.myRef` string ref pattern is fully removed (was deprecated since React 16).
5. **`ReactDOM.render` removed:** Must use `createRoot`. Legacy render API throws in React 19.
6. **Context as provider:** `<MyContext.Provider>` changes to `<MyContext>` as the provider — `Context.Provider` is deprecated.
7. **`propTypes` and `defaultProps` on function components** are removed. Use JS default parameters instead.

Giải thích tiếng Việt: Các lỗi migrate phổ biến: đổi tên useFormState thành useActionState, forwardRef deprecated, ref callback cleanup function mới, string refs bị xóa, ReactDOM.render bị xóa (phải dùng createRoot), Context.Provider deprecated, propTypes/defaultProps trên function component bị xóa.

## Revision Checklist / Danh Sach On Tap

- [ ] Can you explain React Compiler's build-time memoization vs. manual `useMemo`/`useCallback`? Bạn có thể giải thích memo tự động của Compiler so với memo thủ công?
- [ ] Can you describe the full Actions + useActionState + useFormStatus + useOptimistic lifecycle for a form mutation? Bạn có thể mô tả lifecycle đầy đủ cho form mutation?
- [ ] Can you explain why `use()` is not a hook and what this enables (conditional context, promise reading)? Bạn có thể giải thích tại sao use() không phải hook và điều này cho phép gì?
- [ ] Can you describe the Server Component composition rules (server renders client, donut pattern)? Bạn có thể mô tả quy tắc composition của Server Component?
- [ ] Can you explain `forwardRef` deprecation and the new ref-as-prop pattern with cleanup functions? Bạn có thể giải thích forwardRef deprecated và pattern ref-as-prop mới?
- [ ] Can you compare React 19 document metadata with react-helmet for SSR streaming scenarios? Bạn có thể so sánh metadata React 19 với react-helmet cho SSR streaming?
- [ ] Can you describe `preload`, `preinit`, `prefetchDNS`, `preconnect` and when to use each? Bạn có thể mô tả preload, preinit, prefetchDNS, preconnect và khi nào dùng?
- [ ] Can you explain the three error callback tiers (onCaughtError, onUncaughtError, onRecoverableError)? Bạn có thể giải thích 3 callback lỗi?
- [ ] Can you compare Activity API with Vue's keep-alive and explain the effect cleanup behavior? Bạn có thể so sánh Activity API với Vue keep-alive?
- [ ] Can you list the top React 19 migration pitfalls (renamed APIs, removed features)? Bạn có thể liệt kê các lỗi migrate React 19 phổ biến?
