# Functional Programming in JavaScript

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Principles, Patterns, and Interview Practice

[← Previous](./12-functional-programming.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./15-memory-management-advanced.md)

---

## Tổng Quan / Overview

JavaScript interview prep should be bilingual and practical: explain the concept in English, then reinforce it in Vietnamese with trade-offs and common pitfalls.

Giải thích (VI): Tài liệu này tập trung vào phần cốt lõi thường gặp trong phỏng vấn Frontend. Mỗi mục có định nghĩa, lưu ý và ví dụ JavaScript ngắn gọn để bạn ôn tập nhanh.

### Related Links / Liên Kết Liên Quan
- [JavaScript Basics](./00-javascript-basics.md)
- [Closures](./03-closures.md)
- [Event Loop & Async](./06-event-loop-async.md)
- [Memory Management](./15-memory-management-advanced.md)

---

## Core Concepts

### 1. Functional Programming Mindset

#### Overview / Tổng Quan
Functional programming emphasizes predictable transformations over mutable state changes.

#### Explanation / Giải thích
Tư duy FP giúp code dễ test, dễ refactor và giảm bug side effects. Trong frontend, FP rất hữu ích cho data processing và state updates.

#### Example / Ví dụ
```javascript
const addTax = (price, taxRate) => price * (1 + taxRate);
console.log(addTax(100, 0.1));
```

### 2. Pure Functions

#### Overview / Tổng Quan
A pure function returns the same output for same input and causes no side effects.

#### Explanation / Giải thích
Hàm thuần không đọc/ghi trạng thái bên ngoài. Đây là nền tảng để test đơn giản và cache kết quả.

#### Example / Ví dụ
```javascript
const pureSum = (a, b) => a + b;

let count = 0;
const impureInc = () => ++count;
```

### 3. Immutability

#### Overview / Tổng Quan
Instead of mutating existing data, return new data structures.

#### Explanation / Giải thích
Bất biến giúp theo dõi state transitions rõ ràng. Trong React, immutable update hỗ trợ so sánh tham chiếu tối ưu render.

#### Example / Ví dụ
```javascript
const user = { name: 'Linh', skills: ['JS'] };
const nextUser = { ...user, skills: [...user.skills, 'TS'] };

console.log(user, nextUser);
```

### 4. First-Class and Higher-Order Functions

#### Overview / Tổng Quan
Functions can be passed, returned, and composed as values.

#### Explanation / Giải thích
Higher-order function nhận hàm khác làm input hoặc trả về hàm. Đây là mô hình chung của map/filter/reduce.

#### Example / Ví dụ
```javascript
const apply = (fn, value) => fn(value);
const double = x => x * 2;
console.log(apply(double, 5));
```

### 5. map, filter, reduce Essentials

#### Overview / Tổng Quan
These array operators are core FP tools for transformation pipelines.

#### Explanation / Giải thích
map biến đổi từng phần tử, filter chọn phần tử theo điều kiện, reduce gộp danh sách thành một giá trị.

#### Example / Ví dụ
```javascript
const nums = [1, 2, 3, 4];
const result = nums
  .map(n => n * 2)
  .filter(n => n > 4)
  .reduce((sum, n) => sum + n, 0);

console.log(result);
```

### 6. Function Composition

#### Overview / Tổng Quan
Composition chains small functions to build complex behavior.

#### Explanation / Giải thích
Composition giúp tách logic thành bước nhỏ dễ đọc. Thường dùng `compose` hoặc `pipe` trong codebase FP.

#### Example / Ví dụ
```javascript
const trim = s => s.trim();
const lower = s => s.toLowerCase();
const toSlug = s => s.replace(/\s+/g, '-');

const pipe = (...fns) => input => fns.reduce((v, fn) => fn(v), input);
const slugify = pipe(trim, lower, toSlug);
console.log(slugify('  Hello FP World  '));
```

### 7. Currying in FP

#### Overview / Tổng Quan
Currying enables reusable partially-applied functions and cleaner composition.

#### Explanation / Giải thích
Currying tạo hàm chuyên biệt từ hàm tổng quát. Ví dụ tạo `addVAT` từ hàm `addRate`.

#### Example / Ví dụ
```javascript
const addRate = rate => amount => amount * (1 + rate);
const addVAT = addRate(0.1);
console.log(addVAT(200));
```

### 8. Point-Free Style

#### Overview / Tổng Quan
Point-free style defines transformations without explicitly naming data arguments.

#### Explanation / Giải thích
Phong cách này gọn nhưng có thể khó đọc nếu lạm dụng. Hãy ưu tiên readability hơn "đẹp cú pháp".

#### Example / Ví dụ
```javascript
const pipe = (...fns) => x => fns.reduce((v, fn) => fn(v), x);
const exclaim = s => `${s}!`;
const upper = s => s.toUpperCase();

const shout = pipe(upper, exclaim);
console.log(shout('fp'));
```

### 9. Functor Basics

#### Overview / Tổng Quan
A functor is a container-like structure with map that preserves context.

#### Explanation / Giải thích
Nói đơn giản: nếu có `map` để biến đổi value bên trong mà giữ nguyên "vỏ" thì đó là functor (ví dụ Array, Promise theo nghĩa thực hành).

#### Example / Ví dụ
```javascript
const box = value => ({
  map: fn => box(fn(value)),
  fold: fn => fn(value)
});

const output = box(2).map(x => x + 3).map(x => x * 10).fold(x => x);
console.log(output);
```

### 10. Monad Basics (Interview Level)

#### Overview / Tổng Quan
A monad extends functor with flatMap/chain to avoid nested contexts.

