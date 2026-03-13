# WCAG 2.1 Guidelines / Hướng Dẫn WCAG 2.1

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Accessibility - Chapter 1 / Khả Năng Truy Cập - Chương 1

[Back to Table of Contents](../../00-table-of-contents.md)

---

## Tổng Quan / Overview
- **English:** Accessibility is product quality, not a final QA checkbox.
- **Tiếng Việt:** Accessibility là chất lượng sản phẩm cốt lõi, không phải checkbox cuối dự án.
- **English:** WCAG 2.1 provides technical criteria to make web content usable by people with disabilities.
- **Tiếng Việt:** WCAG 2.1 cung cấp tiêu chí kỹ thuật để nội dung web dùng được cho người khuyết tật.

## Tài Liệu Liên Quan / Related References
- [ARIA Comprehensive](./14-accessibility-02-aria-comprehensive.md)
- [HTML5 Fundamentals](../05-html-css/00-html5-fundamentals.md)

---

## 1) WCAG 2.1 and POUR / Tổng Quan WCAG 2.1 và 4 Nguyên Tắc POUR

### 🟢 [Junior] Tổng Quan
- **English:** WCAG 2.1 is organized around four principles: Perceivable, Operable, Understandable, Robust.
- **Tiếng Việt:** WCAG 2.1 được tổ chức quanh 4 nguyên tắc: Perceivable, Operable, Understandable, Robust.

### Explanation / Giải thích
- Perceivable: người dùng phải nhận biết được nội dung bằng giác quan phù hợp.
- Operable: người dùng phải thao tác được bằng nhiều phương thức, đặc biệt bàn phím.
- Understandable: UI và thông tin phải dễ hiểu, nhất quán, dự đoán được.
- Robust: nội dung phải tương thích với công nghệ hỗ trợ hiện tại và tương lai.

### Example / Ví dụ
```tsx
const POUR = {
  perceivable: ['text alternatives', 'captions', 'adaptable content', 'contrast'],
  operable: ['keyboard access', 'enough time', 'no seizure triggers', 'clear navigation'],
  understandable: ['readable text', 'predictable UI', 'input assistance'],
  robust: ['semantic markup', 'compatible with assistive tech'],
} as const;
```

### Quality/Complexity Notes
- Không phải thuật toán Big-O; đây là framework tiêu chí kiểm thử.
- Tối ưu effort bằng cách tích hợp accessibility từ design + dev + QA sớm.

### Frontend Use Case
- Dùng POUR làm checklist acceptance criteria cho mọi feature UI.
- Thiết lập definition of done: pass keyboard + screen reader smoke test.

## 2) Conformance Levels A, AA, AAA / Các Mức Tuân Thủ

### 🟢 [Junior] Tổng Quan
- **English:** WCAG conformance has three levels: A (minimum), AA (recommended), AAA (highest).
- **Tiếng Việt:** WCAG có 3 mức: A (tối thiểu), AA (khuyến nghị), AAA (cao nhất).

### Explanation / Giải thích
- Phần lớn sản phẩm thương mại target AA để cân bằng khả thi và chất lượng.
- AAA không phải lúc nào thực tế cho mọi nội dung và ngữ cảnh.
- Interview nên nêu chiến lược: đạt AA toàn hệ thống, AAA cho khu vực quan trọng.

### Example / Ví dụ
```tsx
type WcagLevel = 'A' | 'AA' | 'AAA';

function targetLevel(productType: 'government' | 'enterprise' | 'startup'): WcagLevel {
  if (productType === 'government') return 'AA';
  if (productType === 'enterprise') return 'AA';
  return 'A'; // tối thiểu, sau đó nâng dần
}
```

### Quality/Complexity Notes
- Chi phí tuân thủ tăng theo level; cần ưu tiên theo risk và user impact.
- Đánh giá theo từng journey thay vì chỉ theo từng component rời rạc.

### Frontend Use Case
- Roadmap release: A -> AA theo quý.
- Define non-regression tests cho criteria quan trọng level AA.

## 3) Semantic HTML First / Ưu Tiên Semantic HTML

