# The `this` Keyword / Từ Khóa `this`

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Scope & Hoisting](./03-scope-hoisting.md), [Closures](./04-closures.md)
> **See also**: [Prototypes & Inheritance](./06-prototypes-inheritance.md) | [Execution Context](./09-execution-context.md)
> **L5 Competencies**: System Design, API Design, Performance Optimization, Code Review Leadership

---

## Real-World Scenario / Tình Huống Thực Tế

**Production bug tại Tiki (2023):** Team checkout có class `CartManager` với method `handleCheckout`. Khi user click "Thanh toán", họ truyền method như event handler — và `this.cartItems` suddenly trở thành `undefined`, gây crash toàn bộ checkout flow:

```javascript
class CartManager {
  constructor() {
    this.cartItems = [];
    // ❌ Bug: this mất khi method được tách khỏi object
    document.getElementById("checkout-btn").addEventListener("click", this.handleCheckout);
  }
  handleCheckout() {
    console.log(this.cartItems.length); // TypeError: Cannot read properties of undefined
  }
}
```

**Root cause:** `this` xác định tại **call time**, không phải definition time. Khi `handleCheckout` được gọi bởi DOM event, `this` = button element, không phải CartManager instance. **Fix:** bind/arrow function. Nhưng **tại sao** lại như vậy?

---

## What & Why / Cái Gì & Tại Sao

**Analogy (Feynman):** `this` giống đại từ **"tôi"** — nghĩa phụ thuộc vào **ai đang nói**, không phải **câu được viết ở đâu**.

```
"Tôi muốn ăn phở" — Alice nói → tôi = Alice
"Tôi muốn ăn phở" — Bob nói   → tôi = Bob
Cùng câu chữ, nghĩa khác nhau vì ngữ cảnh khác.

handleCheckout() { this.cartItems }  ← cùng function code
manager.handleCheckout()             → this = manager    ✅
btn.addEventListener('click', fn)    → this = btn        ❌
```

**Quy tắc vàng — `this` = object ở bên trái dấu chấm khi gọi hàm:**

| Cách gọi               | `this` là                            |
| ---------------------- | ------------------------------------ |
| `obj.method()`         | `obj`                                |
| `fn()` standalone      | `global` / `undefined` (strict mode) |
| `new Fn()`             | object mới tạo ra                    |
| `fn.call(ctx, ...)`    | `ctx` (bạn chỉ định)                 |
| `fn.apply(ctx, [...])` | `ctx`                                |
| `fn.bind(ctx)()`       | `ctx` (cố định vĩnh viễn)            |
| Arrow function         | `this` của scope bao ngoài (lexical) |

---

## Concept Map / Bản Đồ Khái Niệm

```
[Scope & Hoisting] → [Closures] → [this keyword] ★ ← bạn đang ở đây
                                        |
                                 this xác định tại CALL TIME
                                (không phải definition time)
                                        |
           ┌────────────┬───────────────┼────────────────┐
        Default       Implicit       Explicit          New
        fn()          obj.fn()       .call/.apply      new Fn()
        this=global   this=obj       this=ctx          this={}
        (undefined                   (bạn chọn)
         strict)
                                        |
                              EXCEPTION: Arrow fn
                              this = lexical scope
                              (captured tại definition time)
                                        |
                              [Closures] → arrow fn dùng closure giữ this
                                        |
                              [Prototypes] → prototype methods cần đúng this
```

---

## Overview / Tổng Quan

