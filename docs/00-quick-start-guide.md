# Quick Start Guide — Interview Preparation / Hướng Dẫn Bắt Đầu Nhanh

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **L5 Competencies**: All (entry point for full framework)
> **See also**: [Table of Contents](00-table-of-contents.md) | [6-Month Study Plan](00-6-month-study-plan.md) | [Learning Methodology](LEARNING-METHODOLOGY.md)

---

## Bạn Đang Ở Đâu? / Where Are You Now?

Trước khi bắt đầu, xác định level hiện tại để chọn đúng lộ trình:

| Level | Dấu hiệu / Signal | Bắt đầu từ đâu |
|-------|-------------------|----------------|
| 🟢 **L3 Junior** | Biết JS/React cơ bản, chưa hiểu sâu closures/prototypes, chưa quen phỏng vấn | **Level 1** — Foundation |
| 🟡 **L4 Mid** | Hiểu JS internals, viết React fluently, nhưng yếu system design + behavioral | **Level 2** — Intermediate |
| 🔴 **L5 Senior** | Technical strong, cần practice articulation, leadership stories, system design at scale | **Level 3** — Senior |

> Không chắc? Làm [L5 Self-Assessment](./shared/08-l5-competencies/00-l5-self-assessment.md) (khi có) hoặc thử trả lời: "Giải thích closure cho người không biết code" — nếu không trôi chảy, bắt đầu từ Level 1.

---

## Lộ Trình Theo Level / Study Path by Level

### Level 1: Foundation — Nền Tảng (4-6 weeks)

**Mục tiêu**: Nắm vững core concepts, có thể giải thích rõ ràng trong phỏng vấn.

| Week | Topic | Resources | Priority |
|------|-------|-----------|----------|
| 1-2 | JavaScript Core | [Variables & Types](./fe-track/01-javascript/02-variables-types.md), [Scope & Hoisting](./fe-track/01-javascript/03-scope-hoisting.md), [Closures](./fe-track/01-javascript/04-closures.md) | Critical |
| 2-3 | JS Advanced | [Prototypes](./fe-track/01-javascript/06-prototypes-inheritance.md), [this Keyword](./fe-track/01-javascript/05-this-keyword.md), [Event Loop](./fe-track/01-javascript/07-event-loop-async.md), [ES6+](./fe-track/01-javascript/08-es6-features.md) | Critical |
| 3-4 | TypeScript | [TS Basics](./fe-track/02-typescript/01-typescript-basics.md), [Type System](./fe-track/02-typescript/01-typescript-basics.md), [Advanced Types](./fe-track/02-typescript/02-advanced-types.md) | Critical |
| 4-5 | React | [Fundamentals](./fe-track/03-react/01-react-fundamentals.md), [Hooks Deep Dive](./fe-track/03-react/03-hooks-deep-dive.md), [State Management](./fe-track/03-react/05-state-management.md) | Critical |
| 5-6 | HTML/CSS | [HTML5 Fundamentals](./fe-track/05-html-css/00-html5-fundamentals.md), [CSS Fundamentals](./fe-track/05-html-css/00-css-fundamentals.md), [Flexbox & Grid](./fe-track/05-html-css/01-grid-flexbox.md) | High |

**LeetCode**: [Easy problems](./leetcode/00-patterns-index.md) — Two Pointers, Hash Map, Stack patterns (30 problems)

**Deliverable**: Giải thích được event loop, closure, prototype chain, React hooks cho interviewer.

---

### Level 2: Intermediate — Trung Cấp (4-6 weeks)

**Mục tiêu**: Hiểu internals, trade-offs, có thể debug và optimize.

