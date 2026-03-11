# ES6+ Features - Comprehensive Bilingual Deep Dive
## Destructuring, Symbols, Collections, Proxy/Reflect, and Modern Operators

[← Prototypes](./10-prototypes-inheritance-deep.md) | [Async](./09-async-comprehensive.md) | [Scope](./02-scope-hoisting-comprehensive.md)

---

## Tổng Quan / Overview

- **English:** This guide covers high-impact ES6+ and modern JavaScript features with interview-oriented and production-oriented explanations.
- **Tiếng Việt (Giải thích):** Tài liệu này tổng hợp các feature quan trọng của ES6+ và các phiên bản mới hơn, tập trung vào cách dùng thực tế trong phỏng vấn và code production.

- **Cross-reference:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)

---

## Destructuring and Data Extraction

- **Tổng Quan:** Destructuring giúp đọc dữ liệu ngắn gọn và rõ ý định.
- **Giải thích:** Cần hiểu nested/default/rename để tránh lỗi undefined và tăng readability.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q01: What is object destructuring and when should you use it?

- **Tổng Quan:** What is object destructuring and when should you use it?
- **Giải thích (VI):** object destructuring là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** object destructuring is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const user = { profile: { name: 'Buu' }, age: 20 };
const { profile: { name }, age = 18 } = user;
console.log(name, age);
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q02: Common pitfalls of object destructuring in production systems?

- **Tổng Quan:** Common pitfalls of object destructuring in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const user = { profile: { name: 'Buu' }, age: 20 };
const { profile: { name }, age = 18 } = user;
console.log(name, age);
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q03: How do you design a robust architecture around object destructuring?

- **Tổng Quan:** How do you design a robust architecture around object destructuring?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const user = { profile: { name: 'Buu' }, age: 20 };
const { profile: { name }, age = 18 } = user;
console.log(name, age);
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟢 [Junior] Q04: What is nested destructuring and when should you use it?

- **Tổng Quan:** What is nested destructuring and when should you use it?
- **Giải thích (VI):** nested destructuring là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** nested destructuring is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const user = { profile: { name: 'Buu' }, age: 20 };
const { profile: { name }, age = 18 } = user;
console.log(name, age);
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q05: Common pitfalls of nested destructuring in production systems?

- **Tổng Quan:** Common pitfalls of nested destructuring in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const user = { profile: { name: 'Buu' }, age: 20 };
const { profile: { name }, age = 18 } = user;
console.log(name, age);
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q06: How do you design a robust architecture around nested destructuring?

- **Tổng Quan:** How do you design a robust architecture around nested destructuring?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const user = { profile: { name: 'Buu' }, age: 20 };
const { profile: { name }, age = 18 } = user;
console.log(name, age);
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟢 [Junior] Q07: What is default and rename in destructuring and when should you use it?

- **Tổng Quan:** What is default and rename in destructuring and when should you use it?
- **Giải thích (VI):** default and rename in destructuring là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** default and rename in destructuring is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const user = { profile: { name: 'Buu' }, age: 20 };
const { profile: { name }, age = 18 } = user;
console.log(name, age);
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q08: Common pitfalls of default and rename in destructuring in production systems?

- **Tổng Quan:** Common pitfalls of default and rename in destructuring in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const user = { profile: { name: 'Buu' }, age: 20 };
const { profile: { name }, age = 18 } = user;
console.log(name, age);
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q09: How do you design a robust architecture around default and rename in destructuring?

- **Tổng Quan:** How do you design a robust architecture around default and rename in destructuring?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const user = { profile: { name: 'Buu' }, age: 20 };
const { profile: { name }, age = 18 } = user;
console.log(name, age);
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
## Spread and Rest

- **Tổng Quan:** Spread/rest đơn giản hoá thao tác danh sách và đối số.
- **Giải thích:** Dùng đúng giúp immutable update rõ ràng; dùng sai gây copy tốn bộ nhớ.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q10: What is spread for arrays/objects and when should you use it?

