# React Testing / Kiểm Thử React

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [React Fundamentals](./01-react-fundamentals.md), [Hooks Deep Dive](./03-hooks-deep-dive.md)
> **See also**: [Performance Optimization](./09-performance-optimization.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Tiki's checkout team had 300+ unit tests, all green. They released a "confirm payment" button update — and 3% of production sessions failed because the button was disabled when it shouldn't be. Root cause: every test used `enzyme.shallow()` — never actually mounting child components. The `disabled` prop depended on a child hook's state, which shallow rendering never evaluated.

After switching to React Testing Library (RTL):

- Tests query by ARIA role (`screen.getByRole('button', { name: /confirm payment/i }`)
- Tests click via `userEvent.click` (simulates real browser events)
- Bugs that shallow rendering missed: caught before deploy

The team's rule after the incident: **"If your test can pass while the button is broken, your test is broken."** This is RTL's core philosophy: test what users experience, not implementation details.

---

## What & Why / Cái Gì & Tại Sao

**English:** React testing is about building confidence that UI behaves correctly from the _user's perspective_. The key distinction: testing _what the component does_ (user behavior) vs testing _how it's implemented_ (internal state, method calls).

**Tiếng Việt:** Testing React là xây dựng sự tin tưởng rằng UI hoạt động đúng từ góc nhìn _người dùng_. Phân biệt quan trọng: test _component làm gì_ (user behavior) vs test _cách implement_ (internal state, method calls).

---

## Core Concept 1: Testing Library Philosophy & Query Strategy / Triết Lý RTL & Chiến Lược Query

> 🧠 **Memory Hook**: "Query like a user would find it — by label, role, text. Not by CSS class or test ID."
>
> `screen.getByRole('button', { name: /submit/i })` finds the same button a screen reader finds.

**Tại sao tồn tại? / Why does this exist?**

Enzyme's `shallow()` and `instance()` tests break every time you refactor internals — even when behavior is identical. They test the _how_, not the _what_.
→ Why does "testing implementation details" hurt? Because you can't refactor safely, and tests give false confidence (pass but app is broken).
→ Why role-based queries? Because they mirror how assistive technology (screen readers) access the DOM — if the test can find it, a screen reader can too.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Testing a car: implementation test = "check if `startEngine()` method was called on the Engine object." Behavior test = "turn the key → does the car move?" Users don't care about method calls; they care about the car moving.

RTL forces you to test what users experience: clicks, text content, form submissions, loading states — not useState values or component method calls.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
// ❌ Implementation test (Enzyme style) — breaks on refactor
const wrapper = shallow(<LoginButton />);
wrapper.instance().setState({ loading: true }); // breaks when useState replaces class state
expect(wrapper.find(".btn-spinner")).toHaveLength(1); // breaks when className changes

// ✅ Behavior test (RTL style) — survives refactor
render(<LoginButton />);
await userEvent.click(screen.getByRole("button", { name: /login/i }));
expect(screen.getByRole("button", { name: /logging in/i })).toBeDisabled();
```

**Query priority (RTL's recommended order):**

```tsx
// 1. By Role — most semantic, mirrors a11y (PREFERRED)
screen.getByRole('button', { name: /submit/i })
screen.getByRole('textbox', { name: /email/i })
screen.getByRole('checkbox', { name: /remember me/i })

// 2. By Label — tied to accessible label
screen.getByLabelText(/email address/i)

// 3. By Placeholder — weaker (not always accessible)
screen.getByPlaceholderText(/enter email/i)

// 4. By Text — for non-interactive elements
screen.getByText(/total: \$99/i)

// 5. By Test ID — escape hatch only (use sparingly)
screen.getByTestId('payment-summary')

// Query variants:
// getBy    → throws if not found (use for: element must exist)
// queryBy  → returns null if not found (use for: asserting absence)
// findBy   → returns promise, polls until found (use for: async)
screen.getByRole(...)     // throws immediately
screen.queryByRole(...)   // null if not found
await screen.findByRole(...) // waits up to 1000ms
```

```
RTL QUERY DECISION TREE:

  Element should exist right now?
  ├── YES → getByRole / getByLabelText / getByText
  └── NO → check after async?
      ├── YES → findByRole (waits)
      └── NO → queryByRole (returns null, no throw)

  Asserting absence:
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  // ❌ getByRole would throw — can't chain .not on thrown error
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

```tsx
// Multiple elements with same role — use name to disambiguate
const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
expect(deleteButtons).toHaveLength(3); // assert count
await userEvent.click(deleteButtons[0]); // click first one

// within() — scope queries to a subtree
const todoItem = screen.getByRole("listitem", { name: /buy groceries/i });
const deleteBtn = within(todoItem).getByRole("button", { name: /delete/i });
await userEvent.click(deleteBtn);
// ✅ Clicks delete on THIS item, not any delete button on the page
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                            | Tại sao sai                                                                                                           | Đúng là                                                            |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `fireEvent.click()` instead of `userEvent.click()` | fireEvent dispatches synthetic event; userEvent simulates real browser behavior (mousedown + mouseup + click + focus) | Always `userEvent.click()` for interactions                        |
| Querying by `data-testid` for every element        | Tight coupling to implementation, adds noise to HTML                                                                  | Use role/label/text; reserve testid for last resort                |
| `container.querySelector('.spinner')`              | CSS class can change without behavior changing                                                                        | Use `screen.getByRole('status')` or `screen.getByText(/loading/i)` |
| Missing `await` on `userEvent`                     | RTL v14+: all user events are async                                                                                   | `await userEvent.click()`, `await userEvent.type()`                |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "how to test React components", "RTL vs Enzyme", "a11y testing"
- → Nhớ đến: RTL queries by user-visible attributes (role, label, text) — test behavior not implementation
- → Mở đầu trả lời: "I use React Testing Library, querying by ARIA role or label — the same way a screen reader would find elements. This ensures tests survive refactors and catch accessibility regressions."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [React component rendering, JSX, hooks](./01-react-fundamentals.md)
- ➡️ Để hiểu: [E2E testing with Playwright, CI/CD integration]

---

## Core Concept 2: Async Testing & Mocking / Test Bất Đồng Bộ & Mocking

> 🧠 **Memory Hook**: "findBy = 'find me eventually'. waitFor = 'keep checking until this is true'. MSW = 'fake the internet at the service worker level'."
>
> Three layers of async: component state updates, API calls, user event propagation.

**Tại sao tồn tại? / Why does this exist?**

React is async — state updates, data fetching, transitions all happen asynchronously. Tests that don't handle async correctly either flake (sometimes pass, sometimes fail) or give false positives (pass before the async work completes).
→ Why use MSW instead of mocking `fetch` directly? Because MSW intercepts at the network level — it works with any HTTP library (fetch, axios, SWR, React Query) without changing how you mock.
→ Why not just mock everything? Because mocked tests can pass while real integrations fail. Mock at boundaries, not everywhere.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Testing async code is like testing a vending machine — you press the button, wait for the machine to process (async), then check if the item appeared. `waitFor` is you patiently checking the output slot every few milliseconds.

MSW is like a "flight simulator" for APIs — it intercepts requests at the network level and returns fake responses, so components work exactly as in production but with controlled data.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
// Pattern 1: findBy for elements that appear after async operations
test("shows user data after fetch", async () => {
  render(<UserProfile userId="123" />);

  // ❌ Too early — data hasn't loaded yet
  // expect(screen.getByText('Alice')).toBeInTheDocument();

  // ✅ Wait for element to appear (polls until found or timeout)
  const name = await screen.findByText("Alice");
  expect(name).toBeInTheDocument();
});

// Pattern 2: waitFor for assertions that require multiple retries
test("disables button while loading", async () => {
  render(<SubmitButton />);
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  await waitFor(() => {
    expect(screen.getByRole("button")).toBeDisabled();
  });
  // waitFor retries the callback until it passes (or times out)
});

// Pattern 3: MSW for API mocking (preferred over jest.mock(fetch))
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const server = setupServer(
  http.get("/api/user/:id", ({ params }) => {
    return HttpResponse.json({ id: params.id, name: "Alice", email: "alice@example.com" });
  }),
  http.post("/api/posts", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: "1", ...body }, { status: 201 });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers()); // reset per-test overrides
afterAll(() => server.close());

test("shows user profile", async () => {
  render(<UserProfile userId="123" />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  expect(await screen.findByText("Alice")).toBeInTheDocument();
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});

// Override handler for specific test (error scenario)
test("shows error when fetch fails", async () => {
  server.use(
    http.get("/api/user/:id", () => {
      return new HttpResponse(null, { status: 500 });
    }),
  );

  render(<UserProfile userId="123" />);
  expect(await screen.findByRole("alert")).toHaveTextContent(/failed to load/i);
});
```

```
ASYNC TESTING TOOLS:

  findByX()              waitFor()               act()
  ──────────────         ───────────────         ──────────
  Polls for element      Retries assertion       Wraps state
  to appear in DOM       until passes            update code
  Timeout: 1000ms        Timeout: 1000ms

  Use for:               Use for:                Use for:
  "wait for text         "wait for complex       renderHook,
  to appear"             assertion"              direct dispatch
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

```tsx
// Testing custom hooks with renderHook
import { renderHook, act } from "@testing-library/react";

test("useCounter increments", () => {
  const { result } = renderHook(() => useCounter(0));
  expect(result.current.count).toBe(0);

  act(() => {
    result.current.increment();
  });
  expect(result.current.count).toBe(1);
});

// Testing hooks that need providers (context)
test("useCart works with CartProvider", () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );
  const { result } = renderHook(() => useCart(), { wrapper });

  act(() => {
    result.current.addItem({ id: "1", name: "Widget", price: 10 });
  });
  expect(result.current.items).toHaveLength(1);
  expect(result.current.total).toBe(10);
});

