# Mock Interview — System Design Round / Vòng System Design Mô Phỏng

> **Track**: FE | **Difficulty**: 🔴 Senior
> **L5 Competencies**: Technical Mastery (20pts), Scope & Impact (15pts), Communication (10pts)
> **See also**: [Architecture Patterns](../08-fe-system-design/01-architecture-patterns.md) | [Observability](../08-fe-system-design/07-frontend-quality-and-observability.md)

---

## How to Use / Cách Dùng

1. Set timer: **45 minutes** per problem
2. Use paper/whiteboard for diagrams (no code needed initially)
3. **Talk through your design** — system design is 70% communication
4. Follow the framework below for every problem
5. Self-evaluate using the rubric at the bottom

---

## System Design Framework — RADIO

```
R — Requirements (5 min)
    Functional: "Users can do X, Y, Z"
    Non-functional: scale, latency, consistency, availability
    Ask: "How many users? Read-heavy or write-heavy? Real-time needed?"

A — Architecture (10 min)
    High-level components: client, API, services, data stores
    Draw diagram: boxes + arrows + data flow
    FE-specific: component tree, state management, data fetching

D — Data Model (5 min)
    API contracts: endpoints, request/response shapes
    Client state: what's cached, what's derived, what's server state
    Real-time: WebSocket events, SSE, polling

I — Interface Design (15 min)
    Component architecture: smart vs presentational
    State management: local, context, server cache (React Query)
    Performance: code splitting, virtualization, lazy loading
    Error handling: boundaries, retry, fallback UI

O — Optimization (10 min)
    Performance: bundle size, render optimization, caching
    Scalability: CDN, SSR/SSG, edge computing
    Monitoring: RUM, error tracking, alerting
    Trade-offs: complexity vs performance vs DX
```

---

## Problem 1: Design a Real-Time Collaborative Document Editor

> "Design the frontend for a Google Docs-like collaborative editor where multiple users can edit simultaneously."

### Phase 1: Requirements (you should ask)

<details>
<summary>🔑 Key Questions & Answers</summary>

- **Users**: Up to 50 simultaneous editors per document
- **Features**: Rich text editing, real-time cursors, comments, version history
- **Latency**: <100ms for local edits, <500ms for remote sync
- **Offline**: Basic offline support (edit, sync when reconnected)
- **Scale**: 10M documents, 500K daily active users

</details>

### Phase 2: Architecture

<details>
<summary>🔑 Expected Architecture</summary>

```
┌──────────────────────────────────────────────────────────┐
│ Client (Browser)                                          │
│ ┌──────────────┐ ┌──────────┐ ┌───────────┐              │
│ │ Editor Engine │ │ CRDT/OT  │ │ Presence  │              │
│ │ (ProseMirror/ │ │ State    │ │ Awareness │              │
│ │  TipTap/Slate)│ │ Manager  │ │ (cursors) │              │
│ └──────┬───────┘ └────┬─────┘ └─────┬─────┘              │
│        │              │             │                      │
│ ┌──────┴──────────────┴─────────────┴─────┐               │
│ │           WebSocket Connection           │               │
│ └──────────────────┬──────────────────────┘               │
└────────────────────┼──────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │   Collaboration Server   │
        │  ┌──────┐ ┌───────────┐ │
        │  │ Y.js │ │ Presence  │ │
        │  │ CRDT │ │ Broadcast │ │
        │  └──┬───┘ └─────┬────┘ │
        └─────┼───────────┼──────┘
              │           │
    ┌─────────┴──┐  ┌─────┴────┐
    │ Document   │  │ Redis    │
    │ Store      │  │ Pub/Sub  │
    │ (Postgres) │  │ (presence│
    └────────────┘  └──────────┘
```

**Key design decisions:**
1. **CRDT vs OT**: CRDT (Y.js) — no central server needed for conflict resolution, works offline
2. **Editor engine**: TipTap (ProseMirror-based) — extensible, CRDT-friendly
3. **WebSocket**: Real-time sync with reconnection + exponential backoff
4. **Presence**: Separate lightweight channel for cursors/selection (high frequency, small payload)

</details>

### Phase 3: Deep Dive Topics

<details>
<summary>🔑 State Management & Conflict Resolution</summary>

```
CRDT (Conflict-free Replicated Data Type):

User A types "Hello" at position 0
User B types "World" at position 0
  → No conflict: CRDT merges based on site ID ordering
  → Result: "HelloWorld" or "WorldHello" (deterministic)

Y.js integration with React:
1. Y.Doc holds shared state
2. Y.Text type for rich text
3. WebSocket provider syncs Y.Doc across clients
4. TipTap plugin binds Y.Text to editor state
5. Each keystroke → local CRDT update → WebSocket broadcast → remote merge

Offline support:
1. Edits stored in IndexedDB (Y.js persistence)
2. On reconnect: Y.js syncs diff automatically
3. No conflict resolution needed (CRDT guarantees convergence)
```

</details>

### Evaluation Points

- ✅ **Strong**: Mentions CRDT/OT trade-off, addresses offline, discusses cursor presence separately
- ⚠️ **Adequate**: Reasonable architecture but vague on conflict resolution
- ❌ **Weak**: "Use WebSockets to send the whole document on each edit"

---

## Problem 2: Design a Social Media Feed (Instagram-like)