### 🟢 [Junior] Tổng Quan
- **English:** Use native HTML semantics before ARIA whenever possible.
- **Tiếng Việt:** Ưu tiên phần tử HTML ngữ nghĩa trước, chỉ dùng ARIA khi cần thiết.

### Explanation / Giải thích
- Button phải là <button>, link điều hướng phải là <a>.
- Heading hierarchy đúng giúp screen reader điều hướng nhanh.
- Semantic HTML giảm effort bảo trì và bug accessibility lâu dài.

### Example / Ví dụ
```tsx
// ❌ Anti-pattern
<div onClick={save}>Save</div>

// ✅ Better
<button type="button" onClick={save}>Save</button>

// ✅ Proper landmark
<header>...</header>
<nav aria-label="Primary">...</nav>
<main id="main-content">...</main>
<footer>...</footer>
```

### Quality/Complexity Notes
- Native controls đã có keyboard behavior và accessibility tree mapping chuẩn.
- Custom div-role cần bổ sung nhiều thuộc tính mới đạt mức tương đương native.

### Frontend Use Case
- Giảm bug bàn phím khi dùng button thay div.
- Cải thiện SEO + accessibility đồng thời nhờ semantic structure.

## 4) ARIA Roles, States, Properties / Vai Trò, Trạng Thái, Thuộc Tính ARIA

### 🟡 [Mid] Tổng Quan
- **English:** ARIA augments semantics when native HTML is insufficient.
- **Tiếng Việt:** ARIA bổ sung ngữ nghĩa khi HTML native chưa đủ.

### Explanation / Giải thích
- Role mô tả loại widget; state mô tả trạng thái động; property mô tả quan hệ/tính chất.
- Quy tắc vàng: “No ARIA is better than bad ARIA.”
- Không gắn role mâu thuẫn với semantics native.

### Example / Ví dụ
```tsx
<button
  aria-expanded={isOpen}
  aria-controls="faq-panel-1"
  id="faq-trigger-1"
>
  FAQ 1
</button>
<div
  id="faq-panel-1"
  role="region"
  aria-labelledby="faq-trigger-1"
  hidden={!isOpen}
>
  Answer content
</div>
```

### Quality/Complexity Notes
- Cập nhật state ARIA đồng bộ với UI state để tránh thông tin sai cho screen reader.
- Over-ARIA làm tăng complexity và nguy cơ bug.

### Frontend Use Case
- Accordion, tabs, combobox cần ARIA pattern đúng chuẩn.
- Custom component library nên centralize ARIA logic.

## 5) Keyboard Navigation / Điều Hướng Bằng Bàn Phím

### 🟢 [Junior] Tổng Quan
- **English:** Every interactive control must be reachable and usable by keyboard.
- **Tiếng Việt:** Mọi control tương tác phải truy cập và thao tác được bằng bàn phím.

### Explanation / Giải thích
- Tab order phải theo luồng thị giác và logic.
- Không được chặn outline focus mà không có focus style thay thế.
- Tránh keyboard trap trừ khi có cơ chế Escape rõ ràng (modal).

### Example / Ví dụ
```tsx
function onKeyActivate(e: React.KeyboardEvent, action: () => void) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    action();
  }
}
```

### Quality/Complexity Notes
- Keyboard support là tiêu chí fail-fast trong audit accessibility.
- Cần test thực tế bằng Tab, Shift+Tab, Enter, Space, Escape, Arrow keys.

### Frontend Use Case
- Ứng dụng enterprise với power users phụ thuộc keyboard heavily.
- Đảm bảo component custom vẫn accessible như native widget.

## 6) Focus Management / Quản Lý Focus

### 🟡 [Mid] Tổng Quan
- **English:** Focus management is critical for modals, menus, drawers, and route transitions.
- **Tiếng Việt:** Quản lý focus cực kỳ quan trọng cho modal, menu, drawer và chuyển trang.

### Explanation / Giải thích
- Khi mở modal: đưa focus vào modal, giữ focus trap bên trong.
- Khi đóng modal: trả focus về phần tử kích hoạt trước đó.
- Khi route đổi: đặt focus vào heading/main để screen reader nhận bối cảnh mới.

### Example / Ví dụ
```tsx
function moveFocusToMain() {
  const main = document.getElementById('main-content');
  if (!main) return;
  main.setAttribute('tabindex', '-1');
  main.focus();
}
```

