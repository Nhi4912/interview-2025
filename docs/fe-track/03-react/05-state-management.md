# State Management / Quản Lý Trạng Thái

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [React Fundamentals](./01-react-fundamentals.md) | [Hooks Deep Dive](./03-hooks-deep-dive.md)
> **See also**: [React Performance](../06-browser-performance/02-react-performance.md) | [Functional Programming](../01-javascript/12-functional-programming.md)

[← Previous: Advanced Patterns](./04-advanced-patterns.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →: Testing](./06-testing.md)

---

## Real-World Scenario / Tình Huống Thực Tế 🏭

> **Bối cảnh**: App e-commerce có 50+ components. User đăng nhập ở Header → cần cập nhật:
> sidebar menu, user avatar, notification bell, dashboard greeting, permission checks ở 20
> components khác nhau. Team dùng Context cho TẤT CẢ — auth, cart, theme, notifications.
>
> Kết quả: mỗi khi cart thêm 1 item, **mọi component subscribed to ANY context đều re-render**
> — kể cả Header chỉ đọc theme. Performance tụt từ 60fps xuống 15fps trên mobile.
>
> Post-mortem: Context không có **selector mechanism** — không thể subscribe chỉ 1 field.
> Team migrate cart + notifications sang Zustand (fine-grained subscriptions), giữ Context
> cho theme + locale (ít update). Performance recovered.
>
> **Interview insight**: Biết khi nào KHÔNG dùng Redux/Context quan trọng hơn biết API của chúng.

---

## What & Why / Cái Gì & Tại Sao 🤔

**State management** = cách organize, share, và update data across components.

**Tương tự đời thường**: Quản lý state giống **hệ thống giao tiếp trong công ty**:
- **Local state** (`useState`) = ghi chú cá nhân — chỉ bạn cần
- **Context** = bảng thông báo ở sảnh — ai đi qua cũng thấy, nhưng mỗi khi thay đổi phải in lại TOÀN BỘ bảng
- **Redux/Zustand** = hệ thống email nội bộ — mỗi người chỉ subscribe topic cần, nhận notification chính xác

**Decision framework:**

| Use case | Tool | Tại sao |
|----------|------|---------|
| 1 component UI state | `useState` | Đơn giản, không global |
| 2-3 components cùng cần | Lift state + props | Không phức tạp hóa |
| Theme, auth, locale | React Context | Read-mostly, ít update |
| Complex app-wide state | Redux/Zustand | Predictable, fine-grained |
| Server data (fetch/cache) | TanStack Query/SWR | Caching, refetching, sync |
| Form state | React Hook Form | Performance, validation |

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Context API & Its Re-render Problem / Context API & Vấn Đề Re-render

> 🧠 **Memory Hook**: **"Context = broadcast radio"** — when the station updates, ALL listeners re-render, even if they only care about weather and the update was sports news

**Tại sao tồn tại? / Why does this exist?**

Prop drilling qua 5-10 tầng component rất khó maintain. Context cho phép component ở bất kỳ
depth nào "subscribe" trực tiếp đến shared data.

→ **Why?** Vì React's data flow là one-way (parent → child). Không có mechanism built-in để
sibling components share state mà không đi qua common ancestor.

→ **Why?** Vì one-way data flow là design choice CỐ Ý — predictable, debuggable, nhưng đánh đổi
convenience. Context là escape hatch cho cases cần cross-cutting data (theme, auth, locale).

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Context giống **đài phát thanh**: mọi người (components) bật radio lên nghe cùng kênh.
Khi đài phát tin mới (provider value thay đổi), TẤT CẢ người nghe đều nhận signal —
dù tin đó không liên quan đến họ. Đây là lý do Context không phù hợp cho state hay update thường xuyên.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
Context re-render behavior:

  <ThemeContext.Provider value={{ theme, user, cart }}>
       │
       ├── <Header />     ← uses theme only
       ├── <Sidebar />    ← uses user only
       └── <CartIcon />   ← uses cart only

  When cart changes:
  → Provider creates new value object
  → ALL consumers re-render (Header, Sidebar, CartIcon)
  → Even though Header and Sidebar don't use cart!

  WHY? Context uses reference equality (===) on the value.
  New object = new reference = all consumers re-render.
