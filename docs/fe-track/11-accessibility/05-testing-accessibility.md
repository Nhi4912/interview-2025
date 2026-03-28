# Testing Accessibility - Tools & Methodologies

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Accessibility testing combines automated tools with manual testing to ensure inclusive experiences.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    A11Y TESTING APPROACH                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   TESTING PYRAMID:                                              │
│   ────────────────                                               │
│                                                                   │
│                      /\                                          │
│                     /  \    Manual Testing                      │
│                    /    \   (Screen readers, keyboard)          │
│                   /──────\                                       │
│                  /        \  User Testing                       │
│                 /          \ (People with disabilities)         │
│                /────────────\                                    │
│               /              \  Automated Testing               │
│              /                \ (Axe, Lighthouse, eslint)       │
│             /──────────────────\                                 │
│                                                                   │
│   COVERAGE:                                                     │
│   ─────────                                                      │
│   Automated   ──▶ ~30-40% of issues                             │
│   Manual      ──▶ ~50-60% of issues                             │
│   User testing ──▶ Real-world validation                        │
│                                                                   │
│   ⚠️ Automated testing catches obvious issues                   │
│      but can't verify UX or context                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Automated Testing Tools

### Axe-core

```
┌─────────────────────────────────────────────────────────────────┐
│                         AXE-CORE                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Most popular a11y testing engine                              │
│   Used by: Lighthouse, Deque, many others                       │
│   Zero false positives philosophy                               │
│                                                                   │
│   INTEGRATION OPTIONS:                                          │
│   • Browser extension (axe DevTools)                            │
│   • Jest/Testing Library (@axe-core/react)                      │
│   • Cypress (cypress-axe)                                       │
│   • Playwright (@axe-core/playwright)                           │
│   • CLI (axe-cli)                                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

```javascript
// Jest + React Testing Library + axe
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

describe("Button", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<button>Click me</button>);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// With specific rules
it("checks color contrast", async () => {
  const { container } = render(<MyComponent />);

  const results = await axe(container, {
    rules: {
      "color-contrast": { enabled: true },
    },
  });

  expect(results).toHaveNoViolations();
});
```

### Cypress-axe

```javascript
// cypress/support/commands.js
import "cypress-axe";

