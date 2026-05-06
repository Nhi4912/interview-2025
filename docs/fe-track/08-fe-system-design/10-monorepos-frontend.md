# Frontend Monorepos / Monorepo cho Frontend

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md) · [FE System Design README](./README.md) · [Micro-Frontends](../15-modern-platform/03-micro-frontends-scale.md) · [Bundle Optimization](../06-browser-performance/03-bundle-optimization.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Interviewer hỏi: _"We have 5 frontend teams, 12 apps, and a shared design system. Should we go monorepo?"_

Đây là một trong những câu hỏi system design phân biệt rõ nhất Junior với Senior. Junior sẽ trả lời ngay: _"Yes — put everything in one repo, easier to manage."_ Senior sẽ hỏi ngược lại: "What's your current pain point? Version drift? Duplicated CI config? Type-sync hell?" Rồi mới đưa ra recommendation có cơ sở.

**Câu chuyện thực tế:**

- **Google** duy trì một single monorepo với hơn **2 tỷ dòng code**, khoảng **86 TB** source files, hơn 50.000 engineers làm việc trên **một** Bazel workspace. Đây là ví dụ extreme nhất về monorepo — nhưng Google cũng build Bazel từ đầu vì không có công cụ nào đáp ứng được scale đó.

- **Vercel** tạo ra **Turborepo** chính xác vì nội bộ của họ bị đau với monorepo chậm. Vercel dashboard, Next.js docs, và nhiều internal tools nằm trong cùng một workspace — CI rebuild toàn bộ mọi PR. Turborepo giải quyết bằng content-addressable caching và task graph. Sau khi Vercel mua Turborepo (2021), họ báo cáo tiết kiệm **80% CI time** trên remote cache.

- **Nx** được dùng rộng rãi tại **Microsoft** (nhiều Azure tools), **Storybook**, **Cypress** — những project có 30–100+ packages cần graph-based affected detection.

- **Shopify** đã trải qua hành trình ngược lại: từ massive polyrepo (hàng trăm repos riêng lẻ), họ migrate về monorepo cho toàn bộ frontend infrastructure của Hydrogen (commerce framework), chia sẻ types, design tokens, và CI config qua workspace protocol.

**Interview hook này quan trọng vì**: Câu trả lời không phải là "monorepo tốt hơn polyrepo" hay ngược lại. Câu trả lời là **một bộ tradeoff cụ thể** phụ thuộc vào team size, deploy cadence, shared code ratio, và CI budget. Biết articulate điều đó mới là Senior signal.

> 🇻🇳 **Tóm tắt**: Google dùng single repo 2B+ LOC + Bazel. Vercel tạo Turborepo vì đau với CI chậm, tiết kiệm 80% CI time nhờ remote cache. Nx dùng tại Microsoft/Storybook/Cypress. Shopify migrate polyrepo → monorepo cho Hydrogen. Câu trả lời đúng cho "nên monorepo không?" là một bộ tradeoff, không phải yes/no.

---

## What & Why / Cái Gì & Tại Sao

### Definition / Định Nghĩa

**Monorepo** = một single Git repository chứa nhiều packages, apps, và/hoặc services có liên quan — chia sẻ tooling, versioning workflow, và CI pipeline chung.

Monorepo **KHÔNG phải** là:

- **Monolith**: Monolith = một app duy nhất, code không tách thành packages. Monorepo có thể chứa nhiều micro-apps độc lập.
- **Micro-frontends**: MFE là runtime composition pattern (nhiều teams deploy độc lập). Monorepo là source management strategy. Chúng có thể kết hợp (MFE trong monorepo) hoặc tồn tại độc lập.
- **Multi-package npm publishing**: Publish nhiều npm packages (như Babel, React) không nhất thiết đòi hỏi monorepo tool — nhưng monorepo giúp DX tốt hơn.

```
MONOREPO vs POLYREPO vs MONOLITH
───────────────────────────────────────────────────────────────────────

POLYREPO (before):
  github.com/org/web-app          (React app, Node v18)
  github.com/org/admin-app        (React app, Node v18) — duplicate deps
  github.com/org/design-system    (npm package, version 2.1.0)
  github.com/org/shared-types     (npm package, version 1.0.0)
  → 4 repos, 4 CI configs, design-system version drift between apps

MONOREPO (after):
  github.com/org/frontend (single repo)
  ├── apps/
  │   ├── web/           → consumes packages/ui@workspace:*
  │   └── admin/         → consumes packages/ui@workspace:*
  └── packages/
      ├── ui/            → single source of truth for components
      └── types/         → shared TypeScript interfaces

MONOLITH (different thing):
  github.com/org/big-app
  └── src/               → everything in one src/, no package boundaries
      ├── components/
      ├── pages/
      └── utils/         → not separate packages, just folders
```

### Tại Sao Frontend Cần Monorepo / Why Frontend Specifically

Frontend teams gặp monorepo pain mạnh hơn backend vì:

1. **Shared UI components**: Design system (Button, Modal, DatePicker) cần dùng được ở web app, admin app, mobile web, docs site. Polyrepo = publish npm, chờ CI, bump version trong 4 repos.

2. **Shared TypeScript types**: API response types, form schemas, router types — duplicating chúng dẫn đến type drift. Trong monorepo: `import type { User } from '@org/types'` luôn là single source.

3. **Shared configs**: ESLint config, Prettier config, TypeScript base config, Vite config — trong polyrepo mỗi repo có version riêng, dần dần chúng diverge.

4. **Cross-app refactors**: Rename một interface, change một API contract — trong polyrepo cần mở 4 PRs. Trong monorepo: một PR atomic, TypeScript tìm all usages.

5. **Deploy dependencies**: Admin app phụ thuộc vào UI package mới. Trong polyrepo: publish UI → wait for npm → update admin. Trong monorepo: atomic commit đảm bảo versions always in sync.

### Polyrepo Costs / Chi Phí Polyrepo

| Cost                        | Mô tả                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------ |
| **Version drift**           | `web` dùng `@org/ui@2.1`, `admin` vẫn ở `@org/ui@1.9` — bugs fixed in one place only |
| **Duplicated CI config**    | 4 repos × 200 lines yaml = 800 lines to maintain; một update phải replicate 4 nơi    |
| **Sync overhead**           | Breaking change trong types → 4 separate PRs với manual coordination                 |
| **NPM publish lag**         | Code change → publish → npm registry propagate → bump downstream → CI runs again     |
| **No atomic refactors**     | Cannot rename across repos in a single commit/PR                                     |
| **Duplicated node_modules** | 4 repos × 400MB = 1.6GB disk; React được install 4 lần riêng lẻ                      |

### Monorepo Costs / Chi Phí Monorepo

| Cost                     | Mô tả                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------ |
| **CI scale problem**     | mọi PR ở bất kỳ package nào đều trigger CI — cần "affected" logic để không build all |
| **Ownership ambiguity**  | Không có boundaries → mọi người có thể sửa bất kỳ code nào → "who owns this?"        |
| **Tooling complexity**   | Cần orchestrator (Turborepo/Nx) — thêm learning curve và configuration               |
| **Large clone/checkout** | 50+ packages = `git clone` chậm hơn; cần shallow clone hoặc sparse checkout          |
| **IDE performance**      | VS Code indexing 500K files = chậm nếu không configure exclusions                    |
| **Political resistance** | Teams quen autonomous repos sẽ push back; "ai cũng có thể thay đổi code của tôi"     |

> 🇻🇳 **Tóm tắt**: Monorepo = single repo, nhiều packages/apps, shared tooling. KHÁC với monolith (một app to) và micro-frontends (runtime composition). Frontend cần vì shared UI/types/configs. Polyrepo gây version drift + CI duplication + sync hell. Monorepo gây CI scale problem + ownership ambiguity + tooling complexity.

---

## Concept Map / Bản Đồ Khái Niệm

```
FRONTEND MONOREPO ARCHITECTURE 2026
══════════════════════════════════════════════════════════════════════

  DEVELOPER EXPERIENCE LAYER
  ┌─────────────────────────────────────────────────────────────────┐
  │  Graph visualization  │  Affected commands  │  IDE integration  │
  │  nx graph / turbo run │  turbo run --filter │  Nx Console VSCode│
  └─────────────────────────────────────────────────────────────────┘
                                    │
  ENFORCEMENT LAYER
  ┌─────────────────────────────────────────────────────────────────┐
  │  Module boundaries        │  Ownership              │  Lint     │
  │  nx enforce-module-boundaries │ CODEOWNERS         │  ESLint   │
  │  eslint-plugin-import     │  scoped PR review       │  import   │
  └─────────────────────────────────────────────────────────────────┘
                                    │
  BUILD ORCHESTRATION LAYER
  ┌──────────────────────────────────────────────────────────────────┐
  │                                                                  │
  │  Turborepo               Nx                  Bazel               │
  │  ──────────────          ──────────────       ──────────────     │
  │  • Task graph            • Project graph      • Hermetic builds  │
  │  • Content-hash cache    • Affected detect    • Polyglot         │
  │  • Remote cache (Vercel) • Code gen           • Remote cache     │
  │  • Pipeline config       • Nx Cloud           • Very high learn  │
  │    via turbo.json        • nx.json + project  │                  │
  │                            .json              │                  │
  │                                                                  │
  │  Moon                    Rush                 Lerna (legacy)     │
  │  ──────────────          ──────────────       ──────────────     │
  │  • Rust-based speed      • MS-backed          • npm lifecycle    │
  │  • Task runner + dep     • Strict versioning  • NO task graph    │
  │  • moon.yml config       • shrinkwrap-style   • Use Turbo instead│
  └──────────────────────────────────────────────────────────────────┘
                                    │
  WORKSPACE / PACKAGE MANAGER LAYER
  ┌──────────────────────────────────────────────────────────────────┐
  │                                                                  │
  │  pnpm workspaces          yarn workspaces     npm workspaces     │
  │  ─────────────────        ───────────────     ──────────────     │
  │  • Symlinks (fast)        • Classic support   • Built-in v7+     │
  │  • Hard-link store        • PnP optional      • Slowest hoisting │
  │  • workspace:* protocol   • workspace:*       • Less strict      │
  │  • RECOMMENDED 2026       │ (Yarn 2+)         │                  │
  │                                                                  │
  │  pnpm-workspace.yaml      .yarnrc.yml         package.json       │
  │  (required)               workspaces[]        workspaces[]       │
  └──────────────────────────────────────────────────────────────────┘
                                    │
  REPOSITORY LAYOUT LAYER
  ┌──────────────────────────────────────────────────────────────────┐
  │                                                                  │
  │  apps/web          apps/admin         apps/docs                 │
  │  apps/mobile-web   ...                                           │
  │                                                                  │
  │  packages/ui       packages/types     packages/config           │
  │  packages/utils    packages/hooks     ...                       │
  │                                                                  │
  └──────────────────────────────────────────────────────────────────┘
```

> 🇻🇳 **Tóm tắt**: Stack từ dưới lên: (1) Package manager workspaces — pnpm được recommend nhất. (2) Repository layout — apps/ + packages/. (3) Build orchestration — Turborepo/Nx/Bazel. (4) Enforcement — module boundaries, CODEOWNERS. (5) DX — graph visualization, affected commands.

---

## Tool Comparison Matrix / Bảng So Sánh Công Cụ

| Tool                | Build Orchestration  | Local Cache | Remote Cache                | Task Graph | JS-only vs Polyglot         | Learning Curve | Maintained by          | When to Choose                                                                 |
| ------------------- | -------------------- | ----------- | --------------------------- | ---------- | --------------------------- | -------------- | ---------------------- | ------------------------------------------------------------------------------ |
| **Turborepo**       | ✅ Task pipeline     | ✅          | ✅ Vercel Remote Cache / S3 | ✅ DAG     | JS/TS only                  | Low            | Vercel                 | JS/TS monorepo, fast setup, Vercel deployment, < 50 packages                   |
| **Nx**              | ✅ Project graph     | ✅          | ✅ Nx Cloud (paid) / custom | ✅ DAG     | Polyglot possible           | Medium         | Nrwl / community       | Large orgs, code generation needed, Angular/React big teams, strict boundaries |
| **Bazel**           | ✅ Hermetic builds   | ✅          | ✅ Remote execution + cache | ✅ Full    | Polyglot (Go, Java, Python) | Very High      | Google / community     | Google-scale polyglot repos, 100+ engineers, CI determinism critical           |
| **Moon**            | ✅ Task runner       | ✅ (Rust)   | ✅ moonrepo.dev / custom    | ✅ DAG     | JS/TS primary               | Low–Medium     | moonrepo (open source) | Speed-critical setups, Rust performance enthusiasts, newer alternative         |
| **Rush**            | ✅ Incremental build | ✅          | ⚠️ Limited native           | ✅ DAG     | JS/TS only                  | Medium–High    | Microsoft              | Microsoft-stack teams, strict version policies, Rush Stack alignment           |
| **pnpm workspaces** | ❌ No orchestration  | ❌          | ❌                          | ❌         | JS/TS only                  | Low            | pnpm team              | Small repos (2–5 packages) where you just need local symlinks, no CI scale     |
| **Lerna** (legacy)  | ⚠️ Basic only        | ❌          | ❌ (deprecated solo)        | ❌         | JS/TS only                  | Low            | Nrwl (maintenance)     | **Do not start new projects with Lerna alone.** Migrate to Turborepo/Nx.       |

**Key distinctions:**

- **pnpm workspaces alone**: Handles package linking and `workspace:*` protocol — but has zero build orchestration. If you run `pnpm -r build`, it runs in dependency order but without caching, parallelization strategy, or affected detection. Fine for 3 packages; painful at 20+.
- **Turborepo vs Nx**: Turborepo is config-file-first (minimal `turbo.json`), lower opinion. Nx has generators, migration tools, plugin ecosystem. Turborepo = simpler start; Nx = more power, more decisions.
- **Bazel**: Genuinely different category. Hermetic builds, deterministic outputs, language-agnostic — but requires BUILD files per package and a steep learning investment. Only justified at Google/Meta/Stripe scale or with dedicated build-eng team.
- **Lerna**: Lerna v6+ is maintained by Nrwl and integrates with Nx — but using Lerna alone (without Nx or Turbo) for a new project is not recommended. The versioning/publishing workflow of Lerna is still useful when combined with Nx.

> 🇻🇳 **Tóm tắt**: Turborepo = đơn giản, thích hợp cho team nhỏ/vừa, low learning curve. Nx = mạnh hơn, code gen, strict boundaries, large teams. Bazel = chỉ dùng cho scale cực lớn đa ngôn ngữ. pnpm workspaces một mình = không có caching/orchestration, chỉ đủ cho repo nhỏ. Lerna cũ = không nên dùng standalone.

---

## Part 1: Workspace Layouts / Cách Tổ Chức Workspace

### Layout 1: apps/ + packages/ (Most Common) / Phổ Biến Nhất

```
my-frontend/
├── apps/
│   ├── web/                    # Customer-facing Next.js app
│   │   ├── package.json        # name: "@org/web"
│   │   └── src/
│   ├── admin/                  # Internal admin dashboard
│   │   ├── package.json        # name: "@org/admin"
│   │   └── src/
│   └── docs/                   # Documentation site (Astro)
│       ├── package.json        # name: "@org/docs"
│       └── src/
├── packages/
│   ├── ui/                     # Shared component library
│   │   ├── package.json        # name: "@org/ui"
│   │   └── src/
│   ├── types/                  # Shared TypeScript interfaces
│   │   ├── package.json        # name: "@org/types"
│   │   └── src/
│   ├── config/                 # Shared configs (ESLint, TS, Tailwind)
│   │   ├── eslint/
│   │   ├── typescript/
│   │   └── tailwind/
│   └── utils/                  # Shared utility functions
│       ├── package.json        # name: "@org/utils"
│       └── src/
├── pnpm-workspace.yaml
├── turbo.json
├── package.json                # Root workspace (private: true)
└── tsconfig.base.json
```

**Khi dùng**: Default recommendation. Clear separation: `apps/` là deployable applications, `packages/` là reusable libraries. Dễ hiểu, dễ onboard engineers mới.

**Tradeoffs**: `packages/` có thể phình ra khi nhiều packages nhỏ không rõ categorization.

---

### Layout 2: Domain-Driven / Phân Chia Theo Domain

```
ecommerce-monorepo/
├── apps/
│   ├── storefront/
│   └── checkout/
├── domains/
│   ├── catalog/               # Domain: product catalog
│   │   ├── ui/                # Catalog-specific components
│   │   ├── hooks/             # Catalog hooks (useProducts, etc.)
│   │   └── api/               # Catalog API client
│   ├── cart/                  # Domain: shopping cart
│   │   ├── ui/
│   │   ├── hooks/
│   │   └── store/             # Zustand store for cart
│   └── checkout/              # Domain: checkout flow
│       ├── ui/
│       └── forms/
├── shared/
│   ├── ui/                    # Generic components (Button, Input)
│   └── utils/                 # Generic utilities
└── ...
```

**Khi dùng**: 5+ teams, mỗi team owns một domain. Enforces **vertical slice ownership** — catalog team owns `domains/catalog/*`. Kết hợp tốt với Nx module boundaries.

**Tradeoffs**: Phức tạp hơn để navigate; newcomers không biết shared/ vs domains/ phân chia như thế nào.

---

### Layout 3: Flat packages/ (For Library Authors)

```
babel-monorepo/ (Babel's actual structure)
├── packages/
│   ├── babel-core/
│   ├── babel-parser/
│   ├── babel-generator/
│   ├── babel-traverse/
│   ├── babel-types/
│   └── babel-plugin-transform-*/   # 100+ plugins
└── ...
```

**Khi dùng**: Open-source library suite (Babel, React ecosystem, Radix UI). Tất cả packages đều là publishable npm packages. Không có "apps".

**Tradeoffs**: Không phù hợp cho internal org với mix của apps và libraries.

---

### Layout 4: By Platform

```
super-app/
├── web/
│   ├── app/                  # Next.js web app
│   └── packages/             # Web-specific packages
├── mobile/
│   ├── app/                  # React Native app
│   └── packages/             # RN-specific packages
├── desktop/
│   └── app/                  # Electron app
└── shared/
    ├── design-tokens/        # Shared across all platforms
    ├── api-client/           # Platform-agnostic API layer
    └── business-logic/       # Pure TypeScript, no UI
```

**Khi dùng**: Organization deploy cùng product trên web + mobile + desktop. Ví dụ: Linear, Figma, Notion.

**Tradeoffs**: Platform team ownership là rõ; nhưng shared/ vẫn là chung, cần governance.

> 🇻🇳 **Tóm tắt**: Layout phổ biến nhất là apps/ + packages/ — rõ ràng, dễ onboard. Domain-driven tốt cho large teams (5+) với vertical slice ownership. Flat packages/ cho open-source library authors. Platform-based khi deploy cùng sản phẩm trên web/mobile/desktop.

---

## Part 2: Build Orchestration & Caching / Orchestration & Caching

### Task Graph vs File Graph / Đồ Thị Task vs Đồ Thị File

Hai model caching trong monorepo tools:

**Task graph** (Turborepo, Nx):

- Mỗi package có tasks: `build`, `test`, `lint`, `typecheck`
- Turborepo xây dựng **DAG (Directed Acyclic Graph)** của tasks: `web#build` → phụ thuộc vào `ui#build` → phụ thuộc vào `types#build`
- Cache key = hash của: inputs (source files) + task definition + environment variables
- Nếu cache hit: skip hoàn toàn, copy output từ cache

**File graph** (Bazel):

- Mỗi file có hash
- Build graph dựa trên file-level dependencies (granular hơn)
- Hermetic: build environment hoàn toàn isolated, reproducible
- Phù hợp cho polyglot (Go binary depend on TypeScript types)

### Content-Addressable Caching / Cache Dựa Trên Content Hash

```
Turborepo cache key calculation:
┌─────────────────────────────────────────────────────┐
│  Hash inputs:                                       │
│  • Source files matching "inputs" glob              │
│  • package.json dependencies                        │
│  • turbo.json pipeline definition                   │
│  • Environment variables listed in "env"            │
│  • OS + Node.js version (optional)                  │
├─────────────────────────────────────────────────────┤
│  Cache key = SHA-256 of all above                   │
├─────────────────────────────────────────────────────┤
│  On cache HIT:                                      │
│  • Restore "outputs" from cache (dist/, .next/, etc)│
│  • Skip task execution entirely                     │
│  • Replay logs (shows what would have run)          │
├─────────────────────────────────────────────────────┤
│  On cache MISS:                                     │
│  • Execute task                                     │
│  • Store outputs + logs to cache                   │
└─────────────────────────────────────────────────────┘
```

### Remote Cache / Cache Từ Xa

Không có remote cache → cache chỉ tồn tại trên máy local hoặc một CI machine. Mỗi fresh CI runner không có gì.

Với remote cache → CI runner 1 builds `ui` → uploads to S3/Vercel/Nx Cloud → CI runner 2 trên PR khác skip `ui` nếu không có thay đổi.

```
CI pipeline với remote cache:
PR #101 (changes: apps/web only)
  ├── packages/types: CACHE HIT  ← restored from S3 in 2s
  ├── packages/ui:    CACHE HIT  ← restored from S3 in 3s
  ├── packages/utils: CACHE HIT  ← restored from S3 in 1s
  └── apps/web:       CACHE MISS ← build runs (45s)
  Total: ~51s instead of ~180s (3 packages)

Without remote cache:
  ├── packages/types: build (30s)
  ├── packages/ui:    build (60s)  ← builds even if unchanged
  ├── packages/utils: build (20s)  ← builds even if unchanged
  └── apps/web:       build (45s)
  Total: ~155s
```

**Remote cache options:**

| Option                  | Setup            | Cost                       | Notes                                           |
| ----------------------- | ---------------- | -------------------------- | ----------------------------------------------- |
| Vercel Remote Cache     | Zero config      | Free (with Vercel account) | Turborepo-native, best DX for Turbo             |
| Nx Cloud                | nx-cloud token   | Free tier / paid           | Deep Nx integration, distributed task execution |
| Self-hosted S3/Minio    | ~20 lines config | Infrastructure cost only   | Full control, no vendor lock-in                 |
| Turborepo custom remote | API compatible   | Your infra                 | Implement the Turborepo remote cache protocol   |

### "Affected" Detection / Phát Hiện Package Bị Ảnh Hưởng

**Turborepo `--filter`:**

```bash
# Run build only for packages affected by changes in current branch
# compared to main
turbo run build --filter=...[origin/main]

# What this does:
# 1. git diff HEAD..origin/main → list changed files
# 2. Map changed files to their packages
# 3. Include dependents (packages that depend on changed packages)
# 4. Run tasks only for affected set
```

**Nx `affected`:**

```bash
# Nx tracks project graph + git history
nx affected --target=build --base=origin/main

# nx.json defines "affected" strategy:
# "implicitDependencies" maps root files → all projects
# projectGraph maps imports → dependencies
# → more precise than Turborepo's file-based approach
```

```json
// nx.json - affected detection configuration
{
  "affected": {
    "defaultBase": "main"
  },
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "sharedGlobals": ["{workspaceRoot}/tsconfig.base.json", "{workspaceRoot}/.eslintrc.json"]
  }
}
```

> 🇻🇳 **Tóm tắt**: Turborepo/Nx dùng task graph DAG để xác định thứ tự build và cache. Cache key = hash của source files + deps + config. Remote cache (Vercel/Nx Cloud/S3) cho phép CI runners share cache với nhau — Vercel báo cáo tiết kiệm 80% CI time. "Affected" detection chỉ build packages có thay đổi (và dependents của chúng).

---

## Part 3: Real Config Examples / Cấu Hình Thực Tế

### pnpm-workspace.yaml

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
  - "domains/**"
  # Exclude examples and test fixtures
  - "!**/test-fixtures/**"
  - "!**/examples/**"
```

### turbo.json

```json
// turbo.json (Turborepo v2 syntax)
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["src/**", "package.json", "tsconfig.json"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "inputs": ["src/**", "test/**", "*.test.ts", "vitest.config.ts"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "inputs": ["src/**", ".eslintrc.*", "eslint.config.*"],
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "inputs": ["src/**", "tsconfig.json", "tsconfig.base.json"],
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  },
  "globalEnv": ["NODE_ENV", "NEXT_PUBLIC_API_URL"],
  "remoteCache": {
    "enabled": true
  }
}
```

Key notes về `turbo.json`:

- `"^build"` = "run `build` in all dependencies first" (topological order)
- `inputs` = file globs that affect this task's cache key
- `outputs` = what to restore from cache on hit
- `"cache": false` on `dev` = never cache dev server
- `"persistent": true` = long-running process (dev server)

### nx.json

```json
// nx.json (Nx 17+)
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"],
      "cache": true
    },
    "test": {
      "inputs": ["default", "^production", "{workspaceRoot}/vitest.config.ts"],
      "cache": true
    },
    "lint": {
      "inputs": ["default", "{workspaceRoot}/.eslintrc.json"],
      "cache": true
    }
  },
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": [
      "default",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json"
    ],
    "sharedGlobals": ["{workspaceRoot}/tsconfig.base.json"]
  },
  "nxCloudId": "your-cloud-id",
  "defaultBase": "main"
}
```

### tsconfig.base.json with Project References

```json
// tsconfig.base.json (root)
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "composite": true,
    "incremental": true,
    "paths": {
      "@org/ui": ["./packages/ui/src/index.ts"],
      "@org/types": ["./packages/types/src/index.ts"],
      "@org/utils": ["./packages/utils/src/index.ts"],
      "@org/config/*": ["./packages/config/*/index.ts"]
    }
  }
}
```

```json
// apps/web/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "references": [
    { "path": "../../packages/ui" },
    { "path": "../../packages/types" },
    { "path": "../../packages/utils" }
  ],
  "include": ["src/**/*", "next-env.d.ts"]
}
```

```json
// packages/ui/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "references": [{ "path": "../types" }],
  "include": ["src/**/*"]
}
```

> 🇻🇳 **Tóm tắt**: `pnpm-workspace.yaml` khai báo globs cho packages. `turbo.json` định nghĩa task pipeline với `dependsOn`, `inputs`, `outputs` để Turborepo build đúng thứ tự và cache đúng. `tsconfig.base.json` có `paths` mapping cho IDE resolution; từng package's `tsconfig.json` dùng `references` để TypeScript check incremental.

---

## Part 4: Cross-Package Dependencies / Phụ Thuộc Giữa Packages

### workspace:\* Protocol

```json
// apps/web/package.json
{
  "name": "@org/web",
  "dependencies": {
    "@org/ui": "workspace:*",
    "@org/types": "workspace:*",
    "@org/utils": "workspace:^0.1.0"
  }
}
```

`workspace:*` = luôn dùng version local trong monorepo, không look up npm registry. khi publish (nếu cần), pnpm tự động thay thế bằng version thực.

### Build vs No-Build Packages / Package Cần Build vs Không Cần Build

**No-build packages** (simpler, recommended khi có thể):

```json
// packages/types/package.json — no-build approach
{
  "name": "@org/types",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "require": "./src/index.ts",
      "types": "./src/index.ts"
    }
  },
  "scripts": {
    "typecheck": "tsc --noEmit"
  }
}
```

Consumers import trực tiếp `src/index.ts` — bundler (Vite, webpack, Next.js) handle compilation. Không cần `dist/`. Nhanh hơn trong dev, nhưng chỉ hoạt động khi consumers là bundled apps (không phải raw Node.js scripts).

**Build packages** (cần khi publish ra npm hoặc consumers là Node.js scripts):

```json
// packages/ui/package.json — build approach
{
  "name": "@org/ui",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./button": {
      "import": "./dist/button.mjs",
      "require": "./dist/button.js",
      "types": "./dist/button.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts"
  }
}
```

### ESM-only vs CJS Interop Hell

Vấn đề thực tế 2024–2026: Next.js App Router yêu cầu ESM cho Server Components; một số packages cũ chỉ có CJS; Jest mặc định là CJS.

Giải pháp:

```json
// packages/ui/package.json — dual output với tsup
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs", // ESM for Next.js/Vite
      "require": "./dist/index.js", // CJS for Jest/Node scripts
      "types": "./dist/index.d.ts"
    }
  }
}
```

```ts
// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: true, // Code splitting cho ESM (tree-shaking)
  clean: true,
  external: ["react", "react-dom"], // Peer deps không bundle
});
```

> 🇻🇇 **Tóm tắt**: `workspace:*` = luôn dùng local package, không npm registry. No-build packages (chỉ `src/`) đơn giản hơn nhưng chỉ cho bundled consumers. Build packages cần khi publish npm hoặc Node.js consumers. Dual ESM+CJS output (dùng tsup) giải quyết interop issues.

---

## Part 5: CI/CD at Scale / CI/CD Quy Mô Lớn

### Affected-Only PR Builds

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # ← IMPORTANT: Turborepo/Nx need git history

      - uses: pnpm/action-setup@v3
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - run: pnpm install --frozen-lockfile

      # Turborepo: only run tasks for packages affected by this PR
      - run: pnpm turbo run build test lint --filter=...[origin/main]
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

### Parallel Matrix Execution

Với 50+ packages, một job CI vẫn chạy chúng sequentially. Matrix execution chạy song song:

```yaml
# Nx: distributed task execution via Nx Cloud
jobs:
  nx-agents:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - run: npx nx-cloud start-ci-run --distribute-on="5 linux-medium-js"
      - run: npx nx affected --target=build,test,lint --parallel=3

