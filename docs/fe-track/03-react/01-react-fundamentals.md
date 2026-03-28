# React Fundamentals / Nền Tảng React

> **Track**: Frontend — React | **Difficulty**: 🟢 Junior → 🟡 Mid
> **Prerequisites**: [JavaScript Closures](../02-javascript/), [HTML/CSS & DOM](../01-html-css/)
> **See also**: [Hooks Deep Dive](./03-hooks-deep-dive.md), [React 19 Features](./02-react-19-features.md)
> **L5 Competencies**: Component Architecture, Rendering Pipeline, Performance Mental Model

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn vào công ty mới. Senior giao: "Sửa trang giỏ hàng — khi thêm sản phẩm, số lượng, tổng tiền, và badge phải cập nhật cùng lúc."

Bạn mở code, thấy Vanilla JS:

```javascript
document.getElementById("cart-count").innerText = "3";
document.getElementById("product-5").classList.add("in-cart");
document.getElementById("total-price").innerText = "$150";
// ... 10 chỗ nữa cần update
```

Bạn sửa 1 chỗ — quên 2 chỗ khác → UI hiện số lượng "3" nhưng tổng tiền vẫn "$100". Bug.

React sinh ra để **xóa bỏ vấn đề này**: bạn chỉ mô tả "UI trông thế nào khi data = X", React lo toàn bộ việc update DOM.

---

## What & Why / Cái Gì & Tại Sao

**React = thư viện JavaScript để xây dựng UI.**

**Ví dụ liên tưởng — Excel:**

| Ô   | Giá trị                   |
| --- | ------------------------- |
| A1  | `5` (input)               |
| B1  | `=A1 * 2` → hiển thị `10` |

Bạn đổi A1 = 7 → B1 **tự động** thành 14. Bạn không cần "bảo" B1 cập nhật.

React hoạt động y hệt: **bạn thay đổi data → UI tự động cập nhật đúng**.

---

## Concept Map / Bản Đồ Khái Niệm

```
Bạn đang ở đây trong lộ trình học:

[JavaScript Closures] → [THIS: React Fundamentals] → [Hooks Deep Dive]
                                                    → [React 19 Features]
                                                    → [State Management]

Bên trong file này:
┌──────────────┐     ┌─────────┐     ┌───────────────────────┐
│ UI = f(state)│────▶│   JSX   │────▶│ Component & Props     │
└──────┬───────┘     └─────────┘     └───────────┬───────────┘
       │                                         │
       ▼                                         ▼
┌──────────────────────────┐     ┌──────────────────────────┐
│ Virtual DOM &            │────▶│ Render/Commit Phases     │
│ Reconciliation & Key     │     │ & Fiber Architecture     │
└──────────────────────────┘     └──────────────────────────┘
                                          │
                                          ▼
                                 ┌─────────────────┐
                                 │  Stale Closure   │
                                 │  (cái bẫy #1)    │
                                 └─────────────────┘
```

---

## Overview / Tổng Quan

React is a JavaScript library for building user interfaces declaratively. Instead of manually manipulating the DOM, you describe what the UI should look like for a given state, and React handles all DOM updates efficiently through its Virtual DOM and reconciliation algorithm.

React là thư viện JS giúp xây UI theo kiểu **khai báo** (declarative): bạn mô tả UI, React lo update. Đây là nền tảng — hiểu sai concepts ở đây sẽ hiểu sai mọi thứ phía sau. Trong phỏng vấn, câu hỏi về Virtual DOM, Reconciliation, và Fiber xuất hiện ở MỌI cấp độ.

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. UI = f(state) / Công Thức Cốt Lõi

> 🧠 **Memory Hook**: "UI = f(state) — cùng state → luôn cùng UI. Như Excel: đổi ô input → ô kết quả tự cập nhật."

**Tại sao tồn tại? / Why does this exist?**
Vấn đề: UI imperative (jQuery, Vanilla JS) yêu cầu dev tự tay update từng phần DOM → quên 1 chỗ = bug.
→ **Why?** Vì khi app phức tạp, số chỗ cần update tăng theo cấp số nhân. Con người không đáng tin trong việc nhớ hết.
→ **Why?** Vì bộ não con người chỉ giữ được ~7 items trong working memory. UI phức tạp vượt quá giới hạn đó.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Tưởng tượng bạn có 1 bảng LED hiển thị. Cách cũ: bạn tự tay lật từng ô LED — lật sai 1 ô là hình bị lệch. Cách React: bạn gửi 1 bức ảnh mới → bảng LED tự tính xem ô nào cần lật → lật đúng.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
state (data) ──▶ component (function) ──▶ UI (React Elements)
```

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  //     ^^^^^ state = data

  return <h1>{count * 2}</h1>;
  //     ^^^^^^^^^^^^^^^^ UI = kết quả
}

// setCount(7) → React gọi lại Counter() → return <h1>14</h1> → update DOM
```

```
┌──────────────────────────────────────────┐
│         UI = f(state) Pipeline           │
│                                          │
│  state={count:0}  ──▶  <h1>0</h1>       │
│       │                                  │
│  setCount(1)                             │
│       │                                  │
│  state={count:1}  ──▶  <h1>2</h1>       │
│       │                                  │
│  React diff: "0" → "2" → update DOM     │
└──────────────────────────────────────────┘
```

3 nguyên tắc kéo theo:

