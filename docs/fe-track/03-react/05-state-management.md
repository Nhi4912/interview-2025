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

> You're building an e-commerce app. The product list page needs to know if the user is logged in (to show member prices). The cart icon in the header needs to know the item count. The checkout page needs user info, cart data, and shipping info — all at once.
>
> At first you used `useState` at the App level and passed it down through 5 layers of components. Every new feature means editing props in 5 files. Any cart change re-renders the entire app.
>
> **This is when you need State Management — not because it's "cool," but because prop drilling is killing your productivity and performance.**

> Bạn đang xây app bán hàng online. Trang danh sách sản phẩm cần biết user đã đăng nhập chưa (để hiện giá thành viên). Icon giỏ hàng ở header cần biết số lượng sản phẩm. Trang thanh toán cần cả thông tin user, giỏ hàng, và địa chỉ giao hàng — tất cả cùng lúc.
>
> Ban đầu bạn dùng `useState` ở component App rồi truyền xuống qua 5 tầng. Thêm 1 tính năng → phải sửa props ở 5 file. Thay đổi giỏ hàng → toàn bộ app vẽ lại.
>
> **Đây là lúc bạn cần Quản lý State — không phải vì nó "ngầu", mà vì việc truyền props qua nhiều tầng đang giết năng suất và hiệu suất.**

---

## 💡 What & Why / Cái gì & Tại sao

**Analogy — Company Communication System / Hệ thống liên lạc công ty:**

Imagine a company with 50 employees. There are 3 ways to share information:

Tưởng tượng công ty có 50 nhân viên. Có 3 cách để chia sẻ thông tin:

- **No state management (prop drilling)** = passing messages by word of mouth from CEO → VP → Director → Manager → Developer. Every change goes through the whole chain. That's **prop drilling** — like a game of telephone.

  **Không có quản lý state (truyền props qua nhiều tầng)** = truyền miệng từ giám đốc → phó giám đốc → trưởng phòng → nhóm trưởng → nhân viên. Mỗi lần thay đổi phải đi qua hết chuỗi. Đó là **prop drilling** — giống trò chuyền tin nhắn.

- **Context API** = a company-wide PA speaker. Everyone hears it, but when one announcement goes out → **everyone** stops to listen, even departments that don't care.

  **Context API** = loa phát thanh toàn công ty. Ai cũng nghe được, nhưng khi phát 1 thông báo → **tất cả** đều phải dừng lại nghe, kể cả phòng không liên quan.

- **Redux/Zustand** = internal email with subscriptions. Only people subscribed to specific topics get the email. The accounting team subscribes to "finance" and doesn't receive "engineering" emails.

  **Redux/Zustand** = hệ thống email nội bộ có đăng ký nhận. Chỉ người đăng ký chủ đề cụ thể mới nhận email. Phòng kế toán đăng ký "tài chính", không nhận email "kỹ thuật".

**Core insight:** State management solves 2 problems: (1) data needed in many places, (2) only the component that needs data re-renders when data changes.

**Ý chính:** Quản lý state giải quyết 2 vấn đề: (1) dữ liệu cần dùng ở nhiều nơi, (2) chỉ component cần dữ liệu mới vẽ lại khi dữ liệu thay đổi.

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

State management in React has 3 layers you need to understand:

Quản lý state trong React có 3 tầng cần hiểu:

1. **Context API** — built-in (có sẵn), simple, but has a re-render problem (vấn đề vẽ lại). Good for data that rarely changes (theme, language, login status). / Có sẵn trong React, đơn giản, nhưng có vấn đề vẽ lại. Phù hợp cho dữ liệu ít thay đổi (giao diện sáng/tối, ngôn ngữ, trạng thái đăng nhập).

2. **Redux** — external library (thư viện bên ngoài), verbose (nhiều code) but powerful. Has middleware, devtools, time-travel debugging. Good for large apps with complex state logic. / Thư viện bên ngoài, viết nhiều code nhưng mạnh. Có middleware, devtools, debug quay ngược thời gian. Phù hợp app lớn với logic state phức tạp.

3. **Modern alternatives (Zustand, Jotai)** — solve the same problems with an API 10x simpler than Redux. Selective subscription (chỉ nhận thay đổi cần thiết) built-in. / Giải quyết cùng vấn đề nhưng cách viết đơn giản hơn Redux 10 lần. Tính năng "chỉ nhận thay đổi cần thiết" có sẵn.

**Most importantly: there is no "best" solution — only the solution that fits your app's complexity.**

**Quan trọng nhất: không có giải pháp "tốt nhất" — chỉ có giải pháp phù hợp với độ phức tạp của app.**

---

## 🧩 Core Concepts / Khái niệm cốt lõi

### Concept 1: Context API & The Re-render Problem / Context API & Vấn đề vẽ lại

> 🧠 **Memory Hook:** "Context = PA speaker — everyone hears it, everyone has to stop and listen"
>
> 🧠 **Ghi nhớ:** "Context = loa phát thanh — ai cũng nghe, ai cũng phải dừng lại nghe"

#### Why does this exist? / Tại sao cần cái này?

**Level 1 — Immediate problem:** React has no built-in way to pass data "through layers." Props only go from parent → child, one level at a time. If a deeply nested component needs data from the top, every component in between must pass it along — even if they don't use it.

**Tầng 1 — Vấn đề trực tiếp:** React không có cách truyền dữ liệu "xuyên tầng." Props chỉ truyền từ cha → con, mỗi lần 1 tầng. Nếu component ở sâu cần dữ liệu từ trên cùng, mọi component ở giữa phải chuyền tiếp — dù chúng không dùng.

**Level 2 — Root cause:** React's component tree is hierarchical (cây phân cấp). Data flows one way only (một chiều). When 2 components on different branches need the same data, their common ancestor must hold the state → prop drilling through many layers.

**Tầng 2 — Nguyên nhân gốc:** Cây component của React là phân cấp (cha-con). Dữ liệu chỉ chảy 1 chiều. Khi 2 component ở nhánh khác nhau cần cùng dữ liệu, tổ tiên chung phải giữ state đó → truyền props qua nhiều tầng.

#### Layer 1: Analogy — Company PA System / Loa phát thanh công ty

```
Without Context (prop drilling) / Không có Context (truyền qua nhiều tầng):
  CEO knows "meeting at 2pm"
  → CEO tells VP                    (CEO nói cho phó GĐ)
    → VP tells Director             (phó GĐ nói cho trưởng phòng)
      → Director tells Manager      (trưởng phòng nói cho nhóm trưởng)
        → Manager tells Dev         (nhóm trưởng nói cho dev)
                                    ← only Dev needs it! / chỉ Dev cần!

With Context / Có Context:
  CEO announces on PA: "Meeting at 2pm"
  → All 50 people hear it           (50 người đều nghe)
                                    ← even those who don't need it! / kể cả người không cần!
```

Context solves prop drilling, but creates a new problem: **every consumer re-renders when the value changes** — like forcing the whole company to stop work for every announcement.

Context giải quyết việc truyền props nhiều tầng, nhưng tạo vấn đề mới: **mọi component dùng Context đều vẽ lại khi giá trị thay đổi** — giống ép cả công ty ngừng làm việc mỗi khi có thông báo.

#### Layer 2: How It Works / Cách hoạt động

```tsx
// 1. Create Context / Tạo Context
const CartContext = createContext<CartState | null>(null);

// 2. Provider wraps at the top / Provider bọc ở trên
function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);

  const addItem = (item: Item) => {
    setItems((prev) => [...prev, item]);
    setTotal((prev) => prev + item.price);
  };

  // Every consumer below gets this value
  // Mọi consumer bên dưới nhận giá trị này
  return <CartContext.Provider value={{ items, total, addItem }}>{children}</CartContext.Provider>;
}

// 3. Consumers use it below / Consumer dùng ở dưới
function CartIcon() {
  const cart = useContext(CartContext); // subscribes to ALL of value / đăng ký TOÀN BỘ value
  return <span>🛒 {cart?.items.length}</span>;
}

function CartTotal() {
  const cart = useContext(CartContext); // also subscribes to ALL / cũng đăng ký toàn bộ
  return <span>Total: {cart?.total}</span>;
}
```

**The re-render problem / Vấn đề vẽ lại:**

```
When addItem() is called / Khi addItem() được gọi:

  CartProvider re-renders (state changed / state thay đổi)
    → Creates NEW value object: { items, total, addItem }
      (Tạo object value MỚI)
      → Reference changes / Tham chiếu thay đổi
        → ALL useContext(CartContext) re-render / TẤT CẢ đều vẽ lại
          → CartIcon re-renders (only needs items.length / chỉ cần items.length)
          → CartTotal re-renders (only needs total / chỉ cần total)
          → UserGreeting re-renders (only needs username — DOESN'T NEED cart!)
            (chỉ cần tên user — KHÔNG CẦN giỏ hàng!)
```

