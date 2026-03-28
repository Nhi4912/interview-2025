# Modern React Features (18–19) / Tính Năng React Hiện Đại

> **Track**: FE — React | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [React Fundamentals](./01-react-fundamentals.md) | [Hooks Deep Dive](./03-hooks-deep-dive.md)
> **See also**: [React 19 Deep Dive](./02-react-19-features.md) | [Next.js App Router](../04-nextjs/01-app-router-server-components.md)
> **L5 Competencies**: Concurrent Architecture • Server/Client Boundary Design • Migration Strategy • Streaming SSR

[← Previous](./09-performance-optimization.md) | [Back to Table of Contents](../../00-table-of-contents.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Tiếng Việt:** Team bạn đang migrate dashboard từ React 17 lên React 18. PM hỏi: "User có thấy khác biệt gì không?". Backend team hỏi: "Dùng Server Components thì còn cần REST API không?". Tech lead hỏi: "Bật React Compiler có xóa hết `useMemo` được không?"

**English:** Your team is migrating a dashboard from React 17 to React 18. PM asks: "Will users notice the improvement?" Backend asks: "Do we still need REST APIs with Server Components?" Tech lead asks: "Can we remove all useMemo calls after enabling React Compiler?"

**Tại sao quan trọng:** Cả ba câu hỏi đều cần hiểu **model shift** — không chỉ nhớ tên API. File này giải thích từ gốc rễ: React đã thay đổi **cách render**, **nơi render**, và **ai chịu trách nhiệm optimize**.

---

## What & Why / Cái Gì & Tại Sao

> **Ví dụ đời thường:** Tưởng tượng nhà hàng phục vụ khách.
>
> - **React 17** = nhà hàng nấu xong **TẤT CẢ** món rồi mới bưng ra → khách ngồi đợi 30 phút nhìn bàn trống
> - **React 18** = nhà hàng bưng **từng món** khi nấu xong → khách ăn khai vị trong khi chờ món chính
> - **Server Components** = bếp nấu sẵn món nguội (salad) và bưng thẳng ra, chỉ gửi công thức cho món khách cần tự nướng tại bàn
> - **React Compiler** = robot tự động đậy nắp nồi giữ nhiệt — trước đây đầu bếp phải tự nhớ đậy

**English:** React 17 = restaurant that waits until ALL dishes are ready before serving. React 18 = serves each dish as it's cooked. Server Components = kitchen pre-makes cold dishes and only sends recipes for dishes the customer needs to cook at the table. React Compiler = robot that automatically covers pots to keep warm — previously the chef had to remember.

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
  "Nấu xong hết          "Bưng từng món"        "Robot đậy nắp tự động"
   mới bưng ra"
```

---

## Overview / Tổng Quan

File này covers 3 bước tiến hóa lớn nhất của React:

1. **React 18 — Concurrent Rendering**: Render không còn "all-or-nothing". React có thể **pause**, ưu tiên việc gấp (user typing), rồi **resume** việc không gấp. Kèm auto batching và streaming SSR.

2. **Server Components**: Component chạy trên server, gửi HTML về client, **0 bytes JavaScript**. Client Component chỉ dùng cho phần cần tương tác.

3. **React 19 — Compiler & Actions**: Compiler tự thêm `useMemo`/`useCallback`. Actions quản lý async form state tự động. `use()` đọc Promise/Context linh hoạt hơn.

---

## Core Concept 1: React 18 — Concurrent Rendering & Auto Batching

> 🧠 **Memory Hook**: "Concurrent = bác sĩ phẫu thuật có thể **pause** ca mổ để xử lý ca cấp cứu, rồi **resume** — thay vì phải mổ xong 100% mới được nhận bệnh nhân mới"

### Why exists — Tại sao tồn tại?

**Level 1 — Vấn đề là gì?**
React 17 render đồng bộ: một khi bắt đầu render, chạy cho đến xong mới dừng. Render 300ms (filter 5000 items) → browser **đóng băng** 300ms → user gõ chữ nhưng không thấy gì.

**Level 2 — Tại sao không render nhanh hơn?**
Một số tính toán **tự thân đã chậm** — sort 5000 items luôn mất thời gian. Giải pháp không phải "render nhanh hơn" mà là "render **không chặn** UI" — React có thể pause giữa chừng.

### Layer 1: Ví Dụ Đời Thường / Analogy

Tưởng tượng bạn đang viết email dài (render list 5000 items):

- **React 17**: Phải viết xong email mới được trả lời tin nhắn → bạn bè nghĩ bạn "offline"
- **React 18**: Viết nửa email → thấy tin nhắn → reply nhanh → quay lại viết tiếp → bạn bè thấy bạn luôn "responsive"

**Key insight: React không viết email nhanh hơn — React biết cách xen kẽ việc gấp và không gấp.**

### Layer 2: Cách Hoạt Động / How It Works

```
React 17 (synchronous — đồng bộ):
render bắt đầu ─────────────────────────── render xong
                [không thể ngắt, UI đóng băng 300ms]
                [user gõ "h" "e" "l" "l" "o" → không thấy gì]

React 18 (concurrent — đồng thời):
render bắt đầu ──── [user gõ "h"] ──── resume ──── render xong
                     React pause,       React
                     xử lý "h" (1ms),   tiếp tục
                     hiển thị ngay      render cũ

Timeline:
0ms    ──── 50ms ──── 51ms ──── 300ms
render       pause     handle     resume + finish
started      check     keypress   low-priority
```

**Automatic Batching — gộp nhiều setState thành 1 render:**

```tsx
// React 17: setTimeout gây 2 lần render riêng biệt
setTimeout(() => {
  setCount((c) => c + 1); // render 1
  setFlag((f) => !f); // render 2
}, 0);

// React 18: gộp thành 1 render DÙ TRONG setTimeout
setTimeout(() => {
  setCount((c) => c + 1); // ─┐
  setFlag((f) => !f); // ─┘ → 1 render duy nhất
}, 0);

// Muốn render ngay (hiếm khi cần):
import { flushSync } from "react-dom";
flushSync(() => setCount((c) => c + 1)); // ép render ngay lập tức
```

**Kích hoạt concurrent mode:**

```tsx
// ❌ React 17 API — KHÔNG có concurrent features
ReactDOM.render(<App />, document.getElementById("root"));

// ✅ React 18 API — BẬT concurrent features
import { createRoot } from "react-dom/client";
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
```

### Layer 3: Edge Cases / Trường Hợp Đặc Biệt

- **Vẫn dùng `ReactDOM.render`**: Tất cả concurrent features bị tắt — auto batching ngoài event handler, useTransition, streaming SSR đều không hoạt động
- **Component không pure**: Concurrent mode có thể gọi render 2 lần (Strict Mode) — component có side effect trong render sẽ bị lỗi
- **`flushSync` trong event handler**: Dùng khi cần đo DOM ngay sau setState (ví dụ: scroll to bottom sau add message) — nhưng rất hiếm cần

**❌ Sai lầm thường gặp / Common Mistakes:**

| ❌ Sai                                 | Tại sao sai                                                           | ✅ Đúng                                                                       |
| -------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| "React 18 render nhanh hơn React 17"   | Cùng 1 công việc, cùng thời gian — React 18 chỉ **không chặn** UI     | React 18 cải thiện **responsiveness** (cảm giác nhanh), không phải throughput |
| Vẫn dùng `ReactDOM.render` sau upgrade | Legacy root tắt toàn bộ concurrent features                           | Phải đổi sang `createRoot`                                                    |
| Sợ auto batching phá code cũ           | Batch nhiều hơn = ít render hơn = an toàn hơn                         | Chỉ vấn đề nếu code phụ thuộc vào intermediate render (rất hiếm)              |
| Nghĩ concurrent mode luôn bật          | Chỉ bật khi dùng `createRoot` VÀ gọi API concurrent (`useTransition`) | Concurrent render chỉ xảy ra cho "non-urgent" updates                         |

**🎯 Interview Pattern:**

- Khi thấy: "React 18 có gì mới? Tại sao nên upgrade?"
- → Nhớ: concurrent rendering = interruptible = responsive UI; auto batching = ít render hơn; streaming SSR = TTFB nhanh hơn
- → Mở đầu: "Thay đổi cốt lõi của React 18 là concurrent rendering — thay vì block browser cho toàn bộ render, React có thể pause để xử lý input user trước. Điều này enable 3 thứ: useTransition cho non-urgent state, streaming SSR gửi HTML từng phần, và auto batching gộp setState ở mọi nơi."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [Hooks Comprehensive — useTransition/useDeferredValue](./07-hooks-comprehensive.md)
- ➡️ Để hiểu: [Performance Optimization — profiling concurrent renders](./09-performance-optimization.md)

---

## Core Concept 2: Server Components — Architecture & Boundaries

> 🧠 **Memory Hook**: "Server Component = **0 bytes JS** gửi tới browser. Nó render trên server và gửi **HTML**, không gửi JavaScript. `'use client'` là ranh giới nơi JavaScript bắt đầu."

### Why exists — Tại sao tồn tại?

**Level 1 — Vấn đề là gì?**
React truyền thống: MỌI component đều chạy trên browser → mọi library, mọi logic, mọi query đều phải ship dưới dạng JavaScript tới client. Trang product page có thể ship 200KB JS chỉ để fetch và hiển thị data không bao giờ thay đổi.

**Level 2 — SSR truyền thống không đủ sao?**
SSR cũ (getServerSideProps) render HTML trên server NHƯNG vẫn ship component JS để hydrate. Server Components **không hydrate** — không nằm trong client bundle. Tiết kiệm hoàn toàn JS.

### Layer 1: Ví Dụ Đời Thường / Analogy

Tưởng tượng bạn đặt đồ ăn delivery:

- **Client Component** = bạn nhận **nguyên liệu + công thức** → tự nấu tại nhà (browser tải JS + render)
- **Server Component** = bạn nhận **món ăn nấu sẵn** → chỉ bày ra bàn ăn (server gửi HTML, browser chỉ hiển thị)
- **`'use client'`** = nhãn dán "cần tự nấu" trên hộp → cho biết phần nào cần JavaScript

Món salad (hiển thị text) → gửi sẵn (Server Component).
Món lẩu (cần bật bếp, tương tác) → gửi nguyên liệu (Client Component).

### Layer 2: Cách Hoạt Động / How It Works

```
SERVER COMPONENT                    CLIENT COMPONENT
────────────────                    ────────────────
Chạy: chỉ trên server              Chạy: trên client (+ server cho hydrate)
JS gửi về: 0 bytes                  JS gửi về: toàn bộ component
Được: async/await, DB query          Được: useState, useEffect, hooks
Được: truy cập filesystem            Được: event handlers, browser APIs
KHÔNG được: hooks                    KHÔNG được: async component function
KHÔNG được: browser APIs             Đánh dấu: 'use client' ở đầu file
Mặc định trong Next.js App Router
```

**Boundary rules — Luật ranh giới:**

```tsx
// ✅ Server import Client — ĐƯỢC
// Server render HTML của mình + gửi ClientButton dưới dạng JS bundle
async function ProductPage({ id }: { id: string }) {
  const product = await db.products.findById(id); // query DB trực tiếp!

  return (
    <div>
      <h1>{product.name}</h1> {/* HTML thuần, 0 JS */}
      <p>${product.price}</p>
      <AddToCartButton productId={id} /> {/* Client Component */}
    </div>
  );
}

// 'use client' đánh dấu ranh giới
("use client");
function AddToCartButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false); // hooks OK ở đây
  return (
    <button
      onClick={() => {
        addToCart(productId);
        setAdded(true);
      }}
    >
      {added ? "Đã thêm!" : "Thêm vào giỏ"}
    </button>
  );
}

