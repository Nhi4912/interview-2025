# Kế Hoạch Ôn Tập 6 Tháng - Frontend Interview Big Tech

> Lộ trình chi tiết từng tuần để chuẩn bị phỏng vấn vị trí Mid-Senior Frontend tại Google, Meta, Amazon, Microsoft, Apple, Netflix

---

## Tổng Quan

### Mục Tiêu
- Nắm vững 100% kiến thức core frontend
- Giải quyết được LeetCode Medium một cách tự tin
- Thiết kế được frontend systems ở scale lớn
- Pass được behavioral interviews

### Thời Gian Học
- **Khuyến nghị:** 2-3 giờ/ngày (14-21 giờ/tuần)
- **Tối thiểu:** 1.5 giờ/ngày (10 giờ/tuần)
- **Intensive:** 4-5 giờ/ngày (30+ giờ/tuần)

### Cấu Trúc Mỗi Tháng

```mermaid
gantt
    title 6-Month Study Plan Overview
    dateFormat  YYYY-MM
    section Foundations
    Month 1-2: JavaScript & TypeScript    :2024-01, 60d
    section Frameworks
    Month 3: React Deep Dive              :2024-03, 30d
    section Infrastructure
    Month 4: Browser, Network, Security   :2024-04, 30d
    section Advanced
    Month 5: System Design & Performance  :2024-05, 30d
    section Interview
    Month 6: Practice & Mock Interviews   :2024-06, 30d
```

---

## Tháng 1-2: JavaScript & TypeScript Foundations

### Tuần 1: JavaScript - Execution & Scope

#### Mục tiêu
- [ ] Hiểu sâu Execution Context
- [ ] Master Scope Chain & Hoisting
- [ ] Giải thích được Closures

#### Lịch học chi tiết

| Ngày | Topic | Thời gian | Resources |
|------|-------|-----------|-----------|
| T2 | Execution Context | 2h | [01-javascript/01-execution-context.md](./01-javascript/01-execution-context.md) |
| T3 | Call Stack & Memory | 2h | Continue + practice |
| T4 | Scope Chain | 2h | [01-javascript/02-scope-closure.md](./01-javascript/02-scope-closure.md) |
| T5 | Hoisting Deep Dive | 2h | Continue + exercises |
| T6 | Closures | 2h | Practice explaining (Feynman) |
| T7 | Closures Advanced | 2h | Coding challenges |
| CN | Review + Flashcards | 1h | Create SRS cards |

#### Coding Practice
```
LeetCode (JavaScript focus):
- Day 1-2: Basic closure exercises
- Day 3-4: Scope-related problems
- Day 5-7: Implement: debounce, throttle, memoize
```

#### Interview Questions to Master
```
🟢 Junior:
- Closure là gì? Cho ví dụ.
- Hoisting hoạt động như thế nào với var, let, const?

🟡 Mid-level:
- Giải thích sự khác biệt giữa lexical scope và dynamic scope.
- Tại sao closures có thể gây memory leaks?

🔴 Senior:
- Giải thích cách V8 optimize closures.
- Design một memoization function với cache invalidation.
```

---

### Tuần 2: JavaScript - `this` & Prototypes

#### Mục tiêu
- [ ] Master tất cả rules của `this`
- [ ] Hiểu Prototype Chain
- [ ] Biết khi nào dùng class vs function

#### Lịch học chi tiết

| Ngày | Topic | Thời gian | Resources |
|------|-------|-----------|-----------|
| T2 | `this` keyword rules | 2h | [01-javascript/03-this-keyword.md](./01-javascript/03-this-keyword.md) |
| T3 | call, apply, bind | 2h | Practice + exercises |
| T4 | Prototype basics | 2h | [01-javascript/04-prototypes-inheritance.md](./01-javascript/04-prototypes-inheritance.md) |
| T5 | Prototype Chain | 2h | Draw diagrams |
| T6 | ES6 Classes | 2h | Compare with prototypes |
| T7 | Inheritance patterns | 2h | Coding challenges |
| CN | Review + Mock | 1.5h | Practice explaining |

#### Coding Practice
```
Implement from scratch:
- Array.prototype.map
- Array.prototype.filter
- Array.prototype.reduce
- Function.prototype.bind
- Object.create
```

---

### Tuần 3: JavaScript - Event Loop & Async

#### Mục tiêu
- [ ] Vẽ được Event Loop diagram
- [ ] Phân biệt microtask vs macrotask
- [ ] Master Promises & async/await

