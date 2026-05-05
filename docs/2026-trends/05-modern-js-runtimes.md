> **Track**: FE + BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> [← Back to Table of Contents](../00-table-of-contents.md)

# Modern JavaScript Runtimes 2026: Bun, Deno, Node 22+

> _"Node không chết, nhưng monopoly đã hết. 2026 bạn phải biết chọn runtime cho từng workload."_

---

## 🌍 Real-World Scenario — Vercel `pkg-pr-new` Build Time Crisis 2024

**Context:** Đầu 2024, Vercel internal tooling team có CI build time tăng từ 4 phút → 11 phút trong 6 tháng. 80% time là `npm install` (3000+ packages, monorepo 40 apps). Mỗi PR mở = $$$ CI cost.

**Investigation:** Bottleneck là disk I/O (npm hardlink) và sequential dependency resolution. Migration thử nghiệm:

| Runtime     | Install time | Cold start | Test suite |
| ----------- | ------------ | ---------- | ---------- |
| Node + npm  | 145s         | 280ms      | 42s        |
| Node + pnpm | 38s          | 280ms      | 42s        |
| **Bun**     | **3.2s**     | **35ms**   | **8s**     |
| Deno (npm:) | 12s          | 90ms       | 18s        |

**Decision (Q3 2024):** Migrate CI và dev script sang Bun. Production Node 22 (chưa migrate vì observability tooling chưa parity). Test suite migrated to `bun test`.

**Kết quả 6 tháng:** CI time 11min → 3min. Local dev `npm run dev` từ 8s → 1.2s. DX score (internal survey) tăng 40%. Nhưng: 3 production incidents do Bun có incompatibility với native modules — phải maintain 2 lockfile (`bun.lockb` cho dev/CI, `package-lock.json` cho prod).

**Bài học:** **Runtime decision không còn binary "dùng Node hay không".** 2026 senior phải biết: dev/CI có thể dùng runtime fast (Bun), prod có thể vẫn Node 22 hoặc Deno tùy compatibility. Interview sẽ hỏi "khi nào chọn cái nào, vì sao".

---

## A. Theory & Core Concepts

### 🧠 Memory Hook

> **"BDN: Bun = Build/Dev/Native fast. Deno = Decentralized/Secure/Web-standard. Node = Default/Battle-tested/Native-modules."**
> 3 runtime, 3 triết lý khác nhau. Đừng so sánh như cùng một thứ.

### Why Multiple Runtimes Exist?

**Level 1 — Pain points của Node:**

- Cold start chậm (200ms+ trong serverless)
- Tooling phân tán: npm/yarn/pnpm + jest/vitest + tsc/esbuild + nodemon → 5 binaries
- Module system rối (CJS vs ESM)
- Security model open by default (mọi script đọc fs/network được)
- TypeScript second-class (cần ts-node hoặc transpile)

**Level 2 — Triết lý mới:**

- **Bun (Jarred Sumner, 2022):** "Tooling hợp nhất + nhanh điên cuồng." Runtime + bundler + transpiler + test + package manager trong 1 binary, viết bằng Zig.
- **Deno (Ryan Dahl, 2018):** "Sửa lại Node với 10 năm hindsight." Secure-by-default, web-standard APIs, TypeScript native, no node_modules.
- **Node 22+ (2024-2026):** "Đừng để bị bỏ lại." Built-in test runner, watch mode, fetch API, native TypeScript stripping (Node 23+), permission model (experimental).

**Level 3 — Market reality:**

- Node vẫn 90%+ production share
- Bun: 50K+ GitHub stars, sản phẩm thật dùng (Vercel internal tools, Cal.com migration)
- Deno: enterprise traction qua Deno Deploy + Fresh framework
- **2026 prediction:** Polyglot runtime usage sẽ thành norm cho team mature

---

### Concept 1: Bun — "Tooling Singularity"

**Layer 1 — Analogy:**

> Hãy tưởng tượng nhà bếp. Trước đây bạn cần: dao (npm), thớt (jest), bếp (node), lò (esbuild), nồi (tsc), máy xay (nodemon). Bun = dao đa năng Thụy Sĩ — 1 cái thay tất cả, lại còn nhanh hơn.

**Layer 2 — Architecture:**

```
┌─────────────────────────────────────────────────────┐
│ Bun Binary (1 file, ~80MB, viết bằng Zig)           │
├─────────────────────────────────────────────────────┤
│ JavaScriptCore (WebKit engine) — KHÔNG phải V8     │
├─────────────────────────────────────────────────────┤
│ • Runtime (Node API compat ~90%)                    │
│ • Bundler (esbuild-like, 10-100x faster)            │
│ • Transpiler (TS, JSX native)                       │
│ • Test runner (jest-compatible)                     │
│ • Package manager (npm-compatible, 30x faster)      │
│ • SQLite native (bun:sqlite)                        │
│ • HTTP server (Bun.serve, ~3x faster Node)          │
│ • S3 client native, hash, password hashing          │
└─────────────────────────────────────────────────────┘
```

**Why so fast?**

