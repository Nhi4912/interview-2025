# Next.js Fundamentals
## Next.js - Chapter 0

[Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./01-app-router-server-components.md)

---

## Tổng Quan / Overview

**Giải thích:** Nền tảng Next.js gồm routing, rendering strategies, data fetching, optimization và deployment.

**Ví dụ:** Khi trả lời phỏng vấn, luôn nêu problem → reasoning → implementation → trade-off.

## Learning Goals

- Understand core concepts in English heading form for interview communication.
- Trình bày được bằng tiếng Việt với ví dụ code ngắn, đúng ngữ cảnh frontend thực tế.
- Map kiến thức sang câu hỏi ở level Junior/Mid/Senior.

## Cross References

- [FE Track Table of Contents](../../00-table-of-contents.md)
- [App Router & Server Components](./01-app-router-server-components.md)
- [Data Fetching](./02-data-fetching.md)
- [Web Performance](../06-browser-performance/04-web-performance-comprehensive.md)

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q1: Explain what is nextjs in practical interview context — 🟢 [Junior]

**Tổng Quan:** What Is Nextjs là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với what is nextjs, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() });
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q2: Explain routing in practical interview context — 🟡 [Mid]

**Tổng Quan:** Routing là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với routing, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q3: Explain ssg ssr isr csr in practical interview context — 🔴 [Senior]

**Tổng Quan:** Ssg Ssr Isr Csr là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với ssg ssr isr csr, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q4: Explain data fetching in practical interview context — 🟢 [Junior]

**Tổng Quan:** Data Fetching là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với data fetching, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() });
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q5: Explain api route in practical interview context — 🟡 [Mid]

**Tổng Quan:** Api Route là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với api route, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
const card = document.querySelector('[data-card]');
card?.addEventListener('click', () => {
  card.classList.toggle('expanded');
});
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q6: Explain image optimization in practical interview context — 🔴 [Senior]

**Tổng Quan:** Image Optimization là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với image optimization, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q7: Explain font optimization in practical interview context — 🟢 [Junior]

**Tổng Quan:** Font Optimization là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với font optimization, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q8: Explain metadata in practical interview context — 🟡 [Mid]

**Tổng Quan:** Metadata là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với metadata, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q9: Explain env variables in practical interview context — 🔴 [Senior]

**Tổng Quan:** Env Variables là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với env variables, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q10: Explain middleware in practical interview context — 🟢 [Junior]

**Tổng Quan:** Middleware là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với middleware, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q11: Explain deployment in practical interview context — 🟡 [Mid]

**Tổng Quan:** Deployment là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với deployment, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q12: Explain interview pitfalls in practical interview context — 🔴 [Senior]

**Tổng Quan:** Interview Pitfalls là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với interview pitfalls, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q13: Explain what is nextjs in practical interview context — 🟢 [Junior]

**Tổng Quan:** What Is Nextjs là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với what is nextjs, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() });
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q14: Explain routing in practical interview context — 🟡 [Mid]

**Tổng Quan:** Routing là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với routing, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q15: Explain ssg ssr isr csr in practical interview context — 🔴 [Senior]

**Tổng Quan:** Ssg Ssr Isr Csr là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với ssg ssr isr csr, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q16: Explain data fetching in practical interview context — 🟢 [Junior]

**Tổng Quan:** Data Fetching là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với data fetching, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() });
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q17: Explain api route in practical interview context — 🟡 [Mid]

**Tổng Quan:** Api Route là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với api route, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
const card = document.querySelector('[data-card]');
card?.addEventListener('click', () => {
  card.classList.toggle('expanded');
});
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q18: Explain image optimization in practical interview context — 🔴 [Senior]

**Tổng Quan:** Image Optimization là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với image optimization, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q19: Explain font optimization in practical interview context — 🟢 [Junior]

**Tổng Quan:** Font Optimization là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với font optimization, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q20: Explain metadata in practical interview context — 🟡 [Mid]

**Tổng Quan:** Metadata là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với metadata, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q21: Explain env variables in practical interview context — 🔴 [Senior]

**Tổng Quan:** Env Variables là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với env variables, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q22: Explain middleware in practical interview context — 🟢 [Junior]

**Tổng Quan:** Middleware là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với middleware, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q23: Explain deployment in practical interview context — 🟡 [Mid]

**Tổng Quan:** Deployment là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với deployment, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q24: Explain interview pitfalls in practical interview context — 🔴 [Senior]

**Tổng Quan:** Interview Pitfalls là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với interview pitfalls, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q25: Explain what is nextjs in practical interview context — 🟢 [Junior]

**Tổng Quan:** What Is Nextjs là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với what is nextjs, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() });
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q26: Explain routing in practical interview context — 🟡 [Mid]

**Tổng Quan:** Routing là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với routing, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q27: Explain ssg ssr isr csr in practical interview context — 🔴 [Senior]

**Tổng Quan:** Ssg Ssr Isr Csr là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với ssg ssr isr csr, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q28: Explain data fetching in practical interview context — 🟢 [Junior]

**Tổng Quan:** Data Fetching là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với data fetching, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() });
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q29: Explain api route in practical interview context — 🟡 [Mid]

**Tổng Quan:** Api Route là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với api route, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
const card = document.querySelector('[data-card]');
card?.addEventListener('click', () => {
  card.classList.toggle('expanded');
});
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q30: Explain image optimization in practical interview context — 🔴 [Senior]

**Tổng Quan:** Image Optimization là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với image optimization, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q31: Explain font optimization in practical interview context — 🟢 [Junior]

**Tổng Quan:** Font Optimization là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với font optimization, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q32: Explain metadata in practical interview context — 🟡 [Mid]

**Tổng Quan:** Metadata là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với metadata, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q33: Explain env variables in practical interview context — 🔴 [Senior]

**Tổng Quan:** Env Variables là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với env variables, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q34: Explain middleware in practical interview context — 🟢 [Junior]

**Tổng Quan:** Middleware là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với middleware, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q35: Explain deployment in practical interview context — 🟡 [Mid]

**Tổng Quan:** Deployment là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với deployment, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q36: Explain interview pitfalls in practical interview context — 🔴 [Senior]

**Tổng Quan:** Interview Pitfalls là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với interview pitfalls, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q37: Explain what is nextjs in practical interview context — 🟢 [Junior]

**Tổng Quan:** What Is Nextjs là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với what is nextjs, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() });
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q38: Explain routing in practical interview context — 🟡 [Mid]

**Tổng Quan:** Routing là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với routing, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q39: Explain ssg ssr isr csr in practical interview context — 🔴 [Senior]

**Tổng Quan:** Ssg Ssr Isr Csr là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với ssg ssr isr csr, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q40: Explain data fetching in practical interview context — 🟢 [Junior]

**Tổng Quan:** Data Fetching là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với data fetching, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() });
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

## Quick Recap

- Use English headings to align with interview terminology.
- Dùng phần giải thích tiếng Việt để làm rõ mental model và trade-off.
- Include short code examples (HTML/CSS/JS/TS) to chứng minh tính thực chiến.
