# THEORY KNOWLEDGE INDEX / Chỉ Mục Lý Thuyết Dùng Chung


> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../00-table-of-contents.md)

## Overview / Tổng Quan

Tài liệu này là bản đồ đầy đủ cho thư mục `docs/shared/`, dùng làm nguồn lý thuyết chung cho cả Frontend và Backend.
Mục tiêu: giúp bạn biết **học gì**, **học theo thứ tự nào**, và **liên hệ sang FE/BE ra sao**.

- Shared theory = nền tảng không phụ thuộc ngôn ngữ.
- FE track và BE track sẽ tham chiếu lại thay vì lặp nội dung.
- Ưu tiên học theo năng lực: Junior → Mid → Senior.

## Scope of shared/

Thư mục `shared/` gồm 7 nhóm lớn:

1. CS fundamentals
2. System design
3. Database
4. Security
5. Software engineering
6. AI and agents
7. Company guides

## Section Directory / Danh Mục Theo Section

### `01-cs-fundamentals`

- `./01-cs-fundamentals/algorithms-theory.md`
  - Giải thích: Algorithm paradigms, complexity intuition, practical trade-offs.
  - FE cross-ref: `../fe-track/modules/10-cs-fundamentals.md`.
  - BE cross-ref: `../be-track/02-backend-knowledge/05-os-go.md`.
- `./01-cs-fundamentals/data-structures-theory.md`
  - Giải thích: Core structures and selection strategy by workload.
  - FE cross-ref: `../fe-track/modules/10-cs-fundamentals.md`.
  - BE cross-ref: `../be-track/02-backend-knowledge/05-os-go.md`.
- `./01-cs-fundamentals/complexity-analysis.md`
  - Giải thích: Big-O/Theta/Omega, amortized analysis, interview heuristics.
  - FE cross-ref: `../fe-track/modules/10-cs-fundamentals.md`.
  - BE cross-ref: `../be-track/02-backend-knowledge/05-os-go.md`.
- `./01-cs-fundamentals/information-theory.md`
  - Giải thích: Entropy, encoding, compression, channel basics.
  - FE cross-ref: `../fe-track/modules/10-cs-fundamentals.md`.
  - BE cross-ref: `../be-track/02-backend-knowledge/05-os-go.md`.
- `./01-cs-fundamentals/networking-theory.md`
  - Giải thích: OSI/TCP-IP, latency, throughput, HTTP fundamentals.
  - FE cross-ref: `../fe-track/modules/10-cs-fundamentals.md`.
  - BE cross-ref: `../be-track/02-backend-knowledge/05-os-go.md`.
- `./01-cs-fundamentals/os-theory.md`
  - Giải thích: Processes, threads, scheduling, memory, file systems.
  - FE cross-ref: `../fe-track/modules/10-cs-fundamentals.md`.
  - BE cross-ref: `../be-track/02-backend-knowledge/05-os-go.md`.
- `./01-cs-fundamentals/07-concurrency-and-parallelism.md`
  - Giải thích: Synchronization, consistency, parallel execution models.
  - FE cross-ref: `../fe-track/modules/10-cs-fundamentals.md`.
  - BE cross-ref: `../be-track/02-backend-knowledge/05-os-go.md`.
- `./01-cs-fundamentals/08-computation-theory.md`
  - Giải thích: Automata, computability, complexity classes.
  - FE cross-ref: `../fe-track/modules/10-cs-fundamentals.md`.
  - BE cross-ref: `../be-track/02-backend-knowledge/05-os-go.md`.

### `02-system-design`

- `./02-system-design/system-design-theory.md`
  - Giải thích: Design framework, requirements, capacity planning.
  - FE cross-ref: `../fe-track/08-fe-system-design/01-architecture-patterns.md`.
  - BE cross-ref: `../be-track/04-be-system-design/01-design-framework.md`.
