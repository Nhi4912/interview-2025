# Testing Interview Preparation

## Core Concepts

### Testing Fundamentals

- **Unit Testing**: Testing individual functions and components in isolation
- **Integration Testing**: Testing how components work together
- **End-to-End Testing**: Testing complete user workflows
- **Visual Testing**: Testing UI appearance and layout
- **Performance Testing**: Testing application performance under load

### Testing Pyramid

- **Unit Tests**: Fast, cheap, many (70%)
- **Integration Tests**: Medium speed, cost, quantity (20%)
- **E2E Tests**: Slow, expensive, few (10%)

## Advanced Topics

### Modern Testing Tools

- **Jest**: JavaScript testing framework
- **React Testing Library**: Component testing utilities
- **Cypress**: E2E testing framework
- **Playwright**: Cross-browser testing
- **Storybook**: Component development and testing
- **MSW**: API mocking and testing

### Testing Strategies

- **Test-Driven Development (TDD)**: Write tests before implementation
- **Behavior-Driven Development (BDD)**: Write tests in natural language
- **Visual Regression Testing**: Compare screenshots for UI changes
- **Accessibility Testing**: Ensure applications are accessible
- **Performance Testing**: Monitor and test application performance

## Common Interview Questions & Answers

### Testing Questions

**Q: What's the difference between unit, integration, and E2E tests?**
A:

- **Unit Tests**: Test individual functions/components in isolation with mocked dependencies
- **Integration Tests**: Test how multiple components/services work together
- **E2E Tests**: Test complete user workflows from start to finish

**Q: How do you test React components?**
A: Using React Testing Library with user-centric testing approach:

```javascript
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Counter from "./Counter";

describe("Counter", () => {
  test("renders counter with initial value", () => {
    render(<Counter initialValue={5} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("increments counter when button is clicked", async () => {
    const user = userEvent.setup();
    render(<Counter initialValue={0} />);

    const button = screen.getByRole("button", { name: /increment/i });
    await user.click(button);

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("calls onIncrement callback", async () => {
    const mockCallback = jest.fn();
    const user = userEvent.setup();
    render(<Counter onIncrement={mockCallback} />);

    const button = screen.getByRole("button", { name: /increment/i });
    await user.click(button);

    expect(mockCallback).toHaveBeenCalledWith(1);
  });
});
```

**Q: How do you test async operations?**
A: Using async/await and proper waiting strategies:

```javascript
import { render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import UserProfile from "./UserProfile";

const server = setupServer(
  rest.get("/api/user/:id", (req, res, ctx) => {
    return res(
      ctx.json({
        id: req.params.id,
        name: "John Doe",
        email: "john@example.com",
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("UserProfile", () => {
  test("loads and displays user data", async () => {
    render(<UserProfile userId="123" />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  test("handles error state", async () => {
    server.use(
      rest.get("/api/user/:id", (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<UserProfile userId="123" />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

## Advanced Interview Questions

**Q: How would you test a custom hook?**
A: Using `@testing-library/react-hooks` or custom render function:

```javascript
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  test("initializes with default value", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  test("increments counter", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(6);
  });

  test("decrements counter", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  test("resets counter", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.increment();
      result.current.reset();
    });

    expect(result.current.count).toBe(5);
  });
});
```

**Q: How do you test Redux actions and reducers?**
A: Testing actions and reducers separately:

```javascript
import { configureStore } from "@reduxjs/toolkit";
import counterReducer, { increment, decrement } from "./counterSlice";

describe("counter reducer", () => {
  test("should handle initial state", () => {
    expect(counterReducer(undefined, { type: "unknown" })).toEqual({
      value: 0,
      status: "idle",
    });
  });

  test("should handle increment", () => {
    const initialState = { value: 0, status: "idle" };
    const actual = counterReducer(initialState, increment());
    expect(actual.value).toEqual(1);
  });

  test("should handle decrement", () => {
    const initialState = { value: 1, status: "idle" };
    const actual = counterReducer(initialState, decrement());
    expect(actual.value).toEqual(0);
  });
});

describe("counter actions", () => {
  test("should create increment action", () => {
    const expectedAction = {
      type: "counter/increment",
      payload: undefined,
    };
    expect(increment()).toEqual(expectedAction);
  });
});