#### Lịch học chi tiết

| Ngày | Topic | Thời gian | Resources |
|------|-------|-----------|-----------|
| T2 | Event Loop basics | 2h | [01-javascript/05-event-loop.md](./01-javascript/05-event-loop.md) |
| T3 | Microtasks vs Macrotasks | 2h | Practice output prediction |
| T4 | Promises deep dive | 2h | [01-javascript/06-async-programming.md](./01-javascript/06-async-programming.md) |
| T5 | async/await patterns | 2h | Error handling |
| T6 | Promise combinators | 2h | all, race, allSettled |
| T7 | Advanced async patterns | 2h | Implement Promise.all |
| CN | Review + Quiz | 1.5h | Output prediction quiz |

#### Output Prediction Exercises
```javascript
// Predict the output order:
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');

// Answer: 1, 4, 3, 2
```

---

### Tuần 4: JavaScript - Memory & ES6+

#### Mục tiêu
- [ ] Hiểu Garbage Collection
- [ ] Xác định Memory Leaks
- [ ] Master ES6+ features

#### Lịch học chi tiết

| Ngày | Topic | Thời gian | Resources |
|------|-------|-----------|-----------|
| T2 | Memory Management | 2h | [01-javascript/07-memory-management.md](./01-javascript/07-memory-management.md) |
| T3 | Garbage Collection | 2h | Mark-and-sweep, reference counting |
| T4 | Memory Leaks | 2h | Common patterns + DevTools |
| T5 | ES6 features | 2h | [01-javascript/08-es6-plus-features.md](./01-javascript/08-es6-plus-features.md) |
| T6 | Destructuring, Spread | 2h | Practice exercises |
| T7 | Modules, Iterators | 2h | Import/export patterns |
| CN | Month 1 Review | 2h | Comprehensive review |

---

### Tuần 5-6: TypeScript

#### Tuần 5: TypeScript Basics

| Ngày | Topic | Thời gian | Resources |
|------|-------|-----------|-----------|
| T2 | Type System Basics | 2h | [02-typescript/01-type-system-basics.md](./02-typescript/01-type-system-basics.md) |
| T3 | Interfaces vs Types | 2h | [02-typescript/02-interfaces-vs-types.md](./02-typescript/02-interfaces-vs-types.md) |
| T4 | Generics | 2h | [02-typescript/03-generics.md](./02-typescript/03-generics.md) |
| T5 | Generics Advanced | 2h | Practice + exercises |
| T6 | Utility Types | 2h | [02-typescript/04-utility-types.md](./02-typescript/04-utility-types.md) |
| T7 | Practice | 2h | Type challenges |
| CN | Review | 1.5h | Flashcards + quiz |

#### Tuần 6: TypeScript Advanced

| Ngày | Topic | Thời gian | Resources |
|------|-------|-----------|-----------|
| T2 | Advanced Patterns | 2h | [02-typescript/05-advanced-patterns.md](./02-typescript/05-advanced-patterns.md) |
| T3 | Discriminated Unions | 2h | Real-world examples |
| T4 | TypeScript + React | 2h | [02-typescript/06-typescript-with-react.md](./02-typescript/06-typescript-with-react.md) |
| T5 | Component Typing | 2h | Props, events, refs |
| T6 | Type Challenges | 2h | type-challenges repo |
| T7 | Project Practice | 2h | Refactor JS to TS |
| CN | Month 2 Review | 2h | Comprehensive review |

---

### Tuần 7-8: HTML, CSS & Fundamentals

#### Tuần 7: HTML & CSS Core

| Ngày | Topic | Thời gian | Resources |
|------|-------|-----------|-----------|
| T2 | Semantic HTML | 2h | [03-html-css/01-semantic-html.md](./03-html-css/01-semantic-html.md) |
| T3 | CSS Box Model | 2h | [03-html-css/02-css-fundamentals.md](./03-html-css/02-css-fundamentals.md) |
| T4 | CSS Specificity | 2h | Cascade rules |
| T5 | Flexbox | 2h | [03-html-css/03-flexbox-grid.md](./03-html-css/03-flexbox-grid.md) |
| T6 | CSS Grid | 2h | Layout challenges |
| T7 | Practice | 2h | Build layouts |
| CN | Review | 1.5h | Flashcards |

#### Tuần 8: CSS Advanced