// ❌ Client import Server — KHÔNG ĐƯỢC
("use client");
import ServerComponent from "./ServerComponent"; // ❌ lỗi!

// ✅ Dùng children pattern thay thế
("use client");
function ClientWrapper({ children }) {
  const [open, setOpen] = useState(false);
  return <div>{open && children}</div>;
}
// Parent (server): <ClientWrapper><ServerComponent /></ClientWrapper>
```

**Server Actions — mutation không cần API route:**

```tsx
// 'use server' — function chạy trên server, gọi từ client
"use server";
async function updateProfile(formData: FormData) {
  const name = formData.get("name");
  await db.users.update({ name });
  revalidatePath("/profile");
}

// Client component dùng server action trực tiếp
<form action={updateProfile}>
  <input name="name" />
  <button type="submit">Lưu</button>
</form>;
```

### Layer 3: Edge Cases / Trường Hợp Đặc Biệt

- **Serialization constraint**: Props từ Server → Client phải serializable (JSON-safe). Không thể pass function, class instance, Date, undefined. Server Actions (đánh dấu `'use server'`) là ngoại lệ — serialize dưới dạng reference.
- **`'use client'` nhiễm imports**: Đánh dấu file `'use client'` → TẤT CẢ modules import trong file đó cũng thành client module. Đặt `'use client'` quá cao → cả cây component thành client JS.
- **`useContext` trong Server Component**: KHÔNG được. Context là cơ chế client-side (memory browser). Phải pass data qua props hoặc dùng Client Provider bọc ngoài.

**❌ Sai lầm thường gặp / Common Mistakes:**

| ❌ Sai                                    | Tại sao sai                                            | ✅ Đúng                                                                |
| ----------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------- |
| Đặt `'use client'` ở đầu mọi file         | Biến tất cả thành client JS → vô nghĩa dùng SC         | Chỉ đánh dấu component CẦN interactivity (state, events, browser APIs) |
| Pass function làm prop từ Server → Client | Function không serializable qua server/client boundary | Dùng Server Actions (`'use server'`) hoặc primitive callbacks          |
| "SC thay thế Client Component"            | SC xử lý render read-only; CC xử lý tương tác          | SC cho data-fetching shell, CC cho interactive leaves                  |
| Dùng `useContext` trong Server Component  | Context chỉ tồn tại ở client (browser memory)          | Pass data qua props hoặc dùng Client Provider wrapper                  |

**🎯 Interview Pattern:**

- Khi thấy: "Server Components thay thế REST API không?"
- → Nhớ: SC thay API cho **read** (query DB trực tiếp, 0 JS). Vẫn cần CC cho interactivity. Server Actions cho mutations.
- → Mở đầu: "Server Components thay thế REST API cho read operations — chạy trên server với DB access trực tiếp, ship 0 JS. Nhưng vẫn cần Client Components cho interactive UI và Server Actions cho mutations."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [Next.js App Router — RSC + Server Actions](../04-nextjs/01-app-router-server-components.md)
- ➡️ Để hiểu: [Next.js Data Fetching — streaming and cache](../04-nextjs/02-data-fetching.md)

---

## Core Concept 3: React 19 — Compiler, Actions & New Primitives

> 🧠 **Memory Hook**: "Compiler = linter tự thêm memoization. Actions = async form handler tự quản lý loading/error. `use()` = useContext mà được gọi trong if/for."

### Why exists — Tại sao tồn tại?

**Level 1 — Vấn đề là gì?**
React 18 vẫn bắt developer tự viết `useMemo`/`useCallback` ở mọi nơi cần performance, và tự quản lý `isPending`/`isError` cho mọi async operation.

**Level 2 — Manual memoization tệ ở chỗ nào?**
Developer quên thêm → app chậm. Thêm sai deps → bug. Thêm không cần → waste overhead. **3 kiểu lỗi từ 1 công việc** → nên để máy làm.

**Level 2b — Manual async state tệ ở chỗ nào?**
Mỗi form submit cần 4 state giống nhau: isPending, isError, error, data → copy-paste 100 lần trong project. React 19 Actions gộp thành 1 hook.

### Layer 1: Ví Dụ Đời Thường / Analogy

- **React Compiler** = Grammarly cho code. Bạn viết văn (component), Grammarly tự sửa lỗi chính tả (thêm useMemo/useCallback). Bạn tập trung viết nội dung đúng, Grammarly lo phần optimize.
- **Actions** = máy ATM tự động. Trước đây bạn phải tự đếm tiền, kiểm tra số dư, xử lý lỗi. ATM làm hết — bạn chỉ nhập số tiền và nhấn OK.
- **`use()`** = tra từ điển. `useContext` = phải tra ở đầu sách (Rules of Hooks). `use()` = tra bất kỳ trang nào, kể cả giữa chương.

### Layer 2: Cách Hoạt Động / How It Works

**React Compiler — auto-memoization tại build time:**

```
Developer viết:                      Compiler output:
                                     (tự động thêm memoization)

