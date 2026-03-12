# CSS Architecture for Scalable Frontend Systems / Kiến Trúc CSS Cho Hệ Thống Frontend Mở Rộng

## Overview

Trong các dự án FE thực tế, CSS thường hỏng không phải vì thiếu syntax, mà vì thiếu kiến trúc.
Tài liệu này tập trung vào cách tổ chức CSS theo tư duy hệ thống để team có thể mở rộng sản phẩm qua nhiều năm.

### Overview / Tổng Quan
- Mục tiêu: viết CSS có thể dự đoán, tái sử dụng, và bảo trì ở quy mô lớn.
- Trọng tâm: methodology (BEM, OOCSS, SMACSS, ITCSS, Atomic CSS), tổ chức file, naming, theming.
- Bối cảnh hiện đại: CSS Modules, utility-first (Tailwind), CSS-in-JS, design tokens.

### Explanation / Giải thích
Kiến trúc CSS là lớp "governance" giữa thiết kế và implementation.
Nếu không có governance, dự án sẽ rơi vào: specificity war, override chồng chéo, style leak, và performance regression.

### Example / Ví dụ
Một class như `.card` trong codebase nhỏ có thể ổn.
Nhưng ở codebase lớn, `.card` có thể bị ghi đè bởi `.dashboard .card`, `.theme-dark .card`, `#app .card`.
Từ đó xuất hiện chuỗi `!important`, làm tăng chi phí bảo trì theo cấp số nhân.

## Why CSS Architecture Matters / Vì Sao Kiến Trúc CSS Quan Trọng

### Overview / Tổng Quan
- Giảm rủi ro regressions khi thêm feature mới.
- Giúp onboarding nhanh cho dev mới.
- Tăng tính nhất quán UI giữa các team.
- Tối ưu bundle CSS và tốc độ render.

### Explanation / Giải thích
Ở hệ thống sản phẩm lớn, "chi phí thay đổi" quan trọng hơn tốc độ viết ban đầu.
Kiến trúc tốt không làm bạn viết CSS nhanh nhất hôm nay, nhưng giúp bạn thay đổi an toàn trong 6-18 tháng tới.

### Example / Ví dụ
Khi product cần dark mode + white-label cùng lúc, codebase có design tokens và layer rõ ràng sẽ implement nhanh hơn đáng kể so với codebase style rời rạc.

## Core Principles / Nguyên Tắc Nền Tảng

### Predictability
#### Overview / Tổng Quan
- Selector đơn giản, không phụ thuộc ngữ cảnh sâu.
- Tránh side effect toàn cục.

#### Explanation / Giải thích
Predictability nghĩa là đọc class name có thể đoán được behavior.
Nếu behavior phụ thuộc chain selector dài, code trở nên "khó suy luận".

#### Example / Ví dụ
Ưu tiên `.button--primary` hơn `.header .cta button`.

### Scalability
#### Overview / Tổng Quan
- CSS phải mở rộng theo số lượng component và số lượng contributor.

#### Explanation / Giải thích
Scalability không chỉ là thêm dòng code; đó là kiểm soát độ phức tạp khi nhiều team cùng sửa.

#### Example / Ví dụ
Tách `tokens`, `components`, `utilities` giúp tránh mọi thứ dồn vào `global.css`.

### Reusability
#### Overview / Tổng Quan
- Tách structure và skin.
- Tái dùng pattern thay vì copy-paste class.

#### Explanation / Giải thích
Reuse tốt giảm duplication, đảm bảo consistency và giảm lỗi visual drift.

#### Example / Ví dụ
`.media` object có thể dùng cho comment, notification, profile list.

### Low Specificity
#### Overview / Tổng Quan
- Giữ specificity thấp để override có chủ đích.

#### Explanation / Giải thích
Specificity cao tạo lock-in: muốn thay đổi phải viết selector cao hơn hoặc dùng `!important`.

#### Example / Ví dụ
Dùng class selector thay vì id selector cho style UI.

## BEM Methodology / Phương Pháp BEM

### Overview / Tổng Quan
BEM (Block, Element, Modifier) là methodology phổ biến nhất để đặt tên class theo cấu trúc component.

