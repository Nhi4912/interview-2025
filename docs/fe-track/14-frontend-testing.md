# Frontend Testing Guide / Hướng Dẫn Kiểm Thử Frontend

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [React Fundamentals](./03-react/01-react-fundamentals.md) | [TypeScript Basics](./02-typescript/01-typescript-basics.md)
> **See also**: [React Testing (detailed)](./03-react/06-testing.md) | [Performance](./06-browser-performance/)

---

## Overview / Tổng Quan

```
THE TESTING PYRAMID:

               /\
              /  \
             / E2E \          Few, slow, expensive — cover critical user flows
            /──────\
           /        \
          / Integration \     Medium — test component + real API/data interactions
         /──────────────\
        /                \
       /    Unit Tests    \   Many, fast, cheap — test functions and components in isolation
      /────────────────────\

Inverted (anti-pattern — "ice cream cone"):
       /  E2E (many)  \      ← brittle, slow, expensive, maintenance nightmare
      /──────────────────\
     /  Integration (some)\
    /────────────────────────\
   /  Unit (few)             \   ← most bugs caught too late
  /────────────────────────────\

Rule of thumb: 70% unit, 20% integration, 10% E2E
```

**Tool landscape 2024-2025:**
| Tool | Type | Runner | Speed | Use for |
|------|------|--------|-------|---------|
| **Jest** | Unit + Integration | Node | Fast | Legacy projects, CRA |
| **Vitest** | Unit + Integration | Vite | Fastest | Vite/Next.js 2024 projects |
| **React Testing Library** | Component | Any | Fast | React component behavior |
| **Playwright** | E2E | Browser | Medium | E2E, cross-browser |
| **Cypress** | E2E | Browser | Medium | E2E, visual testing |
| **MSW** | API mocking | Any | Fast | Intercept fetch/XHR in tests |

---

## 1. Vitest — Modern Unit Testing

### Q: How does Vitest differ from Jest and when should you use it? 🟢 Junior

**A:** Vitest is Jest-compatible but built on Vite — much faster for modern TS/ESM projects.

```
Jest:                          Vitest:
- Uses Babel to transform TS   - Uses Vite's native transform (esbuild)
- Node.js environment          - Node.js or browser (jsdom)
- Config: jest.config.ts       - Config: vite.config.ts (shared!)
- Speed: medium                - Speed: 2-10x faster (esbuild + HMR)

Migration: usually drop-in — same API, same matchers
```

```typescript
// vite.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',      // or 'happy-dom' (faster)
    globals: true,             // no import { describe, it } needed
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      thresholds: { lines: 80, branches: 70 },
    },
  },
})

// src/test/setup.ts
import '@testing-library/jest-dom'  // adds .toBeInTheDocument() etc.
```

```typescript
// utils/formatPrice.test.ts
import { describe, it, expect } from 'vitest'
import { formatPrice } from './formatPrice'

describe('formatPrice', () => {
  it('formats Vietnamese dong', () => {
    expect(formatPrice(150000, 'vi')).toBe('150.000 ₫')
  })

  it('formats USD', () => {
    expect(formatPrice(9.99, 'en')).toBe('$9.99')
  })

  it.each([
    [0, 'en', '$0.00'],
    [-5, 'en', '-$5.00'],
  ])('formatPrice(%d, %s) → %s', (amount, locale, expected) => {
    expect(formatPrice(amount, locale)).toBe(expected)
  })
})
```

---

## 2. React Testing Library (RTL)

### Q: What's the RTL philosophy and what queries should you use? 🟢 Junior → 🔴 Senior

**A:** RTL's guiding principle: **"Test behavior, not implementation."**

```
❌ Wrong (testing implementation):
expect(wrapper.state().count).toBe(1)
expect(component.find('.btn').props().onClick).toBeDefined()

✅ Right (testing behavior — what users see and do):
expect(screen.getByText('Count: 1')).toBeInTheDocument()
await userEvent.click(screen.getByRole('button', { name: 'Increment' }))
expect(screen.getByText('Count: 2')).toBeInTheDocument()
```

**Query priority (use in this order):**
```
1. getByRole     ← most preferred — tests accessibility
2. getByLabelText ← for form inputs
3. getByPlaceholderText ← fallback for inputs
4. getByText     ← for visible text
5. getByDisplayValue ← for selected/input values
6. getByAltText  ← for images
7. getByTitle    ← tooltip/title attribute
8. getByTestId   ← LAST RESORT only (uses data-testid)
```

```tsx
// Good component test
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserProfile } from './UserProfile'
import { server } from '../test/server'  // MSW server
import { http, HttpResponse } from 'msw'

describe('UserProfile', () => {
  it('loads and displays user data', async () => {
    server.use(
      http.get('/api/user/123', () =>
        HttpResponse.json({ name: 'Alice', email: 'alice@example.com' })
      )
    )
    render(<UserProfile userId="123" />)

    // Loading state
    expect(screen.getByRole('status')).toHaveTextContent('Loading...')

    // Data loads
    await screen.findByText('Alice')  // findBy = async, waits up to timeout
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
  })

  it('shows error on API failure', async () => {
    server.use(
      http.get('/api/user/123', () => new HttpResponse(null, { status: 500 }))
    )
    render(<UserProfile userId="123" />)

    await screen.findByRole('alert')
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
  })

  it('allows editing the name', async () => {
    const user = userEvent.setup()
    render(<UserProfile userId="123" editable />)

    await screen.findByText('Alice')
    await user.click(screen.getByRole('button', { name: /edit/i }))
    await user.clear(screen.getByLabelText(/name/i))
    await user.type(screen.getByLabelText(/name/i), 'Bob')
    await user.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() =>
      expect(screen.getByText('Bob')).toBeInTheDocument()
    )
  })
})
```