function ProductList({ products }) { function ProductList({ products }) {
  const sorted = products              const sorted = useMemo(
    .sort((a, b) =>                      () => products.sort((a, b) =>
      a.price - b.price);                  a.price - b.price),
                                         [products]
  return <List items={sorted} />;        );
}                                      return <List items={sorted} />;
                                     }

Quy trình:
┌──────────┐    ┌──────────┐    ┌──────────┐
│ Your Code │ →  │ Compiler │ →  │ Optimized│
│ (pure)    │    │ analyzes │    │ Code     │
│           │    │ AST      │    │ (+ memo) │
└──────────┘    └──────────┘    └──────────┘
```

**Yêu cầu compiler hoạt động:**

- Component phải **pure** (same input → same output)
- Không side effects trong render
- Tuân thủ Rules of Hooks
- Component vi phạm → compiler **skip** (không lỗi, chỉ không optimize)

**Actions — `useActionState` quản lý async form:**

```tsx
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
  <button disabled={isPending}>{isPending ? "Đang lưu…" : "Lưu"}</button>
  {!state.success && state.error && <p className="error">{state.error}</p>}
</form>;
```

**`useOptimistic` — feedback tức thì:**

```tsx
const [optimisticMessages, addOptimistic] = useOptimistic(messages, (current, newMsg) => [
  ...current,
  { ...newMsg, pending: true },
]);

async function handleSend(text: string) {
  addOptimistic({ text, id: crypto.randomUUID() }); // hiển thị NGAY
  await sendMessage(text); // nếu lỗi → React TỰ ĐỘNG rollback
}
```

**`use()` — đọc Promise/Context linh hoạt:**

```tsx
// use() KHÔNG phải hook → ĐƯỢC gọi trong if/for (khác useContext)
function ProductDetails({ pricePromise }: { pricePromise: Promise<Price> }) {
  if (showPrice) {
    const price = use(pricePromise); // ✅ trong if — OK!
    return <span>${price.amount}</span>;
  }
  const theme = use(ThemeContext); // ✅ thay useContext
  return <span style={{ color: theme.primary }}>Hidden</span>;
}
```

**ref as prop (React 19):**

```tsx
// ❌ React 18: cần forwardRef wrapper
const Input = forwardRef((props, ref) => <input ref={ref} {...props} />);

// ✅ React 19: ref là prop bình thường
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

### Layer 3: Edge Cases / Trường Hợp Đặc Biệt