**Solution: Split Context / Giải pháp: Tách Context**

```tsx
// Split into 2 separate contexts / Tách thành 2 context riêng
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

// Now CartTotal only re-renders when total changes
// Giờ CartTotal chỉ vẽ lại khi total thay đổi
function CartTotal() {
  const total = useContext(CartTotalContext); // only subscribes to total / chỉ đăng ký total
  return <span>Total: {total}</span>;
}
```

#### Layer 3: Edge Cases / Trường hợp đặc biệt

1. **Provider value reference trap / Bẫy tham chiếu value:**

```tsx
// ❌ BAD — creates new object every render → all consumers re-render
// ❌ SAI — tạo object mới mỗi lần vẽ → mọi consumer vẽ lại
<MyContext.Provider value={{ user, theme }}>

// ✅ GOOD — useMemo keeps reference stable (giữ tham chiếu ổn định)
const value = useMemo(() => ({ user, theme }), [user, theme]);
<MyContext.Provider value={value}>
```

2. **Missing Provider = silent bug / Quên Provider = lỗi âm thầm:**

```tsx
// If you forget to wrap Provider, useContext returns defaultValue (usually null)
// Nếu quên bọc Provider, useContext trả về giá trị mặc định (thường là null)
const ctx = useContext(CartContext); // → null if no Provider / null nếu không có Provider
ctx.items.length; // 💥 TypeError: Cannot read property 'items' of null
```

3. **Context can't selectively subscribe / Context không thể chỉ đăng ký 1 phần:**

```tsx
// No way to subscribe to just one field
// Không có cách chỉ đăng ký 1 trường
const { total } = useContext(CartContext);
// ↑ Component STILL re-renders when items change, even though it only uses total
// ↑ Component VẪN vẽ lại khi items thay đổi, dù chỉ dùng total
```

#### ❌ Common Mistakes / Lỗi thường gặp

| ❌ Mistake / Sai lầm                                                                                    | ✅ Correct / Đúng là                                                                  | 💡 Why / Tại sao                                                       |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Use Context for frequently changing state (input, animation) / Dùng Context cho state thay đổi liên tục | Use Zustand/Redux for frequent updates / Dùng Zustand/Redux cho cập nhật thường xuyên | Context re-renders ALL consumers / Context vẽ lại TẤT CẢ consumer      |
| One mega-context holding all state / 1 context khổng lồ chứa hết                                        | Split into small contexts by domain / Tách nhiều context nhỏ theo lĩnh vực            | Reduce unnecessary re-renders / Giảm vẽ lại không cần thiết            |
| Forget useMemo for Provider value / Quên useMemo cho giá trị Provider                                   | Always useMemo if value is object/array / Luôn useMemo nếu value là object/array      | New reference = re-render everything / Tham chiếu mới = vẽ lại hết     |
| Use Context when only 1-2 levels / Dùng Context khi chỉ 1-2 tầng                                        | Props for short distance, Context for cross-cutting / Props cho khoảng cách ngắn      | Over-engineering, hard to trace data flow / Quá phức tạp, khó theo dõi |

#### 🎯 Interview Pattern

> **Trigger:** "What's the re-render problem with Context API?" / "Context API có vấn đề gì về vẽ lại?"
>
> 🇬🇧 **Opening:** "Context API broadcasts to all consumers — any change in the value triggers a re-render in every consumer, even components that only use one field that didn't change. The fix is splitting into multiple contexts or using a library with selective subscription like Zustand."
>
> 🇻🇳 **Mở đầu:** "Context API phát sóng cho tất cả consumer — bất kỳ thay đổi nào trong value đều kích hoạt vẽ lại ở mọi consumer, kể cả component chỉ dùng 1 trường không đổi. Cách sửa là tách nhiều context hoặc dùng thư viện có đăng ký chọn lọc như Zustand."

#### 🔑 Knowledge Chain

📚 **Prerequisite / Cần trước:** useContext hook (03-hooks), reference equality (JavaScript)
➡️ **Enables / Mở ra:** Redux/Zustand selective subscription, performance optimization

---

### Concept 2: Redux Architecture — Predictable State Container / Redux — Hộp chứa State dự đoán được

> 🧠 **Memory Hook:** "Redux = strict bank accountant — every transaction needs a receipt (action), ledger entry (reducer), vault (store)"
>
> 🧠 **Ghi nhớ:** "Redux = kế toán ngân hàng nghiêm khắc — mọi giao dịch phải có biên nhận (action), ghi sổ (reducer), két sắt (store)"

#### Why does this exist? / Tại sao cần?

**Level 1 — Immediate:** Large apps have lots of complex state. Many components need to share state. You need to debug "who changed what, when" — like bank audit trails.

**Tầng 1 — Trực tiếp:** App lớn có nhiều state phức tạp. Nhiều component cần chia sẻ state. Bạn cần debug "ai thay đổi cái gì, lúc nào" — giống sổ kiểm toán ngân hàng.

**Level 2 — Root cause:** When apps scale up, implicit (hidden) state changes are the root cause of most bugs. Redux enforces explicit, traceable state changes — every change must go through a clear pipeline, like requiring a signed receipt for every bank transaction.

**Tầng 2 — Nguyên nhân gốc:** Khi app lớn lên, thay đổi state ngầm (ẩn) là nguồn gốc của hầu hết bug. Redux bắt buộc mọi thay đổi state phải rõ ràng, truy vết được — mỗi thay đổi phải đi qua 1 quy trình rõ ràng, giống yêu cầu biên nhận có chữ ký cho mọi giao dịch ngân hàng.

#### Layer 1: Analogy — Bank Accounting / Kế toán ngân hàng

```
You want to withdraw money from a bank / Bạn muốn rút tiền:

1. You CANNOT go into the vault yourself (no direct state change)
   Bạn KHÔNG THỂ tự vào két lấy tiền (không thay đổi state trực tiếp)
2. You must write a withdrawal slip (dispatch an ACTION)
   Bạn phải viết phiếu rút tiền (gửi 1 ACTION)
   → { type: "WITHDRAW", amount: 500 }
3. Accountant checks the slip and calculates new balance (REDUCER)
   Kế toán kiểm tra phiếu, tính số dư mới (REDUCER)
   → balance = 1000 - 500 = 500
4. Vault updates (STORE update)
   Két sắt cập nhật (STORE cập nhật)
   → { balance: 500 }
5. Display board shows new balance (UI re-renders)
   Bảng hiển thị số dư mới (UI vẽ lại)

Every transaction has a LOG → you can trace the history
Mọi giao dịch đều có SỔ GHI → bạn truy vết được lịch sử
```

#### Layer 2: How It Works / Cách hoạt động

```
Redux Data Flow (One direction / Một chiều):

  UI ──dispatch──→ Action ──→ Middleware ──→ Reducer ──→ Store
  ↑                                                       |
  └───────────── selector subscribe ──────────────────────┘

  1. User clicks "Add to Cart" / User bấm "Thêm vào giỏ"
  2. dispatch({ type: 'cart/addItem', payload: item })
  3. Middleware (thunk) can call API first / có thể gọi API trước
  4. Reducer calculates new state / tính state mới: [...items, item]
  5. Store saves new state / lưu state mới
  6. Component subscribes via selector → re-renders / vẽ lại
```

```tsx
// Redux Toolkit — modern Redux (don't use vanilla Redux anymore!)
// Redux Toolkit — Redux hiện đại (đừng dùng Redux thuần nữa!)
import { createSlice, configureStore } from "@reduxjs/toolkit";

// 1. SLICE = reducer + actions bundled together / gộp lại
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] as Item[], total: 0 },
  reducers: {
    addItem(state, action: PayloadAction<Item>) {
      // Immer lets you "mutate" — actually creates a copy
      // Immer cho phép "thay đổi trực tiếp" — thực tế tạo bản sao
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

// 3. SELECTOR — only subscribe to needed fields / chỉ đăng ký trường cần thiết
const selectCartCount = (state: RootState) => state.cart.items.length;
const selectCartTotal = (state: RootState) => state.cart.total;

// 4. COMPONENT — selective subscription is automatic / đăng ký chọn lọc tự động
function CartIcon() {
  const count = useSelector(selectCartCount);
  // ↑ ONLY re-renders when items.length changes, NOT when total changes
  // ↑ CHỈ vẽ lại khi items.length đổi, KHÔNG vẽ lại khi total đổi
  return <span>🛒 {count}</span>;
}

// 5. DISPATCH
function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(cartSlice.actions.addItem(product))}>Add to Cart</button>;
}
```