### Q: How do you test custom hooks in isolation? 🟡 Mid

```tsx
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('starts at initial value', () => {
    const { result } = renderHook(() => useCounter(10))
    expect(result.current.count).toBe(10)
  })

  it('increments', () => {
    const { result } = renderHook(() => useCounter(0))
    act(() => result.current.increment())
    expect(result.current.count).toBe(1)
  })

  it('does not go below min', () => {
    const { result } = renderHook(() => useCounter(0, { min: 0 }))
    act(() => result.current.decrement())
    expect(result.current.count).toBe(0)  // clamped at min
  })
})
```

---

## 3. MSW — API Mocking

### Q: Why use MSW instead of mocking fetch/axios directly? 🟡 Mid

**A:** MSW intercepts at the network level — same mock works in unit tests, integration tests, and browser.

```
Mocking fetch directly:                MSW:
jest.spyOn(global, 'fetch')            Intercepts at ServiceWorker / node level
  .mockResolvedValue(...)              Works in browser AND Node.js tests
                                       Same handlers = same mocks everywhere

Problem with direct mock:             MSW advantages:
- Couples test to implementation      - Tests use real fetch code
- Must know exact call signature      - Easy to simulate errors/delays
- Doesn't work cross-environment      - Reusable across test suites + Storybook
```

```typescript
// src/test/server.ts
import { setupServer } from 'msw/node'
import { http, HttpResponse, delay } from 'msw'

export const handlers = [
  http.get('/api/users', async () => {
    return HttpResponse.json([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ])
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 3, ...body }, { status: 201 })
  }),

  // Simulate network error
  http.get('/api/slow-endpoint', async () => {
    await delay(2000)
    return HttpResponse.json({ data: 'slow response' })
  }),
]

export const server = setupServer(...handlers)

// vitest.setup.ts
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())  // reset per-test overrides
afterAll(() => server.close())
```

---

## 4. E2E Testing: Playwright vs Cypress

### Q: Compare Playwright and Cypress for E2E testing. 🟡 Mid

| Feature | Playwright | Cypress |
|---------|-----------|---------|
| **Browser support** | Chromium, Firefox, Safari (WebKit) | Chrome, Firefox, Edge |
| **Language** | JS, TS, Python, Java, .NET | JS, TS only |
| **Architecture** | CDP (Chrome DevTools Protocol) | In-browser via iframe |
| **Parallelism** | Native parallel (multiple browsers) | CI only (paid for full parallel) |
| **Debugging** | Trace viewer, video, screenshots | Time travel debugger (excellent UI) |
| **Component testing** | Experimental | Yes (Cypress 11+) |
| **Speed** | Faster overall | Slower (single browser tab) |
| **Best for** | Cross-browser, CI/CD pipelines | Developer experience, visual debugging |

```typescript
// Playwright example
import { test, expect } from '@playwright/test'

test.describe('Login flow', () => {
  test('successful login redirects to dashboard', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email').fill('user@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('shows error on wrong password', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('user@example.com')
    await page.getByLabel('Password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign In' }).click()

    await expect(page.getByRole('alert')).toContainText('Invalid credentials')
  })
})

// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile',   use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

---

## 5. Testing Patterns & Anti-Patterns

### Q: What are the most common testing mistakes in React projects? 🟢 Junior → 🔴 Senior

**Anti-pattern 1: Testing implementation details**
```tsx
// ❌ Fragile — breaks on any refactor
expect(component.state().isOpen).toBe(true)
expect(component.find('DropdownMenu').props().visible).toBe(true)

// ✅ Tests behavior
expect(screen.getByRole('listbox')).toBeVisible()
```

**Anti-pattern 2: Not awaiting async operations**
```tsx
// ❌ Race condition — test finishes before data loads
render(<UserList />)
expect(screen.getByText('Alice')).toBeInTheDocument()  // FAILS

// ✅ Wait for async
await screen.findByText('Alice')  // findBy waits up to 1000ms by default
```

**Anti-pattern 3: Snapshots for everything**
```tsx
// ❌ Useless snapshots — any UI change breaks, nothing is tested
expect(container).toMatchSnapshot()

// ✅ Targeted assertions
expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled()
expect(screen.getByText(price)).toHaveClass('highlight')
```

**Pattern: Test IDs for complex selectors only**
```tsx
// Only use data-testid when no semantic role/label/text exists
<div role="grid" aria-label="Data table">    ← use getByRole ✓
<button aria-label="Delete row 3">           ← use getByRole ✓
<div data-testid="complex-chart">            ← getByTestId as last resort
```

---

## 6. Interview Q&A Summary / Tổng Kết

| Question | Level | Key Answer |
|----------|-------|-----------|
| Testing pyramid? | 🟢 | 70% unit, 20% integration, 10% E2E |
| Jest vs Vitest? | 🟢 | Vitest = faster, Vite-native, same API as Jest |
| RTL query priority? | 🟢 | Role > LabelText > Text > TestId (last resort) |
| Why MSW over fetch mock? | 🟡 | Network-level interception, works in browser + Node, reusable |
| Playwright vs Cypress? | 🟡 | Playwright = cross-browser, faster; Cypress = better DX, time-travel debug |
| Testing custom hooks? | 🟡 | `renderHook` from RTL, wrap state changes in `act()` |
| Avoid in tests? | 🟡 | Implementation details, missing awaits, snapshot everything |
| How to test auth flows? | 🔴 | MSW for API, fixture users, test redirect behavior not auth internals |

---

**See also**: [React Testing (detailed patterns)](./03-react/06-testing.md) | [Accessibility Testing](./11-accessibility/05-testing-accessibility.md)
