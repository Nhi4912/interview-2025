# 📚 Tài Liệu Phỏng Vấn Frontend 2025 - Phần 6

> **Chủ đề**: 🔗 Kết Nối Kiến Thức - Cái Nhìn Toàn Diện
>
> _Tài liệu này giúp bạn hiểu MỐI QUAN HỆ giữa các concepts, giúp nhớ lâu hơn_

---

## 🎯 Mục Tiêu

Thay vì học từng concept riêng lẻ, tài liệu này sẽ giúp bạn:

1. **Hiểu WHY** - Tại sao concept này tồn tại?
2. **Hiểu HOW** - Nó hoạt động như thế nào trong bức tranh lớn?
3. **Hiểu WHEN** - Khi nào áp dụng?
4. **Kết nối** - Concept này liên quan đến những gì khác?

---

## 📋 Mục Lục

1. [The Big Picture - Bức Tranh Toàn Cảnh](#1-the-big-picture)
2. [JavaScript Runtime: Từ Code đến Execution](#2-javascript-runtime)
3. [Async Programming: Câu Chuyện Hoàn Chỉnh](#3-async-programming-story)
4. [React: Từ DOM đến Virtual DOM](#4-react-evolution)
5. [Data Flow: Từ Server đến UI](#5-data-flow)
6. [Performance: Mọi Thứ Kết Nối](#6-performance-connections)
7. [Memory Map: Kiến Thức Liên Kết](#7-memory-map)

---

## 1. The Big Picture - Bức Tranh Toàn Cảnh

### 1.1 Frontend Development Flow

```mermaid
flowchart TB
    subgraph UserAction["👤 User Action"]
        Click["Click, Type, Scroll"]
    end

    subgraph Browser["🌐 Browser"]
        DOM["DOM"]
        CSSOM["CSSOM"]
        JS["JavaScript Engine"]
        Render["Render Engine"]
    end

    subgraph Network["🌍 Network"]
        HTTP["HTTP/HTTPS"]
        API["REST/GraphQL"]
        WS["WebSocket"]
    end

    subgraph Server["🖥️ Server"]
        Backend["Backend API"]
        DB["Database"]
    end

    UserAction --> DOM
    DOM --> JS
    JS --> HTTP
    HTTP --> Backend
    Backend --> DB
    DB --> Backend
    Backend --> HTTP
    HTTP --> JS
    JS --> DOM
    DOM --> Render
    Render --> UserAction
```

> [!IMPORTANT] > **Ghi nhớ**: Mọi thứ trong frontend đều xoay quanh vòng lặp này:
> **User → Browser → Network → Server → Network → Browser → User**

### 1.2 Tại Sao Cần Hiểu Connections?

| Khi bạn hiểu... | Bạn sẽ hiểu tại sao...                    |
| --------------- | ----------------------------------------- |
| Event Loop      | Promise callbacks chạy trước setTimeout   |
| V8 Engine       | Tại sao hidden classes tối ưu performance |
| Virtual DOM     | React không re-render toàn bộ DOM         |
| Closure         | State trong React hooks hoạt động         |
| HTTP/2          | Multiplexing giúp load nhanh hơn          |

---

## 2. JavaScript Runtime: Từ Code đến Execution

### 2.1 Journey of Your Code

```mermaid
flowchart LR
    subgraph Write["✍️ Write"]
        Source["Source Code<br/>const x = 1 + 2"]
    end

    subgraph Parse["📖 Parse"]
        Tokens["Tokenize"]
        AST["AST"]
    end

    subgraph Compile["⚙️ Compile"]
        Bytecode["Bytecode<br/>(Ignition)"]
        Optimize["Machine Code<br/>(TurboFan)"]
    end

    subgraph Execute["▶️ Execute"]
        Stack["Call Stack"]
        Heap["Heap Memory"]
    end

    Source --> Tokens --> AST --> Bytecode --> Stack
    Bytecode -.->|"Hot code"| Optimize --> Stack
```

### 2.2 Kết Nối: Engine → Memory → Garbage Collection

```mermaid
flowchart TB
    subgraph Engine["⚙️ JS Engine"]
        Parser["Parser"]
        Compiler["Compiler"]
    end

    subgraph Memory["💾 Memory"]
        Stack["Stack<br/>(Primitives, References)"]
        Heap["Heap<br/>(Objects, Functions)"]
    end

    subgraph GC["🗑️ Garbage Collection"]
        Mark["Mark reachable"]
        Sweep["Sweep unreachable"]
    end

    subgraph Concept["💡 Related Concepts"]
        Closure["Closure giữ reference<br/>→ Object sống trong Heap"]
        Leak["Memory Leak<br/>→ Object không được GC"]
    end

    Engine --> Memory
    Memory --> GC
    GC --> Concept
```

### 2.3 Ví Dụ Kết Nối

```javascript
// 1️⃣ Code này tạo gì trong memory?
function createCounter() {
  let count = 0; // Lưu trong Heap (vì closure)

  return function increment() {
    return ++count;
  };
}

const counter = createCounter();
// 'counter' reference lưu trong Stack
// Function object và 'count' lưu trong Heap
// Closure giữ 'count' sống → GC không xóa

counter(); // 1
counter(); // 2

// 2️⃣ Nếu set counter = null
counter = null;
// Không còn reference đến closure
// GC sẽ xóa function và count khỏi Heap
```

> [!TIP] > **Ghi nhớ chuỗi**:
> Code → Parse → Compile → Execute trong Stack → Objects trong Heap → GC dọn Heap

---

## 3. Async Programming: Câu Chuyện Hoàn Chỉnh

### 3.1 Vấn Đề Gốc: JavaScript là Single-Threaded

```mermaid
flowchart TB
    subgraph Problem["❌ Vấn đề"]
        SingleThread["JS chạy single-thread"]
        Block["Nếu chờ API → Block UI"]
        Bad["User experience tệ"]
    end

    subgraph Solution["✅ Giải pháp"]
        EventLoop["Event Loop"]
        Async["Async/Non-blocking"]
        Good["UI vẫn responsive"]
    end

    Problem --> Solution
```

### 3.2 Evolution: Callbacks → Promises → Async/Await

```mermaid
flowchart LR
    subgraph Era1["🔴 1995-2015: Callbacks"]
        CB["Callback Hell"]
        Issue1["Pyramid of doom"]
        Issue2["Error handling khó"]
    end

    subgraph Era2["🟡 2015: Promises"]
        Promise["Promise chains"]
        Better1["Flat structure"]
        Better2["Centralized .catch()"]
    end

    subgraph Era3["🟢 2017: Async/Await"]
        Async["async/await"]
        Best1["Sync-like code"]
        Best2["try/catch"]
    end

    Era1 -->|"ES6"| Era2 -->|"ES8"| Era3
```

### 3.3 Event Loop: Kết Nối Tất Cả

```mermaid
flowchart TB
    subgraph CallStack["📚 Call Stack"]
        Sync["Synchronous code<br/>console.log()"]
    end

    subgraph WebAPIs["🌐 Web APIs"]
        Timer["setTimeout"]
        Fetch["fetch()"]
        DOM["DOM events"]
    end

    subgraph Queues["📋 Task Queues"]
        Micro["Micro-task Queue<br/>Promise.then()<br/>queueMicrotask()"]
        Macro["Macro-task Queue<br/>setTimeout<br/>setInterval"]
    end

    subgraph EventLoop["🔄 Event Loop"]
        Check["Check Call Stack empty?"]
        Priority["Micro > Macro"]
    end

    CallStack --> WebAPIs
    WebAPIs --> Queues
    Queues --> EventLoop
    EventLoop --> CallStack
```

### 3.4 Tại Sao Micro-task Ưu Tiên Hơn Macro-task?

```javascript
console.log("1"); // Sync → Call Stack

setTimeout(() => {
  console.log("2"); // Macro-task Queue
}, 0);

Promise.resolve().then(() => {
  console.log("3"); // Micro-task Queue
});

console.log("4"); // Sync → Call Stack

// Output: 1, 4, 3, 2
// WHY? Vì Promise liên quan đến data consistency
// Cần resolve ngay khi có thể để không block data flow
```

> [!IMPORTANT] > **Mental Model**:
>
> - Micro-tasks = "Việc quan trọng, làm ngay khi có thể"
> - Macro-tasks = "Việc có thể đợi, làm khi rảnh"

---

## 4. React: Từ DOM đến Virtual DOM

### 4.1 Vấn Đề với DOM Trực Tiếp

```mermaid
flowchart TB
    subgraph OldWay["❌ Vanilla JS / jQuery"]
        DirectDOM["document.getElementById()"]
        Fragile["Fragile, hard to track"]
        SlowDOM["DOM operations expensive"]
    end

    subgraph ReactWay["✅ React Solution"]
        VDOM["Virtual DOM"]
        Diff["Efficient diffing"]
        Batch["Batched updates"]
    end

    OldWay -->|"React 2013"| ReactWay
```

### 4.2 Chuỗi Kết Nối: State → VDOM → DOM

```mermaid
flowchart LR
    subgraph State["📊 State"]
        useState["useState()"]
        Redux["Redux/Zustand"]
    end

    subgraph VDOM["🔵 Virtual DOM"]
        JSX["JSX → React.createElement()"]
        Tree["Virtual DOM Tree"]
    end

    subgraph Reconcile["⚡ Reconciliation"]
        Diff["Diffing Algorithm"]
        Fiber["React Fiber"]
    end

    subgraph RealDOM["🌐 Real DOM"]
        Minimal["Minimal updates"]
        Paint["Browser paint"]
    end

    State --> VDOM --> Reconcile --> RealDOM
```

### 4.3 Hooks: Closure trong Action

```javascript
// useState uses CLOSURE to remember state between renders
function Counter() {
  // React internally:
  // let hooks = []; let index = 0;

  const [count, setCount] = useState(0);
  // First render: hooks[0] = 0
  // Re-render: return hooks[0] (closure keeps reference)

  useEffect(() => {
    // This function CLOSES OVER 'count'
    document.title = `Count: ${count}`;
  }, [count]);
  // When count changes → new closure created → effect runs

  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

> [!TIP] > **Kết nối**: `useState` hoạt động nhờ Closure!
> React giữ array of hooks, closure giúp access đúng hook mỗi render.

### 4.4 Từ Class Components đến Hooks

```mermaid
flowchart TB
    subgraph Class["📦 Class Components"]
        Lifecycle["componentDidMount<br/>componentDidUpdate<br/>componentWillUnmount"]
        This["this.state, this.props"]
        Verbose["Verbose, boilerplate"]
    end

    subgraph Hooks["🪝 Hooks"]
        UseEffect["useEffect với dependencies"]
        Closure["Closure-based"]
        Concise["Concise, composable"]
    end

    subgraph Mapping["🔄 Mapping"]
        Mount["componentDidMount → useEffect(..., [])"]
        Update["componentDidUpdate → useEffect(..., [deps])"]
        Unmount["componentWillUnmount → useEffect cleanup"]
    end

    Class --> Hooks
    Hooks --> Mapping
```

---

## 5. Data Flow: Từ Server đến UI

### 5.1 Complete Data Journey

```mermaid
flowchart TB
    subgraph Server["🖥️ Server"]
        DB["Database"]
        API["REST/GraphQL API"]
    end

    subgraph Network["🌍 Network Layer"]
        HTTP["HTTP Request"]
        Fetch["fetch() / axios"]
        Response["JSON Response"]
    end

    subgraph State["📊 State Management"]
        ServerState["Server State<br/>(React Query)"]
        ClientState["Client State<br/>(Zustand/Redux)"]
    end

    subgraph Component["⚛️ React Component"]
        Render["Render UI"]
        Event["User Events"]
    end

    DB --> API --> HTTP
    HTTP --> Fetch --> Response
    Response --> ServerState --> Component
    Event --> Fetch
```

### 5.2 Kết Nối: Promise → fetch → React Query

```javascript
// 1️⃣ Low level: Promise với fetch
fetch("/api/users")
  .then((res) => res.json())
  .then((data) => setUsers(data))
  .catch((err) => setError(err));

// 2️⃣ Better: async/await
async function loadUsers() {
  try {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
}

// 3️⃣ Best: React Query (abstracts all above)
const { data, isLoading, error } = useQuery({
  queryKey: ["users"],
  queryFn: () => fetch("/api/users").then((r) => r.json()),
  // Automatic: caching, deduplication, background refetch
});
// React Query uses Promises internally!
```

### 5.3 Tại Sao Server State ≠ Client State?

| Aspect        | Server State     | Client State       |
| ------------- | ---------------- | ------------------ |
| **Source**    | External (API)   | Internal (UI)      |
| **Ownership** | Backend owns     | Frontend owns      |
| **Sync**      | Can be stale     | Always fresh       |
| **Caching**   | Needs strategy   | Usually not needed |
| **Tool**      | React Query, SWR | useState, Zustand  |

```mermaid
flowchart LR
    subgraph ServerState["🌐 Server State"]
        Users["Users list"]
        Products["Products"]
        Comments["Comments"]
    end

    subgraph ClientState["📱 Client State"]
        Modal["Modal open/close"]
        Theme["Dark/Light theme"]
        Form["Form inputs"]
    end

    subgraph Tools["🔧 Right Tool"]
        RQ["React Query"]
        Zustand["Zustand"]
    end

    ServerState --> RQ
    ClientState --> Zustand
```

---

## 6. Performance: Mọi Thứ Kết Nối

### 6.1 Performance Web = Tổng Hợp Mọi Kiến Thức

```mermaid
flowchart TB
    subgraph JS["⚡ JavaScript"]
        EventLoop["Event Loop → Non-blocking"]
        Closure["Closure → Memory management"]
        Async["Async → Don't block main thread"]
    end

    subgraph React["⚛️ React"]
        VDOM["Virtual DOM → Minimal updates"]
        Memo["React.memo → Prevent re-renders"]
        Lazy["React.lazy → Code splitting"]
    end

    subgraph Browser["🌐 Browser"]
        CRP["Critical Rendering Path"]
        Reflow["Avoid Reflow/Repaint"]
        GPU["Use GPU (transform, opacity)"]
    end

    subgraph Network["🌍 Network"]
        HTTP2["HTTP/2 Multiplexing"]
        CDN["CDN → Edge caching"]
        Compression["Gzip/Brotli"]
    end

    JS --> CWV["Core Web Vitals"]
    React --> CWV
    Browser --> CWV
    Network --> CWV
```

### 6.2 Core Web Vitals: Kết Quả của Tất Cả

| Metric          | Đo gì                  | Cải thiện bằng               |
| --------------- | ---------------------- | ---------------------------- |
| **LCP** < 2.5s  | Largest element loaded | SSR, Image optimization, CDN |
| **FID** < 100ms | First input delay      | Code splitting, Web Workers  |
| **CLS** < 0.1   | Layout shifts          | Reserve space, font loading  |

### 6.3 Ví Dụ Kết Nối Toàn Bộ

```javascript
// This code demonstrates ALL connections:

// 1️⃣ React Component (Virtual DOM)
function ProductList() {
  // 2️⃣ React Query (Server State, uses Promises internally)
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts, // 3️⃣ async fetch (Event Loop)
    staleTime: 5 * 60 * 1000, // Caching strategy
  });

  // 4️⃣ useMemo (avoid expensive recalculation)
  const sortedProducts = useMemo(
    () => data?.sort((a, b) => b.rating - a.rating),
    [data]
  );

  // 5️⃣ Virtualization (Browser performance)
  return (
    <VirtualList
      items={sortedProducts}
      renderItem={(product) => (
        // 6️⃣ React.memo (prevent unnecessary re-renders)
        <MemoizedProductCard product={product} />
      )}
    />
  );
}

// 7️⃣ Lazy loading (Code splitting)
const ProductDetails = React.lazy(() => import("./ProductDetails"));
```

---

## 7. Memory Map: Kiến Thức Liên Kết

### 7.1 The Complete Mental Model

```mermaid
mindmap
  root((Frontend<br/>Knowledge))
    JS Engine
      V8/SpiderMonkey
      JIT Compilation
        Ignition
        TurboFan
      Memory
        Stack
        Heap
        GC
    Execution
      Call Stack
      Event Loop
        Micro-tasks
        Macro-tasks
      Async
        Callbacks
        Promises
        async/await
    Language
      Scope
        Closure
        Hoisting
        TDZ
      OOP
        Prototype
        Class
        this
      FP
        Pure functions
        Immutability
    React
      VDOM
        Reconciliation
        Fiber
      Hooks
        useState=Closure
        useEffect=Lifecycle
        useMemo=Memoization
      State
        Local
        Global
        Server
    Browser
      Rendering
        DOM
        CSSOM
        Paint
      Optimization
        Reflow
        Repaint
        Compositor
    Network
      HTTP/2/3
      REST/GraphQL
      WebSocket
```

### 7.2 Câu Chuyện Để Nhớ

> **Hãy tưởng tượng bạn đang xây một ứng dụng Todo:**

1. **User types** → DOM event fires → **Event Loop** picks it up
2. **React component** receives event → calls `setTodos()`
3. **useState** (powered by **Closure**) updates state
4. **Virtual DOM** creates new tree
5. **Reconciliation** (Fiber) diffs old vs new
6. **Minimal DOM updates** applied
7. **Browser repaints** only changed parts
8. User sees update → **feels instant!**

```mermaid
sequenceDiagram
    participant User
    participant EventLoop as Event Loop
    participant React
    participant VDOM as Virtual DOM
    participant Browser

    User->>EventLoop: Type "Buy milk"
    EventLoop->>React: Dispatch event
    React->>React: useState → Closure updates
    React->>VDOM: Create new tree
    VDOM->>VDOM: Diff with old tree
    VDOM->>Browser: Minimal DOM updates
    Browser->>User: Show updated list
    Note over User,Browser: All in ~16ms for 60fps!
```

### 7.3 Quick Reference: Concept Connections

| Concept A       | Kết nối với      | Vì sao?                                |
| --------------- | ---------------- | -------------------------------------- |
| **Closure**     | useState         | Hooks giữ state qua closures           |
| **Event Loop**  | React updates    | State changes queued as microtasks     |
| **Prototype**   | React.Component  | Class inheritance                      |
| **Promise**     | fetch/axios      | Network requests return Promises       |
| **Virtual DOM** | Performance      | Avoid expensive DOM operations         |
| **GC**          | Memory leaks     | Forgotten closures prevent GC          |
| **HTTP/2**      | Bundle splitting | Multiplexing makes many small files OK |

---

## 📝 Cách Sử Dụng Tài Liệu Này

### Khi Ôn Tập

1. **Đọc Big Picture trước** (Section 1)
2. **Đi theo flow**: Engine → Async → React → Data
3. **Mỗi concept, hỏi**: "Cái này kết nối với cái gì?"

### Khi Phỏng Vấn

- Interviewer hỏi về Promise? → Nhắc đến Event Loop, Microtasks
- Hỏi về React re-render? → Nhắc đến Virtual DOM, Reconciliation
- Hỏi về Performance? → Kết nối tất cả: JS Engine, Browser, Network

### Memory Technique

```
🧠 "ENGINE runs EVENT LOOP that handles ASYNC code
    using CLOSURES, affecting REACT state,
    updating VIRTUAL DOM, causing BROWSER to render"
```

---

## 📚 Tài Liệu Tham Khảo

- Phần 1-5 của series này
- [JavaScript Event Loop Visualizer](http://latentflip.com/loupe/)
- [React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture)

---

> **Tip cuối**: Khi học, luôn hỏi "Tại sao?" và "Liên quan đến gì?"
>
> **Chúc bạn phỏng vấn thành công! 🎉**
>
> _Tài liệu được tạo: 23/12/2025_
