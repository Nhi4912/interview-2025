# React Hooks Cheatsheet

> Quick reference cho tất cả React hooks.

---

## Core Hooks

### useState

```javascript
// Basic
const [state, setState] = useState(initialValue)

// Lazy initialization
const [state, setState] = useState(() => expensiveComputation())

// Functional update
setState(prev => prev + 1)

// Object state
setState(prev => ({...prev, key: value}))
```

### useEffect

```javascript
// Run on every render
useEffect(() => {
  // effect
})

// Run once (mount only)
useEffect(() => {
  // effect
}, [])

// Run when dependencies change
useEffect(() => {
  // effect
}, [dep1, dep2])

// Cleanup
useEffect(() => {
  const subscription = subscribe()
  return () => subscription.unsubscribe()
}, [])
```

### useContext

```javascript
// Create context
const ThemeContext = createContext(defaultValue)

// Provide value
<ThemeContext.Provider value={theme}>
  <App />
</ThemeContext.Provider>

// Consume value
const theme = useContext(ThemeContext)
```

---

## Additional Hooks

### useReducer

```javascript
const initialState = { count: 0 }

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      throw new Error()
  }
}

const [state, dispatch] = useReducer(reducer, initialState)

// With lazy initialization
const [state, dispatch] = useReducer(reducer, arg, init)
```

### useCallback

```javascript
// Memoize function
const memoizedFn = useCallback(
  () => doSomething(a, b),
  [a, b]
)

// Common use: passing to child components
<Child onClick={useCallback(() => handleClick(id), [id])} />
```

### useMemo

```javascript
// Memoize value
const memoizedValue = useMemo(
  () => computeExpensiveValue(a, b),
  [a, b]
)

// Memoize object/array
const config = useMemo(() => ({
  theme,
  locale
}), [theme, locale])
```

### useRef

```javascript
// DOM reference
const inputRef = useRef(null)
<input ref={inputRef} />
inputRef.current.focus()

// Mutable value (doesn't trigger re-render)
const countRef = useRef(0)
countRef.current++

// Previous value pattern
function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}
```

---

## React 18+ Hooks

### useTransition

```javascript
const [isPending, startTransition] = useTransition()

// Mark update as non-urgent
startTransition(() => {
  setSearchQuery(input)
})

// Show pending state
{isPending && <Spinner />}
```

### useDeferredValue

```javascript
// Defer non-urgent updates
const deferredQuery = useDeferredValue(query)

// Use deferred value in expensive component
<ExpensiveList query={deferredQuery} />
```

### useId

```javascript
// Generate unique ID
const id = useId()

<label htmlFor={id}>Name</label>
<input id={id} />
```

---

## Hook Rules

```
┌─────────────────────────────────────────────────────────────────┐
│                    RULES OF HOOKS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. Only call hooks at TOP LEVEL                               │
│      ✗ Don't call inside loops, conditions, nested functions    │
│                                                                   │
│   2. Only call hooks from REACT FUNCTIONS                       │
│      ✓ React function components                                │
│      ✓ Custom hooks                                             │
│      ✗ Regular JavaScript functions                             │
│                                                                   │
│   3. Hooks must be called in SAME ORDER every render            │
│      React tracks hooks by order, not by name                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Common Custom Hooks

```javascript
// useLocalStorage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  })

  const setValue = value => {
    setStoredValue(value)
    localStorage.setItem(key, JSON.stringify(value))
  }

  return [storedValue, setValue]
}

// useDebounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// useOnClickOutside
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = event => {
      if (!ref.current || ref.current.contains(event.target)) return
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

// useFetch
function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [url])

  return { data, loading, error }
}
```

---

## Hook Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                 DEPENDENCY ARRAY GUIDE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   []        - Run once (mount/unmount)                          │
│   [a, b]    - Run when a or b changes                           │
│   undefined - Run on every render                               │
│                                                                   │
│   WHAT TO INCLUDE:                                              │
│   ✓ Props used inside                                           │
│   ✓ State used inside                                           │
│   ✓ Functions defined outside                                   │
│                                                                   │
│   WHAT NOT TO INCLUDE:                                          │
│   ✗ setState functions (stable)                                 │
│   ✗ dispatch from useReducer (stable)                           │
│   ✗ Refs (ref.current changes don't trigger)                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

> **Quay lại:** [Resources](../README.md)