# Turborepo: manual sharding
jobs:
  build:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - run: pnpm turbo run build --filter=...[origin/main] --concurrency=4
        # Each runner picks up available tasks from shared queue
```

### Deploy-on-Affect: Vercel ignoreBuildStep Pattern

```bash
# vercel-ignore-build-step.sh
# Called by Vercel before each deployment
# Exit 0 = proceed with build
# Exit 1 = ignore/skip this deployment

#!/bin/bash
echo "Checking if apps/web has changed..."

# Check if any file in apps/web or its dependencies changed
# relative to the last Vercel deployment
npx turbo-ignore apps/web

# turbo-ignore exits 1 (skip) if no changes in apps/web
# or its transitive dependencies; exits 0 (build) otherwise
```

```json
// vercel.json for apps/web
{
  "ignoreCommand": "npx turbo-ignore"
}
```

Kết quả: Vercel chỉ redeploy `apps/web` khi `apps/web` hoặc `packages/ui` hoặc `packages/types` (dependencies của nó) thực sự thay đổi.

### GitHub Actions Concurrency Limits

Tại 50+ packages, GitHub Actions runner limits trở thành bottleneck:

```yaml
# Optimize: batch small packages, parallelize large ones
jobs:
  lint-and-typecheck:
    # All packages — fast, parallelizable
    runs-on: ubuntu-latest
    steps:
      - run: pnpm turbo run lint typecheck --parallel=20 --filter=...[origin/main]

  build-packages:
    runs-on: ubuntu-latest
    steps:
      - run: pnpm turbo run build --filter=...[origin/main] --filter=./packages/**

  build-apps:
    needs: build-packages
    strategy:
      matrix:
        app: [web, admin, docs]
    runs-on: ubuntu-latest
    steps:
      - run: pnpm turbo run build --filter=apps/${{ matrix.app }}
```

> 🇻🇳 **Tóm tắt**: `--filter=...[origin/main]` chỉ build/test packages có thay đổi so với main. `fetch-depth: 0` bắt buộc phải có để Turborepo/Nx đọc git history. Remote cache (Turbo Token) cho phép runners share cache. Vercel `turbo-ignore` = chỉ redeploy app khi chính nó hoặc deps của nó thay đổi. Matrix execution cho parallel build jobs tại scale lớn.

---

## Part 6: Boundaries & Ownership / Ranh Giới & Quyền Sở Hữu

### Module Boundaries với Nx Tags

```json
// apps/web/project.json (Nx)
{
  "name": "web",
  "tags": ["scope:web", "type:app"]
}

// packages/ui/project.json
{
  "name": "ui",
  "tags": ["scope:shared", "type:ui-lib"]
}

// domains/catalog/ui/project.json
{
  "name": "catalog-ui",
  "tags": ["scope:catalog", "type:feature"]
}
```

```json
// .eslintrc.json — enforce boundaries
{
  "rules": {
    "@nx/enforce-module-boundaries": [
      "error",
      {
        "depConstraints": [
          {
            "sourceTag": "type:app",
            "onlyDependOn": ["type:feature", "type:ui-lib", "type:util"]
          },
          {
            "sourceTag": "type:feature",
            "onlyDependOn": ["type:ui-lib", "type:util"]
          },
          {
            "sourceTag": "scope:catalog",
            "notDependOn": ["scope:cart"]
          }
        ]
      }
    ]
  }
}
```

Kết quả: ESLint lỗi nếu `catalog` feature cố import từ `cart` — ngăn circular hoặc cross-domain deps tại lint time, không phải runtime.

### ESLint Import Restrictions (Turborepo-friendly)

```js
// eslint.config.mjs (root)
import { defineConfig } from "eslint/config";
import importPlugin from "eslint-plugin-import";

export default defineConfig([
  {
    plugins: { import: importPlugin },
    rules: {
      // No cross-app imports
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./apps/web",
              from: "./apps/admin",
              message: "Web app cannot import from admin app",
            },
          ],
        },
      ],
    },
  },
]);
```

### CODEOWNERS

```
# .github/CODEOWNERS

# Root config — platform team owns everything structural
/turbo.json                     @org/platform-team
/pnpm-workspace.yaml            @org/platform-team
/tsconfig.base.json             @org/platform-team
/.github/workflows/             @org/platform-team

# Design system — design-system team
/packages/ui/                   @org/design-system-team

# Apps — individual product teams
/apps/web/                      @org/web-team
/apps/admin/                    @org/admin-team
/apps/docs/                     @org/docs-team

# Domain packages — domain teams
/domains/catalog/               @org/catalog-team
/domains/cart/                  @org/cart-team
/domains/checkout/              @org/checkout-team

# Shared packages — any team can read, platform approves changes
/packages/types/                @org/platform-team @org/web-team
/packages/utils/                @org/platform-team
```

### Political Resistance / Kháng Cự Chính Trị

Đây là thực tế bị underestimated trong phỏng vấn — mention nó sẽ tạo senior signal:

- **"Anyone can touch my code"**: Teams quen autonomous repos sẽ lo ngại. Giải pháp: CODEOWNERS + branch protection, không phải technicality.
- **"Who approves monorepo changes?"**: Cần platform team hoặc guild-based governance cho shared infrastructure.
- **"Our release cadence is different"**: Monorepo không bắt buộc single release train — Nx/Turborepo hỗ trợ independent versioning per package.
- **"Our CI was fast before"**: Migrate dần, không dump toàn bộ vào monorepo overnight.

> 🇻🇳 **Tóm tắt**: Nx tags + `@nx/enforce-module-boundaries` enforce cross-domain deps tại lint time. ESLint import restrictions cho Turborepo-based repos. CODEOWNERS chia ownership theo folder — mỗi team chỉ review PR của mình. Political resistance là thực tế: CODEOWNERS + governance process quan trọng hơn tooling để overcome nó.

---

## Part 7: Migration Guide / Hướng Dẫn Di Chuyển

### Phase 1: Foundations (Week 1–2)

```bash
# 1. Create root workspace
mkdir my-monorepo && cd my-monorepo
git init

# 2. Root package.json (private — never published)
cat > package.json << 'EOF'
{
  "name": "@org/root",
  "private": true,
  "packageManager": "pnpm@9.0.0",
  "engines": { "node": ">=20.0.0" }
}
EOF

# 3. pnpm workspace config
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
EOF

# 4. Install Turborepo
pnpm add -Dw turbo

# 5. Initial turbo.json
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "test": { "dependsOn": ["^build"] },
    "lint": {},
    "dev": { "cache": false, "persistent": true }
  }
}
EOF

# 6. Shared TypeScript base
cat > tsconfig.base.json << 'EOF'
{
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ES2022"
  }
}
EOF
```

### Phase 2: Import Apps (Week 3–6)

```bash
# Move first app into monorepo
mkdir -p apps
# Copy repo into apps/ (preserve git history with subtree)
git subtree add --prefix=apps/web git@github.com:org/web.git main --squash

# Update app's package.json
cd apps/web
# Add workspace:* deps for shared packages
pnpm add @org/types@workspace:*

# Verify build still works
cd ../..
pnpm turbo run build --filter=apps/web
```

### Phase 3: Extract Shared Code → Packages

```bash
# Create shared types package
mkdir -p packages/types/src
cat > packages/types/package.json << 'EOF'
{
  "name": "@org/types",
  "version": "0.0.1",
  "private": true,
  "exports": {
    ".": { "import": "./src/index.ts", "types": "./src/index.ts" }
  }
}
EOF

# Move shared types from apps/web/src/types/ to packages/types/src/
mv apps/web/src/types/user.ts packages/types/src/
mv apps/web/src/types/api.ts packages/types/src/

# Create index.ts
cat > packages/types/src/index.ts << 'EOF'
export * from './user';
export * from './api';
EOF

# Update apps/web to import from workspace
# Before: import { User } from '../types/user'
# After:  import { User } from '@org/types'
```

### Phase 4: Kill Source Repos (After Stabilization)

```bash
# Archive old repos (don't delete — preserve history)
# In each old repo:
git tag archive/pre-monorepo-migration
git push --tags

# Add redirect notice to old repo README
echo "# ARCHIVED — Moved to github.com/org/monorepo/apps/web" > README.md
git add README.md && git commit -m "chore: archive - moved to monorepo"

# Update all internal tooling, CI links, documentation
```

### Lerna → Turborepo Migration

```bash
# Most Lerna users: replace lerna with turbo + keep pnpm workspaces

# 1. Remove Lerna
pnpm remove lerna -w

# 2. Add Turborepo
pnpm add -Dw turbo

# 3. Replace lerna.json with turbo.json
# lerna.json "scripts" → turbo.json "tasks"

# 4. Replace Lerna commands in CI:
# Before: npx lerna run build --since=origin/main --include-dependents
# After:  pnpm turbo run build --filter=...[origin/main]

# 5. For version publishing (if needed, keep @lerna/version):
pnpm add -Dw @lerna/version
# But use turbo for tasks, lerna only for npm versioning/publishing
```

> 🇻🇳 **Tóm tắt**: Migration 4 phase: (1) Foundations — root package.json, pnpm-workspace.yaml, turbo.json, tsconfig.base.json. (2) Import apps — dùng git subtree để preserve history. (3) Extract shared code thành packages/ — cập nhật imports sang workspace:\*. (4) Archive old repos sau khi stabilize. Lerna → Turborepo: remove lerna, add turbo, translate task config.

---

## Part 8: Interview Q&A / Câu Hỏi Phỏng Vấn

---

### 🟡 Q1: What is the difference between a monorepo and a multi-repo? / Monorepo vs multi-repo khác nhau thế nào?

**A:**

A **monorepo** is a single Git repository containing multiple packages or applications that share tooling, configuration, and often CI pipeline. A **multi-repo** (or polyrepo) is multiple separate Git repositories, one per service or package.

The critical differences:

| Dimension           | Monorepo                                                    | Polyrepo                                                  |
| ------------------- | ----------------------------------------------------------- | --------------------------------------------------------- |
| Atomic changes      | One PR can change UI library + all consuming apps           | Requires coordinating PRs across repos                    |
| Dependency versions | All packages use `workspace:*` — always in sync             | Version drift: app A on `ui@2.1`, app B still on `ui@1.9` |
| CI config           | One CI pipeline, one config file to maintain                | N repos × CI configs — drift over time                    |
| TypeScript refactor | Rename an interface → TypeScript finds all usages in one go | Cannot find usages across repos without external tooling  |
| Clone cost          | One large clone vs many small ones                          | Small individual clones                                   |
| Ownership           | Requires explicit CODEOWNERS + boundaries                   | Natural ownership via repo boundaries                     |

The real question in interviews: **"What pain are you solving?"** Monorepo solves version drift, duplicated CI, and sync cost. It introduces CI scale complexity and ownership ambiguity.

Vietnamese: Monorepo = một Git repo chứa nhiều packages/apps, chia sẻ tooling và CI. Polyrepo = nhiều repos riêng. Monorepo cho phép atomic changes, single source of truth cho shared code, không version drift. Polyrepo tự nhiên có ownership boundaries nhưng gây version drift và duplicated CI config.

**💡 Interview Signal:**

- ✅ Strong: Leads with "what pain does each solve?", gives concrete version drift example, mentions atomic changes as key advantage, acknowledges monorepo needs explicit ownership tooling
- ❌ Weak: "Monorepo = one repo, polyrepo = many repos" — definition without tradeoff analysis

---

### 🟡 Q2: When does pnpm workspaces alone become insufficient — when do you need Turborepo/Nx? / Khi nào pnpm workspace không đủ — cần Turborepo/Nx?

**A:**

pnpm workspaces handles **package linking and installation** — it creates symlinks so `@org/ui` resolves to `packages/ui/src`. That's all it does.

It becomes insufficient when you need:

**1. Build orchestration with correct dependency order.** `pnpm -r run build` runs in dependency order, but it's sequential within each level — no parallelism within the same "layer." Turborepo runs all independent tasks in parallel.

**2. Caching.** pnpm has no task-level cache. If `packages/types` didn't change, pnpm still re-runs `tsc`. Turborepo/Nx skip unchanged tasks via content hash cache.

**3. Affected detection.** pnpm `-r` doesn't know which packages changed since `main`. You'd manually filter — Turborepo's `--filter=...[origin/main]` automates this.

**4. Remote cache.** pnpm has no concept of sharing build outputs across CI machines.

**The threshold**: pnpm alone is fine for 2–3 packages with fast build times. At 5+ packages with build times > 30s each, the total CI time without caching becomes painful. At 10+ packages, affected detection becomes necessary.

Vietnamese: pnpm workspace chỉ handle package linking (symlinks). Không có: task caching, parallel execution optimization, affected detection, remote cache. Với 2–3 packages nhỏ: pnpm workspaces một mình đủ. Từ 5+ packages có build time đáng kể: cần Turborepo/Nx để caching và affected detection. Từ 10+ packages: bắt buộc.

**💡 Interview Signal:**

- ✅ Strong: Distinguishes pnpm's role (linking) vs orchestrator's role (caching/parallelism), gives the 5-package threshold with reasoning, mentions remote cache as key CI benefit
- ❌ Weak: "pnpm workspaces is enough for most projects" — ignores the caching gap that becomes critical at scale

---

### 🟡 Q3: How does Turborepo decide what to rebuild? / Turborepo quyết định rebuild gì thế nào?

**A:**

Turborepo uses a **content-addressable cache** with a deterministic hash key. For each task (e.g., `packages/ui#build`), it computes:

```
cache_key = hash(
  source files matching "inputs" glob,
  package.json (version + dependencies),
  turbo.json pipeline definition for this task,
  environment variables listed in "env" and "globalEnv",
  outputs' existence
)
```

If the hash matches a cached entry (local `node_modules/.cache/turbo` or remote), Turborepo:

- Skips execution entirely
- Restores output files from cache (e.g., `dist/`)
- Replays the original task logs

If the hash doesn't match (cache miss), it runs the task and stores outputs.

**The "affected" logic** (`--filter=...[origin/main]`) is a separate step:

1. `git diff HEAD..origin/main` → list changed files
2. Map files → owning packages
3. Walk the package dependency graph upward (dependents)
4. Only run tasks for packages in this affected set

Crucially, even "affected" packages still use cache — if `packages/ui` is affected but its input hash hasn't changed (e.g., unrelated config file changed), it still hits cache.

Vietnamese: Turborepo hash key = hash của source files (theo `inputs` glob) + package.json + turbo.json pipeline + env vars. Cache hit = skip task + restore dist/ từ cache. `--filter=...[origin/main]` là layer riêng: git diff → tìm packages changed → walk dependency graph để tìm dependents → chỉ run tasks cho affected set. Nhưng trong affected set, task vẫn có thể hit cache nếu actual inputs không thay đổi.

**💡 Interview Signal:**

- ✅ Strong: Explains the hash computation (inputs + deps + env), distinguishes "affected" from "cache" as separate mechanisms, notes that affected packages can still hit cache
- ❌ Weak: "Turborepo checks if files changed" — misses the hash-based mechanism and the fact that affected ≠ cache miss

---

### 🟡 Q4: How do you share TypeScript types across packages? / Chia sẻ TypeScript types giữa packages thế nào?

**A:**

Three approaches with different tradeoffs:

**Approach 1: No-build TypeScript package (recommended for internal monorepos)**

```json
// packages/types/package.json
{
  "exports": {
    ".": { "import": "./src/index.ts", "types": "./src/index.ts" }
  }
}
```

Consumers import the `.ts` source directly — bundler transpiles on the fly. No build step needed. Best DX, instant changes visible.

**Approach 2: TypeScript project references**

```json
// tsconfig.base.json: paths map package names to source
{ "paths": { "@org/types": ["./packages/types/src/index.ts"] } }

// apps/web/tsconfig.json: references for TS incremental compilation
{ "references": [{ "path": "../../packages/types" }] }
```

TypeScript's `composite + incremental` mode: `tsc --build` compiles changed packages only. Best for large codebases where `tsc` typecheck is slow.

**Approach 3: Build + publish `.d.ts`**

```bash
# packages/types builds to dist/ with .d.ts files
pnpm turbo run build --filter=packages/types
# consumers use the built output
```

Needed when types package is published to npm for external consumers.

**Recommendation for internal monorepo**: Start with Approach 1 (no-build). Add project references when `typecheck` task becomes slow (> 60s). Only use Approach 3 if you publish packages externally.

Vietnamese: 3 cách chia sẻ types: (1) No-build — export trực tiếp `.ts` source, bundler handle transpile, không cần dist/. (2) TypeScript project references — `tsconfig.json references` + `composite: true`, TypeScript incremental check. (3) Build + .d.ts — cần khi publish npm. Recommend bắt đầu với no-build; thêm project references khi typecheck chậm.

**💡 Interview Signal:**

- ✅ Strong: Knows no-build is possible and simpler, explains when project references add value, knows `composite: true` is required for references
- ❌ Weak: "Create a types package and build it" — skips the simpler no-build option which is better for internal monorepos

---

### 🟡 Q5: What is the cost of remote caching? When does it pay off? / Chi phí của remote cache? Khi nào đáng?

**A:**

**Costs of remote caching:**

1. **Infrastructure**: Either Vercel Remote Cache (free with Vercel account), Nx Cloud ($0–$500+/month), or self-hosted S3 (~$10–50/month for typical usage).
2. **Network overhead**: Cache upload on miss (~50MB for a Next.js build), cache download on hit (~50MB). Adds 30–60s versus pure local but saves 2–10min of build time.
3. **Security consideration**: Build outputs are uploaded to external storage — need to trust the provider or use self-hosted.
4. **Cache invalidation complexity**: Wrong `inputs` config → cache pollution (building with stale outputs). Requires careful config.

**When it pays off:**

The math is simple. If `packages/ui` build takes 90s and there are 10 PRs open simultaneously, without remote cache each runner rebuilds `ui` independently → 10 × 90s = 900s wasted. With remote cache, the first build uploads, the other 9 download in ~15s each → 10 × 15s = 150s, saving 750s.

**Rule of thumb**: Remote cache pays off when:

- Team > 3 engineers (concurrent PRs)
- Any package build > 30s
- CI runs > 20 times/day

Vercel's own data: Teams using Turborepo Remote Cache report **60–80% CI time reduction** on average.

**Self-hosted S3 implementation:**

```json
// turbo.json
{
  "remoteCache": {
    "enabled": true,
    "apiUrl": "https://cache.your-company.com"
  }
}
```

Vietnamese: Chi phí: Vercel Remote Cache miễn phí, Nx Cloud có paid tier, self-hosted S3 ~$10–50/month. Network overhead: upload/download 30–60s thêm. Đáng khi: team > 3 engineers, build > 30s/package, CI chạy > 20 lần/ngày. Vercel báo cáo 60–80% reduction CI time. Tổng chi phí thấp hơn nhiều so với engineer time bị block bởi 30-minute CI.

**💡 Interview Signal:**

- ✅ Strong: Gives the math (concurrent PRs × build time), mentions the break-even conditions, names specific providers with cost ranges, knows self-hosted is an option
- ❌ Weak: "Remote cache makes CI faster" — needs quantification and the trade-off discussion

---

### 🔴 Q6: 5 teams, 12 apps, 30+ packages — would you go monorepo? Defend. / 5 teams, 12 apps, 30+ packages — có nên monorepo không? Bảo vệ quan điểm.

**A:**

**My recommendation: Yes, go monorepo — with conditions.**

First, the diagnostic questions I'd ask:

1. How much code is actually shared across apps? If < 20% of code is shared — shared packages are small utils and types — monorepo benefits are limited.
2. What's the current pain? Version drift? Duplicated CI? Atomic refactors? If teams work completely independently with no shared code, polyrepo may be fine.
3. What's the deploy cadence? 12 apps deploying 5 times/day = 60 deploys/day — affected detection becomes critical.
4. Do teams have strong autonomous culture? Monorepo requires governance buy-in.

**The case for monorepo at this scale:**

5 teams × 12 apps × 30 packages = a web of `workspace:*` dependencies that would be version-drift hell in polyrepo. One breaking change in shared auth types = 8 PRs across repos, manual coordination, inevitable drift.

With monorepo + Turborepo:

- Remote cache cuts CI from ~30min to ~5min (Vercel's numbers support this)
- Atomic refactors across all 12 apps in one PR
- Affected detection: most PRs only rebuild 1–3 apps (not all 12)
- CODEOWNERS ensures teams still have autonomous review control

**The conditions:**

- Need dedicated **platform team** (or guild) to own `turbo.json`, `tsconfig.base.json`, CI workflows
- Need **Nx module boundaries** or ESLint import restrictions to prevent cross-team coupling
- Need **CI budget** for remote cache (Vercel or self-hosted S3)
- Start with `pnpm workspaces + Turborepo` — don't jump to Nx unless code generation or strict boundary enforcement is needed

**When I'd say no:**
If teams truly have no shared code, completely different tech stacks, and independent deploy pipelines — polyrepo is fine and simpler.

Vietnamese: Với 5 teams / 12 apps / 30+ packages — recommend monorepo với điều kiện. Câu hỏi chẩn đoán: shared code bao nhiêu %? Pain hiện tại là gì? Deploy cadence? Team culture? Ở scale này, version-drift trong polyrepo sẽ rất đau. Monorepo + remote cache → CI từ 30 phút → 5 phút. Điều kiện: cần platform team, Nx boundaries, CI budget. Nói không nếu teams không có shared code và hoàn toàn độc lập.

**💡 Interview Signal:**

- ✅ Strong: Asks diagnostic questions first (shared code ratio, pain points), quantifies CI impact, names specific conditions (platform team, boundaries), knows when to say no
- ❌ Weak: "Yes, monorepo is better for large teams" — no qualification, no conditions, no tradeoff analysis

---

### 🔴 Q7: Turborepo vs Nx — pick one for a 2026 startup. Why? / Turborepo vs Nx — chọn gì cho startup 2026?

**A:**

**I'd start with Turborepo, with a clear criteria to migrate to Nx if needed.**

**Turborepo for a 2026 startup:**

Arguments for:

- **Setup time**: `npx create-turbo@latest` → working monorepo in 5 minutes. Nx requires more configuration decisions upfront.
- **Mental model**: `turbo.json` is minimal — tasks, inputs, outputs, dependsOn. No generators, no plugins, no project.json per package by default.
- **Vercel integration**: If using Vercel for deployment (likely for a startup), Remote Cache is zero-config and free.
- **Lower maintenance**: Less framework surface area = fewer things to upgrade and learn.
- **Good enough**: Turborepo handles caching, affected builds, remote cache — the 80% of what you need.

**When to switch to Nx (or add it):**

- Team grows past ~15 engineers and you need **code generation** (scaffold new features consistently)
- You need **strict module boundary enforcement** enforced by the build system rather than convention
- You're on a mixed stack (React + React Native + Node services) and need Nx's polyglot project graph
- You need **distributed task execution** across CI agents (Nx Cloud's DTE is more sophisticated than Turborepo's parallelism)

**The non-choice is Bazel**: For a startup, Bazel is genuinely over-engineered. It requires dedicated build infrastructure engineers to maintain. Reserve for Google-scale problems.

**Concrete setup:**

```bash
# Start here
npx create-turbo@latest my-startup --package-manager pnpm
# Install Nx later if needed:
npx nx@latest init  # Nx can be added to an existing Turbo repo
```

Vietnamese: Cho startup 2026 — bắt đầu với Turborepo. Setup nhanh, mental model đơn giản, Vercel Remote Cache zero-config và miễn phí. Chuyển sang Nx khi cần code generation, strict boundary enforcement, hay distributed task execution cho large team (15+ engineers). Không chọn Bazel — over-engineered cho startup. Turborepo và Nx không loại trừ nhau: có thể migrate từng bước.

**💡 Interview Signal:**

- ✅ Strong: Starts with Turborepo for simplicity, gives concrete criteria for when Nx becomes warranted, knows Nx can be layered onto a Turborepo repo, explicitly rejects Bazel with reasoning
- ❌ Weak: "Nx is more powerful so choose Nx" — ignores startup context and the cost of complexity

---

### 🔴 Q8: How do you prevent circular dependency hell in a 50-package monorepo? / Ngăn circular dependency hell trong 50-package monorepo thế nào?

**A:**

Circular dependencies in a monorepo (`A depends on B, B depends on A`) break build tools, TypeScript incremental compilation, and reasoning about your codebase. Prevention is structural, not reactive.

**Layer 1: Architecture — define a strict dependency direction**

```
ALLOWED dependency direction:
  apps → features → ui-libs → utils → types

FORBIDDEN:
  types → anything (types is a leaf)
  utils → features (utils must not know about features)
  packages/ui → apps/web (packages cannot depend on apps)
```

Document this explicitly. Every package has a "layer" tag.

**Layer 2: Nx module boundaries (automated enforcement)**

```json
// Nx tags + boundary rules
{
  "@nx/enforce-module-boundaries": [
    "error",
    {
      "depConstraints": [
        {
          "sourceTag": "type:app",
          "onlyDependOn": ["type:feature", "type:ui", "type:util", "type:types"]
        },
        { "sourceTag": "type:feature", "onlyDependOn": ["type:ui", "type:util", "type:types"] },
        { "sourceTag": "type:ui", "onlyDependOn": ["type:util", "type:types"] },
        { "sourceTag": "type:util", "onlyDependOn": ["type:types"] },
        { "sourceTag": "type:types", "onlyDependOn": [] }
      ]
    }
  ]
}
```

ESLint fails the PR if any package imports against the direction.

**Layer 3: Madge + CI check**

```bash
# Install madge
pnpm add -Dw madge

# CI step: detect circular deps
npx madge --circular --extensions ts ./packages

# Fail CI if any circular found
npx madge --circular --extensions ts ./packages && echo "No cycles" || exit 1
```

**Layer 4: TypeScript project references enforcement**

`tsc --build` with `composite: true` will error if there's a circular reference between projects — because it cannot determine build order.

**When a circular dep appears anyway:**
Root cause is almost always a package doing too much — contains both `A`'s utility that `B` needs AND uses `B`'s model type. Solution: extract the shared pieces into a new leaf package (`packages/shared-primitives`) that neither A nor B pulls from each other.

Vietnamese: Ngăn circular deps bằng 4 lớp: (1) Architecture: định nghĩa strict dependency direction (apps → features → ui → utils → types, one way only). (2) Nx module boundaries: ESLint error nếu import sai hướng. (3) Madge trong CI: detect và fail build nếu có circular. (4) TypeScript project references: `tsc --build` error nếu circular giữa projects. Khi xuất hiện circular: root cause thường là package làm quá nhiều — extract shared pieces ra leaf package mới.

**💡 Interview Signal:**

- ✅ Strong: Gives the architectural answer (one-directional layers) before tooling, names both Nx boundaries and Madge as complementary solutions, explains the root cause pattern and fix
- ❌ Weak: "Use eslint-plugin-import to prevent cycles" — correct tool but misses the architectural layer

---

### 🔴 Q9: Monorepo vs Micro-frontends — same problem? Different problem? / Monorepo vs Micro-frontends — cùng vấn đề không?

**A:**

**Different problems, different layers. They are orthogonal and can be combined.**

**Monorepo** is a **source management strategy**:

- How is code stored and versioned?
- How do teams share code at build time?
- How is CI orchestrated?
- Lives entirely in the development + build layer.

**Micro-frontends (MFE)** is a **runtime composition strategy**:

- How are separately-deployed frontend apps composed at runtime?
- How do teams ship independently without coordination?
- How does the browser load/compose multiple frontend apps into one UI?
- Lives in the deployment + runtime layer.

```
PROBLEM SPACE MAPPING:

Monorepo solves:
  ✅ Version drift in shared UI library
  ✅ Atomic refactors across apps
  ✅ CI time with caching
  ❌ Does NOT allow teams to deploy independently
  ❌ Does NOT allow runtime composition of separate apps

MFE solves:
  ✅ Team A deploys their feature without coordinating with Team B
  ✅ Different teams use different tech stacks (React + Vue coexist)
  ✅ Runtime code sharing (Module Federation)
  ❌ Does NOT solve version drift in shared libraries
  ❌ Does NOT give you atomic refactors

COMBINATION (advanced):
  Monorepo + MFE = teams develop and share code in one repo,
  but deploy as independent Module Federation remotes.
  Best of both worlds — but high complexity.
```

**Interview framing**: "Can you tell me more about the problem you're solving? If the pain is teams stepping on each other's deployments and needing independent release cadences — that's an MFE problem. If the pain is shared code version drift and CI duplication — that's a monorepo problem. Often both exist together."

Vietnamese: Monorepo và MFE giải quyết HAI vấn đề khác nhau ở hai lớp khác nhau. Monorepo = source management strategy (build time). MFE = runtime composition strategy (deploy time). Monorepo giải quyết version drift + atomic refactors; không giải quyết independent deployment. MFE giải quyết independent deployment + runtime composition; không giải quyết version drift. Có thể kết hợp cả hai: develop trong monorepo, deploy như MFE remotes — nhưng phức tạp cao.

**💡 Interview Signal:**

- ✅ Strong: Clearly states they're orthogonal, maps each to the layer it operates at (build vs runtime), gives the combination option, asks clarifying questions about the actual problem
- ❌ Weak: "Monorepo is an alternative to MFE" — fundamentally wrong, they solve different problems at different layers

---

### 🔴 Q10: How do you ship a breaking change in shared `packages/ui` consumed by 8 apps? / Ship breaking change trong packages/ui dùng bởi 8 apps thế nào?

**A:**

A breaking change in a shared UI library (e.g., renaming `Button`'s `variant` prop, removing deprecated `size="sm"`) consumed by 8 apps is a coordination problem. In a monorepo, you can do this atomically — but it requires a process.

**Strategy 1: Big Bang (works in monorepo, not polyrepo)**

Make the breaking change + fix all 8 consumers in a single PR:

```bash
# 1. Make the change in packages/ui
# e.g., rename prop: isLoading → loading

# 2. Run TypeScript to find all usages
npx tsc --noEmit
# → errors in apps/web, apps/admin, ...

# 3. Fix all usages (automated with codemod if large)
npx jscodeshift -t codemod/rename-prop.ts apps/*/src/**/*.tsx

