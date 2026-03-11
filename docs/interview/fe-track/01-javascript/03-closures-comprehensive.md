# Closures - Comprehensive Bilingual Deep Dive
## Internal Mechanics, Lifecycle, Patterns, React Hooks, and Memory Safety

[← Scope & Hoisting](./02-scope-hoisting-comprehensive.md) | [Prototypes →](./10-prototypes-inheritance-deep.md) | [Async](./09-async-comprehensive.md)

---

## Tổng Quan / Overview

- **English:** This guide explains closures from engine internals ([[Environment]]) to lifecycle, practical patterns, React pitfalls, and memory safety.
- **Tiếng Việt (Giải thích):** Tài liệu này phân tích closure từ bản chất engine ([[Environment]]), vòng đời bộ nhớ, pattern thực chiến, đến lỗi phổ biến trong React và hệ thống lớn.

- **Cross-reference:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)

---

## Closure Core Theory

- **Tổng Quan:** Closure = function + lexical environment được giữ lại.
- **Giải thích:** Closure không phải cú pháp đặc biệt mà là hành vi runtime của hàm.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q01: What is closure definition and when should you use it?

- **Tổng Quan:** What is closure definition and when should you use it?
- **Giải thích (VI):** closure definition là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** closure definition is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q02: Common pitfalls of closure definition in production systems?

- **Tổng Quan:** Common pitfalls of closure definition in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q03: How do you design a robust architecture around closure definition?

- **Tổng Quan:** How do you design a robust architecture around closure definition?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
### 🟢 [Junior] Q04: What is [[Environment]] internal slot and when should you use it?

- **Tổng Quan:** What is [[Environment]] internal slot and when should you use it?
- **Giải thích (VI):** [[Environment]] internal slot là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** [[Environment]] internal slot is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function outer() {
  const config = { env: 'prod' };
  return function inner() {
    return config.env;
  };
}
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q05: Common pitfalls of [[Environment]] internal slot in production systems?

- **Tổng Quan:** Common pitfalls of [[Environment]] internal slot in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function outer() {
  const config = { env: 'prod' };
  return function inner() {
    return config.env;
  };
}
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q06: How do you design a robust architecture around [[Environment]] internal slot?

- **Tổng Quan:** How do you design a robust architecture around [[Environment]] internal slot?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function outer() {
  const config = { env: 'prod' };
  return function inner() {
    return config.env;
  };
}
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
### 🟢 [Junior] Q07: What is closure vs plain function reference and when should you use it?

- **Tổng Quan:** What is closure vs plain function reference and when should you use it?
- **Giải thích (VI):** closure vs plain function reference là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** closure vs plain function reference is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q08: Common pitfalls of closure vs plain function reference in production systems?

- **Tổng Quan:** Common pitfalls of closure vs plain function reference in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q09: How do you design a robust architecture around closure vs plain function reference?

- **Tổng Quan:** How do you design a robust architecture around closure vs plain function reference?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
## Lifecycle: Creation to Garbage Collection

- **Tổng Quan:** Closure được tạo khi function được tạo và giữ dữ liệu cho tới khi không còn reachable.
- **Giải thích:** Phải hiểu vòng đời để tránh memory leak trong app dài hạn.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q10: What is closure creation phase and when should you use it?

- **Tổng Quan:** What is closure creation phase and when should you use it?
- **Giải thích (VI):** closure creation phase là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** closure creation phase is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q11: Common pitfalls of closure creation phase in production systems?

- **Tổng Quan:** Common pitfalls of closure creation phase in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q12: How do you design a robust architecture around closure creation phase?

- **Tổng Quan:** How do you design a robust architecture around closure creation phase?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q13: What is retained variables and GC and when should you use it?

- **Tổng Quan:** What is retained variables and GC and when should you use it?
- **Giải thích (VI):** retained variables and GC là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** retained variables and GC is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function attachListener(node) {
  const bigData = new Array(10000).fill('x');
  function onClick() {
    console.log(bigData.length);
  }
  node.addEventListener('click', onClick);
  return () => node.removeEventListener('click', onClick);
}
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q14: Common pitfalls of retained variables and GC in production systems?

