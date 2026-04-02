# Communication — Clear, Influential, Scalable / Giao Tiep Hieu Qua

> **Track**: Shared | **L5 Weight**: 10pts/100
> **L5 Competencies**: Communication (10pts)
> **See also**: [L5 Self-Assessment](./00-l5-self-assessment.md) | [STAR Method](../09-behavioral/01-star-method.md) | [Storytelling](../09-behavioral/04-storytelling.md)

---

## Real-World Scenario / Tinh Huong Thuc Te

Hai senior engineer cung team. Engineer A code xuat sac — clean architecture, performance toi uu, PR nao cung it bug. Nhung khi PM hoi "tai sao chon approach nay thay vi approach kia?", A chi noi "vi no tot hon". Khi co disagreement trong architecture review, A im lang roi tu lam theo y minh. Khi project co risk, A khong noi gi cho den khi deadline miss.

Engineer B code kha, khong gioi bang A. Nhung B viet RFC truoc khi bat dau feature lon, explain trade-offs ro rang cho PM bang ngon ngu business ("approach nay giup giam 40% page load time, tang conversion"). Khi disagree, B viet comment cu the: "I think X is better because Y — but I'm open to Z if we value W more." Khi thay risk, B raise som: "Sprint nay co risk delay 3 ngay vi dependency X chua ready. De xuat: parallelize task Y."

Ket qua: Engineer B duoc promote L5 truoc A 2 nam. Tai sao? Vi L5 khong chi la "code gioi" — ma la **nhan rong impact thong qua communication**. Code cua ban chi anh huong den 1 feature; communication cua ban anh huong den ca team.

---

## What & Why / Cai Gi & Tai Sao

**Feynman Explanation**: Hay tuong tuong ban la kien truc su xay nha. Ban co the ve ban thiet ke dep nhat the gioi, nhung neu ban khong giai thich duoc cho tho xay tai sao tuong nay phai day 30cm (khong phai 20cm), cho chu nha tai sao can them 2 tuan cho mong (thay vi bat dau xay tuong ngay), thi nha se xay sai hoac chu nha se mat niem tin vao ban.

Communication o L5 la kha nang **dich chuyen thong tin** giua cac audience khac nhau:

- **Engineer-to-Engineer**: precision, technical depth, trade-off analysis
- **Engineer-to-PM**: business impact, timeline implications, risk quantification
- **Engineer-to-Leadership**: strategic alignment, ROI, resource needs
- **Written vs Verbal**: RFC/ADR (async, permanent) vs standup/review (sync, ephemeral)

**Tai sao quan trong o L5?** Vi o L4 ban chi can communicate trong team nho. O L5, ban phai influence decisions across teams, drive alignment on technical direction, va make sure moi nguoi hieu "why" — khong chi "what".

---

## Framework / Khung Nang Luc

### 1. RFC/ADR Writing Framework

**Khi nao can viet RFC (Request for Comments)?**

- Thay doi anh huong >= 2 teams hoac >= 2 services
- Introduce new technology/pattern vao codebase
- Breaking change hoac migration lon
- Bat ky quyet dinh ma ban muon co written record de tham chieu sau nay

**Cau truc RFC hieu qua:**

```
Title: [Concise, specific title]
Status: Draft | In Review | Accepted | Rejected
Author: [Your name]
Reviewers: [List key stakeholders]
Date: [Created date]

## Context / Problem Statement
- What's the current state?
- What problem are we solving?
- Why now? (urgency/trigger)

## Proposed Solution
- High-level approach (1-2 paragraphs)
- Key design decisions with rationale

## Alternatives Considered
| Option | Pros | Cons | Why not chosen |
|--------|------|------|----------------|
| Option A | ... | ... | ... |
| Option B | ... | ... | ... |

## Trade-offs & Risks
- What are we giving up?
- What could go wrong?
- Mitigation strategies

## Migration Plan
- Phased rollout steps
- Rollback strategy
- Success metrics

## Open Questions
- Unresolved decisions needing input
```

**Cach get buy-in cho RFC:**

