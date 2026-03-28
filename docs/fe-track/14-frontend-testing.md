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
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom", // or 'happy-dom' (faster)
    globals: true, // no import { describe, it } needed
    setupFiles: "./src/test/setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      thresholds: { lines: 80, branches: 70 },
    },
  },
});

// src/test/setup.ts
import "@testing-library/jest-dom"; // adds .toBeInTheDocument() etc.
```

```typescript
// utils/formatPrice.test.ts
import { describe, it, expect } from "vitest";
import { formatPrice } from "./formatPrice";

describe("formatPrice", () => {
  it("formats Vietnamese dong", () => {
    expect(formatPrice(150000, "vi")).toBe("150.000 ₫");
  });

  it("formats USD", () => {
    expect(formatPrice(9.99, "en")).toBe("$9.99");
  });

  it.each([
    [0, "en", "$0.00"],
    [-5, "en", "-$5.00"],
  ])("formatPrice(%d, %s) → %s", (amount, locale, expected) => {
    expect(formatPrice(amount, locale)).toBe(expected);
  });
});
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
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserProfile } from "./UserProfile";
import { server } from "../test/server"; // MSW server
import { http, HttpResponse } from "msw";

describe("UserProfile", () => {
  it("loads and displays user data", async () => {
    server.use(
      http.get("/api/user/123", () =>
        HttpResponse.json({ name: "Alice", email: "alice@example.com" }),
      ),
    );
    render(<UserProfile userId="123" />);

    // Loading state
    expect(screen.getByRole("status")).toHaveTextContent("Loading...");

    // Data loads
    await screen.findByText("Alice"); // findBy = async, waits up to timeout
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
  });

  it("shows error on API failure", async () => {
    server.use(http.get("/api/user/123", () => new HttpResponse(null, { status: 500 })));
    render(<UserProfile userId="123" />);

    await screen.findByRole("alert");
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });

  it("allows editing the name", async () => {
    const user = userEvent.setup();
    render(<UserProfile userId="123" editable />);

    await screen.findByText("Alice");
    await user.click(screen.getByRole("button", { name: /edit/i }));
    await user.clear(screen.getByLabelText(/name/i));
    await user.type(screen.getByLabelText(/name/i), "Bob");
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(screen.getByText("Bob")).toBeInTheDocument());
  });
});
```

### Q: How do you test custom hooks in isolation? 🟡 Mid

```tsx
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  it("starts at initial value", () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it("increments", () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });

  it("does not go below min", () => {
    const { result } = renderHook(() => useCounter(0, { min: 0 }));
    act(() => result.current.decrement());
    expect(result.current.count).toBe(0); // clamped at min
  });
});
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
import { setupServer } from "msw/node";
import { http, HttpResponse, delay } from "msw";

export const handlers = [
  http.get("/api/users", async () => {
    return HttpResponse.json([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ]);
  }),

  http.post("/api/users", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 3, ...body }, { status: 201 });
  }),

  // Simulate network error
  http.get("/api/slow-endpoint", async () => {
    await delay(2000);
    return HttpResponse.json({ data: "slow response" });
  }),
];

export const server = setupServer(...handlers);

// vitest.setup.ts
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers()); // reset per-test overrides
afterAll(() => server.close());
```

---

## 4. E2E Testing: Playwright vs Cypress

### Q: Compare Playwright and Cypress for E2E testing. 🟡 Mid

| Feature               | Playwright                          | Cypress                                |
| --------------------- | ----------------------------------- | -------------------------------------- |
| **Browser support**   | Chromium, Firefox, Safari (WebKit)  | Chrome, Firefox, Edge                  |
| **Language**          | JS, TS, Python, Java, .NET          | JS, TS only                            |
| **Architecture**      | CDP (Chrome DevTools Protocol)      | In-browser via iframe                  |
| **Parallelism**       | Native parallel (multiple browsers) | CI only (paid for full parallel)       |
| **Debugging**         | Trace viewer, video, screenshots    | Time travel debugger (excellent UI)    |
| **Component testing** | Experimental                        | Yes (Cypress 11+)                      |
| **Speed**             | Faster overall                      | Slower (single browser tab)            |
| **Best for**          | Cross-browser, CI/CD pipelines      | Developer experience, visual debugging |

```typescript
// Playwright example
import { test, expect } from "@playwright/test";

