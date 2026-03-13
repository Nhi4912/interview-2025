# Frontend Company Interview Guide — Hướng dẫn Phỏng vấn FE theo Công ty

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../00-table-of-contents.md)

> Hướng dẫn thực tế cho từng công ty. Focus vào format phỏng vấn, trọng tâm kỹ thuật, và tips cụ thể.

---

## 1. Zalo (VNG Corporation)

**Company Overview:**
- **Sản phẩm:** Messaging super-app (chat, call, ZaloPay, Mini Apps, Zalo OA) — 75M+ users
- **Quy mô:** VNG là unicorn Việt Nam, ~3000+ engineers
- **Tech stack chính:** React, custom internal frameworks, WebSocket, WebRTC
- **Đặc điểm:** Real-time features, high-throughput UI, Vietnamese-first product

**Interview Format:**
- Vòng 1: Online coding test (60-90 min) — JavaScript problems, DOM manipulation
- Vòng 2: Technical interview (60 min) — JS fundamentals deep dive, React patterns
- Vòng 3: System design (45-60 min) — design a real-time feature (chat UI, notification system)
- Vòng 4: Culture fit + team lead interview (30 min)
- *Ngôn ngữ phỏng vấn: Tiếng Việt*

**What They Focus On:**

**JavaScript Deep Dive — Trọng tâm số 1**
- Closures, scope chain, hoisting — hỏi rất chi tiết với trick questions
- Event loop, microtask vs macrotask — phải explain execution order
- Prototypal inheritance — hiểu prototype chain, không chỉ class syntax
- Memory management — garbage collection, memory leaks trong SPA

**Real-time UI**
- WebSocket connection management — reconnection, heartbeat
- Optimistic updates — update UI trước khi server confirm
- Virtual scrolling — render chat messages hiệu quả
- Debounce/throttle — typing indicators, search-as-you-type

**Performance at Scale**
- Rendering 10K+ DOM nodes — virtualization strategies
- Bundle splitting — lazy loading cho mini app platform
- Image optimization — avatar, media trong chat
- Service Worker — offline support, push notifications

**Sample Questions with Hints:**

**Q1:** Giải thích event loop. Cho đoạn code sau, output là gì và tại sao?
```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
```
**Hint:** 1 → 4 → 3 → 2. Synchronous code chạy trước (1, 4). Promise.then là microtask (ưu tiên hơn). setTimeout là macrotask (chạy sau microtasks). Giải thích call stack → microtask queue → macrotask queue.

**Q2:** Design a chat message list component that handles 100K+ messages efficiently.
**Hint:** Virtual scrolling (react-window hoặc custom IntersectionObserver). Chỉ render messages visible trong viewport + buffer. Maintain scroll position khi load older messages. Implement jump-to-bottom button. Consider message grouping by date.

**Q3:** Closures và memory leaks — khi nào closures gây memory leak?
**Hint:** Closure giữ reference đến outer scope variables. Memory leak xảy ra khi: event listeners không cleanup, setInterval trong useEffect không clear, closure reference DOM nodes đã bị remove. Solution: cleanup trong useEffect return, WeakRef/WeakMap cho cache.

**Q4:** Implement debounce function from scratch.
**Hint:** Closure giữ timer ID. Mỗi call clear timer cũ, set timer mới. Return wrapped function. Edge cases: leading vs trailing, cancel method, `this` binding. Bonus: implement throttle với leading/trailing options.

**Q5:** ZaloPay Mini App cần load nhanh trên mạng 3G. Optimize strategies?
**Hint:** Code splitting (dynamic import), tree shaking, compression (Brotli), lazy load images (IntersectionObserver), skeleton screens, Service Worker pre-caching, critical CSS inlining, resource hints (preconnect, prefetch).

**Tips for Zalo Interview:**
1. Ôn kỹ JS fundamentals — 60-70% câu hỏi xoay quanh vanilla JS, không phải framework
2. Practice viết code trên whiteboard/shared editor — không có IDE autocomplete
3. Hiểu WebSocket lifecycle — connect, message, reconnect, error handling
4. Zalo coi trọng performance — luôn mention performance implications trong câu trả lời
5. Biết về Mini App architecture — iframe isolation, bridge API, security sandbox
6. Chuẩn bị 2-3 stories về handling high-traffic features
7. Phỏng vấn bằng tiếng Việt nhưng technical terms dùng tiếng Anh

---

## 2. Grab

**Company Overview:**
- **Sản phẩm:** Southeast Asian superapp — ride-hailing, food delivery, payments, insurance
- **Quy mô:** 10,000+ engineers globally, offices in SG, VN, MY, TH, ID, PH
- **Tech stack chính:** React, Next.js, TypeScript, GraphQL, micro-frontends
- **Đặc điểm:** Real-time location, maps, complex state management, mobile-first web

