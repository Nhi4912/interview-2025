# Event Loop & Asynchronous JavaScript

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## JavaScript Fundamentals - Chapter 6

[← Previous](./05-this-keyword.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./07-es6-features.md)

---

## Tổng Quan / Overview

JavaScript interview prep should be bilingual and practical: explain the concept in English, then reinforce it in Vietnamese with trade-offs and common pitfalls.

Giải thích (VI): Tài liệu này tập trung vào phần cốt lõi thường gặp trong phỏng vấn Frontend. Mỗi mục có định nghĩa, lưu ý và ví dụ JavaScript ngắn gọn để bạn ôn tập nhanh.

### Related Links / Liên Kết Liên Quan
- [Closures](./03-closures.md)
- [JavaScript Basics](./00-javascript-basics.md)
- [ES6+ Features](./07-es6-features.md)
- [Functional Programming](./12-functional-programming.md)

---

## Core Concepts

### 1. JavaScript Runtime Model

#### Overview / Tổng Quan
Async behavior in JavaScript is coordinated by runtime components: call stack, Web APIs, and task queues.

#### Explanation / Giải thích
Bản thân engine chỉ chạy một stack. Khả năng bất đồng bộ đến từ môi trường (browser/Node) và event loop điều phối hàng đợi.

#### Example / Ví dụ
```javascript
console.log('start');
setTimeout(() => console.log('timer'), 0);
Promise.resolve().then(() => console.log('microtask'));
console.log('end');
```

### 2. Call Stack Fundamentals

#### Overview / Tổng Quan
The call stack tracks active execution contexts in LIFO order.

#### Explanation / Giải thích
Khi stack đầy (đệ quy vô hạn), bạn gặp stack overflow. Đây là lỗi nền tảng cần giải thích rõ trong phỏng vấn.

#### Example / Ví dụ
```javascript
function a() { b(); }
function b() { c(); }
function c() { console.log('on stack'); }

a();
```

### 3. Web APIs and Host Environment

#### Overview / Tổng Quan
Timers, fetch, and DOM events are not part of ECMAScript language core; they come from host APIs.

#### Explanation / Giải thích
Nên phân biệt rõ language feature và host feature. Ví dụ setTimeout là Web API/Node timer API, không phải syntax JS.

#### Example / Ví dụ
```javascript
setTimeout(() => console.log('timer done'), 10);
fetch('https://example.com').then(() => console.log('fetch done'));
```

### 4. Macrotask Queue

#### Overview / Tổng Quan
Macrotasks include setTimeout, setInterval, I/O callbacks, and UI events.

#### Explanation / Giải thích
Mỗi vòng loop thường xử lý 1 macrotask rồi xả toàn bộ microtask. Vì vậy microtask có thể "chen" trước timer tiếp theo.

#### Example / Ví dụ
```javascript
setTimeout(() => console.log('macrotask 1'), 0);
setTimeout(() => console.log('macrotask 2'), 0);
console.log('sync done');
```

### 5. Microtask Queue

#### Overview / Tổng Quan
Microtasks (Promise reactions, queueMicrotask) run right after current stack and before next macrotask.

#### Explanation / Giải thích
Microtask có độ ưu tiên cao hơn timer queue. Lạm dụng microtask liên tục có thể làm UI bị đói (starvation).

#### Example / Ví dụ
```javascript
queueMicrotask(() => console.log('microtask A'));
Promise.resolve().then(() => console.log('microtask B'));
setTimeout(() => console.log('timer'), 0);
```

### 6. Promises Lifecycle

#### Overview / Tổng Quan
A Promise has states: pending, fulfilled, rejected, and supports chained transformations.

#### Explanation / Giải thích
then/catch/finally đều trả về Promise mới. Lỗi throw trong then sẽ biến thành rejected ở bước sau.

#### Example / Ví dụ
```javascript
Promise.resolve(10)
  .then(v => v * 2)
  .then(v => { throw new Error(`boom ${v}`); })
  .catch(err => err.message)
  .then(msg => console.log(msg));
```

### 7. async/await Semantics

#### Overview / Tổng Quan
async functions return promises; await pauses within that function without blocking the whole thread.

#### Explanation / Giải thích
await chỉ tạm dừng trong phạm vi hàm async hiện tại. UI thread vẫn xử lý việc khác qua event loop.

#### Example / Ví dụ
```javascript
async function getData() {
  const value = await Promise.resolve(42);
  return value;
}

getData().then(console.log);
```

### 8. Promise.all vs allSettled vs race vs any

#### Overview / Tổng Quan
Each combinator has different completion and failure semantics.

#### Explanation / Giải thích
all fail-fast; allSettled luôn trả đủ kết quả; race trả Promise settle đầu tiên; any trả Promise fulfill đầu tiên (nếu tất cả reject thì ném AggregateError).

#### Example / Ví dụ
```javascript
const p1 = Promise.resolve('A');
const p2 = Promise.reject(new Error('B'));

Promise.allSettled([p1, p2]).then(console.log);
```

### 9. Error Handling in Async Flows

#### Overview / Tổng Quan
Handle async errors with try/catch around await, or catch on promise chains.

#### Explanation / Giải thích
Đừng quên xử lý unhandled rejection. Trong production nên log có context request/user/action để truy vết.

#### Example / Ví dụ
```javascript
async function loadUser() {
  try {
    const res = await fetch('/api/user');
    if (!res.ok) throw new Error('HTTP error');
    return await res.json();
  } catch (error) {
    console.error('loadUser failed:', error.message);
    return null;
  }
}
```

### 10. Event Loop Visualization Mindset

