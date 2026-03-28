# React Performance Optimization / Tối Ưu Hiệu Năng React

| Thuộc tính          | Giá trị                                                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Track**           | Frontend — React                                                                                                                                  |
| **Difficulty**      | 🟡 Mid → 🔴 Senior                                                                                                                                |
| **Prerequisites**   | 01-react-fundamentals (Render/Commit, Fiber), 03-hooks-deep-dive (useMemo, useCallback), 07-hooks-comprehensive (useTransition, useDeferredValue) |
| **See also**        | 08-react-patterns-advanced, 02-react-19-features (React Compiler)                                                                                 |
| **L5 Competencies** | Performance Engineering, System Optimization, Profiling & Measurement                                                                             |

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn nhận bug report: "Trang **Dashboard** load chậm, khi click tab, phải đợi 2-3 giây mới chuyển. Trên mobile thì gần như không dùng được."

Dashboard có: 1 chart component (re-render mỗi khi data thay đổi), 1 table 5000 rows, 3 filter dropdowns, và 1 sidebar navigation. **Mọi thứ re-render khi click bất kỳ đâu.**

Junior dev thêm `React.memo()` khắp nơi → app phức tạp hơn nhưng chỉ nhanh hơn 5%. Tại sao? Vì **memo không phải giải pháp chính** — vấn đề nằm ở **kiến trúc component**, không phải thiếu memoization.

File này dạy bạn approach performance đúng cách: **đo trước, hiểu nguyên nhân, fix đúng chỗ**.

---

**Bạn đang ở đây trong lộ trình học:**

```
07-hooks-comprehensive (useTransition/useDeferredValue) → [PERFORMANCE OPTIMIZATION] → 10-modern-react-features
```

---

## Concept Map / Bản Đồ Khái Niệm

```
            Performance Optimization
                     │
      ┌──────────────┼──────────────┐
      │              │              │
  Prevention     Deferral      Measurement
  (Ngăn chặn)   (Hoãn lại)    (Đo lường)
      │              │              │
┌─────┴─────┐  ┌─────┴─────┐  ┌────┴─────┐
│State       │  │useTransit.│  │React     │
│Colocation  │  │useDeferr. │  │DevTools  │
│Composition │  │Code Split │  │Profiler  │
│Context     │  │Lazy Load  │  │why-did-  │
│Splitting   │  │Virtualiz. │  │you-render│
│React.memo  │  │           │  │          │
│(last resort)│  │           │  │          │
└───────────┘  └───────────┘  └──────────┘
      │              │              │
      └──────────────┼──────────────┘
                     ▼
         Optimization Order:
         1. Measure (đo)
         2. Prevent (ngăn chặn)
         3. Defer (hoãn lại)
         4. Memo (cache — cuối cùng)
```

---

## Overview / Tổng Quan

React performance optimization follows a clear hierarchy: **architecture first, memoization last**. Most performance problems come from unnecessary re-renders caused by poor state placement, not from missing `React.memo`.

Tối ưu hiệu năng React theo thứ tự ưu tiên: **kiến trúc trước, memo sau**. 90% vấn đề performance đến từ state đặt sai chỗ, không phải thiếu memoization. Trong phỏng vấn, nói "tôi sẽ thêm React.memo" = junior. Nói "tôi sẽ **đo trước**, rồi **di chuyển state**, rồi mới **memo nếu cần**" = senior.

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. Re-render Prevention Architecture / Kiến Trúc Ngăn Re-render

> 🧠 **Memory Hook**: "Tối ưu React = **dọn nhà trước khi mua tủ** — di chuyển đồ đúng phòng (state colocation) trước khi mua thêm tủ chứa (memo)."

**Tại sao tồn tại? / Why does this exist?**
React re-render **toàn bộ subtree** khi parent re-render. Nếu state nằm ở component cao (App), mỗi state change re-render **mọi component** bên dưới — kể cả component không dùng state đó.
→ **Why?** Vì React không tự biết component con có depend vào state parent không — nó re-render hết rồi diff (reconciliation) để tìm thay đổi thật.
→ **Why?** Vì React ưu tiên **correctness over performance** — render thừa an toàn hơn render thiếu. Nhưng bạn cần giúp React render ít hơn bằng cách đặt state đúng chỗ.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Bạn sống trong **chung cư 20 tầng**. Mỗi khi tầng 1 thay bóng đèn (state change), ban quản lý ra lệnh: **"TẤT CẢ 20 tầng kiểm tra đèn!"** — dù chỉ tầng 1 thay đổi.

Cách fix:

1. **State Colocation** (dọn đồ đúng phòng): Chuyển công tắc đèn tầng 1 về **phòng tầng 1** — chỉ tầng 1 kiểm tra.
2. **Composition** (tách phòng): Chia tầng 1 thành phòng riêng — thay đèn phòng A, phòng B không ảnh hưởng.
3. **React.memo** (gắn biển "không liên quan"): Mỗi tầng treo biển "đèn tầng này OK" → ban quản lý skip kiểm tra.

**Ưu tiên**: Dọn đúng phòng (1) > Tách phòng (2) > Treo biển (3). Treo biển nhiều quá → tốn tiền in biển (memo overhead).

#### Layer 2: How It Works / Cơ Chế Hoạt Động

**Pattern 1: State Colocation (Di chuyển state xuống)**

```tsx
// ❌ BAD: state ở quá cao — toàn bộ Page re-render khi hover thay đổi
function Page() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  return (
    <div>
      <Header /> {/* Re-render không cần thiết */}
      <Sidebar /> {/* Re-render không cần thiết */}
      <ProductList hoveredId={hoveredId} onHover={setHoveredId} />
    </div>
  );
}

// ✅ GOOD: state colocate xuống component cần dùng
function Page() {
  return (
    <div>
      <Header /> {/* Không re-render */}
      <Sidebar /> {/* Không re-render */}
      <ProductList /> {/* Chỉ component này re-render */}
    </div>
  );
}

function ProductList() {
  const [hoveredId, setHoveredId] = useState<string | null>(null); // State ở đây!
  return (
    <ul>
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          isHovered={hoveredId === p.id}
          onHover={() => setHoveredId(p.id)}
        />
      ))}
    </ul>
  );
}
```

**Pattern 2: Composition (Children as Props)**

```tsx
// ❌ BAD: ScrollTracker re-render → children re-render
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div>
      <ScrollIndicator position={scrollY} />
      <ExpensiveContent /> {/* Re-render mỗi scroll! */}
    </div>
  );
}

// ✅ GOOD: Children passed as props — không re-render
function ScrollTracker({ children }: { children: React.ReactNode }) {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div>
      <ScrollIndicator position={scrollY} />
      {children} {/* Không re-render! Đã tạo từ parent */}
    </div>
  );
}

// Usage
<ScrollTracker>
  <ExpensiveContent /> {/* React element tạo ở parent, reference ổn định */}
</ScrollTracker>;
```

```
Re-render Prevention Priority:

  1. State Colocation          ───── FREE (chỉ di chuyển code)
     "Đặt state đúng chỗ"           Hiệu quả: ⭐⭐⭐⭐⭐
                                     Cost: ZERO

  2. Composition               ───── FREE (restructure JSX)
     "Children as props"             Hiệu quả: ⭐⭐⭐⭐
                                     Cost: ZERO

  3. Context Splitting         ───── LOW (tách context)
     "1 context = 1 concern"         Hiệu quả: ⭐⭐⭐⭐
                                     Cost: Thêm code setup

  4. React.memo                ───── MEDIUM (so sánh props)
     "Cache component"               Hiệu quả: ⭐⭐⭐
                                     Cost: Shallow compare mỗi render

  5. useMemo / useCallback     ───── MEDIUM (cache value/func)
     "Cache computation"             Hiệu quả: ⭐⭐
                                     Cost: Memory + deps comparison
```

**Pattern 3: Context Splitting**

