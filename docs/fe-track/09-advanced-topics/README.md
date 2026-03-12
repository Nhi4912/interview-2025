# Frontend Advanced Topics Index / Mục Lục Chủ Đề Nâng Cao Frontend

## 1) Overview / Tổng Quan

This section is the **senior-level knowledge map** for frontend interview preparation.

Phần này là **bản đồ kiến thức cấp senior** cho lộ trình ôn phỏng vấn frontend.

It focuses on algorithmic thinking, browser internals, architecture decisions, performance, security, and expert-level system design topics commonly discussed at top tech companies.

Nội dung tập trung vào tư duy thuật toán, nội tại trình duyệt, quyết định kiến trúc, hiệu năng, bảo mật, và thiết kế hệ thống cấp cao — những chủ đề thường xuất hiện ở các công ty công nghệ hàng đầu.

**Target audience / Đối tượng:** Senior Frontend Engineers (or strong Mid-level aiming for Senior) targeting companies like Zalo, VNG, Grab, Axon, Employment Hero, Microsoft, Google.

**How to use / Cách sử dụng:**

- Read by dependency order first (Section 3).
- Đọc theo thứ tự phụ thuộc trước (Mục 3).
- Use this index as a navigation hub, then deep-dive per file.
- Dùng README này như hub điều hướng, sau đó đi sâu từng file.

---

## 2) Topic Map / Bản Đồ Chủ Đề

> Source scope: all `.md` files under `docs/fe-track/09-advanced-topics/` (excluding this README).

### A) Data Structures & Algorithms

| File                                                                           | Focus (EN)                        | Trọng tâm (VI)                          |
| ------------------------------------------------------------------------------ | --------------------------------- | --------------------------------------- |
| [01-data-structures-js.md](./01-data-structures-js.md)                         | Core DS for JS interviews         | Cấu trúc dữ liệu cốt lõi với JavaScript |
| [01b-data-structures-comprehensive.md](./01b-data-structures-comprehensive.md) | Extended DS coverage              | Bao quát DS mở rộng                     |
| [02-algorithms-js.md](./02-algorithms-js.md)                                   | Core algorithm patterns           | Mẫu thuật toán nền tảng                 |
| [04-graph-algorithms.md](./04-graph-algorithms.md)                             | Graph traversal and shortest path | Duyệt đồ thị và đường đi ngắn nhất      |
| [05-tree-algorithms.md](./05-tree-algorithms.md)                               | Tree recursion and traversal      | Đệ quy và duyệt cây                     |

### B) Browser & Web APIs

| File                                                                                   | Focus (EN)                      | Trọng tâm (VI)                 |
| -------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------ |
| [00-web-apis-fundamentals.md](./00-web-apis-fundamentals.md)                           | Web API fundamentals            | Nền tảng Web APIs              |
| [01-browser-apis.md](./01-browser-apis.md)                                             | Browser API landscape           | Tổng quan Browser APIs         |
| [02-fetch-http.md](./02-fetch-http.md)                                                 | Fetch lifecycle, HTTP semantics | Vòng đời Fetch, ngữ nghĩa HTTP |
| [03-websockets.md](./03-websockets.md)                                                 | Realtime communication          | Giao tiếp realtime             |
| [05-dom-manipulation-theory.md](./05-dom-manipulation-theory.md)                       | DOM manipulation theory         | Lý thuyết thao tác DOM         |
| [06-browser-architecture-theory.md](./06-browser-architecture-theory.md)               | Browser pipeline architecture   | Kiến trúc pipeline trình duyệt |
| [07-browser-networking-theory.md](./07-browser-networking-theory.md)                   | Networking inside browser       | Mạng trong trình duyệt         |
| [09-modern-web-apis-theory.md](./09-modern-web-apis-theory.md)                         | Modern API capabilities         | Năng lực API web hiện đại      |
| [04-browser-architecture-comprehensive.md](./04-browser-architecture-comprehensive.md) | Browser internals deep dive     | Đi sâu nội tại trình duyệt     |

### C) Design Patterns

