# 6-Month Frontend Interview Study Plan — Lộ Trình Học 6 Tháng


> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](00-table-of-contents.md)

> Dành cho vị trí Frontend Developer (2-5 năm kinh nghiệm) tại các công ty tech hàng đầu.
> Target: Google, Microsoft, Grab, Axon, Employment Hero, Zalo/VNG

---

## 📅 Tổng Quan / Overview

| Tháng   | Giai Đoạn             | Trọng Tâm                                |
| ------- | --------------------- | ---------------------------------------- |
| Month 1 | Foundation            | JavaScript Fundamentals, HTML/CSS        |
| Month 2 | Framework             | TypeScript, React Core                   |
| Month 3 | Advanced              | Next.js, State Management                |
| Month 4 | Performance & Browser | Browser Internals, Performance, Security |
| Month 5 | System Design         | FE System Design, Architecture Patterns  |
| Month 6 | Practice & Review     | LeetCode, Behavioral, Mock Interviews    |

---

## 📚 Chi Tiết Từng Giai Đoạn

### Month 1: Foundation — Nền Tảng

**Mục tiêu:** Nắm vững JavaScript core concepts (80% câu hỏi FE interview)

| Tuần | Chủ đề             | Tài liệu                                                                          | Mức độ      |
| ---- | ------------------ | --------------------------------------------------------------------------------- | ----------- |
| 1-2  | JavaScript Basics  | [Variables & Data Types](./fe-track/01-javascript/01-variables-data-types.md)     | 🔴 Critical |
|      |                    | [Scope & Hoisting](./fe-track/01-javascript/02-scope-hoisting.md)                 | 🔴 Critical |
|      |                    | [Closures](./fe-track/01-javascript/03-closures.md)                               | 🔴 Critical |
| 3    | Advanced JS        | [Prototypes & Inheritance](./fe-track/01-javascript/04-prototypes-inheritance.md) | 🔴 Critical |
|      |                    | [this Keyword](./fe-track/01-javascript/05-this-keyword.md)                       | 🔴 Critical |
| 4    | Async & Event Loop | [Event Loop & Async](./fe-track/01-javascript/06-event-loop-async.md)             | 🔴 Critical |
|      |                    | [ES6+ Features](./fe-track/01-javascript/07-es6-features.md)                      | 🔴 Critical |

**✅ Deliverable cuối tháng:** Giải thích được event loop, closure, prototype chain

---

### Month 2: Framework — Framework Chính

**Mục tiêu:** Thành thạo TypeScript + React

| Tuần | Chủ đề             | Tài liệu                                                              | Mức độ      |
| ---- | ------------------ | --------------------------------------------------------------------- | ----------- |
| 5    | TypeScript Basics  | [TypeScript Basics](./fe-track/02-typescript/01-typescript-basics.md) | 🔴 Critical |
|      |                    | [Type System](./fe-track/02-typescript/01-type-system-basics.md)      | 🔴 Critical |
| 6    | Advanced TS        | [Advanced Types](./fe-track/02-typescript/02-advanced-types.md)       | 🔴 Critical |
|      |                    | [Generics](./fe-track/02-typescript/03-generics-deep-dive.md)         | 🔴 Critical |
| 7    | React Fundamentals | [React Fundamentals](./fe-track/03-react/01-react-fundamentals.md)    | 🔴 Critical |
| 8    | React Hooks        | [Hooks Deep Dive](./fe-track/03-react/03-hooks-deep-dive.md)          | 🔴 Critical |

**✅ Deliverable cuối tháng:** Viết được React component với TypeScript, giải thích được useEffect dependency array

---

### Month 3: Advanced Framework — Framework Nâng Cao

**Mục tiêu:** Next.js, State Management, Advanced Patterns

