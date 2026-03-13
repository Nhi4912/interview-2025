# WCAG Fundamentals / Tiêu Chuẩn Tiếp Cận Web

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Topics**: Accessibility, WCAG, ARIA, Screen Reader
> **See also**: [ARIA Attributes](./02-aria-attributes.md) | [Keyboard Navigation](./03-keyboard-navigation.md)

> WCAG là international standard cho web accessibility. Understand principles, levels, và key success criteria.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    WCAG 2.2 STRUCTURE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   4 PRINCIPLES (POUR)                                            │
│        │                                                         │
│        ├─▶ Perceivable (1.x)                                    │
│        ├─▶ Operable (2.x)                                       │
│        ├─▶ Understandable (3.x)                                 │
│        └─▶ Robust (4.x)                                         │
│                                                                   │
│   13 GUIDELINES                                                  │
│        │                                                         │
│        └─▶ Under each principle                                 │
│                                                                   │
│   78 SUCCESS CRITERIA                                            │
│        │                                                         │
│        └─▶ Testable requirements (A, AA, AAA)                   │
│                                                                   │
│   CONFORMANCE LEVELS:                                            │
│   Level A   ──▶ Must have (critical barriers)                   │
│   Level AA  ──▶ Should have (standard target)                   │
│   Level AAA ──▶ Nice to have (enhanced)                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📖 POUR Principles

### 1. Perceivable

```
Users must be able to perceive the information being presented.

GUIDELINES:
─────────────────────────────────────────────────────────────────
1.1 Text Alternatives
    • Alt text for images
    • Captions for audio
    • Text alternatives for non-text content

1.2 Time-based Media
    • Captions for video
    • Audio descriptions
    • Transcripts

1.3 Adaptable
    • Content can be presented in different ways
    • Meaningful sequence
    • Sensory characteristics

1.4 Distinguishable
    • Use of color (not sole means)
    • Contrast ratios
    • Resize text
    • Text spacing
```

```html
<!-- Text Alternatives Examples -->

<!-- ❌ Bad - No alt text -->
<img src="chart.png">

<!-- ❌ Bad - Redundant -->
<img src="logo.png" alt="Image of company logo">

<!-- ✅ Good - Descriptive -->
<img src="chart.png" alt="Bar chart showing Q3 sales increased 25%">

<!-- ✅ Good - Decorative (empty alt) -->
<img src="decorative-line.png" alt="">

<!-- ✅ Good - Complex image with extended description -->
<figure>
    <img src="infographic.png" alt="Infographic about climate change"
         aria-describedby="infographic-desc">
    <figcaption id="infographic-desc">
        Detailed description of the infographic...
    </figcaption>
</figure>
```

### 2. Operable

```
User interface components must be operable.

GUIDELINES:
─────────────────────────────────────────────────────────────────
2.1 Keyboard Accessible
    • All functionality available via keyboard
    • No keyboard traps
    • Character key shortcuts

2.2 Enough Time
    • Timing adjustable
    • Pause, stop, hide moving content

2.3 Seizures and Physical Reactions
    • No flashing content (>3 flashes/second)

2.4 Navigable
    • Skip links
    • Page titles
    • Focus order
    • Link purpose

2.5 Input Modalities
    • Pointer gestures have alternatives
    • Target size (44x44px minimum)
```

```html
<!-- Keyboard Accessible Examples -->

<!-- ❌ Bad - Click only -->
<div onclick="handleAction()">Click me</div>

<!-- ✅ Good - Keyboard accessible -->
<button onclick="handleAction()">Click me</button>

<!-- ✅ Good - Custom element made accessible -->
<div role="button"
     tabindex="0"
     onclick="handleAction()"
     onkeydown="handleKeydown(event)">
    Click me
</div>

<script>
function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleAction();
    }
}
</script>

<!-- Skip Link -->
<a href="#main-content" class="skip-link">
    Skip to main content
</a>

<style>
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    padding: 8px;
    background: #000;
    color: #fff;
    z-index: 100;
}
.skip-link:focus {
    top: 0;
}
</style>
```

### 3. Understandable

```
Information and operation must be understandable.

GUIDELINES:
─────────────────────────────────────────────────────────────────
3.1 Readable
    • Language of page
    • Language of parts
    • Unusual words

3.2 Predictable
    • On Focus (no unexpected changes)
    • On Input (no unexpected changes)
    • Consistent navigation
    • Consistent identification

3.3 Input Assistance
    • Error identification
    • Labels or instructions
    • Error suggestion
    • Error prevention (for legal, financial)
```

