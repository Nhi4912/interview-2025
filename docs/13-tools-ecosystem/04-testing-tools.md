# Testing Tools & Strategies
## Comprehensive Testing Guide

**English:** Testing ensures code quality, prevents regressions, and provides confidence in deployments. Modern testing includes unit, integration, and end-to-end tests.

**Tiếng Việt:** Testing đảm bảo chất lượng code, ngăn chặn regression và cung cấp sự tự tin trong triển khai. Testing hiện đại bao gồm unit test, integration test và end-to-end test.

## Testing Pyramid

### Theory

**Structure:**
```
        /\
       /E2E\      ← Few, slow, expensive
      /------\
     /Integration\ ← Some, moderate speed
    /------------\
   /  Unit Tests  \ ← Many, fast, cheap
  /----------------\
```

**Principles:**
- More unit tests than integration
- More integration than E2E
- Fast feedback loop
- Test at appropriate level

## Unit Testing

### Jest Framework

**Configuration:**
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts'
  ],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

**Best Practices:**
- Test behavior, not implementation
- One assertion per test
- Descriptive test names
- Arrange-Act-Assert pattern
- Mock external dependencies

### React Testing Library

**Philosophy:**
- Test like users interact
- Avoid implementation details
- Accessible queries
- No shallow rendering

**Query Priority:**
1. getByRole (most accessible)
2. getByLabelText
3. getByPlaceholderText
4. getByText
5. getByTestId (last resort)

**Example:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';

test('counter increments', () => {
  render(<Counter />);
  
  const button = screen.getByRole('button', { name: /increment/i });
  const count = screen.getByText(/count: 0/i);
  
  fireEvent.click(button);
  
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});
```

### Testing Hooks

**Using renderHook:**
```javascript
import { renderHook, act } from '@testing-library/react';

test('useCounter hook', () => {
  const { result } = renderHook(() => useCounter());
  
  expect(result.current.count).toBe(0);
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

### Mocking

**Mock Functions:**
```javascript
const mockFn = jest.fn();
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue('async result');
mockFn.mockRejectedValue(new Error('failed'));

expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg');
expect(mockFn).toHaveBeenCalledTimes(2);
```

**Mock Modules:**
```javascript
jest.mock('./api', () => ({
  fetchUser: jest.fn(() => Promise.resolve({ id: 1, name: 'John' }))
}));
```

**Mock Timers:**
```javascript
jest.useFakeTimers();

setTimeout(() => callback(), 1000);

jest.advanceTimersByTime(1000);
expect(callback).toHaveBeenCalled();

jest.useRealTimers();
```

## Integration Testing

### Testing API Integration

**MSW (Mock Service Worker):**
```javascript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json([{ id: 1, name: 'John' }]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('fetches users', async () => {
  render(<UserList />);
  
  expect(await screen.findByText('John')).toBeInTheDocument();
});
```

### Testing Forms

**Example:**
```javascript
test('form submission', async () => {
  const onSubmit = jest.fn();
  render(<LoginForm onSubmit={onSubmit} />);
  
  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /submit/i });
  
  await userEvent.type(emailInput, 'test@example.com');
  await userEvent.type(passwordInput, 'password123');
  await userEvent.click(submitButton);
  
  expect(onSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123'
  });
});
```

### Testing Routing

**React Router:**
```javascript
import { MemoryRouter } from 'react-router-dom';

test('navigation', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  
  const link = screen.getByRole('link', { name: /about/i });
  await userEvent.click(link);
  
  expect(screen.getByText(/about page/i)).toBeInTheDocument();
});
```

## End-to-End Testing

### Cypress

**Setup:**
```javascript
// cypress.config.js
module.exports = {
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true
  }
};
```

**Test Example:**
```javascript
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });
  
  it('successful login', () => {
    cy.get('[data-testid="email"]').type('user@example.com');
    cy.get('[data-testid="password"]').type('password123');
    cy.get('[data-testid="submit"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back').should('be.visible');
  });
  
  it('shows error on invalid credentials', () => {
    cy.get('[data-testid="email"]').type('wrong@example.com');
    cy.get('[data-testid="password"]').type('wrong');
    cy.get('[data-testid="submit"]').click();
    
    cy.contains('Invalid credentials').should('be.visible');
  });
});
```

**Custom Commands:**
```javascript
// cypress/support/commands.js
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('[data-testid="email"]').type(email);
  cy.get('[data-testid="password"]').type(password);
  cy.get('[data-testid="submit"]').click();
});

// Usage
cy.login('user@example.com', 'password123');
```

### Playwright

**Features:**
- Multi-browser support
- Auto-wait
- Network interception
- Parallel execution

**Example:**
```javascript
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  
  await expect(page.locator('h1')).toHaveText('Welcome');
  
  await page.click('text=Get Started');
  
  await expect(page).toHaveURL('/signup');
});

test('form validation', async ({ page }) => {
  await page.goto('/signup');
  
  await page.fill('[name="email"]', 'invalid-email');
  await page.click('button[type="submit"]');
  
  await expect(page.locator('.error')).toHaveText('Invalid email');
});
```

## Visual Regression Testing

### Chromatic

**Theory:** Detect visual changes by comparing screenshots.

**Setup:**
```javascript
// .storybook/main.js
module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials']
};

// Component story
export default {
  title: 'Button',
  component: Button
};

export const Primary = () => <Button variant="primary">Click me</Button>;
export const Secondary = () => <Button variant="secondary">Click me</Button>;
```

**CI Integration:**
```bash
npx chromatic --project-token=<token>
```

### Percy

**Features:**
- Visual diffs
- Responsive testing
- Cross-browser
- CI/CD integration

## Performance Testing

### Lighthouse CI

**Configuration:**
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'interactive': ['error', { maxNumericValue: 3500 }]
      }
    }
  }
};
```

### Web Vitals Testing

**Measurement:**
```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  navigator.sendBeacon('/analytics', body);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## Accessibility Testing

