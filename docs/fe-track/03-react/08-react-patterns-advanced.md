# React Patterns Advanced / Các Pattern React Nâng Cao

| Thuộc tính          | Giá trị                                                                           |
| ------------------- | --------------------------------------------------------------------------------- |
| **Track**           | Frontend — React                                                                  |
| **Difficulty**      | 🟡 Mid → 🔴 Senior                                                                |
| **Prerequisites**   | 04-advanced-patterns (Compound Components, Custom Hooks, Controlled/Uncontrolled) |
| **See also**        | 07-hooks-comprehensive, 09-performance-optimization                               |
| **L5 Competencies** | API Design, System Architecture, Abstraction Design                               |

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn đang build **Design System** cho công ty — một bộ UI components (Button, Modal, Select, Autocomplete) dùng chung cho 5 team khác nhau. Mỗi team có yêu cầu khác nhau:

- Team A cần Select dropdown mở lên trên (vì nằm cuối trang)
- Team B cần Select có search filter
- Team C cần Select cho phép multi-select
- Team D cần custom rendering cho mỗi option

Bạn không thể tạo 4 component riêng. Bạn cũng không thể nhét 50 props vào 1 component. **Làm sao thiết kế 1 component linh hoạt mà không phức tạp?**

Đây là lúc **advanced patterns** phát huy tác dụng: Render Props, Headless Components, Prop Getters, và Slot Pattern — những kỹ thuật giúp bạn build components **linh hoạt như Lego** mà API vẫn clean.

---

**Bạn đang ở đây trong lộ trình học:**

```
04-advanced-patterns (cơ bản) → [PATTERNS ADVANCED] → 09-performance-optimization
```

---

## Concept Map / Bản Đồ Khái Niệm

```
              Advanced React Patterns
                      │
    ┌─────────────────┼─────────────────┐
    │                 │                  │
 Rendering        Logic              Composition
 Delegation       Sharing            Patterns
    │                 │                  │
┌───┴────┐     ┌──────┴──────┐    ┌─────┴──────┐
│Render  │     │Control Props│    │Slot Pattern│
│Props   │     │Prop Getters │    │Children as │
│Headless│     │State Reducer│    │  Function  │
│Component│    │             │    │            │
└────────┘     └─────────────┘    └────────────┘
    │                 │                  │
    └─────────────────┼──────────────────┘
                      ▼
              Pattern Selection:
              "Flexibility nào cần?"
              → Chọn pattern phù hợp
```

---

## Overview / Tổng Quan

Advanced React patterns solve the **flexibility vs simplicity** trade-off: how to make components that are powerful enough for diverse use cases while keeping their API simple enough that developers don't need to read 200 lines of docs.

File 04 dạy bạn patterns cơ bản (Compound Components, Custom Hooks, HOC). File này đi sâu vào **patterns cho design system** — khi bạn build components cho **người khác dùng**. Trade-off chính: càng flexible thì API càng phức tạp. Patterns ở đây giúp bạn **tăng flexibility mà không tăng complexity**.

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. Render Props Pattern / Render Props

> 🧠 **Memory Hook**: "Render Props = **khuôn bánh** — component cung cấp logic (nhào bột, nướng), bạn quyết định hình dáng bánh qua function."

**Tại sao tồn tại? / Why does this exist?**
Bạn muốn share **logic** (tracking mouse position, managing dropdown state) nhưng mỗi consumer cần **render UI khác nhau**. Component không thể biết trước UI cần render gì.
→ **Why?** Vì tách biệt "logic gì" và "render sao" là nguyên tắc thiết kế cốt lõi — cho phép 10 consumer dùng cùng logic nhưng render hoàn toàn khác.
→ **Why?** Vì React trước hooks không có cách share stateful logic ngoài HOC (wrapper hell) và Render Props.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Bạn thuê **xe đông lạnh** để vận chuyển hàng. Xe cung cấp: hệ thống lạnh, GPS, tài xế. Nhưng **hàng gì bên trong** — bạn quyết định. Hôm nay chở kem, mai chở hải sản, mốt chở vaccine. Xe không quan tâm — nó chỉ giữ lạnh và chở đi.

Render Props = xe đông lạnh. Component cung cấp **logic + state**, bạn pass function cho nó biết **render gì** với state đó.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
// ============================
// Render Props — Mouse Tracker
// ============================
interface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  render: (position: MousePosition) => React.ReactNode;
}

function MouseTracker({ render }: MouseTrackerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return <>{render(position)}</>;  // Consumer quyết định render gì
}

// Consumer A: Hiển thị tọa độ
<MouseTracker render={({ x, y }) => (
  <p>Mouse: {x}, {y}</p>
)} />