| Nguyên tắc                   | Nghĩa                                         | Ví dụ                                             |
| ---------------------------- | --------------------------------------------- | ------------------------------------------------- |
| **Declarative** (khai báo)   | Mô tả UI trông thế nào, KHÔNG nói cách update | `<h1>{count}</h1>` thay vì `el.innerText = count` |
| **Component-based**          | UI = nhiều hàm nhỏ ghép lại                   | `<App>` chứa `<Header>`, `<Cart>`                 |
| **Unidirectional** (1 chiều) | Data chảy từ cha → con qua props              | Parent → `<Cart items={items}>`                   |

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- React KHÔNG phải framework — nó chỉ lo phần View. Routing, state management, data fetching cần thêm thư viện khác.
- Declarative có overhead: React phải diff toàn bộ cây mỗi khi state đổi. Với app đơn giản, Vanilla JS nhanh hơn.
- "Cùng input → cùng output" yêu cầu component phải **pure** trong render phase (không side effects).

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                 | Tại sao sai                                               | Đúng là                                                     |
| --------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------- |
| "React là framework"                    | React chỉ là thư viện UI, không có routing/state built-in | React = thư viện View. Next.js mới là framework             |
| "React luôn nhanh hơn Vanilla JS"       | VDOM có overhead. Svelte compile-time không cần VDOM      | React tỏa sáng khi app phức tạp, nhiều update không dự đoán |
| Mutate state trực tiếp: `state.count++` | React không detect mutation, UI không update              | Luôn tạo state mới: `setCount(c => c + 1)`                  |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "React khác gì jQuery?", "Declarative vs Imperative?"
- → Nhớ đến: UI = f(state)
- → Mở đầu: _"React theo mô hình declarative: UI là hàm thuần của state. Cùng input luôn cho cùng output. Điều này khác imperative ở chỗ dev không cần tự tay update DOM — React tính diff và apply tối thiểu."_

**🔑 Knowledge Chain:**

- 📚 Cần biết trước: [JavaScript Functions & Closures](../02-javascript/) — vì component là function
- ➡️ Để hiểu tiếp: [Hooks](./03-hooks-deep-dive.md) — cách quản lý state trong function component

---

### 2. JSX / Cú Pháp JSX

> 🧠 **Memory Hook**: "JSX = HTML-like syntax trong JS. Compile thành `React.createElement()` → plain JS object. Không magic."

**Tại sao tồn tại? / Why does this exist?**
Vấn đề: `React.createElement("div", {className: "card"}, React.createElement("h1", null, "Hello"))` quá dài và khó đọc.
→ **Why?** Vì UI inherently là tree structure, cần syntax giống HTML để dễ hình dung cấu trúc.
→ **Why?** Vì developer productivity phụ thuộc vào khả năng đọc code nhanh. Syntax gần HTML = mental model match.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

JSX giống như viết tắt. Thay vì viết đầy đủ "Thành phố Hồ Chí Minh" mỗi lần, bạn viết "TP.HCM". Ai đọc cũng hiểu, và máy tính tự động mở rộng thành tên đầy đủ khi cần.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```jsx
// Bạn viết JSX:
const el = <h1 className="title">Xin chào</h1>;

// Babel/SWC compile thành:
const el = React.createElement("h1", { className: "title" }, "Xin chào");

// Kết quả = plain JS object (React Element):
{ type: "h1", props: { className: "title", children: "Xin chào" }, key: null, ref: null }
```

```
┌─────────────────────────────────────────────────────┐
│                 JSX Compilation Pipeline             │
│                                                     │
│  <div className="app">     Babel/SWC     JS Object  │
│    <h1>Hello</h1>       ──────────▶  { type: "div", │
│  </div>                              props: {...}}   │
│                                                     │
│  Viết lúc dev          Build time     Chạy ở browser│
└─────────────────────────────────────────────────────┘
```

Khác biệt JSX vs HTML:

| HTML            | JSX                 | Lý do                       |
| --------------- | ------------------- | --------------------------- |
| `class="title"` | `className="title"` | `class` là keyword trong JS |
| `for="email"`   | `htmlFor="email"`   | `for` là keyword trong JS   |
| `onclick="..."` | `onClick={...}`     | JSX dùng camelCase          |
| `<br>`          | `<br />`            | JSX yêu cầu self-closing    |

Quy tắc JSX:

```jsx
// 1. CHỈ TRẢ VỀ 1 ELEMENT GỐC — dùng Fragment <>...</> nếu cần
return (
  <>
    <h1>Title</h1>
    <p>Content</p>
  </>
);

// 2. {} để nhúng JavaScript expression (KHÔNG phải statement)
return <h1>Xin chào, {user.name}!</h1>;

// 3. Ternary thay vì if/else
return <div>{loggedIn ? "Hello" : "Please login"}</div>;
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

**Cái bẫy `0 && <Component />`:**

```jsx
const count = 0;
// ❌ Hiển thị số "0" trên màn hình!
return <div>{count && <ProductList />}</div>;
// Vì: 0 && X = 0 (JS short-circuit), JSX render số 0 ra DOM

// ✅ Fix:
return <div>{count > 0 && <ProductList />}</div>;
```

**JSX injection:** JSX auto-escape strings → an toàn trước XSS. Nhưng `dangerouslySetInnerHTML` bypass escape → nguy hiểm nếu dùng với user input.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                           | Tại sao sai                          | Đúng là                          |
| --------------------------------- | ------------------------------------ | -------------------------------- |
| `{count && <Comp />}` khi count=0 | `0 && X = 0`, JSX render số 0        | Dùng `count > 0 &&` hoặc ternary |
| Viết `class` thay vì `className`  | `class` là reserved keyword trong JS | Luôn dùng `className`            |
| Return nhiều elements không bọc   | JSX chỉ return 1 root element        | Bọc trong `<>...</>` Fragment    |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "JSX là gì?", "JSX khác HTML thế nào?"
- → Nhớ đến: JSX = syntactic sugar → compile → React.createElement → object
- → Mở đầu: _"JSX là syntax extension cho JavaScript, compile thành React.createElement() calls. Kết quả là plain JS objects mô tả UI tree — không phải HTML thật."_

**🔑 Knowledge Chain:**

- 📚 Cần biết trước: [JavaScript Expression vs Statement](../02-javascript/) — biết cái nào dùng trong `{}`
- ➡️ Để hiểu tiếp: [Component & Props](#3-component--props--thành-phần--tham-số) — JSX tạo elements, components tổ chức chúng

---

### 3. Component & Props / Thành Phần & Tham Số

> 🧠 **Memory Hook**: "Component = hàm nhận props, trả về JSX. Props = read-only — con KHÔNG được sửa."

**Tại sao tồn tại? / Why does this exist?**
Vấn đề: UI phức tạp viết trong 1 file = không thể maintain.
→ **Why?** Vì cần chia nhỏ + tái sử dụng. Button dùng 50 chỗ, không thể viết 50 lần.
→ **Why?** Vì DRY principle + separation of concerns = code dễ test, dễ thay đổi, dễ chia việc trong team.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Component = khuôn bánh. Props = nguyên liệu bạn đổ vào khuôn. Cùng khuôn (component) nhưng đổ chocolate hay vanilla (props khác nhau) → ra bánh khác nhau. Nhưng bạn KHÔNG THỂ thay đổi khuôn từ bên trong — khuôn do nhà máy (parent) quyết định.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```jsx
// Component = function nhận props, return JSX
function Greeting({ name, age }) {
  return (
    <h1>
      Xin chào {name}, {age} tuổi!
    </h1>
  );
}