**Middleware — handling async logic / xử lý logic bất đồng bộ:**

```tsx
// createAsyncThunk for API calls / cho các lệnh gọi API
const fetchProducts = createAsyncThunk("products/fetch", async (category: string) => {
  const res = await fetch(`/api/products?cat=${category}`);
  return res.json(); // becomes payload for fulfilled action
  // trở thành payload cho action thành công
});

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading"; // đang tải
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded"; // thành công
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed"; // thất bại
        state.error = action.error.message ?? null;
      });
  },
});
```

#### Layer 3: Edge Cases / Trường hợp đặc biệt

1. **Selector reference trap / Bẫy tham chiếu selector:**

```tsx
// ❌ Creates a new array every time → component always re-renders
// ❌ Tạo mảng mới mỗi lần → component luôn vẽ lại
const items = useSelector((state) => state.cart.items.filter((i) => i.active));

// ✅ Use createSelector (memoized — remembers previous result)
// ✅ Dùng createSelector (ghi nhớ — nhớ kết quả trước đó)
const selectActiveItems = createSelector(
  (state: RootState) => state.cart.items,
  (items) => items.filter((i) => i.active), // only recalculates when items changes
  // chỉ tính lại khi items thay đổi
);
```

2. **Normalized state for nested data / State phẳng cho dữ liệu lồng nhau:**

```tsx
// ❌ Nested structure → hard to update, must deep clone
// ❌ Cấu trúc lồng nhau → khó cập nhật, phải sao chép sâu
{ posts: [{ id: 1, comments: [{ id: 1, author: { id: 1, name: '...' }}]}]}

// ✅ Normalized (flat) → update O(1) / Phẳng → cập nhật nhanh
{
  posts: { byId: { 1: { id: 1, commentIds: [1] } } },
  comments: { byId: { 1: { id: 1, authorId: 1 } } },
  users: { byId: { 1: { id: 1, name: '...' } } },
}
```

#### ❌ Common Mistakes / Lỗi thường gặp

| ❌ Mistake / Sai lầm                                                   | ✅ Correct / Đúng là                                                     | 💡 Why / Tại sao                                                      |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Use vanilla Redux (switch/case) / Dùng Redux thuần                     | Use Redux Toolkit (createSlice) / Dùng Redux Toolkit                     | RTK reduces boilerplate 80%, has Immer / giảm code thừa 80%, có Immer |
| Put ALL state in Redux / Đặt MỌI state vào Redux                       | Only shared/complex state / Chỉ state chia sẻ/phức tạp                   | Form input doesn't need global / Input form không cần toàn cục        |
| Selector creates new reference each call / Selector tạo tham chiếu mới | createSelector for derived data / createSelector cho dữ liệu tính toán   | Avoids unnecessary re-renders / Tránh vẽ lại không cần                |
| Call API directly then dispatch / Gọi API trực tiếp rồi dispatch       | Use createAsyncThunk or RTK Query / Dùng createAsyncThunk hoặc RTK Query | Middleware handles loading/error/cache automatically / tự động xử lý  |

#### 🎯 Interview Pattern

> **Trigger:** "Explain Redux data flow" / "Giải thích luồng dữ liệu Redux"
>
> 🇬🇧 **Opening:** "Redux enforces one-way data flow: component dispatches an action, middleware handles side effects like API calls, reducer calculates the new pure state, store saves it and notifies subscribers through selectors. This makes every state change traceable — like a bank audit trail."
>
> 🇻🇳 **Mở đầu:** "Redux bắt buộc luồng dữ liệu một chiều: component gửi action, middleware xử lý tác dụng phụ như gọi API, reducer tính state thuần mới, store lưu và thông báo cho các subscriber qua selector. Điều này khiến mọi thay đổi state đều truy vết được — giống sổ kiểm toán ngân hàng."

#### 🔑 Knowledge Chain

📚 **Prerequisite / Cần trước:** useReducer pattern (03-hooks), immutability concept
➡️ **Enables / Mở ra:** Middleware patterns, RTK Query, state normalization

---

### Concept 3: Modern Alternatives — Zustand & Jotai / Giải pháp hiện đại — Zustand & Jotai

> 🧠 **Memory Hook:** "Zustand = Google Docs — whoever needs something subscribes, no ceremony needed"
>
> 🧠 **Ghi nhớ:** "Zustand = Google Docs — ai cần gì thì đăng ký, không cần nghi lễ rườm rà"

#### Why does this exist? / Tại sao cần?

**Level 1 — Immediate:** Redux is too verbose for small/medium apps. Context has re-render problems. We need something simpler.

**Tầng 1 — Trực tiếp:** Redux quá nhiều code cho app nhỏ/vừa. Context có vấn đề vẽ lại. Cần giải pháp đơn giản hơn.

**Level 2 — Root cause:** Redux was designed before hooks existed — the action/reducer/middleware pattern is overkill for many use cases. Modern libraries leverage hooks + subscription patterns to give a minimal API while still having selective re-renders.

**Tầng 2 — Nguyên nhân gốc:** Redux được thiết kế trước khi có hooks — mô hình action/reducer/middleware là quá mức cho nhiều trường hợp. Thư viện hiện đại tận dụng hooks + mô hình đăng ký để cho cách viết tối giản nhưng vẫn có vẽ lại chọn lọc.

#### Layer 1: Analogy — Google Docs vs ERP System

```
Redux = ERP System (like SAP) / Hệ thống ERP (như SAP):
  - Every change needs an approval process (action → middleware → reducer)
    Mỗi thay đổi phải qua quy trình phê duyệt
  - Needs 3 months training / Cần đào tạo 3 tháng
  - But perfect audit trail / Nhưng lịch sử kiểm toán hoàn hảo
  - Good for 10,000-person company / Phù hợp công ty 10.000 người

Zustand = Google Docs:
  - Create doc, share link, whoever needs it can edit
    Tạo tài liệu, chia sẻ link, ai cần thì sửa
  - Learn in 5 minutes / Học 5 phút là dùng được
  - Still has version history / Vẫn có lịch sử phiên bản
  - Good for 5-50 person team / Phù hợp team 5-50 người

Jotai = Sticky notes / Giấy nhớ dán:
  - Each note is one atom (smallest unit of state)
    Mỗi giấy nhớ là 1 atom (đơn vị state nhỏ nhất)
  - Whoever needs a note reads that note / Ai cần giấy nào đọc giấy đó
  - No store, no provider needed / Không cần store, không cần provider
  - Good when states are independent / Phù hợp khi các state độc lập
```

#### Layer 2: How It Works / Cách hoạt động

**Zustand — Store-based, minimal API / Dựa trên store, cách viết tối giản:**

```tsx
import { create } from "zustand";

// Create store — just 1 function, done.
// Tạo store — chỉ 1 hàm, xong.
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

// Use in component — selective subscription is automatic!
// Dùng trong component — đăng ký chọn lọc tự động!
function CartIcon() {
  const count = useCartStore((state) => state.items.length);
  // ↑ ONLY re-renders when items.length changes / CHỈ vẽ lại khi items.length đổi
  return <span>🛒 {count}</span>;
}

function CartTotal() {
  const total = useCartStore((state) => state.total);
  // ↑ ONLY re-renders when total changes / CHỈ vẽ lại khi total đổi
  return <span>${total}</span>;
}

function AddButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  // ↑ addItem reference is stable → component does NOT re-render when cart changes
  // ↑ tham chiếu addItem ổn định → component KHÔNG vẽ lại khi giỏ hàng đổi
  return <button onClick={() => addItem(product)}>Add</button>;
}
```

**Comparison: Zustand vs Redux / So sánh:**

```
Feature            | Redux Toolkit        | Zustand
-------------------+----------------------+------------------
Setup / Cài đặt    | configureStore +     | create() — 1 function
                   | createSlice +        | 1 hàm là xong
                   | Provider wrapper     |
Boilerplate / Code | Medium               | Minimal / Rất ít
thừa               |                      |
Async              | createAsyncThunk     | Call directly in action
                   | or RTK Query         | Gọi trực tiếp trong action
Selective sub      | useSelector +        | Built-in via selector
                   | createSelector       | Có sẵn qua selector
DevTools           | Redux DevTools       | devtools middleware
Bundle size        | ~11kB                | ~1.5kB
Provider needed?   | Yes                  | No / Không cần
```

**Jotai — Atomic state management / Quản lý state theo đơn vị nhỏ nhất:**

