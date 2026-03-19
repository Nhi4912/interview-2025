# The `this` Keyword / Từ Khóa `this`

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Prototypes & Inheritance](./04-prototypes-inheritance.md) | [Closures](./03-closures-comprehensive.md)

[← Previous: Prototypes & Inheritance](./04-prototypes-inheritance.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Event Loop & Async →](./06-event-loop-async.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Production bug tại Tiki (2023):** Team checkout có class `CartManager` với method `handleCheckout`. Khi user click nút "Thanh toán", họ truyền method như event handler — và `this.cartItems` suddenly trở thành `undefined`, gây crash toàn bộ checkout flow:

```javascript
class CartManager {
  constructor() {
    this.cartItems = [];
    // ❌ Bug: this mất khi method được detach khỏi object
    document.getElementById('checkout-btn').addEventListener('click', this.handleCheckout);
  }
  handleCheckout() {
    console.log(this.cartItems.length); // TypeError: Cannot read properties of undefined
  }
}
```

**Fix:** Bind `this` hoặc dùng arrow function. Nhưng **tại sao** `this` bị mất? Và tại sao arrow function fix được? Đây là câu hỏi thực sự — câu trả lời nằm trong cách JS xác định `this` tại **call time**.

---

## What & Why / Cái Gì & Tại Sao

**Analogy (Feynman):** `this` giống như **đại từ "tôi"** — nghĩa phụ thuộc vào **ai đang nói**, không phải **câu được viết ở đâu**.

```
"Tôi muốn ăn phở" — Alice nói → tôi = Alice
"Tôi muốn ăn phở" — Bob nói   → tôi = Bob
(cùng câu chữ, nghĩa khác nhau vì ngữ cảnh khác)

handleCheckout() { this.cartItems }  ← cùng function code
manager.handleCheckout()  → this = manager   ✅
btn.addEventListener('click', handleCheckout) → this = btn ❌
```

**Quy tắc vàng — `this` = object ở bên trái dấu chấm khi gọi hàm:**

| Cách gọi | `this` là |
|----------|-----------|
| `obj.method()` | `obj` |
| `fn()` standalone | `global` / `undefined` (strict mode) |
| `new Fn()` | object mới tạo ra |
| `fn.call(ctx, ...)` | `ctx` |
| `fn.apply(ctx, [...])` | `ctx` |
| `fn.bind(ctx)()` | `ctx` (cố định) |
| Arrow function | `this` của scope bao ngoài (lexical) |

---

## Concept Map / Bản Đồ Khái Niệm

```
[Prototypes] → [this keyword] ★ ← bạn đang ở đây
                     |
              this xác định tại CALL TIME
              (không phải definition time)
                     |
     ┌───────────────┼────────────────┬──────────────┐
  Implicit        Default         Explicit        New
  obj.fn()        fn()           .call/.apply    new Fn()
  this = obj    this = global    this = ctx      this = {}
                (undefined        (bạn chỉ định)
                 strict mode)
                     |
              EXCEPTION: Arrow fn
              this = lexical scope (captured at definition)
                     |
              [Closures] → arrow fn dùng closure để giữ this
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. The 4 Binding Rules / 4 Quy Tắc Ràng Buộc

> 🧠 **Memory Hook:** "**DINE** — Default, Implicit, New, Explicit — priority tăng dần từ trái sang phải."

**Tại sao tồn tại? / Why does this exist?**
JavaScript được thiết kế để code chạy trong nhiều **ngữ cảnh** khác nhau (browser, Node, Web Workers). Thay vì yêu cầu lập trình viên luôn tường minh truyền context, JS tự động gắn context vào `this` dựa trên cách hàm được gọi.
→ Tại sao không pass context tường minh? → Vì object-oriented code như `user.greet()` tự nhiên hơn `greet(user)`.
→ Tại sao điều đó gây bug? → Vì khi tách method khỏi object, "người nói" thay đổi nhưng code không biết.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Tưởng tượng bạn có một tờ giấy nhắn: "Gọi cho **tôi** khi xong." Nghĩa của "tôi" phụ thuộc vào ai để lại tờ giấy. Nếu bạn photocopy tờ giấy và đưa cho người khác, "tôi" vẫn chỉ tác giả gốc — trừ khi arrow function được dùng (khi đó "tôi" = người cầm tờ giấy).

#### Layer 2: How the 4 Rules Work / Cơ Chế 4 Quy Tắc

```javascript
// Rule 1: DEFAULT — fn() standalone, this = global (or undefined in strict mode)
function showThis() { console.log(this); }
showThis(); // global object / undefined

// Rule 2: IMPLICIT — obj.fn(), this = obj (object to the LEFT of the dot)
const user = { name: 'Alice', greet() { console.log(this.name); } };
user.greet(); // 'Alice' — this = user

// Rule 3: EXPLICIT — .call/.apply/.bind, this = what YOU specify
function greet() { console.log(this.name); }
greet.call({ name: 'Bob' }); // 'Bob'

// Rule 4: NEW — new Fn(), this = newly created object
function Person(name) { this.name = name; }
const p = new Person('Carol'); // this = {} → becomes { name: 'Carol' }
```

```
Priority order (high → low):
new Fn() > .call/.apply/.bind > obj.fn() > fn()

When two rules conflict, HIGHER priority wins.
```

#### Layer 3: The Context Loss Problem / Vấn Đề Mất Context

```javascript
const timer = {
  seconds: 0,
  start() {
    // ❌ Callback loses context — this = global when called by setInterval
    setInterval(function() {
      this.seconds++; // this = window, NOT timer!
    }, 1000);
  }
};

// ✅ Fix 1: Arrow function (lexical this)
start() {
  setInterval(() => {
    this.seconds++; // this = timer (captured from start's scope)
  }, 1000);
}

// ✅ Fix 2: bind
start() {
  setInterval(function() {
    this.seconds++;
  }.bind(this), 1000);
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `setTimeout(obj.method, 100)` — dùng trong React class | Tách method khỏi object, `this` mất | `setTimeout(() => obj.method(), 100)` hoặc `bind(this)` trong constructor |
| Nghĩ `this` xác định lúc viết code | `this` xác định lúc **gọi hàm** (call time), không phải definition time | Trace lại call site — ai đang gọi function này? |
| Dùng arrow function cho object method | Arrow fn không có `this` riêng → `this` = outer scope (thường là `window`) | Dùng regular function cho methods, arrow fn cho callbacks bên trong |
| `bind()` gọi hai lần: `fn.bind(a).bind(b)` | `bind()` chỉ lấy binding đầu tiên, `b` bị ignore | `bind()` tạo ra function "sealed" — không thể re-bind |

**🎯 Interview Pattern:**
- Khi thấy: câu hỏi về "tại sao `this` là undefined?" hoặc "predict the output với method callback"
- → Nhớ đến: quy tắc "this = object bên trái dấu chấm tại call site"
- → Mở đầu: "Trong JavaScript, `this` không phải là lexical scope — nó được xác định tại **call time**. Khi method được truyền như callback, nó mất đi object context..."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md) — hiểu lexical scope trước
- ➡️ Để hiểu: [Closures](./03-closures-comprehensive.md) — arrow function dùng closure để capture `this`

---

### 2. Arrow Functions & Lexical `this` / Arrow Function & `this` Lexical

> 🧠 **Memory Hook:** "Arrow function KHÔNG có `this` riêng — nó **mượn** `this` từ nơi nó được VIẾT (definition time), không phải nơi nó được GỌI."

**Tại sao tồn tại? / Why does this exist?**
Trước ES6, pattern phổ biến là `var self = this` — lưu `this` vào biến để dùng trong nested function. Arrow function ra đời để xóa bỏ pattern xấu này.
→ Tại sao `var self = this` là xấu? → Verbose, dễ nhầm tên biến, không rõ intent.
→ Tại sao arrow function sạch hơn? → Vì nó biểu đạt rõ ràng: "function này không có this riêng, nó thuộc về context bao ngoài."

#### Layer 1: Simple Analogy

Arrow function giống người phụ tá — họ không có chức danh riêng, họ luôn đại diện cho **sếp của họ** (scope bao ngoài). Dù người phụ tá đi đâu, "sếp" vẫn là người tuyển dụng họ.

#### Layer 2: Arrow vs Regular — The Mechanics

```javascript
const obj = {
  name: 'Team',

  // ❌ Arrow function as method — NO own this
  arrowMethod: () => {
    console.log(this.name); // undefined — this = window (arrow captures global this)
  },

  // ✅ Regular function as method — HAS own this
  regularMethod() {
    console.log(this.name); // 'Team' — this = obj

    // ❌ Regular function as callback — loses this
    [1, 2, 3].forEach(function(n) {
      console.log(this.name); // undefined
    });

    // ✅ Arrow function as callback — captures this from regularMethod
    [1, 2, 3].forEach(n => {
      console.log(this.name); // 'Team' — this captured from regularMethod's scope
    });
  }
};
```

```
Mental model for arrow functions:

  const outer = function() {   ← this = whatever calls outer()
    const inner = () => {      ← this = captured from outer (same reference)
      // inner.this === outer.this, always
    };
  };
```

#### Layer 3: Arrow Functions Cannot Be Constructors

```javascript
const Foo = () => {};
new Foo(); // ❌ TypeError: Foo is not a constructor

// Arrow functions also cannot use .call/.apply/.bind to change this
const fn = () => console.log(this);
fn.call({ name: 'ignored' }); // Still logs outer this — bind is silently ignored
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Dùng arrow fn cho object methods | Arrow fn không có this riêng → `this` = window/global | Dùng regular function syntax cho methods |
| Nghĩ `.bind()` hoạt động trên arrow fn | Arrow fn's `this` sealed tại definition — `.bind()` bị ignore | Arrow fn không thể re-bind, đây là feature không phải bug |
| Class field arrow fn: `method = () => {}` | Tốt cho callback context, nhưng tạo 1 function per instance thay vì shared prototype | Cân nhắc trade-off memory vs convenience |

**🎯 Interview Pattern:**
- Khi thấy: "Tại sao arrow function trong setTimeout không bị mất `this`?"
- → Nhớ đến: arrow function = lexical `this`, captured tại definition time
- → Mở đầu: "Arrow function không có `this` binding riêng. Nó captures `this` từ enclosing scope tại thời điểm định nghĩa..."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Closures](./03-closures-comprehensive.md) — arrow fn dùng closure mechanism để capture `this`
- ➡️ Để hiểu: React hooks — tại sao hooks thay thế class components với `this` binding phức tạp

---

### 3. Explicit Binding: call / apply / bind

> 🧠 **Memory Hook:** "**Call** ngay — **Apply** với **A**rray — **Bind** sau."

**Tại sao tồn tại? / Why does this exist?**
Đôi khi bạn cần mượn method của object A để dùng cho object B. Thay vì copy method, JavaScript cho phép bạn tạm thời (call/apply) hoặc vĩnh viễn (bind) thay đổi `this`.
→ Tại sao cần điều này? → Function reuse — một function làm việc với nhiều objects khác nhau mà không cần inheritance.

#### Layer 1: Simple Analogy

`call` và `apply` giống việc "mượn microphone" — bạn dùng microphone của người khác để nói chuyện ngay lúc đó, rồi trả lại. `bind` giống "thuê microphone" — bạn giữ nó và có thể dùng nhiều lần.

#### Layer 2: call vs apply vs bind

```javascript
function introduce(greeting, punctuation) {
  return `${greeting}, I'm ${this.name}${punctuation}`;
}

const alice = { name: 'Alice' };
const bob   = { name: 'Bob' };

// call — invoke immediately, args as comma-separated
introduce.call(alice, 'Hello', '!');  // "Hello, I'm Alice!"
introduce.call(bob, 'Hi', '.');       // "Hi, I'm Bob."

// apply — invoke immediately, args as array
// Useful when args already in an array
introduce.apply(alice, ['Hey', '?']); // "Hey, I'm Alice?"

// bind — returns NEW function, doesn't invoke
const aliceIntro = introduce.bind(alice, 'Xin chào');
aliceIntro('!');  // "Xin chào, I'm Alice!" — can call later
aliceIntro('...'); // "Xin chào, I'm Alice..." — with different ending
```

```
Real use case: Borrowing Array methods for array-like objects

function logArgs() {
  // arguments object is array-like but not an Array
  const args = Array.prototype.slice.call(arguments);
  // Modern: Array.from(arguments) or [...arguments]
  console.log(args);
}
```

#### Layer 3: Partial Application with bind

```javascript
// bind for partial application (currying lite)
function multiply(a, b) { return a * b; }

const double = multiply.bind(null, 2); // pre-fill first argument
const triple = multiply.bind(null, 3);

double(5);  // 10
triple(5);  // 15

// React class component pattern
class Button extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this); // bind once in constructor
  }
  handleClick() { /* this = Button instance */ }
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `fn.bind(ctx)` mà quên gọi kết quả | `bind` trả về function mới, không tự gọi | `const bound = fn.bind(ctx); bound();` |
| Dùng `apply` khi có spread: `fn.apply(ctx, arr)` | Modern JS có spread: `fn.call(ctx, ...arr)` — rõ hơn | `fn.call(ctx, ...arr)` |
| Re-binding: `fn.bind(a).bind(b)` | `b` bị ignore — bound function không thể re-bind | Chỉ bind một lần; để thay đổi context thì tạo function mới |