- **Compiler skip**: Component có mutation trong render (`array.push()` trong render body) → compiler không optimize → không lỗi nhưng không nhanh hơn
- **`useOptimistic` + financial transactions**: KHÔNG nên dùng cho payment/transfer. User thấy "thành công" nhưng server reject → confusing. Chỉ dùng cho like, chat, cart.
- **`use(promise)` cần Suspense**: `use()` suspend component → PHẢI có `<Suspense>` boundary phía trên, nếu không app crash
- **`use(promise)` cần stable reference**: Nếu mỗi render tạo promise mới → infinite suspend loop. Promise phải được tạo NGOÀI component hoặc cached.

**❌ Sai lầm thường gặp / Common Mistakes:**

| ❌ Sai                                            | Tại sao sai                                                                         | ✅ Đúng                                                    |
| ------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| "Compiler → không cần lo performance nữa"         | Compiler chỉ thêm memo — không fix kiến trúc xấu (state colocation, virtualization) | Compiler bỏ manual memo; vẫn cần profiling + kiến trúc tốt |
| Dùng `useOptimistic` cho payment                  | User thấy "thành công" nhưng server reject → mất tin tưởng                          | Chỉ dùng cho non-critical: like, chat, cart add            |
| `use(promise)` không có Suspense boundary         | `use()` suspend component → crash nếu không có fallback                             | Luôn bọc trong `<Suspense fallback={...}>`                 |
| Tạo promise MỚI trong render rồi pass cho `use()` | Mỗi render tạo promise mới → infinite suspend loop                                  | Cache promise hoặc tạo ngoài component                     |

**🎯 Interview Pattern:**

- Khi thấy: "React 19 thay đổi cách xử lý form?"
- → Nhớ: `useActionState` quản lý isPending/state/error. Form dùng `action` thay vì `onSubmit`.
- → Mở đầu: "React 19 giới thiệu `useActionState` — bọc async function và tự track pending state + result. Thay thế pattern thủ công `const [isPending, setIsPending] = useState(false)` và `try/catch` cho mọi form."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [React 19 Features — full deep dive](./02-react-19-features.md)
- ➡️ Để hiểu: [Next.js Data Fetching — Server Actions + useOptimistic](../04-nextjs/02-data-fetching.md)

---

## Core Concept 4: Streaming SSR — Gửi HTML Từng Phần

> 🧠 **Memory Hook**: "React 17 SSR = fax (gửi hết 1 lần). React 18 SSR = live stream (gửi từng phần khi sẵn sàng)."

### Why exists — Tại sao tồn tại?

**Level 1 — Vấn đề là gì?**
React 17 SSR có 3 bottleneck "all-or-nothing": (1) fetch TOÀN BỘ data → rồi mới gửi HTML. (2) Tải TOÀN BỘ JS → rồi mới hydrate. (3) Hydrate TOÀN BỘ page → rồi mới interactive.

**Level 2 — Tại sao từng bước đều block?**
`renderToString()` phải đợi mọi data resolve trước khi tạo HTML string. Hydration là quá trình đồng bộ — không thể hydrate nửa page. 1 query chậm 2s → toàn bộ page chậm 2s.

### Layer 1: Ví Dụ Đời Thường / Analogy

- **React 17 SSR** = nhà hàng buffet phải bày xong TOÀN BỘ 50 món rồi mới mở cửa → khách đợi 30 phút ngoài cửa
- **React 18 Streaming SSR** = nhà hàng bày từng quầy khi sẵn sàng → khách vào ăn salad trước, quầy sushi mở sau 5 phút, quầy nướng mở sau 10 phút

### Layer 2: Cách Hoạt Động / How It Works

```
React 17 SSR:
┌─────────────────────────────────────────────────────┐
│ 1. Server: renderToString() → đợi TẤT CẢ data      │
│    [────── 800ms chờ DB ──────]                      │
│ 2. Gửi TOÀN BỘ HTML một lần                         │
│ 3. Browser: tải toàn bộ JS → hydrate toàn bộ page   │
│    [User thấy trang trắng cho đến bước 3 xong]      │
└─────────────────────────────────────────────────────┘

React 18 Streaming SSR:
┌─────────────────────────────────────────────────────┐
│ 1. Server: renderToPipeableStream()                  │
│    → Gửi shell HTML ngay (layout, nav) [~50ms]       │
│    → User THẤY TRANG ngay lập tức                    │
│                                                      │
│ 2. <Suspense> boundaries stream khi data sẵn sàng    │
│    → Header stream: 50ms                             │
│    → Product list stream: 200ms                      │
│    → Reviews stream: 500ms                           │
│    → Mỗi phần hiển thị khi đến, không đợi nhau       │
│                                                      │
│ 3. Selective hydration: React hydrate từng phần       │
│    → User click vào phần nào → hydrate phần đó trước │
└─────────────────────────────────────────────────────┘
```

```tsx
// Streaming SSR với Suspense boundaries
function ProductPage() {
  return (
    <Layout>
      {" "}
      {/* Stream ngay */}
      <Header /> {/* Stream ngay */}
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails /> {/* Stream khi data sẵn sàng */}
      </Suspense>
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews /> {/* Stream khi reviews loaded */}
      </Suspense>
    </Layout>
  );
}
```

### Layer 3: Edge Cases / Trường Hợp Đặc Biệt

- **Selective hydration priority**: User click vào Reviews section → React hydrate Reviews TRƯỚC dù ProductDetails stream trước
- **`useId` cho SSR-safe IDs**: Concurrent rendering có thể render nhiều lần → dùng `useId()` thay `Math.random()` cho unique IDs
- **`useSyncExternalStore`**: External stores (Redux, Zustand) có thể bị "tearing" trong concurrent render → hook này đảm bảo consistent

**❌ Sai lầm thường gặp / Common Mistakes:**

| ❌ Sai                                    | Tại sao sai                                                           | ✅ Đúng                                                           |
| ----------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------- |
| "Streaming SSR làm trang load nhanh hơn"  | Tổng thời gian có thể bằng nhau — nhưng user **thấy** content sớm hơn | Cải thiện TTFB và perceived performance, chưa chắc tổng thời gian |
| Không wrap async component trong Suspense | Component suspend → app crash hoặc hiển thị lỗi                       | Mọi async boundary cần `<Suspense fallback={...}>`                |
| Dùng `Math.random()` cho key trong SSR    | Server và client tạo random khác nhau → hydration mismatch            | Dùng `useId()` cho SSR-safe unique IDs                            |

**🎯 Interview Pattern:**