### Quality/Complexity Notes
- Bug focus thường không thấy bằng mắt nhưng ảnh hưởng lớn tới keyboard/screen reader users.
- Nên có integration test cho focus flow ở critical dialogs.

### Frontend Use Case
- Wizard nhiều bước cần focus đúng step header.
- After toast/error message, cân nhắc không “cướp focus” bất ngờ.

## 7) Screen Reader Compatibility / Tương Thích Trình Đọc Màn Hình

### 🟡 [Mid] Tổng Quan
- **English:** Accessible name, role, and state must be announced correctly.
- **Tiếng Việt:** Tên truy cập được (accessible name), vai trò và trạng thái phải được đọc đúng.

### Explanation / Giải thích
- Label phải liên kết input bằng <label for> hoặc aria-labelledby.
- Nội dung cập nhật động cần thông báo qua aria-live phù hợp mức ưu tiên.
- Test đa nền tảng: NVDA + Firefox, VoiceOver + Safari là tối thiểu.

### Example / Ví dụ
```tsx
<div aria-live="polite" aria-atomic="true">{statusMessage}</div>

<label htmlFor="email">Email</label>
<input id="email" type="email" autoComplete="email" />
```

### Quality/Complexity Notes
- Khác biệt behavior giữa screen readers là có thật.
- Nên document “known support matrix” để team thống nhất kỳ vọng.

### Frontend Use Case
- Checkout flow cần thông báo lỗi/tiến trình bằng live region.
- Dashboard realtime cần tránh spam announcements.

## 8) Color Contrast Requirements / Yêu Cầu Tương Phản Màu

### 🟢 [Junior] Tổng Quan
- **English:** WCAG AA: normal text >= 4.5:1, large text >= 3:1.
- **Tiếng Việt:** WCAG AA: chữ thường >= 4.5:1, chữ lớn >= 3:1.

### Explanation / Giải thích
- AAA yêu cầu cao hơn: chữ thường >= 7:1.
- Contrast không chỉ cho text, cần lưu ý icon meaningful và focus indicators.
- Không truyền tải thông tin chỉ bằng màu.

### Example / Ví dụ
```tsx
:root {
  --text-default: #1f2937;
  --bg-default: #ffffff;
  --focus-ring: #1d4ed8;
}

.button:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}
```

### Quality/Complexity Notes
- Contrast checker nên tích hợp vào design token review.
- Dark mode cần kiểm tra riêng vì tỉ lệ có thể đổi mạnh.

### Frontend Use Case
- Thiết kế system tokens với cặp màu đã pass AA.
- CI visual regression có thể thêm contrast linting.

## 9) Accessible Forms / Form Truy Cập Được

### 🟡 [Mid] Tổng Quan
- **English:** Forms need clear labels, hints, errors, and validation feedback.
- **Tiếng Việt:** Form cần nhãn rõ ràng, gợi ý, lỗi và phản hồi validation dễ hiểu.

### Explanation / Giải thích
- Error message nên gắn với input qua aria-describedby.
- Không phụ thuộc placeholder như label duy nhất.
- Báo lỗi theo ngôn ngữ đơn giản, nêu cách sửa cụ thể.

### Example / Ví dụ
```tsx
<label htmlFor="password">Password</label>
<input
  id="password"
  type="password"
  aria-describedby="password-help password-error"
  aria-invalid={Boolean(error)}
/>
<p id="password-help">At least 12 characters.</p>
{error ? <p id="password-error" role="alert">{error}</p> : null}
```

### Quality/Complexity Notes
- Accessible forms giảm drop-off ở funnel và tăng completion rate.
- Validation nên chạy cả client + server, thông báo lỗi nhất quán.

### Frontend Use Case
- Đăng ký tài khoản, checkout, profile update đều hưởng lợi trực tiếp.
- Hạn chế frustration cho keyboard-only và low-vision users.

## 10) Accessible Modals and Dialogs / Modal & Dialog Truy Cập Được

### 🟡 [Mid] Tổng Quan
- **English:** Modal must trap focus, announce dialog semantics, and support Escape.
- **Tiếng Việt:** Modal phải trap focus, công bố ngữ nghĩa dialog, và hỗ trợ Escape.