| Week | Topic | Resources | Priority |
|------|-------|-----------|----------|
| 1-2 | Advanced React | [Advanced Patterns](./fe-track/03-react/04-advanced-patterns.md), [React 19](./fe-track/03-react/02-react-19-features.md), [Performance](./fe-track/03-react/09-performance-optimization.md) | Critical |
| 2-3 | Next.js | [Fundamentals](./fe-track/04-nextjs/00-nextjs-fundamentals.md), [App Router & RSC](./fe-track/04-nextjs/01-app-router-server-components.md), [Data Fetching](./fe-track/04-nextjs/02-data-fetching.md) | Critical |
| 3-4 | Browser & Performance | [Core Web Vitals](./fe-track/06-browser-performance/01-core-web-vitals.md), [React Performance](./fe-track/06-browser-performance/02-react-performance.md), [Web Performance](./fe-track/06-browser-performance/04-web-performance-comprehensive.md) | Critical |
| 4-5 | Security & Networking | [Web Security](./fe-track/07-web-security/01-common-vulnerabilities.md), [Authentication](./fe-track/07-web-security/02-authentication.md) | High |
| 5-6 | CS Fundamentals | [Data Structures](./shared/01-cs-fundamentals/data-structures-theory.md), [Algorithms](./shared/01-cs-fundamentals/algorithms-theory.md), [Complexity](./shared/01-cs-fundamentals/complexity-analysis.md) | High |

**LeetCode**: [Medium problems](./leetcode/00-patterns-index.md) — Sliding Window, Binary Search, BFS/DFS, DP basics (50 problems)

**Deliverable**: Optimize một React app từ 30fps → 60fps, giải thích Critical Rendering Path, design component APIs.

---

### Level 3: Senior — Cấp Cao (4-6 weeks)

**Mục tiêu**: Architect systems, articulate decisions, demonstrate leadership.

| Week | Topic | Resources | Priority |
|------|-------|-----------|----------|
| 1-2 | FE System Design | [Architecture Patterns](./fe-track/08-fe-system-design/01-architecture-patterns.md), [Scalability](./fe-track/08-fe-system-design/02-scalability.md) | Critical |
| 2-3 | System Design Theory | [System Design](./shared/02-system-design/system-design-theory.md), [Caching](./shared/02-system-design/caching-patterns.md), [Load Balancing](./shared/02-system-design/06-load-balancing.md) | Critical |
| 3-4 | Advanced Topics | [Browser Internals](./fe-track/09-advanced-topics/browser-internals/), [Expert Topics](./fe-track/09-advanced-topics/expert-topics/) | High |
| 4-5 | Behavioral & Leadership | [STAR Method](./shared/09-behavioral/01-star-method.md), [Leadership](./shared/09-behavioral/02-leadership-principles.md), [Storytelling](./shared/09-behavioral/04-storytelling.md) | Critical |
| 5-6 | Mock Interviews | [Interview Practice](./fe-track/09-advanced-topics/interview-practice/), [Common Questions](./shared/09-behavioral/03-common-questions.md) | Critical |

**LeetCode**: [Hard problems](./leetcode/00-patterns-index.md) — Advanced DP, Design, all Hard problems (30+ problems)

**Deliverable**: Design a frontend system (e.g., Slack FE) trong 45 phút, dẫn dắt cuộc phỏng vấn behavioral với STAR stories thuyết phục.

---

## L5 Competency Coverage / Năng Lực L5

Repo này cover 10 competencies theo framework L5 Senior Engineer:

| # | Competency | Weight | Where to Study |
|---|-----------|--------|---------------|
| 1 | Scope & Impact | 15pts | [FE System Design](./fe-track/08-fe-system-design/), [L5 Competencies](./shared/08-l5-competencies/) |
| 2 | Problem-Solving | 15pts | [LeetCode Patterns](./leetcode/00-patterns-index.md), [Algorithms](./shared/01-cs-fundamentals/) |
| 3 | Technical Mastery | 20pts | [JavaScript](./fe-track/01-javascript/), [React](./fe-track/03-react/), [TypeScript](./fe-track/02-typescript/) |
| 4 | Communication | 10pts | [Storytelling](./shared/09-behavioral/04-storytelling.md), [L5 Competencies](./shared/08-l5-competencies/) |
| 5 | Leadership | 10pts | [Leadership Principles](./shared/09-behavioral/02-leadership-principles.md) |
| 6 | Ownership | 10pts | [STAR Method](./shared/09-behavioral/01-star-method.md) |
| 7 | Quality & Risk | 10pts | [Testing](./shared/05-software-engineering/04-testing-theory.md), [Security](./shared/04-security/) |
| 8 | Team Multiplier | 5pts | [Design Patterns](./shared/05-software-engineering/01-solid-and-design-patterns.md) |
| 9 | Behaviour | 3pts | [Common Questions](./shared/09-behavioral/03-common-questions.md) |
| 10 | Business Awareness | 2pts | [Company Guides](./shared/07-company-guides/) |