### Explanation / Giải thích
- **Block**: thực thể độc lập (`.card`, `.button`, `.navbar`)
- **Element**: phần tử thuộc block (`.card__title`, `.card__body`)
- **Modifier**: biến thể (`.card--featured`, `.button--danger`)

BEM giảm mơ hồ và giúp đọc HTML như đọc API của component.

### Example / Ví dụ
```html
<article class="card card--featured">
  <h3 class="card__title">Senior Frontend Interview</h3>
  <p class="card__description">Systematic prep with theory and drills.</p>
  <button class="card__action button button--primary">Start</button>
</article>
```

```css
.card {}
.card__title {}
.card__description {}
.card--featured {}
.button {}
.button--primary {}
```

### BEM Interview Angle
- Ưu điểm: rõ ràng, scalable, team-friendly.
- Nhược điểm: class name dài, HTML "nặng class".
- Khi dùng: design system, multi-team app, codebase dài hạn.

## OOCSS / Object-Oriented CSS

### Overview / Tổng Quan
OOCSS nhấn mạnh hai nguyên tắc:
1) Tách structure khỏi skin.
2) Tách container khỏi content.

### Explanation / Giải thích
OOCSS xem style như object tái sử dụng.
Bạn định nghĩa object một lần, dùng ở nhiều nơi với skin khác nhau.

### Example / Ví dụ
```css
.media { display: flex; gap: 0.75rem; }
.media__figure { flex: 0 0 auto; }
.media__body { flex: 1; }
.skin-elevated { box-shadow: 0 2px 12px rgb(0 0 0 / 0.08); border-radius: 12px; }
```

```html
<div class="media skin-elevated">
  <img class="media__figure" src="/avatar.png" alt="avatar" />
  <div class="media__body">Interview tips...</div>
</div>
```

## SMACSS / Scalable and Modular Architecture for CSS

### Overview / Tổng Quan
SMACSS phân loại rule theo vai trò để quản lý lớn dễ hơn:
- Base
- Layout
- Module
- State
- Theme

### Explanation / Giải thích
Điểm mạnh của SMACSS là phân lớp tư duy và giảm "style lẫn vai trò".
Base cho reset/typography, Layout cho bố cục lớn, Module cho component, State cho trạng thái, Theme cho brand/theme.

### Example / Ví dụ
```css
/* Base */
html, body { margin: 0; }

/* Layout */
.l-shell { max-width: 1200px; margin-inline: auto; }

/* Module */
.card { border: 1px solid var(--color-border); }

/* State */
.is-loading { opacity: 0.6; pointer-events: none; }

/* Theme */
.theme-dark { --color-border: #2f3542; }
```

## ITCSS / Inverted Triangle CSS

### Overview / Tổng Quan
ITCSS tổ chức CSS từ generic đến cụ thể theo mô hình tam giác ngược:
- Settings
- Tools
- Generic
- Elements
- Objects
- Components
- Utilities

### Explanation / Giải thích
Các layer ở trên có phạm vi ảnh hưởng rộng và specificity thấp.
Các layer dưới cụ thể hơn, ảnh hưởng hẹp hơn.
Mục tiêu là kiểm soát cascade theo kiến trúc thay vì ngẫu nhiên.

### Example / Ví dụ
Một dự án có thể map thành:
- `styles/settings/tokens.css`
- `styles/generic/reset.css`
- `styles/objects/stack.css`
- `styles/components/button.css`
- `styles/utilities/text.css`

## Atomic CSS / Utility-First Thinking

### Overview / Tổng Quan
Atomic CSS định nghĩa class nhỏ, một trách nhiệm (single-purpose), ví dụ `.mt-4`, `.text-sm`, `.flex`.

### Explanation / Giải thích
Ưu điểm:
- tốc độ build UI nhanh,
- consistency cao,
- tránh naming đau đầu.
Nhược điểm:
- HTML dài,
- cần kỷ luật design token,
- có thể khó đọc với người mới.

### Example / Ví dụ
```html
<button class="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
  Apply
</button>
```

## CSS-in-JS vs CSS Modules

