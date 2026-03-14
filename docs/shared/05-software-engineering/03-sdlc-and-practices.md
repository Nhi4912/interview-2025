# SDLC and Engineering Practices — Vòng đời phát triển và thực hành kỹ thuật

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)
> - `docs/fe-track/modules/11-testing-qa.md`
> - `docs/fe-track/modules/12-devops-tools.md`
> - `docs/be-track/01-golang/05-testing-profiling.md`
> - `docs/be-track/04-be-system-design/01-design-framework.md`

---

## 1. Waterfall — Waterfall trong SDLC

### 🟢 Q: What is Waterfall? `[Junior]`

**A:** Mô hình tuần tự: mỗi pha hoàn tất mới sang pha tiếp theo.

**Khi phù hợp:**
- Waterfall: hợp đồng cố định, audit chặt, thay đổi ít.
- Agile/Scrum/Kanban: sản phẩm cần học nhanh từ người dùng.

**Rủi ro cần quản lý:**
- Scope creep, thiếu Definition of Done, feedback loop chậm.
- Thiếu ownership và ceremony hình thức.

```text
Ideas -> Backlog -> Build -> Validate -> Release -> Learn
             ^                                 |
             +------------- feedback ----------+
```


## 2. Agile — Agile trong SDLC

### 🟢 Q: What is Agile? `[Junior]`

**A:** Tư duy lặp nhanh, phản hồi sớm, thích nghi thay đổi.

**Khi phù hợp:**
- Waterfall: hợp đồng cố định, audit chặt, thay đổi ít.
- Agile/Scrum/Kanban: sản phẩm cần học nhanh từ người dùng.

**Rủi ro cần quản lý:**
- Scope creep, thiếu Definition of Done, feedback loop chậm.
- Thiếu ownership và ceremony hình thức.

```text
Ideas -> Backlog -> Build -> Validate -> Release -> Learn
             ^                                 |
             +------------- feedback ----------+
```


## 3. Scrum — Scrum trong SDLC

### 🟡 Q: What is Scrum? `[Mid]`

**A:** Framework Agile với vai trò, nghi thức và artifacts rõ ràng.

**Khi phù hợp:**
- Waterfall: hợp đồng cố định, audit chặt, thay đổi ít.
- Agile/Scrum/Kanban: sản phẩm cần học nhanh từ người dùng.

**Rủi ro cần quản lý:**
- Scope creep, thiếu Definition of Done, feedback loop chậm.
- Thiếu ownership và ceremony hình thức.

```text
Ideas -> Backlog -> Build -> Validate -> Release -> Learn
             ^                                 |
             +------------- feedback ----------+
```


## 4. Kanban — Kanban trong SDLC

### 🟡 Q: What is Kanban? `[Mid]`

**A:** Quản lý luồng công việc bằng pull system và WIP limit.

**Khi phù hợp:**
- Waterfall: hợp đồng cố định, audit chặt, thay đổi ít.
- Agile/Scrum/Kanban: sản phẩm cần học nhanh từ người dùng.

**Rủi ro cần quản lý:**
- Scope creep, thiếu Definition of Done, feedback loop chậm.
- Thiếu ownership và ceremony hình thức.

```text
Ideas -> Backlog -> Build -> Validate -> Release -> Learn
             ^                                 |
             +------------- feedback ----------+
```

---

## 5. Testing Strategies — Chiến lược kiểm thử

### 🟡 Q: What is the testing pyramid? `[Mid]`

**A:** Testing pyramid ưu tiên số lượng test theo tầng:
- Đáy: Unit tests (nhiều, nhanh, rẻ).
- Giữa: Integration tests (vừa phải, kiểm tra tương tác).
- Đỉnh: E2E tests (ít, chậm, mô phỏng user flow thật).

```text
        /\
       /E2E\
      /------\
     /Integration\
    /------------\
   /   Unit Tests  \
  /________________\
```

### 🟡 Q: How does TDD work? `[Mid]`

**A:**
1. **Red**: viết test mô tả behavior, chạy và thấy fail.
2. **Green**: viết code tối thiểu để pass.
3. **Refactor**: cải thiện design, giữ test xanh.

```ts
// Red
import { describe, it, expect } from 'vitest'
describe('sum', () => {
  it('adds two numbers', () => {
    expect(sum(1, 2)).toBe(3)
  })
})
```

### 🟡 Q: What is BDD (Given-When-Then)? `[Mid]`

