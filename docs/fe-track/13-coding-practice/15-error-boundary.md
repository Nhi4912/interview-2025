# React Error Boundary / Xử Lý Lỗi với Error Boundary

> **Track**: FE | **Difficulty**: 🟡 Medium
> **Topics**: React, Error Handling, Class Components, Error Recovery

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