test.describe("Login flow", () => {
  test("successful login redirects to dashboard", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill("user@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });

  test("shows error on wrong password", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("user@example.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page.getByRole("alert")).toContainText("Invalid credentials");
  });
});

// playwright.config.ts
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 5. Testing Patterns & Anti-Patterns

### Q: What are the most common testing mistakes in React projects? 🟢 Junior → 🔴 Senior

**Anti-pattern 1: Testing implementation details**

```tsx
// ❌ Fragile — breaks on any refactor
expect(component.state().isOpen).toBe(true);
expect(component.find("DropdownMenu").props().visible).toBe(true);

// ✅ Tests behavior
expect(screen.getByRole("listbox")).toBeVisible();
```

**Anti-pattern 2: Not awaiting async operations**

```tsx
// ❌ Race condition — test finishes before data loads
render(<UserList />);
expect(screen.getByText("Alice")).toBeInTheDocument(); // FAILS

// ✅ Wait for async
await screen.findByText("Alice"); // findBy waits up to 1000ms by default
```

**Anti-pattern 3: Snapshots for everything**

```tsx
// ❌ Useless snapshots — any UI change breaks, nothing is tested
expect(container).toMatchSnapshot();

// ✅ Targeted assertions
expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
expect(screen.getByText(price)).toHaveClass("highlight");
```

**Pattern: Test IDs for complex selectors only**

```tsx
// Only use data-testid when no semantic role/label/text exists
<div role="grid" aria-label="Data table">    ← use getByRole ✓
<button aria-label="Delete row 3">           ← use getByRole ✓
<div data-testid="complex-chart">            ← getByTestId as last resort
```

---

## 7. Vue Testing (Vitest + Vue Test Utils)

### Q: How does Vue testing differ from React testing? 🟡 Mid

**A:** Vue uses **Vue Test Utils** with Vitest instead of React Testing Library. The core philosophy is the same (test behavior, not implementation), but the API is wrapper-based rather than screen-based.

```
React Testing Library:          Vue Test Utils:
render(<Component />)           mount(Component)
screen.getByRole(...)           wrapper.find('[role="..."]')
userEvent.click(btn)            await wrapper.trigger('click')
await findByText(...)           await wrapper.find('p').text()

Key difference: Vue Test Utils exposes a wrapper object per
component instance. RTL uses a global screen object.
Vue also has shallowMount() to auto-stub all child components.
```

```typescript
// vite.config.ts — Vitest setup for Vue
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
});
```

### Q: How do you test a Vue 3 Composition API component? 🟡 Mid

```typescript
// Counter.vue
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
const increment = () => count.value++
</script>

<template>
  <button @click="increment">Count: {{ count }}</button>
</template>
```

```typescript
// Counter.test.ts
import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import Counter from "./Counter.vue";

describe("Counter", () => {
  it("starts at 0 and increments on click", async () => {
    const wrapper = mount(Counter);

    expect(wrapper.text()).toContain("Count: 0");

    await wrapper.find("button").trigger("click");

    expect(wrapper.text()).toContain("Count: 1");
  });

  it("accepts an initial value via prop", () => {
    const wrapper = mount(Counter, { props: { initial: 5 } });
    expect(wrapper.text()).toContain("Count: 5");
  });
});
```

### Q: How do you test a Pinia store in isolation? 🟡 Mid

**A:** Use `setActivePinia(createPinia())` in `beforeEach` — this gives every test a fresh store instance.

```typescript
// stores/cart.ts
import { defineStore } from "pinia";
export const useCartStore = defineStore("cart", {
  state: () => ({ items: [] as string[], total: 0 }),
  actions: {
    addItem(item: string) {
      this.items.push(item);
      this.total += 1;
    },
  },
});

// stores/cart.test.ts
import { setActivePinia, createPinia } from "pinia";
import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "./cart";

describe("Cart Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia()); // fresh store per test — no state bleed
  });

  it("adds items to the cart", () => {
    const cart = useCartStore();
    cart.addItem("Apple");
    expect(cart.items).toContain("Apple");
    expect(cart.total).toBe(1);
  });

  it("starts empty", () => {
    const cart = useCartStore();
    expect(cart.items).toHaveLength(0);
  });
});
```

**Key differences / Điểm khác biệt chính:**
| Aspect | Vue Test Utils | React Testing Library |
|--------|---------------|----------------------|
| Mount | `mount()` / `shallowMount()` | `render()` |
| Queries | `wrapper.find()`, `wrapper.findAll()` | `screen.getByRole()` etc. |
| Events | `await wrapper.trigger('click')` | `await userEvent.click()` |
| State store | `setActivePinia(createPinia())` | Wrap with `<Provider store={store}>` |
| Async update | `await nextTick()` | `await findBy*()` / `waitFor()` |
| Scope | Wrapper object per instance | Global `screen` object |

---

## 8. Visual Regression Testing

### Q: Why do we need visual regression testing if we already have unit tests? 🟡 Mid

**A:** Unit and integration tests verify **logic and behavior** but are blind to visual regressions — a CSS specificity conflict, a color token override, a third-party library update shifting layouts, or dark-mode color bugs.

```
What unit tests miss:              Visual regression catches:
- CSS specificity conflicts        ✓ Layout shifts (padding/margin regressions)
- Z-index stacking issues          ✓ Color / theme token changes
- Font rendering changes           ✓ Responsive breakpoint regressions
- Third-party UI lib updates       ✓ Component overlap / overflow bugs
- Dark mode color bugs             ✓ Animation / transition glitches
```

### Q: How do you set up Chromatic for Storybook component snapshots? 🟡 Mid

**A:** Chromatic screenshots every Storybook story and diffs against the last approved baseline. Each story automatically becomes a visual test — no extra test code needed.

```bash
# Install
npm install --save-dev chromatic

# Run locally or in CI
npx chromatic --project-token=$CHROMATIC_TOKEN
```

```typescript
// Button.stories.tsx — each export = 1 visual snapshot in Chromatic
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = { component: Button };
export default meta;

export const Primary: StoryObj = { args: { variant: "primary", children: "Click me" } };
export const Disabled: StoryObj = {
  args: { variant: "primary", disabled: true, children: "Disabled" },
};
export const Loading: StoryObj = { args: { loading: true, children: "Loading..." } };

// CI: add to GitHub Actions
// - run: npx chromatic --project-token=${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

### Q: How does Percy integrate with Playwright for full-page snapshots? 🟡 Mid

```typescript
// Install: npm install --save-dev @percy/playwright

// e2e/homepage.percy.ts
import { test } from "@playwright/test";
import percySnapshot from "@percy/playwright";

test("homepage visual snapshot", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle"); // wait for all assets to load
  await percySnapshot(page, "Homepage"); // uploads to Percy dashboard

  await page.getByRole("button", { name: "Open menu" }).click();
  await percySnapshot(page, "Homepage - Menu open");
});

// Run with: npx percy exec -- playwright test
```

```typescript
// Playwright built-in (no external service, snapshots live in git)
import { test, expect } from "@playwright/test";

test("button matches visual baseline", async ({ page }) => {
  await page.goto("/components/button");
  await expect(page.getByRole("button", { name: "Submit" })).toHaveScreenshot("submit-button.png");
  // First run: generates baseline PNG
  // Subsequent runs: pixel-diffs against baseline, fails on mismatch
});
```

**Tool comparison / So sánh công cụ:**
| Tool | Integration | Cost | Best For |
|------|------------|------|---------|
| **Chromatic** | Storybook | Freemium (5 000 snapshots/mo) | Component libraries, design systems |
| **Percy** (BrowserStack) | Playwright, Cypress | Freemium (5 000 snapshots/mo) | Full-page E2E visual diffs |
| **Playwright built-in** (`toHaveScreenshot`) | Playwright | Free | Simple pixel diffing, snapshots in git |
| **BackstopJS** | Standalone (Puppeteer) | Free / self-hosted | Open-source, on-prem requirement |

**When to use which / Khi nào dùng gì:**

- **Chromatic** → you use Storybook and want per-story diffing surfaced in every PR
- **Percy** → you want full-page E2E snapshots with a hosted approval dashboard
- **Playwright built-in** → small project, keep it free, store baselines in git
- **BackstopJS** → self-hosted requirement or tight budget

---

## 6. Interview Q&A Summary / Tổng Kết

| Question                   | Level | Key Answer                                                                        |
| -------------------------- | ----- | --------------------------------------------------------------------------------- |
| Testing pyramid?           | 🟢    | 70% unit, 20% integration, 10% E2E                                                |
| Jest vs Vitest?            | 🟢    | Vitest = faster, Vite-native, same API as Jest                                    |
| RTL query priority?        | 🟢    | Role > LabelText > Text > TestId (last resort)                                    |
| Why MSW over fetch mock?   | 🟡    | Network-level interception, works in browser + Node, reusable                     |
| Playwright vs Cypress?     | 🟡    | Playwright = cross-browser, faster; Cypress = better DX, time-travel debug        |
| Testing custom hooks?      | 🟡    | `renderHook` from RTL, wrap state changes in `act()`                              |
| Avoid in tests?            | 🟡    | Implementation details, missing awaits, snapshot everything                       |
| How to test auth flows?    | 🔴    | MSW for API, fixture users, test redirect behavior not auth internals             |
| Vue testing approach?      | 🟡    | Vue Test Utils + mount/shallowMount, Vitest, test Composition API with renderHook |
| Visual regression testing? | 🟡    | Chromatic for Storybook, Percy for E2E, catches CSS regressions unit tests miss   |

---

## 🧪 Self-Check / Tự Kiểm Tra

| Type        | Question                                                               |
| ----------- | ---------------------------------------------------------------------- |
| Retrieval   | Name the 5 levels of the RTL query priority                            |
| Visual      | Draw the testing pyramid with tool names at each level                 |
| Application | Given a React form with API submission, which tools would you use?     |
| Debug       | Tests pass locally but fail in CI — what are the 3 most common causes? |
| Teach       | Explain to a junior dev why MSW is better than mocking fetch directly  |

### Key Points / Điểm Chính

| Concept               | Remember                                                        |
| --------------------- | --------------------------------------------------------------- |
| Testing pyramid ratio | 70% unit, 20% integration, 10% E2E                              |
| RTL philosophy        | Test behavior, not implementation                               |
| Query priority        | Role > LabelText > Text > TestId (last resort)                  |
| MSW advantage         | Network-level interception, same mocks everywhere               |
| Visual regression     | Catches CSS bugs that unit tests miss                           |
| Vue vs React testing  | Vue Test Utils + mount/shallowMount, React uses render + screen |

> 🎓 **Feynman Prompt**: Explain the testing trophy vs testing pyramid debate to a non-technical PM.

### Spaced Repetition Schedule

- Day 3: Re-read RTL query priority + MSW setup
- Day 7: Write a component test from memory (no docs)
- Day 14: Build a testing strategy doc for a hypothetical project

---

## 📚 References / Tài liệu tham khảo

### Documentation

| Resource              | URL                                                           |
| --------------------- | ------------------------------------------------------------- |
| Vitest                | https://vitest.dev/                                           |
| React Testing Library | https://testing-library.com/docs/react-testing-library/intro/ |
| Vue Test Utils        | https://test-utils.vuejs.org/                                 |
| MSW                   | https://mswjs.io/                                             |
| Playwright            | https://playwright.dev/docs/test-components                   |
| Cypress               | https://docs.cypress.io/                                      |

### Articles

| Resource                           | URL                                                                        |
| ---------------------------------- | -------------------------------------------------------------------------- |
| Kent C. Dodds - Testing Trophy     | https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications |
| Testing Library Guiding Principles | https://testing-library.com/docs/guiding-principles                        |

---

**See also**: [React Testing (detailed patterns)](./03-react/06-testing.md) | [Accessibility Testing](./11-accessibility/05-testing-accessibility.md)
