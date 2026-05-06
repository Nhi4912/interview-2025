# Code Coverage Strategy for Frontend / Chiến Lược Code Coverage cho Frontend

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md) · [Browser Performance README](./README.md) · [Frontend Testing Strategy](./06-frontend-testing-strategy.md) · [Frontend Testing](../14-frontend-testing.md) · [Visual Regression Testing](./08-visual-regression-testing.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Interviewer hỏi: _"Your team ships 95% code coverage. A critical bug reaches production anyway. What went wrong?"_

Đây là câu hỏi bẫy kinh điển. Junior engineer trả lời: _"We must have missed a test."_ Senior engineer trả lời khác hẳn: _"Coverage tells us code was **executed**, not that it was **verified**. 95% coverage with weak assertions is theater — the lines ran, but nothing checked the output."_

Hãy nhìn vào cách các công ty thực tế đối xử với coverage:

**Google** có chính sách nội bộ: không cho phép merge code mới nếu coverage của **diff đó** dưới 60%. Không phải project-wide — mà per-diff. Lý do: họ không muốn tích lũy nợ coverage ở code mới; code cũ đã có debt riêng.

**Stripe** đi theo hướng khác hoàn toàn. Họ bỏ qua branch coverage và theo dõi **mutation score** thay thế. Lý do: mutation testing thực sự kiểm tra xem tests có _phát hiện_ được lỗi logic hay không — không chỉ là code có được chạy qua hay không.

**Linear** (công cụ issue tracking) có stance pragmatic nhất: _"Coverage là tool để theo dõi trend, không phải làm gate."_ Họ xem coverage như một biểu đồ xu hướng — nếu coverage giảm đột biến qua nhiều sprints, đó là signal đáng điều tra, không phải lý do để block PR.

Vậy thì **code coverage thực sự đo cái gì, và khi nào nó có giá trị?** Đó là câu hỏi của bài này.

> 🇻🇳 **Tóm tắt**: Coverage 95% không đảm bảo chất lượng nếu assertions yếu. Google gate theo diff coverage, Stripe dùng mutation score, Linear xem coverage là trend tool. Senior signal là hiểu sự khác biệt giữa "executed" và "verified".

---

## What Coverage Actually Measures / Coverage Thực Sự Đo Gì

Coverage là số liệu về **execution**, không phải **verification**. Đây là điểm khác biệt quan trọng nhất.

### The Four Metrics / Bốn Chỉ Số

**1. Statement Coverage**
Đếm số statements được thực thi ít nhất một lần.

```ts
function process(x: number) {
  const y = x * 2; // statement 1
  const z = y + 1; // statement 2
  return z; // statement 3
}
```

Gọi `process(5)` → 3/3 statements = **100% statement coverage**.

---

**2. Branch Coverage**
Đếm số branches (nhánh if/else, ternary, switch) được thực thi.

```ts
function grade(score: number): string {
  if (score >= 90) {
    // branch: true / false
    return "A";
  } else if (score >= 70) {
    // branch: true / false
    return "B";
  } else {
    return "C";
  }
}
```

Test `grade(95)` → chỉ cover branch `score >= 90 = true`. 1/4 branches = **25% branch coverage**.
Test `grade(95)` + `grade(75)` + `grade(50)` → 4/4 = **100% branch coverage**.

---

**3. Function Coverage**
Đếm số functions được gọi ít nhất một lần.

```ts
function add(a: number, b: number) {
  return a + b;
}
function subtract(a: number, b: number) {
  return a - b;
}
function multiply(a: number, b: number) {
  return a * b;
}

// Test only:
add(1, 2);
// Function coverage: 1/3 = 33%
```

---

**4. Line Coverage**
Tương tự Statement Coverage nhưng tính theo dòng code, không phải AST nodes. Sự khác biệt quan trọng:

```ts
const result = condition ? valueA : valueB; // 1 line, 2 statements
```

Line coverage = 1 line covered. Statement coverage = 1/2 (nếu `condition` luôn `true`).

---

### The Gap: Executed vs Verified / Khoảng Cách Giữa Executed và Verified

```ts
// Code under test
function calculateDiscount(price: number, isVIP: boolean): number {
  if (isVIP) {
    return price * 0.8;
  }
  return price;
}

// Test — 100% coverage, but wrong assertion
it("applies VIP discount", () => {
  const result = calculateDiscount(100, true);
  expect(result).toBeDefined(); // ← covers the branch, verifies NOTHING
});
```

Kết quả: **100% branch + statement + function + line coverage**. Nhưng nếu có bug `return price * 0.9` (sai discount rate), test vẫn pass.

**Coverage = code đã chạy qua. Quality = code đã được verify đúng.**

> 🇻🇳 **Tóm tắt**: 4 metrics — Statement (expressions), Branch (if/else paths), Function (callable units), Line (physical lines). Cả 4 đều đo execution. Chúng không nói gì về việc assertions có đúng hay không. "100% coverage với `expect(result).toBeDefined()`" là theater.

---

## Concept Map / Bản Đồ Khái Niệm

```
CODE COVERAGE PIPELINE
│
├── SOURCE CODE
│     └── TypeScript / JSX / ESM modules
│
├── INSTRUMENT
│     ├── c8 (V8 native) ────────── no transform, uses runtime coverage API
│     └── Istanbul ───────────────── AST transform, injects counters at compile
│
├── RUN TESTS
│     ├── Unit tests (Vitest, Jest)
│     ├── Integration tests (RTL + Vitest browser mode)
│     └── E2E tests (Playwright, Cypress)
│
├── CAPTURE RAW DATA
│     ├── .json coverage files (V8 format)
│     ├── .json coverage files (Istanbul/nyc format)
│     └── lcov.info (universal interchange format)
│
├── AGGREGATE / MERGE
│     ├── nyc merge ──────── combine multiple coverage sources
│     ├── c8 report ──────── re-process V8 JSON into reports
│     └── Codecov uploader ─ upload to hosted service
│
├── THRESHOLD CHECK
│     ├── Per-file minimums (vitest coverageThresholds)
│     ├── Per-folder minimums
│     └── Project-wide minimums
│         └── FAIL build if below ─────── enforce in CI
│
└── TREND REPORT
      ├── Codecov / Coveralls / SonarCloud PR bot
      ├── Coverage diff vs base branch
      └── Historical trend chart (never-decrease ratchet)
```

> 🇻🇳 **Tóm tắt**: Pipeline 6 bước: Source → Instrument → Run Tests → Capture → Aggregate → Threshold/Trend. Instrumentation method (c8 vs Istanbul) quyết định overhead và accuracy. Aggregation là bước cần thiết khi merge unit + E2E coverage.

---

## Part 1: Tool Comparison / So Sánh Công Cụ

### The Players / Các Công Cụ

**c8** — V8 native coverage

- Không inject code. Dùng V8's built-in coverage API (`--coverage` flag).
- Cực nhanh: không có transform overhead.
- ESM support: native (V8 xử lý ESM natively).
- Source map fidelity: tốt nhưng đôi khi có edge case với complex transforms.
- **Khi chọn**: Vitest projects, ESM-first codebases, khi muốn CI nhanh nhất có thể.

**Istanbul** — AST instrumentation

- Inject counters vào AST tại compile time.
- Chậm hơn c8 (~20–40% build time overhead với large projects).
- Source map fidelity: xuất sắc — biết chính xác từng branch của transpiled code.
- ESM support: cần cấu hình thêm (babel transform hoặc `@babel/plugin-transform-modules-commonjs`).
- **Khi chọn**: Jest projects, CJS codebases, khi cần report chi tiết nhất về branches.

**Vitest providers** — v8 vs istanbul

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8", // hoặc "istanbul"
      reporter: ["text", "lcov", "html"],
    },
  },
});
```

- `provider: "v8"`: nhanh hơn, ít config hơn, ESM native. Recommended cho hầu hết projects.
- `provider: "istanbul"`: chậm hơn nhưng branch accuracy cao hơn ở một số edge cases (decorated classes, legacy transforms).

**Jest** — Istanbul baked-in

- Jest sử dụng Istanbul via `@jest/coverage`.
- Config: `jest.config.ts` `coverage: { provider: 'v8' | 'babel' }`.
- `babel` provider = Istanbul. `v8` provider = V8 coverage.

**nyc** — legacy CLI wrapper cho Istanbul

- CLI tool bọc Istanbul, dùng với legacy Node.js projects.
- Vẫn hữu ích cho: merge multiple coverage reports, generate lcov từ CLI.
- 2025+: Vitest/c8 đã thay thế nyc trong hầu hết greenfield projects.

### Comparison Matrix / Bảng So Sánh

| Tool                | Speed    | Transform Overhead | Source Map Fidelity | ESM Support   | When to Choose                                 |
| ------------------- | -------- | ------------------ | ------------------- | ------------- | ---------------------------------------------- |
| **c8 (V8)**         | Fast     | None               | Good                | Native        | Vitest/ESM projects, CI speed is priority      |
| **Istanbul**        | Moderate | ~20–40%            | Excellent           | Needs config  | Jest, legacy CJS, max branch accuracy          |
| **Vitest v8**       | Fast     | None               | Good                | Native        | Modern TS/ESM projects (recommended)           |
| **Vitest Istanbul** | Moderate | ~20–40%            | Excellent           | Needs babel   | When branch report accuracy is critical        |
| **Jest (v8)**       | Fast     | None               | Good                | Limited       | Existing Jest setups migrating away from babel |
| **nyc (legacy)**    | Moderate | ~20–40%            | Excellent           | Via transform | Legacy projects, coverage merging CLI          |

> 🇻🇳 **Tóm tắt**: c8/Vitest v8 provider là lựa chọn default tốt nhất cho projects mới — không có transform overhead, ESM native. Istanbul tốt hơn về branch accuracy nhưng chậm hơn. nyc là legacy tool vẫn có giá trị cho việc merge coverage files từ nhiều nguồn.

---

## Part 2: Coverage Across Test Types — Merging Strategy / Merging Coverage Từ Nhiều Loại Test

### Why Merging Matters / Tại Sao Merging Quan Trọng

**Một codebase thực tế có 3 lớp tests:**

```
Unit tests (Vitest)      →  covers logic in isolation
Integration tests (RTL)  →  covers component interactions
E2E tests (Playwright)   →  covers user flows end-to-end
```

**Vấn đề**: Chạy coverage chỉ từ unit tests cho kết quả misleading.

```
Example: UserDashboard component
- Unit test coverage: 80%
  → Tất cả helper functions covered
  → Nhưng route guard logic KHÔNG có unit test

