# Notification / Toast System / Hệ Thống Thông Báo Toast

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Topics**: React, Context, Portal, Animation, Accessibility
> **See also**: [React Patterns](../03-react/08-react-patterns-advanced.md) | [Accessibility](../14-accessibility/01-wcag-fundamentals.md)

---

## Overview / Tổng Quan

A toast/notification system demonstrates Context API, React Portals, ARIA live regions, and timer management. It is a classic mid-level React coding question.

Đây là bài toán điển hình test hiểu biết về Context (global state), Portal (render outside tree), và accessibility (ARIA live regions). Câu hỏi follow-up thường về animation, queue management, và cách hoạt động cross micro-frontend — chuẩn bị cho cả 3 levels: Junior (giải thích Portal), Mid (animation không gây layout shift), Senior (cross micro-frontend event bus).

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

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| Question | Level | Key Point |
|----------|-------|-----------|
| Why Portal for toasts | 🟢 | Escapes overflow/z-index constraints of parent tree |
| alert vs status ARIA roles | 🟡 | assertive interrupts; polite waits — use alert only for errors |
| Animation without layout shift | 🟡 | transform + opacity only; isLeaving flag for exit |
| Cross micro-frontend toasts | 🔴 | Module-level EventTarget bus, decouple from React tree |

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: Why render toasts in a Portal? / Tại sao render toast trong Portal? 🟢 Junior

**A:** Portals render outside the parent DOM tree, so toasts aren't clipped by `overflow: hidden` ancestors, don't inherit z-index stacking contexts from parent components, and always appear on top regardless of where `useToast()` is called.

Vietnamese: Nếu toast render trong component tree bình thường, nó có thể bị cha ancestor có `overflow: hidden` cắt mất, hoặc bị z-index của container chặn. Portal render thẳng vào `document.body` — đảm bảo toast luôn trên top, không bị clipped. Đây cũng là lý do Dialog, Dropdown, Tooltip đều dùng Portal trong production.

---

### Q: What is the difference between `role="alert"` and `role="status"` for notifications? / Khác nhau giữa `role="alert"` và `role="status"` là gì? 🟡 Mid

**A:** `role="alert"` with `aria-live="assertive"` immediately interrupts screen readers with the message. `role="status"` with `aria-live="polite"` waits until the reader finishes the current sentence. Use alert only for errors; use status for success/info.

Vietnamese: `aria-live="assertive"` (dùng với errors) sẽ ngắt ngang nội dung screen reader đang đọc và đọc notification ngay — quan trọng cho lỗi nghiêm trọng mà user cần biết ngay. `aria-live="polite"` chờ đến lúc screen reader ngừng đọc mới announce — phù hợp với success toast không khẩn cấp. Dùng assertive quá nhiều = UX tệ cho người dùng screen reader vì liên tục bị ngắt.

---

### Q: How would you implement toast animations without causing layout shift? / Implement toast animation thế nào không gây layout shift? 🟡 Mid

**A:** Animate with CSS transforms and opacity only (these don't trigger layout recalculation). For enter: slide in with `transform: translateX(100%)` → `translateX(0)`. For exit: need a "leaving" state — add `isLeaving` flag, apply exit animation class, then remove from DOM after animation ends.

Vietnamese: Dùng `transform` và `opacity` thay vì thay đổi `height`, `margin`, `top` — chỉ trigger composite layer, không gây layout reflow. Exit animation phức tạp hơn: cần delay việc xóa khỏi DOM. Pattern: khi dismiss → set `isLeaving = true` → apply CSS fade-out class → dùng `onAnimationEnd` event → remove toast từ state. Hoặc dùng `framer-motion` `AnimatePresence` để handle enter/exit tự động.

---

### Q: How would you design a toast system that works across micro-frontends or without React context? / Toast system cross micro-frontend hoặc không dùng Context thế nào? 🔴 Senior

**A:** Use an event-bus pattern: a module-level `EventEmitter` (or `CustomEvent` on `window`) decoupled from React. Any micro-frontend can `emit('toast', { message, type })`. A single React listener subscribes and manages the toast state.

Vietnamese: Context chỉ work trong cùng React tree — không cross micro-frontend boundaries. Giải pháp: module-level singleton event bus. Ví dụ: `const toastBus = new EventTarget()`. Bất kỳ đâu trong app (kể cả Angular, Vue, vanilla JS micro-frontend) có thể: `toastBus.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Done', type: 'success' } }))`. React `ToastProvider` dùng `useEffect` để `addEventListener('toast', handler)`. Pattern này cũng hữu ích khi cần trigger toast từ service worker, websocket handler, hay code ngoài React component tree.
