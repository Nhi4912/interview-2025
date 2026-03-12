# ES6+ Features - Modern JavaScript Deep Dive

> ES6 (2015) đến ES2023 đã thay đổi cách viết JavaScript. Must-know cho mọi frontend developer.

---

## Mục Lục

- [ES6 (ES2015)](#-es6-es2015)
- [ES2016-ES2018](#-es2016-es2018)
- [ES2019-ES2021](#-es2019-es2021)
- [ES2022-ES2023](#-es2022-es2023)
- [Câu Hỏi Phỏng Vấn](#-câu-hỏi-phỏng-vấn)

---

## 🎯 ES6 (ES2015)

ES6 là major update lớn nhất của JavaScript.

### let & const

```javascript
// var - function scoped, hoisted
var x = 1;
if (true) {
    var x = 2; // Same variable!
}
console.log(x); // 2

// let - block scoped
let y = 1;
if (true) {
    let y = 2; // Different variable
}
console.log(y); // 1

// const - block scoped, cannot reassign
const z = 1;
// z = 2; // TypeError!

// But can mutate objects
const obj = { a: 1 };
obj.a = 2; // OK
obj.b = 3; // OK
// obj = {}; // TypeError!
```

### Temporal Dead Zone (TDZ)

```javascript
console.log(a); // undefined (hoisted)
var a = 1;

console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 2;

// TDZ: From block start until declaration
{
    // TDZ for 'x' starts here
    console.log(x); // ReferenceError
    let x = 10; // TDZ ends here
}
```

### Arrow Functions

```javascript
// Traditional
function add(a, b) {
    return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// Single parameter - no parens needed
const square = x => x * x;

// No parameters
const greet = () => 'Hello!';

// Object return (needs parens)
const makeObject = (id, name) => ({ id, name });

// Key difference: 'this' binding
const obj = {
    name: 'John',
    // Traditional: 'this' is obj
    greet: function() {
        setTimeout(function() {
            console.log(this.name); // undefined (this = window)
        }, 100);
    },
    // Arrow: 'this' is lexically inherited
    greetArrow: function() {
        setTimeout(() => {
            console.log(this.name); // 'John' (this = obj)
        }, 100);
    }
};
```

### Template Literals

```javascript
const name = 'World';
const greeting = `Hello, ${name}!`;

// Multiline
const html = `
    <div>
        <h1>Title</h1>
        <p>Content</p>
    </div>
`;

// Expressions
const price = 19.99;
const tax = 0.1;
const total = `Total: $${(price * (1 + tax)).toFixed(2)}`;

// Tagged templates
function highlight(strings, ...values) {
    return strings.reduce((result, str, i) => {
        return result + str + (values[i] ? `<mark>${values[i]}</mark>` : '');
    }, '');
}

const highlighted = highlight`Hello ${name}, your total is ${total}`;
```

### Destructuring

```javascript
// Array destructuring
const [a, b, c] = [1, 2, 3];
const [first, ...rest] = [1, 2, 3, 4]; // first=1, rest=[2,3,4]
const [x, , z] = [1, 2, 3]; // Skip elements

// Object destructuring
const { name, age } = { name: 'John', age: 30 };
const { name: userName } = { name: 'John' }; // Rename

// Default values
const { title = 'Untitled' } = {};

// Nested destructuring
const { address: { city } } = {
    address: { city: 'NYC', zip: '10001' }
};

// Function parameters
function greet({ name, greeting = 'Hello' }) {
    console.log(`${greeting}, ${name}!`);
}
greet({ name: 'John' }); // Hello, John!
```

### Spread & Rest Operators

```javascript
// Spread - expand iterables
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// Function arguments
const numbers = [1, 2, 3];
Math.max(...numbers); // 3

// Rest - collect remaining
function sum(...nums) {
    return nums.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4); // 10

// Destructuring with rest
const [first, ...others] = [1, 2, 3, 4];
const { a, ...remaining } = { a: 1, b: 2, c: 3 };
```

### Classes

```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }

    speak() {
        console.log(`${this.name} makes a sound`);
    }

    static create(name) {
        return new Animal(name);
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }

    speak() {
        super.speak();
        console.log('Woof!');
    }
}

const dog = new Dog('Rex', 'German Shepherd');
dog.speak();
// Rex makes a sound
// Woof!
```

### Modules

```javascript
// export.js
export const PI = 3.14159;
export function square(x) { return x * x; }
export default class Calculator { }

// import.js
import Calculator from './export.js';
import { PI, square } from './export.js';
import * as MathUtils from './export.js';
import { square as sq } from './export.js';
```

### Promises

```javascript
const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve('Done!'), 1000);
});

promise
    .then(result => console.log(result))
    .catch(error => console.error(error))
    .finally(() => console.log('Cleanup'));

// Static methods
Promise.all([p1, p2, p3]);
Promise.race([p1, p2]);
Promise.resolve(value);
Promise.reject(error);
```

### Symbols

```javascript
const sym1 = Symbol('description');
const sym2 = Symbol('description');
console.log(sym1 === sym2); // false - always unique

// Use as unique object keys
const ID = Symbol('id');
const user = {
    [ID]: 12345,
    name: 'John'
};

// Well-known symbols
const iterable = {
    [Symbol.iterator]() {
        let i = 0;
        return {
            next() {
                return i < 3
                    ? { value: i++, done: false }
                    : { done: true };
            }
        };
    }
};

for (const x of iterable) console.log(x); // 0, 1, 2
```

### Map & Set

```javascript
// Map - key-value pairs with any key type
const map = new Map();
map.set('key', 'value');
map.set(obj, 'object as key');
map.get('key'); // 'value'
map.has('key'); // true
map.delete('key');
map.size; // number of entries

// WeakMap - keys must be objects, allows GC
const weakMap = new WeakMap();

// Set - unique values
const set = new Set([1, 2, 2, 3]); // {1, 2, 3}
set.add(4);
set.has(1); // true
set.delete(1);
set.size;

// WeakSet - objects only, allows GC
const weakSet = new WeakSet();
```

---

## 📦 ES2016-ES2018

### ES2016

```javascript
// Array.prototype.includes
[1, 2, 3].includes(2); // true

// Exponentiation operator
2 ** 3; // 8
```

### ES2017

```javascript
// Async/await
async function fetchData() {
    const response = await fetch('/api/data');
    return response.json();
}

// Object.entries / Object.values
const obj = { a: 1, b: 2 };
Object.entries(obj); // [['a', 1], ['b', 2]]
Object.values(obj);  // [1, 2]

// String padding
'5'.padStart(3, '0');  // '005'
'5'.padEnd(3, '0');    // '500'

// Object.getOwnPropertyDescriptors
Object.getOwnPropertyDescriptors(obj);

// Trailing commas in function parameters
function foo(a, b,) {}
```

### ES2018

```javascript
// Async iteration
async function* asyncGenerator() {
    yield await fetch('/api/1');
    yield await fetch('/api/2');
}

for await (const response of asyncGenerator()) {
    console.log(response);
}

// Rest/Spread for objects
const { a, ...rest } = { a: 1, b: 2, c: 3 };
const merged = { ...obj1, ...obj2 };

// Promise.finally
fetch('/api')
    .then(handle)
    .catch(handleError)
    .finally(cleanup);

// RegExp improvements
// Named capture groups
const re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = re.exec('2024-01-15');
console.log(match.groups.year); // '2024'

// Lookbehind assertions
/(?<=\$)\d+/.exec('$100'); // ['100']
```

---

## 🚀 ES2019-ES2021

### ES2019

```javascript
// Array.flat / flatMap
[1, [2, [3]]].flat(2);  // [1, 2, 3]
[1, 2].flatMap(x => [x, x * 2]); // [1, 2, 2, 4]

// Object.fromEntries
Object.fromEntries([['a', 1], ['b', 2]]); // { a: 1, b: 2 }

// String.trimStart / trimEnd
'  hello  '.trimStart(); // 'hello  '
'  hello  '.trimEnd();   // '  hello'

// Optional catch binding
try {
    throw new Error();
} catch { // No parameter needed
    console.log('Error occurred');
}

// Symbol.description
Symbol('foo').description; // 'foo'
```

### ES2020

```javascript
// Optional chaining (?.)
const city = user?.address?.city;
const name = arr?.[0]?.name;
const result = obj.method?.();

// Nullish coalescing (??)
const value = null ?? 'default'; // 'default'
const zero = 0 ?? 'default';     // 0 (unlike ||)

// BigInt
const big = 9007199254740991n;
const result = big + 1n;

// Promise.allSettled
Promise.allSettled([p1, p2]).then(results => {
    results.forEach(result => {
        if (result.status === 'fulfilled') {
            console.log(result.value);
        } else {
            console.log(result.reason);
        }
    });
});

// globalThis
console.log(globalThis); // window in browser, global in Node

// Dynamic import
const module = await import('./module.js');

// String.matchAll
const regex = /t(e)(st(\d?))/g;
for (const match of 'test1test2'.matchAll(regex)) {
    console.log(match);
}
```

### ES2021

```javascript
// String.replaceAll
'aabbcc'.replaceAll('b', 'x'); // 'aaxxcc'

// Logical assignment operators
a ||= b;  // a = a || b
a &&= b;  // a = a && b
a ??= b;  // a = a ?? b

// Numeric separators
const billion = 1_000_000_000;
const bytes = 0xFF_FF_FF;

// Promise.any
Promise.any([p1, p2, p3]).then(first => {
    console.log('First to resolve:', first);
});

// WeakRef & FinalizationRegistry
const ref = new WeakRef(largeObject);
ref.deref(); // Returns object or undefined
```

---

## 🆕 ES2022-ES2023

### ES2022

```javascript
// Top-level await
const data = await fetch('/api/data');

// Private class fields & methods
class Counter {
    #count = 0;

    #increment() {
        this.#count++;
    }

    get value() {
        return this.#count;
    }
}

// Static class blocks
class Config {
    static settings;

    static {
        this.settings = loadSettings();
    }
}

// Array.at() - negative indexing
const arr = [1, 2, 3, 4, 5];
arr.at(-1);  // 5
arr.at(-2);  // 4

// Object.hasOwn
Object.hasOwn(obj, 'prop'); // Better than obj.hasOwnProperty()

// Error.cause
throw new Error('Failed', { cause: originalError });

// RegExp /d flag (match indices)
const re = /a+/d;
const match = re.exec('aaab');
console.log(match.indices[0]); // [0, 3]
```

### ES2023

```javascript
// Array methods that don't mutate
const arr = [3, 1, 2];

arr.toSorted();             // [1, 2, 3] - original unchanged
arr.toReversed();           // [2, 1, 3] - original unchanged
arr.toSpliced(1, 1, 'x');   // [3, 'x', 2] - original unchanged
arr.with(1, 'x');           // [3, 'x', 2] - replace at index

// findLast / findLastIndex
const numbers = [1, 2, 3, 4, 5];
numbers.findLast(n => n % 2 === 0);      // 4
numbers.findLastIndex(n => n % 2 === 0); // 3

// Hashbang support
#!/usr/bin/env node
console.log('Hello from CLI!');

// Symbols as WeakMap keys
const weak = new WeakMap();
const key = Symbol('key');
weak.set(key, 'value');
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: let, const, var khác nhau như thế nào?**

A:
- `var`: function-scoped, hoisted, có thể redeclare
- `let`: block-scoped, TDZ, không redeclare
- `const`: như let nhưng không thể reassign

**Q: Arrow function khác regular function như thế nào?**

A:
- Arrow: `this` lexical (inherited), không có `arguments`, không thể dùng làm constructor
- Regular: `this` dynamic, có `arguments`, có thể `new`

### 🟡 Mid-level

**Q: Giải thích Optional Chaining và Nullish Coalescing**

A:
```javascript
// Optional chaining - safe property access
user?.address?.city // undefined if any is null/undefined

// Nullish coalescing - default for null/undefined only
const value = null ?? 'default'; // 'default'
const zero = 0 ?? 'default';     // 0 (0 is not nullish)
```

**Q: Promise.all vs Promise.allSettled vs Promise.any?**

A:
- `all`: Reject nếu bất kỳ promise nào reject
- `allSettled`: Đợi tất cả, trả về status của mỗi promise
- `any`: Resolve với promise đầu tiên resolve, reject nếu tất cả reject

### 🔴 Senior

**Q: Implement polyfill cho Optional Chaining**

```javascript
function optionalChain(obj, ...props) {
    return props.reduce((acc, prop) => {
        if (acc === null || acc === undefined) {
            return undefined;
        }
        return acc[prop];
    }, obj);
}

// Usage
optionalChain(user, 'address', 'city');
```

**Q: Giải thích use cases của Private Class Fields**

A:
1. Encapsulation - hide implementation details
2. Prevent external modification
3. Avoid name collisions với subclasses
4. True privacy (không thể access từ outside)

---

## 📚 Active Recall

1. [ ] List 5 ES6 features quan trọng nhất
2. [ ] Giải thích Temporal Dead Zone
3. [ ] So sánh `??` với `||`
4. [ ] Khi nào dùng `Array.at()` thay vì bracket notation?
5. [ ] Private fields vs WeakMap cho encapsulation?

---

> **Tiếp theo:** [09-design-patterns.md](./09-design-patterns.md) - JavaScript Design Patterns
