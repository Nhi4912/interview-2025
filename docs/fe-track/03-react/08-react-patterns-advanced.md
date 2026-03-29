# React Patterns Advanced / Các Pattern React Nâng Cao

| Property / Thuộc tính | Value / Giá trị                                                                   |
| --------------------- | --------------------------------------------------------------------------------- |
| **Track**             | Frontend — React                                                                  |
| **Difficulty**        | 🟡 Mid → 🔴 Senior                                                                |
| **Prerequisites**     | 04-advanced-patterns (Compound Components, Custom Hooks, Controlled/Uncontrolled) |
| **See also**          | 07-hooks-comprehensive, 09-performance-optimization                               |
| **L5 Competencies**   | API Design, System Architecture, Abstraction Design                               |

---

## Real-World Scenario / Tình Huống Thực Tế

🇬🇧 You're building a **Design System** for your company — a set of UI components (Button, Modal, Select, Autocomplete) shared across 5 teams. Each team has different needs: Team A needs a Select that opens upward, Team B needs search filter, Team C needs multi-select, Team D needs custom rendering per option. You can't create 4 separate components. You also can't stuff 50 props into one component. **How do you design one flexible component without making it complex?**

🇻🇳 Bạn đang build **Design System** cho công ty — bộ UI components (Button, Modal, Select, Autocomplete) dùng chung cho 5 team. Mỗi team yêu cầu khác: Team A cần Select mở lên trên, Team B cần search filter, Team C cần multi-select, Team D cần custom rendering mỗi option. Không thể tạo 4 component riêng. Cũng không thể nhét 50 props vào 1 component. **Làm sao thiết kế 1 component linh hoạt mà không phức tạp?**

🇬🇧 This is where **advanced patterns** come in: Render Props, Headless Components, Prop Getters, and State Reducer — techniques to build components **flexible like Lego** while keeping the API clean.

🇻🇳 Đây là lúc **advanced patterns** phát huy: Render Props, Headless Components, Prop Getters, và State Reducer — kỹ thuật giúp build components **linh hoạt như Lego** mà API vẫn clean.

---

**Where you are in the learning path / Bạn đang ở đây trong lộ trình:**

```
04-advanced-patterns (basics) → [PATTERNS ADVANCED] → 09-performance-optimization
```

---

## Concept Map / Bản Đồ Khái Niệm

```
              Advanced React Patterns
                      │
    ┌─────────────────┼─────────────────┐
    │                 │                  │
 Rendering        Logic              Selection
 Delegation       Sharing            Framework
    │                 │                  │
┌───┴────┐     ┌──────┴──────┐    ┌─────┴──────┐
│Render  │     │Control Props│    │ Pattern    │
│Props   │     │Prop Getters │    │ Decision   │
│Headless│     │State Reducer│    │   Tree     │
│Component│    │             │    │            │
└────────┘     └─────────────┘    └────────────┘
    │                 │                  │
    └─────────────────┼──────────────────┘
                      ▼
              "What flexibility do you need?"
              "Bạn cần flexibility nào?"
              → Pick the right pattern
```

---

## Overview / Tổng Quan

🇬🇧 Advanced React patterns solve the **flexibility vs simplicity** trade-off: how to make components powerful enough for diverse use cases while keeping their API simple. File 04 taught basic patterns (Compound Components, Custom Hooks, HOC). This file goes deeper into **patterns for design systems** — when you build components for **other people to use**. The key trade-off: more flexible = more complex API. These patterns help you **increase flexibility without increasing complexity**.

🇻🇳 Advanced React patterns giải quyết trade-off **flexibility vs simplicity** (linh hoạt vs đơn giản): làm sao component đủ mạnh cho nhiều use cases mà API vẫn đơn giản. File 04 dạy patterns cơ bản (Compound Components, Custom Hooks, HOC). File này đi sâu vào **patterns cho design system** — khi bạn build components cho **người khác dùng**. Trade-off chính: càng flexible thì API càng phức tạp. Patterns ở đây giúp **tăng flexibility mà không tăng complexity**.

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. Render Props Pattern / Render Props

> 🧠 **Memory Hook**: "Render Props = a **refrigerated truck** — the truck provides cold storage + GPS + driver, but **what cargo inside** is up to you."
> 🧠 "Render Props = **xe đông lạnh** — xe cung cấp hệ thống lạnh + GPS + tài xế, nhưng **hàng gì bên trong** là do bạn."

**Why does this exist? / Tại sao tồn tại?**

🇬🇧 You want to share **logic** (tracking mouse position, managing dropdown state) but each consumer needs to **render different UI**. The component can't know in advance what UI to render.
→ **Why?** Because separating "what logic" from "how to render" is a core design principle — lets 10 consumers use the same logic but render completely differently.
→ **Why?** Because before hooks, React had no way to share stateful logic other than HOC (wrapper hell) and Render Props.

🇻🇳 Bạn muốn share **logic** (theo dõi vị trí chuột, quản lý dropdown state) nhưng mỗi consumer cần **render UI khác nhau**. Component không thể biết trước cần render gì.
→ **Tại sao?** Vì tách biệt "logic gì" và "render sao" là nguyên tắc thiết kế cốt lõi — cho 10 consumer dùng cùng logic nhưng render hoàn toàn khác.
→ **Tại sao?** Vì trước hooks, React không có cách share stateful logic ngoài HOC (wrapper hell) và Render Props.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

🇬🇧 You rent a **refrigerated truck** for delivery. The truck provides: cold system, GPS, driver. But **what's inside** — you decide. Today ice cream, tomorrow seafood, next day vaccines. The truck doesn't care — it just keeps things cold and drives.

Render Props = refrigerated truck. Component provides **logic + state**, you pass a function telling it **what to render** with that state.

🇻🇳 Bạn thuê **xe đông lạnh** để vận chuyển. Xe cung cấp: hệ thống lạnh, GPS, tài xế. Nhưng **hàng gì bên trong** — bạn quyết định. Hôm nay chở kem, mai chở hải sản, mốt chở vaccine. Xe không quan tâm — nó chỉ giữ lạnh và chở đi.

Render Props = xe đông lạnh. Component cung cấp **logic + state**, bạn pass function cho nó biết **render gì** với state đó.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
// Render Props — Mouse Tracker
interface MouseTrackerProps {
  render: (position: { x: number; y: number }) => React.ReactNode;
}