**Interview Format:**
- Vòng 1: Online assessment (90 min) — 2-3 LeetCode-style problems (Medium-Hard)
- Vòng 2: Phone screen (45 min) — coding + JS/React fundamentals
- Vòng 3: Virtual onsite — 3-4 rounds:
  - Coding round 1 (45 min) — Algorithm problem
  - Coding round 2 (45 min) — Frontend coding (build a component)
  - System design (60 min) — Design a frontend system
  - Behavioral (45 min) — Leadership principles, past projects
- *Ngôn ngữ phỏng vấn: Tiếng Anh*

**What They Focus On:**

**Algorithms — Trọng tâm số 1**
- Array/String manipulation — two pointers, sliding window
- Tree/Graph traversal — BFS, DFS, shortest path
- Dynamic programming — medium level
- Time/Space complexity analysis — PHẢI explain Big O

**React & State Management**
- Hooks patterns — custom hooks, useCallback/useMemo optimization
- State management at scale — Context API limitations, Zustand, TanStack Query
- Component composition — render props, compound components, HOC
- React 18/19 features — concurrent rendering, Suspense, Server Components

**Frontend System Design**
- Design ride-hailing map UI — real-time location updates, driver matching visualization
- Design food delivery order tracking — status updates, ETA, real-time map
- Design payment checkout flow — multi-step form, error handling, retry logic
- Micro-frontend architecture — module federation, shared dependencies

**Mobile-first & Performance**
- Responsive design — mobile-first approach, touch interactions
- Network resilience — offline handling, retry strategies, optimistic updates
- Performance budgets — Core Web Vitals targets, bundle size monitoring
- Internationalization — SEA languages, RTL support considerations

**Sample Questions with Hints:**

**Q1:** Design a real-time driver tracking map component.
**Hint:** WebSocket cho location updates (throttled to 1-2 FPS). Map library (Mapbox GL JS). Interpolate driver position between updates (smooth animation). Cluster nearby drivers khi zoomed out. Lazy load map tiles. Consider battery drain on mobile — reduce update frequency khi app backgrounded.

**Q2:** Implement a custom hook `useDebounce(value, delay)` with TypeScript generics.
**Hint:** Generic type `T` cho value. useState + useEffect. Cleanup timeout on unmount/value change. Return debounced value. Type signature: `function useDebounce<T>(value: T, delay: number): T`. Bonus: add `isPending` state.

**Q3:** Given an array of ride requests with start/end times, find the maximum number of concurrent rides.
**Hint:** Sweep line algorithm. Create events: +1 at start, -1 at end. Sort events by time. Iterate and track running sum — max sum = answer. O(n log n) time. Handle tie-breaking: end events before start events at same time.

**Q4:** How would you architect a micro-frontend platform for Grab's super-app?
**Hint:** Module Federation (Webpack 5) hoặc Single-SPA. Shared dependencies (React, design system) loaded once. Independent deployment per team. Shared state via custom events / message bus. Routing: shell app owns top-level routes, delegate to micro-apps. Challenges: CSS isolation, shared auth, performance overhead.

**Q5:** Optimize a React list rendering 10,000 items with search filtering.
**Hint:** Virtual list (react-window). Debounce search input (300ms). useMemo for filtered results. Web Worker cho heavy filtering nếu data complex. Highlight matched text. Keyboard navigation (arrow keys). Show result count. Skeleton loading while filtering.

**Tips for Grab Interview:**
1. LeetCode là bắt buộc — practice Top 150 Interview Questions, focus Medium
2. System design phải mention scale — "100K concurrent users", "500 drivers on map"
3. Luôn nói trade-offs — không có solution hoàn hảo
4. TypeScript strict — interviewer expect proper typing, no `any`
5. Biết về micro-frontend architecture — Grab dùng module federation
6. Practice communication bằng tiếng Anh — explain thought process rõ ràng
7. Behavioral: dùng STAR format, chuẩn bị 5-6 stories

---

## 3. Axon (formerly Axon Active)

**Company Overview:**
- **Sản phẩm:** Outsourcing/product development cho Swiss/German clients — healthcare, finance, logistics
- **Quy mô:** 300-500 engineers in Vietnam (HCMC, Danang)
- **Tech stack chính:** React, TypeScript, Angular (some projects), CSS-in-JS, Storybook
- **Đặc điểm:** Code quality rất cao, testing culture, accessibility focus, European work style

