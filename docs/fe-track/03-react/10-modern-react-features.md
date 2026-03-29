# Modern React Features (18–19) / Tính Năng React Hiện Đại

> **Track**: FE — React | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [React Fundamentals](./01-react-fundamentals.md) | [Hooks Deep Dive](./03-hooks-deep-dive.md)
> **See also**: [React 19 Deep Dive](./02-react-19-features.md) | [Next.js App Router](../04-nextjs/01-app-router-server-components.md)
> **L5 Competencies**: Concurrent Architecture • Server/Client Boundary Design • Migration Strategy • Streaming SSR

[← Previous](./09-performance-optimization.md) | [Back to Table of Contents](../../00-table-of-contents.md)

---

## Real-World Scenario / Tình Huống Thực Tế

🇬🇧 Your team is migrating a dashboard from React 17 to React 18. The PM asks: "Will users notice any improvement?" The backend team asks: "Do we still need REST APIs with Server Components?" The tech lead asks: "Can we remove all useMemo calls after enabling React Compiler?"

🇻🇳 Team bạn đang migrate dashboard từ React 17 lên React 18. PM hỏi: "User có thấy khác biệt gì không?". Backend team hỏi: "Dùng Server Components thì còn cần REST API không?". Tech lead hỏi: "Bật React Compiler có xóa hết `useMemo` được không?"

🇬🇧 **Why it matters:** All three questions require understanding the **model shift** — not just memorizing API names. This file explains from the roots: how React changed **the way it renders**, **where it renders**, and **who is responsible for optimization**.

🇻🇳 **Tại sao quan trọng:** Cả ba câu hỏi đều cần hiểu **sự thay đổi mô hình** — không chỉ nhớ tên API. File này giải thích từ gốc rễ: React đã thay đổi **cách render**, **nơi render**, và **ai chịu trách nhiệm optimize**.

---

## What & Why / Cái Gì & Tại Sao

> 🇬🇧 **Everyday analogy:** Imagine a restaurant serving customers.
>
> - **React 17** = the restaurant cooks ALL dishes before serving any → customers stare at an empty table for 30 minutes
> - **React 18** = the restaurant serves each dish as it's ready → customers eat the appetizer while waiting for the main course
> - **Server Components** = the kitchen pre-makes cold dishes (salad) and sends them straight out, only sending recipes for dishes customers need to cook at the table
> - **React Compiler** = a robot that automatically covers pots to keep food warm — previously the chef had to remember to do it
>
> 🇻🇳 **Ví dụ đời thường:** Tưởng tượng nhà hàng phục vụ khách.
>
> - **React 17** = nhà hàng nấu xong **TẤT CẢ** món rồi mới bưng ra → khách ngồi đợi 30 phút nhìn bàn trống
> - **React 18** = nhà hàng bưng **từng món** khi nấu xong → khách ăn khai vị trong khi chờ món chính
> - **Server Components** = bếp nấu sẵn món nguội (salad) và bưng thẳng ra, chỉ gửi công thức cho món khách cần tự nướng tại bàn
> - **React Compiler** = robot tự động đậy nắp nồi giữ nhiệt — trước đây đầu bếp phải tự nhớ đậy

---

## Concept Map / Bản Đồ Khái Niệm

```
                    Modern React Features
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   React 18           Server              React 19
   Concurrent         Components          Compiler &
   Rendering                              Actions
     │                   │                   │
     ├─ Auto Batching    ├─ SC vs CC         ├─ Auto Memo
     ├─ Streaming SSR    ├─ Boundary Rules   ├─ useActionState
     ├─ useTransition    ├─ Serialization    ├─ useOptimistic
     ├─ useDeferredValue ├─ Server Actions   ├─ use() API
     └─ Selective Hydrate└─ Children Pattern └─ ref as prop

  React 17: Synchronous → React 18: Concurrent → React 19: Auto-optimized
  "Cook everything       "Serve each dish      "Robot covers
   before serving"        as it's ready"        pots automatically"
```

---

## Overview / Tổng Quan

🇬🇧 This file covers the 3 biggest evolutionary steps in React:

1. **React 18 — Concurrent Rendering**: Rendering is no longer "all-or-nothing." React can **pause**, prioritize urgent work (user typing), then **resume** non-urgent work. Plus automatic batching and streaming SSR.
2. **Server Components**: Components that run on the server, sending HTML to the client with **0 bytes of JavaScript**. Client Components are only used for parts that need interactivity.
3. **React 19 — Compiler & Actions**: The Compiler auto-adds `useMemo`/`useCallback`. Actions manage async form state automatically. `use()` reads Promises/Context more flexibly.

🇻🇳 File này covers 3 bước tiến hóa lớn nhất của React:

1. **React 18 — Concurrent Rendering**: Render không còn "all-or-nothing". React có thể **pause**, ưu tiên việc gấp (user typing), rồi **resume** việc không gấp. Kèm auto batching và streaming SSR.
2. **Server Components**: Component chạy trên server, gửi HTML về client, **0 bytes JavaScript**. Client Component chỉ dùng cho phần cần tương tác.
3. **React 19 — Compiler & Actions**: Compiler tự thêm `useMemo`/`useCallback`. Actions quản lý async form state tự động. `use()` đọc Promise/Context linh hoạt hơn.

---

## Core Concept 1: React 18 — Concurrent Rendering & Auto Batching / Render Đồng Thời & Gộp State Tự Động

> 🧠 **Memory Hook:**
> 🇬🇧 "Concurrent = a surgeon who can **pause** an operation to handle an emergency, then **resume** — instead of finishing 100% before accepting new patients"
> 🇻🇳 "Concurrent = bác sĩ phẫu thuật có thể **pause** ca mổ để xử lý ca cấp cứu, rồi **resume** — thay vì phải mổ xong 100% mới được nhận bệnh nhân mới"

### Why exists — Tại sao tồn tại?

🇬🇧 **Level 1 — What's the problem?**
React 17 renders synchronously: once rendering starts, it runs to completion. Rendering 300ms (filtering 5000 items) → browser **freezes** 300ms → the user types but sees nothing.

🇻🇳 **Level 1 — Vấn đề là gì?**
React 17 render đồng bộ: một khi bắt đầu render, chạy cho đến xong mới dừng. Render 300ms (filter 5000 items) → browser **đóng băng** 300ms → user gõ chữ nhưng không thấy gì.

🇬🇧 **Level 2 — Why not just render faster?**
Some computations are **inherently slow** — sorting 5000 items always takes time. The solution isn't "render faster" but "render **without blocking** the UI" — React can pause mid-render.

🇻🇳 **Level 2 — Tại sao không render nhanh hơn?**
Một số tính toán **tự thân đã chậm** — sort 5000 items luôn mất thời gian. Giải pháp không phải "render nhanh hơn" mà là "render **không chặn** UI" — React có thể pause giữa chừng.

### Layer 1: Everyday Analogy / Ví Dụ Đời Thường

🇬🇧 Imagine you're writing a long email (rendering a list of 5000 items):

- **React 17**: Must finish the email before replying to messages → friends think you're "offline"
- **React 18**: Write half the email → see a message → quick reply → continue writing → friends see you're always "responsive"
- **Key insight**: React doesn't write the email faster — React knows how to interleave urgent and non-urgent work.

🇻🇳 Tưởng tượng bạn đang viết email dài (render list 5000 items):

- **React 17**: Phải viết xong email mới được trả lời tin nhắn → bạn bè nghĩ bạn "offline"
- **React 18**: Viết nửa email → thấy tin nhắn → reply nhanh → quay lại viết tiếp → bạn bè thấy bạn luôn "responsive"
- **Key insight**: React không viết email nhanh hơn — React biết cách xen kẽ việc gấp và không gấp.

### Layer 2: How It Works / Cách Hoạt Động

```
React 17 (synchronous — đồng bộ):
render start ─────────────────────────── render done
              [cannot interrupt, UI frozen 300ms]
              [user types "h" "e" "l" "l" "o" → sees nothing]

React 18 (concurrent — đồng thời):
render start ──── [user types "h"] ──── resume ──── render done
                   React pauses,        React
                   handles "h" (1ms),   continues
                   shows it instantly   old render

Timeline:
0ms    ──── 50ms ──── 51ms ──── 300ms
render       pause     handle     resume + finish
started      check     keypress   low-priority
```

🇬🇧 **Automatic Batching** — groups multiple setState calls into 1 render:

🇻🇳 **Automatic Batching** — gộp nhiều setState thành 1 render:

```tsx
// React 17: setTimeout causes 2 separate renders
// React 17: setTimeout gây 2 lần render riêng biệt
setTimeout(() => {
  setCount((c) => c + 1); // render 1
  setFlag((f) => !f); // render 2
}, 0);

// React 18: batched into 1 render EVEN in setTimeout
// React 18: gộp thành 1 render DÙ TRONG setTimeout
setTimeout(() => {
  setCount((c) => c + 1); // ─┐
  setFlag((f) => !f); // ─┘ → 1 render only
}, 0);

// Force immediate render (rarely needed):
// Ép render ngay lập tức (hiếm khi cần):
import { flushSync } from "react-dom";
flushSync(() => setCount((c) => c + 1));
```

🇬🇧 **Activating concurrent mode:**

