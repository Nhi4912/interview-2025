# Distributed Frontend Systems / Hệ Thống Frontend Phân Tán

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior (Expert)
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Tổng Quan / Overview

Distributed frontend systems encompass micro-frontends, module federation, edge rendering, real-time
collaboration, and observability at scale. These are **senior/staff-level** topics that test your
ability to reason about system-wide trade-offs, not just individual component design.

**Interview goal**: Explain WHY a pattern exists before explaining HOW it works. Always tie answers
back to team autonomy, deployment independence, and failure isolation.

### Cross-references / Tài liệu liên quan

- [Event-Driven Architecture](./17-frontend-theory-13-event-driven-architecture.md)
- [Performance Engineering](./19-expert-topics-02-performance-engineering.md)
- [Security Architecture](./19-expert-topics-03-security-architecture.md)
- [HTTP & Networking Theory](./17-frontend-theory-12-http-networking-theory.md)

---

## Topic 1: Micro-Frontend Boundary Design 🔴

### Concept / Khái Niệm

**EN**: A micro-frontend (MFE) boundary defines which code and UI belongs to which team. The key
insight is that _organisational boundaries drive technical boundaries_ — this is **Conway's Law**:
"Any organisation that designs a system will produce a design whose structure is a copy of the
organisation's communication structure."

**VI**: Ranh giới micro-frontend (MFE) xác định code và UI nào thuộc về team nào. Nguyên tắc cốt
lõi là **Conway's Law**: Kiến trúc hệ thống phản chiếu cấu trúc giao tiếp của tổ chức.

### Decision Framework / Khung Quyết Định

```
HOW TO SPLIT MICRO-FRONTENDS
─────────────────────────────────────────────────────────────────────

Strategy A: By Domain (Domain-Driven Design)
  ┌──────────────────────────────────────────────────┐
  │  Shell App (Navigation, Auth, Layout)             │
  ├────────────┬────────────┬────────────────────────┤
  │  Checkout  │  Catalog   │  User Profile           │
  │  Team: Pay │  Team: Cat │  Team: Identity         │
  └────────────┴────────────┴────────────────────────┘
  ✅ Works when: teams own full vertical slices
  ❌ Breaks when: domains share too much UI state

Strategy B: By Page/Route
  /checkout/**    → Checkout MFE
  /products/**    → Catalog MFE
  /account/**     → Profile MFE
  ✅ Simple routing, clear ownership
  ❌ Cross-page flows become painful

Strategy C: By Widget/Component (Fragment MFEs)
  Header: Shell   →  <HeaderMFE />
  Sidebar: CMS    →  <RecommendationsMFE />
  Cart: Commerce  →  <CartWidgetMFE />
  ✅ Granular updates per team
  ❌ High coordination cost, runtime complexity
```

### Boundary Anti-Patterns / Lỗi Thường Gặp

```typescript
// ❌ BAD: Shared mutable state across MFE boundaries
// MFE A writes directly to MFE B's store
import { checkoutStore } from "@company/checkout-mfe";
checkoutStore.addItem(product); // Tight coupling!

// ❌ BAD: Shared CSS classes across MFE boundaries
// checkout.css has .btn-primary that catalog also uses
// → One team's refactor breaks another team's UI

// ✅ GOOD: Communication via well-defined contracts
// MFE A dispatches a domain event
window.dispatchEvent(
  new CustomEvent("mfe:add-to-cart", {
    detail: { productId: "123", quantity: 1 },
    bubbles: true,
  }),
);

// MFE B (Cart) listens for that event
window.addEventListener("mfe:add-to-cart", (e: CustomEvent) => {
  cartService.addItem(e.detail);
});
```

### Conway's Law in Practice

```
Organisation:               System:
─────────────────────────── ──────────────────────────────────────
Team A: Checkout squad   →  checkout.company.com (isolated deploy)
Team B: Catalog squad    →  catalog.company.com (isolated deploy)
Team C: Platform squad   →  design-system, shared auth, shell

If checkout and catalog share ONE repo → they'll share too much code
→ one team blocks the other's release → monolith behaviour returns
```

### Interview Q&A

**Q (🔴)**: "How would you decide whether to use micro-frontends for a new project?"

**Expected answer**:

> "I'd evaluate three dimensions: team size (>3 teams is a strong signal), deployment independence
> (do teams need to release without coordinating?), and technology diversity (do teams have
> legitimately different stack needs?). MFEs add real complexity — shared deps, runtime integration,
> cross-MFE testing. For a single team under 10 people I'd almost always start with a monorepo
> modular monolith and extract MFEs only when the pain of coordination exceeds the cost of
> distribution."

**Trade-offs**:
| Benefit | Cost |
|---------|------|
| Team autonomy | Cross-MFE testing complexity |
| Independent deploys | Duplicate dependencies increase bundle size |
| Tech diversity | Routing and navigation coordination |
| Fault isolation | Shared state management overhead |

---

## Topic 2: Integration Patterns Comparison 🔴

### The Four Approaches / Bốn Phương Pháp Tích Hợp

#### 1. Module Federation (Webpack 5+)

```typescript
// webpack.config.ts — HOST APP
const hostConfig: Configuration = {
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      remotes: {
        checkout: "checkout@https://checkout.cdn.com/remoteEntry.js",
        catalog: "catalog@https://catalog.cdn.com/remoteEntry.js",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
      },
    }),
  ],
};

// webpack.config.ts — REMOTE APP (Checkout)
const remoteConfig: Configuration = {
  plugins: [
    new ModuleFederationPlugin({
      name: "checkout",
      filename: "remoteEntry.js",
      exposes: {
        "./CheckoutPage": "./src/pages/CheckoutPage",
        "./CartWidget": "./src/components/CartWidget",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
      },
    }),
  ],
};
```

#### 2. Single-SPA

```typescript
// root-config.ts — registers micro-apps
import { registerApplication, start } from "single-spa";

registerApplication({
  name: "@company/checkout",
  app: () => import("https://checkout.cdn.com/main.js"),
  activeWhen: (location) => location.pathname.startsWith("/checkout"),
  customProps: { authToken: getAuthToken() },
});

registerApplication({
  name: "@company/catalog",
  app: () => import("https://catalog.cdn.com/main.js"),
  activeWhen: ["/products", "/search"],
});

start({ urlRerouteOnly: true });
```

#### 3. iframes

```html
<!-- Shell embeds Checkout in an iframe -->
<iframe
  src="https://checkout.internal.company.com/cart"
  title="Shopping Cart"
  sandbox="allow-scripts allow-same-origin allow-forms"
  loading="lazy"
></iframe>
```

```typescript
// Cross-iframe communication via postMessage
// Shell → Checkout
const iframe = document.querySelector<HTMLIFrameElement>("#checkout-iframe")!;
iframe.contentWindow?.postMessage(
  { type: "AUTH_TOKEN", token: currentUser.token },
  "https://checkout.internal.company.com",
);

// Checkout listens
window.addEventListener("message", (event) => {
  if (event.origin !== "https://shell.company.com") return; // security!
  if (event.data.type === "AUTH_TOKEN") applyToken(event.data.token);
});
```

#### 4. Web Components

```typescript
// Checkout team publishes a Web Component
class CartWidget extends HTMLElement {
  static observedAttributes = ["user-id", "currency"];

  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.render();
  }

  attributeChangedCallback(name: string, _old: string, next: string) {
    if (name === "user-id") this.loadCart(next);
  }

  private render() {
    this.shadowRoot!.innerHTML = `
      <style>/* scoped styles — no leakage */</style>
      <div class="cart-widget">
        <slot name="empty-state">Your cart is empty</slot>
      </div>
    `;
  }
}
customElements.define("cart-widget", CartWidget);

// Any team consumes it — framework-agnostic
// <cart-widget user-id="u_123" currency="USD"></cart-widget>
```

### Comparison Table / Bảng So Sánh

| Criterion                |    Module Federation    |    Single-SPA     |       iframes       |  Web Components   |
| ------------------------ | :---------------------: | :---------------: | :-----------------: | :---------------: |
| **Runtime integration**  |        ✅ Native        |     ✅ Native     |      ✅ Native      |     ✅ Native     |
| **Build-time coupling**  |   ❌ Shared manifest    |   ❌ Import map   |       ✅ None       |      ✅ None      |
| **Style isolation**      | ❌ Manual (CSS Modules) |     ❌ Manual     |       ✅ Full       |   ✅ Shadow DOM   |
| **Routing control**      |         ✅ Full         |      ✅ Full      |   ❌ Independent    | ❌ Component-only |
| **SEO / SSR friendly**   |         ✅ Yes          |    ⚠️ Complex     |       ❌ Bad        |    ⚠️ Partial     |
| **Cross-MFE comms**      |         ✅ Easy         |      ✅ Easy      | ❌ postMessage only |  ⚠️ Events/attrs  |
| **Bundle deduplication** |    ✅ Shared modules    | ❌ Each loads own |  ❌ Full isolation  | ❌ Full isolation |
| **Security isolation**   |     ❌ Same origin      |  ❌ Same origin   |   ✅ Cross-origin   |  ❌ Same origin   |
| **Performance overhead** |           Low           |      Medium       | High (separate doc) |        Low        |

