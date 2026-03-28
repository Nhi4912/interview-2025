# Micro-Frontends & Frontend Architecture at Scale

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Tổng Quan / Overview

Tài liệu này tập trung vào kiến trúc micro-frontends — từ nguyên lý cơ bản đến triển khai thực tế tại các công ty như Grab, Shopee, Tiki.
Mục tiêu interview: giải thích **khi nào** dùng micro-frontends (và khi nào không), **cách tích hợp** các team độc lập, và **trade-off** giữa team autonomy với operational complexity.
Không chỉ biết tên công nghệ — interviewer muốn thấy bạn đã suy nghĩ về failure modes, deployment boundaries, và UX consistency.

## Related Links / Tài Liệu Liên Quan

- Xem thêm: `./01-architecture-patterns.md`
- Xem thêm: `./06-microservices-patterns.md`
- Xem thêm: `./02-scalability.md`

---

## Section 1: Micro-Frontend Fundamentals / Nền Tảng Micro-Frontend

---

### Q01. 🟢 What are micro-frontends and why do they exist?

**Micro-frontends là gì và tại sao chúng ra đời?**

**🧠 Memory Hook:** "**Microservices for the browser** — nếu backend có thể split thành services độc lập, frontend cũng vậy. Mỗi team owns một vertical slice: UI + API + DB."

**Why does this exist? / Tại sao tồn tại?**

- Tại sao frontend monolith trở thành vấn đề? Khi có 10+ teams cùng edit một SPA: merge conflicts, one team's bug blocks everyone's deploy, bundle size tăng theo số team
- Tại sao không chỉ dùng feature flags? Feature flags giải quyết "what users see", nhưng không giải quyết "who can deploy independently" — team vẫn phải chờ nhau để release
- Tại sao micro-frontends là câu trả lời? Mỗi team owns một bounded slice của UI, có CI/CD riêng, deploy không block team khác — tương tự cách backend microservices tách theo business domain

**Definition:**
Micro-frontends là kiến trúc chia một frontend application thành các "vertical slices" nhỏ hơn, mỗi slice được owned và deployed độc lập bởi một team. Shell app (container) orchestrate các slice đó tại runtime.

```
Monolithic SPA (problem at scale):
┌────────────────────────────────────────────┐
│           Giant React SPA                  │
│  Team A + Team B + Team C + Team D         │
│  → 1 CI/CD pipeline                        │
│  → Release phải đồng bộ tất cả teams      │
│  → 1 team break → mọi team bị block        │
└────────────────────────────────────────────┘

Micro-Frontend (solution):
┌──────────────────────────────────────────────────────┐
│                  Shell / Container App                │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  Catalog MFE │  │ Checkout MFE │  │ Account MFE│  │
│  │  (Team A)    │  │  (Team B)    │  │  (Team C)  │  │
│  │  Own deploy  │  │  Own deploy  │  │ Own deploy │  │
│  └──────────────┘  └──────────────┘  └────────────┘  │
└──────────────────────────────────────────────────────┘
```

**🎯 Interview Signal:**

- Interviewer muốn nghe: "Team boundaries first, then technical implementation" — không phải "vì công nghệ hay"
- Câu mở tốt: _"Micro-frontends xuất hiện khi frontend monolith trở thành organizational bottleneck, không phải technical bottleneck. Quyết định dùng MFE phải dựa trên team structure, không phải preference về tech..."_

---

### Q02. 🟢 When should you NOT use micro-frontends?

**Khi nào KHÔNG nên dùng micro-frontends?**

**🧠 Memory Hook:** "**MFE là giải pháp cho vấn đề organizational, không phải technical** — nếu không có vấn đề tổ chức, đừng tạo thêm complexity kỹ thuật."

**Tại sao đây là câu hỏi quan trọng?**
Biết khi nào KHÔNG dùng một pattern thể hiện sự trưởng thành kỹ thuật hơn là biết cách implement nó.

**Clear "NO" signals:**

| Tình huống                      | Tại sao không dùng MFE                                        | Giải pháp tốt hơn                      |
| ------------------------------- | ------------------------------------------------------------- | -------------------------------------- |
| < 3 teams trên cùng frontend    | Không đủ team conflict để justify overhead                    | Modular Monolith với ESLint boundaries |
| MVP / startup giai đoạn đầu     | Operational cost (CI/CD, dep management) giết velocity        | Monolith SPA, refactor sau             |
| Sản phẩm single-domain đơn giản | Không có domain boundary rõ ràng để split                     | Feature folder structure               |
| Team chưa có DevOps mature      | MFE cần independent pipelines, CDN config, monitoring per MFE | Monolith trước, invest DevOps sau      |
| Sản phẩm cần UX consistency cao | MFE làm khó enforce design system uniformly                   | Monolith với shared component library  |

```
Decision Tree: Should I use Micro-Frontends?

                    > 5 teams cùng dev?
                   /                  \
                 YES                   NO
                  |                    |
      Teams cần deploy               Dùng Modular Monolith
      independently?                 (feature folders + ESLint
         /       \                    boundaries)
       YES        NO
        |          |
   Different       Dùng Modular Monolith
   tech stacks?    với shared CI/CD
    /      \
  YES       NO
   |          |
 iframe/     Module Federation
 Web Comp    hoặc Single-SPA
```

**❌ Common Mistake:**

> "Chúng tôi quyết định dùng micro-frontends để modern hơn / scale tốt hơn"

Đây là sai — MFE là trade-off, không phải upgrade. Bạn đổi **release independence** lấy **operational complexity**. Chỉ đáng nếu release independence đang là bottleneck thực sự.

**🎯 Interview Signal:**
Nếu interviewer hỏi "when to use MFE", câu trả lời smart là bắt đầu với "khi nào không dùng" — thể hiện bạn nghĩ về trade-offs, không chỉ theo trends.

---

### Q03. 🟡 What is the evolution: Monolith → Modular Monolith → Micro-frontends?

**Sự tiến hoá: Monolith → Modular Monolith → Micro-frontends**

**🧠 Memory Hook:** "**Mỗi bước tăng team autonomy nhưng cũng tăng operational overhead** — chọn điểm tối ưu cho số lượng team và maturity hiện tại."

```
STAGE 1: Monolith SPA
─────────────────────────────────────────────────
src/
├── components/           ← everyone edits here
├── pages/                ← everyone edits here
├── store/                ← shared global state
└── utils/                ← everyone edits here

✅ Fast to start
✅ Easy shared state
✅ One deploy = ship everything
❌ At scale: merge conflicts, slow CI, can't release independently
❌ Bundle grows forever: users download all teams' code

STAGE 2: Modular Monolith (Sweet Spot: 2-5 teams)
─────────────────────────────────────────────────
src/
├── modules/
│   ├── catalog/          ← Team A owns this
│   │   ├── index.ts      ← PUBLIC API (only exports)
│   │   └── __internal__/ ← private, others import = ESLint error
│   ├── checkout/         ← Team B owns this
│   └── account/          ← Team C owns this
└── shell/                ← Platform team owns this

// .eslintrc: enforce module boundaries
"@nx/enforce-module-boundaries": ["error", {
  "depConstraints": [
    { "sourceTag": "scope:checkout", "onlyDependOnLibsWithTags": ["scope:shared"] }
  ]
}]

✅ Still one deploy pipeline
✅ Enforced ownership via tooling (Nx, ESLint)
✅ Easy shared state (still same process)
❌ Teams still block each other on releases
❌ Shared bundle means shared fate in CI

STAGE 3: Micro-Frontends (5+ teams, need independent deploys)
─────────────────────────────────────────────────────────────
shell-app/              ← Platform team (host)
catalog-mfe/            ← Team A (remote, deploys independently)
checkout-mfe/           ← Team B (remote, deploys independently)
account-mfe/            ← Team C (remote, deploys independently)

✅ Fully independent deployment per team
✅ Teams can use different tech stacks if needed
✅ Fault isolation: cart breaks, catalog still works
❌ Operational complexity: N CI/CD pipelines, N monitoring setups
❌ Shared dep management (React singleton)
❌ Cross-MFE UX consistency harder to enforce
```

**🎯 Interview Signal:**
Giải thích rõ tại sao bạn không nhảy thẳng từ Monolith lên MFE. Modular Monolith là intermediate step với 80% benefits và 20% cost.

---

### Q04. 🟡 How do you define Domain-Driven Design boundaries for a micro-frontend?

**Cách xác định ranh giới DDD cho micro-frontend**

**🧠 Memory Hook:** "**Bounded Context = 1 Team = 1 MFE** — nếu 2 features luôn thay đổi cùng nhau và cùng một team own, họ thuộc về 1 MFE."

**Nguyên tắc chia boundary:**

1. **Business domain alignment** — không phải technical layer (đừng split "all forms" thành 1 MFE)
2. **Team ownership** — 1 MFE, 1 team owns. Không ai edit MFE của team khác
3. **Data coupling** — features dùng chung API/data domain → cùng MFE
4. **Change frequency** — features thay đổi cùng nhau nên cùng MFE

