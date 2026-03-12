# React Hooks Deep Dive - Mastering Modern React

> Hooks là foundation của modern React. Hiểu sâu hooks = viết React code tốt hơn và ace interview.

---

## Mục Lục

- [Overview](#-overview)
- [useState](#-usestate)
- [useEffect](#-useeffect)
- [useRef](#-useref)
- [useMemo & useCallback](#-usememo--usecallback)
- [useReducer](#-usereducer)
- [Custom Hooks](#-custom-hooks)
- [Câu Hỏi Phỏng Vấn](#-câu-hỏi-phỏng-vấn)

---

## 🎯 Overview

**Hooks** cho phép bạn sử dụng state và các React features khác trong functional components, thay thế class components.

### Rules of Hooks

```javascript
// ✅ Rule 1: Chỉ gọi hooks ở TOP LEVEL
// ✅ Rule 2: Chỉ gọi hooks từ React functions

function Component() {
    // ✅ Top level - OK
    const [count, setCount] = useState(0);

    if (count > 5) {
        // ❌ Inside condition - NOT OK
        // const [x, setX] = useState(0);
    }

    // ❌ Inside loop - NOT OK
    // for (...) { useState() }
}
```

**Tại sao?** React dựa vào **thứ tự** gọi hooks để track state. Nếu thứ tự thay đổi, React sẽ mất track.

### Hooks at a Glance

| Hook | Purpose | When to Use |
|------|---------|-------------|
| useState | Local state | Simple state values |
| useEffect | Side effects | Data fetching, subscriptions, DOM manipulation |
| useRef | Mutable reference | DOM refs, persist values across renders |
| useMemo | Memoize values | Expensive computations |
| useCallback | Memoize functions | Stable function references |
| useReducer | Complex state | State with multiple sub-values |
| useContext | Access context | Global state, theming |

---

## 🔷 useState

### What - Định Nghĩa

`useState` cho phép functional components có state.

```javascript
const [state, setState] = useState(initialValue);
```

### How - Cách Sử Dụng

#### Basic Usage
```javascript
function Counter() {
    const [count, setCount] = useState(0);

    return (
        <button onClick={() => setCount(count + 1)}>
            Count: {count}
        </button>
    );
}
```

#### Lazy Initialization
```javascript
// ❌ computeExpensiveValue chạy MỖI render
const [state, setState] = useState(computeExpensiveValue());

// ✅ computeExpensiveValue chỉ chạy MỘT lần
const [state, setState] = useState(() => computeExpensiveValue());
```

#### Functional Updates
```javascript
// ❌ Có thể gây bugs với async
setCount(count + 1);
setCount(count + 1); // Vẫn chỉ +1!

// ✅ Luôn dựa trên previous state
setCount(prev => prev + 1);
setCount(prev => prev + 1); // +2 correctly!
```

#### Object State
```javascript
const [user, setUser] = useState({ name: '', age: 0 });

// ❌ Mutating state directly
user.name = 'John';

// ✅ Spread operator để tạo object mới
setUser(prev => ({ ...prev, name: 'John' }));
```

### Common Mistakes

```javascript
// ❌ State updates are ASYNC
setCount(count + 1);
console.log(count); // Still old value!

// ✅ Use useEffect to react to state changes
useEffect(() => {
    console.log(count); // New value
}, [count]);
```

---

## 🔷 useEffect

### What - Định Nghĩa

`useEffect` cho phép bạn thực hiện **side effects** trong functional components - data fetching, subscriptions, DOM manipulation.

```javascript
useEffect(() => {
    // Effect code
    return () => {
        // Cleanup code (optional)
    };
}, [dependencies]);
```

### Dependencies Array

```javascript
// Chạy EVERY render
useEffect(() => {
    console.log('Every render');
});

// Chạy chỉ ON MOUNT
useEffect(() => {
    console.log('Only on mount');
}, []);

// Chạy khi DEPENDENCIES thay đổi
useEffect(() => {
    console.log('When count changes');
}, [count]);
```

### Cleanup Function

```javascript
function Timer() {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(s => s + 1);
        }, 1000);

        // Cleanup: chạy khi unmount hoặc trước effect tiếp theo
        return () => clearInterval(interval);
    }, []);

    return <div>Seconds: {seconds}</div>;
}
```

### Data Fetching Pattern

```javascript
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false; // Prevent state update on unmounted component

        async function fetchUser() {
            try {
                setLoading(true);
                const response = await fetch(`/api/users/${userId}`);
                const data = await response.json();

                if (!cancelled) {
                    setUser(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchUser();

        return () => {
            cancelled = true;
        };
    }, [userId]);

    if (loading) return <Spinner />;
    if (error) return <Error message={error} />;
    return <UserCard user={user} />;
}
```

### Common Mistakes

```javascript
// ❌ Infinite loop - object created every render
useEffect(() => {
    fetchData(options);
}, [options]); // options = {} mới mỗi render!

// ✅ Memoize object hoặc primitive deps
const memoizedOptions = useMemo(() => ({ page: 1 }), []);
useEffect(() => {
    fetchData(memoizedOptions);
}, [memoizedOptions]);

// ❌ Missing dependency
const [count, setCount] = useState(0);
useEffect(() => {
    const interval = setInterval(() => {
        setCount(count + 1); // Stale closure!
    }, 1000);
    return () => clearInterval(interval);
}, []); // count missing!

// ✅ Functional update
useEffect(() => {
    const interval = setInterval(() => {
        setCount(c => c + 1); // Always current
    }, 1000);
    return () => clearInterval(interval);
}, []);
```

---

## 🔷 useRef

### What - Định Nghĩa

`useRef` tạo một mutable reference persist qua renders. **Thay đổi ref KHÔNG trigger re-render.**

### Two Use Cases

#### 1. DOM References
```javascript
function TextInput() {
    const inputRef = useRef(null);

    const focusInput = () => {
        inputRef.current.focus();
    };

    return (
        <>
            <input ref={inputRef} />
            <button onClick={focusInput}>Focus</button>
        </>
    );
}
```

#### 2. Instance Variables (Persist values)
```javascript
function Timer() {
    const [count, setCount] = useState(0);
    const countRef = useRef(count); // Store previous value

    useEffect(() => {
        countRef.current = count; // Update ref (no re-render)
    }, [count]);

    return (
        <div>
            Current: {count}, Previous: {countRef.current}
        </div>
    );
}
```

### useRef vs useState

| useRef | useState |
|--------|----------|
| Thay đổi không trigger re-render | Thay đổi trigger re-render |
| Access ngay lập tức via .current | Update là async |
| Mutable | Immutable pattern |

```javascript
// Counting renders without infinite loop
function Component() {
    const renderCount = useRef(0);
    renderCount.current++; // ✅ No re-render

    // const [count, setCount] = useState(0);
    // setCount(c => c + 1); // ❌ Infinite loop!

    return <div>Renders: {renderCount.current}</div>;
}
```

---

## 🔷 useMemo & useCallback

### useMemo - Memoize Values

```javascript
const memoizedValue = useMemo(() => {
    return computeExpensiveValue(a, b);
}, [a, b]);
```

**When to Use:**
- Expensive computations
- Referential equality for objects/arrays

```javascript
function ProductList({ products, filter }) {
    // ✅ Only recompute when products or filter change
    const filteredProducts = useMemo(() => {
        return products.filter(p => p.category === filter);
    }, [products, filter]);

    return <List items={filteredProducts} />;
}
```

### useCallback - Memoize Functions

```javascript
const memoizedCallback = useCallback(() => {
    doSomething(a, b);
}, [a, b]);
```

**When to Use:**
- Passing callbacks to optimized child components (React.memo)
- Dependencies of useEffect

```javascript
function Parent() {
    const [count, setCount] = useState(0);

    // ❌ New function every render
    const handleClick = () => setCount(c => c + 1);

    // ✅ Same function reference
    const handleClickMemo = useCallback(() => {
        setCount(c => c + 1);
    }, []);

    return <MemoizedChild onClick={handleClickMemo} />;
}

const MemoizedChild = React.memo(({ onClick }) => {
    console.log('Child render');
    return <button onClick={onClick}>Click</button>;
});
```

### useMemo vs useCallback

```javascript
// Equivalent:
useCallback(fn, deps)
useMemo(() => fn, deps)

// useMemo returns VALUE
const value = useMemo(() => computeValue(), []);

// useCallback returns FUNCTION
const fn = useCallback(() => doSomething(), []);
```

### When NOT to Use

```javascript
// ❌ Premature optimization
const value = useMemo(() => a + b, [a, b]); // Simple math

// ❌ Functions not passed to children
const handleClick = useCallback(() => {}, []); // No optimized child

// ✅ Only when:
// - Expensive computation
// - Passing to React.memo child
// - Dependency of useEffect
```

---

## 🔷 useReducer

### What - Định Nghĩa

`useReducer` là alternative cho `useState` khi có complex state logic.

```javascript
const [state, dispatch] = useReducer(reducer, initialState);
```

### Basic Example

```javascript
const initialState = { count: 0 };

function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return { count: state.count + 1 };
        case 'decrement':
            return { count: state.count - 1 };
        case 'reset':
            return initialState;
        default:
            throw new Error('Unknown action');
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <>
            Count: {state.count}
            <button onClick={() => dispatch({ type: 'increment' })}>+</button>
            <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
            <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
        </>
    );
}
```

### useState vs useReducer

| useState | useReducer |
|----------|------------|
| Simple state | Complex state với nhiều sub-values |
| Independent updates | State transitions liên quan nhau |
| Inline logic | Logic tách biệt (testable) |

```javascript
// useState - nhiều state riêng lẻ
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [errors, setErrors] = useState({});

// useReducer - gom lại
const [form, dispatch] = useReducer(formReducer, {
    name: '',
    email: '',
    errors: {}
});
```

---

## 🔷 Custom Hooks

### What - Định Nghĩa

Custom hooks cho phép bạn **extract component logic** thành reusable functions.

### Naming Convention

```javascript
// Luôn bắt đầu với "use"
function useWindowSize() { ... }
function useFetch() { ... }
function useLocalStorage() { ... }
```

### Example: useLocalStorage

```javascript
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    const setValue = useCallback((value) => {
        try {
            const valueToStore = value instanceof Function
                ? value(storedValue)
                : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    }, [key, storedValue]);

    return [storedValue, setValue];
}

// Usage
function App() {
    const [name, setName] = useLocalStorage('name', 'Anonymous');
    return <input value={name} onChange={e => setName(e.target.value)} />;
}
```

### Example: useFetch

```javascript
function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            try {
                setLoading(true);
                const response = await fetch(url);
                if (!response.ok) throw new Error('Network error');
                const json = await response.json();
                if (!cancelled) setData(json);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchData();
        return () => { cancelled = true; };
    }, [url]);

    return { data, loading, error };
}

// Usage
function UserList() {
    const { data: users, loading, error } = useFetch('/api/users');

    if (loading) return <Spinner />;
    if (error) return <Error message={error} />;
    return <List items={users} />;
}
```

### Example: useDebounce

```javascript
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

// Usage
function Search() {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        if (debouncedQuery) {
            searchAPI(debouncedQuery);
        }
    }, [debouncedQuery]);

    return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: useState vs useRef?**

A: useState trigger re-render khi thay đổi, useRef không. useState cho UI state, useRef cho DOM refs hoặc values cần persist mà không cần re-render.

**Q: useEffect với [] chạy khi nào?**

A: Chỉ chạy một lần sau khi component mount lần đầu, tương đương componentDidMount.

### 🟡 Mid-level

**Q: Giải thích stale closure trong useEffect**

```javascript
// ❌ Stale closure
const [count, setCount] = useState(0);
useEffect(() => {
    setInterval(() => console.log(count), 1000);
}, []); // count bị "đóng băng" ở giá trị 0

// ✅ Fix với ref
const countRef = useRef(count);
countRef.current = count;
useEffect(() => {
    setInterval(() => console.log(countRef.current), 1000);
}, []);
```

**Q: useMemo vs useCallback?**

A: useMemo memoize **values**, useCallback memoize **functions**. useCallback(fn, deps) === useMemo(() => fn, deps).

### 🔴 Senior

**Q: Implement useDebounce hook**

A: [Xem phần Custom Hooks ở trên]

**Q: Tại sao không nên dùng useMemo/useCallback everywhere?**

A:
1. Overhead của memoization có thể > benefit
2. Memory cost để store cached values
3. Complexity không cần thiết
4. Chỉ dùng khi có measurable performance issue

---

## 📚 Active Recall

1. [ ] Giải thích Rules of Hooks
2. [ ] useState functional update dùng khi nào?
3. [ ] useEffect cleanup function chạy khi nào?
4. [ ] Viết useLocalStorage hook từ scratch
5. [ ] Khi nào dùng useReducer thay vì useState?
6. [ ] Giải thích stale closure problem

---

> **Tiếp theo:** [03-state-management.md](./03-state-management.md) - Context, Redux, Zustand
