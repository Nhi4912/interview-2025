# Complete Frontend Interview Preparation Guide 2025-2026
## Big Tech Companies: Meta, Microsoft, Google, Amazon, Grab, Axon

### Table of Contents
1. [JavaScript Fundamentals](#javascript-fundamentals)
2. [TypeScript Mastery](#typescript-mastery)
3. [React 19 & Modern Patterns](#react-19-modern-patterns)
4. [Next.js 16 Advanced Features](#nextjs-16-advanced-features)
5. [Web Security](#web-security)
6. [HTML5 & Semantic Web](#html5-semantic-web)
7. [Modern CSS & Styling](#modern-css-styling)
8. [Performance Optimization](#performance-optimization)
9. [System Design for Frontend](#system-design-frontend)
10. [Development Tools & Workflow](#development-tools-workflow)
11. [Interview Practice Problems](#interview-practice-problems)
12. [Mind Maps & Visual Learning](#mind-maps-visual-learning)

---

## JavaScript Fundamentals

### 1. Variables & Data Types / Biến & Kiểu Dữ Liệu

**Definition / Định nghĩa:** JavaScript has dynamic typing with 8 data types: 7 primitive + 1 reference type.
**Định nghĩa:** JavaScript có kiểu động với 8 kiểu dữ liệu: 7 kiểu nguyên thủy + 1 kiểu tham chiếu.

#### Primitive Types (Immutable) / Kiểu Nguyên Thủy (Bất biến):
- `number` - IEEE 754 double precision
- `string` - UTF-16 encoded text
- `boolean` - true/false
- `null` - intentional absence of value
- `undefined` - declared but not assigned
- `symbol` - unique identifier (ES6)
- `bigint` - arbitrary precision integers (ES2020)

#### Reference Type (Mutable) / Kiểu Tham Chiếu (Có thể thay đổi):
- `object` - collections of key-value pairs (includes arrays, functions, dates, etc.)

**Memory Allocation:**
- Primitives: stored in stack memory
- Objects: stored in heap memory, stack holds reference

**Common Interview Questions:****Q1: What's
 the difference between `null` and `undefined`?**
```javascript
let a; // undefined - declared but not assigned
let b = null; // null - intentionally empty

console.log(typeof a); // "undefined"
console.log(typeof b); // "object" (historical bug in JS)
console.log(a == b);   // true (type coercion)
console.log(a === b);  // false (strict comparison)
```

**Q2: Explain type coercion with examples:**
```javascript
// String coercion
console.log("5" + 1);     // "51" (number to string)
console.log("5" - 1);     // 4 (string to number)
console.log(+"123");      // 123 (unary + converts to number)

// Boolean coercion
console.log(Boolean(0));        // false
console.log(Boolean(""));       // false
console.log(Boolean(null));     // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN));      // false
console.log(Boolean(false));    // false
// Everything else is truthy

// Comparison coercion
console.log([] == false);  // true
console.log([] == 0);      // true
console.log("" == 0);      // true
```

### 2. Variable Declarations: var, let, const

**Comparison Table:**
| Feature | var | let | const |
|---------|-----|-----|-------|
| Scope | Function/Global | Block | Block |
| Hoisting | Yes (undefined) | Yes (TDZ) | Yes (TDZ) |
| Redeclaration | Allowed | Not allowed | Not allowed |
| Reassignment | Allowed | Allowed | Not allowed |
| Temporal Dead Zone | No | Yes | Yes |

**Examples:**
```javascript
// Hoisting behavior
console.log(varVariable); // undefined (not error)
console.log(letVariable); // ReferenceError: Cannot access before initialization
console.log(constVariable); // ReferenceError: Cannot access before initialization

var varVariable = "var";
let letVariable = "let";
const constVariable = "const";

// Block scope
function scopeExample() {
  if (true) {
    var varScoped = "function scoped";
    let letScoped = "block scoped";
    const constScoped = "block scoped";
  }
  
  console.log(varScoped);   // "function scoped"
  console.log(letScoped);   // ReferenceError
  console.log(constScoped); // ReferenceError
}
```### 
3. Scope & Hoisting / Phạm Vi & Kéo Lên

**Definition:** Scope determines variable accessibility. Hoisting moves declarations to the top.
**Định nghĩa:** Phạm vi xác định khả năng truy cập biến. Kéo lên di chuyển khai báo lên đầu.

#### Types of Scope:
1. **Global Scope** - accessible everywhere
2. **Function Scope** - accessible within function
3. **Block Scope** - accessible within block (ES6+)
4. **Module Scope** - accessible within module

**Lexical Scoping Example:**
```javascript
const globalVar = "global";

function outerFunction(x) {
  const outerVar = "outer";
  
  function innerFunction(y) {
    const innerVar = "inner";
    console.log(globalVar); // "global" - lexical scope
    console.log(outerVar);  // "outer" - lexical scope
    console.log(innerVar);  // "inner" - local scope
    console.log(x, y);      // parameters accessible
  }
  
  return innerFunction;
}

const closure = outerFunction("param1");
closure("param2");
```

**Hoisting Detailed Examples:**
```javascript
// Function hoisting
console.log(hoistedFunction()); // "I'm hoisted!" - works

function hoistedFunction() {
  return "I'm hoisted!";
}

// Function expression - not hoisted
console.log(notHoisted()); // TypeError: notHoisted is not a function

var notHoisted = function() {
  return "I'm not hoisted!";
};

// Let/const hoisting with TDZ
console.log(typeof x); // ReferenceError: Cannot access 'x' before initialization
let x = 5;

// Temporal Dead Zone example
function temporalDeadZone() {
  console.log(typeof y); // "undefined" - y is not declared yet
  
  if (true) {
    console.log(typeof z); // ReferenceError - z is in TDZ
    let z = 10;
  }
}
```

### 4. Closures / Bao Đóng

**Definition:** A closure is a function that has access to variables in its outer scope even after the outer function returns.
**Định nghĩa:** Bao đóng là hàm có quyền truy cập vào biến trong phạm vi bên ngoài ngay cả sau khi hàm bên ngoài kết thúc.

**Practical Examples:**```javas
cript
// 1. Counter with private state
function createCounter(initialValue = 0) {
  let count = initialValue; // Private variable
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getValue: () => count,
    reset: () => count = initialValue
  };
}

const counter = createCounter(10);
console.log(counter.getValue()); // 10
console.log(counter.increment()); // 11
console.log(counter.count); // undefined - private!

// 2. Function factory
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
console.log(double(5)); // 10
console.log(triple(5)); // 15

// 3. Module pattern
const Calculator = (function() {
  let result = 0; // Private state
  
  return {
    add: (x) => result += x,
    subtract: (x) => result -= x,
    multiply: (x) => result *= x,
    divide: (x) => result /= x,
    getResult: () => result,
    clear: () => result = 0
  };
})();

Calculator.add(10);
Calculator.multiply(2);
console.log(Calculator.getResult()); // 20

// 4. Event handlers with closures
function attachListeners() {
  const buttons = document.querySelectorAll('.btn');
  
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
      console.log(`Button ${i} clicked`); // Closure captures 'i'
    });
  }
}

// 5. Debounce function using closure
function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const debouncedSearch = debounce((query) => {
  console.log(`Searching for: ${query}`);
}, 300);
```

**Common Closure Pitfalls:**
```javascript
// Problem: Loop with var
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // Prints: 3, 3, 3
}

// Solution 1: Use let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // Prints: 0, 1, 2
}

// Solution 2: IIFE
for (var i = 0; i < 3; i++) {
  (function(index) {
    setTimeout(() => console.log(index), 100); // Prints: 0, 1, 2
  })(i);
}
```### 5. Pro
totypes & Inheritance / Nguyên Mẫu & Kế Thừa

**Definition:** JavaScript uses prototypal inheritance where objects inherit directly from other objects.
**Định nghĩa:** JavaScript sử dụng kế thừa nguyên mẫu nơi đối tượng kế thừa trực tiếp từ đối tượng khác.

**Prototype Chain Visualization:**
```
Object Instance → Constructor.prototype → Object.prototype → null
```

**Examples:**
```javascript
// 1. Constructor function pattern
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

Person.prototype.getAge = function() {
  return this.age;
};

const john = new Person("John", 30);
console.log(john.greet()); // "Hello, I'm John"
console.log(john.__proto__ === Person.prototype); // true

// 2. ES6 Class syntax (syntactic sugar)
class Animal {
  constructor(name, species) {
    this.name = name;
    this.species = species;
  }
  
  speak() {
    return `${this.name} makes a sound`;
  }
  
  static getKingdom() {
    return "Animalia";
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name, "Canine");
    this.breed = breed;
  }
  
  speak() {
    return `${this.name} barks`;
  }
  
  wagTail() {
    return `${this.name} wags tail`;
  }
}

const buddy = new Dog("Buddy", "Golden Retriever");
console.log(buddy.speak()); // "Buddy barks"
console.log(buddy instanceof Dog); // true
console.log(buddy instanceof Animal); // true

// 3. Object.create() pattern
const vehiclePrototype = {
  start() {
    return `${this.make} ${this.model} started`;
  },
  
  stop() {
    return `${this.make} ${this.model} stopped`;
  }
};

const car = Object.create(vehiclePrototype);
car.make = "Toyota";
car.model = "Camry";
car.wheels = 4;

console.log(car.start()); // "Toyota Camry started"

// 4. Prototype manipulation
function Shape(color) {
  this.color = color;
}

Shape.prototype.getColor = function() {
  return this.color;
};

function Circle(color, radius) {
  Shape.call(this, color); // Call parent constructor
  this.radius = radius;
}

// Set up inheritance
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.getArea = function() {
  return Math.PI * this.radius * this.radius;
};

const redCircle = new Circle("red", 5);
console.log(redCircle.getColor()); // "red"
console.log(redCircle.getArea()); // 78.54
```**Key 
Differences: `__proto__` vs `prototype`**
```javascript
function Constructor() {}
const instance = new Constructor();

// prototype: property of constructor functions
console.log(Constructor.prototype); // Object with constructor property

// __proto__: property of all objects, points to prototype
console.log(instance.__proto__ === Constructor.prototype); // true

// Prototype chain lookup
Constructor.prototype.method = function() { return "found"; };
console.log(instance.method()); // "found" - found via prototype chain
```

### 6. The `this` Keyword / Từ Khóa `this`

**Definition:** `this` refers to the execution context of a function call.
**Định nghĩa:** `this` tham chiếu đến ngữ cảnh thực thi của lời gọi hàm.

**Four Rules of `this` Binding:**

1. **Default Binding** (Global/undefined)
2. **Implicit Binding** (Object method)
3. **Explicit Binding** (call/apply/bind)
4. **New Binding** (Constructor)

```javascript
// 1. Default binding
function globalFunction() {
  console.log(this); // Window (browser) or global (Node.js) in non-strict mode
                     // undefined in strict mode
}

// 2. Implicit binding
const obj = {
  name: "Object",
  method() {
    console.log(this.name); // "Object"
    
    function innerFunction() {
      console.log(this.name); // undefined (default binding)
    }
    innerFunction();
  }
};

// 3. Explicit binding
const person = {
  name: "Alice",
  greet() {
    return `Hello, ${this.name}`;
  }
};

const anotherPerson = { name: "Bob" };

// call() - immediate invocation
console.log(person.greet.call(anotherPerson)); // "Hello, Bob"

// apply() - immediate invocation with array of arguments
function introduce(age, city) {
  return `I'm ${this.name}, ${age} years old from ${city}`;
}

console.log(introduce.apply(person, [25, "NYC"])); // "I'm Alice, 25 years old from NYC"

// bind() - returns new function
const boundGreet = person.greet.bind(anotherPerson);
console.log(boundGreet()); // "Hello, Bob"

// 4. New binding
function Person(name) {
  this.name = name;
  this.greet = function() {
    return `Hello, I'm ${this.name}`;
  };
}

const john = new Person("John");
console.log(john.greet()); // "Hello, I'm John"

// Arrow functions - lexical this
const arrowObj = {
  name: "Arrow Object",
  regularMethod() {
    console.log(this.name); // "Arrow Object"
    
    const arrowFunction = () => {
      console.log(this.name); // "Arrow Object" - inherits from enclosing scope
    };
    
    arrowFunction();
  }
};
```##
# 7. Event Loop & Asynchronous JavaScript

**Definition:** The event loop manages asynchronous operations using call stack, callback queue, and microtask queue.
**Định nghĩa:** Vòng lặp sự kiện quản lý các hoạt động bất đồng bộ bằng call stack, callback queue, và microtask queue.

**Event Loop Visualization:**
```
Call Stack → Web APIs → Callback Queue → Event Loop → Call Stack
                    → Microtask Queue ↗
```

**Execution Order:**
1. Synchronous code (Call Stack)
2. Microtasks (Promises, queueMicrotask)
3. Macrotasks (setTimeout, setInterval, I/O)

```javascript
// Event loop example
console.log("1"); // Synchronous

setTimeout(() => console.log("2"), 0); // Macrotask

Promise.resolve().then(() => console.log("3")); // Microtask

console.log("4"); // Synchronous

// Output: 1, 4, 3, 2

// Complex example
console.log("Start");

setTimeout(() => console.log("Timeout 1"), 0);

Promise.resolve()
  .then(() => {
    console.log("Promise 1");
    return Promise.resolve();
  })
  .then(() => console.log("Promise 2"));

setTimeout(() => console.log("Timeout 2"), 0);

console.log("End");

// Output: Start, End, Promise 1, Promise 2, Timeout 1, Timeout 2
```

**Promises Deep Dive:**
```javascript
// Promise states: pending, fulfilled, rejected
const promise = new Promise((resolve, reject) => {
  // Asynchronous operation
  setTimeout(() => {
    const success = Math.random() > 0.5;
    if (success) {
      resolve("Operation successful");
    } else {
      reject(new Error("Operation failed"));
    }
  }, 1000);
});

// Promise chaining
promise
  .then(result => {
    console.log(result);
    return result.toUpperCase();
  })
  .then(upperResult => {
    console.log(upperResult);
  })
  .catch(error => {
    console.error(error.message);
  })
  .finally(() => {
    console.log("Cleanup");
  });

// Async/await syntax
async function handlePromise() {
  try {
    const result = await promise;
    console.log(result);
    return result.toUpperCase();
  } catch (error) {
    console.error(error.message);
    throw error;
  } finally {
    console.log("Cleanup");
  }
}

// Promise utilities
const promises = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
];

// Promise.all - waits for all to resolve
Promise.all(promises).then(results => {
  console.log(results); // [1, 2, 3]
});

// Promise.allSettled - waits for all to settle
Promise.allSettled([
  Promise.resolve(1),
  Promise.reject("error"),
  Promise.resolve(3)
]).then(results => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 1 },
  //   { status: 'rejected', reason: 'error' },
  //   { status: 'fulfilled', value: 3 }
  // ]
});

// Promise.race - first to settle wins
Promise.race(promises).then(result => {
  console.log(result); // 1 (first to resolve)
});
```---

## 
TypeScript Mastery

### 1. TypeScript Fundamentals

**Definition:** TypeScript is a statically typed superset of JavaScript that compiles to plain JavaScript.
**Định nghĩa:** TypeScript là một superset có kiểu tĩnh của JavaScript, biên dịch thành JavaScript thuần túy.

**Basic Types:**
```typescript
// Primitive types
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;
let data: null = null;
let notDefined: undefined = undefined;

// Array types
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ["a", "b", "c"];

// Tuple types
let tuple: [string, number] = ["John", 30];

// Enum types
enum Color {
  Red = "red",
  Green = "green",
  Blue = "blue"
}

// Any type (avoid when possible)
let anything: any = "could be anything";

// Unknown type (safer than any)
let userInput: unknown;
if (typeof userInput === "string") {
  console.log(userInput.toUpperCase()); // Type guard required
}

// Never type
function throwError(message: string): never {
  throw new Error(message);
}

// Void type
function logMessage(message: string): void {
  console.log(message);
}
```

**Interfaces and Type Aliases:**
```typescript
// Interface definition
interface User {
  readonly id: number;
  name: string;
  email?: string; // Optional property
  age: number;
  preferences: {
    theme: "light" | "dark";
    notifications: boolean;
  };
}

// Type alias
type Status = "pending" | "approved" | "rejected";

type UserWithStatus = User & {
  status: Status;
};

// Function interfaces
interface Calculator {
  (a: number, b: number): number;
}

const add: Calculator = (a, b) => a + b;

// Class implementing interface
class UserAccount implements User {
  readonly id: number;
  name: string;
  age: number;
  preferences = {
    theme: "light" as const,
    notifications: true
  };

  constructor(id: number, name: string, age: number) {
    this.id = id;
    this.name = name;
    this.age = age;
  }

  updatePreferences(newPrefs: Partial<User['preferences']>) {
    this.preferences = { ...this.preferences, ...newPrefs };
  }
}
```

**Generics:**
```typescript
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

const stringResult = identity<string>("hello");
const numberResult = identity(42); // Type inference

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface UserData {
  id: number;
  name: string;
}

const userResponse: ApiResponse<UserData> = {
  data: { id: 1, name: "John" },
  status: 200,
  message: "Success"
};

// Generic constraints
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength("hello"); // OK
logLength([1, 2, 3]); // OK
// logLength(123); // Error: number doesn't have length

// Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;

type Example = NonNullable<string | null>; // string
```**Adv
anced TypeScript Features:**
```typescript
// Mapped types
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Utility types
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;
type TodoInfo = Omit<Todo, "completed">;
type TodoPartial = Partial<Todo>;
type TodoRequired = Required<TodoPartial>;

// Template literal types
type EventName<T extends string> = `on${Capitalize<T>}`;
type ButtonEvent = EventName<"click">; // "onClick"

// Discriminated unions
interface LoadingState {
  status: "loading";
}

interface SuccessState {
  status: "success";
  data: any;
}

interface ErrorState {
  status: "error";
  error: string;
}

type AsyncState = LoadingState | SuccessState | ErrorState;

function handleState(state: AsyncState) {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return state.data; // TypeScript knows data exists
    case "error":
      return state.error; // TypeScript knows error exists
  }
}

// Module augmentation
declare module "express" {
  interface Request {
    user?: User;
  }
}
```

### 2. TypeScript Configuration

**tsconfig.json Best Practices:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## React 19 & Modern Patterns

### 1. React 19 New Features

**React Compiler (Automatic Optimization):**
```typescript
// React 19 automatically optimizes this component
function ExpensiveComponent({ items }: { items: Item[] }) {
  // No need for useMemo - React Compiler handles it
  const expensiveCalculation = items
    .filter(item => item.active)
    .map(item => item.value * 2)
    .reduce((sum, value) => sum + value, 0);

  return <div>{expensiveCalculation}</div>;
}
```

**Actions and useActionState:**
```typescript
import { useActionState } from 'react';

function ContactForm() {
  async function submitAction(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    
    try {
      await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({ name, email }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      return { success: true, message: 'Form submitted successfully!' };
    } catch (error) {
      return { success: false, message: 'Failed to submit form' };
    }
  }

  const [state, formAction, isPending] = useActionState(submitAction, null);

  return (
    <form action={formAction}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit'}
      </button>
      {state?.message && (
        <p className={state.success ? 'success' : 'error'}>
          {state.message}
        </p>
      )}
    </form>
  );
}
```**use() H
ook for Promises and Context:**
```typescript
import { use, Suspense } from 'react';

// Promise-based data fetching
function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise); // Suspends until promise resolves
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// Context consumption
const ThemeContext = createContext<'light' | 'dark'>('light');

function ThemedButton() {
  const theme = use(ThemeContext); // Alternative to useContext
  
  return (
    <button className={`btn-${theme}`}>
      Themed Button
    </button>
  );
}

// Usage with Suspense
function App() {
  const userPromise = fetch('/api/user').then(res => res.json());
  
  return (
    <Suspense fallback={<div>Loading user...</div>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}
```

**Document Metadata (Built-in):**
```typescript
function BlogPost({ post }: { post: Post }) {
  return (
    <>
      <title>{post.title}</title>
      <meta name="description" content={post.excerpt} />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.excerpt} />
      
      <article>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </article>
    </>
  );
}
```

### 2. Modern React Patterns

**Custom Hooks:**
```typescript
// Data fetching hook
function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const result = await response.json();
        
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}

// Local storage hook
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```*
*State Management Patterns:**
```typescript
// Reducer pattern for complex state
interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  loading: boolean;
}

type TodoAction =
  | { type: 'ADD_TODO'; payload: { text: string } }
  | { type: 'TOGGLE_TODO'; payload: { id: string } }
  | { type: 'DELETE_TODO'; payload: { id: string } }
  | { type: 'SET_FILTER'; payload: { filter: TodoState['filter'] } }
  | { type: 'SET_LOADING'; payload: { loading: boolean } };

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: crypto.randomUUID(),
            text: action.payload.text,
            completed: false,
            createdAt: new Date()
          }
        ]
      };
    
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id)
      };
    
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload.filter
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload.loading
      };
    
    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: 'all',
    loading: false
  });

  const addTodo = useCallback((text: string) => {
    dispatch({ type: 'ADD_TODO', payload: { text } });
  }, []);

  const toggleTodo = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_TODO', payload: { id } });
  }, []);

  const filteredTodos = useMemo(() => {
    switch (state.filter) {
      case 'active':
        return state.todos.filter(todo => !todo.completed);
      case 'completed':
        return state.todos.filter(todo => todo.completed);
      default:
        return state.todos;
    }
  }, [state.todos, state.filter]);

  return (
    <div>
      <TodoInput onAdd={addTodo} />
      <TodoFilter 
        current={state.filter} 
        onChange={(filter) => dispatch({ type: 'SET_FILTER', payload: { filter } })}
      />
      <TodoList 
        todos={filteredTodos} 
        onToggle={toggleTodo}
        onDelete={(id) => dispatch({ type: 'DELETE_TODO', payload: { id } })}
      />
    </div>
  );
}
```

**Context + Reducer Pattern:**
```typescript
// Context for global state management
interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'TOGGLE_THEME' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: { id: string } };

