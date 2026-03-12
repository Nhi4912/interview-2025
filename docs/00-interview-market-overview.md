# 00. Interview Market Overview 2025-2026 — Bản Đồ Thị Trường Phỏng Vấn Kỹ Thuật

> **Audience:** Frontend (JS/TS/React) and Backend (Go) candidates targeting Google, Microsoft, Grab, Axon, Employment Hero, and Zalo/VNG.
>
> **Ngắn gọn bằng tiếng Việt:** Tài liệu này giúp bạn chọn đúng chiến lược ôn tập theo từng công ty thay vì học dàn trải. Mục tiêu là tăng xác suất pass bằng cách hiểu đúng “luật chơi” của mỗi interview loop.

---

## 1. Overview / Tổng Quan

Understanding the interview landscape in 2025-2026 is no longer optional. The same candidate can be rated “strong” at one company and “not aligned” at another — not because skill is absent, but because **evaluation models differ**.

**Tiếng Việt (ý chính):** Nếu không map đúng kỳ vọng từng công ty, bạn sẽ rơi vào tình trạng “học đúng kiến thức nhưng sai format”. Ví dụ: Google ưu tiên thuật toán và reasoning rất sâu; Employment Hero ưu tiên hành vi + async communication; Grab ưu tiên system design gắn domain thật (ride/food/payments).

### 1.1 Why this document matters

| Preparation Problem | Consequence in Interview | Corrective Strategy from This Doc |
|---|---|---|
| One-size-fits-all prep | Overfit to wrong question types | Build company-specific prep mix (coding/design/behavioral) |
| Overfocus on LeetCode only | Weak design/behavioral signals | Add architecture narration + STAR story bank |
| Strong coding but weak communication | “No hire” despite technical ability | Train explanation under time pressure + trade-off language |
| Good system ideas but no numbers | Appears hand-wavy | Use explicit scale assumptions and SLO/latency targets |
| Strong product intuition but weak CS basics | Fails early technical gate | Rebuild CS baseline via shared fundamentals tracks |

### 1.2 Market snapshot (2025-2026)

| Signal | 2025-2026 Direction | Candidate Impact |
|---|---|---|
| Interview loops | Stable at 3-7 rounds depending company | Pipeline stamina and consistency matter |
| System design | Expanding to mid-level and required for senior | Design fluency is table stakes |
| Behavioral | More rubric-driven, not “casual chat” | Story quality affects final decision heavily |
| AI policy | Divergent by company | Must adapt process, tools, and practice mode |
| Async assessments | Increasing in distributed teams | Writing/video communication becomes critical |

---

## 2. Interview Process Comparison / So Sánh Quy Trình Phỏng Vấn

### 2.1 Side-by-side comparison table

| Company | Typical Round Count | Typical Flow | Coding Difficulty | System Design Weight | Behavioral Weight | Distinctive Constraints |
|---|---:|---|---|---|---|---|
| Google | 5-7 rounds | No standard OA (screen + onsite style) → technical loop → final decision | Hard | ★★★★★ | ★★☆☆☆ | Centralized hiring pool, team matching after HC approval, no AI tools, 3-interview limit / 5 years |
| Microsoft | 5-6 rounds | Sometimes Codility/HackerRank depending org → technical loop → final decision | Medium | ★★★★☆ | ★★☆☆☆ | Team-dependent; strong compliance lens (GDPR, auditability, Azure governance); can interview multiple teams in parallel |
| Grab | 4-6 rounds (usually includes HackerRank OA) | HackerRank OA common for first technical gate → technical loop → final decision | Medium-Hard | ★★★★★ | ★★★☆☆ | Domain-realistic design prompts (ride matching, surge pricing, payment processing) |
| Axon | 4-5 rounds (take-home common) | Take-home or practical implementation assignment → technical loop → final decision | Medium | ★★★★☆ | ★★★★★ | Work-sample in real stack, less LeetCode grind culture |
| Employment Hero | 3-5 rounds, async-first process | Async challenge + presentation / walkthrough → technical loop → final decision | Low-Medium | ★★★☆☆ | ★★★★★ | Async tasks, Loom videos, strong Vietnam hub, rising expectation for AI tool proficiency |
| Zalo/VNG | 4-5 rounds with written OA | Written OA common (algorithm + CS fundamentals) → technical loop → final decision | Medium | ★★★★☆ | ★★★☆☆ | Interview may be in Vietnamese or English; Go + React stack alignment; seniors may present architecture |

### 2.2 Company-by-company structured overview

#### 1. Google

| Category | Interview Reality (2025-2026) |
|---|---|
| Round count | 5-7 rounds |
| Expected timeline | 3-8 weeks |
| Coding | Hard LeetCode, theoretical, trick problems |
| System design | High-level + low-level for L5+ |
| Behavioral | Lowest among FAANG, sometimes skipped |
| Unique process trait | Centralized hiring pool, team matching after HC approval, no AI tools, 3-interview limit / 5 years |
| Frontend note | Same DSA loop regardless of role |
| Backend note | Language agnostic; algorithmic thinking over syntax |
| Interview language | Mostly English |
| Domain pressure | Search, Ads, Docs, Maps, distributed infra |

**Round-by-round expectations**

| Round | Goal | Candidate Should Demonstrate | Common Failure Mode |
|---|---|---|---|
| Recruiter call | Calibrate role level + availability | Clear narrative of scope/impact; role fit | Vague achievements, weak target leveling |
| Phone screen 1 | Algorithmic reasoning under pressure | Correctness + complexity + communication | Jumping to code without validating approach |
| Phone screen 2 (optional) | Consistency and depth | Recovery from edge cases and follow-up constraints | Over-optimizing early, missing baseline solution |
| Onsite coding rounds (4-6) | Core hiring signal | Strong DS/Algo + bug-free implementation in plain editor | Insufficient edge-case handling and unclear trade-offs |
| System design (L5+) | Architecture maturity | High-level + low-level decomposition with scaling assumptions | No bottleneck analysis / no capacity reasoning |
| Team matching (post-hire-committee) | Mutual fit after HC pass | Domain alignment and collaboration style | Treating team match as “automatic” |

**Preparation focus split (suggested weekly effort)**

| Track | Coding | System Design | Behavioral/Communication | Domain Study |
|---|---:|---:|---:|---:|
| Suggested split | 45% | 45% | 15% | -5% |

**Vietnamese prep note**

- **Google (gợi ý):** Tập trả lời theo format `context → constraints → options → decision → trade-off → metric`. Cấu trúc này hợp với cả coding follow-up lẫn system design và giúp bạn nói mạch lạc hơn trong vòng pressure.

#### 2. Microsoft

| Category | Interview Reality (2025-2026) |
|---|---|
| Round count | 5-6 rounds |
| Expected timeline | 2-6 weeks |
| Coding | Medium LeetCode (binary tree questions common) |
| System design | Strong at senior; often tied with domain/compliance round |
| Behavioral | Lower priority than product companies |
| Unique process trait | Team-dependent; strong compliance lens (GDPR, auditability, Azure governance); can interview multiple teams in parallel |
| Frontend note | More practical FE coding than Google but still DS/Algo present |
| Backend note | Backend often tied to Azure/system integration concerns |
| Interview language | English (global standard) |
| Domain pressure | Azure, M365, Teams, enterprise SaaS |

**Round-by-round expectations**

| Round | Goal | Candidate Should Demonstrate | Common Failure Mode |
|---|---|---|---|
| Recruiter screen | Role/team mapping | Domain and level alignment | Generic pitch with no product relevance |
| Technical coding | Foundational coding strength | Solid medium-level DS/Algo and readable code | Ignoring test cases and complexity explanation |
| Domain round | Team-specific architecture/problem solving | Understanding of product domain and engineering constraints | No enterprise/compliance lens |
| System design | Scalable architecture decisions | Trade-offs, reliability, and observability | Hand-wavy component diagrams |
| Behavioral | Collaboration and growth mindset | Concrete conflict/ownership stories | “Hero narrative” without team context |
| Final manager/loop wrap | Cross-round consistency | Decision quality and communication | Contradicting earlier claims |

**Preparation focus split (suggested weekly effort)**