- E2E coverage (Playwright with instrumented build):
  → Route guard: covered (user flow exercises it)
  → But helper function edge cases: NOT covered

- Merged coverage: 88%
  → More accurate — reflects actual executed code paths
    across the entire test suite
```

**Real numbers từ thực tế**: 80% unit coverage alone có thể misleading. Merged unit + E2E thường reveal:

- Code paths chỉ được trigger bởi user interactions (không phải unit tests)
- Dead code paths mà cả unit lẫn E2E đều không chạm đến

---

### Merging Strategy / Chiến Lược Merge

**Step 1: Configure each test layer to output raw coverage**

```ts
// vitest.config.ts (unit + integration)
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["json"], // raw JSON for merging
      reportsDirectory: "./coverage/unit",
      enabled: process.env.COVERAGE === "true",
    },
  },
});
```

```ts
// playwright.config.ts (E2E)
import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    // Requires instrumented build — see setup section
  },
});
```

**Step 2: Generate coverage from each layer**

```bash
# Unit tests
COVERAGE=true npx vitest run --coverage

# E2E tests with coverage (requires @playwright/test with coverage API)
npx playwright test --project=coverage
```

**Step 3: Merge with nyc or c8**

```bash
# Using nyc to merge multiple coverage directories
npx nyc merge coverage/unit coverage/e2e coverage/merged.json

# Then generate HTML report from merged data
npx nyc report --reporter=html --reporter=lcov \
  --temp-dir=coverage/merged \
  --report-dir=coverage/final
```

Hoặc dùng `@vitest/coverage-v8` merge API:

```bash
# c8 approach — point at multiple coverage directories
npx c8 report \
  --include="src/**/*.{ts,tsx}" \
  --reporter=html \
  --reporter=lcov
```

**Step 4: Upload merged report**

```bash
# Codecov
npx codecov --file=coverage/final/lcov.info

# Coveralls
npx coveralls < coverage/final/lcov.info
```

---

### Playwright Coverage Setup / Cấu Hình Playwright Coverage

```ts
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  projects: [
    {
      name: "coverage",
      use: { baseURL: "http://localhost:3000" },
    },
  ],
  // Requires NEXT_PUBLIC_COVERAGE=true build or vite --coverage build
  webServer: {
    command: "VITE_COVERAGE=true npm run build && npm run preview",
    port: 3000,
  },
});
```

```ts
// tests/coverage-setup.ts
import { test as base, chromium } from "@playwright/test";
import { collectCoverage, mergeCoverage } from "v8-to-istanbul";

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.coverage.startJSCoverage();
    await use(page);
    const coverage = await page.coverage.stopJSCoverage();
    // Write coverage to file for merging
    await writeCoverageFile(coverage, "coverage/e2e");
  },
});
```

> 🇻🇳 **Tóm tắt**: 3 loại test sinh ra 3 coverage reports khác nhau. Merging là cần thiết để có bức tranh toàn diện. Workflow: mỗi layer output JSON → nyc merge → c8/nyc report → upload. 80% từ unit alone thường misleading; merged coverage thường reveal gaps ở code paths chỉ E2E mới trigger.

---

## Part 3: Setup Examples / Ví Dụ Cấu Hình Thực Tế

### Vitest v8 Provider (Recommended)

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html", "json"],
      reportsDirectory: "./coverage",
      // Thresholds — fail CI if below these
      thresholds: {
        lines: 80,
        branches: 75,
        functions: 80,
        statements: 80,
      },
      // Exclusions — see Part 7
      exclude: [
        "src/**/*.stories.{ts,tsx}",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
        "src/test-setup.ts",
        "src/types/**",
        "src/**/*.d.ts",
        "src/mocks/**",
        "src/generated/**", // codegen output
        "**/__mocks__/**",
        "vitest.config.ts",
        "vite.config.ts",
      ],
      // Include — explicit source scope
      include: ["src/**/*.{ts,tsx}"],
      // Enable branch coverage (V8 default is true, Istanbul also)
      all: true, // report even uncovered files
    },
  },
});
```

---

### Playwright with JS Coverage API

```ts
// tests/global-setup.ts
import { FullConfig } from "@playwright/test";
import { mkdir } from "fs/promises";

export default async function globalSetup(_config: FullConfig) {
  await mkdir("coverage/e2e", { recursive: true });
}
```

```ts
// tests/fixtures/coverage.fixture.ts
import { test as base } from "@playwright/test";
import { writeFileSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

type CoverageFixture = {
  autoCollectCoverage: void;
};

export const test = base.extend<CoverageFixture>({
  autoCollectCoverage: [
    async ({ page }, use) => {
      await page.coverage.startJSCoverage({
        resetOnNavigation: false,
      });

      await use();

      const coverage = await page.coverage.stopJSCoverage();
      const id = randomUUID();
      writeFileSync(join("coverage/e2e", `coverage-${id}.json`), JSON.stringify(coverage));
    },
    { auto: true }, // auto-use for all tests in this project
  ],
});
```

---

### Next.js Instrumentation