# 4. Single PR: packages/ui change + all 8 app fixes
# CI runs affected builds — only packages/ui and its dependents
# TypeScript compile validates all 8 apps

# 5. Single merge, zero version drift possible
```

This is the monorepo superpower: atomic breaking changes across all consumers.

**Strategy 2: Deprecation-then-remove (lower risk, multiple PRs)**

```tsx
// packages/ui/src/Button.tsx
interface ButtonProps {
  /** @deprecated Use `loading` instead. Will be removed in 2 sprints. */
  isLoading?: boolean;
  loading?: boolean; // New prop
}

export function Button({ isLoading, loading, ...props }: ButtonProps) {
  const isLoadingState = loading ?? isLoading; // Support both temporarily
  // ...
}
```

1. PR 1: Add new prop + deprecate old (ESLint `no-restricted-syntax` warns on old usage)
2. Each team migrates their app (separate PRs, no rush)
3. PR N+1: Remove old prop once all 8 apps migrated (TypeScript enforces no remaining usages)

**Strategy 3: Versioned exports (escape hatch)**

```json
// packages/ui/package.json
{
  "exports": {
    ".": "./src/index.ts", // Latest (v2 API)
    "./v1-compat": "./src/v1-compat.ts" // V1 compatibility shim
  }
}
```

Apps that can't migrate immediately import from `/v1-compat`. Time-boxed — compatibility shim is deleted after 2 sprints.

**Recommendation**: Default to Strategy 1 (big bang) for small-medium changes — it's the monorepo advantage. Use Strategy 2 for large surface area changes (30+ usages). Strategy 3 only as a last resort (adds maintenance burden).

Vietnamese: 3 strategies cho breaking change trong shared UI: (1) Big bang — thay đổi UI + fix tất cả 8 apps trong một PR atomic (monorepo superpower, CI chỉ build affected). (2) Deprecation-then-remove — thêm prop mới, deprecate cũ, cho teams migrate từng bước, xóa sau 2 sprints. (3) Versioned exports — `/v1-compat` shim cho apps chưa migrate. Recommend: default big bang cho changes nhỏ/vừa; deprecation cho changes có bề mặt lớn.

**💡 Interview Signal:**

- ✅ Strong: Leads with big bang as the monorepo advantage, knows codemod for automated fixes, describes deprecation pattern with timeline, mentions TypeScript as the validator ensuring all usages are fixed before merge
- ❌ Weak: "Bump the version and update each app separately" — defeats the monorepo atomicity advantage; that's polyrepo behavior

---

## Anti-Patterns / Các Lỗi Phổ Biến

### Anti-Pattern 1: Monorepo Without Ownership Boundaries (Free-for-All)

```
❌ Symptom: 50+ packages, no CODEOWNERS, no Nx tags
   Result: Any engineer can modify any package. No accountability.
           "Who broke the Button component?" → nobody knows.
           Teams step on each other's work.

