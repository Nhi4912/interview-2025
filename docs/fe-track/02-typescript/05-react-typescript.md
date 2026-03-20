# React with TypeScript / React với TypeScript

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

[← Previous: TypeScript Comprehensive](./04-typescript-comprehensive.md) | [Related: Advanced Types](./02-advanced-types.md) | [Related: Modern Features](./06-typescript-modern-features.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Shopee product page state bug:** A junior developer writes `const [loading, setLoading] = useState(false); const [data, setData] = useState(null); const [error, setError] = useState(null)`. This allows impossible states: `loading: true` AND `data: [...products]` simultaneously. When the fetch completes, `setLoading(false)` and `setData(products)` are called separately — there's a render frame where both are true. With TypeScript discriminated unions: `type State = {status:'loading'} | {status:'success';data:Product[]} | {status:'error';message:string}` — you can't be in `loading` and have `data` at the same time. TypeScript enforces this at compile time.

**Bài học:** React + TypeScript isn't about adding `as any` to silence errors. It's about using TypeScript's type system to eliminate impossible states, catch refactoring mistakes, and make component contracts explicit. The discriminated union pattern alone prevents a whole class of race condition bugs.

## What & Why / Cái Gì & Tại Sao

**The key insight:** TypeScript in React is most valuable at **boundaries** — component props, context values, API responses, reducer actions. At these boundaries, the type system acts as a contract: callers know what they must provide, and implementors know what they'll receive.

**Over-typing pitfalls:** `React.FC<Props>` adds `children?: ReactNode` implicitly (React 17-) and `displayName` to every component — even pure functional ones. Most teams avoid it. `as any` breaks the entire type chain. `useRef<HTMLElement>` instead of `useRef<HTMLInputElement>` loses DOM-specific methods.

## Concept Map / Bản Đồ Khái Niệm

```
[React + TypeScript Patterns]
        │
        ├── Component Props
        │       ├── Plain function: type Props = {...}; function Comp({}: Props) {}
        │       ├── React.FC — avoid (implicit children, worse inference)
        │       └── Generic components: <T extends {...}>({ rows }: TableProps<T>)
        │
        ├── State Patterns
        │       ├── useState<T | null>(null) — explicit nullable union
        │       ├── Discriminated union: { status:'idle' } | { status:'loading' } | { status:'success';data:T }
        │       └── useReducer with Action type union: { type:'INCREMENT' } | { type:'SET';value:number }
        │
        ├── Hooks Typing
        │       ├── useRef<HTMLInputElement | null>(null) — DOM ref
        │       ├── useContext + custom hook for null guard
        │       └── Custom hooks: return type explicit when complex
        │
        └── Boundary Patterns
                ├── Event: React.ChangeEvent<HTMLInputElement>, React.MouseEvent
                ├── API response: { ok: true; data: T } | { ok: false; error: string }
                └── HOC: <P>(Comp: React.ComponentType<P>) => (props: P & Extra) => JSX
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Discriminated Union State — Eliminating Impossible States

**🧠 Memory Hook:** "**3 separate booleans = impossible states possible. Discriminated union = TypeScript enforces only valid state combinations. `status: 'loading' | 'success' | 'error'` as the discriminant.**"

**Why does this exist? / Tại sao tồn tại?**

- Why are separate `loading`, `data`, `error` states dangerous? Because they're independently settable — you can have `loading: true` and `data: [...]` simultaneously during a race condition. The UI doesn't know which to trust
- Why does discriminated union fix this? The `status` field is the discriminant — TypeScript narrows to the exact branch. Inside `if (state.status === 'success')`, TypeScript knows `state.data` exists. Inside `if (state.status === 'loading')`, TypeScript knows `state.data` doesn't exist
- Why is exhaustive `switch` valuable? If you add a new `status` like `'cancelled'`, TypeScript forces you to handle it in every switch statement — no runtime `undefined` surprises

**Visual — Impossible States Eliminated:**

```typescript
// ❌ Problematic: 3 independent states allow 8 combinations
const [loading, setLoading] = useState(false)
const [data, setData] = useState<Product[] | null>(null)
const [error, setError] = useState<string | null>(null)
// loading=true + data=[...] is possible during transitions → UI bug

// ✅ Discriminated union: only 4 valid states
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Product[] }
  | { status: 'error'; message: string }

