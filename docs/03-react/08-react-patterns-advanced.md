# Advanced React Patterns
## Design Patterns for Scalable React Applications

**English:** Advanced React patterns are reusable solutions to common problems in React application development, promoting code reusability, maintainability, and scalability.

**Tiếng Việt:** Các pattern React nâng cao là giải pháp có thể tái sử dụng cho các vấn đề phổ biến trong phát triển ứng dụng React, thúc đẩy khả năng tái sử dụng, bảo trì và mở rộng code.

## Compound Components Pattern

### Theory

**Definition:** Compound components work together to form a complete UI component, sharing implicit state.

**Benefits:**
- Flexible API
- Separation of concerns
- Implicit state sharing
- Customizable composition

### Implementation with Context

**Pattern Structure:**
```javascript
const TabsContext = createContext();

function Tabs({ children, defaultValue }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div role="tablist">{children}</div>;
}

function Tab({ value, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button
      role="tab"
      aria-selected={activeTab === value}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

function TabPanel({ value, children }) {
  const { activeTab } = useContext(TabsContext);
  return activeTab === value ? <div role="tabpanel">{children}</div> : null;
}

Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;
```

**Usage:**
```javascript
<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
    <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="tab1">Content 1</Tabs.Panel>
  <Tabs.Panel value="tab2">Content 2</Tabs.Panel>
</Tabs>
```

## Render Props Pattern

### Theory

**Definition:** A component with a render prop takes a function that returns a React element and calls it instead of implementing its own render logic.

**Use Cases:**
- Code reuse
- Logic sharing
- Flexible rendering
- Inversion of control

### Implementation

**Mouse Tracker Example:**
```javascript
class Mouse extends React.Component {
  state = { x: 0, y: 0 };
  
  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  };
  
  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

// Usage
<Mouse render={({ x, y }) => (
  <h1>Mouse position: {x}, {y}</h1>
)} />
```

**Modern Alternative with Hooks:**
```javascript
function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return position;
}

// Usage
function Component() {
  const { x, y } = useMouse();
  return <h1>Mouse position: {x}, {y}</h1>;
}
```

## Higher-Order Components (HOC)

### Theory

**Definition:** A higher-order component is a function that takes a component and returns a new component with additional props or behavior.

**Pattern:**
```javascript
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();
    
    if (loading) return <Loading />;
    if (!user) return <Redirect to="/login" />;
    
    return <Component {...props} user={user} />;
  };
}

// Usage
const ProtectedPage = withAuth(Dashboard);
```

### HOC Best Practices

**1. Don't Mutate Original Component**
```javascript
// Bad
function withData(Component) {
  Component.prototype.componentDidMount = function() {
    // mutation
  };
  return Component;
}

// Good
function withData(Component) {
  return class extends React.Component {
    componentDidMount() {
      // new behavior
    }
    render() {
      return <Component {...this.props} />;
    }
  };
}
```

**2. Pass Unrelated Props**
```javascript
function withData(Component) {
  return function WithDataComponent({ data, ...props }) {
    return <Component data={data} {...props} />;
  };
}
```

**3. Maximize Composability**
```javascript
const enhance = compose(
  withAuth,
  withData,
  withRouter
);

const EnhancedComponent = enhance(BaseComponent);
```

## Container/Presentational Pattern

### Theory

**Definition:** Separate components into containers (logic) and presentational (UI) components.

**Container Components:**
- Concerned with how things work
- Provide data and behavior
- Usually stateful
- Connect to state management

**Presentational Components:**
- Concerned with how things look
- Receive data via props
- Usually stateless
- Reusable and pure

### Implementation

**Container:**
```javascript
function UserListContainer() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);
  
  const handleDelete = (id) => {
    deleteUser(id).then(() => {
      setUsers(users.filter(u => u.id !== id));
    });
  };
  
  return (
    <UserList
      users={users}
      loading={loading}
      onDelete={handleDelete}
    />
  );
}
```

**Presentational:**
```javascript
function UserList({ users, loading, onDelete }) {
  if (loading) return <Spinner />;
  
  return (
    <ul>
      {users.map(user => (
        <UserItem
          key={user.id}
          user={user}
          onDelete={() => onDelete(user.id)}
        />
      ))}
    </ul>
  );
}
```

## Provider Pattern

### Theory

**Definition:** Make data available to multiple components through Context API without prop drilling.

**Use Cases:**
- Theme management
- Authentication state
- Localization
- Global settings

### Implementation

**Theme Provider:**
```javascript
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const value = {
    theme,
    toggleTheme,
    colors: theme === 'light' ? lightColors : darkColors
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

**Usage:**
```javascript
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Content />
    </ThemeProvider>
  );
}

function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header style={{ background: theme === 'light' ? '#fff' : '#000' }}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  );
}
```

## State Reducer Pattern

### Theory

**Definition:** Give users control over component's internal state management by exposing a reducer.

**Benefits:**
- Inversion of control
- Predictable state updates
- Customizable behavior
- Advanced use cases support

### Implementation

**Toggle with State Reducer:**
```javascript
function useToggle({ reducer = (state, action) => action.changes } = {}) {
  const [{ on }, dispatch] = useReducer((state, action) => {
    const changes = toggleReducer(state, action);
    return reducer(state, { ...action, changes }) || changes;
  }, { on: false });
  
  const toggle = () => dispatch({ type: 'toggle' });
  const setOn = () => dispatch({ type: 'on' });
  const setOff = () => dispatch({ type: 'off' });
  
  return { on, toggle, setOn, setOff };
}