```tsx
import { atom, useAtom } from "jotai";

// Atoms = smallest units of state / đơn vị state nhỏ nhất
const itemsAtom = atom<Item[]>([]);

// Derived atom — automatically calculated from itemsAtom
// Atom phái sinh — tự tính từ itemsAtom
const totalAtom = atom((get) => {
  return get(itemsAtom).reduce((sum, i) => sum + i.price, 0);
});

function CartIcon() {
  const [items] = useAtom(itemsAtom);
  return <span>🛒 {items.length}</span>;
}

function CartTotal() {
  const [total] = useAtom(totalAtom);
  // ↑ Only re-renders when total changes (derived) / Chỉ vẽ lại khi total đổi
  return <span>${total}</span>;
}
```

**Decision Framework — When to use what / Khi nào dùng gì:**

```
                    Need state management? / Cần quản lý state?
                          |
                    Data from server? / Dữ liệu từ server?
                   /              \
                 Yes               No
                  |                 |
            TanStack Query    How many components share?
            (server state)    Bao nhiêu component chia sẻ?
                              /          |            \
                           1-2         3-10          10+
                            |           |             |
                        useState     Zustand      Redux or
                        + props      or Jotai     Zustand
                                                     |
                                              Need strong middleware/
                                              devtools? / Cần middleware/
                                              devtools mạnh?
                                              /            \
                                            Yes            No
                                             |              |
                                           Redux         Zustand
```

| Solution / Giải pháp | Use when / Dùng khi                                                              | DON'T use when / KHÔNG dùng khi                                                            |
| -------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **useState + props** | Local state, 1-2 levels / State cục bộ, 1-2 tầng                                 | Prop drilling > 3 levels / > 3 tầng                                                        |
| **Context API**      | Theme, language, auth (rarely changes) / Giao diện, ngôn ngữ, đăng nhập (ít đổi) | Frequent updates (typing, animation) / Cập nhật liên tục                                   |
| **Zustand**          | Shared state, medium app, simple API / State chia sẻ, app vừa                    | Need strict architecture for large team / Cần kiến trúc chặt cho team lớn                  |
| **Jotai**            | Independent atoms, derived state / Atom độc lập, state tính toán                 | Tightly coupled state needing centralized logic / State phụ thuộc nhau cần logic tập trung |
| **Redux Toolkit**    | Large app, complex async, strong devtools / App lớn, async phức tạp              | Small/medium app — overkill / App nhỏ/vừa — quá mức                                        |
| **TanStack Query**   | Server state (API data + cache + sync) / State từ server                         | Client-only state (UI state, forms) / State chỉ trên client                                |

#### Layer 3: Edge Cases / Trường hợp đặc biệt

1. **Zustand with Immer for complex nested state / Zustand với Immer cho state lồng nhau phức tạp:**

```tsx
import { immer } from "zustand/middleware/immer";

const useStore = create(
  immer<State>((set) => ({
    deeply: { nested: { value: 0 } },
    increment: () =>
      set((state) => {
        state.deeply.nested.value++; // looks like mutation, but Immer creates copy
        // trông như thay đổi trực tiếp, nhưng Immer tạo bản sao
      }),
  })),
);
```

2. **Zustand persist middleware — survive page refresh / lưu qua refresh trang:**

```tsx
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist<CartState>(
    (set) => ({ items: [], addItem: (item) => set(/*...*/) }),
    { name: "cart-storage" }, // → localStorage key
  ),
);
```

#### ❌ Common Mistakes / Lỗi thường gặp

| ❌ Mistake / Sai lầm                                                                   | ✅ Correct / Đúng là                                               | 💡 Why / Tại sao                                                                                      |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Put server data (API response) in Redux/Zustand / Đặt dữ liệu server vào Redux/Zustand | Use TanStack Query for server state / Dùng TanStack Query          | Server state needs cache, refetch, invalidation — TQ has it built-in / cần cache, refetch — TQ có sẵn |
| Use Redux for TODO app / Dùng Redux cho app TODO                                       | useState or Zustand                                                | Redux overkill for small apps / quá mức cho app nhỏ                                                   |
| Copy entire store: `useCartStore()` / Sao chép toàn bộ store                           | Select each field: `useCartStore(s => s.total)` / Chọn từng trường | Copying all = re-render on any change / Sao hết = vẽ lại mọi thay đổi                                 |
| Use Context for form state (every keystroke) / Dùng Context cho form (mỗi phím bấm)    | useState local or React Hook Form                                  | Context re-renders ALL consumers each keystroke / vẽ lại TẤT CẢ mỗi phím bấm                          |

#### 🎯 Interview Pattern

> **Trigger:** "Compare Redux vs Zustand vs Context" / "So sánh Redux vs Zustand vs Context"
>
> 🇬🇧 **Opening:** "Context broadcasts to all consumers with no selective subscription. Redux provides selective subscription but is verbose. Zustand provides selective subscription with a minimal API. The choice depends on app size, team size, and complexity of state logic."
>
> 🇻🇳 **Mở đầu:** "Context phát sóng cho tất cả consumer, không đăng ký chọn lọc được. Redux cho đăng ký chọn lọc nhưng nhiều code. Zustand cho đăng ký chọn lọc với cách viết tối giản. Chọn dựa trên kích thước app, kích thước team, và độ phức tạp của logic state."

#### 🔑 Knowledge Chain

📚 **Prerequisite / Cần trước:** Context API re-render problem, useReducer
➡️ **Enables / Mở ra:** State architecture design, performance optimization

---

### Concept 4: Server State vs Client State / State từ Server vs State trên Client

> 🧠 **Memory Hook:** "Server state = library book — you only borrow a copy, the original stays at the server"
>
> 🧠 **Ghi nhớ:** "Server state = sách thư viện — bạn chỉ mượn bản sao, bản gốc nằm ở server"

#### Why does this exist? / Tại sao cần phân biệt?

**Level 1 — Immediate:** Many developers put API responses into Redux/Zustand and manually manage loading/error/cache states. The code grows large and buggy.

**Tầng 1 — Trực tiếp:** Nhiều lập trình viên đặt dữ liệu từ API vào Redux/Zustand rồi tự quản lý trạng thái loading/error/cache. Code phình ra và nhiều lỗi.

**Level 2 — Root cause:** API data has fundamentally different characteristics than UI state: its source of truth lives outside the app (on the server), it needs caching, background refetching, and invalidation when stale. Managing it with client state tools = reinventing the wheel poorly.

**Tầng 2 — Nguyên nhân gốc:** Dữ liệu API có đặc tính khác hẳn state giao diện: nguồn sự thật nằm ngoài app (trên server), cần lưu đệm, tự động lấy lại khi cũ. Quản lý bằng công cụ client state = tự phát minh lại bánh xe một cách tệ hại.

#### Layer 1: Analogy — Library vs Personal Bookshelf / Thư viện vs Tủ sách cá nhân

```
Client State (Zustand/Redux) = personal bookshelf / tủ sách cá nhân:
  - You own each book / Bạn sở hữu mỗi cuốn sách
  - You decide to add/remove / Bạn quyết định thêm/bớt
  - Nobody changes them but you / Không ai thay đổi ngoài bạn

Server State (TanStack Query) = public library / thư viện công cộng:
  - You only BORROW books (cache) / Bạn chỉ MƯỢN sách (bản đệm)
  - Books can be updated (stale data) / Sách có thể được cập nhật (dữ liệu cũ)
  - Need to check for new editions (refetch) / Cần kiểm tra bản mới (lấy lại)
  - Books might be unavailable (loading/error) / Sách có thể hết (đang tải/lỗi)
  - Many people borrow same book (shared cache) / Nhiều người mượn cùng sách (bản đệm dùng chung)
```

#### Layer 2: How It Works / Cách hoạt động

```tsx
// TanStack Query — manages server state / quản lý state từ server
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// GET — fetching data / lấy dữ liệu
function ProductList({ category }: { category: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", category], // cache key / khóa bản đệm
    queryFn: () => fetch(`/api/products?cat=${category}`).then((r) => r.json()),
    staleTime: 5 * 60 * 1000, // data is "fresh" for 5 minutes / dữ liệu "tươi" trong 5 phút
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

// POST/PUT — changing data / thay đổi dữ liệu
function AddToCart({ product }: { product: Product }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (item: Product) =>
      fetch("/api/cart", { method: "POST", body: JSON.stringify(item) }),
    onSuccess: () => {
      // Invalidate cache → automatically refetches / Hủy bản đệm → tự lấy lại
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

**TanStack Query lifecycle / Vòng đời:**

```
Component mounts / Component được gắn vào
  → Check cache for queryKey ['products', 'electronics']
    Kiểm tra bản đệm
    → Cache MISS? → fetch API → save to cache → render data
      Không có? → gọi API → lưu bản đệm → hiện dữ liệu
    → Cache HIT? / Có trong bản đệm?
      → Data fresh (< staleTime)? → render immediately, NO fetch
        Dữ liệu tươi? → hiện ngay, KHÔNG gọi API
      → Data stale (> staleTime)? → render cache NOW + fetch in background
        Dữ liệu cũ? → hiện bản đệm NGAY + gọi API ngầm
        → Fetch done → update cache → re-render with new data
          Gọi xong → cập nhật bản đệm → vẽ lại với dữ liệu mới