🇻🇳 **Kích hoạt concurrent mode:**

```tsx
// ❌ React 17 API — NO concurrent features
// ❌ React 17 API — KHÔNG có concurrent features
ReactDOM.render(<App />, document.getElementById("root"));

// ✅ React 18 API — ENABLES concurrent features
// ✅ React 18 API — BẬT concurrent features
import { createRoot } from "react-dom/client";
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
```

### Layer 3: Edge Cases / Trường Hợp Đặc Biệt

🇬🇧

- **Still using `ReactDOM.render`**: All concurrent features are disabled — auto batching outside event handlers, useTransition, streaming SSR all won't work
- **Impure components**: Concurrent mode may call render twice (Strict Mode) — components with side effects in render will break
- **`flushSync` in event handlers**: Use when you need to measure DOM right after setState (e.g., scroll to bottom after adding a message) — but very rarely needed

🇻🇳

- **Vẫn dùng `ReactDOM.render`**: Tất cả concurrent features bị tắt — auto batching ngoài event handler, useTransition, streaming SSR đều không hoạt động
- **Component không pure**: Concurrent mode có thể gọi render 2 lần (Strict Mode) — component có side effect trong render sẽ bị lỗi
- **`flushSync` trong event handler**: Dùng khi cần đo DOM ngay sau setState (ví dụ: scroll to bottom sau add message) — nhưng rất hiếm cần

**❌ Common Mistakes / Sai lầm thường gặp:**

| ❌ Mistake / Sai                                                                     | Why wrong / Tại sao sai                                                                                            | ✅ Correct / Đúng                                                                                                           |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| "React 18 renders faster than 17" / "React 18 render nhanh hơn 17"                   | Same work, same time — React 18 just **doesn't block** UI / Cùng công việc, cùng thời gian — chỉ **không chặn** UI | Improves **responsiveness**, not throughput / Cải thiện **cảm giác nhanh**, không phải tốc độ thật                          |
| Still using `ReactDOM.render` after upgrade / Vẫn dùng `ReactDOM.render` sau upgrade | Legacy root disables ALL concurrent features / Tắt toàn bộ concurrent features                                     | Must switch to `createRoot` / Phải đổi sang `createRoot`                                                                    |
| Fear auto batching breaks old code / Sợ auto batching phá code cũ                    | More batching = fewer renders = safer / Batch nhiều hơn = ít render = an toàn hơn                                  | Only breaks code relying on intermediate renders (very rare) / Chỉ vấn đề nếu code phụ thuộc intermediate render (rất hiếm) |
| "Concurrent mode is always on" / "Concurrent luôn bật"                               | Only active with `createRoot` AND concurrent APIs / Chỉ bật khi dùng `createRoot` VÀ API concurrent                | Concurrent render only happens for "non-urgent" updates / Chỉ xảy ra cho "non-urgent" updates                               |

**🎯 Interview Pattern:**

🇬🇧 When you hear: "What's new in React 18? Why upgrade?" → Remember: concurrent rendering = interruptible = responsive UI; auto batching = fewer renders; streaming SSR = faster TTFB.
→ Opening: "The core change in React 18 is concurrent rendering — instead of blocking the browser for the entire render, React can pause to handle user input first. This enables 3 things: useTransition for non-urgent state, streaming SSR for incremental HTML, and auto batching that groups setState everywhere."

🇻🇳 Khi thấy: "React 18 có gì mới? Tại sao nên upgrade?" → Nhớ: concurrent rendering = interruptible = responsive UI; auto batching = ít render hơn; streaming SSR = TTFB nhanh hơn.
→ Mở đầu: "Thay đổi cốt lõi của React 18 là concurrent rendering — thay vì block browser cho toàn bộ render, React có thể pause để xử lý input user trước. Điều này enable 3 thứ: useTransition cho non-urgent state, streaming SSR gửi HTML từng phần, và auto batching gộp setState ở mọi nơi."

**🔑 Knowledge Chain:**

- 📚 Prereq: [Hooks Comprehensive — useTransition/useDeferredValue](./07-hooks-comprehensive.md)
- ➡️ Enables: [Performance Optimization — profiling concurrent renders](./09-performance-optimization.md)

---

## Core Concept 2: Server Components — Architecture & Boundaries / Kiến Trúc & Ranh Giới

> 🧠 **Memory Hook:**
> 🇬🇧 "Server Component = **0 bytes JS** sent to the browser. It renders on the server and sends **HTML**, not JavaScript. `'use client'` is the boundary where JavaScript begins."
> 🇻🇳 "Server Component = **0 bytes JS** gửi tới browser. Nó render trên server và gửi **HTML**, không gửi JavaScript. `'use client'` là ranh giới nơi JavaScript bắt đầu."

### Why exists — Tại sao tồn tại?

🇬🇧 **Level 1 — What's the problem?**
Traditional React: ALL components run on the browser → every library, every logic, every query must be shipped as JavaScript to the client. A product page might ship 200KB JS just to fetch and display data that never changes.

🇻🇳 **Level 1 — Vấn đề là gì?**
React truyền thống: MỌI component đều chạy trên browser → mọi library, mọi logic, mọi query đều phải ship dưới dạng JavaScript tới client. Trang product page có thể ship 200KB JS chỉ để fetch và hiển thị data không bao giờ thay đổi.

🇬🇧 **Level 2 — Isn't traditional SSR enough?**
Old SSR (getServerSideProps) renders HTML on the server BUT still ships component JS for hydration. Server Components **don't hydrate** — they're not in the client bundle at all. Total JS savings.

🇻🇳 **Level 2 — SSR truyền thống không đủ sao?**
SSR cũ (getServerSideProps) render HTML trên server NHƯNG vẫn ship component JS để hydrate. Server Components **không hydrate** — không nằm trong client bundle. Tiết kiệm hoàn toàn JS.

### Layer 1: Everyday Analogy / Ví Dụ Đời Thường

🇬🇧 Imagine ordering food delivery:

- **Client Component** = you receive **ingredients + recipe** → cook at home yourself (browser downloads JS + renders)
- **Server Component** = you receive a **ready-made meal** → just put it on the table (server sends HTML, browser just displays)
- **`'use client'`** = a sticker saying "needs self-cooking" on the box → tells you which parts need JavaScript
- Salad (display text) → send ready-made (Server Component). Hot pot (needs a stove, interaction) → send ingredients (Client Component).

🇻🇳 Tưởng tượng bạn đặt đồ ăn delivery:

- **Client Component** = bạn nhận **nguyên liệu + công thức** → tự nấu tại nhà (browser tải JS + render)
- **Server Component** = bạn nhận **món ăn nấu sẵn** → chỉ bày ra bàn ăn (server gửi HTML, browser chỉ hiển thị)
- **`'use client'`** = nhãn dán "cần tự nấu" trên hộp → cho biết phần nào cần JavaScript
- Món salad (hiển thị text) → gửi sẵn (Server Component). Món lẩu (cần bật bếp, tương tác) → gửi nguyên liệu (Client Component).

### Layer 2: How It Works / Cách Hoạt Động

```
SERVER COMPONENT                    CLIENT COMPONENT
────────────────                    ────────────────
Runs: server only                   Runs: client (+ server for hydrate)
Chạy: chỉ trên server              Chạy: trên client (+ server cho hydrate)

JS sent: 0 bytes                    JS sent: entire component
JS gửi: 0 bytes                     JS gửi: toàn bộ component

Can: async/await, DB query           Can: useState, useEffect, hooks
Được: async/await, DB query          Được: useState, useEffect, hooks

Can: access filesystem               Can: event handlers, browser APIs
Được: truy cập filesystem            Được: event handlers, browser APIs

Cannot: hooks                        Cannot: async component function
KHÔNG được: hooks                    KHÔNG được: async component function

Default in Next.js App Router        Marked: 'use client' at file top
Mặc định trong Next.js               Đánh dấu: 'use client' ở đầu file
```

🇬🇧 **Boundary rules:**

🇻🇳 **Luật ranh giới:**

```tsx
// ✅ Server imports Client — ALLOWED
// ✅ Server import Client — ĐƯỢC
// Server renders its own HTML + sends ClientButton as JS bundle
async function ProductPage({ id }: { id: string }) {
  const product = await db.products.findById(id); // direct DB query!

  return (
    <div>
      <h1>{product.name}</h1> {/* Pure HTML, 0 JS */}
      <p>${product.price}</p>
      <AddToCartButton productId={id} /> {/* Client Component */}
    </div>
  );
}

// 'use client' marks the boundary / đánh dấu ranh giới
("use client");
function AddToCartButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false); // hooks OK here
  return (
    <button
      onClick={() => {
        addToCart(productId);
        setAdded(true);
      }}
    >
      {added ? "Added!" : "Add to cart"}
    </button>
  );
}

// ❌ Client imports Server — NOT ALLOWED
// ❌ Client import Server — KHÔNG ĐƯỢC
("use client");
import ServerComponent from "./ServerComponent"; // ❌ Error!

// ✅ Use children pattern instead / Dùng children pattern thay thế
("use client");
function ClientWrapper({ children }) {
  const [open, setOpen] = useState(false);
  return <div>{open && children}</div>;
}
// Parent (server): <ClientWrapper><ServerComponent /></ClientWrapper>
```

