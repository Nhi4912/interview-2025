# React Performance Optimization / Tối Ưu Hiệu Năng React

| Thuộc tính / Property | Giá trị / Value                                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Track**             | Frontend — React                                                                                                                                  |
| **Difficulty**        | 🟡 Mid → 🔴 Senior                                                                                                                                |
| **Prerequisites**     | 01-react-fundamentals (Render/Commit, Fiber), 03-hooks-deep-dive (useMemo, useCallback), 07-hooks-comprehensive (useTransition, useDeferredValue) |
| **See also**          | 08-react-patterns-advanced, 02-react-19-features (React Compiler)                                                                                 |
| **L5 Competencies**   | Performance Engineering, System Optimization, Profiling & Measurement                                                                             |

---

## Real-World Scenario / Tình Huống Thực Tế

🇬🇧 You receive a bug report: "The **Dashboard** page loads slowly. When clicking a tab, it takes 2-3 seconds to switch. On mobile, it's nearly unusable." The dashboard has: 1 chart component (re-renders every time data changes), 1 table with 5000 rows, 3 filter dropdowns, and 1 sidebar navigation. **Everything re-renders when you click anywhere.**

A junior dev added `React.memo()` everywhere — the app got more complex but only 5% faster. Why? Because **memo is not the main solution** — the problem lies in **component architecture**, not missing memoization.

This file teaches you the correct performance approach: **measure first, understand the cause, fix the right place**.

🇻🇳 Bạn nhận bug report: "Trang **Dashboard** load chậm, khi click tab phải đợi 2-3 giây mới chuyển. Trên mobile thì gần như không dùng được." Dashboard có: 1 chart component (re-render mỗi khi data thay đổi), 1 table 5000 rows, 3 filter dropdowns, và 1 sidebar navigation. **Mọi thứ re-render khi click bất kỳ đâu.**

Junior dev thêm `React.memo()` khắp nơi → app phức tạp hơn nhưng chỉ nhanh hơn 5%. Tại sao? Vì **memo không phải giải pháp chính** — vấn đề nằm ở **kiến trúc component**, không phải thiếu memoization.

File này dạy bạn approach performance đúng cách: **đo trước, hiểu nguyên nhân, fix đúng chỗ**.

---

**Where you are in the learning path / Bạn đang ở đây trong lộ trình học:**

```
07-hooks-comprehensive (useTransition/useDeferredValue) → [PERFORMANCE OPTIMIZATION] → 10-modern-react-features
```

---

## Concept Map / Bản Đồ Khái Niệm

```
            Performance Optimization
            Tối ưu hiệu năng
                     │
      ┌──────────────┼──────────────┐
      │              │              │
  Prevention     Deferral      Measurement
  Ngăn chặn      Hoãn lại      Đo lường
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
         Optimization Order / Thứ tự:
         1. Measure (đo lường)
         2. Prevent (ngăn chặn)
         3. Defer (hoãn lại)
         4. Memo (cache — cuối cùng / last resort)
```

---

## Overview / Tổng Quan

🇬🇧 React performance optimization follows a clear hierarchy: **architecture first, memoization last**. Most performance problems come from unnecessary re-renders caused by poor state placement, not from missing `React.memo`. In an interview, saying "I'll add React.memo" = junior. Saying "I'll **measure first**, then **move state**, then **memo only if needed**" = senior.

🇻🇳 Tối ưu hiệu năng React theo thứ tự ưu tiên: **kiến trúc trước, memo sau**. 90% vấn đề performance đến từ state đặt sai chỗ, không phải thiếu memoization. Trong phỏng vấn, nói "tôi sẽ thêm React.memo" = junior. Nói "tôi sẽ **đo trước**, rồi **di chuyển state**, rồi mới **memo nếu cần**" = senior.

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. Re-render Prevention Architecture / Kiến Trúc Ngăn Re-render

> 🧠 **Memory Hook:**
> 🇬🇧 "Optimizing React = **tidy your house before buying cabinets** — move things to the right room (state colocation) before buying more storage (memo)."
> 🇻🇳 "Tối ưu React = **dọn nhà trước khi mua tủ** — di chuyển đồ đúng phòng (state colocation) trước khi mua thêm tủ chứa (memo)."

**Why does this exist? / Tại sao tồn tại?**

🇬🇧 React re-renders the **entire subtree** when a parent re-renders. If state lives in a high component (App), every state change re-renders **every component** below it — even components that don't use that state.
→ **Why?** Because React can't automatically know whether a child component depends on the parent's state — it re-renders everything and then diffs (reconciliation) to find real changes.
→ **Why?** Because React prioritizes **correctness over performance** — rendering too much is safer than rendering too little. But you need to help React render less by placing state in the right place.

🇻🇳 React re-render **toàn bộ subtree** (cây con) khi parent re-render. Nếu state nằm ở component cao (App), mỗi state change re-render **mọi component** bên dưới — kể cả component không dùng state đó.
→ **Tại sao?** Vì React không tự biết component con có depend vào state parent không — nó re-render hết rồi so sánh (reconciliation) để tìm thay đổi thật.
→ **Tại sao?** Vì React ưu tiên **đúng hơn nhanh** — render thừa an toàn hơn render thiếu. Nhưng bạn cần giúp React render ít hơn bằng cách đặt state đúng chỗ.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

🇬🇧 You live in a **20-floor apartment building**. Every time floor 1 changes a light bulb (state change), the building manager announces: **"ALL 20 floors, check your lights!"** — even though only floor 1 changed.

Fixes:

1. **State Colocation** (move things to the right room): Move the floor 1 light switch **to floor 1's room** — only floor 1 checks.
2. **Composition** (separate rooms): Divide floor 1 into separate rooms — changing the light in room A doesn't affect room B.
3. **React.memo** (hang a "not relevant" sign): Each floor hangs a sign "lights on this floor are OK" → the manager skips checking.

**Priority**: Move to the right room (1) > Separate rooms (2) > Hang signs (3). Too many signs → expensive to print (memo overhead).

🇻🇳 Bạn sống trong **chung cư 20 tầng**. Mỗi khi tầng 1 thay bóng đèn (state change), ban quản lý ra lệnh: **"TẤT CẢ 20 tầng kiểm tra đèn!"** — dù chỉ tầng 1 thay đổi.

Cách fix:

1. **State Colocation** (dọn đồ đúng phòng): Chuyển công tắc đèn tầng 1 về **phòng tầng 1** — chỉ tầng 1 kiểm tra.
2. **Composition** (tách phòng): Chia tầng 1 thành phòng riêng — thay đèn phòng A, phòng B không ảnh hưởng.
3. **React.memo** (gắn biển "không liên quan"): Mỗi tầng treo biển "đèn tầng này OK" → ban quản lý skip kiểm tra.

