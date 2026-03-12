# Prototypes & Inheritance - JavaScript OOP Deep Dive

> Prototype là cơ chế kế thừa của JavaScript. Hiểu prototype chain = hiểu cách JS objects hoạt động.

---

## Mục Lục

- [Overview](#-overview)
- [What - Prototype là gì](#-what---prototype-là-gì)
- [Why - Tại sao cần Prototype](#-why---tại-sao-cần-prototype)
- [How - Prototype Chain hoạt động](#-how---prototype-chain-hoạt-động)
- [Inheritance Patterns](#-inheritance-patterns)
- [ES6 Classes](#-es6-classes)
- [Câu Hỏi Phỏng Vấn](#-câu-hỏi-phỏng-vấn)

---

## 🎯 Overview

JavaScript sử dụng **prototypal inheritance** thay vì classical inheritance như Java/C++. Mọi object trong JS đều có một internal link đến object khác gọi là **prototype**.

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROTOTYPE CHAIN                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   myObject                                                        │
│   ┌──────────────┐                                               │
│   │ name: "John" │                                               │
│   │ __proto__ ───┼──────┐                                        │
│   └──────────────┘      │                                        │
│                         ▼                                        │
│                   Person.prototype                                │
│                   ┌──────────────┐                               │
│                   │ sayHi()      │                               │
│                   │ __proto__ ───┼──────┐                        │
│                   └──────────────┘      │                        │
│                                         ▼                        │
│                                   Object.prototype               │
│                                   ┌──────────────┐               │
│                                   │ toString()   │               │
│                                   │ hasOwnProperty│              │
│                                   │ __proto__ ───┼──► null       │
│                                   └──────────────┘               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📖 What - Prototype là gì

### Định Nghĩa

**Prototype** là một object mà các objects khác có thể kế thừa properties và methods từ nó.

### Các khái niệm quan trọng

| Thuật ngữ | Định nghĩa |
|-----------|------------|
| `[[Prototype]]` | Internal slot chứa reference đến prototype object |
| `__proto__` | Getter/setter để access [[Prototype]] (deprecated) |
| `Object.getPrototypeOf()` | Standard way để lấy prototype |
| `prototype` property | Property của functions, dùng làm prototype cho instances |
| Prototype chain | Chuỗi các prototypes từ object đến null |

### `__proto__` vs `prototype`

```javascript
// prototype: Property của FUNCTION
function Person(name) {
    this.name = name;
}
Person.prototype.sayHi = function() {
    console.log(`Hi, I'm ${this.name}`);
};

// __proto__: Internal link của OBJECT
const john = new Person('John');

console.log(john.__proto__ === Person.prototype); // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__); // null
```

### Visualizing the Relationship

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│     Function Person                    Object john                   │
│     ┌─────────────────┐               ┌─────────────────┐           │
│     │ prototype ──────┼──┐            │ name: "John"    │           │
│     └─────────────────┘  │            │ __proto__ ──────┼───┐       │
│                          │            └─────────────────┘   │       │
│                          ▼                                  │       │
│                    ┌─────────────────┐                      │       │
│                    │ Person.prototype│◄─────────────────────┘       │
│                    ├─────────────────┤                              │
│                    │ constructor ────┼──► Person                    │
│                    │ sayHi()         │                              │
│                    │ __proto__ ──────┼──► Object.prototype          │
│                    └─────────────────┘                              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🤔 Why - Tại Sao Cần Prototype

### 1. Memory Efficiency

```javascript
// ❌ Without prototype - mỗi instance có copy riêng
function PersonBad(name) {
    this.name = name;
    this.sayHi = function() { // Tạo mới function mỗi lần!
        console.log(`Hi, I'm ${this.name}`);
    };
}

const p1 = new PersonBad('John');
const p2 = new PersonBad('Jane');
console.log(p1.sayHi === p2.sayHi); // false - 2 functions khác nhau!

// ✅ With prototype - share method
function PersonGood(name) {
    this.name = name;
}
PersonGood.prototype.sayHi = function() {
    console.log(`Hi, I'm ${this.name}`);
};

const p3 = new PersonGood('John');
const p4 = new PersonGood('Jane');
console.log(p3.sayHi === p4.sayHi); // true - cùng 1 function!
```

### 2. Inheritance (Kế thừa)

```javascript
function Animal(name) {
    this.name = name;
}
Animal.prototype.speak = function() {
    console.log(`${this.name} makes a sound.`);
};

function Dog(name, breed) {
    Animal.call(this, name); // Call parent constructor
    this.breed = breed;
}

// Inherit from Animal
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
    console.log(`${this.name} barks!`);
};

const dog = new Dog('Rex', 'German Shepherd');
dog.speak(); // Rex makes a sound. (inherited)
dog.bark();  // Rex barks! (own method)
```

### 3. Dynamic Extension

```javascript
// Có thể thêm methods sau khi tạo objects
function Car(brand) {
    this.brand = brand;
}

const car1 = new Car('Toyota');

// Thêm method sau - car1 vẫn có thể dùng!
Car.prototype.drive = function() {
    console.log(`${this.brand} is driving`);
};

car1.drive(); // Toyota is driving
```

---

## 🔧 How - Prototype Chain Hoạt Động

### Property Lookup

Khi access một property, JS tìm theo chain:

```javascript
const obj = {
    name: 'John',
    __proto__: {
        age: 30,
        __proto__: {
            city: 'NYC',
            __proto__: null
        }
    }
};

// Lookup process:
console.log(obj.name);  // 'John' - found in obj
console.log(obj.age);   // 30 - found in first prototype
console.log(obj.city);  // 'NYC' - found in second prototype
console.log(obj.xyz);   // undefined - not found, reached null
```

### Property Lookup Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                 obj.name LOOKUP                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Step 1: Check obj itself                                        │
│  ┌──────────┐                                                    │
│  │ obj      │  ◄── Found 'name' here! Return 'John'             │
│  │ name ✓   │                                                    │
│  └──────────┘                                                    │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                 obj.toString() LOOKUP                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Step 1: Check obj         → Not found                          │
│  Step 2: Check obj.__proto__ (Person.prototype) → Not found     │
│  Step 3: Check Object.prototype → Found toString()!             │
│                                                                   │
│  ┌──────────┐     ┌─────────────────┐     ┌─────────────────┐   │
│  │ obj      │ ──► │ Person.prototype│ ──► │Object.prototype │   │
│  │ name     │     │ sayHi()         │     │ toString() ✓    │   │
│  └──────────┘     └─────────────────┘     └─────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### hasOwnProperty vs in

```javascript
function Person(name) {
    this.name = name;
}
Person.prototype.age = 30;

const john = new Person('John');

// hasOwnProperty - chỉ check own properties
console.log(john.hasOwnProperty('name')); // true
console.log(john.hasOwnProperty('age'));  // false

// in - check cả prototype chain
console.log('name' in john); // true
console.log('age' in john);  // true
console.log('toString' in john); // true (from Object.prototype)
```

### Object.create()

```javascript
// Tạo object với specific prototype
const personProto = {
    greet() {
        console.log(`Hello, I'm ${this.name}`);
    }
};

const john = Object.create(personProto);
john.name = 'John';
john.greet(); // Hello, I'm John

// Object.create(null) - no prototype
const pureObject = Object.create(null);
console.log(pureObject.toString); // undefined - no inherited methods!
```

---

## 🔄 Inheritance Patterns

### 1. Constructor Pattern (Classical)

```javascript
function Animal(name) {
    this.name = name;
}

Animal.prototype.speak = function() {
    console.log(`${this.name} makes a sound`);
};

function Dog(name, breed) {
    Animal.call(this, name); // Super constructor
    this.breed = breed;
}

// Setup inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
    console.log('Woof!');
};
```

### 2. Object.create Pattern

```javascript
const animalMethods = {
    speak() {
        console.log(`${this.name} speaks`);
    }
};

function createAnimal(name) {
    const animal = Object.create(animalMethods);
    animal.name = name;
    return animal;
}

const dog = createAnimal('Rex');
dog.speak(); // Rex speaks
```

### 3. Parasitic Combination Inheritance (Best Practice pre-ES6)

```javascript
function inheritPrototype(child, parent) {
    const prototype = Object.create(parent.prototype);
    prototype.constructor = child;
    child.prototype = prototype;
}

function Person(name) {
    this.name = name;
}

Person.prototype.sayName = function() {
    console.log(this.name);
};

function Developer(name, language) {
    Person.call(this, name);
    this.language = language;
}

inheritPrototype(Developer, Person);

Developer.prototype.code = function() {
    console.log(`${this.name} codes in ${this.language}`);
};
```

---

## 🆕 ES6 Classes

### Class Syntax

```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }

    speak() {
        console.log(`${this.name} makes a sound`);
    }

    // Static method
    static create(name) {
        return new Animal(name);
    }

    // Getter
    get info() {
        return `Animal: ${this.name}`;
    }

    // Setter
    set nickname(value) {
        this._nickname = value;
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name); // Call parent constructor
        this.breed = breed;
    }

    speak() {
        super.speak(); // Call parent method
        console.log('Woof!');
    }
}

const dog = new Dog('Rex', 'German Shepherd');
dog.speak();
// Rex makes a sound
// Woof!
```

### Class is Syntactic Sugar

```javascript
class Person {
    constructor(name) {
        this.name = name;
    }
    greet() {
        console.log(`Hi, I'm ${this.name}`);
    }
}

// Equivalent to:
function PersonFunc(name) {
    this.name = name;
}
PersonFunc.prototype.greet = function() {
    console.log(`Hi, I'm ${this.name}`);
};

// Proof:
console.log(typeof Person); // 'function'
console.log(Person.prototype.greet); // [Function: greet]
```

### Private Fields (ES2022)

```javascript
class BankAccount {
    #balance = 0; // Private field

    constructor(initialBalance) {
        this.#balance = initialBalance;
    }

    deposit(amount) {
        this.#balance += amount;
    }

    getBalance() {
        return this.#balance;
    }

    // Private method
    #validateAmount(amount) {
        return amount > 0;
    }
}

