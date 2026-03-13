# Autocomplete Component / Component Tìm Kiếm Gợi Ý

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Topics**: React, Hooks, Debounce, Accessibility, ARIA
> **See also**: [Accessibility ARIA](../14-accessibility/02-aria-comprehensive.md) | [Debounce/Throttle](./02-debounce-throttle.md)

---

## Overview / Tổng Quan

Autocomplete combines debouncing, race condition prevention, keyboard navigation, and ARIA accessibility. It is one of the most common frontend coding challenges in interviews at all levels.

Đây là bài toán điển hình trong interview vì test nhiều kỹ năng cùng lúc: async/debounce, race condition, keyboard UX, và accessibility. Interviewer thường bắt đầu yêu cầu cơ bản rồi tăng dần — "bây giờ thêm cache", "bây giờ handle keyboard navigation". Cần nắm chắc ARIA combobox pattern để giải thích accessibility.

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

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| Question | Level | Key Point |
|----------|-------|-----------|
| Race condition fix | 🟡 | `cancelled` flag or `AbortController` in cleanup |
| `onBlur` setTimeout | 🟡 | mousedown fires before blur — 150ms delay prevents swallowed click |
| Cache results | 🟡 | `useRef(Map)` — persists, no re-render |
| ARIA combobox pattern | 🔴 | combobox + listbox + option + aria-activedescendant |

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What is a race condition in autocomplete and how do you fix it? / Race condition trong autocomplete là gì và sửa thế nào? 🟡 Mid

**A:** When the user types quickly, multiple fetch requests are in-flight simultaneously. A slow earlier request can resolve after a faster later one, overwriting correct results with stale data. Fix: use a `cancelled` flag (or `AbortController`) so only the latest request's results are applied.

Vietnamese: Race condition xảy ra khi user gõ nhanh → request A và B cùng in-flight → B resolve trước (kết quả đúng) → A resolve sau và ghi đè kết quả. Fix đơn giản: dùng biến `cancelled = true` trong cleanup của `useEffect` — khi effect cleanup chạy (query thay đổi), nó set flag, và `.then()` của request cũ sẽ không gọi `setSuggestions`. Cách mạnh hơn: `AbortController` + `fetch(url, { signal })` → thực sự cancel network request, tiết kiệm bandwidth.

---

### Q: Why use `onBlur` with `setTimeout` instead of closing immediately? / Tại sao dùng `onBlur` với `setTimeout` thay vì đóng ngay? 🟡 Mid

**A:** When a user clicks a suggestion in the dropdown list, `onBlur` fires on the input before `onClick` on the list item. Without the delay, the list closes and swallows the click. The 150ms delay gives the `onMouseDown` handler on the list item time to fire first.

Vietnamese: Thứ tự sự kiện khi click vào suggestion: `mousedown` → `blur` (input mất focus) → `mouseup` → `click`. Nếu `onBlur` đóng dropdown ngay lập tức, list biến mất trước khi `click` trên item kịp fire → user không chọn được gì. Delay 150ms cho phép `onMouseDown` (đứng trước `blur` trong chuỗi events) xử lý việc chọn item trước. Đây là pattern phổ biến trong tất cả các dropdown/autocomplete implementations.

---

### Q: How would you cache autocomplete results to avoid redundant API calls? / Cache kết quả autocomplete thế nào để tránh gọi API thừa? 🟡 Mid

**A:** Use a `useRef(new Map())` as an in-memory cache keyed by query string. Before fetching, check the cache; on success, store the result. This persists across re-renders without causing re-renders itself.

Vietnamese: Dùng `useRef` để tạo cache không gây re-render: `const cache = useRef(new Map<string, Suggestion[]>())`. Trong effect: nếu `cache.current.has(query)` thì set state ngay từ cache, không fetch. Sau khi fetch thành công: `cache.current.set(query, results)`. Cache này sống trong suốt vòng đời component — nếu cần cache cross-component hoặc persist, nâng lên Context/module-level Map hoặc dùng React Query với `staleTime`.

---

### Q: How do you make autocomplete accessible for screen readers? / Làm autocomplete accessible cho screen reader thế nào? 🔴 Senior

**A:** Follow the ARIA combobox pattern: `role="combobox"` on input, `aria-expanded`, `aria-controls` pointing to the listbox, `role="listbox"` on the list, `role="option"` on each item, and `aria-activedescendant` on the input pointing to the highlighted option's id.

Vietnamese: ARIA combobox pattern (W3C ARIA 1.2): Input có `role="combobox"`, `aria-expanded={isOpen}`, `aria-controls="listbox-id"`, `aria-activedescendant="option-id-of-highlighted"`. List có `role="listbox"`, mỗi item có `role="option"` và `aria-selected`. Screen reader sẽ announce: "combobox, collapsed" khi đóng, và khi navigate bằng arrow keys sẽ đọc tên option đang active. Ngoài ra: `aria-live="polite"` cho loading state, và đảm bảo list nhận focus không bị mất khi keyboard navigate.
