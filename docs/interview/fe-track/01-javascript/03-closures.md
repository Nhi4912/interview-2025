# Closures
## JavaScript Fundamentals - Chapter 3

[← Previous](./02-scope-hoisting.md) | [Back to Table of Contents](../00-table-of-contents.md) | [Next →](./04-prototypes-inheritance.md)

---

## Tổng Quan / Overview

JavaScript interview prep should be bilingual and practical: explain the concept in English, then reinforce it in Vietnamese with trade-offs and common pitfalls.

Giải thích (VI): Tài liệu này tập trung vào phần cốt lõi thường gặp trong phỏng vấn Frontend. Mỗi mục có định nghĩa, lưu ý và ví dụ JavaScript ngắn gọn để bạn ôn tập nhanh.

### Related Links / Liên Kết Liên Quan
- [Scope & Hoisting](./02-scope-hoisting.md)
- [Variables & Data Types](./01-variables-data-types.md)
- [Event Loop & Async](./06-event-loop-async.md)
- [Functional Programming](./12-functional-programming.md)

---

## Core Concepts

### 1. Lexical Scope Foundation

#### Tổng Quan
Lexical scope means variable visibility is determined by where code is written, not where it is called.

#### Giải thích
Scope từ vựng là nền tảng để hiểu closure. Hàm con truy cập được biến ở các scope bao ngoài theo vị trí khai báo.

#### Ví dụ
```javascript
const globalName = 'global';

function outer() {
  const outerName = 'outer';
  function inner() {
    console.log(globalName, outerName);
  }
  return inner;
}

outer()();
```

### 2. Closure Definition and Mechanics

#### Tổng Quan
A closure is a function bundled with references to its lexical environment.

#### Giải thích
Closure giữ tham chiếu đến biến ngoài, nên biến vẫn "sống" sau khi hàm cha kết thúc. Đây là hành vi bình thường của runtime.

#### Ví dụ
```javascript
function makeCounter() {
  let count = 0;
  return function increment() {
    count += 1;
    return count;
  };
}

const counter = makeCounter();
console.log(counter());
console.log(counter());
```

### 3. Data Privacy with Closures

#### Tổng Quan
Closures can emulate private state without exposing direct mutation.

#### Giải thích
Đây là pattern phỏng vấn rất phổ biến: đóng gói state bằng closure thay vì public field có thể sửa tùy ý.

#### Ví dụ
```javascript
function createBankAccount(initialBalance = 0) {
  let balance = initialBalance;

  return {
    deposit(amount) { balance += amount; },
    withdraw(amount) { if (amount <= balance) balance -= amount; },
    getBalance() { return balance; }
  };
}

const account = createBankAccount(100);
```

### 4. Partial Application

#### Tổng Quan
Partial application pre-fills some arguments and returns a new function.

#### Giải thích
Kỹ thuật này giúp tái sử dụng logic và tạo API dễ đọc hơn, đặc biệt trong validation hoặc formatting.

#### Ví dụ
```javascript
function multiply(a, b) {
  return a * b;
}

function partialMultiply(a) {
  return function (b) {
    return multiply(a, b);
  };
}

const double = partialMultiply(2);
console.log(double(8));
```

### 5. Currying

#### Tổng Quan
Currying transforms a multi-argument function into chained unary functions.

#### Giải thích
Currying khác partial application ở chỗ luôn tách thành chuỗi hàm 1 tham số. Nó hữu ích cho composition.

#### Ví dụ
```javascript
const curriedAdd = a => b => c => a + b + c;

console.log(curriedAdd(1)(2)(3));
```

### 6. Module Pattern via Closure

#### Tổng Quan
IIFE + closure can create private members and public methods.

#### Giải thích
Trước ES module, module pattern dùng nhiều trong code cũ. Biết pattern này giúp đọc legacy code dễ hơn.

#### Ví dụ
```javascript
const TodoModule = (function () {
  const todos = [];

  return {
    add(todo) { todos.push(todo); },
    list() { return [...todos]; }
  };
})();

TodoModule.add('Study closures');
```

### 7. Memoization with Closures

#### Tổng Quan
Memoization caches results for repeated inputs and reduces recomputation.

#### Giải thích
Khi bài toán lặp input nhiều lần, closure cache giúp tăng hiệu năng đáng kể. Nhưng phải cân nhắc memory growth.

#### Ví dụ
```javascript
function memoize(fn) {
  const cache = new Map();
  return function (arg) {
    if (cache.has(arg)) return cache.get(arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

const square = memoize(n => n * n);
```

### 8. Closures in Loops Trap

#### Tổng Quan
Using var in loops can cause all closures to capture the same final value.

#### Giải thích
Đây là câu hỏi kinh điển. Cách fix: dùng let hoặc IIFE để tạo scope mới cho mỗi vòng lặp.

#### Ví dụ
```javascript
const fns = [];
for (var i = 0; i < 3; i++) {
  fns.push(() => i);
}
console.log(fns[0](), fns[1](), fns[2]()); // 3 3 3

const safeFns = [];
for (let j = 0; j < 3; j++) safeFns.push(() => j);
```

### 9. Memory Implications

#### Tổng Quan
Closures retain references, so large captured objects may stay in memory longer than expected.

#### Giải thích
Nếu closure giữ DOM node hoặc object lớn không còn dùng, bạn có thể gây memory leak. Hãy cleanup reference khi cần.

#### Ví dụ
```javascript
function attachHandler() {
  let largeData = new Array(10000).fill('x');
  return function onClick() {
    console.log(largeData.length);
  };
}

const handler = attachHandler();
```