✅ Fix: Add CODEOWNERS immediately at monorepo creation.
        Define package ownership tags (Nx) or path-based ownership.
        "No owner = platform team owns" is a valid default.
```

### Anti-Pattern 2: Bazel for a JS-Only Stack

```
❌ Symptom: 3 React apps, 10 TypeScript packages, decide to use Bazel
            because "Google uses it"
   Result: BUILD files per directory, Starlark rules, remote execution
           setup, 2 months lost on tooling. Engineers confused.
           Gain: hermetic builds nobody needed.

✅ Fix: Turborepo or Nx for JS/TS stacks. Bazel is justified only when:
        - polyglot (Go + TypeScript + Python)
        - dedicated build-eng team
        - determinism more important than developer velocity
        Rule: choose the least powerful tool that solves the problem.
```

### Anti-Pattern 3: No Remote Cache → 30-Minute CI on Every PR

```
❌ Symptom: 20 packages, no remote cache configured
   Timeline on typical PR:
     packages/types:   tsc (30s)    ← unchanged, rebuilt anyway
     packages/utils:   build (45s)  ← unchanged, rebuilt anyway
     packages/ui:      build (90s)  ← unchanged, rebuilt anyway
     apps/web:         build (120s) ← the only thing that changed
   Total: ~285s = nearly 5 minutes
   With 50 PRs/day = 237 minutes of wasted CI compute/day