1. **Zig + JavaScriptCore:** JSC start nhanh hơn V8 cho cold start; Zig syscall overhead thấp
2. **Native everything:** không lazy-load qua JS, mà gọi C ABI trực tiếp
3. **Concurrent install:** dependency resolve song song với download
4. **Binary lockfile (`bun.lockb`):** parse 100x nhanh hơn JSON

**Khi nào dùng Bun (2026):**

- ✅ Local dev (hot reload nhanh, npm install nhanh)
- ✅ CI/CD (cut build time)
- ✅ Test runner (`bun test`)
- ✅ One-off scripts, tools, CLIs
- ✅ Edge-like serverless (Bun + Hono)
- ⚠️ Production server: ổn định tăng 2025+, nhưng kiểm tra native deps trước
- ❌ App phụ thuộc Node-specific internals (vm2, một số ORM cũ)

**Layer 3 — Edge cases:**

- `bun:sqlite` API khác `better-sqlite3` → migration code cần
- `Bun.spawn` khác `child_process` API
- Worker threads parity chưa đầy đủ
- Một số native module (sharp) cần build lại với Bun

### Concept 2: Deno — "Web-Standard, Secure-by-Default"

**Layer 1 — Analogy:**

> Node giống một căn nhà chưa khóa cửa — bạn vào là làm gì cũng được. Deno giống căn nhà thông minh — mỗi cửa cần permission riêng (đọc file? cần `--allow-read`. Network? cần `--allow-net`).

**Layer 2 — Key differences:**

```
                    ┌─────────────────────────┐
                    │ Permission Model        │
                    │ deno run --allow-net    │
                    │           --allow-read=./data │
                    │           --allow-env=API_KEY │
                    │           script.ts     │
                    └─────────────────────────┘

Module resolution:
  Node:  import x from 'lodash'  → node_modules/lodash
  Deno:  import x from 'jsr:@std/path'    (JSR registry)
         import x from 'npm:lodash'        (npm interop)
         import x from 'https://deno.land/std/...'  (URL)

Built-in:
  Node:  fetch (since 18), test runner (since 18), watch (since 22)
  Deno:  fetch, test, fmt, lint, bundle, compile, doc, bench, kv, queue
```

**Deno KV (key-value store built-in):**

```typescript
const kv = await Deno.openKv();
await kv.set(["users", "alice"], { age: 30 });
const result = await kv.get(["users", "alice"]);
// Globally distributed when deployed to Deno Deploy
```

**Khi nào dùng Deno:**

- ✅ Edge functions (Deno Deploy, multi-region with KV)
- ✅ TypeScript-first project (no transpile config)
- ✅ Security-sensitive (sandbox với permissions)
- ✅ Quick scripts (single file with URL imports)
- ✅ Web standard APIs (Web Crypto, Web Streams native)
- ⚠️ Large npm dep tree (npm: prefix works but slower than Bun/Node)
- ❌ Tooling đã đầu tư heavy vào Node ecosystem

**Layer 3 — Edge cases:**

- Deno KV eventual consistency cross-region
- Deno Deploy CPU time limit per request
- `npm:` interop có overhead initial install
- JSR vs npm: chọn JSR nếu library hỗ trợ (better TS types, no transpile)

### Concept 3: Node 22+ — "Catching Up Fast"

**Layer 1 — Analogy:**

> iPhone Android cạnh tranh nhau. Node nhìn Bun/Deno → "ờ, ý hay đó" → copy về. Node 22 = Node học bài từ đối thủ.

**Layer 2 — What's new in Node 22-24 (2024-2026):**

| Feature                                          | Node version | Status                   |
| ------------------------------------------------ | ------------ | ------------------------ |
| `node --watch` (no nodemon)                      | 22           | Stable                   |
| `node --test` (built-in)                         | 22           | Stable                   |
| `node --env-file=.env`                           | 22           | Stable                   |
| Built-in `fetch`, `WebSocket`                    | 22           | Stable                   |
| Permission model `--permission`                  | 22           | Experimental             |
| Native TS stripping `--experimental-strip-types` | 22.6+        | Experimental             |
| Native TS transform                              | 23           | Experimental             |
| WASI 0.2 support                                 | 23           | Experimental             |
| Web Storage, glob                                | 22           | Stable                   |
| Stable `node:sqlite`                             | 22.5         | Experimental → Stable 24 |

**Permission model example:**

```bash
node --permission \
     --allow-fs-read=./data \
     --allow-net=api.example.com \
     --no-allow-fs-write \
     server.js
```

**Native TypeScript (Node 22.6+):**

```bash
node --experimental-strip-types app.ts
# No transpile, no tsx, no ts-node
# Note: only strips types, doesn't transform (no enums, decorators)
```

**Khi nào vẫn chọn Node:**

- ✅ Production hiện tại đã chạy Node (đừng migrate vô cớ)
- ✅ Cần native modules cũ (sharp, canvas, một số DB driver)
- ✅ Enterprise compliance (Node có 10+ năm SOC audit history)
- ✅ Long-tail tooling (Sentry, Datadog APM, etc. có Node integration sâu nhất)
- ❌ Greenfield CLI hoặc tooling (Bun nhanh hơn, simpler)
- ❌ Edge serverless (V8 isolate runtime ưu việt hơn)

