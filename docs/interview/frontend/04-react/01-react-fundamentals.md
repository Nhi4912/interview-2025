# React Fundamentals - Core Concepts Deep Dive

> React là library phổ biến nhất để xây dựng UI. Hiểu fundamentals là foundation cho mọi advanced concepts.

---

## Mục Lục

- [Overview](#-overview)
- [JSX](#-jsx)
- [Components](#-components)
- [Props](#-props)
- [State](#-state)
- [Event Handling](#-event-handling)
- [Conditional Rendering](#-conditional-rendering)
- [Lists & Keys](#-lists--keys)
- [Câu Hỏi Phỏng Vấn](#-câu-hỏi-phỏng-vấn)

---

## 🎯 Overview

React là **declarative**, **component-based** library để xây dựng user interfaces.

```
┌─────────────────────────────────────────────────────────────────┐
│                    REACT CORE CONCEPTS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌──────────────────┐                                           │
│   │       JSX        │  HTML-like syntax in JavaScript           │
│   └────────┬─────────┘                                           │
│            │                                                      │
│            ▼                                                      │
│   ┌──────────────────┐                                           │
│   │    Components    │  Reusable UI pieces                       │
│   └────────┬─────────┘                                           │
│            │                                                      │
│     ┌──────┴──────┐                                              │
│     │             │                                               │
│     ▼             ▼                                               │
│   ┌─────┐     ┌───────┐                                          │
│   │Props│     │ State │                                          │
│   └──┬──┘     └───┬───┘                                          │
│      │            │                                               │
│      │            ▼                                               │
│      │    ┌──────────────┐                                       │
│      └───►│   Re-render  │◄── When data changes                  │
│           └──────────────┘                                       │
│                   │                                               │
│                   ▼                                               │
│           ┌──────────────┐                                       │
│           │  Virtual DOM │                                       │
│           └──────────────┘                                       │
│                   │                                               │
│                   ▼                                               │
│           ┌──────────────┐                                       │
│           │   Real DOM   │                                       │
│           └──────────────┘                                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Why React?

| Feature | Benefit |
|---------|---------|
| Declarative | Describe UI, React handles updates |
| Component-based | Reusable, maintainable code |
| Virtual DOM | Efficient updates, better performance |
| One-way data flow | Predictable state management |
| Large ecosystem | Libraries, tools, community |

---

## 📝 JSX

### What is JSX?

JSX = JavaScript XML. Syntax extension cho JavaScript.

```jsx
// JSX
const element = <h1 className="greeting">Hello, World!</h1>;

// Compiled to:
const element = React.createElement(
    'h1',
    { className: 'greeting' },
    'Hello, World!'
);
```

### JSX Rules

```jsx
// 1. Must return single element
// ❌
return (
    <h1>Title</h1>
    <p>Content</p>
);

// ✅ Wrap in parent element
return (
    <div>
        <h1>Title</h1>
        <p>Content</p>
    </div>
);

// ✅ Or use Fragment
return (
    <>
        <h1>Title</h1>
        <p>Content</p>
    </>
);

// 2. Use className instead of class
<div className="container">...</div>

// 3. Self-closing tags must have /
<img src="image.jpg" />
<input type="text" />

// 4. JavaScript expressions in {}
const name = "John";
const element = <h1>Hello, {name}!</h1>;

// 5. camelCase for attributes
<button onClick={handleClick} tabIndex="0">Click</button>

// 6. style as object
<div style={{ backgroundColor: 'blue', fontSize: '16px' }}>
    Styled div
</div>
```

### JSX Expressions

```jsx
// Variables
const name = "World";
const greeting = <h1>Hello, {name}!</h1>;

// Expressions
const element = <span>{1 + 1}</span>; // 2

// Function calls
const element = <span>{formatDate(new Date())}</span>;

// Ternary operator
const element = <span>{isLoggedIn ? 'Welcome' : 'Please login'}</span>;

// Logical AND for conditional rendering
const element = <div>{showWarning && <Warning />}</div>;

// Array mapping
const listItems = items.map(item => <li key={item.id}>{item.name}</li>);
```

---

## 🧩 Components

### Function Components

```jsx
// Simple function component
function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}

// Arrow function
const Welcome = (props) => <h1>Hello, {props.name}</h1>;

// Destructuring props
const Welcome = ({ name, age }) => (
    <div>
        <h1>Hello, {name}</h1>
        <p>Age: {age}</p>
    </div>
);
```

### Class Components (Legacy)

```jsx
class Welcome extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}

// With state and lifecycle
class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
    }

    componentDidMount() {
        console.log('Mounted');
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('Updated');
    }

    componentWillUnmount() {
        console.log('Will unmount');
    }

    handleClick = () => {
        this.setState(prev => ({ count: prev.count + 1 }));
    };

    render() {
        return (
            <button onClick={this.handleClick}>
                Count: {this.state.count}
            </button>
        );
    }
}
```

### Component Composition

```jsx
// Container component
function Card({ children, title }) {
    return (
        <div className="card">
            <h2 className="card-title">{title}</h2>
            <div className="card-content">
                {children}
            </div>
        </div>
    );
}

// Usage
function App() {
    return (
        <Card title="User Profile">
            <p>Name: John Doe</p>
            <p>Email: john@example.com</p>
        </Card>
    );
}
```

---

## 📥 Props

### Passing Props

```jsx
// Parent component
function App() {
    const user = { name: 'John', age: 30 };

    return (
        <UserProfile
            name={user.name}
            age={user.age}
            isAdmin={true}
            onLogout={() => console.log('Logout')}
        />
    );
}

// Child component
function UserProfile({ name, age, isAdmin, onLogout }) {
    return (
        <div>
            <h1>{name}</h1>
            <p>Age: {age}</p>
            {isAdmin && <span>Admin</span>}
            <button onClick={onLogout}>Logout</button>
        </div>
    );
}
```

### Default Props

```jsx
// Using default parameters
function Button({ text = 'Click me', type = 'primary' }) {
    return <button className={`btn btn-${type}`}>{text}</button>;
}

// Or defaultProps (older pattern)
Button.defaultProps = {
    text: 'Click me',
    type: 'primary'
};
```

### Prop Types (Runtime validation)

```jsx
import PropTypes from 'prop-types';

function User({ name, age, email, friends }) {
    return (
        <div>
            <h1>{name}</h1>
            <p>Age: {age}</p>
        </div>
    );
}

User.propTypes = {
    name: PropTypes.string.isRequired,
    age: PropTypes.number,
    email: PropTypes.string,
    friends: PropTypes.arrayOf(PropTypes.string),
    address: PropTypes.shape({
        street: PropTypes.string,
        city: PropTypes.string
    }),
    status: PropTypes.oneOf(['active', 'inactive']),
    renderItem: PropTypes.func
};
```

### Props vs State

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROPS vs STATE                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   PROPS                          STATE                           │
│   ┌─────────────────────┐       ┌─────────────────────┐          │
│   │ • Passed from parent│       │ • Managed internally │          │
│   │ • Read-only         │       │ • Can be changed    │          │
│   │ • Immutable         │       │ • Mutable (via set) │          │
│   │ • For configuration │       │ • For dynamic data  │          │
│   └─────────────────────┘       └─────────────────────┘          │
│                                                                   │
│   Parent                                                          │
│   ┌──────────────────────────────────────┐                       │
│   │ const [count, setCount] = useState() │ ◄── STATE             │
│   │                                      │                       │
│   │ <Child count={count} /> ─────────────┼──► PROPS              │
│   └──────────────────────────────────────┘                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 State

### useState Hook

```jsx
import { useState } from 'react';

function Counter() {
    // [currentValue, setterFunction] = useState(initialValue)
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>+</button>
            <button onClick={() => setCount(count - 1)}>-</button>
            <button onClick={() => setCount(0)}>Reset</button>
        </div>
    );
}
```

### State Update Rules

```jsx
// 1. State updates are ASYNC
const [count, setCount] = useState(0);

function handleClick() {
    setCount(count + 1);
    console.log(count); // Still 0! (stale)
}

// 2. Use functional update for multiple updates
function handleMultiple() {
    // ❌ Only increments by 1
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);

    // ✅ Increments by 3
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
}

// 3. Objects must be replaced, not mutated
const [user, setUser] = useState({ name: '', age: 0 });

// ❌ Mutation (won't trigger re-render)
user.name = 'John';

// ✅ Create new object
setUser({ ...user, name: 'John' });
setUser(prev => ({ ...prev, name: 'John' }));

// 4. Arrays too
const [items, setItems] = useState([]);

// Add item
setItems([...items, newItem]);

// Remove item
setItems(items.filter(item => item.id !== idToRemove));

// Update item
setItems(items.map(item =>
    item.id === id ? { ...item, completed: true } : item
));
```

### Lazy Initialization

```jsx
// ❌ Expensive function runs every render
const [data, setData] = useState(expensiveComputation());

// ✅ Function only runs on initial render
const [data, setData] = useState(() => expensiveComputation());

// Useful for reading from localStorage
const [value, setValue] = useState(() => {
    const saved = localStorage.getItem('key');
    return saved ? JSON.parse(saved) : defaultValue;
});
```

---

## 🖱️ Event Handling

### Basic Events

```jsx
function Button() {
    const handleClick = (event) => {
        console.log('Clicked!', event);
    };

    const handleMouseEnter = () => {
        console.log('Mouse entered');
    };

    return (
        <button
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
        >
            Click me
        </button>
    );
}
```

### Passing Arguments

```jsx
function ItemList({ items }) {
    const handleDelete = (id) => {
        console.log('Deleting:', id);
    };

    return (
        <ul>
            {items.map(item => (
                <li key={item.id}>
                    {item.name}
                    {/* Method 1: Arrow function */}
                    <button onClick={() => handleDelete(item.id)}>
                        Delete
                    </button>

                    {/* Method 2: bind (less common) */}
                    <button onClick={handleDelete.bind(null, item.id)}>
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
}
```

### Form Handling

```jsx
function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting:', formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
            />
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
            />
            <button type="submit">Login</button>
        </form>
    );
}
```

---

## 🔀 Conditional Rendering

### Different Approaches

```jsx
function StatusMessage({ status }) {
    // 1. if/else (early return)
    if (status === 'loading') {
        return <Spinner />;
    }

    if (status === 'error') {
        return <Error />;
    }

    // 2. Ternary operator
    return (
        <div>
            {status === 'success' ? (
                <SuccessMessage />
            ) : (
                <DefaultMessage />
            )}
        </div>
    );
}

function UserGreeting({ user }) {
    // 3. Logical AND (&&)
    return (
        <div>
            {user && <p>Welcome, {user.name}!</p>}
            {user?.isAdmin && <AdminPanel />}
        </div>
    );
}

function Content({ type }) {
    // 4. Object mapping
    const components = {
        home: <HomePage />,
        about: <AboutPage />,
        contact: <ContactPage />
    };

    return components[type] || <NotFound />;
}

function Features({ features }) {
    // 5. IIFE for complex logic
    return (
        <div>
            {(() => {
                if (features.length === 0) {
                    return <p>No features available</p>;
                }
                if (features.length < 3) {
                    return <CompactList features={features} />;
                }
                return <FullList features={features} />;
            })()}
        </div>
    );
}
```

---

## 📋 Lists & Keys

### Rendering Lists

```jsx
function TodoList({ todos }) {
    return (
        <ul>
            {todos.map(todo => (
                <li key={todo.id}>
                    {todo.text}
                </li>
            ))}
        </ul>
    );
}
```

### Why Keys Matter

```
┌─────────────────────────────────────────────────────────────────┐
│                    WHY KEYS ARE IMPORTANT                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Without keys:                                                  │
│   ┌────────────────────────────────────────────────────────┐    │
│   │ Initial:    [Item A] [Item B] [Item C]                 │    │
│   │ After add:  [New]    [Item A] [Item B] [Item C]        │    │
│   │                                                         │    │
│   │ React thinks: "First element changed, second changed,  │    │
│   │               third changed, fourth is new"            │    │
│   │ Result: Re-renders ALL items (slow!)                   │    │
│   └────────────────────────────────────────────────────────┘    │
│                                                                   │
│   With keys:                                                     │
│   ┌────────────────────────────────────────────────────────┐    │
│   │ Initial:    [A:key1] [B:key2] [C:key3]                 │    │
│   │ After add:  [New:key4] [A:key1] [B:key2] [C:key3]      │    │
│   │                                                         │    │
│   │ React knows: "key1,2,3 unchanged, key4 is new"         │    │
│   │ Result: Only inserts new item (fast!)                  │    │
│   └────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Key Rules

```jsx
// ✅ Use unique, stable IDs
{items.map(item => <Item key={item.id} {...item} />)}

// ❌ Don't use index as key (unless list is static)
{items.map((item, index) => <Item key={index} {...item} />)}
// Problems with index:
// - Reordering breaks it
// - Adding/removing from middle breaks it
// - Can cause state bugs

// ✅ Index is OK for static lists
const menuItems = ['Home', 'About', 'Contact'];
{menuItems.map((item, index) => <li key={index}>{item}</li>)}

// ❌ Don't generate key on render
{items.map(item => <Item key={Math.random()} {...item} />)}
// New key every render = all items re-mount!

// ✅ Key only needs to be unique among siblings
{categories.map(cat => (
    <div key={cat.id}>
        {cat.items.map(item => (
            <Item key={item.id} {...item} /> // Same key OK in different lists
        ))}
    </div>
))}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: JSX là gì?**

A: JSX là syntax extension cho JavaScript, cho phép viết HTML-like code trong JavaScript. Được compile thành `React.createElement()` calls.

**Q: Props và State khác nhau như thế nào?**

A:
- Props: Passed từ parent, read-only, dùng cho configuration
- State: Managed internally, mutable, dùng cho dynamic data

### 🟡 Mid-level

**Q: Tại sao key quan trọng trong lists?**

A: Keys giúp React identify items uniquely, cho phép:
- Efficient DOM updates (chỉ update items thay đổi)
- Preserve component state khi reorder
- Tránh bugs với form inputs

**Q: Controlled vs Uncontrolled components?**

A:
- Controlled: React quản lý state qua value + onChange
- Uncontrolled: DOM quản lý state, dùng refs để đọc

```jsx
// Controlled
const [value, setValue] = useState('');
<input value={value} onChange={e => setValue(e.target.value)} />

// Uncontrolled
const inputRef = useRef();
<input ref={inputRef} defaultValue="initial" />
```

### 🔴 Senior

**Q: React làm sao biết khi nào re-render?**

A:
1. State changes (setState)
2. Props changes
3. Parent re-renders
4. Context changes

React uses Object.is() để compare, nên objects/arrays cần new reference để trigger re-render.

---

## 📚 Active Recall

1. [ ] Viết component với useState và event handling
2. [ ] Giải thích Virtual DOM và reconciliation
3. [ ] Khi nào dùng key={index} an toàn?
4. [ ] So sánh Function vs Class components
5. [ ] Implement controlled form từ scratch

---

> **Tiếp theo:** [02-hooks-deep-dive.md](./02-hooks-deep-dive.md) - React Hooks Deep Dive