### 10. Closure with Async Operations

#### Tổng Quan
Closures pair naturally with async callbacks and promise chains.

#### Giải thích
Trong async code, closure giữ state context theo từng request. Cần tránh shared mutable state ngoài ý muốn.

#### Ví dụ
```javascript
function createFetcher(baseUrl) {
  return async function fetchUser(id) {
    const res = await fetch(`${baseUrl}/users/${id}`);
    return res.json();
  };
}

const fetchFromApi = createFetcher('https://api.example.com');
```

### 11. Factory Functions and Closures

#### Tổng Quan
Factory functions return objects that close over internal settings.

#### Giải thích
Factory + closure thường thay thế class cho các object đơn giản, ít ceremony và dễ test.

#### Ví dụ
```javascript
function createLogger(prefix) {
  return {
    info(message) {
      console.log(`[${prefix}] ${message}`);
    }
  };
}

createLogger('AUTH').info('Login success');
```

### 12. Common Interview Traps

#### Tổng Quan
Typical traps include loop capture, stale closures in UI frameworks, and hidden memory retention.

#### Giải thích
Khi trả lời, bạn nên nêu ít nhất 1 ví dụ thực tế (React stale state, setTimeout trong vòng lặp, cache không giới hạn).

#### Ví dụ
```javascript
function createTimer() {
  let count = 0;
  return function tick() {
    count += 1;
    return count;
  };
}

const tick = createTimer();
```

### 13. How to Explain Closure in Interview

#### Tổng Quan
Use three steps: lexical scope, returned inner function, and preserved outer variables.

#### Giải thích
Cách nói ngắn gọn: "Closure là hàm + môi trường lexical của nó". Sau đó show counter 5 dòng là đủ thuyết phục.

#### Ví dụ
```javascript
function explainClosure() {
  let value = 1;
  return () => ++value;
}

const next = explainClosure();
console.log(next());
```

### 14. When Not to Use Closures

#### Tổng Quan
Avoid unnecessary nested functions when plain objects/classes are simpler and clearer.

#### Giải thích
Closure rất mạnh nhưng không phải lúc nào cũng cần. Nếu logic cần lifecycle rõ ràng và state nhiều, class hoặc module tường minh dễ bảo trì hơn.

#### Ví dụ
```javascript
// Prefer straightforward data model when closure adds no value
class Counter {
  #count = 0;
  inc() { this.#count += 1; return this.#count; }
}

console.log(new Counter().inc());
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1. Define closure in one sentence.

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟡 [Mid] Q2. How does lexical scope enable closure?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🔴 [Senior] Q3. Why do closures keep variables alive?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟢 [Junior] Q4. What is the classic counter closure example?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟡 [Mid] Q5. How can closure provide data privacy?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🔴 [Senior] Q6. Closure vs class private field: when to choose each?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟢 [Junior] Q7. What is partial application?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟡 [Mid] Q8. How is currying different from partial application?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🔴 [Senior] Q9. How do closures support function factories?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟢 [Junior] Q10. Explain module pattern with IIFE.

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟡 [Mid] Q11. How does memoization use closure?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🔴 [Senior] Q12. What cache invalidation strategy can be used?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟢 [Junior] Q13. What memory risks come from large captured objects?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟡 [Mid] Q14. How do you prevent closure-based memory leaks?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🔴 [Senior] Q15. Explain the var-in-loop closure bug.

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟢 [Junior] Q16. How does let fix loop capture?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟡 [Mid] Q17. How can IIFE fix loop capture in ES5 code?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🔴 [Senior] Q18. What are stale closures in React hooks?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟢 [Junior] Q19. How to avoid stale closures with dependencies?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟡 [Mid] Q20. How do closures behave with setTimeout?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🔴 [Senior] Q21. Do closures copy values or references?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟢 [Junior] Q22. How do closures interact with garbage collection?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟡 [Mid] Q23. Why can debugging closures be hard?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🔴 [Senior] Q24. How do you inspect closure scope in DevTools?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟢 [Junior] Q25. Can closure hurt performance?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟡 [Mid] Q26. When is closure the cleanest approach?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🔴 [Senior] Q27. What anti-patterns involve deeply nested closures?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟢 [Junior] Q28. How to test closure-heavy functions?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟡 [Mid] Q29. How do closures help dependency injection?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🔴 [Senior] Q30. What interview follow-up often appears after closure definition?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟢 [Junior] Q31. How do closures relate to function purity?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟡 [Mid] Q32. How to explain closure to beginners quickly?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🔴 [Senior] Q33. What are practical closure examples in frontend apps?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟢 [Junior] Q34. How do event handlers rely on closure?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟡 [Mid] Q35. Can closure be serialized? why not?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🔴 [Senior] Q36. How does closure differ in arrow vs regular functions?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟢 [Junior] Q37. What senior-level closure trade-offs should you mention?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟡 [Mid] Q38. How to design bounded memoization with LRU?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🔴 [Senior] Q39. Why should caches inside closure be observable?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.

### 🟢 [Junior] Q40. How to avoid hidden shared state in closures?

**Answer (EN):** Anchor your answer on lexical environment and retained references, then discuss one practical use case and one pitfall.

**Giải thích (VI):** Hãy neo câu trả lời vào môi trường lexical và tham chiếu được giữ lại, sau đó nêu một ứng dụng thực tế và một rủi ro.

**Ví dụ:**
```javascript
function makeAdder(a) {
  return function (b) {
    return a + b;
  };
}
console.log(makeAdder(10)(5));
```

**Interview Tip:** Mention memory and loop-capture traps to signal deeper understanding.