- **Tổng Quan:** What is spread for arrays/objects and when should you use it?
- **Giải thích (VI):** spread for arrays/objects là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** spread for arrays/objects is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const a = [1, 2];
const b = [...a, 3];
function sum(...nums) {
  return nums.reduce((s, n) => s + n, 0);
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q11: Common pitfalls of spread for arrays/objects in production systems?

- **Tổng Quan:** Common pitfalls of spread for arrays/objects in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const a = [1, 2];
const b = [...a, 3];
function sum(...nums) {
  return nums.reduce((s, n) => s + n, 0);
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q12: How do you design a robust architecture around spread for arrays/objects?

- **Tổng Quan:** How do you design a robust architecture around spread for arrays/objects?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const a = [1, 2];
const b = [...a, 3];
function sum(...nums) {
  return nums.reduce((s, n) => s + n, 0);
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟢 [Junior] Q13: What is rest parameters in APIs and when should you use it?

- **Tổng Quan:** What is rest parameters in APIs and when should you use it?
- **Giải thích (VI):** rest parameters in APIs là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** rest parameters in APIs is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const a = [1, 2];
const b = [...a, 3];
function sum(...nums) {
  return nums.reduce((s, n) => s + n, 0);
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q14: Common pitfalls of rest parameters in APIs in production systems?

- **Tổng Quan:** Common pitfalls of rest parameters in APIs in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const a = [1, 2];
const b = [...a, 3];
function sum(...nums) {
  return nums.reduce((s, n) => s + n, 0);
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q15: How do you design a robust architecture around rest parameters in APIs?

- **Tổng Quan:** How do you design a robust architecture around rest parameters in APIs?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const a = [1, 2];
const b = [...a, 3];
function sum(...nums) {
  return nums.reduce((s, n) => s + n, 0);
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟢 [Junior] Q16: What is performance trade-off of shallow copy and when should you use it?

- **Tổng Quan:** What is performance trade-off of shallow copy and when should you use it?
- **Giải thích (VI):** performance trade-off of shallow copy là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** performance trade-off of shallow copy is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const a = [1, 2];
const b = [...a, 3];
function sum(...nums) {
  return nums.reduce((s, n) => s + n, 0);
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q17: Common pitfalls of performance trade-off of shallow copy in production systems?

- **Tổng Quan:** Common pitfalls of performance trade-off of shallow copy in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const a = [1, 2];
const b = [...a, 3];
function sum(...nums) {
  return nums.reduce((s, n) => s + n, 0);
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q18: How do you design a robust architecture around performance trade-off of shallow copy?

- **Tổng Quan:** How do you design a robust architecture around performance trade-off of shallow copy?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const a = [1, 2];
const b = [...a, 3];
function sum(...nums) {
  return nums.reduce((s, n) => s + n, 0);
}
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
## Template Literals and Tagged Templates

- **Tổng Quan:** Template literals tăng khả năng biểu đạt string động.
- **Giải thích:** Tagged templates cho phép parse/sanitize/custom formatting.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q19: What is template literals basics and when should you use it?

- **Tổng Quan:** What is template literals basics and when should you use it?
- **Giải thích (VI):** template literals basics là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** template literals basics is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const lang = 'VI';\nconst msg = `Mode: ${lang}`;\nconsole.log(msg);
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q20: Common pitfalls of template literals basics in production systems?

- **Tổng Quan:** Common pitfalls of template literals basics in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const lang = 'VI';\nconst msg = `Mode: ${lang}`;\nconsole.log(msg);
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q21: How do you design a robust architecture around template literals basics?

- **Tổng Quan:** How do you design a robust architecture around template literals basics?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const lang = 'VI';\nconst msg = `Mode: ${lang}`;\nconsole.log(msg);
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q22: What is multiline and interpolation and when should you use it?

- **Tổng Quan:** What is multiline and interpolation and when should you use it?
- **Giải thích (VI):** multiline and interpolation là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** multiline and interpolation is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const lang = 'VI';\nconst msg = `Mode: ${lang}`;\nconsole.log(msg);
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q23: Common pitfalls of multiline and interpolation in production systems?

- **Tổng Quan:** Common pitfalls of multiline and interpolation in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const lang = 'VI';\nconst msg = `Mode: ${lang}`;\nconsole.log(msg);
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q24: How do you design a robust architecture around multiline and interpolation?

- **Tổng Quan:** How do you design a robust architecture around multiline and interpolation?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const lang = 'VI';\nconst msg = `Mode: ${lang}`;\nconsole.log(msg);
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q25: What is tagged templates use cases and when should you use it?

- **Tổng Quan:** What is tagged templates use cases and when should you use it?
- **Giải thích (VI):** tagged templates use cases là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** tagged templates use cases is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function safe(parts, ...vals) {\n  return parts.reduce((acc, p, i) => acc + p + (vals[i] ?? ''), '');\n}\nconsole.log(safe`Hello ${'<script>'}`);
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q26: Common pitfalls of tagged templates use cases in production systems?

- **Tổng Quan:** Common pitfalls of tagged templates use cases in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function safe(parts, ...vals) {\n  return parts.reduce((acc, p, i) => acc + p + (vals[i] ?? ''), '');\n}\nconsole.log(safe`Hello ${'<script>'}`);
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q27: How do you design a robust architecture around tagged templates use cases?

- **Tổng Quan:** How do you design a robust architecture around tagged templates use cases?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function safe(parts, ...vals) {\n  return parts.reduce((acc, p, i) => acc + p + (vals[i] ?? ''), '');\n}\nconsole.log(safe`Hello ${'<script>'}`);
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
## Symbols and Well-known Symbols

- **Tổng Quan:** Symbol tạo key duy nhất, tránh collision trong object.
- **Giải thích:** Well-known symbols can thiệp hành vi ngôn ngữ ở mức protocol.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q28: What is Symbol basics and when should you use it?

- **Tổng Quan:** What is Symbol basics and when should you use it?
- **Giải thích (VI):** Symbol basics là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** Symbol basics is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const id = Symbol('id');
const user = { [id]: 123, name: 'Buu' };
console.log(Object.keys(user)); // ['name']
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟡 [Mid] Q29: Common pitfalls of Symbol basics in production systems?

- **Tổng Quan:** Common pitfalls of Symbol basics in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const id = Symbol('id');
const user = { [id]: 123, name: 'Buu' };
console.log(Object.keys(user)); // ['name']
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🔴 [Senior] Q30: How do you design a robust architecture around Symbol basics?

- **Tổng Quan:** How do you design a robust architecture around Symbol basics?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const id = Symbol('id');
const user = { [id]: 123, name: 'Buu' };
console.log(Object.keys(user)); // ['name']
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟢 [Junior] Q31: What is well-known symbols and when should you use it?

- **Tổng Quan:** What is well-known symbols and when should you use it?
- **Giải thích (VI):** well-known symbols là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** well-known symbols is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
class Even {
  static [Symbol.hasInstance](value) {
    return Number.isInteger(value) && value % 2 === 0;
  }
}
console.log(2 instanceof Even);
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟡 [Mid] Q32: Common pitfalls of well-known symbols in production systems?

- **Tổng Quan:** Common pitfalls of well-known symbols in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
class Even {
  static [Symbol.hasInstance](value) {
    return Number.isInteger(value) && value % 2 === 0;
  }
}
console.log(2 instanceof Even);
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🔴 [Senior] Q33: How do you design a robust architecture around well-known symbols?

- **Tổng Quan:** How do you design a robust architecture around well-known symbols?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
class Even {
  static [Symbol.hasInstance](value) {
    return Number.isInteger(value) && value % 2 === 0;
  }
}
console.log(2 instanceof Even);
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟢 [Junior] Q34: What is designing symbol-based extension points and when should you use it?

- **Tổng Quan:** What is designing symbol-based extension points and when should you use it?
- **Giải thích (VI):** designing symbol-based extension points là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** designing symbol-based extension points is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const id = Symbol('id');
const user = { [id]: 123, name: 'Buu' };
console.log(Object.keys(user)); // ['name']
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟡 [Mid] Q35: Common pitfalls of designing symbol-based extension points in production systems?

- **Tổng Quan:** Common pitfalls of designing symbol-based extension points in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const id = Symbol('id');
const user = { [id]: 123, name: 'Buu' };
console.log(Object.keys(user)); // ['name']
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🔴 [Senior] Q36: How do you design a robust architecture around designing symbol-based extension points?

- **Tổng Quan:** How do you design a robust architecture around designing symbol-based extension points?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const id = Symbol('id');
const user = { [id]: 123, name: 'Buu' };
console.log(Object.keys(user)); // ['name']
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
## Iteration and Collection Types

- **Tổng Quan:** Iterator/generator + Map/Set/WeakMap/WeakSet là nền tảng cấu trúc dữ liệu hiện đại.
- **Giải thích:** Chọn đúng collection giúp code rõ nghĩa và tối ưu runtime.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q37: What is iterators and generators and when should you use it?

- **Tổng Quan:** What is iterators and generators and when should you use it?
- **Giải thích (VI):** iterators and generators là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** iterators and generators is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
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
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q38: Common pitfalls of iterators and generators in production systems?

- **Tổng Quan:** Common pitfalls of iterators and generators in production systems?
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
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q39: How do you design a robust architecture around iterators and generators?

- **Tổng Quan:** How do you design a robust architecture around iterators and generators?
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
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q40: What is Map and Set and when should you use it?

- **Tổng Quan:** What is Map and Set and when should you use it?
- **Giải thích (VI):** Map and Set là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** Map and Set is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const map = new Map();
map.set('k', 1);
const set = new Set([1, 1, 2]);
console.log(set.size);
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q41: Common pitfalls of Map and Set in production systems?

- **Tổng Quan:** Common pitfalls of Map and Set in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const map = new Map();
map.set('k', 1);
const set = new Set([1, 1, 2]);
console.log(set.size);
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q42: How do you design a robust architecture around Map and Set?

- **Tổng Quan:** How do you design a robust architecture around Map and Set?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const map = new Map();
map.set('k', 1);
const set = new Set([1, 1, 2]);
console.log(set.size);
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q43: What is WeakMap and WeakSet memory model and when should you use it?

- **Tổng Quan:** What is WeakMap and WeakSet memory model and when should you use it?
- **Giải thích (VI):** WeakMap and WeakSet memory model là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** WeakMap and WeakSet memory model is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const wm = new WeakMap();
let obj = {};
wm.set(obj, { meta: true });
obj = null; // có thể được GC
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q44: Common pitfalls of WeakMap and WeakSet memory model in production systems?

- **Tổng Quan:** Common pitfalls of WeakMap and WeakSet memory model in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const wm = new WeakMap();
let obj = {};
wm.set(obj, { meta: true });
obj = null; // có thể được GC
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q45: How do you design a robust architecture around WeakMap and WeakSet memory model?

- **Tổng Quan:** How do you design a robust architecture around WeakMap and WeakSet memory model?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const wm = new WeakMap();
let obj = {};
wm.set(obj, { meta: true });
obj = null; // có thể được GC
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
## Proxy, Reflect, and Modern Operators

- **Tổng Quan:** Proxy/Reflect hỗ trợ meta-programming; operator mới giúp expression an toàn hơn.
- **Giải thích:** optional chaining, nullish coalescing, logical assignment giảm boilerplate.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q46: What is Proxy fundamentals and when should you use it?

- **Tổng Quan:** What is Proxy fundamentals and when should you use it?
- **Giải thích (VI):** Proxy fundamentals là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** Proxy fundamentals is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const target = { x: 1 };
const proxy = new Proxy(target, {
  get(t, p, r) {
    return Reflect.get(t, p, r);
  }
});
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟡 [Mid] Q47: Common pitfalls of Proxy fundamentals in production systems?

- **Tổng Quan:** Common pitfalls of Proxy fundamentals in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const target = { x: 1 };
const proxy = new Proxy(target, {
  get(t, p, r) {
    return Reflect.get(t, p, r);
  }
});
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🔴 [Senior] Q48: How do you design a robust architecture around Proxy fundamentals?

- **Tổng Quan:** How do you design a robust architecture around Proxy fundamentals?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const target = { x: 1 };
const proxy = new Proxy(target, {
  get(t, p, r) {
    return Reflect.get(t, p, r);
  }
});
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟢 [Junior] Q49: What is Reflect as default behavior mirror and when should you use it?

- **Tổng Quan:** What is Reflect as default behavior mirror and when should you use it?
- **Giải thích (VI):** Reflect as default behavior mirror là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** Reflect as default behavior mirror is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const target = { x: 1 };
const proxy = new Proxy(target, {
  get(t, p, r) {
    return Reflect.get(t, p, r);
  }
});
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟡 [Mid] Q50: Common pitfalls of Reflect as default behavior mirror in production systems?

- **Tổng Quan:** Common pitfalls of Reflect as default behavior mirror in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const target = { x: 1 };
const proxy = new Proxy(target, {
  get(t, p, r) {
    return Reflect.get(t, p, r);
  }
});
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🔴 [Senior] Q51: How do you design a robust architecture around Reflect as default behavior mirror?

- **Tổng Quan:** How do you design a robust architecture around Reflect as default behavior mirror?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const target = { x: 1 };
const proxy = new Proxy(target, {
  get(t, p, r) {
    return Reflect.get(t, p, r);
  }
});
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟢 [Junior] Q52: What is optional chaining and nullish coalescing and when should you use it?

- **Tổng Quan:** What is optional chaining and nullish coalescing and when should you use it?
- **Giải thích (VI):** optional chaining and nullish coalescing là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** optional chaining and nullish coalescing is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const city = user?.address?.city ?? 'HCM';
config.timeout ||= 5000;
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟡 [Mid] Q53: Common pitfalls of optional chaining and nullish coalescing in production systems?

- **Tổng Quan:** Common pitfalls of optional chaining and nullish coalescing in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const city = user?.address?.city ?? 'HCM';
config.timeout ||= 5000;
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🔴 [Senior] Q54: How do you design a robust architecture around optional chaining and nullish coalescing?

- **Tổng Quan:** How do you design a robust architecture around optional chaining and nullish coalescing?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const city = user?.address?.city ?? 'HCM';
config.timeout ||= 5000;
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟢 [Junior] Q55: What is logical assignment operators and when should you use it?

- **Tổng Quan:** What is logical assignment operators and when should you use it?
- **Giải thích (VI):** logical assignment operators là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** logical assignment operators is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const city = user?.address?.city ?? 'HCM';
config.timeout ||= 5000;
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟡 [Mid] Q56: Common pitfalls of logical assignment operators in production systems?

- **Tổng Quan:** Common pitfalls of logical assignment operators in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const city = user?.address?.city ?? 'HCM';
config.timeout ||= 5000;
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🔴 [Senior] Q57: How do you design a robust architecture around logical assignment operators?

- **Tổng Quan:** How do you design a robust architecture around logical assignment operators?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const city = user?.address?.city ?? 'HCM';
config.timeout ||= 5000;
```
- **Related / Liên quan:** Xem thêm: [Prototypes](./10-prototypes-inheritance-deep.md)
## Top-level await and Proposals

- **Tổng Quan:** Top-level await thay đổi cách module khởi tạo async.
- **Giải thích:** Pattern matching proposal thể hiện hướng tiến hoá của JS trong tương lai.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q58: What is top-level await and when should you use it?

- **Tổng Quan:** What is top-level await and when should you use it?
- **Giải thích (VI):** top-level await là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** top-level await is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
// data.mjs
const res = await fetch('https://example.com/data.json');
export const data = await res.json();
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q59: Common pitfalls of top-level await in production systems?

- **Tổng Quan:** Common pitfalls of top-level await in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
// data.mjs
const res = await fetch('https://example.com/data.json');
export const data = await res.json();
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q60: How do you design a robust architecture around top-level await?

- **Tổng Quan:** How do you design a robust architecture around top-level await?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
// data.mjs
const res = await fetch('https://example.com/data.json');
export const data = await res.json();
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q61: What is module graph blocking considerations and when should you use it?

- **Tổng Quan:** What is module graph blocking considerations and when should you use it?
- **Giải thích (VI):** module graph blocking considerations là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** module graph blocking considerations is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
// data.mjs
const res = await fetch('https://example.com/data.json');
export const data = await res.json();
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q62: Common pitfalls of module graph blocking considerations in production systems?

- **Tổng Quan:** Common pitfalls of module graph blocking considerations in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
// data.mjs
const res = await fetch('https://example.com/data.json');
export const data = await res.json();
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q63: How do you design a robust architecture around module graph blocking considerations?

- **Tổng Quan:** How do you design a robust architecture around module graph blocking considerations?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
// data.mjs
const res = await fetch('https://example.com/data.json');
export const data = await res.json();
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q64: What is pattern matching proposal and when should you use it?

- **Tổng Quan:** What is pattern matching proposal and when should you use it?
- **Giải thích (VI):** pattern matching proposal là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** pattern matching proposal is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
// Proposal idea (pseudo)
// match (value) {
//   when ({ type: 'ok', data }) => data
//   when ({ type: 'err', error }) => throw error
// }
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q65: Common pitfalls of pattern matching proposal in production systems?

- **Tổng Quan:** Common pitfalls of pattern matching proposal in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
// Proposal idea (pseudo)
// match (value) {
//   when ({ type: 'ok', data }) => data
//   when ({ type: 'err', error }) => throw error
// }
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q66: How do you design a robust architecture around pattern matching proposal?

- **Tổng Quan:** How do you design a robust architecture around pattern matching proposal?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
// Proposal idea (pseudo)
// match (value) {
//   when ({ type: 'ok', data }) => data
//   when ({ type: 'err', error }) => throw error
// }
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q67: What is destructuring interview traps and when should you use it?

- **Tổng Quan:** What is destructuring interview traps and when should you use it?
- **Giải thích (VI):** destructuring interview traps là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** destructuring interview traps is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const user = { profile: { name: 'Buu' }, age: 20 };
const { profile: { name }, age = 18 } = user;
console.log(name, age);
```
- **Related / Liên quan:** Liên quan: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q68: Common pitfalls of destructuring interview traps in production systems?

- **Tổng Quan:** Common pitfalls of destructuring interview traps in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const user = { profile: { name: 'Buu' }, age: 20 };
const { profile: { name }, age = 18 } = user;
console.log(name, age);
```
- **Related / Liên quan:** Liên quan: [Scope](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q69: How do you design a robust architecture around destructuring interview traps?

- **Tổng Quan:** How do you design a robust architecture around destructuring interview traps?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const user = { profile: { name: 'Buu' }, age: 20 };
const { profile: { name }, age = 18 } = user;
console.log(name, age);
```
- **Related / Liên quan:** Liên quan: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟢 [Junior] Q70: What is spread/rest API design choices and when should you use it?

- **Tổng Quan:** What is spread/rest API design choices and when should you use it?
- **Giải thích (VI):** spread/rest API design choices là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** spread/rest API design choices is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const a = [1, 2];
const b = [...a, 3];
function sum(...nums) {
  return nums.reduce((s, n) => s + n, 0);
}
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q71: Common pitfalls of spread/rest API design choices in production systems?

- **Tổng Quan:** Common pitfalls of spread/rest API design choices in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const a = [1, 2];
const b = [...a, 3];
function sum(...nums) {
  return nums.reduce((s, n) => s + n, 0);
}
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q72: How do you design a robust architecture around spread/rest API design choices?

- **Tổng Quan:** How do you design a robust architecture around spread/rest API design choices?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const a = [1, 2];
const b = [...a, 3];
function sum(...nums) {
  return nums.reduce((s, n) => s + n, 0);
}
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
### 🟢 [Junior] Q73: What is secure tagged template usage and when should you use it?

- **Tổng Quan:** What is secure tagged template usage and when should you use it?
- **Giải thích (VI):** secure tagged template usage là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** secure tagged template usage is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function safe(parts, ...vals) {\n  return parts.reduce((acc, p, i) => acc + p + (vals[i] ?? ''), '');\n}\nconsole.log(safe`Hello ${'<script>'}`);
```
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q74: Common pitfalls of secure tagged template usage in production systems?

- **Tổng Quan:** Common pitfalls of secure tagged template usage in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function safe(parts, ...vals) {\n  return parts.reduce((acc, p, i) => acc + p + (vals[i] ?? ''), '');\n}\nconsole.log(safe`Hello ${'<script>'}`);
```
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q75: How do you design a robust architecture around secure tagged template usage?

- **Tổng Quan:** How do you design a robust architecture around secure tagged template usage?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function safe(parts, ...vals) {\n  return parts.reduce((acc, p, i) => acc + p + (vals[i] ?? ''), '');\n}\nconsole.log(safe`Hello ${'<script>'}`);
```
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q76: What is symbol interoperability design and when should you use it?

- **Tổng Quan:** What is symbol interoperability design and when should you use it?
- **Giải thích (VI):** symbol interoperability design là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** symbol interoperability design is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const id = Symbol('id');
const user = { [id]: 123, name: 'Buu' };
console.log(Object.keys(user)); // ['name']
```
- **Related / Liên quan:** Liên quan: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟡 [Mid] Q77: Common pitfalls of symbol interoperability design in production systems?

- **Tổng Quan:** Common pitfalls of symbol interoperability design in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const id = Symbol('id');
const user = { [id]: 123, name: 'Buu' };
console.log(Object.keys(user)); // ['name']
```
- **Related / Liên quan:** Liên quan: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🔴 [Senior] Q78: How do you design a robust architecture around symbol interoperability design?

- **Tổng Quan:** How do you design a robust architecture around symbol interoperability design?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const id = Symbol('id');
const user = { [id]: 123, name: 'Buu' };
console.log(Object.keys(user)); // ['name']
```
- **Related / Liên quan:** Liên quan: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟢 [Junior] Q79: What is map vs object decision matrix and when should you use it?

- **Tổng Quan:** What is map vs object decision matrix and when should you use it?
- **Giải thích (VI):** map vs object decision matrix là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** map vs object decision matrix is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const map = new Map();
map.set('k', 1);
const set = new Set([1, 1, 2]);
console.log(set.size);
```
- **Related / Liên quan:** Liên quan: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟡 [Mid] Q80: Common pitfalls of map vs object decision matrix in production systems?

- **Tổng Quan:** Common pitfalls of map vs object decision matrix in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const map = new Map();
map.set('k', 1);
const set = new Set([1, 1, 2]);
console.log(set.size);
```
- **Related / Liên quan:** Liên quan: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🔴 [Senior] Q81: How do you design a robust architecture around map vs object decision matrix?

- **Tổng Quan:** How do you design a robust architecture around map vs object decision matrix?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const map = new Map();
map.set('k', 1);
const set = new Set([1, 1, 2]);
console.log(set.size);
```
- **Related / Liên quan:** Liên quan: [Prototypes](./10-prototypes-inheritance-deep.md)
### 🟢 [Junior] Q82: What is proxy debugging strategies and when should you use it?

- **Tổng Quan:** What is proxy debugging strategies and when should you use it?
- **Giải thích (VI):** proxy debugging strategies là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** proxy debugging strategies is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const target = { x: 1 };
const proxy = new Proxy(target, {
  get(t, p, r) {
    return Reflect.get(t, p, r);
  }
});
```
- **Related / Liên quan:** Liên quan: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q83: Common pitfalls of proxy debugging strategies in production systems?

- **Tổng Quan:** Common pitfalls of proxy debugging strategies in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const target = { x: 1 };
const proxy = new Proxy(target, {
  get(t, p, r) {
    return Reflect.get(t, p, r);
  }
});
```
- **Related / Liên quan:** Liên quan: [Scope](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q84: How do you design a robust architecture around proxy debugging strategies?

- **Tổng Quan:** How do you design a robust architecture around proxy debugging strategies?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const target = { x: 1 };
const proxy = new Proxy(target, {
  get(t, p, r) {
    return Reflect.get(t, p, r);
  }
});
```
- **Related / Liên quan:** Liên quan: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟢 [Junior] Q85: What is modern operators readability policy and when should you use it?

- **Tổng Quan:** What is modern operators readability policy and when should you use it?
- **Giải thích (VI):** modern operators readability policy là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** modern operators readability policy is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const city = user?.address?.city ?? 'HCM';
config.timeout ||= 5000;
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q86: Common pitfalls of modern operators readability policy in production systems?

- **Tổng Quan:** Common pitfalls of modern operators readability policy in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const city = user?.address?.city ?? 'HCM';
config.timeout ||= 5000;
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q87: How do you design a robust architecture around modern operators readability policy?

- **Tổng Quan:** How do you design a robust architecture around modern operators readability policy?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const city = user?.address?.city ?? 'HCM';
config.timeout ||= 5000;
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
### 🟢 [Junior] Q88: What is top-level await in production bundling and when should you use it?

- **Tổng Quan:** What is top-level await in production bundling and when should you use it?
- **Giải thích (VI):** top-level await in production bundling là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** top-level await in production bundling is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
// data.mjs
const res = await fetch('https://example.com/data.json');
export const data = await res.json();
```
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q89: Common pitfalls of top-level await in production bundling in production systems?

- **Tổng Quan:** Common pitfalls of top-level await in production bundling in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
// data.mjs
const res = await fetch('https://example.com/data.json');
export const data = await res.json();
```
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q90: How do you design a robust architecture around top-level await in production bundling?

- **Tổng Quan:** How do you design a robust architecture around top-level await in production bundling?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
// data.mjs
const res = await fetch('https://example.com/data.json');
export const data = await res.json();
```
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
