# Asynchronous JavaScript - Comprehensive Bilingual Deep Dive

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Callbacks, Promises, Async/Await, Scheduling, and Practical Patterns

[← Scope & Hoisting](./02-scope-hoisting-comprehensive.md) | [Closures →](./03-closures-comprehensive.md) | [ES6 Features](./11-es6-features-deep.md)

---

## Tổng Quan / Overview

- **English:** This guide covers the full async JavaScript landscape: callbacks, Promise coordination, async/await, async iterators, cancellation, microtasks, and production reliability patterns.
- **Tiếng Việt (Giải thích):** Tài liệu này bao phủ toàn bộ nền tảng async JavaScript từ callback truyền thống đến mô hình điều phối Promise hiện đại, async/await, async iterator và các pattern production như retry/debounce/throttle/rate limiting.

- **Cross-reference:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md), [Closures](./03-closures-comprehensive.md)

---

## Callback Foundations

- **Tổng Quan:** Callbacks là nền móng của async JavaScript trước Promise.
- **Giải thích:** Callbacks giúp trì hoãn thực thi và xử lý kết quả sau khi tác vụ hoàn thành.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q01: What is callbacks and when should you use it?

- **Tổng Quan:** What is callbacks and when should you use it?
- **Giải thích (VI):** callbacks là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** callbacks is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function loadData(callback) {
  setTimeout(() => callback(null, { id: 1, ok: true }), 100);
}

loadData((err, data) => {
  if (err) return console.error(err);
  console.log('done', data);
});
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md), [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q02: Common pitfalls of callbacks in production systems?

- **Tổng Quan:** Common pitfalls of callbacks in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function loadData(callback) {
  setTimeout(() => callback(null, { id: 1, ok: true }), 100);
}

loadData((err, data) => {
  if (err) return console.error(err);
  console.log('done', data);
});
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md), [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q03: How do you design a robust architecture around callbacks?

- **Tổng Quan:** How do you design a robust architecture around callbacks?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function loadData(callback) {
  setTimeout(() => callback(null, { id: 1, ok: true }), 100);
}

loadData((err, data) => {
  if (err) return console.error(err);
  console.log('done', data);
});
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md), [Closures](./03-closures-comprehensive.md)
### 🟢 [Junior] Q04: What is callback hell and when should you use it?

- **Tổng Quan:** What is callback hell and when should you use it?
- **Giải thích (VI):** callback hell là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** callback hell is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
getUser(1, (err, user) => {
  if (err) return handle(err);
  getOrders(user.id, (err2, orders) => {
    if (err2) return handle(err2);
    getInvoice(orders[0].id, (err3, invoice) => {
      if (err3) return handle(err3);
      console.log(invoice);
    });
  });
});
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md), [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q05: Common pitfalls of callback hell in production systems?

- **Tổng Quan:** Common pitfalls of callback hell in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
getUser(1, (err, user) => {
  if (err) return handle(err);
  getOrders(user.id, (err2, orders) => {
    if (err2) return handle(err2);
    getInvoice(orders[0].id, (err3, invoice) => {
      if (err3) return handle(err3);
      console.log(invoice);
    });
  });
});
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md), [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q06: How do you design a robust architecture around callback hell?

- **Tổng Quan:** How do you design a robust architecture around callback hell?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
getUser(1, (err, user) => {
  if (err) return handle(err);
  getOrders(user.id, (err2, orders) => {
    if (err2) return handle(err2);
    getInvoice(orders[0].id, (err3, invoice) => {
      if (err3) return handle(err3);
      console.log(invoice);
    });
  });
});
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md), [Closures](./03-closures-comprehensive.md)
### 🟢 [Junior] Q07: What is error-first callback convention and when should you use it?

- **Tổng Quan:** What is error-first callback convention and when should you use it?
- **Giải thích (VI):** error-first callback convention là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** error-first callback convention is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function loadData(callback) {
  setTimeout(() => callback(null, { id: 1, ok: true }), 100);
}

