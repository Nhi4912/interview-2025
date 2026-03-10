# State Management Theory - Complete Guide
# Lý Thuyết Quản Lý State - Hướng Dẫn Đầy Đủ

## Table of Contents / Mục Lục

### Part 1: State Management Fundamentals
1. What is State?
2. State vs Props vs Context
3. State Lifecycle
4. State Synchronization
5. State Persistence

### Part 2: State Management Patterns
6. Flux Architecture
7. Redux Pattern
8. MobX Pattern
9. Atomic State (Recoil/Jotai)
10. Signal-based State

### Part 3: State Management Strategies
11. Local vs Global State
12. Server State vs Client State
13. Derived State
14. Normalized State
15. Optimistic Updates

### Part 4: Advanced Concepts
16. Time Travel Debugging
17. State Machines
18. Event Sourcing
19. CQRS Pattern
20. State Hydration

---

## Part 1: State Management Fundamentals

### 1. What is State?
### 1. State Là Gì?

**English:**

State is data that changes over time and affects what is rendered on the screen. Understanding state is fundamental to building interactive applications.

**State Definition:**

State represents the current condition or mode of an application at any given moment. It's the data that:
1. Changes over time
2. Affects the UI
3. Can be modified by user interactions
4. Persists across renders (in React)

**Types of State:**

**1. UI State:**
- Visual state of components
- Modal open/closed
- Form input values
- Selected items
- Loading indicators
- Error messages

**2. Application State:**
- User authentication status
- User preferences
- Shopping cart contents
- Current route/page
- Feature flags

**3. Server State:**
- Data fetched from API
- Cached responses
- Synchronization status
- Optimistic updates

**4. Form State:**
- Field values
- Validation errors
- Touched fields
- Submission status
- Dirty state

**5. Navigation State:**
- Current route
- History stack
- Query parameters
- Route parameters

**State Characteristics:**

**Mutable vs Immutable:**

**Mutable State:**
- Can be changed directly
- Harder to track changes
- Can cause bugs
- Not recommended in React

**Immutable State:**
- Cannot be changed directly
- Must create new state
- Easier to track changes
- Recommended in React

**Theory: Why Immutability?**

Immutability provides:
1. **Predictability**: State changes are explicit
2. **Time travel**: Can replay state changes
3. **Performance**: Easy to detect changes (reference equality)
4. **Debugging**: Can track state history
5. **Concurrency**: Safe to share across threads

**State Ownership:**

State can be owned by:
1. **Component**: Local state (useState, useReducer)
2. **Context**: Shared state (Context API)
3. **Store**: Global state (Redux, Zustand)
4. **URL**: Navigation state (React Router)
5. **Server**: Remote state (React Query, SWR)

**Theory: Single Source of Truth**

Each piece of state should have a single source of truth:
- Don't duplicate state
- Derive what you can
- Lift state up when needed
- Keep state close to where it's used

**State Granularity:**

**Coarse-grained State:**
- Large state objects
- Fewer updates
- More re-renders
- Simpler to manage

**Fine-grained State:**
- Small state pieces
- More updates
- Fewer re-renders
- More complex to manage

**Theory: Granularity Trade-offs**

Coarse-grained:
- Pros: Simple, fewer subscriptions
- Cons: Unnecessary re-renders

Fine-grained:
- Pros: Optimal re-renders
- Cons: Complex, many subscriptions

**State Initialization:**

State can be initialized:
1. **Static**: Fixed initial value
2. **Dynamic**: Computed initial value
3. **Lazy**: Computed on first access
4. **From props**: Derived from props
5. **From URL**: Read from query params
6. **From storage**: Read from localStorage/sessionStorage
7. **From server**: Fetched from API

**Theory: Initialization Strategies**

Choose initialization based on:
- **Cost**: Expensive computations should be lazy
- **Timing**: When data is available
- **Source**: Where data comes from
- **Frequency**: How often component mounts

**Vietnamese:**

State là data thay đổi theo thời gian và ảnh hưởng đến những gì được render trên màn hình.

**Định Nghĩa State:**

State đại diện cho điều kiện hoặc mode hiện tại của application tại bất kỳ thời điểm nào. Đó là data:
1. Thay đổi theo thời gian
2. Ảnh hưởng UI
3. Có thể modified bởi user interactions
4. Persist qua renders (trong React)

**Loại State:**

1. **UI State**: Visual state của components
2. **Application State**: User auth, preferences, cart
3. **Server State**: Data từ API
4. **Form State**: Field values, validation
5. **Navigation State**: Current route, history

**Đặc Điểm State:**

**Mutable vs Immutable:**

Immutable state:
- Không thể thay đổi trực tiếp
- Phải tạo state mới
- Dễ track changes
- Recommended trong React

**Lý Thuyết: Tại Sao Immutability?**

Immutability cung cấp:
1. **Predictability**: State changes tường minh
2. **Time travel**: Có thể replay changes
3. **Performance**: Dễ detect changes
4. **Debugging**: Track state history
5. **Concurrency**: Safe để share