- Khi thấy: "So sánh React 17 SSR và React 18 streaming SSR"
- → Nhớ: 3 bottleneck all-or-nothing → 3 giải pháp incremental
- → Mở đầu: "React 17 SSR bị block ở 3 điểm: data fetch xong mới gửi HTML, HTML xong mới hydrate, hydrate xong mới interactive. React 18 streaming giải quyết cả 3: gửi HTML incremental qua Suspense boundaries, hydrate selective theo priority, và hydration có thể bị interrupt bởi user interaction."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [React Fundamentals — Fiber architecture](./01-react-fundamentals.md)
- ➡️ Để hiểu: [Next.js — streaming SSR implementation](../04-nextjs/02-data-fetching.md)

---

## Core Concept 5: Migration Strategy — Từ React 17 Lên React 19

> 🧠 **Memory Hook**: "Migration = sửa nhà đang ở — thay từng phòng, không đập cả nhà xây lại."

### Why exists — Tại sao tồn tại?

**Level 1 — Vấn đề là gì?**
Nhiều team muốn dùng React 19 nhưng có codebase React 17 lớn. Upgrade "big bang" quá rủi ro — cần chiến lược từng bước.

**Level 2 — Tại sao không upgrade thẳng?**
React 18 có breaking changes (Strict Mode 2x render, auto batching). React 19 thêm Compiler yêu cầu component pure. Upgrade thẳng từ 17 → 19 có thể gây hàng trăm lỗi cùng lúc.

### Layer 1: Ví Dụ Đời Thường / Analogy

Sửa nhà đang ở:

- **Sai**: Đập cả nhà, xây lại → ở đâu trong 6 tháng?
- **Đúng**: Sửa từng phòng: phòng khách (tuần 1) → bếp (tuần 2) → phòng ngủ (tuần 3)

Migration React cũng vậy — upgrade từng lớp, verify từng bước.

### Layer 2: Cách Hoạt Động / How It Works

```
MIGRATION PATH:

React 17 → React 18 → React 19
───────    ────────    ────────

Bước 1: React 17 → 18 (Low risk)
├── Đổi ReactDOM.render → createRoot
├── Test: auto batching có break gì không
├── Enable Strict Mode → fix double-render issues
└── Verify: tất cả tests pass

Bước 2: Adopt React 18 APIs (Medium risk)
├── Thêm useTransition cho search/filter
├── Thêm Suspense boundaries cho data loading
├── Replace custom loading states → Suspense
└── Verify: performance improved

Bước 3: React 18 → 19 (Medium risk)
├── Thêm React Compiler (babel plugin)
├── Audit: ESLint plugin phát hiện component không pure
├── Fix impure components hoặc opt-out
├── Dần xóa manual useMemo/useCallback
└── Verify: bundle size giảm, performance same/better

Bước 4: Adopt React 19 APIs (Low risk)
├── Replace useState loading → useActionState
├── Replace forwardRef → ref as prop
├── Replace useContext → use(Context) nơi cần conditional
└── Verify: code simpler, same behavior
```

**Compiler adoption checklist:**

```tsx
// 1. Thêm babel plugin
// babel.config.js
module.exports = {
  plugins: [
    [
      "babel-plugin-react-compiler",
      {
        // Bắt đầu với 1 folder
        sources: (filename) => filename.includes("src/components/new/"),
      },
    ],
  ],
};

// 2. ESLint plugin audit
// Phát hiện component không pure:
// ❌ Mutation trong render
function Bad({ items }) {
  items.push(newItem); // ESLint warning: mutates props
  return <List items={items} />;
}

// ✅ Pure component
function Good({ items }) {
  const withNew = [...items, newItem]; // tạo array mới
  return <List items={withNew} />;
}

// 3. Dần mở rộng scope
// sources: (filename) => filename.includes('src/'),  // toàn bộ src
```

### Layer 3: Edge Cases / Trường Hợp Đặc Biệt

- **React.StrictMode double render**: React 18 Strict Mode gọi render 2 lần (dev only) → phát hiện side effects trong render. Component có `console.log` trong render sẽ log 2 lần — KHÔNG phải bug.
- **Third-party libraries**: Một số libraries chưa tương thích React 18 concurrent mode → check release notes trước khi upgrade
- **Compiler opt-out per component**: Thêm `'use no memo'` directive ở đầu component để compiler skip

**❌ Sai lầm thường gặp / Common Mistakes:**

| ❌ Sai                                               | Tại sao sai                                                | ✅ Đúng                                     |
| ---------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------- |
| Upgrade React 17 → 19 một lần                        | Quá nhiều breaking changes cùng lúc → khó debug            | Upgrade 17 → 18 → verify → 19 → verify      |
| Bật Compiler cho toàn bộ codebase ngay               | Component không pure sẽ bị skip → false sense of "working" | Bắt đầu 1 folder, audit ESLint, mở rộng dần |
| Xóa tất cả useMemo/useCallback ngay khi bật Compiler | Compiler có thể skip một số component → xóa memo = slower  | Dùng Profiler verify trước khi xóa          |

**🎯 Interview Pattern:**

- Khi thấy: "Chiến lược migrate từ React 17 lên React 19?"
- → Nhớ: incremental — 17→18→verify→19→verify. Compiler bắt đầu 1 folder.
- → Mở đầu: "Migration nên incremental: React 17→18 trước (đổi createRoot, fix Strict Mode issues), verify tất cả tests. Sau đó 18→19 (thêm Compiler từ 1 folder, audit ESLint cho purity, mở rộng dần). Không nên 'big bang' upgrade vì breaking changes từ auto batching và Compiler requirements chồng chéo."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [React Fundamentals — pure components](./01-react-fundamentals.md)
- ➡️ Để hiểu: [React 19 Features — Compiler details](./02-react-19-features.md)

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q1: React 18 auto batching khác React 17 batching ở điểm nào? 🟢 Junior

**A:**

React 17 chỉ batch setState **trong React event handlers** (onClick, onChange). setState trong setTimeout, Promise, native event listener → mỗi setState gây 1 render riêng.

React 18 batch setState **ở mọi nơi** — event handlers, setTimeout, Promise `.then()`, native event listeners. Tất cả setState trong cùng 1 microtask được gộp thành 1 render.

```tsx
// setTimeout chứa 3 setState:
// React 17: 3 renders | React 18: 1 render
setTimeout(() => {
  setA(1); // React 17: render | React 18: ─┐
  setB(2); // React 17: render |             │ 1 render
  setC(3); // React 17: render | React 18: ─┘
}, 0);

// Opt-out (hiếm): flushSync(() => setState(...))
```

