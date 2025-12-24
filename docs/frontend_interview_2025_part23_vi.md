# 📚 Tài Liệu Phỏng Vấn Frontend 2025 - Phần 23

> **Chủ đề**: 🧠 THEORY DEEP DIVE - Hiểu Bản Chất (What/How/Why)

_Ít code, nhiều lý thuyết - Giải thích để hiểu sâu_

---

## 📋 Mục Lục

1. [JavaScript Runtime](#1-javascript-runtime)
2. [Memory & Garbage Collection](#2-memory--garbage-collection)
3. [Rendering Pipeline](#3-rendering-pipeline)
4. [React Philosophy](#4-react-philosophy)
5. [State Management Philosophy](#5-state-management-philosophy)
6. [Web Security Concepts](#6-web-security-concepts)
7. [Performance Theory](#7-performance-theory)
8. [Architecture Thinking](#8-architecture-thinking)

---

## 1. JavaScript Runtime

### 1.1 Event Loop: Tại Sao Cần?

**❓ WHAT (Là gì?)**

Event Loop là cơ chế cho phép JavaScript xử lý nhiều tác vụ mặc dù là **single-threaded** (chạy trên 1 thread duy nhất).

**🔧 HOW (Hoạt động thế nào?)**

```
┌─────────────────────────────────────────────────┐
│                    BROWSER                       │
├─────────────────────────────────────────────────┤
│   ┌─────────────┐    ┌───────────────────────┐  │
│   │  Call Stack │    │     Web APIs          │  │
│   │  (JS code)  │───▶│  (setTimeout, fetch)  │  │
│   └─────────────┘    └───────────────────────┘  │
│         ▲                       │               │
│         │                       ▼               │
│   ┌─────────────┐    ┌───────────────────────┐  │
│   │ Event Loop  │◀───│   Callback Queues     │  │
│   │  (checks)   │    │  Micro │ Macro        │  │
│   └─────────────┘    └───────────────────────┘  │
└─────────────────────────────────────────────────┘
```

1. **Call Stack** xử lý code đồng bộ
2. **Web APIs** xử lý async operations (setTimeout, fetch...)
3. Khi xong, callback được đẩy vào **Queue**
4. **Event Loop** kiểm tra: Stack trống? → Lấy callback từ Queue

**💡 WHY (Tại sao thiết kế như vậy?)**

- **Single-thread đơn giản hóa** - Không lo race conditions, deadlocks
- **Non-blocking I/O** - Không chờ đợi network/file operations
- **Responsive UI** - Giao diện không bị đóng băng

**🎯 Mental Model:**

> JavaScript như một nhà hàng với 1 đầu bếp (thread). Thay vì đứng đợi lò nướng, đầu bếp đặt timer rồi làm việc khác. Khi timer kêu, quay lại lấy đồ.

---

### 1.2 Closure: Tại Sao Quan Trọng?

**❓ WHAT**

Closure là khả năng của function "nhớ" được môi trường nơi nó được tạo ra, ngay cả khi function đó được thực thi ở nơi khác.

**🔧 HOW**

Khi function được tạo, nó "chụp ảnh" lại tất cả biến xung quanh (lexical scope). Ảnh này được lưu trong [[Environment]] internal slot.

```
┌─────────────────────────────────────┐
│  function outer(x) {                │
│    return function inner(y) {       │
│      return x + y;  ◄── x vẫn      │
│    }                    tồn tại!    │
│  }                                  │
│                                     │
│  const add5 = outer(5);             │
│  add5(3) → 8                        │
│                                     │
│  [[Environment]]: { x: 5 }          │
└─────────────────────────────────────┘
```

**💡 WHY**

- **Data Privacy** - Ẩn biến, chỉ expose interface
- **State in Functional Programming** - Giữ state mà không cần object
- **Module Pattern** - Tạo modules với private variables
- **Callbacks & Event Handlers** - Giữ context cho async operations

**🎯 Mental Model:**

> Closure như một hộp quà có ghi chú bên trong. Dù bạn mang hộp đi đâu, ghi chú vẫn ở trong đó.

---

### 1.3 Prototype: Tại Sao Không Dùng Class Thật?

**❓ WHAT**

JavaScript sử dụng **prototypal inheritance** - objects kế thừa trực tiếp từ objects khác, không phải từ "class blueprint".

**🔧 HOW**

```
┌────────────────────────────────────────────┐
│                                            │
│   dog  ──▶  Dog.prototype  ──▶  Object.prototype  ──▶  null
│             │                   │
│            speak()             toString()
│
└────────────────────────────────────────────┘

Khi gọi dog.speak():
1. Tìm trong dog → không có
2. Tìm trong Dog.prototype → có! → thực thi
```

**💡 WHY (Tại sao không class-based?)**

- **Flexibility** - Có thể thêm/sửa methods runtime
- **Memory Efficient** - Methods chia sẻ, không copy
- **Dynamic Language** - Phù hợp với nature của JS
- **Simpler** - Không cần khái niệm abstract class, interface

**🎯 Mental Model:**

> Class: Xây nhà từ bản vẽ (mỗi nhà riêng biệt)
> Prototype: Copy nhà mẫu rồi sửa (nhà con link đến nhà mẫu)

---

## 2. Memory & Garbage Collection

### 2.1 Memory Lifecycle

**❓ WHAT**

JavaScript tự động quản lý memory. Developer không cần (và không thể) malloc/free như C.

**🔧 HOW**

```
┌─────────────────────────────────────────┐
│         MEMORY LIFECYCLE                │
├─────────────────────────────────────────┤
│                                         │
│  1. ALLOCATE   →   2. USE   →   3. FREE │
│   (tạo biến)     (đọc/ghi)    (GC thu)  │
│                                         │
│  ┌─────────┐    ┌─────────┐             │
│  │  Stack  │    │  Heap   │             │
│  │ (nhanh) │    │ (chậm)  │             │
│  │primitives│   │ objects │             │
│  └─────────┘    └─────────┘             │
│                                         │
└─────────────────────────────────────────┘
```

**Garbage Collection** dùng thuật toán "Mark-and-Sweep":

1. **Mark** - Đánh dấu tất cả objects có thể reach được từ root
2. **Sweep** - Xóa objects không được đánh dấu

**💡 WHY (Tại sao cần hiểu?)**

- **Memory Leaks** - Vẫn xảy ra nếu giữ reference không cần thiết
- **Performance** - GC pause có thể ảnh hưởng UX
- **Debugging** - Hiểu memory để debug leaks

**Common Memory Leaks:**

- Forgotten event listeners
- Closures giữ reference lớn
- Global variables
- Detached DOM elements
- Circular references (xưa, modern GC đã handle)

---

## 3. Rendering Pipeline

### 3.1 Critical Rendering Path

**❓ WHAT**

Đây là chuỗi các bước browser thực hiện để chuyển HTML/CSS/JS thành pixels trên màn hình.

**🔧 HOW**

```
┌─────────────────────────────────────────────────────────────┐
│                  CRITICAL RENDERING PATH                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  HTML ──▶ DOM Tree                                          │
│                    ╲                                         │
│                     ╲──▶ Render Tree ──▶ Layout ──▶ Paint   │
│                     ╱                                        │
│  CSS ──▶ CSSOM     ╱                                        │
│                                                              │
│  JavaScript có thể block cả DOM và CSSOM!                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Các bước chi tiết:**

| Bước            | Làm gì                  | Expensive? |
| --------------- | ----------------------- | ---------- |
| **DOM**         | Parse HTML thành tree   | Medium     |
| **CSSOM**       | Parse CSS thành rules   | Medium     |
| **Render Tree** | Kết hợp DOM + CSSOM     | Low        |
| **Layout**      | Tính vị trí, kích thước | HIGH       |
| **Paint**       | Vẽ pixels               | HIGH       |
| **Composite**   | Ghép layers             | Low        |

**💡 WHY (Tại sao quan trọng?)**

- **Layout Thrashing** - Đọc/ghi DOM xen kẽ gây re-layout liên tục
- **Animation Performance** - Chỉ animate `transform`, `opacity` (chỉ composite)
- **Loading Optimization** - Hiểu blocking resources

**🎯 Mental Model:**

> Browser như họa sĩ: Đọc script (DOM) → Hiểu style (CSSOM) → Phác thảo (Layout) → Tô màu (Paint)

---

### 3.2 Reflow vs Repaint

**❓ WHAT**

- **Reflow (Layout)**: Tính lại geometry (vị trí, size)
- **Repaint**: Vẽ lại pixels (màu, shadow)

**🔧 HOW**

```
                    EXPENSIVE
                        ▲
                        │
┌───────────────────────┼───────────────────────┐
│                       │                       │
│   REFLOW              │        REPAINT        │
│   - width/height      │        - color        │
│   - position          │        - background   │
│   - margin/padding    │        - visibility   │
│   - font-size         │        - shadow       │
│   - DOM add/remove    │                       │
│                       │                       │
│                       │        COMPOSITE      │
│                       │        - transform    │
│                       │        - opacity      │
│                       ▼                       │
│                    CHEAP                      │
└───────────────────────────────────────────────┘
```

**💡 WHY**

Reflow trigger Repaint, nhưng không ngược lại!

**Best Practice:**

- Batch DOM reads, then batch DOM writes
- Use `transform` instead of `top/left` for animations
- Use `will-change` to hint browser

---

## 4. React Philosophy

### 4.1 Declarative vs Imperative

**❓ WHAT**

- **Imperative**: Nói _cách_ làm từng bước
- **Declarative**: Nói _muốn_ kết quả gì

**🔧 HOW**

```
┌─────────────────────────────────────────┐
│          IMPERATIVE (jQuery)            │
├─────────────────────────────────────────┤
│ 1. Tìm element                          │
│ 2. Check condition                      │
│ 3. Add class nếu true                   │
│ 4. Remove class nếu false               │
│ 5. Update text content                  │
│                                         │
│ → Developer quản lý MỌI THỨ             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│          DECLARATIVE (React)            │
├─────────────────────────────────────────┤
│ "Nếu isActive thì render như này,       │
│  không thì render như kia"              │
│                                         │
│ → React lo việc UPDATE như thế nào      │
└─────────────────────────────────────────┘
```

**💡 WHY React chọn Declarative?**

- **Predictable** - UI = f(state), cùng state → cùng UI
- **Less Bugs** - Không quên update edge cases
- **Maintainable** - Dễ đọc, dễ reason about

---

### 4.2 Virtual DOM: Tại Sao Cần?

**❓ WHAT**

Virtual DOM là representation của UI trong memory, không phải DOM thật.

**🔧 HOW**

```
┌───────────────────────────────────────────────────┐
│                                                   │
│  State Change                                     │
│       │                                           │
│       ▼                                           │
│  ┌─────────────┐                                  │
│  │ New Virtual │    ┌─────────────┐               │
│  │    DOM      │───▶│   DIFFING   │               │
│  └─────────────┘    │  Algorithm  │               │
│                     └─────────────┘               │
│  ┌─────────────┐          │                       │
│  │ Old Virtual │──────────┘                       │
│  │    DOM      │                                  │
│  └─────────────┘          │                       │
│                           ▼                       │
│                    Only changed parts             │
│                    update Real DOM                │
│                                                   │
└───────────────────────────────────────────────────┘
```

**💡 WHY (Không update Real DOM trực tiếp?)**

- **DOM operations slow** - Mỗi lần touch DOM = potential reflow
- **Batch updates** - Gom nhiều thay đổi, update 1 lần
- **Predictable** - So sánh cây để biết chính xác cần thay đổi gì
- **Cross-platform** - Same abstraction cho web, native, v.v.

**Myth Busting:**

> Virtual DOM KHÔNG nhanh hơn DOM thật. Nó nhanh hơn _naive DOM manipulation_ (update mọi thứ mỗi lần).

---

### 4.3 React Fiber: Vấn Đề Gì Nó Giải Quyết?

**❓ WHAT**

Fiber là React's reimplementation of reconciliation algorithm (từ React 16).

**🔧 HOW (Vấn đề cũ)**

```
┌─────────────────────────────────────────┐
│     STACK RECONCILER (cũ)               │
├─────────────────────────────────────────┤
│                                         │
│  Start ────────────────────────▶ End    │
│         BLOCKING! Cannot pause          │
│                                         │
│  Nếu tree lớn → Main thread bị block   │
│  → Janky animations, unresponsive UI    │
│                                         │
└─────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────┐
│     FIBER RECONCILER (mới)              │
├─────────────────────────────────────────┤
│                                         │
│  Work ──► Pause ──► Work ──► Pause     │
│                                         │
│  Chia work thành units nhỏ             │
│  Có thể pause để handle user input     │
│  Priority-based scheduling              │
│                                         │
└─────────────────────────────────────────┘
```

**💡 WHY**

- **Concurrent Features** - Suspense, Transitions work
- **Better UX** - UI responsive during heavy updates
- **Interruptible** - High priority updates (clicks) không bị block

---

## 5. State Management Philosophy

### 5.1 Khi Nào Cần State Management Library?

**❓ WHAT**

State management library (Redux, Zustand...) quản lý state tập trung, thay vì rải rác trong components.

**🔧 HOW (Quyết định)**

```
┌─────────────────────────────────────────────────────┐
│            STATE MANAGEMENT DECISION TREE           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  State chỉ dùng trong 1 component?                  │
│     └── YES → useState                              │
│     └── NO  ↓                                       │
│                                                     │
│  State share giữa vài components gần nhau?          │
│     └── YES → Lift state up hoặc Context           │
│     └── NO  ↓                                       │
│                                                     │
│  State cần ở nhiều nơi không related?               │
│     └── YES → State management library             │
│                                                     │
│  Server state (data từ API)?                        │
│     └── YES → React Query / SWR / RTK Query        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**💡 WHY (Không phải lúc nào cũng cần Redux?)**

- **Over-engineering** - Simple app không cần complexity
- **Context API** - Đủ cho nhiều use cases
- **Server State ≠ Client State** - Khác tools cho khác mục đích

---

### 5.2 Unidirectional Data Flow

**❓ WHAT**

Data chỉ chảy một chiều: State → View → Action → State

**🔧 HOW**

```
┌─────────────────────────────────────────┐
│                                         │
│      ┌──────────┐                       │
│      │  STATE   │                       │
│      └────┬─────┘                       │
│           │ (data flows down)           │
│           ▼                             │
│      ┌──────────┐                       │
│      │   VIEW   │                       │
│      └────┬─────┘                       │
│           │ (events flow up)            │
│           ▼                             │
│      ┌──────────┐                       │
│      │  ACTION  │                       │
│      └────┬─────┘                       │
│           │ (updates state)             │
│           └────────────────┐            │
│                            │            │
│      ┌──────────┐          │            │
│      │  STATE   │◀─────────┘            │
│      └──────────┘ (new state)           │
│                                         │
└─────────────────────────────────────────┘
```

**💡 WHY**

- **Predictable** - Dễ trace data đi đâu
- **Debuggable** - Time-travel debugging possible
- **Testable** - Pure functions = easy testing

---

## 6. Web Security Concepts

### 6.1 Same-Origin Policy

**❓ WHAT**

Browser ngăn scripts từ origin A truy cập resources từ origin B.

**Origin = Protocol + Host + Port**

| URL                        | Same Origin với `https://example.com`? |
| -------------------------- | -------------------------------------- |
| `https://example.com/page` | ✅ Yes                                 |
| `http://example.com`       | ❌ No (protocol)                       |
| `https://api.example.com`  | ❌ No (host)                           |
| `https://example.com:8080` | ❌ No (port)                           |

**💡 WHY**

- **Security** - Ngăn malicious site đọc data của site khác
- **Privacy** - Cookies, localStorage isolated
- **Without it** - Any site có thể đọc banking session của bạn!

---

### 6.2 XSS vs CSRF: Sự Khác Biệt

**❓ WHAT**

|               | XSS                     | CSRF                          |
| ------------- | ----------------------- | ----------------------------- |
| **Full name** | Cross-Site Scripting    | Cross-Site Request Forgery    |
| **Attack**    | Inject malicious script | Trick user vào making request |
| **Target**    | Steal data từ user      | Perform actions as user       |

**🔧 HOW**

```
┌─────────────────────────────────────────┐
│                   XSS                   │
├─────────────────────────────────────────┤
│                                         │
│  Attacker → Inject <script> → Website  │
│                                         │
│  User visits → Script runs →            │
│  Steal cookies, redirect, keylog        │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│                  CSRF                   │
├─────────────────────────────────────────┤
│                                         │
│  User logged into Bank.com              │
│                                         │
│  User visits evil.com →                 │
│  evil.com has hidden form →             │
│  Form auto-submits to Bank.com →        │
│  Bank.com thinks it's user's request!   │
│                                         │
└─────────────────────────────────────────┘
```

**💡 WHY (Cần hiểu cả hai)**

- **XSS Prevention**: Escape output, CSP, sanitize input
- **CSRF Prevention**: CSRF tokens, SameSite cookies

---

## 7. Performance Theory

### 7.1 Core Web Vitals: Tại Sao Metric Này?

**❓ WHAT**

Google định nghĩa 3 metrics đo lường UX:

| Metric  | Đo gì?              | Target  |
| ------- | ------------------- | ------- |
| **LCP** | Loading performance | < 2.5s  |
| **FID** | Interactivity       | < 100ms |
| **CLS** | Visual stability    | < 0.1   |

**💡 WHY (Tại sao 3 này?)**

- **LCP** - User muốn thấy content nhanh
- **FID** - User muốn tương tác được ngay
- **CLS** - User ghét layout shift (bấm nhầm!)

**🎯 Mental Model:**

> LCP = "Bao lâu tôi phải chờ?"
> FID = "Sao bấm không được?"
> CLS = "Ủa button đi đâu rồi?"

---

### 7.2 Code Splitting: Khi Nào Cần?

**❓ WHAT**

Chia bundle lớn thành chunks nhỏ, load khi cần.

**🔧 HOW (Decision)**

```
┌─────────────────────────────────────────┐
│           SPLIT HAY KHÔNG?              │
├─────────────────────────────────────────┤
│                                         │
│  Route-based splitting:                 │
│    → LUÔN LUÔN split by routes          │
│                                         │
│  Component-based splitting:             │
│    → Heavy components (editors, charts) │
│    → Below-the-fold components          │
│    → Conditionally rendered modals      │
│                                         │
│  KHÔNG nên split:                       │
│    → Core UI components                 │
│    → Frequently used utilities          │
│    → Small components                   │
│                                         │
└─────────────────────────────────────────┘
```

**💡 WHY**

- **Faster initial load** - Chỉ load code cần thiết
- **Trade-off** - Thêm network requests, complexity

---

## 8. Architecture Thinking

### 8.1 When to Abstract?

**Rule of Three:**

> Đợi đến lần thứ 3 gặp pattern tương tự rồi mới abstract.

**❓ WHAT (Signs cần abstract)**

- Copy-paste code lần thứ 3
- Change 1 chỗ phải change nhiều chỗ khác
- Logic business bị mix với UI

**💡 WHY (Không abstract sớm?)**

- **Wrong Abstraction worse than Duplication**
- **Requirements change** - Abstract quá sớm có thể sai hướng
- **Readability** - Direct code dễ đọc hơn abstraction phức tạp

---

### 8.2 Composition over Inheritance

**❓ WHAT**

Thay vì extend class, **compose** từ các pieces nhỏ.

**🔧 HOW**

```
┌─────────────────────────────────────────┐
│              INHERITANCE                │
├─────────────────────────────────────────┤
│                                         │
│  Animal                                 │
│    └── Dog                              │
│         └── GoldenRetriever             │
│              └── TherapyDog             │
│                                         │
│  Problem: TherapyDog cần swim ability   │
│  nhưng không phải GoldenRetriever nào   │
│  cũng swim                              │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│              COMPOSITION                │
├─────────────────────────────────────────┤
│                                         │
│  createDog({                            │
│    canSwim: true,                       │
│    isTherapy: true,                     │
│    breed: 'goldenRetriever'             │
│  })                                     │
│                                         │
│  Linh hoạt hơn!                         │
│                                         │
└─────────────────────────────────────────┘
```

**💡 WHY React ưa thích Composition**

- **Flexible** - Combine behaviors tùy ý
- **No diamond problem** - Multiple inheritance issues
- **Clear data flow** - Props rõ ràng hơn inherited state

---

## 📊 Summary: Mental Models

```
┌─────────────────────────────────────────┐
│          KEY MENTAL MODELS              │
├─────────────────────────────────────────┤
│                                         │
│  Event Loop:                            │
│    "Nhà hàng 1 đầu bếp với timers"      │
│                                         │
│  Closure:                               │
│    "Hộp quà với ghi chú bên trong"      │
│                                         │
│  Virtual DOM:                           │
│    "So sánh ảnh mới/cũ, chỉ sửa khác"   │
│                                         │
│  Fiber:                                 │
│    "Chia việc nhỏ, có thể dừng giữa"    │
│                                         │
│  State Flow:                            │
│    "Nước chảy xuống, events nổi lên"    │
│                                         │
│  Same-Origin:                           │
│    "Nhà bạn, quy tắc của bạn"           │
│                                         │
└─────────────────────────────────────────┘
```

---

> **🎯 Tip: Hiểu bản chất (WHY) quan trọng hơn nhớ syntax!**
>
> **Chúc bạn phỏng vấn thành công! 🎉**
>
> _Tài liệu được tạo: 24/12/2025_