```html
<!-- Understandable Examples -->

<!-- Language -->
<html lang="en">
<p>This is English text.</p>
<p lang="vi">Đây là tiếng Việt.</p>

<!-- Form with Error Handling -->
<form>
    <label for="email">Email (required)</label>
    <input type="email" id="email"
           aria-describedby="email-error"
           aria-invalid="true">
    <span id="email-error" role="alert">
        Please enter a valid email address
    </span>
</form>

<!-- Consistent Navigation -->
<!-- Keep navigation in same order on all pages -->
<nav>
    <a href="/">Home</a>
    <a href="/products">Products</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
</nav>
```

### 4. Robust

```
Content must be robust enough for assistive technologies.

GUIDELINES:
─────────────────────────────────────────────────────────────────
4.1 Compatible
    • Parsing (valid HTML)
    • Name, Role, Value (for custom components)
    • Status messages (announce dynamically)
```

```html
<!-- Robust Examples -->

<!-- ❌ Bad - Invalid HTML -->
<div id="header">
    <div id="header">  <!-- Duplicate ID -->
</div>

<!-- ✅ Good - Valid HTML -->
<header id="header">
    <nav id="main-nav">
    </nav>
</header>

<!-- Custom component with proper semantics -->
<div role="slider"
     aria-valuenow="50"
     aria-valuemin="0"
     aria-valuemax="100"
     aria-label="Volume"
     tabindex="0">
</div>

<!-- Status message for screen readers -->
<div role="status" aria-live="polite">
    3 items added to cart
</div>
```

---

## 📊 Key Success Criteria (Level AA)

### Color Contrast

```css
/* Minimum contrast ratios */

/* Normal text (<24px or <19px bold): 4.5:1 */
.normal-text {
    color: #595959; /* On white: 4.6:1 ✅ */
    color: #767676; /* On white: 4.5:1 ✅ (minimum) */
    color: #888888; /* On white: 3.5:1 ❌ */
}

/* Large text (≥24px or ≥19px bold): 3:1 */
.large-text {
    font-size: 24px;
    color: #949494; /* On white: 3:1 ✅ */
}

/* Non-text (icons, borders): 3:1 */
.icon {
    color: #949494; /* 3:1 minimum ✅ */
}

/* Tools: WebAIM Contrast Checker, Stark */
```

### Focus Visible