Tiếng Việt: React 17 chỉ gộp trong event handler. React 18 gộp mọi nơi — setTimeout, Promise, native events. Ít render hơn = nhanh hơn mặc định.

**💡 Interview Signal:**

- ✅ Strong: Chỉ ra chính xác React 17 batch WHERE (chỉ event handlers) vs React 18 batch EVERYWHERE
- ❌ Weak: "React 18 batches setState" (React 17 cũng batch — câu hỏi là batch Ở ĐÂU)

---

### Q2: `createRoot` khác `ReactDOM.render` ở điểm nào? Tại sao phải đổi? 🟢 Junior

**A:**

`ReactDOM.render` là legacy API — chạy ở synchronous mode. Dùng API này thì React 18 hoạt động y như React 17: không có auto batching ngoài event handler, không có useTransition, không có streaming SSR.

`createRoot` bật concurrent mode — tất cả features mới của React 18/19 đều yêu cầu `createRoot`.

```tsx
// ❌ Legacy — tắt concurrent features
ReactDOM.render(<App />, document.getElementById("root"));

// ✅ Modern — bật concurrent features
import { createRoot } from "react-dom/client";
createRoot(document.getElementById("root")!).render(<App />);
```

Tiếng Việt: `ReactDOM.render` = chế độ cũ, đồng bộ. `createRoot` = chế độ mới, bật concurrent rendering. Không đổi = React 18 chạy như React 17.

**💡 Interview Signal:**

- ✅ Strong: Giải thích `createRoot` là entry point để bật concurrent mode, liệt kê features bị tắt nếu dùng legacy
- ❌ Weak: "createRoot is the new way to render" (đúng nhưng không giải thích WHY)

---

### Q3: Concurrent rendering giải quyết vấn đề gì? Cách hoạt động? 🟡 Mid

**A:**

**Vấn đề:** React 17 render đồng bộ và không thể ngắt. Render 300ms (filter list lớn) → browser đóng băng → user gõ nhưng không thấy response.

**Giải pháp:** React 18 dùng fiber-based scheduler có thể:

1. **Pause** render không gấp giữa chừng (sau mỗi fiber unit of work)
2. **Check** có high-priority update không (user gõ phím)
3. **Handle** high-priority trước (render keystroke 1ms)
4. **Resume** hoặc restart low-priority render

React không render NHANH hơn — cùng công việc, cùng thời gian. React render **THÔNG MINH hơn** — xen kẽ việc gấp và không gấp.

APIs: `useTransition` (đánh dấu state update không gấp), `useDeferredValue` (trì hoãn giá trị derived), `startTransition` (version không hook).

Tiếng Việt: React 17 = render 1 lần chạy tới cuối, UI đóng băng. React 18 = render có thể pause/resume, ưu tiên user input. Dùng `useTransition` đánh dấu update không gấp.

**💡 Interview Signal:**

- ✅ Strong: Giải thích cụ thể vấn đề synchronous blocking, mô tả cơ chế pause/resume, nhắc `createRoot` requirement
- ❌ Weak: "React 18 renders faster" (sai — render non-blocking, không faster)

---

### Q4: Khi nào dùng `useTransition` vs `useDeferredValue`? 🟡 Mid

**A:**

**`useTransition`** — khi bạn **kiểm soát setState**:

```tsx
const [isPending, startTransition] = useTransition();
// Bạn GỌI setState → bạn wrap nó
startTransition(() => {
  setSearchResults(filterHugeList(query)); // non-urgent
});
```

**`useDeferredValue`** — khi bạn **KHÔNG kiểm soát setState** (nhận value từ props/parent):

```tsx
// Parent truyền query xuống — bạn không kiểm soát khi nào setState
function Results({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query); // trì hoãn value
  const results = filterHugeList(deferredQuery);
  return <List items={results} />;
}
```

**Quy tắc đơn giản:**

- Bạn gọi `setState` → `useTransition`
- Bạn nhận value từ nơi khác → `useDeferredValue`
- Cả hai đều đánh dấu work là "non-urgent" → React ưu tiên user input

Tiếng Việt: `useTransition` = bạn kiểm soát setState, wrap nó. `useDeferredValue` = bạn nhận value từ nơi khác, trì hoãn nó. Cả hai = "việc này không gấp, xử lý user input trước".

**💡 Interview Signal:**

- ✅ Strong: Phân biệt rõ "controls setState" vs "receives value" — đây là tiêu chí chọn
- ❌ Weak: Mô tả 2 hooks riêng biệt mà không so sánh khi nào dùng cái nào

---

### Q5: Rules mixing Server Components và Client Components? 🟡 Mid

**A:**

3 rules cốt lõi:

1. **Server → Client (qua props)**: Server Component import và render Client Component, pass **serializable props** (string, number, plain object, array). KHÔNG pass function, class instance, Date.

2. **Client → Server import KHÔNG ĐƯỢC**: Client Component không thể `import` Server Component vì sẽ ship server code tới client. **Giải pháp**: dùng children/slot pattern — parent Server Component render server child và pass như `children` vào Client wrapper.

3. **`'use client'` là BOUNDARY, không phải file property**: Đánh dấu `'use client'` → file đó VÀ TẤT CẢ imports đều thành client module. Đặt quá cao → cả cây thành client JS.

Server Actions (`'use server'`) là ngoại lệ duy nhất — serialize dưới dạng reference, pass được từ server → client.

Tiếng Việt: Server import Client = OK (props serializable). Client import Server = KHÔNG (dùng children). `'use client'` nhiễm imports. Server Actions là ngoại lệ.

**💡 Interview Signal:**

- ✅ Strong: Giải thích serialization constraint, children workaround, `'use client'` infects imports
- ❌ Weak: "Server chạy server, Client chạy client" (không giải thích composition rules)

---

### Q6: React Compiler thay đổi cách viết component như thế nào? Vẫn cần optimize gì thủ công? 🔴 Senior

**A:**

React Compiler là **build-time static analyzer** — đọc AST (abstract syntax tree) của component, tìm computations phụ thuộc chỉ vào props/state (pure), và tự thêm `useMemo`/`useCallback`.

**Thay đổi workflow:**

- KHÔNG cần viết `useMemo(fn, [deps])` và `useCallback(fn, [deps])` thủ công
- Compiler tự xử lý → developer tập trung viết logic đúng

**VẪN CẦN optimize thủ công:**

