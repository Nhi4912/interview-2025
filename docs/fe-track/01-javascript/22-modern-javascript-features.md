# Modern JavaScript Features (ES2020-2024) - Theory / Tính Năng JavaScript Hiện Đại - Lý Thuyết

## Table of Contents / Mục Lục

1. [ES2020 Features](#es2020-features)
2. [ES2021 Features](#es2021-features)
3. [ES2022 Features](#es2022-features)
4. [ES2023 Features](#es2023-features)
5. [ES2024 Features](#es2024-features)
6. [Stage 3 Proposals](#stage-3-proposals)
7. [Interview Questions](#interview-questions)

---

## ES2020 Features / Tính Năng ES2020

### BigInt / BigInt

**English:** BigInt provides arbitrary-precision integers, overcoming the Number.MAX_SAFE_INTEGER limitation.

**Tiếng Việt:** BigInt cung cấp số nguyên có độ chính xác tùy ý, vượt qua giới hạn Number.MAX_SAFE_INTEGER.

**Problem Solved:**
- Number.MAX_SAFE_INTEGER = 2^53 - 1
- Precision loss beyond this limit
- Cryptography needs
- Large integer calculations

**Syntax:**
```javascript
const bigInt1 = 123456789012345678901234567890n;
const bigInt2 = BigInt("123456789012345678901234567890");
```

**Operations:**
```javascript
const a = 10n;
const b = 20n;

a + b  // 30n
a * b  // 200n
a - b  // -10n
a / b  // 0n (integer division)
a % b  // 10n
a ** b // 100000000000000000000n
```

**Limitations:**
- Cannot mix with Number
- No Math object methods
- JSON.stringify doesn't support
- Bitwise operations different

**Use Cases:**
- Cryptography
- Timestamps (microseconds)
- Large IDs
- Financial calculations
- Scientific computing

### Nullish Coalescing (??) / Hợp Nhất Nullish

**English:** Returns right operand when left is null or undefined, unlike || which checks for falsy values.

**Tiếng Việt:** Trả về toán hạng phải khi trái là null hoặc undefined, khác với || kiểm tra giá trị falsy.

**Problem with ||:**
```javascript
const count = 0;
const value = count || 10; // 10 (wrong!)
// 0 is falsy but valid
```

**Solution with ??:**
```javascript
const count = 0;
const value = count ?? 10; // 0 (correct!)
// Only null/undefined trigger default
```

**Comparison:**
```javascript
false || true   // true
false ?? true   // false

0 || 42        // 42
0 ?? 42        // 0

'' || 'default'  // 'default'
'' ?? 'default'  // ''

null ?? 'default'      // 'default'
undefined ?? 'default' // 'default'
```

**Use Cases:**
- Default values
- Configuration objects
- Optional parameters
- API responses

### Optional Chaining (?.) / Chuỗi Tùy Chọn

**English:** Safely access nested properties without explicit null checks.

**Tiếng Việt:** Truy cập an toàn thuộc tính lồng nhau mà không cần kiểm tra null rõ ràng.

**Before:**
```javascript
const street = user && user.address && user.address.street;
```

**After:**
```javascript
const street = user?.address?.street;
```

**Variants:**

**Property Access:**
```javascript
obj?.prop
obj?.[expr]
```

**Function Call:**
```javascript
func?.()
obj.method?.()
```

**Array Access:**
```javascript
arr?.[index]
```

**Combination:**
```javascript
const value = obj?.prop?.method?.()?.[0]?.nested;
```

**Short-Circuiting:**
```javascript
const result = obj?.prop?.method?.();
// If any step is null/undefined, returns undefined
// Rest of chain not evaluated
```

### Promise.allSettled() / Promise.allSettled()

**English:** Waits for all promises to settle (fulfilled or rejected), unlike Promise.all which fails fast.

**Tiếng Việt:** Đợi tất cả promises hoàn thành (fulfilled hoặc rejected), khác với Promise.all thất bại nhanh.

**Comparison:**

**Promise.all:**
- Fails on first rejection
- Returns array of values
- All-or-nothing

**Promise.allSettled:**
- Waits for all to complete
- Returns array of results
- Never rejects

**Result Format:**
```javascript
const results = await Promise.allSettled([
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3)
]);

// [
//   { status: 'fulfilled', value: 1 },
//   { status: 'rejected', reason: 'error' },
//   { status: 'fulfilled', value: 3 }
// ]
```

**Use Cases:**
- Independent operations
- Batch processing
- Logging all results
- Partial success scenarios

### Dynamic Import / Import Động

**English:** Load modules dynamically at runtime, enabling code splitting and lazy loading.

**Tiếng Việt:** Tải modules động lúc runtime, cho phép code splitting và lazy loading.

**Syntax:**
```javascript
const module = await import('./module.js');
```

**Benefits:**
- Code splitting
- Lazy loading
- Conditional loading
- Reduced initial bundle
- Better performance

**Use Cases:**

**Conditional Loading:**
```javascript
if (condition) {
  const module = await import('./heavy-module.js');
  module.doSomething();
}
```

**Route-Based:**
```javascript
const route = getRoute();
const page = await import(`./pages/${route}.js`);
```

**On-Demand:**
```javascript
button.addEventListener('click', async () => {
  const { feature } = await import('./feature.js');
  feature();
});
```

### globalThis / globalThis

**English:** Unified way to access global object across environments.

**Tiếng Việt:** Cách thống nhất để truy cập object toàn cục qua các môi trường.

**Problem:**
- Browser: `window`
- Node.js: `global`
- Web Workers: `self`
- Inconsistent access

**Solution:**
```javascript
// Works everywhere
globalThis.setTimeout
globalThis.console
globalThis.fetch
```

---

## ES2021 Features / Tính Năng ES2021

### String.prototype.replaceAll() / String.prototype.replaceAll()

**English:** Replace all occurrences of a substring, not just the first.

**Tiếng Việt:** Thay thế tất cả lần xuất hiện của substring, không chỉ lần đầu.

**Before:**
```javascript
// Using regex with g flag
const result = str.replace(/old/g, 'new');

// Or split/join
const result = str.split('old').join('new');
```

**After:**
```javascript
const result = str.replaceAll('old', 'new');
```

**With Regex:**
```javascript
// Must use g flag
const result = str.replaceAll(/old/g, 'new');
// Without g flag: TypeError
```

### Promise.any() / Promise.any()

**English:** Returns first fulfilled promise, ignoring rejections unless all reject.

**Tiếng Việt:** Trả về promise fulfilled đầu tiên, bỏ qua rejections trừ khi tất cả reject.

**Behavior:**
- First fulfillment wins
- Ignores rejections
- Rejects only if all reject
- AggregateError if all fail

**Example:**
```javascript
const promises = [
  Promise.reject('error1'),
  Promise.resolve('success'),
  Promise.reject('error2')
];

const result = await Promise.any(promises);
// 'success'
```

**All Rejected:**
```javascript
const promises = [
  Promise.reject('error1'),
  Promise.reject('error2')
];

try {
  await Promise.any(promises);
} catch (error) {
  console.log(error); // AggregateError
  console.log(error.errors); // ['error1', 'error2']
}
```

**Use Cases:**
- Fastest response
- Fallback servers
- Race conditions
- Redundant requests

### Logical Assignment Operators / Toán Tử Gán Logic

**English:** Combine logical operators with assignment.

**Tiếng Việt:** Kết hợp toán tử logic với gán.

**Operators:**

**&&= (AND assignment):**
```javascript
// Before
if (obj.prop) {
  obj.prop = value;
}

// After
obj.prop &&= value;
```

**||= (OR assignment):**
```javascript
// Before
if (!obj.prop) {
  obj.prop = value;
}

// After
obj.prop ||= value;
```

**??= (Nullish assignment):**
```javascript
// Before
if (obj.prop == null) {
  obj.prop = value;
}

// After
obj.prop ??= value;
```

**Differences:**
```javascript
let x = 0;
x ||= 10;  // 10 (0 is falsy)
x ??= 10;  // 0 (0 is not nullish)

let y = false;
y &&= true;  // false (short-circuits)
y ||= true;  // true
```

### Numeric Separators / Dấu Phân Cách Số

**English:** Use underscores to improve readability of large numbers.

**Tiếng Việt:** Sử dụng gạch dưới để cải thiện khả năng đọc của số lớn.

**Syntax:**
```javascript
const billion = 1_000_000_000;
const bytes = 0b1111_1111;
const hex = 0xFF_FF_FF_FF;
const bigInt = 1_000_000_000_000n;
```

**Rules:**
- Cannot start/end with underscore
- Cannot have consecutive underscores
- Cannot use after leading 0
- Purely cosmetic (ignored by engine)

---

## ES2022 Features / Tính Năng ES2022

### Top-Level Await / Await Cấp Cao Nhất

**English:** Use await at module top level without async function wrapper.

**Tiếng Việt:** Sử dụng await ở cấp cao nhất module mà không cần wrapper async function.

**Before:**
```javascript
// Had to wrap in async IIFE
(async () => {
  const data = await fetchData();
  export default data;
})();
```

**After:**
```javascript
// Direct top-level await
const data = await fetchData();
export default data;
```

**Use Cases:**

**Dynamic Imports:**
```javascript
const module = await import('./module.js');
```

**Resource Initialization:**
```javascript
const connection = await database.connect();
```

**Conditional Exports:**
```javascript
const config = await loadConfig();
export default config.production ? prodModule : devModule;
```

**Implications:**
- Module execution becomes async
- Blocks dependent modules
- Affects module graph
- Use judiciously

### Class Fields / Trường Lớp

**English:** Declare class fields directly without constructor.

**Tiếng Việt:** Khai báo trường lớp trực tiếp mà không cần constructor.

**Public Fields:**
```javascript
class Counter {
  count = 0;  // Public field
  
  increment() {
    this.count++;
  }
}
```

**Private Fields:**
```javascript
class Counter {
  #count = 0;  // Private field
  
  increment() {
    this.#count++;
  }
  
  getCount() {
    return this.#count;
  }
}

const counter = new Counter();
counter.#count;  // SyntaxError
```

**Static Fields:**
```javascript
class Config {
  static version = '1.0.0';
  static #apiKey = 'secret';
  
  static getApiKey() {
    return this.#apiKey;
  }
}
```

**Private Methods:**
```javascript
class Calculator {
  #validate(x) {
    return typeof x === 'number';
  }
  
  add(a, b) {
    if (this.#validate(a) && this.#validate(b)) {
      return a + b;
    }
  }
}
```

### at() Method / Phương Thức at()

**English:** Access array/string elements with negative indices.

**Tiếng Việt:** Truy cập phần tử array/string với chỉ số âm.

**Before:**
```javascript
const arr = [1, 2, 3, 4, 5];
const last = arr[arr.length - 1];  // 5
```

**After:**
```javascript
const arr = [1, 2, 3, 4, 5];
const last = arr.at(-1);  // 5
const secondLast = arr.at(-2);  // 4
```

**Works On:**
- Arrays
- Strings
- TypedArrays

**Examples:**
```javascript
const str = 'hello';
str.at(0);   // 'h'
str.at(-1);  // 'o'
str.at(-2);  // 'l'

const arr = [10, 20, 30];
arr.at(1);   // 20
arr.at(-1);  // 30
```

### Object.hasOwn() / Object.hasOwn()

**English:** Safer alternative to hasOwnProperty.

**Tiếng Việt:** Thay thế an toàn hơn cho hasOwnProperty.

**Problem with hasOwnProperty:**
```javascript
const obj = Object.create(null);
obj.hasOwnProperty('prop');  // TypeError

const obj2 = { hasOwnProperty: 'not a function' };
obj2.hasOwnProperty('prop');  // TypeError
```

**Solution:**
```javascript
Object.hasOwn(obj, 'prop');  // Works safely
```

**Benefits:**
- Works with null prototype
- Cannot be shadowed
- More readable
- Recommended approach

### Error.cause / Error.cause

**English:** Chain errors with cause property.

**Tiếng Việt:** Chuỗi errors với thuộc tính cause.

**Syntax:**
```javascript
try {
  await fetchData();
} catch (error) {
  throw new Error('Failed to load data', { cause: error });
}
```

**Benefits:**
- Error context
- Stack trace preservation
- Better debugging
- Error chaining

**Example:**
```javascript
async function loadUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to load user ${id}`, { cause: error });
  }
}

try {
  await loadUser(123);
} catch (error) {
  console.log(error.message);  // 'Failed to load user 123'
  console.log(error.cause);    // Original fetch error
}
```

---

## ES2023 Features / Tính Năng ES2023

### Array.prototype.findLast() / Array.prototype.findLast()

**English:** Find element from end of array.

**Tiếng Việt:** Tìm phần tử từ cuối array.

**Methods:**
- `findLast()`: Find from end
- `findLastIndex()`: Find index from end

**Examples:**
```javascript
const arr = [1, 2, 3, 4, 5];

arr.findLast(x => x > 3);       // 5
arr.findLastIndex(x => x > 3);  // 4

// Compare with find
arr.find(x => x > 3);           // 4
arr.findIndex(x => x > 3);      // 3
```

**Use Cases:**
- Recent items
- Reverse search
- Last occurrence
- Performance optimization

### Array.prototype.toSorted() / Array.prototype.toSorted()

**English:** Immutable array methods that return new arrays.

**Tiếng Việt:** Phương thức array bất biến trả về arrays mới.

**New Methods:**
- `toSorted()`: Immutable sort
- `toReversed()`: Immutable reverse
- `toSpliced()`: Immutable splice
- `with()`: Immutable element change

**Examples:**
```javascript
const arr = [3, 1, 2];

// Mutable (modifies original)
arr.sort();     // [1, 2, 3]
arr.reverse();  // [3, 2, 1]

// Immutable (returns new array)
const sorted = arr.toSorted();     // [1, 2, 3]
const reversed = arr.toReversed(); // [3, 2, 1]
// arr unchanged: [3, 1, 2]

// with() - change element
const arr2 = [1, 2, 3];
const arr3 = arr2.with(1, 99);  // [1, 99, 3]
// arr2 unchanged: [1, 2, 3]

// toSpliced() - immutable splice
const arr4 = [1, 2, 3, 4, 5];
const arr5 = arr4.toSpliced(1, 2, 99);  // [1, 99, 4, 5]
// arr4 unchanged: [1, 2, 3, 4, 5]
```

**Benefits:**
- Functional programming
- Predictable code
- Easier debugging
- Better for React/Redux

### Hashbang Grammar / Cú Pháp Hashbang

**English:** Support for shebang (#!) in JavaScript files.

**Tiếng Việt:** Hỗ trợ shebang (#!) trong files JavaScript.

**Syntax:**
```javascript
#!/usr/bin/env node

console.log('Hello from script');
```

**Use Cases:**
- CLI scripts
- Executable JavaScript
- Node.js scripts
- Cross-platform scripts

---

## ES2024 Features / Tính Năng ES2024

### Promise.withResolvers() / Promise.withResolvers()

**English:** Create promise with external resolve/reject functions.

**Tiếng Việt:** Tạo promise với hàm resolve/reject bên ngoài.

**Before:**
```javascript
let resolve, reject;
const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});
```

**After:**
```javascript
const { promise, resolve, reject } = Promise.withResolvers();
```

**Use Cases:**
- Event-based promises
- Deferred execution
- Manual control
- Complex async flows

### Object.groupBy() / Object.groupBy()

**English:** Group array elements by key function.

**Tiếng Việt:** Nhóm phần tử array theo hàm key.

**Syntax:**
```javascript
const people = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 25 }
];