const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'TOGGLE_THEME':
      return { 
        ...state, 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          n => n.id !== action.payload.id
        )
      };
    
    default:
      return state;
  }
}

function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    theme: 'light',
    notifications: []
  });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
```---


## Next.js 16 Advanced Features

### 1. App Router & Server Components

**App Directory Structure:**
```
app/
├── layout.tsx          # Root layout
├── page.tsx           # Home page
├── loading.tsx        # Loading UI
├── error.tsx          # Error UI
├── not-found.tsx      # 404 page
├── global-error.tsx   # Global error boundary
├── dashboard/
│   ├── layout.tsx     # Nested layout
│   ├── page.tsx       # Dashboard page
│   ├── analytics/
│   │   └── page.tsx   # /dashboard/analytics
│   └── settings/
│       └── page.tsx   # /dashboard/settings
└── api/
    └── users/
        └── route.ts   # API route
```

**Server Components (Default in App Router):**
```typescript
// app/posts/page.tsx - Server Component
import { Suspense } from 'react';
import { PostList } from './post-list';
import { PostSkeleton } from './post-skeleton';

// This runs on the server
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // ISR - revalidate every hour
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts(); // Server-side data fetching

  return (
    <div>
      <h1>Blog Posts</h1>
      <Suspense fallback={<PostSkeleton />}>
        <PostList posts={posts} />
      </Suspense>
    </div>
  );
}