### Interview Q&A

**Q (🔴)**: "iframes are the oldest technique — why would a modern company still choose them?"

**Expected answer**:

> "iframes are the only option that provides genuine security isolation. If you're embedding a
> third-party widget (payment form, analytics dashboard from another company), you WANT the style,
> JS, and DOM to be fully isolated. PCI-DSS compliant payment forms are a classic case — Stripe's
> Elements runs in an iframe for this exact reason. The performance cost is acceptable when
> isolation is non-negotiable."

---

## Topic 3: Shared State Across MFEs 🔴

### The Problem / Vấn Đề

MFEs are independently deployed, so you cannot share a single Redux store at build time. You need
runtime communication patterns.

### Pattern 1: Custom Events (Pub/Sub)

```typescript
// types/mfe-events.ts — shared contract (published as npm package)
export type MFEEvents = {
  "cart:item-added": { productId: string; quantity: number };
  "auth:user-changed": { userId: string | null; roles: string[] };
  "cart:cleared": Record<string, never>;
};

// event-bus.ts — thin wrapper
export const EventBus = {
  emit<K extends keyof MFEEvents>(event: K, detail: MFEEvents[K]): void {
    window.dispatchEvent(new CustomEvent(event, { detail, bubbles: true }));
  },

  on<K extends keyof MFEEvents>(event: K, handler: (detail: MFEEvents[K]) => void): () => void {
    const listener = (e: Event) => handler((e as CustomEvent).detail);
    window.addEventListener(event, listener);
    return () => window.removeEventListener(event, listener);
  },
};

// Checkout MFE publishes
EventBus.emit("cart:item-added", { productId: "SKU-001", quantity: 2 });

// Cart Widget MFE subscribes
const unsub = EventBus.on("cart:item-added", ({ productId, quantity }) => {
  cartStore.add(productId, quantity);
});
// Cleanup on unmount:
useEffect(() => unsub, []);
```

### Pattern 2: Shared Singleton Store (Module Federation)

```typescript
// shared-store/index.ts — exposed via Module Federation
import { create } from 'zustand';

interface GlobalStore {
  userId: string | null;
  cartCount: number;
  setUser: (id: string | null) => void;
  setCartCount: (n: number) => void;
}

// Singleton — MF ensures only ONE instance in the page
export const useGlobalStore = create<GlobalStore>((set) => ({
  userId: null,
  cartCount: 0,
  setUser: (id) => set({ userId: id }),
  setCartCount: (n) => set({ cartCount: n }),
}));

// webpack.config.ts — both host and remotes mark it as singleton
shared: {
  '@company/shared-store': { singleton: true, requiredVersion: '^1.0.0' },
}
```

### Pattern 3: URL / Query String State

```typescript
// Useful for routing-driven state (filters, pagination, selected IDs)
// Any MFE can read URL — zero coupling

// Catalog MFE writes state to URL
const updateFilters = (filters: FilterState) => {
  const params = new URLSearchParams(window.location.search);
  params.set("category", filters.category);
  params.set("price_max", String(filters.priceMax));
  window.history.pushState({}, "", `?${params.toString()}`);
};

// Analytics MFE reads it — no dependency on Catalog
const getActiveFilters = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    category: params.get("category"),
    priceMax: Number(params.get("price_max")),
  };
};
```

### Pattern 4: Browser Storage Bridge

```typescript
// BroadcastChannel — same origin, cross-tab/MFE communication
const authChannel = new BroadcastChannel("auth-state");

// Auth MFE broadcasts login
authChannel.postMessage({ type: "LOGIN", userId: "u_123", token: "jwt..." });

// Any MFE subscribes
authChannel.onmessage = (event) => {
  if (event.data.type === "LOGIN") {
    applyAuthToken(event.data.token);
  }
};
```

### Decision Tree / Cây Quyết Định

```
State needs to be shared across MFEs?
│
├─ Is it AUTH/SESSION data?
│   └─ BroadcastChannel + localStorage (survives refresh)
│
├─ Is it a domain EVENT (something happened)?
│   └─ Custom Events / EventBus (fire-and-forget)
│
├─ Is it PERSISTENT cross-MFE UI state (cart count, user prefs)?
│   └─ Shared Singleton Store via Module Federation
│
└─ Is it NAVIGATION / filter / pagination state?
    └─ URL query params (bookmarkable, shareable)
```

### Interview Q&A

**Q (🔴)**: "Two MFEs need to share authentication state. Module Federation is NOT available. How?"

**Expected answer**:

> "I'd use a combination of localStorage for persistence and BroadcastChannel for real-time sync.
> Auth MFE writes the JWT to localStorage on login, and broadcasts via BroadcastChannel so other
> already-loaded MFEs update immediately. On mount, each MFE reads from localStorage. On logout,
> auth MFE clears storage and broadcasts — all MFEs react. The contract (key names, message types)
> is published as a tiny shared npm package so teams don't drift."

---

## Topic 4: Module Federation Deep Dive 🔴

### Host / Remote Architecture

```
                    ┌─────────────────────────┐
                    │      SHELL (Host)        │
                    │  - Routing               │
                    │  - Auth context          │
                    │  - Design system         │
                    └────────────┬────────────┘
                                 │ dynamic import()
          ┌──────────────────────┼──────────────────────┐
          ▼                      ▼                      ▼
 ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
 │  Checkout MFE  │   │  Catalog MFE   │   │  Profile MFE   │
 │  (Remote)      │   │  (Remote)      │   │  (Remote)      │
 │  remoteEntry.js│   │  remoteEntry.js│   │  remoteEntry.js│
 └────────────────┘   └────────────────┘   └────────────────┘
```

### Full Configuration Example

```typescript
// apps/shell/webpack.config.ts
import { ModuleFederationPlugin } from "@module-federation/enhanced/webpack";

export default {
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      remotes: {
        checkout: "checkout@[window.MFE_URLS.checkout]/remoteEntry.js",
        catalog: "catalog@[window.MFE_URLS.catalog]/remoteEntry.js",
      },
      shared: {
        // Singletons — only ONE copy in the page
        react: { singleton: true, strictVersion: false, requiredVersion: "^18" },
        "react-dom": { singleton: true, strictVersion: false, requiredVersion: "^18" },
        "react-router-dom": { singleton: true, requiredVersion: "^6" },

        // Eager: shell initialises these before remotes load
        "@company/design-system": {
          singleton: true,
          eager: true,
          requiredVersion: "^3.0.0",
        },
      },
    }),
  ],
};

// apps/checkout/webpack.config.ts
export default {
  plugins: [
    new ModuleFederationPlugin({
      name: "checkout",
      filename: "remoteEntry.js",
      exposes: {
        "./CheckoutPage": "./src/pages/CheckoutPage",
        "./CartWidget": "./src/components/CartWidget",
        "./useCartCount": "./src/hooks/useCartCount", // expose hooks too!
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18" },
        "react-dom": { singleton: true, requiredVersion: "^18" },
      },
    }),
  ],
};
```

### Consuming Remote Modules

```typescript
// Shell app — lazy-loaded remote component
import React, { Suspense, lazy } from 'react';

// TypeScript: declare the remote module shape
declare module 'checkout/CheckoutPage' {
  const CheckoutPage: React.ComponentType<{ userId: string }>;
  export default CheckoutPage;
}

const CheckoutPage = lazy(() => import('checkout/CheckoutPage'));

export function App() {
  return (
    <Router>
      <Route
        path="/checkout/*"
        element={
          <Suspense fallback={<PageSkeleton />}>
            <CheckoutPage userId={currentUser.id} />
          </Suspense>
        }
      />
    </Router>
  );
}
```

### Common Pitfall: The Shared Singleton Problem

```typescript
// ❌ PROBLEM: React loads twice → hooks break, context doesn't share
// Happens when requiredVersion ranges don't overlap

// Remote has:  "react": "^18.2.0"
// Host has:    "react": "^17.0.0"
// Result: TWO React instances — useState silently breaks across boundary

// ✅ FIX 1: Use loose ranges
shared: { react: { singleton: true, requiredVersion: '>=17' } }

// ✅ FIX 2: strictVersion: false (warn, don't throw)
shared: { react: { singleton: true, strictVersion: false } }

// ✅ FIX 3: Detect duplicate React (debug utility)
export function detectDuplicateReact() {
  const instances = (window as any).__REACT_INSTANCES__ ?? 0;
  (window as any).__REACT_INSTANCES__ = instances + 1;
  if (instances > 0) {
    console.error('[MFE] Multiple React instances detected! Check shared config.');
  }
}
```

