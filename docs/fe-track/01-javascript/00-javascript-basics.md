# JavaScript Basics
## JavaScript Fundamentals - Chapter 0

[← Previous](../../00-table-of-contents.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./01-variables-data-types.md)

---

## Tổng Quan / Overview

JavaScript interview prep should be bilingual and practical: explain the concept in English, then reinforce it in Vietnamese with trade-offs and common pitfalls.

Giải thích (VI): Tài liệu này tập trung vào phần cốt lõi thường gặp trong phỏng vấn Frontend. Mỗi mục có định nghĩa, lưu ý và ví dụ JavaScript ngắn gọn để bạn ôn tập nhanh.

### Related Links / Liên Kết Liên Quan
- [Variables & Data Types](./01-variables-data-types.md)
- [Closures](./03-closures.md)
- [Event Loop & Async](./06-event-loop-async.md)
- [Functional Programming](./12-functional-programming.md)

---

## Core Concepts

### 1. JavaScript History and ECMAScript Evolution

#### Overview / Tổng Quan
JavaScript started in 1995 and is standardized as ECMAScript. Interviewers expect you to know key milestones such as ES5 strict mode, ES6 modules/classes, and modern async features.

#### Explanation / Giải thích
JavaScript ban đầu được tạo rất nhanh cho trình duyệt, sau đó chuẩn hóa thành ECMAScript để các engine triển khai nhất quán. Khi đi phỏng vấn, bạn nên nêu mốc ES5 (strict mode), ES6 (let/const, class, module), ES2017 (async/await), ES2020+ (BigInt, optional chaining).

#### Example / Ví dụ
```javascript
const milestones = {
  ES5: ['strict mode', 'JSON'],
  ES6: ['let/const', 'arrow function', 'Promise'],
  ES2017: ['async/await'],
  ES2020: ['BigInt', 'optional chaining']
};

console.log(Object.keys(milestones));
```

### 2. Strict Mode Basics

#### Overview / Tổng Quan
Strict mode prevents silent errors and disallows dangerous patterns. It can be enabled per-file or per-function.

#### Explanation / Giải thích
"use strict" giúp phát hiện lỗi sớm: ví dụ gán biến chưa khai báo sẽ ném lỗi thay vì tạo biến global ngầm. Trong module ES, strict mode mặc định luôn bật.

#### Example / Ví dụ
```javascript
'use strict';

function demo() {
  // x = 10; // ReferenceError in strict mode
  let x = 10;
  return x;
}

console.log(demo());
```

### 3. Primitive vs Reference Types

#### Overview / Tổng Quan
Primitives are copied by value, while objects are copied by reference identity.

#### Explanation / Giải thích
Khi gán primitive, bạn tạo bản sao giá trị. Khi gán object/array/function, bạn sao chép tham chiếu đến cùng vùng nhớ, nên sửa một nơi ảnh hưởng nơi khác.

#### Example / Ví dụ
```javascript
let a = 5;
let b = a;
b = 7;

const user1 = { name: 'A' };
const user2 = user1;
user2.name = 'B';

console.log(a, b); // 5 7
console.log(user1.name); // B
```

### 4. Type Coercion Fundamentals

#### Overview / Tổng Quan
JavaScript may convert types implicitly when operators are used with mixed operands.

#### Explanation / Giải thích
Ép kiểu ngầm (implicit coercion) là nguồn bug phổ biến. Phỏng vấn thường hỏi bạn vì sao "5" + 1 thành "51" nhưng "5" - 1 thành 4.

#### Example / Ví dụ
```javascript
console.log('5' + 1); // '51'
console.log('5' - 1); // 4
console.log(Number('5') + 1); // 6
console.log(String(5) + 1); // '51'
```

### 5. Truthy and Falsy Values

#### Overview / Tổng Quan
In conditionals, non-boolean values are converted to boolean. There are only a few falsy values.

#### Explanation / Giải thích
Các giá trị falsy gồm: false, 0, -0, 0n, "", null, undefined, NaN. Còn lại là truthy. Cần cẩn thận khi kiểm tra dữ liệu đầu vào.

#### Example / Ví dụ
```javascript
const values = [false, 0, '', null, undefined, NaN, '0', [], {}];

for (const v of values) {
  if (v) {
    console.log(v, '=> truthy');
  } else {
    console.log(v, '=> falsy');
  }
}
```

