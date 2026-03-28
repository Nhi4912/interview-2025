# React Advanced Patterns / Các Pattern Nâng Cao Trong React

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **Prerequisites**: [React Fundamentals](./01-react-fundamentals.md) | [Hooks Deep Dive](./03-hooks-deep-dive.md)
> **See also**: [Advanced Patterns v2](./08-react-patterns-advanced.md) | [State Management](./05-state-management.md)
> **L5 Competencies**: API Design, Component Architecture, Abstraction Design

---

## Real-World Scenario / Tình Huống Thực Tế

Team bạn xây dựng Design System cho công ty. Component `<Select>` ban đầu nhận 15 props: `options`, `value`, `onChange`, `placeholder`, `isMulti`, `isSearchable`, `isDisabled`, `maxHeight`, `renderOption`, `renderValue`, `onSearch`, `filterFn`, `groupBy`, `customStyles`, `position`. Mỗi lần thêm feature mới lại thêm 2-3 props. Không ai nhớ hết props, TypeScript type dài 80 dòng. Tệ hơn, khi muốn `<Select>` trong modal khác với `<Select>` trong form, phải truyền lại 10 props giống nhau.

Bạn cần pattern nào để component vừa flexible vừa dễ dùng? Đây là câu hỏi architecture mà Senior phải trả lời.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng:**
Nghĩ component patterns giống cách bạn mua đồ nội thất. **Props drilling = mua tủ lắp sẵn** — đẹp, nhanh, nhưng không thay đổi được gì. **Compound Components = mua tủ IKEA** — bạn chọn từng ngăn, từng cánh, lắp theo ý. **Render Props = thuê thợ mộc** — bạn nói "tôi muốn tủ hình thế này", thợ đo đạc và làm custom. **Custom Hooks = mua thiết kế (blueprint)** — bạn có logic, tự chọn vật liệu và lắp ráp.

| Pattern                 | Khi nào dùng                                          | Ví dụ                           |
| ----------------------- | ----------------------------------------------------- | ------------------------------- |
| Compound Components     | UI có nhiều phần liên quan, user cần customize layout | Select, Tabs, Accordion, Menu   |
| Render Props            | Cần share behavior, user tự quyết render gì           | Mouse tracker, Virtualized list |
| Custom Hooks            | Share stateful logic, không liên quan đến UI          | useFetch, useAuth, useForm      |
| Higher-Order Components | Wrap behavior vào component có sẵn (legacy)           | withAuth, withTheme             |
| Controlled/Uncontrolled | Quyết định ai own state: parent hay component         | Form inputs, Modals             |

**Tại sao phải học topic này?**

- Phỏng vấn Senior **luôn** hỏi: "Thiết kế component API cho tình huống X" — cần biết pattern nào phù hợp
- Pattern sai = technical debt tích tụ — component 50 props không ai muốn maintain
- Hiểu pattern = đọc source code thư viện (Radix, Headless UI, React Hook Form) dễ dàng

---

## Concept Map / Bản Đồ Khái Niệm

```
                    ┌──────────────────────┐
                    │  COMPONENT PATTERNS   │
                    └──────────┬───────────┘
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                     ▼
  ┌───────────────┐  ┌─────────────────┐  ┌─────────────────┐
  │ Composition   │  │ Logic Sharing   │  │ State Ownership │
  │ Patterns      │  │ Patterns        │  │ Patterns        │
  ├───────────────┤  ├─────────────────┤  ├─────────────────┤
  │ Compound      │  │ Custom Hooks    │  │ Controlled      │
  │ Components    │  │ (modern)        │  │ vs Uncontrolled │
  │               │  │                 │  │                 │
  │ Render Props  │  │ HOC (legacy)    │  │ State Reducer   │
  │               │  │                 │  │                 │
  │ Slots pattern │  │ Render Props    │  │ Control Props   │
  └───────────────┘  └─────────────────┘  └─────────────────┘
```

**Bạn đang ở đây trong lộ trình học:**

```
Hooks Deep Dive → [ADVANCED PATTERNS] → State Management → Performance
```

---

## Overview / Tổng Quan

React patterns are proven solutions for designing reusable, flexible component APIs. The five essential patterns — Compound Components, Render Props, Custom Hooks, Controlled/Uncontrolled, and State Reducer — solve different aspects of the "how to make components both powerful and simple" challenge. Modern React (hooks era) has shifted most logic-sharing to Custom Hooks, but Compound Components remain the gold standard for complex UI composition.

React patterns là các giải pháp đã được chứng minh để thiết kế component API linh hoạt. 5 patterns thiết yếu — Compound Components, Render Props, Custom Hooks, Controlled/Uncontrolled, State Reducer — giải quyết các khía cạnh khác nhau của bài toán "làm sao component vừa mạnh vừa đơn giản". Modern React đã chuyển phần lớn logic-sharing sang Custom Hooks, nhưng Compound Components vẫn là tiêu chuẩn vàng cho UI composition phức tạp.

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. Compound Components / Component Kết Hợp

> 🧠 **Memory Hook**: "Compound Components = HTML `<select>` + `<option>` — các phần riêng biệt nhưng chia sẻ state ngầm."

