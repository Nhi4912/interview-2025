# Infinite Scroll List / Danh Sách Cuộn Vô Tận

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Topics**: React, IntersectionObserver, Pagination, Performance
> **See also**: [Browser APIs](../09-advanced-topics/01-browser-apis.md) | [Core Web Vitals](../06-browser-performance/01-core-web-vitals.md)

---

## Problem / Bài Toán

Build an infinite scroll list that loads more items when the user scrolls to the bottom.

**Requirements:**
- Load next page when sentinel element enters viewport
- Show loading state between pages
- Handle errors gracefully
- No layout shift when new items load

---

## Solution / Giải Pháp

```tsx
import { useState, useEffect, useRef, useCallback } from 'react'

interface Page<T> { items: T[]; nextCursor: string | null }

function useInfiniteScroll<T>(fetchPage: (cursor: string | null) => Promise<Page<T>>) {
  const [items, setItems] = useState<T[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    setError(null)
    try {
      const page = await fetchPage(cursor)
      setItems(prev => [...prev, ...page.items])
      setCursor(page.nextCursor)
      setHasMore(page.nextCursor !== null)
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  }, [cursor, hasMore, isLoading, fetchPage])

  // Load initial page
  useEffect(() => { loadMore() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { items, isLoading, hasMore, error, loadMore }
}

// Sentinel component: calls onVisible when it enters the viewport
function Sentinel({ onVisible }: { onVisible: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onVisible() },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [onVisible])

  return <div ref={ref} style={{ height: 1 }} />
}

// Usage
interface Post { id: string; title: string }

async function fetchPosts(cursor: string | null): Promise<Page<Post>> {
  const url = cursor ? `/api/posts?cursor=${cursor}` : '/api/posts'
  const res = await fetch(url)
  return res.json()
}

export function PostList() {
  const { items, isLoading, hasMore, error, loadMore } = useInfiniteScroll(fetchPosts)

  return (
    <div>
      {items.map(post => (
        <div key={post.id} style={{ padding: 16, borderBottom: '1px solid #eee' }}>
          {post.title}
        </div>
      ))}

      {error && (
        <div>
          Error loading posts. <button onClick={loadMore}>Retry</button>
        </div>
      )}

      {isLoading && <div aria-live="polite">Loading more...</div>}

      {/* Sentinel triggers loadMore when it enters viewport */}
      {hasMore && !isLoading && <Sentinel onVisible={loadMore} />}

      {!hasMore && <div>No more posts</div>}
    </div>
  )
}
```

## Key Points / Điểm Quan Trọng

**IntersectionObserver vs scroll event**: IO is more performant — fires off main thread, no throttling needed.

**Cursor-based pagination** vs offset-based:
- Offset: `?page=3` — breaks if items added/removed between pages
- Cursor: `?cursor=abc123` — stable, consistent even with real-time data

**Guard `isLoading || !hasMore`**: Prevents multiple concurrent requests when sentinel is visible during slow load.

## Follow-up / Câu Hỏi Tiếp Theo

- **Virtualization**: For very long lists (10k+ items), use `react-window` — only render visible rows
- **Scroll restoration**: Save scroll position to `sessionStorage` on navigate away, restore on back
- **Optimistic prepend**: New items added to top — use `flex-direction: column-reverse` trick

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: Why use IntersectionObserver instead of a scroll event listener? / Tại sao dùng IntersectionObserver thay vì scroll event? 🟢 Junior

**A:** `IntersectionObserver` fires only when the target element enters/exits the viewport, not on every scroll tick. It runs off the main thread and requires no throttling or `getBoundingClientRect()` calls.

Vietnamese: Scroll event bắn liên tục khi cuộn (60fps = 60 events/giây), buộc phải throttle và gọi `getBoundingClientRect()` gây reflow. `IntersectionObserver` chỉ fire khi element thực sự vào/ra viewport, không cần throttle, không block main thread. Kết quả: ít CPU hơn, không gây jank. Đây là lý do tất cả infinite scroll hiện đại dùng IO thay vì scroll listener.

---

### Q: What is cursor-based pagination and why is it better than offset pagination for infinite scroll? / Cursor-based pagination là gì và tại sao tốt hơn offset? 🟡 Mid

**A:** Cursor-based pagination uses an opaque pointer to the last item (e.g., a timestamp or ID) rather than a row offset. It remains consistent when items are inserted or deleted between pages, avoiding duplicate or skipped items.

Vietnamese: Offset pagination (`?page=3&limit=20`) có vấn đề: nếu ai đó post item mới trong khi user đang scroll, tất cả items dịch xuống 1 vị trí → page 3 bây giờ overlap với page 2 → user thấy item trùng. Cursor pagination (`?cursor=last_item_id`) luôn chính xác: "cho tôi 20 items sau item X" — không quan tâm đến items mới thêm vào. Ngoài ra, cursor pagination hiệu quả hơn với DB: dùng index seek thay vì `OFFSET 60 LIMIT 20` (OFFSET phải đọc và bỏ 60 rows đầu).

---

### Q: How would you add virtualization to an infinite scroll list with 50,000 items? / Thêm virtualization vào infinite scroll với 50,000 items thế nào? 🔴 Senior

**A:** Use `react-window` or `react-virtual`. Instead of rendering all items, render only the ~10–20 visible rows plus an overscan buffer. Combine with infinite loading by triggering fetch when the user scrolls within N items of the loaded boundary.

Vietnamese: Render 50,000 DOM nodes sẽ làm trang lag nặng — mỗi node chiếm bộ nhớ và layout cost. `react-window` chỉ render số rows visible trên màn hình (~20–30) + overscan (5 trên/dưới). Để kết hợp với infinite scroll: dùng `VariableSizeList` hoặc `InfiniteLoader` từ `react-window-infinite-loader` — nó expose `isItemLoaded(index)` và `loadMoreItems(startIndex, stopIndex)` callback. Khi user scroll đến index 95/100 items đã load → trigger fetch page tiếp theo. Key challenge: items có dynamic height → dùng `VariableSizeList` với `itemSize` function đo height sau render.

---

## Interview Q&A Summary / Tổng Kết

| Question | Level | Key Point |
|----------|-------|-----------|
| IntersectionObserver vs scroll event | 🟢 | IO is off-thread, no throttling needed |
| Cursor vs offset pagination | 🟡 | Cursor is stable with real-time inserts |
| Virtualization with 50k items | 🔴 | react-window renders only visible rows |
