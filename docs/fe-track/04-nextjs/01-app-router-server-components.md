# Next.js App Router & Server Components / App Router & Server Components

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **Prerequisites**: [React Fundamentals](../03-react/01-react-fundamentals.md) | [React 19 Features](../03-react/02-react-19-features.md)
> **See also**: [Next.js Fundamentals](./00-nextjs-fundamentals.md) | [Data Fetching](./02-data-fetching.md)

[Back to Table of Contents](../../00-table-of-contents.md) | [Next →: Data Fetching](./02-data-fetching.md)

---

## Real-World Scenario / Tình Huống Thực Tế 🏭

> **Bối cảnh**: Team tại Tiki đang migrate từ Next.js Pages Router sang App Router. Vấn đề:
> product page bundle 450KB JS — bao gồm markdown parser cho description, date-fns cho
> "posted X days ago", và Prisma types cho type checking. User trên 3G mobile chờ 8 giây.
>
> Sau khi migrate sang App Router: product description component → Server Component (markdown
> parser chạy trên server, 0KB client JS). Date formatting → Server Component. Chỉ "Add to Cart"
> button và image gallery slider là Client Components.
>
> Kết quả: client bundle giảm từ 450KB → 120KB. LCP cải thiện 3 giây. Và SEO tốt hơn vì
> HTML đã có content sẵn khi Google crawl.
>
> **Interview insight**: App Router + Server Components là kiến trúc default của Next.js 14+.
> Hiểu `'use client'` boundary, streaming, và Server Actions là must-know cho 2025-2026 interviews.

---

## What & Why / Cái Gì & Tại Sao 🤔

**App Router** là routing system mới của Next.js (từ v13.4), xây trên **React Server Components** (RSC).
Thay đổi fundamental: components run on server by default — chỉ components cần interactivity mới chạy trên client.

**Tương tự đời thường**: Pages Router giống **nhà hàng truyền thống** — mọi món đều nấu tại bàn
khách (client-side). App Router giống **nhà hàng có bếp lớn** — món nào nấu sẵn được (static content,
data fetching) thì nấu trong bếp (server), chỉ món cần customize tại bàn (interactive UI) mới
gửi nguyên liệu ra ngoài (client JS).

```
App Router Architecture:

  [Server] ──────────────────────── [Client (Browser)]
  │                                  │
  │ Server Components (default)      │ Client Components ('use client')
  │ • Access DB/API directly         │ • useState, useEffect
  │ • Zero client JS                 │ • Event handlers (onClick)
  │ • Async/await in render          │ • Browser APIs (localStorage)
  │ • Heavy deps cost 0KB client     │ • Real-time updates
  │                                  │
  │ ──── serialization boundary ──── │
  │ Props must be serializable:      │
  │ ✅ string, number, boolean       │
  │ ✅ Date (as string), arrays      │
  │ ❌ functions, classes, Map/Set   │
  └──────────────────────────────────┘
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Server Components & Client Boundary / Server Components & Ranh Giới Client

> 🧠 **Memory Hook**: **"Server = default, Client = opt-in"** — everything is a Server Component unless you write `'use client'`

**Tại sao tồn tại? / Why does this exist?**

Traditional React (CSR/SSR) sends ALL component JavaScript to client — even components that
just display data and never need interactivity. A product description component that renders
markdown costs 50KB+ of parser JS on client for zero benefit.

→ **Why?** Vì trước App Router, không có cách phân biệt "component cần JS trên client" vs
"component chỉ cần HTML output". SSR render HTML trước nhưng VẪN gửi JS để hydrate.

→ **Why?** Vì RSC introduces a new primitive: components whose code NEVER reaches the client.
Server renders them → sends HTML + RSC payload → client displays without any JS for those components.
Trade-off: no interactivity (no state, no effects, no event handlers).

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Server Component giống **email có ảnh đính kèm**: server tạo xong ảnh (HTML), gửi cho client
hiển thị. Client không cần Photoshop (JS) để xem ảnh. Client Component giống **Google Docs** —
cần JS để edit, collaborate, real-time update.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
COMPOSITION RULES:

  ✅ Server renders Client:
  ─────────────────────────
  // app/page.tsx (Server Component — default)
  import { AddToCart } from './AddToCart'; // 'use client'

  export default async function ProductPage() {
    const product = await db.product.findFirst(); // direct DB access!
    return (
      <main>
        <h1>{product.name}</h1>
        <AddToCart productId={product.id} /> {/* client boundary */}
      </main>
    );
  }

  ✅ Client receives Server as children (DONUT PATTERN):
  ──────────────────────────────────────────────────────
  // InteractiveLayout.tsx ('use client')
  export function InteractiveLayout({ children }) {
    const [sidebar, setSidebar] = useState(false);
    return (
      <div>
        <button onClick={() => setSidebar(!sidebar)}>Toggle</button>
        {children}  {/* children CAN BE Server Components! */}
      </div>
    );
  }

  // page.tsx (Server Component)
  <InteractiveLayout>
    <ServerContent />  {/* rendered on server, passed as children */}
  </InteractiveLayout>

  ❌ Client CANNOT import Server:
  ────────────────────────────────
  // client.tsx ('use client')
  import ServerOnly from './ServerOnly'; // ❌ ERROR!
  // Server Component code can't be sent to client
```

