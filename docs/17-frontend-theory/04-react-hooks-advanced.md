# React Hooks Advanced Theory - Deep Dive
# Lý Thuyết React Hooks Nâng Cao - Tìm Hiểu Sâu

## Table of Contents / Mục Lục

### Part 1: Built-in Hooks Deep Dive
1. useState Advanced Patterns
2. useEffect Advanced Patterns
3. useContext Advanced Patterns
4. useReducer Deep Dive
5. useCallback and useMemo Optimization
6. useRef Advanced Use Cases
7. useImperativeHandle
8. useLayoutEffect vs useEffect
9. useDebugValue
10. useId (React 18+)

### Part 2: Custom Hooks Mastery
11. Custom Hooks Design Patterns
12. Hooks Composition
13. Hooks Testing Strategies
14. Common Custom Hooks Library

### Part 3: Advanced Patterns
15. Hooks with TypeScript
16. Performance Optimization with Hooks
17. State Machines with Hooks
18. Async Patterns with Hooks

### Part 4: React 18+ Features
19. useTransition and useDeferredValue
20. Concurrent Features
21. Suspense for Data Fetching
22. Server Components Integration

---

## Part 1: Built-in Hooks Deep Dive

### 1. useState Advanced Patterns
### 1. Patterns Nâng Cao useState

**English:**

Beyond basic usage, useState has powerful patterns for complex state management.

**Functional Updates:**

```javascript
// Problem: Stale closure
function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    setTimeout(() => {
      setCount(count + 1); // Uses stale count!
    }, 1000);
  };
  
  // Click 3 times quickly → count becomes 1, not 3
  return <button onClick={increment}>Count: {count}</button>;
}

// Solution: Functional update
function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    setTimeout(() => {
      setCount(c => c + 1); // Always uses latest count
    }, 1000);
  };
  
  // Click 3 times quickly → count becomes 3
  return <button onClick={increment}>Count: {count}</button>;
}
```


**Lazy Initialization Pattern:**

```javascript
// Expensive initialization
function Component() {
  // ❌ Runs on every render
  const [state, setState] = useState(
    JSON.parse(localStorage.getItem('data')) || []
  );
  
  // ✅ Runs only once
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('data');
    return saved ? JSON.parse(saved) : [];
  });
  
  return <div>{state.length}</div>;
}

// Complex initialization
function useComplexState() {
  const [state, setState] = useState(() => {
    // Heavy computation
    const initialData = processLargeDataset();
    const transformedData = transformData(initialData);
    return {
      data: transformedData,
      metadata: generateMetadata(transformedData),
      timestamp: Date.now()
    };
  });
  
  return [state, setState];
}
```

**State Reducer Pattern:**

```javascript
// Complex state updates
function useStateWithHistory(initialState) {
  const [state, setState] = useState({
    past: [],
    present: initialState,
    future: []
  });
  
  const set = (newPresent) => {
    setState(prev => ({
      past: [...prev.past, prev.present],
      present: newPresent,
      future: []
    }));
  };
  
  const undo = () => {
    setState(prev => {
      if (prev.past.length === 0) return prev;
      
      const newPast = prev.past.slice(0, -1);
      const newPresent = prev.past[prev.past.length - 1];
      
      return {
        past: newPast,
        present: newPresent,
        future: [prev.present, ...prev.future]
      };
    });
  };
  
  const redo = () => {
    setState(prev => {
      if (prev.future.length === 0) return prev;
      
      const newFuture = prev.future.slice(1);
      const newPresent = prev.future[0];
      
      return {
        past: [...prev.past, prev.present],
        present: newPresent,
        future: newFuture
      };
    });
  };
  
  return {
    state: state.present,
    set,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0
  };
}

// Usage
function TextEditor() {
  const {
    state: text,
    set: setText,
    undo,
    redo,
    canUndo,
    canRedo
  } = useStateWithHistory('');
  
  return (
    <div>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
      />
    </div>
  );
}
```

**Derived State Pattern:**