// Metadata API
export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}
```

**Client Components:**
```typescript
'use client'; // Required for client components

import { useState, useEffect } from 'react';

export function InteractiveCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Client-side effects
    const interval = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### 2. Data Fetching Patterns

**Server Actions:**
```typescript
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  // Validate data
  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  // Save to database
  const post = await db.post.create({
    data: { title, content }
  });

  // Revalidate the posts page
  revalidatePath('/posts');
  
  // Redirect to the new post
  redirect(`/posts/${post.id}`);
}

// app/posts/new/page.tsx
import { createPost } from '@/app/actions';

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Post title" required />
      <textarea name="content" placeholder="Post content" required />
      <button type="submit">Create Post</button>
    </form>
  );
}
```

**Streaming and Suspense:**
```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';

async function RevenueChart() {
  const revenue = await fetchRevenue(); // Slow query
  return <Chart data={revenue} />;
}

async function UserStats() {
  const stats = await fetchUserStats(); // Fast query
  return <StatsCard stats={stats} />;
}

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* This loads immediately */}
      <Suspense fallback={<div>Loading user stats...</div>}>
        <UserStats />
      </Suspense>
      
      {/* This streams in when ready */}
      <Suspense fallback={<div>Loading revenue chart...</div>}>
        <RevenueChart />
      </Suspense>
    </div>
  );
}
```##
# 3. Advanced Routing Features

**Dynamic Routes:**
```typescript
// app/posts/[slug]/page.tsx
interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function PostPage({ params, searchParams }: PageProps) {
  const post = await getPost(params.slug);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}

// Generate static params for SSG
export async function generateStaticParams() {
  const posts = await getPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

**Route Groups and Parallel Routes:**
```typescript
// app/(dashboard)/layout.tsx - Route group (doesn't affect URL)
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}

// app/dashboard/@analytics/page.tsx - Parallel route
export default function AnalyticsSlot() {
  return <AnalyticsPanel />;
}

// app/dashboard/@team/page.tsx - Parallel route
export default function TeamSlot() {
  return <TeamPanel />;
}

// app/dashboard/layout.tsx - Consuming parallel routes
export default function Layout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <div className="grid grid-cols-2 gap-4">
        {analytics}
        {team}
      </div>
    </div>
  );
}
```

**Intercepting Routes:**
```typescript
// app/photos/[id]/page.tsx - Full page
export default function PhotoPage({ params }: { params: { id: string } }) {
  return <PhotoDetail id={params.id} />;
}

// app/(.)photos/[id]/page.tsx - Intercepted route (modal)
export default function PhotoModal({ params }: { params: { id: string } }) {
  return (
    <Modal>
      <PhotoDetail id={params.id} />
    </Modal>
  );
}
```

### 4. Performance Optimization

**Image Optimization:**
```typescript
import Image from 'next/image';

export function OptimizedImage() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={800}
      height={600}
      priority // Load immediately
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

**Font Optimization:**
```typescript
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

**Bundle Analysis:**
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    bundlePagesRouterDependencies: true,
  },
  
  // Bundle analyzer
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
        })
      );
    }
    
    return config;
  },
};

module.exports = nextConfig;
```

---

## Web Security

### 1. Common Vulnerabilities

**Cross-Site Scripting (XSS):**
```typescript
// Vulnerable code
function UnsafeComponent({ userInput }: { userInput: string }) {
  return <div dangerouslySetInnerHTML={{ __html: userInput }} />;
}

// Safe alternatives
function SafeComponent({ userInput }: { userInput: string }) {
  // React automatically escapes content
  return <div>{userInput}</div>;
}

// For trusted HTML, sanitize first
import DOMPurify from 'dompurify';

function SafeHTMLComponent({ trustedHTML }: { trustedHTML: string }) {
  const sanitized = DOMPurify.sanitize(trustedHTML);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```**Cross-Si
te Request Forgery (CSRF):**
```typescript
// CSRF protection with tokens
export async function createPost(formData: FormData) {
  'use server';
  
  const token = formData.get('csrf_token') as string;
  
  // Verify CSRF token
  if (!verifyCSRFToken(token)) {
    throw new Error('Invalid CSRF token');
  }
  
  // Process the request
  const title = formData.get('title') as string;
  // ... rest of the logic
}

// Client-side CSRF token handling
function PostForm() {
  const [csrfToken, setCsrfToken] = useState('');
  
  useEffect(() => {
    // Fetch CSRF token
    fetch('/api/csrf-token')
      .then(res => res.json())
      .then(data => setCsrfToken(data.token));
  }, []);
  
  return (
    <form action={createPost}>
      <input type="hidden" name="csrf_token" value={csrfToken} />
      <input name="title" placeholder="Post title" />
      <button type="submit">Create</button>
    </form>
  );
}
```

**Content Security Policy (CSP):**
```typescript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://api.example.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

### 2. Authentication & Authorization

**JWT Implementation:**
```typescript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET!;
  private static readonly JWT_EXPIRES_IN = '7d';

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(user: User): string {
    return jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }

  static verifyToken(token: string): User | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      return {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (error) {
      return null;
    }
  }
}

// Middleware for protected routes
export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const user = AuthService.verifyToken(token);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Add user to request
    (req as any).user = user;
    
    return handler(req, res);
  };
}
```

**Role-Based Access Control:**
```typescript
// Permission system
type Permission = 'read' | 'write' | 'delete' | 'admin';
type Role = 'user' | 'moderator' | 'admin';

const rolePermissions: Record<Role, Permission[]> = {
  user: ['read'],
  moderator: ['read', 'write'],
  admin: ['read', 'write', 'delete', 'admin'],
};

export function hasPermission(userRole: Role, requiredPermission: Permission): boolean {
  return rolePermissions[userRole].includes(requiredPermission);
}

// React hook for permissions
export function usePermissions() {
  const { user } = useAuth();
  
  return {
    canRead: hasPermission(user?.role || 'user', 'read'),
    canWrite: hasPermission(user?.role || 'user', 'write'),
    canDelete: hasPermission(user?.role || 'user', 'delete'),
    isAdmin: hasPermission(user?.role || 'user', 'admin'),
  };
}

