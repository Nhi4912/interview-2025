# Module Federation Deep Dive — Liên Kết Module Runtime

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Micro-Frontends at Scale](./03-micro-frontends-scale.md), [Web Components & Shadow DOM](./01-web-components-shadow-dom.md), basic Webpack/Vite bundler knowledge
> **See also**: [Micro-Frontends at Scale](./03-micro-frontends-scale.md) | [Web Security — CSP & XSS](../07-web-security/) | [FE System Design](../08-fe-system-design/)

> **Note**: File này đi sâu vào **Module Federation cụ thể**. Chiến lược MFE tổng quát (iframe, Web Components, SSI) đã được cover trong `03-micro-frontends-scale.md` — không nhắc lại ở đây.

---

## Real-World Scenario / Tình Huống Thực Tế

Năm 2019, **Zack Jackson** — một engineer tại Lululemon — đang đau đầu với một vấn đề mà mọi công ty lớn đều gặp: làm sao để 12 team frontend độc lập ship code mà không phải chờ nhau deploy cùng lúc? npm packages không đủ — bạn vẫn phải rebuild và redeploy toàn bộ host app mỗi khi một remote package thay đổi. Monorepo giải quyết một phần nhưng vẫn tạo ra build-time coupling.

Zack Jackson đề xuất một ý tưởng: **tại sao không load JavaScript modules trực tiếp từ remote URL tại runtime — sau khi page đã load — và share dependencies một cách thông minh?** Ý tưởng này trở thành **Module Federation**, được ship lần đầu trong **Webpack 5** (tháng 10/2020) và sau đó trở thành nền tảng của toàn bộ micro-frontend ecosystem hiện đại.

**Các case thực tế đã xác nhận model này:**

- **Microsoft Teams** web client dùng Module Federation để 50+ team ship UI shells và conversation features độc lập — mỗi team có deployment pipeline riêng, không có release coordination overhead
- **Shopify Storefront** (2022–2023) dùng federated modules cho checkout extensions — merchant apps có thể inject React components vào checkout flow của Shopify mà không cần Shopify rebuild app của họ
- **Hello Fresh** (2021) dùng Module Federation để tách checkout, menu selection, và account management thành independent remotes, giảm từ 1 monthly release xuống multiple deploys mỗi ngày
- **ByteDance Lynx** (2023–2024) — engine cross-platform của ByteDance — áp dụng federation concept cho component sharing giữa TikTok web và mobile web targets
- **Vercel** đã publicly support Module Federation trong Next.js qua `@module-federation/nextjs-mf` (community package), và năm 2024 chính thức có tài liệu hướng dẫn tích hợp
- **Module Federation 2.0** launch chính thức vào năm 2024, với runtime API mới, dynamic manifest-based remotes, và hỗ trợ native cho Rspack và Vite

Ngày nay, một candidate phỏng vấn vị trí Senior FE tại Grab, Axon, hay Microsoft mà không biết Module Federation là một điểm trừ đáng kể — đây không còn là "emerging tech" mà là production-proven infrastructure.

---

## What & Why / Cái Gì & Tại Sao

**Module Federation** = cơ chế cho phép một JavaScript application (host) load JavaScript modules từ một application khác (remote) **tại runtime**, không phải tại build time.

```
WITHOUT Module Federation (build-time coupling):
────────────────────────────────────────────────
host-app/ depends on @company/checkout (npm)
  → checkout team updates component
  → publish new npm version
  → host team updates package.json
  → host team rebuilds + redeploys
  ← Total coupling: ~hours to days

WITH Module Federation (runtime federation):
────────────────────────────────────────────
host-app loads checkout/Button from https://checkout.company.com/remoteEntry.js
  → checkout team updates component
  → checkout team deploys new remoteEntry.js
  ← host app picks up changes on NEXT PAGE LOAD
  ← Total coupling: 0 (deploy independent)
```

**Tại sao npm packages không đủ?**

→ **Why?** npm tạo ra **build-time coupling** — host phải rebuild mỗi khi dep thay đổi.
→ **Why?** Module Federation tạo ra **runtime coupling** — host discover và load remote code sau khi browser đã load host bundle.
→ **Why?** Đây là sự khác biệt giữa "library" (shared code baked in at build) và "federation" (shared code resolved at runtime from live endpoint).

---

## ASCII Topology Map / Bản Đồ Topology

```
MODULE FEDERATION RUNTIME TOPOLOGY
────────────────────────────────────────────────────────────────────────

                    ┌─────────────────────────────────┐
                    │           SHARE SCOPE             │
                    │  (negotiated at runtime in mem)  │
                    │  react@18.2.0  ← singleton       │
                    │  react-dom@18.2.0 ← singleton    │
                    │  lodash@4.17  ← NOT singleton     │
                    └──────────────┬──────────────────┘
                                   │ share resolution
                  ┌────────────────┼────────────────┐
                  │                │                │
         ┌────────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
         │   HOST APP    │  │  REMOTE-A   │  │  REMOTE-B   │
         │  (shell)      │  │ (checkout)  │  │  (account)  │
         │               │  │             │  │             │
         │ remoteEntry   │  │ remoteEntry │  │ remoteEntry │
         │ .js (tiny)    │  │ .js         │  │ .js         │
         │               │  │             │  │             │
         │ webpack.mf:   │  │ exposes:    │  │ exposes:    │
         │  remotes: {   │  │  ./Button   │  │  ./Profile  │
         │   checkout,   │  │  ./Cart     │  │  ./Settings │
         │   account     │  │             │  │             │
         │  }            │  │             │  │             │
         └──────┬────────┘  └─────────────┘  └─────────────┘
                │
                │  at runtime: fetch remoteEntry.js → register container
                │              negotiate shared deps → load exposed module
                ▼
         ┌──────────────────────────────────────────────────┐
         │  SHARE SCOPE RESOLUTION ALGORITHM               │
         │                                                  │
         │  1. Host registers its own deps in shareScope    │
         │  2. Remote loads → registers its deps            │
         │  3. For each shared dep:                         │
         │     - If singleton=true: first loaded version   │
         │       WINS; subsequent remotes reuse it          │
         │     - If singleton=false: each remote gets       │
         │       its own copy (no version negotiation)      │
         │     - If requiredVersion conflict + singleton:   │
         │       console.warn("version mismatch") but       │
         │       still reuse the singleton (may break!)     │
         │  4. Result: single React instance across all    │
         │     remotes (hooks work correctly)               │
         └──────────────────────────────────────────────────┘

BIDIRECTIONAL FEDERATION (host is also a remote):
──────────────────────────────────────────────────
         ┌─────────────┐          ┌─────────────┐
         │   APP-A     │◄────────►│   APP-B     │
         │  exposes:   │          │  exposes:   │
         │  ./Header   │          │  ./Footer   │
         │  remotes:   │          │  remotes:   │
         │    appB     │          │    appA     │
         └─────────────┘          └─────────────┘
         ⚠️  Circular dependency risk — avoid deep cycles
```

---

## Comparison Matrix / Bảng So Sánh Kiến Trúc MFE

| Approach                          | Load Latency            | Isolation          | Deploy Independence   | Framework Lock-in      | Complexity | Best For                                  |
| --------------------------------- | ----------------------- | ------------------ | --------------------- | ---------------------- | ---------- | ----------------------------------------- |
| **Build-time MFE** (npm monorepo) | ~0ms (bundled)          | ❌ Shared process  | ❌ Must redeploy host | ❌ Same framework      | Low        | Small teams, tight coupling OK            |
| **iframe MFE**                    | ~100–500ms (new page)   | ✅ Full process    | ✅ Deploy anything    | ✅ Any framework       | Medium     | Max isolation, security-critical portals  |
| **Web Components MFE**            | ~50–150ms (CE parse)    | 🟡 Shadow DOM only | ✅ Independent deploy | ✅ Framework-agnostic  | Medium     | Design systems, cross-team widgets        |
| **Module Federation**             | ~20–80ms (remote fetch) | 🟡 Shared process  | ✅ Independent deploy | 🟡 Same bundler family | High       | Large React/Vue orgs, runtime updates     |
| **SSI (Server-Side Includes)**    | ~0ms (server-composed)  | 🟡 Template-level  | ✅ Independent deploy | ✅ Any                 | Low-Medium | Content-heavy, CDN-edge composition       |
| **Edge-side Includes (ESI)**      | ~0ms (CDN edge)         | ✅ CDN-level       | ✅ Independent deploy | ✅ Any                 | Medium     | Varnish/CDN infra, personalized fragments |

**🇻🇳 Tóm tắt**: Module Federation nằm ở sweet spot giữa isolation và performance. iframe cho max isolation nhưng chậm và UX khó. Build-time monorepo nhanh nhưng coupling cao. MF cho deploy independence + reasonable latency + shared framework ecosystem.

---

## Part 1: Core Mechanics / Cơ Chế Nền Tảng

### Section 1.1: Webpack 5 ModuleFederationPlugin

Cấu hình cơ bản của host và remote:

```typescript
// webpack.config.ts — REMOTE APP (checkout team)
import { ModuleFederationPlugin } from "webpack/container";
import type { Configuration } from "webpack";

const config: Configuration = {
  plugins: [
    new ModuleFederationPlugin({
      // Tên container — dùng để host reference
      name: "checkout",

      // File được expose để host load (phải accessible via URL)
      filename: "remoteEntry.js",

      // Modules được expose ra ngoài
      exposes: {
        // key: import path người dùng dùng
        // value: relative path trong app này
        "./Button": "./src/components/Button",
        "./CartSummary": "./src/components/CartSummary",
        "./CheckoutFlow": "./src/pages/CheckoutFlow",
      },

      // Dependencies share với host/remotes khác
      shared: {
        react: {
          singleton: true, // Chỉ một instance trong toàn app
          requiredVersion: "^18.0.0",
          eager: false, // Không bundle vào main chunk
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.0.0",
          eager: false,
        },
        // Design system — singleton để style consistent
        "@company/design-system": {
          singleton: true,
          requiredVersion: "^2.0.0",
        },
      },
    }),
  ],
};

export default config;
```

```typescript
// webpack.config.ts — HOST APP (shell team)
import { ModuleFederationPlugin } from "webpack/container";
import type { Configuration } from "webpack";

const config: Configuration = {
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",

      // Khai báo remotes — key là tên dùng trong import
      remotes: {
        // 'checkout' là tên container (phải match remote's `name`)
        // URL là nơi remoteEntry.js được serve
        checkout: "checkout@https://checkout.company.com/remoteEntry.js",
        account: "account@https://account.company.com/remoteEntry.js",
        analytics: "analytics@https://analytics.company.com/remoteEntry.js",
      },

      shared: {
        react: { singleton: true, requiredVersion: "^18.0.0", eager: false },
        "react-dom": { singleton: true, requiredVersion: "^18.0.0", eager: false },
        "@company/design-system": { singleton: true, requiredVersion: "^2.0.0" },
      },
    }),
  ],
};

export default config;
```

```typescript
// src/App.tsx — HOST: importing from remote
import React, { Suspense, lazy } from 'react';

// Module Federation: webpack resolves this to the remote at runtime
// The string 'checkout/CartSummary' = remote name + exposed path
const CartSummary = lazy(() => import('checkout/CartSummary'));
const CheckoutFlow = lazy(() => import('checkout/CheckoutFlow'));

export function App() {
  return (
    <div>
      <h1>Shell App</h1>
      <Suspense fallback={<div>Loading cart...</div>}>
        <CartSummary />
      </Suspense>
      <Suspense fallback={<div>Loading checkout...</div>}>
        <CheckoutFlow />
      </Suspense>
    </div>
  );
}
```

**💡 Critical Detail**: Host phải có một `bootstrap.ts` file để defer synchronous imports — đây là "async boundary" requirement của Module Federation:

```typescript
// src/index.ts — DO NOT import app directly here
// This is the async boundary trick — required for MF to work
import('./bootstrap');

// src/bootstrap.ts — actual app entry
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

**Tại sao cần async boundary?** Webpack cần runtime để resolve shared modules trước khi execute synchronous imports. Nếu import React trực tiếp ở `index.ts`, Webpack không có cơ hội check shareScope và negotiate versions trước khi React được load.

---

### Section 1.2: Shared Dependencies & Singletons — The React Crash Problem

Đây là vấn đề quan trọng nhất và hay bị hỏi nhất trong phỏng vấn.

**Vấn đề**: React sử dụng module-level state (hooks dispatcher, current fiber, etc.). Nếu host và remote load **hai bản React khác nhau**, hooks sẽ crash vì chúng gọi vào dispatcher của hai React instances khác nhau.

```
ERROR: Invalid hook call. Hooks can only be called inside of the body of a
function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
```

**Giải pháp: `singleton: true`**

```typescript
// shared config cho cả host và remote
shared: {
  react: {
    singleton: true,       // ← KEY: chỉ load 1 instance
    requiredVersion: '^18.2.0',
    strictVersion: false,  // warn nhưng không fail khi mismatch
    // strictVersion: true → throw error nếu version không match requiredVersion
    eager: false,          // lazy load (recommended)
    // eager: true → bundle vào main chunk (tránh async chunk overhead)
    //               cần dùng khi app không có async boundary
  },
}
```

**Version negotiation flow:**

```
HOST shareScope: { react: { '18.2.0': { get, loaded: false } } }
REMOTE-A loads  → shareScope: { react: { '18.2.0': { get, loaded: true } } }
REMOTE-B loads  → same version → reuse loaded instance ✅

REMOTE-C loads với react@17.0.2 + singleton: true:
  → console.warn: "Unsatisfied version 17.0.2 of shared singleton module react
     (required ^18.2.0) ; fallback to version 18.2.0"
  → REMOTE-C GETS React 18 anyway (singleton wins)
  → If REMOTE-C uses React 17-only API → runtime crash 💥

REMOTE-C loads với react@17.0.2 + singleton: false:
  → REMOTE-C gets its OWN React 17 copy
  → Hooks still crash if REMOTE-C renders into host's React tree
```

**Best practice matrix:**

| Dep                | singleton | eager    | requiredVersion | strictVersion |
| ------------------ | --------- | -------- | --------------- | ------------- |
| `react`            | ✅ true   | ❌ false | `'^18.0.0'`     | ❌ false      |
| `react-dom`        | ✅ true   | ❌ false | `'^18.0.0'`     | ❌ false      |
| `react-router-dom` | ✅ true   | ❌ false | `'^6.0.0'`      | ❌ false      |
| Design system      | ✅ true   | ❌ false | Exact semver    | ✅ true       |
| `lodash`           | ❌ false  | ❌ false | `'^4.0.0'`      | ❌ false      |
| `date-fns`         | ❌ false  | ❌ false | `'^3.0.0'`      | ❌ false      |

**🇻🇳 Tóm tắt**: `singleton: true` cho React là BẮT BUỘC. Nếu không, host và remote có thể load hai React instances → hooks crash. Singleton cho phép shareScope negotiation: instance nào được load đầu tiên sẽ được share cho toàn bộ federation graph.

---

### Section 1.3: Eager Loading vs Lazy Loading / Eager vs Lazy

```
LAZY (default, recommended):
─────────────────────────────
main.js: [shell code only, no shared deps]
         ↓ at runtime
         [fetch shareScope from all remotes]
         [negotiate versions]
         [load shared chunks on demand]

Pros: Smaller initial bundle, correct version negotiation
Cons: Extra async round-trips before first interaction

EAGER (use carefully):
──────────────────────
main.js: [shell code + all shared deps bundled together]

Pros: No async boundary needed, simpler setup
Cons: BOTH host AND remote bundle shared deps if both set eager:true
     → duplicate code → larger bundles
     → Use only when ONE side (usually host) sets eager:true
```

```typescript
// Pattern: Host sets eager, remotes do NOT
// webpack.config.ts — HOST
shared: {
  react: { singleton: true, eager: true },  // ← host bundles it eagerly
  'react-dom': { singleton: true, eager: true },
}

// webpack.config.ts — REMOTE (NO eager)
shared: {
  react: { singleton: true, eager: false },  // ← reuses host's copy at runtime
  'react-dom': { singleton: true, eager: false },
}
```

---

## Part 2: Module Federation 2.0 (2024) / Thế Hệ Mới

### Section 2.1: What Changed in MF 2.0

Module Federation 2.0 được launched chính thức năm 2024, mang đến những cải tiến cơ bản:

**MF 1.0 limitations:**

- Static remote URLs baked into Webpack config (không dynamic)
- No runtime API để change remotes
- TypeScript types không được share tự động
- Chỉ support Webpack

**MF 2.0 additions:**

- **Runtime API** — dynamic remote registration at runtime
- **Manifest-based remotes** — remote URLs từ config file, không hardcode
- **`@module-federation/enhanced`** — cross-bundler SDK (Webpack + Rspack + Vite)
- **`@module-federation/typescript`** — automated type sharing
- **Plugin-based** — `@module-federation/runtime` + `@module-federation/sdk`

```typescript
// MF 2.0: Dynamic remote registration at runtime
// No webpack config needed for remotes — fully dynamic
import { init, loadRemote } from "@module-federation/runtime";

// Initialize federation container at app startup
await init({
  name: "shell",
  remotes: [
    {
      name: "checkout",
      // URL can come from API, feature flags, A/B test config
      entry: "https://checkout.company.com/mf-manifest.json",
      // MF 2.0 uses manifest (JSON) instead of remoteEntry.js directly
    },
  ],
  shared: {
    react: { singleton: true, version: "18.2.0" },
    "react-dom": { singleton: true, version: "18.2.0" },
  },
});

// Dynamic load — no static import needed
const CheckoutModule = await loadRemote<{ CheckoutFlow: React.ComponentType }>(
  "checkout/CheckoutFlow",
);
const { CheckoutFlow } = CheckoutModule;
```

```typescript
// MF 2.0: mf-manifest.json served by remote
// This replaces the remoteEntry.js discovery mechanism
{
  "id": "checkout",
  "name": "checkout",
  "metaData": {
    "name": "checkout",
    "buildInfo": {
      "buildVersion": "1.2.3",
      "buildName": "checkout"
    },
    "remoteEntry": {
      "name": "remoteEntry",
      "path": "",
      "type": "global"
    },
    "types": {
      "path": "",
      "name": "checkout.d.ts",
      "zip": "@mf-types.zip",
      "api": "@mf-types-api.zip"
    },
    "globalName": "checkout",
    "pluginVersion": "0.6.0",
    "publicPath": "https://checkout.company.com/"
  },
  "shared": [...],
  "remotes": [],
  "exposes": [
    { "id": "checkout:./Button", "name": "./Button", "path": "./Button" },
    { "id": "checkout:./CartSummary", "name": "./CartSummary", "path": "./CartSummary" }
  ]
}
```

**Benefit of manifest approach**: Host polls manifest → detects version changes → invalidates cache → users get updates without host redeploy. Đây là pattern Microsoft Teams dùng cho "soft update" — không cần full page reload.

---

### Section 2.2: Rspack Native Module Federation (2024)

**Rspack 1.0** (released October 2024) ship với **native Module Federation support** — không cần plugin riêng, syntax gần như identical với Webpack 5:

```typescript
// rspack.config.ts — REMOTE (Rspack, not Webpack)
import { defineConfig } from "@rspack/cli";
import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";
// Note: import từ @module-federation/enhanced, không phải webpack/container