loadData((err, data) => {
  if (err) return console.error(err);
  console.log('done', data);
});
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md), [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q08: Common pitfalls of error-first callback convention in production systems?

- **Tổng Quan:** Common pitfalls of error-first callback convention in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function loadData(callback) {
  setTimeout(() => callback(null, { id: 1, ok: true }), 100);
}

loadData((err, data) => {
  if (err) return console.error(err);
  console.log('done', data);
});
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md), [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q09: How do you design a robust architecture around error-first callback convention?

- **Tổng Quan:** How do you design a robust architecture around error-first callback convention?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function loadData(callback) {
  setTimeout(() => callback(null, { id: 1, ok: true }), 100);
}

loadData((err, data) => {
  if (err) return console.error(err);
  console.log('done', data);
});
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md), [Closures](./03-closures-comprehensive.md)
## Promise Model and Chaining

- **Tổng Quan:** Promise chuẩn hoá trạng thái async: pending/fulfilled/rejected.
- **Giải thích:** Promise cải thiện khả năng compose luồng bất đồng bộ và xử lý lỗi tập trung.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q10: What is Promise states and when should you use it?

- **Tổng Quan:** What is Promise states and when should you use it?
- **Giải thích (VI):** Promise states là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** Promise states is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
fetch('/api/profile')
  .then((res) => res.json())
  .then((profile) => ({ ...profile, fullName: profile.first + ' ' + profile.last }))
  .then(console.log)
  .catch(console.error);
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q11: Common pitfalls of Promise states in production systems?

- **Tổng Quan:** Common pitfalls of Promise states in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
fetch('/api/profile')
  .then((res) => res.json())
  .then((profile) => ({ ...profile, fullName: profile.first + ' ' + profile.last }))
  .then(console.log)
  .catch(console.error);
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q12: How do you design a robust architecture around Promise states?

- **Tổng Quan:** How do you design a robust architecture around Promise states?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
fetch('/api/profile')
  .then((res) => res.json())
  .then((profile) => ({ ...profile, fullName: profile.first + ' ' + profile.last }))
  .then(console.log)
  .catch(console.error);
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q13: What is Promise chaining and when should you use it?

- **Tổng Quan:** What is Promise chaining and when should you use it?
- **Giải thích (VI):** Promise chaining là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** Promise chaining is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
fetch('/api/profile')
  .then((res) => res.json())
  .then((profile) => ({ ...profile, fullName: profile.first + ' ' + profile.last }))
  .then(console.log)
  .catch(console.error);
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q14: Common pitfalls of Promise chaining in production systems?

- **Tổng Quan:** Common pitfalls of Promise chaining in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
fetch('/api/profile')
  .then((res) => res.json())
  .then((profile) => ({ ...profile, fullName: profile.first + ' ' + profile.last }))
  .then(console.log)
  .catch(console.error);
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q15: How do you design a robust architecture around Promise chaining?

- **Tổng Quan:** How do you design a robust architecture around Promise chaining?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
fetch('/api/profile')
  .then((res) => res.json())
  .then((profile) => ({ ...profile, fullName: profile.first + ' ' + profile.last }))
  .then(console.log)
  .catch(console.error);
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q16: What is centralized Promise error handling and when should you use it?

- **Tổng Quan:** What is centralized Promise error handling and when should you use it?
- **Giải thích (VI):** centralized Promise error handling là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** centralized Promise error handling is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
fetch('/api/profile')
  .then((res) => res.json())
  .then((profile) => ({ ...profile, fullName: profile.first + ' ' + profile.last }))
  .then(console.log)
  .catch(console.error);
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q17: Common pitfalls of centralized Promise error handling in production systems?

- **Tổng Quan:** Common pitfalls of centralized Promise error handling in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
fetch('/api/profile')
  .then((res) => res.json())
  .then((profile) => ({ ...profile, fullName: profile.first + ' ' + profile.last }))
  .then(console.log)
  .catch(console.error);
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q18: How do you design a robust architecture around centralized Promise error handling?

- **Tổng Quan:** How do you design a robust architecture around centralized Promise error handling?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
fetch('/api/profile')
  .then((res) => res.json())
  .then((profile) => ({ ...profile, fullName: profile.first + ' ' + profile.last }))
  .then(console.log)
  .catch(console.error);
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q19: What is Promise.finally and cleanup and when should you use it?

- **Tổng Quan:** What is Promise.finally and cleanup and when should you use it?
- **Giải thích (VI):** Promise.finally and cleanup là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** Promise.finally and cleanup is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
fetch('/api/profile')
  .then((res) => res.json())
  .then((profile) => ({ ...profile, fullName: profile.first + ' ' + profile.last }))
  .then(console.log)
  .catch(console.error);
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q20: Common pitfalls of Promise.finally and cleanup in production systems?

