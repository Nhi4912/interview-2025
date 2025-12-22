# 📚 Tài Liệu Phỏng Vấn Frontend 2025 - Phần 7

> **Chủ đề**: 🔬 Deep Dive Visualizations - Hiểu Sâu Qua Hình Ảnh

---

## 📋 Mục Lục

1. [JavaScript Execution Deep Dive](#1-javascript-execution-deep-dive)
2. [Memory Management Visualization](#2-memory-management-visualization)
3. [Event Loop Step-by-Step](#3-event-loop-step-by-step)
4. [Promise Internals](#4-promise-internals)
5. [React Fiber Deep Dive](#5-react-fiber-deep-dive)
6. [Browser Rendering Pipeline](#6-browser-rendering-pipeline)
7. [Network Request Lifecycle](#7-network-request-lifecycle)
8. [CSS Cascade & Specificity](#8-css-cascade--specificity)

---

## 1. JavaScript Execution Deep Dive

### 1.1 Code Parsing Flow

```mermaid
flowchart TB
    subgraph Input["📄 Source Code"]
        Code["const sum = (a, b) => a + b;<br/>console.log(sum(1, 2));"]
    end

    subgraph Lexer["🔤 Lexical Analysis (Tokenization)"]
        T1["const → KEYWORD"]
        T2["sum → IDENTIFIER"]
        T3["= → OPERATOR"]
        T4["( → PUNCTUATOR"]
        T5["a → IDENTIFIER"]
        T6[", → PUNCTUATOR"]
        T7["b → IDENTIFIER"]
        T8[") → PUNCTUATOR"]
        T9["=> → ARROW"]
        T10["a → IDENTIFIER"]
        T11["+ → OPERATOR"]
        T12["b → IDENTIFIER"]
    end

    subgraph AST["🌳 Abstract Syntax Tree"]
        Program["Program"]
        VarDecl["VariableDeclaration<br/>kind: const"]
        VarDecltr["VariableDeclarator<br/>id: sum"]
        Arrow["ArrowFunctionExpression"]
        Params["Params: [a, b]"]
        Body["BinaryExpression<br/>operator: +"]
        Left["Identifier: a"]
        Right["Identifier: b"]

        Program --> VarDecl --> VarDecltr --> Arrow
        Arrow --> Params
        Arrow --> Body
        Body --> Left
        Body --> Right
    end

    Input --> Lexer --> AST
```

### 1.2 Execution Context Stack

```mermaid
flowchart TB
    subgraph Code["📄 Code"]
        C1["function outer() {"]
        C2["  let x = 10;"]
        C3["  function inner() {"]
        C4["    let y = 20;"]
        C5["    console.log(x + y);"]
        C6["  }"]
        C7["  inner();"]
        C8["}"]
        C9["outer();"]
    end

    subgraph Stack["📚 Call Stack Evolution"]
        subgraph S1["Step 1"]
            Global1["Global EC"]
        end

        subgraph S2["Step 2: outer() called"]
            Outer2["outer() EC<br/>x = 10"]
            Global2["Global EC"]
        end

        subgraph S3["Step 3: inner() called"]
            Inner3["inner() EC<br/>y = 20"]
            Outer3["outer() EC<br/>x = 10"]
            Global3["Global EC"]
        end

        subgraph S4["Step 4: inner() returns"]
            Outer4["outer() EC<br/>x = 10"]
            Global4["Global EC"]
        end

        subgraph S5["Step 5: outer() returns"]
            Global5["Global EC"]
        end
    end

    S1 --> S2 --> S3 --> S4 --> S5
```

### 1.3 Scope Chain Visualization

```mermaid
flowchart TB
    subgraph Global["🌍 Global Scope"]
        GV["var globalVar = 'global'"]

        subgraph Outer["📦 outer() Scope"]
            OV["let outerVar = 'outer'"]

            subgraph Inner["📦 inner() Scope"]
                IV["let innerVar = 'inner'"]
                Access["✅ Can access:<br/>innerVar<br/>outerVar<br/>globalVar"]
            end
        end
    end

    Inner -.->|"Scope Chain"| Outer
    Outer -.->|"Scope Chain"| Global
```

### 1.4 Variable Lifecycle với TDZ

```mermaid
flowchart LR
    subgraph Timeline["📅 Variable Lifecycle"]
        subgraph TDZ["🔴 Temporal Dead Zone"]
            Created["Variable created<br/>(hoisted)"]
            Uninitialized["Cannot access!<br/>ReferenceError"]
        end

        subgraph Safe["🟢 Safe Zone"]
            Initialized["let x = 10;<br/>Variable initialized"]
            Usable["Can access: x = 10"]
        end
    end

    Created --> Uninitialized --> Initialized --> Usable
```

---

## 2. Memory Management Visualization

### 2.1 Stack vs Heap Memory

```mermaid
flowchart TB
    subgraph Code["📄 Code"]
        L1["let num = 42;"]
        L2["let str = 'hello';"]
        L3["let obj = { a: 1, b: 2 };"]
        L4["let arr = [1, 2, 3];"]
        L5["function greet(name) {"]
        L6["  return 'Hi ' + name;"]
        L7["}"]
    end

    subgraph Stack["📚 Stack Memory"]
        S1["num: 42"]
        S2["str: 'hello'"]
        S3["obj: 0x001 →"]
        S4["arr: 0x002 →"]
        S5["greet: 0x003 →"]
    end

    subgraph Heap["🏔️ Heap Memory"]
        H1["0x001: { a: 1, b: 2 }"]
        H2["0x002: [1, 2, 3]"]
        H3["0x003: function greet() {...}"]
    end

    S3 --> H1
    S4 --> H2
    S5 --> H3
```

### 2.2 Garbage Collection: Mark-and-Sweep

```mermaid
flowchart TB
    subgraph Before["🔴 BEFORE GC"]
        Root1["🌱 Root (Global)"]
        Obj1["Object A<br/>reachable"]
        Obj2["Object B<br/>reachable"]
        Obj3["Object C<br/>orphan!"]
        Obj4["Object D<br/>orphan!"]
        Obj5["Object E<br/>reachable"]

        Root1 --> Obj1
        Obj1 --> Obj2
        Obj2 --> Obj5
    end

    subgraph Phase1["📍 PHASE 1: MARK"]
        Root2["🌱 Root"]
        Mark1["Object A ✅"]
        Mark2["Object B ✅"]
        Mark3["Object C ❌"]
        Mark4["Object D ❌"]
        Mark5["Object E ✅"]

        Root2 -->|"mark"| Mark1
        Mark1 -->|"mark"| Mark2
        Mark2 -->|"mark"| Mark5
    end

    subgraph Phase2["🗑️ PHASE 2: SWEEP"]
        Keep1["Object A 💾"]
        Keep2["Object B 💾"]
        Keep5["Object E 💾"]
        Free["Freed Memory 🆓"]
    end

    Before --> Phase1 --> Phase2
```

### 2.3 Closure Memory Impact

```mermaid
flowchart TB
    subgraph Creation["📝 Function Creation"]
        Code1["function createMultiplier(factor) {"]
        Code2["  return function(num) {"]
        Code3["    return num * factor;"]
        Code4["  };"]
        Code5["}"]
        Code6["const double = createMultiplier(2);"]
        Code7["const triple = createMultiplier(3);"]
    end

    subgraph Memory["💾 Memory Layout"]
        subgraph Closure1["Closure: double"]
            Func1["Function object"]
            Env1["[[Environment]]<br/>factor: 2"]
        end

        subgraph Closure2["Closure: triple"]
            Func2["Function object"]
            Env2["[[Environment]]<br/>factor: 3"]
        end
    end

    subgraph Usage["▶️ Usage"]
        Call1["double(5) → 10<br/>Uses factor: 2"]
        Call2["triple(5) → 15<br/>Uses factor: 3"]
    end

    Creation --> Memory --> Usage
```

---

## 3. Event Loop Step-by-Step

### 3.1 Complete Event Loop Visualization

```mermaid
flowchart TB
    subgraph Browser["🌐 Browser Environment"]
        subgraph MainThread["🧵 Main Thread"]
            CallStack["📚 Call Stack"]
        end

        subgraph WebAPIs["🔧 Web APIs (separate threads)"]
            Timer["⏱️ Timer API"]
            Fetch["🌍 Fetch API"]
            DOM["🖱️ DOM Events"]
        end

        subgraph Queues["📋 Task Queues"]
            MicroQ["⚡ Microtask Queue<br/>• Promise.then()<br/>• queueMicrotask()<br/>• MutationObserver"]
            MacroQ["📦 Macrotask Queue<br/>• setTimeout<br/>• setInterval<br/>• I/O<br/>• UI rendering"]
        end

        subgraph EventLoop["🔄 Event Loop"]
            Check1["1️⃣ Call Stack empty?"]
            Check2["2️⃣ Microtask Queue empty?"]
            Check3["3️⃣ Render needed?"]
            Check4["4️⃣ Macrotask Queue empty?"]
        end
    end

    CallStack --> WebAPIs
    WebAPIs --> Queues
    Queues --> EventLoop
    EventLoop --> CallStack

    Check1 -->|"No"| CallStack
    Check1 -->|"Yes"| Check2
    Check2 -->|"No"| MicroQ
    Check2 -->|"Yes"| Check3
    Check3 -->|"Yes"| Render["🎨 Render"]
    Check3 -->|"No"| Check4
    Check4 -->|"No"| MacroQ
```

### 3.2 Code Example Step-by-Step

```javascript
console.log("1"); // A
setTimeout(() => console.log("2"), 0); // B
Promise.resolve().then(() => console.log("3")); // C
console.log("4"); // D
```

```mermaid
flowchart LR
    subgraph Step1["Step 1"]
        CS1["📚 Call Stack:<br/>console.log('1')"]
        MQ1["⚡ Micro: empty"]
        MaQ1["📦 Macro: empty"]
        Out1["Output: 1"]
    end

    subgraph Step2["Step 2"]
        CS2["📚 Call Stack:<br/>setTimeout()"]
        MQ2["⚡ Micro: empty"]
        MaQ2["📦 Macro: empty"]
        Timer["⏱️ Web API: Timer started"]
    end

    subgraph Step3["Step 3"]
        CS3["📚 Call Stack:<br/>Promise.then()"]
        MQ3["⚡ Micro: log('3')"]
        MaQ3["📦 Macro: log('2')"]
    end

    subgraph Step4["Step 4"]
        CS4["📚 Call Stack:<br/>console.log('4')"]
        MQ4["⚡ Micro: log('3')"]
        MaQ4["📦 Macro: log('2')"]
        Out4["Output: 4"]
    end

    subgraph Step5["Step 5: Stack empty, process Micro"]
        CS5["📚 Call Stack:<br/>log('3') from Micro"]
        MQ5["⚡ Micro: empty"]
        MaQ5["📦 Macro: log('2')"]
        Out5["Output: 3"]
    end

    subgraph Step6["Step 6: Micro empty, process Macro"]
        CS6["📚 Call Stack:<br/>log('2') from Macro"]
        MQ6["⚡ Micro: empty"]
        MaQ6["📦 Macro: empty"]
        Out6["Output: 2"]
    end

    Step1 --> Step2 --> Step3 --> Step4 --> Step5 --> Step6
```

---

## 4. Promise Internals

### 4.1 Promise State Machine

```mermaid
stateDiagram-v2
    [*] --> Pending: new Promise()

    Pending --> Fulfilled: resolve(value)
    Pending --> Rejected: reject(error)

    Fulfilled --> [*]: .then() handlers called
    Rejected --> [*]: .catch() handlers called

    note right of Pending
        Internal state:
        [[PromiseState]]: "pending"
        [[PromiseResult]]: undefined
        [[PromiseFulfillReactions]]: []
        [[PromiseRejectReactions]]: []
    end note

    note right of Fulfilled
        Internal state:
        [[PromiseState]]: "fulfilled"
        [[PromiseResult]]: value
    end note

    note right of Rejected
        Internal state:
        [[PromiseState]]: "rejected"
        [[PromiseResult]]: error
    end note
```

### 4.2 Promise Chain Execution

```mermaid
sequenceDiagram
    participant Code
    participant Promise1 as Promise 1
    participant MicroQ as Microtask Queue
    participant Promise2 as Promise 2
    participant CallStack

    Code->>Promise1: new Promise(executor)
    Note over Promise1: State: pending

    Promise1->>Promise1: executor(resolve, reject)
    Promise1->>Promise1: resolve(10)
    Note over Promise1: State: fulfilled, value: 10

    Code->>Promise1: .then(x => x * 2)
    Promise1->>MicroQ: Queue: () => x * 2
    Note over MicroQ: Waiting for stack empty

    Code->>Code: Sync code continues...

    Note over CallStack: Stack empty!

    MicroQ->>CallStack: Execute: () => 10 * 2
    CallStack->>Promise2: Create new Promise with 20
    Note over Promise2: State: fulfilled, value: 20
```

### 4.3 Promise.all Visualization

```mermaid
flowchart TB
    subgraph Input["📥 Input Promises"]
        P1["Promise 1<br/>fetch('/api/users')"]
        P2["Promise 2<br/>fetch('/api/posts')"]
        P3["Promise 3<br/>fetch('/api/comments')"]
    end

    subgraph PromiseAll["🔄 Promise.all()"]
        Waiting["Waiting for ALL..."]
        Counter["Resolved: 0/3"]
    end

    subgraph Scenario1["✅ All Resolve"]
        R1["P1 resolves → 1/3"]
        R2["P2 resolves → 2/3"]
        R3["P3 resolves → 3/3"]
        Success["Promise.all resolves<br/>[users, posts, comments]"]
    end

    subgraph Scenario2["❌ Any Rejects"]
        F1["P1 resolves → 1/3"]
        F2["P2 REJECTS!"]
        FastFail["Promise.all rejects IMMEDIATELY<br/>Other promises ignored"]
    end

    Input --> PromiseAll
    PromiseAll --> Scenario1
    PromiseAll --> Scenario2
```

---

## 5. React Fiber Deep Dive

### 5.1 Fiber Architecture

```mermaid
flowchart TB
    subgraph OldArch["❌ Old Stack Reconciler"]
        Stack1["Start reconciling"]
        Stack2["Process all components"]
        Stack3["Cannot pause!"]
        Stack4["UI may freeze"]
    end

    subgraph NewArch["✅ Fiber Reconciler"]
        Fiber1["Break work into units"]
        Fiber2["Process one unit"]
        Fiber3["Check: should yield?"]
        Fiber4["Continue or pause"]
        Fiber5["UI stays responsive"]
    end

    OldArch --> NewArch
```

### 5.2 Fiber Node Structure

```mermaid
flowchart TB
    subgraph FiberNode["🧬 Fiber Node Structure"]
        Type["type: 'div' | Component"]
        Props["pendingProps, memoizedProps"]
        State["memoizedState (Hooks)"]
        Child["child → First child Fiber"]
        Sibling["sibling → Next sibling Fiber"]
        Return["return → Parent Fiber"]
        Alternate["alternate → Old Fiber (for diffing)"]
        EffectTag["effectTag: Placement | Update | Deletion"]
    end
```

### 5.3 Reconciliation Process

```mermaid
flowchart LR
    subgraph Phase1["📋 Render Phase (Interruptible)"]
        Build["Build Work-in-Progress tree"]
        Diff["Diff with current tree"]
        Mark["Mark effects"]
    end

    subgraph Phase2["✅ Commit Phase (Synchronous)"]
        DOM["Apply DOM changes"]
        Cleanup["Run cleanup effects"]
        Effects["Run new effects"]
    end

    Phase1 -->|"Cannot interrupt"| Phase2
```

### 5.4 Hooks Linked List

```mermaid
flowchart LR
    subgraph Component["⚛️ Component"]
        Code["function Counter() {"]
        Hook1["  const [count, setCount] = useState(0);"]
        Hook2["  const [name, setName] = useState('');"]
        Hook3["  useEffect(() => {...}, [count]);"]
        Code2["}"]
    end

    subgraph HooksList["🔗 Hooks Linked List in Fiber"]
        H1["Hook 1<br/>memoizedState: 0<br/>queue: updates"]
        H2["Hook 2<br/>memoizedState: ''<br/>queue: updates"]
        H3["Hook 3<br/>memoizedState: effect<br/>deps: [count]"]

        H1 -->|"next"| H2 -->|"next"| H3
    end

    Component --> HooksList
```

---

## 6. Browser Rendering Pipeline

### 6.1 Complete Rendering Flow

```mermaid
flowchart TB
    subgraph Parse["📖 PARSE"]
        HTML["HTML"]
        DOM["DOM Tree"]
        CSS["CSS"]
        CSSOM["CSSOM Tree"]

        HTML --> DOM
        CSS --> CSSOM
    end

    subgraph Style["🎨 STYLE"]
        Render["Render Tree<br/>(DOM + CSSOM)"]
        Computed["Computed Styles"]

        DOM --> Render
        CSSOM --> Render
        Render --> Computed
    end

    subgraph Layout["📐 LAYOUT"]
        Box["Box Model"]
        Position["Position Calculation"]
        Size["Size Calculation"]
    end

    subgraph Paint["🖌️ PAINT"]
        Layers["Paint Layers"]
        Pixels["Pixel Instructions"]
    end

    subgraph Composite["🎭 COMPOSITE"]
        GPU["GPU Layers"]
        Final["Final Image"]
    end

    Style --> Layout --> Paint --> Composite
```

### 6.2 Reflow vs Repaint vs Composite

```mermaid
flowchart TB
    subgraph Triggers["🎯 What Triggers What"]
        subgraph Reflow["🔴 REFLOW (Most Expensive)"]
            R1["width, height"]
            R2["padding, margin"]
            R3["position, display"]
            R4["font-size"]
            R5["offsetWidth read"]
        end

        subgraph Repaint["🟡 REPAINT (Medium)"]
            P1["color"]
            P2["background"]
            P3["visibility"]
            P4["box-shadow"]
        end

        subgraph Composite["🟢 COMPOSITE ONLY (Cheap)"]
            C1["transform"]
            C2["opacity"]
            C3["will-change"]
        end
    end

    Reflow -->|"triggers"| Repaint
    Repaint -->|"triggers"| Composite
```

### 6.3 CSS Animation Optimization

```mermaid
flowchart LR
    subgraph Bad["❌ Bad: Triggers Reflow"]
        B1["@keyframes move {"]
        B2["  from { left: 0; }"]
        B3["  to { left: 100px; }"]
        B4["}"]
        BResult["Layout → Paint → Composite<br/>60fps = 60 reflows/s! 😰"]
    end

    subgraph Good["✅ Good: Composite Only"]
        G1["@keyframes move {"]
        G2["  from { transform: translateX(0); }"]
        G3["  to { transform: translateX(100px); }"]
        G4["}"]
        GResult["Composite only<br/>GPU accelerated! 🚀"]
    end
```

---

## 7. Network Request Lifecycle

### 7.1 HTTP Request Complete Journey

```mermaid
sequenceDiagram
    participant Browser
    participant DNS
    participant TCP
    participant TLS
    participant Server
    participant Cache

    Browser->>Cache: Check browser cache
    alt Cache hit
        Cache-->>Browser: Return cached response
    else Cache miss
        Browser->>DNS: Resolve domain
        DNS-->>Browser: IP Address

        Browser->>TCP: TCP Handshake (SYN)
        TCP-->>Browser: SYN-ACK
        Browser->>TCP: ACK

        Browser->>TLS: TLS Handshake
        TLS-->>Browser: Secure connection

        Browser->>Server: HTTP Request
        Server-->>Browser: HTTP Response

        Browser->>Cache: Store in cache
    end

    Browser->>Browser: Parse & Render
```

### 7.2 HTTP/2 Multiplexing

```mermaid
flowchart TB
    subgraph HTTP1["❌ HTTP/1.1"]
        Conn1["Connection 1"]
        Conn2["Connection 2"]
        Conn3["Connection 3"]

        Req1["Request 1 → Response 1"]
        Req2["Request 2 → Response 2"]
        Req3["Request 3 → Response 3"]

        Conn1 --> Req1
        Conn2 --> Req2
        Conn3 --> Req3

        Note1["🔴 6 connections limit<br/>Head-of-line blocking"]
    end

    subgraph HTTP2["✅ HTTP/2"]
        SingleConn["Single Connection"]

        Stream1["Stream 1: Request ↔ Response"]
        Stream2["Stream 2: Request ↔ Response"]
        Stream3["Stream 3: Request ↔ Response"]

        SingleConn --> Stream1
        SingleConn --> Stream2
        SingleConn --> Stream3

        Note2["🟢 Multiplexed<br/>Parallel on single connection"]
    end
```

### 7.3 Fetch API Flow

```mermaid
flowchart TB
    subgraph FetchCall["📞 fetch() Call"]
        Code["fetch('https://api.example.com/data')"]
    end

    subgraph Promise["⏳ Promise Created"]
        Pending["State: pending"]
    end

    subgraph Network["🌐 Network Request"]
        DNS["DNS Resolution"]
        TCP["TCP Connection"]
        TLS["TLS Handshake"]
        HTTP["HTTP Request/Response"]
    end

    subgraph Response["📬 Response"]
        Status["Response object<br/>status, headers"]
        Body["Body (stream)"]
    end

    subgraph Parse["📖 Parse Body"]
        JSON[".json()"]
        Text[".text()"]
        Blob[".blob()"]
    end

    subgraph Result["✅ Final Data"]
        Data["JavaScript Object"]
    end

    FetchCall --> Promise --> Network --> Response --> Parse --> Result
```

---

## 8. CSS Cascade & Specificity

### 8.1 Cascade Order

```mermaid
flowchart TB
    subgraph Cascade["🌊 CSS Cascade (Priority Low → High)"]
        L1["1️⃣ User Agent Styles<br/>(Browser defaults)"]
        L2["2️⃣ User Styles<br/>(Browser settings)"]
        L3["3️⃣ Author Styles<br/>(Your CSS)"]
        L4["4️⃣ Author !important"]
        L5["5️⃣ User !important"]
        L6["6️⃣ UA !important"]
    end

    L1 --> L2 --> L3 --> L4 --> L5 --> L6
```

### 8.2 Specificity Calculator

```mermaid
flowchart LR
    subgraph Specificity["🔢 Specificity (A, B, C, D)"]
        A["A: Inline styles<br/>style='...'"]
        B["B: IDs<br/>#id"]
        C["C: Classes, attributes<br/>.class, [attr]"]
        D["D: Elements, pseudo<br/>div, ::before"]
    end

    subgraph Examples["📝 Examples"]
        E1["div → (0,0,0,1)"]
        E2[".class → (0,0,1,0)"]
        E3["#id → (0,1,0,0)"]
        E4["#id .class div → (0,1,1,1)"]
        E5["style='' → (1,0,0,0)"]
    end
```

### 8.3 Specificity Comparison

```mermaid
flowchart TB
    subgraph Compare["⚖️ Which Wins?"]
        Rule1["#header .nav a<br/>(0,1,1,1)"]
        Rule2[".nav a.active<br/>(0,0,2,1)"]
        Rule3["nav ul li a<br/>(0,0,0,4)"]

        Winner["🏆 Winner: #header .nav a<br/>ID always beats classes"]
    end

    Rule1 --> Winner
    Rule2 -.->|"loses"| Winner
    Rule3 -.->|"loses"| Winner
```

---

## 📊 Cheat Sheet: Visual Summary

```mermaid
mindmap
  root((Frontend<br/>Visualized))
    JS Execution
      Parse → AST → Execute
      Scope Chain
      TDZ Timeline
    Memory
      Stack vs Heap
      GC Mark-Sweep
      Closure Environment
    Event Loop
      Call Stack
      Microtask Priority
      Macrotask Queue
    Promise
      State Machine
      Chain Execution
      Promise.all Flow
    React Fiber
      Work Units
      Two Phases
      Hooks Linked List
    Browser
      Render Pipeline
      Reflow < Repaint < Composite
    Network
      HTTP/2 Multiplexing
      Fetch Promise Flow
    CSS
      Cascade Order
      Specificity Calculation
```

---

> **Tip**: Visualizations help you understand the "WHY" behind the code!
>
> **Chúc bạn phỏng vấn thành công! 🎉**
>
> _Tài liệu được tạo: 23/12/2025_