**🎯 Interview Pattern:**
- Khi thấy: "Sự khác biệt call, apply, bind?"
- → Mở đầu: "Cả ba đều override `this`, khác ở cách invoke: call ngay với args riêng lẻ, apply ngay với array, bind trả về function mới để gọi sau..."

**🔑 Knowledge Chain:**
- 📚 Cần biết: The 4 binding rules (section 1 trên)
- ➡️ Để hiểu: Function currying & partial application patterns

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q1: `this` trong JavaScript được xác định như thế nào? / How is `this` determined? 🟢 Junior

**A:** `this` is determined at **call time** by the 4 binding rules (in priority order): new > explicit (.call/.apply/.bind) > implicit (obj.method()) > default (standalone fn → global/undefined).

Giá trị `this` được xác định tại **call time** theo 4 quy tắc ưu tiên giảm dần: new binding → explicit binding (.call/.apply/.bind) → implicit binding (obj.method()) → default binding (fn() standalone → global/undefined).

**💡 Interview Signal:**
- ✅ Strong: Nêu được 4 rules theo thứ tự ưu tiên, giải thích call time vs definition time, đưa được ví dụ context loss
- ❌ Weak: "this là object hiện tại" — quá vague, không giải thích được tại sao `fn()` lại là global

---

### Q2: Tại sao arrow function không có `this` riêng? / Why do arrow functions lack their own `this`? 🟡 Mid