const account = new BankAccount(100);
// account.#balance; // SyntaxError: Private field
account.deposit(50);
console.log(account.getBalance()); // 150
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: `__proto__` vs `prototype` khác nhau như thế nào?**

A:
- `prototype`: Property của **functions**, là object sẽ được dùng làm prototype cho instances tạo bởi `new`
- `__proto__`: Property của **objects**, là reference đến prototype object của chính nó
- `obj.__proto__ === Constructor.prototype`

**Q: Làm sao check một property thuộc object hay prototype?**

A: Dùng `hasOwnProperty()`:
```javascript
obj.hasOwnProperty('prop'); // true nếu là own property
'prop' in obj; // true nếu prop tồn tại (kể cả trong prototype)
```

### 🟡 Mid-level

**Q: Implement inheritance không dùng ES6 class**

```javascript
function Animal(name) {
    this.name = name;
}

Animal.prototype.speak = function() {
    console.log(this.name + ' speaks');
};

function Dog(name, breed) {
    Animal.call(this, name); // Inherit instance properties
    this.breed = breed;
}

// Inherit prototype methods
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
    console.log('Woof!');
};
```

**Q: Tại sao `Object.create(Animal.prototype)` thay vì `new Animal()`?**

A:
- `new Animal()` sẽ chạy constructor, có thể require arguments
- `Object.create(Animal.prototype)` chỉ setup prototype chain, không chạy constructor
- Cleaner và không có side effects

