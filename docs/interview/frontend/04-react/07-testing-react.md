# Testing React Applications

> Testing đảm bảo code quality và confidence khi refactor. Must-know skill cho production apps.

---

## Mục Lục

- [Overview](#-overview)
- [Testing Library](#-testing-library)
- [Unit Testing](#-unit-testing)
- [Integration Testing](#-integration-testing)
- [Mocking](#-mocking)
- [Best Practices](#-best-practices)
- [Câu Hỏi Phỏng Vấn](#-câu-hỏi-phỏng-vấn)

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    TESTING PYRAMID                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                        /\                                        │
│                       /  \                                       │
│                      / E2E\     Slow, expensive                  │
│                     /──────\    Cypress, Playwright              │
│                    /        \                                    │
│                   /Integration\  Medium speed                    │
│                  /─────────────\ Testing Library                 │
│                 /               \                                │
│                /     Unit        \  Fast, cheap                  │
│               /───────────────────\ Jest, Vitest                 │
│                                                                   │
│   Recommended ratio: 70% Unit, 20% Integration, 10% E2E         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Tools Ecosystem

| Tool | Purpose |
|------|---------|
| Jest / Vitest | Test runner |
| React Testing Library | Component testing |
| MSW | API mocking |
| Cypress / Playwright | E2E testing |
| Storybook | Visual testing |

---

## 🧪 Testing Library

### Core Philosophy

> "The more your tests resemble the way your software is used, the more confidence they can give you."

```jsx
// ❌ Bad: Testing implementation details
const { container } = render(<Counter />);
expect(container.querySelector('.count-display').textContent).toBe('0');

// ✅ Good: Testing user behavior
render(<Counter />);
expect(screen.getByRole('button', { name: /count: 0/i })).toBeInTheDocument();
```

### Queries Priority

```jsx
// Priority Order (most accessible → least)

// 1. Accessible to everyone
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText('Email');
screen.getByPlaceholderText('Enter email');
screen.getByText('Welcome');
screen.getByDisplayValue('john@example.com');

// 2. Semantic queries
screen.getByAltText('Profile picture');
screen.getByTitle('Close');

// 3. Test IDs (last resort)
screen.getByTestId('custom-element');
```

### Query Types

```jsx
// getBy - throws if not found (use for elements that should exist)
screen.getByRole('button'); // Throws if missing

// queryBy - returns null if not found (use for elements that may not exist)
screen.queryByRole('button'); // Returns null

// findBy - async, waits for element (use for async rendering)
await screen.findByRole('button'); // Waits and returns

// All variants
// getAllBy, queryAllBy, findAllBy - return arrays
```

---

## 🔬 Unit Testing

### Testing Components

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

describe('Counter', () => {
    it('renders initial count', () => {
        render(<Counter initialCount={5} />);
        expect(screen.getByText('Count: 5')).toBeInTheDocument();
    });

    it('increments count on button click', async () => {
        const user = userEvent.setup();
        render(<Counter initialCount={0} />);

        await user.click(screen.getByRole('button', { name: /increment/i }));

        expect(screen.getByText('Count: 1')).toBeInTheDocument();
    });

    it('calls onChange when count changes', async () => {
        const user = userEvent.setup();
        const onChange = jest.fn();
        render(<Counter initialCount={0} onChange={onChange} />);

        await user.click(screen.getByRole('button', { name: /increment/i }));

        expect(onChange).toHaveBeenCalledWith(1);
    });
});
```

### Testing Forms

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
    it('submits form with entered values', async () => {
        const user = userEvent.setup();
        const onSubmit = jest.fn();
        render(<LoginForm onSubmit={onSubmit} />);

        await user.type(screen.getByLabelText(/email/i), 'test@example.com');
        await user.type(screen.getByLabelText(/password/i), 'password123');
        await user.click(screen.getByRole('button', { name: /login/i }));

        expect(onSubmit).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123'
        });
    });

    it('shows validation error for invalid email', async () => {
        const user = userEvent.setup();
        render(<LoginForm onSubmit={jest.fn()} />);

        await user.type(screen.getByLabelText(/email/i), 'invalid');
        await user.click(screen.getByRole('button', { name: /login/i }));

        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
});
```

### Testing Hooks

```jsx
import { renderHook, act } from '@testing-library/react';
import useCounter from './useCounter';

describe('useCounter', () => {
    it('initializes with default value', () => {
        const { result } = renderHook(() => useCounter(10));
        expect(result.current.count).toBe(10);
    });

    it('increments count', () => {
        const { result } = renderHook(() => useCounter(0));

        act(() => {
            result.current.increment();
        });

        expect(result.current.count).toBe(1);
    });

    it('resets to initial value', () => {
        const { result } = renderHook(() => useCounter(5));

        act(() => {
            result.current.increment();
            result.current.increment();
            result.current.reset();
        });

        expect(result.current.count).toBe(5);
    });
});
```

---

## 🔗 Integration Testing

### Testing with Context

```jsx
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from './ThemeContext';
import ThemedButton from './ThemedButton';

function renderWithTheme(ui, { theme = 'light', ...options } = {}) {
    return render(
        <ThemeProvider initialTheme={theme}>
            {ui}
        </ThemeProvider>,
        options
    );
}

describe('ThemedButton', () => {
    it('renders with light theme styles', () => {
        renderWithTheme(<ThemedButton>Click me</ThemedButton>, { theme: 'light' });

        const button = screen.getByRole('button');
        expect(button).toHaveClass('light-theme');
    });

    it('renders with dark theme styles', () => {
        renderWithTheme(<ThemedButton>Click me</ThemedButton>, { theme: 'dark' });

        const button = screen.getByRole('button');
        expect(button).toHaveClass('dark-theme');
    });
});
```

### Testing with Router

```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import App from './App';

function renderWithRouter(initialEntries = ['/']) {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
            </Routes>
        </MemoryRouter>
    );
}

describe('Navigation', () => {
    it('navigates to products page', async () => {
        const user = userEvent.setup();
        renderWithRouter();

        await user.click(screen.getByRole('link', { name: /products/i }));

        expect(screen.getByText(/products list/i)).toBeInTheDocument();
    });

    it('displays product detail', () => {
        renderWithRouter(['/products/123']);

        expect(screen.getByText(/product 123/i)).toBeInTheDocument();
    });
});
```

---

## 🎭 Mocking

### Mocking Modules

```jsx
// Mock entire module
jest.mock('./api', () => ({
    fetchUsers: jest.fn(),
    createUser: jest.fn(),
}));

import { fetchUsers } from './api';

describe('UserList', () => {
    it('displays users from API', async () => {
        fetchUsers.mockResolvedValue([
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' }
        ]);

        render(<UserList />);

        expect(await screen.findByText('John')).toBeInTheDocument();
        expect(screen.getByText('Jane')).toBeInTheDocument();
    });

    it('handles API error', async () => {
        fetchUsers.mockRejectedValue(new Error('Network error'));

        render(<UserList />);

        expect(await screen.findByText(/error/i)).toBeInTheDocument();
    });
});
```

### MSW (Mock Service Worker)

```jsx
// mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
    rest.get('/api/users', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                { id: 1, name: 'John' },
                { id: 2, name: 'Jane' }
            ])
        );
    }),

    rest.post('/api/users', async (req, res, ctx) => {
        const { name } = await req.json();
        return res(
            ctx.status(201),
            ctx.json({ id: 3, name })
        );
    }),
];

// mocks/server.js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// setupTests.js
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Test file
import { rest } from 'msw';
import { server } from './mocks/server';

it('handles server error', async () => {
    // Override handler for this test
    server.use(
        rest.get('/api/users', (req, res, ctx) => {
            return res(ctx.status(500));
        })
    );

    render(<UserList />);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
});
```

### Mocking Timers

```jsx
describe('Countdown', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('counts down every second', () => {
        render(<Countdown seconds={3} />);

        expect(screen.getByText('3')).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(screen.getByText('2')).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(screen.getByText('1')).toBeInTheDocument();
    });
});
```

---

## ✅ Best Practices

### Test Structure

```jsx
describe('Component', () => {
    // Setup
    const defaultProps = {
        title: 'Test',
        onSubmit: jest.fn(),
    };

    const renderComponent = (props = {}) => {
        return render(<Component {...defaultProps} {...props} />);
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Group related tests
    describe('rendering', () => {
        it('renders title', () => {
            renderComponent({ title: 'Hello' });
            expect(screen.getByText('Hello')).toBeInTheDocument();
        });
    });

    describe('interactions', () => {
        it('calls onSubmit when form submitted', async () => {
            const user = userEvent.setup();
            const onSubmit = jest.fn();
            renderComponent({ onSubmit });

            await user.click(screen.getByRole('button', { name: /submit/i }));

            expect(onSubmit).toHaveBeenCalled();
        });
    });

    describe('error handling', () => {
        it('shows error message on failure', async () => {
            // ...
        });
    });
});
```

### What to Test

```jsx
// ✅ DO test:
// - User interactions
// - Component rendering based on props
// - Conditional rendering
// - Form validation
// - Error states
// - Loading states

// ❌ DON'T test:
// - Implementation details
// - Third-party library internals
// - Styling (unless critical)
// - Constants
```

### Testing Async Code

```jsx
import { waitFor, waitForElementToBeRemoved } from '@testing-library/react';

// Wait for element to appear
await screen.findByText('Loaded');

// Wait for condition
await waitFor(() => {
    expect(screen.getByText('Updated')).toBeInTheDocument();
});

// Wait for element to disappear
await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

// Multiple assertions
await waitFor(() => {
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(mockFn).toHaveBeenCalled();
});
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Unit test vs Integration test?**

A:
- Unit: Test isolated component/function
- Integration: Test components working together

**Q: Tại sao dùng Testing Library thay vì Enzyme?**

A: Testing Library focuses on user behavior, not implementation. Tests are more resilient to refactoring.

### 🟡 Mid-level

**Q: Làm sao test async code?**

A:
- `findBy*` queries (return Promise)
- `waitFor` for conditions
- `waitForElementToBeRemoved`
- Mock API with MSW

**Q: getBy vs queryBy vs findBy?**

A:
- `getBy`: Throws if not found (synchronous)
- `queryBy`: Returns null if not found (check non-existence)
- `findBy`: Async, waits for element (async rendering)

### 🔴 Senior

**Q: Design testing strategy cho large app**

A:
1. **Unit tests**: Utilities, hooks, pure functions (70%)
2. **Integration tests**: Critical user flows (20%)
3. **E2E tests**: Happy paths, payment flows (10%)
4. **Visual regression**: Storybook + Chromatic
5. **CI/CD integration**: Run on every PR

---

## 📚 Active Recall

1. [ ] Write test cho login form
2. [ ] Mock API call với MSW
3. [ ] Test custom hook
4. [ ] Test component với context
5. [ ] Query priority order

---

> **Tiếp theo:** [mindmap-react.md](./mindmap-react.md) - React Mind Map