```
Shopee-style domain boundaries:

                    ┌─────────────────────┐
                    │    Shell App        │
                    │  (navigation, auth  │
                    │   routing, layout)  │
                    └──────────┬──────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
    ┌───────▼──────┐  ┌────────▼──────┐  ┌───────▼──────┐
    │  Product     │  │   Order /     │  │   User /     │
    │  Discovery   │  │   Checkout    │  │   Account    │
    │              │  │               │  │              │
    │  - Home feed │  │  - Cart       │  │  - Profile   │
    │  - Search    │  │  - Payment    │  │  - Orders    │
    │  - Category  │  │  - Shipping   │  │  - Reviews   │
    │  - PDP       │  │  - Order hist │  │  - Address   │
    └──────────────┘  └───────────────┘  └──────────────┘
    Team: Discovery   Team: Commerce     Team: Identity

❌ BAD split (technical):
  MFE: "all-forms"        ← couples unrelated domains
  MFE: "all-lists"        ← no business cohesion
  MFE: "shared-components" ← library, not app slice

✅ GOOD split (domain):
  MFE: "catalog"          ← product browsing & discovery
  MFE: "checkout"         ← cart, payment, order placement
  MFE: "account"          ← user identity, history, preferences
```

**Contract Definition** — each MFE must define its public API:

```typescript
// catalog-mfe/src/contract.ts
// Đây là public API của Catalog MFE — những gì Shell và MFE khác có thể import

export interface CatalogMFEContract {
  // Routes this MFE owns
  routes: ["/products", "/products/:id", "/category/:slug"];

  // Events this MFE emits
  events: {
    "catalog:product-viewed": { productId: string; source: "search" | "category" | "home" };
    "catalog:add-to-cart": { productId: string; quantity: number };
  };

  // Events this MFE listens to
  subscriptions: {
    "cart:item-added": { productId: string };
    "auth:user-logged-in": { userId: string };
  };
}

// Shell app registers this MFE:
// /products/* → load catalog-mfe bundle
// catalog-mfe emits 'catalog:add-to-cart' → shell routes to checkout-mfe
```

**🎯 Interview Signal:**
Nhắc đến "Conway's Law" — org structure mirrors system architecture. Nếu bạn split MFE trước khi có team boundary rõ ràng, sẽ tạo ra cross-team coupling.

---

### Q05. 🔴 Real Case Study: Grab Super-App Architecture

**Case Study thực tế: Kiến trúc Grab Super-App**

**Context:** Grab có 30+ teams đóng góp vào super-app: GrabFood, GrabCar, GrabMart, GrabPay, GrabHealth... Mỗi vertical phải ship features độc lập nhưng user thấy một ứng dụng thống nhất.

```
Grab Super-App Architecture (simplified):

┌────────────────────────────────────────────────────────────────┐
│                    Native Shell (iOS/Android)                   │
│              Handles: navigation, deep links, push notif       │
└─────────────────────────────┬──────────────────────────────────┘
                              │ WebView / Mini-app container
              ┌───────────────┼────────────────────────┐
              │               │                        │
    ┌─────────▼──────┐ ┌──────▼──────┐  ┌────────────▼──────┐
    │  GrabFood Web  │ │ GrabCar Web │  │  GrabPay Web      │
    │  (React)       │ │ (React)     │  │  (React)          │
    │  Team: 15 devs │ │ Team: 10    │  │  Team: 8          │
    │  Deploy: daily │ │ Deploy: 2x  │  │  Deploy: weekly   │
    │                │ │   per week  │  │  (compliance gate)│
    └────────────────┘ └─────────────┘  └───────────────────┘

Shared Infrastructure:
  - Design System: Grab Design (npm package, versioned)
  - Auth: Single token, injected by native shell
  - Analytics: Unified SDK, auto-attached by shell
  - Feature Flags: Grab Unleash, per-vertical namespacing
```

**Key Architectural Decisions:**

```typescript
// 1. Shared Design System — versioned npm package
// @grab/design-system v3.2.1
// Each MFE can pin its own version and upgrade independently
import { Button, Card, BottomSheet } from "@grab/design-system";

// 2. Native → Web communication contract
// Shell injects this into every WebView
interface GrabWebContext {
  auth: {
    getAccessToken(): Promise<string>;
    userId: string;
  };
  analytics: {
    track(event: string, props: Record<string, unknown>): void;
  };
  navigation: {
    goBack(): void;
    openDeepLink(url: string): void;
  };
  featureFlags: {
    isEnabled(flag: string): boolean;
  };
}

// Available in every MFE via window.__GRAB_CONTEXT__
const ctx = (window as any).__GRAB_CONTEXT__ as GrabWebContext;

// 3. Cross-vertical communication via URL/deep links (not direct JS calls)
// GrabFood → GrabPay is a deep link, not a function call
// This maintains hard boundary: GrabPay has zero dependency on GrabFood code
const payForOrder = (orderId: string) => {
  ctx.navigation.openDeepLink(`grab://pay?orderId=${orderId}&returnUrl=/food/order/${orderId}`);
};
```

**Key Lessons từ Grab's approach:**

1. **Shell owns auth and navigation** — không phải từng MFE. Prevents auth state divergence.
2. **Communication via deep links / URL** giữa verticals — tránh JS coupling. GrabFood không `import` gì từ GrabPay.
3. **Design system là versioned npm, không phải runtime sharing** — stability > latest
4. **Feature flags namespaced per team** — `food.new_checkout_flow` chứ không phải `new_checkout_flow`

**🎯 Interview Signal:**
Khi nói về real-world MFE, đề cập đến **cross-cutting concerns** (auth, analytics, error tracking) — đây là phần thường bị underestimate nhưng interviewer biết đó là phần khó nhất.

---

## Section 2: Integration Patterns / Các Mẫu Tích Hợp

---

### Q06. 🟡 How does Webpack Module Federation work?

**Webpack Module Federation hoạt động như thế nào?**

**🧠 Memory Hook:** "**npm = build-time sharing; Module Federation = runtime sharing** — Remote bundle được tải về trong browser của user, không phải trong CI của bạn."

**Core Concepts:**

```
Module Federation Actors:
  HOST (Shell):    App that loads remotes dynamically
  REMOTE:          App that exposes modules to be consumed
  SHARED:          Dependencies loaded once (singleton pattern)
```

**Config thực tế — Shell App (Host):**

```javascript
// shell-app/webpack.config.js
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",

      // What we consume from other teams
      remotes: {
        catalogMFE: "catalogMFE@https://catalog.shopee.vn/remoteEntry.js",
        checkoutMFE: "checkoutMFE@https://checkout.shopee.vn/remoteEntry.js",
      },

      // Dependencies shared with remotes (loaded ONCE across all MFEs)
      shared: {
        react: {
          singleton: true, // CRITICAL: only one React instance
          requiredVersion: "^18.2.0",
          eager: true, // load in initial chunk (not async)
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.2.0",
          eager: true,
        },
        // Design system shared (saves ~150kb per MFE)
        "@company/design-system": {
          singleton: true,
          requiredVersion: "^3.2.0",
        },
      },
    }),
  ],
};
```

**Config thực tế — Catalog MFE (Remote):**

```javascript
// catalog-mfe/webpack.config.js
new ModuleFederationPlugin({
  name: "catalogMFE", // Must match shell's remotes key
  filename: "remoteEntry.js", // Manifest file shell loads first

  // What this MFE exposes to other apps
  exposes: {
    "./ProductList": "./src/features/ProductList",
    "./ProductDetail": "./src/features/ProductDetail",
    // Note: expose stable interfaces, not internal utils
  },

  shared: {
    react: { singleton: true, requiredVersion: "^18.2.0" },
    "react-dom": { singleton: true, requiredVersion: "^18.2.0" },
  },
});
```

**Consuming a remote in Shell — với error boundary:**

```typescript
// shell-app/src/pages/ProductsPage.tsx
import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// This import is resolved at RUNTIME from catalog.shopee.vn
// Not during build! Shell does NOT need to rebuild when Catalog deploys.
const ProductList = lazy(() => import('catalogMFE/ProductList'));

function MFEErrorFallback({ error }: { error: Error }) {
  // Catalog MFE fails → show degraded UI, not full page crash
  return (
    <div className="mfe-error">
      <p>Không tải được danh sách sản phẩm. Vui lòng thử lại.</p>
      <button onClick={() => window.location.reload()}>Tải lại</button>
    </div>
  );
}

export function ProductsPage() {
  return (
    <ErrorBoundary FallbackComponent={MFEErrorFallback}>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList />
      </Suspense>
    </ErrorBoundary>
  );
}
```

**Runtime loading flow:**

```
User navigates to /products

1. Shell's ProductsPage renders
2. React.lazy() triggers dynamic import('catalogMFE/ProductList')
3. Browser fetches: GET https://catalog.shopee.vn/remoteEntry.js
   ↳ remoteEntry.js = manifest: { 'ProductList': 'chunk-abc123.js' }
4. Browser fetches: GET https://catalog.shopee.vn/chunk-abc123.js
5. Module Federation checks: does host already have React 18?
   ↳ YES → reuse host's React (singleton — no second instance!)
   ↳ NO  → load React from remote (fallback)
6. ProductList component renders inside Shell's React tree
```

**❌ Sai lầm thường gặp:**

| Lỗi                                       | Hậu quả                                                         | Fix                                                             |
| ----------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| Quên `singleton: true` cho React          | "Invalid hook call" lỗi, hooks bị broken silently               | Luôn set `singleton: true` cho React, react-dom                 |
| Không set `requiredVersion`               | Silent version mismatch ở production                            | Pin exact semver range trong shared config                      |
| Expose quá nhiều modules (internal utils) | Coupling tăng — breaking changes lan ra toàn hệ thống           | Chỉ expose stable public API interfaces                         |
| Không wrap remote trong ErrorBoundary     | 1 MFE crash = entire page crash                                 | Luôn ErrorBoundary + Suspense fallback cho mọi remote           |
| `eager: false` cho react trong shell      | Async chunk waterfall: shell chunk → React chunk → remote chunk | `eager: true` cho React trong shell để load trong initial chunk |

---

### Q07. 🟡 How does Single-SPA work? Lifecycle, parcels, layout engine.

**Single-SPA hoạt động như thế nào?**

**🧠 Memory Hook:** "**Single-SPA = orchestrator** — nó không biết cách render React/Vue/Angular, chỉ biết **khi nào** mount và unmount từng app."

**3 Lifecycle Methods (bắt buộc cho mọi Single-SPA app):**

```typescript
// catalog-mfe/src/single-spa-lifecycle.ts
import React from 'react';
import ReactDOM from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import { CatalogApp } from './App';

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: CatalogApp,

  // DOM element where this MFE will render
  domElementGetter: () => document.getElementById('catalog-container')!,

  errorBoundary(err, info, props) {
    return <div>Catalog failed to load: {err.message}</div>;
  },
});