**Tại sao tồn tại? / Why does this exist?**
Component nhận quá nhiều props → khó dùng, khó maintain. Cần cách chia component thành các phần nhỏ mà user tự compose, nhưng vẫn chia sẻ state nội bộ.
→ **Why?** Vì 1 component "thông minh" (tự biết render tất cả) không thể dự đoán mọi cách user muốn dùng — Compound Components đẩy quyền quyết định layout/render cho user.
→ **Why?** Vì inversion of control — thay vì component quyết định render gì, user quyết định. Component chỉ cung cấp behavior + state.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

HTML `<select>` là Compound Component tự nhiên: `<select>` giữ state (value hiện tại), `<option>` là các lựa chọn. Bạn không truyền `options={[...]}` prop — bạn TỰ VIẾT `<option>`. Muốn thêm group? Dùng `<optgroup>`. Muốn disable 1 option? Thêm `disabled` vào `<option>` đó. Flexible vì user compose.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
  ┌────────────────────────────────────────────────────────┐
  │        Compound Components Architecture                │
  │                                                        │
  │  <Select>           ← Parent: giữ state (selectedValue)│
  │    <Select.Trigger> ← Hiển thị giá trị đang chọn      │
  │    <Select.List>    ← Container cho options             │
  │      <Select.Option value="a"> ← Từng option          │
  │      <Select.Option value="b">                         │
  │    </Select.List>                                      │
  │  </Select>                                             │
  │                                                        │
  │  State sharing: React Context                          │
  │  ┌──────────┐                                          │
  │  │ Select   │──creates──▶ SelectContext                │
  │  │ (parent) │             { value, onChange, isOpen }   │
  │  └──────────┘                    │                     │
  │       ▼                          ▼                     │
  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
  │  │ Trigger  │  │  List    │  │ Option   │            │
  │  │ useCtx() │  │ useCtx() │  │ useCtx() │            │
  │  └──────────┘  └──────────┘  └──────────┘            │
  └────────────────────────────────────────────────────────┘
```

**Implementation:**

```tsx
// 1. Tạo Context
const SelectContext = createContext<{
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  toggle: () => void;
} | null>(null);

// Helper hook — throw nếu dùng ngoài Select
function useSelectContext() {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Select.* must be used within <Select>");
  return ctx;
}

// 2. Parent component — giữ state
function Select({ children, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SelectContext value={{ value, onChange, isOpen, toggle: () => setIsOpen(!isOpen) }}>
      <div className="select-wrapper">{children}</div>
    </SelectContext>
  );
}

// 3. Sub-components — đọc state từ context
Select.Trigger = function Trigger() {
  const { value, toggle } = useSelectContext();
  return <button onClick={toggle}>{value || "Select..."}</button>;
};

Select.List = function List({ children }) {
  const { isOpen } = useSelectContext();
  if (!isOpen) return null;
  return <ul className="select-list">{children}</ul>;
};

Select.Option = function Option({ value, children }) {
  const { onChange, value: selected, toggle } = useSelectContext();
  return (
    <li
      className={value === selected ? "selected" : ""}
      onClick={() => {
        onChange(value);
        toggle();
      }}
    >
      {children}
    </li>
  );
};

