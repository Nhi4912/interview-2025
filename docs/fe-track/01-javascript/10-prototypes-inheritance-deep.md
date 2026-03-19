# Prototypes & Inheritance - Comprehensive Bilingual Deep Dive

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Prototype Chain, Class Sugar, Descriptors, Reflect/Proxy, and Advanced Patterns

[← Closures](./03-closures-comprehensive.md) | [ES6 Features →](./11-es6-features-deep.md) | [Async](./09-async-comprehensive.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**VNG frontend interview (ứng viên chia sẻ):** Câu hỏi "What's the difference between `class` and prototype-based inheritance?" Ứng viên: "class là OOP như Java." Interviewer: "How does `class` work under the hood in JS?" — ứng viên không biết `class` là syntactic sugar over prototype chain, không có true class-based inheritance. Fail.

**Bài học:** React components, array methods (`map`, `filter`), and everything in JS runs on prototype chain. `class` syntax hides this — but interviews reveal understanding of what's actually happening.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Prototype chain giống gia phả: khi bạn tìm property trên object, JS "leo lên cây gia phả" đến `Object.prototype`. Nếu không tìm thấy ở con, tìm ở cha, tìm ở ông, tìm ở `Object.prototype`, cuối cùng là `null`. `class` syntax là "giấy khai sinh đẹp hơn" — cùng mechanism, khác presentation.

**Why it matters:** Prototype chain giải thích: tại sao `[].map()` works, tại sao `instanceof` works, tại sao method sharing across instances. Framework questions (React class vs functional) touch on prototype concepts.

---

## Tổng Quan / Overview

- **English:** This guide moves from core prototype mechanics to class syntax, descriptors, Reflect/Proxy, mixins, and inheritance design strategy.
- **Tiếng Việt (Giải thích):** Tài liệu này đi từ cơ chế prototype chain cốt lõi đến class syntax, descriptors, Reflect/Proxy, mixins và chiến lược thiết kế inheritance trong hệ thống lớn.

- **Cross-reference:** Xem thêm: [Closures](./03-closures-comprehensive.md)

---

## Prototype Fundamentals

- **Tổng Quan:** JavaScript inheritance dựa trên prototype chain thay vì class-based inheritance truyền thống.
- **Giải thích:** Mọi object đều có liên kết [[Prototype]] để kế thừa thuộc tính.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q01: What is __proto__ vs prototype and when should you use it?

- **Tổng Quan:** What is __proto__ vs prototype and when should you use it?
- **Giải thích (VI):** __proto__ vs prototype là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** __proto__ vs prototype is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const user = { role: 'member' };
const admin = Object.create(user);
admin.name = 'Alice';
console.log(admin.role);
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q02: Common pitfalls of __proto__ vs prototype in production systems?

- **Tổng Quan:** Common pitfalls of __proto__ vs prototype in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const user = { role: 'member' };
const admin = Object.create(user);
admin.name = 'Alice';
console.log(admin.role);
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q03: How do you design a robust architecture around __proto__ vs prototype?

- **Tổng Quan:** How do you design a robust architecture around __proto__ vs prototype?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const user = { role: 'member' };
const admin = Object.create(user);
admin.name = 'Alice';
console.log(admin.role);
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟢 [Junior] Q04: What is prototype chain property lookup and when should you use it?

- **Tổng Quan:** What is prototype chain property lookup and when should you use it?
- **Giải thích (VI):** prototype chain property lookup là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** prototype chain property lookup is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const user = { role: 'member' };
const admin = Object.create(user);
admin.name = 'Alice';
console.log(admin.role);
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q05: Common pitfalls of prototype chain property lookup in production systems?

- **Tổng Quan:** Common pitfalls of prototype chain property lookup in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const user = { role: 'member' };
const admin = Object.create(user);
admin.name = 'Alice';
console.log(admin.role);
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q06: How do you design a robust architecture around prototype chain property lookup?

- **Tổng Quan:** How do you design a robust architecture around prototype chain property lookup?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const user = { role: 'member' };
const admin = Object.create(user);
admin.name = 'Alice';
console.log(admin.role);
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟢 [Junior] Q07: What is Object.getPrototypeOf and Object.setPrototypeOf and when should you use it?

- **Tổng Quan:** What is Object.getPrototypeOf and Object.setPrototypeOf and when should you use it?
- **Giải thích (VI):** Object.getPrototypeOf and Object.setPrototypeOf là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** Object.getPrototypeOf and Object.setPrototypeOf is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const user = { role: 'member' };
const admin = Object.create(user);
admin.name = 'Alice';
console.log(admin.role);
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q08: Common pitfalls of Object.getPrototypeOf and Object.setPrototypeOf in production systems?

- **Tổng Quan:** Common pitfalls of Object.getPrototypeOf and Object.setPrototypeOf in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const user = { role: 'member' };
const admin = Object.create(user);
admin.name = 'Alice';
console.log(admin.role);
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q09: How do you design a robust architecture around Object.getPrototypeOf and Object.setPrototypeOf?

- **Tổng Quan:** How do you design a robust architecture around Object.getPrototypeOf and Object.setPrototypeOf?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const user = { role: 'member' };
const admin = Object.create(user);
admin.name = 'Alice';
console.log(admin.role);
```
- **Related / Liên quan:** Xem thêm: [Closures](./03-closures-comprehensive.md)
## Object.create and Constructor Functions

- **Tổng Quan:** Object.create cho phép tạo object với prototype tùy ý.
- **Giải thích:** Constructor function + prototype methods là pattern cổ điển nhưng vẫn quan trọng.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q10: What is Object.create usage and when should you use it?

- **Tổng Quan:** What is Object.create usage and when should you use it?
- **Giải thích (VI):** Object.create usage là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** Object.create usage is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const user = { role: 'member' };
const admin = Object.create(user);
admin.name = 'Alice';
console.log(admin.role);
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q11: Common pitfalls of Object.create usage in production systems?

- **Tổng Quan:** Common pitfalls of Object.create usage in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const user = { role: 'member' };
const admin = Object.create(user);
admin.name = 'Alice';
console.log(admin.role);
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q12: How do you design a robust architecture around Object.create usage?

- **Tổng Quan:** How do you design a robust architecture around Object.create usage?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const user = { role: 'member' };
const admin = Object.create(user);
admin.name = 'Alice';
console.log(admin.role);
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟢 [Junior] Q13: What is constructor functions and when should you use it?

- **Tổng Quan:** What is constructor functions and when should you use it?
- **Giải thích (VI):** constructor functions là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** constructor functions is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  return 'Hi ' + this.name;
};
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q14: Common pitfalls of constructor functions in production systems?

- **Tổng Quan:** Common pitfalls of constructor functions in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  return 'Hi ' + this.name;
};
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q15: How do you design a robust architecture around constructor functions?

- **Tổng Quan:** How do you design a robust architecture around constructor functions?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  return 'Hi ' + this.name;
};
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟢 [Junior] Q16: What is new keyword internals and when should you use it?

- **Tổng Quan:** What is new keyword internals and when should you use it?
- **Giải thích (VI):** new keyword internals là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** new keyword internals is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  return 'Hi ' + this.name;
};
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q17: Common pitfalls of new keyword internals in production systems?

- **Tổng Quan:** Common pitfalls of new keyword internals in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  return 'Hi ' + this.name;
};
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q18: How do you design a robust architecture around new keyword internals?

- **Tổng Quan:** How do you design a robust architecture around new keyword internals?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  return 'Hi ' + this.name;
};
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
## ES6 Class Syntax and Inheritance

- **Tổng Quan:** class là cú pháp sugar trên prototype model.
- **Giải thích:** extends/super giúp mô tả quan hệ kế thừa rõ ràng hơn.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q19: What is class syntax mechanics and when should you use it?

- **Tổng Quan:** What is class syntax mechanics and when should you use it?
- **Giải thích (VI):** class syntax mechanics là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** class syntax mechanics is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
class Animal {
  speak() { return '...'; }
}
class Dog extends Animal {
  speak() {
    return super.speak() + ' woof';
  }
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q20: Common pitfalls of class syntax mechanics in production systems?

- **Tổng Quan:** Common pitfalls of class syntax mechanics in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
class Animal {
  speak() { return '...'; }
}
class Dog extends Animal {
  speak() {
    return super.speak() + ' woof';
  }
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q21: How do you design a robust architecture around class syntax mechanics?

- **Tổng Quan:** How do you design a robust architecture around class syntax mechanics?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
class Animal {
  speak() { return '...'; }
}
class Dog extends Animal {
  speak() {
    return super.speak() + ' woof';
  }
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q22: What is extends and super and when should you use it?

- **Tổng Quan:** What is extends and super and when should you use it?
- **Giải thích (VI):** extends and super là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** extends and super is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
class Animal {
  speak() { return '...'; }
}
class Dog extends Animal {
  speak() {
    return super.speak() + ' woof';
  }
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q23: Common pitfalls of extends and super in production systems?

- **Tổng Quan:** Common pitfalls of extends and super in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
class Animal {
  speak() { return '...'; }
}
class Dog extends Animal {
  speak() {
    return super.speak() + ' woof';
  }
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q24: How do you design a robust architecture around extends and super?

- **Tổng Quan:** How do you design a robust architecture around extends and super?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
class Animal {
  speak() { return '...'; }
}
class Dog extends Animal {
  speak() {
    return super.speak() + ' woof';
  }
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q25: What is instance methods vs static methods and when should you use it?

- **Tổng Quan:** What is instance methods vs static methods and when should you use it?
- **Giải thích (VI):** instance methods vs static methods là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** instance methods vs static methods is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
class Animal {
  speak() { return '...'; }
}
class Dog extends Animal {
  speak() {
    return super.speak() + ' woof';
  }
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q26: Common pitfalls of instance methods vs static methods in production systems?

- **Tổng Quan:** Common pitfalls of instance methods vs static methods in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
class Animal {
  speak() { return '...'; }
}
class Dog extends Animal {
  speak() {
    return super.speak() + ' woof';
  }
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q27: How do you design a robust architecture around instance methods vs static methods?

- **Tổng Quan:** How do you design a robust architecture around instance methods vs static methods?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
class Animal {
  speak() { return '...'; }
}
class Dog extends Animal {
  speak() {
    return super.speak() + ' woof';
  }
}
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
## Meta-programming and Object Semantics

- **Tổng Quan:** Descriptors, Reflect, Proxy mở ra meta-programming cấp cao.
- **Giải thích:** Nắm các công cụ này giúp kiểm soát behavior object chính xác và an toàn.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q28: What is property descriptors and when should you use it?

- **Tổng Quan:** What is property descriptors and when should you use it?
- **Giải thích (VI):** property descriptors là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** property descriptors is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const obj = {};
Object.defineProperty(obj, 'id', {
  value: 1,
  writable: false,
  enumerable: true,
  configurable: false
});
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q29: Common pitfalls of property descriptors in production systems?

- **Tổng Quan:** Common pitfalls of property descriptors in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const obj = {};
Object.defineProperty(obj, 'id', {
  value: 1,
  writable: false,
  enumerable: true,
  configurable: false
});
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q30: How do you design a robust architecture around property descriptors?

- **Tổng Quan:** How do you design a robust architecture around property descriptors?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const obj = {};
Object.defineProperty(obj, 'id', {
  value: 1,
  writable: false,
  enumerable: true,
  configurable: false
});
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q31: What is Object.defineProperty patterns and when should you use it?

- **Tổng Quan:** What is Object.defineProperty patterns and when should you use it?
- **Giải thích (VI):** Object.defineProperty patterns là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** Object.defineProperty patterns is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const obj = {};
Object.defineProperty(obj, 'id', {
  value: 1,
  writable: false,
  enumerable: true,
  configurable: false
});
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q32: Common pitfalls of Object.defineProperty patterns in production systems?

- **Tổng Quan:** Common pitfalls of Object.defineProperty patterns in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const obj = {};
Object.defineProperty(obj, 'id', {
  value: 1,
  writable: false,
  enumerable: true,
  configurable: false
});
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q33: How do you design a robust architecture around Object.defineProperty patterns?

- **Tổng Quan:** How do you design a robust architecture around Object.defineProperty patterns?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const obj = {};
Object.defineProperty(obj, 'id', {
  value: 1,
  writable: false,
  enumerable: true,
  configurable: false
});
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q34: What is Reflect API and when should you use it?

- **Tổng Quan:** What is Reflect API and when should you use it?
- **Giải thích (VI):** Reflect API là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** Reflect API is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const target = { x: 1 };
const proxy = new Proxy(target, {
  get(t, p, r) {
    return Reflect.get(t, p, r);
  }
});
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q35: Common pitfalls of Reflect API in production systems?

- **Tổng Quan:** Common pitfalls of Reflect API in production systems?
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
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q36: How do you design a robust architecture around Reflect API?

- **Tổng Quan:** How do you design a robust architecture around Reflect API?
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
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟢 [Junior] Q37: What is Proxy-based inheritance patterns and when should you use it?

- **Tổng Quan:** What is Proxy-based inheritance patterns and when should you use it?
- **Giải thích (VI):** Proxy-based inheritance patterns là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** Proxy-based inheritance patterns is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const target = { x: 1 };
const proxy = new Proxy(target, {
  get(t, p, r) {
    return Reflect.get(t, p, r);
  }
});
```
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🟡 [Mid] Q38: Common pitfalls of Proxy-based inheritance patterns in production systems?

- **Tổng Quan:** Common pitfalls of Proxy-based inheritance patterns in production systems?
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
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
### 🔴 [Senior] Q39: How do you design a robust architecture around Proxy-based inheritance patterns?

- **Tổng Quan:** How do you design a robust architecture around Proxy-based inheritance patterns?
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
- **Related / Liên quan:** Xem thêm: [ES6 Features](./11-es6-features-deep.md)
## Advanced Inheritance Techniques

- **Tổng Quan:** Mixins và Symbol.hasInstance cung cấp cơ chế mở rộng linh hoạt.
- **Giải thích:** Nhưng cần kiểm soát độ phức tạp để tránh hard-to-debug behavior.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q40: What is mixins composition and when should you use it?

- **Tổng Quan:** What is mixins composition and when should you use it?
- **Giải thích (VI):** mixins composition là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** mixins composition is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const canLog = (Base) => class extends Base {
  log(msg) { console.log(msg); }
};
class Service {}
class UserService extends canLog(Service) {}
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q41: Common pitfalls of mixins composition in production systems?

- **Tổng Quan:** Common pitfalls of mixins composition in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const canLog = (Base) => class extends Base {
  log(msg) { console.log(msg); }
};
class Service {}
class UserService extends canLog(Service) {}
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q42: How do you design a robust architecture around mixins composition?

- **Tổng Quan:** How do you design a robust architecture around mixins composition?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const canLog = (Base) => class extends Base {
  log(msg) { console.log(msg); }
};
class Service {}
class UserService extends canLog(Service) {}
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q43: What is Symbol.hasInstance customization and when should you use it?

- **Tổng Quan:** What is Symbol.hasInstance customization and when should you use it?
- **Giải thích (VI):** Symbol.hasInstance customization là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** Symbol.hasInstance customization is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
class Even {
  static [Symbol.hasInstance](value) {
    return Number.isInteger(value) && value % 2 === 0;
  }
}
console.log(2 instanceof Even);
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q44: Common pitfalls of Symbol.hasInstance customization in production systems?

- **Tổng Quan:** Common pitfalls of Symbol.hasInstance customization in production systems?
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
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q45: How do you design a robust architecture around Symbol.hasInstance customization?

- **Tổng Quan:** How do you design a robust architecture around Symbol.hasInstance customization?
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
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q46: What is composition over inheritance decisions and when should you use it?

- **Tổng Quan:** What is composition over inheritance decisions and when should you use it?
- **Giải thích (VI):** composition over inheritance decisions là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** composition over inheritance decisions is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const canLog = (Base) => class extends Base {
  log(msg) { console.log(msg); }
};
class Service {}
class UserService extends canLog(Service) {}
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q47: Common pitfalls of composition over inheritance decisions in production systems?

- **Tổng Quan:** Common pitfalls of composition over inheritance decisions in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const canLog = (Base) => class extends Base {
  log(msg) { console.log(msg); }
};
class Service {}
class UserService extends canLog(Service) {}
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q48: How do you design a robust architecture around composition over inheritance decisions?

- **Tổng Quan:** How do you design a robust architecture around composition over inheritance decisions?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const canLog = (Base) => class extends Base {
  log(msg) { console.log(msg); }
};
class Service {}
class UserService extends canLog(Service) {}
```
- **Related / Liên quan:** Xem thêm: [Async](./09-async-comprehensive.md)
## Performance and Design Trade-offs

- **Tổng Quan:** Shape stability, method sharing, và dynamic proxy ảnh hưởng performance.
- **Giải thích:** Cần cân bằng giữa flexibility và predictability cho runtime optimization.
- **Ví dụ:** Các câu hỏi bên dưới dùng JavaScript thuần để mô tả cơ chế cốt lõi.

### 🟢 [Junior] Q49: What is prototype method sharing memory impact and when should you use it?

- **Tổng Quan:** What is prototype method sharing memory impact and when should you use it?
- **Giải thích (VI):** prototype method sharing memory impact là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** prototype method sharing memory impact is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  return 'Hi ' + this.name;
};
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q50: Common pitfalls of prototype method sharing memory impact in production systems?

- **Tổng Quan:** Common pitfalls of prototype method sharing memory impact in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  return 'Hi ' + this.name;
};
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q51: How do you design a robust architecture around prototype method sharing memory impact?

- **Tổng Quan:** How do you design a robust architecture around prototype method sharing memory impact?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  return 'Hi ' + this.name;
};
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟢 [Junior] Q52: What is dynamic prototype mutation risks and when should you use it?

- **Tổng Quan:** What is dynamic prototype mutation risks and when should you use it?
- **Giải thích (VI):** dynamic prototype mutation risks là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** dynamic prototype mutation risks is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const user = { role: 'member' };
const admin = Object.create(user);
admin.name = 'Alice';
console.log(admin.role);
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q53: Common pitfalls of dynamic prototype mutation risks in production systems?

- **Tổng Quan:** Common pitfalls of dynamic prototype mutation risks in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const user = { role: 'member' };
const admin = Object.create(user);
admin.name = 'Alice';
console.log(admin.role);
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q54: How do you design a robust architecture around dynamic prototype mutation risks?

- **Tổng Quan:** How do you design a robust architecture around dynamic prototype mutation risks?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const user = { role: 'member' };
const admin = Object.create(user);
admin.name = 'Alice';
console.log(admin.role);
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟢 [Junior] Q55: What is designing maintainable inheritance trees and when should you use it?

- **Tổng Quan:** What is designing maintainable inheritance trees and when should you use it?
- **Giải thích (VI):** designing maintainable inheritance trees là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** designing maintainable inheritance trees is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
class Animal {
  speak() { return '...'; }
}
class Dog extends Animal {
  speak() {
    return super.speak() + ' woof';
  }
}
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q56: Common pitfalls of designing maintainable inheritance trees in production systems?

- **Tổng Quan:** Common pitfalls of designing maintainable inheritance trees in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
class Animal {
  speak() { return '...'; }
}
class Dog extends Animal {
  speak() {
    return super.speak() + ' woof';
  }
}
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q57: How do you design a robust architecture around designing maintainable inheritance trees?

- **Tổng Quan:** How do you design a robust architecture around designing maintainable inheritance trees?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
class Animal {
  speak() { return '...'; }
}
class Dog extends Animal {
  speak() {
    return super.speak() + ' woof';
  }
}
```
- **Related / Liên quan:** Xem thêm: [Scope](./02-scope-hoisting-comprehensive.md)
## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q58: What is debugging prototype chain issues and when should you use it?

- **Tổng Quan:** What is debugging prototype chain issues and when should you use it?
- **Giải thích (VI):** debugging prototype chain issues là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** debugging prototype chain issues is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const user = { role: 'member' };
const admin = Object.create(user);
admin.name = 'Alice';
console.log(admin.role);
```
- **Related / Liên quan:** Liên quan: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q59: Common pitfalls of debugging prototype chain issues in production systems?

- **Tổng Quan:** Common pitfalls of debugging prototype chain issues in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const user = { role: 'member' };
const admin = Object.create(user);
admin.name = 'Alice';
console.log(admin.role);
```
- **Related / Liên quan:** Liên quan: [Scope](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q60: How do you design a robust architecture around debugging prototype chain issues?

- **Tổng Quan:** How do you design a robust architecture around debugging prototype chain issues?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const user = { role: 'member' };
const admin = Object.create(user);
admin.name = 'Alice';
console.log(admin.role);
```
- **Related / Liên quan:** Liên quan: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟢 [Junior] Q61: What is class vs constructor function interview answer and when should you use it?

- **Tổng Quan:** What is class vs constructor function interview answer and when should you use it?
- **Giải thích (VI):** class vs constructor function interview answer là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** class vs constructor function interview answer is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
class Animal {
  speak() { return '...'; }
}
class Dog extends Animal {
  speak() {
    return super.speak() + ' woof';
  }
}
```
- **Related / Liên quan:** Liên quan: [ES6](./11-es6-features-deep.md)
### 🟡 [Mid] Q62: Common pitfalls of class vs constructor function interview answer in production systems?

- **Tổng Quan:** Common pitfalls of class vs constructor function interview answer in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
class Animal {
  speak() { return '...'; }
}
class Dog extends Animal {
  speak() {
    return super.speak() + ' woof';
  }
}
```
- **Related / Liên quan:** Liên quan: [ES6](./11-es6-features-deep.md)
### 🔴 [Senior] Q63: How do you design a robust architecture around class vs constructor function interview answer?

- **Tổng Quan:** How do you design a robust architecture around class vs constructor function interview answer?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
class Animal {
  speak() { return '...'; }
}
class Dog extends Animal {
  speak() {
    return super.speak() + ' woof';
  }
}
```
- **Related / Liên quan:** Liên quan: [ES6](./11-es6-features-deep.md)
### 🟢 [Junior] Q64: What is descriptor-based API hardening and when should you use it?

- **Tổng Quan:** What is descriptor-based API hardening and when should you use it?
- **Giải thích (VI):** descriptor-based API hardening là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** descriptor-based API hardening is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const obj = {};
Object.defineProperty(obj, 'id', {
  value: 1,
  writable: false,
  enumerable: true,
  configurable: false
});
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q65: Common pitfalls of descriptor-based API hardening in production systems?

- **Tổng Quan:** Common pitfalls of descriptor-based API hardening in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const obj = {};
Object.defineProperty(obj, 'id', {
  value: 1,
  writable: false,
  enumerable: true,
  configurable: false
});
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q66: How do you design a robust architecture around descriptor-based API hardening?

- **Tổng Quan:** How do you design a robust architecture around descriptor-based API hardening?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const obj = {};
Object.defineProperty(obj, 'id', {
  value: 1,
  writable: false,
  enumerable: true,
  configurable: false
});
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
### 🟢 [Junior] Q67: What is proxy and reflect in domain modeling and when should you use it?

- **Tổng Quan:** What is proxy and reflect in domain modeling and when should you use it?
- **Giải thích (VI):** proxy and reflect in domain modeling là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** proxy and reflect in domain modeling is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const target = { x: 1 };
const proxy = new Proxy(target, {
  get(t, p, r) {
    return Reflect.get(t, p, r);
  }
});
```
- **Related / Liên quan:** Liên quan: [ES6](./11-es6-features-deep.md)
### 🟡 [Mid] Q68: Common pitfalls of proxy and reflect in domain modeling in production systems?

- **Tổng Quan:** Common pitfalls of proxy and reflect in domain modeling in production systems?
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
- **Related / Liên quan:** Liên quan: [ES6](./11-es6-features-deep.md)
### 🔴 [Senior] Q69: How do you design a robust architecture around proxy and reflect in domain modeling?

- **Tổng Quan:** How do you design a robust architecture around proxy and reflect in domain modeling?
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
- **Related / Liên quan:** Liên quan: [ES6](./11-es6-features-deep.md)
### 🟢 [Junior] Q70: What is mixin strategy for large codebase and when should you use it?

- **Tổng Quan:** What is mixin strategy for large codebase and when should you use it?
- **Giải thích (VI):** mixin strategy for large codebase là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** mixin strategy for large codebase is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const canLog = (Base) => class extends Base {
  log(msg) { console.log(msg); }
};
class Service {}
class UserService extends canLog(Service) {}
```
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🟡 [Mid] Q71: Common pitfalls of mixin strategy for large codebase in production systems?

- **Tổng Quan:** Common pitfalls of mixin strategy for large codebase in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const canLog = (Base) => class extends Base {
  log(msg) { console.log(msg); }
};
class Service {}
class UserService extends canLog(Service) {}
```
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🔴 [Senior] Q72: How do you design a robust architecture around mixin strategy for large codebase?

- **Tổng Quan:** How do you design a robust architecture around mixin strategy for large codebase?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const canLog = (Base) => class extends Base {
  log(msg) { console.log(msg); }
};
class Service {}
class UserService extends canLog(Service) {}
```
- **Related / Liên quan:** Liên quan: [Async](./09-async-comprehensive.md)
### 🟢 [Junior] Q73: What is Symbol.hasInstance real-world use and when should you use it?

- **Tổng Quan:** What is Symbol.hasInstance real-world use and when should you use it?
- **Giải thích (VI):** Symbol.hasInstance real-world use là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** Symbol.hasInstance real-world use is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
class Even {
  static [Symbol.hasInstance](value) {
    return Number.isInteger(value) && value % 2 === 0;
  }
}
console.log(2 instanceof Even);
```
- **Related / Liên quan:** Liên quan: [ES6](./11-es6-features-deep.md)
### 🟡 [Mid] Q74: Common pitfalls of Symbol.hasInstance real-world use in production systems?

- **Tổng Quan:** Common pitfalls of Symbol.hasInstance real-world use in production systems?
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
- **Related / Liên quan:** Liên quan: [ES6](./11-es6-features-deep.md)
### 🔴 [Senior] Q75: How do you design a robust architecture around Symbol.hasInstance real-world use?

- **Tổng Quan:** How do you design a robust architecture around Symbol.hasInstance real-world use?
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
- **Related / Liên quan:** Liên quan: [ES6](./11-es6-features-deep.md)
### 🟢 [Junior] Q76: What is inheritance anti-patterns and when should you use it?

- **Tổng Quan:** What is inheritance anti-patterns and when should you use it?
- **Giải thích (VI):** inheritance anti-patterns là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** inheritance anti-patterns is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
class Animal {
  speak() { return '...'; }
}
class Dog extends Animal {
  speak() {
    return super.speak() + ' woof';
  }
}
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
### 🟡 [Mid] Q77: Common pitfalls of inheritance anti-patterns in production systems?

- **Tổng Quan:** Common pitfalls of inheritance anti-patterns in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
class Animal {
  speak() { return '...'; }
}
class Dog extends Animal {
  speak() {
    return super.speak() + ' woof';
  }
}
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
### 🔴 [Senior] Q78: How do you design a robust architecture around inheritance anti-patterns?

- **Tổng Quan:** How do you design a robust architecture around inheritance anti-patterns?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
class Animal {
  speak() { return '...'; }
}
class Dog extends Animal {
  speak() {
    return super.speak() + ' woof';
  }
}
```
- **Related / Liên quan:** Liên quan: [Closures](./03-closures-comprehensive.md)
### 🟢 [Junior] Q79: What is Object.create interview whiteboard and when should you use it?

- **Tổng Quan:** What is Object.create interview whiteboard and when should you use it?
- **Giải thích (VI):** Object.create interview whiteboard là khái niệm nền tảng. Ở mức Junior, bạn cần nắm định nghĩa, vòng đời cơ bản và tình huống dùng phổ biến khi viết feature.
- **Giải thích (EN):** Object.create interview whiteboard is a foundational concept. At junior level, explain definition, basic lifecycle, and typical usage in product code.
- **Ví dụ (JavaScript):**
```javascript
const user = { role: 'member' };
const admin = Object.create(user);
admin.name = 'Alice';
console.log(admin.role);
```
- **Related / Liên quan:** Liên quan: [Scope](./02-scope-hoisting-comprehensive.md)
### 🟡 [Mid] Q80: Common pitfalls of Object.create interview whiteboard in production systems?

- **Tổng Quan:** Common pitfalls of Object.create interview whiteboard in production systems?
- **Giải thích (VI):** Ở mức Mid, bạn phải chỉ ra rủi ro thực tế (bug khó tái hiện, race condition, memory issue, readability) và cách giảm thiểu có hệ thống.
- **Giải thích (EN):** At mid level, discuss real-world pitfalls (hard-to-reproduce bugs, race conditions, memory issues, readability) and mitigation strategy.
- **Ví dụ (JavaScript):**
```javascript
const user = { role: 'member' };
const admin = Object.create(user);
admin.name = 'Alice';
console.log(admin.role);
```
- **Related / Liên quan:** Liên quan: [Scope](./02-scope-hoisting-comprehensive.md)
### 🔴 [Senior] Q81: How do you design a robust architecture around Object.create interview whiteboard?

- **Tổng Quan:** How do you design a robust architecture around Object.create interview whiteboard?
- **Giải thích (VI):** Mức Senior tập trung vào trade-off kiến trúc: tách trách nhiệm, đo lường, quan sát lỗi, fallback strategy, và tiêu chí chọn giải pháp cho team lớn.
- **Giải thích (EN):** Senior discussion should cover architecture trade-offs: separation of concerns, observability, fallback strategy, and decision criteria for teams.
- **Ví dụ (JavaScript):**
```javascript
const user = { role: 'member' };
const admin = Object.create(user);
admin.name = 'Alice';
console.log(admin.role);
```
- **Related / Liên quan:** Liên quan: [Scope](./02-scope-hoisting-comprehensive.md)