const byAge = Object.groupBy(people, person => person.age);
// {
//   '25': [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 25 }],
//   '30': [{ name: 'Bob', age: 30 }]
// }
```

**Map.groupBy():**
```javascript
const byAge = Map.groupBy(people, person => person.age);
// Map {
//   25 => [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 25 }],
//   30 => [{ name: 'Bob', age: 30 }]
// }
```

**Benefits:**
- Cleaner code
- Built-in functionality
- Better performance
- Type-safe keys (Map)

### Temporal API (Stage 3) / API Temporal

**English:** Modern date/time API replacing Date.

**Tiếng Việt:** API date/time hiện đại thay thế Date.

**Problems with Date:**
- Mutable
- Confusing API
- No timezone support
- Month is 0-indexed
- Limited functionality

**Temporal Solution:**
```javascript
// Current date/time
const now = Temporal.Now.instant();

// Specific date
const date = Temporal.PlainDate.from('2024-01-15');

// Date with time
const dateTime = Temporal.PlainDateTime.from('2024-01-15T10:30:00');

// With timezone
const zonedDateTime = Temporal.ZonedDateTime.from(
  '2024-01-15T10:30:00[America/New_York]'
);

// Duration
const duration = Temporal.Duration.from({ hours: 2, minutes: 30 });

