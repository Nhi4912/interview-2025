# L5 Senior Engineer Self-Assessment / Tự Đánh Giá Năng Lực L5

> **Track**: Shared | **L5 Weight**: 100pts total
> **See also**: [Quick Start Guide](../../00-quick-start-guide.md) | [FE Roadmap](../../fe-track/00-study-roadmap.md) | [BE Roadmap](../../be-track/00-study-roadmap.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn chuẩn bị phỏng vấn vị trí Senior Engineer (L5) tại một công ty tech. Interviewer không chỉ test kiến thức kỹ thuật — họ đánh giá 10 năng lực khác nhau. Nhiều ứng viên giỏi technical nhưng fail vì yếu communication hoặc không thể articulate scope of impact.

Assessment này giúp bạn identify chính xác đang yếu ở đâu và cần focus vào gì.

---

## Framework / Khung Đánh Giá

### Scoring Scale (0-4 per competency)

| Score | Level          | Description                                                          |
| ----- | -------------- | -------------------------------------------------------------------- |
| 0     | **Absent**     | Chưa có kinh nghiệm hoặc kiến thức trong lĩnh vực này                |
| 1     | **Basic**      | Biết khái niệm cơ bản, chưa áp dụng được trong thực tế               |
| 2     | **Developing** | Đã áp dụng nhưng cần hướng dẫn, chưa tự chủ                          |
| 3     | **Proficient** | Tự chủ, có thể giải thích và demonstrate trong phỏng vấn             |
| 4     | **Expert**     | Có depth + breadth, có stories thuyết phục, có thể mentor người khác |

### Weighted Score Formula

```
Final Score = Σ (competency_score / 4 × weight)
```

**Target**: ≥ 70/100 để tự tin vào vòng phỏng vấn L5.

---

## Self-Assessment Rubric / Bảng Tự Đánh Giá

> **Hướng dẫn**: Đọc mô tả từng level, chọn score phù hợp nhất với năng lực hiện tại.
> Trung thực — đây là tool để tìm gaps, không phải để tự an ủi.

### 1. Scope & Impact (Weight: 15 points)

| Score | Behaviour                                                                                               |
| ----- | ------------------------------------------------------------------------------------------------------- |
| 0     | Chỉ làm task được assign, không hiểu big picture                                                        |
| 1     | Hiểu feature mình làm, nhưng không biết nó ảnh hưởng gì đến hệ thống                                    |
| 2     | Owns 1 feature end-to-end, hiểu upstream/downstream dependencies                                        |
| 3     | Owns major features, tự decompose ambiguous requirements, communicate trade-offs với PM                 |
| 4     | Shapes scope across multiple features, removes bottlenecks cho cả team, handles ambiguity independently |

**Your score**: **_/4 → Weighted: _** × 15/4 = \_\_\_/15

**Câu hỏi kiểm tra**:

- Kể 1 feature bạn own end-to-end. Bạn đã phải đưa ra những quyết định gì?
- Khi nhận requirement mơ hồ, bạn làm gì đầu tiên?
- Có bao giờ bạn từ chối scope hoặc đề xuất scope khác với PM không?

**Study**: [Scope & Impact](./01-scope-and-impact.md) (upcoming)

---

### 2. Problem-Solving (Weight: 15 points)

| Score | Behaviour                                                                                                          |
| ----- | ------------------------------------------------------------------------------------------------------------------ |
| 0     | Stuck khi gặp bài mới, không biết bắt đầu từ đâu                                                                   |
| 1     | Giải được Easy problems, nhưng Medium thường cần hint                                                              |
| 2     | Giải Medium tự tin, Hard cần thời gian, structured thinking khi debug                                              |
| 3     | Giải Hard problems, predict risks trước khi code, helps juniors reframe problems                                   |
| 4     | Tackles complex integrations, anticipates edge cases từ requirements, designs solutions that reduce long-term cost |

**Your score**: **_/4 → Weighted: _** × 15/4 = \_\_\_/15

**Câu hỏi kiểm tra**:

- Gặp bài LeetCode chưa từng thấy, quy trình tư duy của bạn là gì?
- Kể 1 lần bạn predict risk trước khi nó xảy ra trong project.
- Bạn đã bao giờ redesign solution của người khác vì thấy vấn đề tiềm ẩn?

**Study**: [Problem-Solving Frameworks](./02-problem-solving-frameworks.md) (upcoming) | [LeetCode Patterns](../../leetcode/00-patterns-index.md)

---

### 3. Technical / Domain Mastery (Weight: 20 points)

| Score | Behaviour                                                                                                                      |
| ----- | ------------------------------------------------------------------------------------------------------------------------------ |
| 0     | Biết syntax, copy-paste từ Stack Overflow                                                                                      |
| 1     | Hiểu basic concepts (closures, hooks, HTTP), nhưng shallow                                                                     |
| 2     | Hiểu internals (event loop, reconciliation, TCP), có thể debug production issues                                               |
| 3     | Deep expertise trong core area, set quality bar cho code review, shapes architectural decisions                                |
| 4     | Recognized expert, introduces reusable standards, reviews with precision covering architecture + performance + maintainability |

**Your score**: **_/4 → Weighted: _** × 20/4 = \_\_\_/20

**Câu hỏi kiểm tra**:

- Giải thích React reconciliation algorithm cho junior trong 2 phút.
- Bạn review PR thì tìm kiếm những gì ngoài correctness?
- Core area chuyên sâu nhất của bạn là gì? Bạn đã đóng góp gì cho team trong area đó?

**Study**: [JavaScript](../../fe-track/01-javascript/) | [React](../../fe-track/03-react/) | [TypeScript](../../fe-track/02-typescript/) | [System Design](../../fe-track/08-fe-system-design/)

---

### 4. Communication (Weight: 10 points)

| Score | Behaviour                                                                             |
| ----- | ------------------------------------------------------------------------------------- |
| 0     | Không giải thích được technical decisions                                             |
| 1     | Giải thích được cho engineers, nhưng khó nói với non-technical people                 |
| 2     | Communicate rõ ràng trong team, viết docs khi được yêu cầu                            |
| 3     | Facilitates discussions, documents decisions proactively, communicates risks early    |
| 4     | Drives cross-team clarity, writes RFCs/ADRs, presents technical proposals confidently |

**Your score**: **_/4 → Weighted: _** × 10/4 = \_\_\_/10

**Câu hỏi kiểm tra**:

- Kể 1 lần bạn phải giải thích technical decision cho PM/designer.
- Bạn đã bao giờ viết RFC hoặc design doc? Nó được response thế nào?
- Khi thấy risk trong project, bạn communicate thế nào?

**Study**: [Communication](./04-communication.md) (upcoming) | [Storytelling](../../shared/09-behavioral/04-storytelling.md)

---

### 5. Leadership — Team Level (Weight: 10 points)

| Score | Behaviour                                                                                 |
| ----- | ----------------------------------------------------------------------------------------- |
| 0     | Chưa mentor ai                                                                            |
| 1     | Trả lời câu hỏi khi được hỏi                                                              |
| 2     | Chủ động help juniors, nhưng chưa structured                                              |
| 3     | Mentors L3/L4 consistently, provides structured feedback, helps with estimation/planning  |
| 4     | Strong mentor + stabilizer, fosters psychological safety, handles conflict professionally |

**Your score**: **_/4 → Weighted: _** × 10/4 = \_\_\_/10

**Câu hỏi kiểm tra**:

- Bạn đã mentor ai? Kết quả thế nào?
- Cách bạn đưa feedback khi code review?
- Khi team có conflict, bạn xử lý thế nào?

**Study**: [Leadership & Mentoring](./05-leadership-and-mentoring.md) (upcoming) | [Leadership Principles](../../shared/09-behavioral/02-leadership-principles.md)

---

### 6. Ownership & Execution (Weight: 10 points)

| Score | Behaviour                                                                                             |
| ----- | ----------------------------------------------------------------------------------------------------- |
| 0     | Cần người khác theo dõi progress                                                                      |
| 1     | Deliver đúng hạn nếu requirements rõ ràng                                                             |
| 2     | Tự manage work, nhưng đôi khi có surprises                                                            |
| 3     | Autonomous delivery, no surprises cho PM/design/QA, handles ambiguity                                 |
| 4     | Drives ambiguous work to completion, predictable + stable delivery, accountable to outcomes not tasks |

**Your score**: **_/4 → Weighted: _** × 10/4 = \_\_\_/10

**Câu hỏi kiểm tra**:

- Kể 1 dự án ambiguous bạn đã drive to completion.
- Cách bạn estimate effort? Accuracy thế nào?
- Bạn đã bao giờ flag risk sớm và thay đổi approach?

**Study**: [Ownership & Execution](./06-ownership-and-execution.md) (upcoming)

---

### 7. Quality & Risk (Weight: 10 points)

| Score | Behaviour                                                                             |
| ----- | ------------------------------------------------------------------------------------- |
| 0     | Code chạy là được, ít test                                                            |
| 1     | Viết unit tests cho code của mình                                                     |
| 2     | Testing strategy cho features, catches regressions                                    |
| 3     | Sets team's quality bar, builds testing strategy, spots architectural risks early     |
| 4     | Reduces defects team-wide, implements guardrails, contributes heavily to QA workflows |

**Your score**: **_/4 → Weighted: _** × 10/4 = \_\_\_/10

**Câu hỏi kiểm tra**:

- Testing strategy của bạn là gì? Unit/Integration/E2E ratio?
- Bạn đã bao giờ introduce testing practice mới cho team?
- Kể 1 lần bạn phát hiện architectural risk trước khi nó gây bug.

**Study**: [Quality & Risk](./07-quality-and-risk.md) (upcoming) | [Testing Theory](../../shared/05-software-engineering/04-testing-theory.md)

---

### 8. Team Multiplier (Weight: 5 points)

| Score | Behaviour                                                                                           |
| ----- | --------------------------------------------------------------------------------------------------- |
| 0     | Làm việc cá nhân, không chia sẻ                                                                     |
| 1     | Chia sẻ knowledge khi được hỏi                                                                      |
| 2     | Viết docs, tạo shared utilities khi thấy cần                                                        |
| 3     | Builds reusable systems/patterns, improves workflows proactively                                    |
| 4     | Produces reusable systems that uplift team velocity, eliminates repeated mistakes at systemic level |

**Your score**: **_/4 → Weighted: _** × 5/4 = \_\_\_/5

**Study**: [Team Multiplier](./08-team-multiplier.md) (upcoming)

---

### 9. Behaviour & Professional Maturity (Weight: 3 points)

| Score | Behaviour                                                                    |
| ----- | ---------------------------------------------------------------------------- |
| 0     | Reactive, dễ frustrated                                                      |
| 1     | Professional trong điều kiện bình thường                                     |
| 2     | Calm under moderate pressure                                                 |
| 3     | Reliable, trusted by peers and leads                                         |
| 4     | Calm, principled under stress, models integrity, role model for team culture |

**Your score**: **_/4 → Weighted: _** × 3/4 = \_\_\_/3

---

### 10. Business Awareness (Weight: 2 points)

| Score | Behaviour                                                                                                          |
| ----- | ------------------------------------------------------------------------------------------------------------------ |
| 0     | Không biết product đang làm gì                                                                                     |
| 1     | Hiểu basic product features                                                                                        |
| 2     | Hiểu business context, user impact                                                                                 |
| 3     | Suggests alternatives that save time/cost, identifies misalignment early                                           |
| 4     | Understands revenue implications, contributes to roadmap discussions, frames technical proposals in business terms |

**Your score**: **_/4 → Weighted: _** × 2/4 = \_\_\_/2

**Study**: [Company Guides](../../shared/07-company-guides/)

---

## Score Summary / Tổng Kết Điểm

| #   | Competency         | Weight  | Score (0-4) | Weighted       |
| --- | ------------------ | ------- | ----------- | -------------- |
| 1   | Scope & Impact     | 15      | \_\_\_/4    | \_\_\_/15      |
| 2   | Problem-Solving    | 15      | \_\_\_/4    | \_\_\_/15      |
| 3   | Technical Mastery  | 20      | \_\_\_/4    | \_\_\_/20      |
| 4   | Communication      | 10      | \_\_\_/4    | \_\_\_/10      |
| 5   | Leadership         | 10      | \_\_\_/4    | \_\_\_/10      |
| 6   | Ownership          | 10      | \_\_\_/4    | \_\_\_/10      |
| 7   | Quality & Risk     | 10      | \_\_\_/4    | \_\_\_/10      |
| 8   | Team Multiplier    | 5       | \_\_\_/4    | \_\_\_/5       |
| 9   | Behaviour          | 3       | \_\_\_/4    | \_\_\_/3       |
| 10  | Business Awareness | 2       | \_\_\_/4    | \_\_\_/2       |
|     | **TOTAL**          | **100** |             | **\_\_\_/100** |

### Interpretation / Giải Thích Kết Quả

| Score Range | Readiness         | Action                                                    |
| ----------- | ----------------- | --------------------------------------------------------- |
| **80-100**  | Ready             | Focus vào mock interviews và polish weak spots            |
| **70-79**   | Nearly ready      | Fix 1-2 competency gaps, tăng cường behavioral prep       |
| **55-69**   | Developing        | Cần 4-8 weeks focused study trên weak areas               |
| **40-54**   | Early stage       | Bắt đầu từ Level 1, xây foundation trước                  |
| **< 40**    | Foundation needed | Focus 100% vào technical mastery trước khi lo soft skills |

---

## Gap Analysis / Phân Tích Khoảng Trống

Sau khi có score, sort competencies theo weighted score (thấp nhất lên trên). Top 3 competencies có score thấp nhất = study priorities của bạn.

### Priority Matrix

```
High Weight + Low Score = CRITICAL (study first)
High Weight + High Score = MAINTAIN (keep sharp)
Low Weight + Low Score = NICE-TO-HAVE (study if time permits)
Low Weight + High Score = STRENGTH (leverage in interviews)
```

### Common L5 Candidate Profiles

**Profile A — "Technical Machine"** (common for Vietnamese devs)

- Technical Mastery: 4/4 | Problem-Solving: 3/4
- Communication: 1/4 | Leadership: 1/4 | Scope: 2/4
- **Gap**: Soft skills. Action: Focus on behavioral prep + STAR stories.

**Profile B — "Good Engineer, Silent Leader"**

- Technical: 3/4 | Ownership: 3/4 | Quality: 3/4
- Communication: 2/4 | Scope: 2/4 | Leadership: 2/4
- **Gap**: Articulation. Action: Practice explaining decisions out loud, write design docs.

**Profile C — "Junior Trying to Level Up"**

- Technical: 2/4 | Problem-Solving: 2/4
- Everything else: 1/4
- **Gap**: Everything. Action: Start from Level 1, build foundation first.

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

> **Interviewer:** "How do you assess your own technical competency level? — explain it in 30 seconds."

**Ideal 30-second answer / Câu trả lời 30 giây:**

1. Self-assessment is systematically evaluating your skills across defined competency dimensions against clear level criteria.
2. At L5, you accurately calibrate strengths and gaps across 10+ competencies with concrete evidence backing each score.
3. For example: I score each competency 1–4, identify the bottom 3, then map each gap to a specific study resource or project.
4. In the interview, give a specific score from your self-assessment and back it up with a concrete project story.

---

## Self-Check / Tự Kiểm Tra

> **Đóng file này lại trước khi làm.**

- [ ] **Retrieval**: Viết 10 competencies từ trí nhớ + weight của từng cái. So sánh.
- [ ] **Visual**: Vẽ spider/radar chart từ scores của bạn. Hình dạng có balanced không?
- [ ] **Application**: Top 3 competencies yếu nhất → mỗi cái viết 1 action plan cụ thể (file nào cần đọc, bao lâu).
- [ ] **Debug**: Competency nào bạn tự đánh giá cao nhất? Có evidence (project, story) để back up không?
- [ ] **Teach**: Giải thích framework 10 competencies cho bạn bè đang chuẩn bị phỏng vấn — dùng ngôn ngữ đơn giản.

🔁 **Spaced Repetition:** Re-assess sau **30 ngày** study để track progress. So sánh scores cũ vs mới.

---

## Connections / Liên Kết

- ⬅️ **Entry point**: [Quick Start Guide](../../00-quick-start-guide.md)
- ➡️ **Next**: Study your lowest-scoring competency file in this directory
- 🔗 **Applied in**: Every interview round tests multiple competencies simultaneously