// Consumer B: Di chuyển avatar theo chuột
<MouseTracker render={({ x, y }) => (
  <img src="/avatar.png" style={{ position: 'fixed', left: x, top: y }} />
)} />
```

```
Render Props Flow:

  MouseTracker (Logic Owner)
  ┌──────────────────────┐
  │ state: { x, y }      │
  │ effect: mousemove     │
  │                       │
  │ render({x, y}) ──────────→ Consumer decides UI
  │        ↑              │         │
  │        │              │    ┌────┴─────┐
  │  function from props  │    │ <p>x,y</p>│  ← Consumer A
  │                       │    │ <img />   │  ← Consumer B
  └──────────────────────┘    └──────────┘
```

**Render Props vs Custom Hooks (2024+):**

| Tiêu chí     | Render Props               | Custom Hooks        |
| ------------ | -------------------------- | ------------------- |
| Cú pháp      | Verbose, nested            | Clean, flat         |
| Share logic  | Qua props                  | Qua return value    |
| Share UI     | Có (render function)       | Không (chỉ logic)   |
| Hiện đại?    | Ít dùng cho logic          | Preferred cho logic |
| Dùng khi nào | Cần **delegate rendering** | Cần **reuse logic** |

**Kết luận**: Custom hooks thay thế render props cho **logic sharing**. Render props vẫn hữu ích khi bạn cần component **quyết định rendering boundary** (ví dụ: virtualized list render item).

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Performance trap**: Inline render function tạo mới mỗi render → child luôn re-render. Fix: extract function ra ngoài hoặc dùng `useCallback`.
- **Nesting hell**: Nhiều render props lồng nhau → đọc khó. Custom hooks giải quyết vấn đề này.
- **TypeScript**: Typing render function cần generic — `render: (data: T) => ReactNode`.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                 | Tại sao sai                         | Đúng là                                                          |
| --------------------------------------- | ----------------------------------- | ---------------------------------------------------------------- |
| Dùng render props cho mọi logic sharing | Overkill, custom hooks đơn giản hơn | Render props chỉ khi cần delegate **rendering**, hooks cho logic |
| Inline function trong JSX gây re-render | Mỗi render tạo function mới         | Extract ra variable hoặc dùng useCallback                        |
| Quên TypeScript generic                 | Mất type safety cho render function | `render: (data: T) => ReactNode`                                 |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "render props", "inversion of control", "delegate rendering"
- → Nhớ đến: Xe đông lạnh — logic + state là xe, render là hàng bên trong
- → Mở đầu trả lời: _"Render props pattern tách biệt logic ownership và rendering — component quản lý state/logic, consumer quyết định UI qua function prop. Ngày nay, custom hooks thay thế render props cho logic sharing, nhưng render props vẫn hữu ích khi cần delegate rendering decisions."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Advanced Patterns — Custom Hooks](./04-advanced-patterns.md)
- ➡️ Để hiểu tiếp: [Headless Components](#2-headless-components--component-không-đầu) — evolution của render props

---

### 2. Headless Components / Component "Không Đầu"

> 🧠 **Memory Hook**: "Headless Component = **não không có mặt** — toàn bộ intelligence (logic, state, accessibility) nhưng ZERO UI. Consumer tự vẽ mặt."

**Tại sao tồn tại? / Why does this exist?**
Design system components cần hoạt động đúng (keyboard navigation, ARIA, focus management) nhưng **mỗi project cần look khác nhau**. Nếu bundle logic + styling → consumer phải override CSS → war giữa library styles và project styles.
→ **Why?** Vì styling là thứ thay đổi nhiều nhất giữa các project, nhưng logic (accessibility, keyboard, state) thì giống nhau.
→ **Why?** Vì separation: logic và style là 2 concerns độc lập. Bundle chúng lại = coupling không cần thiết.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Bạn mua **robot hút bụi**. Robot có: sensor tránh vật cản, thuật toán quét phòng, pin, motor. Nhưng **vỏ ngoài** (màu sắc, hình dáng) — bạn có thể thay. Robot Xiaomi trắng, Dyson tím, iRobot xám — bên trong cùng công nghệ, bên ngoài khác hoàn toàn.

Headless component = robot không vỏ. Bạn mua **"bộ não + chân"**, tự thiết kế vỏ theo phong cách nhà mình.

Libraries thực tế: **Headless UI** (Tailwind Labs), **Radix UI**, **React Aria** (Adobe), **Downshift**.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
// ============================
// Headless Dropdown — chỉ logic, ZERO UI
// ============================
interface UseDropdownOptions {
  items: string[];
  onSelect: (item: string) => void;
}

function useDropdown({ items, onSelect }: UseDropdownOptions) {
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

  // Prop Getters — trả về props để gắn vào element bất kỳ
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
    style: { background: highlightedIndex === index ? "#eee" : "transparent" },
  });

  return {
    isOpen,
    highlightedIndex,
    getToggleProps, // Gắn vào button/trigger
    getItemProps, // Gắn vào mỗi item
  };
}

// ============================
// Consumer A — Tailwind styled
// ============================
function FancyDropdown({ items, onSelect }: UseDropdownOptions) {
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

// Consumer B — Material UI styled (cùng logic, khác hoàn toàn UI)
function MaterialDropdown({ items, onSelect }: UseDropdownOptions) {
  const { isOpen, getToggleProps, getItemProps } = useDropdown({ items, onSelect });
  // ... Material UI styling, completely different look
}
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
  │  getInputProps()                 │
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

- **Learning curve**: Consumer cần hiểu prop getters pattern — `{...getToggleProps()}` syntax lạ cho junior dev.
- **Accessibility completeness**: Phải cover TẤT CẢ ARIA attributes, keyboard navigation, screen reader. Thiếu 1 cái = accessibility fail.
- **Bundle size**: Consumer import cả logic dù chỉ cần 1 feature. Tree-shaking giúp nhưng không hoàn hảo.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                 | Tại sao sai                                               | Đúng là                                          |
| --------------------------------------- | --------------------------------------------------------- | ------------------------------------------------ |
| Headless component vẫn render HTML      | Không thực sự headless, consumer không thể control markup | Return hooks/prop getters, không return JSX      |
| Quên ARIA attributes trong prop getters | Accessibility fail, screen reader không hoạt động         | Bao gồm role, aria-expanded, aria-selected, etc. |
| Consumer không spread all props         | Mất keyboard handlers hoặc ARIA                           | Luôn `{...getToggleProps()}` — spread tất cả     |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "headless components", "design system architecture", "reusable UI library"
- → Nhớ đến: Robot không vỏ — brain + legs, no skin
- → Mở đầu trả lời: _"Headless components tách logic (state, keyboard, accessibility) khỏi styling — giống như bán 'bộ não robot' để mỗi team tự thiết kế vỏ ngoài. Pattern này giải quyết vấn đề lớn nhất của UI libraries: style conflicts."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Custom Hooks](./04-advanced-patterns.md) — headless dựa trên custom hooks
- ➡️ Để hiểu tiếp: [Prop Getters](#3-prop-getters--trả-props-theo-gói) — cơ chế output của headless components

---

### 3. Prop Getters / Trả Props Theo Gói

> 🧠 **Memory Hook**: "Prop Getters = **bộ đồ ăn cho khách** — nhà hàng không đưa từng thìa, đũa, khăn riêng lẻ. Đưa 1 bộ đầy đủ, khách chỉ cần đặt lên bàn."

**Tại sao tồn tại? / Why does this exist?**
Headless component cần truyền **nhiều props cùng lúc** cho element (onClick, onKeyDown, role, aria-expanded, tabIndex...). Nếu trả từng prop riêng, consumer phải gắn 8-10 props thủ công → dễ quên, dễ sai.
→ **Why?** Vì nhóm props liên quan thành 1 function call giảm surface area cho bugs — quên 1 prop = accessibility broken.
→ **Why?** Vì developer experience: `{...getToggleProps()}` dễ dùng hơn 10 dòng props riêng lẻ.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Khi đi du lịch, bạn có thể pack từng món: kem đánh răng, bàn chải, khăn mặt, dầu gội... Hoặc bạn mua **"travel kit"** — 1 túi chứa tất cả, chỉ cần bỏ vào vali.

Prop getter = travel kit. 1 function call trả về **tất cả props cần thiết** cho 1 element. Consumer chỉ cần spread `{...}`.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
// Prop Getter pattern — cho phép consumer MERGE thêm props riêng
function useToggle(initialState = false) {
  const [isOn, setIsOn] = useState(initialState);

  // Prop getter — trả object props + cho phép override
  const getToggleProps = (userProps?: React.ButtonHTMLAttributes<HTMLButtonElement>) => ({
    // Library props (defaults)
    "aria-pressed": isOn,
    onClick: () => setIsOn((prev) => !prev),
    role: "switch" as const,

    // User props override (spread AFTER library props)
    ...userProps,

    // Merge handlers — QUAN TRỌNG: gọi CẢ library handler VÀ user handler
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsOn((prev) => !prev); // Library logic
      userProps?.onClick?.(e); // User's additional handler
    },
  });

  return { isOn, getToggleProps };
}

// Consumer — thêm className và onClick riêng
function MyApp() {
  const { isOn, getToggleProps } = useToggle();

  return (
    <button
      {...getToggleProps({
        className: "my-toggle", // Consumer thêm class
        onClick: () => track("toggle_clicked"), // Consumer thêm analytics
      })}
    >
      {isOn ? "ON" : "OFF"}
    </button>
  );
  // Result: button có aria-pressed, role="switch", onClick (cả toggle + analytics), className
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

**Merge rules:**

1. **Non-function props**: User overrides library (spread order)
2. **Function props (handlers)**: MERGE — gọi cả library và user handler
3. **ARIA props**: Library provides defaults, user can override nếu cần

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Handler merge complexity**: Nếu user's onClick calls `e.preventDefault()`, library handler vẫn chạy → cần document rõ
- **TypeScript generics**: Prop getter cần return type chính xác — `React.ButtonHTMLAttributes<HTMLButtonElement>` vs `HTMLAttributes<HTMLElement>`
- **Performance**: Prop getter tạo object mới mỗi lần gọi → nếu pass vào memoized component, cần `useMemo`

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                         | Tại sao sai                          | Đúng là                                                  |
| ------------------------------- | ------------------------------------ | -------------------------------------------------------- |
| User spread TRƯỚC library props | Library props bị override, mất ARIA  | Library props đặt trước, user spread sau, handlers merge |
| Không merge event handlers      | User onClick replace library onClick | Gọi cả 2: `() => { libraryHandler(); userHandler(); }`   |
| Return quá nhiều props          | Consumer confuse, khó debug          | 1 prop getter per element role (toggle, item, input)     |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "prop getters", "component API design", "merging props"
- → Nhớ đến: Travel kit — 1 túi chứa tất cả
- → Mở đầu trả lời: _"Prop getters bundle related props vào 1 function call — giúp consumer không quên ARIA attributes hay event handlers. Pattern quan trọng nhất là handler merging: không replace mà gọi cả library handler lẫn user handler."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Headless Components](#2-headless-components--component-không-đầu) — prop getters là output interface
- ➡️ Để hiểu tiếp: [State Reducer](#4-state-reducer-pattern--pattern-giảm-state) — cho phép consumer override logic

---

### 4. State Reducer Pattern / Pattern Giảm State

> 🧠 **Memory Hook**: "State Reducer = **hiến pháp sửa đổi** — component có luật mặc định, nhưng consumer có quyền **sửa đổi bất kỳ điều luật nào** qua reducer."

**Tại sao tồn tại? / Why does this exist?**
Headless component + prop getters cho consumer control **UI**. Nhưng đôi khi consumer cần control **behavior/logic** — ví dụ: dropdown mặc định đóng khi chọn item, nhưng consumer muốn giữ mở (multi-select).
→ **Why?** Vì bạn không thể dự đoán mọi use case. Thêm `keepOpenOnSelect` prop → rồi thêm `closeOnBlur`, `closeOnEscape`... → prop explosion.
→ **Why?** Vì Inversion of Control: thay vì library quyết định **mọi behavior**, để consumer override **bất kỳ state transition nào** qua reducer function.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Ở Việt Nam, hiến pháp là luật cơ bản. Nhưng Quốc hội có thể **sửa đổi điều khoản** khi cần. Hiến pháp cung cấp **behavior mặc định**, Quốc hội có thể **override bất kỳ điều nào**.

State Reducer = cho consumer quyền "sửa hiến pháp" của component. Component có default behavior, consumer pass `stateReducer` để override bất kỳ state transition nào.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
// ============================
// State Reducer Pattern
// ============================
type ToggleState = { isOn: boolean };
type ToggleAction = { type: "TOGGLE" } | { type: "ON" } | { type: "OFF" };

// Default reducer — behavior mặc định
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

interface UseToggleOptions {
  initialState?: boolean;
  // Consumer CAN override any state transition
  stateReducer?: (state: ToggleState, action: ToggleAction) => ToggleState;
}

function useToggle({
  initialState = false,
  stateReducer = defaultReducer, // Default nếu consumer không pass
}: UseToggleOptions = {}) {
  const [state, dispatch] = useReducer(stateReducer, { isOn: initialState });

  const toggle = () => dispatch({ type: "TOGGLE" });
  const on = () => dispatch({ type: "ON" });
  const off = () => dispatch({ type: "OFF" });

  return { ...state, toggle, on, off };
}

// ============================
// Consumer: Giới hạn toggle tối đa 3 lần
// ============================
function App() {
  const [clickCount, setClickCount] = useState(0);

  const { isOn, toggle } = useToggle({
    stateReducer: (state, action) => {
      // Override TOGGLE behavior — giữ nguyên ON/OFF
      if (action.type === "TOGGLE" && clickCount >= 3) {
        return state; // Block toggle sau 3 lần
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
  │  Consumer's stateReducer  │ ← Consumer có quyền override
  │                           │
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

- **Consumer phải biết action types**: Cần document rõ tất cả action types — nếu rename action type → breaking change.
- **Composability**: Consumer có thể chain reducers — nhưng cần test kỹ edge cases khi 2 reducers conflict.
- **Debugging difficulty**: Khi bug xảy ra, khó biết behavior đến từ default reducer hay consumer's override.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                          | Tại sao sai                                          | Đúng là                                                    |
| -------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------- |
| Không fallback to defaultReducer | Consumer phải handle TẤT CẢ action types             | `return defaultReducer(state, action)` cho unhandled cases |
| Expose internal state structure  | Consumer depends on internal shape → breaking change | Expose minimal state, abstract implementation              |
| Rename action types              | Breaking change cho consumers                        | Action types là public API, version carefully              |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "state reducer", "inversion of control", "extensible components"
- → Nhớ đến: Hiến pháp sửa đổi — default behavior + override capability
- → Mở đầu trả lời: _"State Reducer pattern cho consumer quyền override bất kỳ state transition nào trong component, mà không cần library thêm props. Nó giải quyết 'prop explosion' — thay vì 50 boolean props, 1 reducer function handle mọi customization."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [useReducer](./03-hooks-deep-dive.md) — hiểu reducer pattern
- ➡️ Để hiểu tiếp: Design System Architecture — kết hợp tất cả patterns

---

### 5. Pattern Selection Framework / Hướng Dẫn Chọn Pattern

> 🧠 **Memory Hook**: "Chọn pattern = chọn **phương tiện di chuyển** — đi bộ (props), xe đạp (custom hook), ô tô (compound), máy bay (headless). Đừng bay máy bay đi mua ổ bánh mì."

**Tại sao tồn tại? / Why does this exist?**
Biết nhiều patterns nhưng **dùng sai context** còn tệ hơn không biết. Over-engineering (headless component cho 1 button đơn giản) tạo complexity không cần thiết.
→ **Why?** Vì mỗi pattern có **trade-off**: flexibility tăng thì complexity tăng. Pattern đắt nhất (headless + state reducer + prop getters) chỉ cần cho shared libraries.
→ **Why?** Vì premature abstraction là nguồn gốc của technical debt — abstract quá sớm = lock vào wrong abstraction.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Đi từ nhà đến chợ gần (500m) — **đi bộ** là tối ưu. Lái Ferrari đến chợ = lãng phí.
Đi từ Hà Nội đến Sài Gòn — **máy bay** là tối ưu. Đi bộ = điên rồ.

Patterns cũng vậy — chọn **đúng mức abstraction** cho khoảng cách (complexity) cần đi.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
Pattern Selection Decision Tree:

  Component dùng ở đâu?
  │
  ├── Chỉ 1 project, 1-2 chỗ dùng
  │   └── Props + children đủ rồi (đi bộ)
  │
  ├── 1 project, nhiều chỗ dùng
  │   └── Custom Hook (xe đạp)
  │
  ├── 1 project, cần share UI structure
  │   └── Compound Components (ô tô)
  │
  ├── Multi-project / Design System
  │   ├── Cần flexible styling?
  │   │   └── Headless Component + Prop Getters (máy bay)
  │   │
  │   └── Cần flexible behavior?
  │       └── + State Reducer Pattern (máy bay + first class)
  │
  └── Library cho open source
      └── Headless + State Reducer + Prop Getters (full combo)
```

