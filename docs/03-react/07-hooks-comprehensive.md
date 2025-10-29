# React Hooks - Complete Guide
## From Basics to Advanced Patterns

[← Back to Testing](./06-testing.md) | [Next: Performance →](../08-performance/02-react-performance.md)

---

## 📋 Table of Contents

1. [Hooks Fundamentals](#hooks-fundamentals)
2. [useState Deep Dive](#usestate-deep-dive)
3. [useEffect Mastery](#useeffect-mastery)
4. [useContext Patterns](#usecontext-patterns)
5. [useReducer Advanced](#usereducer-advanced)
6. [useMemo & useCallback](#usememo-usecallback)
7. [useRef Complete Guide](#useref-complete-guide)
8. [Custom Hooks](#custom-hooks)
9. [Advanced Patterns](#advanced-patterns)
10. [Performance Optimization](#performance-optimization)
11. [Interview Questions](#interview-questions)
12. [Practice Problems](#practice-problems)

---

## 🎯 Learning Objectives

Master React Hooks:
- Understand all built-in hooks deeply
- Create powerful custom hooks
- Optimize performance with hooks
- Handle complex state management
- Implement advanced patterns
- Avoid common pitfalls

---

## Hooks Fundamentals

### What are Hooks?

**English Definition:** Hooks are functions that let you "hook into" React state and lifecycle features from function components.

**Định nghĩa (Tiếng Việt):** Hooks là các hàm cho phép bạn "kết nối" vào state và lifecycle features của React từ function components.


### Hooks Mind Map

```
React Hooks
│
├── Basic Hooks
│   ├── useState (state management)
│   ├── useEffect (side effects)
│   └── useContext (context consumption)
│
├── Additional Hooks
│   ├── useReducer (complex state)
│   ├── useCallback (memoized callbacks)
│   ├── useMemo (memoized values)
│   ├── useRef (mutable refs)
│   ├── useImperativeHandle (ref customization)
│   ├── useLayoutEffect (synchronous effects)
│   └── useDebugValue (dev tools)
│
├── Custom Hooks
│   ├── Data fetching
│   ├── Form handling
│   ├── Local storage
│   ├── Window size
│   └── Debounce/Throttle
│
└── Rules
    ├── Only call at top level
    ├── Only call from React functions
    └── Use ESLint plugin
```

### Rules of Hooks

```javascript
// ========================================
// RULE 1: ONLY CALL HOOKS AT TOP LEVEL
// ========================================

// ✅ CORRECT
function Component() {
  const [state, setState] = useState(0);
  
  useEffect(() => {
    // Effect logic
  }, []);
  
  return <div>{state}</div>;
}

// ❌ WRONG: Inside condition
function WrongComponent() {
  if (condition) {
    const [state, setState] = useState(0); // ❌ Don't do this
  }
  return <div>Content</div>;
}

// ❌ WRONG: Inside loop
function WrongComponent2() {
  for (let i = 0; i < 10; i++) {
    const [state, setState] = useState(i); // ❌ Don't do this
  }
  return <div>Content</div>;
}

// ========================================
// RULE 2: ONLY CALL FROM REACT FUNCTIONS
// ========================================

// ✅ CORRECT: From function component
function Component() {
  const [state, setState] = useState(0);
  return <div>{state}</div>;
}

// ✅ CORRECT: From custom hook
function useCustomHook() {
  const [state, setState] = useState(0);
  return state;
}

// ❌ WRONG: From regular function
function regularFunction() {
  const [state, setState] = useState(0); // ❌ Don't do this
  return state;
}

// ❌ WRONG: From class component
class ClassComponent extends React.Component {
  render() {
    const [state, setState] = useState(0); // ❌ Don't do this
    return <div>{state}</div>;
  }
}
```

### Why Hooks?

```javascript
// ========================================
// BEFORE HOOKS: CLASS COMPONENT
// ========================================

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    this.increment = this.increment.bind(this);
  }
  
  componentDidMount() {
    document.title = `Count: ${this.state.count}`;
  }
  
  componentDidUpdate() {
    document.title = `Count: ${this.state.count}`;
  }
  
  increment() {
    this.setState({ count: this.state.count + 1 });
  }
  
  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}

// ========================================
// WITH HOOKS: FUNCTION COMPONENT
// ========================================

function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

/*
Benefits:
1. Less boilerplate
2. No 'this' binding
3. Easier to share logic (custom hooks)
4. Better code organization
5. Smaller bundle size
*/
```

---

## useState Deep Dive

### Basic useState

```javascript
// ========================================
// SIMPLE STATE
// ========================================

function Counter() {
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

// ========================================
// MULTIPLE STATE VARIABLES
// ========================================

function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  
  return (
    <form>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="number"
        value={age} 
        onChange={(e) => setAge(Number(e.target.value))} 
      />
    </form>
  );
}

// ========================================
// OBJECT STATE
// ========================================

function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });
  
  const updateField = (field, value) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <form>
      <input 
        value={user.name}
        onChange={(e) => updateField('name', e.target.value)}
      />
      <input 
        value={user.email}
        onChange={(e) => updateField('email', e.target.value)}
      />
    </form>
  );
}

// ========================================
// ARRAY STATE
// ========================================

function TodoList() {
  const [todos, setTodos] = useState([]);
  
  const addTodo = (text) => {
    setTodos(prev => [...prev, { id: Date.now(), text }]);
  };
  
  const removeTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };
  
  const updateTodo = (id, newText) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };
  
  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id}>
          <span>{todo.text}</span>
          <button onClick={() => removeTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### Functional Updates

```javascript
// ========================================
// WHY FUNCTIONAL UPDATES?
// ========================================

function Counter() {
  const [count, setCount] = useState(0);
  
  // ❌ PROBLEM: Stale closure
  const incrementThreeTimes = () => {
    setCount(count + 1); // Uses current count
    setCount(count + 1); // Uses same count
    setCount(count + 1); // Uses same count
    // Result: count increases by 1, not 3!
  };
  
  // ✅ SOLUTION: Functional update
  const incrementThreeTimesFix = () => {
    setCount(prev => prev + 1); // Uses latest
    setCount(prev => prev + 1); // Uses latest
    setCount(prev => prev + 1); // Uses latest
    // Result: count increases by 3 ✓
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementThreeTimes}>+3 (Wrong)</button>
      <button onClick={incrementThreeTimesFix}>+3 (Correct)</button>
    </div>
  );
}

// ========================================
// COMPLEX FUNCTIONAL UPDATES
// ========================================

function ShoppingCart() {
  const [cart, setCart] = useState([]);
  
  const addItem = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      
      if (existing) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      
      return [...prev, { ...item, quantity: 1 }];
    });
  };
  
  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };
  
  const updateQuantity = (id, quantity) => {
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };
  
  return (
    <div>
      {cart.map(item => (
        <div key={item.id}>
          <span>{item.name} x {item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
            +
          </button>
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
            -
          </button>
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
```

### Lazy Initialization

```javascript
// ========================================
// EXPENSIVE INITIAL STATE
// ========================================

// ❌ BAD: Runs on every render
function Component() {
  const [data, setData] = useState(expensiveComputation());
  // expensiveComputation() runs on every render!
  return <div>{data}</div>;
}

// ✅ GOOD: Runs only once
function Component() {
  const [data, setData] = useState(() => expensiveComputation());
  // expensiveComputation() runs only on initial render
  return <div>{data}</div>;
}

// ========================================
// PRACTICAL EXAMPLES
// ========================================

// Reading from localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  return [value, setValue];
}

// Complex calculation
function DataProcessor() {
  const [processed, setProcessed] = useState(() => {
    const rawData = fetchRawData();
    return processLargeDataset(rawData);
  });
  
  return <div>{processed}</div>;
}

// Creating unique ID
function UniqueComponent() {
  const [id] = useState(() => `component-${Math.random()}`);
  return <div id={id}>Content</div>;
}
```

### State Batching

```javascript
// ========================================
// AUTOMATIC BATCHING (React 18+)
// ========================================

function Component() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);
  
  // React 18: Batched automatically
  const handleClick = () => {
    setCount(c => c + 1);
    setFlag(f => !f);
    // Only one re-render!
  };
  
  // React 18: Even in async, batched automatically
  const handleClickAsync = async () => {
    await fetch('/api/data');
    setCount(c => c + 1);
    setFlag(f => !f);
    // Only one re-render!
  };
  
  // React 18: Even in setTimeout, batched automatically
  const handleClickTimeout = () => {
    setTimeout(() => {
      setCount(c => c + 1);
      setFlag(f => !f);
      // Only one re-render!
    }, 1000);
  };
  
  console.log('Render'); // Logs once per click
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Flag: {flag.toString()}</p>
      <button onClick={handleClick}>Update</button>
      <button onClick={handleClickAsync}>Update Async</button>
      <button onClick={handleClickTimeout}>Update Timeout</button>
    </div>
  );
}

// ========================================
// OPT-OUT OF BATCHING (if needed)
// ========================================

import { flushSync } from 'react-dom';

function Component() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);
  
  const handleClick = () => {
    flushSync(() => {
      setCount(c => c + 1);
    });
    // Re-render here
    
    flushSync(() => {
      setFlag(f => !f);
    });
    // Re-render here
    
    // Total: 2 re-renders
  };
  
  return <button onClick={handleClick}>Update</button>;
}
```

---

## useEffect Mastery

### Basic useEffect

```javascript
// ========================================
// EFFECT WITHOUT DEPENDENCIES
// ========================================

function Component() {
  const [count, setCount] = useState(0);
  
  // Runs after every render
  useEffect(() => {
    console.log('Effect ran');
  });
  
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}

// ========================================
// EFFECT WITH EMPTY DEPENDENCIES
// ========================================

function Component() {
  useEffect(() => {
    console.log('Mounted');
    
    return () => {
      console.log('Unmounted');
    };
  }, []); // Runs once on mount
  
  return <div>Component</div>;
}

// ========================================
// EFFECT WITH DEPENDENCIES
// ========================================

function Component() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  useEffect(() => {
    console.log(`Count changed to ${count}`);
  }, [count]); // Runs when count changes
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </div>
  );
}
```

### Cleanup Functions

```javascript
// ========================================
// EVENT LISTENERS
// ========================================

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
    
    // Cleanup: Remove listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <div>{size.width} x {size.height}</div>;
}

// ========================================
// TIMERS
// ========================================

function Timer() {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    
    // Cleanup: Clear interval
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  return <div>Seconds: {seconds}</div>;
}

// ========================================
// SUBSCRIPTIONS
// ========================================

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const subscription = chatAPI.subscribe(roomId, (message) => {
      setMessages(prev => [...prev, message]);
    });
    
    // Cleanup: Unsubscribe
    return () => {
      subscription.unsubscribe();
    };
  }, [roomId]);
  
  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{msg}</div>
      ))}
    </div>
  );
}

