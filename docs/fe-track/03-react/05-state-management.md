# State Management in React / Quản lý State trong React

| Field               | Value                                                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| **Track**           | Frontend — React                                                                                     |
| **Difficulty**      | 🟡 Intermediate → 🔴 Advanced                                                                        |
| **Prerequisites**   | 03-hooks-deep-dive (useState, useReducer, useContext)                                                |
| **See also**        | 04-advanced-patterns, 09-performance-optimization                                                    |
| **L5 Competencies** | System Design (state architecture), Performance (re-render prevention), API Design (store interface) |

---

## 🎬 Real-World Scenario / Tình huống thực tế

> Bạn đang xây app e-commerce. Trang product list cần biết user đã login chưa (để show giá member).
> Cart icon ở header cần biết số lượng sản phẩm. Checkout page cần cả thông tin user, cart, và shipping.
>
> Ban đầu bạn dùng `useState` ở App rồi truyền xuống qua 5 tầng component.
> Thêm 1 feature → phải sửa props ở 5 file. Thay đổi cart → toàn bộ app re-render.
>
> **Đây là lúc bạn cần hiểu State Management — không phải vì nó "cool", mà vì prop drilling đang giết productivity và performance.**

---

## 💡 What & Why / Cái gì & Tại sao

**Analogy — Hệ thống liên lạc trong công ty / Company Communication System:**

Tưởng tượng công ty có 50 nhân viên:

- **Không có state management** = mọi thông báo phải truyền miệng từ giám đốc → trưởng phòng → nhóm trưởng → nhân viên. Mỗi lần thay đổi, phải đi qua hết chuỗi. Đó là **prop drilling**.
- **Context API** = loa phát thanh toàn công ty. Ai cũng nghe được, nhưng khi phát 1 thông báo → **tất cả** đều phải dừng lại nghe, kể cả phòng không liên quan.
- **Redux/Zustand** = hệ thống email nội bộ với subscription. Chỉ người đăng ký topic cụ thể mới nhận mail. Phòng kế toán subscribe "finance", không nhận mail "engineering".

**Core insight:** State management giải quyết 2 vấn đề: (1) data cần dùng ở nhiều nơi, (2) chỉ component cần data mới re-render khi data thay đổi.

---

## 🗺️ Concept Map / Bản đồ khái niệm

```
                    State Management
                         |
          +--------------+--------------+
          |              |              |
     Local State    Shared State   Server State
     (useState)         |          (TanStack Query)
                        |
            +-----------+-----------+
            |           |           |
        Context API   Redux     Modern Libs
        (built-in)  (verbose)   (Zustand/Jotai)
            |           |           |
     Re-render ALL   Selective   Selective
     consumers      subscribe   subscribe
            |           |           |
        Small apps   Large apps  Medium apps
        + themes     + complex   + simple API
                      logic
```

---

## 📖 Overview / Tổng quan

State management trong React có 3 tầng cần hiểu:

1. **Context API** — built-in, đơn giản, nhưng có vấn đề re-render. Phù hợp cho data ít thay đổi (theme, locale, auth status).
2. **Redux** — external library, verbose nhưng mạnh. Có middleware, devtools, time-travel debugging. Phù hợp cho app lớn với complex state logic.
3. **Modern alternatives (Zustand, Jotai)** — giải quyết cùng vấn đề với API đơn giản hơn Redux 10 lần. Selective subscription built-in.

Quan trọng nhất: **không có "best" solution — chỉ có solution phù hợp với complexity của app.**

---

## 🧩 Core Concepts / Khái niệm cốt lõi

### Concept 1: Context API & The Re-render Problem / Context API & Vấn đề Re-render

🧠 **Memory Hook:** "Context = loa phát thanh — ai cũng nghe, ai cũng phải dừng lại"

#### Why does this exist? / Tại sao cần?

**Level 1 — Immediate:** React không có cách truyền data "xuyên tầng" mặc định. Props chỉ truyền parent → child.

**Level 2 — Root cause:** Component tree của React là hierarchical (cây). Data flow là unidirectional (một chiều). Khi 2 component ở nhánh khác nhau cần cùng data, ancestor chung phải hold state đó → prop drilling.

#### Layer 1: Analogy — Loa phát thanh công ty / Company PA System

```
Không có Context (prop drilling):
  CEO biết "có meeting 2pm"
  → CEO nói cho VP
    → VP nói cho Director
      → Director nói cho Manager
        → Manager nói cho Dev ← chỉ Dev cần biết!

Có Context:
  CEO phát loa: "Có meeting 2pm"
  → Tất cả 50 người đều nghe ← kể cả người không cần!
```

Context giải quyết prop drilling, nhưng tạo vấn đề mới: **mọi consumer đều re-render khi value thay đổi**.

#### Layer 2: How It Works / Cách hoạt động

```tsx
// 1. Tạo Context
const CartContext = createContext<CartState | null>(null);

// 2. Provider wrap ở trên
function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);

  const addItem = (item: Item) => {
    setItems((prev) => [...prev, item]);
    setTotal((prev) => prev + item.price);
  };

  return <CartContext.Provider value={{ items, total, addItem }}>{children}</CartContext.Provider>;
}

// 3. Consumer dùng ở dưới
function CartIcon() {
  const cart = useContext(CartContext); // ← subscribe toàn bộ value
  return <span>🛒 {cart?.items.length}</span>;
}

function CartTotal() {
  const cart = useContext(CartContext); // ← cũng subscribe toàn bộ
  return <span>Total: {cart?.total}</span>;
}
```

**Vấn đề re-render:**

```
Khi addItem() được gọi:

  CartProvider re-render (state changed)
    → Tạo object value MỚI: { items, total, addItem }
      → Reference thay đổi
        → TẤT CẢ useContext(CartContext) đều re-render
          → CartIcon re-render (chỉ cần items.length)
          → CartTotal re-render (chỉ cần total)
          → CartDetails re-render (cần items list)
          → UserGreeting re-render (chỉ cần username — KHÔNG CẦN cart!)
```

**Giải pháp: Split Context**

