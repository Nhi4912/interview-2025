# React Error Boundary / Xử Lý Lỗi với Error Boundary

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Topics**: React, Error Handling, Class Components, Error Recovery
> **See also**: [React Fundamentals](../03-react/01-react-fundamentals.md) | [React 19 Features](../03-react/02-react-19-features.md)

---

## Overview / Tổng Quan

Error Boundaries are React's mechanism for catching render-phase errors and displaying graceful fallbacks. They must be class components — this is a frequent interview knowledge-check.

Đây là chủ đề hay xuất hiện trong interview React mid/senior vì: (1) test hiểu biết về lifecycle methods, (2) câu hỏi kinh điển "tại sao phải là class component", (3) câu hỏi production "bạn sẽ structure ErrorBoundary thế nào cho app 100+ pages". Nắm rõ sự khác biệt giữa `getDerivedStateFromError` và `componentDidCatch` là điểm then chốt.

---

## Problem / Bài Toán

Implement an Error Boundary that catches render errors, shows a fallback UI, and reports to an error service.

**Requirements:**
- Catch errors in child component tree
- Show friendly fallback UI (not white screen)
- Option to retry/reset
- Report errors to monitoring service (Sentry-style)

---

## Solution / Giải Pháp

```tsx
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode)
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

// Error boundaries MUST be class components (as of React 18)
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
    this.reset = this.reset.bind(this)
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state to show fallback UI on next render
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Report to monitoring service
    this.props.onError?.(error, errorInfo)

    // Log to Sentry or similar
    console.error('ErrorBoundary caught:', error, errorInfo.componentStack)
  }

  reset() {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const { fallback } = this.props

      if (typeof fallback === 'function') {
        return fallback(this.state.error, this.reset)
      }

      if (fallback) {
        return fallback
      }

      // Default fallback
      return (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p style={{ color: '#666' }}>{this.state.error.message}</p>
          <button onClick={this.reset}>Try again</button>
        </div>
      )
    }

    return this.props.children
  }
}

// Functional wrapper for simpler usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: Props['fallback']
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

// Usage 1: wrap entire section
function App() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div>
          <p>Error: {error.message}</p>
          <button onClick={reset}>Retry</button>
        </div>
      )}
      onError={(error, info) => {
        // Send to Sentry
        // Sentry.captureException(error, { extra: info })
        console.error(error, info)
      }}
    >
      <UserProfile />
    </ErrorBoundary>
  )
}

// Usage 2: HOC
const SafeUserProfile = withErrorBoundary(UserProfile)
```

## Key Points / Điểm Quan Trọng

**Error boundaries only catch render errors**: They do NOT catch errors in:
- Event handlers (use try/catch)
- Async code (`setTimeout`, `Promise`)
- Server-side rendering
- Errors in the boundary itself

**`getDerivedStateFromError` vs `componentDidCatch`**:
- `getDerivedStateFromError`: called during render phase → update state to show fallback
- `componentDidCatch`: called after commit phase → side effects (logging, reporting)

**React 19**: A `use()` hook and `<Await>` component are coming — but class-based Error Boundaries remain required for catching synchronous render errors.

## Follow-up / Câu Hỏi Tiếp Theo

- **Per-route boundaries**: Wrap each page with its own boundary to isolate failures
- **`react-error-boundary` library**: Provides functional API, `useErrorBoundary()` hook
- **Async error catching**: Combine with ErrorBoundary by calling `setState` from async catch blocks

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What errors does an Error Boundary NOT catch? / Error Boundary không bắt được những lỗi nào? 🟢 Junior

**A:** Error boundaries only catch errors during rendering, in lifecycle methods, and in constructors of child components. They do NOT catch: errors in event handlers, asynchronous code (setTimeout, Promises), server-side rendering errors, or errors thrown in the boundary itself.

Vietnamese: Đây là câu hỏi hay trong phỏng vấn — nhiều người nhầm nghĩ ErrorBoundary bắt tất cả lỗi. Thực tế chỉ bắt lỗi trong **render phase**: `render()`, `getDerivedStateFromProps()`, và constructor. Lỗi trong **event handler** (onClick, onChange) phải dùng try/catch thông thường. Lỗi trong **async** (fetch, setTimeout) cũng không bị bắt — nhưng có trick: gọi `setState` trong catch block với `throw` tái phát lỗi để ErrorBoundary catch.

---

### Q: Why must Error Boundaries be class components? / Tại sao Error Boundary phải là class component? 🟡 Mid

**A:** Error boundaries require `getDerivedStateFromError` (to update state during the error render) and `componentDidCatch` (for side effects post-commit). React has not yet provided hook equivalents — there is no `useErrorBoundary()` in React core as of React 18.

Vietnamese: `getDerivedStateFromError` là static method của class component — nó chạy trong **render phase** và phải là pure (không side effects). Hooks không thể làm điều này vì hooks không có cơ chế để intercept render phase errors. `react-error-boundary` library cung cấp functional wrapper nhưng bên trong vẫn dùng class component. React 19 đang nghiên cứu hook-based error boundaries nhưng chưa release. Câu trả lời ngắn: đây là limitation hiện tại của React, không phải design choice vĩnh viễn.

---

### Q: How do you structure Error Boundaries for a large production app? / Cấu trúc Error Boundary thế nào cho production app lớn? 🔴 Senior

**A:** Use multiple granular boundaries: one at the app root (last resort), one per route/page (isolate page failures), and targeted ones around unreliable widgets (third-party embeds, complex charts). Each should report to monitoring (Sentry) with the relevant context.

Vietnamese: Nguyên tắc: **một ErrorBoundary = một isolation unit**. Kiến trúc tiêu chuẩn: (1) **Root level** — bắt catastrophic failures, hiện "Something went wrong" toàn trang. (2) **Route level** — wrap mỗi page/feature module, chỉ break page đó không ảnh hưởng navigation. (3) **Widget level** — wrap third-party charts, maps, video players — những thứ hay crash nhất. Mỗi boundary nên có `onError` callback gọi `Sentry.captureException(error, { extra: { componentStack } })` với context phù hợp (route, user ID, feature flag). Khi reset, invalidate relevant queries (React Query `queryClient.invalidateQueries`) để tự fetch lại data.

---

## Interview Q&A Summary / Tổng Kết

| Question | Level | Key Point |
|----------|-------|-----------|
| What errors aren't caught | 🟢 | Event handlers, async, SSR, self-errors |
| Why class component required | 🟡 | `getDerivedStateFromError` runs in render phase — no hook equivalent |
| Production boundary structure | 🔴 | Root + route + widget layers, each with Sentry reporting |