**Layer 3 — Edge cases:**

- `--experimental-strip-types` không hỗ trợ enums, decorators, namespaces
- Permission model break một số npm packages dùng dynamic import
- Built-in test runner thiếu features (snapshot, mock) so với Vitest

### Concept 4: Decision Framework — Khi Nào Dùng Cái Nào?

**Layer 2 — Decision matrix:**

```
                ┌──────────────────────────────────┐
                │ What are you building?           │
                └──────────────┬───────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
   ┌────────┐            ┌──────────┐         ┌──────────────┐
   │ CLI/   │            │ Web      │         │ Production    │
   │ Script │            │ App      │         │ Service       │
   └───┬────┘            └────┬─────┘         └──────┬───────┘
       │                      │                       │
       ▼                      ▼                       ▼
   Bun (fast)           Need edge?              Native deps?
                          │                          │
                    ┌─────┴─────┐              ┌────┴────┐
                    │           │              │         │
                    ▼           ▼              ▼         ▼
              Cloudflare      Deno          Yes        No
              Workers        Deploy       (Node)    (Bun/Deno
              (edge runtime) or Vercel               OK if tested)
                            Edge
```

**Tooling matrix per workflow:**

| Workflow                    | Best 2026 choice          | Why                       |
| --------------------------- | ------------------------- | ------------------------- |
| Monorepo dev (Turbo/Nx)     | Bun + pnpm or just Bun    | Install + execute fast    |
| Test runner                 | Bun test or Vitest        | Both 10x faster than Jest |
| Bundler for libraries       | tsdown / tsup (esbuild)   | Fast, dual ESM/CJS        |
| Bundler for apps            | Vite / Rspack             | Bun bundler maturing      |
| TypeScript transpile        | tsc native (tsgo coming)  | Native = parity           |
| Linter                      | oxlint / Biome            | 50-100x faster ESLint     |
| Formatter                   | Biome / oxfmt / Prettier  | Speed vs ecosystem        |
| HTTP server (perf-critical) | Bun.serve or Hono on Node | Bun ~3x throughput        |
| Edge function               | Cloudflare Workers (V8)   | Best cold start           |
| Long-running service prod   | Node 22 LTS               | Maturity + observability  |

---

### ❌ Common Mistakes

| Sai lầm                                             | Tại sao sai                                                                    | Đúng là                                                   |
| --------------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------- |
| Migrate hết production Node → Bun trong 1 sprint    | Native module incompat, observability gap, ít engineer biết debug              | Migrate dev/CI trước, prod sau khi staging stable 3 tháng |
| Dùng Deno cho greenfield enterprise app vì "modern" | Ecosystem nhỏ hơn, hire khó hơn, một số npm package không work với npm: prefix | Cân nhắc Node 22 + TS native — gần đủ DX của Deno         |
| Tin "Bun = drop-in Node replacement"                | ~10% APIs khác hoặc missing, native module phải build lại                      | Test toàn bộ test suite trên Bun trước khi commit         |
| Dùng `node-fetch` package với Node 22               | Node 22 đã có fetch built-in                                                   | Xóa dependency, dùng global fetch                         |
| Vẫn dùng `nodemon` với Node 22                      | Node có `--watch` built-in                                                     | Dùng `node --watch app.js`                                |
| Dùng ts-node với Node 22.6+                         | Native strip-types nhanh hơn, ít deps                                          | Dùng `node --experimental-strip-types` cho dev            |
| Chọn runtime dựa benchmark micro                    | Benchmark sintetic ≠ real workload                                             | Benchmark trên app thật của bạn                           |
| Nghĩ ESM/CJS interop đã giải quyết                  | Vẫn có pitfalls (default export, top-level await)                              | Đọc `package.json` `exports` field cẩn thận, test cả 2    |
| Không pin engine version trong production           | Update Node minor có thể break native module                                   | `engines.node: "22.x"` + Docker pin specific version      |
| Dùng `pnpm` khi đã có `bun install`                 | Bun install nhanh hơn 30x                                                      | Nếu team commit Bun, dùng `bun install`                   |

---

### 🎯 Interview Pattern

**Trigger keywords:** "Bun", "Deno", "Node.js performance", "build time", "runtime choice", "ESM vs CJS", "TypeScript native", "Node 22 features".

**Opening 1-2 câu:**

> "Năm 2026 không còn 'Node là default duy nhất'. Tôi đánh giá runtime theo 3 trục: dev velocity (Bun thắng), production stability (Node thắng), edge/security (Deno thắng). Trong cùng 1 project có thể dùng Bun cho CI và dev, Node 22 cho production server, Deno hoặc Workers cho edge. Quyết định dựa vào workload-specific benchmark và compatibility audit, không phải hype."

---

### 🔑 Knowledge Chain

📚 **Prerequisite:**

- [JavaScript Runtime Internals](../fe-track/01-javascript/02-execution-context.md)
- [Event Loop Deep Dive](../fe-track/01-javascript/05-event-loop.md)
- [Module Systems (ESM vs CJS)](../fe-track/01-javascript/14-modules-deep.md)

➡️ **Enables:**