`this` là một trong những khái niệm gây confusion nhất trong JavaScript. Không giống các ngôn ngữ khác (Java, C#) nơi `this` luôn là instance hiện tại, trong JS `this` được xác định **dynamically tại call time**.

Bài này cover 4 concepts chính:

1. **4 Binding Rules** — DINE priority system (Default, Implicit, New, Explicit)
2. **Arrow Functions & Lexical `this`** — exception duy nhất: `this` cố định tại definition time
3. **Explicit Binding: call/apply/bind** — công cụ override `this` thủ công
4. **Context Loss & Patterns** — vì sao `this` bị mất trong callbacks và cách xử lý production-grade

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. The 4 Binding Rules / 4 Quy Tắc Ràng Buộc

> 🧠 **Memory Hook:** "**DINE** — Default, Implicit, New, Explicit — priority tăng dần từ trái sang phải."

**Tại sao tồn tại? / Why does this exist?**

JavaScript cần cách tự động gắn context vào function — `user.greet()` tự nhiên hơn `greet(user)`.
→ Tại sao gây bug? → Khi tách method khỏi object (callback, setTimeout), "người nói" thay đổi nhưng code không biết.
→ Tại sao không pass context tường minh? → OOP design: method gọi trên object thì tự biết object đó.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Tưởng tượng bạn có tờ giấy nhắn: "Gọi cho **tôi** khi xong." Nghĩa của "tôi" phụ thuộc vào **ai để lại tờ giấy**:

- Manager để lại → "tôi" = manager
- Photocopy tờ giấy đưa cho intern → "tôi" vẫn = manager... nhưng JS lại nghĩ "tôi" = intern (context loss!)
- Arrow function → "tôi" **luôn** = người viết gốc, dù ai cầm tờ giấy

#### Layer 2: How the 4 Rules Work / Cơ Chế 4 Quy Tắc

```javascript
// Rule 1: DEFAULT — fn() standalone
function showThis() {
  console.log(this);
}
showThis(); // window (sloppy) / undefined (strict)

// Rule 2: IMPLICIT — obj.fn()
// this = object bên TRÁI dấu chấm
const user = {
  name: "Alice",
  greet() {
    console.log(this.name);
  },
};
user.greet(); // 'Alice' — this = user

// Rule 3: NEW — new Fn()
// this = object mới tạo ra (empty {} → gắn properties)
function Person(name) {
  this.name = name;
}
const p = new Person("Bob"); // this = {} → { name: 'Bob' }

// Rule 4: EXPLICIT — .call / .apply / .bind
// this = CÁI BẠN TRUYỀN VÀO
function greet() {
  console.log(this.name);
}
greet.call({ name: "Carol" }); // 'Carol'
```

```
Priority: new > .call/.apply/.bind > obj.fn() > fn()

Khi 2 rules xung đột → rule priority CAO hơn thắng.
Ví dụ: new Fn.bind(ctx)() → this = new object (new > bind)
```

#### Layer 3: Edge Cases / Trường Hợp Đặc Biệt

```javascript
// Edge 1: Implicit loss — extract method = lose context
const fn = user.greet;
fn(); // undefined — không còn user. trước

// Edge 2: Chained dot — this = LAST object trước dấu chấm
const a = {
  b: {
    c: function () {
      console.log(this);
    },
  },
};
a.b.c(); // this = b (không phải a)

// Edge 3: Comma operator
(1, user.greet)(); // undefined — comma evaluates to function reference
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                           | Tại sao sai                                     | Đúng là                                                  |
| --------------------------------- | ----------------------------------------------- | -------------------------------------------------------- |
| `setTimeout(obj.method, 100)`     | Tách method → this mất (thành global/undefined) | `setTimeout(() => obj.method(), 100)` hoặc `.bind(this)` |
| Nghĩ `this` cố định khi viết code | `this` xác định lúc **gọi** (call time)         | Trace lại call site: ai gọi function này?                |
| `obj.method` lưu vào biến rồi gọi | Extract = mất implicit binding                  | Dùng `.bind(obj)` hoặc arrow wrapper                     |
| `fn.bind(a).bind(b)` — bind 2 lần | `bind()` seal từ lần đầu, `b` bị ignore         | `bind()` chỉ có hiệu lực lần đầu tiên                    |

**🎯 Interview Pattern:**

- Khi thấy: "tại sao `this` là undefined?" hoặc "predict the output với callback"
- → Nhớ đến: "this = object bên trái dấu chấm tại call site"
- → Mở đầu: "Trong JavaScript, `this` xác định tại **call time** theo 4 rules: DINE. Khi method bị tách khỏi object..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [Scope & Hoisting](./03-scope-hoisting.md) — hiểu lexical scope trước
- ➡️ Để hiểu: [Closures](./04-closures.md) — arrow function dùng closure capture `this`

---

### 2. Arrow Functions & Lexical `this`

> 🧠 **Memory Hook:** "Arrow function KHÔNG có `this` riêng — nó **mượn** `this` từ nơi nó được VIẾT (definition time), không phải nơi được GỌI."

**Tại sao tồn tại? / Why does this exist?**

Trước ES6, pattern phổ biến là `var self = this` — lưu `this` vào biến để dùng trong nested function. Xấu, verbose, dễ nhầm.
→ Arrow function ra đời để biểu đạt rõ ràng: "function này thuộc về context bao ngoài."
→ Tại sao không dùng `.bind(this)` thay thế? → Verbose, phải viết mỗi chỗ, dễ quên.

#### Layer 1: Simple Analogy

Arrow function giống **người phụ tá** — không có chức danh riêng, luôn đại diện cho **sếp** (scope bao ngoài). Dù người phụ tá đi đâu, "sếp" vẫn là người tuyển dụng họ ban đầu.

#### Layer 2: Arrow vs Regular — The Mechanics

```javascript
const obj = {
  name: "Team",

  // ❌ Arrow function as method — NO own this
  arrowMethod: () => {
    console.log(this.name); // undefined — arrow captures GLOBAL this
  },

  // ✅ Regular function as method — HAS own this
  regularMethod() {
    console.log(this.name); // 'Team' — this = obj

    // ❌ Regular callback — loses this
    [1, 2, 3].forEach(function (n) {
      console.log(this.name); // undefined
    });

    // ✅ Arrow callback — captures this from regularMethod
    [1, 2, 3].forEach((n) => {
      console.log(this.name); // 'Team' — captured from regularMethod's scope
    });
  },
};
```

```
Mental model:
  const outer = function() {   ← this = whatever calls outer()
    const inner = () => {      ← this = SAME as outer (captured)
      // inner.this === outer.this, ALWAYS
    };
  };

Arrow fn internal: không có [[ThisValue]] slot
  → engine nhìn lên scope chain → tìm this gần nhất
  → giống cách closure capture biến
```

#### Layer 3: Limitations / Giới Hạn

```javascript
// Cannot be constructor
const Foo = () => {};
new Foo(); // ❌ TypeError: Foo is not a constructor

// .bind/.call/.apply bị ignore
const fn = () => console.log(this);
fn.call({ name: "ignored" }); // vẫn log outer this

// Class field arrow fn: tiện nhưng có trade-off
class Timer {
  tick = () => {
    this.count++;
  }; // ← 1 function PER INSTANCE (memory)
  // vs prototype method: shared across all instances
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                | Tại sao sai                                             | Đúng là                                    |
| -------------------------------------- | ------------------------------------------------------- | ------------------------------------------ |
| Arrow fn cho object method             | `this` = window/global (outer scope, không phải object) | Dùng regular function cho methods          |
| Nghĩ `.bind()` fix arrow fn            | Arrow fn sealed — `.bind()` bị ignore hoàn toàn         | Arrow fn không thể re-bind, đây là feature |
| Class field arrow: `method = () => {}` | 1 function per instance thay vì shared prototype        | Cân nhắc memory vs convenience trade-off   |

**🎯 Interview Pattern:**

- Khi thấy: "Tại sao arrow function không bị mất `this` trong setTimeout?"
- → Nhớ đến: arrow = lexical `this`, captured tại definition
- → Mở đầu: "Arrow function không có `this` binding riêng. Nó captures `this` từ enclosing scope..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [Closures](./04-closures.md) — arrow fn dùng closure mechanism capture `this`
- ➡️ Để hiểu: React hooks — tại sao hooks thay thế class components với `this` binding phức tạp

---

### 3. Explicit Binding: call / apply / bind

> 🧠 **Memory Hook:** "**C**all ngay — **A**pply với **A**rray — **B**ind sau."

**Tại sao tồn tại? / Why does this exist?**

Đôi khi cần mượn method của object A cho object B. Thay vì copy, JS cho phép tạm thời (call/apply) hoặc vĩnh viễn (bind) thay đổi `this`.
→ Function reuse — một function làm việc với nhiều objects mà không cần inheritance.

#### Layer 1: Simple Analogy

- `call` / `apply` = **mượn microphone** — dùng ngay rồi trả lại
- `bind` = **thuê microphone** — giữ dùng nhiều lần

#### Layer 2: call vs apply vs bind

```javascript
function introduce(greeting, punctuation) {
  return `${greeting}, I'm ${this.name}${punctuation}`;
}

const alice = { name: "Alice" };
const bob = { name: "Bob" };

// call — gọi ngay, args riêng lẻ
introduce.call(alice, "Hello", "!"); // "Hello, I'm Alice!"

// apply — gọi ngay, args là array
introduce.apply(bob, ["Hi", "."]); // "Hi, I'm Bob."

// bind — trả về function MỚI, không gọi ngay
const aliceIntro = introduce.bind(alice, "Hey");
aliceIntro("?"); // "Hey, I'm Alice?"
aliceIntro("!"); // "Hey, I'm Alice!"
```

```
Modern: apply ít dùng nhờ spread operator
  fn.apply(ctx, arr)  →  fn.call(ctx, ...arr)

Real use case: mượn Array methods cho array-like objects
  Array.prototype.slice.call(arguments)
  // Modern: Array.from(arguments) hoặc [...arguments]
```

#### Layer 3: Partial Application & Re-binding

```javascript
// bind for partial application (currying lite)
function multiply(a, b) {
  return a * b;
}
const double = multiply.bind(null, 2); // pre-fill first arg
double(5); // 10
double(10); // 20

// ⚠️ bind chỉ có hiệu lực LẦN ĐẦU
const fn = greet.bind(alice);
const fn2 = fn.bind(bob); // bob bị IGNORE — fn vẫn dùng alice
fn2(); // "Alice" (không phải Bob)

// React class component pattern (pre-hooks)
class Button extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this); // bind ONCE in constructor
  }
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                            | Tại sao sai                               | Đúng là                               |
| ---------------------------------- | ----------------------------------------- | ------------------------------------- |
| `fn.bind(ctx)` quên gọi kết quả    | `bind` trả function mới, không tự gọi     | `const bound = fn.bind(ctx); bound()` |
| `fn.apply(ctx, arr)` khi có spread | `fn.call(ctx, ...arr)` rõ hơn, modern hơn | Dùng spread + call                    |
| `fn.bind(a).bind(b)`               | `b` bị ignore — sealed từ lần đầu         | Chỉ bind 1 lần                        |

