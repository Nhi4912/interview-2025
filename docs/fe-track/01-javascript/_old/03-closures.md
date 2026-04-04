# Closures / Hàm Bao Đóng

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Scope & Hoisting](./02-scope-hoisting.md) | [Variables & Data Types](./01-variables-data-types.md)
> **See also**: [Event Loop & Async](./06-event-loop-async.md) | [Functional Programming](./12-functional-programming.md)

[← Previous](./02-scope-hoisting.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./04-prototypes-inheritance.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn đang xây dựng nút "Like" cho một mạng xã hội. Mỗi bài viết có bộ đếm like riêng. Vấn đề: làm sao để mỗi nút có bộ đếm riêng tư mà không bị ảnh hưởng lẫn nhau, và không để lộ biến đếm ra ngoài?

```
Post A: [❤️ Like] → count: 5   (riêng tư, không ai sửa được trực tiếp)
Post B: [❤️ Like] → count: 12  (riêng tư, độc lập với Post A)
```

Câu trả lời là **closure** — hàm "nhớ" môi trường nơi nó được tạo ra, kể cả sau khi hàm cha đã kết thúc.

---

## What & Why / Cái Gì & Tại Sao

**Analogy (Liên tưởng):** Hãy tưởng tượng một chiếc **ba lô có khóa bí mật**.

- Bạn nhét đồ vào ba lô → đóng khóa → đưa cho người khác
- Người đó có thể dùng ba lô (hàm trả về) nhưng **không thể lấy đồ ra trực tiếp**
- Chỉ có thể tương tác qua các "cửa sổ" bạn thiết kế (method được trả về)
- Đồ trong ba lô vẫn tồn tại miễn là người đó còn giữ chiếc ba lô

Closure hoạt động đúng như vậy: **biến bên trong hàm cha + hàm con được trả về = ba lô có khóa.**

**Định nghĩa kỹ thuật:** Closure là sự kết hợp giữa một hàm và **lexical environment** (môi trường nơi hàm đó được khai báo). Hàm con "đóng gói" tham chiếu đến biến của hàm cha — không phải bản sao, mà là **tham chiếu thực sự**.

---

## Concept Map / Bản Đồ Khái Niệm

```
Kiến thức cần có trước:
  [Variables: let/const/var]
       ↓
  [Scope: block / function / global]
       ↓
  [Lexical Scope: scope xác định theo nơi khai báo]
       ↓
  ★ CLOSURES ★  ← bạn đang ở đây
       ↓                    ↓
  [Module Pattern]    [Memoization]
       ↓                    ↓
  [Currying]         [React Hooks (stale closure)]
       ↓
  [Functional Programming]
```

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. Lexical Scope — Nền Tảng Của Closure

#### Layer 1: Analogy / Liên Tưởng

Hãy nghĩ về **gia đình nhiều thế hệ sống chung một nhà**.
- Con cháu (hàm con) nhìn thấy đồ của cha mẹ (hàm cha) và ông bà (scope cao hơn)
- Nhưng cha mẹ **không nhìn thấy** đồ của con cái
- Luật này áp dụng theo **nơi sinh ra** (nơi khai báo), không phải nơi đang đứng

#### Layer 2: How It Works / Cơ Chế

Lexical scope = phạm vi biến được xác định tại **thời điểm viết code** (compile time), không phải lúc chạy.

```javascript
const house = 'Nhà chung';        // global scope

function parents() {
  const room = 'Phòng cha mẹ';   // function scope

  function child() {
    // child thấy: house ✓, room ✓
    console.log(house, room);
  }

  // parents KHÔNG thấy biến khai báo bên trong child()
  child();
}
```

#### Layer 3: Edge Cases / Trường Hợp Biên

Lexical scope ≠ dynamic scope. JavaScript dùng lexical scope — `this` là ngoại lệ duy nhất (xem [this keyword](./05-this-keyword.md)).

---

### 2. Closure Definition — Định Nghĩa

#### Layer 1: Analogy / Liên Tưởng

Closure = hàm con được **trả về** từ hàm cha, mang theo cái "ba lô" chứa biến của cha.

```
makeCounter() chạy xong → count ĐÁNG LẼ bị xóa
Nhưng increment vẫn giữ tham chiếu → count KHÔNG bị xóa (ba lô vẫn còn)
```

#### Layer 2: How It Works / Cơ Chế

```javascript
function makeCounter() {
  let count = 0;            // biến trong hàm cha

  return function increment() {
    count += 1;             // hàm con tham chiếu đến count
    return count;
  };
  // makeCounter() kết thúc, nhưng count KHÔNG bị xóa
  // vì increment vẫn đang giữ tham chiếu đến nó
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2  ← count vẫn "nhớ" giá trị cũ!
console.log(counter()); // 3
```

Visualize memory:
```
makeCounter() frame (stack):
┌─────────────────────────┐
│  count = 0 (heap)       │ ← không bị GC vì increment giữ ref
└─────────────────────────┘
         ↑ tham chiếu
┌─────────────────────────┐
│  increment (closure)    │
│  [[Environment]] → count│
└─────────────────────────┘
         ↑ được lưu vào
const counter = ...
```

#### Layer 3: Edge Cases / Trường Hợp Biên

Closure giữ **tham chiếu**, không phải bản sao — nếu biến bị thay đổi bên ngoài, closure thấy giá trị mới:

```javascript
let x = 10;
const getX = () => x;   // closure trên x
x = 99;
console.log(getX());    // 99 — không phải 10!
```

---

### 3. Data Privacy / Đóng Gói Dữ Liệu

#### Layer 1: Analogy / Liên Tưởng

Như **ATM** — bạn chỉ có thể rút tiền qua màn hình, không thể mở két lấy trực tiếp. Closure tạo "két riêng tư" bên trong hàm.

#### Layer 2: How It Works / Cơ Chế

Giải quyết bài toán "Like button" ban đầu:

```javascript
function createLikeCounter(postId) {
  let count = 0;               // "két riêng tư" — không ai truy cập được

  return {
    like()    { count += 1; return count; },
    unlike()  { if (count > 0) count -= 1; return count; },
    getCount(){ return count; }
    // count KHÔNG được expose trực tiếp
  };
}

const postA = createLikeCounter('A');
const postB = createLikeCounter('B');

postA.like(); // 1
postA.like(); // 2
postB.like(); // 1  ← độc lập với postA

// postA.count → undefined (không thể truy cập trực tiếp!)
```

#### Layer 3: Edge Cases / Trường Hợp Biên

Closure vs class private field (`#`):

| | Closure | Class `#field` |
|---|---|---|
| Memory | Mỗi instance có environment riêng | Prototype-based, chia sẻ methods |
| Performance | Tốt cho ít instance | Tốt hơn khi nhiều instance |
| Subclassing | Không hỗ trợ | Hỗ trợ |
| Khi dùng | Functional style, simple objects | OOP, inheritance cần thiết |

---

### 4. Classic Trap: Closures in Loops / Bẫy Trong Vòng Lặp

#### Layer 1: Analogy / Liên Tưởng

`var` như **biến bảng trắng dùng chung** — mọi hàm trong vòng lặp cùng nhìn vào một chỗ. Khi vòng lặp xong, tất cả thấy giá trị cuối.

#### Layer 2: How It Works / Cơ Chế

```javascript
// ❌ BUG — var dùng chung một binding
const fns = [];
for (var i = 0; i < 3; i++) {
  fns.push(() => i);
}
console.log(fns[0](), fns[1](), fns[2]()); // 3 3 3 ← tất cả cùng thấy i=3

// ✅ FIX 1 — let tạo binding mới mỗi iteration
for (let j = 0; j < 3; j++) {
  fns.push(() => j);
}
console.log(fns[0](), fns[1](), fns[2]()); // 0 1 2 ✓

// ✅ FIX 2 — IIFE tạo scope mới (cho ES5 code cũ)
for (var k = 0; k < 3; k++) {
  (function(captured) {
    fns.push(() => captured);
  })(k);
}
```

Tại sao `let` fix được? Mỗi iteration của `let` tạo một **binding riêng biệt** — như thể có 3 biến `j` khác nhau:

```
Iteration 0: j₀ = 0 → fns[0] giữ tham chiếu j₀
Iteration 1: j₁ = 1 → fns[1] giữ tham chiếu j₁
Iteration 2: j₂ = 2 → fns[2] giữ tham chiếu j₂
```

#### Layer 3: Edge Cases / Trường Hợp Biên

**Stale closure trong React** — dạng tương tự nhưng trong Hooks:

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // ❌ BUG: closure capture count = 0 tại lúc mount
    // Sau 1s, count có thể đã thay đổi nhưng callback vẫn thấy 0
    setTimeout(() => console.log('count:', count), 1000);
  }, []); // [] = chỉ chạy lúc mount

  // ✅ FIX: thêm count vào dependency array
  useEffect(() => {
    setTimeout(() => console.log('count:', count), 1000);
  }, [count]); // re-run khi count thay đổi
}
```

---

### 5. Practical Patterns / Các Pattern Thực Tế

#### Memoization — Cache Kết Quả

```javascript
function memoize(fn) {
  const cache = new Map();    // cache "sống" trong closure

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);  // trả về cached
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const expensiveCalc = memoize((n) => {
  // giả sử tính toán nặng
  return n * n;
});