const [state, setState] = useState<State>({ status: 'idle' })

// Usage with narrowing:
switch (state.status) {
  case 'idle':    return <button onClick={load}>Load</button>
  case 'loading': return <Spinner />
  case 'success': return <ProductList items={state.data} />  // ← data guaranteed here
  case 'error':   return <Alert>{state.message}</Alert>      // ← message guaranteed here
  // TypeScript would error if a case is missing — exhaustive!
}
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| `const [data, setData] = useState(null)` — inferred as `null`, not `T \| null` | `useState<Product[] \| null>(null)` — explicit generic |
| `state.data` without narrowing (TypeScript error) | Narrow first: `if (state.status === 'success') state.data` |
| Adding a new status without updating switches | TypeScript exhaustive check will flag the unhandled case at compile time |

**🎯 Interview Pattern:**
- **Trigger**: "managing async state" / "loading error state" / "race conditions in React"
- **Opening**: "The discriminated union pattern eliminates impossible states. Instead of three independent booleans, a single `status` field acts as the discriminant. TypeScript narrows the type in each branch — so `state.data` is only accessible when `status === 'success'`. If you add a new status, TypeScript forces all switch statements to handle it..."

**🔑 Knowledge Chain:**
- **Prereq**: TypeScript union types, type narrowing
- **Enables**: Type-safe reducers, React Query-like state shapes, XState integration

---

### 2. Generic Components + HOC Typing

**🧠 Memory Hook:** "**Generic component = `<T extends Constraint>` in the function signature. HOC = wrap ComponentType, preserve props with generic passthrough. Both need explicit constraints.**"

**Why does this exist? / Tại sao tồn tại?**

- Why make components generic? Reusable components like `<Table<Product>>` or `<Select<Currency>>` need to work with different data types while maintaining type safety — the column renderers, selection handlers, and value transformers should be typed to the specific `T`
- Why is HOC typing complex? HOCs wrap components and may add/remove/modify props. The resulting component's props type must reflect: original props (minus injected props) + new props added by the HOC. Getting this wrong means callers either get useless autocomplete or TypeScript errors on valid usage
- Why avoid `React.FC` for HOC targets? `React.FC` adds `children?: ReactNode` implicitly which can interfere with HOC prop type calculations

**Visual — Generic Table + HOC:**

```typescript
// Generic component — Row type must have id
type TableProps<T extends { id: string }> = {
  rows: T[]
  columns: Array<{ key: keyof T; label: string; render?: (val: T[keyof T]) => React.ReactNode }>
}

function Table<T extends { id: string }>({ rows, columns }: TableProps<T>) {
  return (
    <table>
      {rows.map(row => (
        <tr key={row.id}>
          {columns.map(col => <td key={String(col.key)}>{col.render ? col.render(row[col.key]) : String(row[col.key])}</td>)}
        </tr>
      ))}
    </table>
  )
}

// Usage — TypeScript infers T as Product:
<Table<Product> rows={products} columns={[{ key: 'name', label: 'Name' }]} />

// HOC — withLoading injects loading prop, passes through P
function withLoading<P>(Comp: React.ComponentType<P>) {
  // Return component accepts P (original) + loading
  return function WithLoading({ loading, ...props }: P & { loading: boolean }) {
    if (loading) return <Spinner />
    return <Comp {...(props as P)} />  // ← need assertion because spread loses generic info
  }
}
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| Generic component without constraint: `<T>({ items }: { items: T[] })` | Add constraint if you access specific fields: `<T extends { id: string }>` |
| HOC returns `JSX.Element` instead of `React.ReactElement \| null` | Use `React.ReactElement \| null` or `JSX.Element` consistently |
| `{...props}` spreading `P & Extra` without assertion causes TS error | `{...(props as P)}` — assertion needed because spread loses the generic relationship |

**🎯 Interview Pattern:**
- **Trigger**: "reusable table component" / "HOC in TypeScript" / "generic React component"
- **Opening**: "Generic components use `<T extends Constraint>` in the function signature. The constraint ensures you can access the properties you need. For HOCs, the pattern is `<P>(Comp: React.ComponentType<P>)` returning a component that accepts `P & InjectedProps`..."

**🔑 Knowledge Chain:**
- **Prereq**: TypeScript generics, React component types
- **Enables**: Design system components, render prop patterns, headless UI libraries

---

### 3. Context Typing + Custom Hook Pattern

**🧠 Memory Hook:** "**`createContext<T | null>(null)` + custom hook with null guard = type-safe context. Null check in custom hook once instead of every consumer.**"

**Why does this exist? / Tại sao tồn tại?**

- Why is `createContext` without a default problematic? `createContext<User>({} as User)` provides a fake default — consumers outside a Provider will get an empty object typed as `User`, causing silent runtime bugs with no TypeScript error
- Why initialize with `null` instead of a fake value? Null forces explicit null checking. The custom hook encapsulates this check — throws if used outside Provider — and narrows the return type to non-null. Consumers get clean `T`, not `T | null`
- Why use a custom hook pattern? Without it, every consumer does `const ctx = useContext(AuthCtx); if (!ctx) throw new Error(...)`. That's N repetitions of the same null guard. The custom hook does it once

**Visual — Type-Safe Context Pattern:**

```typescript
type AuthContext = {
  user: User
  logout: () => void
}

