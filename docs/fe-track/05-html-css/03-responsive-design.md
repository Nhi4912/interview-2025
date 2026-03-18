# Responsive Design for Modern Web / Thiết Kế Responsive Cho Web Hiện Đại

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn build một trang web đẹp trên laptop. Designer hài lòng. Nhưng 60% users của bạn dùng điện thoại — và trên mobile, text nhỏ xíu, buttons không thể tap được, và horizontal scroll xuất hiện.

**Vấn đề thực tế:**
- 60% web traffic là mobile (Google Analytics data)
- Google dùng mobile-first indexing — site không responsive = SEO kém
- Thiết kế "desktop first" rồi thu nhỏ khó hơn nhiều so với "mobile first" rồi mở rộng

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng — Nước trong bình:**
Responsive design giống như nước: cùng nội dung, nhưng tự điều chỉnh theo hình dạng container (screen size). Một cột trên mobile, ba cột trên desktop — cùng một HTML, CSS khác nhau.

**Mobile-first vs Desktop-first:**

| Approach | Cách làm | Khi nào |
|----------|----------|---------|
| **Mobile-first** | Viết CSS cho mobile trước, dùng `min-width` media query để thêm desktop style | Recommended — progressive enhancement |
| **Desktop-first** | Viết CSS cho desktop trước, dùng `max-width` để override cho mobile | Legacy approach — graceful degradation |

**Core tools:**
- **Media Queries:** `@media (min-width: 768px)` — apply CSS tại breakpoints
- **Flexible units:** `%`, `vw`, `vh`, `rem`, `em` thay vì `px` cố định
- **CSS Grid `auto-fit`:** `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` — tự động responsive không cần media query
- **Viewport meta tag:** `<meta name="viewport" content="width=device-width, initial-scale=1">` — bắt buộc cho mobile

---

## Concept Map / Bản Đồ Khái Niệm

```
      [CSS Fundamentals + Flexbox/Grid]
              │
              ▼
     [RESPONSIVE DESIGN]  ← bạn đang ở đây
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
[Viewport] [Media]  [Fluid]
meta tag   Queries  Units
           min/max  rem/em
           width    vw/vh/%
           prefers- clamp()
           -scheme
    │
    ▼
[Mobile-first workflow]
Base CSS (mobile) → tablet breakpoint → desktop breakpoint
    │
    ▼
[Advanced Responsive]
Container queries | CSS Grid auto-fit | Fluid typography
clamp(min, preferred, max) | aspect-ratio | fit-content
```

---

## Overview

Responsive design không chỉ là media query.
Đó là chiến lược phân phối trải nghiệm nhất quán trên nhiều kích thước màn hình, density, input mode và điều kiện mạng.

### Overview / Tổng Quan
- Chủ đề chính: media queries, mobile-first, fluid typography, responsive images, container queries, patterns.
- Mục tiêu phỏng vấn: hiểu nguyên lý, trade-off và chiến lược testing.
- Tỷ lệ nội dung: ưu tiên theory, thêm code minh hoạ ngắn, thực dụng.

### Explanation / Giải thích
Thiết kế responsive tốt cần cân bằng giữa readability, performance, accessibility và khả năng maintain của codebase.
Các quyết định không chỉ theo viewport width mà còn theo nội dung, context và user intent.

### Example / Ví dụ
Một dashboard có thể hiển thị 4 cột trên desktop, 2 cột trên tablet và 1 cột trên mobile.
Nhưng nếu bảng dữ liệu dài, responsive tốt còn cần pattern như priority+ hoặc horizontal scroll có chủ đích.

## Media Queries / Truy Vấn Media

### Overview / Tổng Quan
Media query cho phép áp style theo đặc tính thiết bị/viewport.

### Explanation / Giải thích
Thường dùng:
- `min-width` (mobile-first)
- `max-width` (desktop-first)
- `prefers-color-scheme`, `prefers-reduced-motion`
- `hover`, `pointer`

### Example / Ví dụ
```css
.card-list { grid-template-columns: 1fr; }

@media (min-width: 48rem) {
  .card-list { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 64rem) {
  .card-list { grid-template-columns: repeat(3, 1fr); }
}
```

## Mobile-First vs Desktop-First