```tsx
// ❌ BAD: 1 context chứa tất cả → mọi consumer re-render
const AppContext = createContext({ user: null, theme: "light", locale: "vi" });

// ✅ GOOD: Tách context theo concern
const UserContext = createContext<User | null>(null);
const ThemeContext = createContext("light");
const LocaleContext = createContext("vi");

// Component chỉ dùng theme → chỉ re-render khi theme đổi
function ThemeToggle() {
  const theme = useContext(ThemeContext); // Không bị re-render khi user đổi
  return <button>{theme}</button>;
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **React.memo overhead**: `React.memo` shallow compare tất cả props mỗi render. Nếu component đã nhẹ → memo overhead > re-render cost → chậm hơn.
- **Object/function props**: `React.memo` dùng `===` comparison. Object mới mỗi render → memo luôn fail. Cần `useMemo`/`useCallback` cho props.
- **React Compiler (React 19)**: Auto-memoization at build time → bạn có thể không cần manual memo trong tương lai.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                 | Tại sao sai                                 | Đúng là                                            |
| --------------------------------------- | ------------------------------------------- | -------------------------------------------------- |
| Thêm React.memo khắp nơi                | Overhead comparison, không giải quyết gốc   | Di chuyển state trước, memo chỉ khi đo thấy cần    |
| Memo component nhưng pass inline object | `{...}` tạo reference mới → memo luôn fail  | `useMemo` cho objects, `useCallback` cho functions |
| Tối ưu trước khi đo                     | Premature optimization, fix sai chỗ         | **Measure first** — React DevTools Profiler        |
| Gộp hết state vào 1 context             | Mọi consumer re-render khi bất kỳ value đổi | Tách context theo concern                          |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "prevent re-renders", "React performance", "React.memo", "optimization"
- → Nhớ đến: Dọn nhà trước khi mua tủ, 5 patterns ranked
- → Mở đầu trả lời: _"Tối ưu React theo thứ tự: đo trước, rồi state colocation, composition, context splitting, và cuối cùng mới React.memo. 90% vấn đề giải quyết bằng 3 cái đầu — miễn phí, không thêm complexity."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [React Fundamentals — Render/Commit](./01-react-fundamentals.md) — hiểu tại sao re-render xảy ra
- ➡️ Để hiểu tiếp: [Code Splitting & Virtualization](#2-code-splitting--virtualization--chia-nhỏ--ảo-hóa) — khi prevention không đủ

---

### 2. Code Splitting & Virtualization / Chia Nhỏ & Ảo Hóa

> 🧠 **Memory Hook**: "Code Splitting = **ship hàng nhiều chuyến** — đừng chở tất cả 1 lần (bundle lớn). Virtualization = **cửa sổ di động** — chỉ render những gì user nhìn thấy."

**Tại sao tồn tại? / Why does this exist?**
Initial bundle size lớn → user chờ download + parse JS lâu trước khi thấy UI. Long lists (10,000 items) → DOM nodes quá nhiều → browser lag khi render/scroll.
→ **Why?** Vì browser phải download, parse, execute **toàn bộ JS** trước khi render. Code user chưa cần (settings page khi ở home page) vẫn phải tải.
→ **Why?** Vì network bandwidth và device CPU là tài nguyên hữu hạn — đặc biệt trên mobile 3G.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

**Code Splitting**: Bạn đặt **đồ ăn delivery**. Nhà hàng có thể: (A) chở TẤT CẢ menu 500 món đến nhà bạn → chờ rất lâu. Hoặc (B) chở **món bạn gọi** trước, menu tráng miệng chở sau khi bạn ăn xong → nhanh hơn nhiều.

**Virtualization**: Bạn xem **danh bạ điện thoại** 10,000 contacts. Điện thoại không render 10,000 dòng — nó chỉ render **20 dòng bạn đang thấy trên màn hình**. Scroll xuống → 20 dòng mới xuất hiện, 20 dòng cũ biến mất.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

**Code Splitting với React.lazy + Suspense:**

```tsx
import { lazy, Suspense } from "react";

// ❌ Static import — tải ngay dù chưa cần
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";

// ✅ Lazy import — chỉ tải khi cần
const Settings = lazy(() => import("./pages/Settings"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Analytics = lazy(() => import("./pages/Analytics"));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} /> {/* Chỉ tải khi vào /settings */}
        <Route path="/analytics" element={<Analytics />} /> {/* Chỉ tải khi vào /analytics */}
      </Routes>
    </Suspense>
  );
}
```

```
Code Splitting Effect:

  Không split:
  ┌──────────────────────────────────────┐
  │         main.bundle.js (2MB)          │ ← User chờ download 2MB
  │  Home + Settings + Analytics + ...    │
  └──────────────────────────────────────┘

  Có split:
  ┌──────────────┐
  │ main.js (500KB)│ ← User chỉ chờ 500KB
  │ Home page only │
  └──────────────┘
       ↓ khi vào /settings
  ┌──────────────┐
  │settings.js    │ ← Lazy load khi cần
  │(200KB)        │
  └──────────────┘