**🎯 Interview Pattern:**

- Khi thấy: "Khác biệt call, apply, bind?"
- → Mở đầu: "Cả ba override `this`. call gọi ngay với args riêng lẻ, apply gọi ngay với array, bind trả function mới..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: 4 binding rules (concept 1 trên)
- ➡️ Để hiểu: Function currying & partial application patterns

---

### 4. Context Loss Patterns & Production Solutions

> 🧠 **Memory Hook:** "Context loss = **tách method khỏi object** = mất người nói. 3 fix: bind, arrow, wrapper."

**Tại sao tồn tại? / Why does this exist?**

Context loss là bug phổ biến nhất liên quan đến `this`. Xảy ra ở: event handlers, callbacks, setTimeout, Promise.then, React class components.
→ Tại sao phổ biến? → Vì JavaScript cho phép truyền function như value (first-class), nhưng khi truyền, object context không đi theo.

#### Layer 1: Simple Analogy

Giống gửi thư: bạn viết "gọi cho **tôi**" rồi gửi qua bưu điện. Người nhận đọc "tôi" nhưng không biết ai viết. Context bị mất trong quá trình chuyển giao.

#### Layer 2: 5 Common Context Loss Scenarios

```javascript
// Scenario 1: Event handler
class App {
  constructor() {
    this.data = [1, 2, 3];
    // ❌ this = button element khi click
    btn.addEventListener("click", this.handleClick);
    // ✅ Fix
    btn.addEventListener("click", () => this.handleClick());
  }
  handleClick() {
    console.log(this.data);
  }
}

// Scenario 2: setTimeout / setInterval
const timer = {
  seconds: 0,
  start() {
    // ❌ this = window trong callback
    setInterval(function () {
      this.seconds++;
    }, 1000);
    // ✅ Fix: arrow function
    setInterval(() => {
      this.seconds++;
    }, 1000);
  },
};

// Scenario 3: Array methods — thường KHÔNG mất (arrow callback)
const team = {
  members: ["A", "B"],
  prefix: "Dev",
  list() {
    // ✅ Arrow callback → this = team
    return this.members.map((m) => `${this.prefix}: ${m}`);
  },
};

// Scenario 4: Promise .then
class Fetcher {
  constructor() {
    this.url = "https://api.example.com";
  }
  fetchData() {
    // ❌ this = undefined trong .then callback
    fetch(this.url).then(function (res) {
      console.log(this.url);
    });
    // ✅ Fix: arrow function
    fetch(this.url).then((res) => {
      console.log(this.url);
    });
  }
}

// Scenario 5: Passing method as prop in React
// ❌ <Button onClick={this.handleClick} />
// ✅ <Button onClick={() => this.handleClick()} />
// ✅ Or use class field: handleClick = () => { ... }
```

