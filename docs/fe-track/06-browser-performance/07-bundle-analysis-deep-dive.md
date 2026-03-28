# Bundle Analysis Deep Dive — Controlling What You Ship / Phân Tích Bundle Chuyên Sâu

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **L5 Competencies**: Technical Mastery (20pts), Quality & Risk (10pts)
> **Prerequisites**: [Bundle Optimization](./03-bundle-optimization.md) | [Web Performance](./04-web-performance-comprehensive.md)
> **See also**: [Core Web Vitals](./01-core-web-vitals.md) | [Observability](../08-fe-system-design/07-frontend-quality-and-observability.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Shopee frontend team notice app load time tăng 40% qua 3 tháng. Không ai biết tại sao — mỗi sprint thêm vài dependency "nhỏ". Khi chạy `webpack-bundle-analyzer`, phát hiện: (1) `moment.js` 300KB cho 1 chỗ format date, (2) `lodash` full 70KB khi chỉ dùng `debounce`, (3) duplicate React copies vì dependency conflict. Sau khi fix: bundle giảm 45%, LCP cải thiện 1.2s.

**Bài học:** Bundle size là "boiling frog" — tăng từ từ không ai thấy cho đến khi user complain. L5 engineer build guardrails (bundle budgets, CI checks) để prevent, không chỉ fix sau khi xảy ra.

---

## What & Why / Cái Gì & Tại Sao

**Bundle analysis là gì (Feynman)?** Như **kiểm tra hành lý trước chuyến bay** — bạn có giới hạn 20kg. Không kiểm tra → mang đồ thừa → quá cân → phải bỏ bớt ở sân bay (slow load). Bundle analysis = cân từng thứ trong vali, loại bỏ đồ không cần, nén đồ lại cho gọn.

**Tại sao L5 cần quan tâm?** L4 optimize khi có vấn đề. L5 **prevent** vấn đề bằng automated guardrails — bundle budgets trong CI, dependency audits, tree-shaking verification.

---

## Core Concepts / Khái Niệm Cốt Lõi

### Concept 1: Bundle Anatomy & Analysis Tools

🪝 **Memory Hook:** Bundle như **pizza delivery** — bạn giao cả hộp (JS bundle) cho customer (browser). Nếu hộp có thêm brochure, hóa đơn, coupon không cần → nặng hơn, giao chậm hơn. Bundle analyzer = mở hộp ra xem có gì bên trong.

**Layer 1 — What's in a Bundle / Lớp 1:**

```
Production Bundle Anatomy:
│
├── Application Code (~20-30% typical)
│   ├── Components, pages, routes
│   ├── Business logic, utilities
│   └── Styles (CSS-in-JS runtime if used)
│
├── Framework Runtime (~15-25%)
│   ├── React + ReactDOM (~40KB gzip)
│   ├── Next.js runtime
│   └── Router, state management
│
├── Third-party Dependencies (~40-60% ← BIGGEST!)
│   ├── UI libraries (MUI, Ant Design)
│   ├── Utility libraries (lodash, date-fns)
│   ├── Analytics, tracking SDKs
│   └── Polyfills
│
└── Dead Code (~5-15% if not tree-shaken)
    ├── Unused exports from libraries
    ├── Development-only code
    └── Unused CSS
```

**Layer 2 — Analysis Tools / Lớp 2:**

```bash
# 1. webpack-bundle-analyzer — Interactive treemap visualization
# Install: npm install -D webpack-bundle-analyzer
# next.config.js:
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer(nextConfig);
# Run: ANALYZE=true npm run build

# 2. source-map-explorer — Precise byte-level analysis
npx source-map-explorer build/static/js/*.js

# 3. bundlephobia — Check package size BEFORE installing
# Visit: bundlephobia.com/package/moment@2.29.4
# Or CLI: npx bundlephobia moment

# 4. import-cost (VS Code extension) — Inline size display
# Shows size next to every import statement in editor

# 5. size-limit — Performance budget enforcement in CI
npx size-limit
```

**Layer 3 — Reading a Treemap / Lớp 3:**

```
webpack-bundle-analyzer treemap reading guide:

┌─────────────────────────────────────────────┐
│  main.js (450KB parsed, 130KB gzip)         │
│ ┌──────────────┬────────────────────────┐   │
│ │ node_modules │     app code           │   │
│ │ ┌──────────┐ │ ┌──────┐ ┌──────────┐  │   │
│ │ │ moment   │ │ │pages │ │components│  │   │
│ │ │ 300KB!   │ │ │      │ │          │  │   │
│ │ │ ┌──────┐ │ │ │      │ │          │  │   │
│ │ │ │locale│ │ │ └──────┘ └──────────┘  │   │
│ │ │ │230KB │ │ │                        │   │
│ │ │ └──────┘ │ │                        │   │
│ │ └──────────┘ │                        │   │
│ └──────────────┴────────────────────────┘   │
└─────────────────────────────────────────────┘

Red flags to look for:
1. Disproportionately large packages (moment, lodash, AWS SDK)
2. Duplicate packages (2 versions of React, 2 versions of lodash)
3. Locale/i18n data you don't need
4. Full package imports when you only use 1 function
5. Development-only packages in production bundle
```

| Sai lầm | Tại sao sai | Đúng là |
|---------|-------------|---------|
| Never analyze bundle | "Boiling frog" — size grows silently | Analyze on every major dependency change |
| Only check gzip size | Gzip ≠ parse cost. 100KB gzip = 300KB parse → CPU-bound on mobile | Check both gzip AND parsed size |
| Ignore source maps | Can't trace bloat to specific imports | Always generate source maps for analysis |

---

### Concept 2: Tree-Shaking & Dead Code Elimination

🪝 **Memory Hook:** Tree-shaking như **rung cây** lấy quả chín — lá khô (unused code) rụng xuống, chỉ giữ lại quả (used exports). Nhưng nếu cây bị buộc dây (side effects) → rung không rụng.

**Layer 1 — How Tree-Shaking Works / Lớp 1:**

```
ESM (tree-shakable):              CJS (NOT tree-shakable):
import { debounce } from 'lodash-es';   const _ = require('lodash');
// Bundler keeps only debounce           // Bundler includes ALL of lodash
// Result: ~5KB                          // Result: ~70KB

Why CJS can't tree-shake:
- require() is dynamic → can be inside if/for
- module.exports can be computed at runtime
- Bundler can't statically determine what's used

Why ESM CAN tree-shake:
- import/export are static declarations
- Must be at top level (not inside functions)
- Bundler builds dependency graph at compile time
```

**Layer 2 — Making Tree-Shaking Work / Lớp 2:**

```javascript
// ❌ BAD: Barrel files that break tree-shaking
// components/index.ts
export { Button } from './Button';
export { Modal } from './Modal';
export { DataGrid } from './DataGrid';  // 200KB component

// Usage: import { Button } from './components';
// Risk: Bundler may include DataGrid even if unused
// (depends on "sideEffects" config)

// ✅ GOOD: Direct imports
import { Button } from './components/Button';

// ✅ GOOD: Package with sideEffects: false in package.json
// package.json of your library:
{
  "sideEffects": false,  // Tells bundler: safe to tree-shake
  // OR be specific:
  "sideEffects": ["*.css", "./src/polyfills.ts"]
}

// ✅ GOOD: Use ESM-compatible packages
// Instead of:  import moment from 'moment';        // 300KB
// Use:         import { format } from 'date-fns';  // ~5KB (tree-shakable)

// Instead of:  import _ from 'lodash';              // 70KB
// Use:         import debounce from 'lodash/debounce'; // ~5KB
// Or:          import { debounce } from 'lodash-es';   // ~5KB (ESM)
```

**Layer 3 — Verifying Tree-Shaking / Lớp 3:**

```bash
# 1. Check if package supports ESM
# Look for "module" or "exports" field in package.json:
cat node_modules/date-fns/package.json | grep -E '"module"|"exports"'

# 2. Analyze what's actually included
ANALYZE=true npm run build
# → Check treemap: is the full package included or just used parts?

# 3. Use @rollup/plugin-commonjs markers in dev
# Webpack shows warnings for CJS modules that can't be tree-shaken

# Common packages and their tree-shakable alternatives:
# moment (300KB)     → date-fns (tree-shakable) or dayjs (2KB)
# lodash (70KB)      → lodash-es or individual imports
# aws-sdk v2 (3MB!)  → @aws-sdk/client-* v3 (modular)
# antd (1.2MB)       → import from 'antd/es/button' (direct)
# material-ui        → import from '@mui/material/Button' (direct)
```

---

### Concept 3: Bundle Budgets & CI Enforcement

🪝 **Memory Hook:** Bundle budget như **giới hạn chi tiêu** — nếu không set budget → chi tiêu tăng mỗi tháng mà không biết. Budget = "main.js không quá 150KB gzip" → mỗi PR tự động check → vượt = CI fail.

**Layer 1 — Setting Budgets / Lớp 1:**

```
Bundle Budget Strategy:

Step 1: Measure current baseline
  npx size-limit → main: 142KB, vendor: 89KB

Step 2: Set targets (current + 10% buffer)
  main: 160KB, vendor: 100KB, total: 260KB

Step 3: Enforce in CI
  Every PR that exceeds budget → CI fails → must justify or optimize

Step 4: Review quarterly
  Adjust budgets as features grow (but always with justification)
```

**Layer 2 — size-limit Configuration / Lớp 2:**

```json
// package.json or .size-limit.json
[
  {
    "name": "Main bundle",
    "path": ".next/static/chunks/main-*.js",
    "limit": "160 KB",
    "gzip": true
  },
  {
    "name": "Framework",
    "path": ".next/static/chunks/framework-*.js",
    "limit": "50 KB"
  },
  {
    "name": "First Load JS (pages)",
    "path": ".next/static/chunks/pages/**/*.js",
    "limit": "80 KB"
  },
  {
    "name": "CSS",
    "path": ".next/static/css/*.css",
    "limit": "30 KB"
  }
]
```

```yaml
# GitHub Actions CI check
name: Bundle Size Check
on: [pull_request]
jobs:
  size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          # Posts comment on PR with size diff
```

**Layer 3 — Advanced Strategies / Lớp 3:**

```
Dependency Governance Process:

1. New dependency proposal:
   □ Check bundlephobia.com for size
   □ Check if tree-shakable (ESM, sideEffects: false)
   □ Check maintenance status (last commit, issues)
   □ Check alternatives (lighter? built-in?)
   □ If > 20KB gzip → requires tech lead approval

2. Quarterly dependency audit:
   npx depcheck           → find unused dependencies
   npx npm-check-updates  → find outdated packages
   npx bundle-analyzer    → visualize what's heavy

3. Automated alerts:
   - PR adds dependency > 50KB → auto-comment with warning
   - Total bundle exceeds budget → CI blocks merge
   - Duplicate packages detected → flagged in PR review
```

| Sai lầm | Tại sao sai | Đúng là |
|---------|-------------|---------|
| No bundle budget | Size grows uncontrolled | Set budget + CI enforcement from project start |
| Budget too tight | Every PR fails → team ignores budget | Current baseline + 10% buffer, review quarterly |
| Only check total size | Hides which chunk grew | Budget per chunk (main, vendor, per-page) |
| "We'll optimize later" | Tech debt compounds exponentially | Prevent with governance process + automated checks |

---

## Anti-patterns / Sai Lầm Thường Gặp

| Anti-pattern | Why it fails | Better approach |
|-------------|-------------|----------------|
| `import _ from 'lodash'` | Imports entire 70KB library | `import debounce from 'lodash/debounce'` or lodash-es |
| moment.js for formatting | 300KB with all locales | date-fns (tree-shakable) or dayjs (2KB) |
| Barrel index.ts re-exports | Breaks tree-shaking in practice | Direct imports to specific modules |
| No code splitting | Single bundle loads everything upfront | Dynamic `import()` for routes, heavy components |
| CSS-in-JS runtime in production | Runtime cost per component render | Extract to static CSS or use zero-runtime (vanilla-extract) |
| No dependency audit | Unused packages stay in bundle forever | Quarterly `npx depcheck` + review |

---

## Q&A Section — Interview Questions

### Q: What tools do you use to analyze bundle size? / Bạn dùng tools gì để phân tích bundle size? 🟢 Junior

**A:** Primary tool: `webpack-bundle-analyzer` — generates interactive treemap showing every package's size. For quick checks: `source-map-explorer` for byte-level analysis, `import-cost` VS Code extension for inline size display, and `bundlephobia.com` to check package size before installing.

"Tôi luôn chạy bundle analyzer khi thêm dependency mới hoặc khi performance regression. Nó giúp tìm ra 'thủ phạm' — thường 1-2 packages chiếm 50%+ bundle."

**💡 Interview Signal:**
- ✅ Strong: Names specific tools, explains when to use each, mentions gzip vs parsed distinction
- ❌ Weak: "I don't really check bundle size" or "I just look at the build output"

---

### Q: How do you ensure tree-shaking works effectively? / Làm sao đảm bảo tree-shaking hoạt động đúng? 🟡 Mid

**A:** Three requirements: (1) Use ESM imports (`import { x }` not `require`). (2) Ensure packages have `"sideEffects": false` in package.json. (3) Avoid barrel files that re-export everything — use direct imports.

Verify by checking the bundle analyzer output — if you import one function but the entire package appears, tree-shaking failed. Common culprits: CJS packages (lodash, moment), barrel index files, and packages with side effects.

"Tree-shaking là compile-time analysis — nó chỉ hoạt động khi bundler có thể statically analyze imports. Bất kỳ dynamic require() hay side effect nào đều phá tree-shaking."

**💡 Interview Signal:**
- ✅ Strong: Explains ESM vs CJS difference, mentions sideEffects field, knows how to verify
- ❌ Weak: "Webpack handles it automatically" without understanding prerequisites

---

### Q: Design a bundle size governance process for a team of 15 engineers. How do you prevent bundle bloat at scale? / Thiết kế quy trình quản lý bundle size cho team 15 người? 🔴 Senior

**A:** Four-layer defense:

1. **Prevention**: New dependency proposals require bundlephobia check + tech lead approval if >20KB. Dependency policy document shared with team.
2. **Automated enforcement**: `size-limit` in CI with per-chunk budgets. PR bot comments with size diff. CI fails if budget exceeded.
3. **Continuous monitoring**: Bundle size tracked per deploy. Grafana dashboard with trend lines. Alert if size increases >5% in a week.
4. **Periodic review**: Quarterly `depcheck` for unused deps. Annual dependency audit for alternatives. Budget review and adjustment.

"Governance is not about blocking — it's about making the right choice easy. When a developer sees `import-cost: 300KB` next to their import, they naturally look for alternatives."

**💡 Interview Signal:**
- ✅ Strong: Multi-layer strategy (prevent + enforce + monitor + review), considers team scale and DX
- ❌ Weak: "Just set a budget and fail CI" without governance process

🔗 **Follow-up Chain:**
1. → "A senior engineer pushes back: 'bundle budgets slow us down.' How do you handle this?"
2. → "You discover a critical feature requires a 200KB dependency that exceeds budget. What's your decision framework?"
3. → "How would you migrate a 2MB monolithic bundle to code-split architecture without breaking production?"

---

## Self-Check / Tự Kiểm Tra

> **Đóng file này lại trước khi làm.**

- [ ] **Retrieval**: Liệt kê 5 bundle analysis tools từ trí nhớ + use case cho mỗi tool.
- [ ] **Visual**: Vẽ Bundle Anatomy diagram (4 categories + typical percentage mỗi cái).
- [ ] **Application**: Chạy `npx webpack-bundle-analyzer` hoặc `ANALYZE=true npm run build` trên project bạn đang làm. Top 3 packages lớn nhất là gì? Có thể optimize không?
- [ ] **Debug**: Tại sao `import { debounce } from 'lodash'` KHÔNG tree-shake nhưng `import { debounce } from 'lodash-es'` CÓ? Giải thích cơ chế.
- [ ] **Teach**: Giải thích cho PM tại sao cần bundle budget — dùng analogy "ngân sách chi tiêu" không dùng thuật ngữ kỹ thuật.

💬 **Feynman Prompt:** Giải thích tree-shaking cho người không biết code — tại sao "bỏ đồ không dùng" không tự động xảy ra và cần setup đặc biệt?

🔁 **Spaced Repetition:** Ôn lại sau **3 ngày → 7 ngày → 14 ngày**.

---

## Connections / Liên Kết

- ⬅️ **Built on**: [Bundle Optimization](./03-bundle-optimization.md) — basic optimization techniques
- ⬅️ **Built on**: [Web Performance](./04-web-performance-comprehensive.md) — performance fundamentals
- ➡️ **Enables**: [Observability](../08-fe-system-design/07-frontend-quality-and-observability.md) — bundle monitoring in production
- 🔗 **Applied in**: [Core Web Vitals](./01-core-web-vitals.md) — bundle size directly affects LCP
- 🔗 **L5 Competency**: [Quality & Risk](../../shared/08-l5-competencies/07-quality-and-risk.md) — bundle governance as quality practice
