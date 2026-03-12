# Architecture Patterns - MVC, Flux & Micro-Frontends

> Hiểu các patterns kiến trúc frontend giúp đưa ra quyết định thiết kế đúng đắn.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND ARCHITECTURES                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   EVOLUTION:                                                    │
│   ──────────                                                     │
│                                                                   │
│   MVC          ──▶  Traditional, server-rendered                │
│       │                                                          │
│       ▼                                                          │
│   MVVM         ──▶  Two-way binding (Angular, Vue)              │
│       │                                                          │
│       ▼                                                          │
│   Flux/Redux   ──▶  Unidirectional, predictable                 │
│       │                                                          │
│       ▼                                                          │
│   Component    ──▶  Modern React/Vue patterns                   │
│       │                                                          │
│       ▼                                                          │
│   Micro-FE     ──▶  Independent, scalable teams                 │
│                                                                   │
│   NO "BEST" ARCHITECTURE - Choose based on:                     │
│   • Team size and structure                                     │
│   • Application complexity                                      │
│   • Performance requirements                                    │
│   • Existing infrastructure                                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📖 MVC Pattern

### What is MVC

```
┌─────────────────────────────────────────────────────────────────┐
│                    MODEL-VIEW-CONTROLLER                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│        ┌──────────────────────────────────────────┐             │
│        │                  USER                     │             │
│        └──────────────────────┬───────────────────┘             │
│                               │                                  │
│                          interacts                               │
│                               │                                  │
│                               ▼                                  │
│        ┌──────────────────────────────────────────┐             │
│        │              CONTROLLER                   │             │
│        │   • Handles user input                    │             │
│        │   • Updates Model                         │             │
│        │   • Selects View                          │             │
│        └───────────┬──────────────────┬───────────┘             │
│                    │                  │                          │
│               updates             selects                        │
│                    │                  │                          │
│                    ▼                  ▼                          │
│   ┌────────────────────┐    ┌────────────────────┐              │
│   │       MODEL        │    │        VIEW        │              │
│   │   • Data           │───▶│   • Display        │              │
│   │   • Business logic │    │   • UI rendering   │              │
│   │   • State          │    │                    │              │
│   └────────────────────┘    └────────────────────┘              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### MVC in Frontend

```javascript
// Traditional MVC Example

// Model - Data and business logic
class TodoModel {
    constructor() {
        this.todos = [];
        this.listeners = [];
    }

    addTodo(text) {
        this.todos.push({ id: Date.now(), text, completed: false });
        this.notify();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.notify();
        }
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach(l => l(this.todos));
    }
}

// View - UI rendering
class TodoView {
    constructor(container) {
        this.container = container;
    }

    render(todos) {
        this.container.innerHTML = `
            <ul>
                ${todos.map(todo => `
                    <li data-id="${todo.id}" class="${todo.completed ? 'done' : ''}">
                        ${todo.text}
                    </li>
                `).join('')}
            </ul>
        `;
    }

    bindToggle(handler) {
        this.container.addEventListener('click', (e) => {
            if (e.target.tagName === 'LI') {
                handler(parseInt(e.target.dataset.id));
            }
        });
    }
}

// Controller - Coordinates Model and View
class TodoController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Connect model changes to view
        this.model.subscribe((todos) => this.view.render(todos));

        // Connect view events to model
        this.view.bindToggle((id) => this.model.toggleTodo(id));
    }
}
```

### MVC Trade-offs

```
┌─────────────────────────────────────────────────────────────────┐
│                    MVC PROS AND CONS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   PROS:                                                         │
│   ─────                                                          │
│   ✓ Clear separation of concerns                                │
│   ✓ Easy to understand                                          │
│   ✓ Well-established pattern                                    │
│   ✓ Good for server-rendered apps                               │
│                                                                   │
│   CONS:                                                         │
│   ─────                                                          │
│   ✗ Controller can become bloated                               │
│   ✗ Hard to track data flow in complex apps                     │
│   ✗ View can directly access Model (tight coupling)             │
│   ✗ Not ideal for modern SPA requirements                       │
│                                                                   │
│   BEST FOR:                                                     │
│   ─────────                                                      │
│   • Server-side rendered applications                           │
│   • Simple CRUD apps                                            │
│   • When team is familiar with pattern                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flux & Redux

