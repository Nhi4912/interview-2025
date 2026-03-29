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

> You just shipped a checkout flow feature. QA approved it. Deployed to production. Next morning, PM messages: "Customers can't pay — the button is disabled forever."
>
> You check the code: someone refactored `isLoading` to `isPending` in another PR, but the button still checks `isLoading`. No test caught it — because existing tests only checked "component renders without crashing."
>
> **Testing isn't about "pretty coverage." Testing is insurance — you pay a small premium (writing tests) to avoid massive damage (production bugs).**

> Bạn vừa ship tính năng thanh toán. QA duyệt rồi. Deploy lên production. Sáng hôm sau, PM nhắn: "Khách không thể thanh toán — nút bị tắt vĩnh viễn."
>
> Bạn xem code: ai đó đổi tên `isLoading` thành `isPending` ở PR khác, nhưng nút vẫn kiểm tra `isLoading`. Không có test nào bắt được — vì test cũ chỉ kiểm tra "component hiện ra không bị lỗi."
>
> **Testing không phải để "coverage đẹp." Testing là bảo hiểm — bạn trả phí nhỏ (viết test) để tránh thiệt hại lớn (lỗi trên production).**

---

## 💡 What & Why / Cái gì & Tại sao

**Analogy — Restaurant Quality Check / Kiểm tra chất lượng nhà hàng:**

Imagine you open a restaurant. There are different levels of quality checking:

Tưởng tượng bạn mở nhà hàng. Có các mức kiểm tra chất lượng khác nhau:

- **No tests** = serve the food and pray nobody gets sick. / **Không có test** = phục vụ đồ ăn rồi cầu nguyện khách không đau bụng.
- **Unit test** = check each ingredient: is the fish fresh? Vegetables clean? Spices not expired? / **Unit test** = kiểm tra từng nguyên liệu: cá tươi không? Rau sạch không? Gia vị hết hạn chưa?
- **Integration test** = try cooking one dish: do the ingredients combine well? Does it taste right? / **Integration test** = thử nấu 1 món: nguyên liệu kết hợp có ngon không? Có ra đúng vị không?
- **E2E test** = a customer sits down, orders, eats, and pays — is the entire experience smooth? / **E2E test** = khách ngồi vào, gọi món, ăn xong, thanh toán — toàn bộ trải nghiệm có suôn sẻ không?

**Core insight:** Good tests = test **behavior the user sees**, not internal implementation details. / Test tốt = test **hành vi mà người dùng thấy**, không phải chi tiết bên trong.

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

React testing has 3 layers to master:

Kiểm thử React có 3 tầng cần nắm:

1. **React Testing Library (RTL)** — philosophy "test like a user." Query by role/text/label instead of className/testId. / Triết lý "test như người dùng." Tìm phần tử bằng vai trò/chữ/nhãn thay vì tên class/testId.

2. **Async Testing & API Mocking (MSW)** — test components that call APIs without needing a real backend. MSW intercepts at the network level, so component code runs exactly like production. / Test component gọi API mà không cần backend thật. MSW chặn ở tầng mạng, nên code component chạy y hệt production.

3. **Test Architecture** — choose the right test level (unit/integration/E2E), write valuable tests instead of chasing coverage numbers. / Chọn đúng cấp độ test, viết test có giá trị thay vì chạy theo số coverage.

---

## 🧩 Core Concepts / Khái niệm cốt lõi

### Concept 1: React Testing Library Philosophy & Query Strategy / Triết lý RTL & Chiến lược Query

> 🧠 **Memory Hook:** "RTL = test like a user — they don't know classNames, they only see text and buttons"
>
> 🧠 **Ghi nhớ:** "RTL = test như người dùng — họ không biết className, họ chỉ thấy chữ và nút bấm"

#### Why does this exist? / Tại sao cần?

**Level 1 — Immediate:** The old library (Enzyme) tested implementation details: checking state values, calling instance methods. Refactoring code → tests break even though behavior doesn't change.

**Tầng 1 — Trực tiếp:** Thư viện cũ (Enzyme) test chi tiết bên trong: kiểm tra giá trị state, gọi phương thức nội bộ. Sửa code → test hỏng dù hành vi không đổi.

**Level 2 — Root cause:** Tests tied to implementation become a burden instead of a safety net. Every refactor requires fixing tests → team avoids refactoring → code rots. RTL flips the approach: test behavior (what user sees/does) → refactor freely as long as behavior stays the same.

**Tầng 2 — Nguyên nhân gốc:** Test gắn chặt vào cách viết code bên trong trở thành gánh nặng thay vì lưới an toàn. Mỗi lần tái cấu trúc phải sửa test → team ngại tái cấu trúc → code mục nát. RTL đảo ngược cách tiếp cận: test hành vi (người dùng thấy/làm gì) → thoải mái tái cấu trúc miễn hành vi giữ nguyên.

#### Layer 1: Analogy — Elevator Inspection / Kiểm tra thang máy

```
Implementation testing (Enzyme style):
  ✓ Motor RPM = 1500         (Tốc độ motor)
  ✓ Cable tension = 500kg    (Lực căng cáp)
  ✓ Circuit board voltage = 24V (Điện áp mạch)
  → Replace motor → ALL tests fail even though elevator still works
  → Thay motor → TẤT CẢ test hỏng dù thang máy vẫn chạy tốt

Behavior testing (RTL style):
  ✓ Press floor 5 button → elevator goes to floor 5
    (Bấm nút tầng 5 → thang lên tầng 5)
  ✓ Door opens when arrived (Cửa mở khi đến nơi)
  ✓ Overload → shows warning (Quá tải → hiện cảnh báo)
  → Replace motor → tests still pass because behavior unchanged
  → Thay motor → test vẫn đúng vì hành vi không đổi
```

