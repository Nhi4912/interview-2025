# System Design Mind Map - Quick Reference


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Sơ đồ tổng hợp kiến thức Frontend System Design cho ôn tập nhanh.

---

## 🗺️ System Design Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND SYSTEM DESIGN                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│                           ┌─────────────────┐                                │
│                           │ SYSTEM DESIGN   │                                │
│                           └────────┬────────┘                                │
│                                    │                                         │
│        ┌────────────┬──────────────┼──────────────┬────────────┐            │
│        │            │              │              │            │            │
│   ┌────▼────┐ ┌─────▼────┐ ┌──────▼─────┐ ┌─────▼─────┐ ┌────▼────┐       │
│   │ RADIO   │ │ARCHITECT │ │   STATE    │ │  DESIGN   │ │  CASE   │       │
│   │FRAMEWORK│ │ PATTERNS │ │MANAGEMENT  │ │  SYSTEM   │ │ STUDIES │       │
│   │         │ │          │ │            │ │           │ │         │       │
│   │Require  │ │MVC       │ │Local/Global│ │Tokens     │ │News Feed│       │
│   │Architect│ │Flux/Redux│ │Server state│ │Components │ │Chat App │       │
│   │Data     │ │Component │ │Normalized  │ │Document   │ │Typeahead│       │
│   │Interface│ │Micro-FE  │ │Real-time   │ │A11y       │ │E-commerce│      │
│   │Optimize │ │          │ │            │ │           │ │         │       │
│   └─────────┘ └──────────┘ └────────────┘ └───────────┘ └─────────┘       │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 RADIO Framework Cheatsheet

```
┌─────────────────────────────────────────────────────────────────┐
│                    RADIO FRAMEWORK                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   R - REQUIREMENTS (5 min)                                      │
│   ────────────────────────                                       │
│   Functional:                                                   │
│   • What features?                                              │
│   • What user actions?                                          │
│   • What content types?                                         │
│                                                                   │
│   Non-functional:                                               │
│   • Performance (LCP < 2.5s, INP < 200ms)                      │
│   • Scale (users, data volume)                                  │
│   • Accessibility (WCAG 2.1 AA)                                 │
│   • Offline support?                                            │
│                                                                   │
│   A - ARCHITECTURE (10 min)                                     │
│   ─────────────────────────                                      │
│   • Component hierarchy                                         │
│   • Data flow (unidirectional)                                  │
│   • State management strategy                                   │
│   • Client vs Server responsibilities                           │
│                                                                   │
│   D - DATA MODEL (10 min)                                       │
│   ────────────────────────                                       │
│   • Entity definitions                                          │
│   • API contracts (REST/GraphQL)                                │
│   • Pagination strategy (cursor vs offset)                      │
│   • Real-time events                                            │
│                                                                   │
│   I - INTERFACE DESIGN (10 min)                                 │
│   ──────────────────────────────                                 │
│   • Component props/state                                       │
│   • Reusable components                                         │
│   • Error boundaries                                            │
│                                                                   │
│   O - OPTIMIZATIONS (10 min)                                    │
│   ──────────────────────────                                     │
│   • Code splitting                                              │
│   • Virtual scrolling                                           │
│   • Caching (React Query, SWR)                                  │
│   • Optimistic updates                                          │
│   • Image optimization                                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture Patterns

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE PATTERNS                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   FLUX/REDUX (Unidirectional):                                  │
│   ────────────────────────────                                   │
│   Action ──▶ Dispatcher ──▶ Store ──▶ View ──▶ Action           │
│                                                                   │
│   Use for: Complex state, many interactions                     │
│                                                                   │
│   COMPONENT-BASED (Modern):                                     │
│   ─────────────────────────                                      │
│   Custom Hooks (logic) + Components (UI)                        │
│                                                                   │
│   Use for: Most React applications                              │
│                                                                   │
│   MICRO-FRONTENDS:                                              │
│   ─────────────────                                              │
│   Independent apps composed at runtime                          │
│   Module Federation (Webpack 5)                                 │
│                                                                   │
│   Use for: Large teams, multi-product companies                 │
│                                                                   │
│   DECISION TREE:                                                │
│   ──────────────                                                 │
│   Team > 20? ──Yes──▶ Micro-FE                                  │
│      │                                                           │
│      No                                                          │
│      │                                                           │
│   Complex state? ──Yes──▶ Redux/Zustand                         │
│      │                                                           │
│      No                                                          │
│      │                                                           │
│      └──▶ Hooks + Context                                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 State Management

```
┌─────────────────────────────────────────────────────────────────┐
│                    STATE TYPES & TOOLS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   STATE TYPE          TOOL                   EXAMPLE             │
│   ─────────────────────────────────────────────────────────────  │
│   UI State            useState/useReducer    Modal, tabs         │
│   Server State        React Query/SWR        API data            │
│   URL State           React Router           Route params        │
│   Form State          React Hook Form        Input values        │
│   Global State        Zustand/Redux          Auth, cart          │
│                                                                   │
│   KEY PATTERNS:                                                 │
│   ─────────────                                                  │
│                                                                   │
│   Normalized State:                                             │
│   {                                                              │
│     entities: { users: {}, posts: {} },                         │
│     ids: { posts: [] }                                          │
│   }                                                              │
│                                                                   │
│   Selectors for Performance:                                    │
│   const name = useStore(state => state.user.name);              │
│                                                                   │
│   Optimistic Updates:                                           │
│   1. Update UI immediately                                      │
│   2. Send request                                               │
│   3. Rollback on error                                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Design System

