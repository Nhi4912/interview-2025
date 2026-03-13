# Advanced React Patterns / Mẫu React Nâng Cao

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## React - Chapter 8

[← Previous](./07-hooks-comprehensive.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./09-performance-optimization.md)

---

## Tổng Quan / Overview

**English:** This chapter is rewritten in bilingual EN/VI format for interview preparation. It focuses on conceptual clarity, practical examples, and common interview traps.

**Tiếng Việt:** Chương này được viết lại theo định dạng song ngữ EN/VI để ôn luyện phỏng vấn. Nội dung tập trung vào hiểu bản chất, ví dụ thực tế và các bẫy thường gặp.

Xem thêm / Related: [01 React Fundamentals](./01-react-fundamentals.md), [03 Hooks Deep Dive](./03-hooks-deep-dive.md), [09 Performance](./09-performance-optimization.md).

## Table of Contents / Mục Lục
1. [Compound Components](#compound-components)
2. [Render Props](#render-props)
3. [Higher-Order Components](#higher-order-components)
4. [Provider Pattern](#provider-pattern)
5. [State Reducer Pattern](#state-reducer-pattern)
6. [Control Props Pattern](#control-props-pattern)
7. [Prop Getters](#prop-getters)
8. [Container and Presentational](#container-and-presentational)
9. [Headless Components](#headless-components)
10. [Polymorphic Components](#polymorphic-components)
11. [Pattern Selection Matrix](#pattern-selection-matrix)
12. [Interview Trade-off Narratives](#interview-trade-off-narratives)
13. [Câu Hỏi Phỏng Vấn / Interview Q&A](#câu-hỏi-phỏng-vấn--interview-qa)

---

## Compound Components

### Giải thích / Explanation

**English:** Compound APIs provide flexible composition with shared internal state.

**Tiếng Việt:** Compound API cho phép composition linh hoạt với state dùng chung.

### Key Points / Ý Chính
- Compound components use `React.createContext` to share state between a parent and its child sub-components (e.g., `<Select>`, `<Select.Option>`), avoiding prop-drilling without exposing state publicly. Tiếng Việt: Compound components dùng Context để chia sẻ state nội bộ giữa parent và các sub-component con mà không cần prop drilling.
- The parent component owns the state and passes it via context; child components consume it via `useContext`. This means children must be rendered inside the parent or they receive `undefined` context — always validate with a guard. Tiếng Việt: Children phải nằm trong parent, nếu không context sẽ là `undefined`; cần guard để báo lỗi sớm.
- Unlike a single monolithic component with many boolean props (`isOpen`, `hasLabel`, `hasClearButton`), compound components let consumers compose only the sub-components they need, producing a much cleaner API surface. Tiếng Việt: Thay vì một component nhận hàng chục boolean props, compound component cho phép consumer tự chọn sub-component cần dùng — API sạch hơn nhiều.
- Sub-components can be attached as static properties (`Tabs.Tab`, `Tabs.Panel`) or exported as named exports. Static properties are discoverable via autocomplete and make it clear which components belong to the family. Tiếng Việt: Dùng static property (`Tabs.Tab`) giúp IDE gợi ý và rõ ràng hơn về quan hệ giữa các component.
- A gotcha: wrapping child components in a `React.Fragment` or array is fine, but if a consumer wraps `<Select.Option>` inside a custom wrapper that doesn't forward the context, the option won't receive the shared state — document this constraint in your library. Tiếng Việt: Bọc sub-component bên trong wrapper tùy chỉnh mà không forward context sẽ phá vỡ pattern — cần document rõ.
- For type safety in TypeScript, export a union type of all valid child components and use it in the parent's `children` prop type, or use `React.ReactElement<typeof Select.Option>` to enforce correct usage at compile time. Tiếng Việt: Dùng TypeScript generic để ép kiểu `children` chỉ nhận sub-component hợp lệ — bắt lỗi sớm tại compile time.
- Performance consideration: if the shared context value is an object literal created inline, every re-render of the parent creates a new reference, re-rendering all consumers. Memoize the context value with `useMemo`. Tiếng Việt: Context value là object tạo inline sẽ gây re-render toàn bộ consumer mỗi lần parent render — dùng `useMemo` để tối ưu.
- Real-world usage: Radix UI, Headless UI, and React ARIA all use compound component patterns extensively, making them highly flexible while keeping accessibility logic centralized in the parent. Tiếng Việt: Các thư viện lớn như Radix UI đều dùng pattern này để giữ logic accessibility tập trung trong parent.

### Ví dụ / Example
```tsx
import { useState } from 'react';

type CounterProps = { initial?: number };

export function Counter({ initial = 0 }: CounterProps) {
  const [count, setCount] = useState(initial);
  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Render Props

### Giải thích / Explanation

**English:** Render props invert rendering control by passing render functions.

**Tiếng Việt:** Render props đảo quyền render bằng cách truyền hàm render.

### Key Points / Ý Chính
- A render prop is a function prop (often named `render` or `children`) that the component calls with its internal state or behavior, letting the consumer decide what to render. Example: `<Mouse render={({ x, y }) => <Cursor x={x} y={y} />} />`. Tiếng Việt: Render prop là một function prop mà component gọi với state nội bộ, để consumer quyết định hiển thị gì.
- The main trade-off vs. HOCs: render props avoid name collision and prop shadowing, but they create deeply nested JSX ("callback hell") when composing multiple render-prop components. Tiếng Việt: Render props tránh được name collision của HOC, nhưng khi lồng nhiều lớp sẽ gây callback hell trong JSX.
- A critical performance gotcha: if the render prop is an inline arrow function (e.g., `render={() => <Component />}`), a new function reference is created on every parent render, bypassing `React.memo` optimizations inside the child. Tiếng Việt: Arrow function inline tạo reference mới mỗi render, vô hiệu hóa `React.memo` bên trong child — dùng `useCallback` hoặc extract hàm ra ngoài.
- The `children`-as-function pattern (`{(state) => <JSX />}`) is syntactic sugar for render props and is widely used by libraries like React Router (`<Route>`) and Formik. It makes the API more ergonomic. Tiếng Việt: `children` dưới dạng function là một dạng render prop phổ biến, dùng trong React Router và Formik.
- Since hooks were introduced, most render prop use cases (mouse position, toggle state, resize observer) have been replaced by custom hooks, which are simpler to compose and read. Render props remain relevant for components that must render JSX conditionally based on behavior. Tiếng Việt: Custom hooks đã thay thế hầu hết use case của render props. Render props vẫn hữu ích khi cần trả về JSX có điều kiện từ behavior.
- Render props enable inversion of control: the component owns the behavior (mouse tracking, form validation) but delegates rendering to the consumer. This separation makes the behavioral component independently testable. Tiếng Việt: Inversion of control: component sở hữu behavior, consumer sở hữu rendering — dễ test behavior độc lập.
- Type the render prop correctly in TypeScript: `render: (state: MouseState) => React.ReactNode`. Using `ReactNode` (not `JSX.Element`) is more permissive and allows returning strings, null, or arrays. Tiếng Việt: Dùng `React.ReactNode` thay vì `JSX.Element` để render prop có thể trả về null, string, hoặc array.

### Ví dụ / Example
```tsx
import { useState } from 'react';

type CounterProps = { initial?: number };

export function Counter({ initial = 0 }: CounterProps) {
  const [count, setCount] = useState(initial);
  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Higher-Order Components

### Giải thích / Explanation

**English:** HOCs wrap components to inject cross-cutting behavior.

**Tiếng Việt:** HOC bọc component để tiêm hành vi cắt ngang.

### Key Points / Ý Chính
- A HOC is a function that takes a component and returns a new component with enhanced props or behavior: `const Enhanced = withLogger(BaseComponent)`. It is a pure function — it must not mutate the original component. Tiếng Việt: HOC là function nhận component và trả về component mới với behavior bổ sung — không được mutate component gốc.
- HOCs should always forward all unrelated props to the wrapped component using spread (`{...props}`). Forgetting to forward props is the most common HOC bug and causes silent failures where props silently disappear. Tiếng Việt: Quên forward props là lỗi phổ biến nhất với HOC — props bị nuốt âm thầm mà không báo lỗi.
- Use `React.forwardRef` inside a HOC if the wrapped component needs a `ref`. Without this, consumers cannot access the inner component's DOM node or instance through the HOC layer. Tiếng Việt: HOC chặn `ref` truyền vào — cần `React.forwardRef` để ref vẫn đến được component bên trong.
- Copy static methods from the wrapped component to the HOC using `hoistNonReactStatics` (from the `hoist-non-react-statics` library). React's own statics (like `displayName`) are excluded automatically, but custom statics will be lost otherwise. Tiếng Việt: Static methods của component gốc bị mất sau khi bọc HOC — dùng `hoistNonReactStatics` để sao chép chúng.
- Always set a meaningful `displayName` on the HOC result: `EnhancedComponent.displayName = \`withLogger(\${getDisplayName(WrappedComponent)})\``. This makes React DevTools readable instead of showing anonymous components. Tiếng Việt: Đặt `displayName` rõ ràng để React DevTools hiển thị tên component có nghĩa thay vì "Anonymous".
- HOCs are composed with `compose(withAuth, withLogging, withTheme)(Component)`, but the composition order matters: each HOC wraps the previous result, so props flow from outermost to innermost. Bugs from wrong composition order are hard to debug. Tiếng Việt: Thứ tự compose HOC ảnh hưởng đến luồng props — sai thứ tự gây bug khó debug.
- The main reason HOCs have fallen out of favor: they make the component tree harder to trace in DevTools (extra wrapper nodes), they risk prop name collisions, and custom hooks achieve the same cross-cutting concerns with zero wrapping overhead. Tiếng Việt: HOC tạo thêm lớp wrapper trong DevTools, dễ bị name collision, và custom hooks làm được điều tương tự mà không cần wrapper.
- HOCs are still useful for class components (which cannot use hooks) and for cases where behavior must be applied as a decorator pattern at the component definition site rather than at the usage site. Tiếng Việt: HOC vẫn hữu ích cho class components và khi cần áp dụng behavior như decorator tại nơi định nghĩa component.

### Ví dụ / Example
```tsx
import { useState } from 'react';

type CounterProps = { initial?: number };

export function Counter({ initial = 0 }: CounterProps) {
  const [count, setCount] = useState(initial);
  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Provider Pattern

### Giải thích / Explanation

**English:** Providers expose scoped capabilities and configuration via context.

**Tiếng Việt:** Provider cung cấp capability và config theo scope thông qua context.

### Key Points / Ý Chính
- The Provider pattern wraps part of the tree with a `Context.Provider` to supply scoped data (theme, auth, locale) without passing props through every level. It is the foundation of React's dependency injection. Tiếng Việt: Provider bọc một phần cây component để cung cấp data theo scope mà không cần prop drilling qua từng tầng.
- The default context value (set in `createContext(defaultValue)`) is only used when a component consumes the context without any matching Provider above it in the tree — it is NOT the initial value of the Provider. Tiếng Việt: Giá trị default trong `createContext` chỉ dùng khi không có Provider cha — không phải giá trị khởi tạo của Provider.
- Context re-renders all consumers whenever the Provider's `value` prop changes by reference. Passing `value={{ user, setUser }}` inline creates a new object every render — split into multiple contexts or memoize the value to prevent unnecessary re-renders. Tiếng Việt: Context re-render toàn bộ consumer khi `value` thay đổi reference — tách nhiều context hoặc `useMemo` để tối ưu.
- A common architectural pattern: separate the state context from the dispatch/action context. `UserStateContext` provides the current user; `UserDispatchContext` provides the `setUser` function. Components that only dispatch don't re-render when state changes. Tiếng Việt: Tách state context và dispatch context: component chỉ dispatch không bị re-render khi state thay đổi.
- Always create a custom hook (e.g., `useTheme`) that calls `useContext` and validates it is non-null. This prevents consumers from accidentally calling `useTheme()` outside the Provider and getting undefined silently. Tiếng Việt: Wrap `useContext` trong custom hook và validate non-null — tránh trường hợp dùng context ngoài Provider mà không báo lỗi.
- The Provider pattern is not a state management solution — it is a data distribution mechanism. For frequent global state updates (e.g., real-time counters), prefer Zustand, Jotai, or Redux which avoid blanket re-renders. Tiếng Việt: Context/Provider là cơ chế phân phối data, không phải state management — với state update thường xuyên hãy dùng Zustand hoặc Jotai.
- Nesting multiple Providers (auth, theme, locale, feature flags) at the app root is common but creates visual noise. The "Provider composition" trick: create a single `AppProviders` component that wraps all providers, keeping `main.tsx` clean. Tiếng Việt: Lồng nhiều Provider tại root gây rối — gom vào một `AppProviders` component để giữ `main.tsx` gọn gàng.

### Ví dụ / Example
```tsx
import { useEffect, useState } from 'react';

export function SearchBox() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const id = setTimeout(async () => {
      const data = await Promise.resolve(['react', 'fiber', query]);
      if (!cancelled) setResult(data);
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [query]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## State Reducer Pattern

### Giải thích / Explanation

**English:** Expose reducer hooks so consumers can intercept internal transitions.

**Tiếng Việt:** Mẫu state reducer cho phép consumer can thiệp transition nội bộ.

### Key Points / Ý Chính
- The State Reducer pattern (coined by Kent C. Dodds) allows consumers to intercept and override state transitions by passing a custom `stateReducer` function into the component or hook: `useToggle({ stateReducer: myReducer })`. Tiếng Việt: State Reducer pattern cho phép consumer can thiệp và override state transition bằng cách truyền một custom reducer vào component/hook.
- The component applies its internal reducer first to get the proposed next state, then calls the consumer's `stateReducer(currentState, action)` with both the action and the proposed next state. The consumer returns the final state (or the default). Tiếng Việt: Component tính toán next state trước, rồi gọi consumer's `stateReducer` để cho consumer cơ hội thay đổi kết quả.
- A practical use case: a `useCombobox` hook where clicking an option normally closes the menu. With state reducer, consumers can override the `ItemClick` action to keep the menu open for multi-select scenarios — without the hook needing a dedicated `multiSelect` prop. Tiếng Việt: Ví dụ thực tế: giữ dropdown mở sau khi chọn item (multi-select) mà không cần thêm prop vào hook gốc.
- The default reducer should be exported from the library so consumers can fall through to it for actions they don't want to override: `return stateReducer ? stateReducer(state, actionAndChanges) : actionAndChanges.changes`. Tiếng Việt: Export default reducer để consumer có thể gọi lại cho các action không cần override — không phải viết lại toàn bộ reducer.
- This pattern is the most powerful form of inversion of control in React: the library controls when state updates happen and what the action types are; the consumer controls what the new state values are. Tiếng Việt: Đây là inversion of control mạnh nhất: thư viện kiểm soát thời điểm update, consumer kiểm soát giá trị state mới.
- Trade-off: state reducer adds significant complexity. For most use cases, simpler options (controlled props, callbacks like `onToggle`) should be considered first. Use state reducer only when consumers need fine-grained control over arbitrary state transitions. Tiếng Việt: State reducer phức tạp — nếu chỉ cần override một vài transition, controlled props hoặc callback đơn giản hơn nhiều.
- Libraries that implement this pattern: Downshift (the origin of the pattern), React Table, and some Radix UI primitives. Understanding it helps when extending these libraries without forking them. Tiếng Việt: Downshift là thư viện gốc của pattern này — hiểu nó giúp extend Downshift/React Table mà không cần fork.

### Ví dụ / Example
```tsx
import { useState } from 'react';

type CounterProps = { initial?: number };

export function Counter({ initial = 0 }: CounterProps) {
  const [count, setCount] = useState(initial);
  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Control Props Pattern

### Giải thích / Explanation

**English:** Components can be controlled externally for predictable integrations.

**Tiếng Việt:** Component có thể được điều khiển từ ngoài để tích hợp ổn định.

### Key Points / Ý Chính
- A component is "controlled" when its value is driven entirely by props (`value` + `onChange`), and "uncontrolled" when it manages its own internal state via `defaultValue`. The control props pattern lets a single component support both modes. Tiếng Việt: Controlled = value từ props; uncontrolled = tự quản lý state. Control props pattern cho phép một component hỗ trợ cả hai chế độ.
- Implement dual-mode by checking if the controlled prop is defined: `const isControlled = value !== undefined; const currentValue = isControlled ? value : internalState;`. If controlled, never update internal state — the consumer owns it. Tiếng Việt: Kiểm tra `value !== undefined` để biết component đang ở chế độ nào — nếu controlled thì không được tự update internal state.
- React itself warns when a component switches between controlled and uncontrolled at runtime (e.g., `value` prop changes from `undefined` to a string). Emit the same warning in your custom component using `useEffect` to detect the transition. Tiếng Việt: Emit warning khi component chuyển từ uncontrolled sang controlled giữa runtime — React làm điều này với `<input>`, bạn cũng nên làm tương tự với custom components.
- The `onChange` callback in a controlled component should be called with the new value, not the event — let the consumer update their own state and re-render. If you call `setState` inside the component despite being controlled, you create a "read-only" UI that doesn't update. Tiếng Việt: `onChange` của controlled component nên trả về giá trị mới cho consumer; không tự `setState` khi đang ở chế độ controlled.
- A common gotcha with `defaultValue`: it is only read once (on mount). Changing `defaultValue` after mount has no effect. If consumers try to reset an uncontrolled component by changing `defaultValue`, it won't work — use the `key` prop to force a remount. Tiếng Việt: `defaultValue` chỉ đọc lúc mount. Thay đổi `defaultValue` sau đó không có tác dụng — dùng `key` prop để remount nếu cần reset.
- For form libraries (React Hook Form, Formik), the control props pattern is fundamental: they take controlled components and wire `value`/`onChange` automatically via the `register` or `field` APIs. Understanding controlled components is a prerequisite for using these libraries correctly. Tiếng Việt: React Hook Form và Formik đều dựa trên controlled component — hiểu pattern này là điều kiện để dùng form libraries đúng cách.
- TypeScript pattern: make the controlled props optional together (`value?: T; onChange?: (v: T) => void`) and add a check that either both are provided or neither is. This prevents the subtle bug of providing `onChange` without `value` (making the component read-only). Tiếng Việt: Trong TypeScript, dùng discriminated union hoặc runtime check để đảm bảo `value` và `onChange` luôn đi cùng nhau — tránh component read-only do thiếu `value`.

### Ví dụ / Example
```tsx
import { useState } from 'react';

type CounterProps = { initial?: number };

export function Counter({ initial = 0 }: CounterProps) {
  const [count, setCount] = useState(initial);
  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Prop Getters

### Giải thích / Explanation

**English:** Prop getters merge internal behavior with consumer-provided props safely.

**Tiếng Việt:** Prop getter trộn hành vi nội bộ với props từ consumer một cách an toàn.

### Key Points / Ý Chính
- A prop getter is a function returned from a hook or component that generates the correct props for a specific element. Instead of `<button onClick={toggle}>`, the consumer calls `<button {...getToggleProps()}>` and gets all necessary props merged automatically. Tiếng Việt: Prop getter là function trả về object props đã được merge sẵn — consumer chỉ cần spread vào element thay vì tự wire từng prop.
- The core value of prop getters is safe prop merging: the getter combines its internal handlers with any consumer-provided props, ensuring both run. For `onClick`, this means: `onClick: (e) => { internalHandler(e); userOnClick?.(e); }`. Tiếng Việt: Prop getter đảm bảo cả handler nội bộ lẫn handler của consumer đều được gọi — không handler nào bị ghi đè.
- For event handlers, call the consumer's handler first, then the internal handler — this way consumers can call `event.preventDefault()` to abort the internal behavior, providing a natural escape hatch. Tiếng Việt: Gọi consumer handler trước nội bộ — consumer có thể gọi `preventDefault()` để hủy hành vi mặc định.
- Prop getters commonly return ARIA attributes alongside event handlers. For example, `getMenuProps()` returns `{ role: 'listbox', 'aria-labelledby': id, onKeyDown: handleKeyDown }`, centralizing accessibility requirements that consumers shouldn't have to know about. Tiếng Việt: Prop getter thường bao gồm cả ARIA attributes — consumer không cần tự nhớ các attribute accessibility, hook đảm nhiệm luôn.
- Downshift pioneered this pattern: `getInputProps`, `getItemProps`, `getMenuProps` each return the correct ARIA roles, event handlers, and IDs for accessible combobox behavior. This is a perfect example of the behavior/rendering separation principle. Tiếng Việt: Downshift dùng prop getter để đóng gói toàn bộ logic accessible combobox — developer chỉ cần spread props vào DOM element.
- A subtle gotcha: if the consumer passes a `ref` to a prop getter (e.g., `getInputProps({ ref: myRef })`), the getter must merge refs. Use a `mergeRefs` utility since you cannot assign multiple refs to the same `ref` prop directly. Tiếng Việt: Merge `ref` cần utility đặc biệt (`mergeRefs`) vì không thể assign hai refs vào cùng một prop.
- Prop getters are often returned alongside render props or from custom hooks: `const { getToggleProps, isOpen } = useDisclosure()`. This composition allows using prop getters without committing to a specific render structure. Tiếng Việt: Prop getter thường đi kèm với custom hook — consumer nhận cả state lẫn prop getters trong một destructure duy nhất.

### Ví dụ / Example
```tsx
import { useState } from 'react';

type CounterProps = { initial?: number };

export function Counter({ initial = 0 }: CounterProps) {
  const [count, setCount] = useState(initial);
  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Container and Presentational

### Giải thích / Explanation

**English:** Separate data orchestration from visual rendering concerns.

**Tiếng Việt:** Tách điều phối dữ liệu khỏi phần hiển thị giao diện.

### Key Points / Ý Chính
- Container components handle data fetching, state management, and business logic; presentational components receive all data via props and only render UI. This separation enforces the Single Responsibility Principle at the component level. Tiếng Việt: Container lo về data/logic; presentational lo về UI — mỗi component chỉ có một lý do để thay đổi.
- Presentational components are highly reusable and trivially testable: pass in props, assert on the rendered output. No mocking of stores, APIs, or contexts required. This is the main practical benefit of the separation. Tiếng Việt: Presentational component dễ test hơn nhiều — không cần mock store hay API, chỉ cần pass props và kiểm tra output.
- With the introduction of hooks, the container/presentational boundary has shifted. Instead of a container component, a custom hook (`useUserList`) can own the data logic, and the component that calls it is both container and presentational. The hook becomes the true "container". Tiếng Việt: Sau khi có hooks, custom hook thay thế container component — component gọi hook vừa có logic vừa render, nhưng logic được tách vào hook.
- Dan Abramov (creator of the pattern) has noted that the strict split is less necessary today with hooks, but the underlying principle — separating concerns — remains valuable. Don't apply the pattern mechanically; apply the principle. Tiếng Việt: Dan Abramov (tác giả pattern) thừa nhận sự phân chia cứng nhắc ít cần thiết hơn với hooks — áp dụng nguyên tắc, không áp dụng công thức.
- A gotcha: over-applying the pattern creates shallow "pass-through" container components that only exist to fetch data and hand it to a presentational child with zero logic. These should be collapsed into the presentational component with a hook call. Tiếng Việt: Áp dụng máy móc tạo ra container rỗng chỉ để fetch rồi pass xuống — nên gộp lại và dùng hook trong presentational component trực tiếp.
- The pattern is still very relevant for component library design: `ButtonBase` (presentational) vs `SubmitButton` (container with form wiring). Keeping visual atoms purely presentational maximizes their reuse across products. Tiếng Việt: Vẫn rất hữu ích trong design system: `ButtonBase` (presentational) tái sử dụng được ở mọi nơi; `SubmitButton` (container) chứa logic submit cụ thể.
- Performance optimization synergy: presentational components are ideal targets for `React.memo` because their output depends only on props. Container components should avoid wrapping with `memo` since they frequently trigger re-renders due to state changes. Tiếng Việt: Presentational components là ứng viên lý tưởng cho `React.memo` — props thuần túy, dễ so sánh. Container components thường re-render vì state thay đổi, ít hiệu quả khi memo.

### Ví dụ / Example
```tsx
import { memo, useMemo } from 'react';

type Row = { id: string; score: number };

const RowView = memo(function RowView({ row }: { row: Row }) {
  return <li>{row.id}: {row.score}</li>;
});

export function ScoreList({ rows }: { rows: Row[] }) {
  const sorted = useMemo(() => [...rows].sort((a, b) => b.score - a.score), [rows]);
  return <ul>{sorted.map((r) => <RowView key={r.id} row={r} />)}</ul>;
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Headless Components

### Giải thích / Explanation

**English:** Headless design exposes behavior without enforcing visual styling.

**Tiếng Việt:** Headless component chỉ cung cấp hành vi, không áp đặt giao diện.

### Key Points / Ý Chính
- Headless components (and headless hooks) provide all the behavior, state, and accessibility of a UI component — keyboard navigation, ARIA attributes, focus management — but render nothing, delegating all visual output to the consumer. Tiếng Việt: Headless component cung cấp toàn bộ behavior và accessibility nhưng không render bất kỳ UI nào — consumer toàn quyền về giao diện.
- The primary motivation is design-system flexibility: teams want the correct behavior (accessible accordion, combobox, date picker) without being forced into a specific visual style. Headless libraries like Radix UI, Headless UI, React Aria, and TanStack Table follow this model. Tiếng Việt: Động lực chính: dùng behavior đúng chuẩn accessibility mà không bị ràng buộc bởi style — đây là lý do Radix UI và Headless UI được dùng rộng rãi.
- Headless components are most commonly implemented as hooks: `const { isOpen, getDialogProps, getTriggerProps } = useDialog()`. The hook owns the state machine; the consumer wires props via prop getters and renders their own JSX. Tiếng Việt: Cách phổ biến nhất là implement dưới dạng hook — hook sở hữu state machine, consumer tự render JSX và wire props.
- Accessibility completeness is the hardest part: a headless combobox must handle Arrow Up/Down, Home/End, Escape, Enter, typeahead search, screen reader announcements, and focus trap. Verify against ARIA Authoring Practices Guide (APG) patterns, not just visual behavior. Tiếng Việt: Phần khó nhất là accessibility đầy đủ: keyboard navigation, typeahead, screen reader — verify theo ARIA APG chứ không chỉ visual behavior.
- The cost of headless components: more boilerplate at the usage site. Consumers must manually apply prop getters, render the structure, and add styling. Styled component libraries (MUI, Chakra) trade configurability for convenience — choose based on your design constraints. Tiếng Việt: Headless đòi hỏi nhiều code hơn ở usage site — so sánh với styled library (MUI, Chakra) là trade-off giữa flexibility và convenience.
- Headless components are an excellent separation-of-concerns strategy in monorepos: a `packages/headless` package owns behavior; `packages/ui` owns the visual layer. Design system changes don't affect behavior; behavior bug fixes don't require UI changes. Tiếng Việt: Trong monorepo, tách `packages/headless` (behavior) và `packages/ui` (visual) — thay đổi design không ảnh hưởng behavior và ngược lại.
- Testing headless components: test the behavior (state transitions, keyboard events, ARIA attributes) using Testing Library and a minimal test render. Visual appearance is not tested at this layer — that belongs to Storybook or visual regression tests. Tiếng Việt: Test headless components bằng Testing Library tập trung vào behavior và ARIA — visual appearance test bằng Storybook hoặc visual regression.

### Ví dụ / Example
```tsx
import { useState } from 'react';

type CounterProps = { initial?: number };

export function Counter({ initial = 0 }: CounterProps) {
  const [count, setCount] = useState(initial);
  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Polymorphic Components

### Giải thích / Explanation

**English:** Polymorphic APIs support an "as" prop while preserving type safety.

**Tiếng Việt:** API polymorphic hỗ trợ prop "as" nhưng vẫn giữ type safety.

### Key Points / Ý Chính
- A polymorphic component accepts an `as` prop (or `component` prop) that specifies which HTML element or React component to render: `<Text as="h1">` renders an `<h1>`, `<Text as={Link}>` renders a React Router Link. The component's own styles and behavior are preserved regardless. Tiếng Việt: Polymorphic component nhận prop `as` để quyết định render element hay component nào — giữ nguyên style và behavior của component gốc.
- The TypeScript typing is complex: the `as` prop determines which additional props are valid. `<Text as="a">` should accept `href`; `<Text as="button">` should accept `disabled`. Use generics with `React.ComponentPropsWithoutRef<C>` to achieve this. Tiếng Việt: TypeScript typing khó vì props hợp lệ thay đổi theo `as` — dùng generic `C extends React.ElementType` và `React.ComponentPropsWithoutRef<C>`.
- A common simplified TypeScript signature: `type PolymorphicProps<C extends React.ElementType, Props = {}> = Props & Omit<React.ComponentPropsWithoutRef<C>, keyof Props> & { as?: C }`. The `Omit` prevents conflicts between your custom props and native element props. Tiếng Việt: `Omit<React.ComponentPropsWithoutRef<C>, keyof Props>` ngăn conflict giữa custom props và native element props — đây là phần dễ quên nhất.
- Polymorphic components must forward refs correctly, which complicates the typing further. `React.forwardRef` requires knowing the element type for the ref, so you must use a combination of generics and type casting. In practice, many libraries choose to not forward refs on polymorphic components to reduce complexity. Tiếng Việt: Kết hợp `forwardRef` với polymorphic generics rất phức tạp — nhiều thư viện chọn không forward ref để giảm độ phức tạp.
- A real-world gotcha: `<Box as="button" onClick={handleClick}>` works fine, but `<Box as={Link} to="/home">` requires the polymorphic typing to recognize `to` as a valid prop from React Router's `Link`. Without proper generics, TypeScript will error or, worse, silently accept invalid props. Tiếng Việt: Dùng `as={Link}` cần TypeScript nhận biết props của `Link` (như `to`) là hợp lệ — thiếu generic sẽ lỗi hoặc chấp nhận props sai.
- Semantic HTML motivation: a design system `Button` component should render a `<button>` by default, but when used inside a nav, it should render as `<a>` for correct semantics. Polymorphic components solve this without creating separate `ButtonLink` variants. Tiếng Việt: Động lực là semantic HTML — dùng `<Button as="a">` thay vì tạo `ButtonLink` riêng, giữ semantic đúng mà không nhân đôi components.
- Chakra UI, MUI, and Mantine all implement polymorphic components. Chakra's `as` prop is the canonical example in production codebases. Studying their TypeScript implementations reveals common patterns for handling the complexity. Tiếng Việt: Chakra UI, MUI và Mantine đều implement polymorphic component — xem TypeScript implementation của họ để học pattern xử lý complexity trong thực tế.

### Ví dụ / Example
```tsx
import { useState } from 'react';

type CounterProps = { initial?: number };

export function Counter({ initial = 0 }: CounterProps) {
  const [count, setCount] = useState(initial);
  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Pattern Selection Matrix

### Giải thích / Explanation

**English:** Choose patterns based on API flexibility, ergonomics, and performance.

**Tiếng Việt:** Chọn pattern dựa trên độ linh hoạt API, trải nghiệm dev và hiệu năng.

### Key Points / Ý Chính
- Use **Compound Components** when multiple sub-components need to share state implicitly (e.g., `<Tabs>/<Tab>/<TabPanel>`) and you want a flexible, composable API without prop drilling. Avoid when there is only one child. Tiếng Việt: Compound components phù hợp khi nhiều sub-component cần chia sẻ state mà không muốn prop drilling — không nên dùng nếu chỉ có một child.
- Use **Render Props / Children-as-function** when behavior (mouse position, scroll tracking) needs to be shared but the UI varies significantly across consumers, or when you need to support React class components that cannot use hooks. Tiếng Việt: Render props hữu ích khi behavior cần tái sử dụng nhưng UI khác nhau theo consumer, hoặc khi cần hỗ trợ class components không dùng được hooks.
- Use **HOCs** for cross-cutting concerns in codebases that already use them (legacy) or when you need to apply behavior at the component definition site as a decorator. For new code, prefer custom hooks. Tiếng Việt: HOC phù hợp cho codebase legacy hoặc khi cần decorator tại nơi định nghĩa component — code mới nên dùng custom hooks thay thế.
- Use **Provider + Context** when data needs to be accessible deep in the tree by many components, but updates are infrequent (theme, auth token, locale). For high-frequency updates, use a dedicated state manager (Zustand, Jotai). Tiếng Việt: Context tốt cho data ít thay đổi (theme, auth) nhưng cần truy cập ở nhiều component sâu trong cây — update thường xuyên nên dùng Zustand/Jotai.
- Use **State Reducer** when building reusable libraries where consumers need fine-grained control over arbitrary state transitions without you having to anticipate every use case with individual props. Tiếng Việt: State Reducer phù hợp khi xây dựng library cần consumer customize state transition tùy ý — tránh phải thêm prop cho mỗi edge case.
- Use **Control Props** when a component must integrate with external form state (React Hook Form, Formik) or when the consumer needs to synchronize the component's state with other parts of the UI. Tiếng Việt: Control props cần thiết khi tích hợp với form library hoặc khi consumer cần đồng bộ state component với phần UI khác.
- Use **Headless Components / Hooks** when building a design system where behavior and accessibility must be consistent but visual design varies by product or theme. Tiếng Việt: Headless components lý tưởng cho design system — behavior và accessibility nhất quán, giao diện tùy biến hoàn toàn theo từng sản phẩm.
- Use **Polymorphic Components** in design systems when a component (Button, Text, Box) must render as different HTML elements or React components based on context, and semantic HTML correctness is important. Tiếng Việt: Polymorphic components trong design system giải quyết vấn đề semantic HTML — render đúng element theo context mà không tạo nhiều variant component.

### Ví dụ / Example
```tsx
import { memo, useMemo } from 'react';

type Row = { id: string; score: number };

const RowView = memo(function RowView({ row }: { row: Row }) {
  return <li>{row.id}: {row.score}</li>;
});

export function ScoreList({ rows }: { rows: Row[] }) {
  const sorted = useMemo(() => [...rows].sort((a, b) => b.score - a.score), [rows]);
  return <ul>{sorted.map((r) => <RowView key={r.id} row={r} />)}</ul>;
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Interview Trade-off Narratives

### Giải thích / Explanation

**English:** Senior interviews prioritize rationale and trade-off storytelling.

**Tiếng Việt:** Phỏng vấn senior ưu tiên lý do chọn giải pháp và phân tích đánh đổi.

### Key Points / Ý Chính
- Frame every pattern answer with the problem it solves first, not the mechanism. "I used compound components because we had a Tabs component where consumers needed to reorder tabs and conditionally render panels, and individual boolean props would have exploded the API surface." Tiếng Việt: Bắt đầu bằng vấn đề cần giải quyết, không phải cơ chế — "Tôi dùng pattern X vì vấn đề Y" thuyết phục hơn nhiều so với chỉ giải thích pattern hoạt động thế nào.
- When comparing patterns, acknowledge legitimate trade-offs rather than declaring a winner. HOCs are "not bad" — they're appropriate for class component codebases and decorator-style composition. Render props are "not obsolete" — they're still better than hooks when conditional JSX is the output. Tiếng Việt: So sánh pattern phải thừa nhận trade-off thực sự — không có pattern nào tuyệt đối tốt hay xấu, chỉ có phù hợp hay không phù hợp với context.
- Connect pattern choices to team experience and codebase maintainability. A state reducer pattern is powerful but requires advanced knowledge of React's state model — it may not be the right choice for a team with junior-heavy membership. Tiếng Việt: Kết nối lựa chọn pattern với kinh nghiệm team — pattern mạnh nhưng phức tạp có thể không phù hợp nếu team có nhiều dev junior.
- Performance narratives matter: "We moved from a HOC-based withData pattern to custom hooks because HOC composition created 4 extra wrapper components in the DevTools tree, and profiling showed the extra reconciliation overhead was measurable on low-end Android devices." Tiếng Việt: Kể câu chuyện về performance measurement cụ thể — "profiling cho thấy..." thuyết phục hơn nhiều so với giả thuyết lý thuyết.
- Use the evolution narrative in senior interviews: "We started with render props in 2018, migrated to HOCs for consistency, then moved to custom hooks in 2020, and now use headless components for design system primitives. Each shift was driven by a specific pain point, not hype." Tiếng Việt: "Chúng tôi từng dùng X, gặp vấn đề Y, chuyển sang Z" — narrative về evolution chứng minh kinh nghiệm thực chiến, không chỉ đọc blog.
- When asked "which pattern is best," demonstrate architectural thinking: "It depends on the axis of variability. If behavior is fixed but UI varies — headless. If UI is fixed but behavior varies — props + callbacks. If both vary — compound components or state reducer." Tiếng Việt: "Tùy thuộc vào..." là câu trả lời của senior — giải thích trục biến thiên (behavior vs UI) rồi map sang pattern phù hợp.
- Mention real-world evidence: "Radix UI chose the compound component pattern for Dialog because it needed to support Trigger, Content, Title, Description as independent elements for accessibility compliance — you can't achieve that with a single component and boolean props." Tiếng Việt: Trích dẫn quyết định kiến trúc của thư viện lớn (Radix, Downshift) để chứng minh pattern được validate bởi production use cases, không chỉ lý thuyết.

### Ví dụ / Example
```tsx
import { useEffect, useState } from 'react';

export function SearchBox() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const id = setTimeout(async () => {
      const data = await Promise.resolve(['react', 'fiber', query]);
      if (!cancelled) setResult(data);
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [query]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q1: What are compound components and when should you use them? 🟢 Junior

**A:** Compound components are a set of components that share implicit state through React Context. A parent component manages state and exposes it to child sub-components via context, without requiring consumers to wire props manually. Classic examples are `<Select>/<Select.Option>`, `<Tabs>/<Tab>/<TabPanel>`, or `<Accordion>/<Accordion.Item>`.

**Use compound components when:** (1) multiple sub-components need to share state and you want to avoid prop drilling, (2) you want a flexible composition API that lets consumers reorder or conditionally render sub-components, (3) you're building a reusable component library where the parent-child relationship needs to be explicit.

**Tiếng Việt:** Compound components dùng Context để chia sẻ state nội bộ. Dùng khi cần API linh hoạt cho các sub-component cần dùng chung state mà không prop drilling. Phổ biến trong design systems (Tabs, Accordion, Select).

### Q2: What problem does the render props pattern solve, and when has it been superseded by hooks? 🟡 Mid

**A:** Render props solve the problem of sharing stateful behavior (e.g., mouse position, form validation, resize observer) between components without inheritance. A component with a render prop calls a consumer-provided function with its internal state: `<Mouse render={({ x, y }) => <Tracker x={x} y={y} />} />`.

**When hooks supersede render props:** For most "share stateful logic" use cases, a custom hook is simpler, less nested, and easier to compose. `const { x, y } = useMouse()` replaces the entire `<Mouse render={...}>` pattern.

**When render props remain relevant:** (1) When the shared behavior must produce conditional JSX (not just state), (2) when supporting class components that cannot call hooks, (3) in libraries like React Router where a component renders different children based on route state.

**Performance gotcha:** Inline render prop functions create new references on every parent render, breaking `React.memo` inside the child. Use `useCallback` or move the function outside the component to fix this.

**Tiếng Việt:** Render props giải quyết vấn đề chia sẻ stateful behavior. Hooks thay thế hầu hết use case, nhưng render props vẫn hữu ích khi behavior cần trả về JSX có điều kiện hoặc khi hỗ trợ class components.

### Q3: What are the main pitfalls of Higher-Order Components (HOCs) and why has the community moved toward hooks? 🔴 Senior

**A:** HOCs have four well-known production pitfalls:

1. **Prop name collision:** If a HOC injects a prop named `user` and the wrapped component already receives a `user` prop from its parent, the HOC silently overwrites it. Custom hooks avoid this since the consumer names the returned values.

2. **Invisible prop flow:** In React DevTools, a HOC chain (`withAuth(withLogging(withTheme(Component)))`) creates multiple anonymous wrapper layers, making it very hard to trace which props come from where. DevTools shows the HOC names only if you set `displayName` explicitly.

3. **Static method loss:** `React.Component.staticMethod` does not transfer to the HOC-wrapped component automatically. You must use `hoistNonReactStatics` to copy them — an easy-to-forget step.

4. **Ref forwarding complexity:** Without `React.forwardRef`, a consumer cannot get a ref to the inner component. Adding `forwardRef` to a HOC requires careful typing in TypeScript.

**Why hooks are better:** Custom hooks achieve the same cross-cutting concerns (auth, logging, theme) with zero component tree overhead, no prop collisions, and full TypeScript inference. HOCs are still the right choice for class component codebases and decorator-style patterns.

**Tiếng Việt:** Bốn vấn đề chính của HOC: name collision, props ẩn trong DevTools, static method bị mất, ref không được forward. Hooks giải quyết tất cả nhưng HOC vẫn cần cho class components.

### Q4: Why does React Context cause unnecessary re-renders and how do you fix it? 🟡 Mid

**A:** Every component that calls `useContext(MyContext)` re-renders whenever the Provider's `value` prop changes by reference — even if the specific piece of data that component uses has not changed.

**Common mistake:** `<UserContext.Provider value={{ user, setUser }}>` creates a new object literal on every parent render, causing all consumers to re-render even when `user` and `setUser` are identical.

**Fixes:** (1) `useMemo`: `const value = useMemo(() => ({ user, setUser }), [user]);` (2) Split contexts: separate `UserStateContext` (state) from `UserDispatchContext` (the setter function). Components that only dispatch subscribe only to `UserDispatchContext` and never re-render when state changes. (3) For very high-frequency updates, use Zustand, Jotai, or a selector-based library instead.

**Tiếng Việt:** Context re-render toàn bộ consumer khi `value` thay đổi reference. Dùng `useMemo` hoặc tách state/dispatch context. Zustand/Jotai tốt hơn cho data update thường xuyên.

### Q5: Explain the State Reducer pattern and when is it the right choice? 🔴 Senior

**A:** The State Reducer pattern (popularized by Kent C. Dodds with Downshift) lets consumers intercept and override any state transition inside a hook without the library needing to anticipate every edge case with dedicated props.

**How it works:** The library computes the proposed next state from an action, then calls the consumer's `stateReducer(currentState, { type, changes })`. The consumer returns the final state — either the proposed `changes` unchanged, or a modified version.

**Example:** A `useCombobox` hook normally closes the dropdown on item click. With state reducer, a multi-select consumer overrides `ItemClick` to keep it open: `return action.type === 'ItemClick' ? { ...changes, isOpen: true } : changes;`

**When to prefer simpler alternatives:** For a single behavior override, an `onToggle` callback or a boolean prop is much simpler. Use state reducer only when you cannot predict which transitions the consumer may need to override.

**Tiếng Việt:** State Reducer cho consumer override state transition tùy ý — lý tưởng cho library cần flexibility cao không thể dự đoán trước edge case. Với override đơn giản, callback bình thường đủ rồi.

### Q6: What is the difference between a controlled and uncontrolled component, and how do you implement dual-mode support? 🔴 Senior

**A:** A **controlled component** receives its value entirely from props (`value` + `onChange`). The parent owns the source of truth. An **uncontrolled component** manages its own internal state, initialized by `defaultValue` but not synchronized with any external state.

**Dual-mode implementation:** Check whether the controlled prop is provided: `const isControlled = value !== undefined; const currentValue = isControlled ? value : internalState;`. When controlled, never call `setInternalState` — changes must come from the consumer re-rendering with a new `value`.

**React's own warning:** React warns when an `<input>` switches from `value={undefined}` to `value="text"` at runtime. Implement the same warning in your custom component using a ref to detect the transition.

**Common bug:** Providing `onChange` without `value` (or `value` without `onChange`) creates a read-only controlled component with no way to update it. Document this constraint clearly and add a dev-mode warning.

**Tiếng Việt:** Controlled = giá trị từ props; uncontrolled = tự quản lý state. Implement dual-mode bằng cách kiểm tra `value !== undefined`. Tránh gọi setState nội bộ khi đang ở chế độ controlled.

### Q7: How do prop getters differ from just passing event handlers as props? 🟡 Mid

**A:** A plain event handler prop (`onClick={handler}`) gives the consumer one callback that runs instead of the internal handler. If the consumer also needs an `onClick`, they must manually compose both: `onClick={(e) => { handler(e); myClick(e); }}`.

A **prop getter** solves this by returning a pre-merged props object. The getter calls `getToggleProps({ onClick: myClick })` and internally composes both handlers so both always run. It also adds ARIA attributes (`aria-expanded`, `role`, etc.) the consumer would otherwise forget.

**Example from Downshift:** `getInputProps({ ref: myRef })` returns the correct `aria-autocomplete`, `aria-controls`, `onKeyDown` (for keyboard navigation), and a merged ref — all in one spread. The consumer doesn't need to know which ARIA attributes are required.

**Key implementation detail:** Call the consumer's handler before the internal one. This lets the consumer call `event.preventDefault()` to abort internal behavior — a natural escape hatch.

**Tiếng Việt:** Prop getter tự động merge handlers và thêm ARIA attributes, consumer chỉ cần spread. Gọi consumer handler trước để họ có thể preventDefault và cancel behavior nội bộ.


### Q8: Is the Container/Presentational pattern still relevant with hooks? 🟡 Mid

**A:** The strict container/presentational split — where a container class component fetches data and passes it to a pure presentational component — is less necessary today because custom hooks absorb the "container" role without requiring a wrapper component.

**What remains relevant:** The underlying principle. Separating data-fetching logic from rendering logic is still valuable. Instead of a container component, a `useUserList()` hook owns the data; the component that calls it handles both logic and rendering, but the logic is encapsulated and independently testable.

**Where the pattern still shines:** Component libraries. A `ButtonBase` (presentational: renders a `<button>`, accepts `children`, `className`) is reused everywhere. A `SubmitButton` (has a form submission handler, loading state) extends it. Keeping `ButtonBase` purely presentational maximizes its reuse.

**Testing benefit:** Presentational components are ideal unit test targets — pass props, assert output, no mocks required. Data-fetching hooks can be tested independently with `renderHook`.

**Tiếng Việt:** Pattern vẫn relevant về mặt nguyên tắc — tách data logic khỏi rendering. Hooks thay thế container component nhưng nguyên lý tách biệt trách nhiệm vẫn áp dụng, đặc biệt trong design system.

### Q9: What makes a component library "headless" and what are its trade-offs vs. a styled component library? 🔴 Senior

**A:** A headless component library provides complete behavior and accessibility (keyboard navigation, ARIA attributes, focus management, screen reader announcements) but renders no DOM or styles. Consumers wire the behavior to their own markup using prop getters or a render slot API.

**Examples:** Radix UI Primitives, Headless UI (Tailwind Labs), React Aria (Adobe), TanStack Table (headless data grid).

**Trade-off vs. styled libraries (MUI, Chakra, Ant Design):**
- Headless: full visual freedom, zero style conflicts, maximum design consistency with your brand — but more boilerplate at the usage site and requires developer accessibility knowledge to wire correctly.
- Styled libraries: faster to ship, consistent out of the box — but customizing deeply can fight the library's CSS, and you're tied to their design language.

**When to choose headless:** When your design system has strong visual constraints that differ from any pre-styled library, or when you're building the design system itself.

**Tiếng Việt:** Headless = behavior + accessibility, zero visual. Trade-off: flexible nhưng tốn code hơn. Styled library nhanh hơn nhưng ít flexible. Chọn headless khi design system cần visual riêng biệt hoàn toàn.

### Q10: How do you implement a type-safe polymorphic component in TypeScript? 🔴 Senior

**A:** A polymorphic component accepts an `as` prop that changes the rendered element type, with TypeScript ensuring the element's own props are also valid.

**Core generic pattern:**
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
```

With this: `<Text as="a" href="/home">` accepts `href` (valid for `<a>`); `<Text as="button" onClick={fn}>` accepts `onClick`. Invalid native props produce TypeScript errors.

**Ref forwarding complication:** Adding `React.forwardRef` to a polymorphic component requires a type cast because TypeScript cannot infer the generic inside `forwardRef`. Many libraries skip ref forwarding on polymorphic components for this reason.

**Simpler alternative when full typing is not needed:** Accept `as?: React.ElementType` without the generic — lose type safety for element-specific props, but much simpler to write and maintain.

**Tiếng Việt:** Generic `C extends React.ElementType` + `React.ComponentPropsWithoutRef<C>` cho phép TypeScript biết props nào hợp lệ theo `as` prop. `Omit` tránh conflict với custom props. Kết hợp `forwardRef` thêm phức tạp — nhiều thư viện bỏ qua phần này.

### Q11: How would you decide between compound components, render props, and a custom hook for a reusable Accordion component? 🔴 Senior

**A:** This is a classic pattern selection question. Walk through the decision framework:

**Custom hook only (`useAccordion`):** Works if the consumer fully controls the render structure. Returns `{ openItems, toggle, getItemProps }`. Clean API, composable — but the consumer writes all the JSX. Good for a design system where every product has a unique Accordion appearance.

**Compound components (`<Accordion>/<Accordion.Item>/<Accordion.Trigger>/<Accordion.Content>`):** Works when you want a structured, semantic composition with clear sub-component roles. Consumers compose the structure they need. Sub-components handle their own ARIA roles (`role="region"`, `aria-expanded`). This is what Radix UI does.

**Render props:** Adds little over a hook for this use case today. Would only choose if supporting class components.

**My recommendation in a senior answer:** Compound components for the high-level API (easy to use, semantic), backed by a custom hook (easy to test behavior in isolation). The compound components call the hook internally.

**Tiếng Việt:** Compound components cho API cấp cao dễ dùng; custom hook cho logic testable độc lập. Kết hợp cả hai: compound components gọi hook nội bộ. Render props chỉ khi cần class component support.

### Q12: What is the "prop drilling" problem and what are the right solutions at different scales? 🟢 Junior

**A:** Prop drilling occurs when a prop must be passed through multiple intermediate component layers that don't use it, solely to deliver it to a deeply nested consumer. This creates tight coupling and makes refactoring painful.

**Solutions by scale:**
- **1-2 levels deep:** Just pass the props. Prop drilling at shallow depth is fine and the most readable solution.
- **3-5 levels with 1-3 consumers:** React Context with a custom hook (`useTheme`, `useAuth`). Simple, built-in, no extra dependencies.
- **Many consumers, frequent updates:** Zustand, Jotai, or Redux. These avoid the Context re-render problem and support selectors.
- **Complex derived state or cross-slice updates:** Redux Toolkit or a library with explicit dependency tracking (Jotai, Recoil).

**Anti-pattern to avoid:** Reaching for Context or a state manager for props that only flow 1-2 levels. Over-engineering prop distribution is as harmful as prop drilling.

**Tiếng Việt:** Prop drilling sâu 1-2 tầng là bình thường. 3-5 tầng với ít consumer → Context. Nhiều consumer, update thường → Zustand/Jotai. Đừng dùng Context chỉ để tránh truyền props 1-2 tầng.

---

## Revision Checklist / Danh Sách Ôn Tập

- [ ] Can you explain compound components: how `createContext` shares state, and name one production gotcha (memoize context value)?
- [ ] Can you implement a `<Tabs>` compound component with `Tabs.Tab` and `Tabs.Panel` sub-components sharing open state via context?
- [ ] Can you describe render props: the pattern, the performance pitfall with inline arrow functions, and when hooks supersede them?
- [ ] Can you list the four HOC pitfalls (prop collision, DevTools noise, static method loss, ref blocking) and the fix for each?
- [ ] Can you explain when to use `React.forwardRef` inside a HOC and why it's required for consumer ref access?
- [ ] Can you explain why passing `value={{ user, setUser }}` inline to a Provider causes re-renders and give two ways to fix it?
- [ ] Can you implement a Provider with split state/dispatch contexts so dispatch-only consumers don't re-render on state change?
- [ ] Can you explain the State Reducer pattern: who computes the proposed state, how the consumer overrides it, and when it beats a simple callback?
- [ ] Can you describe the controlled vs. uncontrolled component distinction and implement dual-mode support with `value !== undefined` check?
- [ ] Can you explain what `defaultValue` does (read once on mount) and why changing it after mount has no effect?
- [ ] Can you explain prop getters: what they return, why handlers are called in consumer-first order, and what ARIA attributes a `getMenuProps` might include?
- [ ] Can you contrast container/presentational with hooks-based separation, and explain where the pattern still adds value (design systems)?
- [ ] Can you define a headless component library and articulate the trade-off vs. a styled library like MUI?
- [ ] Can you explain the polymorphic `as` prop pattern and write the generic TypeScript type that ensures element-specific props are valid?
- [ ] Can you describe the pattern selection decision framework: when to use compound components vs. render props vs. hooks vs. HOCs?
- [ ] Can you explain what "inversion of control" means in the context of React patterns and name two patterns that use it?
- [ ] Can you articulate a trade-off narrative for a pattern decision you'd make in a senior interview (problem → options → choice → rationale)?