### jest-axe

**Usage:**
```javascript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('no accessibility violations', async () => {
  const { container } = render(<App />);
  const results = await axe(container);
  
  expect(results).toHaveNoViolations();
});
```

### Cypress Axe

**Integration:**
```javascript
describe('Accessibility', () => {
  it('has no detectable a11y violations', () => {
    cy.visit('/');
    cy.injectAxe();
    cy.checkA11y();
  });
  
  it('checks specific element', () => {
    cy.visit('/');
    cy.injectAxe();
    cy.checkA11y('.main-content');
  });
});
```

## Test Coverage

### Coverage Reports

**Configuration:**
```javascript
// jest.config.js
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

**Interpreting Coverage:**
- Lines: Executed lines
- Branches: Conditional branches
- Functions: Called functions
- Statements: Executed statements

**Best Practices:**
- Aim for 80%+ coverage
- Focus on critical paths
- Don't chase 100%
- Test behavior, not coverage

## CI/CD Integration

### GitHub Actions

**Workflow:**
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test -- --coverage
        
      - name: Upload coverage
        uses: codecov/codecov-action@v2
        
      - name: Run E2E tests
        run: npm run test:e2e
```

## Testing Best Practices

### General Principles

**1. Test Behavior, Not Implementation**
- Focus on what component does
- Avoid testing internal state
- Test from user perspective

**2. Arrange-Act-Assert**
```javascript
test('example', () => {
  // Arrange: Setup
  const user = { name: 'John' };
  
  // Act: Execute
  const greeting = greet(user);
  
  // Assert: Verify
  expect(greeting).toBe('Hello, John');
});
```

**3. Descriptive Test Names**
```javascript
// Bad
test('test1', () => {});

// Good
test('displays error message when email is invalid', () => {});
```

**4. One Assertion Per Test**
```javascript
// Prefer
test('button is disabled when loading', () => {
  expect(button).toBeDisabled();
});

test('button shows loading text when loading', () => {
  expect(button).toHaveTextContent('Loading...');
});
```

**5. Avoid Test Interdependence**
- Each test should be independent
- Use beforeEach for setup
- Clean up after tests

### Common Pitfalls

**1. Testing Implementation Details**
```javascript
// Bad
expect(component.state.count).toBe(1);

// Good
expect(screen.getByText('Count: 1')).toBeInTheDocument();
```

**2. Not Cleaning Up**
```javascript
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});
```

**3. Flaky Tests**
- Use waitFor for async
- Avoid arbitrary timeouts
- Mock time-dependent code

## Interview Questions

**Q: What's the testing pyramid?**

A: Testing pyramid shows test distribution: many fast unit tests at bottom, fewer integration tests in middle, few slow E2E tests at top. Ensures fast feedback and comprehensive coverage.

**Q: Unit vs Integration vs E2E tests?**

A: Unit tests individual functions/components in isolation. Integration tests multiple components working together. E2E tests entire application from user perspective.

**Q: How to test async code?**

A: Use async/await with testing library, waitFor for DOM updates, mock timers for setTimeout, MSW for API calls, and proper cleanup.

**Q: What is test coverage?**

A: Percentage of code executed during tests. Includes lines, branches, functions, and statements. Aim for 80%+ but focus on critical paths over 100%.

**Q: How to make tests maintainable?**

A: Test behavior not implementation, use descriptive names, keep tests simple, avoid duplication, use test utilities, and refactor tests with code.

---

[← Back to Version Control](./03-version-control.md) | [Next: Build Tools →](./01-build-tools.md)
