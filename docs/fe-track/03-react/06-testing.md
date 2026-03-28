# React Testing / Kiểm thử React

| Field               | Value                                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Track**           | Frontend — React                                                                                           |
| **Difficulty**      | 🟡 Intermediate → 🔴 Advanced                                                                              |
| **Prerequisites**   | 03-hooks-deep-dive, 04-advanced-patterns                                                                   |
| **See also**        | 05-state-management, 09-performance-optimization                                                           |
| **L5 Competencies** | Quality Engineering (test strategy), System Design (test architecture), Developer Experience (testability) |

---

## 🎬 Real-World Scenario / Tình huống thực tế

> Bạn vừa ship feature checkout flow. QA approve. Deploy production.
> Sáng hôm sau, PM nhắn: "Khách hàng không thể thanh toán — button bị disable vĩnh viễn."
>
> Bạn check code: ai đó refactor `isLoading` thành `isPending` ở PR khác, nhưng button vẫn check `isLoading`.
> Không có test nào catch — vì test cũ chỉ check "component renders without crashing".
>
> **Testing không phải để "coverage đẹp". Testing là bảo hiểm — bạn trả phí nhỏ (viết test) để tránh thiệt hại lớn (production bug).**

---

## 💡 What & Why / Cái gì & Tại sao

**Analogy — Kiểm tra chất lượng nhà hàng / Restaurant Quality Check:**

Tưởng tượng bạn mở nhà hàng:

- **Không có test** = phục vụ đồ ăn rồi cầu nguyện khách không bị đau bụng.
- **Unit test** = kiểm tra từng nguyên liệu: cá tươi không? Rau sạch không? Gia vị hết hạn chưa?
- **Integration test** = thử nấu 1 món: nguyên liệu kết hợp có ngon không? Có ra đúng vị không?
- **E2E test** = khách ngồi vào bàn, gọi món, ăn xong, thanh toán — toàn bộ trải nghiệm có ổn không?

**Core insight:** Test tốt = test **hành vi mà user thấy**, không phải implementation details bên trong.

---

## 🗺️ Concept Map / Bản đồ khái niệm

```
                    React Testing
                         |
          +--------------+--------------+
          |              |              |
      Unit Tests    Integration     E2E Tests
      (isolated)    (combined)      (full app)
          |              |              |
      Components     Flows          Journeys
      + Hooks       + API mock      + Real browser
          |              |              |
    React Testing   RTL + MSW       Playwright
      Library                       / Cypress
          |
    +-----+------+
    |     |      |
  Queries Events  Assertions
  (find)  (act)   (expect)
```

---

## 📖 Overview / Tổng quan

React testing có 3 tầng cần nắm:

1. **React Testing Library (RTL)** — philosophy "test like a user", query bằng role/text/label thay vì className/testId.
2. **Async Testing & API Mocking (MSW)** — test component gọi API mà không cần real backend.
3. **Test Architecture** — chọn đúng level test (unit/integration/E2E), viết test có giá trị thay vì test cho đẹp coverage.

---

## 🧩 Core Concepts / Khái niệm cốt lõi

### Concept 1: React Testing Library Philosophy & Query Strategy / Triết lý RTL & Chiến lược Query

🧠 **Memory Hook:** "RTL = test như người dùng — họ không biết className, họ chỉ thấy text và button"

#### Why does this exist? / Tại sao cần?

**Level 1 — Immediate:** Enzyme (thư viện cũ) test implementation details: check state value, check instance methods. Refactor code → test break dù behavior không đổi.

**Level 2 — Root cause:** Test gắn chặt vào implementation = test trở thành burden thay vì safety net. Mỗi lần refactor phải sửa test → team ngại refactor → code rot. RTL flip approach: test behavior (what user sees/does) → refactor thoải mái miễn behavior giữ nguyên.

#### Layer 1: Analogy — Kiểm tra thang máy / Elevator Inspection

```
Implementation testing (Enzyme style):
  ✓ Motor RPM = 1500
  ✓ Cable tension = 500kg
  ✓ Circuit board voltage = 24V
  → Refactor motor → tất cả test fail dù thang máy vẫn chạy tốt

Behavior testing (RTL style):
  ✓ Bấm nút tầng 5 → thang lên tầng 5
  ✓ Cửa mở khi đến nơi
  ✓ Quá tải → hiện cảnh báo
  → Thay motor → test vẫn pass vì behavior không đổi
```

#### Layer 2: How It Works / Cách hoạt động

**Query Priority — từ accessible nhất đến kém nhất:**

