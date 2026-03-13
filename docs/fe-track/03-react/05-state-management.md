# State Management / Quản Lý Trạng Thái

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## React - Chapter 5 / React - Chương 5

[← Previous: Advanced Patterns](./04-advanced-patterns.md) | [Back to Table of Contents](../../00-table-of-contents.md)

---

## Overview / Tổng Quan

**English:** State management is crucial for building scalable React applications. This chapter covers Context API, Redux, Zustand, and modern state management patterns.

**Tiếng Việt:** Quản lý trạng thái rất quan trọng để xây dựng ứng dụng React có thể mở rộng. Chương này bao gồm Context API, Redux, Zustand và các mẫu quản lý trạng thái hiện đại.

---

## Context API / API Context

### Basic Context / Context Cơ Bản

```typescript
import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // API call / Gọi API
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    const userData = await response.json();
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Usage / Sử dụng
function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}

function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout / Đăng xuất</button>
    </div>
  );
}
```

---

## Redux Toolkit / Bộ Công Cụ Redux

### Store Setup / Thiết Lập Store

```typescript
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoState {
  items: Todo[];
  filter: 'all' | 'active' | 'completed';
}

const initialState: TodoState = {
  items: [],
  filter: 'all'
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.items.push({
        id: crypto.randomUUID(),
        text: action.payload,
        completed: false
      });
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
    setFilter: (state, action: PayloadAction<TodoState['filter']>) => {
      state.filter = action.payload;
    }
  }
});

export const { addTodo, toggleTodo, deleteTodo, setFilter } = todoSlice.actions;

export const store = configureStore({
  reducer: {
    todos: todoSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Using Redux / Sử Dụng Redux

```typescript
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, addTodo, toggleTodo } from './store';

function TodoList() {
  const todos = useSelector((state: RootState) => state.todos.items);
  const filter = useSelector((state: RootState) => state.todos.filter);
  const dispatch = useDispatch<AppDispatch>();

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div>
      <input
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            dispatch(addTodo(e.currentTarget.value));
            e.currentTarget.value = '';
          }
        }}
      />
      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch(toggleTodo(todo.id))}
            />
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Zustand

### Simple Store / Store Đơn Giản

```typescript
import create from 'zustand';

interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}));

// Usage / Sử dụng
function Counter() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

---

## Advanced Redux Patterns / Mẫu Redux Nâng Cao

### Redux Middleware / Middleware Redux

**English:** Middleware provides a way to extend Redux with custom functionality, intercepting actions before they reach the reducer.

**Tiếng Việt:** Middleware cung cấp cách mở rộng Redux với chức năng tùy chỉnh, chặn actions trước khi chúng đến reducer.

```typescript
// Logger Middleware
const loggerMiddleware = (store) => (next) => (action) => {
  console.log('Dispatching:', action);
  console.log('Previous State:', store.getState());
  
  const result = next(action);
  
  console.log('Next State:', store.getState());
  return result;
};

// Async Middleware (Redux Thunk)
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUser = createAsyncThunk(
  'users/fetchById',
  async (userId: string, thunkAPI) => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      return thunkAPI.rejectWithValue('Failed to fetch user');
    }
    return response.json();
  }
);

// Using in slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});
```

### Redux Selectors / Bộ Chọn Redux

**English:** Selectors are functions that extract and derive data from the Redux store, enabling memoization and performance optimization.

**Tiếng Việt:** Selectors là các hàm trích xuất và suy ra dữ liệu từ Redux store, cho phép memoization và tối ưu hóa hiệu suất.

```typescript
import { createSelector } from '@reduxjs/toolkit';

// Basic selector
const selectTodos = (state: RootState) => state.todos.items;
const selectFilter = (state: RootState) => state.todos.filter;

// Memoized selector
const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => {
    console.log('Computing filtered todos...');
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }
);

// Selector with parameters
const selectTodoById = createSelector(
  [selectTodos, (state: RootState, todoId: string) => todoId],
  (todos, todoId) => todos.find(todo => todo.id === todoId)
);

// Usage
function TodoList() {
  const filteredTodos = useSelector(selectFilteredTodos);
  return (
    <ul>
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
```

### Redux Normalization / Chuẩn Hóa Redux

**English:** Normalize nested data structures to improve performance and simplify updates.

**Tiếng Việt:** Chuẩn hóa cấu trúc dữ liệu lồng nhau để cải thiện hiệu suất và đơn giản hóa cập nhật.

```typescript
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
}

// Create entity adapter
const usersAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name)
});