// Parent truyền props xuống
function App() {
  return <Greeting name="Buu" age={25} />;
}
```

```
┌───────────────────────────────────────────────┐
│              Component Tree                    │
│                                               │
│  <App>                                        │
│    │── props: {}                              │
│    │                                          │
│    ├─ <Header>                                │
│    │    └── props: { title: "Shop" }          │
│    │                                          │
│    ├─ <ProductList>                            │
│    │    └── props: { items: [...] }           │
│    │    │                                     │
│    │    ├─ <ProductCard>                       │
│    │    │    └── props: { product: {id:1} }   │
│    │    └─ <ProductCard>                       │
│    │         └── props: { product: {id:2} }   │
│    │                                          │
│    └─ <Cart>                                  │
│         └── props: { count: 2 }               │
│                                               │
│  Data flows ONE WAY: parent → child           │
└───────────────────────────────────────────────┘
```

**Props children — nội dung bên trong tag:**

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

<Card>
  <h2>Tiêu đề</h2>
  <p>Nội dung bất kỳ</p>
</Card>;
```

**Quy tắc vàng: Props là READ-ONLY:**

```jsx
// ❌ TUYỆT ĐỐI KHÔNG:
function Greeting({ name }) {
  name = "Hacked"; // Vi phạm! Con không sửa props
}

// ✅ Nếu cần thay đổi → dùng state (học ở file hooks)
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Prop drilling:** Truyền props qua 5-6 tầng component → khó maintain. Giải pháp: Context API hoặc state management library.
- **Render khi props thay đổi:** Parent re-render → tạo object/function mới làm props → child re-render dù giá trị không đổi. Giải pháp: `React.memo()`, `useMemo`, `useCallback`.
- **Default props:** Dùng destructuring default: `function Btn({ variant = "primary" })`.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                               | Tại sao sai                                   | Đúng là                                               |
| ----------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------- |
| Mutate props: `props.name = "X"`                      | Violates one-way data flow, gây bug khó trace | Props immutable. Cần thay đổi → dùng state + callback |
| Inline object props: `<Comp style={{color:"red"}} />` | Tạo object mới mỗi render → child re-render   | Extract ra biến ngoài hoặc dùng useMemo               |
| Component name lowercase: `function card()`           | React nghĩ là HTML tag, không phải component  | Luôn PascalCase: `function Card()`                    |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "Props vs State?", "Prop drilling?"
- → Nhớ đến: Props = read-only, one-way flow, parent controls
- → Mở đầu: _"Props là dữ liệu truyền từ parent xuống child, read-only. State là dữ liệu component tự quản lý. Props flow one-way — child muốn thay đổi parent thì gọi callback function được truyền qua props."_

**🔑 Knowledge Chain:**

- 📚 Cần biết trước: [JSX](#2-jsx--cú-pháp-jsx) — JSX tạo elements để component return
- ➡️ Để hiểu tiếp: [Virtual DOM](#4-virtual-dom--reconciliation--key) — component tree → Virtual DOM tree

---

### 4. Virtual DOM, Reconciliation & Key / DOM Ảo, Đối Soát & Khóa

> 🧠 **Memory Hook**: "VDOM = bản nháp JS trước khi vẽ lên DOM thật. Reconciliation so sánh 2 bản nháp bằng 2 quy tắc O(n). Key = thẻ tên để React không nhầm lẫn."

**Tại sao tồn tại? / Why does this exist?**
Vấn đề: Update DOM thật rất chậm (browser phải reflow + repaint).
→ **Why?** Vì DOM API là synchronous, blocking main thread. Mỗi `el.innerHTML = ...` trigger layout recalculation.
→ **Why?** Vì browser rendering pipeline: DOM change → Style → Layout → Paint → Composite. Mỗi DOM write có thể trigger cả chain.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Bạn viết văn bản 100 trang. Mỗi khi sửa 1 câu, thay vì in lại 100 trang, bạn: (1) sửa trên bản nháp, (2) so sánh bản nháp mới vs cũ, (3) chỉ in lại trang có thay đổi. Virtual DOM = bản nháp đó.

Còn Key = thẻ tên dán trên mỗi trang. Khi bạn xáo trộn thứ tự trang, nhờ thẻ tên mà bạn biết trang nào vẫn giữ nguyên, trang nào mới thêm, trang nào bị xóa.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

**Virtual DOM = cây JS objects:**

```jsx
// JSX bạn viết:
<div className="app">
  <h1>Hello</h1>
  <p>World</p>
</div>

// Virtual DOM (plain JS object):
{
  type: "div",
  props: {
    className: "app",
    children: [
      { type: "h1", props: { children: "Hello" } },
      { type: "p",  props: { children: "World" } }
    ]
  }
}
```

**Reconciliation — 2 quy tắc so sánh:**

```
┌────────────────────────────────────────────────────────┐
│  Reconciliation Algorithm (O(n))                       │
│                                                        │
│  Quy tắc 1: KHÁC loại tag → XÓA cây con, làm lại     │
│  ┌─────────┐      ┌──────────┐                         │
│  │  <div>   │  →   │  <span>  │  = Xóa hết + mount mới│
│  │ <Counter>│      │ <Counter>│    (state Counter RESET)│
│  └─────────┘      └──────────┘                         │
│                                                        │
│  Quy tắc 2: CÙNG loại + CÙNG key → giữ, update props  │
│  ┌──────────────┐      ┌──────────────┐                │
│  │ <btn class=  │  →   │ <btn class=  │  = Giữ node,  │
│  │  "blue">     │      │  "red">      │    đổi class   │
│  └──────────────┘      └──────────────┘                │
│                                                        │
│  Tại sao O(n)? Tree diff chuẩn = O(n³), quá chậm.     │
│  2 heuristics trên đúng >99% trường hợp thực tế.      │
└────────────────────────────────────────────────────────┘
```

**Key — tại sao cần và dùng thế nào:**

```jsx
// ❌ KHÔNG có key → React so sánh theo VỊ TRÍ:
// Trước: [Táo(0), Cam(1), Xoài(2)]
// Sau xóa Táo: [Cam(0), Xoài(1), Nho(2)]
// React: vị trí 0 "Táo"→"Cam" (update), vị trí 1 "Cam"→"Xoài" (update)...
// → Update CẢ 3 items! Dù chỉ cần xóa 1, thêm 1.