**Interview Format:**
- Vòng 1: HR screening (30 min) — English assessment, salary expectations
- Vòng 2: Technical test (take-home, 3-5 days) — build a small React app with requirements
- Vòng 3: Technical interview (90 min) — code review of take-home + live coding + Q&A
- Vòng 4: Team fit interview (45 min) — behavioral, project experience
- *Ngôn ngữ phỏng vấn: Tiếng Anh*

**What They Focus On:**

**Code Quality — Trọng tâm số 1**
- Clean code principles — meaningful naming, single responsibility, DRY
- SOLID principles applied to React components
- TypeScript strict mode — proper types, no shortcuts
- Code reviews — explain design decisions, accept feedback gracefully

**Testing**
- Unit testing (Jest + React Testing Library) — test behavior, not implementation
- Integration testing — test component interactions
- E2E testing (Playwright/Cypress) — critical user flows
- Test patterns — arrange/act/assert, mock strategies, testing custom hooks

**CSS & Design Implementation**
- Pixel-perfect implementation — Swiss/German clients have high standards
- CSS Grid + Flexbox — complex layouts
- Responsive design — mobile to desktop
- CSS architecture — BEM, CSS Modules, design tokens
- Accessibility — WCAG 2.1 AA compliance (keyboard nav, screen readers, color contrast)

**Component Architecture**
- Design system thinking — reusable, composable components
- Storybook — component documentation and visual testing
- Props API design — minimal, intuitive, well-typed
- Performance — when to memoize, render optimization

**Sample Questions with Hints:**

**Q1:** Review this component and suggest improvements.
```tsx
const UserList = ({data, onDelete}: any) => {
  const [filter, setFilter] = useState('')
  const filtered = data.filter((u: any) => u.name.includes(filter))
  return <div>
    <input onChange={e => setFilter(e.target.value)} />
    {filtered.map((u: any) => <div onClick={() => onDelete(u.id)}>{u.name}</div>)}
  </div>
}
```
**Hint:** Issues: `any` types (define `User` interface), missing `key` prop on map, no memoization (useMemo for filtered, useCallback for handlers), no accessibility (label, role, keyboard support), no loading/empty states, inline styles implicit. Refactor with proper TypeScript, semantic HTML (`<ul>`, `<li>`, `<button>`), aria labels.

**Q2:** How would you implement a form with complex validation that supports multiple locales?
**Hint:** React Hook Form hoặc Formik cho form state. Zod/Yup schema validation. i18n for error messages (translation keys, not hardcoded strings). Custom validation rules per locale (phone format, date format). Accessibility: associate error messages with inputs via `aria-describedby`, announce errors to screen readers.

**Q3:** Explain the testing trophy/pyramid for a React application.
**Hint:** Integration tests = largest portion (test component combinations). Unit tests for utilities/hooks. E2E for critical paths only (login, checkout). Static analysis (TypeScript, ESLint) as foundation. RTL philosophy: test user behavior, not implementation details. Mock strategy: MSW for API calls, minimal component mocking.

**Q4:** Build an accessible dropdown/select component from scratch.
**Hint:** Semantic HTML base (`<select>` for simple, custom for complex). ARIA: `role="listbox"`, `role="option"`, `aria-expanded`, `aria-activedescendant`. Keyboard: Enter/Space to open, Arrow keys to navigate, Escape to close, Home/End for first/last. Focus management: trap focus when open, return focus when close. High contrast mode support.

**Q5:** How do you approach CSS architecture in a large application?
**Hint:** CSS Modules hoặc CSS-in-JS (styled-components/emotion) for scoping. Design tokens for consistency (colors, spacing, typography). Utility-first cho common patterns. Component-specific styles co-located. BEM naming for global styles. CSS custom properties for theming. Critical CSS extraction for performance.

**Tips for Axon Interview:**
1. Take-home test là critical — invest time into clean code, tests, README
2. Write unit + integration tests cho take-home (RTL, not Enzyme)
3. TypeScript strict — no `any`, define all interfaces properly
4. Accessibility là differentiator — show WCAG knowledge without being asked
5. Prepare to explain every decision in code review — "why this pattern?"
6. CSS knowledge quan trọng hơn bạn nghĩ — practice Grid/Flexbox layouts
7. European work culture — focus on quality over speed, sustainable pace

---

## 4. Employment Hero

**Company Overview:**
- **Sản phẩm:** HR/Payroll SaaS platform — employment management, leave, time tracking, benefits
- **Quy mô:** 1000+ employees, offices in AU, NZ, UK, SG, MY, VN (HCMC)
- **Tech stack chính:** React, Next.js, TypeScript, GraphQL, Ruby on Rails (backend)
- **Đặc điểm:** Full-stack leaning FE role, form-heavy UI, complex business logic, fast shipping