// ========================================
// ABORT CONTROLLER (FETCH)
// ========================================

function DataFetcher({ userId }) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    
    fetch(`/api/users/${userId}`, {
      signal: controller.signal
    })
      .then(res => res.json())
      .then(setData)
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error(error);
        }
      });
    
    // Cleanup: Abort fetch
    return () => {
      controller.abort();
    };
  }, [userId]);
  
  return <div>{data ? data.name : 'Loading...'}</div>;
}
```

### Common useEffect Patterns

```javascript
// ========================================
// PATTERN 1: DATA FETCHING
// ========================================

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    setLoading(true);
    setError(null);
    
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setUser(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });
    
    return () => {
      cancelled = true;
    };
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{user.name}</div>;
}

// ========================================
// PATTERN 2: DOCUMENT TITLE
// ========================================

function useDocumentTitle(title) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}

function Page() {
  const [count, setCount] = useState(0);
  useDocumentTitle(`Count: ${count}`);
  
  return <button onClick={() => setCount(count + 1)}>Increment</button>;
}

// ========================================
// PATTERN 3: LOCAL STORAGE SYNC
// ========================================

function useLocalStorageSync(key, value) {
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [key, value]);
}

function Form() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  useLocalStorageSync('formData', formData);
  
  return (
    <form>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
    </form>
  );
}