```
Ưu tiên cao (accessible cho mọi người):
  1. getByRole('button', { name: 'Submit' })     ← screen reader đọc được
  2. getByLabelText('Email')                       ← form label
  3. getByPlaceholderText('Enter email')           ← placeholder
  4. getByText('Welcome back')                     ← visible text
  5. getByDisplayValue('john@email.com')           ← input value

Ưu tiên thấp (dùng khi không còn cách khác):
  6. getByAltText('Profile photo')                 ← img alt
  7. getByTitle('Close')                           ← title attribute
  8. getByTestId('submit-btn')                     ← data-testid (LAST RESORT)
```

**3 loại Query — getBy / queryBy / findBy:**

```
getBy...    → Tìm thấy: return element
             → Không thấy: THROW ERROR ngay
             → Dùng khi: element PHẢI có mặt

queryBy...  → Tìm thấy: return element
             → Không thấy: return NULL
             → Dùng khi: assert element KHÔNG tồn tại

findBy...   → Return PROMISE (await)
             → Tìm thấy: resolve element
             → Không thấy (timeout): reject
             → Dùng khi: element xuất hiện SAU async (loading → data)
```

**Ví dụ thực tế:**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function LoginForm({ onSubmit }: { onSubmit: (data: LoginData) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ email, password });
      }}
    >
      <label htmlFor="email">Email</label>
      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Log In</button>
    </form>
  );
}

// TEST — test behavior, không test state
test("submits email and password", async () => {
  const handleSubmit = vi.fn();
  const user = userEvent.setup();

  render(<LoginForm onSubmit={handleSubmit} />);

  // Query bằng label — accessible
  await user.type(screen.getByLabelText("Email"), "john@email.com");
  await user.type(screen.getByLabelText("Password"), "secret123");

  // Query bằng role — accessible
  await user.click(screen.getByRole("button", { name: "Log In" }));

  // Assert behavior — callback được gọi đúng
  expect(handleSubmit).toHaveBeenCalledWith({
    email: "john@email.com",
    password: "secret123",
  });
});

// TEST — element không tồn tại
test("error message not shown initially", () => {
  render(<LoginForm onSubmit={vi.fn()} />);
  // queryBy... trả null nếu không tìm thấy (KHÔNG throw)
  expect(screen.queryByText("Invalid credentials")).not.toBeInTheDocument();
});
```

#### Layer 3: Edge Cases / Trường hợp đặc biệt

1. **Multiple elements cùng role:**

```tsx
// Có 2 button — cần name để phân biệt
screen.getByRole("button", { name: "Submit" });
screen.getByRole("button", { name: "Cancel" });

// Hoặc getAllByRole trả array
const buttons = screen.getAllByRole("button");
expect(buttons).toHaveLength(2);
```

2. **within — scope query trong 1 container:**

```tsx
import { within } from "@testing-library/react";

const nav = screen.getByRole("navigation");
const homeLink = within(nav).getByRole("link", { name: "Home" });
// ↑ chỉ tìm trong <nav>, không tìm toàn page
```

3. **Accessible name phức tạp:**

```tsx
// Button có icon, không có text
<button aria-label="Close dialog">✕</button>;
screen.getByRole("button", { name: "Close dialog" });

// Button có cả icon và text
<button>
  <Icon /> Save Changes
</button>;
screen.getByRole("button", { name: "Save Changes" });
```

#### ❌ Common Mistakes / Lỗi thường gặp

| ❌ Sai                                  | ✅ Đúng                                   | 💡 Tại sao                                              |
| --------------------------------------- | ----------------------------------------- | ------------------------------------------------------- |
| `getByTestId('submit-btn')` khi có text | `getByRole('button', { name: 'Submit' })` | testId = last resort, role accessible hơn               |
| `getByText('Submit')` cho button        | `getByRole('button', { name: 'Submit' })` | Role chính xác hơn — có thể có text "Submit" ở nơi khác |
| `queryByText` rồi check `!== null`      | `expect(...).toBeInTheDocument()`         | Jest-DOM matcher rõ ràng hơn                            |
| `container.querySelector('.btn')`       | RTL queries                               | Query by CSS class = implementation detail              |

#### 🎯 Interview Pattern

> **Trigger:** "RTL khác Enzyme thế nào?"
> **Concept:** RTL test behavior (user perspective), Enzyme test implementation (internal state/methods)
> **Opening:** "RTL enforce testing from user perspective — query bằng role, text, label thay vì CSS selectors. Khi refactor internal implementation, test không break miễn behavior giữ nguyên."

#### 🔑 Knowledge Chain

📚 **Cần trước:** React component basics, DOM structure, accessibility roles
➡️ **Mở ra:** Async testing, integration testing, test architecture

---

### Concept 2: Async Testing & API Mocking with MSW / Test Async & Mock API bằng MSW

🧠 **Memory Hook:** "MSW = diễn viên đóng thế server — component không biết đang nói chuyện với fake"

#### Why does this exist? / Tại sao cần?

**Level 1 — Immediate:** Component gọi API → test cần fake response. Dùng `jest.mock(fetch)` = mock implementation detail, dễ break.

**Level 2 — Root cause:** Mock ở network level (MSW) thay vì code level (jest.mock) → component code chạy y hệt production, chỉ response từ "server" là fake. Test realistic hơn, catch nhiều bug hơn.

#### Layer 1: Analogy — Diễn viên đóng thế / Stunt Double

```
jest.mock(fetch):
  = Cắt scene ra, paste response vào
  → Không test fetch logic, headers, error handling
  → Nếu fetch library thay đổi (axios → fetch) → test break