// 4. Usage — user tự compose
function App() {
  const [color, setColor] = useState("");
  return (
    <Select value={color} onChange={setColor}>
      <Select.Trigger />
      <Select.List>
        <Select.Option value="red">Red</Select.Option>
        <Select.Option value="blue">Blue</Select.Option>
        <Select.Option value="green">Green</Select.Option>
      </Select.List>
    </Select>
  );
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Context re-render:** Mỗi state change → tất cả consumer re-render. Fix: split context (state riêng, dispatch riêng) hoặc useMemo value.
- **Type safety:** Sub-components gắn vào parent bằng static property (`Select.Option`) — TypeScript cần declare rõ ràng.
- **Validation:** User có thể compose sai (Option ngoài Select). Cần validation bằng context check + clear error message.
- **Nesting:** Compound components lồng nhau (Tabs trong Accordion) — mỗi cái phải có context riêng, không conflict.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                                 | Đúng là                                    |
| -------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------ |
| Dùng `React.Children.map` để inject props    | Fragile — break khi wrap child trong Fragment hoặc HOC      | Dùng Context để share state                |
| Quên validation khi Option dùng ngoài Select | Runtime error khó hiểu: "cannot read property of undefined" | Hook helper throw descriptive error        |
| Truyền 20 props thay vì Compound pattern     | User phải nhớ hết props, không customize được layout        | Chia thành sub-components, user tự compose |
| Không memo context value                     | Mỗi render tạo object mới → tất cả consumer re-render       | `useMemo` context value object             |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "component API design", "flexible component", "design system"
- → Nhớ đến: Compound Components + Context, Inversion of Control, HTML select analogy
- → Mở đầu trả lời: _"Compound Components chia component thành các phần nhỏ share state qua Context — giống HTML select + option. User tự compose layout, component chỉ cung cấp behavior. Ưu điểm: flexible, clear API. Trade-off: cần context management, validation khi user compose sai."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Context API](./05-state-management.md), [Component & Props](./01-react-fundamentals.md)
- ➡️ Để hiểu tiếp: [Headless Components](./08-react-patterns-advanced.md), [State Reducer pattern](#4-state-reducer-pattern)

---

### 2. Custom Hooks / Hooks Tùy Chỉnh

> 🧠 **Memory Hook**: "Custom Hook = extract stateful logic ra function có prefix 'use' — share logic, không share UI."

**Tại sao tồn tại? / Why does this exist?**
Trước Hooks, share stateful logic giữa components phải dùng HOC hoặc render props → wrapper hell, prop conflict. Custom Hooks cho phép extract logic thành function gọi được trong bất kỳ component nào.
→ **Why?** Vì logic (fetch data, form validation, auth check) thường giống nhau giữa nhiều components, nhưng UI khác nhau.
→ **Why?** Vì Hooks compose tự nhiên — custom hook gọi hooks khác, không thêm wrapper vào component tree.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Custom Hook giống **công thức nấu ăn**. Thay vì mỗi đầu bếp (component) tự nhớ cách nấu phở (fetch + loading + error), bạn viết công thức (useFetch) 1 lần. Mỗi đầu bếp dùng cùng công thức nhưng chọn bát (UI) khác nhau — bát to, bát nhỏ, bát sành, bát inox. Logic giống, presentation khác.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
  ┌────────────────────────────────────────────────────┐
  │         Custom Hook = Logic Extraction              │
  │                                                     │
  │  TRƯỚC (logic lặp lại):                            │
  │  ┌──────────────┐  ┌──────────────┐               │
  │  │ ComponentA   │  │ ComponentB   │               │
  │  │ [loading]    │  │ [loading]    │  Cùng logic   │
  │  │ [data]       │  │ [data]       │  copy-paste   │
  │  │ [error]      │  │ [error]      │               │
  │  │ useEffect    │  │ useEffect    │               │
  │  │   fetch...   │  │   fetch...   │               │
  │  └──────────────┘  └──────────────┘               │
  │                                                     │
  │  SAU (extract to custom hook):                     │
  │  ┌──────────────┐                                  │
  │  │ useFetch(url)│  ← Shared logic                 │
  │  │ [loading]    │                                  │
  │  │ [data]       │                                  │
  │  │ [error]      │                                  │
  │  └──────┬───────┘                                  │
  │         │                                          │
  │    ┌────┴─────┐                                    │
  │    ▼          ▼                                    │
  │  CompA      CompB     ← Different UI, same logic  │
  └────────────────────────────────────────────────────┘
```

**Design principles cho good custom hooks:**

```tsx
// PRINCIPLE 1: Return cả state VÀ actions
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);

  // Stable references — không cần useCallback vì không có deps
  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse }; // object, không phải array
}

// PRINCIPLE 2: Compose hooks with hooks
function useAuth() {
  const { data: user, loading } = useFetch<User>("/api/me");
  const { value: isModalOpen, toggle: toggleModal } = useToggle();

  const logout = useCallback(async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }, []);

  return { user, loading, isModalOpen, toggleModal, logout };
}

// PRINCIPLE 3: Accept configuration, return interface
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Mỗi component có instance riêng:** `useToggle()` trong ComponentA và ComponentB là 2 state riêng biệt — KHÔNG share state.
- **Return object vs array:** Array `[value, setter]` khi chỉ 2 giá trị (dễ rename). Object `{ value, toggle }` khi > 2 giá trị (rõ ràng hơn).
- **Rules of Hooks vẫn áp dụng:** Custom hook gọi hooks bên trong → phải tuân Rules of Hooks (top level, no conditional).

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                        | Đúng là                                           |
| -------------------------------------------- | -------------------------------------------------- | ------------------------------------------------- |
| Nghĩ custom hook share state giữa components | Mỗi component gọi hook = instance mới              | Share state cần Context hoặc state management lib |
| Custom hook không prefix "use"               | ESLint không apply rules-of-hooks check            | Luôn đặt tên `useSomething`                       |
| Return quá nhiều thứ (10+ values)            | Hook đang làm quá nhiều việc → khó test, khó reuse | Tách thành nhiều hooks nhỏ hơn                    |
| useEffect trong custom hook không cleanup    | Memory leak khi component unmount                  | Luôn return cleanup function trong useEffect      |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "custom hooks", "share logic", "code reuse trong React"
- → Nhớ đến: Extract stateful logic, compose hooks, mỗi instance riêng
- → Mở đầu trả lời: _"Custom hooks extract stateful logic ra function prefix 'use' — share logic không share UI. Mỗi component gọi hook có state riêng biệt. Design principle: return state + actions, compose từ hooks khác, accept config return interface."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [useState, useEffect](./03-hooks-deep-dive.md), [Rules of Hooks](./03-hooks-deep-dive.md)
- ➡️ Để hiểu tiếp: [Hooks Comprehensive](./07-hooks-comprehensive.md), [Testing Custom Hooks](./06-testing.md)

---