| Track | Coding | System Design | Behavioral/Communication | Domain Study |
|---|---:|---:|---:|---:|
| Suggested split | 35% | 35% | 15% | 15% |

**Vietnamese prep note**

- **Microsoft (gợi ý):** Tập trả lời theo format `context → constraints → options → decision → trade-off → metric`. Cấu trúc này hợp với cả coding follow-up lẫn system design và giúp bạn nói mạch lạc hơn trong vòng pressure.

#### 3. Grab

| Category | Interview Reality (2025-2026) |
|---|---|
| Round count | 4-6 rounds (usually includes HackerRank OA) |
| Expected timeline | 2-7 weeks |
| Coding | Medium-Hard |
| System design | Very heavy; SEA multi-country scale across rides + food + payments |
| Behavioral | Medium; ownership and execution focus |
| Unique process trait | Domain-realistic design prompts (ride matching, surge pricing, payment processing) |
| Frontend note | Real-time map UI, latency/reliability trade-offs, mobile web performance |
| Backend note | Go concurrency, Kafka, idempotency, consistency at operational scale |
| Interview language | English (regional interview loops) |
| Domain pressure | Transport, delivery, payments, risk/fraud |

**Round-by-round expectations**

| Round | Goal | Candidate Should Demonstrate | Common Failure Mode |
|---|---|---|---|
| HackerRank OA | Filter for coding baseline | Fast and accurate problem solving | Time mismanagement on first problem |
| Technical screen | Coding + role fundamentals | Medium-hard coding with clear verbalization | Silent coding, little thought process |
| System design | Regional-scale architecture | Designing ride/food/payment flows with realistic scale | No failure-mode strategy |
| Domain deep dive | Operational realism | Latency, idempotency, consistency trade-offs | Assuming perfect network/service health |
| Behavioral/manager | Execution and ownership | Bias for action with measurable impact | Stories without metrics |
| Optional additional round | Leveling confirmation | Consistency across scenarios | Inconsistent technical depth |

**Preparation focus split (suggested weekly effort)**

| Track | Coding | System Design | Behavioral/Communication | Domain Study |
|---|---:|---:|---:|---:|
| Suggested split | 35% | 45% | 25% | -5% |

**Vietnamese prep note**

- **Grab (gợi ý):** Tập trả lời theo format `context → constraints → options → decision → trade-off → metric`. Cấu trúc này hợp với cả coding follow-up lẫn system design và giúp bạn nói mạch lạc hơn trong vòng pressure.

#### 4. Axon

| Category | Interview Reality (2025-2026) |
|---|---|
| Round count | 4-5 rounds (take-home common) |
| Expected timeline | 2-5 weeks |
| Coding | Medium, practical over theoretical |
| System design | Reliability and safety-critical mindset |
| Behavioral | High; mission alignment is critical ("Why Axon?") |
| Unique process trait | Work-sample in real stack, less LeetCode grind culture |
| Frontend note | Code quality, accessibility, testing rigor, maintainable component architecture |
| Backend note | Reliability, observability, failure handling, incident maturity |
| Interview language | English (VN office + international clients) |
| Domain pressure | Public safety, evidence systems, camera/cloud workflows |

**Round-by-round expectations**

| Round | Goal | Candidate Should Demonstrate | Common Failure Mode |
|---|---|---|---|
| Recruiter + motivation | Mission and communication filter | Clear “Why Axon?” and reliability mindset | No mission alignment |
| Take-home assignment | Practical implementation quality | Maintainable code, tests, docs, rationale | Feature-complete but poor code quality |
| Technical review | Reasoning over work sample | Defensible decisions and refactor awareness | Cannot explain own trade-offs |
| System/reliability discussion | Safety-critical thinking | Failure analysis, rollback, auditability | Optimizing speed over safety |
| Behavioral/final | Team and values fit | Humility + accountability + collaboration | Over-indexing on individual heroics |

**Preparation focus split (suggested weekly effort)**

| Track | Coding | System Design | Behavioral/Communication | Domain Study |
|---|---:|---:|---:|---:|
| Suggested split | 25% | 35% | 45% | -5% |

**Vietnamese prep note**

- **Axon (gợi ý):** Tập trả lời theo format `context → constraints → options → decision → trade-off → metric`. Cấu trúc này hợp với cả coding follow-up lẫn system design và giúp bạn nói mạch lạc hơn trong vòng pressure.

#### 5. Employment Hero

| Category | Interview Reality (2025-2026) |
|---|---|
| Round count | 3-5 rounds, async-first process |
| Expected timeline | 1-4 weeks |
| Coding | Low-Medium practical task |
| System design | Moderate product architecture depth |
| Behavioral | Highest; values screening via "The EH Way" |
| Unique process trait | Async tasks, Loom videos, strong Vietnam hub, rising expectation for AI tool proficiency |
| Frontend note | React product execution, DX, delivery consistency, communication clarity |
| Backend note | Ruby/Rails and service boundaries; .NET as secondary; Go emerging |
| Interview language | English first; async communication-heavy |
| Domain pressure | HR/payroll/workforce platform |

**Round-by-round expectations**

| Round | Goal | Candidate Should Demonstrate | Common Failure Mode |
|---|---|---|---|
| Async intro task | Communication baseline | Concise written reasoning + clarity | Overlong unclear write-up |
| Take-home + Loom | Practical product delivery | Shippable solution and structured walkthrough | Code okay but explanation weak |
| Technical interview | Depth on submitted work | Decision quality, testing, maintainability | Cannot justify architecture choices |
| Values interview | EH Way alignment | Culture behaviors with concrete examples | No self-reflection evidence |
| Final stakeholder call | Cross-functional communication | Prioritization and trade-off framing | Narrow engineering-only lens |

**Preparation focus split (suggested weekly effort)**

| Track | Coding | System Design | Behavioral/Communication | Domain Study |
|---|---:|---:|---:|---:|
| Suggested split | 15% | 25% | 45% | 15% |

**Vietnamese prep note**

- **Employment Hero (gợi ý):** Tập trả lời theo format `context → constraints → options → decision → trade-off → metric`. Cấu trúc này hợp với cả coding follow-up lẫn system design và giúp bạn nói mạch lạc hơn trong vòng pressure.

#### 6. Zalo/VNG

| Category | Interview Reality (2025-2026) |
|---|---|
| Round count | 4-5 rounds with written OA |
| Expected timeline | 2-6 weeks |
| Coding | Medium; CS fundamentals and practical coding in written test |
| System design | Increasingly important at senior (100M+ user scale context) |
| Behavioral | Medium; team fit and execution reliability |
| Unique process trait | Interview may be in Vietnamese or English; Go + React stack alignment; seniors may present architecture |
| Frontend note | Realtime UX, performance, browser fundamentals, practical JS/TS debugging |
| Backend note | Go, distributed messaging, push delivery, ranking/feeds, caching |
| Interview language | Vietnamese or English depending panel/team |
| Domain pressure | Messaging, social/newsfeed, notifications, mini-app ecosystem |

**Round-by-round expectations**

| Round | Goal | Candidate Should Demonstrate | Common Failure Mode |
|---|---|---|---|
| Written OA | CS fundamentals and coding baseline | Solid algorithm logic + core CS recall | Rushed answers with avoidable mistakes |
| Technical round 1 | Language and system fundamentals | Go/React practical reasoning and debugging | Theory-only answers, weak implementation details |
| Technical round 2 | Deeper architecture/problem solving | Messaging/notification/feed scalability thinking | No concrete bottleneck mitigation |
| System design (senior emphasis) | Large-user design capability | Capacity planning + reliability + trade-offs | No quantified assumptions |
| Manager/culture round | Execution fit | Ownership stories and collaboration maturity | Vague impact statements |

**Preparation focus split (suggested weekly effort)**

| Track | Coding | System Design | Behavioral/Communication | Domain Study |
|---|---:|---:|---:|---:|
| Suggested split | 25% | 35% | 25% | 15% |

**Vietnamese prep note**

- **Zalo/VNG (gợi ý):** Tập trả lời theo format `context → constraints → options → decision → trade-off → metric`. Cấu trúc này hợp với cả coding follow-up lẫn system design và giúp bạn nói mạch lạc hơn trong vòng pressure.

