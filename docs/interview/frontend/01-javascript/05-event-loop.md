# Event Loop - Trái Tim Của JavaScript Async

> Event Loop là cơ chế cho phép JavaScript single-threaded xử lý async operations. Đây là topic **BẮT BUỘC** phải master cho mọi frontend interview.

---

## Mục Lục

- [Overview](#-overview)
- [What - Định Nghĩa](#-what---định-nghĩa)
- [Why - Tại Sao Quan Trọng](#-why---tại-sao-quan-trọng)
- [How - Cách Hoạt Động](#-how---cách-hoạt-động)
- [Microtasks vs Macrotasks](#-microtasks-vs-macrotasks)
- [Câu Hỏi Phỏng Vấn](#-câu-hỏi-phỏng-vấn-thường-gặp)

---

## 🎯 Overview

**Event Loop** là cơ chế cho phép JavaScript thực thi code, thu thập và xử lý events, và thực thi queued sub-tasks. Nó liên tục kiểm tra Call Stack và Task Queues để quyết định code nào được chạy tiếp theo.

### Sơ Đồ Tổng Quan

```
┌─────────────────────────────────────────────────────────────────────┐
│                         JavaScript Runtime                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────┐         ┌──────────────────────────────────────┐   │
│  │             │         │           Web APIs / Node APIs        │   │
│  │  Call Stack │         │  • setTimeout    • fetch              │   │
│  │             │         │  • DOM Events    • FileSystem         │   │
│  │  [current]  │         │  • XMLHttpRequest                     │   │
│  │  [frame]    │         └──────────────────┬───────────────────┘   │
│  │  [frame]    │                            │                        │
│  └──────┬──────┘                            │                        │
│         │                                   ▼                        │
│         │         ┌─────────────────────────────────────────────┐   │
│         │         │            Callback Queues                    │   │
│         │         ├─────────────────────────────────────────────┤   │
│         │         │  Microtask Queue (Job Queue)                 │   │
│         │         │  • Promise.then/catch/finally                │   │
│         │         │  • queueMicrotask()                          │   │
│         │         │  • MutationObserver                          │   │
│         │         ├─────────────────────────────────────────────┤   │
│         │         │  Macrotask Queue (Task Queue)                │   │
│         │         │  • setTimeout / setInterval                  │   │
│         │         │  • setImmediate (Node.js)                    │   │
│         │         │  • I/O callbacks                             │   │
│         │         │  • UI rendering                              │   │
│         │         └──────────────────┬──────────────────────────┘   │
│         │                            │                               │
│         │      ┌─────────────────────┴─────────────────────┐        │
│         │      │              EVENT LOOP                    │        │
│         └──────│  1. Execute Call Stack until empty         │        │
│                │  2. Execute ALL Microtasks                 │        │
│                │  3. Execute ONE Macrotask                  │        │
│                │  4. Repeat                                 │        │
│                └────────────────────────────────────────────┘        │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📖 What - Định Nghĩa

### JavaScript Runtime Components

#### 1. Call Stack
- Cấu trúc LIFO (Last In, First Out)
- Chứa các Execution Contexts
- Một function call = một frame trong stack
- JavaScript thực thi code ở top của stack

```javascript
function a() { b(); }
function b() { c(); }
function c() { console.log("done"); }
a();

// Stack: [a] → [b, a] → [c, b, a] → [b, a] → [a] → []
```

#### 2. Heap
- Nơi objects được allocated
- Unstructured memory region
- Garbage Collection xảy ra ở đây

#### 3. Web APIs (Browser) / Node APIs
- setTimeout, setInterval
- DOM Events
- fetch, XMLHttpRequest
- FileSystem (Node.js)

Các APIs này chạy **ngoài** JavaScript engine, trong environment (browser/Node).

#### 4. Callback Queues
- **Microtask Queue**: Promise callbacks, queueMicrotask
- **Macrotask Queue**: setTimeout, setInterval, I/O

#### 5. Event Loop
- Liên tục kiểm tra: "Call Stack empty chưa?"
- Nếu empty → Xử lý microtasks → Lấy 1 macrotask

---

## 🤔 Why - Tại Sao Quan Trọng

### JavaScript là Single-Threaded

JavaScript chỉ có **một** Call Stack = chỉ làm **một** việc tại một thời điểm.

**Vấn đề:** Nếu có operation chậm (network request, file I/O), toàn bộ app sẽ bị block.

**Giải pháp:** Async + Event Loop
- Delegate slow operations cho Web APIs
- Tiếp tục xử lý code khác
- Khi operation xong → callback vào queue → Event Loop đưa vào stack

### Trong Phỏng Vấn

**100% phỏng vấn Big Tech hỏi về Event Loop:**
- Google: Vẽ diagram, giải thích flow
- Meta: Predict output của async code
- Amazon: Microtasks vs Macrotasks

---

## 🔧 How - Cách Hoạt Động

### Event Loop Algorithm

```
while (true) {
    // 1. Execute Call Stack until empty
    while (callStack.isNotEmpty()) {
        execute(callStack.pop());
    }

    // 2. Execute ALL microtasks
    while (microtaskQueue.isNotEmpty()) {
        execute(microtaskQueue.dequeue());
    }

    // 3. Render (if needed, browser only)
    if (needsRender()) {
        render();
    }

    // 4. Execute ONE macrotask
    if (macrotaskQueue.isNotEmpty()) {
        execute(macrotaskQueue.dequeue());
    }
}
```

### Step-by-Step Example

```javascript
console.log('1');

setTimeout(() => {
    console.log('2');
}, 0);

Promise.resolve().then(() => {
    console.log('3');
});

console.log('4');

// Output: 1, 4, 3, 2
```

**Giải thích chi tiết:**

```
STEP 1: Call Stack = [main]
        Execute: console.log('1') → Output: 1

STEP 2: Call Stack = [main]
        setTimeout detected → callback vào Macrotask Queue
        Macrotask Queue = [() => console.log('2')]

STEP 3: Call Stack = [main]
        Promise.resolve().then() → callback vào Microtask Queue
        Microtask Queue = [() => console.log('3')]

STEP 4: Call Stack = [main]
        Execute: console.log('4') → Output: 4

STEP 5: Call Stack = [] (main finished)
        Event Loop checks: Stack empty? YES

STEP 6: Process ALL Microtasks
        Microtask: console.log('3') → Output: 3
        Microtask Queue = []

STEP 7: Process ONE Macrotask
        Macrotask: console.log('2') → Output: 2
        Macrotask Queue = []

Final Output: 1, 4, 3, 2
```

### Visualization Timeline

```
Time →  0ms                                          ~0ms (next tick)
        │                                            │
        │  console.log('1')    ─────────────────────►│
        │  setTimeout(cb, 0)   ──► [Timer API]       │
        │  Promise.then(cb)    ──► [Microtask Q]     │
        │  console.log('4')    ─────────────────────►│
        │                                            │
        │  [Stack Empty]                             │
        │                                            │
        │  ◄── Microtask: console.log('3') ─────────│
        │                                            │
        │  ◄── Macrotask: console.log('2') ─────────│
        │                                            │
```

---

## 🔄 Microtasks vs Macrotasks

### Phân Loại

| Microtasks | Macrotasks |
|------------|------------|
| Promise.then/catch/finally | setTimeout |
| queueMicrotask() | setInterval |
| MutationObserver | setImmediate (Node) |
| process.nextTick (Node) | I/O callbacks |
| | UI rendering |
| | requestAnimationFrame |

### Quy Tắc Quan Trọng

```
1. Microtasks có PRIORITY cao hơn Macrotasks
2. TẤT CẢ microtasks được xử lý trước khi BẤT KỲ macrotask nào
3. Microtasks có thể spawn thêm microtasks (có thể block)
```

### Complex Example

```javascript
console.log('script start');

setTimeout(() => {
    console.log('setTimeout 1');
    Promise.resolve().then(() => {
        console.log('promise inside setTimeout');
    });
}, 0);

Promise.resolve()
    .then(() => {
        console.log('promise 1');
    })
    .then(() => {
        console.log('promise 2');
    });

setTimeout(() => {
    console.log('setTimeout 2');
}, 0);

console.log('script end');
```

**Output:**
```
script start
script end
promise 1
promise 2
setTimeout 1
promise inside setTimeout
setTimeout 2
```

**Giải thích:**
1. Sync code: "script start", "script end"
2. Microtasks: "promise 1", "promise 2" (chained)
3. Macrotask 1: "setTimeout 1"
4. Microtask (spawned): "promise inside setTimeout"
5. Macrotask 2: "setTimeout 2"

### Nested Microtasks Warning

```javascript
function recursiveMicrotask() {
    Promise.resolve().then(() => {
        console.log('microtask');
        recursiveMicrotask(); // ⚠️ DANGER!
    });
}
recursiveMicrotask();

// Microtasks never end → macrotasks NEVER run
// Browser becomes unresponsive!
```

---

## 🌐 Browser Rendering & Event Loop

### Render Steps

```
┌──────────────────────────────────────────────────────────────┐
│                    Browser Frame (~16.67ms @ 60fps)           │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Task   │→│Microtasks │→│requestAni│→│    Render     │   │
│  │ (macro) │  │   (all)  │  │mationFrame│  │Style│Layout│Paint│
│  └─────────┘  └──────────┘  └──────────┘  └──────────────┘   │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

### requestAnimationFrame

```javascript
// rAF runs BEFORE paint, after microtasks
function animate() {
    element.style.transform = `translateX(${x}px)`;
    x += 10;
    if (x < 500) {
        requestAnimationFrame(animate);
    }
}
requestAnimationFrame(animate);
```

**rAF vs setTimeout for animations:**
- rAF: Synced với display refresh, smooth animations
- setTimeout: Not synced, can cause jank

---

## 💻 Practical Examples

### Example 1: Order Prediction

```javascript
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve()
    .then(() => console.log('C'))
    .then(() => console.log('D'));

setTimeout(() => console.log('E'), 0);

Promise.resolve()
    .then(() => {
        console.log('F');
        setTimeout(() => console.log('G'), 0);
    });

console.log('H');
```

**Output:** A, H, C, F, D, B, E, G

### Example 2: async/await

```javascript
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}

async function async2() {
    console.log('async2');
}

console.log('script start');
setTimeout(() => console.log('setTimeout'), 0);
async1();
new Promise(resolve => {
    console.log('promise1');
    resolve();
}).then(() => {
    console.log('promise2');
});
console.log('script end');
```

**Output:**
```
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
```

**Key insight:** Code sau `await` được wrap trong `.then()` → microtask

### Example 3: Real-world Use Case

```javascript
// Debounce with microtask batching
let pending = false;
let updates = [];

function batchUpdate(update) {
    updates.push(update);

    if (!pending) {
        pending = true;
        queueMicrotask(() => {
            // Process all updates in one batch
            const toProcess = updates;
            updates = [];
            pending = false;

            toProcess.forEach(u => u());
            console.log('Batch processed', toProcess.length, 'updates');
        });
    }
}

batchUpdate(() => console.log('update 1'));
batchUpdate(() => console.log('update 2'));
batchUpdate(() => console.log('update 3'));

// All 3 updates processed in single microtask
// Output:
// update 1
// update 2
// update 3
// Batch processed 3 updates
```

---

## ❓ Câu Hỏi Phỏng Vấn Thường Gặp

### 🟢 Junior

**Q: Event Loop là gì?**

A: Event Loop là cơ chế cho phép JavaScript single-threaded xử lý async operations. Nó liên tục kiểm tra Call Stack - nếu empty, nó sẽ lấy tasks từ các queues để execute.

**Q: setTimeout(fn, 0) có chạy ngay lập tức không?**

A: Không. `setTimeout(fn, 0)` đưa callback vào Macrotask Queue. Nó chỉ chạy sau khi:
1. Call Stack empty
2. TẤT CẢ microtasks đã chạy xong

### 🟡 Mid-level

**Q: Microtasks và Macrotasks khác nhau như thế nào?**

A:
- **Microtasks**: Promise callbacks, queueMicrotask - chạy TẤT CẢ trước khi bất kỳ macrotask nào
- **Macrotasks**: setTimeout, I/O - chỉ chạy MỘT rồi lại check microtasks

```javascript
setTimeout(() => console.log('macro'), 0);
Promise.resolve().then(() => console.log('micro'));
// Output: micro, macro
```

**Q: Predict output:**

```javascript
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
Promise.resolve().then(() => setTimeout(() => console.log(4), 0));
Promise.resolve().then(() => console.log(5));
setTimeout(() => console.log(6), 0);
console.log(7);
```

A: 1, 7, 3, 5, 2, 6, 4

### 🔴 Senior

**Q: Giải thích Node.js Event Loop phases**

A: Node.js Event Loop có 6 phases:
1. **timers**: setTimeout, setInterval callbacks
2. **pending callbacks**: I/O callbacks deferred từ previous iteration
3. **idle, prepare**: internal use
4. **poll**: retrieve new I/O events, execute I/O callbacks
5. **check**: setImmediate callbacks
6. **close callbacks**: socket.on('close')

```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

**Q: Tại sao nên dùng queueMicrotask thay vì setTimeout(fn, 0)?**

A:
1. **Timing**: Microtask chạy ngay sau current task, trước render
2. **Performance**: Không cần minimum 4ms delay của setTimeout
3. **Use case**: Batch updates, cleanup before render

---

## 📚 Active Recall Questions

1. [ ] Vẽ diagram của Event Loop
2. [ ] Liệt kê các loại Microtasks và Macrotasks
3. [ ] Giải thích tại sao microtasks có priority cao hơn
4. [ ] Predict output của 3 async code snippets
5. [ ] requestAnimationFrame chạy ở phase nào?
6. [ ] Recursive microtask gây vấn đề gì?

---

## 🎯 Tài Nguyên

### Must Watch
- [What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ) - Philip Roberts (JSConf)
- [Jake Archibald: In The Loop](https://www.youtube.com/watch?v=cCOL7MC4Pl0)

### Interactive
- [JavaScript Visualizer 9000](https://www.jsv9000.app/)
- [Loupe](http://latentflip.com/loupe/)

### Articles
- [MDN: Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
- [JavaScript.info: Event Loop](https://javascript.info/event-loop)

---

> **Tiếp theo:** [06-async-programming.md](./06-async-programming.md) - Promises & async/await