🇬🇧 **Server Actions — mutations without API routes:**

🇻🇳 **Server Actions — mutation không cần API route:**

```tsx
// 'use server' — function runs on server, called from client
"use server";
async function updateProfile(formData: FormData) {
  const name = formData.get("name");
  await db.users.update({ name });
  revalidatePath("/profile");
}

// Client component uses server action directly
<form action={updateProfile}>
  <input name="name" />
  <button type="submit">Save / Lưu</button>
</form>;
```

### Layer 3: Edge Cases / Trường Hợp Đặc Biệt

🇬🇧

- **Serialization constraint**: Props from Server → Client must be serializable (JSON-safe). Cannot pass functions, class instances, Date, undefined. Server Actions (marked `'use server'`) are the exception — serialized as references.
- **`'use client'` infects imports**: Marking a file `'use client'` → ALL modules imported in that file also become client modules. Placing `'use client'` too high → entire component tree becomes client JS.
- **`useContext` in Server Component**: NOT allowed. Context is a client-side mechanism (browser memory). Must pass data via props or use a Client Provider wrapper.

🇻🇳

- **Ràng buộc serialization**: Props từ Server → Client phải serializable (JSON-safe). Không thể pass function, class instance, Date, undefined. Server Actions (đánh dấu `'use server'`) là ngoại lệ — serialize dưới dạng reference.
- **`'use client'` nhiễm imports**: Đánh dấu file `'use client'` → TẤT CẢ modules import trong file đó cũng thành client module. Đặt `'use client'` quá cao → cả cây component thành client JS.
- **`useContext` trong Server Component**: KHÔNG được. Context là cơ chế client-side (memory browser). Phải pass data qua props hoặc dùng Client Provider bọc ngoài.

**❌ Common Mistakes / Sai lầm thường gặp:**

| ❌ Mistake / Sai                                                              | Why wrong / Tại sao sai                                                                       | ✅ Correct / Đúng                                                                                    |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Put `'use client'` at top of every file / Đặt `'use client'` ở đầu mọi file   | Turns everything into client JS → pointless SC / Biến tất cả thành client JS → vô nghĩa       | Only mark components that NEED interactivity / Chỉ đánh dấu component CẦN tương tác                  |
| Pass function as prop from Server → Client / Pass function từ Server → Client | Functions aren't serializable / Function không serializable                                   | Use Server Actions (`'use server'`) or primitive values / Dùng Server Actions hoặc giá trị primitive |
| "SC replaces Client Component" / "SC thay thế CC"                             | SC handles read-only render; CC handles interaction / SC render read-only; CC xử lý tương tác | SC for data shell, CC for interactive leaves / SC cho data shell, CC cho interactive leaves          |
| Use `useContext` in Server Component / Dùng `useContext` trong SC             | Context only exists on client (browser memory) / Context chỉ tồn tại ở client                 | Pass data via props or use Client Provider wrapper / Pass data qua props hoặc Client Provider        |

**🎯 Interview Pattern:**

🇬🇧 When you hear: "Do Server Components replace REST APIs?" → Remember: SC replaces API for **read** (direct DB query, 0 JS). Still need CC for interactivity. Server Actions for mutations.
→ Opening: "Server Components replace REST APIs for read operations — they run on the server with direct DB access and ship 0 JS. But you still need Client Components for interactive UI and Server Actions for mutations."

🇻🇳 Khi thấy: "Server Components thay thế REST API không?" → Nhớ: SC thay API cho **read** (query DB trực tiếp, 0 JS). Vẫn cần CC cho interactivity. Server Actions cho mutations.
→ Mở đầu: "Server Components thay thế REST API cho read operations — chạy trên server với DB access trực tiếp, ship 0 JS. Nhưng vẫn cần Client Components cho interactive UI và Server Actions cho mutations."

**🔑 Knowledge Chain:**

- 📚 Prereq: [Next.js App Router — RSC + Server Actions](../04-nextjs/01-app-router-server-components.md)
- ➡️ Enables: [Next.js Data Fetching — streaming and cache](../04-nextjs/02-data-fetching.md)

---

## Core Concept 3: React 19 — Compiler, Actions & New Primitives / Compiler, Actions & Hàm Mới

> 🧠 **Memory Hook:**
> 🇬🇧 "Compiler = Grammarly that auto-adds memoization. Actions = async form handler that manages loading/error for you. `use()` = useContext that works inside if/for."
> 🇻🇳 "Compiler = Grammarly tự thêm memoization. Actions = async form handler tự quản lý loading/error. `use()` = useContext mà được gọi trong if/for."

### Why exists — Tại sao tồn tại?

🇬🇧 **Level 1 — What's the problem?**
React 18 still requires developers to manually write `useMemo`/`useCallback` everywhere for performance, and manually manage `isPending`/`isError` for every async operation.

🇻🇳 **Level 1 — Vấn đề là gì?**
React 18 vẫn bắt developer tự viết `useMemo`/`useCallback` ở mọi nơi cần performance, và tự quản lý `isPending`/`isError` cho mọi async operation.

🇬🇧 **Level 2 — Why is manual memoization bad?**
Developers forget → app is slow. Wrong deps → bugs. Add when not needed → wasted overhead. **3 types of errors from 1 task** → let the machine do it.

🇻🇳 **Level 2 — Manual memoization tệ ở chỗ nào?**
Developer quên thêm → app chậm. Thêm sai deps → bug. Thêm không cần → waste overhead. **3 kiểu lỗi từ 1 công việc** → nên để máy làm.

🇬🇧 **Level 2b — Why is manual async state bad?**
Every form submit needs the same 4 states: isPending, isError, error, data → copy-paste 100 times in a project. React 19 Actions bundles them into 1 hook.

🇻🇳 **Level 2b — Manual async state tệ ở chỗ nào?**
Mỗi form submit cần 4 state giống nhau: isPending, isError, error, data → copy-paste 100 lần trong project. React 19 Actions gộp thành 1 hook.

### Layer 1: Everyday Analogy / Ví Dụ Đời Thường

🇬🇧

- **React Compiler** = Grammarly for code. You write content (component), Grammarly auto-corrects spelling (adds useMemo/useCallback). You focus on writing correct content, Grammarly handles optimization.
- **Actions** = ATM machine. Previously you had to count money, check balance, handle errors yourself. ATM does everything — you just enter the amount and press OK.
- **`use()`** = looking up a dictionary. `useContext` = must look at the beginning of the book (Rules of Hooks). `use()` = can look up any page, even mid-chapter.

🇻🇳

- **React Compiler** = Grammarly cho code. Bạn viết văn (component), Grammarly tự sửa lỗi chính tả (thêm useMemo/useCallback). Bạn tập trung viết nội dung đúng, Grammarly lo phần optimize.
- **Actions** = máy ATM tự động. Trước đây bạn phải tự đếm tiền, kiểm tra số dư, xử lý lỗi. ATM làm hết — bạn chỉ nhập số tiền và nhấn OK.
- **`use()`** = tra từ điển. `useContext` = phải tra ở đầu sách (Rules of Hooks). `use()` = tra bất kỳ trang nào, kể cả giữa chương.

### Layer 2: How It Works / Cách Hoạt Động

🇬🇧 **React Compiler — auto-memoization at build time:**

🇻🇳 **React Compiler — auto-memoization tại build time:**

```
Developer writes:                    Compiler output:
                                     (auto-adds memoization)

function ProductList({ products }) { function ProductList({ products }) {
  const sorted = products              const sorted = useMemo(
    .sort((a, b) =>                      () => products.sort((a, b) =>
      a.price - b.price);                  a.price - b.price),
                                         [products]
  return <List items={sorted} />;        );
}                                      return <List items={sorted} />;
                                     }

Process / Quy trình:
┌──────────┐    ┌──────────┐    ┌──────────┐
│ Your Code │ →  │ Compiler │ →  │ Optimized│
│ (pure)    │    │ analyzes │    │ Code     │
│           │    │ AST      │    │ (+ memo) │
└──────────┘    └──────────┘    └──────────┘
```

🇬🇧 **Requirements for compiler to work:**

- Component must be **pure** (same input → same output)
- No side effects in render
- Follow Rules of Hooks
- Component that violates → compiler **skips** (no error, just no optimization)

🇻🇳 **Yêu cầu compiler hoạt động:**

- Component phải **pure** (same input → same output)
- Không side effects trong render
- Tuân thủ Rules of Hooks
- Component vi phạm → compiler **skip** (không lỗi, chỉ không optimize)

🇬🇧 **Actions — `useActionState` manages async forms:**

🇻🇳 **Actions — `useActionState` quản lý async form:**

```tsx
// ❌ React 18: 4 manual states for EACH form
// ❌ React 18: 4 state thủ công cho MỖI form
const [isPending, setIsPending] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);

async function handleSubmit(e) {
  e.preventDefault();
  setIsPending(true);
  setError(null);
  try {
    const result = await saveProfile(formData);
    setData(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsPending(false);
  }
}

// ✅ React 19: useActionState bundles everything
// ✅ React 19: useActionState gộp tất cả
const [state, submitAction, isPending] = useActionState(
  async (prevState, formData: FormData) => {
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
  <button disabled={isPending}>{isPending ? "Saving… / Đang lưu…" : "Save / Lưu"}</button>
  {!state.success && state.error && <p className="error">{state.error}</p>}
</form>;
```