**Pattern Complexity vs Flexibility Matrix:**

| Pattern                 | Complexity | Flexibility | Best For                            |
| ----------------------- | ---------- | ----------- | ----------------------------------- |
| Props drilling          | ⭐         | ⭐          | Simple, 1-2 levels deep             |
| Custom Hook             | ⭐⭐       | ⭐⭐        | Logic reuse, same project           |
| Compound Components     | ⭐⭐⭐     | ⭐⭐⭐      | Related UI components, shared state |
| Render Props            | ⭐⭐⭐     | ⭐⭐⭐⭐    | Delegate rendering, lists           |
| Headless + Prop Getters | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐  | Design systems, multi-project       |
| + State Reducer         | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐  | Open source libs, max flexibility   |

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Rule of Three**: Không abstract cho đến khi bạn thấy **cùng pattern lặp lại 3 lần**. Lần 1 = code trực tiếp. Lần 2 = note similarity. Lần 3 = extract.
- **Wrong abstraction > no abstraction**: Sai pattern tạo coupling khó gỡ. Thà duplicate code hơn wrong abstraction (Sandi Metz).
- **Team familiarity**: Pattern phức tạp cần team hiểu. Nếu team toàn junior, compound components + custom hooks là đủ.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                      | Tại sao sai                          | Đúng là                        |
| ---------------------------- | ------------------------------------ | ------------------------------ |
| Headless cho internal button | Over-engineering, chỉ 1 project dùng | Props + children đủ rồi        |
| Abstract ngay lần đầu dùng   | Chưa biết pattern nào đúng           | Rule of Three — đợi lặp 3 lần  |
| Chọn pattern vì "cool"       | Complexity không tương xứng benefit  | Chọn theo decision tree ở trên |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "khi nào dùng pattern nào", "design system architecture", "component API design"
- → Nhớ đến: Phương tiện di chuyển — match distance to vehicle
- → Mở đầu trả lời: _"Tôi chọn pattern theo scope: single-use → props, same-project reuse → custom hooks, shared UI → compound components, cross-project → headless + prop getters. Nguyên tắc: không abstract trước khi thấy pattern lặp 3 lần — wrong abstraction tệ hơn duplication."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: Tất cả patterns ở trên
- ➡️ Để hiểu tiếp: [Performance Optimization](./09-performance-optimization.md) — patterns ảnh hưởng performance