// ✅ CÓ key → React so sánh theo ĐỊNH DANH:
<li key="cam">Cam</li>     // key "cam" còn → giữ nguyên
<li key="xoai">Xoài</li>   // key "xoai" còn → giữ nguyên
<li key="nho">Nho</li>     // key "nho" mới → tạo mới
// key "tao" mất → xóa. Chỉ 2 thao tác thay vì 3.
```

**Trick: Dùng key để RESET component:**

```jsx
// Đổi userId → key khác → React xóa component cũ + mount mới → state reset
<UserProfile key={userId} userId={userId} />
// Không cần useEffect phức tạp để reset form!
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **VDOM không luôn nhanh hơn:** Svelte (compile-time) không dùng VDOM nhưng vẫn nhanh. VDOM tỏa sáng khi app phức tạp, nhiều update không dự đoán.
- **Index làm key — khi nào OK?** Chỉ khi: list TĨNH (không thêm/xóa/sort) VÀ items không có state riêng.
- **Bug index-as-key:** Todo list có checkbox → xóa item đầu → checkbox state bị gán cho item tiếp theo vì key=0 vẫn match.

```
Bug demo — index as key:
Ban đầu:                     Sau xóa "Mua sữa":
key=0 → "Mua sữa" ✓ checked   key=0 → "Giặt đồ" ✓ (state cũ từ key=0!)
key=1 → "Giặt đồ"              key=1 → "Nấu cơm" (state cũ từ key=1!)
key=2 → "Nấu cơm"
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                               | Tại sao sai                                                                     | Đúng là                                      |
| ------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------- |
| "VDOM nhanh hơn real DOM"             | VDOM có overhead (diff + object creation). Nhanh hơn **naive** DOM manipulation | VDOM giảm số lần chạm DOM thật xuống minimum |
| Dùng `index` làm key cho dynamic list | Xóa/sort → state match sai item                                                 | Dùng `item.id` — id ổn định từ data          |
| `key={Math.random()}`                 | Key mới mỗi render → React unmount + remount mọi thứ mỗi lần                    | Key phải stable, unique trong siblings       |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "Virtual DOM hoạt động thế nào?", "Tại sao cần key?"
- → Nhớ đến: Bản nháp → diff O(n) → 2 quy tắc → key = thẻ tên
- → Mở đầu: _"Virtual DOM là cây JS objects mô tả UI. Khi state đổi, React tạo VDOM mới, so sánh với cũ bằng thuật toán O(n) dựa trên 2 heuristics: khác tag thì xóa cây con, cùng tag thì diff props. Key giúp React nhận dạng phần tử trong list để diff chính xác."_

**🔑 Knowledge Chain:**

- 📚 Cần biết trước: [Component & Props](#3-component--props--thành-phần--tham-số) — component tree tạo VDOM tree
- ➡️ Để hiểu tiếp: [Render/Commit Phases](#5-render-phase--commit-phase--hai-giai-đoạn-render) — VDOM diff xảy ra ở đâu trong pipeline

---

### 5. Render Phase & Commit Phase / Hai Giai Đoạn Render

> 🧠 **Memory Hook**: "Render = vẽ bản thiết kế (pure, có thể hủy). Commit = thợ xây thi công (sync, 1 lần). Side effects chỉ ở Commit."

**Tại sao tồn tại? / Why does this exist?**
Vấn đề: Nếu update DOM ngay trong render → render bị interrupt giữa chừng → user thấy UI nửa cũ nửa mới.
→ **Why?** Vì Concurrent Mode cần khả năng hủy/tạm dừng render. Nếu DOM đã bị sửa thì không rollback được.
→ **Why?** Vì user experience: input phải phản hồi ngay, không chờ heavy render xong.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Kiến trúc sư (Render Phase): vẽ bản thiết kế trên giấy. Có thể vẽ lại bao nhiêu lần cũng được, xé bỏ, sửa — chưa đụng gì đến nhà thật. Thợ xây (Commit Phase): khi bản vẽ hoàn chỉnh, thi công 1 lần, nhanh gọn, không dừng giữa chừng.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
┌──────────────────────────────────────────────────────┐
│  RENDER PHASE (kiến trúc sư vẽ bản thiết kế)        │
│                                                      │
│  1. React gọi component functions                    │
│  2. Tạo Virtual DOM mới (React Elements)             │
│  3. Diff với VDOM cũ → tính danh sách thay đổi      │
│                                                      │
│  ⚠️ KHÔNG chạm DOM thật                             │
│  ⚠️ KHÔNG side effects (fetch, localStorage, etc.)  │
│  ✅ CÓ THỂ bị interrupt & làm lại (Concurrent Mode) │
│  ✅ CÓ THỂ chạy nhiều lần cho cùng 1 update        │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│  COMMIT PHASE (thợ xây thi công)                     │
│                                                      │
│  1. Apply changes lên DOM thật                       │
│  2. Chạy useLayoutEffect() — đồng bộ, trước paint   │
│  3. Browser paint (vẽ pixel lên màn hình)            │
│  4. Chạy useEffect() — bất đồng bộ, sau paint       │
│                                                      │
│  ⚠️ ĐỒNG BỘ — không thể interrupt                  │
│  ⚠️ Xảy ra 1 lần duy nhất                          │
└──────────────────────────────────────────────────────┘
```

**Hệ quả trực tiếp cho code:**

