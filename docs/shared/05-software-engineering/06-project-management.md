# Project Management and Team Practices — Quản lý dự án và thực hành đội nhóm

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)
>
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

> 🧠 **Memory Hook:** Thuyền trưởng biết hải đồ mới điều hướng được — kỹ sư biết PM mới dẫn dắt được.

**Tại sao tồn tại? / Why does this exist?**

Engineers thường nghĩ PM skills là "việc của người khác" — nhưng mỗi lần bạn estimate task, cập nhật tiến độ, hay giải thích blocker cho PM, bạn đang làm PM. → **Why?** Vì phần mềm là sản phẩm của nhóm người phối hợp, không phải solo activity. → **Why?** Vì kỹ sư giỏi nhất mà không biết communicate deadline hay manage risk vẫn gây ra project failure.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Thuyền trưởng không chỉ cần biết lái tàu — họ cần đọc hải đồ, hiểu thời tiết, biết tàu còn bao nhiêu nhiên liệu. Kỹ sư cũng vậy: viết code tốt chỉ là "lái tàu giỏi." Nhưng nếu không biết deadline ở đâu, rủi ro là gì, team đang kẹt chỗ nào — con tàu sẽ mắc cạn dù động cơ tốt. Biết PM skills = thuyền trưởng hoàn chỉnh, không chỉ là thợ máy.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Kỹ năng kỹ sư cần theo level:
Junior  → Estimate task chính xác + report blocker kịp thời
Mid     → Flag risks + manage scope trong ticket
Senior  → Negotiate deadline + communicate trade-offs với stakeholder
Staff+  → Shape roadmap + prevent scope creep by design
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Kỹ sư quá tập trung PM sẽ mất depth kỹ thuật — cần balance với IC work.
- Nhỏ team startup: engineer phải kiêm nhiều hơn so với big tech có PM riêng.
- "Glue work" (meetings, docs, coordination) ít được đánh giá nhưng quan trọng — cần track explicitly.
- PM skills không thay thế technical skills — cả hai cần phát triển song song.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                            | Tại sao sai                                                        | Đúng là                                                     |
| -------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| "PM lo phần đó, tôi chỉ code"                      | Kỹ sư là người biết rủi ro kỹ thuật nhất, PM không thể detect thay | Proactively share technical risks với PM ngay khi phát hiện |
| Estimate ngay khi được hỏi mà không suy nghĩ       | Áp lực tạo ra số ảo, gây miss deadline                             | Nói "Tôi cần 30 phút xem qua code rồi estimate"             |
| Báo cáo "đang làm" nhưng thực ra bị kẹt nhiều ngày | Manager không biết để unblock kịp thời                             | Báo blocker trong vòng 24h khi phát hiện                    |

**🎯 Interview Pattern:**

