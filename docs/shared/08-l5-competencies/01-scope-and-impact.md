# Scope & Impact — Owning Work End-to-End / Phạm Vi & Tác Động

> **Track**: Shared | **L5 Weight**: 15pts/100
> **L5 Competencies**: Scope & Impact (15pts)
> **See also**: [L5 Self-Assessment](./00-l5-self-assessment.md) | [STAR Method](../09-behavioral/01-star-method.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn phỏng vấn tại Grab cho vị trí Senior Frontend Engineer. Interviewer hỏi: "Tell me about a time you owned a significant feature end-to-end." Bạn kể về 1 bug fix — interviewer ghi "scope too small." Một ứng viên khác kể về việc redesign checkout flow, tự decompose requirements từ PM, coordinate với 3 teams, và ship trước deadline — interviewer ghi "strong L5 signal."

Khác biệt không phải kỹ năng code — mà là **cách bạn articulate scope of impact**.

---

## Framework / Khung Năng Lực

### 1. SCOPE Framework — Cách Articulate Scope

```
S — Size: How big was the feature? (users affected, revenue impact, teams involved)
C — Complexity: What made it hard? (ambiguity, dependencies, technical challenges)
O — Ownership: What decisions did YOU make? (not "the team decided")
P — Process: How did you drive it? (decomposition, communication, risk management)
E — Effect: What was the measurable outcome? (metrics, team impact, business result)
```

**Ví dụ yếu**: "I implemented the new search feature."
**Ví dụ mạnh**: "I owned the search redesign serving 2M daily users. The PM gave me a vague brief — 'make search better.' I conducted user research with 50 sessions, proposed 3 approaches with cost/impact tradeoffs to stakeholders, chose an approach that reduced search-to-purchase time by 40%, coordinated with the backend team on API changes, and shipped incrementally over 6 weeks with feature flags."

### 2. Ambiguity Navigation Framework

Khi nhận requirements mơ hồ, L5 không hỏi "tell me exactly what to do" — mà:

```
Step 1: CLARIFY — Hỏi đúng câu hỏi
  "What problem are we solving?" (not "What feature do you want?")
  "Who is the user? What does success look like?"
  "What are the constraints? (timeline, resources, tech debt)"

Step 2: PROPOSE — Đề xuất options
  Present 2-3 approaches with trade-offs:
  Option A: Fast, small scope, low risk
  Option B: Medium, covers 80% cases, moderate effort
  Option C: Complete solution, high effort, high impact
  → Recommend one with reasoning

Step 3: ALIGN — Get buy-in
  Align with PM/Design on chosen approach
  Document scope and non-scope explicitly
  Set expectations: "We will NOT do X in v1"

Step 4: EXECUTE — Drive to completion
  Break into milestones with checkpoints
  Flag risks early, not at deadline
  Ship incrementally, validate assumptions
```

### 3. Scope Sizing Matrix

| Scope Level | Description | L5 Signal |
|-------------|------------|-----------|
| Task | Fix bug, implement small ticket | ❌ L3 scope |
| Feature | Build a complete feature within existing architecture | ⚠️ L4 scope |
| Flow | Own an entire user flow (e.g., checkout, onboarding) | ✅ L5 minimum |
| Surface | Own a technical surface (e.g., design system, performance infra) | ✅ Strong L5 |
| Initiative | Drive a cross-team initiative (e.g., migration, new architecture) | ✅ L5→L6 |

---

## Examples / Ví Dụ Thực Tế

### Example 1: Strong L5 — Checkout Flow Redesign

**Situation**: E-commerce app checkout had 30% abandonment rate. PM said "improve checkout" — no specific requirements.

**Task**: Own the entire checkout flow improvement as Senior FE engineer.

**Action**:
- Analyzed funnel data → identified 3 drop-off points (address form, payment, confirmation)
- Proposed 3 approaches to PM: quick fixes (2 weeks), redesign form flow (4 weeks), full checkout rebuild with persistent cart (8 weeks)
- Recommended option 2 with data: "Address form accounts for 60% of drops. Redesigning it covers the biggest win with reasonable effort."
- Coordinated with backend team on address autocomplete API changes
- Implemented with A/B test framework, shipped to 10% traffic first
- Wrote postmortem when a11y regression was caught in canary

**Result**: Abandonment dropped from 30% → 18%. Pattern was adopted by mobile team.

✅ **Strong signals**: Decomposed ambiguity, proposed options with data, owned E2E including coordination, measured impact.

❌ **Weak version**: "PM asked me to fix the checkout form. I redesigned the UI and it looked better."

---

### Example 2: Strong L5 — Design System Migration

**Situation**: Company had 3 different UI libraries across 8 micro-frontends. Inconsistent UX, slow development.

**Task**: Propose and drive adoption of a unified design system.

**Action**:
- Audited all 8 MFEs → documented 47 duplicate components
- Built business case: "Team spends ~20% time on UI inconsistency fixes. Unified system saves ~2 dev-months/quarter."
- Created RFC with migration strategy: codemods for common patterns, bridge library for gradual adoption, team-by-team rollout
- Led weekly migration syncs, created adoption dashboard
- Mentored 2 junior engineers who took ownership of component migration

**Result**: 6/8 MFEs migrated in 3 months. New component development time reduced 60%.

✅ **Strong signals**: Identified systemic problem, built business case, drove cross-team initiative, mentored others.

---

### Example 3: Weak L5 — Generic Bug Fix Story

**Situation**: Login page had a bug where password reset didn't work on mobile.

**Task**: Fix the bug.

**Action**: Debugged the CSS media query issue, fixed it, added a unit test.

**Result**: Bug was fixed, QA verified.

❌ **Why weak**: Task-level scope, no ambiguity, no coordination, no measurable business impact. This is L3 work.

---

## Anti-patterns / Sai Lầm Thường Gặp

| Anti-pattern | Why it fails | Better approach |
|-------------|-------------|----------------|
| "The team decided..." | Shows no individual ownership | Use "I proposed...", "I drove...", "I decided..." |
| Only talking about code | Interviewer wants scope + impact, not implementation details | Lead with problem → approach → result, code is supporting evidence |
| No metrics | "It was better" is not a signal | Quantify: "reduced load time by 40%", "affected 2M users", "saved 3 dev-weeks" |
| Scope inflation | Claiming credit for team work without specifics | Be precise: "I designed the architecture and mentored 2 juniors who implemented the components" |
| All solo work | L5 scope inherently involves coordination | Include cross-team collaboration, stakeholder management |
| No ambiguity | If the task was perfectly defined, it's not L5 scope | Choose stories where requirements were unclear and YOU clarified them |

---

## Q&A Section — Interview Questions

### Q: Tell me about a time you owned a significant feature end-to-end. / Kể về lần bạn own 1 feature quan trọng từ đầu đến cuối. 🟢 Junior

**A:** Use SCOPE framework. Start with Size (how many users/teams), then Complexity (what made it hard), Ownership (YOUR decisions), Process (how you drove it), Effect (measurable outcome).

Đừng bắt đầu bằng "PM assigned me a ticket." Bắt đầu bằng: "I identified an opportunity to improve X, proposed an approach, and drove it end-to-end."

**💡 Interview Signal:**
- ✅ Strong: Describes ambiguity → decomposition → coordination → measurable result
- ❌ Weak: Describes a well-defined task they implemented correctly

---

### Q: How do you handle ambiguous requirements? / Bạn xử lý requirements mơ hồ thế nào? 🟡 Mid

**A:** Follow the CLARIFY → PROPOSE → ALIGN → EXECUTE framework. Key: don't wait for perfect requirements — ask the RIGHT questions, propose options with trade-offs, get alignment, then drive execution.

"Khi PM nói 'make it better,' tôi không hỏi 'better how?' — tôi hỏi 'what problem are users having?' rồi đề xuất 2-3 options với data."

**💡 Interview Signal:**
- ✅ Strong: Has a structured approach, proposes options proactively, documents decisions
- ❌ Weak: "I ask PM for more details" or "I just start building something"

---

### Q: Describe a situation where you had to make a difficult scope decision. What trade-offs did you consider? / Mô tả tình huống bạn phải quyết định scope khó khăn. 🔴 Senior

**A:** Strong answer includes: the constraint (time, resources, quality), options you considered, how you evaluated them (data, user impact, engineering cost), your recommendation and WHY, and what you explicitly scoped out.

"We had 4 weeks before launch. I proposed cutting feature X (affected 5% of users) to ensure feature Y (affected 80%) was rock-solid. I presented the data to PM, got alignment, and documented the decision in an ADR. We shipped feature X in v2 three weeks later."

**💡 Interview Signal:**
- ✅ Strong: Quantified trade-offs, explicit about what was cut and why, documented decision
- ❌ Weak: "We just did whatever PM said" or "We tried to do everything and it was stressful"

🔗 **Follow-up Chain:**
1. → "How did you communicate this scope change to stakeholders who wanted feature X?"
2. → "What data would have changed your decision? What was your fallback plan?"
3. → "If you had 2 more engineers, would you have made a different scope decision? How would you have structured the work?"

---

## Self-Check / Tự Kiểm Tra

> **Đóng file này lại trước khi làm.**

- [ ] **Retrieval**: Viết SCOPE framework từ trí nhớ (5 letters + meaning). So sánh.
- [ ] **Visual**: Vẽ Scope Sizing Matrix (5 levels) từ trí nhớ. Đâu là minimum L5?
- [ ] **Application**: Chọn 1 project lớn nhất bạn đã làm. Kể theo SCOPE framework trong 2 phút. Record và nghe lại — có thiếu gì?
- [ ] **Debug**: Story bạn vừa kể có "the team decided" hoặc thiếu metrics không? Fix nó.
- [ ] **Teach**: Giải thích cho bạn bè cách phân biệt L3 scope vs L5 scope bằng 1 ví dụ.

💬 **Feynman Prompt:** Giải thích "scope & impact" cho người không làm tech — tại sao fixing 1 bug khác với owning 1 feature? Không dùng jargon.

🔁 **Spaced Repetition:** Ôn lại sau **3 ngày → 7 ngày → 14 ngày**.

---

## Connections / Liên Kết

- ⬅️ **Built on**: [STAR Method](../09-behavioral/01-star-method.md) — SCOPE framework extends STAR with scope-specific structure
- ➡️ **Enables**: [Problem-Solving Frameworks](./02-problem-solving-frameworks.md) — scope decisions require structured problem-solving
- 🔗 **Applied in**: Behavioral interviews (every company), system design (scope the problem), coding (scope the solution)
