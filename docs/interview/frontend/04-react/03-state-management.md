# State Management - From Context to Redux

> State management là core skill cho React developers. Hiểu khi nào dùng tool nào = kiến trúc app tốt hơn.

---

## Mục Lục

- [Overview](#-overview)
- [Local State](#-local-state)
- [Context API](#-context-api)
- [Redux](#-redux)
- [Zustand](#-zustand)
- [React Query / TanStack Query](#-react-query)
- [Choosing the Right Tool](#-choosing-the-right-tool)
- [Câu Hỏi Phỏng Vấn](#-câu-hỏi-phỏng-vấn)

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                STATE MANAGEMENT SPECTRUM                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Simple ◄──────────────────────────────────────────────► Complex │
│                                                                   │
│  ┌────────┐  ┌─────────┐  ┌──────────┐  ┌───────┐  ┌───────┐   │
│  │useState│  │useReducer│  │ Context  │  │Zustand│  │ Redux │   │
│  └────────┘  └─────────┘  └──────────┘  └───────┘  └───────┘   │
│                                                                   │
│  Component   Component     App-wide      Medium     Enterprise   │
│  Level       Level         Simple        Apps       Apps         │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Server State (Different category):                              │
│  ┌──────────────┐  ┌─────┐  ┌──────────────────┐                │
│  │ React Query  │  │ SWR │  │ Apollo (GraphQL) │                │
│  └──────────────┘  └─────┘  └──────────────────┘                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Types of State

| Type | Examples | Solution |
|------|----------|----------|
| Local UI State | Form inputs, toggles, modals | useState |
| Shared UI State | Theme, sidebar open | Context |
| Server/Cache State | API data, user info | React Query, SWR |
| URL State | Filters, pagination | React Router |
| Form State | Complex forms | React Hook Form |
| Global App State | Auth, cart, notifications | Redux, Zustand |

---

## 📦 Local State

### useState

```jsx
function Counter() {
    const [count, setCount] = useState(0);

    return (
        <button onClick={() => setCount(c => c + 1)}>
            Count: {count}
        </button>
    );
}
```

### useReducer

```jsx
// Better for complex state logic
const initialState = {
    items: [],
    loading: false,
    error: null
};

function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD_ITEM':
            return {
                ...state,
                items: [...state.items, action.payload]
            };
        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        default:
            return state;
    }
}

function Cart() {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    const addItem = (item) => {
        dispatch({ type: 'ADD_ITEM', payload: item });
    };

    return (
        <div>
            {state.items.map(item => (
                <CartItem key={item.id} item={item} />
            ))}
        </div>
    );
}
```

---

## 🌐 Context API

### Basic Context

```jsx
// 1. Create Context
const ThemeContext = createContext('light');

// 2. Provider Component
function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const value = { theme, toggleTheme };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

// 3. Custom Hook for consuming
function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}

// 4. Usage
function App() {
    return (
        <ThemeProvider>
            <Header />
            <Main />
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

### Context with Reducer

```jsx
// Auth Context with useReducer
const AuthContext = createContext(null);

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload, isAuthenticated: true };
        case 'LOGOUT':
            return { ...state, user: null, isAuthenticated: false };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        isAuthenticated: false,
        loading: true
    });

    const login = async (credentials) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const user = await authAPI.login(credentials);
            dispatch({ type: 'LOGIN', payload: user });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
```

### Context Performance Optimization

```jsx
// Problem: All consumers re-render when any context value changes

// Solution 1: Split contexts
const UserContext = createContext(null);
const UserDispatchContext = createContext(null);

function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={user}>
            <UserDispatchContext.Provider value={setUser}>
                {children}
            </UserDispatchContext.Provider>
        </UserContext.Provider>
    );
}

// Solution 2: Memoize provider value
function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');

    const value = useMemo(() => ({
        theme,
        toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light')
    }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

// Solution 3: useMemo in consumers
function ExpensiveComponent() {
    const { theme } = useTheme();

    const computedStyle = useMemo(() => {
        return computeExpensiveStyle(theme);
    }, [theme]);

    return <div style={computedStyle}>...</div>;
}
```

---

## 🔴 Redux

### Core Concepts

```
┌─────────────────────────────────────────────────────────────────┐
│                    REDUX DATA FLOW                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                         ┌─────────────┐                          │
│                         │    VIEW     │                          │
│                         │  (React)    │                          │
│                         └──────┬──────┘                          │
│                                │                                  │
│                                │ dispatch(action)                 │
│                                ▼                                  │
│   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐     │
│   │    STATE    │◄─────│   REDUCER   │◄─────│   ACTION    │     │
│   │   (store)   │      │  (pure fn)  │      │  { type }   │     │
│   └──────┬──────┘      └─────────────┘      └─────────────┘     │
│          │                                                        │
│          │ useSelector()                                          │
│          ▼                                                        │
│   ┌─────────────┐                                                │
│   │    VIEW     │                                                │
│   │  (React)    │                                                │
│   └─────────────┘                                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Redux Toolkit (Modern Redux)

```jsx
// store/slices/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
    name: 'counter',
    initialState: { value: 0 },
    reducers: {
        increment: (state) => {
            state.value += 1; // Immer allows "mutation"
        },
        decrement: (state) => {
            state.value -= 1;
        },
        incrementByAmount: (state, action) => {
            state.value += action.payload;
        }
    }
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;

// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        user: userReducer
    }
});

// App.js
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
    return (
        <Provider store={store}>
            <Counter />
        </Provider>
    );
}

// Counter.js
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './store/slices/counterSlice';

function Counter() {
    const count = useSelector(state => state.counter.value);
    const dispatch = useDispatch();

    return (
        <div>
            <span>{count}</span>
            <button onClick={() => dispatch(increment())}>+</button>
            <button onClick={() => dispatch(decrement())}>-</button>
        </div>
    );
}
```

### Async Actions with createAsyncThunk

```jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/users');
            return response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        list: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Usage
function UserList() {
    const { list, loading, error } = useSelector(state => state.users);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    if (loading) return <Spinner />;
    if (error) return <Error message={error} />;
    return <ul>{list.map(user => <li key={user.id}>{user.name}</li>)}</ul>;
}
```

---

## 🐻 Zustand

Simple, lightweight state management.

```jsx
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Simple store
const useCounterStore = create((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
    reset: () => set({ count: 0 })
}));

// With middleware
const useStore = create(
    devtools(
        persist(
            (set, get) => ({
                user: null,
                cart: [],
                setUser: (user) => set({ user }),
                addToCart: (item) => set((state) => ({
                    cart: [...state.cart, item]
                })),
                removeFromCart: (id) => set((state) => ({
                    cart: state.cart.filter(item => item.id !== id)
                })),
                getCartTotal: () => {
                    const { cart } = get();
                    return cart.reduce((sum, item) => sum + item.price, 0);
                }
            }),
            { name: 'app-storage' }
        )
    )
);

// Usage - no Provider needed!
function Counter() {
    const count = useCounterStore((state) => state.count);
    const increment = useCounterStore((state) => state.increment);

    return <button onClick={increment}>{count}</button>;
}

// Selective subscription (prevents unnecessary re-renders)
function CartTotal() {
    const total = useStore((state) =>
        state.cart.reduce((sum, item) => sum + item.price, 0)
    );

    return <span>Total: ${total}</span>;
}
```

---

## 🔄 React Query

For server state (caching, synchronization, background updates).

```jsx
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <UserList />
        </QueryClientProvider>
    );
}

function UserList() {
    const {
        data: users,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['users'],
        queryFn: () => fetch('/api/users').then(res => res.json()),
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 30 * 60 * 1000, // 30 minutes
    });

    if (isLoading) return <Spinner />;
    if (isError) return <Error message={error.message} />;

    return (
        <div>
            <button onClick={refetch}>Refresh</button>
            <ul>
                {users.map(user => <li key={user.id}>{user.name}</li>)}
            </ul>
        </div>
    );
}

// Mutations
function CreateUser() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (newUser) => fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify(newUser)
        }).then(res => res.json()),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });

    const handleSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <form onSubmit={handleSubmit}>
            {mutation.isLoading && <span>Creating...</span>}
            {mutation.isError && <span>Error: {mutation.error.message}</span>}
            {/* form fields */}
        </form>
    );
}
```

---

## 🎯 Choosing the Right Tool

```
┌─────────────────────────────────────────────────────────────────┐
│              STATE MANAGEMENT DECISION TREE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Is it server data (API)?                                       │
│   ├── YES → React Query / SWR / Apollo                          │
│   └── NO ↓                                                       │
│                                                                   │
│   Is it local to one component?                                  │
│   ├── YES → useState / useReducer                                │
│   └── NO ↓                                                       │
│                                                                   │
│   Is it shared between few nearby components?                    │
│   ├── YES → Lift state up + props                               │
│   └── NO ↓                                                       │
│                                                                   │
│   Is it app-wide but simple (theme, auth)?                      │
│   ├── YES → Context API                                          │
│   └── NO ↓                                                       │
│                                                                   │
│   Is it complex with many actions?                               │
│   ├── Medium complexity → Zustand                               │
│   └── Large enterprise app → Redux Toolkit                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Comparison Table

| Feature | Context | Redux | Zustand | React Query |
|---------|---------|-------|---------|-------------|
| Learning curve | Low | High | Low | Medium |
| Boilerplate | Low | Medium (RTK) | Very Low | Low |
| DevTools | No | Yes | Yes | Yes |
| Middleware | No | Yes | Yes | Built-in |
| Best for | Simple global | Complex app | Medium app | Server state |
| Bundle size | 0 | ~10KB | ~1KB | ~12KB |

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: useState vs useReducer?**

A:
- useState: Simple state, single values
- useReducer: Complex state logic, multiple sub-values, testing easier

**Q: Props drilling là gì?**

A: Passing props through many levels of components. Solutions: Context, Redux, composition.

### 🟡 Mid-level

**Q: Context API có thể thay thế Redux không?**

A: Tùy case:
- Context OK cho: simple global state (theme, auth, locale)
- Redux better cho: complex state, frequent updates, middleware, DevTools, time-travel debugging

**Q: Tại sao cần React Query khi đã có Redux?**

A: Different purposes:
- Redux: Client state (UI state, app state)
- React Query: Server state (caching, sync, background updates, stale data)

Combining both is common and recommended.

### 🔴 Senior

**Q: Design state management cho e-commerce app**

A:
```javascript
// Server state (React Query)
- Products, categories, orders, user profile
- Benefits: caching, background refetch, optimistic updates

// Client state (Zustand/Redux)
- Cart, wishlist, UI preferences
- Persist to localStorage

// URL state (React Router)
- Filters, search, pagination

// Form state (React Hook Form)
- Checkout form, address form

// Local state (useState)
- Modal open/close, form validation
```

---

## 📚 Active Recall

1. [ ] Khi nào dùng Context vs Redux?
2. [ ] Implement useReducer cho todo app
3. [ ] So sánh Zustand vs Redux Toolkit
4. [ ] React Query vs SWR?
5. [ ] Design state architecture cho social media app

---

> **Tiếp theo:** [04-component-patterns.md](./04-component-patterns.md) - Advanced Component Patterns