// Single-SPA calls these at the right time:
export const bootstrap = lifecycles.bootstrap;  // 1. First activation — load lazy deps
export const mount = lifecycles.mount;          // 2. When route matches — render to DOM
export const unmount = lifecycles.unmount;      // 3. When route leaves — cleanup, remove from DOM
```

**Root Config (Shell) — registration:**

```typescript
// shell-app/src/single-spa-root-config.ts
import { registerApplication, start } from "single-spa";

registerApplication({
  name: "@company/catalog",

  // Load the MFE bundle (from CDN or localhost in dev)
  app: () => System.import("@company/catalog"),

  // Activity function: return true when this MFE should be active
  activeWhen: (location) => location.pathname.startsWith("/products"),

  // Props passed to the MFE at mount time
  customProps: {
    authToken: () => getAuthToken(),
    onNavigate: (path: string) => history.pushState({}, "", path),
  },
});

registerApplication({
  name: "@company/checkout",
  app: () => System.import("@company/checkout"),
  activeWhen: ["/cart", "/checkout"],
});

// Start routing — Single-SPA begins listening to URL changes
start({ urlRerouteOnly: true });
```

**Layout Engine (Single-SPA v5+):**

```html
<!-- single-spa-layout HTML template -->
<single-spa-router>
  <nav>
    <!-- Nav is always mounted, across ALL routes -->
    <application name="@company/navbar"></application>
  </nav>

  <main>
    <route path="products">
      <application name="@company/catalog"></application>
    </route>

    <route path="checkout">
      <application name="@company/checkout"></application>
    </route>

    <!-- Default route -->
    <route default>
      <application name="@company/home"></application>
    </route>
  </main>
</single-spa-router>
```

**Module Federation vs Single-SPA:**

| Tiêu chí           | Module Federation             | Single-SPA                       |
| ------------------ | ----------------------------- | -------------------------------- |
| Cơ chế             | Webpack runtime code sharing  | JS lifecycle orchestration       |
| Framework coupling | Webpack-specific              | Framework-agnostic               |
| Shared deps        | Built-in singleton management | Cần SystemJS import map          |
| Setup complexity   | Medium (webpack config)       | High (root config + lifecycles)  |
| Mixed frameworks   | Harder (React singleton)      | Natural (each app independent)   |
| Phù hợp            | Teams dùng cùng framework     | Teams dùng React + Vue + Angular |

---

### Q08. 🟢 What is build-time integration and what are its limitations?

**Build-time integration là gì và giới hạn của nó?**

**🧠 Memory Hook:** "**npm packages = publish-then-consume** — khi remote thay đổi, consumers phải update package, rebuild, redeploy. Không phải independent deployment."

**Build-time integration = shared npm packages:**

```typescript
// @company/product-card — published to npm/private registry
// catalog-mfe, homepage-mfe đều install package này

// product-card/src/index.ts
export { ProductCard } from './ProductCard';
export type { ProductCardProps } from './ProductCard.types';

// homepage-mfe/package.json
{
  "dependencies": {
    "@company/product-card": "^2.1.0"
  }
}
// homepage-mfe phải rebuild khi muốn dùng ProductCard v2.2.0
```

**Khi nào build-time tốt:**

- Shared UI component library (design system) — stable, slow-changing
- Shared utilities (date formatting, validation schemas)
- TypeScript type definitions và interfaces
- Anything that changes < once per sprint

**Khi nào build-time tệ:**

- Features cần deploy independently và thường xuyên
- Khi consumers cần latest version tự động (không muốn manual upgrade)
- Khi package change = force all consumers rebuild

```
Build-time integration deployment flow (problematic):

catalog-mfe publishes @company/product-card v2.2.0
         ↓
homepage-mfe MUST:
  1. Update package.json
  2. npm install
  3. Run tests
  4. Build
  5. Deploy
  ↑
  All of this to get catalog's update!
  This defeats the purpose of independent deployment.
```

**Heuristic:** Dùng npm packages cho **libraries** (design system, utils). Dùng Module Federation / Single-SPA cho **application slices** (feature pages, mini-apps).

---

### Q09. 🟡 iframes vs Web Components vs Script Injection — when to use each?

**So sánh: iframes, Web Components, Script Injection**

**🧠 Memory Hook:** "**iframes = prison (isolated but UX-hostile); Web Components = diplomat (portable, framework-neutral); Script injection = guest (easy entry, no isolation).**"

**Comparison:**

```
iframe:
┌─────────────────────────────────────────────┐
│  Shell App                                  │
│  ┌─────────────────────────────────────┐    │
│  │  <iframe src="https://pay.grab.vn"> │    │
│  │  ┌───────────────────────────────┐  │    │
│  │  │ Payment MFE (separate origin) │  │    │
│  │  │ - Own DOM                     │  │    │
│  │  │ - Own JS context              │  │    │
│  │  │ - No shared cookies (CORS)    │  │    │
│  │  └───────────────────────────────┘  │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
✅ Hard isolation: iframe JS crash không lan ra shell
✅ Security: cross-origin iframe = CSP protected
✅ Legacy apps: embed old Angular app inside new React shell
❌ UX: scroll-jacking, modal z-index hell, mobile keyboard issues
❌ Communication: only via postMessage (verbose, error-prone)
❌ SEO: content inside iframe not indexed
Use when: compliance (PCI-DSS payment form), embedding untrusted 3rd party

Web Components:
✅ Framework-agnostic: works in React, Vue, Angular, vanilla
✅ Shadow DOM = CSS isolation (styles don't leak in or out)
✅ Standard browser API: no library runtime needed
❌ React integration awkward (event forwarding, ref handling)
❌ SSR support limited (improving with Declarative Shadow DOM)
Use when: design system components shared across multiple frameworks

Script Injection (dynamic <script> tag):
✅ Simplest integration mechanism
✅ Works for any JS module
❌ Zero isolation: shared JS context, CSS leaks, global conflicts
❌ Hard to manage loading order and error handling
Use when: lightweight widgets, analytics scripts, simple embed cases
```

**Web Component in practice:**

```typescript
// Design system Web Component — usable in any framework
class GrabButton extends HTMLElement {
  static observedAttributes = ['variant', 'disabled'];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    const variant = this.getAttribute('variant') ?? 'primary';
    const disabled = this.hasAttribute('disabled');

    // Shadow DOM for CSS isolation
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }

    this.shadowRoot!.innerHTML = `
      <style>
        button {
          background: var(--grab-color-primary, #00B14F);
          border-radius: 8px;
          /* CSS doesn't leak out, external CSS doesn't leak in */
        }
      </style>
      <button part="button" ${disabled ? 'disabled' : ''}>
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('grab-button', GrabButton);

// Usage in React:
<grab-button variant="primary" onClick={handleClick}>
  Đặt hàng
</grab-button>

// Usage in Vue:
<grab-button variant="secondary">Huỷ</grab-button>
```

---

### Q10. 🔴 What is server-side composition for micro-frontends?

**Server-side composition trong micro-frontends là gì?**

**🧠 Memory Hook:** "**SSR micro-frontends = server assembles the page, browser gets complete HTML** — no client-side JS waterfall. Best for SEO and performance."

**Server-Side Includes (SSI) — nginx level:**

```nginx
# nginx.conf — stitches fragments at server level
location / {
  ssi on;
  ssi_silent_errors off;

  # Root template includes fragments from other services
  # nginx fetches each fragment and assembles into one HTML response
}
```

```html
<!-- Product Detail Page template (nginx serves this) -->
<!DOCTYPE html>
<html>
  <head>
    <!--# include virtual="/fragments/head?page=pdp" -->
  </head>
  <body>
    <!--# include virtual="/fragments/header" -->
    <!-- Header service -->

    <main>
      <!--# include virtual="/fragments/catalog/product?id=$arg_id" -->
      <!-- Catalog service -->
      <!--# include virtual="/fragments/reviews?productId=$arg_id" -->
      <!-- Reviews service -->
    </main>

    <!--# include virtual="/fragments/footer" -->
    <!-- Footer service -->
    <!--# include virtual="/fragments/chat-widget" -->
    <!-- Support service -->
  </body>
</html>
```

**Tailor.js (Zalando's approach) — Node.js server composition:**

```javascript
// tailor-server.js
const Tailor = require("node-tailor");
const tailor = new Tailor({
  templatesPath: "./templates",
  fetchContext: async (req) => ({
    userId: req.session.userId,
    locale: req.headers["accept-language"],
  }),
});

// Template file: templates/product-page.html
// <fragment src="https://catalog-service/product-fragment?id={{productId}}" />
// <fragment src="https://reviews-service/reviews-fragment?id={{productId}}" primary />
// <fragment src="https://recommendation-service/similar" async />
//
// 'primary' = if primary fragment fails, 500 the page
// 'async'   = if async fragment is slow, don't block page render

app.get("/product/:id", (req, res) => {
  req.params = { productId: req.params.id };
  tailor.requestHandler(req, res);
});
```

**Performance comparison:**

```
Client-side MFE loading:
  1. Browser loads shell HTML           → 50ms
  2. Browser parses, executes shell JS  → 100ms
  3. Shell fetches remoteEntry.js x3    → 150ms (3 network requests)
  4. Remotes bootstrap, render          → 200ms
  Total to first meaningful paint:      ~500ms

Server-side composition (SSI/Tailor):
  1. Nginx/Node fetches all fragments in parallel → 80ms
  2. Assembles into one complete HTML             → 10ms
  3. Browser receives complete HTML               → 50ms
  4. Browser renders                              → 50ms
  Total to first meaningful paint:               ~190ms

Trade-off:
  ✅ Server-side: faster FMP, better SEO, no client-side JS waterfalls
  ❌ Server-side: server becomes bottleneck, harder to maintain state across MFEs
  ✅ Client-side: better interactivity, offline support, progressive enhancement
```

---

### Q11. 🔴 What is edge-side composition and when to use it?

**Edge-side composition là gì và khi nào dùng?**

**🧠 Memory Hook:** "**Edge = CDN đặt logic** — bạn assemble trang HTML ở PoP gần user nhất, không phải ở origin server của bạn."

**Cloudflare Workers edge composition:**

```typescript
// cloudflare-worker.ts — runs at 200+ PoPs worldwide
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/product/")) {
      const productId = url.pathname.split("/")[2];

      // Fetch fragments in parallel from origin services
      const [headerFrag, productFrag, reviewsFrag] = await Promise.all([
        fetch(`https://header-service.internal/fragment`),
        fetch(`https://catalog-service.internal/product/${productId}/fragment`),
        fetch(`https://reviews-service.internal/reviews/${productId}/fragment?limit=3`),
      ]);

      const [header, product, reviews] = await Promise.all([
        headerFrag.text(),
        productFrag.text(),
        reviewsFrag.text(),
      ]);

      // Stitch fragments into complete HTML at edge
      const html = `
        <!DOCTYPE html>
        <html>
          ${header}
          <main>${product}</main>
          <aside>${reviews}</aside>
        </html>
      `;

      return new Response(html, {
        headers: {
          "Content-Type": "text/html",
          "Cache-Control": "public, s-maxage=30", // CDN caches assembled page
        },
      });
    }

    return fetch(request);
  },
};
```

**When to choose edge composition:**

```
Edge composition ideal for:
  ✅ High-traffic pages (product listings, home feed) — CDN caching assembled HTML
  ✅ Globally distributed users — composition at nearest PoP = low latency
  ✅ SEO-critical pages — complete HTML for crawlers, no client JS required
  ✅ Low personalisation pages — can cache at CDN layer