```
Decision tree khi gặp context loss:

  Method dùng làm callback?
    ├─ YES → this SẼ mất
    │   ├─ Dùng 1 lần? → Arrow wrapper: () => obj.method()
    │   ├─ Dùng nhiều lần? → bind trong constructor
    │   └─ Class field? → Arrow property: method = () => {}
    └─ NO → this OK (implicit binding)
```

#### Layer 3: Production Patterns

```javascript
// Pattern 1: EventBus with auto-binding
class EventBus {
  constructor() {
    // Auto-bind all methods
    const proto = Object.getPrototypeOf(this);
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (key !== "constructor" && typeof this[key] === "function") {
        this[key] = this[key].bind(this);
      }
    }
  }
  emit(event) {
    /* this always = EventBus instance */
  }
  on(event, handler) {
    /* ... */
  }
}

// Pattern 2: React — hooks eliminate this entirely
function App() {
  const [data, setData] = useState([]);
  const handleClick = useCallback(() => {
    setData((prev) => [...prev, "new"]); // No this needed
  }, []);
  return <button onClick={handleClick}>Add</button>;
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                     | Tại sao sai                                          | Đúng là                                       |
| ------------------------------------------- | ---------------------------------------------------- | --------------------------------------------- |
| Arrow fn cho object method                  | `this` = outer scope (global), không phải object     | Regular function cho methods                  |
| Bind trong render: `.bind(this)` mỗi render | Tạo function mới mỗi render → break PureComponent    | Bind trong constructor hoặc class field arrow |
| Không cleanup event listener                | `bind()` tạo function MỚI → removeEventListener fail | Lưu reference: `this.bound = fn.bind(this)`   |

**🎯 Interview Pattern:**

- Khi thấy: "Debug context loss trong production"
- → Nhớ đến: tách method = mất context, 3 fix patterns
- → Mở đầu: "Context loss xảy ra khi function reference bị tách khỏi object. 3 solutions: arrow wrapper, bind, class field arrow..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: Arrow function lexical `this` (concept 2 trên)
- ➡️ Để hiểu: React class → hooks migration, Event-driven architecture

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

---

### Q1: `this` trong JavaScript xác định như thế nào? 🟢

**A:** `this` xác định tại **call time** (không phải definition time) theo 4 rules ưu tiên giảm dần:

1. **new** — `new Fn()` → this = object mới tạo
2. **explicit** — `.call(ctx)` / `.apply(ctx)` / `.bind(ctx)` → this = ctx
3. **implicit** — `obj.method()` → this = obj (bên trái dấu chấm)
4. **default** — `fn()` standalone → this = global (sloppy) / undefined (strict)

Exception: arrow function không có this riêng, captures từ lexical scope.

**💡 Interview Signal:**

- ✅ Strong: 4 rules + priority + arrow exception + call time vs definition time
- ❌ Weak: "this là object hiện tại" — không giải thích được callback context loss

---

### Q2: Arrow function vs regular function — khác gì về `this`? 🟢

**A:** Regular function: `this` xác định tại **call time** — phụ thuộc cách gọi. Arrow function: **không có `this` riêng** — captures `this` từ enclosing scope tại **definition time**.

```javascript
const obj = {
  val: 10,
  regular() {
    return this.val;
  }, // this = obj (implicit)
  arrow: () => {
    return this.val;
  }, // this = outer scope (NOT obj)
};
obj.regular(); // 10
obj.arrow(); // undefined (this = window/global)
```

Hệ quả: arrow fn không thể dùng `new`, `.bind()` bị ignore, không dùng làm object method.

**💡 Interview Signal:**

- ✅ Strong: Biết `[[ThisValue]]` slot, giải thích cơ chế capture, biết limitations
- ❌ Weak: "Arrow function thì this khác" — đúng nhưng thiếu cơ chế

---

### Q3: Predict output — class event handler bug 🟡

```javascript
class Timer {
  constructor() {
    this.count = 0;
    document.getElementById("btn").addEventListener("click", this.tick);
  }
  tick() {
    this.count++;
    console.log(this.count);
  }
}
const t = new Timer();
// User clicks button — output?
```

**A:** TypeError hoặc NaN. Event handler set `this` = DOM button element. `this.count` trên button = undefined. `undefined++` = NaN.

3 fix options:

1. Arrow wrapper: `.addEventListener('click', () => this.tick())`
2. Bind constructor: `this.tick = this.tick.bind(this)`
3. Class field arrow: `tick = () => { this.count++; }`

**💡 Interview Signal:**

- ✅ Strong: Biết event handler set `this` = DOM element, 3 fixes + trade-offs
- ❌ Weak: "this bị mất" không giải thích this = gì cụ thể

---

### Q4: call vs apply vs bind — khi nào dùng cái nào? 🟡

**A:**

| Method  | Invoke?    | Args            | Use case                                       |
| ------- | ---------- | --------------- | ---------------------------------------------- |
| `call`  | Ngay       | Comma-separated | Mượn method, truyền args rõ ràng               |
| `apply` | Ngay       | Array           | Trước khi có spread, hoặc khi args đã là array |
| `bind`  | Trả fn mới | Partial args    | Event handler binding, partial application     |

```javascript
// Modern: apply gần như thay thế bởi spread
Math.max.apply(null, [1,2,3])  →  Math.max(...[1,2,3])