MSW (Mock Service Worker):
  = Diễn viên đóng thế server
  → Component vẫn gọi fetch/axios bình thường
  → MSW intercept ở network level, trả fake response
  → Đổi từ fetch sang axios → test KHÔNG break
```

#### Layer 2: How It Works / Cách hoạt động

**Setup MSW:**

```tsx
// mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  // GET /api/products
  http.get("/api/products", () => {
    return HttpResponse.json([
      { id: "1", name: "iPhone", price: 999 },
      { id: "2", name: "MacBook", price: 1999 },
    ]);
  }),

  // POST /api/cart
  http.post("/api/cart", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, item: body });
  }),

  // Error scenario
  http.get("/api/user", () => {
    return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
  }),
];

// mocks/server.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);

// vitest.setup.ts
beforeAll(() => server.listen()); // Start intercepting
afterEach(() => server.resetHandlers()); // Reset mỗi test
afterAll(() => server.close()); // Cleanup
```

**Test component với async data:**

```tsx
function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>
          {p.name} - ${p.price}
        </li>
      ))}
    </ul>
  );
}

// TEST
test("shows products after loading", async () => {
  render(<ProductList />);

  // 1. Loading state hiện
  expect(screen.getByText("Loading...")).toBeInTheDocument();

  // 2. Đợi data load xong — findBy... tự đợi (async)
  expect(await screen.findByText("iPhone - $999")).toBeInTheDocument();
  expect(screen.getByText("MacBook - $1999")).toBeInTheDocument();

  // 3. Loading biến mất
  expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
});

test("shows error when API fails", async () => {
  // Override handler cho test này
  server.use(
    http.get("/api/products", () => {
      return HttpResponse.json(null, { status: 500 });
    }),
  );

  render(<ProductList />);
  expect(await screen.findByText(/Error/)).toBeInTheDocument();
});
```

**waitFor — đợi assertion thành true:**

```tsx
import { waitFor } from "@testing-library/react";

test("counter updates after delay", async () => {
  render(<DelayedCounter />);

  await user.click(screen.getByRole("button", { name: "Increment" }));

  // waitFor retry assertion cho đến khi pass hoặc timeout
  await waitFor(() => {
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });
});
```

**findBy vs waitFor:**

```
findBy...  = waitFor + getBy gộp lại
  → Dùng khi đợi element XUẤT HIỆN

waitFor(() => expect(...))
  → Dùng khi đợi assertion phức tạp hơn (text thay đổi, class thay đổi)
```

#### Layer 3: Edge Cases / Trường hợp đặc biệt

1. **Test loading → success → error sequence:**

```tsx
test("handles retry after error", async () => {
  let callCount = 0;
  server.use(
    http.get("/api/data", () => {
      callCount++;
      if (callCount === 1) return HttpResponse.json(null, { status: 500 });
      return HttpResponse.json({ value: 42 });
    }),
  );

  render(<DataWithRetry />);
  expect(await screen.findByText(/Error/)).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Retry" }));
  expect(await screen.findByText("42")).toBeInTheDocument();
});
```

2. **Test với TanStack Query:**

```tsx
// Cần wrap trong QueryClientProvider
function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }, // tắt retry cho test
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}
```

3. **Race condition trong test:**

```tsx
// ❌ Flaky — assertion chạy trước async update
await user.click(submitButton);
expect(screen.getByText("Success")).toBeInTheDocument(); // có thể fail