### CSS Modules
#### Overview / Tổng Quan
CSS Modules tạo scope cục bộ cho class, tránh xung đột global.

#### Explanation / Giải thích
Trong hệ Next.js/React, CSS Modules là lựa chọn cân bằng giữa performance và maintainability.
Class vẫn là CSS thật, tooling đơn giản, SSR thân thiện.

#### Example / Ví dụ
```tsx
import styles from './Button.module.css'

export function Button() {
  return <button className={styles.root}>Apply</button>
}
```

### CSS-in-JS
#### Overview / Tổng Quan
CSS-in-JS đặt style trong JavaScript/TypeScript để tận dụng dynamic styling và component co-location.

#### Explanation / Giải thích
Ưu điểm: dynamic theme dễ, logic và style gần nhau.
Trade-off: runtime overhead (tuỳ thư viện), SSR complexity, bundle implications.

#### Example / Ví dụ
```tsx
const buttonStyle = {
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
}
```

### Khi nào chọn gì?
- Team ưu tiên simplicity + SSR ổn định: CSS Modules.
- Team cần theming động phức tạp ở runtime: cân nhắc CSS-in-JS.
- Team muốn tốc độ lắp ghép UI cao: utility-first/Tailwind.

## Tailwind Utility-First Approach

### Overview / Tổng Quan
Tailwind hiện thực Atomic CSS ở mức framework + design token system.

### Explanation / Giải thích
Tailwind không chỉ là utility class; nó còn cung cấp scale thống nhất cho spacing, color, typography.
Điểm quan trọng trong phỏng vấn: utility-first không loại bỏ kiến trúc, mà chuyển kiến trúc vào config/token/convention.

### Example / Ví dụ
```html
<section class="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
  <h2 class="text-xl font-semibold md:text-2xl">Interview Plan</h2>
  <p class="mt-2 text-sm text-slate-600">Theory first, then drills.</p>
</section>
```

## Naming Conventions / Quy Ước Đặt Tên

### Overview / Tổng Quan
Naming là hợp đồng giao tiếp giữa dev với dev.

### Explanation / Giải thích
Nguyên tắc tốt:
- Ưu tiên semantic theo vai trò (`card`, `banner`, `hero`) thay vì visual (`blue-box`).
- Trạng thái dùng prefix nhất quán (`is-`, `has-`).
- Utility dùng pattern ngắn, có hệ (`u-text-center`, `u-mt-16`).

### Example / Ví dụ
- Tốt: `.profile-card__avatar`, `.is-active`
- Không tốt: `.leftBlueBig`, `.x1`, `.tmp2`

## File Organization / Tổ Chức File

### Overview / Tổng Quan
Cấu trúc file nên phản ánh architecture.

### Explanation / Giải thích
Ví dụ cấu trúc có chủ đích:
- `styles/tokens/`
- `styles/base/`
- `styles/objects/`
- `styles/components/`
- `styles/utilities/`

Với Next.js App Router và CSS Modules, có thể kết hợp:
- global layer cho tokens/base/utilities
- module file theo component

### Example / Ví dụ
```text
src/
  components/
    Button/
      Button.tsx
      Button.module.css
  styles/
    tokens.css
    globals.css
    utilities.css
```

## Scalable CSS Strategies / Chiến Lược Mở Rộng CSS

### Overview / Tổng Quan
Không có methodology "best" cho mọi dự án; có chiến lược phối hợp.

### Explanation / Giải thích
Một chiến lược thực dụng cho team FE:
1. Dùng design tokens làm nền.
2. Dùng CSS Modules cho component scope.
3. Dùng utility có kiểm soát cho spacing/layout nhanh.
4. Dùng naming convention nhất quán cho state/variant.
5. Giới hạn specificity và cấm deep selector không cần thiết.

### Example / Ví dụ
Trong component phức tạp, áp dụng:
- semantic class cho structure,
- utility class cho micro-adjustment,
- token variable cho theme.

## Theming Patterns / Mẫu Thiết Kế Theme

### Overview / Tổng Quan
Theming là khả năng đổi visual system (dark mode, brand mode, high-contrast) mà không viết lại component.

