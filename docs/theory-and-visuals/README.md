# 🧠 Frontend Theory & Visualizations / Lý thuyết và Trực quan hóa Frontend

## 📋 Table of Contents / Mục lục

- [Core Concepts / Khái niệm cơ bản](#core-concepts)
- [JavaScript Engine & Runtime / JavaScript Engine & Runtime](#javascript-engine--runtime)
- [Browser Architecture / Kiến trúc trình duyệt](#browser-architecture)
- [Network & Performance / Mạng & Hiệu suất](#network--performance)
- [Security Models / Mô hình bảo mật](#security-models)
- [Visual Diagrams / Biểu đồ trực quan](#visual-diagrams)
- [Knowledge Graphs / Đồ thị kiến thức](#knowledge-graphs)

## 🎯 Core Concepts / Khái niệm cơ bản

### Frontend Architecture Overview / Tổng quan kiến trúc Frontend

```mermaid
graph TB
    subgraph "Frontend Architecture"
        A[User Interface] --> B[Application Logic]
        B --> C[State Management]
        C --> D[Data Layer]
        D --> E[Network Layer]
        E --> F[Browser APIs]
    end

    subgraph "Browser Environment"
        F --> G[DOM]
        F --> H[Event Loop]
        F --> I[Memory Management]
        F --> J[Security Sandbox]
    end

    subgraph "Performance"
        K[Core Web Vitals] --> L[Bundle Optimization]
        L --> M[Runtime Performance]
        M --> N[Caching Strategies]
    end
```

### Technology Stack Evolution

```mermaid
timeline
    title Frontend Technology Evolution
    1995 : HTML
    1996 : CSS
    1997 : JavaScript
    2006 : jQuery
    2010 : AngularJS
    2013 : React
    2014 : Vue.js
    2015 : ES6 Modules
    2017 : Web Components
    2019 : WebAssembly
    2020 : Web APIs
    2023 : AI Integration
```

## 🚀 JavaScript Engine & Runtime

### JavaScript Engine Architecture

```mermaid
graph LR
    subgraph "JavaScript Engine"
        A[Parser] --> B[AST]
        B --> C[Interpreter]
        C --> D[Profiler]
        D --> E[Compiler]
        E --> F[Optimized Code]
    end

    subgraph "Memory Management"
        G[Heap] --> H[Garbage Collector]
        I[Stack] --> J[Call Stack]
    end

    subgraph "Runtime"
        K[Event Loop] --> L[Task Queue]
        L --> M[Microtask Queue]
        M --> N[Web APIs]
    end
```

### Memory Management Deep Dive

```mermaid
graph TB
    subgraph "Memory Layout"
        A[Stack Memory] --> B[Primitive Values]
        A --> C[Function Calls]
        A --> D[Local Variables]

        E[Heap Memory] --> F[Objects]
        E --> G[Arrays]
        E --> H[Closures]
        E --> I[Event Listeners]
    end

    subgraph "Garbage Collection"
        J[Mark Phase] --> K[Sweep Phase]
        K --> L[Compact Phase]

        M[Reference Counting] --> N[Mark & Sweep]
        N --> O[Generational GC]
    end
```

### Event Loop Visualization

```mermaid
graph TD
    A[Call Stack] --> B{Stack Empty?}
    B -->|No| C[Execute Current Task]
    C --> A
    B -->|Yes| D[Check Microtask Queue]
    D --> E{Microtasks?}
    E -->|Yes| F[Execute Microtask]
    F --> D
    E -->|No| G[Check Task Queue]
    G --> H{Tasks?}
    H -->|Yes| I[Execute Task]
    I --> A
    H -->|No| J[Wait for Events]
    J --> D
```

## 🌐 Browser Architecture

### Browser Rendering Pipeline

```mermaid
graph LR
    subgraph "Browser Process"
        A[Network] --> B[HTML Parser]
        B --> C[DOM Tree]
        C --> D[CSS Parser]
        D --> E[CSSOM Tree]
        E --> F[Render Tree]
        F --> G[Layout]
        G --> H[Paint]
        H --> I[Composite]
    end

    subgraph "Performance"
        J[Critical Rendering Path] --> K[Optimization]
        L[GPU Acceleration] --> M[Hardware Rendering]
    end
```

### DOM Tree Structure

```mermaid
graph TD
    A[Document] --> B[html]
    B --> C[head]
    B --> D[body]
    C --> E[title]
    C --> F[meta]
    C --> G[link]
    D --> H[header]
    D --> I[main]
    D --> J[footer]
    H --> K[nav]
    I --> L[section]
    I --> M[article]
    L --> N[h1]
    L --> O[p]
    M --> P[h2]
    M --> Q[img]
```

### CSSOM Construction

```mermaid
graph LR
    subgraph "CSS Processing"
        A[CSS Files] --> B[CSS Parser]
        B --> C[CSSOM Tree]
        C --> D[Style Calculation]
        D --> E[Computed Styles]
    end

    subgraph "Specificity"
        F[Inline Styles] --> G[ID Selectors]
        G --> H[Class Selectors]
        H --> I[Element Selectors]
    end
```

## ⚡ Network & Performance

### HTTP Request/Response Flow

```mermaid
sequenceDiagram
    participant Browser
    participant DNS
    participant Server
    participant CDN

    Browser->>DNS: DNS Lookup
    DNS-->>Browser: IP Address
    Browser->>Server: TCP Handshake
    Server-->>Browser: Connection Established
    Browser->>Server: HTTP Request
    Server->>CDN: Check Cache
    CDN-->>Server: Cache Response
    Server-->>Browser: HTTP Response
    Browser->>Browser: Parse & Render
```

### Performance Optimization Strategies

```mermaid
graph TB
    subgraph "Loading Performance"
        A[Bundle Splitting] --> B[Code Splitting]
        B --> C[Tree Shaking]
        C --> D[Lazy Loading]
        D --> E[Preloading]
    end

    subgraph "Runtime Performance"
        F[Virtual DOM] --> G[Memoization]
        G --> H[Debouncing]
        H --> I[Throttling]
        I --> J[Web Workers]
    end

    subgraph "Caching"
        K[Browser Cache] --> L[Service Workers]
        L --> M[CDN Cache]
        M --> N[Application Cache]
    end
```

### Core Web Vitals

```mermaid
graph LR
    subgraph "Core Web Vitals"
        A[LCP] --> B[Largest Contentful Paint]
        C[FID] --> D[First Input Delay]
        E[CLS] --> F[Cumulative Layout Shift]
    end

    subgraph "Measurement"
        G[Real User Monitoring] --> H[Lab Testing]
        H --> I[Field Data]
        I --> J[Performance Budgets]
    end
```

## 🔒 Security Models

### Browser Security Architecture

```mermaid
graph TB
    subgraph "Security Layers"
        A[Same-Origin Policy] --> B[Content Security Policy]
        B --> C[Cross-Origin Resource Sharing]
        C --> D[Subresource Integrity]
    end

    subgraph "Attack Prevention"
        E[XSS Protection] --> F[CSRF Protection]
        F --> G[Clickjacking Protection]
        G --> H[Secure Headers]
    end

    subgraph "Authentication"
        I[JWT Tokens] --> J[OAuth 2.0]
        J --> K[Session Management]
        K --> L[Multi-Factor Auth]
    end
```

### XSS Attack Vectors

```mermaid
graph LR
    subgraph "XSS Types"
        A[Stored XSS] --> B[Reflected XSS]
        B --> C[DOM-based XSS]
    end

    subgraph "Prevention"
        D[Input Sanitization] --> E[Output Encoding]
        E --> F[Content Security Policy]
        F --> G[HttpOnly Cookies]
    end
```

## 📊 Visual Diagrams

### State Management Patterns

```mermaid
graph TB
    subgraph "State Management Evolution"
        A[Local State] --> B[Props Drilling]
        B --> C[Context API]
        C --> D[Redux]
        D --> E[Zustand]
        E --> F[Server State]
    end

    subgraph "Data Flow"
        G[Actions] --> H[Reducers]
        H --> I[Store]
        I --> J[Components]
        J --> K[UI Updates]
    end
```

### Component Architecture

```mermaid
graph TD
    subgraph "Component Types"
        A[Presentational] --> B[Container]
        B --> C[Higher-Order]
        C --> D[Render Props]
        D --> E[Compound]
        E --> F[Custom Hooks]
    end

    subgraph "Design Patterns"
        G[Observer Pattern] --> H[Factory Pattern]
        H --> I[Singleton Pattern]
        I --> J[Decorator Pattern]
    end
```

### Testing Pyramid

```mermaid
graph TD
    subgraph "Testing Strategy"
        A[E2E Tests] --> B[Integration Tests]
        B --> C[Unit Tests]
    end

    subgraph "Coverage"
        D[User Journeys] --> E[Component Integration]
        E --> F[Individual Functions]
    end
```

## 🧩 Knowledge Graphs

### Frontend Technology Relationships

```mermaid
graph TB
    subgraph "Core Technologies"
        A[JavaScript] --> B[TypeScript]
        A --> C[React]
        A --> D[Vue]
        A --> E[Angular]
    end

    subgraph "Build Tools"
        F[Webpack] --> G[Vite]
        G --> H[Rollup]
        H --> I[esbuild]
    end

    subgraph "Styling"
        J[CSS] --> K[Sass]
        K --> L[Styled Components]
        L --> M[Tailwind CSS]
    end

    subgraph "Testing"
        N[Jest] --> O[React Testing Library]
        O --> P[Cypress]
        P --> Q[Playwright]
    end
```

### Performance Optimization Map

```mermaid
graph LR
    subgraph "Loading"
        A[Bundle Size] --> B[Network Requests]
        B --> C[Critical Path]
    end

    subgraph "Runtime"
        D[Memory Usage] --> E[CPU Usage]
        E --> F[GPU Usage]
    end

    subgraph "User Experience"
        G[First Paint] --> H[Interactive]
        H --> I[Smooth Scrolling]
    end
```

### Security Threat Model

```mermaid
graph TB
    subgraph "Attack Vectors"
        A[Client-Side] --> B[Server-Side]
        B --> C[Network]
        C --> D[Social Engineering]
    end

    subgraph "Defense Layers"
        E[Input Validation] --> F[Output Encoding]
        F --> G[Authentication]
        G --> H[Authorization]
    end
```

## 📚 Additional Resources

### Interactive Learning Tools

- **JavaScript Visualizer**: [pythontutor.com](http://pythontutor.com/javascript.html)
- **React DevTools**: Browser extension for React debugging
- **Chrome DevTools**: Built-in browser debugging tools
- **Lighthouse**: Performance and accessibility auditing

### Recommended Reading

1. **"JavaScript: The Definitive Guide"** by David Flanagan
2. **"You Don't Know JS"** series by Kyle Simpson
3. **"High Performance Browser Networking"** by Ilya Grigorik
4. **"Web Application Security"** by Andrew Hoffman

### Practice Platforms

- **Frontend Mentor**: Real-world design challenges
- **CodePen**: Interactive code examples
- **JSFiddle**: Quick prototyping
- **CodeSandbox**: Full-stack development environment

---

## 🎯 Next Steps

1. **Study the diagrams** to understand relationships between concepts
2. **Practice with interactive tools** to reinforce learning
3. **Build projects** that incorporate multiple concepts
4. **Review regularly** to maintain knowledge retention
5. **Stay updated** with latest browser features and best practices