#### Layer 2: How It Works / Cách hoạt động

**Query Priority — from most accessible to least / từ dễ tiếp cận nhất đến kém nhất:**

```
High priority (accessible to everyone / dễ tiếp cận cho mọi người):
  1. getByRole('button', { name: 'Submit' })     ← screen reader reads this
  2. getByLabelText('Email')                       ← form label
  3. getByPlaceholderText('Enter email')           ← placeholder text
  4. getByText('Welcome back')                     ← visible text
  5. getByDisplayValue('john@email.com')           ← current input value

Low priority (use when no better option / dùng khi không còn cách khác):
  6. getByAltText('Profile photo')                 ← img alt text
  7. getByTitle('Close')                           ← title attribute
  8. getByTestId('submit-btn')                     ← data-testid (LAST RESORT)
```

**3 Query Types — getBy / queryBy / findBy:**

```
getBy...    → Found: return element / Tìm thấy: trả phần tử
             → Not found: THROW ERROR / Không thấy: NÉM LỖI ngay
             → Use when: element MUST exist / phần tử PHẢI có mặt

queryBy...  → Found: return element / Tìm thấy: trả phần tử
             → Not found: return NULL / Không thấy: trả NULL
             → Use when: assert element DOES NOT exist / phần tử KHÔNG tồn tại

findBy...   → Returns PROMISE (await)
             → Found: resolves element / Tìm thấy: trả phần tử
             → Not found (timeout): rejects / Không thấy: báo lỗi
             → Use when: element appears AFTER async / phần tử xuất hiện SAU khi bất đồng bộ
```

**Practical example / Ví dụ thực tế:**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// TEST — test behavior, not state / test hành vi, không test state
test("submits email and password", async () => {
  const handleSubmit = vi.fn();
  const user = userEvent.setup();

  render(<LoginForm onSubmit={handleSubmit} />);

  // Query by label — accessible / Tìm bằng nhãn — dễ tiếp cận
  await user.type(screen.getByLabelText("Email"), "john@email.com");
  await user.type(screen.getByLabelText("Password"), "secret123");

  // Query by role — accessible / Tìm bằng vai trò — dễ tiếp cận
  await user.click(screen.getByRole("button", { name: "Log In" }));

  // Assert behavior — callback was called correctly / hàm gọi lại được gọi đúng
  expect(handleSubmit).toHaveBeenCalledWith({
    email: "john@email.com",
    password: "secret123",
  });
});

// TEST — element doesn't exist / phần tử không tồn tại
test("error message not shown initially", () => {
  render(<LoginForm onSubmit={vi.fn()} />);
  // queryBy returns null if not found (doesn't throw) / trả null nếu không thấy (không báo lỗi)
  expect(screen.queryByText("Invalid credentials")).not.toBeInTheDocument();
});
```

#### Layer 3: Edge Cases / Trường hợp đặc biệt

1. **Multiple elements with same role / Nhiều phần tử cùng vai trò:**

```tsx
// 2 buttons — need name to distinguish / cần tên để phân biệt
screen.getByRole("button", { name: "Submit" });
screen.getByRole("button", { name: "Cancel" });

// Or getAllByRole returns array / Hoặc getAllByRole trả mảng
const buttons = screen.getAllByRole("button");
expect(buttons).toHaveLength(2);
```

2. **within — scope query inside a container / giới hạn tìm kiếm trong 1 vùng:**

```tsx
import { within } from "@testing-library/react";

const nav = screen.getByRole("navigation");
const homeLink = within(nav).getByRole("link", { name: "Home" });
// ↑ only searches inside <nav>, not the whole page
// ↑ chỉ tìm trong <nav>, không tìm toàn trang
```

3. **Complex accessible name / Tên tiếp cận phức tạp:**

```tsx
// Button with icon, no text / Nút có icon, không có chữ
<button aria-label="Close dialog">✕</button>;
screen.getByRole("button", { name: "Close dialog" });
```

#### ❌ Common Mistakes / Lỗi thường gặp

| ❌ Mistake / Sai lầm                                      | ✅ Correct / Đúng là                      | 💡 Why / Tại sao                                                                                              |
| --------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `getByTestId('submit-btn')` when text exists / khi có chữ | `getByRole('button', { name: 'Submit' })` | testId = last resort, role is more accessible / testId là lựa chọn cuối, role dễ tiếp cận hơn                 |
| `getByText('Submit')` for button / cho nút                | `getByRole('button', { name: 'Submit' })` | Role is more precise — text "Submit" could be elsewhere / Role chính xác hơn — chữ "Submit" có thể ở nơi khác |
| `container.querySelector('.btn')`                         | RTL queries                               | CSS class = implementation detail / class CSS = chi tiết bên trong                                            |
| `fireEvent.click(button)`                                 | `await userEvent.click(button)`           | userEvent simulates full event chain / userEvent mô phỏng đầy đủ chuỗi sự kiện                                |

#### 🎯 Interview Pattern

> **Trigger:** "How is RTL different from Enzyme?" / "RTL khác Enzyme thế nào?"
>
> 🇬🇧 **Opening:** "RTL enforces testing from the user's perspective — querying by role, text, and label instead of CSS selectors. When you refactor internal implementation, tests don't break as long as behavior stays the same. This makes tests a safety net rather than a maintenance burden."
>
> 🇻🇳 **Mở đầu:** "RTL bắt buộc test từ góc nhìn người dùng — tìm phần tử bằng vai trò, chữ, nhãn thay vì CSS selector. Khi tái cấu trúc code bên trong, test không hỏng miễn hành vi giữ nguyên. Điều này biến test thành lưới an toàn thay vì gánh nặng bảo trì."

#### 🔑 Knowledge Chain

📚 **Prerequisite / Cần trước:** React component basics, DOM structure, accessibility roles
➡️ **Enables / Mở ra:** Async testing, integration testing, test architecture

---

### Concept 2: Async Testing & API Mocking with MSW / Test bất đồng bộ & Mock API bằng MSW

> 🧠 **Memory Hook:** "MSW = stunt double for the server — the component doesn't know it's talking to a fake"
>
> 🧠 **Ghi nhớ:** "MSW = diễn viên đóng thế cho server — component không biết đang nói chuyện với hàng giả"

#### Why does this exist? / Tại sao cần?

**Level 1 — Immediate:** Components call APIs → tests need fake responses. Using `jest.mock(fetch)` mocks implementation details and breaks easily.

**Tầng 1 — Trực tiếp:** Component gọi API → test cần phản hồi giả. Dùng `jest.mock(fetch)` mock chi tiết bên trong và dễ hỏng.

**Level 2 — Root cause:** Mocking at the network level (MSW) instead of code level (jest.mock) means component code runs exactly like production — only the "server" response is fake. Tests are more realistic and catch more bugs. If you switch from fetch to axios, tests DON'T break.

**Tầng 2 — Nguyên nhân gốc:** Mock ở tầng mạng (MSW) thay vì tầng code (jest.mock) nghĩa là code component chạy y hệt production — chỉ phản hồi từ "server" là giả. Test thực tế hơn và bắt nhiều lỗi hơn. Nếu đổi từ fetch sang axios, test KHÔNG hỏng.

#### Layer 1: Analogy — Stunt Double / Diễn viên đóng thế

```
jest.mock(fetch):
  = Cut the scene, paste the response in / Cắt cảnh, dán phản hồi vào
  → Doesn't test fetch logic, headers, error handling
    Không test logic gọi API, headers, xử lý lỗi
  → If fetch library changes (axios → fetch) → test breaks
    Nếu đổi thư viện gọi API → test hỏng