- **Tổng Quan:** Common pitfalls of Promise.finally and cleanup in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
fetch('/api/profile')
  .then((res) => res.json())
  .then((profile) => ({ ...profile, fullName: profile.first + ' ' + profile.last }))
  .then(console.log)
  .catch(console.error);
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q21: How do you design a robust architecture around Promise.finally and cleanup?

- **Tổng Quan:** How do you design a robust architecture around Promise.finally and cleanup?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
fetch('/api/profile')
  .then((res) => res.json())
  .then((profile) => ({ ...profile, fullName: profile.first + ' ' + profile.last }))
  .then(console.log)
  .catch(console.error);
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
## Async/Await in Real Code

- **Tổng Quan:** async/await viết async code theo phong cách synchronous.
- **Giải thích:** Dễ đọc hơn nhưng vẫn cần hiểu Promise ở dưới để tránh bug ẩn.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q22: What is async function return semantics and when should you use it?

- **Tổng Quan:** What is async function return semantics and when should you use it?
- **Giải thích (VI):** async function return semantics là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** async function return semantics is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
async function getProfile() {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('HTTP error');
    return await res.json();
  } catch (error) {
    console.error('Get profile failed:', error.message);
    throw error;
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q23: Common pitfalls of async function return semantics in production systems?

- **Tổng Quan:** Common pitfalls of async function return semantics in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
async function getProfile() {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('HTTP error');
    return await res.json();
  } catch (error) {
    console.error('Get profile failed:', error.message);
    throw error;
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q24: How do you design a robust architecture around async function return semantics?

- **Tổng Quan:** How do you design a robust architecture around async function return semantics?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
async function getProfile() {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('HTTP error');
    return await res.json();
  } catch (error) {
    console.error('Get profile failed:', error.message);
    throw error;
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟢 [Junior] Q25: What is try/catch patterns and when should you use it?

- **Tổng Quan:** What is try/catch patterns and when should you use it?
- **Giải thích (VI):** try/catch patterns là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** try/catch patterns is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
async function getProfile() {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('HTTP error');
    return await res.json();
  } catch (error) {
    console.error('Get profile failed:', error.message);
    throw error;
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q26: Common pitfalls of try/catch patterns in production systems?

- **Tổng Quan:** Common pitfalls of try/catch patterns in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
async function getProfile() {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('HTTP error');
    return await res.json();
  } catch (error) {
    console.error('Get profile failed:', error.message);
    throw error;
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q27: How do you design a robust architecture around try/catch patterns?

- **Tổng Quan:** How do you design a robust architecture around try/catch patterns?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
async function getProfile() {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('HTTP error');
    return await res.json();
  } catch (error) {
    console.error('Get profile failed:', error.message);
    throw error;
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟢 [Junior] Q28: What is parallel execution with Promise.all and when should you use it?

- **Tổng Quan:** What is parallel execution with Promise.all and when should you use it?
- **Giải thích (VI):** parallel execution with Promise.all là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** parallel execution with Promise.all is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const a = Promise.resolve(1);
const b = Promise.resolve(2);
const c = Promise.reject(new Error('x'));

Promise.allSettled([a, b, c]).then((results) => {
  console.log(results.map((r) => r.status));
});
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q29: Common pitfalls of parallel execution with Promise.all in production systems?

- **Tổng Quan:** Common pitfalls of parallel execution with Promise.all in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const a = Promise.resolve(1);
const b = Promise.resolve(2);
const c = Promise.reject(new Error('x'));

Promise.allSettled([a, b, c]).then((results) => {
  console.log(results.map((r) => r.status));
});
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q30: How do you design a robust architecture around parallel execution with Promise.all?

- **Tổng Quan:** How do you design a robust architecture around parallel execution with Promise.all?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const a = Promise.resolve(1);
const b = Promise.resolve(2);
const c = Promise.reject(new Error('x'));

Promise.allSettled([a, b, c]).then((results) => {
  console.log(results.map((r) => r.status));
});
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟢 [Junior] Q31: What is sequential versus parallel await and when should you use it?

- **Tổng Quan:** What is sequential versus parallel await and when should you use it?
- **Giải thích (VI):** sequential versus parallel await là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** sequential versus parallel await is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
async function getProfile() {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('HTTP error');
    return await res.json();
  } catch (error) {
    console.error('Get profile failed:', error.message);
    throw error;
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q32: Common pitfalls of sequential versus parallel await in production systems?

- **Tổng Quan:** Common pitfalls of sequential versus parallel await in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
async function getProfile() {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('HTTP error');
    return await res.json();
  } catch (error) {
    console.error('Get profile failed:', error.message);
    throw error;
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q33: How do you design a robust architecture around sequential versus parallel await?

- **Tổng Quan:** How do you design a robust architecture around sequential versus parallel await?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
async function getProfile() {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('HTTP error');
    return await res.json();
  } catch (error) {
    console.error('Get profile failed:', error.message);
    throw error;
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
## Generators, Iterators, Async Iterators

- **Tổng Quan:** Generators cho phép pause/resume execution có kiểm soát.
- **Giải thích:** Iterator protocol giúp chuẩn hoá vòng lặp; async iterator mở rộng cho stream bất đồng bộ.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q34: What is iterators protocol and when should you use it?

- **Tổng Quan:** What is iterators protocol and when should you use it?
- **Giải thích (VI):** iterators protocol là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** iterators protocol is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}
const gen = idGenerator();
console.log(gen.next().value);
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q35: Common pitfalls of iterators protocol in production systems?

- **Tổng Quan:** Common pitfalls of iterators protocol in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}
const gen = idGenerator();
console.log(gen.next().value);
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q36: How do you design a robust architecture around iterators protocol?

- **Tổng Quan:** How do you design a robust architecture around iterators protocol?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}
const gen = idGenerator();
console.log(gen.next().value);
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q37: What is generators with yield and when should you use it?

- **Tổng Quan:** What is generators with yield and when should you use it?
- **Giải thích (VI):** generators with yield là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** generators with yield is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}
const gen = idGenerator();
console.log(gen.next().value);
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q38: Common pitfalls of generators with yield in production systems?

- **Tổng Quan:** Common pitfalls of generators with yield in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}
const gen = idGenerator();
console.log(gen.next().value);
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q39: How do you design a robust architecture around generators with yield?

- **Tổng Quan:** How do you design a robust architecture around generators with yield?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}
const gen = idGenerator();
console.log(gen.next().value);
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q40: What is async generators and for-await-of and when should you use it?

- **Tổng Quan:** What is async generators and for-await-of and when should you use it?
- **Giải thích (VI):** async generators and for-await-of là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** async generators and for-await-of is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
async function* streamLines(lines) {
  for (const line of lines) {
    await new Promise((r) => setTimeout(r, 10));
    yield line.toUpperCase();
  }
}

(async () => {
  for await (const line of streamLines(['a', 'b'])) {
    console.log(line);
  }
})();
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q41: Common pitfalls of async generators and for-await-of in production systems?

- **Tổng Quan:** Common pitfalls of async generators and for-await-of in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
async function* streamLines(lines) {
  for (const line of lines) {
    await new Promise((r) => setTimeout(r, 10));
    yield line.toUpperCase();
  }
}

(async () => {
  for await (const line of streamLines(['a', 'b'])) {
    console.log(line);
  }
})();
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q42: How do you design a robust architecture around async generators and for-await-of?

- **Tổng Quan:** How do you design a robust architecture around async generators and for-await-of?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
async function* streamLines(lines) {
  for (const line of lines) {
    await new Promise((r) => setTimeout(r, 10));
    yield line.toUpperCase();
  }
}

(async () => {
  for await (const line of streamLines(['a', 'b'])) {
    console.log(line);
  }
})();
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
## Cancellation, Scheduling, and Combinators

- **Tổng Quan:** AbortController + combinators là xương sống cho cancellation và coordination.
- **Giải thích:** Bạn cần điều phối nhiều promise, huỷ request đúng lúc, và hiểu microtask scheduling.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q43: What is AbortController and when should you use it?

- **Tổng Quan:** What is AbortController and when should you use it?
- **Giải thích (VI):** AbortController là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** AbortController is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 500);

fetch('/api/slow', { signal: controller.signal })
  .then((r) => r.json())
  .then(console.log)
  .catch((e) => {
    if (e.name === 'AbortError') console.log('Request cancelled');
  })
  .finally(() => clearTimeout(timer));
```
- **Related / Liên quan:** Xem thêm: [Event Loop notes](./09-async-comprehensive.md)
### 🟡 [Mid] Q44: Common pitfalls of AbortController in production systems?

- **Tổng Quan:** Common pitfalls of AbortController in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 500);

fetch('/api/slow', { signal: controller.signal })
  .then((r) => r.json())
  .then(console.log)
  .catch((e) => {
    if (e.name === 'AbortError') console.log('Request cancelled');
  })
  .finally(() => clearTimeout(timer));
```
- **Related / Liên quan:** Xem thêm: [Event Loop notes](./09-async-comprehensive.md)
### 🔴 [Senior] Q45: How do you design a robust architecture around AbortController?

- **Tổng Quan:** How do you design a robust architecture around AbortController?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 500);

fetch('/api/slow', { signal: controller.signal })
  .then((r) => r.json())
  .then(console.log)
  .catch((e) => {
    if (e.name === 'AbortError') console.log('Request cancelled');
  })
  .finally(() => clearTimeout(timer));
```
- **Related / Liên quan:** Xem thêm: [Event Loop notes](./09-async-comprehensive.md)
### 🟢 [Junior] Q46: What is Promise.all / allSettled / any / race and when should you use it?

- **Tổng Quan:** What is Promise.all / allSettled / any / race and when should you use it?
- **Giải thích (VI):** Promise.all / allSettled / any / race là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** Promise.all / allSettled / any / race is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const a = Promise.resolve(1);
const b = Promise.resolve(2);
const c = Promise.reject(new Error('x'));

Promise.allSettled([a, b, c]).then((results) => {
  console.log(results.map((r) => r.status));
});
```
- **Related / Liên quan:** Xem thêm: [Event Loop notes](./09-async-comprehensive.md)
### 🟡 [Mid] Q47: Common pitfalls of Promise.all / allSettled / any / race in production systems?

- **Tổng Quan:** Common pitfalls of Promise.all / allSettled / any / race in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const a = Promise.resolve(1);
const b = Promise.resolve(2);
const c = Promise.reject(new Error('x'));

Promise.allSettled([a, b, c]).then((results) => {
  console.log(results.map((r) => r.status));
});
```
- **Related / Liên quan:** Xem thêm: [Event Loop notes](./09-async-comprehensive.md)
### 🔴 [Senior] Q48: How do you design a robust architecture around Promise.all / allSettled / any / race?

- **Tổng Quan:** How do you design a robust architecture around Promise.all / allSettled / any / race?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const a = Promise.resolve(1);
const b = Promise.resolve(2);
const c = Promise.reject(new Error('x'));

Promise.allSettled([a, b, c]).then((results) => {
  console.log(results.map((r) => r.status));
});
```
- **Related / Liên quan:** Xem thêm: [Event Loop notes](./09-async-comprehensive.md)
### 🟢 [Junior] Q49: What is microtask queue scheduling and when should you use it?

- **Tổng Quan:** What is microtask queue scheduling and when should you use it?
- **Giải thích (VI):** microtask queue scheduling là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** microtask queue scheduling is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
console.log('A');
setTimeout(() => console.log('timer'), 0);
Promise.resolve().then(() => console.log('microtask'));
queueMicrotask(() => console.log('queueMicrotask'));
console.log('B');
```
- **Related / Liên quan:** Xem thêm: [Event Loop notes](./09-async-comprehensive.md)
### 🟡 [Mid] Q50: Common pitfalls of microtask queue scheduling in production systems?

- **Tổng Quan:** Common pitfalls of microtask queue scheduling in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
console.log('A');
setTimeout(() => console.log('timer'), 0);
Promise.resolve().then(() => console.log('microtask'));
queueMicrotask(() => console.log('queueMicrotask'));
console.log('B');
```
- **Related / Liên quan:** Xem thêm: [Event Loop notes](./09-async-comprehensive.md)
### 🔴 [Senior] Q51: How do you design a robust architecture around microtask queue scheduling?

- **Tổng Quan:** How do you design a robust architecture around microtask queue scheduling?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
console.log('A');
setTimeout(() => console.log('timer'), 0);
Promise.resolve().then(() => console.log('microtask'));
queueMicrotask(() => console.log('queueMicrotask'));
console.log('B');
```
- **Related / Liên quan:** Xem thêm: [Event Loop notes](./09-async-comprehensive.md)
## Practical Reliability Patterns

- **Tổng Quan:** Các pattern thực chiến: retry, debounce, throttle, rate limit.
- **Giải thích:** Đây là lớp bảo vệ production trước lỗi mạng, spam thao tác và giới hạn tài nguyên.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q52: What is retry with backoff and when should you use it?

- **Tổng Quan:** What is retry with backoff and when should you use it?
- **Giải thích (VI):** retry with backoff là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** retry with backoff is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
async function retry(fn, attempts = 3) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      await new Promise((r) => setTimeout(r, 100 * (i + 1)));
    }
  }
  throw lastError;
}
```
- **Related / Liên quan:** Xem thêm: [Closures patterns](./03-closures-comprehensive.md)
### 🟡 [Mid] Q53: Common pitfalls of retry with backoff in production systems?

- **Tổng Quan:** Common pitfalls of retry with backoff in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
async function retry(fn, attempts = 3) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      await new Promise((r) => setTimeout(r, 100 * (i + 1)));
    }
  }
  throw lastError;
}
```
- **Related / Liên quan:** Xem thêm: [Closures patterns](./03-closures-comprehensive.md)
### 🔴 [Senior] Q54: How do you design a robust architecture around retry with backoff?

- **Tổng Quan:** How do you design a robust architecture around retry with backoff?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
async function retry(fn, attempts = 3) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      await new Promise((r) => setTimeout(r, 100 * (i + 1)));
    }
  }
  throw lastError;
}
```
- **Related / Liên quan:** Xem thêm: [Closures patterns](./03-closures-comprehensive.md)
### 🟢 [Junior] Q55: What is debounce and when should you use it?