- [Edge Computing 2026](./04-edge-computing-serverless-2026.md)
- [WebAssembly](./07-webassembly-fe-be.md) — Bun/Deno có WASI support
- [Platform Engineering](./12-platform-engineering-dx.md) — runtime choice ảnh hưởng golden path

---

## B. Interview Questions & Answers

### B1. 🟢 [Junior] Bun, Deno, Node là gì? Khác nhau ở đâu?

**💡 Interview Signal:**

- ✅ **Strong:** Mention engine (V8 vs JSC), philosophy, năm sinh, 1 unique feature mỗi cái
- ❌ **Weak:** "Đều là JS runtime" (đúng nhưng quá nông)

**Answer (EN):**

- **Node.js (2009):** OG JavaScript runtime, V8 engine, large ecosystem, npm registry, CJS legacy + ESM
- **Deno (2018):** From Node creator (Ryan Dahl). V8 engine, secure-by-default permissions, web-standard APIs, TypeScript native, no node_modules
- **Bun (2022):** JavaScriptCore engine (WebKit), written in Zig, all-in-one toolchain (runtime + bundler + test + package manager), Node-compatible APIs, 30x faster install

**VI reinforcement:**
3 runtime, 3 triết lý: Node = default/battle-tested, Deno = secure-by-default + web standard + TS native, Bun = tooling hợp nhất + cực nhanh. Engine khác nhau (V8 vs JSC), ngôn ngữ implement khác (C++ vs Rust vs Zig).

---

### B2. 🟢 [Junior] Vì sao Bun nhanh hơn npm/Node nhiều thế?

**💡 Interview Signal:**

- ✅ **Strong:** Mention Zig syscall overhead, concurrent dep resolution, binary lockfile, JSC vs V8 cold start, native APIs
- ❌ **Weak:** "Vì viết bằng Zig" (chưa giải thích vì sao Zig giúp)

**Answer (EN):**

1. **Language:** Zig has lower syscall overhead than C++/Node bindings; manual memory mgmt without GC pauses
2. **Engine:** JavaScriptCore has faster cold start than V8 (designed for iOS Safari)
3. **Concurrent install:** Bun resolves and downloads dependencies in parallel; npm is more sequential
4. **Binary lockfile (`bun.lockb`):** parses 100x faster than JSON `package-lock.json`
5. **Native bindings:** SQLite, S3, password hashing built-in; no JS roundtrip
6. **Hardlinks/clones:** uses copy-on-write filesystem features when available

**VI reinforcement:**
Bun nhanh vì: Zig syscall ít overhead, JSC cold start nhanh hơn V8, install song song (npm hơi tuần tự), binary lockfile parse 100x nhanh hơn JSON, native APIs không qua JS bridge.

---

### B3. 🟢 [Junior] Permission model của Deno hoạt động thế nào?

**💡 Interview Signal:**

- ✅ **Strong:** Liệt kê các flag, fine-grained scope, security implication, compare với Node permission (experimental)
- ❌ **Weak:** "Phải gắn flag để dùng API" (chưa nói vì sao)

**Answer (EN):**
Deno runs sandboxed by default. To access OS resources, you opt-in via flags:

- `--allow-read=./data` — read filesystem (scopable to path)
- `--allow-write=./tmp` — write filesystem
- `--allow-net=api.example.com:443` — network (scopable to host:port)
- `--allow-env=API_KEY` — read environment variable (scopable to var name)
- `--allow-run=git` — spawn subprocess (scopable to command)
- `--allow-sys` — system info
- `-A` — allow all (dev only, never prod)

Use case: running untrusted code (plugins, user scripts), defense-in-depth for production. Node 22 has experimental `--permission` flag with similar concept but less mature.

**VI reinforcement:**
Deno chạy sandboxed mặc định. Phải opt-in từng quyền: `--allow-read`, `--allow-net`, `--allow-env`, ... Có thể scope nhỏ (chỉ host này, chỉ env var này). Dùng cho: chạy code không tin cậy, defense-in-depth production. Node 22 có `--permission` tương tự nhưng experimental.

---

### B4. 🟡 [Mid] ESM vs CJS năm 2026 — vẫn còn vấn đề gì?

**💡 Interview Signal:**

- ✅ **Strong:** Liệt kê concrete pitfalls, dual package hazard, top-level await, dynamic import vs require
- ❌ **Weak:** "ESM modern hơn" (vague)

**Answer (EN):**
While modern Node (22+) supports both, pitfalls remain:

1. **Dual package hazard:** library publishes both ESM and CJS → app may load both copies, instanceof check breaks
2. **`require()` of ESM:** historically threw, Node 22+ allows synchronous require of ESM (with restrictions)
3. **Top-level await:** ESM allows; CJS doesn't → can't `require()` an ESM module that uses TLA at top level
4. **`__dirname`/`__filename`:** not available in ESM; use `import.meta.url`
5. **JSON imports:** ESM needs `with { type: "json" }` assertion
6. **Default export interop:** `import x from "./cjs"` may not give you the expected value (varies by bundler)
7. **`exports` field in package.json:** controls dual exposure; misconfiguration causes "Cannot find module" mysterious errors