expensiveCalc(10); // tính toán thật
expensiveCalc(10); // từ cache — O(1)
```

#### Partial Application — Điền Sẵn Tham Số

```javascript
// Thay vì gọi formatCurrency(amount, 'VND', 'vi-VN') mỗi lần:
function createFormatter(currency, locale) {
  return (amount) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

const formatVND = createFormatter('VND', 'vi-VN');
const formatUSD = createFormatter('USD', 'en-US');

formatVND(50000);   // "50.000 ₫"
formatUSD(19.99);   // "$19.99"
```

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What is a closure? / Closure là gì? 🟢 Junior

**A:** A closure is a function that **retains access to its lexical environment** even after the outer function has returned. The inner function "closes over" variables from its enclosing scope — capturing a reference, not a copy.

Closure là hàm giữ lại quyền truy cập vào **môi trường lexical** nơi nó được tạo, kể cả sau khi hàm cha đã kết thúc. Hàm con "đóng gói" tham chiếu đến biến bên ngoài — là tham chiếu thật, không phải bản sao.

```javascript
function outer() {
  let secret = 42;
  return () => secret;   // closure: giữ tham chiếu đến secret
}
const get = outer();     // outer() kết thúc nhưng secret vẫn sống
console.log(get());      // 42
```

**Interview tip:** Câu trả lời ngắn gọn nhất: *"Closure = function + lexical environment"*. Sau đó show ví dụ counter 5 dòng.

---

### Q: Why does closure happen? What keeps the variable alive? / Tại sao closure xảy ra? Điều gì giữ biến sống? 🟡 Mid

**A:** JavaScript's garbage collector uses **reachability** — an object is kept in memory as long as something references it. When an inner function is returned, it holds a reference to its outer scope's environment record. As long as the closure (inner function) exists, the environment (and its variables) cannot be garbage collected.

GC của JavaScript dùng nguyên tắc **reachability** — object còn tham chiếu thì không bị xóa. Khi hàm con được trả về, nó giữ tham chiếu đến environment record của hàm cha. Miễn là closure còn tồn tại → environment sống → biến sống.

```
makeCounter() exits →  normally: count would be GC'd
BUT: increment function holds [[Environment]] → count ✓ not GC'd
UNTIL: counter = null → no more refs → count can be GC'd
```

**Trade-off quan trọng:** Closure giữ object lớn (DOM, array) có thể gây **memory leak** nếu không cleanup đúng cách.

---

### Q: Explain the var-in-loop closure bug and its fixes / Giải thích lỗi var trong loop? 🟡 Mid

**A:** `var` is function-scoped and creates a **single binding** for the entire loop. All closures created inside the loop share the same `i` reference. When the loop finishes, `i` equals the final value, so every closure returns that value.

`var` có function scope — chỉ tạo **một binding duy nhất** cho toàn bộ vòng lặp. Mọi closure bên trong đều trỏ đến cùng một `i`. Khi vòng lặp xong, `i` = giá trị cuối, nên tất cả closure trả về giá trị đó.

**Three fixes:**
```javascript
// Fix 1: let — creates new binding per iteration (modern default)
for (let i = 0; i < 3; i++) { arr.push(() => i); }

// Fix 2: IIFE — creates new scope per iteration (legacy ES5)
for (var i = 0; i < 3; i++) { (n => arr.push(() => n))(i); }

// Fix 3: Array method — no loop variable needed
[0, 1, 2].forEach(i => arr.push(() => i));
```

---

### Q: What is a stale closure? How does it appear in React? / Stale closure là gì? Cách xử lý trong React? 🔴 Senior

**A:** A stale closure captures a **snapshot of a variable** at creation time. Later, when the variable updates, the closure still references the old value — it's "stale."

Stale closure xảy ra khi hàm "capture" giá trị của biến tại thời điểm tạo, nhưng sau đó biến thay đổi — closure vẫn thấy **giá trị cũ**.

```javascript
// In React useEffect:
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // This closure captures count=0 at mount time
    const id = setInterval(() => {
      setCount(count + 1); // ❌ always 0+1=1, never increments!
    }, 1000);
    return () => clearInterval(id);
  }, []); // [] means closure is never refreshed