**A:** BDD tập trung hành vi theo ngôn ngữ business, giúp PM/QA/Dev cùng hiểu acceptance criteria.

```gherkin
Given user has items in cart
When user applies a valid coupon
Then total price should be reduced by 10%
```

### 🔴 Q: Which test types should be in CI vs nightly? `[Senior]`

**A:**
- CI mỗi commit: unit + critical integration + smoke E2E.
- Nightly: full regression E2E, performance baseline, security scans sâu.
- Release gate: contract test, migration test, rollback test.

---

## 6. CI/CD — Tích hợp và triển khai liên tục

### 🟡 Q: What is Continuous Integration? `[Mid]`

**A:** CI là merge nhỏ và thường xuyên vào main branch, mọi thay đổi đều qua build/test tự động để phát hiện lỗi sớm.

### 🔴 Q: Continuous Delivery vs Continuous Deployment? `[Senior]`

**A:**
- Delivery: pipeline tự động đến trạng thái ready to release, deploy production còn approval thủ công.
- Deployment: pass pipeline là tự lên production không cần manual gate.

### 🟡 Q: What are common pipeline stages? `[Mid]`

**A:** build -> test -> package -> deploy staging -> verify -> deploy production -> monitor.

```yaml
stages:
  - build
  - test
  - stage
  - deploy
```

### 🔴 Q: How do feature flags, canary, blue-green reduce risk? `[Senior]`

**A:**
- Feature flag: tách deploy khỏi release, bật theo cohort.
- Canary: rollout dần 1% -> 5% -> 25% -> 100% dựa trên SLO.
- Blue-Green: 2 môi trường song song, switch traffic tức thời, rollback nhanh.

---

## 7. Code Review Best Practices — Thực hành review code

### 🟡 Q: What makes a high-quality code review? `[Mid]`

**A:**
- PR nhỏ, mục tiêu rõ, có test evidence.
- Reviewer tập trung correctness, security, maintainability trước style.
- Comment dạng gợi ý cụ thể, tôn trọng và có ngữ cảnh.
- Dùng checklist chuẩn để giảm bỏ sót.

**Review checklist mẫu:**
1. Logic đúng và xử lý edge case?
2. Có test bao phủ đường chính + đường lỗi?
3. Có nguy cơ security/performance/regression?
4. Có tuân thủ conventions (naming, layering, i18n)?
5. Có plan rollback/observability cho thay đổi rủi ro?

---

## 8. Technical Debt Management — Quản lý nợ kỹ thuật

### 🔴 Q: How should teams manage technical debt? `[Senior]`

**A:**
- Ghi nhận debt trong backlog với impact rõ (defects, cycle time, infra cost).
- Phân loại: deliberate debt vs accidental debt.
- Dành ngân sách capacity cố định mỗi sprint (ví dụ 15-20%).
- Trả nợ theo risk và leverage thay vì sở thích kỹ thuật.
- Theo dõi metric sau refactor để chứng minh hiệu quả.

| Debt Type | Ví dụ | Hướng xử lý |
|---|---|---|
| Code debt | Module quá lớn | Tách module + contract tests |
| Test debt | Thiếu regression tests | Bổ sung smoke + integration tests |
| Infra debt | Pipeline chậm 45 phút | Parallelize + cache + split stages |
| Docs debt | Onboarding mất 2 tuần | Viết runbook + architecture docs |

---

## 9. Documentation Practices — Thực hành tài liệu

### 🟢 Q: What documents should engineering teams maintain? `[Junior]`

**A:**
- README: setup + scripts + local run.
- ADR (Architecture Decision Record): quyết định kỹ thuật quan trọng.
- API contract: request/response/error codes/versioning.
- Runbook: xử lý incident và quy trình vận hành.
- Onboarding guide: kiến trúc, coding conventions, release flow.

### 🟡 Q: How to keep docs up to date? `[Mid]`

**A:**
- Docs-as-code: version control cùng code.
- PR template bắt buộc cập nhật docs khi thay đổi API/behavior.
- Định kỳ review docs stale bằng owner rõ ràng.
- Dùng examples executable để tránh drift.

---

## 10. Interview Q&A Bank — Bộ câu hỏi phỏng vấn

### 🟢 Q: What are core SDLC phases? `[Junior]`

**A:** Planning, analysis, design, implementation, testing, deployment, maintenance.

**Follow-up tốt trong phỏng vấn:**
- Đưa ví dụ từ dự án thật (team size, release cadence, incident).
- Nêu metric đo thành công: lead time, change failure rate, MTTR.
- Giải thích trade-off và vì sao chọn giải pháp đó.

