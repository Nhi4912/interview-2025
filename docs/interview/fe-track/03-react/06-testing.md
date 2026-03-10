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

## Advanced Testing Patterns / Mẫu Kiểm Thử Nâng Cao

### Testing Custom Hooks / Kiểm Thử Custom Hooks

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';

// Custom hook to test
function useFetch(url: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  
  return { data, loading, error };
}

// Test
describe('useFetch', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });
  
  test('fetches data successfully / lấy dữ liệu thành công', async () => {
    const mockData = { id: 1, name: 'Test' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockData
    });
    
    const { result } = renderHook(() => useFetch('/api/data'));
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });
  
  test('handles errors / xử lý lỗi', async () => {
    const mockError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValueOnce(mockError);
    
    const { result } = renderHook(() => useFetch('/api/data'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeNull();
  });
  
  test('refetches on URL change / lấy lại khi URL thay đổi', async () => {
    const mockData1 = { id: 1 };
    const mockData2 = { id: 2 };
    
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ json: async () => mockData1 })
      .mockResolvedValueOnce({ json: async () => mockData2 });
    
    const { result, rerender } = renderHook(
      ({ url }) => useFetch(url),
      { initialProps: { url: '/api/data/1' } }
    );
    
    await waitFor(() => {
      expect(result.current.data).toEqual(mockData1);
    });
    
    rerender({ url: '/api/data/2' });
    
    await waitFor(() => {
      expect(result.current.data).toEqual(mockData2);
    });
  });
});
```

### Testing Context / Kiểm Thử Context

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Context to test
const ThemeContext = createContext<ThemeContextType | null>(null);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

// Component using context
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}

// Tests
describe('ThemeContext', () => {
  test('provides theme value / cung cấp giá trị theme', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    expect(screen.getByText(/Current theme: light/i)).toBeInTheDocument();
  });
  
  test('toggles theme / chuyển đổi theme', async () => {
    const user = userEvent.setup();
    
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    const button = screen.getByRole('button');
    
    await user.click(button);
    expect(screen.getByText(/Current theme: dark/i)).toBeInTheDocument();
    
    await user.click(button);
    expect(screen.getByText(/Current theme: light/i)).toBeInTheDocument();
  });
  
  test('throws error when used outside provider / ném lỗi khi dùng ngoài provider', () => {
    // Suppress console.error for this test
    const spy = jest.spyOn(console, 'error').mockImplementation();
    
    expect(() => {
      render(<ThemeToggle />);
    }).toThrow('useTheme must be used within ThemeProvider');
    
    spy.mockRestore();
  });
});
```

### Testing Async Components / Kiểm Thử Component Bất Đồng Bộ

```typescript
import { render, screen, waitFor } from '@testing-library/react';

// Async component
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>User: {user.name}</div>;
}

// Tests
describe('UserProfile', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  test('shows loading state / hiển thị trạng thái loading', () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );
    
    render(<UserProfile userId="1" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  test('displays user data / hiển thị dữ liệu người dùng', async () => {
    const mockUser = { id: '1', name: 'John Doe' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockUser
    });
    
    render(<UserProfile userId="1" />);
    
    await waitFor(() => {
      expect(screen.getByText('User: John Doe')).toBeInTheDocument();
    });
  });
  
  test('displays error message / hiển thị thông báo lỗi', async () => {
    const mockError = new Error('Failed to fetch');
    (global.fetch as jest.Mock).mockRejectedValueOnce(mockError);
    
    render(<UserProfile userId="1" />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch/i)).toBeInTheDocument();
    });
  });
});
```

### Testing Forms / Kiểm Thử Form

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Form component
function LoginForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: any = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit({ email, password });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <span role="alert">{errors.email}</span>}
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <span role="alert">{errors.password}</span>}
      </div>
      
      <button type="submit">Login</button>
    </form>
  );
}