```tsx
// Tách thành 2 context riêng
const CartItemsContext = createContext<Item[]>([]);
const CartTotalContext = createContext<number>(0);

function CartProvider({ children }) {
  const [items, setItems] = useState<Item[]>([]);
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartItemsContext.Provider value={items}>
      <CartTotalContext.Provider value={total}>{children}</CartTotalContext.Provider>
    </CartItemsContext.Provider>
  );
}

// Giờ CartTotal chỉ re-render khi total thay đổi
function CartTotal() {
  const total = useContext(CartTotalContext); // ← chỉ subscribe total
  return <span>Total: {total}</span>;
}
```

#### Layer 3: Edge Cases / Trường hợp đặc biệt

1. **Provider value reference trap:**

```tsx
// ❌ BAD — tạo object mới mỗi render → all consumers re-render
<MyContext.Provider value={{ user, theme }}>

// ✅ GOOD — useMemo giữ reference stable
const value = useMemo(() => ({ user, theme }), [user, theme]);
<MyContext.Provider value={value}>
```

2. **Missing Provider = silent bug:**

```tsx
// Nếu quên wrap Provider, useContext trả về defaultValue
// defaultValue thường là null/undefined → crash lúc runtime
const ctx = useContext(CartContext); // → null nếu không có Provider
ctx.items.length; // 💥 TypeError: Cannot read property 'items' of null
```

3. **Context không selective subscribe được:**

```tsx
// Không có cách chỉ subscribe 1 field
const { total } = useContext(CartContext);
// ↑ Component vẫn re-render khi items thay đổi dù chỉ dùng total
```

#### ❌ Common Mistakes / Lỗi thường gặp

| ❌ Sai                                                          | ✅ Đúng                                             | 💡 Tại sao                            |
| --------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------- |
| Dùng Context cho state thay đổi thường xuyên (input, animation) | Dùng Zustand/Redux cho frequent updates             | Context re-render ALL consumers       |
| Tạo 1 mega-context chứa hết state                               | Split thành nhiều context nhỏ theo domain           | Giảm unnecessary re-renders           |
| Quên useMemo cho Provider value                                 | Luôn useMemo value nếu là object/array              | Reference mới = re-render tất cả      |
| Dùng Context thay cho props khi chỉ 1-2 tầng                    | Props cho short distance, Context cho cross-cutting | Over-engineering, khó trace data flow |

#### 🎯 Interview Pattern

> **Trigger:** "Context API re-render vấn đề gì?"
> **Concept:** Context không selective subscribe — khi value thay đổi, TẤT CẢ consumer re-render
> **Opening:** "Context API phát broadcast toàn bộ — bất kỳ thay đổi nào trong value đều trigger re-render ở tất cả consumer, kể cả component chỉ dùng 1 field không thay đổi."

#### 🔑 Knowledge Chain

📚 **Cần trước:** useContext hook (03-hooks), reference equality (JavaScript)
➡️ **Mở ra:** Redux/Zustand selective subscription, performance optimization

---

### Concept 2: Redux Architecture — Predictable State Container / Redux — Quản lý State dự đoán được

🧠 **Memory Hook:** "Redux = kế toán nghiêm khắc — mọi giao dịch phải có chứng từ (action), ghi sổ (reducer), lưu két sắt (store)"

#### Why does this exist? / Tại sao cần?

**Level 1 — Immediate:** App lớn có nhiều state phức tạp, nhiều component cần share state, cần debug được "ai thay đổi cái gì, lúc nào".

**Level 2 — Root cause:** Khi app scale lên, implicit state mutations (thay đổi state không trace được) là nguồn gốc của hầu hết bug. Redux enforce explicit, traceable state changes — mỗi thay đổi phải đi qua 1 pipeline rõ ràng.

#### Layer 1: Analogy — Kế toán ngân hàng / Bank Accounting

```
Bạn muốn rút tiền từ ngân hàng:

1. Bạn KHÔNG THỂ tự vào két lấy tiền (NO direct mutation)
2. Bạn phải viết phiếu rút tiền (dispatch ACTION)
   → { type: "WITHDRAW", amount: 500 }
3. Kế toán kiểm tra phiếu, tính số dư mới (REDUCER)
   → balance = 1000 - 500 = 500
4. Két sắt cập nhật (STORE update)
   → { balance: 500 }
5. Bảng điện tử hiển thị số dư mới (UI re-render)

Mọi giao dịch đều có LOG → bạn trace được lịch sử
```

#### Layer 2: How It Works / Cách hoạt động

```
Redux Data Flow (Unidirectional):

  UI ──dispatch──→ Action ──→ Middleware ──→ Reducer ──→ Store
  ↑                                                       |
  └───────────── selector subscribe ──────────────────────┘

  1. User click "Add to Cart"
  2. dispatch({ type: 'cart/addItem', payload: item })
  3. Middleware (thunk) có thể gọi API trước
  4. Reducer tính state mới: [...items, item]
  5. Store lưu state mới
  6. Component subscribe qua selector → re-render
```

```tsx
// Redux Toolkit — modern Redux (đừng dùng vanilla Redux nữa!)
import { createSlice, configureStore } from "@reduxjs/toolkit";

// 1. SLICE = reducer + actions gộp lại
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] as Item[], total: 0 },
  reducers: {
    addItem(state, action: PayloadAction<Item>) {
      // Immer cho phép "mutate" — thực tế tạo copy
      state.items.push(action.payload);
      state.total += action.payload.price;
    },
    removeItem(state, action: PayloadAction<string>) {
      const index = state.items.findIndex((i) => i.id === action.payload);
      if (index !== -1) {
        state.total -= state.items[index].price;
        state.items.splice(index, 1);
      }
    },
  },
});

// 2. STORE
const store = configureStore({
  reducer: { cart: cartSlice.reducer },
});

// 3. SELECTOR — chỉ subscribe field cần thiết
const selectCartItems = (state: RootState) => state.cart.items;
const selectCartTotal = (state: RootState) => state.cart.total;
const selectCartCount = (state: RootState) => state.cart.items.length;

// 4. COMPONENT — selective subscription tự động
function CartIcon() {
  const count = useSelector(selectCartCount);
  // ↑ CHỈ re-render khi items.length thay đổi, không phải khi total thay đổi
  return <span>🛒 {count}</span>;
}

function CartTotal() {
  const total = useSelector(selectCartTotal);
  // ↑ CHỈ re-render khi total thay đổi
  return <span>${total}</span>;
}

// 5. DISPATCH
function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(cartSlice.actions.addItem(product))}>Add to Cart</button>;
}
```