### 🟢 Q: Waterfall phù hợp khi nào? `[Junior]`

**A:** Khi requirement ổn định, compliance cao, thay đổi thấp.

**Follow-up tốt trong phỏng vấn:**
- Đưa ví dụ từ dự án thật (team size, release cadence, incident).
- Nêu metric đo thành công: lead time, change failure rate, MTTR.
- Giải thích trade-off và vì sao chọn giải pháp đó.

### 🟡 Q: Scrum khác Kanban thế nào? `[Mid]`

**A:** Scrum làm việc theo sprint timebox; Kanban tối ưu continuous flow với WIP limits.

**Follow-up tốt trong phỏng vấn:**
- Đưa ví dụ từ dự án thật (team size, release cadence, incident).
- Nêu metric đo thành công: lead time, change failure rate, MTTR.
- Giải thích trade-off và vì sao chọn giải pháp đó.

### 🟡 Q: Testing pyramid có ý nghĩa gì? `[Mid]`

**A:** Đảm bảo phần lớn test ở unit level để nhanh và ổn định, ít test E2E hơn.

**Follow-up tốt trong phỏng vấn:**
- Đưa ví dụ từ dự án thật (team size, release cadence, incident).
- Nêu metric đo thành công: lead time, change failure rate, MTTR.
- Giải thích trade-off và vì sao chọn giải pháp đó.

### 🟡 Q: TDD Red-Green-Refactor là gì? `[Mid]`

**A:** Viết test fail trước, code tối thiểu để pass, rồi refactor an toàn.

**Follow-up tốt trong phỏng vấn:**
- Đưa ví dụ từ dự án thật (team size, release cadence, incident).
- Nêu metric đo thành công: lead time, change failure rate, MTTR.
- Giải thích trade-off và vì sao chọn giải pháp đó.

### 🔴 Q: Continuous Delivery vs Deployment? `[Senior]`

**A:** Delivery: luôn sẵn sàng release nhưng còn bước approve; Deployment: tự động lên production khi pass pipeline.

**Follow-up tốt trong phỏng vấn:**
- Đưa ví dụ từ dự án thật (team size, release cadence, incident).
- Nêu metric đo thành công: lead time, change failure rate, MTTR.
- Giải thích trade-off và vì sao chọn giải pháp đó.

### 🔴 Q: Blue-Green vs Canary chọn thế nào? `[Senior]`

**A:** Blue-Green tốt cho rollback nhanh nguyên cụm; Canary tốt để giảm rủi ro dần theo phần trăm traffic.

**Follow-up tốt trong phỏng vấn:**
- Đưa ví dụ từ dự án thật (team size, release cadence, incident).
- Nêu metric đo thành công: lead time, change failure rate, MTTR.
- Giải thích trade-off và vì sao chọn giải pháp đó.

### 🟡 Q: Code review checklist nên gồm gì? `[Mid]`

**A:** Correctness, readability, security, tests, observability, backward compatibility.

**Follow-up tốt trong phỏng vấn:**
- Đưa ví dụ từ dự án thật (team size, release cadence, incident).
- Nêu metric đo thành công: lead time, change failure rate, MTTR.
- Giải thích trade-off và vì sao chọn giải pháp đó.

### 🔴 Q: Technical debt quản lý ra sao? `[Senior]`

**A:** Đo debt, ưu tiên theo impact, trả nợ định kỳ trong sprint và gắn với outcome sản phẩm.

**Follow-up tốt trong phỏng vấn:**
- Đưa ví dụ từ dự án thật (team size, release cadence, incident).
- Nêu metric đo thành công: lead time, change failure rate, MTTR.
- Giải thích trade-off và vì sao chọn giải pháp đó.

---

## 11. Final revision checklist — Checklist cuối

- [ ] Giải thích được Waterfall, Agile, Scrum, Kanban cùng use-case.
- [ ] Mô tả được testing pyramid và vị trí của unit/integration/E2E.
- [ ] Phân biệt Delivery và Deployment.
- [ ] Nắm các chiến lược release an toàn (feature flag/canary/blue-green).
- [ ] Trình bày được cách quản lý technical debt bằng dữ liệu.
- [ ] Biết cách thiết lập code review checklist hiệu quả.

---

## 12. Scrum Deep Dive — Đi sâu vào Scrum