```

```typescript
// ✅ Pattern: split contexts by update frequency
const ThemeContext = createContext<Theme>('light');      // rarely changes
const AuthContext = createContext<AuthState | null>(null); // changes on login/logout
const CartContext = createContext<CartState>({ items: [] }); // changes frequently

// ✅ Custom hook with guard
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be within AuthProvider');
  return context;
}

// ✅ Provider composition — avoid "provider hell" nesting
function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// ✅ Optimization: memoize provider value
function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Without useMemo: new object every render → all consumers re-render
  const value = useMemo(() => ({
    items,
    addItem: (item: CartItem) => setItems(prev => [...prev, item]),
    removeItem: (id: string) => setItems(prev => prev.filter(i => i.id !== id)),
    total: items.reduce((sum, i) => sum + i.price * i.qty, 0)
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **`useMemo` on value** only prevents re-renders when the Provider's parent re-renders — it does NOT prevent consumer re-renders when the value actually changes
- **React 19 `use()` hook**: Can read Context conditionally (inside if/loops), unlike `useContext`
- **No selector**: Context has no way to subscribe to a subset of the value — `useContextSelector` is a community solution, not built-in
- **Server Components**: Context is client-only in Next.js App Router — use module scope or props for server components

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "Context replaces Redux" | Context has no middleware, devtools, selectors, or time-travel | Context = DI mechanism, Redux = state management library |
| Putting everything in one Context | Any update re-renders ALL consumers | Split by update frequency: theme (rare) vs cart (frequent) |
| Not memoizing provider value | Parent re-render → new object → unnecessary consumer re-renders | Always `useMemo` the value object |
| "Context is slow" | Context itself isn't slow — the problem is over-broad subscriptions | Context is fine for low-frequency data (theme, locale, auth) |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "Context API", "prop drilling", "when to use Context"
- → Nhớ đến: "Broadcast radio" — all listeners re-render on any change
- → Mở đầu trả lời: "Context solves prop drilling by letting any component subscribe to shared data, but it lacks a selector mechanism — when the value changes, all consumers re-render regardless of which part they use. This makes Context ideal for low-frequency updates like theme and locale, but problematic for high-frequency state like shopping carts. For those, I'd use Zustand or Redux which support fine-grained subscriptions."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [React Fundamentals](./01-react-fundamentals.md) — component tree, re-rendering, reconciliation
- ➡️ Để hiểu: [React Performance](../06-browser-performance/02-react-performance.md) — measuring and fixing re-render issues

---

### 2. Redux Architecture — Flux Pattern, Middleware, Selectors / Kiến Trúc Redux

> 🧠 **Memory Hook**: **"Redux = strict accountant"** — every transaction (action) is logged, every balance change (state) goes through one ledger (store), and you can replay the entire history

**Tại sao tồn tại? / Why does this exist?**

Facebook (2014) had a bug: notification badge showed "1 new message" but no unread messages existed.
Root cause: multiple models updating each other in unpredictable order (MVC with bidirectional data flow).

→ **Why?** Vì two-way binding giữa multiple models tạo ra **cascading updates** — Model A
updates View, View updates Model B, Model B updates Model A → infinite loop hoặc inconsistent state.

→ **Why?** Vì Flux/Redux enforces **unidirectional data flow**: Action → Reducer → State → View.
Mỗi state change traceable, predictable, time-travel debuggable. Trade-off: more boilerplate
cho predictability tuyệt đối.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Redux giống **hệ thống kế toán**: mọi giao dịch (action) phải có chứng từ (action object),
mọi thay đổi số dư (state) chỉ đi qua 1 sổ cái (store) qua kế toán (reducer). Không ai
được sửa trực tiếp vào sổ — chỉ submit chứng từ. Nhờ vậy, kiểm toán (DevTools time-travel)
rất dễ dàng.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
Redux Data Flow (unidirectional):

  ┌──────────┐   dispatch(action)   ┌──────────┐
  │   View   │ ──────────────────► │  Store   │
  │(Component)│                     │          │
  └──────────┘                     │ reducer  │
       ▲                           │ (pure fn)│
       │                           └────┬─────┘
       │         new state              │
       └────────────────────────────────┘

  With Middleware:
  Component → dispatch(action) → [Middleware Chain] → Reducer → Store → Component
                                  │ logger │ thunk │ analytics │

  Middleware signature:
  store => next => action => { /* before */ next(action) /* after */ }
```

```typescript
// Modern Redux Toolkit setup
import { configureStore, createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

// ✅ Slice = reducer + actions auto-generated
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] as CartItem[], loading: false },
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      // RTK uses Immer under the hood — "mutation" syntax is safe!
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; qty: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) item.qty = action.payload.qty;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      });
  }
});