MSW (Mock Service Worker):
  = Stunt double for the server / Diễn viên đóng thế cho server
  → Component still calls fetch/axios normally
    Component vẫn gọi fetch/axios bình thường
  → MSW intercepts at network level, returns fake response
    MSW chặn ở tầng mạng, trả phản hồi giả
  → Switch from fetch to axios → test does NOT break
    Đổi từ fetch sang axios → test KHÔNG hỏng
```

#### Layer 2: How It Works / Cách hoạt động

**Setup MSW / Cài đặt MSW:**

```tsx
// mocks/handlers.ts — define fake API responses / định nghĩa phản hồi API giả
import { http, HttpResponse } from "msw";

export const handlers = [
  // GET /api/products — returns fake product list / trả danh sách sản phẩm giả
  http.get("/api/products", () => {
    return HttpResponse.json([
      { id: "1", name: "iPhone", price: 999 },
      { id: "2", name: "MacBook", price: 1999 },
    ]);
  }),

  // Error scenario / Trường hợp lỗi
  http.get("/api/user", () => {
    return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
  }),
];

// mocks/server.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";
export const server = setupServer(...handlers);

// vitest.setup.ts
beforeAll(() => server.listen()); // Start intercepting / Bắt đầu chặn
afterEach(() => server.resetHandlers()); // Reset each test / Reset mỗi test
afterAll(() => server.close()); // Cleanup / Dọn dẹp
```

**Test component with async data / Test component với dữ liệu bất đồng bộ:**

```tsx
test("shows products after loading", async () => {
  render(<ProductList />);

  // 1. Loading state appears / Trạng thái đang tải hiện ra
  expect(screen.getByText("Loading...")).toBeInTheDocument();

  // 2. Wait for data to load — findBy automatically waits (async)
  // Đợi dữ liệu tải xong — findBy tự đợi (bất đồng bộ)
  expect(await screen.findByText("iPhone - $999")).toBeInTheDocument();
  expect(screen.getByText("MacBook - $1999")).toBeInTheDocument();

  // 3. Loading disappears / Trạng thái đang tải biến mất
  expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
});

test("shows error when API fails", async () => {
  // Override handler for this test / Ghi đè handler cho test này
  server.use(
    http.get("/api/products", () => {
      return HttpResponse.json(null, { status: 500 });
    }),
  );

  render(<ProductList />);
  expect(await screen.findByText(/Error/)).toBeInTheDocument();
});
```

**findBy vs waitFor:**

```
findBy...  = waitFor + getBy combined / kết hợp
  → Use when waiting for element to APPEAR / Dùng khi đợi phần tử XUẤT HIỆN

waitFor(() => expect(...))
  → Use when waiting for complex assertion / Dùng khi đợi kiểm tra phức tạp hơn
  → (text change, class change, etc.)
```

#### Layer 3: Edge Cases / Trường hợp đặc biệt

1. **Test with TanStack Query / Test với TanStack Query:**

```tsx
// Need to wrap in QueryClientProvider / Cần bọc trong QueryClientProvider
function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }, // disable retry for tests / tắt thử lại
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}
```

2. **Race condition in tests / Xung đột thời gian trong test:**

```tsx
// ❌ Flaky — assertion runs before async update / kiểm tra chạy trước cập nhật bất đồng bộ
await user.click(submitButton);
expect(screen.getByText("Success")).toBeInTheDocument(); // might fail / có thể hỏng

