# 🗺️ MODULE 0: KNOWLEDGE MAP & LEARNING FRAMEWORK

> **Focus**: 100% Learning Strategy & Navigation
>
> _"Học đúng phương pháp = Nhớ lâu hơn, hiểu sâu hơn, phỏng vấn tự tin hơn"_
>
> **Core Philosophy**: Evidence-Based Learning + Deliberate Practice

---

## 📋 Trong Module Này

1. [Learning Science - Khoa Học Học Tập](#1-learning-science)
2. [WHAT-WHY-HOW-WHEN Framework](#2-what-why-how-when-framework)
3. [Prerequisite Graph - Học Gì Trước](#3-prerequisite-graph)
4. [Frontend Ecosystem Map](#4-frontend-ecosystem-map)
5. [17-Module Navigation](#5-module-navigation)
6. [6-Month Learning Roadmap](#6-learning-roadmap)
7. [Big Tech Interview Focus](#7-big-tech-focus)

---

## 1. Learning Science

### 🧠 Evidence-Based Learning (từ Harvard, Cambridge, Oxford, Japan)

```mermaid
flowchart TB
    subgraph Harvard["🎓 Harvard - Active Recall"]
        H1["Đọc xong → Đóng tài liệu"]
        H2["Viết lại từ trí nhớ"]
        H3["So sánh và sửa gaps"]
    end

    subgraph Cambridge["🎓 Cambridge - Deep Understanding"]
        C1["WHAT: Định nghĩa"]
        C2["WHY: Tại sao tồn tại"]
        C3["HOW: Cơ chế hoạt động"]
        C4["WHEN: Khi nào áp dụng"]
    end

    subgraph Oxford["🎓 Oxford - Tutorial System"]
        O1["Peer Teaching"]
        O2["Mock Interviews"]
        O3["Socratic Questioning"]
    end

    subgraph Japan["🇯🇵 Kaizen - Continuous Improvement"]
        J1["Daily 1% improvement"]
        J2["Spaced Repetition"]
        J3["Deliberate Practice"]
    end

    Harvard --> Application
    Cambridge --> Application
    Oxford --> Application
    Japan --> Application

    Application["💡 Áp Dụng Cho Interview Prep"]
```

### Ebbinghaus Forgetting Curve & Solution

```
📉 FORGETTING CURVE (Không ôn tập)

100% ─┐
      │
 70% ─┤─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
      │ \
 50% ─┤   \
      │     \
 30% ─┤       \_____________________________
      │
  0% ─┼───────┬───────┬───────┬───────┬─────
      Day 1   Day 2   Day 7   Day 14  Day 30

📈 SPACED REPETITION (Ôn đúng timing)

100% ─┐  ╱\     ╱\       ╱\          ╱\
      │ /  \   /  \     /  \        /  \
 80% ─┤/    \ /    \   /    \      /    \
      │      ╳      \ /      \    /      \
 60% ─┤              ╳        \  /        ──
      │                        ╳
  0% ─┼───────┬───────┬───────┬───────┬─────
     Learn  Day1   Day3   Day7   Day14  Long-term
```

### Feynman Technique - 4 Steps

```mermaid
flowchart LR
    Step1["1️⃣ STUDY<br/>Học concept"]
    Step2["2️⃣ TEACH<br/>Giải thích như<br/>cho trẻ 10 tuổi"]
    Step3["3️⃣ IDENTIFY<br/>Tìm gaps -<br/>chỗ nào khựng lại?"]
    Step4["4️⃣ SIMPLIFY<br/>Quay lại học,<br/>tạo analogy mới"]

    Step1 --> Step2 --> Step3 --> Step4
    Step4 -.->|"Lặp lại"| Step1

    style Step1 fill:#e1f5fe
    style Step2 fill:#fff3e0
    style Step3 fill:#ffebee
    style Step4 fill:#e8f5e9
```

---

## 2. WHAT-WHY-HOW-WHEN Framework

Mỗi concept trong tài liệu này sẽ được trình bày theo 4 bước:

```mermaid
flowchart LR
    WHAT["<b>WHAT</b><br/>────────<br/>Định nghĩa<br/>đơn giản<br/>1-2 câu"]
    WHY["<b>WHY</b><br/>────────<br/>Tại sao<br/>cần/tồn tại?<br/>Lịch sử"]
    HOW["<b>HOW</b><br/>────────<br/>Cơ chế<br/>hoạt động<br/>Chi tiết"]
    WHEN["<b>WHEN</b><br/>────────<br/>Use cases<br/>Best practices<br/>Trade-offs"]

    WHAT --> WHY --> HOW --> WHEN

    style WHAT fill:#e3f2fd
    style WHY fill:#fff8e1
    style HOW fill:#f3e5f5
    style WHEN fill:#e8f5e9
```

### Example: Closure

| Phase    | Content                                                                        |
| -------- | ------------------------------------------------------------------------------ |
| **WHAT** | Function kèm theo lexical environment nơi nó được tạo ra                       |
| **WHY**  | JavaScript cần cách để giữ data private + tạo stateful functions               |
| **HOW**  | Inner function giữ reference đến outer scope → Scope chain không bị GC         |
| **WHEN** | Private variables, Factory functions, Event handlers, React useState internals |

---

## 3. Prerequisite Graph

### 🔗 Concept Dependencies - Học Gì Trước Gì?

```mermaid
flowchart TD
    subgraph L1["Level 1: Fundamentals (Week 1-2)"]
        Var["Variables<br/>let, const, var"]
        Func["Functions<br/>regular, arrow"]
        Obj["Objects &<br/>Arrays"]
    end

    subgraph L2["Level 2: Core JS (Week 3-6)"]
        Scope["Scope<br/>Lexical, Block"]
        Closure["Closure"]
        Proto["Prototype<br/>Chain"]
        This["this Binding"]
        Async["Async<br/>Promise, await"]
    end

    subgraph L3["Level 3: Runtime (Week 7-8)"]
        EventLoop["Event Loop"]
        Memory["Memory<br/>Heap, Stack"]
        GC["Garbage<br/>Collection"]
    end

    subgraph L4["Level 4: Browser (Week 9-10)"]
        DOM["DOM API"]
        CSSOM["CSSOM"]
        Rendering["Rendering<br/>Pipeline"]
    end

    subgraph L5["Level 5: React (Week 11-14)"]
        Component["Components<br/>JSX"]
        State["useState<br/>useReducer"]
        Effects["useEffect<br/>useLayoutEffect"]
        CustomHooks["Custom Hooks"]
    end

    %% Dependencies
    Var --> Func --> Obj
    Obj --> Scope --> Closure
    Func --> This
    Proto --> This
    Func --> Async
    Async --> EventLoop
    Scope --> Memory --> GC

    Obj --> DOM
    DOM --> Rendering
    CSSOM --> Rendering

    Closure --> State
    Closure --> Effects
    Effects --> CustomHooks
    EventLoop --> Effects

    style Closure fill:#90EE90
    style EventLoop fill:#90EE90
    style State fill:#ADD8E6
```

### 📋 Prerequisite Quick Reference

| Muốn học                     | Phải học trước      | Tại sao?                           |
| ---------------------------- | ------------------- | ---------------------------------- |
| **Closure**                  | Scope Chain         | Closure = Function + Lexical Scope |
| **React Hooks**              | Closure, this       | useState dùng closure để lưu state |
| **Virtual DOM**              | Real DOM, Reflow    | Hiểu vấn đề mới hiểu giải pháp     |
| **Event Loop**               | Async/Promises      | Event Loop điều phối async code    |
| **TypeScript Generics**      | JS Functions, Types | Generics = Functions cho types     |
| **Next.js SSR**              | React, HTTP         | SSR = React + Server response      |
| **Performance Optimization** | Browser Rendering   | Optimize = Reduce reflows/repaints |

---

## 4. Frontend Ecosystem Map

### The Big Picture - 6 Layers

```mermaid
flowchart TB
    subgraph Layer1["🏛️ LAYER 1: LANGUAGE CORE"]
        JS["JavaScript<br/>ES2024"]
        TS["TypeScript<br/>5.x"]
    end

    subgraph Layer2["🌐 LAYER 2: PLATFORM"]
        Browser["Browser APIs<br/>DOM, BOM"]
        Network["Network<br/>HTTP, WebSocket"]
        Storage["Storage<br/>localStorage, IndexedDB"]
    end

    subgraph Layer3["⚛️ LAYER 3: FRAMEWORKS"]
        React["React 19<br/>RSC, Hooks"]
        Next["Next.js 15<br/>App Router"]
        State["State<br/>Zustand, TanStack"]
    end

    subgraph Layer4["🎨 LAYER 4: UI/UX"]
        CSS["CSS<br/>Grid, Flexbox"]
        Design["Design Systems<br/>Component Libraries"]
        A11y["Accessibility<br/>WCAG, ARIA"]
    end

    subgraph Layer5["⚡ LAYER 5: QUALITY"]
        Perf["Performance<br/>Core Web Vitals"]
        Security["Security<br/>XSS, CSRF, CSP"]
        Testing["Testing<br/>Jest, Playwright"]
    end

    subgraph Layer6["🚀 LAYER 6: OPERATIONS"]
        Build["Build Tools<br/>Vite, Webpack"]
        Deploy["Deploy<br/>Vercel, Docker"]
        Monitor["Monitoring<br/>Observability"]
    end

    Layer1 --> Layer2 --> Layer3
    Layer3 --> Layer4
    Layer3 --> Layer5
    Layer5 --> Layer6

    style Layer1 fill:#e1f5fe
    style Layer2 fill:#fff3e0
    style Layer3 fill:#f3e5f5
    style Layer4 fill:#e8f5e9
    style Layer5 fill:#fff8e1
    style Layer6 fill:#fce4ec
```

### JavaScript Core → React Connection

```mermaid
flowchart LR
    subgraph JSCore["🟨 JavaScript Core"]
        Closure2["Closure"]
        Scope2["Scope Chain"]
        EventLoop3["Event Loop"]
        Proto2["Prototype"]
    end

    subgraph ReactConcepts["⚛️ React Concepts"]
        Hooks2["React Hooks<br/>useState, useEffect"]
        VDOM["Virtual DOM<br/>Reconciliation"]
        Async2["Async Updates<br/>batching, Suspense"]
        Class2["Class Components<br/>(legacy)"]
    end

    Closure2 -->|"Powers"| Hooks2
    Scope2 --> Closure2
    EventLoop3 --> Async2
    Proto2 --> Class2

    style Closure2 fill:#90EE90,stroke:#333,stroke-width:2px
    style EventLoop3 fill:#90EE90,stroke:#333,stroke-width:2px
```

> [!TIP] > **🔑 Key Insight**: Closures là nền tảng của React Hooks.
>
> - `useState` lưu state trong closure
> - `useEffect` cleanup function là closure
> - Custom hooks share logic qua closures

---

## 5. Module Navigation

### 📖 17-Module Structure (NEW)

| #   | Module                                                        | Layer      | Focus      |
| --- | ------------------------------------------------------------- | ---------- | ---------- |
| 00  | **[Knowledge Map](./00-knowledge-map.md)** (bạn đang ở đây)   | Foundation | Navigation |
| 01  | **[JavaScript Foundations](./01-javascript.md)**              | Foundation | 90% Theory |
| 02  | **[TypeScript Mastery](./02-typescript.md)**                  | Foundation | 90% Theory |
| 03  | **[Browser & Web Platform](./03-browser-platform.md)**        | Platform   | 90% Theory |
| 04  | **[React Ecosystem](./04-react-ecosystem.md)**                | Platform   | 85% Theory |
| 05  | **[Next.js Full-Stack](./05-nextjs-fullstack.md)**            | Platform   | 80% Theory |
| 06  | **[CSS & Visual Design](./06-css-visual-design.md)**          | Applied    | 75% Theory |
| 07  | **[Performance Engineering](./07-performance.md)**            | Applied    | 85% Theory |
| 08  | **[Security Best Practices](./08-security.md)**               | Applied    | 85% Theory |
| 09  | **[System Design & Architecture](./09-system-design.md)**     | Applied    | 90% Theory |
| 10  | **[Computer Science Fundamentals](./10-cs-fundamentals.md)**  | Expert     | 90% Theory |
| 11  | **[Testing & Quality Assurance](./11-testing-qa.md)**         | Expert     | 80% Theory |
| 12  | **[DevOps & Development Tools](./12-devops-tools.md)**        | Expert     | 75% Theory |
| 13  | **[Accessibility (a11y)](./13-accessibility.md)**             | Expert     | 85% Theory |
| 14  | **[Advanced & Expert Topics](./14-advanced-expert.md)**       | Expert     | 95% Theory |
| 15  | **[Interview Preparation](./15-interview-prep.md)**           | Practice   | 50% Theory |
| 16  | **[Learning Management System](./16-learning-management.md)** | Practice   | 90% Method |

### Learning Layer Map

```mermaid
flowchart TB
    subgraph Foundation["🏛️ FOUNDATION (Week 1-6)"]
        M00["00 Knowledge Map"]
        M01["01 JavaScript"]
        M02["02 TypeScript"]
    end

    subgraph Platform["🌐 PLATFORM (Week 7-12)"]
        M03["03 Browser"]
        M04["04 React"]
        M05["05 Next.js"]
    end

    subgraph Applied["💻 APPLIED (Week 13-18)"]
        M06["06 CSS"]
        M07["07 Performance"]
        M08["08 Security"]
        M09["09 System Design"]
    end

    subgraph Expert["🎓 EXPERT (Week 19-22)"]
        M10["10 CS Fundamentals"]
        M11["11 Testing"]
        M12["12 DevOps"]
        M13["13 Accessibility"]
        M14["14 Advanced Topics"]
    end

    subgraph Practice["🎯 PRACTICE (Week 23-26)"]
        M15["15 Interview Prep"]
        M16["16 Learning Management"]
    end

    M00 --> M01 --> M02
    M02 --> M03 --> M04 --> M05
    M04 --> M06 & M07 & M08
    M07 --> M09 --> M10
    M10 --> M11 & M12
    M06 --> M13
    M10 --> M14
    M14 --> M15
    M15 -.-> M16

    style M00 fill:#4CAF50,color:#fff
```

---

## 6. Learning Roadmap

### 📅 6-Month Study Plan Overview

```mermaid
gantt
    title 6-Month Frontend Interview Preparation
    dateFormat YYYY-MM-DD

    section Foundation
    JavaScript Core          :f1, 2025-01-01, 4w
    TypeScript Mastery       :f2, after f1, 2w

    section Platform
    Browser & Web APIs       :p1, after f2, 2w
    React Ecosystem          :p2, after p1, 3w
    Next.js Full-Stack       :p3, after p2, 1w

    section Applied
    CSS & Performance        :a1, after p3, 2w
    Security & Architecture  :a2, after a1, 2w

    section Expert
    CS & Testing & DevOps    :e1, after a2, 3w
    Advanced Topics          :e2, after e1, 1w

    section Practice
    Coding Practice          :pr1, after e2, 2w
    Mock Interviews          :pr2, after pr1, 2w
```

### ⏱️ Weekly Time Investment

| Phase          | Weeks | Modules | Theory Hours/Week | Practice Hours/Week |
| -------------- | ----- | ------- | ----------------- | ------------------- |
| **Foundation** | 1-6   | 01-02   | 8-10h             | 2-3h                |
| **Platform**   | 7-12  | 03-05   | 8-10h             | 3-4h                |
| **Applied**    | 13-18 | 06-09   | 6-8h              | 4-5h                |
| **Expert**     | 19-22 | 10-14   | 5-6h              | 3-4h                |
| **Practice**   | 23-26 | 15-16   | 3-4h              | 8-10h               |

---

## 7. Big Tech Focus

### 🏢 Company-Specific Preparation

```mermaid
flowchart TB
    subgraph Meta["🔵 Meta/Facebook"]
        M1["React Internals"]
        M2["Performance at Scale"]
        M3["Product Architecture"]
    end

    subgraph Google["🔴 Google"]
        G1["Algorithms (Priority)"]
        G2["Web Fundamentals"]
        G3["Googleyness"]
    end

    subgraph Microsoft["🟢 Microsoft"]
        MS1["TypeScript Expert"]
        MS2["Accessibility"]
        MS3["Enterprise Patterns"]
    end

    subgraph Amazon["🟠 Amazon"]
        A1["Leadership Principles (14)"]
        A2["System Design"]
        A3["Behavioral Deep"]
    end

    subgraph Grab["🟤 Grab/SEA"]
        GB1["React + Next.js"]
        GB2["Real-time Features"]
        GB3["Mobile-First"]
    end
```

### Priority Matrix by Company

| Company       | #1 Priority     | #2 Priority      | #3 Priority   | Special Focus    |
| ------------- | --------------- | ---------------- | ------------- | ---------------- |
| **Meta**      | React Internals | Performance      | System Design | Product Sense    |
| **Google**    | Algorithms      | Web Fundamentals | System Design | Googleyness      |
| **Microsoft** | TypeScript      | Design Patterns  | Behavioral    | Accessibility    |
| **Amazon**    | System Design   | LP Stories       | Coding        | Bar Raiser Ready |
| **Grab**      | React/Next.js   | Real-time        | Mobile UX     | SEA Context      |

---

## 🔑 Key Takeaways

> [!TIP] > **5 Rules for Effective Learning:**
>
> 1. **Prerequisite First** - Học đúng thứ tự (Closure trước Hooks)
> 2. **WHAT-WHY-HOW-WHEN** - Mỗi concept đều có 4 góc nhìn
> 3. **Spaced Repetition** - Ôn Day 1, 3, 7, 14, 30
> 4. **Active Recall** - Test yourself, không passive reading
> 5. **Feynman Technique** - Dạy lại = Hiểu sâu nhất

---

## 📚 Source Documents Reference

Tài liệu này consolidate từ:

```
📁 Original Sources (150+ files)
├── 01-javascript-fundamentals/  (25 files)
├── 02-typescript/               (7 files)
├── 03-react/                    (10 files)
├── 04-nextjs/                   (4 files)
├── 05-security/                 (3 files)
├── 06-html/                     (1 file)
├── 06-web-apis/                 (10 files)
├── 07-css/                      (8 files)
├── 08-performance/              (5 files)
├── 09-system-design/            (8 files)
├── 10-computer-science/         (16 files)
├── 11-interview-practice/       (8 files)
├── 12-visual-learning/          (3 files)
├── 13-tools-ecosystem/          (8 files)
├── 14-accessibility/            (2 files)
├── 15-advanced-topics/          (9 files)
├── 16-theoretical-foundations/  (9 files)
├── 17-frontend-theory/          (17 files)
├── 18-advanced-theory/          (6 files)
└── 19-expert-topics/            (4 files)
```

---

> _Tiếp theo: [Module 01: JavaScript Foundations](./01-javascript.md)_
