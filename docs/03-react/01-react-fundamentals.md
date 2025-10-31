# React Fundamentals
## React - Chapter 1

[Back to Table of Contents](../00-table-of-contents.md) | [Next: React 19 Features →](./02-react-19-features.md)

---

## Overview

React is a JavaScript library for building user interfaces, developed and maintained by Meta (Facebook). This chapter covers the fundamental concepts you need to master for Big Tech interviews.

---

## Table of Contents

1. [What is React?](#what-is-react)
2. [JSX](#jsx)
3. [Components](#components)
4. [Props](#props)
5. [State](#state)
6. [Lifecycle](#lifecycle)
7. [Events](#events)
8. [Conditional Rendering](#conditional-rendering)
9. [Lists and Keys](#lists-and-keys)
10. [Forms](#forms)
11. [Composition vs Inheritance](#composition-vs-inheritance)
12. [Thinking in React](#thinking-in-react)
13. [Interview Questions](#interview-questions)

---

## What is React?

### Core Concepts

**Definition:** React is a declarative, component-based JavaScript library for building user interfaces.

**Key Features:**
- **Declarative**: Describe what the UI should look like, React handles the how
- **Component-Based**: Build encapsulated components that manage their own state
- **Learn Once, Write Anywhere**: Can render on server (Node), mobile (React Native)
- **Virtual DOM**: Efficient updates through reconciliation

### Why React?

```javascript
// Traditional DOM manipulation (Imperative)
const button = document.createElement('button');
button.textContent = 'Click me';
button.addEventListener('click', () => {
  const div = document.createElement('div');
  div.textContent = 'Hello!';
  document.body.appendChild(div);
});
document.body.appendChild(button);

// React (Declarative)
function App() {
  const [show, setShow] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShow(true)}>Click me</button>
      {show && <div>Hello!</div>}
    </div>
  );
}
```

### Virtual DOM

**How it works:**

1. **Initial Render**: React creates a virtual DOM tree
2. **State Change**: New virtual DOM tree is created
3. **Diffing**: React compares old and new trees
4. **Reconciliation**: Only changed nodes are updated in real DOM

```
State Change
     ↓
Virtual DOM (new)
     ↓
Diffing Algorithm
     ↓
Minimal DOM Updates
```

**Benefits:**
- Efficient updates
- Batch updates
- Cross-platform rendering
- Predictable behavior

---

## JSX

### What is JSX?

**Definition:** JSX is a syntax extension for JavaScript that looks similar to HTML but gets compiled to JavaScript.

```javascript
// JSX
const element = <h1>Hello, world!</h1>;

// Compiles to
const element = React.createElement('h1', null, 'Hello, world!');
```

### JSX Rules

```javascript
// 1. Must return single root element
// ❌ Wrong
function Component() {
  return (
    <h1>Title</h1>
    <p>Paragraph</p>
  );
}

// ✅ Correct
function Component() {
  return (
    <div>
      <h1>Title</h1>
      <p>Paragraph</p>
    </div>
  );
}

// ✅ Or use Fragment
function Component() {
  return (
    <>
      <h1>Title</h1>
      <p>Paragraph</p>
    </>
  );
}

// 2. Close all tags
// ❌ Wrong
<img src="image.jpg">
<input type="text">

// ✅ Correct
<img src="image.jpg" />
<input type="text" />

// 3. Use camelCase for attributes
// ❌ Wrong
<div class="container" onclick="handleClick()">

// ✅ Correct
<div className="container" onClick={handleClick}>

// 4. JavaScript expressions in curly braces
const name = 'John';
const element = <h1>Hello, {name}!</h1>;

const user = { firstName: 'John', lastName: 'Doe' };
const greeting = <h1>Hello, {user.firstName} {user.lastName}!</h1>;
```

### JSX Expressions

```javascript
// Expressions
const element = <h1>{2 + 2}</h1>; // 4

// Function calls
function formatName(user) {
  return `${user.firstName} ${user.lastName}`;
}
const element = <h1>Hello, {formatName(user)}!</h1>;

// Conditional (ternary)
const element = <div>{isLoggedIn ? 'Welcome' : 'Please log in'}</div>;

// Logical AND
const element = <div>{isLoggedIn && <UserProfile />}</div>;

// Arrays
const numbers = [1, 2, 3, 4, 5];
const listItems = <ul>{numbers.map(n => <li key={n}>{n}</li>)}</ul>;
```

### JSX Prevents Injection Attacks

```javascript
// Safe: React escapes values by default
const userInput = '<script>alert("XSS")</script>';
const element = <div>{userInput}</div>;
// Renders as text, not executed

// Dangerous: Only use when you trust the source
const html = { __html: '<strong>Bold</strong>' };
const element = <div dangerouslySetInnerHTML={html} />;
```

---

## Components

### Function Components

```javascript
// Simple function component
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// Arrow function
const Welcome = (props) => {
  return <h1>Hello, {props.name}</h1>;
};

// Implicit return
const Welcome = (props) => <h1>Hello, {props.name}</h1>;

// With destructuring
const Welcome = ({ name }) => <h1>Hello, {name}</h1>;
```

### Class Components (Legacy)

```javascript
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

### Component Composition

```javascript
function App() {
  return (
    <div>
      <Welcome name="Alice" />
      <Welcome name="Bob" />
      <Welcome name="Charlie" />
    </div>
  );
}
```

### Component Naming

```javascript
// ✅ PascalCase for components
function UserProfile() { }
function NavBar() { }

// ❌ camelCase (treated as HTML tags)
function userProfile() { } // <userprofile>
```

---

## Props

### Passing Props

```javascript
// Parent component
function App() {
  return (
    <UserCard
      name="John Doe"
      age={30}
      email="john@example.com"
      isActive={true}
    />
  );
}

// Child component
function UserCard(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>Age: {props.age}</p>
      <p>Email: {props.email}</p>
      <p>Status: {props.isActive ? 'Active' : 'Inactive'}</p>
    </div>
  );
}
```

### Props Destructuring

```javascript
// Destructure in parameter
function UserCard({ name, age, email, isActive }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
      <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
    </div>
  );
}

// Destructure in body
function UserCard(props) {
  const { name, age, email, isActive } = props;
  return <div>{/* ... */}</div>;
}
```

### Default Props

```javascript
// Using default parameters
function Button({ text = 'Click me', type = 'button' }) {
  return <button type={type}>{text}</button>;
}

// Using defaultProps (legacy)
function Button({ text, type }) {
  return <button type={type}>{text}</button>;
}

Button.defaultProps = {
  text: 'Click me',
  type: 'button'
};
```

### Props are Read-Only

```javascript
// ❌ Never modify props
function Component(props) {
  props.name = 'New Name'; // Error!
  return <div>{props.name}</div>;
}

// ✅ Props are immutable
function Component({ name }) {
  const [localName, setLocalName] = useState(name);
  return (
    <div>
      <p>{name}</p>
      <button onClick={() => setLocalName('New Name')}>
        Change Local Name
      </button>
    </div>
  );
}
```

### Children Prop

```javascript
// Special prop: children
function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

// Usage
<Card>
  <h2>Title</h2>
  <p>Content</p>
</Card>

// Multiple children
function Layout({ header, sidebar, content }) {
  return (
    <div>
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{content}</main>
    </div>
  );
}

<Layout
  header={<Header />}
  sidebar={<Sidebar />}
  content={<Content />}
/>
```

---

## State

### useState Hook

```javascript
import { useState } from 'react';

function Counter() {
  // Declare state variable
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

### Multiple State Variables

```javascript
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  
  return (
    <form>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
        placeholder="Age"
      />
    </form>
  );
}
```

### State vs Props

| State | Props |
|-------|-------|
| Mutable | Immutable |
| Owned by component | Passed from parent |
| Can be changed | Read-only |
| Private | Public API |
| Local | External |

```javascript
// Props flow down
function Parent() {
  const [count, setCount] = useState(0);
  
  return (
    <Child count={count} onIncrement={() => setCount(count + 1)} />
  );
}

function Child({ count, onIncrement }) {
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>Increment</button>
    </div>
  );
}
```

---

## Lifecycle

### Component Lifecycle Phases

**1. Mounting**: Component is created and inserted into DOM
**2. Updating**: Component re-renders due to props or state changes
**3. Unmounting**: Component is removed from DOM

### useEffect Hook

```javascript
import { useEffect } from 'react';

// Runs after every render
useEffect(() => {
  console.log('Component rendered');
});

// Runs once on mount
useEffect(() => {
  console.log('Component mounted');
}, []);

// Runs when dependencies change
useEffect(() => {
  console.log('Count changed:', count);
}, [count]);

// Cleanup function
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);
  
  return () => {
    clearInterval(timer);
    console.log('Cleanup');
  };
}, []);
```

### Common Lifecycle Patterns

```javascript
// Data fetching
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);
  
  return <div>{user?.name}</div>;
}

// Event listeners
function WindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return <div>{size.width} x {size.height}</div>;
}

// Document title
function Page({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  
  return <div>Page content</div>;
}
```

---

## Events

### Handling Events

```javascript
// Function component
function Button() {
  const handleClick = () => {
    console.log('Button clicked');
  };
  
  return <button onClick={handleClick}>Click me</button>;
}

// Inline handler
function Button() {
  return (
    <button onClick={() => console.log('Clicked')}>
      Click me
    </button>
  );
}

// With event object
function Input() {
  const handleChange = (event) => {
    console.log('Value:', event.target.value);
  };
  
  return <input onChange={handleChange} />;
}
```

### Event Object

```javascript
function Form() {
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    console.log('Form submitted');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Passing Arguments

```javascript
// Using arrow function
function List({ items }) {
  const handleClick = (id) => {
    console.log('Clicked item:', id);
  };
  
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}

// Using bind
function List({ items }) {
  const handleClick = (id, event) => {
    console.log('Clicked item:', id);
  };
  
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={handleClick.bind(null, item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

---

## Conditional Rendering

### If-Else

```javascript
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }
  return <h1>Please sign in.</h1>;
}
```

### Ternary Operator

```javascript
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome back!</h1>
      ) : (
        <h1>Please sign in.</h1>
      )}
    </div>
  );
}
```

### Logical AND (&&)

```javascript
function Mailbox({ unreadMessages }) {
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 && (
        <h2>You have {unreadMessages.length} unread messages.</h2>
      )}
    </div>
  );
}
```

### Preventing Rendering

```javascript
function Warning({ show }) {
  if (!show) {
    return null;
  }
  
  return <div className="warning">Warning!</div>;
}
```

---

## Lists and Keys

### Rendering Lists

```javascript
function NumberList({ numbers }) {
  return (
    <ul>
      {numbers.map((number) => (
        <li key={number}>{number}</li>
      ))}
    </ul>
  );
}
```

### Keys

**Why keys are important:**
- Help React identify which items have changed
- Should be stable, unique, and consistent
- Don't use array index as key (unless list is static)

```javascript
// ✅ Good: Unique ID
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}

// ❌ Bad: Array index (for dynamic lists)
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>{todo.text}</li>
      ))}
    </ul>
  );
}

// ✅ OK: Array index (for static lists)
function StaticList() {
  const items = ['Apple', 'Banana', 'Orange'];
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
```

### Extracting Components with Keys

```javascript
// ✅ Key on component
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

function TodoItem({ todo }) {
  return <li>{todo.text}</li>;
}

// ❌ Key on element inside component
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem todo={todo} />
      ))}
    </ul>
  );
}

function TodoItem({ todo }) {
  return <li key={todo.id}>{todo.text}</li>; // Wrong place!
}
```

---

## Forms

### Controlled Components

```javascript
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', { name, email });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Multiple Inputs

```javascript
function Form() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <form>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        name="age"
        type="number"
        value={formData.age}
        onChange={handleChange}
      />
    </form>
  );
}
```

### Textarea and Select

```javascript
function Form() {
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  
  return (
    <form>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="general">General</option>
        <option value="bug">Bug Report</option>
        <option value="feature">Feature Request</option>
      </select>
    </form>
  );
}
```

### Checkbox and Radio

```javascript
function Form() {
  const [agreed, setAgreed] = useState(false);
  const [gender, setGender] = useState('');
  
  return (
    <form>
      <label>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        I agree to terms
      </label>
      
      <label>
        <input
          type="radio"
          value="male"
          checked={gender === 'male'}
          onChange={(e) => setGender(e.target.value)}
        />
        Male
      </label>
      
      <label>
        <input
          type="radio"
          value="female"
          checked={gender === 'female'}
          onChange={(e) => setGender(e.target.value)}
        />
        Female
      </label>
    </form>
  );
}
```

---

## Composition vs Inheritance

### Composition (Recommended)

```javascript
// Container component
function Dialog({ title, children }) {
  return (
    <div className="dialog">
      <h1>{title}</h1>
      <div className="content">
        {children}
      </div>
    </div>
  );
}

// Specialized components
function WelcomeDialog() {
  return (
    <Dialog title="Welcome">
      <p>Thank you for visiting!</p>
    </Dialog>
  );
}

function SignUpDialog() {
  return (
    <Dialog title="Sign Up">
      <input placeholder="Email" />
      <button>Sign Up</button>
    </Dialog>
  );
}
```

### Specialization

```javascript
// Generic component
function Button({ variant = 'primary', children, ...props }) {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
}

// Specialized components
function PrimaryButton(props) {
  return <Button variant="primary" {...props} />;
}

function DangerButton(props) {
  return <Button variant="danger" {...props} />;
}
```

---

## Thinking in React

### Step-by-Step Process

**1. Break UI into Component Hierarchy**

```
App
├── SearchBar
├── ProductTable
│   ├── ProductCategoryRow
│   └── ProductRow
```

**2. Build Static Version**

```javascript
function App() {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}
```

**3. Identify Minimal State**

Ask three questions:
- Is it passed from parent via props? → Not state
- Does it remain unchanged over time? → Not state
- Can you compute it from other state/props? → Not state

**4. Identify Where State Should Live**

- Find common parent component
- State should live in component above all components that need it

**5. Add Inverse Data Flow**

```javascript
function App() {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  
  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
      />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
    </div>
  );
}
```

---

## Interview Questions

### Q1: What is React and why use it?

**Answer:**
React is a JavaScript library for building user interfaces. Benefits:
- **Declarative**: Easier to reason about
- **Component-Based**: Reusable, maintainable code
- **Virtual DOM**: Efficient updates
- **Large Ecosystem**: Rich tooling and libraries
- **Strong Community**: Extensive resources and support

### Q2: What is the difference between state and props?

**Answer:**
- **Props**: Passed from parent, immutable, external data
- **State**: Managed within component, mutable, internal data

```javascript
// Props
function Child({ name }) {
  return <div>{name}</div>;
}

// State
function Parent() {
  const [name, setName] = useState('John');
  return <Child name={name} />;
}
```

### Q3: What is the Virtual DOM?

**Answer:**
Virtual DOM is a lightweight copy of the actual DOM. React uses it to:
1. Create virtual representation of UI
2. Compare with previous version (diffing)
3. Calculate minimal changes needed
4. Update only changed parts in real DOM

This makes updates efficient and fast.

### Q4: What are keys and why are they important?

**Answer:**
Keys help React identify which items in a list have changed, been added, or removed. They should be:
- Stable (don't change between renders)
- Unique (among siblings)
- Consistent (same key for same item)

```javascript
// ✅ Good
{items.map(item => <li key={item.id}>{item.name}</li>)}

// ❌ Bad
{items.map((item, index) => <li key={index}>{item.name}</li>)}
```

### Q5: What is the difference between controlled and uncontrolled components?

**Answer:**
- **Controlled**: Form data handled by React state
- **Uncontrolled**: Form data handled by DOM itself

```javascript
// Controlled
function Controlled() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}

// Uncontrolled
function Uncontrolled() {
  const inputRef = useRef();
  return <input ref={inputRef} defaultValue="initial" />;
}
```

---

## Key Takeaways

1. React is declarative and component-based
2. JSX is syntactic sugar for React.createElement
3. Components can be functions or classes (prefer functions)
4. Props are immutable, state is mutable
5. Use keys for list items
6. Controlled components for forms
7. Composition over inheritance
8. Think in React: break UI into components, identify state, determine data flow

---

[Back to Table of Contents](../00-table-of-contents.md) | [Next: React 19 Features →](./02-react-19-features.md)