### Overview / Tổng Quan
Mobile-first bắt đầu từ layout nhỏ nhất rồi tăng dần.
Desktop-first bắt đầu từ layout lớn rồi thu gọn.

### Explanation / Giải thích
- Mobile-first thường dẫn tới CSS gọn hơn và progressive enhancement tốt.
- Desktop-first có thể phù hợp khi sản phẩm chủ yếu enterprise desktop.
- Trong phỏng vấn, cần nhấn mạnh "context-driven", không tuyệt đối hoá.

### Example / Ví dụ
Mobile-first giúp tránh override ngược phức tạp vì base style đã tối giản.

## Fluid Typography / Chữ Linh Hoạt

### Overview / Tổng Quan
Typography linh hoạt giúp văn bản cân bằng giữa thiết bị nhỏ và lớn.

### Explanation / Giải thích
Sử dụng `clamp(min, preferred, max)` để scale mượt thay vì nhảy bậc cứng.

### Example / Ví dụ
```css
:root {
  --step-0: clamp(1rem, 0.95rem + 0.4vw, 1.25rem);
  --step-1: clamp(1.25rem, 1.1rem + 0.8vw, 1.8rem);
}

h1 { font-size: var(--step-1); }
p { font-size: var(--step-0); }
```

## Responsive Images (srcset, picture)

### Overview / Tổng Quan
Ảnh responsive giảm tải mạng và tăng chất lượng hiển thị theo thiết bị.

### Explanation / Giải thích
- `srcset` + `sizes`: trình duyệt chọn ảnh phù hợp.
- `<picture>`: thay source theo breakpoint/format.
- Kết hợp lazy loading và dimension rõ để giảm CLS.

### Example / Ví dụ
```html
<picture>
  <source media="(min-width: 64rem)" srcset="/hero-large.avif" type="image/avif" />
  <source media="(min-width: 40rem)" srcset="/hero-medium.webp" type="image/webp" />
  <img src="/hero-small.jpg" alt="Interview roadmap" width="1200" height="630" loading="lazy" />
</picture>
```

## Viewport Units and Modern Units

### Overview / Tổng Quan
Viewport units mới (`svh`, `lvh`, `dvh`) giải quyết vấn đề thanh địa chỉ mobile.

### Explanation / Giải thích
- `vh` truyền thống có thể gây layout jump trên mobile browser.
- `dvh` phản ánh viewport động hiện tại.
- Dùng fallback phù hợp để tương thích trình duyệt.

### Example / Ví dụ
```css
.fullscreen {
  min-height: 100vh;
  min-height: 100dvh;
}
```

## Container Queries

### Overview / Tổng Quan
Container queries cho phép component tự responsive theo kích thước container, không phụ thuộc viewport toàn cục.

### Explanation / Giải thích
Đây là bước tiến lớn cho component-driven architecture.
Component có thể tái sử dụng ở sidebar, main content, modal mà vẫn thích nghi tốt.

### Example / Ví dụ
```css
.card-grid-wrapper { container-type: inline-size; }

@container (min-width: 36rem) {
  .card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
```

## Responsive Layouts with Flexbox and Grid

### Overview / Tổng Quan
Flexbox mạnh cho layout một chiều; Grid mạnh cho layout hai chiều.

### Explanation / Giải thích
Trong responsive:
- Flexbox tốt cho nav, action group, alignment động.
- Grid tốt cho dashboard, gallery, card system.
- Kết hợp cả hai thường là lựa chọn tốt nhất.

### Example / Ví dụ
```css
.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 64rem) {
  .layout {
    grid-template-columns: 16rem 1fr;
  }
}
```

## Breakpoint Strategy

### Overview / Tổng Quan
Breakpoint nên dựa trên content breakpoints thay vì tên thiết bị cứng.

### Explanation / Giải thích
Đặt breakpoint tại điểm UI "vỡ".
Đừng chase theo danh sách device đang bán trên thị trường.

### Example / Ví dụ
- `40rem`: card từ 1 cột lên 2 cột.
- `64rem`: thêm sidebar cố định.
- `80rem`: tăng whitespace và max-width.

## Responsive Patterns (Off-canvas, Priority+)

### Off-canvas
#### Overview / Tổng Quan
Ẩn navigation phụ ngoài màn hình nhỏ và mở bằng toggle.