```
┌─────────────────────────────────────────────────────────────────┐
│                    DESIGN SYSTEM COMPONENTS                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   TOKEN HIERARCHY:                                              │
│   ─────────────────                                              │
│                                                                   │
│   Global       ──▶ color-blue-500: #3B82F6                      │
│       │                                                          │
│       ▼                                                          │
│   Semantic     ──▶ color-primary: {color-blue-500}              │
│       │                                                          │
│       ▼                                                          │
│   Component    ──▶ button-bg: {color-primary}                   │
│                                                                   │
│   COMPONENT API PRINCIPLES:                                     │
│   ──────────────────────────                                     │
│   • Variants (primary, secondary, ghost)                        │
│   • Sizes (sm, md, lg)                                          │
│   • Composable (Card.Header, Card.Body)                         │
│   • Accessible by default                                       │
│   • Polymorphic (as="button" | "a")                             │
│                                                                   │
│   STRUCTURE:                                                    │
│   ──────────                                                     │
│   packages/                                                     │
│   ├── tokens/     # Design tokens                               │
│   ├── core/       # Components                                  │
│   ├── icons/      # Icon library                                │
│   └── hooks/      # Shared hooks                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 Common Trade-offs

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRADE-OFF DECISIONS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   DECISION           OPTION A          OPTION B                 │
│   ─────────────────────────────────────────────────────────────  │
│                                                                   │
│   Real-time          Polling           WebSocket                │
│                      Simpler           Lower latency            │
│                      More requests     Complex reconnect        │
│                                                                   │
│   Rendering          CSR               SSR/SSG                  │
│                      Interactive       SEO friendly             │
│                      Slower FCP        More server load         │
│                                                                   │
│   Data fetch         REST              GraphQL                  │
│                      Cacheable         Flexible queries         │
│                      Over-fetching     Complex setup            │
│                                                                   │
│   Updates            Pessimistic       Optimistic               │
│                      Simpler           Better UX                │
│                      Slower UX         Rollback logic           │
│                                                                   │
│   Pagination         Offset            Cursor                   │
│                      Can skip pages    Real-time safe           │
│                      Inconsistent      No page jumping          │
│                                                                   │
│   Lists              Pagination        Infinite scroll          │
│                      Bookmarkable      Better mobile UX         │
│                      More clicks       Memory concerns          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Case Study Quick Reference

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEWS FEED                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   KEY COMPONENTS:                                               │
│   • PostList (virtual scroll)                                   │
│   • PostCard (like, comment, share)                             │
│   • MediaGallery (lazy load images)                             │
│   • InfiniteScroll (cursor pagination)                          │
│                                                                   │
│   OPTIMIZATIONS:                                                │
│   • Virtual list for 1000+ items                                │
│   • Optimistic likes                                            │
│   • WebSocket for real-time                                     │
│   • "New posts" indicator                                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHAT APPLICATION                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   KEY COMPONENTS:                                               │
│   • ConversationList                                            │
│   • MessageList (reversed virtual scroll)                       │
│   • MessageBubble                                               │
│   • Composer                                                    │
│                                                                   │
│   REAL-TIME:                                                    │
│   • WebSocket for messages                                      │
│   • Typing indicators                                           │
│   • Read receipts                                               │
│   • Offline queue                                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTOCOMPLETE                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   KEY FEATURES:                                                 │
│   • Debounced input (300ms)                                     │
│   • Keyboard navigation                                         │
│   • aria-combobox pattern                                       │
│   • Highlighted matching text                                   │
│   • Recent searches                                             │
│                                                                   │
│   ACCESSIBILITY:                                                │
│   • role="combobox"                                             │
│   • aria-expanded                                               │
│   • aria-activedescendant                                       │
│   • Live region for results count                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 Interview Quick Answers

```
Q: What is RADIO framework?
A: Requirements → Architecture → Data Model → Interface → Optimizations
   Structured 45-min approach to frontend system design

Q: When to use WebSocket vs Polling?
A: WebSocket: Real-time critical (chat, notifications)
   Polling: Simple updates, < 1 req/min acceptable

Q: How to handle infinite scroll performance?
A: Virtual scrolling (only render visible items)
   Windowing libraries: @tanstack/virtual, react-window

Q: Optimistic update pattern?
A: 1. Update UI immediately
   2. Send API request
   3. On error: rollback to previous state

Q: Normalized vs denormalized state?
A: Normalized: No duplicates, complex selectors
   Denormalized: Simpler access, data sync issues
   Use normalized for entities shared across views
```

---

## ✅ Interview Checklist

```
BEFORE INTERVIEW:
□ Practice 2-3 case studies end-to-end
□ Know RADIO framework cold
□ Prepare trade-off discussions
□ Review data modeling patterns
□ Practice drawing architecture diagrams

DURING INTERVIEW:
□ Clarify requirements (5 min)
□ State assumptions explicitly
□ Draw high-level architecture first
□ Discuss trade-offs proactively
□ Address accessibility
□ Discuss performance optimizations
□ Time management (don't go deep too early)

COMMON MISTAKES:
✗ Jumping to implementation
✗ Not clarifying scope
✗ Ignoring non-functional requirements
✗ Over-engineering
✗ Not discussing trade-offs
```

---

> **Module hoàn thành!** Quay lại [README.md](./mindmap-foundations.md) để xem tổng quan module.