// Initialize with null — explicit "must be provided"
const AuthCtx = createContext<AuthContext | null>(null)

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(initialUser)
  const logout = () => { /* ... */ setUser(null as any) }

  return <AuthCtx.Provider value={{ user, logout }}>{children}</AuthCtx.Provider>
}

// Custom hook — null guard once, consumers get AuthContext (not AuthContext | null)
export function useAuth(): AuthContext {
  const ctx = useContext(AuthCtx)
  if (ctx === null) throw new Error('useAuth must be inside AuthProvider')
  return ctx  // ← TypeScript narrows to AuthContext here
}

// Consumer — clean, no null check needed
function Header() {
  const { user, logout } = useAuth()  // ← type: AuthContext, not AuthContext | null
  return <div>{user.name} <button onClick={logout}>Logout</button></div>
}
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| `createContext<User>({} as User)` — fake default | `createContext<User \| null>(null)` + null guard hook |
| `useContext(AuthCtx)` directly in components (returns `T \| null`) | Use the custom hook that narrows to `T` |
| Exporting context object instead of custom hook | Export only the hook — hides context implementation, enforces null check |
| Context with mutable value without `useMemo` | Wrap context value in `useMemo` — prevents unnecessary re-renders of all consumers |

**🎯 Interview Pattern:**
- **Trigger**: "typed context" / "context outside provider" / "TypeScript context null error"
- **Opening**: "The pattern is: `createContext<T | null>(null)`, then a custom hook that checks for null and throws if used outside the Provider. The hook's return type is `T` (not `T | null`) because the null check narrows it. Consumers call the hook and get clean types — no null guards scattered across components..."

**🔑 Knowledge Chain:**
- **Prereq**: React Context, TypeScript narrowing, custom hooks
- **Enables**: Auth context, theme context, feature flags context — any app-wide typed state

---

## Reference Theory / Tài Liệu Tham Khảo

## Component Typing (FC, props, children)

**Giải thích (VI):** Nên ưu tiên function component + props type rõ ràng; chỉ dùng React.FC khi thực sự cần.

**Ví dụ (TypeScript):**
```tsx
type CardProps = { title: string; children?: React.ReactNode };
function Card({ title, children }: CardProps) {
  return <section><h3>{title}</h3>{children}</section>;
}
```

## useState and useReducer Typing

**Giải thích (VI):** State phức tạp nên dùng discriminated union để reducer rõ ràng và exhaustive.

**Ví dụ (TypeScript):**
```tsx
type State = { status:'idle' } | { status:'loading' } | { status:'success'; data:string[] } | { status:'error'; message:string };
```

## useRef and DOM Typing

**Giải thích (VI):** Ref DOM thường null ở lần render đầu, luôn optional-chain hoặc guard.