#### Explanation / Giải thích
Phù hợp mobile khi không gian hạn chế.
Cần keyboard navigation và focus management tốt.

#### Example / Ví dụ
Menu filter e-commerce trượt từ trái vào trên mobile.

### Priority+
#### Overview / Tổng Quan
Giữ action quan trọng hiển thị, đẩy action phụ vào menu overflow.

#### Explanation / Giải thích
Pattern này giúp top bar không quá tải ở màn hình nhỏ.

#### Example / Ví dụ
Nav có `Home`, `Practice`, `Mock` hiển thị cố định; mục phụ vào "More".

## Responsive Testing Strategy

### Overview / Tổng Quan
Testing responsive gồm manual + automation + visual regression.

### Explanation / Giải thích
- Kiểm thử trên breakpoint chính và "in-between".
- Test orientation change.
- Test zoom 200% cho accessibility.
- Test trên network chậm để đánh giá perceived performance.

### Example / Ví dụ
Checklist smoke test:
1. Không có text bị cắt.
2. Không có nút quá nhỏ.
3. Không có horizontal scroll không chủ đích.
4. Tất cả modal/menu vẫn usable bằng keyboard.

## Accessibility in Responsive Design

### Overview / Tổng Quan
Responsive đúng phải bao gồm accessibility.

### Explanation / Giải thích
- Touch target đủ lớn (khoảng 44x44 CSS px).
- Không khoá user zoom.
- Layout phải giữ thứ tự logic cho screen reader.
- Tôn trọng `prefers-reduced-motion`.