// ✅ Đợi async update
await user.click(submitButton);
expect(await screen.findByText("Success")).toBeInTheDocument();
```

#### ❌ Common Mistakes / Lỗi thường gặp

| ❌ Sai                                                     | ✅ Đúng                                              | 💡 Tại sao                                                     |
| ---------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------- |
| `jest.mock('axios')`                                       | MSW intercept ở network level                        | MSW realistic hơn, không break khi đổi HTTP client             |
| `fireEvent.click(button)`                                  | `await userEvent.click(button)`                      | userEvent simulate đầy đủ: focus → mouseDown → mouseUp → click |
| `await waitFor(() => {...})` rồi `getByText`               | Dùng `findByText` trực tiếp                          | findBy = waitFor + getBy, gọn hơn                              |
| Test implementation: `expect(setState).toHaveBeenCalled()` | Test behavior: `expect(screen.getByText('Updated'))` | setState là implementation detail                              |

#### 🎯 Interview Pattern

> **Trigger:** "Làm sao test component gọi API?"
> **Concept:** MSW mock ở network level + findBy/waitFor cho async assertions
> **Opening:** "Tôi dùng MSW để mock API ở network level — component code chạy y hệt production. findBy queries tự đợi element xuất hiện sau async operation, tránh flaky tests từ race conditions."

#### 🔑 Knowledge Chain

📚 **Cần trước:** useEffect, fetch/axios, Promise
➡️ **Mở ra:** Test architecture, E2E testing, CI/CD integration

---

### Concept 3: Test Architecture & Strategy / Kiến trúc & Chiến lược Test

🧠 **Memory Hook:** "Testing pyramid = kim tự tháp — nhiều unit ở đáy, ít E2E ở đỉnh"

#### Why does this exist? / Tại sao cần?

**Level 1 — Immediate:** Viết test không có chiến lược → test nhiều nhưng catch ít bug. 100% coverage ≠ 0 bug.

**Level 2 — Root cause:** Mỗi level test có cost/benefit khác nhau. Unit test rẻ + nhanh nhưng không catch integration bugs. E2E catch nhiều nhưng chậm + flaky. Cần balance.

#### Layer 1: Analogy — Kiểm tra xe trước khi lái / Car Inspection

```
Unit test = kiểm tra từng bộ phận:
  ✓ Đèn sáng? ✓ Phanh hoạt động? ✓ Xăng đủ?
  → Nhanh, rẻ, kiểm tra nhiều thứ
  → Nhưng: tất cả OK riêng lẻ ≠ xe chạy được (có thể hết ắc-quy)

Integration test = chạy thử quanh bãi đậu:
  ✓ Nổ máy → sang số → chạy → phanh → đỗ
  → Kiểm tra các bộ phận phối hợp
  → Tốn thời gian hơn nhưng realistic

E2E test = lái từ nhà đến cơ quan:
  ✓ Toàn bộ hành trình: ra garage → đường phố → đỗ xe → vào văn phòng
  → Realistic nhất nhưng tốn thời gian + phụ thuộc traffic
```

#### Layer 2: How It Works / Cách hoạt động

**Testing Trophy (Kent C. Dodds) — better than pyramid:**

```
        ┌──────┐
        │ E2E  │  ← Ít: critical user journeys (login, checkout)
        │ Few  │     Chậm, flaky, expensive
       ┌┴──────┴┐
       │Integra-│  ← NHIỀU NHẤT: component + dependencies
       │ tion   │    Realistic, catch most bugs
      ┌┴────────┴┐
      │  Unit    │  ← Vừa: pure logic, utilities, hooks
      │ Tests    │    Nhanh, isolated
     ┌┴──────────┴┐
     │  Static    │  ← Luôn có: TypeScript + ESLint
     │  Analysis  │    Catch bugs trước khi chạy
     └────────────┘
```

**Mỗi level test CÁI GÌ:**

| Level       | Test cái gì                  | Tools              | Speed    | Confidence |
| ----------- | ---------------------------- | ------------------ | -------- | ---------- |
| Static      | Type errors, lint rules      | TypeScript, ESLint | Instant  | Low        |
| Unit        | Pure functions, hooks, utils | Vitest             | 1-10ms   | Medium     |
| Integration | Component + API + state      | RTL + MSW          | 10-100ms | HIGH       |
| E2E         | Full user journeys           | Playwright         | 1-10s    | Highest    |

**Integration test = best ROI:**

```tsx
// Integration test — test toàn bộ checkout flow
test("user can complete checkout", async () => {
  const user = userEvent.setup();

  // Mock API
  server.use(
    http.get("/api/cart", () =>
      HttpResponse.json({
        items: [{ id: "1", name: "iPhone", price: 999, qty: 1 }],
        total: 999,
      }),
    ),
    http.post("/api/orders", () =>
      HttpResponse.json({
        orderId: "ORD-123",
        status: "confirmed",
      }),
    ),
  );

  // Render full page (có Router, Provider)
  render(
    <Providers>
      <CheckoutPage />
    </Providers>,
  );

  // 1. Cart summary hiện
  expect(await screen.findByText("iPhone")).toBeInTheDocument();
  expect(screen.getByText("$999")).toBeInTheDocument();

  // 2. Fill shipping form
  await user.type(screen.getByLabelText("Full Name"), "John Doe");
  await user.type(screen.getByLabelText("Address"), "123 Main St");

  // 3. Select payment
  await user.click(screen.getByRole("radio", { name: "Credit Card" }));

  // 4. Submit order
  await user.click(screen.getByRole("button", { name: "Place Order" }));

  // 5. Success confirmation
  expect(await screen.findByText("Order Confirmed")).toBeInTheDocument();
  expect(screen.getByText("ORD-123")).toBeInTheDocument();
});
```

**Test custom hook:**

```tsx
import { renderHook, act } from "@testing-library/react";