1. **State colocation** — đặt state gần component dùng nó (Compiler không di chuyển state)
2. **Virtualization** — render 10 items thay 10000 (Compiler không thêm virtualization)
3. **Code splitting** — lazy load routes/components (Compiler không split code)
4. **`React.memo`** — Compiler handle values/functions nhưng chưa handle component skip logic (có thể thay đổi)
5. **Profiling** — vẫn cần đo performance thực tế

**Yêu cầu:** Component phải pure (tuân Rules of React). Compiler skip component vi phạm — không lỗi, chỉ không optimize.

Tiếng Việt: Compiler tự thêm useMemo/useCallback tại build time. Developer bỏ viết thủ công. Nhưng vẫn cần kiến trúc tốt (colocation, virtualization, code splitting) — Compiler chỉ lo memoization, không fix kiến trúc.

**💡 Interview Signal:**

- ✅ Strong: Giải thích build-time (không phải runtime), phân biệt từ React.memo, liệt kê gì VẪN CẦN
- ❌ Weak: "Compiler auto-memoizes everything" (chỉ handle pure components, chỉ handle values/functions)

**🔗 Follow-up Chain:**

1. "Compiler skip component — làm sao biết component nào bị skip?" → ESLint plugin `eslint-plugin-react-compiler` báo warning cho component vi phạm Rules of React. Trong production, dùng React DevTools Profiler xem component nào không có memo.
2. "Compiler có thể gây regression không?" → Có nếu component phụ thuộc vào side effect trong render (ví dụ: `console.log` count). Compiler memo = skip render = side effect không chạy. Fix: di chuyển side effect vào useEffect.
3. "Khi nào KHÔNG nên bật Compiler?" → Codebase có nhiều impure patterns (mutation trong render, class components). Nên audit ESLint trước, fix violations, rồi mới bật.

---

### Q7: `useOptimistic` khác `setState` ngay lập tức ở chỗ nào? Khi nào dùng, khi nào KHÔNG? 🔴 Senior

**A:**

`useOptimistic` cho **temporary optimistic state tự động revert** khi async action fail. 3 khác biệt với `setState`:

1. **Automatic revert on error**: Action throw → React tự discard optimistic value, show real state. Không cần code rollback thủ công.

2. **Concurrent-safe**: `useOptimistic` hiểu concurrent model. Set optimistic state không block/race với real state update từ server.

3. **Scoped to action**: Action complete thành công → optimistic value thay bằng real server response. Với `setState` phải sync thủ công.

```tsx
// useOptimistic: user thấy ngay, server lỗi → TỰ ĐỘNG quay lại
const [optimisticLikes, addLike] = useOptimistic(likes, (current, newLike) => [
  ...current,
  newLike,
]);
async function handleLike() {
  addLike({ id: "temp", userId: me.id }); // hiển thị NGAY
  await serverLike(postId); // lỗi → React rollback
}

// setState: user thấy ngay, server lỗi → PHẢI TỰ rollback
async function handleLike() {
  const prev = likes;
  setLikes([...likes, { id: "temp", userId: me.id }]); // hiển thị ngay
  try {
    await serverLike(postId);
  } catch {
    setLikes(prev); // phải tự rollback!
  }
}
```

**Dùng cho:** like, chat send, cart add, todo toggle — feedback tức thì, server confirm async.

**KHÔNG dùng cho:** payment, bank transfer, booking — user KHÔNG nên thấy "thành công" trước khi server confirm.

Tiếng Việt: `useOptimistic` tự rollback khi action fail — không cần code rollback. Dùng cho chat/like/cart. KHÔNG dùng cho payment/booking cần server confirm trước.

**💡 Interview Signal:**

- ✅ Strong: Giải thích automatic rollback, phân biệt từ manual setState, nêu khi KHÔNG dùng
- ❌ Weak: "hiển thị value mới trong khi request đang chạy" (đúng nhưng thiếu rollback và concurrent-safe)

**🔗 Follow-up Chain:**

1. "Nếu server thành công nhưng trả data khác optimistic value?" → React thay optimistic value bằng real server data. UI cập nhật smooth vì optimistic → real là transition tự nhiên.
2. "Dùng `useOptimistic` trong offline-first app?" → Phải kết hợp với queue system. `useOptimistic` không retry — chỉ rollback on error. Cần thêm retry logic (TanStack Query, SWR) cho offline scenarios.
3. "Multiple optimistic updates cùng lúc (user like 3 posts liên tiếp)?" → Mỗi `addOptimistic` call stack lên state hiện tại. Nếu post 2 fail, React rollback post 2 nhưng giữ post 1 và 3 (nếu thành công). Reducer function trong `useOptimistic` xử lý merge logic.

---

### Q8: Design migration strategy: React 17 → React 19 cho codebase 200+ components. 🔴 Senior

**A:**

**Phase 1 — React 17 → 18 (1-2 tuần):**

- Đổi `ReactDOM.render` → `createRoot` (1 dòng code)
- Bật StrictMode → chạy test suite → fix double-render issues (side effects trong render)
- Test auto batching: kiểm tra code nào phụ thuộc intermediate renders (rất hiếm)
- ✅ Checkpoint: tất cả tests pass, app hoạt động bình thường

**Phase 2 — Adopt React 18 APIs (2-4 tuần):**

- Identify slow interactions (search, filter, tab switch) → wrap với `useTransition`
- Replace custom loading states → `Suspense` boundaries
- Nếu dùng SSR → migrate sang `renderToPipeableStream` cho streaming
- ✅ Checkpoint: Lighthouse scores improved, no regressions

**Phase 3 — React 18 → 19 + Compiler (2-4 tuần):**

- Thêm `eslint-plugin-react-compiler` → audit toàn bộ codebase → fix impure components
- Bật Compiler cho 1 folder (`src/components/new/`) → verify performance
- Dần mở rộng scope → verify từng bước
- ✅ Checkpoint: Compiler covers 80%+ components, no regressions

**Phase 4 — Adopt React 19 APIs (1-2 tuần):**

- Replace `forwardRef` → ref as prop
- Replace manual form state → `useActionState`
- Replace `useContext` → `use(Context)` nơi cần conditional
- Dần xóa manual `useMemo`/`useCallback` (verify từng cái với Profiler)
- ✅ Checkpoint: code simpler, bundle smaller

**Risk mitigation:**

- Feature flags cho mỗi phase
- Canary deploy: 5% traffic → 20% → 50% → 100%
- Rollback plan: mỗi phase là 1 git branch, revert được

Tiếng Việt: 4 phases: (1) đổi createRoot + Strict Mode, (2) adopt useTransition + Suspense, (3) Compiler từ 1 folder mở rộng dần, (4) adopt React 19 APIs. Mỗi phase có checkpoint verify. Feature flags + canary deploy cho an toàn.