**Interview Format:**
- Vòng 1: HR call (30 min) — role overview, expectations
- Vòng 2: Technical interview (60 min) — React/TS coding + architecture discussion
- Vòng 3: Pair programming (60 min) — build feature together with interviewer
- Vòng 4: Culture fit + engineering manager (45 min)
- *Ngôn ngữ phỏng vấn: Tiếng Anh*

**What They Focus On:**

**TypeScript & React — Trọng tâm số 1**
- Advanced TypeScript — discriminated unions, mapped types, template literals
- React patterns — custom hooks for business logic, compound components
- Next.js App Router — Server Components, data fetching patterns
- Form handling — complex multi-step forms, validation, error handling

**Full-Stack Thinking**
- GraphQL — queries, mutations, fragments, caching (Apollo/urql)
- API integration — error handling, loading states, optimistic updates
- Data modeling — understand backend schema, translate to frontend types
- Authentication flows — JWT, session management, protected routes

**Productivity & DX**
- Developer experience — code generation, shared types, monorepo patterns
- Testing strategy — meaningful tests that catch regressions
- CI/CD awareness — how FE deployments work, preview environments
- Code review practices — constructive feedback, PR best practices

**Business Logic in UI**
- Complex conditional rendering — permission-based UI, feature flags
- Multi-tenant considerations — white-labeling, tenant-specific config
- Payroll calculations — precision (use BigNumber, not floating point)
- Localization — multi-locale (EN, AU, NZ, UK, SG, MY formats for dates, currency)

**Sample Questions with Hints:**

**Q1:** Design a multi-step employee onboarding form with validation.
**Hint:** Step state machine (current step, canProceed, canGoBack). React Hook Form + Zod schema per step. Persist partial data (localStorage or API). Progress indicator. Handle back navigation without losing data. Accessibility: announce step changes, focus management. Error summary at top of form.

**Q2:** How would you type a generic form field component in TypeScript?
**Hint:** Generic over form values type: `FormField<T extends FieldValues, K extends Path<T>>`. Props: `name: K`, `control: Control<T>`, `label: string`. Infer value type from path. Support different input types via discriminated union. Use `react-hook-form`'s `Controller` internally. Result: type-safe field names, autocomplete, compile-time validation.

**Q3:** Explain Server Components vs Client Components in Next.js App Router.
**Hint:** Server Components: render on server, no JS bundle, can access DB/filesystem directly, cannot use hooks/events. Client Components: traditional React, "use client" directive, needed for interactivity. Strategy: Server Components by default, "use client" boundary as low as possible. Composition: SC can render CC children, CC cannot import SC (but can accept as props). Data: SC fetch data directly, pass to CC as props.

