# Semantic Versioning & Versioning Strategies / Semantic Versioning và Chiến Lược Versioning

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **Prerequisites**: [FE System Design Overview](./00-fe-system-design-overview.md), npm/yarn package management basics
> **See also**: [Monorepo Architecture](./10-monorepo-architecture.md) | [CI/CD for Frontend](./09-cicd-frontend.md) | [Component Library Design](./11-component-library-design.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Interviewer hỏi: _"Your team just pushed a 'minor' version bump to your internal UI library — `1.4.0` to `1.5.0`. Three downstream apps broke in production. What went wrong, and how do you prevent this?"_

Hầu hết ứng viên trả lời: _"The developer made a mistake and should have bumped to `2.0.0`."_ Đây là câu trả lời đúng nhưng chưa đủ. Một Senior Engineer sẽ đi sâu hơn: TypeScript **type narrowing** behavior đã thay đổi cho một prop tuy vẫn compiles — đây là **behavioral breaking change không phải API breaking change**. Công cụ automated như `arethetypeswrong` hoặc `api-extractor` không bắt được nó. Và quan trọng hơn: **tại sao lockfile của downstream apps lại không bảo vệ họ?** Vì `^1.4.0` cho phép npm tự động resolve lên `1.5.0`.

Câu chuyện này gói gọn toàn bộ lý do tại sao biết **versioning deeply** là senior signal: nó không chỉ là `MAJOR.MINOR.PATCH` — mà là toàn bộ hệ sinh thái xung quanh contract, range operators, lockfile semantics, và automated detection.

---

## What & Why / Cái Gì & Tại Sao

**Semantic Versioning (SemVer)** = quy ước đặt tên version theo format `MAJOR.MINOR.PATCH` với ngữ nghĩa cụ thể. Mỗi segment mang một cam kết rõ ràng với người dùng thư viện.

```
SemVer contract (simplified):
PATCH bump (1.0.0 → 1.0.1): backward-compatible bug fix
MINOR bump (1.0.0 → 1.1.0): new backward-compatible feature
MAJOR bump (1.0.0 → 2.0.0): breaking change — callers must update
```

**Tại sao SemVer quan trọng với Frontend?**

→ **Why?** npm ecosystem có >2.5 triệu packages. Không có ngữ nghĩa version, dependency resolution trở thành roulette — bất kỳ update nào có thể phá vỡ app.
→ **Why?** Component libraries ship public API surfaces (props, CSS class names, exported types) — callers cần biết khi nào cần thay đổi code.
→ **Why?** Monorepos với nhiều packages phải coordinate version bumps — Lerna/Changesets depend on SemVer để tự động hóa CHANGELOG và publish.
→ **Why?** CDN versioning (e.g., `https://cdn.example.com/lib/1.5.0/lib.min.js`) cần version stability guarantees để browsers cache safely.

---

## Concept Map / Bản Đồ Khái Niệm

```
VERSIONING ECOSYSTEM
│
├── SEMVER SPEC (semver.org)
│   ├── MAJOR.MINOR.PATCH
│   ├── Pre-release tags: 1.0.0-alpha.1, 1.0.0-beta.2, 1.0.0-rc.1
│   ├── Build metadata: 1.0.0+20231015 (ignored in precedence)
│   └── Precedence: 1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-beta < 1.0.0-rc.1 < 1.0.0
│
├── NPM RANGE OPERATORS
│   ├── Caret ^: allows MINOR+PATCH, pins MAJOR (^1.4.0 → >=1.4.0 <2.0.0)
│   ├── Tilde ~: allows PATCH only (  ~1.4.0 → >=1.4.0 <1.5.0)
│   ├── Exact: "1.4.0" (only this version)
│   ├── Ranges: ">=1.4.0 <2.0.0"
│   └── x-ranges: "1.x", "1.4.x", "*"
│
├── LOCKFILES
│   ├── package-lock.json (npm)
│   ├── yarn.lock (Yarn)
│   ├── pnpm-lock.yaml (pnpm)
│   └── Purpose: pin exact resolved version despite range in package.json
│
├── VERSIONING STRATEGIES
│   ├── SemVer      — MAJOR.MINOR.PATCH semantics
│   ├── CalVer      — YYYY.MM.MICRO (Ubuntu, Next.js)
│   ├── ZeroVer     — 0.x.x forever (pre-1.0 stability signal)
│   └── Hash-based  — content-addressed (Nix, Deno modules)
│
├── BREAKING CHANGE DETECTION
│   ├── API surface: exported symbols, prop types, function signatures
│   ├── TypeScript types: structural changes that appear minor
│   ├── Behavioral: same API, different observable output
│   └── Tools: api-extractor, arethetypeswrong, publint
│
├── MONOREPO VERSIONING
│   ├── Fixed mode:       all packages same version (Lerna fixed)
│   ├── Independent mode: each package versions independently
│   ├── Changesets:       intent-based workflow (preferred 2024+)
│   └── Nx Release:       Nx-native automated versioning
│
├── AUTOMATION
│   ├── Conventional Commits → automated SemVer bumps
│   ├── Renovate / Dependabot → automated dependency PRs
│   └── Changesets CI → automated publish on merge
│
├── NPM DIST-TAGS
│   ├── latest:  stable, default install target
│   ├── next:    pre-release (RC)
│   ├── canary:  nightly / alpha builds
│   └── beta:    public beta testing
│
└── FRONTEND-SPECIFIC CONCERNS
    ├── Bundled deps: tree-shaking, peer vs direct vs dev
    ├── CDN versioning: immutable URLs, cache invalidation
    ├── CSS class name stability: public API for component libraries
    └── Peer dependency hell + resolutions/overrides
```

---

## Comparison Matrix / Bảng So Sánh

| Strategy        | Format Example           | Who uses it                          | Stability signal                   | Breaking change model           | Tooling support        | When to use                                      |
| --------------- | ------------------------ | ------------------------------------ | ---------------------------------- | ------------------------------- | ---------------------- | ------------------------------------------------ |
| **SemVer**      | `1.5.2`, `2.0.0-rc.1`    | npm ecosystem, most OSS libs         | Clear: MAJOR = breaks              | MAJOR bump required             | Excellent (npm, pnpm)  | Any library with public API                      |
| **CalVer**      | `24.04`, `2024.1.0`      | Ubuntu, Next.js (`14.0.0` ← hybrid)  | Time-based: freshness visible      | Any release can break           | Moderate               | Platform software, infrequent users              |
| **ZeroVer**     | `0.47.0`, `0.102.3`      | Tailwind CSS (pre-v1), older tooling | No stability guarantee implied     | Any bump can break              | Same as SemVer tools   | Early-stage / "no stability promise yet"         |
| **Hash-based**  | `sha256-abc123`          | Nix, Deno module URLs                | Content-addressed: immutable       | New hash = new content          | Ecosystem-specific     | Reproducible builds, security-critical           |
| **Fixed mono**  | All pkgs `2.4.0`         | Babel, Jest (historically)           | Simple: one version = whole system | MAJOR for any breaking anywhere | Lerna, Nx Release      | Tightly coupled monorepo packages                |
| **Independent** | `pkg-a@1.2`, `pkg-b@4.0` | Nx workspaces, large monorepos       | Per-package                        | Per-package MAJOR               | Changesets, Nx Release | Loosely coupled packages with different cadences |

---

## Part 1: SemVer Specification Deep Dive / Đặc Tả SemVer Chuyên Sâu

### Section 1.1: MAJOR.MINOR.PATCH Contract / Hợp Đồng Phiên Bản

SemVer (semver.org) không chỉ là format — nó là **hợp đồng công khai** với người dùng thư viện của bạn.

```
PATCH: 1.0.0 → 1.0.1
  - Bug fixes only
  - No new public API
  - No behavior changes
  - Callers: safe to auto-upgrade

MINOR: 1.0.0 → 1.1.0
  - New features, backward-compatible
  - New exports, new optional props
  - Deprecated (but not removed) API
  - Callers: safe to auto-upgrade, new features opt-in

MAJOR: 1.0.0 → 2.0.0
  - Breaking changes
  - Removed or renamed exports
  - Changed required prop signatures
  - Changed behavior of existing features
  - Callers: must read CHANGELOG, may need code changes
```

**Phần quan trọng hay bị bỏ qua**: khi MAJOR = 0 (ZeroVer / pre-1.0), **MINOR có thể chứa breaking changes**. Đây là convention được semver.org ghi rõ — `0.x.y` không đảm bảo backward compatibility ở MINOR bumps.

---

### Section 1.2: Pre-release Tags and Build Metadata / Tag Pre-release và Build Metadata

```
Format: MAJOR.MINOR.PATCH-PRERELEASE+BUILDMETA

Examples:
  1.0.0-alpha            alpha: very early, APIs likely to change
  1.0.0-alpha.1          alpha iteration 1
  1.0.0-beta.3           beta: feature-complete, API stabilizing
  1.0.0-rc.1             rc (release candidate): production-ready candidate
  1.0.0                  stable release
  1.0.0+20231015.build42 build metadata: ignored in precedence sorting
```

**Precedence ordering** (thấp → cao):

```
1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-alpha.beta < 1.0.0-beta < 1.0.0-beta.2 < 1.0.0-beta.11 < 1.0.0-rc.1 < 1.0.0
```

Lưu ý: `beta.11 > beta.2` vì numeric identifiers so sánh theo giá trị số (11 > 2), không phải lexicographic.

**npm dist-tags map to pre-release:**

```bash
# Publish stable:
npm publish --tag latest         # npm install my-lib  ← installs this

# Publish pre-release:
npm publish --tag next           # npm install my-lib@next
npm publish --tag canary         # npm install my-lib@canary
npm publish --tag beta           # npm install my-lib@beta

# Check all dist-tags:
npm dist-tag ls my-lib
# Output:
# latest: 1.5.0
# next: 2.0.0-rc.1
# canary: 2.0.0-canary.20231015
# beta: 2.0.0-beta.3
```

**Frontend library workflow**: Next.js dùng `canary` tag cho nightly builds, `rc` tag cho release candidates, `latest` cho stable. Consumers có thể pin `next` để test upcoming features trước production release.

---

### Section 1.3: npm Range Operators / Các Toán Tử Range

Hiểu range operators là **critical** — chúng quyết định package nào thực sự được install.

```
CARET ^ (most common in package.json):
  ^1.4.2  → >=1.4.2 <2.0.0    (pins MAJOR, allows MINOR + PATCH)
  ^0.4.2  → >=0.4.2 <0.5.0    (ZeroVer: pins MINOR when MAJOR=0)
  ^0.0.3  → >=0.0.3 <0.0.4    (ZeroVer: pins PATCH when MINOR=0)

TILDE ~ (more conservative):
  ~1.4.2  → >=1.4.2 <1.5.0    (pins MAJOR.MINOR, allows PATCH)
  ~1.4    → >=1.4.0 <1.5.0
  ~1      → >=1.0.0 <2.0.0    (same as ^1 when no MINOR specified)

EXACT (fully pinned):
  "1.4.2" → only 1.4.2

RANGES:
  ">=1.4.0 <2.0.0"  → explicit range (equivalent to ^1.4.0)
  "1.4.0 - 1.9.0"   → inclusive range: >=1.4.0 <=1.9.0

X-RANGES (wildcards):
  "1.x"   → >=1.0.0 <2.0.0    (same as ^1)
  "1.4.x" → >=1.4.0 <1.5.0    (same as ~1.4)
  "*"     → any version
  ""      → any version (same as *)
```

**Câu hỏi thường bị nhầm**: `^0.4.0` không cho phép upgrade lên `0.5.0` — khi MAJOR = 0, caret pins MINOR. Đây là behavior ít người biết nhưng hay gặp trong interview.

```bash
# Verify ranges with npm:
npm semver --range "^1.4.2" "1.5.0"    # passes
npm semver --range "^1.4.2" "2.0.0"    # fails
npm semver --range "^0.4.2" "0.5.0"    # fails (ZeroVer behavior)

# Or check online: https://semver.npmjs.com/
```

---

## Part 2: Lockfiles Deep Dive / Đi Sâu Vào Lockfiles

### Section 2.1: What Lockfiles Guarantee / Lockfile Đảm Bảo Gì

```
Without lockfile:
  package.json: "react": "^18.0.0"
  Dev install day 1: react@18.0.0
  CI install day 30: react@18.2.0  ← different!
  Production behavior may differ from development

With lockfile (committed to git):
  package.json: "react": "^18.0.0"
  Dev install: react@18.0.0 (pinned in lockfile)
  CI install: react@18.0.0 (lockfile respected)
  Production: react@18.0.0 (identical)
```

**Lockfile structure comparison:**

```
npm → package-lock.json    (v3 format, flat dependency tree)
yarn → yarn.lock           (custom format, deterministic by design)
pnpm → pnpm-lock.yaml      (YAML, content-addressed store)
```

**Khi nào lockfile KHÔNG bảo vệ bạn:**

1. Người dùng thư viện của bạn (downstream apps) có lockfile riêng — lockfile của bạn không ảnh hưởng resolution của họ.
2. `npm install` (không phải `npm ci`) sẽ **update lockfile** nếu package.json range cho phép.
3. Renovate/Dependabot tạo PRs cập nhật lockfile → merge có thể trigger regression.

**Rule of thumb:**

```bash
# In CI: always use 'ci' variant (respects lockfile strictly, errors if mismatch)
npm ci
yarn install --frozen-lockfile
pnpm install --frozen-lockfile

# In development: use regular install (updates lockfile if needed)
npm install
yarn install
pnpm install
```

---

### Section 2.2: How pnpm Changes the Game / pnpm Thay Đổi Cuộc Chơi

pnpm dùng **content-addressed storage** — mỗi package version chỉ lưu một lần trên disk, shared bằng hard links across projects.

```
pnpm structure:
~/.pnpm-store/
  v3/
    files/
      00/abc123...  ← content hash
      01/def456...

project/node_modules/
  react/         ← hard link to ~/.pnpm-store/...
  react-dom/     ← hard link
```

**Vì sao quan trọng với versioning**: pnpm's strict mode **không cho phép hoisting** — package chỉ access dependencies được khai báo explicitly trong `package.json`. Điều này expose phantom dependency bugs (dùng package là sub-dep của dep khác) mà npm/yarn ẩn đi.

---

## Part 3: Breaking Change Detection / Phát Hiện Breaking Change

### Section 3.1: Categories of Breaking Changes / Các Loại Breaking Change

Breaking changes trong Frontend thư viện phức tạp hơn nhiều so với "API thay đổi":

```
CATEGORY 1: API Surface Breaking Changes
  - Renamed export: Button → PrimaryButton
  - Removed prop: <Modal isVisible> → <Modal open>
  - Changed required → optional (tricky: usually safe but can break TS inference)
  - Changed function signature: fn(a, b) → fn(options: {a, b})

CATEGORY 2: Behavioral Breaking Changes (hardest to detect)
  - Same API, different output:
      // v1: returns undefined for missing key
      // v2: throws Error for missing key
  - Changed default prop value:
      // v1: <Tooltip delay={500}> default
      // v2: <Tooltip delay={0}> default (instant — looks fine, breaks UX)
  - Changed CSS specificity or layout model (in component libraries)

CATEGORY 3: TypeScript-Specific Breaking Changes
  - Type narrowing behavior changes:
      // v1: prop type was string | undefined
      // v2: prop type is string — callers with '| undefined' now fail
  - Generic constraint tightening:
      // v1: <T extends object>
      // v2: <T extends Record<string, unknown>> — some T previously valid now errors
  - Exported type becomes internal (remove from index.d.ts)

CATEGORY 4: CSS Class Name / Design Token Breaking Changes
  - Renamed class: .btn-primary → .button-primary
  - Removed CSS custom property: --color-brand-500 → --color-primary-500
  - Changed specificity: downstream overrides stop working
```

**TypeScript breaking changes that look minor** — đây là senior trap question:

```typescript
// v1.4.0 — users write:
function render<T extends Component>(component: T): void { ... }

// v1.5.0 — MINOR bump, looks backward-compatible:
function render<T extends React.ComponentType>(component: T): void { ... }

// PROBLEM: ComponentType excludes class components in strict mode
// Users with class components get type error — but it's a "minor" bump
// This is a TypeScript behavioral breaking change that needs MAJOR bump
```

---

### Section 3.2: Detection Tooling / Công Cụ Phát Hiện

```bash
# Microsoft API Extractor — extracts public API surface, diffs across versions
npx @microsoft/api-extractor run --local
# Generates api-report.md — commit this to track API changes in PRs

# publint — validates package publishing correctness (exports, types, etc.)
npx publint

# arethetypeswrong — checks if TypeScript types are correct for all module formats
npx @arethetypeswrong/cli check my-lib

# attw (shorthand):
npx attw --pack .

# Manual diff with API Extractor report:
git diff HEAD~1 -- api-report.md
```

**Integration in CI**:

```yaml
# .github/workflows/api-check.yml
- name: Check API surface
  run: |
    npx @microsoft/api-extractor run --local
    git diff --exit-code temp/api-report.md || \
      (echo "API surface changed — update api-report.md and verify MAJOR bump" && exit 1)
```

---

## Part 4: Versioning Strategies / Các Chiến Lược Versioning

### Section 4.1: CalVer — Calendar Versioning

CalVer dùng ngày tháng thay vì MAJOR.MINOR.PATCH semantics.

```
Formats:
  YYYY.MM.MICRO   → 2024.04.0, 2024.04.1  (Ubuntu)
  YY.MM.MICRO     → 24.04.0               (Ubuntu LTS shorthand)
  YYYY.MINOR      → 2024.1, 2024.2        (legacy Django style)

Next.js (hybrid CalVer + SemVer influence):
  14.0.0, 14.1.0, 14.2.0 → major = product generation, not breaking signal
  15.0.0 → major framework generation
```

**Khi nào CalVer phù hợp:**

- Platform software với regular release cycles (Ubuntu 24.04 LTS)
- Tools người dùng cập nhật theo schedule, không theo API compatibility
- Projects không có thư viện downstream phụ thuộc vào API stability

**Khi nào CalVer không phù hợp:**

- Libraries với public API được nhiều packages consume — không có semver breaking change signal
- npm packages — tooling như npm audit, Renovate assume semver semantics

---

### Section 4.2: ZeroVer — Intentional Pre-1.0

ZeroVer (`0.x.y`) là signal tường minh: _"chúng tôi chưa commit với API stability"_.

```
Examples:
  Tailwind CSS (pre-v1): 0.7.4
  Vite (early days): 0.x
  Many ESM-native tools: 0.x during transition

Rule per SemVer spec:
  0.MINOR.PATCH
  MINOR bump = may have breaking changes (not guaranteed backward-compatible)
  PATCH bump = backward-compatible bug fix
```

**Interview insight**: Khi thấy thư viện ở `0.x.x` trong dependencies, đây là risk signal. `^0.7.0` sẽ KHÔNG tự động upgrade lên `0.8.0` (do caret ZeroVer behavior) — nhưng nếu bạn chạy `npm update`, nó có thể lên `0.8.x` và break.

---

## Part 5: Monorepo Versioning / Versioning Trong Monorepo

### Section 5.1: Fixed vs Independent / Cố Định vs Độc Lập

```
FIXED MODE (e.g., Babel, Angular):
  All packages share single version.
  @babel/core@7.23.0
  @babel/parser@7.23.0
  @babel/traverse@7.23.0

  Pros: Simple — one version number for everything
  Cons: PATCH in one package forces MINOR in all (version inflation)
  Tool: Lerna --fixed, Nx Release with fixed mode

INDEPENDENT MODE (e.g., Vue ecosystem packages):
  Each package versions independently.
  @vue/reactivity@3.4.0
  @vue/compiler-core@3.3.12
  @vue/runtime-dom@3.4.1

  Pros: Each package evolves at own pace, minimal version churn
  Cons: Complex — consumers must track each package separately
  Tool: Changesets (preferred), Lerna --independent
```

**Decision matrix:**

```
Use FIXED when:
  - Packages are always used together (install all or none)
  - Team prefers simplicity over precision
  - Package boundaries are internal implementation details

Use INDEPENDENT when:
  - Packages can be used standalone
  - Different packages have different stability levels
  - External consumers cherry-pick packages
```

---

### Section 5.2: Changesets Workflow / Quy Trình Changesets

Changesets là công cụ preferred nhất (2024+) cho monorepo versioning. Nó tách biệt **intent** (khi code thay đổi) và **publish** (khi release xảy ra).

```bash
# 1. Developer adds a changeset with their PR:
npx changeset add
# → Interactive prompt: which packages changed? what type? (major/minor/patch)
# → Creates .changeset/random-name.md with intent

# .changeset/purple-lions-fly.md:
---
"@myorg/button": minor
"@myorg/theme": patch
---

Added `variant="ghost"` prop to Button component.
Fixed theme token typo in shadow values.


# 2. In CI (on merge to main):
npx changeset version
# → Reads all .changeset/*.md
# → Bumps package.json versions
# → Updates CHANGELOG.md
# → Deletes consumed .changeset files
# → Creates version bump commit

# 3. Publish:
npx changeset publish
# → Runs npm publish for each changed package
# → Creates git tags

# 4. CI integration (GitHub Actions):
# changesets/action creates a "Version Packages" PR automatically
# When you merge that PR → packages are published
```

**Workflow diagram:**

```
Developer PR:
  code change + npx changeset add → .changeset/intent.md committed

CI on merge to main:
  changesets/action detects new .changeset files
  ↓
  Creates "Version Packages" PR with:
    - package.json version bumps
    - CHANGELOG.md updates
  ↓
  Team merges "Version Packages" PR
  ↓
  CI publishes to npm automatically
```

**Snapshot releases** (pre-release từ feature branches):

```bash
npx changeset version --snapshot canary
# → @myorg/button@1.5.0-canary.0
npx changeset publish --tag canary
# → npm publish --tag canary
```

---

### Section 5.3: Nx Release / Nx Release Tool

Nx Release là alternative cho Changesets, tích hợp với Nx workspace graph.

```bash
# Nx Release (Nx >=17):
nx release --dry-run          # Preview version bumps
nx release                    # Version + changelog + publish

# Configuration in nx.json:
{
  "release": {
    "projects": ["packages/*"],
    "version": {
      "conventionalCommits": true
    },
    "changelog": {
      "workspaceChangelog": { "createRelease": "github" }
    }
  }
}
```

---

## Part 6: Conventional Commits → Automated SemVer / Conventional Commits và Tự Động Hóa

Conventional Commits spec cho phép tooling tự động quyết định version bump type từ commit message.

```
Format: <type>(<scope>): <description>
        [optional body]
        [optional footer: BREAKING CHANGE: ...]

Types that affect SemVer:
  feat:          → MINOR bump
  fix:           → PATCH bump
  perf:          → PATCH bump
  BREAKING CHANGE: in footer or ! after type → MAJOR bump

Types that don't bump version:
  docs:
  style:
  refactor:
  test:
  chore:
  ci:

Examples:
  fix(button): correct hover color on disabled state    → PATCH (1.0.0 → 1.0.1)
  feat(modal): add onClose callback prop                → MINOR (1.0.0 → 1.1.0)
  feat!: remove deprecated className prop              → MAJOR (1.0.0 → 2.0.0)

  feat(api): change return type of getUser

  BREAKING CHANGE: getUser now returns Promise<User | null> instead of Promise<User>
  → MAJOR (1.0.0 → 2.0.0)
```

**Toolchain:**

```bash
# commitlint enforces format at commit time:
npx commitlint --from HEAD~1 --to HEAD

# release-please (Google) creates release PRs from conventional commits:
# → Parses commit history → bumps versions → creates CHANGELOG

# semantic-release:
npx semantic-release
# → Fully automated: analyze commits → version → tag → publish → GitHub Release
```

**Lợi thế trong interviews**: biết convention commits chain từ message → automated version → automated CHANGELOG là signal của engineer đã làm việc với release automation thực tế, không chỉ manual versioning.

---

## Part 7: Peer Dependencies & Resolution Hell / Peer Dependencies và Địa Ngục Resolution

### Section 7.1: Peer Dependency Model / Mô Hình Peer Dependency

```
Types of dependencies in package.json:
  "dependencies":    required at runtime, always installed
  "devDependencies": required at build/test time only
  "peerDependencies": required in consumer's environment — NOT auto-installed

Peer deps are contracts:
  // @myorg/react-button/package.json
  {
    "peerDependencies": {
      "react": ">=17.0.0 <19.0.0",
      "react-dom": ">=17.0.0 <19.0.0"
    }
  }
  Meaning: "I need React, but YOU bring it — I won't bundle my own copy"
```

**Tại sao peer deps tồn tại**: Nếu react-button bundled React, và consumer app cũng có React → **hai bản React** trong bundle. React đặc biệt yêu cầu singleton (hooks không hoạt động với multiple React instances).

**npm v7+ behavior**: npm 7+ tự động install peer deps. npm 6 và trước đó không install, chỉ warn.

---

### Section 7.2: Peer Dependency Hell / Địa Ngục Peer Dependencies

```
Scenario:
  App uses:
    react-router-dom@6  → peerDep: react@>=16.8
    @mui/material@5     → peerDep: react@^17.0.0 || ^18.0.0
    some-legacy-lib@2   → peerDep: react@^16.0.0  ← conflict!

npm v7+ behavior:
  Tries to install multiple react versions — may fail with ERESOLVE error

Diagnosis:
  npm ls react    ← shows full peer dep tree
  npm explain react  ← why this version was chosen
```

**Solutions:**

```bash
# Option 1: resolutions (Yarn) — force a specific version
# package.json:
{
  "resolutions": {
    "react": "18.2.0"
  }
}

# Option 2: overrides (npm 8.3+) — same idea
{
  "overrides": {
    "react": "18.2.0",
    "some-legacy-lib>react": "^18.0.0"   ← targeted override
  }
}

# Option 3: pnpm overrides
# package.json:
{
  "pnpm": {
    "overrides": {
      "react": "18.2.0"
    }
  }
}

# Risk: overrides force version that may not work with the package
# Always run full test suite after applying overrides
```

---

## Part 8: Renovate & Dependabot Strategies / Chiến Lược Renovate và Dependabot

### Section 8.1: Renovate Configuration / Cấu Hình Renovate

Renovate (preferred over Dependabot for fine-grained control) đọc `renovate.json` và tạo PRs cập nhật dependencies theo schedule và policy.

```json
// renovate.json — production-grade config
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended"],
  "schedule": ["before 6am on Monday"],
  "timezone": "Asia/Ho_Chi_Minh",

  "packageRules": [
    {
      "description": "Auto-merge patch updates for non-critical deps",
      "matchUpdateTypes": ["patch"],
      "matchDepTypes": ["devDependencies"],
      "automerge": true,
      "automergeType": "branch"
    },
    {
      "description": "Group all eslint updates into single PR",
      "matchPackagePatterns": ["^eslint"],
      "groupName": "ESLint packages"
    },
    {
      "description": "Pin major framework versions — require human review",
      "matchPackageNames": ["react", "react-dom", "next"],
      "matchUpdateTypes": ["major"],
      "automerge": false,
      "labels": ["dependencies", "major-update", "requires-review"]
    },
    {
      "description": "Stability days for minor updates (wait 3 days for bug reports)",
      "matchUpdateTypes": ["minor"],
      "stabilityDays": 3
    }
  ],

  "lockFileMaintenance": {
    "enabled": true,
    "schedule": ["before 6am on first day of month"]
  }
}
```

**Auto-merge policy matrix:**

```
Dep type    | Update type | Auto-merge?  | Rationale
------------|-------------|--------------|----------------------------------
devDep      | patch       | Yes          | No production impact, low risk
devDep      | minor       | Yes + CI     | Non-breaking by semver contract
devDep      | major       | No           | May need config/code changes
dep         | patch       | Yes + CI     | Bug fix, backward-compatible
dep         | minor       | Review       | New feature — verify no regressions
dep         | major       | No           | Breaking change — manual review
framework   | any         | No           | High blast radius
```

---

### Section 8.2: Dependabot Configuration / Cấu Hình Dependabot

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "06:00"
      timezone: "Asia/Ho_Chi_Minh"

    # Group all patch updates
    groups:
      patch-updates:
        update-types:
          - "patch"

    # Ignore major updates for core framework deps
    ignore:
      - dependency-name: "react"
        update-types: ["version-update:semver-major"]
      - dependency-name: "next"
        update-types: ["version-update:semver-major"]

    # Auto-approve + merge for low-risk updates (via separate workflow)
    labels:
      - "dependencies"
    reviewers:
      - "platform-team"
```

**Dependabot vs Renovate tradeoffs:**

```
Dependabot:
  ✅ Native GitHub integration, no setup
  ✅ Security alerts integration
  ❌ Less configurable grouping
  ❌ No stabilityDays concept
  ❌ One PR per package (can flood PRs)

Renovate:
  ✅ Powerful grouping and scheduling
  ✅ stabilityDays (wait for community bug reports)
  ✅ Dashboard PR to see all pending updates
  ✅ Supports private registries, Docker, etc.
  ❌ Requires separate installation (GitHub App or self-hosted)
  ❌ More complex config
```

---

## Part 9: Deprecation Workflow / Quy Trình Deprecation

### Section 9.1: The Three-Phase Deprecation / Ba Giai Đoạn Deprecation

Deprecation đúng cách là cả một protocol, không phải chỉ thêm comment.

```
PHASE 1: Deprecate (MINOR bump)
  - Add @deprecated JSDoc annotation
  - Add runtime console.warn in development
  - Document migration path in CHANGELOG
  - Add to migration guide

PHASE 2: Codemod (MINOR or PATCH)
  - Provide automated migration script
  - Test codemod on real consumer code
  - Document codemod in CHANGELOG

PHASE 3: Remove (MAJOR bump)
  - Remove deprecated code
  - CHANGELOG entry with "BREAKING CHANGE"
  - Update migration guide
```

**Phase 1 — Deprecation in code:**

```typescript
// @myorg/button v1.5.0 — deprecating 'color' prop in favor of 'variant'

interface ButtonProps {
  /**
   * @deprecated Use `variant` instead. Will be removed in v2.0.0.
   * Migration: <Button color="primary"> → <Button variant="primary">
   */
  color?: "primary" | "secondary";

  /** Preferred prop replacing `color`. */
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ color, variant, ...props }: ButtonProps) {
  if (process.env.NODE_ENV !== "production" && color !== undefined) {
    console.warn(
      `[@myorg/button] The 'color' prop is deprecated and will be removed in v2.0.0. ` +
        `Use 'variant' instead. See migration guide: https://myorg.dev/migrate/v2`,
    );
  }
  const resolvedVariant = variant ?? color;
  // ...
}
```

**npm deprecation notice:**

```bash
# Mark a specific version as deprecated on npm registry:
npm deprecate my-lib@"< 2.0.0" "Upgrade to v2: https://myorg.dev/migrate/v2"

