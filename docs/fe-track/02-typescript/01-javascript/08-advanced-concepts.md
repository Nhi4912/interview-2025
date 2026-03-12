# Advanced JavaScript Concepts / Khái Niệm JavaScript Nâng Cao
## JavaScript Fundamentals - Chapter 8 / Kiến Thức Cơ Bản JavaScript - Chương 8

[← Previous: ES6+ Features](./07-es6-features.md) | [Back to Table of Contents](../../00-table-of-contents.md)

---

## Overview / Tổng Quan

**English:** Advanced JavaScript concepts are frequently tested in senior-level interviews at Big Tech companies. This chapter covers currying, composition, memoization, and other advanced patterns.

**Tiếng Việt:** Các khái niệm JavaScript nâng cao thường được kiểm tra trong phỏng vấn cấp cao tại các công ty Big Tech. Chương này bao gồm currying, composition, memoization và các mẫu nâng cao khác.

---

## Table of Contents / Mục Lục

1. [Currying / Currying](#currying--currying)
2. [Function Composition / Kết Hợp Hàm](#function-composition--kết-hợp-hàm)
3. [Memoization / Ghi Nhớ](#memoization--ghi-nhớ)
4. [Debounce & Throttle / Debounce & Throttle](#debounce--throttle--debounce--throttle)
5. [Partial Application / Áp Dụng Một Phần](#partial-application--áp-dụng-một-phần)
6. [Pure Functions / Hàm Thuần Túy](#pure-functions--hàm-thuần-túy)
7. [Immutability / Tính Bất Biến](#immutability--tính-bất-biến)
8. [Higher-Order Functions / Hàm Bậc Cao](#higher-order-functions--hàm-bậc-cao)
9. [Interview Questions / Câu Hỏi Phỏng Vấn](#interview-questions--câu-hỏi-phỏng-vấn)

---

## Currying / Currying

### Concept / Khái Niệm

**English:** Currying transforms a function with multiple arguments into a sequence of functions, each taking a single argument.

**Tiếng Việt:** Currying biến đổi một hàm với nhiều đối số thành một chuỗi các hàm, mỗi hàm nhận một đối số duy nhất.

```javascript
// Regular function / Hàm thông thường
function add(a, b, c) {
  return a + b + c;
}

console.log(add(1, 2, 3)); // 6

// Curried function / Hàm curried
function curriedAdd(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

console.log(curriedAdd(1)(2)(3)); // 6

// Arrow function version / Phiên bản hàm mũi tên
const curriedAddArrow = a => b => c => a + b + c;
console.log(curriedAddArrow(1)(2)(3)); // 6
```

### Practical Examples / Ví Dụ Thực Tế

```javascript
// Logging with context / Ghi log với ngữ cảnh
const log = level => message => timestamp => {
  console.log(`[${timestamp}] [${level}] ${message}`);
};

const errorLog = log('ERROR');
const infoLog = log('INFO');

errorLog('Database connection failed')(new Date().toISOString());
// [2024-01-15T10:30:00.000Z] [ERROR] Database connection failed

infoLog('User logged in')(new Date().toISOString());
// [2024-01-15T10:30:00.000Z] [INFO] User logged in

// API request builder / Trình xây dựng yêu cầu API
const apiRequest = method => url => data => {
  return fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined
  });
};

const get = apiRequest('GET');
const post = apiRequest('POST');
const put = apiRequest('PUT');

// Usage / Sử dụng
get('/api/users')(null);
post('/api/users')({ name: 'John', age: 30 });
put('/api/users/1')({ name: 'Jane' });
```

### Generic Curry Function / Hàm Curry Tổng Quát

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...nextArgs) {
        return curried.apply(this, args.concat(nextArgs));
      };
    }
  };
}

// Usage / Sử dụng
function multiply(a, b, c) {
  return a * b * c;
}

const curriedMultiply = curry(multiply);

console.log(curriedMultiply(2)(3)(4)); // 24
console.log(curriedMultiply(2, 3)(4)); // 24
console.log(curriedMultiply(2)(3, 4)); // 24
console.log(curriedMultiply(2, 3, 4)); // 24
```

---

## Function Composition / Kết Hợp Hàm

### Concept / Khái Niệm

**English:** Function composition combines multiple functions to create a new function, where the output of one function becomes the input of the next.

**Tiếng Việt:** Kết hợp hàm kết hợp nhiều hàm để tạo một hàm mới, trong đó đầu ra của một hàm trở thành đầu vào của hàm tiếp theo.

```javascript
// Basic composition / Kết hợp cơ bản
const add5 = x => x + 5;
const multiply3 = x => x * 3;
const subtract2 = x => x - 2;

// Manual composition / Kết hợp thủ công
const result = subtract2(multiply3(add5(10)));
console.log(result); // 43

// Compose function (right to left) / Hàm compose (phải sang trái)
const compose = (...fns) => x =>
  fns.reduceRight((acc, fn) => fn(acc), x);

const calculate = compose(subtract2, multiply3, add5);
console.log(calculate(10)); // 43

// Pipe function (left to right) / Hàm pipe (trái sang phải)
const pipe = (...fns) => x =>
  fns.reduce((acc, fn) => fn(acc), x);

const calculatePipe = pipe(add5, multiply3, subtract2);
console.log(calculatePipe(10)); // 43
```

### Practical Examples / Ví Dụ Thực Tế

```javascript
// Data transformation pipeline / Pipeline biến đổi dữ liệu
const users = [
  { name: 'John', age: 25, active: true },
  { name: 'Jane', age: 30, active: false },
  { name: 'Bob', age: 35, active: true }
];

const filterActive = users => users.filter(u => u.active);
const mapNames = users => users.map(u => u.name);
const toUpperCase = names => names.map(n => n.toUpperCase());
const joinWithComma = names => names.join(', ');

const getActiveUserNames = pipe(
  filterActive,
  mapNames,
  toUpperCase,
  joinWithComma
);

console.log(getActiveUserNames(users)); // "JOHN, BOB"

// String processing / Xử lý chuỗi
const trim = str => str.trim();
const toLowerCase = str => str.toLowerCase();
const removeSpaces = str => str.replace(/\s+/g, '-');
const addPrefix = prefix => str => `${prefix}-${str}`;

const createSlug = pipe(
  trim,
  toLowerCase,
  removeSpaces,
  addPrefix('post')
);

console.log(createSlug('  Hello World  ')); // "post-hello-world"
```

---

## Memoization / Ghi Nhớ

### Concept / Khái Niệm

**English:** Memoization caches function results to avoid redundant calculations for the same inputs.

**Tiếng Việt:** Ghi nhớ lưu trữ kết quả hàm để tránh tính toán lại cho cùng đầu vào.

```javascript
// Without memoization / Không có ghi nhớ
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.time('fib');
console.log(fibonacci(40)); // Very slow / Rất chậm
console.timeEnd('fib');

// With memoization / Với ghi nhớ
function memoize(fn) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const memoizedFib = memoize(function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

console.time('memoFib');
console.log(memoizedFib(40)); // Much faster / Nhanh hơn nhiều
console.timeEnd('memoFib');
```

### Advanced Memoization / Ghi Nhớ Nâng Cao

```javascript
// Memoization with TTL (Time To Live) / Ghi nhớ với TTL
function memoizeWithTTL(fn, ttl = 5000) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.value;
    }
    
    const result = fn.apply(this, args);
    cache.set(key, {
      value: result,
      timestamp: Date.now()
    });
    
    return result;
  };
}

// Memoization with max cache size / Ghi nhớ với kích thước cache tối đa
function memoizeWithLimit(fn, limit = 100) {
  const cache = new Map();
  const keys = [];
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    
    if (keys.length >= limit) {
      const oldestKey = keys.shift();
      cache.delete(oldestKey);
    }
    
    keys.push(key);
    cache.set(key, result);
    
    return result;
  };
}
```

---

## Debounce & Throttle / Debounce & Throttle

### Debounce

**English:** Debounce delays function execution until after a specified time has passed since the last call.

**Tiếng Việt:** Debounce trì hoãn thực thi hàm cho đến sau khi một khoảng thời gian đã trôi qua kể từ lần gọi cuối cùng.

```javascript
function debounce(fn, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// Usage: Search input / Sử dụng: Ô nhập tìm kiếm
const searchAPI = query => {
  console.log('Searching for:', query);
  // API call / Gọi API
};

const debouncedSearch = debounce(searchAPI, 300);

// User types: "hello"
debouncedSearch('h');    // Cancelled / Bị hủy
debouncedSearch('he');   // Cancelled / Bị hủy
debouncedSearch('hel');  // Cancelled / Bị hủy
debouncedSearch('hell'); // Cancelled / Bị hủy
debouncedSearch('hello'); // Executes after 300ms / Thực thi sau 300ms
```

### Throttle

**English:** Throttle ensures a function is called at most once in a specified time period.

**Tiếng Việt:** Throttle đảm bảo một hàm được gọi tối đa một lần trong một khoảng thời gian xác định.

```javascript
function throttle(fn, limit) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Usage: Scroll event / Sử dụng: Sự kiện scroll
const handleScroll = () => {
  console.log('Scroll position:', window.scrollY);
};

const throttledScroll = throttle(handleScroll, 1000);

window.addEventListener('scroll', throttledScroll);
// Executes at most once per second / Thực thi tối đa một lần mỗi giây
```

### Advanced Implementations / Triển Khai Nâng Cao

```javascript
// Debounce with immediate execution / Debounce với thực thi ngay lập tức
function debounceImmediate(fn, delay, immediate = false) {
  let timeoutId;
  
  return function(...args) {
    const callNow = immediate && !timeoutId;
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        fn.apply(this, args);
      }
    }, delay);
    
    if (callNow) {
      fn.apply(this, args);
    }
  };
}