---

## Q&A Section / Câu Hỏi Phỏng Vấn

### Q1: What is the Render Props pattern and when would you still use it in 2024? / Render Props là gì và khi nào vẫn dùng trong 2024? 🟢 Junior

**A:** Render Props is a pattern where a component receives a **function as prop** that tells it what to render, allowing the component to share its internal state/logic while letting the consumer decide the UI.

In 2024, custom hooks have replaced render props for **logic sharing**. Render props are still used when you need to **delegate rendering decisions** — like virtualized lists (`react-window`'s `children` function that receives row index and style).

Render Props truyền function qua props để component con "hỏi" parent: "Tôi có data này, bạn muốn render gì?" Ngày nay, custom hooks thay thế cho **logic sharing**, nhưng render props vẫn dùng khi cần delegate **rendering** — ví dụ list ảo (virtualized list) cần biết render mỗi row như thế nào.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Phân biệt rõ "render props cho rendering delegation" vs "hooks cho logic", cho ví dụ cụ thể 2024
- ❌ Weak: "Render props là cách share logic" mà không nói hooks đã thay thế phần lớn use cases

---

### Q2: What is the difference between a Headless Component and a regular component library? / Sự khác biệt giữa Headless Component và component library thường? 🟢 Junior

**A:** A regular component library (Material UI, Ant Design) bundles **logic + styling** together. You get ready-to-use components but must fight their CSS to customize look.

A headless component library (Radix, Headless UI, React Aria) provides **only logic** (state management, keyboard navigation, accessibility). You provide **all styling**. Zero CSS conflicts.

Library thường (MUI, Ant Design) đóng gói **logic + UI** — dùng nhanh nhưng customize styling phải override CSS → war giữa library CSS và project CSS. Headless library chỉ cho **logic** — bạn tự style 100%, không có CSS conflict.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu trade-off rõ ràng (speed vs flexibility), cho tên library cụ thể cả 2 loại
- ❌ Weak: "Headless không có UI" mà không giải thích **tại sao** người ta muốn vậy

---

### Q3: Explain the Prop Getters pattern — why merge handlers instead of replacing? / Giải thích Prop Getters pattern — tại sao merge handlers thay vì replace? 🟡 Mid

**A:** Prop Getters bundle related props (ARIA attributes, event handlers, roles) into a single function call. Consumer spreads the result: `{...getToggleProps()}`.

**Why merge instead of replace?** If consumer's `onClick` replaces library's `onClick`, the component breaks — it loses state update logic. Merging ensures **both** handlers run:

```tsx
onClick: (e) => {
  libraryToggle(); // Component logic preserved
  userProps?.onClick?.(e); // Consumer logic added
};
```

Nếu replace thay vì merge, consumer thêm `onClick` cho analytics → mất logic toggle của component → bug. Merge đảm bảo **cả 2 đều chạy**.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích handler merge mechanism, nêu scenario khi replace gây bug, biết merge order matters
- ❌ Weak: "Prop getters return props" mà không giải thích merge strategy

---

### Q4: How does the State Reducer pattern solve prop explosion? / State Reducer pattern giải quyết prop explosion như thế nào? 🟡 Mid

**A:** Without State Reducer, every behavior customization needs a new prop: `closeOnSelect`, `closeOnBlur`, `keepOpenOnEscape`, `maxSelections`... This leads to **prop explosion** — dozens of boolean props that interact in complex ways.

State Reducer replaces ALL these props with **one function**: the consumer passes a `stateReducer` that can intercept and modify any state transition. Instead of 20 boolean props → 1 reducer function.

Không có State Reducer, mỗi customization = 1 prop mới. 20 customizations = 20 props mà chúng có thể conflict nhau (`closeOnSelect` + `keepOpen` = ???). State Reducer thay toàn bộ bằng 1 function — consumer override **bất kỳ state transition nào** mà không cần library thêm props.

```tsx
// Prop explosion approach — 😰
<Dropdown
  closeOnSelect={true}
  closeOnBlur={false}
  keepOpenOnEscape={true}
  maxSelections={3}
  allowDeselect={true}
  // ... 15 more props
/>

// State Reducer approach — 😊
<Dropdown
  stateReducer={(state, action) => {
    if (action.type === 'SELECT' && state.selections.length >= 3) {
      return state; // Block selection after 3
    }
    return defaultReducer(state, action);
  }}
/>
```

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: So sánh cụ thể prop explosion vs reducer, nêu ví dụ conflict giữa boolean props
- ❌ Weak: "State Reducer flexible hơn" mà không giải thích **mechanism**

---

### Q5: Design a headless Autocomplete component for a design system. / Thiết kế Autocomplete headless cho design system. 🔴 Senior

**A:**

```tsx
interface UseAutocompleteOptions<T> {
  items: T[];
  itemToString: (item: T) => string;
  onSelect: (item: T) => void;
  filterFn?: (items: T[], query: string) => T[];
  stateReducer?: (state: AutocompleteState, action: AutocompleteAction) => AutocompleteState;
}

function useAutocomplete<T>({
  items,
  itemToString,
  onSelect,
  filterFn = defaultFilter,
  stateReducer = defaultReducer,
}: UseAutocompleteOptions<T>) {
  const [state, dispatch] = useReducer(stateReducer, initialState);
  const { query, isOpen, highlightedIndex, selectedItem } = state;

  const filteredItems = useMemo(() => filterFn(items, query), [items, query, filterFn]);

  // Prop Getters
  const getInputProps = (userProps?: React.InputHTMLAttributes<HTMLInputElement>) => ({
    value: query,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: "INPUT_CHANGE", payload: e.target.value });
      userProps?.onChange?.(e);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      handleKeyDown(e);
      userProps?.onKeyDown?.(e);
    },
    onFocus: () => dispatch({ type: "OPEN" }),
    role: "combobox" as const,
    "aria-expanded": isOpen,
    "aria-autocomplete": "list" as const,
    "aria-activedescendant": highlightedIndex >= 0 ? `option-${highlightedIndex}` : undefined,
    ...userProps,
  });

  const getMenuProps = () => ({
    role: "listbox" as const,
    "aria-label": "suggestions",
  });

  const getItemProps = (index: number) => ({
    id: `option-${index}`,
    role: "option" as const,
    "aria-selected": highlightedIndex === index,
    onClick: () => {
      onSelect(filteredItems[index]);
      dispatch({ type: "SELECT", payload: filteredItems[index] });
    },
    onMouseEnter: () => dispatch({ type: "HIGHLIGHT", payload: index }),
  });

  return {
    query,
    isOpen,
    highlightedIndex,
    selectedItem,
    filteredItems,
    getInputProps,
    getMenuProps,
    getItemProps,
  };
}
```

**Architecture decisions:**

1. **Generic `<T>`**: Works with any data type — string, object, complex entity
2. **`itemToString`**: Decouples display logic — library doesn't assume data shape
3. **`filterFn` customizable**: Default filter = includes(), consumer can do fuzzy search
4. **State Reducer**: Consumer can override any behavior (keep open on select, limit results)
5. **ARIA complete**: combobox, listbox, option, aria-activedescendant for screen readers
6. **Prop Getters with merge**: Handler merging for input/item events

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Generics, ARIA attributes, prop getters with merge, state reducer, customizable filter
- ❌ Weak: Chỉ show component với styling mà không tách logic khỏi UI

**🔗 Follow-up Chain:**

1. "Xử lý async search (API call) như thế nào?" → `filterFn` return Promise, add loading state, debounce input
2. "Multi-select support?" → State reducer override SELECT action to accumulate, change selectedItem to selectedItems array
3. "Accessibility testing strategy?" → axe-core, keyboard navigation test, screen reader manual test

---

### Q6: Compare all advanced patterns — when to use each in a real project? / So sánh tất cả advanced patterns — khi nào dùng trong project thực? 🔴 Senior

**A:** Pattern selection follows **scope and flexibility requirements**:

| Scenario                        | Pattern                                 | Why                             |
| ------------------------------- | --------------------------------------- | ------------------------------- |
| Button with 3 variants          | Props + children                        | Simple, no abstraction needed   |
| Form validation across 5 forms  | Custom Hook (useFormValidation)         | Logic reuse, no UI sharing      |
| Tabs component (Tab + TabPanel) | Compound Components                     | Related UI, shared state        |
| Dropdown in Design System       | Headless + Prop Getters                 | Multi-project, flexible styling |
| Autocomplete for open source    | Headless + State Reducer + Prop Getters | Maximum flexibility             |

**Decision principles:**

1. **Rule of Three**: Don't abstract until pattern repeats 3 times
2. **Prefer composition over configuration**: Small composable pieces > one mega-component
3. **Wrong abstraction > no abstraction** (Sandi Metz): Duplication is cheaper than wrong coupling
4. **Team capability**: Junior team → Custom Hooks + Compound. Senior team → Headless + State Reducer.

Trong project thực, 80% components chỉ cần props + children. 15% cần custom hooks. 5% cần compound/headless patterns. **Đừng dùng headless cho mọi button** — đó là over-engineering.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Có framework chọn pattern rõ ràng, nêu Rule of Three, biết khi nào KHÔNG dùng pattern phức tạp
- ❌ Weak: Liệt kê patterns mà không có criteria chọn, hoặc recommend headless cho mọi thứ

**🔗 Follow-up Chain:**

1. "Nếu team bạn toàn junior, bạn introduce patterns như thế nào?" → Start with custom hooks, add compound components after team comfortable, delay headless
2. "Khi nào bạn quyết định extract component thành library?" → When 3+ teams need it, have stable API, can invest in docs + tests
3. "Migration strategy từ monolithic component sang headless?" → Incremental: extract hook first, add prop getters, deprecate old API gradually

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| #   | Question                        | Level | Key Point                                                           |
| --- | ------------------------------- | ----- | ------------------------------------------------------------------- |
| Q1  | Render Props in 2024            | 🟢    | Hooks thay cho logic sharing, render props cho rendering delegation |
| Q2  | Headless vs regular library     | 🟢    | Logic only vs logic+styling, trade-off speed vs flexibility         |
| Q3  | Prop Getters merge              | 🟡    | Merge handlers to preserve both library + consumer logic            |
| Q4  | State Reducer vs prop explosion | 🟡    | 1 reducer function replaces 20+ boolean props                       |
| Q5  | Design headless Autocomplete    | 🔴    | Generics, ARIA, prop getters, state reducer, customizable filter    |
| Q6  | Pattern selection framework     | 🔴    | Match scope to pattern, Rule of Three, avoid over-engineering       |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"How would you design a reusable component for a design system?"**

**30 giây đầu — mở đầu lý tưởng / Ideal 30-second opening:**

1. "Tôi tiếp cận design system components theo **headless architecture** — tách logic (state, keyboard, accessibility) khỏi styling để mỗi team tự style."
2. "Cơ chế chính là **prop getters** — bundle related props vào function calls, merge event handlers thay vì replace — và **state reducer** cho consumer override behavior."
3. "Ví dụ: Autocomplete headless — generic type cho data, customizable filter function, đầy đủ ARIA attributes, consumer chỉ cần spread prop getters và thêm styling."
4. "Trade-off: headless phức tạp hơn regular component. Tôi chỉ dùng pattern này khi component serve **nhiều team/project**. Single-project → custom hooks là đủ."

_Sau đó mở rộng theo hướng interviewer dẫn dắt._

---

## Self-Check / Tự Kiểm Tra ⚡

> **Đóng tài liệu lại trước khi làm — Close the doc before attempting.**

- [ ] **Retrieval**: Viết 5 patterns từ trí nhớ (render props, headless, prop getters, state reducer, compound). Mỗi cái 1 câu mô tả.
- [ ] **Visual**: Vẽ Pattern Selection Decision Tree ra giấy. So sánh với diagram trên.
- [ ] **Application**: Team bạn cần Dropdown component dùng ở 3 projects khác nhau, mỗi project style khác. Bạn chọn pattern nào? Tại sao?
- [ ] **Debug**: Prop getter consumer thêm `onClick` nhưng component toggle không hoạt động — nguyên nhân? Fix?
- [ ] **Teach**: Giải thích headless component cho designer bằng ví dụ robot hút bụi. Không dùng thuật ngữ code.

💬 **Feynman Prompt:** Giải thích prop getters cho đồng nghiệp junior bằng ví dụ "bộ đồ ăn nhà hàng" — 1 bộ chứa tất cả, khách chỉ cần đặt lên bàn. Không dùng code.

🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày → 7 ngày → 14 ngày** để chuyển vào long-term memory.

---

## Connections / Liên Kết

- ⬅️ **Built on:** [Advanced Patterns](./04-advanced-patterns.md) — Compound Components, Custom Hooks là nền tảng
- ➡️ **Enables:** [Performance Optimization](./09-performance-optimization.md) — patterns ảnh hưởng re-render behavior
- 🔗 **Applied in:** Design Systems (Radix, Headless UI, React Aria), Open Source Libraries (Downshift, React Table)