| File                                                                                                       | Focus (EN)                | Trọng tâm (VI)                      |
| ---------------------------------------------------------------------------------------------------------- | ------------------------- | ----------------------------------- |
| [03-design-patterns-ts.md](./03-design-patterns-ts.md)                                                     | Design patterns in TS     | Design patterns với TypeScript      |
| [18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)   | Advanced pattern theory   | Lý thuyết pattern nâng cao          |
| [17-frontend-theory-09-state-management-patterns.md](./17-frontend-theory-09-state-management-patterns.md) | State patterns in FE apps | Mẫu quản lý state trong ứng dụng FE |

### D) Theory Deep Dives

| File                                                             | Focus (EN)                        | Trọng tâm (VI)                           |
| ---------------------------------------------------------------- | --------------------------------- | ---------------------------------------- |
| [05-dom-manipulation-theory.md](./05-dom-manipulation-theory.md) | DOM cost model, mutation strategy | Mô hình chi phí DOM, chiến lược mutation |
| [06-memory-management-js.md](./06-memory-management-js.md)       | GC, leaks, references             | GC, memory leak, tham chiếu              |
| [07-compiler-theory-js.md](./07-compiler-theory-js.md)           | Parser/AST/transform pipeline     | Pipeline parser/AST/biến đổi             |
| [08-concurrency-js.md](./08-concurrency-js.md)                   | Event loop, tasks, workers        | Event loop, task, worker                 |
| [08-web-performance-theory.md](./08-web-performance-theory.md)   | Rendering and performance model   | Mô hình render và hiệu năng              |

### E) Interview Practice

| File                                                                                                                   | Focus (EN)                   | Trọng tâm (VI)               |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ---------------------------- |
| [11-interview-practice-01-javascript-challenges.md](./11-interview-practice-01-javascript-challenges.md)               | JS challenge set A           | Bộ bài JS A                  |
| [11-interview-practice-01-javascript-coding-challenges.md](./11-interview-practice-01-javascript-coding-challenges.md) | JS coding challenge set B    | Bộ bài JS code B             |
| [11-interview-practice-02-react-challenges.md](./11-interview-practice-02-react-challenges.md)                         | React challenge set A        | Bộ bài React A               |
| [11-interview-practice-02-react-coding-challenges.md](./11-interview-practice-02-react-coding-challenges.md)           | React coding challenge set B | Bộ bài React code B          |
| [11-interview-practice-03-system-design-questions.md](./11-interview-practice-03-system-design-questions.md)           | FE system design prompts     | Câu hỏi thiết kế hệ thống FE |
| [11-interview-practice-04-coding-patterns.md](./11-interview-practice-04-coding-patterns.md)                           | Reusable coding templates    | Mẫu code tái sử dụng         |
| [11-interview-practice-05-behavioral-questions.md](./11-interview-practice-05-behavioral-questions.md)                 | Behavioral interview prep    | Chuẩn bị phỏng vấn hành vi   |
| [11-interview-practice-06-frontend-system-design.md](./11-interview-practice-06-frontend-system-design.md)             | End-to-end FE design rounds  | Vòng thiết kế FE end-to-end  |

### F) Visual Learning

| File                                                                                                     | Focus (EN)                    | Trọng tâm (VI)                 |
| -------------------------------------------------------------------------------------------------------- | ----------------------------- | ------------------------------ |
| [12-visual-learning-01-javascript-concepts-map.md](./12-visual-learning-01-javascript-concepts-map.md)   | JS concept map                | Bản đồ khái niệm JS            |
| [12-visual-learning-02-algorithm-visualizations.md](./12-visual-learning-02-algorithm-visualizations.md) | Algorithm visual walkthroughs | Diễn giải thuật toán trực quan |
| [12-visual-learning-03-frontend-concepts-visual.md](./12-visual-learning-03-frontend-concepts-visual.md) | FE architecture visuals       | Minh hoạ kiến trúc FE          |

### G) Tools & Ecosystem