function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);
  return { count, increment, decrement };
}

test("useCounter increments and decrements", () => {
  const { result } = renderHook(() => useCounter(10));

  expect(result.current.count).toBe(10);

  act(() => {
    result.current.increment();
  });
  expect(result.current.count).toBe(11);

  act(() => {
    result.current.decrement();
  });
  expect(result.current.count).toBe(10);
});

// Hook cần Provider
test("useAuth returns user from context", () => {
  const wrapper = ({ children }) => (
    <AuthProvider testUser={{ name: "John" }}>{children}</AuthProvider>
  );

  const { result } = renderHook(() => useAuth(), { wrapper });
  expect(result.current.user.name).toBe("John");
});
```

**Coverage strategy — WHAT to cover, not HOW MUCH:**

```
Ưu tiên test:
  1. 🔴 Critical paths: checkout, auth, payment → Integration + E2E
  2. 🟡 Business logic: pricing, discounts, validation → Unit
  3. 🟢 UI components: buttons, cards, modals → Integration (render + interact)
  4. ⚪ Static UI: layout, styling → DON'T test (static analysis đủ)

Coverage target:
  - 80% overall là đủ — đừng chase 100%
  - 100% coverage ≠ 0 bugs (chỉ là mọi line được chạy qua)
  - Untested critical path > tested trivial component
```

#### Layer 3: Edge Cases / Trường hợp đặc biệt

1. **Test component with Router:**

```tsx
import { MemoryRouter } from "react-router-dom";

render(
  <MemoryRouter initialEntries={["/products/123"]}>
    <Route path="/products/:id" element={<ProductDetail />} />
  </MemoryRouter>,
);
```

2. **Test portal (modal, tooltip):**

```tsx
// Portal render ngoài container — vẫn query được qua screen
render(<ModalTrigger />);
await user.click(screen.getByRole("button", { name: "Open" }));
// Modal render trong portal nhưng screen vẫn tìm được
expect(screen.getByRole("dialog")).toBeInTheDocument();
```

3. **Snapshot test — dùng TIẾT KIỆM:**

```tsx
// ✅ Snapshot cho output ổn định (email template, error message)
test("error message format", () => {
  const { container } = render(<ErrorBanner code={404} />);
  expect(container).toMatchSnapshot();
});

// ❌ KHÔNG dùng snapshot cho dynamic UI — thay đổi liên tục → snapshot outdated
```

#### ❌ Common Mistakes / Lỗi thường gặp

| ❌ Sai                                                       | ✅ Đúng                                        | 💡 Tại sao                                                  |
| ------------------------------------------------------------ | ---------------------------------------------- | ----------------------------------------------------------- |
| Test implementation: `expect(component.state.count).toBe(1)` | Test behavior: `expect(screen.getByText('1'))` | Implementation có thể thay đổi                              |
| 100% coverage target                                         | 80% + focus critical paths                     | Coverage ≠ quality, 100% tốn effort cho diminishing returns |
| Test mỗi component isolated (all unit)                       | Integration test = best ROI                    | Component isolated ≠ component works with others            |
| Snapshot mọi component                                       | Snapshot chỉ cho stable output                 | Dynamic UI → snapshot luôn outdated                         |
| `fireEvent.change(input, { target: { value: 'x' }})`         | `await userEvent.type(input, 'x')`             | userEvent fire đầy đủ keyboard events                       |

#### 🎯 Interview Pattern

> **Trigger:** "Bạn test React app như thế nào?"
> **Concept:** Testing trophy — integration tests = highest ROI, plus static analysis + unit + E2E
> **Opening:** "Tôi theo testing trophy: TypeScript + ESLint cho static analysis, unit test cho pure logic, integration test bằng RTL + MSW cho component flows — đây là nơi tôi đầu tư nhiều nhất vì ROI cao nhất. E2E bằng Playwright cho critical journeys."

#### 🔑 Knowledge Chain

📚 **Cần trước:** RTL queries, MSW mocking
➡️ **Mở ra:** CI/CD pipeline integration, visual regression testing

---

## ❓ Q&A Section / Phần Hỏi & Đáp

### Q1 🟢: getByRole, queryByRole, findByRole khác nhau thế nào? / Difference between getBy, queryBy, findBy?

💡 **Interview Signal:** Hiểu basic RTL API

**A:**

| Query     | Không tìm thấy       | Dùng khi                     |
| --------- | -------------------- | ---------------------------- |
| `getBy`   | **Throw error**      | Element PHẢI có mặt          |
| `queryBy` | Return **null**      | Assert element KHÔNG tồn tại |
| `findBy`  | **Reject** (timeout) | Element xuất hiện SAU async  |

```tsx
// getBy — assert có mặt
screen.getByRole("button", { name: "Submit" });