export default defineConfig({
  plugins: [
    new ModuleFederationPlugin({
      name: "checkout",
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./src/components/Button",
        "./CartSummary": "./src/components/CartSummary",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
      },
      // MF 2.0 feature: automatic type generation
      dts: {
        generateTypes: {
          tsConfigPath: "./tsconfig.json",
        },
      },
    }),
  ],
});
```

**Rspack vs Webpack build speed** (real numbers 2024):

```
Webpack 5 cold build:   ~45s (100 modules, MF enabled)
Rspack 1.0 cold build:  ~4s  (same project)
Rspack speedup:         ~10–15x (Rust-based parallel compilation)
```

ByteDance (creators of Rspack) đã migrate TikTok web từ Webpack sang Rspack và dùng Rspack's native MF cho component federation giữa các team. Build time giảm từ ~8 phút xuống ~40 giây.

---

### Section 2.3: Vite Plugin Federation / Federation Trên Vite

**`@originjs/vite-plugin-federation`** là implementation MF cho Vite — nhưng có important limitations:

```typescript
// vite.config.ts — REMOTE (Vite)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "checkout",
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./src/components/Button",
      },
      shared: ["react", "react-dom"],
      // ⚠️ shared config is simpler than Webpack — less granular control
    }),
  ],
  build: {
    // REQUIRED: Vite MF does NOT work in dev mode
    // Must be production build for remoteEntry.js to be generated
    target: "esnext",
    minify: false, // Easier debugging across remotes
  },
});
```

**Feature parity gaps (as of 2024):**

| Feature                 | Webpack MF     | Rspack MF      | Vite MF (`@originjs`) |
| ----------------------- | -------------- | -------------- | --------------------- |
| Production federation   | ✅ Full        | ✅ Full        | ✅ Works              |
| Dev server federation   | ✅ HMR works   | ✅ HMR works   | ❌ Must build first   |
| `singleton` granularity | ✅ Per-package | ✅ Per-package | 🟡 Array only         |
| `requiredVersion`       | ✅ SemVer      | ✅ SemVer      | ❌ Not supported      |
| `eager` loading         | ✅             | ✅             | ❌ Not supported      |
| Dynamic remote URLs     | ✅ MF 2.0      | ✅ MF 2.0      | ❌ Static only        |
| MF 2.0 manifest         | ✅             | ✅             | ❌                    |
| Type sharing            | ✅ MF 2.0      | ✅ MF 2.0      | ❌ Manual             |

**💡 Interview Signal**: Vite MF dev mode limitation là gotcha phổ biến — candidates không biết sẽ tự tin nói "Vite MF hoạt động như Webpack" và fail khi interviewer hỏi về dev server experience.

**Alternative**: `@module-federation/vite` (official MF 2.0 package) đang fill parity gaps — nhưng early 2025 vẫn experimental. Production-critical projects nên stick với Webpack 5 hoặc Rspack.

---

## Part 3: Type Safety Across Remotes / Type Safety

### Section 3.1: The Problem

Module Federation là runtime — TypeScript không biết gì về remote modules tại compile time. Naive approach:

```typescript
// ❌ Anti-pattern: any type
const CartSummary = lazy(() => import("checkout/CartSummary") as Promise<{ default: any }>);
```

---

### Section 3.2: Approach 1 — Manual Type Stubs

```typescript
// types/federation.d.ts — manual declarations
// Tạo file này và commit vào host repo

declare module "checkout/CartSummary" {
  import type { CartSummaryProps } from "./checkout-types";
  const CartSummary: React.ComponentType<CartSummaryProps>;
  export default CartSummary;
}

declare module "checkout/Button" {
  interface ButtonProps {
    variant: "primary" | "secondary" | "danger";
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
  }
  export const Button: React.ComponentType<ButtonProps>;
}

declare module "account/Profile" {
  interface ProfileProps {
    userId: string;
    onLogout: () => void;
  }
  export const Profile: React.ComponentType<ProfileProps>;
}
```

**Nhược điểm**: Manual, dễ outdated, phải sync manually khi remote API thay đổi.

---

### Section 3.3: Approach 2 — Zod Runtime Contracts

Thay vì trust remote types, validate tại runtime:

```typescript
// shared-contracts/checkout.ts — shared via npm package or git submodule
import { z } from "zod";

// Define contract as Zod schema — serves as both runtime validator AND TS type
export const CartSummaryPropsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
    }),
  ),
  currency: z.enum(["USD", "EUR", "VND", "SGD"]),
  onCheckout: z.function().args().returns(z.void()),
});

export type CartSummaryProps = z.infer<typeof CartSummaryPropsSchema>;

// Host uses this to validate props before passing to remote
export function validateCartSummaryProps(data: unknown): CartSummaryProps {
  return CartSummaryPropsSchema.parse(data); // throws ZodError if invalid
}
```

```typescript
// Host: using zod contract
import { validateCartSummaryProps } from '@company/contracts/checkout';
import { lazy, Suspense } from 'react';

const CartSummary = lazy(() => import('checkout/CartSummary'));