// ========================================
// PATTERN 4: DEBOUNCED EFFECT
// ========================================

function SearchInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        fetch(`/api/search?q=${query}`)
          .then(res => res.json())
          .then(setResults);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [query]);
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}
```


### useEffect vs useLayoutEffect

```javascript
// ========================================
// USEEFFECT (ASYNCHRONOUS)
// ========================================

function Component() {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    // Runs AFTER browser paint
    setWidth(window.innerWidth);
  }, []);
  
  // User might see flash of 0 before width updates
  return <div>Width: {width}</div>;
}

// ========================================
// USELAYOUTEFFECT (SYNCHRONOUS)
// ========================================

function Component() {
  const [width, setWidth] = useState(0);
  
  useLayoutEffect(() => {
    // Runs BEFORE browser paint
    setWidth(window.innerWidth);
  }, []);
  
  // No flash, width is set before paint
  return <div>Width: {width}</div>;
}

// ========================================
// WHEN TO USE USELAYOUTEFFECT
// ========================================

// Use case 1: Measuring DOM elements
function Tooltip({ children }) {
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const tooltipRef = useRef(null);
  
  useLayoutEffect(() => {
    const { height } = tooltipRef.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
  
  return (
    <div ref={tooltipRef} style={{ top: -tooltipHeight }}>
      {children}
    </div>
  );
}

// Use case 2: Preventing visual flicker
function AnimatedComponent() {
  const [position, setPosition] = useState(0);
  
  useLayoutEffect(() => {
    // Calculate position before paint
    const newPosition = calculatePosition();
    setPosition(newPosition);
  }, []);
  
  return <div style={{ left: position }}>Content</div>;
}
```

---

## useContext Patterns

### Basic Context Usage

```javascript
// ========================================
// CREATING CONTEXT
// ========================================

import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for consuming context
function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  
  return context;
}

// Usage
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
    <header className={theme}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  );
}
```

### Advanced Context Patterns

```javascript
// ========================================
// PATTERN 1: SPLIT CONTEXTS
// ========================================