**A:** Arrow functions were designed to solve the "lost context" problem in callbacks. They lexically capture `this` from the enclosing scope at **definition time** — they have no `[[ThisValue]]` internal slot of their own. Because of this, they cannot be used as constructors (`new`), and `.bind()` cannot change their `this`.

Arrow function được thiết kế để giải quyết vấn đề mất context trong callbacks. Chúng capture `this` từ lexical scope tại **definition time** — không có `[[ThisValue]]` internal slot riêng. Vì vậy, không thể dùng `new`, và `.bind()` không thể thay đổi `this` của chúng.

```javascript
const obj = {
  val: 10,
  method() {
    const fn = () => this.val; // captures this from method's scope
    return fn(); // 10 — regardless of how fn is called
  }
};
```

**💡 Interview Signal:**
- ✅ Strong: Đề cập `[[ThisValue]]` slot, giải thích tại sao arrow fn không thể là constructor, biết `.bind()` bị ignore
- ❌ Weak: "Arrow function thì this là outer scope" — đúng nhưng không giải thích được cơ chế

---

### Q3: Predict the output — class event handler bug 🟡 Mid

```javascript
class Timer {
  constructor() {
    this.count = 0;
    document.getElementById('btn').addEventListener('click', this.tick);
  }
  tick() {
    this.count++; // What is 'this' here?
    console.log(this.count);
  }
}
const t = new Timer();
// User clicks button — what happens?
```