Next.js có một gotcha quan trọng: **Server Components không thể được instrumented bởi V8 coverage** vì chúng chạy ở Node.js server, không phải browser. Client Components có thể được tracked bình thường.

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable SWC coverage instrumentation for client-side code
  experimental: {
    // Requires Next.js 14.2+
    instrumentationHook: true,
  },
  // For Vitest + coverage with Next.js:
  // Use next/jest or next/vitest config
};

export default nextConfig;
```

```ts
// vitest.config.ts for Next.js project
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    coverage: {
      provider: "v8",
      exclude: [
        // Next.js specific exclusions
        ".next/**",
        "app/**/*.ts", // Server Components — can't instrument
        "app/**/route.ts", // Route handlers — server-only
        "app/**/layout.tsx", // Server layouts
        "app/**/page.tsx", // Server pages (unless 'use client')
        "middleware.ts", // Edge middleware
        "next.config.ts",
        "postcss.config.ts",
        "tailwind.config.ts",
      ],
      include: [
        "components/**/*.{ts,tsx}", // Client components
        "lib/**/*.{ts,tsx}", // Shared utilities
        "hooks/**/*.{ts,tsx}", // Custom hooks
        "store/**/*.{ts,tsx}", // State management
      ],
    },
  },
});
```

**Framework-specific gotcha: RSC Server Components**

```
Problem: Server Components run in Node.js, not in the browser.
V8 coverage via page.coverage.startJSCoverage() captures browser JS only.

Solution options:
1. Track Server Component coverage separately with Node.js --coverage
2. Accept that coverage report won't include server-only code
3. Use integration tests with test doubles for server components
4. Document the gap explicitly in coverage config comments
```

> 🇻🇳 **Tóm tắt**: Vitest v8 config cần: `include` rõ ràng source scope, `exclude` stories/tests/generated/types, `all: true` để report cả files chưa được test. Next.js gotcha: Server Components không được instrument bởi browser V8 coverage — document gap này rõ ràng trong config.

---

## Part 4: CI/CD Integration / Tích Hợp CI/CD

### Codecov vs Coveralls vs SonarCloud

| Feature                      | Codecov                  | Coveralls            | SonarCloud                   |
| ---------------------------- | ------------------------ | -------------------- | ---------------------------- |
| PR comment bot               | ✅ Coverage diff comment | ✅ Badge + comment   | ✅ Full quality gate comment |
| Coverage diff                | ✅ Per-file diff         | ✅ Overall diff      | ✅ Per-file + quality gate   |
| Baseline tracking            | ✅ Per-branch baselines  | ✅ Build history     | ✅ Quality profiles          |
| Free for open source         | ✅ Unlimited             | ✅ Unlimited         | ✅ Unlimited                 |
| Free for private repos       | Limited (1 user)         | Limited (1 private)  | Limited                      |
| Fail-on-decrease policy      | ✅ `fail_ci_if_error`    | ✅ `threshold`       | ✅ Quality gate conditions   |
| Mutation testing integration | ❌                       | ❌                   | ✅ Stryker integration       |
| Multiple format support      | lcov, cobertura, jacoco  | lcov, json           | lcov, generic + SAST         |
| Setup complexity             | Low                      | Low                  | Medium                       |
| **Best for**                 | Simple coverage tracking | GitHub-native simple | Enterprise quality + SAST    |

---

### GitHub Actions Setup

```yaml
# .github/workflows/coverage.yml
name: Test Coverage

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - run: npm ci

      - name: Run tests with coverage
        run: npx vitest run --coverage
        env:
          CI: true

      - name: Upload to Codecov
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/lcov.info
          flags: unit
          fail_ci_if_error: true
          # Fail if coverage decreases by more than 1%
          threshold: 1

      - name: Upload coverage artifact
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/html/
```

---

### Coverage Diff on PR / Coverage Diff Trên PR

```yaml
# Codecov config — codecov.yml (root of repo)
coverage:
  precision: 2
  round: down
  range: "70...100"

  status:
    project:
      default:
        # Fail if overall coverage drops by more than 1%
        threshold: 1%
        base: auto
        if_ci_failed: error

    patch:
      default:
        # Code added in PR must have minimum 60% coverage
        threshold: 0%
        target: 60%
        base: auto

comment:
  layout: "reach,diff,flags,files"
  behavior: default
  require_changes: true # Only comment if coverage changed
```

**Ratchet pattern** — không bao giờ giảm:

```yaml
# codecov.yml — enforce ratchet
coverage:
  status:
    project:
      default:
        target: auto # uses base branch coverage as target
        threshold: 0% # zero tolerance for decrease
```

---

### Fail-on-Decrease Policy

```ts
// vitest.config.ts — local threshold enforcement
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        // These fail the build if not met
        lines: 80,
        branches: 75,
        functions: 80,
        statements: 80,
        // Per-file thresholds (stricter for critical modules)
        "src/auth/**": {
          lines: 95,
          branches: 90,
        },
        "src/payments/**": {
          lines: 95,
          branches: 90,
        },
      },
    },
  },
});
```

> 🇻🇳 **Tóm tắt**: Codecov là lựa chọn phổ biến nhất vì simplicity. SonarCloud tốt nhất cho enterprise (có thêm SAST, code smells, mutation testing integration). Ratchet pattern = target: auto + threshold: 0% = coverage không bao giờ được giảm. Per-patch threshold (60%) là cách Google-style gate cho code mới.

---

## Part 5: Threshold Strategies / Chiến Lược Threshold

### Why 80% Is Arbitrary / Tại Sao 80% Là Tùy Tiện

"80% coverage" là con số mặc định phổ biến nhất trong industry. Lý do xuất xứ không phải từ data — mà từ convention. Không có nghiên cứu nào chứng minh 80% là ngưỡng tối ưu.

**Vấn đề với một số ngưỡng cố định:**

```
Project A: E-commerce payment service
- 80% coverage, all critical paths covered
- This is good.

Project B: Static marketing site helpers
- 80% coverage, but all uncovered code is dead configuration
- This is meaningless.

Project C: Legacy codebase with 10K LOC
- 80% coverage achieved by testing getters/setters
- Core business logic untested
- This is dangerous.
```

---

### Per-File vs Per-Folder vs Project-Wide

```ts
// vitest.config.ts — granular thresholds
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        // Project-wide baseline
        lines: 75,
        branches: 70,
        functions: 75,
        statements: 75,

        // Critical modules — stricter
        "src/lib/auth.ts": {
          lines: 100,
          branches: 100,
          functions: 100,
          statements: 100,
        },

        // Payment processing — very strict
        "src/lib/payments/**": {
          lines: 95,
          branches: 90,
          functions: 95,
          statements: 95,
        },

        // UI components — relaxed (visual tested via E2E)
        "src/components/ui/**": {
          lines: 60,
          branches: 50,
          functions: 60,
          statements: 60,
        },
      },
    },
  },
});
```

---

### The Ratchet Pattern / Mẫu Ratchet

Thay vì fixed threshold, ratchet pattern đảm bảo coverage **không bao giờ giảm**:

```
Ngày 1: coverage = 72% → commit → baseline = 72%
Ngày 2: coverage = 74% → commit → baseline = 74%  (tăng lên)
Ngày 3: coverage = 72% → FAIL ← vì thấp hơn baseline 74%
```

Cách implement với Codecov: `target: auto` + `threshold: 0%`.

Cách implement với Vitest: không có native ratchet, nhưng có thể implement với custom CI script:

```bash
#!/bin/bash
# scripts/check-coverage-ratchet.sh
CURRENT=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
BASELINE=$(cat .coverage-baseline || echo "0")

if (( $(echo "$CURRENT < $BASELINE" | bc -l) )); then
  echo "Coverage decreased: $CURRENT% < $BASELINE% (baseline)"
  exit 1
fi