### Explanation / Giải thích
- Role=dialog hoặc native <dialog> + aria-modal=true khi phù hợp.
- Tiêu đề dialog cần liên kết aria-labelledby.
- Nội dung nền phía sau nên inert/không thể tab tới.

### Example / Ví dụ
```tsx
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Delete item</h2>
  <p>Are you sure?</p>
  <button>Cancel</button>
  <button>Delete</button>
</div>
```

### Quality/Complexity Notes
- Sai focus management trong modal là lỗi phổ biến nhất trong audit.
- Close button cần accessible name rõ ràng.

### Frontend Use Case
- Confirmation dialog trong admin panel.
- Image preview/lightbox cho media app.

## 11) Accessible Images and Media / Hình Ảnh và Media Truy Cập Được

### 🟢 [Junior] Tổng Quan
- **English:** Images need meaningful alt text when informative, empty alt when decorative.
- **Tiếng Việt:** Ảnh cần alt có ý nghĩa nếu mang thông tin, alt rỗng nếu chỉ trang trí.

### Explanation / Giải thích
- Video cần captions; audio cần transcript nếu nội dung quan trọng.
- Icon-only buttons cần aria-label.
- Tránh nhét keyword SEO vào alt gây nhiễu screen reader.

### Example / Ví dụ
```tsx
<img src="chart.png" alt="Revenue increased 24% from Q1 to Q2" />
<img src="divider.svg" alt="" role="presentation" />

<button aria-label="Close">
  <CloseIcon />
</button>
```

### Quality/Complexity Notes
- Alt text chất lượng phụ thuộc context, không có công thức cứng tuyệt đối.
- Cần collaboration giữa content writer, designer và dev.

### Frontend Use Case
- Bài blog kỹ thuật có chart/diagram cần alt mô tả insight chính.
- Product gallery cần keyboard-accessible controls + captions.

## 12) Accessible Tables / Bảng Dữ Liệu Truy Cập Được

### 🟡 [Mid] Tổng Quan
- **English:** Use table markup only for tabular data, not layout.
- **Tiếng Việt:** Chỉ dùng table cho dữ liệu dạng bảng, không dùng để dàn layout.

### Explanation / Giải thích
- Khai báo <th scope="col|row"> để screen reader hiểu header mapping.
- Bảng phức tạp có thể cần headers/id associations.
- Cân nhắc responsive strategy mà vẫn giữ semantics.

### Example / Ví dụ
```tsx
<table>
  <caption>Quarterly revenue</caption>
  <thead>
    <tr><th scope="col">Quarter</th><th scope="col">Revenue</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">Q1</th><td>$120k</td></tr>
    <tr><th scope="row">Q2</th><td>$149k</td></tr>
  </tbody>
</table>
```

### Quality/Complexity Notes
- Table semantics đúng giúp đọc theo hàng/cột rõ ràng.
- Virtualized table cần test kỹ với screen reader announcements.

### Frontend Use Case
- Admin reporting pages.
- Analytics dashboard có dữ liệu tài chính.

## 13) Accessible Navigation / Điều Hướng Truy Cập Được

### 🟢 [Junior] Tổng Quan
- **English:** Navigation should be consistent, predictable, and landmarked.
- **Tiếng Việt:** Điều hướng cần nhất quán, dự đoán được và có landmark rõ.

### Explanation / Giải thích
- Dùng <nav> với aria-label phân biệt nhiều vùng nav.
- Có skip link để bỏ qua menu dài và đi thẳng vào main content.
- Current page nên được đánh dấu bằng aria-current="page".

### Example / Ví dụ
```tsx
<a className="skip-link" href="#main-content">Skip to main content</a>
<nav aria-label="Primary">
  <a href="/docs" aria-current="page">Docs</a>
  <a href="/blog">Blog</a>
</nav>
```

### Quality/Complexity Notes
- Navigation quality ảnh hưởng trực tiếp task completion speed.
- Keyboard users cần skip repetitive blocks để tiết kiệm thao tác.

### Frontend Use Case
- Docs portal nhiều menu nested.
- E-commerce có mega menu phức tạp.

## 14) Testing Tools and Workflow / Công Cụ và Quy Trình Kiểm Thử