**A:** `this.count` throws TypeError. When `tick` is passed as event handler, `this` = the DOM button element (event handlers set `this` to the element). `this.count` on a DOM element = undefined; `undefined++` = NaN.

**Fix options:**
```javascript
// Fix 1: Arrow function in constructor
constructor() {
  this.count = 0;
  document.getElementById('btn').addEventListener('click', () => this.tick());
}

// Fix 2: bind in constructor
constructor() {
  this.tick = this.tick.bind(this); // rebind to instance
  document.getElementById('btn').addEventListener('click', this.tick);
}

// Fix 3: Class field arrow function (modern)
tick = () => { this.count++; }; // arrow fn — no own this, captures instance
```

**💡 Interview Signal:**
- ✅ Strong: Biết event handlers set `this` = DOM element, giải thích đúng TypeError, biết cả 3 fix options và trade-offs
- ❌ Weak: Chỉ nói "this bị mất" không giải thích `this` = DOM element cụ thể

---

### Q4: Implement `Function.prototype.bind` from scratch 🔴 Senior

**A:**

```javascript
Function.prototype.myBind = function(context, ...partialArgs) {
  const originalFn = this; // 'this' here = the function being bound

  return function bound(...callArgs) {
    // Handle new keyword: if called with new, ignore the bound context
    if (new.target) {
      return new originalFn(...partialArgs, ...callArgs);
    }
    return originalFn.call(context, ...partialArgs, ...callArgs);
  };
};

// Test
function greet(greeting, name) {
  return `${greeting}, ${name}! I'm ${this.title}`;
}
const formal = greet.myBind({ title: 'Dr.' }, 'Hello');
console.log(formal('Alice')); // "Hello, Alice! I'm Dr."