// Throttle with trailing call / Throttle với lời gọi cuối
function throttleTrailing(fn, limit) {
  let inThrottle;
  let lastArgs;
  
  return function(...args) {
    lastArgs = args;
    
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          fn.apply(this, lastArgs);
          lastArgs = null;
        }
      }, limit);
    }
  };
}
```

---

## Pure Functions / Hàm Thuần Túy

### Concept / Khái Niệm

**English:** Pure functions always return the same output for the same input and have no side effects.

**Tiếng Việt:** Hàm thuần túy luôn trả về cùng đầu ra cho cùng đầu vào và không có tác dụng phụ.

```javascript
// ❌ Impure function / Hàm không thuần túy
let count = 0;

function incrementImpure() {
  count++; // Side effect: modifies external state
           // Tác dụng phụ: thay đổi trạng thái bên ngoài
  return count;
}

// ✅ Pure function / Hàm thuần túy
function incrementPure(count) {
  return count + 1; // No side effects / Không có tác dụng phụ
}

// ❌ Impure: Depends on external state / Không thuần túy: Phụ thuộc trạng thái bên ngoài
const tax = 0.1;

function calculateTotalImpure(price) {
  return price + (price * tax);
}

// ✅ Pure: All inputs as parameters / Thuần túy: Tất cả đầu vào là tham số
function calculateTotalPure(price, taxRate) {
  return price + (price * taxRate);
}

