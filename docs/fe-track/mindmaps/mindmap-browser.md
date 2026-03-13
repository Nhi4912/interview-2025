# Browser Internals Mind Map - Quick Reference

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Sơ đồ tổng hợp kiến thức Browser Internals cho interview.

---

## 🗺️ Browser Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      BROWSER INTERNALS MAP                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│                              ┌─────────────┐                             │
│                              │   BROWSER   │                             │
│                              └──────┬──────┘                             │
│                                     │                                     │
│           ┌─────────────────────────┼─────────────────────────┐          │
│           │                         │                         │          │
│           ▼                         ▼                         ▼          │
│   ┌───────────────┐         ┌───────────────┐         ┌───────────────┐ │
│   │ ARCHITECTURE  │         │   RENDERING   │         │   JS ENGINE   │ │
│   ├───────────────┤         ├───────────────┤         ├───────────────┤ │
│   │ • Multi-proc  │         │ • DOM/CSSOM   │         │ • V8 Pipeline │ │
│   │ • Site Isolate│         │ • Layout      │         │ • JIT Compile │ │
│   │ • IPC         │         │ • Paint       │         │ • Hidden Class│ │
│   │ • GPU Process │         │ • Composite   │         │ • Inline Cache│ │
│   └───────────────┘         └───────────────┘         └───────────────┘ │
│                                     │                                     │
│           ┌─────────────────────────┼─────────────────────────┐          │
│           │                         │                         │          │
│           ▼                         ▼                         ▼          │
│   ┌───────────────┐         ┌───────────────┐         ┌───────────────┐ │
│   │    STORAGE    │         │     APIS      │         │   DEVTOOLS    │ │
│   ├───────────────┤         ├───────────────┤         ├───────────────┤ │
│   │ • Cookies     │         │ • Observers   │         │ • Performance │ │
│   │ • localStorage│         │ • Workers     │         │ • Memory      │ │
│   │ • IndexedDB   │         │ • Timing      │         │ • Network     │ │
│   │ • Cache API   │         │ • Communic    │         │ • Debugging   │ │
│   └───────────────┘         └───────────────┘         └───────────────┘ │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Browser Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                MULTI-PROCESS ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    BROWSER PROCESS                       │   │
│   │  • UI (address bar, tabs)                                │   │
│   │  • Network requests                                      │   │
│   │  • Storage management                                    │   │
│   │  • Coordinate other processes                           │   │
│   └─────────────────────────────────────────────────────────┘   │
│                            │ IPC                                 │
│          ┌─────────────────┼─────────────────┐                  │
│          ▼                 ▼                 ▼                   │
│   ┌───────────┐     ┌───────────┐     ┌───────────┐             │
│   │ RENDERER  │     │ RENDERER  │     │    GPU    │             │
│   │ (Tab 1)   │     │ (Tab 2)   │     │  PROCESS  │             │
│   │           │     │           │     │           │             │
│   │ Main      │     │ Main      │     │ Composite │             │
│   │ Thread    │     │ Thread    │     │ WebGL     │             │
│   │ Compositor│     │ Compositor│     │ Decode    │             │
│   └───────────┘     └───────────┘     └───────────┘             │
│                                                                   │
│   SITE ISOLATION: Each site gets own process                    │
│   IPC: Processes communicate via messages                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Rendering Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    RENDERING PIPELINE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   HTML ──▶ DOM                                                   │
│             │                                                     │
│   CSS ──▶ CSSOM                                                  │
│             │                                                     │
│             ▼                                                     │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    RENDER TREE                           │   │
│   │  DOM + CSSOM = Render Tree (visible elements only)      │   │
│   └──────────────────────────┬──────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                      LAYOUT                              │   │
│   │  Calculate position and size of each element            │   │
│   │  Triggers: width, height, margin, padding, top, left    │   │
│   └──────────────────────────┬──────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                       PAINT                              │   │
│   │  Create paint commands for each element                  │   │
│   │  Triggers: color, background, shadow, visibility         │   │
│   └──────────────────────────┬──────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    COMPOSITE                             │   │
│   │  Combine layers on GPU                                   │   │
│   │  Triggers: transform, opacity (BEST!)                    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   OPTIMIZATION HIERARCHY:                                        │
│   🟢 Composite only (transform, opacity) - Fastest              │
│   🟡 Paint + Composite (color, background) - OK                 │
│   🔴 Layout + Paint + Composite (size, position) - Slowest      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚡ JavaScript Engine (V8)