🇬🇧 **`useOptimistic` — instant feedback:**

🇻🇳 **`useOptimistic` — phản hồi tức thì:**

```tsx
const [optimisticMessages, addOptimistic] = useOptimistic(messages, (current, newMsg) => [
  ...current,
  { ...newMsg, pending: true },
]);

async function handleSend(text: string) {
  addOptimistic({ text, id: crypto.randomUUID() }); // shows IMMEDIATELY / hiển thị NGAY
  await sendMessage(text); // if error → React AUTO rollbacks / nếu lỗi → React TỰ ĐỘNG rollback
}
```

🇬🇧 **`use()` — flexible Promise/Context reading:**

🇻🇳 **`use()` — đọc Promise/Context linh hoạt:**

```tsx
// use() is NOT a hook → CAN be called in if/for (unlike useContext)
// use() KHÔNG phải hook → ĐƯỢC gọi trong if/for (khác useContext)
function ProductDetails({ pricePromise }: { pricePromise: Promise<Price> }) {
  if (showPrice) {
    const price = use(pricePromise); // ✅ inside if — OK!
    return <span>${price.amount}</span>;
  }
  const theme = use(ThemeContext); // ✅ replaces useContext
  return <span style={{ color: theme.primary }}>Hidden</span>;
}
```

🇬🇧 **ref as prop (React 19):**

🇻🇳 **ref là prop bình thường (React 19):**

```tsx
// ❌ React 18: needs forwardRef wrapper
const Input = forwardRef((props, ref) => <input ref={ref} {...props} />);

// ✅ React 19: ref is a normal prop
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

### Layer 3: Edge Cases / Trường Hợp Đặc Biệt

🇬🇧

- **Compiler skip**: Component with mutation in render (`array.push()` in render body) → compiler doesn't optimize → no error but no speedup
- **`useOptimistic` + financial transactions**: DO NOT use for payment/transfer. User sees "success" but server rejects → confusing. Only use for like, chat, cart.
- **`use(promise)` needs Suspense**: `use()` suspends the component → MUST have `<Suspense>` boundary above, otherwise app crashes
- **`use(promise)` needs stable reference**: If each render creates a new promise → infinite suspend loop. Promise must be created OUTSIDE the component or cached.

🇻🇳

- **Compiler skip**: Component có mutation trong render (`array.push()` trong render body) → compiler không optimize → không lỗi nhưng không nhanh hơn
- **`useOptimistic` + giao dịch tài chính**: KHÔNG nên dùng cho payment/transfer. User thấy "thành công" nhưng server reject → confusing. Chỉ dùng cho like, chat, cart.
- **`use(promise)` cần Suspense**: `use()` suspend component → PHẢI có `<Suspense>` boundary phía trên, nếu không app crash
- **`use(promise)` cần stable reference**: Nếu mỗi render tạo promise mới → infinite suspend loop. Promise phải được tạo NGOÀI component hoặc cached.

**❌ Common Mistakes / Sai lầm thường gặp:**

| ❌ Mistake / Sai                                                                 | Why wrong / Tại sao sai                                                                                          | ✅ Correct / Đúng                                                                |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| "Compiler → no more performance worries" / "Compiler → không cần lo performance" | Compiler only adds memo — doesn't fix bad architecture / Chỉ thêm memo — không fix kiến trúc xấu                 | Still need profiling + good architecture / Vẫn cần profiling + kiến trúc tốt     |
| Use `useOptimistic` for payment / Dùng `useOptimistic` cho payment               | User sees "success" but server rejects → trust lost / User thấy "thành công" nhưng server reject → mất tin tưởng | Only for non-critical: like, chat, cart / Chỉ cho non-critical: like, chat, cart |
| `use(promise)` without Suspense boundary / `use(promise)` không có Suspense      | `use()` suspends component → crash without fallback / suspend component → crash                                  | Always wrap in `<Suspense fallback={...}>` / Luôn bọc trong `<Suspense>`         |
| Create NEW promise in render for `use()` / Tạo promise MỚI trong render          | Each render creates new promise → infinite loop / Mỗi render tạo promise mới → vòng lặp vô hạn                   | Cache promise or create outside component / Cache hoặc tạo ngoài component       |

**🎯 Interview Pattern:**

🇬🇧 When you hear: "How does React 19 change form handling?" → Remember: `useActionState` manages isPending/state/error. Forms use `action` instead of `onSubmit`.
→ Opening: "React 19 introduces `useActionState` — it wraps an async function and auto-tracks pending state + result. It replaces the manual pattern of `const [isPending, setIsPending] = useState(false)` and `try/catch` for every form."

🇻🇳 Khi thấy: "React 19 thay đổi cách xử lý form?" → Nhớ: `useActionState` quản lý isPending/state/error. Form dùng `action` thay vì `onSubmit`.
→ Mở đầu: "React 19 giới thiệu `useActionState` — bọc async function và tự track pending state + result. Thay thế pattern thủ công `const [isPending, setIsPending] = useState(false)` và `try/catch` cho mọi form."

**🔑 Knowledge Chain:**

- 📚 Prereq: [React 19 Features — full deep dive](./02-react-19-features.md)
- ➡️ Enables: [Next.js Data Fetching — Server Actions + useOptimistic](../04-nextjs/02-data-fetching.md)

---

## Core Concept 4: Streaming SSR — Sending HTML In Parts / Gửi HTML Từng Phần

> 🧠 **Memory Hook:**
> 🇬🇧 "React 17 SSR = fax (send everything at once). React 18 SSR = live stream (send each part when ready)."
> 🇻🇳 "React 17 SSR = fax (gửi hết 1 lần). React 18 SSR = live stream (gửi từng phần khi sẵn sàng)."

### Why exists — Tại sao tồn tại?

🇬🇧 **Level 1 — What's the problem?**
React 17 SSR has 3 "all-or-nothing" bottlenecks: (1) fetch ALL data → then send HTML. (2) Load ALL JS → then hydrate. (3) Hydrate the ENTIRE page → then interactive.

🇻🇳 **Level 1 — Vấn đề là gì?**
React 17 SSR có 3 bottleneck "all-or-nothing": (1) fetch TOÀN BỘ data → rồi mới gửi HTML. (2) Tải TOÀN BỘ JS → rồi mới hydrate. (3) Hydrate TOÀN BỘ page → rồi mới interactive.

🇬🇧 **Level 2 — Why does each step block?**
`renderToString()` must wait for all data to resolve before creating the HTML string. Hydration is synchronous — can't hydrate half a page. 1 slow query taking 2s → the entire page is delayed 2s.

🇻🇳 **Level 2 — Tại sao từng bước đều block?**
`renderToString()` phải đợi mọi data resolve trước khi tạo HTML string. Hydration là quá trình đồng bộ — không thể hydrate nửa page. 1 query chậm 2s → toàn bộ page chậm 2s.

### Layer 1: Everyday Analogy / Ví Dụ Đời Thường

🇬🇧

- **React 17 SSR** = a buffet restaurant that must set up ALL 50 dishes before opening → customers wait 30 minutes outside
- **React 18 Streaming SSR** = a buffet that opens each station when ready → customers eat salad first, sushi opens after 5 min, grill opens after 10 min

🇻🇳

- **React 17 SSR** = nhà hàng buffet phải bày xong TOÀN BỘ 50 món rồi mới mở cửa → khách đợi 30 phút ngoài cửa
- **React 18 Streaming SSR** = nhà hàng bày từng quầy khi sẵn sàng → khách vào ăn salad trước, quầy sushi mở sau 5 phút, quầy nướng mở sau 10 phút

### Layer 2: How It Works / Cách Hoạt Động

```
React 17 SSR:
┌─────────────────────────────────────────────────────┐
│ 1. Server: renderToString() → waits for ALL data     │
│    [────── 800ms waiting for DB ──────]               │
│ 2. Sends ENTIRE HTML at once                          │
│ 3. Browser: loads all JS → hydrates entire page       │
│    [User sees blank page until step 3 finishes]       │
└─────────────────────────────────────────────────────┘