### Interview Q&A

**Q (🔴)**: "What is the 'eager' flag in Module Federation shared config and when should you use it?"

**Expected answer**:

> "By default, shared modules are lazy — they're fetched when first needed. Setting `eager: true`
> on the HOST's shared config makes the module bundled directly into the main chunk, so it's
> available synchronously before any remote loads. You need this for modules that must be
> initialised before the app renders — like React itself, your design system's theme provider, or
> your auth context. The cost is a slightly larger initial bundle. You should NOT set eager on
> remotes, only on the host, to avoid the 'Shared module is not available for eager consumption'
> error."

---

## Topic 5: Dynamic Remote Loading 🔴

### Runtime Remote Resolution

Rather than hard-coding remote URLs in webpack config, resolve them at runtime from a manifest:

```typescript
// remote-registry.ts
interface RemoteManifest {
  name: string;
  version: string;
  url: string;
  integrity: string; // SRI hash
}

class RemoteRegistry {
  private cache = new Map<string, Promise<RemoteManifest>>();

  async resolve(remoteName: string): Promise<RemoteManifest> {
    if (!this.cache.has(remoteName)) {
      this.cache.set(remoteName, this.fetchManifest(remoteName));
    }
    return this.cache.get(remoteName)!;
  }

  private async fetchManifest(name: string): Promise<RemoteManifest> {
    const res = await fetch(`/api/mfe-registry/${name}`);
    if (!res.ok) throw new Error(`Registry lookup failed for ${name}`);
    return res.json();
  }
}

export const registry = new RemoteRegistry();
```

### Dynamic Script Injection

```typescript
// dynamic-remote-loader.ts
async function loadRemoteModule<T = unknown>(
  remoteName: string,
  exposedModule: string,
): Promise<T> {
  const { url, integrity } = await registry.resolve(remoteName);

  // Avoid double-loading
  if (!(window as any)[remoteName]) {
    await injectScript(url, integrity);
    await initContainer(remoteName);
  }

  return getModule<T>(remoteName, exposedModule);
}

function injectScript(url: string, integrity: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${url}"]`);
    if (existing) return resolve();

    const script = document.createElement("script");
    script.src = url;
    script.crossOrigin = "anonymous";
    script.integrity = integrity; // SRI validation
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load remote: ${url}`));
    document.head.appendChild(script);
  });
}

async function initContainer(remoteName: string): Promise<void> {
  const container = (window as any)[remoteName];
  // Webpack 5 container API
  await container.init(__webpack_share_scopes__.default);
}

async function getModule<T>(remoteName: string, module: string): Promise<T> {
  const container = (window as any)[remoteName];
  const factory = await container.get(module);
  return factory();
}
```

### Fallback Strategy

```typescript
// remote-loader-with-fallback.ts
async function loadWithFallback<T>(
  remoteName: string,
  exposedModule: string,
  FallbackComponent: React.ComponentType,
): Promise<{ default: React.ComponentType } | { default: React.ComponentType }> {
  try {
    const mod = await Promise.race([
      loadRemoteModule<{ default: React.ComponentType }>(remoteName, exposedModule),
      timeout(5000, `Remote ${remoteName} load timeout`),
    ]);
    return mod;
  } catch (err) {
    console.error(`[MFE] Failed to load ${remoteName}/${exposedModule}:`, err);
    reportToSentry(err, { remoteName, exposedModule });
    return { default: FallbackComponent };
  }
}

function timeout(ms: number, message: string): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));
}
```

### Version Negotiation

```typescript
// version-negotiator.ts
interface VersionedRemote {
  name: string;
  requestedVersion: string;
  availableVersions: string[];
}

function negotiateVersion({ requestedVersion, availableVersions }: VersionedRemote): string {
  // Use semver to find best compatible version
  const compatible = availableVersions
    .filter((v) => semver.satisfies(v, requestedVersion))
    .sort(semver.rcompare); // newest first

  if (compatible.length === 0) {
    const fallback = semver.maxSatisfying(availableVersions, "*")!;
    console.warn(`[MFE] No version satisfies ${requestedVersion}, falling back to ${fallback}`);
    return fallback;
  }

  return compatible[0];
}
```

---

## Topic 6: Version Compatibility Matrix 🔴

### Semver Strategy for MFEs

```
VERSIONING RULES FOR MICRO-FRONTEND CONTRACTS
─────────────────────────────────────────────────────────────

PATCH (1.0.x): Bug fix inside MFE — no contract change
MINOR (1.x.0): New exposed module or optional prop added
MAJOR (x.0.0): Breaking change to exposed module API

Contract = { exposed modules, props interface, emitted events }

Examples:
  1.0.0 → 1.0.1  Safe: internal bug fix
  1.0.0 → 1.1.0  Safe: new ./NewFeature exposed, old modules unchanged
  1.0.0 → 2.0.0  BREAKING: CheckoutPage removed prop `legacy`
                  Shell team must update before Checkout deploys!
```

### Peer Dependency Management

```typescript
// package.json for a shared design system consumed by ALL MFEs
{
  "name": "@company/design-system",
  "version": "3.4.1",
  "peerDependencies": {
    "react": ">=17.0.0 <20.0.0",
    "react-dom": ">=17.0.0 <20.0.0"
  },
  "peerDependenciesMeta": {
    "react": { "optional": false }
  }
}

// CI compatibility check script
// compatibility-check.ts
import { execSync } from 'child_process';

const MFE_APPS = ['shell', 'checkout', 'catalog', 'profile'];

const results = MFE_APPS.map(app => {
  const pkg = require(`../apps/${app}/package.json`);
  const dsVersion = pkg.dependencies?.['@company/design-system'];
  const reactVersion = pkg.dependencies?.react;
  return { app, dsVersion, reactVersion };
});

// Find version conflicts
const dsVersions = [...new Set(results.map(r => r.dsVersion))];
if (dsVersions.length > 1) {
  console.error('❌ Design system version drift detected:');
  results.forEach(r => console.error(`  ${r.app}: ${r.dsVersion}`));
  process.exit(1);
}
console.log('✅ All MFEs use compatible design system version');
```

### Automated Enforcement in CI

```yaml
# .github/workflows/mfe-compatibility.yml
name: MFE Compatibility Check
on: [pull_request]

jobs:
  compatibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check shared dep versions
        run: node scripts/compatibility-check.ts

      - name: Validate remote contracts
        run: |
          # Download current prod remoteEntry.js manifests
          # Compare against new build's exposed modules
          node scripts/contract-validator.ts

      - name: Bundle size budget
        run: |
          node scripts/size-budget.ts --budget 250kb --target apps/checkout/dist
```

---

## Topic 7: Service Worker Lifecycle 🔴

### Full Lifecycle Diagram

```
SW Registration
      │
      ▼
  INSTALLING ──── install event fires
      │           └─ self.skipWaiting() → skip waiting phase
      │
      ├─── Cache primed successfully?
      │         │
      │         YES                  NO
      │         │                    │
      ▼         ▼                    ▼
  WAITING    (skip to)          ERROR → back to unregistered
      │       ACTIVATING
      │
      │  (old SW has no more clients)
      ▼
  ACTIVATING ── activate event fires
      │          └─ clients.claim() → take control immediately
      │
      ▼
   ACTIVE ──── Intercepts fetch events
      │
      │  (new SW installs)
      ▼
  REDUNDANT (replaced by new SW)
```

### Real Service Worker Implementation

```typescript
// sw.ts — TypeScript service worker
/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

const CACHE_VERSION = "v3";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;

const PRECACHE_URLS = ["/", "/offline.html", "/static/css/main.css", "/static/js/main.js"];

// INSTALL: pre-cache critical assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("[SW] Pre-caching static assets");
      return cache.addAll(PRECACHE_URLS);
    }),
  );
  // Activate immediately without waiting for old SW to die
  self.skipWaiting();
});

// ACTIVATE: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map((key) => {
              console.log(`[SW] Deleting old cache: ${key}`);
              return caches.delete(key);
            }),
        ),
      )
      .then(() => self.clients.claim()), // take control of all open tabs
  );
});

// FETCH: network-first with cache fallback for API, cache-first for assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return; // don't cache POST/PUT/DELETE

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirstStrategy(request));
  } else {
    event.respondWith(cacheFirstStrategy(request));
  }
});

async function networkFirstStrategy(request: Request): Promise<Response> {
  try {
    const response = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    return (
      cached ??
      new Response(JSON.stringify({ error: "Offline" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      })
    );
  }
}

async function cacheFirstStrategy(request: Request): Promise<Response> {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  const cache = await caches.open(STATIC_CACHE);
  cache.put(request, response.clone());
  return response;
}
```