### 🔴 Senior

**Q: Giải thích output:**

```javascript
function Foo() {}
Foo.prototype.bar = 'hello';

const obj1 = new Foo();
const obj2 = new Foo();

Foo.prototype = { bar: 'world' };

const obj3 = new Foo();

console.log(obj1.bar); // ?
console.log(obj2.bar); // ?
console.log(obj3.bar); // ?
```

A:
```javascript
console.log(obj1.bar); // 'hello'
console.log(obj2.bar); // 'hello'
console.log(obj3.bar); // 'world'
```

Giải thích:
- obj1, obj2 đã được tạo với `__proto__` pointing đến original `Foo.prototype`
- Reassign `Foo.prototype` tạo object MỚI, không ảnh hưởng existing objects
- obj3 được tạo sau, nên `__proto__` point đến new `Foo.prototype`

**Q: Implement `Object.create` từ scratch**

```javascript
function objectCreate(proto, propertiesObject) {
    if (typeof proto !== 'object' && proto !== null) {
        throw new TypeError('Object prototype may only be an Object or null');
    }

    function F() {}
    F.prototype = proto;

    const obj = new F();

    if (propertiesObject !== undefined) {
        Object.defineProperties(obj, propertiesObject);
    }

    return obj;
}
```

---

## 📚 Active Recall

1. [ ] Vẽ prototype chain của một object tạo từ constructor function
2. [ ] Giải thích tại sao methods nên đặt trên prototype
3. [ ] So sánh prototypal vs classical inheritance
4. [ ] Implement class inheritance mà không dùng ES6 class
5. [ ] `Object.create(null)` tạo ra object như thế nào?

---

> **Tiếp theo:** [05-event-loop.md](./05-event-loop.md) - Event Loop & Asynchronous JavaScript