// Common flakiness fix: act() warnings
// If you see "Warning: An update to Component inside a test was not wrapped in act()"
// → Usually means an async state update happened after the test ended
// → Fix: ensure all async work resolves before test finishes
test("avoids act warning", async () => {
  render(<DataComponent />);
  // ✅ wait for all async work to complete before test ends
  await screen.findByText("loaded");
  // now all state updates are done
});
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                              | Tại sao sai                                                              | Đúng là                                                              |
| ---------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `jest.mock('node-fetch')`                            | Brittle — tied to specific HTTP library, breaks when you switch to axios | Use MSW — library-agnostic, works at network level                   |
| Forgetting `afterEach(() => server.resetHandlers())` | Handler overrides from one test leak into others → flaky tests           | Always reset handlers after each test                                |
| `await waitFor(() => {})` with empty callback        | Never throws, always passes                                              | Put the assertion inside waitFor                                     |
| Testing loading state after data loads               | Race condition — data may load before assertion                          | Assert loading immediately after render, THEN await the loaded state |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "test API calls in React", "mock network requests", "async component testing"
- → Nhớ đến: MSW + findBy for happy path, server.use() override for error scenarios
- → Mở đầu trả lời: "I use MSW to mock at the network level — it intercepts actual fetch/axios calls, so the component behavior is identical to production. Then findBy to await the result, and server.use() to test error scenarios."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [useEffect, async data fetching](./03-hooks-deep-dive.md)
- ➡️ Để hiểu: [E2E testing, CI test pipelines]