function MouseTracker({ render }: MouseTrackerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return <>{render(position)}</>; // Consumer decides what to render
}

// Consumer A: Show coordinates / Hiển thị tọa độ
<MouseTracker render={({ x, y }) => <p>Mouse: {x}, {y}</p>} />

// Consumer B: Move avatar with mouse / Di chuyển avatar theo chuột
<MouseTracker render={({ x, y }) => (
  <img src="/avatar.png" style={{ position: "fixed", left: x, top: y }} />
)} />
```

```
Render Props Flow:

  MouseTracker (Logic Owner / Chủ logic)
  ┌──────────────────────┐
  │ state: { x, y }      │
  │ effect: mousemove     │
  │                       │
  │ render({x, y}) ──────────→ Consumer decides UI
  │        ↑              │         │
  │  function from props  │    ┌────┴─────┐
  │                       │    │ <p>x,y</p>│  ← Consumer A
  └──────────────────────┘    │ <img />   │  ← Consumer B
                               └──────────┘
```

🇬🇧 **Render Props vs Custom Hooks (2024+):**

| Criteria    | Render Props                   | Custom Hooks            |
| ----------- | ------------------------------ | ----------------------- |
| Syntax      | Verbose, nested                | Clean, flat             |
| Share logic | Via props                      | Via return value        |
| Share UI    | Yes (render function)          | No (logic only)         |
| Modern?     | Rarely for logic               | Preferred for logic     |
| Use when    | Need to **delegate rendering** | Need to **reuse logic** |

**Conclusion**: Custom hooks replaced render props for **logic sharing**. Render props still useful when component needs to **decide rendering boundary** (e.g., virtualized list render item).

🇻🇳 **Render Props vs Custom Hooks (2024+):**

| Tiêu chí    | Render Props               | Custom Hooks        |
| ----------- | -------------------------- | ------------------- |
| Cú pháp     | Verbose, lồng nhau         | Clean, phẳng        |
| Share logic | Qua props                  | Qua return value    |
| Share UI    | Có (render function)       | Không (chỉ logic)   |
| Hiện đại?   | Ít dùng cho logic          | Ưu tiên cho logic   |
| Dùng khi    | Cần **delegate rendering** | Cần **reuse logic** |

**Kết luận**: Custom hooks thay thế render props cho **logic sharing**. Render props vẫn hữu ích khi component cần **quyết định rendering boundary** (ví dụ: virtualized list render item).

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

🇬🇧 **Performance trap**: Inline render function creates new reference each render → child always re-renders. Fix: extract function or use `useCallback`. **Nesting hell**: Multiple render props nested → hard to read. Custom hooks solve this. **TypeScript**: Typing render functions needs generics — `render: (data: T) => ReactNode`.

🇻🇳 **Performance trap**: Inline render function tạo mới mỗi render → child luôn re-render. Fix: extract function ra ngoài hoặc dùng `useCallback`. **Nesting hell**: Nhiều render props lồng nhau → đọc khó. Custom hooks giải quyết. **TypeScript**: Typing render function cần generic — `render: (data: T) => ReactNode`.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                                   | Why wrong / Tại sao sai                                       | Correct / Đúng là                                               |
| ------------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------- |
| Use render props for all logic sharing / Dùng cho mọi logic sharing | Overkill, custom hooks are simpler / Thừa, hooks đơn giản hơn | Render props only for **rendering delegation**, hooks for logic |
| Inline function causes re-render / Inline function gây re-render    | New function each render / Mỗi render tạo function mới        | Extract to variable or use useCallback                          |
| Forget TypeScript generic / Quên generic                            | Lose type safety / Mất type safety                            | `render: (data: T) => ReactNode`                                |

**🎯 Interview Pattern / Mẫu Phỏng Vấn:**

- 🇬🇧 Opening: _"Render Props separates logic ownership from rendering — the component manages state/logic, the consumer decides UI via a function prop. Today custom hooks replace render props for logic sharing, but render props remain useful for rendering delegation."_
- 🇻🇳 Mở đầu: _"Render Props tách biệt logic và rendering — component quản lý state/logic, consumer quyết định UI qua function prop. Ngày nay hooks thay thế cho logic sharing, nhưng render props vẫn hữu ích cho rendering delegation."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Prerequisite / Cần biết trước: [Advanced Patterns — Custom Hooks](./04-advanced-patterns.md)
- ➡️ Enables / Để hiểu tiếp: [Headless Components](#2-headless-components--component-without-ui--component-không-đầu) — evolution of render props

---

### 2. Headless Components / Component Without UI / Component "Không Đầu"

> 🧠 **Memory Hook**: "Headless Component = a **brain without a face** — all intelligence (logic, state, accessibility) but ZERO UI. Consumer draws the face."
> 🧠 "Headless Component = **não không có mặt** — toàn bộ intelligence (logic, state, accessibility) nhưng ZERO UI. Consumer tự vẽ mặt."

**Why does this exist? / Tại sao tồn tại?**

🇬🇧 Design system components need correct behavior (keyboard navigation, ARIA, focus management) but **each project needs a different look**. Bundling logic + styling → consumer must override CSS → war between library styles and project styles.
→ **Why?** Because styling changes the most between projects, but logic (accessibility, keyboard, state) stays the same.
→ **Why?** Because logic and style are 2 independent concerns. Bundling them = unnecessary coupling.

🇻🇳 Design system components cần hoạt động đúng (keyboard navigation, ARIA, focus management) nhưng **mỗi project cần look khác nhau**. Bundle logic + styling → consumer phải override CSS → war giữa library CSS và project CSS.
→ **Tại sao?** Vì styling thay đổi nhiều nhất giữa các project, nhưng logic (accessibility, keyboard, state) giống nhau.
→ **Tại sao?** Vì logic và style là 2 concerns độc lập. Bundle chúng = coupling không cần thiết.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

🇬🇧 You buy a **robot vacuum**. The robot has: sensors to avoid obstacles, room-mapping algorithm, battery, motor. But the **outer shell** (color, shape) — you can change. Xiaomi robot is white, Dyson is purple, iRobot is grey — same technology inside, completely different outside.

Headless component = robot without a shell. You buy the **"brain + legs"**, design the shell to match your house style. Real libraries: **Headless UI** (Tailwind Labs), **Radix UI**, **React Aria** (Adobe), **Downshift**.

🇻🇳 Bạn mua **robot hút bụi**. Robot có: sensor tránh vật, thuật toán quét phòng, pin, motor. Nhưng **vỏ ngoài** (màu, hình) — bạn thay được. Xiaomi trắng, Dyson tím, iRobot xám — cùng công nghệ bên trong, bên ngoài khác hoàn toàn.

Headless component = robot không vỏ. Bạn mua **"bộ não + chân"**, tự thiết kế vỏ theo phong cách nhà mình. Libraries thực tế: **Headless UI** (Tailwind Labs), **Radix UI**, **React Aria** (Adobe), **Downshift**.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
// Headless Dropdown — logic only, ZERO UI / chỉ logic, ZERO UI
function useDropdown({ items, onSelect }: { items: string[]; onSelect: (item: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Keyboard navigation logic
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((i) => Math.min(i + 1, items.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          if (highlightedIndex >= 0) {
            onSelect(items[highlightedIndex]);
            setIsOpen(false);
          }
          break;
        case "Escape":
          setIsOpen(false);
          break;
      }
    },
    [items, highlightedIndex, onSelect],
  );

  // Prop Getters — return props to attach to any element
  // Prop Getters — trả props để gắn vào element bất kỳ
  const getToggleProps = () => ({
    onClick: () => setIsOpen(!isOpen),
    onKeyDown: handleKeyDown,
    "aria-expanded": isOpen,
    "aria-haspopup": "listbox" as const,
    role: "combobox" as const,
  });

  const getItemProps = (index: number) => ({
    onClick: () => {
      onSelect(items[index]);
      setIsOpen(false);
    },
    role: "option" as const,
    "aria-selected": highlightedIndex === index,
  });

  return { isOpen, highlightedIndex, getToggleProps, getItemProps };
}

// Consumer A — Tailwind styled / Style bằng Tailwind
function FancyDropdown({ items, onSelect }) {
  const { isOpen, getToggleProps, getItemProps } = useDropdown({ items, onSelect });
  return (
    <div className="relative">
      <button {...getToggleProps()} className="px-4 py-2 bg-blue-500 text-white rounded">
        Select item
      </button>
      {isOpen && (
        <ul className="absolute mt-1 bg-white shadow-lg rounded">
          {items.map((item, i) => (
            <li key={item} {...getItemProps(i)} className="px-4 py-2 hover:bg-gray-100">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Consumer B — Material UI styled (same logic, completely different UI)
// Consumer B — Material UI (cùng logic, UI khác hoàn toàn)
```