- Khi thấy: "Tell me about a time you missed a deadline" → Nhớ đến: PM skills framework (estimate + risk + communication) → Mở đầu: "Lần đó tôi phát hiện blocker muộn vì không có risk identification upfront — từ đó tôi luôn dùng pre-mortem và báo blocker trong 24h đầu phát hiện."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [SDLC Practices](./03-sdlc-and-practices.md)
- ➡️ Để hiểu tiếp: [Agile Deep Dive](#2-agile-deep-dive--agile-chuyên-sâu)

### 🟢 Q: Why should engineers care about project management? `[Junior]`

**A:** Kỹ sư không chỉ viết code. Ngay cả IC (Individual Contributor) cũng cần:

- **Ước lượng** thời gian hoàn thành task chính xác.
- **Giao tiếp** tiến độ, blocker, rủi ro cho team và stakeholder.
- **Ưu tiên** công việc phù hợp với mục tiêu sản phẩm.
- **Phối hợp** với PM, QA, Design, DevOps trong cross-functional team.

Không biết PM skills = khó thăng tiến, khó làm việc hiệu quả trong team lớn.

### 🟡 Q: What is the difference between IC and Manager track? `[Mid]`

**A:** Hai career track song song trong engineering:

| Khía cạnh      | IC Track                                   | Manager Track                     |
| -------------- | ------------------------------------------ | --------------------------------- |
| Focus          | Technical depth, architecture              | People, process, strategy         |
| Output         | Code, design docs, ADRs, RFCs              | Team performance, hiring, culture |
| Growth path    | Senior → Staff → Principal → Distinguished | EM → Director → VP Engineering    |
| Decision style | Technical trade-offs                       | Organizational trade-offs         |
| Influence      | Through expertise & artifacts              | Through people & process          |

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

> 🧠 **Memory Hook:** Nấu ăn kiểu Agile: nếm thử sau mỗi bước, điều chỉnh gia vị — không đợi khách ăn xong mới biết nhạt hay mặn.

**Tại sao tồn tại? / Why does this exist?**

Waterfall thất bại vì feedback đến quá muộn — deploy xong mới biết sai requirement. → **Why?** Vì software là loại sản phẩm mà requirements thay đổi theo hiểu biết, không cố định từ đầu. → **Why?** Vì nhu cầu thực sự của khách hàng chỉ rõ ràng khi họ nhìn thấy và dùng sản phẩm thực tế.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng nấu bữa tiệc cho 50 khách: Waterfall là nấu hết 10 món rồi mới mời khách vào ăn — lúc đó mới biết họ không ăn cay. Agile là nấu một món trước, mời vài người nếm thử, nghe phản hồi, điều chỉnh, rồi mới nấu món tiếp. Có thể menu cuối khác hẳn kế hoạch ban đầu — nhưng khách hài lòng hơn nhiều. Agile không phải "không có kế hoạch" mà là "kế hoạch linh hoạt theo thực tế."

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

1. **Plan** — Sprint backlog được chọn từ product backlog theo priority
2. **Build** — Developers code trong sprint (1–4 tuần cố định)
3. **Review** — Demo working software cho stakeholders, nhận feedback
4. **Retrospect** — Team cải tiến process cho sprint tiếp
5. **Loop lại** — Requirements được update theo feedback, ưu tiên lại backlog

```
Waterfall: Plan→Build→Test→Deploy → [Feedback quá muộn]
Agile:    [Plan→Build→Review→Retro] × N sprints → feedback sớm mỗi vòng
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Fixed-price contracts: Agile khó áp dụng vì scope phải cố định — hybrid hoặc Waterfall phù hợp hơn.
- Regulated industries (FDA, aviation): cần formal documentation mà Agile thuần túy không đáp ứng.
- Remote teams across timezones: daily standup đồng bộ khó — cần async Agile adaptations.
- Cargo Cult Agile: có hình thức (standup, board) nhưng thiếu substance (trao quyền, psychological safety).

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                   | Tại sao sai                                                   | Đúng là                                                          |
| ----------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------- |
| Dùng standup để report status cho manager | Standup là để team tự coordinate, không phải reporting        | Standup hỏi "ai bị blocked?" không phải "bạn làm gì hôm qua?"    |
| Sprint scope thay đổi giữa chừng liên tục | Phá vỡ Sprint Goal, team mất focus và velocity không reliable | Thay đổi scope → vào backlog sprint tiếp, bảo vệ sprint hiện tại |
| Retro chỉ nói mà không có action items    | Không có cải tiến thực sự, retro trở thành ritual vô nghĩa    | Mỗi retro phải có ≥1 concrete action với owner và deadline       |

**🎯 Interview Pattern:**

- Khi thấy: "How do you handle changing requirements?" → Nhớ đến: Agile "Responding to change" value → Mở đầu: "Tôi dùng Agile approach — welcome thay đổi nhưng manage nó qua backlog, không phải giữa sprint để bảo vệ Sprint Goal và team focus."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Why Engineers Need PM Skills](#1-why-engineers-need-pm-skills--vì-sao-kỹ-sư-cần-kỹ-năng-quản-lý-dự-án)
- ➡️ Để hiểu tiếp: [Scrum Framework](#3-scrum-framework--framework-scrum)

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

| #   | Principle                                                                   | Giải thích ngắn                                             |
| --- | --------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 1   | Highest priority: satisfy customer through early and continuous delivery    | Giao phần mềm giá trị sớm và liên tục                       |
| 2   | Welcome changing requirements, even late in development                     | Đón nhận thay đổi, coi đó là lợi thế cạnh tranh             |
| 3   | Deliver working software frequently (weeks to months)                       | Chu kỳ giao hàng ngắn, ưu tiên ngắn hơn                     |
| 4   | Business people and developers work together daily                          | PM/business và dev phối hợp hàng ngày                       |
| 5   | Build projects around motivated individuals, give them support and trust    | Trao quyền và tin tưởng team                                |
| 6   | Face-to-face conversation is the most efficient communication               | Giao tiếp trực tiếp hiệu quả nhất (đời remote: video call)  |
| 7   | Working software is the primary measure of progress                         | Đo tiến độ bằng sản phẩm chạy được, không phải % completion |
| 8   | Sustainable pace: sponsors, developers, users maintain constant pace        | Tốc độ bền vững, tránh burnout                              |
| 9   | Continuous attention to technical excellence enhances agility               | Chất lượng kỹ thuật tốt giúp linh hoạt hơn                  |
| 10  | Simplicity — maximize work not done — is essential                          | Làm ít nhất để đạt mục tiêu, tránh over-engineering         |
| 11  | Best architectures, requirements, designs emerge from self-organizing teams | Team tự tổ chức tạo ra kết quả tốt nhất                     |
| 12  | Regular reflection and adjustment of behavior                               | Retro định kỳ để cải tiến liên tục                          |

### 🟡 Q: What is the detailed comparison between Agile and Waterfall? `[Mid]`

**A:**

| Khía cạnh            | Waterfall                     | Agile                      |
| -------------------- | ----------------------------- | -------------------------- |
| Approach             | Sequential, phase-gate        | Iterative, incremental     |
| Requirements         | Fixed upfront                 | Evolving, discovered       |
| Planning             | Big upfront plan              | Rolling wave, sprint-level |
| Feedback             | Late (after deployment)       | Early and continuous       |
| Risk                 | Back-loaded (discover late)   | Front-loaded (fail fast)   |
| Change cost          | High (rework previous phases) | Low (small iterations)     |
| Documentation        | Heavy, formal                 | Sufficient, living docs    |
| Testing              | Phase after development       | Continuous, integrated     |
| Delivery             | Big bang release              | Incremental releases       |
| Team structure       | Specialized silos             | Cross-functional           |
| Customer involvement | Beginning and end             | Throughout                 |
| Success metric       | Conformance to plan           | Business value delivered   |

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

| Framework                    | Đặc điểm                                                            | Khi phù hợp                                | Nhược điểm                                                     |
| ---------------------------- | ------------------------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------- |
| **SAFe** (Scaled Agile)      | Heavyweight, PI Planning (8-12 weeks), ART (Agile Release Train)    | Enterprise lớn 50-125+ devs, cần alignment | Quá nặng, bureaucratic, dễ thành "Waterfall in Agile clothing" |
| **LeSS** (Large-Scale Scrum) | Lightweight, giữ nguyên Scrum rules, 1 Product Owner cho nhiều team | 2-8 teams cùng product                     | Yêu cầu PO rất mạnh, khó khi team > 8                          |
| **Nexus** (Scrum.org)        | Extension của Scrum, thêm Nexus Integration Team                    | 3-9 Scrum teams                            | Ít tooling/community hơn SAFe                                  |

**Trade-off chung:** Scaling framework nào cũng thêm overhead. Trước khi scale process, hãy xem xét giảm coupling giữa teams (Team Topologies, microservices) để giảm nhu cầu coordination.

---

## 3. Scrum Framework — Framework Scrum

> 🧠 **Memory Hook:** Scrum = đội chạy sprint bộ: có đích (Sprint Goal), có pace (timebox), có coach (Scrum Master), chạy xong nghỉ và rút kinh nghiệm trước vòng tiếp.

**Tại sao tồn tại? / Why does this exist?**

Agile là triết lý, Scrum là framework để hiện thực hóa — cung cấp cấu trúc cụ thể (roles, events, artifacts) để teams có thể bắt đầu ngay. → **Why?** Vì không có cấu trúc rõ ràng, teams Agile dễ rơi vào chaos — "tự tổ chức" không có nghĩa là vô tổ chức. → **Why?** Vì con người cần rituals và boundaries rõ ràng để duy trì momentum và cải tiến liên tục bền vững.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng giải chạy bộ marathon được chia thành nhiều sprint ngắn. Mỗi sprint có điểm xuất phát (Sprint Planning), đích đến rõ ràng (Sprint Goal), và tiếp nước trên đường (Daily Scrum). Xong mỗi vòng, huấn luyện viên (Scrum Master) giúp phân tích kỹ thuật chạy và ban tổ chức (Product Owner) điều chỉnh lộ trình. Không ai chạy mà không biết đích — đó là Scrum.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Product Backlog → Sprint Planning → Sprint Backlog
                                          ↓
                                    [1-4 tuần sprint]
                                     Daily Scrum 15'
                                          ↓
                                Potentially Shippable Increment
                                          ↓
                            Sprint Review ← Stakeholder Feedback
                                          ↓
                             Sprint Retrospective → Improvements
                                          ↓
                                Next Sprint Planning...
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Scrum không phù hợp với ops/support vì luồng việc không đoán trước — Kanban phù hợp hơn.
- Sprint 1 tuần quá ngắn nếu tasks có dependency dài — cần refine backlog kỹ hơn trước sprint.
- Product Owner thiếu quyền hạn (phải xin approval từ manager) = bottleneck cho mọi quyết định.
- Scrum of Scrums (nhiều team cùng sản phẩm) thêm overhead coordination đáng kể.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                     | Tại sao sai                                               | Đúng là                                                      |
| ------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------ |
| Scrum Master = Project Manager assign tasks | SM là servant-leader, không phải boss điều phối           | SM remove impediments, team tự assign tasks theo Sprint Goal |
| Story points dùng để đo performance cá nhân | Points đo complexity của story, không phải output cá nhân | Velocity là metric team-level, không compare cá nhân         |
| Retro bị bỏ qua khi sprint bận              | Đúng khi stressed nhất là lúc cần retro nhất              | Retro là sacred ceremony, timebox 90 phút, không thể skip    |

**🎯 Interview Pattern:**

- Khi thấy: "Tell me about your Agile experience" → Nhớ đến: 3 roles + 5 events + 3 artifacts → Mở đầu: "Tôi đã làm Scrum với 2-week sprints — Product Owner owns backlog, Scrum Master facilitate events, Developers tự organize Sprint Backlog theo Sprint Goal."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Agile Deep Dive](#2-agile-deep-dive--agile-chuyên-sâu)
- ➡️ Để hiểu tiếp: [Kanban](#4-kanban--phương-pháp-kanban)

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

| Event                    | Timebox                | Mục tiêu                            | Đầu ra                           |
| ------------------------ | ---------------------- | ----------------------------------- | -------------------------------- |
| **Sprint**               | 1-4 weeks (consistent) | Container cho tất cả events         | Potentially releasable increment |
| **Sprint Planning**      | Max 8h (sprint 4 tuần) | Chọn Sprint Goal + Sprint Backlog   | Sprint Goal + plan rõ ràng       |
| **Daily Scrum**          | 15 phút                | Inspect progress toward Sprint Goal | Plan cho 24h tiếp                |
| **Sprint Review**        | Max 4h (sprint 4 tuần) | Demo increment, nhận feedback       | Adjusted Product Backlog         |
| **Sprint Retrospective** | Max 3h (sprint 4 tuần) | Inspect process, plan improvements  | Committed action items           |

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

| Anti-pattern             | Triệu chứng                                      | Hậu quả                                   | Khắc phục                                                    |
| ------------------------ | ------------------------------------------------ | ----------------------------------------- | ------------------------------------------------------------ |
| **Absent PO**            | PO không available, dev tự đoán priority         | Build sai thứ, scope creep                | PO commit ít nhất 50% thời gian cho team                     |
| **Sprint scope change**  | Thêm work giữa sprint thường xuyên               | Team không commit, velocity vô nghĩa      | Negotiate: swap equal-sized items hoặc đợi sprint sau        |
| **No Sprint Goal**       | Sprint = danh sách tasks rời rạc                 | Không có focus, khó cancel sprint khi cần | PO + team thống nhất 1 goal ngắn gọn mỗi planning            |
| **Retro theater**        | Retro có action items nhưng không ai follow up   | Team mất niềm tin vào process             | Track action items visible, review đầu retro tiếp            |
| **Velocity as KPI**      | Manager dùng velocity để đánh giá performance    | Inflation story points, gaming            | Chỉ dùng velocity để forecast, không phải evaluate           |
| **Waterfall-in-sprints** | Sprint 1: design, Sprint 2: code, Sprint 3: test | Không có releasable increment             | Mỗi sprint phải deliver working software end-to-end          |
| **Meeting-heavy Scrum**  | Quá nhiều meetings ngoài Scrum events            | Dev có ít time cho deep work              | Strict timebox, consolidate meetings, protect maker schedule |

---

## 4. Kanban — Phương pháp Kanban

> 🧠 **Memory Hook:** Kanban = bảng ghi việc nhà trên tủ lạnh: mỗi việc một tờ giấy dán, di từ "cần làm" → "đang làm" → "xong" — và giới hạn bao nhiêu việc đồng thời.

**Tại sao tồn tại? / Why does this exist?**

Scrum sprint cứng nhắc không phù hợp với mọi loại công việc — đặc biệt ops, support, maintenance không có "sprint boundary" tự nhiên. → **Why?** Vì bottleneck trong workflow chỉ visible khi bạn trực quan hóa từng bước và giới hạn WIP. → **Why?** Vì context switching — làm nhiều việc cùng lúc — thực ra chậm hơn làm tuần tự từng việc đến hoàn tất (Little's Law).

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng bảng ghi việc nhà trên tủ lạnh: "rửa bát, đi chợ, giặt quần áo." Mỗi tờ giấy nhỏ dán vào cột "cần làm," và khi bắt đầu thì chuyển sang "đang làm." Quy tắc nhà: tối đa 2 việc "đang làm" cùng lúc — nếu rửa bát chưa xong thì không được bắt đầu đi chợ. Ai nhìn vào bảng cũng biết gia đình đang kẹt ở đâu. Đó là Kanban.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
┌──────────┬──────────┬──────────────┬──────────┬────────┐
│ Backlog  │  Ready   │ In Progress  │  Review  │  Done  │
│          │          │   [WIP ≤ 3]  │ [WIP ≤ 2]│        │
├──────────┼──────────┼──────────────┼──────────┼────────┤
│ Task E   │ Task D   │ Task B ████  │ Task A   │ Task X │
│ Task F   │          │ Task C ███░  │          │ Task Y │
│ Bug G    │          │              │          │        │
└──────────┴──────────┴──────────────┴──────────┴────────┘
   ←──── Worker pulls when capacity available (pull system) ────
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- WIP limit quá chặt (limit = 1) có thể gây idle time khi chờ review — tuning theo team size cần thiết.
- Kanban thiếu Sprint Goal nên team dễ mất direction — nên kết hợp với OKRs hoặc milestones.
- Expedite lane bị lạm dụng — mọi thứ đều "urgent" = không có priority thực sự.
- Kanban metrics (cycle time, throughput) cần minimum 15-20 data points để có ý nghĩa thống kê.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                       | Tại sao sai                                                | Đúng là                                                    |
| --------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| Không đặt WIP limits                          | Mất lợi ích cốt lõi của Kanban — vẫn là multitasking chaos | Bắt đầu với WIP = số thành viên team, điều chỉnh dần       |
| Dùng Kanban board chỉ để tracking, không pull | Vẫn là push system với giao diện Kanban                    | Worker chủ động pull task khi có capacity, không bị assign |
| Board không phản ánh workflow thực tế         | Tạo cảm giác control ảo, ẩn bottleneck thật                | Mỗi column = bước thực sự trong quy trình làm việc         |

**🎯 Interview Pattern:**

- Khi thấy: "How do you manage ongoing support work alongside feature development?" → Nhớ đến: Kanban + swimlanes → Mở đầu: "Tôi dùng Kanban với swimlane riêng cho expedite/bug tickets, WIP limit riêng từng swimlane để đảm bảo support không block feature."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Scrum Framework](#3-scrum-framework--framework-scrum)
- ➡️ Để hiểu tiếp: [Estimation Techniques](#5-estimation-techniques--kỹ-thuật-ước-lượng)

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

| Khía cạnh     | Push System                           | Pull System                          |
| ------------- | ------------------------------------- | ------------------------------------ |
| Trigger       | Manager assign work                   | Worker pulls when capacity available |
| WIP           | Không kiểm soát                       | Controlled by WIP limits             |
| Bottleneck    | Hidden until late                     | Visible immediately                  |
| Overload risk | High (work pushed regardless)         | Low (only pull when ready)           |
| Example       | Waterfall handoff, email-driven tasks | Kanban board, supermarket restock    |

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

| Tiêu chí            | Chọn Scrum                         | Chọn Kanban                           |
| ------------------- | ---------------------------------- | ------------------------------------- |
| Work nature         | Feature development, product teams | Support, ops, maintenance, mixed work |
| Predictability need | High (sprint commitment)           | Moderate (flow-based forecasting)     |
| Team maturity       | Cần structure rõ ràng              | Team đã disciplined, cần flexibility  |
| Prioritization      | PO batch mỗi sprint                | Continuous re-prioritization          |
| Release cadence     | End of sprint                      | Anytime (continuous delivery)         |
| Roles               | Defined (PO, SM, Dev)              | No prescribed roles                   |
| Meetings            | Fixed ceremonies                   | Minimal required meetings             |

**Hybrid (Scrumban):** Nhiều team dùng Sprint + WIP limits + Kanban metrics. Không cần chọn cứng.

---

## 5. Estimation Techniques — Kỹ thuật ước lượng

> 🧠 **Memory Hook:** Ước lượng như nấu bữa tiệc 50 người: không ai biết chính xác, nhưng người nấu giỏi biết cho buffer, biết món nào rủi ro, và báo sớm nếu nguyên liệu thiếu.

**Tại sao tồn tại? / Why does this exist?**

Không có estimation = team không biết bao giờ xong = stakeholders không thể plan release = business không thể commit với khách hàng. → **Why?** Vì phần mềm phức tạp và ẩn nhiều unknown — estimation là cách quản lý uncertainty, không phải lời hứa chính xác. → **Why?** Vì con người tự nhiên underestimate (optimism bias) — cần framework và process để counter bias này một cách có hệ thống.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Nấu bữa tiệc 50 người: bạn không biết chính xác mất bao lâu, nhưng bạn có thể ước lượng. Món canh dễ = XS. Món gà nướng nguyên con = L. Bánh kem trang trí = XL vì chưa làm bao giờ. Người nấu giỏi nói "khoảng 4-6 tiếng, nhưng nếu lò bị hỏng thì thêm 2 tiếng nữa" — đó là three-point estimation với explicit risk. Người không giỏi nói "2 tiếng" rồi thực tế mất 6 tiếng — đó là optimism bias.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

1. **Story Points (tương đối):** So sánh complexity — "Feature A gấp đôi Feature B"
2. **Planning Poker:** Mọi người vote đồng thời để tránh anchoring bias
3. **T-shirt sizing:** XS/S/M/L/XL cho roadmap sơ bộ nhanh
4. **Three-Point PERT:** E = (O + 4M + P) / 6 — tính uncertainty vào estimate
5. **Reference class:** Dùng historical data — "feature tương tự trước mất 3 sprints"

```
Tốc độ vs Độ chính xác:
T-shirt sizing → ██░░░░░░░░░░ (nhanh, rough — roadmap)
Story points   → ████████░░░░ (vừa — sprint planning)
Three-point    → ████████████ (chậm, có uncertainty range — high-stakes)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Estimates bị dùng như deadline cứng — team bắt đầu game story points để "đảm bảo" estimate.
- First-time feature với unknown tech: estimate có thể sai 5-10x — cần spike/prototype trước khi commit.
- Velocity-based forecasting chỉ reliable sau ≥5 sprints với team composition ổn định.
- #NoEstimates: slice stories nhỏ đều nhau và đếm throughput — hiệu quả cho mature teams nhưng cần trust từ management.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                              | Đúng là                                                           |
| -------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------- |
| Đưa estimate đơn lẻ không kèm assumptions    | Người nghe không biết điều kiện nào làm estimate đúng    | Luôn nói "estimate này assumes X, Y, Z — nếu sai thì thêm N ngày" |
| Commit estimate ngay dưới áp lực của manager | Pressure tạo ra số không realistic, gây miss deadline    | "Tôi cần 1 ngày xem code rồi mới estimate chính xác được"         |
| Không update estimate khi có thông tin mới   | Estimate cũ không còn valid nhưng vẫn được dùng để track | Re-estimate ngay khi phát hiện assumption sai hoặc scope thay đổi |

**🎯 Interview Pattern:**

- Khi thấy: "How do you estimate features?" → Nhớ đến: Relative estimation + explicit assumptions + range → Mở đầu: "Tôi dùng story points relative estimation với Planning Poker cho team, và luôn kèm assumptions rõ ràng — ví dụ 'estimate này giả sử API đã có documentation và stable.'"

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Scrum Framework](#3-scrum-framework--framework-scrum)
- ➡️ Để hiểu tiếp: [Risk Management](#6-risk-management--quản-lý-rủi-ro)

### 🟢 Q: What are story points and how do they differ from time-based estimation? `[Junior]`

**A:**

| Khía cạnh        | Story Points                      | Time-based (hours/days)      |
| ---------------- | --------------------------------- | ---------------------------- |
| Measures         | Relative complexity/effort        | Absolute time                |
| Comparison       | "Task A gấp đôi Task B"           | "Task A mất 8 giờ"           |
| Accuracy         | Tốt hơn cho long-term planning    | Tốt hơn cho short-term tasks |
| Psychology       | Ít pressure "sao mất lâu thế"     | Dễ bị micro-manage           |
| Scale            | Fibonacci: 1, 2, 3, 5, 8, 13, 21  | Hours, days                  |
| Factors included | Complexity + uncertainty + effort | Only time                    |

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

| Size   | Relative effort | Typical range | Use case                    |
| ------ | --------------- | ------------- | --------------------------- |
| **XS** | Trivial         | < 1 day       | Config change, copy fix     |
| **S**  | Small           | 1-2 days      | Bug fix, minor feature      |
| **M**  | Medium          | 3-5 days      | Standard feature            |
| **L**  | Large           | 1-2 weeks     | Complex feature, cần design |
| **XL** | Very large      | 2-4 weeks     | Epic, cần breakdown further |

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

**Nguyên nhân estimate thường không chính xác:**

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

> 🧠 **Memory Hook:** Risk management = mua bảo hiểm xe trước khi ra đường — không phải vì bạn sắp gặp tai nạn, mà vì bạn biết sẽ tiếc nếu không chuẩn bị khi tai nạn xảy ra.

**Tại sao tồn tại? / Why does this exist?**

Projects thất bại không phải vì thiếu cố gắng mà vì rủi ro được phát hiện quá muộn để xử lý hiệu quả. → **Why?** Vì các vấn đề kỹ thuật (API dependency, performance bottleneck, key person risk) đều có dấu hiệu sớm — chỉ cần biết tìm ở đâu. → **Why?** Vì cost xử lý risk tăng theo cấp số nhân khi phát hiện muộn — risk ngày 1 tốn 1x, ngày 30 tốn 10x, sau release tốn 100x.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Mua bảo hiểm xe trước khi lái không có nghĩa là bạn sẽ gặp tai nạn. Nhưng nếu tai nạn xảy ra mà không có bảo hiểm, thiệt hại có thể phá sản. Risk management cũng vậy: identify risks sớm, assess mức độ nghiêm trọng, và chuẩn bị response plan. Không phải lo lắng thái quá — mà là "nếu điều này xảy ra, mình sẽ làm gì và tốn bao lâu để recover?"

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Identify Risks → Assess (P × I) → Plan Response → Monitor & Update

           Impact
High  │ Mitigate │  Avoid   │  Avoid   │
      │──────────┼──────────┼──────────│
Med   │  Accept  │ Mitigate │  Avoid   │
      │──────────┼──────────┼──────────│
Low   │  Accept  │  Accept  │ Mitigate │
      └──────────┴──────────┴──────────┘
           Low      Medium      High
                  Probability

4 Strategies: Avoid | Mitigate | Transfer | Accept
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Over-mitigating low-probability risks lãng phí effort — Accept là strategy hợp lệ cho low-impact risks.
- "Unknown unknowns" không thể identify được — dùng buffer time (15-30%) thay thế.
- Risk register chỉ có giá trị nếu được review thường xuyên — một lần rồi bỏ quên = vô dụng.
- Transfer risk sang managed service/vendor chuyển rủi ro thành vendor dependency risk mới.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                   | Tại sao sai                                                           | Đúng là                                                     |
| --------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------- |
| Tạo risk register một lần rồi bỏ quên                     | Risks thay đổi theo project progress — stale list gây ảo giác an toàn | Review risk register mỗi sprint hoặc milestone              |
| Chỉ identify technical risks, bỏ sót organizational risks | Key person, team conflict, vendor delay cũng là critical risks        | Brainstorm cả technical + human + external risks            |
| Mitigation plan quá chung chung kiểu "test kỹ hơn"        | Không phải kế hoạch cụ thể — không actionable                         | Cụ thể: "Spike 2 ngày tuần này để validate API feasibility" |

**🎯 Interview Pattern:**

- Khi thấy: "How do you handle technical uncertainty in a project?" → Nhớ đến: Pre-mortem + P×I matrix + 4 response strategies → Mở đầu: "Tôi dùng pre-mortem với team để identify risks sớm, rate bằng P×I matrix, và plan response — avoid, mitigate, transfer, hoặc accept với contingency."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Estimation Techniques](#5-estimation-techniques--kỹ-thuật-ước-lượng)
- ➡️ Để hiểu tiếp: [Incident Management](#8-incident-management--quản-lý-sự-cố)

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

| Strategy     | Giải thích                             | Ví dụ                                                        |
| ------------ | -------------------------------------- | ------------------------------------------------------------ |
| **Avoid**    | Loại bỏ rủi ro bằng cách thay đổi plan | Bỏ feature quá rủi ro, chọn technology proven                |
| **Mitigate** | Giảm probability hoặc impact           | Thêm monitoring, spike trước khi commit, prototype           |
| **Transfer** | Chuyển rủi ro cho bên khác             | Dùng managed service (AWS RDS thay tự host DB), mua bảo hiểm |
| **Accept**   | Chấp nhận rủi ro, có plan nếu xảy ra   | Low-impact risk, contingency plan ready                      |

### 🔴 Q: What are common engineering risks and mitigation strategies? `[Senior]`

**A:**

| Risk                             | Probability | Impact   | Mitigation                                                 |
| -------------------------------- | ----------- | -------- | ---------------------------------------------------------- |
| Key person dependency            | Medium      | High     | Cross-training, documentation, pair programming            |
| Third-party API breaking change  | Medium      | High     | Contract tests, API versioning, adapter pattern            |
| Performance degradation at scale | Medium      | High     | Load testing early, capacity planning, auto-scaling        |
| Security vulnerability           | Medium      | Critical | SAST/DAST in CI, dependency scanning, security reviews     |
| Data migration failure           | Low         | Critical | Dry-run migration, rollback script, dual-write period      |
| Scope creep                      | High        | Medium   | Clear Definition of Ready, sprint commitment, PO authority |
| Technical debt accumulation      | High        | Medium   | 15-20% capacity per sprint for debt, track debt register   |
| Integration failures             | Medium      | High     | Integration tests in CI, feature flags, canary deploys     |
| Team burnout                     | Medium      | High     | Sustainable pace, WIP limits, protect maker time           |

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

> 🧠 **Memory Hook:** Team Topologies = cách xếp đội bóng: tiền đạo (stream-aligned), hậu vệ (platform), huấn luyện viên cạnh sân (enabling), thủ môn chuyên biệt (complicated subsystem).

**Tại sao tồn tại? / Why does this exist?**

Nhiều org scale engineering bằng cách thêm người — nhưng team lớn giao tiếp càng nhiều, delivery càng chậm. → **Why?** Vì Conway's Law: architecture phản ánh org chart — org structure sai dẫn đến architecture sai và coupling không mong muốn. → **Why?** Vì cognitive load của mỗi team có giới hạn — khi vượt ngưỡng, quality giảm và burnout tăng theo cấp số nhân.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Đội bóng chuyên nghiệp không để tất cả 11 người làm cùng một việc. Tiền đạo ghi bàn (stream-aligned team giao value cho khách hàng), hậu vệ bảo vệ (platform team cung cấp infrastructure), huấn luyện viên cạnh sân dạy kỹ thuật (enabling team coach team khác rồi rút), thủ môn chuyên biệt cần skill riêng (complicated subsystem team). Mỗi vị trí có vai trò rõ, giao tiếp đúng cách — đội mới thắng.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
4 Team Types:
┌─────────────────────────────────────────────────────┐
│ Stream-aligned: deliver value end-to-end per domain │
│   Team Payments | Team Search | Team Onboarding     │
├─────────────────────────────────────────────────────┤
│ Platform: self-service internal platform            │
│   Team Infrastructure | Team Developer Experience  │
├─────────────────────────────────────────────────────┤
│ Enabling: coach → transfer knowledge → exit         │
│   Team Performance | Team Security Practices        │
├─────────────────────────────────────────────────────┤
│ Complicated Subsystem: deep specialist knowledge    │
│   Team ML | Team Video Codec | Team Cryptography    │
└─────────────────────────────────────────────────────┘

3 Interaction Modes:
X-as-a-Service  ← default (stable API, low overhead)
Collaboration   ← temporary (discovery, innovation)
Facilitating    ← temporary (knowledge transfer then exit)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Platform team dùng như "central gatekeeper" = bottleneck, bỏ mất tính self-service cốt lõi.
- Enabling team engagement kéo dài quá lâu = dependency, không transfer knowledge thật sự.
- Quá nhiều Complicated Subsystem teams = stream-aligned teams chờ dependencies liên tục.
- Inverse Conway Maneuver cần thay đổi org structure trước architecture — khó thực hiện ở org lớn có legacy.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                   | Tại sao sai                                    | Đúng là                                                                |
| --------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------- |
| Platform team = DevOps team mà stream teams phải xin phép | Mất self-service, tạo bottleneck và dependency | Platform team cung cấp self-service tools + documentation đầy đủ       |
| Collaboration mode kéo dài giữa 2 teams                   | High coupling, cả 2 teams slow down lẫn nhau   | Collaboration tạm thời để discovery, target chuyển sang X-as-a-Service |
| Ignore cognitive load khi assign scope cho team           | Team overloaded giảm quality và tăng burnout   | Measure và limit scope per team — Team API concept                     |

**🎯 Interview Pattern:**

- Khi thấy: "How do you structure engineering teams for a growing org?" → Nhớ đến: Team Topologies 4 types + Conway's Law → Mở đầu: "Tôi align team structure theo business domain — stream-aligned teams cho mỗi product area, platform team cho shared infrastructure, và apply Inverse Conway Maneuver để architecture follow org design."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Why Engineers Need PM Skills](#1-why-engineers-need-pm-skills--vì-sao-kỹ-sư-cần-kỹ-năng-quản-lý-dự-án)
- ➡️ Để hiểu tiếp: [Technical Leadership](#9-technical-leadership--lãnh-đạo-kỹ-thuật)

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

| Interaction Mode   | Mô tả                                   | Khi dùng                               | Duration                    |
| ------------------ | --------------------------------------- | -------------------------------------- | --------------------------- |
| **Collaboration**  | 2 teams work closely together           | Discovery, innovation, new integration | Temporary (weeks to months) |
| **X-as-a-Service** | 1 team provides service, other consumes | Stable API/platform, clear boundary    | Long-term (default)         |
| **Facilitating**   | 1 team helps other learn/adopt          | Enabling team coaching stream-aligned  | Temporary (weeks)           |

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

| Khía cạnh     | Cross-functional team       | Component team                        |
| ------------- | --------------------------- | ------------------------------------- |
| Composition   | FE + BE + QA + DevOps       | All FE engineers, or all BE engineers |
| Delivery      | End-to-end feature delivery | Deliver component/layer               |
| Dependency    | Low (self-sufficient)       | High (need other teams for features)  |
| Ownership     | Business outcome ownership  | Technical component ownership         |
| Communication | Within team                 | Cross-team coordination heavy         |
| Preferred by  | Agile, Team Topologies      | Legacy orgs, some specialized domains |

**Trade-off:** Cross-functional teams deliver faster nhưng mỗi thành viên cần broader skills. Component teams có deep expertise nhưng handoffs gây delay.

---

## 8. Incident Management — Quản lý sự cố

> 🧠 **Memory Hook:** Incident = đội cứu hỏa: phát hiện lửa (detect), đánh giá quy mô (triage), dập lửa trước (mitigate), rồi mới tìm nguyên nhân cháy (resolve), và rút kinh nghiệm (post-mortem).

**Tại sao tồn tại? / Why does this exist?**

Mọi hệ thống đủ phức tạp đều sẽ có incident — câu hỏi không phải "có bao giờ xảy ra không" mà là "khi xảy ra, team phản ứng nhanh và có hệ thống không?" → **Why?** Vì downtime có chi phí cực lớn (revenue loss, reputation) — mỗi phút downtime của payment system có thể tốn hàng nghìn USD. → **Why?** Vì không có quy trình rõ, incident response là chaos — mọi người làm cùng một việc, không ai communicate, và "fix" gây ra incident mới.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Đội cứu hỏa không đến hiện trường rồi đứng tranh luận "nguyên nhân cháy là gì." Họ dập lửa trước (mitigate), đảm bảo người ra ngoài an toàn, rồi mới điều tra nguyên nhân. Incident commander chỉ huy — không phải người giỏi nhất về kỹ thuật mà là người điều phối tốt nhất. Sau khi dập lửa xong mới viết báo cáo rút kinh nghiệm. Đó là Detect → Triage → Mitigate → Resolve → Review.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
DETECT        TRIAGE         MITIGATE       RESOLVE        REVIEW
   │             │               │              │              │
Alert fires  Assign IC &    Rollback /     Fix root      Blameless
             set severity   flag off /     cause         post-mortem
User report  Notify stake-  scale up /     Deploy fix    24-48h after
Synthetic    holders        failover       Verify OK     Action items
test fails       │               │              │              │
             War room open  Stop bleeding  Production    Prevention
                            FIRST          healthy       measures
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- "Fix forward" vs "rollback": rollback nhanh hơn nhưng mất feature; fix forward cần khi DB migration đã chạy.
- Blameless culture thất bại nếu management sau đó vẫn phạt người liên quan — cần leadership buy-in thực sự.
- Alert fatigue: quá nhiều false positive khiến team ignore alerts — đầu tư vào alert quality, không chỉ quantity.
- On-call burnout: rotation không công bằng hoặc pages quá nhiều ngoài giờ = turnover cao.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                | Tại sao sai                                                         | Đúng là                                                        |
| -------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------- |
| Debug root cause trước khi mitigate    | Users vẫn bị ảnh hưởng trong lúc debug có thể mất hàng giờ          | Mitigate (rollback/flag off) ngay, debug sau khi impact dừng   |
| Post-mortem tìm người chịu trách nhiệm | Blame culture → team che giấu incidents → học được ít hơn           | Blameless: focus vào system và process, không phải cá nhân     |
| Không có runbook cho alerts phổ biến   | Mỗi lần incident phải reinvent response từ đầu trong lúc căng thẳng | Mỗi alert có runbook: meaning, steps to check, escalation path |

**🎯 Interview Pattern:**

- Khi thấy: "How do you handle production incidents?" → Nhớ đến: Detect → Triage → Mitigate → Resolve → Review → Mở đầu: "Quy trình của tôi: detect qua monitoring, assign Incident Commander, mitigate impact ngay (rollback nếu cần), fix root cause, và post-mortem blameless trong 48 giờ với action items cụ thể."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Risk Management](#6-risk-management--quản-lý-rủi-ro)
- ➡️ Để hiểu tiếp: [Metrics & KPIs](#11-metrics--kpis--chỉ-số-đo-lường) (MTTR là DORA metric)

### 🟢 Q: What are incident severity levels? `[Junior]`

**A:**

| Level    | Tên      | Mô tả                                             | Response time     | Example                                                   |
| -------- | -------- | ------------------------------------------------- | ----------------- | --------------------------------------------------------- |
| **SEV1** | Critical | System down, all users affected                   | < 15 min          | Production database crashed, payments failing             |
| **SEV2** | Major    | Major feature broken, significant users affected  | < 30 min          | Search unavailable, login failing for 20% users           |
| **SEV3** | Minor    | Non-critical feature broken, workaround available | < 4 hours         | Export feature broken, UI alignment issue on edge browser |
| **SEV4** | Low      | Cosmetic, minor inconvenience                     | Next business day | Typo in error message, slow loading of non-critical page  |

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

| Concept                           | Giải thích                         | Ví dụ                                            |
| --------------------------------- | ---------------------------------- | ------------------------------------------------ |
| **SLI** (Service Level Indicator) | Metric đo chất lượng service       | Request latency p99, error rate, availability    |
| **SLO** (Service Level Objective) | Target nội bộ cho SLI              | p99 latency < 200ms, availability > 99.9%        |
| **SLA** (Service Level Agreement) | Cam kết với khách hàng, có penalty | 99.95% uptime, hoàn tiền nếu breach              |
| **Error Budget**                  | Ngân sách lỗi cho phép = 1 - SLO   | SLO 99.9% → Error budget = 0.1% = 43.8 min/month |

**Error budget strategy:**

- Còn budget: ưu tiên feature velocity, chấp nhận rủi ro.
- Gần hết budget: slow down releases, focus stability.
- Hết budget: freeze deployments, team focus on reliability.

**Trade-off:** SLO quá cao (99.99%) = chậm innovation. SLO quá thấp (99%) = users không happy. Chọn SLO dựa trên user expectations và business cost.

---

## 9. Technical Leadership — Lãnh đạo kỹ thuật

> 🧠 **Memory Hook:** Tech Lead = nhạc trưởng dàn nhạc: không phải người chơi nhạc cụ giỏi nhất, mà là người đảm bảo mọi nhạc cụ hòa âm đúng tempo, đúng nhịp, đúng bản nhạc.

**Tại sao tồn tại? / Why does this exist?**

Khi team nhỏ, một engineer giỏi đủ để lead mọi thứ. Khi team lớn hơn, cần người dedicated để đảm bảo technical direction nhất quán và unblock team liên tục. → **Why?** Vì không có technical leadership, team có xu hướng drift về local optimum (từng người làm tốt task của mình) thay vì global optimum (cả system tốt hơn). → **Why?** Vì architecture, code quality, và mentoring là investment dài hạn — cần người chịu trách nhiệm dài hạn mới có kỷ luật thực hiện.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Nhạc trưởng không phải violinist giỏi nhất dàn nhạc. Họ không chơi nhạc cụ nào trong khi biểu diễn — nhưng thiếu nhạc trưởng, dàn nhạc lạc nhịp, một bộ phận quá to, một bộ phận quá nhỏ, toàn bộ bản nhạc sai. Tech Lead cũng vậy: dành ít thời gian code hơn nhưng đảm bảo mọi engineer đi đúng hướng, không ai bị block, và sản phẩm cuối ra đúng architecture đã thiết kế.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Tech Lead responsibilities:
┌────────────────────────────────────────────┐
│ Technical     │ ADR decisions              │
│ Direction     │ RFC facilitation           │
│               │ Architecture review        │
├────────────────────────────────────────────┤
│ Team          │ Unblock members daily      │
│ Enablement    │ Mentor junior/mid          │
│               │ Code review ownership      │
├────────────────────────────────────────────┤
│ Stakeholder   │ Communicate constraints    │
│ Interface     │ Negotiate scope/timeline   │
│               │ Cross-team coordination    │
└────────────────────────────────────────────┘
% time coding ↓ as scope/impact ↑ (IC→TL→Staff+)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- "Tech Lead còn code không?" — Vẫn code nhưng ít hơn (~50% IC time), focus high-risk/complex tasks.
- Tech Lead bị cuốn vào meetings quá nhiều mất technical depth — cần protect "maker time" block.
- Conflict giữa Tech Lead và Product Owner về scope/tech debt — cần negotiation framework, không phải hierarchy.
- Staff+ engineer không có direct reports nhưng có organizational impact rộng hơn Engineering Manager.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                       | Tại sao sai                                                        | Đúng là                                                       |
| --------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------- |
| Tech Lead review mọi PR, trở thành bottleneck | Review tốn hết thời gian TL, team chậm lại đáng kể                 | Delegate review cho seniors, chỉ review architectural changes |
| Không viết ADR cho quyết định quan trọng      | Quyết định bị forgotten hoặc reversed sau 6 tháng không ai nhớ why | ADR cho mọi decision có long-term architectural impact        |
| Nói "Tôi sẽ làm" thay vì "Tôi sẽ dạy bạn làm" | Team không grow, TL trở thành single point of failure              | Delegate để build team capability, TL là force multiplier     |

**🎯 Interview Pattern:**

- Khi thấy: "What makes a good Tech Lead?" → Nhớ đến: nhạc trưởng = enable team, không phải hero coder → Mở đầu: "Tech Lead tốt tạo môi trường để team deliver tốt nhất — qua architecture clarity, unblocking, mentoring, và communication với stakeholders — không phải bằng cách code nhiều nhất."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Team Topologies](#7-team-topologies--mô-hình-tổ-chức-team)
- ➡️ Để hiểu tiếp: [Delivery & Release Management](#10-delivery--release-management--quản-lý-triển-khai)

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

> 🧠 **Memory Hook:** Release management = giao hàng Shopee: đóng gói (build), kiểm tra chất lượng (test), giao thử 1% (canary), giao đại trà — và hoàn hàng ngay nếu lỗi (rollback).

**Tại sao tồn tại? / Why does this exist?**

"Works on my machine" là câu nói lịch sử của software failure — deployment manual, không nhất quán, gây ra environment khác nhau giữa dev và prod. → **Why?** Vì deploy thủ công sai do human error, chậm do handoffs, và khó rollback khi cần khẩn cấp. → **Why?** Vì thị trường cần software được deliver nhanh và reliable — CI/CD automation là competitive advantage, không phải nice-to-have.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Shopee giao hàng: kho đóng gói đơn hàng (build artifact), kiểm tra chất lượng trước khi giao (test), ship thử đến 1% khách hàng xem phản hồi (canary deploy), rồi giao đại trà (full rollout). Nếu khách phàn nàn hàng lỗi — Shopee thu hồi ngay (rollback). Feature flags là "giữ hàng ở kho, chỉ mở khi cần" — deploy code lên server nhưng chưa release cho user thấy.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Code Push → CI Pipeline → Deploy Staging → Verify → Deploy Production
    │             │              │             │            │
  Lint         Build &        Smoke         Manual      Canary
  Test         Docker         Tests          QA          1%→10%→100%
  TypeCheck    image          E2E            sign-off    Monitor each step
               Package        Tests                      Rollback if bad

Feature Flag: Deploy code ──→ [flag OFF] ──→ enable for %users gradually
Blue-Green:   Switch LB      Blue(v1)←current    Green(v1.1)←new
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Blue-green deployment yêu cầu 2x infrastructure cost — trade-off với instant zero-downtime rollback.
- Feature flags tích lũy (flag debt) gây code complexity — cần cleanup schedule và expiry dates mandatory.
- Database migrations không thể rollback dễ — cần backward-compatible migration (expand-contract pattern).
- Continuous deployment (không cần manual approval) yêu cầu mature testing và monitoring — không phù hợp mọi org.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                           | Tại sao sai                                                        | Đúng là                                                              |
| ------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Deploy và release cùng lúc mà không staging       | Không thể test production trước khi expose users                   | Tách deployment (code lên server) và release (bật feature cho users) |
| Rollback = redeploy version cũ của code only      | Nếu DB migration đã chạy, code cũ không tương thích với schema mới | Plan rollback strategy bao gồm cả data migration strategy            |
| Test chỉ trên local, không có staging environment | Staging phát hiện environment-specific bugs mà local miss          | Luôn có staging environment mirror production config                 |

**🎯 Interview Pattern:**

- Khi thấy: "How do you safely deploy a risky change?" → Nhớ đến: feature flags + canary + monitoring → Mở đầu: "Tôi dùng feature flag để decouple deploy và release, canary để rollout dần với monitoring, và có automated rollback threshold nếu error rate vượt ngưỡng."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Risk Management](#6-risk-management--quản-lý-rủi-ro)
- ➡️ Để hiểu tiếp: [Metrics & KPIs](#11-metrics--kpis--chỉ-số-đo-lường) (DORA metrics đo delivery performance)

### 🟢 Q: What are the stages of a CI/CD pipeline? `[Junior]`

**A:**

```text
Code → Build → Test → Package → Deploy Staging → Verify → Deploy Production → Monitor
```

**Chi tiết:**

| Stage                 | Mô tả                                   | Tools phổ biến                    |
| --------------------- | --------------------------------------- | --------------------------------- |
| **Code**              | Commit + push, trigger pipeline         | Git, GitHub/GitLab                |
| **Build**             | Compile, transpile, bundle              | Go build, Webpack, Docker build   |
| **Test**              | Unit, integration, lint, type-check     | Jest, Go test, ESLint, tsc        |
| **Package**           | Create artifact (Docker image, binary)  | Docker, ko, GoReleaser            |
| **Deploy Staging**    | Deploy lên staging environment          | ArgoCD, Helm, Terraform           |
| **Verify**            | Smoke test, integration test on staging | Cypress, k6, curl                 |
| **Deploy Production** | Progressive rollout to prod             | Canary, blue-green, feature flags |
| **Monitor**           | Observe metrics, logs, traces           | Prometheus, Grafana, Datadog      |

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

| Strategy                      | Speed   | When to use               | Limitation                               |
| ----------------------------- | ------- | ------------------------- | ---------------------------------------- |
| **Feature flag off**          | Instant | Feature-level rollback    | Need flag infrastructure                 |
| **LB traffic switch**         | Seconds | Blue-green environment    | Requires 2x infra                        |
| **Redeploy previous version** | Minutes | Standard rollback         | Need artifact stored                     |
| **Database rollback**         | Risky   | Schema migration failure  | May lose data; prefer forward-fix        |
| **Fix forward**               | Varies  | Small fix, rollback risky | Requires quick root cause identification |

**Best practices:**

- Luôn giữ previous artifact/image available.
- Test rollback procedure định kỳ (không phải chỉ khi incident).
- Database migrations phải backward compatible (expand-and-contract pattern).
- Automated rollback trigger: nếu error rate > threshold trong X phút → auto rollback.

### 🟡 Q: What is semantic versioning? `[Mid]`

**A:** SemVer format: `MAJOR.MINOR.PATCH`

| Component | Khi tăng                           | Ví dụ         |
| --------- | ---------------------------------- | ------------- |
| **MAJOR** | Breaking changes, incompatible API | 1.0.0 → 2.0.0 |
| **MINOR** | New features, backward compatible  | 1.0.0 → 1.1.0 |
| **PATCH** | Bug fixes, backward compatible     | 1.0.0 → 1.0.1 |

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

> 🧠 **Memory Hook:** Metrics = đồng hồ đo tốc độ trên xe: cần thiết để biết bạn đang chạy bao nhanh — nhưng đừng bao giờ lái xe chỉ để làm đồng hồ đẹp (Goodhart's Law).

**Tại sao tồn tại? / Why does this exist?**

"Bạn không thể cải thiện thứ bạn không đo được" — nhưng đo sai metrics còn tệ hơn không đo vì tạo ra hành vi có hại. → **Why?** Vì engineering productivity rất khó đo — lines of code, commits, PRs đều misleading khi dùng đơn lẻ. → **Why?** Vì metric tốt cần phản ánh business outcome (value delivered, reliability) chứ không phải activity (số commit, số meeting).

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Đồng hồ đo tốc độ cho bạn biết bao nhanh — nhưng lái xe tốt không chỉ là chạy nhanh. Bạn cũng cần đồng hồ xăng (MTTR), đèn check engine (change failure rate), và GPS đến đúng đích (deployment frequency có deliver value không). Goodhart's Law: nếu bạn lái xe chỉ để kim tốc độ đẹp — bạn sẽ phóng qua đèn đỏ. Engineer viết code chỉ để tăng coverage % — sẽ viết test không assert gì cả.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
DORA 4 Key Metrics (Google Research):
┌──────────────────────────────────────────────────────┐
│ Deployment Frequency  │ How often deploy to prod?    │
│ Lead Time for Changes │ Commit → production, how long?│
│ Change Failure Rate   │ % deploys causing incidents? │
│ MTTR                  │ How fast restore when down?  │
└──────────────────────────────────────────────────────┘
     Throughput metrics ──────── Stability metrics
     (Freq + Lead Time)         (CFR + MTTR)

Elite teams: HIGH throughput AND HIGH stability — not a trade-off!
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- DORA metrics chỉ meaningful nếu team track honestly — gaming là real risk (deploy config changes để inflate frequency).
- SPACE framework cần cả quantitative + qualitative data — survey-only hoặc metrics-only đều incomplete.
- Goodhart's Law applies to ANY metric — rotate metrics hoặc dùng balanced scorecard để giảm gaming.
- Velocity comparison giữa teams gần như không bao giờ valid vì story point scales và domain complexity khác nhau.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                         | Tại sao sai                                                    | Đúng là                                                     |
| ----------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------- |
| Dùng velocity để so sánh performance giữa teams | Velocity scale không standardized, domain complexity khác nhau | Velocity chỉ dùng để forecast trong cùng một team           |
| Một metric duy nhất đo developer productivity   | Dễ game, bỏ sót nhiều chiều quan trọng của engineering work    | Dùng balanced scorecard: DORA + SPACE + qualitative survey  |
| Metrics trở thành target để đánh giá cá nhân    | Team optimize metric thay vì optimize actual outcome           | Metrics để improve system và process, không phải rank người |

**🎯 Interview Pattern:**

- Khi thấy: "How do you measure your team's performance?" → Nhớ đến: DORA + SPACE + Goodhart's Law → Mở đầu: "Tôi dùng DORA metrics để đo delivery performance — đặc biệt pair deployment frequency với change failure rate để đảm bảo fast không có nghĩa là fragile."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Delivery & Release Management](#10-delivery--release-management--quản-lý-triển-khai)
- ➡️ Để hiểu tiếp: [Observability & Scale](../../be-track/04-be-system-design/05-observability-and-scale.md)

### 🟢 Q: What are DORA metrics? `[Junior]`

**A:** DORA (DevOps Research and Assessment, Google) định nghĩa 4 key metrics đo software delivery performance:

| Metric                          | Đo gì                                 | Elite                      | High           | Medium           | Low                  |
| ------------------------------- | ------------------------------------- | -------------------------- | -------------- | ---------------- | -------------------- |
| **Deployment Frequency**        | Tần suất deploy lên production        | On-demand (nhiều lần/ngày) | 1/day - 1/week | 1/week - 1/month | 1/month - 1/6 months |
| **Lead Time for Changes**       | Thời gian từ commit đến production    | < 1 hour                   | 1 day - 1 week | 1 week - 1 month | 1 - 6 months         |
| **Change Failure Rate**         | % deployments gây failure             | 0-15%                      | 16-30%         | 16-30%           | 46-60%               |
| **Mean Time to Restore (MTTR)** | Thời gian restore service khi failure | < 1 hour                   | < 1 day        | < 1 day - 1 week | > 6 months           |

**Insight:** 4 metrics này correlated — team deploy thường xuyên thường cũng có change failure rate thấp hơn (vì changes nhỏ = ít rủi ro).

### 🟡 Q: What is the SPACE framework? `[Mid]`

**A:** SPACE (GitHub + Microsoft Research) đo developer productivity toàn diện hơn:

| Dimension                             | Ý nghĩa                                         | Metrics ví dụ                                            |
| ------------------------------------- | ----------------------------------------------- | -------------------------------------------------------- |
| **S** — Satisfaction & well-being     | Developer có hài lòng với tools, process không? | Survey scores, retention rate                            |
| **P** — Performance                   | Output chất lượng đến tay user                  | Reliability, absence of bugs, user satisfaction          |
| **A** — Activity                      | Output đo được (nhưng đừng dùng alone)          | PRs merged, commits, deploys, code reviews               |
| **C** — Communication & collaboration | Chất lượng giao tiếp trong team                 | PR review time, knowledge sharing, meeting effectiveness |
| **E** — Efficiency & flow             | Dễ dàng hoàn thành công việc không?             | Flow state time, handoffs, wait time                     |

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

| Metric trở thành target | Hậu quả                  | Behavior bị lệch                           |
| ----------------------- | ------------------------ | ------------------------------------------ |
| Lines of code           | Verbose code, copy-paste | Viết nhiều code thay vì giải quyết vấn đề  |
| Number of PRs           | Tiny PRs without value   | Split PRs vô nghĩa để tăng count           |
| Story points velocity   | Point inflation          | Estimate cao hơn thực tế, gaming           |
| Code coverage %         | Tests without assertions | `expect(true).toBe(true)` để tăng coverage |
| Number of bugs fixed    | Create-and-fix bugs      | Tạo bug rồi fix để report                  |
| Deployment frequency    | Deploy without value     | Deploy config changes to inflate number    |

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

| #   | Câu hỏi tự kiểm tra                                                                                                         | Loại          | Mức độ    |
| --- | --------------------------------------------------------------------------------------------------------------------------- | ------------- | --------- |
| 1   | Tôi có thể estimate một feature với explicit assumptions và risk factors không — không chỉ đưa ra một con số duy nhất?      | Estimation    | 🟡 Mid    |
| 2   | Tôi có thể giải thích scope creep bằng ví dụ cụ thể và cách xử lý khi PM muốn thêm feature giữa sprint?                     | PM Skills     | 🟡 Mid    |
| 3   | Tôi có thể mô tả khi nào nên escalate blocker vs. tự giải quyết — với ngưỡng thời gian rõ ràng?                             | Communication | 🟡 Mid    |
| 4   | Tôi có thể phân biệt velocity (team đã làm gì — actual) và capacity (team có thể làm gì — forecast)?                        | Metrics       | 🟡 Mid    |
| 5   | Tôi có thể giải thích tại sao Agile thất bại khi management không trao quyền thực sự cho team — với ví dụ Cargo Cult Agile? | Agile         | 🔴 Senior |

💬 **Feynman Prompt:** Giải thích tại sao "I need 1 more week" said at deadline is worse than "I'm blocked, here's why" said on day 3 — và what the senior engineer does differently.

## Connections / Liên Kết

- ⬅️ **Built on**: [SDLC Practices](./03-sdlc-and-practices.md) — Scrum/Agile provides the ceremonies for PM
- ➡️ **Applied in**: [Code Quality](./05-code-quality-and-review.md) — technical debt is tracked in project backlog
- 🔗 **Related**: [System Design Framework](../../be-track/04-be-system-design/01-design-framework.md) — estimation skills are tested in system design interviews too
- 🔗 **Context**: [Company Guides](../07-company-guides/) — each company has different PM culture and expectations