**Ví dụ (TypeScript):**
```tsx
const inputRef = useRef<HTMLInputElement | null>(null);
inputRef.current?.focus();
```

## useContext Typing

**Giải thích (VI):** Custom hook giúp tránh null-check lặp lại ở mọi component con.

**Ví dụ (TypeScript):**
```tsx
const Ctx = createContext<string | null>(null);
function useValue(){ const v = useContext(Ctx); if(!v) throw new Error('missing provider'); return v; }
```

## Event Typing

**Giải thích (VI):** Typing event chuẩn giúp truy cập target/currentTarget chính xác.

**Ví dụ (TypeScript):**
```tsx
const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
```

## Generic Components

**Giải thích (VI):** Generic component tái sử dụng cao nhưng cần constraints hợp lý.

**Ví dụ (TypeScript):**
```tsx
type TableProps<T extends { id: string }> = { rows: T[] };
```

## HOC Typing

**Giải thích (VI):** HOC dễ làm mất type props, cần giữ generic đúng.

**Ví dụ (TypeScript):**
```tsx
function withLoading<P>(Comp: React.ComponentType<P>){ return (props: P & {loading:boolean}) => props.loading ? <p>Loading</p> : <Comp {...props} />; }
```

## Render Props Typing

**Giải thích (VI):** Render props cần contract callback rõ input/output.

**Ví dụ (TypeScript):**
```tsx
type FetcherProps<T> = { children: (state: {data?:T; loading:boolean}) => React.ReactNode };
```

## Form Handling and Validation

**Giải thích (VI):** Form nên có shape type ổn định để map lỗi và submit.

**Ví dụ (TypeScript):**
```tsx
type LoginForm = { email: string; password: string };
```

## API Response Typing

**Giải thích (VI):** Union response giúp UI xử lý success/error an toàn.

**Ví dụ (TypeScript):**
```tsx
type Api<T> = { ok: true; data: T } | { ok: false; error: string };
```

## Cross References / Tham Chiếu Liên Quan

- [TypeScript Basics](./01-typescript-basics.md)
- [Type Inference Theory](./05-type-inference-theory.md)
- [TypeScript Modern Features](./06-typescript-modern-features.md)

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1: Should you use `React.FC` for component typing? Why or why not? / Có nên dùng `React.FC` không?

**A:** Generally no — use plain function components with explicit props types.

**Why `React.FC` is problematic:**
- In React 17 and earlier: implicitly adds `children?: ReactNode` to every component — even components that don't accept children. This hides a category of bugs
- Worse type inference for generics — React.FC doesn't play well with generic components
- Adds `propTypes`, `defaultProps`, `displayName` to the type — rarely needed

**Preferred pattern:**
```typescript
// ✅ Plain function with explicit props
type ButtonProps = {
  label: string
  onClick: () => void
  disabled?: boolean
}

function Button({ label, onClick, disabled = false }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>
}

// If you need `children`, be explicit:
type ContainerProps = {
  children: React.ReactNode  // ← explicit opt-in
  className?: string
}
```

**Tiếng Việt:** Không dùng `React.FC` vì: (1) React 17 trở xuống tự thêm `children?: ReactNode` — ẩn bug, (2) generic inference kém, (3) không cần thiết. Dùng plain function + explicit props type. Muốn children thì thêm tường minh `children: React.ReactNode`.

💡 **Interview Signal:**
- ✅ Strong: Explains the implicit `children` bug; mentions React 17 vs 18 difference; shows the explicit alternative
- ❌ Weak: "React.FC is fine, it gives you type safety" — misses why it's discouraged and what the preferred alternative is

---

### 🟡 [Mid] Q2: Type an async data-fetching hook with 3 states (loading, success, error) using TypeScript discriminated unions. / Type async fetching hook với discriminated unions.

**A:**

```typescript
// State type — discriminated union
type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string }

// Hook
function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ status: 'idle' })

  useEffect(() => {
    setState({ status: 'loading' })
    fetch(url)
      .then(res => res.json() as T)
      .then(data => setState({ status: 'success', data }))
      .catch(err => setState({ status: 'error', message: err.message }))
  }, [url])

  return state
}

// Usage with narrowing:
const state = useFetch<Product[]>('/api/products')

if (state.status === 'loading') return <Spinner />
if (state.status === 'error') return <Alert>{state.message}</Alert>
if (state.status === 'success') return <List items={state.data} />
// TypeScript narrows: state.data is Product[] here, guaranteed ✅
```

