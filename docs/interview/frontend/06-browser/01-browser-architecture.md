# Browser Architecture - Multi-Process Design

> Modern browsers sử dụng multi-process architecture cho security và stability. Hiểu architecture giúp debug và optimize.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                CHROME MULTI-PROCESS ARCHITECTURE                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    BROWSER PROCESS                       │   │
│   │  • UI (address bar, tabs, bookmarks)                    │   │
│   │  • Network requests                                      │   │
│   │  • Storage management                                    │   │
│   │  • Coordinate other processes                           │   │
│   └─────────────────────────────────────────────────────────┘   │
│                            │ IPC                                 │
│          ┌─────────────────┼─────────────────┐                  │
│          │                 │                 │                   │
│          ▼                 ▼                 ▼                   │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐           │
│   │  RENDERER   │   │  RENDERER   │   │  RENDERER   │           │
│   │  PROCESS    │   │  PROCESS    │   │  PROCESS    │           │
│   │  (Tab 1)    │   │  (Tab 2)    │   │  (Tab 3)    │           │
│   │             │   │             │   │             │           │
│   │ • HTML/CSS  │   │ • HTML/CSS  │   │ • HTML/CSS  │           │
│   │ • JS Engine │   │ • JS Engine │   │ • JS Engine │           │
│   │ • Layout    │   │ • Layout    │   │ • Layout    │           │
│   └─────────────┘   └─────────────┘   └─────────────┘           │
│                                                                   │
│   Other Processes:                                               │
│   • GPU Process (rendering, compositing)                         │
│   • Network Process (network requests)                           │
│   • Plugin Process (Flash, etc.)                                 │
│   • Extension Process                                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Process Types

### Browser Process

```
┌─────────────────────────────────────────────────────────────────┐
│                      BROWSER PROCESS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Responsibilities:                                              │
│   ─────────────────                                              │
│   • UI Thread                                                     │
│     - Address bar, tabs, forward/back buttons                    │
│     - Handle user input (typing URL, clicking links)             │
│                                                                   │
│   • Network Thread                                               │
│     - Network stack operations                                   │
│     - DNS resolution                                             │
│     - TLS handshake                                              │
│                                                                   │
│   • Storage Thread                                               │
│     - File system access                                         │
│     - Database operations                                        │
│                                                                   │
│   Only ONE browser process per browser instance                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Renderer Process

```
┌─────────────────────────────────────────────────────────────────┐
│                      RENDERER PROCESS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                      MAIN THREAD                         │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │                                                           │   │
│   │   ┌───────────┐   ┌───────────┐   ┌───────────┐         │   │
│   │   │   HTML    │   │    CSS    │   │JavaScript │         │   │
│   │   │  Parser   │──▶│  Parser   │──▶│  Engine   │         │   │
│   │   └───────────┘   └───────────┘   └───────────┘         │   │
│   │         │               │               │                │   │
│   │         ▼               ▼               │                │   │
│   │   ┌───────────┐   ┌───────────┐        │                │   │
│   │   │    DOM    │   │  CSSOM    │        │                │   │
│   │   │   Tree    │   │   Tree    │        │                │   │
│   │   └─────┬─────┘   └─────┬─────┘        │                │   │
│   │         │               │               │                │   │
│   │         └───────┬───────┘               │                │   │
│   │                 ▼                       │                │   │
│   │         ┌───────────┐                   │                │   │
│   │         │  Render   │◀──────────────────┘                │   │
│   │         │   Tree    │                                    │   │
│   │         └─────┬─────┘                                    │   │
│   │               ▼                                          │   │
│   │         ┌───────────┐                                    │   │
│   │         │  Layout   │                                    │   │
│   │         └─────┬─────┘                                    │   │
│   │               ▼                                          │   │
│   │         ┌───────────┐                                    │   │
│   │         │   Paint   │                                    │   │
│   │         └───────────┘                                    │   │
│   │                                                           │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐           │
│   │  Compositor │   │   Raster    │   │    Tile     │           │
│   │   Thread    │   │   Thread    │   │   Worker    │           │
│   └─────────────┘   └─────────────┘   └─────────────┘           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### GPU Process