**Ưu tiên**: Dọn đúng phòng (1) > Tách phòng (2) > Treo biển (3). Treo biển nhiều quá → tốn tiền in biển (memo overhead).

#### Layer 2: How It Works / Cơ Chế Hoạt Động

**Pattern 1: State Colocation — Move state down / Di chuyển state xuống**

```tsx
// ❌ BAD: state is too high — entire Page re-renders when hover changes
// ❌ SAI: state ở quá cao — toàn bộ Page re-render khi hover thay đổi
function Page() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  return (
    <div>
      <Header /> {/* Unnecessary re-render / Re-render không cần thiết */}
      <Sidebar /> {/* Unnecessary re-render / Re-render không cần thiết */}
      <ProductList hoveredId={hoveredId} onHover={setHoveredId} />
    </div>
  );
}

// ✅ GOOD: state colocated to the component that uses it
// ✅ TỐT: state đưa xuống component cần dùng
function Page() {
  return (
    <div>
      <Header /> {/* No re-render / Không re-render */}
      <Sidebar /> {/* No re-render / Không re-render */}
      <ProductList /> {/* Only this component re-renders / Chỉ component này re-render */}
    </div>
  );
}

function ProductList() {
  const [hoveredId, setHoveredId] = useState<string | null>(null); // State lives here! / State ở đây!
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

**Pattern 2: Composition — Children as Props / Truyền children qua props**

```tsx
// ❌ BAD: ScrollTracker re-renders → children re-render
// ❌ SAI: ScrollTracker re-render → children cũng re-render
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
      <ExpensiveContent /> {/* Re-renders every scroll! / Re-render mỗi scroll! */}
    </div>
  );
}

// ✅ GOOD: Children passed as props — don't re-render
// ✅ TỐT: Children truyền qua props — không re-render
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
      {children} {/* No re-render! Created by parent / Không re-render! Tạo ở parent */}
    </div>
  );
}

// Usage / Cách dùng
<ScrollTracker>
  <ExpensiveContent />{" "}
  {/* React element created in parent, stable reference / Tạo ở parent, reference ổn định */}
</ScrollTracker>;
```

```
Re-render Prevention Priority / Thứ tự ưu tiên ngăn re-render:

  1. State Colocation          ───── FREE / MIỄN PHÍ (just move code / chỉ di chuyển code)
     "Put state in the right place"   Effectiveness / Hiệu quả: ⭐⭐⭐⭐⭐
     "Đặt state đúng chỗ"            Cost / Chi phí: ZERO

  2. Composition               ───── FREE / MIỄN PHÍ (restructure JSX)
     "Children as props"              Effectiveness / Hiệu quả: ⭐⭐⭐⭐
                                      Cost / Chi phí: ZERO

  3. Context Splitting         ───── LOW / THẤP (split context / tách context)
     "1 context = 1 concern"          Effectiveness / Hiệu quả: ⭐⭐⭐⭐
                                      Cost / Chi phí: Extra setup code / Thêm code setup

  4. React.memo                ───── MEDIUM / TRUNG BÌNH (compare props / so sánh props)
     "Cache component"                Effectiveness / Hiệu quả: ⭐⭐⭐
                                      Cost / Chi phí: Shallow compare every render / Mỗi render

  5. useMemo / useCallback     ───── MEDIUM / TRUNG BÌNH (cache value/func)
     "Cache computation"              Effectiveness / Hiệu quả: ⭐⭐
                                      Cost / Chi phí: Memory + deps comparison
```

**Pattern 3: Context Splitting / Tách context theo concern**

```tsx
// ❌ BAD: 1 context holds everything → all consumers re-render
// ❌ SAI: 1 context chứa tất cả → mọi consumer re-render
const AppContext = createContext({ user: null, theme: "light", locale: "vi" });

// ✅ GOOD: Split context by concern
// ✅ TỐT: Tách context theo concern
const UserContext = createContext<User | null>(null);
const ThemeContext = createContext("light");
const LocaleContext = createContext("vi");