// Protected component
function AdminPanel() {
  const { isAdmin } = usePermissions();
  
  if (!isAdmin) {
    return <div>Access denied</div>;
  }
  
  return <div>Admin content</div>;
}
```---


## HTML5 & Semantic Web

### 1. Semantic HTML Elements

**Document Structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Semantic HTML Example</title>
</head>
<body>
  <header>
    <nav>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h1>Article Title</h1>
        <p>Published on <time datetime="2024-01-15">January 15, 2024</time></p>
      </header>
      
      <section>
        <h2>Introduction</h2>
        <p>Article content...</p>
      </section>
      
      <section>
        <h2>Main Content</h2>
        <p>More content...</p>
        
        <figure>
          <img src="chart.png" alt="Sales data visualization">
          <figcaption>Q4 2024 Sales Performance</figcaption>
        </figure>
      </section>
      
      <footer>
        <p>Tags: 
          <span class="tag">HTML</span>
          <span class="tag">Semantic</span>
        </p>
      </footer>
    </article>

    <aside>
      <h3>Related Articles</h3>
      <ul>
        <li><a href="/article1">Understanding CSS Grid</a></li>
        <li><a href="/article2">Modern JavaScript Features</a></li>
      </ul>
    </aside>
  </main>

  <footer>
    <p>&copy; 2024 Company Name. All rights reserved.</p>
  </footer>
</body>
</html>
```

### 2. Accessibility (a11y)

**ARIA Attributes:**
```html
<!-- Landmarks -->
<nav role="navigation" aria-label="Main navigation">
  <ul>
    <li><a href="/" aria-current="page">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<!-- Form accessibility -->
<form>
  <fieldset>
    <legend>Personal Information</legend>
    
    <label for="name">Full Name *</label>
    <input 
      type="text" 
      id="name" 
      name="name" 
      required 
      aria-describedby="name-help"
      aria-invalid="false"
    >
    <div id="name-help">Enter your first and last name</div>
    
    <label for="email">Email Address *</label>
    <input 
      type="email" 
      id="email" 
      name="email" 
      required
      aria-describedby="email-error"
    >
    <div id="email-error" role="alert" aria-live="polite"></div>
  </fieldset>
</form>

<!-- Interactive elements -->
<button 
  type="button"
  aria-expanded="false"
  aria-controls="dropdown-menu"
  aria-haspopup="true"
>
  Menu
</button>

<ul id="dropdown-menu" role="menu" aria-hidden="true">
  <li role="menuitem"><a href="/profile">Profile</a></li>
  <li role="menuitem"><a href="/settings">Settings</a></li>
  <li role="menuitem"><a href="/logout">Logout</a></li>
</ul>

<!-- Skip links -->
<a href="#main-content" class="skip-link">Skip to main content</a>
```

**React Accessibility:**
```typescript
import { useRef, useEffect, useState } from 'react';

// Focus management
function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
}

// Accessible form component
function AccessibleForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) 
          ? '' 
          : 'Please enter a valid email address';
      case 'password':
        return value.length >= 8 
          ? '' 
          : 'Password must be at least 8 characters';
      default:
        return '';
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  return (
    <form noValidate>
      <div>
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          onBlur={handleBlur}
          aria-describedby={errors.email ? 'email-error' : 'email-help'}
          aria-invalid={touched.email && !!errors.email}
        />
        <div id="email-help">We'll never share your email</div>
        {touched.email && errors.email && (
          <div id="email-error" role="alert" aria-live="polite">
            {errors.email}
          </div>
        )}
      </div>
    </form>
  );
}
```---

## M
odern CSS & Styling

### 1. CSS Grid & Flexbox

**CSS Grid Layouts:**
```css
/* Grid container */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-template-rows: auto 1fr auto;
  grid-template-areas: 
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  gap: 1rem;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }

/* Responsive grid */
@media (max-width: 768px) {
  .grid-container {
    grid-template-areas: 
      "header"
      "main"
      "sidebar"
      "aside"
      "footer";
    grid-template-columns: 1fr;
  }
}

/* Advanced grid techniques */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.featured-card {
  grid-column: span 2;
  grid-row: span 2;
}

/* Subgrid (modern browsers) */
.nested-grid {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: span 3;
}
```

**Flexbox Patterns:**
```css
/* Flex container */
.flex-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

/* Common flex patterns */
.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.sidebar-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  flex: 0 0 250px; /* Don't grow, don't shrink, 250px base */
}

.main-content {
  flex: 1; /* Take remaining space */
}

/* Responsive flex */
.responsive-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.flex-item {
  flex: 1 1 300px; /* Grow, shrink, 300px minimum */
}

/* Flex utilities */
.flex-grow { flex-grow: 1; }
.flex-shrink-0 { flex-shrink: 0; }
.flex-basis-auto { flex-basis: auto; }
```

### 2. Modern CSS Features

**CSS Custom Properties (Variables):**
```css
:root {
  /* Color system */
  --color-primary: #3b82f6;
  --color-primary-dark: #1d4ed8;
  --color-secondary: #64748b;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  
  /* Typography */
  --font-family-sans: 'Inter', system-ui, sans-serif;
  --font-family-mono: 'Fira Code', monospace;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-8: 2rem;
  --space-16: 4rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* Border radius */
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-full: 9999px;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #60a5fa;
    --color-secondary: #94a3b8;
  }
}

/* Usage */
.button {
  background-color: var(--color-primary);
  color: white;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-family: var(--font-family-sans);
  box-shadow: var(--shadow-sm);
}
```

**Container Queries:**
```css
/* Container query setup */
.card-container {
  container-type: inline-size;
  container-name: card;
}

.card {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

/* Container-based responsive design */
@container card (min-width: 300px) {
  .card {
    display: flex;
    gap: 1rem;
  }
  
  .card-image {
    flex: 0 0 100px;
  }
  
  .card-content {
    flex: 1;
  }
}

@container card (min-width: 500px) {
  .card {
    padding: 2rem;
  }
  
  .card-title {
    font-size: 1.5rem;
  }
}
```

**CSS Logical Properties:**
```css
/* Traditional properties */
.old-way {
  margin-left: 1rem;
  margin-right: 1rem;
  border-left: 1px solid #ccc;
  text-align: left;
}

/* Logical properties (RTL-friendly) */
.new-way {
  margin-inline: 1rem; /* margin-left + margin-right */
  border-inline-start: 1px solid #ccc; /* border-left in LTR, border-right in RTL */
  text-align: start; /* left in LTR, right in RTL */
}

/* Complete logical property mapping */
.logical-layout {
  /* Block dimension (vertical in horizontal writing mode) */
  margin-block-start: 1rem; /* margin-top */
  margin-block-end: 1rem;   /* margin-bottom */
  padding-block: 2rem;      /* padding-top + padding-bottom */
  
  /* Inline dimension (horizontal in horizontal writing mode) */
  margin-inline-start: 1rem; /* margin-left in LTR */
  margin-inline-end: 1rem;   /* margin-right in LTR */
  padding-inline: 2rem;      /* padding-left + padding-right */
  
  /* Size properties */
  inline-size: 100%;  /* width */
  block-size: 200px;  /* height */
  
  /* Position properties */
  inset-block-start: 0;  /* top */
  inset-inline-start: 0; /* left in LTR */
}
```### 3. CSS
-in-JS and Styling Solutions

**Styled Components (React):**
```typescript
import styled, { css, ThemeProvider } from 'styled-components';

// Theme definition
const theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    success: '#10b981',
    error: '#ef4444',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
};

// Styled components
const Button = styled.button<{ variant?: 'primary' | 'secondary'; size?: 'sm' | 'md' | 'lg' }>`
  padding: ${props => {
    switch (props.size) {
      case 'sm': return `${props.theme.spacing.xs} ${props.theme.spacing.sm}`;
      case 'lg': return `${props.theme.spacing.md} ${props.theme.spacing.lg}`;
      default: return `${props.theme.spacing.sm} ${props.theme.spacing.md}`;
    }
  }};
  
  background-color: ${props => 
    props.variant === 'secondary' 
      ? props.theme.colors.secondary 
      : props.theme.colors.primary
  };
  
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  ${props => props.variant === 'secondary' && css`
    background-color: transparent;
    color: ${props.theme.colors.secondary};
    border: 1px solid ${props.theme.colors.secondary};
  `}
`;

const Card = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  padding: ${props => props.theme.spacing.lg};
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing.xl};
  }
`;

// Usage
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Card>
        <Button variant="primary" size="md">
          Primary Button
        </Button>
        <Button variant="secondary" size="sm">
          Secondary Button
        </Button>
      </Card>
    </ThemeProvider>
  );
}
```

**Tailwind CSS with React:**
```typescript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};

// Component with Tailwind
function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl">
      <div className="aspect-w-16 aspect-h-9 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-3">
          {product.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-brand-600">
            ${product.price}
          </span>
          
          <button className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

// Custom Tailwind component
function Badge({ children, variant = 'default' }: BadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
```

---

## Performance Optimization

### 1. Core Web Vitals

**Largest Contentful Paint (LCP):**
```typescript
// Image optimization for LCP
function HeroSection() {
  return (
    <section className="hero">
      <Image
        src="/hero-image.jpg"
        alt="Hero image"
        width={1200}
        height={600}
        priority // Critical for LCP
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,..."
        sizes="100vw"
      />
    </section>
  );
}

// Font optimization
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Improves LCP
  preload: true,
});
```

**First Input Delay (FID) / Interaction to Next Paint (INP):**
```typescript
// Code splitting for better FID
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <div>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}

// Debouncing for better INP
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  useEffect(() => {
    if (debouncedQuery) {
      // Perform search
      searchAPI(debouncedQuery);
    }
  }, [debouncedQuery]);
  
  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}

// Virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window';