#### Explanation / Giải thích
Trong phỏng vấn JS, bạn không cần quá học thuật; chỉ cần giải thích flatMap giúp tránh nested container (Promise<Promise<T>>...).

#### Example / Ví dụ
```javascript
const result = Promise.resolve(5)
  .then(x => Promise.resolve(x + 1))
  .then(x => x * 2);

result.then(console.log);
```

### 11. FP Error Handling with Result-like Pattern

#### Overview / Tổng Quan
Instead of throwing everywhere, represent success/failure explicitly in data.

#### Explanation / Giải thích
Mẫu Result/Either giúp pipeline an toàn và dễ test. Bạn xử lý lỗi như dữ liệu thay vì exception side-channel.

#### Example / Ví dụ
```javascript
const ok = value => ({ ok: true, value });
const err = error => ({ ok: false, error });

function parseNumber(input) {
  const n = Number(input);
  return Number.isFinite(n) ? ok(n) : err('Invalid number');
}

console.log(parseNumber('42'));
```

### 12. FP vs OOP Trade-offs

#### Overview / Tổng Quan
FP favors transformations and immutability; OOP favors stateful objects and encapsulation.

#### Explanation / Giải thích
Không có mô hình nào luôn tốt hơn. Thực tế thường là hybrid: FP cho data flow, OOP cho domain model/lifecycle phức tạp.

#### Example / Ví dụ
```javascript
// FP style
const withDiscount = (price, discount) => price * (1 - discount);

// OOP style
class Cart {
  constructor(items = []) { this.items = items; }
  total() { return this.items.reduce((s, i) => s + i.price, 0); }
}
```

### 13. Performance and Readability Balance

#### Overview / Tổng Quan
FP chains are expressive but may allocate intermediate arrays; optimize only where needed.

#### Explanation / Giải thích
Đừng tối ưu sớm. Trước hết viết rõ ràng, đo hiệu năng, rồi mới cân nhắc loop hoặc transducer khi pipeline rất lớn.

#### Example / Ví dụ
```javascript
const items = Array.from({ length: 5 }, (_, i) => i + 1);
const total = items.map(x => x * 2).filter(x => x > 5).reduce((a, b) => a + b, 0);
console.log(total);
```

### 14. Interview Strategy for FP Questions

#### Overview / Tổng Quan
Define concept, show tiny transformation pipeline, then discuss trade-offs.

#### Explanation / Giải thích
Với câu FP, bạn nên trả lời theo khung: định nghĩa -> code ngắn -> lợi ích -> giới hạn.

#### Example / Ví dụ
```javascript
const pipeline = value => [value]
  .map(x => x + 1)
  .map(x => x * 2)[0];

console.log(pipeline(5));
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1. What is functional programming in JavaScript?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟡 [Mid] Q2. What defines a pure function?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🔴 [Senior] Q3. Why are side effects problematic?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟢 [Junior] Q4. How does immutability help debugging?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟡 [Mid] Q5. How to update nested objects immutably?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🔴 [Senior] Q6. What are first-class functions?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟢 [Junior] Q7. Define higher-order function with example.

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟡 [Mid] Q8. When to use map vs forEach?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🔴 [Senior] Q9. How does filter differ from find?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟢 [Junior] Q10. How does reduce work conceptually?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟡 [Mid] Q11. What mistakes happen with reduce initial value?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🔴 [Senior] Q12. What is function composition?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟢 [Junior] Q13. Difference between compose and pipe?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟡 [Mid] Q14. How does currying improve reuse?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🔴 [Senior] Q15. Currying vs partial application?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟢 [Junior] Q16. What is point-free style?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟡 [Mid] Q17. When does point-free hurt readability?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🔴 [Senior] Q18. What is referential transparency?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟢 [Junior] Q19. How does memoization relate to purity?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟡 [Mid] Q20. What is a functor (practical explanation)?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🔴 [Senior] Q21. What is a monad in interview-friendly terms?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟢 [Junior] Q22. Why does flatMap matter?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟡 [Mid] Q23. How do Promise chains resemble monadic bind?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🔴 [Senior] Q24. How to model errors functionally?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟢 [Junior] Q25. Result/Either vs throw: trade-offs?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟡 [Mid] Q26. FP vs OOP: when choose which?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🔴 [Senior] Q27. Can FP be used with React effectively?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟢 [Junior] Q28. How do reducers reflect FP principles?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟡 [Mid] Q29. How to avoid accidental mutation in teams?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🔴 [Senior] Q30. What libraries support FP in JS ecosystems?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟢 [Junior] Q31. How to benchmark FP pipelines?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟡 [Mid] Q32. What are transducers at high level?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🔴 [Senior] Q33. What anti-patterns appear in over-engineered FP code?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟢 [Junior] Q34. How to teach FP to OOP-first teams?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟡 [Mid] Q35. What senior-level FP trade-offs to mention?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🔴 [Senior] Q36. How to keep FP code readable for interviews?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟢 [Junior] Q37. How does lazy evaluation appear in JS?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟡 [Mid] Q38. How to compose async functions functionally?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🔴 [Senior] Q39. How to refactor imperative loops into FP style?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).

### 🟢 [Junior] Q40. What interview exercise commonly tests FP basics?

**Answer (EN):** Give a concrete transformation example and explain why predictability/testability improves with pure data flow.

**Giải thích (VI):** Hãy đưa ví dụ biến đổi dữ liệu cụ thể và giải thích vì sao luồng dữ liệu thuần giúp code dễ đoán và dễ kiểm thử hơn.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const out = numbers.map(n => n + 1).reduce((a, b) => a + b, 0);
console.log(out);
```

**Interview Tip:** Balance theory with practical frontend examples (state updates, API mapping, form normalization).
