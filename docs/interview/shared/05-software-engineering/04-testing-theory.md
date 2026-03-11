# Testing Theory — Lý thuyết Kiểm thử Phần mềm

> Shared theory for both Frontend and Backend tracks.
> Cross-references:
> - `docs/interview/shared/05-software-engineering/03-sdlc-and-practices.md`
> - `docs/interview/be-track/01-golang/05-testing-profiling.md`
> - `docs/interview/fe-track/03-react/06-testing.md`
> - `docs/interview/fe-track/09-advanced-topics/13-tools-ecosystem-02-testing.md`

---

## 0. Learning Goals — Mục tiêu học tập

Sau khi hoàn thành phần này, bạn cần:

1. **Hiểu tại sao testing quan trọng** — chi phí bug, testing như tài liệu sống, nền tảng để refactor an toàn.
2. **Nắm vững Test Pyramid** — tỷ lệ unit/integration/E2E, anti-patterns phổ biến, và biến thể Testing Trophy.
3. **Viết unit test tốt** — FIRST principles, Arrange-Act-Assert, boundary value analysis, equivalence partitioning.
4. **Phân biệt các loại test double** — Dummy, Stub, Spy, Mock, Fake — và biết khi nào dùng loại nào.
5. **Thiết kế integration test hiệu quả** — test boundaries, contract testing, database testing strategies.
6. **Hiểu E2E testing** — user journey testing, Page Object Model, xử lý flaky tests.
7. **Áp dụng TDD và BDD** — Red-Green-Refactor, Given-When-Then, khi nào phù hợp.
8. **Biết các kỹ thuật testing nâng cao** — property-based testing, mutation testing, coverage metrics.
9. **Xây dựng testing strategy** — risk-based testing, CI/CD pipeline integration, shift-left/shift-right.

---

## 1. Why Testing Matters — Vì sao testing quan trọng

### 🟢 Q: Why is software testing important? `[Junior]`

**A:** Testing quan trọng vì ba lý do cốt lõi:

**1. Cost of Bugs — Chi phí phát hiện bug muộn (Shift-left economics)**

| Phase Discovered | Relative Cost | Ví dụ |
|-----------------|---------------|-------|
| Requirements | 1x | Sửa spec trên giấy |
| Design | 5x | Sửa architecture document |
| Coding | 10x | Fix trong IDE trước commit |
| Testing / QA | 20x | Bug ticket, reproduce, fix, re-test |
| Production | 100x+ | Hotfix, data corruption, customer churn, reputation damage |

> "Shift-left" nghĩa là đưa testing về sớm nhất có thể trong development lifecycle. Bug phát hiện ở giai đoạn requirements rẻ hơn 100 lần so với production.

**2. Testing as Documentation — Test là tài liệu sống**

```
// Test mô tả chính xác behavior mong đợi
TEST "transfer money":
  GIVEN account A has balance 1000
  AND   account B has balance 500
  WHEN  transfer 200 from A to B
  THEN  account A balance should be 800
  AND   account B balance should be 700
```

Test tốt là dạng documentation **luôn chính xác** vì nếu code thay đổi mà test fail, dev buộc phải cập nhật test hoặc fix code. Khác với comments hay wiki có thể outdated.

**3. Confidence for Refactoring — Tự tin khi tái cấu trúc**

Không có test suite → sợ refactor → code rot → technical debt tích lũy → hệ thống trở nên fragile.

```
Without tests:   Change code → Hope nothing breaks → Ship → Pray
With tests:      Change code → Run tests → Green? Ship! Red? Fix before shipping.
```

### 🟡 Q: What is the relationship between testing and software quality? `[Mid]`

**A:** Testing không **tạo ra** quality — nó **đo lường và bảo vệ** quality.

- **Verification**: Code có đúng spec không? (Are we building the thing right?)
- **Validation**: Spec có đúng nhu cầu user không? (Are we building the right thing?)

Testing bao phủ cả hai:
- Unit/integration tests → verification (code behavior đúng)
- E2E/acceptance tests → validation (user journey hoạt động)

**Trade-off quan trọng:** Quá nhiều test cũng có chi phí — maintenance burden, slow CI, false confidence từ bad tests. Cần cân bằng giữa coverage và development velocity.

---

## 2. Test Pyramid — Kim tự tháp kiểm thử

### 🟢 Q: What is the Test Pyramid? `[Junior]`

**A:** Test Pyramid (Mike Cohn, 2009) là mô hình phân bổ số lượng test theo tầng:

```
          /\
         /  \        E2E Tests (~10%)
        / E2E\       Slow, expensive, high confidence
       /------\
      /        \     Integration Tests (~20%)
     /Integration\   Medium speed, test boundaries
    /--------------\
   /                \  Unit Tests (~70%)
  /    Unit Tests    \ Fast, cheap, isolated
 /____________________\
```

| Layer | Tỷ lệ | Speed | Cost | Scope | Confidence |
|-------|--------|-------|------|-------|------------|
| **Unit** | ~70% | Milliseconds | Rất thấp | Single function/class | Logic đúng |
| **Integration** | ~20% | Seconds | Trung bình | Multiple components + external | Tương tác đúng |
| **E2E** | ~10% | Minutes | Cao | Entire system | User flow đúng |

**Nguyên tắc:** Càng xuống đáy → càng nhiều test, càng nhanh, càng rẻ. Càng lên đỉnh → càng ít test, càng chậm, càng đắt.

### 🟡 Q: What are common anti-patterns of the Test Pyramid? `[Mid]`

**A:** Hai anti-pattern phổ biến:

**1. Ice Cream Cone (Hình nón kem) — Ngược pyramid**

```
   _______________
  |  Manual Tests  |    ← Rất nhiều manual testing
  |_______________|
  |   E2E Tests    |    ← Nhiều E2E
  |_______________|
  |  Integration   |    ← Ít integration
  |___|
  |Unit|              ← Rất ít unit tests
  |___|
```

**Vấn đề:** CI chậm, flaky tests nhiều, feedback loop dài, chi phí maintenance cao. Đội ngũ dành nhiều thời gian debug E2E hơn viết feature.

**2. Hourglass (Hình đồng hồ cát)**

```
   /____________\
  /  E2E Tests   \     ← Nhiều E2E
 /________________\
        ||              ← Rất ít integration
   /____________\
  /  Unit Tests  \     ← Nhiều unit
 /________________\
```

**Vấn đề:** Unit tests pass, E2E pass, nhưng integration bugs lọt qua vì thiếu test ở tầng giữa. Ví dụ: mỗi service đúng riêng, nhưng khi gọi nhau thì sai format.

### 🟡 Q: What is the Testing Trophy and how does it differ from the pyramid? `[Mid]`

**A:** Testing Trophy (Kent C. Dodds) là biến thể phổ biến trong frontend testing:

```
        ___
       | E2E |           ← Ít
       |_____|
      /       \
     /Integration\       ← NHIỀU NHẤT
    /_____________\
    |    Unit     |      ← Vừa phải
    |_____________|
    |   Static    |      ← ESLint, TypeScript
    |_____________|
```

| Aspect | Test Pyramid | Testing Trophy |
|--------|-------------|----------------|
| Emphasis | Unit tests nhiều nhất | Integration tests nhiều nhất |
| Philosophy | Test isolated units | Test user behavior |
| Static analysis | Không đề cập | Là tầng nền tảng |
| Best for | Backend, business logic nặng | Frontend, UI-driven apps |
| Coined by | Mike Cohn (2009) | Kent C. Dodds (2018) |

**Lý do Trophy ưu tiên integration:** Trong frontend, unit test một React component tách biệt ít phản ánh thực tế. Test component cùng children, state, và API calls (integration) cho confidence cao hơn.

**Trade-off:** Integration tests chậm hơn unit → cần balance. Backend với business logic phức tạp vẫn nên theo pyramid truyền thống.

---

## 3. Unit Testing — Kiểm thử đơn vị

### 🟢 Q: What is a unit test? `[Junior]`

**A:** Unit test kiểm tra **một đơn vị logic nhỏ nhất** (function, method, class) trong **isolation** — không phụ thuộc database, network, file system.

```
FUNCTION test_calculate_discount():
  // Arrange
  price = 100
  discount_rate = 0.2

  // Act
  result = calculate_discount(price, discount_rate)

  // Assert
  ASSERT result == 80
```

**Đặc điểm unit test tốt:** Chạy nhanh (< 100ms), không cần setup phức tạp, kết quả deterministic.

### 🟡 Q: What are the FIRST principles for good unit tests? `[Mid]`

**A:** FIRST là 5 đặc tính của unit test chất lượng:

| Principle | Meaning | Giải thích |
|-----------|---------|------------|
| **F** — Fast | Tests run quickly | Mỗi test < 100ms. Suite of 1000 tests chạy trong vài giây. Nếu chậm → dev skip running tests. |
| **I** — Isolated | Tests don't depend on each other | Test A fail không ảnh hưởng test B. Không shared state. Chạy bất kỳ thứ tự nào đều pass. |
| **R** — Repeatable | Same result every time | Không phụ thuộc datetime, random, network, file system. Chạy 1000 lần đều cùng kết quả. |
| **S** — Self-validating | Pass or fail, no manual check | Test tự assert, không cần dev đọc log để verify. Output là binary: green/red. |
| **T** — Timely | Written at the right time | Viết test cùng lúc (hoặc trước) production code. Test viết muộn thường bỏ sót edge cases. |

### 🟢 Q: What is the Arrange-Act-Assert pattern? `[Junior]`

**A:** AAA (hoặc Given-When-Then) là cấu trúc chuẩn cho mọi test:

```
FUNCTION test_user_registration():
  // ========== ARRANGE (Given) ==========
  // Setup preconditions and inputs
  email = "user@example.com"
  password = "SecureP@ss123"
  user_service = new UserService(mock_repository)

  // ========== ACT (When) ==========
  // Execute the behavior being tested
  result = user_service.register(email, password)

  // ========== ASSERT (Then) ==========
  // Verify the expected outcome
  ASSERT result.success == true
  ASSERT result.user.email == "user@example.com"
  ASSERT mock_repository.save_was_called_once()
```

**Best practices:**
- Mỗi test chỉ có **một Act** section (test one behavior)
- Arrange có thể dài → extract vào helper/factory nếu cần
- Assert nên kiểm tra **behavior**, không kiểm tra implementation detail

### 🟡 Q: What are good test naming conventions? `[Mid]`

**A:** Tên test phải mô tả rõ scenario mà không cần đọc code. Ba convention phổ biến:

**1. Given-When-Then style:**
```
test_givenInvalidEmail_whenRegister_thenReturnsValidationError
```

**2. Should style:**
```
test_register_shouldReturnError_whenEmailIsInvalid
```

**3. Method-Scenario-Expected style:**
```
test_calculateDiscount_withExpiredCoupon_returnsZero
```

| Convention | Ưu điểm | Nhược điểm |
|------------|---------|------------|
| Given-When-Then | Rõ context, action, result | Tên dài |
| Should | Đọc tự nhiên | Dễ vague ("should work") |
| Method-Scenario-Expected | Ngắn gọn, structured | Coupled to method name |

**Anti-pattern:** `test1`, `testAdd`, `testHappy` — không mô tả gì về behavior.

### 🟡 Q: How do you test pure functions vs functions with side effects? `[Mid]`

**A:**

**Pure functions** — dễ test nhất vì deterministic, không side effects:

```
// Pure function — same input always gives same output
FUNCTION add(a, b):
  RETURN a + b

TEST:
  ASSERT add(2, 3) == 5
  ASSERT add(-1, 1) == 0
  ASSERT add(0, 0) == 0
```

**Functions with side effects** — cần isolation qua test doubles:

```
// Function with side effects — writes to DB, calls API
FUNCTION create_order(cart, payment_gateway):
  total = calculate_total(cart.items)
  charge_result = payment_gateway.charge(cart.user, total)
  IF charge_result.success:
    RETURN Order(status="confirmed", total=total)
  ELSE:
    RETURN Order(status="failed")

TEST:
  // Arrange — stub the side effect
  mock_gateway = create_stub(charge: returns {success: true})
  cart = Cart(user="alice", items=[{price: 50}, {price: 30}])

  // Act
  order = create_order(cart, mock_gateway)

  // Assert
  ASSERT order.status == "confirmed"
  ASSERT order.total == 80
```

**Chiến lược:** Tách pure logic khỏi side effects. Đẩy side effects ra boundary (ports & adapters). Unit test phần pure, integration test phần side effects.

### 🟡 Q: What is Boundary Value Analysis (BVA)? `[Mid]`

**A:** BVA tập trung test tại **các giá trị biên** — nơi logic thường sai.

```
// Requirement: age must be 18-65 for insurance eligibility
FUNCTION is_eligible(age):
  RETURN age >= 18 AND age <= 65
```

Boundary values cần test:

| Category | Values | Expected |
|----------|--------|----------|
| Below minimum | 17 | false |
| At minimum | 18 | true |
| Just above minimum | 19 | true |
| Normal | 40 | true |
| Just below maximum | 64 | true |
| At maximum | 65 | true |
| Above maximum | 66 | false |
| Edge cases | 0, -1, MAX_INT | false |

**Tại sao BVA quan trọng:** Thống kê cho thấy phần lớn bugs xảy ra tại boundary. Off-by-one errors (`<` vs `<=`) là bug phổ biến nhất.

### 🟡 Q: What is Equivalence Partitioning? `[Mid]`

**A:** Chia input domain thành **các nhóm tương đương** (partitions) — mỗi nhóm chỉ cần test 1 đại diện.

```
// Password validation: length 8-20, must contain digit and uppercase
FUNCTION validate_password(password):
  // ...

Equivalence classes:
┌─────────────────────────────────────────────┐
│ Partition 1: Valid (8-20 chars, has digit & upper)  → "Passw0rd"   │
│ Partition 2: Too short (< 8 chars)                  → "Pa1"        │
│ Partition 3: Too long (> 20 chars)                  → "A1" * 15    │
│ Partition 4: Missing digit                          → "Password"   │
│ Partition 5: Missing uppercase                      → "passw0rd"   │
│ Partition 6: Empty string                           → ""           │
└─────────────────────────────────────────────┘
```

**Kết hợp BVA + EP:** Dùng EP để xác định partitions, dùng BVA để chọn values tại biên của mỗi partition. Giảm số test case từ hàng trăm xuống hàng chục mà vẫn cover hết logic.

---

## 4. Test Doubles — Các bản thay thế trong test

### 🟢 Q: What are test doubles? `[Junior]`

**A:** Test double là đối tượng thay thế dependency thật trong test, giúp isolate unit đang test. Thuật ngữ từ Gerard Meszaros (xUnit Patterns), lấy ý tưởng từ "stunt double" trong phim.

Có 5 loại chính:

| Type | Mục đích | Behavior | Ví dụ |
|------|---------|----------|-------|
| **Dummy** | Lấp chỗ trống parameter | Không bao giờ được gọi | `new NullLogger()` truyền vào constructor |
| **Stub** | Trả giá trị định sẵn | Trả response cố định khi được gọi | `userRepo.findById → returns User("Alice")` |
| **Spy** | Ghi nhận tương tác | Thực thi + ghi lại calls | `emailSpy.send(...)` → verify `send` called 1 time |
| **Mock** | Verify behavior | Có expectations, fail nếu sai | `mock.expect(send).with("hello").once()` |
| **Fake** | Implementation thật nhưng đơn giản | Hoạt động thật, dùng in-memory | In-memory database, local fake S3 |

### 🟡 Q: Explain each test double type with examples. `[Mid]`

**A:**

**1. Dummy — Placeholder, không bao giờ sử dụng**

```
FUNCTION test_create_report():
  // Logger is required by constructor but not used in this test
  dummy_logger = new NullLogger()
  service = new ReportService(real_calculator, dummy_logger)

  report = service.generate(data)
  ASSERT report.total == 150
  // dummy_logger is never called — just satisfies the type signature
```

**2. Stub — Trả giá trị định sẵn, kiểm soát indirect input**

```
FUNCTION test_get_user_profile():
  // Stub controls what the dependency returns
  stub_repo = create_stub()
  stub_repo.when_called("findById", 42).then_return(User(id=42, name="Alice"))

  service = new UserService(stub_repo)
  profile = service.getProfile(42)

  ASSERT profile.name == "Alice"
  // We don't care HOW MANY TIMES findById was called
```

**3. Spy — Ghi nhận tương tác, verify indirect output**

```
FUNCTION test_order_sends_confirmation_email():
  spy_mailer = create_spy(Mailer)
  service = new OrderService(spy_mailer)

  service.placeOrder(order)

  // Verify the interaction happened
  ASSERT spy_mailer.was_called("sendConfirmation")
  ASSERT spy_mailer.call_count("sendConfirmation") == 1
  ASSERT spy_mailer.last_call_args("sendConfirmation")[0] == order.email
```

**4. Mock — Expectations đặt trước, fail nếu không thỏa**