```jsx
function MyComponent() {
  // ❌ SAI — render phase KHÔNG được có side effects
  fetch("/api/data");          // side effect!
  document.title = "Hello";    // chạm DOM!
  localStorage.setItem(...);   // side effect!

  // ✅ ĐÚNG — side effects trong useEffect (chạy ở commit phase)
  useEffect(() => {
    fetch("/api/data");
    document.title = "Hello";
  }, []);

  return <div>...</div>;
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **StrictMode gọi render 2 lần** (dev only) để phát hiện side effects trong render phase. Nếu code bạn bị ảnh hưởng → code sai, không phải React sai.
- **useLayoutEffect vs useEffect:** useLayoutEffect chạy đồng bộ SAU DOM update, TRƯỚC paint → dùng khi cần đo/sửa DOM trước khi user thấy (tránh flicker). useEffect chạy SAU paint.
- **Render ≠ DOM update:** Component re-render nhưng output giống hệt → Commit phase không update DOM. React tối ưu sẵn.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                             | Tại sao sai                                            | Đúng là                                                       |
| ----------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------- |
| fetch() trong render body           | Render phase phải pure; fetch là side effect           | Dùng useEffect hoặc data fetching library                     |
| Nghĩ "render = DOM update"          | Render = tạo VDOM. DOM chỉ update ở commit nếu có diff | Re-render ≠ DOM update. React skip DOM write nếu output giống |
| `console.log` trong render để debug | Bị gọi 2x trong StrictMode, gây nhầm lẫn               | Biết StrictMode gọi 2 lần → console.log 2x là bình thường     |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "Render phase vs Commit phase?", "Tại sao tách 2 phase?"
- → Nhớ đến: Render = pure + interruptible, Commit = sync + final
- → Mở đầu: _"React tách update thành 2 phase. Render phase tạo VDOM và diff — pure, có thể interrupt trong Concurrent Mode. Commit phase apply changes lên DOM thật — synchronous, 1 lần. Tách như vậy để React có thể hủy render nếu có update ưu tiên hơn, và user luôn thấy UI nhất quán."_

**🔑 Knowledge Chain:**

- 📚 Cần biết trước: [Virtual DOM & Reconciliation](#4-virtual-dom-reconciliation--key--dom-ảo-đối-soát--khóa) — diff xảy ra trong render phase
- ➡️ Để hiểu tiếp: [Fiber Architecture](#6-fiber-architecture--kiến-trúc-fiber) — Fiber cho phép interrupt render phase

---

### 6. Fiber Architecture / Kiến Trúc Fiber

> 🧠 **Memory Hook**: "Fiber = linked list thay vì đệ quy. React xử lý từng node, giữa mỗi node kiểm tra: có việc gấp hơn không? Nếu có → nhường → quay lại sau."

**Tại sao tồn tại? / Why does this exist?**
Vấn đề: React 15 render = đệ quy đồng bộ → không dừng giữa chừng. Component tree lớn → block main thread → UI đơ.
→ **Why?** Vì browser chỉ có 1 main thread cho cả JS + rendering. Block 200ms = 200ms user không thể tương tác.
→ **Why?** Vì human perception: delay >100ms = nhận thấy lag. >300ms = frustrating. UI phải phản hồi <100ms.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

React 15 = đầu bếp nấu 1 món 30 phút liên tục, không nghỉ. Khách VIP tới? Chờ. React Fiber = đầu bếp chia món thành bước 2 phút. Sau mỗi bước, kiểm tra: "Có order gấp không?" → có thì xử lý order gấp → quay lại bước tiếp.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

Mỗi component = 1 **Fiber node** (object trong linked list):

```
Fiber Node = {
  type: Button,           // component nào
  child: → Fiber con      // con đầu tiên
  sibling: → Fiber kế     // anh em bên phải
  return: → Fiber cha     // cha

  memoizedState: ...,     // hooks data (linked list)
  lanes: ...,             // priority (high/low)
}
```

```
┌─────────────────────────────────────────────────────┐
│               Fiber Linked List                      │
│                                                     │
│  App ──child──▶ Header ──sibling──▶ ProductList     │
│   ▲               │                    │            │
│   │return       child              child            │
│   │               ▼                    ▼            │
│   │             Logo          ProductCard ──sib──▶ ProductCard
│   │                              │                  │
│   └──────────────────────────────┘                  │
│                  (return links go up)               │
│                                                     │
│  Traversal: child → child → sibling → return → ...  │
│  CÓ THỂ DỪNG ở bất kỳ node nào, quay lại sau      │
└─────────────────────────────────────────────────────┘
```

**Priority Lanes — hệ thống ưu tiên:**

```
Ưu tiên CAO (xử lý ngay):     Ưu tiên THẤP (có thể chờ):
• User click, gõ phím           • Render list 10,000 items
• Input focus/blur              • Update chart phức tạp
• Hover state                   • Offscreen content
```

```jsx
import { useTransition } from "react";

function SearchApp() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    setQuery(e.target.value); // HIGH priority → input cập nhật NGAY
    startTransition(() => {
      setResults(search(e.target.value)); // LOW priority → render kết quả có thể chờ
    });
  }

  return (
    <>
      <input onChange={handleChange} value={query} />
      {isPending ? <p>Đang tìm...</p> : <ResultsList items={results} />}
    </>
  );
}
// Kết quả: gõ → input phản hồi ngay, list update sau. Không bao giờ "đơ".
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Double buffering:** Fiber duy trì 2 cây — `current` (đang hiển thị) và `workInProgress` (đang tính). Khi xong → swap. Giống GPU double buffering.
- **Time slicing:** React chia render thành chunks ~5ms, yield cho browser giữa mỗi chunk. Dùng `MessageChannel` (không phải `requestIdleCallback`).
- **Không phải tất cả update đều concurrent:** `flushSync()` force synchronous update. `useLayoutEffect` callback chạy synchronously.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                            | Tại sao sai                                                   | Đúng là                                                      |
| ---------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------ |
| "Fiber làm React nhanh hơn"        | Fiber làm React **responsive** hơn, không nhanh hơn           | Fiber cho phép interrupt + prioritize, không giảm total work |
| Nghĩ mọi render đều concurrent     | Chỉ update trong startTransition/Suspense mới concurrent      | Default vẫn là synchronous. Concurrent là opt-in             |
| Đặt heavy computation trong render | Fiber interrupt render nhưng computation vẫn block từng chunk | Dùng useMemo, Web Worker, hoặc move computation ra ngoài     |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "Fiber là gì?", "Concurrent rendering?"
- → Nhớ đến: Linked list, interrupt, priority lanes, time slicing
- → Mở đầu: _"Fiber là kiến trúc render mới từ React 16, biểu diễn mỗi component thành node trong linked list thay vì đệ quy. Điều này cho phép React interrupt render giữa chừng, ưu tiên user input, và resume sau — nền tảng cho Concurrent Mode, startTransition, Suspense."_