// queryBy — assert KHÔNG có mặt
expect(screen.queryByText("Error")).not.toBeInTheDocument();

// findBy — đợi async
expect(await screen.findByText("Data loaded")).toBeInTheDocument();
```

**Quy tắc:** getBy cho synchronous, findBy cho asynchronous, queryBy cho absence.

---

### Q2 🟢: userEvent vs fireEvent — dùng cái nào? / userEvent vs fireEvent?

💡 **Interview Signal:** Hiểu testing realism

**A:** **Luôn dùng userEvent** (trừ khi cần simulate event đặc biệt).

```
fireEvent.click(button):
  → Chỉ fire 1 event: click
  → Không focus, không hover trước

userEvent.click(button):
  → Fire chuỗi events giống user thật:
     pointerMove → mouseOver → mouseMove → pointerDown →
     mouseDown → focus → pointerUp → mouseUp → click
```

```tsx
// ✅ Realistic — bắt được bug liên quan focus/hover
const user = userEvent.setup();
await user.click(button);

// ❌ Simplified — có thể miss bug
fireEvent.click(button);
```

---

### Q3 🟡: Làm sao test component gọi API mà không dùng real backend? / How to test API-calling components without real backend?

💡 **Interview Signal:** Biết modern testing pattern (MSW)

**A:** Dùng **MSW (Mock Service Worker)** — intercept ở network level.

```tsx
// 1. Define handlers
const handlers = [http.get("/api/users", () => HttpResponse.json([{ id: 1, name: "John" }]))];

// 2. Setup server
const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// 3. Test component bình thường — MSW intercept tự động
test("shows users", async () => {
  render(<UserList />);
  expect(await screen.findByText("John")).toBeInTheDocument();
});

// 4. Override cho error case
test("shows error", async () => {
  server.use(http.get("/api/users", () => HttpResponse.json(null, { status: 500 })));
  render(<UserList />);
  expect(await screen.findByText(/Error/)).toBeInTheDocument();
});
```

**Tại sao MSW > jest.mock(fetch)?**

- Component code chạy y hệt production
- Đổi fetch → axios → test KHÔNG break
- Shared handlers giữa tests + Storybook + dev server

---

### Q4 🟡: Làm sao test custom hook? / How to test custom hooks?

💡 **Interview Signal:** Hiểu hook testing pattern

**A:** Dùng `renderHook` từ `@testing-library/react`.

```tsx
import { renderHook, act } from "@testing-library/react";

test("useToggle switches between true/false", () => {
  const { result } = renderHook(() => useToggle(false));

  expect(result.current[0]).toBe(false); // initial value

  act(() => {
    result.current[1]();
  }); // toggle
  expect(result.current[0]).toBe(true);

  act(() => {
    result.current[1]();
  }); // toggle back
  expect(result.current[0]).toBe(false);
});
```

**Hook cần Context:** Truyền `wrapper` option.
**Hook gọi API:** MSW mock + `waitFor`.

```tsx
test("useFetch returns data", async () => {
  server.use(http.get("/api/data", () => HttpResponse.json({ value: 42 })));

  const { result } = renderHook(() => useFetch("/api/data"));

  await waitFor(() => {
    expect(result.current.data).toEqual({ value: 42 });
  });
});
```

---

### Q5 🟡: Coverage 100% có phải mục tiêu tốt? / Is 100% coverage a good target?

💡 **Interview Signal:** Testing maturity — hiểu coverage limits

**A:** **Không.** Coverage đo "code nào được chạy qua" — KHÔNG đo "code có đúng không".

```tsx
// 100% coverage nhưng KHÔNG test edge case
function divide(a: number, b: number) {
  return a / b;
}
test("divide", () => {
  expect(divide(10, 2)).toBe(5);
});
// ↑ 100% line coverage — nhưng divide(10, 0) = Infinity → BUG!
```

**Better approach:**

- Target 80% overall
- 100% cho critical paths (auth, payment, checkout)
- Focus test business logic + user flows, skip trivial UI
- Mutation testing > coverage (đo "test có catch bug không" thay vì "code có chạy qua không")

---

### Q6 🔴: Thiết kế testing strategy cho Checkout page phức tạp / Design testing strategy for complex Checkout page

💡 **Interview Signal:** System-level testing thinking

**A:**

**Checkout page gồm:** Cart summary, Shipping form, Payment method, Order review, Submit.

**Strategy theo testing trophy:**

```
Level 1: Static Analysis (always on)
  → TypeScript cho type safety
  → ESLint cho common mistakes