**Middleware — xử lý async logic:**

```tsx
// createAsyncThunk cho API calls
const fetchProducts = createAsyncThunk("products/fetch", async (category: string) => {
  const res = await fetch(`/api/products?cat=${category}`);
  return res.json(); // payload cho fulfilled action
});

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      });
  },
});
```

#### Layer 3: Edge Cases / Trường hợp đặc biệt

1. **Selector reference trap:**

```tsx
// ❌ Tạo array mới mỗi lần → component luôn re-render
const items = useSelector((state) => state.cart.items.filter((i) => i.active));

// ✅ Dùng createSelector (memoized selector)
const selectActiveItems = createSelector(
  (state: RootState) => state.cart.items,
  (items) => items.filter((i) => i.active), // chỉ tính lại khi items thay đổi
);
```

2. **Normalized state cho nested data:**

```tsx
// ❌ Nested structure → khó update, phải deep clone
{ posts: [{ id: 1, comments: [{ id: 1, author: { id: 1, name: '...' }}]}]}

// ✅ Normalized (flat) → update O(1)
{
  posts: { byId: { 1: { id: 1, commentIds: [1] } } },
  comments: { byId: { 1: { id: 1, authorId: 1 } } },
  users: { byId: { 1: { id: 1, name: '...' } } },
}
```

3. **RTK Query — tránh manual async hoàn toàn:**

```tsx
// RTK Query = TanStack Query cho Redux
const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], string>({
      query: (category) => `products?cat=${category}`,
    }),
  }),
});
// Auto-generates hooks: useGetProductsQuery
```

#### ❌ Common Mistakes / Lỗi thường gặp

| ❌ Sai                                                     | ✅ Đúng                                                      | 💡 Tại sao                                   |
| ---------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------- |
| Dùng vanilla Redux (switch/case, action creators thủ công) | Dùng Redux Toolkit (createSlice, configureStore)             | RTK giảm boilerplate 80%, có Immer built-in  |
| Đặt MỌI state vào Redux                                    | Chỉ shared/complex state vào Redux, local state giữ useState | Form input state không cần global            |
| Selector tạo reference mới mỗi call                        | createSelector cho derived data                              | Tránh unnecessary re-renders                 |
| Gọi API trực tiếp trong component rồi dispatch             | Dùng createAsyncThunk hoặc RTK Query                         | Middleware xử lý loading/error/cache tự động |

#### 🎯 Interview Pattern

> **Trigger:** "Giải thích Redux data flow"
> **Concept:** Unidirectional: UI → dispatch(action) → middleware → reducer → store → selector → UI
> **Opening:** "Redux enforce one-way data flow: component dispatch action, middleware xử lý side effects, reducer tính pure state mới, store lưu và notify subscriber qua selector."

#### 🔑 Knowledge Chain

📚 **Cần trước:** useReducer pattern (03-hooks), immutability concept
➡️ **Mở ra:** Middleware patterns, RTK Query, state normalization

---

### Concept 3: Modern Alternatives — Zustand & Jotai / Giải pháp hiện đại

🧠 **Memory Hook:** "Zustand = Google Docs — ai cần gì subscribe đó, không cần ceremony"

#### Why does this exist? / Tại sao cần?

**Level 1 — Immediate:** Redux quá verbose cho app vừa và nhỏ. Context có vấn đề re-render. Cần giải pháp đơn giản hơn.

**Level 2 — Root cause:** Redux được thiết kế cho era trước hooks — action/reducer/middleware pattern là overkill cho nhiều use case. Modern libraries tận dụng hooks + proxy/subscription pattern để cho API tối giản nhưng vẫn selective re-render.

#### Layer 1: Analogy — Google Docs vs ERP System

```
Redux = ERP (SAP) Enterprise:
  - Mỗi thay đổi phải qua quy trình phê duyệt (action → middleware → reducer)
  - Cần training 3 tháng để dùng
  - Nhưng audit trail hoàn hảo
  - Phù hợp công ty 10,000 người

Zustand = Google Docs:
  - Tạo doc, share link, ai cần thì edit
  - Học 5 phút là dùng được
  - Vẫn có version history
  - Phù hợp team 5-50 người

Jotai = Sticky notes:
  - Mỗi note là 1 atom (đơn vị state nhỏ nhất)
  - Ai cần note nào thì đọc note đó
  - Không cần store, không cần provider
  - Phù hợp khi state independent với nhau
```

#### Layer 2: How It Works / Cách hoạt động

**Zustand — Store-based, minimal API:**

```tsx
import { create } from "zustand";

// Tạo store — chỉ 1 function, xong.
const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,

  addItem: (item: Item) =>
    set((state) => ({
      items: [...state.items, item],
      total: state.total + item.price,
    })),

  removeItem: (id: string) => {
    const items = get().items.filter((i) => i.id !== id);
    set({
      items,
      total: items.reduce((sum, i) => sum + i.price, 0),
    });
  },

  clearCart: () => set({ items: [], total: 0 }),
}));

// Dùng trong component — selective subscription tự động!
function CartIcon() {
  const count = useCartStore((state) => state.items.length);
  // ↑ CHỈ re-render khi items.length thay đổi
  return <span>🛒 {count}</span>;
}

function CartTotal() {
  const total = useCartStore((state) => state.total);
  // ↑ CHỈ re-render khi total thay đổi
  return <span>${total}</span>;
}

function AddButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  // ↑ addItem reference stable → component KHÔNG re-render khi cart thay đổi
  return <button onClick={() => addItem(product)}>Add</button>;
}
```