- **Tổng Quan:** Common pitfalls of retained variables and GC in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function attachListener(node) {
  const bigData = new Array(10000).fill('x');
  function onClick() {
    console.log(bigData.length);
  }
  node.addEventListener('click', onClick);
  return () => node.removeEventListener('click', onClick);
}
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q15: How do you design a robust architecture around retained variables and GC?

- **Tổng Quan:** How do you design a robust architecture around retained variables and GC?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function attachListener(node) {
  const bigData = new Array(10000).fill('x');
  function onClick() {
    console.log(bigData.length);
  }
  node.addEventListener('click', onClick);
  return () => node.removeEventListener('click', onClick);
}
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q16: What is memory leaks from closures and when should you use it?

- **Tổng Quan:** What is memory leaks from closures and when should you use it?
- **Giải thích (VI):** memory leaks from closures là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** memory leaks from closures is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function attachListener(node) {
  const bigData = new Array(10000).fill('x');
  function onClick() {
    console.log(bigData.length);
  }
  node.addEventListener('click', onClick);
  return () => node.removeEventListener('click', onClick);
}
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q17: Common pitfalls of memory leaks from closures in production systems?

- **Tổng Quan:** Common pitfalls of memory leaks from closures in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function attachListener(node) {
  const bigData = new Array(10000).fill('x');
  function onClick() {
    console.log(bigData.length);
  }
  node.addEventListener('click', onClick);
  return () => node.removeEventListener('click', onClick);
}
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q18: How do you design a robust architecture around memory leaks from closures?

- **Tổng Quan:** How do you design a robust architecture around memory leaks from closures?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function attachListener(node) {
  const bigData = new Array(10000).fill('x');
  function onClick() {
    console.log(bigData.length);
  }
  node.addEventListener('click', onClick);
  return () => node.removeEventListener('click', onClick);
}
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
## Practical Patterns

- **Tổng Quan:** Closure thường dùng để đóng gói state và tạo API nhỏ gọn.
- **Giải thích:** Module pattern, factory, decorator, memoization đều dựa trên closure.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q19: What is module pattern and when should you use it?

- **Tổng Quan:** What is module pattern and when should you use it?
- **Giải thích (VI):** module pattern là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** module pattern is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const Cart = (() => {
  const items = [];
  function add(item) { items.push(item); }
  function total() { return items.length; }
  return { add, total };
})();
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q20: Common pitfalls of module pattern in production systems?

- **Tổng Quan:** Common pitfalls of module pattern in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const Cart = (() => {
  const items = [];
  function add(item) { items.push(item); }
  function total() { return items.length; }
  return { add, total };
})();
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q21: How do you design a robust architecture around module pattern?

- **Tổng Quan:** How do you design a robust architecture around module pattern?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const Cart = (() => {
  const items = [];
  function add(item) { items.push(item); }
  function total() { return items.length; }
  return { add, total };
})();
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q22: What is revealing module pattern and when should you use it?

- **Tổng Quan:** What is revealing module pattern and when should you use it?
- **Giải thích (VI):** revealing module pattern là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** revealing module pattern is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const auth = (() => {
  let token = null;
  function setToken(v) { token = v; }
  function isLoggedIn() { return Boolean(token); }
  return { setToken, isLoggedIn };
})();
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q23: Common pitfalls of revealing module pattern in production systems?

- **Tổng Quan:** Common pitfalls of revealing module pattern in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const auth = (() => {
  let token = null;
  function setToken(v) { token = v; }
  function isLoggedIn() { return Boolean(token); }
  return { setToken, isLoggedIn };
})();
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q24: How do you design a robust architecture around revealing module pattern?

- **Tổng Quan:** How do you design a robust architecture around revealing module pattern?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const auth = (() => {
  let token = null;
  function setToken(v) { token = v; }
  function isLoggedIn() { return Boolean(token); }
  return { setToken, isLoggedIn };
})();
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q25: What is factory functions with private state and when should you use it?