### 2.3 Normalized difficulty scale

| Level | Coding Interpretation | Design Interpretation | Behavioral Interpretation |
|---|---|---|---|
| Low | Basic implementation, straightforward edge cases | Basic component/service decomposition | Simple collaboration examples |
| Low-Medium | Practical coding task with moderate constraints | Product architecture and trade-offs at feature level | Values fit + communication clarity |
| Medium | Core DS/Algo patterns, complexity explanation expected | Clear NFRs (latency, reliability, cost) | Structured STAR stories |
| Medium-Hard | Multi-constraint algorithms and optimization follow-ups | Cross-service interactions, failure-mode handling | Conflict and ownership under ambiguity |
| Hard | Trick-heavy reasoning + deep correctness pressure | High + low-level architecture with scaling math | Leadership narratives tied to measurable impact |

---

## 3. Industry Trends 2025-2026 / Xu Hướng Ngành

### 3.1 Trend summary table

| Trend | What is changing | Why it matters | 2025-2026 Window |
|---|---|---|---|
| AI-assisted interviews | Canva explicitly allows/requires AI usage in selected interview steps; Meta pilots AI-assisted coding in controlled experiments; Google generally prohibits external AI tools during coding rounds. | Candidates need a policy-adaptive prep strategy instead of one default workflow. | 2025-2026 |
| Live coding vs take-home split | Large infra-heavy companies still prefer synchronous live coding; product + async cultures increase take-home and Loom-style walkthroughs. | Preparation must include both "thinking aloud" and "artifact quality" modes. | 2025-2026 |
| System design as baseline for senior | Senior loops increasingly include at least one architecture/design round regardless of title track. | Without design fluency, senior candidates stall even with strong coding performance. | 2025-2026 |
| Behavioral signal gets more structured | Values interviews use explicit rubrics (ownership, conflict handling, decision quality). | STAR stories must include trade-offs and measurable impact, not only effort. | 2025-2026 |
| Remote/async growth | Distributed teams optimize candidate funnel through asynchronous checkpoints and recorded presentations. | Written communication and async clarity become interview skills, not just job skills. | 2025-2026 |
| Domain-realistic prompts | More prompts simulate actual product workflows (payments, compliance, messaging reliability). | Candidates should practice domain decomposition, not only abstract toy systems. | 2025-2026 |
| Evidence-based engineering expectation | Interviewers increasingly ask for metrics: p95 latency, error budget, SLO, conversion impact. | Candidates who quantify decisions appear more senior and operationally credible. | 2025-2026 |

### 3.2 AI-assisted interview policy matrix

| Company | AI Tool Policy in Interview | Candidate Adaptation Strategy | Risk if Ignored |
|---|---|---|---|
| Google | Generally prohibits AI tools in coding rounds | Practice no-assistant problem solving in plain editor | Disqualification or integrity concern |
| Microsoft | Team-dependent; usually restricted in live coding | Confirm policy early with recruiter; practice both modes | Process mismatch and confusion in session |
| Grab | Mostly traditional live coding restrictions | Train fast manual coding + verbal reasoning | Slower delivery under timed assessment |
| Axon | Practical tasks may allow normal engineering workflow unless restricted | Document tool usage transparently and justify decisions | Perceived over-reliance without understanding |
| Employment Hero | AI proficiency increasingly viewed as practical skill | Show responsible use + critical review of AI output | Missed opportunity to demonstrate modern workflow |
| Zalo/VNG | Usually traditional assessments; AI use often restricted | Prioritize fundamentals and clean manual implementation | Underperformance in written/live core tests |

**Tiếng Việt (ý chính):** Không có “một chuẩn AI” cho mọi công ty. Bạn cần checklist trước mỗi loop: (1) AI được phép không? (2) được phép ở round nào? (3) nếu dùng, cần disclose thế nào?

### 3.3 Live coding vs take-home in practice

| Company Type | Typical Preference | Interviewer Intent | Best Candidate Mode |
|---|---|---|---|
| Big-tech platform | Live coding + follow-up pressure | Evaluate real-time reasoning and adaptability | Think aloud, derive constraints early, test continuously |
| Product org with distributed teams | Hybrid (live + async artifacts) | Evaluate execution + communication quality | Submit clean artifacts + concise walkthrough |
| Consulting/safety-critical product teams | Work sample + deep review | Evaluate production readiness and discipline | Explain maintainability, tests, and failure handling |

### 3.4 Behavioral interview evolution

| Old Pattern | 2025-2026 Pattern | Candidate Upgrade Needed |
|---|---|---|
| “Tell me about yourself” open chat | Competency rubric scoring | Build story bank mapped to competencies |
| Generic teamwork examples | Evidence-based stories with metrics | Add measurable outcomes and trade-offs |
| Light culture chat | Explicit values screen | Research company values and align authentic examples |
| Minimal writing signal | Async writing/video tasks | Practice concise written communication |

---

## 4. Priority Matrix / Ma Trận Ưu Tiên

### 4.1 Core weight matrix (⭐ scale)

| Company | Coding | System Design | Behavioral | Communication/Clarity | Domain Knowledge |
|---|---|---|---|---|---|
| Google | ★★★★★ | ★★★★★ | ★★☆☆☆ | ★★★★☆ | ★★★☆☆ |
| Microsoft | ★★★★☆ | ★★★★☆ | ★★☆☆☆ | ★★★★☆ | ★★★☆☆ |
| Grab | ★★★★☆ | ★★★★★ | ★★★☆☆ | ★★★★☆ | ★★★★★ |
| Axon | ★★★☆☆ | ★★★★☆ | ★★★★★ | ★★★☆☆ | ★★★★★ |
| Employment Hero | ★★☆☆☆ | ★★★☆☆ | ★★★★★ | ★★★★☆ | ★★★★☆ |
| Zalo/VNG | ★★★☆☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★★★★ |

### 4.2 Senior vs Mid-level emphasis shift

| Company | Mid-level Pattern | Senior Pattern | What Changes Most |
|---|---|---|---|
| Google | Coding dominates, some design | Coding still strong + deep system design | Design depth + leadership reasoning |
| Microsoft | Balanced coding/domain | More architecture + compliance depth | Enterprise constraints and decision accountability |
| Grab | Coding + practical design | Heavy architecture + domain complexity | Multi-service reliability and consistency |
| Axon | Practical coding quality | Reliability + mission alignment increase | Safety-critical decisions and ownership |
| Employment Hero | Product execution + values | Values + architecture communication | Async leadership and cross-team clarity |
| Zalo/VNG | CS + practical engineering | Scale architecture presentation expected | Large-user operational thinking |

### 4.3 Risk matrix (what most often blocks offers)

| Failure Pattern | Google | Microsoft | Grab | Axon | Employment Hero | Zalo/VNG |
|---|---|---|---|---|---|---|
| Weak baseline algorithms | High risk | Medium risk | High risk | Low risk | Low risk | Medium risk |
| No architecture trade-offs | High risk | High risk | High risk | High risk | Medium risk | High risk |
| Poor behavioral evidence | Medium risk | Medium risk | Medium risk | High risk | Very high risk | Medium risk |
| Weak async communication | Low risk | Medium risk | Medium risk | Medium risk | Very high risk | Low risk |
| No domain realism | Medium risk | Medium risk | Very high risk | High risk | Medium risk | High risk |

---

## 5. Knowledge Areas by Role / Kiến Thức Theo Vai Trò

### 5.1 Frontend (React/TypeScript) — All Companies

#### 5.1.1 Core frontend knowledge map