```
Responsibilities:
• Render final image to screen
• Handle WebGL/Canvas operations
• Compositing layers
• Video decoding

Benefits of separate process:
• GPU crashes don't crash browser
• Better security (sandboxed)
• Can leverage hardware acceleration
```

---

## 🔒 Site Isolation

### What is Site Isolation?

```
┌─────────────────────────────────────────────────────────────────┐
│                      SITE ISOLATION                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Before Site Isolation:                                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Single Renderer Process                     │   │
│   │  ┌───────────┐  ┌───────────┐  ┌───────────┐           │   │
│   │  │ evil.com  │  │ bank.com  │  │iframe:evil│           │   │
│   │  │           │  │ (secret!) │  │           │           │   │
│   │  └───────────┘  └───────────┘  └───────────┘           │   │
│   │                                                           │   │
│   │  Problem: evil.com could potentially read bank.com data  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   With Site Isolation:                                           │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐           │
│   │  Renderer   │   │  Renderer   │   │  Renderer   │           │
│   │  evil.com   │   │  bank.com   │   │iframe:evil  │           │
│   └─────────────┘   └─────────────┘   └─────────────┘           │
│         ╱                 │                 ╲                    │
│    ISOLATED           ISOLATED           ISOLATED                │
│                                                                   │
│   Each site runs in its own process                             │
│   Mitigates Spectre/Meltdown attacks                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Cross-Origin Isolation

```javascript
// Enable cross-origin isolation for SharedArrayBuffer
// Response headers:
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin

// Check if isolated
if (crossOriginIsolated) {
    // Can use SharedArrayBuffer
    const buffer = new SharedArrayBuffer(1024);
}
```

---

## 📨 IPC (Inter-Process Communication)

### How Processes Communicate

```
┌─────────────────────────────────────────────────────────────────┐
│                    IPC COMMUNICATION                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Browser Process                                                │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  "Navigate to example.com"                               │   │
│   │            │                                             │   │
│   │            │ IPC Message                                 │   │
│   │            ▼                                             │   │
│   │  Network Thread: Fetch resources                         │   │
│   │            │                                             │   │
│   │            │ IPC: Resource data                          │   │
│   │            ▼                                             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                │                                                 │
│                │ IPC: Commit navigation                          │
│                ▼                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Renderer Process                                        │   │
│   │  • Parse HTML                                            │   │
│   │  • Build DOM                                             │   │
│   │  • Execute JS                                            │   │
│   │  • Render page                                           │   │
│   │            │                                             │   │
│   │            │ IPC: "Page loaded"                          │   │
│   │            ▼                                             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                │                                                 │
│                ▼                                                 │
│   Browser Process updates UI (stop loading spinner)             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### IPC Message Types

```javascript
// Conceptual - actual implementation is C++

// Browser → Renderer
{
    type: 'NavigationCommit',
    url: 'https://example.com',
    navigationId: 123
}

// Renderer → Browser
{
    type: 'FrameHostMsg_DidFinishLoad',
    frameId: 1,
    validatedURL: 'https://example.com'
}

// User input flow
{
    type: 'InputMsg_HandleInputEvent',
    event: {
        type: 'click',
        x: 100,
        y: 200
    }
}
```

---

## 🔄 Navigation Flow

### What Happens When You Type a URL

```
┌─────────────────────────────────────────────────────────────────┐
│                    NAVIGATION FLOW                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. UI THREAD (Browser Process)                                 │
│      ├── User types URL                                          │
│      ├── Validate input (URL? Search query?)                     │
│      └── Start loading indicator                                 │
│                          │                                        │
│   2. NETWORK THREAD                                              │
│      ├── DNS lookup                                              │
│      ├── TLS handshake (if HTTPS)                                │
│      ├── Send HTTP request                                       │
│      ├── Receive response headers                                │
│      │   └── Check Content-Type                                  │
│      │       └── HTML? → Renderer                                │
│      │       └── ZIP? → Download manager                         │
│      └── CORS/Safe Browsing checks                               │
│                          │                                        │
│   3. FIND/CREATE RENDERER                                        │
│      ├── Network thread tells UI thread data is ready            │
│      ├── UI thread finds/creates renderer process                │
│      └── Site isolation: new process for new site                │
│                          │                                        │
│   4. COMMIT NAVIGATION                                           │
│      ├── IPC: Browser → Renderer with data stream                │
│      ├── Renderer confirms receipt                               │
│      ├── Browser updates UI (URL bar, history)                   │
│      └── Session history updated                                 │
│                          │                                        │
│   5. RENDERING (See rendering-pipeline.md)                       │
│      ├── Parse HTML                                              │
│      ├── Load subresources                                       │
│      ├── Execute JavaScript                                      │
│      └── Paint to screen                                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧵 Threads in Renderer Process

### Main Thread Responsibilities

```javascript
// Main thread does A LOT - can become bottleneck