- **Tổng Quan:** What is factory functions with private state and when should you use it?
- **Giải thích (VI):** factory functions with private state là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** factory functions with private state is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function createUser(name) {
  let points = 0;
  return {
    name,
    addPoint() { points++; },
    getPoints() { return points; }
  };
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q26: Common pitfalls of factory functions with private state in production systems?

- **Tổng Quan:** Common pitfalls of factory functions with private state in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function createUser(name) {
  let points = 0;
  return {
    name,
    addPoint() { points++; },
    getPoints() { return points; }
  };
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q27: How do you design a robust architecture around factory functions with private state?

- **Tổng Quan:** How do you design a robust architecture around factory functions with private state?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function createUser(name) {
  let points = 0;
  return {
    name,
    addPoint() { points++; },
    getPoints() { return points; }
  };
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q28: What is decorator wrappers and when should you use it?

- **Tổng Quan:** What is decorator wrappers and when should you use it?
- **Giải thích (VI):** decorator wrappers là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** decorator wrappers is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const withTiming = (fn) => (...args) => {
  const start = performance.now();
  const result = fn(...args);
  console.log('ms', performance.now() - start);
  return result;
};
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q29: Common pitfalls of decorator wrappers in production systems?

- **Tổng Quan:** Common pitfalls of decorator wrappers in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const withTiming = (fn) => (...args) => {
  const start = performance.now();
  const result = fn(...args);
  console.log('ms', performance.now() - start);
  return result;
};
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q30: How do you design a robust architecture around decorator wrappers?

- **Tổng Quan:** How do you design a robust architecture around decorator wrappers?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const withTiming = (fn) => (...args) => {
  const start = performance.now();
  const result = fn(...args);
  console.log('ms', performance.now() - start);
  return result;
};
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q31: What is memoization cache and when should you use it?

- **Tổng Quan:** What is memoization cache and when should you use it?
- **Giải thích (VI):** memoization cache là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** memoization cache is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function memoize(fn) {
  const cache = new Map();
  return (key) => {
    if (cache.has(key)) return cache.get(key);
    const value = fn(key);
    cache.set(key, value);
    return value;
  };
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q32: Common pitfalls of memoization cache in production systems?

- **Tổng Quan:** Common pitfalls of memoization cache in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function memoize(fn) {
  const cache = new Map();
  return (key) => {
    if (cache.has(key)) return cache.get(key);
    const value = fn(key);
    cache.set(key, value);
    return value;
  };
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q33: How do you design a robust architecture around memoization cache?

- **Tổng Quan:** How do you design a robust architecture around memoization cache?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function memoize(fn) {
  const cache = new Map();
  return (key) => {
    if (cache.has(key)) return cache.get(key);
    const value = fn(key);
    cache.set(key, value);
    return value;
  };
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
## Utility Patterns: once/debounce/throttle

- **Tổng Quan:** Utility function phổ biến trong frontend hầu hết dựa vào closure.
- **Giải thích:** Closure giữ timer, flag, state giữa nhiều lần gọi.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q34: What is once function implementation and when should you use it?

- **Tổng Quan:** What is once function implementation and when should you use it?
- **Giải thích (VI):** once function implementation là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** once function implementation is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q35: Common pitfalls of once function implementation in production systems?

- **Tổng Quan:** Common pitfalls of once function implementation in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q36: How do you design a robust architecture around once function implementation?

- **Tổng Quan:** How do you design a robust architecture around once function implementation?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q37: What is debounce with closure state and when should you use it?

- **Tổng Quan:** What is debounce with closure state and when should you use it?
- **Giải thích (VI):** debounce with closure state là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** debounce with closure state is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
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
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q38: Common pitfalls of debounce with closure state in production systems?

- **Tổng Quan:** Common pitfalls of debounce with closure state in production systems?
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
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q39: How do you design a robust architecture around debounce with closure state?

- **Tổng Quan:** How do you design a robust architecture around debounce with closure state?
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
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q40: What is throttle with closure state and when should you use it?

- **Tổng Quan:** What is throttle with closure state and when should you use it?
- **Giải thích (VI):** throttle with closure state là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** throttle with closure state is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
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
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q41: Common pitfalls of throttle with closure state in production systems?

- **Tổng Quan:** Common pitfalls of throttle with closure state in production systems?
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
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q42: How do you design a robust architecture around throttle with closure state?

- **Tổng Quan:** How do you design a robust architecture around throttle with closure state?
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
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
## Closures in React Hooks

- **Tổng Quan:** Hooks sử dụng closure rất mạnh nhưng dễ gặp stale closure bug.
- **Giải thích:** Cần hiểu dependency array, useRef, useCallback để kiểm soát.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q43: What is stale closure in useEffect and when should you use it?

- **Tổng Quan:** What is stale closure in useEffect and when should you use it?
- **Giải thích (VI):** stale closure in useEffect là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** stale closure in useEffect is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function useStableHandler(onSubmit) {
  const ref = React.useRef(onSubmit);
  ref.current = onSubmit;
  return React.useCallback((...args) => ref.current(...args), []);
}
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q44: Common pitfalls of stale closure in useEffect in production systems?

- **Tổng Quan:** Common pitfalls of stale closure in useEffect in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function useStableHandler(onSubmit) {
  const ref = React.useRef(onSubmit);
  ref.current = onSubmit;
  return React.useCallback((...args) => ref.current(...args), []);
}
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q45: How do you design a robust architecture around stale closure in useEffect?

- **Tổng Quan:** How do you design a robust architecture around stale closure in useEffect?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function useStableHandler(onSubmit) {
  const ref = React.useRef(onSubmit);
  ref.current = onSubmit;
  return React.useCallback((...args) => ref.current(...args), []);
}
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q46: What is stable callback strategy and when should you use it?

- **Tổng Quan:** What is stable callback strategy and when should you use it?
- **Giải thích (VI):** stable callback strategy là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** stable callback strategy is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function useStableHandler(onSubmit) {
  const ref = React.useRef(onSubmit);
  ref.current = onSubmit;
  return React.useCallback((...args) => ref.current(...args), []);
}
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q47: Common pitfalls of stable callback strategy in production systems?

- **Tổng Quan:** Common pitfalls of stable callback strategy in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function useStableHandler(onSubmit) {
  const ref = React.useRef(onSubmit);
  ref.current = onSubmit;
  return React.useCallback((...args) => ref.current(...args), []);
}
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q48: How do you design a robust architecture around stable callback strategy?

- **Tổng Quan:** How do you design a robust architecture around stable callback strategy?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function useStableHandler(onSubmit) {
  const ref = React.useRef(onSubmit);
  ref.current = onSubmit;
  return React.useCallback((...args) => ref.current(...args), []);
}
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q49: What is event handler closure pitfalls and when should you use it?

- **Tổng Quan:** What is event handler closure pitfalls and when should you use it?
- **Giải thích (VI):** event handler closure pitfalls là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** event handler closure pitfalls is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function useStableHandler(onSubmit) {
  const ref = React.useRef(onSubmit);
  ref.current = onSubmit;
  return React.useCallback((...args) => ref.current(...args), []);
}
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q50: Common pitfalls of event handler closure pitfalls in production systems?

- **Tổng Quan:** Common pitfalls of event handler closure pitfalls in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function useStableHandler(onSubmit) {
  const ref = React.useRef(onSubmit);
  ref.current = onSubmit;
  return React.useCallback((...args) => ref.current(...args), []);
}
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q51: How do you design a robust architecture around event handler closure pitfalls?

- **Tổng Quan:** How do you design a robust architecture around event handler closure pitfalls?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function useStableHandler(onSubmit) {
  const ref = React.useRef(onSubmit);
  ref.current = onSubmit;
  return React.useCallback((...args) => ref.current(...args), []);
}
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
## Interview Challenges and Debugging

- **Tổng Quan:** Nhiều câu interview kiểm tra khả năng đọc scope + closure.
- **Giải thích:** Thói quen trace lexical environment giúp giải nhanh và chính xác.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q52: What is loop + closure classic bug and when should you use it?

- **Tổng Quan:** What is loop + closure classic bug and when should you use it?
- **Giải thích (VI):** loop + closure classic bug là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** loop + closure classic bug is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q53: Common pitfalls of loop + closure classic bug in production systems?

- **Tổng Quan:** Common pitfalls of loop + closure classic bug in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q54: How do you design a robust architecture around loop + closure classic bug?

- **Tổng Quan:** How do you design a robust architecture around loop + closure classic bug?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
### 🟢 [Junior] Q55: What is closure and async callback race and when should you use it?

- **Tổng Quan:** What is closure and async callback race and when should you use it?
- **Giải thích (VI):** closure and async callback race là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** closure and async callback race is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
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
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q56: Common pitfalls of closure and async callback race in production systems?

- **Tổng Quan:** Common pitfalls of closure and async callback race in production systems?
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
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q57: How do you design a robust architecture around closure and async callback race?

- **Tổng Quan:** How do you design a robust architecture around closure and async callback race?
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
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
### 🟢 [Junior] Q58: What is closure readability and maintainability and when should you use it?

- **Tổng Quan:** What is closure readability and maintainability and when should you use it?
- **Giải thích (VI):** closure readability and maintainability là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** closure readability and maintainability is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q59: Common pitfalls of closure readability and maintainability in production systems?

- **Tổng Quan:** Common pitfalls of closure readability and maintainability in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q60: How do you design a robust architecture around closure readability and maintainability?

- **Tổng Quan:** How do you design a robust architecture around closure readability and maintainability?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
```
- **Related / Liên quan:** Xem thêm: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q61: What is build secure encapsulation with closures and when should you use it?

- **Tổng Quan:** What is build secure encapsulation with closures and when should you use it?
- **Giải thích (VI):** build secure encapsulation with closures là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** build secure encapsulation with closures is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const Cart = (() => {
  const items = [];
  function add(item) { items.push(item); }
  function total() { return items.length; }
  return { add, total };
})();
```
- **Related / Liên quan:** Liên quan: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q62: Common pitfalls of build secure encapsulation with closures in production systems?

- **Tổng Quan:** Common pitfalls of build secure encapsulation with closures in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const Cart = (() => {
  const items = [];
  function add(item) { items.push(item); }
  function total() { return items.length; }
  return { add, total };
})();
```
- **Related / Liên quan:** Liên quan: [Scope](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q63: How do you design a robust architecture around build secure encapsulation with closures?

- **Tổng Quan:** How do you design a robust architecture around build secure encapsulation with closures?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const Cart = (() => {
  const items = [];
  function add(item) { items.push(item); }
  function total() { return items.length; }
  return { add, total };
})();
```
- **Related / Liên quan:** Liên quan: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟢 [Junior] Q64: What is closure memory profiling workflow and when should you use it?

- **Tổng Quan:** What is closure memory profiling workflow and when should you use it?
- **Giải thích (VI):** closure memory profiling workflow là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** closure memory profiling workflow is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function attachListener(node) {
  const bigData = new Array(10000).fill('x');
  function onClick() {
    console.log(bigData.length);
  }
  node.addEventListener('click', onClick);
  return () => node.removeEventListener('click', onClick);
}
```
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q65: Common pitfalls of closure memory profiling workflow in production systems?

- **Tổng Quan:** Common pitfalls of closure memory profiling workflow in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function attachListener(node) {
  const bigData = new Array(10000).fill('x');
  function onClick() {
    console.log(bigData.length);
  }
  node.addEventListener('click', onClick);
  return () => node.removeEventListener('click', onClick);
}
```
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q66: How do you design a robust architecture around closure memory profiling workflow?

- **Tổng Quan:** How do you design a robust architecture around closure memory profiling workflow?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function attachListener(node) {
  const bigData = new Array(10000).fill('x');
  function onClick() {
    console.log(bigData.length);
  }
  node.addEventListener('click', onClick);
  return () => node.removeEventListener('click', onClick);
}
```
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q67: What is memoization invalidation strategy and when should you use it?

- **Tổng Quan:** What is memoization invalidation strategy and when should you use it?
- **Giải thích (VI):** memoization invalidation strategy là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** memoization invalidation strategy is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function memoize(fn) {
  const cache = new Map();
  return (key) => {
    if (cache.has(key)) return cache.get(key);
    const value = fn(key);
    cache.set(key, value);
    return value;
  };
}
```
- **Related / Liên quan:** Liên quan: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q68: Common pitfalls of memoization invalidation strategy in production systems?

- **Tổng Quan:** Common pitfalls of memoization invalidation strategy in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function memoize(fn) {
  const cache = new Map();
  return (key) => {
    if (cache.has(key)) return cache.get(key);
    const value = fn(key);
    cache.set(key, value);
    return value;
  };
}
```
- **Related / Liên quan:** Liên quan: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q69: How do you design a robust architecture around memoization invalidation strategy?

- **Tổng Quan:** How do you design a robust architecture around memoization invalidation strategy?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function memoize(fn) {
  const cache = new Map();
  return (key) => {
    if (cache.has(key)) return cache.get(key);
    const value = fn(key);
    cache.set(key, value);
    return value;
  };
}
```
- **Related / Liên quan:** Liên quan: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q70: What is functional decorator composition and when should you use it?

- **Tổng Quan:** What is functional decorator composition and when should you use it?
- **Giải thích (VI):** functional decorator composition là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** functional decorator composition is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const withTiming = (fn) => (...args) => {
  const start = performance.now();
  const result = fn(...args);
  console.log('ms', performance.now() - start);
  return result;
};
```
- **Related / Liên quan:** Liên quan: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟡 [Mid] Q71: Common pitfalls of functional decorator composition in production systems?

- **Tổng Quan:** Common pitfalls of functional decorator composition in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const withTiming = (fn) => (...args) => {
  const start = performance.now();
  const result = fn(...args);
  console.log('ms', performance.now() - start);
  return result;
};
```
- **Related / Liên quan:** Liên quan: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🔴 [Senior] Q72: How do you design a robust architecture around functional decorator composition?

- **Tổng Quan:** How do you design a robust architecture around functional decorator composition?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const withTiming = (fn) => (...args) => {
  const start = performance.now();
  const result = fn(...args);
  console.log('ms', performance.now() - start);
  return result;
};
```
- **Related / Liên quan:** Liên quan: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟢 [Junior] Q73: What is react closure bugs under concurrent rendering and when should you use it?

- **Tổng Quan:** What is react closure bugs under concurrent rendering and when should you use it?
- **Giải thích (VI):** react closure bugs under concurrent rendering là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** react closure bugs under concurrent rendering is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function useStableHandler(onSubmit) {
  const ref = React.useRef(onSubmit);
  ref.current = onSubmit;
  return React.useCallback((...args) => ref.current(...args), []);
}
```
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q74: Common pitfalls of react closure bugs under concurrent rendering in production systems?

- **Tổng Quan:** Common pitfalls of react closure bugs under concurrent rendering in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function useStableHandler(onSubmit) {
  const ref = React.useRef(onSubmit);
  ref.current = onSubmit;
  return React.useCallback((...args) => ref.current(...args), []);
}
```
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q75: How do you design a robust architecture around react closure bugs under concurrent rendering?

- **Tổng Quan:** How do you design a robust architecture around react closure bugs under concurrent rendering?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function useStableHandler(onSubmit) {
  const ref = React.useRef(onSubmit);
  ref.current = onSubmit;
  return React.useCallback((...args) => ref.current(...args), []);
}
```
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q76: What is once/debounce/throttle implementation comparison and when should you use it?

- **Tổng Quan:** What is once/debounce/throttle implementation comparison and when should you use it?
- **Giải thích (VI):** once/debounce/throttle implementation comparison là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** once/debounce/throttle implementation comparison is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
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
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q77: Common pitfalls of once/debounce/throttle implementation comparison in production systems?

- **Tổng Quan:** Common pitfalls of once/debounce/throttle implementation comparison in production systems?
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
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q78: How do you design a robust architecture around once/debounce/throttle implementation comparison?

- **Tổng Quan:** How do you design a robust architecture around once/debounce/throttle implementation comparison?
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
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q79: What is closure interview whiteboard approach and when should you use it?

- **Tổng Quan:** What is closure interview whiteboard approach and when should you use it?
- **Giải thích (VI):** closure interview whiteboard approach là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** closure interview whiteboard approach is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
```
- **Related / Liên quan:** Liên quan: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q80: Common pitfalls of closure interview whiteboard approach in production systems?

- **Tổng Quan:** Common pitfalls of closure interview whiteboard approach in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
```
- **Related / Liên quan:** Liên quan: [Scope](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q81: How do you design a robust architecture around closure interview whiteboard approach?

- **Tổng Quan:** How do you design a robust architecture around closure interview whiteboard approach?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
```
- **Related / Liên quan:** Liên quan: [Scope](./02-scope-hoisting-comprehensive.md)
