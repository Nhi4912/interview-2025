# App Router & Server Components
## Next.js - Chapter 1

[Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./02-data-fetching.md)

---

## Tổng Quan / Overview

**Giải thích:** App Router sử dụng React Server Components mặc định, hỗ trợ streaming, nested layout và route conventions.

**Ví dụ:** Khi trả lời phỏng vấn, luôn nêu problem → reasoning → implementation → trade-off.

## Learning Goals

- Understand core concepts in English heading form for interview communication.
- Trình bày được bằng tiếng Việt với ví dụ code ngắn, đúng ngữ cảnh frontend thực tế.
- Map kiến thức sang câu hỏi ở level Junior/Mid/Senior.

## Cross References

- [FE Track Table of Contents](../../00-table-of-contents.md)
- [Next.js Fundamentals](./00-nextjs-fundamentals.md)
- [Data Fetching & Caching](./02-data-fetching.md)
- [Next.js Architecture](./03-nextjs-architecture.md)

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q1: Explain server component in practical interview context — 🟢 [Junior]

**Tổng Quan:** Server Component là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với server component, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() });
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q2: Explain client boundary in practical interview context — 🟡 [Mid]

**Tổng Quan:** Client Boundary là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với client boundary, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q3: Explain layout template in practical interview context — 🔴 [Senior]

**Tổng Quan:** Layout Template là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với layout template, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q4: Explain loading error in practical interview context — 🟢 [Junior]

**Tổng Quan:** Loading Error là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với loading error, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q5: Explain suspense streaming in practical interview context — 🟡 [Mid]

**Tổng Quan:** Suspense Streaming là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với suspense streaming, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q6: Explain route group in practical interview context — 🔴 [Senior]

**Tổng Quan:** Route Group là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với route group, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```tsx
export default async function Page() {
  const res = await fetch('https://api.example.com/posts', { next: { revalidate: 60 } });
  const posts = await res.json();
  return <main>{posts.map((p: { id: number; title: string }) => <p key={p.id}>{p.title}</p>)}</main>;
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q7: Explain parallel routes in practical interview context — 🟢 [Junior]

**Tổng Quan:** Parallel Routes là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với parallel routes, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() });
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q8: Explain intercepting route in practical interview context — 🟡 [Mid]

**Tổng Quan:** Intercepting Route là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với intercepting route, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
const card = document.querySelector('[data-card]');
card?.addEventListener('click', () => {
  card.classList.toggle('expanded');
});
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q9: Explain server action in practical interview context — 🔴 [Senior]

**Tổng Quan:** Server Action là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với server action, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```tsx
export default async function Page() {
  const res = await fetch('https://api.example.com/posts', { next: { revalidate: 60 } });
  const posts = await res.json();
  return <main>{posts.map((p: { id: number; title: string }) => <p key={p.id}>{p.title}</p>)}</main>;
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q10: Explain cache revalidate in practical interview context — 🟢 [Junior]

**Tổng Quan:** Cache Revalidate là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với cache revalidate, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q11: Explain auth guard in practical interview context — 🟡 [Mid]

**Tổng Quan:** Auth Guard là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với auth guard, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q12: Explain migration in practical interview context — 🔴 [Senior]

**Tổng Quan:** Migration là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với migration, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q13: Explain server component in practical interview context — 🟢 [Junior]

**Tổng Quan:** Server Component là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với server component, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() });
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q14: Explain client boundary in practical interview context — 🟡 [Mid]

**Tổng Quan:** Client Boundary là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với client boundary, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q15: Explain layout template in practical interview context — 🔴 [Senior]

**Tổng Quan:** Layout Template là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với layout template, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q16: Explain loading error in practical interview context — 🟢 [Junior]

**Tổng Quan:** Loading Error là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với loading error, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q17: Explain suspense streaming in practical interview context — 🟡 [Mid]

**Tổng Quan:** Suspense Streaming là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với suspense streaming, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q18: Explain route group in practical interview context — 🔴 [Senior]