```

#### Layer 3: Edge Cases / Trường hợp đặc biệt

1. **Optimistic updates — update UI before server responds / cập nhật UI trước khi server trả lời:**

```tsx
const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    // Cancel ongoing queries (prevent overwriting optimistic data)
    // Hủy query đang chạy (tránh ghi đè dữ liệu lạc quan)
    await queryClient.cancelQueries({ queryKey: ["todos"] });

    // Snapshot current data (for rollback) / Chụp dữ liệu hiện tại (để hoàn tác)
    const previous = queryClient.getQueryData(["todos"]);

    // Optimistic update / Cập nhật lạc quan
    queryClient.setQueryData(["todos"], (old) => [...old, newTodo]);

    return { previous }; // context for rollback / ngữ cảnh để hoàn tác
  },
  onError: (err, newTodo, context) => {
    // Rollback on error / Hoàn tác khi lỗi
    queryClient.setQueryData(["todos"], context?.previous);
  },
  onSettled: () => {
    // Always refetch to sync with server / Luôn lấy lại để đồng bộ
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});
```

2. **Dependent queries / Query phụ thuộc:**

```tsx
const { data: user } = useQuery({ queryKey: ["user"], queryFn: getUser });
const { data: orders } = useQuery({
  queryKey: ["orders", user?.id],
  queryFn: () => getOrders(user!.id),
  enabled: !!user?.id, // only fetch when user exists / chỉ lấy khi có user
});
```

#### ❌ Common Mistakes / Lỗi thường gặp

| ❌ Mistake / Sai lầm                                                                                     | ✅ Correct / Đúng là                                          | 💡 Why / Tại sao                                                     |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------- |
| Store API data in Redux + manage loading/error manually / Lưu API data vào Redux + tự quản loading/error | Use TanStack Query / Dùng TanStack Query                      | TQ auto-handles cache, refetch, loading, error / TQ tự xử lý         |
| staleTime: 0 (default) for rarely changing data / cho dữ liệu ít đổi                                     | Set appropriate staleTime (5-30 min) / Đặt staleTime phù hợp  | Avoid unnecessary refetch / Tránh gọi API không cần                  |
| Use TanStack Query for UI state (modal, theme) / Dùng TQ cho state giao diện                             | Use useState/Zustand for client state / Dùng useState/Zustand | TQ is for server state with cache/invalidation / TQ cho state server |
| Forget to invalidate after mutation / Quên invalidate sau khi thay đổi                                   | Always invalidateQueries or setQueryData                      | Stale data after mutation / Dữ liệu cũ sau khi thay đổi              |

#### 🎯 Interview Pattern

> **Trigger:** "How do you manage API data in React?" / "Quản lý dữ liệu API trong React như thế nào?"
>
> 🇬🇧 **Opening:** "Server state has its source of truth outside the app, needs caching and background sync. TanStack Query manages the complete lifecycle: loading, error, cache, stale detection, refetch — instead of manually building all that with useEffect + useState."
>
> 🇻🇳 **Mở đầu:** "State từ server có nguồn sự thật nằm ngoài app, cần lưu đệm và đồng bộ ngầm. TanStack Query quản lý toàn bộ vòng đời: đang tải, lỗi, bản đệm, phát hiện dữ liệu cũ, tự lấy lại — thay vì tự xây tất cả bằng useEffect + useState."

#### 🔑 Knowledge Chain

📚 **Prerequisite / Cần trước:** useEffect for data fetching, cache concepts
➡️ **Enables / Mở ra:** Optimistic updates, infinite scroll, SSR prefetch

---

### Concept 5: State Architecture Design / Thiết kế kiến trúc State

> 🧠 **Memory Hook:** "State architecture = house electrical wiring — must plan BEFORE building, not wire randomly"
>
> 🧠 **Ghi nhớ:** "Kiến trúc state = sơ đồ điện nhà — phải quy hoạch TRƯỚC khi xây, không phải nối dây bừa"

#### Why does this exist? / Tại sao cần?

**Level 1 — Immediate:** When apps grow large, state is scattered everywhere — Redux for one part, Context for another, useState sprinkled randomly → nobody knows how data flows.

**Tầng 1 — Trực tiếp:** Khi app lớn lên, state nằm khắp nơi — Redux cho 1 phần, Context cho phần khác, useState rải rác → không ai biết dữ liệu chảy thế nào.

**Level 2 — Root cause:** State management is an architectural decision, not a library choice. Without planning → each developer picks a different solution → state spaghetti (code rối như mì).

**Tầng 2 — Nguyên nhân gốc:** Quản lý state là quyết định kiến trúc, không phải chọn thư viện. Không có quy hoạch → mỗi lập trình viên chọn giải pháp khác nhau → code state rối như mì Ý.

#### Layer 1: Analogy — City Planning / Quy hoạch thành phố

```
State architecture = urban planning / quy hoạch thành phố:

  Water (Server state)      → TanStack Query
  Nước (State từ server)    = from water plant / từ nhà máy nước
                            = data from API, has external source / dữ liệu từ API

  Electricity (Client state) → Zustand/Redux
  Điện (State trên client)   = from power plant / từ nhà máy điện
                             = state created by app / state do app tạo ra

  Room light (Local state)   → useState
  Đèn phòng (State cục bộ)  = switch in that room / công tắc trong phòng đó
                             = only that room needs it / chỉ phòng đó cần

  PA speaker (Context)       → Context API
  Loa phát thanh (Context)   = neighborhood announcement / thông báo toàn khu
                             = theme, language, rarely changes / ít thay đổi
```

#### Layer 2: How It Works / Cách hoạt động

**Classify state by source & scope / Phân loại state theo nguồn & phạm vi:**

```
                    Scope / Phạm vi
              Local ←────→ Global / Toàn cục
              │              │
  Source:     │              │
  Client ─────┤  useState    │  Zustand/Redux
  (UI)        │  useReducer  │  (shared UI state / state UI chia sẻ)
              │              │
  Server ─────┤  Component   │  TanStack Query
  (API)       │  fetch       │  (cached server state / state server có đệm)
              │              │
  URL ────────┤  useParams   │  Router state
  (Browser)   │              │  (searchParams)
              │              │
  Form ───────┤  RHF         │  Form library
  (Input)     │  useForm     │  (validation + state)
```

**E-commerce app example / Ví dụ app bán hàng:**

```tsx
// 1. Server State — TanStack Query
const { data: products } = useQuery({
  queryKey: ["products"],
  queryFn: getProducts,
});
const { data: user } = useQuery({ queryKey: ["user"], queryFn: getUser });

// 2. Client State — Zustand (shared across components / chia sẻ giữa components)
const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  activeFilter: "all",
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setFilter: (filter: string) => set({ activeFilter: filter }),
}));

// 3. URL State — Router (shareable, back button works / chia sẻ được, nút quay lại hoạt động)
// /products?category=shoes&sort=price
const [searchParams, setSearchParams] = useSearchParams();
const category = searchParams.get("category");

// 4. Local State — useState (only this component needs it / chỉ component này cần)
function ProductCard({ product }) {
  const [isExpanded, setIsExpanded] = useState(false);
}

// 5. Form State — React Hook Form (validation + performance)
function CheckoutForm() {
  const { register, handleSubmit } = useForm<CheckoutData>();
}
```

#### Layer 3: Edge Cases / Trường hợp đặc biệt

1. **State colocation — put state closest to where it's used / đặt state gần nơi dùng nhất:**

```tsx
// ❌ Cart filter state in global store — only CartPage uses it
// ❌ State bộ lọc giỏ hàng ở store toàn cục — chỉ CartPage dùng
const useStore = create((set) => ({
  cartFilter: "all", // only used in 1 component! / chỉ dùng ở 1 component!
}));

// ✅ Colocate — put it in the component that uses it
// ✅ Đặt gần — đặt ở component dùng nó
function CartPage() {
  const [filter, setFilter] = useState("all"); // local is enough / cục bộ là đủ
}
```

2. **Derived state — calculate, DON'T store / tính toán, ĐỪNG lưu trữ:**

```tsx
// ❌ Store both items AND total — must manually sync
// ❌ Lưu cả items VÀ total — phải đồng bộ thủ công
{ items: [...], total: 150 }