**State Ownership:**

State có thể owned bởi:
1. Component (local)
2. Context (shared)
3. Store (global)
4. URL (navigation)
5. Server (remote)

**Single Source of Truth:**

Mỗi piece of state nên có single source of truth:
- Không duplicate state
- Derive những gì có thể
- Lift state up khi cần
- Giữ state gần nơi dùng

---

### 2. State vs Props vs Context
### 2. State vs Props vs Context

**English:**

Understanding the differences between state, props, and context is crucial for effective React development.

**State:**

**Characteristics:**
- Owned by component
- Mutable (through setState)
- Private to component
- Triggers re-render when changed
- Persists across renders
- Can be passed as props

**Use Cases:**
- Component-specific data
- User input
- Toggle states
- Counters
- Form values

**Theory: State Locality**

State should be:
- As local as possible
- Lifted only when needed
- Not duplicated
- Derived when possible

**Props:**

**Characteristics:**
- Passed from parent
- Immutable (read-only)
- Public interface
- Can trigger re-render when changed
- Flow downward (unidirectional)
- Can be any type

**Use Cases:**
- Configuration
- Data from parent
- Callbacks
- Render props
- Component composition

**Theory: Props Flow**

Props flow in one direction:
```
Parent (owns state)
    ↓ props
Child (receives props)
    ↓ props
Grandchild (receives props)
```

Benefits:
- Predictable data flow
- Easier debugging
- Clear dependencies
- Testable components

**Context:**

**Characteristics:**
- Shared across tree
- Avoids prop drilling
- Can trigger re-render
- Global or scoped
- Provider-Consumer pattern

**Use Cases:**
- Theme
- Authentication
- Language/i18n
- User preferences
- Global settings

**Theory: Context Propagation**

Context provides data to all descendants:
```
Provider (provides value)
    ↓
Consumer (uses value)
    ↓
Consumer (uses value)
```

**Comparison:**

| Feature | State | Props | Context |
|---------|-------|-------|---------|
| Ownership | Component | Parent | Provider |
| Mutability | Mutable | Immutable | Immutable |
| Scope | Local | Parent-Child | Tree |
| Re-render | Yes | Yes | Yes |
| Direction | N/A | Down | Down |
| Use Case | Local data | Config | Global data |

**When to Use Each:**

**Use State when:**
- Data belongs to component
- Data changes over time
- Data doesn't need to be shared
- Component controls the data

**Use Props when:**
- Data comes from parent
- Data is configuration
- Component doesn't own data
- Clear parent-child relationship

**Use Context when:**
- Data needed by many components
- Prop drilling becomes tedious
- Data is truly global
- Data changes infrequently

**Theory: The Prop Drilling Problem**

Prop drilling occurs when:
1. Data needed deep in tree
2. Intermediate components don't use data
3. Must pass props through many levels
4. Becomes hard to maintain

**Solutions:**
1. **Context**: Share data globally
2. **Composition**: Pass components instead of data
3. **State management**: Redux, Zustand, etc.

**State + Props Pattern:**

Common pattern: State in parent, props to children

```
Parent:
- Owns state
- Passes state as props
- Passes setState as props

Child:
- Receives state via props
- Receives callbacks via props
- Calls callbacks to update state
```

**Theory: Lifting State Up**

When multiple components need same state:
1. Find common ancestor
2. Move state to ancestor
3. Pass state and callbacks as props
4. Children become controlled components

**Context + State Pattern:**

Combine context with state management:

```
Provider:
- Owns state (useState/useReducer)
- Provides state via context
- Provides dispatch/setState via context

Consumer:
- Reads state from context
- Calls dispatch/setState to update
```

**Theory: Context Performance**

Context has performance implications:
- All consumers re-render on change
- Can't subscribe to part of context
- Need to split contexts or memoize

**Solutions:**
1. **Split contexts**: Separate concerns
2. **Memoization**: useMemo for context value
3. **Selectors**: Use state management library
4. **Separate state/dispatch**: Prevent unnecessary re-renders

**Vietnamese:**

Hiểu sự khác biệt giữa state, props, và context rất quan trọng cho React development hiệu quả.

**State:**

**Đặc điểm:**
- Owned bởi component
- Mutable (qua setState)
- Private cho component
- Trigger re-render khi thay đổi
- Persist qua renders

**Props:**

**Đặc điểm:**
- Passed từ parent
- Immutable (read-only)
- Public interface
- Có thể trigger re-render
- Flow downward

**Context:**

**Đặc điểm:**
- Shared across tree
- Tránh prop drilling
- Có thể trigger re-render
- Global hoặc scoped
- Provider-Consumer pattern

**So Sánh:**

| Tính năng | State | Props | Context |
|-----------|-------|-------|---------|
| Ownership | Component | Parent | Provider |
| Mutability | Mutable | Immutable | Immutable |
| Scope | Local | Parent-Child | Tree |
| Re-render | Có | Có | Có |

**Khi Nào Dùng:**