- **Tổng Quan:** What is debounce and when should you use it?
- **Giải thích (VI):** debounce là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** debounce is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
```
- **Related / Liên quan:** Xem thêm: [Closures patterns](./03-closures-comprehensive.md)
### 🟡 [Mid] Q56: Common pitfalls of debounce in production systems?

- **Tổng Quan:** Common pitfalls of debounce in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
```
- **Related / Liên quan:** Xem thêm: [Closures patterns](./03-closures-comprehensive.md)
### 🔴 [Senior] Q57: How do you design a robust architecture around debounce?

- **Tổng Quan:** How do you design a robust architecture around debounce?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
```
- **Related / Liên quan:** Xem thêm: [Closures patterns](./03-closures-comprehensive.md)
### 🟢 [Junior] Q58: What is throttle and when should you use it?

- **Tổng Quan:** What is throttle and when should you use it?
- **Giải thích (VI):** throttle là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** throttle is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function throttle(fn, wait = 300) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}
```
- **Related / Liên quan:** Xem thêm: [Closures patterns](./03-closures-comprehensive.md)
### 🟡 [Mid] Q59: Common pitfalls of throttle in production systems?

- **Tổng Quan:** Common pitfalls of throttle in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function throttle(fn, wait = 300) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}
```
- **Related / Liên quan:** Xem thêm: [Closures patterns](./03-closures-comprehensive.md)
### 🔴 [Senior] Q60: How do you design a robust architecture around throttle?

- **Tổng Quan:** How do you design a robust architecture around throttle?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function throttle(fn, wait = 300) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}
```
- **Related / Liên quan:** Xem thêm: [Closures patterns](./03-closures-comprehensive.md)
### 🟢 [Junior] Q61: What is rate limiting strategy and when should you use it?

