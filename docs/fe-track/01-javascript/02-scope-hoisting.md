# Scope & Hoisting / Phạm Vi & Kéo Lên
## JavaScript Fundamentals - Chapter 2 / Kiến Thức Cơ Bản JavaScript - Chương 2

[← Previous: Variables & Data Types](./01-variables-data-types.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Closures →](./03-closures.md)

---

## Overview / Tổng Quan

**English:** Understanding scope and hoisting is fundamental to mastering JavaScript. These concepts determine how variables are accessed and when they become available in your code.

**Tiếng Việt:** Hiểu về phạm vi và kéo lên là nền tảng để thành thạo JavaScript. Những khái niệm này xác định cách các biến được truy cập và khi nào chúng có sẵn trong code của bạn.

---

## Table of Contents / Mục Lục
1. [What is Scope? / Phạm Vi Là Gì?](#what-is-scope--phạm-vi-là-gì)
2. [Types of Scope / Các Loại Phạm Vi](#types-of-scope--các-loại-phạm-vi)
3. [Lexical Scope / Phạm Vi Từ Vựng](#lexical-scope--phạm-vi-từ-vựng)
4. [Hoisting / Kéo Lên](#hoisting--kéo-lên)
5. [Temporal Dead Zone / Vùng Chết Tạm Thời](#temporal-dead-zone--vùng-chết-tạm-thời)
6. [Best Practices / Thực Hành Tốt Nhất](#best-practices--thực-hành-tốt-nhất)
7. [Interview Questions / Câu Hỏi Phỏng Vấn](#interview-questions--câu-hỏi-phỏng-vấn)

---

## What is Scope? / Phạm Vi Là Gì?

### Definition / Định Nghĩa

**English:** Scope determines the accessibility (visibility) of variables in different parts of your code.

**Tiếng Việt:** Phạm vi xác định khả năng truy cập (tầm nhìn) của các biến trong các phần khác nhau của code.

```javascript
// Example / Ví dụ
function example() {
  const message = 'Hello'; // Only accessible inside this function
                           // Chỉ có thể truy cập bên trong hàm này
  console.log(message); // ✅ Works / Hoạt động
}

console.log(message); // ❌ ReferenceError: message is not defined
                      // ❌ Lỗi: message không được định nghĩa
```

---

## Types of Scope / Các Loại Phạm Vi

### 1. Global Scope / Phạm Vi Toàn Cục

**English:** Variables declared outside any function or block are in the global scope and accessible everywhere.

**Tiếng Việt:** Biến được khai báo bên ngoài bất kỳ hàm hoặc khối nào đều ở phạm vi toàn cục và có thể truy cập ở mọi nơi.

```javascript
// Global scope / Phạm vi toàn cục
const globalVar = 'I am global';
// Tôi là biến toàn cục

function showGlobal() {
  console.log(globalVar); // ✅ Accessible / Có thể truy cập
}

showGlobal(); // "I am global"

if (true) {
  console.log(globalVar); // ✅ Accessible / Có thể truy cập
}

// ⚠️ Warning: Avoid polluting global scope
// ⚠️ Cảnh báo: Tránh làm ô nhiễm phạm vi toàn cục
```

### 2. Function Scope / Phạm Vi Hàm

**English:** Variables declared with `var` inside a function are only accessible within that function.

**Tiếng Việt:** Biến được khai báo với `var` bên trong hàm chỉ có thể truy cập trong hàm đó.

```javascript
function functionScope() {
  var functionVar = 'I am function scoped';
  // Tôi có phạm vi hàm
  
  console.log(functionVar); // ✅ Works / Hoạt động
  
  if (true) {
    var insideIf = 'Still function scoped';
    // Vẫn có phạm vi hàm
  }
  
  console.log(insideIf); // ✅ Works! var ignores block scope
                         // ✅ Hoạt động! var bỏ qua phạm vi khối
}

console.log(functionVar); // ❌ ReferenceError
                          // ❌ Lỗi tham chiếu
```

### 3. Block Scope / Phạm Vi Khối

**English:** Variables declared with `let` and `const` are only accessible within the block `{}` they are defined in.

**Tiếng Việt:** Biến được khai báo với `let` và `const` chỉ có thể truy cập trong khối `{}` mà chúng được định nghĩa.

```javascript
// Block scope with let/const
// Phạm vi khối với let/const
{
  let blockVar = 'I am block scoped';
  // Tôi có phạm vi khối
  const blockConst = 'Me too';
  // Tôi cũng vậy
  
  console.log(blockVar); // ✅ Works / Hoạt động
}

console.log(blockVar); // ❌ ReferenceError
                       // ❌ Lỗi tham chiếu

// Practical example / Ví dụ thực tế
if (true) {
  let x = 10;
  const y = 20;
  console.log(x, y); // ✅ 10, 20
}

console.log(x, y); // ❌ ReferenceError
                   // ❌ Lỗi tham chiếu

// Loop scope / Phạm vi vòng lặp
for (let i = 0; i < 3; i++) {
  console.log(i); // 0, 1, 2
}

console.log(i); // ❌ ReferenceError
                // ❌ Lỗi tham chiếu
```

### Comparison / So Sánh

```javascript
// var vs let/const scope comparison
// So sánh phạm vi var vs let/const

// var - function scoped / var - phạm vi hàm
function varExample() {
  if (true) {
    var x = 1;
  }
  console.log(x); // ✅ 1 (accessible / có thể truy cập)
}

// let - block scoped / let - phạm vi khối
function letExample() {
  if (true) {
    let x = 1;
  }
  console.log(x); // ❌ ReferenceError
}

// const - block scoped / const - phạm vi khối
function constExample() {
  if (true) {
    const x = 1;
  }
  console.log(x); // ❌ ReferenceError
}
```

---

## Lexical Scope / Phạm Vi Từ Vựng

### Definition / Định Nghĩa

**English:** Lexical scope (also called static scope) means that the scope of a variable is determined by its position in the source code.

**Tiếng Việt:** Phạm vi từ vựng (còn gọi là phạm vi tĩnh) có nghĩa là phạm vi của một biến được xác định bởi vị trí của nó trong mã nguồn.

```javascript
// Lexical scope example / Ví dụ phạm vi từ vựng
const globalVar = 'global';

function outer() {
  const outerVar = 'outer';
  
  function middle() {
    const middleVar = 'middle';
    
    function inner() {
      const innerVar = 'inner';
      
      // Inner function can access all outer scopes
      // Hàm bên trong có thể truy cập tất cả phạm vi bên ngoài
      console.log(innerVar);   // 'inner'
      console.log(middleVar);  // 'middle'
      console.log(outerVar);   // 'outer'
      console.log(globalVar);  // 'global'
    }
    
    inner();
    // console.log(innerVar); // ❌ ReferenceError
  }
  
  middle();
  // console.log(middleVar); // ❌ ReferenceError
}

outer();
// console.log(outerVar); // ❌ ReferenceError
```

### Scope Chain / Chuỗi Phạm Vi

**English:** When JavaScript looks for a variable, it searches in the current scope first, then moves up the scope chain until it finds the variable or reaches the global scope.

**Tiếng Việt:** Khi JavaScript tìm kiếm một biến, nó tìm trong phạm vi hiện tại trước, sau đó di chuyển lên chuỗi phạm vi cho đến khi tìm thấy biến hoặc đến phạm vi toàn cục.

```javascript
// Scope chain visualization / Trực quan hóa chuỗi phạm vi
const a = 'global a';

function first() {
  const b = 'first b';
  
  function second() {
    const c = 'second c';
    
    // Lookup order / Thứ tự tìm kiếm:
    // 1. second() scope / phạm vi second()
    // 2. first() scope / phạm vi first()
    // 3. global scope / phạm vi toàn cục
    
    console.log(c); // Found in second() / Tìm thấy trong second()
    console.log(b); // Found in first() / Tìm thấy trong first()
    console.log(a); // Found in global / Tìm thấy trong toàn cục
  }
  
  second();
}

first();
```

---

## Hoisting / Kéo Lên

### Definition / Định Nghĩa

**English:** Hoisting is JavaScript's behavior of moving declarations to the top of their scope before code execution.

**Tiếng Việt:** Kéo lên là hành vi của JavaScript di chuyển các khai báo lên đầu phạm vi của chúng trước khi thực thi code.

### Variable Hoisting / Kéo Lên Biến

```javascript
// What you write / Những gì bạn viết
console.log(x); // undefined (not ReferenceError!)
var x = 5;
console.log(x); // 5

// How JavaScript interprets it / Cách JavaScript hiểu
// var x; // Declaration hoisted / Khai báo được kéo lên
// console.log(x); // undefined
// x = 5; // Assignment stays / Gán giá trị ở nguyên chỗ
// console.log(x); // 5

// let and const are NOT initialized when hoisted
// let và const KHÔNG được khởi tạo khi kéo lên
console.log(y); // ❌ ReferenceError: Cannot access 'y' before initialization
let y = 10;

console.log(z); // ❌ ReferenceError: Cannot access 'z' before initialization
const z = 20;
```

### Function Hoisting / Kéo Lên Hàm

```javascript
// Function declarations are fully hoisted
// Khai báo hàm được kéo lên hoàn toàn
sayHello(); // ✅ "Hello!" - Works before declaration
            // ✅ "Hello!" - Hoạt động trước khi khai báo

function sayHello() {
  console.log('Hello!');
}

// Function expressions are NOT hoisted
// Biểu thức hàm KHÔNG được kéo lên
sayGoodbye(); // ❌ TypeError: sayGoodbye is not a function
              // ❌ Lỗi kiểu: sayGoodbye không phải là hàm

var sayGoodbye = function() {
  console.log('Goodbye!');
};

// Arrow functions are NOT hoisted
// Hàm mũi tên KHÔNG được kéo lên
greet(); // ❌ ReferenceError: Cannot access 'greet' before initialization
         // ❌ Lỗi: Không thể truy cập 'greet' trước khi khởi tạo

const greet = () => {
  console.log('Hi!');
};
```

### Hoisting Examples / Ví Dụ Kéo Lên

```javascript
// Example 1: Variable hoisting / Ví dụ 1: Kéo lên biến
var name = 'John';

function showName() {
  console.log(name); // undefined (not 'John'!)
                     // undefined (không phải 'John'!)
  var name = 'Jane';
  console.log(name); // 'Jane'
}

showName();

// Interpreted as / Được hiểu là:
// function showName() {
//   var name; // Hoisted / Được kéo lên
//   console.log(name); // undefined
//   name = 'Jane';
//   console.log(name); // 'Jane'
// }

// Example 2: Function hoisting order / Ví dụ 2: Thứ tự kéo lên hàm
foo(); // "Second" - Last declaration wins
       // "Second" - Khai báo cuối cùng thắng

function foo() {
  console.log('First');
}

function foo() {
  console.log('Second');
}

// Example 3: Mixed hoisting / Ví dụ 3: Kéo lên hỗn hợp
console.log(typeof myFunc); // "function"
console.log(typeof myVar);  // "undefined"

var myVar = 'variable';

function myFunc() {
  return 'function';
}
```

---

## Temporal Dead Zone / Vùng Chết Tạm Thời

### Definition / Định Nghĩa

**English:** The Temporal Dead Zone (TDZ) is the period between entering scope and the actual declaration where `let` and `const` variables cannot be accessed.

**Tiếng Việt:** Vùng Chết Tạm Thời (TDZ) là khoảng thời gian giữa việc vào phạm vi và khai báo thực tế mà các biến `let` và `const` không thể được truy cập.

```javascript
// TDZ Example / Ví dụ TDZ
{
  // TDZ starts / TDZ bắt đầu
  console.log(x); // ❌ ReferenceError: Cannot access 'x' before initialization
                  // ❌ Lỗi: Không thể truy cập 'x' trước khi khởi tạo
  
  let x = 10; // TDZ ends / TDZ kết thúc
  console.log(x); // ✅ 10
}

// TDZ with function parameters / TDZ với tham số hàm
function example(a = b, b = 2) {
  // ❌ ReferenceError: Cannot access 'b' before initialization
  // ❌ Lỗi: Không thể truy cập 'b' trước khi khởi tạo
  // 'a' tries to use 'b' before 'b' is initialized
  // 'a' cố gắng sử dụng 'b' trước khi 'b' được khởi tạo
}

// Correct order / Thứ tự đúng
function example2(b = 2, a = b) {
  console.log(a, b); // ✅ 2, 2
}

// TDZ with typeof / TDZ với typeof
console.log(typeof undeclaredVar); // "undefined" - Safe
                                    // "undefined" - An toàn

console.log(typeof declaredLater); // ❌ ReferenceError
                                    // ❌ Lỗi tham chiếu
let declaredLater;
```

---

## Best Practices / Thực Hành Tốt Nhất

### 1. Use const by default / Sử dụng const theo mặc định

```javascript
// ✅ Good: Use const for values that don't change
// ✅ Tốt: Sử dụng const cho các giá trị không thay đổi
const PI = 3.14159;
const MAX_USERS = 100;
const API_URL = 'https://api.example.com';

// ✅ Use let only when reassignment is needed
// ✅ Chỉ sử dụng let khi cần gán lại giá trị
let counter = 0;
counter++;

// ❌ Avoid var / Tránh var
var oldStyle = 'avoid this';
```

### 2. Declare variables at the top / Khai báo biến ở đầu

```javascript
// ✅ Good: Clear and organized
// ✅ Tốt: Rõ ràng và có tổ chức
function processData(data) {
  const result = [];
  let total = 0;
  let average = 0;
  
  // Processing logic / Logic xử lý
  for (const item of data) {
    total += item.value;
    result.push(item);
  }
  
  average = total / data.length;
  return { result, total, average };
}

// ❌ Bad: Variables scattered throughout
// ❌ Tệ: Biến rải rác khắp nơi
function processDataBad(data) {
  const result = [];
  
  for (const item of data) {
    let total = 0; // ❌ Declared inside loop
                   // ❌ Khai báo bên trong vòng lặp
    total += item.value;
    result.push(item);
  }
  
  let average = 0; // ❌ Declared late
                   // ❌ Khai báo muộn
  return { result, average };
}
```

### 3. Minimize global variables / Giảm thiểu biến toàn cục

```javascript
// ❌ Bad: Polluting global scope
// ❌ Tệ: Làm ô nhiễm phạm vi toàn cục
var config = {};
var userData = {};
var apiKey = 'secret';

// ✅ Good: Use modules or IIFE
// ✅ Tốt: Sử dụng modules hoặc IIFE
const App = (function() {
  const config = {};
  const userData = {};
  const apiKey = 'secret';
  
  return {
    init() {
      // Initialization / Khởi tạo
    }
  };
})();

// ✅ Better: Use ES6 modules
// ✅ Tốt hơn: Sử dụng ES6 modules
// config.js
export const config = {};
export const apiKey = 'secret';
```

### 4. Use block scope effectively / Sử dụng phạm vi khối hiệu quả

```javascript
// ✅ Good: Limit variable scope
// ✅ Tốt: Giới hạn phạm vi biến
function processUser(user) {
  if (user.isActive) {
    const message = `Welcome ${user.name}`;
    console.log(message);
    // message only exists in this block
    // message chỉ tồn tại trong khối này
  }
  
  // console.log(message); // ❌ ReferenceError
}

// ✅ Good: Loop variables
// ✅ Tốt: Biến vòng lặp
for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i); // ✅ 0, 1, 2, 3, 4
  }, 100);
}

// ❌ Bad: var in loops
// ❌ Tệ: var trong vòng lặp
for (var j = 0; j < 5; j++) {
  setTimeout(() => {
    console.log(j); // ❌ 5, 5, 5, 5, 5
  }, 100);
}
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1: What is the difference between var, let, and const?
### 🟢 [Junior] C1: Sự khác biệt giữa var, let, và const là gì?

**English Answer:**
- `var`: Function-scoped, hoisted and initialized as undefined, can be redeclared
- `let`: Block-scoped, hoisted but not initialized (TDZ), cannot be redeclared
- `const`: Block-scoped, hoisted but not initialized (TDZ), cannot be redeclared or reassigned

**Câu Trả Lời Tiếng Việt:**
- `var`: Phạm vi hàm, được kéo lên và khởi tạo là undefined, có thể khai báo lại
- `let`: Phạm vi khối, được kéo lên nhưng không khởi tạo (TDZ), không thể khai báo lại
- `const`: Phạm vi khối, được kéo lên nhưng không khởi tạo (TDZ), không thể khai báo lại hoặc gán lại

### 🟢 [Junior] Q2: What is hoisting?
### 🟢 [Junior] C2: Kéo lên là gì?

**English Answer:**
Hoisting is JavaScript's behavior of moving variable and function declarations to the top of their scope before code execution. However, only declarations are hoisted, not initializations.

**Câu Trả Lời Tiếng Việt:**
Kéo lên là hành vi của JavaScript di chuyển các khai báo biến và hàm lên đầu phạm vi của chúng trước khi thực thi code. Tuy nhiên, chỉ có khai báo được kéo lên, không phải khởi tạo.

### 🟡 [Mid] Q3: What is the Temporal Dead Zone?
### 🟡 [Mid] C3: Vùng Chết Tạm Thời là gì?

**English Answer:**
The Temporal Dead Zone (TDZ) is the period between entering a scope and the actual declaration of a `let` or `const` variable, during which the variable cannot be accessed.

**Câu Trả Lời Tiếng Việt:**
Vùng Chết Tạm Thời (TDZ) là khoảng thời gian giữa việc vào một phạm vi và khai báo thực tế của biến `let` hoặc `const`, trong thời gian đó biến không thể được truy cập.

### 🟡 [Mid] Q4: Predict the output / Dự đoán kết quả

```javascript
var x = 1;

function test() {
  console.log(x);
  var x = 2;
  console.log(x);
}

test();
```

**English Answer:**
Output: `undefined`, `2`

Explanation: The `var x` inside the function is hoisted to the top of the function scope, shadowing the global `x`. The first `console.log` runs before the assignment, so it prints `undefined`.

**Câu Trả Lời Tiếng Việt:**
Kết quả: `undefined`, `2`

Giải thích: `var x` bên trong hàm được kéo lên đầu phạm vi hàm, che khuất `x` toàn cục. `console.log` đầu tiên chạy trước khi gán giá trị, nên nó in ra `undefined`.

---

## Summary / Tóm Tắt

**English:**
- Scope determines variable accessibility
- Three types: global, function, and block scope
- Lexical scope is determined by code structure
- Hoisting moves declarations to the top
- TDZ prevents accessing let/const before declaration
- Use const by default, let when needed, avoid var

**Tiếng Việt:**
- Phạm vi xác định khả năng truy cập biến
- Ba loại: phạm vi toàn cục, hàm và khối
- Phạm vi từ vựng được xác định bởi cấu trúc code
- Kéo lên di chuyển khai báo lên đầu
- TDZ ngăn truy cập let/const trước khi khai báo
- Sử dụng const theo mặc định, let khi cần, tránh var

---

[← Previous: Variables & Data Types](./01-variables-data-types.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Closures →](./03-closures.md)