// ✅ Wait for async update / Đợi cập nhật bất đồng bộ
await user.click(submitButton);
expect(await screen.findByText("Success")).toBeInTheDocument();
```

#### ❌ Common Mistakes / Lỗi thường gặp

| ❌ Mistake / Sai lầm                                       | ✅ Correct / Đúng là                                   | 💡 Why / Tại sao                                                                                                    |
| ---------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `jest.mock('axios')`                                       | MSW intercepts at network level / MSW chặn ở tầng mạng | MSW is more realistic, doesn't break when switching HTTP client / MSW thực tế hơn, không hỏng khi đổi thư viện HTTP |
| `fireEvent.click(button)`                                  | `await userEvent.click(button)`                        | userEvent simulates full chain: focus → mouseDown → mouseUp → click / mô phỏng đầy đủ chuỗi                         |
| Test implementation: `expect(setState).toHaveBeenCalled()` | Test behavior: `expect(screen.getByText('Updated'))`   | setState is implementation detail / setState là chi tiết bên trong                                                  |
| No `await` before `findBy`                                 | Always `await screen.findByText(...)`                  | findBy returns a Promise / findBy trả về Promise                                                                    |

#### 🎯 Interview Pattern

> **Trigger:** "How do you test components that call APIs?" / "Làm sao test component gọi API?"
>
> 🇬🇧 **Opening:** "I use MSW to mock APIs at the network level — component code runs exactly like production. findBy queries automatically wait for elements to appear after async operations, preventing flaky tests from race conditions."
>
> 🇻🇳 **Mở đầu:** "Tôi dùng MSW để mock API ở tầng mạng — code component chạy y hệt production. Query findBy tự đợi phần tử xuất hiện sau thao tác bất đồng bộ, tránh test không ổn định do xung đột thời gian."

#### 🔑 Knowledge Chain

📚 **Prerequisite / Cần trước:** useEffect, fetch/axios, Promise
➡️ **Enables / Mở ra:** Test architecture, E2E testing, CI/CD integration

---

### Concept 3: Test Architecture & Strategy / Kiến trúc & Chiến lược Test

> 🧠 **Memory Hook:** "Testing trophy = integration tests are the sweet spot — most bugs caught per dollar spent"
>
> 🧠 **Ghi nhớ:** "Testing trophy = integration test là điểm ngọt — bắt nhiều lỗi nhất trên mỗi đồng bỏ ra"

#### Why does this exist? / Tại sao cần?

**Level 1 — Immediate:** Writing tests without strategy → many tests but few bugs caught. 100% coverage ≠ 0 bugs.

**Tầng 1 — Trực tiếp:** Viết test không có chiến lược → test nhiều nhưng bắt ít lỗi. 100% coverage ≠ 0 lỗi.

**Level 2 — Root cause:** Each test level has different cost/benefit. Unit tests are cheap + fast but don't catch integration bugs. E2E catches the most but is slow + flaky. You need the right balance — and the sweet spot is integration tests.

**Tầng 2 — Nguyên nhân gốc:** Mỗi cấp test có chi phí/lợi ích khác nhau. Unit test rẻ + nhanh nhưng không bắt lỗi tích hợp. E2E bắt nhiều nhất nhưng chậm + không ổn định. Cần cân bằng đúng — và điểm ngọt là integration test.

#### Layer 1: Analogy — Car Inspection / Kiểm tra xe

```
Unit test = check each part individually / kiểm tra từng bộ phận riêng:
  ✓ Lights work? Brakes work? Gas enough? / Đèn sáng? Phanh ok? Xăng đủ?
  → Fast, cheap, checks many things / Nhanh, rẻ, kiểm tra nhiều thứ
  → But: all OK individually ≠ car runs (battery could be dead)
    Nhưng: tất cả OK riêng ≠ xe chạy (có thể hết ắc-quy)

Integration test = test drive around parking lot / chạy thử quanh bãi đậu:
  ✓ Start engine → shift gear → drive → brake → park
    Nổ máy → sang số → chạy → phanh → đỗ
  → Tests parts working together / Kiểm tra các bộ phận phối hợp
  → Takes more time but realistic / Tốn thời gian hơn nhưng thực tế

E2E test = drive from home to office / lái từ nhà đến cơ quan:
  ✓ Full journey: garage → street → parking → office
    Toàn bộ hành trình: ga-ra → đường phố → đỗ xe → văn phòng
  → Most realistic but depends on traffic / Thực tế nhất nhưng phụ thuộc giao thông
```

#### Layer 2: How It Works / Cách hoạt động

**Testing Trophy (Kent C. Dodds) — better than the pyramid / tốt hơn kim tự tháp:**

```
        ┌──────┐
        │ E2E  │  ← Few: critical user journeys (login, checkout)
        │ Few  │     Ít: hành trình user quan trọng (đăng nhập, thanh toán)
       ┌┴──────┴┐
       │Integra-│  ← MOST: component + dependencies
       │ tion   │    NHIỀU NHẤT: component + phụ thuộc
      ┌┴────────┴┐
      │  Unit    │  ← Medium: pure logic, utilities, hooks
      │ Tests    │    Vừa phải: logic thuần, tiện ích, hooks
     ┌┴──────────┴┐
     │  Static    │  ← Always on: TypeScript + ESLint
     │  Analysis  │    Luôn bật: TypeScript + ESLint
     └────────────┘