// bind for partial application
const log = console.log.bind(console, '[DEBUG]');
log('message'); // '[DEBUG] message'
```

**💡 Interview Signal:**

- ✅ Strong: Biết apply ≈ deprecated nhờ spread, bind partial application, re-bind sealed
- ❌ Weak: Chỉ biết syntax khác nhau, không biết use case

---

### Q5: `this` trong nested functions — predict output 🟡

```javascript
const obj = {
  name: "Outer",
  outer() {
    console.log("A:", this.name);
    function inner() {
      console.log("B:", this.name);
    }
    inner();
    const arrowInner = () => {
      console.log("C:", this.name);
    };
    arrowInner();
  },
};
obj.outer();
```

**A:**

- A: `'Outer'` — implicit binding, `this = obj`
- B: `undefined` — `inner()` là standalone call → this = global/undefined (strict)
- C: `'Outer'` — arrow captures `this` từ `outer()`'s scope = obj

Key insight: nested regular function = DEFAULT binding (standalone call), KHÔNG phải implicit. Arrow function = lexical capture.

**💡 Interview Signal:**

- ✅ Strong: Biết nested function = standalone call, arrow = capture, giải thích cơ chế
- ❌ Weak: Đoán B = 'Outer' (sai vì inner() là standalone)

---

### Q6: Implement `Function.prototype.bind` from scratch 🔴

**A:**

```javascript
Function.prototype.myBind = function (context, ...partialArgs) {
  const originalFn = this; // this = function being bound

  return function bound(...callArgs) {
    // Handle new keyword: nếu gọi với new thì ignore bound context
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
const formal = greet.myBind({ title: "Dr." }, "Hello");
formal("Alice"); // "Hello, Alice! I'm Dr."

// Verify new behavior
function Person(name) {
  this.name = name;
}
const BoundPerson = Person.myBind({ ignored: true });
const p = new BoundPerson("Bob");
p.name; // 'Bob' — bound context ignored with new ✅
```

Key insight: `new.target` check — native bind cho phép `new` trên bound function, context bị ignore khi dùng `new`.

**💡 Interview Signal:**

- ✅ Strong: `new.target` check, partial application, biết `this` trong myBind = function
- ❌ Weak: Basic `return fn.call(ctx)` — bỏ qua new behavior và partial args

**🔗 Follow-up chain:**

1. "Sao bind lần 2 không override lần 1?" → Bound function wrap lần 1, context đã sealed trong closure. Lần 2 wrap thêm nhưng inner closure vẫn giữ ctx gốc.
2. "bind() có ảnh hưởng đến prototype chain không?" → Bound function KHÔNG có `prototype` property → `new BoundFn()` dùng `originalFn.prototype`.
3. "Implement `softBind` — cho phép re-bind nếu this = global?" → Check `!this || this === globalThis` thì dùng bound ctx, else dùng current this.

---

### Q7: `this` trong React class vs functional components — tại sao Hooks ra đời? 🔴

**A:** Class components expose 3 `this` problems:

1. **Constructor binding boilerplate**: mỗi method dùng làm handler phải `.bind(this)` — quên = silent bug
2. **Arrow class field**: `onClick = () => {}` tạo 1 function per instance → break PureComponent (referential inequality)
3. **HOC wrapping**: Higher-Order Components wrap component → `this` trở thành HOC wrapper, không phải original

```javascript
// Class: 3 problems
class Comp extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this); // ① boilerplate
  }
  handleClick = () => {}; // ② new fn per instance
  render() {
    return <button onClick={this.handleClick} />;
  }
}