**Why discriminated union over `{ loading, data, error }` flags:** With separate flags, `loading: true` and `data: [...]` can coexist during transitions. With discriminated union, only one status is active at a time — TypeScript enforces it.

**Tiếng Việt:** `FetchState<T>` là discriminated union với `status` field. `status: 'success'` → TypeScript biết `data: T` tồn tại. `status: 'error'` → TypeScript biết `message: string` tồn tại. Loại bỏ impossible states như `loading + data` đồng thời.

💡 **Interview Signal:**
- ✅ Strong: Uses generic `<T>`, shows the narrowing in usage, explains why separate flags create impossible states
- ❌ Weak: `const [data, setData] = useState<T | null>(null)` — doesn't use discriminated union, allows impossible states

---

### 🔴 [Senior] Q3: How do you type a generic `<Select>` component that works with any option type? / Type `<Select>` component hoạt động với bất kỳ option type nào.

**A:** Use a generic component with constraints and value/onChange pairing:

```typescript
type SelectOption<T> = {
  value: T
  label: string
}

type SelectProps<T> = {
  options: SelectOption<T>[]
  value: T | null
  onChange: (value: T) => void
  placeholder?: string
  getKey?: (option: SelectOption<T>) => string  // for list rendering
}

function Select<T>({ options, value, onChange, placeholder, getKey }: SelectProps<T>) {
  return (
    <select
      value={value !== null ? String(value) : ''}
      onChange={e => {
        const selected = options.find(o => String(o.value) === e.target.value)
        if (selected) onChange(selected.value)
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={getKey ? getKey(opt) : String(opt.value)} value={String(opt.value)}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

// Usage — TypeScript infers T as Currency:
type Currency = 'VND' | 'USD' | 'EUR'
<Select<Currency>
  options={[{ value: 'VND', label: 'Vietnamese Dong' }]}
  value={selectedCurrency}
  onChange={setSelectedCurrency}  // ← (value: Currency) => void ✅
/>
```

**Key design:** `value: T` and `onChange: (value: T) => void` are paired — TypeScript ensures the same `T` flows through both, preventing type mismatches between selected value and change handler.

**Tiếng Việt:** Generic Select dùng `<T>` với `value: T` và `onChange: (value: T) => void` — TypeScript đảm bảo cùng type T. Khi dùng `<Select<Currency>>`, TypeScript infer onChange phải nhận `Currency`, không thể nhầm type. Đây là pattern cơ bản của design system components.

💡 **Interview Signal:**
- ✅ Strong: Shows `value` and `onChange` paired with same `T`; mentions the TypeScript constraint on usage; discusses key extraction for list rendering
- ❌ Weak: `value: any; onChange: (v: any) => void` — defeats TypeScript's purpose in a reusable component

---

### 🔴 [Senior] Q4: A component uses `useContext(AuthCtx)` and gets `AuthContext | null`. What's the right pattern to make consumers receive `AuthContext` (non-null)? / Pattern nào để context consumers không cần null check?

**A:** The **custom hook with null guard** pattern:

```typescript
type AuthContextType = { user: User; logout: () => void }
const AuthCtx = createContext<AuthContextType | null>(null)

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value: AuthContextType = { user: currentUser, logout: handleLogout }
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

// Custom hook — null guard once, returns AuthContextType (not AuthContextType | null)
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthCtx)
  if (ctx === null) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx  // TypeScript narrows to AuthContextType here
}

// Consumers — clean, no null check:
function UserAvatar() {
  const { user } = useAuth()  // type: AuthContextType, not | null
  return <img src={user.avatarUrl} alt={user.name} />
}
```

**Why `createContext<T | null>(null)` instead of `createContext<T>({} as T)`?**
The fake default `{} as T` is a lie — it's typed as `T` but has no actual data. If a component accidentally used outside the Provider, it accesses `{}.user` silently returning `undefined` — a runtime bug with no TypeScript warning. `null` forces the check.