function CheckoutPage({ rawCartData }: { rawCartData: unknown }) {
  // Runtime validation — catches remote API drift early
  const validProps = validateCartSummaryProps(rawCartData);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CartSummary {...validProps} />
    </Suspense>
  );
}
```

---

### Section 3.4: Approach 3 — `@module-federation/typescript` (MF 2.0)

MF 2.0 có built-in type generation và consumption:

```typescript
// rspack.config.ts / webpack.config.ts — REMOTE
new ModuleFederationPlugin({
  name: 'checkout',
  exposes: { './Button': './src/components/Button' },
  dts: {
    // Generate types and upload to manifest
    generateTypes: {
      tsConfigPath: './tsconfig.json',
      // Types are zipped and referenced in mf-manifest.json
    },
  },
}),
```

```typescript
// rspack.config.ts — HOST
new ModuleFederationPlugin({
  name: 'shell',
  remotes: [{ name: 'checkout', entry: 'https://checkout.company.com/mf-manifest.json' }],
  dts: {
    // Automatically download and extract remote types
    consumeTypes: {
      remoteTypesFolder: './@mf-types', // downloaded here
    },
  },
}),
```

```typescript
// tsconfig.json — HOST: include downloaded remote types
{
  "compilerOptions": {
    "paths": {
      "checkout/*": ["./@mf-types/checkout/*"]
    }
  }
}
```

**Kết quả**: `import('checkout/Button')` sẽ có đầy đủ TypeScript types từ remote — auto-downloaded tại build time. Khi remote team thay đổi component API → types bị outdated → host build shows type errors → catch breaking changes sớm.

---

## Part 4: Error Boundaries for Missing Remotes / Xử Lý Lỗi

### Section 4.1: What Happens When Remote 404s

Khi remote server down hoặc `remoteEntry.js` không accessible:

```
Timeline của failure:
1. Host loads
2. Webpack runtime tries to fetch: https://checkout.company.com/remoteEntry.js
3. Network error / 404 returned
4. import('checkout/CartSummary') → Promise rejects
5. WITHOUT error boundary: React unmounts ENTIRE tree → blank page
6. WITH error boundary: only checkout section fails → rest of app works
```

---

### Section 4.2: Error Boundary Implementation

```tsx
// src/components/RemoteErrorBoundary.tsx
import React, { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  remoteName: string;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class RemoteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[MF] Remote "${this.props.remoteName}" failed:`, error, info);

    // Report to monitoring (Datadog, Sentry)
    this.props.onError?.(error);

    // Example: report to telemetry
    window.dispatchEvent(
      new CustomEvent("mf:remote-error", {
        detail: { remoteName: this.props.remoteName, error: error.message },
      }),
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div role="alert" style={{ padding: "16px", border: "1px solid #f00" }}>
            <p>⚠️ {this.props.remoteName} is temporarily unavailable.</p>
            <button onClick={() => this.setState({ hasError: false, error: null })}>Retry</button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
```

```tsx
// src/App.tsx — using error boundary around each remote
import { Suspense, lazy } from "react";
import { RemoteErrorBoundary } from "./components/RemoteErrorBoundary";

// Lazy import with fallback component for when remote fails
const CartSummary = lazy(() =>
  import("checkout/CartSummary").catch(() => ({
    // Graceful degradation: return a static fallback module
    default: () => (
      <div>
        Cart unavailable — <a href="/cart">view cart</a>
      </div>
    ),
  })),
);

export function App() {
  return (
    <div>
      <Header />

      {/* Each remote wrapped in its OWN boundary + suspense */}
      <RemoteErrorBoundary
        remoteName="checkout"
        fallback={<StaticCartFallback />} // Hardcoded fallback UI
        onError={(err) => reportToSentry(err)}
      >
        <Suspense fallback={<CartSkeleton />}>
          <CartSummary />
        </Suspense>
      </RemoteErrorBoundary>

      <Footer />
    </div>
  );
}
```

```tsx
// Advanced: Retry with exponential backoff
function useRemoteWithRetry<T>(
  importFn: () => Promise<T>,
  maxRetries = 3,
): { module: T | null; loading: boolean; error: Error | null } {
  const [state, setState] = React.useState<{
    module: T | null;
    loading: boolean;
    error: Error | null;
  }>({ module: null, loading: true, error: null });

  React.useEffect(() => {
    let retries = 0;

    const attempt = async () => {
      try {
        const mod = await importFn();
        setState({ module: mod, loading: false, error: null });
      } catch (err) {
        if (retries < maxRetries) {
          retries++;
          const delay = Math.pow(2, retries) * 500; // 1s, 2s, 4s
          setTimeout(attempt, delay);
        } else {
          setState({ module: null, loading: false, error: err as Error });
        }
      }
    };

    attempt();
  }, []);

  return state;
}
```

---

## Part 5: Security Model / Mô Hình Bảo Mật

### Section 5.1: The Trust Boundary Problem

Đây là câu hỏi 🔴 Senior quan trọng nhất và thường bị bỏ qua.

**Core principle**: Khi host load remote code, remote code **chạy trong cùng origin, cùng JavaScript context, có access vào cùng DOM và memory** với host. Đây không phải như iframe (cross-origin sandbox). Remote có thể:

```
Compromised remote can:
✗ Read all localStorage / sessionStorage / cookies (same-origin)
✗ Access host's global state (window.*)
✗ Make XHR/fetch requests với host's credentials
✗ Inject scripts (nếu host CSP không block inline scripts)
✗ Exfiltrate user data to attacker-controlled server
✗ Modify host DOM (button labels, form targets)
✗ Install keyloggers on any input in the page
```

**Real supply-chain attack scenario:**

```
Timeline:
1. checkout.company.com bị compromise (CDN breach, dev credentials leak)
2. Attacker replaces remoteEntry.js với malicious version
3. Host loads new remoteEntry.js tại runtime
4. Malicious code runs immediately trong host context
5. User data, auth tokens, PII bị exfiltrate
6. Host team không biết — không có build warning
```

---

### Section 5.2: CORS Configuration

```nginx
# Remote server nginx config — restrict CORS to known hosts
server {
  location /remoteEntry.js {
    # Only allow your own domains — NOT wildcard *
    add_header Access-Control-Allow-Origin "https://shell.company.com";
    add_header Access-Control-Allow-Methods "GET";

    # For multiple allowed origins: use conditional
    set $cors_origin "";
    if ($http_origin ~* "^https://(shell|admin)\.company\.com$") {
      set $cors_origin $http_origin;
    }
    add_header Access-Control-Allow-Origin $cors_origin;
  }
}
```

---

### Section 5.3: CSP — The Conflict with Module Federation

**Problem**: Strict CSP (`script-src 'self'`) **breaks** Module Federation because remote scripts come from external origins.

```
DEFAULT STRICT CSP:
Content-Security-Policy: script-src 'self'; object-src 'none';

Effect on Module Federation:
→ browser blocks: https://checkout.company.com/remoteEntry.js
→ Refused to load the script because it violates CSP
```

**Solution: CSP with explicit remote allowlist**

```typescript
// next.config.ts (or express middleware)
const ALLOWED_REMOTE_ORIGINS = [
  "https://checkout.company.com",
  "https://account.company.com",
  "https://analytics.company.com",
];

const cspHeader = [
  // Allow scripts from self + explicitly allowlisted remotes
  `script-src 'self' ${ALLOWED_REMOTE_ORIGINS.join(" ")} 'nonce-{NONCE}'`,
  // Remote chunks (code-split) also need to be allowed
  `connect-src 'self' ${ALLOWED_REMOTE_ORIGINS.join(" ")}`,
  `default-src 'self'`,
  `object-src 'none'`,
  `base-uri 'self'`,
].join("; ");

// Nonce approach for inline scripts (Webpack runtime)
// Generate per-request nonce, inject into webpack runtime via __webpack_nonce__
```

**Nonce injection for Webpack runtime:**

```typescript
// server-side (Express)
import crypto from "crypto";

app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString("base64");
  res.locals.nonce = nonce;

  res.setHeader(
    "Content-Security-Policy",
    `script-src 'self' 'nonce-${nonce}' https://checkout.company.com`,
  );

  next();
});

// In HTML template:
// <script nonce="<%= nonce %>">__webpack_nonce__ = '<%= nonce %>'</script>
```

---

### Section 5.4: Subresource Integrity (SRI) + Manifest Pinning

**MF 2.0 manifest pinning** — pin exact version of remote before loading:

```typescript
// Advanced security: verify remote manifest hash before loading
import { init } from "@module-federation/runtime";
import { createHash } from "crypto";

async function secureInit() {
  // Fetch manifest
  const manifestResponse = await fetch("https://checkout.company.com/mf-manifest.json");
  const manifestText = await manifestResponse.text();

  // Verify against known-good hash (stored in host's own config / fetched from trusted source)
  const expectedHash = process.env.CHECKOUT_MANIFEST_HASH; // e.g., sha256-abc123...
  const actualHash = `sha256-${createHash("sha256").update(manifestText).digest("base64")}`;

  if (actualHash !== expectedHash) {
    // Alert security team, refuse to load remote
    reportSecurityIncident("checkout manifest hash mismatch", {
      expected: expectedHash,
      actual: actualHash,
    });
    throw new Error("Remote manifest integrity check failed");
  }

  const manifest = JSON.parse(manifestText);

  await init({
    name: "shell",
    remotes: [{ name: "checkout", entry: manifest }],
  });
}
```

**Thực tế**: Full SRI cho MF là khó vì remotes có thể có nhiều dynamic chunks. Minimum viable security:

1. CORS restrict remote servers to known host origins
2. CSP allowlist specific remote origins (không dùng wildcard)
3. Internal PKI / mTLS cho internal remotes
4. Monitor + alert on `mf:remote-error` events (unexpected failures có thể là attack)
5. Không bao giờ load remotes từ third-party CDN không tin cậy mà không có integrity check

---

## Part 6: Production Case Studies / Case Thực Tế

### Section 6.1: Microsoft Teams — 50+ Teams Shipping Independently

Microsoft Teams web client là một trong những Module Federation deployments lớn nhất thế giới (theo Zack Jackson's conference talks, 2022–2023).

**Architecture:**

- **Shell** (host): Loads once, handles auth, nav, app shell
- **50+ feature remotes**: Chat, Meetings, Calendar, Files, Apps marketplace, Settings...
- Mỗi remote được owned bởi team riêng với deployment pipeline riêng

**Key decisions:**

```typescript
// Teams' shared config approach (approximate — reconstructed from public talks)
const teamsSharedConfig = {
  // React singleton — single version policy enforced org-wide
  react: { singleton: true, requiredVersion: "^17.0.0", strictVersion: true },

  // Internal shared design system as singleton
  "@teams/fluent-ui": { singleton: true, requiredVersion: "^9.0.0" },

  // Internal telemetry — singleton để data không bị duplicated
  "@teams/telemetry": { singleton: true, requiredVersion: "^2.0.0" },

  // Utilities — NOT singleton, each team gets own copy
  // prevents version conflicts for less critical deps
  "@teams/utils": { singleton: false },
};
```

**Latency cost & mitigation:**

```
Remote load timeline (cold):
  remoteEntry.js fetch:  ~20–40ms (CDN-cached after first load)
  shareScope negotiation: ~5ms (CPU)
  Module chunk fetch:     ~30–80ms (CDN)
  React tree render:      ~10–50ms
  Total cold:             ~65–175ms

Mitigation strategies Teams uses:
1. Prefetch critical remotes via <link rel="prefetch">
2. Service Worker caches remoteEntry.js (stale-while-revalidate)
3. Shell renders loading skeleton immediately
4. Remotes prioritized by route (chat loads first for chat route)
```

**Version update flow**: Teams sử dụng "soft update" model — khi user navigates between tabs, Teams checks for new manifest version. Nếu có update, memoize current remote và load new version for next navigation. Không cần page reload.

---

### Section 6.2: Shopify Checkout Extensions

Shopify's checkout extensions (2022) là example của **third-party federation** — external merchants có thể inject React components vào Shopify's checkout.

**Unique challenge**: Không phải internal teams — third-party devs có thể malicious.

**Shopify's security approach:**

1. Merchant extensions chạy trong **restricted sandbox** (không phải standard MF)
2. Whitelist API: extensions chỉ có access tới Shopify's Extension API — không có access DOM trực tiếp
3. Remote URL phải được register qua Shopify Partners dashboard trước
4. Shopify ký remoteEntry.js với private key — host verify trước khi load
5. Extensions không thể access `window.*` hay localStorage của host

**Lesson for interviews**: Standard MF không có isolation. Shopify đã phải build custom security layer on top. Nếu bạn cần third-party federation, bạn cần security layer riêng.

---

### Section 6.3: Hypothetical — Grab Partner Portal

🇻🇳 Grab Vietnam partner portal (giả thuyết nhưng realistic cho context phỏng vấn):

```
Architecture: Grab Driver Portal / Merchant Center
────────────────────────────────────────────────────
Shell: Authentication, navigation, language switcher (EN/VI/TH/MY)
  ↓ loads remotes:
Remote-A: Earnings dashboard (Driver team)
Remote-B: Trip history (Rides team)
Remote-C: GrabFood orders (Food team)
Remote-D: GrabMart inventory (Mart team)
Remote-E: Promotions manager (Growth team)
Remote-F: Support center (CX team)

Challenge: 6 teams, different release cadences
Solution: MF with shared singleton:
  - @grab/design-system (Grab brand UI)
  - @grab/i18n (multilingual - critical singleton)
  - @grab/auth (OAuth tokens - singleton for security)
  - react, react-dom

Performance target: Southeast Asia 3G users
  → Lazy load remotes only when tab active
  → remoteEntry.js cached at edge (Cloudflare/Fastly)
  → Critical path: shell + auth (< 2s on 3G)
```

---

## Part 7: Interview Q&A / Câu Hỏi Phỏng Vấn

---

### 🟢 Q1: What problem does Module Federation solve that npm packages don't?

**A:**

npm packages solve **code sharing** at **build time** — you install a package, it gets bundled into your app at compile time. When the package changes, you must:

1. Package team publishes new version to npm
2. Consumer team updates `package.json`
3. Consumer team rebuilds and redeploys their entire app

This creates **build-time coupling**: even a one-line bugfix in a shared button requires a full deploy cycle of every consuming app.

Module Federation solves **runtime code sharing** — the host app doesn't include the remote code at build time. Instead, at **runtime** in the browser, the host fetches `remoteEntry.js` from the remote's URL and loads modules from it. When the remote team ships an update:

1. Remote team deploys new `remoteEntry.js` to their CDN
2. Users refreshing the host app get the new code **immediately**
3. Host team does not need to rebuild or redeploy

This enables true **deploy independence**: 10 teams can ship 10 times a day without coordinating release windows.

Vietnamese: npm packages tạo ra **build-time coupling** — mỗi khi shared component thay đổi, toàn bộ consuming apps phải rebuild + redeploy. Module Federation giải quyết bằng **runtime loading** — host fetch `remoteEntry.js` từ remote URL trong browser. Remote team ship update → users nhận code mới ngay khi refresh — không cần host rebuild. Đây là nền tảng của **deploy independence**: mỗi team ship theo tốc độ riêng.

**💡 Interview Signal:**

- ✅ Strong: Distinguishes build-time vs runtime coupling, mentions deploy independence, knows the full npm update cycle vs MF update cycle
- ❌ Weak: "MF is better code splitting" — misses the deployment independence point entirely

---

### 🟢 Q2: What is the difference between host, remote, and bidirectional federation?

**A:**

**Host**: The app that consumes (imports) modules from other apps. Host is the "shell" — it loads at first request and then dynamically pulls in remote modules. Host knows about remotes via `remotes` config in ModuleFederationPlugin.

**Remote**: The app that exposes modules for others to consume. Remote defines `exposes` in its config and serves a `remoteEntry.js`. Remote doesn't know who consumes it — it just makes modules available.

**Bidirectional**: An app that is both host AND remote simultaneously — it exposes its own modules (`exposes` config) AND consumes from other remotes (`remotes` config). Useful for peer-to-peer communication between teams.

```typescript
// Bidirectional example
new ModuleFederationPlugin({
  name: "teamA",
  filename: "remoteEntry.js",
  // teamA IS a remote (exposes Header)
  exposes: { "./Header": "./src/Header" },
  // teamA IS ALSO a host (consumes from teamB)
  remotes: { teamB: "teamB@https://teamb.company.com/remoteEntry.js" },
  shared: { react: { singleton: true } },
});
```

**Bidirectional risk**: Circular dependencies. If A depends on B and B depends on A, initialization order matters. Keep bidirectional to trusted, well-coordinated team pairs.

Vietnamese: **Host** = app consume modules từ remotes (có `remotes` config). **Remote** = app expose modules cho người khác dùng (có `exposes` config + serve `remoteEntry.js`). **Bidirectional** = vừa là host vừa là remote — expose modules của mình VÀ consume từ remotes khác. Risk: circular dependency nếu A depend B và B depend A — cần coordinate initialization order.

**💡 Interview Signal:**

- ✅ Strong: Clearly defines all three, notes bidirectional risk, can draw the topology
- ❌ Weak: Confuses host/remote with client/server — they are independent concepts

---

### 🟡 Q3: Explain shared dependencies — singleton, eager, requiredVersion, strictVersion. When does React crash?

**A:**

The `shared` config controls how Module Federation handles dependencies that appear in multiple remotes:

**`singleton: true`**: Only ONE instance of this module is allowed in the entire federated app. The first loaded version wins; all subsequent remotes reuse it. **Critical for React** — React uses module-level state for hooks. Two React instances = hooks crash with "Invalid hook call."

**`eager: true`**: Bundle the shared dep into the main chunk rather than a lazy async chunk. Use when you don't have an async boundary (`bootstrap.ts` pattern). Risk: if both host AND remote set eager, both bundle the dep → larger output.

**`requiredVersion`**: SemVer range the module must satisfy. If shareScope has a version outside this range AND singleton=true: webpack warns but still uses the existing singleton.

**`strictVersion: true`**: If version doesn't satisfy requiredVersion AND singleton=true → throw error instead of warning. Use for design systems where API breaks are serious.

**When React crashes:**

```
Scenario: host has react@18, remote has react@17, singleton: false
→ Two React instances in same app
→ Remote component rendered into host React tree
→ hooks in remote component call remote's React dispatcher
→ host's reconciler doesn't know about remote's dispatcher
→ Error: "Invalid hook call"

Fix: singleton: true ensures one version wins
     OR: align React versions across all remotes (org-wide policy)
```

Vietnamese: `singleton: true` = chỉ một instance React tồn tại — instance nào load đầu tiên sẽ được share cho tất cả. Thiếu `singleton: true` khi host và remote dùng React khác version → hooks crash vì React dùng module-level state cho dispatcher. `eager: true` → bundle vào main chunk (tránh async overhead nhưng risk duplicate bundling). `requiredVersion` → SemVer constraint, `strictVersion` → throw error thay vì warn khi mismatch.

**💡 Interview Signal:**

- ✅ Strong: Explains WHY React crashes (module-level state, hooks dispatcher), knows singleton behavior when versions conflict, knows eager vs lazy tradeoff
- ❌ Weak: "singleton means only one copy" — correct but needs to explain WHY it matters for React specifically

---

### 🟡 Q4: What changed between Module Federation 1.0 and 2.0?

**A:**

**MF 1.0 (Webpack 5, 2020):**

- Static remote configuration in webpack config at build time
- Remote URLs are hardcoded strings: `'checkout@https://checkout.co/remoteEntry.js'`
- No runtime API to change remotes after build
- No built-in type sharing
- Webpack-only (no official Rspack or Vite support)
- Discovery via `remoteEntry.js` (a JavaScript container file)

**MF 2.0 (2024, `@module-federation/enhanced`):**

1. **Runtime API** (`@module-federation/runtime`): Register, load, and update remotes at runtime from JavaScript — no build config required
2. **Manifest-based discovery** (`mf-manifest.json`): Instead of `remoteEntry.js` with hardcoded URLs, a JSON manifest describes the remote's capabilities, version, and entry point — easier to version and cache
3. **Automated type sharing**: `@module-federation/typescript` generates `.d.ts` files and auto-downloads them in consuming apps
4. **Cross-bundler SDK**: `@module-federation/enhanced` works with Webpack 5, Rspack 1.0, and (experimentally) Vite
5. **Plugin system**: Extensible via `@module-federation/runtime` plugins for custom behavior (auth headers, logging, etc.)

```typescript
// MF 1.0: static
remotes: {
  checkout: "checkout@https://checkout.company.com/remoteEntry.js";
}