### Flux Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUX ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│              UNIDIRECTIONAL DATA FLOW                           │
│                                                                   │
│   ┌──────────┐    ┌────────────┐    ┌─────────┐    ┌──────────┐│
│   │  ACTION  │───▶│ DISPATCHER │───▶│  STORE  │───▶│   VIEW   ││
│   └──────────┘    └────────────┘    └─────────┘    └──────────┘│
│        ▲                                                │       │
│        │                                                │       │
│        └────────────────────────────────────────────────┘       │
│                         User Interaction                         │
│                                                                   │
│   ACTION:                                                       │
│   • Plain object describing what happened                       │
│   • { type: 'ADD_TODO', payload: 'Learn Flux' }                │
│                                                                   │
│   DISPATCHER:                                                   │
│   • Central hub that receives all actions                       │
│   • Broadcasts to all registered stores                         │
│                                                                   │
│   STORE:                                                        │
│   • Holds application state                                     │
│   • Only way to update is through actions                       │
│   • Emits change events                                         │
│                                                                   │
│   VIEW:                                                         │
│   • Subscribes to store changes                                 │
│   • Dispatches actions on user interaction                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Redux Implementation

```typescript
// Redux pattern implementation

// Actions
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';

interface AddTodoAction {
    type: typeof ADD_TODO;
    payload: { text: string };
}

interface ToggleTodoAction {
    type: typeof TOGGLE_TODO;
    payload: { id: number };
}

type TodoAction = AddTodoAction | ToggleTodoAction;

// Action creators
const addTodo = (text: string): AddTodoAction => ({
    type: ADD_TODO,
    payload: { text }
});

const toggleTodo = (id: number): ToggleTodoAction => ({
    type: TOGGLE_TODO,
    payload: { id }
});

// Reducer - pure function
interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

interface TodoState {
    todos: Todo[];
    nextId: number;
}

const initialState: TodoState = {
    todos: [],
    nextId: 1
};

function todoReducer(
    state = initialState,
    action: TodoAction
): TodoState {
    switch (action.type) {
        case ADD_TODO:
            return {
                ...state,
                todos: [
                    ...state.todos,
                    {
                        id: state.nextId,
                        text: action.payload.text,
                        completed: false
                    }
                ],
                nextId: state.nextId + 1
            };

        case TOGGLE_TODO:
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload.id
                        ? { ...todo, completed: !todo.completed }
                        : todo
                )
            };

        default:
            return state;
    }
}

// Selectors
const selectTodos = (state: TodoState) => state.todos;
const selectCompletedTodos = (state: TodoState) =>
    state.todos.filter(t => t.completed);
```

### Modern Redux (Redux Toolkit)

```typescript
// Redux Toolkit - Modern approach
import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

const todoSlice = createSlice({
    name: 'todos',
    initialState: [] as Todo[],
    reducers: {
        addTodo: {
            reducer: (state, action: PayloadAction<Todo>) => {
                state.push(action.payload);
            },
            prepare: (text: string) => ({
                payload: {
                    id: Date.now(),
                    text,
                    completed: false
                }
            })
        },
        toggleTodo: (state, action: PayloadAction<number>) => {
            const todo = state.find(t => t.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
            }
        },
        removeTodo: (state, action: PayloadAction<number>) => {
            return state.filter(t => t.id !== action.payload);
        }
    }
});

export const { addTodo, toggleTodo, removeTodo } = todoSlice.actions;

const store = configureStore({
    reducer: {
        todos: todoSlice.reducer
    }
});

// Async actions with createAsyncThunk
import { createAsyncThunk } from '@reduxjs/toolkit';

const fetchTodos = createAsyncThunk('todos/fetch', async () => {
    const response = await fetch('/api/todos');
    return response.json();
});
```

---

## 🧩 Component-Based Architecture

### React Component Patterns

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   COMPONENT TYPES:                                              │
│   ────────────────                                               │
│                                                                   │
│   Container (Smart)              Presentational (Dumb)          │
│   • Connected to state           • Receives props               │
│   • Fetches data                 • Pure rendering               │
│   • Handles business logic       • Reusable                     │
│   • Few in application           • Many in application          │
│                                                                   │
│   ─────────────────────────────────────────────────────────────  │
│                                                                   │
│   MODERN APPROACH (Hooks):                                      │
│   ─────────────────────────                                      │
│                                                                   │
│   Custom Hooks                   Components                      │
│   • Extract logic                • Focus on UI                  │
│   • Reusable across components   • Use hooks for logic          │
│   • Test independently           • Easier to test               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