- `./02-system-design/caching-patterns.md`
  - Giải thích: Cache hierarchy, invalidation, consistency trade-offs.
  - FE cross-ref: `../fe-track/08-fe-system-design/01-architecture-patterns.md`.
  - BE cross-ref: `../be-track/04-be-system-design/01-design-framework.md`.
- `./02-system-design/replication-partitioning.md`
  - Giải thích: Horizontal scaling, replication models, rebalancing.
  - FE cross-ref: `../fe-track/08-fe-system-design/01-architecture-patterns.md`.
  - BE cross-ref: `../be-track/04-be-system-design/01-design-framework.md`.
- `./02-system-design/consensus-algorithms.md`
  - Giải thích: Raft/Paxos concepts and distributed coordination.
  - FE cross-ref: `../fe-track/08-fe-system-design/01-architecture-patterns.md`.
  - BE cross-ref: `../be-track/04-be-system-design/01-design-framework.md`.

### `03-database`

- `./03-database/database-theory.md`
  - Giải thích: Relational fundamentals and transactional behavior.
  - FE cross-ref: `../fe-track/08-fe-system-design/05-database-design.md`.
  - BE cross-ref: `../be-track/03-database-advanced/01-sql-fundamentals.md`.
- `./03-database/02-indexing-and-optimization.md`
  - Giải thích: Index strategy, query plans, optimization.
  - FE cross-ref: `../fe-track/08-fe-system-design/05-database-design.md`.
  - BE cross-ref: `../be-track/03-database-advanced/01-sql-fundamentals.md`.
- `./03-database/03-nosql-and-newsql.md`
  - Giải thích: NoSQL models, NewSQL motivation and use cases.
  - FE cross-ref: `../fe-track/08-fe-system-design/05-database-design.md`.
  - BE cross-ref: `../be-track/03-database-advanced/01-sql-fundamentals.md`.

### `04-security`

- `./04-security/01-security-fundamentals.md`
  - Giải thích: Threat modeling, CIA triad, defense layers.
  - FE cross-ref: `../fe-track/modules/08-security.md`.
  - BE cross-ref: `../be-track/02-backend-knowledge/04-auth-security.md`.
- `./04-security/02-cryptography-and-protocols.md`
  - Giải thích: Hashing, signatures, TLS, key exchange.
  - FE cross-ref: `../fe-track/modules/08-security.md`.
  - BE cross-ref: `../be-track/02-backend-knowledge/04-auth-security.md`.
- `./04-security/03-web-security-owasp.md`
  - Giải thích: OWASP Top 10 and mitigation playbook.
  - FE cross-ref: `../fe-track/modules/08-security.md`.
  - BE cross-ref: `../be-track/02-backend-knowledge/04-auth-security.md`.
- `./04-security/04-modern-auth-patterns.md`
  - Giải thích: OAuth/OIDC/JWT/session patterns.
  - FE cross-ref: `../fe-track/modules/08-security.md`.
  - BE cross-ref: `../be-track/02-backend-knowledge/04-auth-security.md`.

### `05-software-engineering`

- `./05-software-engineering/01-solid-and-design-patterns.md`
  - Giải thích: SOLID principles and core design patterns.
  - FE cross-ref: `../fe-track/modules/12b-detailed-process.md`.
  - BE cross-ref: `../be-track/00-study-roadmap.md`.
- `./05-software-engineering/02-architecture-styles.md`
  - Giải thích: Monolith, microservices, event-driven styles.
  - FE cross-ref: `../fe-track/modules/12b-detailed-process.md`.
  - BE cross-ref: `../be-track/00-study-roadmap.md`.
- `./05-software-engineering/03-sdlc-and-practices.md`
  - Giải thích: Lifecycle, delivery models, team practices.
  - FE cross-ref: `../fe-track/modules/12b-detailed-process.md`.
  - BE cross-ref: `../be-track/00-study-roadmap.md`.
- `./05-software-engineering/04-testing-theory.md`
  - Giải thích: Testing pyramid, strategies, reliability thinking.
  - FE cross-ref: `../fe-track/modules/12b-detailed-process.md`.
  - BE cross-ref: `../be-track/00-study-roadmap.md`.