// MF 2.0: dynamic, manifest-based
import { init, loadRemote } from "@module-federation/runtime";
await init({
  remotes: [{ name: "checkout", entry: "https://checkout.company.com/mf-manifest.json" }],
});
const module = await loadRemote("checkout/Button");
```

Vietnamese: MF 1.0 hardcode remote URLs vào Webpack config — không thể đổi tại runtime. MF 2.0 thêm Runtime API để dynamic register/load remotes, manifest JSON thay remoteEntry.js (dễ version hơn), auto type sharing, và cross-bundler support (Webpack + Rspack + Vite thực nghiệm). MF 2.0 launched năm 2024.

**💡 Interview Signal:**

- ✅ Strong: Knows manifest vs remoteEntry.js distinction, knows it's cross-bundler, can show runtime API usage
- ❌ Weak: "MF 2.0 is faster" — incorrect framing; the improvement is API flexibility and type safety, not raw performance

---

### 🟡 Q5: How do you handle type safety across federated remotes?

**A:**

Three approaches ordered by robustness:

**1. Manual type declarations** (minimum viable, error-prone):
Declare remote modules manually in `*.d.ts` files. Cheap to setup, goes stale quickly when remote team changes APIs.

**2. Shared Zod contracts** (runtime safety):
Remote and host share a published npm package containing Zod schemas. Host validates props at runtime before passing to remote component. Catches API drift at runtime rather than compile time — but always catches it.

```typescript
// @company/contracts — shared npm package
import { z } from "zod";
export const ButtonPropsSchema = z.object({
  variant: z.enum(["primary", "secondary"]),
  label: z.string(),
  onClick: z.function(),
});
export type ButtonProps = z.infer<typeof ButtonPropsSchema>;
```

**3. `@module-federation/typescript`** (MF 2.0, compile-time safety):
Remote generates type bundle during build, host auto-downloads types from manifest. Full TypeScript autocomplete for remote imports. Best for internal teams, requires MF 2.0 + Webpack/Rspack.

**The right choice** depends on trust model:

- Internal teams with same tooling → MF 2.0 type sharing
- Internal teams with mixed tooling → Zod contracts
- Third-party remotes → Zod contracts (never trust types from external source)

Vietnamese: 3 cách: (1) Manual `.d.ts` declarations — rẻ nhưng outdated nhanh. (2) Shared Zod schemas — validate runtime, bắt API drift ngay khi xảy ra. (3) `@module-federation/typescript` (MF 2.0) — auto generate và download types từ remote manifest, đầy đủ TypeScript safety. Chọn theo trust model: internal teams → MF 2.0 types; third-party remotes → Zod (không tin types từ external source).

**💡 Interview Signal:**

- ✅ Strong: Knows all three approaches, understands trust model matters for third-party, mentions Zod for runtime safety
- ❌ Weak: "Just use TypeScript generics" — doesn't address the fact that remote types are unknowable at build time

---

### 🟡 Q6: What happens when a remote is unavailable? How do you handle it?

**A:**

When remote is unavailable (404, network error, server down):

1. `import('checkout/CartSummary')` returns a rejected Promise
2. Without error boundary → uncaught Promise rejection → React's error boundary propagation → if no boundary → **entire React tree unmounts** → blank page
3. `<Suspense>` alone does NOT catch errors, only loading states

**Three-layer defense:**

```
Layer 1: lazy import with catch (module-level fallback)
  const CartSummary = lazy(() =>
    import('checkout/CartSummary').catch(() => ({
      default: () => <StaticFallback />
    }))
  );

Layer 2: Error Boundary (component-level isolation)
  <RemoteErrorBoundary remoteName="checkout" fallback={<StaticCart />}>
    <Suspense fallback={<Skeleton />}>
      <CartSummary />
    </Suspense>
  </RemoteErrorBoundary>

Layer 3: Monitoring + alerting
  componentDidCatch → send to Sentry/Datadog
  track MF remote failure rate as SLO metric
```

**Retry strategy**: Implement exponential backoff for transient failures (network blip). Don't retry on 404 (remote genuinely missing) — differentiate with status code check.

**Design decision**: Each remote should have a **static fallback** — a simplified version of its UI that works without the remote code. For checkout: a link to the full checkout page instead of the embedded component.

Vietnamese: Remote unavailable → `import()` reject → không có error boundary = toàn bộ React tree unmount = blank page. 3 lớp bảo vệ: (1) `.catch()` trong lazy import để return static fallback module. (2) Error Boundary wrap từng remote riêng biệt. (3) Monitor trong `componentDidCatch` để alert khi failure rate tăng. Mỗi remote cần **static fallback UI** — không bao giờ để user thấy blank page vì remote outage.

**💡 Interview Signal:**

- ✅ Strong: Knows Suspense doesn't catch errors (only async), knows three layers, mentions monitoring, mentions static fallback design
- ❌ Weak: "Use try-catch" — doesn't address that React errors need class-component error boundaries, not try-catch

---

### 🔴 Q7: Describe a production MF deployment for 50+ teams. What are the latency costs and how do you tune share-scope?

**A:**

Based on Microsoft Teams model and publicly shared case studies:

**Architecture at scale:**

The challenge with 50+ remotes is that share-scope negotiation runs for every loaded remote — O(n) where n = number of distinct shared packages × number of remotes. At 50 remotes sharing 10 packages each, this becomes measurable overhead (~5–20ms of CPU per navigation).

**Latency breakdown:**

```
Per-remote load cost (CDN-cached):
  DNS + TCP: ~0ms (keep-alive, HTTP/2)
  remoteEntry.js: ~5–15ms (tiny file, ~2–10KB)
  shareScope negotiation: ~2–5ms (CPU, synchronous)
  Module chunk fetch: ~20–60ms (depends on chunk size)
  React tree render: ~10–40ms
  Total per remote: ~37–120ms

With 5 remotes loaded in parallel: ~80–200ms total
(Parallel fetches via HTTP/2 multiplexing)
```

**Share-scope tuning for scale:**

```typescript
// Anti-pattern at scale: share EVERYTHING
shared: {
  // ❌ Sharing 50 packages = 50 version negotiations = slow + complex
  react: { singleton: true },
  'react-dom': { singleton: true },
  lodash: { singleton: false },
  'date-fns': { singleton: false },
  axios: { singleton: false },
  '@company/utils': { singleton: false },
  // ... 44 more packages
}

// Best practice: minimal share-scope
shared: {
  // ✅ Only share what MUST be singleton (hooks-sensitive)
  react: { singleton: true, requiredVersion: '^18.2.0' },
  'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
  'react-router-dom': { singleton: true, requiredVersion: '^6.0.0' },

  // ✅ Share design system (singleton for CSS consistency)
  '@company/design-system': { singleton: true, requiredVersion: '^3.0.0' },

  // ✅ Share telemetry singleton (avoid duplicate session init)
  '@company/telemetry': { singleton: true },

  // ❌ Do NOT share: lodash, date-fns, axios, etc.
  // Let each remote bundle its own — independence > bundle savings
}
```

**Organization-level React version policy**: With 50 teams, enforcing single React major version prevents singleton mismatch issues. Teams must upgrade React in a coordinated wave (or accept warning period with `strictVersion: false`).

**Prefetch strategy:**

```typescript
// Shell: prefetch remotes for routes user is likely to visit next
// Based on current route, prefetch adjacent route's remotes
function prefetchLikelyRemotes(currentRoute: string) {
  const routeRemoteMap: Record<string, string[]> = {
    "/chat": ["https://chat.teams.com/remoteEntry.js"],
    "/meetings": ["https://meetings.teams.com/remoteEntry.js"],
  };

  const nextRoutes = getPredictedRoutes(currentRoute); // ML-based or simple heuristic
  nextRoutes.forEach((route) => {
    routeRemoteMap[route]?.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = url;
      document.head.appendChild(link);
    });
  });
}
```

Vietnamese: 50+ remotes = share-scope negotiation tốn ~5–20ms per navigation. Giải pháp: minimal share-scope — chỉ share React, react-dom, design-system, telemetry. Đừng share lodash/date-fns/axios (không có lý do singleton). Org-wide React version policy để tránh singleton mismatch. Prefetch `remoteEntry.js` của remotes likely-to-be-needed dựa trên current route.

**💡 Interview Signal:**

- ✅ Strong: Quantifies latency costs, explains share-scope minimization principle, mentions prefetch, knows org-wide version policy need
- ❌ Weak: "Just cache remoteEntry.js" — caching helps but doesn't address shareScope negotiation overhead or version policy at scale

---

### 🔴 Q8: Explain the security model for Module Federation. How does CSP conflict with it, and what is the supply-chain risk?

**A:**

**The fundamental security property**: Module Federation has **NO isolation**. Remote code runs in the same JavaScript context as host — same origin, same `window`, same storage, same credentials. This is categorically different from iframes (cross-origin process isolation) or Web Workers (no DOM access).

**Supply-chain attack vector:**

If an attacker compromises the remote's CDN or deployment pipeline and replaces `remoteEntry.js` with malicious code, that malicious code executes in the host context with full access to:

- All localStorage, sessionStorage, cookies
- Auth tokens (if stored in JS memory)
- User PII being rendered in the DOM
- Network requests with user's credentials

The host has no way to detect this at runtime without explicit integrity checking.

**CSP conflict:**

Strict `script-src 'self'` blocks external remote scripts. The fix is to explicitly allowlist remote origins:

```
Content-Security-Policy:
  script-src 'self'
    https://checkout.company.com
    https://account.company.com
    'nonce-{NONCE}';
  connect-src 'self'
    https://checkout.company.com
    https://account.company.com;