// Separate state and dispatch to prevent unnecessary re-renders
const StateContext = createContext();
const DispatchContext = createContext();

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

function useAppState() {
  return useContext(StateContext);
}

function useAppDispatch() {
  return useContext(DispatchContext);
}

// ========================================
// PATTERN 2: CONTEXT WITH SELECTOR
// ========================================

function createContextWithSelector() {
  const Context = createContext();
  
  function Provider({ value, children }) {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }
  
  function useContextSelector(selector) {
    const context = useContext(Context);
    const [state, setState] = useState(() => selector(context));
    
    useEffect(() => {
      setState(selector(context));
    }, [context, selector]);
    
    return state;
  }
  
  return [Provider, useContextSelector];
}

// Usage
const [UserProvider, useUserSelector] = createContextWithSelector();

function UserName() {
  // Only re-renders when name changes
  const name = useUserSelector(user => user.name);
  return <div>{name}</div>;
}

// ========================================
// PATTERN 3: MULTIPLE CONTEXTS
// ========================================

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <NotificationProvider>
            <Router />
          </NotificationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Better: Compose providers
function ComposeProviders({ providers, children }) {
  return providers.reduceRight(
    (acc, [Provider, props]) => <Provider {...props}>{acc}</Provider>,
    children
  );
}

function App() {
  return (
    <ComposeProviders
      providers={[
        [AuthProvider, {}],
        [ThemeProvider, {}],
        [LanguageProvider, {}],
        [NotificationProvider, {}]
      ]}
    >
      <Router />
    </ComposeProviders>
  );
}
```

---

## useReducer Advanced

### Basic useReducer

```javascript
// ========================================
// SIMPLE COUNTER
// ========================================

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}

// ========================================
// COMPLEX STATE MANAGEMENT
// ========================================

const initialState = {
  user: null,
  loading: false,
  error: null,
  posts: [],
  filters: {
    search: '',
    category: 'all'
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
      
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        posts: action.payload.posts
      };
      
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
      
    case 'UPDATE_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value
        }
      };
      
    case 'ADD_POST':
      return {
        ...state,
        posts: [...state.posts, action.payload]
      };
      
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload)
      };
      
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.id ? action.payload : post
        )
      };
      
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  useEffect(() => {
    dispatch({ type: 'FETCH_START' });
    
    fetchData()
      .then(data => {
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      })
      .catch(error => {
        dispatch({ type: 'FETCH_ERROR', payload: error.message });
      });
  }, []);
  
  return (
    <div>
      {state.loading && <div>Loading...</div>}
      {state.error && <div>Error: {state.error}</div>}
      {state.posts.map(post => (
        <Post key={post.id} post={post} dispatch={dispatch} />
      ))}
    </div>
  );
}
```

### useReducer Patterns

```javascript
// ========================================
// PATTERN 1: IMMER FOR IMMUTABILITY
// ========================================

import { produce } from 'immer';

function reducer(state, action) {
  return produce(state, draft => {
    switch (action.type) {
      case 'ADD_TODO':
        draft.todos.push(action.payload);
        break;
      case 'TOGGLE_TODO':
        const todo = draft.todos.find(t => t.id === action.payload);
        if (todo) todo.completed = !todo.completed;
        break;
      case 'DELETE_TODO':
        draft.todos = draft.todos.filter(t => t.id !== action.payload);
        break;
    }
  });
}

// ========================================
// PATTERN 2: LAZY INITIALIZATION
// ========================================

function init(initialCount) {
  return {
    count: initialCount,
    history: [initialCount]
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      const newCount = state.count + 1;
      return {
        count: newCount,
        history: [...state.history, newCount]
      };
    case 'reset':
      return init(action.payload);
    default:
      return state;
  }
}

function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <p>History: {state.history.join(', ')}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'reset', payload: 0 })}>
        Reset
      </button>
    </div>
  );
}

// ========================================
// PATTERN 3: MIDDLEWARE
// ========================================

function createReducerWithMiddleware(reducer, middleware) {
  return (state, action) => {
    const newState = reducer(state, action);
    middleware(state, action, newState);
    return newState;
  };
}

// Logger middleware
const logger = (prevState, action, nextState) => {
  console.group(action.type);
  console.log('Previous State:', prevState);
  console.log('Action:', action);
  console.log('Next State:', nextState);
  console.groupEnd();
};

function Component() {
  const [state, dispatch] = useReducer(
    createReducerWithMiddleware(reducer, logger),
    initialState
  );
  
  return <div>...</div>;
}
```

---

## useMemo & useCallback

### useMemo Deep Dive

```javascript
// ========================================
// BASIC USEMEMO
// ========================================