- **Tổng Quan:** What is rate limiting strategy and when should you use it?
- **Giải thích (VI):** rate limiting strategy là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** rate limiting strategy is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function throttle(fn, wait = 300) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}
```
- **Related / Liên quan:** Xem thêm: [Closures patterns](./03-closures-comprehensive.md)
### 🟡 [Mid] Q62: Common pitfalls of rate limiting strategy in production systems?

- **Tổng Quan:** Common pitfalls of rate limiting strategy in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function throttle(fn, wait = 300) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}
```
- **Related / Liên quan:** Xem thêm: [Closures patterns](./03-closures-comprehensive.md)
### 🔴 [Senior] Q63: How do you design a robust architecture around rate limiting strategy?

- **Tổng Quan:** How do you design a robust architecture around rate limiting strategy?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function throttle(fn, wait = 300) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}
```
- **Related / Liên quan:** Xem thêm: [Closures patterns](./03-closures-comprehensive.md)
## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q64: What is event loop order interview challenge and when should you use it?

- **Tổng Quan:** What is event loop order interview challenge and when should you use it?
- **Giải thích (VI):** event loop order interview challenge là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** event loop order interview challenge is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
console.log('A');
setTimeout(() => console.log('timer'), 0);
Promise.resolve().then(() => console.log('microtask'));
queueMicrotask(() => console.log('queueMicrotask'));
console.log('B');
```
- **Related / Liên quan:** Liên quan: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q65: Common pitfalls of event loop order interview challenge in production systems?