```

Note: Webpack's runtime requires `unsafe-eval` (for dynamic module resolution) OR `unsafe-inline` — unless you use the `trusted-types` webpack plugin. This is a real security tradeoff.

**Mitigations:**

1. **CORS allowlist** on remote servers — only serve `remoteEntry.js` to known host origins
2. **Manifest hash pinning** (MF 2.0) — verify manifest hash against known-good before init
3. **Subresource Integrity (SRI)** — `<script integrity="sha256-...">` — but difficult with dynamic chunks
4. **Internal deployment infrastructure** — host and remotes on same internal domain, no public CDN for remotes
5. **Security monitoring** — alert on unexpected `mf:remote-error` patterns (may indicate attack changing module signatures)

**Design principle**: Treat remote code with the **same trust level as your own code** — because in MF, it IS your own context. Only use MF for internal teams or partners with signed contracts. Third-party remotes (Shopify extension model) need additional sandboxing.

Vietnamese: MF không có isolation — remote code chạy trong cùng JS context với host. Bị compromise remote → attacker có full access localStorage, cookies, auth tokens, PII. CSP `script-src 'self'` block remotes → phải explicit allowlist remote origins. Mitigations: CORS restrict remote servers đến known hosts, hash pinning manifest (MF 2.0), internal deployment (không dùng public CDN cho internal remotes), security monitoring. Nguyên tắc: chỉ dùng MF cho internal teams hoặc trusted partners với signed contracts.

**💡 Interview Signal:**

- ✅ Strong: States "no isolation" explicitly, describes supply-chain attack, explains CSP conflict mechanism, provides concrete mitigations
- ❌ Weak: "MF is secure because of CORS" — CORS only controls WHO can fetch the file, not what the code does once executed

---

### 🔴 Q9: Vite/Rspack vs Webpack for Module Federation — feature parity gaps and when each is appropriate?

**A:**

**Webpack 5** remains the most feature-complete MF implementation. It originated MF (Zack Jackson, 2020), has the most battle-tested production deployments, and MF 2.0 was designed primarily around Webpack 5's model.

**Rspack 1.0** (October 2024, ByteDance) — Rust-based Webpack-compatible bundler:

- Native MF support via `@module-federation/enhanced/rspack`
- Feature parity with Webpack 5 MF (including MF 2.0 manifest, type sharing, runtime API)
- 10–15× faster builds than Webpack 5 (same config)
- Drop-in replacement for Webpack config in most cases
- **Best choice for new Webpack-style MF projects** (2025+)

**`@originjs/vite-plugin-federation`** — community plugin:

- Works in production build mode ✅
- No dev server support ❌ (must build to test federation)
- No `requiredVersion` or fine-grained shared config ❌
- No dynamic remotes ❌
- No MF 2.0 manifest ❌
- Suitable for simple cases where teams control both host and remote

**`@module-federation/vite`** — official MF 2.0 package for Vite:

- Experimental as of early 2025
- Aims to close parity gaps with Webpack/Rspack
- Worth watching but not production-ready at scale yet

**Decision matrix:**

```
New project, large org, need full MF features?
  → Rspack (MF 2.0, fast builds, Webpack-compatible)

Existing Webpack 5 project, no migration budget?
  → Stay Webpack 5, upgrade to @module-federation/enhanced

Vite-based project, simple federation needs (same team controls all remotes)?
  → @originjs/vite-plugin-federation (accept dev mode limitation)

Vite-based project, need full MF 2.0 features?
  → Wait for @module-federation/vite to stabilize OR migrate to Rspack
```

Vietnamese: Webpack 5 vẫn là reference implementation MF đầy đủ nhất. Rspack 1.0 (ByteDance, 2024) — Rust-based, feature parity với Webpack MF, build 10–15× nhanh hơn — best choice cho projects mới dùng Webpack-style MF. Vite plugin (`@originjs`) works cho production nhưng thiếu nhiều features: không support dev server, không `requiredVersion`, không dynamic remotes. Official MF 2.0 Vite plugin experimental. Decision: Rspack cho new projects, Webpack 5 cho existing, Vite chỉ cho simple cases.

**💡 Interview Signal:**

- ✅ Strong: Knows Rspack is now the recommended new-project choice (not Webpack), articulates specific Vite MF gaps (dev server, requiredVersion), knows `@module-federation/enhanced` is the cross-bundler SDK
- ❌ Weak: "Vite doesn't support Module Federation" — incorrect; it works in production, just has gaps

---

### 🔴 Q10: You need to migrate a monorepo of 6 React 18 apps to Module Federation. Describe your strategy for shared runtime versioning, design system singleton, and e2e testing.

**A:**

This is a real migration project — structured approach:

**Phase 0: Pre-migration audit (1–2 weeks)**

```bash
# Find version mismatches across all 6 apps
for app in apps/*/; do
  echo "=== $app ===" && cat "$app/package.json" | jq '.dependencies.react'
done

# Expected: ensure all 6 apps are on react@18.x.x (same minor preferred)
# If not: align React versions FIRST before introducing MF
```

**Phase 1: Identify the host and establish shared config**

Typically: the app users navigate to first = host (shell). Others become remotes.

```typescript
// packages/mf-shared-config/src/index.ts
// Shared between all 6 apps via monorepo package
export const sharedConfig = {
  react: {
    singleton: true,
    requiredVersion: "^18.2.0",
    eager: false,
  },
  "react-dom": {
    singleton: true,
    requiredVersion: "^18.2.0",
    eager: false,
  },
  // Design system as singleton — CRITICAL
  "@company/design-system": {
    singleton: true,
    requiredVersion: "^3.0.0",
    strictVersion: true, // Hard fail on version mismatch
  },
  // i18n singleton — prevents duplicate locale loading
  "react-i18next": {
    singleton: true,
    requiredVersion: "^13.0.0",
  },
  // DO NOT add: lodash, date-fns, axios, etc.
} satisfies import("webpack").Configuration["plugins"][0] extends infer P
  ? P extends { _options: { shared: infer S } }
    ? S
    : never
  : never;
```

**Phase 2: Migrate apps one at a time (remote-first, host last)**

Start with the most isolated app (fewest dependencies on host). Validate in staging before next migration.

```typescript
// Migration checklist per app:
// □ Add async boundary (bootstrap.ts pattern)
// □ Add ModuleFederationPlugin / @module-federation/enhanced
// □ Import sharedConfig from packages/mf-shared-config
// □ Define what this app EXPOSES
// □ Remove from monorepo bundling (each app builds independently)
// □ Set up own CI/CD pipeline (no more shared build)
// □ Deploy to staging, validate remoteEntry.js accessible
// □ Update shell's `remotes` to point to new remote URL
```

**Phase 3: Design system as singleton**

```typescript
// The design system team owns the singleton version
// All 6 apps MUST use the version specified in sharedConfig
// Enforcement via org-level lint rule:

// eslint rule (custom): no-ds-version-override
// Prevents any app from overriding design-system version in local config
```

**Phase 4: E2E testing strategy across federated apps**

```typescript
// Challenge: Playwright/Cypress tests that span remote boundaries

// Option A: Integration tests against production-like staging
// - Deploy all 6 remotes to staging environment
// - Run e2e against host pointing at staging remotes
// - Validates ACTUAL runtime federation

// Option B: Remote mocking in tests
// playwright.config.ts — route remote URL to local mock
import { test } from "@playwright/test";

test("checkout flow works with federated cart", async ({ page }) => {
  // Intercept remote fetch and serve local mock
  await page.route("**/checkout.company.com/remoteEntry.js", (route) => {
    route.fulfill({ body: mockCheckoutRemoteEntry });
  });

  await page.goto("/");
  await page.click('[data-testid="checkout-btn"]');
  await expect(page.locator('[data-testid="cart-summary"]')).toBeVisible();
});

// Option C: Consumer-driven contract tests (Pact)
// Each remote publishes its contract (exposed module API)
// Host tests against contracts, not live remotes
// Good for preventing breaking changes in CI
```

**Risk: "shared runtime versioning" over time**

As teams independently ship React updates, you risk drift:

- App-3 upgrades to React 19 while others stay on 18
- Singleton: App-3's React 19 wins if it loads first → other apps break

**Policy**: Create org-level `react-version-upgrade` RFC process. All 6 apps must upgrade in one coordinated sprint. Track in shared `packages/mf-shared-config/CHANGELOG.md`.

Vietnamese: Migration 6 apps sang MF: (1) Pre-audit — align React version trước. (2) Xác định host, tạo `mf-shared-config` package shared cho 6 apps. (3) Migrate từng app từ isolated nhất → host cuối cùng. (4) Design system luôn là singleton với `strictVersion: true`. (5) E2E testing: chạy toàn bộ remotes trên staging (integration tests) + Playwright route mocking cho unit e2e + consumer-driven contracts (Pact). (6) Version drift policy: React major update phải coordinated sprint, không upgrade từng app riêng lẻ.

**💡 Interview Signal:**

- ✅ Strong: Phases the migration, creates shared config package, knows design system singleton strictVersion, proposes concrete e2e strategies including Pact, addresses version drift policy
- ❌ Weak: "Just add ModuleFederationPlugin to each app" — no shared config, no testing strategy, no version governance

---

## Part 8: Anti-Patterns / Những Sai Lầm Cần Tránh

---

### ❌ Anti-Pattern 1: Sharing Every npm Dep as Singleton

```typescript
// ❌ WRONG: share everything as singleton
shared: {
  react: { singleton: true },
  'react-dom': { singleton: true },
  lodash: { singleton: true },        // ← unnecessary
  'date-fns': { singleton: true },    // ← unnecessary
  axios: { singleton: true },         // ← unnecessary
  'react-query': { singleton: true }, // ← maybe necessary
  moment: { singleton: true },        // ← unnecessary + deprecated
  // ... 30 more packages
}
```

**Tại sao sai**: Singleton cho lodash, date-fns, axios không có ý nghĩa — chúng không có shared state. Hậu quả: (1) Tất cả remotes bị lock vào cùng version → mất deploy independence. (2) Share-scope negotiation tốn thêm CPU cho mỗi remote load. (3) Version conflicts giữa remotes sẽ gây confusion. Chỉ dùng singleton cho packages có module-level shared state: React, React Router, i18n libraries, analytics singletons.

---

### ❌ Anti-Pattern 2: Mixing React Major Versions

```
// ❌ WRONG: host on React 17, remote on React 18, singleton: true
host: react@17.0.2 (singleton owner — loads first)
remote: react@18.2.0 (singleton: true)

Result:
  → remote gets React 17 (singleton from host wins)
  → remote uses React 18 concurrent features (startTransition, etc.)
  → Features silently degrade or crash at runtime
  → No build-time error (runtime-only failure)
