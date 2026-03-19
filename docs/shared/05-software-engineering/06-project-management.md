# Project Management and Team Practices — Quản lý dự án và thực hành đội nhóm

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)
> - `docs/shared/05-software-engineering/03-sdlc-and-practices.md`
> - `docs/shared/05-software-engineering/05-code-quality-and-review.md`
> - `docs/be-track/04-be-system-design/05-observability-and-scale.md`

---

## Real-World Scenario / Tình Huống Thực Tế

**Axon Active project delay (ứng viên chia sẻ):** Mid-level developer estimate 2 weeks cho một feature — PM accepts. Week 1: discovered external API dependency not documented. Week 2: API has rate limiting requiring architecture change. Week 3: "I need 1 more week". PM angry — deadline already communicated to client. Root cause: không có risk identification upfront, không có buffer, không communicate blocker ngay khi phát hiện.

**Bài học:** Estimation và communication là technical skills, không chỉ "soft skills". Senior engineer đưa estimates với explicit assumptions, risks, và updates proactively — không phải perfect accuracy.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Project management trong engineering giống planning một chuyến đi: estimation là "bao lâu đến?" (phải kể cả traffic, dừng đổ xăng, nghỉ ngơi), risk identification là "nếu cao tốc kẹt thì sao?", scope management là "đi thêm điểm nào thì trễ bao nhiêu?". Senior developer là người lái biết đường, cung cấp thông tin cho PM để ra quyết định.

**Why it matters:** "Tell me about a time you missed a deadline" và "How do you handle scope creep" là câu hỏi phổ biến ở Senior interviews. Không có framework để trả lời → câu trả lời sẽ vague và không thuyết phục.

---

## 0. Learning Goals — Mục tiêu học tập

Sau khi hoàn thành chương này, bạn cần:

- [ ] Giải thích được vì sao kỹ sư cần kỹ năng quản lý dự án, không chỉ PM/Manager.
- [ ] Trình bày được Agile Manifesto (4 values, 12 principles) và khi nào Agile thất bại.
- [ ] Phân biệt Scrum vs Kanban: roles, events, artifacts, metrics, use-case phù hợp.
- [ ] Áp dụng các kỹ thuật ước lượng (story points, Planning Poker, T-shirt sizing, three-point).
- [ ] Nhận diện và quản lý rủi ro kỹ thuật bằng probability x impact matrix.
- [ ] Hiểu Team Topologies (Conway's Law, 4 loại team, 3 interaction modes).
- [ ] Nắm quy trình Incident Management: detect → triage → mitigate → resolve → review.
- [ ] Mô tả trách nhiệm Tech Lead, ADR, RFC process, mentoring.
- [ ] Hiểu release management: CI/CD, feature flags, canary, blue-green, rollback.
- [ ] Sử dụng DORA metrics, SPACE framework và tránh bẫy Goodhart's Law.

---

## 1. Why Engineers Need PM Skills — Vì sao kỹ sư cần kỹ năng quản lý dự án

### 🟢 Q: Why should engineers care about project management? `[Junior]`

**A:** Kỹ sư không chỉ viết code. Ngay cả IC (Individual Contributor) cũng cần:
- **Ước lượng** thời gian hoàn thành task chính xác.
- **Giao tiếp** tiến độ, blocker, rủi ro cho team và stakeholder.
- **Ưu tiên** công việc phù hợp với mục tiêu sản phẩm.
- **Phối hợp** với PM, QA, Design, DevOps trong cross-functional team.

Không biết PM skills = khó thăng tiến, khó làm việc hiệu quả trong team lớn.

### 🟡 Q: What is the difference between IC and Manager track? `[Mid]`

**A:** Hai career track song song trong engineering:

| Khía cạnh | IC Track | Manager Track |
|---|---|---|
| Focus | Technical depth, architecture | People, process, strategy |
| Output | Code, design docs, ADRs, RFCs | Team performance, hiring, culture |
| Growth path | Senior → Staff → Principal → Distinguished | EM → Director → VP Engineering |
| Decision style | Technical trade-offs | Organizational trade-offs |
| Influence | Through expertise & artifacts | Through people & process |

**Điểm chung:** Cả hai đều cần communication, prioritization, và project management skills.

### 🔴 Q: What are Staff+ engineer responsibilities beyond coding? `[Senior]`

**A:** Staff+ engineer (Staff, Principal, Distinguished) có trách nhiệm vượt xa code:

- **Technical strategy:** Định hướng kiến trúc dài hạn cho org, không chỉ một team.
- **Cross-team coordination:** Dẫn dắt initiative liên quan nhiều team (migration, platform adoption).
- **Organizational influence:** Viết RFCs, ADRs tạo tiêu chuẩn cho toàn engineering org.
- **Mentoring at scale:** Không chỉ 1:1 mà tạo programs, tech talks, engineering blog.
- **Stakeholder management:** Trình bày trade-off kỹ thuật cho VP/C-level bằng ngôn ngữ business.
- **Glue work:** Unblock teams, facilitate technical decisions, fill gaps mà không ai own.

**Interview tip:** Khi được hỏi về Staff+ role, nêu ví dụ cụ thể: "Tôi đã dẫn dắt migration từ monolith sang microservices qua 3 team trong 6 tháng, viết RFC, track progress weekly, giải quyết conflict giữa team A muốn gRPC và team B muốn REST."

### 🟡 Q: How to collaborate effectively in a cross-functional team? `[Mid]`

**A:** Cross-functional team gồm PM, Design, Engineering, QA, DevOps. Để cộng tác hiệu quả:

- **Shared language:** Hiểu terminology của nhau (PM nói "user story", Design nói "user flow").
- **Shared artifacts:** PRD, design mock, technical spec cùng review trước sprint.
- **Definition of Ready:** User story phải có acceptance criteria, design approved, technical feasibility checked trước khi vào sprint.
- **Async communication:** Viết rõ ràng trong ticket, document decisions, tránh tribal knowledge.
- **Feedback loops:** Demo thường xuyên, không đợi cuối sprint mới review.

---

## 2. Agile Deep Dive — Agile chuyên sâu

### 🟢 Q: What are the 4 values of the Agile Manifesto? `[Junior]`

**A:** Agile Manifesto (2001, 17 tác giả) đề ra 4 giá trị cốt lõi:

1. **Individuals and interactions** over processes and tools
   - Con người và giao tiếp quan trọng hơn quy trình và công cụ.
   - Không phải bỏ tool, mà ưu tiên người trước.

2. **Working software** over comprehensive documentation
   - Phần mềm chạy được là thước đo tiến độ, không phải tài liệu dày.
   - Docs vẫn cần, nhưng đủ dùng, không excessive.

3. **Customer collaboration** over contract negotiation
   - Hợp tác liên tục với khách hàng thay vì đàm phán hợp đồng cứng nhắc.
   - Feedback loop ngắn, pivot khi cần.

4. **Responding to change** over following a plan
   - Thích nghi thay đổi thay vì bám kế hoạch cứng.
   - Plan vẫn cần, nhưng plan phải linh hoạt.

**Chú ý:** "over" không có nghĩa bỏ vế phải, mà ưu tiên vế trái hơn.

### 🟡 Q: What are the 12 Agile principles? `[Mid]`

**A:** 12 nguyên lý đằng sau Agile Manifesto:

| # | Principle | Giải thích ngắn |
|---|---|---|
| 1 | Highest priority: satisfy customer through early and continuous delivery | Giao phần mềm giá trị sớm và liên tục |
| 2 | Welcome changing requirements, even late in development | Đón nhận thay đổi, coi đó là lợi thế cạnh tranh |
| 3 | Deliver working software frequently (weeks to months) | Chu kỳ giao hàng ngắn, ưu tiên ngắn hơn |
| 4 | Business people and developers work together daily | PM/business và dev phối hợp hàng ngày |
| 5 | Build projects around motivated individuals, give them support and trust | Trao quyền và tin tưởng team |
| 6 | Face-to-face conversation is the most efficient communication | Giao tiếp trực tiếp hiệu quả nhất (đời remote: video call) |
| 7 | Working software is the primary measure of progress | Đo tiến độ bằng sản phẩm chạy được, không phải % completion |
| 8 | Sustainable pace: sponsors, developers, users maintain constant pace | Tốc độ bền vững, tránh burnout |
| 9 | Continuous attention to technical excellence enhances agility | Chất lượng kỹ thuật tốt giúp linh hoạt hơn |
| 10 | Simplicity — maximize work not done — is essential | Làm ít nhất để đạt mục tiêu, tránh over-engineering |
| 11 | Best architectures, requirements, designs emerge from self-organizing teams | Team tự tổ chức tạo ra kết quả tốt nhất |
| 12 | Regular reflection and adjustment of behavior | Retro định kỳ để cải tiến liên tục |

### 🟡 Q: What is the detailed comparison between Agile and Waterfall? `[Mid]`

**A:**

| Khía cạnh | Waterfall | Agile |
|---|---|---|
| Approach | Sequential, phase-gate | Iterative, incremental |
| Requirements | Fixed upfront | Evolving, discovered |
| Planning | Big upfront plan | Rolling wave, sprint-level |
| Feedback | Late (after deployment) | Early and continuous |
| Risk | Back-loaded (discover late) | Front-loaded (fail fast) |
| Change cost | High (rework previous phases) | Low (small iterations) |
| Documentation | Heavy, formal | Sufficient, living docs |
| Testing | Phase after development | Continuous, integrated |
| Delivery | Big bang release | Incremental releases |
| Team structure | Specialized silos | Cross-functional |
| Customer involvement | Beginning and end | Throughout |
| Success metric | Conformance to plan | Business value delivered |

**Khi Waterfall phù hợp hơn Agile:**
- Regulated industries (medical devices, aviation) cần formal verification.
- Fixed-price contracts với scope rõ ràng, không đổi.
- Hardware-dependent projects với long lead time.

### 🔴 Q: When does Agile fail? What is "Cargo Cult Agile"? `[Senior]`

**A:** Agile thất bại khi team làm theo hình thức mà không hiểu tinh thần:

**Cargo Cult Agile (Agile hình thức):**
- Có daily standup nhưng chỉ là status report cho manager, không giải quyết blocker.
- Có sprint nhưng scope thay đổi giữa sprint liên tục.
- Có retro nhưng không có action items, hoặc action items không ai follow up.
- Ước lượng story point nhưng manager dùng để đánh giá performance.

**Agile Theater:**
- Board Jira đẹp nhưng không phản ánh công việc thật.
- Rename "requirements" thành "user stories" mà không thay đổi mindset.
- Nói "Agile" nhưng vẫn yêu cầu detailed plan 6 tháng trước và phạt khi trễ.

**Root causes:**
- Management không thực sự trao quyền cho team.
- Thiếu psychological safety — team không dám nói thật.
- Áp dụng Agile cho tổ chức mà không thay đổi culture.
- Scrum Master/Coach không có quyền hoặc competence.

### 🔴 Q: What are SAFe, LeSS, and Nexus? `[Senior]`

**A:** Scaling frameworks cho Agile ở quy mô lớn (nhiều team):

| Framework | Đặc điểm | Khi phù hợp | Nhược điểm |
|---|---|---|---|
| **SAFe** (Scaled Agile) | Heavyweight, PI Planning (8-12 weeks), ART (Agile Release Train) | Enterprise lớn 50-125+ devs, cần alignment | Quá nặng, bureaucratic, dễ thành "Waterfall in Agile clothing" |
| **LeSS** (Large-Scale Scrum) | Lightweight, giữ nguyên Scrum rules, 1 Product Owner cho nhiều team | 2-8 teams cùng product | Yêu cầu PO rất mạnh, khó khi team > 8 |
| **Nexus** (Scrum.org) | Extension của Scrum, thêm Nexus Integration Team | 3-9 Scrum teams | Ít tooling/community hơn SAFe |

**Trade-off chung:** Scaling framework nào cũng thêm overhead. Trước khi scale process, hãy xem xét giảm coupling giữa teams (Team Topologies, microservices) để giảm nhu cầu coordination.

---

## 3. Scrum Framework — Framework Scrum

### 🟢 Q: What are the three Scrum roles? `[Junior]`

**A:** Scrum có 3 vai trò cốt lõi (accountability):

**1. Product Owner (PO):**
- Maximizes giá trị sản phẩm.
- Owns và sắp xếp Product Backlog.
- Quyết định "làm gì" (what), không quyết định "làm thế nào" (how).
- Là người duy nhất có quyền thay đổi priority backlog.

**2. Scrum Master (SM):**
- Servant-leader, giúp team hiểu và áp dụng Scrum đúng.
- Gỡ impediments (blocker) cho team.
- Facilitate events, coach team về continuous improvement.
- Không phải project manager, không assign tasks.

**3. Development Team (Developers):**
- Cross-functional: có đủ skill để tạo increment mỗi sprint.
- Self-organizing: tự quyết định cách hoàn thành Sprint Goal.
- Accountable cho chất lượng và Definition of Done.
- Ideal size: 3-9 người (Scrum Guide 2020: thường ≤ 10).

### 🟡 Q: What are the five Scrum events? `[Mid]`

**A:**

| Event | Timebox | Mục tiêu | Đầu ra |
|---|---|---|---|
| **Sprint** | 1-4 weeks (consistent) | Container cho tất cả events | Potentially releasable increment |
| **Sprint Planning** | Max 8h (sprint 4 tuần) | Chọn Sprint Goal + Sprint Backlog | Sprint Goal + plan rõ ràng |
| **Daily Scrum** | 15 phút | Inspect progress toward Sprint Goal | Plan cho 24h tiếp |
| **Sprint Review** | Max 4h (sprint 4 tuần) | Demo increment, nhận feedback | Adjusted Product Backlog |
| **Sprint Retrospective** | Max 3h (sprint 4 tuần) | Inspect process, plan improvements | Committed action items |

**Daily Scrum format hiệu quả:**
- Không phải status report cho manager.
- 3 câu hỏi gốc: What did I do? What will I do? Any blockers?
- Hoặc: walk-the-board (đi từ phải sang trái trên board).
- Focus: team có đang tiến đến Sprint Goal không?

### 🟡 Q: What are Scrum artifacts? `[Mid]`

**A:**

**1. Product Backlog:**
- Ordered list toàn bộ work cần làm cho sản phẩm.
- PO owns; refine thường xuyên (backlog refinement).
- Items trên cao = chi tiết, nhỏ, ready; dưới thấp = coarse-grained.
- Commitment: **Product Goal** (mục tiêu dài hạn).

**2. Sprint Backlog:**
- Selected Product Backlog items cho sprint + plan để hoàn thành.
- Thuộc sở hữu của Developers; có thể điều chỉnh trong sprint (scope, không phải Sprint Goal).
- Commitment: **Sprint Goal** (mục tiêu sprint).

**3. Increment:**
- Tổng tất cả Product Backlog items hoàn tất trong sprint + tất cả increment trước đó.
- Phải đạt **Definition of Done** mới tính là increment.
- Commitment: **Definition of Done** (tiêu chuẩn chất lượng).

### 🟡 Q: What is Definition of Done and why is it critical? `[Mid]`

**A:** Definition of Done (DoD) là tiêu chuẩn chất lượng thống nhất mà increment phải đạt:

```text
Definition of Done example:
- [ ] Code reviewed by at least 1 peer
- [ ] Unit tests pass (coverage >= 80% for new code)
- [ ] Integration tests pass
- [ ] No critical/major SonarQube issues
- [ ] API docs updated (if applicable)
- [ ] Feature flag configured (if applicable)
- [ ] Monitoring/alerting configured
- [ ] Deployed to staging and smoke tested
```

**Tại sao quan trọng:**
- Tạo shared understanding: "done" nghĩa là gì cho mọi người.
- Tránh hidden work: "code xong rồi nhưng chưa test/deploy."
- Đảm bảo increment thực sự releasable.

### 🟡 Q: How do velocity and burndown charts work? `[Mid]`

**A:**

**Velocity:**
- Tổng story points hoàn thành (đạt DoD) trong sprint.
- Dùng trung bình 3-5 sprints gần nhất để forecast capacity.
- Velocity chỉ có ý nghĩa trong cùng một team; KHÔNG so sánh giữa teams.

**Burndown chart:**
- Trục Y: remaining work (story points hoặc tasks).
- Trục X: ngày trong sprint.
- Đường ideal: giảm đều từ tổng xuống 0.
- Thực tế: nếu đường nằm trên ideal = đang chậm; nằm dưới = đang nhanh.

```text
Story Points
  |
30|*
  |  *
20|    *
  |      *  *        <- plateau = blocked
10|           *
  |             *
 0|________________> Days
  1  2  3  4  5  6
```

### 🔴 Q: What are common anti-patterns in Scrum? `[Senior]`

**A:**

| Anti-pattern | Triệu chứng | Hậu quả | Khắc phục |
|---|---|---|---|
| **Absent PO** | PO không available, dev tự đoán priority | Build sai thứ, scope creep | PO commit ít nhất 50% thời gian cho team |
| **Sprint scope change** | Thêm work giữa sprint thường xuyên | Team không commit, velocity vô nghĩa | Negotiate: swap equal-sized items hoặc đợi sprint sau |
| **No Sprint Goal** | Sprint = danh sách tasks rời rạc | Không có focus, khó cancel sprint khi cần | PO + team thống nhất 1 goal ngắn gọn mỗi planning |
| **Retro theater** | Retro có action items nhưng không ai follow up | Team mất niềm tin vào process | Track action items visible, review đầu retro tiếp |
| **Velocity as KPI** | Manager dùng velocity để đánh giá performance | Inflation story points, gaming | Chỉ dùng velocity để forecast, không phải evaluate |
| **Waterfall-in-sprints** | Sprint 1: design, Sprint 2: code, Sprint 3: test | Không có releasable increment | Mỗi sprint phải deliver working software end-to-end |
| **Meeting-heavy Scrum** | Quá nhiều meetings ngoài Scrum events | Dev có ít time cho deep work | Strict timebox, consolidate meetings, protect maker schedule |

---

## 4. Kanban — Phương pháp Kanban

### 🟢 Q: What are the core principles of Kanban? `[Junior]`

**A:** Kanban (nguồn gốc Toyota, áp dụng software bởi David J. Anderson) có 6 nguyên lý:

**Core practices:**
1. **Visualize work:** Mọi công việc hiện trên board.
2. **Limit WIP (Work In Progress):** Giới hạn số item đang xử lý đồng thời.
3. **Manage flow:** Tối ưu dòng chảy công việc từ đầu đến cuối.
4. **Make policies explicit:** Quy tắc rõ ràng (DoD, WIP limits, priority rules).
5. **Implement feedback loops:** Standup, review, retrospective.
6. **Improve collaboratively, evolve experimentally:** Cải tiến liên tục bằng thử nghiệm.

### 🟡 Q: How does a Kanban board work? `[Mid]`

**A:**

```text
┌──────────┬──────────┬──────────────┬──────────┬────────┐
│ Backlog  │  Ready   │ In Progress  │  Review  │  Done  │
│          │          │   WIP = 3    │  WIP = 2 │        │
├──────────┼──────────┼──────────────┼──────────┼────────┤
│ Story E  │ Story D  │ Story B      │ Story A  │        │
│ Story F  │          │ Story C      │          │        │
│ Bug G    │          │              │          │        │
│          │          │              │          │        │
│ ──────── │          │              │          │        │
│ Expedite │          │ [URGENT]     │          │        │ <- Swimlane
│ Hotfix H │          │              │          │        │
└──────────┴──────────┴──────────────┴──────────┴────────┘
```

**Thành phần:**
- **Columns:** Đại diện các bước trong workflow (To Do → Done).
- **WIP limits:** Mỗi cột có giới hạn, ví dụ In Progress = 3 nghĩa là tối đa 3 items.
- **Swimlanes:** Hàng ngang phân loại công việc (feature, bug, expedite).
- **Cards:** Mỗi card = 1 work item với thông tin: title, assignee, deadline, type.

### 🟡 Q: What is the difference between pull system and push system? `[Mid]`

**A:**

| Khía cạnh | Push System | Pull System |
|---|---|---|
| Trigger | Manager assign work | Worker pulls when capacity available |
| WIP | Không kiểm soát | Controlled by WIP limits |
| Bottleneck | Hidden until late | Visible immediately |
| Overload risk | High (work pushed regardless) | Low (only pull when ready) |
| Example | Waterfall handoff, email-driven tasks | Kanban board, supermarket restock |

**Pull system giúp:** Giảm context switching, lộ bottleneck sớm, tăng focus và throughput.

### 🟡 Q: What are lead time and cycle time? `[Mid]`

**A:**

```text
 Customer request                              Delivered
      |                                            |
      |←──────────── Lead Time ───────────────────→|
      |                                            |
      |    Work started         Work completed     |
      |        |                      |            |
      |        |←── Cycle Time ──────→|            |
      |        |                      |            |
  ────┼────────┼──────────────────────┼────────────┼──→ time
```

- **Lead Time:** Thời gian từ khi request tạo đến khi deliver cho customer. Bao gồm thời gian chờ.
- **Cycle Time:** Thời gian từ khi bắt đầu làm đến khi hoàn tất. Chỉ tính active work.
- **Throughput:** Số items hoàn thành trên đơn vị thời gian.
- **Flow Efficiency:** (Active time / Lead time) x 100%. Thường chỉ 15-40% ở nhiều team.

### 🔴 Q: What is a Cumulative Flow Diagram (CFD)? `[Senior]`

**A:** CFD hiển thị số lượng items ở mỗi trạng thái theo thời gian:

```text
Items
  |         Done ████████████████████████████████
  |              ████████████████████████████████
  |    Review    ░░░░░░░░░████████████████████
  |              ░░░░░░░░░████████████████████
  | In Progress  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████████
  |              ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████████
  |   Backlog    ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
  |__________________________________________> Time
```

**Đọc CFD:**
- Khoảng cách ngang giữa 2 bands = lead time cho giai đoạn đó.
- Khoảng cách dọc = WIP tại thời điểm đó.
- Bands phình to = bottleneck ở giai đoạn đó.
- Bands hẹp đều = flow tốt, predictable delivery.

### 🟡 Q: When should you use Kanban over Scrum? `[Mid]`

**A:**

| Tiêu chí | Chọn Scrum | Chọn Kanban |
|---|---|---|
| Work nature | Feature development, product teams | Support, ops, maintenance, mixed work |
| Predictability need | High (sprint commitment) | Moderate (flow-based forecasting) |
| Team maturity | Cần structure rõ ràng | Team đã disciplined, cần flexibility |
| Prioritization | PO batch mỗi sprint | Continuous re-prioritization |
| Release cadence | End of sprint | Anytime (continuous delivery) |
| Roles | Defined (PO, SM, Dev) | No prescribed roles |
| Meetings | Fixed ceremonies | Minimal required meetings |

**Hybrid (Scrumban):** Nhiều team dùng Sprint + WIP limits + Kanban metrics. Không cần chọn cứng.

---

## 5. Estimation Techniques — Kỹ thuật ước lượng

### 🟢 Q: What are story points and how do they differ from time-based estimation? `[Junior]`

**A:**

| Khía cạnh | Story Points | Time-based (hours/days) |
|---|---|---|
| Measures | Relative complexity/effort | Absolute time |
| Comparison | "Task A gấp đôi Task B" | "Task A mất 8 giờ" |
| Accuracy | Tốt hơn cho long-term planning | Tốt hơn cho short-term tasks |
| Psychology | Ít pressure "sao mất lâu thế" | Dễ bị micro-manage |
| Scale | Fibonacci: 1, 2, 3, 5, 8, 13, 21 | Hours, days |
| Factors included | Complexity + uncertainty + effort | Only time |

**Story points tốt vì:** Con người estimate tương đối chính xác hơn tuyệt đối. "Task này gấp đôi task kia" dễ đúng hơn "task này mất 16 giờ."

### 🟡 Q: How does Planning Poker work? `[Mid]`

**A:** Kỹ thuật ước lượng consensus-based:

1. **PO trình bày** user story + acceptance criteria.
2. **Team thảo luận** assumptions, edge cases, technical approach.
3. **Mỗi người chọn** card (Fibonacci: 1, 2, 3, 5, 8, 13, 21, ?, ∞).
4. **Đồng thời lật** card (tránh anchoring bias).
5. **Nếu khác biệt lớn:** Người cao nhất và thấp nhất giải thích lý do.
6. **Re-vote** cho đến khi convergence (thường 2-3 rounds).

**Tại sao Fibonacci?** Khoảng cách tăng dần phản ánh uncertainty tăng theo size. Phân biệt 1 vs 2 dễ, phân biệt 15 vs 16 vô nghĩa.

### 🟡 Q: What is T-shirt sizing? `[Mid]`

**A:** Kỹ thuật ước lượng rough, nhanh, dùng cho high-level roadmap planning:

| Size | Relative effort | Typical range | Use case |
|---|---|---|---|
| **XS** | Trivial | < 1 day | Config change, copy fix |
| **S** | Small | 1-2 days | Bug fix, minor feature |
| **M** | Medium | 3-5 days | Standard feature |
| **L** | Large | 1-2 weeks | Complex feature, cần design |
| **XL** | Very large | 2-4 weeks | Epic, cần breakdown further |

**Khi dùng:** Roadmap planning, epic sizing, initial backlog assessment. Sau đó refine thành story points khi vào sprint.

### 🔴 Q: What is three-point estimation? `[Senior]`

**A:** Dùng 3 giá trị để tính estimate có tính uncertainty:

- **O (Optimistic):** Best case, mọi thứ suôn sẻ.
- **M (Most Likely):** Trường hợp phổ biến nhất.
- **P (Pessimistic):** Worst case, nhiều vấn đề phát sinh.

**Công thức PERT:**
```
E (Expected) = (O + 4M + P) / 6
SD (Standard Deviation) = (P - O) / 6
```

**Ví dụ:** Feature login OAuth:
- O = 2 days, M = 5 days, P = 14 days
- E = (2 + 20 + 14) / 6 = 6 days
- SD = (14 - 2) / 6 = 2 days
- 95% confidence: 6 ± 4 = 2-10 days

### 🔴 Q: What is the #NoEstimates movement? `[Senior]`

**A:** Phong trào đề xuất giảm hoặc bỏ estimation, thay bằng:

**Arguments cho #NoEstimates:**
- Estimation tốn thời gian nhưng thường sai.
- Story points bị gaming hoặc biến thành deadline.
- Thay vì estimate, đếm stories hoàn thành (throughput).
- Slice stories đều nhau (≈ 1-2 days) rồi đếm số lượng.

**Arguments chống #NoEstimates:**
- Stakeholders cần forecast để plan budget, hiring, marketing.
- Không estimate = khó prioritize (cost vs value).
- Works only khi team mature và stories consistently small.

**Pragmatic approach:** Estimate ở mức vừa đủ cho context. Roadmap = T-shirt sizing. Sprint = story points. Task = không cần estimate nếu < 1 day.

### 🟡 Q: What is the Cone of Uncertainty? `[Mid]`

**A:**

```text
Variability
  4x |*
     |  *
  2x |    *
     |      *
  1x |--------*--------*--------*--------→
     |          *
 0.5x|            *
     |              *
0.25x|                *
     |________________________________→
     Initial  Approved  Requirements  Design  Code  Ship
     concept  scope     complete      done    done
```

- Đầu dự án: estimate có thể sai 0.25x đến 4x.
- Khi scope rõ hơn, cone thu hẹp.
- Lesson: **không commit deadline cứng ở giai đoạn sớm**. Dùng range thay vì single number.

### 🔴 Q: Why are estimates often wrong and how to improve accuracy? `[Senior]`

**A:**

**Tại sao sai:**
- **Planning fallacy:** Con người luôn optimistic, quên edge cases.
- **Anchoring bias:** Người nói đầu tiên ảnh hưởng cả nhóm.
- **Unknown unknowns:** Không dự đoán được những gì chưa biết.
- **Pressure:** Management muốn nghe số nhỏ, team padding ngầm.
- **Scope creep:** Requirements thay đổi nhưng deadline không đổi.
- **Integration risk:** Mỗi component ước lượng đúng, nhưng tích hợp tốn thêm.

**Cách cải thiện:**
- Dùng **historical data** (velocity, cycle time) thay vì gut feeling.
- **Break down** tasks nhỏ (< 1-2 days); task nhỏ = estimate chính xác hơn.
- Planning Poker hoặc team estimate (tránh single-person bias).
- Track accuracy: so sánh estimate vs actual, cải tiến qua sprints.
- Dùng **range** thay vì single number: "3-5 days" thay vì "4 days".
- Add **buffer** cho unknowns: 15-30% cho familiar work, 50%+ cho greenfield.

---

## 6. Risk Management — Quản lý rủi ro

### 🟢 Q: What is risk management in software projects? `[Junior]`

**A:** Risk management là quá trình nhận diện, đánh giá, và xử lý rủi ro trước khi chúng thành vấn đề thật.

**Quy trình:**
1. **Identify:** Tìm rủi ro tiềm ẩn.
2. **Assess:** Đánh giá probability (xác suất) và impact (ảnh hưởng).
3. **Plan response:** Chọn chiến lược xử lý.
4. **Monitor:** Theo dõi và cập nhật liên tục.

### 🟡 Q: How do you identify risks? `[Mid]`

**A:** Nhiều kỹ thuật:

- **Brainstorming:** Team cùng liệt kê "điều gì có thể sai?"
- **Checklists:** Dùng danh sách rủi ro phổ biến từ dự án trước.
- **SWOT:** Strengths, Weaknesses, Opportunities, Threats.
- **Pre-mortem:** Giả sử dự án thất bại, brainstorm nguyên nhân.
- **Dependency analysis:** Xem xét external dependencies (API, library, team khác).
- **Historical review:** Rủi ro nào đã xảy ra ở dự án tương tự?

### 🟡 Q: How do you assess risks with probability x impact matrix? `[Mid]`

**A:**

```text
Impact
  High   │ Medium  │  High   │ Critical│
         │ risk    │  risk   │  risk   │
─────────┼─────────┼─────────┼─────────│
  Medium │  Low    │ Medium  │  High   │
         │ risk    │  risk   │  risk   │
─────────┼─────────┼─────────┼─────────│
  Low    │  Low    │  Low    │ Medium  │
         │ risk    │  risk   │  risk   │
─────────┼─────────┼─────────┼─────────│
         │  Low    │ Medium  │  High   │
         │Probability         Probability│
```

**Risk score = Probability (1-5) x Impact (1-5):**
- 1-5: Low risk → accept/monitor.
- 6-12: Medium risk → plan mitigation.
- 15-25: High/Critical risk → immediate action required.

### 🔴 Q: What are the four risk response strategies? `[Senior]`

**A:**

| Strategy | Giải thích | Ví dụ |
|---|---|---|
| **Avoid** | Loại bỏ rủi ro bằng cách thay đổi plan | Bỏ feature quá rủi ro, chọn technology proven |
| **Mitigate** | Giảm probability hoặc impact | Thêm monitoring, spike trước khi commit, prototype |
| **Transfer** | Chuyển rủi ro cho bên khác | Dùng managed service (AWS RDS thay tự host DB), mua bảo hiểm |
| **Accept** | Chấp nhận rủi ro, có plan nếu xảy ra | Low-impact risk, contingency plan ready |

### 🔴 Q: What are common engineering risks and mitigation strategies? `[Senior]`

**A:**

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Key person dependency | Medium | High | Cross-training, documentation, pair programming |
| Third-party API breaking change | Medium | High | Contract tests, API versioning, adapter pattern |
| Performance degradation at scale | Medium | High | Load testing early, capacity planning, auto-scaling |
| Security vulnerability | Medium | Critical | SAST/DAST in CI, dependency scanning, security reviews |
| Data migration failure | Low | Critical | Dry-run migration, rollback script, dual-write period |
| Scope creep | High | Medium | Clear Definition of Ready, sprint commitment, PO authority |
| Technical debt accumulation | High | Medium | 15-20% capacity per sprint for debt, track debt register |
| Integration failures | Medium | High | Integration tests in CI, feature flags, canary deploys |
| Team burnout | Medium | High | Sustainable pace, WIP limits, protect maker time |

### 🔴 Q: How to conduct a post-mortem when risks materialize? `[Senior]`

**A:** Khi rủi ro trở thành incident, dùng blameless post-mortem:

1. **Schedule** trong 24-48h sau resolve.
2. **Timeline** chi tiết: khi nào detect, ai respond, từng action taken.
3. **Root cause analysis:** Dùng 5 Whys hoặc fishbone diagram.
4. **Impact assessment:** Users affected, revenue loss, SLA breach.
5. **Action items:** Cụ thể, có owner, có deadline, phân loại preventive vs detective.
6. **Follow up:** Review action items completion trong sprint tiếp.

> Xem chi tiết ở Section 8: Incident Management.

---

## 7. Team Topologies — Mô hình tổ chức team

### 🟡 Q: What is Conway's Law and why does it matter? `[Mid]`

**A:**

> "Any organization that designs a system will produce a design whose structure is a copy of the organization's communication structure." — Melvin Conway, 1967

**Ý nghĩa thực tế:**
- Nếu có 3 teams, hệ thống sẽ có 3 components/services.
- Nếu teams giao tiếp khó khăn, integration giữa components cũng khó.
- Architecture phản ánh org chart, dù muốn hay không.

**Inverse Conway Maneuver:**
- Thay vì để org structure quyết định architecture, thiết kế org structure để tạo ra architecture mong muốn.
- Muốn microservices? Tạo small, autonomous teams aligned theo business domain.
- Muốn monolith modular? Tạo teams aligned theo modules.

### 🔴 Q: What are the four fundamental team types in Team Topologies? `[Senior]`

**A:** Matthew Skelton & Manuel Pais (Team Topologies, 2019) định nghĩa 4 loại team:

**1. Stream-aligned team:**
- Aligned theo business stream (product feature, user journey, customer segment).
- Deliver value end-to-end: from idea to production.
- Majority of teams in org should be stream-aligned.
- Ví dụ: Team Payments, Team Onboarding, Team Search.

**2. Enabling team:**
- Giúp stream-aligned teams overcome obstacles.
- Nghiên cứu, prototype, coach về new capability.
- Temporary engagement: transfer knowledge rồi rút.
- Ví dụ: Team chuyên về performance optimization coach các team khác.

**3. Complicated subsystem team:**
- Owns phần hệ thống cần deep specialist knowledge.
- Giảm cognitive load cho stream-aligned teams.
- Ví dụ: Team ML model, Team video codec, Team cryptography.

**4. Platform team:**
- Cung cấp internal platform as a service cho stream-aligned teams.
- Self-service: team khác dùng mà không cần hỏi.
- Ví dụ: Team Infrastructure (K8s, CI/CD), Team Data Platform, Team Developer Experience.

### 🔴 Q: What are the three interaction modes? `[Senior]`

**A:**

| Interaction Mode | Mô tả | Khi dùng | Duration |
|---|---|---|---|
| **Collaboration** | 2 teams work closely together | Discovery, innovation, new integration | Temporary (weeks to months) |
| **X-as-a-Service** | 1 team provides service, other consumes | Stable API/platform, clear boundary | Long-term (default) |
| **Facilitating** | 1 team helps other learn/adopt | Enabling team coaching stream-aligned | Temporary (weeks) |

**Quy tắc:**
- X-as-a-Service nên là interaction mode mặc định (giảm coupling).
- Collaboration chỉ khi cần discovery hoặc innovation (tốn cost cao).
- Facilitating cho knowledge transfer rồi chuyển sang X-as-a-Service.

### 🟡 Q: What is the ideal team size? `[Mid]`

**A:**

- **Two-pizza rule (Amazon):** Team nhỏ đủ để nuôi bằng 2 pizza (6-8 người).
- **Dunbar's number:** Con người duy trì ~150 relationships; team 5-9 cho close collaboration.
- **Brooks's Law:** "Adding people to a late project makes it later" — communication overhead = n(n-1)/2.
- **Practical:** 4-8 engineers per team. Dưới 4 = fragile (vacation/sick leaves). Trên 10 = communication overhead cao.

### 🟡 Q: What is the difference between cross-functional and component teams? `[Mid]`

**A:**

| Khía cạnh | Cross-functional team | Component team |
|---|---|---|
| Composition | FE + BE + QA + DevOps | All FE engineers, or all BE engineers |
| Delivery | End-to-end feature delivery | Deliver component/layer |
| Dependency | Low (self-sufficient) | High (need other teams for features) |
| Ownership | Business outcome ownership | Technical component ownership |
| Communication | Within team | Cross-team coordination heavy |
| Preferred by | Agile, Team Topologies | Legacy orgs, some specialized domains |

**Trade-off:** Cross-functional teams deliver faster nhưng mỗi thành viên cần broader skills. Component teams có deep expertise nhưng handoffs gây delay.

---

## 8. Incident Management — Quản lý sự cố

### 🟢 Q: What are incident severity levels? `[Junior]`

**A:**

| Level | Tên | Mô tả | Response time | Example |
|---|---|---|---|---|
| **SEV1** | Critical | System down, all users affected | < 15 min | Production database crashed, payments failing |
| **SEV2** | Major | Major feature broken, significant users affected | < 30 min | Search unavailable, login failing for 20% users |
| **SEV3** | Minor | Non-critical feature broken, workaround available | < 4 hours | Export feature broken, UI alignment issue on edge browser |
| **SEV4** | Low | Cosmetic, minor inconvenience | Next business day | Typo in error message, slow loading of non-critical page |

### 🟡 Q: What is the incident response process? `[Mid]`

**A:**

```text
Detect → Triage → Mitigate → Resolve → Review
  |         |         |          |         |
Alert/    Assess    Stop the   Fix root  Post-
Monitor   severity  bleeding   cause     mortem
```

**Chi tiết:**
1. **Detect:** Monitoring alert, user report, synthetic test fail.
2. **Triage:** Xác định severity, assign Incident Commander, notify stakeholders.
3. **Mitigate:** Giảm impact ASAP (rollback, feature flag off, scale up, failover).
4. **Resolve:** Fix root cause, deploy fix, verify resolution.
5. **Review:** Blameless post-mortem trong 24-48h.

**Quan trọng:** Mitigate trước, resolve sau. Rollback để users không bị ảnh hưởng, rồi mới debug root cause.

### 🟡 Q: What is the Incident Commander role? `[Mid]`

**A:** Incident Commander (IC) là người điều phối incident response:

**Trách nhiệm:**
- **Coordinate:** Phân công ai làm gì, tránh duplicate effort.
- **Communicate:** Update status page, notify stakeholders, escalate nếu cần.
- **Decide:** Quyết định rollback hay fix-forward, escalate severity hay không.
- **Document:** Ensure timeline được ghi lại real-time.

**Không phải:**
- Không phải người giỏi nhất về technical.
- Không phải người fix bug (delegate cho engineers).
- IC focuses on process, communication, decision-making.

### 🟡 Q: How should on-call rotations work? `[Mid]`

**A:**

**Best practices:**
- Rotation: weekly hoặc bi-weekly, đảm bảo công bằng.
- Primary + secondary on-call: backup khi primary unavailable.
- Compensation: overtime pay hoặc time-off-in-lieu.
- Runbooks: document cho mỗi alert — what it means, how to respond.
- Escalation path: nếu không resolve trong X phút, escalate.
- Post-incident review: đánh giá alert quality, reduce noise.

**On-call health metrics:**
- Số alerts per shift (target: < 2 actionable per day).
- Pages outside business hours.
- Time-to-acknowledge.
- False positive rate (target: < 30%).

### 🔴 Q: How to run a blameless post-mortem? `[Senior]`

**A:**

**Format:**

```text
# Incident Post-mortem: [Title]
Date: YYYY-MM-DD
Severity: SEV1/2/3
Duration: X hours Y minutes
Author: [name]
Attendees: [list]

## Summary
One paragraph: what happened, impact, resolution.

## Timeline (UTC)
- 14:00 — Alert fired: API error rate > 5%
- 14:03 — On-call acknowledged, started investigation
- 14:10 — Identified: deploy at 13:45 introduced regression
- 14:15 — Decision: rollback to previous version
- 14:20 — Rollback complete, error rate normalizing
- 14:35 — Confirmed: all metrics back to normal

## Impact
- Duration: 35 minutes
- Users affected: ~15,000 (12% of DAU)
- Revenue impact: estimated $X
- SLA breach: No (within error budget)

## Root Cause
Deploy included untested code path for edge case
in payment processing. Missing integration test
for discount + tax calculation combination.

## Contributing Factors
- Code review missed edge case (reviewer unfamiliar with tax logic)
- No integration test for discount + tax combination
- Canary deploy was too short (5 min, should be 15 min)

## Action Items
| Action | Owner | Deadline | Type |
|---|---|---|---|
| Add integration tests for discount+tax | Alice | Sprint 24 | Preventive |
| Extend canary duration to 15 min | Bob | Sprint 23 | Detective |
| Add runbook for payment alert | Carol | Sprint 23 | Process |
| Review tax module with domain expert | Dave | Sprint 24 | Preventive |

## Lessons Learned
- Canary deploy thời gian ngắn không bắt được slow-burn issues.
- Integration tests cho business logic combinations rất quan trọng.
```

**Blameless culture:**
- Focus vào system và process, không phải individual.
- "What made it possible for this to happen?" thay vì "Who did this?"
- Psychological safety: mọi người phải cảm thấy an toàn khi chia sẻ mistakes.
- Action items = cải tiến hệ thống, không phải "person X needs training."

### 🔴 Q: What are SLO, SLA, SLI, and error budgets? `[Senior]`

**A:**

| Concept | Giải thích | Ví dụ |
|---|---|---|
| **SLI** (Service Level Indicator) | Metric đo chất lượng service | Request latency p99, error rate, availability |
| **SLO** (Service Level Objective) | Target nội bộ cho SLI | p99 latency < 200ms, availability > 99.9% |
| **SLA** (Service Level Agreement) | Cam kết với khách hàng, có penalty | 99.95% uptime, hoàn tiền nếu breach |
| **Error Budget** | Ngân sách lỗi cho phép = 1 - SLO | SLO 99.9% → Error budget = 0.1% = 43.8 min/month |

**Error budget strategy:**
- Còn budget: ưu tiên feature velocity, chấp nhận rủi ro.
- Gần hết budget: slow down releases, focus stability.
- Hết budget: freeze deployments, team focus on reliability.

**Trade-off:** SLO quá cao (99.99%) = chậm innovation. SLO quá thấp (99%) = users không happy. Chọn SLO dựa trên user expectations và business cost.

---

## 9. Technical Leadership — Lãnh đạo kỹ thuật

### 🟢 Q: What are the responsibilities of a Tech Lead? `[Junior]`

**A:** Tech Lead (TL) cầu nối giữa engineering và product/management:

**Technical responsibilities:**
- Architecture decisions cho team scope.
- Code review ownership: đảm bảo quality standards.
- Technical debt prioritization.
- Technology evaluation và adoption.

**Leadership responsibilities:**
- Unblock team members: giải quyết technical blockers.
- Mentor junior/mid engineers.
- Represent team trong cross-team technical discussions.
- Communicate technical constraints cho PM/stakeholders.

**Cái bẫy:** Tech Lead không phải "best coder who also does meetings." TL cần delegate coding, spend time on architecture, mentoring, coordination.

### 🟡 Q: What is an ADR (Architecture Decision Record)? `[Mid]`

**A:** ADR ghi lại quyết định kiến trúc quan trọng:

```text
# ADR-007: Use PostgreSQL as primary database

## Status
Accepted (2025-01-15)

## Context
We need a primary database for our user management service.
Requirements: ACID transactions, JSON support, full-text search,
mature ecosystem, team familiarity.

## Decision
Use PostgreSQL 16 with pgvector extension for future AI features.

## Consequences
### Positive
- Team has 3+ years PostgreSQL experience
- Strong ecosystem (pgAdmin, pg_stat, extensions)
- JSONB for flexible schema when needed
- Free, open-source, no vendor lock-in

### Negative
- Horizontal scaling harder than NoSQL (need Citus/sharding later)
- Need to manage schema migrations carefully
- No built-in multi-region replication (need Patroni/pg_auto_failover)

## Alternatives Considered
- MySQL: Less JSON support, partitioning less flexible
- MongoDB: Team unfamiliar, ACID limited to single document
- CockroachDB: Distributed by default but higher operational complexity
```

**Best practices:**
- Mỗi ADR là immutable: nếu thay đổi quyết định, tạo ADR mới supersede cái cũ.
- Lưu trong repo cùng code (docs/adr/ hoặc trong wiki).
- Đánh số sequential: ADR-001, ADR-002...
- Lightweight: 1-2 trang, không phải thesis.

### 🔴 Q: How does the RFC (Request for Comments) process work? `[Senior]`

**A:** RFC là cơ chế propose và review thay đổi lớn trước khi implement:

**Quy trình:**
1. **Author viết RFC:** Problem statement, proposed solution, alternatives, risks, timeline.
2. **Share cho stakeholders:** Engineering team, affected teams, architects.
3. **Comment period:** 3-7 days cho async review, questions, concerns.
4. **Discussion meeting** (optional): synchronous discussion cho complex RFCs.
5. **Decision:** Approve, reject, hoặc revise and re-submit.
6. **Implementation:** RFC owner drives execution.

**Khi cần RFC:**
- Thay đổi ảnh hưởng nhiều teams hoặc services.
- Adoption công nghệ mới (new database, new framework).
- Architecture changes (monolith → microservices, new event bus).
- Process changes (new release process, new testing strategy).

**Khi KHÔNG cần RFC:**
- Bug fix, minor refactor, feature trong 1 team scope.
- Quyết định đã có ADR precedent.

### 🟡 Q: How to mentor engineers effectively? `[Mid]`

**A:**

**Framework mentoring:**
- **Pairing:** Code cùng nhau, giải thích thought process.
- **Delegation with stretch:** Giao task hơi khó hơn level hiện tại + support.
- **Code review as teaching:** Comment giải thích "why" chứ không chỉ "what."
- **1:1 regular:** Bi-weekly 30 min, discuss growth, challenges, career goals.
- **Tech talks:** Encourage mentee present topics để consolidate knowledge.

**Anti-patterns:**
- Giải bài cho mentee (thay vì guide approach).
- Chỉ review code mà không giải thích reasoning.
- Không có growth plan rõ ràng.
- Micro-manage thay vì trust and verify.

### 🔴 Q: How to communicate technical decisions to non-technical stakeholders? `[Senior]`

**A:** Managing up = translate tech → business language:

**Principles:**
- **Lead with impact:** "Migration này giảm downtime 90%, tăng revenue $X/quarter" thay vì "chuyển từ MySQL sang PostgreSQL."
- **Use analogies:** "Technical debt giống nợ tài chính — trả lãi hàng tháng bằng velocity chậm."
- **Visualize:** Charts, diagrams, before/after comparisons.
- **Options, not ultimatums:** "Có 3 options: A (nhanh, rủi ro cao), B (balanced), C (an toàn, chậm)."
- **Quantify:** Attach numbers — cost, time, risk percentage, user impact.

### 🔴 Q: How to say no to feature requests diplomatically? `[Senior]`

**A:** Không nói "không" mà redirect:

**Framework: "Yes, and..."**
1. **Acknowledge value:** "Feature này có giá trị cho users vì..."
2. **Present constraints:** "Tuy nhiên, hiện tại team đang X, và feature này cần Y."
3. **Offer alternatives:**
   - "Có thể defer đến Q3 khi foundation sẵn sàng."
   - "Có thể làm phiên bản MVP nhỏ hơn trước."
   - "Nếu cần ngay, cần trade-off bỏ feature Z trong sprint này."
4. **Let PO/stakeholder decide** priority trade-off.

**Khi phải nói "no" thật:**
- Security risk: "Feature này mở attack vector, cần X tuần security review trước."
- Technical infeasibility: "Platform hiện tại không support, cần rewrite module Y trước."
- Luôn kèm data/evidence, không chỉ "tôi nghĩ khó."

---

## 10. Delivery & Release Management — Quản lý triển khai

### 🟢 Q: What are the stages of a CI/CD pipeline? `[Junior]`

**A:**

```text
Code → Build → Test → Package → Deploy Staging → Verify → Deploy Production → Monitor
```

**Chi tiết:**

| Stage | Mô tả | Tools phổ biến |
|---|---|---|
| **Code** | Commit + push, trigger pipeline | Git, GitHub/GitLab |
| **Build** | Compile, transpile, bundle | Go build, Webpack, Docker build |
| **Test** | Unit, integration, lint, type-check | Jest, Go test, ESLint, tsc |
| **Package** | Create artifact (Docker image, binary) | Docker, ko, GoReleaser |
| **Deploy Staging** | Deploy lên staging environment | ArgoCD, Helm, Terraform |
| **Verify** | Smoke test, integration test on staging | Cypress, k6, curl |
| **Deploy Production** | Progressive rollout to prod | Canary, blue-green, feature flags |
| **Monitor** | Observe metrics, logs, traces | Prometheus, Grafana, Datadog |

### 🟡 Q: What are feature flags and progressive rollout? `[Mid]`

**A:**

**Feature flags** tách deployment khỏi release:
- Deploy code lên production nhưng feature ẩn sau flag.
- Bật dần theo cohort: internal → beta → 1% → 10% → 100%.
- Nếu lỗi: tắt flag ngay, không cần rollback deploy.

**Progressive rollout strategies:**
1. **Internal/dogfooding:** Team dùng trước.
2. **Beta users:** Opt-in users test.
3. **Percentage rollout:** 1% → 5% → 25% → 50% → 100%.
4. **Geographic rollout:** VN trước → SEA → Global.
5. **Ring-based:** Ring 0 (internal) → Ring 1 (early adopters) → Ring 2 (all).

**Feature flag governance:**
- Mỗi flag có owner + expiry date.
- Clean up flags sau khi 100% rollout (tránh flag debt).
- Audit log cho flag changes.
- Naming convention: `team_feature_description` (vd: `payments_new_checkout_v2`).

### 🟡 Q: What are blue-green and canary deployments? `[Mid]`

**A:**

**Blue-Green deployment:**
```text
Load Balancer
     │
     ├──→ Blue (v1.0) ← current production
     │
     └──→ Green (v1.1) ← new version (idle)

Switch: LB points to Green
Rollback: LB points back to Blue (instant)
```
- 2 identical environments: Blue (current) và Green (new).
- Deploy lên Green, test, rồi switch traffic.
- Rollback = switch ngược lại (instant, zero downtime).
- Nhược: cost 2x infrastructure.

**Canary deployment:**
```text
Load Balancer
     │
     ├──→ 95% traffic → v1.0 (stable)
     │
     └──→ 5% traffic → v1.1 (canary)

Monitor: error rate, latency, business metrics
If OK: increase to 25% → 50% → 100%
If bad: route 100% back to v1.0
```
- Deploy new version cho small % traffic trước.
- Monitor metrics; nếu OK thì tăng dần.
- Phát hiện issues trước khi ảnh hưởng all users.

### 🔴 Q: What rollback strategies should teams have? `[Senior]`

**A:**

| Strategy | Speed | When to use | Limitation |
|---|---|---|---|
| **Feature flag off** | Instant | Feature-level rollback | Need flag infrastructure |
| **LB traffic switch** | Seconds | Blue-green environment | Requires 2x infra |
| **Redeploy previous version** | Minutes | Standard rollback | Need artifact stored |
| **Database rollback** | Risky | Schema migration failure | May lose data; prefer forward-fix |
| **Fix forward** | Varies | Small fix, rollback risky | Requires quick root cause identification |

**Best practices:**
- Luôn giữ previous artifact/image available.
- Test rollback procedure định kỳ (không phải chỉ khi incident).
- Database migrations phải backward compatible (expand-and-contract pattern).
- Automated rollback trigger: nếu error rate > threshold trong X phút → auto rollback.

### 🟡 Q: What is semantic versioning? `[Mid]`

**A:** SemVer format: `MAJOR.MINOR.PATCH`

| Component | Khi tăng | Ví dụ |
|---|---|---|
| **MAJOR** | Breaking changes, incompatible API | 1.0.0 → 2.0.0 |
| **MINOR** | New features, backward compatible | 1.0.0 → 1.1.0 |
| **PATCH** | Bug fixes, backward compatible | 1.0.0 → 1.0.1 |

**Pre-release:** `1.0.0-alpha.1`, `1.0.0-beta.2`, `1.0.0-rc.1`

**Changelog best practices:**
- Categorize: Added, Changed, Deprecated, Removed, Fixed, Security.
- Link to PRs/issues.
- Write for users, not developers (business impact > code changes).
- Follow keepachangelog.com format.

### 🔴 Q: What are release trains? `[Senior]`

**A:** Release train = fixed schedule release, bất kể feature nào ready thì lên:

**Cách hoạt động:**
- Train departs on schedule (e.g., every 2 weeks, every Tuesday).
- Features ready = on the train. Not ready = wait for next train.
- No delays for individual features.

**Pros:**
- Predictable release cadence.
- Giảm pressure "phải xong trước deadline."
- Stakeholders biết khi nào expect changes.

**Cons:**
- Feature xong Monday phải đợi đến Tuesday tuần sau.
- Cần feature flags để decouple deploy and release.

**Alternative: Continuous Deployment:** Mỗi commit passing pipeline = deploy ngay. Nhanh hơn nhưng cần mature CI/CD, testing, monitoring.

---

## 11. Metrics & KPIs — Chỉ số đo lường

### 🟢 Q: What are DORA metrics? `[Junior]`

**A:** DORA (DevOps Research and Assessment, Google) định nghĩa 4 key metrics đo software delivery performance:

| Metric | Đo gì | Elite | High | Medium | Low |
|---|---|---|---|---|---|
| **Deployment Frequency** | Tần suất deploy lên production | On-demand (nhiều lần/ngày) | 1/day - 1/week | 1/week - 1/month | 1/month - 1/6 months |
| **Lead Time for Changes** | Thời gian từ commit đến production | < 1 hour | 1 day - 1 week | 1 week - 1 month | 1 - 6 months |
| **Change Failure Rate** | % deployments gây failure | 0-15% | 16-30% | 16-30% | 46-60% |
| **Mean Time to Restore (MTTR)** | Thời gian restore service khi failure | < 1 hour | < 1 day | < 1 day - 1 week | > 6 months |

**Insight:** 4 metrics này correlated — team deploy thường xuyên thường cũng có change failure rate thấp hơn (vì changes nhỏ = ít rủi ro).

### 🟡 Q: What is the SPACE framework? `[Mid]`

**A:** SPACE (GitHub + Microsoft Research) đo developer productivity toàn diện hơn:

| Dimension | Ý nghĩa | Metrics ví dụ |
|---|---|---|
| **S** — Satisfaction & well-being | Developer có hài lòng với tools, process không? | Survey scores, retention rate |
| **P** — Performance | Output chất lượng đến tay user | Reliability, absence of bugs, user satisfaction |
| **A** — Activity | Output đo được (nhưng đừng dùng alone) | PRs merged, commits, deploys, code reviews |
| **C** — Communication & collaboration | Chất lượng giao tiếp trong team | PR review time, knowledge sharing, meeting effectiveness |
| **E** — Efficiency & flow | Dễ dàng hoàn thành công việc không? | Flow state time, handoffs, wait time |

**Cách dùng:** Chọn ít nhất 3 dimensions, mix quantitative + qualitative. KHÔNG dùng một dimension duy nhất để evaluate.

### 🟡 Q: Why is comparing velocity across teams wrong? `[Mid]`

**A:** Velocity (story points completed per sprint) chỉ meaningful within same team:

**Lý do không so sánh:**
- Story points là relative, mỗi team có baseline khác.
- Team A: 1 point = 2h. Team B: 1 point = 4h. Velocity 40 vs 20 không có nghĩa A gấp đôi B.
- Different domains: team payments vs team notifications có complexity khác nhau.
- Team composition: 4 seniors vs 6 juniors velocity khác nhau nhưng đều hợp lý.

**Dùng velocity đúng cách:**
- Forecast: "Team này average 30 points/sprint, backlog có 120 points → ~4 sprints."
- Trend: velocity tăng/giảm theo thời gian → điều tra nguyên nhân.
- KHÔNG dùng để rank teams hoặc evaluate performance.

### 🔴 Q: What is Goodhart's Law and how does it apply to engineering metrics? `[Senior]`

**A:**

> "When a measure becomes a target, it ceases to be a good measure." — Charles Goodhart

**Ví dụ trong engineering:**

| Metric trở thành target | Hậu quả | Behavior bị lệch |
|---|---|---|
| Lines of code | Verbose code, copy-paste | Viết nhiều code thay vì giải quyết vấn đề |
| Number of PRs | Tiny PRs without value | Split PRs vô nghĩa để tăng count |
| Story points velocity | Point inflation | Estimate cao hơn thực tế, gaming |
| Code coverage % | Tests without assertions | `expect(true).toBe(true)` để tăng coverage |
| Number of bugs fixed | Create-and-fix bugs | Tạo bug rồi fix để report |
| Deployment frequency | Deploy without value | Deploy config changes to inflate number |

**Cách tránh:**
- Dùng **balanced scorecard:** Nhiều metrics cùng lúc (DORA + SPACE).
- **Pair metrics:** Deployment frequency + change failure rate (nhanh nhưng cũng phải tốt).
- **Qualitative signals:** Survey, retro feedback bổ sung cho quantitative data.
- **Transparency:** Team hiểu mục đích metrics, tham gia chọn metrics.
- **Never punish:** Metrics để improve, không phải evaluate individuals.

### 🟡 Q: What are code churn and bug escape rate? `[Mid]`

**A:**

**Code churn:**
- Percentage of code changed/deleted shortly after written (within 2-3 weeks).
- Churn cao = rework, unclear requirements, hoặc wrong approach.
- Normal churn: 15-25%. High churn: > 40% cần điều tra.

**Bug escape rate:**
- Số bugs found in production / tổng bugs found (tất cả stages).
- Low escape rate = testing effective (bugs caught early).
- Target: < 10% cho mature teams.
- Track theo severity: SEV1 escape rate phải gần 0%.

```text
Bug escape rate = Bugs found in production / Total bugs found × 100%

Example:
- Bugs found in dev: 30
- Bugs found in QA: 15
- Bugs found in production: 5
- Escape rate = 5 / 50 = 10%
```

---

## 12. Final Revision Checklist — Checklist ôn tập cuối

- [ ] Giải thích được IC vs Manager track và trách nhiệm Staff+ engineer.
- [ ] Trình bày được 4 values và 12 principles của Agile Manifesto.
- [ ] Phân biệt Cargo Cult Agile vs Agile thực sự.
- [ ] Mô tả Scrum roles, events, artifacts và common anti-patterns.
- [ ] So sánh Kanban vs Scrum và biết khi nào chọn cái nào.
- [ ] Áp dụng Planning Poker, T-shirt sizing, three-point estimation.
- [ ] Giải thích Cone of Uncertainty và #NoEstimates.
- [ ] Sử dụng probability x impact matrix và 4 risk response strategies.
- [ ] Trình bày Conway's Law, 4 team types, 3 interaction modes.
- [ ] Mô tả incident response process và blameless post-mortem format.
- [ ] Giải thích SLO/SLA/SLI/Error budget và khi nào freeze deployments.
- [ ] Biết ADR format, RFC process, và cách mentor hiệu quả.
- [ ] Hiểu CI/CD pipeline, feature flags, canary, blue-green, rollback strategies.
- [ ] Sử dụng DORA metrics, SPACE framework và tránh bẫy Goodhart's Law.
- [ ] Nắm semantic versioning, release trains, changelog best practices.

---

## 13. Interview Tips — Mẹo phỏng vấn

### 🟢 Q: How to answer project management questions in interviews? `[Junior]`

**A:** Dùng framework STAR + data:

- **Situation:** Mô tả context (team size, project type, timeline).
- **Task:** Vấn đề cần giải quyết.
- **Action:** Bạn đã làm gì cụ thể (tools, process, decisions).
- **Result:** Kết quả đo được (metric trước/sau).

**Ví dụ:** "Team 6 người, sprint 2 tuần, tôi nhận thấy cycle time tăng từ 3 ngày lên 8 ngày. Tôi đề xuất WIP limit = 2 per developer, giảm multi-tasking. Sau 3 sprints, cycle time giảm về 4 ngày, throughput tăng 30%."

### 🟡 Q: What PM-related questions should you prepare for Mid-level interviews? `[Mid]`

**A:**
- "Describe your team's development process." → Scrum/Kanban, ceremonies, tools.
- "How do you estimate tasks?" → Story points, Planning Poker, historical data.
- "How do you handle scope creep?" → Sprint Goal, PO negotiation, Definition of Ready.
- "Tell me about a time a project was at risk." → Risk identification, mitigation, outcome.
- "How do you ensure quality in your team?" → DoD, testing strategy, code review, CI/CD.

### 🔴 Q: What PM-related questions should you prepare for Senior/Lead interviews? `[Senior]`

**A:**
- "How would you improve your team's delivery performance?" → DORA metrics baseline, identify bottlenecks, systemic improvements.
- "Describe a technical decision you led." → ADR/RFC process, stakeholder alignment, trade-offs.
- "How do you handle incidents?" → Severity classification, response process, post-mortem culture.
- "How would you structure teams for a new product?" → Team Topologies, Conway's Law, stream-aligned.
- "Tell me about managing technical debt." → Debt register, capacity allocation, metric-driven payoff.
- "How do you mentor junior engineers?" → Pairing, delegation, growth plans, creating learning culture.
- "How do you communicate technical constraints to business?" → Impact-first framing, options, quantification.

---

---

## Interview Q&A Summary / Tổng hợp câu hỏi phỏng vấn

### Q: How do you estimate software projects? / Ước tính dự án phần mềm như thế nào? 🟡 Mid

**A:**

```
Common estimation techniques:

1. Story Points + Velocity (Agile)
   ├── Relative sizing: compare to reference stories
   ├── Fibonacci scale: 1, 2, 3, 5, 8, 13 (force trade-off decisions)
   ├── Team velocity: avg story points/sprint (measure over 3+ sprints)
   └── Capacity: velocity × sprints remaining = estimated total

2. T-shirt sizing (quick, high-level)
   XS (<1 day), S (1-2 days), M (3-5 days), L (1-2 weeks), XL (2+ weeks)
   └── Good for roadmap planning, not sprint planning

3. Three-point estimation
   ├── Optimistic (O): best case
   ├── Most Likely (M): normal case
   ├── Pessimistic (P): worst case (unknown unknowns)
   └── PERT estimate: E = (O + 4M + P) / 6

4. Decomposition
   ├── Break task into sub-tasks ≤ 1 day each
   ├── Estimate each leaf node
   └── Sum + buffer (20-30% for integration/testing)

Cone of Uncertainty:
  Early project: estimate can be 4× off in either direction
  After design: 2×
  After implementation: 1.1×
  → Estimates improve as uncertainty reduces
```

**Common estimation mistakes:**
```
❌ Optimism bias: underestimate complexity ("it's just a CRUD endpoint")
❌ Missing tasks: forgotten: tests, docs, code review, deployment, monitoring
❌ No buffer: no time for debugging, unexpected dependencies
❌ Ignoring interruptions: meetings, on-call, PRs to review

✅ Add 30-50% buffer for unknown unknowns
✅ Use historical velocity (past sprints)
✅ Decompose to ≤1-day tasks before committing
✅ Re-estimate when scope changes
```

**Điểm interview:** Estimation là skill quan trọng cho senior engineers. Key principle: đừng commit hard deadline trước khi decompose và estimate. "I need 2 days to spec it out before I can give you an estimate" là câu trả lời đúng đắn hơn là estimate ngay.

### Q: How do you handle scope creep and stakeholder expectations? / Quản lý scope creep như thế nào? 🔴 Senior

**A:**

```
Scope creep = unauthorized or unplanned feature additions mid-project

Prevention:
├── Written requirements: document scope explicitly, get sign-off
├── Change control process: any new request goes through formal assessment
│   └── "Yes AND it pushes deadline by X days / costs Y"
├── MVP mindset: define minimal viable scope upfront
└── Regular demos: show progress → stakeholders see what they're getting

When scope creep happens:
  New request → assess impact:
  1. Estimate additional effort
  2. Present options:
     a. Add feature, extend deadline by X
     b. Add feature, cut feature Y to maintain deadline
     c. Defer to v2
     d. Decline (doesn't serve user needs)
  3. Document decision and get stakeholder approval

Stakeholder communication principles:
├── Proactive updates: bad news early is better than late surprise
│   "We hit a dependency issue, delivery will be 3 days late"
├── Data-driven: show burn-down charts, velocity trends
├── Risk-based: "We're on track but X is a risk — here's our mitigation"
└── Never overpromise to make stakeholders happy → credibility damage
```

**Senior engineer expectations:**
```
Junior:  executes tasks given to them
Mid:     flags risks and blockers early
Senior:  proactively manages expectations, negotiates scope vs time vs quality
Staff:   shapes the roadmap, prevents scope creep by design
```

**Điểm senior:** Senior engineers cần skill "kỹ năng chính trị" — biết cách push back diplomatically, offer alternatives, và protect team từ unrealistic expectations. Framework: "Yes, AND here are the trade-offs" thay vì "No" hay overpromise.

---

## Self-Check / Tự Kiểm Tra

- [ ] Can I give an estimation with explicit assumptions and risk factors (not just a number)?
- [ ] Can I explain scope creep with a concrete example and how to handle it?
- [ ] Can I describe when to escalate a blocker vs solve it yourself?
- [ ] Can I explain the difference between velocity (what team did) and capacity (what team can do)?
- 💬 **Feynman Prompt:** Giải thích tại sao "I need 1 more week" said at deadline is worse than "I'm blocked, here's why" said on day 3 — và what the senior engineer does differently.

## Connections / Liên Kết

- ⬅️ **Built on**: [SDLC Practices](./03-sdlc-and-practices.md) — Scrum/Agile provides the ceremonies for PM
- ➡️ **Applied in**: [Code Quality](./05-code-quality-and-review.md) — technical debt is tracked in project backlog
- 🔗 **Related**: [System Design Framework](../../be-track/04-be-system-design/01-design-framework.md) — estimation skills are tested in system design interviews too
- 🔗 **Context**: [Company Guides](../07-company-guides/) — each company has different PM culture and expectations