✅ Fix: Enable Vercel Remote Cache (free) or Nx Cloud.
        Same PR with remote cache:
          packages/types:  CACHE HIT (2s)
          packages/utils:  CACHE HIT (2s)
          packages/ui:     CACHE HIT (3s)
          apps/web:        build (120s)  ← only real work
        Total: ~127s. Saves 158s per PR.
        Break even: ~$5/month S3 self-hosted vs engineer frustration.
```

### Anti-Pattern 4: Tightly Coupled `packages/shared/everything`

```
❌ Symptom: One mega-package: packages/shared/
   Contains: API clients, type definitions, UI components,
             business logic, utility functions, constants, hooks
   Result: Any PR changes packages/shared → all 12 apps must rebuild.
           The "shared" package becomes a dependency attractor:
           nobody wants to create new packages, everything goes in shared.
           shared has 200+ exports, nobody knows what's in it.

✅ Fix: Split by responsibility from day one:
        packages/types/      → only TypeScript interfaces
        packages/ui/         → only visual components
        packages/api-client/ → only API layer
        packages/utils/      → only pure utility functions
        packages/hooks/      → only React hooks
        "If it does two things, split it."
        Smaller packages = more granular cache invalidation.
```

### Anti-Pattern 5: Bumping Package Versions Per-Package in a Monorepo

```
❌ Symptom: Treating monorepo packages like published npm packages.
   packages/ui@1.0.0 → 2.0.0 on every change.
   apps/web manually bumps "version": "2.0.0" in package.json.
   CI enforces version consistency checks.
   Result: All the overhead of npm publishing without the benefit.
           Merge conflicts on version bumps. Teams miss bumps.

