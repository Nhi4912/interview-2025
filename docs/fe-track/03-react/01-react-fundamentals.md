# React Fundamentals / Nền Tảng React

> **Track**: FE | **Difficulty**: 🟢 Junior → 🟡 Mid
> **Prerequisites**: [JavaScript cơ bản](../01-javascript/), [HTML/CSS & DOM](../02-html-css/)
> **See also**: [Hooks Deep Dive](./03-hooks-deep-dive.md), [React 19 Features](./02-react-19-features.md)
> **L5 Competencies**: Technical Mastery (20pts), Problem-Solving (15pts)

---

## Real-World Scenario / Tình Huống Thực Tế

You join a new company. Your senior says: "Fix the shopping cart page — when user adds a product, the count, total price, and badge must all update at once."

Bạn vào công ty mới. Senior giao: "Sửa trang giỏ hàng — khi user thêm sản phẩm, số lượng, tổng tiền, và badge phải cập nhật cùng lúc."

You open the code and see Vanilla JS (plain JavaScript, no library):

Bạn mở code, thấy Vanilla JS (JS thuần, không dùng thư viện):

```javascript
document.getElementById("cart-count").innerText = "3";
document.getElementById("product-5").classList.add("in-cart");
document.getElementById("total-price").innerText = "$150";
// ... 10 more places to update / 10 chỗ nữa cần update
```

You fix one place — forget two others → Screen shows count "3" but total still "$100". Bug.

Bạn sửa 1 chỗ — quên 2 chỗ khác → Màn hình hiện "3" nhưng tổng tiền vẫn "$100". Bug.

React was created to **eliminate this problem**: you just say "data changed", React automatically updates everything on screen correctly.

React sinh ra để **xóa bỏ vấn đề này**: bạn chỉ nói "data thay đổi rồi", React tự lo update tất cả cho đúng.

---

## What & Why / Cái Gì & Tại Sao

**What is React?** A JavaScript library for building user interfaces (UI = the part users see and interact with).

**React là gì?** Một thư viện JavaScript giúp xây dựng giao diện người dùng (UI = phần người dùng nhìn thấy và tương tác).

**Easy analogy — Excel / Ví dụ dễ hiểu — Excel:**

| Cell / Ô | Value / Giá trị           |
| -------- | ------------------------- |
| A1       | `5` (you type / bạn nhập) |
| B1       | `=A1 * 2` → shows `10`    |

You change A1 = 7 → B1 **automatically** becomes 14. You don't need to "tell" B1 to update.

Bạn đổi A1 = 7 → B1 **tự động** thành 14. Bạn không cần "bảo" B1 cập nhật.

React works exactly like this: **you change data → UI automatically updates correctly**.

React hoạt động y hệt: **bạn thay đổi dữ liệu → giao diện tự động cập nhật đúng**.

---

## Concept Map / Bản Đồ Khái Niệm

```
Where you are in the learning path / Bạn đang ở đây:

[JS Basics] → [YOU ARE HERE: React Basics] → [Hooks Deep Dive]
                                            → [React 19]
                                            → [State Management]

Contents of this file / Nội dung file này:
┌───────────────┐     ┌─────────┐     ┌─────────────────┐
│ 1. UI = f(s)  │────▶│ 2. JSX  │────▶│ 3. Component    │
└───────┬───────┘     └─────────┘     └────────┬────────┘
        │                                      │
        ▼                                      ▼
┌───────────────────────┐     ┌─────────────────────────┐
│ 4. Virtual DOM        │────▶│ 5. Render & Commit      │
│    (Shadow copy)      │     │    (2-phase update)     │
└───────────────────────┘     └────────────┬────────────┘
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │ 6. Fiber                 │
                              │    (Work splitting)      │
                              └────────────┬────────────┘
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │ 7. Stale Closure         │
                              │    (Old value trap)      │
                              └─────────────────────────┘
```

---

## Overview / Tổng Quan

React helps you build web UI in a **declarative** way — you describe "what the UI looks like when data = X", and React handles the actual screen updates.

React giúp bạn xây UI theo cách **khai báo** (declarative) — bạn chỉ mô tả "giao diện trông thế nào khi data = X", React lo việc update màn hình.

This is the foundation — if you misunderstand here, everything after will be wrong. In interviews, questions about Virtual DOM, reconciliation, and Fiber appear at EVERY level.

Đây là nền tảng — hiểu sai ở đây thì sẽ hiểu sai mọi thứ phía sau. Trong phỏng vấn, câu hỏi về Virtual DOM, reconciliation, và Fiber xuất hiện ở MỌI cấp độ.

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. UI = f(state) / The Core Formula / Công Thức Cốt Lõi

> 🧠 **Memory Hook**: "UI = result of function(data). Change data → UI changes automatically. Like Excel: change input cell → result cell auto-updates."
>
> **Móc nhớ**: "Giao diện = kết quả của hàm(dữ liệu). Đổi dữ liệu → giao diện tự đổi. Giống Excel: đổi ô input → ô kết quả tự cập nhật."

**Why does this exist? / Tại sao cần hiểu?**

Before React, to update the UI, you had to MANUALLY find each HTML element and change it. E.g.: user clicks "Add to cart" → you write code to update badge count, total price, cart button, sidebar... Forget one place = bug.

Trước React, muốn cập nhật UI, bạn phải TỰ TAY tìm từng phần tử HTML rồi sửa. Ví dụ: user click "Thêm vào giỏ" → phải sửa badge, tổng tiền, nút giỏ, sidebar... Quên 1 chỗ = bug.

→ **Why forget?** Because as apps grow complex, the number of places to update increases. Humans can't remember all of them.

→ **Tại sao quên?** Vì khi app phức tạp, số chỗ cần update rất nhiều. Con người không nhớ hết.

→ **Solution?** Instead of "manually fixing each place", just say: "Cart data is now 3 items, total $150". React calculates the correct UI automatically.

→ **Giải pháp?** Thay vì "tự tay sửa từng chỗ", chỉ cần nói: "Giỏ hàng giờ = 3 sản phẩm, tổng $150". React tự tính ra UI đúng.

#### Layer 1: Everyday Analogy / Tầng 1: Ví dụ đời thường

Imagine a large LED billboard that displays images.

Hình dung bảng LED lớn hiển thị hình ảnh.

**Old way (Vanilla JS):** You manually flip each LED bulb — flip one wrong and the image is off.

**Cách cũ (Vanilla JS):** Bạn tự tay lật từng bóng LED — sai 1 bóng là hình bị lệch.

**React way:** You send a new image to the board → board compares new vs old → only flips bulbs that need changing → correct image.

**Cách React:** Bạn gửi ảnh mới → bảng LED so sánh mới vs cũ → chỉ lật bóng cần thay đổi → hình đúng.

#### Layer 2: How It Works / Tầng 2: Cách hoạt động

```
data (state)  ──▶  function (component)  ──▶  UI
dữ liệu      ──▶  hàm (component)       ──▶  giao diện
```

```jsx
function Counter() {
  // state = data. Here it's a count, starting at 0
  // state = dữ liệu. Ở đây là số đếm, bắt đầu = 0
  const [count, setCount] = useState(0);

  // UI = result. Always shows count * 2
  // Giao diện = kết quả. Luôn hiển thị count * 2
  return <h1>{count * 2}</h1>;
}

// When setCount(7) is called / Khi setCount(7) được gọi:
// 1. React saves count = 7 / React lưu count = 7
// 2. React calls Counter() again / React gọi lại Counter()
// 3. Counter() returns <h1>14</h1>
// 4. React updates screen: "0" → "14" / React cập nhật: "0" → "14"
```

```
Flow / Luồng hoạt động:

  count = 0  ──▶  Counter()  ──▶  <h1>0</h1>    ← first render / lần đầu
       │
  setCount(7)   ← user clicks button
       │
  count = 7  ──▶  Counter()  ──▶  <h1>14</h1>   ← React re-calls function
       │
  React compares: "0" ≠ "14" → update text on screen
  React so sánh: "0" khác "14" → cập nhật chữ trên màn hình
```

3 key principles / 3 nguyên tắc quan trọng:

| Principle / Nguyên tắc                         | Meaning / Nghĩa dễ hiểu                                                                                                      | Example / Ví dụ                                                                |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Declarative / Khai báo**                     | Describe "what UI looks like", NOT "change this, add that" / Mô tả "UI trông thế nào", KHÔNG nói "sửa cái này, thêm cái kia" | `<h1>{count}</h1>` instead of `document.querySelector('h1').innerText = count` |
| **Component-based / Chia nhỏ**                 | UI = many small pieces, each is a function / UI = nhiều mảnh nhỏ, mỗi mảnh là 1 hàm                                          | `<App>` contains `<Header>`, `<Cart>`, `<Footer>`                              |
| **Unidirectional data flow / Dữ liệu 1 chiều** | Data flows from parent to child, not backward / Dữ liệu chảy từ cha xuống con, không ngược                                   | Parent passes `items` to `<Cart items={items}>`                                |

#### Layer 3: Edge Cases / Tầng 3: Trường hợp đặc biệt