```

**Solutions:**
```javascript
// Fix 1: functional update (preferred — no closure dependency)
setCount(prev => prev + 1);  // ✅ uses latest value

// Fix 2: add to dependency array (re-creates effect when count changes)
useEffect(() => { ... }, [count]);  // ✅ but may cause issues with intervals

// Fix 3: useRef to hold latest value
const countRef = useRef(count);
useEffect(() => { countRef.current = count; }, [count]);
// Then use countRef.current inside the interval
```

**Senior insight:** React Hooks are closure-heavy — understanding stale closures is mandatory for debugging hooks. The `exhaustive-deps` ESLint rule catches most stale closure bugs automatically.

---

### Q: Closure vs class private field — khi nào dùng cái nào? 🔴 Senior

**A:** Both achieve data privacy but have different trade-offs:

| Aspect | Closure | Class `#field` |
|--------|---------|----------------|
| Memory per instance | Own environment record | Shared prototype methods |
| Many instances | More memory overhead | More efficient |
| Inheritance | Not supported | Fully supported |
| Serialization | Not serializable | Not serializable |
| Testing | Easy to test return values | Need to test through methods |

**Dùng closure khi:** Functional style, factory functions, single-purpose encapsulation (memoize, counter), không cần inheritance.

**Dùng class `#field` khi:** OOP với inheritance, nhiều instance (performance matters), cần `instanceof`, team quen với OOP.