### Update Flow / Luồng Cập Nhật

```typescript
// main.ts — handle SW updates gracefully in the app
async function registerSW() {
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.register("/sw.js");

  // Detect when a new SW is waiting
  registration.addEventListener("updatefound", () => {
    const newWorker = registration.installing!;
    newWorker.addEventListener("statechange", () => {
      if (
        newWorker.state === "installed" &&
        navigator.serviceWorker.controller // old SW exists
      ) {
        // Show "Update available" toast to user
        showUpdateBanner({
          onAccept: () => {
            // Tell new SW to skip waiting
            newWorker.postMessage({ type: "SKIP_WAITING" });
            window.location.reload();
          },
        });
      }
    });
  });
}
```

### Interview Q&A

**Q (🟡)**: "What happens if you call `skipWaiting()` in the install event? What are the risks?"

**Expected answer**:

> "skipWaiting() makes the new SW activate immediately, bypassing the waiting phase. The risk is
> that if a user has multiple tabs open, one tab could be running the OLD SW while another switches
> to the NEW SW. If the new SW changed the cache structure or API shape, the old tab might serve
> stale responses. For critical data apps (banking, forms), it's safer to wait for the user to
> close all tabs, or show an 'Update available — click to refresh' banner."

---

## Topic 8: Caching Strategy Selection 🔴

### Decision Tree / Cây Quyết Định

```
What are you caching?
│
├── App shell (HTML, CSS, JS bundles)
│   └── CACHE FIRST → fastest load, update via SW lifecycle
│
├── User-specific API data (cart, profile, orders)
│   └── NETWORK FIRST → freshness matters, cache as fallback
│
├── Frequently read, rarely changed (product catalog, CMS content)
│   └── STALE WHILE REVALIDATE → instant load + background refresh
│
├── Real-time data (stock prices, live chat)
│   └── NETWORK ONLY → cache would be stale immediately
│
└── Static assets (images, fonts, icons)
    └── CACHE FIRST with long TTL + hash-based invalidation
```

### Workbox Configuration

```typescript
// workbox.config.ts
import { generateSW } from "workbox-build";

generateSW({
  swDest: "dist/sw.js",
  globDirectory: "dist",
  globPatterns: ["**/*.{js,css,html,png,jpg,svg,woff2}"],

  runtimeCaching: [
    // Strategy 1: Cache-First for static assets (immutable with hash)
    {
      urlPattern: /\.(?:js|css|woff2)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
        expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 }, // 1 year
      },
    },

    // Strategy 2: Network-First for API calls
    {
      urlPattern: /^https:\/\/api\.company\.com\/v1\//,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 3, // fallback to cache after 3s
        expiration: { maxAgeSeconds: 60 * 5 }, // 5 min stale
      },
    },

    // Strategy 3: StaleWhileRevalidate for product catalog
    {
      urlPattern: /^https:\/\/api\.company\.com\/v1\/products/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "catalog-cache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
      },
    },

    // Strategy 4: images with Cache-First + size limit
    {
      urlPattern: /\.(?:png|jpg|jpeg|webp|avif)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
        cacheableResponse: { statuses: [0, 200] }, // include opaque responses
      },
    },
  ],
});
```

### Cache Size Budget Enforcement

```typescript
// sw-cache-monitor.ts — in SW
async function enforceCacheBudget(cacheName: string, maxBytes: number) {
  const cache = await caches.open(cacheName);
  const requests = await cache.keys();
  let totalSize = 0;
  const entries: Array<{ request: Request; size: number; date: number }> = [];

  for (const request of requests) {
    const response = await cache.match(request);
    if (!response) continue;
    const blob = await response.blob();
    const date = new Date(response.headers.get("date") ?? 0).getTime();
    entries.push({ request, size: blob.size, date });
    totalSize += blob.size;
  }

  if (totalSize > maxBytes) {
    // Evict oldest entries first (LRU)
    entries.sort((a, b) => a.date - b.date);
    for (const entry of entries) {
      if (totalSize <= maxBytes) break;
      await cache.delete(entry.request);
      totalSize -= entry.size;
    }
  }
}
```

---

## Topic 9: Background Sync 🔴

### Use Case / Trường Hợp Sử Dụng

Background Sync allows deferring actions (form submissions, analytics events, cart updates) until
the user has a stable connection. Critical for offline-first apps.

### Sync Queue Implementation

```typescript
// sync-queue.ts
interface SyncItem {
  id: string;
  tag: string;
  payload: unknown;
  createdAt: number;
  retryCount: number;
  maxRetries: number;
}

class SyncQueue {
  private dbName = "sync-queue-db";
  private storeName = "pending-syncs";

  async enqueue(tag: string, payload: unknown): Promise<void> {
    const item: SyncItem = {
      id: crypto.randomUUID(),
      tag,
      payload,
      createdAt: Date.now(),
      retryCount: 0,
      maxRetries: 5,
    };

    const db = await this.openDB();
    await db.put(this.storeName, item);

    // Register background sync
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register(tag);
    } else {
      // Fallback: try immediately
      this.processItem(item);
    }
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore(this.storeName, { keyPath: "id" });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  private async processItem(item: SyncItem): Promise<void> {
    const delay = exponentialBackoff(item.retryCount);

    try {
      await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.payload),
      });
      await this.removeItem(item.id);
    } catch (err) {
      if (item.retryCount < item.maxRetries) {
        await this.updateRetryCount(item.id, item.retryCount + 1);
        setTimeout(() => this.processItem({ ...item, retryCount: item.retryCount + 1 }), delay);
      } else {
        console.error(`[SyncQueue] Max retries reached for ${item.id}`, err);
        await this.moveToDeadLetter(item);
      }
    }
  }
}

// Exponential backoff: 1s, 2s, 4s, 8s, 16s
function exponentialBackoff(retryCount: number, baseMs = 1000): number {
  return Math.min(baseMs * Math.pow(2, retryCount), 30_000);
}
```

### Service Worker Sync Handler

```typescript
// sw.ts — background sync event
self.addEventListener("sync", (event: SyncEvent) => {
  if (event.tag === "cart-update") {
    event.waitUntil(processPendingCartUpdates());
  }
  if (event.tag === "analytics-flush") {
    event.waitUntil(flushAnalyticsQueue());
  }
});

async function processPendingCartUpdates(): Promise<void> {
  const db = await openSyncDB();
  const pendingItems = await db.getAll("pending-syncs", "cart-update");

  for (const item of pendingItems) {
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.payload),
      });

      if (res.ok) {
        await db.delete("pending-syncs", item.id);
      } else if (res.status === 409) {
        // Conflict: server state differs — resolve
        await handleConflict(item);
      }
    } catch {
      // Re-throw to tell browser sync failed — it will retry
      throw new Error("Cart sync failed");
    }
  }
}
```

### Conflict Handling Strategy

```typescript
// conflict-resolver.ts
type ConflictResolution = "server-wins" | "client-wins" | "merge";

interface ConflictContext<T> {
  localVersion: T;
  serverVersion: T;
  localTimestamp: number;
  serverTimestamp: number;
}

function resolveCartConflict(ctx: ConflictContext<CartState>): CartState {
  // Last-writer-wins (simple)
  if (ctx.localTimestamp > ctx.serverTimestamp) {
    return ctx.localVersion; // client-wins
  }
  return ctx.serverVersion; // server-wins

  // OR: merge strategy — union of items
  // return mergeCartItems(ctx.localVersion.items, ctx.serverVersion.items);
}
```

---

## Topic 10: Edge Rendering 🔴

### What is Edge Rendering? / Edge Rendering Là Gì?

**EN**: Edge rendering executes JavaScript at CDN nodes closest to the user — NOT at a central
origin server. This reduces TTFB (Time to First Byte) from ~200ms (cross-continental) to ~20ms
(local PoP).

**VI**: Edge rendering chạy JavaScript tại các node CDN gần người dùng nhất, giảm TTFB từ ~200ms
(cross-continental) xuống ~20ms.

```
WITHOUT edge rendering:
User (Vietnam) ──────────────────────────────► Origin (US East)
                         ~200ms RTT                  ▼ renders HTML
User (Vietnam) ◄───────────────────────────── HTML response

WITH edge rendering:
User (Vietnam) ──────────────► Edge Node (Singapore)
                   ~20ms RTT         ▼ renders HTML at edge
User (Vietnam) ◄────────────── HTML response (personalised!)
```

