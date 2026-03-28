# Frontend Testing Strategy — L5 Approach / Chiến Lược Testing Frontend

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **L5 Competencies**: Technical Mastery (20pts), Quality & Risk (10pts)
> **Prerequisites**: [React Testing](../03-react/06-testing.md) | [Testing Theory](../../shared/05-software-engineering/04-testing-theory.md)
> **See also**: [Tools — Testing](../09-advanced-topics/tools-ecosystem/13-tools-ecosystem-04-testing-tools.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Shopee checkout team: 200+ components, 50+ pages, 15 developers. Họ viết tests nhưng vẫn có bugs trên production. Tại sao? Vì có 3000 unit tests chỉ test implementation details (mock everything), 0 integration tests, và 5 flaky E2E tests chạy 40 phút. Khi 1 senior engineer redesign testing strategy theo Testing Trophy, defect rate giảm 60% trong 3 tháng.

L5 không chỉ viết tests — mà **thiết kế testing strategy cho cả team**.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng:**
Testing giống hệ thống an ninh tòa nhà. Unit tests = khóa cửa (rẻ, nhanh, nhưng trộm vào qua cửa sổ thì vô dụng). Integration tests = camera an ninh (thấy nhiều hơn, nhưng tốn chi phí). E2E tests = bảo vệ đi tuần (toàn diện nhưng đắt và chậm). **Testing strategy = quyết định đặt bao nhiêu khóa, camera, bảo vệ ở đâu** để maximize coverage với budget có hạn.

**Tại sao phải học?**
- 40% câu hỏi phỏng vấn Senior FE liên quan đến testing approach
- Companies đánh giá L5 qua khả năng thiết kế testing strategy, không chỉ viết tests
- Testing bugs in production cost 10x more than catching in development

---

## Concept Map / Bản Đồ Khái Niệm

```
Testing Strategy
├── Testing Trophy (Kent C. Dodds)
│   ├── Static Analysis (ESLint, TypeScript)
│   ├── Unit Tests (pure logic, utilities)
│   ├── Integration Tests ★ (components + hooks + API)
│   └── E2E Tests (critical user flows)
├── What to Test
│   ├── User behavior (not implementation)
│   ├── Edge cases & error states
│   └── Accessibility
├── Tools
│   ├── Jest / Vitest (unit + integration)
│   ├── React Testing Library (component testing)
│   ├── Playwright / Cypress (E2E)
│   ├── MSW (API mocking)
│   └── Storybook (visual + interaction)
└── L5 Strategy
    ├── Coverage targets by risk
    ├── Test pyramid vs trophy decision
    ├── CI integration
    └── Monitoring tests in production
```

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. Testing Trophy vs Testing Pyramid

> 🧠 **Memory Hook**: "Trophy = Integration-heavy (real user behavior). Pyramid = Unit-heavy (fast but fragile)."

**Tại sao tồn tại?**
Testing Pyramid (Google, 2000s) nói 70% unit, 20% integration, 10% E2E. Nhưng frontend đã thay đổi — component-based architecture means unit tests that mock everything test nothing real.
→ Kent C. Dodds proposed Testing Trophy: emphasize integration tests that test components as users use them.

#### Layer 1: Simple Analogy
Pyramid = test từng viên gạch → khi xây nhà vẫn có thể sập vì cách xếp sai.
Trophy = test cả bức tường → biết gạch xếp đúng chưa.

#### Layer 2: How It Works

```
Testing Trophy (recommended for FE):

         /\
        /E2E\ ← Few, critical user flows only
       /______\
      /        \
     /Integration\ ★ ← MOST tests here
    /______________\
   /                \
  /    Unit Tests    \ ← Pure logic, utilities only
 /____________________\
/   Static Analysis    \ ← TypeScript + ESLint (free!)
/________________________\
```

| Layer | What to test | Tools | Speed | Confidence |
|-------|-------------|-------|-------|------------|
| Static | Type errors, lint rules | TypeScript, ESLint | Instant | Low |
| Unit | Pure functions, utilities, hooks (no DOM) | Jest/Vitest | <1ms/test | Medium |
| Integration | Components rendering + user interaction + state | RTL + MSW | 10-100ms/test | **High** |
| E2E | Critical user flows across pages | Playwright | 1-10s/test | Very High |

#### Layer 3: Edge Cases & Trade-offs

- **Unit tests become fragile** when they test implementation details (internal state, method calls)
- **Integration tests can be slow** if they mount too many components — scope to feature boundaries
- **E2E tests are expensive** — only for revenue-critical flows (checkout, auth, payment)
- **Snapshot tests** are controversial: low maintenance = high false positives. Use sparingly.

**❌ Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Mock everything in unit tests | Tests pass but components break when wired together | Use MSW for API mocking, render real components |
| Test implementation details | `expect(setState).toHaveBeenCalled()` breaks on refactor | Test behavior: `expect(screen.getByText('Success')).toBeInTheDocument()` |
| 100% code coverage target | Coverage ≠ confidence, creates low-value tests | Set coverage by risk: 90% for payment, 60% for admin pages |
| Flaky E2E tests left unfixed | Team loses trust in tests, starts ignoring failures | Fix or delete flaky tests immediately. 0 tolerance. |
| No tests for error states | Happy path works, error UX is broken | Test: loading, error, empty, permission denied states |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "testing strategy", "how do you test React components", "testing approach for team"
- → Nhớ đến: Testing Trophy, test behavior not implementation, MSW for API mocking
- → Mở đầu: *"I follow the Testing Trophy approach where integration tests are the primary focus. I test components the way users interact with them — querying by role and text, not by CSS selectors or internal state."*

**🔑 Knowledge Chain:**
- 📚 Cần biết trước: [React Fundamentals](../03-react/01-react-fundamentals.md), [Testing Theory](../../shared/05-software-engineering/04-testing-theory.md)
- ➡️ Để hiểu tiếp: [Frontend Quality & Observability](../08-fe-system-design/07-frontend-quality-and-observability.md)

---

### 2. React Testing Library — Testing the Right Way

> 🧠 **Memory Hook**: "RTL forces you to test like a user — if you can't find it without a test-id, the user can't find it either."

**Tại sao tồn tại?**
Enzyme (old React testing library) let you test internal component state and lifecycle methods — which broke on every refactor. RTL was created to enforce testing user-visible behavior.

#### Layer 1: Simple Analogy
Enzyme = mổ con vật ra xem nội tạng (invasive, con vật chết). RTL = quan sát con vật hành xử (non-invasive, con vật sống).

#### Layer 2: How It Works

```
RTL Query Priority (use in this order):

1. getByRole     ← Accessible, semantic (BEST)
2. getByLabelText ← Form elements
3. getByText     ← Non-interactive text
4. getByTestId   ← LAST RESORT only
```

**Testing pattern:**
```typescript
// ❌ BAD: Testing implementation
test('sets loading state', () => {
  const { result } = renderHook(() => useData());
  expect(result.current.isLoading).toBe(true);
});

// ✅ GOOD: Testing behavior
test('shows loading spinner then data', async () => {
  render(<UserProfile id="1" />);
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

#### Layer 3: Edge Cases & Trade-offs

- **MSW (Mock Service Worker)** for API mocking: intercepts at network level, not at module level → tests are more realistic
- **User events**: Use `@testing-library/user-event` (simulates real browser events) over `fireEvent` (synthetic)
- **Async testing**: Always use `waitFor` or `findBy*` for async operations — never `setTimeout`
- **Accessibility queries**: `getByRole` catches a11y issues for free

**❌ Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `getByTestId` everywhere | Doesn't test accessibility, bypasses real DOM structure | Use `getByRole`, `getByLabelText` first |
| Testing hook internals | Fragile, breaks on refactor | Test the component that uses the hook |
| `fireEvent.click()` | Doesn't simulate real user (no focus, hover, mousedown sequence) | `await userEvent.click()` |
| Not wrapping in `act()` | State updates outside act cause warnings and flaky tests | RTL auto-wraps, but custom renders need `act()` |

**🎯 Interview Pattern:**
- Khi thấy: "How do you test React components?"
- → Nhớ: RTL query priority, test behavior not state, MSW for APIs
- → Mở đầu: *"I use React Testing Library with its query priority — getByRole first for accessibility, getByText for content. I mock APIs with MSW at the network level, and I test what the user sees, not internal state."*

**🔑 Knowledge Chain:**
- 📚 Cần biết trước: [React Hooks](../03-react/03-hooks-deep-dive.md)
- ➡️ Để hiểu tiếp: [Advanced Testing Strategies](../09-advanced-topics/expert-topics/19-expert-topics-04-testing-strategies-advanced.md)

---

### 3. E2E Testing with Playwright

> 🧠 **Memory Hook**: "Playwright = real browser, real network, real user flow. Use for money-path only."

**Tại sao tồn tại?**
Integration tests mock the network. But some bugs only appear when real browser + real API + real navigation happen together. E2E tests catch these — but they're slow and expensive, so use strategically.

#### Layer 1: Simple Analogy
E2E = dress rehearsal trước buổi biểu diễn. Không thể dress rehearsal mỗi ngày (tốn thời gian), nhưng PHẢI chạy trước opening night.

#### Layer 2: How It Works

```
E2E Test Scope (L5 strategy):

ALWAYS E2E test:
  ✅ Authentication flow (login → session → logout)
  ✅ Payment/checkout (money path)
  ✅ Core user journey (sign up → first action → value moment)
  ✅ Critical data mutations (delete account, transfer money)

NEVER E2E test:
  ❌ Styling/layout (use visual regression)
  ❌ Form validation (integration test is enough)
  ❌ Individual component behavior (RTL handles this)
  ❌ Admin-only features (low user impact)
```

**Playwright advantages over Cypress:**
- Multi-browser (Chromium, Firefox, WebKit)
- Multi-tab and multi-origin support
- Network interception built-in
- Auto-wait (no explicit waits needed)
- Parallel execution by default

#### Layer 3: Edge Cases & Trade-offs

- **Flaky tests**: #1 enemy. Fix immediately or delete. Common causes: race conditions, hard-coded waits, shared state between tests.
- **Test isolation**: Each E2E test should create its own data (API seed), not depend on existing DB state.
- **CI time**: Run E2E in parallel, use Playwright's sharding. Target: full E2E suite < 10 minutes.
- **Visual regression**: Use Playwright screenshots + Percy/Chromatic for visual diffing — catches CSS bugs that functional tests miss.

**🔑 Knowledge Chain:**
- 📚 Cần biết trước: [Web Performance](../06-browser-performance/04-web-performance-comprehensive.md)
- ➡️ Để hiểu tiếp: [Frontend Quality & Observability](../08-fe-system-design/07-frontend-quality-and-observability.md)

---

## Q&A Section / Câu Hỏi Phỏng Vấn

### Q: How would you design a testing strategy for a large React application? / Bạn thiết kế testing strategy cho React app lớn thế nào? 🟢 Junior

**A:** Follow the Testing Trophy: Static analysis (TypeScript + ESLint) catches type errors for free. Integration tests with RTL + MSW cover most component behavior. Unit tests for pure utilities. E2E with Playwright for critical user flows only.

Target ratio: 20% unit, 60% integration, 15% E2E, 5% visual regression.

**💡 Interview Signal:**
- ✅ Strong: Mentions Testing Trophy, explains WHY integration-heavy, gives concrete ratio
- ❌ Weak: "I write unit tests for everything" or "We use Jest" (tool name without strategy)

---

### Q: When do you use unit tests vs integration tests vs E2E? / Khi nào dùng unit, integration, E2E? 🟡 Mid

**A:** Unit for pure logic without DOM (formatDate, calculatePrice, custom hooks with no side effects). Integration for components + user interaction + API calls (render component, click button, verify result). E2E for multi-page flows involving real authentication and navigation.

"The key question is: what am I gaining confidence in? If I'm testing that a button click shows a modal with data from an API — that's integration, not unit."

**💡 Interview Signal:**
- ✅ Strong: Explains the confidence gained at each level, gives clear boundary criteria
- ❌ Weak: Fuzzy boundaries, tests implementation in unit tests

---

### Q: How do you handle flaky tests? What's your approach to test reliability at scale? / Bạn xử lý flaky tests thế nào? 🔴 Senior

**A:** Zero-tolerance policy: flaky test gets fixed within 24h or gets quarantined (moved to a separate suite that doesn't block CI). Root causes are usually: shared state between tests, race conditions in async operations, hard-coded timeouts, or external service dependencies.

Prevention strategy: test isolation (each test creates/cleans its own data), deterministic mocking (MSW over real APIs in CI), auto-retry with logging (detect flaky patterns before they block the team), and a flaky test dashboard that tracks flake rate per test.

At my previous company, we reduced flake rate from 15% to <1% by: (1) replacing all `setTimeout` waits with `waitFor`, (2) isolating test data with factory functions, (3) running E2E in isolated containers with seeded databases.

**💡 Interview Signal:**
- ✅ Strong: Has systematic approach (quarantine + root cause + prevention), shares metrics
- ❌ Weak: "We just re-run the tests" or "Flaky tests are normal"

🔗 **Follow-up Chain:**
1. → "How do you measure the ROI of your testing investment? When is a test not worth maintaining?"
2. → "If you inherited a codebase with 5000 tests and 20% flake rate, what's your 30-day plan?"
3. → "Design a CI pipeline that balances test thoroughness with developer velocity — what tradeoffs would you make?"

---

## Interview Q&A Summary / Tổng Kết

| # | Question | Difficulty | Key Signal |
|---|----------|-----------|------------|
| 1 | Design testing strategy for large React app | 🟢 | Testing Trophy, ratio, WHY integration-heavy |
| 2 | Unit vs integration vs E2E boundaries | 🟡 | Confidence-based criteria, clear examples |
| 3 | Handling flaky tests at scale | 🔴 | Zero-tolerance, quarantine, prevention, metrics |

---

## ⚡ Cold Call Simulation

> 🎯 Interviewer asks: **"What's your testing philosophy for frontend applications?"**

**30 giây đầu — ideal opening:**
1. "I follow the Testing Trophy approach, where integration tests are the primary investment — they test real user behavior through RTL without mocking internal state."
2. "The key principle is test the way users use the software — query by role and text, not by CSS selectors."
3. "For API dependencies I use MSW at the network level, so tests are realistic but deterministic."
4. "E2E tests with Playwright are reserved for money-path flows — login, checkout, data mutations — where the cost of failure is highest."

---

## Self-Check / Tự Kiểm Tra

> **Đóng tài liệu lại trước khi làm.**

- [ ] **Retrieval**: Vẽ Testing Trophy từ trí nhớ — 4 layers + tỷ lệ recommended. So sánh.
- [ ] **Visual**: Viết RTL query priority (4 levels) từ trí nhớ. Tại sao `getByRole` đầu tiên?
- [ ] **Application**: Chọn 1 component trong project hiện tại — viết test plan (unit/integration/E2E) theo Testing Trophy. Bao nhiêu test mỗi level?
- [ ] **Debug**: Tìm 1 unit test trong project đang mock quá nhiều. Chuyển thành integration test với RTL.
- [ ] **Teach**: Giải thích sự khác biệt giữa Testing Pyramid và Testing Trophy cho junior — khi nào dùng cái nào?

💬 **Feynman Prompt:** Giải thích testing strategy cho manager không biết code: "Tại sao cần 3 loại test khác nhau? Không phải cứ test nhiều là tốt sao?"

🔁 **Spaced Repetition:** Ôn lại sau **3 ngày → 7 ngày → 14 ngày**.

---

## Connections / Liên Kết

- ⬅️ **Built on**: [React Testing](../03-react/06-testing.md), [Testing Theory](../../shared/05-software-engineering/04-testing-theory.md)
- ➡️ **Enables**: [Frontend Quality & Observability](../08-fe-system-design/07-frontend-quality-and-observability.md)
- 🔗 **Applied in**: Every production React application, CI/CD pipelines, team code quality processes

## Cross-Track / Liên Kết Chéo
- 🔗 BE perspective: [Go Testing & Profiling](../../be-track/01-golang/05-testing-profiling.md)
- 🔗 Shared theory: [Testing Theory](../../shared/05-software-engineering/04-testing-theory.md)
