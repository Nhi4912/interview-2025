# Advanced React Patterns / Mẫu React Nâng Cao

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **Prerequisites**: [Hooks Deep Dive](./03-hooks-deep-dive.md), [React Fundamentals](./01-react-fundamentals.md)
> **See also**: [State Management](./05-state-management.md), [Performance Optimization](./09-performance-optimization.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Shopee's design system team built a `<Select>` component. Version 1: a monolithic component with 20+ props — `showSearch`, `multiSelect`, `grouping`, `virtualScroll`, `async`, `creatable`... After 6 months, every feature request added another prop. The component had 800 lines, prop conflicts were common, and consumers couldn't customize rendering without patching the library.

Version 2 used **compound components + composition**: `<Select>`, `<Select.Option>`, `<Select.Group>`, `<Select.Search>`. Each sub-component was independently composable. The library shrank to 200 lines, and consumers could build custom variants without touching the source.

This is the core insight behind advanced React patterns: **separate state sharing from rendering**.

---

## What & Why / Cái Gì & Tại Sao

**English:** Advanced patterns solve the "impossible component" problem — when a single component can't accommodate all use cases through props alone. Patterns like compound components, render props, and HOCs shift control from the component author to the consumer.

**Tiếng Việt:** Các pattern nâng cao giải quyết vấn đề "component không thể mở rộng" — khi một component đơn lẻ không đáp ứng được mọi use case chỉ qua props. Compound components, render props, HOC đều chuyển quyền kiểm soát từ tác giả component sang người dùng component.

---

## Core Concept 1: Compound Components / Component Phức Hợp

> 🧠 **Memory Hook**: "Compound Components = HTML `<select>` + `<option>` — parent owns state, children read it through context"
>
> Like `<table>` and `<tr>` and `<td>` — each is useless alone, powerful together, with implicit shared understanding.

**Tại sao tồn tại? / Why does this exist?**

Single-component APIs accumulate props until they collapse. `<Tabs activeTab onTabChange showIcons vertical size variant>` is unreadable.
→ Why does prop sprawl happen? Because state that belongs to the parent leaks into the API surface.
→ Why not just use props? Because consumers need to compose sub-parts differently — tabs in header, panels in body, with other elements in between.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

A restaurant set menu vs à la carte. Prop-based = set menu (fixed combinations). Compound components = à la carte (mix and match freely). The restaurant (parent) manages the bill (state); dishes (children) are ordered independently.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

// 1. Context = the implicit communication channel
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
const TabsContext = createContext<TabsContextType | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Must be used within <Tabs>');
  return ctx;
}

// 2. Parent manages state
function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

// 3. Children read from context — no prop drilling
function Tab({ value, children }: { value: string; children: ReactNode }) {
  const { activeTab, setActiveTab } = useTabs();
  return (
    <button
      className={activeTab === value ? 'tab active' : 'tab'}
      onClick={() => setActiveTab(value)}
      aria-selected={activeTab === value}
    >
      {children}
    </button>
  );
}

function TabPanel({ value, children }: { value: string; children: ReactNode }) {
  const { activeTab } = useTabs();
  return activeTab === value ? <div role="tabpanel">{children}</div> : null;
}

// 4. Attach as namespace (dot notation)
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

// Usage: consumer controls layout freely
function App() {
  return (
    <Tabs defaultTab="home">
      <nav>
        <Tabs.Tab value="home">Home</Tabs.Tab>
        <Tabs.Tab value="profile">Profile</Tabs.Tab>
      </nav>
      <main>
        <Tabs.Panel value="home"><HomePage /></Tabs.Panel>
        <Tabs.Panel value="profile"><ProfilePage /></Tabs.Panel>
      </main>
    </Tabs>
  );
}
```

```
COMPOUND COMPONENT ANATOMY:

  <Tabs>                   ← owns state (activeTab)
  ├── Context.Provider     ← broadcasts state to tree
  │
  ├── <Tabs.Tab>           ← reads + writes state via context
  ├── <Tabs.Tab>           ← reads + writes state via context
  │
  └── <Tabs.Panel>         ← reads state (no write needed)
      <Tabs.Panel>

  Key: no props passed between Tab → Panel
       they communicate ONLY through context
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

