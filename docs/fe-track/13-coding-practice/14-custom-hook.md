# Custom React Hooks / Hook React Tùy Chỉnh

> **Track**: FE | **Difficulty**: 🟡 Medium
> **Topics**: React Hooks, Abstraction, Reusability

---

## Problem / Bài Toán

Implement commonly requested custom hooks: `useLocalStorage`, `useDebounce`, `useFetch`, `useOnClickOutside`.

---

## useLocalStorage

```tsx
import { useState, useEffect } from 'react'

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage full or SSR — ignore
    }
  }, [key, value])

  return [value, setValue] as const
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'light')
```

**Key**: Lazy initial state (function in `useState`) reads from storage only once, not on every render.

---

## useFetch

```tsx
interface FetchState<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
}

function useFetch<T>(url: string, options?: RequestInit): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null, isLoading: true, error: null
  })

  useEffect(() => {
    if (!url) return
    const controller = new AbortController()
    setState({ data: null, isLoading: true, error: null })

    fetch(url, { ...options, signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<T>
      })
      .then(data => setState({ data, isLoading: false, error: null }))
      .catch(err => {
        if (err.name !== 'AbortError') {
          setState({ data: null, isLoading: false, error: err })
        }
      })

    return () => controller.abort()
  }, [url]) // options intentionally not in deps — would cause infinite loop

  return state
}

// Usage
const { data: user, isLoading, error } = useFetch<User>('/api/user/123')
```

---

## useOnClickOutside

```tsx
import { RefObject, useEffect } from 'react'

function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return
      handler(e)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

// Usage
const menuRef = useRef<HTMLDivElement>(null)
useOnClickOutside(menuRef, () => setIsOpen(false))
```

---

## useWindowSize

```tsx
import { useState, useEffect } from 'react'

function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}
```

## Key Points / Điểm Quan Trọng

**Rules of Hooks compliance**: Custom hooks must start with `use`, can only call other hooks at top level.

**Cleanup**: Every `addEventListener` needs a corresponding `removeEventListener` in cleanup. Every `AbortController` needs `.abort()` on cleanup.

**SSR safety**: `typeof window !== 'undefined'` guard for hooks used in Next.js.

## Follow-up / Câu Hỏi Tiếp Theo

- **`useEventListener`**: Generic version of `useOnClickOutside` for any event
- **`useAsync`**: Handle async function with loading/error states + cancel
- **`usePrevious`**: Return previous value using `useRef`
