---
layout: page
title: "React Advanced Patterns & Interview Questions"
description: "Advanced React patterns including hooks, performance optimization, React 18 features, state management, and comprehensive interview preparation"
category: "React"
tags: [react, hooks, performance, react-18, state-management, patterns, testing, interview-questions]
---

# React Advanced Patterns & Interview Questions

## Table of Contents

- [Advanced Hooks](#advanced-hooks)
- [Performance Optimization](#performance-optimization)
- [React 18 Features](#react-18-features)
- [State Management Patterns](#state-management-patterns)
- [Testing React Components](#testing-react-components)
- [Common Patterns](#common-patterns)
- [Server-Side Rendering](#server-side-rendering)
- [Advanced Interview Questions](#advanced-interview-questions)

## Advanced Hooks

### useReducer for Complex State

```jsx
// Complex state management with useReducer
const initialState = {
  items: [],
  loading: false,
  error: null,
  filter: 'all'
};

function todoReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, items: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'FETCH_START' });
    fetchTodos()
      .then(todos => dispatch({ type: 'FETCH_SUCCESS', payload: todos }))
      .catch(error => dispatch({ type: 'FETCH_ERROR', payload: error.message }));
  }, []);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false
    };
    dispatch({ type: 'ADD_ITEM', payload: newTodo });
  };

  const filteredItems = state.items.filter(item => {
    if (state.filter === 'completed') return item.completed;
    if (state.filter === 'pending') return !item.completed;
    return true;
  });

  return (
    <div>
      <TodoForm onSubmit={addTodo} />
      <FilterButtons 
        filter={state.filter} 
        onChange={(filter) => dispatch({ type: 'SET_FILTER', payload: filter })}
      />
      {state.loading && <div>Loading...</div>}
      {state.error && <div>Error: {state.error}</div>}
      <TodoList items={filteredItems} dispatch={dispatch} />
    </div>
  );
}
```

### Custom Hooks

{% raw %}
```jsx
// Custom hook for API calls
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  const refetch = useCallback(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, refetch };
}

// Custom hook for local storage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

// Custom hook for form handling
function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (validate) {
      const fieldErrors = validate({ ...values, [name]: values[name] });
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    }
  }, [values, validate]);

  const handleSubmit = useCallback((onSubmit) => {
    return (e) => {
      e.preventDefault();
      
      const validationErrors = validate ? validate(values) : {};
      setErrors(validationErrors);
      
      if (Object.keys(validationErrors).length === 0) {
        onSubmit(values);
      }
    };
  }, [values, validate]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit
  };
}
```
{% endraw %}

## Performance Optimization

### React.memo and useMemo

```jsx
// React.memo for component memoization
const ExpensiveComponent = React.memo(({ data, onClick }) => {
  console.log('ExpensiveComponent rendered');
  
  return (
    <div>
      {data.map(item => (
        <div key={item.id} onClick={() => onClick(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return prevProps.data.length === nextProps.data.length &&
         prevProps.onClick === nextProps.onClick;
});

// useMemo for expensive calculations
function DataProcessor({ items, filter }) {
  const processedData = useMemo(() => {
    console.log('Processing data...');
    
    return items
      .filter(item => item.category === filter)
      .sort((a, b) => a.priority - b.priority)
      .map(item => ({
        ...item,
        displayName: `${item.name} (${item.category})`
      }));
  }, [items, filter]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id}>{item.displayName}</div>
      ))}
    </div>
  );
}

// useCallback for stable function references
function TodoList({ todos, onToggle, onDelete }) {
  const handleToggle = useCallback((id) => {
    onToggle(id);
  }, [onToggle]);

  const handleDelete = useCallback((id) => {
    onDelete(id);
  }, [onDelete]);

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
```

### Code Splitting and Lazy Loading

```jsx
// React.lazy for code splitting
const LazyComponent = React.lazy(() => import('./LazyComponent'));
const AnotherLazyComponent = React.lazy(() => 
  import('./AnotherComponent').then(module => ({
    default: module.AnotherComponent
  }))
);

function App() {
  return (
    <div>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/lazy" element={<LazyComponent />} />
          <Route path="/another" element={<AnotherLazyComponent />} />
        </Routes>
      </Suspense>
    </div>
  );
}

// Dynamic imports based on conditions
function ConditionalComponent({ userRole }) {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    if (userRole === 'admin') {
      import('./AdminPanel').then(module => {
        setComponent(() => module.default);
      });
    } else if (userRole === 'user') {
      import('./UserDashboard').then(module => {
        setComponent(() => module.default);
      });
    }
  }, [userRole]);

  if (!Component) {
    return <div>Loading...</div>;
  }

  return <Component />;
}
```

## React 18 Features

### Concurrent Features

```jsx
// Suspense for data fetching
function UserProfile({ userId }) {
  const user = useSuspenseQuery(['user', userId], () => fetchUser(userId));

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<UserProfileSkeleton />}>
      <UserProfile userId={1} />
    </Suspense>
  );
}

// useTransition for non-urgent updates
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value) => {
    setQuery(value);
    
    // Mark this update as non-urgent
    startTransition(() => {
      setResults(searchItems(value));
    });
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      {isPending && <div>Searching...</div>}
      <SearchResults results={results} />
    </div>
  );
}

// useDeferredValue for deferring expensive updates
function ExpensiveList({ query }) {
  const deferredQuery = useDeferredValue(query);
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(deferredQuery.toLowerCase())
    );
  }, [deferredQuery]);

  return (
    <div>
      {filteredItems.map(item => (
        <ExpensiveItem key={item.id} item={item} />
      ))}
    </div>
  );
}
```

### New Hooks in React 18

```jsx
// useId for unique IDs
function FormField({ label, type = 'text' }) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} />
    </div>
  );
}

// useSyncExternalStore for external state
function useOnlineStatus() {
  const isOnline = useSyncExternalStore(
    (callback) => {
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    },
    () => navigator.onLine,
    () => true // Server-side snapshot
  );

  return isOnline;
}

// useInsertionEffect for CSS-in-JS libraries
function useCSS(css) {
  useInsertionEffect(() => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [css]);
}
```

## State Management Patterns

### Context + Reducer Pattern

```jsx
// State management with Context and Reducer
const AppStateContext = createContext();
const AppDispatchContext = createContext();

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    theme: 'light',
    notifications: []
  });

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

// Custom hooks for accessing state and dispatch
function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}

function useAppDispatch() {
  const context = useContext(AppDispatchContext);
  if (!context) {
    throw new Error('useAppDispatch must be used within AppProvider');
  }
  return context;
}
```

### Zustand Integration

```jsx
// Zustand store
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const useStore = create(
  subscribeWithSelector((set, get) => ({
    // State
    user: null,
    todos: [],
    filter: 'all',
    
    // Actions
    setUser: (user) => set({ user }),
    
    addTodo: (text) => set((state) => ({
      todos: [...state.todos, {
        id: Date.now(),
        text,
        completed: false
      }]
    })),
    
    toggleTodo: (id) => set((state) => ({
      todos: state.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    })),
    
    setFilter: (filter) => set({ filter }),
    
    // Computed values
    get filteredTodos() {
      const { todos, filter } = get();
      if (filter === 'completed') return todos.filter(t => t.completed);
      if (filter === 'pending') return todos.filter(t => !t.completed);
      return todos;
    }
  }))
);

// Using Zustand in components
function TodoApp() {
  const { filteredTodos, addTodo, toggleTodo, filter, setFilter } = useStore();

  return (
    <div>
      <TodoForm onSubmit={addTodo} />
      <FilterButtons filter={filter} onChange={setFilter} />
      <TodoList todos={filteredTodos} onToggle={toggleTodo} />
    </div>
  );
}
```

## Testing React Components

### Testing with Jest and React Testing Library

```jsx
// Component to test
function Counter({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);

  return (
    <div>
      <span data-testid="count">Count: {count}</span>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Test file
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

describe('Counter Component', () => {
  test('renders with initial count', () => {
    render(<Counter initialCount={5} />);
    expect(screen.getByTestId('count')).toHaveTextContent('Count: 5');
  });

  test('increments count when increment button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    const incrementButton = screen.getByText('Increment');
    await user.click(incrementButton);
    
    expect(screen.getByTestId('count')).toHaveTextContent('Count: 1');
  });

  test('decrements count when decrement button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={2} />);
    
    const decrementButton = screen.getByText('Decrement');
    await user.click(decrementButton);
    
    expect(screen.getByTestId('count')).toHaveTextContent('Count: 1');
  });

  test('resets count when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={5} />);
    
    const resetButton = screen.getByText('Reset');
    await user.click(resetButton);
    
    expect(screen.getByTestId('count')).toHaveTextContent('Count: 0');
  });
});

// Testing hooks
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter Hook', () => {
  test('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  test('should increment count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  test('should decrement count', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });
});
```

## Common Patterns

### Higher-Order Components (HOCs)

```jsx
// HOC for authentication
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return <div>Please log in to access this page.</div>;
    }

    return <Component {...props} user={user} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);

// HOC for loading state
function withLoading(Component) {
  return function LoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
}
```

### Render Props Pattern

```jsx
// Render props for data fetching
function DataFetcher({ url, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [url]);

  return children({ data, loading, error });
}

// Usage
function UserList() {
  return (
    <DataFetcher url="/api/users">
      {({ data, loading, error }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
        
        return (
          <ul>
            {data.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        );
      }}
    </DataFetcher>
  );
}
```

### Compound Components Pattern

```jsx
// Compound components for tabs
const TabsContext = createContext();

function Tabs({ children, defaultValue }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={% raw %}{{ activeTab, setActiveTab }}{% endraw %}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
}

function Tab({ value, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      className={`tab ${isActive ? 'active' : ''}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

function TabPanels({ children }) {
  return <div className="tab-panels">{children}</div>;
}

function TabPanel({ value, children }) {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) {
    return null;
  }

  return <div className="tab-panel">{children}</div>;
}

// Attach components to main component
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panels = TabPanels;
Tabs.Panel = TabPanel;

// Usage
function App() {
  return (
    <Tabs defaultValue="tab1">
      <Tabs.List>
        <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
        <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
        <Tabs.Tab value="tab3">Tab 3</Tabs.Tab>
      </Tabs.List>
      
      <Tabs.Panels>
        <Tabs.Panel value="tab1">Content of Tab 1</Tabs.Panel>
        <Tabs.Panel value="tab2">Content of Tab 2</Tabs.Panel>
        <Tabs.Panel value="tab3">Content of Tab 3</Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
}
```

## Server-Side Rendering

### Next.js Patterns

```jsx
// Server-side rendering with getServerSideProps
export async function getServerSideProps(context) {
  const { params, query, req, res } = context;
  
  try {
    const data = await fetchData(params.id);
    
    return {
      props: {
        data,
        timestamp: Date.now()
      }
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
}

// Static generation with getStaticProps
export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);
  
  return {
    props: {
      post
    },
    revalidate: 60 // ISR - revalidate every 60 seconds
  };
}

// Dynamic routes with getStaticPaths
export async function getStaticPaths() {
  const posts = await getAllPosts();
  const paths = posts.map(post => ({
    params: { slug: post.slug }
  }));
  
  return {
    paths,
    fallback: 'blocking' // or false, true
  };
}

// App Router (React 18)
// app/page.tsx
export default async function HomePage() {
  const data = await fetchData();
  
  return (
    <div>
      <h1>Welcome</h1>
      <DataComponent data={data} />
    </div>
  );
}

// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <header>My App</header>
        {children}
        <footer>Footer</footer>
      </body>
    </html>
  );
}
```

## Advanced Interview Questions

### 1. Explain React's reconciliation algorithm and how keys work.

**Answer:**
React's reconciliation is the diffing algorithm that compares the current virtual DOM tree with the previous one to determine what changes need to be made to the real DOM.

**How it works:**
1. When state or props change, React creates a new virtual DOM tree
2. React compares (diffs) the new tree with the previous tree
3. React calculates the minimum set of changes needed
4. React applies only those changes to the real DOM

**Keys are crucial for:**
- Identifying which items have changed, been added, or removed
- Maintaining component state during re-renders
- Optimizing performance by reusing DOM nodes

```jsx
// ❌ Bad - using array index
{items.map((item, index) => (
  <Item key={index} data={item} />
))}

// ✅ Good - using stable unique identifier
{items.map(item => (
  <Item key={item.id} data={item} />
))}
```

### 2. What are the differences between useMemo and useCallback?

**Answer:**
- **useMemo**: Memoizes the result of a computation/expression
- **useCallback**: Memoizes a function definition

```jsx
// useMemo - memoizes the computed value
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// useCallback - memoizes the function itself
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// useCallback is equivalent to:
const memoizedCallback = useMemo(() => {
  return () => doSomething(a, b);
}, [a, b]);
```

### 3. How does React's Fiber architecture improve performance?

**Answer:**
Fiber is React's reconciliation algorithm that makes reconciliation interruptible and prioritizable:

**Key improvements:**
- **Incremental rendering**: Work can be split into chunks
- **Prioritization**: Updates can have different priorities
- **Pausing and resuming**: React can pause work and come back to it later
- **Error boundaries**: Better error handling during rendering
- **Time slicing**: Prevents blocking the main thread

**Benefits:**
- Smoother animations and interactions
- Better responsiveness
- Ability to schedule low-priority updates
- Improved user experience

### 4. Explain the difference between controlled and uncontrolled components.

**Answer:**

**Controlled Components:**
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

**Uncontrolled Components:**
```jsx
function UncontrolledInput() {
  const inputRef = useRef();
  
  const handleSubmit = () => {
    console.log(inputRef.current.value);
  };
  
  return (
    <input ref={inputRef} defaultValue="initial" />
  );
}
```

**When to use:**
- **Controlled**: When you need validation, formatting, or dynamic behavior
- **Uncontrolled**: For simple forms or when integrating with non-React code

### 5. What are React Portals and when would you use them?

**Answer:**
Portals provide a way to render children into a DOM node outside of the parent component's DOM hierarchy.

```jsx
function Modal({ children, isOpen }) {
  if (!isOpen) return null;
  
  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}
```

**Use cases:**
- Modals and dialogs
- Tooltips and popovers
- Notifications
- Any UI that needs to escape parent's overflow/z-index constraints

### 6. How do you handle error boundaries in React?

**Answer:**
Error boundaries are React components that catch JavaScript errors anywhere in their child component tree.

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

**Important notes:**
- Error boundaries only work in class components
- They don't catch errors in event handlers, async code, or during SSR
- Use libraries like `react-error-boundary` for hook-based error boundaries

This comprehensive guide covers advanced React patterns and interview questions essential for senior frontend positions at Big Tech companies.