### 🟡 Q: What are Scrum roles and responsibilities? `[Mid]`

**A:**
- Product Owner: tối ưu giá trị sản phẩm, quản lý Product Backlog.
- Scrum Master: giúp team vận hành Scrum đúng tinh thần, gỡ blocker.
- Developers: cross-functional team xây increment có thể release.

### 🟡 Q: What ceremonies should produce? `[Mid]`

**A:**
| Ceremony | Mục tiêu | Đầu ra mong đợi |
|---|---|---|
| Sprint Planning | Chọn mục tiêu sprint | Sprint Goal + Sprint Backlog |
| Daily Scrum | Đồng bộ tiến độ 24h | Plan cho 24h tiếp theo |
| Sprint Review | Nhận feedback stakeholder | Backlog adjustments |
| Sprint Retrospective | Cải tiến quy trình | Action items rõ owner |

### 🔴 Q: What makes Scrum fail in practice? `[Senior]`

**A:**
- Sprint goal mơ hồ hoặc đổi liên tục.
- Team thiếu Definition of Done rõ ràng.
- PO không có quyền ưu tiên backlog thực sự.
- Retro không có hành động theo dõi đến cùng.

**Healthy Scrum signals:**
- Sprint goals gắn product outcomes.
- WIP vừa phải, completion rate ổn định.
- Bug escaped production giảm theo thời gian.

## 13. Kanban Flow Metrics — Đo lường luồng công việc

### 🟡 Q: Which Kanban metrics are most useful? `[Mid]`

**A:**
- Lead Time: từ lúc ticket tạo đến khi hoàn tất.
- Cycle Time: từ lúc bắt đầu làm đến khi hoàn tất.
- Throughput: số item hoàn tất mỗi đơn vị thời gian.
- WIP: số item đang làm đồng thời.
- Flow Efficiency: tỷ lệ thời gian active / tổng thời gian.

### 🔴 Q: How do WIP limits improve delivery? `[Senior]`

**A:** WIP limit giảm context switching, lộ bottleneck sớm và tăng predictability. Team hoàn thành việc đang mở trước khi kéo thêm việc mới.

```text
Backlog -> Ready -> In Progress (WIP=3) -> Review (WIP=2) -> Done
                 ^
     Pull only when capacity available
```

### 🔴 Q: What anti-patterns break Kanban? `[Senior]`

**A:**
- Cột board không phản ánh flow thật.
- WIP limit đặt nhưng không tuân thủ.
- Ticket quá to (không slice theo value).
- Không có service class và SLA phù hợp.

## 14. Test Strategy at Scale — Chiến lược test ở quy mô lớn

### 🟡 Q: How to design a balanced test portfolio? `[Mid]`

**A:**
- Unit tests bảo vệ domain logic.
- Integration tests bảo vệ contract giữa module/service.
- E2E tests bảo vệ critical user journey.
- Non-functional tests bảo vệ performance/security/reliability.

### 🔴 Q: What is test flakiness and how to reduce it? `[Senior]`

**A:** Flaky test là test pass/fail không ổn định dù code không đổi. Giảm flaky bằng cách bỏ sleep cứng, dùng condition-based waiting, cô lập state, seed data deterministically.

### 🔴 Q: Contract testing fits where in pyramid? `[Senior]`

**A:** Contract tests nằm giữa integration và E2E: đủ tin cậy để kiểm tra producer-consumer compatibility, nhanh hơn E2E toàn hệ thống.

```ts
// minimal contract-like assertion sketch
type UserResponse = { id: string; email: string }
const isUserResponse = (x: unknown): x is UserResponse => {
  if (typeof x !== 'object' || x === null) return false
  const v = x as Record<string, unknown>
  return typeof v.id === 'string' && typeof v.email === 'string'
}
```

### 🟡 Q: Performance test nên chạy khi nào? `[Mid]`

**A:**
- Smoke performance: trong CI cho critical endpoint.
- Load/stress test: pre-release hoặc theo lịch.
- Capacity planning: trước campaign traffic lớn.

| Test Type | Frequency | Mục tiêu |
|---|---|---|
| Unit | Mỗi commit | Phát hiện lỗi logic nhanh |
| Integration | Mỗi commit/PR | Đảm bảo module tương tác đúng |
| E2E smoke | Mỗi merge vào main | Bảo vệ luồng chính |
| Full E2E | Nightly | Regression toàn diện |
| Performance | Nightly/Release | SLO, capacity |
| Security scan | Nightly/Release | Vulnerability drift |