### 🟡 [Mid] Tổng Quan
- **English:** Use layered testing: automated + manual assistive tech tests.
- **Tiếng Việt:** Dùng kiểm thử nhiều lớp: tự động + thủ công với công nghệ hỗ trợ.

### Explanation / Giải thích
- axe/Lighthouse phát hiện nhanh lỗi phổ biến.
- NVDA/VoiceOver giúp xác thực trải nghiệm thực tế.
- Accessibility testing nên tích hợp CI/CD như chất lượng mặc định.

### Example / Ví dụ
```tsx
// pseudo npm scripts
{
  "scripts": {
    "a11y:lint": "eslint .",
    "a11y:axe": "playwright test --grep @a11y",
    "a11y:lighthouse": "lighthouse http://localhost:3000 --only-categories=accessibility"
  }
}
```

### Quality/Complexity Notes
- Automation không thay thế hoàn toàn manual testing.
- Nên có smoke checklist theo user journeys quan trọng.

### Frontend Use Case
- PR gate cho component library.
- Release checklist cho critical flows (login/checkout/search).

## 15) React Accessibility Patterns / Pattern Accessibility Trong React

### 🔴 [Senior] Tổng Quan
- **English:** React apps need explicit a11y patterns for dynamic UI updates.
- **Tiếng Việt:** Ứng dụng React cần pattern a11y rõ cho UI động.

### Explanation / Giải thích
- aria-live cho status updates; focus trap cho modal; skip links cho navigation.
- Dùng useId để liên kết label-control ổn định SSR/CSR.
- Tách reusable hooks giúp consistency và giảm regressions.

### Example / Ví dụ
```tsx
import { useEffect, useRef } from 'react';

export function useInitialFocus<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    if (active) ref.current?.focus();
  }, [active]);
  return ref;
}
```

### Quality/Complexity Notes
- Pattern tái sử dụng giúp scale accessibility trong team lớn.
- Component contracts cần mô tả rõ required aria props.

### Frontend Use Case
- Design system primitives: Button, Dialog, Menu, Combobox.
- Cross-team shared hooks cho focus/live announcements.

## 16) Accessibility Anti-patterns / Anti-pattern Phổ Biến

### 🟡 [Mid] Tổng Quan
- **English:** Common anti-patterns cause severe accessibility regressions.
- **Tiếng Việt:** Các anti-pattern phổ biến gây regression accessibility nghiêm trọng.

### Explanation / Giải thích
- Div clickable không role/keyboard support.
- Outline: none không có thay thế focus-visible.
- Placeholder-only forms, icon-only buttons không có label, modal không trap focus.

### Example / Ví dụ
```tsx
// ❌ Avoid
button:focus { outline: none; }

// ✅ Better
button:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

### Quality/Complexity Notes
- Anti-pattern thường xuất hiện khi ưu tiên “đẹp mắt” hơn khả dụng.
- Cần review checklist ở mức component + page.

### Frontend Use Case
- Code review rules cho interactive elements.
- Design QA checklist trước khi release.

## 17) Legal and Compliance: ADA, EN 301 549 / Pháp Lý và Tuân Thủ

### 🔴 [Senior] Tổng Quan
- **English:** Accessibility has legal implications beyond UX quality.
- **Tiếng Việt:** Accessibility có tác động pháp lý, không chỉ là UX.

### Explanation / Giải thích
- ADA liên quan thị trường Mỹ; EN 301 549 quan trọng ở EU public procurement.
- Team cần làm việc với legal/compliance để xác định yêu cầu theo thị trường.
- Giữ bằng chứng test và remediation logs để audit.

### Example / Ví dụ
```tsx
interface ComplianceRecord {
  criterion: string;
  level: 'A' | 'AA' | 'AAA';
  status: 'pass' | 'fail' | 'partial';
  owner: string;
  dueDate: string;
}
```

### Quality/Complexity Notes
- Rủi ro pháp lý tăng khi sản phẩm public-facing quy mô lớn.
- Compliance là quá trình liên tục, không phải trạng thái one-off.

### Frontend Use Case
- Procurement checklist cho khách hàng enterprise/government.
- Accessibility VPAT workflow cho sales + legal + engineering.

## Practical Testing Playbook / Sổ Tay Kiểm Thử Thực Tế
### Overview / Tổng Quan
- **English:** Teams need repeatable accessibility workflows across dev, QA, and release.
- **Tiếng Việt:** Team cần quy trình accessibility lặp lại được xuyên suốt dev, QA và release.

### Explanation / Giải thích
- Bước 1: chạy lint + axe tự động tại PR.
- Bước 2: manual keyboard test cho luồng chính.
- Bước 3: screen reader smoke test (NVDA hoặc VoiceOver).
- Bước 4: kiểm tra color contrast với token thực tế ở dark/light mode.
- Bước 5: log issue theo WCAG criterion để ưu tiên sửa.

### Example / Ví dụ
```ts
type A11yIssue = {
  criterion: string;
  severity: "low" | "medium" | "high";
  page: string;
  fixOwner: string;
};