- `./05-software-engineering/05-code-quality-and-review.md`
  - Giải thích: Code review, maintainability, quality signals.
  - FE cross-ref: `../fe-track/modules/12b-detailed-process.md`.
  - BE cross-ref: `../be-track/00-study-roadmap.md`.
- `./05-software-engineering/06-project-management.md`
  - Giải thích: Planning, estimation, communication, risk tracking.
  - FE cross-ref: `../fe-track/modules/12b-detailed-process.md`.
  - BE cross-ref: `../be-track/00-study-roadmap.md`.

### `06-ai-and-agents`

- `./06-ai-and-agents/01-ml-fundamentals.md`
  - Giải thích: Supervised/unsupervised basics and model lifecycle.
  - FE cross-ref: `../fe-track/modules/14-advanced-expert.md`.
  - BE cross-ref: `../be-track/04-be-system-design/03-advanced-problems.md`.
- `./06-ai-and-agents/02-llm-and-transformers.md`
  - Giải thích: Transformer architecture and LLM reasoning limits.
  - FE cross-ref: `../fe-track/modules/14-advanced-expert.md`.
  - BE cross-ref: `../be-track/04-be-system-design/03-advanced-problems.md`.
- `./06-ai-and-agents/03-agent-patterns.md`
  - Giải thích: Agent loops, tool use, memory and orchestration.
  - FE cross-ref: `../fe-track/modules/14-advanced-expert.md`.
  - BE cross-ref: `../be-track/04-be-system-design/03-advanced-problems.md`.
- `./06-ai-and-agents/04-rag-and-embeddings.md`
  - Giải thích: Embedding retrieval and grounding strategies.
  - FE cross-ref: `../fe-track/modules/14-advanced-expert.md`.
  - BE cross-ref: `../be-track/04-be-system-design/03-advanced-problems.md`.
- `./06-ai-and-agents/05-ai-engineering-practice.md`
  - Giải thích: Evaluation, prompts, reliability engineering.
  - FE cross-ref: `../fe-track/modules/14-advanced-expert.md`.
  - BE cross-ref: `../be-track/04-be-system-design/03-advanced-problems.md`.
- `./06-ai-and-agents/06-ai-system-design.md`
  - Giải thích: AI system architecture and operational concerns.
  - FE cross-ref: `../fe-track/modules/14-advanced-expert.md`.
  - BE cross-ref: `../be-track/04-be-system-design/03-advanced-problems.md`.
- `./06-ai-and-agents/07-ai-production-challenges.md`
  - Giải thích: Latency/cost/safety/governance trade-offs.
  - FE cross-ref: `../fe-track/modules/14-advanced-expert.md`.
  - BE cross-ref: `../be-track/04-be-system-design/03-advanced-problems.md`.

### `07-company-guides`

- `./07-company-guides/01-google.md`
  - Giải thích: Google interview loop, signals, and preparation strategy.
  - FE cross-ref: `../fe-track/10-company-guide.md`.
  - BE cross-ref: `../be-track/05-company-guide.md`.
- `./07-company-guides/02-microsoft.md`
  - Giải thích: Microsoft competencies, expectations, and examples.
  - FE cross-ref: `../fe-track/10-company-guide.md`.
  - BE cross-ref: `../be-track/05-company-guide.md`.
- `./07-company-guides/03-grab.md`
  - Giải thích: Grab ownership culture and regional product mindset.
  - FE cross-ref: `../fe-track/10-company-guide.md`.
  - BE cross-ref: `../be-track/05-company-guide.md`.
- `./07-company-guides/04-axon.md`
  - Giải thích: Axon mission-focused decision criteria and impact framing.
  - FE cross-ref: `../fe-track/10-company-guide.md`.
  - BE cross-ref: `../be-track/05-company-guide.md`.