```
FUNCTION test_payment_processes_correctly():
  mock_gateway = create_mock(PaymentGateway)
  // Set expectations BEFORE the act
  mock_gateway.expect("charge").with(amount=100, currency="USD").once()
  mock_gateway.expect("charge").with(amount=0).never()

  service = new PaymentService(mock_gateway)
  service.processPayment(100, "USD")

  mock_gateway.verify()  // Fails if expectations not met
```

**5. Fake — Implementation thật nhưng đơn giản hóa**

```
CLASS FakeUserRepository:
  storage = {}  // In-memory dictionary instead of real DB

  FUNCTION save(user):
    storage[user.id] = user

  FUNCTION findById(id):
    RETURN storage.get(id, null)

  FUNCTION deleteAll():
    storage.clear()

FUNCTION test_user_crud():
  fake_repo = new FakeUserRepository()
  service = new UserService(fake_repo)

  service.createUser("Alice")
  user = service.getUser(1)
  ASSERT user.name == "Alice"
```

### 🟡 Q: When should you use each type of test double? `[Mid]`

**A:**

| Scenario | Recommended | Lý do |
|----------|-------------|-------|
| Parameter cần nhưng test không dùng | **Dummy** | Đơn giản nhất, không behavior |
| Kiểm soát input gián tiếp (DB trả gì) | **Stub** | Chỉ cần output, không verify calls |
| Verify method được gọi đúng | **Spy** | Ghi nhận nhưng không ép behavior |
| Verify đúng method, đúng args, đúng số lần | **Mock** | Strict expectations |
| Cần behavior gần thật, nhiều tests share | **Fake** | Reusable, realistic behavior |

### 🔴 Q: What is the over-mocking anti-pattern? `[Senior]`

**A:** Over-mocking xảy ra khi mock quá nhiều dependency → test trở nên **coupled với implementation** thay vì behavior.

**Triệu chứng:**
- Refactor code (không đổi behavior) → hàng chục test fail
- Test setup dài hơn test assertion
- Mock trả mock trả mock (mock chain)
- Test pass nhưng code production vẫn bug

```
// ❌ Over-mocked — test knows too much about internals
FUNCTION test_get_user():
  mock_connection = mock(Connection)
  mock_pool = mock(ConnectionPool)
  mock_pool.when("getConnection").return(mock_connection)
  mock_connection.when("query").return(raw_data)
  mock_mapper = mock(Mapper)
  mock_mapper.when("map").return(User("Alice"))

  repo = new UserRepository(mock_pool, mock_mapper)
  // 6 lines of setup for 1 line of actual test
  user = repo.findById(42)
  ASSERT user.name == "Alice"
```

```
// ✅ Better — use a Fake or test at a higher level
FUNCTION test_get_user():
  fake_db = new InMemoryDatabase()
  fake_db.insert("users", {id: 42, name: "Alice"})

  repo = new UserRepository(fake_db)
  user = repo.findById(42)
  ASSERT user.name == "Alice"
```

**Nguyên tắc:** Mock ở boundary, không mock collaborators nội bộ. Nếu phải mock 3+ levels → cần refactor production code (vi phạm SRP hoặc Law of Demeter).

---

## 5. Integration Testing — Kiểm thử tích hợp

### 🟢 Q: What is integration testing? `[Junior]`

**A:** Integration test kiểm tra **sự tương tác giữa các component** — khi unit tests pass riêng lẻ nhưng chưa đảm bảo khi kết hợp lại.

```
         Unit Test Scope          Integration Test Scope
         ┌──────────┐             ┌─────────────────────────┐
         │ Service A │             │ Service A ──→ Database  │
         └──────────┘             │ Service A ──→ API       │
         ┌──────────┐             │ Service A ──→ Service B │
         │ Service B │             └─────────────────────────┘
         └──────────┘
```

**Ví dụ kinh điển:** UserService unit test dùng stub repository → pass. Nhưng SQL query thật có typo column name → production fail. Integration test với real DB sẽ bắt bug này.

### 🟡 Q: What boundaries should integration tests cover? `[Mid]`

**A:** Integration test tập trung tại các **boundary** (ranh giới) nơi data chuyển đổi format:

| Boundary | What to Test | Ví dụ |
|----------|-------------|-------|
| **Database** | Queries, migrations, constraints | INSERT đúng column, FK constraint, index usage |
| **HTTP API** | Request/response format, status codes | POST /users trả 201, body đúng schema |
| **File System** | Read/write, permissions, encoding | CSV export, file upload processing |
| **Message Queue** | Publish/consume, serialization | Event serialized đúng, consumer parse được |
| **Cache** | Set/get, TTL, invalidation | Redis key format, expiry behavior |
| **External Service** | API contract, error handling | Third-party API trả 429, service handles gracefully |

### 🟡 Q: What are test containers and why are they useful? `[Mid]`

**A:** Test containers là pattern dùng **Docker containers** chạy dependencies thật (DB, Redis, Kafka) trong test.

```
// Pseudocode — test container lifecycle
FUNCTION setup_test_suite():
  postgres_container = start_container("postgres:15")
  redis_container = start_container("redis:7")
  connection_string = postgres_container.get_connection_url()
  RETURN TestConfig(db=connection_string, cache=redis_container.url)

FUNCTION teardown_test_suite():
  postgres_container.stop()
  redis_container.stop()

FUNCTION test_user_repository():
  config = setup_test_suite()
  repo = new UserRepository(config.db)

  repo.save(User(name="Alice"))
  user = repo.findByName("Alice")

  ASSERT user != null
  ASSERT user.name == "Alice"
  teardown_test_suite()
```

**Ưu điểm:**
- Test chạy với engine thật (PostgreSQL, không phải SQLite mock)
- Phát hiện bugs liên quan SQL dialect, constraints, indexes
- Reproducible: mỗi test run = clean database

**Nhược điểm:**
- Chậm hơn in-memory fakes (startup container ~2-5s)
- Cần Docker trên CI machine
- Resource-intensive khi chạy parallel

### 🔴 Q: What is contract testing and how does it work? `[Senior]`

**A:** Contract testing verify rằng **consumer và provider** đồng ý trên API contract mà không cần chạy cả hai cùng lúc.

```
// Consumer-Driven Contract Testing (Pact pattern)

// Step 1: Consumer defines expectations
CONSUMER_TEST "UserService expects from AuthAPI":
  expectation = {
    method: "GET",
    path: "/api/users/42",
    response: {
      status: 200,
      body: {id: 42, name: string, email: string}
    }
  }
  // Pact generates a CONTRACT file from this

// Step 2: Contract file shared (via Pact Broker or git)
// CONTRACT: "UserService expects GET /api/users/42 returns {id, name, email}"

// Step 3: Provider verifies contract
PROVIDER_TEST "AuthAPI fulfills UserService contract":
  load_contract("UserService")
  FOR each interaction in contract:
    replay_request(interaction.request)
    ASSERT response matches interaction.response.schema
```

**Khi nào dùng contract testing:**
- Microservices nhiều team develop độc lập
- Provider thay đổi API nhưng consumer chưa biết
- E2E test quá chậm và flaky cho cross-service testing

**So sánh:**

| Approach | Speed | Scope | Independence |
|----------|-------|-------|-------------|
| E2E test | Chậm | Toàn hệ thống | Cần tất cả services chạy |
| Integration test (stub) | Nhanh | Một service | Stub có thể sai lệch |
| Contract test | Nhanh | API boundary | Mỗi team test riêng, contract là source of truth |

### 🟡 Q: What are database testing strategies? `[Mid]`

**A:** Ba strategy phổ biến:

**1. Transaction Rollback — Mỗi test chạy trong transaction, rollback cuối**

```
FUNCTION test_with_rollback():
  BEGIN TRANSACTION
    insert_test_data()
    result = repository.query(...)
    ASSERT result == expected
  ROLLBACK  // Database trở về trạng thái ban đầu
```

Ưu điểm: Nhanh, clean. Nhược điểm: Không test commit behavior, transaction isolation.

**2. Seeding + Truncate — Seed data trước, truncate sau**

```
FUNCTION before_each():
  truncate_all_tables()
  seed_base_data()  // INSERT known test data

FUNCTION test_query():
  result = repository.find_active_users()
  ASSERT result.count == 3  // Based on seeded data
```

Ưu điểm: Test với committed data. Nhược điểm: Chậm hơn rollback.

**3. Database per Test / Container — Mỗi test suite = fresh database**

Ưu điểm: Hoàn toàn isolated. Nhược điểm: Chậm nhất, resource-heavy.

| Strategy | Speed | Isolation | Realism |
|----------|-------|-----------|---------|
| Transaction rollback | Nhanh nhất | Tốt | Trung bình (skip commit) |
| Seed + truncate | Trung bình | Tốt | Cao |
| Container per suite | Chậm | Tuyệt đối | Cao nhất |

