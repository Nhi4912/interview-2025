# Infinite Scroll List / Danh Sách Cuộn Vô Tận

> **Track**: FE | **Difficulty**: 🟡 Medium
> **Topics**: React, IntersectionObserver, Pagination, Performance

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
