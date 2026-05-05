# WebAssembly for Frontend & Backend (2026)

> **Track**: Shared (2026 Trends) | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Back to:** [📚 Table of Contents](../00-table-of-contents.md) | [2026 Trends Index](./README.md)

---

## 🌍 Real-World Scenario

**Figma's WebAssembly bet (2017–2025).** Figma's rendering engine is C++ compiled to WebAssembly, running in the browser. In 2017, when WebAssembly shipped in browsers, Figma was already there. In 2024, they migrated parts of their multiplayer engine to **Rust → Wasm** for memory safety. In 2025, they began experimenting with **server-side Wasm** for plugin sandboxing — running untrusted user JavaScript safely inside a Wasm sandbox on Cloudflare Workers.

**1Password's adoption (2024–2025).** 1Password's browser extension uses Rust compiled to WebAssembly for cryptography. The reason is not just speed — it's **portability**: the same Rust crypto code runs in their Mac app, iOS app, Android app, browser extension (via Wasm), and CLI. One audit, one codebase, six platforms.

**Shopify's Functions platform (2023–2025).** Shopify lets merchants write custom checkout logic in **Rust, JavaScript, or AssemblyScript → Wasm**. The Wasm modules run inside Shopify's edge network. Why Wasm? **Sandboxing + portability + cold-start near zero**. Each module has a 5ms execution budget; Wasm meets that consistently.

> **Vietnamese:** Wasm không còn là "tối ưu game trong browser." Năm 2026 nó là một **hạ tầng tính toán đa nền tảng**: chạy crypto trong browser (Figma, 1Password), sandbox plugin của khách hàng trên server (Shopify, Cloudflare), thay thế Docker cho microservice nhẹ (Fermyon Spin). Hiểu Wasm = hiểu một lớp hạ tầng mới giữa "container" và "function."

---

## 🧠 A1. Memory Hook (Mnemonic)

> **"Wasm = Write Once, Sandbox Many. Compile any language → run any host, with capability-based security."**

```
┌────────────────────────────────────────────┐
│   SOURCE LANGUAGES                         │
│   Rust │ Go │ C/C++ │ AssemblyScript │ ... │
│           │                                │
│           ↓ compile                        │
│   ┌────────────────────────┐               │
│   │  WASM MODULE (.wasm)   │  ~bytecode    │
│   │  + Component Model     │               │
│   └────────────────────────┘               │
│           │                                │
│           ↓ run on any HOST                │
│   Browser │ Node │ Cloudflare │ Spin │ ... │
│           │                                │
│           ↓ via WASI 0.2 interfaces        │
│   Filesystem │ HTTP │ KV │ Sockets         │
│   (capability-based, host grants access)   │
└────────────────────────────────────────────┘
```

**Vietnamese:** Compile bất kỳ ngôn ngữ nào → một file `.wasm` → chạy trên bất kỳ host nào (browser, server, edge). Bảo mật bằng capability — host phải **cấp quyền** mới cho Wasm gọi filesystem, network, v.v. Không phải "ambient authority" như process Linux.

---

## 💡 A2. Why Wasm Exists (2 Levels Deep)

**Level 1 — Why not just JavaScript on FE / Docker on BE?**

JavaScript is great for UI, but slow and memory-hungry for compute-heavy tasks (image processing, crypto, game engines, codecs). Docker is great for sandboxing services, but cold start = seconds, image size = hundreds of MB, and sandboxing is OS-level (escape if kernel bug).

**Level 2 — Why a new bytecode standard at all?**

The web needed a portable compile target that:

1. **Executes near native speed** (within 1.2-1.5x of native for compute).
2. **Sandboxed by design** (cannot read memory outside its own linear memory).
3. **Language-agnostic** (Rust, Go, C++, Zig, Swift all compile to it).
4. **Deterministic & verifiable** (bytecode validated before execution).

WebAssembly delivered all four in 2017. The 2024–2025 evolution — **Component Model + WASI 0.2** — extended it from "fast browser code" to "universal sandboxed compute unit": run a Wasm module on any host (browser, server, edge, embedded), pass typed values between modules in different languages, and grant fine-grained capabilities.

> **Vietnamese:** JS chậm cho compute, Docker nặng cho sandbox. Wasm vừa nhanh (gần native) vừa nhẹ (KB), vừa sandbox tốt (linear memory + capability), vừa đa ngôn ngữ. Component Model + WASI 0.2 (2024) đưa Wasm từ "code nhanh trong browser" thành "đơn vị compute sandbox đa nền tảng."

---

## 🎯 A3. Core Concept #1 — Wasm Execution Model & Linear Memory

### Layer 1: Simple Analogy

A Wasm module is like a **kitchen with one big counter (linear memory) and a closed door (no escape)**. The module gets a fixed-size piece of memory it can read/write. It cannot peek into the host's pantry (browser DOM, OS files) unless the host explicitly hands it ingredients.

### Layer 2: How It Works (Technical)

```
┌─────────────── Host (Browser / Node / Wasmtime) ───────────────┐
│                                                                │
│   ┌────────────────── Wasm Instance ──────────────────────┐    │
│   │                                                        │   │
│   │  Linear Memory (typed array of bytes, growable)        │   │
│   │  ┌──────────────────────────────────────────┐          │   │
│   │  │ [stack][heap][...]                       │          │   │
│   │  │  ↑ module CAN read/write this            │          │   │
│   │  └──────────────────────────────────────────┘          │   │
│   │                                                        │   │
│   │  Functions (exported / imported)                       │   │
│   │   - exports: add(i32, i32) → i32                       │   │
│   │   - imports: log(i32) (host provides)                  │   │
│   │                                                        │   │
│   │  No direct access to:                                  │   │
│   │   ✗ Host memory, DOM, OS, network                      │   │
│   │   ✗ Other Wasm instances' memory                       │   │
│   └────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

**Key facts:**

- **Linear memory** is a single contiguous `ArrayBuffer` (in browser) or byte slice (on server). The module's pointers are offsets into this buffer.
- All numeric types: `i32, i64, f32, f64`. No strings, no objects. Strings = pointer + length into linear memory; the host must read it back.
- **Imports/exports** are the only way data crosses the boundary. Host calls `module.exports.add(1,2)`; module calls `host_log(ptr, len)` if the host provided that import.
- **No threads by default** (shared memory + atomics is opt-in, requires headers like `Cross-Origin-Opener-Policy` in browser).

**Browser example (manual, low-level):**

```js
const wasm = await WebAssembly.instantiateStreaming(fetch("/add.wasm"), {
  env: { log: (n) => console.log(n) },
});
const result = wasm.instance.exports.add(2, 3); // 5
```

**Server example (Wasmtime/Node):**

```js
import { WASI } from "node:wasi";
import { readFile } from "node:fs/promises";