| Ngày | Topic | Thời gian | Resources |
|------|-------|-----------|-----------|
| T2 | Responsive Design | 2h | [03-html-css/04-responsive-design.md](./03-html-css/04-responsive-design.md) |
| T3 | CSS Architecture | 2h | [03-html-css/05-css-architecture.md](./03-html-css/05-css-architecture.md) |
| T4 | BEM, CSS Modules | 2h | Styling strategies |
| T5 | Animations | 2h | [03-html-css/06-animations-transitions.md](./03-html-css/06-animations-transitions.md) |
| T6 | Performance | 2h | Critical CSS, lazy loading |
| T7 | Project | 2h | Build responsive page |
| CN | Review | 2h | Month 2 completion |

---

## Tháng 3: React Deep Dive

### Tuần 9-10: React Core

#### Tuần 9: React Fundamentals & Hooks

| Ngày | Topic | Thời gian | Resources |
|------|-------|-----------|-----------|
| T2 | React Fundamentals | 2h | [04-react/01-react-fundamentals.md](./04-react/01-react-fundamentals.md) |
| T3 | JSX, Components | 2h | Props, composition |
| T4 | useState, useEffect | 2h | [04-react/02-hooks-deep-dive.md](./04-react/02-hooks-deep-dive.md) |
| T5 | useEffect Deep Dive | 2h | Dependencies, cleanup |
| T6 | useRef, useMemo | 2h | When to use each |
| T7 | useCallback | 2h | Optimization patterns |
| CN | Practice | 2h | Build components |

#### Tuần 10: React Advanced Hooks & State

| Ngày | Topic | Thời gian | Resources |
|------|-------|-----------|-----------|
| T2 | useReducer | 2h | Complex state |
| T3 | Custom Hooks | 2h | Extract logic |
| T4 | Context API | 2h | [04-react/03-state-management.md](./04-react/03-state-management.md) |
| T5 | State Management | 2h | Redux, Zustand patterns |
| T6 | Component Patterns | 2h | [04-react/04-component-patterns.md](./04-react/04-component-patterns.md) |
| T7 | HOC, Render Props | 2h | When to use |
| CN | Project | 2h | Build app with patterns |

---

### Tuần 11-12: React Advanced

#### Tuần 11: React Internals & Performance

| Ngày | Topic | Thời gian | Resources |
|------|-------|-----------|-----------|
| T2 | Virtual DOM | 2h | [04-react/05-react-internals.md](./04-react/05-react-internals.md) |
| T3 | React Fiber | 2h | Reconciliation |
| T4 | Concurrent Mode | 2h | Suspense, transitions |
| T5 | Performance | 2h | [04-react/06-performance-optimization.md](./04-react/06-performance-optimization.md) |
| T6 | React.memo, useMemo | 2h | When to optimize |
| T7 | Profiler | 2h | DevTools profiling |
| CN | Optimization Project | 2h | Optimize slow app |

#### Tuần 12: Next.js

| Ngày | Topic | Thời gian | Resources |
|------|-------|-----------|-----------|
| T2 | Next.js Fundamentals | 2h | [05-nextjs/01-nextjs-fundamentals.md](./05-nextjs/01-nextjs-fundamentals.md) |
| T3 | App Router | 2h | Pages vs App |
| T4 | Server Components | 2h | [05-nextjs/02-server-components.md](./05-nextjs/02-server-components.md) |
| T5 | RSC Deep Dive | 2h | 'use client' |
| T6 | Data Fetching | 2h | [05-nextjs/04-data-fetching.md](./05-nextjs/04-data-fetching.md) |
| T7 | SSR/SSG/ISR | 2h | [05-nextjs/03-rendering-strategies.md](./05-nextjs/03-rendering-strategies.md) |
| CN | Month 3 Review | 2h | Comprehensive review |

---

## Tháng 4: Browser, Networking, Security

### Tuần 13-14: Browser & Networking

#### Tuần 13: Browser Internals

| Ngày | Topic | Thời gian | Resources |
|------|-------|-----------|-----------|
| T2 | Browser Architecture | 2h | [06-browser/01-browser-architecture.md](./06-browser/01-browser-architecture.md) |
| T3 | Rendering Pipeline | 2h | [06-browser/02-rendering-pipeline.md](./06-browser/02-rendering-pipeline.md) |
| T4 | DOM, CSSOM, Render Tree | 2h | Critical rendering path |
| T5 | JavaScript Engine | 2h | [06-browser/03-javascript-engine.md](./06-browser/03-javascript-engine.md) |
| T6 | V8 Internals | 2h | JIT compilation |
| T7 | Browser Storage | 2h | [06-browser/04-browser-storage.md](./06-browser/04-browser-storage.md) |
| CN | DevTools Practice | 2h | [06-browser/06-devtools-mastery.md](./06-browser/06-devtools-mastery.md) |

