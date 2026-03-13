# Variables & Data Types

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## JavaScript Fundamentals - Chapter 1

[← Previous](./00-javascript-basics.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./02-scope-hoisting.md)

---

## Tổng Quan / Overview

JavaScript interview prep should be bilingual and practical: explain the concept in English, then reinforce it in Vietnamese with trade-offs and common pitfalls.

Giải thích (VI): Tài liệu này tập trung vào phần cốt lõi thường gặp trong phỏng vấn Frontend. Mỗi mục có định nghĩa, lưu ý và ví dụ JavaScript ngắn gọn để bạn ôn tập nhanh.

### Related Links / Liên Kết Liên Quan
- [JavaScript Basics](./00-javascript-basics.md)
- [Scope & Hoisting](./02-scope-hoisting.md)
- [Closures](./03-closures.md)
- [Event Loop & Async](./06-event-loop-async.md)

---

## Core Concepts

### 1. var, let, const Comparison

#### Overview / Tổng Quan
Use let/const in modern JavaScript. var is function-scoped and hoisted with undefined initialization.

#### Explanation / Giải thích
var dễ gây bug do scope theo function và cho phép redeclare. let/const có block scope, dễ reasoning hơn khi đọc code và debug.

#### Example / Ví dụ
```javascript
function demo() {
  if (true) {
    var a = 1;
    let b = 2;
    const c = 3;
  }
  console.log(a); // 1
  // console.log(b); // ReferenceError
}

demo();
```

### 2. Hoisting and Initialization

#### Overview / Tổng Quan
Declarations are hoisted, but initialization behavior differs by keyword.

#### Explanation / Giải thích
function declaration được hoist đầy đủ, var hoist với giá trị undefined, còn let/const nằm trong TDZ cho đến khi dòng khai báo chạy.

#### Example / Ví dụ
```javascript
console.log(foo); // undefined
var foo = 'var';

// console.log(bar); // ReferenceError
let bar = 'let';
```

### 3. Temporal Dead Zone (TDZ)

#### Overview / Tổng Quan
TDZ is the time between block start and let/const initialization where access throws ReferenceError.

#### Explanation / Giải thích
TDZ giúp phát hiện dùng biến trước khi sẵn sàng, giảm class bug đọc giá trị chưa khởi tạo.

#### Example / Ví dụ
```javascript
{
  // console.log(score); // ReferenceError
  let score = 100;
  console.log(score);
}
```

### 4. String and Number Deep Dive

#### Overview / Tổng Quan
Numbers are IEEE-754 doubles; strings are immutable UTF-16 sequences.

#### Explanation / Giải thích
Với Number, cần lưu ý sai số dấu chấm động. Với String, mỗi thao tác biến đổi tạo chuỗi mới.

#### Example / Ví dụ
```javascript
console.log(0.1 + 0.2); // 0.30000000000000004

const text = 'hello';
const upper = text.toUpperCase();
console.log(text, upper);
```

### 5. BigInt and Numeric Safety

#### Overview / Tổng Quan
BigInt handles integers beyond Number.MAX_SAFE_INTEGER.

#### Explanation / Giải thích
Khi xử lý ID lớn, blockchain, hoặc số nguyên 64-bit, BigInt tránh mất chính xác. Không trộn trực tiếp BigInt với Number.

#### Example / Ví dụ
```javascript
const maxSafe = Number.MAX_SAFE_INTEGER;
const bigger = 9007199254740993n;

console.log(maxSafe + 1 === maxSafe + 2); // true (unsafe)
console.log(bigger + 2n);
```

### 6. Boolean, null, undefined

#### Overview / Tổng Quan
undefined means not assigned; null is intentional empty value.

#### Explanation / Giải thích
Interviewer hay hỏi vì sao `typeof null` là "object" (legacy bug). Bạn chỉ cần nêu đó là historical quirk.

#### Example / Ví dụ
```javascript
let x;
const y = null;

console.log(typeof x); // undefined
console.log(typeof y); // object (quirk)
```

### 7. Symbol for Unique Keys

#### Overview / Tổng Quan
Symbol creates unique identifiers useful for hidden object keys and protocol customization.

#### Explanation / Giải thích
Symbol giúp tránh đụng key trong object lớn hoặc thư viện. Nó cũng dùng cho các well-known symbols như Symbol.iterator.

#### Example / Ví dụ
```javascript
const ID = Symbol('id');
const user = { name: 'An', [ID]: 101 };

console.log(user[ID]);
console.log(Object.keys(user)); // ['name']
```

### 8. Reference Types and Identity

#### Overview / Tổng Quan
Objects, arrays, and functions compare by reference identity, not deep value.

#### Explanation / Giải thích
Hai object cùng shape vẫn khác nhau nếu không cùng tham chiếu. Đây là lý do cần deep comparison trong vài trường hợp.

#### Example / Ví dụ
```javascript
const a = { x: 1 };
const b = { x: 1 };
const c = a;

console.log(a === b); // false
console.log(a === c); // true
```

### 9. typeof and instanceof

#### Overview / Tổng Quan
typeof is good for primitives; instanceof checks prototype chain for objects.

#### Explanation / Giải thích
`instanceof` có thể sai khác giữa realm (iframe). Với array, ưu tiên Array.isArray để ổn định hơn.

#### Example / Ví dụ
```javascript
const arr = [1, 2, 3];
console.log(typeof arr); // object
console.log(arr instanceof Array); // true
console.log(Array.isArray(arr)); // true
```