NOT ideal for:
  ❌ Highly personalised pages (user dashboard) — can't cache per-user
  ❌ High interactivity apps — SSR start is wasted if SPA takes over anyway
  ❌ Pages requiring heavy server auth — edge workers have limited secrets access
```

---

### Q12. 🔴 Integration pattern comparison — which to choose when?

**Bảng so sánh toàn diện các integration patterns**

```
┌─────────────────┬────────────┬──────────┬───────────┬───────────┬──────────────┐
│ Pattern         │ Isolation  │ UX       │ SEO       │ Deploy    │ Complexity   │
│                 │ Level      │ Quality  │ Support   │ Indep.    │              │
├─────────────────┼────────────┼──────────┼───────────┼───────────┼──────────────┤
│ npm packages    │ None       │ ★★★★★   │ ★★★★★    │ ★★☆☆☆    │ ★☆☆☆☆       │
│ (build-time)    │            │          │           │ (rebuild) │              │
├─────────────────┼────────────┼──────────┼───────────┼───────────┼──────────────┤
│ Module Fed.     │ Low        │ ★★★★★   │ ★★★☆☆    │ ★★★★★    │ ★★★☆☆       │
│ (Webpack 5)     │ (same DOM) │          │ (CSR)     │           │              │
├─────────────────┼────────────┼──────────┼───────────┼───────────┼──────────────┤
│ Single-SPA      │ Low-Med    │ ★★★★☆   │ ★★★☆☆    │ ★★★★★    │ ★★★★☆       │
│                 │            │          │ (CSR)     │           │              │
├─────────────────┼────────────┼──────────┼───────────┼───────────┼──────────────┤
│ Web Components  │ Medium     │ ★★★★☆   │ ★★★☆☆    │ ★★★★☆    │ ★★★☆☆       │
│                 │ (Shadow DOM│          │           │           │              │
├─────────────────┼────────────┼──────────┼───────────┼───────────┼──────────────┤
│ iframes         │ Maximum    │ ★★☆☆☆   │ ★☆☆☆☆    │ ★★★★★    │ ★★☆☆☆       │
│                 │            │ (UX poor)│ (no index)│           │              │
├─────────────────┼────────────┼──────────┼───────────┼───────────┼──────────────┤
│ SSI/Tailor      │ None       │ ★★★★★   │ ★★★★★    │ ★★★★☆    │ ★★★☆☆       │
│ (server-side)   │ (server)   │ (SSR)    │ (full HTML│           │              │
├─────────────────┼────────────┼──────────┼───────────┼───────────┼──────────────┤
│ Edge Comp.      │ None       │ ★★★★★   │ ★★★★★    │ ★★★★☆    │ ★★★★☆       │
│ (CF Workers)    │ (edge)     │ (SSR)    │ (full HTML│           │              │
└─────────────────┴────────────┴──────────┴───────────┴───────────┴──────────────┘
```

**Decision guide:**

```
What matters MOST for your case?

SEO + Performance → Server-side (SSI/Tailor/Edge)
Team independence + React ecosystem → Module Federation
Mixed frameworks (React + Vue + Angular) → Single-SPA or Web Components
Max isolation (PCI compliance, embed untrusted 3P) → iframes
Shared stable UI library → npm packages
```

---

## Section 3: Shared State & Communication / Trạng Thái Chung & Giao Tiếp

---

### Q13. 🟡 How do you communicate between micro-frontends using Custom Events?

**Giao tiếp giữa các MFE bằng Custom Events**

**🧠 Memory Hook:** "**Custom Events = window.dispatchEvent** — như radio broadcast. Bất kỳ MFE nào cũng có thể phát hoặc lắng nghe mà không cần import lẫn nhau."

**Pattern: Typed Event Bus via CustomEvents:**

```typescript
// shared/event-bus.ts — shared contract (published as npm package)
// Defines the SCHEMA of events — prevents typos and type mismatches

export type MFEEvents = {
  "cart:item-added": { productId: string; quantity: number; price: number };
  "cart:item-removed": { productId: string };
  "user:logged-in": { userId: string; name: string };
  "user:logged-out": undefined;
  "navigation:go-to": { path: string };
};

// Type-safe emit
export function emitMFEEvent<K extends keyof MFEEvents>(event: K, detail: MFEEvents[K]): void {
  window.dispatchEvent(new CustomEvent(event, { detail, bubbles: true }));
}

// Type-safe subscribe
export function onMFEEvent<K extends keyof MFEEvents>(
  event: K,
  handler: (detail: MFEEvents[K]) => void,
): () => void {
  // Returns cleanup function
  const listener = (e: Event) => handler((e as CustomEvent).detail);
  window.addEventListener(event, listener);
  return () => window.removeEventListener(event, listener);
}
```

**Usage in Catalog MFE (emitter):**

```typescript
// catalog-mfe/src/features/ProductDetail.tsx
import { emitMFEEvent } from '@company/mfe-event-bus';

function ProductDetail({ product }: { product: Product }) {
  const handleAddToCart = () => {
    // Catalog doesn't know anything about Cart MFE
    // Just broadcasts an event — Cart listens if active
    emitMFEEvent('cart:item-added', {
      productId: product.id,
      quantity: 1,
      price: product.price,
    });
  };

  return (
    <div>
      <h1>{product.name}</h1>
      <button onClick={handleAddToCart}>Thêm vào giỏ</button>
    </div>
  );
}
```

**Usage in Cart MFE (subscriber):**

```typescript
// cart-mfe/src/CartManager.tsx
import { useEffect, useState } from 'react';
import { onMFEEvent } from '@company/mfe-event-bus';

function CartManager() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Subscribe when component mounts
    const unsubscribeAdd = onMFEEvent('cart:item-added', ({ productId, quantity }) => {
      setCartCount(prev => prev + quantity);
      showToast(`Đã thêm ${quantity} sản phẩm vào giỏ`);
    });

    const unsubscribeRemove = onMFEEvent('cart:item-removed', ({ productId }) => {
      setCartCount(prev => Math.max(0, prev - 1));
    });

    // CRITICAL: cleanup to prevent memory leaks when MFE unmounts
    return () => {
      unsubscribeAdd();
      unsubscribeRemove();
    };
  }, []);

  return <CartIcon count={cartCount} />;
}
```

**❌ Sai lầm:**

- Không cleanup event listeners khi component unmount → memory leak + duplicate handlers
- Dùng string literals (`'cart:item-added'`) trực tiếp thay vì typed schema → typos gây silent bugs
- Emit quá nhiều events → debug khó vì không biết event flow

---

### Q14. 🟡 How do you share state between MFEs with an event bus / shared store?

**Chia sẻ state giữa các MFE: Event Bus vs Shared Store**

**🧠 Memory Hook:** "**Shared state là coupling** — mỗi byte state bạn chia sẻ là dependency giữa các MFE. Minimize shared state, maximize local state."

**Pattern 1: Shared Store (khi MFEs cần read/write cùng state):**

```typescript
// shared/mfe-store.ts — singleton store (instantiated once by shell)
// NOTE: chỉ dùng cho truly global state: auth, cart, locale