### Cloudflare Workers Example

```typescript
// workers/product-page.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const productId = url.pathname.split("/")[2]; // /products/[id]

    // 1. Attempt cache lookup at edge
    const cacheKey = new Request(url.toString(), request);
    const cache = caches.default;
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    // 2. Fetch product data (KV or origin)
    const product = await env.PRODUCTS_KV.get<Product>(productId, "json");
    if (!product) {
      return new Response("Not Found", { status: 404 });
    }

    // 3. Render HTML at edge (no framework needed, or use Hono)
    const html = renderProductHTML(product);
    const response = new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
        Vary: "Accept-Language", // personalisation signals
      },
    });

    // 4. Store in edge cache
    await cache.put(cacheKey, response.clone());
    return response;
  },
};

function renderProductHTML(product: Product): string {
  return `<!DOCTYPE html>
<html>
<head>
  <title>${product.name} - Shop</title>
  <meta name="description" content="${product.description.slice(0, 160)}">
</head>
<body>
  <h1>${product.name}</h1>
  <p class="price">$${product.price}</p>
  <!-- hydration point for React -->
  <div id="root" data-product-id="${product.id}"></div>
  <script src="/static/js/main.js" defer></script>
</body>
</html>`;
}
```

### Vercel Edge Functions

```typescript
// app/products/[id]/page.tsx — Next.js Edge Runtime
export const runtime = 'edge'; // opt into edge rendering

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  // Runs at edge — no Node.js APIs (no fs, no crypto)
  const product = await fetch(`https://api.company.com/products/${params.id}`, {
    next: { revalidate: 300 }, // ISR: regenerate every 5 min
  }).then(r => r.json());

  return (
    <main>
      <h1>{product.name}</h1>
      <ProductGallery images={product.images} />
      <AddToCartButton productId={product.id} />
    </main>
  );
}
```

### Edge Limitations / Hạn Chế

```
WHAT WORKS AT EDGE          WHAT DOESN'T WORK AT EDGE
────────────────────────    ──────────────────────────────
fetch() API                 Node.js built-ins (fs, path, crypto)
Web Crypto API              Long-running processes (>50ms CPU)
KV / R2 / D1 (Cloudflare)  Large npm packages (e.g., Prisma)
Request/Response Web APIs   WebSockets (limited support)
Geolocation from headers    Stateful connections to DBs
URL / Headers / Cookies     Most ORM libraries
```

### Interview Q&A

**Q (🔴)**: "When would you NOT use edge rendering, even if the performance improvement seems
significant?"

**Expected answer**:

> "Three situations: (1) Pages with heavy personalisation that require database calls not available
> at edge — a social feed with 200 JOIN queries won't benefit from edge rendering and might perform
> WORSE due to the latency of edge-to-origin calls. (2) Pages that need Node.js-specific APIs like
> file system or legacy npm packages. (3) Very low-traffic pages where the operational complexity
> of edge functions outweighs the TTFB benefit — a startup's admin dashboard doesn't need edge
> rendering."

---

## Topic 11: Multi-CDN Failover 🔴

### Active-Active vs Active-Passive

```
ACTIVE-PASSIVE (Cold Standby)
─────────────────────────────────────────────────────────────────────
Normal:   All traffic → CDN A (primary)
Failure:  DNS TTL expires → traffic shifts to CDN B (backup, cold)
          Failover time: DNS TTL (60s–300s)
          Cost: Pay for CDN B standby capacity
          Risk: Cold cache = origin stampede on failover

ACTIVE-ACTIVE (Hot Standby)
─────────────────────────────────────────────────────────────────────
Normal:   Traffic split 80/20 → CDN A & CDN B simultaneously
Failure:  DNS or anycast removes CDN A → CDN B handles 100%
          Failover time: ~5s (anycast rerouting)
          Cost: Double CDN fees, complex cache invalidation
          Benefit: CDN B cache is WARM — no origin stampede
```

### DNS-Based Failover

```typescript
// Route53 health check config (Infrastructure as Code)
const healthCheck = {
  Type: "AWS::Route53::HealthCheck",
  Properties: {
    HealthCheckConfig: {
      IPAddress: CDN_A_IP,
      Port: 443,
      Type: "HTTPS",
      ResourcePath: "/health",
      FailureThreshold: 3, // fail after 3 consecutive checks
      RequestInterval: 10, // check every 10 seconds
    },
  },
};

// Weighted routing with health checks
const dnsPrimary = {
  SetIdentifier: "cdn-a-primary",
  Weight: 100,
  HealthCheckId: healthCheck.ref,
  AliasTarget: { DNSName: "cdn-a.example.com" },
};

const dnsFailover = {
  SetIdentifier: "cdn-b-failover",
  Weight: 0, // gets traffic only when primary is unhealthy
  AliasTarget: { DNSName: "cdn-b.example.com" },
};
```

### Application-Level Failover

```typescript
// cdn-fetcher.ts — application-controlled CDN selection
const CDN_ENDPOINTS = [
  { name: "cloudflare", url: "https://cf.cdn.company.com", priority: 1 },
  { name: "fastly", url: "https://fl.cdn.company.com", priority: 2 },
  { name: "origin", url: "https://origin.company.com", priority: 3 },
];

class CDNFetcher {
  private healthStatus = new Map<string, boolean>(CDN_ENDPOINTS.map((e) => [e.name, true]));