```css
/* Default focus - don't remove! */
:focus {
    outline: 2px solid blue;
    outline-offset: 2px;
}

/* Custom focus that meets requirements */
:focus-visible {
    outline: 3px solid #005fcc;
    outline-offset: 2px;
    border-radius: 2px;
}

/* High contrast focus */
button:focus-visible {
    outline: 3px solid currentColor;
    outline-offset: 3px;
    box-shadow: 0 0 0 6px white, 0 0 0 9px currentColor;
}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### Q: What does WCAG stand for and what is its purpose? / WCAG là gì và mục đích của nó? 🟢 Junior

**A:** WCAG stands for Web Content Accessibility Guidelines — an international standard published by the W3C for making web content accessible to people with disabilities, including visual, auditory, motor, and cognitive impairments.

Vietnamese explanation: WCAG là tiêu chuẩn quốc tế do W3C ban hành, giúp web trở nên accessible cho người dùng khuyết tật. Đây là baseline quan trọng vì nhiều quốc gia yêu cầu tuân thủ theo luật (ADA ở Mỹ, EN 301 549 ở EU). Khi được hỏi câu này, cần nhấn mạnh ba điểm: đây là tiêu chuẩn quốc tế, phục vụ nhiều loại khuyết tật khác nhau, và có ba mức độ tuân thủ A/AA/AAA.

---

### Q: What is the difference between Level A and Level AA conformance? / Sự khác biệt giữa Level A và Level AA là gì? 🟢 Junior

**A:** Level A is the minimum accessibility level — it removes critical barriers that completely block access for users with disabilities. Level AA is the standard target recommended for most websites; it includes all Level A criteria plus additional requirements such as color contrast ratios (4.5:1 for normal text) and consistent navigation. Most legal and regulatory requirements target Level AA.

Vietnamese explanation: Level A là mức tối thiểu — không đạt thì có nhóm người dùng bị chặn hoàn toàn (ví dụ: ảnh không có alt text). Level AA là mức thực tế mà hầu hết các tổ chức cần đạt, bao gồm thêm yêu cầu về contrast, focus visible, và consistent navigation. Level AAA là enhanced — tốt nếu đạt được nhưng không bắt buộc và thường không khả thi cho toàn bộ website.

---

### Q: What are the four POUR principles of WCAG? / Bốn nguyên tắc POUR của WCAG là gì? 🟡 Mid

**A:**
- **Perceivable**: All information and UI components must be presentable to users in ways they can perceive — alt text for images, captions for video, sufficient color contrast.
- **Operable**: All UI components and navigation must be operable — keyboard accessible, no keyboard traps, sufficient time limits.
- **Understandable**: Information and UI operation must be understandable — readable text, predictable behavior, helpful error messages.
- **Robust**: Content must be robust enough to be reliably interpreted by assistive technologies — valid HTML, proper ARIA roles, status message announcements.

Vietnamese explanation: POUR là bộ khung tư duy quan trọng nhất trong WCAG. Khi audit hoặc fix accessibility issues, nên phân loại vấn đề theo POUR để có hướng xử lý rõ ràng. Ví dụ: thiếu alt text là lỗi Perceivable; không navigate được bằng keyboard là lỗi Operable; form không có error message rõ ràng là lỗi Understandable; duplicate ID gây screen reader nhầm lẫn là lỗi Robust.

---

### Q: What are the required color contrast ratios under WCAG AA? / Tỷ lệ tương phản màu sắc theo WCAG AA là bao nhiêu? 🟡 Mid

**A:** Under WCAG 2.1/2.2 Level AA: normal text (below 24px or below 19px bold) requires a 4.5:1 contrast ratio against its background; large text (24px and above, or 19px and above if bold) requires 3:1; non-text UI elements such as icons and input borders also require 3:1. These ratios do not apply to decorative elements or logotypes.

Vietnamese explanation: Đây là câu hỏi thực tiễn rất hay gặp. Cần nhớ ba con số: 4.5:1 (normal text), 3:1 (large text và non-text). Tool để check: WebAIM Contrast Checker hoặc Stark plugin cho Figma. Một điểm dễ bỏ qua là non-text elements (icon, border của input) cũng cần đạt 3:1. Placeholder text thường bị fail vì màu quá nhạt — cần check kỹ.

---

### Q: How would you implement WCAG AA compliance in an existing project? / Làm thế nào để triển khai WCAG AA trong dự án có sẵn? 🔴 Senior

**A:**
```
1. Audit:
   - Run automated tools (axe, Lighthouse)
   - Manual testing with screen reader
   - Keyboard navigation test

2. Prioritize:
   - Fix Level A issues first
   - Then Level AA issues
   - Focus on high-impact pages

3. Common fixes:
   - Add alt text to images
   - Ensure color contrast
   - Add form labels
   - Fix heading hierarchy
   - Add skip links

4. Prevention:
   - ESLint plugin for JSX a11y
   - Component library with built-in a11y
   - Automated testing in CI
```

Vietnamese explanation: Đây là câu hỏi Senior yêu cầu tư duy hệ thống. Không chỉ fix lỗi mà còn phải ngăn lỗi quay lại. Chiến lược tốt nhất là: (1) audit để biết baseline, (2) ưu tiên theo impact (user-facing flows trước), (3) fix và document pattern, (4) integrate vào developer workflow (lint rules, component library, CI checks). Quan trọng: automated tools chỉ phát hiện được ~30-40% accessibility issues — manual testing với screen reader (VoiceOver, NVDA) là bắt buộc.

---

### Q: How do you manage focus in a Single Page Application (SPA)? / Làm thế nào quản lý focus trong SPA? 🟡 Mid

**A:** In a traditional multi-page app, the browser resets focus to the top of the page on each navigation. SPAs bypass this behavior because only parts of the DOM change without a full page reload. This breaks the experience for keyboard and screen reader users who lose their place entirely.

Strategies to manage focus in SPAs:

```javascript
// 1. Move focus to the new page heading on route change
// (React Router example)
function App() {
    const location = useLocation();
    const headingRef = useRef(null);

    useEffect(() => {
        // Wait for DOM to update, then focus the page heading
        headingRef.current?.focus();
    }, [location.pathname]);

    return (
        <main>
            <h1 tabIndex={-1} ref={headingRef}>Page Title</h1>
            {/* page content */}
        </main>
    );
}