---

## 6. End-to-End Testing — Kiểm thử đầu-cuối

### 🟢 Q: What is end-to-end testing? `[Junior]`

**A:** E2E test kiểm tra **toàn bộ hệ thống** từ góc nhìn user — browser/client → API → database → response.

```
// E2E test simulates real user behavior
TEST "User can login and view dashboard":
  OPEN browser at "/login"
  FILL "email" field with "alice@example.com"
  FILL "password" field with "secret123"
  CLICK "Login" button
  WAIT for page "/dashboard" to load

  ASSERT page title contains "Welcome, Alice"
  ASSERT sidebar shows 5 menu items
  ASSERT recent activity list is not empty
```

**E2E test = test user journey**, không phải test từng API endpoint hay component riêng lẻ.

### 🟡 Q: What tools are used for E2E testing? `[Mid]`

**A:** Landscape các tools phổ biến:

| Tool | Architecture | Language | Key Feature |
|------|-------------|----------|-------------|
| **Cypress** | Runs inside browser | JavaScript | Time-travel debugging, auto-wait |
| **Playwright** | Controls browser via CDP/WebSocket | JS/TS/Python/C# | Multi-browser, auto-wait, codegen |
| **Selenium** | WebDriver protocol | Java/Python/JS/... | Mature ecosystem, many languages |
| **Puppeteer** | Chrome DevTools Protocol | JavaScript | Chrome-focused, lightweight |

**So sánh key factors:**

| Factor | Cypress | Playwright | Selenium |
|--------|---------|-----------|----------|
| Multi-browser | Limited | Chromium, Firefox, WebKit | All major browsers |
| Speed | Nhanh | Rất nhanh | Trung bình |
| Parallel | Paid (Dashboard) | Built-in | Cần Selenium Grid |
| Auto-wait | Có | Có | Không (manual waits) |
| Learning curve | Dễ | Trung bình | Khó |

### 🔴 Q: How do you handle flaky tests? `[Senior]`

**A:** Flaky test = test lúc pass lúc fail với cùng code. Là vấn đề nghiêm trọng vì giảm trust vào test suite.

**Nguyên nhân phổ biến:**

| Cause | Ví dụ | Fix |
|-------|-------|-----|
| **Race conditions** | Element chưa render xong | Auto-wait, explicit wait for element |
| **Time dependency** | Test dùng `new Date()` | Inject clock, freeze time |
| **Shared state** | Test A tạo data, test B assume clean DB | Isolate data per test |
| **Network latency** | API response chậm hơn timeout | Retry logic, increase timeout, mock external |
| **Order dependency** | Test B pass chỉ khi test A chạy trước | Mỗi test tự setup data riêng |
| **Animation/transition** | Click vào element đang animate | Disable animations in test mode |

**Chiến lược xử lý:**

```
// 1. Quarantine: tách flaky tests ra suite riêng
test_suites:
  stable:     // Chạy mỗi commit, block merge nếu fail
    - unit/*
    - integration/*
  quarantine: // Chạy nhưng không block, team fix dần
    - e2e/flaky_checkout_test
    - e2e/flaky_search_test

// 2. Retry with limit (temporary measure, not solution)
run_test(test, max_retries=2):
  FOR attempt in 1..max_retries:
    result = execute(test)
    IF result.passed: RETURN PASS
  RETURN FAIL  // Fail after all retries → truly broken

// 3. Track flaky rate
flaky_dashboard:
  - Test name: checkout_flow
  - Flaky rate: 12% (last 100 runs)
  - Last flaky: 2 hours ago
  - Assigned to: @alice
```

### 🟡 Q: What is the Page Object Model pattern? `[Mid]`

**A:** Page Object Model (POM) encapsulate UI structure vào class, tách **what to do** khỏi **how to do it**.

```
// ❌ Without POM — fragile, duplicated selectors
TEST "login flow":
  click("#nav-login-btn")
  fill("input[name='email']", "alice@test.com")
  fill("input[name='password']", "secret")
  click("button[type='submit']")
  wait_for(".dashboard-header")

// ✅ With POM — readable, maintainable
CLASS LoginPage:
  FUNCTION navigate():
    go_to("/login")

  FUNCTION login(email, password):
    fill(email_input, email)
    fill(password_input, password)
    click(submit_button)
    RETURN DashboardPage()

CLASS DashboardPage:
  FUNCTION is_loaded():
    RETURN element_visible(header)

  FUNCTION get_welcome_message():
    RETURN get_text(welcome_label)

TEST "login flow":
  dashboard = LoginPage().navigate().login("alice@test.com", "secret")
  ASSERT dashboard.is_loaded()
  ASSERT dashboard.get_welcome_message() contains "Alice"
```

**Lợi ích:**
- UI selector thay đổi → sửa 1 chỗ (Page Object), không phải sửa 50 tests
- Test đọc như user story, không cần biết HTML structure
- Reusable: nhiều tests share cùng Page Objects

### 🟡 Q: What is visual regression testing? `[Mid]`

**A:** Visual regression testing chụp screenshot UI và **so sánh pixel-by-pixel** với baseline.

```
// Visual regression workflow
FUNCTION test_homepage_visual():
  navigate_to("/homepage")
  screenshot = capture_screenshot()

  IF baseline_exists("homepage"):
    diff = compare_images(baseline["homepage"], screenshot)
    IF diff.percentage > threshold (e.g., 0.1%):
      FAIL "Visual regression detected"
      save_diff_image(diff)
  ELSE:
    save_as_baseline("homepage", screenshot)
```

**Khi nào dùng:**
- CSS refactoring (đổi từ CSS Modules → Tailwind)
- Component library updates
- Cross-browser rendering consistency
- Design system compliance

**Khi không nên dùng:** Dynamic content (timestamps, avatars), animation-heavy pages.

### 🔴 Q: When is E2E testing overkill? `[Senior]`

**A:** E2E overkill khi:

| Scenario | Why E2E is Overkill | Better Alternative |
|----------|--------------------|--------------------|
| Pure business logic (calculate tax) | Không cần browser | Unit test |
| API response format | Không cần full stack | Contract test / API integration test |
| Component rendering | Không cần real backend | Component test (Testing Library) |
| Database query correctness | Không cần UI | Repository integration test |
| Every edge case of a form | Quá nhiều combinations | Unit test validation + 1 happy path E2E |

**Nguyên tắc:** E2E test cho **critical user journeys** (login, checkout, payment). Tất cả logic chi tiết → unit + integration. Aim for 5-15 E2E tests cho một app trung bình, không phải 500.

---

## 7. TDD — Phát triển hướng kiểm thử

### 🟢 Q: What is TDD? `[Junior]`

**A:** Test-Driven Development (Kent Beck) là kỹ thuật viết **test trước code** theo chu kỳ Red-Green-Refactor.

```
┌──────────────────────────────────────────────┐
│                                              │
│   ┌─────┐     ┌─────┐     ┌──────────┐     │
│   │ RED │────→│GREEN│────→│ REFACTOR │──┐   │
│   └─────┘     └─────┘     └──────────┘  │   │
│      ↑                                   │   │
│      └───────────────────────────────────┘   │
│                                              │
└──────────────────────────────────────────────┘

RED:      Write a failing test (test mô tả behavior mong muốn)
GREEN:    Write MINIMUM code to make it pass (không optimize)
REFACTOR: Improve design, remove duplication, keep tests green
```

### 🟡 Q: Walk through a TDD example. `[Mid]`

**A:** Ví dụ: implement `FizzBuzz(n)` — trả "Fizz" nếu chia hết 3, "Buzz" nếu chia hết 5, "FizzBuzz" nếu chia hết cả hai.

```
// === Iteration 1: RED ===
TEST "returns '1' for input 1":
  ASSERT FizzBuzz(1) == "1"
// → FAIL: FizzBuzz chưa tồn tại

// === Iteration 1: GREEN ===
FUNCTION FizzBuzz(n):
  RETURN str(n)
// → PASS

// === Iteration 2: RED ===
TEST "returns 'Fizz' for input 3":
  ASSERT FizzBuzz(3) == "Fizz"
// → FAIL: returns "3"

// === Iteration 2: GREEN ===
FUNCTION FizzBuzz(n):
  IF n % 3 == 0: RETURN "Fizz"
  RETURN str(n)
// → PASS

// === Iteration 3: RED ===
TEST "returns 'Buzz' for input 5":
  ASSERT FizzBuzz(5) == "Buzz"
// → FAIL: returns "5"

// === Iteration 3: GREEN ===
FUNCTION FizzBuzz(n):
  IF n % 3 == 0: RETURN "Fizz"
  IF n % 5 == 0: RETURN "Buzz"
  RETURN str(n)
// → PASS

// === Iteration 4: RED ===
TEST "returns 'FizzBuzz' for input 15":
  ASSERT FizzBuzz(15) == "FizzBuzz"
// → FAIL: returns "Fizz" (matches % 3 first)

// === Iteration 4: GREEN ===
FUNCTION FizzBuzz(n):
  IF n % 15 == 0: RETURN "FizzBuzz"
  IF n % 3 == 0: RETURN "Fizz"
  IF n % 5 == 0: RETURN "Buzz"
  RETURN str(n)
// → ALL PASS

// === Iteration 4: REFACTOR ===
FUNCTION FizzBuzz(n):
  result = ""
  IF n % 3 == 0: result += "Fizz"
  IF n % 5 == 0: result += "Buzz"
  RETURN result IF result != "" ELSE str(n)
// → ALL PASS, cleaner design
```