// Component only uses theme → only re-renders when theme changes
// Component chỉ dùng theme → chỉ re-render khi theme đổi
function ThemeToggle() {
  const theme = useContext(ThemeContext); // Won't re-render when user changes / Không re-render khi user đổi
  return <button>{theme}</button>;
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

🇬🇧

- **React.memo overhead**: `React.memo` shallow compares all props every render. If the component is already lightweight → memo overhead > re-render cost → actually slower.
- **Object/function props**: `React.memo` uses `===` comparison. New object every render → memo always fails. Need `useMemo`/`useCallback` for props.
- **React Compiler (React 19)**: Auto-memoization at build time → you may not need manual memo in the future.

🇻🇳

- **React.memo overhead**: `React.memo` so sánh nông tất cả props mỗi render. Nếu component đã nhẹ → chi phí memo > chi phí re-render → chậm hơn.
- **Object/function props**: `React.memo` dùng `===` comparison. Object mới mỗi render → memo luôn fail. Cần `useMemo`/`useCallback` cho props.
- **React Compiler (React 19)**: Tự động memo khi build → bạn có thể không cần manual memo trong tương lai.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                                | Why wrong / Tại sao sai                                                 | Correct / Đúng là                                                              |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Add React.memo everywhere / Thêm React.memo khắp nơi             | Comparison overhead, doesn't fix root cause / Không giải quyết gốc      | Move state first, memo only when measured / Di chuyển state trước, đo rồi memo |
| Memo component but pass inline object / Memo nhưng truyền object | `{...}` creates new reference → memo always fails / memo luôn fail      | `useMemo` for objects, `useCallback` for functions                             |
| Optimize before measuring / Tối ưu trước khi đo                  | Premature optimization, fixing wrong place / Fix sai chỗ                | **Measure first** — React DevTools Profiler                                    |
| Put all state in 1 context / Gộp hết state vào 1 context         | All consumers re-render when any value changes / Mọi consumer re-render | Split context by concern / Tách context theo concern                           |

**🎯 Interview Pattern / Mẫu phỏng vấn:**

- 🇬🇧 When you see questions about: "prevent re-renders", "React performance", "React.memo", "optimization" → Think: Tidy house before buying cabinets, 5 ranked patterns → Open with: _"React optimization follows a priority order: measure first, then state colocation, composition, context splitting, and finally React.memo. 90% of problems are solved by the first 3 — free, no extra complexity."_
- 🇻🇳 Khi thấy câu hỏi về: "ngăn re-render", "React performance", "tối ưu" → Nhớ: Dọn nhà trước khi mua tủ, 5 patterns ranked → Mở đầu: _"Tối ưu React theo thứ tự: đo trước, rồi state colocation, composition, context splitting, và cuối cùng mới React.memo. 90% vấn đề giải quyết bằng 3 cái đầu — miễn phí, không thêm complexity."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Prerequisite / Cần biết trước: [React Fundamentals — Render/Commit](./01-react-fundamentals.md) — understand why re-renders happen / hiểu tại sao re-render xảy ra
- ➡️ Leads to / Để hiểu tiếp: [Code Splitting & Virtualization](#2-code-splitting--virtualization--chia-nhỏ--ảo-hóa) — when prevention isn't enough / khi prevention không đủ

---

### 2. Code Splitting & Virtualization / Chia Nhỏ & Ảo Hóa

> 🧠 **Memory Hook:**
> 🇬🇧 "Code Splitting = **ship in multiple trips** — don't load everything at once (large bundle). Virtualization = **sliding window** — only render what the user can see."
> 🇻🇳 "Code Splitting = **ship hàng nhiều chuyến** — đừng chở tất cả 1 lần (bundle lớn). Virtualization = **cửa sổ di động** — chỉ render những gì user nhìn thấy."

**Why does this exist? / Tại sao tồn tại?**

🇬🇧 Large initial bundle size → user waits to download + parse JS before seeing any UI. Long lists (10,000 items) → too many DOM nodes → browser lags when rendering/scrolling.
→ **Why?** Because the browser must download, parse, and execute **all JS** before rendering. Code the user doesn't need yet (settings page when on home page) still gets loaded.
→ **Why?** Because network bandwidth and device CPU are finite resources — especially on mobile 3G.

🇻🇳 Bundle size ban đầu lớn → user chờ download + phân tích JS lâu trước khi thấy UI. Danh sách dài (10,000 items) → DOM nodes quá nhiều → browser lag khi render/scroll.
→ **Tại sao?** Vì browser phải download, phân tích, chạy **toàn bộ JS** trước khi render. Code user chưa cần (trang settings khi đang ở trang home) vẫn phải tải.
→ **Tại sao?** Vì băng thông mạng và CPU thiết bị là tài nguyên hữu hạn — đặc biệt trên mobile 3G.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

🇬🇧 **Code Splitting**: You order **food delivery**. The restaurant can: (A) bring ALL 500 menu items to your house → wait very long. Or (B) bring **the dish you ordered** first, dessert menu comes later when you're done eating → much faster.

**Virtualization**: You scroll through a **phone contacts list** with 10,000 contacts. Your phone doesn't render 10,000 rows — it only renders **20 rows visible on screen**. Scroll down → 20 new rows appear, 20 old rows disappear.

🇻🇳 **Code Splitting**: Bạn đặt **đồ ăn delivery**. Nhà hàng có thể: (A) chở TẤT CẢ menu 500 món đến nhà bạn → chờ rất lâu. Hoặc (B) chở **món bạn gọi** trước, menu tráng miệng chở sau khi bạn ăn xong → nhanh hơn nhiều.

**Virtualization**: Bạn xem **danh bạ điện thoại** 10,000 contacts. Điện thoại không render 10,000 dòng — nó chỉ render **20 dòng bạn đang thấy trên màn hình**. Scroll xuống → 20 dòng mới xuất hiện, 20 dòng cũ biến mất.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

**Code Splitting with React.lazy + Suspense / Code Splitting với React.lazy + Suspense:**

```tsx
import { lazy, Suspense } from "react";

// ❌ Static import — loads immediately even if not needed
// ❌ Import tĩnh — tải ngay dù chưa cần
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";

// ✅ Lazy import — only loads when needed
// ✅ Import lười — chỉ tải khi cần
const Settings = lazy(() => import("./pages/Settings"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Analytics = lazy(() => import("./pages/Analytics"));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />{" "}
        {/* Only loads when visiting /settings / Chỉ tải khi vào /settings */}
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}
```

```
Code Splitting Effect / Hiệu quả:

  Without splitting / Không split:
  ┌──────────────────────────────────────┐
  │         main.bundle.js (2MB)          │ ← User waits for 2MB / User chờ download 2MB
  │  Home + Settings + Analytics + ...    │
  └──────────────────────────────────────┘

  With splitting / Có split:
  ┌──────────────┐
  │ main.js (500KB)│ ← User only waits for 500KB / User chỉ chờ 500KB
  │ Home page only │
  └──────────────┘
       ↓ when visiting /settings / khi vào /settings
  ┌──────────────┐
  │settings.js    │ ← Lazy loaded when needed / Lazy load khi cần
  │(200KB)        │
  └──────────────┘
```

**Virtualization with @tanstack/react-virtual / Virtualization với @tanstack/react-virtual:**

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length, // 10,000 items
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Estimated row height / Chiều cao ước tính
    overscan: 5, // Render 5 extra items above/below viewport / 5 items thừa trên/dưới viewport
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
Virtualization Visual / Minh họa ảo hóa:

  Full List (10,000 items)     Virtualized (only renders ~25 / chỉ render ~25)
  ┌─────────────────┐          ┌─────────────────┐
  │ Item 1          │          │                 │ ← Spacer (CSS height)
  │ Item 2          │          │                 │
  │ ...             │          │                 │
  │ Item 998        │          │                 │
  │ Item 999        │          ├─────────────────┤
  │ ████████████████│ viewport │ Item 1000 ██████│ ← Only renders items in viewport
  │ ████████████████│ =======> │ Item 1001 ██████│   Chỉ render items trong viewport
  │ ████████████████│          │ ...       ██████│   + overscan
  │ Item 1025       │          │ Item 1024 ██████│
  │ Item 1026       │          ├─────────────────┤
  │ ...             │          │                 │ ← Spacer (CSS height)
  │ Item 10000      │          │                 │
  └─────────────────┘          └─────────────────┘
  10,000 DOM nodes             ~25 DOM nodes ← 400x fewer / 400x ít hơn!
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

🇬🇧

- **Code Splitting waterfall**: Lazy component fetches JS → JS fetches data → double wait. Fix: preload component or fetch data in parallel.
- **Virtualization search/select all**: Ctrl+A only selects currently rendered items. Need separate logic for "select all" on the full dataset.
- **Variable row height**: Wrong `estimateSize` → scroll jumps. Use `measureElement` for dynamic content.
- **SSR + lazy**: `React.lazy` is client-side only. Use `next/dynamic` or framework-specific lazy loading for SSR.

🇻🇳

- **Code Splitting waterfall**: Lazy component tải JS → JS tải data → chờ 2 lần. Fix: preload component hoặc tải data song song.
- **Virtualization search/select all**: Ctrl+A chỉ select items đang render. Cần logic riêng cho "select all" trên toàn bộ dataset.
- **Chiều cao dòng khác nhau**: `estimateSize` sai → scroll nhảy. Dùng `measureElement` cho nội dung thay đổi.
- **SSR + lazy**: `React.lazy` chỉ client-side. Dùng `next/dynamic` hoặc framework-specific lazy cho SSR.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                    | Why wrong / Tại sao sai                                       | Correct / Đúng là                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Lazy load every component / Lazy load MỌI component  | Fetch overhead > benefit for small components / Component nhỏ | Only lazy load routes/heavy components (>30KB) / Chỉ lazy routes/nặng    |
| Virtualize a 20-item list / Virtualize list 20 items | Overhead > benefit for small lists / List nhỏ                 | Only virtualize when >100 items or complex rows / >100 items             |
| Forget Suspense fallback / Quên Suspense fallback    | Flash of nothing → bad UX                                     | Skeleton/spinner in Suspense fallback                                    |
| Virtualization + CSS animation                       | Animation on absolute positioned items is complex / Phức tạp  | Simplify animation or disable for virtual items / Đơn giản hóa animation |

**🎯 Interview Pattern / Mẫu phỏng vấn:**

- 🇬🇧 When you see: "bundle size", "initial load", "large lists", "code splitting" → Think: Ship in multiple trips, sliding window → Open: _"Code splitting divides the bundle into small chunks, only loading when needed — reducing initial load time. Virtualization only renders items in the viewport — turning 10,000 DOM nodes into ~25. Both solve the problem of 'too much at once'."_
- 🇻🇳 Khi thấy: "bundle size", "load ban đầu", "danh sách dài", "code splitting" → Nhớ: Ship hàng nhiều chuyến, cửa sổ di động → Mở đầu: _"Code splitting chia bundle thành chunks nhỏ, chỉ tải khi cần — giảm thời gian load ban đầu. Virtualization chỉ render items trong viewport — biến 10,000 DOM nodes thành ~25. Cả 2 đều giải quyết vấn đề 'quá nhiều thứ cùng lúc'."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Prerequisite / Cần biết trước: [Re-render Prevention](#1-re-render-prevention-architecture--kiến-trúc-ngăn-re-render) — fix architecture first / fix kiến trúc trước
- ➡️ Leads to / Để hiểu tiếp: [Profiling & Measurement](#3-profiling--measurement--đo-lường--phân-tích) — verify optimization works / xác nhận optimization đúng chỗ

---

### 3. Profiling & Measurement / Đo Lường & Phân Tích

> 🧠 **Memory Hook:**
> 🇬🇧 "Measure before optimize = **see a doctor before taking medicine** — don't take antibiotics when you just have a cold."
> 🇻🇳 "Đo trước khi tối ưu = **đi khám trước khi uống thuốc** — đừng uống kháng sinh khi chỉ bị cảm."

**Why does this exist? / Tại sao tồn tại?**

🇬🇧 Developers often **guess** performance problems instead of **measuring**. Result: optimizing the wrong place, adding unnecessary complexity, no performance improvement.
→ **Why?** Because intuition is often wrong — the component you think is slow might render in 0.1ms, while a "simple" component renders in 50ms because it fetches data.
→ **Why?** Because "you can't improve what you don't measure" — you need data, not gut feeling.

🇻🇳 Developers thường **đoán** vấn đề performance thay vì **đo**. Kết quả: optimize sai chỗ, thêm complexity không cần thiết, performance không cải thiện.
→ **Tại sao?** Vì intuition (cảm giác) thường sai — component bạn nghĩ chậm có thể render 0.1ms, trong khi component "đơn giản" lại render 50ms vì fetch data.
→ **Tại sao?** Vì "bạn không thể cải thiện thứ bạn không đo" — cần data, không cần gut feeling.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

🇬🇧 You go to the doctor. A good doctor **never** prescribes medicine before **examining** you (blood pressure, blood test, X-ray). If the doctor just looks at your face and prescribes medicine → dangerous.

Performance optimization works the same way:

1. **Measure** (React DevTools Profiler, Performance tab)
2. **Diagnose** (find the slowest component)
3. **Treat** (apply the right pattern)
4. **Follow up** (measure again after the fix)

🇻🇳 Bạn đi khám bệnh. Bác sĩ tốt **không bao giờ** cho thuốc trước khi **kiểm tra** (đo huyết áp, xét nghiệm máu, X-quang). Nếu bác sĩ chỉ nhìn mặt bạn rồi kê thuốc → nguy hiểm.

Performance optimization cũng vậy:

1. **Đo** (React DevTools Profiler, Performance tab)
2. **Chẩn đoán** (tìm component chậm nhất)
3. **Điều trị** (áp dụng đúng pattern)
4. **Kiểm tra lại** (đo lại sau fix)

#### Layer 2: How It Works / Cơ Chế Hoạt Động

**Tool 1: React DevTools Profiler**

```
How to use / Cách dùng:
1. Open React DevTools → "Profiler" tab / Mở React DevTools → tab "Profiler"
2. Click "Record" → interact with app → "Stop" / Click "Record" → thao tác → "Stop"
3. Read Flamegraph / Đọc Flamegraph:

  Flamegraph (each bar = 1 component render / mỗi bar = 1 component render):

  ┌──────────────────────────────────────────┐
  │ App (2.1ms)                               │
  ├──────────────┬───────────────────────────┤
  │ Header       │ Dashboard (1.8ms) ← SLOW  │
  │ (0.1ms)      ├──────────┬───────────────┤
  │              │ Chart    │ Table (1.2ms)  │ ← FOUND IT! / TÌM THẤY!
  │              │ (0.4ms)  │               │
  └──────────────┴──────────┴───────────────┘

  → Table renders 1.2ms, takes 67% of total time
  → Table render 1.2ms, chiếm 67% tổng thời gian
  → Fix Table first, not Header (0.1ms)
  → Fix Table trước, không phải Header (0.1ms)
```

**Tool 2: React Profiler Component (code-based) / Component đo bằng code:**

```tsx
import { Profiler, ProfilerOnRenderCallback } from "react";

const onRender: ProfilerOnRenderCallback = (
  id, // Component id
  phase, // "mount" | "update"
  actualDuration, // Render time (ms) / Thời gian render (ms)
  baseDuration, // Time without cache / Thời gian nếu không cache
  startTime,
  commitTime,
) => {
  if (actualDuration > 16) {
    // > 1 frame (60fps = 16ms/frame)
    console.warn(`Slow render: ${id} took ${actualDuration.toFixed(1)}ms`);
  }
};

// Wrap the component you want to measure / Wrap component cần đo
<Profiler id="ProductTable" onRender={onRender}>
  <ProductTable data={products} />
</Profiler>;
```

**Tool 3: why-did-you-render (development only / chỉ dùng trong dev)**

```tsx
// Install / Cài: npm i @welldone-software/why-did-you-render --save-dev

// Setup (dev only / chỉ dev)
if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}

// Component you want to track / Component muốn theo dõi
ProductTable.whyDidYouRender = true;

// Console output:
// ProductTable: Re-rendered because props changed:
//   items: [{...}] !== [{...}]  ← Different object reference despite same data!
//                                  Reference object khác dù data giống!
```

```
Performance Optimization Workflow / Quy trình tối ưu:

  ┌──────────────┐
  │ 1. MEASURE   │ React DevTools Profiler
  │    Đo trước  │ → Find slowest component / Tìm component chậm nhất
  └──────┬───────┘
         ▼
  ┌──────────────┐
  │ 2. IDENTIFY  │ why-did-you-render
  │    Tìm cause │ → Why does this component re-render? / Tại sao re-render?
  └──────┬───────┘
         ▼
  ┌──────────────┐  State in wrong place? → Colocation / State sai chỗ? → Colocation
  │ 3. FIX       │  Children re-render? → Composition
  │    Áp dụng   │  Context too broad? → Split context / Context quá lớn? → Tách
  └──────┬───────┘  Still slow? → React.memo + useMemo / Vẫn chậm? → Memo
         ▼
  ┌──────────────┐
  │ 4. VERIFY    │ Re-measure with Profiler / Đo LẠI bằng Profiler
  │    Đo lại    │ → Actually faster? / Có thực sự nhanh hơn không?
  └──────────────┘
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

🇬🇧

- **Development ≠ Production**: React DevTools adds overhead. Production builds are faster. `React.Profiler` works in production too if enabled.
- **StrictMode double render**: React 18 StrictMode renders twice (dev only) → Profiler shows double. Don't optimize for StrictMode artifacts.
- **Core Web Vitals**: LCP (Largest Contentful Paint), INP (Interaction to Next Paint), CLS (Cumulative Layout Shift) — real metrics Google uses for ranking.

🇻🇳

- **Development ≠ Production**: React DevTools thêm overhead (chi phí). Production build nhanh hơn. `React.Profiler` hoạt động cả production nếu bật.
- **StrictMode double render**: React 18 StrictMode render 2 lần (chỉ dev) → Profiler hiện gấp đôi. Đừng optimize cho hiện tượng StrictMode.
- **Core Web Vitals**: LCP (Nội dung lớn nhất vẽ xong), INP (Tương tác đến vẽ tiếp), CLS (Dịch chuyển bố cục tích lũy) — metrics thực tế Google dùng để xếp hạng.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                  | Why wrong / Tại sao sai                                                  | Correct / Đúng là                                                                 |
| -------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| Optimize without measuring / Optimize mà không đo  | Fix wrong place, add useless complexity / Fix sai chỗ, thêm code vô ích  | Profiler → identify → fix → verify                                                |
| Measure in dev mode / Đo trong dev mode            | Dev mode is 3-10x slower than production / Dev chậm hơn production 3-10x | Use production build for benchmarks / Dùng production build                       |
| Only look at render count / Chỉ nhìn số lần render | Many renders but fast = OK / Render nhiều nhưng nhanh = OK               | Look at **render duration**, not just count / Nhìn **thời gian**, không chỉ count |
| Ignore INP metric / Bỏ qua INP metric              | Click → 200ms delay = bad UX even if FCP is fast / 200ms delay = UX tệ   | Also measure interaction responsiveness / Đo cả tốc độ phản hồi tương tác         |

**🎯 Interview Pattern / Mẫu phỏng vấn:**

- 🇬🇧 When you see: "profile React app", "find performance bottleneck", "measure performance" → Think: See a doctor before taking medicine → Open: _"The first step is always to measure — use React DevTools Profiler to find the slowest component, then why-did-you-render to find out why it re-renders. Never optimize based on gut feeling."_
- 🇻🇳 Khi thấy: "profile React app", "tìm nút thắt performance", "đo hiệu năng" → Nhớ: Đi khám trước khi uống thuốc → Mở đầu: _"Bước đầu tiên luôn là đo — dùng React DevTools Profiler để tìm component chậm nhất, rồi why-did-you-render để biết tại sao nó re-render. Không bao giờ optimize dựa trên cảm giác."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Prerequisite / Cần biết trước: [Re-render Prevention](#1-re-render-prevention-architecture--kiến-trúc-ngăn-re-render) — know patterns to apply after measuring / biết patterns để apply sau khi đo
- ➡️ Leads to / Để hiểu tiếp: Web Performance (Core Web Vitals) — metrics at a higher level than components / metrics cấp cao hơn component

---

## Q&A Section / Câu Hỏi Phỏng Vấn

### Q1: When should you use React.memo? / Khi nào nên dùng React.memo? 🟢 Junior

**A:**

🇬🇧 Use `React.memo` when a component meets ALL 3 conditions:

1. **Renders often** with the same props (parent re-renders frequently)
2. **Is expensive to render** (complex calculations, large DOM tree)
3. **Props are stable** (primitives, or objects wrapped in useMemo)

If the component renders fast (< 1ms), memo overhead (shallow compare) can be **slower** than just re-rendering. Important: `React.memo` is the **last resort**, not the first. Try state colocation and composition first — both are free.

🇻🇳 Dùng `React.memo` khi component đáp ứng CẢ 3 điều kiện:

1. **Render thường xuyên** với cùng props (parent render liên tục)
2. **Render tốn thời gian** (tính toán phức tạp, cây DOM lớn)
3. **Props ổn định** (kiểu nguyên thủy, hoặc object wrap trong useMemo)

Nếu component render nhanh (< 1ms), chi phí memo (so sánh nông) có thể **chậm hơn** re-render. Quan trọng: `React.memo` là **giải pháp cuối cùng**, không phải đầu tiên. Hãy thử state colocation và composition trước — cả 2 đều miễn phí.

**💡 Interview Signal / Dấu hiệu trả lời tốt:**

- ✅ Strong: Lists 3 conditions (frequent + expensive + stable props), says memo is **last resort**, mentions overhead
- ❌ Weak: "Use React.memo to optimize performance" without conditions and trade-offs

---

### Q2: What are the 3 most effective ways to prevent unnecessary re-renders WITHOUT memoization? / 3 cách hiệu quả nhất ngăn re-render thừa mà KHÔNG dùng memo? 🟢 Junior

**A:**

🇬🇧

1. **State Colocation**: Move state down to the component that uses it. If only `SearchInput` needs `query` state, don't put it in `App`.
2. **Composition (children as props)**: Pass children as `{children}` prop — React elements created by the parent keep a stable reference.
3. **Context Splitting**: Split a large context into smaller, focused contexts. A component consuming `ThemeContext` won't re-render when `UserContext` changes.

All 3 are more effective than `React.memo` because they **prevent re-renders at the root** instead of **comparing props to skip re-renders**.

🇻🇳

1. **State colocation**: Đưa state xuống component cần dùng → parent không re-render. Nếu chỉ `SearchInput` cần state `query`, đừng đặt ở `App`.
2. **Composition**: Truyền children qua props → children giữ reference ổn định vì được tạo ở parent.
3. **Tách context**: 1 context = 1 concern → giảm số subscribers bị ảnh hưởng. Component dùng `ThemeContext` không re-render khi `UserContext` đổi.

Cả 3 đều hiệu quả hơn `React.memo` vì **ngăn re-render từ gốc** thay vì **so sánh props để skip re-render**.

**💡 Interview Signal / Dấu hiệu trả lời tốt:**

- ✅ Strong: Names all 3 patterns, explains why **more effective than memo**, gives code example
- ❌ Weak: Only knows React.memo/useMemo, doesn't know architecture-level solutions

---

### Q3: How does useTransition differ from debounce for search optimization? / useTransition khác debounce như thế nào khi tối ưu search? 🟡 Mid

**A:**

| Aspect / Khía cạnh                | Debounce                                                 | useTransition                                                              |
| --------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Mechanism / Cơ chế**            | Fixed delay (300ms) regardless of device / Delay cố định | React-controlled adaptive delay / React tự điều chỉnh                      |
| **What it delays / Hoãn gì**      | Function call (API, setState) / Gọi hàm                  | Render work priority / Ưu tiên render                                      |
| **Device adaptation / Thích ứng** | Same delay on iPhone 15 and old Android / Cùng delay     | Fast device → near-zero, slow → longer / Máy nhanh → gần 0, chậm → lâu hơn |
| **Interruption / Ngắt**           | Timer-based, not interruptible / Không ngắt được         | React can interrupt and restart / React có thể ngắt và chạy lại            |
| **Use case / Dùng khi**           | API calls (network) / Gọi API                            | CPU-heavy renders (computation) / Render nặng                              |

🇬🇧 Debounce has a fixed delay — whether on a fast or slow device, it always waits 300ms. `useTransition` lets React **decide** — on an iPhone 15 it's nearly instant, on an old device the delay increases automatically. Debounce is for **network calls** (API), useTransition is for **render work** (filtering 10,000 items). You can combine both: debounce the API call + useTransition for rendering heavy results.

🇻🇳 Debounce delay cố định — máy nhanh hay chậm đều chờ 300ms. `useTransition` để React **tự quyết** — trên iPhone 15 gần như instant, trên máy cũ delay tự tăng. Debounce cho **gọi API** (network), useTransition cho **render nặng** (filter 10,000 items). Kết hợp cả 2: debounce gọi API + useTransition cho render kết quả nặng.

**💡 Interview Signal / Dấu hiệu trả lời tốt:**

- ✅ Strong: Clear comparison table, mentions device adaptation, knows how to combine both
- ❌ Weak: "useTransition is faster than debounce" without explaining **different mechanisms**

---

### Q4: How would you diagnose and fix a React app that's slow on interaction? / Cách chẩn đoán và fix React app chậm khi tương tác? 🟡 Mid

**A:**

🇬🇧 Follow the **Measure → Identify → Fix → Verify** workflow:

**Step 1: Measure** — Open React DevTools Profiler, record the slow interaction, identify the component with highest `actualDuration`.

**Step 2: Identify** — Use `why-did-you-render` to find WHY that component re-renders. Common causes: parent state change cascading down, context value changing, inline object/function props creating new references.

**Step 3: Fix** — Apply the right pattern based on cause:

- State too high → state colocation
- Parent re-render → composition / `React.memo`
- Context too broad → split context
- Heavy computation → `useMemo`
- Large list → virtualization
- Heavy component → code splitting

**Step 4: Verify** — Re-measure with Profiler. If `actualDuration` decreased significantly, the fix worked.

🇻🇳 Theo quy trình **Đo → Xác định → Sửa → Xác nhận**:

**Bước 1: Đo** — Mở React DevTools Profiler, record thao tác bị chậm, tìm component có `actualDuration` cao nhất.

**Bước 2: Xác định** — Dùng `why-did-you-render` để tìm TẠI SAO component đó re-render. Nguyên nhân thường gặp: state parent thay đổi lan xuống, context value đổi, inline object/function props tạo reference mới.

**Bước 3: Sửa** — Áp dụng đúng pattern theo nguyên nhân:

- State đặt quá cao → state colocation
- Parent re-render → composition / `React.memo`
- Context quá lớn → tách context
- Tính toán nặng → `useMemo`
- Danh sách dài → virtualization
- Component nặng → code splitting

**Bước 4: Xác nhận** — Đo lại bằng Profiler. Nếu `actualDuration` giảm rõ rệt, fix đã đúng.

**💡 Interview Signal / Dấu hiệu trả lời tốt:**

- ✅ Strong: Structured workflow (measure → identify → fix → verify), names specific tools for each step
- ❌ Weak: "Add React.memo" without measuring first, no verification after

---

### Q5: You have a dashboard with 5 widgets, all re-rendering when any filter changes. Walk through your optimization strategy. / Dashboard 5 widgets, tất cả re-render khi bất kỳ filter nào đổi. Trình bày strategy tối ưu. 🔴 Senior

**A:**

🇬🇧 **Step 1: Measure** — Profile to find which widgets are slow. If Widget C takes 200ms and others take 2ms → focus on Widget C first.

**Step 2: Analyze state architecture** — Likely all filters live in the Dashboard parent, causing all widgets to re-render on any filter change.

**Step 3: Apply fixes in order:**

1. **State Colocation** — Move filters to a FilterBar component
2. **Context Splitting** — Each filter gets its own context
3. **Selective subscription** — Each widget only subscribes to the filter it needs
4. **useTransition / useDeferredValue** — For heavy widgets, defer render work
5. **Virtualization** — For tables with thousands of rows
6. **React.memo** — For widgets that have been optimized by all other means

**Step 4: Verify** — Re-profile. Target: each widget renders < 16ms (60fps).

🇻🇳 **Bước 1: Đo** — Profile để tìm widget nào chậm. Nếu Widget C mất 200ms còn các widget khác 2ms → tập trung vào Widget C trước.

**Bước 2: Phân tích kiến trúc state** — Có thể tất cả filters nằm trong Dashboard parent, khiến mọi widget re-render khi bất kỳ filter nào đổi.

**Bước 3: Áp dụng fix theo thứ tự:**

1. **State Colocation** — Chuyển filters vào component FilterBar
2. **Tách Context** — Mỗi filter có context riêng
3. **Selective subscription** — Mỗi widget chỉ subscribe filter nó cần
4. **useTransition / useDeferredValue** — Cho widget nặng, hoãn render
5. **Virtualization** — Cho table có hàng nghìn dòng
6. **React.memo** — Cho widget đã optimize hết cách khác

**Bước 4: Xác nhận** — Đo lại. Mục tiêu: mỗi widget render < 16ms (60fps).

```tsx
// ❌ Likely current: all state in Dashboard parent
// ❌ Có thể hiện tại: tất cả state trong Dashboard parent
function Dashboard() {
  const [dateFilter, setDateFilter] = useState(/*...*/);
  const [statusFilter, setStatusFilter] = useState(/*...*/);
  const [regionFilter, setRegionFilter] = useState(/*...*/);
  return (
    <>
      <RevenueChart date={dateFilter} /> {/* Re-renders when status changes! */}
      <OrderTable status={statusFilter} /> {/* Re-renders when date changes! */}
      <UserMap region={regionFilter} /> {/* Re-renders when status changes! */}
      <MetricsPanel date={dateFilter} />
      <ActivityFeed /> {/* Re-renders for no reason! / Re-render không cần! */}
    </>
  );
}

// ✅ After optimization / Sau khi tối ưu:
function Dashboard() {
  return (
    <FilterProvider>
      {" "}
      {/* Context for filters / Context cho filters */}
      <FilterBar /> {/* Filter state lives here / State filter ở đây */}
      <WidgetGrid /> {/* Widgets subscribe selectively / Widgets subscribe có chọn lọc */}
    </FilterProvider>
  );
}

// Split context by filter / Tách context theo filter
const DateFilterContext = createContext<DateFilter>(/*...*/);
const StatusFilterContext = createContext<StatusFilter>(/*...*/);

// Widget only subscribes to the filter it needs
// Widget chỉ subscribe filter nó cần
function RevenueChart() {
  const dateFilter = useContext(DateFilterContext); // Only re-renders when date changes / CHỈ re-render khi date đổi
  // ...
}

// useTransition for heavy widgets / useTransition cho widget nặng
function OrderTable() {
  const statusFilter = useContext(StatusFilterContext);
  const [isPending, startTransition] = useTransition();
  const deferredFilter = useDeferredValue(statusFilter);
  // ... render with deferredFilter
}
```

**💡 Interview Signal / Dấu hiệu trả lời tốt:**

- ✅ Strong: Structured approach (measure → analyze → fix in priority order → verify), knows not all fixes are needed
- ❌ Weak: Jumps to "React.memo all widgets" without analyzing root cause

**🔗 Follow-up Chain:**

1. 🇬🇧 "What if after all fixes, 1 widget is still 100ms slow?" → Web Worker for computation, or server-side render that widget
   🇻🇳 "Nếu sau tất cả fixes, 1 widget vẫn chậm 100ms?" → Web Worker cho tính toán, hoặc server-side render widget đó
2. 🇬🇧 "How to monitor performance in production?" → React Profiler API + custom metrics + Core Web Vitals tracking
   🇻🇳 "Cách monitor performance trong production?" → React Profiler API + custom metrics + Core Web Vitals tracking
3. 🇬🇧 "Does React Compiler solve everything?" → Auto-memo helps but doesn't fix architecture issues (state placement, context splitting)
   🇻🇳 "React Compiler có giải quyết hết không?" → Auto-memo giúp nhưng không fix vấn đề kiến trúc (đặt state, tách context)

---

### Q6: Compare React.memo, useMemo, and useCallback — when to use each? / So sánh React.memo, useMemo, và useCallback — khi nào dùng từng cái? 🟡 Mid

**A:**

| Tool / Công cụ | What it caches / Cache gì                    | When to use / Khi nào dùng                                                                              |
| -------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `React.memo`   | **Component render result / Kết quả render** | Prevent child re-render when props unchanged / Ngăn child re-render khi props không đổi                 |
| `useMemo`      | **Computed value / Giá trị tính toán**       | Cache expensive calculation or stabilize object reference / Cache tính toán nặng hoặc ổn định reference |
| `useCallback`  | **Function reference / Reference hàm**       | Stabilize function passed as prop to memoized child / Ổn định hàm truyền cho child memo                 |

🇬🇧 They work **together**: `React.memo` is only effective when props have **stable references**. If you pass an inline object/function → new reference every render → memo always fails. `useMemo` stabilizes objects, `useCallback` stabilizes functions.

🇻🇳 Chúng hoạt động **cùng nhau**: `React.memo` chỉ hiệu quả khi props có **reference ổn định**. Nếu truyền inline object/function → reference mới mỗi render → memo luôn thất bại. `useMemo` ổn định objects, `useCallback` ổn định functions.

```tsx
// ❌ React.memo FAILS — filterConfig creates new object every render
// ❌ React.memo THẤT BẠI — filterConfig tạo object mới mỗi render
const MemoizedTable = React.memo(Table);
<MemoizedTable data={data} config={{ sort: "asc", page: 1 }} />; // {} !== {} → re-render!

// ✅ React.memo SUCCEEDS — stable references
// ✅ React.memo THÀNH CÔNG — reference ổn định
const config = useMemo(() => ({ sort: "asc", page: 1 }), []);
const handleClick = useCallback(() => {
  /* ... */
}, []);
<MemoizedTable data={data} config={config} onClick={handleClick} />;
```

**💡 Interview Signal / Dấu hiệu trả lời tốt:**

- ✅ Strong: Explains 3 tools are different but **work together**, shows when memo fails due to unstable props
- ❌ Weak: Knows API but doesn't know they need to **combine** for effectiveness

---

### Q7: Design a performance monitoring system for a React application in production. / Thiết kế hệ thống monitoring performance cho React app production. 🔴 Senior

**A:**

🇬🇧 A production monitoring system has 3 layers:

1. **Component level** — React Profiler API to measure render durations
2. **Page level** — Core Web Vitals (LCP, INP, CLS) for real user metrics
3. **Interaction level** — Custom timing for specific user flows

🇻🇳 Hệ thống monitoring production có 3 tầng:

1. **Tầng component** — React Profiler API đo thời gian render
2. **Tầng trang** — Core Web Vitals (LCP, INP, CLS) cho metrics người dùng thực
3. **Tầng tương tác** — Đo thời gian tùy chỉnh cho từng luồng người dùng

```tsx
// 1. React Profiler API — measure component render times
//    Đo thời gian render component
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
//    Theo dõi chỉ số Web Vitals
import { onLCP, onINP, onCLS } from "web-vitals";
onLCP((metric) => reportMetric({ name: "LCP", value: metric.value }));
onINP((metric) => reportMetric({ name: "INP", value: metric.value }));
onCLS((metric) => reportMetric({ name: "CLS", value: metric.value }));

// 3. Custom interaction timing
//    Đo thời gian tương tác tùy chỉnh
function useInteractionTiming(name: string) {
  return useCallback(
    (fn: () => void) => {
      const start = performance.now();
      fn();
      requestAnimationFrame(() => {
        const duration = performance.now() - start;
        if (duration > 100) {
          // > 100ms = slow interaction / tương tác chậm
          reportMetric({ interaction: name, duration });
        }
      });
    },
    [name],
  );
}
```

🇬🇧 **Metrics to track:**

- Component render duration > 16ms (frame budget)
- Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- Bundle size per route
- Long tasks (> 50ms blocking main thread)

🇻🇳 **Metrics cần theo dõi:**

- Thời gian render component > 16ms (ngân sách 1 frame)
- Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- Kích thước bundle theo route
- Long tasks (> 50ms chặn main thread)

**💡 Interview Signal / Dấu hiệu trả lời tốt:**

- ✅ Strong: Multi-layer monitoring (component + page + interaction), concrete thresholds, sampling strategy
- ❌ Weak: Only says "use Lighthouse" without mentioning programmatic monitoring

**🔗 Follow-up Chain:**

1. 🇬🇧 "Sampling strategy to not impact performance?" → Report 10% of users, rotate, aggregate server-side
   🇻🇳 "Chiến lược sampling để không ảnh hưởng performance?" → Report 10% users, xoay vòng, tổng hợp server-side
2. 🇬🇧 "How to alert when performance degrades?" → Threshold alerts: LCP > 4s, INP > 500ms → PagerDuty
   🇻🇳 "Cách cảnh báo khi performance giảm?" → Alert theo ngưỡng: LCP > 4s, INP > 500ms → PagerDuty
3. 🇬🇧 "A/B test performance impact?" → Compare metrics between control/experiment groups
   🇻🇳 "A/B test ảnh hưởng performance?" → So sánh metrics giữa nhóm control/experiment

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| #   | Question / Câu hỏi                                            | Level | Key Point / Điểm chính                                         |
| --- | ------------------------------------------------------------- | ----- | -------------------------------------------------------------- |
| Q1  | When to use React.memo / Khi nào dùng React.memo              | 🟢    | 3 conditions: frequent + expensive + stable props, last resort |
| Q2  | Prevent re-renders without memo / Ngăn re-render không memo   | 🟢    | State colocation, composition, context splitting — all FREE    |
| Q3  | useTransition vs debounce                                     | 🟡    | Fixed delay vs adaptive, network vs render work                |
| Q4  | Diagnose slow React app / Chẩn đoán app chậm                  | 🟡    | Measure → Identify → Fix → Verify workflow                     |
| Q5  | Dashboard optimization strategy / Chiến lược tối ưu Dashboard | 🔴    | Architecture first, selective subscription, profile-driven     |
| Q6  | memo vs useMemo vs useCallback                                | 🟡    | 3 tools work together, memo needs stable props                 |
| Q7  | Production performance monitoring / Monitoring production     | 🔴    | Multi-layer: Profiler API + Web Vitals + interaction timing    |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"How do you optimize a slow React application?"**

**🇬🇧 Ideal 30-second opening:**

1. "The first step is always to **measure** — I use React DevTools Profiler to identify which component is slowest, rather than guessing."
2. "After identifying it, I fix in priority order: **state colocation** (free), **composition** (free), **context splitting**, and only then **React.memo** — because memo is the last resort, not the first."
3. "Real example: a dashboard was slow when filtering. Root cause was all widgets subscribing to one large context. Fix: split context by concern → each widget only re-renders when its relevant filter changes."
4. "And I always **verify with the Profiler** after the fix — because intuition is often wrong, only data is accurate."

**🇻🇳 30 giây đầu — mở đầu lý tưởng:**

1. "Bước đầu tiên luôn là **đo** — tôi dùng React DevTools Profiler để xác định component nào chậm nhất, thay vì đoán."
2. "Sau khi identify, tôi fix theo thứ tự ưu tiên: **state colocation** (miễn phí), **composition** (miễn phí), **context splitting**, rồi cuối cùng mới **React.memo** — vì memo là giải pháp cuối, không phải đầu."
3. "Ví dụ thực tế: dashboard chậm khi filter. Nguyên nhân gốc: tất cả widgets subscribe cùng 1 context lớn. Fix: tách context theo concern → mỗi widget chỉ re-render khi filter liên quan thay đổi."
4. "Và luôn **xác nhận bằng Profiler** sau fix — vì cảm giác thường sai, chỉ data mới chính xác."

_Then expand based on interviewer's direction. / Sau đó mở rộng theo hướng interviewer dẫn dắt._

---

## Self-Check / Tự Kiểm Tra ⚡

> **Close the doc before attempting. / Đóng tài liệu lại trước khi làm.**

- [ ] **Retrieval**: Write 5 re-render prevention patterns in priority order from memory. Compare with the ranking above.
      Viết 5 re-render prevention patterns theo thứ tự ưu tiên từ trí nhớ. So sánh với ranking trên.
- [ ] **Visual**: Draw the Virtualization diagram (full list vs virtualized) on paper. Compare with ASCII above.
      Vẽ Virtualization diagram (full list vs virtualized) ra giấy. So sánh với ASCII trên.
- [ ] **Application**: A component renders 50ms each time, parent re-renders 10 times/second. How do you fix it? In what order?
      Component render 50ms mỗi lần, parent re-render 10 lần/giây. Bạn fix thế nào? Thứ tự?
- [ ] **Debug**: `React.memo(Table)` but Table still re-renders every time parent renders — cause? 3 fixes?
      `React.memo(Table)` nhưng Table vẫn re-render mỗi khi parent render — nguyên nhân? 3 cách fix?
- [ ] **Teach**: Explain why "measure before optimizing" to a junior colleague using the doctor-patient analogy.
      Giải thích tại sao "đo trước khi tối ưu" cho đồng nghiệp junior bằng ví dụ bác sĩ khám bệnh.

💬 **Feynman Prompt:** Explain the difference between state colocation and React.memo to someone who doesn't code, using the 20-floor apartment analogy. No technical terms.
Giải thích sự khác biệt giữa state colocation và React.memo cho người không biết code, dùng ví dụ chung cư 20 tầng. Không dùng thuật ngữ kỹ thuật.

🔁 **Spaced Repetition / Ôn lại:** Review this file after **3 days → 7 days → 14 days** to transfer to long-term memory.
Ôn lại file này sau **3 ngày → 7 ngày → 14 ngày** để chuyển vào trí nhớ dài hạn.

---

## Connections / Liên Kết

- ⬅️ **Built on / Xây dựng từ:** [Hooks Comprehensive](./07-hooks-comprehensive.md) — useTransition, useDeferredValue, useMemo
- ➡️ **Enables / Dẫn đến:** [Modern React Features](./10-modern-react-features.md) — React Compiler auto-memoization
- 🔗 **Applied in / Ứng dụng trong:** Core Web Vitals optimization, Design System performance budgets, Production monitoring