function VirtualizedList({ items }: { items: any[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <ItemComponent item={items[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={80}
      width="100%"
    >
      {Row}
    </List>
  );
}
```**Cu
mulative Layout Shift (CLS):**
```typescript
// Prevent layout shift with proper sizing
function ImageWithAspectRatio({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="aspect-w-16 aspect-h-9">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}

// Reserve space for dynamic content
function DynamicContent() {
  const [content, setContent] = useState<string | null>(null);
  
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      {content ? (
        <div>{content}</div>
      ) : (
        <div className="animate-pulse bg-gray-200 h-32 w-full rounded" />
      )}
    </div>
  );
}
```

### 2. Bundle Optimization

**Code Splitting Strategies:**
```typescript
// Route-based splitting (Next.js automatic)
// pages/dashboard.tsx - automatically split

// Component-based splitting
const Chart = lazy(() => 
  import('./Chart').then(module => ({ default: module.Chart }))
);

// Library splitting
const DatePicker = lazy(() => 
  import('react-datepicker').then(module => ({ 
    default: module.default 
  }))
);

// Conditional loading
function AdminPanel() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [AdvancedSettings, setAdvancedSettings] = useState<React.ComponentType | null>(null);
  
  const loadAdvancedSettings = async () => {
    if (!AdvancedSettings) {
      const module = await import('./AdvancedSettings');
      setAdvancedSettings(() => module.default);
    }
    setShowAdvanced(true);
  };
  
  return (
    <div>
      <button onClick={loadAdvancedSettings}>
        Show Advanced Settings
      </button>
      
      {showAdvanced && AdvancedSettings && (
        <Suspense fallback={<div>Loading...</div>}>
          <AdvancedSettings />
        </Suspense>
      )}
    </div>
  );
}
```

**Tree Shaking:**
```typescript
// Good: Named imports (tree-shakeable)
import { debounce, throttle } from 'lodash-es';
import { format, parseISO } from 'date-fns';

// Bad: Default imports (not tree-shakeable)
import _ from 'lodash';
import dateFns from 'date-fns';

// Webpack bundle analyzer configuration
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  webpack: (config, { isServer }) => {
    // Analyze bundle size
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
});
```

### 3. Caching Strategies

**Browser Caching:**
```typescript
// Service Worker for caching
// public/sw.js
const CACHE_NAME = 'app-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Register service worker
// app/layout.tsx
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  }
}, []);
```

**HTTP Caching Headers:**
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
    ];
  },
};
```

---

## Interview Practice Problems

### 1. JavaScript Coding Challenges

**Problem 1: Implement Array.prototype.flat()**
```typescript
function flattenArray(arr: any[], depth: number = 1): any[] {
  const result: any[] = [];
  
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flattenArray(item, depth - 1));
    } else {
      result.push(item);
    }
  }
  
  return result;
}

// Test cases
console.log(flattenArray([1, [2, 3], [4, [5, 6]]], 1)); // [1, 2, 3, 4, [5, 6]]
console.log(flattenArray([1, [2, 3], [4, [5, 6]]], 2)); // [1, 2, 3, 4, 5, 6]
```

**Problem 2: Deep Object Comparison**
```typescript
function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  
  if (obj1 == null || obj2 == null) return false;
  
  if (typeof obj1 !== typeof obj2) return false;
  
  if (typeof obj1 !== 'object') return obj1 === obj2;
  
  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }
  
  return true;
}

// Test cases
console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })); // true
console.log(deepEqual([1, 2, [3, 4]], [1, 2, [3, 4]])); // true
console.log(deepEqual({ a: 1 }, { a: 1, b: undefined })); // false
```

**Problem 3: Function Currying**
```typescript
function curry<T extends any[], R>(
  fn: (...args: T) => R
): (...args: Partial<T>) => any {
  return function curried(...args: any[]): any {
    if (args.length >= fn.length) {
      return fn.apply(this, args as T);
    } else {
      return function (...nextArgs: any[]) {
        return curried.apply(this, [...args, ...nextArgs]);
      };
    }
  };
}

// Usage
const add = (a: number, b: number, c: number) => a + b + c;
const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
```### 2. Rea
ct Coding Challenges

**Problem 1: Custom useAsync Hook**
```typescript
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: React.DependencyList = []
): AsyncState<T> & { execute: () => Promise<void> } {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await asyncFunction();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error : new Error('Unknown error') 
      });
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, execute };
}

// Usage
function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, error, execute } = useAsync(
    () => fetchUser(userId),
    [userId]
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={execute}>Refresh</button>
    </div>
  );
}
```

**Problem 2: Infinite Scroll Component**
```typescript
interface InfiniteScrollProps<T> {
  items: T[];
  loadMore: () => Promise<void>;
  hasMore: boolean;
  loading: boolean;
  renderItem: (item: T, index: number) => React.ReactNode;
  threshold?: number;
}

function InfiniteScroll<T>({
  items,
  loadMore,
  hasMore,
  loading,
  renderItem,
  threshold = 100,
}: InfiniteScrollProps<T>) {
  const [isFetching, setIsFetching] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading && !isFetching) {
          setIsFetching(true);
          try {
            await loadMore();
          } finally {
            setIsFetching(false);
          }
        }
      },
      { rootMargin: `${threshold}px` }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasMore, loading, isFetching, loadMore, threshold]);

  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          {renderItem(item, index)}
        </div>
      ))}
      
      {hasMore && (
        <div ref={sentinelRef} className="loading-sentinel">
          {(loading || isFetching) && <div>Loading more...</div>}
        </div>
      )}
    </div>
  );
}

// Usage
function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMore = async () => {
    setLoading(true);
    try {
      const newPosts = await fetchPosts(page);
      setPosts(prev => [...prev, ...newPosts]);
      setPage(prev => prev + 1);
      setHasMore(newPosts.length === 10); // Assuming 10 posts per page
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <InfiniteScroll
      items={posts}
      loadMore={loadMore}
      hasMore={hasMore}
      loading={loading}
      renderItem={(post) => <PostCard key={post.id} post={post} />}
    />
  );
}
```

**Problem 3: Form Validation Hook**
```typescript
interface ValidationRule<T> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
}

interface FormConfig<T> {
  [K in keyof T]: ValidationRule<T[K]>;
}

function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationConfig: FormConfig<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = (name: keyof T, value: any): string | null => {
    const rules = validationConfig[name];
    
    if (rules.required && (!value || value.toString().trim() === '')) {
      return `${String(name)} is required`;
    }
    
    if (value && rules.minLength && value.toString().length < rules.minLength) {
      return `${String(name)} must be at least ${rules.minLength} characters`;
    }
    
    if (value && rules.maxLength && value.toString().length > rules.maxLength) {
      return `${String(name)} must be no more than ${rules.maxLength} characters`;
    }
    
    if (value && rules.pattern && !rules.pattern.test(value.toString())) {
      return `${String(name)} format is invalid`;
    }
    
    if (rules.custom) {
      return rules.custom(value);
    }
    
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const name in validationConfig) {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error || undefined }));
    }
  };

  const handleBlur = (name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error || undefined }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
}

// Usage
interface LoginForm {
  email: string;
  password: string;
}

function LoginComponent() {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    isValid,
  } = useFormValidation<LoginForm>(
    { email: '', password: '' },
    {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      password: {
        required: true,
        minLength: 8,
        custom: (value) => {
          if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            return 'Password must contain uppercase, lowercase, and number';
          }
          return null;
        },
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form is valid:', values);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          placeholder="Email"
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>
      
      <div>
        <input
          type="password"
          value={values.password}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
          placeholder="Password"
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>
      
      <button type="submit" disabled={!isValid}>
        Login
      </button>
    </form>
  );
}
```---


## System Design for Frontend

### 1. Frontend Architecture Patterns

**Micro-Frontend Architecture:**
```typescript
// Module Federation (Webpack 5)
// webpack.config.js for Shell App
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        dashboard: 'dashboard@http://localhost:3001/remoteEntry.js',
        profile: 'profile@http://localhost:3002/remoteEntry.js',
      },
    }),
  ],
};

// Shell App Component
import { Suspense, lazy } from 'react';

const Dashboard = lazy(() => import('dashboard/Dashboard'));
const Profile = lazy(() => import('profile/Profile'));

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/dashboard" 
          element={
            <Suspense fallback={<div>Loading Dashboard...</div>}>
              <Dashboard />
            </Suspense>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <Suspense fallback={<div>Loading Profile...</div>}>
              <Profile />
            </Suspense>
          } 
        />
      </Routes>
    </Router>
  );
}

// Micro-frontend Communication
class EventBus {
  private events: Map<string, Function[]> = new Map();

  subscribe(event: string, callback: Function) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }

  unsubscribe(event: string, callback: Function) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event: string, data?: any) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
}

// Global event bus
window.eventBus = new EventBus();
```

**Component-Based Architecture:**
```typescript
// Design System Structure
interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Base components
interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

function Button({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  const baseClasses = 'font-medium rounded focus:outline-none focus:ring-2';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Compound components
interface ModalProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

function Modal({ isOpen, onClose, children, className = '' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
        <div className={`relative bg-white rounded-lg shadow-xl ${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

Modal.Header = function ModalHeader({ children, className = '' }: ComponentProps) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

Modal.Body = function ModalBody({ children, className = '' }: ComponentProps) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

Modal.Footer = function ModalFooter({ children, className = '' }: ComponentProps) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 flex justify-end space-x-2 ${className}`}>
      {children}
    </div>
  );
};

// Usage
function ConfirmDialog({ isOpen, onClose, onConfirm }: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <h3 className="text-lg font-medium">Confirm Action</h3>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to proceed?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
```

### 2. State Management Architecture

**Redux Toolkit with RTK Query:**
```typescript
// store/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Post'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      providesTags: ['User'],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation<User, Partial<User> & Pick<User, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `users/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery, useUpdateUserMutation } = api;