```tsx
// Controlled variant: consumer owns state
function ControlledTabs({
  activeTab,
  onTabChange,
  children
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}) {
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: onTabChange }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

// Problem: compound children used outside parent
// Tab throws error → good! Fail fast, clear message.
// <Tab value="x">Outside</Tab>  // ❌ "Must be used within <Tabs>"
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Using `React.Children.map` to pass props | Breaks with wrapper divs, portals, fragments | Use context instead |
| Null check on context instead of throwing | Silent failures — consumer doesn't know | `throw new Error('Must be used within <Parent>')` |
| Deep context nesting for unrelated data | Creates coupling between unrelated components | Separate contexts per compound group |
| No controlled variant | Forces consumers to manage state externally | Offer both controlled + uncontrolled via `defaultTab` vs `tab` |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "flexible component API", "avoid prop drilling without Redux", "design system component"
- → Nhớ đến: compound components + context
- → Mở đầu trả lời: "I'd use compound components here — the parent holds state in context, and each sub-component reads only what it needs, letting consumers compose the layout however they want."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Context API, useState](./03-hooks-deep-dive.md)
- ➡️ Để hiểu: [Controlled vs uncontrolled components, state reducer pattern]

---

## Core Concept 2: Render Props & Custom Hooks / Render Props & Custom Hooks

> 🧠 **Memory Hook**: "Render Props = 'you render, I'll supply the data'. Custom Hooks = same idea, but the data flows through return values, not JSX."
>
> Both patterns share *logic*, not *UI*. The difference is where JSX lives.

**Tại sao tồn tại? / Why does this exist?**

Logic (tracking mouse position, form state, infinite scroll) is reusable across many UI shapes. Copy-pasting logic breaks DRY.
→ Why not just use HOCs? HOCs wrap JSX — they create invisible wrapper components, cause naming collisions, and are hard to compose.
→ Why do hooks win over render props? Hooks compose without nesting. `useMousePosition()` + `useForm()` vs `<MouseTracker render={...}><FormTracker render={...}>...`.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Render props = a contractor who builds the plumbing, then says "here's the water supply — you design the faucets." The consumer controls the UI (faucets); the render prop component owns the logic (plumbing).

Custom hooks = same contractor, but instead of handing you JSX props, they return values you can use anywhere — no "nesting" required.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
// Render Props pattern — still useful for HOC-like wrapping scenarios
interface MouseTrackerRenderProps {
  x: number;
  y: number;
}

function MouseTracker({ render }: { render: (props: MouseTrackerRenderProps) => ReactNode }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}>
      {render(pos)}
    </div>
  );
}

// Usage — consumer controls rendering
<MouseTracker render={({ x, y }) => (
  <div style={{ position: 'absolute', left: x, top: y }}>
    🎯 {x}, {y}
  </div>
)} />

// Custom Hook — the modern equivalent (same logic, no JSX coupling)
function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return pos;
}

// Usage — no nesting, compose freely
function Cursor() {
  const { x, y } = useMousePosition(); // logic separated from UI
  return <div style={{ position: 'absolute', left: x, top: y }}>🎯</div>;
}

// HOC pattern — wraps a component to inject props
function withAuth<P extends { user: User }>(
  Component: React.ComponentType<P>
) {
  return function AuthWrapped(props: Omit<P, 'user'>) {
    const user = useCurrentUser();
    if (!user) return <Navigate to="/login" />;
    return <Component {...(props as P)} user={user} />;
  };
}
// Usage: const ProtectedPage = withAuth(DashboardPage);
```

```
EVOLUTION OF CROSS-CUTTING LOGIC SHARING:

  HOC (2015–2018)           Render Props (2017–2019)     Custom Hook (2019–now)
  ─────────────────         ───────────────────────      ──────────────────────
  withAuth(Component)       <Auth render={fn} />         const auth = useAuth()

  Invisible wrapper          JSX nesting                  Plain function call
  Prop name collision        "Wrapper hell"               Flat composition
  Hard to type               Verbose                      Easy TypeScript
  Static (build time)        Dynamic                      Dynamic
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

```tsx
// Render props still win for: sharing JSX scope + providing container behavior
// Example: Intersection Observer (needs a ref on a DOM element)
function InView({
  children,
  onEnter,
  onLeave,
}: {
  children: (ref: React.Ref<HTMLDivElement>) => ReactNode;
  onEnter?: () => void;
  onLeave?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onEnter?.();
      else onLeave?.();
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onEnter, onLeave]);

  return <>{children(ref)}</>;
}

// Consumer attaches the ref to their own element
<InView onEnter={() => trackImpression()}>
  {(ref) => <article ref={ref}>Product Card</article>}