function toggleReducer(state, action) {
  switch (action.type) {
    case 'toggle':
      return { on: !state.on };
    case 'on':
      return { on: true };
    case 'off':
      return { on: false };
    default:
      return state;
  }
}

// Usage with custom reducer
function Component() {
  const { on, toggle } = useToggle({
    reducer(state, action) {
      // Custom logic
      if (action.type === 'toggle' && state.on) {
        // Prevent turning off
        return state;
      }
      return action.changes;
    }
  });
  
  return <button onClick={toggle}>{on ? 'On' : 'Off'}</button>;
}
```

## Control Props Pattern

### Theory

**Definition:** Allow parent components to control child component's state.

**Types:**
- Controlled: Parent controls state
- Uncontrolled: Component controls own state
- Hybrid: Support both modes

### Implementation

**Controlled Input:**
```javascript
function Input({ value, onChange, defaultValue }) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    onChange?.(newValue);
  };
  
  return (
    <input
      value={currentValue}
      onChange={handleChange}
    />
  );
}

// Controlled usage
function ControlledExample() {
  const [value, setValue] = useState('');
  return <Input value={value} onChange={setValue} />;
}

// Uncontrolled usage
function UncontrolledExample() {
  return <Input defaultValue="initial" onChange={console.log} />;
}
```

## Props Getter Pattern

### Theory

**Definition:** Provide getter functions that return props objects, allowing users to spread props while maintaining control.

**Benefits:**
- Flexibility
- Prop merging
- Override capability
- Clean API

### Implementation

**Dropdown with Props Getters:**
```javascript
function useDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const getToggleButtonProps = ({ onClick, ...props } = {}) => ({
    'aria-expanded': isOpen,
    'aria-haspopup': 'listbox',
    onClick: (e) => {
      setIsOpen(!isOpen);
      onClick?.(e);
    },
    ...props
  });
  
  const getMenuProps = (props = {}) => ({
    role: 'listbox',
    hidden: !isOpen,
    ...props
  });
  
  const getItemProps = ({ item, onClick, ...props } = {}) => ({
    role: 'option',
    'aria-selected': item === selectedItem,
    onClick: (e) => {
      setSelectedItem(item);
      setIsOpen(false);
      onClick?.(e);
    },
    ...props
  });
  
  return {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getMenuProps,
    getItemProps
  };
}

// Usage
function Dropdown({ items }) {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getMenuProps,
    getItemProps
  } = useDropdown();
  
  return (
    <div>
      <button {...getToggleButtonProps()}>
        {selectedItem || 'Select item'}
      </button>
      <ul {...getMenuProps()}>
        {items.map(item => (
          <li key={item} {...getItemProps({ item })}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Composition Patterns

### Component Composition

**Theory:** Build complex UIs by composing simple components.

**Slot Pattern:**
```javascript
function Card({ header, footer, children }) {
  return (
    <div className="card">
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

// Usage
<Card
  header={<h2>Title</h2>}
  footer={<button>Action</button>}
>
  <p>Content</p>
</Card>
```

**Children as Function:**
```javascript
function DataProvider({ children, data }) {
  return children(data);
}

// Usage
<DataProvider data={users}>
  {(users) => (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )}
</DataProvider>
```

## Performance Patterns

### Lazy Loading Pattern

**Theory:** Load components only when needed to reduce initial bundle size.

**Implementation:**
```javascript
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Memoization Pattern

**Theory:** Prevent unnecessary re-renders using React.memo and useMemo.

**Component Memoization:**
```javascript
const ExpensiveComponent = React.memo(
  function ExpensiveComponent({ data }) {
    // Expensive rendering logic
    return <div>{/* ... */}</div>;
  },
  (prevProps, nextProps) => {
    // Custom comparison
    return prevProps.data.id === nextProps.data.id;
  }
);
```

**Value Memoization:**
```javascript
function Component({ items }) {
  const expensiveValue = useMemo(() => {
    return items.reduce((acc, item) => acc + item.value, 0);
  }, [items]);
  
  return <div>{expensiveValue}</div>;
}
```

## Interview Questions

**Q: What are compound components?**

A: Compound components are a pattern where components work together to form a complete UI, sharing implicit state through Context. They provide a flexible API while maintaining encapsulation.

**Q: When to use HOC vs Hooks?**

A: Hooks are generally preferred for modern React as they're more composable and don't create wrapper hell. Use HOCs when you need to enhance multiple components with the same logic or when working with class components.

**Q: Explain the Container/Presentational pattern.**

A: This pattern separates components into containers (handle logic, state, data fetching) and presentational components (handle UI, receive data via props). It promotes reusability and separation of concerns.

**Q: What is the Props Getter pattern?**

A: Props Getter pattern provides functions that return props objects, allowing users to spread props while maintaining control. It enables prop merging and override capability with a clean API.

**Q: How does State Reducer pattern work?**

A: State Reducer pattern gives users control over component's internal state by exposing a reducer function. Users can customize state updates while the component maintains default behavior.

---

[← Back to Hooks](./07-hooks-comprehensive.md) | [Next: Testing →](./06-testing.md)