- `./07-company-guides/05-employment-hero.md`
  - Giải thích: Employment Hero values, communication, execution.
  - FE cross-ref: `../fe-track/10-company-guide.md`.
  - BE cross-ref: `../be-track/05-company-guide.md`.
- `./07-company-guides/06-zalo-vng.md`
  - Giải thích: Zalo/VNG context, growth scale, and practical priorities.
  - FE cross-ref: `../fe-track/10-company-guide.md`.
  - BE cross-ref: `../be-track/05-company-guide.md`.

## Quick Reference Table / Bảng Tra Nhanh

| Topic | Shared File | FE Link | BE Link |
|---|---|---|---|
| Complexity | `./01-cs-fundamentals/complexity-analysis.md` | `../fe-track/01-javascript/08-advanced-concepts.md` | `../be-track/01-golang/07-algorithms-go.md` |
| Concurrency | `./01-cs-fundamentals/07-concurrency-and-parallelism.md` | `../fe-track/09-advanced-topics/08-concurrency-js.md` | `../be-track/01-golang/03-concurrency.md` |
| Networking | `./01-cs-fundamentals/networking-theory.md` | `../fe-track/modules/03-browser-platform.md` | `../be-track/02-backend-knowledge/06-networking-go.md` |
| System Design | `./02-system-design/system-design-theory.md` | `../fe-track/08-fe-system-design/01-architecture-patterns.md` | `../be-track/04-be-system-design/01-design-framework.md` |
| Caching | `./02-system-design/caching-patterns.md` | `../fe-track/08-fe-system-design/03-caching.md` | `../be-track/03-database-advanced/04-caching-patterns.md` |
| Replication | `./02-system-design/replication-partitioning.md` | `../fe-track/08-fe-system-design/02-scalability.md` | `../be-track/02-backend-knowledge/03-distributed-systems.md` |
| SQL + Index | `./03-database/02-indexing-and-optimization.md` | `../fe-track/08-fe-system-design/05-database-design.md` | `../be-track/03-database-advanced/02-indexing-optimization.md` |
| OWASP | `./04-security/03-web-security-owasp.md` | `../fe-track/modules/08-security.md` | `../be-track/02-backend-knowledge/04-auth-security.md` |
| Auth | `./04-security/04-modern-auth-patterns.md` | `../fe-track/04-nextjs/01-app-router-server-components.md` | `../be-track/02-backend-knowledge/04-auth-security.md` |
| Testing | `./05-software-engineering/04-testing-theory.md` | `../fe-track/modules/11-testing-qa.md` | `../be-track/01-golang/05-testing-profiling.md` |
| Architecture | `./05-software-engineering/02-architecture-styles.md` | `../fe-track/08-fe-system-design/01-architecture-patterns.md` | `../be-track/02-backend-knowledge/02-microservices.md` |
| AI Design | `./06-ai-and-agents/06-ai-system-design.md` | `../fe-track/modules/14-advanced-expert.md` | `../be-track/04-be-system-design/03-advanced-problems.md` |
| Company Signals | `./07-company-guides/01-google.md` | `../fe-track/10-company-guide.md` | `../be-track/05-company-guide.md` |

## Suggested Study Order / Lộ Trình Gợi Ý

### 🟢 Junior Track

1. `./01-cs-fundamentals/complexity-analysis.md`
2. `./01-cs-fundamentals/data-structures-theory.md`
3. `./01-cs-fundamentals/networking-theory.md`
4. `./03-database/database-theory.md`
5. `./05-software-engineering/03-sdlc-and-practices.md`

Giải thích: tập trung nền tảng để trả lời câu hỏi core trước khi đi vào scale/distributed.

### 🟡 Mid Track

1. `./02-system-design/system-design-theory.md`
2. `./02-system-design/caching-patterns.md`
3. `./03-database/02-indexing-and-optimization.md`
4. `./04-security/03-web-security-owasp.md`
5. `./05-software-engineering/05-code-quality-and-review.md`