// Arithmetic
const tomorrow = date.add({ days: 1 });
const nextWeek = date.add({ weeks: 1 });
```

**Benefits:**
- Immutable
- Clear API
- Timezone support
- Precise calculations
- Better ergonomics

---

## Stage 3 Proposals / Đề Xuất Stage 3

### Decorators / Decorators

**English:** Metadata and behavior modification for classes.

**Tiếng Việt:** Metadata và sửa đổi hành vi cho classes.

**Status:** Stage 3 (likely ES2025)

**Syntax:**
```javascript
@logged
class MyClass {
  @readonly
  property = 'value';
  
  @memoize
  method() {
    // expensive operation
  }
}
```

### Records and Tuples / Records và Tuples

**English:** Immutable data structures with value semantics.

**Tiếng Việt:** Cấu trúc dữ liệu bất biến với ngữ nghĩa giá trị.

**Status:** Stage 2

**Syntax:**
```javascript
// Record (immutable object)
const record = #{
  name: 'Alice',
  age: 25
};

// Tuple (immutable array)
const tuple = #[1, 2, 3];

// Value equality
#{a: 1} === #{a: 1}  // true
#[1, 2] === #[1, 2]  // true
```

### Pattern Matching / Khớp Mẫu

**English:** Powerful conditional logic based on structure.

**Tiếng Việt:** Logic điều kiện mạnh mẽ dựa trên cấu trúc.

**Status:** Stage 1

**Proposed Syntax:**
```javascript
match (value) {
  when ({ type: 'circle', radius }) -> Math.PI * radius ** 2,
  when ({ type: 'rectangle', width, height }) -> width * height,
  when ({ type: 'triangle', base, height }) -> (base * height) / 2,
  default -> 0
}
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟡 [Mid] Q1: Explain BigInt and its use cases