function prioritize(issue: A11yIssue): number {
  if (issue.severity === "high") return 1;
  if (issue.severity === "medium") return 2;
  return 3;
}
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A
### 🟢 [Junior] WCAG POUR là gì?
- **Giải thích:** POUR gồm Perceivable, Operable, Understandable, Robust.
- **Giải thích (bổ sung):** Đây là 4 nguyên tắc nền tảng cho mọi tiêu chí WCAG.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟢 [Junior] Mức AA có ý nghĩa gì?
- **Giải thích:** AA là mức khuyến nghị phổ biến cho sản phẩm thương mại.
- **Giải thích (bổ sung):** Nó cân bằng giữa khả thi triển khai và trải nghiệm người dùng.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟢 [Junior] Vì sao semantic HTML quan trọng cho accessibility?
- **Giải thích:** Vì browser + assistive tech hiểu semantics native tốt hơn ARIA tùy biến.
- **Giải thích (bổ sung):** Nó giảm code phức tạp và lỗi keyboard/focus.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟢 [Junior] Placeholder có thay label được không?
- **Giải thích:** Không nên, placeholder không thay thế label bền vững.
- **Giải thích (bổ sung):** Label phải luôn rõ ràng và liên kết control.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟡 [Mid] Khi nào dùng ARIA?
- **Giải thích:** Khi HTML native chưa diễn đạt đủ semantics của custom widget.
- **Giải thích (bổ sung):** Nhưng không dùng ARIA để “vá” HTML sai cấu trúc cơ bản.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟡 [Mid] Keyboard trap là gì?
- **Giải thích:** Trạng thái người dùng tab bị kẹt không thoát được vùng tương tác.
- **Giải thích (bổ sung):** Modal đúng chuẩn phải có cơ chế Escape và trả focus về trigger.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟡 [Mid] aria-live dùng khi nào?
- **Giải thích:** Dùng cho cập nhật động không đổi focus, ví dụ status hoặc validation async.
- **Giải thích (bổ sung):** Chọn polite/assertive theo mức khẩn cấp thông tin.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟡 [Mid] Contrast ratio AA cho text thường là bao nhiêu?
- **Giải thích:** Tối thiểu 4.5:1.
- **Giải thích (bổ sung):** Large text có thể dùng 3:1 ở mức AA.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟡 [Mid] Cách kiểm tra accessibility nhanh trong CI?
- **Giải thích:** Dùng axe + Lighthouse để bắt lỗi phổ biến.
- **Giải thích (bổ sung):** Nhưng vẫn cần manual test cho keyboard và screen reader.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🔴 [Senior] Tại sao automation không đủ cho accessibility?
- **Giải thích:** Automation không đánh giá hết quality ngữ cảnh, wording, luồng tương tác thực.
- **Giải thích (bổ sung):** Phải kết hợp test thủ công bằng assistive technologies.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🔴 [Senior] Làm sao scale accessibility trong design system?
- **Giải thích:** Chuẩn hóa primitives accessible-first và test contract ở cấp component.
- **Giải thích (bổ sung):** Tạo hooks/util chung cho focus, aria props, live announcements.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟡 [Mid] Skip link giúp gì?
- **Giải thích:** Cho phép bỏ qua khối lặp (menu/header) và vào nội dung chính nhanh.
- **Giải thích (bổ sung):** Rất hữu ích cho keyboard và screen reader users.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🔴 [Senior] Focus management trong SPA route change nên làm gì?
- **Giải thích:** Đưa focus vào main heading hoặc main landmark sau điều hướng.
- **Giải thích (bổ sung):** Giúp người dùng nhận biết bối cảnh mới ngay lập tức.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟢 [Junior] Ảnh trang trí có alt gì?
- **Giải thích:** alt="" để screen reader bỏ qua.
- **Giải thích (bổ sung):** Không nên mô tả ảnh trang trí gây nhiễu.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟡 [Mid] aria-current dùng ra sao?
- **Giải thích:** Dùng đánh dấu mục điều hướng hiện tại, thường aria-current="page".
- **Giải thích (bổ sung):** Giúp screen reader thông báo vị trí người dùng trong navigation.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🔴 [Senior] Accessibility liên quan pháp lý như thế nào?
- **Giải thích:** Có thể liên quan ADA (Mỹ), EN 301 549 (EU) tùy thị trường.
- **Giải thích (bổ sung):** Tổ chức cần evidence test và kế hoạch remediation rõ ràng.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟡 [Mid] Lỗi phổ biến nhất trong form accessibility?
- **Giải thích:** Thiếu label/description rõ ràng và báo lỗi không liên kết input.
- **Giải thích (bổ sung):** aria-invalid + aria-describedby thường bị thiếu hoặc sai id.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🔴 [Senior] React pattern nào quan trọng cho a11y?
- **Giải thích:** useId cho id ổn định; focus trap cho dialog; aria-live cho status cập nhật.
- **Giải thích (bổ sung):** Kèm theo test E2E keyboard để chống regression.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟢 [Junior] Vì sao không nên xóa outline mặc định?
- **Giải thích:** Outline là chỉ báo focus quan trọng cho keyboard users.
- **Giải thích (bổ sung):** Nếu thay thì phải có focus-visible tương đương hoặc tốt hơn.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟡 [Mid] Bảng dữ liệu cần gì để accessible?
- **Giải thích:** caption, th scope phù hợp, cấu trúc thead/tbody rõ ràng.
- **Giải thích (bổ sung):** Không dùng table cho layout trình bày thuần.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🔴 [Senior] Cách ưu tiên backlog a11y thế nào?
- **Giải thích:** Ưu tiên theo user impact + legal risk + tần suất luồng sử dụng.
- **Giải thích (bổ sung):** Gắn issue với WCAG criterion và severity để minh bạch.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟢 [Junior] Operable trong POUR nghĩa là gì?
- **Giải thích:** Nội dung phải thao tác được bằng nhiều input method.
- **Giải thích (bổ sung):** Bàn phím là baseline bắt buộc.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟡 [Mid] Robust trong POUR thực tế là gì?
- **Giải thích:** Markup semantic đúng và tương thích assistive tech.
- **Giải thích (bổ sung):** Tránh custom controls mơ hồ role/state.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🔴 [Senior] Khi nào dùng role="alert"?
- **Giải thích:** Khi cần thông báo lỗi/critical message ngay lập tức.
- **Giải thích (bổ sung):** Dùng quá nhiều sẽ gây nhiễu vì interrupt screen reader liên tục.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟢 [Junior] Lighthouse score cao có đủ kết luận accessible?
- **Giải thích:** Không đủ, đó chỉ là tín hiệu ban đầu.
- **Giải thích (bổ sung):** Cần test thủ công theo user journeys thực tế.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟡 [Mid] Sự khác nhau giữa focus và selection?
- **Giải thích:** Focus là vị trí bàn phím hiện tại; selection là phần được chọn.
- **Giải thích (bổ sung):** Đừng dùng style selection thay cho focus indicator.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🔴 [Senior] Làm sao tránh regressions a11y dài hạn?
- **Giải thích:** Tích hợp a11y checks vào CI + code review + design review.
- **Giải thích (bổ sung):** Theo dõi metric và bug trend theo quý.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟢 [Junior] Tại sao icon-only button cần aria-label?
- **Giải thích:** Vì không có text visible để screen reader lấy accessible name.
- **Giải thích (bổ sung):** aria-label cung cấp tên hành động rõ ràng.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟡 [Mid] Có nên dùng tabindex lớn hơn 0 không?
- **Giải thích:** Không khuyến khích vì phá tab order tự nhiên.
- **Giải thích (bổ sung):** Ưu tiên thứ tự DOM hợp lý + tabindex=0 khi cần.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🔴 [Senior] Kết hợp accessibility với performance thế nào?
- **Giải thích:** Dùng semantic HTML/native controls vừa tốt a11y vừa giảm JS overhead.
- **Giải thích (bổ sung):** Tối ưu progressive enhancement thay vì custom widget nặng.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟢 [Junior] ARIA có thay được HTML semantics không?
- **Giải thích:** Không, ARIA chỉ bổ sung chứ không thay thế nền tảng semantic đúng.
- **Giải thích (bổ sung):** HTML sai + ARIA nhiều vẫn có thể inaccessible.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟡 [Mid] Test screen reader tối thiểu nên gồm gì?
- **Giải thích:** Kiểm tra landmarks, headings, form labels, error announcements, modal flow.
- **Giải thích (bổ sung):** Chạy ít nhất NVDA/VoiceOver trên luồng quan trọng.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🔴 [Senior] Làm sao trình bày a11y impact với business?
- **Giải thích:** Liên hệ với conversion, churn, legal risk, brand trust.
- **Giải thích (bổ sung):** Nêu dữ liệu cụ thể từ funnel và user feedback.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟢 [Junior] “Không chỉ dùng màu” nghĩa là gì?
- **Giải thích:** Thông tin quan trọng phải có text/icon/pattern bổ sung.
- **Giải thích (bổ sung):** Ví dụ trạng thái lỗi cần icon + message, không chỉ đỏ.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟡 [Mid] Vì sao cần aria-describedby cho input?
- **Giải thích:** Để gắn hint/error context cho control.
- **Giải thích (bổ sung):** Screen reader sẽ đọc thêm thông tin hỗ trợ cần thiết.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🔴 [Senior] Bạn sẽ audit a11y một app hiện có theo thứ tự nào?
- **Giải thích:** Bắt đầu từ pages/flows quan trọng, chạy auto scan, rồi manual keyboard + SR.
- **Giải thích (bổ sung):** Ghi lại theo WCAG criteria, severity, owner, ETA fix.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟢 [Junior] Difference giữa aria-label và aria-labelledby?
- **Giải thích:** aria-label đặt text trực tiếp; aria-labelledby tham chiếu id có sẵn.
- **Giải thích (bổ sung):** Ưu tiên aria-labelledby khi đã có visible label.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🟡 [Mid] Cách xây modal accessible trong React?
- **Giải thích:** Role dialog, aria-modal, title association, focus trap, Escape close, restore focus.
- **Giải thích (bổ sung):** Test Tab loop + screen reader announcement trước release.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