### 6. Equality Operators (== vs ===)

#### Overview / Tổng Quan
Loose equality performs coercion, strict equality compares type and value directly.

#### Explanation / Giải thích
Quy tắc an toàn là ưu tiên === và !== để tránh ép kiểu bất ngờ. Chỉ dùng == khi bạn thực sự kiểm soát được bảng coercion.

#### Example / Ví dụ
```javascript
console.log(0 == false); // true
console.log(0 === false); // false
console.log(null == undefined); // true
console.log(null === undefined); // false
```

### 7. Arithmetic and Logical Operators

#### Overview / Tổng Quan
Operators include arithmetic, comparison, logical, nullish coalescing, and optional chaining.

#### Explanation / Giải thích
Trong code production, toán tử ?? thường tốt hơn || khi bạn chỉ muốn fallback cho null/undefined (không phải cho 0 hoặc chuỗi rỗng).

#### Example / Ví dụ
```javascript
const qty = 0;
console.log(qty || 10); // 10 (unexpected sometimes)
console.log(qty ?? 10); // 0

const profile = null;
console.log(profile?.name ?? 'Anonymous');
```

### 8. Control Flow: if/switch/loops

#### Overview / Tổng Quan
Control flow determines execution paths and repeated logic.

#### Explanation / Giải thích
Phỏng vấn cơ bản thường yêu cầu bạn chọn cấu trúc phù hợp: if cho điều kiện phức tạp, switch cho nhánh rời rạc, loop khi xử lý danh sách.

#### Example / Ví dụ
```javascript
const role = 'admin';

switch (role) {
  case 'admin':
    console.log('Full access');
    break;
  case 'editor':
    console.log('Edit access');
    break;
  default:
    console.log('Read only');
}
```

### 9. Error Handling Basics

#### Overview / Tổng Quan
Use try/catch/finally to capture runtime exceptions and keep the app resilient.

#### Explanation / Giải thích
Không nên nuốt lỗi im lặng. Hãy log có ngữ cảnh hoặc chuyển đổi sang lỗi domain-specific để dễ debug và quan sát production.

#### Example / Ví dụ
```javascript
function parseUser(jsonText) {
  try {
    return JSON.parse(jsonText);
  } catch (error) {
    throw new Error(`Invalid user payload: ${error.message}`);
  }
}

console.log(parseUser('{"name":"Lan"}'));
```

### 10. Functions as Building Blocks

#### Overview / Tổng Quan
Functions support reuse, abstraction, and testability.

#### Explanation / Giải thích
Nên viết hàm nhỏ, rõ input/output để dễ test. Đây cũng là cách trả lời tốt khi được hỏi về clean code trong JavaScript.

#### Example / Ví dụ
```javascript
function formatFullName(firstName, lastName) {
  return `${firstName} ${lastName}`.trim();
}

console.log(formatFullName('Gia', 'Buu'));
```

### 11. Objects and Arrays Essentials

#### Overview / Tổng Quan
Objects store keyed data; arrays store ordered lists. Both are reference types.

#### Explanation / Giải thích
Bạn cần nắm thao tác không mutate để tránh side effects, đặc biệt trong React state updates.

#### Example / Ví dụ
```javascript
const user = { id: 1, name: 'Mai' };
const updatedUser = { ...user, name: 'Minh' };

const nums = [1, 2, 3];
const nextNums = [...nums, 4];

console.log(updatedUser, nextNums);
```

### 12. Short-Circuit Evaluation

#### Overview / Tổng Quan
Logical operators can return operands, not just booleans, enabling concise defaults and guards.

#### Explanation / Giải thích
Cần hiểu behavior trả về giá trị gốc để tránh bug. Ví dụ `a && b` trả về a nếu a falsy, ngược lại trả về b.

#### Example / Ví dụ
```javascript
const token = '';
const header = token && `Bearer ${token}`;
const safeHeader = token ? `Bearer ${token}` : null;

console.log(header, safeHeader);
```

### 13. Basic Debugging Mindset

#### Overview / Tổng Quan
Interviewers value systematic debugging: reproduce, isolate, observe, and verify fix.