// Verify new keyword behavior
function Person(name) { this.name = name; }
const BoundPerson = Person.myBind({ ignored: true });
const p = new BoundPerson('Bob'); // this = new object, NOT { ignored: true }
console.log(p.name); // "Bob" ✅
```

**Key insight:** Native `bind` preserves the ability to use `new` on the bound function — the bound context is ignored when `new` is used. The `new.target` check handles this edge case.

Insight quan trọng: `bind` native vẫn cho phép dùng `new` trên bound function — context bị ignore khi dùng `new`. Check `new.target` để xử lý edge case này.

**💡 Interview Signal:**
- ✅ Strong: Implement đúng `new.target` check, xử lý partial application, hiểu `this` trong `myBind` = function được bind
- ❌ Weak: Implement cơ bản `return originalFn.call(context)` — bỏ qua `new` behavior và partial application

---

### Q5: `this` trong React class vs functional components — tại sao Hooks ra đời? 🔴 Senior (Evaluate/Design)

**A:** React class components expose `this` problems at scale:

1. **Constructor binding boilerplate**: Every method used as event handler must be bound in constructor — or forgotten (silent bug)
2. **Arrow field functions**: `onClick = () => {}` creates a **new function per instance**, breaking PureComponent's `shouldComponentUpdate` (referential inequality)
3. **HOC wrapping obscures `this`**: Higher-Order Components wrap components — `this` becomes the HOC wrapper, not the original component

**React Hooks solve all three:**
```javascript
// Class: 3 problems
class Comp extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this); // ① boilerplate
  }
  handleClick = () => {}; // ② new fn per instance

  render() { return <button onClick={this.handleClick}>...</button>; }
}

// Hooks: no this at all
function Comp() {
  const handleClick = useCallback(() => {}, []); // ✅ stable reference
  return <button onClick={handleClick}>...</button>;
}
```

**Trade-offs:** Hooks require understanding closure (stale closure bugs), class components are more explicit about object lifecycle. For new code: hooks. For large existing class codebases: migrate incrementally.

**💡 Interview Signal:**
- ✅ Strong: Giải thích 3 pain points cụ thể, liên kết đến React Hooks, biết trade-off stale closure với hooks
- ❌ Weak: "Hooks dễ hơn class" — không đủ depth cho Senior level

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer hỏi cold: **"Tại sao `this` lại là `undefined` trong function này?"**

```javascript
class Fetcher {
  constructor() {
    this.url = 'https://api.example.com';
  }
  fetchData() {
    fetch(this.url).then(function(res) {
      console.log(this.url); // undefined — why?
    });
  }
}
```

**30 giây đầu — mở đầu lý tưởng:**
1. "`this` trong JavaScript được xác định tại call time — callback function trong `.then()` là standalone call, không gắn với object nào."
2. "Khi `.then(callback)` thực thi, JavaScript gọi callback như `callback()` — không có object context — nên `this` = global hoặc `undefined` trong strict mode."
3. "Ví dụ cụ thể: `fetch(url).then(fn)` → fetch call `fn()` internally, không gọi `fetcher.fn()`, nên không có implicit binding."
4. "Fix: thay `function(res)` bằng `(res) =>` — arrow function capture `this` từ `fetchData`'s scope = Fetcher instance."

---

## Self-Check / Tự Kiểm Tra ⚡

> **Đóng tài liệu lại trước khi làm — không nhìn lại!**

- [ ] **Retrieval**: Liệt kê 4 binding rules theo thứ tự ưu tiên từ trí nhớ. Viết ra giấy.
- [ ] **Visual**: Vẽ sơ đồ cho câu hỏi "tại sao `setTimeout(obj.method, 100)` mất `this`?" — không nhìn lại.
- [ ] **Application**: Team muốn dùng `class EventBus`. Methods sẽ được truyền như callbacks nhiều nơi. Bạn xử lý `this` binding như thế nào? (3+ approaches)
- [ ] **Debug**: `const fn = obj.method; fn();` log ra `undefined`. Nguyên nhân? Fix không cần thay đổi call site?
- [ ] **Teach**: Giải thích tại sao arrow function không có `this` riêng cho người mới học JS — dùng 1 câu ví dụ thực tế.

💬 **Feynman Prompt:** Giải thích vì sao `greet.call(bob)` hoạt động như "mượn microphone" — không dùng thuật ngữ kỹ thuật.

🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày** → **7 ngày** → **14 ngày**.