Level 2: Unit Tests
  → calculateTotal(items, discount, tax): pure function
  → validateAddress(address): validation logic
  → formatCurrency(amount): utility

Level 3: Integration Tests (MOST effort here)
  → Test 1: Cart summary renders items from API (MSW)
  → Test 2: Shipping form validation (required fields, format)
  → Test 3: Payment method selection + form toggle
  → Test 4: Full flow: fill form → submit → success page
  → Test 5: Error handling: API failure → error message → retry

Level 4: E2E (critical path only)
  → Happy path: complete checkout with valid data
  → Payment failure: card declined → error → retry
```

**Test 4 (Integration — full flow):**

```tsx
test("user completes checkout successfully", async () => {
  const user = userEvent.setup();

  server.use(
    http.get("/api/cart", () =>
      HttpResponse.json({
        items: [{ id: "1", name: "iPhone", price: 999 }],
      }),
    ),
    http.post("/api/orders", async ({ request }) => {
      const body = await request.json();
      return HttpResponse.json({ orderId: "ORD-001" });
    }),
  );

  render(
    <Providers>
      <CheckoutPage />
    </Providers>,
  );

  // Wait for cart to load
  expect(await screen.findByText("iPhone")).toBeInTheDocument();

  // Fill shipping
  await user.type(screen.getByLabelText("Name"), "John");
  await user.type(screen.getByLabelText("Address"), "123 Main St");

  // Select payment
  await user.click(screen.getByRole("radio", { name: "Credit Card" }));
  await user.type(screen.getByLabelText("Card Number"), "4242424242424242");

  // Submit
  await user.click(screen.getByRole("button", { name: "Place Order" }));

  // Success
  expect(await screen.findByText("ORD-001")).toBeInTheDocument();
});
```

#### 🔄 Follow-up Chain

**F1: "Test flaky — đôi khi pass, đôi khi fail. Debug thế nào?"**
→ Common causes: (1) async not awaited properly → dùng findBy/waitFor, (2) test order dependency → mỗi test phải independent, (3) timer-based code → dùng vi.useFakeTimers(), (4) MSW handler not reset → afterEach resetHandlers.

**F2: "Khi nào dùng snapshot test?"**
→ Chỉ cho stable output: email templates, error messages, generated configs. KHÔNG dùng cho dynamic UI — luôn outdated, team auto-update snapshot mà không review.

**F3: "Viết test cho legacy code không có test — bắt đầu từ đâu?"**
→ (1) Add integration tests cho critical paths TRƯỚC refactor, (2) Không cần unit test legacy code — integration đủ, (3) TDD cho code MỚI, (4) Characterization tests: test behavior hiện tại trước khi sửa.

---

### Q7 🔴: Test custom hook phức tạp — useFetch với cache, retry, AbortController / Test complex custom hook

💡 **Interview Signal:** Deep hook testing + async patterns

**A:**

```tsx
// The hook
function useFetch<T>(url: string) {
  const [state, setState] = useState<{
    data: T | null;
    error: string | null;
    loading: boolean;
  }>({ data: null, error: null, loading: true });

  useEffect(() => {
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((err) => {
        if (err.name !== "AbortError") {
          setState({ data: null, error: err.message, loading: false });
        }
      });

    return () => controller.abort(); // cleanup on unmount/url change
  }, [url]);

  return state;
}