```typescript
// ✅ Server Component — async, direct data access, 0KB client JS
// app/products/page.tsx
import { db } from '@/lib/database';
import { ProductList } from './ProductList'; // client component

export default async function ProductsPage() {
  // Runs on server — no API endpoint needed!
  const products = await db.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <main>
      <h1>Products</h1>
      <ProductList initialProducts={products} />
    </main>
  );
}

// ✅ Client Component — interactive, has JS on client
// app/products/ProductList.tsx
'use client';
import { useState } from 'react';

export function ProductList({ initialProducts }: { initialProducts: Product[] }) {
  const [filter, setFilter] = useState('');
  const filtered = initialProducts.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <ul>{filtered.map(p => <li key={p.id}>{p.name}</li>)}</ul>
    </>
  );
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Serialization boundary**: Props from Server → Client must be JSON-serializable. No functions, classes, `Map`, `Set`, `Date` (convert to string)
- **`'use client'` is a BOUNDARY, not a component marker**: Everything imported by a `'use client'` file also runs on client — even if it doesn't have the directive
- **Third-party components**: Most UI libraries (Radix, shadcn) are client components. Wrap them in a thin client component file when used from server
- **Fetching in Server Components**: Use `fetch()` with Next.js caching, or direct DB queries. No `useEffect` needed — just `async/await` in the component body

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Adding `'use client'` to every component | Defeats the purpose of RSC — all JS ships to client | Only add `'use client'` to components that NEED interactivity (state, effects, handlers) |
| "Server Components replace SSR" | SSR renders HTML for fast first paint but STILL hydrates (sends JS). RSC sends NO JS for server components | RSC = zero client JS; SSR = HTML first, then JS |
| Passing functions as props from Server to Client | Functions are not serializable across the boundary | Use Server Actions (`'use server'`) or pass data, not behavior |
| "Client Components don't run on server" | Client Components ARE server-rendered (SSR) for initial HTML. `'use client'` means they ALSO hydrate on client | Both Server and Client Components produce initial HTML on server |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "Server Components", "RSC", "App Router", "`'use client'`"
- → Nhớ đến: "Server = default, Client = opt-in"
- → Mở đầu trả lời: "In Next.js App Router, all components are Server Components by default — they run on the server, have zero client-side JavaScript, and can directly access databases and APIs. Only components that need interactivity — state, effects, event handlers — get the `'use client'` directive. The key architectural insight is the donut pattern: a Client Component can receive Server Components as `children`, enabling interactive wrappers around server-rendered content."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [React Fundamentals](../03-react/01-react-fundamentals.md) — component model, JSX, props
- ➡️ Để hiểu: [Data Fetching](./02-data-fetching.md) — caching and revalidation in App Router

---

### 2. File-based Routing — Layouts, Loading, Error / Routing Dựa Trên File

> 🧠 **Memory Hook**: **"File name = behavior"** — `page.tsx` = route, `layout.tsx` = shared wrapper, `loading.tsx` = Suspense fallback, `error.tsx` = ErrorBoundary

**Tại sao tồn tại? / Why does this exist?**

Pages Router dùng `pages/` directory — mỗi file = 1 route, nhưng shared layouts phải dùng `_app.tsx`
(global) hoặc custom wrapper (awkward). Nested layouts, per-route loading, và per-route error
handling đều phải manual.

→ **Why?** Vì web apps cần **nested UI**: dashboard has sidebar (shared), each tab has its own
loading state, each section has its own error boundary. Pages Router's flat file structure
can't express this nesting naturally.

→ **Why?** Vì App Router maps **file system hierarchy = UI hierarchy**: nested folders = nested
layouts. Each folder can have `loading.tsx` (auto-wraps children in Suspense) and `error.tsx`
(auto-wraps in ErrorBoundary). Zero boilerplate.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

App Router's file convention giống **cấu trúc thư mục = cấu trúc giao diện**: mỗi folder là 1
"khung" (layout), mỗi file đặc biệt (`loading.tsx`, `error.tsx`) là 1 behavior tự động.
Giống cách macOS Finder — tạo folder = tạo vùng chứa, không cần code thêm.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
FILE CONVENTIONS:

  app/
  ├── layout.tsx          ← Root layout (html, body)
  ├── page.tsx            ← Home route (/)
  ├── loading.tsx         ← <Suspense fallback> for home
  ├── error.tsx           ← <ErrorBoundary> for home
  ├── not-found.tsx       ← 404 page
  │
  ├── dashboard/
  │   ├── layout.tsx      ← Dashboard layout (sidebar, nav)
  │   ├── page.tsx        ← /dashboard
  │   ├── loading.tsx     ← Loading state for dashboard
  │   │
  │   ├── settings/
  │   │   ├── page.tsx    ← /dashboard/settings
  │   │   └── error.tsx   ← Error boundary for settings only
  │   │
  │   └── analytics/
  │       └── page.tsx    ← /dashboard/analytics
  │
  ├── (auth)/             ← Route group — NO URL segment
  │   ├── layout.tsx      ← Auth layout (centered card)
  │   ├── login/
  │   │   └── page.tsx    ← /login (not /auth/login!)
  │   └── register/
  │       └── page.tsx    ← /register
  │
  └── @modal/             ← Parallel route (named slot)
      └── photo/
          └── [id]/
              └── page.tsx ← Renders alongside main content

  HOW LAYOUTS NEST:

  <RootLayout>                     ← app/layout.tsx
    <DashboardLayout>              ← app/dashboard/layout.tsx
      <Suspense fallback={Loading}> ← app/dashboard/loading.tsx
        <ErrorBoundary fallback={Error}> ← auto from error.tsx
          <SettingsPage />          ← app/dashboard/settings/page.tsx
        </ErrorBoundary>
      </Suspense>
    </DashboardLayout>
  </RootLayout>
```