// Hooks: no this at all
function Comp() {
  const handleClick = useCallback(() => {}, []); // ✅ stable ref
  return <button onClick={handleClick} />;
}
```

**Trade-off:** Hooks require closure understanding (stale closure bugs), classes more explicit about lifecycle. For new code: hooks. For existing: migrate incrementally.

**💡 Interview Signal:**

- ✅ Strong: 3 cụ thể pain points, link đến stale closure trade-off
- ❌ Weak: "Hooks dễ hơn" — không đủ depth

**🔗 Follow-up chain:**

1. "Hooks có giải quyết hoàn toàn vấn đề this không?" → Hooks eliminate this nhưng introduce stale closure — different problem, same root cause (function scope).
2. "Khi nào class components vẫn tốt hơn hooks?" → Error boundaries (`componentDidCatch`), complex lifecycle orchestration (rare), teams familiar with OOP.
3. "useCallback có overhead không?" → Memoization có cost (store prev ref + deps comparison). Chỉ dùng khi child component memo'd hoặc dependency of useEffect.

---

### Q8: Design EventBus class — xử lý `this` binding cho library code 🔴

**A:** Challenge: users will extract methods from EventBus instance → context loss.

```javascript
class EventBus {
  #listeners = new Map();

  constructor() {
    // Strategy: auto-bind all public methods
    const proto = Object.getPrototypeOf(this);
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (key !== "constructor" && typeof proto[key] === "function") {
        this[key] = proto[key].bind(this);
      }
    }
  }

  on(event, handler) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    this.#listeners.get(event).add(handler);
    return () => this.off(event, handler); // return unsubscribe fn
  }

  off(event, handler) {
    this.#listeners.get(event)?.delete(handler);
  }

  emit(event, ...args) {
    for (const handler of this.#listeners.get(event) ?? []) {
      handler(...args);
    }
  }
}