### 🟡 Q: What are the benefits of TDD? `[Mid]`

**A:**

| Benefit | Giải thích |
|---------|------------|
| **Design pressure** | Viết test trước buộc bạn nghĩ về interface trước implementation. Code TDD thường loosely coupled hơn. |
| **Living documentation** | Test suite mô tả mọi behavior. New team member đọc tests hiểu spec nhanh. |
| **Regression safety** | Mỗi feature có test từ đầu → refactor an toàn, merge confident. |
| **Small increments** | Red-Green-Refactor buộc làm từng bước nhỏ → dễ debug, ít overwhelm. |
| **100% coverage by design** | Mọi line of production code tồn tại vì có test yêu cầu → không viết code thừa. |

### 🔴 Q: When does TDD work well vs when doesn't it? `[Senior]`

**A:**

**TDD hoạt động tốt khi:**
- Business logic rõ ràng, input/output xác định (calculator, parser, validator)
- API design ổn định — contract không thay đổi liên tục
- Code có nhiều edge cases — TDD buộc bạn nghĩ từng case
- Legacy code refactoring — viết characterization tests trước, sau đó refactor

**TDD không phù hợp khi:**
- Prototyping / spike — chưa biết solution hình thù gì, viết test cho gì?
- UI layout — pixel position khó assert, thay đổi liên tục
- Exploratory research — đang thử ML model, algorithm mới
- Highly coupled legacy — không thể isolate units, cần refactor trước khi TDD

**TDD vs Test-After:**

| Aspect | TDD (Test-First) | Test-After |
|--------|-------------------|------------|
| Design impact | Drives better design | Retrofits tests on existing design |
| Coverage | High by nature | Varies — easy to skip edge cases |
| Speed (short term) | Slower | Faster |
| Speed (long term) | Faster (fewer bugs) | Slower (more debugging) |
| Discipline required | High | Low |
| Adoption difficulty | Hard habit to build | Familiar to most devs |

### 🟡 Q: What are common misconceptions about TDD? `[Mid]`

**A:**

| Misconception | Reality |
|--------------|---------|
| "TDD means 100% coverage" | TDD means test everything that could break. Not trivial getters/setters. |
| "TDD is slow" | Short-term slower, long-term faster due to fewer bugs and easier refactoring. |
| "TDD replaces design" | TDD informs design, doesn't replace upfront thinking about architecture. |
| "TDD = unit tests only" | You can TDD at any level: unit, integration, acceptance (ATDD). |
| "If tests pass, code is correct" | Tests only verify what you thought to test. Missing test = missing spec. |
| "TDD works for everything" | Some domains (UI, ML, prototypes) benefit less from strict TDD. |

---

## 8. BDD — Phát triển hướng hành vi

### 🟢 Q: What is BDD? `[Junior]`

**A:** Behavior-Driven Development (Dan North, 2003) mở rộng TDD bằng cách viết test theo **ngôn ngữ business** mà PM, QA, Dev đều hiểu.

**Core idea:** Thay vì test method names kỹ thuật, BDD describe behavior bằng Given-When-Then.

```
// TDD style — technical
test_apply_discount_with_valid_coupon_returns_reduced_price()

// BDD style — business language
Feature: Apply discount
  Scenario: Valid coupon reduces price by 10%
    Given a shopping cart with total $100
    And a valid coupon "SAVE10" for 10% off
    When the customer applies the coupon
    Then the total should be $90
    And the coupon should be marked as used
```

### 🟡 Q: What is Gherkin syntax? `[Mid]`

**A:** Gherkin là ngôn ngữ structured cho BDD specifications. Các keyword chính:

| Keyword | Purpose | Ví dụ |
|---------|---------|-------|
| `Feature` | Mô tả feature | `Feature: User Registration` |
| `Scenario` | Một use case cụ thể | `Scenario: Register with valid email` |
| `Given` | Precondition (context) | `Given user is on registration page` |
| `When` | Action (trigger) | `When user submits the form` |
| `Then` | Expected outcome | `Then account should be created` |
| `And` / `But` | Additional steps | `And welcome email should be sent` |
| `Scenario Outline` | Data-driven scenario | Template with `<variable>` |
| `Examples` | Data table for outline | Table of test data |

```
Feature: Money Transfer
  As a bank customer
  I want to transfer money between accounts
  So that I can manage my finances

  Scenario Outline: Successful transfer
    Given account "<from>" has balance <initial_from>
    And account "<to>" has balance <initial_to>
    When I transfer <amount> from "<from>" to "<to>"
    Then account "<from>" balance should be <final_from>
    And account "<to>" balance should be <final_to>

    Examples:
      | from    | to      | initial_from | initial_to | amount | final_from | final_to |
      | Alice   | Bob     | 1000         | 500        | 200    | 800        | 700      |
      | Charlie | Diana   | 5000         | 0          | 5000   | 0          | 5000     |

  Scenario: Insufficient funds
    Given account "Alice" has balance 100
    When I transfer 200 from "Alice" to "Bob"
    Then the transfer should be declined
    And account "Alice" balance should remain 100
```

### 🟡 Q: What is the concept of Living Documentation in BDD? `[Mid]`

**A:** Living documentation = specs viết bằng Gherkin **vừa là tài liệu vừa là test chạy được**.

```
Traditional documentation:
  Wiki / Confluence → Outdated within weeks → Nobody trusts it

Living documentation (BDD):
  Gherkin specs → Automated tests → Always verified against code
  → If behavior changes, spec must update or test fails
  → Documentation is ALWAYS accurate
```

**Workflow:**
1. PM/QA viết Gherkin scenario (business language)
2. Dev implement step definitions (glue code)
3. CI chạy scenarios mỗi commit
4. Scenario fail = spec bị vi phạm = bug hoặc spec cần update
5. Report generated: "85/90 scenarios passing" = 85 documented behaviors working

### 🟡 Q: How do BDD and TDD relate? `[Mid]`

**A:** BDD và TDD **bổ sung nhau**, không cạnh tranh:

```
BDD (outer loop):                    TDD (inner loop):
┌──────────────────────┐            ┌────────────────────┐
│ Write failing         │            │ Write failing       │
│ acceptance scenario   │──────→     │ unit test           │
│ (Given-When-Then)     │            │ (Red)               │
└──────────────────────┘            └────────────────────┘
                                           │
                                           ↓
                                    ┌────────────────────┐
                                    │ Make unit test pass │
                                    │ (Green)             │
                                    └────────────────────┘
                                           │
                                           ↓
                                    ┌────────────────────┐
                                    │ Refactor             │
                                    └────────────────────┘
                                           │
                                    Repeat until acceptance
                                    scenario passes
```

| Aspect | TDD | BDD |
|--------|-----|-----|
| Audience | Developers | Dev + QA + PM + Stakeholders |
| Language | Technical (test method names) | Business (Given-When-Then) |
| Scope | Unit / class | Feature / behavior |
| Focus | Code correctness | Business value delivery |
| Drives | Code design | Shared understanding |

### 🟡 Q: What is Specification by Example? `[Mid]`

**A:** Specification by Example (Gojko Adzic) = dùng concrete examples thay vì abstract requirements.

```
// ❌ Abstract requirement
"The system shall apply appropriate discounts based on customer status"
// → Ambiguous: what discount? what statuses? what's "appropriate"?

// ✅ Specification by Example
Given customer has "Gold" status
And cart total is $200
When checkout is processed
Then discount should be $20 (10%)

Given customer has "Silver" status
And cart total is $200
When checkout is processed
Then discount should be $10 (5%)

Given customer has "Regular" status
And cart total is $200
When checkout is processed
Then no discount should be applied
```

**Lợi ích:** Loại bỏ ambiguity, PM và Dev hiểu cùng spec, examples trở thành automated tests.

---

## 9. Property-Based Testing — Kiểm thử dựa trên thuộc tính