- React is NOT a framework. It only handles the UI. For routing, global state management... you need additional libraries. (React KHÔNG phải framework. Nó chỉ lo phần UI. Routing, quản lý state toàn app... phải dùng thêm thư viện.)
- For simple apps (1 page, few interactions), plain JS is faster than React. React shines when the app is complex with many parts updating at once. (App đơn giản thì JS thuần nhanh hơn. React tỏa sáng khi app phức tạp, nhiều phần update cùng lúc.)
- "Same data → same UI" requires component functions to be **pure** during rendering — no API calls, no modifying outside variables, no random. ("Cùng data → cùng UI" yêu cầu hàm component phải **thuần túy** khi render — không gọi API, không đổi biến ngoài.)

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                        | Why wrong / Tại sao sai                                                                           | Correct / Đúng là                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| "React is a framework"                   | React is a UI library, no built-in routing or state management / React chỉ là thư viện UI         | React = View library. Next.js is a framework                                |
| "React is always faster than plain JS"   | React has overhead from diffing step / React có chi phí thêm từ bước so sánh                      | React is fast **enough** for complex apps. Simple apps → plain JS is faster |
| Mutating state directly: `state.count++` | React can't detect this change → UI won't update / React không phát hiện được → UI không cập nhật | Always use setter: `setCount(c => c + 1)`                                   |

**🎯 Interview Pattern / Nhận dạng câu hỏi:**

- Trigger: "How is React different from jQuery?", "What is declarative vs imperative?"
- Think of: UI = f(state)
- Opening:
  - 🇬🇧 _"React works declaratively: you describe what the UI should look like for each state, and React figures out the minimal DOM changes needed. Instead of manually manipulating DOM elements, you just update the state."_
  - 🇻🇳 _"React hoạt động theo kiểu khai báo: mình mô tả UI trông thế nào cho từng trạng thái dữ liệu, React tự tính cần thay đổi gì trên DOM. Thay vì tự tay sửa từng phần tử DOM, mình chỉ cần update state."_

**🔑 Knowledge Chain / Chuỗi kiến thức:**

- 📚 Prerequisite: [JavaScript Functions](../01-javascript/) — components are JS functions
- ➡️ Next: [Hooks](./03-hooks-deep-dive.md) — how to store and manage data inside components

---

### 2. JSX / Syntax for Writing UI in JS / Cú Pháp Viết Giao Diện Trong JS

> 🧠 **Memory Hook**: "JSX = write HTML inside JavaScript. When built, JSX becomes regular JS calls. No magic."
>
> **Móc nhớ**: "JSX = viết HTML bên trong JavaScript. Khi build, JSX thành lệnh JS thường. Không có gì ma thuật."

**Why does this exist? / Tại sao cần?**

Without JSX, you'd write UI like this / Không có JSX thì phải viết thế này:

```javascript
React.createElement("div", { className: "card" }, React.createElement("h1", null, "Hello"));
```

A few lines is OK, but complex UI becomes an unreadable mess. / Vài dòng thì OK, nhưng UI phức tạp sẽ thành mớ hỗn độn.

→ **Why unreadable?** Web UI has nested structure (div > h1 > span...), needs HTML-like syntax to visualize the tree.

→ **Tại sao khó đọc?** UI web có cấu trúc lồng nhau, cần cú pháp giống HTML để dễ hình dung cây cấu trúc.

→ **Solution?** JSX lets you write HTML-like code in JS files. Build tools (Babel, Vite) auto-convert JSX to `React.createElement()` before the browser runs it.

→ **Giải pháp?** JSX cho viết giống HTML trong file JS. Công cụ build tự chuyển JSX thành `React.createElement()` trước khi browser chạy.

#### Layer 1: Everyday Analogy / Tầng 1: Ví dụ đời thường

JSX is like **abbreviations**. Instead of writing "Ho Chi Minh City" every time, you write "HCMC". Everyone understands, and when sending official mail, the post office expands "HCMC" to the full name.

JSX giống **viết tắt**. Thay vì viết "Thành phố Hồ Chí Minh" mỗi lần, bạn viết "TP.HCM". Bưu điện tự mở rộng ra tên đầy đủ.

Similarly: you write `<h1>Hello</h1>` (short form), build tool converts to `React.createElement("h1", null, "Hello")` (full form, machine-readable).

#### Layer 2: How It Works / Tầng 2: Cách hoạt động

```jsx
// You write JSX (in .jsx or .tsx files):
// Bạn viết JSX (trong file .jsx hoặc .tsx):
const element = <h1 className="title">Hello</h1>;

// Build tool (Babel/SWC/Vite) converts to:
// Công cụ build chuyển thành:
const element = React.createElement("h1", { className: "title" }, "Hello");

// Final result = a plain JavaScript object:
// Kết quả = 1 object JS bình thường:
// { type: "h1", props: { className: "title", children: "Hello" } }
```

```
Conversion process / Quá trình chuyển đổi:

  You write (coding)          Build (auto)           Runs (in browser)
  Bạn viết (lúc code)        Build (tự động)        Chạy (trong browser)
  ─────────────────         ────────────────        ──────────────────
  <div className="app">  ──▶  React.createElement  ──▶  { type: "div",
    <h1>Hello</h1>             ("div", ...)              props: { ... } }
  </div>
```

**JSX differs from HTML / JSX khác HTML:**

| HTML (.html file) | JSX (.jsx file)     | Why / Lý do                                                       |
| ----------------- | ------------------- | ----------------------------------------------------------------- |
| `class="title"`   | `className="title"` | `class` is a reserved keyword in JS / `class` là từ khóa trong JS |
| `for="email"`     | `htmlFor="email"`   | `for` is a loop keyword in JS / `for` là từ khóa vòng lặp         |
| `onclick="..."`   | `onClick={...}`     | JSX uses camelCase / JSX dùng kiểu camelCase                      |
| `<br>`            | `<br />`            | JSX requires self-closing `/` / JSX yêu cầu tự đóng               |

**3 most important JSX rules / 3 quy tắc JSX quan trọng nhất:**

```jsx
// Rule 1: RETURN ONLY 1 ROOT ELEMENT
// Quy tắc 1: CHỈ TRẢ VỀ 1 PHẦN TỬ GỐC
// Use <> </> (Fragment — invisible wrapper) for multiple elements
return (
  <>
    <h1>Title</h1>
    <p>Content</p>
  </>
);

// Rule 2: Use {} to embed JavaScript inside HTML
// Quy tắc 2: Dùng {} để chèn JavaScript vào giữa HTML
// Inside {} only EXPRESSIONS (things that produce a value), NOT statements (if/for)
return <h1>Hello, {user.name}!</h1>;

// Rule 3: Use ternary operator instead of if/else
// Quy tắc 3: Dùng toán tử 3 ngôi thay vì if/else
return <div>{isLoggedIn ? "Welcome!" : "Please log in"}</div>;
```

#### Layer 3: Edge Cases / Tầng 3: Trường hợp đặc biệt

**The zero trap / Cái bẫy số 0:**

```jsx
const count = 0;

// ❌ WRONG — Shows "0" on screen!
// ❌ SAI — Hiển thị số "0" trên màn hình!
return <div>{count && <ProductList />}</div>;
// Why: in JS, 0 && anything = 0. JSX renders number 0 on screen.
// Lý do: trong JS, 0 && bất_kỳ = 0. JSX thấy số 0 thì hiển thị "0".

// ✅ CORRECT — Use explicit comparison
// ✅ ĐÚNG — Dùng so sánh rõ ràng
return <div>{count > 0 && <ProductList />}</div>;
```

**Security:** JSX auto-escapes special characters in strings (e.g., `<script>` becomes `&lt;script&gt;`), preventing code injection. But `dangerouslySetInnerHTML` bypasses this — very dangerous with user data.

**Bảo mật:** JSX tự động escape ký tự đặc biệt, ngăn chèn code độc. Nhưng `dangerouslySetInnerHTML` bỏ qua cơ chế này — rất nguy hiểm với dữ liệu từ user.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                  | Why wrong / Tại sao sai                                    | Correct / Đúng là             |
| ---------------------------------- | ---------------------------------------------------------- | ----------------------------- |
| `{count && <Comp />}` when count=0 | `0 && X = 0` in JS, JSX renders "0" on screen              | Use `count > 0 &&` or ternary |
| `class` instead of `className`     | `class` is a JS keyword / `class` là từ khóa JS            | Always use `className`        |
| Return multiple elements unwrapped | JSX only allows 1 root element / JSX chỉ cho 1 phần tử gốc | Wrap in `<>...</>` (Fragment) |

**🎯 Interview Pattern / Nhận dạng câu hỏi:**

- Trigger: "What is JSX?", "How is JSX different from HTML?"
- Think of: JSX = shorthand → build to `React.createElement()` → plain JS object
- Opening:
  - 🇬🇧 _"JSX is a syntax extension for JavaScript that lets you write HTML-like code in JS files. During build, it's transpiled to React.createElement() calls, which produce plain JavaScript objects describing the UI tree — not actual HTML."_
  - 🇻🇳 _"JSX là cú pháp mở rộng của JavaScript, cho phép viết giao diện giống HTML trong file JS. Khi build, JSX được chuyển thành lệnh React.createElement(), kết quả là object JavaScript mô tả cây giao diện — không phải HTML thật."_