```
┌─────────────────────────────────────────────────────────────────┐
│                       V8 ENGINE                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Source Code                                                     │
│       │                                                           │
│       ▼                                                           │
│   ┌─────────────┐                                                │
│   │   PARSER    │ ──▶ AST (Abstract Syntax Tree)                │
│   └──────┬──────┘                                                │
│          │                                                        │
│          ▼                                                        │
│   ┌─────────────┐                                                │
│   │  IGNITION   │ ──▶ Bytecode (Interpreter)                    │
│   │ Interpreter │     Fast startup, slower execution             │
│   └──────┬──────┘                                                │
│          │ Hot code                                               │
│          ▼                                                        │
│   ┌─────────────┐                                                │
│   │  TURBOFAN   │ ──▶ Machine Code (JIT)                        │
│   │ JIT Compiler│     Slow compile, fast execution               │
│   └──────┬──────┘                                                │
│          │ Deoptimization                                         │
│          ▼                                                        │
│   Back to Ignition                                               │
│                                                                   │
│   OPTIMIZATIONS:                                                 │
│   • Hidden Classes: Same shape objects share class               │
│   • Inline Caching: Cache property lookup locations              │
│                                                                   │
│   AVOID:                                                          │
│   • Changing object shapes                                        │
│   • delete operator                                               │
│   • arguments object                                              │
│   • eval/with                                                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💾 Storage Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│                    STORAGE OPTIONS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌───────────┬──────────┬──────────┬──────────┬───────────┐   │
│   │           │ Cookies  │localStorage│sessionSt │ IndexedDB │   │
│   ├───────────┼──────────┼──────────┼──────────┼───────────┤   │
│   │ Capacity  │   4KB    │  5-10MB  │  5-10MB  │   50MB+   │   │
│   ├───────────┼──────────┼──────────┼──────────┼───────────┤   │
│   │ Sent to   │   Yes    │    No    │    No    │    No     │   │
│   │ Server    │          │          │          │           │   │
│   ├───────────┼──────────┼──────────┼──────────┼───────────┤   │
│   │Persistence│ Config   │ Forever  │Tab close │  Forever  │   │
│   ├───────────┼──────────┼──────────┼──────────┼───────────┤   │
│   │   API     │  String  │  String  │  String  │   Async   │   │
│   ├───────────┼──────────┼──────────┼──────────┼───────────┤   │
│   │ Use Case  │  Auth    │  Prefs   │  Temp    │  Offline  │   │
│   │           │ Session  │  Cache   │  State   │  Complex  │   │
│   └───────────┴──────────┴──────────┴──────────┴───────────┘   │
│                                                                   │
│   Cookie Attributes:                                             │
│   • httpOnly: JS cannot access (server-set)                     │
│   • secure: HTTPS only                                           │
│   • sameSite: Strict|Lax|None (CSRF protection)                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Browser APIs

```
┌─────────────────────────────────────────────────────────────────┐
│                    BROWSER APIS                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   OBSERVERS                                                       │
│   ──────────                                                     │
│   IntersectionObserver  │ Element visibility in viewport        │
│     • Lazy loading, infinite scroll, analytics                  │
│                                                                   │
│   MutationObserver      │ DOM changes                            │
│     • Added/removed nodes, attribute changes                    │
│                                                                   │
│   ResizeObserver        │ Element size changes                   │
│     • Responsive components, container queries                  │
│                                                                   │
│   PerformanceObserver   │ Performance entries                    │
│     • Marks, measures, long tasks                               │
│                                                                   │
│   TIMING                                                          │
│   ──────                                                         │
│   setTimeout/Interval   │ Minimum ~4ms, not display-synced      │
│   requestAnimationFrame │ Synced with display refresh (16.67ms) │
│   requestIdleCallback   │ Run during browser idle time          │
│   queueMicrotask        │ After current task, before render     │
│                                                                   │
│   WORKERS                                                         │
│   ───────                                                        │
│   Web Worker            │ Background thread for heavy work      │
│   Service Worker        │ Network proxy, offline support        │
│   Shared Worker         │ Shared between tabs                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ DevTools Quick Reference

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVTOOLS PANELS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ELEMENTS                                                        │
│   • Inspect/edit DOM and styles                                  │
│   • Force element states (:hover, :focus)                        │
│   • $0 = selected element in console                            │
│                                                                   │
│   CONSOLE                                                         │
│   • console.table(), console.group()                             │
│   • $(), $$() for querySelector                                 │
│   • copy(), monitor(), debug()                                   │
│   • getEventListeners($0)                                        │
│                                                                   │
│   SOURCES                                                         │
│   • Breakpoints: line, conditional, logpoint                    │
│   • DOM breakpoints: subtree, attribute, removal                │
│   • Step: F10 (over), F11 (into), Shift+F11 (out)              │
│                                                                   │
│   NETWORK                                                         │
│   • Request timing breakdown                                     │
│   • Throttling (Slow 3G, Offline)                               │
│   • Filter by type, text, blocked                               │
│                                                                   │
│   PERFORMANCE                                                     │
│   • Flame chart: width = time, depth = call stack               │
│   • Long tasks (>50ms) = red triangle                           │
│   • Layout = purple, Paint = green, Script = yellow             │
│                                                                   │
│   MEMORY                                                          │
│   • Heap snapshot comparison for leaks                           │
│   • Allocation timeline for tracking                             │
│   • Shallow size vs Retained size                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Interview Quick Answers