```typescript
// ✅ Root layout — REQUIRED, wraps entire app
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

// ✅ Dashboard layout — persistent sidebar, doesn't re-mount on navigation
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />      {/* stays mounted when switching tabs */}
      <main>{children}</main>
    </div>
  );
}

// ✅ loading.tsx — auto-wrapped in <Suspense>
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return <DashboardSkeleton />; // shown while page.tsx loads data
}

// ✅ error.tsx — auto-wrapped in <ErrorBoundary>
// app/dashboard/settings/error.tsx
'use client'; // error.tsx MUST be client component
export default function SettingsError({
  error, reset
}: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Something went wrong in Settings</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

// ✅ Route groups — organize without affecting URL
// app/(marketing)/about/page.tsx → URL: /about
// app/(dashboard)/settings/page.tsx → URL: /settings
// Different layouts for marketing vs dashboard pages!

// ✅ template.tsx vs layout.tsx
// layout.tsx: persists state across navigations (like sidebar open/close)
// template.tsx: re-mounts on every navigation (resets state, re-runs effects)
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Layout vs template**: `layout.tsx` persists state across navigations (sidebar stays open). `template.tsx` re-mounts every time (good for enter animations, analytics page views)
- **`error.tsx` must be `'use client'`**: Error boundaries require client-side interactivity (reset button)
- **`not-found.tsx` triggered by**: `notFound()` function call or unmatched dynamic routes
- **Parallel routes (`@slot`)**: Render multiple pages simultaneously in named slots — useful for modals, split views
- **Intercepting routes (`(..)`)**: Show a route in a modal when navigated via `<Link>`, full page when directly accessed (Instagram photo pattern)

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Putting state in `layout.tsx` for per-page data | Layout persists — state doesn't reset when child page changes | Use `template.tsx` for per-navigation state, or put state in page.tsx |
| Forgetting `'use client'` in error.tsx | Error boundary needs interactivity (reset button). Server Component can't handle errors | `error.tsx` MUST have `'use client'` directive |
| "Route groups affect URL" | `(auth)/login/page.tsx` → URL is `/login`, NOT `/auth/login` | Parentheses `()` mean "no URL segment" |
| Nesting too many layouts | Each layout adds wrapper divs and potential re-render scope | Only add layout when you genuinely need shared UI (sidebar, nav) |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "App Router", "layouts", "loading states", "error handling", "route groups"
- → Nhớ đến: "File name = behavior"
- → Mở đầu trả lời: "App Router uses file-system conventions where folder structure maps directly to UI hierarchy. Each folder can have `layout.tsx` for shared persistent UI, `loading.tsx` that auto-wraps in Suspense for streaming fallbacks, and `error.tsx` that auto-wraps in ErrorBoundary for granular error handling. Route groups with parentheses `(name)` organize code without affecting URLs."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [React — Suspense and ErrorBoundary](../03-react/01-react-fundamentals.md) — underlying React primitives
- ➡️ Để hiểu: [Next.js Architecture](./03-nextjs-architecture.md) — how routing integrates with middleware and caching

---

### 3. Server Actions & Data Mutation / Server Actions & Biến Đổi Dữ Liệu

> 🧠 **Memory Hook**: **"Server Actions = API routes that feel like function calls"** — write `'use server'`, call from client, Next.js handles the HTTP under the hood

**Tại sao tồn tại? / Why does this exist?**

Before Server Actions, form mutation required: create API route → client-side fetch → handle loading/error → revalidate data → update UI. That's 4 separate files and 50+ lines of boilerplate for every form.

→ **Why?** Vì traditional web apps need client-server round-trip cho mọi mutation. API route
là abstraction layer bắt buộc giữa client code và server logic.

→ **Why?** Vì Server Actions eliminate this abstraction: bạn viết một `async function` với
`'use server'` directive, gọi nó từ client component hoặc form `action`, Next.js tự tạo
HTTP endpoint, serialize data, call function on server, trả kết quả về client.
Trade-off: tightly couples client UI to server logic (good for same-team fullstack, bad for
separate API consumers).

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Server Actions giống **điều khiển từ xa TV**: bạn nhấn nút (gọi function từ client), signal
đi đến TV (server xử lý), TV thay đổi kênh (database update). Bạn không cần biết signal
truyền qua infrared hay bluetooth (HTTP endpoint) — chỉ nhấn nút và thấy kết quả.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
SERVER ACTIONS — data flow:

  Client                            Server
  ──────                            ──────
  1. User submits form
     │
     ▼
  2. FormData serialized ────────► 3. Server Action fn executes
     (automatic by Next.js)             │
                                        ├── DB write (Prisma/Drizzle)
                                        ├── revalidatePath/Tag
                                        └── redirect (optional)
                                        │
  5. UI updates ◄──────────────── 4. Response + revalidated data
     (streaming, no full reload)

  Progressive Enhancement:
  <form action={serverAction}> works BEFORE JS loads!
  → HTML form submit → server processes → redirects
  → When JS loads, it enhances to no-reload AJAX
```