React 18 Streaming SSR:
┌─────────────────────────────────────────────────────┐
│ 1. Server: renderToPipeableStream()                   │
│    → Sends shell HTML immediately (layout, nav) ~50ms │
│    → User SEES PAGE right away                        │
│                                                       │
│ 2. <Suspense> boundaries stream when data is ready    │
│    → Header streams: 50ms                             │
│    → Product list streams: 200ms                      │
│    → Reviews stream: 500ms                            │
│    → Each part shows when arrived, no waiting          │
│                                                       │
│ 3. Selective hydration: React hydrates each part       │
│    → User clicks a section → hydrates that FIRST       │
└─────────────────────────────────────────────────────┘
```

```tsx
// Streaming SSR with Suspense boundaries
// Streaming SSR với Suspense boundaries
function ProductPage() {
  return (
    <Layout>
      {" "}
      {/* Streams immediately */}
      <Header /> {/* Streams immediately */}
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails /> {/* Streams when data ready */}
      </Suspense>
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews /> {/* Streams when reviews loaded */}
      </Suspense>
    </Layout>
  );
}
```

### Layer 3: Edge Cases / Trường Hợp Đặc Biệt

🇬🇧

- **Selective hydration priority**: User clicks Reviews section → React hydrates Reviews FIRST even if ProductDetails streamed earlier
- **`useId` for SSR-safe IDs**: Concurrent rendering may render multiple times → use `useId()` instead of `Math.random()` for unique IDs
- **`useSyncExternalStore`**: External stores (Redux, Zustand) can experience "tearing" in concurrent render → this hook guarantees consistency

🇻🇳

- **Ưu tiên selective hydration**: User click vào Reviews section → React hydrate Reviews TRƯỚC dù ProductDetails stream trước
- **`useId` cho SSR-safe IDs**: Concurrent rendering có thể render nhiều lần → dùng `useId()` thay `Math.random()` cho unique IDs
- **`useSyncExternalStore`**: External stores (Redux, Zustand) có thể bị "tearing" trong concurrent render → hook này đảm bảo consistent

**❌ Common Mistakes / Sai lầm thường gặp:**

| ❌ Mistake / Sai                                                              | Why wrong / Tại sao sai                                                                                              | ✅ Correct / Đúng                                                                 |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| "Streaming SSR makes page load faster" / "Streaming SSR trang load nhanh hơn" | Total time may be same — but user **sees** content sooner / Tổng thời gian có thể bằng — nhưng user **thấy** sớm hơn | Improves TTFB and perceived performance / Cải thiện TTFB và perceived performance |
| Don't wrap async component in Suspense / Không wrap async trong Suspense      | Component suspends → crash or error display / Component suspend → crash                                              | Every async boundary needs `<Suspense fallback>` / Mọi async cần `<Suspense>`     |
| Use `Math.random()` for key in SSR                                            | Server and client generate different randoms → hydration mismatch / Server và client random khác nhau                | Use `useId()` for SSR-safe unique IDs / Dùng `useId()`                            |

**🎯 Interview Pattern:**

🇬🇧 When you hear: "Compare React 17 SSR and React 18 streaming SSR" → Remember: 3 all-or-nothing bottlenecks → 3 incremental solutions.
→ Opening: "React 17 SSR blocks at 3 points: data must finish before sending HTML, HTML must finish before hydrating, hydration must finish before interaction. React 18 streaming solves all 3: sends HTML incrementally via Suspense boundaries, hydrates selectively by priority, and hydration can be interrupted by user interaction."

🇻🇳 Khi thấy: "So sánh React 17 SSR và React 18 streaming SSR" → Nhớ: 3 bottleneck all-or-nothing → 3 giải pháp incremental.
→ Mở đầu: "React 17 SSR bị block ở 3 điểm: data fetch xong mới gửi HTML, HTML xong mới hydrate, hydrate xong mới interactive. React 18 streaming giải quyết cả 3: gửi HTML incremental qua Suspense boundaries, hydrate selective theo priority, và hydration có thể bị interrupt bởi user interaction."

**🔑 Knowledge Chain:**

- 📚 Prereq: [React Fundamentals — Fiber architecture](./01-react-fundamentals.md)
- ➡️ Enables: [Next.js — streaming SSR implementation](../04-nextjs/02-data-fetching.md)

---

## Core Concept 5: Migration Strategy — From React 17 to React 19 / Chiến Lược Di Chuyển

> 🧠 **Memory Hook:**
> 🇬🇧 "Migration = renovating a house while living in it — replace one room at a time, don't demolish the whole thing."
> 🇻🇳 "Migration = sửa nhà đang ở — thay từng phòng, không đập cả nhà xây lại."

### Why exists — Tại sao tồn tại?

🇬🇧 **Level 1 — What's the problem?**
Many teams want to use React 19 but have a large React 17 codebase. A "big bang" upgrade is too risky — need a step-by-step strategy.

🇻🇳 **Level 1 — Vấn đề là gì?**
Nhiều team muốn dùng React 19 nhưng có codebase React 17 lớn. Upgrade "big bang" quá rủi ro — cần chiến lược từng bước.

🇬🇧 **Level 2 — Why not upgrade directly?**
React 18 has breaking changes (Strict Mode 2x render, auto batching). React 19 adds Compiler requirements for pure components. Jumping from 17 → 19 can cause hundreds of errors at once.

🇻🇳 **Level 2 — Tại sao không upgrade thẳng?**
React 18 có breaking changes (Strict Mode 2x render, auto batching). React 19 thêm Compiler yêu cầu component pure. Upgrade thẳng từ 17 → 19 có thể gây hàng trăm lỗi cùng lúc.

### Layer 1: Everyday Analogy / Ví Dụ Đời Thường

🇬🇧 Renovating a house while living in it:

- **Wrong**: Demolish the entire house, rebuild → where do you live for 6 months?
- **Right**: Renovate one room at a time: living room (week 1) → kitchen (week 2) → bedroom (week 3)
- React migration works the same — upgrade layer by layer, verify each step.

🇻🇳 Sửa nhà đang ở:

- **Sai**: Đập cả nhà, xây lại → ở đâu trong 6 tháng?
- **Đúng**: Sửa từng phòng: phòng khách (tuần 1) → bếp (tuần 2) → phòng ngủ (tuần 3)
- Migration React cũng vậy — upgrade từng lớp, verify từng bước.

### Layer 2: How It Works / Cách Hoạt Động

```
MIGRATION PATH:

React 17 → React 18 → React 19
───────    ────────    ────────

Step 1: React 17 → 18 (Low risk)
├── Change ReactDOM.render → createRoot
├── Test: does auto batching break anything?
├── Enable Strict Mode → fix double-render issues
└── Verify: all tests pass

Step 2: Adopt React 18 APIs (Medium risk)
├── Add useTransition for search/filter
├── Add Suspense boundaries for data loading
├── Replace custom loading states → Suspense
└── Verify: performance improved

Step 3: React 18 → 19 (Medium risk)
├── Add React Compiler (babel plugin)
├── Audit: ESLint plugin finds impure components
├── Fix impure components or opt-out
├── Gradually remove manual useMemo/useCallback
└── Verify: bundle size reduced, performance same/better

Step 4: Adopt React 19 APIs (Low risk)
├── Replace forwardRef → ref as prop
├── Replace useState loading → useActionState
├── Replace useContext → use(Context) where needed
└── Verify: code simpler, same behavior
```

🇬🇧 **Compiler adoption checklist:**

🇻🇳 **Checklist áp dụng Compiler:**

```tsx
// 1. Add babel plugin / Thêm babel plugin
// babel.config.js
module.exports = {
  plugins: [
    [
      "babel-plugin-react-compiler",
      {
        // Start with 1 folder / Bắt đầu với 1 folder
        sources: (filename) => filename.includes("src/components/new/"),
      },
    ],
  ],
};

// 2. ESLint plugin audit / Kiểm tra ESLint
// Finds impure components / Phát hiện component không pure:
// ❌ Mutation in render / Mutation trong render
function Bad({ items }) {
  items.push(newItem); // ESLint warning: mutates props
  return <List items={items} />;
}

// ✅ Pure component
function Good({ items }) {
  const withNew = [...items, newItem]; // creates new array / tạo array mới
  return <List items={withNew} />;
}