| File                                                                                                                       | Focus (EN)                   | Trọng tâm (VI)                    |
| -------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | --------------------------------- |
| [13-tools-ecosystem-01-build-tools.md](./13-tools-ecosystem-01-build-tools.md)                                             | Bundlers and build pipelines | Bundler và pipeline build         |
| [13-tools-ecosystem-02-package-managers.md](./13-tools-ecosystem-02-package-managers.md)                                   | npm/pnpm/yarn strategy       | Chiến lược npm/pnpm/yarn          |
| [13-tools-ecosystem-03-version-control.md](./13-tools-ecosystem-03-version-control.md)                                     | Git workflows for teams      | Workflow Git cho team             |
| [13-tools-ecosystem-04-testing-tools.md](./13-tools-ecosystem-04-testing-tools.md)                                         | Unit/integration/e2e tooling | Công cụ test unit/integration/e2e |
| [13-tools-ecosystem-05-modern-development-tools.md](./13-tools-ecosystem-05-modern-development-tools.md)                   | Modern FE dev tooling        | Bộ công cụ FE hiện đại            |
| [13-tools-ecosystem-06-development-tools-advanced-theory.md](./13-tools-ecosystem-06-development-tools-advanced-theory.md) | Toolchain theory             | Lý thuyết toolchain               |
| [13-tools-ecosystem-07-tools-interview-questions.md](./13-tools-ecosystem-07-tools-interview-questions.md)                 | Tooling interview Q&A        | Q&A phỏng vấn về tooling          |
| [13-tools-ecosystem-08-tools-practical-applications.md](./13-tools-ecosystem-08-tools-practical-applications.md)           | Real-world tool applications | Ứng dụng tooling thực tế          |

### H) Accessibility

| File                                                                                     | Focus (EN)                 | Trọng tâm (VI)             |
| ---------------------------------------------------------------------------------------- | -------------------------- | -------------------------- |
| [14-accessibility-01-wcag-guidelines.md](./14-accessibility-01-wcag-guidelines.md)       | WCAG principles            | Nguyên tắc WCAG            |
| [14-accessibility-02-aria-comprehensive.md](./14-accessibility-02-aria-comprehensive.md) | ARIA patterns and pitfalls | Mẫu ARIA và lỗi thường gặp |

### I) Advanced Topics

| File                                                                                                           | Focus (EN)                 | Trọng tâm (VI)             |
| -------------------------------------------------------------------------------------------------------------- | -------------------------- | -------------------------- |
| [15-advanced-topics-01-http-protocols-theory.md](./15-advanced-topics-01-http-protocols-theory.md)             | HTTP/1.1–3 deep dive       | Đi sâu HTTP/1.1–3          |
| [15-advanced-topics-02-cryptography-theory.md](./15-advanced-topics-02-cryptography-theory.md)                 | Crypto primitives in web   | Nguyên hàm mật mã trên web |
| [15-advanced-topics-03-api-design-theory.md](./15-advanced-topics-03-api-design-theory.md)                     | API contract and evolution | Hợp đồng API và tiến hoá   |
| [15-advanced-topics-04-reactive-programming-theory.md](./15-advanced-topics-04-reactive-programming-theory.md) | Reactive flow modeling     | Mô hình hoá luồng reactive |
| [15-advanced-topics-05-progressive-web-apps-theory.md](./15-advanced-topics-05-progressive-web-apps-theory.md) | PWA architecture           | Kiến trúc PWA              |
| [15-advanced-topics-06-module-systems-theory.md](./15-advanced-topics-06-module-systems-theory.md)             | ESM/CJS/module graph       | ESM/CJS/đồ thị module      |
| [15-advanced-topics-07-state-machines-theory.md](./15-advanced-topics-07-state-machines-theory.md)             | FSM/statecharts            | FSM/statecharts            |
| [15-advanced-topics-08-webassembly-theory.md](./15-advanced-topics-08-webassembly-theory.md)                   | WASM architecture          | Kiến trúc WebAssembly      |
| [15-advanced-topics-09-graphql-advanced-theory.md](./15-advanced-topics-09-graphql-advanced-theory.md)         | Advanced GraphQL patterns  | Mẫu GraphQL nâng cao       |