**State**: Data thuộc component, thay đổi theo thời gian
**Props**: Data từ parent, configuration
**Context**: Data global, nhiều components cần

**Prop Drilling Problem:**

Xảy ra khi:
1. Data cần deep trong tree
2. Intermediate components không dùng data
3. Phải pass props qua nhiều levels
4. Khó maintain

**Giải pháp:**
1. Context
2. Composition
3. State management library

---

### 3. State Lifecycle
### 3. Vòng Đời State

**English:**

State has a lifecycle from initialization to destruction. Understanding this lifecycle helps manage state effectively.

**State Lifecycle Phases:**

**1. Initialization:**
- State is created
- Initial value is set
- Component mounts

**2. Updates:**
- State changes
- Component re-renders
- Effects run

**3. Destruction:**
- Component unmounts
- State is destroyed
- Cleanup runs

**Initialization Phase:**

**Static Initialization:**
```javascript
const [count, setCount] = useState(0);
// count = 0 on every mount
```

**Lazy Initialization:**
```javascript
const [count, setCount] = useState(() => {
  // Expensive computation
  return computeInitialValue();
});
// Computed only once on mount
```

**Theory: Lazy Initialization Benefits**

Lazy initialization:
- Runs only once
- Avoids expensive computations on re-renders
- Useful for reading from storage
- Useful for complex calculations

**Update Phase:**

**Synchronous Updates:**
```javascript
setCount(count + 1);
// State updated synchronously in event handlers
```

**Asynchronous Updates:**
```javascript
setTimeout(() => {
  setCount(count + 1);
}, 1000);
// State updated asynchronously
```

**Batched Updates:**
```javascript
setCount(count + 1);
setName('John');
setAge(30);
// All updates batched into single re-render (React 18+)
```

**Theory: Batching**

React batches updates for performance:
- Multiple setState calls in same event
- Batched into single re-render
- Reduces unnecessary renders
- Improves performance

**React 18 Automatic Batching:**
- Batches in event handlers (always)
- Batches in promises (new)
- Batches in setTimeout (new)
- Batches in native events (new)

**Functional Updates:**

```javascript
// Problem: Stale closure
setCount(count + 1);
setCount(count + 1);
// count increases by 1, not 2

// Solution: Functional update
setCount(c => c + 1);
setCount(c => c + 1);
// count increases by 2
```

**Theory: Why Functional Updates?**

Functional updates:
- Always use latest state
- Avoid stale closures
- Safe for async updates
- Composable

**Destruction Phase:**

**Cleanup:**
```javascript
useEffect(() => {
  // Setup
  const subscription = subscribe();
  
  // Cleanup
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

**Theory: Cleanup Importance**

Cleanup prevents:
- Memory leaks
- Stale subscriptions
- Duplicate event listeners
- Zombie components

**State Persistence:**

State can persist across:
1. **Renders**: Default behavior
2. **Unmounts**: Using key prop
3. **Page reloads**: Using storage
4. **Sessions**: Using sessionStorage
5. **Permanently**: Using localStorage/database

**Theory: State Persistence Strategies**

**In-Memory:**
- Fast
- Lost on unmount
- Use for temporary state

**Storage:**
- Persists across reloads
- Slower
- Use for user preferences

**Server:**
- Persists permanently
- Requires network
- Use for important data

**State Hydration:**

Hydration is restoring state from storage:

```javascript
const [state, setState] = useState(() => {
  const saved = localStorage.getItem('state');
  return saved ? JSON.parse(saved) : initialState;
});

useEffect(() => {
  localStorage.setItem('state', JSON.stringify(state));
}, [state]);
```

**Theory: Hydration Challenges**

Challenges:
- Serialization (can't store functions)
- Versioning (state shape changes)
- Security (don't store sensitive data)
- Size limits (storage has limits)

**Vietnamese:**

State có lifecycle từ initialization đến destruction. Hiểu lifecycle này giúp quản lý state hiệu quả.

**Phases:**

**1. Initialization:**
- State được tạo
- Initial value được set
- Component mounts

**2. Updates:**
- State thay đổi
- Component re-renders
- Effects chạy

**3. Destruction:**
- Component unmounts
- State bị destroy
- Cleanup chạy

**Lazy Initialization:**

Lazy initialization:
- Chạy chỉ một lần
- Tránh expensive computations trên re-renders
- Hữu ích cho reading từ storage
- Hữu ích cho complex calculations

**Batching:**

React batch updates cho performance:
- Multiple setState calls trong cùng event
- Batched thành single re-render
- Giảm unnecessary renders
- Cải thiện performance

**Functional Updates:**

Functional updates:
- Luôn dùng latest state
- Tránh stale closures
- Safe cho async updates
- Composable

**Cleanup:**

Cleanup ngăn:
- Memory leaks
- Stale subscriptions
- Duplicate event listeners
- Zombie components

**State Persistence:**

State có thể persist qua:
1. Renders (default)
2. Unmounts (dùng key)
3. Page reloads (dùng storage)
4. Sessions (sessionStorage)
5. Permanently (localStorage/database)