**English Answer:**

**BigInt** provides arbitrary-precision integers.

**Problem:**
- Number.MAX_SAFE_INTEGER = 2^53 - 1
- Precision loss beyond limit
- Cannot represent large integers accurately

**Solution:**
```javascript
const big = 123456789012345678901234567890n;
```

**Operations:**
- Arithmetic: +, -, *, /, %, **
- Comparison: <, >, <=, >=, ==, ===
- Cannot mix with Number
- No Math methods

**Use Cases:**
- Cryptography
- Large IDs
- Timestamps (microseconds)
- Financial calculations
- Scientific computing

**Tiếng Việt:**

BigInt cung cấp số nguyên độ chính xác tùy ý. Giải quyết giới hạn Number.MAX_SAFE_INTEGER. Use cases: cryptography, large IDs, timestamps, financial calculations.

### 🟢 [Junior] Q2: Difference between ?? and ||

**English Answer:**

**|| (OR):** Returns right if left is falsy
**?? (Nullish Coalescing):** Returns right if left is null/undefined

**Falsy Values:**
- false, 0, '', null, undefined, NaN

**Examples:**
```javascript
0 || 10      // 10 (0 is falsy)
0 ?? 10      // 0 (0 is not nullish)

'' || 'default'   // 'default'
'' ?? 'default'   // ''

false || true     // true
false ?? true     // false

null ?? 'default'      // 'default'
undefined ?? 'default' // 'default'
```

