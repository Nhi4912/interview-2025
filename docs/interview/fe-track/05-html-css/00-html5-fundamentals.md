# HTML5 Fundamentals
## HTML - Chapter 0

[Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./00-css-fundamentals.md)

---

## Tổng Quan / Overview

**Giải thích:** HTML5 tập trung semantic structure, accessibility, forms, media, metadata và best practices cho SEO.

**Ví dụ:** Khi trả lời phỏng vấn, luôn nêu problem → reasoning → implementation → trade-off.

## Learning Goals

- Understand core concepts in English heading form for interview communication.
- Trình bày được bằng tiếng Việt với ví dụ code ngắn, đúng ngữ cảnh frontend thực tế.
- Map kiến thức sang câu hỏi ở level Junior/Mid/Senior.

## Cross References

- [FE Track Table of Contents](../../00-table-of-contents.md)
- [CSS Fundamentals](./00-css-fundamentals.md)
- [Responsive Design](./03-responsive-design.md)
- [Web Security (tham khảo)](../07-web-security/01-common-vulnerabilities.md)

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q1: Explain semantic html in practical interview context — 🟢 [Junior]

**Tổng Quan:** Semantic Html là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với semantic html, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  padding: 16px;
  border: 1px solid var(--border, #d0d7de);
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q2: Explain document outline in practical interview context — 🟡 [Mid]

**Tổng Quan:** Document Outline là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với document outline, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q3: Explain forms in practical interview context — 🔴 [Senior]

**Tổng Quan:** Forms là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với forms, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q4: Explain validation in practical interview context — 🟢 [Junior]

**Tổng Quan:** Validation là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với validation, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  padding: 16px;
  border: 1px solid var(--border, #d0d7de);
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q5: Explain a11y in practical interview context — 🟡 [Mid]

**Tổng Quan:** A11Y là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với a11y, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q6: Explain seo in practical interview context — 🔴 [Senior]

**Tổng Quan:** Seo là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với seo, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q7: Explain meta tags in practical interview context — 🟢 [Junior]

**Tổng Quan:** Meta Tags là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với meta tags, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  padding: 16px;
  border: 1px solid var(--border, #d0d7de);
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q8: Explain landmarks in practical interview context — 🟡 [Mid]

**Tổng Quan:** Landmarks là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với landmarks, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q9: Explain media in practical interview context — 🔴 [Senior]

**Tổng Quan:** Media là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với media, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q10: Explain tables in practical interview context — 🟢 [Junior]

**Tổng Quan:** Tables là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với tables, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  padding: 16px;
  border: 1px solid var(--border, #d0d7de);
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q11: Explain custom data attributes in practical interview context — 🟡 [Mid]

**Tổng Quan:** Custom Data Attributes là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với custom data attributes, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q12: Explain script loading in practical interview context — 🔴 [Senior]

**Tổng Quan:** Script Loading là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với script loading, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q13: Explain semantic html in practical interview context — 🟢 [Junior]

**Tổng Quan:** Semantic Html là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với semantic html, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  padding: 16px;
  border: 1px solid var(--border, #d0d7de);
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q14: Explain document outline in practical interview context — 🟡 [Mid]

**Tổng Quan:** Document Outline là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với document outline, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q15: Explain forms in practical interview context — 🔴 [Senior]

**Tổng Quan:** Forms là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với forms, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q16: Explain validation in practical interview context — 🟢 [Junior]

**Tổng Quan:** Validation là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với validation, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  padding: 16px;
  border: 1px solid var(--border, #d0d7de);
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q17: Explain a11y in practical interview context — 🟡 [Mid]

**Tổng Quan:** A11Y là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với a11y, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q18: Explain seo in practical interview context — 🔴 [Senior]

**Tổng Quan:** Seo là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với seo, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q19: Explain meta tags in practical interview context — 🟢 [Junior]

**Tổng Quan:** Meta Tags là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với meta tags, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  padding: 16px;
  border: 1px solid var(--border, #d0d7de);
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q20: Explain landmarks in practical interview context — 🟡 [Mid]

**Tổng Quan:** Landmarks là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với landmarks, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q21: Explain media in practical interview context — 🔴 [Senior]

**Tổng Quan:** Media là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với media, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q22: Explain tables in practical interview context — 🟢 [Junior]

**Tổng Quan:** Tables là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với tables, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  padding: 16px;
  border: 1px solid var(--border, #d0d7de);
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q23: Explain custom data attributes in practical interview context — 🟡 [Mid]

**Tổng Quan:** Custom Data Attributes là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với custom data attributes, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q24: Explain script loading in practical interview context — 🔴 [Senior]

**Tổng Quan:** Script Loading là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với script loading, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q25: Explain semantic html in practical interview context — 🟢 [Junior]

**Tổng Quan:** Semantic Html là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với semantic html, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  padding: 16px;
  border: 1px solid var(--border, #d0d7de);
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q26: Explain document outline in practical interview context — 🟡 [Mid]

**Tổng Quan:** Document Outline là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với document outline, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q27: Explain forms in practical interview context — 🔴 [Senior]

**Tổng Quan:** Forms là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với forms, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q28: Explain validation in practical interview context — 🟢 [Junior]

**Tổng Quan:** Validation là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với validation, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  padding: 16px;
  border: 1px solid var(--border, #d0d7de);
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q29: Explain a11y in practical interview context — 🟡 [Mid]

**Tổng Quan:** A11Y là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với a11y, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q30: Explain seo in practical interview context — 🔴 [Senior]

**Tổng Quan:** Seo là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với seo, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q31: Explain meta tags in practical interview context — 🟢 [Junior]

**Tổng Quan:** Meta Tags là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với meta tags, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  padding: 16px;
  border: 1px solid var(--border, #d0d7de);
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q32: Explain landmarks in practical interview context — 🟡 [Mid]

**Tổng Quan:** Landmarks là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với landmarks, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q33: Explain media in practical interview context — 🔴 [Senior]

**Tổng Quan:** Media là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với media, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q34: Explain tables in practical interview context — 🟢 [Junior]

**Tổng Quan:** Tables là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với tables, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  padding: 16px;
  border: 1px solid var(--border, #d0d7de);
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q35: Explain custom data attributes in practical interview context — 🟡 [Mid]

**Tổng Quan:** Custom Data Attributes là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với custom data attributes, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q36: Explain script loading in practical interview context — 🔴 [Senior]

**Tổng Quan:** Script Loading là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với script loading, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q37: Explain semantic html in practical interview context — 🟢 [Junior]

**Tổng Quan:** Semantic Html là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với semantic html, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  padding: 16px;
  border: 1px solid var(--border, #d0d7de);
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q38: Explain document outline in practical interview context — 🟡 [Mid]

**Tổng Quan:** Document Outline là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với document outline, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q39: Explain forms in practical interview context — 🔴 [Senior]

**Tổng Quan:** Forms là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với forms, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q40: Explain validation in practical interview context — 🟢 [Junior]

**Tổng Quan:** Validation là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với validation, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  padding: 16px;
  border: 1px solid var(--border, #d0d7de);
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

## Quick Recap

- Use English headings to align with interview terminology.
- Dùng phần giải thích tiếng Việt để làm rõ mental model và trade-off.
- Include short code examples (HTML/CSS/JS/TS) to chứng minh tính thực chiến.