**🔑 Knowledge Chain:**

- 📚 Cần biết trước: [Render/Commit Phases](#5-render-phase--commit-phase--hai-giai-đoạn-render) — Fiber cho phép interrupt render phase
- ➡️ Để hiểu tiếp: [Hooks](./03-hooks-deep-dive.md) — hooks data lưu trong Fiber node (memoizedState)

---

### 7. Stale Closure / Closure Cũ

> 🧠 **Memory Hook**: "Mỗi render = 1 bức ảnh chụp state. Callback từ render cũ mãi dùng giá trị cũ. Fix: functional updater `prev =>` hoặc useRef."

**Tại sao tồn tại? / Why does this exist?**
Vấn đề: JavaScript closures capture biến theo reference tại thời điểm tạo. Mỗi render React tạo closure mới → closure cũ vẫn giữ giá trị cũ.
→ **Why?** Vì React gọi lại component function mỗi render, tạo scope mới, nhưng callbacks (setTimeout, event handlers) vẫn reference scope cũ.
→ **Why?** Vì đây là bản chất của JavaScript — closure là feature, không phải bug. React chỉ khiến nó trở nên rõ ràng hơn.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Bạn chụp ảnh phòng mình. 1 tuần sau dọn phòng, mua đồ mới. Nhưng bức ảnh vẫn hiện phòng cũ. Trong React, mỗi render = chụp 1 bức ảnh state. Callback từ render cũ = nhìn bức ảnh cũ, không biết phòng đã thay đổi.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count); // Luôn là 0!
      setCount(count + 1); // Luôn là 0 + 1 = 1!
    }, 1000);
    return () => clearInterval(id);
  }, []);
  // deps=[] → effect chạy 1 LẦN → closure capture count=0 MÃIMÃI
}
```

```
┌────────────────────────────────────────────────────┐
│           Stale Closure Timeline                    │
│                                                    │
│  Render 1: count=0                                 │
│    └─ useEffect chạy, tạo setInterval              │
│       └─ callback closure capture: count=0         │
│                                                    │
│  1 giây sau: setCount(0+1) → count=1               │
│                                                    │
│  Render 2: count=1                                 │
│    └─ useEffect KHÔNG chạy lại (deps=[])           │
│       └─ setInterval callback VẪN dùng count=0    │
│                                                    │
│  2 giây sau: setCount(0+1) → count vẫn =1          │
│  3 giây sau: setCount(0+1) → count vẫn =1          │
│  ...mãi mãi count=1 ──── BUG!                     │
└────────────────────────────────────────────────────┘
```

**Fix 1 — Functional updater (phổ biến nhất):**

```jsx
setCount((prev) => prev + 1);
// Không đọc count từ closure
// React đưa giá trị mới nhất qua tham số `prev`
```

**Fix 2 — useRef (khi cần ĐỌC giá trị, không chỉ SET):**

```jsx
const countRef = useRef(0);

useEffect(() => {
  countRef.current = count; // cập nhật mỗi render
}, [count]);