```

**What each level tests / Mỗi cấp test cái gì:**

| Level / Cấp            | Tests what / Test cái gì                                  | Tools / Công cụ    | Speed / Tốc độ    | Confidence / Tin cậy |
| ---------------------- | --------------------------------------------------------- | ------------------ | ----------------- | -------------------- |
| Static / Tĩnh          | Type errors, lint rules / Lỗi kiểu, quy tắc lint          | TypeScript, ESLint | Instant / Tức thì | Low / Thấp           |
| Unit / Đơn vị          | Pure functions, hooks, utils / Hàm thuần, hooks, tiện ích | Vitest             | 1-10ms            | Medium / TB          |
| Integration / Tích hợp | Component + API + state                                   | RTL + MSW          | 10-100ms          | HIGH / CAO           |
| E2E                    | Full user journeys / Toàn bộ hành trình user              | Playwright         | 1-10s             | Highest / Cao nhất   |

**Integration test = best ROI / lợi ích cao nhất:**

```tsx
// Integration test — test entire checkout flow / test toàn bộ luồng thanh toán
test("user can complete checkout", async () => {
  const user = userEvent.setup();

  // Mock API responses / Phản hồi API giả
  server.use(
    http.get("/api/cart", () =>
      HttpResponse.json({
        items: [{ id: "1", name: "iPhone", price: 999, qty: 1 }],
        total: 999,
      }),
    ),
    http.post("/api/orders", () => HttpResponse.json({ orderId: "ORD-123", status: "confirmed" })),
  );

  // Render full page with providers / Hiện toàn bộ trang với providers
  render(
    <Providers>
      <CheckoutPage />
    </Providers>,
  );

  // 1. Cart summary appears / Tóm tắt giỏ hàng hiện ra
  expect(await screen.findByText("iPhone")).toBeInTheDocument();

  // 2. Fill shipping form / Điền form giao hàng
  await user.type(screen.getByLabelText("Full Name"), "John Doe");
  await user.type(screen.getByLabelText("Address"), "123 Main St");

  // 3. Select payment / Chọn thanh toán
  await user.click(screen.getByRole("radio", { name: "Credit Card" }));

  // 4. Submit order / Gửi đơn hàng
  await user.click(screen.getByRole("button", { name: "Place Order" }));

  // 5. Success confirmation / Xác nhận thành công
  expect(await screen.findByText("Order Confirmed")).toBeInTheDocument();
  expect(screen.getByText("ORD-123")).toBeInTheDocument();
});
```

**Test custom hooks / Test hooks tùy chỉnh:**

```tsx
import { renderHook, act } from "@testing-library/react";

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
```

**Coverage strategy — WHAT to cover, not HOW MUCH / Test CÁI GÌ, không phải BAO NHIÊU:**

```
Priority / Ưu tiên:
  1. 🔴 Critical paths: checkout, auth, payment → Integration + E2E
     Đường quan trọng: thanh toán, xác thực → Integration + E2E
  2. 🟡 Business logic: pricing, discounts, validation → Unit
     Logic kinh doanh: tính giá, giảm giá → Unit
  3. 🟢 UI components: buttons, cards, modals → Integration
     Component giao diện → Integration
  4. ⚪ Static UI: layout, styling → DON'T test (static analysis enough)
     Giao diện tĩnh → ĐỪNG test (phân tích tĩnh là đủ)

Coverage target / Mục tiêu coverage:
  - 80% overall is enough — don't chase 100%
    80% tổng thể là đủ — đừng đuổi theo 100%
  - 100% coverage ≠ 0 bugs (just means every line was executed)
    100% coverage ≠ 0 lỗi (chỉ nghĩa là mỗi dòng đã chạy qua)
```

#### Layer 3: Edge Cases / Trường hợp đặc biệt

1. **Test component with Router / Test component có Router:**

```tsx
import { MemoryRouter } from "react-router-dom";

render(
  <MemoryRouter initialEntries={["/products/123"]}>
    <Route path="/products/:id" element={<ProductDetail />} />
  </MemoryRouter>,
);
```

2. **Snapshot test — use sparingly / dùng tiết kiệm:**

```tsx
// ✅ Snapshot for stable output (email template, error message)
// ✅ Snapshot cho đầu ra ổn định (mẫu email, thông báo lỗi)
test("error message format", () => {
  const { container } = render(<ErrorBanner code={404} />);
  expect(container).toMatchSnapshot();
});