// Integration test with store
describe("counter integration", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        counter: counterReducer,
      },
    });
  });

  test("should handle increment action", () => {
    store.dispatch(increment());
    const state = store.getState();
    expect(state.counter.value).toBe(1);
  });
});
```

## Practical Problems & Solutions

### Problem 1: Test a Form Component with Validation

**Challenge**: Create comprehensive tests for a form component with validation and submission.

```javascript
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import ContactForm from "./ContactForm";

const server = setupServer(
  rest.post("/api/contact", (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ContactForm", () => {
  test("renders form fields", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });
  });

  test("shows validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "invalid-email");

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  test("submits form successfully", async () => {
    const user = userEvent.setup();
    const mockOnSubmit = jest.fn();
    render(<ContactForm onSubmit={mockOnSubmit} />);

    // Fill form
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello world");

    // Submit form
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello world",
      });
    });
  });

  test("handles submission error", async () => {
    server.use(
      rest.post("/api/contact", (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: "Server error" }));
      })
    );

    const user = userEvent.setup();
    render(<ContactForm />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello world");

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });
  });

  test("disables submit button during submission", async () => {
    server.use(
      rest.post("/api/contact", async (req, res, ctx) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return res(ctx.json({ success: true }));
      })
    );

    const user = userEvent.setup();
    render(<ContactForm />);

    // Fill form
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello world");

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    // Button should be disabled during submission
    expect(submitButton).toBeDisabled();

    // Wait for submission to complete
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
```

### Problem 2: Test a Custom Hook with Async Operations

**Challenge**: Test a custom hook that manages async data fetching and caching.

```javascript
import { renderHook, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { useDataFetching } from "./useDataFetching";

const server = setupServer(
  rest.get("/api/data/:id", (req, res, ctx) => {
    return res(
      ctx.json({
        id: req.params.id,
        name: "Test Data",
        value: 42,
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("useDataFetching", () => {
  test("initializes with loading state", () => {
    const { result } = renderHook(() => useDataFetching("123"));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });

  test("fetches data successfully", async () => {
    const { result } = renderHook(() => useDataFetching("123"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({
      id: "123",
      name: "Test Data",
      value: 42,
    });
    expect(result.current.error).toBe(null);
  });

  test("handles fetch error", async () => {
    server.use(
      rest.get("/api/data/:id", (req, res, ctx) => {
        return res(ctx.status(404));
      })
    );

    const { result } = renderHook(() => useDataFetching("999"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBeTruthy();
  });

  test("caches data for same ID", async () => {
    const { result, rerender } = renderHook(({ id }) => useDataFetching(id), {
      initialProps: { id: "123" },
    });

    // Wait for first fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const firstData = result.current.data;

    // Change ID and fetch new data
    rerender({ id: "456" });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Go back to first ID - should use cached data
    rerender({ id: "123" });

    expect(result.current.data).toBe(firstData);
    expect(result.current.loading).toBe(false);
  });

  test("refreshes data when refresh function is called", async () => {
    const { result } = renderHook(() => useDataFetching("123"));

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialData = result.current.data;

    // Mock different response for refresh
    server.use(
      rest.get("/api/data/123", (req, res, ctx) => {
        return res(
          ctx.json({
            id: "123",
            name: "Updated Data",
            value: 100,
          })
        );
      })
    );

    // Call refresh
    result.current.refresh();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).not.toEqual(initialData);
    expect(result.current.data.name).toBe("Updated Data");
  });
});
```

### Problem 3: E2E Testing with Cypress

**Challenge**: Create comprehensive E2E tests for a user authentication flow.

```javascript
// cypress/e2e/auth.cy.js
describe("Authentication Flow", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display login form", () => {
    cy.get("[data-testid=login-form]").should("be.visible");
    cy.get("[data-testid=email-input]").should("be.visible");
    cy.get("[data-testid=password-input]").should("be.visible");
    cy.get("[data-testid=login-button]").should("be.visible");
  });

  it("should show validation errors for empty fields", () => {
    cy.get("[data-testid=login-button]").click();

    cy.get("[data-testid=email-error]")
      .should("be.visible")
      .and("contain", "Email is required");

    cy.get("[data-testid=password-error]")
      .should("be.visible")
      .and("contain", "Password is required");
  });

  it("should show validation error for invalid email", () => {
    cy.get("[data-testid=email-input]").type("invalid-email");
    cy.get("[data-testid=password-input]").type("password123");
    cy.get("[data-testid=login-button]").click();

    cy.get("[data-testid=email-error]")
      .should("be.visible")
      .and("contain", "Invalid email format");
  });

  it("should login successfully with valid credentials", () => {
    // Mock successful login
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 200,
      body: {
        token: "fake-jwt-token",
        user: {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
        },
      },
    }).as("loginRequest");

    cy.get("[data-testid=email-input]").type("john@example.com");
    cy.get("[data-testid=password-input]").type("password123");
    cy.get("[data-testid=login-button]").click();

    cy.wait("@loginRequest");

    // Should redirect to dashboard
    cy.url().should("include", "/dashboard");
    cy.get("[data-testid=user-name]").should("contain", "John Doe");
  });

  it("should show error message for invalid credentials", () => {
    // Mock failed login
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 401,
      body: {
        error: "Invalid credentials",
      },
    }).as("loginRequest");

    cy.get("[data-testid=email-input]").type("john@example.com");
    cy.get("[data-testid=password-input]").type("wrongpassword");
    cy.get("[data-testid=login-button]").click();

    cy.wait("@loginRequest");

    cy.get("[data-testid=login-error]")
      .should("be.visible")
      .and("contain", "Invalid credentials");
  });

  it("should handle network errors gracefully", () => {
    // Mock network error
    cy.intercept("POST", "/api/auth/login", {
      forceNetworkError: true,
    }).as("loginRequest");

    cy.get("[data-testid=email-input]").type("john@example.com");
    cy.get("[data-testid=password-input]").type("password123");
    cy.get("[data-testid=login-button]").click();

    cy.get("[data-testid=login-error]")
      .should("be.visible")
      .and("contain", "Network error");
  });

  it("should navigate to registration page", () => {
    cy.get("[data-testid=register-link]").click();
    cy.url().should("include", "/register");
  });

  it("should remember user after page reload", () => {
    // Mock successful login
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 200,
      body: {
        token: "fake-jwt-token",
        user: {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
        },
      },
    }).as("loginRequest");

    cy.get("[data-testid=email-input]").type("john@example.com");
    cy.get("[data-testid=password-input]").type("password123");
    cy.get("[data-testid=login-button]").click();

    cy.wait("@loginRequest");

    // Reload page
    cy.reload();

    // Should still be logged in
    cy.url().should("include", "/dashboard");
    cy.get("[data-testid=user-name]").should("contain", "John Doe");
  });

  it("should logout successfully", () => {
    // Login first
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 200,
      body: {
        token: "fake-jwt-token",
        user: {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
        },
      },
    }).as("loginRequest");

    cy.get("[data-testid=email-input]").type("john@example.com");
    cy.get("[data-testid=password-input]").type("password123");
    cy.get("[data-testid=login-button]").click();

    cy.wait("@loginRequest");

    // Mock logout
    cy.intercept("POST", "/api/auth/logout", {
      statusCode: 200,
    }).as("logoutRequest");

    // Click logout
    cy.get("[data-testid=logout-button]").click();

    cy.wait("@logoutRequest");

    // Should redirect to login page
    cy.url().should("include", "/login");
    cy.get("[data-testid=login-form]").should("be.visible");
  });
});
```

### Problem 4: Visual Regression Testing

**Challenge**: Implement visual regression testing for UI components.

{% raw %}
```javascript
// visual-regression.test.js
import { render } from "@testing-library/react";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import puppeteer from "puppeteer";