type StoreState = {
  auth: { userId: string | null; token: string | null };
  cart: { itemCount: number };
  locale: "vi" | "en";
};

type Listener<K extends keyof StoreState> = (value: StoreState[K]) => void;

class MFEStore {
  private state: StoreState = {
    auth: { userId: null, token: null },
    cart: { itemCount: 0 },
    locale: "vi",
  };

  private listeners = new Map<string, Set<Function>>();

  get<K extends keyof StoreState>(key: K): StoreState[K] {
    return this.state[key];
  }

  set<K extends keyof StoreState>(key: K, value: StoreState[K]): void {
    this.state[key] = value;
    this.listeners.get(key)?.forEach((fn) => fn(value));
  }

  subscribe<K extends keyof StoreState>(key: K, listener: Listener<K>): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(listener);
    return () => this.listeners.get(key)!.delete(listener);
  }
}

// Shell creates ONE instance and attaches to window
// (Module Federation shared config ensures this is truly singleton)
export const mfeStore = new MFEStore();
(window as any).__MFE_STORE__ = mfeStore;
```

**Consuming the store in any MFE:**

```typescript
// checkout-mfe/src/hooks/useMFEStore.ts
import { useEffect, useState } from 'react';

function useMFEAuthState() {
  const store = (window as any).__MFE_STORE__;
  const [auth, setAuth] = useState(store.get('auth'));

  useEffect(() => {
    return store.subscribe('auth', setAuth);
  }, []);

  return auth;
}

// Usage
function CheckoutPage() {
  const { userId } = useMFEAuthState();

  if (!userId) return <LoginPrompt />;
  return <CheckoutForm userId={userId} />;
}
```

**What state to share vs keep local:**

```
Share globally (MFE Store / Event Bus):
  ✅ Auth state (token, userId) — every MFE needs this
  ✅ Cart count (header badge) — multiple MFEs display this
  ✅ User locale/language — affects rendering everywhere

Keep local (within MFE):
  ✅ Form state — only this MFE cares
  ✅ UI state (open modals, selected tabs) — purely presentational
  ✅ Search query — catalog's concern only
  ✅ Pagination state — local to the list component
```

---

### Q15. 🔴 Implement a type-safe Pub/Sub event bus for micro-frontends

**Triển khai Pub/Sub event bus type-safe cho micro-frontends**

```typescript
// mfe-pubsub.ts — production-grade pub/sub for MFEs

type EventMap = {
  "order:placed": { orderId: string; total: number; items: string[] };
  "payment:succeeded": { orderId: string; amount: number; method: string };
  "payment:failed": { orderId: string; errorCode: string };
  "user:session-expired": undefined;
};

type Subscriber<T> = (payload: T) => void | Promise<void>;

class MFEPubSub {
  private subscribers = new Map<string, Set<Subscriber<unknown>>>();

  publish<K extends keyof EventMap>(topic: K, payload: EventMap[K]): void {
    const handlers = this.subscribers.get(topic);
    if (!handlers) return;

    handlers.forEach(async (handler) => {
      try {
        await handler(payload);
      } catch (err) {
        // Isolation: one subscriber's error doesn't break others
        console.error(`[PubSub] Error in subscriber for topic "${topic}":`, err);
      }
    });
  }

  subscribe<K extends keyof EventMap>(topic: K, handler: Subscriber<EventMap[K]>): () => void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }

    this.subscribers.get(topic)!.add(handler as Subscriber<unknown>);

    // Debug: log subscription in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[PubSub] Subscribed to "${topic}". Total: ${this.subscribers.get(topic)!.size}`);
    }

    return () => {
      this.subscribers.get(topic)?.delete(handler as Subscriber<unknown>);
    };
  }

  // Useful for debugging: see all active subscriptions
  getSubscriberCount(topic?: keyof EventMap): number {
    if (topic) return this.subscribers.get(topic)?.size ?? 0;
    return Array.from(this.subscribers.values()).reduce((sum, set) => sum + set.size, 0);
  }
}

export const pubsub = new MFEPubSub();

// checkout-mfe: publishes after order placed
pubsub.publish("order:placed", {
  orderId: "ORD-001",
  total: 150000,
  items: ["PROD-A", "PROD-B"],
});

// notification-mfe: subscribes to order events
const unsub = pubsub.subscribe("order:placed", ({ orderId, total }) => {
  showSuccessNotification(`Đơn hàng ${orderId} đã được đặt! Tổng: ${total}đ`);
});

// loyalty-mfe: also subscribes to same topic — both handlers run
pubsub.subscribe("order:placed", ({ orderId, total }) => {
  awardPoints(total);
});
```

---

### Q16. 🟢 Using URL and query params as shared state between MFEs

**Dùng URL và query params làm shared state giữa các MFE**

**🧠 Memory Hook:** "**URL là nguồn sự thật duy nhất** — bất kỳ MFE nào cũng đọc được, shareable, bookmarkable, back-button-safe."

```typescript
// URL as shared state — no JS coupling needed

// Shell controls routing — Catalog MFE reads params from URL
// catalog-mfe/src/hooks/useUrlState.ts
function useProductFilters() {
  const searchParams = new URLSearchParams(window.location.search);

  return {
    category: searchParams.get("category") ?? "all",
    priceMin: Number(searchParams.get("priceMin") ?? 0),
    priceMax: Number(searchParams.get("priceMax") ?? Infinity),
    sortBy: (searchParams.get("sortBy") as "price" | "rating") ?? "rating",
  };
}

// Catalog updates URL → Cart MFE or any other MFE can also read these params
function updateFilter(key: string, value: string) {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);

  // Push to history — triggers popstate event that Single-SPA/MFE router listens to
  window.history.pushState({}, "", url.toString());
}

// Cross-MFE context via URL:
// /checkout?productId=123&quantity=2&referrer=catalog
// Checkout MFE reads productId/quantity from URL — no direct call to Catalog MFE needed
```

**What URL state covers:**

- Current page / route (mọi MFE đọc được)
- Filters, search queries (shareable, bookmarkable)
- Active tab, selected item (for deep links)
- Flow context (referrer, campaign source)

**What URL state can't cover:**

- Sensitive data (token — never in URL)
- Large objects (cart contents — use backend)
- Ephemeral UI state (toast shown, modal open)

---

### Q17. 🟡 How does postMessage work for iframe-based MFE communication?

**postMessage hoạt động thế nào cho giao tiếp qua iframe?**

```typescript
// Shell App → sends messages TO iframe
// shell-app/src/IframeWrapper.tsx
function PaymentIframe({ orderId, amount }: { orderId: string; amount: number }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Send context to iframe after it loads
  const handleIframeLoad = () => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'PAYMENT_INIT',
        payload: { orderId, amount, currency: 'VND' },
      },
      'https://payment.company.vn', // CRITICAL: specify target origin, not '*'
    );
  };

  // Listen for messages FROM iframe
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      // CRITICAL: always validate origin
      if (event.origin !== 'https://payment.company.vn') return;

      if (event.data.type === 'PAYMENT_SUCCEEDED') {
        const { transactionId } = event.data.payload;
        onPaymentSuccess(transactionId);
      }

      if (event.data.type === 'PAYMENT_FAILED') {
        onPaymentFailed(event.data.payload.errorCode);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={`https://payment.company.vn/iframe?orderId=${orderId}`}
      onLoad={handleIframeLoad}
      sandbox="allow-scripts allow-same-origin allow-forms"
      title="Payment"
    />
  );
}

// Inside iframe (Payment MFE):
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://app.company.vn') return; // Validate parent origin

  if (event.data.type === 'PAYMENT_INIT') {
    initPaymentForm(event.data.payload);
  }
});

function notifyParent(type: string, payload: unknown) {
  window.parent.postMessage({ type, payload }, 'https://app.company.vn');
}
```

**Security checklist cho postMessage:**

1. ✅ Luôn validate `event.origin` — không dùng `'*'` khi nhận sensitive data
2. ✅ Validate `event.data` schema (zod/type guard)
3. ✅ Set `sandbox` attribute để limit iframe capabilities
4. ✅ Use `https://` — không `http://` origin
5. ❌ Không send tokens/passwords qua postMessage nếu có thể tránh

---

## Section 4: Deployment & Operations / Triển Khai & Vận Hành

---

### Q18. 🟡 What does an independent deployment pipeline look like for a MFE?

**Pipeline deployment độc lập cho MFE trông như thế nào?**

**🧠 Memory Hook:** "**Mỗi MFE = 1 CI/CD pipeline hoàn chỉnh** — team không chờ ai, không cần ai review code của mình, ship khi ready."

```yaml
# .github/workflows/catalog-mfe.yml
name: Catalog MFE Deploy

on:
  push:
    branches: [main]
    paths: ["catalog-mfe/**"] # Only trigger when catalog code changes

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        working-directory: catalog-mfe

      - name: Type check
        run: pnpm typecheck
        working-directory: catalog-mfe

      - name: Unit tests
        run: pnpm test --coverage
        working-directory: catalog-mfe

      - name: Contract tests (Pact)
        run: pnpm test:contract
        working-directory: catalog-mfe

      - name: Build
        run: pnpm build
        working-directory: catalog-mfe
        env:
          PUBLIC_URL: https://catalog-cdn.company.vn

      - name: Deploy to CDN
        run: |
          aws s3 sync ./dist s3://catalog-mfe-bucket --delete
          aws cloudfront create-invalidation --distribution-id $CDN_ID --paths "/*"
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.CATALOG_AWS_KEY }}

  e2e-smoke:
    needs: test-and-build
    runs-on: ubuntu-latest
    steps:
      - name: Smoke test on staging
        run: pnpm playwright test --grep @smoke
        # Tests: can product list load? Can user add to cart?

  notify:
    needs: e2e-smoke
    runs-on: ubuntu-latest
    steps:
      - name: Slack notification
        run: |
          curl -X POST $SLACK_WEBHOOK -d '{"text": "✅ Catalog MFE deployed to production"}'
```