**Strategy 2026:** Publish ESM-only for new libraries, dual-package for legacy ecosystem; configure `exports` carefully; avoid TLA in libraries.

**VI reinforcement:**
Pitfalls còn: dual package hazard (load 2 copies), top-level await không require được, `__dirname` không có trong ESM (dùng `import.meta.url`), default export interop khác bundler, JSON cần `with { type: "json" }`. Chiến lược 2026: lib mới ESM-only, lib cũ dual; `exports` field rất quan trọng.

---

### B5. 🟡 [Mid] Native TypeScript trong Node 22+ vs `tsx`/`ts-node` — khi nào dùng cái nào?

**💡 Interview Signal:**

- ✅ **Strong:** Phân biệt strip-types vs full transform, biết enum/decorator caveat, mention performance numbers
- ❌ **Weak:** "Node 22 chạy TS được rồi nên không cần ts-node" (đúng nhưng có caveat)

**Answer (EN):**
Node 22.6+ supports `--experimental-strip-types`. Node 23+ adds `--experimental-transform-types`.

**Strip-types (default):** Removes type annotations; output is valid JS. Does NOT support:

- `enum` (TS-specific runtime construct)
- `namespace` (TS-specific)
- Decorators (still proposal)
- `import = require()` syntax
- Path aliases (`paths` in tsconfig)

**Use cases:**

- Native strip-types: dev scripts, tests, simple TS projects → fastest, no deps
- `tsx`: needs JSX support, decorators, path aliases → swc-based, fast
- `ts-node`: full TS semantic checking at runtime → slow, mostly legacy
- Production: still pre-compile with `tsc`/`tsgo` for type safety + dist

**Performance:** Native strip-types ~5x faster than tsx, 20x faster than ts-node.

**VI reinforcement:**
Node 22.6+ có `--experimental-strip-types` (chỉ xóa type, không transform). KHÔNG support enum, decorator, namespace, path alias. Dùng khi: dev script đơn giản. Cần JSX/decorator/alias → tsx. Cần type-check runtime → ts-node (legacy). Production vẫn nên pre-compile bằng tsc/tsgo.

---

### B6. 🟡 [Mid] Vẽ benchmark setup cho việc chọn runtime cho production HTTP service.

**💡 Interview Signal:**

- ✅ **Strong:** Mention realistic workload (not "hello world"), warm-up, load pattern, multi-metric (P50/P99/throughput/memory), monitoring
- ❌ **Weak:** "Chạy `wrk` 30s" (quá nông)

**Answer (EN):**

**Methodology:**

```
1. Build representative load:
   - Endpoint mix: 70% GET cached, 20% GET DB, 10% POST DB write
   - Realistic payload sizes (1KB-50KB)
   - Realistic dependencies loaded (auth lib, ORM, observability)

2. Setup:
   - Identical hardware (same VM size)
   - Same Postgres / Redis instance (warm)
   - Same observability stack (mark cost overhead)

3. Test phases:
   - Warm-up: 5min ramp 0 → target RPS
   - Steady-state: 30min at target RPS
   - Spike: 5min at 3x target
   - Cool-down

4. Metrics collected:
   - P50, P95, P99, P99.9 latency
   - Throughput (RPS sustained)
   - Memory: RSS, heap, leak rate over 30min
   - CPU: per-core utilization
   - Cold start (kill + restart timing)
   - Error rate (5xx, timeout)
   - Container/binary size

5. Compatibility check (orthogonal to perf):
   - All native modules build?
   - Observability agent (Datadog/Sentry) work?
   - Source maps in stack traces?
   - Profiling tools work?

6. TCO estimate:
   - Cost per 1M requests
   - Engineer ramp-up time
   - Migration effort
```

**Decision rule:** runtime A wins if: faster on real workload by ≥20%, passes compat check, observability parity. Otherwise stay.

**VI reinforcement:**
Setup benchmark phải: workload thật (không phải hello world), warm-up + steady + spike, đo P50/P95/P99 + throughput + memory leak rate, kiểm tra compat (native module, observability agent), tính TCO. Quyết định: runtime mới win nếu nhanh ≥20% trên workload thật + đậu compat + observability parity.

---

### B7. 🟡 [Mid] Bun.serve vs Express vs Hono vs Fastify — chọn cái nào 2026?

**💡 Interview Signal:**

- ✅ **Strong:** Phân biệt theo use case + ecosystem maturity + Web Standard API alignment
- ❌ **Weak:** "Hono nhanh nhất nên dùng Hono" (chưa đủ context)

**Answer (EN):**

| Framework     | Best for                                   | Why                                      | Caveats                        |
| ------------- | ------------------------------------------ | ---------------------------------------- | ------------------------------ |
| **Express 5** | Legacy migration, max ecosystem            | 15+ years middleware ecosystem           | Slow per req, callback-style   |
| **Fastify**   | Node-only, max throughput on Node          | JSON schema, plugin system, ~3x Express  | Node-specific                  |
| **Hono**      | Multi-runtime (Node/Bun/Deno/Workers/Edge) | Web Standard API based, tiny, edge-first | Newer ecosystem                |
| **Bun.serve** | Bun-only, max throughput                   | Native C++ HTTP, ~3x Fastify             | Bun lock-in                    |
| **Elysia**    | Bun-only, type-safety obsessed             | End-to-end types, plugin system          | Bun lock-in, smaller ecosystem |

