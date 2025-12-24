# 🗺️ MODULE 0: KNOWLEDGE MAP

> **Mục đích**: Hiểu cách các khái niệm Frontend liên kết với nhau
>
> _"Hiểu mối quan hệ = nhớ lâu hơn, trả lời phỏng vấn tốt hơn"_

---

## 📊 The Big Picture

### Frontend Ecosystem Overview

```mermaid
flowchart TB
    subgraph Core["🏛️ CORE FOUNDATIONS"]
        JS["JavaScript<br/>Engine & Runtime"]
        Browser["Browser<br/>DOM, BOM, CSSOM"]
        HTTP["Network<br/>HTTP, DNS, WebSocket"]
    end

    subgraph Theory["🧠 THEORY LAYER"]
        EventLoop["Event Loop<br/>Async Model"]
        Memory["Memory<br/>Heap, Stack, GC"]
        Rendering["Rendering<br/>Critical Path"]
    end

    subgraph Frameworks["⚛️ FRAMEWORKS"]
        React["React<br/>Component Model"]
        Next["Next.js<br/>Full-stack React"]
        TS["TypeScript<br/>Type System"]
    end

    subgraph Applied["💻 APPLIED"]
        Perf["Performance<br/>Core Web Vitals"]
        Security["Security<br/>XSS, CSRF, CORS"]
        Testing["Testing<br/>Unit, E2E"]
    end

    Core --> Theory
    Theory --> Frameworks
    Frameworks --> Applied

    JS --> EventLoop
    JS --> Memory
    Browser --> Rendering
    EventLoop --> React
    Memory --> Perf
    Rendering --> Perf
```

---

## 🔗 Concept Relationship Map

### JavaScript Core Connections

```mermaid
flowchart LR
    subgraph JSCore["JavaScript Core"]
        Closure["Closure"]
        Scope["Scope Chain"]
        This["this Binding"]
        Proto["Prototype"]
        EventLoop2["Event Loop"]
    end

    subgraph Impacts["What It Enables"]
        Hooks["React Hooks<br/>(useState, useEffect)"]
        Module["Module Pattern<br/>Encapsulation"]
        Inheritance["OOP Inheritance"]
        Async["Async Programming<br/>Promise, setTimeout"]
    end

    Closure --> Hooks
    Scope --> Closure
    Scope --> Module
    Proto --> Inheritance
    EventLoop2 --> Async

    style Closure fill:#90EE90
    style EventLoop2 fill:#90EE90
```

> **🔑 Key Insight**: Closures là nền tảng của React Hooks. Hiểu closure = hiểu tại sao hooks hoạt động.

---

### Browser & React Connection

```mermaid
flowchart TB
    subgraph Browser2["🌐 Browser Layer"]
        DOM2["Real DOM"]
        CSSOM2["CSSOM"]
        Reflow["Reflow/Repaint"]
    end

    subgraph ReactLayer["⚛️ React Layer"]
        VDOM["Virtual DOM"]
        Reconcile["Reconciliation"]
        Fiber["Fiber Architecture"]
    end

    subgraph Why["❓ WHY"]
        W1["DOM manipulation<br/>is EXPENSIVE"]
        W2["Batch updates<br/>= fewer reflows"]
        W3["Priority scheduling<br/>= smooth 60fps"]
    end

    DOM2 -.->|"React abstracts"| VDOM
    VDOM --> Reconcile
    Reconcile --> Fiber
    Reflow -.->|"React minimizes"| W1
    W1 --> W2
    Fiber --> W3
```

---

### Performance Dependency Graph

```mermaid
flowchart TD
    subgraph Metrics["📊 Core Web Vitals"]
        LCP["LCP<br/>Largest Contentful Paint"]
        FID["FID/INP<br/>First Input Delay"]
        CLS["CLS<br/>Cumulative Layout Shift"]
    end

    subgraph Causes["🔍 Root Causes"]
        Bundle["Large Bundle<br/>→ Slow LCP"]
        MainThread["Main Thread Block<br/>→ Poor FID"]
        Layout["Layout Shifts<br/>→ High CLS"]
    end

    subgraph Solutions["✅ Solutions"]
        CodeSplit["Code Splitting<br/>React.lazy()"]
        WebWorker["Web Workers<br/>Offload work"]
        Reserve["Reserve Space<br/>skeleton, aspect-ratio"]
    end

    LCP --> Bundle --> CodeSplit
    FID --> MainThread --> WebWorker
    CLS --> Layout --> Reserve
```

---

## 📚 Learning Path Flowchart