### 🔴 [Senior] AA vs AAA nên chọn thế nào cho enterprise app?
- **Giải thích:** Target AA toàn hệ thống; áp AAA cho khu vực critical nếu khả thi.
- **Giải thích (bổ sung):** Quyết định dựa trên audience, legal requirements, budget.
- **Ví dụ:** Chuẩn bị 1 case thực tế từ dự án của bạn để tăng độ tin cậy khi trả lời.

---

## Quick Audit Checklist / Checklist Audit Nhanh
- [ ] 1. Keyboard-only đi qua toàn bộ flow chính không bị kẹt.
- [ ] 2. Focus indicator rõ ràng ở mọi control tương tác.
- [ ] 3. Landmarks/heading hierarchy hợp lý.
- [ ] 4. Form có label, hint, error liên kết chuẩn.
- [ ] 5. Modal trap focus + restore focus khi đóng.
- [ ] 6. Color contrast pass AA cho text và focus indicator.
- [ ] 7. Live region dùng đúng chỗ, không spam announcements.
- [ ] 8. Bảng dữ liệu dùng semantics table chuẩn.
- [ ] 9. Skip link hoạt động và thấy được khi focus.
- [ ] 10. Đã test với NVDA hoặc VoiceOver cho critical journey.
- [ ] 11. Có evidence compliance theo yêu cầu pháp lý thị trường mục tiêu.

[Back to Table of Contents](../../00-table-of-contents.md)