**🔑 Knowledge Chain / Chuỗi kiến thức:**

- 📚 Prerequisite: [JS Expression vs Statement](../01-javascript/) — know what works inside `{}`
- ➡️ Next: [Component & Props](#3-component--props) — JSX creates elements, components organize them

---

### 3. Component & Props / UI Building Blocks & Parameters / Mảnh Ghép UI & Tham Số

> 🧠 **Memory Hook**: "Component = function that takes props, returns UI. Props = read-only — child CANNOT modify."
>
> **Móc nhớ**: "Component = hàm nhận props, trả về UI. Props = chỉ đọc (read-only) — con KHÔNG được sửa."

**Why does this exist? / Tại sao cần?**

Complex UI in a single file is unmaintainable. An "Add to cart" button used in 50 places can't be copy-pasted 50 times.

UI phức tạp viết trong 1 file thì không thể bảo trì. Nút "Thêm vào giỏ" dùng ở 50 chỗ, không thể copy-paste 50 lần.

→ **Why not copy-paste?** When you need to change it (e.g., change button color), you'd have to fix all 50 places. Miss one = inconsistent UI.

→ **Tại sao không copy-paste?** Khi cần sửa (đổi màu nút), phải sửa cả 50 chỗ. Quên 1 chỗ = UI không nhất quán.

→ **Solution?** Split UI into small pieces (components). Each piece is a function. Want it to look different in different places → pass parameters (props).

→ **Giải pháp?** Chia UI thành mảnh nhỏ (component). Mỗi mảnh = 1 hàm. Muốn hiển thị khác nhau → truyền tham số (props).

#### Layer 1: Everyday Analogy / Tầng 1: Ví dụ đời thường

Component = **cookie cutter** (khuôn bánh). Props = **ingredients** (nguyên liệu) you pour in.

Same cutter (component `<Button>`) but different ingredients (props `color="red"` vs `color="blue"`) → different colored buttons.

Important: you CANNOT change the cutter from inside — the cutter (props) is decided by the user (parent component).

Cùng 1 khuôn (`<Button>`) nhưng nguyên liệu khác (props `color="red"` hay `color="blue"`) → ra nút khác màu. Quan trọng: con KHÔNG THỂ sửa khuôn — props do cha quyết định.

#### Layer 2: How It Works / Tầng 2: Cách hoạt động

```jsx
// Component = a function. Takes props (parameters), returns JSX (UI)
// Component = 1 hàm. Nhận props (tham số), trả về JSX (giao diện)
function Greeting({ name, age }) {
  return (
    <h1>
      Hello {name}, {age} years old!
    </h1>
  );
}

// Parent component passes props to child component
// Component cha truyền props xuống con
function App() {
  return <Greeting name="Buu" age={25} />;
}
// → Renders: "Hello Buu, 25 years old!"
```

```
Data flow (one-way — parent to child):
Luồng dữ liệu (1 chiều — từ cha xuống con):

  App (parent / cha)
  │
  │  passes props: name="Buu", age=25
  │  truyền props: name="Buu", age=25
  │
  └──▶ Greeting (child / con)
       │
       │  receives props → calculates UI
       │  nhận props → tính giao diện
       │
       └──▶ <h1>Hello Buu, 25 years old!</h1>

  ⚠️ Greeting CANNOT modify name or age.
  ⚠️ Greeting KHÔNG THỂ sửa name hay age.
  If change needed, tell parent (via callback).
  Nếu cần thay đổi, phải báo cha (qua callback).
```

**Passing children (content between tags):**

```jsx
// children = everything between opening and closing tags
// children = mọi thứ giữa thẻ mở và thẻ đóng
function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
}

// Usage / Sử dụng:
<Card title="Product">
  <p>Product description</p> {/* ← children */}
  <button>Buy now</button> {/* ← also children */}
</Card>;
```

#### Layer 3: Edge Cases / Tầng 3: Trường hợp đặc biệt

- **Props are read-only.** If you try `props.name = "other"` inside a child → React throws error (strict mode) or causes confusing bugs. (Props là read-only. Cố sửa `props.name = "khác"` bên trong con → lỗi hoặc bug khó hiểu.)
- **Key is a special prop:** React uses it to identify list items. Key is NOT passed to the child component. (Key là prop đặc biệt: React dùng để phân biệt phần tử trong danh sách. Key KHÔNG truyền vào con.)
- **Default props / Props mặc định:**

```jsx
function Button({ color = "blue", size = "medium" }) {
  return <button className={`btn-${color} btn-${size}`}>Click</button>;
}
// <Button /> → color="blue", size="medium" (defaults)
// <Button color="red" /> → color="red", size="medium"
```

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                   | Why wrong / Tại sao sai                                                                  | Correct / Đúng là                                                 |
| ----------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Mutating props in child             | Props are read-only / Props là read-only                                                 | Use state in parent + callback if change needed                   |
| Forgetting key when rendering lists | React can't identify which items changed → wrong updates / React không biết item nào đổi | Always use unique key: `list.map(item => <Item key={item.id} />)` |
| Using index as key                  | When adding/removing/sorting, index shifts → React updates wrong elements                | Use real ID from data, not index / Dùng ID thật, không dùng index |

**🎯 Interview Pattern / Nhận dạng câu hỏi:**

- Trigger: "Props vs State?", "Why do we need key?"
- Think of: Props = data from parent (read-only), State = internal data (mutable)
- Opening:
  - 🇬🇧 _"Props are data passed from parent to child — the child can only read, not modify them. State is data managed internally by a component that can change. When state changes, React re-renders the component."_
  - 🇻🇳 _"Props là dữ liệu cha truyền xuống con — con chỉ đọc, không sửa được. State là dữ liệu component tự quản lý bên trong, có thể thay đổi. Khi state đổi, React render lại component."_

**🔑 Knowledge Chain / Chuỗi kiến thức:**

- 📚 Prerequisite: [JSX](#2-jsx--syntax-for-writing-ui-in-js--cú-pháp-viết-giao-diện-trong-js)
- ➡️ Next: [Virtual DOM](#4-virtual-dom--dom-ảo) — how React updates UI when props/state change

---

### 4. Virtual DOM / DOM Ảo

> 🧠 **Memory Hook**: "Virtual DOM = draft blueprint on paper. React compares new draft vs old draft, then only fixes the EXACT differences on the real screen."
>
> **Móc nhớ**: "Virtual DOM = bản nháp trên giấy. React so bản mới vs bản cũ, rồi chỉ sửa ĐÚNG chỗ khác trên màn hình thật."

**Why does this exist? / Tại sao cần?**

DOM (Document Object Model) is the HTML tree structure browsers use to display web pages. Directly modifying the DOM is slow because the browser must recalculate layout and repaint.

DOM là cây cấu trúc HTML mà browser dùng để hiển thị trang web. Sửa DOM trực tiếp rất chậm vì browser phải tính lại layout và paint.

→ **Why slow?** Each DOM modification triggers: (1) recalculate size + position of affected elements, (2) repaint pixels. 10 consecutive modifications = 10 recalculations.

→ **Tại sao chậm?** Mỗi lần sửa DOM: (1) tính lại kích thước + vị trí, (2) vẽ lại pixel. Sửa 10 chỗ liên tiếp = tính lại 10 lần.

→ **Solution?** React creates a copy of the UI in memory (Virtual DOM). When data changes, React creates a new Virtual DOM, compares with the old one, finds differences, then updates the real DOM in ONE BATCH.

→ **Giải pháp?** React tạo bản sao UI trong bộ nhớ (Virtual DOM). Khi data đổi, tạo Virtual DOM mới, so sánh với cũ, tìm khác biệt, rồi update DOM thật 1 LƯỢT.

#### Layer 1: Everyday Analogy / Tầng 1: Ví dụ đời thường

Imagine you're an architect renovating a house:

Hình dung bạn là kiến trúc sư sửa nhà:

**Old way (direct DOM):** Every time the client changes their mind, you run to the construction site and demolish walls immediately. Change mind 10 times = 10 demolitions.

**Cách cũ (DOM trực tiếp):** Mỗi khi khách đổi ý, chạy ra công trường đập tường ngay. Đổi ý 10 lần = đập 10 lần.

**React way (Virtual DOM):** You have 2 blueprints — old and new. Compare them, mark "fix here, keep there". Send 1 order to the crew: "Fix exactly these 3 spots". Much less work.

**Cách React (DOM ảo):** Có 2 bản vẽ — cũ và mới. So sánh, đánh dấu "sửa chỗ này, giữ chỗ kia". Gửi 1 lệnh cho thợ: "Sửa đúng 3 chỗ này thôi".

#### Layer 2: How It Works / Tầng 2: Cách hoạt động

```
Step 1: State changes (e.g., user clicks "Add product")
Bước 1: State đổi (ví dụ: user click "Thêm sản phẩm")

Step 2: React runs component → creates new Virtual DOM tree (= new blueprint)
Bước 2: React chạy component → tạo cây Virtual DOM mới (= bản vẽ mới)

Step 3: Reconciliation (comparing)
Bước 3: Reconciliation (đối chiếu)
        React compares 2 Virtual DOM trees (old vs new) top to bottom

Step 4: Find list of differences (e.g., "text changed from '2' to '3'")
Bước 4: Tìm ra danh sách khác biệt

Step 5: Update real DOM in one batch — only touch what needs changing
Bước 5: Cập nhật DOM thật 1 lần — chỉ sửa đúng chỗ cần
```

```
Concrete example / Ví dụ cụ thể:

  Old Virtual DOM:               New Virtual DOM:
  Cây cũ:                        Cây mới:
  ┌─────────────┐                ┌─────────────┐
  │ <div>       │                │ <div>       │
  │  <h1>2</h1> │  ──compare──▶  │  <h1>3</h1> │  ← different!
  │  <p>abc</p> │                │  <p>abc</p> │  ← same → skip
  └─────────────┘                └─────────────┘

  Result: React only updates textContent of <h1> from "2" to "3"
  Kết quả: React chỉ update textContent của <h1> từ "2" → "3"
           <p> is not touched / <p> không bị đụng
```

**Reconciliation algorithm has 2 key assumptions / Thuật toán đối chiếu có 2 giả định:**

1. **Different element type → destroy old, create new.** E.g.: `<div>` → `<span>` → React removes entire `<div>` tree and creates new `<span>`. (Khác loại thẻ → xóa cũ, tạo mới.)
2. **Lists need keys.** React uses `key` to identify which items were added, removed, or moved. (Danh sách cần key để React nhận biết item nào thêm/xóa/đổi chỗ.)

**Why key matters / Tại sao key quan trọng:**

```jsx
// Without key — React compares BY POSITION:
// Không có key — React so sánh theo THỨ TỰ:
// Old: [A, B, C]  →  New: [X, A, B, C]
// React thinks: A→X (change), B→A (change), C→B (change), add C
// → 4 updates 😰

// With key — React recognizes "A, B, C unchanged, just added X at start":
// Có key — React nhận ra "A, B, C giữ nguyên, chỉ thêm X ở đầu"
// → Only 1 insertion 😊 / Chỉ thêm 1 phần tử
```

```jsx
// ✅ Correct: unique ID from data / Đúng: ID duy nhất từ dữ liệu
{
  products.map((product) => <ProductCard key={product.id} product={product} />);
}

// ❌ Wrong: index — shifts when adding/removing → React gets confused
// ❌ Sai: index — khi thêm/xóa, index thay đổi → React nhầm
{
  products.map((product, index) => <ProductCard key={index} product={product} />);
}
```

#### Layer 3: Edge Cases / Tầng 3: Trường hợp đặc biệt

- **Virtual DOM is NOT always faster than direct DOM.** It has overhead from the diffing step. For simple changes (1-2 elements), direct DOM is faster. React's advantage is batching complex changes. (Virtual DOM KHÔNG phải luôn nhanh hơn DOM trực tiếp. Có overhead từ bước so sánh.)
- **Svelte doesn't use Virtual DOM.** It compiles to direct DOM operations at build time → no diffing at runtime. This is a common interview debate. (Svelte không dùng Virtual DOM. Compile thành lệnh DOM trực tiếp lúc build.)
- **Keys must be stable.** Using `Math.random()` as key → new key every render → React recreates ENTIRE list → very slow. (Key phải ổn định. `Math.random()` → key mới mỗi render → React tạo lại toàn bộ.)

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                     | Why wrong / Tại sao sai                                                                     | Correct / Đúng là                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------- |
| "Virtual DOM is a copy of real DOM"   | Virtual DOM is a lightweight JS object, not a heavy DOM node / Virtual DOM là object JS nhẹ | Virtual DOM = JS object tree describing UI   |
| "Virtual DOM is always faster"        | Has overhead from diffing. Simple apps → direct DOM is faster                               | Virtual DOM is fast **enough** for most apps |
| Using index as key for changing lists | When adding/removing, index shifts → React updates wrong elements                           | Use unique ID from data (`id`, `slug`, ...)  |

**🎯 Interview Pattern / Nhận dạng câu hỏi:**

- Trigger: "What is Virtual DOM?", "Why not modify DOM directly?", "How does reconciliation work?"
- Think of: draft → compare → minimal changes
- Opening:
  - 🇬🇧 _"Virtual DOM is a lightweight copy of the UI tree stored as JavaScript objects in memory. When state changes, React creates a new Virtual DOM tree, diffs it against the old one using the reconciliation algorithm, then applies only the minimal changes to the real DOM."_
  - 🇻🇳 _"Virtual DOM là bản sao nhẹ của cây UI, lưu dưới dạng object JS trong bộ nhớ. Khi state đổi, React tạo cây Virtual DOM mới, so sánh với cây cũ bằng thuật toán reconciliation, rồi chỉ update đúng chỗ khác biệt lên DOM thật."_

**🔑 Knowledge Chain / Chuỗi kiến thức:**

- 📚 Prerequisite: [Component & Props](#3-component--props--ui-building-blocks--parameters--mảnh-ghép-ui--tham-số)
- ➡️ Next: [Render & Commit](#5-render--commit--2-phase-update--2-giai-đoạn-vẽ-ui)

---

### 5. Render & Commit / 2-Phase Update / 2 Giai Đoạn Vẽ UI

> 🧠 **Memory Hook**: "Render = draw blueprint (fast, can be canceled). Commit = build for real (touches DOM, can't cancel). Separated so React can be flexible."
>
> **Móc nhớ**: "Render = vẽ bản thiết kế (nhanh, có thể hủy). Commit = thi công thật (chạm DOM, không hủy). Tách biệt để React linh hoạt hơn."

**Why does this exist? / Tại sao cần?**

Many people think when state changes, React "updates UI immediately". Actually React splits it into 2 separate steps. Misunderstanding this → code in wrong place → bugs.

Nhiều người nghĩ khi state đổi, React "update UI ngay". Thực tế React chia thành 2 bước. Hiểu sai → đặt code sai chỗ → bug.

→ **Why 2 steps?** The calculation step (render) can run multiple times, be canceled, or paused. The real DOM step (commit) must run once and continuously — user sees the final result.

→ **Tại sao 2 bước?** Bước tính toán (render) có thể chạy nhiều lần, hủy, tạm dừng. Bước chạm DOM (commit) phải chạy 1 lần liên tục — user thấy kết quả cuối cùng.

→ **Benefit?** React can calculate new UI WITHOUT blocking the current UI (foundation of Concurrent Rendering in React 18+).

→ **Lợi ích?** React tính UI mới MÀ KHÔNG chặn UI hiện tại (nền tảng Concurrent Rendering React 18+).

#### Layer 1: Everyday Analogy / Tầng 1: Ví dụ đời thường

Imagine ordering food on a delivery app / Hình dung đặt đồ ăn trên app:

**Render Phase (calculation)** = Kitchen cooks the food. Can cook multiple dishes in parallel, redo if wrong, even cancel. Customer sees nothing yet.

**Render Phase (tính toán)** = Nhà bếp nấu món. Nấu song song, nấu lại nếu sai, thậm chí hủy. Khách chưa thấy gì.

**Commit Phase (apply)** = Waiter brings food to the table. Once served, can't take it back — customer sees immediately.

**Commit Phase (áp dụng)** = Phục vụ bưng đồ ra bàn. Bưng ra rồi thì không rút lại — khách thấy ngay.

#### Layer 2: How It Works / Tầng 2: Cách hoạt động

```
When state changes, React runs 2 phases:
Khi state đổi, React chạy 2 giai đoạn:

┌─────────────────────────────────────────────────────┐
│  RENDER PHASE (calculation / tính toán)              │
│                                                     │
│  • React calls component function → gets new JSX    │
│  • Compares new vs old JSX (reconciliation)          │
│  • Finds list of changes to apply                    │
│                                                     │
│  ⚡ Properties:                                      │
│  • Does NOT touch real DOM / KHÔNG chạm DOM thật    │
│  • Can be canceled / restarted / có thể hủy/lặp lại│
│  • Must NOT have side effects (API calls, mutating  │
│    external vars) — may run multiple times           │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│  COMMIT PHASE (apply / áp dụng)                      │
│                                                     │
│  • Apply changes to real DOM                         │
│  • Run useLayoutEffect (sync, before paint)          │
│  • Run useEffect (async, after paint)                │
│                                                     │
│  ⚡ Properties:                                      │
│  • Runs once, CANNOT be canceled                     │
│  • Side effects go here (useEffect)                  │
│  • Browser paints pixels after commit                │
└─────────────────────────────────────────────────────┘
```

**Practical example / Ví dụ thực tế:**

```jsx
function ProductCard({ product }) {
  // 🔴 WRONG — API call during render (Render Phase)
  // 🔴 SAI — gọi API trong lúc render
  // fetch(`/api/product/${product.id}`); // React may call this multiple times!

  // ✅ CORRECT — API call in useEffect (Commit Phase)
  // ✅ ĐÚNG — gọi API trong useEffect
  useEffect(() => {
    fetch(`/api/product/${product.id}`);
  }, [product.id]);

  return <h1>{product.name}</h1>;
}
```

#### Layer 3: Edge Cases / Tầng 3: Trường hợp đặc biệt

- **Render Phase can run multiple times** for the same update. In React 18 Strict Mode (dev), React INTENTIONALLY calls components twice to detect unwanted side effects. (Render Phase có thể chạy nhiều lần. Strict Mode CỐ TÌNH gọi component 2 lần để phát hiện side effect.)
- **Commit Phase has 3 sub-steps:** (1) Modify DOM → (2) run `useLayoutEffect` (sync, before paint) → (3) browser paints → (4) run `useEffect` (async, after paint). (Commit có 3 bước con.)
- **React can skip Commit Phase** if Render Phase determines nothing changed. (React có thể bỏ qua Commit nếu Render tính ra không có gì đổi.)

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                      | Why wrong / Tại sao sai                                                    | Correct / Đúng là                                                      |
| ------------------------------------------------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| API call inside component function (outside useEffect) | Render Phase may run multiple times → multiple API calls                   | Put API calls in useEffect or event handlers                           |
| Thinking "render = paint on screen"                    | Render is only calculation, doesn't touch screen / Render chỉ là tính toán | Render = calculate. Commit = apply to DOM. Browser paint = draw pixels |
| Modifying external variables in component              | Component may run multiple times → variable modified multiple times        | Use useRef for persistent values, useEffect for side effects           |

**🎯 Interview Pattern / Nhận dạng câu hỏi:**

- Trigger: "Why does React render twice?", "When does useEffect run?", "Where to put side effects?"
- Think of: 2 phases — Render (calculate, may repeat) vs Commit (apply, once)
- Opening:
  - 🇬🇧 _"React splits updates into two phases. The Render Phase calls component functions to calculate the new UI — this is pure and can be interrupted or repeated. The Commit Phase applies changes to the real DOM — this runs once and can't be canceled. Side effects like API calls must go in useEffect during the Commit Phase."_
  - 🇻🇳 _"React chia update thành 2 giai đoạn. Render Phase gọi hàm component để tính UI mới — thuần túy, có thể lặp/hủy. Commit Phase áp dụng thay đổi lên DOM thật — chạy 1 lần, không hủy được. Side effect như gọi API phải đặt trong useEffect ở Commit Phase."_

**🔑 Knowledge Chain / Chuỗi kiến thức:**

- 📚 Prerequisite: [Virtual DOM](#4-virtual-dom--dom-ảo)
- ➡️ Next: [Fiber Architecture](#6-fiber--work-splitting--cách-react-chia-nhỏ-công-việc)

---

### 6. Fiber / Work Splitting / Cách React Chia Nhỏ Công Việc

> 🧠 **Memory Hook**: "Fiber = how React splits render work into small chunks, so the browser doesn't freeze. Like splitting homework into parts — do one part, rest, continue."
>
> **Móc nhớ**: "Fiber = cách React chia việc render thành mẩu nhỏ, để browser không bị đơ. Giống chia bài tập thành phần — làm 1 phần, nghỉ, làm tiếp."

**Why does this exist? / Tại sao cần?**

Before React 16, when the component tree was large, React rendered the ENTIRE tree continuously. During that time, the browser couldn't handle anything else (animation, clicks, typing...) → UI freezes.

Trước React 16, khi cây component lớn, React render TOÀN BỘ liên tục. Trong thời gian đó, browser không xử lý được gì khác (animation, click, gõ chữ...) → UI đứng hình.

→ **Why freeze?** JavaScript is single-threaded: one thing at a time. If React takes all the time → browser has no chance to repaint.

→ **Tại sao đứng?** JS chạy đơn luồng: 1 thời điểm chỉ 1 việc. React chiếm hết → browser không có cơ hội vẽ lại.

→ **Solution?** Fiber lets React split Render Phase into small chunks. Process one chunk → yield to browser → browser handles animation/click → React continues next chunk.

→ **Giải pháp?** Fiber cho React chia Render Phase thành mẩu nhỏ. Làm 1 mẩu → nhường browser → browser xử lý animation/click → React tiếp mẩu tiếp.

#### Layer 1: Everyday Analogy / Tầng 1: Ví dụ đời thường

Imagine you're a hotel receptionist (browser). One guest has a very complex booking (large component tree).

Hình dung bạn là lễ tân khách sạn (browser). Có 1 khách đặt phòng rất phức tạp (cây component lớn).

**Old way (before Fiber):** You process the complex booking from start to finish without looking up. Other guests wait. Phone rings — you can't hear.

**Cách cũ (trước Fiber):** Xử lý đơn phức tạp từ đầu đến cuối, không ngẩng lên. Khách khác đợi. Điện thoại reng — không nghe.

**Fiber way:** You split the booking into steps. After each step, look around: "Does anyone need anything?". If a VIP guest arrives (high-priority action) → handle VIP first → return to booking.

**Cách Fiber:** Chia đơn thành nhiều bước. Sau mỗi bước, nhìn quanh: "Ai cần gì không?". Khách VIP đến (ưu tiên cao) → xử lý VIP trước → quay lại đơn.

#### Layer 2: How It Works / Tầng 2: Cách hoạt động

Each component in the React tree has a **Fiber node** — an object containing info about that component.

Mỗi component trong cây React có 1 **Fiber node** — object chứa thông tin về component đó.

```
Component tree you write:        Fiber tree React creates:
Cây component bạn viết:          Cây Fiber React tạo:

     <App>                        Fiber(App)
     ├─ <Header>                  ├─ Fiber(Header)
     │   └─ <Logo>                │   └─ Fiber(Logo)
     └─ <Main>                    └─ Fiber(Main)
         ├─ <Sidebar>                 ├─ Fiber(Sidebar)
         └─ <Content>                 └─ Fiber(Content)
```

**Each Fiber node contains / Mỗi Fiber node chứa:**

| Info / Thông tin | Explanation / Giải thích                                           |
| ---------------- | ------------------------------------------------------------------ |
| `type`           | Component type (which function, which HTML tag) / Loại component   |
| `props`          | Parameters passed in / Tham số truyền vào                          |
| `state`          | Internal data (hooks stored here) / Dữ liệu nội bộ (hooks ở đây)   |
| `child`          | First child / Con đầu tiên                                         |
| `sibling`        | Next sibling / Anh em cùng cấp kế tiếp                             |
| `return`         | Parent (to go back after processing) / Cha (quay lại sau khi xong) |

**How React traverses the Fiber tree / Cách React duyệt cây Fiber:**

```
Traversal order / Thứ tự duyệt:
1. Go down to first child
2. If no child → go to next sibling
3. If no sibling → go back to parent (return)

        App
        │
        ▼
      Header ──▶ Main
        │          │
        ▼          ▼
       Logo    Sidebar ──▶ Content

Processing order: App → Header → Logo → Main → Sidebar → Content
Thứ tự xử lý:   App → Header → Logo → Main → Sidebar → Content

⚡ After each node, React checks:
   "Does the browser need to do anything?"
   • If yes (e.g., user typing) → pause, yield to browser
   • If no → continue to next node

⚡ Sau mỗi node, React kiểm tra:
   "Browser có cần xử lý gì không?"
   • Nếu có (ví dụ: user đang gõ) → tạm dừng, nhường browser
   • Nếu không → tiếp node kế tiếp
```

#### Layer 3: Edge Cases / Tầng 3: Trường hợp đặc biệt

- **Fiber enables prioritization.** E.g.: user types in search box (high priority) while React is rendering a long list (low priority) → React pauses the list, handles the search input first, then resumes. (Fiber cho phép ưu tiên.)
- **Double buffering:** React keeps 2 Fiber trees — current (displayed) and workInProgress (being built). When done, swap. Like game rendering technique: draw new frame in background, swap to foreground when done → no flickering. (Double buffer: giữ 2 cây Fiber, hoán đổi khi xong → không nhấp nháy.)
- **Fiber is the foundation for React 18 Concurrent Features:** `useTransition`, `useDeferredValue`, Suspense — all work because Fiber can pause and resume. (Fiber là nền tảng cho React 18 Concurrent Features.)

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                  | Why wrong / Tại sao sai                                                                                      | Correct / Đúng là                                                       |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| "Fiber = Virtual DOM"                              | Fiber is the PROCESSING MECHANISM. Virtual DOM is the DATA STRUCTURE / Fiber = cơ chế. Virtual DOM = dữ liệu | Fiber = scheduler + work splitter. Virtual DOM = render result          |
| "React renders multiple components simultaneously" | JS is still single-threaded. Fiber only splits, doesn't parallel / JS vẫn đơn luồng                          | Fiber = cooperative scheduling (yield), not parallel                    |
| "Devs need to know Fiber to code React"            | Fiber is internal detail, 99% devs don't need to care                                                        | Know Fiber to understand WHY React works this way, not for daily coding |

**🎯 Interview Pattern / Nhận dạng câu hỏi:**

- Trigger: "What is Fiber?", "How does Concurrent Mode work?", "How does React handle large trees?"
- Think of: split work + yield to browser + prioritize
- Opening:
  - 🇬🇧 _"Fiber is React's internal architecture since v16 that splits the Render Phase into small units of work. Each component has a Fiber node forming a linked list. React can pause mid-render to let the browser handle user input and animations, then resume — this is the foundation for Concurrent Features in React 18."_
  - 🇻🇳 _"Fiber là kiến trúc nội bộ từ React 16, cho phép chia Render Phase thành đơn vị nhỏ. Mỗi component có 1 Fiber node tạo thành linked list. React có thể dừng giữa chừng để nhường browser xử lý input và animation, rồi tiếp tục — đây là nền tảng cho Concurrent Features React 18."_

**🔑 Knowledge Chain / Chuỗi kiến thức:**

- 📚 Prerequisite: [Render & Commit](#5-render--commit--2-phase-update--2-giai-đoạn-vẽ-ui)
- ➡️ Next: [Hooks Comprehensive](./07-hooks-comprehensive.md) — `useTransition`, `useDeferredValue` use Fiber scheduling

---

### 7. Stale Closure / Old Value Trap / Bẫy Biến Cũ

> 🧠 **Memory Hook**: "A function created at render N 'sees' data from render N. If you use an old function → see old data. That's stale closure."
>
> **Móc nhớ**: "Hàm tạo ở render N thì 'nhìn thấy' dữ liệu render N. Dùng hàm cũ → thấy data cũ. Đó là stale closure."

**Why does this exist? / Tại sao cần?**

This is the **most common bug** in React, especially with `useEffect` and event handlers. You'll see: "I called setCount(5) but console.log still shows 0!" Without understanding stale closures, you'll waste hours debugging.

Đây là **bug phổ biến nhất** trong React, đặc biệt với `useEffect` và event handler. Triệu chứng: "Đã setCount(5) rồi mà console.log vẫn in 0!" Không hiểu stale closure thì mất hàng giờ debug.

→ **Why does it happen?** In JavaScript, when you create a function inside another function, the inner function "captures a snapshot" of all surrounding variables at creation time. This is closure. In React, each render creates a new "snapshot" — but if you use a function from an old render, it still holds the old "snapshot".

→ **Tại sao xảy ra?** Trong JS, hàm bên trong "chụp ảnh" biến xung quanh lúc tạo. Đây là closure. Trong React, mỗi render tạo "bức ảnh" mới — nhưng hàm từ render cũ vẫn giữ "bức ảnh" cũ.

→ **Solution?** 3 ways: (1) Add variable to deps array, (2) Use functional updater `setCount(c => c + 1)`, (3) Use `useRef` for latest value.

→ **Giải pháp?** 3 cách: (1) Thêm biến vào deps, (2) Dùng functional updater `setCount(c => c + 1)`, (3) Dùng `useRef`.

#### Layer 1: Everyday Analogy / Tầng 1: Ví dụ đời thường

Imagine you take a photo of your room every Monday. / Hình dung bạn chụp ảnh phòng mỗi Thứ Hai.

Monday week 1: room has 2 chairs. / Thứ Hai tuần 1: phòng có 2 ghế.
Tuesday you buy 1 more → room actually has 3 chairs. / Thứ Ba mua thêm 1 → phòng thật có 3 ghế.
But Monday's photo still shows 2 chairs — because the photo is a "snapshot" from the past. / Nhưng ảnh Thứ Hai vẫn hiện 2 ghế — vì ảnh là "bản chụp" tại thời điểm cũ.

Stale closure is the same: function created at render 1 → "captures" state at that time. Even though state updated at render 5, the old function still sees render 1's value.

Stale closure y hệt: hàm tạo ở render 1 → "chụp" state lúc đó. Dù state đã update ở render 5, hàm cũ vẫn thấy giá trị render 1.

#### Layer 2: How It Works / Tầng 2: Cách hoạt động

```jsx
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // This function is created when count = 0 (first render)
    // Hàm này được tạo khi count = 0 (render đầu)
    // It "captures" count = 0 into its closure
    // Nó "chụp" count = 0 vào closure
    const id = setInterval(() => {
      console.log(count); // Always prints 0! Even though count changed
      setCount(count + 1); // Always sets 0 + 1 = 1!
    }, 1000);
    return () => clearInterval(id);
  }, []); // [] = only run once on mount → never recreates the function

  return <h1>{count}</h1>;
  // Screen shows: 1, 1, 1, 1, 1... (doesn't increment!)
  // Màn hình: 1, 1, 1, 1, 1... (không tăng!)
}
```

```
The problem / Vấn đề:

  Render 1: count=0 → creates setInterval → function "captures" count=0
  Render 2: count=1 → but setInterval function is still the old one → still sees count=0
  Render 3: count=1 → still count=0 in old function...

  ┌───────────────┐     ┌───────────────┐
  │  Render 1     │     │  Render 2     │
  │  count = 0    │     │  count = 1    │
  │               │     │               │
  │  setInterval  │     │  (old function │
  │  sees: 0      │←────│   still used) │
  └───────────────┘     └───────────────┘
```

**3 ways to fix / 3 cách sửa:**

```jsx
// Fix 1: Functional updater — doesn't need to read count
// Cách 1: Functional updater — không cần đọc count
useEffect(() => {
  const id = setInterval(() => {
    setCount((prev) => prev + 1); // prev = current value, not from closure
  }, 1000);
  return () => clearInterval(id);
}, []);

// Fix 2: Add count to deps → recreate function when count changes
// Cách 2: Thêm count vào deps → tạo lại hàm mỗi khi count đổi
useEffect(() => {
  const id = setInterval(() => {
    console.log(count); // Correct now!
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(id);
}, [count]); // ← each count change: clear old interval, create new

// Fix 3: useRef for latest value
// Cách 3: Dùng useRef lưu giá trị mới nhất
const countRef = useRef(count);
countRef.current = count; // Update every render / Cập nhật mỗi render

useEffect(() => {
  const id = setInterval(() => {
    console.log(countRef.current); // Always reads latest value
  }, 1000);
  return () => clearInterval(id);
}, []);
```

#### Layer 3: Edge Cases / Tầng 3: Trường hợp đặc biệt

- **Event handlers also get stale closures** if you pass a function to useCallback with missing deps. E.g.: `useCallback(() => console.log(count), [])` → always prints initial count. (Event handler cũng bị stale closure nếu useCallback deps thiếu.)
- **React Compiler (React 19)** can detect some stale closure cases and warn. But it can't fix all — you still need to understand this. (React Compiler phát hiện 1 số trường hợp, nhưng không fix hết.)
- **setTimeout is also affected:** `setTimeout(() => alert(count), 3000)` → alerts count value at setTimeout creation time, not when alert shows. (setTimeout cũng bị.)

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                 | Why wrong / Tại sao sai                               | Correct / Đúng là                               |
| ------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------- |
| Using `[]` deps but reading state in effect       | Function created once → "captures" initial state only | Add state to deps, or use functional updater    |
| Thinking `setCount(count + 1)` reads latest value | `count` is a closure value, may be stale              | Use `setCount(prev => prev + 1)`                |
| Ignoring ESLint "missing dependency" warning      | ESLint is warning you're ABOUT to have stale closure  | Fix the dependency or use useRef if intentional |

**🎯 Interview Pattern / Nhận dạng câu hỏi:**

- Trigger: "What is stale closure?", "Why does useEffect read old state?", "How does setInterval work in React?"
- Think of: function "captures snapshot" of state at creation time
- Opening:
  - 🇬🇧 _"Stale closure happens when a function created during a previous render is still being used, so it 'sees' old state values instead of current ones. The root cause is JavaScript closures — functions capture references to surrounding variables at creation time. Fix: use functional updater for setState, or add correct dependencies to the useEffect deps array."_
  - 🇻🇳 _"Stale closure xảy ra khi hàm tạo ở render trước vẫn được dùng, nên nó 'thấy' state cũ thay vì mới. Nguyên nhân gốc là closure trong JS — hàm giữ tham chiếu biến xung quanh lúc tạo. Fix: dùng functional updater cho setState, hoặc thêm dependency đúng vào deps array."_

**🔑 Knowledge Chain / Chuỗi kiến thức:**

- 📚 Prerequisite: [JavaScript Closures](../01-javascript/04-closures.md) — understand closure mechanism in JS
- ➡️ Next: [Hooks Deep Dive](./03-hooks-deep-dive.md) — deps array, cleanup, and related hooks

---

## Q&A Section — Interview Questions / Câu Hỏi Phỏng Vấn

### 🟢 Q1: "How does React work? Explain UI = f(state)." / "React hoạt động theo kiểu nào? Giải thích UI = f(state)."

**💡 Interview Signal:** Foundational question — tests if candidate understands the core.

**Answer / Trả lời:**

🇬🇧 React works **declaratively**: you describe what the UI should look like for each state, and React handles the DOM updates.

`UI = f(state)` means: the UI is the output of a function given data as input. Same data → always same UI.

**Old way (jQuery, Vanilla JS):** You manually write code to "add class here, change text there" — this is **imperative**. Easy to forget updating one place → inconsistent UI.

**React way:** Just `setCount(5)` → React re-calls the component → calculates new UI → diffs with old → updates only what changed. Developer doesn't care "what to update" — only describes "what it should look like".

🇻🇳 React hoạt động **khai báo**: mô tả UI trông thế nào cho từng state, React lo update DOM.

`UI = f(state)` nghĩa là: UI là kết quả của hàm nhận dữ liệu. Cùng dữ liệu → luôn cùng UI.

Cách cũ (jQuery): tự tay viết "thêm class ở đây, đổi text ở kia" — **mệnh lệnh**. Dễ quên 1 chỗ → UI không nhất quán.

Cách React: `setCount(5)` → React gọi lại component → tính UI mới → so sánh với cũ → update đúng chỗ cần.

---

### 🟢 Q2: "What is JSX? What does it become at runtime?" / "JSX là gì? Khi chạy nó biến thành gì?"

**💡 Interview Signal:** Tests if candidate understands JSX or just "uses it without knowing".

**Answer / Trả lời:**

🇬🇧 JSX is a syntax extension for JavaScript that lets you write HTML-like code in JS files.

JSX is **not** HTML — browsers don't understand it. During build, tools (Babel, SWC, Vite) transpile JSX to `React.createElement()`:

```jsx
<h1 className="title">Hello</h1>
// becomes:
React.createElement("h1", { className: "title" }, "Hello")
// result = a plain JS object:
{ type: "h1", props: { className: "title", children: "Hello" } }
```

This object is a **React Element** — it describes the UI but isn't real DOM. React uses it to build the Virtual DOM and diff.

Note: JSX differs from HTML: `className` not `class`, `htmlFor` not `for`, camelCase events, self-closing tags need `/`.

🇻🇳 JSX là cú pháp mở rộng cho JS, viết giao diện giống HTML trong file JS. Trình duyệt không hiểu JSX. Khi build, công cụ chuyển JSX thành `React.createElement()`, kết quả là object JS mô tả UI — không phải HTML thật. Object này gọi là React Element, React dùng nó để xây Virtual DOM.

---

### 🟡 Q3: "How is Virtual DOM different from Real DOM? How does reconciliation work?" / "Virtual DOM khác Real DOM thế nào? Reconciliation hoạt động ra sao?"

**💡 Interview Signal:** Classic question. Interviewer wants clear explanation, not vague "Virtual DOM is faster".

**Answer / Trả lời:**

🇬🇧 **Real DOM** = HTML tree managed by the browser. Each modification triggers layout recalculation and repaint → expensive.

**Virtual DOM** = lightweight copy of the UI tree, stored as JS objects in memory. Operating on JS objects is much cheaper than real DOM.

**Reconciliation** is the algorithm React uses to diff two Virtual DOM trees (old vs new) and find the minimal set of changes:

1. Compare root nodes. Different types (`<div>` → `<span>`) → destroy old tree, create new.
2. Same type → keep node, only update changed attributes.
3. For lists → use `key` to identify which items were added, removed, or moved.

Finally, React batches all changes and updates the real DOM once → fewer browser reflows.

**Important note:** Virtual DOM isn't "always faster" — it has overhead from diffing. For simple changes, direct DOM is faster (that's why Svelte doesn't use Virtual DOM). React's advantage is batching complex updates.

🇻🇳 **Real DOM** = cây HTML do browser quản lý. Mỗi lần sửa → tính lại layout + vẽ lại → tốn. **Virtual DOM** = bản sao nhẹ dạng object JS trong bộ nhớ. **Reconciliation** so 2 cây Virtual DOM, tìm khác biệt tối thiểu: (1) khác loại thẻ → xóa cũ tạo mới, (2) cùng loại → giữ node sửa thuộc tính, (3) danh sách dùng key. React gom thay đổi, update DOM thật 1 lần.

---

### 🟡 Q4: "Why do we need key when rendering lists? Can we use index?" / "Tại sao cần key khi render danh sách? Dùng index được không?"

**💡 Interview Signal:** Tests practical understanding. "Index is bad" isn't enough — need to explain WHY.

**Answer / Trả lời:**

🇬🇧 Key helps React identify each list item when changes happen (add, remove, reorder).

**Without key (or with index):** React compares by position. Adding an item at the start shifts all positions → React thinks EVERYTHING changed → updates all items.

**With key (unique ID):** React recognizes "A, B, C are unchanged, just X was added at start" → only creates 1 new element.

**Can we use index?** Yes, but ONLY when the list never changes order, never adds/removes from the middle. If violated → bug:

```jsx
// List: [{id:1, name:"A"}, {id:2, name:"B"}]
// User deletes first item
// With key=index: item key=0 is now B, React thinks key=0 just changed name A→B
// → If there's an input in the item → keeps old input value → BUG!
```

Use unique ID from data (`id`, `slug`, `uuid`). If no ID exists, generate it when loading data — DON'T generate during render (`Math.random()` → new key every render → React recreates entire list).

🇻🇳 Key giúp React nhận biết từng item khi có thay đổi. Không có key → so sánh theo vị trí → thêm ở đầu thì React nghĩ tất cả đổi. Có key → nhận ra item nào giữ, nào thêm. Dùng index chỉ OK khi danh sách không bao giờ đổi thứ tự. Nên dùng ID duy nhất từ data.

---

### 🟡 Q5: "What's the difference between Render Phase and Commit Phase?" / "Render Phase và Commit Phase khác nhau thế nào?"

**💡 Interview Signal:** Separates deep understanding from surface-level knowledge.

**Answer / Trả lời:**

🇬🇧 When state changes, React runs 2 phases:

**Render Phase (calculation):**

- Calls component function → gets new JSX
- Diffs new vs old (reconciliation)
- **Does NOT touch real DOM.** Only calculates "what needs to change".
- Can be interrupted or restarted (React 18 concurrent mode)
- → Component function must be pure: no API calls, no external mutations, no Date.now()

**Commit Phase (apply):**

- Applies changes to real DOM
- Runs `useLayoutEffect` (sync, before browser paint)
- Browser paints pixels
- Runs `useEffect` (async, after browser paint)
- **Cannot be interrupted.** Runs once.

**Practical meaning:** Side effects (API calls, localStorage, event subscriptions...) must go in `useEffect` (Commit Phase), NOT directly in the component function (Render Phase) — because the component function may run multiple times.

🇻🇳 **Render Phase**: gọi component → tính JSX mới → so sánh → KHÔNG chạm DOM, có thể lặp/hủy, phải thuần túy. **Commit Phase**: áp dụng lên DOM thật → chạy useLayoutEffect → browser vẽ → chạy useEffect. Không bị hủy, chạy 1 lần. Side effect đặt trong useEffect (Commit Phase).

---

### 🔴 Q6: "Explain Fiber Architecture. What problem does it solve compared to the old Stack Reconciler?" / "Giải thích Fiber Architecture. Nó giải quyết vấn đề gì so với Stack Reconciler cũ?"

**💡 Interview Signal:** Senior question — tests understanding of React internals, not just API surface.

**Answer / Trả lời:**

🇬🇧 **Old problem (Stack Reconciler — pre React 16):** When the component tree changed, React traversed the entire tree CONTINUOUSLY using recursion. The call stack was blocked until done. During that time, the browser couldn't process animation, input, or any interaction → UI jank/freeze.

**Solution — Fiber Architecture:**

Fiber converts rendering from recursion (can't stop mid-way) into a while loop over a linked list (can stop anytime).

Each component has a Fiber node — an object with `type`, `props`, `state`, and pointers: `child` / `sibling` / `return`. React traverses via a while loop, processing one Fiber node per iteration.

**3 new capabilities from Fiber:**

1. **Pause and resume** — render partially → yield to browser → continue
2. **Prioritize** — user input (high priority) can interrupt rendering a long list (low priority)
3. **Abort** — if a higher-priority update arrives → discard old render result, start fresh

**Double buffering:** React maintains 2 Fiber trees — `current` (displayed) and `workInProgress` (being built). When done, swap. Like game double-buffering — render new frame in background, swap when ready → no flicker.

🇻🇳 **Vấn đề cũ**: Stack Reconciler duyệt cây bằng đệ quy liên tục → browser đứng hình. **Fiber**: biến render thành while loop trên linked list → có thể dừng bất kỳ lúc nào. Mỗi component = 1 Fiber node. 3 khả năng mới: tạm dừng/tiếp tục, ưu tiên, hủy bỏ. Double buffering: giữ 2 cây (current + workInProgress), hoán đổi khi xong.

🔗 **Follow-up Chain:**

1. → "How does React 18 use Fiber for `useTransition` and `useDeferredValue`?"
2. → "Explain `requestIdleCallback` and why React implements its own scheduler instead of using browser API?"
3. → "If Fiber render is paused mid-way, how does React ensure UI consistency (tearing)?"

---

### 🔴 Q7: "What is stale closure in React? Give an example and fix." / "Stale closure trong React là gì? Cho ví dụ và cách fix."

**💡 Interview Signal:** Practical debugging question. Tests JS closure knowledge + React rendering model.

**Answer / Trả lời:**

🇬🇧 Stale closure happens when a function (callback, effect handler) created during a previous render is still being used → it "sees" old state/props values instead of current ones.

**Most common example — setInterval:**

```jsx
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // count is always 0 (closure from first render)
    }, 1000);
    return () => clearInterval(id);
  }, []); // [] → function created once → "captures" count=0
}
```

**Root cause:** Each render creates a new `count` variable. But the function inside `setInterval` was created at render 1 → holds a reference to render 1's `count` (= 0), never updates.

**3 fixes:**

1. **Functional updater** — doesn't need to read current state: `setCount(prev => prev + 1)` — React passes the latest value as `prev`.
2. **Add to dependency array** — effect recreates when state changes: `useEffect(() => { ... }, [count])` — but with setInterval this means clear/create repeatedly.
3. **useRef** — store latest value outside closure: `countRef.current = count;` every render, read `countRef.current` in effect.

🇻🇳 Stale closure xảy ra khi hàm tạo ở render trước vẫn được dùng → thấy state cũ. Nguyên nhân: closure JS giữ tham chiếu biến lúc tạo. Ví dụ phổ biến: setInterval với `[]` deps → hàm chỉ tạo 1 lần → "chụp" count=0 mãi mãi. 3 cách fix: (1) functional updater `prev => prev + 1`, (2) thêm vào deps, (3) useRef lưu giá trị mới nhất.

🔗 **Follow-up Chain:**

1. → "If you have 10 state values to read in setInterval, what's the most efficient approach?"
2. → "Can React Compiler in React 19 fix stale closures? Why or why not?"
3. → "Design a custom hook `useLatest(value)` that returns a ref always containing the latest value."

---

### 🔴 Q8: "Design a page listing 10,000 products. Explain from Virtual DOM, key, render/commit, and optimizations." / "Thiết kế trang danh sách 10,000 sản phẩm. Giải thích từ Virtual DOM, key, render/commit, và tối ưu."

**💡 Interview Signal:** Design question — tests ability to apply all fundamental knowledge to a real problem.

**Answer / Trả lời:**

🇬🇧 **Problem:** 10,000 DOM nodes → slow page. Render Phase is slow creating 10,000 Virtual DOM nodes. Commit Phase is slow because browser must layout + paint many elements.

**Step 1: Virtualization (only render visible items)**
Only render ~20-30 items visible on screen, not all 10,000. When scrolling → swap item content, don't create new DOM. Use `react-window` or `@tanstack/virtual`.
→ Virtual DOM tree drops from 10,000 to ~30 nodes → Render Phase ~300x faster.

**Step 2: Key strategy**
Use `product.id` as key (not index). When scrolling, position 1 may change from product #1 to product #50 — if using index, React thinks item hasn't changed → wrong display.

**Step 3: Optimize Render Phase**

- `React.memo()` on `<ProductCard>` — if props unchanged, skip re-render.
- If search box filters the list → `useTransition` to prioritize displaying typed characters (urgent) before filtering 10,000 items (non-urgent).

**Step 4: Optimize Commit Phase**

- `useDeferredValue` on search query → React commits old UI first, then updates filtered list later.
- Reduce layout/paint: avoid CSS properties that trigger layout recalculation (`width`, `height`...).

**Step 5: Loading**

- `Suspense` + lazy loading: split `<ProductCard>` into a separate chunk → load when needed.
- Infinite scroll instead of loading all: fetch first 50 items, near bottom → fetch more.

🇻🇳 **Vấn đề**: 10,000 node DOM → chậm. **Bước 1**: Virtualization — chỉ render ~30 item hiện trên màn hình (react-window). **Bước 2**: Key dùng product.id, không dùng index. **Bước 3**: React.memo cho ProductCard, useTransition cho search. **Bước 4**: useDeferredValue cho search query. **Bước 5**: Suspense + lazy loading + infinite scroll.

🔗 **Follow-up Chain:**

1. → "How does virtualization affect accessibility (screen readers)?"
2. → "If each ProductCard has a heavy image, how do you optimize image loading?"
3. → "Compare virtualization vs pagination. When to use which?"

---

## Q&A Summary Table / Bảng Tổng Hợp Q&A

| #   | Question / Câu hỏi           | Level | Key concepts                                         |
| --- | ---------------------------- | ----- | ---------------------------------------------------- |
| Q1  | UI = f(state)                | 🟢    | Declarative, pure function, same input → same output |
| Q2  | What is JSX                  | 🟢    | Compile, createElement, JS object                    |
| Q3  | Virtual DOM & Reconciliation | 🟡    | Shadow copy, diff, minimal updates                   |
| Q4  | Key in lists                 | 🟡    | Identify elements, unique ID, not index              |
| Q5  | Render vs Commit Phase       | 🟡    | Calculate vs apply, side effects, purity             |
| Q6  | Fiber Architecture           | 🔴    | Split work, pause, prioritize, double buffer         |
| Q7  | Stale Closure                | 🔴    | JS closure, functional updater, useRef               |
| Q8  | Design large list            | 🔴    | Virtualization, memo, useTransition, key strategy    |

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

**Question: "What problem does Fiber Architecture solve?"**

30-second answer:

🇬🇧

1. Before React 16, rendering traversed the entire component tree continuously with recursion — couldn't stop mid-way → UI freeze for large trees.
2. Fiber converts rendering into a while loop over a linked list — each component = one Fiber node — React can stop after each node.
3. Example: user typing in a search box while React renders a 1,000-item list → Fiber lets React pause the list, handle the input first, then resume.
4. Tradeoff: added internal complexity (double buffer, scheduler), and developers need to understand that components may be called multiple times per update.

🇻🇳

1. Trước React 16, render duyệt toàn bộ cây bằng đệ quy — không dừng được → UI đứng hình với cây lớn.
2. Fiber biến render thành while loop trên linked list — mỗi component = 1 Fiber node — có thể dừng sau mỗi node.
3. Ví dụ: user gõ tìm kiếm trong khi React render danh sách 1,000 item → Fiber tạm dừng danh sách, xử lý input trước, rồi tiếp.
4. Đánh đổi: thêm phức tạp nội bộ (double buffer, scheduler), và component có thể bị gọi nhiều lần trong 1 update.

---

## Self-Check / Tự Kiểm Tra

**Close this document and write from memory: / Đóng tài liệu này lại và viết từ trí nhớ:**

### Retrieval / Truy hồi

- [ ] Write 3 core React principles (declarative, component-based, unidirectional) and explain each in 1 sentence / Viết 3 nguyên tắc React, giải thích mỗi cái bằng 1 câu
- [ ] Draw the flow: state change → render → virtual DOM → diff → commit → real DOM → browser paint / Vẽ sơ đồ luồng

### Visual / Hình dung

- [ ] Draw 2 Virtual DOM trees (old and new), mark differences, list changes React needs to make / Vẽ 2 cây Virtual DOM, đánh dấu khác biệt
- [ ] Draw a Fiber tree with 4-5 nodes, mark traversal direction (child → sibling → return) / Vẽ cây Fiber, đánh dấu chiều duyệt

### Application / Ứng dụng

- [ ] Write a simple Counter component, identify state, JSX, and data flow / Viết component Counter, chỉ ra state, JSX, luồng data
- [ ] Write a 5-item product list with correct keys, explain why those keys are good / Viết danh sách 5 sản phẩm với key đúng

### Debug

- [ ] Write a stale closure example with setInterval, explain the bug, fix with functional updater / Viết ví dụ stale closure, giải thích, sửa
- [ ] Find the bug: `{count && <ProductList />}` when count = 0. Explain and fix. / Tìm bug, giải thích, sửa

### Teach / Dạy lại

- [ ] Explain Virtual DOM to someone who doesn't know React, WITHOUT technical jargon / Giải thích Virtual DOM cho người chưa biết React, KHÔNG dùng thuật ngữ kỹ thuật

**Feynman Prompt:** Explain how React updates the UI to a friend who uses jQuery. Use a concrete example, don't use "reconciliation" or "fiber". / Giải thích cách React update UI cho bạn đang dùng jQuery. Dùng ví dụ cụ thể, không dùng từ "reconciliation" hay "fiber".

🔁 **Spaced Repetition:** Review this file after 3 days → 7 days → 14 days. / Ôn lại sau 3 → 7 → 14 ngày.

---

## Connections / Liên Kết

- ➡️ **Next**: [React 19 Features](./02-react-19-features.md) — React Compiler, Actions, use()
- ➡️ **Next**: [Hooks Deep Dive](./03-hooks-deep-dive.md) — useState, useEffect, useRef in detail
- 🔗 **Related**: [JavaScript Closures](../01-javascript/04-closures.md) — foundation for understanding stale closure
- 🔗 **Related**: [Performance Optimization](./09-performance-optimization.md) — applying render/commit knowledge