useEffect(() => {
  const id = setInterval(() => {
    console.log(countRef.current); // luôn đọc giá trị mới nhất!
  }, 1000);
  return () => clearInterval(id);
}, []);
```

| Tình huống                                        | Dùng                    |
| ------------------------------------------------- | ----------------------- |
| Chỉ cần SET state dựa trên state cũ               | `setState(prev => ...)` |
| Cần ĐỌC giá trị mới nhất (log, API call, so sánh) | `useRef`                |

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Event handlers cũng có stale closure** nhưng ít gây bug vì React tạo handler mới mỗi render. Vấn đề chủ yếu ở `setTimeout`, `setInterval`, `addEventListener` bên ngoài React.
- **useEffect cleanup + re-run:** Thêm `count` vào deps sẽ fix stale nhưng tạo interval mới mỗi giây → acceptable cho timeout, problematic cho interval.
- **React 19 compiler:** Có thể auto-detect một số stale closure patterns, nhưng không fix được tất cả.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                     | Tại sao sai                                             | Đúng là                                                    |
| ------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------- |
| "Thêm count vào deps array" để fix interval | Interval bị clear + recreate mỗi giây → drift over time | Dùng functional updater: `prev => prev + 1`                |
| Nghĩ stale closure là bug của React         | Đây là behavior của JavaScript closures                 | React expose nó rõ hơn vì re-render tạo scope mới liên tục |
| Dùng `useRef` cho mọi thứ để tránh stale    | Ref changes không trigger re-render → UI không update   | Chỉ dùng ref khi cần ĐỌC mà không cần UI update            |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "Stale closure?", "setInterval trong useEffect?"
- → Nhớ đến: Mỗi render = snapshot, closure capture tại thời điểm render
- → Mở đầu: _"Stale closure xảy ra khi callback capture state/props từ render cũ. Trong React, mỗi render tạo closure mới, nhưng callbacks từ render trước vẫn giữ giá trị cũ. Fix bằng functional updater khi chỉ cần set, hoặc useRef khi cần đọc giá trị mới nhất."_

**🔑 Knowledge Chain:**

- 📚 Cần biết trước: [JavaScript Closures](../02-javascript/) — hiểu closure mới hiểu stale closure
- ➡️ Để hiểu tiếp: [Hooks Deep Dive](./03-hooks-deep-dive.md) — useEffect, useRef, useCallback và stale closure

---

## Q&A Section / Câu Hỏi Phỏng Vấn

---

### Q1: UI = f(state) có nghĩa gì? Declarative vs Imperative? 🟢 Junior

**A:** UI = f(state) means the UI is a pure function of state: same state always produces the same UI output. Declarative means you describe WHAT the UI should look like; imperative means you describe HOW to update it step by step.

Mỗi component là 1 hàm: cho cùng state/props → luôn trả về cùng UI. React gọi lại hàm khi state đổi, diff kết quả, update DOM tối thiểu. Declarative: `<h1>{count}</h1>`. Imperative: `element.innerText = count`. Declarative ít bug hơn vì dev không cần nhớ update từng DOM node.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Liên kết declarative ↔ pure function, nhắc unidirectional data flow, nêu trade-off (overhead diff)
- ❌ Weak: "React update DOM khi state đổi" — đúng nhưng quá chung, không cho thấy hiểu bản chất

---

### Q2: JSX là gì? Khác HTML thế nào? 🟢 Junior

**A:** JSX is a syntax extension that lets you write HTML-like code in JavaScript. It compiles to `React.createElement()` calls, producing plain JS objects (React Elements) — not actual HTML or DOM nodes.

JSX → Babel/SWC compile → `React.createElement()` → plain JS object. Khác HTML: `className` thay `class`, `htmlFor` thay `for`, self-closing tags bắt buộc, dùng `{}` để nhúng JS expressions. JSX tự escape strings → an toàn XSS mặc định.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu compilation pipeline, biết kết quả là JS object không phải DOM, nhắc XSS safety
- ❌ Weak: "JSX giống HTML nhưng viết trong JavaScript" — đúng bề mặt, không hiểu compile step

---

### Q3: Virtual DOM là gì? Reconciliation hoạt động thế nào? 🟡 Mid

**A:** Virtual DOM is a lightweight JS object tree describing the UI. When state changes, React creates a new VDOM, diffs it against the previous one using an O(n) algorithm with 2 heuristics, and applies minimal changes to the real DOM.

VDOM = cây JS objects mô tả UI, rất nhẹ so với DOM thật. Reconciliation so sánh 2 VDOM trees bằng 2 quy tắc: (1) khác loại tag → xóa cây con, tạo mới, (2) cùng loại + cùng key → giữ node, update props. Thuật toán O(n) thay vì O(n³) của tree diff chuẩn. Trade-off: đôi khi xóa + tạo lại không cần thiết, nhưng đúng >99% trường hợp.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu O(n) + 2 heuristics cụ thể, biết VDOM không luôn nhanh hơn (Svelte)
- ❌ Weak: "VDOM nhanh hơn real DOM" — oversimplified, misses the point

---

### Q4: Tại sao cần key? Index làm key có vấn đề gì? 🟡 Mid

**A:** Keys help React identify which items in a list have changed, been added, or removed. Without keys, React compares by position — which breaks when items are reordered, deleted, or inserted.

Key = thẻ tên cho phần tử trong list. Không có key → React so sánh theo vị trí → xóa/sort gây state match sai item. Bug: todo list có checkbox, xóa item đầu → checked state bị gán cho item tiếp theo. Index chỉ OK khi list tĩnh + items không có state.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu bug cụ thể (state assigned sai), biết khi nào index OK, biết trick reset component bằng key
- ❌ Weak: "Key giúp React render nhanh hơn" — thiếu khía cạnh correctness, mới chỉ nói performance

---

### Q5: Render Phase vs Commit Phase? Tại sao tách 2 phase? 🟡 Mid

**A:** Render Phase creates VDOM and diffs — it's pure and interruptible in Concurrent Mode. Commit Phase applies changes to the real DOM — it's synchronous and runs once. This separation enables React to cancel/reprioritize renders without corrupting the UI.

Render phase: gọi component functions, tạo VDOM, diff — pure, không chạm DOM, có thể interrupt + chạy lại nhiều lần. Commit phase: apply lên DOM thật, chạy useLayoutEffect (trước paint) rồi useEffect (sau paint) — synchronous, 1 lần. Tách 2 phase để Concurrent Mode có thể hủy render nếu có update ưu tiên hơn.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Biết render có thể chạy nhiều lần, phân biệt useLayoutEffect vs useEffect timing, nhắc Concurrent Mode
- ❌ Weak: Chỉ mô tả "trước render / sau render" mà không nhắc interruptibility

---

### Q6: Fiber Architecture là gì? Tại sao React cần nó? 🔴 Senior

**A:** Fiber is React's reimplemented reconciliation engine (React 16+). It represents each component as a node in a linked list instead of recursive call stack, enabling React to pause, abort, and resume rendering work — the foundation for Concurrent Mode.

React 15: render = đệ quy đồng bộ, không dừng được. Tree lớn → block main thread → UI đơ. Fiber biểu diễn component thành linked list (child/sibling/return pointers). React xử lý từng node, giữa mỗi node check: có task ưu tiên cao hơn? Nếu có → yield → resume sau. Priority lanes phân loại: user input = high, background render = low. Double buffering: current tree + workInProgress tree → swap khi xong.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích vấn đề trước Fiber, linked list vs đệ quy, priority lanes, double buffering, time slicing ~5ms chunks
- ❌ Weak: "Fiber giúp React nhanh hơn" — Fiber làm responsive hơn, total work không giảm

**🔴 Follow-up Chain:**

1. "Fiber dùng linked list cụ thể thế nào? Child/sibling/return pointer?" → Traversal algorithm: child → sibling → return, có thể bookmark bất kỳ node nào
2. "Priority lanes hoạt động ra sao? Có bao nhiêu lane?" → 31 lanes (bitmask), SyncLane cho flushSync, DefaultLane cho setState, TransitionLane cho startTransition
3. "Time slicing thực tế dùng API nào? requestIdleCallback?" → Không, dùng MessageChannel. rIC có vấn đề: không fire khi tab inactive, priority không đủ granular

---

### Q7: Stale closure trong React là gì? Cách fix? 🔴 Senior

**A:** Stale closure occurs when a callback captures state/props from a previous render and continues using those outdated values. In React, every render creates a new closure scope, but asynchronous callbacks (setTimeout, setInterval) from earlier renders still reference the old scope.

Mỗi render = snapshot state. Callback từ render N giữ giá trị render N. Bug: setInterval trong useEffect deps=[] → closure mãi dùng count ban đầu. Fix: (1) functional updater `prev => prev + 1` khi chỉ cần SET, (2) useRef khi cần ĐỌC giá trị mới nhất. Thêm dep vào array không phải best fix cho interval vì recreate mỗi giây → drift.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích closure capture tại render time, biết cả 2 fix + khi nào dùng, biết thêm dep vào interval có vấn đề
- ❌ Weak: "Thêm variable vào deps array" — surface fix, misses functional updater pattern

**🔴 Follow-up Chain:**

1. "Functional updater vs useRef — khi nào dùng cái nào?" → Updater khi chỉ SET. Ref khi cần READ (log, API call, comparison). Ref change không trigger re-render.
2. "Nếu callback cần đọc NHIỀU state values, không chỉ 1?" → useRef cho mỗi value, hoặc 1 ref object chứa tất cả. Hoặc useReducer — dispatch stable, reducer nhận current state.
3. "React 19 Compiler có fix stale closure không?" → Compiler auto-memoize nhưng không fix stale closure vì đây là JS behavior, không phải React issue. Dev vẫn cần hiểu closure.

---

### Q8: Thiết kế virtualized list cho 100,000 items? 🔴 Senior

**A:** Rendering 100k DOM nodes crashes the browser. Virtualization renders only visible items (~20-50) by calculating which items are in viewport based on scroll position, using a spacer element for correct scrollbar height.

Render 100k DOM nodes = crash. Virtualization: (1) container fixed height + overflow scroll, (2) spacer div height = totalItems × itemHeight → scrollbar đúng, (3) tính startIndex từ scrollTop, chỉ render items visible, (4) translateY đặt items đúng vị trí (GPU compositing). Production: react-window hoặc @tanstack/virtual cho edge cases (dynamic height, horizontal scroll).

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích mechanism (spacer + translate + visible range), nhắc dynamic height challenge, biết khi nào cần virtualization vs pagination
- ❌ Weak: "Dùng react-window" — biết library nhưng không hiểu mechanism bên dưới

**🔴 Follow-up Chain:**

1. "Dynamic height items thì sao?" → Measure sau mount (ResizeObserver), cache heights, estimate cho unmeasured items. @tanstack/virtual hỗ trợ built-in.
2. "Virtualization ảnh hưởng accessibility thế nào?" → Screen readers không thấy items ngoài viewport. Cần aria-rowcount, aria-rowindex. Keyboard navigation phải scroll-to-view.
3. "Khi nào dùng virtualization vs pagination vs infinite scroll?" → Virtualization: user cần random access (scroll to any position). Pagination: SEO, shareable URLs. Infinite scroll: social feed, lazy exploration.

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| #   | Question                                  | Level | Key Point                                              |
| --- | ----------------------------------------- | ----- | ------------------------------------------------------ |
| Q1  | UI = f(state)? Declarative vs Imperative? | 🟢    | Same state → same UI. Describe WHAT, not HOW           |
| Q2  | JSX là gì?                                | 🟢    | Syntax sugar → React.createElement → JS object         |
| Q3  | Virtual DOM & Reconciliation?             | 🟡    | JS object tree, O(n) diff, 2 heuristics                |
| Q4  | Tại sao cần key?                          | 🟡    | Identity cho list items, index gây state mismatch      |
| Q5  | Render vs Commit Phase?                   | 🟡    | Render=pure+interruptible, Commit=sync+final           |
| Q6  | Fiber Architecture?                       | 🔴    | Linked list, interrupt, priority lanes, time slicing   |
| Q7  | Stale closure?                            | 🔴    | Closure capture old render, fix: updater or ref        |
| Q8  | Virtualized list design?                  | 🔴    | Render visible only, spacer+translate, measure dynamic |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer hỏi đột ngột: **"Giải thích Virtual DOM và Reconciliation trong React."**

**30 giây đầu — mở đầu lý tưởng:**

1. "Virtual DOM là cây JavaScript objects mô tả UI — lightweight representation, không phải DOM thật."
2. "Khi state thay đổi, React tạo VDOM mới, diff với cũ bằng thuật toán O(n) dựa trên 2 heuristics: khác tag thì xóa cây con, cùng tag thì diff props."
3. "Trong production, ví dụ Facebook feed, mỗi like/comment chỉ update đúng 1-2 DOM nodes thay vì re-render toàn bộ feed — nhờ reconciliation tính diff tối thiểu."
4. "Trade-off: VDOM có overhead tạo + diff objects. Svelte compile-time approach không cần VDOM nhưng React's flexibility phù hợp hơn cho large teams với unpredictable update patterns."

_Sau đó mở rộng theo hướng interviewer dẫn dắt: key mechanism, Fiber, performance optimization._

---

## Self-Check / Tự Kiểm Tra ⚡

> **Đóng tài liệu lại trước khi làm — Close the doc before attempting.**

- [ ] **Retrieval**: Viết 2 quy tắc reconciliation từ trí nhớ. So sánh với Layer 2 của mục Virtual DOM.
- [ ] **Visual**: Vẽ Fiber linked list (child/sibling/return) cho tree: App → Header + Main → Card + Card. So sánh với ASCII diagram.
- [ ] **Application**: List 1000 todo items có checkbox. Dùng `index` hay `item.id` làm key? Tại sao? Viết code.
- [ ] **Debug**: `useEffect(() => { setInterval(() => setCount(count + 1), 1000) }, [])` — tại sao count mãi = 1? Fix thế nào?
- [ ] **Teach**: Giải thích Virtual DOM cho người không biết lập trình bằng 1 câu liên tưởng.

💬 **Feynman Prompt:** Explain Virtual DOM to someone who doesn't code, using the "draft document" analogy from Layer 1. No jargon allowed.

🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày → 7 ngày → 14 ngày** để chuyển vào long-term memory.

---

## Connections / Liên Kết

- ⬅️ **Built on:** [JavaScript Closures & Functions](../02-javascript/) — React components là functions, stale closure là JS behavior
- ➡️ **Enables:** [Hooks Deep Dive](./03-hooks-deep-dive.md) — hooks cần hiểu render cycle, closure, Fiber memoizedState
- ➡️ **Enables:** [React 19 Features](./02-react-19-features.md) — Compiler, Actions, use() đều xây trên nền tảng này
- 🔗 **Applied in:** Next.js, Remix, React Native — tất cả dùng React rendering pipeline