```
Step 1: Pre-align (truoc khi viet)
  → Noi chuyen 1:1 voi 2-3 key stakeholders
  → Hieu concerns cua ho truoc
  → Incorporate feedback vao RFC draft

Step 2: Draft & circulate
  → Share RFC voi note: "Looking for feedback on X, Y, Z specifically"
  → Set deadline cho review (5-7 ngay)
  → Tag reviewers explicitly

Step 3: Address feedback
  → Reply moi comment, even if "Acknowledged, no change needed because..."
  → Update RFC dua tren feedback
  → Highlight changes in new version

Step 4: Decision meeting (neu can)
  → Prepare 5-minute summary
  → Focus on unresolved disagreements
  → Propose decision framework, not just your preferred option
```

**ADR (Architecture Decision Record)** — lightweight version cua RFC:

```
# ADR-001: Use Redis for Session Storage

## Status: Accepted (2024-03-15)

## Context
User sessions currently in PostgreSQL. At 50K concurrent users,
session reads cause 40% of DB load.

## Decision
Move session storage to Redis with 24h TTL.

## Consequences
- (+) Reduce PostgreSQL load by ~35%
- (+) Session read latency: 50ms → 2ms
- (-) Additional infrastructure (Redis cluster)
- (-) Need session migration strategy for deployment
```

### 2. Stakeholder Communication Matrix

| Audience              | What They Need                                     | Format                                   | Cadence                        | Example                                                                                             |
| --------------------- | -------------------------------------------------- | ---------------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------- |
| **PM/Product**        | Business impact, timeline, risks                   | Bullet points, no code                   | Daily standup + weekly sync    | "Feature X is 70% done. Risk: API dependency may delay launch 3 days. Mitigation: mock API ready."  |
| **Tech Lead/Manager** | Technical direction, blockers, resource needs      | Brief technical + context                | Weekly 1:1 + ad-hoc            | "Proposing migration from REST to gRPC for service Y. RFC ready for review. Need 1 sprint for POC." |
| **Other Engineers**   | Technical details, API contracts, breaking changes | Code examples, diagrams, PR descriptions | PR reviews + RFC + Slack       | "This PR changes the auth middleware. All downstream services need to update by March 30."          |
| **Leadership/VP**     | Strategic impact, ROI, team health                 | Executive summary, metrics               | Monthly/quarterly              | "New caching layer reduced p99 latency 60%, projected to save $2K/month in infrastructure."         |
| **External Teams**    | Integration points, SLAs, breaking changes         | API docs, migration guides               | Per release + quarterly review | "v2 API ships April 1. Migration guide attached. Breaking changes: endpoints X, Y removed."         |

**Key principle**: **Adjust fidelity, not honesty**. Moi audience can muc do chi tiet khac nhau, nhung facts phai nhat quan. Noi voi PM "on track" trong khi noi voi tech lead "co risk" la communication failure.

### 3. Technical Presentation Framework

**Presenting to Technical Audience (design review, tech talk):**

```
Structure: WHAT → WHY → HOW → TRADE-OFFS → QUESTIONS

1. WHAT (1-2 min): State the problem and proposed solution clearly
   "We're seeing 2s page loads on the dashboard. I propose
    implementing virtual scrolling + data pagination."

2. WHY (2-3 min): Data-driven justification
   "Dashboard renders 5000 DOM nodes. Chrome DevTools shows
    80% of render time in layout/paint. Virtual scrolling
    reduces visible nodes to ~50."

3. HOW (5-10 min): Architecture, key decisions, code snippets
   Show diagram. Walk through data flow. Highlight non-obvious decisions.

4. TRADE-OFFS (3-5 min): What are we giving up?
   "Trade-off: scroll position state management becomes complex.
    Accessibility: screen readers may not see all items.
    Mitigation: aria-rowcount + progressive loading fallback."

5. QUESTIONS (5+ min): Actively invite challenges
   "I'd especially like feedback on the accessibility approach."
```

**Presenting to Non-Technical Audience (PM, leadership, clients):**

```
Structure: IMPACT → APPROACH → TIMELINE → RISKS → ASK

1. IMPACT (2-3 min): Lead with business outcome
   "This will reduce page load from 5s to under 1s,
    which our data shows increases user retention by 15%."

2. APPROACH (2 min): High-level, analogy-based
   "Think of it like a restaurant menu. Instead of printing
    the entire menu on one page, we show one page at a time
    and let users flip pages."

3. TIMELINE (1-2 min): Concrete milestones
   "2 weeks for core implementation, 1 week for testing,
    1 week for gradual rollout. Total: 4 weeks."

4. RISKS (1-2 min): Honest, with mitigations
   "Main risk: older browsers may not support this fully.
    Mitigation: fallback to current approach for <5% of users."

5. ASK (1 min): What you need from them
   "I need: (1) approval to prioritize this over feature Y,
    (2) design support for the new loading states."
```