### Example / Ví dụ
```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

## Related References / Tài Liệu Liên Quan
- [Grid & Flexbox Fundamentals](./01-grid-flexbox.md)
- [Modern CSS Features](./06-modern-css-features.md)

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q1. 🟢 [Junior] What is responsive design beyond media queries?
**Tổng Quan**
Câu hỏi tập trung vào tư duy hệ thống khi thiết kế responsive cho sản phẩm thật.

**Giải thích**
Đó là chiến lược xây trải nghiệm thích nghi theo viewport, input, density, và điều kiện sử dụng, không chỉ width.

**Ví dụ**
- Trả lời theo khung: context → decision → trade-off → cách kiểm chứng.
- Nếu có số liệu (CLS/LCP/conversion), điểm thuyết phục cao hơn.
- Nhấn mạnh phối hợp giữa design, FE, QA và accessibility.


### Q2. 🟢 [Junior] Why mobile-first is often recommended?
**Tổng Quan**
Câu hỏi tập trung vào tư duy hệ thống khi thiết kế responsive cho sản phẩm thật.

**Giải thích**
Vì nó buộc thiết kế core content trước, giúp progressive enhancement và thường giảm CSS override.

**Ví dụ**
- Trả lời theo khung: context → decision → trade-off → cách kiểm chứng.
- Nếu có số liệu (CLS/LCP/conversion), điểm thuyết phục cao hơn.
- Nhấn mạnh phối hợp giữa design, FE, QA và accessibility.


### Q3. 🟢 [Junior] When desktop-first can be valid?
**Tổng Quan**
Câu hỏi tập trung vào tư duy hệ thống khi thiết kế responsive cho sản phẩm thật.

**Giải thích**
Khi sản phẩm nội bộ chủ yếu desktop, luồng nghiệp vụ phức tạp ít dùng mobile; tuy nhiên vẫn cần fallback mobile hợp lý.

**Ví dụ**
- Trả lời theo khung: context → decision → trade-off → cách kiểm chứng.
- Nếu có số liệu (CLS/LCP/conversion), điểm thuyết phục cao hơn.
- Nhấn mạnh phối hợp giữa design, FE, QA và accessibility.


### Q4. 🟢 [Junior] How do you choose breakpoints?
**Tổng Quan**
Câu hỏi tập trung vào tư duy hệ thống khi thiết kế responsive cho sản phẩm thật.

**Giải thích**
Chọn theo điểm nội dung bị vỡ (content breakpoints), không theo tên thiết bị cố định.

**Ví dụ**
- Trả lời theo khung: context → decision → trade-off → cách kiểm chứng.
- Nếu có số liệu (CLS/LCP/conversion), điểm thuyết phục cao hơn.
- Nhấn mạnh phối hợp giữa design, FE, QA và accessibility.


### Q5. 🟢 [Junior] What is fluid typography and why use it?
**Tổng Quan**
Câu hỏi tập trung vào tư duy hệ thống khi thiết kế responsive cho sản phẩm thật.

**Giải thích**
Dùng `clamp()` để font scale mượt, giữ readability ổn định giữa thiết bị nhỏ-lớn.

**Ví dụ**
- Trả lời theo khung: context → decision → trade-off → cách kiểm chứng.
- Nếu có số liệu (CLS/LCP/conversion), điểm thuyết phục cao hơn.
- Nhấn mạnh phối hợp giữa design, FE, QA và accessibility.


### Q6. 🟢 [Junior] Difference between srcset and picture?
**Tổng Quan**
Câu hỏi tập trung vào tư duy hệ thống khi thiết kế responsive cho sản phẩm thật.

**Giải thích**
`srcset` chọn biến thể cùng nội dung; `<picture>` mạnh hơn khi cần art direction hoặc đổi format theo điều kiện.

**Ví dụ**
- Trả lời theo khung: context → decision → trade-off → cách kiểm chứng.
- Nếu có số liệu (CLS/LCP/conversion), điểm thuyết phục cao hơn.
- Nhấn mạnh phối hợp giữa design, FE, QA và accessibility.


### Q7. 🟢 [Junior] How to avoid layout shift with images?
**Tổng Quan**
Câu hỏi tập trung vào tư duy hệ thống khi thiết kế responsive cho sản phẩm thật.

**Giải thích**
Khai báo width/height hoặc aspect-ratio, lazy-load hợp lý, chọn kích thước ảnh đúng mục tiêu.

**Ví dụ**
- Trả lời theo khung: context → decision → trade-off → cách kiểm chứng.
- Nếu có số liệu (CLS/LCP/conversion), điểm thuyết phục cao hơn.
- Nhấn mạnh phối hợp giữa design, FE, QA và accessibility.


### Q8. 🟡 [Mid] What are new viewport units used for?
**Tổng Quan**
Câu hỏi tập trung vào tư duy hệ thống khi thiết kế responsive cho sản phẩm thật.

**Giải thích**
`svh/lvh/dvh` xử lý chính xác viewport động trên mobile, giảm jump khi browser UI thay đổi.

**Ví dụ**
- Trả lời theo khung: context → decision → trade-off → cách kiểm chứng.
- Nếu có số liệu (CLS/LCP/conversion), điểm thuyết phục cao hơn.
- Nhấn mạnh phối hợp giữa design, FE, QA và accessibility.


### Q9. 🟡 [Mid] What problem do container queries solve?
**Tổng Quan**
Câu hỏi tập trung vào tư duy hệ thống khi thiết kế responsive cho sản phẩm thật.

**Giải thích**
Giúp component responsive theo kích thước vùng chứa, tăng khả năng tái sử dụng trong nhiều layout.

**Ví dụ**
- Trả lời theo khung: context → decision → trade-off → cách kiểm chứng.
- Nếu có số liệu (CLS/LCP/conversion), điểm thuyết phục cao hơn.
- Nhấn mạnh phối hợp giữa design, FE, QA và accessibility.


### Q10. 🟡 [Mid] Flexbox or Grid for responsive layout?
**Tổng Quan**
Câu hỏi tập trung vào tư duy hệ thống khi thiết kế responsive cho sản phẩm thật.

**Giải thích**
Flexbox cho 1 chiều, Grid cho 2 chiều; thực tế thường kết hợp cả hai.

**Ví dụ**
- Trả lời theo khung: context → decision → trade-off → cách kiểm chứng.
- Nếu có số liệu (CLS/LCP/conversion), điểm thuyết phục cao hơn.
- Nhấn mạnh phối hợp giữa design, FE, QA và accessibility.


### Q11. 🟡 [Mid] Explain off-canvas pattern trade-offs.
**Tổng Quan**
Câu hỏi tập trung vào tư duy hệ thống khi thiết kế responsive cho sản phẩm thật.

**Giải thích**
Tiết kiệm không gian mobile nhưng dễ gây ẩn chức năng; cần icon/label rõ và accessibility đầy đủ.

**Ví dụ**
- Trả lời theo khung: context → decision → trade-off → cách kiểm chứng.
- Nếu có số liệu (CLS/LCP/conversion), điểm thuyết phục cao hơn.
- Nhấn mạnh phối hợp giữa design, FE, QA và accessibility.


### Q12. 🟡 [Mid] What is Priority+ navigation?
**Tổng Quan**
Câu hỏi tập trung vào tư duy hệ thống khi thiết kế responsive cho sản phẩm thật.

**Giải thích**
Giữ mục quan trọng luôn hiện, mục phụ đưa vào overflow khi không đủ chỗ.

**Ví dụ**
- Trả lời theo khung: context → decision → trade-off → cách kiểm chứng.
- Nếu có số liệu (CLS/LCP/conversion), điểm thuyết phục cao hơn.
- Nhấn mạnh phối hợp giữa design, FE, QA và accessibility.


### Q13. 🟡 [Mid] How do you test responsive effectively?
**Tổng Quan**
Câu hỏi tập trung vào tư duy hệ thống khi thiết kế responsive cho sản phẩm thật.

**Giải thích**
Kết hợp manual trên breakpoint + visual regression + test zoom/orientation/network.

**Ví dụ**
- Trả lời theo khung: context → decision → trade-off → cách kiểm chứng.
- Nếu có số liệu (CLS/LCP/conversion), điểm thuyết phục cao hơn.
- Nhấn mạnh phối hợp giữa design, FE, QA và accessibility.


### Q14. 🟡 [Mid] How does accessibility affect responsive decisions?
**Tổng Quan**
Câu hỏi tập trung vào tư duy hệ thống khi thiết kế responsive cho sản phẩm thật.

**Giải thích**
Nó ảnh hưởng kích thước touch target, thứ tự nội dung, motion, contrast và khả năng zoom.

**Ví dụ**
- Trả lời theo khung: context → decision → trade-off → cách kiểm chứng.
- Nếu có số liệu (CLS/LCP/conversion), điểm thuyết phục cao hơn.
- Nhấn mạnh phối hợp giữa design, FE, QA và accessibility.


### Q15. 🟡 [Mid] How to handle responsive tables?
**Tổng Quan**
Câu hỏi tập trung vào tư duy hệ thống khi thiết kế responsive cho sản phẩm thật.

**Giải thích**
Dùng pattern scroll container, stacked rows, hoặc column prioritization tuỳ use case.

**Ví dụ**
- Trả lời theo khung: context → decision → trade-off → cách kiểm chứng.
- Nếu có số liệu (CLS/LCP/conversion), điểm thuyết phục cao hơn.
- Nhấn mạnh phối hợp giữa design, FE, QA và accessibility.


### Q16. 🔴 [Senior] What is intrinsic design?
**Tổng Quan**
Câu hỏi tập trung vào tư duy hệ thống khi thiết kế responsive cho sản phẩm thật.

**Giải thích**
Thiết kế dựa vào nội dung và không gian sẵn có thay vì mapping cứng theo device.

**Ví dụ**
- Trả lời theo khung: context → decision → trade-off → cách kiểm chứng.
- Nếu có số liệu (CLS/LCP/conversion), điểm thuyết phục cao hơn.
- Nhấn mạnh phối hợp giữa design, FE, QA và accessibility.


### Q17. 🔴 [Senior] How to reduce CSS complexity in responsive code?
**Tổng Quan**
Câu hỏi tập trung vào tư duy hệ thống khi thiết kế responsive cho sản phẩm thật.

**Giải thích**
Dùng mobile-first, token spacing/type scale, component boundaries, và hạn chế breakpoint trùng lặp.

**Ví dụ**
- Trả lời theo khung: context → decision → trade-off → cách kiểm chứng.
- Nếu có số liệu (CLS/LCP/conversion), điểm thuyết phục cao hơn.
- Nhấn mạnh phối hợp giữa design, FE, QA và accessibility.


### Q18. 🔴 [Senior] How to combine performance with responsive images?
**Tổng Quan**
Câu hỏi tập trung vào tư duy hệ thống khi thiết kế responsive cho sản phẩm thật.

**Giải thích**
Dùng AVIF/WebP ưu tiên, sizes chính xác, preload hero khi cần, lazy-load phần dưới fold.

**Ví dụ**
- Trả lời theo khung: context → decision → trade-off → cách kiểm chứng.
- Nếu có số liệu (CLS/LCP/conversion), điểm thuyết phục cao hơn.
- Nhấn mạnh phối hợp giữa design, FE, QA và accessibility.


### Q19. 🔴 [Senior] Common responsive anti-patterns?
**Tổng Quan**
Câu hỏi tập trung vào tư duy hệ thống khi thiết kế responsive cho sản phẩm thật.

**Giải thích**
Nút quá nhỏ, text bị cắt, cố định chiều cao cứng, ẩn nội dung quan trọng ở mobile.

**Ví dụ**
- Trả lời theo khung: context → decision → trade-off → cách kiểm chứng.
- Nếu có số liệu (CLS/LCP/conversion), điểm thuyết phục cao hơn.
- Nhấn mạnh phối hợp giữa design, FE, QA và accessibility.


### Q20. 🔴 [Senior] How to explain responsive strategy at senior level?
**Tổng Quan**
Câu hỏi tập trung vào tư duy hệ thống khi thiết kế responsive cho sản phẩm thật.

**Giải thích**
Nêu framework quyết định: content-first, performance budget, accessibility baseline, governance testing.

**Ví dụ**
- Trả lời theo khung: context → decision → trade-off → cách kiểm chứng.
- Nếu có số liệu (CLS/LCP/conversion), điểm thuyết phục cao hơn.
- Nhấn mạnh phối hợp giữa design, FE, QA và accessibility.


### Responsive Drill 1: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 2: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 3: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 4: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 5: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 6: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 7: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 8: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 9: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 10: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 11: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 12: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 13: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 14: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 15: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 16: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 17: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 18: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 19: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 20: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 21: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 22: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 23: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 24: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 25: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 26: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 27: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 28: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 29: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 30: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 31: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


### Responsive Drill 32: Scenario Analysis
**Tổng Quan**
Scenario này mô phỏng một tình huống tối ưu responsive trong team sản phẩm.

**Giải thích**
- Xác định mục tiêu màn hình nhỏ: nhiệm vụ chính của user là gì?
- Xác định thành phần có thể collapse, hide, hoặc defer.
- Kiểm tra ảnh, typography, spacing và hit area.
- Đánh giá tác động hiệu năng khi thêm breakpoint hoặc asset mới.
- Đảm bảo semantic order không bị phá bởi thay đổi layout.

**Ví dụ**
Tình huống mẫu:
1. Trang có bảng dữ liệu 10 cột trên desktop.
2. Mobile chuyển sang priority columns + detail drawer.
3. Dùng horizontal scroll cho cột phụ và sticky cột chính.
4. Đảm bảo keyboard focus không bị kẹt trong off-canvas.
5. Ghi lại decision vào guideline để team dùng lại.


## Summary / Tóm Tắt

Responsive design chất lượng cao là sự kết hợp của layout, content strategy, performance và accessibility.
Trong phỏng vấn, hãy thể hiện bạn biết chọn pattern theo context thay vì áp dụng công thức cứng.

---

## Self-Check / Tự Kiểm Tra

- [ ] Tôi có thể giải thích sự khác biệt giữa `min-width` và `max-width` media queries không?
- [ ] Tôi có thể giải thích tại sao "mobile-first" tốt hơn "desktop-first" approach không?
- [ ] Tôi có thể tạo một responsive layout mà không cần media query (chỉ dùng CSS Grid) không?
- [ ] Tôi có thể giải thích `rem` vs `em` vs `px` và khi nào dùng cái nào không?
- [ ] Tôi có thể implement fluid typography với `clamp()` không?

💬 **Feynman Prompt:** Giải thích "mobile-first design" cho một backend developer. Tại sao bắt đầu từ màn hình nhỏ nhất lại dễ hơn là bắt đầu từ desktop rồi thu nhỏ?

---

## Connections / Liên Kết

- ⬅️ **Built on:** [CSS Fundamentals](./00-css-fundamentals.md) | [Grid & Flexbox](./01-grid-flexbox.md) — responsive design builds on layout tools
- ➡️ **Enables:** [Core Web Vitals](../06-browser-performance/01-core-web-vitals.md) — CLS và LCP bị ảnh hưởng bởi responsive images và layout
- 🔗 **Tools:** Tailwind CSS breakpoints | Bootstrap grid | CSS Container Queries (modern)