// store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```**Zust
and for Simpler State Management:**
```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        login: (user, token) => set({ user, token, isAuthenticated: true }),
        logout: () => set({ user: null, token: null, isAuthenticated: false }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ token: state.token, user: state.user }),
      }
    )
  )
);

// Usage in components
function LoginForm() {
  const { login } = useAuthStore();
  
  const handleSubmit = async (credentials: LoginCredentials) => {
    const { user, token } = await authAPI.login(credentials);
    login(user, token);
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}

function UserProfile() {
  const { user, logout } = useAuthStore();
  
  if (!user) return <div>Not logged in</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 3. Performance Architecture

**Virtual DOM Optimization:**
```typescript
// React.memo for component optimization
const ExpensiveComponent = React.memo(function ExpensiveComponent({ 
  data, 
  onUpdate 
}: { 
  data: ComplexData; 
  onUpdate: (id: string) => void; 
}) {
  const processedData = useMemo(() => {
    return data.items.map(item => ({
      ...item,
      computed: expensiveCalculation(item),
    }));
  }, [data.items]);

  const handleUpdate = useCallback((id: string) => {
    onUpdate(id);
  }, [onUpdate]);

  return (
    <div>
      {processedData.map(item => (
        <ItemComponent 
          key={item.id} 
          item={item} 
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
});

// Custom comparison for React.memo
const ItemComponent = React.memo(function ItemComponent({ 
  item, 
  onUpdate 
}: ItemProps) {
  return (
    <div onClick={() => onUpdate(item.id)}>
      {item.name}: {item.computed}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison logic
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.name === nextProps.item.name &&
    prevProps.item.computed === nextProps.item.computed
  );
});
```

**Code Splitting Strategy:**
```typescript
// Route-based splitting
const HomePage = lazy(() => import('../pages/HomePage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));

// Feature-based splitting
const AdminPanel = lazy(() => 
  import('../features/admin/AdminPanel').then(module => ({
    default: module.AdminPanel
  }))
);

// Library splitting with dynamic imports
async function loadChartLibrary() {
  const [
    { Chart },
    { CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend }
  ] = await Promise.all([
    import('chart.js/auto'),
    import('chart.js')
  ]);
  
  Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  return Chart;
}

function ChartComponent({ data }: { data: ChartData }) {
  const [Chart, setChart] = useState<any>(null);
  
  useEffect(() => {
    loadChartLibrary().then(setChart);
  }, []);
  
  if (!Chart) return <div>Loading chart...</div>;
  
  return <Chart data={data} />;
}
```

---

## Mind Maps & Visual Learning

### JavaScript Concepts Mind Map

```
JavaScript Fundamentals
├── Data Types
│   ├── Primitives
│   │   ├── number
│   │   ├── string
│   │   ├── boolean
│   │   ├── null
│   │   ├── undefined
│   │   ├── symbol
│   │   └── bigint
│   └── Reference Types
│       ├── Object
│       ├── Array
│       └── Function
├── Variables
│   ├── var (function-scoped, hoisted)
│   ├── let (block-scoped, TDZ)
│   └── const (block-scoped, immutable)
├── Functions
│   ├── Function Declarations
│   ├── Function Expressions
│   ├── Arrow Functions
│   ├── IIFE
│   └── Higher-Order Functions
├── Scope & Closures
│   ├── Global Scope
│   ├── Function Scope
│   ├── Block Scope
│   ├── Lexical Scope
│   └── Closures
├── Prototypes
│   ├── Prototype Chain
│   ├── Constructor Functions
│   ├── Object.create()
│   └── ES6 Classes
├── Asynchronous JavaScript
│   ├── Callbacks
│   ├── Promises
│   ├── Async/Await
│   └── Event Loop
└── Modern Features (ES6+)
    ├── Destructuring
    ├── Spread/Rest
    ├── Template Literals
    ├── Modules
    └── Generators
```

### React Ecosystem Mind Map

```
React Ecosystem
├── Core Concepts
│   ├── Components
│   │   ├── Functional Components
│   │   ├── Class Components
│   │   └── Component Lifecycle
│   ├── JSX
│   ├── Props
│   ├── State
│   └── Events
├── Hooks
│   ├── Built-in Hooks
│   │   ├── useState
│   │   ├── useEffect
│   │   ├── useContext
│   │   ├── useReducer
│   │   ├── useMemo
│   │   ├── useCallback
│   │   └── useRef
│   └── Custom Hooks
├── State Management
│   ├── Local State
│   ├── Context API
│   ├── Redux/RTK
│   ├── Zustand
│   └── Jotai
├── Routing
│   ├── React Router
│   ├── Next.js Router
│   └── Reach Router
├── Styling
│   ├── CSS Modules
│   ├── Styled Components
│   ├── Emotion
│   └── Tailwind CSS
├── Testing
│   ├── Jest
│   ├── React Testing Library
│   ├── Enzyme
│   └── Cypress
└── Performance
    ├── Code Splitting
    ├── Lazy Loading
    ├── Memoization
    └── Virtual DOM
```

### Frontend Performance Optimization Flow

```
Performance Optimization
├── Measurement
│   ├── Core Web Vitals
│   │   ├── LCP (Largest Contentful Paint)
│   │   ├── FID (First Input Delay)
│   │   └── CLS (Cumulative Layout Shift)
│   ├── Tools
│   │   ├── Lighthouse
│   │   ├── WebPageTest
│   │   ├── Chrome DevTools
│   │   └── Real User Monitoring
│   └── Metrics
│       ├── TTFB (Time to First Byte)
│       ├── FCP (First Contentful Paint)
│       └── TTI (Time to Interactive)
├── Loading Performance
│   ├── Resource Optimization
│   │   ├── Image Optimization
│   │   ├── Font Loading
│   │   ├── CSS Optimization
│   │   └── JavaScript Bundling
│   ├── Caching Strategies
│   │   ├── Browser Cache
│   │   ├── CDN
│   │   ├── Service Workers
│   │   └── HTTP/2 Push
│   └── Code Splitting
│       ├── Route-based
│       ├── Component-based
│       └── Dynamic Imports
├── Runtime Performance
│   ├── JavaScript Optimization
│   │   ├── Avoid Long Tasks
│   │   ├── Debouncing/Throttling
│   │   ├── Web Workers
│   │   └── Memory Management
│   ├── Rendering Optimization
│   │   ├── Virtual Scrolling
│   │   ├── Intersection Observer
│   │   ├── RequestAnimationFrame
│   │   └── CSS Containment
│   └── React Optimization
│       ├── React.memo
│       ├── useMemo/useCallback
│       ├── Code Splitting
│       └── Concurrent Features
└── Network Performance
    ├── HTTP/2 & HTTP/3
    ├── Resource Hints
    │   ├── dns-prefetch
    │   ├── preconnect
    │   ├── prefetch
    │   └── preload
    ├── Compression
    │   ├── Gzip
    │   ├── Brotli
    │   └── Image Formats
    └── API Optimization
        ├── GraphQL
        ├── REST Optimization
        ├── Caching
        └── Pagination
```

---

## Interview Preparation Checklist

### Technical Knowledge Areas

**JavaScript Fundamentals (Must Know)**
- [ ] Variables, data types, and type coercion
- [ ] Scope, hoisting, and closures
- [ ] Prototypes and inheritance
- [ ] `this` keyword and binding rules
- [ ] Event loop and asynchronous programming
- [ ] ES6+ features and modern syntax
- [ ] Error handling and debugging

**React & Modern Frontend (Must Know)**
- [ ] Component lifecycle and hooks
- [ ] State management patterns
- [ ] Performance optimization techniques
- [ ] Testing strategies and tools
- [ ] Build tools and bundlers
- [ ] CSS-in-JS and styling solutions

**System Design (Senior Level)**
- [ ] Frontend architecture patterns
- [ ] Micro-frontend strategies
- [ ] Performance optimization at scale
- [ ] Caching strategies
- [ ] Security best practices
- [ ] Accessibility standards

### Practice Problems by Company

**Meta/Facebook Style Questions**
- Implement a social media feed with infinite scroll
- Build a real-time chat component
- Create a photo gallery with lazy loading
- Design a notification system

**Google Style Questions**
- Implement autocomplete with debouncing
- Build a calendar component
- Create a data visualization dashboard
- Design a search interface

**Microsoft Style Questions**
- Build a collaborative text editor
- Implement a file explorer interface
- Create a dashboard with widgets
- Design an email client interface

### Behavioral Interview Preparation

**Common Questions**
- Tell me about a challenging project you worked on
- How do you handle conflicting requirements?
- Describe a time you had to learn a new technology quickly
- How do you ensure code quality in your team?
- What's your approach to debugging complex issues?

**STAR Method Examples**
- **Situation**: Describe the context
- **Task**: Explain what needed to be done
- **Action**: Detail what you did
- **Result**: Share the outcome and learnings

---

*This comprehensive guide covers all essential frontend technologies and concepts needed for Big Tech interviews in 2025-2026. Practice these concepts regularly and build projects that demonstrate your understanding of modern web development principles.*

**Next Steps:**
1. Practice coding problems daily
2. Build portfolio projects using these technologies
3. Contribute to open source projects
4. Stay updated with latest web standards
5. Mock interview practice with peers

---


## Advanced JavaScript Patterns

### 1. Design Patterns in JavaScript

**Singleton Pattern:**
```typescript
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connection: any;

  private constructor() {
    this.connection = this.createConnection();
  }

  private createConnection() {
    console.log('Creating database connection...');
    return { connected: true };
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public query(sql: string) {
    console.log(`Executing: ${sql}`);
    return this.connection;
  }
}

// Usage
const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();
console.log(db1 === db2); // true - same instance
```

**Observer Pattern (Pub/Sub):**
```typescript
interface Observer<T> {
  update(data: T): void;
}

class Subject<T> {
  private observers: Observer<T>[] = [];

  subscribe(observer: Observer<T>): () => void {
    this.observers.push(observer);
    
    // Return unsubscribe function
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  notify(data: T): void {
    this.observers.forEach(observer => observer.update(data));
  }
}

// Real-world example: Stock price tracker
interface StockPrice {
  symbol: string;
  price: number;
  timestamp: Date;
}

class StockPriceSubject extends Subject<StockPrice> {
  private currentPrice: StockPrice | null = null;

  updatePrice(price: StockPrice) {
    this.currentPrice = price;
    this.notify(price);
  }
}

class StockDisplay implements Observer<StockPrice> {
  constructor(private name: string) {}

  update(data: StockPrice): void {
    console.log(`${this.name} received: ${data.symbol} = $${data.price}`);
  }
}

// Usage
const stockSubject = new StockPriceSubject();
const display1 = new StockDisplay('Dashboard');
const display2 = new StockDisplay('Mobile App');

const unsubscribe1 = stockSubject.subscribe(display1);
const unsubscribe2 = stockSubject.subscribe(display2);

stockSubject.updatePrice({ symbol: 'AAPL', price: 150.25, timestamp: new Date() });
// Dashboard received: AAPL = $150.25
// Mobile App received: AAPL = $150.25
```

**Factory Pattern:**
```typescript
interface Vehicle {
  type: string;
  wheels: number;
  drive(): void;
}

class Car implements Vehicle {
  type = 'Car';
  wheels = 4;
  
  drive(): void {
    console.log('Driving a car with 4 wheels');
  }
}

class Motorcycle implements Vehicle {
  type = 'Motorcycle';
  wheels = 2;
  
  drive(): void {
    console.log('Riding a motorcycle with 2 wheels');
  }
}

class Truck implements Vehicle {
  type = 'Truck';
  wheels = 6;
  
  drive(): void {
    console.log('Driving a truck with 6 wheels');
  }
}

class VehicleFactory {
  static createVehicle(type: 'car' | 'motorcycle' | 'truck'): Vehicle {
    switch (type) {
      case 'car':
        return new Car();
      case 'motorcycle':
        return new Motorcycle();
      case 'truck':
        return new Truck();
      default:
        throw new Error(`Unknown vehicle type: ${type}`);
    }
  }
}

// Usage
const car = VehicleFactory.createVehicle('car');
const motorcycle = VehicleFactory.createVehicle('motorcycle');
car.drive(); // Driving a car with 4 wheels
motorcycle.drive(); // Riding a motorcycle with 2 wheels
```

**Strategy Pattern:**
```typescript
interface PaymentStrategy {
  pay(amount: number): void;
}

class CreditCardPayment implements PaymentStrategy {
  constructor(
    private cardNumber: string,
    private cvv: string
  ) {}

  pay(amount: number): void {
    console.log(`Paid $${amount} using Credit Card ending in ${this.cardNumber.slice(-4)}`);
  }
}

class PayPalPayment implements PaymentStrategy {
  constructor(private email: string) {}

  pay(amount: number): void {
    console.log(`Paid $${amount} using PayPal account ${this.email}`);
  }
}

class CryptoPayment implements PaymentStrategy {
  constructor(private walletAddress: string) {}

  pay(amount: number): void {
    console.log(`Paid $${amount} using Crypto wallet ${this.walletAddress}`);
  }
}

class ShoppingCart {
  private items: Array<{ name: string; price: number }> = [];
  private paymentStrategy?: PaymentStrategy;

  addItem(name: string, price: number): void {
    this.items.push({ name, price });
  }

  setPaymentStrategy(strategy: PaymentStrategy): void {
    this.paymentStrategy = strategy;
  }

  checkout(): void {
    const total = this.items.reduce((sum, item) => sum + item.price, 0);
    
    if (!this.paymentStrategy) {
      throw new Error('Payment strategy not set');
    }

    this.paymentStrategy.pay(total);
  }
}

// Usage
const cart = new ShoppingCart();
cart.addItem('Laptop', 1200);
cart.addItem('Mouse', 25);

// Pay with credit card
cart.setPaymentStrategy(new CreditCardPayment('1234-5678-9012-3456', '123'));
cart.checkout(); // Paid $1225 using Credit Card ending in 3456

// Change to PayPal
cart.setPaymentStrategy(new PayPalPayment('user@example.com'));
cart.checkout(); // Paid $1225 using PayPal account user@example.com
```

**Decorator Pattern:**
```typescript
interface Coffee {
  cost(): number;
  description(): string;
}

class SimpleCoffee implements Coffee {
  cost(): number {
    return 5;
  }

  description(): string {
    return 'Simple coffee';
  }
}

// Decorators
class MilkDecorator implements Coffee {
  constructor(private coffee: Coffee) {}

  cost(): number {
    return this.coffee.cost() + 1.5;
  }

  description(): string {
    return `${this.coffee.description()}, milk`;
  }
}

class SugarDecorator implements Coffee {
  constructor(private coffee: Coffee) {}

  cost(): number {
    return this.coffee.cost() + 0.5;
  }

  description(): string {
    return `${this.coffee.description()}, sugar`;
  }
}

class WhipDecorator implements Coffee {
  constructor(private coffee: Coffee) {}

  cost(): number {
    return this.coffee.cost() + 2;
  }

  description(): string {
    return `${this.coffee.description()}, whipped cream`;
  }
}

// Usage
let coffee: Coffee = new SimpleCoffee();
console.log(`${coffee.description()} - $${coffee.cost()}`);
// Simple coffee - $5

coffee = new MilkDecorator(coffee);
console.log(`${coffee.description()} - $${coffee.cost()}`);
// Simple coffee, milk - $6.5

coffee = new SugarDecorator(coffee);
coffee = new WhipDecorator(coffee);
console.log(`${coffee.description()} - $${coffee.cost()}`);
// Simple coffee, milk, sugar, whipped cream - $9
```

### 2. Advanced Async Patterns

**Promise Pool (Concurrency Control):**
```typescript
class PromisePool<T> {
  private queue: Array<() => Promise<T>> = [];
  private running = 0;
  private results: T[] = [];

  constructor(private concurrency: number) {}

  async add(promiseFactory: () => Promise<T>): Promise<void> {
    this.queue.push(promiseFactory);
  }

  async run(): Promise<T[]> {
    const promises: Promise<void>[] = [];

    while (this.queue.length > 0 || this.running > 0) {
      while (this.running < this.concurrency && this.queue.length > 0) {
        const promiseFactory = this.queue.shift()!;
        this.running++;

        const promise = promiseFactory()
          .then(result => {
            this.results.push(result);
          })
          .finally(() => {
            this.running--;
          });

        promises.push(promise);
      }

      if (this.running >= this.concurrency) {
        await Promise.race(promises);
      }
    }

    await Promise.all(promises);
    return this.results;
  }
}

// Usage: Fetch multiple URLs with concurrency limit
async function fetchWithConcurrency(urls: string[], concurrency: number) {
  const pool = new PromisePool<Response>(concurrency);

  for (const url of urls) {
    await pool.add(() => fetch(url));
  }

  return pool.run();
}

// Example
const urls = [
  'https://api.example.com/users/1',
  'https://api.example.com/users/2',
  'https://api.example.com/users/3',
  'https://api.example.com/users/4',
  'https://api.example.com/users/5',
];

fetchWithConcurrency(urls, 2).then(responses => {
  console.log(`Fetched ${responses.length} URLs with max 2 concurrent requests`);
});
```

**Retry with Exponential Backoff:**
```typescript
interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  shouldRetry?: (error: any) => boolean;
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const {
    maxRetries,
    initialDelay,
    maxDelay,
    backoffMultiplier,
    shouldRetry = () => true,
  } = options;

  let lastError: any;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }

      console.log(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      delay = Math.min(delay * backoffMultiplier, maxDelay);
    }
  }

  throw lastError;
}

// Usage
async function fetchUserData(userId: string) {
  return retryWithBackoff(
    () => fetch(`/api/users/${userId}`).then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    }),
    {
      maxRetries: 3,
      initialDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
      shouldRetry: (error) => {
        // Only retry on network errors or 5xx status codes
        return error.message.includes('5') || error.message === 'Failed to fetch';
      },
    }
  );
}
```

**Async Queue with Priority:**
```typescript
interface QueueTask<T> {
  fn: () => Promise<T>;
  priority: number;
  resolve: (value: T) => void;
  reject: (error: any) => void;
}

class PriorityAsyncQueue {
  private queue: QueueTask<any>[] = [];
  private running = 0;

  constructor(private concurrency: number = 1) {}

  async add<T>(
    fn: () => Promise<T>,
    priority: number = 0
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, priority, resolve, reject });
      this.queue.sort((a, b) => b.priority - a.priority);
      this.process();
    });
  }

  private async process(): Promise<void> {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }

    this.running++;
    const task = this.queue.shift()!;

    try {
      const result = await task.fn();
      task.resolve(result);
    } catch (error) {
      task.reject(error);
    } finally {
      this.running--;
      this.process();
    }
  }
}