- **Tổng Quan:** Common pitfalls of event loop order interview challenge in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
console.log('A');
setTimeout(() => console.log('timer'), 0);
Promise.resolve().then(() => console.log('microtask'));
queueMicrotask(() => console.log('queueMicrotask'));
console.log('B');
```
- **Related / Liên quan:** Liên quan: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q66: How do you design a robust architecture around event loop order interview challenge?

- **Tổng Quan:** How do you design a robust architecture around event loop order interview challenge?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
console.log('A');
setTimeout(() => console.log('timer'), 0);
Promise.resolve().then(() => console.log('microtask'));
queueMicrotask(() => console.log('queueMicrotask'));
console.log('B');
```
- **Related / Liên quan:** Liên quan: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
### 🟢 [Junior] Q67: What is error handling in async boundaries and when should you use it?

- **Tổng Quan:** What is error handling in async boundaries and when should you use it?
- **Giải thích (VI):** error handling in async boundaries là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** error handling in async boundaries is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
async function getProfile() {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('HTTP error');
    return await res.json();
  } catch (error) {
    console.error('Get profile failed:', error.message);
    throw error;
  }
}
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q68: Common pitfalls of error handling in async boundaries in production systems?

- **Tổng Quan:** Common pitfalls of error handling in async boundaries in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
async function getProfile() {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('HTTP error');
    return await res.json();
  } catch (error) {
    console.error('Get profile failed:', error.message);
    throw error;
  }
}
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q69: How do you design a robust architecture around error handling in async boundaries?