**Q4:** How do you handle money/currency calculations in JavaScript?
**Hint:** NEVER use floating point (`0.1 + 0.2 !== 0.3`). Options: store as integer cents (multiply by 100), use Decimal.js/Big.js, Intl.NumberFormat for display. Backend should be source of truth for calculations. Round consistently (banker's rounding). Currency-aware formatting: `new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })`.

**Q5:** Design a permission-based UI system where different user roles see different features.
**Hint:** Permission context/provider at app level. `usePermission('feature:action')` hook. Server-side: include permissions in JWT/session. Client-side: `<Can permission="payroll:view">` wrapper component. Don't rely solely on client-side checks (server must enforce). Feature flags separate from permissions (LaunchDarkly/Unleash). Type-safe permission strings via union types.

**Tips for Employment Hero Interview:**
1. Next.js knowledge là big plus — App Router, Server Components, data patterns
2. TypeScript advanced types sẽ được test — practice generics, conditional types
3. Pair programming: communicate thought process, ask questions, accept hints
4. Form handling expertise — EH products are form-heavy
5. Understand SaaS multi-tenant architecture concepts
6. GraphQL basics — queries, mutations, how caching works
7. Show empathy for end users — EH values user-centric thinking

---

## 5. Microsoft

**Company Overview:**
- **Sản phẩm:** Azure, Microsoft 365 (Teams, Outlook, Office), VS Code, GitHub, LinkedIn
- **Quy mô:** 220,000+ employees globally, engineering offices in VN (expanding)
- **Tech stack chính:** React, TypeScript, Fluent UI, C# (backend), Azure
- **Đặc điểm:** TypeScript creator, accessibility champion, enterprise-grade quality, open source (VS Code, TypeScript)

**Interview Format:**
- Vòng 1: Online assessment (60-90 min) — 2-3 coding problems on Codility/HackerRank
- Vòng 2: Phone screen (45 min) — coding + behavioral
- Vòng 3: Virtual onsite (4 rounds, mỗi round 45-60 min):
  - Coding round 1 — Data structures & algorithms
  - Coding round 2 — System design OR frontend coding
  - Design round — System design (Senior+) OR UI architecture
  - Behavioral — "Tell me about a time..." (3-4 questions)
- *Ngôn ngữ phỏng vấn: Tiếng Anh*
- *Note: Có "as-appropriate" round nếu borderline — additional interview with senior engineer*

**What They Focus On:**

**TypeScript Mastery — Trọng tâm số 1**
- Type system deep dive — Microsoft tạo ra TypeScript
- Advanced types — conditional, mapped, template literal, variance
- Type inference — when to annotate, when to let TS infer
- Strict mode — `strictNullChecks`, `noImplicitAny`, `exactOptionalPropertyTypes`

**Design Patterns & Architecture**
- SOLID principles applied to React/TS
- Observer, Strategy, Factory, Decorator patterns in frontend context
- Component library design — Fluent UI concepts
- Dependency injection — InversifyJS concepts, React Context as DI

**Accessibility (A11Y)**
- WCAG 2.1 AA compliance — not optional at Microsoft
- Keyboard navigation — all features must work without mouse
- Screen reader support — ARIA roles, live regions, announcements
- High contrast mode — Windows High Contrast, forced-colors media query
- Focus management — focus trapping, focus restoration, skip links

**System Design**
- Design collaborative features (like Teams/Office) — real-time sync, conflict resolution
- Design enterprise dashboard — data visualization, complex filtering, export
- CRDT / OT concepts for collaborative editing
- Offline support, sync strategies

**Sample Questions with Hints:**

**Q1:** Implement a TypeScript type `DeepReadonly<T>` that makes all nested properties readonly.
**Hint:** Recursive conditional type: `type DeepReadonly<T> = T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T`. Handle edge cases: arrays (`ReadonlyArray<DeepReadonly<T[number]>>`), functions (return as-is), primitives (return as-is). Discuss: difference from `Readonly<T>` (shallow only), use cases (immutable state, frozen configs).

**Q2:** Design a real-time collaborative text editor (like Word Online).
**Hint:** Two main approaches: OT (Operational Transformation, used by Google Docs) vs CRDT (Conflict-free Replicated Data Types, used by Figma). OT: transform concurrent operations against each other, needs central server. CRDT: eventual consistency without coordination, works P2P. For interview: choose CRDT (simpler to explain). Key data structure: Yjs (Y.Text). WebSocket for sync. Cursor presence awareness. Undo/redo per user.

**Q3:** How would you make a complex data table component fully accessible?
**Hint:** Semantic HTML: `<table>`, `<thead>`, `<th scope="col">`, `<tbody>`. ARIA: `role="grid"` for interactive tables, `aria-sort` for sortable columns, `aria-label` for action buttons within cells. Keyboard: Arrow keys for cell navigation, Enter to activate, Tab to skip out of table. Screen readers: column headers announced with each cell. Sortable columns: `aria-sort="ascending|descending|none"`. Pagination: announce page changes with `aria-live`.

**Q4:** Given a binary tree, serialize and deserialize it. (Coding problem)
**Hint:** BFS approach: level-order traversal. Serialize: queue-based, use "null" for missing children. Deserialize: queue-based reconstruction. Format: "1,2,3,null,null,4,5". Time O(n), Space O(n). Alternative: DFS preorder — simpler recursion but same complexity. Handle edge cases: empty tree, single node.

**Q5:** Tell me about a time you had to make a technical decision that others disagreed with.
**Hint:** STAR format. Situation: describe the technical context and stakes. Task: what decision needed to be made and why there was disagreement. Action: how you gathered data, presented your case, listened to concerns, found compromise or convinced others. Result: outcome with metrics if possible. Key: show intellectual humility, data-driven decision making, ability to disagree and commit.

**Tips for Microsoft Interview:**
1. TypeScript là MUST — practice advanced types, utility types, type challenges
2. Accessibility knowledge là differentiator lớn — đọc WCAG 2.1 AA guidelines
3. Biết về Fluent UI — Microsoft's design system (React component library)
4. Design patterns from "Design Patterns" book — ít nhất 5-6 patterns
5. System design: think enterprise scale, collaboration features
6. Behavioral: prepare 6-8 STAR stories, focus on growth mindset
7. Microsoft values "growth mindset" — show learning from failures

---

## 6. Google

**Company Overview:**
- **Sản phẩm:** Search, Chrome, Gmail, Docs, Maps, YouTube, Android, Cloud
- **Quy mô:** 180,000+ employees, engineering offices worldwide
- **Tech stack chính:** Angular (internal), React (some teams), TypeScript, Closure Compiler, Web Components
- **Đặc điểm:** Algorithm-heavy interviews, browser expertise, billion-user scale, open source (Chrome, V8, Angular)

**Interview Format:**
- Vòng 1: Online assessment (60 min) — 2 algorithmic problems
- Vòng 2: Phone screen (45 min) — algorithm coding on Google Docs
- Vòng 3: Virtual onsite (4-5 rounds, mỗi round 45 min):
  - Coding round 1 — Algorithms (Medium-Hard)
  - Coding round 2 — Algorithms (Hard)
  - Coding round 3 — Frontend-specific coding (build interactive component)
  - System design — Design at Google scale
  - Googleyness & Leadership — behavioral + culture fit
- *Ngôn ngữ phỏng vấn: Tiếng Anh*
- *Note: Hiring committee review sau onsite — interviewer không quyết định hire/no-hire*

**What They Focus On:**

**Algorithms — Trọng tâm số 1**
- Hard-level problems — dynamic programming, graph algorithms
- Data structures — trees, heaps, tries, segment trees, union-find
- String algorithms — KMP, Rabin-Karp, suffix arrays
- Optimization — prove time/space complexity, discuss lower bounds
- Clean code — even in algorithm problems, code must be readable

**Browser Internals**
- Rendering pipeline — Parse HTML → DOM → CSSOM → Render Tree → Layout → Paint → Composite
- V8 engine — JIT compilation, hidden classes, inline caching
- Event loop — call stack, microtask queue, macrotask queue, requestAnimationFrame
- Memory management — heap, stack, garbage collection (mark-and-sweep, generational GC)

**System Design at Scale**
- Design Google Docs collaborative editing — OT/CRDT
- Design YouTube video player — adaptive bitrate, buffering, CDN
- Design Google Maps — tile rendering, geospatial indexing, offline maps
- Design a component library used by 1000+ engineers
- Metrics: latency (p50, p99), availability (99.99%), throughput

**Googleyness & Leadership**
- Ambiguity — comfortable with incomplete requirements
- Collaboration — "what would you do if a teammate disagreed?"
- Impact — "how did you go above and beyond?"
- Doing the right thing — ethics, user privacy, engineering excellence

**How Google Evaluates Candidates:**

| Level | Coding | System Design | G&L |
|-------|--------|--------------|-----|
| Strong No Hire | Cannot solve medium problems, poor code quality | No structured approach, missing key components | Dismissive, no examples |
| No Hire | Solves with significant hints, bugs in solution | Identifies some components but shallow analysis | Generic answers, few examples |
| Hire | Solves medium independently, good code, discusses trade-offs | Solid design with appropriate trade-offs, considers scale | Clear STAR examples, self-aware |
| Strong Hire | Solves hard problems, optimal solution, clean code, edge cases | Novel insights, deep expertise, anticipates issues | Inspiring examples, growth mindset, clear impact |

**Sample Questions with Hints:**

**Q1:** Given a stream of events with timestamps, design a sliding window counter that returns the count of events in the last N seconds. (Algorithm)
**Hint:** Binary search approach: keep sorted array of timestamps. For count(now): binary search for (now - N), return length - index. Add: append + optionally evict old. O(log n) per operation. Alternative: bucket approach — divide N seconds into sub-windows, store count per bucket. Trade-off: precision vs memory. Follow-up: distributed version across multiple servers.

**Q2:** Explain the Critical Rendering Path. How would you optimize it?
**Hint:** Parse HTML → DOM. Parse CSS → CSSOM. DOM + CSSOM → Render Tree. Layout (reflow) → Paint → Composite. Optimize: minimize critical resources (defer/async scripts), reduce critical path length (inline critical CSS), reduce critical bytes (minify, compress). Specific techniques: `<link rel="preload">`, font-display: swap, avoid render-blocking JS, CSS containment (`contain: layout`), will-change for compositor layers.

**Q3:** Design a frontend component library used by 1000+ engineers across Google.
**Hint:** Design system principles: consistency, accessibility, performance, theming. Architecture: Web Components (framework-agnostic) OR React components + wrappers. Mono-repo (Nx). Versioning: semver, breaking change policy. Documentation: Storybook + MDX. Testing: visual regression (Chromatic), unit (Jest), a11y (axe). Distribution: npm packages, tree-shakeable. Performance budget per component. Theming: CSS custom properties, design tokens. Governance: RFC process for new components.

**Q4:** Implement `Promise.all()` from scratch.
**Hint:** Return new Promise. Track completion count. For each promise: `Promise.resolve(promise).then(value => { results[index] = value; count++; if (count === total) resolve(results) })`. Reject immediately on any failure. Handle: empty array (resolve immediately), non-promise values (wrap in Promise.resolve), preserve order (use index, not push).

**Q5:** Tell me about a time you navigated ambiguity in a project.
**Hint:** Googleyness question. Show: ability to define scope when requirements unclear, breaking down ambiguous problems into concrete steps, getting alignment from stakeholders, iterating based on feedback. Structure: unclear requirement → how you clarified → what you built → what you learned. Avoid: complaining about ambiguity. Show: you thrive in it.

**Tips for Google Interview:**
1. LeetCode Hard là target — practice 200+ problems, focus patterns (DP, graph, tree)
2. Code trên Google Docs (no syntax highlighting, no autocomplete) — practice writing code in plain text
3. Browser internals — đọc "How Browsers Work" (web.dev) cover to cover
4. System design phải mention scale numbers — "1 billion daily active users"
5. Googleyness: prepare 8-10 STAR stories, focus on impact + collaboration
6. Clean code matters even in algorithms — variable names, helper functions, comments
7. Don't be afraid to ask clarifying questions — Google values this

---

## General Preparation Strategy — Chiến lược ôn tập chung

### 8-Week Study Plan for Frontend

| Week | Focus | Daily |
|------|-------|-------|
| 1-2 | JS fundamentals + LeetCode Easy | 2h theory + 2-3 LC Easy |
| 3-4 | React + TypeScript + LeetCode Medium | 2h theory + 2 LC Medium |
| 5-6 | System design + Performance | 1h theory + 1 system design + 1 LC Medium |
| 7 | Security + Accessibility + CSS deep dive | 2h mixed topics + LC review |
| 8 | Mock interviews + Weak areas | 1 mock/day + review notes |

### LeetCode Pattern Table — Các pattern quan trọng cho FE

| Pattern | Priority | Examples |
|---------|----------|---------|
| Two Pointers | Critical | Valid Palindrome, Container With Most Water |
| Sliding Window | Critical | Longest Substring Without Repeating Characters |
| Hash Map | Critical | Two Sum, Group Anagrams |
| Stack | High | Valid Parentheses, Min Stack |
| BFS/DFS | High | Number of Islands, Binary Tree Level Order |
| Binary Search | High | Search in Rotated Array, Find Minimum |
| Dynamic Programming | Medium-High | Climbing Stairs, Coin Change, LCS |
| Tree | Medium | Validate BST, Lowest Common Ancestor |
| Graph | Medium | Course Schedule, Clone Graph |
| Trie | Low-Medium | Implement Trie, Word Search II |
| Heap | Low-Medium | Top K Frequent Elements, Merge K Sorted Lists |

### Common Frontend Interview Questions Table

| Category | Question | Difficulty |
|----------|----------|-----------|
| JS | Explain closures with practical example | 🟢 Junior |
| JS | Event loop execution order | 🟡 Middle |
| JS | Implement Promise.all() | 🟡 Middle |
| TS | Implement generic type-safe event emitter | 🔴 Senior |
| React | Virtual DOM vs Fiber reconciliation | 🟡 Middle |
| React | Design custom hook for data fetching | 🟡 Middle |
| React | Server Components vs Client Components | 🟡 Middle |
| Performance | Optimize bundle size strategies | 🟡 Middle |
| Performance | Critical Rendering Path optimization | 🔴 Senior |
| System Design | Design auto-complete search component | 🟡 Middle |
| System Design | Design real-time collaborative whiteboard | 🔴 Senior |
| CSS | Explain CSS specificity and cascade | 🟢 Junior |
| CSS | Build responsive layout without media queries | 🟡 Middle |
| Security | Prevent XSS in React application | 🟡 Middle |
| A11Y | Make a modal component accessible | 🟡 Middle |

---

## Interview Day Checklist — Checklist ngày phỏng vấn

### Before Interview
- [ ] Test camera, microphone, internet connection
- [ ] Prepare IDE/editor — VS Code with minimal extensions
- [ ] Have water, pen & paper ready
- [ ] Review your resume — be ready to discuss any project listed
- [ ] Review company's tech blog / engineering posts
- [ ] Have 3-5 questions prepared to ask interviewer

### During Interview
- [ ] Clarify requirements FIRST — ask about edge cases, constraints, scale
- [ ] Think out loud — explain your thought process
- [ ] Start with brute force, then optimize
- [ ] Write clean code — meaningful names, small functions
- [ ] Test your solution — walk through with examples
- [ ] Discuss time/space complexity
- [ ] If stuck: explain what you're thinking, ask for hints

### Communication Tips
- "Let me make sure I understand the problem correctly..."
- "I'm thinking of two approaches: X and Y. X has trade-off A, Y has trade-off B. I'll go with X because..."
- "Let me first write the high-level structure, then fill in the details..."
- "I notice an edge case here: [describe]. I'll handle it by..."
- "The time complexity is O(n log n) because [explain]. Space is O(n) because [explain]."

### Questions to Ask Interviewer
- "What does a typical day look like for this role?"
- "What are the biggest technical challenges the team is facing?"
- "How does the team approach code reviews and knowledge sharing?"
- "What's the tech stack migration roadmap?" (shows forward thinking)
- "How do you balance feature development with technical debt?"

---

## Company Comparison Table — Bảng so sánh tổng hợp

| Criteria | Zalo | Grab | Axon | Employment Hero | Microsoft | Google |
|----------|------|------|------|-----------------|-----------|--------|
| Interview language | VN | EN | EN | EN | EN | EN |
| Coding difficulty | Medium | Hard | Medium (take-home) | Medium | Medium-Hard | Hard-Very Hard |
| Algorithm focus | Medium | Very High | Low | Medium | High | Very High |
| System design focus | Medium | High | Medium | Medium | High | Very High |
| React depth | High | High | High | Very High | High | Medium |
| TypeScript depth | Medium | High | High | Very High | Very High | Medium |
| CSS importance | Medium | Medium | Very High | Medium | High | Low |
| Accessibility | Low | Low | High | Medium | Very High | Medium |
| Testing emphasis | Medium | Medium | Very High | High | High | Medium |
| Behavioral rounds | 1 | 1-2 | 1 | 1 | 1-2 | 1 (Googleyness) |
| Total rounds | 3-4 | 5-6 | 3-4 | 3-4 | 5-6 | 5-6 |
| Typical timeline | 2-3 weeks | 3-5 weeks | 2-4 weeks | 2-3 weeks | 4-6 weeks | 6-10 weeks |
| Salary range (VN) | Competitive | Top-tier | Above average | Above average | Top-tier | Top-tier |
| Remote policy | Hybrid | Hybrid | Hybrid/Remote | Remote-friendly | Hybrid | Hybrid |

---

## Final Tips — Lời khuyên cuối

### Mindset
1. **Phỏng vấn là kỹ năng riêng** — giỏi code ≠ giỏi phỏng vấn. Cần practice riêng.
2. **Fail là bình thường** — mỗi lần fail là data point. Analyze và improve.
3. **Consistency > intensity** — 2h/ngày trong 8 tuần tốt hơn 16h/ngày trong 1 tuần.
4. **Teach to learn** — giải thích concept cho người khác giúp hiểu sâu hơn.

### Common Mistakes Table

| Mistake | Impact | Fix |
|---------|--------|-----|
| Nhảy vào code ngay | Miss edge cases, wrong approach | Luôn clarify requirements, plan trước |
| Không nói thought process | Interviewer không biết bạn đang nghĩ gì | Think out loud, explain trade-offs |
| Chỉ ôn algorithms | Fail system design và behavioral | Balance 40% algo + 30% system design + 30% behavioral |
| Không test solution | Bugs in final answer | Walk through 2-3 examples, check edge cases |
| Generic behavioral answers | Không convincing | Prepare specific STAR stories with metrics |
| Ignore accessibility | Miss points at Microsoft/Axon | Learn WCAG 2.1 AA basics, keyboard nav, ARIA |
| Skip TypeScript depth | Fail at Microsoft/EH | Practice advanced types, generics, strict mode |

### Per-Company Practice Timeline

| Week | Zalo | Grab | Axon | Employment Hero | Microsoft | Google |
|------|------|------|------|-----------------|-----------|--------|
| 1 | JS fundamentals | LC Easy→Medium | React patterns | TS advanced types | TS deep dive | LC Medium |
| 2 | Event loop, closures | LC Medium | CSS architecture | Next.js App Router | Design patterns | LC Medium-Hard |
| 3 | React + WebSocket | LC Medium-Hard | Testing (RTL) | GraphQL + forms | Accessibility | LC Hard |
| 4 | Performance | System design | Take-home prep | System design | System design | Browser internals |
| 5 | System design | Mock interviews | Code review prep | Pair programming | Mock interviews | System design |
| 6 | Mock interviews | Behavioral prep | Mock interviews | Mock interviews | Behavioral prep | Googleyness prep |