```typescript
// ✅ Server Action — inline in Server Component
// app/todos/page.tsx
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

export default async function TodosPage() {
  const todos = await db.todo.findMany();

  async function addTodo(formData: FormData) {
    'use server'; // ← this function runs on SERVER

    const text = formData.get('text') as string;
    await db.todo.create({ data: { text, completed: false } });
    revalidatePath('/todos'); // revalidate this page's cache
  }

  return (
    <main>
      <form action={addTodo}>
        <input name="text" required />
        <button type="submit">Add</button>
      </form>
      <ul>{todos.map(t => <li key={t.id}>{t.text}</li>)}</ul>
    </main>
  );
}

// ✅ Server Action — separate file for reuse
// app/actions/todos.ts
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { z } from 'zod';

const TodoSchema = z.object({ text: z.string().min(1).max(200) });

export async function addTodo(prevState: ActionState, formData: FormData) {
  const parsed = TodoSchema.safeParse({ text: formData.get('text') });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors.text?.[0] };
  }

  await db.todo.create({ data: { text: parsed.data.text, completed: false } });
  revalidatePath('/todos');
  return { error: null };
}

export async function deleteTodo(id: string) {
  await db.todo.delete({ where: { id } });
  revalidatePath('/todos');
}

// ✅ Client Component using Server Action with useActionState
// app/todos/TodoForm.tsx
'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { addTodo } from '@/app/actions/todos';

export function TodoForm() {
  const [state, formAction] = useActionState(addTodo, { error: null });

  return (
    <form action={formAction}>
      <input name="text" required />
      {state.error && <p className="text-red-500">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Adding...' : 'Add Todo'}</button>;
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Security**: Server Actions are POST endpoints — always validate input (Zod). Never trust `formData` — it's user input
- **`revalidatePath` vs `revalidateTag`**: Path revalidates all data on a route. Tag revalidates all fetches tagged with that string — more granular
- **`redirect()` in Server Actions**: Throws a special error internally — must be called OUTSIDE try/catch or in `finally`
- **Size limit**: FormData has a 1MB default limit. For file uploads, stream to cloud storage instead of passing through Server Action
- **Not for reads**: Server Actions are for mutations (POST). Use Server Components or `fetch` in `page.tsx` for reads

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Not validating Server Action input | Server Actions are HTTP endpoints — malicious users can call them directly | Always validate with Zod/schema before DB operations |
| Using Server Actions for data fetching | Actions are POST mutations. Reads should be in Server Components or API routes | Server Components for reads, Server Actions for writes |
| `redirect()` inside try/catch | `redirect()` throws a special Next.js error — catch swallows it | Call `redirect()` outside try/catch or in `finally` |
| Not revalidating after mutation | Stale data shown after successful mutation | Always `revalidatePath()` or `revalidateTag()` after DB writes |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "Server Actions", "`'use server'`", "form handling in Next.js", "data mutation"
- → Nhớ đến: "API routes that feel like function calls"
- → Mở đầu trả lời: "Server Actions let you write async functions with a `'use server'` directive that execute on the server but can be called directly from client components or form actions. Next.js handles the HTTP layer — serializing FormData, calling the function on the server, and returning the result. Combined with `revalidatePath`, this creates a tight mutation → revalidation loop. The key advantage over API routes is progressive enhancement — forms work before JavaScript loads."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [React 19 Actions](../03-react/02-react-19-features.md) — useActionState, useFormStatus, useOptimistic
- ➡️ Để hiểu: [Data Fetching & Caching](./02-data-fetching.md) — how revalidation integrates with Next.js cache

---

## Interview Q&A / Hỏi Đáp Phỏng Vấn

### Q1: What are Server Components and how do they differ from SSR? / Server Components là gì và khác SSR thế nào? 🟢 Junior

**A:** Server Components run on the server and send rendered HTML + RSC payload to the client — but **zero JavaScript** for those components reaches the client. SSR also renders HTML on the server for fast first paint, but then **sends all component JavaScript** for hydration.

| Aspect | SSR (Pages Router) | RSC (App Router) |
|--------|--------------------|------------------|
| Initial HTML | ✅ Server-rendered | ✅ Server-rendered |
| Client JS | All component JS sent | Only `'use client'` components |
| Hydration | Full tree hydration | Only client components hydrate |
| Data access | `getServerSideProps` (separate) | Direct in component body (`async/await`) |

Giải thích tiếng Việt: Server Components render trên server và KHÔNG gửi JS xuống client (0KB). SSR cũng render HTML trên server nhưng VẪN gửi tất cả JS để hydrate. RSC = zero JS cho server components; SSR = HTML trước, JS sau.

**💡 Interview Signal:**
- ✅ Strong: Distinguishes "zero JS" (RSC) from "HTML first then JS" (SSR), mentions hydration difference
- ❌ Weak: Confuses RSC with SSR, says "they both render on server" without explaining the JS difference

---

### Q2: Explain the `'use client'` boundary. When do you need it? / Giải thích `'use client'` boundary. Khi nào cần? 🟡 Mid

**A:** `'use client'` marks a **boundary** — not just the component, but everything it imports also runs on client. You need it when a component uses:

- `useState`, `useEffect`, `useReducer`, or other client hooks
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`localStorage`, `window`, `navigator`)
- Third-party libraries that use any of the above

**Best practice**: Push `'use client'` as deep as possible. Don't put it on a layout that wraps 50 components — put it on the specific button that needs `onClick`.

```tsx
// ❌ Too broad — entire page is now client
'use client';
export default function ProductPage() { ... } // all children are client too