---

## Core Concept 3: Test Architecture & Coverage Strategy / Kiến Trúc Test & Chiến Lược Coverage

> 🧠 **Memory Hook**: "Testing pyramid: many unit (fast, cheap), some integration (medium), few E2E (slow, expensive). Each layer tests what the layers below can't."
>
> Unit tests catch logic bugs. Integration tests catch component wiring bugs. E2E tests catch user flow bugs.

**Tại sao tồn tại? / Why does this exist?**

Writing only unit tests gives false confidence (passing tests, broken integrations). Writing only E2E tests is too slow — 10 min CI pipeline per PR kill velocity.
→ Why maintain all three layers? Different failure modes need different detection strategies.
→ Why is 100% coverage a bad goal? Coverage measures lines executed, not behaviors tested. You can have 100% coverage and still miss critical user paths.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Testing pyramid = quality assurance at a factory:

- Unit tests = inspect each part individually (fast, many)
- Integration tests = assemble parts, test subassemblies (medium)
- E2E tests = test the complete product in real conditions (slow, few — only for critical scenarios)

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
// Unit test — pure logic, no rendering
// test pure functions directly (no component needed)
describe("formatPrice", () => {
  it("formats VND correctly", () => {
    expect(formatPrice(50000, "VND")).toBe("50.000 ₫");
    expect(formatPrice(0, "VND")).toBe("0 ₫");
    expect(formatPrice(-100, "VND")).toBe("-100 ₫");
  });
});