```

**Virtualization với @tanstack/react-virtual:**

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length, // 10,000 items
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Estimated row height
    overscan: 5, // Render 5 extra items above/below viewport
  });

  return (
    <div ref={parentRef} style={{ height: "400px", overflow: "auto" }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: "absolute",
              top: 0,
              transform: `translateY(${virtualRow.start}px)`,
              height: `${virtualRow.size}px`,
              width: "100%",
            }}
          >
            <ItemRow data={items[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

```
Virtualization Visual:

  Full List (10,000 items)     Virtualized (chỉ render ~25)
  ┌─────────────────┐          ┌─────────────────┐
  │ Item 1          │          │                 │ ← Spacer (CSS height)
  │ Item 2          │          │                 │
  │ ...             │          │                 │
  │ Item 998        │          │                 │
  │ Item 999        │          ├─────────────────┤
  │ ████████████████│ viewport │ Item 1000 ██████│ ← Chỉ render items
  │ ████████████████│ =======> │ Item 1001 ██████│   trong viewport
  │ ████████████████│          │ ...       ██████│   + overscan
  │ Item 1025       │          │ Item 1024 ██████│
  │ Item 1026       │          ├─────────────────┤
  │ ...             │          │                 │ ← Spacer (CSS height)
  │ Item 10000      │          │                 │
  └─────────────────┘          └─────────────────┘
  10,000 DOM nodes             ~25 DOM nodes ← 400x ít hơn!
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Code Splitting waterfall**: Lazy component fetch JS → JS fetch data → double wait. Fix: preload component hoặc fetch data song song.
- **Virtualization search/select all**: Ctrl+A chỉ select items đang render. Cần logic riêng cho "select all" trên full dataset.
- **Variable row height**: `estimateSize` nếu sai → scroll jump. Cần `measureElement` cho dynamic content.
- **SSR + lazy**: `React.lazy` chỉ client-side. Dùng `next/dynamic` hoặc framework-specific lazy cho SSR.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                        | Tại sao sai                                       | Đúng là                                           |
| ------------------------------ | ------------------------------------------------- | ------------------------------------------------- |
| Lazy load MỌI component        | Overhead fetch > benefit cho component nhỏ        | Chỉ lazy load routes/heavy components (>30KB)     |
| Virtualize list 20 items       | Overhead > benefit cho list nhỏ                   | Chỉ virtualize khi >100 items hoặc complex rows   |
| Quên Suspense fallback         | Flash of nothing → bad UX                         | Skeleton/spinner trong Suspense fallback          |
| Virtualization + CSS animation | Animation trên absolute positioned items phức tạp | Đơn giản hóa animation hoặc tắt cho virtual items |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "bundle size", "initial load", "large lists", "code splitting"
- → Nhớ đến: Ship hàng nhiều chuyến, cửa sổ di động
- → Mở đầu trả lời: _"Code splitting chia bundle thành chunks nhỏ, chỉ tải khi cần — giảm initial load time. Virtualization chỉ render items trong viewport — biến 10,000 DOM nodes thành ~25. Cả 2 đều giải quyết vấn đề 'quá nhiều thứ cùng lúc'."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Re-render Prevention](#1-re-render-prevention-architecture--kiến-trúc-ngăn-re-render) — fix architecture trước
- ➡️ Để hiểu tiếp: [Profiling & Measurement](#3-profiling--measurement--đo-lường--phân-tích) — verify optimization đúng chỗ

---

### 3. Profiling & Measurement / Đo Lường & Phân Tích

> 🧠 **Memory Hook**: "Measure before optimize = **đi khám trước khi uống thuốc** — đừng uống kháng sinh khi chỉ bị cảm."

**Tại sao tồn tại? / Why does this exist?**
Developers thường **đoán** vấn đề performance thay vì **đo**. Kết quả: optimize sai chỗ, thêm complexity không cần thiết, performance không cải thiện.
→ **Why?** Vì intuition thường sai — component bạn nghĩ chậm có thể render 0.1ms, trong khi component "đơn giản" lại render 50ms vì fetch data.
→ **Why?** Vì "you can't improve what you don't measure" — cần data, không cần gut feeling.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Bạn đi khám bệnh. Bác sĩ **không bao giờ** cho thuốc trước khi **kiểm tra** (đo huyết áp, xét nghiệm máu, X-quang). Nếu bác sĩ chỉ nhìn mặt bạn rồi kê thuốc → nguy hiểm.

Performance optimization cũng vậy:

1. **Đo** (React DevTools Profiler, Performance tab)
2. **Chẩn đoán** (tìm component chậm nhất)
3. **Điều trị** (apply đúng pattern)
4. **Kiểm tra lại** (đo lại sau fix)

#### Layer 2: How It Works / Cơ Chế Hoạt Động

**Tool 1: React DevTools Profiler**

```
Cách dùng:
1. Mở React DevTools → tab "Profiler"
2. Click "Record" → thao tác trên app → "Stop"
3. Xem Flamegraph:

  Flamegraph (mỗi bar = 1 component render):

  ┌──────────────────────────────────────────┐
  │ App (2.1ms)                               │
  ├──────────────┬───────────────────────────┤
  │ Header       │ Dashboard (1.8ms) ← CHẬM  │
  │ (0.1ms)      ├──────────┬───────────────┤
  │              │ Chart    │ Table (1.2ms)  │ ← TÌM THẤY!
  │              │ (0.4ms)  │               │
  └──────────────┴──────────┴───────────────┘

  → Table render 1.2ms, chiếm 67% tổng thời gian
  → Fix Table trước, không phải Header (0.1ms)
```

**Tool 2: React Profiler Component (code-based)**

```tsx
import { Profiler, ProfilerOnRenderCallback } from "react";

const onRender: ProfilerOnRenderCallback = (
  id, // Component id
  phase, // "mount" | "update"
  actualDuration, // Thời gian render (ms)
  baseDuration, // Thời gian nếu không cache
  startTime,
  commitTime,
) => {
  if (actualDuration > 16) {
    // > 1 frame (60fps = 16ms/frame)
    console.warn(`Slow render: ${id} took ${actualDuration.toFixed(1)}ms`);
  }
};

// Wrap component cần đo
<Profiler id="ProductTable" onRender={onRender}>
  <ProductTable data={products} />
</Profiler>;
```

**Tool 3: why-did-you-render (development only)**

```tsx
// Cài: npm i @welldone-software/why-did-you-render --save-dev

// Setup (chỉ dev)
if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}

// Component bạn muốn track
ProductTable.whyDidYouRender = true;

// Console output:
// ProductTable: Re-rendered because props changed:
//   items: [{...}] !== [{...}]  ← Object reference khác dù data giống!
```

```
Performance Optimization Workflow:

  ┌──────────────┐
  │ 1. MEASURE   │ React DevTools Profiler
  │    Đo trước  │ → Tìm component chậm nhất
  └──────┬───────┘
         ▼
  ┌──────────────┐
  │ 2. IDENTIFY  │ why-did-you-render
  │    Tìm cause │ → Tại sao component re-render?
  └──────┬───────┘
         ▼
  ┌──────────────┐  State đặt sai chỗ? → Colocation
  │ 3. FIX       │  Children re-render? → Composition
  │    Apply fix  │  Context quá lớn?   → Split context
  └──────┬───────┘  Vẫn chậm?          → React.memo + useMemo
         ▼
  ┌──────────────┐
  │ 4. VERIFY    │ Đo LẠI bằng Profiler
  │    Đo lại    │ → Có thực sự nhanh hơn không?
  └──────────────┘
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Development ≠ Production**: React DevTools adds overhead. Production build nhanh hơn. `React.Profiler` hoạt động cả production nếu enable.
- **StrictMode double render**: React 18 StrictMode render 2 lần (dev only) → Profiler shows double. Đừng optimize cho StrictMode artifacts.
- **Core Web Vitals**: LCP (Largest Contentful Paint), INP (Interaction to Next Paint), CLS (Cumulative Layout Shift) — metrics thực tế Google dùng.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm               | Tại sao sai                              | Đúng là                                   |
| --------------------- | ---------------------------------------- | ----------------------------------------- |
| Optimize mà không đo  | Fix sai chỗ, thêm complexity vô ích      | Profiler → identify → fix → verify        |
| Đo trong dev mode     | Dev mode chậm hơn production 3-10x       | Dùng production build cho benchmarks      |
| Chỉ nhìn render count | Render nhiều nhưng nhanh = OK            | Nhìn **render duration**, không chỉ count |
| Ignore INP metric     | Click → 200ms delay = bad UX dù FCP fast | Đo cả interaction responsiveness          |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "profile React app", "find performance bottleneck", "measure performance"
- → Nhớ đến: Đi khám trước khi uống thuốc
- → Mở đầu trả lời: _"Bước đầu tiên luôn là đo — dùng React DevTools Profiler để tìm component nào chậm nhất, rồi why-did-you-render để biết tại sao nó re-render. Không bao giờ optimize dựa trên gut feeling."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Re-render Prevention](#1-re-render-prevention-architecture--kiến-trúc-ngăn-re-render) — biết patterns để apply sau khi đo
- ➡️ Để hiểu tiếp: Web Performance (Core Web Vitals) — metrics ở level cao hơn component

---

## Q&A Section / Câu Hỏi Phỏng Vấn

### Q1: When should you use React.memo? / Khi nào nên dùng React.memo? 🟢 Junior

**A:** Use `React.memo` when a component:

1. **Renders often** with the same props (parent re-renders frequently)
2. **Is expensive to render** (complex calculations, large DOM tree)
3. **Props are stable** (primitives, or objects wrapped in useMemo)

Dùng `React.memo` khi component **render thường xuyên với cùng props** VÀ **render tốn thời gian**. Nếu component render nhanh (< 1ms), memo overhead (shallow compare) có thể **chậm hơn** re-render.

Quan trọng: `React.memo` là **giải pháp cuối cùng**, không phải đầu tiên. Trước đó hãy thử state colocation và composition — cả 2 đều miễn phí.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu 3 điều kiện (frequent + expensive + stable props), nói memo là **last resort**, nhắc overhead
- ❌ Weak: "Dùng React.memo để tối ưu performance" mà không nêu điều kiện và trade-offs

---

### Q2: What are the 3 most effective ways to prevent unnecessary re-renders WITHOUT memoization? / 3 cách hiệu quả nhất ngăn re-render thừa mà KHÔNG dùng memo? 🟢 Junior

**A:**

1. **State Colocation**: Move state down to the component that uses it. If only `SearchInput` needs `query` state, don't put it in `App`.
2. **Composition (children as props)**: Pass children as `{children}` prop — React elements created by parent keep stable reference.
3. **Context Splitting**: Split large context into smaller, focused contexts. Component consuming `ThemeContext` won't re-render when `UserContext` changes.

3 cách **miễn phí** (không thêm code complexity):

1. **State colocation**: Đưa state xuống component cần dùng → parent không re-render
2. **Composition**: Truyền children qua props → children giữ reference ổn định
3. **Tách context**: 1 context = 1 concern → giảm subscribers bị ảnh hưởng

Cả 3 đều hiệu quả hơn `React.memo` vì **ngăn re-render từ gốc** thay vì **so sánh props để skip re-render**.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu đúng 3 patterns, giải thích tại sao **hiệu quả hơn memo**, cho code example
- ❌ Weak: Chỉ biết React.memo/useMemo, không biết architecture-level solutions

---

### Q3: How does useTransition differ from debounce for search optimization? / useTransition khác debounce như thế nào khi tối ưu search? 🟡 Mid

**A:**

| Aspect                | Debounce                                 | useTransition                                |
| --------------------- | ---------------------------------------- | -------------------------------------------- |
| **Mechanism**         | Fixed delay (300ms) regardless of device | React-controlled adaptive delay              |
| **What it delays**    | Function call (API, setState)            | Render work priority                         |
| **Device adaptation** | Same delay on iPhone 15 and old Android  | Fast device → near-zero delay, slow → longer |
| **Interruption**      | Timer-based, not interruptible           | React can interrupt and restart              |
| **Use case**          | API calls (network)                      | CPU-heavy renders (computation)              |

Debounce delay cố định — máy nhanh hay chậm đều chờ 300ms. `useTransition` để React **tự quyết** — trên iPhone 15 gần như instant, trên máy cũ delay tự tăng. Debounce cho **network calls** (API), useTransition cho **render work** (filter 10,000 items).

Kết hợp cả 2: debounce API call + useTransition cho render heavy results.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: So sánh bảng rõ ràng, nêu device adaptation, biết kết hợp cả 2
- ❌ Weak: "useTransition nhanh hơn debounce" mà không giải thích **mechanism khác nhau**

---

### Q4: How would you diagnose and fix a React app that's slow on interaction? / Cách chẩn đoán và fix React app chậm khi tương tác? 🟡 Mid

**A:** Follow the **Measure → Identify → Fix → Verify** workflow:

**Step 1: Measure** — Open React DevTools Profiler, record the slow interaction, identify the component with highest `actualDuration`.

**Step 2: Identify** — Use `why-did-you-render` to find WHY that component re-renders. Common causes:

- Parent state change cascading down
- Context value changing
- Inline object/function props creating new references

**Step 3: Fix** — Apply the right pattern based on cause:

- State too high → state colocation
- Parent re-render → composition / `React.memo`
- Context too broad → split context
- Heavy computation → `useMemo`
- Large list → virtualization
- Heavy component → code splitting

**Step 4: Verify** — Re-measure with Profiler. If `actualDuration` decreased significantly, the fix worked.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Structured workflow (measure → identify → fix → verify), nêu cụ thể tools từng bước
- ❌ Weak: "Thêm React.memo" mà không đo trước, không verify sau

---

### Q5: You have a dashboard with 5 widgets, all re-rendering when any filter changes. Walk through your optimization strategy. / Dashboard 5 widgets, tất cả re-render khi bất kỳ filter nào đổi. Trình bày strategy tối ưu. 🔴 Senior

**A:**

**Step 1: Measure** — Profile to find which widgets are slow. If Widget C takes 200ms and others take 2ms → focus on Widget C first.

**Step 2: Analyze state architecture**

```tsx
// ❌ Likely current: all state in Dashboard parent
function Dashboard() {
  const [dateFilter, setDateFilter] = useState(/*...*/);
  const [statusFilter, setStatusFilter] = useState(/*...*/);
  const [regionFilter, setRegionFilter] = useState(/*...*/);

  return (
    <>
      <RevenueChart date={dateFilter} /> {/* Re-render khi status đổi! */}
      <OrderTable status={statusFilter} /> {/* Re-render khi date đổi! */}
      <UserMap region={regionFilter} /> {/* Re-render khi status đổi! */}
      <MetricsPanel date={dateFilter} />
      <ActivityFeed /> {/* Re-render không cần! */}
    </>
  );
}
```

**Step 3: Apply fixes (in order)**

```tsx
// Fix 1: State Colocation — move filters to FilterBar component
function Dashboard() {
  return (
    <FilterProvider>
      {" "}
      {/* Context cho filters */}
      <FilterBar /> {/* Filter state sống ở đây */}
      <WidgetGrid /> {/* Widgets subscribe selectively */}
    </FilterProvider>
  );
}

// Fix 2: Context Splitting — mỗi filter = 1 context
const DateFilterContext = createContext<DateFilter>(/*...*/);
const StatusFilterContext = createContext<StatusFilter>(/*...*/);

// Fix 3: Selective subscription — widget chỉ subscribe filter nó cần
function RevenueChart() {
  const dateFilter = useContext(DateFilterContext); // CHỈ re-render khi date đổi
  // ...
}

// Fix 4: useTransition cho heavy widgets
function OrderTable() {
  const statusFilter = useContext(StatusFilterContext);
  const [isPending, startTransition] = useTransition();
  const deferredFilter = useDeferredValue(statusFilter);
  // ...render with deferredFilter
}

// Fix 5: Virtualization cho table 5000 rows
// Fix 6: React.memo cho widgets đã optimize hết cách khác
```

**Step 4: Verify** — Re-profile. Target: mỗi widget render < 16ms (60fps).

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Structured approach (measure → analyze → fix in priority order → verify), biết không phải tất cả fixes cần thiết
- ❌ Weak: Jump to "React.memo all widgets" mà không analyze root cause

**🔗 Follow-up Chain:**

1. "Nếu sau tất cả fixes, 1 widget vẫn chậm 100ms?" → Web Worker cho computation, hoặc server-side rendering widget đó
2. "Cách monitor performance trong production?" → React Profiler API + custom metrics + Core Web Vitals tracking
3. "React Compiler có giải quyết hết không?" → Auto-memo giúp nhưng không fix architecture issues (state placement, context splitting)

---

### Q6: Compare React.memo, useMemo, and useCallback — when to use each? / So sánh React.memo, useMemo, và useCallback — khi nào dùng từng cái? 🟡 Mid

**A:**

| Tool          | What it caches              | When to use                                               |
| ------------- | --------------------------- | --------------------------------------------------------- |
| `React.memo`  | **Component render result** | Prevent re-render of child when props unchanged           |
| `useMemo`     | **Computed value**          | Cache expensive calculation or stabilize object reference |
| `useCallback` | **Function reference**      | Stabilize function passed as prop to memoized child       |

Chúng hoạt động **cùng nhau**: `React.memo` chỉ hiệu quả khi props có **stable reference**. Nếu pass inline object/function → reference mới mỗi render → memo luôn fail. `useMemo` stabilize objects, `useCallback` stabilize functions.

```tsx
// ❌ React.memo FAIL — filterConfig tạo mới mỗi render
const MemoizedTable = React.memo(Table);
<MemoizedTable data={data} config={{ sort: "asc", page: 1 }} />; // {} !== {} → re-render!

// ✅ React.memo SUCCESS — stable reference
const config = useMemo(() => ({ sort: "asc", page: 1 }), []);
const handleClick = useCallback(() => {
  /* ... */
}, []);
<MemoizedTable data={data} config={config} onClick={handleClick} />;
```

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích 3 tools khác nhau nhưng **work together**, nêu khi memo fail vì unstable props
- ❌ Weak: Biết API nhưng không biết chúng cần **kết hợp** để hiệu quả

---

### Q7: Design a performance monitoring system for a React application in production. / Thiết kế hệ thống monitoring performance cho React app production. 🔴 Senior

**A:**

**Architecture:**

```tsx
// 1. React Profiler API — measure component render times
function withPerformanceMonitoring(Component: React.ComponentType, id: string) {
  return function Wrapped(props: any) {
    return (
      <Profiler
        id={id}
        onRender={(id, phase, actualDuration) => {
          if (actualDuration > 16) {
            // > 1 frame
            reportMetric({
              component: id,
              phase,
              duration: actualDuration,
              timestamp: Date.now(),
            });
          }
        }}
      >
        <Component {...props} />
      </Profiler>
    );
  };
}

// 2. Core Web Vitals tracking
import { onLCP, onINP, onCLS } from "web-vitals";
onLCP((metric) => reportMetric({ name: "LCP", value: metric.value }));
onINP((metric) => reportMetric({ name: "INP", value: metric.value }));
onCLS((metric) => reportMetric({ name: "CLS", value: metric.value }));

// 3. Custom interaction timing
function useInteractionTiming(name: string) {
  return useCallback(
    (fn: () => void) => {
      const start = performance.now();
      fn();
      requestAnimationFrame(() => {
        const duration = performance.now() - start;
        if (duration > 100) {
          reportMetric({ interaction: name, duration });
        }
      });
    },
    [name],
  );
}
```

**Metrics to track:**

- Component render duration > 16ms (frame budget)
- Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- Bundle size per route
- Long tasks (> 50ms blocking main thread)

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Multi-layer monitoring (component + page + interaction), concrete thresholds, sampling strategy
- ❌ Weak: Chỉ nói "dùng Lighthouse" mà không nói programmatic monitoring

**🔗 Follow-up Chain:**

1. "Sampling strategy để không ảnh hưởng performance?" → Report 10% users, rotate, aggregate server-side
2. "Alert khi performance degrade?" → Threshold alerts: LCP > 4s, INP > 500ms → PagerDuty
3. "A/B test performance impact?" → Compare metrics between control/experiment groups

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| #   | Question                          | Level | Key Point                                                      |
| --- | --------------------------------- | ----- | -------------------------------------------------------------- |
| Q1  | When to use React.memo            | 🟢    | 3 conditions: frequent + expensive + stable props, last resort |
| Q2  | Prevent re-renders without memo   | 🟢    | State colocation, composition, context splitting — all FREE    |
| Q3  | useTransition vs debounce         | 🟡    | Fixed delay vs adaptive, network vs render work                |
| Q4  | Diagnose slow React app           | 🟡    | Measure → Identify → Fix → Verify workflow                     |
| Q5  | Dashboard optimization strategy   | 🔴    | Architecture first, selective subscription, profile-driven     |
| Q6  | memo vs useMemo vs useCallback    | 🟡    | 3 tools work together, memo needs stable props                 |
| Q7  | Production performance monitoring | 🔴    | Multi-layer: Profiler API + Web Vitals + interaction timing    |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"How do you optimize a slow React application?"**

**30 giây đầu — mở đầu lý tưởng / Ideal 30-second opening:**

1. "Bước đầu tiên luôn là **đo** — dùng React DevTools Profiler để xác định component nào chậm nhất, thay vì đoán."
2. "Sau khi identify, tôi fix theo thứ tự ưu tiên: **state colocation** (miễn phí), **composition** (miễn phí), **context splitting**, rồi cuối cùng mới **React.memo** — vì memo là giải pháp cuối, không phải đầu."
3. "Ví dụ thực tế: dashboard chậm khi filter, root cause là tất cả widgets subscribe cùng 1 context lớn. Fix: tách context theo concern → mỗi widget chỉ re-render khi filter liên quan thay đổi."
4. "Và luôn **verify bằng Profiler** sau fix — vì intuition thường sai, chỉ data mới chính xác."

_Sau đó mở rộng theo hướng interviewer dẫn dắt._

---

## Self-Check / Tự Kiểm Tra ⚡

> **Đóng tài liệu lại trước khi làm — Close the doc before attempting.**

- [ ] **Retrieval**: Viết 5 re-render prevention patterns theo thứ tự ưu tiên từ trí nhớ. So sánh với ranking trên.
- [ ] **Visual**: Vẽ Virtualization diagram (full list vs virtualized) ra giấy. So sánh với ASCII trên.
- [ ] **Application**: Component render 50ms mỗi lần, parent re-render 10 lần/giây. Bạn fix thế nào? Thứ tự?
- [ ] **Debug**: `React.memo(Table)` nhưng Table vẫn re-render mỗi khi parent render — nguyên nhân? 3 cách fix?
- [ ] **Teach**: Giải thích tại sao "đo trước khi tối ưu" cho đồng nghiệp junior bằng ví dụ bác sĩ khám bệnh.

💬 **Feynman Prompt:** Giải thích sự khác biệt giữa state colocation và React.memo cho người không biết code, dùng ví dụ chung cư 20 tầng. Không dùng thuật ngữ kỹ thuật.

🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày → 7 ngày → 14 ngày** để chuyển vào long-term memory.

---

## Connections / Liên Kết

- ⬅️ **Built on:** [Hooks Comprehensive](./07-hooks-comprehensive.md) — useTransition, useDeferredValue, useMemo
- ➡️ **Enables:** [Modern React Features](./10-modern-react-features.md) — React Compiler auto-memoization
- 🔗 **Applied in:** Core Web Vitals optimization, Design System performance budgets, Production monitoring