// 3. Gradually expand scope / Dần mở rộng scope
// sources: (filename) => filename.includes('src/'),  // entire src / toàn bộ src
```

### Layer 3: Edge Cases / Trường Hợp Đặc Biệt

🇬🇧

- **React.StrictMode double render**: React 18 Strict Mode calls render twice (dev only) → detects side effects in render. Components with `console.log` in render will log twice — this is NOT a bug.
- **Third-party libraries**: Some libraries aren't compatible with React 18 concurrent mode → check release notes before upgrading
- **Compiler opt-out per component**: Add `'use no memo'` directive at the top of a component for the compiler to skip it

🇻🇳

- **React.StrictMode double render**: React 18 Strict Mode gọi render 2 lần (dev only) → phát hiện side effects trong render. Component có `console.log` trong render sẽ log 2 lần — KHÔNG phải bug.
- **Third-party libraries**: Một số libraries chưa tương thích React 18 concurrent mode → check release notes trước khi upgrade
- **Compiler opt-out per component**: Thêm `'use no memo'` directive ở đầu component để compiler skip

**❌ Common Mistakes / Sai lầm thường gặp:**

| ❌ Mistake / Sai                                                                                     | Why wrong / Tại sao sai                                                                                             | ✅ Correct / Đúng                                                                     |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Upgrade React 17 → 19 in one step / Upgrade 17 → 19 một lần                                          | Too many breaking changes at once → hard to debug / Quá nhiều thay đổi → khó debug                                  | Upgrade 17 → 18 → verify → 19 → verify                                                |
| Enable Compiler for entire codebase immediately / Bật Compiler toàn bộ ngay                          | Impure components get skipped → false sense of "working" / Component impure bị skip → cảm giác sai "đang hoạt động" | Start 1 folder, audit ESLint, expand gradually / Bắt đầu 1 folder, audit, mở rộng dần |
| Delete all useMemo/useCallback when enabling Compiler / Xóa hết useMemo/useCallback khi bật Compiler | Compiler may skip some components → removing memo = slower / Compiler có thể skip → xóa memo = chậm hơn             | Use Profiler to verify before removing / Dùng Profiler verify trước khi xóa           |

**🎯 Interview Pattern:**

🇬🇧 When you hear: "Strategy to migrate from React 17 to React 19?" → Remember: incremental — 17→18→verify→19→verify. Compiler starts from 1 folder.
→ Opening: "Migration should be incremental: React 17→18 first (switch to createRoot, fix Strict Mode issues), verify all tests. Then 18→19 (add Compiler from 1 folder, audit ESLint for purity, expand gradually). Never 'big bang' upgrade because breaking changes from auto batching and Compiler requirements overlap."

🇻🇳 Khi thấy: "Chiến lược migrate từ React 17 lên React 19?" → Nhớ: incremental — 17→18→verify→19→verify. Compiler bắt đầu 1 folder.
→ Mở đầu: "Migration nên incremental: React 17→18 trước (đổi createRoot, fix Strict Mode issues), verify tất cả tests. Sau đó 18→19 (thêm Compiler từ 1 folder, audit ESLint cho purity, mở rộng dần). Không nên 'big bang' upgrade vì breaking changes từ auto batching và Compiler requirements chồng chéo."

**🔑 Knowledge Chain:**

- 📚 Prereq: [React Fundamentals — pure components](./01-react-fundamentals.md)
- ➡️ Enables: [React 19 Features — Compiler details](./02-react-19-features.md)

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q1: How does React 18 auto batching differ from React 17? / Auto batching React 18 khác React 17 ở đâu? 🟢 Junior

**🇬🇧 Answer:**
React 17 only batched setState **inside React event handlers** (onClick, onChange). setState inside setTimeout, Promise, or native event listeners → each setState caused a separate render.

React 18 batches setState **everywhere** — event handlers, setTimeout, Promise `.then()`, native event listeners. All setState calls within the same microtask are grouped into 1 render.

```tsx
// setTimeout with 3 setState calls:
// React 17: 3 renders | React 18: 1 render
setTimeout(() => {
  setA(1); // React 17: render | React 18: ─┐
  setB(2); // React 17: render |             │ 1 render
  setC(3); // React 17: render | React 18: ─┘
}, 0);

// Opt-out (rare): flushSync(() => setState(...))
```

**🇻🇳 Trả lời:**
React 17 chỉ batch setState **trong React event handlers** (onClick, onChange). setState trong setTimeout, Promise, native event listener → mỗi setState gây 1 render riêng.

React 18 batch setState **ở mọi nơi** — event handlers, setTimeout, Promise `.then()`, native events. Tất cả setState trong cùng 1 microtask được gộp thành 1 render.

**💡 Interview Signal:**

- ✅ Strong: Points out React 17 batches WHERE (only event handlers) vs React 18 batches EVERYWHERE
- ❌ Weak: "React 18 batches setState" (React 17 also batches — the question is WHERE)

---

### Q2: How does `createRoot` differ from `ReactDOM.render`? Why must you switch? / `createRoot` khác `ReactDOM.render` ở đâu? 🟢 Junior

**🇬🇧 Answer:**
`ReactDOM.render` is the legacy API — runs in synchronous mode. Using this API means React 18 behaves exactly like React 17: no auto batching outside event handlers, no useTransition, no streaming SSR.

`createRoot` enables concurrent mode — all new features of React 18/19 require `createRoot`.

```tsx
// ❌ Legacy — disables concurrent features
ReactDOM.render(<App />, document.getElementById("root"));

// ✅ Modern — enables concurrent features
import { createRoot } from "react-dom/client";
createRoot(document.getElementById("root")!).render(<App />);
```

**🇻🇳 Trả lời:**
`ReactDOM.render` là API cũ — chạy ở synchronous mode. Dùng API này thì React 18 hoạt động y như React 17: không có auto batching ngoài event handler, không có useTransition, không có streaming SSR.

`createRoot` bật concurrent mode — tất cả features mới React 18/19 đều yêu cầu `createRoot`.

**💡 Interview Signal:**

- ✅ Strong: Explains `createRoot` is the entry point for concurrent mode, lists features disabled with legacy
- ❌ Weak: "createRoot is the new way to render" (true but doesn't explain WHY)

---

### Q3: What problem does concurrent rendering solve? How does it work? / Concurrent rendering giải quyết gì? 🟡 Mid

**🇬🇧 Answer:**
**Problem:** React 17 renders synchronously and cannot be interrupted. Rendering 300ms (filtering a large list) → browser freezes → user types but sees no response.

**Solution:** React 18 uses a fiber-based scheduler that can:

1. **Pause** non-urgent render mid-way (after each fiber unit of work)
2. **Check** if there's a high-priority update (user keystroke)
3. **Handle** high-priority first (render keystroke in 1ms)
4. **Resume** or restart low-priority render

React doesn't render FASTER — same work, same time. React renders **SMARTER** — interleaves urgent and non-urgent work.

APIs: `useTransition` (marks state update as non-urgent), `useDeferredValue` (defers derived value), `startTransition` (non-hook version).

**🇻🇳 Trả lời:**
**Vấn đề:** React 17 render đồng bộ, không thể ngắt. Render 300ms (filter list lớn) → browser đóng băng → user gõ nhưng không thấy response.

**Giải pháp:** React 18 dùng fiber-based scheduler có thể:

1. **Pause** render không gấp giữa chừng (sau mỗi fiber unit of work)
2. **Check** có high-priority update không (user gõ phím)
3. **Handle** high-priority trước (render keystroke 1ms)
4. **Resume** hoặc restart low-priority render

React không render NHANH hơn — cùng công việc, cùng thời gian. React render **THÔNG MINH hơn** — xen kẽ việc gấp và không gấp.

**💡 Interview Signal:**

- ✅ Strong: Explains synchronous blocking problem specifically, describes pause/resume mechanism, mentions `createRoot` requirement
- ❌ Weak: "React 18 renders faster" (wrong — it renders non-blocking, not faster)

---

### Q4: When to use `useTransition` vs `useDeferredValue`? / Khi nào dùng cái nào? 🟡 Mid

**🇬🇧 Answer:**
**`useTransition`** — when you **control setState**:

```tsx
const [isPending, startTransition] = useTransition();
// You CALL setState → you wrap it
startTransition(() => {
  setSearchResults(filterHugeList(query)); // non-urgent
});
```

**`useDeferredValue`** — when you **DON'T control setState** (receive value from props/parent):

```tsx
// Parent passes query down — you don't control when setState happens
function Results({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query); // defer the value
  const results = filterHugeList(deferredQuery);
  return <List items={results} />;
}
```

**Simple rule:**

- You call `setState` → `useTransition`
- You receive value from elsewhere → `useDeferredValue`
- Both mark work as "non-urgent" → React prioritizes user input

**🇻🇳 Trả lời:**
**`useTransition`** — khi bạn **kiểm soát setState**: bạn GỌI setState → bạn wrap nó.

**`useDeferredValue`** — khi bạn **KHÔNG kiểm soát setState** (nhận value từ props/parent): bạn nhận value → bạn trì hoãn nó.

**Quy tắc đơn giản:** Bạn gọi `setState` → `useTransition`. Bạn nhận value → `useDeferredValue`. Cả hai = "việc này không gấp, xử lý user input trước".

**💡 Interview Signal:**

- ✅ Strong: Distinguishes "controls setState" vs "receives value" — this is the selection criterion
- ❌ Weak: Describes 2 hooks separately without comparing when to use which

---

### Q5: What are the rules for mixing Server Components and Client Components? / Luật kết hợp SC và CC? 🟡 Mid

**🇬🇧 Answer:**
3 core rules:

1. **Server → Client (via props)**: Server Component imports and renders Client Component, passing **serializable props** (string, number, plain object, array). CANNOT pass function, class instance, Date.

2. **Client → Server import NOT ALLOWED**: Client Component cannot `import` Server Component as it would ship server code to the client. **Solution**: use children/slot pattern — parent Server Component renders server child and passes it as `children` into a Client wrapper.

3. **`'use client'` is a BOUNDARY, not a file property**: Marking `'use client'` → that file AND ALL its imports become client modules. Place it too high → entire tree becomes client JS.

Server Actions (`'use server'`) are the only exception — serialized as references, can be passed from server → client.

**🇻🇳 Trả lời:**
3 rules cốt lõi:

1. **Server → Client (qua props)**: Server import Client OK, pass **serializable props** (string, number, object, array). KHÔNG pass function, class instance, Date.

2. **Client → Server import KHÔNG ĐƯỢC**: Client không thể import Server Component. **Giải pháp**: dùng children pattern — parent Server render server child và pass như `children` vào Client wrapper.

3. **`'use client'` là BOUNDARY**: Đánh dấu `'use client'` → file đó VÀ TẤT CẢ imports đều thành client module. Đặt quá cao → cả cây thành client JS.

Server Actions (`'use server'`) là ngoại lệ — serialize dưới dạng reference.

**💡 Interview Signal:**

- ✅ Strong: Explains serialization constraint, children workaround, `'use client'` infects imports
- ❌ Weak: "Server runs on server, Client runs on client" (doesn't explain composition rules)

---

### Q6: How does React Compiler change the way you write components? What still needs manual optimization? / Compiler thay đổi gì? Vẫn cần optimize gì? 🔴 Senior

**🇬🇧 Answer:**
React Compiler is a **build-time static analyzer** — it reads the AST of your component, finds computations that only depend on props/state (pure), and auto-adds `useMemo`/`useCallback`.

**Workflow change:** No need to write `useMemo(fn, [deps])` and `useCallback(fn, [deps])` manually. Compiler handles it → developer focuses on correct logic.

**Still needs manual optimization:**

1. **State colocation** — place state near the component that uses it (Compiler doesn't move state)
2. **Virtualization** — render 10 items instead of 10000 (Compiler doesn't add virtualization)
3. **Code splitting** — lazy load routes/components (Compiler doesn't split code)
4. **`React.memo`** — Compiler handles values/functions but doesn't yet handle component skip logic
5. **Profiling** — still need to measure real performance

**Requirement:** Component must be pure (follow Rules of React). Compiler skips violating components — no error, just no optimization.

**🇻🇳 Trả lời:**
React Compiler là **build-time static analyzer** — đọc AST của component, tìm computations chỉ phụ thuộc props/state (pure), và tự thêm `useMemo`/`useCallback`.

**Thay đổi workflow:** Không cần viết `useMemo`/`useCallback` thủ công. Compiler tự xử lý → developer tập trung logic đúng.

**VẪN CẦN optimize thủ công:**

1. **State colocation** — đặt state gần component dùng nó (Compiler không di chuyển state)
2. **Virtualization** — render 10 items thay 10000 (Compiler không thêm virtualization)
3. **Code splitting** — lazy load routes (Compiler không split code)
4. **`React.memo`** — Compiler handle values/functions nhưng chưa handle component skip
5. **Profiling** — vẫn cần đo performance thực tế

**Yêu cầu:** Component phải pure. Compiler skip component vi phạm — không lỗi, chỉ không optimize.

**💡 Interview Signal:**

- ✅ Strong: Explains build-time (not runtime), distinguishes from React.memo, lists what STILL NEEDS manual work
- ❌ Weak: "Compiler auto-memoizes everything" (only handles pure components, only values/functions)

**🔗 Follow-up Chain:**

1. 🇬🇧 "How do you know which components the Compiler skipped?" → ESLint plugin `eslint-plugin-react-compiler` warns on components violating Rules of React. In production, use React DevTools Profiler to see which components lack memo.
   🇻🇳 "Làm sao biết component nào bị skip?" → ESLint plugin báo warning. Production dùng React DevTools Profiler xem component nào không có memo.

2. 🇬🇧 "Can the Compiler cause regressions?" → Yes, if a component depends on side effects in render (e.g., `console.log` count). Compiler memo = skip render = side effect doesn't run. Fix: move side effects into useEffect.
   🇻🇳 "Compiler có thể gây regression không?" → Có nếu component phụ thuộc side effect trong render. Compiler memo = skip render = side effect không chạy. Fix: di chuyển vào useEffect.

3. 🇬🇧 "When should you NOT enable the Compiler?" → Codebases with many impure patterns (mutation in render, class components). Audit ESLint first, fix violations, then enable.
   🇻🇳 "Khi nào KHÔNG nên bật Compiler?" → Codebase có nhiều impure patterns. Audit ESLint trước, fix violations, rồi mới bật.

---

### Q7: How does `useOptimistic` differ from immediate `setState`? When to use, when NOT? / `useOptimistic` khác `setState` ở đâu? 🔴 Senior

**🇬🇧 Answer:**
`useOptimistic` provides **temporary optimistic state that auto-reverts** when an async action fails. 3 differences from `setState`:

1. **Automatic revert on error**: Action throws → React auto-discards optimistic value, shows real state. No manual rollback code needed.
2. **Concurrent-safe**: Understands concurrent model. Optimistic state doesn't block/race with real state update from server.
3. **Scoped to action**: Action succeeds → optimistic value replaced by real server response. With `setState` you must sync manually.

```tsx
// useOptimistic: user sees immediately, server error → AUTO rollback
const [optimisticLikes, addLike] = useOptimistic(likes, (current, newLike) => [
  ...current,
  newLike,
]);
async function handleLike() {
  addLike({ id: "temp", userId: me.id }); // shows IMMEDIATELY
  await serverLike(postId); // error → React rollbacks
}