// Usage
const queue = new PriorityAsyncQueue(2);

// High priority task
queue.add(() => fetch('/api/critical-data'), 10)
  .then(data => console.log('Critical data loaded'));

// Normal priority tasks
queue.add(() => fetch('/api/user-profile'), 5)
  .then(data => console.log('User profile loaded'));

// Low priority task
queue.add(() => fetch('/api/analytics'), 1)
  .then(data => console.log('Analytics loaded'));
```

### 3. Memory Management & Performance

**Memory Leak Prevention:**
```typescript
// Bad: Memory leak with event listeners
class BadComponent {
  constructor() {
    window.addEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    console.log('Window resized');
  };
}

// Good: Proper cleanup
class GoodComponent {
  private handleResize = () => {
    console.log('Window resized');
  };

  mount() {
    window.addEventListener('resize', this.handleResize);
  }

  unmount() {
    window.removeEventListener('resize', this.handleResize);
  }
}

// React example with cleanup
function ResizeListener() {
  useEffect(() => {
    const handleResize = () => {
      console.log('Window resized');
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div>Resize the window</div>;
}
```

**WeakMap for Memory-Efficient Caching:**
```typescript
class DataCache<K extends object, V> {
  private cache = new WeakMap<K, V>();

  set(key: K, value: V): void {
    this.cache.set(key, value);
  }

  get(key: K): V | undefined {
    return this.cache.get(key);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }
}

// Usage: Cache DOM element data
const elementCache = new DataCache<HTMLElement, { clicks: number }>();

function trackClicks(element: HTMLElement) {
  element.addEventListener('click', () => {
    const data = elementCache.get(element) || { clicks: 0 };
    data.clicks++;
    elementCache.set(element, data);
    console.log(`Element clicked ${data.clicks} times`);
  });
}

// When element is removed from DOM, cache entry is automatically garbage collected
```

**Object Pool Pattern:**
```typescript
class ObjectPool<T> {
  private available: T[] = [];
  private inUse = new Set<T>();

  constructor(
    private factory: () => T,
    private reset: (obj: T) => void,
    initialSize: number = 10
  ) {
    for (let i = 0; i < initialSize; i++) {
      this.available.push(this.factory());
    }
  }

  acquire(): T {
    let obj: T;

    if (this.available.length > 0) {
      obj = this.available.pop()!;
    } else {
      obj = this.factory();
    }

    this.inUse.add(obj);
    return obj;
  }

  release(obj: T): void {
    if (this.inUse.has(obj)) {
      this.inUse.delete(obj);
      this.reset(obj);
      this.available.push(obj);
    }
  }

  get size(): { available: number; inUse: number } {
    return {
      available: this.available.length,
      inUse: this.inUse.size,
    };
  }
}

// Usage: Pool of canvas contexts for drawing
interface CanvasContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

const canvasPool = new ObjectPool<CanvasContext>(
  () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d')!;
    return { canvas, ctx };
  },
  (obj) => {
    obj.ctx.clearRect(0, 0, obj.canvas.width, obj.canvas.height);
  },
  5
);

// Acquire canvas for drawing
const canvasContext = canvasPool.acquire();
canvasContext.ctx.fillRect(10, 10, 100, 100);

// Release back to pool when done
canvasPool.release(canvasContext);
```

---


## Advanced React Patterns & Architecture

### 1. Compound Components Pattern

```typescript
// Flexible Tab component using compound pattern
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within Tabs');
  }
  return context;
}