### Recommended Study Order

```mermaid
flowchart TB
    subgraph Phase1["Phase 1: Foundations<br/>⏱️ 2-4 weeks"]
        P1_1["JavaScript Core"]
        P1_2["Browser Internals"]
        P1_3["HTML/CSS Deep"]
    end

    subgraph Phase2["Phase 2: Framework<br/>⏱️ 3-4 weeks"]
        P2_1["React Philosophy"]
        P2_2["State Management"]
        P2_3["TypeScript"]
    end

    subgraph Phase3["Phase 3: Applied<br/>⏱️ 2-3 weeks"]
        P3_1["Performance"]
        P3_2["Testing"]
        P3_3["Security"]
    end

    subgraph Phase4["Phase 4: Advanced<br/>⏱️ 2-3 weeks"]
        P4_1["System Design"]
        P4_2["Architecture"]
        P4_3["Next.js/SSR"]
    end

    Phase1 --> Phase2 --> Phase3 --> Phase4

    P1_1 --> P2_1
    P1_2 --> P3_1
    P2_2 --> P3_2
```

---

## 🎯 Topic Dependency Graph

### What to Learn Before What

| Topic                   | Cần học trước     | Tại sao                          |
| ----------------------- | ----------------- | -------------------------------- |
| **React Hooks**         | Closures, this    | useState lưu state trong closure |
| **Virtual DOM**         | Real DOM, Reflow  | Hiểu vấn đề mới hiểu giải pháp   |
| **TypeScript Generics** | JS Functions      | Generics = function for types    |
| **Next.js SSR**         | React, HTTP       | SSR kết hợp cả hai               |
| **Web Workers**         | Event Loop        | Workers tạo thread riêng         |
| **Service Workers**     | Promises, Caching | SW = async caching layer         |

---

## 🧠 Mental Model: Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   HTML      │  │    CSS      │  │ JavaScript  │         │
│  │  (Structure)│  │   (Style)   │  │  (Behavior) │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│         ▼                ▼                ▼                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              BROWSER ENGINE                          │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────────────┐  │   │
│  │  │   DOM   │  │  CSSOM  │  │   JavaScript Engine  │  │   │
│  │  │  Tree   │  │  Tree   │  │   (V8, SpiderMonkey) │  │   │
│  │  └────┬────┘  └────┬────┘  └──────────┬──────────┘  │   │
│  │       └──────┬─────┘                  │              │   │
│  │              ▼                        │              │   │
│  │       ┌──────────────┐               │              │   │
│  │       │ Render Tree  │◄──────────────┘              │   │
│  │       └──────┬───────┘                              │   │
│  │              ▼                                       │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │  Layout → Paint → Composite → DISPLAY       │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                      NETWORK LAYER                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   HTTP   │  │  DNS     │  │  Cache   │  │ WebSocket│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📖 Module Navigation

| Module                                       | Chủ đề                 | Focus       |
| -------------------------------------------- | ---------------------- | ----------- |
| **[Module 1](./01-javascript-theory.md)**    | JavaScript Core Theory | 80% Theory  |
| **[Module 2](./02-browser-theory.md)**       | Browser & Runtime      | 75% Theory  |
| **[Module 3](./03-react-philosophy.md)**     | React Philosophy       | 70% Theory  |
| **[Module 4](./04-architecture-theory.md)**  | Web Architecture       | 70% Theory  |
| **[Module 5](./05-typescript-theory.md)**    | TypeScript Types       | 60% Theory  |
| **[Module 6](./06-framework-patterns.md)**   | Framework Patterns     | 40% Theory  |
| **[Module 7](./07-performance-security.md)** | Performance & Security | 60% Theory  |
| **[Module 8](./08-testing-devops.md)**       | Testing & DevOps       | 50% Theory  |
| **[Module 9](./09-coding-practice.md)**      | Coding Practice        | 30% Theory  |
| **[Module 10](./10-interview-prep.md)**      | Interview Prep         | Q&A         |
| **[Module 11](./11-quick-reference.md)**     | Quick Reference        | Cheat Sheet |

---

## 🔑 Key Takeaways

> [!TIP] > **3 Cách nhớ kiến thức lâu hơn:**
>
> 1. **Hiểu WHY** - Tại sao khái niệm này tồn tại
> 2. **Liên kết** - Nó kết nối với khái niệm nào khác
> 3. **Ứng dụng** - Dùng trong tình huống thực tế nào

---

> _Tiếp theo: [Module 1: JavaScript Core Theory](./01-javascript-theory.md)_