// ✅ Only store items, total is calculated / Chỉ lưu items, total là tính toán
const total = useMemo(
  () => items.reduce((sum, i) => sum + i.price, 0),
  [items],
);
```

#### ❌ Common Mistakes / Lỗi thường gặp

| ❌ Mistake / Sai lầm                                                                    | ✅ Correct / Đúng là                                                 | 💡 Why / Tại sao                                                |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------- |
| Everything in 1 global store / Mọi thứ vào 1 store                                      | Classify: server/client/local/URL/form / Phân loại                   | Each type has appropriate tool / Mỗi loại có công cụ phù hợp    |
| Store derived state (total, filtered list) / Lưu state tính toán                        | Recalculate from source state / Tính lại từ state nguồn              | Avoid sync bugs / Tránh lỗi đồng bộ                             |
| Global state for local concern / State toàn cục cho việc cục bộ                         | State colocation — put near usage / Đặt gần nơi dùng                 | Reduce coupling, easier to maintain / Giảm phụ thuộc            |
| Choose library before understanding requirements / Chọn thư viện trước khi hiểu yêu cầu | Analyze state characteristics first / Phân tích đặc tính state trước | Avoid over/under-engineering / Tránh thiết kế quá mức/thiếu mức |

#### 🎯 Interview Pattern

> **Trigger:** "Design state architecture for a large app" / "Thiết kế kiến trúc state cho app lớn"
>
> 🇬🇧 **Opening:** "I classify state into 4 sources: server state uses TanStack Query, shared client state uses Zustand, URL state uses router params, local UI state stays in useState. I don't use one tool for everything — each state type has its optimal tool."
>
> 🇻🇳 **Mở đầu:** "Tôi phân loại state thành 4 nguồn: state từ server dùng TanStack Query, state client chia sẻ dùng Zustand, state URL dùng router params, state giao diện cục bộ giữ useState. Tôi không dùng 1 công cụ cho tất cả — mỗi loại state có công cụ tối ưu riêng."

#### 🔑 Knowledge Chain

📚 **Prerequisite / Cần trước:** All state management tools, component architecture
➡️ **Enables / Mở ra:** Micro-frontend state isolation, SSR state hydration

---

## ❓ Q&A Section / Phần Hỏi & Đáp

### Q1 🟢: What is prop drilling and when does it become a problem? / Prop drilling là gì và khi nào nó thành vấn đề?

💡 **Interview Signal:** Checks your understanding of basic React data flow / Kiểm tra hiểu biết cơ bản về luồng dữ liệu React

🇬🇧 **A:** Prop drilling is passing data from parent to child through many component layers, even when intermediate layers don't use the data. It becomes a problem when: more than 3 layers pass through components that don't use the data, adding one new prop means editing many files, renaming a prop requires refactoring the entire chain. When it's NOT a problem: 1-2 levels with explicit data flow, or when component composition (passing children) can solve it.

🇻🇳 **A:** Prop drilling là truyền dữ liệu từ cha xuống con qua nhiều tầng component, kể cả các tầng ở giữa không dùng dữ liệu đó. Nó thành vấn đề khi: hơn 3 tầng truyền qua component không dùng, thêm 1 prop phải sửa nhiều file, đổi tên prop phải sửa cả chuỗi. Khi KHÔNG phải vấn đề: 1-2 tầng với luồng dữ liệu rõ ràng, hoặc dùng component composition (truyền children) giải quyết được.

```tsx
// App → Layout → Sidebar → UserAvatar → Avatar
// Layout and Sidebar don't use user, just "pass it through"
// Layout và Sidebar không dùng user, chỉ "chuyền tiếp"
function Layout({ user }) {
  return <Sidebar user={user} />; // Layout doesn't need user / Layout không cần user
}
```

---

### Q2 🟢: When to use Context API and what are its limitations? / Context API dùng khi nào và giới hạn gì?

💡 **Interview Signal:** Understanding tradeoffs of built-in solution / Hiểu đánh đổi của giải pháp có sẵn

🇬🇧 **A:** Context is good for data that rarely changes but is needed in many places: theme, language, auth status. Main limitation: no selective subscription — when Provider value changes, ALL consumers re-render, regardless of which field the component uses. Solutions: split context by domain, or use Zustand if frequent updates are needed.

🇻🇳 **A:** Context phù hợp cho dữ liệu ít thay đổi nhưng cần ở nhiều nơi: giao diện sáng/tối, ngôn ngữ, trạng thái đăng nhập. Giới hạn chính: không đăng ký chọn lọc được — khi giá trị Provider thay đổi, TẤT CẢ consumer vẽ lại, bất kể component dùng trường nào. Giải pháp: tách context theo lĩnh vực, hoặc dùng Zustand nếu cần cập nhật thường xuyên.

---

### Q3 🟡: Compare Redux, Zustand, and Context — when to use which? / So sánh Redux, Zustand, Context — khi nào dùng cái nào?

💡 **Interview Signal:** Ability to choose the right tool for the right situation / Khả năng chọn đúng công cụ cho đúng tình huống

🇬🇧 **A:** Context broadcasts to all consumers (no selective subscription), zero bundle cost, good for theme/locale/auth. Zustand has selective subscription built-in, ~1.5kB, minimal boilerplate, good for medium apps. Redux Toolkit has selective subscription via useSelector, ~11kB, has strong DevTools and middleware ecosystem, good for large apps with complex async flows. Decision rule: data that rarely changes → Context; shared state in medium complexity → Zustand; complex async flows with large team → Redux; server data → always TanStack Query.

🇻🇳 **A:** Context phát sóng cho tất cả consumer (không đăng ký chọn lọc), không tốn dung lượng, tốt cho theme/ngôn ngữ/đăng nhập. Zustand có đăng ký chọn lọc sẵn, ~1.5kB, ít code thừa, tốt cho app vừa. Redux Toolkit có đăng ký chọn lọc qua useSelector, ~11kB, DevTools và hệ sinh thái middleware mạnh, tốt cho app lớn với logic bất đồng bộ phức tạp. Quy tắc chọn: dữ liệu ít đổi → Context; state chia sẻ vừa phải → Zustand; logic phức tạp với team lớn → Redux; dữ liệu từ server → luôn dùng TanStack Query.

---

### Q4 🟡: How does Redux middleware work? / Redux middleware hoạt động thế nào?

💡 **Interview Signal:** Understanding advanced Redux pattern / Hiểu mô hình Redux nâng cao

🇬🇧 **A:** Middleware is a function that sits between dispatch and reducer, intercepting every action. The pipeline is: `dispatch(action) → middleware1 → middleware2 → reducer → store`. Thunk middleware lets you dispatch functions instead of objects — enabling async operations like API calls inside the middleware. Key insight: middleware centralizes async logic, logging, error reporting, and analytics at one point instead of scattering in components.

🇻🇳 **A:** Middleware là hàm nằm giữa dispatch và reducer, chặn mỗi action. Đường ống là: `dispatch(action) → middleware1 → middleware2 → reducer → store`. Thunk middleware cho phép gửi hàm thay vì object — cho phép thao tác bất đồng bộ như gọi API bên trong middleware. Ý chính: middleware tập trung logic bất đồng bộ, ghi log, báo lỗi, thống kê ở 1 điểm thay vì rải trong các component.

```tsx
// Custom middleware — logging / ghi log
const logger = (store) => (next) => (action) => {
  console.log("Before:", store.getState());
  const result = next(action); // pass to next middleware or reducer / chuyển tiếp
  console.log("After:", store.getState());
  return result;
};
```

---

### Q5 🟡: When to use TanStack Query instead of Redux for API data? / Khi nào dùng TanStack Query thay vì Redux cho dữ liệu API?

💡 **Interview Signal:** Distinguishing server state vs client state / Phân biệt state server vs state client

🇬🇧 **A:** Always use TanStack Query for server data. Server state characteristics: source of truth lives on the server, can become stale, needs background refetching, needs cache and deduplication, shared across many components. TanStack Query handles ALL of this automatically. Building it yourself with Redux means reinventing the wheel with more bugs.

🇻🇳 **A:** Luôn dùng TanStack Query cho dữ liệu từ server. Đặc tính state từ server: nguồn sự thật nằm trên server, có thể cũ đi, cần tự lấy lại ngầm, cần bản đệm và loại trùng, chia sẻ giữa nhiều component. TanStack Query xử lý TẤT CẢ điều này tự động. Tự xây bằng Redux = phát minh lại bánh xe với nhiều lỗi hơn.

```tsx
// ❌ Redux approach — must manage everything yourself / phải tự quản lý mọi thứ
dispatch(fetchProducts()); // loading state? cache? refetch? retry? ← code it all yourself