# Users will see:
# npm WARN deprecated my-lib@1.5.0: Upgrade to v2: https://myorg.dev/migrate/v2
```

---

### Section 9.2: Codemods / Tự Động Migration

```bash
# Using jscodeshift for automated migration:
# packages/codemods/src/v2-color-to-variant.ts

import type { Transform } from "jscodeshift";

const transform: Transform = (file, api) => {
  const j = api.jscodeshift;
  return j(file.source)
    .find(j.JSXAttribute, { name: { name: "color" } })
    .filter(path => {
      // Only transform Button component usage
      return path.parent.node.name.name === "Button";
    })
    .replaceWith(path => {
      return j.jsxAttribute(
        j.jsxIdentifier("variant"),
        path.node.value
      );
    })
    .toSource();
};

export default transform;
```

```bash
# Run codemod on consumer codebase:
npx jscodeshift \
  --transform=node_modules/@myorg/codemods/dist/v2-color-to-variant.js \
  src/
```

---

## Part 10: Frontend-Specific Versioning Concerns / Các Vấn Đề Versioning Đặc Thù Frontend

### Section 10.1: CDN Versioning / Versioning Trên CDN

CDN URLs với version numbers cần được immutable — một version không bao giờ được change content.

```html
<!-- Pattern 1: Exact version in URL (immutable, cacheable forever) -->
<script src="https://cdn.example.com/react/18.2.0/react.production.min.js" crossorigin></script>