### 4. Conflict Resolution Communication

**Disagreeing Constructively in Code Reviews:**

| Instead of                                         | Say this                                                                                                              |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| "This is wrong."                                   | "I think approach X might cause issue Y in scenario Z. What do you think about alternative W?"                        |
| "We should use X."                                 | "I'd suggest X because of [reason]. But I see the appeal of your approach for [their reason]. How do we weigh these?" |
| (Approving silently when you disagree)             | "I have a concern about X but don't want to block. Can we track this as tech debt and revisit in sprint N?"           |
| "This doesn't follow best practices."              | "In my experience, pattern X has caused [specific problem] in [specific context]. Have you considered Y?"             |
| (No comment, just rewriting their code in next PR) | "I'd approach this differently — here's a snippet showing my thinking. Happy to pair if you'd like to discuss."       |

**Escalation Framework for Architecture Disagreements:**

```
Level 1: Direct Discussion (PR comment / Slack)
  → Share your perspective + reasoning
  → Ask for their reasoning
  → Look for the underlying goal you both share

Level 2: Data-Driven Comparison (if Level 1 stalls)
  → Prototype both approaches (time-boxed: 2-4 hours each)
  → Compare with objective criteria: performance, maintainability, complexity
  → Present comparison, let data speak

Level 3: Seek External Input (if Level 2 inconclusive)
  → Bring to team architecture review
  → Present both sides fairly (not just yours)
  → Let the group decide, then commit fully

Level 4: Escalate to Tech Lead (rare, last resort)
  → Only when decision has significant long-term impact
  → Present both sides + your recommendation + why you think it matters
  → Accept the decision and move forward without resentment
```

**"Disagree and Commit" principle**: Sau khi decision da duoc lam, du ban khong dong y, ban commit 100% vao execution. Khong passive-aggressive, khong "I told you so" khi co van de. Neu van de xay ra, address no professionally: "We're seeing issue X. Here's my proposal to fix it."

---

## Examples / Vi Du Thuc Te (STAR Format)

### Example 1: Strong Communication — RFC Drives Cross-Team Alignment

**Situation**: Team can migrate authentication tu session-based sang JWT across 4 microservices. 3 teams affected, moi team co timeline va priorities khac nhau.

**Task**: Toi la senior engineer lead migration. Can align 3 teams + PM + security team tren approach, timeline, va rollback plan.

**Action**:

1. Viet RFC chi tiet voi 3 alternatives considered (JWT stateless, JWT + refresh token, JWT + Redis blacklist)
2. Pre-aligned voi tech lead cua moi team truoc khi publish RFC (1:1 meetings)
3. Organized 30-min review meeting, focused on 2 unresolved questions tu async feedback
4. Created migration runbook voi per-service checklist va rollback procedures
5. Set up weekly migration standup (15 min) de track progress across teams

**Result**: Migration hoan thanh trong 6 tuan (original estimate: 8 tuan). Zero production incidents. RFC became template cho future cross-team migrations. 3 team leads feedback: "This was the smoothest cross-team project we've done."

**Why this is strong**: Proactive communication. Written artifacts. Pre-alignment. Clear escalation path.

### Example 2: Weak Communication — Silent Disagreement Causes Rework

**Situation**: Trong architecture review, team quyet dinh dung GraphQL cho internal service-to-service communication. Toi thay chua hop ly vi internal services khong can flexible querying cua GraphQL — gRPC se performant hon va type-safe hon.

**Task**: Toi can voice concern va influence decision.

**Action** (what actually happened — the WRONG approach):

1. Toi im lang trong meeting vi senior hon toi da de xuat GraphQL
2. Toi noi nho voi 1 dong nghiep: "Toi nghi GraphQL khong phu hop"
3. Toi implement GraphQL nhung code quality khong toi uu vi toi khong convinced
4. 3 thang sau, performance issues xuat hien dung nhu toi du doan

