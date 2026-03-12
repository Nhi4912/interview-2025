# Responsive Dashboard Layout / Bố Cục Dashboard Responsive

> **Track**: FE | **Difficulty**: 🟢 Easy → 🟡 Medium
> **Topics**: CSS Grid, Flexbox, Responsive Design, CSS Variables

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