- **Tổng Quan:** How do you design a robust architecture around error handling in async boundaries?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
async function getProfile() {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('HTTP error');
    return await res.json();
  } catch (error) {
    console.error('Get profile failed:', error.message);
    throw error;
  }
}
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
### 🟢 [Junior] Q70: What is stream processing with async iterator and when should you use it?

- **Tổng Quan:** What is stream processing with async iterator and when should you use it?
- **Giải thích (VI):** stream processing with async iterator là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** stream processing with async iterator is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
async function* streamLines(lines) {
  for (const line of lines) {
    await new Promise((r) => setTimeout(r, 10));
    yield line.toUpperCase();
  }
}

(async () => {
  for await (const line of streamLines(['a', 'b'])) {
    console.log(line);
  }
})();
```
- **Related / Liên quan:** Liên quan: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q71: Common pitfalls of stream processing with async iterator in production systems?

- **Tổng Quan:** Common pitfalls of stream processing with async iterator in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
async function* streamLines(lines) {
  for (const line of lines) {
    await new Promise((r) => setTimeout(r, 10));
    yield line.toUpperCase();
  }
}

(async () => {
  for await (const line of streamLines(['a', 'b'])) {
    console.log(line);
  }
})();
```
- **Related / Liên quan:** Liên quan: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q72: How do you design a robust architecture around stream processing with async iterator?

- **Tổng Quan:** How do you design a robust architecture around stream processing with async iterator?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
async function* streamLines(lines) {
  for (const line of lines) {
    await new Promise((r) => setTimeout(r, 10));
    yield line.toUpperCase();
  }
}

(async () => {
  for await (const line of streamLines(['a', 'b'])) {
    console.log(line);
  }
})();
```
- **Related / Liên quan:** Liên quan: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q73: What is cancellation-safe UI requests and when should you use it?

- **Tổng Quan:** What is cancellation-safe UI requests and when should you use it?
- **Giải thích (VI):** cancellation-safe UI requests là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** cancellation-safe UI requests is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 500);

fetch('/api/slow', { signal: controller.signal })
  .then((r) => r.json())
  .then(console.log)
  .catch((e) => {
    if (e.name === 'AbortError') console.log('Request cancelled');
  })
  .finally(() => clearTimeout(timer));
```
- **Related / Liên quan:** Liên quan: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟡 [Mid] Q74: Common pitfalls of cancellation-safe UI requests in production systems?