#### Explanation / Giải thích
Đừng chỉ đoán. Hãy trình bày quy trình: tái hiện lỗi, thu hẹp phạm vi, thêm log/ breakpoint, kiểm tra giả thuyết, rồi mới sửa.

#### Example / Ví dụ
```javascript
function safeDivide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

console.log(safeDivide(10, 2));
```

### 14. Interview Strategy for Basics

#### Overview / Tổng Quan
Strong basics answers combine definition, practical example, and caveat.

#### Explanation / Giải thích
Công thức trả lời hiệu quả: Định nghĩa ngắn → Ví dụ code nhỏ → Cảnh báo bug thường gặp → Best practice.

#### Example / Ví dụ
```javascript
function answerTemplate(topic) {
  return {
    definition: `What is ${topic}?`,
    example: 'Show 3-5 lines of code',
    caveat: 'Mention a common pitfall'
  };
}

console.log(answerTemplate('strict mode'));
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1. What is JavaScript and why is it single-threaded?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟡 [Mid] Q2. Differentiate ECMAScript and JavaScript.

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🔴 [Senior] Q3. Name major ES milestones interviewers ask about.

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟢 [Junior] Q4. When should you enable strict mode?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟡 [Mid] Q5. What changes in strict mode for accidental globals?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🔴 [Senior] Q6. Explain primitive vs reference assignment.

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟢 [Junior] Q7. Why does object mutation surprise beginners?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟡 [Mid] Q8. What is implicit type coercion?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🔴 [Senior] Q9. Why does '5' + 1 differ from '5' - 1?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟢 [Junior] Q10. List all falsy values in JavaScript.

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟡 [Mid] Q11. How do truthy/falsy checks affect form validation?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🔴 [Senior] Q12. Compare == and ===.

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟢 [Junior] Q13. When is using == acceptable?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟡 [Mid] Q14. What is the difference between || and ??.

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🔴 [Senior] Q15. How does optional chaining prevent runtime crashes?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟢 [Junior] Q16. Explain short-circuiting with &&.

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟡 [Mid] Q17. What are pre/post increment pitfalls?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🔴 [Senior] Q18. How do bitwise operators differ from logical operators?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟢 [Junior] Q19. When would you choose switch over if/else?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟡 [Mid] Q20. How does break affect loops?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🔴 [Senior] Q21. Difference between for...of and for...in?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟢 [Junior] Q22. How do you safely parse JSON from APIs?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟡 [Mid] Q23. Why should you avoid swallowing errors silently?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🔴 [Senior] Q24. What does finally guarantee?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟢 [Junior] Q25. How do you rethrow errors with context?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟡 [Mid] Q26. What is idempotent control flow in UI handlers?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🔴 [Senior] Q27. Why are guard clauses useful?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟢 [Junior] Q28. How do you validate unknown input types?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟡 [Mid] Q29. What is NaN and how to check it correctly?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🔴 [Senior] Q30. Difference between Number.isNaN and isNaN?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟢 [Junior] Q31. What is Object.is and when to use it?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟡 [Mid] Q32. Why is floating-point arithmetic imprecise?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🔴 [Senior] Q33. How do you compare decimals safely?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟢 [Junior] Q34. What is temporal coupling in imperative code?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟡 [Mid] Q35. How can defaults hide real bugs?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🔴 [Senior] Q36. Why is explicit conversion better in APIs?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟢 [Junior] Q37. How do you explain event-driven behavior in basics round?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟡 [Mid] Q38. What baseline debugging process do you follow?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🔴 [Senior] Q39. How do you answer basics questions under pressure?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.

### 🟢 [Junior] Q40. What common JavaScript beginner mistakes appear in interviews?

**Answer (EN):** State the rule clearly, then show a tiny code sample and one pitfall. Interviewers prioritize correctness over memorized jargon.

**Giải thích (VI):** Hãy nêu quy tắc cốt lõi, đưa ví dụ ngắn và nhắc lỗi thường gặp. Nhà tuyển dụng đánh giá khả năng áp dụng hơn là học thuộc lòng.

**Ví dụ:**
```javascript
const input = '42';
const value = Number(input);
console.log({ input, value, type: typeof value });
```

**Interview Tip:** Keep your answer in 30-45 seconds, then invite a follow-up scenario.