```

**Fix**: Org-wide major version policy. All teams on same React major before adopting MF. Minor version mismatches are usually safe with `requiredVersion: '^18.0.0'`.

---

### ❌ Anti-Pattern 3: No Error Boundary Around Remotes

```tsx
// ❌ WRONG: remote without error boundary
function App() {
  return (
    <div>
      <Header />
      <Suspense fallback={<Loading />}>
        <CartSummary /> {/* Remote — no error boundary */}
      </Suspense>
      <Footer />
    </div>
  );
}

// Result: checkout.company.com goes down for 5 minutes
// → CartSummary import() rejects
// → React propagates error up to nearest error boundary
// → If no boundary: entire App unmounts → blank page
// → User sees empty screen during checkout team's outage
```

**Fix**: Wrap every remote in its own `<RemoteErrorBoundary>` with a meaningful static fallback. One remote's outage must NEVER kill the host app.

---

### ❌ Anti-Pattern 4: Shared Mutable State via `window.*`

```typescript
// ❌ WRONG: using window as shared state bus between host and remote
// remote/src/Cart.tsx
window.__sharedCart = { items: [], total: 0 }; // ← pollution

// host/src/Header.tsx
const cart = (window as any).__sharedCart; // ← reads remote's state
```

**Tại sao sai**: (1) Memory leaks — remote unmount không cleanup window properties. (2) Race conditions — no guarantees about initialization order. (3) TypeScript không biết about `window.__sharedCart` → `any` everywhere. (4) Hard to debug — no stack trace when state changes. **Fix**: Use proper state management (Redux Toolkit, Zustand, React Context via shared module) or event bus via Custom Events (`window.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }))`).

---

### ❌ Anti-Pattern 5: Synchronous Remote Loading in Main Bundle

```typescript
// ❌ WRONG: missing async boundary
// index.ts — loads synchronously
import React from "react"; // synchronous import
import ReactDOM from "react-dom"; // synchronous import
import { App } from "./App"; // App contains: import('checkout/Cart')

// Webpack cannot negotiate shareScope before sync imports execute
// Result: React may load twice (from host bundle AND remote)
```

**Fix**: Always use the `bootstrap.ts` async boundary pattern. Never import application code synchronously from the entry point.

---

### ❌ Anti-Pattern 6: Blindly Trusting Remote Code (Supply-Chain Risk)

```typescript
// ❌ WRONG: load from arbitrary third-party CDN
remotes: {
  ui: 'ui@https://cdn.some-vendor.com/remoteEntry.js',  // ← NEVER DO THIS
}

// If cdn.some-vendor.com is compromised:
// → Attacker pushes malicious remoteEntry.js
// → Your host loads it
// → Attacker has full access to your app's context, user data, auth tokens
// → This is equivalent to adding a random npm package without reviewing source
```

**Fix**: Only load remotes from: (1) Internal infrastructure you control. (2) Trusted partners with signed code + integrity verification. (3) If third-party is required: use iframe sandboxing instead of MF.

---

## 🧠 Memory Hook / Mẹo Ghi Nhớ

> **"Runtime beats Build-time — But Isolation Costs"**
>
> Module Federation = npm package nhưng load **sau khi browser đã start**. Remote ship code → users nhận ngay, không cần host rebuild. Đánh đổi: **không có isolation** (remote code = your context). React crash → **singleton: true** là antidote. Security → **CORS + CSP allowlist + không bao giờ trust external remotes**. Vite MF → **production-only, no dev server**. Rspack 1.0 → **10× faster Webpack-compatible MF**. MF 2.0 → **manifest + runtime API + type sharing**.

```
MF Quick Memory Map:
  npm pkg          → build-time coupling
  MF remote        → runtime loading, deploy independent
  singleton: true  → one React instance (hooks safe)
  Error Boundary   → one remote down ≠ whole app down
  CSP conflict     → allowlist remote origins explicitly
  No isolation     → remote code = host context = supply-chain risk
  Vite MF          → production only (dev server gap)
  Rspack MF        → Webpack-compatible, 10× faster
  MF 2.0           → manifest + runtime API + types
```

---

## Q&A Summary Table / Bảng Tổng Hợp

| #   | Question                                 | Level | Key Answer Points                                                                                             |
| --- | ---------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------- |
| Q1  | npm vs Module Federation                 | 🟢    | Build-time coupling vs runtime loading; deploy independence                                                   |
| Q2  | Host / Remote / Bidirectional            | 🟢    | Host consumes, remote exposes, bidirectional = both; circular dep risk                                        |
| Q3  | shared deps — singleton, eager, versions | 🟡    | singleton for React (module-level state); eager = bundle in main chunk; strictVersion = hard fail             |
| Q4  | MF 1.0 vs 2.0                            | 🟡    | Static vs dynamic remotes; manifest vs remoteEntry; cross-bundler; runtime API; types                         |
| Q5  | Type safety across remotes               | 🟡    | Manual d.ts → Zod runtime contracts → MF 2.0 type sharing                                                     |
| Q6  | Remote unavailable handling              | 🟡    | .catch() fallback + Error Boundary + monitoring; Suspense doesn't catch errors                                |
| Q7  | Production at 50+ teams scale            | 🔴    | Minimal share-scope, prefetch, org React version policy, manifest-based soft updates                          |
| Q8  | Security model                           | 🔴    | No isolation, supply-chain attack, CSP conflict + allowlist, SRI + manifest pinning                           |
| Q9  | Vite/Rspack vs Webpack                   | 🔴    | Rspack = Webpack-compatible + 10× faster; Vite MF = production-only, no dev server, no requiredVersion        |
| Q10 | Migrate 6 apps to MF                     | 🔴    | Shared config package, remote-first migration, strictVersion for DS, staging + Pact e2e, React version policy |

---

## Cold Call / Câu Hỏi Bất Ngờ

Interviewer có thể hỏi những câu sau mà không có context:

> "Why did Zack Jackson build Module Federation?"

→ Lululemon problem: 12 teams cần deploy independently without coordinating rebuilds. npm packages có build-time coupling — thay đổi 1 button phải rebuild toàn bộ host. MF giải quyết bằng runtime loading.

> "Your checkout remote is down. What does the user see?"

→ Phụ thuộc vào implementation. Không có error boundary → blank page. Có error boundary + static fallback → user thấy "Checkout temporarily unavailable — click here to checkout" (static link). Đây là difference giữa Junior và Senior: Senior **thiết kế fallback trước khi code feature**.

> "Can Module Federation work with micro-frontends using different React versions?"

→ Technically: không an toàn với singleton (version mismatch → crash) và không work without singleton (hooks crash). Thực tế: buộc phải có org-wide major version policy. Nếu cần mix React 17 + 18 → iframe MFE là safer option.

> "How is Module Federation different from Web Components MFE?"

→ Web Components: browser-native, framework-agnostic, ship custom HTML elements, isolation qua Shadow DOM, không share JS context. MF: share JS modules tại runtime, không isolation, phụ thuộc bundler, optimal cho React/Vue teams. Web Components tốt hơn cho third-party widgets; MF tốt hơn cho internal orgs dùng cùng framework.

> "What is the remoteEntry.js file?"

→ Small JavaScript container file generated bởi Webpack/Rspack ModuleFederationPlugin khi build remote. Nó register the remote's container với share-scope system, khai báo exposed modules, và biết cách fetch correct chunks khi module được request. Host fetch file này đầu tiên để "discover" remote's capabilities.

---

## Self-Check / Tự Kiểm Tra

Sau khi học xong file này, bạn nên có thể trả lời tất cả câu sau trong vòng 60 giây mỗi câu:

- [ ] Giải thích tại sao npm packages tạo build-time coupling và MF giải quyết thế nào
- [ ] Vẽ ASCII diagram host ↔ remote ↔ shareScope
- [ ] Giải thích `singleton: true` và tại sao React PHẢI dùng nó
- [ ] Nêu 3 cái khác nhau cụ thể giữa MF 1.0 và 2.0
- [ ] Nêu 3 approaches cho type safety và khi nào dùng mỗi loại
- [ ] Giải thích tại sao CSP `script-src 'self'` breaks MF và cách fix
- [ ] Nêu supply-chain attack scenario và 3 mitigations
- [ ] Giải thích Vite MF dev mode limitation
- [ ] Nêu tại sao Rspack MF thường được ưu tiên hơn Webpack 5 cho new projects (2024+)
- [ ] Sketch migration strategy cho 6 apps với e2e testing approach
- [ ] Nêu 6 anti-patterns và fix cho từng cái
- [ ] Giải thích sự khác biệt của MF so với iframe MFE về isolation

**Scoring:**

- 10–12 ✅ → Ready cho Senior MF questions tại Microsoft, Grab, Axon
- 7–9 ✅ → Ready cho Mid-level MF questions; review gaps
- < 7 ✅ → Review phần còn thiếu, đặc biệt Q7 (scale) và Q8 (security)

---

> **See also / Xem thêm**:
>
> - [`03-micro-frontends-scale.md`](./03-micro-frontends-scale.md) — MFE strategy tổng quát (iframe, Web Components, SSI)
> - [`../07-web-security/`](../07-web-security/) — CSP, SRI, XSS fundamentals
> - [`../08-fe-system-design/`](../08-fe-system-design/) — FE system design: CDN, edge, BFF patterns
> - [Zack Jackson — Module Federation Concepts](https://module-federation.io/) — official docs (MF 2.0)
> - [Rspack 1.0 Release Blog](https://rspack.dev/blog/announcing-1-0) — ByteDance, October 2024
