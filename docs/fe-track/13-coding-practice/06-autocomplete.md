# Autocomplete Component / Component Tìm Kiếm Gợi Ý

> **Track**: FE | **Difficulty**: 🟡 Medium
> **Topics**: React, Hooks, Debounce, Accessibility, ARIA

---

## Problem / Bài Toán

Build an accessible autocomplete input that fetches suggestions from an API as the user types.

**Requirements:**
- Debounce API calls (300ms)
- Keyboard navigation: ArrowUp/Down, Enter to select, Escape to close
- Highlight active suggestion
- ARIA: `role="combobox"`, `role="listbox"`, `aria-activedescendant`
- Loading and empty states

---

## Solution / Giải Pháp

```tsx
import { useState, useEffect, useRef, useCallback, KeyboardEvent } from 'react'

interface Suggestion { id: string; label: string }

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export function Autocomplete({
  onFetch,
  onSelect,
  placeholder = 'Search...',
}: {
  onFetch: (q: string) => Promise<Suggestion[]>
  onSelect: (s: Suggestion) => void
  placeholder?: string
}) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!debouncedQuery.trim()) { setSuggestions([]); setIsOpen(false); return }
    let cancelled = false
    setIsLoading(true)
    onFetch(debouncedQuery)
      .then(results => { if (!cancelled) { setSuggestions(results); setIsOpen(true); setActiveIndex(-1) } })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true } // cancel stale responses
  }, [debouncedQuery, onFetch])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, suggestions.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, -1)) }
    if (e.key === 'Enter' && activeIndex >= 0) { e.preventDefault(); pick(suggestions[activeIndex]) }
    if (e.key === 'Escape') { setIsOpen(false); setActiveIndex(-1) }
  }, [isOpen, activeIndex, suggestions])

  const pick = (s: Suggestion) => { setQuery(s.label); setIsOpen(false); onSelect(s) }

  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="ac-list"
        aria-activedescendant={activeIndex >= 0 ? `ac-opt-${activeIndex}` : undefined}
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder={placeholder}
      />
      {isLoading && <span aria-live="polite">Loading...</span>}
      {isOpen && (
        <ul id="ac-list" role="listbox" style={{ position: 'absolute', width: '100%', margin: 0, padding: 0, listStyle: 'none' }}>
          {suggestions.map((s, i) => (
            <li key={s.id} id={`ac-opt-${i}`} role="option" aria-selected={i === activeIndex}
              onMouseDown={() => pick(s)}
              style={{ padding: 8, background: i === activeIndex ? '#eee' : '#fff' }}>
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

## Key Points / Điểm Quan Trọng

**Race condition fix**: `cancelled = true` on cleanup ignores stale fetch responses when query changes fast.

**`onBlur` delay**: `setTimeout(..., 150)` lets `onMouseDown` on list items fire before the list hides.

**ARIA pattern**: `combobox` + `listbox` + `option` + `aria-activedescendant` is the correct W3C pattern.

## Follow-up / Câu Hỏi Tiếp Theo

- **Abort old requests**: Use `AbortController` — pass signal to fetch, abort on cleanup
- **Cache results**: `useRef(new Map())` keyed by query string
- **Highlight matching text**: Split `suggestion.label` by `query`, wrap matches in `<mark>`