Giải thích: tăng khả năng design, trade-off, và vận hành production.

### 🔴 Senior Track

1. `./02-system-design/replication-partitioning.md`
2. `./02-system-design/consensus-algorithms.md`
3. `./06-ai-and-agents/06-ai-system-design.md`
4. `./06-ai-and-agents/07-ai-production-challenges.md`
5. `./07-company-guides/01-google.md` + `./07-company-guides/02-microsoft.md`

Giải thích: tập trung kiến trúc quy mô lớn, độ tin cậy, leadership signal.

## FE/BE Cross-learning Paths

### Frontend-first learner

- Bắt đầu từ shared CS + performance mindset rồi nối sang FE rendering/perf:
  - `./01-cs-fundamentals/complexity-analysis.md`
  - `../fe-track/06-browser-performance/04-web-performance-comprehensive.md`
  - `./02-system-design/caching-patterns.md`
  - `../fe-track/08-fe-system-design/03-caching.md`

### Backend-first learner

- Bắt đầu từ distributed + database rồi nối sang BE implementation:
  - `./02-system-design/replication-partitioning.md`
  - `../be-track/02-backend-knowledge/03-distributed-systems.md`
  - `./03-database/02-indexing-and-optimization.md`
  - `../be-track/03-database-advanced/02-indexing-optimization.md`

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Why do we keep shared theory separate from FE/BE tracks?
Giải thích: để tránh duplicate kiến thức cốt lõi, giảm drift nội dung, và bảo trì dễ hơn khi cập nhật.
Ví dụ: quy tắc Big-O chỉ viết ở `./01-cs-fundamentals/complexity-analysis.md`, FE/BE chỉ link lại.

### 🟡 [Mid] How should I use this index in a 6-week prep plan?
Giải thích: dùng bảng Quick Reference để chọn 2-3 chủ đề/tuần, mỗi chủ đề học theo chuỗi shared → track-specific.
Ví dụ: tuần 2 học caching ở `./02-system-design/caching-patterns.md` rồi làm bài FE ở `../fe-track/08-fe-system-design/03-caching.md`.

### 🔴 [Senior] How do I show cross-domain thinking in interviews?
Giải thích: trả lời theo trade-off xuyên lớp: client UX, API contract, data model, reliability, security.
Ví dụ: khi thiết kế feed, kết nối `./02-system-design/replication-partitioning.md` với `../fe-track/08-fe-system-design/02-scalability.md` và `../be-track/04-be-system-design/05-observability-and-scale.md`.

## Maintenance Checklist

- Khi thêm file mới trong `shared/`, cập nhật mục Section Directory.
- Khi đổi tên file, cập nhật ngay Quick Reference.
- Với mỗi topic mới, thêm ít nhất 1 FE link và 1 BE link.
- Kiểm tra định kỳ: links relative paths còn hợp lệ.

## Appendix: Topic Tags

- `algorithms`
- `data-structures`
- `complexity`
- `networking`
- `operating-systems`
- `concurrency`
- `distributed-systems`
- `caching`
- `replication`
- `consensus`
- `database`
- `indexing`
- `nosql`
- `security`
- `owasp`
- `auth`
- `software-engineering`
- `testing`
- `code-review`
- `ai`
- `agents`
- `company-guide`

## Extended Reading Notes
1. **Complexity**
   - Shared: `./01-cs-fundamentals/complexity-analysis.md`
   - FE: `../fe-track/01-javascript/08-advanced-concepts.md`
   - BE: `../be-track/01-golang/07-algorithms-go.md`
   - Giải thích: học shared trước để hiểu nguyên lý, sau đó đọc track để thấy implementation thực tế.
2. **Concurrency**
   - Shared: `./01-cs-fundamentals/07-concurrency-and-parallelism.md`
   - FE: `../fe-track/09-advanced-topics/08-concurrency-js.md`
   - BE: `../be-track/01-golang/03-concurrency.md`
   - Giải thích: học shared trước để hiểu nguyên lý, sau đó đọc track để thấy implementation thực tế.