function ExpensiveComponent({ items }) {
  // Without useMemo: Recalculates on every render
  const total = items.reduce((sum, item) => sum + item.price, 0);
  
  // With useMemo: Only recalculates when items change
  const totalMemo = useMemo(() => {
    console.log('Calculating total...');
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);
  
  return <div>Total: {totalMemo}</div>;
}

// ========================================
// COMPLEX CALCULATIONS
// ========================================

function DataTable({ data, filters }) {
  const filteredData = useMemo(() => {
    console.log('Filtering data...');
    return data.filter(item => {
      return (
        item.name.includes(filters.search) &&
        (filters.category === 'all' || item.category === filters.category)
      );
    });
  }, [data, filters]);
  
  const sortedData = useMemo(() => {
    console.log('Sorting data...');
    return [...filteredData].sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredData]);
  
  const stats = useMemo(() => {
    console.log('Calculating stats...');
    return {
      total: sortedData.length,
      average: sortedData.reduce((sum, item) => sum + item.value, 0) / sortedData.length
    };
  }, [sortedData]);
  
  return (
    <div>
      <div>Total: {stats.total}, Average: {stats.average}</div>
      {sortedData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}

// ========================================
// REFERENTIAL EQUALITY
// ========================================

function Parent() {
  const [count, setCount] = useState(0);
  
  // Without useMemo: New object on every render
  const config = { theme: 'dark', count };
  
  // With useMemo: Same object reference if count hasn't changed
  const configMemo = useMemo(() => {
    return { theme: 'dark', count };
  }, [count]);
  
  return <Child config={configMemo} />;
}

const Child = React.memo(({ config }) => {
  console.log('Child rendered');
  return <div>{config.theme}</div>;
});
```

### useCallback Deep Dive

```javascript
// ========================================
// BASIC USECALLBACK
// ========================================

function Parent() {
  const [count, setCount] = useState(0);
  
  // Without useCallback: New function on every render
  const handleClick = () => {
    console.log('Clicked');
  };
  
  // With useCallback: Same function reference
  const handleClickMemo = useCallback(() => {
    console.log('Clicked');
  }, []);
  
  return <Child onClick={handleClickMemo} />;
}

const Child = React.memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click</button>;
});

// ========================================
// WITH DEPENDENCIES
// ========================================

function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const handleSearch = useCallback(async () => {
    const data = await fetch(`/api/search?q=${query}`);
    const json = await data.json();
    setResults(json);
  }, [query]); // Recreates when query changes
  
  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      <Results data={results} />
    </div>
  );
}

// ========================================
// COMMON PATTERN: EVENT HANDLERS
// ========================================