// ❌ DON'T snapshot dynamic UI — changes constantly → always outdated
// ❌ ĐỪNG snapshot giao diện động — thay đổi liên tục → luôn cũ
```

#### ❌ Common Mistakes / Lỗi thường gặp

| ❌ Mistake / Sai lầm                                                   | ✅ Correct / Đúng là                                          | 💡 Why / Tại sao                                                       |
| ---------------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Test implementation: `component.state.count`                           | Test behavior: `screen.getByText('1')`                        | Implementation can change / Cách viết bên trong có thể đổi             |
| 100% coverage target / Mục tiêu 100%                                   | 80% + focus critical paths / 80% + tập trung đường quan trọng | Coverage ≠ quality / Coverage ≠ chất lượng                             |
| Test every component isolated (all unit) / Test từng component cách ly | Integration test = best ROI                                   | Component isolated ≠ works with others / cách ly ≠ hoạt động cùng nhau |
| Snapshot everything / Snapshot mọi thứ                                 | Snapshot only stable output / chỉ cho đầu ra ổn định          | Dynamic UI → snapshot always outdated / giao diện động → luôn cũ       |

#### 🎯 Interview Pattern

> **Trigger:** "How do you test React apps?" / "Bạn test React app thế nào?"
>
> 🇬🇧 **Opening:** "I follow the testing trophy: TypeScript + ESLint for static analysis, unit tests for pure logic, integration tests with RTL + MSW for component flows — that's where I invest the most because the ROI is highest. E2E with Playwright only for critical user journeys like checkout and auth."
>
> 🇻🇳 **Mở đầu:** "Tôi theo testing trophy: TypeScript + ESLint cho phân tích tĩnh, unit test cho logic thuần, integration test bằng RTL + MSW cho luồng component — đó là nơi tôi đầu tư nhiều nhất vì lợi ích cao nhất. E2E bằng Playwright chỉ cho hành trình user quan trọng như thanh toán và xác thực."

#### 🔑 Knowledge Chain

📚 **Prerequisite / Cần trước:** RTL queries, MSW mocking
➡️ **Enables / Mở ra:** CI/CD pipeline integration, visual regression testing

---

## ❓ Q&A Section / Phần Hỏi & Đáp

### Q1 🟢: What's the difference between getBy, queryBy, and findBy? / getByRole, queryByRole, findByRole khác nhau thế nào?

💡 **Interview Signal:** Understanding basic RTL API / Hiểu API cơ bản của RTL

🇬🇧 **A:** `getBy` throws an error if not found — use when the element MUST exist. `queryBy` returns null if not found — use when asserting an element does NOT exist. `findBy` returns a Promise — use when the element appears AFTER an async operation (like API loading).

🇻🇳 **A:** `getBy` báo lỗi nếu không tìm thấy — dùng khi phần tử PHẢI có mặt. `queryBy` trả null nếu không thấy — dùng khi xác nhận phần tử KHÔNG tồn tại. `findBy` trả Promise — dùng khi phần tử xuất hiện SAU thao tác bất đồng bộ (như tải API).

| Query     | Not found / Không thấy     | Use when / Dùng khi                             |
| --------- | -------------------------- | ----------------------------------------------- |
| `getBy`   | **Throws error** / Báo lỗi | Element MUST exist / Phần tử PHẢI có            |
| `queryBy` | Returns **null**           | Assert NOT exists / Xác nhận KHÔNG tồn tại      |
| `findBy`  | **Rejects** (timeout)      | Appears AFTER async / Xuất hiện SAU bất đồng bộ |

---

### Q2 🟢: userEvent vs fireEvent — which to use? / Dùng cái nào?

💡 **Interview Signal:** Understanding testing realism / Hiểu mức độ thực tế của test

🇬🇧 **A:** Always use userEvent (unless you need a special low-level event). `fireEvent.click()` fires only one event: click. `userEvent.click()` fires the full chain like a real user: pointerMove → mouseOver → mouseMove → pointerDown → mouseDown → focus → pointerUp → mouseUp → click. This catches bugs related to focus, hover, and event order that fireEvent misses.

🇻🇳 **A:** Luôn dùng userEvent (trừ khi cần sự kiện đặc biệt cấp thấp). `fireEvent.click()` chỉ phát 1 sự kiện: click. `userEvent.click()` phát chuỗi đầy đủ như người dùng thật: pointerMove → mouseOver → mouseMove → pointerDown → mouseDown → focus → pointerUp → mouseUp → click. Điều này bắt được lỗi liên quan focus, hover, và thứ tự sự kiện mà fireEvent bỏ lỡ.

---

### Q3 🟡: How to test API-calling components without a real backend? / Test component gọi API mà không cần backend thật?

💡 **Interview Signal:** Knows modern testing pattern (MSW) / Biết mô hình test hiện đại

🇬🇧 **A:** Use MSW (Mock Service Worker) — it intercepts at the network level. Component code runs exactly like production. Define handlers for each endpoint, start the server before tests, reset after each test. To test error cases, override the handler for that specific test. MSW is better than jest.mock(fetch) because: (1) component code is unchanged, (2) switching from fetch to axios doesn't break tests, (3) handlers can be shared between tests, Storybook, and dev server.

🇻🇳 **A:** Dùng MSW (Mock Service Worker) — chặn ở tầng mạng. Code component chạy y hệt production. Định nghĩa handler cho mỗi endpoint, khởi động server trước test, reset sau mỗi test. Để test trường hợp lỗi, ghi đè handler cho test cụ thể đó. MSW tốt hơn jest.mock(fetch) vì: (1) code component không thay đổi, (2) đổi từ fetch sang axios không hỏng test, (3) handler dùng chung giữa test, Storybook, và dev server.

---

### Q4 🟡: How to test custom hooks? / Test hooks tùy chỉnh thế nào?

💡 **Interview Signal:** Understanding hook testing pattern / Hiểu mô hình test hooks

🇬🇧 **A:** Use `renderHook` from `@testing-library/react`. It creates a test component that calls your hook, then you access results via `result.current`. Wrap state updates in `act()`. For hooks needing Context, pass a `wrapper` option. For hooks calling APIs, combine with MSW + `waitFor`.

🇻🇳 **A:** Dùng `renderHook` từ `@testing-library/react`. Nó tạo component test gọi hook của bạn, rồi bạn truy cập kết quả qua `result.current`. Bọc cập nhật state trong `act()`. Cho hook cần Context, truyền tùy chọn `wrapper`. Cho hook gọi API, kết hợp với MSW + `waitFor`.

```tsx
test("useToggle switches between true/false", () => {
  const { result } = renderHook(() => useToggle(false));
  expect(result.current[0]).toBe(false);

  act(() => result.current[1]()); // toggle
  expect(result.current[0]).toBe(true);
});
```

---

### Q5 🟡: Is 100% coverage a good target? / Coverage 100% có phải mục tiêu tốt?

💡 **Interview Signal:** Testing maturity — understanding coverage limits / Hiểu giới hạn coverage

🇬🇧 **A:** No. Coverage measures "which code was executed" — NOT "whether code is correct." Example: `divide(10, 2)` gives 100% line coverage but `divide(10, 0) = Infinity` is a bug never caught. Better approach: target 80% overall, 100% for critical paths (auth, payment), focus on business logic + user flows, skip trivial UI. Mutation testing is better than coverage — it measures "do tests actually catch bugs" instead of "was code executed."

🇻🇳 **A:** Không. Coverage đo "code nào được chạy qua" — KHÔNG đo "code có đúng không." Ví dụ: `divide(10, 2)` cho 100% coverage nhưng `divide(10, 0) = Infinity` là lỗi không ai bắt. Cách tốt hơn: mục tiêu 80% tổng thể, 100% cho đường quan trọng (xác thực, thanh toán), tập trung logic kinh doanh + luồng user, bỏ qua giao diện tầm thường. Mutation testing tốt hơn coverage — đo "test có bắt lỗi thật không" thay vì "code có chạy qua không."

---

### Q6 🔴: Design testing strategy for a complex Checkout page / Thiết kế chiến lược test cho trang Thanh toán phức tạp

💡 **Interview Signal:** System-level testing thinking / Tư duy test cấp hệ thống

🇬🇧 **A:** Checkout page has: cart summary, shipping form, payment method, order review, submit. Strategy by testing trophy:

- **Static Analysis (always on):** TypeScript + ESLint catch type errors and common mistakes before running code.
- **Unit Tests:** Pure functions — `calculateTotal(items, discount, tax)`, `validateAddress(address)`, `formatCurrency(amount)`.
- **Integration Tests (MOST effort here):** Test 1: cart summary renders items from API (MSW). Test 2: shipping form validation. Test 3: payment method selection. Test 4: full flow from form fill to success page. Test 5: error handling — API failure → error message → retry.
- **E2E (critical paths only):** Happy path: complete checkout with valid data. Payment failure: card declined → error → retry.

🇻🇳 **A:** Trang thanh toán có: tóm tắt giỏ hàng, form giao hàng, phương thức thanh toán, xem lại đơn, gửi. Chiến lược theo testing trophy:

- **Phân tích tĩnh (luôn bật):** TypeScript + ESLint bắt lỗi kiểu và lỗi thường gặp trước khi chạy code.
- **Unit Test:** Hàm thuần — `calculateTotal(items, discount, tax)`, `validateAddress(address)`, `formatCurrency(amount)`.
- **Integration Test (ĐẦU TƯ NHIỀU NHẤT ở đây):** Test 1: tóm tắt giỏ hàng hiện sản phẩm từ API (MSW). Test 2: kiểm tra form giao hàng. Test 3: chọn phương thức thanh toán. Test 4: luồng đầy đủ từ điền form đến trang thành công. Test 5: xử lý lỗi — API lỗi → thông báo lỗi → thử lại.
- **E2E (chỉ đường quan trọng):** Luồng chính: hoàn tất thanh toán với dữ liệu hợp lệ. Thanh toán thất bại: thẻ bị từ chối → lỗi → thử lại.

#### 🔄 Follow-up Chain

**F1: "Test is flaky — sometimes passes, sometimes fails. How to debug?"** → Common causes: (1) async not awaited → use findBy/waitFor, (2) test order dependency → each test must be independent, (3) timer-based code → use vi.useFakeTimers(), (4) MSW handler not reset → afterEach resetHandlers.

**F1: "Test không ổn định — lúc đúng lúc sai. Debug thế nào?"** → Nguyên nhân thường gặp: (1) bất đồng bộ không đợi → dùng findBy/waitFor, (2) test phụ thuộc thứ tự → mỗi test phải độc lập, (3) code dùng timer → dùng vi.useFakeTimers(), (4) MSW handler không reset → afterEach resetHandlers.

**F2: "How to start testing legacy code with no tests?"** → (1) Add integration tests for critical paths BEFORE refactoring, (2) Don't need unit tests for legacy — integration is enough, (3) TDD for NEW code, (4) Characterization tests: test current behavior before changing it.

**F2: "Viết test cho code cũ không có test — bắt đầu thế nào?"** → (1) Thêm integration test cho đường quan trọng TRƯỚC khi tái cấu trúc, (2) Không cần unit test code cũ — integration đủ, (3) TDD cho code MỚI, (4) Characterization test: test hành vi hiện tại trước khi sửa.

---

### Q7 🔴: Test a complex custom hook — useFetch with cache, retry, AbortController / Test hook phức tạp — useFetch có cache, thử lại, AbortController

💡 **Interview Signal:** Deep hook testing + async patterns / Test hooks sâu + mô hình bất đồng bộ

🇬🇧 **A:** Test 4 scenarios: (1) Success — returns data with loading=false. (2) Error — returns error message. (3) Abort on unmount — unmount while loading, no state-after-unmount warning. (4) URL change — refetches when url prop changes.

🇻🇳 **A:** Test 4 trường hợp: (1) Thành công — trả dữ liệu với loading=false. (2) Lỗi — trả thông báo lỗi. (3) Hủy khi gỡ bỏ — gỡ bỏ khi đang tải, không có cảnh báo set state sau khi gỡ. (4) Đổi URL — lấy lại dữ liệu khi prop url thay đổi.

```tsx
describe("useFetch", () => {
  test("returns data on success", async () => {
    server.use(http.get("/api/data", () => HttpResponse.json({ value: 42 })));
    const { result } = renderHook(() => useFetch("/api/data"));

    expect(result.current.loading).toBe(true); // initially loading / ban đầu đang tải

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual({ value: 42 });
    });
  });

  test("aborts fetch on unmount", async () => {
    server.use(
      http.get("/api/data", async () => {
        await new Promise((r) => setTimeout(r, 5000)); // slow response / phản hồi chậm
        return HttpResponse.json({});
      }),
    );
    const { unmount } = renderHook(() => useFetch("/api/data"));
    unmount(); // no setState after unmount = no warning / không cảnh báo
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

**F1: "How to test hooks that use useContext?"** → Pass a `wrapper` to renderHook: `renderHook(() => useAuth(), { wrapper: AuthProvider })`.

**F1: "Test hook dùng useContext thế nào?"** → Truyền `wrapper` cho renderHook: `renderHook(() => useAuth(), { wrapper: AuthProvider })`.

**F2: "Mock timer for retry logic?"** → `vi.useFakeTimers()`, trigger retry, `vi.advanceTimersByTime(1000)`, assert retry behavior.

**F2: "Mock timer cho logic thử lại?"** → `vi.useFakeTimers()`, kích hoạt thử lại, `vi.advanceTimersByTime(1000)`, kiểm tra hành vi thử lại.

---

## 📋 Q&A Summary Table / Bảng tóm tắt Q&A

| #   | Question / Câu hỏi        | Difficulty | Key Concept / Khái niệm chính     | Interview Signal                     |
| --- | ------------------------- | ---------- | --------------------------------- | ------------------------------------ |
| Q1  | getBy/queryBy/findBy      | 🟢         | Query variants / Loại query       | Basic RTL API                        |
| Q2  | userEvent vs fireEvent    | 🟢         | Testing realism / Mức thực tế     | Event simulation / Mô phỏng sự kiện  |
| Q3  | API mocking with MSW      | 🟡         | Network-level mocking / Mock mạng | Modern pattern / Mô hình hiện đại    |
| Q4  | Test custom hooks         | 🟡         | renderHook + act                  | Hook testing                         |
| Q5  | Coverage 100% target      | 🟡         | Coverage ≠ quality / ≠ chất lượng | Testing maturity / Trưởng thành test |
| Q6  | Checkout testing strategy | 🔴         | Testing trophy + levels / cấp độ  | System thinking / Tư duy hệ thống    |
| Q7  | Complex hook testing      | 🔴         | Async + abort + rerender          | Deep hook testing                    |

---

## ⚡ Cold Call Simulation / Mô phỏng phỏng vấn bất ngờ

> **"How do you approach testing React apps?" / "Bạn test React app thế nào?"**

🇬🇧 **30-second opener:** "I follow the testing trophy: TypeScript for static analysis, unit tests for pure business logic, integration tests with RTL + MSW for component flows — that's where I invest the most because it catches the most bugs at reasonable cost. E2E with Playwright only for critical user journeys like checkout and auth. I query by role and label instead of testId, use userEvent instead of fireEvent for realism, and target 80% coverage rather than chasing 100%."

🇻🇳 **Mở đầu 30 giây:** "Tôi theo testing trophy: TypeScript cho phân tích tĩnh, unit test cho logic thuần, integration test bằng RTL + MSW cho luồng component — đó là nơi tôi đầu tư nhiều nhất vì bắt nhiều lỗi nhất với chi phí hợp lý. E2E bằng Playwright chỉ cho hành trình user quan trọng. Tôi tìm phần tử bằng vai trò và nhãn thay vì testId, dùng userEvent thay vì fireEvent cho thực tế hơn, và mục tiêu 80% coverage chứ không đuổi theo 100%."

---

## 🧪 Self-Check / Tự kiểm tra

> Close this document. Answer from memory. / Đóng tài liệu lại. Trả lời từ trí nhớ.

### Retrieval / Nhớ lại

- [ ] What are the 3 RTL query types? When to use each? / 3 loại query RTL là gì? Khi nào dùng loại nào?
- [ ] What level does MSW mock at? Why better than jest.mock? / MSW mock ở tầng nào? Tại sao tốt hơn jest.mock?
- [ ] How is the testing trophy different from the testing pyramid? / Testing trophy khác testing pyramid ở đâu?

### Visual / Hình dung

- [ ] Draw the testing trophy with 4 levels / Vẽ testing trophy với 4 tầng
- [ ] Draw MSW intercept flow: component → fetch → MSW → fake response

### Application / Áp dụng

- [ ] Write a test for a login form: type email, password, submit, assert callback / Viết test cho form đăng nhập
- [ ] Setup MSW for 1 GET endpoint + test component renders data / Cài đặt MSW cho 1 endpoint + test component

### Debug / Gỡ lỗi

- [ ] Test is flaky — sometimes passes, sometimes fails. What to check? / Test không ổn định — kiểm tra gì?
- [ ] `getByText` throws error even though element is on screen. Cause? / `getByText` báo lỗi dù phần tử có trên màn hình. Nguyên nhân?

### Teach / Giảng lại

- [ ] Explain to a junior: why test behavior instead of implementation? / Giải thích: tại sao test hành vi thay vì cách viết bên trong?
- [ ] Explain: when to use unit test vs integration test? / Khi nào dùng unit test vs integration test?

### 🗣️ Feynman Prompt

> Explain to someone who doesn't know testing: "What does it mean to test a React app?" / Giải thích cho người chưa biết testing: "Test React app nghĩa là gì?"

### 🔁 Spaced Repetition / Lặp lại cách quãng

- Day 3: Write query priority from memory (8 types, most accessible first) / Viết thứ tự ưu tiên query từ trí nhớ
- Day 7: Test 1 real component with RTL + MSW / Test 1 component thực tế
- Day 14: Design testing strategy for a new feature / Thiết kế chiến lược test cho tính năng mới

---

## 🔗 Connections / Liên kết

| Concept / Khái niệm      | Related Topic / Chủ đề liên quan | File                           |
| ------------------------ | -------------------------------- | ------------------------------ |
| Component rendering      | React Fundamentals               | 01-react-fundamentals.md       |
| Custom hooks testing     | Hooks Deep Dive                  | 03-hooks-deep-dive.md          |
| State management mocking | State Management                 | 05-state-management.md         |
| Performance testing      | Performance Optimization         | 09-performance-optimization.md |
| Accessibility queries    | RTL query priority               | WCAG guidelines                |