// Tests
describe('LoginForm', () => {
  test('submits form with valid data / gửi form với dữ liệu hợp lệ', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();
    
    render(<LoginForm onSubmit={handleSubmit} />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
  
  test('shows validation errors / hiển thị lỗi validation', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();
    
    render(<LoginForm onSubmit={handleSubmit} />);
    
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });
  
  test('clears errors when user types / xóa lỗi khi người dùng nhập', async () => {
    const user = userEvent.setup();
    
    render(<LoginForm onSubmit={jest.fn()} />);
    
    // Trigger validation errors
    await user.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    
    // Type in email field
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    
    // Submit again
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    // Email error should be gone
    expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
  });
});
```

---

## Integration Testing / Kiểm Thử Tích Hợp

### Testing with Redux / Kiểm Thử với Redux

```typescript
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';

// Helper to render with Redux
function renderWithRedux(
  component: React.ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { todos: todoReducer },
      preloadedState
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  
  return {
    ...render(component, { wrapper: Wrapper, ...renderOptions }),
    store
  };
}

// Tests
describe('TodoList with Redux', () => {
  test('displays todos from store / hiển thị todos từ store', () => {
    const preloadedState = {
      todos: {
        items: [
          { id: '1', text: 'Test todo', completed: false }
        ]
      }
    };
    
    renderWithRedux(<TodoList />, { preloadedState });
    
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });
  
  test('adds new todo / thêm todo mới', async () => {
    const user = userEvent.setup();
    const { store } = renderWithRedux(<TodoList />);
    
    const input = screen.getByPlaceholderText(/add todo/i);
    await user.type(input, 'New todo{enter}');
    
    const state = store.getState();
    expect(state.todos.items).toHaveLength(1);
    expect(state.todos.items[0].text).toBe('New todo');
  });
});
```

### Testing with React Router / Kiểm Thử với React Router

```typescript
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// Helper to render with router
function renderWithRouter(
  component: React.ReactElement,
  { initialEntries = ['/'] } = {}
) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={component} />
      </Routes>
    </MemoryRouter>
  );
}

// Tests
describe('Navigation', () => {
  test('navigates to about page / điều hướng đến trang about', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </MemoryRouter>
    );
    
    await user.click(screen.getByText(/about/i));
    expect(screen.getByText(/about page/i)).toBeInTheDocument();
  });
  
  test('displays user based on route param / hiển thị user dựa trên route param', () => {
    renderWithRouter(<UserProfile />, {
      initialEntries: ['/users/123']
    });
    
    expect(screen.getByText(/user 123/i)).toBeInTheDocument();
  });
});
```

---

## Mocking / Mock

### Mocking API Calls / Mock API Calls

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Setup MSW server
const server = setupServer(
  rest.get('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.json({
        id,
        name: 'John Doe',
        email: 'john@example.com'
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Tests
test('fetches and displays user / lấy và hiển thị user', async () => {
  render(<UserProfile userId="1" />);
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});

test('handles server error / xử lý lỗi server', async () => {
  server.use(
    rest.get('/api/users/:id', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  
  render(<UserProfile userId="1" />);
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

### Mocking Modules / Mock Modules

```typescript
// Mock entire module
jest.mock('./api', () => ({
  fetchUser: jest.fn()
}));

import { fetchUser } from './api';

test('uses mocked API / sử dụng API đã mock', async () => {
  (fetchUser as jest.Mock).mockResolvedValueOnce({
    id: '1',
    name: 'Test User'
  });
  
  render(<UserProfile userId="1" />);
  
  await waitFor(() => {
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
  
  expect(fetchUser).toHaveBeenCalledWith('1');
});

// Mock specific functions
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  formatDate: jest.fn(() => '2024-01-01')
}));
```

---

## Snapshot Testing / Kiểm Thử Snapshot

```typescript
import { render } from '@testing-library/react';

test('matches snapshot / khớp với snapshot', () => {
  const { container } = render(<Button>Click me</Button>);
  expect(container.firstChild).toMatchSnapshot();
});