```javascript
// ❌ Anti-pattern: Syncing state
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    // Fetching based on query
    fetchResults(query).then(setResults);
  }, [query]);
  
  return <div>{results.length} results</div>;
}

// ✅ Better: Derive state
function SearchResults({ query }) {
  const [allResults, setAllResults] = useState([]);
  
  // Derived state - no separate state needed
  const filteredResults = allResults.filter(r => 
    r.title.includes(query)
  );
  
  return <div>{filteredResults.length} results</div>;
}

// ✅ Best: useMemo for expensive derivations
function SearchResults({ query }) {
  const [allResults, setAllResults] = useState([]);
  
  const filteredResults = useMemo(() => {
    return allResults.filter(r => r.title.includes(query));
  }, [allResults, query]);
  
  return <div>{filteredResults.length} results</div>;
}
```

**Vietnamese:**

Ngoài cách dùng cơ bản, useState có patterns mạnh mẽ cho quản lý state phức tạp.

**Functional Updates:**

Dùng function thay vì giá trị trực tiếp khi state mới phụ thuộc vào state cũ:

```javascript
// Tránh stale closure
setCount(c => c + 1); // Luôn dùng giá trị mới nhất

// Thay vì
setCount(count + 1); // Có thể dùng giá trị cũ
```

**Lazy Initialization:**

Dùng function để khởi tạo state khi tính toán ban đầu tốn kém:

```javascript
const [state, setState] = useState(() => {
  // Chỉ chạy một lần khi mount
  return expensiveComputation();
});
```

**State Patterns:**

1. **History Pattern**: Undo/Redo functionality
2. **Derived State**: Tính toán từ state khác
3. **Normalized State**: Flat structure cho nested data
4. **Optimistic Updates**: Update UI trước, sync sau

---

### 2. useEffect Advanced Patterns
### 2. Patterns Nâng Cao useEffect

**English:**

useEffect is powerful but tricky. Master these patterns for robust side effects.

**Cleanup Pattern:**

```javascript
// Pattern 1: Event Listeners
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup: Remove listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty deps = mount/unmount only
  
  return size;
}

// Pattern 2: Subscriptions
function useRealtimeData(channel) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const subscription = subscribeToChannel(channel, (newData) => {
      setData(newData);
    });
    
    // Cleanup: Unsubscribe
    return () => {
      subscription.unsubscribe();
    };
  }, [channel]); // Re-subscribe when channel changes
  
  return data;
}

// Pattern 3: Timers
function useInterval(callback, delay) {
  const savedCallback = useRef(callback);
  
  // Remember latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  
  // Set up interval
  useEffect(() => {
    if (delay === null) return;
    
    const id = setInterval(() => {
      savedCallback.current();
    }, delay);
    
    // Cleanup: Clear interval
    return () => clearInterval(id);
  }, [delay]);
}

// Usage
function Timer() {
  const [count, setCount] = useState(0);
  
  useInterval(() => {
    setCount(c => c + 1);
  }, 1000);
  
  return <div>{count}</div>;
}

// Pattern 4: Async Operations
function useAsyncData(url) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });
  
  useEffect(() => {
    const controller = new AbortController();
    
    async function fetchData() {
      try {
        setState(s => ({ ...s, loading: true }));
        
        const response = await fetch(url, {
          signal: controller.signal
        });
        
        const data = await response.json();
        
        setState({
          data,
          loading: false,
          error: null
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          setState({
            data: null,
            loading: false,
            error
          });
        }
      }
    }
    
    fetchData();
    
    // Cleanup: Abort fetch
    return () => {
      controller.abort();
    };
  }, [url]);
  
  return state;
}
```

**Dependency Management:**

```javascript
// ❌ Missing dependencies
function Component({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []); // Missing userId!
  // Won't refetch when userId changes
}

// ✅ Correct dependencies
function Component({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]); // Refetches when userId changes
}

// ❌ Object/Array dependencies
function Component({ config }) {
  useEffect(() => {
    doSomething(config);
  }, [config]); // New object every render!
}

// ✅ Destructure or use specific properties
function Component({ config }) {
  const { apiKey, endpoint } = config;
  
  useEffect(() => {
    doSomething(apiKey, endpoint);
  }, [apiKey, endpoint]);
}

// ✅ Or use useMemo
function Component({ config }) {
  const memoizedConfig = useMemo(() => config, [
    config.apiKey,
    config.endpoint
  ]);
  
  useEffect(() => {
    doSomething(memoizedConfig);
  }, [memoizedConfig]);
}

// ❌ Function dependencies
function Component() {
  const fetchData = () => {
    // fetch logic
  };
  
  useEffect(() => {
    fetchData();
  }, [fetchData]); // New function every render!
}

// ✅ useCallback for function dependencies
function Component() {
  const fetchData = useCallback(() => {
    // fetch logic
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
}

// ✅ Or define inside useEffect
function Component() {
  useEffect(() => {
    function fetchData() {
      // fetch logic
    }
    
    fetchData();
  }, []);
}
```