interface TabsProps {
  defaultTab?: string;
  children: React.ReactNode;
  onChange?: (tab: string) => void;
}

function Tabs({ defaultTab, children, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || '');

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    onChange?.(tab);
  }, [onChange]);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.List = function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="tabs-list" role="tablist">{children}</div>;
};

Tabs.Tab = function Tab({ 
  value, 
  children 
}: { 
  value: string; 
  children: React.ReactNode;
}) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      className={`tab ${isActive ? 'active' : ''}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function TabPanel({ 
  value, 
  children 
}: { 
  value: string; 
  children: React.ReactNode;
}) {
  const { activeTab } = useTabs();
  
  if (activeTab !== value) return null;

  return (
    <div role="tabpanel" className="tab-panel">
      {children}
    </div>
  );
};

// Usage
function ProfilePage() {
  return (
    <Tabs defaultTab="profile" onChange={(tab) => console.log('Tab changed:', tab)}>
      <Tabs.List>
        <Tabs.Tab value="profile">Profile</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
        <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="profile">
        <ProfileContent />
      </Tabs.Panel>

      <Tabs.Panel value="settings">
        <SettingsContent />
      </Tabs.Panel>

      <Tabs.Panel value="notifications">
        <NotificationsContent />
      </Tabs.Panel>
    </Tabs>
  );
}
```

### 2. Render Props Pattern

```typescript
interface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  render: (position: MousePosition) => React.ReactNode;
}

function MouseTracker({ render }: MouseTrackerProps) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <>{render(position)}</>;
}

// Usage
function App() {
  return (
    <div>
      <h1>Move your mouse around</h1>
      
      <MouseTracker
        render={({ x, y }) => (
          <div>
            Mouse position: ({x}, {y})
          </div>
        )}
      />

      <MouseTracker
        render={({ x, y }) => (
          <div
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: 'red',
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      />
    </div>
  );
}
```

### 3. Higher-Order Components (HOC)

```typescript
// Authentication HOC
interface WithAuthProps {
  user: User | null;
  isAuthenticated: boolean;
}

function withAuth<P extends object>(
  Component: React.ComponentType<P & WithAuthProps>
) {
  return function WithAuthComponent(props: P) {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return <Component {...props} user={user} isAuthenticated={isAuthenticated} />;
  };
}

// Loading HOC
interface WithLoadingProps {
  isLoading: boolean;
}

function withLoading<P extends object>(
  Component: React.ComponentType<P>,
  LoadingComponent: React.ComponentType = () => <div>Loading...</div>
) {
  return function WithLoadingComponent(props: P & WithLoadingProps) {
    const { isLoading, ...rest } = props;

    if (isLoading) {
      return <LoadingComponent />;
    }

    return <Component {...(rest as P)} />;
  };
}

// Error Boundary HOC
interface WithErrorBoundaryProps {
  fallback?: React.ComponentType<{ error: Error }>;
}

function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  FallbackComponent: React.ComponentType<{ error: Error }> = ({ error }) => (
    <div>Error: {error.message}</div>
  )
) {
  return class WithErrorBoundary extends React.Component<
    P,
    { hasError: boolean; error: Error | null }
  > {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
      if (this.state.hasError && this.state.error) {
        return <FallbackComponent error={this.state.error} />;
      }

      return <Component {...this.props} />;
    }
  };
}

// Compose multiple HOCs
function compose<P extends object>(...hocs: Array<(component: any) => any>) {
  return (Component: React.ComponentType<P>) => {
    return hocs.reduceRight((acc, hoc) => hoc(acc), Component);
  };
}

// Usage
const EnhancedDashboard = compose(
  withAuth,
  withLoading,
  withErrorBoundary
)(Dashboard);
```

### 4. Custom Hook Patterns

**useIntersectionObserver Hook:**
```typescript
interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

function useIntersectionObserver(
  elementRef: RefObject<Element>,
  options: UseIntersectionObserverOptions = {}
): IntersectionObserverEntry | undefined {
  const { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    const node = elementRef?.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(([entry]) => setEntry(entry), observerParams);

    observer.observe(node);

    return () => observer.disconnect();
  }, [elementRef, threshold, root, rootMargin, frozen]);

  return entry;
}

// Usage: Lazy load images
function LazyImage({ src, alt }: { src: string; alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const entry = useIntersectionObserver(imgRef, {
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  const isVisible = !!entry?.isIntersecting;

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : undefined}
      alt={alt}
      style={{ minHeight: '200px', background: '#f0f0f0' }}
    />
  );
}
```

**useMediaQuery Hook:**
```typescript
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}

// Usage
function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return (
    <div>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </div>
  );
}
```

**usePrevious Hook:**
```typescript
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// Usage: Track value changes
function Counter() {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {previousCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

**useTimeout & useInterval Hooks:**
```typescript
function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

// Usage
function Timer() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useInterval(
    () => setCount(count + 1),
    isRunning ? 1000 : null
  );

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Pause' : 'Resume'}
      </button>
    </div>
  );
}
```

**useClickOutside Hook:**
```typescript
function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: () => void
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handler]);

  return ref;
}

// Usage: Close dropdown on outside click
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle Dropdown</button>
      {isOpen && (
        <div className="dropdown-menu">
          <a href="#option1">Option 1</a>
          <a href="#option2">Option 2</a>
          <a href="#option3">Option 3</a>
        </div>
      )}
    </div>
  );
}
```

### 5. State Management with Zustand (Advanced)

```typescript
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Complex store with middleware
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoStore {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  
  // Actions
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  setFilter: (filter: TodoStore['filter']) => void;
  clearCompleted: () => void;
  
  // Computed
  filteredTodos: () => Todo[];
  stats: () => { total: number; active: number; completed: number };
}

export const useTodoStore = create<TodoStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          todos: [],
          filter: 'all',

          addTodo: (text) =>
            set((state) => {
              state.todos.push({
                id: crypto.randomUUID(),
                text,
                completed: false,
                createdAt: new Date(),
              });
            }),

          toggleTodo: (id) =>
            set((state) => {
              const todo = state.todos.find((t) => t.id === id);
              if (todo) {
                todo.completed = !todo.completed;
              }
            }),

          deleteTodo: (id) =>
            set((state) => {
              state.todos = state.todos.filter((t) => t.id !== id);
            }),

          setFilter: (filter) =>
            set((state) => {
              state.filter = filter;
            }),

          clearCompleted: () =>
            set((state) => {
              state.todos = state.todos.filter((t) => !t.completed);
            }),

          filteredTodos: () => {
            const { todos, filter } = get();
            switch (filter) {
              case 'active':
                return todos.filter((t) => !t.completed);
              case 'completed':
                return todos.filter((t) => t.completed);
              default:
                return todos;
            }
          },

          stats: () => {
            const todos = get().todos;
            return {
              total: todos.length,
              active: todos.filter((t) => !t.completed).length,
              completed: todos.filter((t) => t.completed).length,
            };
          },
        }))
      ),
      {
        name: 'todo-storage',
        partialize: (state) => ({ todos: state.todos }),
      }
    )
  )
);

// Selective subscriptions
useTodoStore.subscribe(
  (state) => state.todos,
  (todos) => {
    console.log('Todos changed:', todos.length);
  }
);

// Usage in components
function TodoApp() {
  const { addTodo, filteredTodos, stats, filter, setFilter } = useTodoStore();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      addTodo(input);
      setInput('');
    }
  };

  const todoStats = stats();

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit">Add</button>
      </form>

      <div>
        <button onClick={() => setFilter('all')}>All ({todoStats.total})</button>
        <button onClick={() => setFilter('active')}>Active ({todoStats.active})</button>
        <button onClick={() => setFilter('completed')}>Completed ({todoStats.completed})</button>
      </div>

      <TodoList todos={filteredTodos()} />
    </div>
  );
}

function TodoList({ todos }: { todos: Todo[] }) {
  const { toggleTodo, deleteTodo } = useTodoStore();

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.text}
          </span>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```