// Update snapshots with: jest --updateSnapshot
```

---

## Accessibility Testing / Kiểm Thử Khả Năng Truy Cập

```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('has no accessibility violations / không có vi phạm accessibility', async () => {
  const { container } = render(<LoginForm onSubmit={jest.fn()} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// Test specific ARIA attributes
test('has correct ARIA attributes / có thuộc tính ARIA đúng', () => {
  render(<Button disabled>Submit</Button>);
  
  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-disabled', 'true');
});
```

---

## E2E Testing with Playwright / Kiểm Thử E2E với Playwright

```typescript
import { test, expect } from '@playwright/test';

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });
  
  test('adds new todo / thêm todo mới', async ({ page }) => {
    await page.fill('[placeholder="Add todo"]', 'New todo');
    await page.press('[placeholder="Add todo"]', 'Enter');
    
    await expect(page.locator('text=New todo')).toBeVisible();
  });
  
  test('completes todo / hoàn thành todo', async ({ page }) => {
    await page.fill('[placeholder="Add todo"]', 'Test todo');
    await page.press('[placeholder="Add todo"]', 'Enter');
    
    await page.click('[type="checkbox"]');
    
    await expect(page.locator('text=Test todo')).toHaveClass(/completed/);
  });
  
  test('filters todos / lọc todos', async ({ page }) => {
    // Add completed and active todos
    await page.fill('[placeholder="Add todo"]', 'Active todo');
    await page.press('[placeholder="Add todo"]', 'Enter');
    
    await page.fill('[placeholder="Add todo"]', 'Completed todo');
    await page.press('[placeholder="Add todo"]', 'Enter');
    await page.click('[type="checkbox"]:last-of-type');
    
    // Filter active
    await page.click('text=Active');
    await expect(page.locator('text=Active todo')).toBeVisible();
    await expect(page.locator('text=Completed todo')).not.toBeVisible();
    
    // Filter completed
    await page.click('text=Completed');
    await expect(page.locator('text=Completed todo')).toBeVisible();
    await expect(page.locator('text=Active todo')).not.toBeVisible();
  });
});
```

---

## Testing Best Practices / Thực Hành Tốt Nhất

### Test Structure / Cấu Trúc Test

**English:**
1. **Arrange**: Set up test data and conditions
2. **Act**: Execute the code being tested
3. **Assert**: Verify the results

**Tiếng Việt:**
1. **Arrange**: Thiết lập dữ liệu và điều kiện test
2. **Act**: Thực thi code đang được test
3. **Assert**: Xác minh kết quả

```typescript
test('example test', async () => {
  // Arrange
  const user = userEvent.setup();
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  // Act
  await user.click(screen.getByRole('button'));
  
  // Assert
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### What to Test / Cái Gì Cần Test

**✅ DO Test:**
- User interactions
- Component rendering
- State changes
- API calls
- Error handling
- Accessibility
- Edge cases

**❌ DON'T Test:**
- Implementation details
- Third-party libraries
- Styles (unless critical)
- Trivial code

### Query Priority / Ưu Tiên Query

**English:** Use queries in this order:
1. `getByRole` - Most accessible
2. `getByLabelText` - Form elements
3. `getByPlaceholderText` - Forms
4. `getByText` - Non-interactive elements
5. `getByTestId` - Last resort

**Tiếng Việt:** Sử dụng queries theo thứ tự:
1. `getByRole` - Dễ truy cập nhất
2. `getByLabelText` - Phần tử form
3. `getByPlaceholderText` - Forms
4. `getByText` - Phần tử không tương tác
5. `getByTestId` - Phương án cuối cùng

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### Q1: What is the difference between unit, integration, and E2E tests?

**English Answer:**
- **Unit tests**: Test individual components/functions in isolation
- **Integration tests**: Test how multiple components work together
- **E2E tests**: Test entire user flows in a real browser

**Pyramid:**
```
     /\
    /E2E\      (Few, slow, expensive)
   /------\
  /Integr.\   (Some, medium speed)
 /----------\
/   Unit     \ (Many, fast, cheap)
```

### Q2: How do you test async code in React?

**English Answer:**
Use `waitFor`, `findBy` queries, or `act`:

```typescript
// waitFor
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// findBy (combines getBy + waitFor)
const element = await screen.findByText('Loaded');

// act (for state updates)
act(() => {
  result.current.increment();
});
```

### Q3: What is the difference between getBy, queryBy, and findBy?

**English Answer:**
- **getBy**: Throws error if not found (use for elements that should exist)
- **queryBy**: Returns null if not found (use to assert non-existence)
- **findBy**: Returns promise, waits for element (use for async)

```typescript
// Element should exist
const button = screen.getByRole('button');

// Element should NOT exist
expect(screen.queryByText('Error')).not.toBeInTheDocument();

// Element will appear
const message = await screen.findByText('Success');
```

### Q4: How do you test custom hooks?

**English Answer:**
Use `renderHook` from React Testing Library:

```typescript
const { result, rerender } = renderHook(
  ({ count }) => useCounter(count),
  { initialProps: { count: 0 } }
);

act(() => {
  result.current.increment();
});

expect(result.current.count).toBe(1);
```

### Q5: What is snapshot testing and when to use it?

**English Answer:**
Snapshot testing captures component output and compares it to a saved snapshot. Use for:
- Detecting unintended changes
- Testing static content
- Regression testing

**Avoid for:**
- Dynamic content
- Frequently changing UI
- As primary testing strategy

---

## Key Takeaways / Điểm Chính

**English:**
1. Test user behavior, not implementation details
2. Use React Testing Library for component tests
3. Mock external dependencies (API, modules)
4. Test accessibility with jest-axe
5. Use MSW for API mocking
6. Follow AAA pattern (Arrange, Act, Assert)
7. Prefer integration tests over unit tests
8. Use E2E tests for critical user flows
9. Maintain high test coverage (80%+)
10. Write tests that give confidence

**Tiếng Việt:**
1. Kiểm thử hành vi người dùng, không phải chi tiết triển khai
2. Sử dụng React Testing Library cho kiểm thử component
3. Mock các phụ thuộc bên ngoài (API, modules)
4. Kiểm thử accessibility với jest-axe
5. Sử dụng MSW cho API mocking
6. Tuân theo mẫu AAA (Arrange, Act, Assert)
7. Ưu tiên integration tests hơn unit tests
8. Sử dụng E2E tests cho luồng người dùng quan trọng
9. Duy trì độ bao phủ kiểm thử cao (80%+)
10. Viết tests mang lại sự tự tin

---

[Back to Table of Contents](../00-table-of-contents.md)