**When to Use:**
- **??**: Default values (0, '', false are valid)
- **||**: Boolean logic

**Tiếng Việt:**

|| trả về right nếu left là falsy. ?? trả về right nếu left là null/undefined. Dùng ?? cho default values khi 0, '', false là valid.

### 🟡 [Mid] Q3: Explain top-level await

**English Answer:**

**Top-Level Await** allows await at module top level.

**Before:**
```javascript
(async () => {
  const data = await fetchData();
})();
```

**After:**
```javascript
const data = await fetchData();
```

**Use Cases:**
- Dynamic imports
- Resource initialization
- Conditional exports
- Configuration loading

**Implications:**
- Module execution becomes async
- Blocks dependent modules
- Affects module graph
- Use judiciously

**Best Practices:**
- Use for initialization
- Avoid in hot paths
- Consider performance
- Document dependencies

**Tiếng Việt:**

Top-level await cho phép await ở cấp cao nhất module. Use cases: dynamic imports, resource initialization, conditional exports. Implications: module execution async, blocks dependents.

---

## Summary / Tóm Tắt

**Key Modern Features:**

**ES2020:** BigInt, ??, ?., Promise.allSettled, dynamic import
**ES2021:** replaceAll, Promise.any, logical assignment, numeric separators
**ES2022:** Top-level await, class fields, at(), Object.hasOwn, Error.cause
**ES2023:** findLast, toSorted/toReversed, hashbang
**ES2024:** Promise.withResolvers, Object.groupBy, Temporal (Stage 3)

**Best Practices:**
- Use ?? for default values
- Use ?. for safe access
- Prefer immutable array methods
- Use BigInt for large integers
- Leverage top-level await carefully
- Stay updated with proposals

---

[← Previous: Engine Internals](./21-engine-internals-theory.md) | [Next: TypeScript Modern Features →](../02-typescript/06-typescript-modern-features.md) | [Back to Table of Contents](../../00-table-of-contents.md)