## 15. CI/CD Implementation Playbook — Playbook triển khai

### 🟡 Q: What should a mature CI pipeline include? `[Mid]`

**A:**
1. Lint + format checks.
2. Type checks / static analysis.
3. Unit/integration tests song song.
4. Build artifact reproducible.
5. Security scan (dependency + secrets).
6. Provenance/signing nếu yêu cầu supply-chain.

### 🔴 Q: How to keep pipeline fast and reliable? `[Senior]`

**A:**
- Chạy song song jobs độc lập.
- Cache dependency/build layers đúng cách.
- Split pipeline theo critical path vs exhaustive path.
- Quarantine flaky tests và fix ưu tiên.
- Dùng ephemeral environments cho integration tests.

### 🔴 Q: What are safe deployment gates? `[Senior]`

**A:**
- Automated checks: tests + SAST + migration dry-run.
- Progressive rollout: canary với health metrics gate.
- Automated rollback trigger theo error budget burn.
- Manual approval cho change high-risk/compliance.

```yaml
pipeline:
  ci:
    - lint
    - typecheck
    - test
    - build
  cd:
    - deploy_staging
    - smoke_test
    - canary_5_percent
    - canary_25_percent
    - full_rollout
```

### 🟡 Q: Feature flags governance cần gì? `[Mid]`

**A:**
- Mỗi flag có owner + expiry date.
- Naming convention rõ ràng theo domain.
- Audit log cho thay đổi trạng thái flag.
- Dọn dẹp flag cũ để tránh complexity lâu dài.

## 16. Incident Learning & Postmortems — Học từ sự cố

### 🔴 Q: Why are blameless postmortems important? `[Senior]`

**A:** Postmortem không đổ lỗi giúp team tập trung vào nguyên nhân hệ thống và cải tiến quy trình, từ đó giảm lặp lại sự cố.

### 🔴 Q: What should a good postmortem include? `[Senior]`

**A:**
- Timeline rõ mốc thời gian (detect, mitigate, resolve).
- Impact định lượng (users affected, revenue, SLA breach).
- Root cause + contributing factors.
- Corrective actions với owner + deadline.
- Follow-up review xác nhận action đã hoàn thành.

| Section | Nội dung bắt buộc |
|---|---|
| Summary | Sự cố gì, phạm vi ảnh hưởng |
| Detection | Cách phát hiện, thời gian phát hiện |
| Response | Cách xử lý, ai phối hợp |
| Root Cause | Kỹ thuật + quy trình + tổ chức |
| Actions | Preventive + detective improvements |

### 🟡 Q: SRE metrics liên quan SDLC thế nào? `[Mid]`

**A:** DORA + SLO giúp đo chất lượng delivery: deploy nhanh nhưng lỗi nhiều thì chưa tốt. Cần cân bằng speed và stability.

**Key metrics:**
- Deployment Frequency
- Lead Time for Changes
- Change Failure Rate
- Mean Time to Restore
- Error budget burn rate

## 17. Extended Interview Q&A — Bộ câu hỏi mở rộng

### 🟢 Q: Why do teams need Definition of Done? `[Junior]`

**A:** DoD tạo tiêu chuẩn hoàn tất thống nhất: code review xong, tests pass, docs cập nhật, monitoring ready.

### 🟢 Q: Agile manifesto values là gì (tóm tắt)? `[Junior]`

**A:** Ưu tiên con người và tương tác, phần mềm chạy được, hợp tác khách hàng, và phản hồi với thay đổi.

### 🟡 Q: Sprint Planning output tốt trông như thế nào? `[Mid]`

**A:** Có Sprint Goal rõ, backlog item đã estimate/slice hợp lý, dependency được nhận diện, capacity tính thực tế.

### 🟡 Q: Làm sao giảm PR review cycle time? `[Mid]`

**A:** Giữ PR nhỏ, checklist chuẩn, auto checks đầy đủ, luân phiên reviewer, ưu tiên comment blocking rõ lý do.

### 🟡 Q: Khi nào nên thêm E2E test mới? `[Mid]`

**A:** Khi đó là luồng business critical, có lịch sử regression, hoặc cần kiểm chứng integration xuyên nhiều thành phần.

### 🔴 Q: Làm sao cân bằng delivery speed và quality? `[Senior]`

**A:** Thiết lập guardrails tự động (CI gates, rollout controls), metric-driven governance, và cải tiến liên tục qua retros + postmortem.

