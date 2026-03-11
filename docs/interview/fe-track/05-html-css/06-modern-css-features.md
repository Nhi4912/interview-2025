# Modern CSS Features
## CSS - Chapter 6

[Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./07-css-architecture-theory.md)

---

## Tổng Quan / Overview

**Giải thích:** Modern CSS gồm container queries, layer, nesting, :has(), subgrid, logical properties và animation hiện đại.

**Ví dụ:** Khi trả lời phỏng vấn, luôn nêu problem → reasoning → implementation → trade-off.

## Learning Goals

- Understand core concepts in English heading form for interview communication.
- Trình bày được bằng tiếng Việt với ví dụ code ngắn, đúng ngữ cảnh frontend thực tế.
- Map kiến thức sang câu hỏi ở level Junior/Mid/Senior.

## Cross References

- [FE Track Table of Contents](../../00-table-of-contents.md)
- [Grid & Flexbox](./01-grid-flexbox.md)
- [CSS Architecture Theory](./07-css-architecture-theory.md)
- [Bundle Optimization](../06-browser-performance/03-bundle-optimization.md)

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q1: Explain container query in practical interview context — 🟢 [Junior]

**Tổng Quan:** Container Query là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với container query, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q2: Explain css nesting in practical interview context — 🟡 [Mid]

**Tổng Quan:** Css Nesting là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với css nesting, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q3: Explain cascade layer in practical interview context — 🔴 [Senior]

**Tổng Quan:** Cascade Layer là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với cascade layer, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q4: Explain :has selector in practical interview context — 🟢 [Junior]

**Tổng Quan:** :Has Selector là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với :has selector, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q5: Explain subgrid in practical interview context — 🟡 [Mid]

**Tổng Quan:** Subgrid là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với subgrid, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q6: Explain logical properties in practical interview context — 🔴 [Senior]

**Tổng Quan:** Logical Properties là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với logical properties, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q7: Explain color functions in practical interview context — 🟢 [Junior]

**Tổng Quan:** Color Functions là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với color functions, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q8: Explain clamp min max in practical interview context — 🟡 [Mid]

**Tổng Quan:** Clamp Min Max là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với clamp min max, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q9: Explain scroll timeline in practical interview context — 🔴 [Senior]

**Tổng Quan:** Scroll Timeline là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với scroll timeline, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q10: Explain view transition in practical interview context — 🟢 [Junior]

**Tổng Quan:** View Transition là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với view transition, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q11: Explain anchor positioning in practical interview context — 🟡 [Mid]

**Tổng Quan:** Anchor Positioning là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với anchor positioning, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q12: Explain progressive enhancement in practical interview context — 🔴 [Senior]

**Tổng Quan:** Progressive Enhancement là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với progressive enhancement, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q13: Explain container query in practical interview context — 🟢 [Junior]

**Tổng Quan:** Container Query là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với container query, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q14: Explain css nesting in practical interview context — 🟡 [Mid]

**Tổng Quan:** Css Nesting là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với css nesting, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q15: Explain cascade layer in practical interview context — 🔴 [Senior]

**Tổng Quan:** Cascade Layer là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với cascade layer, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q16: Explain :has selector in practical interview context — 🟢 [Junior]

**Tổng Quan:** :Has Selector là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với :has selector, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q17: Explain subgrid in practical interview context — 🟡 [Mid]

**Tổng Quan:** Subgrid là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với subgrid, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q18: Explain logical properties in practical interview context — 🔴 [Senior]

**Tổng Quan:** Logical Properties là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với logical properties, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q19: Explain color functions in practical interview context — 🟢 [Junior]

**Tổng Quan:** Color Functions là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với color functions, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q20: Explain clamp min max in practical interview context — 🟡 [Mid]

**Tổng Quan:** Clamp Min Max là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với clamp min max, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q21: Explain scroll timeline in practical interview context — 🔴 [Senior]

**Tổng Quan:** Scroll Timeline là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với scroll timeline, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q22: Explain view transition in practical interview context — 🟢 [Junior]

**Tổng Quan:** View Transition là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với view transition, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q23: Explain anchor positioning in practical interview context — 🟡 [Mid]

**Tổng Quan:** Anchor Positioning là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với anchor positioning, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q24: Explain progressive enhancement in practical interview context — 🔴 [Senior]

**Tổng Quan:** Progressive Enhancement là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với progressive enhancement, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q25: Explain container query in practical interview context — 🟢 [Junior]

**Tổng Quan:** Container Query là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với container query, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q26: Explain css nesting in practical interview context — 🟡 [Mid]

**Tổng Quan:** Css Nesting là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với css nesting, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q27: Explain cascade layer in practical interview context — 🔴 [Senior]

**Tổng Quan:** Cascade Layer là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với cascade layer, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q28: Explain :has selector in practical interview context — 🟢 [Junior]

**Tổng Quan:** :Has Selector là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với :has selector, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q29: Explain subgrid in practical interview context — 🟡 [Mid]

**Tổng Quan:** Subgrid là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với subgrid, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q30: Explain logical properties in practical interview context — 🔴 [Senior]

**Tổng Quan:** Logical Properties là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với logical properties, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q31: Explain color functions in practical interview context — 🟢 [Junior]

**Tổng Quan:** Color Functions là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với color functions, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q32: Explain clamp min max in practical interview context — 🟡 [Mid]

**Tổng Quan:** Clamp Min Max là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với clamp min max, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q33: Explain scroll timeline in practical interview context — 🔴 [Senior]

**Tổng Quan:** Scroll Timeline là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với scroll timeline, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q34: Explain view transition in practical interview context — 🟢 [Junior]

**Tổng Quan:** View Transition là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với view transition, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q35: Explain anchor positioning in practical interview context — 🟡 [Mid]

**Tổng Quan:** Anchor Positioning là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với anchor positioning, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q36: Explain progressive enhancement in practical interview context — 🔴 [Senior]

**Tổng Quan:** Progressive Enhancement là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với progressive enhancement, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q37: Explain container query in practical interview context — 🟢 [Junior]

**Tổng Quan:** Container Query là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với container query, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q38: Explain css nesting in practical interview context — 🟡 [Mid]

**Tổng Quan:** Css Nesting là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với css nesting, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q39: Explain cascade layer in practical interview context — 🔴 [Senior]

**Tổng Quan:** Cascade Layer là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với cascade layer, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q40: Explain :has selector in practical interview context — 🟢 [Junior]

**Tổng Quan:** :Has Selector là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với :has selector, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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
