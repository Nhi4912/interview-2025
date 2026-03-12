# Component Patterns - Advanced React Patterns

> Patterns giúp viết reusable, maintainable components. Essential knowledge cho senior React developers.

---

## Mục Lục

- [Overview](#-overview)
- [Compound Components](#-compound-components)
- [Render Props](#-render-props)
- [Higher-Order Components (HOC)](#-higher-order-components)
- [Custom Hooks](#-custom-hooks)
- [Controlled vs Uncontrolled](#-controlled-vs-uncontrolled)
- [Container/Presentational](#-containerpresentational)
- [Câu Hỏi Phỏng Vấn](#-câu-hỏi-phỏng-vấn)

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│              REACT PATTERNS EVOLUTION                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   BEFORE HOOKS (Class era)                                       │
│   ┌─────────────────┐  ┌─────────────────┐                      │
│   │       HOC       │  │  Render Props   │                      │
│   │  withAuth(Comp) │  │  <Mouse render= │                      │
│   └─────────────────┘  └─────────────────┘                      │
│                                                                   │
│   AFTER HOOKS (Modern)                                           │
│   ┌─────────────────┐  Still Useful:                            │
│   │  Custom Hooks   │  ┌─────────────────┐                      │
│   │   useAuth()     │  │ Compound Comps  │                      │
│   └─────────────────┘  └─────────────────┘                      │
│                                                                   │
│   Pattern Selection:                                             │
│   • Logic reuse → Custom Hooks (preferred)                      │
│   • Component composition → Compound Components                  │
│   • Cross-cutting concerns → HOC (rarely)                       │
│   • Dynamic rendering → Render Props (specific cases)           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Compound Components

Components that work together to accomplish a task.

### Basic Example

```jsx
// Usage - Clean, flexible API
<Select value={selected} onChange={setSelected}>
    <Select.Trigger>
        {selected || 'Select an option'}
    </Select.Trigger>
    <Select.Options>
        <Select.Option value="react">React</Select.Option>
        <Select.Option value="vue">Vue</Select.Option>
        <Select.Option value="angular">Angular</Select.Option>
    </Select.Options>
</Select>

// Implementation
const SelectContext = createContext(null);

function Select({ children, value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <SelectContext.Provider value={{ value, onChange, isOpen, setIsOpen }}>
            <div className="select">{children}</div>
        </SelectContext.Provider>
    );
}

Select.Trigger = function Trigger({ children }) {
    const { setIsOpen } = useContext(SelectContext);
    return (
        <button onClick={() => setIsOpen(prev => !prev)}>
            {children}
        </button>
    );
};

Select.Options = function Options({ children }) {
    const { isOpen } = useContext(SelectContext);
    if (!isOpen) return null;
    return <ul className="select-options">{children}</ul>;
};

Select.Option = function Option({ value, children }) {
    const { value: selected, onChange, setIsOpen } = useContext(SelectContext);

    return (
        <li
            className={value === selected ? 'selected' : ''}
            onClick={() => {
                onChange(value);
                setIsOpen(false);
            }}
        >
            {children}
        </li>
    );
};
```

### Accordion Example

```jsx
// Usage
<Accordion>
    <Accordion.Item>
        <Accordion.Header>Section 1</Accordion.Header>
        <Accordion.Panel>Content for section 1</Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item>
        <Accordion.Header>Section 2</Accordion.Header>
        <Accordion.Panel>Content for section 2</Accordion.Panel>
    </Accordion.Item>
</Accordion>

// Implementation
const AccordionContext = createContext(null);
const AccordionItemContext = createContext(null);

function Accordion({ children, allowMultiple = false }) {
    const [openItems, setOpenItems] = useState(new Set());

    const toggle = (id) => {
        setOpenItems(prev => {
            const next = new Set(allowMultiple ? prev : []);
            if (prev.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    return (
        <AccordionContext.Provider value={{ openItems, toggle }}>
            <div className="accordion">{children}</div>
        </AccordionContext.Provider>
    );
}

Accordion.Item = function Item({ children }) {
    const id = useId();
    return (
        <AccordionItemContext.Provider value={{ id }}>
            <div className="accordion-item">{children}</div>
        </AccordionItemContext.Provider>
    );
};

Accordion.Header = function Header({ children }) {
    const { openItems, toggle } = useContext(AccordionContext);
    const { id } = useContext(AccordionItemContext);
    const isOpen = openItems.has(id);

    return (
        <button
            onClick={() => toggle(id)}
            aria-expanded={isOpen}
        >
            {children}
            <span>{isOpen ? '−' : '+'}</span>
        </button>
    );
};

Accordion.Panel = function Panel({ children }) {
    const { openItems } = useContext(AccordionContext);
    const { id } = useContext(AccordionItemContext);

    if (!openItems.has(id)) return null;
    return <div className="accordion-panel">{children}</div>;
};
```

---

## 🎨 Render Props

Pass a function as prop to determine what to render.

### Basic Pattern

```jsx
// Mouse tracker with render prop
function MouseTracker({ render }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return render(position);
}

// Usage
<MouseTracker
    render={({ x, y }) => (
        <div>Mouse position: {x}, {y}</div>
    )}
/>

// Or using children as function
<MouseTracker>
    {({ x, y }) => (
        <div>Mouse position: {x}, {y}</div>
    )}
</MouseTracker>

function MouseTracker({ children }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    // ... same logic
    return children(position);
}
```

### Toggle Component

```jsx
function Toggle({ children, initialOn = false }) {
    const [on, setOn] = useState(initialOn);

    const toggle = () => setOn(prev => !prev);
    const setOnValue = () => setOn(true);
    const setOffValue = () => setOn(false);

    return children({
        on,
        toggle,
        setOn: setOnValue,
        setOff: setOffValue
    });
}

// Usage
<Toggle>
    {({ on, toggle }) => (
        <div>
            <button onClick={toggle}>
                {on ? 'ON' : 'OFF'}
            </button>
            {on && <div>Content visible when ON</div>}
        </div>
    )}
</Toggle>
```

### Downshift-style Pattern

```jsx
function Dropdown({ items, children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const getToggleProps = (props = {}) => ({
        onClick: () => setIsOpen(prev => !prev),
        'aria-expanded': isOpen,
        ...props
    });

    const getMenuProps = (props = {}) => ({
        role: 'listbox',
        hidden: !isOpen,
        ...props
    });

    const getItemProps = ({ item, index, ...props }) => ({
        role: 'option',
        'aria-selected': selectedItem === item,
        onClick: () => {
            setSelectedItem(item);
            setIsOpen(false);
        },
        onMouseEnter: () => setHighlightedIndex(index),
        ...props
    });

    return children({
        isOpen,
        selectedItem,
        highlightedIndex,
        getToggleProps,
        getMenuProps,
        getItemProps
    });
}

// Usage
<Dropdown items={['Apple', 'Banana', 'Cherry']}>
    {({
        isOpen,
        selectedItem,
        highlightedIndex,
        getToggleProps,
        getMenuProps,
        getItemProps
    }) => (
        <div>
            <button {...getToggleProps()}>
                {selectedItem || 'Select fruit'}
            </button>
            <ul {...getMenuProps()}>
                {items.map((item, index) => (
                    <li
                        key={item}
                        {...getItemProps({ item, index })}
                        style={{
                            backgroundColor:
                                highlightedIndex === index ? 'lightblue' : 'white'
                        }}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    )}
</Dropdown>
```

---

## 🎁 Higher-Order Components

Function that takes a component and returns enhanced component.

```jsx
// Basic HOC
function withLoading(WrappedComponent) {
    return function WithLoadingComponent({ isLoading, ...props }) {
        if (isLoading) {
            return <Spinner />;
        }
        return <WrappedComponent {...props} />;
    };
}

// Usage
const UserListWithLoading = withLoading(UserList);
<UserListWithLoading isLoading={loading} users={users} />

// Authentication HOC
function withAuth(WrappedComponent) {
    return function WithAuthComponent(props) {
        const { isAuthenticated, isLoading } = useAuth();

        if (isLoading) {
            return <Spinner />;
        }

        if (!isAuthenticated) {
            return <Navigate to="/login" />;
        }

        return <WrappedComponent {...props} />;
    };
}

// Logging HOC
function withLogger(WrappedComponent) {
    return function WithLoggerComponent(props) {
        useEffect(() => {
            console.log(`${WrappedComponent.name} mounted with props:`, props);
        }, []);

        useEffect(() => {
            console.log(`${WrappedComponent.name} updated with props:`, props);
        });

        return <WrappedComponent {...props} />;
    };
}

// Composing HOCs
const EnhancedComponent = withAuth(withLogger(withLoading(BaseComponent)));

// Better: Use compose utility
import { compose } from 'lodash';
const enhance = compose(withAuth, withLogger, withLoading);
const EnhancedComponent = enhance(BaseComponent);
```

### HOC Best Practices

```jsx
// 1. Pass through unrelated props
function withSubscription(WrappedComponent, selectData) {
    return function WithSubscription(props) {
        const [data, setData] = useState([]);

        useEffect(() => {
            const subscription = DataSource.subscribe(() => {
                setData(selectData(DataSource, props));
            });
            return () => subscription.unsubscribe();
        }, [props]);

        // Pass through all props plus the new data
        return <WrappedComponent data={data} {...props} />;
    };
}

// 2. Maximize composability
// ❌ Bad
const ConnectedComment = withSubscription(
    withRouter(Comment)
);

// ✅ Good - Use compose
const enhance = compose(
    connect(mapStateToProps),
    withRouter,
    withSubscription
);
const ConnectedComment = enhance(Comment);

// 3. Wrap display name for debugging
function withSubscription(WrappedComponent) {
    function WithSubscription(props) {
        // ...
    }
    WithSubscription.displayName =
        `WithSubscription(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    return WithSubscription;
}

// 4. Don't use HOCs inside render method
// ❌ Bad - Creates new component every render
function Component() {
    const EnhancedComponent = withHOC(BaseComponent);
    return <EnhancedComponent />;
}

// ✅ Good - Define outside
const EnhancedComponent = withHOC(BaseComponent);
function Component() {
    return <EnhancedComponent />;
}
```

---

## 🪝 Custom Hooks

Extract and reuse stateful logic.

```jsx
// useLocalStorage
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function
                ? value(storedValue)
                : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}

// useDebounce
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

// useOnClickOutside
function useOnClickOutside(ref, handler) {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
}

// useAsync
function useAsync(asyncFunction, immediate = true) {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        setStatus('pending');
        setData(null);
        setError(null);

        try {
            const response = await asyncFunction(...args);
            setData(response);
            setStatus('success');
            return response;
        } catch (error) {
            setError(error);
            setStatus('error');
            throw error;
        }
    }, [asyncFunction]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return { execute, status, data, error, isLoading: status === 'pending' };
}

// Usage
function UserProfile({ userId }) {
    const { data: user, isLoading, error } = useAsync(
        () => fetchUser(userId),
        true
    );

    if (isLoading) return <Spinner />;
    if (error) return <Error message={error.message} />;
    return <Profile user={user} />;
}
```

### usePrevious Hook

```jsx
function usePrevious(value) {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

// Usage
function Counter() {
    const [count, setCount] = useState(0);
    const prevCount = usePrevious(count);

    return (
        <div>
            Now: {count}, Before: {prevCount}
            <button onClick={() => setCount(c => c + 1)}>+</button>
        </div>
    );
}
```

---

## 🎮 Controlled vs Uncontrolled

### Controlled Component

React controls the state.

```jsx
function ControlledInput() {
    const [value, setValue] = useState('');

    return (
        <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}
```

### Uncontrolled Component

DOM handles the state.

```jsx
function UncontrolledInput() {
    const inputRef = useRef();

    const handleSubmit = () => {
        console.log(inputRef.current.value);
    };

    return (
        <>
            <input ref={inputRef} defaultValue="initial" />
            <button onClick={handleSubmit}>Submit</button>
        </>
    );
}
```

### Flexible Component (Both)

```jsx
function Input({ value, defaultValue, onChange, ...props }) {
    const [internalValue, setInternalValue] = useState(defaultValue || '');

    const isControlled = value !== undefined;
    const inputValue = isControlled ? value : internalValue;

    const handleChange = (e) => {
        if (!isControlled) {
            setInternalValue(e.target.value);
        }
        onChange?.(e);
    };

    return (
        <input
            value={inputValue}
            onChange={handleChange}
            {...props}
        />
    );
}

// Can be used both ways
<Input defaultValue="uncontrolled" /> // Uncontrolled
<Input value={value} onChange={handleChange} /> // Controlled
```

---

## 📦 Container/Presentational

Separate logic from presentation.

```jsx
// Container (Logic)
function UserListContainer() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers()
            .then(setUsers)
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (userId) => {
        await deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
    };

    return (
        <UserList
            users={users}
            loading={loading}
            error={error}
            onDelete={handleDelete}
        />
    );
}

// Presentational (UI)
function UserList({ users, loading, error, onDelete }) {
    if (loading) return <Spinner />;
    if (error) return <Error message={error.message} />;

    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>
                    {user.name}
                    <button onClick={() => onDelete(user.id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
}

// Modern approach: Custom Hook replaces Container
function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers()
            .then(setUsers)
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    const deleteUser = async (userId) => {
        await deleteUserAPI(userId);
        setUsers(users.filter(u => u.id !== userId));
    };

    return { users, loading, error, deleteUser };
}

// Component uses hook directly
function UserList() {
    const { users, loading, error, deleteUser } = useUsers();
    // ... render
}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Controlled vs Uncontrolled component?**

A:
- Controlled: React manages state via props (value + onChange)
- Uncontrolled: DOM manages state, use refs to read values

### 🟡 Mid-level

**Q: Khi nào dùng Render Props vs Custom Hooks?**

A:
- Custom Hooks: Logic reuse (preferred in modern React)
- Render Props: When child rendering depends on dynamic logic, headless UI libraries

**Q: Giải thích Compound Components pattern**

A: Components work together sharing implicit state via Context. Examples: `<Select>/<Option>`, `<Tabs>/<Tab>`, `<Accordion>/<Panel>`. Benefits: flexible API, encapsulated state.

### 🔴 Senior

**Q: Design a flexible Modal component**

```jsx
// Compound pattern với hooks
const Modal = {
    Root: ModalRoot,
    Trigger: ModalTrigger,
    Content: ModalContent,
    Close: ModalClose
};

// Hook for programmatic control
function useModal() {
    const [isOpen, setIsOpen] = useState(false);
    return {
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen(p => !p)
    };
}

// Usage
const modal = useModal();
<Modal.Root open={modal.isOpen} onOpenChange={modal.toggle}>
    <Modal.Trigger>Open</Modal.Trigger>
    <Modal.Content>
        <h2>Title</h2>
        <Modal.Close>Close</Modal.Close>
    </Modal.Content>
</Modal.Root>
```

---

## 📚 Active Recall

1. [ ] Implement Compound Component cho Tabs
2. [ ] So sánh HOC vs Render Props vs Custom Hooks
3. [ ] Khi nào dùng Controlled vs Uncontrolled?
4. [ ] Implement useDebounce hook từ scratch
5. [ ] Design reusable Dropdown component

---

> **Tiếp theo:** [05-react-internals.md](./05-react-internals.md) - React Internals