- **Tổng Quan:** Common pitfalls of cancellation-safe UI requests in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 500);

fetch('/api/slow', { signal: controller.signal })
  .then((r) => r.json())
  .then(console.log)
  .catch((e) => {
    if (e.name === 'AbortError') console.log('Request cancelled');
  })
  .finally(() => clearTimeout(timer));
```
- **Related / Liên quan:** Liên quan: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🔴 [Senior] Q75: How do you design a robust architecture around cancellation-safe UI requests?

- **Tổng Quan:** How do you design a robust architecture around cancellation-safe UI requests?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 500);

fetch('/api/slow', { signal: controller.signal })
  .then((r) => r.json())
  .then(console.log)
  .catch((e) => {
    if (e.name === 'AbortError') console.log('Request cancelled');
  })
  .finally(() => clearTimeout(timer));
```
- **Related / Liên quan:** Liên quan: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟢 [Junior] Q76: What is designing resilient async services and when should you use it?

- **Tổng Quan:** What is designing resilient async services and when should you use it?
- **Giải thích (VI):** designing resilient async services là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** designing resilient async services is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
async function retry(fn, attempts = 3) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      await new Promise((r) => setTimeout(r, 100 * (i + 1)));
    }
  }
  throw lastError;
}
```
- **Related / Liên quan:** Liên quan: [Module patterns](./03-closures-comprehensive.md)
### 🟡 [Mid] Q77: Common pitfalls of designing resilient async services in production systems?

- **Tổng Quan:** Common pitfalls of designing resilient async services in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
async function retry(fn, attempts = 3) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      await new Promise((r) => setTimeout(r, 100 * (i + 1)));
    }
  }
  throw lastError;
}
```
- **Related / Liên quan:** Liên quan: [Module patterns](./03-closures-comprehensive.md)
### 🔴 [Senior] Q78: How do you design a robust architecture around designing resilient async services?

- **Tổng Quan:** How do you design a robust architecture around designing resilient async services?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
async function retry(fn, attempts = 3) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      await new Promise((r) => setTimeout(r, 100 * (i + 1)));
    }
  }
  throw lastError;
}
```
- **Related / Liên quan:** Liên quan: [Module patterns](./03-closures-comprehensive.md)
### 🟢 [Junior] Q79: What is Promise combinator selection and when should you use it?

- **Tổng Quan:** What is Promise combinator selection and when should you use it?
- **Giải thích (VI):** Promise combinator selection là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** Promise combinator selection is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const a = Promise.resolve(1);
const b = Promise.resolve(2);
const c = Promise.reject(new Error('x'));

Promise.allSettled([a, b, c]).then((results) => {
  console.log(results.map((r) => r.status));
});
```
- **Related / Liên quan:** Liên quan: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q80: Common pitfalls of Promise combinator selection in production systems?

- **Tổng Quan:** Common pitfalls of Promise combinator selection in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const a = Promise.resolve(1);
const b = Promise.resolve(2);
const c = Promise.reject(new Error('x'));

Promise.allSettled([a, b, c]).then((results) => {
  console.log(results.map((r) => r.status));
});
```
- **Related / Liên quan:** Liên quan: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q81: How do you design a robust architecture around Promise combinator selection?

- **Tổng Quan:** How do you design a robust architecture around Promise combinator selection?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const a = Promise.resolve(1);
const b = Promise.resolve(2);
const c = Promise.reject(new Error('x'));

Promise.allSettled([a, b, c]).then((results) => {
  console.log(results.map((r) => r.status));
});
```
- **Related / Liên quan:** Liên quan: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q82: What is debounce-throttle tradeoff under high traffic and when should you use it?

- **Tổng Quan:** What is debounce-throttle tradeoff under high traffic and when should you use it?
- **Giải thích (VI):** debounce-throttle tradeoff under high traffic là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** debounce-throttle tradeoff under high traffic is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function throttle(fn, wait = 300) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