**So sánh Zustand vs Redux:**

```
Feature            | Redux Toolkit        | Zustand
-------------------+----------------------+------------------
Setup              | configureStore +     | create() — 1 hàm
                   | createSlice +        |
                   | Provider wrapper     |
Boilerplate        | Medium (improved     | Minimal
                   | from vanilla)        |
Async              | createAsyncThunk     | Gọi trực tiếp trong action
                   | hoặc RTK Query       |
Selective sub      | useSelector +        | Built-in qua selector
                   | createSelector       |
DevTools           | Redux DevTools       | devtools middleware
Bundle size        | ~11kB                | ~1.5kB
Provider required  | Yes (<Provider>)     | No
```

**Jotai — Atomic state management:**

```tsx
import { atom, useAtom } from "jotai";

// Atoms = đơn vị state nhỏ nhất
const itemsAtom = atom<Item[]>([]);
const totalAtom = atom((get) => {
  // derived atom — tự tính từ itemsAtom
  return get(itemsAtom).reduce((sum, i) => sum + i.price, 0);
});

function CartIcon() {
  const [items] = useAtom(itemsAtom);
  return <span>🛒 {items.length}</span>;
}

function CartTotal() {
  const [total] = useAtom(totalAtom);
  // ↑ Chỉ re-render khi total thay đổi (derived)
  return <span>${total}</span>;
}
```

**Khi nào dùng gì — Decision Framework:**

```
                    Cần state management?
                          |
                    Data từ server?
                   /              \
                 Yes               No
                  |                 |
            TanStack Query    Bao nhiêu component share?
            (server state)    /          |            \
                           1-2         3-10          10+
                            |           |             |
                        useState     Zustand      Redux hoặc
                        + props      hoặc         Zustand
                                     Jotai
                                                     |
                                              Cần middleware/
                                              devtools mạnh?
                                              /            \
                                            Yes            No
                                             |              |
                                           Redux         Zustand
```

| Giải pháp            | Dùng khi                                      | KHÔNG dùng khi                              |
| -------------------- | --------------------------------------------- | ------------------------------------------- |
| **useState + props** | State local, 1-2 tầng                         | Prop drilling > 3 tầng                      |
| **Context API**      | Theme, locale, auth (ít thay đổi)             | Frequent updates (typing, animation)        |
| **Zustand**          | Shared state, medium app, cần simple API      | Cần strict architecture cho team lớn        |
| **Jotai**            | Independent atoms, derived state, async atoms | Tightly coupled state cần centralized logic |
| **Redux Toolkit**    | Large app, complex async, cần devtools mạnh   | Small/medium app — overkill                 |
| **TanStack Query**   | Server state (API data + cache + sync)        | Client-only state (UI state, form state)    |

#### Layer 3: Edge Cases / Trường hợp đặc biệt

1. **Zustand with Immer cho complex nested state:**

```tsx
import { immer } from "zustand/middleware/immer";

const useStore = create(
  immer<State>((set) => ({
    deeply: { nested: { value: 0 } },
    increment: () =>
      set((state) => {
        state.deeply.nested.value++;
      }),
  })),
);
```

2. **Zustand persist middleware:**

```tsx
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist<CartState>(
    (set) => ({ items: [], addItem: (item) => set(/*...*/) }),
    { name: "cart-storage" }, // → localStorage key
  ),
);
```

3. **Server state ≠ Client state — đừng nhầm:**

```
Server state: API data, cần cache/invalidation/background refresh
  → TanStack Query / RTK Query / SWR

Client state: UI state (modal open, selected tab, theme)
  → useState / Zustand / Context
```

#### ❌ Common Mistakes / Lỗi thường gặp

| ❌ Sai                                             | ✅ Đúng                                         | 💡 Tại sao                                                  |
| -------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------- |
| Đặt server data (API response) vào Redux/Zustand   | Dùng TanStack Query cho server state            | Server state cần cache, refetch, invalidation — TQ built-in |
| Dùng Redux cho TODO app                            | useState hoặc Zustand                           | Redux overkill cho app nhỏ                                  |
| Copy toàn bộ store: `const store = useCartStore()` | Select từng field: `useCartStore(s => s.total)` | Copy toàn bộ = re-render mọi thay đổi                       |
| Dùng Context cho form state (typing mỗi keystroke) | useState local hoặc React Hook Form             | Context re-render ALL consumers mỗi keystroke               |

#### 🎯 Interview Pattern

> **Trigger:** "So sánh Redux vs Zustand vs Context"
> **Concept:** Tradeoff giữa complexity, bundle size, re-render behavior, và developer experience
> **Opening:** "Context broadcast all consumers, Redux cho selective subscription nhưng verbose, Zustand cho selective subscription với API tối giản. Chọn dựa trên app size, team size, và complexity of state logic."

#### 🔑 Knowledge Chain

📚 **Cần trước:** Context API re-render problem, useReducer
➡️ **Mở ra:** State architecture design, performance optimization

---

### Concept 4: Server State vs Client State / State từ Server vs State trên Client

🧠 **Memory Hook:** "Server state = thư viện sách — bạn chỉ mượn bản copy, bản gốc nằm ở server"

#### Why does this exist? / Tại sao cần?

**Level 1 — Immediate:** Nhiều dev đặt API response vào Redux/Zustand rồi tự quản lý loading/error/cache. Code phình ra, bug nhiều.

**Level 2 — Root cause:** API data có đặc tính khác hẳn UI state: nó có source of truth nằm ngoài app (server), cần caching, background refetching, invalidation khi stale. Quản lý bằng client state tool = reinvent the wheel poorly.

#### Layer 1: Analogy — Thư viện vs Tủ sách cá nhân

```
Client State (Zustand/Redux) = tủ sách cá nhân:
  - Bạn sở hữu mỗi cuốn sách
  - Bạn quyết định thêm/bớt
  - Không ai thay đổi ngoài bạn

Server State (TanStack Query) = thư viện công cộng:
  - Bạn chỉ MƯỢN sách (cache)
  - Sách có thể được cập nhật (stale data)
  - Cần kiểm tra phiên bản mới (refetch)
  - Có thể hết sách (loading/error)
  - Nhiều người cùng mượn (shared cache)
```