// ✅ Minimal boundary — only the interactive part is client
// page.tsx (Server Component)
export default async function ProductPage() {
  const product = await db.product.findFirst();
  return (
    <main>
      <h1>{product.name}</h1>           {/* server — 0KB JS */}
      <Description html={product.desc} /> {/* server — 0KB JS */}
      <AddToCartButton id={product.id} /> {/* 'use client' — only this has JS */}
    </main>
  );
}
```

Giải thích tiếng Việt: `'use client'` đánh dấu ranh giới — component đó VÀ tất cả imports của nó chạy trên client. Cần khi dùng hooks (useState, useEffect), event handlers, hoặc browser APIs. Best practice: đẩy `'use client'` xuống sâu nhất có thể để minimize client JS.

**💡 Interview Signal:**
- ✅ Strong: Explains it's a BOUNDARY (affects imports too), shows minimal boundary pattern
- ❌ Weak: Thinks `'use client'` is just a "marker" on one component, puts it at top level

---

### Q3: How do layouts work in App Router? Layout vs template? / Layouts hoạt động thế nào? Layout vs template? 🟡 Mid

**A:** `layout.tsx` wraps child routes and **persists across navigations** — state is preserved, the component doesn't re-mount. When user navigates `/dashboard/settings` → `/dashboard/analytics`, the dashboard layout stays mounted.

`template.tsx` re-mounts on every navigation — state resets, effects re-run. Use for: enter/exit animations, per-page analytics tracking, resetting form state.

```
/dashboard/settings → /dashboard/analytics:

  layout.tsx:   sidebar state PRESERVED (menu open stays open)
  template.tsx: re-mounts, state RESET, useEffect re-runs