| Tuần | Chủ đề            | Tài liệu                                                            | Mức độ      |
| ---- | ----------------- | ------------------------------------------------------------------- | ----------- |
| 9    | Next.js           | [Next.js Basics](./fe-track/04-nextjs/00-nextjs-fundamentals.md)          | 🔴 Critical |
|      |                   | [App Router](./fe-track/04-nextjs/01-app-router-server-components.md)                 | 🔴 Critical |
| 10   | State Management  | [State Management](./fe-track/03-react/05-state-management.md)      | 🟡 High     |
|      |                   | [React Context](./fe-track/03-react/05-state-management.md#context) | 🟡 High     |
| 11   | Advanced Patterns | [Advanced Patterns](./fe-track/03-react/04-advanced-patterns.md)    | 🟡 High     |
| 12   | React 19          | [React 19 Features](./fe-track/03-react/02-react-19-features.md)    | 🟡 High     |

**✅ Deliverable cuối tháng:** Build được một Next.js app với App Router, implement được custom hook

---

### Month 4: Performance & Browser

**Mục tiêu:** Hiểu sâu browser internals, optimize performance

| Tuần | Chủ đề            | Tài liệu                                                                                     | Mức độ      |
| ---- | ----------------- | -------------------------------------------------------------------------------------------- | ----------- |
| 13   | Browser Internals | [Browser Architecture](./fe-track/06-browser-performance/01-core-web-vitals.md)         | 🔴 Critical |
|      |                   | [Rendering Pipeline](./fe-track/06-browser-performance/02-react-performance.md)             | 🔴 Critical |
| 14   | Performance       | [Core Web Vitals](./fe-track/06-browser-performance/03-bundle-optimization.md)                   | 🔴 Critical |
|      |                   | [Performance Optimization](./fe-track/06-browser-performance/04-web-performance-comprehensive.md) | 🔴 Critical |
| 15   | Security          | [Web Security](./fe-track/07-web-security/01-common-vulnerabilities.md)                      | 🔴 Critical |
|      |                   | [Authentication](./fe-track/07-web-security/02-authentication.md)                            | 🟡 High     |
| 16   | Networking        | [HTTP Fundamentals](./fe-track/10-networking/01-http-fundamentals.md)                        | 🔴 Critical |
|      |                   | [Caching](./fe-track/10-networking/02-rest-api-design.md)                                 | 🟡 High     |

**✅ Deliverable cuối tháng:** Optimize được một page từ 60fps lên 60fps, giải thích được Critical Rendering Path

---

### Month 5: System Design

**Mục tiêu:** Thiết kế hệ thống frontend quy mô lớn

| Tuần | Chủ đề                  | Tài liệu                                                                              | Mức độ      |
| ---- | ----------------------- | ------------------------------------------------------------------------------------- | ----------- |
| 17   | FE System Design Basics | [FE System Design](./fe-track/08-fe-system-design/01-architecture-patterns.md)                 | 🔴 Critical |
|      |                         | [Component Architecture](./fe-track/08-fe-system-design/02-scalability.md) | 🔴 Critical |
| 18   | Design Patterns         | [State Management Design](./fe-track/08-fe-system-design/03-caching.md)      | 🟡 High     |
|      |                         | [Performance Patterns](./fe-track/08-fe-system-design/04-microservices.md)     | 🟡 High     |
| 19   | Scalability             | [Scalability Patterns](./fe-track/08-fe-system-design/05-database-design.md)              | 🟡 High     |
| 20   | Real-world Examples     | [Design Examples](./fe-track/08-fe-system-design/)                                    | 🟡 High     |

**✅ Deliverable cuối tháng:** Design được một hệ thống như Twitter timeline, YouTube player

---

### Month 6: Practice & Review

**Mục tiêu:** Luyện tập + Chuẩn bị phỏng vấn behavior

| Tuần  | Chủ đề          | Tài liệu                                                                      | Mức độ      |
| ----- | --------------- | ----------------------------------------------------------------------------- | ----------- |
| 21-22 | LeetCode        | [Array](./leetcode/array/)                                                    | 🔴 Critical |
|       |                 | [String](./leetcode/string/)                                                  | 🔴 Critical |
|       |                 | [Tree/Graph](./leetcode/tree-graph/)                                          | 🔴 Critical |
|       |                 | [DP](./leetcode/dp/)                                                          | 🟡 High     |
| 23    | Coding Practice | [Coding Problems](./fe-track/13-coding-practice/)                             | 🔴 Critical |
| 24    | Behavioral      | [STAR Method](./fe-track/12-behavioral/01-star-method.md)                     | 🔴 Critical |
|       |                 | [Leadership Principles](./fe-track/12-behavioral/02-leadership-principles.md) | 🔴 Critical |
|       |                 | [Common Questions](./fe-track/12-behavioral/03-common-questions.md)           | 🔴 Critical |

**✅ Deliverable cuối tháng:** Giải được 50+ LeetCode problems, có 5+ STAR stories chuẩn bị

---

## 🎯 Weekly Checklist / Checklist Hàng Tuần

- [ ] Hoàn thành tài liệu theo kế hoạch
- [ ] Làm bài tập thực hành (coding problems)
- [ ] Review lại concepts đã học cuối tuần
- [ ] Ghi chú các câu hỏi phỏng vấn liên quan
- [ ] Practice giải thích toàn bộ topic đã học (zoom/friend)

---

## 📊 Progress Tracking

| Tháng | Mục tiêu hoàn thành       | Thực tế | Gap |
| ----- | ------------------------- | ------- | --- |
| 1     | JS Fundamentals           | [ ]     |     |
| 2     | TypeScript + React        | [ ]     |     |
| 3     | Next.js + State           | [ ]     |     |
| 4     | Browser + Perf + Security | [ ]     |     |
| 5     | System Design             | [ ]     |     |
| 6     | LeetCode + Behavioral     | [ ]     |     |

---

## 🔗 Quick Links

- [Frontend Study Roadmap](./fe-track/00-study-roadmap.md)
- [Company Guides](./fe-track/10-company-guide.md)
- [Interview Checklist](./fe-track/12-behavioral/01-star-method.md)
- [Quick Reference Cheat Sheet](./quick-reference-cheat-sheet.md)
