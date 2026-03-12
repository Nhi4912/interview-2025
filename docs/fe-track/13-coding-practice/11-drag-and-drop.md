# Drag and Drop List / Danh Sách Kéo Thả

> **Track**: FE | **Difficulty**: 🔴 Hard
> **Topics**: React, HTML Drag & Drop API, State Management

---

## Problem / Bài Toán

Build a reorderable list using the HTML5 Drag and Drop API (no external libraries).

**Requirements:**
- Drag items to reorder
- Visual indicator of drop target position
- Keyboard accessible alternative
- Works on touch devices (bonus)

---

## Solution / Giải Pháp

```tsx
import { useState, useRef, DragEvent } from 'react'

interface Item { id: string; content: string }

export function DraggableList({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState(initialItems)
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (e: DragEvent, index: number) => {
    dragItem.current = index
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index)) // required for Firefox
  }

  const handleDragOver = (e: DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    dragOverItem.current = index
    setDragOverIndex(index)
  }

  const handleDrop = (e: DragEvent, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = dragItem.current
    if (dragIndex === null || dragIndex === dropIndex) return

    const newItems = [...items]
    const [dragged] = newItems.splice(dragIndex, 1)
    newItems.splice(dropIndex, 0, dragged)
    setItems(newItems)

    dragItem.current = null
    dragOverItem.current = null
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDragOverIndex(null)
    dragItem.current = null
  }

  // Keyboard reorder: Alt+ArrowUp/Down
  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= items.length) return
    const newItems = [...items]
    ;[newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]]
    setItems(newItems)
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }} aria-label="Reorderable list">
      {items.map((item, i) => (
        <li
          key={item.id}
          draggable
          onDragStart={e => handleDragStart(e, i)}
          onDragOver={e => handleDragOver(e, i)}
          onDrop={e => handleDrop(e, i)}
          onDragEnd={handleDragEnd}
          onKeyDown={e => {
            if (e.altKey && e.key === 'ArrowUp') { e.preventDefault(); moveItem(i, 'up') }
            if (e.altKey && e.key === 'ArrowDown') { e.preventDefault(); moveItem(i, 'down') }
          }}
          tabIndex={0}
          aria-label={`${item.content}. Use Alt+Arrow to reorder.`}
          style={{
            padding: 12,
            marginBottom: 4,
            background: '#fff',
            border: `2px solid ${dragOverIndex === i ? '#0070f3' : '#e5e7eb'}`,
            borderRadius: 6,
            cursor: 'grab',
            userSelect: 'none',
          }}
        >
          ⠿ {item.content}
        </li>
      ))}
    </ul>
  )
}
```

## Key Points / Điểm Quan Trọng

**`e.dataTransfer.setData`**: Firefox requires setting data in `dragstart` to allow drop.

**`dragOverIndex` state vs `dragOverItem` ref**: Use ref for the actual logic (no re-render cost), state for visual indicator (triggers re-render).

**Keyboard alternative**: Drag-only is inaccessible. Alt+Arrow is a simple keyboard equivalent.

## Follow-up / Câu Hỏi Tiếp Theo

- **Multiple lists**: Track `listId` in dataTransfer to move items between lists
- **React DnD / dnd-kit**: Production apps use these libraries — they handle touch, keyboard, and accessibility much better
- **Smooth reorder animation**: `Flip` technique with `useLayoutEffect` + `transform` for smooth repositioning