### 🔴 Q: Technical debt có nên luôn ưu tiên thấp hơn feature? `[Senior]`

**A:** Không. Debt có thể ảnh hưởng trực tiếp doanh thu/tốc độ release/risk incident; cần ưu tiên theo impact định lượng, không theo nhãn.

### 🔴 Q: What is a pragmatic release strategy for high-risk changes? `[Senior]`

**A:** Dark launch + feature flags + canary + synthetic monitoring + auto rollback + incident runbook sẵn sàng.

### 🔴 Q: How would you answer Tell me about a process improvement you led? `[Senior]`

**A:** Dùng STAR và thêm số liệu trước/sau: ví dụ giảm pipeline time từ 30p xuống 12p, tăng deploy frequency 3x, giảm CFR từ 18% còn 7%.

---

## 18. Practical Templates — Mẫu thực hành nhanh

### 🟡 Q: Example PR template sections? `[Mid]`

**A:**
```markdown
## Summary
## Why this change
## Test evidence
## Rollout plan
## Rollback plan
## Docs updated
```

### 🟡 Q: Example Definition of Done template? `[Mid]`

**A:**
- [ ] Acceptance criteria đạt.
- [ ] Unit/integration tests pass.
- [ ] Security considerations reviewed.
- [ ] Monitoring/alert cập nhật.
- [ ] Docs/runbook cập nhật nếu cần.

### 🔴 Q: Example technical debt register fields? `[Senior]`

**A:**
| Field | Ý nghĩa |
|---|---|
| Debt ID | Mã theo dõi |
| Category | Code/Test/Infra/Docs |
| Impact | Cost/risk/chậm delivery |
| Interest | Mức tăng chi phí theo thời gian |
| Owner | Người chịu trách nhiệm |
| Target sprint | Kế hoạch xử lý |
| Success metric | Cách đo hiệu quả sau khi trả nợ |


---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What is the difference between Agile and Scrum? / Agile và Scrum khác nhau thế nào? 🟢 Junior

**A:** **Agile** is a *philosophy* (Agile Manifesto values). **Scrum** is a *framework* that implements Agile with specific roles, events, and artifacts.

```
Agile Manifesto values:
- Individuals and interactions OVER processes and tools
- Working software OVER comprehensive documentation
- Customer collaboration OVER contract negotiation
- Responding to change OVER following a plan

Scrum (implements Agile):
Roles: Product Owner, Scrum Master, Dev Team
Events: Sprint (2-4w), Planning, Daily Standup, Review, Retro
Artifacts: Product Backlog, Sprint Backlog, Increment
```

Vietnamese explanation: Agile = "why" và "what values." Scrum/Kanban = "how" to implement. Scrum cần mature team, clear PO, good refinement. Kanban tốt hơn cho support/maintenance work (flow-based, không theo sprint). Điểm quan trọng: demonstrate understanding of *principles* (deliver value, adapt, collaborate) không chỉ ceremonies.

---

### Q: What is CI/CD and what are the key pipeline stages? / CI/CD và các stages chính? 🟡 Mid

**A:** **CI** (Continuous Integration): auto build+test on every push. **CD** (Continuous Delivery): auto deploy to staging. **CD** (Deployment): auto deploy to production on every passing build.

```
Pipeline stages:
Source → Build → Test → Security → Staging → Smoke → Prod → Monitor

Key metrics (DORA):
Lead time: commit → production (elite: < 1 hour)
Deployment frequency: (elite: multiple/day)
MTTR: mean time to restore (elite: < 1 hour)
Change failure rate: % causing incidents (elite: < 5%)
```

Deployment strategies: **Blue/Green** (2 identical envs, swap traffic). **Canary** (gradually route % to new version). **Feature flags** (deploy without activating feature).

Vietnamese explanation: DORA 4 metrics là standard measure DevOps performance. Elite performers: deploy nhiều lần/ngày. Feature flags = decouple deploy từ release (ship code, turn on later). Tools: GitHub Actions, GitLab CI, ArgoCD (GitOps). "Shift left": security testing earlier in pipeline (SAST in CI, not just prod scan).

---

## Interview Q&A Summary / Tổng Kết

| Question | Level | Key Point |
|----------|-------|-----------|
| Agile vs Scrum | 🟢 | Agile=philosophy; Scrum=framework; understand principles over ceremonies |
| CI/CD pipeline | 🟡 | Build→test→security→staging→prod; DORA metrics; blue/green/canary |