// TESTS
describe("useFetch", () => {
  test("returns data on success", async () => {
    server.use(http.get("/api/data", () => HttpResponse.json({ value: 42 })));

    const { result } = renderHook(() => useFetch("/api/data"));

    // Initially loading
    expect(result.current.loading).toBe(true);

    // After fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual({ value: 42 });
      expect(result.current.error).toBeNull();
    });
  });

  test("returns error on failure", async () => {
    server.use(http.get("/api/data", () => HttpResponse.json(null, { status: 500 })));

    const { result } = renderHook(() => useFetch("/api/data"));

    await waitFor(() => {
      expect(result.current.error).toBe("HTTP 500");
      expect(result.current.data).toBeNull();
    });
  });

  test("aborts fetch on unmount", async () => {
    // Slow response
    server.use(
      http.get("/api/data", async () => {
        await new Promise((r) => setTimeout(r, 5000));
        return HttpResponse.json({});
      }),
    );

    const { unmount } = renderHook(() => useFetch("/api/data"));

    // Unmount while loading → should not throw/warn
    unmount();
    // No setState after unmount = no warning
  });

  test("refetches when url changes", async () => {
    server.use(
      http.get("/api/data/1", () => HttpResponse.json({ id: 1 })),
      http.get("/api/data/2", () => HttpResponse.json({ id: 2 })),
    );

    const { result, rerender } = renderHook(({ url }) => useFetch(url), {
      initialProps: { url: "/api/data/1" },
    });

    await waitFor(() => expect(result.current.data).toEqual({ id: 1 }));

    rerender({ url: "/api/data/2" });

    await waitFor(() => expect(result.current.data).toEqual({ id: 2 }));
  });
});
```

#### 🔄 Follow-up Chain

**F1: "Làm sao test hook dùng useContext?"**
→ Truyền `wrapper` cho renderHook: `renderHook(() => useAuth(), { wrapper: AuthProvider })`.

**F2: "Test hook performance — đảm bảo không unnecessary re-render?"**
→ Dùng `renderHook` + count renders: tạo ref counter trong test component, assert render count sau mỗi action.

**F3: "Mock timer cho retry logic?"**
→ `vi.useFakeTimers()`, trigger retry, `vi.advanceTimersByTime(1000)`, assert retry behavior.

---

## 📋 Q&A Summary Table / Bảng tóm tắt Q&A

| #   | Question                  | Difficulty | Key Concept              | Interview Signal  |
| --- | ------------------------- | ---------- | ------------------------ | ----------------- |
| Q1  | getBy/queryBy/findBy      | 🟢         | Query variants           | Basic RTL API     |
| Q2  | userEvent vs fireEvent    | 🟢         | Testing realism          | Event simulation  |
| Q3  | API mocking with MSW      | 🟡         | Network-level mocking    | Modern pattern    |
| Q4  | Test custom hooks         | 🟡         | renderHook + act         | Hook testing      |
| Q5  | Coverage 100% target      | 🟡         | Coverage ≠ quality       | Testing maturity  |
| Q6  | Checkout testing strategy | 🔴         | Testing trophy + levels  | System thinking   |
| Q7  | Complex hook testing      | 🔴         | Async + abort + rerender | Deep hook testing |

---

## ⚡ Cold Call Simulation / Mô phỏng phỏng vấn bất ngờ

> **"Bạn approach testing React app như thế nào?"**

**30-second opener:**
"Tôi theo testing trophy: TypeScript cho static analysis, unit test cho pure business logic, integration test bằng RTL + MSW cho component flows — đây là nơi tôi invest nhiều nhất vì catch nhiều bug nhất với cost hợp lý. E2E bằng Playwright chỉ cho critical user journeys như checkout và auth. Tôi query bằng role và label thay vì testId, dùng userEvent thay vì fireEvent để simulate realistic hơn, và target 80% coverage chứ không chase 100%."

---

## 🧪 Self-Check / Tự kiểm tra

> Đóng tài liệu lại. Trả lời từ trí nhớ.

### Retrieval (Nhớ lại)

- [ ] 3 loại query RTL là gì? Khi nào dùng loại nào?
- [ ] MSW mock ở level nào? Tại sao tốt hơn jest.mock?
- [ ] Testing trophy khác testing pyramid ở đâu?

### Visual (Hình dung)

- [ ] Vẽ testing trophy với 4 tầng
- [ ] Vẽ MSW intercept flow: component → fetch → MSW → fake response

### Application (Áp dụng)

- [ ] Viết test cho login form: type email, type password, submit, assert callback
- [ ] Setup MSW cho 1 GET endpoint + test component render data

### Debug (Gỡ lỗi)

- [ ] Test flaky — đôi khi pass đôi khi fail. Check những gì?
- [ ] `getByText` throw error dù element có trên screen. Nguyên nhân?

### Teach (Giảng lại)

- [ ] Giải thích cho junior: tại sao test behavior thay vì implementation?
- [ ] Giải thích: khi nào dùng unit test vs integration test?

### 🗣️ Feynman Prompt

> Giải thích cho người chưa biết testing: "Test React app nghĩa là gì?"

### 🔁 Spaced Repetition

- Day 3: Viết lại query priority từ trí nhớ (8 loại, từ accessible nhất)
- Day 7: Test 1 component thực tế với RTL + MSW
- Day 14: Thiết kế testing strategy cho 1 feature mới trong project

---

## 🔗 Connections / Liên kết

| Concept                  | Related Topic            | File                           |
| ------------------------ | ------------------------ | ------------------------------ |
| Component rendering      | React Fundamentals       | 01-react-fundamentals.md       |
| Custom hooks testing     | Hooks Deep Dive          | 03-hooks-deep-dive.md          |
| State management mocking | State Management         | 05-state-management.md         |
| Performance testing      | Performance Optimization | 09-performance-optimization.md |
| Accessibility queries    | RTL query priority       | WCAG guidelines                |
