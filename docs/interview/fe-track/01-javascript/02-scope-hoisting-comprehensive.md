# Scope & Hoisting - Comprehensive Bilingual Deep Dive
## Lexical Scope, Hoisting, TDZ, Module Scope, and Interview Pitfalls

[← Variables](./01-variables-data-types.md) | [Closures →](./03-closures-comprehensive.md) | [Async](./09-async-comprehensive.md)

---

## Tổng Quan / Overview

- **English:** This document explains lexical scope, scope chain, hoisting semantics, TDZ behavior, module boundaries, and advanced interview pitfalls.
- **Tiếng Việt (Giải thích):** Tài liệu này giúp bạn hiểu sâu scope chain, cơ chế hoisting của từng loại declaration, TDZ, module scope và các bẫy phỏng vấn hay gặp.

- **Cross-reference:** Xem thêm: [Closures](./03-closures-comprehensive.md)

---

## Scope Foundations

- **Tổng Quan:** Scope quyết định nơi biến có thể được truy cập.
- **Giải thích:** Hiểu đúng scope giúp tránh bug shadowing và leak biến toàn cục.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q01: What is global scope and when should you use it?

- **Tổng Quan:** What is global scope and when should you use it?
- **Giải thích (VI):** global scope là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** global scope is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const globalVar = 'global';