// Integration test — multiple components working together
describe("CheckoutFlow", () => {
  test("complete purchase flow", async () => {
    // Arrange: MSW intercepts, real store
    const { store } = renderWithProviders(<CheckoutPage />);

    // Act: user fills form and submits
    await userEvent.type(screen.getByLabelText(/card number/i), "4242424242424242");
    await userEvent.type(screen.getByLabelText(/expiry/i), "12/25");
    await userEvent.click(screen.getByRole("button", { name: /pay now/i }));

    // Assert: confirm screen appears, store updates
    expect(await screen.findByText(/order confirmed/i)).toBeInTheDocument();
    expect(store.getState().cart.items).toHaveLength(0);
  });
});

// Custom renderWithProviders — reusable setup
function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: RenderOptions & { preloadedState?: Partial<RootState>; store?: AppStore } = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <QueryClient client={queryClient}>
          <BrowserRouter>{children}</BrowserRouter>
        </QueryClient>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// E2E test (Playwright) — real browser, real server
// playwright.config.ts sets baseURL
test("user can complete checkout", async ({ page }) => {
  await page.goto("/products/widget-pro");
  await page.getByRole("button", { name: "Add to Cart" }).click();
  await page.getByRole("link", { name: "Checkout" }).click();
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByRole("button", { name: "Place Order" }).click();
  await expect(page.getByText("Order Confirmed")).toBeVisible();
});
```

**Coverage strategy:**

```
WHAT TO TEST AT EACH LEVEL:

  Unit tests (Jest + RTL, 60-70% of tests):
  - Pure utility functions
  - Custom hooks in isolation
  - Simple components (stateless, no side effects)
  - Edge cases and error paths

  Integration tests (Jest + RTL + MSW, 20-30%):
  - Multi-component workflows (form → validation → submission)
  - Context/store interactions
  - API request/response cycles
  - Error boundaries

  E2E tests (Playwright, 5-10%):
  - Critical user journeys (login, checkout, sign-up)
  - Cross-page flows
  - Real API integration smoke tests

  WHAT NOT TO TEST:
  - Third-party library internals
  - CSS/styling (use visual regression tools if needed)
  - Component implementation details
  - Generated code
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