// ✅ Async thunk — handles loading/error lifecycle
const fetchCart = createAsyncThunk('cart/fetch', async (userId: string) => {
  const res = await fetch(`/api/cart/${userId}`);
  return res.json();
});

// ✅ Memoized selector — prevents unnecessary re-renders
const selectCartTotal = createSelector(
  [(state: RootState) => state.cart.items],
  (items) => items.reduce((sum, i) => sum + i.price * i.qty, 0)
);

// ✅ Custom middleware — logging
const logger: Middleware = (store) => (next) => (action) => {
  console.log('dispatching', action.type);
  const result = next(action);
  console.log('next state', store.getState());
  return result;
};

const store = configureStore({
  reducer: { cart: cartSlice.reducer },
  middleware: (getDefault) => getDefault().concat(logger)
});
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **RTK's Immer**: `state.items.push()` LOOKS like mutation but is actually Immer producing immutable update. Only works inside `createSlice` reducers — NOT in regular functions
- **Selector parameterization**: `createSelector` with per-component arguments needs `useMemo` to create separate memoization cache per component instance
- **Redux vs server state**: Redux is NOT for API cache — use TanStack Query/SWR for fetch/cache/revalidation. Redux for truly client-only state (UI state, form wizard steps)
- **Bundle size**: Redux Toolkit ≈ 11KB gzip. Zustand ≈ 1.2KB. For small apps, RTK may be overkill

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "Redux is slow because it re-renders everything" | Redux `useSelector` only re-renders when selected value changes (reference equality) | Performance issues come from bad selectors, not Redux itself |
| Putting API cache in Redux | Redux doesn't handle caching, stale data, or background refetching | Use TanStack Query for server state, Redux for client state |
| Creating new objects in selectors without `createSelector` | `useSelector(() => items.filter(...))` creates new array each render → infinite re-render loop | Always use `createSelector` for derived data |
| "Immer syntax means I can mutate anywhere" | Immer wrapping only exists inside `createSlice` reducers | Outside reducers, spread operators are still required |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "Redux", "Flux", "state management architecture", "middleware"
- → Nhớ đến: "Strict accountant" — unidirectional flow, every change logged
- → Mở đầu trả lời: "Redux enforces unidirectional data flow — Action → Middleware → Reducer → Store → View. This was created to solve Facebook's cascading update problem where bidirectional data binding caused inconsistent state. Redux Toolkit modernizes the API with `createSlice` (auto-generates actions from reducers using Immer) and `createAsyncThunk` (handles async loading lifecycle)."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Functional Programming — Pure Functions](../01-javascript/12-functional-programming.md) — reducers MUST be pure
- ➡️ Để hiểu: [Advanced Patterns](./04-advanced-patterns.md) — middleware pattern is a HOF chain, same as Express middleware

---

### 3. Modern Alternatives — Zustand, Jotai, Signals / Giải Pháp Hiện Đại

> 🧠 **Memory Hook**: **"Zustand = Redux without the ceremony"** — same concept (external store + subscriptions), but API fits in a tweet

**Tại sao tồn tại? / Why does this exist?**

Redux Toolkit giảm boilerplate so với Redux gốc, nhưng vẫn cần: store setup, Provider wrapper,
typed hooks, slice files. Cho small-to-medium apps, đó là overkill.

→ **Why?** Vì React's own state primitives (`useState`, Context) có limitations (Context re-render,
no selector), nhưng Redux adds too much structure for simple cases.