---

## Company-Specific Focus / Trọng Tâm Theo Công Ty

| Company | Key Focus Areas | Guide |
|---------|----------------|-------|
| Google | Algorithms (Hard), Browser Internals, System Design at Scale | [Google Guide](./shared/07-company-guides/01-google.md) |
| Microsoft | TypeScript, Accessibility, Design Patterns | [Microsoft Guide](./shared/07-company-guides/02-microsoft.md) |
| Grab | Algorithms (Very Hard), State Management, SEA-Scale System Design | [Grab Guide](./shared/07-company-guides/03-grab.md) |
| Axon | CSS Quality, Testing, Accessibility | [Axon Guide](./shared/07-company-guides/04-axon.md) |
| Employment Hero | TypeScript Depth, Next.js, Testing | [EH Guide](./shared/07-company-guides/05-employment-hero.md) |
| Zalo/VNG | JavaScript Deep, Performance, Practical Problems | [Zalo Guide](./shared/07-company-guides/06-zalo-vng.md) |

---

## Interview Types / Các Vòng Phỏng Vấn

### 1. Coding Round (45-60 min)
**Prep**: [LeetCode Patterns Index](./leetcode/00-patterns-index.md) — learn pattern recognition, not memorization.

### 2. Frontend Coding (60-90 min)
**Prep**: [Coding Practice](./fe-track/13-coding-practice/) — debounce, virtual scroll, form validation, state management.

### 3. System Design (45-60 min)
**Prep**: [FE System Design](./fe-track/08-fe-system-design/) + [Interview Practice](./fe-track/09-advanced-topics/interview-practice/).

### 4. Behavioral (30-45 min)
**Prep**: [STAR Method](./shared/09-behavioral/01-star-method.md) + [Common Questions](./shared/09-behavioral/03-common-questions.md).

---

## How to Use This Repo / Cách Dùng Repo Này

1. **Xác định level** → dùng bảng "Bạn Đang Ở Đâu?" ở trên
2. **Chọn lộ trình** → Level 1, 2, hoặc 3
3. **Học theo file** → mỗi file có Real-World Scenario → Theory → Q&A → Self-Check
4. **Tự kiểm tra** → đóng file, viết lại từ trí nhớ (Self-Check cuối mỗi file)
5. **Ôn tập** → Spaced Repetition: 3 ngày → 7 ngày → 14 ngày
6. **Practice** → LeetCode theo pattern, không theo random

**Learning methodology chi tiết**: [LEARNING-METHODOLOGY.md](LEARNING-METHODOLOGY.md)

---

## Navigation / Điều Hướng

- [Table of Contents](00-table-of-contents.md) — full index mọi file
- [6-Month Study Plan](00-6-month-study-plan.md) — lộ trình chi tiết theo tháng
- [FE Study Roadmap](./fe-track/00-study-roadmap.md) — FE-specific roadmap
- [BE Study Roadmap](./be-track/00-study-roadmap.md) — BE-specific roadmap
- [LeetCode Patterns](./leetcode/00-patterns-index.md) — 133 problems by pattern
- [Learning Methodology](LEARNING-METHODOLOGY.md) — evidence-based study methods
- [Quick Reference Cheat Sheet](quick-reference-cheat-sheet.md) — interview day quick lookup

---

[Start Learning → JavaScript Fundamentals](./fe-track/01-javascript/02-variables-types.md)