</InView>
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Inline arrow in render prop: `render={() => <Comp />}` | Creates new function every render → child re-renders always | Define function outside or `useCallback` |
| HOC modifying `displayName` | Debug tools show "Component" not "withAuth(Component)" | Always set `WrappedComponent.displayName` |
| Using render props when a hook would suffice | Unnecessary nesting, harder to read | Default to hooks; use render props for DOM-ref sharing |
| HOC reading from props it doesn't own | Prop name collisions (both HOC and consumer pass `data`) | Use spread + explicit forwarding |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "share logic between components", "reuse stateful behavior", "HOC vs hooks tradeoff"
- → Nhớ đến: custom hooks first, render props for DOM coupling, HOCs for legacy/third-party
- → Mở đầu trả lời: "I'd extract this as a custom hook first — same logic reuse as render props but with flat composition. I'd only reach for render props if the shared logic needs to provide a ref to a DOM element."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [useEffect, useRef, custom hooks](./03-hooks-deep-dive.md)
- ➡️ Để hiểu: [Code sharing patterns in large apps](./08-react-patterns-advanced.md)

---

## Core Concept 3: State Reducer & Controlled Props Patterns

> 🧠 **Memory Hook**: "State Reducer = IoC for components — 'I'll manage state by default, but you can override any transition'"
>
> Like a keyboard with custom shortcuts — default behavior works, but power users can rebind any key.

**Tại sao tồn tại? / Why does this exist?**

Complex components (combobox, multi-select, datepicker) have state machines with many valid transitions. Consumers often need to intercept just *one* transition ("don't close on Escape") without rebuilding the whole component.
→ Why not just use props for every edge case? Because every edge case becomes a new prop — you're back to prop sprawl.
→ Why not just expose state fully? Because the consumer then owns the entire implementation burden.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

State reducer is like a hotel key card system. The door lock handles all the default logic (opens with correct card, logs entry). But the hotel manager (parent) can intercept specific events ("don't open after midnight") without rebuilding the lock.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
// State Reducer Pattern — consumer can override any state transition
type ToggleState = { isOpen: boolean };
type ToggleAction =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' };

function defaultToggleReducer(state: ToggleState, action: ToggleAction): ToggleState {
  switch (action.type) {
    case 'OPEN':  return { isOpen: true };
    case 'CLOSE': return { isOpen: false };
    case 'TOGGLE': return { isOpen: !state.isOpen };
    default: return state;
  }
}

function useToggle({
  stateReducer = defaultToggleReducer,
  initialOpen = false,
}: {
  stateReducer?: (state: ToggleState, action: ToggleAction) => ToggleState;
  initialOpen?: boolean;
} = {}) {
  const [state, dispatch] = useReducer(stateReducer, { isOpen: initialOpen });
  return {
    isOpen: state.isOpen,
    open: () => dispatch({ type: 'OPEN' }),
    close: () => dispatch({ type: 'CLOSE' }),
    toggle: () => dispatch({ type: 'TOGGLE' }),
  };
}

// Consumer use case: limit to max 3 opens
function App() {
  const openCountRef = useRef(0);

  const { isOpen, toggle } = useToggle({
    stateReducer(state, action) {
      if (action.type === 'OPEN' && openCountRef.current >= 3) {
        return state; // prevent opening — return current state unchanged
      }
      if (action.type === 'OPEN') openCountRef.current++;
      return defaultToggleReducer(state, action);
    }
  });

  return <button onClick={toggle}>{isOpen ? 'Close' : 'Open'}</button>;
}
```

**Controlled Props Pattern — consumer fully owns state:**

```tsx
// Uncontrolled (internal state, consumer just reacts)
function Dropdown({ defaultOpen, children }: { defaultOpen?: boolean; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? false);
  // ...
}

// Controlled (consumer owns state)
function Dropdown({
  open,        // if provided, controlled; if undefined, uncontrolled
  onOpenChange,
  defaultOpen,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  // isControlled = consumer provided `open` prop
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const isOpen = isControlled ? open : internalOpen;

  const handleChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <div>
      <button onClick={() => handleChange(!isOpen)}>Toggle</button>
      {isOpen && children}
    </div>
  );
}

// Uncontrolled usage (simpler)
<Dropdown defaultOpen={false}>Menu content</Dropdown>