const wasi = new WASI({ version: "preview1", args: [], env: {} });
const wasm = await WebAssembly.compile(await readFile("./module.wasm"));
const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());
wasi.start(instance);
```

### Layer 3: Edge Cases

- **Memory growth:** Linear memory can grow (`memory.grow`) but never shrink. Long-running Wasm processes can leak memory if you don't manage allocations.
- **String passing overhead:** Calling JS↔Wasm with strings = copy. For tight loops, batch operations or use shared memory.
- **GC integration (2024):** WasmGC proposal allows Wasm to use the host's garbage collector. Java, Kotlin, Dart can now compile to Wasm without bundling their own GC.
- **Threads & SIMD:** Both ship in modern browsers (2024+). SIMD gives ~4x speedup for vectorizable ops. Threads need shared memory + COOP/COEP headers.

> **Vietnamese:** Wasm có một ô nhớ duy nhất (linear memory). Numeric type only — string phải pass qua pointer + length. Import/export là cầu nối duy nhất với host. Không truy cập DOM, OS trực tiếp. WasmGC (2024) cho phép Java/Kotlin compile Wasm không cần bundle GC riêng.

---

## 🎯 A4. Core Concept #2 — WASI 0.2 + Component Model

### Layer 1: Simple Analogy

WASI = **POSIX for Wasm**. A standardized way for Wasm modules to ask the host: "give me a file handle," "open a TCP socket," "read an env var" — but only **if the host grants the capability**.

Component Model = **TypeScript types for Wasm modules**. Different languages can pass complex data (strings, lists, records) between each other safely, because the types are declared in a language-agnostic IDL (WIT — Wasm Interface Types).

### Layer 2: How It Works (Technical)

**Capability-based security:**

```
Traditional Linux process:                Wasm + WASI:
─────────────────────────                ─────────────
process can:                             module can ONLY:
 ✓ open ANY file it has perms for         ✓ files in dirs HOST passed in
 ✓ open ANY socket                        ✓ sockets HOST allowlisted
 ✓ read ANY env var                       ✓ env vars HOST exposed
 ✓ fork, exec arbitrary commands          ✗ (no syscall escape)
```

**WIT (Wasm Interface Types) example:**

```wit
// greet.wit
package example:greeter@0.1.0

interface api {
  greet: func(name: string) -> string
  record user { id: u64, name: string }
  list-users: func() -> list<user>
}

world greeter {
  export api
}
```

**Compile Rust to component:**

```bash
cargo component build --release
# outputs: target/wasm32-wasi/release/greeter.wasm (a component)
```

**Run from any host (Wasmtime, Node, JCO/jspawn, browser):**

```js
import { greet, listUsers } from "./greeter.wasm";
console.log(greet("Alice")); // "Hello, Alice"
console.log(listUsers()); // [{ id: 1, name: 'Alice' }]
```

The magic: `greeter.wasm` could be Rust, the consumer could be JS, and they exchange typed records (no manual JSON serialization).

**Component Model benefits:**

1. **Polyglot composition:** Mix Rust + Go + JS modules in one app, each in its own sandbox.
2. **Stable ABI:** Modules from different toolchain versions interop.
3. **Capability declaration:** WIT lists what a component imports — easy security audit.

### Layer 3: Edge Cases

- **WASI 0.2 is recent (2024):** Older runtimes only support WASI Preview 1 (similar to old POSIX, no Component Model). Check runtime support.
- **No async story yet (early 2025):** Async/await across components is in proposal (`wasi:io/poll`). For now, async = host-managed.
- **Tooling maturity:** `cargo-component` (Rust), TinyGo (Go), `jco`/`jspawn` (JS) are stable; other languages are catching up.
- **Component vs core module:** Components are the new unit; raw `.wasm` modules still work but lack typed interop.

> **Vietnamese:** WASI = POSIX cho Wasm, capability-based (host phải cấp quyền). Component Model = TypeScript types cho Wasm — declare interface bằng WIT (Wasm Interface Types), khác ngôn ngữ vẫn pass typed data cho nhau. Cargo-component (Rust), jco (JS), TinyGo (Go) là toolchain chính.

---

## 🎯 A5. Core Concept #3 — Wasm in the Browser (Frontend)

### Layer 1: Simple Analogy

Browser Wasm = **a CPU-bound coprocessor next to the JS engine**. JS handles UI, events, async; Wasm handles math, crypto, image/video processing. They share data via `ArrayBuffer`.

### Layer 2: How It Works (Technical)

**Use cases proven in production (2025):**

| Use case                    | Example                           | Why Wasm                             |
| --------------------------- | --------------------------------- | ------------------------------------ |
| **Design tool rendering**   | Figma, Photopea                   | Native-speed canvas operations       |
| **Crypto**                  | 1Password, signal-protocol        | Audited Rust code, not JS rewrite    |
| **Video encoding/decoding** | Google Meet, Zoom Web             | Hardware codecs not always available |
| **Image processing**        | Squoosh, Photopea                 | Tight pixel loops                    |
| **Game engines**            | Unity Web, Godot Web              | Existing C++ code base               |
| **PDF rendering**           | PDF.js Wasm fallback              | Complex parsers                      |
| **CAD/3D**                  | Onshape, AutoCAD Web              | Decades of C++                       |
| **AI inference**            | ONNX Runtime Web, Transformers.js | Run ML models client-side            |

**Loading pattern:**

```js
// 1. Streaming compile while download (preferred)
const { instance } = await WebAssembly.instantiateStreaming(fetch("/heavy.wasm"), imports);

// 2. Use in worker (so main thread stays responsive)
const worker = new Worker("worker.js", { type: "module" });
worker.postMessage({ type: "process", buffer: arrayBuffer }, [arrayBuffer]);
```

**Best practice: run Wasm in a Web Worker** for any non-trivial computation. The main thread should never block.

**JS ↔ Wasm interop costs:**

- Numeric calls: ~100ns overhead (negligible).
- String/object calls: copy through linear memory (~µs to ms depending on size).
- For tight loops: do the loop inside Wasm, return only the result.

### Layer 3: Edge Cases

- **Bundle size:** Wasm modules can be MBs. Use streaming compile + lazy load.
- **First-load tax:** Initial Wasm download + compile = TTI cost. Worth it for heavy compute, not for trivial functions.
- **Debugging:** DWARF support in Chrome DevTools is decent for Rust/C++. Source maps for AssemblyScript.
- **Security headers:** SharedArrayBuffer + threads requires `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp`. Breaks third-party iframes.

> **Vietnamese:** Browser Wasm = coprocessor cho JS. Dùng cho compute (crypto, image, video, CAD, AI inference, game). Chạy trong Web Worker để không block UI. JS↔Wasm: numeric call rẻ, string/object call có cost copy. Bundle size có thể MB → streaming compile + lazy load.

---

## 🎯 A6. Core Concept #4 — Wasm on the Server (Backend & Edge)

### Layer 1: Simple Analogy

Server-side Wasm = **a smaller, faster, safer Docker**. Same idea (sandboxed compute unit), but:

- **KB instead of MB** (no OS in the image).
- **Microseconds cold start** (no kernel boot).
- **Capability-based** (no syscall escape).

### Layer 2: How It Works (Technical)

**Three production runtimes (2025):**

| Runtime                | Use case                        | Notes                                   |
| ---------------------- | ------------------------------- | --------------------------------------- |
| **Wasmtime**           | General-purpose, embedded       | Reference impl, Rust, Bytecode Alliance |
| **Wasmer**             | General-purpose, plugin systems | Embeddable in many languages            |
| **Spin (Fermyon)**     | HTTP services, FaaS-style       | Wasm equivalent of Node.js servers      |
| **Cloudflare Workers** | Edge compute                    | Wasm for non-JS guests + CPU-heavy work |
| **WasmEdge**           | AI inference, K8s pods          | Optimized for ML, edge devices          |

**Spin "hello world" (Rust):**

```rust
use spin_sdk::http::{IntoResponse, Request, Response};
use spin_sdk::http_component;