```tsx
// Snapshot tests — use sparingly
// ✅ Good: stable, small components (icons, design tokens)
test("Icon renders correctly", () => {
  const { container } = render(<CheckIcon />);
  expect(container).toMatchSnapshot();
});

// ❌ Bad: dynamic, large components — snapshots become noise
test("Dashboard snapshot", () => {
  const { container } = render(<Dashboard user={mockUser} />);
  expect(container).toMatchSnapshot();
  // 300-line snapshot that changes every time you touch the UI
  // People blindly update it: git commit -m "update snapshots"
});

// Accessibility testing (jest-axe)
import { axe, toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations);

test("LoginForm has no a11y violations", async () => {
  const { container } = render(<LoginForm onSubmit={jest.fn()} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                             | Tại sao sai                                                                           | Đúng là                                                          |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 100% line coverage target                                           | Coverage measures execution not behavior — 100% coverage with 0 meaningful assertions | Target meaningful scenarios (happy path, error, edge cases)      |
| Snapshot everything                                                 | Snapshots become "click update" reflexes, not real regression detection               | Use snapshots only for stable, small pure components             |
| `beforeEach(() => jest.clearAllMocks())` forgetting `resetHandlers` | MSW handler overrides persist across tests                                            | Both `clearAllMocks()` AND `server.resetHandlers()` in afterEach |
| Testing too many implementation details                             | Tests break on every refactor                                                         | Test the observable outcome (what user sees)                     |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "testing strategy", "unit vs integration vs E2E", "how much to test"
- → Nhớ đến: testing pyramid + "test user behavior not implementation" + MSW for API boundary
- → Mở đầu trả lời: "I follow the testing pyramid — unit tests for pure logic and hooks, integration tests for component workflows with MSW for API mocking, and E2E with Playwright for critical user journeys. The goal is confidence in behavior, not coverage numbers."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [React hooks, async data fetching](./03-hooks-deep-dive.md)
- ➡️ Để hiểu: [CI/CD integration, Playwright E2E]

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What is the difference between `getBy`, `queryBy`, and `findBy` queries in RTL? 🟢 Junior

**A:** These three query variants handle different timing requirements:

- **`getBy`**: Synchronous, throws if element not found. Use when the element _must_ exist right now.
- **`queryBy`**: Synchronous, returns `null` if not found. Use when asserting an element is _absent_.
- **`findBy`**: Async (returns Promise), polls until element appears or times out. Use when element appears after async work.

```tsx
// getBy — element must exist now (throws if missing)
const button = screen.getByRole("button", { name: /submit/i });

// queryBy — asserting absence (getBy would throw, making the test unusable)
expect(screen.queryByRole("alert")).not.toBeInTheDocument();

// findBy — element appears after API call
render(<UserProfile userId="1" />);
const name = await screen.findByText("Alice"); // waits up to 1000ms
expect(name).toBeInTheDocument();
```

**Giải thích:** Rule of thumb đơn giản: dùng `getBy` cho elements phải tồn tại ngay, `queryBy` cho assertions về sự vắng mặt, `findBy` cho bất cứ thứ gì xuất hiện sau async operation.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Explains the null vs throw difference for getBy vs queryBy, gives the use case for each (not just "it's async")
- ❌ Weak: "findBy is for async, getBy is sync" without explaining queryBy or why the null vs throw distinction matters

---

### Q: Why is `userEvent` preferred over `fireEvent` in RTL? 🟡 Mid

**A:** `userEvent` simulates real user interactions with all the accompanying browser events. `fireEvent` dispatches a single synthetic event.

```tsx
// fireEvent.click dispatches one event: click
fireEvent.click(button);
// Events fired: click

// userEvent.click dispatches the full browser sequence:
await userEvent.click(button);
// Events fired: pointerover → pointerenter → mouseover → mouseenter →
//               pointermove → mousemove → pointerdown → mousedown →
//               focus → pointerup → mouseup → click

// This matters when components use:
// - onMouseEnter / onMouseLeave hover effects
// - onFocus / onBlur form validation
// - Keyboard handlers that respond to specific key sequences
// - Drag interactions

// Example: button disabled on hover (unusual but happens)
function HoverDisabledButton() {
  const [disabled, setDisabled] = useState(false);
  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setDisabled(true)} // weird, but test should catch it
      onClick={() => console.log("clicked")}
    >
      Click me
    </button>
  );
}

// fireEvent would miss this bug:
fireEvent.click(button); // doesn't trigger mouseEnter, button "works"

