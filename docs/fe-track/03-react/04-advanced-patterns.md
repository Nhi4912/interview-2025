# React Advanced Patterns / Các Pattern Nâng Cao Trong React

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **Prerequisites**: [React Fundamentals](./01-react-fundamentals.md) | [Hooks Deep Dive](./03-hooks-deep-dive.md)
> **See also**: [Advanced Patterns v2](./08-react-patterns-advanced.md) | [State Management](./05-state-management.md)
> **L5 Competencies**: API Design, Component Architecture, Abstraction Design

---

## Real-World Scenario / Tình Huống Thực Tế

Your team is building a Design System for the company. The `<Select>` component started with 15 props: `options`, `value`, `onChange`, `placeholder`, `isMulti`, `isSearchable`, `isDisabled`, `maxHeight`, `renderOption`, `renderValue`, `onSearch`, `filterFn`, `groupBy`, `customStyles`, `position`. Every new feature adds 2-3 more props. Nobody remembers all the props, the TypeScript type is 80 lines long. Worse, when you want `<Select>` in a modal to behave differently from `<Select>` in a form, you have to pass the same 10 props again.

Team bạn xây dựng Design System cho công ty. Component `<Select>` ban đầu nhận 15 props: `options`, `value`, `onChange`, `placeholder`, `isMulti`, `isSearchable`... Mỗi lần thêm feature mới lại thêm 2-3 props. Không ai nhớ hết, TypeScript type dài 80 dòng. Tệ hơn, khi muốn `<Select>` trong modal khác với `<Select>` trong form, phải truyền lại 10 props giống nhau.

Which pattern do you need to make a component both flexible and easy to use? This is an architecture question that Senior developers must answer.

Bạn cần pattern nào để component vừa linh hoạt vừa dễ dùng? Đây là câu hỏi kiến trúc mà Senior phải trả lời.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Ví dụ liên tưởng:**

Think of component patterns like buying furniture. **Props drilling = buying pre-assembled furniture** — pretty, fast, but you can't change anything. **Compound Components = buying IKEA furniture** — you choose each shelf, each door, and assemble however you want. **Render Props = hiring a carpenter** — you say "I want a cabinet shaped like this", and the carpenter measures and builds custom. **Custom Hooks = buying a blueprint** — you have the logic, you choose the materials and build it yourself.

Nghĩ component patterns giống mua đồ nội thất. **Props drilling = mua tủ lắp sẵn** — đẹp, nhanh, nhưng không thay đổi được. **Compound Components = mua tủ IKEA** — bạn chọn từng ngăn, lắp theo ý. **Render Props = thuê thợ mộc** — bạn nói muốn tủ hình gì, thợ đo và làm custom. **Custom Hooks = mua bản thiết kế** — bạn có logic, tự chọn vật liệu và lắp ráp.

| Pattern                 | When to use / Khi nào dùng                                                                                 | Example / Ví dụ                 |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Compound Components     | UI with many related parts, user needs layout control / UI nhiều phần liên quan, user cần customize layout | Select, Tabs, Accordion, Menu   |
| Render Props            | Share behavior, user decides what to render / Share behavior, user tự quyết render gì                      | Mouse tracker, Virtualized list |
| Custom Hooks            | Share stateful logic, not UI-related / Share logic có state, không liên quan UI                            | useFetch, useAuth, useForm      |
| Higher-Order Components | Wrap behavior onto existing component (legacy) / Bọc behavior vào component có sẵn (cũ)                    | withAuth, withTheme             |
| Controlled/Uncontrolled | Decide who owns state: parent or component / Quyết định ai giữ state: cha hay component                    | Form inputs, Modals             |

**Why learn this topic? / Tại sao phải học?**

- Senior interviews **always** ask: "Design a component API for situation X" — you need to know which pattern fits / Phỏng vấn Senior **luôn** hỏi: "Thiết kế component API cho tình huống X"
- Wrong pattern = accumulated technical debt — a component with 50 props that nobody wants to maintain / Pattern sai = technical debt tích tụ
- Understanding patterns = reading library source code (Radix, Headless UI, React Hook Form) becomes easy / Hiểu pattern = đọc source code thư viện dễ dàng

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
  └───────────────┘  └─────────────────┘  └─────────────────┘
```

**Where you are in the learning path / Bạn đang ở đây:**

```
Hooks Deep Dive → [ADVANCED PATTERNS] → State Management → Performance
```

---

## Overview / Tổng Quan

React patterns are proven solutions for designing reusable, flexible component APIs. The five essential patterns — Compound Components, Render Props, Custom Hooks, Controlled/Uncontrolled, and State Reducer — solve different aspects of the "how to make components both powerful and simple" challenge. Modern React (hooks era) has shifted most logic-sharing to Custom Hooks, but Compound Components remain the gold standard for complex UI composition.

React patterns là các giải pháp đã được chứng minh để thiết kế component API linh hoạt và dùng lại được. 5 patterns thiết yếu — Compound Components, Render Props, Custom Hooks, Controlled/Uncontrolled, State Reducer — giải quyết các khía cạnh khác nhau của bài toán "làm sao component vừa mạnh vừa đơn giản". React hiện đại đã chuyển phần lớn việc chia sẻ logic sang Custom Hooks, nhưng Compound Components vẫn là tiêu chuẩn vàng cho UI composition phức tạp.

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. Compound Components / Component Kết Hợp

> 🧠 **Memory Hook**: "Compound Components = HTML `<select>` + `<option>` — separate pieces but sharing state behind the scenes."
> "Compound Components = HTML `<select>` + `<option>` — các phần riêng biệt nhưng chia sẻ state ngầm."

**Why does this exist? / Tại sao tồn tại?**

When a component takes too many props, it becomes hard to use and maintain. We need a way to split a component into small pieces that users compose themselves, while still sharing internal state.
→ **Why?** Because a single "smart" component (that renders everything itself) can't predict every way users want to use it — Compound Components push the layout/rendering decision to the user.
→ **Why?** Because of Inversion of Control — instead of the component deciding what to render, the user decides. The component only provides behavior + state.

Khi component nhận quá nhiều props → khó dùng, khó bảo trì. Cần cách chia component thành các phần nhỏ mà user tự ghép, nhưng vẫn chia sẻ state bên trong.
→ **Tại sao?** Vì 1 component "thông minh" (tự render tất cả) không thể đoán mọi cách user muốn dùng — Compound Components đẩy quyền quyết định layout cho user.
→ **Tại sao?** Vì đảo ngược quyền kiểm soát (Inversion of Control) — thay vì component quyết định render gì, user quyết định. Component chỉ cung cấp behavior + state.

#### Layer 1: Simple Analogy / Ví Dụ Liên Tưởng

HTML `<select>` is a natural Compound Component: `<select>` holds the state (current value), `<option>` elements are the choices. You don't pass an `options={[...]}` prop — you WRITE the `<option>` elements yourself. Want to add groups? Use `<optgroup>`. Want to disable one option? Add `disabled` to that `<option>`. It's flexible because the user composes.

HTML `<select>` là Compound Component tự nhiên: `<select>` giữ state (giá trị hiện tại), `<option>` là các lựa chọn. Bạn không truyền prop `options={[...]}` — bạn TỰ VIẾT `<option>`. Muốn thêm nhóm? Dùng `<optgroup>`. Muốn tắt 1 option? Thêm `disabled`. Linh hoạt vì user tự ghép.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
  ┌────────────────────────────────────────────────────────┐
  │        Compound Components Architecture                │
  │                                                        │
  │  <Select>           ← Parent: holds state              │
  │    <Select.Trigger> ← Shows selected value             │
  │    <Select.List>    ← Container for options            │
  │      <Select.Option value="a"> ← Each option          │
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

**Implementation / Triển khai:**

```tsx
// 1. Create Context / Tạo Context
const SelectContext = createContext<{
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  toggle: () => void;
} | null>(null);