3. **Networking**
   - Shared: `./01-cs-fundamentals/networking-theory.md`
   - FE: `../fe-track/modules/03-browser-platform.md`
   - BE: `../be-track/02-backend-knowledge/06-networking-go.md`
   - Giải thích: học shared trước để hiểu nguyên lý, sau đó đọc track để thấy implementation thực tế.
4. **System Design**
   - Shared: `./02-system-design/system-design-theory.md`
   - FE: `../fe-track/08-fe-system-design/01-architecture-patterns.md`
   - BE: `../be-track/04-be-system-design/01-design-framework.md`
   - Giải thích: học shared trước để hiểu nguyên lý, sau đó đọc track để thấy implementation thực tế.
5. **Caching**
   - Shared: `./02-system-design/caching-patterns.md`
   - FE: `../fe-track/08-fe-system-design/03-caching.md`
   - BE: `../be-track/03-database-advanced/04-caching-patterns.md`
   - Giải thích: học shared trước để hiểu nguyên lý, sau đó đọc track để thấy implementation thực tế.
6. **Replication**
   - Shared: `./02-system-design/replication-partitioning.md`
   - FE: `../fe-track/08-fe-system-design/02-scalability.md`
   - BE: `../be-track/02-backend-knowledge/03-distributed-systems.md`
   - Giải thích: học shared trước để hiểu nguyên lý, sau đó đọc track để thấy implementation thực tế.
7. **SQL + Index**
   - Shared: `./03-database/02-indexing-and-optimization.md`
   - FE: `../fe-track/08-fe-system-design/05-database-design.md`
   - BE: `../be-track/03-database-advanced/02-indexing-optimization.md`
   - Giải thích: học shared trước để hiểu nguyên lý, sau đó đọc track để thấy implementation thực tế.
8. **OWASP**
   - Shared: `./04-security/03-web-security-owasp.md`
   - FE: `../fe-track/modules/08-security.md`
   - BE: `../be-track/02-backend-knowledge/04-auth-security.md`
   - Giải thích: học shared trước để hiểu nguyên lý, sau đó đọc track để thấy implementation thực tế.
9. **Auth**
   - Shared: `./04-security/04-modern-auth-patterns.md`
   - FE: `../fe-track/04-nextjs/01-app-router-server-components.md`
   - BE: `../be-track/02-backend-knowledge/04-auth-security.md`
   - Giải thích: học shared trước để hiểu nguyên lý, sau đó đọc track để thấy implementation thực tế.
10. **Testing**
   - Shared: `./05-software-engineering/04-testing-theory.md`
   - FE: `../fe-track/modules/11-testing-qa.md`
   - BE: `../be-track/01-golang/05-testing-profiling.md`
   - Giải thích: học shared trước để hiểu nguyên lý, sau đó đọc track để thấy implementation thực tế.
11. **Architecture**
   - Shared: `./05-software-engineering/02-architecture-styles.md`
   - FE: `../fe-track/08-fe-system-design/01-architecture-patterns.md`
   - BE: `../be-track/02-backend-knowledge/02-microservices.md`
   - Giải thích: học shared trước để hiểu nguyên lý, sau đó đọc track để thấy implementation thực tế.
12. **AI Design**
   - Shared: `./06-ai-and-agents/06-ai-system-design.md`
   - FE: `../fe-track/modules/14-advanced-expert.md`
   - BE: `../be-track/04-be-system-design/03-advanced-problems.md`
   - Giải thích: học shared trước để hiểu nguyên lý, sau đó đọc track để thấy implementation thực tế.
13. **Company Signals**
   - Shared: `./07-company-guides/01-google.md`
   - FE: `../fe-track/10-company-guide.md`
   - BE: `../be-track/05-company-guide.md`
   - Giải thích: học shared trước để hiểu nguyên lý, sau đó đọc track để thấy implementation thực tế.
