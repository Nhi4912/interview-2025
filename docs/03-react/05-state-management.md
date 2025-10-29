# State Management / Quản Lý Trạng Thái
## React - Chapter 5 / React - Chương 5

[← Previous: Advanced Patterns](./04-advanced-patterns.md) | [Back to Table of Contents](../00-table-of-contents.md)

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

## Key Takeaways / Điểm Chính

**English:**
1. Context API for simple global state
2. Redux for complex state with time-travel debugging
3. Zustand for lightweight state management
4. Choose based on application complexity
5. Avoid prop drilling with proper state management

**Tiếng Việt:**
1. Context API cho trạng thái toàn cục đơn giản
2. Redux cho trạng thái phức tạp với gỡ lỗi time-travel
3. Zustand cho quản lý trạng thái nhẹ
4. Chọn dựa trên độ phức tạp ứng dụng
5. Tránh prop drilling với quản lý trạng thái phù hợp

---

[← Previous: Advanced Patterns](./04-advanced-patterns.md) | [Back to Table of Contents](../00-table-of-contents.md)