#### Layer 2: How It Works / Cách hoạt động

```tsx
// TanStack Query — quản lý server state
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// GET — fetching data
function ProductList({ category }: { category: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", category], // cache key
    queryFn: () => fetch(`/api/products?cat=${category}`).then((r) => r.json()),
    staleTime: 5 * 60 * 1000, // data "fresh" trong 5 phút
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return (
    <ul>
      {data?.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </ul>
  );
}

// POST/PUT — mutating data
function AddToCart({ product }: { product: Product }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (item: Product) =>
      fetch("/api/cart", { method: "POST", body: JSON.stringify(item) }),
    onSuccess: () => {
      // Invalidate cache → tự refetch
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return (
    <button onClick={() => mutation.mutate(product)} disabled={mutation.isPending}>
      {mutation.isPending ? "Adding..." : "Add to Cart"}
    </button>
  );
}
```

**TanStack Query lifecycle:**

```
Component mount
  → Check cache cho queryKey ['products', 'electronics']
    → Cache MISS? → fetch API → lưu cache → render data
    → Cache HIT?
      → Data fresh (< staleTime)? → render ngay, KHÔNG fetch
      → Data stale (> staleTime)? → render cache NGAY + fetch background
        → Fetch xong → update cache → re-render với data mới
```

#### Layer 3: Edge Cases / Trường hợp đặc biệt

1. **Optimistic updates — update UI trước khi server respond:**

```tsx
const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ["todos"] });
    const previous = queryClient.getQueryData(["todos"]);
    queryClient.setQueryData(["todos"], (old) => [...old, newTodo]); // optimistic
    return { previous }; // context for rollback
  },
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(["todos"], context?.previous); // rollback
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] }); // always refetch
  },
});
```

2. **Dependent queries:**

```tsx
const { data: user } = useQuery({ queryKey: ["user"], queryFn: getUser });
const { data: orders } = useQuery({
  queryKey: ["orders", user?.id],
  queryFn: () => getOrders(user!.id),
  enabled: !!user?.id, // chỉ fetch khi có user
});
```

#### ❌ Common Mistakes / Lỗi thường gặp

| ❌ Sai                                               | ✅ Đúng                                  | 💡 Tại sao                                        |
| ---------------------------------------------------- | ---------------------------------------- | ------------------------------------------------- |
| Lưu API data vào Redux + tự quản lý loading/error    | Dùng TanStack Query                      | TQ auto-handle cache, refetch, loading, error     |
| staleTime: 0 (default) cho data ít thay đổi          | Set staleTime phù hợp (5-30 phút)        | Tránh unnecessary refetch                         |
| Dùng TanStack Query cho UI state (modal open, theme) | Dùng useState/Zustand cho client state   | TQ cho server state — có cache/invalidation logic |
| Quên invalidate sau mutation                         | Luôn invalidateQueries hoặc setQueryData | Stale data after mutation                         |

#### 🎯 Interview Pattern

> **Trigger:** "Làm sao quản lý API data trong React?"
> **Concept:** Server state ≠ Client state — dùng tool riêng (TanStack Query) cho data từ server
> **Opening:** "Server state có source of truth nằm ngoài app, cần caching và background sync. TanStack Query quản lý lifecycle hoàn chỉnh: loading, error, cache, stale, refetch — thay vì tự build bằng useEffect + useState."

#### 🔑 Knowledge Chain

📚 **Cần trước:** useEffect cho data fetching, cache concepts
➡️ **Mở ra:** Optimistic updates, infinite scroll, SSR prefetch

---

### Concept 5: State Architecture Design / Thiết kế kiến trúc State

🧠 **Memory Hook:** "State architecture = sơ đồ điện nhà — phải quy hoạch TRƯỚC khi xây, không phải nối dây bừa"

#### Why does this exist? / Tại sao cần?

**Level 1 — Immediate:** Khi app lớn, state nằm khắp nơi — Redux cho một phần, Context cho phần khác, useState rải rác → không ai biết data flow như thế nào.

**Level 2 — Root cause:** State management là architectural decision, không phải library choice. Không có quy hoạch → mỗi dev chọn giải pháp khác nhau → state spaghetti.

#### Layer 1: Analogy — Quy hoạch thành phố

```
State architecture = urban planning:

  Nước (Server state)    → TanStack Query
  = từ nhà máy nước      = data từ API, có nguồn cung cấp

  Điện (Client state)    → Zustand/Redux
  = từ nhà máy điện      = state do app tạo ra, app quản lý

  Đèn phòng (Local state) → useState
  = công tắc trong phòng  = chỉ phòng đó cần

  Loa phát thanh (Context) → Context API
  = thông báo toàn khu     = theme, locale, ít thay đổi
```

#### Layer 2: How It Works / Cách hoạt động

**Phân loại state theo source & scope:**

```
                    Scope
              Local ←────→ Global
              │              │
  Source:     │              │
  Client ─────┤  useState    │  Zustand/Redux
  (UI)        │  useReducer  │  (shared UI state)
              │              │
  Server ─────┤  Component   │  TanStack Query
  (API)       │  fetch       │  (cached server state)
              │              │
  URL ────────┤  useParams   │  Router state
  (Browser)   │              │  (searchParams)
              │              │
  Form ───────┤  RHF         │  Form library
  (Input)     │  useForm     │  (validation + state)
```

**Ví dụ e-commerce app:**

```tsx
// 1. Server State — TanStack Query
const { data: products } = useQuery({ queryKey: ["products"], queryFn: getProducts });
const { data: user } = useQuery({ queryKey: ["user"], queryFn: getUser });

// 2. Client State — Zustand (shared across components)
const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  activeFilter: "all",
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setFilter: (filter: string) => set({ activeFilter: filter }),
}));

// 3. URL State — Router
// /products?category=shoes&sort=price
const [searchParams, setSearchParams] = useSearchParams();
const category = searchParams.get("category");

// 4. Local State — useState
function ProductCard({ product }) {
  const [isExpanded, setIsExpanded] = useState(false); // chỉ card này cần
  // ...
}

// 5. Form State — React Hook Form
function CheckoutForm() {
  const { register, handleSubmit } = useForm<CheckoutData>();
  // ...
}
```