// userEvent catches it:
await userEvent.click(button);
// triggers mouseEnter → disabled=true → click doesn't fire → bug caught ✅
```

**Giải thích:** `fireEvent` là shortcut cho synthetic events — phù hợp cho test edge cases. `userEvent` mô phỏng đầy đủ chuỗi browser events như người dùng thực sự — đây là default choice cho mọi user interaction.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Explains the event sequence difference, gives a real scenario where it matters (hover, focus, keyboard)
- ❌ Weak: "userEvent is newer/better" without explaining WHY — the browser event sequence simulation

---

### Q: How do you set up MSW for API mocking and test both success and error states? 🟡 Mid

**A:** MSW intercepts at the service worker / Node.js network level — works with any HTTP library.

```tsx
// setup: src/mocks/server.ts
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/posts", () => {
    return HttpResponse.json([
      { id: "1", title: "Hello World" },
      { id: "2", title: "Testing with MSW" },
    ]);
  }),
  http.post("/api/posts", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: "3", ...body }, { status: 201 });
  }),
];

export const server = setupServer(...handlers);

// test file
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("shows posts list", async () => {
  render(<PostsList />);
  expect(await screen.findByText("Hello World")).toBeInTheDocument();
  expect(screen.getByText("Testing with MSW")).toBeInTheDocument();
});

test("shows error when API fails", async () => {
  // Override for this test only
  server.use(
    http.get("/api/posts", () => {
      return new HttpResponse(null, { status: 500, statusText: "Internal Server Error" });
    }),
  );

  render(<PostsList />);
  expect(await screen.findByRole("alert")).toHaveTextContent(/failed to load/i);
});

test("shows empty state", async () => {
  server.use(http.get("/api/posts", () => HttpResponse.json([])));

  render(<PostsList />);
  expect(await screen.findByText(/no posts yet/i)).toBeInTheDocument();
});
```

**Giải thích:** MSW's key advantage: `onUnhandledRequest: 'error'` sẽ fail test nếu component gọi API endpoint nào không được mock — giúp phát hiện unexpected fetches ngay khi test chạy.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Shows `server.resetHandlers()` after each test, uses `server.use()` override for error case, mentions `onUnhandledRequest: 'error'` for catching unmocked calls
- ❌ Weak: Only shows the happy path setup without mentioning handler cleanup or error state override

---

### Q: How do you test a custom hook that depends on Context and makes an API call? 🔴 Senior

**A:** Use `renderHook` with a `wrapper` prop that provides the required context, and MSW for the API.

```tsx
// The hook under test
function useUserProfile(userId: string) {
  const { authToken } = useAuth(); // depends on AuthContext
  const [profile, setProfile] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setProfile)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [userId, authToken]);

  return { profile, error, isLoading };
}

// Test
import { renderHook, waitFor } from "@testing-library/react";
import { AuthProvider } from "../contexts/AuthContext";

// MSW handler
server.use(
  http.get("/api/users/:id", ({ params }) => {
    return HttpResponse.json({ id: params.id, name: "Alice", email: "alice@example.com" });
  }),
);

test("fetches user profile with auth token", async () => {
  // Wrapper provides the required context
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider initialToken="test-jwt-token">{children}</AuthProvider>
  );

  const { result } = renderHook(() => useUserProfile("user-123"), { wrapper });

  // Initially loading
  expect(result.current.isLoading).toBe(true);
  expect(result.current.profile).toBeNull();

  // Wait for async completion
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  expect(result.current.profile?.name).toBe("Alice");
  expect(result.current.error).toBeNull();
});

test("handles API error", async () => {
  server.use(http.get("/api/users/:id", () => new HttpResponse(null, { status: 404 })));

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider initialToken="test-token">{children}</AuthProvider>
  );
  const { result } = renderHook(() => useUserProfile("user-999"), { wrapper });

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  expect(result.current.error?.message).toContain("404");
  expect(result.current.profile).toBeNull();
});
```

**Giải thích:** Key pattern: `wrapper` option on `renderHook` cung cấp context mà hook cần. Kết hợp `waitFor` để chờ async state thay đổi. MSW xử lý network layer.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Uses `wrapper` prop correctly, shows both happy path and error path, uses `waitFor` for the loading state transition, covers the auth header use case
- ❌ Weak: Only tests the sync initial state, doesn't wait for async completion, or doesn't provide required context

---

### Q: Design a testing strategy for a Checkout component that involves form validation, API calls, and state management. 🔴 Senior

**A:** Layered testing — each layer tests what the layers below can't.

```tsx
// Layer 1: Unit tests — pure logic, no rendering
describe("validateCheckoutForm", () => {
  it("requires card number", () => {
    expect(validateCheckout({ cardNumber: "" })).toEqual({
      errors: { cardNumber: "Card number required" },
    });
  });
  it("validates card number format (Luhn)", () => {
    expect(validateCheckout({ cardNumber: "1234" })).toEqual({
      errors: { cardNumber: "Invalid card number" },
    });
  });
});