// 2. Use an aria-live region to announce the new page title
function RouteAnnouncer() {
    const location = useLocation();
    const [announcement, setAnnouncement] = useState('');

    useEffect(() => {
        const title = document.title || 'New page loaded';
        setAnnouncement(title);
    }, [location.pathname]);

    return (
        <div
            aria-live="assertive"
            aria-atomic="true"
            style={{ position: 'absolute', left: '-9999px' }}
        >
            {announcement}
        </div>
    );
}

// 3. Return focus to the trigger element when closing a modal
function Modal({ onClose, triggerRef }) {
    useEffect(() => {
        return () => {
            // Restore focus to the element that opened the modal
            triggerRef.current?.focus();
        };
    }, [triggerRef]);
    // ...
}
```

Vietnamese explanation: Đây là vấn đề rất phổ biến trong React/Vue/Angular apps. Khi navigate giữa các route, screen reader user không biết content đã thay đổi vì focus không di chuyển. Có hai cách tiếp cận chính: (1) move focus đến heading của page mới (tabIndex="-1" cho phép focus programmatically mà không thêm vào tab order), hoặc (2) announce page title qua aria-live region. Next.js có built-in route announcer từ v12. Ngoài ra, khi mở modal/dialog, focus phải trap bên trong modal; khi đóng phải trả focus về trigger element — đây là pattern critical cho keyboard users.

---

### Q: What are the new success criteria introduced in WCAG 2.2? / WCAG 2.2 đã thêm những tiêu chí mới nào? 🔴 Senior

**A:** WCAG 2.2 (published October 2023) added nine new success criteria and removed one (4.1.1 Parsing, which became obsolete). Key new criteria:

```
NEW IN WCAG 2.2:
─────────────────────────────────────────────────────────────────
2.4.11 Focus Not Obscured (AA)
    • Focused component must not be entirely hidden by sticky
      headers, cookie banners, or other overlapping content.
    • At least part of the focused element must remain visible.

2.4.12 Focus Not Obscured (Enhanced) (AAA)
    • The focused component must be fully visible (no overlap).

2.4.13 Focus Appearance (AAA)
    • Focus indicator area must be at least the perimeter of the
      unfocused component and have 3:1 contrast change.

2.5.7 Dragging Movements (AA)
    • All drag-and-drop functionality must have a single-pointer
      alternative (e.g., click-to-select + click-to-drop).

2.5.8 Target Size (Minimum) (AA)
    • Interactive targets must be at least 24×24 CSS pixels,
      or have sufficient spacing so the 24px area doesn't overlap
      another target's area.
    (Replaces the 44×44px guideline from WCAG 2.5.5 AAA)

3.2.6 Consistent Help (AA)
    • If help mechanisms (chat, phone, FAQ link) appear on
      multiple pages, they must appear in the same relative order.

3.3.7 Redundant Entry (AA)
    • Information previously entered by the user must be
      auto-populated or selectable to avoid re-entry in the
      same session (except for security or expiry reasons).

3.3.8 Accessible Authentication (Minimum) (AA)
    • Authentication must not rely solely on a cognitive function
      test (e.g., remembering a password or solving a puzzle)
      unless an alternative is provided or a helper is allowed.

3.3.9 Accessible Authentication (Enhanced) (AAA)
    • No cognitive function test at all — no exceptions.
```

Vietnamese explanation: WCAG 2.2 phản ánh xu hướng mobile-first và cognitive accessibility. Ba tiêu chí quan trọng nhất cần nhớ cho Senior interview: (1) **Focus Not Obscured** — rất phổ biến khi có sticky header hay cookie banner che mất focused element; (2) **Target Size 24×24px** — thực tế hơn 44×44px của WCAG 2.1 AAA, áp dụng cho AA; (3) **Accessible Authentication** — ảnh hưởng trực tiếp đến captcha và multi-step auth flows. Lưu ý: 4.1.1 Parsing bị remove vì modern browsers đã tự normalize HTML parsing, tiêu chí này không còn tạo ra accessibility barriers thực tế.

---

### Q: How do you test accessibility programmatically? / Làm thế nào để kiểm tra accessibility bằng code? 🟡 Mid

**A:** Programmatic accessibility testing combines automated static analysis, runtime DOM auditing, and integration testing. No single tool catches everything — aim for a layered approach:

```javascript
// ─── Layer 1: Static analysis (ESLint) ───────────────────────────
// .eslintrc.js
module.exports = {
    plugins: ['jsx-a11y'],
    extends: ['plugin:jsx-a11y/recommended'],
};
// Catches: missing alt text, invalid ARIA, empty labels, etc.
// Runs at: editor / pre-commit / CI

