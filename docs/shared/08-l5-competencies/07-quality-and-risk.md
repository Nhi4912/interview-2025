# Quality & Risk — Building Reliable Systems / Chất Lượng & Quản Lý Rủi Ro

> **Track**: Shared | **L5 Weight**: 10pts/100
> **L5 Competencies**: Quality & Risk (10pts)
> **See also**: [L5 Self-Assessment](./00-l5-self-assessment.md) | [Testing Strategy](../../fe-track/06-browser-performance/06-frontend-testing-strategy.md) | [Observability](../../fe-track/08-fe-system-design/07-frontend-quality-and-observability.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Hai team ở cùng công ty, cùng product. Team A ship feature nhanh — không test, deploy thẳng production Friday chiều, monitoring chỉ có "server up/down". Mỗi tháng có 2-3 incidents nghiêm trọng, khách hàng escalate, PM mất lòng tin, devs phải on-call firefight liên tục. Morale tụt, senior rời team.

Team B cũng ship nhanh — nhưng có testing strategy (unit + integration + e2e cho critical paths), deploy qua canary → staged rollout, có DORA dashboards, và postmortem blameless sau mỗi incident. Mỗi quarter chỉ 1 incident nhỏ, MTTR dưới 30 phút, PM tin tưởng team tự quyết release timing.

Khác biệt: **không phải tốc độ** — cả hai đều ship nhanh. Khác biệt là **quality infrastructure**: testing, monitoring, rollout strategy, và culture xử lý incident. Team B ship nhanh VÀ an toàn vì đầu tư vào hệ thống phòng ngừa thay vì chữa cháy.

L5 engineer không chỉ viết code tốt — họ **xây dựng quality culture** cho cả team: thiết lập quality bar, đo lường bằng data, và tạo process giúp mọi người ship tự tin.

---

## What & Why / Cái Gì & Tại Sao (Feynman Layer)

**Giải thích đơn giản:** Tưởng tượng bạn là bác sĩ phẫu thuật. Trước khi mổ, bạn có checklist: rửa tay, kiểm tra dụng cụ, xác nhận bệnh nhân đúng, anesthesia sẵn sàng. Sau khi mổ, bạn theo dõi hồi phục. Nếu có biến chứng, bạn phân tích nguyên nhân để lần sau tốt hơn.

Software engineering cũng vậy. "Mổ" = deploy code lên production. Quality & Risk là toàn bộ hệ thống checklist trước, monitoring trong, và postmortem sau — để đảm bảo "bệnh nhân" (users) luôn an toàn.

**Tại sao L5 cần biết?** Junior focus viết code đúng. Mid focus viết test. L5 focus **thiết kế hệ thống quality cho team** — từ quality bar → metrics → rollout process → incident response. Đây là multiplier effect: một L5 engineer tốt giúp cả team 8-10 người ship tự tin hơn.

---

## Framework / Khung Năng Lực

### 1. Quality Bar Framework — Setting Team Standards

Quality bar = minimum quality threshold mà mọi code phải đạt trước khi merge/deploy.

```
Quality Bar Levels:
│
├── Level 1: Personal (mỗi dev tự review)
│   → Không scalable, inconsistent quality
│
├── Level 2: Reactive (fix bug khi user report)
│   → Expensive, damages trust
│
├── Level 3: Preventive (testing + code review + linting)
│   → Catches most bugs before production
│
├── Level 4: Proactive (quality metrics, SLOs, automated gates)
│   → Data-driven quality decisions
│
└── Level 5: Cultural (quality ownership distributed across team)
    → Everybody thinks about quality, not just QA
```

**Thiết lập Quality Bar cho team:**

| Component                   | What to Define             | Example                                                      |
| --------------------------- | -------------------------- | ------------------------------------------------------------ |
| **Test coverage threshold** | Minimum % cho code mới     | "New code must have ≥80% statement coverage"                 |
| **Code review standards**   | Checklist reviewers follow | "Every PR needs ≥1 approval, security-sensitive needs ≥2"    |
| **Performance budgets**     | Measurable limits          | "LCP ≤ 2.5s, bundle size ≤ 200KB for main chunk"             |
| **API contract**            | Schema validation          | "All APIs must have OpenAPI spec, breaking changes need RFC" |
| **Error budget**            | Acceptable failure rate    | "99.9% uptime = 43 min downtime/month budget"                |

Quan trọng: Quality bar phải **measurable** và **automated**. Nếu chỉ là guideline doc mà không enforce bằng CI/CD, sẽ bị ignore.

### 2. DORA Metrics — Measuring Engineering Excellence

DORA (DevOps Research and Assessment) — 4 metrics đo software delivery performance:

```
┌─────────────────────────────────────────────────────────────┐
│                    DORA Metrics                              │
├──────────────────────┬──────────────────────────────────────┤
│  SPEED (Throughput)  │  STABILITY (Reliability)             │
│                      │                                      │
│  Deployment          │  Change Failure                      │
│  Frequency           │  Rate (CFR)                          │
│  "How often do       │  "What % of deployments              │
│   we ship?"          │   cause failures?"                   │
│                      │                                      │
│  Lead Time           │  Mean Time to                        │
│  for Changes         │  Recovery (MTTR)                     │
│  "How long from      │  "How fast do we                     │
│   commit to prod?"   │   fix failures?"                     │
└──────────────────────┴──────────────────────────────────────┘
```

**Performance Tiers:**

| Metric                    | Elite                    | High           | Medium            | Low        |
| ------------------------- | ------------------------ | -------------- | ----------------- | ---------- |
| **Deployment Frequency**  | On-demand (multiple/day) | Weekly–Monthly | Monthly–Quarterly | Quarterly+ |
| **Lead Time for Changes** | < 1 hour                 | 1 day–1 week   | 1 week–1 month    | 1–6 months |
| **Change Failure Rate**   | 0–15%                    | 16–30%         | 31–45%            | 46–60%     |
| **MTTR**                  | < 1 hour                 | < 1 day        | < 1 week          | 1 week+    |

**Key insight**: Elite teams có CẢ speed VÀ stability cao. Đây không phải trade-off — quality practices (testing, CI/CD, monitoring) ENABLE tốc độ.

**Cải thiện DORA:**

- **Deployment Frequency tăng** ← smaller PRs, feature flags, trunk-based development
- **Lead Time giảm** ← automated CI/CD, parallel test suites, auto-merge khi green
- **CFR giảm** ← better testing, canary deployments, contract testing
- **MTTR giảm** ← observability (logs + metrics + traces), runbooks, automated rollback

### 3. Progressive Rollout Strategy — Deploy Without Fear

```
Stage 1: Canary (1-5% traffic)
├── Duration: 15-30 min
├── Monitor: Error rate, latency p99, key business metrics
├── Gate: No anomaly detected → proceed
├── Rollback: Automatic if error rate > baseline + 2σ
│
Stage 2: Staged Rollout (10% → 25% → 50%)
├── Duration: 1-4 hours per stage
├── Monitor: Same as canary + user feedback channels
├── Gate: Metrics stable for ≥30 min at each stage
├── Rollback: Manual decision with dashboards
│
Stage 3: Full Rollout (100%)
├── Duration: Complete
├── Monitor: 24-48 hour bake period
├── Action: Close deployment ticket, update changelog
└── Post-deploy: Watch for slow-burn issues (memory leaks, data drift)
```

**Feature Flags — Decouple deploy from release:**

```
Deploy code → Code lives in production but inactive
    ↓
Enable flag for internal users → Dogfooding
    ↓
Enable flag for 5% users → Canary
    ↓
Gradual increase → Monitor at each step
    ↓
100% enabled → Remove flag (tech debt if left)
```

Lợi ích: Deploy code bất cứ lúc nào (kể cả Friday). Release = business decision, không phải engineering event.

### 4. Risk Assessment Matrix — Communicate Risk to Stakeholders

```
                    IMPACT
                Low    Medium    High    Critical
           ┌────────┬─────────┬────────┬──────────┐
  High     │ Medium │  High   │Critical│ Critical │
           ├────────┼─────────┼────────┼──────────┤
PROBABILITY│  Low   │ Medium  │  High  │ Critical │
  Medium   ├────────┼─────────┼────────┼──────────┤
           │  Low   │   Low   │ Medium │   High   │
  Low      └────────┴─────────┴────────┴──────────┘
```

**Cách dùng trong practice:**

| Risk                            | Probability | Impact   | Score | Mitigation                                                        |
| ------------------------------- | ----------- | -------- | ----- | ----------------------------------------------------------------- |
| DB migration corrupts user data | Low         | Critical | High  | Test on production clone, reversible migration, backup before run |
| Third-party API rate limit hit  | High        | Medium   | High  | Circuit breaker, fallback cache, alert at 80% quota               |
| New feature causes layout shift | Medium      | Low      | Low   | Visual regression tests, LCP/CLS monitoring                       |

**Presenting to stakeholders:** Đừng nói "có rủi ro". Nói: "Có 3 risks. Risk 1 (data corruption) là highest priority — mitigation plan là X, timeline là Y. Nếu approved, chúng ta sẽ deploy với rollback plan Z."

L5 skill: **quantify và communicate risk**, không chỉ identify.

### 5. Postmortem Framework — Learn From Failures

```
Blameless Postmortem Template:
│
├── 1. Incident Summary
│   "What happened, when, who was impacted, severity"
│
├── 2. Timeline
│   "Minute-by-minute: detection → response → mitigation → resolution"
│
├── 3. Root Cause Analysis (5 Whys)
│   Why did the page crash? → Unhandled null from API
│   Why was it unhandled? → No input validation on that endpoint
│   Why no validation? → Rushed to meet deadline, skipped review
│   Why was review skipped? → No CI gate enforcing review
│   Why no CI gate? → Team never set up branch protection
│   → ROOT CAUSE: Missing engineering process, not individual mistake
│
├── 4. Contributing Factors
│   "What made the impact worse? (e.g., no monitoring, slow rollback)"
│
├── 5. Action Items (with owners and deadlines)
│   [P0] Add branch protection rules — @eng-lead — by EOW
│   [P1] Add null validation middleware — @backend-dev — by next sprint
│   [P2] Set up error rate alerting — @platform — by end of month
│
└── 6. Lessons Learned
    "What went well? What could improve? Share with broader org."
```

**Blameless culture quan trọng tại sao?**

- Nếu blame người → mọi người giấu lỗi, không report incident sớm → vấn đề tệ hơn
- Nếu blame hệ thống → tìm ra process gap → fix root cause → cả team benefit
- "The human was the last barrier that failed, not the first cause" — phải hỏi tại sao hệ thống cho phép lỗi xảy ra

**Action items that actually get done:**

| Pattern            | Problem                                             | Fix                                                                                       |
| ------------------ | --------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Vague action items | "Improve monitoring" → never done                   | "Add PagerDuty alert for error rate > 1% on /checkout — owner: @alice — deadline: Mar 15" |
| No owner           | Everyone's responsibility = nobody's responsibility | Every action item has exactly 1 owner                                                     |
| No deadline        | "We'll get to it" = never                           | Concrete date, tracked in sprint board                                                    |
| No follow-up       | Action items forgotten after meeting                | Review status in next team sync                                                           |

---

## Examples / Ví Dụ STAR

### Example 1: Building Quality Culture from Scratch (Strong Signal) ✅

**Situation:** Joined team shipping 2 features/month nhưng mỗi deploy gây 1-2 incidents. No automated tests, manual QA chỉ happy path, deploy = "merge to main and pray."

**Task:** Giảm incidents và tăng deploy confidence mà không giảm velocity.

**Action:**

1. Week 1-2: Đo baseline — tính DORA metrics thủ công: CFR = 45%, MTTR = 6 hours, deploy frequency = biweekly
2. Week 3-4: Thêm CI pipeline với unit tests cho critical paths (checkout, auth). Coverage target: critical paths 90%, rest 60%
3. Month 2: Set up canary deployment (5% traffic → monitor 30 min → full rollout). Thêm error rate alerting
4. Month 3: Introduced postmortem process. Ran first blameless postmortem — team initially defensive, but after second one they started volunteering incidents
5. Month 4: Created quality dashboard — CFR, MTTR, test coverage visible to whole team

**Result:** After 6 months: CFR giảm 45% → 12%, MTTR giảm 6h → 35 min, deploy frequency tăng biweekly → daily. Team morale improved — devs felt safe deploying.

### Example 2: Risk Assessment Saves Major Launch (Strong Signal) ✅

**Situation:** Team chuẩn bị launch payment redesign cho 2M users. PM muốn big-bang release vào Monday.

**Task:** Assess risk và propose safer rollout plan.

**Action:**

1. Wrote risk assessment document: 5 risks identified, highest = "payment processing regression" (probability: medium, impact: critical → score: critical)
2. Proposed phased rollout: internal → 1% → 10% → 50% → 100% over 2 weeks
3. Defined rollback criteria: if payment success rate drops >0.5% from baseline → auto-rollback
4. Set up real-time dashboard tracking: payment success rate, error types, latency by percentile
5. Presented to PM and EM with clear risk/mitigation table — PM initially pushed back but agreed after seeing data

**Result:** During 10% rollout, caught edge case where certain card types failed validation — affected ~200 users instead of 200K. Hotfixed in 2 hours, resumed rollout. PM became advocate for progressive rollouts.

### Example 3: "Ship Fast, Break Things" Mentality (Weak Signal) ❌

**Situation:** Senior dev prioritizes velocity over everything. "Tests slow us down. We can fix bugs in production — that's what monitoring is for."

**Impact:**

- No tests → regressions in every deploy → customer trust eroded
- No postmortems → same bugs recur → team learns nothing
- High MTTR → devs spend 30% time firefighting → actual velocity DECREASES
- On-call burnout → senior devs quit → knowledge loss → more incidents

**Lesson:** "Move fast and break things" was appropriate for Facebook's early growth stage. For a product with paying users and SLAs, it's a liability. **Sustainable velocity requires quality infrastructure.**

---

## Anti-patterns / Sai Lầm Thường Gặp

| Anti-pattern                                | Why It Fails                                                             | Better Approach                                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| "100% test coverage" goal                   | Chasing coverage number leads to useless tests (testing getters/setters) | Cover critical paths thoroughly; measure meaningful coverage (branch coverage on business logic) |
| Testing in production only                  | Users become QA testers; trust erosion                                   | Test pyramid: unit → integration → e2e. Production monitoring is LAST line of defense, not first |
| Big-bang deploys                            | All-or-nothing = maximum blast radius                                    | Progressive rollout: canary → staged → full with monitoring gates                                |
| Blame-driven postmortems                    | People hide mistakes; root cause never found                             | Blameless culture: "What process allowed this to happen?" not "Who did this?"                    |
| Postmortem action items with no owner       | "Improve monitoring" sits in doc forever                                 | Every action item: specific task + owner + deadline + tracked in sprint                          |
| Ignoring DORA metrics                       | Can't improve what you don't measure                                     | Dashboard visible to team; review trends monthly                                                 |
| Feature flags never cleaned up              | Code becomes unreadable spaghetti of flag checks                         | Max lifetime per flag (e.g., 30 days); track in backlog; alert on stale flags                    |
| Gold-plating quality for non-critical paths | Spending 3 days testing a tooltip component                              | Risk-based testing: more investment on high-impact paths (checkout, auth, data mutation)         |

---

## Q&A Section — Interview Questions

### Q: What does a good testing strategy look like for a production application? / Testing strategy tốt cho production application trông như thế nào? 🟢 Junior

**A:** A good testing strategy follows the test pyramid: many fast unit tests at the base, fewer integration tests in the middle, and a small number of end-to-end tests at the top.

Unit tests kiểm tra individual functions/components — chạy nhanh (milliseconds), isolate dependencies bằng mocks. Integration tests kiểm tra multiple modules work together — ví dụ API endpoint kết nối đúng database query. E2e tests kiểm tra full user flow — ví dụ "user clicks checkout → payment processed → confirmation page shown."

Quan trọng: không phải mọi code cần test như nhau. Critical paths (checkout, authentication, data mutations) cần coverage cao nhất. Utility functions và UI cosmetics cần ít hơn. Đầu tư test theo risk: code xử lý tiền > code hiển thị avatar.

**Memory Hook:** Test Pyramid = "Nhiều nhỏ nhanh ở dưới, ít lớn chậm ở trên" — giống kim tự tháp thật: base rộng nhất, đỉnh nhỏ nhất.

**💡 Interview Signal:**

- ✅ Strong: Explains test pyramid with concrete examples, mentions risk-based prioritization
- ❌ Weak: "Write tests for everything" or "I don't write tests, QA handles that"

---

### Q: How do you measure and improve engineering quality in a team? / Làm sao đo lường và cải thiện quality của team? 🟡 Mid

**A:** Use DORA metrics as the foundation: Deployment Frequency, Lead Time for Changes, Change Failure Rate, and Mean Time to Recovery. These four metrics together capture both speed and stability — elite teams score high on both, proving quality and velocity are not a trade-off.

Cách triển khai thực tế:

1. **Measure baseline** — Tính DORA metrics hiện tại (thậm chí bằng tay nếu chưa có tooling). Biết mình đang ở đâu trước khi cải thiện.
2. **Set quality bar** — Define minimum standards cho test coverage, code review, performance budgets. Enforce bằng CI gates, không chỉ guidelines.
3. **Visualize** — Dashboard hiển thị metrics cho cả team. Transparency tạo accountability tự nhiên.
4. **Iterate** — Mỗi sprint retrospective review 1 metric. Focus cải thiện 1 thứ tại 1 thời điểm. Ví dụ: "Sprint này focus giảm CFR bằng cách thêm integration tests cho checkout flow."

Tránh vanity metrics (lines of code, number of PRs). DORA metrics đo OUTCOMES không phải OUTPUTS.

**💡 Interview Signal:**

- ✅ Strong: Names specific metrics (DORA), explains measurement → improvement loop, has done this in practice
- ❌ Weak: "We do code review" without discussing measurement or systematic improvement

---

### Q: Walk me through how you would handle deploying a high-risk change to a system serving millions of users. / Bạn deploy một thay đổi rủi ro cao cho hệ thống millions users như thế nào? 🔴 Senior

**A:** High-risk deployments require a structured approach across three phases: before, during, and after.

**Before deployment:**

1. **Risk assessment** — Identify failure modes using probability x impact matrix. For a payment system change: data corruption (low probability, critical impact → high priority), latency regression (medium probability, medium impact → medium priority).
2. **Rollback plan** — Define exactly how to revert: feature flag kill switch (seconds), code rollback (minutes), or data migration reversal (hours). Know which one applies BEFORE deploying.
3. **Success criteria** — Define quantitative metrics: "Payment success rate stays within 0.5% of baseline. P99 latency stays under 500ms. No new error types in first 30 minutes."

**During deployment (progressive rollout):**

1. **Canary (1-5%)** — Deploy to small traffic slice. Monitor for 15-30 minutes. Compare canary metrics vs control group.
2. **Staged expansion (10% → 25% → 50%)** — Increase traffic at each stage. Wait for metrics stabilization (≥30 min per stage). At each gate: check error rates, latency percentiles, business metrics.
3. **Automated guardrails** — Auto-rollback triggered if: error rate exceeds baseline + 2 standard deviations, or key business metric drops beyond threshold.

**After deployment:**

1. **Bake period (24-48 hours)** — Monitor for slow-burn issues: memory leaks, data inconsistencies, edge cases hit by specific user segments.
2. **Postmortem if needed** — Even for near-misses. "We caught the bug in canary" is still worth analyzing — why wasn't it caught in testing?
3. **Update runbooks** — Document what was learned for future high-risk deployments.

"In my experience, the biggest risk isn't the code — it's deploying without a plan for what happens when things go wrong. I always ask: 'If this fails at 2 AM, what's the 3-step runbook to fix it?'"

**💡 Interview Signal:**

- ✅ Strong: Structured approach with specific metrics and rollback criteria, demonstrates experience with progressive rollouts
- ❌ Weak: "Deploy and monitor" without specifics, or "Run all tests and ship" without rollout strategy

🔗 **Follow-up Chain:**

1. → "How would you decide the canary percentage and bake time for this specific change?"
2. → "What if the change involves a database migration that can't be easily rolled back?"
3. → "How do you handle a situation where metrics look fine in canary but a critical bug appears after full rollout — affecting only a specific user cohort?"
4. → "How would you build organizational support for progressive rollouts if the team/PM resists the slower deployment process?"

---

## Memory Hooks / Mẹo Ghi Nhớ

- **DORA = "Delivery Outcomes Reveal All"** — 4 metrics: Frequency, Lead Time, CFR, MTTR. Speed (first 2) + Stability (last 2).
- **Progressive rollout = "Slowly turn the faucet"** — 1% → 10% → 50% → 100%. Nếu nước bẩn (bugs), dễ tắt hơn khi chỉ mở 1%.
- **Risk Matrix = "Probability x Impact"** — Giống bảng cửu chương: nhân hai chiều để ra priority.
- **5 Whys = "Trẻ con hỏi tại sao"** — Cứ hỏi "tại sao?" 5 lần sẽ tìm ra gốc rễ. Root cause luôn là process, không phải con người.
- **Quality Bar = "Chiều cao tối thiểu để lên tàu lượn"** — Code không đạt bar → không được deploy. Clear, measurable, automated.

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

> **Interviewer:** "How do you balance quality vs speed in production systems? — explain it in 30 seconds."

**Ideal 30-second answer / Câu trả lời 30 giây:**

1. Quality vs speed is a trade-off managed by defining explicit quality bars and using progressive rollout to contain blast radius.
2. At L5, you use DORA metrics to objectively measure this balance and build automated quality gates that make shipping fast and safe simultaneously.
3. For example: we shipped features 2× faster after adding canary deploys with automated rollback — quality actually improved because risk was contained.
4. In the interview, reference specific DORA metrics you've tracked and one concrete quality bar you've enforced (e.g., error rate SLA, test coverage threshold).

---

## Self-Check / Tự Kiểm Tra

> **Đóng file này lại trước khi làm.**

- [ ] **Retrieval**: Liệt kê 4 DORA metrics từ trí nhớ. Mỗi metric thuộc nhóm Speed hay Stability?
- [ ] **Application**: Tính DORA metrics (ước lượng) cho team hiện tại của bạn. Team bạn ở tier nào (Elite/High/Medium/Low) cho mỗi metric?
- [ ] **Visual**: Vẽ Progressive Rollout flow (3 stages) với monitoring gates từ trí nhớ. So sánh với file.
- [ ] **Debug**: Nhớ lại incident gần nhất ở team bạn. Áp dụng 5 Whys — root cause thật sự là gì? Action items có được thực hiện không?
- [ ] **Teach**: Giải thích cho PM tại sao progressive rollout tốt hơn big-bang deploy — dùng Risk Assessment Matrix, không dùng thuật ngữ kỹ thuật.

💬 **Feynman Prompt:** Giải thích "blameless postmortem" cho người ngoài ngành. Tại sao đổ lỗi cho hệ thống tốt hơn đổ lỗi cho con người? Cho 1 ví dụ ngoài software.

🔁 **Spaced Repetition:** Ôn lại sau **3 ngày → 7 ngày → 14 ngày**.

---

## Connections / Liên Kết

- ⬅️ **Built on**: [Problem-Solving Frameworks](./02-problem-solving-frameworks.md) — Risk-First Analysis applies directly to quality decisions
- ➡️ **Enables**: [Scope & Impact](./01-scope-and-impact.md) — quality metrics demonstrate measurable impact for L5 promo cases
- 🔗 **Applied in**: [Frontend Testing Strategy](../../fe-track/06-browser-performance/06-frontend-testing-strategy.md) — concrete implementation of test pyramid for FE
- 🔗 **Applied in**: [Frontend Quality & Observability](../../fe-track/08-fe-system-design/07-frontend-quality-and-observability.md) — monitoring and error tracking in practice
- 🔗 **Related**: DORA metrics connect to CI/CD pipeline design and DevOps practices
