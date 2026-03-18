# ES6+ Modern Features / Tính Năng Hiện Đại ES6+

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## JavaScript Fundamentals - Chapter 7 / Kiến Thức Cơ Bản JavaScript - Chương 7

[← Previous: Event Loop & Async](./06-event-loop-async.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Advanced Concepts →](./08-advanced-concepts.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn join một team mới và thấy codebase full `var`, callback hell 5 tầng lồng nhau, và string concatenation bằng `+`. Code chạy được nhưng:
- Đọc code mất 2x thời gian bình thường
- Bug từ `var` hoisting xuất hiện ở những chỗ không ngờ tới
- Promise refactor cũ không ai hiểu tại sao viết như vậy

ES6 (2015) là bước ngoặt lớn nhất trong lịch sử JavaScript — từ "ngôn ngữ đồ chơi" thành ngôn ngữ production nghiêm túc.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng — Nâng cấp công cụ:**
Trước ES6, viết JavaScript như dùng búa cũ để đóng đinh — được, nhưng tốn sức. ES6 cho bạn súng bắn đinh: cùng kết quả, gấp 3 lần nhanh hơn, ít lỗi hơn.

| ES5 (cũ) | ES6+ (mới) | Tại sao tốt hơn |
|----------|------------|-----------------|
| `var x` | `let`/`const` | Block scope, không bị hoisting surprise |
| `function(a,b){}` | `(a,b) => {}` | Ngắn gọn, kế thừa `this` từ context ngoài |
| `'Hello ' + name` | `` `Hello ${name}` `` | Đọc dễ, multi-line, expression |
| `{x: x, y: y}` | `{x, y}` | Destructuring, shorthand |
| `.then().then()` | `async/await` | Đọc như synchronous code |
| `arguments` object | Rest `...args` | Linh hoạt, rõ ràng hơn |

**Tại sao ES6 là milestone quan trọng nhất:**
- React, Vue, Angular đều yêu cầu ES6+ syntax
- Node.js modules, TypeScript, bundlers đều build trên ES6
- Phỏng vấn LUÔN có câu hỏi về arrow function, destructuring, và `const`/`let`

---

## Concept Map / Bản Đồ Khái Niệm

```
      [ES5 JavaScript]
      (var, callbacks, prototype)
              │
              ▼
      [ES6 FEATURES]  ← bạn đang ở đây
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
[Variables] [Functions] [Data]
let/const    Arrow fn   Destructuring
Block scope  Default    Spread/Rest
TDZ          params     Template lit
             Classes    Symbol/Map/Set
    │
    ▼
[Async ES6+]
Promise → ES8 async/await → ES2022 await top-level
    │
    ▼
[Modules]
import/export → Tree shaking → Bundlers (Webpack/Vite)
```

---

## Overview / Tổng Quan

**English:** ES6 (ECMAScript 2015) and later versions introduced powerful features that modernized JavaScript. Understanding these features is essential for technical interviews and modern development.

**Tiếng Việt:** ES6 (ECMAScript 2015) và các phiên bản sau đã giới thiệu các tính năng mạnh mẽ hiện đại hóa JavaScript. Hiểu các tính năng này là cần thiết cho phỏng vấn kỹ thuật và phát triển hiện đại.

---

## Table of Contents / Mục Lục

1. [Destructuring / Phá Cấu Trúc](#destructuring--phá-cấu-trúc)
2. [Spread & Rest Operators / Toán Tử Spread & Rest](#spread--rest-operators--toán-tử-spread--rest)
3. [Template Literals / Chuỗi Template](#template-literals--chuỗi-template)
4. [Arrow Functions / Hàm Mũi Tên](#arrow-functions--hàm-mũi-tên)
5. [Default Parameters / Tham Số Mặc Định](#default-parameters--tham-số-mặc-định)
6. [Enhanced Object Literals / Object Literals Nâng Cao](#enhanced-object-literals--object-literals-nâng-cao)
7. [Classes / Lớp](#classes--lớp)
8. [Modules / Module](#modules--module)
9. [Promises & Async/Await](#promises--asyncawait)
10. [Symbols / Ký Hiệu](#symbols--ký-hiệu)
11. [Iterators & Generators / Iterator & Generator](#iterators--generators--iterator--generator)
12. [Maps & Sets / Map & Set](#maps--sets--map--set)
13. [Optional Chaining / Chuỗi Tùy Chọn](#optional-chaining--chuỗi-tùy-chọn)
14. [Nullish Coalescing / Kết Hợp Nullish](#nullish-coalescing--kết-hợp-nullish)
15. [Interview Questions / Câu Hỏi Phỏng Vấn](#interview-questions--câu-hỏi-phỏng-vấn)

---

## Destructuring / Phá Cấu Trúc

### Array Destructuring / Phá Cấu Trúc Mảng

**English:** Extract values from arrays into distinct variables.

**Tiếng Việt:** Trích xuất giá trị từ mảng thành các biến riêng biệt.

```javascript
// Basic array destructuring / Phá cấu trúc mảng cơ bản
const numbers = [1, 2, 3, 4, 5];
const [first, second] = numbers;
console.log(first); // 1
console.log(second); // 2

// Skip elements / Bỏ qua phần tử
const [a, , c] = numbers;
console.log(a); // 1
console.log(c); // 3

// Rest operator / Toán tử rest
const [head, ...tail] = numbers;
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]

// Default values / Giá trị mặc định
const [x = 0, y = 0, z = 0] = [1, 2];
console.log(x, y, z); // 1, 2, 0

// Swapping variables / Hoán đổi biến
let m = 1, n = 2;
[m, n] = [n, m];
console.log(m, n); // 2, 1

// Nested destructuring / Phá cấu trúc lồng nhau
const nested = [1, [2, 3], 4];
const [one, [two, three], four] = nested;
console.log(one, two, three, four); // 1, 2, 3, 4
```

### Object Destructuring / Phá Cấu Trúc Object

```javascript
// Basic object destructuring / Phá cấu trúc object cơ bản
const person = {
  name: 'John',
  age: 30,
  city: 'New York'
};

const { name, age } = person;
console.log(name); // 'John'
console.log(age); // 30

// Rename variables / Đổi tên biến
const { name: fullName, age: years } = person;
console.log(fullName); // 'John'
console.log(years); // 30

// Default values / Giá trị mặc định
const { name, country = 'USA' } = person;
console.log(country); // 'USA'

// Nested destructuring / Phá cấu trúc lồng nhau
const user = {
  id: 1,
  profile: {
    name: 'Alice',
    address: {
      city: 'Boston',
      zip: '02101'
    }
  }
};

const {
  profile: {
    name: userName,
    address: { city, zip }
  }
} = user;
console.log(userName, city, zip); // 'Alice', 'Boston', '02101'

// Function parameters / Tham số hàm
function greet({ name, age = 18 }) {
  console.log(`Hello ${name}, you are ${age} years old`);
  // Xin chào ${name}, bạn ${age} tuổi
}

greet({ name: 'Bob', age: 25 }); // "Hello Bob, you are 25 years old"
greet({ name: 'Charlie' }); // "Hello Charlie, you are 18 years old"
```

---

## Spread & Rest Operators / Toán Tử Spread & Rest

### Spread Operator (...) / Toán Tử Spread

**English:** Expands an iterable into individual elements.

**Tiếng Việt:** Mở rộng một iterable thành các phần tử riêng lẻ.

```javascript
// Array spreading / Spread mảng
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// Copy array / Sao chép mảng
const original = [1, 2, 3];
const copy = [...original];
copy.push(4);
console.log(original); // [1, 2, 3] (unchanged / không thay đổi)
console.log(copy); // [1, 2, 3, 4]

// Object spreading / Spread object
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 };
console.log(merged); // { a: 1, b: 2, c: 3, d: 4 }

// Override properties / Ghi đè thuộc tính
const defaults = { theme: 'light', lang: 'en' };
const userPrefs = { theme: 'dark' };
const config = { ...defaults, ...userPrefs };
console.log(config); // { theme: 'dark', lang: 'en' }

// Function arguments / Đối số hàm
function sum(a, b, c) {
  return a + b + c;
}

const numbers = [1, 2, 3];
console.log(sum(...numbers)); // 6

// Shallow copy warning / Cảnh báo sao chép nông
const nested = { a: 1, b: { c: 2 } };
const shallowCopy = { ...nested };
shallowCopy.b.c = 3;
console.log(nested.b.c); // 3 (mutated / bị thay đổi!)
```

### Rest Operator (...) / Toán Tử Rest

**English:** Collects multiple elements into an array.

**Tiếng Việt:** Thu thập nhiều phần tử thành một mảng.

```javascript
// Function rest parameters / Tham số rest của hàm
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3)); // 6
console.log(sum(1, 2, 3, 4, 5)); // 15

// Combine with regular parameters / Kết hợp với tham số thông thường
function multiply(multiplier, ...numbers) {
  return numbers.map(n => n * multiplier);
}

console.log(multiply(2, 1, 2, 3)); // [2, 4, 6]

// Array destructuring / Phá cấu trúc mảng
const [first, ...rest] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(rest); // [2, 3, 4, 5]

// Object destructuring / Phá cấu trúc object
const { name, ...otherProps } = {
  name: 'John',
  age: 30,
  city: 'NYC'
};
console.log(name); // 'John'
console.log(otherProps); // { age: 30, city: 'NYC' }
```

---

## Template Literals / Chuỗi Template

### Basic Usage / Sử Dụng Cơ Bản

```javascript
// String interpolation / Nội suy chuỗi
const name = 'Alice';
const age = 25;
const message = `Hello, I'm ${name} and I'm ${age} years old`;
// Xin chào, tôi là ${name} và tôi ${age} tuổi
console.log(message);

// Expressions / Biểu thức
const a = 5, b = 10;
console.log(`Sum: ${a + b}`); // "Sum: 15"
console.log(`Is adult: ${age >= 18}`); // "Is adult: true"

// Multi-line strings / Chuỗi nhiều dòng
const html = `
  <div class="card">
    <h2>${name}</h2>
    <p>Age: ${age}</p>
  </div>
`;

// Function calls / Gọi hàm
function getGreeting(name) {
  return `Hello, ${name}!`;
}

console.log(`${getGreeting('Bob')}`); // "Hello, Bob!"
```

### Tagged Templates / Template Được Gắn Thẻ

```javascript
// Custom template tag / Thẻ template tùy chỉnh
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return `${result}${str}<strong>${values[i] || ''}</strong>`;
  }, '');
}

const name = 'John';
const age = 30;
const output = highlight`Name: ${name}, Age: ${age}`;
console.log(output);
// "Name: <strong>John</strong>, Age: <strong>30</strong>"

// SQL query builder / Trình xây dựng truy vấn SQL
function sql(strings, ...values) {
  return {
    text: strings.reduce((query, str, i) => {
      return query + str + (i < values.length ? `$${i + 1}` : '');
    }, ''),
    values
  };
}

const userId = 123;
const query = sql`SELECT * FROM users WHERE id = ${userId}`;
console.log(query);
// { text: 'SELECT * FROM users WHERE id = $1', values: [123] }
```

---

## Arrow Functions / Hàm Mũi Tên

### Syntax / Cú Pháp

```javascript
// Traditional function / Hàm truyền thống
function add(a, b) {
  return a + b;
}

// Arrow function / Hàm mũi tên
const add = (a, b) => a + b;

// Single parameter (no parentheses) / Tham số đơn (không cần ngoặc)
const square = x => x * x;

// No parameters / Không có tham số
const greet = () => 'Hello!';

// Multiple statements (need braces and return) / Nhiều câu lệnh (cần ngoặc và return)
const multiply = (a, b) => {
  const result = a * b;
  return result;
};

// Returning object (wrap in parentheses) / Trả về object (bọc trong ngoặc)
const makePerson = (name, age) => ({ name, age });
```

### Lexical `this` / `this` Từ Vựng

```javascript
// Problem with traditional functions / Vấn đề với hàm truyền thống
const obj = {
  count: 0,
  increment: function() {
    setTimeout(function() {
      this.count++; // ❌ this = window/undefined
      console.log(this.count); // NaN
    }, 1000);
  }
};

// Solution 1: Arrow function / Giải pháp 1: Hàm mũi tên
const obj2 = {
  count: 0,
  increment: function() {
    setTimeout(() => {
      this.count++; // ✅ this = obj2
      console.log(this.count); // 1
    }, 1000);
  }
};

// Solution 2: bind() / Giải pháp 2: bind()
const obj3 = {
  count: 0,
  increment: function() {
    setTimeout(function() {
      this.count++;
      console.log(this.count);
    }.bind(this), 1000);
  }
};
```

### When NOT to Use Arrow Functions / Khi KHÔNG Nên Dùng Hàm Mũi Tên

```javascript
// ❌ Object methods / Phương thức object
const person = {
  name: 'John',
  greet: () => {
    console.log(`Hello, ${this.name}`); // this = window/undefined
  }
};

// ✅ Use regular function / Dùng hàm thông thường
const person2 = {
  name: 'John',
  greet() {
    console.log(`Hello, ${this.name}`); // this = person2
  }
};

// ❌ Constructor functions / Hàm constructor
const Person = (name) => {
  this.name = name; // ❌ Arrow functions can't be constructors
};

// ✅ Use regular function or class / Dùng hàm thông thường hoặc class
function Person(name) {
  this.name = name;
}

// ❌ Event handlers needing `this` / Xử lý sự kiện cần `this`
button.addEventListener('click', () => {
  this.classList.toggle('active'); // ❌ this != button
});

// ✅ Use regular function / Dùng hàm thông thường
button.addEventListener('click', function() {
  this.classList.toggle('active'); // ✅ this = button
});
```

---

## Default Parameters / Tham Số Mặc Định

```javascript
// Basic default parameters / Tham số mặc định cơ bản
function greet(name = 'Guest', greeting = 'Hello') {
  return `${greeting}, ${name}!`;
}

console.log(greet()); // "Hello, Guest!"
console.log(greet('Alice')); // "Hello, Alice!"
console.log(greet('Bob', 'Hi')); // "Hi, Bob!"

// Default with expressions / Mặc định với biểu thức
function createUser(name, role = 'user', id = Date.now()) {
  return { name, role, id };
}

// Default from other parameters / Mặc định từ tham số khác
function makeFullName(first, last, middle = first[0]) {
  return `${first} ${middle}. ${last}`;
}

console.log(makeFullName('John', 'Doe')); // "John J. Doe"

// Default with destructuring / Mặc định với phá cấu trúc
function configure({ theme = 'light', lang = 'en' } = {}) {
  return { theme, lang };
}

console.log(configure()); // { theme: 'light', lang: 'en' }
console.log(configure({ theme: 'dark' })); // { theme: 'dark', lang: 'en' }
```

---

## Enhanced Object Literals / Object Literals Nâng Cao

```javascript
// Property shorthand / Rút gọn thuộc tính
const name = 'Alice';
const age = 25;

// Old way / Cách cũ
const person1 = {
  name: name,
  age: age
};

// New way / Cách mới
const person2 = { name, age };

// Method shorthand / Rút gọn phương thức
const obj = {
  // Old way / Cách cũ
  greet: function() {
    return 'Hello';
  },
  
  // New way / Cách mới
  sayHi() {
    return 'Hi';
  }
};

// Computed property names / Tên thuộc tính tính toán
const prop = 'name';
const value = 'John';

const user = {
  [prop]: value,
  [`${prop}Length`]: value.length,
  ['get' + prop]() {
    return this[prop];
  }
};

console.log(user); // { name: 'John', nameLength: 4, getname: [Function] }
console.log(user.getname()); // 'John'

// Dynamic keys / Khóa động
function createObject(key, value) {
  return { [key]: value };
}

console.log(createObject('color', 'blue')); // { color: 'blue' }
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Question 1: Difference between spread and rest?

**English Answer:**
- **Spread**: Expands an array/object into individual elements
- **Rest**: Collects multiple elements into an array
- Same syntax (...), different context

**Tiếng Việt:**
- **Spread**: Mở rộng mảng/object thành các phần tử riêng lẻ
- **Rest**: Thu thập nhiều phần tử thành một mảng
- Cùng cú pháp (...), ngữ cảnh khác nhau

```javascript
// Spread / Spread
const arr = [1, 2, 3];
console.log(...arr); // 1 2 3

// Rest / Rest
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b);
}
```

### 🟡 [Mid] Question 2: When to use arrow functions?

**English Answer:**
Use arrow functions when:
- You need lexical `this` binding
- Writing short, simple functions
- Using as callbacks

Don't use when:
- Need dynamic `this` (object methods, event handlers)
- Need `arguments` object
- Need to use as constructor

**Tiếng Việt:**
Dùng hàm mũi tên khi:
- Cần ràng buộc `this` từ vựng
- Viết hàm ngắn, đơn giản
- Dùng như callback

Không dùng khi:
- Cần `this` động (phương thức object, xử lý sự kiện)
- Cần object `arguments`
- Cần dùng như constructor

### 🟡 [Mid] Question 3: Shallow vs Deep Copy?

**English Answer:**
- **Shallow copy**: Copies first level only (spread, Object.assign)
- **Deep copy**: Copies all nested levels (JSON.parse/stringify, structuredClone)

**Tiếng Việt:**
- **Sao chép nông**: Chỉ sao chép cấp đầu tiên (spread, Object.assign)
- **Sao chép sâu**: Sao chép tất cả cấp lồng nhau (JSON.parse/stringify, structuredClone)

```javascript
// Shallow copy / Sao chép nông
const obj = { a: 1, b: { c: 2 } };
const shallow = { ...obj };
shallow.b.c = 3;
console.log(obj.b.c); // 3 (mutated / bị thay đổi!)

// Deep copy / Sao chép sâu
const deep = structuredClone(obj);
deep.b.c = 4;
console.log(obj.b.c); // 3 (unchanged / không thay đổi)
```

---

## Key Takeaways / Điểm Chính

**English:**
1. Destructuring simplifies extracting values from arrays/objects
2. Spread expands, rest collects
3. Template literals enable string interpolation and multi-line strings
4. Arrow functions have lexical `this` binding
5. Default parameters provide fallback values
6. Enhanced object literals reduce boilerplate

**Tiếng Việt:**
1. Phá cấu trúc đơn giản hóa trích xuất giá trị từ mảng/object
2. Spread mở rộng, rest thu thập
3. Template literals cho phép nội suy chuỗi và chuỗi nhiều dòng
4. Hàm mũi tên có ràng buộc `this` từ vựng
5. Tham số mặc định cung cấp giá trị dự phòng
6. Object literals nâng cao giảm code boilerplate

---

[← Previous: Event Loop & Async](./06-event-loop-async.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Advanced Concepts →](./08-advanced-concepts.md)

---

## Self-Check / Tự Kiểm Tra

- [ ] Tôi có thể giải thích sự khác biệt giữa `let`, `const`, và `var` về scope và hoisting không?
- [ ] Tôi có thể giải thích tại sao arrow function không có `this` riêng không?
- [ ] Tôi có thể dùng destructuring để lấy giá trị từ nested object và array không?
- [ ] Tôi có thể dùng spread operator để merge 2 arrays và 2 objects không?
- [ ] Tôi có thể refactor một callback hell thành Promise chain, rồi thành async/await không?

💬 **Feynman Prompt:** Giải thích `const` cho junior developer đang hỏi "tại sao dùng `const` nhưng vẫn thay đổi được array/object bên trong?" `const` thực sự bảo vệ cái gì?

---

## Connections / Liên Kết

- ⬅️ **Built on:** [Variables & Data Types](./01-variables-data-types.md) | [Scope & Hoisting](./02-scope-hoisting.md) — ES6 fixes và extends các concepts này
- ➡️ **Enables:** [Async Patterns](./06-event-loop-async.md) | [Functional Programming](./12-functional-programming.md) | TypeScript (builds on ES6 classes)
- 🔗 **Used everywhere:** React hooks syntax | Node.js imports | Modern API design