#### Tuần 14: Networking

| Ngày | Topic | Thời gian | Resources |
|------|-------|-----------|-----------|
| T2 | HTTP Fundamentals | 2h | [07-networking/01-http-fundamentals.md](./07-networking/01-http-fundamentals.md) |
| T3 | HTTP Methods, Status | 2h | REST principles |
| T4 | REST API Design | 2h | [07-networking/02-rest-api-design.md](./07-networking/02-rest-api-design.md) |
| T5 | GraphQL | 2h | [07-networking/03-graphql-basics.md](./07-networking/03-graphql-basics.md) |
| T6 | WebSockets | 2h | [07-networking/04-websockets-realtime.md](./07-networking/04-websockets-realtime.md) |
| T7 | Caching, CDN | 2h | [07-networking/05-caching-cdn.md](./07-networking/05-caching-cdn.md) |
| CN | CORS Practice | 2h | [07-networking/06-cors-same-origin.md](./07-networking/06-cors-same-origin.md) |

---

### Tuần 15-16: Security

#### Tuần 15: Web Security

| Ngày | Topic | Thời gian | Resources |
|------|-------|-----------|-----------|
| T2 | XSS Types | 2h | [08-security/01-xss-prevention.md](./08-security/01-xss-prevention.md) |
| T3 | XSS Prevention | 2h | Sanitization, CSP |
| T4 | CSRF | 2h | [08-security/02-csrf-protection.md](./08-security/02-csrf-protection.md) |
| T5 | CSRF Tokens | 2h | SameSite cookies |
| T6 | Authentication | 2h | [08-security/03-authentication.md](./08-security/03-authentication.md) |
| T7 | JWT, OAuth | 2h | Session management |
| CN | Security Audit | 2h | Audit a sample app |

#### Tuần 16: Security Advanced & Month Review

| Ngày | Topic | Thời gian | Resources |
|------|-------|-----------|-----------|
| T2 | CSP Headers | 2h | [08-security/04-content-security-policy.md](./08-security/04-content-security-policy.md) |
| T3 | OWASP Top 10 | 2h | [08-security/05-security-best-practices.md](./08-security/05-security-best-practices.md) |
| T4 | Security Review | 2h | Practice scenarios |
| T5-CN | Month 4 Review | 8h | Comprehensive review |

---

## Tháng 5: System Design & Performance

### Tuần 17-18: Frontend System Design

#### Tuần 17: System Design Basics

| Ngày | Topic | Thời gian | Resources |
|------|-------|-----------|-----------|
| T2 | RADIO Framework | 2h | [11-system-design/01-system-design-framework.md](./11-system-design/01-system-design-framework.md) |
| T3 | Requirements Gathering | 2h | Practice questions |
| T4 | Architecture Patterns | 2h | [11-system-design/02-architecture-patterns.md](./11-system-design/02-architecture-patterns.md) |
| T5 | Micro-frontends | 2h | When to use |
| T6 | State at Scale | 2h | [11-system-design/03-state-management-scale.md](./11-system-design/03-state-management-scale.md) |
| T7 | Design Systems | 2h | [11-system-design/04-design-systems.md](./11-system-design/04-design-systems.md) |
| CN | Case Study | 2h | Design News Feed |

#### Tuần 18: System Design Practice

| Ngày | Topic | Thời gian | Resources |
|------|-------|-----------|-----------|
| T2 | Case: Twitter | 2h | [11-system-design/05-real-world-examples.md](./11-system-design/05-real-world-examples.md) |
| T3 | Case: E-commerce | 2h | Amazon-like frontend |
| T4 | Case: Chat App | 2h | Real-time system |
| T5 | Case: Video Player | 2h | Netflix-like |
| T6 | Case: Collaborative Editor | 2h | Google Docs-like |
| T7 | Practice | 2h | Mock design interview |
| CN | Review | 2h | Consolidate patterns |

---

### Tuần 19-20: Performance

#### Tuần 19: Performance Deep Dive