→ **Why?** Vì modern libraries exploit a key insight: **external store + `useSyncExternalStore`**
= fine-grained subscriptions WITHOUT Provider wrappers. Zustand, Jotai, Valtio all use this API
internally, just with different mental models.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Nếu Redux là **ERP system** (SAP, Oracle — powerful nhưng setup phức tạp), thì:
- **Zustand** = Google Sheets — simple, mọi người edit real-time, đủ cho 90% use cases
- **Jotai** = Post-it notes — mỗi atom là 1 note nhỏ, combine khi cần
- **Signals** = reactive spreadsheet cells — update 1 cell, chỉ cells phụ thuộc re-calculate

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
Mental model comparison:

  Context:     Provider (top-down)  →  All consumers re-render
  Redux:       Store → Selectors   →  Only selected slice re-renders
  Zustand:     Store → Selectors   →  Only selected slice re-renders (no Provider!)
  Jotai:       Atoms (bottom-up)   →  Only dependent atoms re-render
  Signals:     Fine-grained        →  No component re-render, DOM updates directly

  Bundle size (gzip):
  Redux Toolkit: ~11KB    Context: 0KB (built-in)
  Zustand:       ~1.2KB   Jotai:   ~3KB
  @preact/signals-react: ~2KB
```

```typescript
// ✅ Zustand — the pragmatic choice for most apps
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  total: () => number;
}

const useCartStore = create<CartStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        items: [],
        addItem: (item) => set((state) => { state.items.push(item); }),
        removeItem: (id) => set((state) => {
          state.items = state.items.filter(i => i.id !== id);
        }),
        total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      })),
      { name: 'cart-storage' } // localStorage persistence
    )
  )
);

// Usage — no Provider needed!
function CartIcon() {
  // Fine-grained: only re-renders when items.length changes
  const count = useCartStore((state) => state.items.length);
  return <span>Cart ({count})</span>;
}

function CartTotal() {
  const total = useCartStore((state) => state.total());
  return <span>Total: ${total}</span>;
}

// ✅ Jotai — atomic, bottom-up approach
import { atom, useAtom, useAtomValue } from 'jotai';

const itemsAtom = atom<CartItem[]>([]);
const totalAtom = atom((get) =>
  get(itemsAtom).reduce((sum, i) => sum + i.price * i.qty, 0)
);

// Derived atom: only components reading totalAtom re-render when total changes
function CartTotal() {
  const total = useAtomValue(totalAtom);
  return <span>Total: ${total}</span>;
}

