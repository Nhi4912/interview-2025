# Undo / Redo / Hoàn Tác và Làm Lại

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Topics**: React, Command Pattern, History Stack
> **See also**: [Custom Hooks](./14-custom-hook.md) | [State Management](../03-react/05-state-management.md)

---

## Overview / Tổng Quan

Undo/redo is a fundamental UI pattern for any editor or collaborative tool. The three-stack model (past / present / future) is the standard approach in React.

Đây là pattern xuất hiện trong phỏng vấn cho vị trí mid-senior frontend, đặc biệt khi ứng tuyển vào Notion, Figma, hoặc bất kỳ productivity tool nào. Trade-off chính: granularity (số bước undo) vs memory, và complexity khi kết hợp với collaborative editing.

---

## Problem / Bài Toán

Implement undo/redo for a text editor or canvas using the Command pattern.

**Requirements:**
- Undo last action (Ctrl+Z)
- Redo undone action (Ctrl+Y / Ctrl+Shift+Z)
- History stack with configurable max size
- Show undo/redo availability

---

## Solution / Giải Pháp

```tsx
import { useState, useCallback, useEffect } from 'react'

// Generic history hook
function useHistory<T>(initialState: T, maxHistory = 50) {
  const [past, setPast] = useState<T[]>([])
  const [present, setPresent] = useState<T>(initialState)
  const [future, setFuture] = useState<T[]>([])

  const set = useCallback((newState: T) => {
    setPast(prev => {
      const next = [...prev, present]
      return next.length > maxHistory ? next.slice(-maxHistory) : next
    })
    setPresent(newState)
    setFuture([]) // clear redo stack on new action
  }, [present, maxHistory])

  const undo = useCallback(() => {
    if (past.length === 0) return
    const previous = past[past.length - 1]
    setPast(prev => prev.slice(0, -1))
    setFuture(prev => [present, ...prev])
    setPresent(previous)
  }, [past, present])

  const redo = useCallback(() => {
    if (future.length === 0) return
    const next = future[0]
    setFuture(prev => prev.slice(1))
    setPast(prev => [...prev, present])
    setPresent(next)
  }, [future, present])

  return {
    state: present,
    set,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    historySize: past.length,
  }
}

// Usage: text editor with undo/redo
export function TextEditor() {
  const { state: text, set, undo, redo, canUndo, canRedo } = useHistory('')

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [undo, redo])

  return (
    <div>
      <div style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
        <button onClick={undo} disabled={!canUndo} aria-label="Undo (Ctrl+Z)">↩ Undo</button>
        <button onClick={redo} disabled={!canRedo} aria-label="Redo (Ctrl+Y)">↪ Redo</button>
      </div>
      <textarea
        value={text}
        onChange={e => set(e.target.value)}
        rows={10}
        cols={50}
        placeholder="Type here... (Ctrl+Z to undo)"
      />
    </div>
  )
}
```

## Key Points / Điểm Quan Trọng

**Three-array model** (past / present / future):
```
Undo: [A, B, C] | D | []  →  [A, B] | C | [D]
Redo: [A, B] | C | [D]   →  [A, B, C] | D | []
New action: clears future stack
```

**Max history limit**: Slice from the front — keep most recent N states.

**Granularity matters**: For text editors, recording every keystroke creates too many undo steps. Consider debouncing: save to history only when user pauses typing (300ms).

## Follow-up / Câu Hỏi Tiếp Theo

- **Batch operations**: Group multiple changes into one undo step (e.g., select-all + type)
- **Persistent undo**: Serialize history to `localStorage` — survives page refresh
- **Collaborative editing**: Operational Transform (OT) or CRDT — undo becomes much more complex

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| Question | Level | Key Point |
|----------|-------|-----------|
| Data structure for undo/redo | 🟢 | Two stacks: past + future, present separate |
| Prevent memory overflow | 🟡 | Cap history, store diffs not full snapshots |
| Why debounce keystrokes | 🟡 | One word = one undo step, not one char |
| Collaborative undo (Google Docs) | 🔴 | Per-user undo via OT/CRDT transform |

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What data structure underlies undo/redo? / Cấu trúc dữ liệu nào dùng cho undo/redo? 🟢 Junior

**A:** Two stacks: a past stack and a future stack, with the current state held separately.

Vietnamese: Undo/redo dùng mô hình 3 phần: `past[]` (ngăn xếp các state cũ), `present` (state hiện tại), `future[]` (ngăn xếp các state đã undo). Khi undo: pop từ `past`, push `present` vào `future`. Khi redo: pop từ `future`, push `present` vào `past`. Khi có action mới: push `present` vào `past` và xóa sạch `future`.

---

### Q: How do you prevent undo history from consuming too much memory? / Làm thế nào tránh history chiếm quá nhiều bộ nhớ? 🟡 Mid

**A:** Cap the history stack with a `maxHistory` limit, slicing from the front to keep only the most recent N entries. For large objects, store diffs/patches instead of full state snapshots.

Vietnamese: Có hai chiến lược: (1) **Giới hạn số bước** — `maxHistory = 50`, khi vượt quá thì cắt phần đầu. (2) **Lưu diff thay vì snapshot** — thay vì lưu toàn bộ state, lưu delta giữa các bước (dùng `immer` hoặc JSON Patch). Với canvas/drawing app có nhiều objects lớn, diff thường tiết kiệm 10–100x bộ nhớ so với snapshot đầy đủ.

---

### Q: Why should text editors debounce history saves instead of saving on every keystroke? / Tại sao text editor nên debounce thay vì lưu mỗi keystroke? 🟡 Mid

**A:** Saving every character creates 100+ undo steps per word — Ctrl+Z would undo one letter at a time, which is a poor UX. Debouncing 300–500ms groups a burst of typing into one history entry.

Vietnamese: Nếu lưu mỗi ký tự, người dùng gõ "hello" → cần nhấn Ctrl+Z 5 lần chỉ để xoá một từ. Thay vào đó, debounce 300ms: chỉ commit vào history khi user dừng gõ ≥300ms. Một số editor dùng heuristic thông minh hơn: commit khi gặp space/newline (ranh giới từ), hoặc sau mỗi 2 giây gõ liên tục. Đây là trade-off giữa granularity và usability.

---

### Q: How does undo/redo work in collaborative real-time editors like Google Docs? / Undo/redo trong Google Docs hoạt động thế nào? 🔴 Senior

**A:** In collaborative editing, undo must only undo the current user's own changes, not other users'. This requires Operational Transform (OT) or CRDT to transform undo operations against concurrent changes.

Vietnamese: Undo trong Google Docs là **per-user undo** — chỉ hoàn tác thay đổi của bạn, không ảnh hưởng đến thay đổi của người khác đang làm việc cùng. Để làm điều này, hệ thống dùng **Operational Transform**: khi bạn undo một operation cũ, operation đó phải được transform qua tất cả các operations của người khác đã xảy ra sau đó. Với CRDT, mỗi change có ID duy nhất → undo = đánh dấu change đó là "withdrawn" và merge state không gồm change đó. Đây là lý do xây dựng collaborative undo rất khó — phải giải quyết vấn đề causality và concurrency.