| Knowledge Area | Required Depth | Most Sensitive Companies | Why It Matters in Interview |
|---|---|---|---|
| JavaScript execution model | Call stack, task queues, event loop, microtask/macrotask ordering | Google, Zalo/VNG | Core interview discriminator for debugging quality |
| Closures and memory | Leak patterns, retention paths, lifecycle cleanup | Google, Microsoft, Zalo/VNG | Frequently used as trick/foundational question pair |
| Asynchronous control flow | Promise combinators, cancellation strategies, backpressure handling in UI | Grab, Microsoft, Google | Required for resilient frontend workflows |
| TypeScript type modeling | Generics, mapped/conditional types, inference constraints | Microsoft, Employment Hero, Axon | Signals codebase scalability mindset |
| React hooks internals | Render cycle, stale closures, dependency correctness | All companies | Baseline for FE interviews |
| React architecture patterns | Container/presentational, compound components, context boundaries | Axon, Grab, Employment Hero | Used to assess maintainability reasoning |
| Suspense and concurrent rendering | Loading boundaries, fallback UX, server/client boundaries | Google, Microsoft, Grab | Senior FE design expectation |
| State management trade-offs | Local vs global vs server state and cache invalidation | Grab, Employment Hero, Microsoft | Common practical design discussion |
| Browser rendering pipeline | Style/layout/paint/composite and performance implications | Google, Zalo/VNG, Grab | Used in optimization and diagnostics questions |
| Web APIs and security | Storage, CORS, CSP, XSS prevention, auth token handling | Microsoft, Axon, Employment Hero | Critical for product-grade FE roles |
| FE system design | Design systems, micro-frontends, data-fetching architecture | Grab, Microsoft, Google | Mandatory for senior tracks |

#### 5.1.2 JavaScript topics checklist

| Topic | Baseline | Senior Expectation | Related Docs |
|---|---|---|---|
| Scope, hoisting, TDZ, lexical environment | Can explain concept and solve practical bug | Can reason about trade-offs and edge cases under load | `docs/fe-track/01-javascript/`, `docs/shared/01-cs-fundamentals/` |
| Closures and practical memory leak prevention | Can explain concept and solve practical bug | Can reason about trade-offs and edge cases under load | `docs/fe-track/01-javascript/`, `docs/shared/01-cs-fundamentals/` |
| `this` binding across call/apply/bind/arrow functions | Can explain concept and solve practical bug | Can reason about trade-offs and edge cases under load | `docs/fe-track/01-javascript/`, `docs/shared/01-cs-fundamentals/` |
| Prototype chain and object model internals | Can explain concept and solve practical bug | Can reason about trade-offs and edge cases under load | `docs/fe-track/01-javascript/`, `docs/shared/01-cs-fundamentals/` |
| Event loop ordering and starvation scenarios | Can explain concept and solve practical bug | Can reason about trade-offs and edge cases under load | `docs/fe-track/01-javascript/`, `docs/shared/01-cs-fundamentals/` |
| Async patterns: Promise.all/allSettled/race/any trade-offs | Can explain concept and solve practical bug | Can reason about trade-offs and edge cases under load | `docs/fe-track/01-javascript/`, `docs/shared/01-cs-fundamentals/` |
| Error handling and retry strategies in UI workflows | Can explain concept and solve practical bug | Can reason about trade-offs and edge cases under load | `docs/fe-track/01-javascript/`, `docs/shared/01-cs-fundamentals/` |
| Module systems (ESM/CJS), tree-shaking implications | Can explain concept and solve practical bug | Can reason about trade-offs and edge cases under load | `docs/fe-track/01-javascript/`, `docs/shared/01-cs-fundamentals/` |
| Immutability, structural sharing, and performance | Can explain concept and solve practical bug | Can reason about trade-offs and edge cases under load | `docs/fe-track/01-javascript/`, `docs/shared/01-cs-fundamentals/` |
| Debounce/throttle/cancellation with AbortController | Can explain concept and solve practical bug | Can reason about trade-offs and edge cases under load | `docs/fe-track/01-javascript/`, `docs/shared/01-cs-fundamentals/` |
| Deep cloning pitfalls and serialization constraints | Can explain concept and solve practical bug | Can reason about trade-offs and edge cases under load | `docs/fe-track/01-javascript/`, `docs/shared/01-cs-fundamentals/` |
| Time-space complexity for common data transformations | Can explain concept and solve practical bug | Can reason about trade-offs and edge cases under load | `docs/fe-track/01-javascript/`, `docs/shared/01-cs-fundamentals/` |

#### 5.1.3 TypeScript depth

| Layer | Mid-level Expectation | Senior Expectation | Typical Interview Prompt |
|---|---|---|---|
| Types and interfaces | Correct use of union/intersection and interface boundaries | Type-driven API design with minimal leakage | “Model this payload and enforce invariants” |
| Generics | Reusable utility function typing | Advanced generic constraints and inference control | “Write strongly-typed hook/helper without `any`” |
| Utility and mapped types | Use Pick/Omit/Partial/Record properly | Compose custom mapped/conditional utility types | “Refactor duplicated types to reusable abstractions” |
| Runtime validation interplay | Understand compile-time vs runtime | Integrate zod/io-ts style runtime checks | “How do you keep API contract safe at runtime?” |
| Type narrowing | Use type guards correctly | Build robust discriminated unions for state machines | “Design UI state model with impossible states prevented” |

#### 5.1.4 React specifics

| React Topic | Interview Signal | Company Emphasis |
|---|---|---|
| Hooks correctness (dependencies, stale closure, cleanup) | Shows production React maturity | All (higher at Grab/Microsoft/Axon) |
| Rendering model and reconciliation heuristics | Shows production React maturity | All (higher at Grab/Microsoft/Axon) |
| Suspense boundaries and async UX strategy | Shows production React maturity | All (higher at Grab/Microsoft/Axon) |
| Server components vs client components boundaries | Shows production React maturity | All (higher at Grab/Microsoft/Axon) |
| State placement and cache ownership (UI state vs server state) | Shows production React maturity | All (higher at Grab/Microsoft/Axon) |
| Composition patterns and reusable component APIs | Shows production React maturity | All (higher at Grab/Microsoft/Axon) |
| Performance diagnostics (memoization when justified) | Shows production React maturity | All (higher at Grab/Microsoft/Axon) |
| Testing strategy (unit/integration/e2e balance) | Shows production React maturity | All (higher at Grab/Microsoft/Axon) |
| Accessibility in component primitives | Shows production React maturity | All (higher at Grab/Microsoft/Axon) |
| Error boundaries and resilience patterns | Shows production React maturity | All (higher at Grab/Microsoft/Axon) |

#### 5.1.5 Browser/Web APIs and FE system design

| Area | Must Know | Senior Add-on |
|---|---|---|
| Rendering pipeline | Style → layout → paint → composite basics | Diagnose bottlenecks using profiling traces and budgets |
| Network layer | HTTP caching, CDN, compression, connection reuse | Multi-region edge strategy and consistency trade-offs |
| Storage | Cookies/localStorage/sessionStorage/IndexedDB trade-offs | Data lifecycle and privacy/security constraints |
| Security | XSS/CSRF/CORS/CSP fundamentals | Threat modeling and defense in depth by architecture |
| Offline/reliability | Service worker fundamentals and fallback UX | Background sync, conflict resolution, eventual consistency |
| FE architecture | Layered app structure and boundaries | Micro-frontend governance and shared platform contracts |

### 5.2 Backend (Go) — All Companies

#### 5.2.1 Core backend knowledge map

| Knowledge Area | Required Depth | Most Sensitive Companies | Why It Matters in Interview |
|---|---|---|---|
| Go concurrency model | Goroutines, channels, worker pools, cancellation with context | Grab, Zalo/VNG | High-frequency practical backend topic |
| Go interfaces and design | Interface boundaries, testability, dependency inversion | Axon, Employment Hero, Grab | Signals maintainability and API design maturity |
| Memory and performance | Escape analysis, GC behavior, profiling with pprof | Zalo/VNG, Grab, Google | Asked at senior/backend-heavy loops |
| Distributed system fundamentals | Consistency models, consensus basics, CAP trade-offs | Google, Microsoft, Grab | Baseline for design rounds |
| Data modeling and storage | Indexing strategy, partitioning, read/write path design | Grab, Microsoft, Zalo/VNG | Directly tied to throughput and reliability |
| Event-driven architecture | Kafka patterns, idempotency, retries, DLQ, replay | Grab, Zalo/VNG, Microsoft | Domain-realistic production prompts |
| API and contract design | Versioning, backward compatibility, schema evolution | Employment Hero, Axon, Microsoft | Often in practical architecture rounds |
| Reliability engineering | SLO/SLI, error budget, graceful degradation, incident response | Google, Axon, Grab | Differentiator for L5+/senior candidates |
| Security and compliance | Authn/authz, audit trails, PII handling, GDPR concerns | Microsoft, Employment Hero, Axon | Critical in enterprise/product interviews |
| System design execution | Requirement framing, bottleneck analysis, trade-off narration | All companies | Universal differentiator |

