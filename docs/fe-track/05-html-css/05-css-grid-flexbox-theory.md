# CSS Grid & Flexbox Theory
## Mastering Modern CSS Layout Systems

[Back to Table of Contents](../../../00-table-of-contents.md) | [Next →](./07-css-architecture-theory.md)

---

## Tổng Quan / Overview

**Giải thích:** Phần theory tập trung mental model, thuật toán layout và trade-off khi chọn Grid hoặc Flexbox.

**Ví dụ:** Khi trả lời phỏng vấn, luôn nêu problem → reasoning → implementation → trade-off.

## Learning Goals

- Understand core concepts in English heading form for interview communication.
- Trình bày được bằng tiếng Việt với ví dụ code ngắn, đúng ngữ cảnh frontend thực tế.
- Map kiến thức sang câu hỏi ở level Junior/Mid/Senior.

## Cross References

- [FE Track Table of Contents](../../../00-table-of-contents.md)
- [Grid & Flexbox Practice](./01-grid-flexbox.md)
- [CSS Fundamentals](./00-css-fundamentals.md)
- [Modern CSS Features](./06-modern-css-features.md)

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q1: Explain layout algorithm in practical interview context — 🟢 [Junior]

**Tổng Quan:** Layout Algorithm là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với layout algorithm, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q2: Explain intrinsic sizing in practical interview context — 🟡 [Mid]

**Tổng Quan:** Intrinsic Sizing là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với intrinsic sizing, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q3: Explain min content max content in practical interview context — 🔴 [Senior]

**Tổng Quan:** Min Content Max Content là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với min content max content, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q4: Explain track sizing in practical interview context — 🟢 [Junior]

**Tổng Quan:** Track Sizing là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với track sizing, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q5: Explain alignment math in practical interview context — 🟡 [Mid]

**Tổng Quan:** Alignment Math là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với alignment math, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q6: Explain axis reasoning in practical interview context — 🔴 [Senior]

**Tổng Quan:** Axis Reasoning là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với axis reasoning, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q7: Explain constraint solving in practical interview context — 🟢 [Junior]

**Tổng Quan:** Constraint Solving là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với constraint solving, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q8: Explain auto placement deep dive in practical interview context — 🟡 [Mid]

**Tổng Quan:** Auto Placement Deep Dive là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với auto placement deep dive, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q9: Explain performance implications in practical interview context — 🔴 [Senior]

**Tổng Quan:** Performance Implications là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với performance implications, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q10: Explain maintainability in practical interview context — 🟢 [Junior]

**Tổng Quan:** Maintainability là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với maintainability, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q11: Explain edge cases in practical interview context — 🟡 [Mid]

**Tổng Quan:** Edge Cases là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với edge cases, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q12: Explain interview articulation in practical interview context — 🔴 [Senior]

**Tổng Quan:** Interview Articulation là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với interview articulation, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q13: Explain layout algorithm in practical interview context — 🟢 [Junior]

**Tổng Quan:** Layout Algorithm là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với layout algorithm, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q14: Explain intrinsic sizing in practical interview context — 🟡 [Mid]

**Tổng Quan:** Intrinsic Sizing là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với intrinsic sizing, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q15: Explain min content max content in practical interview context — 🔴 [Senior]

**Tổng Quan:** Min Content Max Content là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với min content max content, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q16: Explain track sizing in practical interview context — 🟢 [Junior]

**Tổng Quan:** Track Sizing là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với track sizing, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q17: Explain alignment math in practical interview context — 🟡 [Mid]

**Tổng Quan:** Alignment Math là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với alignment math, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q18: Explain axis reasoning in practical interview context — 🔴 [Senior]

**Tổng Quan:** Axis Reasoning là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với axis reasoning, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q19: Explain constraint solving in practical interview context — 🟢 [Junior]

**Tổng Quan:** Constraint Solving là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với constraint solving, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q20: Explain auto placement deep dive in practical interview context — 🟡 [Mid]

**Tổng Quan:** Auto Placement Deep Dive là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với auto placement deep dive, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q21: Explain performance implications in practical interview context — 🔴 [Senior]

**Tổng Quan:** Performance Implications là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với performance implications, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q22: Explain maintainability in practical interview context — 🟢 [Junior]

**Tổng Quan:** Maintainability là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với maintainability, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q23: Explain edge cases in practical interview context — 🟡 [Mid]

**Tổng Quan:** Edge Cases là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với edge cases, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q24: Explain interview articulation in practical interview context — 🔴 [Senior]

**Tổng Quan:** Interview Articulation là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với interview articulation, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q25: Explain layout algorithm in practical interview context — 🟢 [Junior]

**Tổng Quan:** Layout Algorithm là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với layout algorithm, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q26: Explain intrinsic sizing in practical interview context — 🟡 [Mid]

**Tổng Quan:** Intrinsic Sizing là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với intrinsic sizing, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q27: Explain min content max content in practical interview context — 🔴 [Senior]

**Tổng Quan:** Min Content Max Content là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với min content max content, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q28: Explain track sizing in practical interview context — 🟢 [Junior]

**Tổng Quan:** Track Sizing là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với track sizing, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q29: Explain alignment math in practical interview context — 🟡 [Mid]

**Tổng Quan:** Alignment Math là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với alignment math, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q30: Explain axis reasoning in practical interview context — 🔴 [Senior]

**Tổng Quan:** Axis Reasoning là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với axis reasoning, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q31: Explain constraint solving in practical interview context — 🟢 [Junior]

**Tổng Quan:** Constraint Solving là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với constraint solving, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q32: Explain auto placement deep dive in practical interview context — 🟡 [Mid]

**Tổng Quan:** Auto Placement Deep Dive là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với auto placement deep dive, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q33: Explain performance implications in practical interview context — 🔴 [Senior]

**Tổng Quan:** Performance Implications là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với performance implications, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q34: Explain maintainability in practical interview context — 🟢 [Junior]

**Tổng Quan:** Maintainability là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với maintainability, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q35: Explain edge cases in practical interview context — 🟡 [Mid]

**Tổng Quan:** Edge Cases là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với edge cases, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q36: Explain interview articulation in practical interview context — 🔴 [Senior]

**Tổng Quan:** Interview Articulation là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với interview articulation, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q37: Explain layout algorithm in practical interview context — 🟢 [Junior]

**Tổng Quan:** Layout Algorithm là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với layout algorithm, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q38: Explain intrinsic sizing in practical interview context — 🟡 [Mid]

**Tổng Quan:** Intrinsic Sizing là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với intrinsic sizing, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q39: Explain min content max content in practical interview context — 🔴 [Senior]

**Tổng Quan:** Min Content Max Content là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với min content max content, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q40: Explain track sizing in practical interview context — 🟢 [Junior]

**Tổng Quan:** Track Sizing là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với track sizing, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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