| Ngày | Topic | Thời gian | Resources |
|------|-------|-----------|-----------|
| T2 | Core Web Vitals | 2h | [09-performance/01-core-web-vitals.md](./09-performance/01-core-web-vitals.md) |
| T3 | LCP, INP, CLS | 2h | Measurement + optimization |
| T4 | Loading Optimization | 2h | [09-performance/02-loading-optimization.md](./09-performance/02-loading-optimization.md) |
| T5 | Code Splitting | 2h | Lazy loading |
| T6 | Runtime Performance | 2h | [09-performance/03-runtime-performance.md](./09-performance/03-runtime-performance.md) |
| T7 | Rendering Performance | 2h | [09-performance/04-rendering-performance.md](./09-performance/04-rendering-performance.md) |
| CN | Optimization Project | 2h | Optimize real app |

#### Tuần 20: Performance & Accessibility

| Ngày | Topic | Thời gian | Resources |
|------|-------|-----------|-----------|
| T2 | Bundle Optimization | 2h | [09-performance/05-bundle-optimization.md](./09-performance/05-bundle-optimization.md) |
| T3 | Performance Monitoring | 2h | [09-performance/06-performance-monitoring.md](./09-performance/06-performance-monitoring.md) |
| T4 | WCAG Fundamentals | 2h | [10-accessibility/01-wcag-fundamentals.md](./10-accessibility/01-wcag-fundamentals.md) |
| T5 | ARIA | 2h | [10-accessibility/02-aria-attributes.md](./10-accessibility/02-aria-attributes.md) |
| T6 | Keyboard Navigation | 2h | [10-accessibility/03-keyboard-navigation.md](./10-accessibility/03-keyboard-navigation.md) |
| T7 | A11y Testing | 2h | [10-accessibility/05-testing-accessibility.md](./10-accessibility/05-testing-accessibility.md) |
| CN | Month 5 Review | 2h | Comprehensive review |

---

## Tháng 6: Practice & Mock Interviews

### Tuần 21-22: Coding Intensive

#### Daily Schedule
```
Morning (2h):
- 1h: SRS Review (all accumulated cards)
- 1h: New coding problem

Afternoon/Evening (2h):
- 1h: Review solutions, patterns
- 1h: Second coding problem (different category)
```

#### Tuần 21: Algorithm Practice

| Ngày | Category | Problems |
|------|----------|----------|
| T2 | Array | Two Sum, 3Sum, Container With Most Water |
| T3 | String | Valid Parentheses, Longest Substring |
| T4 | Tree | BFS/DFS, Level Order, Max Depth |
| T5 | Graph | Number of Islands, Clone Graph |
| T6 | DP | Climbing Stairs, House Robber, Coin Change |
| T7 | Mixed | 3 random problems |
| CN | Review | All patterns from the week |

#### Tuần 22: Frontend-Specific Coding

| Ngày | Category | Problems |
|------|----------|----------|
| T2 | DOM | Build Modal, Tabs, Accordion |
| T3 | React | Todo App, Form with validation |
| T4 | Async | Fetch wrapper, Rate limiter |
| T5 | Utility | Debounce, Throttle, Deep clone |
| T6 | Component | Autocomplete, Virtual list |
| T7 | Mixed | 3 frontend problems |
| CN | Review | All implementations |

---

### Tuần 23-24: Mock Interviews

#### Tuần 23: Technical Mocks

| Ngày | Type | Duration | Focus |
|------|------|----------|-------|
| T2 | Coding | 1h | 2 LeetCode problems |
| T3 | Frontend Coding | 1h | React component |
| T4 | System Design | 1h | Design Twitter |
| T5 | JavaScript Deep | 45m | Event loop, closures |
| T6 | Coding | 1h | 2 problems |
| T7 | System Design | 1h | Design Chat App |
| CN | Full Mock | 3h | Complete loop |

#### Tuần 24: Final Preparation

| Ngày | Activity | Duration |
|------|----------|----------|
| T2 | Behavioral Prep | 2h | [13-behavioral/01-star-method.md](./13-behavioral/01-star-method.md) |
| T3 | Leadership Principles | 2h | [13-behavioral/02-leadership-principles.md](./13-behavioral/02-leadership-principles.md) |
| T4 | Company Research | 2h | Target company deep dive |
| T5 | Full Mock Interview | 4h | Technical + Behavioral |
| T6 | Weak Areas Review | 2h | Focus on gaps |
| T7 | Light Review | 1h | High-level concepts |
| CN | Rest | - | Mental preparation |

---

## Weekly Templates

### Standard Week Template