#### 5.2.2 Go-specific checklist

| Topic | Baseline | Senior Expectation | Related Docs |
|---|---|---|---|
| Value vs pointer semantics and escape analysis basics | Explain and implement cleanly | Quantify impact and reason under production constraints | `docs/be-track/01-golang/`, `docs/shared/01-cs-fundamentals/` |
| Interface design and implicit implementation pitfalls | Explain and implement cleanly | Quantify impact and reason under production constraints | `docs/be-track/01-golang/`, `docs/shared/01-cs-fundamentals/` |
| Channel patterns (fan-in/fan-out, worker pools, cancellation) | Explain and implement cleanly | Quantify impact and reason under production constraints | `docs/be-track/01-golang/`, `docs/shared/01-cs-fundamentals/` |
| Context propagation and timeout discipline | Explain and implement cleanly | Quantify impact and reason under production constraints | `docs/be-track/01-golang/`, `docs/shared/01-cs-fundamentals/` |
| Error handling patterns and wrapped errors | Explain and implement cleanly | Quantify impact and reason under production constraints | `docs/be-track/01-golang/`, `docs/shared/01-cs-fundamentals/` |
| Goroutine leak detection and prevention | Explain and implement cleanly | Quantify impact and reason under production constraints | `docs/be-track/01-golang/`, `docs/shared/01-cs-fundamentals/` |
| Synchronization primitives (mutex/RWMutex/atomic) selection | Explain and implement cleanly | Quantify impact and reason under production constraints | `docs/be-track/01-golang/`, `docs/shared/01-cs-fundamentals/` |
| Memory profiling and CPU profiling with pprof | Explain and implement cleanly | Quantify impact and reason under production constraints | `docs/be-track/01-golang/`, `docs/shared/01-cs-fundamentals/` |
| Testing patterns (table-driven, integration, race detector) | Explain and implement cleanly | Quantify impact and reason under production constraints | `docs/be-track/01-golang/`, `docs/shared/01-cs-fundamentals/` |
| API and package design for maintainability | Explain and implement cleanly | Quantify impact and reason under production constraints | `docs/be-track/01-golang/`, `docs/shared/01-cs-fundamentals/` |
| Backpressure and queue management under burst traffic | Explain and implement cleanly | Quantify impact and reason under production constraints | `docs/be-track/01-golang/`, `docs/shared/01-cs-fundamentals/` |
| Observability instrumentation (logs/metrics/traces) | Explain and implement cleanly | Quantify impact and reason under production constraints | `docs/be-track/01-golang/`, `docs/shared/01-cs-fundamentals/` |

#### 5.2.3 System design topics for backend interviews

| Topic | Core Question | Strong Answer Signal |
|---|---|---|
| Rate limiting and abuse protection | “How would you design this under scale/failure?” | Constraints first, alternatives, decision rationale, metrics |
| Idempotency and exactly-once myths | “How would you design this under scale/failure?” | Constraints first, alternatives, decision rationale, metrics |
| Queue-based async processing and retries | “How would you design this under scale/failure?” | Constraints first, alternatives, decision rationale, metrics |
| Data partitioning/sharding and hot-key mitigation | “How would you design this under scale/failure?” | Constraints first, alternatives, decision rationale, metrics |
| Caching strategy and invalidation correctness | “How would you design this under scale/failure?” | Constraints first, alternatives, decision rationale, metrics |
| Consistency/availability trade-offs in user-facing systems | “How would you design this under scale/failure?” | Constraints first, alternatives, decision rationale, metrics |
| Event-driven architecture and schema evolution | “How would you design this under scale/failure?” | Constraints first, alternatives, decision rationale, metrics |
| Observability and incident response loop | “How would you design this under scale/failure?” | Constraints first, alternatives, decision rationale, metrics |
| Disaster recovery, backup, restore, replay | “How would you design this under scale/failure?” | Constraints first, alternatives, decision rationale, metrics |
| Security boundaries and audit requirements | “How would you design this under scale/failure?” | Constraints first, alternatives, decision rationale, metrics |

#### 5.2.4 CS fundamentals still tested across roles

| CS Area | Why It Appears in Interviews | Prep Source |
|---|---|---|
| Algorithms and complexity | Baseline problem-solving and optimization literacy | `docs/shared/01-cs-fundamentals/algorithms-theory.md` |
| Data structures | Correctness and runtime trade-off decisions | `docs/shared/01-cs-fundamentals/complexity-analysis.md` |
| Networking | Real-world distributed system behavior and failure modes | `docs/shared/01-cs-fundamentals/networking-theory.md` |
| Operating systems | Concurrency, scheduling, memory, and process model understanding | `docs/shared/01-cs-fundamentals/os-theory.md` |
| Databases | Query path, indexing, transactions, and consistency trade-offs | `docs/shared/03-database/database-theory.md` |

---

## 6. Preparation Strategy / Chiến Lược Chuẩn Bị

### 6.1 Universal differentiator

The most consistent differentiator across all six companies is your ability to explain **WHY** you chose an architecture or implementation path — not only WHAT you built.

**Tiếng Việt:** Điểm khác biệt lớn nhất không phải “thuộc nhiều câu LeetCode”, mà là giải thích được: ràng buộc nào quan trọng, lựa chọn nào bị loại, vì sao quyết định hiện tại là hợp lý theo context.

| Interview Moment | Weak Response Pattern | Strong Response Pattern |
|---|---|---|
| Coding follow-up | “I think this is optimal.” | “I considered O(n²) brute force for clarity, then moved to O(n log n) due to input bound 1e5 and memory budget.” |
| System design choice | “Use Kafka/Redis because common.” | “Given burst traffic and retry semantics, queue + idempotent consumer gives controlled failure handling with predictable recovery.” |
| Behavioral conflict question | “We discussed and solved it.” | “I aligned on decision criteria, documented options, then tracked measurable outcome after rollout.” |

### 6.2 Study order recommendations (with cross references)

| Study Phase | Objective | Primary Docs | Output Artifact |
|---|---|---|---|
| Phase A: Fundamentals refresh | Rebuild algorithm + systems baseline | `docs/shared/01-cs-fundamentals/`, `docs/shared/03-database/` | Daily problem log + error patterns |
| Phase B: Design foundations | Build reusable architecture framework | `docs/shared/02-system-design/`, `docs/be-track/04-be-system-design/` | Design template for any prompt |
| Phase C: Role depth | FE or BE specialization | `docs/fe-track/`, `docs/be-track/` | Company-specific weak-point tracker |
| Phase D: AI/process adaptation | Match tool policy and workflow expectations | `docs/shared/06-ai-and-agents/` | AI-policy checklist per target company |
| Phase E: Company simulation | Build loop-level readiness | `docs/shared/07-company-guides/`, `docs/fe-track/10-company-guide.md`, `docs/be-track/05-company-guide.md` | Mock loop scorecards |

### 6.3 Timeline planning

#### 6.3.1 12-week plan (deep rebuild)

| Week | Primary Goal | Coding Focus | System Design Focus | Behavioral/Communication Focus |
|---:|---|---|---|---|
| 1 | Baseline assessment + gap map | Baseline diagnostics | Concept refresh | Communication hygiene |
| 2 | Algorithms foundations (arrays/strings/two pointers) | Pattern drills + retrospective | Concept refresh | Communication hygiene |
| 3 | Trees/graphs + recursion patterns | Pattern drills + retrospective | Concept refresh | Communication hygiene |
| 4 | System design fundamentals + requirement framing | Maintenance set | Framework build + bottleneck analysis | Communication hygiene |
| 5 | Role-specific depth (React/TS or Go internals) | Maintenance set | Concept refresh | Communication hygiene |
| 6 | Domain systems (chat/payments/notifications) | Maintenance set | Framework build + bottleneck analysis | Communication hygiene |
| 7 | Behavioral story bank draft | Maintenance set | Concept refresh | Story drafting/practice |
| 8 | Company-specific simulation set 1 | Pattern drills + retrospective | Framework build + bottleneck analysis | Story drafting/practice |
| 9 | Company-specific simulation set 2 | Pattern drills + retrospective | Framework build + bottleneck analysis | Story drafting/practice |
| 10 | Mock interviews round 1 | Pattern drills + retrospective | Framework build + bottleneck analysis | Story drafting/practice |
| 11 | Mock interviews round 2 + debrief | Pattern drills + retrospective | Framework build + bottleneck analysis | Story drafting/practice |
| 12 | Final polish, pacing, sleep + logistics | Baseline diagnostics | Concept refresh | Story drafting/practice |