### J) Theoretical Foundations (16-\*)

> NOTE: these files are now cross-reference stubs to shared fundamentals.

| File                                                                                                                               | Stub Target Theme          | Chủ đề chuyển hướng              |
| ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | -------------------------------- |
| [16-theoretical-foundations-01-computer-science-fundamentals.md](./16-theoretical-foundations-01-computer-science-fundamentals.md) | CS fundamentals            | Nền tảng khoa học máy tính       |
| [16-theoretical-foundations-02-computational-theory.md](./16-theoretical-foundations-02-computational-theory.md)                   | Computation theory         | Lý thuyết tính toán              |
| [16-theoretical-foundations-03-type-theory.md](./16-theoretical-foundations-03-type-theory.md)                                     | Type systems               | Hệ kiểu dữ liệu                  |
| [16-theoretical-foundations-04-category-theory.md](./16-theoretical-foundations-04-category-theory.md)                             | Category theory            | Lý thuyết phạm trù               |
| [16-theoretical-foundations-05-logic-proof-theory.md](./16-theoretical-foundations-05-logic-proof-theory.md)                       | Logic and proof            | Logic và chứng minh              |
| [16-theoretical-foundations-06-formal-verification.md](./16-theoretical-foundations-06-formal-verification.md)                     | Verification methods       | Phương pháp kiểm chứng hình thức |
| [16-theoretical-foundations-07-distributed-systems-theory.md](./16-theoretical-foundations-07-distributed-systems-theory.md)       | Distributed systems theory | Lý thuyết hệ phân tán            |
| [16-theoretical-foundations-08-quantum-computing-theory.md](./16-theoretical-foundations-08-quantum-computing-theory.md)           | Quantum computing basics   | Nền tảng điện toán lượng tử      |
| [16-theoretical-foundations-09-complexity-theory-advanced.md](./16-theoretical-foundations-09-complexity-theory-advanced.md)       | Complexity classes         | Lớp độ phức tạp                  |

### K) Frontend Theory (17-\*)

| File                                                                                                                   | Focus (EN)                   | Trọng tâm (VI)              |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------- | --------------------------- |
| [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)           | JS language semantics        | Ngữ nghĩa ngôn ngữ JS       |
| [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)               | Rendering pipeline           | Pipeline render             |
| [17-frontend-theory-03-react-fundamentals-theory.md](./17-frontend-theory-03-react-fundamentals-theory.md)             | React conceptual model       | Mô hình khái niệm React     |
| [17-frontend-theory-04-react-hooks-advanced.md](./17-frontend-theory-04-react-hooks-advanced.md)                       | Advanced hook patterns       | Mẫu hooks nâng cao          |
| [17-frontend-theory-05-javascript-engine-internals.md](./17-frontend-theory-05-javascript-engine-internals.md)         | Engine internals             | Nội tại JS engine           |
| [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)       | Optimization strategies      | Chiến lược tối ưu hiệu năng |
| [17-frontend-theory-07-modern-css-architecture.md](./17-frontend-theory-07-modern-css-architecture.md)                 | CSS architecture systems     | Hệ thống kiến trúc CSS      |
| [17-frontend-theory-08-typescript-advanced-patterns.md](./17-frontend-theory-08-typescript-advanced-patterns.md)       | TS advanced patterns         | Mẫu TS nâng cao             |
| [17-frontend-theory-09-state-management-patterns.md](./17-frontend-theory-09-state-management-patterns.md)             | State management patterns    | Mẫu quản lý state           |
| [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)                 | State management theory      | Lý thuyết quản lý state     |
| [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)               | Async/concurrency model      | Mô hình async/concurrency   |
| [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)                               | Rendering strategy tradeoffs | Đánh đổi chiến lược render  |
| [17-frontend-theory-12-http-networking-theory.md](./17-frontend-theory-12-http-networking-theory.md)                   | HTTP/network deep dive       | Đi sâu HTTP/network         |
| [17-frontend-theory-13-event-driven-architecture.md](./17-frontend-theory-13-event-driven-architecture.md)             | Event-driven FE architecture | Kiến trúc FE hướng sự kiện  |
| [17-frontend-theory-14-functional-reactive-programming.md](./17-frontend-theory-14-functional-reactive-programming.md) | FRP mindset                  | Tư duy FRP                  |
| [17-frontend-theory-15-memory-management-deep-dive.md](./17-frontend-theory-15-memory-management-deep-dive.md)         | Memory deep dive             | Đi sâu quản lý bộ nhớ       |
| [17-frontend-theory-16-web-workers-concurrency.md](./17-frontend-theory-16-web-workers-concurrency.md)                 | Worker-based concurrency     | Concurrency với Web Workers |