**Race Condition Prevention:**

```javascript
// ❌ Race condition
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    fetchResults(query).then(data => {
      setResults(data); // May set stale results!
    });
  }, [query]);
  
  // User types "react" → "reactjs"
  // Request 1: "react" (slow)
  // Request 2: "reactjs" (fast)
  // Request 2 completes → shows "reactjs" results
  // Request 1 completes → shows "react" results (wrong!)
}

// ✅ Solution 1: Ignore stale results
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    let ignore = false;
    
    fetchResults(query).then(data => {
      if (!ignore) {
        setResults(data);
      }
    });
    
    return () => {
      ignore = true;
    };
  }, [query]);
}

// ✅ Solution 2: AbortController
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    const controller = new AbortController();
    
    fetch(`/api/search?q=${query}`, {
      signal: controller.signal
    })
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      });
    
    return () => {
      controller.abort();
    };
  }, [query]);
}

// ✅ Solution 3: Latest request tracking
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const requestIdRef = useRef(0);
  
  useEffect(() => {
    const requestId = ++requestIdRef.current;
    
    fetchResults(query).then(data => {
      if (requestId === requestIdRef.current) {
        setResults(data);
      }
    });
  }, [query]);
}
```


**Vietnamese:**

useEffect mạnh mẽ nhưng khó. Thành thạo các patterns này cho side effects robust.

**Cleanup Patterns:**

Cleanup functions chạy:
1. Trước effect tiếp theo (khi dependencies thay đổi)
2. Khi component unmount

**Dependency Management:**

Dependencies array quyết định khi nào effect chạy:
- Không có array: Chạy sau mỗi render
- Empty array []: Chỉ chạy khi mount
- [dep1, dep2]: Chạy khi dependencies thay đổi

**Race Conditions:**

Xảy ra khi nhiều async operations chạy đồng thời và kết quả không theo thứ tự mong đợi.

Giải pháp:
1. Ignore flag
2. AbortController
3. Request ID tracking

---

### 3. useContext Advanced Patterns
### 3. Patterns Nâng Cao useContext

**English:**

Context is powerful but can cause performance issues if not used carefully.

**Context Theory:**

Context provides a way to pass data through the component tree without manually passing props at every level. It's based on the Provider-Consumer pattern.

**How Context Works Internally:**

When you create a context with `createContext()`, React creates:
1. A Provider component that holds the value
2. A Consumer component (or useContext hook) that reads the value
3. A subscription mechanism that notifies consumers when value changes

**Context Update Mechanism:**

```
Provider value changes
    ↓
React compares old and new values (Object.is)
    ↓
If different, notify all consumers
    ↓
All consuming components re-render
    ↓
Their children re-render (unless memoized)
```

**Performance Implications:**

Every time a context value changes, ALL components that consume that context will re-render, regardless of whether they use the changed part of the value. This is why context can be a performance bottleneck.

**Context vs Props:**

Context should be used for:
- Truly global data (theme, auth, language)
- Data needed by many components at different nesting levels
- Data that changes infrequently

Props should be used for:
- Component-specific data
- Data that changes frequently
- Explicit data flow

**Context Composition Pattern:**

Instead of one large context, create multiple small contexts. This allows components to subscribe only to the data they need.

**Theory: Why Multiple Contexts?**

When you have a single context with multiple values:
```
{ user, theme, language, settings }
```

A component that only needs `theme` will still re-render when `user` changes. By splitting into separate contexts, you achieve fine-grained reactivity.

**Context with Reducers:**

Combining context with useReducer provides a Redux-like pattern without external dependencies. This is useful for complex state logic that involves multiple sub-values or when the next state depends on the previous one.

**Theory: Context + Reducer Pattern**