**Recommendation 2026:**

- New project, multi-runtime: **Hono** (works everywhere, future-proof)
- Pure Node legacy or enterprise: **Fastify** (mature, schema-validated)
- Pure Bun greenfield: **Hono** or **Elysia** (Hono if portable, Elysia if max DX)
- Edge functions: **Hono** (designed for it)

**VI reinforcement:**
Nếu cần multi-runtime (Node + Bun + edge): **Hono**. Nếu enterprise Node-only cần max throughput: **Fastify**. Nếu Bun greenfield: **Hono** (portable) hoặc **Elysia** (DX). Tránh lock-in trừ khi cần thiết.

---

### B8. 🔴 [Senior] Bạn được giao migrate 1 monorepo 40 apps từ Node 18 → Bun. Plan chi tiết.

**💡 Interview Signal:**

- ✅ **Strong:** Phased approach, risk segmentation, rollback plan, observability, communication
- ❌ **Weak:** "Đổi `node` thành `bun` trong package.json" (sai, không xét rủi ro)

**Answer (EN — Bloom L5 Synthesize):**

**Phase 0 — Audit (Week 1-2):**

- Inventory: list all 40 apps, native modules used (sharp, bcrypt, node-canvas), DB drivers, observability agents
- Compatibility matrix: which apps có native deps unsupported?
- Risk segmentation: A (zero native, just web server), B (some native, replaceable), C (heavy native, defer)

**Phase 1 — Tooling migration (Week 3-4):**

- Replace `npm install` → `bun install` in CI for all apps (keeps Node runtime)
- Win: 30x install time. No runtime change yet → low risk
- Add `bun.lockb` to git, keep `package-lock.json` until phase 4

**Phase 2 — Test migration (Week 5-8):**

- Migrate `jest` → `bun test` for category A apps
- Snapshot test compatibility verified
- CI runs both: `bun test` for speed, `npm test` as canary

**Phase 3 — Dev runtime (Week 9-12):**

- `bun --hot` replaces `nodemon` for local dev
- Engineers report incompat issues; fix or work around
- Production still Node 18

**Phase 4 — Production canary (Week 13-20):**

- Pick 1 category A app (low traffic, low risk)
- Deploy Bun version to 5% traffic via feature flag
- Monitor: P99 latency, error rate, memory leak, observability events
- Rollback plan: flag flip to Node deployment in <1min

**Phase 5 — Production rollout (Week 21-30):**