### L) Advanced Theory (18-\*)

| File                                                                                                             | Focus (EN)                   | Trọng tâm (VI)                 |
| ---------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------ |
| [18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)         | Compiler design for FE tools | Thiết kế compiler cho FE tools |
| [18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)     | Reconciliation algorithms    | Thuật toán reconciliation      |
| [18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md) | Advanced FE algorithms       | Thuật toán FE nâng cao         |
| [18-advanced-theory-04-data-structures-advanced.md](./18-advanced-theory-04-data-structures-advanced.md)         | Advanced DS applications     | Ứng dụng DS nâng cao           |
| [18-advanced-theory-05-concurrency-patterns.md](./18-advanced-theory-05-concurrency-patterns.md)                 | Concurrency patterns         | Mẫu concurrency                |
| [18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)         | Pattern composition          | Kết hợp pattern                |

### M) Expert Topics (19-\*)

| File                                                                                                         | Focus (EN)               | Trọng tâm (VI)               |
| ------------------------------------------------------------------------------------------------------------ | ------------------------ | ---------------------------- |
| [19-expert-topics-01-distributed-frontend-systems.md](./19-expert-topics-01-distributed-frontend-systems.md) | Distributed FE systems   | Hệ thống frontend phân tán   |
| [19-expert-topics-02-performance-engineering.md](./19-expert-topics-02-performance-engineering.md)           | Performance engineering  | Kỹ thuật hiệu năng           |
| [19-expert-topics-03-security-architecture.md](./19-expert-topics-03-security-architecture.md)               | FE security architecture | Kiến trúc bảo mật FE         |
| [19-expert-topics-04-testing-strategies-advanced.md](./19-expert-topics-04-testing-strategies-advanced.md)   | Advanced test strategy   | Chiến lược kiểm thử nâng cao |

---

## 3) Study Path / Lộ Trình Học

### Recommended progression / Thứ tự khuyến nghị

```text
Level 1 (Junior): Data Structures → Browser APIs → DOM
Level 2 (Mid): Design Patterns → Performance Theory → Concurrency
Level 3 (Senior): Compiler Theory → Distributed FE → Security Architecture
```

### Dependency arrows / Mũi tên phụ thuộc

- **Level 1 foundation / Nền tảng Level 1**
  - `01-data-structures-js` → `02-algorithms-js` → `04-graph-algorithms` / `05-tree-algorithms`
  - `00-web-apis-fundamentals` → `01-browser-apis` → `02-fetch-http` → `03-websockets`
  - `01-browser-apis` → `05-dom-manipulation-theory`

- **Level 2 integration / Tích hợp Level 2**
  - `03-design-patterns-ts` → `17-frontend-theory-09-state-management-patterns`
  - `06-browser-architecture-theory` + `07-browser-networking-theory` → `08-web-performance-theory`
  - `08-concurrency-js` → `17-frontend-theory-16-web-workers-concurrency`

- **Level 3 specialization / Chuyên sâu Level 3**
  - `07-compiler-theory-js` → `18-advanced-theory-01-compiler-design-frontend`
  - `18-advanced-theory-02-virtual-dom-reconciliation` → `19-expert-topics-02-performance-engineering`
  - `15-advanced-topics-02-cryptography-theory` → `19-expert-topics-03-security-architecture`
  - `17-frontend-theory-12-http-networking-theory` → `19-expert-topics-01-distributed-frontend-systems`