// 1. Parse HTML
const dom = parseHTML(html);

// 2. Parse CSS
const cssom = parseCSS(css);

// 3. Execute JavaScript
executeScript(jsCode); // This blocks everything else!

// 4. Calculate styles
const computedStyles = getComputedStyle(element);

// 5. Layout
calculateLayout(renderTree);

// 6. Paint (create paint records)
createPaintRecords(layoutTree);

// Main thread is busy = janky UI
// Goal: Keep main thread work < 16ms per frame
```

### Compositor Thread

```javascript
// Compositor thread handles:
// • Scrolling (when possible)
// • CSS animations (transform, opacity)
// • Layer compositing

// Properties that don't need main thread:
.optimized {
    transform: translateY(100px);  /* Compositor only */
    opacity: 0.5;                   /* Compositor only */
}

// Properties that need main thread:
.not-optimized {
    top: 100px;      /* Triggers layout */
    background: red; /* Triggers paint */
}
```

---

## 📊 Memory Model

```
┌─────────────────────────────────────────────────────────────────┐
│                    BROWSER MEMORY MODEL                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Each process has its own memory space                          │
│                                                                   │
│   Browser Process (~100-200 MB)                                  │
│   ├── UI state                                                   │
│   ├── Network cache references                                   │
│   └── Coordination data                                          │
│                                                                   │
│   Renderer Process (~100-500+ MB each)                           │
│   ├── DOM tree                                                   │
│   ├── JavaScript heap                                            │
│   ├── Bitmap cache                                               │
│   ├── GPU resources                                              │
│   └── Web Worker heaps                                           │
│                                                                   │
│   GPU Process (~50-200 MB)                                       │
│   ├── Texture memory                                             │
│   └── Shader programs                                            │
│                                                                   │
│   Memory increases with:                                          │
│   • More tabs                                                     │
│   • Complex pages                                                 │
│   • Heavy JavaScript                                              │
│   • Many images/videos                                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Tại sao browser dùng multi-process?**

A: Security (site isolation prevents cross-site attacks), Stability (one tab crash doesn't crash browser), Performance (parallel processing).

**Q: Browser process vs Renderer process?**

A:
- Browser: UI, network, storage, coordination. One per browser.
- Renderer: Parse HTML/CSS, run JS, render page. One per site/tab.

### 🟡 Mid-level

**Q: Site Isolation là gì? Tại sao cần?**

A: Mỗi site chạy trong separate process. Prevents Spectre/Meltdown attacks where malicious site could read memory from another site. Each site's data is isolated in different address space.

**Q: Tại sao JavaScript chạy trên main thread là problem?**

A: Main thread handles parsing, layout, paint, và JS execution. Long-running JS blocks other work → janky UI. Solution: break up work, use Web Workers, optimize critical path.

### 🔴 Senior

**Q: Giải thích navigation flow chi tiết**

A:
1. UI thread handles user input
2. Network thread does DNS lookup, TCP/TLS, HTTP request
3. Browser finds/creates renderer process (site isolation)
4. IPC commits navigation with data stream
5. Renderer parses, renders, executes JS
6. Browser updates UI on completion

---

## 📚 Active Recall

1. [ ] List 4 main browser processes
2. [ ] What does site isolation prevent?
3. [ ] Main thread responsibilities (5 things)
4. [ ] Navigation flow steps
5. [ ] IPC purpose

---

> **Tiếp theo:** [02-rendering-pipeline.md](./02-rendering-pipeline.md) - Rendering Pipeline