// ─── Layer 2: Unit tests with jest-axe ───────────────────────────
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('Button has no accessibility violations', async () => {
    const { container } = render(<Button>Save</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
});

// ─── Layer 3: Integration / E2E (Playwright + axe-core) ──────────
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Homepage has no AA violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
        .analyze();
    expect(results.violations).toEqual([]);
});

// ─── Layer 4: CI gate ─────────────────────────────────────────────
// Run axe scans on key routes in CI; fail the build on new violations.
// Recommended: scan at least homepage, login, checkout, form pages.
```

```
TOOLING LANDSCAPE:
─────────────────────────────────────────────────────────────────
Tool              Type          What it catches
─────────────────────────────────────────────────────────────────
eslint-plugin-    Static        Missing alt, bad ARIA usage
  jsx-a11y        analysis      (~20-25% of issues)

jest-axe /        Unit /        Component-level violations
  axe-core        integration   (~30-40% of issues combined)

Playwright +      E2E           Full-page, real DOM violations
  @axe-core/
  playwright

Lighthouse CI     CI audit      Performance + a11y score gate

VoiceOver /       Manual        Actual UX for AT users
  NVDA / JAWS                   (~60-70% of issues need manual)
─────────────────────────────────────────────────────────────────
Automated tools combined catch ~30-40% of all a11y issues.
Manual testing with a real screen reader is always required.
```

Vietnamese explanation: Câu này kiểm tra khả năng xây dựng accessibility pipeline, không chỉ biết tool. Điểm quan trọng cần nhấn mạnh: automated tools chỉ phát hiện được khoảng 30-40% vấn đề — phần còn lại cần manual testing. Chiến lược tốt: (1) ESLint plugin để catch lỗi ngay lúc viết code, (2) jest-axe trong unit tests cho component library, (3) axe-core/playwright trong E2E tests cho critical user flows, (4) Lighthouse CI để track score theo thời gian. Không cần đạt 100% Lighthouse a11y score (vì một số checks có false positives) — quan trọng hơn là zero violations trong axe scans và manual testing với screen reader thực tế.

---

## 📊 Interview Q&A Summary

| Question | Level | Key Point |
|----------|-------|-----------|
| What does WCAG stand for? | 🟢 Junior | W3C standard for web accessibility across disability types |
| Difference between Level A and AA? | 🟢 Junior | A = critical barriers; AA = standard target including contrast, focus |
| What are the POUR principles? | 🟡 Mid | Perceivable, Operable, Understandable, Robust |
| Required color contrast ratios? | 🟡 Mid | 4.5:1 normal text, 3:1 large text and non-text elements |
| Focus management in SPAs? | 🟡 Mid | Move focus to page heading or use aria-live on route change; return focus on modal close |
| Testing accessibility programmatically? | 🟡 Mid | Layered: ESLint + jest-axe + Playwright/axe-core; automated covers only ~30-40% |
| Implementing WCAG AA in existing project? | 🔴 Senior | Audit → prioritize → fix common issues → prevent regression with CI |
| New success criteria in WCAG 2.2? | 🔴 Senior | Focus Not Obscured, Target Size 24px, Accessible Authentication, Redundant Entry |

---

## 📚 Active Recall

1. [ ] POUR principles (4)
2. [ ] Conformance levels và targets
3. [ ] Color contrast ratios
4. [ ] Key success criteria for forms
5. [ ] Common Level A violations
6. [ ] Focus management strategies for SPAs
7. [ ] New WCAG 2.2 criteria (9 added, 1 removed)
8. [ ] Accessibility testing toolchain layers

---

> **Tiếp theo:** [02-aria-attributes.md](./02-aria-attributes.md) - ARIA Attributes