#[http_component]
fn handle(req: Request) -> anyhow::Result<impl IntoResponse> {
    Ok(Response::builder()
        .status(200)
        .body("hello from Wasm")
        .build())
}
```

```bash
spin build && spin up
# starts HTTP server on :3000, cold start <1ms
```

**Cloudflare Workers Wasm import (mixing JS + Wasm):**

```js
import wasmModule from "./crypto.wasm";

export default {
  async fetch(request) {
    const instance = await WebAssembly.instantiate(wasmModule);
    const hash = instance.exports.hash_password("secret");
    return new Response(hash);
  },
};
```

**Use cases proven (2025):**

1. **Plugin systems:** Shopify Functions, Postman runtimes, Figma plugins (next-gen). Run untrusted user code safely.
2. **Edge compute:** Cloudflare Workers (Rust → Wasm for crypto, image transform).
3. **Microservices:** Fermyon Cloud, Cosmonic — replace lightweight Docker containers.
4. **AI inference:** WasmEdge runs ONNX/llama models on edge devices.
5. **Database extensions:** Postgres extensions in Wasm (e.g., wasm-postgres).

**Why Wasm wins over containers for these:**

```
                 Docker container    Wasm module
─────────────────────────────────────────────────
Cold start       100ms - 5s          50µs - 5ms
Image size       50 MB - 1 GB        50 KB - 5 MB
Memory baseline  100+ MB             few MB
Density / host   100s                10,000s
Security model   namespaces+seccomp  capabilities
Portability      x86_64/arm64 build  one binary, all archs
```

### Layer 3: Edge Cases

- **Not for everything.** Long-running stateful services (DB, message queue) — use containers. Wasm shines for stateless, request-scoped compute.
- **Async I/O is still maturing.** WASI 0.2 has poll-based I/O; full async story (wasi-io) lands gradually.
- **Network access:** WASI sockets exist but not all hosts expose them. Cloudflare Workers proxies network through host APIs.
- **No native libraries:** Can't `dlopen` a `.so`. Must compile dependencies to Wasm (or bridge through host imports).
- **Observability:** Tracing/profiling is less mature than for containers. OpenTelemetry support exists but evolving.

> **Vietnamese:** Server Wasm = Docker nhỏ hơn 1000x, cold start nhanh hơn 1000x, sandbox bằng capability. Runtime chính: Wasmtime, Wasmer, Spin (HTTP service), Cloudflare Workers, WasmEdge (AI). Use case mạnh: plugin sandbox (Shopify), edge compute, FaaS, AI inference. Không thay container cho stateful service.

---

## ⚠️ A7. Common Mistakes Table

| Sai lầm                                          | Tại sao sai                                                         | Đúng là                                                                      |
| ------------------------------------------------ | ------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Compile cả app web sang Wasm để "tăng tốc"       | UI/DOM bị bottleneck là bandwidth + render, không phải JS           | Chỉ compile phần CPU-bound (crypto, image, codec) sang Wasm                  |
| Chạy Wasm trên main thread cho task nặng         | Block UI, jank                                                      | Chạy trong Web Worker, postMessage transferable                              |
| Pass string giữa JS và Wasm trong tight loop     | Mỗi call copy bytes qua linear memory → chậm hơn JS gốc             | Loop bên trong Wasm, return result một lần                                   |
| Tin Wasm là "secure by default" cho user code    | Wasm cô lập memory, nhưng vẫn DDoS được nếu không giới hạn fuel/CPU | Set fuel limit (Wasmtime), CPU time budget (Workers), memory cap             |
| Dùng Wasm thay Docker cho mọi service            | Wasm thiếu native lib, async I/O còn non, ecosystem kém             | Wasm cho stateless compute / plugin / edge; Docker cho stateful service      |
| Bỏ qua bundle size trên FE                       | File `.wasm` 5 MB → first load chậm                                 | Streaming compile + lazy load + Brotli compression + split modules           |
| Không set COOP/COEP cho threads                  | SharedArrayBuffer bị disable → multi-thread Wasm không chạy         | Set COOP same-origin + COEP require-corp; chấp nhận third-party iframe break |
| Compile Go bằng tinygo nhưng dùng goroutine nặng | TinyGo runtime hạn chế, một số API stdlib thiếu                     | Dùng Rust hoặc C cho Wasm hiệu năng; Go phù hợp cho prototype                |
| Không version WIT interface                      | Caller crash khi component nâng cấp                                 | Dùng semver trong package WIT, breaking change → bump major                  |
| Quên capability declaration                      | Module yêu cầu file system nhưng host không cấp → runtime error     | List rõ capability cần trong manifest, fail fast khi thiếu                   |

---

## 🎯 A8. Interview Pattern (Trigger Keywords + Opening)

**Trigger keywords:** "WebAssembly", "Wasm", "WASI", "Component Model", "edge runtime", "plugin sandbox", "near-native browser performance", "polyglot", "Spin", "Wasmtime".

**Opening (1-2 sentences for any Wasm question):**

> "Tôi xem Wasm qua 2 trục: **trục FE** (coprocessor cho compute-heavy task: crypto, image, AI inference, chạy trong Worker) và **trục BE/edge** (sandbox compute unit thay container nhẹ — cold start µs, KB image, capability-based security). Năm 2026, Component Model + WASI 0.2 mở khóa polyglot composition và plugin sandbox cho user code (Shopify Functions, Cloudflare)."

---

## 🔑 A9. Knowledge Chain

**📚 Prerequisites:**

- [Browser Performance](../fe-track/06-browser-performance/01-rendering-pipeline.md)
- [JavaScript Runtime](../fe-track/01-javascript/13-event-loop-deep.md)
- [OS & Processes](../be-track/02-backend-knowledge/05-os-go.md)
- [04 — Edge Computing & Serverless 2026](./04-edge-computing-serverless-2026.md)

**➡️ Enables:**

- [08 — Rust for Backend Engineers](./08-rust-for-backend-engineers.md) (Rust → Wasm is the prime path)
- [09 — AI Agent Evaluation & Production](./09-ai-agent-evaluation-production.md) (WasmEdge for ML inference)
- [12 — Platform Engineering & DX](./12-platform-engineering-dx.md) (Wasm-based plugins on platform)

---

# Part B — Interview Q&A (Graded)

## 🟢 B1. What is WebAssembly and what problem does it solve?

**💡 Interview Signal:**

- ✅ **Strong:** Mentions portable compile target, near-native speed, sandboxing, polyglot, both browser + server use cases.
- ❌ **Weak:** "It's faster JavaScript."

**Answer (EN):**
WebAssembly (Wasm) is a portable, sandboxed, near-native-speed bytecode format. Languages like Rust, Go, C/C++, AssemblyScript, and Swift compile to Wasm; the bytecode then runs on any **host**: browsers, Node.js, edge runtimes (Cloudflare Workers), standalone runtimes (Wasmtime, Wasmer), or embedded devices.

**Problems it solves:**

1. **CPU-bound tasks in the browser** (crypto, codecs, CAD, games) where JS is too slow.
2. **Polyglot code reuse** — one Rust crypto library runs in browser, mobile, server, and CLI.
3. **Sandboxed plugin systems** — run untrusted user code safely (Shopify Functions, Figma plugins).
4. **Lightweight compute units** on the server — KB-sized, microsecond cold start, capability-based security (a smaller, faster, safer Docker for stateless workloads).

**Key properties:** Linear memory model (no host pointer access), capability-based security via WASI, deterministic execution (validated bytecode).

**Vietnamese:** Wasm = bytecode portable, sandbox, gần native. Rust/Go/C++ compile sang nó. Chạy trên browser, server, edge. Giải 4 vấn đề: compute nặng trong browser, dùng lại code đa nền tảng, plugin sandbox, đơn vị compute siêu nhẹ trên server.

---

## 🟢 B2. When would you NOT use WebAssembly?

**💡 Interview Signal:**

- ✅ **Strong:** Lists specific anti-patterns (DOM manipulation, simple business logic, stateful services, async-heavy I/O).
- ❌ **Weak:** "When I don't need performance."

**Answer (EN):**
**Don't use Wasm when:**

1. **DOM/UI manipulation** — Wasm has no DOM access; you'd marshal every call back through JS, killing perf gain.
2. **Trivial business logic** — bundle size + JS↔Wasm overhead > the speedup.
3. **Stateful long-running services** (DB, message queue) — containers handle this better; Wasm async I/O is still maturing.
4. **Heavy use of native libraries** (e.g., FFI to system libs) — can't `dlopen .so` in Wasm; must port everything.
5. **Tasks dominated by I/O, not CPU** — JS is fine; Wasm only wins for compute.
6. **Small team, short timeline** — toolchain (Rust, cargo-component, WIT) has a learning curve.

**Vietnamese:** Không dùng Wasm cho: DOM manipulation, business logic đơn giản, service stateful chạy dài, code phụ thuộc native lib, task nặng I/O, hoặc team nhỏ ngắn hạn (toolchain học mất thời gian).

---

## 🟢 B3. How does the JavaScript ↔ WebAssembly boundary work?

**💡 Interview Signal:**

- ✅ **Strong:** Mentions linear memory, numeric-only types at boundary, string passing via pointer+length, copy cost in tight loops.
- ❌ **Weak:** "They just call each other."

**Answer (EN):**
A Wasm instance has a **linear memory** — a single `ArrayBuffer` (in browser) shared with JS. Functions exchange only **numeric types** (`i32, i64, f32, f64`). Anything else (strings, arrays, objects) is passed as a **pointer + length** into linear memory:

```js
// JS side
const ptr = wasm.exports.alloc(text.length);
new Uint8Array(wasm.exports.memory.buffer, ptr, text.length).set(encoder.encode(text));
const result = wasm.exports.process(ptr, text.length);
```

**Cost model:**

- Numeric call: ~100ns. Cheap.
- String/object call: depends on size — copying 1MB bytes is milliseconds.
- **Best practice:** Do the loop **inside Wasm**, return only one result. Don't ping-pong per iteration.

Newer toolchains (`wasm-bindgen`, JCO) hide this boilerplate, but the cost model is the same.

**Vietnamese:** Wasm có một mảng byte (linear memory) JS đọc/ghi được. Function chỉ pass số. String/array pass bằng pointer + length, host tự đọc. Cost: số rẻ, string copy. Best practice: loop bên trong Wasm, không ping-pong từng iteration.

---

## 🟡 B4. Explain WASI and the Component Model.

**💡 Interview Signal:**

- ✅ **Strong:** Distinguishes WASI (POSIX-like API) from Component Model (typed interop), mentions capability-based security, gives WIT example, mentions polyglot composition.
- ❌ **Weak:** "WASI lets Wasm read files."

**Answer (EN):**
**WASI (WebAssembly System Interface)** is a standardized API set for Wasm modules to access OS-like capabilities: filesystem, sockets, env vars, clocks, random, etc. Unlike POSIX, WASI is **capability-based**: a module can only access resources the host explicitly grants. There's no `open("/etc/passwd")` succeeding by ambient authority — the host must hand over a directory handle.

**Component Model** layers on top of WASI to enable **typed interop between modules in different languages**. Interfaces are declared in WIT (WebAssembly Interface Types), an IDL:

```wit
interface api {
  greet: func(name: string) -> string
  record user { id: u64, name: string }
}
```

A Rust component implementing this interface can be called by a JS, Go, or Python host without manual JSON serialization. The Component Model handles type marshaling.

**Why this matters in 2025–2026:**

- **Polyglot composition:** Use Rust for crypto, Go for biz logic, JS for glue — in one app.
- **Stable ABI:** Modules from different toolchain versions interop.
- **Capability declaration:** WIT lists what a component imports — easy security audit.
- **Plugin ecosystems:** Shopify, Figma, Cosmonic build plugin platforms on this.

**Vietnamese:** WASI = POSIX cho Wasm, capability-based (host phải cấp quyền). Component Model = TypeScript types cho Wasm, declare bằng WIT. Mở khóa polyglot (Rust + Go + JS một app), stable ABI, audit security dễ. Dùng để xây plugin platform (Shopify Functions).

---

## 🟡 B5. How would you debug a slow WebAssembly module in production?

**💡 Interview Signal:**

- ✅ **Strong:** Lists profiling tools per environment, mentions common bottlenecks (boundary calls, GC pressure, missing SIMD, thread contention), mentions DWARF debug info.
- ❌ **Weak:** "Use console.log."

**Answer (EN):**
**Step 1: Establish baseline.** Time the entire operation in JS-only and Wasm versions on representative inputs. Confirm Wasm is actually slow (sometimes the perf bug is JS preprocessing).

**Step 2: Profile with the right tool:**

- **Browser:** Chrome DevTools Performance tab — Wasm functions show with DWARF symbols (Rust/C++) or as offsets. Look for hot frames.
- **Server (Wasmtime):** `--profile=jitdump` flag, then `perf` on Linux. Wasmer has built-in tracing.
- **Cloudflare Workers:** Built-in profiler shows CPU time per request.

**Step 3: Common bottlenecks:**

| Symptom                              | Likely cause                           | Fix                                                               |
| ------------------------------------ | -------------------------------------- | ----------------------------------------------------------------- |
| High CPU per call but JIT looks idle | Many JS↔Wasm boundary crossings        | Batch operations, do loop inside Wasm                             |
| Memory grows unbounded               | Wasm `malloc` not freed                | Audit allocations, manual free, use arenas                        |
| Blocking main thread                 | Running on UI thread instead of Worker | Move to Web Worker, postMessage transfers                         |
| 4x slower than expected              | SIMD not enabled at compile            | `-C target-feature=+simd128` (Rust), `--enable-simd` (emscripten) |
| Threads not parallelizing            | Missing COOP/COEP headers              | Set COOP same-origin, COEP require-corp                           |
| Cold start spike                     | Large module, no streaming compile     | Use `instantiateStreaming`, split into smaller modules            |

**Step 4: Lower-level checks:**

- Disassemble with `wasm2wat` or wasm-objdump to see actual ops.
- Check if compiler optimized as expected (e.g., loop unrolling, SIMD vectorization).
- Use sample profiling rather than instrumented profiling for hot loops.

**Vietnamese:** B1 baseline so JS vs Wasm. B2 profile: Chrome DevTools (browser), Wasmtime --profile (server), Workers profiler. B3 6 nguyên nhân thường gặp: nhiều boundary call, memory leak, chạy main thread, SIMD chưa bật, COOP/COEP thiếu, no streaming compile. B4 wasm2wat để disasm.

---

## 🟡 B6. Compare Wasm vs Docker for serverless workloads.

**💡 Interview Signal:**

- ✅ **Strong:** Concrete numbers (cold start, image size, density), trade-offs (ecosystem, async I/O), use case fit.
- ❌ **Weak:** "Wasm is smaller."

**Answer (EN):**

**Quantitative comparison:**

| Dimension              | Docker container              | Wasm module                             |
| ---------------------- | ----------------------------- | --------------------------------------- |
| Cold start             | 100ms – 5s                    | 50µs – 5ms                              |
| Image size             | 50 MB – 1 GB                  | 50 KB – 5 MB                            |
| Memory baseline        | ~100 MB                       | a few MB                                |
| Density per host       | 100s                          | 10,000s                                 |
| Security model         | Linux namespaces + seccomp    | Capability-based, sandboxed memory      |
| Portability            | per-arch build (x86_64/arm64) | one binary runs everywhere              |
| Async I/O ecosystem    | mature (Linux syscalls)       | maturing (WASI 0.2 + wasi-io proposals) |
| Native library support | yes (.so, .dll)               | no (must compile to Wasm)               |
| Tooling maturity       | very mature                   | maturing rapidly                        |
| Stateful services      | excellent                     | poor (use containers)                   |

**When to choose Wasm for serverless:**

- High request volume, low CPU per request → density matters.
- Cold start is on critical path (edge, FaaS).
- Untrusted code execution (plugins, user-defined functions).
- Polyglot needs (multiple languages in one runtime).

**When to keep Docker:**

- Long-running stateful services.
- Heavy reliance on native libs (databases, ML frameworks, GPU).
- Existing operational tooling (K8s, monitoring) tuned for containers.
- Async I/O heavy (network proxies, queues) — until WASI matures.

**Hybrid pattern (2025):** Docker for stateful services + Wasm for stateless edge/plugin code. Cloudflare's stack is exactly this.

**Vietnamese:** Wasm: cold start µs, image KB, density 10K/host, sandbox capability. Docker: cold start ms-s, image MB-GB, density 100/host, namespace+seccomp. Wasm thắng cho high-volume low-CPU/req, edge, plugin. Docker thắng cho stateful, native lib, async I/O nặng. Hybrid: container cho service, Wasm cho edge + plugin.

---

## 🟡 B7. Walk me through compiling a Rust function to Wasm and calling it from JavaScript.

**💡 Interview Signal:**

- ✅ **Strong:** Shows full pipeline (cargo project → wasm-pack/wasm-bindgen → JS import), explains what wasm-bindgen does, notes bundler integration.
- ❌ **Weak:** Vague hand-waving.

**Answer (EN):**

**1. Rust crate with `wasm-bindgen`:**

```rust
// src/lib.rs
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u64 {
    let (mut a, mut b) = (0u64, 1u64);
    for _ in 0..n {
        let t = a + b; a = b; b = t;
    }
    a
}
```

```toml
# Cargo.toml
[lib]
crate-type = ["cdylib"]
[dependencies]
wasm-bindgen = "0.2"
```

**2. Build:**

```bash
wasm-pack build --target web
# outputs: pkg/my_crate.js + pkg/my_crate_bg.wasm
```

`wasm-pack` does three things:

- Calls `cargo build --target wasm32-unknown-unknown --release`.
- Runs `wasm-bindgen` post-processor to generate JS glue (handles strings, arrays, optionals).
- Optimizes with `wasm-opt`.

**3. Import in JS:**

```js
import init, { fibonacci } from "./pkg/my_crate.js";
await init(); // loads the .wasm
console.log(fibonacci(50)); // 12586269025n
```

**4. Bundler integration:**

- Vite: works out of box with `vite-plugin-wasm` for top-level await.
- Webpack 5: native Wasm support, set `experiments.asyncWebAssembly: true`.
- Next.js: enable `experimental.asyncWebAssembly`.

**What `wasm-bindgen` provides:**

- Auto JS↔Rust string conversion (UTF-8 bytes through linear memory).
- Closure passing both directions.
- Optional async/await support via `wasm-bindgen-futures`.
- TypeScript declarations generated automatically.

**Vietnamese:** Cargo lib + wasm-bindgen → `wasm-pack build --target web` → import `init()` + function trong JS. wasm-bindgen tự sinh glue JS để pass string/array/closure. Vite/Webpack/Next đều support. TypeScript types sinh tự động.

---

## 🔴 B8. Design a plugin system where customers can write code that runs safely on your edge servers, with sub-10ms cold start. (Bloom L5 — Synthesis)

**💡 Interview Signal:**

- ✅ **Strong:** Picks Wasm + Component Model + WASI explicitly, defines capability allowlist, fuel/CPU limits, distribution model, observability, versioning.
- ❌ **Weak:** "Run user code in a Docker container."

**Answer (EN):**

**Architecture:**

```
┌────────── Customer Developer Workstation ──────────┐
│   Rust / JS / AssemblyScript source                │
│   ↓ compile (cargo-component / jco)                │
│   plugin.wasm (Component Model, with WIT)          │
│   ↓ upload via CLI                                 │
└─────────────────────────┬──────────────────────────┘
                          ↓