**Result**: Team phai migrate tu GraphQL sang gRPC — ton 4 tuan rework. Trust bi anh huong vi moi nguoi hoi "tai sao khong ai raise concern nay som hon?"

**What should have happened**:

1. Raise concern trong meeting: "I see the appeal of GraphQL for flexibility. My concern is that for internal service communication, we don't need flexible queries — gRPC gives us 3x throughput and compile-time type safety. Can we compare with a 2-hour POC?"
2. Neu bi dismissed: follow up voi data (benchmark results)
3. Neu still overruled: commit to GraphQL fully, but document the concern in the ADR

### Example 3: Strong Communication — Translating Technical Risk to Business Impact

**Situation**: Phat hien database query N+1 problem se cause outage khi traffic tang 3x trong upcoming Black Friday sale event. Dev team hieu van de nhung PM khong prioritize fix vi "hien tai chua co issue gi".

**Task**: Convince PM de prioritize fix truoc Black Friday (2 tuan nua).

**Action**:

1. Khong noi: "Co N+1 query problem can fix." (PM khong hieu N+1 la gi)
2. Noi: "Voi traffic hien tai, trang product load trong 200ms. Khi traffic tang 3x vao Black Friday, trang se load 6-8 giay hoac timeout hoan toan. Du lieu: moi 1 giay delay giam 7% conversion. Voi 3x traffic, chung ta co the mat $50K revenue trong 1 ngay."
3. Trinh bay 2 options: (A) Fix trong 3 ngay, 0 risk, (B) Khong fix, chap nhan risk mat revenue + on-call incident during sale
4. Cung cap rollback plan neu fix introduce regression

**Result**: PM approve fix ngay. Fix deploy 5 ngay truoc Black Friday. Black Friday: zero downtime, trang load 180ms o 3x traffic. PM tu do luon hoi: "Co technical risk nao cho upcoming launch khong?"

**Why this is strong**: Translated technical issue to business language ($, conversion, risk). Provided options, not ultimatums. Quantified impact.

---

## Anti-patterns / Sai Lam Thuong Gap

| Anti-pattern                                                                                        | Tai sao co van de                                                                                                | Cach khac phuc                                                                                                                                            |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Silent Disagreement** — Im lang khi khong dong y trong meeting, roi complaint sau lung            | Decision duoc lam khong co full information. Khi van de xay ra, trust bi damage vi "ban biet ma khong noi"       | Raise concern ngay, du ngan gon: "I have a concern about X. Can I share?" Neu khong thoai mai noi trong meeting, follow up bang written comment trong 24h |
| **Over-Technical Explanations to PM** — Giai thich bang jargon ky thuat khi PM hoi status           | PM khong hieu, mat confidence vao ban vi tuong ban khong biet giai thich, hoac tuong van de phuc tap hon thuc te | Dung "So What?" test: sau moi cau ky thuat, hoi "PM care vi ly do gi?" Translate sang impact: time, money, user experience, risk                          |
| **Hero Syndrome Writing** — Khong viet docs/RFC vi "toi nho het trong dau"                          | Knowledge silo. Bus factor = 1. Khi ban nghi phep hoac roi team, moi thu chao dao                                | Rule: neu decision anh huong > 1 nguoi hoac > 1 sprint, viet lai. ADR chi can 10 dong                                                                     |
| **Bikeshedding in Code Reviews** — Comment 20 nit-picks ve naming/style, bo qua architecture issues | Waste reviewer va author time. Architecture bugs ship to production trong khi team tranh cai ve semicolons       | Phan loai comments: "Blocker", "Suggestion", "Nit". Focus review time vao logic + architecture. Automate style voi linters                                |
| **Copy-Paste Status Updates** — Gui cung 1 message status cho moi audience                          | PM nhan thong tin qua technical, leadership nhan thong tin qua chi tiet, engineers nhan thong tin thieu depth    | Dung Stakeholder Communication Matrix. 1 phut extra de customize message cho audience. Template giup tiet kiem thoi gian                                  |
| **Late Risk Communication** — Biet co risk nhung doi den khi van de xay ra moi noi                  | Team khong co thoi gian react. Ban bi xem la "khong reliable"                                                    | Rule: raise risk khi probability > 30% HOAC impact > 1 sprint delay. Format: "Risk: [X]. Impact: [Y]. Mitigation: [Z]."                                   |