### Explanation / Giải thích
Pattern phổ biến:
- CSS variables cho token (`--color-bg`, `--color-text`).
- Theme scope bằng attribute/class (`[data-theme='dark']`).
- Component consume token, không hard-code màu.

### Example / Ví dụ
```css
:root {
  --color-bg: #ffffff;
  --color-text: #0f172a;
}

[data-theme='dark'] {
  --color-bg: #0b1020;
  --color-text: #e2e8f0;
}

.page {
  background: var(--color-bg);
  color: var(--color-text);
}
```

## Anti-Patterns / Mùi Hôi Thường Gặp

### Overview / Tổng Quan
- Lạm dụng `!important`
- Selector chain quá sâu
- Global reset phá third-party UI
- Copy-paste style thay vì abstraction
- Không có token system

### Explanation / Giải thích
Các anti-pattern này làm tốc độ thêm feature ban đầu có vẻ nhanh, nhưng tạo "nợ CSS" lớn.

### Example / Ví dụ
Selector như `#app .left-pane .menu ul li a span` là tín hiệu kiến trúc yếu.

## Interview Strategy / Chiến Lược Trả Lời Phỏng Vấn

### Overview / Tổng Quan
Nhà tuyển dụng muốn thấy tư duy trade-off, không chỉ định nghĩa.

### Explanation / Giải thích
Khi trả lời câu hỏi CSS architecture:
1. Nêu context (team size, scale, product stage).
2. Đưa lựa chọn và lý do.
3. Nêu risk + mitigation.
4. Cho ví dụ migration thực tế.

### Example / Ví dụ
"Team 6 người, app B2B nhiều màn hình. Em chọn CSS Modules + token + utility layer. Vì cần tránh global collision, đảm bảo theme consistency, và giữ runtime nhẹ."

## Related References / Tài Liệu Liên Quan
- [Architecture Styles](../../shared/05-software-engineering/02-architecture-styles.md)
- [CSS Architecture Comprehensive](./04-css-architecture-comprehensive.md)
- [CSS Architecture Theory](./07-css-architecture-theory.md)

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q1. 🟢 [Junior] BEM solves what core problem in large projects?
**Tổng Quan**
Câu hỏi này kiểm tra khả năng hiểu mục tiêu kiến trúc CSS thay vì chỉ nhớ định nghĩa.

**Giải thích**
BEM giải quyết xung đột naming và ambiguity giữa component, giúp class name trở thành contract rõ ràng trong team.

**Ví dụ**
- Bối cảnh thực tế: team 5-10 người, nhiều module dùng chung.
- Cách trả lời ngắn: nêu problem → approach → trade-off.
- Follow-up thường gặp: "Nếu scale gấp đôi, bạn thay đổi gì?"


### Q2. 🟢 [Junior] When should we avoid strict BEM everywhere?
**Tổng Quan**
Câu hỏi này kiểm tra khả năng hiểu mục tiêu kiến trúc CSS thay vì chỉ nhớ định nghĩa.

**Giải thích**
Khi dự án nhỏ hoặc prototype ngắn hạn, strict BEM toàn bộ có thể tạo overhead naming không cần thiết.

**Ví dụ**
- Bối cảnh thực tế: team 5-10 người, nhiều module dùng chung.
- Cách trả lời ngắn: nêu problem → approach → trade-off.
- Follow-up thường gặp: "Nếu scale gấp đôi, bạn thay đổi gì?"


### Q3. 🟢 [Junior] How is OOCSS different from BEM?
**Tổng Quan**
Câu hỏi này kiểm tra khả năng hiểu mục tiêu kiến trúc CSS thay vì chỉ nhớ định nghĩa.

**Giải thích**
OOCSS tập trung nguyên tắc tái sử dụng object (structure/skin), còn BEM tập trung naming theo block-element-modifier.

**Ví dụ**
- Bối cảnh thực tế: team 5-10 người, nhiều module dùng chung.
- Cách trả lời ngắn: nêu problem → approach → trade-off.
- Follow-up thường gặp: "Nếu scale gấp đôi, bạn thay đổi gì?"


