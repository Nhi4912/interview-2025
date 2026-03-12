# The `this` Keyword / Từ Khóa `this`
## JavaScript Fundamentals - Chapter 5 / Kiến Thức Cơ Bản JavaScript - Chương 5

[← Previous: Prototypes & Inheritance](./04-prototypes-inheritance.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Event Loop & Async →](./06-event-loop-async.md)

---

## Overview / Tổng Quan

**English:** The `this` keyword is one of the most confusing concepts in JavaScript. Its value depends on how a function is called, not where it's defined. Understanding `this` is crucial for interviews and real-world JavaScript development.

**Tiếng Việt:** Từ khóa `this` là một trong những khái niệm gây nhầm lẫn nhất trong JavaScript. Giá trị của nó phụ thuộc vào cách hàm được gọi, không phải nơi nó được định nghĩa. Hiểu về `this` rất quan trọng cho phỏng vấn và phát triển JavaScript thực tế.

---

## Table of Contents / Mục Lục

1. [What is `this`? / `this` Là Gì?](#what-is-this--this-là-gì)
2. [Global Context / Ngữ Cảnh Toàn Cục](#global-context--ngữ-cảnh-toàn-cục)
3. [Function Context / Ngữ Cảnh Hàm](#function-context--ngữ-cảnh-hàm)
4. [Method Context / Ngữ Cảnh Phương Thức](#method-context--ngữ-cảnh-phương-thức)
5. [Constructor Context / Ngữ Cảnh Constructor](#constructor-context--ngữ-cảnh-constructor)
6. [Arrow Functions / Hàm Mũi Tên](#arrow-functions--hàm-mũi-tên)
7. [Explicit Binding / Ràng Buộc Tường Minh](#explicit-binding--ràng-buộc-tường-minh)
8. [Common Pitfalls / Lỗi Thường Gặp](#common-pitfalls--lỗi-thường-gặp)
9. [Interview Questions / Câu Hỏi Phỏng Vấn](#interview-questions--câu-hỏi-phỏng-vấn)

---

## What is `this`? / `this` Là Gì?

### Definition / Định Nghĩa

**English:** `this` is a special keyword that refers to the context in which a function is executed. Its value is determined by how the function is called (runtime binding), not where it's defined (lexical binding).

**Tiếng Việt:** `this` là một từ khóa đặc biệt tham chiếu đến ngữ cảnh mà hàm được thực thi. Giá trị của nó được xác định bởi cách hàm được gọi (ràng buộc runtime), không phải nơi nó được định nghĩa (ràng buộc lexical).

```javascript
// this value depends on how function is called
// Giá trị this phụ thuộc vào cách hàm được gọi

function showThis() {
  console.log(this);
}

// Different calls, different 'this' / Các lời gọi khác nhau, 'this' khác nhau
showThis(); // Window (in browser) or global (in Node.js)
const obj = { method: showThis };
obj.method(); // obj
new showThis(); // new empty object / đối tượng rỗng mới
```

### The Four Rules / Bốn Quy Tắc

**English:** There are four main rules that determine what `this` refers to:

**Tiếng Việt:** Có bốn quy tắc chính xác định `this` tham chiếu đến gì:

1. **Default Binding** / Ràng Buộc Mặc Định
2. **Implicit Binding** / Ràng Buộc Ngầm Định
3. **Explicit Binding** / Ràng Buộc Tường Minh
4. **New Binding** / Ràng Buộc New

---

## Global Context / Ngữ Cảnh Toàn Cục

### In Browser / Trong Trình Duyệt

**English:** In the global execution context, `this` refers to the global object (`window` in browsers).

**Tiếng Việt:** Trong ngữ cảnh thực thi toàn cục, `this` tham chiếu đến đối tượng toàn cục (`window` trong trình duyệt).

```javascript
// Global context / Ngữ cảnh toàn cục
console.log(this); // Window object (in browser)
                   // Đối tượng Window (trong trình duyệt)

this.globalVar = 'I am global';
console.log(window.globalVar); // "I am global"

var x = 10;
console.log(this.x); // 10 (var creates property on global object)
                     // 10 (var tạo thuộc tính trên đối tượng toàn cục)

let y = 20;
console.log(this.y); // undefined (let doesn't create property on global object)
                     // undefined (let không tạo thuộc tính trên đối tượng toàn cục)
```

### In Strict Mode / Trong Chế Độ Strict

```javascript
'use strict';

function showThis() {
  console.log(this);
}

showThis(); // undefined (not Window in strict mode)
            // undefined (không phải Window trong chế độ strict)

// Without strict mode / Không có chế độ strict
function showThisNonStrict() {
  console.log(this);
}

showThisNonStrict(); // Window object / Đối tượng Window
```

---

## Function Context / Ngữ Cảnh Hàm

### Default Binding / Ràng Buộc Mặc Định

**English:** When a function is called without any context, `this` defaults to the global object (or `undefined` in strict mode).

**Tiếng Việt:** Khi một hàm được gọi mà không có ngữ cảnh nào, `this` mặc định là đối tượng toàn cục (hoặc `undefined` trong chế độ strict).

```javascript
function greet() {
  console.log(this.name);
}

var name = 'Global Name';
greet(); // "Global Name" (this = window)
         // "Global Name" (this = window)

// In strict mode / Trong chế độ strict
'use strict';
function greetStrict() {
  console.log(this); // undefined
  // console.log(this.name); // ❌ TypeError: Cannot read property 'name' of undefined
}

greetStrict();
```

### Function as Callback / Hàm Như Callback

```javascript
const person = {
  name: 'John',
  greet: function() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

person.greet(); // "Hello, I'm John" (this = person)

// Losing context when passed as callback / Mất ngữ cảnh khi truyền như callback
setTimeout(person.greet, 1000); // "Hello, I'm undefined" (this = window/global)

// Solution 1: Arrow function / Giải pháp 1: Hàm mũi tên
setTimeout(() => person.greet(), 1000); // "Hello, I'm John"

// Solution 2: bind() / Giải pháp 2: bind()
setTimeout(person.greet.bind(person), 1000); // "Hello, I'm John"
```

---

## Method Context / Ngữ Cảnh Phương Thức

### Implicit Binding / Ràng Buộc Ngầm Định

**English:** When a function is called as a method of an object, `this` refers to that object.

**Tiếng Việt:** Khi một hàm được gọi như một phương thức của đối tượng, `this` tham chiếu đến đối tượng đó.

```javascript
const user = {
  name: 'Alice',
  age: 25,
  greet() {
    console.log(`Hi, I'm ${this.name} and I'm ${this.age} years old`);
  },
  getInfo() {
    return {
      name: this.name,
      age: this.age
    };
  }
};

user.greet(); // "Hi, I'm Alice and I'm 25 years old"
console.log(user.getInfo()); // { name: 'Alice', age: 25 }
```

### Nested Objects / Đối Tượng Lồng Nhau

```javascript
const company = {
  name: 'Tech Corp',
  employee: {
    name: 'Bob',
    greet() {
      console.log(`I work at ${this.name}`);
    }
  }
};

company.employee.greet(); // "I work at Bob" (this = employee object)
                          // "I work at Bob" (this = đối tượng employee)

// Only the immediate parent matters / Chỉ cha mẹ trực tiếp quan trọng
```

### Method Assignment / Gán Phương Thức

```javascript
const person = {
  name: 'Charlie',
  sayName() {
    console.log(this.name);
  }
};

person.sayName(); // "Charlie"

// Assigning to variable loses context / Gán cho biến mất ngữ cảnh
const sayName = person.sayName;
sayName(); // undefined (this = window/global)

// Assigning to another object / Gán cho đối tượng khác
const anotherPerson = {
  name: 'David',
  sayName: person.sayName
};

anotherPerson.sayName(); // "David" (this = anotherPerson)
```

---

## Constructor Context / Ngữ Cảnh Constructor

### Using `new` Keyword / Sử Dụng Từ Khóa `new`

**English:** When a function is called with `new`, `this` refers to the newly created object.

**Tiếng Việt:** Khi một hàm được gọi với `new`, `this` tham chiếu đến đối tượng mới được tạo.

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.greet = function() {
    console.log(`Hello, I'm ${this.name}`);
  };
}

const john = new Person('John', 30);
john.greet(); // "Hello, I'm John" (this = john)

console.log(john.name); // "John"
console.log(john.age); // 30
```

### ES6 Classes / Lớp ES6

```javascript
class Animal {
  constructor(name, species) {
    this.name = name;
    this.species = species;
  }
  
  speak() {
    console.log(`${this.name} is a ${this.species}`);
  }
  
  getInfo() {
    return {
      name: this.name,
      species: this.species
    };
  }
}

const cat = new Animal('Whiskers', 'Cat');
cat.speak(); // "Whiskers is a Cat" (this = cat)
console.log(cat.getInfo()); // { name: 'Whiskers', species: 'Cat' }
```

---

## Arrow Functions / Hàm Mũi Tên

### Lexical `this` / `this` Từ Vựng

**English:** Arrow functions don't have their own `this`. They inherit `this` from the enclosing lexical scope.

**Tiếng Việt:** Hàm mũi tên không có `this` riêng. Chúng kế thừa `this` từ phạm vi từ vựng bao quanh.

```javascript
const person = {
  name: 'Emma',
  regularFunction: function() {
    console.log('Regular:', this.name);
  },
  arrowFunction: () => {
    console.log('Arrow:', this.name);
  }
};

person.regularFunction(); // "Regular: Emma" (this = person)
person.arrowFunction(); // "Arrow: undefined" (this = global/window)
```

### Practical Use Cases / Trường Hợp Sử Dụng Thực Tế

```javascript
// Problem with regular functions / Vấn đề với hàm thông thường
const counter = {
  count: 0,
  start: function() {
    setInterval(function() {
      this.count++; // ❌ this = window, not counter
      console.log(this.count); // NaN
    }, 1000);
  }
};

// Solution 1: Arrow function / Giải pháp 1: Hàm mũi tên
const counter1 = {
  count: 0,
  start: function() {
    setInterval(() => {
      this.count++; // ✅ this = counter1
      console.log(this.count); // 1, 2, 3...
    }, 1000);
  }
};

// Solution 2: Store this / Giải pháp 2: Lưu this
const counter2 = {
  count: 0,
  start: function() {
    const self = this;
    setInterval(function() {
      self.count++; // ✅ self = counter2
      console.log(self.count); // 1, 2, 3...
    }, 1000);
  }
};

// Solution 3: bind() / Giải pháp 3: bind()
const counter3 = {
  count: 0,
  start: function() {
    setInterval(function() {
      this.count++; // ✅ this = counter3
      console.log(this.count); // 1, 2, 3...
    }.bind(this), 1000);
  }
};
```

### Arrow Functions in Classes / Hàm Mũi Tên Trong Lớp

```javascript
class Button {
  constructor(label) {
    this.label = label;
    this.clickCount = 0;
  }
  
  // Regular method / Phương thức thông thường
  click() {
    this.clickCount++;
    console.log(`${this.label} clicked ${this.clickCount} times`);
  }
  
  // Arrow function as class field / Hàm mũi tên như trường lớp
  clickArrow = () => {
    this.clickCount++;
    console.log(`${this.label} clicked ${this.clickCount} times`);
  }
}

const button = new Button('Submit');

// Regular method loses context / Phương thức thông thường mất ngữ cảnh
const clickHandler = button.click;
// clickHandler(); // ❌ TypeError

// Arrow function preserves context / Hàm mũi tên giữ ngữ cảnh
const clickArrowHandler = button.clickArrow;
clickArrowHandler(); // ✅ "Submit clicked 1 times"
```

---

## Explicit Binding / Ràng Buộc Tường Minh

### call() Method / Phương Thức call()

**English:** `call()` invokes a function with a specified `this` value and arguments provided individually.

**Tiếng Việt:** `call()` gọi một hàm với giá trị `this` được chỉ định và các đối số được cung cấp riêng lẻ.

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

const person1 = { name: 'Alice' };
const person2 = { name: 'Bob' };

greet.call(person1, 'Hello', '!'); // "Hello, I'm Alice!"
greet.call(person2, 'Hi', '.'); // "Hi, I'm Bob."

// Borrowing methods / Mượn phương thức
const numbers = [1, 2, 3, 4, 5];
const max = Math.max.call(null, ...numbers);
console.log(max); // 5
```

### apply() Method / Phương Thức apply()

**English:** `apply()` is similar to `call()`, but takes arguments as an array.

**Tiếng Việt:** `apply()` tương tự như `call()`, nhưng nhận đối số dưới dạng mảng.

```javascript
function introduce(greeting, hobby) {
  console.log(`${greeting}, I'm ${this.name} and I like ${hobby}`);
}

const person = { name: 'Charlie' };

introduce.apply(person, ['Hey', 'coding']); // "Hey, I'm Charlie and I like coding"

// Practical example / Ví dụ thực tế
const numbers = [5, 6, 2, 3, 7];
const max = Math.max.apply(null, numbers);
console.log(max); // 7

// Modern alternative with spread / Thay thế hiện đại với spread
const maxSpread = Math.max(...numbers);
console.log(maxSpread); // 7
```

### bind() Method / Phương Thức bind()

**English:** `bind()` creates a new function with a fixed `this` value. It doesn't invoke the function immediately.

**Tiếng Việt:** `bind()` tạo một hàm mới với giá trị `this` cố định. Nó không gọi hàm ngay lập tức.

```javascript
const person = {
  name: 'Diana',
  greet: function(greeting) {
    console.log(`${greeting}, I'm ${this.name}`);
  }
};

// Create bound function / Tạo hàm đã ràng buộc
const greetDiana = person.greet.bind(person);
greetDiana('Hello'); // "Hello, I'm Diana"

// Partial application / Áp dụng một phần
const sayHello = person.greet.bind(person, 'Hello');
sayHello(); // "Hello, I'm Diana"

// Event handlers / Xử lý sự kiện
class Counter {
  constructor() {
    this.count = 0;
    this.increment = this.increment.bind(this);
  }
  
  increment() {
    this.count++;
    console.log(this.count);
  }
}

const counter = new Counter();
const btn = document.querySelector('button');
// btn.addEventListener('click', counter.increment); // ✅ Works / Hoạt động
```

---

## Common Pitfalls / Lỗi Thường Gặp

### Pitfall 1: Losing Context / Mất Ngữ Cảnh

```javascript
const user = {
  name: 'Frank',
  greet() {
    console.log(`Hello, ${this.name}`);
  }
};

user.greet(); // ✅ "Hello, Frank"

const greet = user.greet;
greet(); // ❌ "Hello, undefined" (lost context / mất ngữ cảnh)

// Fix / Sửa
const boundGreet = user.greet.bind(user);
boundGreet(); // ✅ "Hello, Frank"
```

### Pitfall 2: Nested Functions / Hàm Lồng Nhau

```javascript
const obj = {
  name: 'Grace',
  outer() {
    console.log(this.name); // "Grace"
    
    function inner() {
      console.log(this.name); // undefined (this = window/global)
    }
    inner();
  }
};

obj.outer();

// Fix with arrow function / Sửa với hàm mũi tên
const obj2 = {
  name: 'Grace',
  outer() {
    console.log(this.name); // "Grace"
    
    const inner = () => {
      console.log(this.name); // "Grace" (inherits this / kế thừa this)
    };
    inner();
  }
};

obj2.outer();
```

### Pitfall 3: Array Methods / Phương Thức Mảng

```javascript
const person = {
  name: 'Henry',
  hobbies: ['reading', 'coding', 'gaming'],
  
  showHobbies() {
    this.hobbies.forEach(function(hobby) {
      console.log(`${this.name} likes ${hobby}`); // ❌ this = undefined
    });
  }
};

person.showHobbies(); // "undefined likes reading", etc.

// Fix 1: Arrow function / Sửa 1: Hàm mũi tên
const person1 = {
  name: 'Henry',
  hobbies: ['reading', 'coding', 'gaming'],
  
  showHobbies() {
    this.hobbies.forEach(hobby => {
      console.log(`${this.name} likes ${hobby}`); // ✅
    });
  }
};

// Fix 2: thisArg parameter / Sửa 2: Tham số thisArg
const person2 = {
  name: 'Henry',
  hobbies: ['reading', 'coding', 'gaming'],
  
  showHobbies() {
    this.hobbies.forEach(function(hobby) {
      console.log(`${this.name} likes ${hobby}`); // ✅
    }, this); // Pass this as second argument / Truyền this như đối số thứ hai
  }
};
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟡 [Mid] Question 1: What determines the value of `this`?

**English Answer:**
The value of `this` is determined by how a function is called, not where it's defined. There are four binding rules:
1. Default binding (global object or undefined in strict mode)
2. Implicit binding (object calling the method)
3. Explicit binding (call, apply, bind)
4. New binding (constructor function with new keyword)

**Tiếng Việt:**
Giá trị của `this` được xác định bởi cách hàm được gọi, không phải nơi nó được định nghĩa. Có bốn quy tắc ràng buộc:
1. Ràng buộc mặc định (đối tượng toàn cục hoặc undefined trong chế độ strict)
2. Ràng buộc ngầm định (đối tượng gọi phương thức)
3. Ràng buộc tường minh (call, apply, bind)
4. Ràng buộc new (hàm constructor với từ khóa new)

### 🟡 [Mid] Question 2: How do arrow functions handle `this`?

**English Answer:**
Arrow functions don't have their own `this` binding. They lexically capture the `this` value from the enclosing scope where they're defined. This makes them useful for callbacks and nested functions where you want to preserve the outer `this` context.

**Tiếng Việt:**
Hàm mũi tên không có ràng buộc `this` riêng. Chúng bắt giữ giá trị `this` từ phạm vi bao quanh nơi chúng được định nghĩa. Điều này làm cho chúng hữu ích cho callback và hàm lồng nhau khi bạn muốn giữ ngữ cảnh `this` bên ngoài.

```javascript
const obj = {
  value: 42,
  regular: function() {
    setTimeout(function() {
      console.log(this.value); // undefined
    }, 100);
  },
  arrow: function() {
    setTimeout(() => {
      console.log(this.value); // 42
    }, 100);
  }
};
```

### 🟢 [Junior] Question 3: Difference between call, apply, and bind?

**English Answer:**
- `call()`: Invokes function immediately with specified `this` and individual arguments
- `apply()`: Invokes function immediately with specified `this` and array of arguments
- `bind()`: Returns a new function with specified `this`, doesn't invoke immediately

**Tiếng Việt:**
- `call()`: Gọi hàm ngay lập tức với `this` được chỉ định và các đối số riêng lẻ
- `apply()`: Gọi hàm ngay lập tức với `this` được chỉ định và mảng đối số
- `bind()`: Trả về hàm mới với `this` được chỉ định, không gọi ngay lập tức

```javascript
function greet(greeting, punctuation) {
  return `${greeting}, I'm ${this.name}${punctuation}`;
}

const person = { name: 'Ivy' };

// call - immediate invocation / gọi ngay lập tức
console.log(greet.call(person, 'Hello', '!')); // "Hello, I'm Ivy!"

// apply - immediate invocation with array / gọi ngay lập tức với mảng
console.log(greet.apply(person, ['Hi', '.'])); // "Hi, I'm Ivy."

// bind - returns new function / trả về hàm mới
const boundGreet = greet.bind(person, 'Hey');
console.log(boundGreet('?')); // "Hey, I'm Ivy?"
```

### 🟡 [Mid] Question 4: Predict the output

```javascript
const obj = {
  name: 'Object',
  getName: function() {
    return this.name;
  }
};

console.log(obj.getName()); // ?
const getName = obj.getName;
console.log(getName()); // ?
console.log(obj.getName.call({ name: 'Call' })); // ?
```

**Answer / Đáp Án:**
```javascript
console.log(obj.getName()); // "Object" (implicit binding / ràng buộc ngầm định)
const getName = obj.getName;
console.log(getName()); // undefined (default binding / ràng buộc mặc định)
console.log(obj.getName.call({ name: 'Call' })); // "Call" (explicit binding / ràng buộc tường minh)
```

---

## Key Takeaways / Điểm Chính

**English:**
1. `this` value depends on how function is called, not where it's defined
2. Four binding rules: default, implicit, explicit, new
3. Arrow functions inherit `this` from enclosing scope
4. Use `bind()` to create functions with fixed `this`
5. Common pitfalls: losing context in callbacks, nested functions, array methods
6. Strict mode changes default binding to `undefined`

**Tiếng Việt:**
1. Giá trị `this` phụ thuộc vào cách hàm được gọi, không phải nơi nó được định nghĩa
2. Bốn quy tắc ràng buộc: mặc định, ngầm định, tường minh, new
3. Hàm mũi tên kế thừa `this` từ phạm vi bao quanh
4. Sử dụng `bind()` để tạo hàm với `this` cố định
5. Lỗi thường gặp: mất ngữ cảnh trong callback, hàm lồng nhau, phương thức mảng
6. Chế độ strict thay đổi ràng buộc mặc định thành `undefined`

---

[← Previous: Prototypes & Inheritance](./04-prototypes-inheritance.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Event Loop & Async →](./06-event-loop-async.md)