// Controlled usage (consumer owns state for sync with URL, etc.)
const [menuOpen, setMenuOpen] = useState(false);
<Dropdown open={menuOpen} onOpenChange={setMenuOpen}>Menu</Dropdown>
```

```
CONTROLLED vs UNCONTROLLED:

  Prop passed?     isControlled?    State lives in...
  ──────────────────────────────────────────────────
  open = undefined    NO            Component internal state
  open = true/false   YES           Consumer (parent component)

  Design rule:
  - Provide BOTH defaultX (uncontrolled) and x + onChange (controlled)
  - This is what every input, select, and complex UI component should do
  - Radix UI, Headless UI, React Aria all follow this convention
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

```tsx
// Warning: mixing controlled + uncontrolled (React warns about this)
// ❌ Starting uncontrolled then becoming controlled
const [val, setVal] = useState<string | undefined>(undefined);
<input value={val} onChange={e => setVal(e.target.value)} />
// First render: value=undefined (uncontrolled), then value="x" (controlled) → React warning

// ✅ Pick one — null for controlled, omit for uncontrolled
<input value={val ?? ''} onChange={e => setVal(e.target.value)} />
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| No default reducer in state reducer pattern | Forces consumer to implement entire state machine | Always provide and export `defaultReducer` |
| Checking `open !== undefined` once then not re-checking | Controlled state can become undefined if consumer removes prop | Check on every render |
| State reducer mutating state | Pure reducer requirement — bugs from shared references | Always return new object or `state` unchanged |
| Not exporting `defaultReducer` | Consumer can't compose their override with defaults | Export it: `export { defaultToggleReducer }` |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "let consumers customize component behavior", "override state transitions", "controlled vs uncontrolled"
- → Nhớ đến: state reducer for behavioral override, controlled props for full consumer ownership
- → Mở đầu trả lời: "I'd use the state reducer pattern — the component manages state by default, but the consumer can pass a custom reducer to intercept and override any specific state transition without rebuilding the whole component."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [useReducer, Context](./03-hooks-deep-dive.md)
- ➡️ Để hiểu: [Third-party library design, Radix UI patterns]

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: When would you choose compound components over a single component with many props? 🟢 Junior

**A:** When the *layout* between sub-parts needs to be flexible. If consumers need to insert other elements between sub-components, or if different consumers need radically different structures, compound components are the right choice.

```tsx
// Props-based: rigid layout
<Tabs tabs={[...]} panels={[...]} showTabsInHeader />

// Compound: flexible layout
<Tabs defaultTab="home">
  <Header>
    <Logo />
    <Tabs.List>     {/* tabs in header */}
      <Tabs.Tab value="home">Home</Tabs.Tab>
    </Tabs.List>
  </Header>
  <Tabs.Panel value="home">Content</Tabs.Panel>
</Tabs>
```

**Giải thích:** Props-based components kiểm soát layout — mọi thứ phải vừa vặn với cấu trúc được thiết kế sẵn. Compound components nhường layout cho consumer, component chỉ cung cấp state và behavior. Dấu hiệu cần compound components: khi người dùng yêu cầu "đặt tab ở sidebar thay vì header."

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Identifies "flexible layout" as the key trigger, mentions the context mechanism, gives a concrete before/after
- ❌ Weak: "compound components are more flexible" without explaining *what* flexibility they enable

---

### Q: Explain the difference between render props and custom hooks. When would you still choose render props? 🟡 Mid

**A:** Both share *logic* — the difference is where JSX lives.

**Custom hook:** Logic returns data/functions. Consumer uses them anywhere in their JSX. Flat composition — multiple hooks side by side, no nesting.

**Render prop:** Logic *calls* a function to render — the logic and the JSX stay coupled, but the component owns the container DOM structure.

```tsx
// Hook — flat, composable
function TrackingPage() {
  const { x, y } = useMousePosition(); // logic extracted
  const { data } = useUserData();       // compose freely
  return <div>Mouse at {x},{y}, User: {data?.name}</div>;
}

// Render prop — still wins when the container DOM matters
<ResizablePanels>
  {({ leftWidth, rightWidth }) => (
    <>
      <Panel width={leftWidth}><LeftContent /></Panel>
      <Panel width={rightWidth}><RightContent /></Panel>
    </>
  )}