**Key principle — Independent versioning:**

```
catalog-mfe v1.5.0  → deployed to https://catalog-cdn.company.vn/v1.5.0/
checkout-mfe v2.1.0 → deployed to https://checkout-cdn.company.vn/v2.1.0/

Shell's remoteEntry map (updated by each team's CI):
{
  "catalogMFE": "https://catalog-cdn.company.vn/latest/remoteEntry.js",
  "checkoutMFE": "https://checkout-cdn.company.vn/latest/remoteEntry.js"
}
// "latest" pointer updated atomically when team deploys
// Old versions kept for N days for rollback
```

---

### Q19. 🔴 How do you manage version compatibility across micro-frontends?

**Quản lý version compatibility giữa các micro-frontends như thế nào?**

**🧠 Memory Hook:** "**Backward compatibility là thứ giúp MFE thực sự độc lập** — remote phải support N versions cũ cho đến khi shell migrates."

**Compatibility Matrix:**

```
Problem: Catalog MFE exposes ProductCard v3 interface.
         Shell was built expecting ProductCard v2 interface.
         → Runtime crash!

Solution: Semver versioning + compatibility guarantee

catalog-mfe exposes versioned interfaces:
  ./ProductCard     → latest (v3) — breaking change
  ./ProductCard/v2  → deprecated, maintained for 2 sprints
  ./ProductCard/v1  → legacy, EOL date announced

// catalog-mfe/webpack.config.js
exposes: {
  './ProductCard': './src/features/ProductCard/v3',     // latest
  './ProductCard/v2': './src/features/ProductCard/v2',  // backward compat
  './ProductCard/v1': './src/features/ProductCard/v1',  // legacy support
}
```

**Contract testing with Pact (prevent breaking changes):**

```typescript
// catalog-mfe/src/contracts/ProductCard.pact.test.ts
// Pact = consumer-driven contract test
// Shell defines what it EXPECTS; Catalog must satisfy the contract

import { Pact } from "@pact-foundation/pact";

const provider = new Pact({
  consumer: "shell-app",
  provider: "catalog-mfe",
  port: 1234,
});

describe("Shell → Catalog contract", () => {
  it("ProductCard accepts productId and renders product name", async () => {
    // Shell (consumer) defines: "I need these props to work"
    await provider.addInteraction({
      state: "product 123 exists",
      uponReceiving: "a request for product 123",
      withRequest: { method: "GET", path: "/api/products/123" },
      willRespondWith: {
        status: 200,
        body: {
          id: "123",
          name: like("iPhone 15"), // Just needs to be a string
          price: like(25000000), // Just needs to be a number
        },
      },
    });

    // Shell verifies it can consume the contract
    const product = await fetchProduct("123");
    expect(product.name).toBeTruthy();
    expect(product.price).toBeGreaterThan(0);
  });
});

// When Catalog team changes ProductCard API:
// 1. They run Pact verify → if Shell's contract breaks, they MUST fix or negotiate
// 2. They cannot ship without Pact tests passing
// 3. Shell team is notified: "Catalog breaking change detected"
```

---

### Q20. 🔴 How do feature flags work in a micro-frontend architecture?

**Feature flags hoạt động như thế nào trong kiến trúc micro-frontend?**

```typescript
// Feature flags in MFE: per-team namespacing is critical

// Flag naming: {mfe_name}.{feature_name}
// NOT: new_checkout_flow  (which team owns this? ambiguous)
// YES: checkout.new_payment_step  (clearly Checkout MFE owns this)

// feature-flags/src/index.ts
interface FeatureFlagClient {
  isEnabled(flag: string, context?: { userId?: string; locale?: string }): boolean;
}

// Shell initializes and provides to all MFEs
const flags: FeatureFlagClient = createUnleashClient({
  url: 'https://flags.company.vn/api',
  clientKey: process.env.UNLEASH_CLIENT_KEY,
});

// Inject via Module Federation shared config or window
(window as any).__FEATURE_FLAGS__ = flags;

// catalog-mfe usage
function ProductList() {
  const flags = (window as any).__FEATURE_FLAGS__;

  const showNewGridLayout = flags.isEnabled('catalog.new_grid_layout', {
    userId: currentUser.id,
  });

  return showNewGridLayout ? <NewGridProductList /> : <LegacyProductList />;
}

// Staged rollout: 10% → 50% → 100%
// Flags config in Unleash dashboard (not in code)
// catalog.new_grid_layout: enabled for 10% of users in Vietnam
```

**Flags for MFE canary deployment:**

```typescript
// Shell-level flag: which version of catalog MFE to load
function getCatalogRemoteEntry(flags: FeatureFlagClient): string {
  if (flags.isEnabled("platform.catalog_v2_canary")) {
    // 5% of users get catalog MFE v2.0 (canary)
    return "https://catalog-cdn.company.vn/v2.0.0-rc/remoteEntry.js";
  }
  return "https://catalog-cdn.company.vn/latest/remoteEntry.js";
}
```

---

### Q21. 🔴 How do you implement error isolation and graceful degradation?

**Error isolation và graceful degradation trong micro-frontends**

**🧠 Memory Hook:** "**Một MFE fail không được crash toàn trang** — như microservices backend: circuit breaker, fallback, degraded mode."

```typescript
// shell-app/src/MFELoader.tsx
import React, { Suspense, lazy, Component, ErrorInfo } from 'react';

interface MFELoaderProps {
  mfeName: string;
  remoteName: string;
  modulePath: string;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
  props?: Record<string, unknown>;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

class MFEErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode; mfeName: string },
  State
> {
  state: State = { hasError: false, retryCount: 0 };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Report to monitoring (Datadog, Sentry)
    reportMFEError({
      mfe: this.props.mfeName,
      error: error.message,
      stack: info.componentStack,
    });
  }

  retry = () => {
    this.setState(s => ({ hasError: false, retryCount: s.retryCount + 1 }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mfe-error-state">
          {this.props.fallback}
          {this.state.retryCount < 2 && (
            <button onClick={this.retry} className="retry-btn">
              Thử lại / Retry
            </button>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

// Generic MFE loader with full error handling
export function MFELoader({
  mfeName,
  remoteName,
  modulePath,
  fallback = <DefaultMFEFallback />,
  loadingFallback = <Skeleton />,
  props = {},
}: MFELoaderProps) {
  // Dynamic import with timeout
  const RemoteComponent = lazy(() =>
    Promise.race([
      import(`${remoteName}/${modulePath}`),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`${mfeName} load timeout`)), 5000)
      ),
    ])
  );

  return (
    <MFEErrorBoundary fallback={fallback} mfeName={mfeName}>
      <Suspense fallback={loadingFallback}>
        <RemoteComponent {...props} />
      </Suspense>
    </MFEErrorBoundary>
  );
}

// Usage: Cart MFE fails → show empty cart state, page still works
<MFELoader
  mfeName="Cart"
  remoteName="cartMFE"
  modulePath="CartSidebar"
  fallback={
    <div className="cart-unavailable">
      Giỏ hàng tạm thời không khả dụng. Vui lòng thử lại sau.
    </div>
  }
/>
```

---

### Q22. 🔴 How do you enforce performance budgets per micro-frontend?

**Quản lý performance budget per MFE**

**🧠 Memory Hook:** "**Mỗi MFE có budget riêng** — nếu không limit, 10 MFEs x 500kb = 5MB JS. User không quan tâm đến team boundaries."

```javascript
// catalog-mfe/webpack.config.js — performance budgets
module.exports = {
  performance: {
    maxAssetSize: 250_000, // 250kb per chunk
    maxEntrypointSize: 500_000, // 500kb total for initial bundle
    hints: process.env.CI ? "error" : "warning", // CI breaks build if exceeded
  },

  optimization: {
    splitChunks: {
      chunks: "all",
      maxSize: 200_000, // Split chunks > 200kb
    },
  },
};

// Bundle size CI check in package.json scripts
// "build:analyze": "webpack-bundle-analyzer dist/stats.json"
// "size-limit": "size-limit"

// .size-limit.json
[
  {
    name: "Catalog MFE initial JS",
    path: "dist/main.*.js",
    limit: "120 kB", // Gzipped
    import: "{ ProductList }", // Tree-shaking check
  },
];
```

**Shared deps strategy để tối ưu total page weight:**

```
WITHOUT Module Federation (each MFE bundles everything):
  Shell:       React(44kb) + ReactDOM(127kb) + DS(150kb) + shell(50kb)   = 371kb
  Catalog MFE: React(44kb) + ReactDOM(127kb) + DS(150kb) + catalog(80kb) = 401kb
  Cart MFE:    React(44kb) + ReactDOM(127kb) + DS(150kb) + cart(60kb)    = 381kb
  Total user downloads: 371 + 401 + 381 = 1,153kb 🔴

WITH Module Federation (shared: singleton):
  Shell:       React(44kb) + ReactDOM(127kb) + DS(150kb) + shell(50kb)   = 371kb  (loaded once)
  Catalog MFE: catalog-only(80kb)                                         = 80kb
  Cart MFE:    cart-only(60kb)                                            = 60kb
  Total user downloads: 371 + 80 + 60 = 511kb ✅ (56% reduction)
```

---

## Section 5: Architecture & Trade-offs / Kiến Trúc & Đánh Đổi