---

## Memory Hooks / Meo Ghi Nho

**CLEAR Model for L5 Communication:**

```
C — Contextualize: Set the scene before diving into details
L — Layer: Adjust detail level for your audience
E — Evidence: Back claims with data, not opinions
A — Actionable: End every communication with clear next steps
R — Responsive: Address feedback, close the loop
```

**"Elevator Pitch" Rule**: Neu ban khong the giai thich technical decision cua ban trong 30 giay cho PM, ban chua hieu no du sau. Simplicity is the ultimate sophistication.

**"Write It Down" Trigger**: Bat ky khi nao ban noi cau "nhu toi da noi trong meeting hom truoc..." — do la signal ban can viet doc thay vi chi noi.

---

## Q&A Section — Interview Questions

### Q: How do you communicate technical decisions to non-technical stakeholders? / Ban giai thich technical decisions cho nguoi khong ky thuat nhu the nao? :green_circle: Junior

**A:** Use the "Impact-First" approach: start with what the stakeholder cares about (user experience, timeline, cost), then explain the technical choice in terms of how it serves that goal.

"Toi luon bat dau bang ket qua ma nguoi nghe quan tam. Voi PM, toi noi ve user impact va timeline. Voi leadership, toi noi ve cost va strategic alignment. Chi tiet ky thuat chi dua vao khi nguoi nghe hoi them hoac khi no truc tiep anh huong den decision cua ho."

Concrete example: Thay vi noi "We need to implement a CDN with edge caching and invalidation strategy", toi noi "Images on our site take 3 seconds to load in Vietnam. By storing copies closer to users, we can reduce this to under 0.5 seconds. This costs $200/month but our data shows it will reduce bounce rate by 20%."

**Interview Signal:**

- Strong: Adjusts language for audience, leads with business impact, uses analogies
- Weak: "I explain the technical details and hope they understand"

---

### Q: Describe a time you had to drive alignment across multiple teams on a technical decision. How did you handle disagreements? / Ke ve lan ban phai lam cho nhieu team dong thuan ve 1 quyet dinh ky thuat. Ban xu ly bat dong ra sao? :yellow_circle: Mid

**A:** The key is structured communication with pre-alignment before group decisions.

"Toi dung quy trinh 3 buoc: (1) **Pre-align** — gap rieng tung team lead de hieu priorities va concerns cua ho truoc. (2) **Document** — viet RFC voi alternatives considered, ghi nhan concerns cua moi team. (3) **Facilitate** — to chuc meeting chi focus vao unresolved points, khong re-hash nhung gi da dong thuan."

"Khi co disagreement, toi tim 'shared goal' — thuong la moi nguoi muon dieu tot nhat cho users/system nhung khac nhau ve approach. Toi reframe tu 'my approach vs your approach' sang 'which approach best achieves our shared goal given these constraints?' Khi can, toi propose time-boxed POC de let data decide."

"Neu khong dat duoc consensus, toi escalate bang cach present both sides fairly cho decision-maker, khong chi advocate cho phia minh. Sau khi decision duoc lam, toi commit 100% bat ke co phai la choice cua toi khong."

**Interview Signal:**

- Strong: Shows pre-alignment strategy, uses documentation, handles disagreement with data not authority
- Weak: "I just presented my idea and everyone agreed" or "I let the tech lead decide"

---

### Q: How do you decide what to document formally (RFC/ADR) vs what to communicate verbally? Tell me about a time your communication approach prevented or caused a significant issue. / Ban quyet dinh khi nao can viet RFC/ADR va khi nao chi can noi? Ke ve lan communication approach cua ban ngan chan hoac gay ra van de lon. :red_circle: Senior

**A:** The documentation decision depends on three factors: **blast radius** (how many people/teams affected), **reversibility** (how easy to undo), and **longevity** (will this matter in 6 months?).

My framework:

```
Need RFC when: blast radius > 1 team OR irreversible OR will matter in 6+ months
Need ADR when: blast radius = 1 team AND significant architectural choice
Verbal is fine: reversible, 1-2 people affected, short-lived decisions
```

"Trong mot du an, chung toi quyet dinh doi API versioning strategy tu URL-based (/v1/, /v2/) sang header-based. Toi viet RFC vi: (1) anh huong 4 teams consume API, (2) khong the revert de dang sau khi clients adopt, (3) se la pattern cho 2+ nam tiep theo."