**Tiếng Việt:** Pattern: `createContext<T | null>(null)` + custom hook throw khi null. Custom hook return type là `T` (không phải `T | null`) vì null check đã làm trong hook. Consumers dùng hook không cần null check. Dùng `{} as T` là fake default — TypeScript không warn nhưng runtime crash.

💡 **Interview Signal:**
- ✅ Strong: Explains WHY null is better than fake default; shows the custom hook narrowing pattern; mentions the throw message for good DX
- ❌ Weak: "`createContext<T>({} as T)` to avoid null" — technically wrong (silent runtime bug potential); or checking null in every consumer (repetitive, easy to forget)

---

## Q&A Summary / Tóm Tắt Q&A

| # | Topic | Key Insight |
|---|-------|-------------|
| Q1 | React.FC | Avoid — implicit children, poor generic inference. Use plain function + explicit props |
| Q2 | Discriminated union state | `status` discriminant eliminates impossible states; TypeScript narrows in each branch |
| Q3 | Generic Select | `value: T` + `onChange: (T) => void` — paired generic ensures type safety |
| Q4 | Context null guard | `createContext<T \| null>(null)` + custom hook with throw = clean consumer types |

---

## ⚡ Cold Call Simulation

**Q: "How do you handle TypeScript in a complex form with 10+ fields and async validation?"**

**30-second answer:**
"I define a `FormValues` type with all the fields, then use react-hook-form's `useForm<FormValues>()` — it infers types for register, watch, setValue, and the submit handler from that single type. For validation, I integrate with Zod: `zodResolver(schema)` where the schema is derived from the FormValues type using `z.object({...})`. The resolver validates at runtime and TypeScript knows the parsed output type matches FormValues. Error handling: form errors are typed as `Partial<Record<keyof FormValues, FieldError>>` — TypeScript ensures you only access field names that exist in FormValues."

---

## Retrieval Self-Check / Tự Kiểm Tra

**Close this document. Answer from memory:**

**Retrieval:**
1. Name 2 reasons to avoid `React.FC` for component typing.
2. What does `createContext<T | null>(null)` solve that `createContext<T>({} as T)` doesn't?
3. Write the discriminated union type for a fetch state with idle/loading/success/error.
4. In a generic `<Table<T extends {id: string}>>`, why is the constraint needed?
5. What TypeScript technique does the custom context hook use to narrow from `T | null` to `T`?

**Visual:**
- Draw the discriminated union state machine: idle → loading → success OR error
- Draw the HOC type: `ComponentType<P>` → wraps → `(P & Extra) => ReactElement`

**Application:**
- Type a `useLocalStorage<T>` hook that reads/writes typed data to localStorage.
- Design the TypeScript types for a shopping cart: add item, remove item, clear — all type-safe.

**Debug:**
- `state.data` shows TypeScript error "Property 'data' does not exist on type..." — why? How do you fix?
- Context hook returns `T | null` instead of `T` — what's missing from the implementation?

**Teach:**
- Explain discriminated unions to a junior: "Instead of asking 'is loading true? is data null? is error null?' — three separate questions — you ask ONE question: 'what status are we in?' And TypeScript knows exactly what other fields exist for that status."

---

🔁 **Spaced Repetition:** Review in 3 days → 7 days → 14 days. Focus: discriminated union state pattern, context null guard hook, generic component constraint syntax.

---

## Connections / Liên Kết

- **Prereqs**: [03-react/03-hooks-deep-dive.md](../03-react/03-hooks-deep-dive.md), [04-typescript-comprehensive.md](./04-typescript-comprehensive.md)
- **See also**: [05-type-inference-theory.md](./05-type-inference-theory.md), [06-typescript-modern-features.md](./06-typescript-modern-features.md)
- **State**: Discriminated unions connect to XState patterns in [03-react/10-modern-react-features.md](../03-react/10-modern-react-features.md)

---

[← Previous: TypeScript Comprehensive](./04-typescript-comprehensive.md) | [Next: Type Inference Theory →](./05-type-inference-theory.md) | [Back to Table of Contents](../../00-table-of-contents.md)