| Topic | Question | Quick Answer |
|-------|----------|--------------|
| Architecture | Why multi-process? | Security (site isolation), stability (crash isolation), parallelism |
| Rendering | Layout thrashing? | Read→write→read pattern forces synchronous layout. Batch reads, then writes. |
| Rendering | Compositor-only? | transform, opacity - no main thread, GPU-handled |
| V8 | Hidden classes? | Objects with same shape share class for fast property access |
| V8 | Deoptimization? | Type changes force revert to interpreter |
| Storage | httpOnly cookie? | JavaScript cannot access - prevents XSS token theft |
| APIs | rAF vs setTimeout? | rAF syncs with display (60fps), setTimeout is minimum ~4ms |
| DevTools | Find memory leak? | Heap snapshots before/after, compare retained objects |

---

## 🎯 Performance Checklist

```
┌─────────────────────────────────────────────────────────────────┐
│                 PERFORMANCE OPTIMIZATION                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   RENDERING                                                       │
│   □ Use transform/opacity for animations                         │
│   □ Avoid layout thrashing (batch reads/writes)                 │
│   □ Use will-change sparingly                                    │
│   □ Minimize paint areas                                         │
│                                                                   │
│   JAVASCRIPT                                                      │
│   □ Keep object shapes consistent                                │
│   □ Avoid delete operator                                        │
│   □ Use typed arrays for heavy computation                       │
│   □ Offload to Web Workers                                       │
│                                                                   │
│   MEMORY                                                          │
│   □ Remove event listeners                                       │
│   □ Clear intervals/timeouts                                     │
│   □ Avoid detached DOM references                                │
│   □ Use WeakMap/WeakSet for caches                              │
│                                                                   │
│   NETWORK                                                         │
│   □ Lazy load images/components                                  │
│   □ Use Service Worker for caching                               │
│   □ Compress and minify assets                                   │
│   □ Use CDN for static resources                                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

> **Quay lại:** [README.md](./mindmap-foundations.md) - Browser Overview