```
Headless Component Architecture:

  ┌─────────────────────────────────┐
  │     Headless Layer (Brain)       │
  │  ┌───────────┐  ┌────────────┐  │
  │  │   State    │  │ Keyboard   │  │
  │  │ Management │  │ Navigation │  │
  │  └───────────┘  └────────────┘  │
  │  ┌───────────┐  ┌────────────┐  │
  │  │   ARIA     │  │   Focus    │  │
  │  │ Attributes │  │ Management │  │
  │  └───────────┘  └────────────┘  │
  │                                  │
  │  Output: Prop Getters            │
  │  getToggleProps()                │
  │  getItemProps(index)             │
  └──────────┬──────────────────────┘
             │
    ┌────────┴────────┐
    │   Consumer UI    │
    │  (Your styling)  │
    │  Tailwind / MUI  │
    │  / Custom CSS    │
    └─────────────────┘
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

🇬🇧 **Learning curve**: Consumer needs to understand prop getters pattern — `{...getToggleProps()}` is unfamiliar to juniors. **Accessibility completeness**: Must cover ALL ARIA attributes, keyboard navigation, screen reader. Missing one = accessibility fail. **Bundle size**: Consumer imports all logic even if only needing 1 feature.

🇻🇳 **Learning curve**: Consumer cần hiểu prop getters — `{...getToggleProps()}` lạ cho junior. **Accessibility hoàn chỉnh**: Phải cover TẤT CẢ ARIA attributes, keyboard navigation, screen reader. Thiếu 1 cái = accessibility fail. **Bundle size**: Consumer import cả logic dù chỉ cần 1 feature.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                       | Why wrong / Tại sao sai                                 | Correct / Đúng là                           |
| ------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------- |
| Headless component still renders HTML / Vẫn render HTML | Not truly headless / Không thực sự headless             | Return hooks/prop getters, no JSX           |
| Forget ARIA in prop getters / Quên ARIA                 | Accessibility fail, screen reader broken                | Include role, aria-expanded, aria-selected  |
| Consumer doesn't spread all props / Không spread hết    | Loses keyboard handlers or ARIA / Mất handler hoặc ARIA | Always `{...getToggleProps()}` — spread all |

**🎯 Interview Pattern / Mẫu Phỏng Vấn:**

- 🇬🇧 Opening: _"Headless components separate logic (state, keyboard, accessibility) from styling — like selling a 'robot brain' so each team designs their own shell. This solves the biggest problem of UI libraries: style conflicts."_
- 🇻🇳 Mở đầu: _"Headless components tách logic (state, keyboard, accessibility) khỏi styling — giống bán 'bộ não robot' để mỗi team tự thiết kế vỏ. Pattern này giải quyết vấn đề lớn nhất của UI libraries: style conflicts."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Prerequisite / Cần biết trước: [Custom Hooks](./04-advanced-patterns.md) — headless is built on custom hooks
- ➡️ Enables / Để hiểu tiếp: [Prop Getters](#3-prop-getters--bundled-props--trả-props-theo-gói) — output mechanism of headless components

---

### 3. Prop Getters / Bundled Props / Trả Props Theo Gói

> 🧠 **Memory Hook**: "Prop Getters = a **restaurant place setting** — the restaurant doesn't hand you spoon, chopsticks, napkin separately. One complete set, just place on table."
> 🧠 "Prop Getters = **bộ đồ ăn nhà hàng** — nhà hàng không đưa từng thìa, đũa, khăn riêng. Đưa 1 bộ đầy đủ, khách chỉ cần đặt lên bàn."

**Why does this exist? / Tại sao tồn tại?**

🇬🇧 Headless components need to pass **many props at once** to an element (onClick, onKeyDown, role, aria-expanded, tabIndex...). Returning each prop separately → consumer must attach 8-10 props manually → easy to forget, easy to mess up.
→ **Why?** Because grouping related props into 1 function call reduces surface area for bugs — forgetting 1 prop = accessibility broken.
→ **Why?** Because developer experience: `{...getToggleProps()}` is easier than 10 lines of individual props.

🇻🇳 Headless component cần truyền **nhiều props cùng lúc** cho element (onClick, onKeyDown, role, aria-expanded, tabIndex...). Trả từng prop riêng → consumer phải gắn 8-10 props thủ công → dễ quên, dễ sai.
→ **Tại sao?** Vì nhóm props liên quan thành 1 function call giảm surface area cho bugs — quên 1 prop = accessibility broken.
→ **Tại sao?** Vì developer experience: `{...getToggleProps()}` dễ hơn 10 dòng props riêng lẻ.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

🇬🇧 When traveling, you can pack items individually: toothpaste, brush, towel, shampoo... Or you buy a **"travel kit"** — one bag with everything, just put in your suitcase.

Prop getter = travel kit. One function call returns **all necessary props** for one element. Consumer just spreads `{...}`.

🇻🇳 Khi đi du lịch, bạn pack từng món: kem đánh răng, bàn chải, khăn, dầu gội... Hoặc mua **"travel kit"** — 1 túi chứa tất cả, bỏ vào vali.

Prop getter = travel kit. 1 function call trả **tất cả props cần thiết** cho 1 element. Consumer chỉ cần spread `{...}`.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
// Prop Getter — allows consumer to MERGE their own props
// Prop Getter — cho phép consumer MERGE thêm props riêng
function useToggle(initialState = false) {
  const [isOn, setIsOn] = useState(initialState);

  const getToggleProps = (userProps?: React.ButtonHTMLAttributes<HTMLButtonElement>) => ({
    // Library props (defaults)
    "aria-pressed": isOn,
    role: "switch" as const,

    // User props override (spread AFTER library props)
    ...userProps,

    // Merge handlers — IMPORTANT: call BOTH library AND user handler
    // Merge handlers — QUAN TRỌNG: gọi CẢ library VÀ user handler
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsOn((prev) => !prev); // Library logic
      userProps?.onClick?.(e); // User's additional handler
    },
  });

  return { isOn, getToggleProps };
}

// Consumer — adds className and custom onClick
// Consumer — thêm className và onClick riêng
function MyApp() {
  const { isOn, getToggleProps } = useToggle();
  return (
    <button
      {...getToggleProps({
        className: "my-toggle", // Consumer adds class
        onClick: () => track("toggle_clicked"), // Consumer adds analytics
      })}
    >
      {isOn ? "ON" : "OFF"}
    </button>
    // Result: button has aria-pressed, role="switch", onClick (toggle + analytics), className
  );
}
```