// Usage — methods work even when extracted
const bus = new EventBus();
const { on, emit } = bus; // extract methods
on("test", console.log); // ✅ works — auto-bound
emit("test", "hello"); // ✅ works
```

Design decisions:

1. **Auto-bind in constructor** — pay memory cost upfront for safe API
2. **Private #listeners** — prevent external mutation
3. **Return unsubscribe fn** — closure-based cleanup, no need to remember handler ref
4. **WeakRef alternative** — for handlers that should auto-cleanup when target is GC'd

**💡 Interview Signal:**

- ✅ Strong: Auto-bind pattern, private fields, unsubscribe pattern, WeakRef consideration
- ❌ Weak: Basic EventEmitter without addressing context loss

**🔗 Follow-up chain:**

1. "Auto-bind mọi method có vấn đề gì?" → Memory: mỗi instance copy functions lên instance thay vì shared prototype. Mitigation: chỉ bind methods mà users likely extract.
2. "Làm sao test EventBus?" → Unit test: verify handler called with correct args. Integration: verify `this` works when method extracted. Edge: emit event without listeners.
3. "So sánh auto-bind vs Proxy approach?" → Proxy can trap method access và auto-bind on-demand (lazy) → giảm memory cost. Trade-off: Proxy overhead per access.

---

## Q&A Summary / Tóm Tắt Q&A

| #   | Topic                   | Level | One-liner                                                           |
| --- | ----------------------- | ----- | ------------------------------------------------------------------- |
| 1   | `this` determination    | 🟢    | Call-time, DINE priority: new > explicit > implicit > default       |
| 2   | Arrow vs regular `this` | 🟢    | Arrow = lexical capture (definition time); regular = call time      |
| 3   | Class event handler bug | 🟡    | Event handler → this = DOM element; fix: bind/arrow/class field     |
| 4   | call vs apply vs bind   | 🟡    | call(args), apply([arr]), bind→new fn; apply ≈ deprecated by spread |
| 5   | Nested functions output | 🟡    | Nested regular fn = DEFAULT (standalone); arrow = lexical capture   |
| 6   | Implement bind          | 🔴    | new.target check + partial args + sealed binding                    |
| 7   | React class vs hooks    | 🔴    | Class: 3 this problems; Hooks: no this, but stale closure trade-off |
| 8   | Design EventBus         | 🔴    | Auto-bind in constructor + private fields + unsubscribe closures    |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer hỏi cold: **"Tại sao `this` lại là `undefined` trong function này?"**

```javascript
class Fetcher {
  constructor() {
    this.url = "https://api.example.com";
  }
  fetchData() {
    fetch(this.url).then(function (res) {
      console.log(this.url); // undefined — why?
    });
  }
}
```

**30 giây đầu — mở đầu lý tưởng:**

1. "`this` trong JavaScript xác định tại **call time**. Callback trong `.then()` là standalone call — không gắn với object nào."
2. "Khi `.then(callback)` thực thi, nó gọi `callback()` — không có object context → `this` = undefined (strict mode) hoặc global."
3. "Cụ thể: `fetch(url).then(fn)` → engine gọi `fn()` internally, KHÔNG gọi `fetcher.fn()`, nên không có implicit binding."
4. "Fix: thay `function(res)` bằng `(res) =>` — arrow captures `this` từ `fetchData`'s scope = Fetcher instance."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                         |
| --- | -------------- | ----------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Viết 4 binding rules theo thứ tự ưu tiên từ trí nhớ. Cho ví dụ mỗi rule.                        |
| 2   | 🎨 Visual      | Vẽ sơ đồ tại sao `setTimeout(obj.method, 100)` mất `this`.                                      |
| 3   | 🛠️ Application | Team có class EventBus, methods được truyền như callbacks. Xử lý `this` binding — 3 approaches? |
| 4   | 🐛 Debug       | `const fn = obj.method; fn();` → undefined. Nguyên nhân? Fix không thay đổi call site?          |
| 5   | 🎓 Teach       | Giải thích tại sao arrow function không có `this` riêng — cho người mới, dùng 1 ví dụ thực tế.  |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                 |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Priority: **new** > **explicit** (.call/.apply/.bind) > **implicit** (obj.fn()) > **default** (undefined strict / global sloppy). Arrow: lexical capture. |
| 2   | `setTimeout(obj.method, 100)`: method truyền như function reference → implicit binding mất. this = global/undefined.                                      |
| 3   | (1) Arrow class field: `method = () => {}`. (2) `.bind(this)` trong constructor. (3) Arrow wrapper tại call site: `() => obj.method()`.                   |
| 4   | Extract method `const fn = obj.method` → mất receiver → default binding. Fix: `obj.method = obj.method.bind(obj)` tại definition.                         |
| 5   | Arrow fn = người phụ tá: không có chức danh riêng, luôn đại diện sếp (outer scope). `const helper = () => this.name` — this luôn là scope cha.            |

> 🎯 **Feynman Prompt:** Giải thích "call vs apply vs bind" bằng ví dụ mượn microphone — không dùng thuật ngữ kỹ thuật.
> 🔁 **Spaced Repetition:** Ôn lại sau **3 ngày** → **7 ngày** → **14 ngày**.

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)

- [Closures](./04-closures.md) — arrow function dùng closure capture `this`
- [Prototypes & Inheritance](./06-prototypes-inheritance.md) — prototype methods cần đúng `this`
- [Execution Context](./09-execution-context.md) — execution context là nơi `this` nhận giá trị
- [ES6+ Features](./08-es6-features.md) — arrow function, class syntax

### Khác track (Cross-track)

- [TypeScript](../02-typescript/01-typescript-basics.md) — `this` parameter type annotation
- [React Hooks](../03-react/03-hooks-deep-dive.md) — hooks thay thế class this patterns
