# React Testing / Kiểm Thử React
## React - Chapter 6 / React - Chương 6

[Back to Table of Contents](../00-table-of-contents.md)

---

## Overview / Tổng Quan

**English:** Testing ensures code quality and prevents regressions. This chapter covers unit testing, integration testing, and E2E testing for React applications.

**Tiếng Việt:** Kiểm thử đảm bảo chất lượng code và ngăn chặn hồi quy. Chương này bao gồm kiểm thử đơn vị, kiểm thử tích hợp và kiểm thử E2E cho ứng dụng React.

---

## Jest & React Testing Library

### Component Testing / Kiểm Thử Component

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter', () => {
  test('renders initial count / hiển thị số đếm ban đầu', () => {
    render(<Counter initialCount={0} />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  test('increments count / tăng số đếm', async () => {
    render(<Counter initialCount={0} />);
    const button = screen.getByRole('button', { name: /increment/i });
    
    await userEvent.click(button);
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  test('handles async operations / xử lý thao tác bất đồng bộ', async () => {
    render(<AsyncComponent />);
    
    await waitFor(() => {
      expect(screen.getByText('Loaded')).toBeInTheDocument();
    });
  });
});
```

### Hook Testing / Kiểm Thử Hook

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  test('increments counter / tăng bộ đếm', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

---

## Key Takeaways / Điểm Chính

**English:**
1. Test user behavior, not implementation
2. Use React Testing Library for component tests
3. Mock external dependencies
4. Test accessibility
5. Maintain high test coverage

**Tiếng Việt:**
1. Kiểm thử hành vi người dùng, không phải triển khai
2. Sử dụng React Testing Library cho kiểm thử component
3. Mock các phụ thuộc bên ngoài
4. Kiểm thử khả năng truy cập
5. Duy trì độ bao phủ kiểm thử cao

---

[Back to Table of Contents](../00-table-of-contents.md)
