# Prototypes & Inheritance / Nguyên Mẫu & Kế Thừa
## JavaScript Fundamentals - Chapter 4 / Kiến Thức Cơ Bản JavaScript - Chương 4

[← Previous: Closures](./03-closures.md) | [Back to Table of Contents](../00-table-of-contents.md) | [Next: The `this` Keyword →](./05-this-keyword.md)

---

## Overview / Tổng Quan

**English:** Prototypes are the mechanism by which JavaScript objects inherit features from one another. Understanding prototypal inheritance is fundamental to mastering JavaScript and essential for technical interviews.

**Tiếng Việt:** Prototype là cơ chế mà các đối tượng JavaScript kế thừa tính năng từ nhau. Hiểu về kế thừa nguyên mẫu là nền tảng để thành thạo JavaScript và cần thiết cho phỏng vấn kỹ thuật.

---

## Table of Contents / Mục Lục
1. [What is a Prototype? / Prototype Là Gì?](#what-is-a-prototype--prototype-là-gì)
2. [Prototype Chain / Chuỗi Prototype](#prototype-chain--chuỗi-prototype)
3. [Constructor Functions / Hàm Khởi Tạo](#constructor-functions--hàm-khởi-tạo)
4. [ES6 Classes / Lớp ES6](#es6-classes--lớp-es6)
5. [Inheritance Patterns / Các Mẫu Kế Thừa](#inheritance-patterns--các-mẫu-kế-thừa)
6. [Object.create() Method](#objectcreate-method)
7. [Interview Questions / Câu Hỏi Phỏng Vấn](#interview-questions--câu-hỏi-phỏng-vấn)

---

## What is a Prototype? / Prototype Là Gì?

### Definition / Định Nghĩa

**English:** Every JavaScript object has an internal property called `[[Prototype]]` (accessed via `__proto__`) that references another object. This is the prototype from which the object inherits properties and methods.

**Tiếng Việt:** Mọi đối tượng JavaScript đều có một thuộc tính nội bộ gọi là `[[Prototype]]` (truy cập qua `__proto__`) tham chiếu đến một đối tượng khác. Đây là prototype mà đối tượng kế thừa các thuộc tính và phương thức.

```javascript
// Every object has a prototype / Mọi đối tượng đều có prototype
const obj = {};
console.log(obj.__proto__); // Object.prototype
console.log(obj.__proto__ === Object.prototype); // true

// Arrays have Array.prototype / Mảng có Array.prototype
const arr = [];
console.log(arr.__proto__ === Array.prototype); // true
console.log(arr.__proto__.__proto__ === Object.prototype); // true

// Functions have Function.prototype / Hàm có Function.prototype
function fn() {}
console.log(fn.__proto__ === Function.prototype); // true
```

---

## Prototype Chain / Chuỗi Prototype

### How It Works / Cách Hoạt Động

**English:** When you try to access a property on an object, JavaScript first looks on the object itself. If not found, it looks at the object's prototype, then the prototype's prototype, and so on until it reaches `null`.

**Tiếng Việt:** Khi bạn cố gắng truy cập một thuộc tính trên đối tượng, JavaScript đầu tiên tìm trên chính đối tượng đó. Nếu không tìm thấy, nó tìm ở prototype của đối tượng, sau đó prototype của prototype, và cứ thế cho đến khi đạt đến `null`.

```javascript
// Prototype chain example / Ví dụ chuỗi prototype
const animal = {
  eats: true,
  walk() {
    console.log('Animal walks / Động vật đi bộ');
  }
};

const rabbit = {
  jumps: true,
  __proto__: animal
};

const longEar = {
  earLength: 10,
  __proto__: rabbit
};

// Property lookup / Tìm kiếm thuộc tính
console.log(longEar.jumps); // true (found in rabbit / tìm thấy trong rabbit)
console.log(longEar.eats); // true (found in animal / tìm thấy trong animal)
console.log(longEar.earLength); // 10 (found in longEar / tìm thấy trong longEar)

longEar.walk(); // "Animal walks" (method from animal / phương thức từ animal)

// Prototype chain / Chuỗi prototype:
// longEar → rabbit → animal → Object.prototype → null
```

### Visualizing the Chain / Trực Quan Hóa Chuỗi

```
Prototype Chain Lookup / Tìm Kiếm Chuỗi Prototype
│
longEar object
  │ earLength: 10
  │ __proto__ ↓
  │
rabbit object
  │ jumps: true
  │ __proto__ ↓
  │
animal object
  │ eats: true
  │ walk: function
  │ __proto__ ↓
  │
Object.prototype
  │ toString: function
  │ hasOwnProperty: function
  │ __proto__ ↓
  │
null (end of chain / kết thúc chuỗi)
```

---

## Constructor Functions / Hàm Khởi Tạo

### Basic Constructor / Hàm Khởi Tạo Cơ Bản

**English:** Constructor functions are regular functions used with the `new` keyword to create objects. They automatically set up the prototype chain.

**Tiếng Việt:** Hàm khởi tạo là các hàm thông thường được sử dụng với từ khóa `new` để tạo đối tượng. Chúng tự động thiết lập chuỗi prototype.

```javascript
// Constructor function / Hàm khởi tạo
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Adding methods to prototype / Thêm phương thức vào prototype
Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}, ${this.age} years old`;
};

Person.prototype.isAdult = function() {
  return this.age >= 18;
};

// Creating instances / Tạo instances
const john = new Person('John', 30);
const jane = new Person('Jane', 17);

console.log(john.greet()); // "Hello, I'm John, 30 years old"
console.log(jane.isAdult()); // false

// All instances share the same prototype methods
// Tất cả instances chia sẻ cùng phương thức prototype
console.log(john.greet === jane.greet); // true
```

### What Happens with `new` / Điều Gì Xảy Ra Với `new`

**English:** When you use the `new` keyword, JavaScript performs four steps automatically.

**Tiếng Việt:** Khi bạn sử dụng từ khóa `new`, JavaScript thực hiện bốn bước tự động.

```javascript
// When calling: new Person('John', 30)
// Khi gọi: new Person('John', 30)

function Person(name, age) {
  // Step 1: Create empty object / Bước 1: Tạo đối tượng rỗng
  // const this = {};
  
  // Step 2: Set prototype / Bước 2: Thiết lập prototype
  // this.__proto__ = Person.prototype;
  
  // Step 3: Execute constructor / Bước 3: Thực thi constructor
  this.name = name;
  this.age = age;
  
  // Step 4: Return this / Bước 4: Trả về this
  // return this;
}

// Manual implementation of 'new' / Triển khai thủ công của 'new'
function createNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return result instanceof Object ? result : obj;
}

const person1 = new Person('Alice', 25);
const person2 = createNew(Person, 'Bob', 28);

console.log(person1.greet()); // Works / Hoạt động
console.log(person2.greet()); // Works / Hoạt động
```

---

## ES6 Classes / Lớp ES6

### Class Syntax / Cú Pháp Lớp

**English:** ES6 classes provide syntactic sugar over constructor functions and prototypes. Under the hood, they still use prototypal inheritance.

**Tiếng Việt:** Lớp ES6 cung cấp cú pháp đường ngọt trên hàm khởi tạo và prototype. Bên dưới, chúng vẫn sử dụng kế thừa nguyên mẫu.

```javascript
// ES6 Class / Lớp ES6
class Animal {
  constructor(name, species) {
    this.name = name;
    this.species = species;
  }
  
  // Instance method / Phương thức instance
  speak() {
    console.log(`${this.name} makes a sound`);
  }
  
  // Getter
  get info() {
    return `${this.name} is a ${this.species}`;
  }
  
  // Setter
  set nickname(value) {
    this._nickname = value;
  }
  
  get nickname() {
    return this._nickname || this.name;
  }
  
  // Static method / Phương thức tĩnh
  static getKingdom() {
    return 'Animalia';
  }
}

// Usage / Sử dụng
const cat = new Animal('Whiskers', 'Cat');
console.log(cat.info); // "Whiskers is a Cat"
cat.speak(); // "Whiskers makes a sound"
cat.nickname = 'Fluffy';
console.log(cat.nickname); // "Fluffy"
console.log(Animal.getKingdom()); // "Animalia"
```

### Class Inheritance / Kế Thừa Lớp

```javascript
// Parent class / Lớp cha
class Vehicle {
  constructor(make, model) {
    this.make = make;
    this.model = model;
    this.speed = 0;
  }
  
  accelerate(amount) {
    this.speed += amount;
    console.log(`Speed: ${this.speed} km/h`);
  }
  
  brake() {
    this.speed = 0;
    console.log('Vehicle stopped / Xe đã dừng');
  }
}

// Child class / Lớp con
class Car extends Vehicle {
  constructor(make, model, doors) {
    super(make, model); // Call parent constructor / Gọi constructor cha
    this.doors = doors;
  }
  
  // Override method / Ghi đè phương thức
  accelerate(amount) {
    super.accelerate(amount); // Call parent method / Gọi phương thức cha
    console.log(`${this.make} ${this.model} is accelerating`);
  }
  
  // New method / Phương thức mới
  honk() {
    console.log('Beep beep! / Bíp bíp!');
  }
}

const myCar = new Car('Toyota', 'Camry', 4);
myCar.accelerate(50); 
// "Speed: 50 km/h"
// "Toyota Camry is accelerating"
myCar.honk(); // "Beep beep!"
myCar.brake(); // "Vehicle stopped"

// Prototype chain / Chuỗi prototype
console.log(myCar instanceof Car); // true
console.log(myCar instanceof Vehicle); // true
console.log(myCar instanceof Object); // true
```

---

## Inheritance Patterns / Các Mẫu Kế Thừa

### Prototypal Inheritance / Kế Thừa Nguyên Mẫu

```javascript
// Using Object.create() / Sử dụng Object.create()
const personPrototype = {
  greet() {
    return `Hello, I'm ${this.name}`;
  },
  
  introduce() {
    return `My name is ${this.name} and I'm ${this.age} years old`;
  }
};

// Create object with specific prototype / Tạo đối tượng với prototype cụ thể
const john = Object.create(personPrototype);
john.name = 'John';
john.age = 30;

console.log(john.greet()); // "Hello, I'm John"
console.log(john.introduce()); // "My name is John and I'm 30 years old"

// Check prototype / Kiểm tra prototype
console.log(Object.getPrototypeOf(john) === personPrototype); // true
```

### Classical Inheritance Pattern / Mẫu Kế Thừa Cổ Điển

```javascript
// Parent constructor / Constructor cha
function Shape(color) {
  this.color = color;
}

Shape.prototype.getColor = function() {
  return this.color;
};

// Child constructor / Constructor con
function Circle(color, radius) {
  Shape.call(this, color); // Call parent constructor / Gọi constructor cha
  this.radius = radius;
}

// Set up inheritance / Thiết lập kế thừa
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

// Add child methods / Thêm phương thức con
Circle.prototype.getArea = function() {
  return Math.PI * this.radius ** 2;
};

const circle = new Circle('red', 5);
console.log(circle.getColor()); // "red"
console.log(circle.getArea()); // 78.53981633974483
console.log(circle instanceof Circle); // true
console.log(circle instanceof Shape); // true
```

---

## Object.create() Method

### Basic Usage / Sử Dụng Cơ Bản

**English:** `Object.create()` creates a new object with the specified prototype object.

**Tiếng Việt:** `Object.create()` tạo một đối tượng mới với đối tượng prototype được chỉ định.

```javascript
// Create object with null prototype / Tạo đối tượng với prototype null
const pureObject = Object.create(null);
pureObject.name = 'Pure';
console.log(pureObject.toString); // undefined (no Object.prototype)

// Create object with specific prototype / Tạo đối tượng với prototype cụ thể
const animal = {
  type: 'Animal',
  describe() {
    return `This is a ${this.type}`;
  }
};

const dog = Object.create(animal);
dog.type = 'Dog';
dog.breed = 'Labrador';

console.log(dog.describe()); // "This is a Dog"
console.log(dog.breed); // "Labrador"
```

### With Property Descriptors / Với Mô Tả Thuộc Tính

```javascript
const person = Object.create(Object.prototype, {
  name: {
    value: 'John',
    writable: true,
    enumerable: true,
    configurable: true
  },
  age: {
    value: 30,
    writable: false, // Read-only / Chỉ đọc
    enumerable: true,
    configurable: false
  }
});

console.log(person.name); // "John"
person.name = 'Jane'; // ✅ Allowed / Được phép
console.log(person.name); // "Jane"

person.age = 31; // ❌ Silently fails / Thất bại âm thầm
console.log(person.age); // 30
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟡 [Mid] Question 1: Explain Prototypal Inheritance / Giải Thích Kế Thừa Nguyên Mẫu

**English Answer:**
Prototypal inheritance is JavaScript's mechanism for objects to inherit properties and methods from other objects. Every object has an internal `[[Prototype]]` property that references another object. When you access a property, JavaScript looks for it on the object itself first, then walks up the prototype chain until it finds the property or reaches `null`.

**Tiếng Việt:**
Kế thừa nguyên mẫu là cơ chế của JavaScript để các đối tượng kế thừa thuộc tính và phương thức từ các đối tượng khác. Mọi đối tượng đều có thuộc tính nội bộ `[[Prototype]]` tham chiếu đến một đối tượng khác. Khi bạn truy cập một thuộc tính, JavaScript tìm kiếm nó trên chính đối tượng đó trước, sau đó đi lên chuỗi prototype cho đến khi tìm thấy thuộc tính hoặc đạt đến `null`.

```javascript
const parent = { x: 10 };
const child = Object.create(parent);
child.y = 20;

console.log(child.x); // 10 (from parent / từ parent)
console.log(child.y); // 20 (own property / thuộc tính riêng)
```

### 🟢 [Junior] Question 2: Difference Between `__proto__` and `prototype`

**English Answer:**
- `prototype` is a property of constructor functions that becomes the `__proto__` of instances created with that constructor
- `__proto__` is a property of all objects that points to their prototype

**Tiếng Việt:**
- `prototype` là thuộc tính của hàm khởi tạo trở thành `__proto__` của các instance được tạo với constructor đó
- `__proto__` là thuộc tính của tất cả đối tượng trỏ đến prototype của chúng

```javascript
function Person(name) {
  this.name = name;
}

const john = new Person('John');

console.log(Person.prototype); // Object with constructor
console.log(john.__proto__ === Person.prototype); // true
console.log(john.prototype); // undefined (instances don't have .prototype)
```

### 🟡 [Mid] Question 3: How Does `new` Keyword Work?

**English Answer:**
The `new` keyword performs four steps:
1. Creates a new empty object
2. Sets the object's `__proto__` to the constructor's `prototype`
3. Executes the constructor with `this` bound to the new object
4. Returns the object (or the constructor's return value if it's an object)

**Tiếng Việt:**
Từ khóa `new` thực hiện bốn bước:
1. Tạo một đối tượng rỗng mới
2. Thiết lập `__proto__` của đối tượng thành `prototype` của constructor
3. Thực thi constructor với `this` gắn với đối tượng mới
4. Trả về đối tượng (hoặc giá trị trả về của constructor nếu nó là một đối tượng)

### 🟡 [Mid] Question 4: Class vs Constructor Function

**English Answer:**
ES6 classes are syntactic sugar over constructor functions. Key differences:
- Classes are not hoisted
- Classes are in strict mode by default
- Class methods are non-enumerable
- Classes must be called with `new`

**Tiếng Việt:**
Lớp ES6 là cú pháp đường ngọt trên hàm khởi tạo. Khác biệt chính:
- Lớp không được hoisting
- Lớp ở chế độ strict mặc định
- Phương thức lớp không thể liệt kê
- Lớp phải được gọi với `new`

```javascript
// Class
class MyClass {
  constructor(value) {
    this.value = value;
  }
}

// Equivalent constructor function / Hàm khởi tạo tương đương
function MyFunction(value) {
  this.value = value;
}

// Both work similarly / Cả hai hoạt động tương tự
const obj1 = new MyClass(10);
const obj2 = new MyFunction(10);
```

---

## Practice Problems / Bài Tập Thực Hành

### Problem 1: Implement Inheritance / Triển Khai Kế Thừa

```javascript
// Create a Vehicle class and Car class that extends it
// Tạo lớp Vehicle và lớp Car kế thừa từ nó

class Vehicle {
  constructor(make, model) {
    this.make = make;
    this.model = model;
  }
  
  getInfo() {
    return `${this.make} ${this.model}`;
  }
}

class Car extends Vehicle {
  constructor(make, model, doors) {
    super(make, model);
    this.doors = doors;
  }
  
  getInfo() {
    return `${super.getInfo()} with ${this.doors} doors`;
  }
}

const car = new Car('Toyota', 'Camry', 4);
console.log(car.getInfo()); // "Toyota Camry with 4 doors"
```

### Problem 2: Create Custom Prototype Chain / Tạo Chuỗi Prototype Tùy Chỉnh

```javascript
// Create a prototype chain: grandparent → parent → child
// Tạo chuỗi prototype: ông bà → cha mẹ → con

const grandparent = {
  surname: 'Smith',
  getSurname() {
    return this.surname;
  }
};

const parent = Object.create(grandparent);
parent.firstName = 'John';

const child = Object.create(parent);
child.age = 10;

console.log(child.getSurname()); // "Smith"
console.log(child.firstName); // "John"
console.log(child.age); // 10
```

---

## Key Takeaways / Điểm Chính

**English:**
1. Every object has a prototype (except objects created with `Object.create(null)`)
2. Prototype chain enables property and method inheritance
3. Constructor functions and classes both use prototypal inheritance
4. `prototype` is for constructor functions, `__proto__` is for object instances
5. Use `Object.create()` for pure prototypal inheritance
6. ES6 classes provide cleaner syntax but work the same way underneath

**Tiếng Việt:**
1. Mọi đối tượng đều có prototype (trừ đối tượng được tạo với `Object.create(null)`)
2. Chuỗi prototype cho phép kế thừa thuộc tính và phương thức
3. Hàm khởi tạo và lớp đều sử dụng kế thừa nguyên mẫu
4. `prototype` dành cho hàm khởi tạo, `__proto__` dành cho instance đối tượng
5. Sử dụng `Object.create()` cho kế thừa nguyên mẫu thuần túy
6. Lớp ES6 cung cấp cú pháp sạch hơn nhưng hoạt động giống nhau bên dưới

---

[← Previous: Closures](./03-closures.md) | [Back to Table of Contents](../00-table-of-contents.md) | [Next: The `this` Keyword →](./05-this-keyword.md)