#### Layer 3: Edge Cases

1. **State colocation — đưa state gần nơi dùng nhất:**

```tsx
// ❌ Cart filter state ở global store — chỉ CartPage dùng
const useStore = create((set) => ({
  cartFilter: "all", // chỉ dùng ở 1 component!
}));

// ✅ Colocate — đặt ở component dùng nó
function CartPage() {
  const [filter, setFilter] = useState("all"); // local là đủ
}
```

2. **Derived state — tính toán, KHÔNG lưu trữ:**

```tsx
// ❌ Lưu cả items VÀ total — phải sync manual
{ items: [...], total: 150 }

// ✅ Chỉ lưu items, total là derived
const total = useMemo(
  () => items.reduce((sum, i) => sum + i.price, 0),
  [items]
);
```

#### ❌ Common Mistakes / Lỗi thường gặp

| ❌ Sai                                   | ✅ Đúng                                 | 💡 Tại sao                           |
| ---------------------------------------- | --------------------------------------- | ------------------------------------ |
| Mọi state vào 1 global store             | Phân loại: server/client/local/URL/form | Mỗi loại có đặc tính và tool phù hợp |
| Lưu derived state (total, filtered list) | Tính lại từ source state                | Tránh sync bugs                      |
| Global state cho local concern           | State colocation — đặt gần nơi dùng     | Giảm coupling, dễ maintain           |
| Chọn library trước khi hiểu requirement  | Phân tích state characteristics trước   | Avoid over/under-engineering         |

#### 🎯 Interview Pattern

> **Trigger:** "Thiết kế state architecture cho app lớn"
> **Concept:** Classify state by source (server/client/URL/form) × scope (local/global), then pick tool per category
> **Opening:** "Tôi phân loại state thành 4 nguồn: server state dùng TanStack Query, shared client state dùng Zustand, URL state dùng router, local UI state giữ useState. Không dùng 1 tool cho tất cả."

#### 🔑 Knowledge Chain

📚 **Cần trước:** Tất cả state management tools, component architecture
➡️ **Mở ra:** Micro-frontend state isolation, SSR state hydration

---

## ❓ Q&A Section / Phần Hỏi & Đáp

### Q1 🟢: Prop drilling là gì và khi nào nó trở thành vấn đề? / What is prop drilling and when does it become a problem?

💡 **Interview Signal:** Kiểm tra bạn hiểu data flow cơ bản trong React

**A:** Prop drilling là truyền data từ parent xuống child qua nhiều tầng component, kể cả các tầng trung gian không dùng data đó.

```tsx
// App → Layout → Sidebar → UserAvatar → Avatar
// Layout và Sidebar không dùng user, chỉ "chuyển tiếp"
function Layout({ user }) {
  return <Sidebar user={user} />; // Layout không cần user
}
```

**Khi nào là vấn đề:**

- **> 3 tầng** truyền qua component không dùng data
- **Thêm 1 prop mới** phải sửa nhiều file
- **Rename prop** phải refactor cả chuỗi

**Khi nào KHÔNG phải vấn đề:**

- 1-2 tầng, explicit data flow dễ trace
- Component composition giải quyết được (truyền children thay vì props)

---

### Q2 🟢: Context API dùng khi nào và giới hạn gì? / When to use Context API and what are its limitations?

💡 **Interview Signal:** Hiểu tradeoff của built-in solution

**A:** Context phù hợp cho data ít thay đổi, cần ở nhiều nơi: theme, locale, auth status.

**Giới hạn chính:** Không selective subscribe — khi Provider value thay đổi, TẤT CẢ consumer re-render, bất kể component dùng field nào.

```tsx
// Tất cả component dùng useContext(AppContext) đều re-render
// kể cả ThemeToggle khi chỉ user thay đổi
<AppContext.Provider value={{ user, theme, locale }}>
```

**Giải pháp:** Split context theo domain, hoặc dùng Zustand nếu cần frequent updates.

---

### Q3 🟡: So sánh Redux, Zustand, và Context — khi nào dùng cái nào? / Compare Redux, Zustand, and Context

💡 **Interview Signal:** Đánh giá khả năng chọn đúng tool cho đúng tình huống

**A:**

| Tiêu chí            | Context             | Zustand                          | Redux Toolkit                   |
| ------------------- | ------------------- | -------------------------------- | ------------------------------- |
| Bundle size         | 0 (built-in)        | ~1.5kB                           | ~11kB                           |
| Selective subscribe | ❌                  | ✅                               | ✅ (useSelector)                |
| Boilerplate         | Thấp                | Rất thấp                         | Trung bình                      |
| DevTools            | React DevTools      | Zustand devtools middleware      | Redux DevTools (mạnh nhất)      |
| Middleware          | Không               | Có (persist, immer, devtools)    | Có (thunk, saga, RTK Query)     |
| Best for            | Theme, locale, auth | Medium apps, simple shared state | Large apps, complex async logic |

**Decision rule:**

- **Data ít thay đổi, toàn app cần** → Context
- **Shared state, medium complexity** → Zustand
- **Complex async flows, team lớn, cần strict patterns** → Redux
- **Server data (API)** → TanStack Query (KHÔNG phải Redux/Zustand)

---

### Q4 🟡: Redux middleware hoạt động như thế nào? / How does Redux middleware work?

💡 **Interview Signal:** Hiểu advanced Redux pattern — middleware pipeline

**A:** Middleware là function nằm giữa dispatch và reducer, intercept mỗi action.

```
dispatch(action) → middleware1 → middleware2 → reducer → store
```

