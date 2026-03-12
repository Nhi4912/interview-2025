# Browser Internals - How Browsers Work

> Hiểu browser internals giúp optimize performance và debug issues hiệu quả. Kiến thức quan trọng cho senior interviews.

---

## 🎯 Module Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    BROWSER INTERNALS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐           │
│   │ ARCHITECTURE│   │  RENDERING  │   │  JS ENGINE  │           │
│   │             │   │  PIPELINE   │   │             │           │
│   │ Multi-proc  │   │ DOM→Layout  │   │ V8, JIT    │           │
│   │ IPC         │   │ Paint→Comp  │   │ Optimization│          │
│   └─────────────┘   └─────────────┘   └─────────────┘           │
│                                                                   │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐           │
│   │   STORAGE   │   │    APIS     │   │  DEVTOOLS   │           │
│   │             │   │             │   │             │           │
│   │ localStorage│   │ Web APIs    │   │ Performance │           │
│   │ IndexedDB   │   │ Timers      │   │ Debugging   │           │
│   └─────────────┘   └─────────────┘   └─────────────┘           │
│                                                                   │
│   Tại sao quan trọng:                                            │
│   • Optimize rendering performance                               │
│   • Debug complex issues                                         │
│   • Avoid common pitfalls                                        │
│   • Senior-level interview questions                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📚 Nội Dung Module

### 1. [Browser Architecture](./01-browser-architecture.md)
- Multi-process architecture
- Browser process vs Renderer process
- Site isolation
- IPC (Inter-Process Communication)

### 2. [Rendering Pipeline](./02-rendering-pipeline.md)
- Critical rendering path
- DOM, CSSOM, Render Tree
- Layout (Reflow)
- Paint và Composite

### 3. [JavaScript Engine](./03-javascript-engine.md)
- V8 engine internals
- JIT compilation
- Hidden classes
- Inline caching

### 4. [Browser Storage](./04-browser-storage.md)
- localStorage vs sessionStorage
- IndexedDB
- Cookies
- Cache API

### 5. [Browser APIs](./05-browser-apis.md)
- Intersection Observer
- Mutation Observer
- ResizeObserver
- Web Workers

### 6. [DevTools Mastery](./06-devtools-mastery.md)
- Performance profiling
- Memory debugging
- Network analysis
- Rendering debugging

---

## 🎯 Learning Objectives

Sau khi hoàn thành module này, bạn sẽ:

- [ ] Hiểu multi-process architecture của modern browsers
- [ ] Giải thích được critical rendering path
- [ ] Optimize JavaScript performance với V8 internals
- [ ] Chọn đúng storage mechanism cho use case
- [ ] Sử dụng advanced Browser APIs
- [ ] Master Chrome DevTools cho debugging

---

## 📖 Recommended Path

```
Week 1: Architecture + Rendering Pipeline
Week 2: JavaScript Engine + Storage
Week 3: Browser APIs + DevTools
```

---

> **Tiếp theo:** [01-browser-architecture.md](./01-browser-architecture.md) - Browser Architecture