const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState({
    loading: false,
    error: null
  }),
  reducers: {
    userAdded: usersAdapter.addOne,
    usersReceived: usersAdapter.setAll,
    userUpdated: usersAdapter.updateOne,
    userRemoved: usersAdapter.removeOne
  }
});

// Selectors
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds
} = usersAdapter.getSelectors((state: RootState) => state.users);

// Usage
function UserList() {
  const users = useSelector(selectAllUsers);
  const dispatch = useDispatch();
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
          <button onClick={() => dispatch(userRemoved(user.id))}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

---

## Advanced Zustand Patterns / Mẫu Zustand Nâng Cao

### Zustand with Middleware / Zustand với Middleware

```typescript
import create from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface TodoStore {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

// With persistence and devtools
const useTodoStore = create<TodoStore>()(
  devtools(
    persist(
      immer((set) => ({
        todos: [],
        
        addTodo: (text) => set((state) => {
          state.todos.push({
            id: crypto.randomUUID(),
            text,
            completed: false
          });
        }),
        
        toggleTodo: (id) => set((state) => {
          const todo = state.todos.find(t => t.id === id);
          if (todo) {
            todo.completed = !todo.completed;
          }
        }),
        
        deleteTodo: (id) => set((state) => {
          state.todos = state.todos.filter(t => t.id !== id);
        })
      })),
      { name: 'todo-storage' }
    )
  )
);
```

### Zustand Slices / Phân Đoạn Zustand

```typescript
// Split store into slices
interface UserSlice {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

interface SettingsSlice {
  theme: 'light' | 'dark';
  language: string;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: string) => void;
}

const createUserSlice = (set): UserSlice => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null })
});

const createSettingsSlice = (set): SettingsSlice => ({
  theme: 'light',
  language: 'en',
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language })
});

// Combine slices
const useStore = create<UserSlice & SettingsSlice>()((...a) => ({
  ...createUserSlice(...a),
  ...createSettingsSlice(...a)
}));

// Usage with selectors
function UserProfile() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  
  return <div>{user?.name}</div>;
}

function ThemeToggle() {
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}
```

---

## Jotai - Atomic State Management

**English:** Jotai provides primitive and flexible state management with an atomic approach.

**Tiếng Việt:** Jotai cung cấp quản lý trạng thái nguyên thủy và linh hoạt với cách tiếp cận atomic.

```typescript
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

// Primitive atoms
const countAtom = atom(0);
const nameAtom = atom('');

// Derived atoms
const doubleCountAtom = atom((get) => get(countAtom) * 2);

// Write-only atoms
const incrementAtom = atom(
  null,
  (get, set) => set(countAtom, get(countAtom) + 1)
);

// Async atoms
const userAtom = atom(async (get) => {
  const userId = get(userIdAtom);
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
});

// Usage
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const doubleCount = useAtomValue(doubleCountAtom);
  const increment = useSetAtom(incrementAtom);
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Double: {doubleCount}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

---

## Recoil - Facebook's State Management

**English:** Recoil provides a graph-based state management solution with fine-grained reactivity.

**Tiếng Việt:** Recoil cung cấp giải pháp quản lý trạng thái dựa trên đồ thị với khả năng phản ứng chi tiết.

```typescript
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';

// Atoms
const todoListState = atom({
  key: 'todoListState',
  default: []
});

const todoListFilterState = atom({
  key: 'todoListFilterState',
  default: 'all'
});

// Selectors
const filteredTodoListState = selector({
  key: 'filteredTodoListState',
  get: ({ get }) => {
    const filter = get(todoListFilterState);
    const list = get(todoListState);
    
    switch (filter) {
      case 'completed':
        return list.filter(item => item.completed);
      case 'active':
        return list.filter(item => !item.completed);
      default:
        return list;
    }
  }
});

const todoListStatsState = selector({
  key: 'todoListStatsState',
  get: ({ get }) => {
    const todoList = get(todoListState);
    const totalNum = todoList.length;
    const totalCompletedNum = todoList.filter(item => item.completed).length;
    const totalUncompletedNum = totalNum - totalCompletedNum;
    const percentCompleted = totalNum === 0 ? 0 : totalCompletedNum / totalNum * 100;
    
    return {
      totalNum,
      totalCompletedNum,
      totalUncompletedNum,
      percentCompleted
    };
  }
});

// Usage
function TodoList() {
  const todoList = useRecoilValue(filteredTodoListState);
  const [filter, setFilter] = useRecoilState(todoListFilterState);
  
  return (
    <div>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
      <ul>
        {todoList.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}

function TodoStats() {
  const stats = useRecoilValue(todoListStatsState);
  
  return (
    <div>
      <p>Total: {stats.totalNum}</p>
      <p>Completed: {stats.totalCompletedNum}</p>
      <p>Progress: {stats.percentCompleted.toFixed(0)}%</p>
    </div>
  );
}
```

---

## State Management Comparison / So Sánh Quản Lý Trạng Thái

### When to Use Each Solution / Khi Nào Sử Dụng Mỗi Giải Pháp

**Context API:**
- ✅ Simple global state
- ✅ Theme, locale, auth
- ✅ Small to medium apps
- ❌ Frequent updates
- ❌ Complex state logic

**Redux:**
- ✅ Complex state logic
- ✅ Time-travel debugging
- ✅ Large applications
- ✅ Predictable state updates
- ❌ Boilerplate (mitigated by Redux Toolkit)
- ❌ Learning curve

**Zustand:**
- ✅ Minimal boilerplate
- ✅ Simple API
- ✅ Good performance
- ✅ No providers needed
- ❌ Less ecosystem
- ❌ No time-travel debugging

**Jotai:**
- ✅ Atomic approach
- ✅ Bottom-up architecture
- ✅ TypeScript support
- ✅ Minimal re-renders
- ❌ Newer library
- ❌ Smaller community

**Recoil:**
- ✅ Fine-grained reactivity
- ✅ Async support
- ✅ Graph-based
- ✅ Facebook backing
- ❌ Still experimental
- ❌ API may change

---

## Performance Optimization / Tối Ưu Hóa Hiệu Suất

### Selector Optimization / Tối Ưu Hóa Selector

```typescript
// ❌ Bad: Creates new array every time
function TodoList() {
  const todos = useSelector((state: RootState) => 
    state.todos.filter(todo => !todo.completed)
  );
  // Component re-renders even if filtered result is the same
}

// ✅ Good: Memoized selector
const selectActiveTodos = createSelector(
  [(state: RootState) => state.todos],
  (todos) => todos.filter(todo => !todo.completed)
);

function TodoList() {
  const todos = useSelector(selectActiveTodos);
  // Only re-renders when active todos actually change
}
```

### Zustand Selector Optimization

```typescript
// ❌ Bad: Subscribes to entire store
function Component() {
  const store = useStore();
  return <div>{store.user.name}</div>;
  // Re-renders on any store change
}

// ✅ Good: Selective subscription
function Component() {
  const userName = useStore((state) => state.user.name);
  return <div>{userName}</div>;
  // Only re-renders when user.name changes
}

// ✅ Better: Shallow equality
import shallow from 'zustand/shallow';

function Component() {
  const { name, email } = useStore(
    (state) => ({ name: state.user.name, email: state.user.email }),
    shallow
  );
  return <div>{name} - {email}</div>;
}
```

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### Q1: What is prop drilling and how do you solve it? — 🟢 [Junior]

**English Answer:**
Prop drilling is passing props through multiple component layers to reach a deeply nested component. Solutions:
1. Context API for global state
2. State management libraries (Redux, Zustand)
3. Component composition
4. Render props or custom hooks

**Tiếng Việt:**
Prop drilling là việc truyền props qua nhiều lớp component để đến component lồng sâu. Giải pháp:
1. Context API cho trạng thái toàn cục
2. Thư viện quản lý trạng thái (Redux, Zustand)
3. Kết hợp component
4. Render props hoặc custom hooks

### Q2: Redux vs Context API - when to use each? — 🟡 [Mid]

**English Answer:**
- **Context API**: Simple global state, theme, auth, small apps
- **Redux**: Complex state logic, time-travel debugging, large apps, middleware needs

**Key differences:**
- Redux has better DevTools
- Context causes re-renders of all consumers
- Redux has middleware ecosystem
- Context is built into React

**Tiếng Việt:**
- **Context API**: Trạng thái toàn cục đơn giản, theme, auth, ứng dụng nhỏ
- **Redux**: Logic trạng thái phức tạp, gỡ lỗi time-travel, ứng dụng lớn, cần middleware

### Q3: How does Redux middleware work? — 🟡 [Mid]

**English Answer:**
Middleware provides a third-party extension point between dispatching an action and the moment it reaches the reducer. It's a chain of functions with signature:
```typescript
const middleware = (store) => (next) => (action) => {
  // Before reducer
  const result = next(action);
  // After reducer
  return result;
};
```

Common use cases:
- Logging
- Async actions (thunk, saga)
- Analytics
- Error reporting

### Q4: What are selectors and why use them? — 🟢 [Junior]

**English Answer:**
Selectors are functions that extract and compute derived data from the store. Benefits:
1. **Encapsulation**: Hide store structure
2. **Memoization**: Prevent unnecessary recalculations
3. **Composability**: Build complex selectors from simple ones
4. **Testability**: Easy to unit test

```typescript
const selectCompletedTodos = createSelector(
  [selectTodos],
  (todos) => todos.filter(todo => todo.completed)
);
```

### Q5: How do you handle async actions in Redux? — 🔴 [Senior]

**English Answer:**
Three main approaches:

1. **Redux Thunk**: Dispatch functions instead of actions
```typescript
const fetchUser = (id) => async (dispatch) => {
  dispatch({ type: 'FETCH_START' });
  try {
    const user = await api.fetchUser(id);
    dispatch({ type: 'FETCH_SUCCESS', payload: user });
  } catch (error) {
    dispatch({ type: 'FETCH_ERROR', payload: error });
  }
};
```

2. **Redux Toolkit createAsyncThunk**: Built-in async handling
3. **Redux Saga**: Generator-based side effects

---

## Best Practices / Thực Hành Tốt Nhất

### State Structure / Cấu Trúc Trạng Thái

**English:**
1. **Normalize nested data**: Use entity adapters
2. **Keep state minimal**: Derive data with selectors
3. **Separate UI state from server state**: Consider React Query
4. **Use TypeScript**: Type safety for state and actions
5. **Organize by feature**: Co-locate related code

**Tiếng Việt:**
1. **Chuẩn hóa dữ liệu lồng nhau**: Sử dụng entity adapters
2. **Giữ state tối thiểu**: Suy ra dữ liệu với selectors
3. **Tách UI state khỏi server state**: Xem xét React Query
4. **Sử dụng TypeScript**: Type safety cho state và actions
5. **Tổ chức theo tính năng**: Đặt code liên quan gần nhau

### Performance Tips / Mẹo Hiệu Suất

```typescript
// 1. Use shallow equality for objects
import shallow from 'zustand/shallow';

const { name, email } = useStore(
  (state) => ({ name: state.name, email: state.email }),
  shallow
);

// 2. Split selectors
const name = useSelector((state) => state.user.name);
const email = useSelector((state) => state.user.email);
// Better than: const user = useSelector((state) => state.user);

// 3. Memoize expensive computations
const expensiveData = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// 4. Use React.memo for components
const TodoItem = React.memo(({ todo }) => {
  return <li>{todo.text}</li>;
});
```

---

## Key Takeaways / Điểm Chính

**English:**
1. Choose state management based on app complexity
2. Context API for simple global state
3. Redux for complex state with time-travel debugging
4. Zustand for lightweight, minimal boilerplate
5. Jotai/Recoil for atomic state management
6. Use selectors for derived data and memoization
7. Normalize nested data structures
8. Optimize with selective subscriptions
9. Consider React Query for server state
10. Type your state with TypeScript

**Tiếng Việt:**
1. Chọn quản lý trạng thái dựa trên độ phức tạp ứng dụng
2. Context API cho trạng thái toàn cục đơn giản
3. Redux cho trạng thái phức tạp với gỡ lỗi time-travel
4. Zustand cho lightweight, ít boilerplate
5. Jotai/Recoil cho quản lý trạng thái atomic
6. Sử dụng selectors cho dữ liệu suy ra và memoization
7. Chuẩn hóa cấu trúc dữ liệu lồng nhau
8. Tối ưu hóa với selective subscriptions
9. Xem xét React Query cho server state
10. Type state với TypeScript

---

[← Previous: Advanced Patterns](./04-advanced-patterns.md) | [Back to Table of Contents](../../00-table-of-contents.md)