// setState: user sees immediately, server error → MUST SELF rollback
async function handleLike() {
  const prev = likes;
  setLikes([...likes, { id: "temp", userId: me.id }]); // shows immediately
  try {
    await serverLike(postId);
  } catch {
    setLikes(prev);
  } // must rollback yourself!
}
```

**Use for:** like, chat send, cart add, todo toggle — instant feedback, server confirms async.
**DO NOT use for:** payment, bank transfer, booking — user should NOT see "success" before server confirms.

**🇻🇳 Trả lời:**
`useOptimistic` cho **state tạm thời tự động revert** khi async action fail. 3 khác biệt với `setState`:

1. **Tự động revert khi lỗi**: Action throw → React tự discard, hiện state thật. Không cần code rollback.
2. **Concurrent-safe**: Hiểu concurrent model, không block/race với real state từ server.
3. **Gắn với action**: Action thành công → thay bằng real response. Với `setState` phải sync thủ công.

**Dùng cho:** like, chat, cart — feedback tức thì. **KHÔNG dùng cho:** payment, booking — cần server confirm trước.

**💡 Interview Signal:**

- ✅ Strong: Explains automatic rollback, distinguishes from manual setState, names when NOT to use
- ❌ Weak: "Shows new value while request runs" (correct but missing rollback and concurrent-safe aspects)

**🔗 Follow-up Chain:**

1. 🇬🇧 "If server succeeds but returns different data than optimistic value?" → React replaces optimistic value with real server data. UI updates smoothly because optimistic → real is a natural transition.
   🇻🇳 "Nếu server thành công nhưng trả data khác?" → React thay optimistic bằng real data. UI cập nhật smooth.

2. 🇬🇧 "Use `useOptimistic` in offline-first app?" → Must combine with a queue system. `useOptimistic` doesn't retry — only rollbacks on error. Need retry logic (TanStack Query, SWR) for offline.
   🇻🇳 "Dùng `useOptimistic` trong offline-first?" → Phải kết hợp queue system. `useOptimistic` không retry — chỉ rollback. Cần thêm retry logic.

3. 🇬🇧 "Multiple optimistic updates at once (user likes 3 posts rapidly)?" → Each `addOptimistic` stacks on current state. If post 2 fails, React rolls back post 2 but keeps post 1 and 3 (if successful). The reducer function handles merge logic.
   🇻🇳 "Nhiều optimistic updates cùng lúc?" → Mỗi `addOptimistic` stack lên state. Post 2 fail → rollback post 2, giữ post 1 và 3. Reducer function xử lý merge.

---

### Q8: Design migration strategy: React 17 → React 19 for a codebase with 200+ components. / Thiết kế chiến lược migrate 200+ components. 🔴 Senior

**🇬🇧 Answer:**

**Phase 1 — React 17 → 18 (1-2 weeks):**

- Switch `ReactDOM.render` → `createRoot` (1 line of code)
- Enable StrictMode → run test suite → fix double-render issues (side effects in render)
- Test auto batching: check code that depends on intermediate renders (very rare)
- ✅ Checkpoint: all tests pass, app works normally

**Phase 2 — Adopt React 18 APIs (2-4 weeks):**

- Identify slow interactions (search, filter, tab switch) → wrap with `useTransition`
- Replace custom loading states → `Suspense` boundaries
- If using SSR → migrate to `renderToPipeableStream` for streaming
- ✅ Checkpoint: Lighthouse scores improved, no regressions

**Phase 3 — React 18 → 19 + Compiler (2-4 weeks):**

- Add `eslint-plugin-react-compiler` → audit entire codebase → fix impure components
- Enable Compiler for 1 folder (`src/components/new/`) → verify performance
- Gradually expand scope → verify each step
- ✅ Checkpoint: Compiler covers 80%+ components, no regressions

**Phase 4 — Adopt React 19 APIs (1-2 weeks):**

- Replace `forwardRef` → ref as prop
- Replace manual form state → `useActionState`
- Replace `useContext` → `use(Context)` where needed conditionally
- Gradually remove manual `useMemo`/`useCallback` (verify each with Profiler)
- ✅ Checkpoint: code simpler, bundle smaller

**Risk mitigation:** Feature flags per phase. Canary deploy: 5% → 20% → 50% → 100%. Rollback plan: each phase is a git branch, can revert.

**🇻🇳 Trả lời:**

**Phase 1 — React 17 → 18 (1-2 tuần):** Đổi `createRoot`, bật StrictMode, fix double-render, test auto batching. ✅ Tất cả tests pass.

**Phase 2 — Adopt React 18 APIs (2-4 tuần):** Thêm useTransition cho search/filter, Suspense boundaries, streaming SSR nếu cần. ✅ Lighthouse improved.

**Phase 3 — React 18 → 19 + Compiler (2-4 tuần):** ESLint audit, bật Compiler 1 folder, mở rộng dần. ✅ Compiler covers 80%+.

**Phase 4 — Adopt React 19 APIs (1-2 tuần):** Replace forwardRef, useActionState, use(Context), xóa manual memo (verify Profiler). ✅ Code simpler.

**Risk mitigation:** Feature flags mỗi phase. Canary deploy 5%→20%→50%→100%. Mỗi phase = 1 git branch, revert được.

**💡 Interview Signal:**

- ✅ Strong: Incremental migration with checkpoints, gradual Compiler adoption, risk mitigation strategy
- ❌ Weak: "Upgrade React version in package.json and fix errors" (no strategy, no risk management)

**🔗 Follow-up Chain:**

1. 🇬🇧 "200 components but 50 are class components — how to handle?" → Class components still work in React 19 but Compiler skips them. Priority: convert class components that need performance → function components first. Use codemod `react-codemod/class-to-function` for straightforward cases.
   🇻🇳 "50 class components — xử lý sao?" → Class vẫn hoạt động nhưng Compiler skip. Ưu tiên convert class cần performance → function. Dùng codemod.

2. 🇬🇧 "How to measure migration success?" → 4 metrics: (a) Bundle size before/after, (b) Lighthouse Performance score, (c) Core Web Vitals (INP, LCP, CLS), (d) Compiler coverage % (how many components optimized).
   🇻🇳 "Đo thành công thế nào?" → 4 metrics: bundle size, Lighthouse, Core Web Vitals, Compiler coverage %.

3. 🇬🇧 "Team of 5, 2-week sprints — how to distribute?" → Phase 1-2: 1 person, 1 sprint (low risk). Phase 3: 2 people parallel (1 audit+fix, 1 test). Phase 4: all 5 (each owns 40 components). Total: ~3-4 sprints.
   🇻🇳 "Team 5 người, sprint 2 tuần?" → Phase 1-2: 1 người, 1 sprint. Phase 3: 2 người parallel. Phase 4: cả 5 người (mỗi người 40 components). Tổng: ~3-4 sprints.

---

## 📋 Interview Q&A Summary / Tóm Tắt Q&A

| #   | Question / Câu hỏi                 | Difficulty | Core Concept | Key Signal                                     |
| --- | ---------------------------------- | ---------- | ------------ | ---------------------------------------------- |
| Q1  | Auto batching React 17 vs 18       | 🟢 Junior  | Batching     | WHERE batch — event handler only vs everywhere |
| Q2  | createRoot vs ReactDOM.render      | 🟢 Junior  | Migration    | createRoot enables concurrent mode             |
| Q3  | Concurrent rendering solves what?  | 🟡 Mid     | Concurrent   | Interruptible rendering + scheduler priority   |
| Q4  | useTransition vs useDeferredValue  | 🟡 Mid     | Concurrent   | Controls setState vs receives value            |
| Q5  | Rules mixing SC and CC             | 🟡 Mid     | RSC          | Import rule + serializable + boundary          |
| Q6  | Compiler changes? Still need what? | 🔴 Senior  | React 19     | Build-time analyzer, still need architecture   |
| Q7  | useOptimistic vs setState          | 🔴 Senior  | React 19     | Auto rollback + when NOT to use                |
| Q8  | Migration strategy 17→19           | 🔴 Senior  | Migration    | Incremental phases + checkpoints               |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks suddenly: **"Your team is migrating from React 17 to React 18. The CTO asks: top 3 changes users will notice, and what do developers need to change?"**
> 🎯 Interviewer hỏi bất ngờ: **"Team migrate từ React 17 lên React 18. CTO hỏi: top 3 thay đổi user sẽ thấy, và developer cần thay gì?"**

**🇬🇧 30-second ideal opening:**

1. "For users, the 3 most noticeable improvements: (1) UI is more responsive thanks to concurrent rendering — typing and clicking respond instantly even during heavy renders; (2) pages load faster (perceived) with SSR thanks to streaming HTML in parts; (3) fewer unnecessary re-renders thanks to auto batching."
2. "For developers, the main change is switching `ReactDOM.render` to `createRoot` — 1 line of code enables all features."
3. "Optional: use `useTransition` to mark non-urgent updates, and `Suspense` boundaries for data loading."
4. "Auto batching and streaming SSR are automatically opt-in or framework-level — Next.js App Router handles streaming out of the box."

**🇻🇳 30 giây mở đầu lý tưởng:**

1. "Cho user, 3 cải thiện rõ nhất: (1) UI responsive hơn nhờ concurrent rendering — gõ phím và click phản hồi ngay kể cả khi đang render nặng; (2) trang load nhanh hơn (perceived) nếu dùng SSR nhờ streaming HTML từng phần; (3) ít re-render thừa nhờ auto batching."
2. "Cho developer, thay đổi chính là đổi `ReactDOM.render` sang `createRoot` — 1 dòng code bật toàn bộ features."
3. "Tùy chọn: dùng `useTransition` để đánh dấu update không gấp, và `Suspense` boundaries cho data loading."
4. "Auto batching và streaming SSR là opt-in tự động hoặc framework-level — Next.js App Router handle streaming sẵn."

---

## 🔄 Self-Check / Tự Kiểm Tra

> 🇬🇧 Close this document. Answer each question, then open and check.
> 🇻🇳 Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Type / Loại    | Question / Câu hỏi                                                                                                                                                                                                    |
| --- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Explain concurrent rendering using the "surgeon" example — why does React 17 block and React 18 doesn't? / Giải thích concurrent rendering bằng ví dụ "bác sĩ phẫu thuật" — tại sao React 17 block và React 18 không? |
| 2   | 🎨 Visual      | Draw timeline of React 17 SSR vs React 18 streaming SSR — show the 3 bottlenecks and how React 18 solves them / Vẽ timeline React 17 SSR vs React 18 streaming — chỉ ra 3 bottleneck và cách giải quyết               |
| 3   | 🛠️ Application | Codebase with 200 React 17 components. Write a 4-phase migration plan with checkpoints. / Codebase 200 components React 17. Viết migration plan 4 phases với checkpoint.                                              |
| 4   | 🐛 Debug       | Client Component imports Server Component directly → what error? How to fix while still using Server Component? / Client import Server trực tiếp → lỗi gì? Fix cách nào?                                              |
| 5   | 🎓 Teach       | Explain `useOptimistic` to a backend developer: how does it differ from `setState`? When NOT to use? / Giải thích `useOptimistic` cho backend developer: khác `setState` chỗ nào? Khi nào KHÔNG dùng?                 |

### Key Points / Điểm Chính (self-check)

| #   | Key Point                                                                                                                                                                                                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | React 17: render = surgeon can't stop mid-operation (blocking). React 18: concurrent = pause urgent, resume non-urgent. / React 17 = bác sĩ không thể dừng. React 18 = pause/resume.                                |
| 2   | 3 bottlenecks: data→HTML (once), HTML→hydrate (once), hydrate→interactive (once). Streaming: incremental HTML, selective hydrate, interruptible hydration. / 3 bottleneck all-or-nothing → 3 giải pháp incremental. |
| 3   | Phase 1: createRoot + StrictMode. Phase 2: useTransition + Suspense. Phase 3: Compiler from 1 folder. Phase 4: React 19 APIs.                                                                                       |
| 4   | Error: "Cannot import server component into client component." Fix: pass SC as children prop into CC — composition pattern. / Fix: truyền SC như children vào CC.                                                   |
| 5   | `useOptimistic` = shows immediately + AUTO reverts on fail. `setState` = shows immediately + MUST SELF revert. Don't use for payment/booking. / Không dùng cho payment/booking.                                     |

> 🎯 **Feynman Prompt:** 🇬🇧 "Explain React 18 streaming SSR to a developer who doesn't know React — use the buffet restaurant example: React 17 sets up all 50 dishes before opening, React 18 opens each station when ready."
> 🎯 **Feynman Prompt:** 🇻🇳 "Giải thích React 18 streaming SSR cho developer chưa biết React — dùng ví dụ nhà hàng buffet: React 17 bày xong 50 món mới mở cửa, React 18 bày từng quầy khi sẵn sàng."
> 🔁 **Spaced Repetition reminder:** Review this file after **3 days**, **7 days**, and **14 days**. / Ôn lại sau **3 ngày**, **7 ngày**, và **14 ngày**.

[← Previous](./09-performance-optimization.md) | [Back to Table of Contents](../../00-table-of-contents.md)

---

## 🔗 Connections / Liên Kết

### Same track / Cùng track

- [React 19 Features](./02-react-19-features.md) — Actions, Compiler, breaking changes in detail / chi tiết
- [Performance Optimization](./09-performance-optimization.md) — concurrent rendering performance patterns
- [Hooks Comprehensive](./07-hooks-comprehensive.md) — concurrency hooks useTransition/useDeferredValue
- [Advanced Patterns](./04-advanced-patterns.md) — Suspense pairs with compound component boundaries

### Cross-track / Khác track

- [App Router & Server Components](../04-nextjs/01-app-router-server-components.md) — Next.js implementation of RSC
- [Data Fetching](../04-nextjs/02-data-fetching.md) — streaming SSR and Suspense in Next.js App Router
- [Architecture Styles](../../shared/05-software-engineering/02-architecture-styles.md) — RSC shifts server/client rendering architecture