```

Giải thích tiếng Việt: `layout.tsx` giữ state qua navigation (sidebar vẫn mở). `template.tsx` re-mount mỗi lần chuyển trang (state reset, effects chạy lại). Dùng template cho animation entry, analytics page view, reset form.

**💡 Interview Signal:**
- ✅ Strong: Explains persistence behavior, gives concrete example (sidebar state), knows when to use template
- ❌ Weak: Doesn't know template exists, or thinks layout re-mounts on navigation

---

### Q4: What are Server Actions and how do they differ from API routes? / Server Actions là gì và khác API routes thế nào? 🔴 Senior

**A:** Server Actions are async functions with `'use server'` that run on the server but can be called from client components. Next.js generates the HTTP endpoint automatically.

| Aspect | API Routes | Server Actions |
|--------|-----------|---------------|
| Definition | `app/api/route.ts` | `'use server'` in any file |
| Call from client | `fetch('/api/...')` | Direct function call |
| Progressive enhancement | ❌ Requires JS | ✅ Forms work before JS loads |
| Type safety | Manual types | End-to-end TypeScript inference |
| Use case | External API consumers, webhooks | Same-app form mutations |

**When to still use API routes**: External consumers (mobile app, third-party), webhooks, server-sent events, file streaming. Server Actions are for same-app mutations only.

Giải thích tiếng Việt: Server Actions là async functions với `'use server'` chạy trên server — gọi trực tiếp từ client như function call, Next.js tạo HTTP endpoint tự động. Khác API routes: type-safe end-to-end, progressive enhancement (form hoạt động trước JS load). Vẫn cần API routes cho external consumers và webhooks.

**💡 Interview Signal:**
- ✅ Strong: Shows comparison table, explains progressive enhancement, knows when to still use API routes
- ❌ Weak: Only says "it runs on server" without explaining the mutation pattern or when NOT to use

---

### Q5: Design the component architecture for an e-commerce product page using App Router. / Thiết kế component architecture cho product page bằng App Router. 🔴 Senior

**A:**

```
app/products/[id]/
├── layout.tsx        ← Breadcrumb + product nav (Server)
├── page.tsx          ← Main product page (Server)
├── loading.tsx       ← Product skeleton
├── error.tsx         ← "Product not found" retry
└── components/
    ├── ProductInfo.tsx       ← Server: name, description, specs (0KB JS)
    ├── ProductImages.tsx     ← Client: image gallery swipe/zoom
    ├── PriceDisplay.tsx      ← Server: price, discount badge
    ├── AddToCartButton.tsx   ← Client: quantity selector, add to cart
    ├── ReviewsList.tsx       ← Server: fetch + render reviews
    └── ReviewForm.tsx        ← Client: form with useActionState