// Layer 2: Integration tests — full component with MSW
describe("CheckoutForm integration", () => {
  test("shows validation errors without submitting", async () => {
    render(<CheckoutForm />, { wrapper: AppProviders });
    await userEvent.click(screen.getByRole("button", { name: /pay/i }));
    expect(screen.getByRole("alert", { name: /card number/i })).toBeInTheDocument();
    // MSW handler not called — no network request made
  });

  test("submits and shows success", async () => {
    server.use(http.post("/api/checkout", () => HttpResponse.json({ orderId: "ord_123" })));

    render(<CheckoutForm />, { wrapper: AppProviders });
    await userEvent.type(screen.getByLabelText(/card/i), "4242424242424242");
    await userEvent.type(screen.getByLabelText(/expiry/i), "12/25");
    await userEvent.type(screen.getByLabelText(/cvv/i), "123");
    await userEvent.click(screen.getByRole("button", { name: /pay/i }));

    // Button shows loading state
    expect(screen.getByRole("button")).toBeDisabled();
    // Success screen appears
    expect(await screen.findByText(/order confirmed: ord_123/i)).toBeInTheDocument();
  });

  test("shows error on payment failure", async () => {
    server.use(
      http.post("/api/checkout", () =>
        HttpResponse.json({ error: "Card declined" }, { status: 402 }),
      ),
    );
    render(<CheckoutForm />, { wrapper: AppProviders });
    // fill form, submit...
    expect(await screen.findByRole("alert")).toHaveTextContent(/card declined/i);
    // Form is still visible (not redirected)
    expect(screen.getByRole("button", { name: /pay/i })).toBeInTheDocument();
  });
});