"Nguoc lai, khi chon giua 2 React state management approaches trong 1 component, toi chi discuss tren PR vi blast radius nho va de thay doi sau."

Story about prevention: "Toi tung phat hien team dang plan database migration khong co written plan. 3 teams se bi affect, nhung tat ca discussion chi xay ra tren Slack threads. Toi viet migration ADR trong 2 gio, bao gom rollback procedure va team-by-team checklist. Trong luc viet, toi phat hien 1 team van depend vao column se bi remove — dieu khong ai nhan ra trong verbal discussions. ADR do ngan duoc 1 production incident."

**Interview Signal:**

- Strong: Has clear framework for documentation decisions, provides concrete examples of both documenting and choosing not to, shows how documentation caught issues
- Weak: "I document everything" (over-engineering) or "I prefer Slack" (under-documenting)

**Follow-up Chain:**

1. "How do you ensure RFCs actually get read and not just filed away?"
2. "What's your approach when you inherit a codebase with zero documentation? How do you prioritize what to document first?"
3. "How do you measure whether your team's communication practices are effective? What signals tell you communication is breaking down?"

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

> **Interviewer:** "How do you communicate technical decisions to non-technical stakeholders? — explain it in 30 seconds."

**Ideal 30-second answer / Câu trả lời 30 giây:**

1. I use the CLEAR model — Context, Logic, Evidence, Alternatives, Recommendation — to structure every technical explanation for any audience.
2. At L5, you tailor depth and language per audience and proactively surface risks and trade-offs, not just the final decision.
3. For example: for our DB migration I told PMs "users will see 2-minute downtime Tuesday night" — no jargon, clear impact, clear timing.
4. In the interview, show two versions of the same decision: one for engineers with technical depth, one for PMs with business impact.

---

## Self-Check / Tu Kiem Tra

> **Dong file nay lai truoc khi lam.**

- [ ] **Retrieval**: Viet 5 thanh phan cua CLEAR model tu tri nho. So sanh voi file.
- [ ] **Application**: Chon 1 technical decision gan day cua ban. Viet 1 doan giai thich cho PM (3-4 cau, khong jargon) va 1 doan cho engineer (chi tiet ky thuat + trade-offs). So sanh 2 versions — chung khac nhau the nao?
- [ ] **Diagnosis**: Nhin lai 3 PR comments gan nhat cua ban. Phan loai moi comment: Blocker / Suggestion / Nit. Ty le nao? Ban co dang bikeshedding khong?
- [ ] **Recall**: Ve Stakeholder Communication Matrix tu tri nho (5 audiences, columns: What They Need, Format, Cadence). So sanh.
- [ ] **Reflection**: Ke 1 lan ban "silent disagreement" hoac communicate risk qua tre. Neu lam lai, ban se noi gi va noi luc nao?

**Feynman Prompt:** Giai thich cho nguoi khong lam tech tai sao 1 engineer gioi communication co gia tri hon 1 engineer chi gioi code. Dung 1 analogy tu doi thuong (vi du: bac si gioi nhung khong giai thich duoc cho benh nhan).

**Spaced Repetition:** On lai sau **3 ngay -> 7 ngay -> 14 ngay**.

---

## Connections / Lien Ket

- <-- **Built on**: [STAR Method](../09-behavioral/01-star-method.md) — framework de structure communication stories cho interview
- <-- **Built on**: [Storytelling](../09-behavioral/04-storytelling.md) — narrative techniques de make communication memorable
- --> **Enables**: [Leadership & Mentoring](./05-leadership-and-mentoring.md) — communication la foundation cua mentoring va team leadership
- --> **Enables**: [Scope & Impact](./01-scope-and-impact.md) — clear communication giup ban expand scope va demonstrate impact
- <-> **Related**: [Problem-Solving Frameworks](./02-problem-solving-frameworks.md) — communication cua approach quan trong nhu approach chinh no
- <-> **Related**: [Common Behavioral Questions](../09-behavioral/03-common-questions.md) — nhieu behavioral questions test communication truc tiep
- Applied in: RFC/ADR writing, code reviews, architecture discussions, stakeholder meetings, incident postmortems