echo $CURRENT > .coverage-baseline
echo "Coverage OK: $CURRENT%"
```

---

### Lines vs Branches — Why They Matter Differently

```
Lines coverage misses: conditional branches on same line
  const x = a > 0 ? doA() : doB();  // 1 line, 2 branches

Branches coverage misses: implied null checks
  function foo(x?: string) { return x?.toUpperCase(); }
  // Test with x = "hello" → line covered, but x = undefined branch missed

Recommendation:
- Track BOTH lines and branches
- branches threshold should be ~5% lower than lines (harder to achieve)
- Never track only lines — it's the easiest metric to game
```

> 🇻🇳 **Tóm tắt**: 80% là con số tùy tiện. Tốt hơn là dùng per-module thresholds (auth/payments = 95%, UI components = 60%) + ratchet pattern. Track cả lines lẫn branches — branches threshold nên thấp hơn ~5% vì branches khó cover hơn. Mục tiêu thực sự: coverage như là _safety net_, không phải _quality gate_.

---

## Part 6: Coverage Anti-Patterns vs Mutation Testing / Anti-Patterns và Mutation Testing

### Why 100% Coverage Does Not Mean Tests Verify Behavior

Xem ví dụ kinh điển:

```ts
// Source
function validateEmail(email: string): boolean {
  return email.includes("@");
}

// "Test" achieving 100% coverage
it("validates email", () => {
  validateEmail("user@example.com"); // Executed — no assertion
  validateEmail("invalid"); // Executed — no assertion
  expect(true).toBe(true); // Meaningless assertion
});

// Coverage report: 100% lines, 100% branches, 100% functions
// But the function could return ANYTHING and tests would pass
```

---

### Mutation Testing / Mutation Testing

**Mutation testing** là kỹ thuật thực sự đo chất lượng của test suite.

**Cách hoạt động**:

1. Tool tự động tạo "mutants" — versions của code với lỗi nhỏ được inject
2. Chạy test suite trên mỗi mutant
3. Nếu mutant bị tests "kill" (test fails) → test suite đang verify behavior
4. Nếu mutant "survives" (tests still pass) → test suite không verify logic đó

```ts
// Original
function add(a: number, b: number) {
  return a + b;
}

// Mutant 1: operator change
function add(a: number, b: number) {
  return a - b;
} // ← killed if test checks result

// Mutant 2: boundary change
function grade(score: number) {
  return score >= 90 ? "A" : "B";
}
// Mutant: score > 90 ? "A" : "B"  ← killed only if test checks score = 90 case
```

**Mutation Score** = killed mutants / total mutants × 100

```
Coverage 100% + Mutation Score 40% = Tests are theater
Coverage 80%  + Mutation Score 85% = Tests actually verify behavior
```

---

### Stryker — Production Mutation Testing Tool

```ts
// stryker.config.mts
import type { Config } from "@stryker-mutator/core";

const config: Config = {
  testRunner: "vitest",
  reporters: ["html", "clear-text", "dashboard"],
  coverageAnalysis: "perTest", // faster than 'all'
  mutate: [
    // Only mutate high-stakes code
    "src/lib/auth/**/*.ts",
    "src/lib/payments/**/*.ts",
    "src/hooks/useFormValidation.ts",
    // Exclude utility files
    "!src/lib/utils/**",
    "!src/**/*.test.ts",
  ],
  // Increase timeout for complex mutations
  timeoutMS: 60000,
  thresholds: {
    high: 80, // Green
    low: 60, // Yellow
    break: 50, // Fail CI if below
  },
};

export default config;
```

```bash
# Run mutation testing
npx stryker run

# Output:
# Mutation score: 78.5%
# 342 mutants tested, 268 killed, 74 survived
# Survived mutants written to: reports/mutation/html/index.html
```

---

### When to Add Mutation Testing / Khi Nào Thêm Mutation Testing

```
HIGH-STAKES: Always worth it
  ├── Authentication / authorization logic
  ├── Payment processing / pricing calculations
  ├── Data validation rules (forms, API inputs)
  └── Security-critical code (sanitization, escaping)

PUBLIC LIBRARIES: Worth it
  ├── Shared utility functions used across apps
  ├── npm packages with SemVer contracts
  └── Design system components with accessibility guarantees

NORMAL APP CODE: Usually overkill
  ├── UI components (E2E tests cover user behavior)
  ├── Configuration files
  └── Thin wrapper code

WHEN NOT TO USE:
  ├── Generated code (codegen output)
  ├── Third-party adapter code
  └── Performance-sensitive hot paths (mutation runs take time)
```

> 🇻🇳 **Tóm tắt**: 100% coverage không verify behavior. Mutation testing inject lỗi vào code và kiểm tra xem tests có detect được không — đây mới là quality signal thực sự. Stryker là tool phổ biến nhất. Mutation score 80% + coverage 80% = solid test suite. Áp dụng mutation testing ưu tiên cho auth/payment/validation code.

---

## Part 7: What to Exclude — and Why / Những Gì Nên Exclude Và Tại Sao

### Safe to Exclude / An Toàn Để Exclude

```ts
// vitest.config.ts — production-grade exclusion list
export default defineConfig({
  test: {
    coverage: {
      exclude: [
        // Test files themselves
        "**/*.test.{ts,tsx,js}",
        "**/*.spec.{ts,tsx,js}",
        "**/__tests__/**",

        // Test infrastructure
        "src/test-setup.ts",
        "src/test-utils/**",
        "**/__mocks__/**",
        "**/mocks/**",
        "**/fixtures/**",

        // Storybook — visual tested separately
        "**/*.stories.{ts,tsx,js}",
        ".storybook/**",

        // Generated code — no value in covering generated output
        "src/generated/**",
        "src/__generated__/**",
        "**/*.generated.{ts,tsx}",
        "graphql-types.ts",

        // Type-only files — no runtime code
        "src/types/**",
        "**/*.d.ts",

        // Configuration files
        "vitest.config.ts",
        "vite.config.ts",
        "next.config.ts",
        "tailwind.config.ts",
        "postcss.config.ts",
        "eslint.config.ts",

        // Build artifacts
        "dist/**",
        ".next/**",
        "node_modules/**",

        // Third-party shims / polyfills
        "src/polyfills/**",
        "src/vendor/**",

        // Entry points with no testable logic
        "src/main.tsx",
        "src/index.ts", // re-exports only
      ],
    },
  },
});
```

---

### Dangerous Exclusions / Exclusions Nguy Hiểm

```ts
// ⚠️ DO NOT exclude these without good reason
const dangerousExclusions = [
  // Business logic disguised as utilities
  "src/utils/**", // Could contain critical helpers
  "src/helpers/**", // Same issue

  // Error handling
  "src/errors/**", // Error boundary logic is important

  // State management
  "src/store/**", // Complex reducer logic needs coverage

  // API layer
  "src/api/**", // Data fetching logic, error handling
];

// The trap: excluding these files inflates your coverage %
// without reducing the number of bugs you'll ship.
```

---

### The Exclusion Trap / Bẫy Exclusion

```
Scenario:
- Project has 1000 LOC
- Coverage: 600/1000 = 60%

"Solution" (wrong): Exclude 300 LOC of real logic
- Coverage: 600/700 = 85.7% ← looks great!
- But: 300 LOC of real logic is untested