---

### Q23. 🟡 How do you maintain consistent UX across micro-frontends?

**Duy trì UX nhất quán trên toàn bộ micro-frontends**

**🧠 Memory Hook:** "**Design system là foundation** — không có shared design system, MFE sẽ diverge về mặt visual sau 6 tháng."

**Shared Design System approach:**

```typescript
// @company/design-system — the single source of truth for UI
// Published as versioned npm package (NOT Module Federation shared)
// Reason: design system changes are intentional, not runtime-auto-updated

// design-system/src/tokens/index.ts — design tokens as the contract
export const tokens = {
  colors: {
    primary: "#00B14F", // Grab green
    secondary: "#FFD700", // Promotion yellow
    error: "#E53935",
    text: { primary: "#212121", secondary: "#757575", disabled: "#BDBDBD" },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  typography: {
    fontFamily: '"SVN-Gilroy", "Inter", sans-serif',
    size: { sm: "12px", md: "14px", lg: "16px", xl: "20px", xxl: "24px" },
  },
  breakpoints: { mobile: "768px", tablet: "1024px", desktop: "1440px" },
} as const;

// Exposed as CSS custom properties for use in non-JS contexts too:
// --color-primary: #00B14F
// --spacing-md: 16px

// Each MFE pins its design system version:
// catalog-mfe: "@company/design-system": "^3.2.0"
// checkout-mfe: "@company/design-system": "^3.2.0"

// Upgrading: Platform team releases DS v3.3.0 with new Button
// Teams upgrade at their own pace (backward compatible releases)
// Breaking change? DS bumps major version → teams have migration guide + grace period
```

**Design system governance:**

```
DS team responsibilities:
  ✅ Maintain component library (Button, Card, Input, Modal...)
  ✅ Define design tokens (colors, spacing, typography)
  ✅ Publish storybook for documentation
  ✅ Semantic versioning + changelog
  ✅ Breaking change deprecation with 2-sprint notice

MFE team responsibilities:
  ✅ Use DS components, not custom ones
  ✅ Keep DS version reasonably current (within 2 major versions)
  ✅ Report DS gaps → request new components instead of DIY
  ❌ Do NOT fork DS components into local implementations
  ❌ Do NOT override DS CSS with important! hacks
```

---

### Q24. 🔴 How do you handle authentication and authorization across MFEs?

**Authentication & Authorization trên toàn bộ micro-frontends**

**🧠 Memory Hook:** "**Auth là cross-cutting concern — Shell owns it, MFEs consume it** — không MFE nào tự login. Shell inject auth context, MFEs assume đã authenticated."

```typescript
// shell-app/src/auth/AuthProvider.tsx
// Shell is the ONLY place that handles auth flow (login, refresh, logout)

interface AuthContext {
  userId: string | null;
  token: string | null;
  roles: string[];
  isLoading: boolean;
  logout: () => void;
}

const AuthCtx = React.createContext<AuthContext>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<Omit<AuthContext, 'logout'>>({
    userId: null, token: null, roles: [], isLoading: true,
  });

  useEffect(() => {
    // Token refresh logic — ONLY in shell
    const refresh = async () => {
      const token = await refreshAccessToken();
      if (token) {
        const decoded = decodeJWT(token);
        setAuth({ userId: decoded.sub, token, roles: decoded.roles, isLoading: false });
        // Publish to MFEs that don't use React context
        (window as any).__MFE_STORE__?.set('auth', { userId: decoded.sub, token });
      }
    };

    refresh();
    const interval = setInterval(refresh, 4 * 60 * 1000); // Refresh every 4min
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthCtx.Provider value={{ ...auth, logout: handleLogout }}>
      {children}
    </AuthCtx.Provider>
  );
}

// MFEs consume auth — two patterns:
// 1. If MFE is in same React tree (Module Federation):
//    const { userId, token } = useAuth(); // from @company/auth-hooks

// 2. If MFE is isolated (iframe, different React root):
//    const { userId, token } = (window as any).__MFE_STORE__.get('auth');

// Authorization: per-MFE route guards
function CatalogSellerTools() {
  const { roles } = useAuth();

  if (!roles.includes('seller')) {
    return <AccessDenied requiredRole="seller" />;
  }

  return <SellerDashboard />;
}
```

**Token sharing strategy:**

```
❌ BAD: Each MFE handles its own login/refresh
  → Multiple login dialogs, token refresh races, inconsistent auth state

✅ GOOD: Shell owns token, shares via:
  Option A: Shared store (window.__MFE_STORE__.auth)
  Option B: Module Federation shared context
  Option C: HTTP-only cookie (most secure — no JS access needed)

For cross-origin MFEs:
  Shell → remote: inject token as prop at mount time
  OR: Shared auth domain (auth.company.vn) with shared cookies
```

---

### Q25. 🔴 Unified router vs per-MFE routing — how to decide?

**Unified router vs routing per MFE — cách quyết định?**

**🧠 Memory Hook:** "**Shell owns top-level routes, MFEs own sub-routes** — /checkout/_ là của Checkout MFE, nhưng shell quyết định /checkout/_ belongs to Checkout MFE."

```typescript
// shell-app/src/routing/ShellRouter.tsx
// Shell owns: WHICH MFE handles WHICH top-level path segment
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const CatalogMFE = lazy(() => import('catalogMFE/App'));
const CheckoutMFE = lazy(() => import('checkoutMFE/App'));
const AccountMFE = lazy(() => import('accountMFE/App'));

export function ShellRouter() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          {/* Shell hands control of ALL sub-routes to each MFE */}
          <Route path="/products/*" element={<CatalogMFE />} />
          <Route path="/checkout/*" element={<CheckoutMFE />} />
          <Route path="/account/*" element={<AccountMFE />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}

// catalog-mfe — owns its own sub-routes
// Shell just mounts <CatalogMFE />, no knowledge of catalog's internal routes
function CatalogApp() {
  return (
    <Routes>
      {/* These are relative to /products/ */}
      <Route index element={<ProductListPage />} />
      <Route path=":productId" element={<ProductDetailPage />} />
      <Route path="category/:slug" element={<CategoryPage />} />
      <Route path="search" element={<SearchResultsPage />} />
    </Routes>
  );
}
```

**Navigation between MFEs (no JS coupling):**

```typescript
// catalog-mfe wants to navigate to checkout — but cannot import checkoutMFE

// ✅ Correct: use standard browser navigation
function ProductDetail({ product }: { product: Product }) {
  const handleBuyNow = () => {
    // Shell's router handles /checkout/* → loads CheckoutMFE
    // Catalog has ZERO knowledge of how checkout works
    window.location.href = `/checkout?productId=${product.id}&qty=1`;
    // OR: window.history.pushState({}, '', `/checkout?productId=${product.id}`);
  };

  return <button onClick={handleBuyNow}>Mua ngay</button>;
}

// ❌ Wrong: direct cross-MFE navigation
// import { useNavigate } from 'react-router-dom'; // from checkoutMFE's router?
// This breaks isolation!
```

---

### Q26. 🔴 What is the testing strategy for micro-frontend architectures?

**Chiến lược testing cho kiến trúc micro-frontends**

**🧠 Memory Hook:** "**Testing pyramid in MFE = many unit/component + contract tests + few E2E** — E2E chạy full stack tests, contract tests ensure MFEs don't break each other."

```
MFE Testing Pyramid:

                    ┌─────────────┐
                    │    E2E      │  ← Few (slow, brittle)
                    │  (Playwright│    Test: user journey across MFEs
                    │   Cypress)  │    e.g., search → add cart → checkout
                    └──────┬──────┘
                    ┌──────▼──────┐
                    │  Contract   │  ← Medium (fast, prevents breaking changes)
                    │  (Pact)     │    Shell ↔ Catalog, Shell ↔ Checkout
                    └──────┬──────┘
               ┌───────────▼───────────┐
               │  Integration Tests    │  ← Per MFE (medium speed)
               │  (React Testing Lib)  │    Test MFE in isolation with mock shell
               └───────────┬───────────┘
        ┌──────────────────▼──────────────────┐
        │       Unit Tests (Vitest)            │  ← Many (fast)
        │  Services, hooks, utilities, stores  │    No DOM needed
        └─────────────────────────────────────┘
```

**Contract testing example (most important for MFE):**

```typescript
// checkout-mfe/src/tests/cart-contract.test.ts
// Checkout MFE is a CONSUMER of Cart MFE's events
// This test defines: "I (Checkout) expect Cart to send me THIS event shape"

import { EventContractTest } from '@company/mfe-test-utils';

describe('Checkout → Cart contract', () => {
  it('cart:item-added event has required fields', () => {
    const schema = EventContractTest.defineSchema('cart:item-added', {
      productId: expect.any(String),
      quantity: expect.any(Number),
      price: expect.any(Number),
    });

    // If Cart team changes this event shape, THIS TEST FAILS
    // Cart team cannot deploy without making this test pass
    expect(schema).toBeValid();
  });
});

// catalog-mfe/src/tests/shell-contract.test.ts
// Catalog is a PROVIDER — Shell consumes it
// This verifies Catalog's public interface is intact

describe('Catalog MFE public interface', () => {
  it('exposes ProductList component with required props', async () => {
    const { ProductList } = await import('../features/ProductList');

    render(
      <ProductList
        categoryId="electronics"
        onProductClick={jest.fn()}
      />
    );

    expect(screen.getByRole('list')).toBeInTheDocument();
    // If Team Catalog removes onProductClick prop → contract test fails
    // Shell team is protected from silent breaking changes
  });
});
```

**E2E: cross-MFE user journey:**

