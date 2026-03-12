# Undo / Redo / Hoàn Tác và Làm Lại

> **Track**: FE | **Difficulty**: 🟡 Medium
> **Topics**: React, Command Pattern, History Stack

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