// ✅ TanStack Query — all built-in / tất cả có sẵn
const { data, isLoading, error } = useQuery({
  queryKey: ["products"],
  queryFn: getProducts,
  staleTime: 5 * 60 * 1000, // cache 5 minutes / đệm 5 phút
  retry: 3, // retry 3 times if fails / thử lại 3 lần nếu lỗi
});
```

---

### Q6 🔴: Design state architecture for an e-commerce app / Thiết kế kiến trúc state cho app bán hàng

💡 **Interview Signal:** System design thinking — classify and choose appropriate tools / Tư duy thiết kế hệ thống — phân loại và chọn công cụ phù hợp

🇬🇧 **A:**

**Step 1: Identify state categories.** Products and Orders are server state → TanStack Query. Cart is shared client state → Zustand with persist middleware. Auth/User is server + client → TanStack Query for user data + Zustand for tokens. Theme and Locale are client global but rarely change → Context API. Filters and Sort are URL state → useSearchParams (shareable, back button works). Modal/Accordion states are local → useState. Checkout form is form state → React Hook Form.

**Step 2: Data flow rules.** Server data → TanStack Query (NEVER in Zustand/Redux). Cart → Zustand + persist (survives page refresh). Filters → URL params (shareable). UI state → useState (colocated). Forms → React Hook Form.

🇻🇳 **A:**

**Bước 1: Xác định loại state.** Sản phẩm và Đơn hàng là state từ server → TanStack Query. Giỏ hàng là state client chia sẻ → Zustand với persist middleware. Xác thực/User là server + client → TanStack Query cho dữ liệu user + Zustand cho token. Theme và Ngôn ngữ là client toàn cục nhưng ít đổi → Context API. Bộ lọc và Sắp xếp là state URL → useSearchParams (chia sẻ được, nút quay lại hoạt động). Modal/Accordion là cục bộ → useState. Form thanh toán là state form → React Hook Form.

**Bước 2: Quy tắc luồng dữ liệu.** Dữ liệu server → TanStack Query (KHÔNG BAO GIỜ vào Zustand/Redux). Giỏ hàng → Zustand + persist (sống sót khi refresh trang). Bộ lọc → URL params (chia sẻ được). State giao diện → useState (đặt gần nơi dùng). Form → React Hook Form.

| State            | Type / Loại     | Scope / Phạm vi | Tool / Công cụ           |
| ---------------- | --------------- | --------------- | ------------------------ |
| Products, Orders | Server          | Global          | TanStack Query           |
| Cart             | Client shared   | Global          | Zustand + persist        |
| Auth/User        | Server + Client | Global          | TanStack Query + Zustand |
| Theme, Locale    | Client          | Global          | Context API              |
| Filters, Sort    | URL             | Page            | useSearchParams          |
| Modal, Accordion | Client          | Local           | useState                 |
| Checkout form    | Form            | Page            | React Hook Form          |

#### 🔄 Follow-up Chain

**F1: "Cart needs to sync with server — Zustand or TanStack Query?"** → Hybrid approach: Zustand for optimistic local cart, TanStack Query mutation to sync to server, invalidate Zustand store on success.

**F1: "Giỏ hàng cần đồng bộ với server — Zustand hay TanStack Query?"** → Kết hợp: Zustand cho giỏ hàng cục bộ lạc quan, TanStack Query mutation để đồng bộ lên server, cập nhật lại store Zustand khi thành công.

**F2: "Auth state is complex — token refresh, session timeout?"** → TanStack Query for user data, Zustand for auth tokens (need sync access), interceptor for token refresh.

**F2: "State xác thực phức tạp — làm mới token, hết hạn phiên?"** → TanStack Query cho dữ liệu user, Zustand cho token xác thực (cần truy cập đồng bộ), interceptor cho làm mới token.

**F3: "Micro-frontend — each team has its own store, how to share?"** → Zustand stores isolated per micro-FE, shared state via custom events or module federation shared singleton.

**F3: "Micro-frontend — mỗi team có store riêng, làm sao chia sẻ?"** → Store Zustand cách ly cho mỗi micro-FE, state chia sẻ qua custom event hoặc module federation shared singleton.

---

### Q7 🔴: Implement optimistic update with error rollback / Cài đặt cập nhật lạc quan với hoàn tác khi lỗi

💡 **Interview Signal:** Production-level async pattern — UX-first thinking / Mô hình bất đồng bộ cấp sản phẩm — tư duy UX trước

🇬🇧 **A:** Optimistic update means updating the UI immediately before the server responds, then rolling back if it fails. The flow: user clicks → snapshot current data → update UI optimistically → API call runs in background → success? refetch to sync → failure? rollback to snapshot.

🇻🇳 **A:** Cập nhật lạc quan nghĩa là cập nhật giao diện ngay lập tức trước khi server trả lời, rồi hoàn tác nếu thất bại. Luồng: user bấm → chụp lại dữ liệu hiện tại → cập nhật UI lạc quan → gọi API chạy ngầm → thành công? lấy lại để đồng bộ → thất bại? hoàn tác về bản chụp.

```tsx
const toggleTodo = useMutation({
  mutationFn: (id: string) => api.toggleTodo(id),

  // 1. Optimistic update BEFORE API responds / CẬP NHẬT trước khi API trả lời
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ["todos"] });
    const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]); // snapshot / chụp lại
    queryClient.setQueryData<Todo[]>(["todos"], (old) =>
      old?.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
    );
    return { previousTodos }; // for rollback / để hoàn tác
  },

  // 2. Rollback if API fails / Hoàn tác nếu API thất bại
  onError: (err, id, context) => {
    queryClient.setQueryData(["todos"], context?.previousTodos);
    toast.error("Failed to update. Rolled back. / Cập nhật thất bại. Đã hoàn tác.");
  },

  // 3. Always refetch to sync with server / Luôn lấy lại để đồng bộ
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});
```

#### 🔄 Follow-up Chain

**F1: "Race condition — user toggles quickly twice?"** → `cancelQueries` cancels in-flight queries, but mutations still run. Use mutation key + check pending mutations in `onMutate`, or debounce the user action.

**F1: "Xung đột — user bấm nhanh 2 lần?"** → `cancelQueries` hủy query đang chạy, nhưng mutation vẫn chạy. Dùng mutation key + kiểm tra mutation đang chờ trong `onMutate`, hoặc debounce hành động user.

**F2: "Optimistic update for create (no server id yet)?"** → Create a temp id locally, replace with real id when server responds. Or use UUID client-side.

**F2: "Cập nhật lạc quan cho tạo mới (chưa có id từ server)?"** → Tạo id tạm cục bộ, thay bằng id thật khi server trả lời. Hoặc dùng UUID phía client.

---

### Q8 🔴: Why not use Redux for every app? Design an evaluation framework / Tại sao không dùng Redux cho mọi app? Thiết kế framework đánh giá

💡 **Interview Signal:** Architectural judgment — trade-off analysis / Phán đoán kiến trúc — phân tích đánh đổi

🇬🇧 **A:** Redux overhead for apps that don't need it: (1) Boilerplate: slice + actions + selectors + types for each feature, (2) Bundle: +11kB (7x Zustand), (3) Mental model: action → middleware → reducer → store — whole team must understand, (4) Indirection: logic far from component → hard for newcomers to trace.

**Evaluation Framework — SCOPE:** **S**ize (how much shared state? 10+ → Redux), **C**omplexity (complex state logic? sagas? → Redux), **O**bservability (need strong debugging? time-travel? → Redux), **P**eople (team size? 10+ devs needing strict patterns → Redux), **E**cosystem (need RTK Query, middleware? → Redux). Score > 3 → Redux; 1-3 → Zustand; 0 → Context + useState.

🇻🇳 **A:** Chi phí Redux cho app không cần: (1) Code thừa: slice + actions + selectors + types cho mỗi tính năng, (2) Dung lượng: +11kB (gấp 7 lần Zustand), (3) Mô hình: action → middleware → reducer → store — cả team phải hiểu, (4) Gián tiếp: logic xa component → người mới khó theo dõi.

**Framework đánh giá — SCOPE:** **S**ize (bao nhiêu state chia sẻ? 10+ → Redux), **C**omplexity (logic state phức tạp? → Redux), **O**bservability (cần debug mạnh? quay ngược thời gian? → Redux), **P**eople (team lớn? 10+ dev cần quy tắc chặt → Redux), **E**cosystem (cần RTK Query, middleware? → Redux). Điểm > 3 → Redux; 1-3 → Zustand; 0 → Context + useState.

#### 🔄 Follow-up Chain

**F1: "Team is using Redux, should we migrate to Zustand?"** → Not necessarily. Migration cost > benefit if app is stable. New features can use Zustand in parallel.

**F1: "Team đang dùng Redux, có nên chuyển sang Zustand?"** → Không nhất thiết. Chi phí chuyển đổi > lợi ích nếu app đã ổn định. Tính năng mới có thể dùng Zustand song song.

**F2: "Can Zustand fully replace Redux?"** → Almost. Missing: smaller middleware ecosystem, DevTools not as powerful, no RTK Query built-in. But fits 90% of use cases.

**F2: "Zustand có thể thay thế hoàn toàn Redux?"** → Gần như. Thiếu: hệ sinh thái middleware nhỏ hơn, DevTools không mạnh bằng, không có RTK Query sẵn. Nhưng phù hợp 90% trường hợp.

---

## 📋 Q&A Summary Table / Bảng tóm tắt Q&A

| #   | Question / Câu hỏi          | Difficulty | Key Concept / Khái niệm chính       | Interview Signal                               |
| --- | --------------------------- | ---------- | ----------------------------------- | ---------------------------------------------- |
| Q1  | Prop drilling               | 🟢         | Data flow, when it's a problem      | Understands basics / Hiểu cơ bản               |
| Q2  | Context API limits          | 🟢         | Broadcast re-render, split context  | Built-in tradeoffs / Đánh đổi giải pháp có sẵn |
| Q3  | Redux vs Zustand vs Context | 🟡         | Tool selection criteria             | Decision-making / Ra quyết định                |
| Q4  | Redux middleware            | 🟡         | Middleware pipeline, thunk          | Advanced Redux                                 |
| Q5  | TanStack Query vs Redux     | 🟡         | Server state vs client state        | Modern patterns / Mô hình hiện đại             |
| Q6  | E-commerce state design     | 🔴         | State classification + architecture | System design / Thiết kế hệ thống              |
| Q7  | Optimistic updates          | 🔴         | Cache snapshot + rollback           | Production UX                                  |
| Q8  | Redux evaluation framework  | 🔴         | SCOPE framework                     | Architectural judgment / Phán đoán kiến trúc   |

---

## ⚡ Cold Call Simulation / Mô phỏng phỏng vấn bất ngờ

> **"How do you approach state management in React?" / "Bạn tiếp cận quản lý state trong React thế nào?"**

🇬🇧 **30-second opener:** "First I classify state by source: server state uses TanStack Query because it needs cache and sync, client state splits into global shared state using Zustand for selective subscription, and local state using useState colocated near the component. Context is only for rarely-changing data like theme because it broadcasts to all consumers. URL params for filterable state so it's shareable. I DON'T put everything in one store — each type of state has its own optimal tool."

🇻🇳 **Mở đầu 30 giây:** "Trước hết tôi phân loại state theo nguồn: state từ server dùng TanStack Query vì cần bản đệm và đồng bộ, state client chia thành state toàn cục dùng Zustand cho đăng ký chọn lọc, state cục bộ dùng useState đặt gần component. Context chỉ cho dữ liệu ít đổi như giao diện sáng/tối vì nó phát sóng cho tất cả consumer. URL params cho state lọc để chia sẻ được. Tôi KHÔNG đặt mọi thứ vào 1 store — mỗi loại state có công cụ tối ưu riêng."

---

## 🧪 Self-Check / Tự kiểm tra

> Close this document. Answer from memory. / Đóng tài liệu lại. Trả lời từ trí nhớ.

### Retrieval / Nhớ lại

- [ ] What is the re-render problem with Context API? / Context API có vấn đề gì về vẽ lại?
- [ ] What are the steps in Redux data flow? / Luồng dữ liệu Redux gồm những bước nào?
- [ ] How is Zustand different from Redux? / Zustand khác Redux ở những điểm nào?

### Visual / Hình dung

- [ ] Draw: action → middleware → reducer → store → UI
- [ ] Draw comparison: Context broadcast vs Zustand selective subscribe

### Application / Áp dụng

- [ ] Classify state for an app you're building: server/client/URL/form/local / Phân loại state cho app đang làm
- [ ] Implement a Zustand store for cart with persist middleware / Viết Zustand store cho giỏ hàng với persist

### Debug / Gỡ lỗi

- [ ] Entire app re-renders when Context value changes — how to fix? / Toàn bộ app vẽ lại khi Context đổi — sửa thế nào?
- [ ] useSelector returns new array every time — what to use? / useSelector trả mảng mới mỗi lần — dùng gì?

### Teach / Giảng lại

- [ ] Explain to a junior: why not put API data in Redux? / Giải thích: tại sao không đặt dữ liệu API vào Redux?
- [ ] Explain the SCOPE framework to a team lead / Giải thích framework SCOPE cho trưởng nhóm

### 🗣️ Feynman Prompt

> Explain to someone who doesn't know React: "Why do you need state management?" / Giải thích cho người chưa biết React: "Tại sao cần quản lý state?"

### 🔁 Spaced Repetition / Lặp lại cách quãng

- Day 3: Redraw the concept map from memory / Vẽ lại bản đồ khái niệm từ trí nhớ
- Day 7: Write a comparison table: Context vs Zustand vs Redux / Viết bảng so sánh
- Day 14: Design state architecture for a real app (e.g., social media) / Thiết kế kiến trúc state cho app thực tế

---

## 🔗 Connections / Liên kết

| Concept / Khái niệm           | Related Topic / Chủ đề liên quan | File                           |
| ----------------------------- | -------------------------------- | ------------------------------ |
| useContext, useReducer        | Hooks Deep Dive                  | 03-hooks-deep-dive.md          |
| Context splitting             | Performance Optimization         | 09-performance-optimization.md |
| Compound Components + Context | Advanced Patterns                | 04-advanced-patterns.md        |
| State for testing             | Testing Strategy                 | 06-testing.md                  |
| Concurrent state updates      | Modern React Features            | 10-modern-react-features.md    |

---

## Quick Recap / Tóm Tắt Nhanh

### Key Takeaways / Điểm Chính

- **Context API re-render problem**: every consumer re-renders when context value changes — even if the consuming component only uses part of the data; fix by splitting context or memoizing the value / Context API gây re-render toàn bộ consumer khi value thay đổi; fix bằng cách tách context hoặc memo hóa value.
- **Redux** enforces unidirectional data flow: `action → reducer → store → view`; Redux Toolkit eliminates the boilerplate with `createSlice` and `createAsyncThunk` / Redux thực thi luồng dữ liệu một chiều; Redux Toolkit giảm boilerplate với `createSlice`.
- **Zustand** is a minimal store with no boilerplate — just define state + actions in one object; no Provider needed; great for medium-scale apps / Zustand là store tối giản không cần Provider; phù hợp cho app quy mô vừa.
- **Jotai** and **Recoil** use atom-based state — individual reactive pieces that components subscribe to; avoids top-level re-renders entirely / Jotai/Recoil dùng atom — mỗi atom là đơn vị state độc lập, tránh re-render từ trên xuống.
- **Server state ≠ client state**: async data from APIs (loading/error/cache/refetch) is fundamentally different from UI state; use **TanStack Query** or **SWR** for server state — don't mix with Redux / State từ server khác state UI; dùng TanStack Query/SWR cho server state, không trộn vào Redux.
- **State architecture rule**: co-locate state as close to where it's used as possible; only lift to a shared store when truly needed / Đặt state gần nơi dùng nhất; chỉ đưa lên store chung khi thực sự cần.
- **Selector pattern** (in Redux/Zustand) prevents unnecessary re-renders by subscribing to only the slice of state a component needs / Pattern selector ngăn re-render thừa bằng cách subscribe đúng phần state cần.

### Interview Tips / Mẹo Phỏng Vấn

- When asked "Redux vs Context", the answer is **not either/or**: use Context for low-frequency global values (theme, auth), Redux/Zustand for frequently-changing shared state / Khi hỏi Redux vs Context: không phải chọn một — Context cho giá trị ít thay đổi, Redux/Zustand cho state thay đổi thường xuyên.
- Always distinguish **server state** (TanStack Query) from **client state** (Zustand/Redux) — this separation shows senior-level architecture thinking / Luôn phân biệt server state và client state — điều này thể hiện tư duy kiến trúc cấp senior.
- For Redux questions, mention **selectors and memoization** (`createSelector`/`reselect`) to show you understand the performance implications / Với câu hỏi Redux, đề cập selector và memoization để thể hiện hiểu về performance.
- Zustand vs Redux trade-off: Zustand has less structure (faster to build, harder to debug at scale); Redux has more ceremony (slower, but DevTools + time-travel debugging) / Trade-off Zustand vs Redux: ít cấu trúc hơn vs nhiều ceremony nhưng debug tốt hơn ở scale lớn.
- If asked to design state for a complex app, segment your answer: local UI state, shared client state, server state, and URL state — four distinct categories / Khi thiết kế state cho app phức tạp, phân chia 4 loại: local UI, shared client, server state, URL state.