This pattern separates:
1. State (what data we have)
2. Dispatch (how to change data)
3. Selectors (how to read data)

Benefits:
- Predictable state updates
- Easier testing
- Better debugging
- Type safety

**Context Selectors:**

One major limitation of context is that you can't subscribe to only part of the context value. Solutions:

1. **Split contexts**: Separate concerns into different contexts
2. **Use state management library**: Redux, Zustand, Jotai have built-in selectors
3. **Memoization**: Use useMemo to prevent unnecessary re-renders

**Theory: The Context Re-render Problem**

Context triggers re-renders based on referential equality (Object.is). Even if the actual data hasn't changed, if you create a new object/array, all consumers re-render.

Example:
```
// Every render creates new object
const value = { user, setUser };
<Context.Provider value={value}>
```

Solution: Memoize the value
```
const value = useMemo(() => ({ user, setUser }), [user]);
<Context.Provider value={value}>
```

**Advanced Context Patterns:**

**1. Context with Default Values:**

Default values are used when a component consumes context without a Provider ancestor. This is useful for:
- Testing components in isolation
- Providing fallback behavior
- Creating optional contexts

**2. Context with Validation:**

You can add runtime validation to ensure context is used correctly:
- Check if Provider exists
- Validate value shape
- Provide helpful error messages

**3. Context with Middleware:**

Similar to Redux middleware, you can intercept context updates:
- Logging
- Analytics
- Persistence
- Validation

**4. Nested Contexts:**

Contexts can be nested to provide different values at different levels of the tree. The closest Provider wins.

**Theory: Context Propagation**

When a Provider's value changes:
1. React marks all consuming components as needing update
2. During reconciliation, React checks if component actually needs re-render
3. If component is memoized and props haven't changed, skip render
4. But context change bypasses memo - component always re-renders

This is why context updates can be expensive in large apps.

**Context Best Practices:**

1. **Keep context values stable**: Memoize objects/arrays
2. **Split contexts by concern**: Don't put everything in one context
3. **Separate state and dispatch**: Prevent unnecessary re-renders
4. **Use context for global state only**: Local state should use props
5. **Consider alternatives**: For frequent updates, use state management library

**Vietnamese:**

Context mạnh mẽ nhưng có thể gây vấn đề hiệu suất nếu không dùng cẩn thận.

**Lý Thuyết Context:**

Context cung cấp cách truyền data qua component tree mà không cần truyền props thủ công ở mỗi cấp. Nó dựa trên pattern Provider-Consumer.

**Cách Context Hoạt Động:**

Khi tạo context với `createContext()`, React tạo:
1. Provider component giữ value
2. Consumer component (hoặc useContext hook) đọc value
3. Cơ chế subscription thông báo consumers khi value thay đổi

**Cơ Chế Cập Nhật:**

Mỗi khi context value thay đổi, TẤT CẢ components consume context đó sẽ re-render, bất kể chúng có dùng phần thay đổi hay không.

**Context vs Props:**

Context dùng cho:
- Data thực sự global (theme, auth, language)
- Data cần bởi nhiều components ở các cấp khác nhau
- Data thay đổi không thường xuyên

Props dùng cho:
- Data specific cho component
- Data thay đổi thường xuyên
- Luồng data tường minh

**Vấn Đề Re-render:**

Context trigger re-renders dựa trên referential equality (Object.is). Ngay cả khi data thực tế không đổi, nếu tạo object/array mới, tất cả consumers re-render.

**Best Practices:**

1. Giữ context values stable (memoize)
2. Chia contexts theo concern
3. Tách state và dispatch
4. Chỉ dùng context cho global state
5. Cân nhắc alternatives cho frequent updates

---

### 4. useReducer Deep Dive
### 4. useReducer Tìm Hiểu Sâu

**English:**

useReducer is an alternative to useState for complex state logic. It's based on the reducer pattern from Redux.

**Reducer Theory:**

A reducer is a pure function that takes the current state and an action, and returns the new state:

```
(state, action) => newState
```

Key principles:
1. **Pure function**: Same inputs always produce same output
2. **No side effects**: Don't mutate state, make API calls, etc.
3. **Immutable updates**: Return new state object, don't modify existing

**Why useReducer?**