> "Design the frontend for a social media feed with infinite scroll, stories, likes, and real-time notifications."

### Phase 1: Requirements

<details>
<summary>🔑 Key Questions & Answers</summary>

- **Feed**: Algorithmic ranking, not chronological
- **Content**: Images, videos (autoplay on scroll), text, stories
- **Interactions**: Like, comment, share, save — optimistic updates
- **Real-time**: New post notification, like count updates
- **Scale**: 100M users, 50M DAU, 1000 posts/second
- **Performance**: Feed loads in <2s, smooth 60fps scrolling

</details>

### Phase 2: Architecture

<details>
<summary>🔑 Expected Architecture</summary>

```
┌───────────────────────────────────────────────────┐
│ App Shell                                          │
│ ┌─────────┐ ┌──────────────┐ ┌─────────────────┐  │
│ │ Stories │ │ Feed (Virtual│ │ Notifications   │  │
│ │ Carousel│ │ List)        │ │ (WebSocket)     │  │
│ └────┬────┘ └──────┬───────┘ └────────┬────────┘  │
│      │             │                  │            │
│ ┌────┴─────────────┴──────────────────┴────────┐  │
│ │        Data Layer (React Query / TanStack)    │  │
│ │  ┌──────────┐ ┌───────────┐ ┌──────────────┐ │  │
│ │  │ Feed     │ │ Mutations │ │ Optimistic   │ │  │
│ │  │ Infinite │ │ (like,    │ │ Updates      │ │  │
│ │  │ Query    │ │ comment)  │ │ + Rollback   │ │  │
│ │  └──────────┘ └───────────┘ └──────────────┘ │  │
│ └──────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────┘

Performance strategies:
├── Virtualized list (only render visible posts)
├── Lazy load images (Intersection Observer)
├── Video autoplay only when >50% visible
├── Skeleton loading for perceived performance
├── Prefetch next page when 3 posts from bottom
└── Image optimization: srcSet, WebP, blur placeholder
```

**Key decisions:**
1. **Virtualization**: react-window or Tanstack Virtual — only render ~10 visible posts
2. **Data fetching**: Cursor-based pagination (not offset) — stable with new posts
3. **Optimistic updates**: Like immediately → rollback if API fails
4. **Media loading**: Progressive JPEG + blur-up + lazy load

</details>

### Evaluation Points

- ✅ **Strong**: Virtualization, optimistic updates, cursor pagination, media optimization
- ⚠️ **Adequate**: Basic infinite scroll but no virtualization or optimization
- ❌ **Weak**: Load all posts at once, no lazy loading discussion

---

## Problem 3: Design a Dashboard with Real-Time Data

> "Design a monitoring dashboard (like Datadog/Grafana) showing real-time charts, alerts, and customizable layouts."

<details>
<summary>🔑 Architecture Sketch</summary>

```
Key challenges:
1. Real-time data: WebSocket + SSE for metrics stream
2. Chart rendering: Canvas-based (not SVG) for 10K+ data points
3. Layout: Drag-and-drop grid (react-grid-layout)
4. State: Dashboard config in URL/localStorage for sharing
5. Performance: Web Workers for data aggregation off main thread

Component tree:
Dashboard
├── Header (time range picker, refresh toggle)
├── DashboardGrid (react-grid-layout)
│   ├── Panel (configurable)
│   │   ├── ChartPanel (time series, bar, pie)
│   │   ├── TablePanel (log viewer, metrics table)
│   │   ├── AlertPanel (threshold-based alerts)
│   │   └── StatPanel (single number + sparkline)
│   └── AddPanelButton
└── Footer (auto-refresh indicator, last updated)

Data flow:
WebSocket → Worker (aggregate) → Shared state → Charts (requestAnimationFrame)
```

</details>

---

## Evaluation Rubric / Bảng Đánh Giá

| Criterion | 1 (Weak) | 2 (Developing) | 3 (Strong) | 4 (Excellent) |
|-----------|----------|----------------|------------|----------------|
| **Requirements** | Didn't ask questions | Asked 1-2 questions | Systematically gathered FR + NFR | Prioritized requirements, scoped MVP |
| **Architecture** | No diagram, vague | Basic boxes, missing pieces | Clear diagram with data flow | Layered architecture with trade-offs |
| **Data Model** | No API discussion | Basic endpoints | API contracts + state management | Cache strategy + optimistic + real-time |
| **Deep Dive** | Surface-level only | Addressed 1 concern | 2-3 deep dives with trade-offs | Expert-level in chosen deep dive |
| **Communication** | Disorganized, rambling | Followed some structure | Structured RADIO framework | Led the conversation, checked alignment |
| **FE Expertise** | Generic backend design | Some FE considerations | Strong FE patterns (virtualization, etc.) | L5-level: performance budgets, monitoring |

**Target:** 🔴 Senior = average 3.0+, with at least one 4.

---

## Connections / Liên Kết

- ⬅️ **Theory**: [Architecture Patterns](../08-fe-system-design/01-architecture-patterns.md) | [Scalability](../08-fe-system-design/02-scalability.md)
- 🔗 **Quality**: [Observability](../08-fe-system-design/07-frontend-quality-and-observability.md)
- ➡️ **Other rounds**: [Coding Mock](./01-coding-round.md) | [Behavioral Mock](./03-behavioral-round.md)