```typescript
// e2e/tests/purchase-flow.spec.ts (Playwright)
// Tests the COMPLETE user journey across multiple MFEs

test("user can search, add to cart, and checkout", async ({ page }) => {
  await page.goto("/");

  // Step 1: Catalog MFE — search
  await page.getByPlaceholder("Tìm kiếm").fill("iPhone 15");
  await page.getByRole("button", { name: "Tìm" }).click();
  await expect(page.getByTestId("product-list")).toBeVisible();

  // Step 2: Catalog MFE — view product
  await page.getByTestId("product-card").first().click();
  await expect(page.url()).toContain("/products/");

  // Step 3: Catalog → Cart MFE communication via event
  await page.getByRole("button", { name: "Thêm vào giỏ" }).click();
  await expect(page.getByTestId("cart-count")).toHaveText("1");

  // Step 4: Checkout MFE
  await page.getByTestId("cart-icon").click();
  await page.getByRole("button", { name: "Thanh toán" }).click();
  await expect(page.url()).toContain("/checkout");
  await expect(page.getByTestId("checkout-form")).toBeVisible();
});
```

---

### Q27. 🔴 How do you migrate from a monolith to micro-frontends?

**Chiến lược di cư từ monolith sang micro-frontends**

**🧠 Memory Hook:** "**Strangler Fig pattern** — wrap monolith với shell mới, migrate từng route một, không rewrite hoàn toàn."

```
Strangler Fig Migration Strategy:

Phase 0: Current State
┌─────────────────────────────────────────────┐
│            Legacy React Monolith            │
│  /home /products /cart /checkout /account  │
│  All teams deploy together                  │
└─────────────────────────────────────────────┘

Phase 1: Add Shell Wrapper (Week 1-2)
┌─────────────────────────────────────────────┐
│           New Shell App (thin)              │
│  ┌─────────────────────────────────────┐    │
│  │     Legacy Monolith (unchanged)     │    │
│  │  /home /products /cart /checkout    │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
Goal: Shell routes all traffic to monolith (no behavior change yet)
Risk: Very low — shell is a passthrough

Phase 2: Extract first MFE (Sprint 3-4)
┌─────────────────────────────────────────────┐
│              Shell App                      │
│  /account/* ──────────────► Account MFE    │← NEW, deployed independently
│  /products/* ──────────────► Legacy Mono   │
│  /* ────────────────────────► Legacy Mono   │
└─────────────────────────────────────────────┘
Extract: start with LEAST coupled domain (Account = lowest dependency)
Validate: AB test Account MFE vs Legacy for 2 weeks
Rollout: if metrics equal, switch 100%

Phase 3-N: Extract more MFEs
  /products/* → Catalog MFE  (after Account proven)
  /cart/*     → Cart MFE
  /checkout/* → Checkout MFE  (most complex, extract last)

Phase Final: Deprecate Legacy Monolith
  Legacy routes = zero → decommission legacy deploy
```

**Key migration decisions:**

```typescript
// Feature flag controls rollout — can rollback anytime
function ShellRouter() {
  const flags = useFeatureFlags();

  return (
    <Routes>
      {/* Gradual migration: flag controls which version serves /account */}
      <Route
        path="/account/*"
        element={
          flags.isEnabled('platform.account_mfe_rollout')
            ? <AccountMFE />              // New MFE
            : <LegacyMonolithFrame path="/account" /> // Old code
        }
      />

      {/* Everything else: still in legacy */}
      <Route path="/*" element={<LegacyMonolithFrame />} />
    </Routes>
  );
}

// LegacyMonolithFrame: embed legacy SPA inside new shell via iframe or script injection
function LegacyMonolithFrame({ path }: { path: string }) {
  return (
    <iframe
      src={`https://legacy.shopee.vn${path}`}
      style={{ width: '100%', height: '100%', border: 'none' }}
      title="Legacy App"
    />
  );
}
```

**Migration checklist:**

```
✅ Before extracting any MFE:
  - Shell app in production routing all traffic to legacy (no behavior change)
  - Design system npm package extracted and used by at least 1 team
  - Shared auth pattern decided and working in shell
  - CI/CD pipeline template ready for teams to copy
  - Monitoring / error reporting works per MFE

✅ When extracting each MFE:
  - Start with lowest-dependency domain (often Account or Profile)
  - Contract tests written for cross-MFE communication
  - Feature flag gates the migration (instant rollback)
  - Performance measured before/after (bundle size, LCP)
  - E2E tests cover critical paths through the new MFE

❌ Common migration mistakes:
  - Extracting Checkout first (most coupled, most risky)
  - Not writing contract tests (silent breaking changes later)
  - Trying to rewrite AND migrate simultaneously (double risk)
  - Removing legacy code before new MFE proves stable in prod
```

---

## Self-Check / Kiểm Tra Kiến Thức

**Junior (🟢) — should answer confidently:**

- [ ] Micro-frontend là gì? Nói được 1 câu ngắn gọn, 1 ví dụ thực tế
- [ ] Khi nào KHÔNG dùng MFE? Nêu được ít nhất 3 tình huống
- [ ] Module Federation là gì? Giải thích `remotes`, `exposes`, `shared: singleton`
- [ ] Custom Events dùng để làm gì trong MFE communication?
- [ ] Build-time vs runtime integration — khác nhau thế nào?

**Mid-Level (🟡) — should explain with code:**

- [ ] Viết Webpack Module Federation config cho 1 host + 2 remotes với React singleton
- [ ] Implement Custom Event bus với TypeScript types
- [ ] Giải thích Single-SPA lifecycle: bootstrap, mount, unmount
- [ ] Thiết kế domain boundaries cho một e-commerce app (3 MFEs, giải thích tại sao)
- [ ] Làm sao đảm bảo UX consistency? Shared design system như thế nào?

**Senior (🔴) — should discuss trade-offs and architecture:**

- [ ] Thiết kế complete MFE architecture cho Shopee-scale app (30+ teams)
- [ ] Giải thích contract testing với Pact — tại sao quan trọng hơn E2E?
- [ ] Strangler Fig migration strategy — bắt đầu extract từ domain nào, tại sao?
- [ ] Performance budget per MFE — làm sao enforce? Total page weight calculation?
- [ ] Auth cross-MFE: token sharing, refresh, cross-origin cases
- [ ] Edge composition vs client-side MFE — khi nào dùng cái nào?
- [ ] Version compatibility matrix — backward compat policy cho team khác

---

## Real-World Case Studies / Case Study Thực Tế

### Tiki — Migration từ monolith sang Module Federation

**Problem:** 20 teams trên 1 React monolith, release mỗi 2 tuần, deploy vào tối thứ 6 (low traffic), often có bugs do merge conflicts.

**Solution timeline:**

1. **Tháng 1:** Extract shell app, legacy monolith runs inside shell. Zero behavior change. Validate monitoring works.
2. **Tháng 2-3:** Extract Account MFE (lowest coupling). Feature flagged. A/B tested vs legacy.
3. **Tháng 4-5:** Design system published as npm package `@tiki/design-system`. All teams consume it.
4. **Tháng 6-8:** Extract Catalog MFE. Contract tests written between Catalog ↔ Cart.
5. **Tháng 9-12:** Extract Cart, Checkout, Seller tools.

**Outcome:**

- Catalog team: release từ 2 tuần → hàng ngày
- Bundle size per route: giảm 60% (shared React/DS not re-bundled per MFE)
- Deploy incidents: giảm 80% (isolated deploys, no merge conflicts)

---

### Shopee — Edge Composition cho Product Pages

**Problem:** Product listing pages cần SEO (full HTML cho Google), nhưng cần MFE architecture cho team independence.

**Solution:** Hybrid approach

- Marketing pages (SEO critical): Edge composition via Cloudflare Workers — fragments assembled at edge, Google crawls full HTML
- App pages (post-login): Client-side Module Federation — user already authenticated, SEO not needed
- Shell: Next.js (SSR for public routes, CSR for authenticated routes)

**Key insight:** Không có one-size-fits-all. Same app, different patterns for different route categories.

---

### Grab — Cross-team Design System Governance

**Problem:** 40+ teams building feature pages for Grab super-app. After 6 months without governance, ~12 different button styles, 3 different color palettes.

**Solution:**

1. **Design System team** created (dedicated 5-person team)
2. **Weekly design review** — teams must get DS team approval before custom components
3. **Automated visual regression testing** (Percy/Chromatic) — blocks PR if DS components visually differ between MFEs
4. **DS adoption metric** — tracked % of UI built with DS components vs custom. Target: 90%+

**Lesson:** Technical solution (npm package) alone isn't enough — need process and governance to prevent divergence.

---

## Interview Quick Reference / Tham Khảo Nhanh Phỏng Vấn

```
🔥 MOST ASKED questions:
1. "What is micro-frontends?" → Team autonomy + deployment independence
2. "Module Federation how?" → remotes/exposes/shared:singleton config
3. "How to share state?" → Custom Events for loose coupling, shared store for tight coupling
4. "When NOT to use?" → < 5 teams, MVP, no DevOps maturity

🔥 DIFFERENTIATORS (shows senior thinking):
- Start with "when NOT to use" before "how to implement"
- Mention Conway's Law: org structure mirrors system design
- Contract testing > E2E for MFE correctness
- Performance budget total across all MFEs
- Migration = Strangler Fig, not big bang rewrite

🔥 COMMON MISTAKES interviewees make:
- "MFE is always better" (wrong — it's a trade-off)
- Can't explain React singleton issue with Module Federation
- No mention of error boundaries (1 MFE failure = page crash)
- Forget about shared design system → UX divergence
- Can't explain how auth works across MFEs
```