Use useReducer when:
1. State logic is complex (multiple sub-values)
2. Next state depends on previous state
3. You want to optimize performance (dispatch is stable)
4. You need to test state logic separately

**useReducer vs useState:**

useState is simpler for:
- Single values
- Independent state updates
- Simple toggle/increment logic

useReducer is better for:
- Complex state objects
- Multiple related state updates
- State transitions with business logic
- When you need to pass dispatch down (stable reference)

**Reducer Pattern Theory:**

The reducer pattern provides:
1. **Centralized state logic**: All state updates in one place
2. **Predictable updates**: Actions describe what happened
3. **Easier debugging**: Can log actions and state
4. **Time-travel debugging**: Can replay actions
5. **Easier testing**: Pure functions are easy to test

**Action Design:**

Actions should be:
1. **Descriptive**: Name describes what happened, not how
2. **Serializable**: Can be logged, stored, replayed
3. **Minimal**: Only include necessary data

Good action names:
- USER_LOGGED_IN
- ITEM_ADDED_TO_CART
- FORM_SUBMITTED

Bad action names:
- SET_USER (too generic)
- UPDATE (what are we updating?)
- CHANGE (what changed?)

**State Shape Design:**

Design your state shape carefully:
1. **Normalized**: Avoid nested duplication
2. **Flat**: Easier to update
3. **Minimal**: Derive what you can
4. **Consistent**: Use same patterns throughout

**Reducer Composition:**

For large state, split reducers by domain:

```
rootReducer = {
  user: userReducer,
  cart: cartReducer,
  ui: uiReducer
}
```

Each reducer manages its slice of state independently.

**Theory: Why Composition?**

Composition allows:
1. **Separation of concerns**: Each reducer handles one domain
2. **Easier testing**: Test each reducer independently
3. **Better organization**: Code is grouped by feature
4. **Reusability**: Reducers can be reused in different contexts

**Middleware Pattern:**

You can add middleware to intercept actions:
1. **Logging**: Log every action and state change
2. **Analytics**: Track user actions
3. **Persistence**: Save state to localStorage
4. **Validation**: Validate actions before processing

**Theory: Middleware Chain**

Middleware forms a chain where each middleware can:
1. Inspect the action
2. Modify the action
3. Dispatch additional actions
4. Stop the action from reaching the reducer

**Async Actions with useReducer:**

useReducer doesn't handle async actions directly. Patterns:

1. **Dispatch multiple actions**: Start, success, error
2. **Thunks**: Functions that dispatch actions
3. **Sagas**: Generator functions for complex async flows
4. **Effects**: Separate side effects from state updates

**Theory: Async State Machine**

Async operations typically have states:
- Idle: Not started
- Loading: In progress
- Success: Completed successfully
- Error: Failed

Model this explicitly in your state:
```
{
  status: 'idle' | 'loading' | 'success' | 'error',
  data: T | null,
  error: Error | null
}
```

**useReducer Performance:**

useReducer can improve performance because:
1. **Stable dispatch**: dispatch reference never changes
2. **Batch updates**: Multiple dispatches in same event are batched
3. **Optimization**: Can use React.memo with dispatch in props

**Theory: Why dispatch is stable**

React guarantees that dispatch identity is stable and won't change on re-renders. This means you can safely pass dispatch to child components without causing re-renders.

**Testing Reducers:**

Reducers are pure functions, making them easy to test:

```
// Test structure
describe('reducer', () => {
  it('should handle ACTION_TYPE', () => {
    const initialState = { ... };
    const action = { type: 'ACTION_TYPE', payload: ... };
    const newState = reducer(initialState, action);
    expect(newState).toEqual({ ... });
  });
});
```

**Vietnamese:**

useReducer là alternative cho useState cho state logic phức tạp. Nó dựa trên reducer pattern từ Redux.

**Lý Thuyết Reducer:**

Reducer là pure function nhận current state và action, trả về new state:

```
(state, action) => newState
```

Nguyên tắc:
1. **Pure function**: Cùng inputs luôn cho cùng output
2. **No side effects**: Không mutate state, gọi API, etc.
3. **Immutable updates**: Trả về state object mới

**Khi Nào Dùng useReducer:**