function TodoList() {
  const [todos, setTodos] = useState([]);
  
  const handleToggle = useCallback((id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []); // No dependencies needed with functional update
  
  const handleDelete = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);
  
  return (
    <div>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

const TodoItem = React.memo(({ todo, onToggle, onDelete }) => {
  console.log('TodoItem rendered:', todo.id);
  
  return (
    <div>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
});
```

### When to Use useMemo and useCallback

```javascript
// ========================================
// WHEN TO USE USEMEMO
// ========================================

// ✅ DO: Expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// ✅ DO: Prevent child re-renders
const config = useMemo(() => ({ theme, locale }), [theme, locale]);

// ✅ DO: Dependency in other hooks
const filteredItems = useMemo(() => items.filter(predicate), [items]);
useEffect(() => {
  // Use filteredItems
}, [filteredItems]);

// ❌ DON'T: Simple calculations
const sum = useMemo(() => a + b, [a, b]); // Overkill

// ❌ DON'T: Primitive values
const doubled = useMemo(() => count * 2, [count]); // Unnecessary

// ========================================
// WHEN TO USE USECALLBACK
// ========================================

// ✅ DO: Passing to memoized children
const handleClick = useCallback(() => {
  doSomething();
}, []);
<MemoizedChild onClick={handleClick} />

// ✅ DO: Dependency in other hooks
const fetchData = useCallback(() => {
  return fetch('/api/data');
}, []);
useEffect(() => {
  fetchData();
}, [fetchData]);

// ✅ DO: Event handlers in lists
const handleDelete = useCallback((id) => {
  setItems(prev => prev.filter(item => item.id !== id));
}, []);

// ❌ DON'T: Every function
const handleChange = useCallback((e) => {
  setValue(e.target.value);
}, []); // Probably unnecessary if not passed to memoized child

// ❌ DON'T: Functions that change often
const handleClick = useCallback(() => {
  console.log(count); // Needs count in deps
}, [count]); // Recreates on every count change anyway
```

---

## useRef Complete Guide

### Basic useRef

```javascript
// ========================================
// DOM REFERENCES
// ========================================

function TextInput() {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  return (
    <div>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}

// ========================================
// STORING MUTABLE VALUES
// ========================================

function Timer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);
  
  const start = () => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  };
  
  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  const reset = () => {
    stop();
    setSeconds(0);
  };
  
  useEffect(() => {
    return () => stop(); // Cleanup
  }, []);
  
  return (
    <div>
      <p>Seconds: {seconds}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

// ========================================
// PREVIOUS VALUE
// ========================================

function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  
  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Advanced useRef Patterns

```javascript
// ========================================
// PATTERN 1: CALLBACK REF
// ========================================

function MeasureComponent() {
  const [height, setHeight] = useState(0);
  
  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);
  
  return (
    <div>
      <div ref={measuredRef}>
        <p>This element's height is {height}px</p>
      </div>
    </div>
  );
}

// ========================================
// PATTERN 2: FORWARDING REFS
// ========================================

const FancyInput = forwardRef((props, ref) => {
  return <input ref={ref} className="fancy-input" {...props} />;
});

function Parent() {
  const inputRef = useRef();
  
  return (
    <div>
      <FancyInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>
        Focus Input
      </button>
    </div>
  );
}

// ========================================
// PATTERN 3: IMPERATIVE HANDLE
// ========================================

const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();
  
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    scrollIntoView: () => {
      inputRef.current.scrollIntoView();
    },
    getValue: () => {
      return inputRef.current.value;
    }
  }));
  
  return <input ref={inputRef} {...props} />;
});

function Parent() {
  const fancyInputRef = useRef();
  
  return (
    <div>
      <FancyInput ref={fancyInputRef} />
      <button onClick={() => fancyInputRef.current.focus()}>
        Focus
      </button>
      <button onClick={() => console.log(fancyInputRef.current.getValue())}>
        Get Value
      </button>
    </div>
  );
}

// ========================================
// PATTERN 4: INSTANCE VARIABLES
// ========================================

function Chat() {
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  
  useEffect(() => {
    function connect() {
      ws.current = new WebSocket('wss://chat.example.com');
      
      ws.current.onopen = () => {
        console.log('Connected');
        reconnectAttempts.current = 0;
      };
      
      ws.current.onmessage = (event) => {
        setMessages(prev => [...prev, JSON.parse(event.data)]);
      };
      
      ws.current.onclose = () => {
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          setTimeout(connect, 1000 * reconnectAttempts.current);
        }
      };
    }
    
    connect();
    
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);
  
  const sendMessage = (text) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ text }));
    }
  };
  
  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{msg.text}</div>
      ))}
    </div>
  );
}
```


---

## Custom Hooks

### Creating Custom Hooks

```javascript
// ========================================
// CUSTOM HOOK: FETCH DATA
// ========================================

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    setLoading(true);
    setError(null);
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });
    
    return () => {
      cancelled = true;
    };
  }, [url]);
  
  return { data, loading, error };
}

// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{user.name}</div>;
}

// ========================================
// CUSTOM HOOK: LOCAL STORAGE
// ========================================

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue];
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'en');
  
  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="vi">Vietnamese</option>
      </select>
    </div>
  );
}

// ========================================
// CUSTOM HOOK: DEBOUNCE
// ========================================

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Make API call
      fetch(`/api/search?q=${debouncedSearchTerm}`)
        .then(res => res.json())
        .then(data => console.log(data));
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}

// ========================================
// CUSTOM HOOK: WINDOW SIZE
// ========================================

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowSize;
}

// Usage
function ResponsiveComponent() {
  const { width, height } = useWindowSize();
  
  return (
    <div>
      <p>Window size: {width} x {height}</p>
      {width < 768 ? <MobileView /> : <DesktopView />}
    </div>
  );
}

// ========================================
// CUSTOM HOOK: FORM HANDLING
// ========================================

function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (validate) {
      const fieldErrors = validate({ ...values, [name]: values[name] });
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };
  
  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      
      if (Object.keys(validationErrors).length === 0) {
        onSubmit(values);
      }
    } else {
      onSubmit(values);
    }
  };
  
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  };
}

// Usage
function LoginForm() {
  const validate = (values) => {
    const errors = {};
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    return errors;
  };
  
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    { email: '', password: '' },
    validate
  );
  
  const onSubmit = (values) => {
    console.log('Form submitted:', values);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          name="email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
        />
        {touched.email && errors.email && <span>{errors.email}</span>}
      </div>
      
      <div>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
        />
        {touched.password && errors.password && <span>{errors.password}</span>}
      </div>
      
      <button type="submit">Login</button>
    </form>
  );
}
```

### Advanced Custom Hooks

```javascript
// ========================================
// CUSTOM HOOK: ASYNC STATE
// ========================================

function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  
  const execute = useCallback((...params) => {
    setStatus('pending');
    setValue(null);
    setError(null);
    
    return asyncFunction(...params)
      .then(response => {
        setValue(response);
        setStatus('success');
        return response;
      })
      .catch(error => {
        setError(error);
        setStatus('error');
        throw error;
      });
  }, [asyncFunction]);
  
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  
  return { execute, status, value, error };
}

// Usage
function UserProfile({ userId }) {
  const fetchUser = useCallback(() => {
    return fetch(`/api/users/${userId}`).then(res => res.json());
  }, [userId]);
  
  const { value: user, status, error, execute } = useAsync(fetchUser);
  
  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error: {error.message}</div>;
  if (status === 'success') return <div>{user.name}</div>;
  
  return <button onClick={execute}>Load User</button>;
}

// ========================================
// CUSTOM HOOK: INTERSECTION OBSERVER
// ========================================

function useIntersectionObserver(ref, options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);
  
  return isIntersecting;
}

// Usage
function LazyImage({ src, alt }) {
  const imgRef = useRef();
  const isVisible = useIntersectionObserver(imgRef, {
    threshold: 0.1,
    rootMargin: '100px'
  });
  
  return (
    <div ref={imgRef}>
      {isVisible ? (
        <img src={src} alt={alt} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

// ========================================
// CUSTOM HOOK: MEDIA QUERY
// ========================================

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    return window.matchMedia(query).matches;
  });
  
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const handleChange = (e) => {
      setMatches(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);
  
  return matches;
}

// Usage
function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  
  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  );
}

// ========================================
// CUSTOM HOOK: PREVIOUS VALUE
// ========================================

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
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <p>Change: {count - (prevCount || 0)}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// ========================================
// CUSTOM HOOK: TOGGLE
// ========================================

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);
  
  const setTrue = useCallback(() => {
    setValue(true);
  }, []);
  
  const setFalse = useCallback(() => {
    setValue(false);
  }, []);
  
  return [value, { toggle, setTrue, setFalse }];
}

// Usage
function Modal() {
  const [isOpen, { toggle, setTrue, setFalse }] = useToggle(false);
  
  return (
    <div>
      <button onClick={setTrue}>Open Modal</button>
      {isOpen && (
        <div className="modal">
          <p>Modal Content</p>
          <button onClick={setFalse}>Close</button>
          <button onClick={toggle}>Toggle</button>
        </div>
      )}
    </div>
  );
}
```

---

## Advanced Patterns

### Pattern 1: Compound Components

```javascript
// ========================================
// COMPOUND COMPONENTS WITH CONTEXT
// ========================================

const TabsContext = createContext();

function Tabs({ children, defaultValue }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
}

function Tab({ value, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  
  return (
    <button
      className={activeTab === value ? 'active' : ''}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

function TabPanel({ value, children }) {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) return null;
  
  return <div className="tab-panel">{children}</div>;
}

// Usage
function App() {
  return (
    <Tabs defaultValue="tab1">
      <TabList>
        <Tab value="tab1">Tab 1</Tab>
        <Tab value="tab2">Tab 2</Tab>
        <Tab value="tab3">Tab 3</Tab>
      </TabList>
      
      <TabPanel value="tab1">Content 1</TabPanel>
      <TabPanel value="tab2">Content 2</TabPanel>
      <TabPanel value="tab3">Content 3</TabPanel>
    </Tabs>
  );
}
```

### Pattern 2: Render Props with Hooks

```javascript
// ========================================
// RENDER PROPS PATTERN
// ========================================

function Mouse({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return render(position);
}

// Usage
function App() {
  return (
    <Mouse
      render={({ x, y }) => (
        <div>
          Mouse position: {x}, {y}
        </div>
      )}
    />
  );
}

// Better: Custom Hook
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
function App() {
  const { x, y } = useMouse();
  
  return (
    <div>
      Mouse position: {x}, {y}
    </div>
  );
}
```

### Pattern 3: State Reducer Pattern

```javascript
// ========================================
// STATE REDUCER PATTERN
// ========================================

function useCounter({ initial = 0, max = Infinity, min = -Infinity } = {}) {
  const [count, setCount] = useState(initial);
  
  const increment = () => {
    setCount(c => Math.min(c + 1, max));
  };
  
  const decrement = () => {
    setCount(c => Math.max(c - 1, min));
  };
  
  const reset = () => {
    setCount(initial);
  };
  
  return { count, increment, decrement, reset };
}

// With custom reducer
function useCounterWithReducer({ initial = 0, reducer } = {}) {
  const defaultReducer = (state, action) => {
    switch (action.type) {
      case 'increment':
        return { count: state.count + 1 };
      case 'decrement':
        return { count: state.count - 1 };
      case 'reset':
        return { count: initial };
      default:
        return state;
    }
  };
  
  const [state, dispatch] = useReducer(
    reducer || defaultReducer,
    { count: initial }
  );
  
  return { ...state, dispatch };
}

// Usage with custom logic
function Counter() {
  const customReducer = (state, action) => {
    switch (action.type) {
      case 'increment':
        // Custom logic: increment by 2
        return { count: state.count + 2 };
      case 'decrement':
        // Custom logic: can't go below 0
        return { count: Math.max(0, state.count - 1) };
      default:
        return state;
    }
  };
  
  const { count, dispatch } = useCounterWithReducer({
    initial: 0,
    reducer: customReducer
  });
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
}
```

---

## Performance Optimization

### Optimization Techniques

```javascript
// ========================================
// TECHNIQUE 1: REACT.MEMO
// ========================================

// Without memo: Re-renders on every parent render
function ExpensiveComponent({ data }) {
  console.log('Rendering ExpensiveComponent');
  return <div>{data}</div>;
}

// With memo: Only re-renders when props change
const MemoizedComponent = React.memo(function ExpensiveComponent({ data }) {
  console.log('Rendering ExpensiveComponent');
  return <div>{data}</div>;
});

// Custom comparison
const MemoizedWithComparison = React.memo(
  function ExpensiveComponent({ user }) {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip render)
    return prevProps.user.id === nextProps.user.id;
  }
);

// ========================================
// TECHNIQUE 2: SPLIT COMPONENTS
// ========================================

// Bad: Entire form re-renders on every keystroke
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  return (
    <div>
      <ExpensiveHeader />
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <ExpensiveFooter />
    </div>
  );
}

// Good: Split into smaller components
function Form() {
  return (
    <div>
      <ExpensiveHeader />
      <NameInput />
      <EmailInput />
      <ExpensiveFooter />
    </div>
  );
}

function NameInput() {
  const [name, setName] = useState('');
  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}

// ========================================
// TECHNIQUE 3: LAZY LOADING
// ========================================

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  const [show, setShow] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShow(true)}>Load Component</button>
      {show && (
        <Suspense fallback={<div>Loading...</div>}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
}

// ========================================
// TECHNIQUE 4: VIRTUALIZATION
// ========================================

import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

---

## Interview Questions

### Q1: What are React Hooks?

**Answer:**

Hooks are functions that let you use React features (state, lifecycle, context, etc.) in function components without writing a class.

**Key Points:**
- Introduced in React 16.8
- Allow function components to have state and side effects
- Enable code reuse through custom hooks
- Simplify component logic

**Example:**
```javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Q2: What are the rules of hooks?

**Answer:**

**Rule 1: Only call hooks at the top level**
- Don't call hooks inside loops, conditions, or nested functions
- Ensures hooks are called in the same order on every render

**Rule 2: Only call hooks from React functions**
- Call from function components
- Call from custom hooks
- Don't call from regular JavaScript functions

**Why?** React relies on the order of hook calls to maintain state correctly.

### Q3: When should you use useMemo and useCallback?

**Answer:**

**useMemo:**
- Expensive calculations
- Preventing child re-renders (referential equality)
- Dependencies in other hooks

**useCallback:**
- Passing callbacks to memoized children
- Dependencies in useEffect
- Event handlers in lists

**Don't overuse:** Premature optimization can hurt performance.

```javascript
// Good use of useMemo
const expensiveValue = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0);
}, [items]);

// Good use of useCallback
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### Q4: What's the difference between useEffect and useLayoutEffect?

**Answer:**

**useEffect:**
- Runs asynchronously after paint
- Doesn't block browser painting
- Use for most side effects

**useLayoutEffect:**
- Runs synchronously before paint
- Blocks browser painting
- Use for DOM measurements and synchronous updates

```javascript
// useEffect: Might see flash
useEffect(() => {
  setWidth(element.offsetWidth);
}, []);

// useLayoutEffect: No flash
useLayoutEffect(() => {
  setWidth(element.offsetWidth);
}, []);
```

### Q5: How do you create a custom hook?

**Answer:**

Custom hooks are functions that:
1. Start with "use"
2. Can call other hooks
3. Return values or functions

```javascript
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });
  
  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };
  
  return [value, setStoredValue];
}

// Usage
function App() {
  const [name, setName] = useLocalStorage('name', '');
  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}
```

---

## Summary

### Key Takeaways

1. **Hooks enable function components to have state and lifecycle**
2. **Follow the rules of hooks strictly**
3. **Use built-in hooks appropriately**
4. **Create custom hooks for reusable logic**
5. **Optimize with useMemo and useCallback when needed**
6. **Clean up effects to prevent memory leaks**

### Best Practices

✅ **DO:**
- Follow rules of hooks
- Use ESLint plugin
- Create custom hooks for reusable logic
- Clean up effects
- Use functional updates for state
- Memoize expensive calculations

❌ **DON'T:**
- Call hooks conditionally
- Overuse useMemo/useCallback
- Forget cleanup functions
- Mutate state directly
- Create too many small hooks

---

[← Back to Testing](./06-testing.md) | [Next: Performance →](../08-performance/02-react-performance.md)