### Q4. 🟢 [Junior] Explain SMACSS categories quickly.
**Tổng Quan**
Câu hỏi này kiểm tra khả năng hiểu mục tiêu kiến trúc CSS thay vì chỉ nhớ định nghĩa.

**Giải thích**
SMACSS chia rule theo vai trò: Base, Layout, Module, State, Theme để tổ chức và review dễ hơn.

**Ví dụ**
- Bối cảnh thực tế: team 5-10 người, nhiều module dùng chung.
- Cách trả lời ngắn: nêu problem → approach → trade-off.
- Follow-up thường gặp: "Nếu scale gấp đôi, bạn thay đổi gì?"


### Q5. 🟢 [Junior] What is the practical value of ITCSS?
**Tổng Quan**
Câu hỏi này kiểm tra khả năng hiểu mục tiêu kiến trúc CSS thay vì chỉ nhớ định nghĩa.

**Giải thích**
ITCSS kiểm soát cascade qua layer từ generic đến cụ thể, giúp giảm specificity war.

**Ví dụ**
- Bối cảnh thực tế: team 5-10 người, nhiều module dùng chung.
- Cách trả lời ngắn: nêu problem → approach → trade-off.
- Follow-up thường gặp: "Nếu scale gấp đôi, bạn thay đổi gì?"


### Q6. 🟢 [Junior] Atomic CSS benefits and risks?
**Tổng Quan**
Câu hỏi này kiểm tra khả năng hiểu mục tiêu kiến trúc CSS thay vì chỉ nhớ định nghĩa.

**Giải thích**
Lợi ích: tốc độ và consistency; rủi ro: HTML dài, khó đọc nếu team thiếu convention.

**Ví dụ**
- Bối cảnh thực tế: team 5-10 người, nhiều module dùng chung.
- Cách trả lời ngắn: nêu problem → approach → trade-off.
- Follow-up thường gặp: "Nếu scale gấp đôi, bạn thay đổi gì?"


### Q7. 🟢 [Junior] CSS Modules vs CSS-in-JS in SSR context?
**Tổng Quan**
Câu hỏi này kiểm tra khả năng hiểu mục tiêu kiến trúc CSS thay vì chỉ nhớ định nghĩa.

**Giải thích**
CSS Modules thường đơn giản và nhẹ hơn cho SSR; CSS-in-JS cần cân nhắc runtime/SSR extraction tuỳ library.

**Ví dụ**
- Bối cảnh thực tế: team 5-10 người, nhiều module dùng chung.
- Cách trả lời ngắn: nêu problem → approach → trade-off.
- Follow-up thường gặp: "Nếu scale gấp đôi, bạn thay đổi gì?"


### Q8. 🟡 [Mid] Tailwind is architecture or just utilities?
**Tổng Quan**
Câu hỏi này kiểm tra khả năng hiểu mục tiêu kiến trúc CSS thay vì chỉ nhớ định nghĩa.

**Giải thích**
Tailwind là utility-first system + token scale; kiến trúc nằm ở config, convention, component API.

**Ví dụ**
- Bối cảnh thực tế: team 5-10 người, nhiều module dùng chung.
- Cách trả lời ngắn: nêu problem → approach → trade-off.
- Follow-up thường gặp: "Nếu scale gấp đôi, bạn thay đổi gì?"


### Q9. 🟡 [Mid] How to prevent CSS specificity wars?
**Tổng Quan**
Câu hỏi này kiểm tra khả năng hiểu mục tiêu kiến trúc CSS thay vì chỉ nhớ định nghĩa.

**Giải thích**
Giữ selector nông, tránh id selector cho UI, dùng layer nhất quán, review rule cấm `!important` không lý do.

**Ví dụ**
- Bối cảnh thực tế: team 5-10 người, nhiều module dùng chung.
- Cách trả lời ngắn: nêu problem → approach → trade-off.
- Follow-up thường gặp: "Nếu scale gấp đôi, bạn thay đổi gì?"


### Q10. 🟡 [Mid] Best naming convention for states?
**Tổng Quan**
Câu hỏi này kiểm tra khả năng hiểu mục tiêu kiến trúc CSS thay vì chỉ nhớ định nghĩa.