┌──────────── Plugin Registry (S3/R2) ───────────────┐
│   versioned by semver: org/plugin@1.2.3            │
│   manifest.json: WIT interface, capabilities       │
└─────────────────────────┬──────────────────────────┘
                          ↓ pulled per region
┌──────────── Edge Worker (Cloudflare-style) ────────┐
│   Per-request:                                     │
│   1. Read tenant + plugin version from request     │
│   2. Load .wasm from edge cache (or fetch)         │
│   3. Instantiate with capability-restricted host:  │
│       - HTTP: only allowlisted domains             │
│       - KV: namespace scoped to tenant             │
│       - No filesystem, no spawn                    │
│   4. Set fuel limit (e.g., 1M units = ~5ms CPU)    │
│   5. Set memory cap (e.g., 32 MB)                  │
│   6. Invoke entry function with request data       │
│   7. Catch traps → return 500 to caller            │
└────────────────────────────────────────────────────┘
```

**Key design choices:**

1. **Component Model + WIT for interface:**

   ```wit
   interface plugin {
     handle-request: func(req: request) -> response
     record request { method: string, path: string, headers: list<header>, body: list<u8> }
   }
   ```

   - Customer writes against this interface.
   - Platform validates module exports match WIT before accepting upload.

2. **Capability-based host imports:**

   ```wit
   interface host-api {
     fetch: func(url: string) -> result<response, error>      // restricted to allowlist
     kv-get: func(key: string) -> option<list<u8>>            // scoped to tenant
     log: func(level: log-level, msg: string)                 // forwarded to log pipeline
   }
   ```

   - Default: no capabilities. Customer requests in manifest; platform reviews/auto-approves common ones.

3. **Resource limits per execution:**
   - Fuel limit (Wasmtime concept): bounded CPU instructions.
   - Memory cap: linear memory `memory.grow` bounded.
   - Wall clock timeout: 10ms hard kill.

4. **Cold start strategy:**
   - **Pre-compile** (.cwasm via Wasmtime cache) on upload, store both .wasm and .cwasm in registry.
   - **Edge cache** popular plugins in memory after first hit.
   - **Component instances** are cheap (~µs); reuse compiled module across requests, fresh instance per request for isolation.
   - Result: <5ms p99 cold start; <1ms warm.

5. **Distribution & versioning:**
   - Semver, with explicit tenant pinning (`@1.2.3` or `@^1`).
   - Canary rollout per tenant: 5% → 25% → 100%.
   - Rollback by changing version pin.

6. **Observability:**
   - Per-execution: customer-tag, plugin version, region, latency, fuel consumed, memory peak, exit reason (ok / trap / timeout / oom).
   - Log forwarding via host import (`log` capability).
   - Distributed tracing: parent span ID passed in request, plugin can call host `span.start/end`.

7. **Security audits:**
   - Static analysis on upload (no banned imports, no infinite loops detectable, no excessive memory growth in linear memory test).
   - Dynamic: fuzzing harness with malformed inputs.
   - Capabilities listed in marketplace before tenants install.

**Why Wasm wins this design:**

- Sub-ms cold start (containers can't).
- Capability-based prevents privilege escalation (containers need namespace tricks).
- Polyglot — customers write in Rust/JS/Go/AssemblyScript.
- KB-sized — distribution bandwidth manageable for 1000s of plugins.

**Reference:** This is essentially Shopify Functions architecture.

**Vietnamese:** Wasm + Component Model + WIT cho interface, capability-based host imports (fetch allowlist, KV scoped tenant), fuel limit + memory cap + 10ms timeout. Pre-compile lúc upload, cache plugin ở edge, fresh instance mỗi request (isolation). Semver, canary rollout, per-execution observability (latency + fuel + exit reason). Static/dynamic security audit. Đây là design giống Shopify Functions.

---

## 🔴 B9. A team wants to migrate their image processing pipeline (currently Node.js with Sharp) to Wasm for 4x throughput. Walk through how you evaluate whether this will succeed. (Bloom L4-L5 — Analysis)

**💡 Interview Signal:**

- ✅ **Strong:** Skeptical, asks where time is actually spent, runs benchmarks, considers SIMD, threading, marshaling overhead, ecosystem maturity, total cost (dev time + ops).
- ❌ **Weak:** "Yes, Wasm is faster, do it."

**Answer (EN):**

**Step 1 — Measure baseline (don't trust intuition).**

- Profile current pipeline: where does time go? Often Sharp itself is already C++ via libvips. The "Node.js overhead" might be 5%, not 80%.
- Benchmark a representative workload: 1000 images of varied sizes, common ops (resize, format convert, watermark).
- Capture: p50/p95/p99 latency, throughput (img/s), CPU usage, memory peak.

**Step 2 — Identify the bottleneck.**

| Bottleneck                                                 | Will Wasm help?                                |
| ---------------------------------------------------------- | ---------------------------------------------- |
| CPU-bound algorithm (resize math)                          | Yes, marginally — Sharp is already native      |
| I/O (reading from S3)                                      | No — Wasm doesn't speed I/O                    |
| Marshaling between JS and native (Sharp's Buffer overhead) | Maybe — depends on per-call vs streaming       |
| Single-threaded event loop saturation                      | Yes — Wasm with Worker threads can parallelize |
| GC pauses on large buffers                                 | Yes — Wasm has no GC, manual memory            |

**Step 3 — Prototype with realistic conditions.**

- Pick a Wasm image library (e.g., `image-rs` compiled to Wasm, `wasmedge-image`).
- Run identical benchmark.
- Measure: pure compute speedup, end-to-end speedup (inc. I/O), memory usage.

**Step 4 — Account for hidden costs.**

| Cost           | Question to answer                                             |
| -------------- | -------------------------------------------------------------- |
| Dev time       | Does team know Rust? Cost of learning curve.                   |
| Toolchain      | Build pipeline, deploy artifact size, observability.           |
| Library gaps   | Does Wasm port support all formats? (HEIF, AVIF, animated GIF) |
| Debugging      | Source maps for production crashes?                            |
| Ops complexity | New runtime to monitor, new failure modes.                     |

**Step 5 — Decision rubric:**

| Result                                      | Recommendation                                   |
| ------------------------------------------- | ------------------------------------------------ |
| Compute is <30% of total time               | Skip Wasm; optimize I/O or batching first        |
| Compute 30-70%, native lib has gaps         | Skip Wasm; tune Sharp / use libvips directly     |
| Compute >70%, single-threaded saturation    | Try Wasm + Worker pool; expect 2-3x not 4x       |
| Need polyglot reuse (mobile + web + server) | Wasm wins on portability even if perf is similar |

**Hidden gotchas to flag:**

- Sharp uses libvips which is heavily SIMD-optimized in C++. Equivalent Rust Wasm must enable SIMD (`-C target-feature=+simd128`) to compete.
- Wasm threads (SharedArrayBuffer) require COOP/COEP if running in browser; on server it's fine.
- Memory allocation in Wasm is manual; without arenas, heavy allocs can be slower than V8's GC.

**Conclusion:** "Don't migrate based on hype. Measure where time is spent. Wasm helps for CPU-bound, parallelizable, polyglot workloads — image processing fits some of these but not all. Realistic gain: 2-3x, not 4x. Cost: 2-3 months of senior Rust dev time. Go/no-go depends on whether perf gain unlocks meaningful business value (more throughput = lower infra cost = breakeven in N months)."

**Vietnamese:** Đo trước khi tin. Profile xem thời gian đi đâu (CPU? I/O? marshaling? GC?). Sharp đã là C++ rồi — Wasm có thể chỉ nhanh 2-3x chứ không 4x. Prototype với SIMD bật, Worker thread parallelize. Tính cost: dev time Rust, library gap (HEIF, AVIF), debug, ops. Quyết định: nếu compute >70% và single-thread bị bão hòa → thử Wasm. Nếu compute <30% → tối ưu I/O trước.

---

## 🔴 B10. Design the architecture for an AI inference service that runs LLM models (1-3B params) on edge devices via WebAssembly. (Bloom L6 — Creation)

**💡 Interview Signal:**

- ✅ **Strong:** Picks WasmEdge or wasi-nn, addresses model loading strategy, quantization, GPU/CPU fallback, memory constraints, model versioning, telemetry.
- ❌ **Weak:** "Just run the model in Wasm."

**Answer (EN):**

**Goal:** Run quantized small LLMs (1-3B params, e.g., Phi-3.5, Llama-3.2-1B, Qwen2-1.5B) on edge devices (smart cameras, kiosks, in-vehicle systems, low-end laptops) using Wasm runtime, with sub-200ms first token, sub-50ms subsequent tokens, runs offline.

**Architecture:**

```
┌────────────── Model Distribution Plane ──────────────┐
│   - Model registry (S3/CDN)                          │
│   - Quantized GGUF / ONNX models                     │
│   - Per-arch optimized: CPU / GPU / NPU              │
│   - Signed manifests, integrity hashes               │
└────────────────────┬─────────────────────────────────┘
                     │ pull on first run / update
                     ↓