### 10. Explicit Type Conversion

#### Overview / Tổng Quan
Prefer Number(), String(), Boolean() for readability and predictable behavior.

#### Explanation / Giải thích
Ép kiểu tường minh giúp giảm bug trong dữ liệu API hoặc form input, đặc biệt khi giá trị rỗng hoặc null.

#### Example / Ví dụ
```javascript
const raw = '123';
const asNumber = Number(raw);
const asString = String(asNumber);
const asBool = Boolean(asString);

console.log(asNumber, asString, asBool);
```

### 11. WeakRef Basics

#### Overview / Tổng Quan
WeakRef holds a weak reference that does not prevent garbage collection.

#### Explanation / Giải thích
WeakRef là chủ đề nâng cao; nên dùng rất hạn chế. Nó phù hợp cache tối ưu bộ nhớ, nhưng hành vi thu gom rác là không deterministic.

#### Example / Ví dụ
```javascript
let obj = { payload: 'large object' };
const ref = new WeakRef(obj);

console.log(ref.deref()?.payload);
obj = null; // eligible for GC at some point
```

### 12. Practical Validation for Unknown Data

#### Overview / Tổng Quan
Runtime validation prevents unsafe assumptions from dynamic input.

#### Explanation / Giải thích
TypeScript không bảo vệ dữ liệu runtime từ network. Bạn vẫn cần guard/check trước khi dùng.

#### Example / Ví dụ
```javascript
function parseAge(value) {
  const age = Number(value);
  if (!Number.isFinite(age) || age < 0) {
    throw new Error('Invalid age');
  }
  return age;
}

console.log(parseAge('20'));
```

### 13. Interview Answer Pattern for Data Types

#### Overview / Tổng Quan
Define, distinguish, and demonstrate with one edge case.

#### Explanation / Giải thích
Mẫu trả lời tốt: nêu sự khác nhau, đưa ví dụ code, rồi nêu 1 edge case (NaN, null, TDZ, object identity).

#### Example / Ví dụ
```javascript
function compareTypes(a, b) {
  return {
    strictEqual: a === b,
    looseEqual: a == b,
    typeA: typeof a,
    typeB: typeof b
  };
}

console.log(compareTypes('1', 1));
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1. When should var still appear in legacy codebases?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟡 [Mid] Q2. How do let and const improve maintainability?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🔴 [Senior] Q3. Explain hoisting in one minute.

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟢 [Junior] Q4. Why does TDZ exist?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟡 [Mid] Q5. Difference between declaration and initialization?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🔴 [Senior] Q6. How do const objects remain mutable?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟢 [Junior] Q7. Can const prevent deep mutation?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟡 [Mid] Q8. What are JavaScript primitive types?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🔴 [Senior] Q9. How is symbol different from string keys?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟢 [Junior] Q10. Why is bigint not interchangeable with number?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟡 [Mid] Q11. How do you safely check for integer input?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🔴 [Senior] Q12. What does typeof return for null?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟢 [Junior] Q13. When should you use Object.is over ===?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟡 [Mid] Q14. How to distinguish array from object reliably?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🔴 [Senior] Q15. What are wrapper objects like new String()?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟢 [Junior] Q16. Why avoid using new Boolean(false)?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟡 [Mid] Q17. How does instanceof work internally?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🔴 [Senior] Q18. When can instanceof fail across iframes?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟢 [Junior] Q19. What is structural cloning vs shallow copying?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟡 [Mid] Q20. How does spread syntax copy objects?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🔴 [Senior] Q21. How do you deep clone in modern JavaScript?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟢 [Junior] Q22. What are trade-offs of JSON stringify cloning?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟡 [Mid] Q23. How do Symbol.for and Symbol differ?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🔴 [Senior] Q24. What is a well-known symbol?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟢 [Junior] Q25. How does WeakRef differ from WeakMap?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟡 [Mid] Q26. When should WeakRef be avoided?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🔴 [Senior] Q27. How do you convert unknown API values safely?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟢 [Junior] Q28. Why should form values be parsed explicitly?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟡 [Mid] Q29. How do NaN and Infinity break business logic?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🔴 [Senior] Q30. How do you normalize nullable data?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟢 [Junior] Q31. What is nullish coalescing in type conversion?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟡 [Mid] Q32. How to design stable runtime guards?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🔴 [Senior] Q33. What mistakes happen with default parameters and undefined?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟢 [Junior] Q34. How do you explain data types to non-JS engineers?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟡 [Mid] Q35. What interview traps exist around type coercion?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🔴 [Senior] Q36. How do you discuss memory identity clearly?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟢 [Junior] Q37. Why does mutability matter for React state?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟡 [Mid] Q38. How do you reason about copy-on-write style updates?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🔴 [Senior] Q39. What anti-patterns appear with global variables?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.

### 🟢 [Junior] Q40. How to answer variable scope questions confidently?

**Answer (EN):** Start with the rule, contrast two close concepts, and show one edge case that proves you understand behavior.

**Giải thích (VI):** Hãy bắt đầu bằng quy tắc chính, so sánh hai khái niệm gần nhau, rồi thêm một edge case để chứng minh bạn hiểu bản chất.

**Ví dụ:**
```javascript
const raw = '0';
const n = Number(raw);
console.log({ raw, n, isNumber: Number.isFinite(n) });
```

**Interview Tip:** Mention both language semantics and practical production impact.