1. State logic phức tạp (nhiều sub-values)
2. Next state phụ thuộc previous state
3. Muốn tối ưu performance (dispatch stable)
4. Cần test state logic riêng

**Reducer Pattern:**

Reducer pattern cung cấp:
1. **Centralized logic**: Tất cả state updates ở một chỗ
2. **Predictable updates**: Actions mô tả điều gì xảy ra
3. **Easier debugging**: Có thể log actions và state
4. **Time-travel**: Có thể replay actions
5. **Easier testing**: Pure functions dễ test

**Action Design:**

Actions nên:
1. **Descriptive**: Tên mô tả điều gì xảy ra
2. **Serializable**: Có thể log, store, replay
3. **Minimal**: Chỉ bao gồm data cần thiết

**State Shape:**

Thiết kế state shape cẩn thận:
1. **Normalized**: Tránh nested duplication
2. **Flat**: Dễ update hơn
3. **Minimal**: Derive những gì có thể
4. **Consistent**: Dùng cùng patterns

**Async với useReducer:**

useReducer không xử lý async trực tiếp. Patterns:
1. Dispatch nhiều actions (start, success, error)
2. Thunks
3. Sagas
4. Effects riêng biệt

**Performance:**

useReducer cải thiện performance vì:
1. dispatch reference stable
2. Batch updates
3. Có thể optimize với React.memo

---

### 5. useCallback and useMemo Optimization
### 5. Tối Ưu useCallback và useMemo

**English:**

useCallback and useMemo are optimization hooks that prevent unnecessary recalculations and re-renders.

**Memoization Theory:**

Memoization is an optimization technique that stores the results of expensive function calls and returns the cached result when the same inputs occur again.

Key concepts:
1. **Cache**: Store previous results
2. **Comparison**: Check if inputs changed
3. **Return**: Use cached result if inputs same, recalculate if different

**Cost-Benefit Analysis:**

Memoization has costs:
1. **Memory**: Storing cached values
2. **Comparison**: Checking if dependencies changed
3. **Complexity**: More code to maintain

Benefits:
1. **Performance**: Avoid expensive recalculations
2. **Referential equality**: Stable references for props
3. **Prevent re-renders**: When used with React.memo

**When to Memoize:**

Memoize when:
1. **Expensive calculations**: Complex computations, large data processing
2. **Referential equality matters**: Passing to memoized components
3. **Dependency in useEffect**: Prevent infinite loops
4. **Measured performance issue**: Profile first, optimize second

Don't memoize when:
1. **Simple calculations**: Memoization overhead > calculation cost
2. **Primitives**: Numbers, strings, booleans (cheap to compare)
3. **Every function/value**: Over-optimization hurts readability
4. **No performance issue**: Premature optimization is root of evil

**useCallback Theory:**

useCallback returns a memoized version of the callback that only changes if dependencies change.

**Why useCallback exists:**

In JavaScript, functions are objects. Every render creates new function instances:

```
function Component() {
  const handleClick = () => { ... }; // New function every render
  return <Child onClick={handleClick} />;
}
```

If Child is memoized with React.memo, it will still re-render because handleClick is a new reference every time.

useCallback solves this:
```
const handleClick = useCallback(() => { ... }, []); // Same reference
```

**useCallback Internals:**

Simplified implementation:
```
function useCallback(callback, deps) {
  const [memoizedCallback, setMemoizedCallback] = useState(callback);
  const [prevDeps, setPrevDeps] = useState(deps);
  
  if (!areDepsEqual(deps, prevDeps)) {
    setMemoizedCallback(callback);
    setPrevDeps(deps);
  }
  
  return memoizedCallback;
}
```

**useMemo Theory:**

useMemo returns a memoized value that only recalculates when dependencies change.

**useMemo vs useCallback:**

They're related:
```
useCallback(fn, deps) === useMemo(() => fn, deps)
```

useCallback memoizes the function itself.
useMemo memoizes the function's return value.

**useMemo Internals:**

Simplified implementation:
```
function useMemo(factory, deps) {
  const [memoizedValue, setMemoizedValue] = useState(() => factory());
  const [prevDeps, setPrevDeps] = useState(deps);
  
  if (!areDepsEqual(deps, prevDeps)) {
    setMemoizedValue(factory());
    setPrevDeps(deps);
  }
  
  return memoizedValue;
}
```

