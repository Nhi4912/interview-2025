# Visual Regression Testing / Kiểm Thử Hồi Quy Giao Diện

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md) · [Browser Performance README](./README.md) · [Frontend Testing Strategy](./06-frontend-testing-strategy.md) · [Frontend Testing](../14-frontend-testing.md) · [Design Systems](../08-fe-system-design/09-design-systems.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Interviewer hỏi: _"Tests pass, CI is green, you deploy — and 10 minutes later users are filing tickets saying the primary button looks broken. What happened?"_

Đây là câu chuyện xảy ra với hàng chục design system teams mỗi tháng. Unit tests, integration tests — tất cả đều pass. Nhưng một font-weight thay đổi từ `600` sang `400` trong CSS file. Một `border-radius` bị flatten do utility class collision. Một dark mode token được refactor nhầm, làm text đen trên nền đen.

**Tests pass. Button looks broken in production.**

Đây chính xác là khoảng trống mà **visual regression testing** lấp đầy.

Thực tế của các teams lớn:

- **Shopify Polaris** chạy Chromatic trên mỗi PR, capturing hơn **10,000 snapshots** mỗi lần. Mỗi component có story riêng — không có PR nào merge nếu visual diff chưa được review và approve.
- **GitHub Primer** (design system) có dedicated visual review workflow: mỗi component change tạo ra screenshot diff được đính kèm vào PR, reviewer approve hoặc reject inline trên Chromatic UI.
- **Atlassian Design System** bắt được CSS regressions **trước khi** PR được merge — không phải sau khi reviewer nhìn thấy. Đây là "visual tests as gate", không phải visual tests as documentation.
- **Storybook team** tự dogfood Chromatic để test chính Storybook UI — sản phẩm test chính công cụ test của nó.

Điểm then chốt: visual regression testing không phải là luxury feature dành cho big companies. Nó là safety net cho bất kỳ team nào release UI mà không muốn tự tay click qua mọi component sau mỗi CSS change.

> 🇻🇳 **Tóm tắt**: Visual regression testing bắt các lỗi UI mà unit/integration tests bỏ qua — CSS regressions, font changes, theme breaks. Shopify, GitHub, Atlassian đều chạy hàng chục nghìn visual snapshots trên mỗi PR. "Tests pass nhưng button trông bị vỡ" là lý do category này tồn tại.

---

## What & Why / Cái Gì & Tại Sao

**Visual regression testing** = tự động capture screenshot (hoặc DOM snapshot) của component/page → so sánh với **baseline** đã được approve trước đó → fail nếu có sự khác biệt vượt ngưỡng.

### Cái Gì Unit/Integration Tests Bỏ Qua

```
Unit test:
  expect(button).toHaveTextContent('Submit')    ✅ passes
  expect(button).toBeInTheDocument()            ✅ passes
  expect(button).toBeEnabled()                  ✅ passes

Reality:
  button.style.fontSize  = "0px"               ← invisible text — test passes!
  button.style.color     = "white"             ← same as background — test passes!
  button.style.opacity   = "0"                 ← hidden — test passes!
  @font-face failed      = system fallback      ← layout broken — test passes!
```

**Những gì unit tests không bắt được:**

| Category              | Ví dụ thực tế                                                               |
| --------------------- | --------------------------------------------------------------------------- |
| CSS regressions       | Utility class override làm mất `padding`, `margin`, `border-radius`         |
| Font swap             | Web font load fail → fallback font → layout shift, text overflow            |
| Theme breaks          | Dark mode token refactor → text invisible                                   |
| RTL layout            | Arabic/Hebrew — flex direction, text alignment, icon mirroring              |
| Dark mode rendering   | Component designed for light only, dark mode leaves contrast ratio at 1:1   |
| Container query break | Component at 320px width triggers breakpoint, layout collapses unexpectedly |
| Animation freeze      | CSS animation stuck at frame 0 because timing function changed              |
| Z-index wars          | Dropdown renders under modal because stacking context changed               |
| Density regressions   | Spacing tokens changed globally, entire info density of UI shifts           |

**Unit tests kiểm tra logic. Visual tests kiểm tra outcome.**

> 🇻🇳 **Tóm tắt**: Unit tests verify behavior — "button có disabled không?". Visual tests verify appearance — "button trông như thế nào khi disabled?". Hai loại kiểm tra không thay thế nhau. CSS regression là loại bug phổ biến nhất mà chỉ visual tests mới bắt được.

---

## Concept Map / Bản Đồ Khái Niệm

```
VISUAL REGRESSION TESTING PIPELINE
│
├── 1. CAPTURE
│   ├── Component (Storybook story) → isolated render
│   ├── Page (URL) → full browser render
│   └── Flow step (E2E + screenshot at step N)
│
├── 2. RENDER (Browser Engine)
│   ├── Cloud (Chromatic, Percy, Argos) → headless Chrome on vendor infra
│   ├── Local (Playwright, Backstop) → headless Chrome on CI runner
│   └── Cross-browser (BrowserStack, Sauce) → real browser VMs
│
├── 3. SNAPSHOT
│   ├── PNG pixel snapshot (Playwright toHaveScreenshot, Backstop)
│   └── DOM/CSS snapshot (Chromatic storybook AST)
│
├── 4. DIFF
│   ├── Pixel diff → compare PNG arrays, flag changed pixels
│   │   ├── Threshold: 0.1% = strict, 2% = lenient
│   │   └── Anti-alias zone exclusions
│   ├── DOM diff → compare component tree + computed styles
│   │   └── Less flaky, misses pure CSS changes
│   └── Hybrid (Chromatic) → both pixel + semantic diff
│
├── 5. REVIEW
│   ├── Auto-approve: change < threshold → no human needed
│   ├── Human review: change > threshold → PR comment/UI review
│   └── Bulk approve: intentional design system change
│
└── 6. BASELINE UPDATE
    ├── Accept: "this change is intended" → new baseline
    ├── Reject: "this is a bug" → PR fails
    └── Ignore: "noise from flaky source" → mask region
```

---

## Part 1: Pixel-Diff vs DOM-Diff vs Hybrid / Ba Phương Pháp So Sánh

### 1.1 Pixel Diff

Pixel-diff so sánh hai PNG ảnh pixel-by-pixel. Nếu pixel tại tọa độ (x, y) khác nhau hơn ngưỡng → diff được flag.

**Ưu điểm:**

- Bắt được **mọi** visual change — kể cả CSS-only, font, shadow, antialiasing
- Không phụ thuộc vào DOM structure — component có thể dùng canvas, SVG, WebGL

**Nhược điểm:**

- **Font hinting** khác nhau giữa OS → same font render khác trên Linux CI vs macOS local
- **GPU rendering** — antialiasing hơi khác tùy hardware và driver version
- **Sub-pixel rendering** — 1–2 pixel shift do text kerning, không phải bug thực
- **Dynamic content** — timestamp, avatar URL, random ID gây ra constant diff

**Ví dụ flake:**

```bash
# Same component, same code — different OS = different snapshot
macOS:  button text at pixel (8, 12) = rgb(255, 255, 255)
Linux:  button text at pixel (8, 12) = rgb(254, 255, 255)  ← 1-off antialiasing
# Result: pixel diff flag → false positive
```

**Khi nào dùng pixel diff:**

- Khi cần catch visual regressions ở mức absolute (e-commerce product images, marketing banners)
- Khi rendering environment được standardize (same Docker image, same Chrome version)
- Playwright `toHaveScreenshot` với `--update-snapshots` workflow

### 1.2 DOM Diff

DOM-diff capture component tree + computed CSS styles, so sánh structural và style changes.

**Ưu điểm:**

- Không bị ảnh hưởng bởi font hinting, GPU rendering, subpixel antialiasing
- Diffs dễ đọc hơn: "padding-left changed from 8px to 4px" thay vì "1203 pixels changed"
- Nhanh hơn — không cần render full PNG

**Nhược điểm:**

- Bỏ qua pure visual changes nếu CSS values vẫn giống nhau:
  ```css
  /* Old: */     background: linear-gradient(#fff, #f0f0f0);
  /* New: */     background: linear-gradient(#fff, #e8e8e8); ← same DOM structure, different render
  ```
- Không bắt được: canvas rendering, SVG fill differences, pseudo-element visual changes
- Không phản ánh compositing, z-index rendering order

**Khi nào dùng DOM diff:**

- Component libraries với stable DOM structure
- Khi false positive rate của pixel diff quá cao
- Snapshot testing với Jest + serializer (limited visual coverage)

### 1.3 Hybrid (Chromatic Model)

Chromatic kết hợp cả hai: DOM structure diff để filter noise + pixel comparison cho meaningful changes.

```
Chromatic algorithm:
1. Render story in headless Chrome → capture PNG
2. Extract DOM/CSS structure → compare semantically
3. If DOM diff shows structural change → require human review
4. If DOM same but pixel diff > 0 → analyze: is it font/rendering noise?
5. TurboSnap: if file dependency graph shows no changes affecting this story → skip snapshot
```

**TurboSnap** là feature quan trọng: Chromatic trace file dependencies, chỉ re-snapshot stories có component files thay đổi. 10,000 snapshot project có thể chỉ chạy 200 snapshots trên một PR nếu change scope nhỏ.

> 🇻🇳 **Tóm tắt**: Pixel diff bắt mọi thứ nhưng flaky. DOM diff stable nhưng bỏ qua CSS-only changes. Hybrid (Chromatic) dùng cả hai — DOM để loại bỏ rendering noise, pixel để bắt real changes. TurboSnap tối ưu hóa bằng cách chỉ chạy lại snapshots cho files thực sự thay đổi.

---

## Part 2: Tool Comparison Matrix / Bảng So Sánh Công Cụ

| Tool                              | Paradigm   | Runs Against                 | Renders On           | Browser Coverage                | Cost Model                           | When To Choose                                             |
| --------------------------------- | ---------- | ---------------------------- | -------------------- | ------------------------------- | ------------------------------------ | ---------------------------------------------------------- |
| **Chromatic**                     | Hybrid     | Storybook stories            | Cloud (vendor infra) | Chrome (+ Firefox add-on)       | 10K snapshots/mo free; $149/mo → 35K | Design systems, component libraries, Storybook-first teams |
| **Percy (BrowserStack)**          | Pixel diff | Web app / Storybook          | Cloud (vendor)       | Chrome, Firefox, Safari         | Declining; acquired 2023, pricing ↑  | Legacy projects; prefer Argos for new                      |
| **Playwright `toHaveScreenshot`** | Pixel diff | Playwright test suite        | Local / CI runner    | Chrome, Firefox, Safari, WebKit | Free (self-hosted)                   | App flows, pages, E2E visual gates — no vendor dependency  |
| **Argos CI**                      | Pixel diff | Any (CI screenshots)         | Cloud review         | Any browser you render          | Free tier 5K/mo; $30/mo → 20K        | Middle ground: cloud review UI + bring-your-own runner     |
| **Lost Pixel**                    | Pixel diff | Storybook / Ladle / Histoire | Local / CI Docker    | Chromium                        | Open source (self-hosted)            | Full control, no vendor costs, Docker-based CI             |
| **Reg-suit**                      | Pixel diff | Any screenshots              | Local                | Any                             | Open source (self-hosted)            | Teams with existing screenshot gen, want diff reporting    |
| **Loki**                          | Pixel diff | Storybook                    | Local Docker         | Chrome, Firefox                 | Open source (self-hosted)            | CI-integrated Storybook visual testing on budget           |
| **Backstop.js**                   | Pixel diff | Web pages (URLs)             | Local headless       | Chrome                          | Open source (self-hosted)            | Legacy page-level regression; heavy config overhead        |

**Status note on Percy**: BrowserStack acquired Percy in 2021. As of 2025, active development has slowed, pricing tiers have shifted upward, and the DX has not kept pace with Chromatic or Argos. For new projects, Argos CI is the recommended Percy alternative.

**Chromatic vs Playwright `toHaveScreenshot` — one-liner decision:**

```
Chromatic    → component-level, Storybook-first, cloud review UI, design system teams
Playwright   → page/flow-level, E2E-integrated, self-hosted, no vendor lock-in
```

> 🇻🇳 **Tóm tắt**: Chromatic là lựa chọn hàng đầu cho design systems với Storybook. Playwright `toHaveScreenshot` là lựa chọn free, self-hosted cho app pages và E2E flows. Argos CI là middle ground. Percy đang decline — tránh dùng cho dự án mới. Backstop là legacy option.

---

## Part 3: Where Snapshots Live — 4 Strategies / 4 Chiến Lược Đặt Snapshot

### Strategy 1: Per-Component (Storybook + Chromatic)

**Best for**: Design systems, component libraries, shared UI packages.

Mỗi Storybook story = một visual test case. Snapshot isolated component ở mọi state.

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  component: Button,
  // Chromatic story-level config
  parameters: {
    chromatic: {
      // Capture at multiple viewports
      viewports: [320, 768, 1280],
      // Disable CSS animations for stable snapshots
      disableSnapshot: false,
    },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = { args: { children: "Submit", variant: "primary" } };
export const Disabled: Story = { args: { children: "Submit", variant: "primary", disabled: true } };
export const Loading: Story = {
  args: { children: "Submit", variant: "primary", loading: true },
  parameters: {
    chromatic: { delay: 300 }, // wait for spinner animation
  },
};
export const DarkMode: Story = {
  args: { children: "Submit", variant: "primary" },
  parameters: {
    backgrounds: { default: "dark" },
    chromatic: { theme: "dark" },
  },
};
```

**Tradeoffs:**

- ✅ Fast feedback per component — catch regression in the component that owns it
- ✅ Isolated rendering — no page-level noise
- ✅ Scales to thousands of stories with TurboSnap
- ❌ Doesn't catch page-level composition bugs (components that look fine in isolation, broken together)
- ❌ Requires Storybook setup — cost to maintain stories for every state

---

### Strategy 2: Per-Page (Playwright on URLs)

**Best for**: Marketing sites, landing pages, documentation, page-level layout validation.

```typescript
// tests/visual/marketing.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Marketing pages visual regression", () => {
  test("homepage matches snapshot", async ({ page }) => {
    await page.goto("/");
    // Wait for fonts and images to load
    await page.waitForLoadState("networkidle");
    // Hide dynamic content (date, user-specific banners)
    await page.evaluate(() => {
      document.querySelectorAll('[data-testid="dynamic-content"]').forEach((el) => {
        (el as HTMLElement).style.visibility = "hidden";
      });
    });
    await expect(page).toHaveScreenshot("homepage.png", {
      fullPage: true,
      // Mask dynamic regions instead of hiding them
      mask: [page.locator('[data-testid="timestamp"]')],
      animations: "disabled",
      // 0.1% pixel threshold — strict for marketing pages
      maxDiffPixelRatio: 0.001,
    });
  });

  test("pricing page at mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/pricing");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("pricing-mobile.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});
```

**Tradeoffs:**

- ✅ Tests real page composition — header + hero + footer all at once
- ✅ No Storybook required
- ❌ Slow to run (full browser render per page)
- ❌ Hard to pinpoint which component caused regression
- ❌ Dynamic content (banners, A/B tests) requires masking strategy

---

### Strategy 3: Per-Flow (E2E + Screenshot at Steps)

**Best for**: App journeys — checkout flows, onboarding, multi-step forms.

```typescript
// tests/visual/checkout-flow.spec.ts
import { test, expect } from "@playwright/test";

test("checkout flow visual regression", async ({ page }) => {
  await page.goto("/cart");
  await expect(page.locator("#checkout-summary")).toHaveScreenshot("checkout-step-1-cart.png", {
    animations: "disabled",
  });

  await page.click('[data-testid="proceed-to-payment"]');
  await page.waitForSelector('[data-testid="payment-form"]');
  await expect(page.locator("#payment-container")).toHaveScreenshot("checkout-step-2-payment.png", {
    animations: "disabled",
    // Mask credit card number input to avoid storing sensitive data in snapshots
    mask: [page.locator('[name="card-number"]'), page.locator('[name="cvv"]')],
  });

  // Fill and submit
  await page.fill('[name="card-number"]', "4242 4242 4242 4242");
  await page.click('[data-testid="submit-payment"]');
  await page.waitForSelector('[data-testid="confirmation"]');
  await expect(page.locator("#confirmation-screen")).toHaveScreenshot(
    "checkout-step-3-confirmation.png",
    {
      animations: "disabled",
      mask: [page.locator('[data-testid="order-id"]')], // dynamic order ID
    },
  );
});
```

**Tradeoffs:**

- ✅ Tests real user journey at each step
- ✅ Catches interaction-triggered visual states (hover, focus, error)
- ❌ Most expensive — slow, requires test data setup
- ❌ Network/auth state makes it fragile — needs careful isolation
- ❌ Hardest to update baselines when design changes

---

### Strategy 4: Hybrid (Component + Critical Pages)

**Best for**: Product teams with a design system AND a real application.

```
Tier 1: All design system components → Chromatic (Storybook)
         ~500 stories, runs in ~3 min with TurboSnap
         Catches: component-level regressions

Tier 2: Critical pages (homepage, dashboard, checkout) → Playwright per-page
         ~15 pages, runs in ~5 min
         Catches: page composition regressions

Tier 3: Critical flows (signup, checkout, key user journey) → Playwright per-flow
         ~5 flows × ~3 steps = 15 snapshots, runs in ~4 min
         Catches: flow-state visual regressions
```

**Total CI budget**: ~12 minutes for comprehensive visual coverage.

> 🇻🇳 **Tóm tắt**: 4 chiến lược — per-component (Storybook + Chromatic cho design systems), per-page (Playwright cho marketing/docs), per-flow (E2E + screenshot cho app journeys), hybrid (kết hợp tất cả). Hybrid là lựa chọn tối ưu cho product teams.

---

## Part 4: Flakiness Sources & Mitigation / Nguồn Gây Flaky và Cách Xử Lý

Flakiness là vấn đề số một của visual testing. Một test flaky không đáng tin cậy còn nguy hiểm hơn không có test.

### 4.1 Font Loading Race

**Vấn đề**: Web font chưa load → system fallback font → khác metrics → layout shift.

```typescript
// BAD: screenshot before fonts ready
await page.goto("/");
await expect(page).toHaveScreenshot(); // may capture with system font

// GOOD: wait for fonts
await page.goto("/");
await page.evaluate(() => document.fonts.ready);
await expect(page).toHaveScreenshot();
```

```typescript
// Playwright config — force font loading wait globally
// playwright.config.ts
export default defineConfig({
  use: {
    // Run before every snapshot
    actionTimeout: 10_000,
  },
});

// Per-test helper
async function waitForFonts(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  // Additional 100ms buffer for font-dependent layout paint
  await page.waitForTimeout(100);
}
```

### 4.2 CSS Animations

**Vấn đề**: Screenshot mid-animation = inconsistent frame capture.

```typescript
// Playwright: disable all animations globally
await expect(page).toHaveScreenshot({
  animations: "disabled", // Playwright injects CSS to freeze animations
});
```

```css
/* Or inject CSS to freeze all animations in test env */
*,
*::before,
*::after {
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}
```

```typescript
// Storybook + Chromatic: disable animations in story
export const AnimatedButton: Story = {
  parameters: {
    chromatic: {
      pauseAnimationAtEnd: true, // Chromatic-specific
    },
  },
};
```

### 4.3 Dynamic Content

**Vấn đề**: Timestamp, user avatar, random generated IDs, A/B test variants → constant diff.

```typescript
// Mask dynamic regions
await expect(page).toHaveScreenshot({
  mask: [
    page.locator('[data-testid="timestamp"]'),
    page.locator('[data-testid="user-avatar"]'),
    page.locator('[data-testid="order-id"]'),
    page.locator(".ab-test-banner"),
  ],
});
```

```typescript
// Or replace with stable content before snapshot
await page.evaluate(() => {
  document.querySelectorAll("[data-dynamic]").forEach((el) => {
    (el as HTMLElement).innerText = "REDACTED";
  });
});
```

### 4.4 Viewport and Scale

**Vấn đề**: Device pixel ratio (DPR) khác nhau giữa machines.

```typescript
// Normalize DPR in Playwright config
// playwright.config.ts
export default defineConfig({
  use: {
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1, // force 1x DPR — no retina scaling
  },
});

// Playwright toHaveScreenshot option
await expect(page).toHaveScreenshot({
  scale: "css", // use CSS pixels, not device pixels — more stable
});
```

### 4.5 Iframe Rendering

**Vấn đề**: Iframe content renders asynchronously → snapshot before content paints.

```typescript
// Wait for iframe content
const frame = page.frameLocator('iframe[title="embedded-widget"]');
await frame.locator('[data-testid="widget-loaded"]').waitFor();
await expect(page).toHaveScreenshot();
```

### 4.6 GPU vs CPU Rendering

**Vấn đề**: Headless Chrome trên CI Linux runner render shadows/gradients khác local Chrome trên macOS.

```bash
# Force software rendering to normalize across environments
chromium --disable-gpu --disable-software-rasterizer
```

```typescript
// Playwright: disable GPU in launch options
// playwright.config.ts
export default defineConfig({
  use: {
    launchOptions: {
      args: ["--disable-gpu", "--disable-dev-shm-usage"],
    },
  },
});
```

### Anti-Flake Checklist

```typescript
// Complete anti-flake Playwright snapshot config
await expect(page).toHaveScreenshot("component.png", {
  // Scale: use CSS pixels (stable across DPR)
  scale: "css",
  // Animations: disabled (freeze at time 0)
  animations: "disabled",
  // Threshold: 0.1% for strict, 1% for lenient
  maxDiffPixelRatio: 0.001,
  // Clip: only snapshot the component, not full viewport
  clip: { x: 0, y: 0, width: 400, height: 300 },
  // Mask: hide dynamic regions
  mask: [page.locator('[data-testid="timestamp"]')],
});
```

> 🇻🇳 **Tóm tắt**: 6 nguồn flakiness chính — font loading race, CSS animations, dynamic content, viewport/DPR scaling, iframe async rendering, GPU vs CPU rendering. Giải pháp: `document.fonts.ready`, `animations: 'disabled'`, `mask` cho dynamic content, `scale: 'css'`, `deviceScaleFactor: 1`, và `--disable-gpu` trên CI.

---

## Part 5: CI Integration / Tích Hợp CI

### 5.1 Branch Baseline Workflow

```
main branch:
  ├── Run visual tests → all pass → update baseline
  └── Baselines stored: cloud (Chromatic/Argos) or git (Playwright)

PR branch:
  ├── Run visual tests vs main baseline
  ├── Diff detected → PR fails or requires review
  ├── Review: "intended change?" → Accept → new baseline on merge
  └── Review: "regression?" → Reject → PR blocked
```

### 5.2 GitHub Actions — Playwright Visual Tests

```yaml
# .github/workflows/visual-regression.yml
name: Visual Regression Tests

on:
  pull_request:
    branches: [main]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install chromium --with-deps

      - name: Run visual regression tests
        run: npx playwright test tests/visual/
        env:
          CI: true

      # Upload snapshots as artifact for review on failure
      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-snapshots
          path: test-results/
          retention-days: 7

      # Update baselines — only on push to main
      - name: Update baselines (main only)
        if: github.ref == 'refs/heads/main'
        run: npx playwright test tests/visual/ --update-snapshots
```

### 5.3 Chromatic CI Integration

```yaml
# .github/workflows/chromatic.yml
name: Chromatic Visual Tests

on:
  push:
    branches: [main, "feature/**"]

jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Required for TurboSnap

      - run: npm ci

      - name: Run Chromatic
        uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          # TurboSnap: only re-test changed stories
          onlyChanged: true
          # Auto-accept changes on main branch (baseline update)
          autoAcceptChanges: "main"
          # Exit with error code on unreviewed changes
          exitZeroOnChanges: false
```

### 5.4 Chromatic Config File

```json
// chromatic.config.json
{
  "projectId": "prj_abc123",
  "onlyChanged": true,
  "buildScriptName": "build-storybook",
  "storybookBuildDir": "storybook-static",
  "exitZeroOnChanges": false,
  "autoAcceptChanges": "main",
  "skip": "dependabot/**",
  "externals": ["public/**"],
  "traceChanged": "expanded"
}
```

### 5.5 Monorepo — Affected Snapshots Only

```yaml
# Only run visual tests for changed packages
- name: Get changed packages
  id: changes
  run: |
    CHANGED=$(npx nx affected --target=visual-test --plain)
    echo "packages=$CHANGED" >> $GITHUB_OUTPUT

- name: Run visual tests for affected packages
  run: npx nx run-many --target=visual-test --projects=${{ steps.changes.outputs.packages }}
```

### 5.6 Vercel + Chromatic Deploy Preview Integration

```bash
# In Vercel deploy hook (or GitHub Action triggered by Vercel)
# After preview deployment, run Chromatic against the preview URL
npx chromatic \
  --storybook-url="$VERCEL_PREVIEW_URL/storybook" \
  --project-token="$CHROMATIC_PROJECT_TOKEN" \
  --auto-accept-changes
```

> 🇻🇳 **Tóm tắt**: CI workflow cơ bản — main branch update baseline, PR branch compare vs baseline. Chromatic dùng `autoAcceptChanges: 'main'` để tự update baseline khi merge. TurboSnap (`onlyChanged: true`) giảm drastically số snapshots cần chạy. Monorepo dùng affected packages detection để chỉ test packages có thay đổi.

---

## Part 6: Cost Reality / Thực Tế Chi Phí

### 6.1 Chromatic Pricing (2025)

| Plan       | Snapshots/month | Price/month | Per extra 1K snaps |
| ---------- | --------------- | ----------- | ------------------ |
| Free       | 10,000          | $0          | —                  |
| Starter    | 35,000          | $149        | ~$4.26/K           |
| Business   | 75,000          | $299        | ~$3.99/K           |
| Enterprise | Unlimited       | Custom      | —                  |

**Thực tế**: Shopify Polaris với 10K+ snapshots/PR, merge 10–20 PRs/day → 100K–200K snapshots/month → Enterprise tier. Typical design system team (1–2 PRs/day, 500 stories) → ~30K snapshots/month → Starter hoặc Business.

### 6.2 Argos CI Pricing (2025)

| Plan        | Screenshots/month | Price/month |
| ----------- | ----------------- | ----------- |
| Open source | Unlimited         | Free        |
| Free        | 5,000             | $0          |
| Starter     | 20,000            | $30         |
| Pro         | 60,000            | $80         |

Argos là **middle ground** tốt nhất: cloud review UI + bring-your-own screenshot pipeline (Playwright, Cypress, Puppeteer).

### 6.3 Percy (BrowserStack) — Status 2025

Percy sau khi bị BrowserStack acquire đã dịch chuyển từ developer-friendly pricing sang enterprise sales. Free tier đã bị thu hẹp đáng kể. Cho dự án mới, Argos CI là khuyến nghị thay thế.

### 6.4 Playwright (Self-Hosted) — True Cost

```
Direct cost: $0 (open source)

Hidden costs:
├── CI runner time: ~$0.008/min (GitHub Actions)
│   Example: 10 visual tests × 30s each = 5min × $0.008 = $0.04/run
│   100 runs/month = $4/month CI cost
├── Snapshot storage: git LFS ~$5/month for large baseline repos
├── Maintenance: flaky test debugging, baseline management
└── Engineer time: ~2–4h/month for false positive management
```

### 6.5 Cost Per Snapshot — Comparison

| Tool                      | $/1K snapshots | Notes                               |
| ------------------------- | -------------- | ----------------------------------- |
| Chromatic Free            | $0             | Up to 10K/month                     |
| Chromatic Starter         | ~$4.26         | After free tier                     |
| Argos Free                | $0             | Up to 5K/month                      |
| Argos Starter             | ~$1.50         | After free tier                     |
| Playwright (CI cost only) | ~$0.16         | Based on $0.008/min, 20s/screenshot |
| Percy (BrowserStack)      | ~$5–$10+       | Pricing opaque post-acquisition     |

**Recommendation by team size:**

```
Solo / small team (<5K snapshots/mo):  Chromatic Free or Argos Free
Mid-size team (5K–30K/mo):            Argos Starter ($30/mo) or Chromatic Free+Starter
Large design system (30K+/mo):        Chromatic Business or self-hosted Lost Pixel/Reg-suit
Pure E2E visual tests:                 Playwright (free, self-hosted)
```

> 🇻🇳 **Tóm tắt**: Chromatic miễn phí đến 10K snapshots/tháng — đủ cho hầu hết design systems nhỏ-vừa. Argos CI rẻ hơn ở scale vừa ($30/mo cho 20K). Playwright free nhưng bạn tự quản lý infrastructure và baseline. Percy đang decline — tránh dùng cho dự án mới.

---

## Part 7: Cross-Browser & Cross-Device / Đa Trình Duyệt và Đa Thiết Bị

### 7.1 Khi Nào Thực Sự Cần Cross-Browser Visual Testing

**Câu hỏi đúng**: "Does my CSS use features that render differently across browsers?" — không phải "should I test all browsers?"

| CSS Feature                               | Chrome      | Firefox | Safari                     | Visual Difference Risk    |
| ----------------------------------------- | ----------- | ------- | -------------------------- | ------------------------- |
| `font-smoothing`                          | ✅          | ✅      | Different                  | High — text looks thinner |
| `backdrop-filter`                         | ✅          | ✅      | Different opacity handling | Medium                    |
| `gap` in flex                             | ✅          | ✅      | Fixed in Safari 14.1+      | Low (2025)                |
| `color-mix()`                             | ✅          | ✅      | Safari 16.2+               | Medium for older Safari   |
| CSS Grid subgrid                          | ✅          | ✅      | Safari 16+                 | Medium                    |
| Custom scrollbars (`::-webkit-scrollbar`) | Chrome-only | ❌      | Chrome-only                | Design-only concern       |
| `@container` queries                      | ✅          | ✅      | Safari 16+                 | Low (2025)                |

**Thực tế**: Nếu analytics cho thấy 90% users là Chrome (typical B2B SaaS) → cross-browser visual testing là theater. Nếu user base có 25%+ Safari (iOS/macOS heavy — media, consumer apps) → Safari visual testing là mandatory.

### 7.2 Safari Font Rendering — Real Story

Safari trên macOS sử dụng **subpixel antialiasing** khác Chrome. Đặc biệt với `font-weight: 300` hoặc `400`:

```
Chrome (macOS):  Helvetica Neue 400 → appears at weight ~400 visually
Safari (macOS):  Helvetica Neue 400 → appears at weight ~300 visually (lighter)
```

Điều này có nghĩa là button label trong Chrome có thể trông bold và clear, nhưng trong Safari trông lighter và mỏng hơn — cùng CSS, cùng font.

**Mitigation**:

```css
/* Force consistent rendering across browsers */
body {
  -webkit-font-smoothing: antialiased; /* Chrome, Safari */
  -moz-osx-font-smoothing: grayscale; /* Firefox on macOS */
}
```

### 7.3 Playwright Cross-Browser Setup

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  projects: [
    // Desktop
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    // Mobile
    { name: "mobile-chrome", use: { ...devices["Pixel 5"] } },
    { name: "mobile-safari", use: { ...devices["iPhone 13"] } },
  ],
});
```

**Cost của cross-browser visual testing**: 5x more snapshots = 5x cost + 5x CI time. Run cross-browser only on critical pages, not every component.

```typescript
// Limit cross-browser to critical pages only
test.describe("Critical pages — cross-browser visual", () => {
  // This test block runs on all browser projects
  test("homepage", async ({ page, browserName }) => {
    await page.goto("/");
    await expect(page).toHaveScreenshot(`homepage-${browserName}.png`);
  });
});

test.describe("Component tests — Chrome only", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "Chrome only");

  // Hundreds of component tests — skip on Firefox and Safari
});
```

### 7.4 Mobile Viewport Strategy

```typescript
// Capture mobile breakpoints for responsive testing
const viewports = [
  { name: "mobile", width: 375, height: 812 }, // iPhone SE-ish
  { name: "tablet", width: 768, height: 1024 }, // iPad portrait
  { name: "desktop", width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`Button at ${viewport.name} viewport`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/components/button");
    await expect(page.locator('[data-testid="button-demo"]')).toHaveScreenshot(
      `button-${viewport.name}.png`,
      { animations: "disabled" },
    );
  });
}
```

> 🇻🇳 **Tóm tắt**: Chỉ làm cross-browser visual testing khi user analytics justify nó. B2B SaaS với 90% Chrome → Chrome-only là đủ. Consumer apps với 25%+ Safari users → Safari testing bắt buộc. Safari font rendering khác Chrome do subpixel antialiasing. `-webkit-font-smoothing: antialiased` giúp normalize.

---

## Part 8: 10 Q&As / Câu Hỏi Phỏng Vấn

---

### 🟡 Q1: What does visual regression testing catch that unit tests don't? / Visual testing bắt được gì mà unit tests bỏ qua?

**A:**

Unit tests verify **behavior and structure** — "does the button exist?", "is it disabled?", "does it fire `onClick`?". Visual regression tests verify **rendered appearance** — "does the button look correct?".

The gap: a button can be fully functional (all unit tests pass) and completely invisible (white text on white background, or `opacity: 0`) or broken layout (padding collapsed, border-radius gone). Unit tests cannot detect:

- CSS property values that changed (font-weight, padding, color, border-radius)
- Font-loading failures causing layout shifts
- Dark mode tokens that broke contrast
- RTL layout issues from flex-direction change
- CSS class collision causing specificity override
- Z-index regression causing element to render under another

The canonical example: `opacity: 0` applied by accident to a component. All unit tests pass — element exists, is enabled, fires events. Visual test immediately shows: snapshot is blank.

Vietnamese: Unit tests kiểm tra behavior và structure — "button có tồn tại không?", "có disabled không?". Visual tests kiểm tra rendered appearance — "button trông như thế nào?". Khoảng cách: `opacity: 0` applied nhầm → tất cả unit tests pass, button invisible trong production. Visual test bắt ngay. CSS regression (font-weight, padding, color) là loại bug phổ biến nhất mà chỉ visual tests mới detect được.

**💡 Interview Signal:**

- ✅ Strong: Gives concrete `opacity: 0` or white-on-white example, lists CSS regression categories (font, spacing, dark mode, RTL), explains WHY unit tests cannot see these
- ❌ Weak: "Visual tests check how things look" — true but no depth on the mechanism or specific categories

---

### 🟡 Q2: Pixel-diff vs DOM-diff — when each? / Pixel-diff vs DOM-diff — khi nào dùng cái nào?

**A:**

**Pixel-diff** compares rendered PNG arrays pixel-by-pixel. Use when:

- You need to catch visual changes a DOM diff would miss (gradient color shift, shadow intensity, pseudo-element changes)
- Your rendering environment is normalized (Docker image with fixed Chrome version — removes OS-level font rendering variance)
- You're OK with occasional false positives from subpixel antialiasing

**DOM-diff** compares component tree + computed styles. Use when:

- False positive rate from pixel diff is too high (common on multi-OS teams)
- You want readable diffs ("padding-left: 8px → 4px") instead of "1203 pixels changed"
- You accept that pure CSS visual changes (same computed values, different render) won't be caught

**Hybrid (Chromatic model)**: DOM diff to filter rendering noise + pixel comparison for meaningful changes. Best of both — more setup, vendor dependency.

**Practical rule**: If CI runs on a Docker image with a pinned Chrome version, pixel-diff works well. If developers snapshot locally on different OS/hardware, DOM-diff or hybrid avoids constant false positives.

Vietnamese: Pixel-diff: so sánh PNG pixel-by-pixel, bắt mọi visual change nhưng flaky do font hinting, antialiasing khác nhau trên OS khác nhau. DOM-diff: so sánh component tree + computed styles, stable hơn nhưng bỏ qua CSS-only visual changes. Hybrid (Chromatic): dùng cả hai — DOM để loại noise, pixel để bắt real changes. Rule thực tế: nếu CI dùng Docker image pinned Chrome version → pixel-diff OK. Nếu developers snapshot trên nhiều OS khác nhau → DOM-diff hoặc hybrid.

**💡 Interview Signal:**

- ✅ Strong: Explains antialiasing/GPU variance as the core pixel-diff flaw, knows Chromatic's hybrid model, gives the Docker pinning as pixel-diff solution
- ❌ Weak: "Pixel-diff is more accurate" — misses the flakiness tradeoff entirely

---

### 🟡 Q3: How do you make visual tests not flaky? / Làm sao để visual tests không bị flaky?

**A:**

Six specific techniques:

**1. Font loading**: `await page.evaluate(() => document.fonts.ready)` before snapshotting. Fonts load asynchronously; without this, you capture the fallback system font.

**2. Animations**: Use `animations: 'disabled'` in Playwright `toHaveScreenshot()`. This injects CSS that freezes all animations. For Chromatic/Storybook: use `pauseAnimationAtEnd: true` or set CSS animation duration to `0s`.

**3. Dynamic content**: Use `mask` option to hide regions with timestamps, user data, or random IDs. Never rely on `waitForTimeout` — use explicit conditions.

**4. Viewport normalization**: Set `deviceScaleFactor: 1` in Playwright config to prevent DPR differences. Use `scale: 'css'` in `toHaveScreenshot()` to use CSS pixels.

**5. GPU rendering**: Pass `--disable-gpu` to headless Chrome on CI. GPU-accelerated rendering can produce slightly different antialiasing vs software rendering.

**6. Network dependencies**: Use `page.waitForLoadState('networkidle')` after navigation. Images and web fonts that load over the network are the most common source of "sometimes different" snapshots.

Vietnamese: 6 kỹ thuật — (1) `document.fonts.ready` trước khi snapshot. (2) `animations: 'disabled'` để freeze CSS animations. (3) `mask` để hide dynamic content. (4) `deviceScaleFactor: 1` + `scale: 'css'` để normalize DPR. (5) `--disable-gpu` trên CI. (6) `waitForLoadState('networkidle')` để đợi tất cả network resources load xong. Không bao giờ dùng `waitForTimeout` — dùng explicit conditions.

**💡 Interview Signal:**

- ✅ Strong: Mentions `document.fonts.ready` specifically (not just "wait for fonts"), lists all 6 techniques, knows `scale: 'css'` option
- ❌ Weak: "Add a timeout" — `waitForTimeout` is the anti-pattern here, not the solution

---

### 🟡 Q4: Where do snapshots live in your repo and CI? / Snapshots sống ở đâu trong repo và CI?

**A:**

Two models:

**Git-committed snapshots (Playwright default)**:

- `.png` files committed alongside test files
- `tests/visual/__snapshots__/homepage.png`
- Pros: snapshots versioned with code, offline diff, no vendor
- Cons: git repo bloated (use git LFS for binary files), PRs show binary diffs
- Baseline update: `npx playwright test --update-snapshots` → commit updated PNGs

```bash
# .gitattributes — use git LFS for snapshot files
tests/**/*.png filter=lfs diff=lfs merge=lfs -text
```

**Cloud-hosted snapshots (Chromatic / Argos)**:

- Snapshots stored on vendor infrastructure, referenced by commit SHA
- PR gets a comment with link to visual diff UI
- Pros: no git bloat, rich review UI, history per commit
- Cons: vendor dependency, cost, requires internet on CI

**Recommended hybrid**:

- E2E visual tests → git LFS (close to code, offline capable)
- Design system stories → Chromatic (rich review, TurboSnap optimization)

Vietnamese: Hai model — git-committed (Playwright mặc định, file `.png` commit cùng code, dùng git LFS để tránh bloat) và cloud-hosted (Chromatic/Argos, snapshot lưu trên vendor, PR comment với link visual diff). Hybrid: E2E visual → git LFS, design system stories → Chromatic.

**💡 Interview Signal:**

- ✅ Strong: Mentions git LFS for binary snapshots (not just "commit PNGs"), explains the tradeoff, knows Chromatic stores by commit SHA
- ❌ Weak: "Commit screenshots to git" — correct but misses git LFS concern and vendor alternative

---

### 🟡 Q5: Chromatic vs Playwright `toHaveScreenshot` — when each? / Chọn Chromatic hay Playwright?

**A:**

**Choose Chromatic when:**

- Your team uses Storybook for component development
- You're building or maintaining a design system
- You want cloud-hosted review UI for non-engineer reviewers (designers, PMs)
- TurboSnap optimization (skip unchanged stories) is valuable at your scale
- You want automatic baseline management without committing PNGs to git

**Choose Playwright `toHaveScreenshot` when:**

- You're testing full pages or user flows (not isolated components)
- You want zero vendor dependency
- Your team has Playwright E2E tests already
- Budget is a constraint (self-hosted = free)
- You want snapshot + interaction in the same test

**When you use both:**

- Chromatic: design system components at story level
- Playwright: critical pages and user flows at app level

```typescript
// These serve different purposes — not alternatives
// Chromatic captures: <Button variant="primary" disabled={true} />  (isolated)
// Playwright captures: /checkout page with real cart data at step 2 (contextual)
```

Vietnamese: Chromatic khi dùng Storybook + design system, cần cloud review UI, muốn TurboSnap optimization. Playwright khi test full pages/flows, không muốn vendor lock-in, đã có Playwright E2E tests. Lý tưởng: dùng cả hai — Chromatic cho component isolation, Playwright cho app-level flows.

**💡 Interview Signal:**

- ✅ Strong: Frames them as complementary not competing, knows TurboSnap, explains reviewer UX difference (cloud UI for designers vs CLI for engineers)
- ❌ Weak: "Use Chromatic if you want cloud, Playwright if local" — misses the component-vs-page distinction

---

### 🔴 Q6: Storybook visual tests pass but production looks broken. Debugging order? / Storybook pass nhưng production broken — debug thế nào?

**A:**

This is a classic "tests pass, production broken" scenario. Structured debugging:

**Step 1: Is the story actually testing the broken state?**

Check if the story uses the same props/state that triggers the production bug. Stories often test happy paths — the bug may be in an edge case story that doesn't exist yet.

**Step 2: Is the component rendered in isolation vs. in context?**

Storybook renders components without the app's global CSS, custom fonts from `<head>`, or context providers. Check:

- Does production app have global CSS that affects the component? (`@font-face` declarations, CSS resets, body `font-family`)
- Is there a `ThemeProvider` in production that changes variables?
- Are there container/parent styles affecting layout (e.g., `overflow: hidden` on a parent cutting off dropdown)

**Step 3: Is the production environment different?**

- Chrome version mismatch (Storybook Chromatic runner vs. user browser)
- OS-level font rendering (macOS vs. Windows users)
- Real network (slow font load, FOUT) vs. Storybook's localhost

**Step 4: Is it a CSS specificity/cascade issue?**

- Production app's global CSS class colliding with component styles
- A `@layer` order difference
- CSS Module hash collision (rare but happens)

**Step 5: Add a page-level visual test for the production context**

If a component looks right in isolation but wrong in context, add a Playwright test on the actual production page. The gap between component-level and page-level tests is exactly what page-level snapshots catch.

Vietnamese: 5 bước debug — (1) Story có test đúng state không? (2) Component trong isolation vs context — global CSS, ThemeProvider, parent styles? (3) Production environment khác gì — Chrome version, OS font rendering, real network? (4) CSS specificity/cascade issue? (5) Thêm page-level Playwright test để test production context. Root cause thường là: global CSS của app ảnh hưởng component, nhưng Storybook decorator không inject đầy đủ global styles.

**💡 Interview Signal:**

- ✅ Strong: Goes immediately to "is the story testing the right state?" + "does Storybook have the same global CSS as production?" — both are the most common root causes
- ❌ Weak: "Clear the baseline and re-run" — that's giving up, not debugging

---

### 🔴 Q7: Cross-browser visual testing — necessary or theater? / Cross-browser visual testing — cần thiết hay vô nghĩa?

**A:**

It depends on your user distribution — and most teams get this wrong by defaulting to "test everywhere just to be safe."

**When it's necessary:**

- Safari has >15% of your user base (iOS users + macOS users — typical for consumer apps)
- Your UI uses CSS features with known cross-browser render differences: `backdrop-filter`, `font-smoothing`, subpixel text rendering, certain `color()` functions
- You've had real cross-browser visual bugs reported by users (evidence-based)

**When it's theater:**

- B2B SaaS with analytics showing 85%+ Chrome users — cross-browser snapshots burn CI minutes and create false positives without catching real user-facing bugs
- Your CI budget is limited and you're choosing between cross-browser visual tests and actual functional test coverage
- You have no CSS features with browser-specific rendering

**The pragmatic approach:**

1. Check analytics: what's your browser distribution?
2. For every browser with >10% share: add visual coverage for critical pages only (not every component)
3. Run component-level tests Chrome-only — cross-browser visual for components is rarely worth the cost

```typescript
// Run cross-browser only for critical pages
test.describe("Critical — cross-browser", () => {
  ["chromium", "firefox", "webkit"].forEach((browser) => {
    // Use Playwright project filter — configure in playwright.config.ts
  });
});

// Component tests — Chrome only
test.skip(({ browserName }) => browserName !== "chromium", "Chrome only for component tests");
```

Vietnamese: Cross-browser visual testing cần thiết khi: Safari > 15% user base (iOS + macOS heavy apps), dùng CSS features có known cross-browser differences, đã có bug reports từ specific browsers. Là theater khi: B2B SaaS với 85%+ Chrome users, giới hạn CI budget, không có CSS features với browser-specific rendering. Rule thực dụng: check analytics → chỉ thêm cross-browser coverage cho browsers >10% share → chỉ test critical pages, không phải mọi component.

**💡 Interview Signal:**

- ✅ Strong: Opens with "check your analytics first", quantifies the threshold (>10% or >15%), gives concrete Safari font rendering as a real example, separates page-level cross-browser from component-level
- ❌ Weak: "Yes, always test all browsers" — ignores cost/benefit tradeoff and analytics-driven decision

---

### 🔴 Q8: Visual test runs take 30 minutes on every PR. How do you cut to 5 minutes? / Từ 30 phút xuống 5 phút?

**A:**

A 30-minute visual test suite is a CI bottleneck. Four strategies, applied together:

**Strategy 1: TurboSnap / Affected-only testing** (biggest win)

Chromatic TurboSnap uses Vite/webpack module graph to detect which stories are affected by changed files. A PR changing one button component only re-runs stories that import that component.

```json
// chromatic.config.json
{
  "onlyChanged": true,
  "traceChanged": "expanded"
}
```

Impact: 10,000 stories → typically 200–500 affected stories per PR → 80–95% reduction.

**Strategy 2: Shard parallel execution**

```yaml
# Run snapshots in parallel across 5 workers
strategy:
  matrix:
    shardIndex: [1, 2, 3, 4, 5]
    shardTotal: [5]

- run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
```

Impact: 30min → ~6min with 5 shards (linear scaling).

**Strategy 3: Tier your visual tests by criticality**

```
PR trigger (fast gate, 5 min):
  - Affected component stories (TurboSnap)
  - Only modified pages

Nightly/scheduled (comprehensive, 30 min):
  - All stories
  - All pages, all viewports
  - Cross-browser run
```

**Strategy 4: Optimize individual snapshot speed**

- Use `clip` to snapshot only the component element, not full viewport (faster PNG processing)
- Remove unnecessary `waitForTimeout` calls — replace with explicit condition waits
- Disable network for offline-capable tests (use `page.route('**/*', route => route.abort())` for API calls)
- Use Storybook `play` function for interactions instead of Playwright navigation

```typescript
// Fast: snapshot only the component
await expect(page.locator('[data-component="Button"]')).toHaveScreenshot();

// Slow: full page screenshot for a component test
await expect(page).toHaveScreenshot();
```

Vietnamese: 4 chiến lược — (1) TurboSnap/affected-only testing (giảm 80–95% số snapshots), (2) shard parallel execution (5 shards = 30min → 6min), (3) tier tests theo criticality (fast gate cho PR, comprehensive cho nightly), (4) tối ưu individual snapshot speed (clip thay vì full page, condition waits thay waitForTimeout). Kết hợp cả 4: 30 min → ~3–5 min.

**💡 Interview Signal:**

- ✅ Strong: Leads with TurboSnap (highest impact), mentions sharding, introduces tiered strategy concept, gives code example for clip optimization
- ❌ Weak: "Run fewer tests" — obviously correct but no mechanism

---

### 🔴 Q9: Design system change touches 200 components. Auto-approve or human review? / 200 component changes — auto-approve hay human review?

**A:**

This is a process question as much as a technical one. The answer depends on **what kind of change** it is:

**Auto-approve is appropriate when:**

- The change is a **global intentional design decision** made by design (e.g., "we're moving all border-radius from 4px to 6px")
- The diff has been reviewed at the token/design level BEFORE the code change
- You can verify programmatically that all 200 diffs are exactly the expected delta (same change, different component)

```bash
# Chromatic: bulk accept in one click from UI
# Or via CLI for a fully automated token change:
npx chromatic --auto-accept-changes --branch=design-token-update
```

**Human review is required when:**

- The diff pattern is **not uniform** — 180 components changed as expected, 20 changed differently (could be a regression in those 20)
- The change involved **logic changes**, not just token changes
- No one has reviewed the design decision at system level

**Best practice for large intentional changes:**

1. Design reviews the change visually at design tool level (Figma) before code
2. Engineer makes code change → CI shows 200 visual diffs
3. **Spot-check review**: human reviews 10–15 representative snapshots across component types (button, card, form, modal, etc.)
4. If spot-check looks correct → bulk approve the batch
5. If any anomaly in spot-check → review all 200

**The anti-pattern**: auto-approving every visual diff on every PR because "there are too many to review." This defeats the purpose — you're paying for visual tests but not acting on the signal.

Vietnamese: Phụ thuộc vào loại thay đổi. Auto-approve OK khi: change là intentional global design decision (tất cả border-radius 4px → 6px), đã review ở design level trước, diff pattern uniform (200 components đều có cùng delta). Human review bắt buộc khi: diff pattern không uniform (180 OK, 20 khác lạ), change có logic không chỉ tokens. Best practice cho large intentional changes: design review trước → engineer code → spot-check 10–15 representative snapshots → bulk approve nếu OK. Anti-pattern: auto-approve tất cả diff vì "quá nhiều để review" — làm mất đi ý nghĩa của visual testing.

**💡 Interview Signal:**

- ✅ Strong: Makes the "uniform vs. non-uniform diff" distinction (the key insight), mentions the spot-check review pattern, names the anti-pattern explicitly
- ❌ Weak: "Auto-approve because it's a design decision" — misses the risk of non-uniform diffs hiding real regressions

---

### 🔴 Q10: Visual diff shows 0.5% pixel difference. Real bug or noise? / Diff 0.5% pixel — bug thật hay noise?

**A:**

0.5% pixel diff is ambiguous — context determines the answer. A structured investigation:

**Step 1: Where are the changed pixels?**

```bash
# Open the diff image — changed pixels are highlighted in red
# If changed pixels are scattered uniformly across text → antialiasing noise
# If changed pixels are clustered in a specific region → likely real change
```

- **Scattered sub-pixel changes** across the whole image → font rendering noise (not a bug)
- **Clustered change in one area** (e.g., button padding region, specific icon) → investigate further

**Step 2: What changed in this PR?**

- CSS changes? Font changes? New dependency? If PR doesn't touch CSS/fonts and the diff shows only scattered antialiasing → almost certainly noise
- If PR touches the exact component shown in the diff → likely real

**Step 3: Reproduce locally**

```bash
npx playwright test --update-snapshots  # regenerate local baseline
npx playwright test                     # does diff still appear?
```

If diff disappears on re-run → flakiness/noise. If diff is reproducible → real change.

**Step 4: Zoom in and compare**

Most visual diff tools (Chromatic, Argos, Playwright HTML report) let you toggle between before/after and show the diff highlighted. Look at the actual visual difference — is it meaningful to a user?

**Practical thresholds:**

```typescript
await expect(page).toHaveScreenshot({
  maxDiffPixelRatio: 0.001, // 0.1% — strict, catches real regressions
  // maxDiffPixelRatio: 0.005,  // 0.5% — lenient, allows font hinting noise
  // maxDiffPixels: 50,          // absolute pixel count — good for component tests
});
```

**The answer**: 0.5% can be either. Scattered sub-pixel across the full page → set threshold to 0.5% and accept as noise. Clustered in a meaningful UI region → investigate as potential regression.

Vietnamese: 0.5% pixel diff có thể là noise hoặc bug thật. Điều tra 4 bước: (1) Pixel thay đổi scattered hay clustered? Scattered = font hinting noise, clustered = real change. (2) PR này có touch CSS/font của component đó không? (3) Reproduce locally — nếu diff biến mất khi re-run = flakiness. (4) Zoom in và compare visual — có meaningful với user không? Threshold thực tế: `maxDiffPixelRatio: 0.001` (0.1%) cho strict, 0.005 (0.5%) cho lenient mode.

**💡 Interview Signal:**

- ✅ Strong: Distinguishes scattered vs. clustered pixel changes (the key analytical move), mentions reproducibility test, knows threshold tuning options
- ❌ Weak: "It's probably just noise, accept it" — or "it's a bug, investigate" — both without the investigation framework

---

## Anti-Patterns / Các Lỗi Hay Gặp

### Anti-Pattern 1: Snapshotting Full Pages With Every Dynamic Block

```typescript
// BAD — full page with logged-in user data, timestamps, dynamic ads
test("dashboard", async ({ page }) => {
  await page.goto("/dashboard"); // shows user name, live metrics, timestamps
  await expect(page).toHaveScreenshot("dashboard.png", { fullPage: true });
});
// Result: snapshot changes on every run → perma-flaky → team ignores all failures
```

```typescript
// GOOD — mask dynamic regions, clip to stable sections
test("dashboard layout", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.locator('[data-testid="dashboard-layout"]')).toHaveScreenshot({
    mask: [
      page.locator('[data-testid="user-greeting"]'),
      page.locator('[data-testid="live-metrics"]'),
      page.locator('[data-testid="timestamp"]'),
    ],
    animations: "disabled",
  });
});
```

**Tại sao nguy hiểm**: Perma-flaky tests erode trust. Teams start `--update-snapshots` on every PR without review. Visual testing becomes a CI theater piece that no one acts on.

---

### Anti-Pattern 2: No Baseline Strategy (Snapshot-Update on Every PR)

```bash
# BAD workflow — "tests failed, just re-run with update"
git commit -m "fix: update snapshots"  # on every PR, no review
# Result: baselines drift, regressions get accepted as "the new normal"
```

**Đúng**: Baselines update only when a human explicitly approves a visual change. In Chromatic this means clicking "Accept" in the review UI. In Playwright this means `--update-snapshots` committed in a dedicated PR with visual review.

**Tại sao nguy hiểm**: Without a review gate, visual tests become a rubber stamp. You're spending CI time generating diffs that automatically become the next baseline — catching nothing.

---

### Anti-Pattern 3: Cross-Browser Snapshots When Only Chrome Users Matter

```yaml
# BAD — running visual tests on 5 browsers for a B2B app with 92% Chrome users
projects:
  - { name: "chromium" }
  - { name: "firefox" }
  - { name: "webkit" }
  - { name: "mobile-chrome" }
  - { name: "mobile-safari" }
# Result: 5x CI time, 5x cost, 4x more false positives — for browsers nobody uses
```

**Đúng**: Base browser coverage decision on actual analytics. Run Chrome-only for component-level tests. Add Firefox/Safari only for critical pages when analytics justify it (>10% browser share).

**Tại sao nguy hiểm**: Wastes CI budget that could go toward actual functional test coverage. Cross-browser font rendering differences create constant false positives that desensitize the team.

---

### Anti-Pattern 4: Mixing Visual and Functional Tests

```typescript
// BAD — visual + functional in same test
test("login flow visual and functional", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveScreenshot("login-form.png"); // visual

  await page.fill('[name="email"]', "user@example.com");
  await page.fill('[name="password"]', "password123");
  await page.click('[type="submit"]');
  await expect(page).toHaveURL("/dashboard"); // functional
  await expect(page).toHaveScreenshot("dashboard.png"); // visual again
});
```

**Problem**: When test fails, is it the visual diff or the functional assertion? Debugging is harder. Visual re-run generates new screenshots even if only functional part changed.

**Đúng**: Separate visual-only tests from functional tests. Visual tests focus solely on appearance snapshots. Functional E2E tests do not snapshot — they verify behavior.

---

### Anti-Pattern 5: Pixel Threshold Cranked Too High to Make Tests Pass

```typescript
// BAD — 10% threshold to "stop the noise"
await expect(page).toHaveScreenshot({
  maxDiffPixelRatio: 0.1, // 10% — accepts massive visual changes as "noise"
});
```

**Nguy hiểm**: A button that's completely invisible (white on white) may only affect 5% of pixels in a full-page screenshot. A 10% threshold accepts this as noise. You've built a visual testing system that cannot detect most visual bugs.

**Đúng**: Start strict (`0.001` = 0.1%), address flakiness sources (font, animations, dynamic content) with proper mitigation instead of raising the threshold. If flakiness persists, use `mask` and `clip` to isolate the stable region.

> 🇻🇳 **Tóm tắt**: 5 anti-patterns — (1) snapshot full page với dynamic content = perma-flaky, (2) không có baseline strategy = team `--update-snapshots` mọi PR không review, (3) cross-browser khi user chỉ dùng Chrome = lãng phí CI, (4) mix visual + functional = debug khó, (5) threshold quá cao = tests không bắt được bugs thật.

---

## Memory Hook / Ghi Nhớ Nhanh

**"Tests pass. Button looks broken. CAPTURE it."**

```
C — Capture (screenshot the component or page)
A — Analyze (pixel-diff vs DOM-diff vs hybrid)
P — Pipeline (CI baseline workflow: main updates, PR diffs)
T — Threshold (strict enough to catch bugs, loose enough to avoid noise)
U — Update (only humans approve baseline changes — never auto-update on PR)
R — Regions (mask dynamic, clip to stable, disable animations)
E — Environment (normalize: Docker, DPR=1, --disable-gpu, fonts.ready)
```

**Chromatic = design systems + Storybook + cloud review**
**Playwright = pages + flows + self-hosted + free**
**Argos = middle ground when Percy says no**

---

## Q&A Summary Table / Bảng Tóm Tắt Q&A

| #   | Question                                        | Difficulty | Key Point                                                                |
| --- | ----------------------------------------------- | ---------- | ------------------------------------------------------------------------ |
| 1   | What does visual testing catch unit tests miss? | 🟡         | CSS regressions, opacity, font-swap, dark mode — behavior vs appearance  |
| 2   | Pixel-diff vs DOM-diff — when?                  | 🟡         | Pixel = catches more but flaky; DOM = stable but misses CSS-only; Hybrid |
| 3   | How to make visual tests not flaky?             | 🟡         | fonts.ready, disable animations, mask dynamic, DPR=1, --disable-gpu      |
| 4   | Where do snapshots live?                        | 🟡         | Git LFS for Playwright; cloud (Chromatic/Argos) for design systems       |
| 5   | Chromatic vs Playwright — when each?            | 🟡         | Chromatic = components/Storybook; Playwright = pages/flows               |
| 6   | Storybook passes, production broken — debug?    | 🔴         | Global CSS missing in Storybook, ThemeProvider, parent container styles  |
| 7   | Cross-browser testing — necessary or theater?   | 🔴         | Check analytics; Safari >15% = necessary; Chrome-only B2B = theater      |
| 8   | 30 min → 5 min CI visual tests?                 | 🔴         | TurboSnap, shard parallelism, tier by criticality, clip snapshots        |
| 9   | 200 component changes — auto-approve?           | 🔴         | Uniform diff + design-reviewed = auto-approve; spot-check non-uniform    |
| 10  | 0.5% pixel diff — bug or noise?                 | 🔴         | Scattered = noise; clustered = investigate; reproduce + zoom in          |

---

## Cold Call Simulation / Mô Phỏng Câu Hỏi Bất Ngờ

**Interviewer**: "Your team just upgraded Tailwind from v3 to v4. You have 300 components. How do you verify nothing looks broken?"

**Strong answer structure:**

> "First, I'd check if TurboSnap can scope the impact — Tailwind v4 changes the CSS output for every file that imports it, so TurboSnap might show the entire story tree as affected. In that case, I'd run the full snapshot suite against the upgrade PR.
>
> I'd structure it as three tiers: all 300 component stories in Chromatic (batch diff, with TurboSnap disabled for this PR since the CSS entrypoint changed for everything), then the 10–15 critical pages via Playwright, and a quick spot-check of the flows.
>
> For Chromatic, I'd do a bulk accept IF the pattern across all 300 diffs is uniform and expected (Tailwind v4's known breaking changes like the `text-sm` leading change). If 280 look as expected but 20 show unexpected layout shifts — those 20 need investigation before accepting.
>
> I'd also add a visual diff for RTL if the app supports it — Tailwind v4 changes how `space-x` and directional utilities work with RTL."

**Điều gì làm câu trả lời này strong**: names TurboSnap edge case (CSS entrypoint change = all affected), proposes tiered approach, distinguishes bulk accept vs. spot-check for non-uniform diffs, adds RTL edge case.

---

## Self-Check / Tự Kiểm Tra

Đọc xong file này, bạn có thể trả lời không cần nhìn lại:

- [ ] Giải thích được 3 categories CSS regression mà unit tests không bắt được
- [ ] Mô tả được pixel-diff vs DOM-diff vs hybrid với ưu/nhược điểm của mỗi loại
- [ ] Biết được 6 nguồn flakiness và mitigation cụ thể cho mỗi loại
- [ ] So sánh được Chromatic vs Playwright `toHaveScreenshot` — khi nào dùng cái nào
- [ ] Biết Chromatic pricing: 10K snapshots/month free, $149/mo cho 35K
- [ ] Nói được 4 strategies để giảm CI time từ 30 phút xuống 5 phút
- [ ] Giải thích được khi nào cross-browser visual testing cần thiết vs. theater
- [ ] Debug được "Storybook passes, production broken" với 5 bước cụ thể
- [ ] Biết được anti-pattern "threshold quá cao" là nguy hiểm như thế nào
- [ ] Phân biệt được scattered vs. clustered pixel diff khi phân tích 0.5% diff

> 🇻🇳 Nếu bạn trả lời được 8/10 câu trên mà không nhìn lại tài liệu — bạn đã sẵn sàng cho câu hỏi visual regression testing ở cấp độ Senior.
