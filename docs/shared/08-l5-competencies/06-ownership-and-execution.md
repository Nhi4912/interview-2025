# Ownership & Execution — Driving Work to Completion / Chủ Động & Thực Thi

> **Track**: Shared | **L5 Weight**: 10pts/100
> **L5 Competencies**: Ownership & Execution (10pts)
> **See also**: [L5 Self-Assessment](./00-l5-self-assessment.md) | [Scope & Impact](./01-scope-and-impact.md) | [STAR Method](../09-behavioral/01-star-method.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Hai Senior Engineers cùng team tại một công ty fintech ở Việt Nam. Cả hai đều giỏi code.

**Engineer A — Passive Executor**: Nhận ticket, code xong, merge PR, done. Khi gặp blocker (API chưa ready), ngồi chờ — không nói gì. Khi deadline sắp đến mới báo: "Backend chưa xong nên em chưa làm được." PM surprised. Manager frustrated. Sprint fails.

**Engineer B — Proactive Owner**: Cũng gặp blocker tương tự. Nhưng ngay khi phát hiện API delay, Engineer B:

1. Slack PM ngay: "API sẽ delay 3 ngày. Tôi có 2 options: mock API và build UI trước, hoặc pull forward task X thay thế."
2. Update JIRA với risk flag và revised estimate.
3. Daily standup: report progress, blockers, plan — không ai bị surprise.
4. Khi production incident xảy ra lúc 9PM, Engineer B volunteer triage, tìm root cause, fix, viết postmortem — không ai phải nhờ.

Kết quả: Engineer A bị feedback "lacks ownership" trong performance review. Engineer B được promote lên L5 với signal "drives work to completion independently."

**Khác biệt cốt lõi**: Ownership không phải "làm nhiều hơn" — mà là **không để ai bị surprise, biến ambiguity thành action, và own outcome chứ không chỉ own task**.

---

## Framework / Khung Năng Lực

### 1. "No Surprises" Principle — Giao Tiếp Chủ Động

Core rule: **Stakeholders should never learn bad news for the first time at the deadline.**

```
NO SURPRISES = Proactive Communication at 3 checkpoints:

 ┌─────────────────────────────────────────────────┐
 │  START          MIDDLE              END          │
 │  ────           ──────              ───          │
 │  Align on       Flag risks &        Report       │
 │  scope,         blockers EARLY.     outcome vs   │
 │  timeline,      Share progress      original     │
 │  success        at regular          plan. Own     │
 │  criteria.      intervals.          the delta.   │
 └─────────────────────────────────────────────────┘
```

**Cách áp dụng hàng ngày:**

| Checkpoint     | Action                                                             | Frequency         |
| -------------- | ------------------------------------------------------------------ | ----------------- |
| **Start**      | Restate scope, confirm acceptance criteria, share initial estimate | At task kick-off  |
| **Progress**   | Share % done, blockers, revised ETA in standup/Slack               | Daily or bi-daily |
| **Risk flag**  | Escalate as soon as risk is identified, not when it materializes   | Immediately       |
| **Completion** | Demo result, compare to original scope, note deviations            | At delivery       |

**Ví dụ cụ thể:**

- ❌ Bad: Im lặng 2 tuần → deadline nói "chưa xong vì X"
- ✅ Good: Day 3 Slack message: "Discovered legacy API doesn't support pagination. This adds ~2 days. I have 2 options: [A] implement client-side pagination (fast but limited), [B] update API (correct but needs backend support). Recommending B. Need decision by Thursday."

### 2. Estimation Framework — Ước Lượng Chính Xác

Estimation sai là nguồn gốc của mọi "surprise." L5 engineers estimate realistically, not optimistically.

#### 3-Point Estimation (PERT)

```
Expected = (Optimistic + 4×MostLikely + Pessimistic) / 6

Example: Building a new authentication flow
  Optimistic (O):    3 days  — everything goes smoothly
  Most Likely (M):   5 days  — normal issues, 1 round of review
  Pessimistic (P):  10 days  — API changes, unexpected edge cases, CI issues

  Expected = (3 + 4×5 + 10) / 6 = 5.5 days
  → Communicate: "I estimate 5-6 days, could extend to 8 if we hit API issues."
```

#### Confidence Intervals

| Confidence      | Multiplier | When to use                                           |
| --------------- | ---------- | ----------------------------------------------------- |
| High (80%+)     | 1.2× base  | Well-understood task, done similar before             |
| Medium (50-80%) | 1.5× base  | Some unknowns, familiar domain                        |
| Low (<50%)      | 2× base    | New technology, vague requirements, many dependencies |

**Key rule**: Khi estimate, **luôn communicate confidence level cùng con số**. "5 days with high confidence" khác hoàn toàn "5 days with low confidence."

#### Estimation Anti-patterns

- **Anchoring bias**: PM hỏi "2 ngày được không?" → bạn nói "OK" thay vì estimate độc lập
- **Happy path only**: Chỉ estimate khi mọi thứ đều suôn sẻ
- **Ignoring integration**: Code xong ≠ done. Cần + code review + testing + deployment + monitoring
- **Not updating**: Estimate ban đầu sai nhưng không update stakeholders

### 3. Risk Communication Matrix — Khi Nào Escalate, Nói Gì

```
                    HIGH IMPACT
                        │
       ┌────────────────┼────────────────┐
       │   ESCALATE     │  ESCALATE      │
       │   IMMEDIATELY  │  IMMEDIATELY   │
       │   to Manager   │  to Manager +  │
       │   + PM         │  Director      │
       │                │                │
LOW ───┼────────────────┼────────────────┼─── HIGH
PROB   │                │                │    PROB
       │   LOG &        │  FLAG to PM    │
       │   MONITOR      │  in next       │
       │                │  standup       │
       │                │                │
       └────────────────┼────────────────┘
                        │
                    LOW IMPACT
```

#### Escalation Template (dùng khi cần flag risk)

```
Subject: [RISK] {Feature name} — {Risk summary}

WHAT: Describe the risk in 1-2 sentences.
IMPACT: What will happen if risk materializes? (delay, data loss, user impact)
PROBABILITY: High / Medium / Low — with reasoning.
OPTIONS:
  A) {option} — cost: X, benefit: Y
  B) {option} — cost: X, benefit: Y
RECOMMENDATION: I recommend option {A/B} because {reason}.
DECISION NEEDED BY: {date}
```

**Nguyên tắc**: Escalation không phải "đẩy trách nhiệm" — mà là **cung cấp đủ context để người có authority ra quyết định đúng**. Luôn kèm recommendation — đừng chỉ throw problem over the wall.

### 4. Ambiguity-to-Action Pipeline — Biến Mơ Hồ Thành Hành Động

Khi nhận task mơ hồ ("improve monitoring" / "make it more reliable"), L5 engineers có pipeline rõ ràng:

```
AMBIGUITY → QUESTIONS → CONSTRAINTS → OPTIONS → DECISION → PLAN → EXECUTE

Step 1: DECOMPOSE ambiguity
  "improve monitoring" →
    → Monitoring what? (APIs, frontend errors, infra?)
    → For whom? (eng team, on-call, product?)
    → What's broken today? (no alerts? too many alerts? wrong metrics?)

Step 2: DEFINE constraints
  → Timeline: khi nào cần xong?
  → Resources: chỉ mình tôi hay có team support?
  → Dependencies: cần access gì? cần team nào?

Step 3: PROPOSE concrete deliverables
  → "I'll implement: (1) error rate dashboard in Grafana, (2) PagerDuty alerts
     for P95 latency > 500ms, (3) runbook for top-3 alert types."
  → Communicate what is explicitly OUT of scope.

Step 4: GET ALIGNMENT → then execute
  → Share plan in doc/Slack, get thumbs-up, proceed.
```

**Rule of thumb**: Nếu bạn nhận task và sau 30 phút vẫn không biết step 1 là gì → đó là signal cần decompose, không phải signal cần "suy nghĩ thêm."

### 5. Incident Ownership — Own Production Issues End-to-End

L5 ownership shines brightest during incidents. Quy trình:

```
DETECT → TRIAGE → INVESTIGATE → FIX → COMMUNICATE → POSTMORTEM

┌──────────┐    ┌──────────┐    ┌──────────────┐    ┌─────────┐
│ Alert     │───→│ Ack +    │───→│ Find root    │───→│ Fix +   │
│ fires     │    │ Assess   │    │ cause        │    │ Deploy  │
│           │    │ severity │    │              │    │         │
└──────────┘    └──────────┘    └──────────────┘    └────┬────┘
                                                         │
                                                    ┌────▼────┐
                                                    │Postmor- │
                                                    │tem +    │
                                                    │Action   │
                                                    │items    │
                                                    └─────────┘
```

| Phase           | L3 Behavior                        | L5 Behavior                                                                             |
| --------------- | ---------------------------------- | --------------------------------------------------------------------------------------- |
| **Detect**      | Waits for someone to report        | Sets up monitoring/alerts proactively                                                   |
| **Triage**      | "Not my service"                   | Acks alert, assesses severity, pages relevant people                                    |
| **Investigate** | Tries random fixes                 | Follows systematic approach: logs → metrics → traces → reproduce                        |
| **Fix**         | Hotfix without review              | Fix + test + staged rollout + monitoring                                                |
| **Communicate** | Goes silent during incident        | Posts updates in incident channel every 15-30 min                                       |
| **Postmortem**  | Skips or writes "we fixed the bug" | Writes blameless postmortem with timeline, root cause, 5-whys, action items with owners |

**Key insight**: Ownership không phải "fix nhanh" — mà là **own the entire lifecycle**: từ detect đến action items từ postmortem được close.

---

## Examples / Ví Dụ Thực Tế

### Example 1: Strong Ownership — Payment Integration Migration

**Situation**: Company quyết định migrate từ payment provider A sang provider B. Timeline: 6 tuần. Không có detailed spec — chỉ có business requirement "switch providers, zero downtime."

**Task**: Own the migration as Senior Engineer.

**Action**:

- **Week 1**: Decomposed ambiguity — listed all payment flows (checkout, refund, subscription, webhook). Discovered 3 undocumented flows qua code audit. Shared finding với PM: "Scope lớn hơn expected. Here are options: (A) migrate all flows in 6 weeks — high risk, (B) migrate checkout + refund first (covers 90% transactions), subscriptions in phase 2."
- **Week 2-3**: PM chọn option B. Tạo migration runbook, set up feature flags cho gradual rollout, built parallel-run system (cả 2 providers chạy song song để verify).
- **Week 4**: Phát hiện provider B webhook format khác — ảnh hưởng refund flow. Escalated ngay: "Refund webhook needs 2 extra days. This doesn't affect checkout launch timeline. I'll reprioritize."
- **Week 5-6**: Rolled out to 5% → 25% → 100%. Monitored error rates, payment success rates. Zero customer-facing issues.
- **Post-launch**: Wrote migration playbook cho team, used by 2 other teams for their migrations.

**Result**: Migration completed on time for 90% of flows. Refund migration finished 1 week after — exactly as communicated. Zero payment failures during migration.

✅ **Strong signals**: Decomposed ambiguity, flagged scope issue early, proposed options, communicated risk proactively, owned monitoring post-launch, created reusable playbook.

---

### Example 2: Strong Ownership — Production Incident at 2AM

**Situation**: PagerDuty alert at 2AM — API error rate spiked to 15% (threshold: 1%). On-call engineer (Junior) panicked, didn't know where to start.

**Task**: Không phải on-call nhưng thấy alert trong Slack incident channel. Decided to jump in.

**Action**:

- **Minute 0-5**: Ack alert, checked dashboards. Identified: error spike correlated with deployment at 1:45AM. Posted in incident channel: "Likely related to deploy abc123. Investigating."
- **Minute 5-15**: Checked deployment diff — new database query without index. Query timeout causing cascading failures.
- **Minute 15-20**: Two options: (A) rollback deploy, (B) add index. Chose A (faster recovery, lower risk). Rolled back. Error rate dropped to normal within 3 minutes.
- **Minute 20-30**: Confirmed recovery, monitored for 10 minutes. Posted all-clear.
- **Next day**: Wrote blameless postmortem. Root cause: no query performance check in CI pipeline. Action items: (1) add query explain plan to CI (owner: me, done in 3 days), (2) update deployment runbook with rollback criteria (owner: me), (3) add database query linting (owner: DB team, tracked in JIRA).
- **Follow-through**: Tracked all 3 action items to completion over next 2 weeks.

**Result**: Incident resolved in 20 minutes (MTTR target: 30 min). Postmortem action items prevented 3 similar incidents in following quarter.

✅ **Strong signals**: Volunteered (not on-call), systematic investigation, decisive action, proactive communication throughout, blameless postmortem, followed through on action items.

---

### Example 3: Weak Ownership — "Not My Job" Mentality

**Situation**: Feature launched with a performance regression — page load time increased from 2s to 5s. Users complained on support channels.

**Task**: Engineer was asked to investigate.

**Action**: Engineer said "I only worked on the UI component, the slowness is from the API." Passed ticket to backend team. Backend team said "API response time is fine, must be frontend rendering." Ticket bounced back and forth for 2 weeks. No one owned the investigation end-to-end.

**Result**: Issue finally fixed after PM escalated to engineering director. Root cause: frontend was making 12 sequential API calls instead of batching — took 30 minutes to fix once someone actually looked at the full picture.

❌ **Why weak**: No one owned the problem end-to-end. "Not my code" mentality wasted 2 weeks. An L5 engineer would have traced the full request lifecycle regardless of which "team" owned which layer.

---

## Anti-patterns / Sai Lầm Thường Gặp

| Anti-pattern                        | Why it fails                                                       | Better approach                                                     |
| ----------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| **"I wasn't told to do that"**      | L5 expected to identify what needs doing, not wait for assignments | Proactively identify gaps and propose solutions                     |
| **Silent struggling**               | Stakeholders can't help if they don't know there's a problem       | Flag blockers within 24 hours, always with options                  |
| **Optimistic estimates**            | Erodes trust when deadlines are missed repeatedly                  | Use 3-point estimation, communicate confidence level                |
| **Throwing problems over the wall** | Escalation without recommendation is just complaining              | Always include options + your recommendation                        |
| **Hero culture**                    | Working 80h weeks to "own everything" is unsustainable             | Own outcomes, not all the work — delegate and coordinate            |
| **Skipping postmortems**            | Same incidents repeat, team doesn't learn                          | Own the full incident lifecycle including postmortem + action items |
| **Ownership without authority**     | Taking ownership but not getting buy-in leads to conflicts         | Align with stakeholders before driving execution                    |
| **"Not my code" deflection**        | Users don't care which team owns which microservice                | Own the problem from user perspective, trace across team boundaries |

---

## Q&A Section — Interview Questions

### Q: What does "ownership" mean to you as an engineer? / "Ownership" nghĩa là gì với bạn? 🟢 Junior

**A:** Ownership means being responsible for outcomes, not just tasks. An owner doesn't say "I finished my part" — they say "the feature is working in production and users are happy."

Ownership có 3 layers:

1. **Task ownership**: hoàn thành code đúng spec — đây là baseline, L3 level.
2. **Outcome ownership**: đảm bảo feature hoạt động end-to-end trong production, monitor metrics, fix issues — L4-L5 level.
3. **Problem ownership**: identify problems trước khi được assign, drive solutions cross-team — L5+ level.

Ví dụ: Bạn build search feature. Task ownership = code xong, PR merged. Outcome ownership = search works in production, latency < 200ms, no errors. Problem ownership = bạn notice search relevance thấp, propose ranking improvements, drive cross-team effort với ML team.

**💡 Interview Signal:**

- ✅ Strong: Defines ownership as outcome-driven, gives concrete layers with examples
- ❌ Weak: "Ownership means working hard" or "doing whatever is needed" — vague, no structure

---

### Q: Tell me about a time you identified and resolved a risk before it became a problem. / Kể về lần bạn phát hiện và xử lý risk trước khi nó thành vấn đề. 🟡 Mid

**A:** Use STAR format, emphasizing the PROACTIVE aspect — you spotted the risk, not someone else.

Strong answer structure:

- **Situation**: What was the project context? What was at stake?
- **Risk identification**: How did you spot it? (code review, monitoring, experience)
- **Analysis**: What was the potential impact? How likely was it?
- **Action**: What did you do? (escalate, propose mitigation, implement fix)
- **Result**: What would have happened without your intervention? What actually happened?

"Trong sprint planning, tôi nhận ra feature mới depend on 1 third-party API mà chưa ai test integration. Tôi estimate rằng API có rate limit sẽ conflict với expected traffic. Tôi build prototype integration trong 2 ngày, phát hiện rate limit issue thật, propose caching layer, implement trước sprint deadline. Nếu không phát hiện sớm, feature sẽ fail at launch với 10K concurrent users."

**💡 Interview Signal:**

- ✅ Strong: Shows systematic risk identification, quantified potential impact, proactive mitigation
- ❌ Weak: Describes reacting to a problem that already happened — that's firefighting, not risk management

---

### Q: Describe a situation where you took ownership of a failing project or initiative. How did you turn it around? / Mô tả tình huống bạn take ownership 1 project đang fail. 🔴 Senior

**A:** This question tests the hardest form of ownership — taking responsibility for something that's already in trouble, possibly not originally yours.

Strong answer structure:

1. **Context**: Why was the project failing? (scope creep, technical debt, team issues, unclear requirements)
2. **Decision to own**: Why did you step in? What was at stake?
3. **Diagnosis**: How did you assess the real problems? (not symptoms, root causes)
4. **Turnaround plan**: What concrete steps did you take? (re-scope, re-estimate, re-staff, re-architect)
5. **Stakeholder management**: How did you communicate the situation and new plan?
6. **Result**: Did the project succeed? What were the trade-offs?

"Team đang build real-time notification system — 3 months in, no working prototype. Original owner left. Tôi volunteer take over. First week: audit code + talk to every stakeholder. Root causes: (1) over-engineered architecture for requirements, (2) no clear MVP definition, (3) team demoralized. Tôi propose reset: simplify architecture (WebSocket → SSE for v1), define MVP (3 notification types, not 12), pair-program với junior to rebuild momentum. Communicate to director: 'We need 4 more weeks but we'll ship a working system, not vaporware.' Shipped MVP in 3 weeks. 3 notification types covered 85% of use cases. Added remaining types over next quarter."

**💡 Interview Signal:**

- ✅ Strong: Diagnosed root causes (not just symptoms), made hard trade-off decisions, managed up effectively, showed judgment about what to cut
- ❌ Weak: "I worked extra hours and fixed the bugs" — heroics without strategy

🔗 **Follow-up Chain:**

1. → "How did you earn the trust of the existing team members who were demoralized? Were there conflicts?"
2. → "What would you have done differently if the director said 'no more time, ship what you have'?"
3. → "How did you decide which 3 notification types to include in MVP? What data informed that decision?"
4. → "After shipping, how did you prevent the same problems from recurring on future projects?"

---

## Memory Hooks / Mẹo Ghi Nhớ

**"DRIVE" Framework cho Ownership:**

```
D — Detect problems early (don't wait for someone to tell you)
R — Raise risks proactively (No Surprises principle)
I — Investigate root causes (not just symptoms)
V — Volunteer for hard problems (especially cross-team ones)
E — Execute to completion (including postmortem + follow-through)
```

**Mnemonic cho Estimation**: "OMP" — Optimistic, Most likely, Pessimistic. Giống "Ô My Phật" — khi estimate mà chỉ nghĩ happy path thì cần niệm "Ô My Phật" để nhớ tính cả worst case.

**Visual memory**: Ownership = **cái ô (umbrella)**. Bạn che cả team khỏi mưa (surprises, risks, ambiguity). Nếu bạn chỉ che bản thân (task ownership) → team bị ướt. L5 che cả team (outcome ownership).

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

> **Interviewer:** "Give an example of taking ownership beyond your job description — explain it in 30 seconds."

**Ideal 30-second answer / Câu trả lời 30 giây:**

1. Ownership means treating outcomes as your responsibility even when the problem falls outside your formal role or team boundary.
2. At L5, you proactively identify risks, communicate blockers early with options, and drive resolution without being asked.
3. For example: our on-call system had no runbook — I wrote it, trained 3 teammates, and reduced MTTR by 50%, completely unprompted.
4. In the interview, use the DRIVE framework: Define the gap → identify Risk → Iterate on solution → Verify impact → Escalate when needed.

---

## Self-Check / Tự Kiểm Tra

> **Đóng file này lại trước khi làm.**

- [ ] **Retrieval**: Viết DRIVE framework từ trí nhớ (5 letters + meaning). So sánh với file.
- [ ] **Application**: Chọn 1 project gần đây. Dùng 3-Point Estimation cho 1 task — estimate O, M, P và tính Expected. So sánh với actual time đã dùng.
- [ ] **Scenario**: Viết 1 escalation message dùng Risk Communication Template cho 1 blocker bạn đã gặp. Có đủ: WHAT, IMPACT, OPTIONS, RECOMMENDATION không?
- [ ] **Debug**: Review last 3 sprints — có lần nào deadline bị miss mà stakeholders bị surprise không? Root cause là gì?
- [ ] **Teach**: Giải thích cho đồng nghiệp sự khác biệt giữa "task ownership" vs "outcome ownership" bằng 1 ví dụ cụ thể từ team bạn.

💬 **Feynman Prompt:** Giải thích "ownership & execution" cho 1 bạn non-tech — dùng analogy tổ chức đám cưới. Người "own task" chỉ lo đặt nhà hàng. Người "own outcome" lo từ A-Z: nhà hàng, thiệp, MC, backup plan khi trời mưa — và báo trước cho cả nhà khi có thay đổi.

🔁 **Spaced Repetition:** Ôn lại sau **3 ngày → 7 ngày → 14 ngày → 30 ngày**.

---

## Connections / Liên Kết

- ⬅️ **Built on**: [STAR Method](../09-behavioral/01-star-method.md) — STAR provides the storytelling structure; Ownership provides the content signal
- ⬅️ **Built on**: [Scope & Impact](./01-scope-and-impact.md) — Ownership is HOW you deliver scope; Scope & Impact is WHAT you deliver
- ➡️ **Enables**: [Problem-Solving Frameworks](./02-problem-solving-frameworks.md) — Ownership drives you to find root causes, not just patch symptoms
- 🔗 **Applied in**: Behavioral interviews (ownership stories), incident response (on-call scenarios), project retrospectives
- 🔗 **Relates to**: Communication skills — ownership without communication is invisible; the "No Surprises" principle bridges both