// cypress/e2e/accessibility.cy.js
describe("Accessibility Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.injectAxe();
  });

  it("has no detectable a11y violations on load", () => {
    cy.checkA11y();
  });

  it("has no a11y violations after opening modal", () => {
    cy.get('[data-testid="open-modal"]').click();
    cy.checkA11y("#modal");
  });

  it("checks specific elements", () => {
    cy.checkA11y("form", {
      rules: {
        label: { enabled: true },
      },
    });
  });

  // Log violations to terminal
  it("logs all violations", () => {
    cy.checkA11y(null, null, (violations) => {
      violations.forEach((violation) => {
        cy.log(`${violation.id}: ${violation.description}`);
        violation.nodes.forEach((node) => {
          cy.log(`  - ${node.target}`);
        });
      });
    });
  });
});
```

### Playwright + Axe

```javascript
// playwright.config.js
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility", () => {
  test("homepage should have no violations", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("form should be accessible", async ({ page }) => {
    await page.goto("/contact");

    const results = await new AxeBuilder({ page })
      .include("form")
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  // Exclude known issues temporarily
  test("with exclusions", async ({ page }) => {
    await page.goto("/");

    const results = await new AxeBuilder({ page })
      .exclude("#third-party-widget")
      .disableRules(["color-contrast"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
```

### ESLint Plugin

```javascript
// .eslintrc.js
module.exports = {
  plugins: ["jsx-a11y"],
  extends: ["plugin:jsx-a11y/recommended"],
  rules: {
    // Override specific rules
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["to"],
      },
    ],
    "jsx-a11y/label-has-associated-control": [
      "error",
      {
        required: {
          some: ["nesting", "id"],
        },
      },
    ],
    "jsx-a11y/no-autofocus": "warn",
  },
};
```

```
┌─────────────────────────────────────────────────────────────────┐
│               ESLINT-PLUGIN-JSX-A11Y RULES                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   COMMON RULES:                                                 │
│   ─────────────                                                  │
│   alt-text             ──▶ Images need alt attribute            │
│   anchor-has-content   ──▶ Links must have content              │
│   aria-props           ──▶ Valid ARIA attributes                │
│   aria-role            ──▶ Valid ARIA roles                     │
│   click-events-have-key ──▶ onClick needs onKeyDown             │
│   heading-has-content  ──▶ Headings must have content           │
│   html-has-lang        ──▶ <html> needs lang attribute          │
│   label-has-associated ──▶ Labels linked to inputs              │
│   no-noninteractive-element-interactions                        │
│   no-static-element-interactions                                │
│   role-has-required-aria-props                                  │
│   tabindex-no-positive ──▶ Avoid tabindex > 0                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Lighthouse & Browser DevTools

### Lighthouse Accessibility Audit

```
┌─────────────────────────────────────────────────────────────────┐
│               LIGHTHOUSE ACCESSIBILITY                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ACCESS:                                                       │
│   • Chrome DevTools → Lighthouse tab → Accessibility            │
│   • PageSpeed Insights (web)                                    │
│   • Lighthouse CLI                                              │
│                                                                   │
│   SCORE CATEGORIES:                                             │
│   ─────────────────                                              │
│   • Names and labels                                            │
│   • Contrast                                                    │
│   • Navigation                                                  │
│   • ARIA usage                                                  │
│   • Tables and lists                                            │
│   • Best practices                                              │
│                                                                   │
│   LIMITATIONS:                                                  │
│   ────────────                                                   │
│   • Only tests single page state                                │
│   • Can't test dynamic interactions                             │
│   • Can't verify keyboard navigation                            │
│   • Can't verify screen reader experience                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

```bash
# CLI usage
npm install -g lighthouse

# Run accessibility audit
lighthouse https://example.com --only-categories=accessibility --output=json

# CI integration
lighthouse https://example.com \
    --only-categories=accessibility \
    --output=json \
    --output-path=./lighthouse-report.json \
    --chrome-flags="--headless"
```

### Chrome DevTools Accessibility Features

```
┌─────────────────────────────────────────────────────────────────┐
│               CHROME DEVTOOLS A11Y                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ACCESSIBILITY PANEL:                                          │
│   ────────────────────                                           │
│   Elements → Accessibility tab                                  │
│   Shows:                                                        │
│   • Accessibility tree view                                     │
│   • ARIA attributes                                             │
│   • Computed properties (role, name, state)                     │
│   • Contrast ratio                                              │
│                                                                   │
│   CONTRAST CHECKER:                                             │
│   ─────────────────                                              │
│   Elements → Styles → Click color swatch                        │
│   Shows AA/AAA compliance                                       │
│                                                                   │
│   RENDERING → Emulate vision deficiencies:                      │
│   ──────────────────────────────────────────                     │
│   • Blurred vision                                              │
│   • Protanopia (red-blind)                                      │
│   • Deuteranopia (green-blind)                                  │
│   • Tritanopia (blue-blind)                                     │
│   • Achromatopsia (no color)                                    │
│                                                                   │
│   CSS OVERVIEW:                                                 │
│   ─────────────                                                  │
│   More tools → CSS Overview → Capture                           │
│   Shows color contrast issues across page                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🖐️ Manual Testing

### Keyboard Testing Checklist

```
┌─────────────────────────────────────────────────────────────────┐
│               KEYBOARD TESTING                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   BASIC NAVIGATION:                                             │
│   □ Can reach all interactive elements with Tab                 │
│   □ Tab order follows logical reading order                     │
│   □ Focus indicator is visible at all times                     │
│   □ No keyboard traps (can always Tab away)                     │
│   □ Skip link works and is visible on focus                     │
│                                                                   │
│   INTERACTIVE ELEMENTS:                                         │
│   □ Buttons activate with Enter and Space                       │
│   □ Links activate with Enter                                   │
│   □ Checkboxes toggle with Space                                │
│   □ Dropdowns open/navigate with arrows                         │
│   □ Modals trap focus and close with Escape                     │
│   □ Custom components follow ARIA patterns                      │
│                                                                   │
│   FORMS:                                                        │
│   □ Can complete entire form with keyboard                      │
│   □ Error messages are associated with fields                   │
│   □ Form submission works with Enter                            │
│   □ Required fields are announced                               │
│                                                                   │
│   COMMON ISSUES:                                                │
│   ─────────────                                                  │
│   • onClick without keyboard handler                            │
│   • Custom elements without tabindex                            │
│   • Focus lost after interaction                                │
│   • Invisible focus indicators                                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Color Contrast Testing

```
┌─────────────────────────────────────────────────────────────────┐
│               CONTRAST REQUIREMENTS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   WCAG 2.1 REQUIREMENTS:                                        │
│   ───────────────────────                                        │
│                                                                   │
│   Normal text (< 18pt or < 14pt bold):                         │
│   • AA: 4.5:1 minimum                                           │
│   • AAA: 7:1 minimum                                            │
│                                                                   │
│   Large text (≥ 18pt or ≥ 14pt bold):                          │
│   • AA: 3:1 minimum                                             │
│   • AAA: 4.5:1 minimum                                          │
│                                                                   │
│   Non-text (icons, borders, focus indicators):                  │
│   • AA: 3:1 minimum                                             │
│                                                                   │
│   TESTING TOOLS:                                                │
│   ──────────────                                                 │
│   • Chrome DevTools color picker                                │
│   • WebAIM Contrast Checker                                     │
│   • Colour Contrast Analyser (app)                              │
│   • Stark (Figma plugin)                                        │
│                                                                   │
│   COLOR BLINDNESS SIMULATION:                                   │
│   ───────────────────────────                                    │
│   Don't rely on color alone for meaning                         │
│   Add icons, patterns, or text labels                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Screen Reader Testing

```
┌─────────────────────────────────────────────────────────────────┐
│               SCREEN READER TESTING PROCESS                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. PAGE LOAD:                                                 │
│      □ Page title is announced                                  │
│      □ Main heading (h1) describes page                         │
│      □ Language is correct                                      │
│                                                                   │
│   2. NAVIGATION:                                                │
│      □ Navigate by headings (H key in NVDA)                     │
│      □ Navigate by landmarks (D key)                            │
│      □ Navigate by links (K key)                                │
│      □ All sections reachable                                   │
│                                                                   │
│   3. CONTENT:                                                   │
│      □ Images have meaningful alt text                          │
│      □ Decorative images are hidden                             │
│      □ Tables are properly structured                           │
│      □ Lists use proper markup                                  │
│                                                                   │
│   4. FORMS:                                                     │
│      □ Labels announced for all inputs                          │
│      □ Required fields announced                                │
│      □ Error messages announced                                 │
│      □ Success message announced                                │
│                                                                   │
│   5. INTERACTIVE ELEMENTS:                                      │
│      □ Button purpose clear                                     │
│      □ State changes announced                                  │
│      □ Modal content announced                                  │
│      □ Dynamic updates announced                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧪 Component Testing Patterns

### Testing Library A11y Queries

```jsx
import { render, screen } from "@testing-library/react";

// Prefer accessible queries
describe("Accessible Queries", () => {
  it("finds elements by role", () => {
    render(<button>Submit</button>);
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("finds elements by label", () => {
    render(
      <label>
        Email
        <input type="email" />
      </label>,
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("finds elements by placeholder (not recommended)", () => {
    render(<input placeholder="Search..." />);
    // Placeholder alone is not accessible
    // Should have label or aria-label
  });

  it("finds heading", () => {
    render(<h1>Welcome</h1>);
    expect(screen.getByRole("heading", { name: "Welcome", level: 1 })).toBeInTheDocument();
  });
});
```

### Comprehensive Component Tests

```jsx
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";

describe("Modal", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(
      <Modal isOpen={true} title="Confirm">
        <p>Are you sure?</p>
        <button>Yes</button>
        <button>No</button>
      </Modal>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it("should have correct ARIA attributes", () => {
    render(
      <Modal isOpen={true} title="Confirm">
        Content
      </Modal>,
    );

    const modal = screen.getByRole("dialog");
    expect(modal).toHaveAttribute("aria-modal", "true");
    expect(modal).toHaveAttribute("aria-labelledby");
  });

  it("should trap focus within modal", async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} title="Confirm">
        <button>First</button>
        <button>Last</button>
      </Modal>,
    );

    // First focusable element should be focused
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();

    // Tab to last element
    await user.tab();
    expect(screen.getByRole("button", { name: "Last" })).toHaveFocus();

    // Tab should wrap to first
    await user.tab();
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
  });

  it("should close on Escape key", async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} title="Confirm" onClose={onClose}>
        Content
      </Modal>,
    );

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("should return focus to trigger on close", async () => {
    const user = userEvent.setup();

    function App() {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <>
          <button onClick={() => setIsOpen(true)}>Open</button>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </Modal>
        </>
      );
    }

    render(<App />);

    const openButton = screen.getByRole("button", { name: "Open" });
    await user.click(openButton);

    const closeButton = screen.getByRole("button", { name: "Close" });
    await user.click(closeButton);

    expect(openButton).toHaveFocus();
  });
});
```

---

## 🎨 Visual Regression Testing

Visual regression testing captures screenshots and diffs them against baselines, automatically catching visual accessibility regressions — especially useful for detecting color contrast changes, focus indicator removal, and layout shifts that automated axe scans miss.

### Why Visual Regression Matters for Accessibility

```
┌─────────────────────────────────────────────────────────────────┐
│         VISUAL REGRESSION + ACCESSIBILITY                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   WHAT IT CATCHES:                                              │
│   ─────────────────                                              │
│   • Color changes that break contrast ratios (1.4.3)            │
│   • Focus indicator removal or style regression (2.4.7)         │
│   • Layout shifts that obscure focused elements (2.4.11)        │
│   • Accidental hiding of skip links or landmarks                │
│   • Typography changes affecting text sizing and spacing        │
│   • Dark mode / forced-colors (high contrast) regressions       │
│                                                                   │
│   WHAT IT DOESN'T CATCH:                                       │
│   ──────────────────────                                         │
│   • Missing alt text or aria-labels                             │
│   • Keyboard navigation and focus order issues                  │
│   • Screen reader announcement order / content                  │
│   → Use alongside axe-core for full a11y coverage               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Chromatic (Storybook Integration)

[Chromatic](https://www.chromatic.com/) is the official visual testing tool for Storybook. It captures every component story as a screenshot and flags UI changes for review before merge.

```javascript
// No extra Storybook config needed — Chromatic reads existing stories
// Install: npm install --save-dev chromatic

// Run via CLI
// npx chromatic --project-token=<your-token>
```

```yaml
# .github/workflows/chromatic.yml
name: Chromatic

on: [push]

jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Required by Chromatic for baselines

      - name: Install dependencies
        run: npm ci

      - name: Publish to Chromatic
        uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          exitZeroOnChanges: false # Fail CI on unreviewed visual changes
```

```javascript
// Storybook story: verify focus indicator is visually present
export default {
  title: "Button",
  component: Button,
  parameters: {
    // Chromatic captures all mode combinations
    chromatic: { modes: { light: {}, dark: {}, "high-contrast": {} } },
  },
};

// Focused state story — catches accidental :focus outline removal
export const Focused = {
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector("button");
    button.focus();
  },
};

// Uses storybook-addon-pseudo-states to capture :focus-visible
export const FocusVisible = {
  args: { children: "Save" },
  parameters: {
    pseudo: { focusVisible: true },
  },
};
```

### Percy (BrowserStack)

[Percy](https://percy.io/) is a cloud-based visual testing platform that integrates with Playwright, Cypress, Storybook, and more.

```javascript
// Install: npm install --save-dev @percy/playwright

import { test } from "@playwright/test";
import percySnapshot from "@percy/playwright";

test("Homepage visual regression", async ({ page }) => {
  await page.goto("/");
  await percySnapshot(page, "Homepage");
});

// Capture focus state to verify focus indicators
test("Button focus indicator visible", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab"); // Focus first interactive element
  await percySnapshot(page, "First interactive element focused");
});

// High contrast mode — catches forced-colors regressions
test("Forced colors (high contrast) mode", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark", forcedColors: "active" });
  await page.goto("/");
  await percySnapshot(page, "High contrast mode");
});
```

```yaml
# CI: Percy with Playwright
- name: Run Percy visual tests
  run: npx percy exec -- npx playwright test visual
  env:
    PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
```

### Visual Regression Tool Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│            VISUAL REGRESSION TOOL COMPARISON                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Tool         Integration          Best For                    │
│   ─────────────────────────────────────────────────────────     │
│   Chromatic    Storybook            Component-level testing     │
│   Percy        Playwright/Cypress   Full-page E2E snapshots     │
│   Playwright   Built-in (no SaaS)   Screenshots in CI free      │
│   reg-suit     Any                  Self-hosted visual diff      │
│                                                                   │
│   ACCESSIBILITY-SPECIFIC TIPS:                                  │
│   ─────────────────────────────                                  │
│   • Always snapshot focused states (:focus-visible)             │
│   • Test dark mode AND forced-colors (high contrast)            │
│   • Snapshot hover states (tooltip / popover visibility)        │
│   • Capture error states (red borders, warning icons)           │
│   • Combine with axe-core scans for full a11y coverage          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/accessibility.yml
name: Accessibility Tests

on: [push, pull_request]

jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint a11y rules
        run: npm run lint

      - name: Run Jest a11y tests
        run: npm run test:a11y

      - name: Build application
        run: npm run build

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000/
            http://localhost:3000/about
          uploadArtifacts: true
          temporaryPublicStorage: true

      - name: Run Playwright a11y tests
        run: npx playwright test accessibility
```

### Lighthouse CI Configuration

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3000/"],
      numberOfRuns: 3,
    },
    assert: {
      preset: "lighthouse:recommended",
      assertions: {
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "color-contrast": "error",
        "document-title": "error",
        "html-has-lang": "error",
        "meta-viewport": "error",
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: What percentage of accessibility issues can automated testing catch?**

A: Automated testing catches approximately 30-40% of accessibility issues. It's good for detecting:

- Missing alt text
- Color contrast
- Missing form labels
- Invalid ARIA

But it cannot test:

- Keyboard navigation UX
- Screen reader experience
- Logical content order
- Whether alt text is meaningful

**Q: Name 3 automated a11y testing tools**

A:

1. **axe-core**: Industry standard, used in many tools
2. **Lighthouse**: Built into Chrome, tests pages
3. **eslint-plugin-jsx-a11y**: Catches issues during development

### 🟡 Mid-level

**Q: How do you integrate accessibility testing into CI/CD?**

A: Multi-layer approach:

1. **Build time**: ESLint jsx-a11y plugin catches issues in IDE and CI
2. **Unit tests**: jest-axe checks component accessibility
3. **E2E tests**: cypress-axe or playwright tests full pages
4. **Lighthouse CI**: Enforces accessibility score threshold

```yaml
# Fail build if a11y score < 90
assertions:
  "categories:accessibility": ["error", { minScore: 0.9 }]
```

**Q: What should you test manually that automated tools miss?**

A:

1. **Keyboard navigation**: Logical tab order, focus management
2. **Screen reader experience**: Announcements make sense
3. **Meaningful content**: Alt text describes purpose, not just appearance
4. **User flows**: Can complete tasks without mouse
5. **Focus management**: Focus moves correctly after interactions

### 🔴 Senior

**Q: Design an accessibility testing strategy for a large application**

A: Comprehensive strategy:

```
┌─────────────────────────────────────────────────────────────────┐
│   LAYER 1: Development                                         │
│   • ESLint a11y plugin in IDE                                  │
│   • Pre-commit hooks for lint                                  │
│   • Component library with built-in a11y                       │
├─────────────────────────────────────────────────────────────────┤
│   LAYER 2: Unit Tests                                          │
│   • jest-axe for all components                                │
│   • Testing Library accessible queries                         │
│   • Focus management tests                                     │
├─────────────────────────────────────────────────────────────────┤
│   LAYER 3: Integration Tests                                   │
│   • Cypress/Playwright a11y tests                              │
│   • User flow testing with keyboard                            │
│   • Critical path coverage                                     │
├─────────────────────────────────────────────────────────────────┤
│   LAYER 4: CI/CD                                               │
│   • Lighthouse CI with score threshold                         │
│   • Block merges on a11y regression                            │
│   • Automated reports                                          │
├─────────────────────────────────────────────────────────────────┤
│   LAYER 5: Manual Testing                                      │
│   • QA keyboard testing checklist                              │
│   • Screen reader testing (VoiceOver, NVDA)                    │
│   • Regular audits by specialists                              │
├─────────────────────────────────────────────────────────────────┤
│   LAYER 6: User Testing                                        │
│   • Testing with people with disabilities                      │
│   • Usability studies                                          │
│   • Feedback channels                                          │
└─────────────────────────────────────────────────────────────────┘
```

**Q: How would you handle accessibility debt in a legacy codebase?**

A:

1. **Audit**: Run automated tools to identify scope
2. **Prioritize**: Focus on critical user journeys first
3. **Component library**: Create accessible base components
4. **Migration plan**: Replace custom components gradually
5. **Training**: Educate team on a11y best practices
6. **CI enforcement**: Prevent new violations
7. **Incremental improvement**: Address issues in touched files

---

## 📚 Active Recall

1. [ ] What can automated testing NOT catch?
2. [ ] List 5 things to check in keyboard testing
3. [ ] What are WCAG contrast requirements for normal text (AA)?
4. [ ] How do you test color blindness accessibility?
5. [ ] Name tools for each testing layer (lint, unit, e2e, CI)

---

---

## 📚 References

| Resource                             | URL                                                    |
| ------------------------------------ | ------------------------------------------------------ |
| axe-core (GitHub)                    | <https://github.com/dequelabs/axe-core>                |
| Playwright Accessibility Testing     | <https://playwright.dev/docs/accessibility-testing>    |
| Deque University                     | <https://dequeuniversity.com/>                         |
| jest-axe                             | <https://github.com/nickcolley/jest-axe>               |
| cypress-axe                          | <https://github.com/component-driven/cypress-axe>      |
| eslint-plugin-jsx-a11y               | <https://github.com/jsx-eslint/eslint-plugin-jsx-a11y> |
| Chromatic (Storybook visual testing) | <https://www.chromatic.com/>                           |
| Percy (BrowserStack visual testing)  | <https://percy.io/>                                    |
| Lighthouse CI                        | <https://github.com/GoogleChrome/lighthouse-ci>        |
| WebAIM (Web Accessibility In Mind)   | <https://webaim.org/>                                  |

---

> **Module hoàn thành!** Quay lại [README.md](./README.md) để xem tổng quan module.
