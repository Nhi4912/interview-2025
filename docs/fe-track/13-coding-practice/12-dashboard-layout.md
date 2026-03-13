# Responsive Dashboard Layout / Bố Cục Dashboard Responsive

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Topics**: CSS Grid, Flexbox, Responsive Design, CSS Variables
> **See also**: [CSS Architecture](../05-html-css/02-css-architecture.md) | [Core Web Vitals](../06-browser-performance/01-core-web-vitals.md)

---

## Overview / Tổng Quan

Dashboard layout combines CSS Grid named areas, responsive breakpoints, and state management for widget data. It tests both CSS skills and React patterns for real-world admin interfaces.

Bài này kiểm tra: (1) CSS Grid advanced — named areas, auto-fill vs auto-fit, (2) responsive design — mobile-first vs desktop-first, (3) React state management cho widgets — local vs lifted vs global. Senior level: hỏi về data refresh strategies (polling, SSE, WebSocket), layout shift prevention, và performance với nhiều widgets.

---

## Problem / Bài Toán

Build a responsive dashboard with sidebar, header, and main content area using CSS Grid.

**Requirements:**
- Sidebar collapses on mobile
- Grid layout with named areas
- Sticky header
- Cards in main area adapt to available space

---

## Solution / Giải Pháp

```css
/* dashboard.module.css */
.layout {
  display: grid;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  grid-template-columns: 240px 1fr;
  grid-template-rows: 60px 1fr;
  min-height: 100vh;
}

.sidebar {
  grid-area: sidebar;
  background: #1f2937;
  color: #fff;
  padding: 24px 16px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.header {
  grid-area: header;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 24px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
}

.main {
  grid-area: main;
  padding: 24px;
  overflow-y: auto;
}

/* Cards grid: auto-fill columns, min 280px each */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

/* Mobile: collapse sidebar */
@media (max-width: 768px) {
  .layout {
    grid-template-areas:
      "header"
      "main";
    grid-template-columns: 1fr;
    grid-template-rows: 60px 1fr;
  }

  .sidebar {
    display: none; /* or use a drawer/toggle */
  }

  .sidebar.open {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 240px;
    height: 100vh;
    z-index: 100;
  }
}
```

```tsx
import { useState } from 'react'
import styles from './dashboard.module.css'

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/analytics">Analytics</a>
          <a href="/settings">Settings</a>
        </nav>
      </aside>

      <header className={styles.header}>
        <button
          className={styles.menuButton}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          ☰
        </button>
        <h1>Dashboard</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.cards}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              Card {i}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
```

## Key Points / Điểm Quan Trọng

**`grid-template-areas`**: Named areas make layout intent readable. Changing layout for mobile = just redefine the areas.

**`auto-fill` vs `auto-fit`**: 
- `auto-fill`: keeps empty columns (doesn't stretch)
- `auto-fit`: collapses empty columns, last card stretches to fill

**Sticky header + sidebar**: `position: sticky` for sidebar requires `height: 100vh` on the element itself. Header uses `z-index` to stay above content.

## Follow-up / Câu Hỏi Tiếp Theo

- **Resizable sidebar**: CSS `resize: horizontal` or drag handle with `mousemove` listener
- **Dark mode**: CSS custom properties + `prefers-color-scheme` media query
- **Skeleton loading**: CSS animation `@keyframes pulse` on placeholder cards

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What is the difference between `auto-fill` and `auto-fit` in CSS Grid? / `auto-fill` và `auto-fit` khác nhau thế nào? 🟢 Junior

**A:** Both create as many columns as fit the container. `auto-fill` preserves empty tracks (columns remain even with no content). `auto-fit` collapses empty tracks and stretches remaining items to fill the row.

Vietnamese: `auto-fill`: giữ nguyên cột rỗng — items không giãn dài ra. Dùng khi muốn preserve grid alignment với content chưa load. `auto-fit`: xóa cột rỗng — item cuối cùng giãn ra fill hết row. Dùng khi muốn responsive cards luôn fill toàn bộ chiều rộng container. Ví dụ dashboard: `repeat(auto-fill, minmax(280px, 1fr))` — khi màn hình rộng 600px chứa được 2 cards 280px, cột thứ 3 vẫn tồn tại nhưng rỗng (auto-fill) hoặc không tồn tại (auto-fit).

---

### Q: How do you manage state for multiple dashboard widgets? / Quản lý state cho nhiều widget dashboard thế nào? 🟡 Mid

**A:** Use co-located state for widget-local data (e.g., whether a widget is collapsed). Lift state up to the dashboard when widgets need to share data. Use React Query or SWR per widget for server data — each widget manages its own fetch lifecycle independently.

Vietnamese: Ba mức state trong dashboard: (1) **Widget-local**: collapsed state, active tab → dùng `useState` trong widget component. (2) **Layout level**: widget order, grid positions → lift lên Dashboard component hoặc persist to localStorage. (3) **Server data**: mỗi widget fetch riêng với React Query `useQuery(widgetKey)` — independent refetch, caching, error boundary. Tránh một global store lớn cho tất cả widgets — coupling cao, khó test riêng lẻ.

---

### Q: How would you implement data refresh strategies for a live dashboard? / Implement data refresh cho live dashboard thế nào? 🔴 Senior

**A:** Four strategies by use case: polling (simple, high latency), smart polling with `visibilitychange` (pause when tab hidden), SSE for server-pushed updates, WebSocket for bidirectional realtime.

```ts
// Smart polling: pause when tab hidden
useEffect(() => {
  let interval: ReturnType<typeof setInterval>
  const start = () => { interval = setInterval(refetch, 30_000) }
  const stop  = () => clearInterval(interval)

  document.addEventListener('visibilitychange', () =>
    document.hidden ? stop() : start()
  )
  start()
  return stop
}, [refetch])

// SSE: server pushes updates
useEffect(() => {
  const es = new EventSource('/api/dashboard/stream')
  es.onmessage = e => setMetrics(JSON.parse(e.data))
  es.onerror   = () => es.close()
  return () => es.close()
}, [])
```

Vietnamese: Trade-off rõ ràng: Polling đơn giản nhưng lãng phí (poll dù không có gì mới). Smart polling + `visibilitychange` tiết kiệm mobile battery. SSE tốt cho server-push một chiều (metrics, notifications). WebSocket cho collaborative features (nhiều user cùng xem dashboard). Production dashboards như Grafana/Datadog dùng WebSocket cho realtime metrics vì latency thấp và server có thể push batch updates theo rate phù hợp.

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| Question | Level | Key Point |
|----------|-------|-----------|
| auto-fill vs auto-fit | 🟢 | auto-fit collapses empty tracks; auto-fill preserves them |
| Widget state management | 🟡 | Local state → lifted state → React Query per widget |
| Live data refresh strategies | 🔴 | Polling → smart polling → SSE → WebSocket (by latency/complexity need) |