Real solution:
- Write tests for the 400 uncovered lines
- OR document WHY those lines are intentionally untested
- Never exclude real business logic to hit a number
```

> 🇻🇳 **Tóm tắt**: An toàn để exclude: test files, stories, generated code, types-only, config files, polyfills, entry points. Nguy hiểm khi exclude: business logic, state management, API layer, error handling. Mục tiêu của exclude là loại bỏ noise — không phải để game the number.

---

## Part 8: Coverage in TypeScript Codebases / Coverage Trong TypeScript

### Source Map Fidelity / Source Map Fidelity

TypeScript compile sang JavaScript trước khi V8 instruments. Source maps là cầu nối để coverage report trỏ về TypeScript source thay vì compiled JS.

```ts
// tsconfig.json — cần thiết cho accurate coverage
{
  "compilerOptions": {
    "sourceMap": true,        // Generate .js.map files
    "inlineSources": true,    // Embed TS source in sourcemap
    "inlineSourceMap": false, // Don't inline in .js (separate file is better)
    "declarationMap": true    // For .d.ts files
  }
}
```

```ts
// vitest.config.ts — source map support
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      // V8 provider automatically resolves source maps
      // Istanbul provider requires: sourcemap: true in babel config
    },
  },
});
```

---

### TypeScript Strict Mode Reduces Coverage's Value

TypeScript strict mode loại bỏ một số branch paths trước khi runtime:

```ts
// Without strict mode: both branches possible
function process(value: string | null) {
  if (value === null) {
    // branch: true / false
    return "empty";
  }
  return value.toUpperCase();
}

// With strict mode + TypeScript narrowing:
function process(value: string) {
  // null impossible at compile time
  return value.toUpperCase(); // only 1 possible path
}
// Result: fewer branches to cover — coverage % becomes less meaningful
```

---

### Dead Branches TypeScript Proves Unreachable

```ts
// TypeScript exhaustive switch
type Direction = "north" | "south" | "east" | "west";

function getOffset(dir: Direction): [number, number] {
  switch (dir) {
    case "north":
      return [0, 1];
    case "south":
      return [0, -1];
    case "east":
      return [1, 0];
    case "west":
      return [-1, 0];
    default:
      // TypeScript proves this branch is dead (never type)
      // Coverage tools may flag this as uncovered branch
      const _exhaustive: never = dir;
      throw new Error(`Unexpected direction: ${_exhaustive}`);
  }
}
```

**Vấn đề**: c8/Istanbul mark `default` branch as uncovered → coverage drops.
**Giải pháp**: Use `/* c8 ignore next */` hoặc `/* istanbul ignore next */` comments:

```ts
default:
  /* c8 ignore next */
  throw new Error(`Unexpected direction: ${dir as never}`);
```

---

### TypeScript Catches What Coverage Can't

```
TypeScript strict mode catches at compile time:
  ✅ null/undefined access (strictNullChecks)
  ✅ Missing branches in union type switches (never check)
  ✅ Incorrect argument types
  ✅ Uninitialized variables

Coverage catches at runtime:
  ✅ Whether code paths were actually exercised
  ✅ Whether error handling branches are reachable
  ✅ Whether async paths complete

Rule of thumb:
  TypeScript strict + 80% coverage > TypeScript loose + 100% coverage
  TS does static verification; coverage does runtime path verification
  They complement, not substitute for each other