**Tổng Quan:** Route Group là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với route group, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```tsx
export default async function Page() {
  const res = await fetch('https://api.example.com/posts', { next: { revalidate: 60 } });
  const posts = await res.json();
  return <main>{posts.map((p: { id: number; title: string }) => <p key={p.id}>{p.title}</p>)}</main>;
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q19: Explain parallel routes in practical interview context — 🟢 [Junior]

**Tổng Quan:** Parallel Routes là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với parallel routes, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() });
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q20: Explain intercepting route in practical interview context — 🟡 [Mid]

**Tổng Quan:** Intercepting Route là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với intercepting route, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
const card = document.querySelector('[data-card]');
card?.addEventListener('click', () => {
  card.classList.toggle('expanded');
});
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q21: Explain server action in practical interview context — 🔴 [Senior]

**Tổng Quan:** Server Action là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với server action, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```tsx
export default async function Page() {
  const res = await fetch('https://api.example.com/posts', { next: { revalidate: 60 } });
  const posts = await res.json();
  return <main>{posts.map((p: { id: number; title: string }) => <p key={p.id}>{p.title}</p>)}</main>;
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q22: Explain cache revalidate in practical interview context — 🟢 [Junior]

**Tổng Quan:** Cache Revalidate là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với cache revalidate, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q23: Explain auth guard in practical interview context — 🟡 [Mid]

**Tổng Quan:** Auth Guard là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với auth guard, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q24: Explain migration in practical interview context — 🔴 [Senior]

**Tổng Quan:** Migration là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với migration, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q25: Explain server component in practical interview context — 🟢 [Junior]

**Tổng Quan:** Server Component là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với server component, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() });
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q26: Explain client boundary in practical interview context — 🟡 [Mid]

**Tổng Quan:** Client Boundary là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với client boundary, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q27: Explain layout template in practical interview context — 🔴 [Senior]

**Tổng Quan:** Layout Template là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với layout template, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q28: Explain loading error in practical interview context — 🟢 [Junior]

**Tổng Quan:** Loading Error là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với loading error, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q29: Explain suspense streaming in practical interview context — 🟡 [Mid]

**Tổng Quan:** Suspense Streaming là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với suspense streaming, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q30: Explain route group in practical interview context — 🔴 [Senior]

**Tổng Quan:** Route Group là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với route group, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```tsx
export default async function Page() {
  const res = await fetch('https://api.example.com/posts', { next: { revalidate: 60 } });
  const posts = await res.json();
  return <main>{posts.map((p: { id: number; title: string }) => <p key={p.id}>{p.title}</p>)}</main>;
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q31: Explain parallel routes in practical interview context — 🟢 [Junior]

**Tổng Quan:** Parallel Routes là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với parallel routes, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() });
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q32: Explain intercepting route in practical interview context — 🟡 [Mid]

**Tổng Quan:** Intercepting Route là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với intercepting route, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
const card = document.querySelector('[data-card]');
card?.addEventListener('click', () => {
  card.classList.toggle('expanded');
});
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q33: Explain server action in practical interview context — 🔴 [Senior]

**Tổng Quan:** Server Action là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với server action, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```tsx
export default async function Page() {
  const res = await fetch('https://api.example.com/posts', { next: { revalidate: 60 } });
  const posts = await res.json();
  return <main>{posts.map((p: { id: number; title: string }) => <p key={p.id}>{p.title}</p>)}</main>;
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q34: Explain cache revalidate in practical interview context — 🟢 [Junior]

**Tổng Quan:** Cache Revalidate là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với cache revalidate, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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

### Q35: Explain auth guard in practical interview context — 🟡 [Mid]

**Tổng Quan:** Auth Guard là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với auth guard, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q36: Explain migration in practical interview context — 🔴 [Senior]

**Tổng Quan:** Migration là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với migration, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q37: Explain server component in practical interview context — 🟢 [Junior]

**Tổng Quan:** Server Component là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với server component, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() });
}
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q38: Explain client boundary in practical interview context — 🟡 [Mid]

**Tổng Quan:** Client Boundary là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với client boundary, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```js
function explain(topic, level) {
  return `[${level}] ${topic}: answer with trade-offs and practical examples`;
}

console.log(explain('layout performance', 'mid'));
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q39: Explain layout template in practical interview context — 🔴 [Senior]

**Tổng Quan:** Layout Template là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với layout template, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

**Ví dụ:**
```html
<section class="card" data-level="junior">
  <h2>Interview Note</h2>
  <p>Semantic structure improves accessibility.</p>
</section>
```

**Follow-up (VN):** Nếu interviewer hỏi sâu hơn, hãy so sánh 2 phương án thay thế và đưa tiêu chí lựa chọn rõ ràng.

### Q40: Explain loading error in practical interview context — 🟢 [Junior]

**Tổng Quan:** Loading Error là chủ đề quan trọng, thường dùng để đánh giá khả năng tư duy hệ thống và kinh nghiệm production.

**Giải thích:** Ứng viên nên mô tả định nghĩa ngắn gọn bằng tiếng Anh, sau đó giải thích bằng tiếng Việt về cách hoạt động, ưu/nhược điểm, và khi nào nên dùng trong dự án thật. Với loading error, cần nhấn mạnh tính maintainability, performance, và khả năng scale giữa nhiều thành viên.

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
