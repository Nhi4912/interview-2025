# TypeScript with React

> TypeScript + React là standard cho modern frontend development. Essential patterns cho type-safe React apps.

---

## Mục Lục

- [Component Types](#-component-types)
- [Props & State](#-props--state)
- [Hooks](#-hooks)
- [Events](#-events)
- [Context](#-context)
- [Generic Components](#-generic-components)
- [Câu Hỏi Phỏng Vấn](#-câu-hỏi-phỏng-vấn)

---

## 🧩 Component Types

### Function Components

```typescript
// Basic FC (không khuyến khích dùng React.FC)
interface Props {
    name: string;
    age?: number;
}

function Greeting({ name, age }: Props) {
    return <div>Hello, {name}! {age && `Age: ${age}`}</div>;
}

// Arrow function
const Greeting2 = ({ name, age }: Props) => (
    <div>Hello, {name}! {age && `Age: ${age}`}</div>
);

// With children
interface PropsWithChildren {
    title: string;
    children: React.ReactNode;
}

function Card({ title, children }: PropsWithChildren) {
    return (
        <div>
            <h2>{title}</h2>
            {children}
        </div>
    );
}

// React.FC (legacy, có issues với generics)
const Greeting3: React.FC<Props> = ({ name, age }) => (
    <div>Hello, {name}!</div>
);
```

### Common React Types

```typescript
// React.ReactNode - anything renderable
type ReactNode =
    | string
    | number
    | boolean
    | null
    | undefined
    | ReactElement
    | ReactFragment
    | ReactPortal;

// React.ReactElement - JSX element
type ReactElement<P = any> = {
    type: string | ComponentType<P>;
    props: P;
    key: Key | null;
};

// React.ComponentType - class or function component
type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;

// JSX.Element - return type of JSX
const element: JSX.Element = <div>Hello</div>;
```

---

## 📋 Props & State

### Props Patterns

```typescript
// Required vs Optional
interface ButtonProps {
    label: string;          // Required
    onClick: () => void;    // Required
    disabled?: boolean;     // Optional
    variant?: "primary" | "secondary"; // Optional with literal type
}

// Default values
function Button({
    label,
    onClick,
    disabled = false,
    variant = "primary"
}: ButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={variant}
        >
            {label}
        </button>
    );
}

// Extending HTML elements
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

function Input({ label, error, ...inputProps }: InputProps) {
    return (
        <div>
            <label>{label}</label>
            <input {...inputProps} />
            {error && <span className="error">{error}</span>}
        </div>
    );
}

// Polymorphic component with 'as' prop
type PolymorphicProps<E extends React.ElementType> = {
    as?: E;
    children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<E>, "as" | "children">;

function Container<E extends React.ElementType = "div">({
    as,
    children,
    ...props
}: PolymorphicProps<E>) {
    const Component = as || "div";
    return <Component {...props}>{children}</Component>;
}

// Usage
<Container as="section" className="container">Content</Container>
<Container as="a" href="/home">Link</Container>
```

### State Types

```typescript
// Basic state
const [count, setCount] = useState<number>(0);

// Inferred state
const [name, setName] = useState(""); // string

// Union state
type Status = "idle" | "loading" | "success" | "error";
const [status, setStatus] = useState<Status>("idle");

// Object state
interface User {
    id: string;
    name: string;
    email: string;
}

const [user, setUser] = useState<User | null>(null);

// Complex state with discriminated union
type AsyncState<T> =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: T }
    | { status: "error"; error: Error };

const [state, setState] = useState<AsyncState<User>>({ status: "idle" });
```

---

## 🪝 Hooks

### useState

```typescript
// Explicit type
const [user, setUser] = useState<User | null>(null);

// Lazy initialization
const [state, setState] = useState<ExpensiveState>(() => {
    return computeExpensiveInitialState();
});

// Type inference works for primitives
const [count, setCount] = useState(0); // number
const [name, setName] = useState(""); // string
```

### useReducer

```typescript
// State and Action types
interface State {
    count: number;
    error: string | null;
}

type Action =
    | { type: "increment" }
    | { type: "decrement" }
    | { type: "reset"; payload: number }
    | { type: "setError"; payload: string };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "increment":
            return { ...state, count: state.count + 1 };
        case "decrement":
            return { ...state, count: state.count - 1 };
        case "reset":
            return { ...state, count: action.payload };
        case "setError":
            return { ...state, error: action.payload };
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, { count: 0, error: null });

    return (
        <div>
            <span>{state.count}</span>
            <button onClick={() => dispatch({ type: "increment" })}>+</button>
            <button onClick={() => dispatch({ type: "reset", payload: 0 })}>
                Reset
            </button>
        </div>
    );
}
```

### useRef

```typescript
// DOM ref
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
    inputRef.current?.focus();
}, []);

// Mutable ref (no null)
const countRef = useRef<number>(0);
countRef.current = 5;

// Callback ref
const callbackRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
        node.scrollIntoView();
    }
}, []);
```

### useMemo & useCallback

```typescript
// useMemo
const expensiveValue = useMemo<number>(() => {
    return computeExpensiveValue(a, b);
}, [a, b]);

// useCallback
const handleClick = useCallback<(id: string) => void>((id) => {
    console.log("Clicked:", id);
}, []);

// Type inference usually works
const memoizedValue = useMemo(() => items.filter(x => x.active), [items]);
const memoizedFn = useCallback(() => setCount(c => c + 1), []);
```

### Custom Hooks

```typescript
// Return tuple
function useToggle(initial = false): [boolean, () => void] {
    const [value, setValue] = useState(initial);
    const toggle = useCallback(() => setValue(v => !v), []);
    return [value, toggle];
}

// Return object
interface UseCounterReturn {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
}

function useCounter(initial = 0): UseCounterReturn {
    const [count, setCount] = useState(initial);

    return {
        count,
        increment: useCallback(() => setCount(c => c + 1), []),
        decrement: useCallback(() => setCount(c => c - 1), []),
        reset: useCallback(() => setCount(initial), [initial]),
    };
}

// Generic hook
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setValue = useCallback((value: T) => {
        setStoredValue(value);
        localStorage.setItem(key, JSON.stringify(value));
    }, [key]);

    return [storedValue, setValue];
}
```

---

## 🖱️ Events

### Event Types

```typescript
// Mouse events
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    console.log(event.clientX, event.clientY);
}

// Form events
function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
}

function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
}

// Keyboard events
function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
        // ...
    }
}

// Focus events
function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
    console.log(event.target.name);
}

// Drag events
function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const files = event.dataTransfer.files;
}
```

### Event Handler Props

```typescript
interface FormProps {
    onSubmit: (data: FormData) => void;
    onChange: (field: string, value: string) => void;
}

function Form({ onSubmit, onChange }: FormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="email"
                onChange={(e) => onChange("email", e.target.value)}
            />
        </form>
    );
}
```

---

## 🌐 Context

### Typed Context

```typescript
// Define context type
interface AuthContextType {
    user: User | null;
    login: (credentials: Credentials) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

// Create context with default value
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (credentials: Credentials) => {
        setIsLoading(true);
        const user = await authService.login(credentials);
        setUser(user);
        setIsLoading(false);
    };

    const logout = () => {
        setUser(null);
        authService.logout();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook with null check
function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}

// Usage
function Profile() {
    const { user, logout } = useAuth();

    if (!user) return <Login />;

    return (
        <div>
            <h1>{user.name}</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
```

---

## 🔄 Generic Components

```typescript
// Generic list component
interface ListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
    return (
        <ul>
            {items.map((item, index) => (
                <li key={keyExtractor(item)}>{renderItem(item, index)}</li>
            ))}
        </ul>
    );
}

// Usage
interface User {
    id: string;
    name: string;
}

<List<User>
    items={users}
    renderItem={(user) => <span>{user.name}</span>}
    keyExtractor={(user) => user.id}
/>

// Generic select component
interface SelectProps<T> {
    options: T[];
    value: T;
    onChange: (value: T) => void;
    getLabel: (option: T) => string;
    getValue: (option: T) => string;
}

function Select<T>({
    options,
    value,
    onChange,
    getLabel,
    getValue
}: SelectProps<T>) {
    return (
        <select
            value={getValue(value)}
            onChange={(e) => {
                const selected = options.find(o => getValue(o) === e.target.value);
                if (selected) onChange(selected);
            }}
        >
            {options.map((option) => (
                <option key={getValue(option)} value={getValue(option)}>
                    {getLabel(option)}
                </option>
            ))}
        </select>
    );
}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Cách type props cho React component?**

```typescript
interface Props {
    name: string;
    age?: number;
}

function Component({ name, age }: Props) { ... }
```

**Q: Cách type useState?**

```typescript
const [user, setUser] = useState<User | null>(null);
```

### 🟡 Mid-level

**Q: Cách extend HTML element props?**

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: "primary" | "secondary";
}
```

**Q: Cách type custom hook?**

```typescript
function useCounter(initial = 0): {
    count: number;
    increment: () => void;
} {
    // ...
}
```

### 🔴 Senior

**Q: Implement polymorphic component với TypeScript**

A: See Polymorphic component section above.

**Q: Generic component cho reusable data table**

```typescript
interface TableProps<T> {
    data: T[];
    columns: Array<{
        key: keyof T;
        header: string;
        render?: (value: T[keyof T], row: T) => React.ReactNode;
    }>;
}

function Table<T extends Record<string, any>>({ data, columns }: TableProps<T>) {
    // ...
}
```

---

## 📚 Active Recall

1. [ ] Type a form component với validation
2. [ ] Implement generic List component
3. [ ] Create typed Context với custom hook
4. [ ] Type event handlers cho form
5. [ ] Write polymorphic Button component

---

> **Tiếp theo:** [mindmap-typescript.md](./mindmap-typescript.md) - TypeScript Mind Map