```
Prop Getter Merge Strategy:

  Library Props          User Props
  ┌──────────────┐      ┌──────────────┐
  │ aria-pressed │      │ className    │
  │ onClick (A)  │      │ onClick (B)  │
  │ role         │      │ data-testid  │
  └──────┬───────┘      └──────┬───────┘
         │                     │
         └─────────┬───────────┘
                   ▼
         Merged Props
         ┌──────────────────────┐
         │ aria-pressed (lib)   │
         │ role (lib)           │
         │ className (user)     │
         │ data-testid (user)   │
         │ onClick → A() + B() │ ← handlers MERGED, not replaced
         └──────────────────────┘
```

🇬🇧 **Merge rules:** (1) Non-function props: user overrides library (spread order). (2) Function props (handlers): MERGE — call both. (3) ARIA props: library defaults, user can override if needed.

🇻🇳 **Quy tắc merge:** (1) Props không phải function: user override library (thứ tự spread). (2) Function props (handlers): MERGE — gọi cả 2. (3) ARIA props: library cung cấp mặc định, user override nếu cần.

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

🇬🇧 **Handler merge complexity**: If user's onClick calls `e.preventDefault()`, library handler still runs → document clearly. **TypeScript generics**: Prop getter needs exact return type. **Performance**: Prop getter creates new object each call → need `useMemo` if passing to memoized component.

🇻🇳 **Độ phức tạp merge handler**: Nếu user onClick gọi `e.preventDefault()`, library handler vẫn chạy → document rõ. **TypeScript generics**: Prop getter cần return type chính xác. **Performance**: Prop getter tạo object mới mỗi lần gọi → cần `useMemo` nếu pass vào memoized component.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                            | Why wrong / Tại sao sai                             | Correct / Đúng là                                    |
| ------------------------------------------------------------ | --------------------------------------------------- | ---------------------------------------------------- |
| User spread BEFORE library props / Spread user trước library | Library props get overridden, loses ARIA / Mất ARIA | Library first, user after, merge handlers            |
| Don't merge event handlers / Không merge handlers            | User onClick replaces library onClick               | Call both: `() => { libHandler(); userHandler(); }`  |
| Return too many props / Return quá nhiều                     | Consumer confused, hard to debug / Khó debug        | 1 prop getter per element role (toggle, item, input) |

**🎯 Interview Pattern / Mẫu Phỏng Vấn:**