<!-- Pattern 2: Integrity hash (SRI) — additional verification -->
<script
  src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"
  integrity="sha384-abc123..."
  crossorigin="anonymous"
></script>

<!-- WRONG: Mutable URL — "latest" can change, breaks caching and integrity -->
<script src="https://cdn.example.com/react/latest/react.min.js"></script>
```

**Cache headers for versioned CDN assets:**

```
# Versioned URL → cache forever (content is immutable by semver contract)
Cache-Control: public, max-age=31536000, immutable

# Non-versioned URL → short cache, must-revalidate
Cache-Control: public, max-age=3600, must-revalidate
```

---

### Section 10.2: CSS Class Name Stability / Ổn Định Tên Class CSS

Trong component libraries, **CSS class names là public API**. Đây là câu mà nhiều engineer bỏ sót.

```css
/* v1.0.0: .btn-primary is the class name */
.btn-primary {
  background-color: var(--color-brand-500);
}

/* v1.5.0: renamed to .button-primary for consistency — BREAKING CHANGE */
.button-primary {
  background-color: var(--color-brand-500);
}
```

Consumers có thể đang override styles:

```css
/* Consumer override — breaks silently when class renames */
.btn-primary:hover {
  background-color: darkblue; /* no longer applies after v1.5.0 */
}
```

**Best practice**: nếu bạn dùng CSS-in-JS (emotion, styled-components) hoặc CSS Modules với hashed names, class names không phải public API. Nếu bạn ship a stylesheet với semantic class names → treat them as public API, bump MAJOR khi rename.

---

### Section 10.3: Bundled vs Peer Dependencies for Component Libraries

```
SCENARIO: @myorg/button ships its own Tailwind CSS