### 🟡 Q: What is property-based testing? `[Mid]`

**A:** Thay vì viết từng test case cụ thể (example-based), property-based testing **generate hàng trăm/ngàn input ngẫu nhiên** rồi verify rằng **properties (tính chất)** luôn đúng.

```
// Example-based (traditional):
TEST: sort([3,1,2]) == [1,2,3]
TEST: sort([5,5,5]) == [5,5,5]
TEST: sort([])      == []

// Property-based:
FOR random_list in generate(list_of_integers, count=1000):
  result = sort(random_list)
  // Property 1: output length == input length
  ASSERT length(result) == length(random_list)
  // Property 2: output is ordered
  FOR i in 0..length(result)-2:
    ASSERT result[i] <= result[i+1]
  // Property 3: output is a permutation of input
  ASSERT sorted_elements(result) == sorted_elements(random_list)
```

**Key insight:** Bạn không specify **kết quả cụ thể**, mà specify **tính chất** kết quả phải thỏa mãn. Framework tự tìm input vi phạm property.

### 🟡 Q: What are common properties to test? `[Mid]`

**A:**

| Property | Mô tả | Ví dụ |
|----------|--------|-------|
| **Idempotency** | Áp dụng nhiều lần = áp dụng 1 lần | `abs(abs(x)) == abs(x)` |
| **Commutativity** | Thứ tự input không ảnh hưởng | `add(a, b) == add(b, a)` |
| **Associativity** | Nhóm input không ảnh hưởng | `concat(concat(a,b), c) == concat(a, concat(b,c))` |
| **Round-trip / Inverse** | Encode rồi decode = original | `decode(encode(x)) == x` |
| **Invariant** | Tính chất luôn đúng trước và sau | `sort(list).length == list.length` |
| **Oracle** | So sánh với implementation đơn giản hơn | `fast_sort(x) == naive_sort(x)` |
| **Hard to compute, easy to verify** | Verify kết quả dễ hơn tính | `is_sorted(sort(x))` |

```
// Round-trip example: JSON serialize/deserialize
FOR random_object in generate(nested_objects, count=500):
  json_string = to_json(random_object)
  restored = from_json(json_string)
  ASSERT restored == random_object
  // Nếu fail → bug trong serializer hoặc deserializer
```

### 🔴 Q: What is shrinking in property-based testing? `[Senior]`

**A:** Khi framework tìm được input gây fail, **shrinking** tự động giảm input về **minimal failing case** — dễ debug hơn.

```
// Framework generates: [847, -23, 91, 0, 445, -7, 12, 0, 33]
// Property fails!

// Shrinking process:
// Try: [847, -23, 91, 0, 445]     → still fails
// Try: [-23, 91, 0]                → still fails
// Try: [-23, 0]                    → still fails
// Try: [0]                         → passes
// Try: [-23]                       → still fails
// Try: [-1]                        → still fails
// Try: [0]                         → passes (already tried)

// Minimal failing case: [-1]
// → Bug: function doesn't handle negative numbers!
```

**Shrinking strategies:**
- Integers: giảm dần về 0
- Strings: giảm length, simplify characters
- Lists: bỏ elements, shrink remaining elements
- Compound types: shrink từng field

**Giá trị:** Thay vì nhận bug report "fails with [847, -23, 91, 0, 445, -7, 12, 0, 33]", bạn nhận "fails with [-1]" — debug ngay lập tức.

### 🟡 Q: When to use property-based vs example-based testing? `[Mid]`

**A:**

| Use Property-Based When | Use Example-Based When |
|------------------------|----------------------|
| Input domain rộng (numbers, strings) | Business rules cụ thể với expected outputs |
| Có properties rõ ràng (sort, encode/decode) | Happy path + known edge cases |
| Muốn tìm unexpected edge cases | Test documentation purpose |
| Serialization / parsing code | UI behavior testing |
| Mathematical / algorithmic functions | Integration with external systems |

**Best practice:** Kết hợp cả hai. Example-based cho readable documentation + known edge cases. Property-based cho comprehensive coverage + tìm bugs bạn không nghĩ tới.

### 🔴 Q: What is QuickCheck and its significance? `[Senior]`

**A:** QuickCheck (Koen Claessen & John Hughes, 1999) là framework property-based testing đầu tiên, viết bằng Haskell. Đặt nền tảng cho mọi framework PBT sau này.

**Ý tưởng core:**
1. Dev khai báo **generator** cho random data
2. Dev khai báo **property** (boolean function)
3. QuickCheck tự generate inputs, chạy property, shrink khi fail

**Implementations nổi tiếng:**

| Language | Library |
|----------|---------|
| Haskell | QuickCheck (original) |
| Python | Hypothesis |
| JavaScript | fast-check |
| Java | jqwik |
| Go | gopter, rapid |
| Rust | proptest |
| Scala | ScalaCheck |

---

## 10. Mutation Testing — Kiểm thử đột biến

### 🟡 Q: What is mutation testing? `[Mid]`

**A:** Mutation testing **đo chất lượng test suite** bằng cách inject bugs nhỏ (mutations) vào source code rồi kiểm tra xem test suite có catch được không.

```
// Original code
FUNCTION is_adult(age):
  RETURN age >= 18

// Mutant 1: change >= to >
FUNCTION is_adult(age):
  RETURN age > 18    // ← mutant

// Mutant 2: change 18 to 17
FUNCTION is_adult(age):
  RETURN age >= 17   // ← mutant

// Mutant 3: change >= to ==
FUNCTION is_adult(age):
  RETURN age == 18   // ← mutant

// Run test suite against each mutant:
// Mutant 1: test with age=18 catches it? If yes → KILLED ✓
// Mutant 2: test with age=17 catches it? If yes → KILLED ✓
// Mutant 3: test with age=19 catches it? If yes → KILLED ✓
```

**Mutation Score = Killed Mutants / Total Mutants**

```
Total mutants: 3
Killed: 3
Survived: 0
Mutation Score: 3/3 = 100%  → Test suite phát hiện mọi mutation
```

### 🟡 Q: What are common mutation operators? `[Mid]`

**A:**

| Category | Operator | Original | Mutant |
|----------|----------|----------|--------|
| **Relational** | Change comparator | `a >= b` | `a > b`, `a <= b`, `a == b` |
| **Arithmetic** | Change operator | `a + b` | `a - b`, `a * b` |
| **Logical** | Change connector | `a && b` | `a \|\| b` |
| **Conditional** | Negate condition | `if (x)` | `if (!x)` |
| **Removal** | Remove statement | `validate(input)` | (removed) |
| **Return value** | Change return | `return true` | `return false` |
| **Constant** | Change value | `timeout = 30` | `timeout = 0`, `timeout = 31` |
| **Void method** | Remove call | `logger.log(msg)` | (removed) |

### 🔴 Q: What is the equivalent mutant problem? `[Senior]`

**A:** Equivalent mutant = mutant tạo ra code **behavior giống hệt** original → không thể bị killed bởi bất kỳ test nào.

```
// Original
FUNCTION max(a, b):
  IF a >= b:
    RETURN a
  RETURN b

// Equivalent mutant — same behavior!
FUNCTION max(a, b):
  IF a > b:       // Changed >= to >
    RETURN a
  RETURN b        // When a == b, still returns b (same value as a)
```

**Vấn đề:** Equivalent mutants làm mutation score thấp hơn thực tế. Phát hiện equivalent mutant là **undecidable problem** (chứng minh toán học).

**Giải pháp thực tế:**
- Heuristics để filter likely-equivalent mutants
- Time-bound mutation testing (timeout các mutants chạy quá lâu)
- Chấp nhận mutation score ~85% thay vì cố đạt 100%

### 🟡 Q: What is the value of mutation testing beyond code coverage? `[Mid]`

**A:** Code coverage chỉ đo **lines executed**, không đo **assertions quality**.

```
// Code coverage = 100% nhưng test vô dụng
FUNCTION test_calculate_tax():
  result = calculate_tax(100, 0.1)
  // No assertion! Just executing the function
  // Line coverage: 100%. Mutation score: 0%.
```

| Metric | What it Measures | Limitation |
|--------|-----------------|------------|
| Line coverage | % lines executed by tests | Không biết assertions có đúng không |
| Branch coverage | % branches executed | Vẫn có thể thiếu assertions |
| Mutation score | % faults detected by tests | Đo chất lượng assertions thực sự |

**Mutation testing trả lời:** "Nếu ai đó introduce bug, test suite có bắt được không?"

---

## 11. Test Coverage — Độ phủ kiểm thử

### 🟢 Q: What is code coverage? `[Junior]`