**Dependency Comparison:**

React uses Object.is() to compare dependencies:
- Primitives: Compared by value
- Objects/Arrays: Compared by reference
- Functions: Compared by reference

This is why you need to memoize objects/arrays/functions passed as dependencies.

**Common Pitfalls:**

1. **Inline objects in dependencies:**
```
useMemo(() => { ... }, [{ key: value }]); // New object every time!
```

2. **Missing dependencies:**
```
useMemo(() => {
  return data.filter(item => item.type === filter);
}, [data]); // Missing filter!
```

3. **Over-memoization:**
```
const doubled = useMemo(() => count * 2, [count]); // Unnecessary
```

**Optimization Strategy:**

1. **Write code first**: Don't optimize prematurely
2. **Measure performance**: Use React DevTools Profiler
3. **Identify bottlenecks**: Find slow components
4. **Apply memoization**: useCallback, useMemo, React.memo
5. **Measure again**: Verify improvement

**Theory: Optimization Trade-offs**

Every optimization has trade-offs:
- **Memory vs Speed**: Caching uses memory to save time
- **Complexity vs Performance**: More code to maintain
- **Developer time vs User time**: Time spent optimizing vs user experience

Optimize when user experience is noticeably impacted.

**Advanced Patterns:**

**1. Memoizing expensive selectors:**
```
const filteredData = useMemo(() => {
  return data
    .filter(item => item.active)
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 10);
}, [data]);
```

**2. Memoizing with multiple dependencies:**
```
const result = useMemo(() => {
  return complexCalculation(a, b, c);
}, [a, b, c]);
```

**3. Conditional memoization:**
```
const value = useMemo(() => {
  if (condition) {
    return expensiveCalculation();
  }
  return defaultValue;
}, [condition, /* other deps */]);
```

**Vietnamese:**

useCallback và useMemo là optimization hooks ngăn recalculations và re-renders không cần thiết.

**Lý Thuyết Memoization:**

Memoization là kỹ thuật tối ưu lưu kết quả của function calls tốn kém và trả về cached result khi cùng inputs xuất hiện lại.

**Phân Tích Chi Phí-Lợi Ích:**

Chi phí:
1. **Memory**: Lưu cached values
2. **Comparison**: Kiểm tra dependencies thay đổi
3. **Complexity**: Nhiều code hơn để maintain

Lợi ích:
1. **Performance**: Tránh recalculations tốn kém
2. **Referential equality**: References stable cho props
3. **Prevent re-renders**: Khi dùng với React.memo

**Khi Nào Memoize:**

Memoize khi:
1. Tính toán tốn kém
2. Referential equality quan trọng
3. Dependency trong useEffect
4. Đo được performance issue

Không memoize khi:
1. Tính toán đơn giản
2. Primitives
3. Mọi function/value
4. Không có performance issue

**useCallback:**

Trả về memoized callback chỉ thay đổi khi dependencies thay đổi.

**useMemo:**

Trả về memoized value chỉ recalculate khi dependencies thay đổi.

**Dependency Comparison:**

React dùng Object.is() để so sánh:
- Primitives: So sánh theo value
- Objects/Arrays: So sánh theo reference
- Functions: So sánh theo reference

**Chiến Lược Tối Ưu:**

1. Viết code trước
2. Đo performance
3. Tìm bottlenecks
4. Áp dụng memoization
5. Đo lại

---

### 6. useRef Advanced Use Cases
### 6. Use Cases Nâng Cao useRef

**English:**

useRef is more than just DOM references. It's a way to persist values across renders without causing re-renders.

**useRef Theory:**

useRef returns a mutable ref object whose `.current` property is initialized to the passed argument. The returned object will persist for the full lifetime of the component.

Key characteristics:
1. **Mutable**: Can change .current without re-render
2. **Persistent**: Survives across renders
3. **Synchronous**: Changes are immediate
4. **No re-render**: Changing .current doesn't trigger re-render

**useRef vs useState:**

Fundamental differences:

useState:
- Triggers re-render on change
- Async updates (batched)
- For UI state
- Immutable update pattern

useRef:
- No re-render on change
- Sync updates (immediate)
- For non-UI state
- Mutable update pattern