Option A: Bundle Tailwind in output (dependency not peerDep)
  Pros: Consumer just imports, zero config
  Cons:
    - Consumer may already have Tailwind → two conflicting versions
    - CSS specificity conflicts (two Tailwind resets)
    - Bundle bloat (~30KB extra Tailwind utilities)

Option B: Peer dep on Tailwind (consumer brings their own)
  Pros: Single Tailwind instance, shared design tokens
  Cons: Consumer must configure Tailwind content paths for library classes:
        // tailwind.config.js
        content: [
          "./src/**/*.tsx",
          "./node_modules/@myorg/button/dist/**/*.js"  ← required
        ]

Option C: CSS custom properties only (no framework dep)
  Pros: Framework-agnostic, zero setup for consumers
  Cons: More work to build the library
  Pattern:
    /* library ships CSS vars, no Tailwind classes */
    .myorg-button {
      background: var(--myorg-color-primary, #3b82f6);
      border-radius: var(--myorg-radius-button, 6px);
    }
    /* consumer customizes via CSS vars */
    :root { --myorg-color-primary: #your-brand; }
```

**Interview answer**: for open-source UI libraries (shadcn model), Option B or C is correct. For internal libraries with controlled consumer environment, Option A is acceptable.

---

## Part 11: Interview Q&A / Câu Hỏi Phỏng Vấn

---

### 🟢 Q1: What does `^1.4.2` mean in package.json? / `^1.4.2` có nghĩa gì?

**A:**

`^1.4.2` means "any version compatible with `1.4.2`" — specifically `>=1.4.2 <2.0.0`. The caret operator pins the **MAJOR** version and allows MINOR and PATCH to float upward.

The intuition: SemVer says that MINOR and PATCH bumps are backward-compatible by contract, so it's safe to auto-upgrade within the same major. However, `^` does NOT mean "always safe" — it trusts library authors to follow SemVer correctly (which they sometimes don't).

**Critical edge case**: when MAJOR = 0 (pre-1.0 / ZeroVer), caret behavior changes:

- `^0.4.2` → `>=0.4.2 <0.5.0` (pins MINOR, not MAJOR)
- `^0.0.3` → `>=0.0.3 <0.0.4` (pins PATCH when MINOR is also 0)

This reflects that pre-1.0 packages don't guarantee backward compatibility even in MINOR bumps.

> 🇻🇳 **Tóm tắt**: `^1.4.2` cho phép cài bất kỳ version nào từ `1.4.2` đến dưới `2.0.0`. Caret pins MAJOR, cho phép MINOR và PATCH float. **Ngoại lệ quan trọng**: khi MAJOR = 0 (pre-1.0), `^0.4.2` chỉ cho phép `0.4.x` — caret pins MINOR thay vì MAJOR. Đây là behavior hay bị nhầm trong interviews.

💡 **Interview Signal:**

- ✅ Strong: Correctly states `>=1.4.2 <2.0.0`, mentions the ZeroVer exception (`^0.4.2` behavior), explains the underlying SemVer trust contract
- ❌ Weak: "Caret means latest minor version" — imprecise; doesn't capture the range or the ZeroVer exception

---

### 🟢 Q2: What is the difference between `~` and `^`? / Sự khác biệt giữa `~` và `^`?

**A:**

Both are range operators, but they allow different ranges of updates:

```
^ (caret):   pins MAJOR, allows MINOR + PATCH
  ^1.4.2  → >=1.4.2 <2.0.0

~ (tilde):   pins MAJOR.MINOR, allows PATCH only
  ~1.4.2  → >=1.4.2 <1.5.0
```

**When to use tilde over caret**: when you want conservative updates — only bug fixes, no new features. Useful when a dependency has a history of breaking changes in MINOR releases (violating SemVer), or when you're in a codebase where stability is critical and dependency changes require explicit human review.

In practice, most teams default to `^` (npm's default when running `npm install`) because it allows automatic security patches without needing to manually bump MINOR versions. Switching to `~` means more frequent manual lockfile updates.

> 🇻🇳 **Tóm tắt**: `^` cho phép MINOR và PATCH tăng (pins MAJOR). `~` chỉ cho phép PATCH tăng (pins MAJOR.MINOR). Dùng `~` khi cần conservative updates — chỉ bug fixes, không có new features. Trong thực tế, hầu hết teams dùng `^` vì đó là default của `npm install`.

💡 **Interview Signal:**

- ✅ Strong: States both ranges precisely, explains practical tradeoff (stability vs getting security patches), can give reason to prefer tilde
- ❌ Weak: "Tilde is more strict" — correct but incomplete; doesn't explain when or why to choose it

---

### 🟡 Q3: Why should lockfiles be committed to git? / Tại sao lockfile cần commit vào git?

**A:**

Lockfiles guarantee **reproducible installs** — every developer, CI environment, and production build gets exactly the same dependency tree.

Without committing the lockfile:

1. Developer A runs `npm install` on Monday: `lodash@4.17.21` installed
2. Developer B runs `npm install` on Friday: `lodash@4.17.22` installed (new patch)
3. Bug exists only in `4.17.22` → Developer B sees it, Developer A doesn't → hard to reproduce

With lockfile committed:

1. All installs resolve identical versions until lockfile is explicitly updated
2. `npm ci` (in CI) requires exact lockfile match — fails if package.json and lockfile are out of sync
3. PR diffs on lockfile make dependency updates visible and reviewable

**The "but lockfiles are noisy in PRs" objection**: use `.gitattributes` to mark lockfiles as binary for diff purposes, or configure your PR review tool to collapse lockfile diffs. The reproducibility benefit far outweighs the noise.

**When NOT to commit lockfile**: published npm packages (not apps) should not commit lockfiles — consumers resolve their own dependency tree. Apps always commit lockfiles.

> 🇻🇳 **Tóm tắt**: Commit lockfile để đảm bảo **reproducible installs** — mọi dev, CI, production đều install đúng version đã được test. Không commit lockfile → mỗi `npm install` có thể cho tree khác nhau → bugs không reproducible. **Ngoại lệ**: published packages không commit lockfile (consumer tự resolve). Apps luôn commit lockfile.

💡 **Interview Signal:**

- ✅ Strong: Explains reproducibility, distinguishes `npm install` vs `npm ci`, knows the app-vs-library distinction
- ❌ Weak: "Lockfiles should be in .gitignore to avoid conflicts" — common misconception, incorrect for apps

---

### 🟡 Q4: What is a "behavioral breaking change" and why is it hard to detect?

**A:**

A **behavioral breaking change** occurs when a library's observable runtime behavior changes in a way that breaks consumers — even though the public API (types, function signatures, exported names) remains identical.

Examples:

1. **Changed default value**: `<Tooltip delay={300}>` default was `300ms` in v1.4.0; changed to `0ms` in v1.5.0. Callers not passing `delay` now get instant tooltips — no type error, but broken UX.

2. **Changed error semantics**: `getUser(id)` returned `undefined` for missing user in v1.4.0; throws `UserNotFoundError` in v1.5.0. Same TypeScript signature, but callers without try/catch now crash.

3. **Changed event timing**: `onClose` callback was called synchronously in v1.4.0; now called async via `setTimeout(fn, 0)` in v1.5.0. Tests that check state after `onClose` fail non-deterministically.

**Why hard to detect:**

- API Extractor and TypeScript compilers check types only — behavioral contracts are invisible to static analysis
- Unit tests often mock dependencies rather than catching downstream behavioral differences
- No tooling equivalent of "behavioral contract diffing"

**Prevention strategies:**

1. Document behavioral contracts in JSDoc (`@remarks`, `@example`)
2. Consumer-driven contract tests (like Pact but for component behavior)
3. Strong CHANGELOG discipline: treat any behavioral change as potential breaking change
4. Integration tests with real consumer code in CI

> 🇻🇳 **Tóm tắt**: Behavioral breaking change = behavior thay đổi nhưng API signature vẫn giống nhau — type checker không bắt được. Ví dụ: thay đổi default value, thay đổi từ return undefined sang throw Error, thay đổi callback timing. Hard to detect vì static analysis tools (TypeScript, API Extractor) chỉ check types — không check runtime behavior contracts.

💡 **Interview Signal:**

- ✅ Strong: Gives concrete example (default value, error semantics, or timing), explains why static analysis misses it, suggests prevention strategies
- ❌ Weak: "Breaking change means the API changed" — misses the entire behavioral category; this is exactly the nuance interviewers test for

---

### 🟡 Q5: Explain the Changesets workflow for a monorepo. / Giải thích Changesets workflow trong monorepo.

**A:**

Changesets separates two concerns that are often conflated: **expressing intent at code change time** vs **executing releases**.

The workflow has three phases:

**Phase 1 — Intent (per PR):**
Developer adds a changeset file alongside their code changes. This file declares which packages changed and what type of bump (major/minor/patch), plus a human-readable description for the CHANGELOG.

```bash
npx changeset add
# → interactive prompt
# → creates .changeset/whimsical-name.md
```

**Phase 2 — Version (automated):**
When changesets accumulate on `main`, the Changesets GitHub Action creates a "Version Packages" PR that applies all pending changesets: bumps `package.json` versions, updates `CHANGELOG.md`, removes consumed changeset files.

**Phase 3 — Publish (on merge):**
Merging the "Version Packages" PR triggers `changeset publish`, which runs `npm publish` for each changed package and creates git tags.

**Key insight**: multiple PRs can accumulate changesets before any release happens. The "Version Packages" PR batches them all — useful for shipping weekly releases with many changes rather than publishing on every commit.

> 🇻🇳 **Tóm tắt**: Changesets tách biệt **intent** (khi code thay đổi) và **publish** (khi release). Developer thêm `.changeset/*.md` vào PR để khai báo loại bump và mô tả. CI accumulates changesets → tạo "Version Packages" PR → merge → publish. Lợi ích: nhiều PRs gộp thành 1 release, CHANGELOG tự động, không cần manual version bumps.

💡 **Interview Signal:**

- ✅ Strong: Describes all three phases, explains the "accumulate then release" pattern, knows about the GitHub Action integration
- ❌ Weak: "Changesets is a tool for versioning" — too vague; interviewers want the workflow mechanics

---

### 🟡 Q6: How do npm `overrides` and Yarn `resolutions` solve peer dependency conflicts?

**A:**

When two dependencies require conflicting versions of the same peer dependency, the package manager cannot automatically resolve a single version that satisfies both. `overrides` (npm 8.3+) and `resolutions` (Yarn) let you **force a specific version** regardless of what packages declare.

**Scenario:**

```json
// Consumer app has:
"dependencies": {
  "component-lib": "^2.0.0",  // peerDep: react@^17
  "legacy-widget": "^1.0.0"   // peerDep: react@^16
}
// npm cannot satisfy both — ERESOLVE error
```

**npm override solution:**

```json
{
  "overrides": {
    "react": "18.2.0"
  }
}
```

This forces ALL instances of `react` in the entire dependency tree to resolve to `18.2.0`. More targeted:

```json
{
  "overrides": {
    "legacy-widget>react": "^18.0.0"
  }
}
```

Only overrides `react` within `legacy-widget`'s dependency tree.

**Risk**: overrides may force a version that a package wasn't tested against. Always run full test suite. This is a **workaround**, not a long-term fix — the real fix is upgrading `legacy-widget` to support React 18.

**pnpm approach** — `pnpm.overrides` in `package.json`, same semantics.

> 🇻🇳 **Tóm tắt**: Khi hai packages yêu cầu conflicting versions của cùng một peer dep, npm ERESOLVE error. `overrides` (npm) / `resolutions` (Yarn) force một version cụ thể cho toàn bộ dep tree hoặc chỉ trong context của package cụ thể. **Risk**: force version có thể break package chưa được test với version đó. Đây là workaround — fix thực sự là upgrade package có peer dep conflict.

💡 **Interview Signal:**

- ✅ Strong: Explains the conflict scenario, shows both global and targeted override syntax, acknowledges the risk and that it's a workaround
- ❌ Weak: "Use --force flag" — dangerous advice (skips lockfile validation); doesn't address the underlying resolution problem

---

### 🔴 Q7: How would you detect a TypeScript breaking change that looks like a minor bump?

**A:**

TypeScript breaking changes that compile successfully are the hardest category to catch. Here's a systematic detection approach:

**Category 1: Type widening/narrowing**

```typescript
// v1.4.0 — prop accepts undefined:
interface ButtonProps {
  icon?: string | undefined;
}

// v1.5.0 — undefined removed (narrowed):
interface ButtonProps {
  icon?: string; // TypeScript: string | undefined still, so... actually fine here
}

// Actually breaking — union to non-union:
// v1.4.0: onClose?: (reason: "timeout" | "user" | string) => void
// v1.5.0: onClose?: (reason: "timeout" | "user") => void
// Callers passing custom reason strings now get type error
```

**Detection tool: `@microsoft/api-extractor`**

```bash
# Set up API Extractor in your library:
npx api-extractor init

# api-extractor.json (key config):
{
  "dtsRollup": { "enabled": true },
  "apiReport": {
    "enabled": true,
    "reportFileName": "api-report.md"  // commit this file
  }
}

# On every PR:
npx api-extractor run --local
git diff api-report.md  // shows exactly what changed in public type surface
```

**CI gate — reject PRs that change API without MAJOR bump:**

```yaml
- name: Check API changes
  run: |
    npx api-extractor run --local
    if git diff --quiet api-report.md; then
      echo "No API changes"
    else
      echo "API surface changed. If breaking, ensure MAJOR version bump."
      echo "Review diff:"
      git diff api-report.md
      # Don't auto-fail — require human review of API diff
    fi
```

**Tool: `arethetypeswrong`** — checks module resolution compatibility (CJS/ESM type issues):

```bash
npx @arethetypeswrong/cli check .
# Checks: ESM/CJS types alignment, missing exports, etc.
```

**Behavioral contract testing** — unit tests as contracts:

```typescript
// Document and test behavioral contracts explicitly:
it("returns undefined (not throws) when key not found", () => {
  expect(store.get("nonexistent")).toBeUndefined();
  // If v1.5.0 changes this to throw — this test catches it
  // This test IS the behavioral contract
});
```

> 🇻🇳 **Tóm tắt**: TypeScript breaking changes cần phát hiện ở 3 layer: (1) **API Extractor** — diff type surface qua `api-report.md` trong git. (2) **arethetypeswrong** — check ESM/CJS type compatibility. (3) **Behavioral contract tests** — test cả runtime behavior (return undefined vs throw), không chỉ types. CI gate nên flag khi `api-report.md` thay đổi để yêu cầu human review trước khi merge.

💡 **Interview Signal:**

- ✅ Strong: Names specific tools (api-extractor, arethetypeswrong), describes the api-report.md diff workflow, explains that behavioral contracts need tests not just type checks
- ❌ Weak: "TypeScript will catch breaking changes" — incorrect; structural type changes that compile can still break consumer code at the type level

---

### 🔴 Q8: Compare fixed vs independent versioning in a monorepo. When would you choose each?

**A:**

The choice determines how version numbers across packages evolve over time.

**Fixed versioning:**

All packages in the monorepo share a single version number. When anything releases, everything releases at the same version — even packages that didn't change.

```
Monorepo packages:
  @babel/core@7.23.0
  @babel/parser@7.23.0
  @babel/traverse@7.23.0
  @babel/types@7.23.0

Fix a bug in @babel/traverse:
  ALL packages bump to @7.23.1
  → @babel/core unchanged but version bumps
```

**Independent versioning:**

Each package tracks its own version history. Only packages that actually changed release a new version.

```
  @myorg/button@1.2.0  (last changed 2 months ago)
  @myorg/modal@3.0.1   (breaking change last week → MAJOR)
  @myorg/theme@0.8.4   (frequent patch updates)
```

**Decision framework:**

```
Choose FIXED when:
  1. Packages are always deployed/installed together (meta-package model)
  2. Tight internal coupling — breaking @core means rebuilding @parser anyway
  3. Simplicity is preferred — one version number for support/changelog
  4. Users install the whole suite, not individual packages
  Example: Babel, Angular (all @angular/* packages)

Choose INDEPENDENT when:
  1. Packages can be used individually without the whole suite
  2. Different packages evolve at very different rates
  3. You want to communicate per-package stability clearly
  4. Large org with teams owning different packages
  Example: Vue ecosystem, AWS SDK v3 packages, TanStack libraries
```

**Hybrid**: some monorepos use fixed versioning for "kernel" packages that must align, and independent versioning for plugin/adapter packages. Nx supports this pattern.

> 🇻🇳 **Tóm tắt**: Fixed = tất cả packages cùng version → simple nhưng version inflation (package không đổi vẫn bump). Independent = mỗi package version riêng → complex nhưng chính xác hơn về scope thay đổi. Chọn Fixed khi packages luôn dùng cùng nhau (Babel, Angular). Chọn Independent khi packages standalone, evolve ở tốc độ khác nhau (Vue ecosystem, TanStack).

💡 **Interview Signal:**

- ✅ Strong: Explains the version inflation tradeoff of fixed, names real examples (Babel for fixed, Vue ecosystem for independent), mentions the hybrid approach
- ❌ Weak: "Fixed is simpler so use it" — ignores that "version inflation misleads consumers about what actually changed"

---

### 🔴 Q9: How would you set up a dependency update strategy for a large frontend app with 200+ dependencies?

**A:**

A large dependency surface needs a **tiered update policy** — not all updates are equal risk.

**Tier 1 — Auto-merge, low risk:**

```
- devDependencies: patch updates (lint rules, type stubs, test utils)
- devDependencies: minor updates (non-breaking by semver contract, no production impact)
Strategy: Renovate auto-merges after CI passes (24h stabilityDays)
```

**Tier 2 — Auto-merge with review window:**

```
- dependencies: patch updates (bug fixes, backward-compatible)
Strategy: Renovate opens PR, auto-merges after 3 stabilityDays + CI passes
Reason: stabilityDays lets community discover bugs before you adopt
```

**Tier 3 — Manual review required:**

```
- dependencies: minor updates (new features — verify no regressions)
- Any update to: react, react-dom, next, webpack, TypeScript
Strategy: PR opened, requires team label approval
Labels: "dependencies", "minor-update"
```

**Tier 4 — High-ceremony process:**

```
- Any major update to core framework (react@17→18, next@13→14)
Strategy:
  1. Dedicated upgrade branch
  2. Changelog audit + migration guide read
  3. Full regression test suite
  4. Staging deployment + smoke test
  5. Rollback plan documented
  6. Coordinated deploy window
```

**Renovate config implementing this:**

```json
{
  "packageRules": [
    {
      "matchDepTypes": ["devDependencies"],
      "matchUpdateTypes": ["patch", "minor"],
      "automerge": true,
      "stabilityDays": 1
    },
    {
      "matchDepTypes": ["dependencies"],
      "matchUpdateTypes": ["patch"],
      "automerge": true,
      "stabilityDays": 3
    },
    {
      "matchDepTypes": ["dependencies"],
      "matchUpdateTypes": ["minor"],
      "automerge": false,
      "labels": ["deps-minor", "needs-review"]
    },
    {
      "matchPackageNames": ["react", "react-dom", "next", "typescript"],
      "automerge": false,
      "labels": ["deps-critical", "needs-senior-review"]
    }
  ]
}
```

**Lockfile maintenance** (monthly): `lockFileMaintenance` updates all packages within their current semver ranges, consolidated into one PR — prevents "dependency drift" where ranges are satisfied by old versions.

> 🇻🇳 **Tóm tắt**: Chiến lược tiered theo risk: (1) devDeps patch/minor → auto-merge. (2) deps patch → auto-merge sau `stabilityDays: 3`. (3) deps minor → manual review. (4) major framework updates → dedicated branch + full regression + rollback plan. Renovate implement được toàn bộ policy này qua `packageRules`. `lockFileMaintenance` monthly để tránh dependency drift.

💡 **Interview Signal:**

- ✅ Strong: Shows the tiered approach, mentions stabilityDays, has specific policy for core framework majors (dedicated branch, rollback plan), knows lockFileMaintenance
- ❌ Weak: "Use Dependabot to update everything automatically" — no tiering, no risk assessment; will cause production incidents

---

### 🔴 Q10: A library you own ships `1.5.0` and breaks three downstream apps. Walk through the incident response and process changes.

**A:**

This is a **process failure**, not just a version mistake. The response has two tracks: immediate mitigation and systemic prevention.

**Track 1: Immediate Mitigation (hours 0–2)**

```bash
# Step 1: Yank the broken release (deprecated, not deleted — npm doesn't allow delete)
npm deprecate my-lib@1.5.0 "Breaking change found. Use 1.4.2 or await 1.5.1."

# Step 2: Revert the breaking change, patch fix
git revert <breaking-commit>
# or fix forward:
# Fix the breaking behavior, release 1.5.1 immediately

# Step 3: Release the fix
npm publish --tag latest   # 1.5.1 published

# Step 4: Notify downstream teams
# Slack/email with:
# - What broke
# - Immediate workaround: pin to "my-lib": "1.4.2" in their package.json
# - ETA for 1.5.1 fix
```

**Track 2: Systemic Prevention (days 1–5)**

**Root cause analysis — why wasn't this caught?**

1. Was there a behavioral test for the changed behavior? → Add contract tests
2. Was the API surface diff reviewed? → Add `api-extractor` + `api-report.md` to CI
3. Was the change announced in a changeset? → Enforce Changesets requirement for all PRs
4. Were downstream apps tested before publish? → Add consumer integration tests

**Process changes:**

```yaml
# CI gate: require changeset on every PR to main
- name: Check changeset
  run: npx changeset status --since=origin/main
  # Fails if PR has no changeset file — forces intentional version decision

# Pre-publish integration test with major downstream consumers:
- name: Test with downstream apps
  run: |
    # Pack the library
    npm pack --dry-run
    # Install in downstream test repo and run its tests
    cd ../downstream-app-test
    npm install ../my-lib/my-lib-1.5.0.tgz
    npm test
```

**Versioning lesson from this incident:**
If the "minor" change altered default behavior (not just adding a feature) → that was ALWAYS a breaking change → should have been `2.0.0`. A CHANGELOG discipline review: anything that changes observable output, defaults, or error behavior = MAJOR.

> 🇻🇳 **Tóm tắt**: Hai track song song: (1) **Immediate** — `npm deprecate` version broken, fix + release patch, notify downstream với workaround. (2) **Systemic** — root cause tại sao không bị catch: thiếu behavioral tests? thiếu `api-extractor`? thiếu changeset enforcement? Process changes: require changeset mọi PR, add consumer integration tests, enforce API surface diff review. Bài học versioning: thay đổi default behavior = MAJOR, không phải MINOR.

💡 **Interview Signal:**

- ✅ Strong: Separates immediate mitigation from systemic fix, knows `npm deprecate` (not delete), adds consumer integration tests, ties back to versioning lesson about behavioral changes = MAJOR
- ❌ Weak: "Publish a patch fix and tell people to update" — no deprecation, no root cause, no process change; will happen again

---

## Anti-Patterns / Các Sai Lầm Cần Tránh

```
ANTI-PATTERN 1: "It's a minor change — bump MINOR"
  Problem: Conflates "small code change" with "minor bump"
  SemVer MINOR means "backward-compatible new feature" — not "few lines changed"
  A one-line default value change can be a MAJOR breaking change
  Fix: Classify by impact on consumers, not by diff size

ANTI-PATTERN 2: Committing node_modules/ to git
  Problem: Negates lockfile reproducibility, bloats repo, OS-specific binaries
  Fix: Commit lockfile, add node_modules to .gitignore, use npm ci in CI

ANTI-PATTERN 3: Using `*` or `latest` as a version range
  Problem: Any publish by any package author can break your app instantly
           "latest" is a dist-tag, not a range — it changes on every publish
  Fix: Always use specific version or ^/~ range

ANTI-PATTERN 4: Ignoring peer dependency warnings
  Problem: npm warns about peer dep mismatches for good reason
           Silent peer dep conflicts can cause duplicate module instances
           (e.g., two React instances → hooks errors)
  Fix: Resolve or acknowledge peer dep conflicts explicitly

ANTI-PATTERN 5: Auto-merging all Renovate/Dependabot PRs
  Problem: Even patch updates can have behavioral changes (library authors make mistakes)
  Fix: Use stabilityDays, tier by risk, never auto-merge major framework updates

ANTI-PATTERN 6: Skipping lockfile in CI (npm install instead of npm ci)
  Problem: npm install updates lockfile → CI may test different versions than dev
           Breaks reproducibility guarantee
  Fix: Always use npm ci / yarn install --frozen-lockfile / pnpm install --frozen-lockfile

ANTI-PATTERN 7: Publishing with private/internal packages as direct deps
  Problem: Private package names in dependencies → npm install fails for users
  Fix: Either bundle private deps, or use workspace: protocol and publish separately

ANTI-PATTERN 8: CSS class names as implementation details
  Problem: Component library renames .btn → .button → all consumer overrides break
  Fix: Treat semantic class names in shipped CSS as public API; document in API report

ANTI-PATTERN 9: ZeroVer forever as a stability dodge
  Problem: Keeping 0.x.x to avoid semver contracts while having many production users
           (Users expect stability even if you promise none)
  Fix: Commit to 1.0.0 once API is reasonably stable; ZeroVer forever erodes trust

ANTI-PATTERN 10: Using overrides/resolutions as first resort
  Problem: Forces version that may not be tested by package author
            Hidden incompatibilities surface in production
  Fix: Overrides are last resort. First: upgrade to compatible version, file issue with package
```

---

## Memory Hook / Mnemonic

```
"MAJOR breaks, MINOR makes, PATCH takes"

  MAJOR → breaks the contract (callers must adapt)
  MINOR → makes new features (callers may adopt)
  PATCH → takes away bugs (callers auto-receive)

And the follow-ups:
  "Caret ^ pins MAJOR, Tilde ~ pins MINOR" (C before T = more permissive)
  "CI uses 'ci', dev uses 'install'" (npm ci = frozen lockfile)
  "Changeset intent at PR time, publish at merge time"
  "Behavior change = MAJOR, even if one line"
```

---

## Q&A Summary Table / Bảng Tóm Tắt

| #   | Question                                 | Level | Core Answer                                                                                               | Key Trap                                       |
| --- | ---------------------------------------- | ----- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Q1  | What does `^1.4.2` mean?                 | 🟢    | `>=1.4.2 <2.0.0`; pins MAJOR                                                                              | ZeroVer exception: `^0.4.2 → <0.5.0`           |
| Q2  | `~` vs `^` difference?                   | 🟢    | `~` pins MINOR (patch only); `^` pins MAJOR                                                               | When to prefer tilde (stability-critical)      |
| Q3  | Why commit lockfiles to git?             | 🟢    | Reproducible installs; `npm ci` requires it                                                               | App vs library distinction                     |
| Q4  | What is a behavioral breaking change?    | 🟡    | Same API, changed runtime behavior; invisible to static analysis                                          | TypeScript can't catch it                      |
| Q5  | Explain Changesets workflow              | 🟡    | Intent at PR time (changeset add), version + publish at merge time                                        | Accumulate-then-release pattern                |
| Q6  | npm overrides vs Yarn resolutions        | 🟡    | Force specific version to resolve peer dep conflicts                                                      | Risk: may break package; workaround not fix    |
| Q7  | Detect TypeScript breaking changes       | 🔴    | api-extractor api-report.md diff; arethetypeswrong; behavioral contract tests                             | Structural type changes that compile but break |
| Q8  | Fixed vs independent monorepo versioning | 🔴    | Fixed: all same version, simple; Independent: per-package, accurate                                       | Version inflation in fixed mode                |
| Q9  | Dependency update strategy for 200+ deps | 🔴    | Tiered: devDeps auto-merge, deps patch w/ stabilityDays, deps minor manual, framework major high-ceremony | No tiering = production incidents              |
| Q10 | Incident: 1.5.0 breaks downstream        | 🔴    | npm deprecate + patch fix + systemic: api-extractor, changeset enforcement, consumer integration tests    | Root cause + process fix, not just hotfix      |

---

## Cold Call / Câu Hỏi Nhanh Kịch Bản

Interviewer throws these rapid-fire. Answer in 2–3 sentences max.

---

**"Your CI uses `npm install` instead of `npm ci`. Is that a problem?"**

→ Yes. `npm install` updates the lockfile if package.json ranges allow newer versions. CI may test different packages than developers run locally. Use `npm ci` — it requires the lockfile to match package.json exactly and fails if not.

---

**"A library you depend on jumps from `2.4.0` to `3.0.0`. What do you do?"**

→ Read the CHANGELOG and migration guide before updating. Run the update on a branch, run full test suite, fix any type errors or API usage changes. Consider using a codemod if provided. Don't merge until staging validation passes.

---

**"How does `npm deprecate` differ from unpublishing?"**

→ `npm deprecate` marks a version with a warning message — users can still install it but see a warning. `npm unpublish` removes the version entirely (only allowed within 72h or for undownloaded versions). Deprecate is almost always the right choice; unpublish can break other projects that depend on that exact version.

---

**"What's the difference between `dependencies`, `devDependencies`, and `peerDependencies`?"**

→ `dependencies` are bundled/installed at runtime for consumers. `devDependencies` are only installed for development (build tools, test frameworks) — not installed when someone runs `npm install your-library`. `peerDependencies` declare "I need this in the consumer's environment" — the consumer provides it, preventing duplicate instances of singletons like React.

---

**"Your Renovate PR for `react-query@5.0.0` (major) is sitting open. Why might auto-merging it be dangerous?"**

→ Major bumps may have breaking API changes — `react-query@5` renamed `useQuery` options and changed query key structure. Auto-merging would silently break queries throughout the app. Major updates need a dedicated migration, reading the changelog, and explicit human decision.

---

**"What is `pnpm.overrides` and when would you need it?"**

→ `pnpm.overrides` forces specific dependency versions in the entire tree — same as npm `overrides`. You'd use it when two packages declare incompatible peer deps (e.g., one wants React 17, another wants React 16) and you can't upgrade the conflicting package. It's a workaround — the right fix is to upgrade the outdated package.

---

**"Why might a `0.x.x` package version range like `^0.4.0` surprise developers?"**

→ The caret with MAJOR=0 only allows PATCH updates within the same MINOR: `^0.4.0 → >=0.4.0 <0.5.0`. Most developers assume caret always allows MINOR bumps, but SemVer spec changes caret's behavior when MAJOR=0, because pre-1.0 packages may have breaking changes in MINOR bumps.

---

**"Your component library ships a CSS file with class names like `.btn-primary`. Is renaming them a MAJOR bump?"**

→ Yes, if those class names are part of the public API surface and consumers are known to override them. CSS class names in a shipped stylesheet are as much a public API as exported TypeScript types — renaming them breaks consumer override styles without any compile-time error.

---

**"What does `npm dist-tag ls my-lib` show and why is it useful?"**

→ It lists all dist-tags and their associated versions — e.g., `latest: 1.5.0`, `next: 2.0.0-rc.1`, `canary: 2.0.0-canary.20231015`. This lets consumers install specific release channels (`npm install my-lib@next`) and lets you promote a pre-release to latest when stable (`npm dist-tag add my-lib@2.0.0 latest`).

---

**"Team wants to use CalVer like `2024.1.0` for their component library. What's the risk?"**

→ CalVer doesn't encode breaking change semantics. Consumers and tooling (Renovate, npm) use SemVer to decide when a major update needs migration attention. With CalVer, every version bump looks the same — consumers can't know if `2024.2.0` is safe to auto-upgrade or requires code changes. Libraries with downstream consumers should prefer SemVer or at least follow SemVer-compatible conventions for MAJOR.

---

## Self-Check Checklist / Danh Sách Tự Kiểm Tra

Trước phỏng vấn, hãy tự trả lời được tất cả các điểm sau:

**SemVer Fundamentals**

- [ ] Tôi có thể giải thích MAJOR, MINOR, PATCH với ví dụ cụ thể không?
- [ ] Tôi biết pre-release tag ordering: alpha < beta < rc < stable?
- [ ] Tôi hiểu ZeroVer (`0.x.x`) và tại sao `^0.4.0` không cho phép `0.5.0`?
- [ ] Tôi có thể giải thích sự khác biệt giữa `^`, `~`, và exact version?

**Lockfiles & Resolution**

- [ ] Tôi có thể giải thích tại sao lockfile phải commit vào git (và ngoại lệ với published packages)?
- [ ] Tôi biết `npm ci` vs `npm install` khác nhau thế nào và khi nào dùng cái nào?
- [ ] Tôi hiểu `overrides` / `resolutions` giải quyết peer dep conflicts như thế nào?
- [ ] Tôi có thể giải thích tại sao pnpm strict mode tốt hơn npm hoisting?

**Breaking Changes**

- [ ] Tôi có thể liệt kê 3 loại breaking change: API, behavioral, TypeScript-specific?
- [ ] Tôi biết `api-extractor` và `arethetypeswrong` để làm gì?
- [ ] Tôi hiểu tại sao CSS class name rename là breaking change?
- [ ] Tôi có thể giải thích behavioral breaking change với ví dụ cụ thể?

**Monorepo Versioning**

- [ ] Tôi có thể compare fixed vs independent mode với ví dụ thực tế (Babel vs Vue ecosystem)?
- [ ] Tôi có thể walk through toàn bộ Changesets workflow từ PR đến publish?
- [ ] Tôi biết khi nào dùng `changeset version --snapshot` cho pre-releases?

**Automation**

- [ ] Tôi biết cách Conventional Commits map to SemVer bumps (feat→MINOR, fix→PATCH, BREAKING CHANGE→MAJOR)?
- [ ] Tôi có thể thiết kế Renovate `packageRules` cho tiered auto-merge policy?
- [ ] Tôi hiểu `stabilityDays` trong Renovate là gì và tại sao nó quan trọng?

**Deprecation & Incident Response**

- [ ] Tôi biết ba giai đoạn deprecation: deprecate, codemod, remove?
- [ ] Tôi biết `npm deprecate` vs `npm unpublish` khác nhau thế nào?
- [ ] Nếu tôi break downstream apps với "minor" bump, tôi biết phải làm gì ngay lập tức và systemic?

**Frontend-Specific**

- [ ] Tôi có thể giải thích khi nào thư viện nên dùng peerDependencies vs bundled deps?
- [ ] Tôi biết CDN versioning nên dùng exact version trong URL và tại sao?
- [ ] Tôi hiểu dist-tags (latest, next, canary) và cách promote một version?

---

_File này cover toàn bộ versioning surface area cho FE interviews từ Junior đến Senior. Đọc kỹ Part 3 (Breaking Changes) và Part 5 (Monorepo) — đây là hai phần tạo differentiation lớn nhất ở level Senior._