┌────────── Edge Device (e.g., Raspberry Pi 5, ARM) ───┐
│                                                      │
│  ┌────────── WasmEdge Runtime ──────────────────┐    │
│  │                                              │   │
│  │  ┌──── Wasm App (Rust) ────┐                 │   │
│  │  │  - Tokenizer             │                │   │
│  │  │  - Inference driver      │                │   │
│  │  │  - Stream callbacks      │                │   │
│  │  └──────────┬───────────────┘                │   │
│  │             │ wasi-nn imports                │   │
│  │             ↓                                │   │
│  │  ┌──── Host Backends ──────┐                 │   │
│  │  │  - llama.cpp (CPU)      │                 │   │
│  │  │  - ggml-cuda (NVIDIA)   │                 │   │
│  │  │  - ggml-metal (Mac)     │                 │   │
│  │  │  - ggml-vulkan (others) │                 │   │
│  │  └─────────────────────────┘                 │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  Local KV cache (Postgres / SQLite) for context     │
│  Telemetry batched, sent when online                │
└──────────────────────────────────────────────────────┘
```

**Why Wasm + WasmEdge here:**

1. **Portability:** Same Wasm binary runs on ARM Linux (Pi), x86 Windows (kiosk), macOS (dev). Hardware backend chosen at runtime via wasi-nn.
2. **Sandboxing:** App can't escape and read other device data.
3. **Update model:** Atomic — pull new .wasm + new .gguf, swap, restart instance. Rollback by version pin.
4. **Footprint:** Wasm runtime is ~10MB; container would be 500MB+.

**Key design decisions:**

1. **Model format: GGUF with int4/int8 quantization.**
   - Llama-3.2-1B int4 ≈ 800MB (fits in 1GB RAM device).
   - Phi-3.5 int4 ≈ 2.3GB (needs 4GB RAM device).
   - Pre-shipped per device class.

2. **Inference backend selection:**
   - Boot: detect hardware (CPU SIMD, GPU compute, NPU presence).
   - Pick best wasi-nn backend (Vulkan > Metal > CUDA > AVX2 CPU > scalar).
   - Fallback chain on failure.

3. **Tokenizer in Wasm (Rust):**
   - Don't depend on host tokenizer; ship in module (~5MB).
   - Same tokenizer across devices = deterministic results.

4. **Streaming generation:**
   - Wasm app exports a callback host can poll for next token.
   - Client app shows tokens as they arrive (<50ms each).

5. **Memory management:**
   - KV cache for active conversation (~100MB for 4K context).
   - LRU eviction between sessions.
   - Model weights mmap'd if filesystem supports (Linux: yes; Windows: limited).

6. **Updates:**
   - Background download new model + Wasm to staging.
   - Health check inference on staged version.
   - Atomic swap on next boot.

7. **Telemetry (privacy-preserving):**
   - Local: per-inference latency, token count, hardware backend used.
   - Aggregated metrics batched + uploaded weekly.
   - Never the input text or generation (privacy).

8. **Failure modes & fallback:**
   - Inference too slow on detected hardware → smaller model variant.
   - Model load OOM → fallback to even smaller model.
   - All local options fail → fallback to cloud API (if online).

**What's hard:**

- **Wasm ↔ host data marshaling** for large tensors. Use shared memory regions, not per-call copy.
- **Fine-tuning observability** — distributed tracing across devices needs careful ID propagation.
- **Model updates over flaky networks** — resumable downloads, integrity checks.

**Why this is realistic in 2026:** WasmEdge already supports llama.cpp via wasi-nn (production at LF AI & Data, Cosmonic). Mozilla's `llamafile` proves single-file Wasm-based LLM distribution works. Apple's on-device LLMs and Microsoft's Phi family validate 1-3B param edge inference.

**Vietnamese:** WasmEdge + wasi-nn + llama.cpp/ggml backend. Model GGUF int4 (Llama-3.2-1B 800MB). Detect hardware lúc boot → pick backend (Vulkan/Metal/CUDA/CPU). Tokenizer ship trong Wasm. Streaming token qua callback. KV cache LRU. Update model atomic (download staging → health check → swap). Telemetry local-aggregated, không gửi nội dung. Fallback chain: smaller model → cloud API. Hard: marshal tensor lớn (shared memory), tracing đa thiết bị, model update mạng yếu.

---

# Part C — Study Cases & Self-Assessment

## 📊 C1. Overview / Tổng Quan

This file covered WebAssembly across both frontend (browser coprocessor for crypto, codecs, AI inference) and backend/edge (lightweight sandboxed compute units replacing containers for stateless workloads, plugin sandboxes). Key concepts: **linear memory + capability-based security + Component Model**. Real applications: Figma (rendering), 1Password (crypto), Shopify Functions (plugins), Cloudflare Workers (edge), WasmEdge (AI inference).

**Vietnamese:** File này dạy Wasm hai mặt: FE (coprocessor compute-heavy) và BE/edge (compute unit sandbox thay container nhẹ). Trụ cột: linear memory, capability security, Component Model. Ứng dụng: Figma render, 1Password crypto, Shopify Functions plugin, Cloudflare edge, WasmEdge AI inference.

---

## 📋 C2. Interview Q&A Summary Table

| #   | Question                   | Difficulty | Core Concept | Key Signal                                          |
| --- | -------------------------- | ---------- | ------------ | --------------------------------------------------- |
| B1  | What is Wasm?              | 🟢         | Fundamentals | Portable + sandboxed + polyglot + browser+server    |
| B2  | When NOT to use Wasm       | 🟢         | Trade-offs   | Lists DOM, trivial logic, stateful, native lib gaps |
| B3  | JS↔Wasm boundary           | 🟢         | Interop      | Linear memory, numeric-only, copy cost              |
| B4  | WASI + Component Model     | 🟡         | Standards    | Capability security + WIT typed interop             |
| B5  | Debug slow Wasm            | 🟡         | Operations   | Profile per env, common bottleneck table            |
| B6  | Wasm vs Docker             | 🟡         | Architecture | Quantitative table + when to choose each            |
| B7  | Rust→Wasm pipeline         | 🟡         | Toolchain    | wasm-pack + wasm-bindgen + bundler                  |
| B8  | Plugin system architecture | 🔴         | Synthesis    | Component Model + capabilities + fuel + canary      |
| B9  | Migrate image pipeline     | 🔴         | Analysis     | Measure first, hidden costs, decision rubric        |
| B10 | Edge LLM inference         | 🔴         | Creation     | WasmEdge + wasi-nn + GGUF + backend fallback        |

---

## ⚡ C3. Cold Call Simulation

**Interviewer:** "In 30 seconds: when does WebAssembly belong in a modern stack, and when should I avoid it?"

**You:**

> "Wasm belongs when you need **CPU-bound compute** (crypto, codecs, image/video, AI inference, game engines) **or** sandboxed compute units **or** polyglot code reuse across browser/server/mobile. On the server, it shines for stateless edge functions and plugin systems where you need µs cold start, KB image, and capability-based isolation — places containers are too heavy. Avoid Wasm for DOM manipulation, simple business logic, stateful long-running services, and anywhere you depend on native libraries that don't compile to Wasm. The 2026 sweet spot is hybrid: Docker for stateful services, Wasm for stateless edge + plugins."

**Follow-up:** _"Why is cold start so much faster than containers?"_

> "Containers start a Linux user-space process — kernel namespaces, cgroups, image extraction, runtime init — that's tens to hundreds of milliseconds minimum. A Wasm module is just bytecode; the runtime parses+JIT-compiles it (cached after first time) and creates a new instance. Pre-compilation (.cwasm) makes instantiation a memory copy of the module + fresh linear memory allocation — measured in microseconds."

---

## 📝 C4. Self-Check Retrieval (Close the doc)

After 24 hours, close this file and answer:

1. **🧠 Retrieval:** What does the Component Model add on top of plain Wasm modules?
2. **👁️ Visual:** Sketch JS↔Wasm boundary including linear memory and how a string is passed.
3. **🔧 Application:** A teammate proposes rewriting your Express middleware in Rust→Wasm for "performance." How do you evaluate?
4. **🐛 Debug:** Your Wasm crypto module is 10x slower in production than dev. What 4 things do you check first?
5. **🎓 Teach:** Explain to a security-focused engineer why Wasm is more sandboxed than a Linux process.

> **Self-grading:** 5/5 ready. 3-4/5 re-read A4 + A6. <3/5 redo file.

**Hints (Vietnamese):**

1. Component Model = typed interop (WIT) giữa modules ngôn ngữ khác nhau, polyglot composition, stable ABI.
2. Hai box: JS process + Wasm instance. Mảng linear memory ở giữa. String: encoder.encode → set vào memory tại pointer → call function với (ptr, len) → Wasm đọc bytes ra.
3. Đo trước khi tin. Express middleware thường I/O-bound chứ không CPU-bound → Wasm không giúp. Ngoài ra cost dev time + ops.
4. Production có SIMD bật không? Đang chạy main thread không? COOP/COEP cho threads? wasm-opt đã chạy chưa? Memory grow có bị gọi liên tục không?
5. Wasm: capability-based (host phải cấp quyền), không có ambient authority, no syscall, linear memory cô lập. Linux process: ambient (UID có quyền gì làm được), syscall escape qua kernel bug.

---

## 💬 C5. Feynman Prompt

> "Explain to a frontend engineer who knows JS but never heard of Wasm: what Wasm is, why their company might want it, and the one mistake juniors always make. 3 minutes, no jargon."

**Vietnamese:** "Giải thích cho FE engineer biết JS nhưng chưa nghe về Wasm: Wasm là gì, công ty bạn có thể cần nó để làm gì, và cái sai junior luôn mắc. 3 phút, không jargon."

---

## 🔁 C6. Spaced Repetition Schedule

| Day           | Action                                                             | Time    |
| ------------- | ------------------------------------------------------------------ | ------- |
| **Day 1**     | Read all sections, run "hello world" Rust→Wasm                     | 90 min  |
| **Day 3**     | Re-do Self-Check, redo failed answers                              | 30 min  |
| **Day 7**     | Build a working demo: Rust image filter → Wasm → run in Web Worker | 4 hours |
| **Day 14**    | Mock interview B8 + B9 + B10                                       | 1 hour  |
| **Day 30**    | Re-read Common Mistakes, scan latest WASI/Component Model news     | 30 min  |
| **Quarterly** | Re-skim, update with new tooling (Spin, WasmEdge releases)         | 30 min  |

---

## 🔗 C7. Connections

**Same track / related (shared, FE, BE):**

- [Browser Performance](../fe-track/06-browser-performance/01-rendering-pipeline.md)
- [Web Security](../fe-track/07-web-security/01-web-security-overview.md) (sandboxing concepts)
- [OS & Processes](../be-track/02-backend-knowledge/05-os-go.md)
- [System Design — Microservices](../be-track/02-backend-knowledge/02-microservices.md)

**Cross-track:**

- [04 — Edge Computing & Serverless 2026](./04-edge-computing-serverless-2026.md) (V8 isolates vs Wasm runtimes)
- [05 — Modern JS Runtimes](./05-modern-js-runtimes.md) (Node Wasm support, Bun Wasm)
- [08 — Rust for Backend Engineers](./08-rust-for-backend-engineers.md) (Rust → Wasm is the production path)
- [09 — AI Agent Evaluation & Production](./09-ai-agent-evaluation-production.md) (WasmEdge for on-device inference)

---

> **Final thought:** WebAssembly in 2026 is not a niche — it is the **portable, sandboxed compute unit** of the next decade. The browser bet (2017) became table stakes. The server bet (2024 Component Model + WASI 0.2) is unfolding now. Engineers who understand both mouths of the river — FE compute and BE/edge sandboxing — will architect the systems other people maintain.

> **Vietnamese:** Wasm 2026 không còn là "thủ thuật game trong browser." Nó là **đơn vị compute portable, sandbox** của thập kỷ tới. Bet browser (2017) đã thành chuẩn. Bet server (2024 Component Model + WASI 0.2) đang nở rộ. Engineer hiểu cả hai mặt — FE compute và BE/edge sandbox — sẽ là người thiết kế hệ thống cho người khác bảo trì.
