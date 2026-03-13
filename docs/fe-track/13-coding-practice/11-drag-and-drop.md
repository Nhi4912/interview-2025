# Drag and Drop List / Danh Sách Kéo Thả

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Topics**: React, HTML Drag & Drop API, State Management
> **See also**: [Accessibility](../14-accessibility/01-wcag-fundamentals.md) | [Browser APIs](../09-advanced-topics/01-browser-apis.md)

---

## Overview / Tổng Quan

Drag and drop tests knowledge of browser drag events, ref vs state trade-offs, and accessibility alternatives. Production apps typically use `dnd-kit` or `react-beautiful-dnd`, but interviewers often ask you to implement the native API first.

Bài toán này kiểm tra: (1) hiểu HTML5 DnD API event lifecycle, (2) khi dùng ref vs state, (3) accessibility keyboard alternative. Trong phỏng vấn senior, sẽ được hỏi về limitations của native API và lý do chọn library trong production. Nắm vững FLIP animation technique là điểm cộng lớn.

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

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| Question | Level | Key Point |
|----------|-------|-----------|
| Why `preventDefault` in dragOver | 🟢 | Enables drop — browser default disallows it |
| Ref vs state for dragItem | 🟡 | Ref = no re-render for logic; state = re-render for UI indicator |
| HTML5 DnD limitations vs dnd-kit | 🟡 | No touch, no animation, no virtualization, no a11y built-in |
| Kanban multi-column DnD | 🔴 | Store sourceListId in dataTransfer, atomic useReducer update |

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: Why does the HTML5 Drag and Drop API require calling `e.preventDefault()` in `onDragOver`? / Tại sao phải gọi `e.preventDefault()` trong `onDragOver`? 🟢 Junior

**A:** The browser's default behavior for `dragover` is to signal "drop not allowed" (no-drop cursor). Calling `preventDefault()` overrides this and tells the browser the element accepts drops, enabling the `drop` event to fire.

Vietnamese: Mặc định, trình duyệt không cho phép drop vào bất kỳ element nào — cursor hiện biểu tượng cấm và event `drop` không bao giờ fire. `e.preventDefault()` trong `onDragOver` nói với browser "element này chấp nhận drop". Nếu quên gọi `preventDefault()`, `handleDrop` sẽ không được trigger dù code trông đúng.

---

### Q: Why use a ref for `dragItem` instead of state? / Tại sao dùng ref cho `dragItem` thay vì state? 🟡 Mid

**A:** The drag item index is only needed at drop time, not for rendering. Using `useRef` avoids an unnecessary re-render when `dragstart` fires. Only `dragOverIndex` needs to be state because it drives the visual indicator (border highlight) which requires a re-render.

Vietnamese: `dragItem.current` là dữ liệu logic thuần tuý — chỉ cần đọc tại thời điểm `drop`, không cần hiển thị ra UI. Dùng `useState` sẽ trigger re-render khi drag bắt đầu (không cần thiết và tốn hiệu năng). `dragOverIndex` thì khác — nó điều khiển border highlight → cần re-render → phải là state. Đây là pattern chung: dùng ref cho "side data" không ảnh hưởng UI, dùng state cho data ảnh hưởng render.

---

### Q: What are the limitations of the HTML5 Drag and Drop API vs libraries like dnd-kit? / Giới hạn của HTML5 DnD API so với dnd-kit là gì? 🟡 Mid

**A:** HTML5 DnD has poor mobile/touch support (requires separate `touchstart`/`touchmove` handling), no smooth animations, clunky drag image customization, no virtual list support, and accessibility must be hand-coded. Libraries like `dnd-kit` abstract all these concerns.

Vietnamese: HTML5 DnD API có nhiều hạn chế trong production: (1) **Touch**: không hoạt động trên mobile — cần implement riêng với `touchstart`/`touchmove`/`touchend`. (2) **Animation**: không có built-in smooth reorder — cần FLIP technique. (3) **Drag ghost**: khó custom drag preview. (4) **Accessibility**: không có keyboard support built-in — phải tự implement. (5) **Virtual list**: không hỗ trợ drag trong virtualized list. `dnd-kit` giải quyết tất cả và còn tree-shakeable, có collision detection pluggable.

---

### Q: How would you implement drag-and-drop across multiple columns (Kanban board)? / Implement drag-and-drop giữa nhiều cột Kanban thế nào? 🔴 Senior

**A:** Store a `sourceList` and `sourceIndex` in `dataTransfer`, plus a `targetList` id on the drop zone. On drop, remove the item from `sourceList[sourceIndex]` and insert into `targetList[targetIndex]`. Use `useReducer` to manage the multi-column state atomically.

Vietnamese: Kanban board cần track: từ cột nào (`sourceListId`), vị trí nào (`sourceIndex`), và drop vào cột nào (`targetListId`) vị trí nào (`targetIndex`). Encode vào `dataTransfer.setData('application/json', JSON.stringify({ sourceListId, sourceIndex }))`. Trong `handleDrop`, decode và update state: `{ ...columns, [sourceListId]: remove(item), [targetListId]: insert(item, targetIndex) }`. Dùng `useReducer` để atomic update nhiều columns cùng lúc. Nên dùng `immer` để tránh deep clone bug. Production app: `dnd-kit` với `DndContext`, `SortableContext` per column, `useSortable` per item — 10x ít code hơn custom.