- 🇬🇧 Opening: _"Prop getters bundle related props into one function call — prevents consumers from forgetting ARIA attributes or event handlers. The most important aspect is handler merging: don't replace, call both library and consumer handlers."_
- 🇻🇳 Mở đầu: _"Prop getters bundle props liên quan vào 1 function call — ngăn consumer quên ARIA hoặc event handlers. Quan trọng nhất là handler merging: không replace mà gọi cả library handler lẫn user handler."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Prerequisite / Cần biết trước: [Headless Components](#2-headless-components--component-without-ui--component-không-đầu) — prop getters are output interface
- ➡️ Enables / Để hiểu tiếp: [State Reducer](#4-state-reducer-pattern--overriding-behavior--pattern-ghi-đè-behavior) — lets consumer override logic

---

### 4. State Reducer Pattern / Overriding Behavior / Pattern Ghi Đè Behavior

> 🧠 **Memory Hook**: "State Reducer = an **amendable constitution** — the component has default laws, but the consumer has the right to **amend any article** via reducer."
> 🧠 "State Reducer = **hiến pháp sửa đổi** — component có luật mặc định, nhưng consumer có quyền **sửa bất kỳ điều nào** qua reducer."

**Why does this exist? / Tại sao tồn tại?**

🇬🇧 Headless + prop getters give consumer control over **UI**. But sometimes consumer needs to control **behavior/logic** — e.g., dropdown closes by default when selecting an item, but consumer wants to keep it open (multi-select).
→ **Why?** Because you can't predict every use case. Adding `keepOpenOnSelect` prop → then `closeOnBlur`, `closeOnEscape`... → prop explosion.
→ **Why?** Because Inversion of Control: instead of library deciding **all behavior**, let consumer override **any state transition** via a reducer function.

🇻🇳 Headless + prop getters cho consumer control **UI**. Nhưng đôi khi consumer cần control **behavior/logic** — ví dụ: dropdown mặc định đóng khi chọn item, nhưng consumer muốn giữ mở (multi-select).
→ **Tại sao?** Vì không thể dự đoán mọi use case. Thêm `keepOpenOnSelect` → rồi `closeOnBlur`, `closeOnEscape`... → prop explosion (bùng nổ props).
→ **Tại sao?** Vì Inversion of Control: thay vì library quyết định **mọi behavior**, để consumer override **bất kỳ state transition nào** qua reducer function.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

🇬🇧 Vietnam's constitution is the basic law. But the National Assembly can **amend articles** when needed. The constitution provides **default behavior**, the Assembly can **override any article**.

State Reducer = giving consumers the power to "amend the constitution" of a component. Component has default behavior, consumer passes `stateReducer` to override any state transition.

🇻🇳 Hiến pháp Việt Nam là luật cơ bản. Nhưng Quốc hội có thể **sửa đổi điều khoản** khi cần. Hiến pháp cung cấp **behavior mặc định**, Quốc hội có thể **override bất kỳ điều nào**.

State Reducer = cho consumer quyền "sửa hiến pháp" của component. Component có default behavior, consumer pass `stateReducer` để override bất kỳ state transition nào.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
// State Reducer Pattern
type ToggleState = { isOn: boolean };
type ToggleAction = { type: "TOGGLE" } | { type: "ON" } | { type: "OFF" };

// Default reducer — default behavior / behavior mặc định
function defaultReducer(state: ToggleState, action: ToggleAction): ToggleState {
  switch (action.type) {
    case "TOGGLE":
      return { isOn: !state.isOn };
    case "ON":
      return { isOn: true };
    case "OFF":
      return { isOn: false };
    default:
      return state;
  }
}

function useToggle({
  initialState = false,
  stateReducer = defaultReducer, // Default if consumer doesn't pass
}: {
  initialState?: boolean;
  stateReducer?: (state: ToggleState, action: ToggleAction) => ToggleState;
} = {}) {
  const [state, dispatch] = useReducer(stateReducer, { isOn: initialState });
  return { ...state, toggle: () => dispatch({ type: "TOGGLE" }) };
}

// Consumer: Limit toggle to max 3 times / Giới hạn toggle tối đa 3 lần
function App() {
  const [clickCount, setClickCount] = useState(0);
  const { isOn, toggle } = useToggle({
    stateReducer: (state, action) => {
      if (action.type === "TOGGLE" && clickCount >= 3) {
        return state; // Block toggle after 3 / Block sau 3 lần
      }
      return defaultReducer(state, action); // Fallback to default
    },
  });

  return (
    <button
      onClick={() => {
        toggle();
        setClickCount((c) => c + 1);
      }}
    >
      {isOn ? "ON" : "OFF"} (clicked {clickCount} times)
    </button>
  );
}
```

```
State Reducer Flow:

  Action dispatched: { type: 'TOGGLE' }
           │
           ▼
  ┌──────────────────────────┐
  │  Consumer's stateReducer  │ ← Consumer can override
  │                           │    Consumer có thể override
  │  if (action.type === 'X') │
  │    return customState;    │ ← Override behavior
  │  else                     │
  │    return defaultReducer  │ ← Fallback to default
  │           (state, action) │
  └────────────┬──────────────┘
               │
               ▼
         New State
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

🇬🇧 **Consumer must know action types**: Document all action types clearly — renaming = breaking change. **Debugging difficulty**: When bug occurs, hard to know if behavior comes from default or consumer's override. **Composability**: Consumer can chain reducers but need to test edge cases.

🇻🇳 **Consumer phải biết action types**: Document rõ — rename action type = breaking change. **Khó debug**: Khi bug xảy ra, khó biết behavior đến từ default hay consumer override. **Composability**: Consumer chain reducers được nhưng cần test kỹ edge cases.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                   | Why wrong / Tại sao sai                                    | Correct / Đúng là                                    |
| --------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------- |
| No fallback to defaultReducer / Không fallback      | Consumer must handle ALL action types / Phải handle TẤT CẢ | `return defaultReducer(state, action)` for unhandled |
| Expose internal state structure / Lộ internal state | Consumer depends on shape → breaking change                | Expose minimal state, abstract implementation        |
| Rename action types / Đổi tên action types          | Breaking change for consumers                              | Action types are public API, version carefully       |

**🎯 Interview Pattern / Mẫu Phỏng Vấn:**

- 🇬🇧 Opening: _"State Reducer gives consumers the power to override any state transition without the library adding props. It solves 'prop explosion' — instead of 50 boolean props, one reducer function handles all customization."_
- 🇻🇳 Mở đầu: _"State Reducer cho consumer quyền override bất kỳ state transition nào mà không cần library thêm props. Giải quyết 'prop explosion' — thay 50 boolean props bằng 1 reducer function."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Prerequisite / Cần biết trước: [useReducer](./03-hooks-deep-dive.md) — understand reducer pattern
- ➡️ Enables / Để hiểu tiếp: Design System Architecture — combine all patterns

---

### 5. Pattern Selection Framework / How to Choose / Hướng Dẫn Chọn Pattern

> 🧠 **Memory Hook**: "Choosing a pattern = choosing **transportation** — walk (props), bike (custom hook), car (compound), airplane (headless). Don't fly a plane to buy a loaf of bread."
> 🧠 "Chọn pattern = chọn **phương tiện** — đi bộ (props), xe đạp (custom hook), ô tô (compound), máy bay (headless). Đừng bay máy bay đi mua ổ bánh mì."

**Why does this exist? / Tại sao tồn tại?**

🇬🇧 Knowing many patterns but **using them in the wrong context** is worse than not knowing. Over-engineering (headless for a simple button) creates unnecessary complexity.
→ **Why?** Because each pattern has **trade-offs**: more flexibility = more complexity. The most expensive pattern (headless + state reducer + prop getters) is only needed for shared libraries.
→ **Why?** Because premature abstraction is the root of technical debt — abstracting too early = locking into the wrong abstraction.

🇻🇳 Biết nhiều patterns nhưng **dùng sai context** còn tệ hơn không biết. Over-engineering (headless cho 1 button đơn giản) tạo complexity thừa.
→ **Tại sao?** Vì mỗi pattern có **trade-off**: flexibility tăng thì complexity tăng. Pattern đắt nhất chỉ cần cho shared libraries.
→ **Tại sao?** Vì premature abstraction (trừu tượng hóa sớm) là nguồn technical debt — abstract quá sớm = lock vào abstraction sai.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
Pattern Selection Decision Tree:

  Where is the component used? / Component dùng ở đâu?
  │
  ├── 1 project, 1-2 places
  │   └── Props + children is enough (walk / đi bộ)
  │
  ├── 1 project, many places
  │   └── Custom Hook (bike / xe đạp)
  │
  ├── 1 project, needs shared UI structure
  │   └── Compound Components (car / ô tô)
  │
  ├── Multi-project / Design System
  │   ├── Need flexible styling?
  │   │   └── Headless + Prop Getters (airplane / máy bay)
  │   └── Need flexible behavior?
  │       └── + State Reducer (airplane + first class)
  │
  └── Open source library
      └── Headless + State Reducer + Prop Getters (full combo)
```

**Pattern Complexity vs Flexibility Matrix:**

| Pattern                 | Complexity | Flexibility | Best For                                 |
| ----------------------- | ---------- | ----------- | ---------------------------------------- |
| Props drilling          | ⭐         | ⭐          | Simple, 1-2 levels deep / Đơn giản       |
| Custom Hook             | ⭐⭐       | ⭐⭐        | Logic reuse, same project / Cùng project |
| Compound Components     | ⭐⭐⭐     | ⭐⭐⭐      | Related UI, shared state / UI liên quan  |
| Render Props            | ⭐⭐⭐     | ⭐⭐⭐⭐    | Delegate rendering / Ủy quyền render     |
| Headless + Prop Getters | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐  | Design systems, multi-project            |
| + State Reducer         | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐  | Open source libs, max flexibility        |

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

🇬🇧 **Rule of Three**: Don't abstract until you see the **same pattern repeat 3 times**. 1st = code directly. 2nd = note similarity. 3rd = extract. **Wrong abstraction > no abstraction**: Wrong pattern creates coupling hard to undo. Better to duplicate code than wrong abstraction (Sandi Metz). **Team familiarity**: Complex patterns need team understanding. Junior-only team → compound components + custom hooks is enough.

🇻🇳 **Rule of Three**: Không abstract cho đến khi **cùng pattern lặp 3 lần**. Lần 1 = code trực tiếp. Lần 2 = ghi nhận giống. Lần 3 = extract. **Wrong abstraction > no abstraction**: Pattern sai tạo coupling khó gỡ. Thà duplicate code hơn sai abstraction (Sandi Metz). **Team familiarity**: Pattern phức tạp cần team hiểu. Team toàn junior → compound + custom hooks là đủ.

**❌ Common Mistakes / Sai lầm thường gặp:**

| Mistake / Sai lầm                                         | Why wrong / Tại sao sai                               | Correct / Đúng là                      |
| --------------------------------------------------------- | ----------------------------------------------------- | -------------------------------------- |
| Headless for internal button / Headless cho button nội bộ | Over-engineering / Thừa                               | Props + children is enough             |
| Abstract on first use / Abstract ngay lần đầu             | Don't know right pattern yet / Chưa biết pattern đúng | Rule of Three — wait for 3 repetitions |
| Choose pattern because "cool" / Chọn vì "cool"            | Complexity doesn't match benefit                      | Choose by decision tree above          |

**🎯 Interview Pattern / Mẫu Phỏng Vấn:**

- 🇬🇧 Opening: _"I choose patterns by scope: single-use → props, same-project reuse → custom hooks, shared UI → compound components, cross-project → headless + prop getters. Rule: don't abstract before seeing the pattern repeat 3 times — wrong abstraction is worse than duplication."_
- 🇻🇳 Mở đầu: _"Tôi chọn pattern theo scope: dùng 1 lần → props, reuse trong project → custom hooks, share UI → compound components, cross-project → headless + prop getters. Nguyên tắc: không abstract trước khi lặp 3 lần — sai abstraction tệ hơn duplication."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Prerequisite / Cần biết trước: All patterns above / Tất cả patterns ở trên
- ➡️ Enables / Để hiểu tiếp: [Performance Optimization](./09-performance-optimization.md) — patterns affect performance

---

## Q&A Section / Câu Hỏi Phỏng Vấn

### Q1: What is Render Props and when would you still use it in 2024? / Render Props là gì và khi nào vẫn dùng trong 2024? 🟢 Junior

**A:**

🇬🇧 Render Props is a pattern where a component receives a **function as a prop** that tells it what to render, allowing it to share internal state/logic while the consumer decides the UI. In 2024, custom hooks replaced render props for **logic sharing**. Render props are still used when you need to **delegate rendering decisions** — like virtualized lists (`react-window`'s children function that receives row index and style).

🇻🇳 Render Props là pattern mà component nhận **function qua props** để biết render gì, cho phép share state/logic bên trong trong khi consumer quyết định UI. Năm 2024, custom hooks đã thay thế render props cho **logic sharing**. Render props vẫn dùng khi cần **ủy quyền rendering** — ví dụ virtualized list (`react-window` dùng children function nhận row index và style).

**💡 Interview Signal:**

- ✅ Strong: Distinguishes "render props for rendering delegation" vs "hooks for logic", gives 2024 examples
- ❌ Weak: "Render props shares logic" without mentioning hooks replaced most use cases

---

### Q2: Headless Component vs regular component library? / Khác biệt giữa Headless và library thường? 🟢 Junior

**A:**

🇬🇧 A regular library (Material UI, Ant Design) bundles **logic + styling** — fast to use but customizing means fighting their CSS. A headless library (Radix, Headless UI, React Aria) provides **only logic** — you provide all styling. Zero CSS conflicts. Trade-off: regular = fast setup but limited customization. Headless = more work upfront but unlimited flexibility.

🇻🇳 Library thường (MUI, Ant Design) đóng gói **logic + UI** — dùng nhanh nhưng customize phải override CSS → war CSS. Headless library (Radix, Headless UI, React Aria) chỉ cho **logic** — bạn tự style 100%, không CSS conflict. Trade-off: thường = setup nhanh nhưng hạn chế customize. Headless = tốn công hơn nhưng flexibility không giới hạn.

**💡 Interview Signal:**

- ✅ Strong: Clear trade-off (speed vs flexibility), names specific libraries of both types
- ❌ Weak: "Headless has no UI" without explaining **why** that's desirable

---

### Q3: Explain Prop Getters — why merge handlers instead of replacing? / Tại sao merge handlers thay vì replace? 🟡 Mid

**A:**

🇬🇧 Prop Getters bundle related props (ARIA, event handlers, roles) into one function call. Consumer spreads: `{...getToggleProps()}`. **Why merge instead of replace?** If consumer's `onClick` replaces library's, the component breaks — it loses state update logic. Merging ensures **both** handlers run: library logic preserved, consumer logic added.

🇻🇳 Prop Getters bundle props liên quan (ARIA, event handlers, roles) vào 1 function call. Consumer spread: `{...getToggleProps()}`. **Tại sao merge thay vì replace?** Nếu consumer onClick replace library onClick, component hỏng — mất logic toggle. Merge đảm bảo **cả 2 đều chạy**: library logic giữ nguyên, consumer logic thêm vào.

```tsx
onClick: (e) => {
  libraryToggle(); // Component logic preserved / Logic component giữ nguyên
  userProps?.onClick?.(e); // Consumer logic added / Logic consumer thêm vào
};
```

**💡 Interview Signal:**

- ✅ Strong: Explains merge mechanism, shows scenario where replace causes bugs, knows merge order matters
- ❌ Weak: "Prop getters return props" without explaining merge strategy

---

### Q4: How does State Reducer solve prop explosion? / State Reducer giải quyết prop explosion thế nào? 🟡 Mid

**A:**

🇬🇧 Without State Reducer, every behavior customization needs a new prop: `closeOnSelect`, `closeOnBlur`, `keepOpenOnEscape`, `maxSelections`... → **prop explosion**: dozens of boolean props that interact in complex ways. State Reducer replaces ALL these with **one function**: consumer passes a `stateReducer` that intercepts any state transition. Instead of 20 boolean props → 1 reducer function.

🇻🇳 Không có State Reducer, mỗi customization = 1 prop mới. 20 customizations = 20 props có thể conflict nhau (`closeOnSelect` + `keepOpen` = ???). State Reducer thay toàn bộ bằng **1 function** — consumer override **bất kỳ state transition nào** mà library không cần thêm props.

```tsx
// Prop explosion — 😰
<Dropdown closeOnSelect closeOnBlur={false} keepOpenOnEscape maxSelections={3} />

// State Reducer — 😊
<Dropdown stateReducer={(state, action) => {
  if (action.type === "SELECT" && state.selections.length >= 3) return state;
  return defaultReducer(state, action);
}} />
```

**💡 Interview Signal:**

- ✅ Strong: Compares prop explosion vs reducer concretely, shows conflict between boolean props
- ❌ Weak: "State Reducer is more flexible" without explaining **mechanism**

---

### Q5: Design a headless Autocomplete for a design system. / Thiết kế Autocomplete headless cho design system. 🔴 Senior

**A:**

```tsx
function useAutocomplete<T>({
  items,
  itemToString,
  onSelect,
  filterFn = defaultFilter,
  stateReducer = defaultReducer,
}: {
  items: T[];
  itemToString: (item: T) => string;
  onSelect: (item: T) => void;
  filterFn?: (items: T[], query: string) => T[];
  stateReducer?: (state: State, action: Action) => State;
}) {
  const [state, dispatch] = useReducer(stateReducer, initialState);
  const filteredItems = useMemo(() => filterFn(items, state.query), [items, state.query, filterFn]);

  const getInputProps = (userProps?) => ({
    value: state.query,
    onChange: (e) => {
      dispatch({ type: "INPUT_CHANGE", payload: e.target.value });
      userProps?.onChange?.(e);
    },
    onKeyDown: (e) => {
      handleKeyDown(e);
      userProps?.onKeyDown?.(e);
    },
    role: "combobox",
    "aria-expanded": state.isOpen,
    "aria-autocomplete": "list",
    ...userProps,
  });

  const getItemProps = (index) => ({
    id: `option-${index}`,
    role: "option",
    "aria-selected": state.highlightedIndex === index,
    onClick: () => {
      onSelect(filteredItems[index]);
      dispatch({ type: "SELECT" });
    },
  });

  return {
    ...state,
    filteredItems,
    getInputProps,
    getMenuProps: () => ({ role: "listbox" }),
    getItemProps,
  };
}
```

🇬🇧 **Architecture decisions:** (1) **Generic `<T>`**: Works with any data type. (2) **`itemToString`**: Decouples display logic. (3) **`filterFn` customizable**: Default = includes(), consumer can do fuzzy search. (4) **State Reducer**: Override any behavior. (5) **ARIA complete**: combobox, listbox, option, aria-activedescendant. (6) **Prop Getters with merge**: Handler merging for events.

🇻🇳 **Quyết định thiết kế:** (1) **Generic `<T>`**: Hoạt động với bất kỳ type nào. (2) **`itemToString`**: Tách display logic. (3) **`filterFn` tùy chỉnh**: Default = includes(), consumer có thể fuzzy search. (4) **State Reducer**: Override bất kỳ behavior. (5) **ARIA đầy đủ**: combobox, listbox, option. (6) **Prop Getters merge**: Merge handlers cho events.

**💡 Interview Signal:**

- ✅ Strong: Generics, ARIA, prop getters with merge, state reducer, customizable filter
- ❌ Weak: Shows component with styling without separating logic from UI

**🔗 Follow-up Chain:**

1. "How to handle async search (API call)?" → `filterFn` returns Promise, add loading state, debounce input
2. "Multi-select support?" → State reducer override SELECT to accumulate, change to selectedItems array
3. "Accessibility testing?" → axe-core, keyboard navigation test, screen reader manual test

---

### Q6: Compare all advanced patterns — when to use each? / So sánh tất cả patterns — khi nào dùng? 🔴 Senior

**A:**

🇬🇧 Pattern selection follows **scope and flexibility requirements**:

| Scenario                       | Pattern                                 | Why                             |
| ------------------------------ | --------------------------------------- | ------------------------------- |
| Button with 3 variants         | Props + children                        | Simple, no abstraction          |
| Form validation across 5 forms | Custom Hook                             | Logic reuse, no UI sharing      |
| Tabs (Tab + TabPanel)          | Compound Components                     | Related UI, shared state        |
| Dropdown in Design System      | Headless + Prop Getters                 | Multi-project, flexible styling |
| Autocomplete for open source   | Headless + State Reducer + Prop Getters | Maximum flexibility             |

**Principles:** Rule of Three (don't abstract until 3 repeats), prefer composition over configuration, wrong abstraction > no abstraction (Sandi Metz), consider team capability.

🇻🇳 Chọn pattern theo **scope và yêu cầu flexibility**:

| Tình huống               | Pattern                                 | Lý do                           |
| ------------------------ | --------------------------------------- | ------------------------------- |
| Button 3 variants        | Props + children                        | Đơn giản, không cần abstraction |
| Validation 5 forms       | Custom Hook                             | Reuse logic, không share UI     |
| Tabs (Tab + TabPanel)    | Compound Components                     | UI liên quan, shared state      |
| Dropdown Design System   | Headless + Prop Getters                 | Multi-project, flexible styling |
| Autocomplete open source | Headless + State Reducer + Prop Getters | Flexibility tối đa              |

**Nguyên tắc:** Rule of Three (đợi lặp 3 lần mới abstract), ưu tiên composition hơn configuration, sai abstraction tệ hơn duplicate (Sandi Metz), xét khả năng team.

🇬🇧 In a real project, 80% of components only need props + children. 15% need custom hooks. 5% need compound/headless. **Don't use headless for every button** — that's over-engineering.

🇻🇳 Trong project thực, 80% components chỉ cần props + children. 15% cần custom hooks. 5% cần compound/headless. **Đừng dùng headless cho mọi button** — đó là over-engineering.

**💡 Interview Signal:**

- ✅ Strong: Clear selection framework, cites Rule of Three, knows when NOT to use complex patterns
- ❌ Weak: Lists patterns without criteria, or recommends headless for everything

**🔗 Follow-up Chain:**

1. "How to introduce patterns to a junior team?" → Start with custom hooks, compound after comfort, delay headless
2. "When to extract component into a library?" → 3+ teams need it, stable API, invest in docs + tests
3. "Migration from monolithic to headless?" → Incremental: extract hook, add prop getters, deprecate old API

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| #   | Question                        | Level | Key Point                                                     |
| --- | ------------------------------- | ----- | ------------------------------------------------------------- |
| Q1  | Render Props in 2024            | 🟢    | Hooks for logic, render props for rendering delegation        |
| Q2  | Headless vs regular library     | 🟢    | Logic only vs logic+styling, speed vs flexibility             |
| Q3  | Prop Getters merge              | 🟡    | Merge handlers to preserve both library + consumer logic      |
| Q4  | State Reducer vs prop explosion | 🟡    | 1 reducer function replaces 20+ boolean props                 |
| Q5  | Design headless Autocomplete    | 🔴    | Generics, ARIA, prop getters, state reducer                   |
| Q6  | Pattern selection framework     | 🔴    | Match scope to pattern, Rule of Three, avoid over-engineering |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn Bất Ngờ

> 🎯 Interviewer asks cold: **"How would you design a reusable component for a design system?"**

**🇬🇧 30-second ideal opening:**

1. "I approach design system components with **headless architecture** — separate logic (state, keyboard, accessibility) from styling so each team styles independently."
2. "The main mechanisms are **prop getters** — bundle related props into function calls, merge event handlers — and **state reducer** for consumer behavior override."
3. "Example: headless Autocomplete — generic type for data, customizable filter, full ARIA, consumer just spreads prop getters and adds styling."
4. "Trade-off: headless is more complex than regular components. I only use this for components serving **multiple teams/projects**. Single-project → custom hooks are enough."

**🇻🇳 30 giây mở đầu lý tưởng:**

1. "Tôi tiếp cận design system bằng **headless architecture** — tách logic (state, keyboard, accessibility) khỏi styling để mỗi team tự style."
2. "Cơ chế chính là **prop getters** — bundle props vào function calls, merge event handlers — và **state reducer** cho consumer override behavior."
3. "Ví dụ: Autocomplete headless — generic type, customizable filter, ARIA đầy đủ, consumer chỉ spread prop getters và thêm styling."
4. "Trade-off: headless phức tạp hơn. Tôi chỉ dùng khi component serve **nhiều team/project**. Single-project → custom hooks đủ."

---

## Self-Check / Tự Kiểm Tra ⚡

> **Close the doc before attempting. / Đóng tài liệu lại trước khi làm.**

- [ ] **Retrieval / Nhớ lại**: Write 5 patterns from memory (render props, headless, prop getters, state reducer, compound). One sentence each. / Viết 5 patterns, mỗi cái 1 câu.
- [ ] **Visual / Hình dung**: Draw Pattern Selection Decision Tree on paper. Compare with diagram. / Vẽ Decision Tree ra giấy.
- [ ] **Application / Áp dụng**: Team needs Dropdown for 3 projects, each different styling. Which pattern? Why? / Team cần Dropdown cho 3 projects, style khác. Pattern nào?
- [ ] **Debug / Gỡ lỗi**: Consumer adds `onClick` to prop getter but component toggle doesn't work — cause? Fix? / Consumer thêm `onClick` nhưng toggle không hoạt động — tại sao?
- [ ] **Teach / Giảng lại**: Explain headless component to a designer using robot vacuum analogy. No code terms. / Giải thích cho designer bằng ví dụ robot hút bụi.

💬 **Feynman Prompt:** Explain prop getters to a junior colleague using the "restaurant place setting" analogy. No code. / Giải thích prop getters cho đồng nghiệp junior bằng "bộ đồ ăn nhà hàng".

🔁 **Spaced Repetition / Ôn tập cách quãng:** Review after **3 days → 7 days → 14 days**. / Ôn lại sau **3 ngày → 7 ngày → 14 ngày**.

---

## Connections / Liên Kết

- ⬅️ **Built on / Dựa trên:** [Advanced Patterns](./04-advanced-patterns.md) — Compound Components, Custom Hooks are the foundation
- ➡️ **Enables / Mở ra:** [Performance Optimization](./09-performance-optimization.md) — patterns affect re-render behavior
- 🔗 **Applied in / Ứng dụng tại:** Design Systems (Radix, Headless UI, React Aria), Open Source Libraries (Downshift, React Table)