✅ Fix: Internal packages should use "version": "0.0.0" (or "0.1.0")
        and "private": true. Consumers use workspace:*.
        Versions only matter if you publish to npm registry.
        For internal-only packages: drop version management entirely.
        Exception: Lerna/changesets for publishing to npm — valid.
```

### Anti-Pattern 6: Monorepo as a Dump for Unrelated Projects

```
❌ Symptom: monorepo contains:
   - 3 React apps (frontend)
   - Go microservices
   - Android app (Kotlin)
   - Marketing email templates (MJML)
   - Company HR scripts (Python)
   Result: CI is a mess. No useful affected detection.
           "Frontend monorepo" includes Go builds nobody understands.

✅ Fix: Monorepo scope = projects that share code and need atomic changes.
        Unrelated projects = separate repos.
        Rule: "Would a breaking change in project A ever need to be
               coordinated with project B?" If no → separate repos.
```

> 🇻🇳 **Tóm tắt**: 6 anti-patterns: (1) Không có boundaries/CODEOWNERS → free-for-all. (2) Bazel cho JS-only stack → overkill. (3) Không remote cache → CI 30 phút mọi PR. (4) packages/shared/everything → dependency attractor, granular caching mất. (5) Bump version per-package cho internal packages → overhead của polyrepo không có benefit. (6) Monorepo chứa unrelated projects (Go + React + Python) → CI hell.

---

## Memory Hook / Ghi Nhớ Nhanh

🧠 **"CART: Cache, Affected, References, Tags"**

- **C**ache: Content-addressable. Hash inputs → skip if unchanged. Add remote cache early.
- **A**ffected: `--filter=...[origin/main]` — only build what changed and its dependents.
- **R**eferences: TypeScript `references` + `composite: true` for incremental type checking.
- **T**ags: Nx tags + module boundaries — enforce ownership at lint time, not PR review time.

And the tool selection rule:

🧠 **"pnpm alone < 5 packages. Turborepo < 50 packages. Nx 50+ or strict boundaries. Bazel: Google scale only."**

---

## Q&A Summary Table / Bảng Tóm Tắt Q&A

| #   | Question                                      | Difficulty | Core Answer                                                                   | Key Differentiator                                         |
| --- | --------------------------------------------- | ---------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1   | Monorepo vs multi-repo?                       | 🟡         | Atomic changes, shared deps, no version drift vs autonomous repos             | Mention tradeoff: monorepo needs explicit ownership tools  |
| 2   | When does pnpm alone become insufficient?     | 🟡         | 5+ packages with > 30s builds — caching & affected detection gap              | Distinguish pnpm role (linking) vs orchestrator (caching)  |
| 3   | How does Turborepo decide what to rebuild?    | 🟡         | Content hash of inputs + deps + env. Cache hit = skip + restore outputs       | Affected ≠ cache miss; they're separate mechanisms         |
| 4   | How to share TypeScript types?                | 🟡         | No-build (export .ts directly) → project references → build + .d.ts           | Recommend no-build first for internal monorepos            |
| 5   | Cost of remote caching? When does it pay off? | 🟡         | Free (Vercel) to $50/month (S3). Pays off at team > 3 + builds > 30s          | Quantify with concurrent PR math                           |
| 6   | 5 teams, 12 apps — monorepo?                  | 🔴         | Yes with conditions: platform team, boundaries, remote cache, CI budget       | Ask diagnostic questions first; give the "when I'd say no" |
| 7   | Turborepo vs Nx for 2026 startup?             | 🔴         | Start Turborepo; criteria to move to Nx (code gen, boundaries, DTE)           | They're not mutually exclusive; Nx can layer onto Turbo    |
| 8   | Prevent circular dependency hell?             | 🔴         | Architecture first (directional layers), then Nx boundaries, then Madge in CI | Root cause: package does too much → extract leaf package   |
| 9   | Monorepo vs Micro-frontends — same problem?   | 🔴         | Different layers: build-time (monorepo) vs runtime (MFE). Can combine.        | Orthogonal; ask which pain to identify the right solution  |
| 10  | Ship breaking change in shared UI → 8 apps?   | 🔴         | Big bang atomic PR (monorepo superpower) or deprecation-then-remove           | Big bang is impossible in polyrepo; that's the advantage   |

---

## Cold Call Simulation / Mô Phỏng Phỏng Vấn Trực Tiếp

**Interviewer**: "We're scaling from 2 teams to 5 teams. Each team will own 2–3 apps and some shared components. Our current setup is 6 separate repos, and we're constantly fighting dependency version drift. Should we consolidate into a monorepo? What would that look like?"

**Strong Answer Framework**:

> "Based on what you described — 5 teams, ~12 apps, shared components, and active version drift — I'd recommend a monorepo. Here's how I'd think through it.
>
> The version drift problem is the clearest signal: shared components in polyrepo means each app bumps the version independently, and they inevitably diverge. In a monorepo with `workspace:*` protocol, all apps always use the current local version — drift is structurally impossible.
>
> For tooling, I'd start with **pnpm workspaces + Turborepo**. Turborepo adds content-hash caching and affected-only builds, which means a PR that only touches `apps/web` doesn't rebuild your shared UI library. With a Vercel Remote Cache (free), CI time typically drops 60–80% compared to a naive monorepo.
>
> The layout I'd recommend: `apps/` for your 12 deployable apps, `packages/` for shared components, types, and utilities. Each team owns their apps via CODEOWNERS.
>
> The risk to plan for: ownership ambiguity. In polyrepo, repo boundaries enforce team separation. In monorepo, you need explicit CODEOWNERS and — if you grow past 20+ packages — Nx module boundary rules to prevent cross-team coupling.
>
> Migration: I'd do it in phases over 8 weeks. Week 1–2: set up root workspace, turbo.json, tsconfig.base. Week 3–6: import each app one at a time using git subtree. Week 7–8: extract shared components into `packages/` and kill the old repos."

---

## Self-Check / Kiểm Tra Bản Thân

Trả lời được các câu sau không cần nhìn notes — nếu không, ôn lại section tương ứng:

- [ ] Explain the difference between monorepo and monolith to a non-technical manager in 2 sentences.
- [ ] What does `"^build"` mean in `turbo.json`'s `dependsOn`?
- [ ] What files does Turborepo hash to compute a cache key? Name 4.
- [ ] When does pnpm workspaces alone become insufficient? Give the threshold with reasoning.
- [ ] What is `workspace:*` and what happens to it at publish time?
- [ ] Draw the `apps/ + packages/` layout from memory with 3 example packages.
- [ ] What is the difference between Turborepo's `--filter=...[origin/main]` and hitting a cache miss?
- [ ] Name 3 conditions under which you'd choose Nx over Turborepo.
- [ ] Explain why Monorepo ≠ Micro-frontends in one sentence each.
- [ ] What is the "big bang" strategy for shipping a breaking change, and why is it only possible in a monorepo?
- [ ] Name 2 remote cache options and their approximate cost.
- [ ] What anti-pattern does `packages/shared/everything` create?

> 🇻🇳 **Hướng dẫn tự kiểm tra**: Nếu không trả lời được fluent — không nhìn notes — thì ôn lại phần tương ứng. Đặc biệt chú ý: (1) phân biệt monorepo/monolith/MFE (hay bị confuse), (2) `^build` syntax trong turbo.json, (3) khi nào pnpm alone không đủ, (4) big bang strategy cho breaking changes.

---

_Sources: Frontend Masters Handbook 2024 §6.40 · Turborepo documentation (turbo.build) · Nx documentation (nx.dev) · Vercel Remote Cache documentation · Google Bazel documentation · pnpm workspace documentation · Moon (moonrepo.dev) · Rush (rushjs.io) · Shopify Hydrogen architecture docs · "Monorepos in the Wild" — 2024 State of JS survey data_