function demo() {
  const functionVar = 'function';
  if (true) {
    const blockVar = 'block';
    console.log(globalVar, functionVar, blockVar);
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q02: Common pitfalls of global scope in production systems?

- **Tổng Quan:** Common pitfalls of global scope in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const globalVar = 'global';

function demo() {
  const functionVar = 'function';
  if (true) {
    const blockVar = 'block';
    console.log(globalVar, functionVar, blockVar);
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q03: How do you design a robust architecture around global scope?

- **Tổng Quan:** How do you design a robust architecture around global scope?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const globalVar = 'global';

function demo() {
  const functionVar = 'function';
  if (true) {
    const blockVar = 'block';
    console.log(globalVar, functionVar, blockVar);
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟢 [Junior] Q04: What is function scope and when should you use it?

- **Tổng Quan:** What is function scope and when should you use it?
- **Giải thích (VI):** function scope là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** function scope is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const globalVar = 'global';

function demo() {
  const functionVar = 'function';
  if (true) {
    const blockVar = 'block';
    console.log(globalVar, functionVar, blockVar);
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q05: Common pitfalls of function scope in production systems?

- **Tổng Quan:** Common pitfalls of function scope in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const globalVar = 'global';

function demo() {
  const functionVar = 'function';
  if (true) {
    const blockVar = 'block';
    console.log(globalVar, functionVar, blockVar);
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q06: How do you design a robust architecture around function scope?

- **Tổng Quan:** How do you design a robust architecture around function scope?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const globalVar = 'global';

function demo() {
  const functionVar = 'function';
  if (true) {
    const blockVar = 'block';
    console.log(globalVar, functionVar, blockVar);
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟢 [Junior] Q07: What is block scope and when should you use it?

- **Tổng Quan:** What is block scope and when should you use it?
- **Giải thích (VI):** block scope là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** block scope is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const globalVar = 'global';

function demo() {
  const functionVar = 'function';
  if (true) {
    const blockVar = 'block';
    console.log(globalVar, functionVar, blockVar);
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q08: Common pitfalls of block scope in production systems?

- **Tổng Quan:** Common pitfalls of block scope in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const globalVar = 'global';

function demo() {
  const functionVar = 'function';
  if (true) {
    const blockVar = 'block';
    console.log(globalVar, functionVar, blockVar);
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q09: How do you design a robust architecture around block scope?

- **Tổng Quan:** How do you design a robust architecture around block scope?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const globalVar = 'global';

function demo() {
  const functionVar = 'function';
  if (true) {
    const blockVar = 'block';
    console.log(globalVar, functionVar, blockVar);
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
## Lexical Scoping and Scope Chain

- **Tổng Quan:** JavaScript dùng lexical scope, không phải dynamic scope.
- **Giải thích:** Resolver tìm biến theo vị trí khai báo trong source code và leo scope chain.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q10: What is lexical scope and when should you use it?

- **Tổng Quan:** What is lexical scope and when should you use it?
- **Giải thích (VI):** lexical scope là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** lexical scope is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const globalVar = 'global';

function demo() {
  const functionVar = 'function';
  if (true) {
    const blockVar = 'block';
    console.log(globalVar, functionVar, blockVar);
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md), [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q11: Common pitfalls of lexical scope in production systems?

- **Tổng Quan:** Common pitfalls of lexical scope in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const globalVar = 'global';

function demo() {
  const functionVar = 'function';
  if (true) {
    const blockVar = 'block';
    console.log(globalVar, functionVar, blockVar);
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md), [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q12: How do you design a robust architecture around lexical scope?

- **Tổng Quan:** How do you design a robust architecture around lexical scope?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const globalVar = 'global';

function demo() {
  const functionVar = 'function';
  if (true) {
    const blockVar = 'block';
    console.log(globalVar, functionVar, blockVar);
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md), [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q13: What is scope chain lookup and when should you use it?

- **Tổng Quan:** What is scope chain lookup and when should you use it?
- **Giải thích (VI):** scope chain lookup là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** scope chain lookup is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const globalVar = 'global';

function demo() {
  const functionVar = 'function';
  if (true) {
    const blockVar = 'block';
    console.log(globalVar, functionVar, blockVar);
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md), [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q14: Common pitfalls of scope chain lookup in production systems?

- **Tổng Quan:** Common pitfalls of scope chain lookup in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const globalVar = 'global';

function demo() {
  const functionVar = 'function';
  if (true) {
    const blockVar = 'block';
    console.log(globalVar, functionVar, blockVar);
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md), [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q15: How do you design a robust architecture around scope chain lookup?

- **Tổng Quan:** How do you design a robust architecture around scope chain lookup?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const globalVar = 'global';

function demo() {
  const functionVar = 'function';
  if (true) {
    const blockVar = 'block';
    console.log(globalVar, functionVar, blockVar);
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md), [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q16: What is variable shadowing and when should you use it?

- **Tổng Quan:** What is variable shadowing and when should you use it?
- **Giải thích (VI):** variable shadowing là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** variable shadowing is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const globalVar = 'global';

function demo() {
  const functionVar = 'function';
  if (true) {
    const blockVar = 'block';
    console.log(globalVar, functionVar, blockVar);
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md), [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q17: Common pitfalls of variable shadowing in production systems?

- **Tổng Quan:** Common pitfalls of variable shadowing in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const globalVar = 'global';

function demo() {
  const functionVar = 'function';
  if (true) {
    const blockVar = 'block';
    console.log(globalVar, functionVar, blockVar);
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md), [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q18: How do you design a robust architecture around variable shadowing?

- **Tổng Quan:** How do you design a robust architecture around variable shadowing?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const globalVar = 'global';

function demo() {
  const functionVar = 'function';
  if (true) {
    const blockVar = 'block';
    console.log(globalVar, functionVar, blockVar);
  }
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md), [Async](./09-async-comprehensive.md)
## Hoisting Matrix

- **Tổng Quan:** Hoisting khác nhau giữa var, let, const, function, class.
- **Giải thích:** Hiểu matrix hoisting giúp dự đoán runtime chính xác trong interview.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q19: What is var hoisting and when should you use it?

- **Tổng Quan:** What is var hoisting and when should you use it?
- **Giải thích (VI):** var hoisting là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** var hoisting is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
console.log(a); // undefined
var a = 10;

// console.log(b); // ReferenceError
let b = 20;
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q20: Common pitfalls of var hoisting in production systems?

- **Tổng Quan:** Common pitfalls of var hoisting in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
console.log(a); // undefined
var a = 10;

// console.log(b); // ReferenceError
let b = 20;
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q21: How do you design a robust architecture around var hoisting?

- **Tổng Quan:** How do you design a robust architecture around var hoisting?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
console.log(a); // undefined
var a = 10;

// console.log(b); // ReferenceError
let b = 20;
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q22: What is let/const hoisting and TDZ and when should you use it?

- **Tổng Quan:** What is let/const hoisting and TDZ and when should you use it?
- **Giải thích (VI):** let/const hoisting and TDZ là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** let/const hoisting and TDZ is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function run() {
  // console.log(x); // ReferenceError: TDZ
  let x = 42;
  return x;
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q23: Common pitfalls of let/const hoisting and TDZ in production systems?

- **Tổng Quan:** Common pitfalls of let/const hoisting and TDZ in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function run() {
  // console.log(x); // ReferenceError: TDZ
  let x = 42;
  return x;
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q24: How do you design a robust architecture around let/const hoisting and TDZ?

- **Tổng Quan:** How do you design a robust architecture around let/const hoisting and TDZ?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function run() {
  // console.log(x); // ReferenceError: TDZ
  let x = 42;
  return x;
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q25: What is function declaration hoisting and when should you use it?

- **Tổng Quan:** What is function declaration hoisting and when should you use it?
- **Giải thích (VI):** function declaration hoisting là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** function declaration hoisting is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
console.log(a); // undefined
var a = 10;

// console.log(b); // ReferenceError
let b = 20;
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q26: Common pitfalls of function declaration hoisting in production systems?

- **Tổng Quan:** Common pitfalls of function declaration hoisting in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
console.log(a); // undefined
var a = 10;

// console.log(b); // ReferenceError
let b = 20;
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q27: How do you design a robust architecture around function declaration hoisting?

- **Tổng Quan:** How do you design a robust architecture around function declaration hoisting?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
console.log(a); // undefined
var a = 10;

// console.log(b); // ReferenceError
let b = 20;
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q28: What is class hoisting behavior and when should you use it?

- **Tổng Quan:** What is class hoisting behavior and when should you use it?
- **Giải thích (VI):** class hoisting behavior là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** class hoisting behavior is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function run() {
  // console.log(x); // ReferenceError: TDZ
  let x = 42;
  return x;
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q29: Common pitfalls of class hoisting behavior in production systems?

- **Tổng Quan:** Common pitfalls of class hoisting behavior in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function run() {
  // console.log(x); // ReferenceError: TDZ
  let x = 42;
  return x;
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q30: How do you design a robust architecture around class hoisting behavior?

- **Tổng Quan:** How do you design a robust architecture around class hoisting behavior?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function run() {
  // console.log(x); // ReferenceError: TDZ
  let x = 42;
  return x;
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
## TDZ in Detail

- **Tổng Quan:** TDZ là khoảng thời gian biến tồn tại nhưng chưa initialized.
- **Giải thích:** Access biến trong TDZ gây ReferenceError để bảo vệ tính rõ ràng.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q31: What is temporal dead zone and when should you use it?

- **Tổng Quan:** What is temporal dead zone and when should you use it?
- **Giải thích (VI):** temporal dead zone là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** temporal dead zone is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function run() {
  // console.log(x); // ReferenceError: TDZ
  let x = 42;
  return x;
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q32: Common pitfalls of temporal dead zone in production systems?

- **Tổng Quan:** Common pitfalls of temporal dead zone in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function run() {
  // console.log(x); // ReferenceError: TDZ
  let x = 42;
  return x;
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q33: How do you design a robust architecture around temporal dead zone?

- **Tổng Quan:** How do you design a robust architecture around temporal dead zone?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function run() {
  // console.log(x); // ReferenceError: TDZ
  let x = 42;
  return x;
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q34: What is default parameters and TDZ edge cases and when should you use it?

- **Tổng Quan:** What is default parameters and TDZ edge cases and when should you use it?
- **Giải thích (VI):** default parameters and TDZ edge cases là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** default parameters and TDZ edge cases is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function run() {
  // console.log(x); // ReferenceError: TDZ
  let x = 42;
  return x;
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q35: Common pitfalls of default parameters and TDZ edge cases in production systems?

- **Tổng Quan:** Common pitfalls of default parameters and TDZ edge cases in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function run() {
  // console.log(x); // ReferenceError: TDZ
  let x = 42;
  return x;
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q36: How do you design a robust architecture around default parameters and TDZ edge cases?

- **Tổng Quan:** How do you design a robust architecture around default parameters and TDZ edge cases?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function run() {
  // console.log(x); // ReferenceError: TDZ
  let x = 42;
  return x;
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q37: What is TDZ in loops and when should you use it?

- **Tổng Quan:** What is TDZ in loops and when should you use it?
- **Giải thích (VI):** TDZ in loops là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** TDZ in loops is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function run() {
  // console.log(x); // ReferenceError: TDZ
  let x = 42;
  return x;
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q38: Common pitfalls of TDZ in loops in production systems?

- **Tổng Quan:** Common pitfalls of TDZ in loops in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function run() {
  // console.log(x); // ReferenceError: TDZ
  let x = 42;
  return x;
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q39: How do you design a robust architecture around TDZ in loops?

- **Tổng Quan:** How do you design a robust architecture around TDZ in loops?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function run() {
  // console.log(x); // ReferenceError: TDZ
  let x = 42;
  return x;
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
## Historical and Module Scope Patterns

- **Tổng Quan:** IIFE từng là công cụ tạo scope riêng trước ES modules.
- **Giải thích:** Ngày nay module scope thay thế nhiều nhu cầu IIFE nhưng vẫn cần biết để đọc code cũ.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q40: What is IIFE isolation pattern and when should you use it?

- **Tổng Quan:** What is IIFE isolation pattern and when should you use it?
- **Giải thích (VI):** IIFE isolation pattern là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** IIFE isolation pattern is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
(function initApp() {
  const secret = 'only in IIFE';
  console.log('initialized');
})();
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q41: Common pitfalls of IIFE isolation pattern in production systems?

- **Tổng Quan:** Common pitfalls of IIFE isolation pattern in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
(function initApp() {
  const secret = 'only in IIFE';
  console.log('initialized');
})();
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q42: How do you design a robust architecture around IIFE isolation pattern?

- **Tổng Quan:** How do you design a robust architecture around IIFE isolation pattern?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
(function initApp() {
  const secret = 'only in IIFE';
  console.log('initialized');
})();
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟢 [Junior] Q43: What is module scope in ES modules and when should you use it?

- **Tổng Quan:** What is module scope in ES modules and when should you use it?
- **Giải thích (VI):** module scope in ES modules là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** module scope in ES modules is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
// user.js
const privateToken = 'abc';
export function getUser() {
  return { id: 1 };
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q44: Common pitfalls of module scope in ES modules in production systems?

- **Tổng Quan:** Common pitfalls of module scope in ES modules in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
// user.js
const privateToken = 'abc';
export function getUser() {
  return { id: 1 };
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q45: How do you design a robust architecture around module scope in ES modules?

- **Tổng Quan:** How do you design a robust architecture around module scope in ES modules?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
// user.js
const privateToken = 'abc';
export function getUser() {
  return { id: 1 };
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟢 [Junior] Q46: What is strict mode scope differences and when should you use it?

- **Tổng Quan:** What is strict mode scope differences and when should you use it?
- **Giải thích (VI):** strict mode scope differences là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** strict mode scope differences is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
'use strict';
function f() {
  // accidental = 1; // ReferenceError in strict mode
  let local = 1;
  return local;
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q47: Common pitfalls of strict mode scope differences in production systems?

- **Tổng Quan:** Common pitfalls of strict mode scope differences in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
'use strict';
function f() {
  // accidental = 1; // ReferenceError in strict mode
  let local = 1;
  return local;
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q48: How do you design a robust architecture around strict mode scope differences?

- **Tổng Quan:** How do you design a robust architecture around strict mode scope differences?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
'use strict';
function f() {
  // accidental = 1; // ReferenceError in strict mode
  let local = 1;
  return local;
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
## Dangerous Constructs and Function Forms

- **Tổng Quan:** eval/with làm code khó tối ưu và khó phân tích.
- **Giải thích:** Arrow function và regular function khác nhau về this/arguments/new target.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q49: What is eval and scope impact and when should you use it?

- **Tổng Quan:** What is eval and scope impact and when should you use it?
- **Giải thích (VI):** eval and scope impact là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** eval and scope impact is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function testEval() {
  const a = 1;
  eval('console.log(a)');
}
testEval();
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟡 [Mid] Q50: Common pitfalls of eval and scope impact in production systems?

- **Tổng Quan:** Common pitfalls of eval and scope impact in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function testEval() {
  const a = 1;
  eval('console.log(a)');
}
testEval();
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🔴 [Senior] Q51: How do you design a robust architecture around eval and scope impact?

- **Tổng Quan:** How do you design a robust architecture around eval and scope impact?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function testEval() {
  const a = 1;
  eval('console.log(a)');
}
testEval();
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟢 [Junior] Q52: What is with statement risks and when should you use it?

- **Tổng Quan:** What is with statement risks and when should you use it?
- **Giải thích (VI):** with statement risks là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** with statement risks is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const user = { name: 'Buu' };
// with (user) {
//   console.log(name);
// }
// Tránh dùng 'with' vì gây mơ hồ scope
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟡 [Mid] Q53: Common pitfalls of with statement risks in production systems?

- **Tổng Quan:** Common pitfalls of with statement risks in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const user = { name: 'Buu' };
// with (user) {
//   console.log(name);
// }
// Tránh dùng 'with' vì gây mơ hồ scope
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🔴 [Senior] Q54: How do you design a robust architecture around with statement risks?

- **Tổng Quan:** How do you design a robust architecture around with statement risks?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const user = { name: 'Buu' };
// with (user) {
//   console.log(name);
// }
// Tránh dùng 'with' vì gây mơ hồ scope
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟢 [Junior] Q55: What is arrow vs regular function scope behavior and when should you use it?

- **Tổng Quan:** What is arrow vs regular function scope behavior and when should you use it?
- **Giải thích (VI):** arrow vs regular function scope behavior là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** arrow vs regular function scope behavior is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const obj = {
  value: 10,
  regular() { return this.value; },
  arrow: () => this
};
console.log(obj.regular());
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟡 [Mid] Q56: Common pitfalls of arrow vs regular function scope behavior in production systems?

- **Tổng Quan:** Common pitfalls of arrow vs regular function scope behavior in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const obj = {
  value: 10,
  regular() { return this.value; },
  arrow: () => this
};
console.log(obj.regular());
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🔴 [Senior] Q57: How do you design a robust architecture around arrow vs regular function scope behavior?

- **Tổng Quan:** How do you design a robust architecture around arrow vs regular function scope behavior?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const obj = {
  value: 10,
  regular() { return this.value; },
  arrow: () => this
};
console.log(obj.regular());
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q58: What is predicting output with nested scopes and when should you use it?

- **Tổng Quan:** What is predicting output with nested scopes and when should you use it?
- **Giải thích (VI):** predicting output with nested scopes là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** predicting output with nested scopes is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const globalVar = 'global';

function demo() {
  const functionVar = 'function';
  if (true) {
    const blockVar = 'block';
    console.log(globalVar, functionVar, blockVar);
  }
}
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q59: Common pitfalls of predicting output with nested scopes in production systems?

- **Tổng Quan:** Common pitfalls of predicting output with nested scopes in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const globalVar = 'global';

function demo() {
  const functionVar = 'function';
  if (true) {
    const blockVar = 'block';
    console.log(globalVar, functionVar, blockVar);
  }
}
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q60: How do you design a robust architecture around predicting output with nested scopes?

- **Tổng Quan:** How do you design a robust architecture around predicting output with nested scopes?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const globalVar = 'global';

function demo() {
  const functionVar = 'function';
  if (true) {
    const blockVar = 'block';
    console.log(globalVar, functionVar, blockVar);
  }
}
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
### 🟢 [Junior] Q61: What is hoisting trap in legacy code and when should you use it?

- **Tổng Quan:** What is hoisting trap in legacy code and when should you use it?
- **Giải thích (VI):** hoisting trap in legacy code là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** hoisting trap in legacy code is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
console.log(a); // undefined
var a = 10;

// console.log(b); // ReferenceError
let b = 20;
```
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q62: Common pitfalls of hoisting trap in legacy code in production systems?

- **Tổng Quan:** Common pitfalls of hoisting trap in legacy code in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
console.log(a); // undefined
var a = 10;

// console.log(b); // ReferenceError
let b = 20;
```
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q63: How do you design a robust architecture around hoisting trap in legacy code?

- **Tổng Quan:** How do you design a robust architecture around hoisting trap in legacy code?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
console.log(a); // undefined
var a = 10;

// console.log(b); // ReferenceError
let b = 20;
```
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q64: What is TDZ debugging strategy and when should you use it?

- **Tổng Quan:** What is TDZ debugging strategy and when should you use it?
- **Giải thích (VI):** TDZ debugging strategy là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** TDZ debugging strategy is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function run() {
  // console.log(x); // ReferenceError: TDZ
  let x = 42;
  return x;
}
```
- **Related / Liên quan:** Liên quan: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q65: Common pitfalls of TDZ debugging strategy in production systems?

- **Tổng Quan:** Common pitfalls of TDZ debugging strategy in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function run() {
  // console.log(x); // ReferenceError: TDZ
  let x = 42;
  return x;
}
```
- **Related / Liên quan:** Liên quan: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q66: How do you design a robust architecture around TDZ debugging strategy?

- **Tổng Quan:** How do you design a robust architecture around TDZ debugging strategy?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function run() {
  // console.log(x); // ReferenceError: TDZ
  let x = 42;
  return x;
}
```
- **Related / Liên quan:** Liên quan: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q67: What is module boundary design and when should you use it?

- **Tổng Quan:** What is module boundary design and when should you use it?
- **Giải thích (VI):** module boundary design là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** module boundary design is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
// user.js
const privateToken = 'abc';
export function getUser() {
  return { id: 1 };
}
```
- **Related / Liên quan:** Liên quan: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟡 [Mid] Q68: Common pitfalls of module boundary design in production systems?

- **Tổng Quan:** Common pitfalls of module boundary design in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
// user.js
const privateToken = 'abc';
export function getUser() {
  return { id: 1 };
}
```
- **Related / Liên quan:** Liên quan: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🔴 [Senior] Q69: How do you design a robust architecture around module boundary design?

- **Tổng Quan:** How do you design a robust architecture around module boundary design?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
// user.js
const privateToken = 'abc';
export function getUser() {
  return { id: 1 };
}
```
- **Related / Liên quan:** Liên quan: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟢 [Junior] Q70: What is safe migration var to let/const and when should you use it?

- **Tổng Quan:** What is safe migration var to let/const and when should you use it?
- **Giải thích (VI):** safe migration var to let/const là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** safe migration var to let/const is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
console.log(a); // undefined
var a = 10;

// console.log(b); // ReferenceError
let b = 20;
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q71: Common pitfalls of safe migration var to let/const in production systems?

- **Tổng Quan:** Common pitfalls of safe migration var to let/const in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
console.log(a); // undefined
var a = 10;

// console.log(b); // ReferenceError
let b = 20;
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q72: How do you design a robust architecture around safe migration var to let/const?

- **Tổng Quan:** How do you design a robust architecture around safe migration var to let/const?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
console.log(a); // undefined
var a = 10;

// console.log(b); // ReferenceError
let b = 20;
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
### 🟢 [Junior] Q73: What is scope and security concerns and when should you use it?

- **Tổng Quan:** What is scope and security concerns and when should you use it?
- **Giải thích (VI):** scope and security concerns là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** scope and security concerns is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
'use strict';
function f() {
  // accidental = 1; // ReferenceError in strict mode
  let local = 1;
  return local;
}
```
- **Related / Liên quan:** Liên quan: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q74: Common pitfalls of scope and security concerns in production systems?

- **Tổng Quan:** Common pitfalls of scope and security concerns in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
'use strict';
function f() {
  // accidental = 1; // ReferenceError in strict mode
  let local = 1;
  return local;
}
```
- **Related / Liên quan:** Liên quan: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q75: How do you design a robust architecture around scope and security concerns?

- **Tổng Quan:** How do you design a robust architecture around scope and security concerns?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
'use strict';
function f() {
  // accidental = 1; // ReferenceError in strict mode
  let local = 1;
  return local;
}
```
- **Related / Liên quan:** Liên quan: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q76: What is arrow function interview puzzles and when should you use it?

- **Tổng Quan:** What is arrow function interview puzzles and when should you use it?
- **Giải thích (VI):** arrow function interview puzzles là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** arrow function interview puzzles is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const obj = {
  value: 10,
  regular() { return this.value; },
  arrow: () => this
};
console.log(obj.regular());
```
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q77: Common pitfalls of arrow function interview puzzles in production systems?

- **Tổng Quan:** Common pitfalls of arrow function interview puzzles in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const obj = {
  value: 10,
  regular() { return this.value; },
  arrow: () => this
};
console.log(obj.regular());
```
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q78: How do you design a robust architecture around arrow function interview puzzles?

- **Tổng Quan:** How do you design a robust architecture around arrow function interview puzzles?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const obj = {
  value: 10,
  regular() { return this.value; },
  arrow: () => this
};
console.log(obj.regular());
```
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