### Practical sequence / Chuỗi học thực hành

1. **Algorithms sprint / Nước rút thuật toán**
   - `01-data-structures-js` → `01b-data-structures-comprehensive` → `02-algorithms-js`
2. **Browser internals sprint / Nước rút nội tại browser**
   - `00-web-apis-fundamentals` → `04-browser-architecture-comprehensive` → `07-browser-networking-theory`
3. **Architecture sprint / Nước rút kiến trúc**
   - `03-design-patterns-ts` → `15-advanced-topics-07-state-machines-theory` → `17-frontend-theory-13-event-driven-architecture`
4. **Interview simulation / Mô phỏng phỏng vấn**
   - Entire `11-interview-practice-*` set in order.

---

## 4) Cross-References / Tham Khảo Chéo

### Shared theory foundations / Nền tảng lý thuyết dùng chung

- [../../shared/01-cs-fundamentals/](../../shared/01-cs-fundamentals/)
  - CS core (DSA, complexity, systems thinking).
  - Cốt lõi CS (DSA, độ phức tạp, tư duy hệ thống).
- [../../shared/05-software-engineering/](../../shared/05-software-engineering/)
  - Design principles and architecture tradeoffs.
  - Nguyên lý thiết kế và đánh đổi kiến trúc.
- [../../shared/06-ai-and-agents/](../../shared/06-ai-and-agents/)
  - AI-assisted engineering and agent workflows.
  - Quy trình kỹ thuật có AI/agent hỗ trợ.

### Core FE track prerequisites / Tiên quyết từ FE track cốt lõi

- [../01-javascript/](../01-javascript/)
  - JavaScript fundamentals before advanced internals.
  - Nền tảng JavaScript trước phần internals nâng cao.
- [../02-typescript/](../02-typescript/)
  - Type system fluency for advanced architecture patterns.
  - Thành thạo hệ kiểu để học pattern kiến trúc nâng cao.
- [../03-react/](../03-react/)
  - React mental model before reconciliation and performance deep dives.
  - Nắm mental model React trước khi học reconciliation và performance chuyên sâu.

### Suggested bridging / Cầu nối gợi ý

- `shared/01-cs-fundamentals` → `09-advanced-topics/01-data-structures-js`
- `shared/05-software-engineering` → `09-advanced-topics/03-design-patterns-ts`
- `shared/06-ai-and-agents` → `09-advanced-topics/13-tools-ecosystem-*`

---

## 5) Note on `16-theoretical-foundations-*` / Ghi chú về nhóm `16-theoretical-foundations-*`

The `16-theoretical-foundations-*` files in this folder are maintained as **cross-reference stubs**.

Các file `16-theoretical-foundations-*` trong thư mục này được duy trì dưới dạng **stub chuyển hướng**.

They exist to keep FE-track navigation complete, but the canonical theory source of truth now lives under `docs/shared/`.

Chúng tồn tại để giữ điều hướng FE-track đầy đủ, nhưng nguồn lý thuyết chuẩn (single source of truth) hiện nằm trong `docs/shared/`.

**What to do when studying / Khi học nên làm gì:**

1. Open the 16-\* file for context and mapping.
2. Follow its redirect to corresponding `shared/` material.
3. Return to FE advanced topics for frontend-specific applications.

**Lưu ý:** Không nhân bản lý thuyết giữa `fe-track/` và `shared/`; chỉ giữ liên kết và ứng dụng frontend-specific ở FE track.

---

## Quick Navigation / Điều Hướng Nhanh

- Start here for interview rounds: [11-interview-practice-06-frontend-system-design.md](./11-interview-practice-06-frontend-system-design.md)
- Deep performance prep: [19-expert-topics-02-performance-engineering.md](./19-expert-topics-02-performance-engineering.md)
- Security prep: [19-expert-topics-03-security-architecture.md](./19-expert-topics-03-security-architecture.md)
- Compiler and internals prep: [18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)

Chúc bạn học tốt và phỏng vấn thành công. / Good luck with your preparation and interviews.