```tsx
// Modern hook-based architecture

// Custom hook for data fetching
function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetchTodos()
            .then(setTodos)
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    const addTodo = useCallback(async (text: string) => {
        const newTodo = await createTodo(text);
        setTodos(prev => [...prev, newTodo]);
    }, []);

    const toggleTodo = useCallback((id: number) => {
        setTodos(prev =>
            prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        );
    }, []);

    return { todos, loading, error, addTodo, toggleTodo };
}

// Component uses the hook
function TodoList() {
    const { todos, loading, error, addTodo, toggleTodo } = useTodos();

    if (loading) return <Spinner />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <div>
            <TodoInput onAdd={addTodo} />
            {todos.map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={() => toggleTodo(todo.id)}
                />
            ))}
        </div>
    );
}
```

### Compound Components

```tsx
// Compound component pattern for flexible APIs

// Parent manages state
const TabsContext = createContext<{
    activeIndex: number;
    setActiveIndex: (i: number) => void;
} | null>(null);

function Tabs({ children, defaultIndex = 0 }) {
    const [activeIndex, setActiveIndex] = useState(defaultIndex);

    return (
        <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
            <div className="tabs">{children}</div>
        </TabsContext.Provider>
    );
}

// Child components use context
function TabList({ children }) {
    return <div role="tablist" className="tab-list">{children}</div>;
}

function Tab({ index, children }) {
    const { activeIndex, setActiveIndex } = useContext(TabsContext)!;
    const isActive = activeIndex === index;

    return (
        <button
            role="tab"
            aria-selected={isActive}
            onClick={() => setActiveIndex(index)}
            className={isActive ? 'active' : ''}
        >
            {children}
        </button>
    );
}

function TabPanels({ children }) {
    const { activeIndex } = useContext(TabsContext)!;
    return <div className="tab-panels">{children[activeIndex]}</div>;
}

function TabPanel({ children }) {
    return <div role="tabpanel">{children}</div>;
}

// Usage - flexible, readable API
<Tabs defaultIndex={0}>
    <TabList>
        <Tab index={0}>Tab 1</Tab>
        <Tab index={1}>Tab 2</Tab>
        <Tab index={2}>Tab 3</Tab>
    </TabList>
    <TabPanels>
        <TabPanel>Content 1</TabPanel>
        <TabPanel>Content 2</TabPanel>
        <TabPanel>Content 3</TabPanel>
    </TabPanels>
</Tabs>
```

---

## 🏢 Micro-Frontends

### What are Micro-Frontends

```
┌─────────────────────────────────────────────────────────────────┐
│                    MICRO-FRONTENDS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   MONOLITH:                                                     │
│   ──────────                                                     │
│   ┌───────────────────────────────────────────────────────────┐ │
│   │                    SINGLE APPLICATION                      │ │
│   │   Header │ Products │ Cart │ Checkout │ Profile            │ │
│   │          One team, one codebase, one deploy                │ │
│   └───────────────────────────────────────────────────────────┘ │
│                                                                   │
│   MICRO-FRONTENDS:                                              │
│   ─────────────────                                              │
│   ┌──────────────────┐ ┌──────────────────┐ ┌─────────────────┐│
│   │     HEADER       │ │     PRODUCTS     │ │      CART       ││
│   │    Team A        │ │     Team B       │ │     Team C      ││
│   │    React         │ │     Vue          │ │     React       ││
│   │    v18           │ │     v3           │ │     v17         ││
│   └──────────────────┘ └──────────────────┘ └─────────────────┘│
│                                                                   │
│   Each micro-frontend:                                          │
│   • Independent team                                            │
│   • Independent deployment                                      │
│   • Independent technology choices                              │
│   • Own CI/CD pipeline                                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Integration Approaches

```
┌─────────────────────────────────────────────────────────────────┐
│                    INTEGRATION STRATEGIES                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. BUILD-TIME INTEGRATION                                     │
│      npm packages, compiled together                            │
│      ─────────────────────────────                               │
│      ✓ Simple                                                   │
│      ✗ Not truly independent deployment                         │
│                                                                   │
│   2. IFRAME INTEGRATION                                         │
│      Each MFE in own iframe                                     │
│      ─────────────────────────                                   │
│      ✓ Complete isolation                                       │
│      ✗ Poor UX, complex communication                           │
│                                                                   │
│   3. SERVER-SIDE COMPOSITION                                    │
│      SSI, ESI, or server stitching                              │
│      ─────────────────────────────                               │
│      ✓ Good SEO                                                 │
│      ✗ Server complexity                                        │
│                                                                   │
│   4. CLIENT-SIDE COMPOSITION (Module Federation)                │
│      Runtime loading of remote modules                          │
│      ─────────────────────────────────────                       │
│      ✓ Independent deploy                                       │
│      ✓ Shared dependencies                                      │
│      ✗ Runtime complexity                                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Module Federation (Webpack 5)