// ✅ Zustand slices pattern — scaling for large apps
interface AuthSlice {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface UISlice {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

const useStore = create<AuthSlice & UISlice>()(
  devtools((...a) => ({
    // Auth slice
    user: null,
    login: async (email, password) => {
      const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const user = await res.json();
      a[0]({ user });
    },
    logout: () => a[0]({ user: null }),

    // UI slice
    theme: 'light',
    sidebarOpen: true,
    toggleTheme: () => a[0]((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
    toggleSidebar: () => a[0]((s) => ({ sidebarOpen: !s.sidebarOpen })),
  }))
);
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Zustand equality**: Default is `Object.is` — if you return an object from selector, use `shallow` comparator to avoid false re-renders
- **Jotai provider**: Optional, but needed for testing (isolate atom state per test) or multiple independent stores
- **SSR**: Zustand needs hydration handling — initial state from server may differ from client store
- **Recoil**: Facebook's solution, but development has stalled in 2024. Community moving to Jotai
- **Signals**: Bypass React's rendering model entirely — controversial, may break with future React features

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "Zustand can't scale" | Zustand has slices, middleware, devtools, persist — covers enterprise needs | Scale with slice pattern, same as Redux but less boilerplate |
| Subscribing to entire Zustand store | `useStore()` with no selector re-renders on ANY change | Always pass a selector: `useStore(s => s.count)` |
| "Jotai and Recoil are the same" | Jotai is provider-less, simpler API; Recoil requires RecoilRoot and string keys | Jotai is more maintained and growing faster in 2025-2026 |
| Mixing server state and client state in one store | Server state needs cache invalidation, refetching, background sync — different lifecycle | TanStack Query for server state, Zustand/Redux for client state |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "state management comparison", "which library to choose", "Zustand vs Redux"
- → Nhớ đến: "Zustand = Redux without the ceremony"
- → Mở đầu trả lời: "I'd categorize state management by the type of state: client UI state (Zustand for simple, Redux for complex), server/async state (TanStack Query), and cross-cutting concerns like theme (Context). Zustand has become my default for client state because it offers fine-grained subscriptions like Redux but with ~1KB bundle and no Provider boilerplate. I reach for Redux Toolkit when I need time-travel debugging or complex middleware chains."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Hooks — useSyncExternalStore](./03-hooks-deep-dive.md) — how external stores integrate with React
- ➡️ Để hiểu: [React Performance](../06-browser-performance/02-react-performance.md) — selector optimization prevents wasted renders

---

## Interview Q&A / Hỏi Đáp Phỏng Vấn

### Q1: What is prop drilling and how do you solve it? / Prop drilling là gì và giải quyết thế nào? 🟢 Junior

**A:** Prop drilling is passing data through multiple intermediate components that don't use it, just to reach a deeply nested component.

```
<App user={user}>            ← has data
  <Layout user={user}>       ← doesn't use, just passes
    <Sidebar user={user}>    ← doesn't use, just passes
      <UserMenu user={user}> ← actually uses it
```

**Solutions (in order of complexity):**
1. **Component composition**: Pass components as children to avoid drilling through intermediaries
2. **React Context**: For data needed by many components at different depths (theme, auth)
3. **External store (Zustand)**: For frequently-updated state needing fine-grained subscriptions
4. **Custom hooks**: Abstract the subscription logic — consumers call `useAuth()` not `useContext(AuthCtx)`

```typescript
// ✅ Composition — most underrated solution
function App() {
  const user = useUser();
  return (
    <Layout>
      <Sidebar>
        <UserMenu user={user} /> {/* passed directly, no drilling */}
      </Sidebar>
    </Layout>
  );
}
```

Giải thích tiếng Việt: Prop drilling là truyền data qua nhiều tầng component trung gian chỉ để đến component sâu bên trong. Giải pháp đơn giản nhất thường bị bỏ qua: **component composition** — truyền component đã có data thay vì data qua nhiều tầng. Context cho data ít update, Zustand/Redux cho data update thường xuyên.

**💡 Interview Signal:**
- ✅ Strong: Mentions composition first (not just Context/Redux), explains trade-offs of each solution
- ❌ Weak: Jumps straight to "use Redux" without considering simpler alternatives

---

### Q2: Context API vs Redux — when to use each? / Context API vs Redux — khi nào dùng? 🟡 Mid

**A:** They solve different problems despite both providing "global state":

| Criterion | Context API | Redux (Toolkit) |
|-----------|-------------|-----------------|
| **Purpose** | Dependency injection | State management |
| **Re-render** | All consumers on any change | Only selected slice via selectors |
| **Middleware** | None | Logger, thunk, saga, analytics |
| **DevTools** | React DevTools (basic) | Redux DevTools (time-travel!) |
| **Selector** | No built-in selector | `createSelector` with memoization |
| **Bundle** | 0KB (built-in) | ~11KB gzip |

**Decision rule:**
- **Context**: Theme, locale, auth token — data that changes rarely and is read by many
- **Redux**: Shopping cart, complex form wizard, real-time dashboard — data with complex update logic and frequent changes

```typescript
// ❌ Anti-pattern: Context for frequently-updated state
<CartContext.Provider value={{ items, addItem, removeItem }}>
  {/* ALL consumers re-render when any item changes */}
</CartContext.Provider>

// ✅ Zustand/Redux: fine-grained subscription
const count = useCartStore(state => state.items.length); // only this re-renders
```

Giải thích tiếng Việt: Context là mechanism truyền data (dependency injection), Redux là state management library. Khác biệt quan trọng nhất: Context re-render TẤT CẢ consumers khi value thay đổi, Redux chỉ re-render components mà selected data thay đổi. Dùng Context cho data ít thay đổi (theme, locale), Redux/Zustand cho state phức tạp thay đổi thường xuyên.

**💡 Interview Signal:**
- ✅ Strong: Frames Context as DI (not state management), explains re-render difference with specific example
- ❌ Weak: Only compares API surface without understanding the re-render implication

---

### Q3: How does Redux middleware work? Implement a custom middleware. / Redux middleware hoạt động thế nào? Implement custom middleware. 🟡 Mid

**A:** Middleware is a chain of higher-order functions that intercept actions between dispatch and reducer. Signature: `store => next => action => result`.

```typescript
// Middleware chain visualization:
// dispatch(action)
//   → logger(action)
//     → thunk(action)
//       → analytics(action)
//         → reducer(state, action) → new state

// ✅ Custom: API error handler middleware
const apiErrorMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action); // let action reach reducer first

  // Check if any async thunk was rejected
  if (action.type?.endsWith('/rejected')) {
    const { status } = action.payload || {};

    if (status === 401) {
      store.dispatch(logout());        // force logout
      store.dispatch(showToast({ message: 'Session expired', type: 'error' }));
    } else if (status === 503) {
      store.dispatch(showToast({ message: 'Service unavailable', type: 'warning' }));
    }
  }

  return result;
};

// ✅ Custom: analytics middleware
const analyticsMiddleware: Middleware = () => (next) => (action) => {
  if (action.type === 'cart/addItem') {
    analytics.track('item_added', {
      productId: action.payload.id,
      price: action.payload.price
    });
  }
  return next(action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) =>
    getDefault().concat(apiErrorMiddleware, analyticsMiddleware)
});
```

**Key insight**: `next(action)` passes to the NEXT middleware (not the reducer directly). Only the last middleware passes to the reducer. This is the **chain of responsibility** pattern — same as Express middleware.

Giải thích tiếng Việt: Middleware là chuỗi HOF (Higher-Order Functions) chặn actions giữa dispatch và reducer. Mỗi middleware nhận `store`, trả về function nhận `next` (middleware tiếp theo), trả về function nhận `action`. Gọi `next(action)` để chuyển action xuống chain. Real-world use: error handling (401 → logout), analytics tracking, logging.

**💡 Interview Signal:**
- ✅ Strong: Shows practical middleware (error handler, analytics), explains chain of responsibility pattern
- ❌ Weak: Only shows logger middleware, can't explain `next` vs `dispatch` difference

---

### Q4: Design a state management solution for a large e-commerce app. What would you choose and why? / Thiết kế state management cho app e-commerce lớn. Chọn gì? 🔴 Senior

**A:** I'd split by **state type** — no single solution handles all cases:

```
E-commerce State Architecture:

┌─────────────────────────────────────────────────┐
│                   State Types                    │
├──────────────┬────────────────┬─────────────────┤
│ Server State │  Client State  │ Cross-cutting   │
│              │                │                 │
│ TanStack     │  Zustand       │ React Context   │
│ Query        │                │                 │
│              │                │                 │
│ • Products   │ • Cart (local) │ • Theme         │
│ • Orders     │ • UI state     │ • Locale (i18n) │
│ • User data  │ • Form wizard  │ • Auth token    │
│ • Reviews    │ • Filters/sort │ • Feature flags │
│              │ • Modals       │                 │
│ Cache +      │ Fine-grained   │ Read-mostly,    │
│ revalidation │ subscriptions  │ rare updates    │
└──────────────┴────────────────┴─────────────────┘
```

```typescript
// Server state: TanStack Query (caching, dedup, background refetch)
const { data: products, isLoading } = useQuery({
  queryKey: ['products', { category, page }],
  queryFn: () => fetchProducts({ category, page }),
  staleTime: 5 * 60 * 1000, // 5min cache
});

// Client state: Zustand (fine-grained, persistent cart)
const useCartStore = create(
  persist(
    immer((set) => ({
      items: [],
      addItem: (item) => set(s => { s.items.push(item); }),
    })),
    { name: 'cart' }
  )
);

// Cross-cutting: Context (theme/locale — rarely changes)
const ThemeContext = createContext<'light' | 'dark'>('light');
```

**Why NOT Redux for everything?**
- Products/orders = server state → TanStack Query handles caching, revalidation, pagination, optimistic updates out of the box. Replicating this in Redux requires RTK Query (which IS good, but adds complexity).
- Cart = client-only → Zustand at 1.2KB with persist middleware. Redux Toolkit works too but is 10x the bundle for this use case.
- Theme/locale → Context is perfect: changes rarely, read by many, 0KB.

**Why NOT Zustand for everything?**
- Zustand doesn't have built-in request deduplication, background refetching, or stale-while-revalidate. For server state, TanStack Query is purpose-built.

Giải thích tiếng Việt: Không có "1 tool cho mọi thứ". Chia state theo loại: Server state (products, orders) → TanStack Query (cache, revalidation). Client state (cart, UI) → Zustand (nhẹ, fine-grained). Cross-cutting (theme, locale) → Context (built-in, 0KB). Redux Toolkit vẫn tốt cho client state phức tạp, nhưng Zustand đủ cho 90% e-commerce cases.

**💡 Interview Signal:**
- ✅ Strong: Splits by state type, justifies each choice with specific tradeoffs, mentions what each tool does NOT handle
- ❌ Weak: Answers "I'd use Redux for everything" or "I'd use Zustand for everything" without nuance

---

### Q5: Implement optimistic update in a state management system. / Implement optimistic update trong state management. 🔴 Senior

**A:** Optimistic update = update UI immediately, then sync with server. If server fails, rollback.

```typescript
// ✅ Zustand: optimistic delete with rollback
const useTodoStore = create<TodoStore>()(
  immer((set, get) => ({
    todos: [] as Todo[],

    deleteTodo: async (id: string) => {
      // 1. Snapshot for rollback
      const previousTodos = get().todos;

      // 2. Optimistic: remove immediately
      set((state) => {
        state.todos = state.todos.filter(t => t.id !== id);
      });

      try {
        // 3. Sync with server
        await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      } catch (error) {
        // 4. Rollback on failure
        set({ todos: previousTodos });
        toast.error('Failed to delete, restored');
      }
    }
  }))
);

// ✅ TanStack Query: built-in optimistic update
const deleteTodoMutation = useMutation({
  mutationFn: (id: string) => fetch(`/api/todos/${id}`, { method: 'DELETE' }),

  onMutate: async (id) => {
    // Cancel in-flight queries to prevent overwrite
    await queryClient.cancelQueries({ queryKey: ['todos'] });

    // Snapshot
    const previous = queryClient.getQueryData<Todo[]>(['todos']);

    // Optimistic remove
    queryClient.setQueryData<Todo[]>(['todos'], (old) =>
      old?.filter(t => t.id !== id)
    );

    return { previous }; // context for rollback
  },

  onError: (_err, _id, context) => {
    // Rollback
    queryClient.setQueryData(['todos'], context?.previous);
  },

  onSettled: () => {
    // Refetch to ensure server/client sync
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  }
});
```

**Key pattern**: Snapshot → Optimistic update → Try server → Rollback on error → Refetch to sync.

TanStack Query's `onMutate`/`onError`/`onSettled` lifecycle handles this elegantly. The `cancelQueries` call prevents a stale fetch from overwriting our optimistic update.

Giải thích tiếng Việt: Optimistic update = cập nhật UI ngay lập tức (không chờ server), nếu server fail thì rollback. Pattern: Snapshot → Update ngay → Gọi server → Error thì rollback → Success thì refetch để sync. TanStack Query có lifecycle `onMutate`/`onError`/`onSettled` xử lý elegant. Key: luôn `cancelQueries` trước để prevent stale fetch overwrite optimistic data.

**💡 Interview Signal:**
- ✅ Strong: Shows snapshot/rollback pattern, mentions `cancelQueries`, handles both Zustand and TanStack Query approaches
- ❌ Weak: Only shows "update then fetch" without rollback or race condition handling

---

## Interview Q&A Summary / Tổng Kết Q&A

| # | Topic | Difficulty | Key Concept |
|---|-------|-----------|-------------|
| Q1 | Prop drilling solutions | 🟢 Junior | Composition > Context > External store |
| Q2 | Context vs Redux | 🟡 Mid | DI vs state management, re-render scope |
| Q3 | Redux middleware | 🟡 Mid | Chain of responsibility, `store => next => action` |
| Q4 | Architecture design | 🔴 Senior | Split by state type: server/client/cross-cutting |
| Q5 | Optimistic updates | 🔴 Senior | Snapshot → optimistic → server → rollback |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"How would you choose a state management solution for a new React project?"**

**30 giây đầu — mở đầu lý tưởng:**
1. "I'd start by categorizing the state: server state (API data) goes to TanStack Query for automatic caching and revalidation, client state goes to Zustand or Redux, and cross-cutting concerns like theme use React Context."
2. "Context is ideal for low-frequency data because it re-renders ALL consumers on any change — it lacks a selector mechanism, so it's poor for frequently-updated state."
3. "For client state, Zustand is my default — it provides Redux-like fine-grained subscriptions at 1KB, without Provider boilerplate. I'd reach for Redux Toolkit when I need time-travel debugging or complex middleware chains."
4. "The biggest mistake I've seen is using one tool for everything — putting API cache in Redux misses TanStack Query's stale-while-revalidate, while using Context for cart state causes unnecessary re-renders across the entire app."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| # | Loại | Câu hỏi |
|---|------|---------|
| 1 | 🔍 Retrieval | Khi nào dùng Context, khi nào Redux, khi nào Zustand? Viết 1 câu cho mỗi cái với ví dụ cụ thể. |
| 2 | 🎨 Visual | Vẽ data flow diagram của Redux: Action → Middleware → Reducer → Store → Component (subscribe). Thêm async action dùng Thunk. |
| 3 | 🛠️ Application | Cart Context đang re-render toàn bộ app khi thêm item. Viết code refactor sang Zustand để giải quyết vấn đề này. |
| 4 | 🐛 Debug | `useSelector(() => state.todos.filter(t => !t.done))` gây re-render liên tục. Tại sao? Cách fix với `createSelector`. |
| 5 | 🎓 Teach | Giải thích prop drilling cho người mới học React — dùng ví dụ "truyền thư trong lớp học" để minh họa vấn đề. |

### Key Points (tự kiểm tra)

| # | Key Point |
|---|-----------|
| 1 | Context: theme, locale, auth user (ít update, nhiều consumers). Redux: complex state logic, time-travel debug, large team. Zustand: app state đơn giản hơn Redux, less boilerplate. |
| 2 | Component → `dispatch(action)` → Middleware (Thunk: resolve async) → Reducer (pure function) → Store (immutable update) → Component re-render (selector). |
| 3 | `const useCart = create<CartStore>(set => ({ items: [], addItem: (item) => set(s => ({ items: [...s.items, item] })) }))`. Chỉ subscriber của slice đó re-render. |
| 4 | `filter()` tạo new array reference mỗi lần → selector return value !== previous → re-render vô hạn. Fix: `createSelector([s => s.todos], todos => todos.filter(t => !t.done))`. |
| 5 | Prop drilling = truyền thư qua nhiều bàn: A → B → C → D dù B và C không cần. Giải pháp: Context (bảng thông báo chung) hoặc state management library. |

> 🎯 **Feynman Prompt:** Giải thích khác biệt giữa Context và Redux bằng ví dụ "đài phát thanh vs email". Không dùng thuật ngữ kỹ thuật.
🔁 **Spaced Repetition reminder:** Review this file again on 2026-03-22, then 2026-03-26, then 2026-04-02.

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)
- [Hooks Deep Dive](./03-hooks-deep-dive.md) — useReducer and Context as lightweight state
- [Advanced Patterns](./04-advanced-patterns.md) — compound components encapsulate shared state
- [Performance Optimization](./09-performance-optimization.md) — state shape drives re-render frequency
- [React Fundamentals](./01-react-fundamentals.md) — component state model to build on

### Khác track (Cross-track)
- [React TypeScript](../02-typescript/05-react-typescript.md) — typing Zustand stores and Redux slices
- [Architecture Styles](../../shared/05-software-engineering/02-architecture-styles.md) — flux/unidirectional data flow architecture
- [SOLID & Design Patterns](../../shared/05-software-engineering/01-solid-and-design-patterns.md) — Observer pattern behind store subscriptions