**A:** Code coverage đo **phần trăm code được thực thi** khi chạy test suite. Có nhiều loại coverage, mỗi loại đo ở level khác nhau.

### 🟡 Q: What are the different types of code coverage? `[Mid]`

**A:**

**1. Line Coverage (Statement Coverage)**
= Bao nhiêu % dòng code được chạy.

```
FUNCTION classify(score):
  IF score >= 90:           // Line 1
    RETURN "A"              // Line 2
  ELSE IF score >= 70:      // Line 3
    RETURN "B"              // Line 4
  ELSE:                     // Line 5
    RETURN "C"              // Line 6

TEST: classify(95)  → Hits lines 1, 2
Line coverage: 2/6 = 33%
```

**2. Branch Coverage (Decision Coverage)**
= Bao nhiêu % nhánh (true/false) được chạy.

```
// Có 3 decisions, mỗi decision có true/false → 6 branches
TEST: classify(95)  → Branch 1-true
TEST: classify(80)  → Branch 1-false, Branch 2-true
TEST: classify(50)  → Branch 1-false, Branch 2-false, Branch 3-true
Branch coverage: 6/6 = 100%
```

**3. Path Coverage**
= Bao nhiêu % đường đi (combinations of branches) được chạy.

```
FUNCTION process(a, b):
  IF a > 0:
    doX()
  IF b > 0:
    doY()

// Paths: (a>0, b>0), (a>0, b<=0), (a<=0, b>0), (a<=0, b<=0)
// 2 IFs → 4 paths. 3 IFs → 8 paths. n IFs → 2^n paths.
// Path coverage đắt: exponential growth!
```

**4. Condition Coverage (MC/DC)**
= Mỗi boolean sub-expression independently ảnh hưởng decision.

```
FUNCTION eligible(age, hasLicense):
  RETURN age >= 18 AND hasLicense

// MC/DC requires:
// Test 1: age=20, hasLicense=true  → true   (both true)
// Test 2: age=20, hasLicense=false → false  (hasLicense independently flips result)
// Test 3: age=15, hasLicense=true  → false  (age independently flips result)
```

**So sánh các loại coverage:**

| Type | Strength | Cost | Khi nào dùng |
|------|----------|------|-------------|
| Line | Thấp nhất | Rẻ | Baseline minimum |
| Branch | Trung bình | Vừa phải | Standard cho hầu hết projects |
| Path | Cao | Đắt (exponential) | Critical sections only |
| MC/DC | Rất cao | Rất đắt | Aviation, medical (DO-178C) |

### 🔴 Q: Is 100% code coverage a good goal? `[Senior]`

**A:** Không. 100% coverage là **misleading metric** và theo đuổi nó thường harmful.

**Goodhart's Law:** "When a measure becomes a target, it ceases to be a good measure."

```
// 100% coverage nhưng vô giá trị
FUNCTION test_all_lines():
  result = complex_business_logic(input)
  // No assertion — just running code for coverage
  // Coverage: 100%. Value: 0%.

// 80% coverage nhưng giá trị cao
FUNCTION test_critical_path():
  result = complex_business_logic(valid_input)
  ASSERT result.status == "success"
  ASSERT result.amount == expected_amount

FUNCTION test_error_handling():
  result = complex_business_logic(invalid_input)
  ASSERT result.error == "Invalid input"
```

**Practical targets:**

| Type | Target | Rationale |
|------|--------|-----------|
| Line coverage | 80%+ | Diminishing returns beyond this |
| Branch coverage | 70%+ | More meaningful than line |
| Critical paths | 100% | Payment, auth, data mutation |
| New code | 90%+ | Prevent coverage regression |
| Overall | 80% line | Team standard, enforced in CI |

**Anti-patterns of coverage-chasing:**
- Tests with no assertions (chỉ execute code)
- Testing trivial getters/setters
- Testing generated code / framework code
- Ignoring test quality for coverage numbers
- Gaming: exclude files from coverage rather than testing them

**Nguyên tắc:** Coverage là **metric** (đo), không phải **goal** (đích). Dùng để phát hiện **untested areas**, không để chứng minh code đúng.

---

## 12. Testing Strategy & Planning — Chiến lược kiểm thử

### 🟡 Q: What is risk-based testing? `[Mid]`

**A:** Risk-based testing ưu tiên test effort theo **impact x probability** — test kỹ nhất nơi risk cao nhất.

```
Risk Matrix:
                     High Impact
                         │
    ┌────────────────────┼────────────────────┐
    │ Low prob, High imp │ High prob, High imp│
    │ → Medium priority  │ → HIGHEST priority │
    │ (disaster recovery)│ (payment flow)     │
    ├────────────────────┼────────────────────┤
    │ Low prob, Low imp  │ High prob, Low imp │
    │ → Lowest priority  │ → Medium priority  │
    │ (about page typo)  │ (UI alignment)     │
    └────────────────────┼────────────────────┘
                         │
                     Low Impact
  Low Probability ───────────── High Probability
```

**Ví dụ cho e-commerce:**

| Feature | Probability of Bug | Impact if Bug | Risk Level | Test Strategy |
|---------|-------------------|---------------|------------|---------------|
| Payment checkout | Medium | Critical (revenue loss) | HIGH | Unit + integration + E2E + manual |
| User registration | Low | High (user acquisition) | MEDIUM | Unit + integration + 1 E2E |
| Product search | Medium | Medium (UX degradation) | MEDIUM | Unit + integration |
| Footer links | Low | Low (cosmetic) | LOW | 1 smoke test |

### 🟡 Q: How should tests be integrated into CI/CD pipeline? `[Mid]`

**A:**

```
CI/CD Pipeline — Test Stages:

┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────┐
│   Commit     │───→│  PR / Build   │───→│   Staging     │───→│Production│
│              │    │               │    │               │    │          │
│ • Lint       │    │ • Unit tests  │    │ • Full E2E    │    │ • Smoke  │
│ • Type check │    │ • Integration │    │ • Performance │    │ • Canary │
│ • Format     │    │ • Smoke E2E   │    │ • Security    │    │ • Monitor│
│              │    │ • Coverage    │    │ • Contract    │    │          │
│ ~30 seconds  │    │ ~5 minutes    │    │ ~30 minutes   │    │ Ongoing  │
└─────────────┘    └──────────────┘    └──────────────┘    └──────────┘
```

| Stage | Tests | Gate | Timeout |
|-------|-------|------|---------|
| Pre-commit / Local | Lint, typecheck, affected unit tests | Fail → cannot commit | < 30s |
| PR Build | All unit + integration + smoke E2E | Fail → cannot merge | < 10 min |
| Staging Deploy | Full E2E, perf, security scan | Fail → no production deploy | < 30 min |
| Production | Smoke, canary, monitoring | Fail → auto-rollback | Continuous |
| Nightly | Full regression, mutation testing | Fail → Slack alert to team | 1-2 hours |

### 🟡 Q: What is test parallelization and why does it matter? `[Mid]`

**A:** Test parallelization chạy tests **đồng thời** thay vì tuần tự → giảm CI time đáng kể.

```
Sequential:    Test1 ──→ Test2 ──→ Test3 ──→ Test4    Total: 40 min
Parallel (4):  Test1 ──→                                Total: 10 min
               Test2 ──→
               Test3 ──→
               Test4 ──→
```

**Challenges khi parallelize:**
- **Shared state:** Tests đọc/ghi cùng database → race conditions
- **Port conflicts:** Multiple test processes bind cùng port
- **File system:** Tests write to same temp directory
- **Order dependency:** Test B assumes Test A ran first

**Solutions:**

| Problem | Solution |
|---------|----------|
| Shared database | Database per worker, or schema per worker |
| Port conflicts | Random port assignment |
| File conflicts | Unique temp directories per test |
| Order dependency | Fix tests to be independent (FIRST principle) |

### 🟡 Q: What are smoke tests, regression suites, and canary tests? `[Mid]`

**A:**

| Type | What | When | Scope |
|------|------|------|-------|
| **Smoke test** | Quick sanity check: "app starts, login works, main page loads" | Every deployment | 5-10 critical paths |
| **Regression suite** | Full test suite — verify nothing broke | PR merge, nightly | All tests |
| **Canary test** | Tests running against **production** with real traffic subset | After deploy | Critical business flows |

```
// Smoke test example (runs in 2 minutes)
SUITE smoke_tests:
  test "homepage loads with 200"
  test "login with valid credentials succeeds"
  test "main dashboard renders"
  test "API health endpoint returns 200"
  test "database connection healthy"

// Canary test example (runs against production)
SUITE canary_tests:
  test "create test order with canary flag"
  test "verify order appears in dashboard"
  test "verify payment processed (test mode)"
  test "cleanup: delete test order"
```