#### Overview / Tổng Quan
To predict output order, list synchronous logs, then microtasks, then macrotasks.

#### Explanation / Giải thích
Kỹ năng "trace thứ tự log" cực quan trọng trong interview async. Hãy mô tả theo timeline thay vì đoán.

#### Example / Ví dụ
```javascript
console.log('1');
Promise.resolve().then(() => console.log('2'));
setTimeout(() => console.log('3'), 0);
console.log('4');
// 1 4 2 3
```

### 11. Common Async Gotchas

#### Overview / Tổng Quan
Frequent issues: forgetting await, sequential awaits in loops, and swallowed promise rejections.

#### Explanation / Giải thích
Nhiều ứng viên quên return Promise trong chain hoặc dùng await trong for thường gây chậm. Nên cân nhắc Promise.all cho tác vụ độc lập.

#### Example / Ví dụ
```javascript
async function bad(items) {
  for (const item of items) {
    await fetch(`/api/${item}`); // sequential
  }
}

async function better(items) {
  await Promise.all(items.map(i => fetch(`/api/${i}`)));
}
```

### 12. Cancellation and AbortController

#### Overview / Tổng Quan
AbortController is the standard way to cancel fetch and prevent stale responses.

#### Explanation / Giải thích
Trong UI search-as-you-type, hủy request cũ giúp tránh race condition và cập nhật sai dữ liệu lên màn hình.

#### Example / Ví dụ
```javascript
const controller = new AbortController();
fetch('/api/search?q=js', { signal: controller.signal });
controller.abort();
```

### 13. Async Interview Strategy

#### Overview / Tổng Quan
Answer with event loop model first, then APIs, then practical error handling and performance trade-offs.

#### Explanation / Giải thích
Nếu gặp câu khó, quay lại mô hình stack/queue trước. Sau đó giải thích code order từng bước là cách trả lời an toàn nhất.

#### Example / Ví dụ
```javascript
function explainOrder() {
  console.log('sync');
  Promise.resolve().then(() => console.log('micro'));
  setTimeout(() => console.log('macro'), 0);
}

explainOrder();
```

### 14. Node.js vs Browser Event Loop Nuances

#### Overview / Tổng Quan
Both follow similar principles but differ in phases and API details.

#### Explanation / Giải thích
Node có các phase như timers, poll, check và có `process.nextTick` queue riêng (ưu tiên rất cao). Browser tập trung render cycle và task queues.

#### Example / Ví dụ
```javascript
setTimeout(() => console.log('timer'));
Promise.resolve().then(() => console.log('promise microtask'));
// In Node, process.nextTick would run before promise microtasks.
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1. What is the event loop in simple terms?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟡 [Mid] Q2. Why is JavaScript called single-threaded?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🔴 [Senior] Q3. What is the role of call stack?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟢 [Junior] Q4. What happens when call stack is busy?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟡 [Mid] Q5. Are Web APIs part of JavaScript language spec?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🔴 [Senior] Q6. Difference between macro and micro tasks?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟢 [Junior] Q7. Why do Promise callbacks run before setTimeout 0?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟡 [Mid] Q8. How does queueMicrotask differ from Promise.then?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🔴 [Senior] Q9. What is starvation in microtask queue?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟢 [Junior] Q10. How to explain callback queue in interview?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟡 [Mid] Q11. What is callback hell?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🔴 [Senior] Q12. How does Promise chaining solve callback hell?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟢 [Junior] Q13. What are Promise states?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟡 [Mid] Q14. How does error propagation work in Promise chains?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🔴 [Senior] Q15. What does finally do in Promise?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟢 [Junior] Q16. How does async function return value behave?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟡 [Mid] Q17. What if await receives non-promise value?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🔴 [Senior] Q18. How do try/catch and .catch differ?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟢 [Junior] Q19. When should Promise.all be preferred?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟡 [Mid] Q20. When should Promise.allSettled be preferred?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🔴 [Senior] Q21. Explain Promise.race practical use case.

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟢 [Junior] Q22. Explain Promise.any practical use case.

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟡 [Mid] Q23. What is AggregateError?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🔴 [Senior] Q24. How to handle multiple async failures?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟢 [Junior] Q25. How do you run tasks concurrently but limit parallelism?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟡 [Mid] Q26. What is unhandledrejection?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🔴 [Senior] Q27. How do you cancel fetch requests?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟢 [Junior] Q28. What race conditions occur in search UI?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟡 [Mid] Q29. How to avoid out-of-order async UI updates?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🔴 [Senior] Q30. What does 'await in loop' impact?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟢 [Junior] Q31. How to convert sequential flow to parallel safely?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟡 [Mid] Q32. How to reason about output order quickly?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🔴 [Senior] Q33. What async gotchas appear in interviews most often?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟢 [Junior] Q34. How does event loop affect rendering?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟡 [Mid] Q35. Difference between setTimeout and requestAnimationFrame?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🔴 [Senior] Q36. How does Node process.nextTick relate to microtasks?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟢 [Junior] Q37. How to design robust retry logic with backoff?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟡 [Mid] Q38. How to add timeout to fetch requests?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🔴 [Senior] Q39. How to surface async errors to monitoring?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.

### 🟢 [Junior] Q40. What senior async trade-offs should be discussed?

**Answer (EN):** Model the answer as stack -> microtask queue -> macrotask queue, then apply it to real API code and failure handling.

**Giải thích (VI):** Hãy mô hình hóa theo thứ tự stack -> microtask -> macrotask, sau đó áp vào code API thực tế và cách xử lý lỗi.

**Ví dụ:**
```javascript
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
```

**Interview Tip:** Draw a timeline verbally; interviewers love deterministic reasoning.