### 3. Controlled vs Uncontrolled / Kiểm Soát vs Không Kiểm Soát

> 🧠 **Memory Hook**: "Controlled = parent giữ remote, Uncontrolled = TV tự có nút bấm — ai sở hữu state?"

**Tại sao tồn tại? / Why does this exist?**
Khi thiết kế component, phải quyết định: state nằm ở đâu? Nếu parent quản lý (controlled), component flexible nhưng parent phải handle mọi update. Nếu component tự quản lý (uncontrolled), dùng dễ nhưng parent ít kiểm soát.
→ **Why?** Vì đây là fundamental trade-off trong UI design: flexibility vs simplicity. Không có đáp án đúng cho mọi trường hợp.
→ **Why?** Vì React form inputs đã introduce pattern này (`<input value={x} onChange={fn}>` vs `<input defaultValue={x} ref={r}>`), và nó áp dụng cho mọi stateful component.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

**Controlled** giống TV với remote — bạn (parent) giữ remote, mỗi lần muốn đổi kênh phải bấm nút (onChange), TV chỉ hiển thị kênh bạn chọn (value). **Uncontrolled** giống TV tự có nút bấm phía trước — TV tự quản lý kênh, bạn chỉ biết kênh nào đang chiếu khi nhìn màn hình (ref).

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
  CONTROLLED:                        UNCONTROLLED:
  ─────────────                      ──────────────
  Parent owns state                  Component owns state
  ┌──────────────┐                   ┌──────────────┐
  │ Parent       │                   │ Parent       │
  │ [value, set] │                   │ ref          │
  │      │       │                   │      │       │
  │      ▼       │                   │      ▼       │
  │ <Input       │                   │ <Input       │
  │   value={v}  │                   │   defaultVal │
  │   onChange=  │                   │   ref={ref}  │
  │   {set}  /> │                   │  />          │
  └──────────────┘                   └──────────────┘

  Data flow:                         Data flow:
  Parent → Input (value)             Input tự quản lý
  Input → Parent (onChange)          Parent đọc qua ref.current.value
```

**Ví dụ thực tế — Accordion:**

```tsx
// CONTROLLED — parent quyết định panel nào mở
function ControlledAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <Accordion openIndex={openIndex} onChange={(i) => setOpenIndex(i === openIndex ? null : i)}>
      <Accordion.Item title="Section 1">Content 1</Accordion.Item>
      <Accordion.Item title="Section 2">Content 2</Accordion.Item>
    </Accordion>
  );
}

// UNCONTROLLED — Accordion tự quản lý
function UncontrolledAccordion() {
  return (
    <Accordion defaultOpenIndex={0}>
      <Accordion.Item title="Section 1">Content 1</Accordion.Item>
      <Accordion.Item title="Section 2">Content 2</Accordion.Item>
    </Accordion>
  );
}