**Giải thích**
Dùng prefix ổn định như `is-`, `has-`, `can-` để biểu thị state rõ ràng.

**Ví dụ**
- Bối cảnh thực tế: team 5-10 người, nhiều module dùng chung.
- Cách trả lời ngắn: nêu problem → approach → trade-off.
- Follow-up thường gặp: "Nếu scale gấp đôi, bạn thay đổi gì?"


### Q11. 🟡 [Mid] How do you organize CSS files in a monorepo?
**Tổng Quan**
Câu hỏi này kiểm tra khả năng hiểu mục tiêu kiến trúc CSS thay vì chỉ nhớ định nghĩa.

**Giải thích**
Tách package tokens chung, component styles theo module, utilities dùng chung có versioning rõ.

**Ví dụ**
- Bối cảnh thực tế: team 5-10 người, nhiều module dùng chung.
- Cách trả lời ngắn: nêu problem → approach → trade-off.
- Follow-up thường gặp: "Nếu scale gấp đôi, bạn thay đổi gì?"


### Q12. 🟡 [Mid] What is a scalable theming approach?
**Tổng Quan**
Câu hỏi này kiểm tra khả năng hiểu mục tiêu kiến trúc CSS thay vì chỉ nhớ định nghĩa.

**Giải thích**
Dùng design tokens + CSS variables + theme scope, component chỉ consume token thay vì hard-code value.

**Ví dụ**
- Bối cảnh thực tế: team 5-10 người, nhiều module dùng chung.
- Cách trả lời ngắn: nêu problem → approach → trade-off.
- Follow-up thường gặp: "Nếu scale gấp đôi, bạn thay đổi gì?"


### Q13. 🟡 [Mid] How to migrate from legacy global CSS?
**Tổng Quan**
Câu hỏi này kiểm tra khả năng hiểu mục tiêu kiến trúc CSS thay vì chỉ nhớ định nghĩa.

**Giải thích**
Làm dần theo strangler pattern: đóng băng global cũ, viết mới bằng module/token, refactor theo feature boundary.

**Ví dụ**
- Bối cảnh thực tế: team 5-10 người, nhiều module dùng chung.
- Cách trả lời ngắn: nêu problem → approach → trade-off.
- Follow-up thường gặp: "Nếu scale gấp đôi, bạn thay đổi gì?"


### Q14. 🟡 [Mid] When is `!important` acceptable?
**Tổng Quan**
Câu hỏi này kiểm tra khả năng hiểu mục tiêu kiến trúc CSS thay vì chỉ nhớ định nghĩa.

**Giải thích**
Chỉ nên dùng trong utility override có chủ đích hoặc xử lý integration edge-case đã document.

**Ví dụ**
- Bối cảnh thực tế: team 5-10 người, nhiều module dùng chung.
- Cách trả lời ngắn: nêu problem → approach → trade-off.
- Follow-up thường gặp: "Nếu scale gấp đôi, bạn thay đổi gì?"


### Q15. 🟡 [Mid] How do design tokens improve CSS architecture?
**Tổng Quan**
Câu hỏi này kiểm tra khả năng hiểu mục tiêu kiến trúc CSS thay vì chỉ nhớ định nghĩa.

**Giải thích**
Token tách quyết định thiết kế khỏi implementation, giúp đổi theme/brand mà ít sửa component.

**Ví dụ**
- Bối cảnh thực tế: team 5-10 người, nhiều module dùng chung.
- Cách trả lời ngắn: nêu problem → approach → trade-off.
- Follow-up thường gặp: "Nếu scale gấp đôi, bạn thay đổi gì?"


### Q16. 🔴 [Senior] What metrics indicate CSS architecture health?
**Tổng Quan**
Câu hỏi này kiểm tra khả năng hiểu mục tiêu kiến trúc CSS thay vì chỉ nhớ định nghĩa.

**Giải thích**
Số lượng override, tỷ lệ selector sâu, tốc độ fix bug UI, tần suất regressions visual.

