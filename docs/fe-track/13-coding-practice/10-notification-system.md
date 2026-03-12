# Notification / Toast System / Hệ Thống Thông Báo Toast

> **Track**: FE | **Difficulty**: 🟡 Medium
> **Topics**: React, Context, Portal, Animation, Accessibility

---

## Problem / Bài Toán

Build a notification/toast system that can be triggered from anywhere in the app.

**Requirements:**
- Show multiple toasts simultaneously
- Types: success, error, warning, info
- Auto-dismiss after timeout (configurable)
- Manual dismiss button
- Accessible (ARIA live regions)
- Render in portal (outside React tree root)

---

## Solution / Giải Pháp

```tsx
import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration: number  // ms, 0 = persistent
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const COLORS: Record<ToastType, string> = {
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (toast.duration > 0) {
      timerRef.current = setTimeout(() => onDismiss(toast.id), toast.duration)
    }
    return () => clearTimeout(timerRef.current)
  }, [toast.id, toast.duration, onDismiss])

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      style={{
        padding: '12px 16px',
        marginBottom: 8,
        borderRadius: 6,
        background: COLORS[toast.type],
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minWidth: 280,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      <span>{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 12 }}
      >
        ×
      </button>
    </div>
  )
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return createPortal(
    <div
      aria-label="Notifications"
      style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

// Usage anywhere in app:
// const { toast } = useToast()
// toast('Order saved!', 'success')
// toast('Network error', 'error', 0)  // persistent until dismissed
```

## Key Points / Điểm Quan Trọng

**Portal**: Renders outside app root → not clipped by `overflow: hidden` parents, always on top.

**ARIA live regions**: `role="alert"` + `aria-live="assertive"` for errors (interrupts), `role="status"` + `aria-live="polite"` for non-critical.

**Cleanup timer**: `useEffect` cleanup clears timeout if toast dismissed early — prevents double-dismiss.

## Follow-up / Câu Hỏi Tiếp Theo

- **Animation**: CSS `@keyframes` slide-in on mount, fade-out before dismiss
- **Queue limit**: Keep max 5 toasts; oldest auto-dismissed when new one arrives
- **Pause on hover**: `onMouseEnter` clears timer, `onMouseLeave` restarts it