expect.extend({ toMatchImageSnapshot });

describe("Visual Regression Tests", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("button component renders correctly", async () => {
    await page.goto("http://localhost:3000/components/button");

    const button = await page.$("[data-testid=primary-button]");
    const screenshot = await button.screenshot();

    expect(screenshot).toMatchImageSnapshot({
      customSnapshotsDir: "__image_snapshots__",
      customSnapshotIdentifier: "primary-button",
    });
  });

  test("form component renders correctly", async () => {
    await page.goto("http://localhost:3000/components/form");

    const form = await page.$("[data-testid=contact-form]");
    const screenshot = await form.screenshot();

    expect(screenshot).toMatchImageSnapshot({
      customSnapshotsDir: "__image_snapshots__",
      customSnapshotIdentifier: "contact-form",
    });
  });

  test("card component renders correctly in different states", async () => {
    await page.goto("http://localhost:3000/components/card");

    // Test default state
    const defaultCard = await page.$("[data-testid=card-default]");
    const defaultScreenshot = await defaultCard.screenshot();
    expect(defaultScreenshot).toMatchImageSnapshot({
      customSnapshotIdentifier: "card-default",
    });

    // Test hover state
    await defaultCard.hover();
    await page.waitForTimeout(100); // Wait for hover animation
    const hoverScreenshot = await defaultCard.screenshot();
    expect(hoverScreenshot).toMatchImageSnapshot({
      customSnapshotIdentifier: "card-hover",
    });

    // Test selected state
    await defaultCard.click();
    const selectedScreenshot = await defaultCard.screenshot();
    expect(selectedScreenshot).toMatchImageSnapshot({
      customSnapshotIdentifier: "card-selected",
    });
  });

  test("responsive design works correctly", async () => {
    const viewports = [
      { width: 1920, height: 1080, name: "desktop" },
      { width: 768, height: 1024, name: "tablet" },
      { width: 375, height: 667, name: "mobile" },
    ];

    for (const viewport of viewports) {
      await page.setViewport(viewport);
      await page.goto("http://localhost:3000/components/responsive");

      const component = await page.$("[data-testid=responsive-component]");
      const screenshot = await component.screenshot();

      expect(screenshot).toMatchImageSnapshot({
        customSnapshotIdentifier: `responsive-${viewport.name}`,
      });
    }
  });
});
```
{% endraw %}

## Testing Best Practices

### Test Organization

```javascript
// Component test structure
describe("ComponentName", () => {
  // Setup and teardown
  beforeEach(() => {
    // Setup code
  });

  afterEach(() => {
    // Cleanup code
  });

  // Happy path tests
  describe("when rendering normally", () => {
    test("should render correctly", () => {
      // Test implementation
    });
  });

  // Edge cases
  describe("when data is loading", () => {
    test("should show loading state", () => {
      // Test implementation
    });
  });

  // Error states
  describe("when error occurs", () => {
    test("should show error message", () => {
      // Test implementation
    });
  });
});
```

### Mocking Strategies

```javascript
// API mocking with MSW
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("/api/users", (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
      ])
    );
  }),

  rest.post("/api/users", (req, res, ctx) => {
    return res(ctx.json({ id: 3, name: req.body.name }));
  })
);