#### 6.3.2 8-week plan (focused upgrade)

| Week | Objective | Deliverable |
|---:|---|---|
| 1 | Gap triage + high-yield topic map | Skill-gap heatmap by company |
| 2 | Coding pattern consolidation | 30-problem curated set solved + reviewed |
| 3 | System design core loop | 8 system prompts with structured write-ups |
| 4 | Role specialization sprint | Role-specific capstone (FE or BE) |
| 5 | Behavioral + values stories | 12 STAR stories mapped to competencies |
| 6 | Company-tailored prep | Company-tailored mock scripts |
| 7 | Full mock loops | Two full interview simulations |
| 8 | Final review and execution plan | Final execution notebook |

#### 6.3.3 4-week plan (interview imminent)

| Week | Focus | Hard Constraint |
|---:|---|---|
| 1 | Critical weak points only | No new broad topics; only high-impact gaps |
| 2 | High-frequency coding templates | Daily timed coding + review cycle |
| 3 | Top 8 system design scenarios | Design drills must include scaling numbers |
| 4 | Behavioral rehearsal + interview logistics | Sleep schedule + interview-day protocol locked |

### 6.4 Practice methods that convert into offer signals

| Practice Method | Frequency | What to Measure | Why It Works |
|---|---|---|---|
| Timed coding sessions | 4-6x/week | Correctness + completion under time | Builds pressure tolerance and pacing |
| Verbalized problem solving | 2-3x/week | Clarity of thought process | Mirrors real interviewer evaluation behavior |
| System design whiteboard drills | 2-4x/week | Requirement framing + trade-offs + metrics | Converts abstract knowledge to interview-ready narratives |
| Mock behavioral interviews | 1-2x/week | Story depth + consistency + reflection quality | Prevents vague answers in final rounds |
| Async write-up + Loom rehearsal | 1x/week | Concision and structure | Critical for Employment Hero / distributed teams |
| Company-specific simulation days | Weekly | Loop-level stamina and context switching | Reduces surprise across different interview formats |

### 6.5 Company-tailored weekly mix template

| Company | Weekly Coding Set | Weekly Design Set | Weekly Behavioral Set | Weekly Domain Drill |
|---|---|---|---|---|
| Google | 8-12 hard/medium-hard DS/Algo problems | 2 architecture prompts (L5 style) | 3 Googleyness stories | 1 product-scale decomposition (Search/Docs/Ads) |
| Microsoft | 6-10 medium DS/Algo + binary trees | 2 design prompts with compliance lens | 2 collaboration-growth stories | 1 Azure/enterprise scenario |
| Grab | 6-10 medium-hard problems + OA simulation | 3 SEA-scale domain designs | 2 ownership-impact stories | 2 ride/food/payment reliability drills |
| Axon | 3-5 practical coding tasks + refactor | 2 reliability/safety prompts | 3 mission-alignment stories | 1 work-sample quality review |
| Employment Hero | 3-5 practical product tasks + async walkthrough | 1-2 product architecture prompts | 4 EH values stories | 2 async communication exercises |
| Zalo/VNG | 5-8 medium coding + written OA style | 2 large-user messaging/feed prompts | 2 team-execution stories | 2 Go+React stack scenarios |

### 6.6 Interview-day execution checklist

1. Confirm interview format, allowed tools, and language mode (EN/VI).
2. Prepare one-page note with STAR story index and design framework reminders.
3. For coding rounds: restate problem, define constraints, propose baseline before optimizing.
4. For design rounds: state assumptions (QPS, p95 latency, data retention, failure targets).
5. For behavioral rounds: include conflict, decision criteria, measurable outcome, and learning.
6. Close each round with summary and explicit trade-off statement.
7. Write immediate debrief after each round (what went well, what to adjust).

---

## 7. Cross-References / Tham Khảo

### 7.1 Required cross-reference map

| Topic | Link | How to Use in Prep |
|---|---|---|
| Algorithms and Data Structures | `docs/shared/01-cs-fundamentals/` | Rebuild core reasoning for coding rounds across all companies |
| System Design Theory | `docs/shared/02-system-design/` | Build reusable design framework before company-specific domain drills |
| AI and Agents Knowledge | `docs/shared/06-ai-and-agents/` | Prepare for policy-divergent AI interview environments and modern workflows |
| Company Guides | `docs/shared/07-company-guides/` | Map loop-specific expectations and behavioral rubrics |
| Backend system design problems | `docs/be-track/04-be-system-design/` | Practice Go/backend architecture prompts with realistic constraints |
| Frontend specialization track | `docs/fe-track/` | Deepen React/TypeScript/browser/system design topics |

### 7.2 Additional practical references in this repository

| Practical Guide | Link | Purpose |
|---|---|---|
| FE company guide | `docs/fe-track/10-company-guide.md` | Concrete FE interview expectations by company |
| BE company guide | `docs/be-track/05-company-guide.md` | Concrete BE (Go) interview expectations by company |
| FE roadmap | `docs/fe-track/00-study-roadmap.md` | Sequenced FE learning path |
| BE roadmap | `docs/be-track/00-study-roadmap.md` | Sequenced BE learning path |
| Shared theory index | `docs/shared/THEORY-KNOWLEDGE-INDEX.md` | Central navigation for theoretical foundations |

---

## Appendix A. Company-specific prompt bank / Ngân hàng đề luyện theo công ty

> Mục tiêu appendix: tạo bộ đề luyện có cấu trúc để chạy mock interview theo vòng. Mỗi prompt nên được luyện theo format: assumptions → solution → trade-offs → failure modes → metrics.

### A.1 Google prompt bank

| # | Prompt | Round Type | Difficulty | Success Criteria |
|---:|---|---|---|---|
| 1 | Design an interview scheduling platform that scales globally with timezone correctness. | System Design | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 2 | Implement and explain a rate limiter that supports burst and sustained traffic limits. | Coding | Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 3 | Design a notification delivery system with retries, deduplication, and observability. | System Design | Medium | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 4 | Given production incident symptoms, propose diagnosis steps and rollback strategy. | System Design | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 5 | Refactor a legacy module into testable boundaries; justify migration sequencing. | Coding | Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 6 | Build/describe an idempotent API workflow under retry storms. | Coding | Medium | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 7 | Design data retention and deletion policy with privacy/compliance constraints. | System Design | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 8 | Model a high-traffic feed timeline with read/write optimization trade-offs. | System Design | Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 9 | Explain trade-offs of sync vs async workflows for user-facing operations. | System Design | Medium | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 10 | Present a project where constraints changed mid-flight and you adapted architecture. | Behavioral | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |

### A.2 Microsoft prompt bank

| # | Prompt | Round Type | Difficulty | Success Criteria |
|---:|---|---|---|---|
| 1 | Design an interview scheduling platform that scales globally with timezone correctness. | System Design | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 2 | Implement and explain a rate limiter that supports burst and sustained traffic limits. | Coding | Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 3 | Design a notification delivery system with retries, deduplication, and observability. | System Design | Medium | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 4 | Given production incident symptoms, propose diagnosis steps and rollback strategy. | System Design | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 5 | Refactor a legacy module into testable boundaries; justify migration sequencing. | Coding | Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 6 | Build/describe an idempotent API workflow under retry storms. | Coding | Medium | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 7 | Design data retention and deletion policy with privacy/compliance constraints. | System Design | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 8 | Model a high-traffic feed timeline with read/write optimization trade-offs. | System Design | Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 9 | Explain trade-offs of sync vs async workflows for user-facing operations. | System Design | Medium | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 10 | Present a project where constraints changed mid-flight and you adapted architecture. | Behavioral | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |

### A.3 Grab prompt bank

| # | Prompt | Round Type | Difficulty | Success Criteria |
|---:|---|---|---|---|
| 1 | Design an interview scheduling platform that scales globally with timezone correctness. | System Design | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 2 | Implement and explain a rate limiter that supports burst and sustained traffic limits. | Coding | Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 3 | Design a notification delivery system with retries, deduplication, and observability. | System Design | Medium | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 4 | Given production incident symptoms, propose diagnosis steps and rollback strategy. | System Design | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 5 | Refactor a legacy module into testable boundaries; justify migration sequencing. | Coding | Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 6 | Build/describe an idempotent API workflow under retry storms. | Coding | Medium | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 7 | Design data retention and deletion policy with privacy/compliance constraints. | System Design | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 8 | Model a high-traffic feed timeline with read/write optimization trade-offs. | System Design | Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 9 | Explain trade-offs of sync vs async workflows for user-facing operations. | System Design | Medium | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 10 | Present a project where constraints changed mid-flight and you adapted architecture. | Behavioral | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |

### A.4 Axon prompt bank

| # | Prompt | Round Type | Difficulty | Success Criteria |
|---:|---|---|---|---|
| 1 | Design an interview scheduling platform that scales globally with timezone correctness. | System Design | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 2 | Implement and explain a rate limiter that supports burst and sustained traffic limits. | Coding | Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 3 | Design a notification delivery system with retries, deduplication, and observability. | System Design | Medium | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 4 | Given production incident symptoms, propose diagnosis steps and rollback strategy. | System Design | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 5 | Refactor a legacy module into testable boundaries; justify migration sequencing. | Coding | Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 6 | Build/describe an idempotent API workflow under retry storms. | Coding | Medium | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 7 | Design data retention and deletion policy with privacy/compliance constraints. | System Design | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 8 | Model a high-traffic feed timeline with read/write optimization trade-offs. | System Design | Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 9 | Explain trade-offs of sync vs async workflows for user-facing operations. | System Design | Medium | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 10 | Present a project where constraints changed mid-flight and you adapted architecture. | Behavioral | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |

### A.5 Employment Hero prompt bank

| # | Prompt | Round Type | Difficulty | Success Criteria |
|---:|---|---|---|---|
| 1 | Design an interview scheduling platform that scales globally with timezone correctness. | System Design | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 2 | Implement and explain a rate limiter that supports burst and sustained traffic limits. | Coding | Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 3 | Design a notification delivery system with retries, deduplication, and observability. | System Design | Medium | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 4 | Given production incident symptoms, propose diagnosis steps and rollback strategy. | System Design | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 5 | Refactor a legacy module into testable boundaries; justify migration sequencing. | Coding | Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 6 | Build/describe an idempotent API workflow under retry storms. | Coding | Medium | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 7 | Design data retention and deletion policy with privacy/compliance constraints. | System Design | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 8 | Model a high-traffic feed timeline with read/write optimization trade-offs. | System Design | Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 9 | Explain trade-offs of sync vs async workflows for user-facing operations. | System Design | Medium | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 10 | Present a project where constraints changed mid-flight and you adapted architecture. | Behavioral | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |

### A.6 Zalo/VNG prompt bank

| # | Prompt | Round Type | Difficulty | Success Criteria |
|---:|---|---|---|---|
| 1 | Design an interview scheduling platform that scales globally with timezone correctness. | System Design | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 2 | Implement and explain a rate limiter that supports burst and sustained traffic limits. | Coding | Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 3 | Design a notification delivery system with retries, deduplication, and observability. | System Design | Medium | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 4 | Given production incident symptoms, propose diagnosis steps and rollback strategy. | System Design | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 5 | Refactor a legacy module into testable boundaries; justify migration sequencing. | Coding | Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 6 | Build/describe an idempotent API workflow under retry storms. | Coding | Medium | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 7 | Design data retention and deletion policy with privacy/compliance constraints. | System Design | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 8 | Model a high-traffic feed timeline with read/write optimization trade-offs. | System Design | Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 9 | Explain trade-offs of sync vs async workflows for user-facing operations. | System Design | Medium | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |
| 10 | Present a project where constraints changed mid-flight and you adapted architecture. | Behavioral | Medium-Hard | Clear assumptions, coherent architecture, concrete metrics, explicit trade-offs |

## Appendix B. Weekly scorecard template / Mẫu chấm điểm hàng tuần

| Dimension | Score (1-5) | Evidence | Next Action |
|---|---:|---|---|
| Coding correctness under time pressure |  |  |  |
| Complexity analysis clarity |  |  |  |
| System decomposition quality |  |  |  |
| Trade-off explanation quality |  |  |  |
| Behavioral story specificity |  |  |  |
| Domain knowledge realism |  |  |  |
| Communication and pacing |  |  |  |
| Language fluency for target loop (EN/VI) |  |  |  |
| Async writing/video explanation quality |  |  |  |
| Recovery quality after interviewer pushback |  |  |  |

## Appendix C. 60 high-frequency interview mistakes and fixes

