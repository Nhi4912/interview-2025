# WCAG Guidelines / Hướng Dẫn WCAG
## Accessibility - Chapter 1 / Khả Năng Truy Cập - Chương 1

[Back to Table of Contents](../00-table-of-contents.md)

---

## WCAG Principles / Nguyên Tắc WCAG

### POUR Principles

1. **Perceivable** / Có Thể Nhận Thức
   - Provide text alternatives / Cung cấp thay thế văn bản
   - Provide captions and alternatives / Cung cấp phụ đề và thay thế
   - Make content adaptable / Làm nội dung có thể thích ứng
   - Make content distinguishable / Làm nội dung có thể phân biệt

2. **Operable** / Có Thể Vận Hành
   - Keyboard accessible / Truy cập bằng bàn phím
   - Enough time / Đủ thời gian
   - No seizures / Không gây co giật
   - Navigable / Có thể điều hướng

3. **Understandable** / Có Thể Hiểu
   - Readable / Có thể đọc
   - Predictable / Có thể dự đoán
   - Input assistance / Hỗ trợ đầu vào

4. **Robust** / Mạnh Mẽ
   - Compatible / Tương thích

## Semantic HTML

```html
<!-- ❌ Bad / Tồi -->
<div onclick="handleClick()">Click me</div>

<!-- ✅ Good / Tốt -->
<button onclick="handleClick()">Click me</button>

<!-- ❌ Bad / Tồi -->
<div class="heading">Title</div>

<!-- ✅ Good / Tốt -->
<h1>Title</h1>

<!-- Form labels / Nhãn form -->
<label for="email">Email:</label>
<input type="email" id="email" name="email" />
```

## ARIA Attributes

```html
<!-- ARIA roles / Vai trò ARIA -->
<nav role="navigation">
  <ul role="list">
    <li role="listitem"><a href="/">Home</a></li>
  </ul>
</nav>

<!-- ARIA labels / Nhãn ARIA -->
<button aria-label="Close dialog">×</button>

<!-- ARIA states / Trạng thái ARIA -->
<button aria-expanded="false" aria-controls="menu">
  Menu
</button>

<!-- ARIA live regions / Vùng live ARIA -->
<div aria-live="polite" aria-atomic="true">
  Loading...
</div>
```

## Keyboard Navigation

```typescript
function handleKeyDown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Enter':
    case ' ':
      // Activate button / Kích hoạt nút
      handleClick();
      break;
    case 'Escape':
      // Close modal / Đóng modal
      closeModal();
      break;
    case 'Tab':
      // Navigate / Điều hướng
      if (event.shiftKey) {
        // Previous element / Phần tử trước
      } else {
        // Next element / Phần tử tiếp theo
      }
      break;
  }
}
```

## Color Contrast

```css
/* ❌ Bad: Low contrast / Tồi: Độ tương phản thấp */
.text {
  color: #999;
  background: #fff;
}

/* ✅ Good: High contrast / Tốt: Độ tương phản cao */
.text {
  color: #333;
  background: #fff;
}

/* WCAG AA: 4.5:1 for normal text / WCAG AA: 4.5:1 cho văn bản thông thường */
/* WCAG AAA: 7:1 for normal text / WCAG AAA: 7:1 cho văn bản thông thường */
```

---

[Back to Table of Contents](../00-table-of-contents.md)
