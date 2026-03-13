# Custom React Hooks / Hook React Tùy Chỉnh

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Topics**: React Hooks, Abstraction, Reusability
> **See also**: [Hooks Deep Dive](../03-react/03-hooks-deep-dive.md) | [React Testing](../03-react/06-testing.md)

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

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What are the rules of custom hooks and why do they exist? / Rules of Hooks là gì và tại sao tồn tại? 🟢 Junior

**A:** Custom hooks must start with `use` (so linters can enforce hook rules). They must only call other hooks at the top level — never inside conditionals, loops, or nested functions — because React tracks hooks by call order, not name.

Vietnamese: React dùng **linked list** để lưu hook state theo thứ tự gọi trong component. Nếu gọi hook trong điều kiện, thứ tự thay đổi → hook index bị lệch → state sai. Tên `use*` không phải syntax requirement của JS mà là convention để `eslint-plugin-react-hooks` biết đây là hook và enforce rules. Custom hooks không có state riêng — mỗi lần component gọi custom hook, React tạo hook entries mới trong fiber của component đó.

---

### Q: How do you test custom hooks? / Test custom hook thế nào? 🟡 Mid

**A:** Use `@testing-library/react`'s `renderHook` to render a hook in isolation without building a full component. Use `act()` to wrap state updates.

```ts
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

test('reads initial value from localStorage', () => {
  localStorage.setItem('theme', '"dark"')
  const { result } = renderHook(() => useLocalStorage('theme', 'light'))
  expect(result.current[0]).toBe('dark')
})

test('updates localStorage on setValue', () => {
  const { result } = renderHook(() => useLocalStorage('count', 0))
  act(() => { result.current[1](42) })
  expect(localStorage.getItem('count')).toBe('42')
})
```

Vietnamese: `renderHook` tạo một wrapper component ẩn chỉ để render hook — không cần viết component test wrapper thủ công. `act()` cần thiết khi trigger state updates để React flush tất cả effects trước khi assert. Với hooks dùng `useEffect` và async (như `useFetch`), dùng `waitFor` từ Testing Library để chờ async state settle.

---

### Q: What causes infinite re-render loops in custom hooks? / Nguyên nhân gây infinite loop trong custom hook là gì? 🔴 Senior

**A:** Three common causes: (1) unstable object/function references in dependency arrays, (2) `setState` called unconditionally inside `useEffect`, (3) stale closure causing state to always look like it changed.

```ts
// BUG 1: New object reference every render
function useFetch(options: RequestInit) {  // options = {} creates new ref each render
  useEffect(() => { fetch('/api', options) }, [options]) // loop!
}
// FIX: memoize options outside or useMemo

// BUG 2: setState without condition
useEffect(() => {
  setCount(count + 1) // always runs → always re-renders → always runs
}, [count])
// FIX: only setState when something actually changes

// BUG 3: Stale closure in useCallback
const handleClick = useCallback(() => {
  setItems([...items, newItem]) // stale items reference
}, [])  // missing items dep
// FIX: add items to deps, or use functional update: setItems(prev => [...prev, newItem])
```

Vietnamese: Infinite loop là bug phổ biến nhất với hooks. Rule of thumb: (1) Primitives trong deps array luôn stable. (2) Objects/arrays/functions tạo mới mỗi render → unstable → loop. (3) Dùng `eslint-plugin-react-hooks` với `exhaustive-deps` rule để phát hiện missing/wrong deps sớm. (4) Khi debug loop: dùng `useEffect` với `console.log` để xem dep nào đang thay đổi, hoặc `why-did-you-render` library.

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| Question | Level | Key Point |
|----------|-------|-----------|
| Rules of Hooks & why | 🟢 | Call order linked list — conditionals break index |
| Testing with renderHook | 🟡 | renderHook + act() for state updates, waitFor for async |
| Infinite loop causes | 🔴 | Unstable refs in deps, unconditional setState, stale closure |