```tsx
// Custom middleware — logging
const logger = (store) => (next) => (action) => {
  console.log("Before:", store.getState());
  const result = next(action); // pass action cho middleware tiếp hoặc reducer
  console.log("After:", store.getState());
  return result;
};

// Thunk middleware cho phép dispatch function thay vì object
const fetchUser = () => async (dispatch) => {
  dispatch({ type: "user/loading" });
  try {
    const user = await api.getUser();
    dispatch({ type: "user/loaded", payload: user });
  } catch (err) {
    dispatch({ type: "user/error", payload: err.message });
  }
};
```

**Key insight:** Middleware cho phép async logic, logging, error reporting, analytics — tất cả centralized tại 1 điểm, không rải trong components.

---

### Q5 🟡: Khi nào nên dùng TanStack Query thay vì Redux cho API data? / When to use TanStack Query instead of Redux for API data?

💡 **Interview Signal:** Phân biệt server state vs client state — kiến thức modern

**A:** **Luôn dùng TanStack Query cho server data.** Redux/Zustand cho client state.

Server state đặc tính:

- Source of truth nằm ở server
- Có thể stale (data cũ)
- Cần background refetching
- Cần cache và deduplication
- Shared giữa nhiều component

TanStack Query handle TẤT CẢ điều trên tự động. Tự build bằng Redux = reinvent wheel + bugs nhiều hơn.

```tsx
// ❌ Redux approach — phải tự quản lý mọi thứ
dispatch(fetchProducts()); // loading state?
// cache? refetch? stale? deduplication? retry? ← tự code hết

// ✅ TanStack Query — tất cả built-in
const { data, isLoading, error } = useQuery({
  queryKey: ["products"],
  queryFn: getProducts,
  staleTime: 5 * 60 * 1000, // cache 5 phút
  retry: 3, // retry 3 lần nếu fail
});
```

---

### Q6 🔴: Design state architecture cho e-commerce app / Design state architecture for e-commerce app

💡 **Interview Signal:** System design thinking — phân loại và chọn tool phù hợp

**A:**

**Step 1: Identify state categories**

| State                 | Type            | Scope  | Tool                     |
| --------------------- | --------------- | ------ | ------------------------ |
| Products, Orders      | Server          | Global | TanStack Query           |
| Cart                  | Client shared   | Global | Zustand                  |
| Auth/User             | Server + Client | Global | TanStack Query + Zustand |
| Theme, Locale         | Client          | Global | Context API              |
| Filters, Sort         | URL             | Page   | useSearchParams          |
| Modal open, Accordion | Client          | Local  | useState                 |
| Checkout form         | Form            | Page   | React Hook Form          |

**Step 2: Architecture**

```tsx
// providers.tsx
function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {" "}
        {/* Context — ít thay đổi */}
        <AuthProvider>
          {" "}
          {/* Context — auth status */}
          {children}
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// stores/cart.ts — Zustand (no Provider needed)
const useCartStore = create(persist(/*...*/));

// hooks/useProducts.ts — TanStack Query
const useProducts = (category: string) =>
  useQuery({
    queryKey: ["products", category],
    queryFn: () => api.getProducts(category),
  });

// URL state — Router params
// /products?category=shoes&sort=price&page=2
```

**Step 3: Data flow rules**

1. Server data → TanStack Query (NEVER in Zustand/Redux)
2. Cart → Zustand + persist middleware (survive refresh)
3. Filters → URL params (shareable, back button works)
4. UI state → useState (colocated)
5. Form → React Hook Form (validation + performance)

#### 🔄 Follow-up Chain

**F1: "Cart cần sync với server — Zustand hay TanStack Query?"**
→ Hybrid: Zustand cho optimistic local cart, TanStack Query mutation để sync lên server, invalidate Zustand store on success.

**F2: "Auth state phức tạp — token refresh, session timeout?"**
→ TanStack Query cho user data, Zustand cho auth tokens (cần sync access), interceptor cho token refresh.

**F3: "Micro-frontend — mỗi team có store riêng, làm sao share?"**
→ Zustand stores isolated per micro-FE, shared state qua custom events hoặc module federation shared singleton.

---

### Q7 🔴: Implement optimistic update với error rollback / Implement optimistic update with error rollback

💡 **Interview Signal:** Production-level async pattern — UX-first thinking

**A:**

```tsx
// TanStack Query optimistic update
function TodoList() {
  const queryClient = useQueryClient();
  const { data: todos } = useQuery({ queryKey: ["todos"], queryFn: getTodos });

  const toggleTodo = useMutation({
    mutationFn: (id: string) => api.toggleTodo(id),

    // 1. Optimistic update TRƯỚC khi API respond
    onMutate: async (id) => {
      // Cancel in-flight queries (tránh overwrite optimistic data)
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      // Snapshot current data (cho rollback)
      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);

      // Optimistic update
      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
      );

      return { previousTodos }; // context cho onError
    },

    // 2. Rollback nếu API fail
    onError: (err, id, context) => {
      queryClient.setQueryData(["todos"], context?.previousTodos);
      toast.error("Failed to update. Rolled back.");
    },

    // 3. Luôn refetch để sync ground truth
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <ul>
      {todos?.map((todo) => (
        <li
          key={todo.id}
          onClick={() => toggleTodo.mutate(todo.id)}
          style={{ opacity: toggleTodo.isPending ? 0.5 : 1 }}
        >
          {todo.done ? "✅" : "⬜"} {todo.text}
        </li>
      ))}
    </ul>
  );
}
```

**Flow:**

```
User click toggle
  → onMutate: snapshot old → update UI ngay lập tức (optimistic)
  → API call bắt đầu (background)
    → Success? → onSettled: refetch cho accurate data
    → Fail? → onError: rollback về snapshot → onSettled: refetch
```

#### 🔄 Follow-up Chain

**F1: "Race condition — user toggle nhanh 2 lần?"**
→ `cancelQueries` cancel in-flight query, nhưng mutation vẫn chạy. Dùng mutation key + `onMutate` check pending mutations, hoặc debounce user action.

**F2: "Optimistic update cho create (chưa có id từ server)?"**
→ Tạo temp id local, replace bằng real id khi server respond. Hoặc dùng UUID client-side.

