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