**Ví dụ**
- Bối cảnh thực tế: team 5-10 người, nhiều module dùng chung.
- Cách trả lời ngắn: nêu problem → approach → trade-off.
- Follow-up thường gặp: "Nếu scale gấp đôi, bạn thay đổi gì?"


### Q17. 🔴 [Senior] How do you handle 3rd-party component styling safely?
**Tổng Quan**
Câu hỏi này kiểm tra khả năng hiểu mục tiêu kiến trúc CSS thay vì chỉ nhớ định nghĩa.

**Giải thích**
Bao scope integration layer, tránh sửa global mạnh tay, ưu tiên API theme của thư viện.

**Ví dụ**
- Bối cảnh thực tế: team 5-10 người, nhiều module dùng chung.
- Cách trả lời ngắn: nêu problem → approach → trade-off.
- Follow-up thường gặp: "Nếu scale gấp đôi, bạn thay đổi gì?"


### Q18. 🔴 [Senior] Can utility-first and semantic CSS coexist?
**Tổng Quan**
Câu hỏi này kiểm tra khả năng hiểu mục tiêu kiến trúc CSS thay vì chỉ nhớ định nghĩa.

**Giải thích**
Có, semantic cho structure component, utility cho adjustment nhỏ để giữ tốc độ và readability.

**Ví dụ**
- Bối cảnh thực tế: team 5-10 người, nhiều module dùng chung.
- Cách trả lời ngắn: nêu problem → approach → trade-off.
- Follow-up thường gặp: "Nếu scale gấp đôi, bạn thay đổi gì?"


### Q19. 🔴 [Senior] How do you enforce architecture in team?
**Tổng Quan**
Câu hỏi này kiểm tra khả năng hiểu mục tiêu kiến trúc CSS thay vì chỉ nhớ định nghĩa.

**Giải thích**
Document convention, lint rule, PR checklist, và refactor budget theo sprint.

**Ví dụ**
- Bối cảnh thực tế: team 5-10 người, nhiều module dùng chung.
- Cách trả lời ngắn: nêu problem → approach → trade-off.
- Follow-up thường gặp: "Nếu scale gấp đôi, bạn thay đổi gì?"


### Q20. 🔴 [Senior] What is the biggest CSS architecture mistake?
**Tổng Quan**
Câu hỏi này kiểm tra khả năng hiểu mục tiêu kiến trúc CSS thay vì chỉ nhớ định nghĩa.

**Giải thích**
Không có shared convention ngay từ đầu, dẫn đến mỗi dev một style và chi phí hợp nhất rất cao.

**Ví dụ**
- Bối cảnh thực tế: team 5-10 người, nhiều module dùng chung.
- Cách trả lời ngắn: nêu problem → approach → trade-off.
- Follow-up thường gặp: "Nếu scale gấp đôi, bạn thay đổi gì?"


### Architecture Drill 1: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 2: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 3: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 4: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 5: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 6: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 7: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 8: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 9: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 10: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 11: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 12: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 13: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 14: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 15: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 16: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 17: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 18: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 19: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 20: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 21: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 22: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 23: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 24: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 25: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 26: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 27: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 28: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 29: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


### Architecture Drill 30: Pattern Review
**Tổng Quan**
Bài drill này mô phỏng review CSS PR trong môi trường production.

**Giải thích**
- Xác định methodology đang dùng (BEM/OOCSS/SMACSS/ITCSS/Atomic).
- Kiểm tra naming có nhất quán với guideline không.
- Đánh giá mức độ coupling giữa component và layout.
- Kiểm tra token usage và khả năng theme switching.
- Ước lượng chi phí bảo trì sau 3-6 tháng.

**Ví dụ**
Checklist ngắn:
1. Có class trạng thái rõ ràng (`is-`, `has-`) chưa?
2. Có selector vượt quá 3 level không?
3. Có hard-coded color thay vì token không?
4. Có dùng `!important` mà thiếu comment lý do không?
5. Có cross-reference với docs kiến trúc hiện tại không?


## Summary / Tóm Tắt

Kiến trúc CSS tốt là nền tảng để frontend scale bền vững.
Khi trả lời phỏng vấn, hãy luôn nói theo ngữ cảnh team + trade-off + chiến lược migration.