</ResizablePanels>
```

Use render props when: (1) the logic needs to control a DOM container with event listeners, (2) you need to provide a ref to consumer elements, (3) the container's JSX structure is integral to the behavior (drag and drop, portals, intersection observers).

**Giải thích:** Custom hooks thắng trong 90% trường hợp vì không tạo wrapper component trong tree. Render props vẫn hữu ích khi behavior phụ thuộc vào DOM container — như IntersectionObserver cần ref trực tiếp trên element.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Explains the "where does JSX live" distinction, names a specific case where render props win (DOM ref), shows both patterns
- ❌ Weak: "hooks are just better than render props" — misses the DOM coupling use case

---

### Q: What is the State Reducer pattern and how does it solve "prop sprawl"? 🟡 Mid

**A:** State Reducer is IoC (Inversion of Control) for component state. Instead of adding a new prop for every behavioral edge case, the component exposes its state transition function — the consumer intercepts only the transitions they care about.

```tsx
// Without state reducer: prop accumulation over time
<Combobox
  closeOnEscape        // feature request 1
  reopenOnBackspace    // feature request 2
  limitSelections={3}  // feature request 3
  // ...12 more props
/>

// With state reducer: consumer handles their own case
<Combobox
  stateReducer={(state, action) => {
    if (action.type === 'CLOSE' && action.source === 'escape') {
      return state; // don't close on escape in my use case
    }
    return defaultComboboxReducer(state, action);
  }}
/>
```

**Giải thích:** Thay vì mỗi edge case thêm 1 prop vào component, State Reducer để consumer "hook into" bất kỳ state transition nào. Component vẫn dễ dùng với defaults, power users không cần fork library.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Names "IoC for state transitions", shows the prop-sprawl problem it solves, explains why `defaultReducer` export matters
- ❌ Weak: Confuses state reducer pattern with just using `useReducer`

---

### Q: How do you implement controlled and uncontrolled variants of a component? What's the "hybrid" pattern? 🔴 Senior

**A:** The hybrid pattern (used by React's `<input>`, Radix UI, Headless UI) provides both `defaultValue` (uncontrolled) and `value + onChange` (controlled). The component detects which mode it's in on mount.

```tsx
function useControllable<T>({
  value: controlledValue,
  defaultValue,
  onChange,
}: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<T>(defaultValue);

  const value = isControlled ? controlledValue : internalValue;

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const nextValue = typeof next === 'function' ? (next as (prev: T) => T)(value) : next;
      if (!isControlled) setInternalValue(nextValue);
      onChange?.(nextValue);
    },
    [isControlled, onChange, value]
  );

  return [value, setValue] as const;
}

