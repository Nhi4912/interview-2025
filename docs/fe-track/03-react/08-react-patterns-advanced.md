# Advanced React Patterns / Mẫu React Nâng Cao

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **Prerequisites**: [Hooks Deep Dive](./03-hooks-deep-dive.md), [Advanced Patterns](./04-advanced-patterns.md)
> **See also**: [Performance Optimization](./09-performance-optimization.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Shopee's design system team hit a classic scaling problem. Their `<Dropdown>` component started with 5 props. After 2 years and 20+ product teams using it, it had 38 props: `closeOnEscape`, `keepMountedOnClose`, `disablePortal`, `multiSelect`, `virtualize`, `onOpenChange`, `asyncSearch`... Each new feature request added a prop.

The root problem: the component tried to anticipate every use case. The fix was a pattern migration:
- **State Reducer**: consumers customize *transitions* without new props
- **Control Props**: consumers own state when they need to sync with external systems
- **Compound Components**: consumers compose *layout* freely
- **Headless hook**: `useDropdown()` exposes behavior, zero UI

After the refactor: core component shrank from 38 props to 8. Product teams extended behavior without touching the library. The 38-prop API was a symptom — the root cause was the wrong pattern for the problem.

---

## What & Why / Cái Gì & Tại Sao

**English:** Advanced patterns solve the "impossible component" problem at scale — when a single component cannot accommodate all use cases through props alone. Each pattern shifts *different kinds* of control from the author to the consumer.

**Tiếng Việt:** Các pattern nâng cao giải quyết vấn đề "component không thể scale" — khi một component đơn lẻ không đáp ứng mọi use case. Mỗi pattern chuyển *loại kiểm soát khác nhau* từ tác giả sang người dùng component.

---

## Core Concept 1: Compound Components & Provider Pattern

> 🧠 **Memory Hook**: "Compound Components = HTML `<select>+<option>` — parent owns state, children read via invisible context wire"
>
> Provider pattern = dependency injection. Each `createContext` is a named injection token.

**Tại sao tồn tại? / Why does this exist?**

Single-component APIs fail when consumers need to control *layout* — where sub-parts go relative to other elements. Props can't express "put the tab list in the sidebar, panels in main content."
→ Why not just pass children? Because sub-components need to share implicit state (which tab is active) without explicit wiring.
→ Why not just prop-drill? Because intermediate components shouldn't know about the shared state.

**Key Points:**
- Compound components use `React.createContext` to share state between a parent and its child sub-components (e.g., `<Select>`, `<Select.Option>`), avoiding prop-drilling without exposing state publicly.
- The parent component owns the state and passes it via context; child components consume it via `useContext`. Always validate with a guard — throw immediately if context is null.
- Unlike a single monolithic component with many boolean props, compound components let consumers compose only the sub-components they need.
- Sub-components attached as static properties (`Tabs.Tab`, `Tabs.Panel`) are discoverable via autocomplete and make the family relationship explicit.
- **Provider pattern** supplies scoped data (theme, auth, locale) without prop drilling. It is React's built-in dependency injection. Default context value (set in `createContext(defaultValue)`) is only used when there is no matching Provider above — NOT the Provider's initial value.
- Context re-renders all consumers whenever the Provider's `value` prop changes by reference. The fix: `useMemo` or split into state/dispatch contexts.

```tsx
// Compound Components: Tabs example
const TabsContext = createContext<{ active: string; setActive: (t: string) => void } | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Must be used within <Tabs>');
  return ctx;
}

function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultTab);
  const value = useMemo(() => ({ active, setActive }), [active]);
  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}
Tabs.Tab = function Tab({ value, children }: { value: string; children: ReactNode }) {
  const { active, setActive } = useTabs();
  return <button aria-selected={active === value} onClick={() => setActive(value)}>{children}</button>;
};
Tabs.Panel = function Panel({ value, children }: { value: string; children: ReactNode }) {
  const { active } = useTabs();
  return active === value ? <div role="tabpanel">{children}</div> : null;
};

// Provider pattern: split state/dispatch to prevent unnecessary re-renders
const UserStateCtx = createContext<User | null>(null);
const UserDispatchCtx = createContext<React.Dispatch<Action> | null>(null);

function UserProvider({ children }: { children: ReactNode }) {
  const [user, dispatch] = useReducer(userReducer, null);
  return (
    <UserStateCtx.Provider value={user}>
      <UserDispatchCtx.Provider value={dispatch}>
        {children}
      </UserDispatchCtx.Provider>
    </UserStateCtx.Provider>
  );
}
// Components that only dispatch don't re-render when user state changes
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `<Provider value={{ user, setUser }}>` inline | New object every render → all consumers re-render | `useMemo(() => ({ user, setUser }), [user])` |
| Using `React.Children.map` to inject props | Breaks with wrapper divs, fragments, portals | Use context |
| Null-returning instead of throwing for missing context | Silent failure — consumer has no idea what went wrong | `throw new Error('Must be used within <Parent>')` |
| Using Context for high-frequency updates (every keystroke) | Blanket re-renders — all consumers update on each change | Zustand/Jotai for frequent updates |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "flexible component API", "avoid prop drilling", "design system"
- → Nhớ đến: compound components for layout flexibility, context for state sharing
- → Mở đầu trả lời: "I'd use compound components — the parent owns state in context, sub-components read what they need, and consumers control the layout entirely."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Context, useState](./03-hooks-deep-dive.md)
- ➡️ Để hiểu: [State Reducer pattern, Control Props]

---

## Core Concept 2: HOCs, Render Props & Custom Hooks

> 🧠 **Memory Hook**: "Evolution: HOC (2015) → Render Props (2017) → Custom Hooks (2019). Each solved the previous one's main problem."
>
> HOC: wrapper hell in DevTools. Render Props: nesting hell in JSX. Hooks: flat, composable.

**Tại sao tồn tại? / Why does this exist?**

Cross-cutting behavior (auth, logging, data fetching) needs to be shared without inheritance. Class components couldn't share stateful logic — HOCs and render props were the workaround.
→ Why did hooks replace them? Because hooks share logic without creating wrapper components in the tree.
→ Why do render props still exist? When the shared behavior needs to own a DOM container (drag-and-drop, intersection observer).

**Key Points:**
- HOC pitfalls: (1) prop name collision — injected `user` prop overwrites consumer's `user`, (2) DevTools noise — anonymous wrappers, (3) static method loss — use `hoistNonReactStatics`, (4) ref blocking — requires `React.forwardRef`.
- Always set `displayName`: `EnhancedComponent.displayName = \`withAuth(\${getDisplayName(WrappedComponent)})\``.
- **Render prop** = inversion of control for rendering. The component owns *behavior*; consumer owns *rendering*. Core performance gotcha: inline arrow in render prop (`render={() => <Comp />}`) creates new function every render, breaks `React.memo` inside child. Use `useCallback` or extract function outside.
- **Custom hooks** achieve the same cross-cutting concerns with zero component tree overhead, no prop collisions, full TypeScript inference. Default to hooks; use render props only when the behavior must control a specific DOM container.

```tsx
// HOC: cross-cutting concern applied at definition site
function withAuth<P extends { user: User }>(Component: React.ComponentType<P>) {
  const WithAuth = (props: Omit<P, 'user'>) => {
    const user = useCurrentUser();
    if (!user) return <Navigate to="/login" />;
    return <Component {...(props as P)} user={user} />;
  };
  WithAuth.displayName = `withAuth(${Component.displayName ?? Component.name})`;
  return WithAuth;
}

// Render prop: when behavior must provide a ref to consumer's DOM element
function InView({ children, onEnter }: {
  children: (ref: React.Ref<HTMLDivElement>) => ReactNode;
  onEnter: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) onEnter(); });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [onEnter]);
  return <>{children(ref)}</>;
}

// Custom hook: same logic, no JSX coupling
function useInView(onEnter: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) onEnter(); });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [onEnter]);
  return ref;
}
// Usage: const ref = useInView(trackImpression); <article ref={ref}>...</article>
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| HOC not forwarding refs | Consumer can't get ref to inner DOM node | Add `React.forwardRef` wrapper |
| HOC not calling `hoistNonReactStatics` | Static methods on original component are lost | `hoistNonReactStatics(EnhancedComponent, WrappedComponent)` |
| Inline function in render prop | New reference every render → child re-renders always | `useCallback` or extract function outside component |
| Render props when a hook suffices | Unnecessary JSX nesting | Prefer custom hook; use render prop only for DOM-ref sharing |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "HOC vs hooks", "share logic between components", "render props"
- → Nhớ đến: hooks for 90% of cases, render props for DOM container ownership, HOCs for legacy/decorator
- → Mở đầu trả lời: "I'd use a custom hook — same logic reuse as render props and HOCs but with flat composition and no tree overhead. I'd only reach for render props if the behavior needs to provide a ref to consumer elements."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [useEffect, useRef, custom hooks](./03-hooks-deep-dive.md)
- ➡️ Để hiểu: [Headless component design, prop getters]

---

## Core Concept 3: State Reducer, Control Props & Headless Components

> 🧠 **Memory Hook**: "State Reducer = IoC for state transitions. Control Props = consumer owns the source of truth. Headless = behavior without pixels."
>
> Three levels of control: what transitions happen (state reducer), what the value is (control props), what it looks like (headless).

**Tại sao tồn tại? / Why does this exist?**

Complex components (combobox, date picker) are impossible to make fully configurable with props alone — there are infinite valid behaviors. Inversion of control is the only scalable answer.
→ Why not just add more props? Each edge case prop becomes a maintenance burden and API complexity — you're back to 38 props.
→ Why three separate patterns? Each controls a different axis: *transitions* (state reducer), *values* (control props), *rendering* (headless).

**Key Points:**
- **State Reducer**: library computes proposed next state, then calls consumer's `stateReducer(state, action)`. Consumer returns final state — either unchanged or modified. Must export `defaultReducer` so consumers can fall through for unmodified actions.
- **Control Props**: `const isControlled = value !== undefined; const current = isControlled ? value : internal;`. Never call `setState` when controlled. `defaultValue` is read only once on mount — changing it after has no effect.
- React warns when component switches from uncontrolled to controlled at runtime. Emit the same warning in custom components.
- **Headless components**: provide behavior + accessibility (keyboard navigation, ARIA, focus management), render nothing. Implemented as hooks + prop getters. Consumer applies prop getters to their own markup.
- **Prop getters**: return pre-merged props object including event handlers and ARIA attributes. Call consumer handler *before* internal — lets consumer call `event.preventDefault()` to abort.
- Headless vs styled (MUI/Chakra): headless = full visual freedom but more boilerplate. Styled = fast but tied to their design system. Choose based on design constraints.

```tsx
// State Reducer: consumer overrides specific transitions
function useToggle({
  stateReducer = (state: { isOpen: boolean }, action: { type: string; changes: { isOpen: boolean } }) => action.changes,
  initialOpen = false,
} = {}) {
  const [state, setState] = useState({ isOpen: initialOpen });

  function dispatch(action: { type: string; changes: { isOpen: boolean } }) {
    const next = stateReducer(state, action);
    setState(next);
  }

  return {
    isOpen: state.isOpen,
    toggle: () => dispatch({ type: 'TOGGLE', changes: { isOpen: !state.isOpen } }),
    open: () => dispatch({ type: 'OPEN', changes: { isOpen: true } }),
    close: () => dispatch({ type: 'CLOSE', changes: { isOpen: false } }),
  };
}

// Consumer: override to prevent closing on certain actions
const { isOpen, toggle } = useToggle({
  stateReducer(state, action) {
    if (action.type === 'CLOSE' && someCondition) return state; // prevent close
    return action.changes;
  }
});

// Control Props: dual-mode (controlled + uncontrolled)
function useControllable<T>({ value, defaultValue, onChange }: {
  value?: T; defaultValue: T; onChange?: (v: T) => void;
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const current = isControlled ? value! : internal;

  function set(next: T) {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }
  return [current, set] as const;
}

// Headless hook + prop getters
function useDisclosure() {
  const [isOpen, setIsOpen] = useState(false);

  function getTriggerProps(userProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {}) {
    return {
      'aria-expanded': isOpen,
      'aria-haspopup': 'dialog' as const,
      ...userProps,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        userProps.onClick?.(e);          // consumer first
        if (!e.defaultPrevented) setIsOpen(v => !v); // then internal
      },
    };
  }

  function getDialogProps(userProps: React.HTMLAttributes<HTMLDivElement> = {}) {
    return {
      role: 'dialog' as const,
      'aria-modal': true,
      ...userProps,
    };
  }

  return { isOpen, getTriggerProps, getDialogProps, close: () => setIsOpen(false) };
}

// Consumer — full control over rendering
function Modal({ children }: { children: ReactNode }) {
  const { isOpen, getTriggerProps, getDialogProps, close } = useDisclosure();
  return (
    <>
      <button {...getTriggerProps()}>Open</button>
      {isOpen && (
        <div {...getDialogProps()}>
          {children}
          <button onClick={close}>Close</button>
        </div>
      )}
    </>
  );
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Not exporting `defaultReducer` | Consumer can't compose their override with defaults | `export { defaultToggleReducer }` |
| State reducer mutating state | Pure reducer — mutations cause subtle bugs | Always return new object or unchanged `state` |
| `defaultValue` used to reset component | Only read once on mount — changing it after has no effect | Use `key` prop to force remount for reset |
| Prop getter's internal handler called first | Consumer can't `preventDefault` to abort behavior | Always call user handler before internal handler |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "customize component behavior without forking", "controlled vs uncontrolled", "headless library design"
- → Nhớ đến: state reducer for behavioral customization, control props for value ownership, headless for UI independence
- → Mở đầu trả lời: "I'd use the state reducer pattern — the library manages state transitions by default but calls the consumer's reducer so they can override any specific transition without needing the library to add a new prop."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [useReducer, useRef](./03-hooks-deep-dive.md)
- ➡️ Để hiểu: [Design system architecture, Radix UI patterns]

---

## Pattern Selection Matrix / Ma Trận Chọn Pattern

```
AXIS OF VARIABILITY → PATTERN

  What varies?        Best pattern         Why
  ─────────────────────────────────────────────────────────────
  Layout only         Compound Components  Sub-components composable anywhere
  Behavior only       Custom Hook          Logic extracted, consumer renders
  Both layout + beh.  Compound + Hook      Hook inside compound components
  State transitions   State Reducer        Consumer overrides specific actions
  Value source        Control Props        Consumer owns state when needed
  Rendering entirely  Headless Hook        Behavior/accessibility, no UI
  Cross-cutting       HOC                  Legacy/decorator at definition site

  Scale of use:
  1-2 levels deep     Plain props          Most readable
  Deep tree, infreq.  Context Provider     Built-in DI
  Deep tree, frequent Zustand/Jotai        Selective subscriptions
```

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What are compound components and when should you use them? 🟢 Junior

**A:** Compound components are a set of components that share implicit state through React Context. A parent component manages state and exposes it to child sub-components via context, without requiring consumers to wire props manually. Classic examples are `<Select>/<Select.Option>`, `<Tabs>/<Tab>/<TabPanel>`, or `<Accordion>/<Accordion.Item>`.

**Use compound components when:** (1) multiple sub-components need to share state without prop drilling, (2) you want a flexible composition API that lets consumers reorder or conditionally render sub-components, (3) you're building a reusable component library where the parent-child relationship needs to be explicit.

**Tiếng Việt:** Dùng compound components khi nhiều sub-component cần chia sẻ state và consumer cần linh hoạt về layout. Phổ biến trong design systems (Tabs, Accordion, Select).

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Mentions context as the mechanism, gives a real example with sub-component layout flexibility, compares to prop-based API and explains what breaks
- ❌ Weak: "compound components are more flexible" without explaining the mechanism or the layout flexibility benefit

---

### Q: What problem does the render props pattern solve, and when has it been superseded by hooks? 🟡 Mid

**A:** Render props solve the problem of sharing stateful behavior (mouse position, form validation, resize observer) between components without inheritance. A component calls a consumer-provided function with its internal state: `<Mouse render={({ x, y }) => <Tracker x={x} y={y} />} />`.

**When hooks supersede render props:** For most "share stateful logic" use cases, a custom hook is simpler, less nested, and easier to compose. `const { x, y } = useMouse()` replaces the entire `<Mouse render={...}>` pattern.

**When render props remain relevant:** (1) When the behavior must produce conditional JSX that depends on the behavior's state, (2) when supporting class components that cannot call hooks, (3) when the behavior needs to own a specific DOM container (intersection observer, drag source/target).

**Performance gotcha:** Inline render prop functions create new references on every parent render, breaking `React.memo` inside the child. Use `useCallback` or move the function outside the component to fix this.

**Tiếng Việt:** Render props giải quyết chia sẻ stateful behavior. Hooks thay thế hầu hết use case, nhưng render props vẫn hữu ích khi behavior cần DOM container hoặc khi hỗ trợ class components.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Names the performance pitfall (inline arrow), explains the "DOM container" use case where render props win, distinguishes from hooks clearly
- ❌ Weak: "hooks replaced render props" without explaining why render props still exist or the performance issue

---

### Q: What are the main pitfalls of Higher-Order Components (HOCs) and why has the community moved toward hooks? 🔴 Senior

**A:** HOCs have four well-known production pitfalls:

1. **Prop name collision:** If a HOC injects a `user` prop and the wrapped component already receives a `user` prop from its parent, the HOC silently overwrites it. Custom hooks avoid this since the consumer names returned values themselves.
2. **Invisible prop flow:** In React DevTools, a HOC chain (`withAuth(withLogging(withTheme(Component)))`) creates multiple anonymous wrapper layers, making it hard to trace which props come from where. Requires explicit `displayName` setting.
3. **Static method loss:** `Component.staticMethod` does not transfer to the HOC-wrapped component automatically. Must use `hoistNonReactStatics`.
4. **Ref forwarding complexity:** Without `React.forwardRef`, consumers cannot get a ref to the inner component.

**Why hooks are better:** Same cross-cutting concerns (auth, logging, theme) with zero component tree overhead, no prop collisions, full TypeScript inference. HOCs are still the right choice for class component codebases and decorator-style patterns at the definition site.

**Tiếng Việt:** Bốn vấn đề HOC: name collision, DevTools noise, static method mất, ref không forward. Hooks giải quyết tất cả — HOC vẫn cần cho class components.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Can name all 4 pitfalls with solutions (displayName, hoistNonReactStatics, forwardRef), explains *why* hooks solve them, acknowledges when HOCs are still valid
- ❌ Weak: "HOCs are bad, use hooks" without being able to explain the specific technical pitfalls

---

### Q: Why does React Context cause unnecessary re-renders and how do you fix it? 🟡 Mid

**A:** Every component that calls `useContext(MyContext)` re-renders whenever the Provider's `value` prop changes by reference — even if the specific piece of data that component uses hasn't changed.

**Common mistake:** `<UserContext.Provider value={{ user, setUser }}>` creates a new object literal on every parent render, causing all consumers to re-render even when `user` and `setUser` are identical.

**Fixes:**
1. `useMemo`: `const value = useMemo(() => ({ user, setUser }), [user]);`
2. **Split contexts**: separate `UserStateContext` (state) from `UserDispatchContext` (setter). Components that only dispatch subscribe only to dispatch context and never re-render on state changes.
3. For very high-frequency updates, use Zustand, Jotai, or a selector-based library — they avoid blanket re-renders entirely.

**Tiếng Việt:** Context re-render toàn bộ consumer khi `value` thay đổi reference. Dùng `useMemo` hoặc tách state/dispatch context. Zustand/Jotai tốt hơn khi update thường xuyên.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Explains the reference equality root cause, demonstrates state/dispatch split pattern, names alternatives (Zustand) for high-frequency cases
- ❌ Weak: "wrap with useMemo" without explaining why the reference equality matters or the state/dispatch split

---

### Q: Explain the State Reducer pattern and when is it the right choice? 🔴 Senior

**A:** The State Reducer pattern (popularized by Kent C. Dodds with Downshift) lets consumers intercept and override state transitions by passing a custom `stateReducer` function: `useToggle({ stateReducer: myReducer })`.

**How it works:** The component computes the proposed next state from an action, then calls the consumer's `stateReducer(currentState, { type, changes })`. The consumer returns the final state — either the proposed `changes` unchanged, or a modified version.

**Example:** A `useCombobox` hook normally closes the dropdown on item click. With state reducer, a multi-select consumer overrides `ItemClick` to keep it open: `return action.type === 'ItemClick' ? { ...changes, isOpen: true } : changes;`

**When to prefer simpler alternatives:** For a single behavior override, an `onToggle` callback or a boolean prop is much simpler. Use state reducer only when you cannot predict which transitions the consumer may need to override.

**Tiếng Việt:** State Reducer cho consumer override state transition tùy ý — lý tưởng cho library cần flexibility cao mà không thể dự đoán trước edge case. Với override đơn giản, callback bình thường đủ rồi.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Explains the "proposed state → consumer override → final state" flow, gives the multi-select example, names when NOT to use it (single override), mentions exporting defaultReducer
- ❌ Weak: Confuses state reducer with just using `useReducer`, or describes it as "passing a reducer to useReducer"

---

### Q: How do you implement a type-safe polymorphic component in TypeScript? 🔴 Senior

**A:** A polymorphic component accepts an `as` prop that changes the rendered element type, with TypeScript ensuring the element's own props are also valid.

```tsx
type PolymorphicProps<C extends React.ElementType, OwnProps = {}> = OwnProps &
  Omit<React.ComponentPropsWithoutRef<C>, keyof OwnProps> & { as?: C };

function Text<C extends React.ElementType = 'span'>({
  as,
  ...props
}: PolymorphicProps<C, { size?: 'sm' | 'lg' }>) {
  const Component = as ?? 'span';
  return <Component {...props} />;
}

// ✅ Accepts href (valid for <a>)
<Text as="a" href="/home">Link</Text>

// ✅ Accepts onClick (valid for <button>)
<Text as="button" onClick={fn}>Button</Text>

// ❌ TypeScript error: href is not valid for <span>
<Text href="/home">Span</Text>
```

`Omit<React.ComponentPropsWithoutRef<C>, keyof OwnProps>` prevents conflicts between custom props (`size`) and native element props. Adding `forwardRef` to this pattern requires a type cast — many libraries skip it for simplicity.

**Tiếng Việt:** Generic `C extends React.ElementType` + `React.ComponentPropsWithoutRef<C>` cho phép TypeScript biết props nào hợp lệ theo `as` prop. `Omit` tránh conflict với custom props.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Can write the generic signature, explains the `Omit` necessity, mentions the forwardRef complication
- ❌ Weak: Just accepts `as?: React.ElementType` without the generic — loses type safety for element-specific props

---

### Q: How would you decide between compound components, render props, and a custom hook for a reusable Accordion? 🔴 Senior

**A:** Pattern selection is axis-of-variability analysis:

**Custom hook only (`useAccordion`):** Best when consumers fully control render structure. Returns `{ openItems, toggle, getItemProps }`. Zero JSX coupling — consumers build any UI they want. Good for design systems with strong visual constraints per product.

**Compound components:** Best when you want structured, semantic composition with clear sub-component roles. Consumers get `<Accordion.Item>/<Accordion.Trigger>/<Accordion.Content>` and sub-components handle ARIA roles automatically. This is what Radix UI does.

**Render props:** Adds nothing over a hook for this use case today. Only choose if supporting class components.

**Best answer:** Compound components for the high-level API (easy to use, semantic, accessible by default), backed by a custom hook (logic is independently testable). The compound components call the hook internally. This is the Radix UI architecture: every primitive has a headless hook + compound component API.

**Tiếng Việt:** Compound components cho API cấp cao dễ dùng; custom hook cho logic testable độc lập. Kết hợp cả hai: compound components gọi hook nội bộ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Uses "axis of variability" framing, recommends compound + hook combination as the architecture, mentions Radix UI as validation
- ❌ Weak: Just picks one pattern without explaining the decision criteria or acknowledging the combination approach

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"You're building a combobox component for a design system. Walk me through which React patterns you'd use and why."**

**30 giây đầu — mở đầu lý tưởng:**
1. "I'd combine compound components with a headless hook — the hook owns the state machine (open/close, active index, keyboard navigation, ARIA), and the compound components provide the structured API: `<Combobox>`, `<Combobox.Trigger>`, `<Combobox.Option>`."
2. "The hook exposes prop getters — `getTriggerProps()` and `getOptionProps(value)` — that return pre-merged ARIA attributes and event handlers, so consumers don't need to know the accessibility requirements."
3. "I'd implement control props so consumers can use it in both controlled mode (`value + onValueChange`) and uncontrolled mode (`defaultValue`), which is required for React Hook Form integration."
4. "For behavioral customization — like keeping the dropdown open after selection for multi-select — I'd implement the state reducer pattern so consumers can override specific transitions without the library needing a `multiSelect` prop."

---

## Self-Check / Tự Kiểm Tra ⚡ (Đóng tài liệu lại trước khi làm)

- [ ] **Retrieval**: Kể tên 4 HOC pitfalls từ trí nhớ với giải pháp cho mỗi cái.
- [ ] **Visual**: Vẽ sơ đồ luồng State Reducer: ai tính proposed state? Ai return final state? Thứ tự?
- [ ] **Application**: Bạn cần build `<Select>` hỗ trợ cả single và multi-select mà không thêm `multiSelect` prop — dùng pattern nào?
- [ ] **Debug**: Context consumers re-render mỗi khi parent của Provider render, mặc dù state không đổi. Nguyên nhân và fix?
- [ ] **Teach**: Giải thích State Reducer pattern cho junior developer bằng 1 analogy đời thường.

💬 **Feynman Prompt:** Giải thích tại sao compound components tốt hơn một component với 20 boolean props — dùng ví dụ restaurant menu vs set menu.

🔁 **Spaced Repetition reminder:** Review lại file này sau 3 ngày, rồi 7 ngày, rồi 14 ngày.