// Helper hook — throws if used outside Select
// Hook helper — throw lỗi nếu dùng ngoài Select
function useSelectContext() {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Select.* must be used within <Select>");
  return ctx;
}

// 2. Parent component — holds state / giữ state
function Select({ children, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SelectContext value={{ value, onChange, isOpen, toggle: () => setIsOpen(!isOpen) }}>
      <div className="select-wrapper">{children}</div>
    </SelectContext>
  );
}

// 3. Sub-components — read state from context / đọc state từ context
Select.Trigger = function Trigger() {
  const { value, toggle } = useSelectContext();
  return <button onClick={toggle}>{value || "Select..."}</button>;
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

// 4. Usage — user composes freely / user tự ghép
<Select value={color} onChange={setColor}>
  <Select.Trigger />
  <Select.List>
    <Select.Option value="red">Red</Select.Option>
    <Select.Option value="blue">Blue</Select.Option>
  </Select.List>
</Select>;
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Đặc Biệt

- **Context re-render:** Every state change → all consumers re-render. Fix: split context (separate state and dispatch) or useMemo the value. / Mỗi state change → tất cả consumer re-render. Sửa: chia context hoặc useMemo value.
- **Type safety:** Sub-components attached via static property (`Select.Option`) — TypeScript needs explicit declarations. / TypeScript cần khai báo rõ ràng.
- **Validation:** Users can compose incorrectly (Option outside Select). Need validation with context check + clear error message. / User có thể ghép sai. Cần validation bằng context check + thông báo lỗi rõ ràng.
- **Nesting:** Nested compound components (Tabs inside Accordion) — each must have its own context, no conflicts. / Mỗi cái phải có context riêng, không xung đột.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                                                  | Why wrong / Tại sao sai                                                                                | Correct / Đúng là                                                    |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Using `React.Children.map` to inject props / Dùng Children.map inject props        | Fragile — breaks when child is wrapped in Fragment or HOC / Dễ hỏng khi child bọc Fragment hoặc HOC    | Use Context to share state / Dùng Context share state                |
| No validation when Option used outside Select / Không validate Option ngoài Select | Hard-to-understand runtime error: "cannot read property of undefined"                                  | Helper hook throws descriptive error / Hook helper throw lỗi rõ ràng |
| 20 props instead of Compound pattern / 20 props thay vì Compound                   | User must remember all props, can't customize layout / Phải nhớ hết props, không customize được layout | Split into sub-components / Chia thành sub-components                |

**🎯 Interview Pattern / Mẫu Phỏng Vấn:**

- **Trigger:** "component API design", "flexible component", "design system"
- **Concept:** Compound Components + Context, Inversion of Control, HTML select analogy
- **Opening:**
  - 🇬🇧 _"Compound Components split a component into small parts that share state via Context — like HTML select + option. Users compose the layout themselves, the component only provides behavior. Advantage: flexible, clear API. Trade-off: needs context management, validation when users compose incorrectly."_
  - 🇻🇳 _"Compound Components chia component thành các phần nhỏ share state qua Context — giống HTML select + option. User tự ghép layout, component chỉ cung cấp behavior. Ưu: linh hoạt, API rõ ràng. Đánh đổi: cần quản lý context, validation khi user ghép sai."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 **Prerequisite / Cần biết trước**: [Context API](./05-state-management.md), [Component & Props](./01-react-fundamentals.md)
- ➡️ **Enables / Để hiểu tiếp**: [Headless Components](./08-react-patterns-advanced.md), [State Reducer pattern](#4-state-reducer-pattern)

---

### 2. Custom Hooks / Hooks Tùy Chỉnh

> 🧠 **Memory Hook**: "Custom Hook = extract stateful logic into a function prefixed with 'use' — share logic, not share UI."
> "Custom Hook = tách logic có state ra function prefix 'use' — chia sẻ logic, không chia sẻ UI."

**Why does this exist? / Tại sao tồn tại?**

Before Hooks, sharing stateful logic between components required HOC or render props → wrapper hell, prop conflicts. Custom Hooks let you extract logic into a function that can be called in any component.
→ **Why?** Because logic (fetch data, form validation, auth check) is often the same across many components, but the UI differs.
→ **Why?** Because Hooks compose naturally — custom hooks call other hooks, no wrapper added to the component tree.

Trước Hooks, chia sẻ logic có state giữa components phải dùng HOC hoặc render props → wrapper hell, prop xung đột. Custom Hooks cho phép tách logic thành function gọi được trong bất kỳ component nào.
→ **Tại sao?** Vì logic (fetch data, xác thực form, kiểm tra auth) thường giống nhau giữa nhiều component, nhưng UI khác.
→ **Tại sao?** Vì Hooks kết hợp tự nhiên — custom hook gọi hooks khác, không thêm wrapper vào cây component.

#### Layer 1: Simple Analogy / Ví Dụ Liên Tưởng

A Custom Hook is like a **cooking recipe**. Instead of every chef (component) memorizing how to cook pho (fetch + loading + error), you write the recipe (useFetch) once. Every chef uses the same recipe but picks a different bowl (UI) — big bowl, small bowl, ceramic, stainless. Same logic, different presentation.

Custom Hook giống **công thức nấu ăn**. Thay vì mỗi đầu bếp (component) tự nhớ cách nấu phở (fetch + loading + error), bạn viết công thức (useFetch) 1 lần. Mỗi đầu bếp dùng cùng công thức nhưng chọn bát (UI) khác — bát to, bát nhỏ, bát sành, bát inox. Logic giống, giao diện khác.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
  ┌────────────────────────────────────────────────────┐
  │         Custom Hook = Logic Extraction              │
  │                                                     │
  │  BEFORE (duplicated logic):                        │
  │  TRƯỚC (logic lặp lại):                            │
  │  ┌──────────────┐  ┌──────────────┐               │
  │  │ ComponentA   │  │ ComponentB   │  Same logic   │
  │  │ [loading]    │  │ [loading]    │  copy-pasted  │
  │  │ [data]       │  │ [data]       │               │
  │  │ [error]      │  │ [error]      │               │
  │  └──────────────┘  └──────────────┘               │
  │                                                     │
  │  AFTER (extracted to custom hook):                  │
  │  SAU (tách ra custom hook):                        │
  │  ┌──────────────┐                                  │
  │  │ useFetch(url)│  ← Shared logic                 │
  │  └──────┬───────┘                                  │
  │    ┌────┴─────┐                                    │
  │    ▼          ▼                                    │
  │  CompA      CompB     ← Different UI, same logic  │
  └────────────────────────────────────────────────────┘
```

**Design principles for good custom hooks / Nguyên tắc thiết kế custom hook tốt:**

```tsx
// PRINCIPLE 1: Return both state AND actions
// NGUYÊN TẮC 1: Trả về cả state VÀ actions
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  return { value, toggle, setTrue, setFalse }; // object, not array
}

// PRINCIPLE 2: Compose hooks with hooks
// NGUYÊN TẮC 2: Kết hợp hooks với hooks
function useAuth() {
  const { data: user, loading } = useFetch<User>("/api/me");
  const { value: isModalOpen, toggle: toggleModal } = useToggle();
  return { user, loading, isModalOpen, toggleModal };
}

// PRINCIPLE 3: Accept configuration, return interface
// NGUYÊN TẮC 3: Nhận cấu hình, trả về giao diện
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

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Đặc Biệt

- **Each component gets its own instance:** `useToggle()` in ComponentA and ComponentB are 2 separate states — they DON'T share state. / Mỗi component gọi hook = instance riêng — KHÔNG share state.
- **Return object vs array:** Array `[value, setter]` when only 2 values (easy to rename). Object `{ value, toggle }` when > 2 values (clearer). / Array khi chỉ 2 giá trị. Object khi > 2 giá trị.
- **Rules of Hooks still apply:** Custom hooks call hooks inside them → must follow Rules of Hooks (top level, no conditional). / Custom hook gọi hooks → phải tuân Rules of Hooks.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                                                   | Why wrong / Tại sao sai                                                                | Correct / Đúng là                                                                    |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Thinking custom hook shares state between components / Nghĩ custom hook share state | Each component calling the hook = new instance / Mỗi component gọi hook = instance mới | Share state needs Context or state management lib / Share state cần Context hoặc lib |
| No "use" prefix / Không prefix "use"                                                | ESLint won't enforce Rules of Hooks / ESLint không kiểm tra Rules of Hooks             | Always name `useSomething` / Luôn đặt tên `useSomething`                             |
| Returning too many values (10+)                                                     | Hook is doing too much → hard to test, reuse / Hook làm quá nhiều → khó test           | Split into smaller hooks / Tách thành hooks nhỏ hơn                                  |

**🎯 Interview Pattern / Mẫu Phỏng Vấn:**

- **Trigger:** "custom hooks", "share logic", "code reuse in React"
- **Concept:** Extract stateful logic, compose hooks, each instance independent
- **Opening:**
  - 🇬🇧 _"Custom hooks extract stateful logic into a 'use'-prefixed function — sharing logic without sharing UI. Each component calling the hook gets its own separate state. Design principles: return state + actions, compose from other hooks, accept config and return interface."_
  - 🇻🇳 _"Custom hooks tách logic có state ra function prefix 'use' — chia sẻ logic không chia sẻ UI. Mỗi component gọi hook có state riêng. Nguyên tắc: trả về state + actions, kết hợp từ hooks khác, nhận cấu hình trả về giao diện."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 **Prerequisite / Cần biết trước**: [useState, useEffect](./03-hooks-deep-dive.md), [Rules of Hooks](./03-hooks-deep-dive.md)
- ➡️ **Enables / Để hiểu tiếp**: [Hooks Comprehensive](./07-hooks-comprehensive.md), [Testing Custom Hooks](./06-testing.md)

---

### 3. Controlled vs Uncontrolled / Kiểm Soát vs Không Kiểm Soát

> 🧠 **Memory Hook**: "Controlled = parent holds the remote, Uncontrolled = TV has its own buttons — who owns the state?"
> "Controlled = cha giữ remote, Uncontrolled = TV tự có nút bấm — ai sở hữu state?"

**Why does this exist? / Tại sao tồn tại?**

When designing a component, you must decide: where does the state live? If the parent manages it (controlled), the component is flexible but the parent must handle every update. If the component manages itself (uncontrolled), it's easy to use but the parent has less control.
→ **Why?** Because this is a fundamental trade-off in UI design: flexibility vs simplicity. There's no one right answer for every case.
→ **Why?** Because React form inputs introduced this pattern (`<input value={x} onChange={fn}>` vs `<input defaultValue={x} ref={r}>`), and it applies to every stateful component.

Khi thiết kế component, phải quyết định: state nằm ở đâu? Nếu cha quản lý (controlled), component linh hoạt nhưng cha phải xử lý mọi cập nhật. Nếu component tự quản lý (uncontrolled), dùng dễ nhưng cha ít kiểm soát.
→ **Tại sao?** Vì đây là đánh đổi cơ bản trong thiết kế UI: linh hoạt vs đơn giản. Không có đáp án đúng cho mọi trường hợp.
→ **Tại sao?** Vì React form inputs đã giới thiệu pattern này, và nó áp dụng cho mọi stateful component.

#### Layer 1: Simple Analogy / Ví Dụ Liên Tưởng

**Controlled** is like a TV with a remote — you (parent) hold the remote, every time you want to change the channel you press a button (onChange), the TV only shows the channel you choose (value). **Uncontrolled** is like a TV with buttons on the front — the TV manages its own channel, you only know which channel is showing when you look at the screen (ref).

**Controlled** giống TV với remote — bạn (cha) giữ remote, mỗi lần muốn đổi kênh phải bấm nút (onChange), TV chỉ hiện kênh bạn chọn (value). **Uncontrolled** giống TV tự có nút bấm phía trước — TV tự quản lý kênh, bạn chỉ biết kênh nào đang chiếu khi nhìn màn hình (ref).

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
  CONTROLLED:                        UNCONTROLLED:
  Parent owns state                  Component owns state
  Cha giữ state                      Component tự giữ state
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
  Parent → Input (value)             Input manages itself
  Input → Parent (onChange)          Parent reads via ref.current.value
```

**Practical example — Hybrid Accordion / Ví dụ — Accordion hỗ trợ cả 2:**

```tsx
// CONTROLLED — parent decides which panel is open
// CONTROLLED — cha quyết định panel nào mở
<Accordion openIndex={openIndex} onChange={setOpenIndex}>...</Accordion>

// UNCONTROLLED — Accordion manages itself
// UNCONTROLLED — Accordion tự quản lý
<Accordion defaultOpenIndex={0}>...</Accordion>

// HYBRID — component supports both modes
// HYBRID — component hỗ trợ cả 2 chế độ
function Accordion({ openIndex, defaultOpenIndex, onChange, children }) {
  const isControlled = openIndex !== undefined;
  const [internalIndex, setInternalIndex] = useState(defaultOpenIndex ?? null);
  const activeIndex = isControlled ? openIndex : internalIndex;

  const handleChange = (index: number) => {
    if (!isControlled) setInternalIndex(index);
    onChange?.(index); // notify parent regardless of mode
    // thông báo cha bất kể chế độ nào
  };

  return (
    <AccordionContext value={{ activeIndex, onChange: handleChange }}>
      {children}
    </AccordionContext>
  );
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Đặc Biệt

- **Hybrid components** (like the example above) support both modes — industry standard for Design Systems. / Hỗ trợ cả 2 chế độ — tiêu chuẩn cho Design System.
- **React warning "switching controlled to uncontrolled":** If `value` prop changes from defined → undefined, React warns. Always use `value ?? ""` to avoid. / Nếu `value` đổi từ defined → undefined, React cảnh báo. Luôn dùng `value ?? ""`.
- **Performance:** Controlled re-renders the parent on every keystroke (because parent calls setState). Uncontrolled doesn't re-render the parent → good for large forms (React Hook Form uses this). / Controlled re-render cha mỗi phím gõ. Uncontrolled không re-render cha → tốt cho form lớn.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                                         | Why wrong / Tại sao sai                                                                               | Correct / Đúng là                                           |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Mixing controlled + uncontrolled / Trộn cả 2 cùng lúc                     | `value` + `defaultValue` conflict → unpredictable / Xung đột → không dự đoán được                     | Choose one: `value+onChange` OR `defaultValue+ref` / Chọn 1 |
| `value={undefined}` then `value={string}`                                 | React switches from uncontrolled → controlled → warning / Chuyển uncontrolled → controlled → cảnh báo | Use `value ?? ""` to stay controlled / Dùng `value ?? ""`   |
| All inputs controlled in large form / Mọi input controlled trong form lớn | Every keystroke re-renders entire form → lag / Mỗi phím gõ re-render cả form → lag                    | Use uncontrolled (React Hook Form) for > 20 fields          |

**🎯 Interview Pattern / Mẫu Phỏng Vấn:**

- **Trigger:** "controlled vs uncontrolled", "form handling", "component state ownership"
- **Concept:** Who owns state? Flexibility vs simplicity trade-off, hybrid pattern
- **Opening:**
  - 🇬🇧 _"A controlled component receives state from the parent via props — the parent owns and fully controls it. An uncontrolled component manages its own internal state — the parent reads via ref. Industry practice is hybrid: support both modes, detect controlled when the value prop is defined."_
  - 🇻🇳 _"Controlled component nhận state từ cha qua props — cha sở hữu và kiểm soát hoàn toàn. Uncontrolled tự quản lý state bên trong — cha đọc qua ref. Thực tế là hybrid: hỗ trợ cả 2, phát hiện controlled khi value prop tồn tại."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 **Prerequisite / Cần biết trước**: [useState](./03-hooks-deep-dive.md), [Component & Props](./01-react-fundamentals.md)
- ➡️ **Enables / Để hiểu tiếp**: [State Reducer pattern](#4-state-reducer-pattern), [Form Libraries](./05-state-management.md)

---

### 4. State Reducer Pattern / Đảo Ngược Quyền Kiểm Soát State

> 🧠 **Memory Hook**: "State Reducer = user overrides the component's reducer — inversion of control for state transitions."
> "State Reducer = user ghi đè reducer của component — đảo ngược quyền kiểm soát cho chuyển đổi state."

**Why does this exist? / Tại sao tồn tại?**

Sometimes users need to customize not just the UI but the BEHAVIOR. Example: a Dropdown closes by default after selecting an item, but a multi-select needs to stay open. Compound Components customize UI, State Reducer customizes behavior.
→ **Why?** Because the component author can't predict every behavior variation. Instead of adding a prop for each variation (`keepOpen`, `closeOnSelect`, `multiSelectBehavior`...), let the user inject a reducer.
→ **Why?** Because this is Inversion of Control at the state transition level — the user decides "when action X happens, how should state change".

Đôi khi user cần tuỳ chỉnh không chỉ UI mà cả HÀNH VI. Ví dụ: Dropdown đóng sau khi chọn item, nhưng multi-select cần giữ mở. Compound Components tuỳ chỉnh UI, State Reducer tuỳ chỉnh hành vi.
→ **Tại sao?** Vì tác giả component không thể đoán mọi biến thể. Thay vì thêm prop cho mỗi biến thể, cho user inject reducer.
→ **Tại sao?** Vì đây là đảo ngược quyền kiểm soát ở mức chuyển đổi state — user quyết định "khi action X xảy ra, state đổi thế nào".

#### Layer 1: Simple Analogy / Ví Dụ Liên Tưởng

Imagine an automatic coffee machine. Default: press "Espresso" → 30ml, "Americano" → 60ml. State Reducer is like being allowed to open the settings panel inside: "When I press Espresso, I want 50ml instead of 30ml, and DON'T auto-shutdown". You override the default behavior without modifying the machine.

Hãy tưởng tượng máy pha cà phê tự động. Mặc định: bấm "Espresso" → 30ml, "Americano" → 60ml. State Reducer giống bạn được mở panel cài đặt: "Khi bấm Espresso, tôi muốn 50ml thay vì 30ml, và KHÔNG tự tắt máy". Bạn ghi đè hành vi mặc định mà không sửa máy.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
  ┌───────────────────────────────────────────────────────┐
  │           State Reducer Pattern Flow                   │
  │                                                        │
  │  1. Action happens (user clicks option)                │
  │     Hành động xảy ra (user click option)               │
  │  2. Create action object { type: "SELECT", value: "a" }│
  │  3. Run THROUGH user reducer first:                    │
  │     Chạy QUA user reducer trước:                      │
  │     newState = userReducer(state, action)              │
  │     ↓ if user returns new state → use it              │
  │     ↓ if user returns undefined → use default          │
  │  4. Apply new state                                    │
  └───────────────────────────────────────────────────────┘
```

```tsx
// Component provides stateReducer prop
// Component cung cấp prop stateReducer
function useSelect({ stateReducer = defaultReducer, ...options }) {
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

  // User reducer WRAPS default reducer
  function reducer(state, action) {
    return stateReducer(state, action, defaultReducer);
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
}

// USER USAGE: Multi-select — keep dropdown open after selection
// SỬ DỤNG: Multi-select — giữ dropdown mở sau khi chọn
function MultiSelect() {
  const { state, dispatch } = useSelect({
    stateReducer: (state, action, defaultReducer) => {
      if (action.type === "SELECT") {
        return { ...state, selectedValue: action.value, isOpen: true }; // stay open!
      }
      return defaultReducer(state, action); // all other actions → default
    },
  });
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Đặc Biệt

- **API complexity:** Users must understand the internal state shape + action types → higher learning curve. Needs clear documentation. / User phải hiểu cấu trúc state + action types → cần document rõ.
- **Breaking changes risk:** If the component changes action type names → user reducer breaks. Need a stable action type API. / Nếu component đổi tên action type → user reducer hỏng. Cần API ổn định.
- **When NOT to use:** If the variation is just 1-2 booleans (keepOpen, disabled), a simple prop is better. / Nếu biến thể chỉ là 1-2 boolean, prop đơn giản hơn.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                                               | Why wrong / Tại sao sai                                                                                               | Correct / Đúng là                                                              |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Exposing internal state shape without docs / Expose state nội bộ không document | User reducer depends on undocumented fields → breaks on refactor / Phụ thuộc field không document → hỏng khi refactor | Document all state fields + action types                                       |
| Not passing defaultReducer to user / Không truyền defaultReducer cho user       | User must copy-paste all logic to change 1 case / Phải copy-paste toàn bộ logic chỉ để đổi 1 case                     | Pass defaultReducer as 3rd parameter / Truyền defaultReducer làm tham số thứ 3 |
| State Reducer for simple variations                                             | Over-engineering — boolean prop is enough / Quá phức tạp — prop boolean đủ                                            | Only when variations are complex + unpredictable / Chỉ khi biến thể phức tạp   |

**🎯 Interview Pattern / Mẫu Phỏng Vấn:**

- **Trigger:** "inversion of control", "customize component behavior", "extensible component"
- **Concept:** State Reducer pattern, user override reducer, defaultReducer fallback
- **Opening:**
  - 🇬🇧 _"The State Reducer pattern lets users override a component's state transitions by injecting a custom reducer. The component runs the user's reducer first, the user decides how each action changes state, with fallback to the default reducer for un-overridden actions. This is Inversion of Control at the behavior level, not just UI."_
  - 🇻🇳 _"State Reducer cho phép user ghi đè chuyển đổi state của component bằng cách inject custom reducer. Component chạy user reducer trước, user quyết định action nào đổi state thế nào, fallback về default reducer cho actions không ghi đè. Đây là đảo ngược quyền kiểm soát ở mức hành vi, không chỉ UI."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 **Prerequisite / Cần biết trước**: [useReducer](./03-hooks-deep-dive.md), [Compound Components](#1-compound-components)
- ➡️ **Enables / Để hiểu tiếp**: [Headless Components](./08-react-patterns-advanced.md), [Downshift/Radix source code]

---

### 5. Higher-Order Components (HOC) / Component Bậc Cao

> 🧠 **Memory Hook**: "HOC = a function that takes a component and returns a NEW component with added capability — decorator pattern for React. LEGACY but still asked in interviews."
> "HOC = function nhận component, trả về component MỚI có thêm khả năng — decorator pattern cho React. CŨ nhưng phỏng vấn vẫn hỏi."

**Why does this exist? / Tại sao tồn tại?**

Before Hooks (React < 16.8), this was the only way to share stateful logic between components. HOC wraps a component in a wrapper and injects props.
→ **Why?** Because class components couldn't share logic via function calls — had to use composition at the component level.
→ **Why?** Mostly replaced by custom hooks now. But interviews ask about it to test whether you know the evolution, and some libraries (React Router v5, Redux connect) still use it.

Trước Hooks (React < 16.8), đây là cách duy nhất chia sẻ logic có state giữa components. HOC bọc component trong wrapper, inject props.
→ **Tại sao?** Vì class component không thể chia sẻ logic bằng function call — phải dùng composition ở cấp component.
→ **Tại sao?** Đã bị custom hooks thay thế phần lớn. Nhưng phỏng vấn hỏi để test bạn biết sự tiến hoá, và một số thư viện vẫn dùng.

#### Layer 1: Simple Analogy / Ví Dụ Liên Tưởng

HOC is like a **phone case** — the phone (component) stays the same, the case adds functionality (auth check, theme, logging). You wrap the case on: `withAuth(ProfilePage)` → ProfilePage now has the ability to check authentication.

HOC giống **ốp lưng điện thoại** — điện thoại (component) giữ nguyên, ốp thêm tính năng (kiểm tra auth, theme, logging). Bạn bọc ốp vào: `withAuth(ProfilePage)` → ProfilePage giờ có thêm khả năng kiểm tra auth.

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
// HOC implementation / Triển khai HOC
function withAuth<P extends object>(WrappedComponent: React.ComponentType<P & { user: User }>) {
  return function WithAuth(props: P) {
    const { user, loading } = useAuth();
    if (loading) return <Spinner />;
    if (!user) return <Navigate to="/login" />;
    return <WrappedComponent {...props} user={user} />;
  };
}

// Usage — call HOC at module level, NOT in render
// Sử dụng — gọi HOC ở cấp module, KHÔNG trong render
const ProtectedProfile = withAuth(ProfilePage);
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Đặc Biệt

- **Wrapper hell:** Multiple nested HOCs: `withAuth(withTheme(withRouter(Component)))` → DevTools shows 4 wrappers. / Nhiều HOC lồng nhau → DevTools hiện 4 wrappers.
- **Props conflict:** If 2 HOCs inject the same prop name → conflict. Custom hooks don't have this issue. / 2 HOC inject cùng tên prop → xung đột.
- **Ref forwarding:** HOC must forwardRef or ref only attaches to the wrapper. / HOC phải forwardRef, không thì ref gắn vào wrapper.
- **Static methods lost:** HOC doesn't auto-copy static methods — needs `hoist-non-react-statics`. / HOC không tự copy static methods.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                                  | Why wrong / Tại sao sai                                                                                                    | Correct / Đúng là                                                |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Writing new HOCs for logic sharing / Viết HOC mới để share logic   | Custom hooks are simpler, no wrapper, no prop conflict / Custom hooks đơn giản hơn                                         | Use custom hooks / Dùng custom hooks                             |
| Calling HOC in render: `<WithAuth(Comp) />` / Gọi HOC trong render | Creates new component type every render → unmount/remount everything / Tạo component type mới mỗi render → unmount/remount | Call at module level: `const E = withAuth(C)` / Gọi ở cấp module |
| Forgetting to forward ref / Quên forward ref                       | ref attaches to wrapper, not original component / ref gắn vào wrapper                                                      | Use React.forwardRef in HOC                                      |

**🎯 Interview Pattern / Mẫu Phỏng Vấn:**

- **Trigger:** "HOC", "higher-order component", "code reuse before hooks"
- **Concept:** Function takes component returns component, decorator pattern, legacy → hooks
- **Opening:**
  - 🇬🇧 _"HOC is a function that takes a component and returns a new component with added capability — the decorator pattern. Popular before hooks for logic sharing. Drawbacks: wrapper hell, prop naming conflicts, DevTools nesting. Today mostly replaced by custom hooks, but Redux connect and some patterns still use HOCs."_
  - 🇻🇳 _"HOC là function nhận component và trả về component mới có thêm khả năng — decorator pattern. Phổ biến trước hooks. Nhược điểm: wrapper hell, xung đột tên prop, DevTools lồng nhau. Ngày nay phần lớn thay bằng custom hooks, nhưng Redux connect vẫn dùng."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 **Prerequisite / Cần biết trước**: [Component & Props](./01-react-fundamentals.md)
- ➡️ **Enables / Để hiểu tiếp**: [Custom Hooks](#2-custom-hooks) (replacement), [Render Props evolution](./08-react-patterns-advanced.md)

---

## Q&A Section / Câu Hỏi Phỏng Vấn

### Q1: What are Compound Components? Give an example. / Compound Components là gì? Cho ví dụ. 🟢 Junior

**A:**

🇬🇧 Compound Components are a pattern where a parent component shares implicit state with its children through Context, and children compose the UI. Like HTML `<select>` + `<option>` — `<select>` holds state, `<option>` renders choices, users arrange them freely.

🇻🇳 Compound Components là pattern mà component cha chia sẻ state ngầm cho con qua Context, và con tự ghép UI. Giống HTML `<select>` + `<option>` — `<select>` giữ state, `<option>` hiển thị lựa chọn, user tự sắp xếp.

**💡 Interview Signal / Dấu hiệu trả lời tốt:**

- ✅ Strong: Mentions Context for state sharing, gives select/tabs example, knows how it differs from render props / Đề cập Context, cho ví dụ, biết khác render props
- ❌ Weak: Only says "component with child components" — missing implicit state sharing / Chỉ nói "component có con" — thiếu implicit state sharing

---

### Q2: How is a custom hook different from a regular function? / Custom hook khác gì regular function? 🟢 Junior

**A:**

🇬🇧 A custom hook can call other hooks (useState, useEffect, etc.) inside it — a regular function cannot. Custom hooks must be prefixed with "use" so React's ESLint plugin enforces the Rules of Hooks. Each component calling the hook gets its own independent state — hooks don't share state between components.

🇻🇳 Custom hook gọi được hooks khác (useState, useEffect) bên trong — regular function thì không. Phải prefix "use" để ESLint kiểm tra Rules of Hooks. Mỗi component gọi hook có state riêng biệt — KHÔNG chia sẻ state giữa các component.

**💡 Interview Signal / Dấu hiệu trả lời tốt:**

- ✅ Strong: Knows each instance has separate state, knows ESLint "use" prefix enforcement / Biết mỗi instance có state riêng, biết ESLint kiểm tra prefix
- ❌ Weak: "Same as regular function plus use prefix" — missing Rules of Hooks context / Thiếu ngữ cảnh Rules of Hooks

---

### Q3: Controlled vs Uncontrolled — when to use which? / Controlled vs Uncontrolled — khi nào dùng cái nào? 🟡 Mid

**A:**

🇬🇧 Use **Controlled** when you need: validation on every keystroke, conditional logic based on input, or synchronized state across multiple inputs. Use **Uncontrolled** when: performance matters (large forms — React Hook Form approach), simple forms without complex validation, or integrating with non-React code. Best practice for libraries: support BOTH modes (hybrid) — detect controlled when `value` prop is defined.

🇻🇳 Dùng **Controlled** khi cần: xác thực mỗi phím gõ, logic phụ thuộc input, đồng bộ nhiều input. Dùng **Uncontrolled** khi: cần hiệu suất (form lớn, React Hook Form dùng cách này), form đơn giản. Best practice cho thư viện: hỗ trợ CẢ HAI (hybrid) — phát hiện controlled khi `value` prop tồn tại.

**💡 Interview Signal / Dấu hiệu trả lời tốt:**

- ✅ Strong: Knows performance trade-off (controlled re-renders per keystroke), mentions hybrid pattern, React Hook Form / Biết trade-off hiệu suất, đề cập hybrid
- ❌ Weak: "Controlled is better than uncontrolled" — binary thinking, doesn't understand trade-off / Tư duy nhị nguyên, không hiểu đánh đổi

---

### Q4: HOC vs Custom Hooks — why did hooks win? / HOC vs Custom Hooks — tại sao hooks thắng? 🟡 Mid

**A:**

🇬🇧 Hooks won because they solve HOC's three fundamental problems: (1) **Wrapper hell** — HOCs nest components, hooks compose flatly; (2) **Prop naming conflicts** — two HOCs can inject the same-named prop, hooks return values you name yourself; (3) **Indirection** — tracing where a prop comes from through 3 HOC wrappers is hard, hook calls are explicit. Plus, hooks don't add nodes to the component tree.

🇻🇳 Hooks thắng vì giải 3 vấn đề của HOC: (1) **Wrapper hell** — HOC lồng component, hooks kết hợp phẳng; (2) **Xung đột tên prop** — 2 HOC inject cùng tên, hooks return giá trị bạn tự đặt tên; (3) **Gián tiếp** — trace prop qua 3 HOC wrappers khó, hook call rõ ràng. Thêm nữa, hooks không thêm node vào cây component.

**💡 Interview Signal / Dấu hiệu trả lời tốt:**

- ✅ Strong: Names 3 specific problems, gives `withAuth(withTheme(withRouter(C)))` example, knows HOC still used (Redux connect) / Nêu 3 vấn đề cụ thể, cho ví dụ, biết HOC vẫn dùng
- ❌ Weak: "Hooks are newer so they're better" — no technical reasoning / Không giải thích lý do kỹ thuật

---

### Q5: Design a component API for a Tabs component in a Design System. / Thiết kế component API cho Tabs trong Design System. 🔴 Senior

**A:**

🇬🇧 I would use the Compound Components pattern with hybrid controlled/uncontrolled support:

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
</Tabs>

// Controlled mode
<Tabs value={activeTab} onValueChange={setActiveTab}>...</Tabs>
```

**Design decisions:** Compound Components for flexible layout, hybrid controlled/uncontrolled, accessibility built-in (ARIA roles, keyboard navigation), Context for state sharing, lazy rendering option (`forceMount`).

🇻🇳 Dùng Compound Components + hybrid controlled/uncontrolled. Accessibility tích hợp sẵn (ARIA roles, điều hướng bàn phím). Context chia sẻ state. Tuỳ chọn render chậm (lazy) hoặc luôn mount (`forceMount`).

**💡 Interview Signal / Dấu hiệu trả lời tốt:**

- ✅ Strong: Compound pattern, hybrid mode, accessibility, lazy vs forceMount, TypeScript generics
- ❌ Weak: Single component with 15 props, no accessibility consideration / 1 component 15 props, không nghĩ tới accessibility

**🔴 Follow-up Chain:**

1. "How to handle keyboard navigation for Tabs?" → Arrow Left/Right moves focus between Triggers, Home/End jumps to first/last, Enter/Space activates. useFocusManager hook manages focus ring. / Arrow Left/Right di chuyển focus, Home/End nhảy đầu/cuối, Enter/Space kích hoạt.
2. "If tab content loads async, how does the API change?" → `<Tabs.Content>` accepts children or render prop. Combine with Suspense: `<Suspense fallback={<Skeleton />}>` inside Content. / Kết hợp với Suspense bên trong Content.
3. "Compare this API with Radix UI Tabs." → Radix uses a similar pattern: Compound + controlled/uncontrolled + asChild pattern (render as different element). Adds `activationMode="manual"` for tabs that only activate on Enter, not on focus. / Radix dùng pattern tương tự + asChild + activationMode.

---

### Q6: What does the State Reducer pattern solve? Compare with render props. / State Reducer giải quyết gì? So sánh với render props. 🔴 Senior

**A:**

🇬🇧 State Reducer gives users control over **state transitions** (behavior), while Render Props gives control over **rendering** (UI). They solve different aspects of Inversion of Control:

| Aspect        | State Reducer                                              | Render Props                              |
| ------------- | ---------------------------------------------------------- | ----------------------------------------- |
| Controls      | Behavior (state transitions)                               | Presentation (UI output)                  |
| User provides | Custom reducer function                                    | Custom render function                    |
| Typical use   | Override default actions (multi-select, custom validation) | Custom item rendering, layout flexibility |
| Complexity    | Higher (user needs internal state knowledge)               | Lower (user just returns JSX)             |

🇻🇳 State Reducer kiểm soát **hành vi** (chuyển đổi state), Render Props kiểm soát **UI** (kết quả render). Compound Components + State Reducer = kiểm soát CẢ HAI. Dùng State Reducer khi biến thể là hành vi (multi-select giữ mở, validation tuỳ chỉnh), không phải UI.

**💡 Interview Signal / Dấu hiệu trả lời tốt:**

- ✅ Strong: Distinguishes behavior vs UI control, knows when to use which, mentions Downshift (library using both) / Phân biệt behavior vs UI, biết khi nào dùng, đề cập Downshift
- ❌ Weak: Confuses the two patterns or only knows one / Nhầm lẫn 2 pattern hoặc chỉ biết 1

**🔴 Follow-up Chain:**

1. "When does State Reducer become over-engineering?" → When the variation is just 1-2 boolean flags. Rule: if you can express it with `if (multiSelect) {...}`, you don't need State Reducer. / Khi biến thể chỉ là 1-2 boolean.
2. "How to document action types for users?" → TypeScript discriminated unions for action types + JSDoc. Storybook stories for each behavior variation. / TypeScript discriminated union + JSDoc + Storybook story.
3. "What patterns does Radix UI use?" → Radix uses Compound Components + controlled/uncontrolled. Less State Reducer directly — instead exposes event handlers (onOpenChange, onValueChange) that users can prevent default. / Radix dùng Compound + controlled/uncontrolled + event handlers.

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| #   | Question                        | Level | Key Point EN                                | Key Point VI                               |
| --- | ------------------------------- | ----- | ------------------------------------------- | ------------------------------------------ |
| Q1  | Compound Components             | 🟢    | Context state sharing, like select+option   | Context share state, giống select+option   |
| Q2  | Custom hook vs regular function | 🟢    | Can call hooks, "use" prefix, own state     | Gọi hooks, prefix "use", state riêng       |
| Q3  | Controlled vs Uncontrolled      | 🟡    | State ownership trade-off, hybrid pattern   | Đánh đổi sở hữu state, hybrid pattern      |
| Q4  | HOC vs Custom Hooks             | 🟡    | Wrapper hell, prop conflict solved by hooks | Wrapper hell, xung đột prop giải bởi hooks |
| Q5  | Design Tabs API                 | 🔴    | Compound + hybrid + a11y + TypeScript       | Compound + hybrid + a11y + TypeScript      |
| Q6  | State Reducer vs Render Props   | 🔴    | Behavior control vs UI control              | Kiểm soát hành vi vs kiểm soát UI          |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn Bất Ngờ

> 🎯 Interviewer asks cold: **"Design a component API for a Dropdown/Select in a Design System — requirements: flexible, accessible, and maintainable."**
> 🎯 Interviewer hỏi bất ngờ: **"Thiết kế component API cho Dropdown/Select trong Design System — yêu cầu linh hoạt, accessible, và dễ bảo trì."**

**Ideal 30-second opening / 30 giây đầu — mở đầu lý tưởng:**

🇬🇧

1. "I'd use the Compound Components pattern — split Select into Trigger, List, Option, each sharing state via Context. Users compose the layout themselves."
2. "Support both controlled (value + onChange) and uncontrolled (defaultValue) mode — detect controlled when the value prop is defined."
3. "In a previous project, we used this pattern for our Design System — accessibility built-in with ARIA roles and keyboard navigation, TypeScript generics for type-safe values."
4. "Trade-off: Context re-renders on state change — fix with split context or memoized value."

🇻🇳

1. "Tôi sẽ dùng Compound Components — tách Select thành Trigger, List, Option, mỗi phần share state qua Context. User tự ghép layout."
2. "Hỗ trợ cả controlled (value + onChange) và uncontrolled (defaultValue) — phát hiện controlled khi value prop tồn tại."
3. "Ở dự án trước, chúng tôi dùng pattern này cho Design System — accessibility tích hợp sẵn với ARIA roles và điều hướng bàn phím."
4. "Đánh đổi: Context re-render khi state đổi — sửa bằng chia context hoặc memo value."

_Then expand based on the interviewer's direction. / Sau đó mở rộng theo hướng interviewer dẫn dắt._

---

## Self-Check / Tự Kiểm Tra ⚡

> **Close the doc before attempting. / Đóng tài liệu lại trước khi làm.**

- [ ] **Retrieval / Nhớ lại**: Write 5 React patterns from memory, each with a one-sentence use case. Compare with Overview. / Viết 5 patterns từ trí nhớ, mỗi cái 1 câu mô tả.
- [ ] **Visual / Trực quan**: Draw the Compound Components architecture (parent + context + children) on paper. Compare with the ASCII diagram. / Vẽ kiến trúc Compound Components ra giấy.
- [ ] **Application / Áp dụng**: Design System needs a `<Dialog>` component — which pattern do you choose? Write an API usage example. / Design System cần `<Dialog>` — chọn pattern nào? Viết ví dụ API.
- [ ] **Debug / Gỡ lỗi**: `<Select.Option>` used outside `<Select>` causes "Cannot read property of null" — cause? Fix? / `<Select.Option>` dùng ngoài `<Select>` gây lỗi — nguyên nhân? Cách sửa?
- [ ] **Teach / Dạy lại**: Explain Controlled vs Uncontrolled to a non-programmer using the "TV with remote vs TV with buttons" analogy. / Giải thích bằng ví dụ "TV có remote vs TV có nút bấm".

💬 **Feynman Prompt:** Explain Compound Components to a non-programmer using the analogy "IKEA self-assembly furniture". No technical terms. / Giải thích Compound Components bằng ví dụ "tủ IKEA tự lắp". Không dùng thuật ngữ kỹ thuật.

🔁 **Spaced Repetition:** Review this file after **3 days → 7 days → 14 days** to transfer to long-term memory. / Ôn lại sau **3 ngày → 7 ngày → 14 ngày**.

---

## Connections / Liên Kết

- ⬅️ **Built on / Xây dựng trên:** [Hooks Deep Dive](./03-hooks-deep-dive.md) — hooks enable custom hooks pattern, useReducer enables state reducer / hooks cho phép custom hooks, useReducer cho phép state reducer
- ⬅️ **Built on / Xây dựng trên:** [React Fundamentals](./01-react-fundamentals.md) — component model, props, children composition / mô hình component, props, children
- ➡️ **Enables / Mở đường cho:** [Advanced Patterns v2](./08-react-patterns-advanced.md) — headless components, prop getters, polymorphic components
- ➡️ **Enables / Mở đường cho:** [State Management](./05-state-management.md) — Context + patterns = state management architecture
- 🔗 **Applied in / Áp dụng trong:** Design Systems (Radix, Headless UI, shadcn/ui), React Hook Form, Downshift
