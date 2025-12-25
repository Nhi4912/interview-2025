# 🏛️ MODULE 4: WEB ARCHITECTURE THEORY

> **Focus**: 90% Theory - 10% Diagrams
>
> _Hiểu cách thiết kế hệ thống Frontend scale_
>
> **Phương pháp**: WHAT → WHY → HOW → WHEN

---

## 📋 Trong Module Này

1. [Lịch Sử Web Architecture](#1-lịch-sử-web-architecture)
2. [SPA vs MPA vs Hybrid](#2-spa-vs-mpa-vs-hybrid)
3. [Rendering Strategies Deep Dive](#3-rendering-strategies-deep-dive)
4. [Software Architecture Principles](#4-software-architecture-principles)
5. [Micro-frontends Philosophy](#5-micro-frontends-philosophy)
6. [API Design Theory](#6-api-design-theory)
7. [Caching Strategies](#7-caching-strategies)
8. [Architecture Decision Framework](#8-architecture-decision-framework)

---

## 1. Lịch Sử Web Architecture

### 📜 Timeline Phát Triển

```mermaid
timeline
    title Web Architecture Evolution

    1995 : Static HTML pages
         : Pure MPA (Multi-Page)
         : CGI scripts for dynamic

    2000 : Server-side scripting
         : PHP, ASP, JSP
         : Database-driven sites

    2005 : AJAX revolution
         : Partial page updates
         : Web 2.0 begins

    2010 : Rise of SPA
         : Angular, Backbone
         : Client-side routing

    2013 : React Component Model
         : Declarative UI
         : Component-based architecture

    2015 : Universal/Isomorphic JS
         : Server + Client rendering
         : Initial SSR for SEO

    2016 : JAMstack emerges
         : Static + API + Markup
         : CDN-first approach

    2020 : Next.js mainstream
         : Hybrid rendering
         : ISR invented

    2022 : Edge Computing
         : React Server Components
         : Streaming SSR

    2024 : AI-assisted architecture
         : Partial Prerendering
         : Islands Architecture
```

### 💡 WHY - Hiểu lịch sử để làm gì?

| Era      | Problem Solved       | Tradeoff               |
| -------- | -------------------- | ---------------------- |
| **MPA**  | Simple, SEO-friendly | Full page reloads      |
| **AJAX** | Better UX            | Complexity             |
| **SPA**  | App-like experience  | Initial load, SEO      |
| **SSR**  | SEO + fast FCP       | Server load            |
| **SSG**  | Max performance      | Build time, stale data |
| **ISR**  | Fresh + cached       | Complexity             |
| **RSC**  | Zero-JS components   | Learning curve         |

---

## 2. SPA vs MPA vs Hybrid

### ❓ WHAT - Sự khác biệt cốt lõi?

```mermaid
flowchart TB
    subgraph SPA["📱 SPA - Single Page App"]
        S1["One HTML page"]
        S2["JS handles routing"]
        S3["API for data"]
        S4["Examples: Gmail, Figma"]
    end

    subgraph MPA["📄 MPA - Multi Page App"]
        M1["Many HTML pages"]
        M2["Server routing"]
        M3["Full page reloads"]
        M4["Examples: Wikipedia, news"]
    end

    subgraph Hybrid["🔀 Hybrid (Next.js/Remix)"]
        H1["SSR + SPA navigation"]
        H2["Best of both worlds"]
        H3["Per-page strategy"]
        H4["Examples: Vercel, Stripe"]
    end
```

### Comparison Matrix

| Aspect           | SPA                 | MPA                | Hybrid             |
| ---------------- | ------------------- | ------------------ | ------------------ |
| **Initial Load** | Slow (large bundle) | Fast (single page) | Fast (SSR)         |
| **Navigation**   | Instant (no reload) | Slow (full reload) | Instant (prefetch) |
| **SEO**          | Difficult           | Excellent          | Excellent          |
| **Complexity**   | High                | Low                | Medium-High        |
| **Server Cost**  | Low                 | Medium             | Higher             |
| **Best For**     | Dashboards, apps    | Content, blogs     | E-commerce, SaaS   |

### 💡 WHY - Decision Framework

```
┌────────────────────────────────────────────────────────────┐
│  DECISION TREE: Choosing Architecture                      │
│                                                            │
│  ┌── Is SEO critical? ──┐                                  │
│  │                      │                                  │
│  No                    Yes                                 │
│  │                      │                                  │
│  ▼                      ▼                                  │
│  SPA is fine        ┌── Content type? ──┐                  │
│  (dashboards,       │                   │                  │
│   internal apps)    Mostly static    Highly dynamic        │
│                     │                   │                  │
│                     ▼                   ▼                  │
│                    SSG/MPA            SSR/Hybrid           │
│                    (docs,blogs)       (e-commerce)         │
└────────────────────────────────────────────────────────────┘
```

---

## 3. Rendering Strategies Deep Dive

### ❓ WHAT - 5 Rendering Strategies

```mermaid
flowchart LR
    subgraph Strategies["Rendering Spectrum"]
        CSR["🔵 CSR\nClient-Side"]
        SSR["🟢 SSR\nServer-Side"]
        SSG["🟡 SSG\nStatic Generation"]
        ISR["🟠 ISR\nIncremental Static"]
        RSC["🟣 RSC\nServer Components"]
    end
```

### 🔍 HOW - Chi tiết từng Strategy

#### CSR (Client-Side Rendering)

```
Request Flow:
┌────────┐     ┌────────┐     ┌─────────┐
│ Browser│────►│ Server │────►│ Response│
└────────┘     └────────┘     └────┬────┘
                                   │
    ┌──────────────────────────────┘
    ▼
┌─────────────────────────────────────────┐
│ 1. Empty HTML shell                     │
│ 2. Download large JS bundle             │
│ 3. Execute JS, init React               │
│ 4. Fetch data via API                   │
│ 5. Render content                       │
│                                         │
│ Timeline:                               │
│ |--TTFB--||--------FCP--------||--LCP---|│
│   fast        slow (bundle)        slow  │
└─────────────────────────────────────────┘
```

#### SSR (Server-Side Rendering)

```
Request Flow:
┌────────┐     ┌────────────────┐     ┌─────────┐
│ Browser│────►│ Server renders │────►│Full HTML│
└────────┘     │ React to HTML  │     └────┬────┘
               └────────────────┘          │
    ┌──────────────────────────────────────┘
    ▼
┌─────────────────────────────────────────┐
│ 1. Server fetches data                  │
│ 2. Server renders React → HTML          │
│ 3. Send complete HTML                   │
│ 4. Browser shows immediately            │
│ 5. Hydration (add interactivity)        │
│                                         │
│ Timeline:                               │
│ |---TTFB---||--FCP--||--TTI--|          │
│    slower     fast    hydration         │
└─────────────────────────────────────────┘
```

#### SSG vs ISR

```mermaid
flowchart TB
    subgraph SSG["SSG - Static Site Generation"]
        SSG1["Build time: Generate all pages"]
        SSG2["Deploy to CDN"]
        SSG3["Request → CDN cache"]
        SSG4["Stale until rebuild"]
    end

    subgraph ISR["ISR - Incremental Static Regeneration"]
        ISR1["Build time: Generate pages"]
        ISR2["Deploy to CDN"]
        ISR3["Request → Check freshness"]
        ISR4["If stale: serve stale + regenerate"]
        ISR5["Next request → fresh page"]
    end
```

### ⏰ WHEN - Chọn Strategy nào?

| Use Case                   | Strategy     | Reason                     |
| -------------------------- | ------------ | -------------------------- |
| **Blog, Docs**             | SSG          | Content ít đổi, max cache  |
| **E-commerce products**    | ISR (60s)    | SEO + price updates hourly |
| **User dashboard**         | CSR          | Personalized, no SEO       |
| **News feed**              | SSR          | Luôn fresh, SEO critical   |
| **Marketing landing**      | SSG          | Performance + SEO          |
| **Interactive components** | RSC + Client | Zero JS where possible     |

---

## 4. Software Architecture Principles

### ❓ WHAT - Core Principles cho Frontend?

#### SOLID in Frontend Context

```mermaid
flowchart TB
    subgraph SOLID["SOLID Principles"]
        S["S - Single Responsibility\nMỗi component làm 1 việc"]
        O["O - Open/Closed\nMở rộng via props, không sửa code"]
        L["L - Liskov Substitution\nComponents thay thế được"]
        I["I - Interface Segregation\nProps interfaces nhỏ gọn"]
        D["D - Dependency Inversion\nDepend on abstractions"]
    end
```

| Principle                 | Frontend Application                                 |
| ------------------------- | ---------------------------------------------------- |
| **Single Responsibility** | Button component chỉ render button, không fetch data |
| **Open/Closed**           | Component nhận children, không hardcode content      |
| **Interface Segregation** | Split large prop interfaces thành smaller ones       |
| **Dependency Inversion**  | Inject services via Context, không import directly   |

#### Clean Architecture Layers

```mermaid
flowchart TB
    subgraph Layers["Clean Architecture for Frontend"]
        UI["UI Layer\nReact components, CSS"]
        Application["Application Layer\nHooks, State management"]
        Domain["Domain Layer\nBusiness logic, entities"]
        Infrastructure["Infrastructure Layer\nAPI calls, localStorage"]
    end

    UI --> Application --> Domain
    Application --> Infrastructure

    style Domain fill:#90EE90
```

**Dependency Rule**: Outer layers depend on inner layers, never reverse.

---

## 5. Micro-frontends Philosophy

### ❓ WHAT - Micro-frontends là gì?

**Micro-frontends = Áp dụng microservices cho frontend**

```mermaid
flowchart TB
    subgraph Monolith["❌ Monolithic Frontend"]
        All["🔴 One huge codebase\n🔴 One team\n🔴 One deploy\n🔴 Technology lock-in"]
    end

    subgraph MicroFE["✅ Micro-frontends"]
        Shell["App Shell\n(Routing, Auth, Layout)"]

        MFE1["Team A\nProduct Catalog\n(React 18)"]
        MFE2["Team B\nCheckout\n(Vue 3)"]
        MFE3["Team C\nUser Account\n(React 17)"]

        Shell --> MFE1
        Shell --> MFE2
        Shell --> MFE3
    end
```

### 🔍 HOW - Integration Approaches

| Approach              | Mechanism          | Pros              | Cons               |
| --------------------- | ------------------ | ----------------- | ------------------ |
| **Build-time**        | NPM packages       | Type-safe, simple | Must rebuild all   |
| **Server-side**       | SSI, Edge includes | Fast initial      | Complex infra      |
| **Run-time iframe**   | `<iframe>`         | True isolation    | Poor UX, slow      |
| **Module Federation** | Webpack 5          | Best balance      | Bundler complexity |
| **Import maps**       | Native ES modules  | Standard          | Browser support    |

### 💡 WHY - Khi nào cần?

```
┌─────────────────────────────────────────────────────────────┐
│  ✅ GOOD FIT FOR MFE              │  ❌ BAD FIT             │
├───────────────────────────────────┼─────────────────────────┤
│  Large teams (30+ devs)           │  Small teams (<10 devs) │
│  Multiple distinct products       │  Single cohesive product│
│  Independent release cycles       │  Tightly coupled features│
│  Different tech stacks per team   │  Consistent stack       │
│  Autonomous team ownership        │  Centralized decisions  │
│  Acquisition integration          │  Greenfield project     │
└───────────────────────────────────┴─────────────────────────┘

⚠️ COMPLEXITY COST: Micro-frontends add significant overhead.
   Only adopt if organizational scaling benefits outweigh technical costs.
```

---

## 6. API Design Theory

### ❓ WHAT - REST vs GraphQL vs tRPC?

```mermaid
flowchart TB
    subgraph REST["🔵 REST"]
        R1["Resource-based URLs"]
        R2["/users, /posts, /comments"]
        R3["Multiple endpoints"]
        R4["Standard HTTP methods"]
    end

    subgraph GraphQL["🟢 GraphQL"]
        G1["Query language"]
        G2["Single /graphql endpoint"]
        G3["Client requests exact fields"]
        G4["Schema-first development"]
    end

    subgraph tRPC["🟣 tRPC"]
        T1["Type-safe RPC"]
        T2["TypeScript end-to-end"]
        T3["No code generation"]
        T4["Full-stack TypeScript only"]
    end
```

### Richardson Maturity Model (REST)

```mermaid
flowchart TB
    L0["Level 0: HTTP as tunnel\nPOST /api, action in body"]
    L1["Level 1: Resources\n/users, /posts"]
    L2["Level 2: HTTP Verbs\nGET, POST, PUT, DELETE"]
    L3["Level 3: HATEOAS\nHypermedia controls"]

    L0 --> L1 --> L2 --> L3
```

### 💡 WHY - Chọn pattern nào?

| Scenario                   | Best Choice | Reason                            |
| -------------------------- | ----------- | --------------------------------- |
| **Public API**             | REST        | Standard, cacheable, discoverable |
| **Complex data relations** | GraphQL     | One request, no over-fetching     |
| **Full-stack TypeScript**  | tRPC        | Zero-config type safety           |
| **Simple CRUD**            | REST        | No overhead, familiar             |
| **Mobile + Web clients**   | GraphQL     | Each client picks fields          |

---

## 7. Caching Strategies

### ❓ WHAT - Cache Layers

```mermaid
flowchart TB
    subgraph Layers["Cache Hierarchy"]
        Browser["🖥️ Browser Cache\n(HTTP headers, SW)"]
        CDN["🌐 CDN Edge Cache\n(Vercel, Cloudflare)"]
        AppCache["💾 Application Cache\n(TanStack Query, SWR)"]
        Server["🖧 Server Cache\n(Redis, Memcached)"]
        DB["🗄️ Database Cache\n(Query cache, materialized views)"]
    end

    Browser --> CDN --> AppCache --> Server --> DB
```

### 🔍 HOW - Cache-Control Headers

```
Cache-Control Header Values:

max-age=3600           → Cache for 1 hour
s-maxage=86400         → CDN caches for 1 day
no-cache               → Revalidate every time
no-store               → Never cache
stale-while-revalidate → Serve stale, fetch background
private                → Browser only, not CDN
public                 → CDN can cache
```

### Stale-While-Revalidate Pattern

```mermaid
flowchart LR
    subgraph Request1["Request 1"]
        R1_1["Cache: MISS"]
        R1_2["Fetch from origin"]
        R1_3["Store in cache\nExpiry: 60s"]
    end

    subgraph Request2["Request 2 (within 60s)"]
        R2_1["Cache: HIT"]
        R2_2["Return cached data"]
    end

    subgraph Request3["Request 3 (after 60s, stale)"]
        R3_1["Cache: STALE"]
        R3_2["Return stale immediately"]
        R3_3["Background: fetch new"]
        R3_4["Update cache"]
    end
```

### 💡 WHY - Cache Invalidation Strategies

| Strategy           | How                    | Use Case          |
| ------------------ | ---------------------- | ----------------- |
| **TTL**            | Expires after time     | Static assets     |
| **Versioned URLs** | `/v2/app.js` or hash   | JS/CSS bundles    |
| **Tag-based**      | Purge by tag           | CMS content       |
| **Event-driven**   | Webhook invalidation   | Real-time updates |
| **SWR**            | Stale-while-revalidate | API responses     |

---

## 8. Architecture Decision Framework

### System Design Interview Approach

```mermaid
flowchart LR
    C["1️⃣ CLARIFY\nRequirements"]
    S["2️⃣ SKETCH\nHigh-level"]
    D["3️⃣ DETAIL\nComponents"]
    T["4️⃣ TRADEOFFS\nPros/Cons"]
    E["5️⃣ EXTEND\nScale, Edge cases"]

    C --> S --> D --> T --> E
```

### Key Questions Matrix

| Category        | Questions                       |
| --------------- | ------------------------------- |
| **Scale**       | Users? Concurrent? Data volume? |
| **SEO**         | Public pages? Crawlable?        |
| **Performance** | Target LCP? Offline support?    |
| **Team**        | Size? Skills? Existing stack?   |
| **Budget**      | Server costs? CDN needs?        |

### Decision Record Template

```markdown
# ADR-001: Rendering Strategy

## Context

E-commerce site with 10K products, SEO critical

## Decision

Use ISR with 60-second revalidation

## Consequences

- ✅ Fast initial load (cached)
- ✅ Fresh prices (revalidate)
- ⚠️ Possible 60s stale data
```

---

## 📊 Summary - Mental Models

| Concept          | Mental Model                                      |
| ---------------- | ------------------------------------------------- |
| **SPA vs MPA**   | Interactivity vs SEO tradeoff                     |
| **SSR/SSG/ISR**  | Where rendering happens vs freshness              |
| **Micro-FE**     | Team autonomy vs technical complexity             |
| **API Patterns** | REST = resources, GraphQL = queries, tRPC = types |
| **Caching**      | Closer to user = faster, harder to invalidate     |

---

## 🔗 Cross-References

| Topic            | Related Module                                             |
| ---------------- | ---------------------------------------------------------- |
| React rendering  | [Module 3: React Philosophy](./03-react-philosophy.md)     |
| Performance      | [Module 7: Performance](./07-performance-security.md)      |
| Next.js patterns | [Module 6: Framework Patterns](./06-framework-patterns.md) |

---

## 🔗 Navigation

| Prev                                         | Module                     | Next                                           |
| -------------------------------------------- | -------------------------- | ---------------------------------------------- |
| [React Philosophy](./03-react-philosophy.md) | **4. Architecture Theory** | [TypeScript Theory](./05-typescript-theory.md) |

---

> _Tiếp theo: [Module 5: TypeScript Type Theory](./05-typescript-theory.md)_