```

> 🇻🇳 **Tóm tắt**: Source maps cần thiết cho TypeScript coverage (`sourceMap: true`, `inlineSources: true`). TypeScript strict mode loại bỏ nhiều branches → coverage % trở nên ít meaningful hơn (tốt thôi). Dead branches từ exhaustive switches cần `/* c8 ignore next */` để tránh false negatives. TypeScript và coverage là complementary tools — không phải substitutes.

---

## Part 9: Interview Q&A / Câu Hỏi Phỏng Vấn

---

### 🟢 Q1: What is the difference between line, branch, statement, and function coverage?

**A:**

All four measure different granularities of code **execution** — not verification.

- **Statement coverage**: Counts AST nodes (expressions, declarations). One line can have multiple statements. `const x = a ? b : c` = one line, two statements.
- **Line coverage**: Counts physical lines. Coarser than statement — misses inline branches.
- **Branch coverage**: Counts all boolean decision paths: every `if/else`, ternary, `&&`, `||`, `switch case`. This is the most important metric for catching untested logic paths.
- **Function coverage**: Whether each function/method was called at all. Useful for dead code detection.

**Priority order**: Branch > Statement > Line > Function (for finding real gaps).

A codebase can show 100% line coverage while having only 50% branch coverage — every line was visited but only one side of each conditional was exercised.

Vietnamese: Cả 4 đều đo execution, không phải correctness. Statement = AST nodes, Line = physical lines, Branch = if/else/ternary paths (quan trọng nhất), Function = callable units called. Priority: Branch > Statement > Line > Function. 100% line coverage có thể coexist với 50% branch coverage.

**💡 Interview Signal:**

- ✅ Strong: Explains that one line can have multiple statements, calls branch coverage the most important, explains that all four are execution metrics not quality metrics
- ❌ Weak: "Line coverage means all lines are tested" — confuses executed with tested

---

### 🟢 Q2: Should you aim for 100% coverage?

**A:**

No — and chasing 100% coverage is a Goodhart's Law trap.

**Why 100% is counterproductive:**

1. The last 5–10% of coverage is exponentially expensive to achieve — it usually requires testing error handling in third-party integrations, unreachable defensive code, and OS-level edge cases.

2. 100% coverage with weak assertions (`expect(result).toBeDefined()`) is meaningless. You can hit 100% without any test actually verifying correct behavior.

3. It creates perverse incentives: developers add test code to cover lines rather than to verify behavior. This fills the codebase with low-value tests that slow CI without improving safety.

**What to aim for instead:**

- Ratchet pattern: never decrease
- Per-module thresholds: critical auth/payment code at 95%, UI components at 60–70%
- Mutation score for high-stakes modules
- Branch coverage above 75% as a reasonable floor

Vietnamese: Không — 100% coverage là trap của Goodhart's Law. Lý do: last 5–10% tốn chi phí exponentially; 100% với weak assertions vô nghĩa; tạo incentive sai (viết test để cover lines, không phải verify behavior). Tốt hơn: ratchet pattern + per-module thresholds + mutation testing cho critical code.

**💡 Interview Signal:**

- ✅ Strong: Names Goodhart's Law, distinguishes executed from verified, suggests alternatives (ratchet, per-module, mutation)
- ❌ Weak: "Yes, 100% is the goal" — demonstrates not understanding what coverage measures

---

### 🟡 Q3: c8 vs Istanbul — which and why?

**A:**

**Default recommendation: c8 (V8 provider)** for modern projects.

**c8 / V8 provider wins when:**

- Project uses ESM modules (c8 handles native ESM without transform)
- CI speed matters (no instrumentation overhead)
- Using Vitest or Node.js 18+ test runner
- Codebase is TypeScript-first with standard transforms

**Istanbul wins when:**

- Existing Jest project with Babel transforms — Istanbul has deeper integration
- Need maximum branch accuracy with legacy transpiled code (decorators, legacy class syntax)
- CJS codebase — Istanbul's transform-based approach handles CJS patterns better
- Team needs the most detailed branch-level reports

**The real difference**: c8 uses V8's built-in coverage which captures what the JS engine actually ran. Istanbul injects counters at AST level during compilation. Istanbul is more deterministic; c8 is faster and ESM-native.

**Gotcha**: c8 can miss coverage for code that's optimized away by V8's JIT compiler in rare edge cases. Istanbul always reports what it injected, regardless of JIT.

Vietnamese: Default recommendation: c8/V8 provider cho projects mới. c8 thắng khi: ESM, CI speed quan trọng, Vitest, TypeScript. Istanbul thắng khi: Jest + Babel legacy, CJS codebase, cần max branch accuracy. Key difference: c8 = V8 built-in API (faster, ESM native); Istanbul = AST injection (slower, more deterministic).

**💡 Interview Signal:**

- ✅ Strong: Explains the mechanism difference (V8 API vs AST injection), gives concrete scenarios for each, mentions ESM as deciding factor
- ❌ Weak: "Use Istanbul because it's more popular" — ignores ESM handling and performance tradeoffs

---

### 🟡 Q4: How do you merge unit and E2E coverage?

**A:**

The workflow has four steps:

**1. Configure each layer to output raw JSON coverage**

- Vitest: `coverage.reporter: ["json"]`, output to `coverage/unit/`
- Playwright: Use `page.coverage.startJSCoverage()` / `stopJSCoverage()`, write to `coverage/e2e/`

**2. Ensure the E2E tests run against an instrumented build**

- For Vite: `VITE_COVERAGE=true` build flag
- For Next.js: requires `@next/bundle-analyzer` or custom webpack instrumentation
- The key: E2E tests hit a build that has coverage counters injected

**3. Merge the JSON files**

```bash
npx nyc merge coverage/unit coverage/e2e coverage/merged
npx nyc report --temp-dir coverage/merged --reporter lcov --reporter html
```

**4. Upload the merged lcov to your coverage service**

```bash
npx codecov --file coverage/final/lcov.info --flags merged
```

**Why this matters**: Unit tests at 80% can miss code paths that only E2E exercises — route guards, authentication flows, error recovery paths, complex user interactions. Merged coverage gives a more honest picture of what's actually tested.

Vietnamese: 4 bước: (1) Mỗi layer output raw JSON — Vitest ra `coverage/unit/`, Playwright ra `coverage/e2e/`. (2) E2E phải chạy trên instrumented build. (3) nyc merge để combine JSON files. (4) Upload merged lcov lên Codecov. Lý do quan trọng: 80% unit coverage có thể miss route guards, auth flows — chỉ E2E mới trigger chúng.

**💡 Interview Signal:**

- ✅ Strong: Knows E2E needs an instrumented build (not just running against any build), names `nyc merge`, explains why merged gives a more accurate picture
- ❌ Weak: "Just run both separately" — doesn't know how to combine them into a single report

---

### 🟡 Q5: Coverage is 95% but a bug shipped. What went wrong?

**A:**

This is the core gotcha question. Three possible root causes:

**Root Cause 1: High coverage, weak assertions**

```ts
// 95% coverage but:
it("processes order", () => {
  const result = processOrder({ items: [], total: -1 });
  expect(result).toBeDefined(); // ← assertion verifies nothing
});
// The bug: negative total should throw, but doesn't
```

**Root Cause 2: Branch not covered by tests**
The 5% uncovered code contained the bug. Coverage was 95% but the specific branch that failed was in the uncovered 5%.

**Root Cause 3: Tests covered the unit but not the integration**
Unit tests mocked the database layer. The bug was a SQL query returning wrong data. 95% unit coverage + zero DB integration test coverage.

**The real lesson**: Coverage is an execution metric, not a quality metric. The gap between "code was executed" and "code was verified correct" is where bugs live.

**What to do**: Add mutation testing to high-stakes modules. Require meaningful assertions (not just `toBeDefined`). Add integration tests that don't mock critical dependencies.

Vietnamese: 3 root causes: (1) Coverage cao nhưng assertions yếu — code chạy qua nhưng không verify output. (2) Bug ở 5% uncovered branch. (3) Unit coverage cao nhưng không có integration coverage — bug ở layer bị mock. Lesson: coverage đo execution, không đo correctness. Gap đó là nơi bugs sống.

**💡 Interview Signal:**

- ✅ Strong: Immediately identifies the "executed vs verified" gap, gives all three root causes, mentions mutation testing as the fix
- ❌ Weak: "We missed a test case" — correct but shallow; doesn't address the fundamental limitation of coverage as a quality metric

---

### 🔴 Q6: Should coverage gate PRs? Defend either side.

**A:**

This is a nuanced debate. Here's the structured argument for both sides:

**For coverage gates:**

- Without gates, coverage silently erodes over time. Teams ship 10 PRs, coverage drops from 80% to 60% without anyone noticing.
- Google's per-diff 60% policy is empirically derived — it catches new code without forcing retrofitting of legacy code.
- Gates force the conversation: "Why is this new code untested?" That conversation has value even if the answer is "it's a config file."

**Against coverage gates (the stronger argument):**

- Coverage measures execution, not quality. A green gate with weak assertions provides false confidence.
- Gates create perverse incentives: developers write tests to hit the number, not to verify behavior. The coverage goes up, the quality doesn't.
- Coverage gates block valid PRs for legitimate reasons: proof-of-concept code, generated files accidentally included in scope, infrastructure changes.
- Better alternative: coverage trends + PR comment (informational, not blocking) + manual investigation of drops.

**My recommended stance** (and the pragmatic industry consensus):

- Use **informational PR comments** (Codecov comment bot) — always show the diff, never block for it
- Use **ratchet rule for the main branch** — no decrease allowed on main via CI
- Use **hard gates only for critical modules** (auth, payments) where the team explicitly agreed
- Never use project-wide hard coverage gate as a quality proxy

Vietnamese: Pro gates: ngăn coverage giảm dần theo thời gian, Google's per-diff 60% có empirical basis. Anti gates (stronger): coverage đo execution không phải quality; gates tạo perverse incentive; block valid PRs. Recommended stance: informational PR comment + ratchet on main + hard gates chỉ cho critical modules. Không bao giờ dùng project-wide gate như quality proxy.

**💡 Interview Signal:**

- ✅ Strong: Argues both sides with specifics, lands on a nuanced position (informational vs blocking), names the perverse incentive problem explicitly
- ❌ Weak: "Yes, gates are good" or "No, gates are bad" — binary answer shows shallow thinking

---

### 🔴 Q7: What is mutation testing and when do you add it?

**A:**

**Mutation testing** is a technique that measures test suite _effectiveness_ — not code execution.

**How it works:**

1. A tool (Stryker) automatically creates hundreds of "mutants" — copies of your code with small semantic changes: `+` becomes `-`, `>` becomes `>=`, `true` becomes `false`, etc.
2. The full test suite runs against each mutant
3. If a mutant causes tests to fail ("killed") → tests are detecting that change
4. If a mutant passes all tests ("survived") → there's a gap in test assertions

**Mutation score** = killed / total × 100%.

```
Example:
function isEligible(age: number) { return age >= 18; }

Mutant 1: return age > 18;    → test with age=18 kills it ✓
Mutant 2: return age >= 17;   → test with age=17 kills it ✓
Mutant 3: return true;        → only killed if test checks false case
```

**When to add it:**

- Authentication and authorization logic
- Payment calculations and pricing rules
- Input validation (form validators, API input sanitizers)
- Public npm packages with SemVer guarantees
- Any code where a subtle logic error causes financial or security impact

**When NOT to add it:**

- Generated code, configuration, thin adapters, UI layout components — mutation testing adds CI time proportional to complexity

**Tooling**: Stryker Mutator (`@stryker-mutator/vitest` or `@stryker-mutator/jest`). Typical CI time: 3–10x longer than normal test run.

Vietnamese: Mutation testing inject lỗi nhỏ vào code (operators, literals, conditions) rồi chạy tests. Nếu tests fail → "killed" (tốt). Nếu tests pass → "survived" (gap). Mutation score = killed / total × 100%. Khi nào dùng: auth, payments, validation, public libs. Khi không dùng: generated code, config, UI layout. Tool: Stryker. CI time tăng 3–10x.

**💡 Interview Signal:**

- ✅ Strong: Explains the killed/survived mechanism clearly, gives concrete mutation examples (operator swap), correctly identifies which code benefits most, knows Stryker
- ❌ Weak: "Mutation testing changes the code to find bugs" — vague, doesn't explain the killed/survived concept

---

### 🔴 Q8: Coverage report shows uncovered branches in TypeScript strict code. Real or false?

**A:**

**Both are possible** — and distinguishing them requires reading the branch.

**Case 1: Real uncovered branch (fix it)**

```ts
async function fetchUser(id: string): Promise<User | null> {
  try {
    return await api.getUser(id);
  } catch (error) {
    // This catch block might be genuinely uncovered
    logger.error("Failed to fetch user", error);
    return null; // ← real uncovered branch — write error test
  }
}
```

**Case 2: TypeScript exhaustive switch — false positive**

```ts
type Status = "active" | "inactive";