**When to use useRef:**

1. **DOM references**: Access DOM elements
2. **Instance variables**: Store values that don't affect render
3. **Previous values**: Track previous props/state
4. **Timers/Intervals**: Store timer IDs
5. **Subscriptions**: Store subscription objects
6. **Mutable values**: Values that change but don't need re-render

**useRef Internals:**

Simplified implementation:
```
function useRef(initialValue) {
  const [ref] = useState({ current: initialValue });
  return ref;
}
```

The key insight: useRef returns the SAME object every render. Only .current changes.

**DOM References Theory:**

React's ref system allows you to:
1. **Access DOM nodes**: Get actual DOM elements
2. **Imperative operations**: Focus, scroll, measure
3. **Third-party integration**: Pass DOM nodes to libraries

**Ref Callback Pattern:**

Instead of passing a ref object, you can pass a callback:

```
<div ref={node => {
  // Called when element mounts
  // Called with null when unmounts
}} />
```

This is useful when:
- You need to do something when element mounts/unmounts
- You need to measure the element
- You need dynamic refs (refs in loops)

**forwardRef Theory:**

By default, function components don't have refs. forwardRef allows a component to expose a ref to its parent.

Why this matters:
- Encapsulation: Component controls what's exposed
- Flexibility: Can expose custom API, not just DOM node
- Composition: Can forward ref through multiple levels

**useImperativeHandle Theory:**

useImperativeHandle customizes the instance value exposed to parent components when using ref.

Use cases:
- Expose only specific methods
- Create custom API for component
- Hide implementation details

**Theory: Imperative vs Declarative**

React is declarative, but sometimes you need imperative operations:
- Focus an input
- Scroll to element
- Trigger animation
- Measure element

useRef + useImperativeHandle provide escape hatches for these cases.

**Ref Timing:**

Refs are set at different times:
1. **Mount**: ref.current set after DOM insertion, before useLayoutEffect
2. **Update**: ref.current updated before useLayoutEffect
3. **Unmount**: ref.current set to null

**Previous Value Pattern:**

Common pattern to track previous value:

```
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

Why this works:
- useEffect runs after render
- So ref.current still has previous value during render
- Then useEffect updates it for next render

**Ref vs State for Counters:**

When to use ref vs state for counters:

Use state when:
- Counter displayed in UI
- Counter affects rendering
- Need to trigger re-render on change

Use ref when:
- Counter not displayed
- Counter for internal logic only
- Don't want re-render on change

**Memory Leaks with Refs:**

Refs can cause memory leaks if not cleaned up:

```
useEffect(() => {
  const subscription = subscribe();
  subscriptionRef.current = subscription;
  
  return () => {
    subscriptionRef.current?.unsubscribe();
    subscriptionRef.current = null; // Clean up ref
  };
}, []);
```

**Vietnamese:**

useRef không chỉ là DOM references. Đó là cách persist values qua renders mà không gây re-renders.

**Lý Thuyết useRef:**

useRef trả về mutable ref object có `.current` property được khởi tạo với argument truyền vào. Object trả về persist suốt lifetime của component.

**Đặc điểm:**
1. **Mutable**: Có thể thay đổi .current không re-render
2. **Persistent**: Tồn tại qua renders
3. **Synchronous**: Thay đổi immediate
4. **No re-render**: Thay đổi .current không trigger re-render

**useRef vs useState:**

useState:
- Trigger re-render khi thay đổi
- Async updates (batched)
- Cho UI state
- Immutable pattern

useRef:
- Không re-render khi thay đổi
- Sync updates (immediate)
- Cho non-UI state
- Mutable pattern

**Khi Nào Dùng useRef:**

1. DOM references
2. Instance variables
3. Previous values
4. Timers/Intervals
5. Subscriptions
6. Mutable values không cần re-render

**forwardRef:**

Cho phép component expose ref cho parent.

**useImperativeHandle:**

Customize instance value exposed cho parent components.

**Ref Timing:**

1. **Mount**: ref.current set sau DOM insertion
2. **Update**: ref.current updated trước useLayoutEffect
3. **Unmount**: ref.current set null

**Memory Leaks:**

Refs có thể gây memory leaks nếu không cleanup. Luôn set ref.current = null trong cleanup.