// Usage in Dropdown
function Dropdown({ open, defaultOpen = false, onOpenChange, children }: DropdownProps) {
  const [isOpen, setIsOpen] = useControllable({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <div>
      <button onClick={() => setIsOpen(v => !v)}>Toggle</button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}
```

Edge cases to handle:
- **Warn on control switching**: use `useEffect` to warn if `open` changes from defined to undefined (switching modes is a bug)
- **`isControlled` must be stable**: determine on mount, don't re-check every render in the controlling logic

**Giải thích:** `useControllable` là helper tái sử dụng giúp bất kỳ component nào support cả 2 chế độ. Consumer dùng `defaultOpen` cho simplicity, dùng `open + onOpenChange` khi cần sync với URL/Redux/animation state.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Extracts `useControllable` as a reusable hook, handles both value forms (`T` and `(prev: T) => T`), mentions the "warn on switching modes" best practice
- ❌ Weak: Just adds an `if (controlledValue !== undefined)` check inline without extracting the pattern

---

### Q: Design a type-safe, accessible `<Select>` component using compound components and the state reducer pattern. 🔴 Senior

**A:** This is a system design question — focus on the architecture decisions, not a complete implementation.

```tsx
// Architecture:
// 1. SelectContext — shares: value, onChange, isOpen, activeIndex, options registry
// 2. Compound sub-components: Select.Trigger, Select.Portal, Select.Content, Select.Option
// 3. Controlled + uncontrolled via useControllable
// 4. State reducer for behavioral customization
// 5. Keyboard navigation managed in Select root

type SelectState = {
  isOpen: boolean;
  activeIndex: number;
};

type SelectAction =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'SELECT'; value: string }
  | { type: 'MOVE'; direction: 'up' | 'down' };

interface SelectProps<T extends string = string> {
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  stateReducer?: (state: SelectState, action: SelectAction) => SelectState;
  children: ReactNode;
}

function Select<T extends string>({
  value,
  defaultValue,
  onValueChange,
  stateReducer = defaultSelectReducer,
  children,
}: SelectProps<T>) {
  const [selectedValue, setSelectedValue] = useControllable({
    value,
    defaultValue: defaultValue ?? '' as T,
    onChange: onValueChange,
  });

  const [uiState, dispatch] = useReducer(stateReducer, { isOpen: false, activeIndex: 0 });
  const optionsRef = useRef<Map<string, { label: string; index: number }>>(new Map());

  // Keyboard navigation
  useEffect(() => {
    if (!uiState.isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') dispatch({ type: 'MOVE', direction: 'down' });
      if (e.key === 'ArrowUp') dispatch({ type: 'MOVE', direction: 'up' });
      if (e.key === 'Escape') dispatch({ type: 'CLOSE' });
      if (e.key === 'Enter') {
        const active = [...optionsRef.current.entries()][uiState.activeIndex];
        if (active) setSelectedValue(active[0] as T);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [uiState.isOpen, uiState.activeIndex]);

  return (
    <SelectContext.Provider value={{ selectedValue, setSelectedValue, uiState, dispatch, optionsRef }}>
      {children}
    </SelectContext.Provider>
  );
}

// Sub-components
Select.Trigger = function SelectTrigger({ children }: { children: ReactNode }) {
  const { uiState, dispatch, selectedValue } = useSelect();
  return (
    <button
      aria-haspopup="listbox"
      aria-expanded={uiState.isOpen}
      onClick={() => dispatch({ type: uiState.isOpen ? 'CLOSE' : 'OPEN' })}
    >
      {selectedValue || children}
    </button>
  );
};

Select.Option = function SelectOption({ value, children }: { value: string; children: ReactNode }) {
  const { selectedValue, setSelectedValue, optionsRef, dispatch } = useSelect();
  // register option
  useEffect(() => {
    const idx = optionsRef.current.size;
    optionsRef.current.set(value, { label: String(children), index: idx });
    return () => { optionsRef.current.delete(value); };
  }, [value]);

  return (
    <div
      role="option"
      aria-selected={selectedValue === value}
      onClick={() => { setSelectedValue(value); dispatch({ type: 'CLOSE' }); }}
    >
      {children}
    </div>
  );
};
```

Key architecture decisions:
- **Options registry via ref** — avoids re-renders when options mount/unmount
- **State reducer** — consumers customize behavior (e.g., multi-select, async loading) without props
- **Controlled + uncontrolled** — via `useControllable`
- **Accessibility** — `aria-haspopup`, `aria-expanded`, `role="option"` built in

**Giải thích:** Không cần implement hoàn chỉnh trong phỏng vấn — quan trọng là trình bày được kiến trúc: compound components + context cho flexibility, state reducer cho behavioral customization, useControllable cho cả 2 usage modes, accessibility concerns từ đầu.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Identifies options registry pattern (ref vs state to avoid re-renders), mentions accessibility, designs state shape before writing code, names all 3 patterns being combined
- ❌ Weak: Goes straight to writing JSX without discussing architecture tradeoffs first

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"What is the compound component pattern and when would you use it over a prop-based API?"**

**30 giây đầu — mở đầu lý tưởng:**
1. "Compound components let parent and child components share implicit state through context — like how `<select>` and `<option>` work together in HTML."
2. "The key insight is that the parent owns state and provides it via context; children read from context without needing explicit props."
3. "I'd choose compound components when consumers need layout flexibility — when they need to put sub-parts in different places, or insert their own elements between them."
4. "The alternative — a single component with many props — collapses when you get feature requests like 'put the tab list in the sidebar' or 'add a badge between tabs.'"

---

## Self-Check / Tự Kiểm Tra ⚡ (Đóng tài liệu lại trước khi làm)

- [ ] **Retrieval**: Viết cấu trúc compound component (Parent + Context + Child) từ trí nhớ — không nhìn lại.
- [ ] **Visual**: Vẽ sơ đồ: trong compound component, state flow từ đâu đến đâu? (Parent → Context → Children?)
- [ ] **Application**: Bạn cần build `<Modal>` với `<Modal.Trigger>`, `<Modal.Content>`, `<Modal.CloseButton>` — viết phần Context + Provider.
- [ ] **Debug**: `useContext(TabsContext)` trả về `undefined` — component này đang được render ở đâu? Cách fix?
- [ ] **Teach**: Giải thích sự khác biệt giữa render props và custom hooks cho một developer mới bằng 2 câu.

💬 **Feynman Prompt:** Giải thích tại sao State Reducer pattern tốt hơn việc thêm nhiều props, dùng ví dụ đời thường (không phải code).

🔁 **Spaced Repetition reminder:** Review lại file này sau 3 ngày, rồi 7 ngày, rồi 14 ngày.
