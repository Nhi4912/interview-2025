# Modern React Features (18–19) — Theory / Tính Năng React Hiện Đại

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [React Fundamentals](./01-react-fundamentals.md) | [Hooks Deep Dive](./03-hooks-deep-dive.md)
> **See also**: [React 19 Deep Dive](./02-react-19-features.md) | [Next.js App Router](../04-nextjs/01-app-router-server-components.md)

[← Previous](./09-performance-optimization.md) | [Back to Table of Contents](../../00-table-of-contents.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**English:** Your team is migrating the VNG dashboard from React 17 to React 18. The PM asks: "Will users notice the improvement?" Meanwhile, the backend team asks: "Do we still need the REST API layer if we use Server Components?" And the tech lead says: "Can we remove all the `useMemo` calls after enabling React Compiler?"

**Tiếng Việt:** Team đang migrate VNG dashboard từ React 17 lên React 18. PM hỏi: "User có thấy khác không?" Backend team hỏi: "Dùng Server Components thì còn cần REST API không?" Tech lead hỏi: "Bật React Compiler lên có xóa hết useMemo được không?"

**Why this matters**: All three questions require understanding the fundamental model shifts in React 18/19 — not just the API names.

---

## What & Why / Cái Gì & Tại Sao

**React 18 shift**: Moved from synchronous, all-or-nothing rendering to **concurrent rendering** — React can now pause, prioritize, and restart work. This enables transitions (non-urgent renders), streaming SSR, and safe external store subscriptions.

**React Server Components shift**: Moved from "components always run on client" to "components can run on server, never shipping JS to client". This eliminates the need for a separate REST API layer for read operations.

**React 19/Compiler shift**: Moved from "developer manually specifies memoization" to "compiler statically analyzes and inserts memoization automatically". This changes the performance optimization workflow.

---

## Core Concept 1: React 18 — Concurrent Rendering & Automatic Batching

> 🧠 **Memory Hook**: "Concurrent React = React can **pause** an expensive render mid-way, handle urgent work (user types), then **resume** — like a surgeon who pauses mid-operation to handle an emergency."

**Tại sao tồn tại? / Why does this exist?**
React 17 rendering was synchronous: once started, it ran to completion without interruption.
→ Why is that a problem? A 300ms render (filtering 5000 items) blocks the event loop — user input is queued, UI feels frozen.
→ Why couldn't React just render faster? Some computations are inherently slow; the solution is to make slow renders **non-blocking**, not faster.

### Layer 1: The Concurrent Model

```
React 17 (synchronous):
render starts ──────────────────────────────── render finishes
              [no interruption possible, UI frozen for 300ms]

React 18 (concurrent):
render starts ──── [user types] ──── resume ──── render finishes
                    React pauses,     React
                    handles typing    resumes
                    (1ms work),       non-urgent
                    delivers result   render
```

**Key: React doesn't render faster — it interleaves urgent and non-urgent work.**

### Layer 2: Automatic Batching

**React 17**: batched setState only inside React event handlers.
**React 18**: batches setState everywhere, including `setTimeout`, Promises, and native event listeners.

```tsx
// React 17: setTimeout causes 2 renders
setTimeout(() => {
  setCount((c) => c + 1); // render 1
  setFlag((f) => !f); // render 2
}, 0);

// React 18: setTimeout batched to 1 render
setTimeout(() => {
  setCount((c) => c + 1); // \
  setFlag((f) => !f); //  → 1 render
}, 0);

// Opt out if needed (rare):
import { flushSync } from "react-dom";
flushSync(() => setCount((c) => c + 1)); // forces immediate render
```

### Layer 3: Streaming SSR

**React 17 SSR flow:**

```
1. Server: renderToString() → waits for ALL data → sends full HTML
2. Browser: downloads full HTML → hydrates entire page → interactive
   [User sees blank page until step 2 completes]
```

**React 18 Streaming SSR:**

```
1. Server: renderToPipeableStream() → sends HTML as it's ready
2. Shell HTML (layout, nav) arrives first → user sees page immediately
3. <Suspense> boundaries stream as resolved → progressive reveal
4. Selective hydration: React hydrates components as they stream in

<Suspense fallback={<ProductSkeleton />}>
  <ProductDetails />  ← streams when its async data resolves
</Suspense>
```

**New React 18 hooks for concurrent safety:**

- `useId` — SSR-safe unique IDs based on fiber tree position
- `useSyncExternalStore` — subscribe to external stores without tearing
- `useInsertionEffect` — CSS-in-JS style injection before layout effects

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                             | Tại sao sai                                                           | Đúng là                                                                                  |
| --------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| "Concurrent rendering makes React faster"           | It makes React non-blocking, not faster — the same work is still done | Concurrent rendering improves **responsiveness** (perceived performance), not throughput |
| Using `ReactDOM.render` after upgrading to React 18 | Legacy root disables all concurrent features                          | Must use `createRoot` to unlock concurrent mode                                          |
| Thinking automatic batching breaks existing code    | Batching more is generally safe — renders are still consistent        | Only breaks if you relied on intermediate renders (use `flushSync` in that rare case)    |

**🎯 Interview Pattern:**

- Khi thấy: "What changed in React 18 and why should I upgrade?"
- → Nhớ: Concurrent rendering = interruptible = responsive UI; auto-batching = fewer renders; streaming SSR = faster TTFB
- → Mở đầu: "React 18's core change is concurrent rendering — instead of blocking the browser for an entire render, React can pause, handle urgent user input, and resume. This enables three things: useTransition for non-urgent state, streaming SSR, and tearing-safe external store subscriptions."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [Hooks Comprehensive — useTransition/useDeferredValue](./07-hooks-comprehensive.md)
- ➡️ Để hiểu: [Performance Optimization — profiling concurrent renders](./09-performance-optimization.md)

---

## Core Concept 2: Server Components — Architecture & Boundaries

> 🧠 **Memory Hook**: "Server Component = **zero bytes** shipped to browser. It renders on server and sends **HTML**, not JavaScript. 'use client' draws the boundary where JavaScript begins."

**Tại sao tồn tại? / Why does this exist?**
Traditional React components always ran in the browser, meaning every library, query, and logic needed to ship as JavaScript to the client.
→ Why is that a problem? A product page might ship 200KB of JS just to fetch and display data that never changes interactively.
→ Why not just use SSR? Classic SSR (getServerSideProps) still ships the component as JS to hydrate. Server Components don't hydrate — they're not in the client bundle at all.

### Layer 1: Component Types

```
SERVER COMPONENT              CLIENT COMPONENT
───────────────────           ────────────────
Runs: server only             Runs: client (+ server for hydration)
JS shipped: 0 bytes           JS shipped: full component
Can: async/await              Can: useState, useEffect, hooks
Can: DB queries               Can: event handlers, browser APIs
Cannot: hooks                 Cannot: async component function
Cannot: browser APIs          Marked with: 'use client' directive
Default in Next.js App Router
```

### Layer 2: The Boundary Rules

```tsx
// ✅ Server component imports client component — allowed
// Server renders its own HTML + sends ClientButton as JS bundle
async function ProductPage({ id }: { id: string }) {
  const product = await db.products.findById(id); // direct DB query!

  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
      <AddToCartButton productId={id} /> {/* Client Component */}
    </div>
  );
}

// 'use client' marks the boundary
("use client");
function AddToCartButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false); // hooks allowed here
  return (
    <button
      onClick={() => {
        addToCart(productId);
        setAdded(true);
      }}
    >
      {added ? "Added!" : "Add to Cart"}
    </button>
  );
}

// ❌ Client component cannot import server component directly
("use client");
import ServerComponent from "./ServerComponent"; // ❌ error
// ✅ Pass server component as children prop instead
function ClientWrapper({ children }) {
  const [open, setOpen] = useState(false);
  return <div>{open && children}</div>;
}
// Parent (server): <ClientWrapper><ServerComponent /></ClientWrapper>
```

### Layer 3: Server Actions — Mutations Without API Routes

```tsx
// ❌ Before Server Actions: needed API route + fetch + error handling
async function handleSubmit(formData) {
  const res = await fetch("/api/update-profile", { method: "POST", body: formData });
}

// ✅ Server Action: function runs on server, called from client
("use server");
async function updateProfile(formData: FormData) {
  const name = formData.get("name");
  await db.users.update({ name });
  revalidatePath("/profile");
}

// Client component uses server action directly
<form action={updateProfile}>
  <input name="name" />
  <button type="submit">Save</button>
</form>;
```

**Props must be serializable** — Server Components pass props to Client Components across the server/client boundary. Non-serializable values (functions, class instances, Date objects) cannot be passed as props.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                    | Tại sao sai                                                      | Đúng là                                                                    |
| ---------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Putting `'use client'` at the top of every component       | Defeats the purpose — everything becomes client JS               | Only mark components that need interactivity (state, events, browser APIs) |
| Passing a function as prop from Server to Client Component | Functions are not serializable across the server/client boundary | Pass Server Actions (marked `'use server'`) or primitive callbacks         |
| Thinking Server Components replace Client Components       | SC handles read-only rendering; CC handles interactivity         | They complement: SC for data-fetching shell, CC for interactive leaves     |
| Using `useContext` in a Server Component                   | Context is a client-side mechanism (browser memory)              | Pass data as props or use a Client Provider that wraps the component       |

**🎯 Interview Pattern:**

- Khi thấy: "Do we need a REST API if we use Server Components?"
- → Nhớ: SC replaces the API layer for **reads** — direct DB access from server. But you still need Client Components for interactivity, and Server Actions for mutations.
- → Mở đầu: "Server Components can replace REST API routes for read operations — they run on the server with direct database access and ship zero JS. But you still need Client Components for interactive UI, and Server Actions for mutations that need to run on the server."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [Next.js App Router — RSC + Server Actions](../04-nextjs/01-app-router-server-components.md)
- ➡️ Để hiểu: [Next.js Data Fetching — streaming and cache](../04-nextjs/02-data-fetching.md)

---

## Core Concept 3: React 19 — Compiler, Actions & New Primitives

> 🧠 **Memory Hook**: "React Compiler = the linter that inserts memoization for you. Actions = the async form handler that manages loading/error state for you."

**Tại sao tồn tại? / Why does this exist?**
React 18 still required developers to manually write `useMemo`/`useCallback` everywhere performance mattered, and to manually manage `isPending`/`isError` state for every async operation.
→ Why is manual memoization fragile? Developers forget to add it, add it wrong (wrong deps), or add it unnecessarily — all causing bugs or wasted overhead.
→ Why is manual async state boilerplate a problem? Every form submit needs the same 4 pieces of state: isPending, isError, error, data — leading to copy-paste across every mutation.

### Layer 1: React Compiler

**What it does:**

```
Developer writes:                     Compiler outputs:

function ProductList({ products }) {  function ProductList({ products }) {
  const sorted = products             const sorted = useMemo(() =>
    .sort((a, b) => a.price             products.sort((a, b) => a.price
    - b.price);                           - b.price),
  return <List items={sorted} />;       [products]
}                                       );
                                        return <List items={sorted} />;
                                      }
```

**Requirements for the compiler to work:**

- Component must be a pure function (same inputs → same output)
- No side effects during render
- Follow Rules of React (Rules of Hooks, no mutation of props/state)
- If a component violates these, compiler skips it (opt-out per component)

**Impact on developer workflow:**

- Stop writing `useMemo` and `useCallback` by default
- Compiler handles it — focus on correctness, not optimization
- Profiling still needed: compiler is not a substitute for architectural fixes (state colocation, virtualization)

### Layer 2: React 19 Actions & New Hooks

**`useActionState` — built-in async state machine for forms:**

```tsx
const [state, submitAction, isPending] = useActionState(
  async (previousState: State, formData: FormData) => {
    try {
      const result = await saveProfile(formData);
      return { success: true, data: result };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },
  { success: false, data: null, error: null },
);

<form action={submitAction}>
  <input name="name" defaultValue={profile.name} />
  <button disabled={isPending}>{isPending ? "Saving…" : "Save"}</button>
  {!state.success && state.error && <p className="error">{state.error}</p>}
</form>;
```

**`useOptimistic` — instant UI feedback:**

```tsx
const [optimisticMessages, addOptimisticMessage] = useOptimistic(
  messages,
  (currentMessages, newMessage) => [...currentMessages, { ...newMessage, pending: true }],
);

async function handleSend(text: string) {
  addOptimisticMessage({ text, id: crypto.randomUUID() });
  await sendMessage(text); // if this throws, React rolls back the optimistic state
}
```

**`use()` hook — read resources in render:**

```tsx
// Can be called inside loops and conditionals (unlike useContext)
function ProductDetails({ pricePromise }: { pricePromise: Promise<Price> }) {
  const price = use(pricePromise); // suspends if not resolved; works inside if/for
  const theme = use(ThemeContext); // replaces useContext, same behavior

  return <div style={{ color: theme.primary }}>${price.amount}</div>;
}
```

**Ref as prop (React 19):**

```tsx
// Before React 19: required forwardRef wrapper
const Input = forwardRef((props, ref) => <input ref={ref} {...props} />);

// React 19: ref is just a prop
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                           | Tại sao sai                                                                                                            | Đúng là                                                                                               |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| "React Compiler means no more performance work"   | Compiler handles memoization but not architecture — bad state placement, missing virtualization still need fixing      | Compiler removes manual useMemo/useCallback; Profiler + colocation + virtualization still required    |
| Using `useOptimistic` without handling rollback   | If the async action throws, React automatically reverts — but you must not commit the change until the server confirms | `useOptimistic` is automatically rolled back on error; check that your UI reflects the reverted state |
| Using `use()` for expensive data outside Suspense | `use(promise)` suspends the component — without a Suspense boundary above, this crashes                                | Always wrap `use(promise)` consumers with `<Suspense fallback={...}>`                                 |

**🎯 Interview Pattern:**

- Khi thấy: "How does React 19 change how you handle form submissions?"
- → Nhớ: `useActionState` manages isPending/state/error; forms use `action` attribute instead of `onSubmit`
- → Mở đầu: "React 19 introduces `useActionState` which wraps an async function and automatically tracks pending state and the returned result — replacing the manual pattern of `const [isPending, setIsPending] = useState(false)` and `try/catch` for every form."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [React 19 Features — full deep dive](./02-react-19-features.md)
- ➡️ Để hiểu: [Next.js Data Fetching — Server Actions + useOptimistic](../04-nextjs/02-data-fetching.md)

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What fundamental problem does React 18 concurrent rendering solve? How does it achieve it? 🟡 Mid

**A:** React 17's rendering was synchronous and uninterruptible: once React started re-rendering, it ran to completion. A 300ms render (large list, complex tree) would freeze the event loop — user input was queued, animations stuttered.

React 18 makes rendering **interruptible**. It uses a fiber-based scheduler that can:

1. **Pause** a low-priority render mid-way (after each fiber unit of work)
2. **Check** if a high-priority update arrived (user typed something)
3. **Handle** the high-priority work first (1ms keystroke render)
4. **Resume** or discard and restart the low-priority render

`createRoot` is required to opt into concurrent mode. `useTransition` and `useDeferredValue` are the APIs to mark state updates as low-priority.

Tiếng Việt: React 18 thêm khả năng "ngắt" render — React có thể pause render của 1 tab switch 300ms để xử lý keystroke 1ms của user trước. `createRoot` bật concurrent mode; `useTransition` đánh dấu update không gấp.

**💡 Interview Signal:**

- ✅ Strong: Explains the synchronous blocking problem specifically, describes the pause/resume mechanism, mentions `createRoot` requirement
- ❌ Weak: "React 18 makes rendering faster" (incorrect framing — it makes it non-blocking, not faster)

---

### Q: What are the rules for mixing Server Components and Client Components? 🔴 Senior

**A:** Three core rules:

1. **Server → Client is allowed (props)**: A Server Component can import and render a Client Component, passing serializable props (strings, numbers, plain objects, arrays — not functions, class instances, or Dates).

2. **Client → Server direct import is NOT allowed**: A Client Component cannot `import` a Server Component because it would ship server-only code to the client. Use the **children/slot pattern** instead: the parent Server Component renders the server child and passes it as `children` to the Client Component wrapper.

3. **'use client' is a boundary, not a file property**: marking a file `'use client'` makes it and all its imports part of the client bundle. Everything imported from a `'use client'` file also becomes a client module.

**Serialization constraint**: props crossing the server/client boundary are serialized (like JSON). Non-serializable values — functions, class instances, `undefined`, cyclic objects — cannot be passed. Server Actions (marked `'use server'`) are the exception: they serialize as references.

Tiếng Việt: Server có thể import Client (one-way). Client không thể import Server trực tiếp — dùng children pattern. Props phải serializable. `'use client'` là ranh giới cho bundler, không chỉ là annotation.

**💡 Interview Signal:**

- ✅ Strong: Explains the serialization constraint, describes the children workaround for Client→Server, mentions `'use client'` infects imports
- ❌ Weak: "Server Components run on server, Client Components run on client" (doesn't explain the composition rules)

---

### Q: What is the React Compiler and how does it change how you write components? 🟡 Mid

**A:** The React Compiler (previously "React Forget") is a build-time static analysis tool that automatically inserts `useMemo` and `useCallback` calls where they are provably safe.

**What it analyzes:**

- Reads the component's AST (abstract syntax tree)
- Identifies computations that depend only on props/state (pure)
- Identifies function definitions that could be stabilized
- Inserts memoization automatically at build time

**Impact on code:**

- Stop writing `useMemo(fn, [deps])` and `useCallback(fn, [deps])` by default
- Still need `React.memo` on components (the compiler handles values/functions, not component skip logic — this may change)
- Still need architectural optimizations (state colocation, virtualization) — the compiler doesn't fix bad architecture

**Requirements:** component must follow Rules of React (pure render, no mutation of props/state). The compiler skips non-compliant components.

Tiếng Việt: React Compiler phân tích AST tĩnh và tự động thêm `useMemo`/`useCallback` vào chỗ an toàn. Developer không cần tự thêm nữa — tập trung vào đúng logic. Vẫn cần `React.memo` và kiến trúc tốt.

**💡 Interview Signal:**

- ✅ Strong: Explains it's a build-time static analyzer (not runtime), distinguishes from `React.memo`, notes architecture still needed
- ❌ Weak: "React Compiler auto-memoizes everything" (oversimplified — it only handles provably safe cases, skips non-pure components)

---

### Q: When would you use `useOptimistic`? How does it differ from just calling `setState` immediately? 🔴 Senior

**A:** `useOptimistic` is for **temporary optimistic state that should automatically revert** if the async action fails. It differs from `setState` in three key ways:

1. **Automatic revert on error**: if the async action throws, React automatically discards the optimistic value and shows the real state — no manual rollback code needed.

2. **Concurrent-safe**: `useOptimistic` understands React's concurrent model. Setting optimistic state doesn't block or race with the real state update from the server.

3. **Scoped to the action**: once the server action completes (successfully), the optimistic value is replaced by the real server response. With `setState` you'd need to sync this manually.

**When to use**: any immediate-feedback interaction where a server round-trip is required — chat send, like/unlike, cart add, todo check. The user expects instant response; the server confirms asynchronously.

**When NOT to use**: critical financial transactions where the UI should only update after server confirmation (payments, transfers) — premature optimistic update could mislead.

Tiếng Việt: `useOptimistic` tự rollback khi action thất bại — không cần code rollback thủ công. Dùng cho chat, like, cart. Không dùng cho giao dịch tài chính cần server confirm trước khi update UI.

**💡 Interview Signal:**

- ✅ Strong: Explains automatic rollback, distinguishes from manual setState, names when NOT to use it (financial transactions)
- ❌ Weak: "useOptimistic shows the new value while the request is in flight" (correct but doesn't mention rollback or the concurrent-safe aspect)

---

### Q: Compare React 18 streaming SSR with React 17 SSR — what exactly improved? 🔴 Senior

**A:** React 17 SSR had three all-or-nothing bottlenecks:

1. **Data fetching must complete before any HTML is sent**: `renderToString` waited for every `getServerSideProps` to resolve before sending a single byte of HTML. One slow DB query blocked the entire page.

2. **Full page must be hydrated before any part is interactive**: the browser downloaded the full HTML and the full JS bundle, then hydrated the entire page in one synchronous pass.

3. **Hydration blocked interactivity**: even if the user scrolled to a part of the page that was ready, they couldn't interact until the entire page finished hydrating.

**React 18 streaming SSR solves each:**

1. **Incremental HTML delivery**: `renderToPipeableStream` sends the HTML shell (layout, navigation) immediately, then streams `<Suspense>` boundaries as their data resolves. First byte arrives in ~50ms instead of 800ms.

2. **Selective hydration**: React 18 hydrates components as they stream in — high-priority components (the one the user is interacting with) hydrate first, even if they arrive after slower components.

3. **Non-blocking hydration**: hydration is interruptible. If the user clicks, React hydrates that component first.

Tiếng Việt: React 17 SSR bị block ở 3 điểm: data fetch xong mới gửi HTML, HTML xong mới hydrate, hydrate xong mới interactive. React 18 streaming giải quyết cả 3: gửi HTML incremental, hydrate selective, hydration không block click.

**💡 Interview Signal:**

- ✅ Strong: Identifies the specific three bottlenecks in React 17, explains how each is solved — not just "faster SSR"
- ❌ Weak: "React 18 SSR is faster because it streams" (correct but doesn't explain what was blocking before or how selective hydration works)

---

## 📋 Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Câu hỏi                                               | Difficulty | Core Concept     | Key Signal                                       |
| --- | ----------------------------------------------------- | ---------- | ---------------- | ------------------------------------------------ |
| 1   | Concurrent rendering giải quyết vấn đề gì?            | 🟡 Mid     | React 18         | Interruptible rendering + scheduler priority     |
| 2   | Rules mixing Server và Client Components?             | 🔴 Senior  | RSC              | Import rule + serializable props + boundary      |
| 3   | React Compiler thay đổi cách viết components?         | 🟡 Mid     | React 19         | Auto-memoization, bỏ manual `memo`/`useCallback` |
| 4   | `useOptimistic` — khác `setState` ngay lập tức?       | 🔴 Senior  | React 19         | Optimistic UI + automatic rollback on failure    |
| 5   | React 18 streaming SSR vs React 17 SSR — cải tiến gì? | 🔴 Senior  | SSR architecture | Suspense streaming + selective hydration         |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"Your team is migrating to React 18. The CTO asks: what are the top 3 things that will actually impact users, and what do developers need to change?"**

**30 giây đầu — mở đầu lý tưởng:**

1. "For users, the three tangible improvements are: (1) non-blocking UI interactions via concurrent rendering — typing and clicking feel instant even during expensive renders; (2) faster time-to-first-byte if using SSR, because HTML streams progressively instead of waiting for all data; (3) automatic batching means fewer unnecessary re-renders."
2. "For developers, the main change is opting into concurrent mode by replacing `ReactDOM.render` with `createRoot` — that one line enables everything."
3. "Optionally, developers can use `useTransition` to mark non-urgent state updates and get `isPending` to show loading indicators without Suspense."
4. "The rest — automatic batching, streaming SSR — is opt-in or framework-level (Next.js handles streaming automatically with App Router)."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                                           |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Giải thích concurrent rendering theo ví dụ "surgeon" — tại sao React 17 "blocks" và React 18 không?                                               |
| 2   | 🎨 Visual      | Vẽ component tree với Server Component ở root, Client Component ở leaf — điều gì xảy ra ở ranh giới khi pass function prop từ server sang client? |
| 3   | 🛠️ Application | Team dùng React Compiler — bạn có xóa tất cả `useMemo`/`useCallback` trong codebase không? Những trường hợp nào cần giữ lại?                      |
| 4   | 🐛 Debug       | Client Component import một Server Component trực tiếp — lỗi gì xảy ra? Cách fix mà vẫn dùng được Server Component?                               |
| 5   | 🎓 Teach       | Giải thích `useOptimistic` cho backend developer: khác `setState(newValue)` ở chỗ nào — và điều gì xảy ra khi server trả về lỗi?                  |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | React 17: render = surgeon không thể dừng giữa chừng (blocking). React 18: concurrent = có thể pause, resume, hay abandon render — ưu tiên urgent updates (typing) hơn background.                                 |
| 2   | Server-to-Client boundary: không thể pass functions (không serializable). Pass data (JSON-serializable) được. Pattern: pass function từ Client Component như prop xuống Server Component children qua composition. |
| 3   | Không xóa tất cả. Giữ: deps cho hooks khác (`useEffect`, `useMemo` deps), stable callbacks cho native event listeners, performance-critical paths Compiler không thể optimize.                                     |
| 4   | Lỗi: "You cannot import a server component into a client component." Fix: truyền Server Component như `children` prop vào Client Component — composition pattern.                                                  |
| 5   | `useOptimistic` hiển thị value ngay (optimistic), revert về real value khi action complete/fail. `setState` không revert. Server error → UI tự động khôi phục về state thật.                                       |

> 🎯 **Feynman Prompt:** "Giải thích React 18 streaming SSR cho một developer chưa biết React — dùng ví dụ nhà hàng phục vụ theo thứ tự món chín, không phải đợi hết tất cả món mới mang ra."
> 🔁 **Spaced Repetition reminder:** Ôn lại file này sau **3 ngày**, **7 ngày**, và **14 ngày**.

[← Previous](./09-performance-optimization.md) | [Back to Table of Contents](../../00-table-of-contents.md)

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)
- [React 19 Features](./02-react-19-features.md) — Actions, Compiler, and breaking changes detail
- [Performance Optimization](./09-performance-optimization.md) — concurrent rendering performance patterns
- [Hooks Comprehensive](./07-hooks-comprehensive.md) — concurrency hooks useTransition/useDeferredValue
- [Advanced Patterns](./04-advanced-patterns.md) — Suspense pairs with compound component boundaries

### Khác track (Cross-track)
- [App Router & Server Components](../04-nextjs/01-app-router-server-components.md) — Next.js implementation of React Server Components
- [Data Fetching](../04-nextjs/02-data-fetching.md) — streaming SSR and Suspense in Next.js App Router
- [Architecture Styles](../../shared/05-software-engineering/02-architecture-styles.md) — RSC shifts server/client rendering architecture