// Component mocking
jest.mock("./ExpensiveComponent", () => {
  return function MockExpensiveComponent(props) {
    return <div data-testid="mock-expensive">{props.children}</div>;
  };
});
```

### Performance Testing

```javascript
// Performance test example
describe("Performance Tests", () => {
  test("should render large list within performance budget", () => {
    const startTime = performance.now();

    render(
      <LargeList
        items={Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          name: `Item ${i}`,
        }))}
      />
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(renderTime).toBeLessThan(100); // 100ms budget
  });

  test("should handle rapid state updates efficiently", () => {
    const { result } = renderHook(() => useCounter());

    const startTime = performance.now();

    for (let i = 0; i < 100; i++) {
      act(() => {
        result.current.increment();
      });
    }

    const endTime = performance.now();
    const updateTime = endTime - startTime;

    expect(updateTime).toBeLessThan(50); // 50ms budget
  });
});
```

## Resources

### Documentation

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Playwright Documentation](https://playwright.dev/)

### Tools

- [MSW (Mock Service Worker)](https://mswjs.io/) - API mocking
- [Storybook](https://storybook.js.org/) - Component development
- [Percy](https://percy.io/) - Visual testing
- [Loki](https://loki.js.org/) - Visual regression testing

### Practice Platforms

- [Testing Library Examples](https://github.com/testing-library/react-testing-library#examples)
- [Cypress Examples](https://github.com/cypress-io/cypress-example-recipes)
- [Jest Examples](https://github.com/facebook/jest/tree/main/examples)

---

_This guide covers essential testing concepts for frontend interviews, including practical problems and advanced techniques commonly asked at Big Tech companies._