**💡 Interview Signal:**

- ✅ Strong: Migration incremental với checkpoint, Compiler adoption dần dần, risk mitigation strategy
- ❌ Weak: "Upgrade React version in package.json and fix errors" (no strategy, no risk management)

**🔗 Follow-up Chain:**

1. "200 components mà 50 là class components — xử lý sao?" → Class components vẫn hoạt động trong React 19 nhưng Compiler skip chúng. Priority: convert class components cần performance → function components trước. Dùng codemod `react-codemod/class-to-function` cho straightforward cases.
2. "Measure migration success thế nào?" → 4 metrics: (a) Bundle size before/after, (b) Lighthouse Performance score, (c) Core Web Vitals (INP, LCP, CLS), (d) Compiler coverage % (bao nhiêu components được optimize).
3. "Team 5 người, sprint 2 tuần — plan task distribution?" → Phase 1-2: 1 person, 1 sprint (low risk). Phase 3: 2 people parallel (1 audit + fix, 1 test). Phase 4: all 5 (mỗi người own 40 components). Total: ~3-4 sprints.

---

## 📋 Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Câu hỏi                             | Difficulty | Core Concept | Key Signal                                     |
| --- | ----------------------------------- | ---------- | ------------ | ---------------------------------------------- |
| Q1  | Auto batching React 17 vs 18        | 🟢 Junior  | Batching     | WHERE batch — event handler only vs everywhere |
| Q2  | createRoot vs ReactDOM.render       | 🟢 Junior  | Migration    | createRoot bật concurrent mode                 |
| Q3  | Concurrent rendering giải quyết gì? | 🟡 Mid     | Concurrent   | Interruptible rendering + scheduler priority   |
| Q4  | useTransition vs useDeferredValue   | 🟡 Mid     | Concurrent   | Controls setState vs receives value            |
| Q5  | Rules mixing SC và CC               | 🟡 Mid     | RSC          | Import rule + serializable + boundary          |
| Q6  | Compiler thay đổi gì? Vẫn cần gì?   | 🔴 Senior  | React 19     | Build-time analyzer, vẫn cần kiến trúc         |
| Q7  | useOptimistic vs setState           | 🔴 Senior  | React 19     | Auto rollback + khi KHÔNG dùng                 |
| Q8  | Migration strategy 17→19            | 🔴 Senior  | Migration    | Incremental phases + checkpoints               |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer hỏi bất ngờ: **"Team migrate từ React 17 lên React 18. CTO hỏi: top 3 thay đổi user sẽ thấy, và developer cần thay gì?"**

**30 giây đầu — mở đầu lý tưởng:**

1. "Cho user, 3 cải thiện rõ nhất: (1) UI responsive hơn nhờ concurrent rendering — gõ phím và click phản hồi ngay kể cả khi đang render nặng; (2) trang load nhanh hơn (perceived) nếu dùng SSR nhờ streaming HTML từng phần; (3) ít re-render thừa nhờ auto batching."
2. "Cho developer, thay đổi chính là đổi `ReactDOM.render` sang `createRoot` — 1 dòng code bật toàn bộ features."
3. "Tùy chọn: dùng `useTransition` để đánh dấu update không gấp, và `Suspense` boundaries cho data loading."
4. "Auto batching và streaming SSR là opt-in tự động hoặc framework-level — Next.js App Router handle streaming sẵn."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                    |
| --- | -------------- | ---------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Giải thích concurrent rendering bằng ví dụ "bác sĩ phẫu thuật" — tại sao React 17 block và React 18 không? |
| 2   | 🎨 Visual      | Vẽ timeline React 17 SSR vs React 18 streaming SSR — chỉ ra 3 bottleneck và cách React 18 giải quyết       |
| 3   | 🛠️ Application | Codebase có 200 components dùng React 17. Viết migration plan 4 phases với checkpoint cho mỗi phase.       |
| 4   | 🐛 Debug       | Client Component import Server Component trực tiếp → lỗi gì? Fix cách nào mà vẫn dùng Server Component?    |
| 5   | 🎓 Teach       | Giải thích `useOptimistic` cho backend developer: khác `setState` ở chỗ nào? Khi nào KHÔNG nên dùng?       |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | React 17: render = bác sĩ không thể dừng giữa ca mổ (blocking). React 18: concurrent = pause urgent, resume non-urgent.                                      |
| 2   | 3 bottleneck: data→HTML (1 lần), HTML→hydrate (1 lần), hydrate→interactive (1 lần). Streaming: incremental HTML, selective hydrate, interruptible hydration. |
| 3   | Phase 1: createRoot + StrictMode. Phase 2: useTransition + Suspense. Phase 3: Compiler từ 1 folder. Phase 4: React 19 APIs.                                  |
| 4   | Lỗi: "Cannot import server component into client component." Fix: truyền SC như children prop vào CC — composition pattern.                                  |
| 5   | `useOptimistic` = hiển thị ngay + TỰ ĐỘNG revert khi fail. `setState` = hiển thị ngay + PHẢI TỰ revert. Không dùng cho payment/booking.                      |

> 🎯 **Feynman Prompt:** "Giải thích React 18 streaming SSR cho developer chưa biết React — dùng ví dụ nhà hàng buffet: React 17 bày xong 50 món mới mở cửa, React 18 bày từng quầy khi sẵn sàng."
> 🔁 **Spaced Repetition reminder:** Ôn lại file này sau **3 ngày**, **7 ngày**, và **14 ngày**.

[← Previous](./09-performance-optimization.md) | [Back to Table of Contents](../../00-table-of-contents.md)

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)

- [React 19 Features](./02-react-19-features.md) — Actions, Compiler, breaking changes chi tiết
- [Performance Optimization](./09-performance-optimization.md) — concurrent rendering performance patterns
- [Hooks Comprehensive](./07-hooks-comprehensive.md) — concurrency hooks useTransition/useDeferredValue
- [Advanced Patterns](./04-advanced-patterns.md) — Suspense pairs with compound component boundaries

### Khác track (Cross-track)

- [App Router & Server Components](../04-nextjs/01-app-router-server-components.md) — Next.js implementation of RSC
- [Data Fetching](../04-nextjs/02-data-fetching.md) — streaming SSR and Suspense in Next.js App Router
- [Architecture Styles](../../shared/05-software-engineering/02-architecture-styles.md) — RSC shifts server/client rendering architecture