- Roll out category A apps progressively (5% → 25% → 100%)
- Category B apps: replace native deps with Bun-compatible (e.g., sharp → @img/sharp-bun)
- Category C apps: stay on Node 22 LTS (don't migrate if cost/benefit fails)

**Communication:**

- Weekly Slack updates with metrics
- Office hours for engineers hitting issues
- Internal docs: "Bun gotchas at our company"

**Success criteria:**

- ≥30% category A apps in prod on Bun by Q4
- CI time reduced ≥50%
- Zero unresolved Bun-caused incidents

**Rollback gates:**

- Any incident with no fix within 1h → revert app to Node, investigate, retry next quarter

**VI reinforcement:**
**6 phase**: (0) Audit risk-segment 40 apps thành A/B/C theo native deps. (1) Migrate `bun install` cho CI — install nhanh, runtime vẫn Node. (2) Migrate test sang `bun test` cho category A. (3) `bun --hot` cho local dev. (4) Production canary 5% trên 1 app A → monitor → rollback nếu cần. (5) Roll out tăng dần A → B → C (C có thể stay Node). Phải có rollback plan <1min, weekly metrics, office hours. Success: ≥30% A apps lên Bun + CI cut 50% + 0 Bun-caused incident.

---

### B9. 🔴 [Senior] Đánh giá: Deno Deploy vs Cloudflare Workers vs Vercel Edge Functions cho startup.

**💡 Interview Signal:**

- ✅ **Strong:** Multi-axis comparison (DX, ecosystem, lock-in, cost, observability), startup-specific factors (hiring, time-to-market)
- ❌ **Weak:** "Cloudflare rẻ nhất nên Cloudflare"

**Answer (EN — Bloom L5 Evaluate):**

**Comparison matrix:**

| Axis                      | Deno Deploy               | Cloudflare Workers        | Vercel Edge                      |
| ------------------------- | ------------------------- | ------------------------- | -------------------------------- |
| Runtime                   | Deno (V8 + secure)        | V8 isolates               | V8 isolates                      |
| Cold start                | ~10-20ms                  | ~5ms                      | ~5ms                             |
| Free tier                 | 1M req/mo                 | 100K req/day              | 1M req/mo (Hobby)                |
| Pricing @ 10M req         | ~$10                      | ~$5                       | $20 (Pro)                        |
| Storage                   | Deno KV (built-in)        | KV, R2, D1, DO            | KV, Postgres, Blob               |
| Stateful coordination     | Deno KV (limited)         | Durable Objects           | Edge Config                      |
| Observability             | OpenTelemetry built-in    | Workers Logs, Tail        | Vercel Analytics, OTel           |
| Framework first-class     | Fresh, Hono               | Hono, Remix, Next         | Next.js (best), SvelteKit        |
| Hire-ability              | Smaller pool              | Decent                    | Large (Next.js devs)             |
| Lock-in                   | Medium (Deno-specific KV) | High (DO, D1 specific)    | High (Next.js + Vercel coupling) |
| Multi-tenant SaaS pattern | Decent                    | Excellent (DO per tenant) | Decent                           |
| AI/ML inference           | Limited                   | Workers AI built-in       | AI SDK + 3rd party               |

**Recommendation by startup profile:**

- **Greenfield SaaS, Next.js team:** Vercel Edge (DX win, fast time-to-market) — accept lock-in
- **Multi-tenant B2B, need stateful at edge:** Cloudflare Workers + DO (best primitive)
- **Security/compliance heavy, want Web standard:** Deno Deploy
- **AI-heavy product:** Cloudflare Workers (Workers AI integration)
- **Enterprise with AWS gravity:** stay AWS Lambda + CloudFront Functions

**Anti-patterns:**

- "Use all 3" → ops nightmare for small team
- "Avoid lock-in at all cost" → slower to ship; some lock-in is acceptable trade-off

**VI reinforcement:**
Quyết định theo profile: Next.js team → Vercel (DX nhanh, accept lock-in). Multi-tenant cần stateful → Cloudflare Workers + DO. Security/compliance → Deno Deploy. AI-heavy → Cloudflare (Workers AI). AWS gravity → giữ Lambda. **Đừng dùng cả 3** (ops nightmare). **Đừng obsess no-lock-in** (chậm ship).

---

### B10. 🔴 [Senior] Bun chạy server production, sau 48h memory tăng đều → debug?

**💡 Interview Signal:**

- ✅ **Strong:** Methodical debugging (heap snapshot, profiler, isolation, hypothesis), Bun-specific tools, fallback to Node comparison
- ❌ **Weak:** "Restart container mỗi 24h" (workaround không phải fix)

**Answer (EN — Bloom L4 Analyze):**

**Hypothesis space:**

1. App-level leak (closure, global Map, event listener)
2. Bun runtime leak (bug in Zig code or JSC)
3. Native module leak (Bun's native binding)
4. Observability agent leak (some agents not Bun-tested)

**Debug steps:**

```bash
# 1. Confirm leak pattern
# Plot RSS over 48h. Linear growth = leak. Plateau = normal warmup.

# 2. Heap snapshot (Bun 1.1+)
bun --inspect-brk app.ts
# Connect Chrome DevTools, take 3 snapshots: T0, T+12h, T+24h
# Compare retained sizes; look for growing object types

# 3. Bun --smol mode for testing
# Forces lower memory ceiling, leak surfaces faster
bun --smol app.ts

# 4. Isolate suspect components
# Disable feature flags one by one (auth lib, ORM, observability agent)
# Watch memory curve change

# 5. Compare to Node
# Run same app on Node 22 with Hono/Fastify
# If Node has no leak → Bun runtime or native binding suspect
# If Node also leaks → app-level bug

# 6. Profile native bindings
# bun:sqlite, bun:ffi, Bun.spawn — known issues areas

# 7. Check known issues
# github.com/oven-sh/bun/issues with "memory leak" label
```

**Common Bun-specific causes (2024-2025):**

- `Bun.serve` with WebSocket: forgetting to clean up on close
- `bun:sqlite` prepared statements not finalized
- Datadog Node tracer running on Bun (partially compatible)
- File descriptors from `Bun.file()` not GC'd promptly

**Fix pattern:**

1. Reproduce in staging with synthetic load
2. Snapshot diff confirms leak source
3. Patch app code OR file Bun issue + workaround
4. Verify fix with 48h soak test before prod rollout
5. Add metric alert for RSS growth rate going forward

**VI reinforcement:**
Debug có method: (1) confirm linear growth qua RSS plot, (2) heap snapshot 3 mốc + diff, (3) `--smol` mode để leak surface nhanh, (4) isolate component bằng feature flag, (5) chạy cùng app trên Node 22 — nếu Node không leak → Bun runtime/native suspect, (6) check Bun GitHub issues. Common Bun leak: WebSocket cleanup, sqlite statement không finalize, observability agent chưa fully Bun-compatible.

---

## C. Study Cases & Synthesis

### C1. Tổng Quan / Overview

2026: **Polyglot runtime usage thành norm.** Senior engineer phải:

1. Phân biệt 3 runtime theo philosophy + technical trade-off
2. Biết khi nào dùng cái nào (CLI / dev / prod / edge)
3. Migration plan có phase + risk segmentation
4. Debug runtime-specific issues

### C2. Q&A Summary

| #   | Question                          | Diff | Concept         | Signal                                |
| --- | --------------------------------- | ---- | --------------- | ------------------------------------- |
| 1   | Bun vs Deno vs Node               | 🟢   | Foundations     | Engine + philosophy + năm sinh        |
| 2   | Vì sao Bun nhanh                  | 🟢   | Performance     | Zig + JSC + concurrent install        |
| 3   | Deno permissions                  | 🟢   | Security        | Liệt kê flags + scope                 |
| 4   | ESM vs CJS pitfalls 2026          | 🟡   | Module system   | Concrete pitfalls (TLA, dual package) |
| 5   | Native TS Node 22 vs tsx/ts-node  | 🟡   | Tooling         | Strip vs transform + caveat           |
| 6   | Benchmark methodology             | 🟡   | Decision making | Realistic load + multi-metric         |
| 7   | Bun.serve vs Express/Hono/Fastify | 🟡   | Frameworks      | Multi-runtime vs lock-in              |
| 8   | Migrate 40 apps Node → Bun        | 🔴   | Migration plan  | Phased + risk segment + rollback      |
| 9   | Deno Deploy vs Workers vs Vercel  | 🔴   | Platform choice | Multi-axis + startup profile          |
| 10  | Bun production memory leak        | 🔴   | Debugging       | Methodical + Bun-specific             |

### C3. ⚡ Cold Call Simulation

**Q:** "When would you choose Bun over Node?"

**Answer (30s):**

> "I'd choose Bun for development and CI workflows immediately — install is 30x faster, test runner is 5x faster, hot reload is instant. For production, I'd choose Bun if my workload is HTTP-heavy and stateless, with no critical native dependencies — Bun.serve has roughly 3x the throughput of Node Fastify. I'd stay on Node 22 LTS for production if I rely on enterprise observability tooling, sharp/bcrypt/canvas-style native modules, or my team lacks bandwidth to debug Bun-specific edge cases. The right answer in 2026 is often hybrid: Bun for dev and CI, Node 22 LTS for prod, until Bun ecosystem catches up everywhere."

**Follow-up:** "Isn't Bun unstable for production?"

**Recovery:**

> "Bun 1.1+ has been used in production by companies like Cal.com and Vercel internal tools for over a year. The risk isn't core stability — it's edge cases in native bindings and observability agent compatibility. Mitigate with phased rollout: canary one app at 5% traffic, monitor for a week, expand."

### C4. ✅ Self-Check

1. **Retrieval:** Liệt kê 5 thứ Node 22 đã built-in mà trước đây cần npm package.
2. **Visual:** Vẽ decision tree cho việc chọn runtime cho: (a) CLI tool, (b) Next.js app, (c) high-throughput API.
3. **Application:** Bạn có 1 Express app dùng `node-fetch`, `nodemon`, `dotenv`, `jest`, `ts-node`. Refactor để dùng tối thiểu deps trên Node 22.
4. **Debug:** Bun test pass trên local, fail trên CI. Hypothesis space?
5. **Teach:** Giải thích cho 1 senior Node engineer (skeptical) tại sao nên thử Bun cho CI.

### C5. 💬 Feynman Prompt

> Giải thích cho 1 PM **không biết code** sự khác nhau giữa Node, Deno, Bun bằng analogy nhà bếp / xe ô tô / smartphone OS. Trong 5 phút.

### C6. 🔁 Spaced Repetition

| Lần | Khi nào  | Bài tập                                                            |
| --- | -------- | ------------------------------------------------------------------ |
| 1   | Hôm nay  | Đọc + Self-Check                                                   |
| 2   | +1 ngày  | Cài Bun, chạy `bun create hono my-app && bun dev`                  |
| 3   | +3 ngày  | Convert 1 small Node script sang Bun, đo time                      |
| 4   | +7 ngày  | Trả lời lại B8, B9 trên giấy                                       |
| 5   | +14 ngày | Đọc Cal.com migration blog + Bun release notes                     |
| 6   | +30 ngày | Mock interview: "design migration plan Node → Bun"                 |
| 7   | Hàng quý | Update theo: Node LTS new release, Bun major release, Deno feature |

### C7. 🔗 Connections

**Same track (2026):**

- [Edge Computing](./04-edge-computing-serverless-2026.md) — runtime choice tại edge
- [LLM System Design](./02-llm-system-design.md) — Bun phù hợp build AI gateway?
- [WebAssembly](./07-webassembly-fe-be.md) — Bun, Deno có WASI 0.2 support
- [Senior in AI Era](./10-senior-engineer-ai-era.md) — runtime decision framework
- [Modern Observability](./11-modern-observability.md) — observability gap khi đổi runtime
- [Platform Engineering](./12-platform-engineering-dx.md) — golden path runtime choice

**Cross-track:**

- [JS Modules Deep Dive](../fe-track/01-javascript/14-modules-deep.md)
- [Event Loop](../fe-track/01-javascript/05-event-loop.md)
- [Node.js Backend Patterns](../be-track/02-backend-knowledge/) — pattern parity check
- [TypeScript Advanced](../fe-track/02-typescript/) — TS native runtime impact
- [Software Engineering Practices](../shared/05-software-engineering/) — migration strategy

---

> **Senior insight:** Câu "nên dùng runtime nào" gần như luôn sai context. Câu đúng: **"workload nào, on what tier, with what ecosystem maturity, and what's our team's bandwidth to debug new runtime issues?"** Trả lời đúng 4 câu nhỏ → ra runtime đúng.