```

**Key decisions:**
1. **Product info + reviews = Server Components**: Markdown description + review list are read-only → zero client JS. Heavy markdown parser stays on server.
2. **Image gallery + cart button = Client Components**: Need touch/swipe interaction and state.
3. **Server Action for review submission**: `addReview` with Zod validation → `revalidatePath`
4. **Streaming**: `loading.tsx` shows skeleton immediately. Reviews section wrapped in `<Suspense>` loads after main product info → progressive rendering.

```tsx
// app/products/[id]/page.tsx (Server Component)
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { ProductImages } from './components/ProductImages';
import { AddToCartButton } from './components/AddToCartButton';
import { ReviewsList } from './components/ReviewsList';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await db.product.findUnique({ where: { id: params.id } });
  if (!product) notFound();

  return (
    <main>
      {/* Server: 0KB JS */}
      <h1>{product.name}</h1>
      <p>{product.description}</p>

      {/* Client: interactive gallery */}
      <ProductImages images={product.images} />

      {/* Client: needs useState for quantity */}
      <AddToCartButton productId={product.id} price={product.price} />

      {/* Streamed: loads after main content */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <ReviewsList productId={product.id} />
      </Suspense>
    </main>
  );
}
```

Giải thích tiếng Việt: Chia component theo interactivity: read-only content (description, reviews list, price) = Server Component (0KB JS). Interactive UI (image gallery, add to cart, review form) = Client Component. Streaming cho reviews (load sau main content). Server Action cho form submission.

**💡 Interview Signal:**
- ✅ Strong: Splits by interactivity (not by feature), uses streaming for heavy sections, mentions specific benefits (0KB markdown parser)
- ❌ Weak: Puts `'use client'` on entire page, or can't explain which components should be server vs client

---

## Interview Q&A Summary / Tổng Kết Q&A

| # | Topic | Difficulty | Key Concept |
|---|-------|-----------|-------------|
| Q1 | Server Components vs SSR | 🟢 Junior | RSC = zero client JS, SSR = HTML then JS |
| Q2 | `'use client'` boundary | 🟡 Mid | Boundary affects imports, push as deep as possible |
| Q3 | Layout vs template | 🟡 Mid | Layout persists state, template re-mounts |
| Q4 | Server Actions vs API routes | 🔴 Senior | Function call vs fetch, progressive enhancement |
| Q5 | Architecture design | 🔴 Senior | Split by interactivity: read-only=server, interactive=client |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"Explain Next.js App Router and Server Components."**

**30 giây đầu — mở đầu lý tưởng:**
1. "App Router is Next.js's routing system built on React Server Components — every component is a Server Component by default, running on the server with zero client-side JavaScript."
2. "Only components that need interactivity — state, effects, event handlers — get the `'use client'` directive. This dramatically reduces client bundle size because heavy dependencies like markdown parsers and ORMs stay on the server."
3. "The file system maps directly to UI hierarchy: `layout.tsx` creates persistent shared UI, `loading.tsx` auto-wraps in Suspense for streaming, and `error.tsx` provides granular error boundaries per route segment."
4. "For data mutations, Server Actions replace API routes for same-app forms — you write an async function with `'use server'`, call it from a form action, and Next.js handles the HTTP layer with progressive enhancement."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| # | Loại | Câu hỏi |
|---|------|---------|
| 1 | 🔍 Retrieval | Viết 3 composition rules của Server/Client Components từ trí nhớ: Server→Client OK, donut pattern, và tại sao Client→Server bị giới hạn? |
| 2 | 🎨 Visual | Vẽ file tree cho dashboard app có: shared sidebar, per-tab loading skeleton, settings có error boundary riêng. Ghi rõ mỗi file là gì (layout/page/loading/error). |
| 3 | 🛠️ Application | Product page có description (markdown), image gallery (swipeable), reviews (fetched từ DB). Phân loại: component nào Server, component nào Client? Tại sao? |
| 4 | 🐛 Debug | Server Action gọi `redirect('/success')` bên trong `try/catch` nhưng redirect không hoạt động. Tại sao? Cách fix? |
| 5 | 🎓 Teach | Giải thích sự khác biệt giữa RSC và SSR cho dev chỉ biết Pages Router — dùng ví dụ "nhà hàng với bếp riêng vs bếp tại bàn". |

### Key Points (tự kiểm tra)

| # | Key Point |
|---|-----------|
| 1 | Server→Client: OK (pass serializable props). Donut: Client wraps Server via `children` (composition). Client→Server import: không được (Client bundles sent to browser, cannot import Server-only). |
| 2 | `app/dashboard/layout.tsx` (Server, shared sidebar), `app/dashboard/[tab]/page.tsx` (Server), `app/dashboard/[tab]/loading.tsx` (Suspense skeleton), `app/settings/error.tsx` (Client error boundary). |
| 3 | Server: description (no interactivity), reviews (DB fetch). Client: image gallery (swipe interactions, useState). Nguyên tắc: Client chỉ khi cần hooks, browser APIs, hay event handlers. |
| 4 | `redirect()` throw error đặc biệt. `try/catch` bắt error đó và nuốt nó → redirect không xảy ra. Fix: gọi `redirect()` NGOÀI try block, hoặc chỉ catch non-redirect errors. |
| 5 | SSR (Pages): server nấu HTML mỗi request, gửi xuống client, client "hydrate". RSC: chỉ Server Components ở lại server mãi mãi — không gửi JS xuống, không hydrate. Nhẹ hơn. |

> 🎯 **Feynman Prompt:** Giải thích `'use client'` boundary cho developer mới — "Bảng hiệu trên cửa phòng: ai vào phòng này phải theo quy tắc này."
🔁 **Spaced Repetition reminder:** Review this file again on 2026-03-22, then 2026-03-26, then 2026-04-02.

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)
- [Data Fetching](./02-data-fetching.md) — fetch strategies that power Server Components
- [Next.js Architecture](./03-nextjs-architecture.md) — rendering strategies (SSG/ISR/SSR) using RSC
- [App Router Fundamentals](./04-nextjs-fundamentals-appRouter.md) — special files & routing conventions that host RSC
- [Next.js Fundamentals](./00-nextjs-fundamentals.md) — foundational concepts before diving into RSC

### Khác track (Cross-track)
- [React Fundamentals](../03-react/01-react-fundamentals.md) — React rendering model RSC builds upon
- [React 19 Features](../03-react/02-react-19-features.md) — concurrent features and Actions that complement RSC
- [React Performance](../06-browser-performance/02-react-performance.md) — how RSC reduces client bundle and re-renders