// HYBRID — component hỗ trợ cả 2 mode
function Accordion({ openIndex, defaultOpenIndex, onChange, children }) {
  // Nếu openIndex prop tồn tại → controlled mode
  const isControlled = openIndex !== undefined;
  const [internalIndex, setInternalIndex] = useState(defaultOpenIndex ?? null);

  const activeIndex = isControlled ? openIndex : internalIndex;

  const handleChange = (index: number) => {
    if (!isControlled) setInternalIndex(index);
    onChange?.(index); // notify parent dù controlled hay không
  };

  return (
    <AccordionContext value={{ activeIndex, onChange: handleChange }}>{children}</AccordionContext>
  );
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Hybrid components** (như ví dụ trên) hỗ trợ cả 2 mode — industry standard cho Design System.
- **React warn "switching controlled to uncontrolled":** Nếu `value` prop đổi từ defined → undefined, React cảnh báo. Luôn dùng `value ?? ""` để tránh.
- **Performance:** Controlled re-render parent mỗi keystroke (vì parent setState). Uncontrolled không re-render parent → tốt cho form lớn (React Hook Form dùng cách này).

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                  | Tại sao sai                                                     | Đúng là                                                  |
| ---------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------- |
| Trộn controlled + uncontrolled cùng lúc  | `value` + `defaultValue` conflict → behavior không dự đoán được | Chọn 1: `value+onChange` HOẶC `defaultValue+ref`         |
| value={undefined} rồi set value={string} | React chuyển từ uncontrolled → controlled → warning             | Dùng `value ?? ""` để luôn controlled                    |
| Mọi input đều controlled trong form lớn  | Mỗi keystroke re-render toàn form → lag                         | Dùng uncontrolled (React Hook Form) cho form > 20 fields |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "controlled vs uncontrolled", "form handling", "component state ownership"
- → Nhớ đến: Ai sở hữu state? Flexibility vs simplicity trade-off, hybrid pattern
- → Mở đầu trả lời: _"Controlled component nhận state từ parent qua props — parent sở hữu và kiểm soát hoàn toàn. Uncontrolled tự quản lý state nội bộ — parent đọc qua ref. Industry practice là hybrid: hỗ trợ cả 2 mode, detect controlled khi value prop tồn tại."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [useState](./03-hooks-deep-dive.md), [Component & Props](./01-react-fundamentals.md)
- ➡️ Để hiểu tiếp: [State Reducer pattern](#4-state-reducer-pattern), [Form Libraries](./05-state-management.md)

---

### 4. State Reducer Pattern / Pattern Giảm State

> 🧠 **Memory Hook**: "State Reducer = user override reducer của component — inversion of control cho state transitions."

**Tại sao tồn tại? / Why does this exist?**
Đôi khi user cần customize KHÔNG CHỈ UI mà cả BEHAVIOR. Ví dụ: Dropdown mặc định đóng sau khi chọn item, nhưng multi-select cần giữ mở. Compound Components cho customize UI, State Reducer cho customize behavior.
→ **Why?** Vì component author không thể dự đoán mọi behavior variation. Thay vì thêm prop cho mỗi variation (`keepOpen`, `closeOnSelect`, `multiSelectBehavior`...), cho user inject reducer.
→ **Why?** Vì đây là Inversion of Control ở mức state transition — user quyết định "khi action X xảy ra, state thay đổi thế nào".

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Hãy tưởng tượng máy pha cà phê tự động. Mặc định: bấm "Espresso" → 30ml, "Americano" → 60ml. State Reducer giống bạn được quyền mở panel cài đặt bên trong: "Khi bấm Espresso, tôi muốn 50ml thay vì 30ml, và KHÔNG tự tắt máy". Bạn override hành vi mặc định mà không cần sửa máy.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
  ┌───────────────────────────────────────────────────────┐
  │           State Reducer Pattern Flow                   │
  │                                                        │
  │  Component internal:                                   │
  │  1. Action xảy ra (user click option)                 │
  │  2. Tạo action object { type: "SELECT", value: "a" }  │
  │  3. Chạy QUA user reducer trước:                      │
  │     newState = userReducer(state, action)              │
  │     ↓ nếu user trả về state mới → dùng đó            │
  │     ↓ nếu user trả về undefined → dùng default        │
  │  4. Apply new state                                    │
  └───────────────────────────────────────────────────────┘
```

```tsx
// Component cung cấp stateReducer prop
function useSelect({ stateReducer = defaultReducer, ...options }) {
  // Default reducer — hành vi mặc định
  function defaultReducer(state, action) {
    switch (action.type) {
      case "SELECT":
        return { ...state, selectedValue: action.value, isOpen: false };
      case "TOGGLE":
        return { ...state, isOpen: !state.isOpen };
      default:
        return state;
    }
  }

  // User reducer WRAP default reducer
  function reducer(state, action) {
    // User có thể modify action, state, hoặc cả hai
    return stateReducer(state, action, defaultReducer);
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
}

// USER USAGE: Multi-select — giữ dropdown mở sau khi chọn
function MultiSelect() {
  const { state, dispatch } = useSelect({
    stateReducer: (state, action, defaultReducer) => {
      // Override: SELECT không đóng dropdown
      if (action.type === "SELECT") {
        return { ...state, selectedValue: action.value, isOpen: true }; // giữ mở!
      }
      // Mọi action khác → dùng default
      return defaultReducer(state, action);
    },
  });
  // ...
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **API complexity:** User phải hiểu internal state shape + action types → higher learning curve. Cần document rõ.
- **Breaking changes risk:** Nếu component đổi action type name → user reducer break. Cần stable action type API.
- **Khi nào KHÔNG dùng:** Nếu variation chỉ là 1-2 boolean (keepOpen, disabled), prop đơn giản hơn.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                       | Tại sao sai                                                     | Đúng là                                              |
| --------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------- |
| Expose internal state shape mà không document | User reducer depend vào undocumented field → break khi refactor | Document mọi state field + action type               |
| Không truyền defaultReducer cho user          | User phải copy-paste toàn bộ logic chỉ để thay 1 case           | Truyền defaultReducer làm param thứ 3                |
| Dùng State Reducer cho variation đơn giản     | Over-engineering — boolean prop đủ                              | Chỉ dùng khi variation phức tạp + không dự đoán được |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "inversion of control", "customize component behavior", "extensible component"
- → Nhớ đến: State Reducer pattern, user override reducer, defaultReducer fallback
- → Mở đầu trả lời: _"State Reducer pattern cho phép user override state transitions của component bằng cách inject custom reducer. Component chạy user reducer trước, user quyết định action nào thay đổi state thế nào, fallback về default reducer cho actions không override. Đây là Inversion of Control ở mức behavior, không chỉ UI."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [useReducer](./03-hooks-deep-dive.md), [Compound Components](#1-compound-components)
- ➡️ Để hiểu tiếp: [Headless Components](./08-react-patterns-advanced.md), [Downshift/Radix source code]

---

### 5. Higher-Order Components (HOC) / Component Bậc Cao

> 🧠 **Memory Hook**: "HOC = function nhận component, trả về component MỚI có thêm khả năng — decorator pattern cho React. LEGACY nhưng phỏng vấn vẫn hỏi."

**Tại sao tồn tại? / Why does this exist?**
Trước Hooks (React < 16.8), đây là cách duy nhất để share stateful logic giữa components. HOC wrap component trong 1 wrapper, inject props.
→ **Why?** Vì class component không thể share logic bằng function call — phải dùng composition ở component level.
→ **Why?** Đã bị custom hooks thay thế phần lớn. Nhưng phỏng vấn hỏi để test bạn biết evolution, và một số thư viện (React Router v5, Redux connect) vẫn dùng.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

HOC giống **ốp lưng điện thoại** — điện thoại (component) vẫn nguyên, ốp thêm tính năng (auth check, theme, logging). Bạn bọc ốp vào: `withAuth(ProfilePage)` → ProfilePage giờ có thêm khả năng check auth.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
  ┌─────────────────────────────────────────────┐
  │           HOC Pattern                        │
  │                                              │
  │  withAuth(ProfilePage)                       │
  │     │                                        │
  │     ▼                                        │
  │  function EnhancedProfile(props) {           │
  │    const user = useAuth();                   │
  │    if (!user) return <Redirect to="/login">; │
  │    return <ProfilePage {...props} user={u}>; │
  │  }                                           │
  │                                              │
  │  Component Tree:                             │
  │  <EnhancedProfile>   ← HOC wrapper          │
  │    <ProfilePage>     ← Original component   │
  └─────────────────────────────────────────────┘
```

```tsx
// HOC implementation
function withAuth<P extends object>(WrappedComponent: React.ComponentType<P & { user: User }>) {
  return function WithAuth(props: P) {
    const { user, loading } = useAuth();

    if (loading) return <Spinner />;
    if (!user) return <Navigate to="/login" />;

    return <WrappedComponent {...props} user={user} />;
  };
}

// Usage
const ProtectedProfile = withAuth(ProfilePage);
// <ProtectedProfile /> → auto-check auth, inject user prop
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Wrapper hell:** Nhiều HOC lồng nhau: `withAuth(withTheme(withRouter(Component)))` → debug DevTools thấy 4 wrappers.
- **Props conflict:** Nếu 2 HOC inject cùng prop name → conflict. Custom hooks không có vấn đề này.
- **Ref forwarding:** HOC phải forwardRef hoặc ref chỉ attach vào wrapper, không vào component gốc.
- **Static methods lost:** HOC không tự copy static methods — cần `hoist-non-react-statics`.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                           | Tại sao sai                                                   | Đúng là                                                   |
| ------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------- |
| Viết HOC mới cho logic sharing                    | Custom hooks đơn giản hơn, không wrapper, không prop conflict | Dùng custom hooks cho logic sharing                       |
| Gọi HOC trong render: `return <WithAuth(Comp) />` | Tạo component type mới mỗi render → unmount/remount toàn bộ   | Gọi HOC ở module level: `const Enhanced = withAuth(Comp)` |
| Quên forward ref qua HOC                          | ref gắn vào wrapper thay vì component gốc                     | Dùng React.forwardRef trong HOC                           |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "HOC", "higher-order component", "code reuse trước hooks"
- → Nhớ đến: Function nhận component trả component, decorator pattern, legacy → hooks
- → Mở đầu trả lời: _"HOC là function nhận component và trả về component mới có thêm khả năng — decorator pattern. Phổ biến trước hooks cho logic sharing. Nhược điểm: wrapper hell, prop naming conflict, DevTools nesting. Ngày nay phần lớn thay bằng custom hooks, nhưng Redux connect và một số pattern vẫn dùng HOC."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Component & Props](./01-react-fundamentals.md)
- ➡️ Để hiểu tiếp: [Custom Hooks](#2-custom-hooks) (replacement), [Render Props evolution](./08-react-patterns-advanced.md)

---

## Q&A Section / Câu Hỏi Phỏng Vấn

### Q1: Compound Components là gì? Cho ví dụ. / What are Compound Components? Give an example. 🟢 Junior

**A:** Compound Components are a pattern where a parent component shares implicit state with its children through Context, and children compose the UI. Like HTML `<select>` + `<option>` — `<select>` holds state, `<option>` renders choices, user arranges them freely.

Compound Components là pattern mà parent component share state ngầm cho children qua Context. Children tự compose UI. Giống HTML select + option — parent giữ state, children render từng phần, user tự sắp xếp.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Đề cập Context cho state sharing, cho ví dụ select/tabs, biết khác gì render props
- ❌ Weak: Chỉ nói "component có component con" — thiếu implicit state sharing

---

### Q2: Custom hook khác gì regular function? / How is a custom hook different from a regular function? 🟢 Junior

**A:** A custom hook can call other hooks (useState, useEffect, etc.) inside it — a regular function cannot. Custom hooks must be prefixed with "use" so React's ESLint plugin enforces Rules of Hooks. Each component calling the hook gets its own independent state — hooks don't share state between components.

Custom hook gọi được hooks khác (useState, useEffect) bên trong — regular function thì không. Phải prefix "use" để ESLint check Rules of Hooks. Mỗi component gọi hook có state riêng — KHÔNG share state giữa components.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Biết mỗi instance có state riêng, biết ESLint "use" prefix enforcement
- ❌ Weak: "Giống regular function thêm use" — thiếu Rules of Hooks context

---

### Q3: Controlled vs Uncontrolled — khi nào dùng cái nào? / Controlled vs Uncontrolled — when to use which? 🟡 Mid

**A:** Use **Controlled** when you need: validation on every keystroke, conditional logic based on input, or synchronized state across multiple inputs. Use **Uncontrolled** when: performance matters (large forms — React Hook Form approach), simple forms without complex validation, or integrating with non-React code. Best practice for libraries: support BOTH modes (hybrid) — detect controlled when `value` prop is defined.

**Controlled** khi cần: validation mỗi keystroke, logic phụ thuộc input, đồng bộ nhiều input. **Uncontrolled** khi: performance (form lớn, React Hook Form dùng cách này), form đơn giản. Best practice cho lib: hỗ trợ CẢ HAI (hybrid) — detect controlled khi `value` prop defined.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Biết trade-off performance (controlled re-render mỗi keystroke), đề cập hybrid pattern, React Hook Form
- ❌ Weak: "Controlled tốt hơn uncontrolled" — binary thinking, không hiểu trade-off

---

### Q4: HOC vs Custom Hooks — tại sao hooks thắng? / HOC vs Custom Hooks — why did hooks win? 🟡 Mid

**A:** Hooks won because they solve HOC's three fundamental problems: (1) **Wrapper hell** — HOCs nest components, hooks compose flatly; (2) **Prop naming conflicts** — two HOCs can inject same-named prop, hooks return values you name yourself; (3) **Indirection** — tracing where a prop comes from through 3 HOC wrappers is hard, hook calls are explicit. Plus, hooks don't add nodes to the component tree, making debugging and performance easier.

Hooks thắng vì giải 3 vấn đề của HOC: (1) Wrapper hell — HOC lồng component, hooks compose phẳng; (2) Prop naming conflict — 2 HOC inject cùng tên prop, hooks return value bạn tự đặt tên; (3) Indirection — trace prop qua 3 HOC wrappers khó, hook call explicit. Thêm nữa, hooks không thêm node vào component tree.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu 3 vấn đề cụ thể, cho ví dụ `withAuth(withTheme(withRouter(C)))`, biết HOC vẫn dùng (Redux connect)
- ❌ Weak: "Hooks mới hơn nên tốt hơn" — không giải thích technical reason

---

### Q5: Thiết kế component API cho Tabs component trong Design System. / Design a component API for a Tabs component in a Design System. 🔴 Senior

**A:** I would use Compound Components pattern with hybrid controlled/uncontrolled support:

```tsx
// API Design
<Tabs defaultValue="tab1" onValueChange={console.log}>
  <Tabs.List>
    <Tabs.Trigger value="tab1">Profile</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Settings</Tabs.Trigger>
    <Tabs.Trigger value="tab3" disabled>Admin</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1"><ProfilePanel /></Tabs.Content>
  <Tabs.Content value="tab2"><SettingsPanel /></Tabs.Content>
  <Tabs.Content value="tab3"><AdminPanel /></Tabs.Content>
</Tabs>

// Controlled mode
<Tabs value={activeTab} onValueChange={setActiveTab}>
  ...
</Tabs>
```

**Design decisions:**

- **Compound Components:** User controls layout (can put Trigger inside custom wrapper)
- **Hybrid controlled/uncontrolled:** `value` prop → controlled, `defaultValue` → uncontrolled
- **Accessibility built-in:** `role="tablist"`, `role="tab"`, `aria-selected`, keyboard navigation (Arrow keys)
- **Context for state sharing:** TabsContext holds `{ activeValue, onValueChange }`
- **Lazy rendering option:** `<Tabs.Content forceMount>` for always-mounted vs mount-on-active

Compound Components cho flexible layout + hybrid controlled/uncontrolled. Accessibility built-in (ARIA roles, keyboard nav). Context share state. Design System cần: TypeScript strict, ref forwarding, customizable styling (className/style/asChild).

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Compound pattern, hybrid mode, accessibility, lazy vs forceMount, TypeScript generics
- ❌ Weak: Single component with 15 props, no accessibility consideration

**🔴 Follow-up Chain:**

1. "Làm sao handle keyboard navigation cho Tabs?" → Arrow Left/Right move focus giữa Triggers, Home/End jump first/last, Enter/Space activate. useFocusManager hook quản lý focus ring.
2. "Nếu tab content load async, API thay đổi thế nào?" → `<Tabs.Content>` nhận children hoặc render prop. Kết hợp Suspense: `<Suspense fallback={<Skeleton />}><AsyncContent /></Suspense>` bên trong Content.
3. "So sánh API này với Radix UI Tabs." → Radix dùng pattern gần giống: Compound + controlled/uncontrolled + asChild pattern (render as different element). Thêm `activationMode="manual"` cho tab chỉ active khi Enter, không khi focus.

---

### Q6: State Reducer pattern giải quyết gì? So sánh với render props. / What does the State Reducer pattern solve? Compare with render props. 🔴 Senior

**A:** State Reducer gives users control over **state transitions** (behavior), while Render Props gives control over **rendering** (UI). They solve different aspects of Inversion of Control:

| Aspect        | State Reducer                                              | Render Props                              |
| ------------- | ---------------------------------------------------------- | ----------------------------------------- |
| Controls      | Behavior (state transitions)                               | Presentation (UI output)                  |
| User provides | Custom reducer function                                    | Custom render function                    |
| Typical use   | Override default actions (multi-select, custom validation) | Custom item rendering, layout flexibility |
| Complexity    | Higher (user needs internal state knowledge)               | Lower (user just returns JSX)             |

State Reducer kiểm soát **behavior** (state transitions), Render Props kiểm soát **UI** (render output). Compound Components + State Reducer = kiểm soát CẢ HAI. Dùng State Reducer khi variation là hành vi (multi-select stay open, custom validation rule), không phải UI.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Phân biệt behavior vs UI control, biết khi nào dùng cái nào, đề cập Downshift (thư viện dùng cả 2)
- ❌ Weak: Nhầm lẫn 2 pattern hoặc chỉ biết 1

**🔴 Follow-up Chain:**

1. "Khi nào State Reducer trở thành over-engineering?" → Khi variation chỉ là 1-2 boolean flags. Rule: nếu có thể express bằng `if (multiSelect) {...}`, không cần State Reducer.
2. "Làm sao document action types cho user?" → TypeScript discriminated union cho action types + JSDoc. Storybook story cho mỗi behavior variation.
3. "Headless UI library như Radix dùng pattern nào?" → Radix dùng Compound Components + controlled/uncontrolled. Ít dùng State Reducer trực tiếp — thay vào đó expose event handlers (onOpenChange, onValueChange) mà user can prevent default.

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| #   | Question                        | Level | Key Point                                                |
| --- | ------------------------------- | ----- | -------------------------------------------------------- |
| Q1  | Compound Components             | 🟢    | Context state sharing, like select+option, user compose  |
| Q2  | Custom hook vs regular function | 🟢    | Can call hooks, "use" prefix, each instance own state    |
| Q3  | Controlled vs Uncontrolled      | 🟡    | State ownership trade-off, hybrid pattern for libs       |
| Q4  | HOC vs Custom Hooks             | 🟡    | Wrapper hell, prop conflict, indirection solved by hooks |
| Q5  | Design Tabs API                 | 🔴    | Compound + hybrid + a11y + TypeScript                    |
| Q6  | State Reducer vs Render Props   | 🔴    | Behavior control vs UI control, different IoC aspects    |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"Thiết kế component API cho Dropdown/Select trong Design System — yêu cầu flexible, accessible, và maintainable."**

**30 giây đầu — mở đầu lý tưởng / Ideal 30-second opening:**

1. "Tôi sẽ dùng Compound Components pattern — tách Select thành Trigger, List, Option, mỗi phần share state qua Context. User tự compose layout."
2. "Hỗ trợ cả controlled (value + onChange) và uncontrolled (defaultValue) mode — detect controlled khi value prop defined."
3. "Ở dự án trước, chúng tôi dùng pattern này cho Design System — accessibility built-in với ARIA roles và keyboard navigation, TypeScript generics cho type-safe value."
4. "Trade-off: Context re-render khi state change — fix bằng split context (state riêng, dispatch riêng) hoặc memo value."

_Sau đó mở rộng theo hướng interviewer dẫn dắt._

---

## Self-Check / Tự Kiểm Tra ⚡

> **Đóng tài liệu lại trước khi làm — Close the doc before attempting.**

- [ ] **Retrieval**: Viết 5 React patterns từ trí nhớ, mỗi cái 1 câu mô tả use case. So sánh với Overview.
- [ ] **Visual**: Vẽ Compound Components architecture (parent + context + children) ra giấy. So sánh với ASCII diagram.
- [ ] **Application**: Design System cần component `<Dialog>` — bạn chọn pattern nào? Viết API usage example.
- [ ] **Debug**: Compound Component `<Select.Option>` dùng ngoài `<Select>` gây "Cannot read property of null" — nguyên nhân? Fix?
- [ ] **Teach**: Giải thích Controlled vs Uncontrolled cho người không biết lập trình bằng liên tưởng "TV với remote vs TV tự bấm".

💬 **Feynman Prompt:** Giải thích Compound Components cho người không biết lập trình, dùng liên tưởng "IKEA tủ tự lắp". Không dùng thuật ngữ kỹ thuật.

🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày → 7 ngày → 14 ngày** để chuyển vào long-term memory.

---

## Connections / Liên Kết

- ⬅️ **Built on:** [Hooks Deep Dive](./03-hooks-deep-dive.md) — hooks enable custom hooks pattern, useReducer enables state reducer
- ⬅️ **Built on:** [React Fundamentals](./01-react-fundamentals.md) — component model, props, children composition
- ➡️ **Enables:** [Advanced Patterns v2](./08-react-patterns-advanced.md) — headless components, prop getters, polymorphic components
- ➡️ **Enables:** [State Management](./05-state-management.md) — Context + patterns = state management architecture
- 🔗 **Applied in:** Design Systems (Radix, Headless UI, shadcn/ui), React Hook Form, Downshift