function describe(status: Status) {
  switch (status) {
    case "active":
      return "Running";
    case "inactive":
      return "Stopped";
    default:
      // TypeScript proves this is never reached (Status is exhaustive)
      // Coverage tool flags this as uncovered branch
      throw new Error("Impossible");
  }
}
```

Solution for false positives:

```ts
default:
  /* c8 ignore next */
  /* istanbul ignore next */
  throw new Error(`Impossible status: ${status as never}`);
```

**Case 3: Optional chaining false positive**

```ts
function getName(user?: { name: string }) {
  return user?.name ?? "Anonymous";
  // Coverage may flag the undefined branch of ?. as uncovered
}
```

**Rule of thumb**: If TypeScript's type system proves a branch is unreachable (`never` type, exhaustive union, non-nullable after guard), it's a false positive — suppress with ignore comment. If TypeScript doesn't guarantee it's unreachable, write the test.

Vietnamese: Cả hai đều có thể. Case thật: error handlers, unhandled paths → viết test. Case false positive: TypeScript exhaustive switch (default branch typed as never), optional chaining trên non-null types. Cách phân biệt: nếu TypeScript's type system prove branch là unreachable → false positive → dùng `/* c8 ignore next */`. Nếu không → real gap → viết test.

**💡 Interview Signal:**

- ✅ Strong: Distinguishes real vs false positives with concrete examples, knows `/* c8 ignore next */` syntax, explains the TypeScript exhaustive switch pattern
- ❌ Weak: "Increase branch threshold" — addresses the symptom, not the cause

---

### 🔴 Q9: You inherit a 30% coverage codebase. First 90 days plan?

**A:**

**Month 1: Understand, don't fix**

1. Run coverage with `all: true` to see full landscape — what's covered, what's not
2. Identify the 20% of code with the highest business risk (auth, payments, core domain logic)
3. Run mutation testing on high-stakes modules to understand _quality_ of existing tests, not just quantity
4. Interview team: Why is coverage 30%? Time pressure? No testing culture? Legacy migration? Answer changes the plan.
5. Set up trend tracking (Codecov) so you have a baseline

**Month 2: Establish the floor**

1. Add coverage to CI with **informational reporting only** (no gates yet) — build trust
2. Write tests for the 5–10 highest-risk uncovered modules
3. Establish ratchet rule: new code must have ≥ 60% coverage. Don't apply to legacy code yet.
4. Document intentional exclusions — what's excluded and why

**Month 3: Formalize**

1. Set per-module thresholds for critical code (auth: 90%, payments: 95%)
2. Enable PR comment bot — developers see coverage diff without being blocked
3. Optionally: add soft PR gate (warn, don't fail) for code below 60% on new files only
4. Write coverage policy document: what to cover, what to exclude, why

**What NOT to do**:

- Don't immediately set 80% project-wide threshold — triggers test-to-cover-lines behavior
- Don't exclude large modules to hit a better number
- Don't treat legacy code and new code the same way

Vietnamese: 3 tháng: (1) Tháng 1 — understand, không fix ngay. Map landscape, identify high-risk code, run mutation testing, interview team, set up trend tracking. (2) Tháng 2 — establish floor. CI với informational reporting, test 5–10 highest-risk modules, ratchet rule cho code mới. (3) Tháng 3 — formalize. Per-module thresholds, PR comment bot, coverage policy doc. Không: đừng set 80% threshold ngay, đừng exclude để đạt số đẹp.

**💡 Interview Signal:**

- ✅ Strong: Phases the work (understand → floor → formalize), separates legacy vs new code policy, mentions mutation testing for quality assessment, warns against gates before culture is ready
- ❌ Weak: "Set 80% threshold in CI" — this is the wrong first move and will cause pushback and gaming

---

### 🔴 Q10: How do you measure coverage on Next.js Server Components?

**A:**

This is a genuinely hard problem — and honest acknowledgment of the limitation is the right answer.

**The core challenge:**

V8 browser coverage (`page.coverage.startJSCoverage()`) captures JavaScript running in the browser. Next.js Server Components execute in Node.js on the server — they never reach the browser. So standard E2E coverage won't capture them.

**Available approaches:**

**Option 1: Unit test Server Components directly (recommended)**

```ts
// app/dashboard/page.test.tsx
import { render } from "@testing-library/react";
import DashboardPage from "./page";

// Mock server-side dependencies
vi.mock("@/lib/db", () => ({
  getUser: vi.fn().mockResolvedValue({ name: "Test User" }),
}));

it("renders dashboard with user data", async () => {
  const page = await DashboardPage({ params: {} });
  const { getByText } = render(page);
  expect(getByText("Test User")).toBeInTheDocument();
});
```

This works because RSC can be rendered as React trees in Vitest's Node.js environment. Coverage is tracked via Node.js V8 coverage.

**Option 2: Node.js V8 coverage for server-side code**

```bash
node --experimental-vm-modules --coverage \
  node_modules/.bin/vitest run --reporter=verbose
```

**Option 3: Accept the gap, document it**
For teams using Playwright E2E only: explicitly document that server-side coverage is not tracked by E2E tests. Track Server Component coverage via Vitest unit tests separately.

**Option 4: OpenTelemetry + server-side instrumentation**
For production coverage data (rare): use OTel tracing on server-side code paths. Not coverage in the traditional sense, but provides execution path data.

**The honest answer for an interview**: "Server Component coverage requires a different strategy than browser coverage. You need server-side test coverage via unit tests running in Node.js, not E2E browser coverage. The two reports are separate and should be merged if you want a unified view."

Vietnamese: RSC chạy trên Node.js server — V8 browser coverage không capture được. Options: (1) Unit test RSC trực tiếp trong Vitest (chạy Node.js environment) — recommended. (2) Node.js V8 coverage flag. (3) Accept the gap, document rõ ràng. (4) OpenTelemetry cho production. Honest answer: Server và browser coverage là 2 reports riêng biệt, cần merge thủ công.

**💡 Interview Signal:**

- ✅ Strong: Immediately identifies that RSC runs server-side (not browser), knows Vitest can test RSC in Node.js environment, suggests the merge strategy
- ❌ Weak: "Coverage works the same for RSC" — demonstrates not understanding the server/client boundary

---

## Anti-Patterns / Các Anti-Pattern

---

### Anti-Pattern 1: Treating Coverage % as a Quality Signal (Goodhart's Law)

"When a measure becomes a target, it ceases to be a good measure."

```
Scenario: Team sets 80% coverage gate in CI.
Result:
  - Developers write tests that call code without asserting outputs
  - Tests grow in number but don't catch bugs
  - Coverage shows 80%, team feels safe
  - Bug ships because assertion was: expect(fn()).toBeDefined()

Fix: Pair coverage metrics with mutation testing for critical modules.
     Coverage is a signal of "did tests run this code?"
     Not a signal of "are tests correct?"
```

> 🇻🇳 Coverage % là proxy metric, không phải quality metric. Đừng để Goodhart's Law destroy your test suite — once coverage % becomes THE goal, developers optimize the number, not the tests.

---

### Anti-Pattern 2: Adding Tests Just to Bump the Number

```ts
// Anti-pattern: testing getters/setters to hit thresholds
class UserStore {
  private _name = "";
  get name() {
    return this._name;
  } // 2 lines
  set name(v: string) {
    this._name = v;
  } // 2 lines
}

// "Coverage test" — increases % without value
it("gets and sets name", () => {
  const store = new UserStore();
  store.name = "test";
  expect(store.name).toBe("test"); // covers 4 lines easily
});