**F3: "Offline support — queue mutations?"**
→ TanStack Query v5 có `onlineManager` + mutation persistence. Mutations queue khi offline, replay khi online.

---

### Q8 🔴: Tại sao không nên dùng Redux cho mọi app? Thiết kế evaluation framework / Why not Redux for everything? Design an evaluation framework

💡 **Interview Signal:** Architectural judgment — trade-off analysis

**A:**

**Redux overhead cho app không cần nó:**

1. **Boilerplate:** Slice + actions + selectors + types cho mỗi feature
2. **Bundle:** +11kB (gấp 7x Zustand)
3. **Mental model:** Action → Middleware → Reducer → Store — cả team phải hiểu
4. **Indirection:** Logic nằm xa component → khó trace cho newcomer

**Evaluation Framework — SCOPE:**

| Factor            | Question                  | Redux wins when...         | Alternative wins when...        |
| ----------------- | ------------------------- | -------------------------- | ------------------------------- |
| **S**ize          | Bao nhiêu shared state?   | 10+ slices, complex        | 1-5 stores                      |
| **C**omplexity    | State logic phức tạp?     | Nhiều middleware, saga     | Simple CRUD                     |
| **O**bservability | Cần debug mạnh?           | Time-travel, action replay | Console.log đủ                  |
| **P**eople        | Team size?                | 10+ devs, strict patterns  | 1-5 devs, flexibility           |
| **E**cosystem     | Cần middleware/RTK Query? | Complex async, caching     | TanStack Query cho server state |

**Heuristic:**

- SCOPE score > 3 → Redux
- SCOPE score 1-3 → Zustand
- SCOPE score 0 → Context + useState

#### 🔄 Follow-up Chain

**F1: "Team đang dùng Redux, có nên migrate sang Zustand?"**
→ Không nhất thiết. Migration cost > benefit nếu app đã stable. Thêm feature mới có thể dùng Zustand parallel.

**F2: "Zustand có thể replace Redux hoàn toàn?"**
→ Gần như. Thiếu: middleware ecosystem nhỏ hơn, devtools không mạnh bằng, không có RTK Query built-in. Nhưng 90% use case phù hợp.

**F3: "Redux trong micro-frontend?"**
→ Mỗi micro-FE có Redux store riêng. Shared state qua module federation hoặc custom events. KHÔNG share 1 store giữa micro-FEs.

---

## 📋 Q&A Summary Table / Bảng tóm tắt Q&A

| #   | Question                    | Difficulty | Key Concept                         | Interview Signal       |
| --- | --------------------------- | ---------- | ----------------------------------- | ---------------------- |
| Q1  | Prop drilling               | 🟢         | Data flow, khi nào là vấn đề        | Hiểu basics            |
| Q2  | Context API limits          | 🟢         | Broadcast re-render, split context  | Built-in tradeoffs     |
| Q3  | Redux vs Zustand vs Context | 🟡         | Tool selection criteria             | Decision-making        |
| Q4  | Redux middleware            | 🟡         | Middleware pipeline, thunk          | Advanced Redux         |
| Q5  | TanStack Query vs Redux     | 🟡         | Server state vs client state        | Modern patterns        |
| Q6  | E-commerce state design     | 🔴         | State classification + architecture | System design          |
| Q7  | Optimistic updates          | 🔴         | Cache snapshot + rollback           | Production UX          |
| Q8  | Redux evaluation framework  | 🔴         | SCOPE framework                     | Architectural judgment |

---

## ⚡ Cold Call Simulation / Mô phỏng phỏng vấn bất ngờ

> **"State management trong React — bạn approach như thế nào?"**

**30-second opener:**
"Trước hết tôi phân loại state: server state dùng TanStack Query vì cần cache và sync, client state chia thành global dùng Zustand cho selective subscription, local dùng useState colocated gần component. Context chỉ cho data ít thay đổi như theme vì nó broadcast all consumers. URL params cho filterable state để shareable. Tôi KHÔNG đặt mọi thứ vào 1 store — mỗi loại state có tool tối ưu riêng."

---

## 🧪 Self-Check / Tự kiểm tra

> Đóng tài liệu lại. Trả lời từ trí nhớ.

### Retrieval (Nhớ lại)

- [ ] Context API có vấn đề gì về re-render?
- [ ] Redux data flow gồm những bước nào?
- [ ] Zustand khác Redux ở những điểm nào?

### Visual (Hình dung)

- [ ] Vẽ diagram: action → middleware → reducer → store → UI
- [ ] Vẽ so sánh: Context broadcast vs Zustand selective subscribe

### Application (Áp dụng)

- [ ] Classify state cho app bạn đang làm: server/client/URL/form/local
- [ ] Implement Zustand store cho cart với persist middleware

### Debug (Gỡ lỗi)

- [ ] Toàn bộ app re-render khi Context value thay đổi — fix như thế nào?
- [ ] useSelector trả về array mới mỗi lần — fix bằng gì?

### Teach (Giảng lại)

- [ ] Giải thích cho junior: tại sao không đặt API data vào Redux?
- [ ] Giải thích SCOPE framework cho team lead

### 🗣️ Feynman Prompt

> Giải thích cho người chưa biết React: "Tại sao cần state management?"

### 🔁 Spaced Repetition

- Day 3: Vẽ lại concept map từ trí nhớ
- Day 7: So sánh Context vs Zustand vs Redux — viết bảng so sánh
- Day 14: Design state architecture cho 1 app thực tế (e.g., social media)

---

## 🔗 Connections / Liên kết

| Concept                       | Related Topic            | File                           |
| ----------------------------- | ------------------------ | ------------------------------ |
| useContext, useReducer        | Hooks Deep Dive          | 03-hooks-deep-dive.md          |
| Context splitting             | Performance Optimization | 09-performance-optimization.md |
| Compound Components + Context | Advanced Patterns        | 04-advanced-patterns.md        |
| State for testing             | Testing Strategy         | 06-testing.md                  |
| Concurrent state updates      | Modern React Features    | 10-modern-react-features.md    |