| # | Mistake | Quick Fix |
|---:|---|---|
| 1 | Jumping into coding without clarifying constraints | Add a pre-round and in-round checklist item specifically preventing this failure |
| 2 | Ignoring input bounds and complexity expectations | Add a pre-round and in-round checklist item specifically preventing this failure |
| 3 | No test case validation before implementation | Add a pre-round and in-round checklist item specifically preventing this failure |
| 4 | Optimizing too early and getting stuck | Add a pre-round and in-round checklist item specifically preventing this failure |
| 5 | Not handling empty/null/edge cases explicitly | Add a pre-round and in-round checklist item specifically preventing this failure |
| 6 | Failing to narrate thought process during coding | Add a pre-round and in-round checklist item specifically preventing this failure |
| 7 | Choosing data structures without justification | Add a pre-round and in-round checklist item specifically preventing this failure |
| 8 | Hand-wavy system design without scale assumptions | Add a pre-round and in-round checklist item specifically preventing this failure |
| 9 | No failure-mode analysis in architecture answers | Add a pre-round and in-round checklist item specifically preventing this failure |
| 10 | Not discussing observability in distributed designs | Add a pre-round and in-round checklist item specifically preventing this failure |
| 11 | No trade-off statement when choosing technologies | Add a pre-round and in-round checklist item specifically preventing this failure |
| 12 | Using buzzwords instead of concrete reasoning | Add a pre-round and in-round checklist item specifically preventing this failure |
| 13 | Behavioral stories with no measurable outcomes | Add a pre-round and in-round checklist item specifically preventing this failure |
| 14 | Blaming teammates in conflict stories | Add a pre-round and in-round checklist item specifically preventing this failure |
| 15 | No reflection or learning from failures | Add a pre-round and in-round checklist item specifically preventing this failure |
| 16 | Inconsistent narratives across interview rounds | Add a pre-round and in-round checklist item specifically preventing this failure |
| 17 | Ignoring company-specific values and principles | Add a pre-round and in-round checklist item specifically preventing this failure |
| 18 | Weak async written communication | Add a pre-round and in-round checklist item specifically preventing this failure |
| 19 | Poor pacing in multi-part coding questions | Add a pre-round and in-round checklist item specifically preventing this failure |
| 20 | Not verifying interviewer expectations for output format | Add a pre-round and in-round checklist item specifically preventing this failure |
| 21 | Overfitting to memorized templates | Add a pre-round and in-round checklist item specifically preventing this failure |
| 22 | No contingency plan when solution fails constraints | Add a pre-round and in-round checklist item specifically preventing this failure |
| 23 | Underestimating domain context (payments/compliance/etc.) | Add a pre-round and in-round checklist item specifically preventing this failure |
| 24 | Not asking clarifying questions in ambiguous prompts | Add a pre-round and in-round checklist item specifically preventing this failure |
| 25 | Overly verbose answers with low signal | Add a pre-round and in-round checklist item specifically preventing this failure |
| 26 | Overly short answers with no depth | Add a pre-round and in-round checklist item specifically preventing this failure |
| 27 | Not quantifying impact in project discussions | Add a pre-round and in-round checklist item specifically preventing this failure |
| 28 | Confusing consistency models in system design | Add a pre-round and in-round checklist item specifically preventing this failure |
| 29 | Ignoring data lifecycle and retention requirements | Add a pre-round and in-round checklist item specifically preventing this failure |
| 30 | Skipping security basics in architecture | Add a pre-round and in-round checklist item specifically preventing this failure |
| 31 | Treating caching as universal solution | Add a pre-round and in-round checklist item specifically preventing this failure |
| 32 | No invalidation strategy for cache-heavy designs | Add a pre-round and in-round checklist item specifically preventing this failure |
| 33 | Not considering cost and operational complexity | Add a pre-round and in-round checklist item specifically preventing this failure |
| 34 | Misusing concurrency primitives in Go/JS examples | Add a pre-round and in-round checklist item specifically preventing this failure |
| 35 | Forgetting cancellation and timeout strategies | Add a pre-round and in-round checklist item specifically preventing this failure |
| 36 | No retry backoff and idempotency planning | Add a pre-round and in-round checklist item specifically preventing this failure |
| 37 | No plan for schema evolution/versioning | Add a pre-round and in-round checklist item specifically preventing this failure |
| 38 | Mixing concerns in component/service boundaries | Add a pre-round and in-round checklist item specifically preventing this failure |
| 39 | Insufficient testing strategy discussion | Add a pre-round and in-round checklist item specifically preventing this failure |
| 40 | No rollback or migration plan for refactors | Add a pre-round and in-round checklist item specifically preventing this failure |
| 41 | Ignoring accessibility in frontend implementation | Add a pre-round and in-round checklist item specifically preventing this failure |
| 42 | Weak browser performance mental model | Add a pre-round and in-round checklist item specifically preventing this failure |
| 43 | Poor TypeScript type safety discipline | Add a pre-round and in-round checklist item specifically preventing this failure |
| 44 | Relying on `any` without rationale | Add a pre-round and in-round checklist item specifically preventing this failure |
| 45 | No explanation for choosing state management strategy | Add a pre-round and in-round checklist item specifically preventing this failure |
| 46 | No articulation of ownership and prioritization | Add a pre-round and in-round checklist item specifically preventing this failure |
| 47 | Unclear stakeholder communication examples | Add a pre-round and in-round checklist item specifically preventing this failure |
| 48 | No understanding of interview AI policy constraints | Add a pre-round and in-round checklist item specifically preventing this failure |
| 49 | Assuming tools are allowed without confirming | Add a pre-round and in-round checklist item specifically preventing this failure |
| 50 | No post-round debrief and iteration process | Add a pre-round and in-round checklist item specifically preventing this failure |
| 51 | Insufficient mock interview practice | Add a pre-round and in-round checklist item specifically preventing this failure |
| 52 | Practicing only alone and never verbalizing | Add a pre-round and in-round checklist item specifically preventing this failure |
| 53 | No bilingual practice when loop may be VN/EN | Add a pre-round and in-round checklist item specifically preventing this failure |
| 54 | Skipping recruiter alignment on level/scope | Add a pre-round and in-round checklist item specifically preventing this failure |
| 55 | Ignoring hints from interviewer and persisting wrong path | Add a pre-round and in-round checklist item specifically preventing this failure |
| 56 | Defensive reaction to feedback in live rounds | Add a pre-round and in-round checklist item specifically preventing this failure |
| 57 | No summary at end of answer | Add a pre-round and in-round checklist item specifically preventing this failure |
| 58 | Poor whiteboard/diagram legibility in virtual interviews | Add a pre-round and in-round checklist item specifically preventing this failure |
| 59 | Inconsistent terminology across explanation and code | Add a pre-round and in-round checklist item specifically preventing this failure |
| 60 | No final answer verification before handing off | Add a pre-round and in-round checklist item specifically preventing this failure |

## Appendix D. Interview readiness rubric by company

### D.1 Google

| Dimension | 0 - Not Ready | 1 - Emerging | 2 - Ready | 3 - Strong |
|---|---|---|---|---|
| Coding execution | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| System design quality | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Behavioral evidence | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Domain fluency | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Communication and pacing | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Recovery under pushback | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |

### D.2 Microsoft

| Dimension | 0 - Not Ready | 1 - Emerging | 2 - Ready | 3 - Strong |
|---|---|---|---|---|
| Coding execution | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| System design quality | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Behavioral evidence | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Domain fluency | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Communication and pacing | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Recovery under pushback | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |

### D.3 Grab

| Dimension | 0 - Not Ready | 1 - Emerging | 2 - Ready | 3 - Strong |
|---|---|---|---|---|
| Coding execution | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| System design quality | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Behavioral evidence | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Domain fluency | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Communication and pacing | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Recovery under pushback | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |

### D.4 Axon

| Dimension | 0 - Not Ready | 1 - Emerging | 2 - Ready | 3 - Strong |
|---|---|---|---|---|
| Coding execution | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| System design quality | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Behavioral evidence | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Domain fluency | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Communication and pacing | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Recovery under pushback | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |

### D.5 Employment Hero

| Dimension | 0 - Not Ready | 1 - Emerging | 2 - Ready | 3 - Strong |
|---|---|---|---|---|
| Coding execution | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| System design quality | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Behavioral evidence | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Domain fluency | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Communication and pacing | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Recovery under pushback | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |

### D.6 Zalo/VNG

| Dimension | 0 - Not Ready | 1 - Emerging | 2 - Ready | 3 - Strong |
|---|---|---|---|---|
| Coding execution | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| System design quality | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Behavioral evidence | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Domain fluency | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Communication and pacing | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |
| Recovery under pushback | Cannot complete baseline tasks | Solves with heavy prompting | Solves independently with clear reasoning | Solves with clear trade-offs and metrics under pressure |

## Appendix E. 40 mock interview scenarios (EN heading + VI execution notes)

| # | Scenario | Interview Type | VI Execution Note |
|---:|---|---|---|
| 1 | Design global notification system with per-user preferences | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 2 | Implement LRU cache and explain complexity trade-offs | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 3 | Design chat presence service with eventual consistency | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 4 | Debug production latency spike in checkout flow | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 5 | Design feed ranking pipeline with online + batch components | Coding | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 6 | Build resilient payment webhook processing service | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 7 | Design frontend architecture for super-app module platform | Behavioral | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 8 | Refactor legacy API gateway with zero downtime migration | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 9 | Explain incident where rollback was required | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 10 | Design audit-compliant data access logging | Coding | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 11 | Optimize slow SQL query on billion-row table | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 12 | Design realtime map driver update pipeline | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 13 | Implement debounce/throttle and compare use-cases | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 14 | Design collaborative editor conflict resolution model | Behavioral | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 15 | Discuss trade-offs between REST and event-driven integration | Coding | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 16 | Design retry policy with idempotency for flaky downstream | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 17 | Model feature flag rollout and kill-switch strategy | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 18 | Design multi-tenant SaaS permission model | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 19 | Handle duplicate events in streaming architecture | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 20 | Design observability dashboard for error budget tracking | Coding | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 21 | Choose state management strategy for complex React app | Behavioral | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 22 | Explain TypeScript model for API response unions | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 23 | Design cache invalidation for catalog + inventory updates | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 24 | Plan data migration with backward compatibility | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 25 | Discuss disagreement with product deadline and quality risks | Coding | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 26 | Design asynchronous document processing pipeline | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 27 | Propose architecture for high-scale push notifications | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 28 | Design upload service with virus scanning and retries | Behavioral | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 29 | Explain concurrency bug and race-condition fix in Go | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 30 | Design SLA-aware queue prioritization mechanism | Coding | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 31 | Design analytics ingestion with deduplication | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 32 | Evaluate microservice split vs modular monolith | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 33 | Design auth token rotation and session revocation | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 34 | Design multilingual content pipeline with moderation | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 35 | Implement top-k frequency algorithm and optimize memory | Coding | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 36 | Design video processing workflow for burst traffic | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 37 | Explain decision to reject a technically elegant solution | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 38 | Design large-scale search autocomplete service | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 39 | Run incident postmortem and prevention plan | System Design | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
| 40 | Design async interview submission review workflow | Coding | Trả lời theo khung: bối cảnh → ràng buộc → phương án → quyết định → trade-off → metric |