// Layer 3: E2E — critical path only (Playwright)
// test.spec.ts
test("user completes checkout with real payment sandbox", async ({ page }) => {
  await page.goto("/checkout");
  await page.getByLabel("Card Number").fill("4242424242424242");
  // ...
  await expect(page.getByText(/order confirmed/i)).toBeVisible({ timeout: 5000 });
});
```

Key architecture decisions:

1. **Unit tests for validation logic** — fast, exhaustive edge case coverage without rendering
2. **Integration tests for UX flows** — MSW for API, test the complete user interaction sequence
3. **One happy-path E2E** — real browser, real network (sandbox), proves all layers integrate
4. **`renderWithProviders` helper** — encapsulates all required providers (Redux, QueryClient, Router) in one reusable wrapper

**Giải thích:** Không cần E2E test mọi validation case — unit tests đã cover đó. E2E chỉ cho critical path (complete purchase). Integration tests cover mọi UX state: validation errors, loading, success, API failure.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Identifies which layer handles each concern (unit for pure logic, integration for UX flows, E2E for the happy path), shows concrete test for each failure mode, mentions the provider wrapper pattern
- ❌ Weak: Only mentions "write tests for each state" without explaining the layer separation or showing how the layers differ

---

## 📋 Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Câu hỏi                                        | Difficulty | Core Concept      | Key Signal                                    |
| --- | ---------------------------------------------- | ---------- | ----------------- | --------------------------------------------- |
| 1   | `getBy` vs `queryBy` vs `findBy` trong RTL?    | 🟢 Junior  | RTL queries       | Throw vs null vs async behavior               |
| 2   | Tại sao `userEvent` tốt hơn `fireEvent`?       | 🟡 Mid     | RTL interactions  | Realistic event simulation (click, type, tab) |
| 3   | MSW cho API mocking — success và error states? | 🟡 Mid     | Test isolation    | Handler setup + server lifecycle              |
| 4   | Testing custom hook với Context + API call?    | 🔴 Senior  | Integration test  | `renderHook` + wrapper + MSW                  |
| 5   | Testing strategy cho Checkout component?       | 🔴 Senior  | Test architecture | Layer separation — unit, integration, E2E     |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"How do you approach testing React components, and what's the difference between your testing levels?"**

**30 giây đầu — mở đầu lý tưởng:**

1. "I follow the testing pyramid — many fast unit tests for pure logic, some integration tests with React Testing Library for component workflows, and a few E2E tests with Playwright for critical user journeys."
2. "For component tests, I use RTL and query by ARIA role or label — the same way screen readers access elements. This makes tests resilient to CSS and implementation changes."
3. "For API mocking, I use MSW — it intercepts at the network level so the component behaves identically to production, and I can test error scenarios by overriding handlers per test."
4. "The key philosophy is testing what users experience: can they see the confirmation message, is the submit button disabled while loading, does an error show when the API fails — not whether `setState` was called with the right argument."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                             |
| --- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Khi nào dùng `getBy`, `queryBy`, `findBy`? Sự khác biệt trong return value và khi nào throw error?                                  |
| 2   | 🎨 Visual      | Vẽ testing pyramid: unit / integration / E2E — mỗi layer test gì, tools nào, và trade-off về speed vs confidence?                   |
| 3   | 🛠️ Application | Test `<SearchBar>` gọi `/api/search?q=...` khi user type — viết test dùng MSW và RTL: setup handler, render, type, assert API call. |
| 4   | 🐛 Debug       | Test fails với "Warning: An update to Component inside a test was not wrapped in `act()`" — nguyên nhân và cách fix?                |
| 5   | 🎓 Teach       | Giải thích tại sao `userEvent.click()` tốt hơn `fireEvent.click()` bằng 1 câu analogy — không dùng thuật ngữ kỹ thuật.              |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                                                   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `getBy`: throw nếu không tìm thấy/tìm thấy >1 (synchronous). `queryBy`: return null nếu không tìm thấy (dùng để assert không tồn tại). `findBy`: async, return Promise (dùng cho async UI). |
| 2   | Unit (fast, isolated, mock): functions/hooks. Integration (medium): component + dependencies. E2E (slow, real browser): full user flow. Nhiều unit + ít E2E = optimal.                      |
| 3   | `server.use(rest.get('/api/search', (req, res, ctx) => res(ctx.json(results))))`. `render(<SearchBar />)`. `await userEvent.type(input, 'react')`. `await screen.findByText('...')`.        |
| 4   | State update xảy ra sau khi test kết thúc (async effect). Fix: dùng `await act(async () => { ... })`, hoặc `await waitFor(() => expect(...))`, hoặc `findBy*` queries.                      |
| 5   | `userEvent.click()` giống người thật (hover → focus → click → blur); `fireEvent.click()` giống robot nhấn nút thẳng — test sẽ miss interaction bugs.                                        |

> 🎯 **Feynman Prompt:** Giải thích tại sao React Testing Library khuyến khích query by role thay vì by CSS class — và điều gì thay đổi trong cách bạn viết component khi follow triết lý đó.
> 🔁 **Spaced Repetition reminder:** Review lại file này sau 3 ngày, rồi 7 ngày, rồi 14 ngày.

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)
- [Advanced Patterns](./04-advanced-patterns.md) — testable component design starts with good patterns
- [Hooks Deep Dive](./03-hooks-deep-dive.md) — testing custom hooks with renderHook
- [React Patterns Advanced](./08-react-patterns-advanced.md) — headless components improve testability
- [State Management](./05-state-management.md) — testing components with Zustand/Redux stores

### Khác track (Cross-track)
- [Testing Theory](../../shared/05-software-engineering/04-testing-theory.md) — testing pyramid and test philosophy
- [Frontend Testing](../14-frontend-testing.md) — broader frontend testing landscape