// ❌ Impure: Modifies input / Không thuần túy: Thay đổi đầu vào
function addItemImpure(cart, item) {
  cart.push(item); // Mutates input / Thay đổi đầu vào
  return cart;
}

// ✅ Pure: Returns new array / Thuần túy: Trả về mảng mới
function addItemPure(cart, item) {
  return [...cart, item]; // No mutation / Không thay đổi
}
```

### Benefits / Lợi Ích

```javascript
// Testability / Khả năng kiểm thử
function add(a, b) {
  return a + b;
}

// Easy to test / Dễ kiểm thử
console.assert(add(2, 3) === 5);
console.assert(add(0, 0) === 0);
console.assert(add(-1, 1) === 0);

// Predictability / Khả năng dự đoán
const result1 = add(5, 10);
const result2 = add(5, 10);
console.log(result1 === result2); // true (always / luôn luôn)

// Cacheable / Có thể cache
const memoizedAdd = memoize(add);
console.log(memoizedAdd(5, 10)); // Calculates / Tính toán
console.log(memoizedAdd(5, 10)); // Returns cached / Trả về từ cache
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🔴 [Senior] Question 1: Implement a curry function

**English Answer:**
```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...nextArgs) => curried(...args, ...nextArgs);
  };
}

// Test
const sum = (a, b, c) => a + b + c;
const curriedSum = curry(sum);
console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1, 2)(3)); // 6
```

### 🟡 [Mid] Question 2: Difference between debounce and throttle?

**English Answer:**
- **Debounce**: Delays execution until after quiet period
  - Use for: Search input, window resize
- **Throttle**: Limits execution to once per time period
  - Use for: Scroll events, mouse movement

**Tiếng Việt:**
- **Debounce**: Trì hoãn thực thi cho đến sau khoảng thời gian yên tĩnh
  - Dùng cho: Ô nhập tìm kiếm, thay đổi kích thước cửa sổ
- **Throttle**: Giới hạn thực thi một lần mỗi khoảng thời gian
  - Dùng cho: Sự kiện scroll, di chuyển chuột

### 🟢 [Junior] Question 3: What makes a function pure?

**English Answer:**
A pure function must:
1. Return same output for same input (deterministic)
2. Have no side effects (no external state modification)
3. Not depend on external state

**Tiếng Việt:**
Hàm thuần túy phải:
1. Trả về cùng đầu ra cho cùng đầu vào (xác định)
2. Không có tác dụng phụ (không thay đổi trạng thái bên ngoài)
3. Không phụ thuộc vào trạng thái bên ngoài

---

## Key Takeaways / Điểm Chính

**English:**
1. Currying transforms multi-argument functions into single-argument chains
2. Composition combines functions for data transformation pipelines
3. Memoization caches results for performance optimization
4. Debounce delays, throttle limits execution frequency
5. Pure functions are predictable, testable, and cacheable
6. Immutability prevents bugs and enables optimization

**Tiếng Việt:**
1. Currying biến đổi hàm nhiều đối số thành chuỗi đối số đơn
2. Composition kết hợp hàm cho pipeline biến đổi dữ liệu
3. Memoization cache kết quả để tối ưu hiệu suất
4. Debounce trì hoãn, throttle giới hạn tần suất thực thi
5. Hàm thuần túy có thể dự đoán, kiểm thử và cache
6. Tính bất biến ngăn lỗi và cho phép tối ưu

---

[← Previous: ES6+ Features](./07-es6-features.md) | [Back to Table of Contents](../../00-table-of-contents.md)