```javascript
// Host application webpack config
// webpack.config.js
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
    plugins: [
        new ModuleFederationPlugin({
            name: 'host',
            remotes: {
                products: 'products@http://localhost:3001/remoteEntry.js',
                cart: 'cart@http://localhost:3002/remoteEntry.js',
            },
            shared: {
                react: { singleton: true },
                'react-dom': { singleton: true },
            },
        }),
    ],
};

// Remote (products) webpack config
module.exports = {
    plugins: [
        new ModuleFederationPlugin({
            name: 'products',
            filename: 'remoteEntry.js',
            exposes: {
                './ProductList': './src/ProductList',
                './ProductDetail': './src/ProductDetail',
            },
            shared: {
                react: { singleton: true },
                'react-dom': { singleton: true },
            },
        }),
    ],
};
```

```tsx
// Host application loading remote components
import React, { Suspense, lazy } from 'react';

// Dynamic import of remote modules
const ProductList = lazy(() => import('products/ProductList'));
const Cart = lazy(() => import('cart/Cart'));

function App() {
    return (
        <div>
            <Header />
            <Suspense fallback={<Loading />}>
                <ProductList />
            </Suspense>
            <Suspense fallback={<Loading />}>
                <Cart />
            </Suspense>
        </div>
    );
}
```

### Micro-Frontend Communication

```typescript
// Cross-MFE communication strategies

// 1. Custom Events
// Publisher
window.dispatchEvent(new CustomEvent('cart:updated', {
    detail: { itemCount: 5 }
}));

// Subscriber
window.addEventListener('cart:updated', (e: CustomEvent) => {
    console.log('Cart updated:', e.detail.itemCount);
});

// 2. Shared State (careful with this)
// Using a shared event bus
class EventBus {
    private events: Map<string, Function[]> = new Map();

    subscribe(event: string, callback: Function) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event)!.push(callback);

        return () => {
            const callbacks = this.events.get(event)!;
            const index = callbacks.indexOf(callback);
            callbacks.splice(index, 1);
        };
    }

    publish(event: string, data: unknown) {
        this.events.get(event)?.forEach(callback => callback(data));
    }
}

// Expose globally
window.__eventBus = new EventBus();

// 3. URL-based state
// Each MFE reads from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get('productId');
```

---

## 📊 Architecture Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE COMPARISON                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Pattern       Team Size    Complexity    Use Case              │
│   ───────────────────────────────────────────────────────────── │
│   MVC           Small        Low           Server-rendered       │
│   Flux/Redux    Medium       Medium        Complex state         │
│   Component     Small-Med    Low-Med       Modern SPAs           │
│   Micro-FE      Large        High          Enterprise, teams     │
│                                                                   │
│   DECISION TREE:                                                │
│   ──────────────                                                 │
│                                                                   │
│   Team > 20 devs? ───Yes───▶ Consider Micro-FE                  │
│        │                                                         │
│       No                                                         │
│        │                                                         │
│        ▼                                                         │
│   Complex state? ───Yes───▶ Redux/Zustand                       │
│        │                                                         │
│       No                                                         │
│        │                                                         │
│        ▼                                                         │
│   Use React hooks + Context                                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: What is unidirectional data flow?**

A: Data flows in one direction: Action → Store → View → Action. Benefits:
- Predictable state changes
- Easier debugging
- Clear data flow

### 🟡 Mid-level

**Q: When would you choose Redux over React Context?**

A:
**Choose Redux when:**
- Complex state with many actions
- Need middleware (async, logging)
- Large application with many connected components
- Team prefers explicit patterns

**Choose Context when:**
- Simple state (theme, auth)
- Few consumers
- Don't need time-travel debugging

### 🔴 Senior

**Q: How would you migrate a monolith to micro-frontends?**

A:
1. **Identify bounded contexts**: Map features to teams
2. **Strangler Fig pattern**: Extract one feature at a time
3. **Start with leaf features**: Less dependencies
4. **Establish shared contracts**: Design system, events
5. **Set up infrastructure**: Module federation, routing
6. **Migrate incrementally**: One MFE at a time
7. **Monitor and adjust**: Performance, DX metrics

---

## 📚 Active Recall

1. [ ] Draw the Flux data flow diagram
2. [ ] What are the pros/cons of micro-frontends?
3. [ ] When would you use compound components pattern?
4. [ ] Explain Module Federation in 3 sentences
5. [ ] Compare container vs presentational components

---

> **Tiếp theo:** [03-state-management-scale.md](./03-state-management-scale.md) - State Management at Scale