### 🔴 Q: What is shift-left and shift-right testing? `[Senior]`

**A:**

```
Development Timeline:
←─── SHIFT LEFT ────────────────────────── SHIFT RIGHT ───→

Requirements → Design → Code → Test → Deploy → Production → Monitor
     ↑                                                          ↑
  Shift Left:                                           Shift Right:
  Test earlier                                          Test in production
```

**Shift-Left Testing — Test sớm hơn:**

| Practice | Stage | Value |
|----------|-------|-------|
| Static analysis (lint, typecheck) | Code | Catch bugs at write-time |
| Unit tests in IDE | Code | Instant feedback |
| TDD / BDD | Before code | Design-level defect prevention |
| Code review | Pre-merge | Catch logic errors early |
| Threat modeling | Design | Security by design |
| Contract testing | API design | Catch integration issues early |

**Shift-Right Testing — Test trong production:**

| Practice | Stage | Value |
|----------|-------|-------|
| Feature flags | Deploy | Gradual rollout, quick rollback |
| Canary deployment | Production | Detect issues with small traffic % |
| A/B testing | Production | Validate business hypotheses |
| Chaos engineering | Production | Verify resilience under failure |
| Observability (logs, metrics, traces) | Production | Detect issues not caught by pre-prod tests |
| Synthetic monitoring | Production | Continuous probing of critical paths |

### 🔴 Q: What is testing in production and how to do it safely? `[Senior]`

**A:** Testing in production = verify behavior với real infrastructure, real data, real traffic. Cần thiết vì test environments không bao giờ giống 100% production.

**Techniques:**

```
1. Feature Flags — Bật feature cho subset users
   deploy(new_checkout)
   IF feature_flag("new_checkout").enabled_for(user):
     show_new_checkout()
   ELSE:
     show_old_checkout()
   // Monitor error rates, conversion rates
   // If bad → disable flag instantly, no rollback needed

2. Canary Deployment — Route 5% traffic to new version
   load_balancer:
     95% → v1.2.0 (stable)
      5% → v1.3.0 (canary)
   // Compare error rates, latency, business metrics
   // If canary healthy after 30 min → gradually increase to 100%
   // If canary unhealthy → route 100% back to stable

3. Synthetic Monitoring — Fake user hits production periodically
   EVERY 5 minutes:
     response = HTTP_GET("https://app.com/api/health")
     ASSERT response.status == 200
     ASSERT response.latency < 500ms

     login_response = HTTP_POST("https://app.com/api/login",
       {email: "synthetic@test.com", password: "..."})
     ASSERT login_response.status == 200
     // Alert on-call if any assertion fails

4. Observability-Driven Testing
   // Not writing tests, but monitoring for anomalies
   alert IF:
     error_rate > 1% for 5 minutes
     p99_latency > 2 seconds
     payment_success_rate < 98%
     signup_rate drops > 30% from baseline
```

**Safety rails:**
- Blast radius control (feature flags, canary %)
- Automatic rollback on metric degradation
- Synthetic users clearly flagged (không mix với real data)
- Chaos experiments during business-low-traffic hours
- Runbook cho mỗi experiment

---

## 13. Interview Tips — Mẹo phỏng vấn về Testing

### 🟢 Q: How should I discuss testing in interviews? `[Junior]`

**A:** Framework trả lời câu hỏi testing trong interview:

**1. Start with WHY** — Vì sao cần test loại này
**2. Explain WHAT** — Test gì, scope ra sao
**3. Describe HOW** — Approach, tools, patterns
**4. Discuss TRADE-OFFS** — Cost vs benefit, khi nào không phù hợp

```
Example answer structure:

Interviewer: "How would you test a payment service?"

You:
"Payment is highest-risk feature (WHY), so I'd use multiple layers:

1. Unit tests for business logic — discount calculation, validation rules
   (WHAT: pure functions, FIRST principles)

2. Integration tests for database and payment gateway
   (HOW: test containers for DB, stub for payment API in CI,
    contract tests to verify API schema)

3. One E2E test for the critical happy path
   (WHAT: user adds item → checkout → payment → confirmation)

4. In production: feature flags for new payment methods,
   canary deployment, monitoring payment success rate

TRADE-OFF: I'd NOT E2E test every edge case —
that's unit test territory. E2E only for critical journeys."
```

### 🟡 Q: What testing concepts are most commonly asked in interviews? `[Mid]`

**A:**

| Company Type | Commonly Asked Topics |
|-------------|----------------------|
| FAANG/Big Tech | Test pyramid, TDD, system design + testing strategy, coverage limitations |
| Startup | Practical testing strategy, what to test first with limited time, CI/CD integration |
| Fintech | Contract testing, mutation testing, MC/DC, regulatory compliance |
| Product Company (Grab, VNG) | Integration testing patterns, E2E strategy, flaky test management |

### 🔴 Q: Design a testing strategy for a microservices e-commerce system. `[Senior]`

**A:** Đây là dạng câu hỏi mở thường gặp ở Senior interviews.

```
E-commerce system: User Service, Product Service, Order Service,
                   Payment Service, Notification Service

Testing Strategy:

┌─ Per Service ─────────────────────────────────────┐
│ Unit Tests (~70%)                                  │
│ • Business logic (pricing, discount, validation)   │
│ • Domain models                                    │
│ • Utility functions                                │
│                                                    │
│ Integration Tests (~20%)                           │
│ • Database queries (test containers)               │
│ • API endpoint tests (HTTP layer)                  │
│ • Message queue publish/consume                    │
│                                                    │
│ Contract Tests                                     │
│ • Consumer-driven contracts (Pact)                 │
│ • API schema validation                            │
└────────────────────────────────────────────────────┘

┌─ Cross-Service ───────────────────────────────────┐
│ E2E Tests (~10%)                                   │
│ • User signup → browse → add to cart → pay → email│
│ • Search → filter → sort → paginate               │
│ • Return/refund flow                               │
│                                                    │
│ Performance Tests                                  │
│ • Load test checkout (Black Friday simulation)     │
│ • Latency SLO verification                         │
└────────────────────────────────────────────────────┘

┌─ Production ──────────────────────────────────────┐
│ • Canary deployment (5% traffic to new version)   │
│ • Synthetic monitoring (health checks every 1min) │
│ • Feature flags for new payment methods           │
│ • Alert on: error_rate > 1%, latency p99 > 2s,   │
│   payment_success_rate < 98%                       │
└────────────────────────────────────────────────────┘

CI/CD:
  PR:     lint + unit + integration + contract        (~5 min)
  Merge:  above + E2E smoke + security scan           (~15 min)
  Deploy: canary + smoke test production              (~30 min)
  Nightly: full regression + mutation + performance   (~2 hours)
```

---

## Quick Reference — Bảng tổng hợp nhanh

### Testing Types at a Glance

| Type | Scope | Speed | Cost | Confidence | When to Use |
|------|-------|-------|------|------------|-------------|
| Static Analysis | Syntax, types | Instant | Free | Catch typos/type errors | Always (lint + typecheck) |
| Unit | Function/class | ms | Low | Logic correctness | Every function with logic |
| Integration | Multi-component | seconds | Medium | Boundaries work | DB, API, queue interactions |
| Contract | API schema | seconds | Medium | Services compatible | Microservices |
| E2E | Full system | minutes | High | User flows work | Critical journeys only |
| Performance | Load/latency | minutes | High | System scales | Before major releases |
| Mutation | Test quality | minutes-hours | High | Tests catch bugs | Quarterly / critical modules |

### Test Double Decision Tree

```
Need a test double?
│
├─ Does the test USE the dependency?
│  ├─ No → DUMMY (just fill the parameter)
│  └─ Yes → continue
│
├─ Do you need to CONTROL what it returns?
│  ├─ Yes → STUB (predetermined responses)
│  └─ No → continue
│
├─ Do you need to VERIFY it was called correctly?
│  ├─ Yes, loosely → SPY (record and check)
│  ├─ Yes, strictly → MOCK (expectations + verify)
│  └─ No → continue
│
└─ Do you need REALISTIC behavior?
   └─ Yes → FAKE (in-memory implementation)
```

### TDD vs BDD vs ATDD

| Aspect | TDD | BDD | ATDD |
|--------|-----|-----|------|
| Full name | Test-Driven Development | Behavior-Driven Development | Acceptance Test-Driven Development |
| Focus | Code correctness | Business behavior | Acceptance criteria |
| Written by | Developer | Dev + QA + PM | QA + PM |
| Format | Test functions | Given-When-Then | Acceptance scenarios |
| Scope | Unit | Feature | User story |
| Drives | Code design | Shared understanding | Requirements clarity |