  async fetch(path: string): Promise<Response> {
    const endpoints = CDN_ENDPOINTS.filter((e) => this.healthStatus.get(e.name)).sort(
      (a, b) => a.priority - b.priority,
    );

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${endpoint.url}${path}`, {
          signal: AbortSignal.timeout(3000),
        });

        if (response.ok) return response;

        // Mark unhealthy on server errors
        if (response.status >= 500) {
          this.markUnhealthy(endpoint.name);
        }
      } catch {
        this.markUnhealthy(endpoint.name);
      }
    }

    throw new Error("All CDN endpoints failed");
  }

  private markUnhealthy(name: string) {
    this.healthStatus.set(name, false);
    // Recover after 30 seconds
    setTimeout(() => this.healthStatus.set(name, true), 30_000);
    console.warn(`[CDN] ${name} marked unhealthy`);
  }
}

export const cdnFetcher = new CDNFetcher();
```

### Cache Invalidation Across CDNs

```typescript
// invalidation-service.ts — purge across multiple CDNs atomically
async function purgeAcrossCDNs(paths: string[]): Promise<void> {
  const results = await Promise.allSettled([cloudflare.purge(paths), fastly.purge(paths)]);

  const failures = results.filter((r) => r.status === "rejected");
  if (failures.length > 0) {
    console.error("[CDN] Partial purge failure:", failures);
    // Queue for retry — stale content is better than crash
    invalidationRetryQueue.add(paths);
  }
}
```

---

## Topic 12: Asset Governance 🔴

### Bundle Size Budgets

```typescript
// size-budget.config.ts
export const BUNDLE_BUDGETS = {
  // Per MFE budgets
  "checkout-mfe": {
    totalJs: 250_000, // 250 KB gzipped
    totalCss: 30_000, // 30 KB
    initialJs: 150_000, // 150 KB (above-the-fold)
  },
  "catalog-mfe": {
    totalJs: 300_000,
    totalCss: 40_000,
    initialJs: 180_000,
  },
  // Shared chunks — counted against shell
  "design-system": {
    totalJs: 100_000,
  },
};

// CI enforcement script
// scripts/size-check.ts
import { statSync } from "fs";
import { gzipSync } from "zlib";
import { readFileSync } from "fs";

interface BudgetResult {
  file: string;
  actualBytes: number;
  budgetBytes: number;
  passed: boolean;
}

function checkBudget(distDir: string, budget: number): BudgetResult[] {
  const jsFiles = glob.sync(`${distDir}/**/*.js`);
  const results: BudgetResult[] = [];

  for (const file of jsFiles) {
    const content = readFileSync(file);
    const gzipped = gzipSync(content);
    results.push({
      file: path.relative(distDir, file),
      actualBytes: gzipped.length,
      budgetBytes: budget,
      passed: gzipped.length <= budget,
    });
  }

  return results;
}
```

### Dependency Version Governance

```typescript
// scripts/dep-audit.ts — run in CI on every PR
import { execSync } from "child_process";

interface DepAuditResult {
  package: string;
  versions: Record<string, string[]>; // version → [apps using it]
  hasConflict: boolean;
}

function auditSharedDeps(monorepoRoot: string): DepAuditResult[] {
  const apps = getWorkspaceApps(monorepoRoot);
  const depVersionMap = new Map<string, Map<string, string[]>>();

  for (const app of apps) {
    const pkg = require(`${app}/package.json`);
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    for (const [name, version] of Object.entries(allDeps)) {
      if (!depVersionMap.has(name)) depVersionMap.set(name, new Map());
      const versionMap = depVersionMap.get(name)!;
      const existing = versionMap.get(version as string) ?? [];
      versionMap.set(version as string, [...existing, app]);
    }
  }

  return Array.from(depVersionMap.entries())
    .filter(([, versions]) => versions.size > 1) // only show conflicts
    .map(([pkg, versions]) => ({
      package: pkg,
      versions: Object.fromEntries(versions),
      hasConflict: versions.size > 1,
    }));
}

// Output example:
// react: { "^18.2.0": ["shell", "catalog"], "^17.0.2": ["legacy-mfe"] }
// ❌ CONFLICT: react has 2 different versions across MFEs
```

---

## Topic 13: Operational Transformation (OT) 🔴

### Concept / Khái Niệm

**EN**: OT is the algorithm that powers real-time collaborative editing (Google Docs). When two
users edit the same document simultaneously, their operations must be _transformed_ against each
other to maintain consistency.

**VI**: OT là thuật toán đứng sau Google Docs. Khi hai user cùng chỉnh sửa đồng thời, các
operations phải được _transform_ để đảm bảo tính nhất quán.

```
Initial state: "Hello"

User A (local):  Insert("!", pos=5) → "Hello!"
User B (local):  Insert("?", pos=5) → "Hello?"

WITHOUT OT (naive merge):
  Apply A's op first: "Hello!"
  Apply B's op at pos=5: "Hello!?" ✓

  Apply B's op first: "Hello?"
  Apply A's op at pos=5: "Hello?!" ✓ (different result!)
  → Non-deterministic!

WITH OT:
  Server receives A's op (Insert "!", pos=5) first
  Server receives B's op (Insert "?", pos=5) next

  Transform B against A: B' = transform(B, A) = Insert("?", pos=6)
  Apply A then B': "Hello!" → "Hello!?"

  Transform A against B: A' = transform(A, B) = Insert("!", pos=6)
  Apply B then A': "Hello?" → "Hello?!" (same! ✓)
```

### Transform Function Implementation

```typescript
// ot-operations.ts
type Operation =
  | { type: "insert"; pos: number; text: string }
  | { type: "delete"; pos: number; length: number };

/**
 * Transform operation B so it can be applied after operation A
 * and produce the same result regardless of order.
 */
function transform(opB: Operation, opA: Operation): Operation {
  if (opA.type === "insert" && opB.type === "insert") {
    // A inserts before B's position → shift B right
    if (opA.pos <= opB.pos) {
      return { ...opB, pos: opB.pos + opA.text.length };
    }
    return opB;
  }

  if (opA.type === "delete" && opB.type === "insert") {
    // A deleted text before B's position → shift B left
    if (opA.pos < opB.pos) {
      return {
        ...opB,
        pos: Math.max(opB.pos - opA.length, opA.pos),
      };
    }
    return opB;
  }

  if (opA.type === "insert" && opB.type === "delete") {
    // A inserted before B's delete range → shift B right
    if (opA.pos <= opB.pos) {
      return { ...opB, pos: opB.pos + opA.text.length };
    }
    return opB;
  }

  if (opA.type === "delete" && opB.type === "delete") {
    // Both delete overlapping ranges — complex case
    if (opA.pos + opA.length <= opB.pos) {
      // A is completely before B
      return { ...opB, pos: opB.pos - opA.length };
    }
    if (opB.pos + opB.length <= opA.pos) {
      // B is completely before A — no change needed
      return opB;
    }
    // Overlapping deletes — B's remaining range shrinks
    const overlapStart = Math.max(opA.pos, opB.pos);
    const overlapEnd = Math.min(opA.pos + opA.length, opB.pos + opB.length);
    const overlap = overlapEnd - overlapStart;
    return { ...opB, pos: Math.min(opB.pos, opA.pos), length: opB.length - overlap };
  }

  return opB;
}

// Apply operation to document string
function applyOp(doc: string, op: Operation): string {
  if (op.type === "insert") {
    return doc.slice(0, op.pos) + op.text + doc.slice(op.pos);
  }
  return doc.slice(0, op.pos) + doc.slice(op.pos + op.length);
}
```

### Interview Q&A

**Q (🔴)**: "What is the main limitation of OT and why did CRDTs emerge as an alternative?"

**Expected answer**:

> "OT requires a **central server** to serialise operations. When two clients A and B send
> operations, the server picks an order, transforms B against A (or vice versa), and broadcasts
> the canonical result. This creates a centralisation bottleneck — offline-first apps can't use
> pure OT without a server to transform against. CRDTs avoid this by designing data structures
> where all valid states can be merged without a central arbiter. The downside is CRDTs can produce
> semantically odd merges (e.g., two users both deleting the same sentence, but the merge keeps
> the sentence because both edits survive). OT is better for text editing, CRDTs are better for
> JSON/key-value state and offline sync."

---

## Topic 14: CRDTs for Frontend 🔴

### What is a CRDT? / CRDT Là Gì?

**EN**: Conflict-free Replicated Data Types are data structures that can be merged from any number
of replicas without conflict. The merge operation is: commutative, associative, and idempotent.
This means order doesn't matter, and applying the same update twice has the same effect as once.

**VI**: CRDT là cấu trúc dữ liệu có thể được merge từ nhiều replica mà không có xung đột.

### G-Counter (Grow-Only Counter)

```typescript
// g-counter.ts — each node can only increment, never decrement
class GCounter {
  private counts: Record<string, number>;

  constructor(private nodeId: string) {
    this.counts = { [nodeId]: 0 };
  }

  increment(amount = 1): void {
    this.counts[this.nodeId] = (this.counts[this.nodeId] ?? 0) + amount;
  }

  value(): number {
    return Object.values(this.counts).reduce((sum, n) => sum + n, 0);
  }

  // Merge: take the max for each node's count
  merge(other: GCounter): GCounter {
    const result = new GCounter(this.nodeId);
    const allNodes = new Set([...Object.keys(this.counts), ...Object.keys(other.counts)]);

    for (const node of allNodes) {
      result.counts[node] = Math.max(this.counts[node] ?? 0, other.counts[node] ?? 0);
    }
    return result;
  }
}

// Usage: distributed like-counter across multiple frontend instances
const likes = new GCounter("user-session-abc");
likes.increment(); // user liked
likes.increment(); // user double-tapped
console.log(likes.value()); // 2

// Sync with server replica:
const serverLikes = fetchServerLikes(); // another GCounter
const merged = likes.merge(serverLikes);
// merge is always safe — no conflict possible
```

### LWW-Register (Last-Write-Wins Register)

```typescript
// lww-register.ts — simplest CRDT for scalar values
interface LWWEntry<T> {
  value: T;
  timestamp: number; // lamport clock or wall clock
  nodeId: string;
}

class LWWRegister<T> {
  private entry: LWWEntry<T> | null = null;

  set(value: T, nodeId: string): void {
    const timestamp = Date.now();
    if (!this.entry || timestamp > this.entry.timestamp) {
      this.entry = { value, timestamp, nodeId };
    }
  }

  get(): T | null {
    return this.entry?.value ?? null;
  }

  merge(other: LWWRegister<T>): LWWRegister<T> {
    const result = new LWWRegister<T>();
    if (!this.entry) {
      result.entry = other.entry;
      return result;
    }
    if (!other.entry) {
      result.entry = this.entry;
      return result;
    }

    // Higher timestamp wins; tie-break by nodeId for determinism
    if (
      this.entry.timestamp > other.entry.timestamp ||
      (this.entry.timestamp === other.entry.timestamp && this.entry.nodeId > other.entry.nodeId)
    ) {
      result.entry = this.entry;
    } else {
      result.entry = other.entry;
    }
    return result;
  }
}

// Usage: user's display name (last update wins)
const nameReg = new LWWRegister<string>();
nameReg.set("Alice", "client-1");
```

### G-Set (Grow-Only Set)

```typescript
// g-set.ts — items can only be added, never removed
class GSet<T> {
  private items: Set<string>; // stringified for JSON serialisation

  constructor(items: T[] = []) {
    this.items = new Set(items.map((i) => JSON.stringify(i)));
  }

  add(item: T): void {
    this.items.add(JSON.stringify(item));
  }

  has(item: T): boolean {
    return this.items.has(JSON.stringify(item));
  }

  values(): T[] {
    return Array.from(this.items).map((s) => JSON.parse(s));
  }

  merge(other: GSet<T>): GSet<T> {
    const result = new GSet<T>();
    result.items = new Set([...this.items, ...other.items]);
    return result;
  }
}

// For removable sets, use 2P-Set (two-phase):
// Maintain a GSet for additions + GSet for tombstones (removals)
class TwoPhaseSet<T> {
  private addSet = new GSet<T>();
  private removeSet = new GSet<T>();

  add(item: T) {
    this.addSet.add(item);
  }
  remove(item: T) {
    this.removeSet.add(item);
  }

  has(item: T): boolean {
    return this.addSet.has(item) && !this.removeSet.has(item);
  }

  merge(other: TwoPhaseSet<T>): TwoPhaseSet<T> {
    const result = new TwoPhaseSet<T>();
    result.addSet = this.addSet.merge(other.addSet);
    result.removeSet = this.removeSet.merge(other.removeSet);
    return result;
  }
}
```

### OT vs CRDT Comparison

| Dimension                     | OT                                 | CRDT                         |
| ----------------------------- | ---------------------------------- | ---------------------------- |
| **Central server required**   | ✅ Yes (for transform ordering)    | ❌ No                        |
| **Offline-first**             | ❌ Limited                         | ✅ Native                    |
| **Text editing quality**      | ✅ Excellent (intention preserved) | ⚠️ Complex (Logoot, LSEQ)    |
| **Implementation complexity** | High (transform matrix)            | Medium (per data type)       |
| **Semantic correctness**      | High                               | Medium (LWW can lose intent) |
| **Used by**                   | Google Docs, Etherpad              | Figma, Notion, Git           |

---

## Topic 15: Distributed Tracing for Frontend UI 🔴

### Why Frontend Needs Distributed Tracing

Without tracing, a slow page load is a black box. With OpenTelemetry, you can see:
`user click → React render → fetch /api/products → DB query → CDN cache miss`

### OpenTelemetry in the Browser

```typescript
// otel-setup.ts
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { XMLHttpRequestInstrumentation } from "@opentelemetry/instrumentation-xml-http-request";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";

const provider = new WebTracerProvider({
  resource: {
    attributes: {
      "service.name": "checkout-mfe",
      "service.version": "2.4.1",
      "deployment.env": process.env.NODE_ENV,
    },
  },
});

provider.addSpanProcessor(
  new BatchSpanProcessor(
    new OTLPTraceExporter({
      url: "https://otel-collector.company.com/v1/traces",
      headers: { "X-Service-Token": getServiceToken() },
    }),
    {
      maxQueueSize: 100,
      maxExportBatchSize: 10,
      scheduledDelayMillis: 500,
    },
  ),
);

provider.register({
  contextManager: new ZoneContextManager(),
});

registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation({
      propagateTraceHeaderCorsUrls: [/https:\/\/api\.company\.com/],
    }),
    new XMLHttpRequestInstrumentation(),
    new DocumentLoadInstrumentation(),
  ],
});

export const tracer = provider.getTracer("checkout-mfe");
```

### Manual Span Creation

```typescript
// checkout-service.ts
import { tracer } from "./otel-setup";
import { SpanStatusCode } from "@opentelemetry/api";

export async function submitOrder(order: OrderPayload): Promise<OrderResult> {
  return tracer.startActiveSpan("checkout.submitOrder", async (span) => {
    span.setAttributes({
      "order.itemCount": order.items.length,
      "order.totalValue": order.total,
      "order.currency": order.currency,
    });

    try {
      // Child spans are automatically linked to parent
      const payment = await processPayment(order);
      const result = await confirmOrder(order, payment);

      span.setStatus({ code: SpanStatusCode.OK });
      span.setAttribute("order.id", result.orderId);

      return result;
    } catch (err) {
      span.recordException(err as Error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: (err as Error).message });
      throw err;
    } finally {
      span.end();
    }
  });
}
```

### Trace Context Propagation Across MFEs

```typescript
// trace-context-bridge.ts — propagate trace context across MFE boundaries
import { context, propagation, trace } from "@opentelemetry/api";

// MFE A: inject trace context into cross-MFE message
function sendToCheckoutMFE(payload: unknown) {
  const carrier: Record<string, string> = {};
  propagation.inject(context.active(), carrier);

  window.dispatchEvent(
    new CustomEvent("checkout:start", {
      detail: { payload, traceContext: carrier },
    }),
  );
}

// Checkout MFE: extract and restore trace context
window.addEventListener("checkout:start", (e: CustomEvent) => {
  const { payload, traceContext } = e.detail;

  // Restore parent context
  const parentContext = propagation.extract(context.active(), traceContext);

  context.with(parentContext, () => {
    tracer.startActiveSpan("checkout.mfe.load", (span) => {
      // This span is now linked to the original trace from MFE A
      initCheckout(payload);
      span.end();
    });
  });
});
```

### Correlation ID Pattern

```typescript
// correlation.ts — simple correlation without full OTEL setup
const CORRELATION_HEADER = "X-Correlation-ID";

// Generate at app entry point
const correlationId = crypto.randomUUID();
sessionStorage.setItem("correlationId", correlationId);

// Inject into all fetch calls
const originalFetch = window.fetch;
window.fetch = async (input, init = {}) => {
  const headers = new Headers(init.headers);
  headers.set(CORRELATION_HEADER, sessionStorage.getItem("correlationId")!);
  headers.set("X-Session-ID", sessionStorage.getItem("sessionId")!);
  return originalFetch(input, { ...init, headers });
};

// Log errors with correlation ID for cross-system debugging
window.addEventListener("error", (event) => {
  logService.error({
    message: event.message,
    correlationId: sessionStorage.getItem("correlationId"),
    url: window.location.href,
    stack: event.error?.stack,
  });
});
```

---

## Topic 16: Failure Isolation 🔴

### Error Boundaries Per MFE

```tsx
// mfe-error-boundary.tsx — isolation boundary for each remote MFE
import React, { Component, ErrorInfo } from "react";

interface Props {
  mfeName: string;
  fallback?: React.ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class MFEErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const { mfeName, onError } = this.props;
    console.error(`[MFE Error Boundary] ${mfeName} crashed:`, error);

    // Report to monitoring — don't let the MFE's error go unreported
    reportToSentry(error, {
      tags: { mfe: mfeName },
      extra: { componentStack: info.componentStack },
    });

    onError?.(error, info);
  }

  handleRetry = () => this.setState({ hasError: false, error: null });

  render() {
    const { hasError, error } = this.state;
    const { mfeName, fallback, children } = this.props;

    if (hasError) {
      return (
        fallback ?? (
          <div role="alert" className="mfe-error-fallback">
            <p>{mfeName} is temporarily unavailable.</p>
            <button onClick={this.handleRetry}>Retry</button>
            {process.env.NODE_ENV === "development" && <pre>{error?.message}</pre>}
          </div>
        )
      );
    }

    return children;
  }
}

// Usage in Shell app
<MFEErrorBoundary mfeName="checkout" fallback={<CheckoutUnavailablePage />}>
  <Suspense fallback={<LoadingSkeleton />}>
    <CheckoutPage />
  </Suspense>
</MFEErrorBoundary>;
```

### Circuit Breaker for Remote Loading

```typescript
// circuit-breaker.ts
type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

interface CircuitBreakerConfig {
  failureThreshold: number; // failures before opening
  successThreshold: number; // successes to close from half-open
  timeout: number; // ms to wait before trying half-open
}

class CircuitBreaker {
  private state: CircuitState = "CLOSED";
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;

  constructor(
    private name: string,
    private config: CircuitBreakerConfig = {
      failureThreshold: 3,
      successThreshold: 2,
      timeout: 10_000,
    },
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime >= this.config.timeout) {
        this.state = "HALF_OPEN";
        console.log(`[CircuitBreaker] ${this.name}: HALF_OPEN — attempting probe`);
      } else {
        throw new CircuitOpenError(`Circuit ${this.name} is OPEN`);
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    if (this.state === "HALF_OPEN") {
      this.successCount++;
      if (this.successCount >= this.config.successThreshold) {
        this.state = "CLOSED";
        this.successCount = 0;
        console.log(`[CircuitBreaker] ${this.name}: CLOSED — recovered`);
      }
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.config.failureThreshold) {
      this.state = "OPEN";
      console.error(`[CircuitBreaker] ${this.name}: OPEN after ${this.failureCount} failures`);
    }
  }

  getState(): CircuitState {
    return this.state;
  }
}

class CircuitOpenError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "CircuitOpenError";
  }
}

// Usage: protect remote MFE loading
const checkoutCircuit = new CircuitBreaker("checkout-mfe");

async function loadCheckoutMFE(): Promise<React.ComponentType> {
  try {
    return await checkoutCircuit.execute(() =>
      loadRemoteModule<{ default: React.ComponentType }>("checkout", "./CheckoutPage").then(
        (m) => m.default,
      ),
    );
  } catch (err) {
    if (err instanceof CircuitOpenError) {
      console.warn("[Shell] Checkout circuit open — showing fallback");
    }
    return CheckoutFallbackPage;
  }
}
```

### Graceful Degradation Strategy

```tsx
// graceful-degradation.tsx — layered fallback hierarchy
function CheckoutSection({ userId }: { userId: string }) {
  const [remoteFailed, setRemoteFailed] = useState(false);
  const [networkFailed, setNetworkFailed] = useState(false);

  // Level 1: Try full remote MFE
  if (!remoteFailed) {
    return (
      <MFEErrorBoundary mfeName="checkout" onError={() => setRemoteFailed(true)}>
        <Suspense fallback={<CheckoutSkeleton />}>
          <RemoteCheckout userId={userId} />
        </Suspense>
      </MFEErrorBoundary>
    );
  }

  // Level 2: Fall back to local embedded checkout (bundled in shell)
  if (!networkFailed) {
    return (
      <ErrorBoundary onError={() => setNetworkFailed(true)}>
        <LocalCheckoutForm userId={userId} />
      </ErrorBoundary>
    );
  }

  // Level 3: Static fallback — no JS required
  return (
    <div role="alert">
      <p>Checkout is temporarily unavailable.</p>
      <a href="tel:+1-800-COMPANY">Call us to place your order</a>
    </div>
  );
}
```

### Interview Q&A

**Q (🔴)**: "Design the error isolation strategy for a shell app with 5 micro-frontends. One
remote MFE goes down. What should happen?"

**Expected answer**:

> "Defense in depth across three layers:
>
> 1. **Circuit Breaker on load**: If the remote's remoteEntry.js fails to fetch 3 times in 10s,
>    open the circuit. Show a static fallback immediately without retrying.
> 2. **Error Boundary on render**: Even if the JS loads but throws during render, the Error
>    Boundary catches it, reports to Sentry, and shows a feature-specific fallback UI.
> 3. **Graceful degradation**: The fallback should be functional, not just an error message. For
>    checkout, redirect to a server-rendered fallback page. For a recommendations widget, simply
>    hide it — the user can still purchase without it.
>    The shell must NEVER crash because one remote MFE is down. Failure of one vertical should be
>    completely invisible to users of other verticals."

---

## Real-World Case Studies / Nghiên Cứu Thực Tế

### Case Study 1: Zalando's Project Mosaic (MFE Pioneer)

```
Architecture:
  - 200+ micro-frontends owned by separate squads
  - Each MFE served from its own CDN endpoint
  - Tailor (Node.js server) composes MFE fragments server-side
  - Layout service stitches fragments into one HTML response

Lessons learned:
  ✅ Team autonomy → 100+ independent deploys per day
  ✅ Fragment-level caching → 70% CDN hit rate
  ❌ Coordination cost → 40-page "fragment contract" required
  ❌ First-load performance → multiple HTTP requests for fragments
```

### Case Study 2: Shopify's Module Federation Migration

```
Before (2020):  Monolith React app, single release train, 300+ engineers blocked each other
After  (2022):  Module Federation, 15+ remote apps, independent deploy pipelines

Key decisions:
  1. Shared "polaris" design system via MF singleton
  2. Strict version contract: major version bump = deprecation notice
  3. Feature flags to gradually roll out each remote
  4. Canary deploys: 1% → 10% → 100% traffic shift per remote

Metrics:
  Deploy frequency: 2/week → 50+/week (per team)
  MTTR on incidents: 4 hours → 25 minutes (localised to one remote)
  Bundle size: +15% (dedupe overhead) but initial load -30% (code splitting)
```

### Case Study 3: Google Docs OT Under the Hood

```
Architecture:
  Client A ──── WebSocket ──── Transform Server ──── Client B
                               │
                               ├── Op log (append-only)
                               └── Document snapshot (checkpoint every 1000 ops)

Invariant: Server ALWAYS applies ops in the order they arrive.
           Server broadcasts transformed op to ALL other clients.

Performance:
  - Ops are batched (50ms window) before sending to reduce round trips
  - Client can continue typing without waiting for server acknowledgement
  - Client undoes locally applied ops if server reorders them (rebasing)

Failure mode:
  If WebSocket disconnects:
  - Client queues ops in localStorage
  - On reconnect, sends queued ops with last-known server version
  - Server replays all ops since that version and sends diff
```

---

## Memory Hooks / Gợi Nhớ Nhanh

```
MFE BOUNDARIES    →  "Conway's Law: your org chart IS your architecture"
INTEGRATION       →  "iframes for security, MF for performance, WC for portability"
SHARED STATE      →  "Events fire-and-forget, Singleton for UI state, URL for navigation"
MODULE FEDERATION →  "singleton + eager on host = one React to rule them all"
DYNAMIC LOADING   →  "Script inject → init container → get module (3-step Webpack dance)"
SERVICE WORKER    →  "Install (cache) → Activate (cleanup) → Fetch (intercept)"
CACHING           →  "API = Network-First; Assets = Cache-First; Catalog = SWR"
BACKGROUND SYNC   →  "Queue → Register sync tag → SW processes when online"
EDGE RENDERING    →  "CDN PoP runs your JS; no Node APIs; sub-20ms TTFB"
MULTI-CDN         →  "Active-Active = warm cache; DNS TTL is your failover SLA"
ASSET GOVERNANCE  →  "Bundle budget in CI = weight limit on the deploy conveyor belt"
OT                →  "Transform(B, A) = B adjusted to apply AFTER A"
CRDT              →  "G-Counter never decreases; LWW timestamp wins; G-Set never shrinks"
OT vs CRDT        →  "OT needs a server; CRDT needs smart data structures"
OTEL FRONTEND     →  "tracer.startActiveSpan → set attributes → recordException → end()"
CIRCUIT BREAKER   →  "CLOSED → OPEN (fail threshold) → HALF_OPEN (timeout) → CLOSED"
```

---

## Self-Check / Tự Kiểm Tra

Answer these before your interview. Aim for ≤90-second verbal responses:

### Micro-Frontend Architecture

- [ ] 🔴 Explain Conway's Law and give a real example of a boundary driven by org structure
- [ ] 🔴 Walk through the trade-offs: Module Federation vs Single-SPA for a 5-team org
- [ ] 🔴 A remote MFE is slow to load. How do you diagnose and fix the user experience?

### Module Federation

- [ ] 🔴 What causes "Multiple React instances" and how do you detect and fix it?
- [ ] 🔴 What is the `eager` flag and when does it cause a runtime error?
- [ ] 🔴 How would you implement a multi-version rollout of a remote MFE?

### Service Workers & Caching

- [ ] 🟡 Describe the full SW lifecycle from registration to redundancy
- [ ] 🟡 When does `skipWaiting()` cause bugs and how do you handle it safely?
- [ ] 🔴 Design a caching strategy for an e-commerce app with: product pages, cart API, CDN images

### Edge & Infrastructure

- [ ] 🔴 What are the limitations of edge rendering and when would you NOT use it?
- [ ] 🔴 Compare active-active vs active-passive multi-CDN. What's the cache cold-start problem?
- [ ] 🔴 How do you enforce bundle size budgets across 10+ MFEs in CI?

### Real-Time & Collaboration

- [ ] 🔴 Explain why OT needs a central server but CRDTs don't
- [ ] 🔴 Implement a transform function for two concurrent insert operations
- [ ] 🔴 When would you choose a G-Counter over a LWW-Register?

### Observability & Resilience

- [ ] 🔴 How do you propagate an OpenTelemetry trace context across two MFEs?
- [ ] 🔴 Design the error isolation strategy for a shell app where one of five MFEs goes down
- [ ] 🔴 Explain the circuit breaker state machine: what triggers each transition?

---

## Interview Signals / Tín Hiệu Interview

**🟢 Junior pass**: Can name the integration patterns (MF, Single-SPA, iframes, WC) and their
basic trade-offs. Knows what a Service Worker does.

**🟡 Mid pass**: Can explain Module Federation shared/singleton config, implement a basic event
bus, configure Workbox caching strategies. Understands circuit breaker pattern.

**🔴 Senior pass**: Can design MFE boundaries from Conway's Law first principles. Can reason about
version negotiation, distributed tracing across MFEs, CRDT vs OT trade-offs. Has debugged real MFE
production issues (duplicate React, stale cache, circuit breaker storms).

**🔴 Staff/Principal signal**: Discusses governance (asset budgets, CI enforcement, contract
versioning). Brings up organisational and process aspects, not just technical patterns. Can design
the full observability stack for distributed frontend: OTEL spans, correlation IDs, error budgets.