```markdown
## Week [X] - [Topic]

### Monday
- [ ] Morning: SRS Review (30min)
- [ ] New Topic Study (1.5h)
- [ ] Evening: Coding (1h)

### Tuesday
- [ ] Morning: SRS Review (30min)
- [ ] Continue Topic (1.5h)
- [ ] Evening: Coding (1h)

### Wednesday
- [ ] Morning: SRS Review (30min)
- [ ] New Topic (1.5h)
- [ ] Evening: Coding (1h)

### Thursday
- [ ] Morning: SRS Review (30min)
- [ ] Deep Dive (1.5h)
- [ ] Evening: Coding (1h)

### Friday
- [ ] Morning: SRS Review (30min)
- [ ] Practice/Project (1.5h)
- [ ] Evening: Coding (1h)

### Saturday
- [ ] Extended Practice (2h)
- [ ] Review Week (1h)

### Sunday
- [ ] Mock Interview/Case Study (2h)
- [ ] Create Flashcards (30min)
- [ ] Plan Next Week (30min)
```

---

## Progress Tracking

### Monthly Checkpoints

| Month | Checkpoint | Target |
|-------|------------|--------|
| 1 | JS Fundamentals Quiz | 80%+ score |
| 2 | TS + CSS Quiz | 80%+ score |
| 3 | React Mock Interview | Pass |
| 4 | Security/Network Quiz | 80%+ score |
| 5 | System Design Mock | Pass |
| 6 | Full Mock Interview | Offer-ready |

### Weekly Metrics

```markdown
## Week [X] Metrics

### Completed
- [ ] Topics studied: [X]/[Y]
- [ ] Coding problems: [X]
- [ ] Flashcards created: [X]
- [ ] Mock interviews: [X]

### Quality Check
- Can explain all topics in simple terms? Y/N
- Solved problems without hints? Y/N
- Identified weak areas: [list]

### Next Week Focus
- [Areas to improve]
```

---

## Common Pitfalls to Avoid

### 1. Burnout
```
❌ Study 8 hours/day from day 1
✅ Start with 2h, gradually increase

❌ Skip rest days
✅ Take at least 1 day off per week
```

### 2. Passive Learning
```
❌ Just read documentation
✅ Practice Active Recall after every session

❌ Watch tutorials without coding
✅ Code along, then redo without video
```

### 3. Skipping Fundamentals
```
❌ Jump to React without JS mastery
✅ Spend adequate time on foundations

❌ Memorize syntax without understanding
✅ Use Feynman technique for deep concepts
```

### 4. Inconsistent Practice
```
❌ Study intensely for 1 week, skip next week
✅ Consistent 2-3h daily is better than sporadic 8h

❌ Skip SRS reviews
✅ Never miss spaced repetition sessions
```

---

## Adjustment Guidelines

### If Behind Schedule
```
Option 1: Extend timeline
- Add 1-2 weeks to each month
- Better to learn well than rush

Option 2: Reduce scope
- Focus on most common topics
- Skip advanced topics temporarily

Option 3: Increase daily time
- Add 1h/day if sustainable
- Weekend catch-up sessions
```

### If Ahead of Schedule
```
Option 1: Deeper dive
- Explore advanced topics
- Read source code

Option 2: More practice
- Extra coding problems
- Additional mock interviews

Option 3: Early interviews
- Start applying sooner
- Get real interview experience
```

---

## Resources per Phase

### Month 1-2 (JavaScript/TypeScript)
- [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)
- [JavaScript.info](https://javascript.info)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)

### Month 3 (React)
- [React Documentation](https://react.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Overreacted (Dan Abramov's blog)](https://overreacted.io)

### Month 4 (Browser/Network)
- [How Browsers Work](https://web.dev/howbrowserswork/)
- [HTTP/2 in Action](https://www.manning.com/books/http2-in-action)

### Month 5 (System Design)
- [Frontend System Design](https://www.frontendinterviewhandbook.com/front-end-system-design)
- [GreatFrontend System Design](https://www.greatfrontend.com/front-end-system-design-playbook)

### Month 6 (Practice)
- [LeetCode](https://leetcode.com)
- [GreatFrontend](https://www.greatfrontend.com)
- [Pramp](https://www.pramp.com) (mock interviews)

---

> **Lưu ý cuối:** Kế hoạch này là hướng dẫn, không phải quy định cứng nhắc. Điều chỉnh theo tốc độ học và điểm mạnh/yếu của bạn. Quan trọng nhất là **consistency** - học đều đặn mỗi ngày sẽ hiệu quả hơn học dồn.