// Meanwhile: complex business logic in processOrder() has zero tests
```

**Fix**: Prioritize coverage for complex conditional logic and business rules. Don't award equal weight to trivial getters and critical payment calculations.

> 🇻🇳 Test để cover lines thay vì verify behavior = technical debt. Một test kiểm tra payment logic đúng giá trị hơn 10 tests cover getters/setters.

---

### Anti-Pattern 3: Excluding Files to Game the Number

```ts
// Anti-pattern: excluding real business logic
coverage: {
  exclude: [
    "src/utils/**", // "too complex to test right now"
    "src/api/**", // "mocked in E2E anyway"
    "src/store/**", // "tested manually"
    "src/auth/**", // ← DANGER: auth is most critical!
  ];
}
```

**Fix**: Only exclude genuinely non-testable code: generated files, type declarations, config files, test infrastructure. Document every exclusion with a reason.

> 🇻🇳 Exclude real logic để đạt số đẹp = false sense of security. Worst case: auth code bị exclude và có security bug.

---

### Anti-Pattern 4: Same Threshold for Legacy and New Code

```
Scenario:
- Legacy codebase: 200K LOC, 30% coverage — 10 years of tech debt
- New service: 5K LOC, being written now

Setting project-wide 80% threshold blocks ALL new work
until legacy code is covered — which takes months.

Better approach:
  - Legacy code: ratchet (don't decrease from current 30%)
  - New code: per-file gate (≥ 60% for new files added in PR)
  - Critical new modules: 90%+ per-module threshold
```

**Fix**: Use Codecov's "patch" status (coverage of changed lines only) for new code gates. Leave legacy code under ratchet only.

> 🇻🇳 Legacy và new code cần policies khác nhau. Project-wide threshold áp cho legacy code tạo bottleneck. Per-diff hoặc per-patch thresholds cho new code là approach đúng.

---

### Anti-Pattern 5: Coverage as PR Gate Without Trend Analysis

```
Scenario:
- Coverage gate: must be ≥ 80%
- Developer adds generated code → coverage drops to 79.8%
- PR blocked
- Developer excludes generated code → coverage 80.1%
- PR merged
- No one learned anything about test quality

Better: Coverage trend + informational comment
  PR comment: "Coverage changed: 80.2% → 79.8% (-0.4%)
               Files with decreased coverage: UserAuth.ts (-12%)"
  → No block, but team reviews the AuthUser.ts decrease
```

**Fix**: Use PR comments as informational signals, not as gates. Reserve hard gates for specific per-module thresholds on critical code.

> 🇻🇳 Coverage gate without trend analysis là blunt instrument. PR block vì 0.2% drop = developer frustration với zero quality benefit. PR comment showing which specific files dropped = actionable signal.

---

## Memory Hook / Ghi Nhớ

**Coverage = "Did the code run?" — Not "Did the code work?"**

```
C — Covered doesn't mean Correct
O — Only branch coverage catches conditional gaps
V — Verified by assertions, not by execution
E — Exclude generated code, never business logic
R — Ratchet rule: never decrease
A — Aggregate (merge unit + E2E for full picture)
G — Gate sparingly: trends over thresholds
E — Exhaustive TS switches need /* c8 ignore next */
```

> 🇻🇳 **Memory hook**: "Coverage đo **đường đi**, không đo **kết quả đúng**." Mutation testing đo kết quả. Pair chúng lại cho critical code.

---

## Q&A Summary Table / Bảng Tóm Tắt Q&A

| #   | Difficulty | Topic                 | Key Insight                                                           | Interview Signal                           |
| --- | ---------- | --------------------- | --------------------------------------------------------------------- | ------------------------------------------ |
| Q1  | 🟢         | 4 coverage metrics    | Branch > Statement > Line > Function importance                       | ✅ Explains executed vs verified           |
| Q2  | 🟢         | 100% coverage?        | No — Goodhart's Law, weak assertions problem                          | ✅ Names specific alternatives             |
| Q3  | 🟡         | c8 vs Istanbul        | c8 = V8 native (fast, ESM); Istanbul = AST (accurate, slower)         | ✅ Explains mechanism difference           |
| Q4  | 🟡         | Merging coverage      | nyc merge + instrumented E2E build + upload merged lcov               | ✅ Knows instrumented build requirement    |
| Q5  | 🟡         | 95% coverage + bug    | Executed ≠ verified; weak assertions; integration gap                 | ✅ Immediately names executed/verified gap |
| Q6  | 🔴         | Coverage as gate?     | Informational > blocking; ratchet on main; gates for critical modules | ✅ Argues both sides, lands nuanced        |
| Q7  | 🔴         | Mutation testing      | killed/survived mechanism; Stryker; auth/payment use cases            | ✅ Explains killed/survived correctly      |
| Q8  | 🔴         | TS uncovered branches | Real vs false positive; exhaustive switch = false positive            | ✅ Distinguishes with concrete examples    |
| Q9  | 🔴         | 30% coverage plan     | 90-day phased: understand → floor → formalize; legacy ≠ new           | ✅ Separates legacy vs new code policy     |
| Q10 | 🔴         | RSC coverage          | Server-side = Node.js Vitest; browser = V8 coverage; merge both       | ✅ Identifies server/browser boundary      |

---

## Cold Call Simulation / Mô Phỏng Cold Call

**Interviewer**: "What's wrong with requiring 80% coverage before merging?"

**Your answer structure** (30 seconds):

> "The core problem is that coverage measures _execution_, not _correctness_. You can hit 80% with `expect(result).toBeDefined()` on every test — the code runs, but nothing verifies the output. This creates a perverse incentive: developers optimize the coverage number, not the test quality. A better approach is informational coverage reporting on PRs — show the diff, don't block on it — combined with stricter per-module gates only for genuinely critical code like auth or payments. And pair coverage with mutation testing for those critical modules to actually measure whether tests catch bugs."

**Interviewer follow-up**: "Stripe ignores branch coverage entirely. Is that reasonable?"

> "It's reasonable _if_ they've replaced it with a better signal — which Stripe did by tracking mutation score instead. Mutation score measures whether tests actually detect behavioral changes, not just whether code paths were traversed. Branch coverage can be gamed; mutation score is much harder to fake. For most teams that don't have Stripe's testing infrastructure, tracking branch coverage as a trend (not a gate) is still useful — it surfaces code that's never exercised. But Stripe's stance reinforces the core point: the number matters less than what the number tells you."

---

## Self-Check / Tự Kiểm Tra

Sau khi đọc xong bài này, bạn nên trả lời được:

- [ ] Giải thích sự khác biệt giữa statement, branch, function, line coverage với ví dụ code cụ thể
- [ ] Tại sao 100% coverage không đảm bảo zero bugs? Đưa ra ví dụ về weak assertion
- [ ] Khi nào chọn c8, khi nào chọn Istanbul? (ESM support, speed, branch accuracy)
- [ ] Tại sao cần merge unit + E2E coverage? Workflow 4 bước là gì?
- [ ] Viết `vitest.config.ts` với v8 provider, thresholds, và exclude patterns đúng
- [ ] Giải thích mutation testing với ví dụ killed vs survived mutant
- [ ] Khi nào nên dùng hard coverage gate? Khi nào chỉ dùng informational comment?
- [ ] Tại sao TypeScript exhaustive switch tạo false positive trong coverage? Cách fix?
- [ ] Plan 90 ngày cho codebase 30% coverage — 3 phases là gì?
- [ ] Tại sao Server Components cần chiến lược coverage riêng biệt?

**Scoring**:

- 9–10: Ready to discuss coverage at any seniority level
- 7–8: Solid junior-mid level; practice the senior questions (Q6–Q10)
- 5–6: Review Parts 6–8 (mutation testing, TypeScript, CI strategy)
- < 5: Start from "What Coverage Actually Measures" section

---

_Last updated: 2026-05 | Source: Frontend Masters Handbook 2024 §6.13 + c8/Vitest/Playwright/Stryker 2025–2026 docs_