```javascript
// Closure approach — tốt cho stateless/functional patterns
const createValidator = (rules) => (value) => rules.every(r => r(value));

// Class approach — tốt cho stateful, nhiều instance
class FormField {
  #value = '';
  #validators = [];
  setValue(v) { this.#value = v; }
  isValid() { return this.#validators.every(r => r(this.#value)); }
}
```

---

## Interview Q&A Summary / Tổng Kết

| Câu hỏi | Level | Điểm chính |
|---------|-------|-----------|
| Closure là gì? | 🟢 | function + lexical environment, giữ tham chiếu không phải bản sao |
| Tại sao biến không bị GC? | 🟡 | GC reachability: closure giữ ref → environment sống |
| var-in-loop bug | 🟡 | var = 1 binding, dùng `let` hoặc IIFE để fix |
| Stale closure trong React | 🔴 | Closure capture giá trị cũ, fix bằng functional update hoặc deps array |
| Closure vs class #field | 🔴 | Closure cho functional style, class cho OOP/inheritance/nhiều instance |

---

## Self-Check / Tự Kiểm Tra

Bạn đã hiểu bài nếu trả lời được tất cả:

- [ ] Tôi có thể giải thích closure mà không dùng từ "closure" (dùng analogy ba lô hoặc két)
- [ ] Tôi có thể vẽ sơ đồ memory của `makeCounter()` — chỉ ra đâu là heap, đâu là stack
- [ ] Tôi có thể chỉ ra tại sao `fns[0]()` trả về `3` trong ví dụ `var` loop
- [ ] Tôi có thể giải thích stale closure trong React và đưa ra 2 cách fix
- [ ] Tôi có thể quyết định khi nào dùng closure, khi nào dùng class với lý do cụ thể

**💬 Giải thích bằng lời của bạn:** "Closures giải quyết vấn đề gì trong JavaScript? Tại sao ngôn ngữ cần feature này?" *(Nói to, không nhìn tài liệu — 30 giây)*

---

## Connections / Liên Kết Kiến Thức

- ⬅️ **Cần biết trước:** [Scope & Hoisting](./02-scope-hoisting.md) — closure không thể hiểu nếu chưa biết lexical scope
- ➡️ **Dùng closure để xây:** [Functional Programming](./12-functional-programming.md) — currying, composition dựa trên closure
- ➡️ **Cẩn thận khi dùng với:** [React Hooks](../03-react/03-hooks-deep-dive.md) — stale closure là bug phổ biến nhất trong React
- ↔️ **So sánh với:** [Prototypes & Inheritance](./04-prototypes-inheritance.md) — 2 cách tạo encapsulation khác nhau

---

**See also**: [Scope & Hoisting](./02-scope-hoisting.md) | [Functional Programming](./12-functional-programming.md) | [React Hooks Deep Dive](../03-react/03-hooks-deep-dive.md)
