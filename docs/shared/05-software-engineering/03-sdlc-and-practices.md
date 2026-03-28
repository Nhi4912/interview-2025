# SDLC and Engineering Practices — Vòng đời phát triển và thực hành kỹ thuật

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)
>
> - `docs/fe-track/modules/11-testing-qa.md`
> - `docs/fe-track/modules/12-devops-tools.md`
> - `docs/be-track/01-golang/05-testing-profiling.md`
> - `docs/be-track/04-be-system-design/01-design-framework.md`

---

## Real-World Scenario / Tình Huống Thực Tế

**Employment Hero CI/CD incident:** Team deploy hotfix lúc 4pm thứ 6 mà không có CI pipeline — tests bị skip "vì khẩn cấp". Kết quả: regression bug xuất hiện lúc 5pm, team phải hotfix lại, deploy thủ công, broken lại lần nữa. 3 giờ incident vào cuối tuần. Sau đó: tất cả deployments bắt buộc phải qua CI pipeline kể cả hotfix (pipeline chạy 8 phút). Câu thần chú: "Never skip CI, even for hotfixes — especially for hotfixes."

**Bài học:** SDLC practices không phải overhead — chúng là safety net. CI/CD, code review, và automated tests tốn 30% thời gian build nhưng tiết kiệm 300% thời gian sửa bugs production.

## What & Why / Cái Gì & Tại Sao

**Analogy:** SDLC giống quy trình sản xuất ô tô: Waterfall như chế tạo xong cả xe mới test (risk: đúc sai toàn bộ khung). Agile như chế tạo theo module, test từng phần (safer). CI/CD như dây chuyền lắp ráp tự động: mỗi commit = một xe được test ngay trên dây chuyền trước khi xuất xưởng.

**Why it matters:** Senior engineers được hỏi về SDLC, Agile, và CI/CD trong behavioral interviews. Không hiểu "tại sao" các practices này tồn tại → trả lời thiếu chiều sâu.

---

## 1. Waterfall — Waterfall trong SDLC

> 🧠 **Memory Hook:** "Xây nhà theo bản vẽ — thay đổi giữa chừng thì phải đục tường"

**Tại sao tồn tại? / Why does this exist?**

Các dự án lớn cần kế hoạch hoàn chỉnh trước khi thực thi để tránh lãng phí nguồn lực. → **Why?** Vì thay đổi giữa chừng tốn kém hơn nhiều so với thay đổi lúc thiết kế. → **Why?** Vì chi phí sửa lỗi tăng theo hàm mũ — lỗi ở phase Requirements sửa mất 1 ngày, lỗi tương tự ở Production sửa mất 100 ngày.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng bạn xây một ngôi nhà. Bạn phải lên bản vẽ đầy đủ trước, rồi mới đổ móng, xây tường, lợp mái — theo đúng thứ tự đó, không thể đảo ngược. Nếu sau khi xây tường xong bạn mới nói "ơ tôi muốn thêm cửa sổ", bạn phải đục tường, rất tốn kém. Waterfall hoạt động y như vậy: mỗi phase phải hoàn tất 100% trước khi chuyển sang phase tiếp theo. Đây là lý do nó hoạt động tốt khi bản thiết kế hoàn hảo ngay từ đầu, nhưng thất bại thảm hại khi yêu cầu thay đổi.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

1. **Requirements** → Thu thập và đóng băng toàn bộ yêu cầu
2. **Design** → Thiết kế kiến trúc đầy đủ trước khi code
3. **Implementation** → Code theo đúng thiết kế đã duyệt
4. **Verification** → Test toàn hệ thống sau khi code xong
5. **Maintenance** → Bàn giao, vận hành, sửa lỗi

```text
[Requirements] → [Design] → [Implementation] → [Verification] → [Maintenance]
      ↓                                                ↓
   (frozen)                                   (feedback quá muộn)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- ✅ Phù hợp: government contracts, FDA-regulated medical devices, embedded firmware với hardware cố định
- ❌ Thất bại khi: requirements mơ hồ, user feedback cần sớm, thị trường thay đổi nhanh
- ⚠️ Feedback từ user chỉ đến vào cuối dự án — quá muộn để thay đổi căn bản
- 🔄 Chi phí thay đổi ở phase cuối gấp 100× so với phase Requirements

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                        | Tại sao sai                                            | Đúng là                                  |
| ------------------------------ | ------------------------------------------------------ | ---------------------------------------- |
| Dùng Waterfall cho startup MVP | Requirement thay đổi liên tục → toàn bộ work bị ném đi | Dùng Agile để validate nhanh với user    |
| Bỏ qua documentation phase     | Không có tài liệu → handover và maintenance thất bại   | Docs là deliverable bắt buộc ở mỗi phase |
| Coi "phase done" khi code xong | Code chưa test + review = chưa done                    | Done = code + test + review + sign-off   |

**🎯 Interview Pattern:**

- Khi thấy: "Khi nào nên chọn Waterfall?" → Nhớ đến: requirements ổn định, compliance cao, thay đổi thấp → Mở đầu: "Waterfall phù hợp khi requirements được đóng băng từ đầu — ví dụ dự án chính phủ hoặc medical device — nhưng tôi vẫn thêm review checkpoints giữa các phases."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [System Design Framework](../../be-track/04-be-system-design/01-design-framework.md)
- ➡️ Để hiểu tiếp: [Agile](#2-agile--agile-trong-sdlc)

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

> 🧠 **Memory Hook:** "Nấu ăn nếm thử liên tục — không đợi đến lúc dọn bàn mới biết nhạt"

**Tại sao tồn tại? / Why does this exist?**

Phần mềm thường không biết trước được mọi yêu cầu — user chỉ biết họ muốn gì khi thấy sản phẩm chạy. → **Why?** Vì Waterfall giao sản phẩm sai sau 12 tháng, còn Agile giao sản phẩm đúng hướng sau 2 tuần. → **Why?** Vì giá trị thật của phần mềm chỉ lộ ra khi user thực sự dùng — không phải khi đọc spec.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng bạn nấu một nồi phở. Thay vì nấu xong cả nồi rồi mới cho khách nếm, bạn múc một chút nước dùng ra, cho khách thử ngay. Khách nói "hơi nhạt", bạn thêm muối liền. Agile làm đúng như vậy: xây một tính năng nhỏ, cho user dùng thử, lắng nghe feedback, điều chỉnh — rồi lặp lại. Không bao giờ đợi "xong hết" mới hỏi ý kiến.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```text
   Plan → Build → Test → Review
     ↑                      |
     +------- Feedback -----+
          (mỗi 1-4 tuần)
```

1. **Sprint/Iteration**: làm việc trong khung thời gian ngắn (1-4 tuần)
2. **Backlog**: danh sách việc cần làm, ưu tiên liên tục theo value
3. **Inspect & Adapt**: sau mỗi sprint, xem lại và điều chỉnh hướng đi
4. **Collaboration**: team + stakeholder cộng tác hàng ngày, không qua docs dày

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- ✅ Phù hợp: SaaS products, mobile apps, startup MVPs với user feedback loop nhanh
- ❌ Khó áp dụng: dự án compliance cao cần audit trail cho từng quyết định
- ⚠️ "Agile" bị hiểu sai thành "không cần plan" → dẫn đến chaos, không phải agility
- 🔄 Agile là mindset, không phải process — Scrum/Kanban là các implementation cụ thể

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                           | Tại sao sai                                                       | Đúng là                                             |
| --------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------- |
| "Agile = không cần documentation" | Agile values working software OVER docs, không có nghĩa zero docs | Docs quan trọng, chỉ là không over-document         |
| Sprint planning chỉ 10 phút       | Thiếu planning → sprint goal mơ hồ → team mất hướng               | Planning kỹ, slice story nhỏ, có Definition of Done |
| Coi Agile = Scrum                 | Agile là giá trị; Scrum/Kanban là framework triển khai            | Chọn framework phù hợp với context của team         |

**🎯 Interview Pattern:**

- Khi thấy: "Agile và Scrum khác nhau thế nào?" → Nhớ đến: Agile = philosophy/values, Scrum = framework → Mở đầu: "Agile là tập hợp giá trị từ Agile Manifesto; Scrum là một trong nhiều frameworks để hiện thực hoá những giá trị đó."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Waterfall](#1-waterfall--waterfall-trong-sdlc)
- ➡️ Để hiểu tiếp: [Scrum](#3-scrum--scrum-trong-sdlc)

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

> 🧠 **Memory Hook:** "Sprint như chạy bộ 400m — biết rõ đích, chạy hết sức, nghỉ rồi chạy tiếp"

**Tại sao tồn tại? / Why does this exist?**

Agile cần cấu trúc cụ thể để team thực hiện được — không thể chỉ nói "hãy linh hoạt". → **Why?** Vì team cần rituals và roles rõ ràng để phối hợp hiệu quả mà không cần micromanagement. → **Why?** Vì sự rõ ràng về trách nhiệm và cadence loại bỏ ambiguity — nguồn gốc của hầu hết miscommunication trong team.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng một đội chạy tiếp sức. Mỗi người biết rõ mình chạy đoạn nào (Sprint Backlog), ai cầm gậy tiếp sức (Product Owner giao việc), ai huấn luyện kỹ thuật chạy (Scrum Master). Sau mỗi vòng chạy (Sprint), cả đội họp lại: "Vòng này chúng ta chạy tốt chỗ nào? Cần cải thiện gì?" Cứ 2 tuần lại chạy một vòng như thế, liên tục.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```text
Product Backlog → Sprint Planning → Sprint (2 tuần) → Sprint Review → Retro
                        ↑                                    |
                        +------------ feedback loop ---------+

Roles:
  Product Owner: WHAT to build (priority, value)
  Scrum Master:  HOW team works (process, blockers)
  Developers:    HOW to build (technical decisions)
```

1. **Sprint Planning**: chọn story từ backlog, tạo Sprint Goal rõ ràng
2. **Daily Scrum**: sync 15 phút (xong gì, làm gì tiếp, có blocker không)
3. **Sprint Review**: demo cho stakeholder, thu feedback thực tế
4. **Retrospective**: cải tiến quy trình nội bộ team, có action items

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- ✅ Tốt nhất khi: team 5-9 người, PO có authority thật sự, backlog được refinement đều đặn
- ❌ Thất bại khi: Sprint goal thay đổi giữa chừng, PO không có thời gian, Daily Scrum thành status report
- ⚠️ "Scrum but" — làm Scrum nhưng bỏ Retro, bỏ Definition of Done → mất hầu hết lợi ích
- 🔄 Scrum không tốt cho support/maintenance work có nhiều interrupts — Kanban phù hợp hơn

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                   | Tại sao sai                                                 | Đúng là                                                     |
| ----------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| Daily Scrum = báo cáo tiến độ cho manager | Mục đích là team sync, không phải management reporting      | Daily là của team — Scrum Master facilitate, không phán xét |
| Không có Definition of Done               | Story "done" theo mỗi người một kiểu → quality inconsistent | DoD rõ: code review + tests pass + docs + monitoring ready  |
| Sprint planning không slice story nhỏ     | Story quá lớn → không complete trong sprint → velocity giả  | Story phải fit trong 1-3 ngày, có acceptance criteria rõ    |

**🎯 Interview Pattern:**

- Khi thấy: "Scrum và Kanban khác nhau thế nào?" → Nhớ đến: Scrum = timebox sprints + roles cố định; Kanban = continuous flow + WIP limits → Mở đầu: "Scrum tổ chức công việc theo sprint timebox với roles rõ ràng; Kanban tối ưu continuous flow và phù hợp hơn cho support work không đều."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Agile](#2-agile--agile-trong-sdlc)
- ➡️ Để hiểu tiếp: [Kanban](#4-kanban--kanban-trong-sdlc)

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

> 🧠 **Memory Hook:** "Bảng ghi việc nhà — không nhận việc mới khi chưa xong việc cũ"

**Tại sao tồn tại? / Why does this exist?**

Không phải mọi công việc đều có thể plan trước theo sprint — bug reports, support tickets, ops tasks đến bất ngờ. → **Why?** Vì context switching giữa nhiều task song song làm giảm throughput đáng kể. → **Why?** Vì WIP limit buộc team focus hoàn thành trước khi nhận thêm, lộ ra bottleneck thật sự thay vì giấu chúng.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng bảng ghi việc nhà của cả gia đình. Có 3 cột: "Cần làm", "Đang làm", "Xong". Quy tắc vàng: cột "Đang làm" không được có quá 3 việc cùng lúc. Nếu có người muốn thêm việc mới vào "Đang làm", trước tiên phải hoàn thành một việc đang dở. Không có "sprint" — việc nào đến thì làm, hoàn thành rồi kéo việc tiếp theo vào.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```text
Backlog → Ready → In Progress (WIP=3) → Review (WIP=2) → Done
                       ↑
            Kéo khi có capacity (pull system, không phải push)
            Ưu tiên theo class of service: urgent / normal / fixed date
```

Metrics Kanban quan tâm:

1. **Lead Time**: ticket tạo → hoàn tất (measure từ góc nhìn customer)
2. **Cycle Time**: bắt đầu làm → hoàn tất (measure từ góc nhìn team)
3. **Throughput**: số ticket done/tuần (dự đoán capacity)
4. **WIP**: số ticket đang in-flight (kiểm soát chaos)

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- ✅ Phù hợp: support teams, ops, maintenance, bug triage — bất kỳ work nào có arrival rate không đều
- ❌ Thiếu cadence rõ ràng → thiếu accountability nếu team không self-disciplined
- ⚠️ WIP limit đặt ra nhưng không tuân thủ = Kanban board chỉ là decoration, không có giá trị
- 🔄 Kanban không có sprint planning → thiếu alignment về product direction dài hạn

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                        | Tại sao sai                                                      | Đúng là                                                    |
| ------------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------------- |
| Không đặt WIP limit            | Mọi người làm mọi thứ cùng lúc → throughput giảm, lead time tăng | Đặt WIP limit = capacity × 1.5, giám sát và điều chỉnh dần |
| Board không phản ánh flow thật | Tickets nhảy cột không qua bước thật → metrics vô nghĩa          | Map columns theo actual workflow steps, không phải ideal   |
| Ticket quá lớn                 | Ticket chiếm cả WIP limit nhiều tuần → bottleneck ẩn             | Slice ticket theo value deliverable nhỏ nhất có thể        |

**🎯 Interview Pattern:**

- Khi thấy: "Team bạn dùng methodology gì?" → Nhớ đến: mô tả flow và metric, không chỉ tên framework → Mở đầu: "Team dùng Kanban với WIP limit 3 mỗi cột — tôi đo cycle time để tìm bottleneck và throughput để dự đoán delivery date."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Scrum](#3-scrum--scrum-trong-sdlc)
- ➡️ Để hiểu tiếp: [Testing Strategies](#5-testing-strategies--chiến-lược-kiểm-thử)

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

> 🧠 **Memory Hook:** "Kiểm tra bài trước khi nộp — unit check từng câu, integration check cả bài, E2E check nộp được không"

**Tại sao tồn tại? / Why does this exist?**

Code không tự biết nó đúng — cần cơ chế xác minh behavior tự động để tự tin thay đổi. → **Why?** Vì manual testing không scale khi codebase lớn và release frequency tăng. → **Why?** Vì automated test suite là safety net cho mọi thay đổi — không có nó, mọi deploy đều là gamble với production.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng bạn làm bài kiểm tra với 3 lớp kiểm tra. Trước tiên check từng câu hỏi riêng lẻ (unit test). Rồi check xem các phần của bài liên kết với nhau đúng không (integration test). Cuối cùng thử nộp bài lên hệ thống xem có submit được không (E2E test). Làm nhiều unit test nhất vì nhanh nhất — ít E2E nhất vì chậm và khó bảo trì nhất.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```text
         /\
        /E2E\ ← ít, chậm (phút), mô phỏng user thật
       /------\
      /Integra-\ ← vừa, kiểm tra module tương tác
     /tion Tests\
    /------------\
   /  Unit Tests  \ ← nhiều, nhanh (ms), cô lập từng function
  /________________\
```

Chiến lược theo loại:

1. **Unit**: test function/class cô lập, mock external dependencies
2. **Integration**: test module phối hợp (DB, API, queue)
3. **E2E**: simulate full user journey qua UI/API thật
4. **Contract**: đảm bảo producer-consumer API compatibility

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- ✅ Unit test coverage cao nhưng E2E thấp vẫn tốt hơn ngược lại
- ❌ E2E-only strategy: chậm, flaky, tốn kém maintain, feedback loop dài
- ⚠️ 100% coverage không đồng nghĩa với 0 bugs — coverage đo lines, không đo behaviors
- 🔄 Flaky tests (fail không ổn định) tệ hơn không có test vì phá trust vào toàn bộ test suite

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm             | Tại sao sai                                                      | Đúng là                                                             |
| ------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| Test chỉ happy path | Bug sống ở edge cases: null input, empty list, concurrent access | Test cả error path, boundary values, và race conditions             |
| Mock quá nhiều      | Mock không phản ánh behavior thật → tests pass nhưng prod fail   | Mock chỉ external dependencies (DB, 3rd party API), test logic thật |
| Bỏ E2E vì "chậm"    | Không có E2E → không biết luồng chính có chạy được không         | Giữ ít E2E cho critical paths, chạy song song trong CI              |

**🎯 Interview Pattern:**

- Khi thấy: "Testing strategy của bạn là gì?" → Nhớ đến: testing pyramid, phân bổ unit/integration/E2E → Mở đầu: "Tôi theo testing pyramid: nhiều unit tests nhanh, vừa integration tests cho contracts, ít E2E cho critical user journeys — với mục tiêu feedback loop ngắn trong CI."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Agile & Scrum](#3-scrum--scrum-trong-sdlc)
- ➡️ Để hiểu tiếp: [CI/CD](#6-cicd--tích-hợp-và-triển-khai-liên-tục)

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
import { describe, it, expect } from "vitest";
describe("sum", () => {
  it("adds two numbers", () => {
    expect(sum(1, 2)).toBe(3);
  });
});
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

> 🧠 **Memory Hook:** "Băng chuyền nhà máy — mỗi commit là một sản phẩm đi qua QC tự động trước khi xuất xưởng"

**Tại sao tồn tại? / Why does this exist?**

Deploy thủ công chậm, error-prone và không consistent — đặc biệt khi team lớn và deploy nhiều lần/ngày. → **Why?** Vì mỗi bước thủ công là cơ hội để bỏ sót: quên chạy tests, deploy sai environment, thiếu migration script. → **Why?** Vì automation loại bỏ human error và tạo ra repeatable, auditable process — nền tảng của reliability.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng dây chuyền sản xuất của nhà máy ô tô. Mỗi chiếc xe đi qua hàng loạt trạm kiểm tra tự động: kiểm tra động cơ, kiểm tra phanh, kiểm tra sơn — trước khi xuất xưởng. Nếu một trạm phát hiện lỗi, xe bị dừng ngay và báo động. CI/CD là dây chuyền đó cho code: mỗi commit đi qua lint → test → build → deploy tự động, và bị dừng nếu có lỗi ở bất kỳ trạm nào.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```text
Developer push code
       ↓
   [CI Pipeline]
   lint → typecheck → unit tests → integration tests → build artifact
       ↓ (all pass)
   [CD Pipeline]
   deploy staging → smoke tests → canary 5% → canary 25% → full rollout
                                      ↓ (error rate high?)
                                   auto rollback
```

Phân biệt 3 khái niệm:

1. **CI** (Continuous Integration): merge thường xuyên vào main + auto test mỗi commit
2. **Continuous Delivery**: auto deploy to staging, nhưng manual approve trước khi lên prod
3. **Continuous Deployment**: auto deploy to prod khi pass all gates — không cần manual approve

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- ✅ CI nhanh (< 10 phút) là critical — slow CI bị bypass hoặc ignored bởi developer
- ❌ "Skip CI for hotfix" — điều này nguy hiểm hơn không phải ít hơn
- ⚠️ Pipeline không có rollback plan → deploy thất bại = extended downtime
- 🔄 Continuous Deployment yêu cầu mature monitoring + feature flags, không phải cho mọi team

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                          | Tại sao sai                                                  | Đúng là                                                     |
| -------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------- |
| Skip CI khi "khẩn cấp"           | Hotfix không qua test = rủi ro cao nhất, không thấp nhất     | Maintain fast CI pipeline (< 10 phút) để không ai muốn skip |
| Không có staging environment     | Deploy thẳng prod → không biết sẽ fail cho đến khi fail thật | Staging giống prod, smoke tests bắt buộc trước khi promote  |
| Deploy vào cuối tuần / cuối ngày | Giảm khả năng response khi incident xảy ra                   | Deploy khi team đầy đủ và có thể respond nhanh              |

**🎯 Interview Pattern:**

- Khi thấy: "Làm sao bạn đảm bảo chất lượng khi deploy?" → Nhớ đến: CI gates + CD strategies + rollback → Mở đầu: "Mọi thay đổi đều qua CI pipeline với lint, test, và security scan. Deploy qua canary với auto-rollback khi error rate vượt threshold."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Testing Strategies](#5-testing-strategies--chiến-lược-kiểm-thử)
- ➡️ Để hiểu tiếp: [Code Review Best Practices](#7-code-review-best-practices--thực-hành-review-code)

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

> 🧠 **Memory Hook:** "Đọc bài soát lỗi — không phải chấm điểm, mà là cùng nhau làm cho bài tốt hơn"

**Tại sao tồn tại? / Why does this exist?**

Mỗi developer có blind spots — reviewer thứ hai bắt được lỗi mà người viết không thấy do familiarity bias. → **Why?** Vì code tồn tại lâu hơn context viết ra nó — reviewer enforce shared standards và knowledge transfer. → **Why?** Vì codebase là asset chung của team, không phải tài sản cá nhân — mọi người phải hiểu và có thể maintain.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng bạn viết một bài luận quan trọng. Bạn đọc lại 10 lần vẫn thấy ổn — vì não bạn tự điền vào những gì bạn muốn viết, không phải những gì thật sự trên giấy. Bạn nhờ bạn bè đọc, ngay lập tức họ thấy câu lủng củng, logic thiếu, chính tả sai. Code review hoạt động y hệt: một cặp mắt mới thấy những gì người viết bị "mù" do quen quá.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

Ưu tiên review theo thứ tự:

1. **Correctness**: logic đúng chưa? Edge cases xử lý chưa?
2. **Security**: có SQL injection, XSS, auth bypass, secrets exposed không?
3. **Performance**: có N+1 query, memory leak, blocking call không?
4. **Maintainability**: naming rõ chưa? Có magic numbers/strings không?
5. **Style**: conventions, formatting → nên auto-enforce bằng linter (không tốn thời gian human)

```text
PR size → Review quality correlation:
< 200 lines  → thorough review, fast turnaround
200-400 lines → good review with focus
400-800 lines → reviewer attention splits, misses increase
> 800 lines  → rubber stamp territory → zero value
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- ✅ PR nhỏ (< 400 dòng) được review kỹ hơn, merge nhanh hơn, ít conflict hơn
- ❌ "Approve để PR không block" → review theater, không có giá trị thật sự
- ⚠️ Comment dạng "WTF là cái này?" → toxic culture, phá tâm lý an toàn của team
- 🔄 Auto checks (lint, typecheck, tests) phải xanh trước khi human review — không lãng phí thời gian reviewer với lỗi máy bắt được

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                    | Tại sao sai                                                | Đúng là                                                               |
| -------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------- |
| Review chỉ style, bỏ logic | Style có linter; logic bugs chỉ human mới bắt được         | Ưu tiên correctness và security, style là thứ yếu                     |
| Comment không có lý do     | "Change this" không giúp author học hoặc quyết định        | Comment kiểu: "Đổi thành X vì Y — tránh N+1 query ở đây"              |
| Approve vì "muốn unblock"  | Approve mà chưa hiểu code = liability, không phải teamwork | Block nếu có concern thật; suggest sync call thay vì comment marathon |

**🎯 Interview Pattern:**

- Khi thấy: "Bạn approach code review như thế nào?" → Nhớ đến: correctness first, PR size, constructive comments → Mở đầu: "Tôi check correctness và security trước, encourage PR nhỏ hơn 400 dòng, và comment với context rõ — reviewer là pair, không phải judge."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [CI/CD](#6-cicd--tích-hợp-và-triển-khai-liên-tục)
- ➡️ Để hiểu tiếp: [Technical Debt Management](#8-technical-debt-management--quản-lý-nợ-kỹ-thuật)

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

> 🧠 **Memory Hook:** "Nợ tiền trả góp — tiện lợi trước mắt nhưng trả lãi mỗi ngày cho đến khi trả hết"

**Tại sao tồn tại? / Why does this exist?**

Deadlines buộc team phải trade-off — đôi khi giải pháp nhanh (nhưng không hoàn hảo) là lựa chọn đúng trong thời điểm đó. → **Why?** Vì nợ kỹ thuật không tự biến mất — nó tích lãi dưới dạng bugs, slow delivery, và onboarding khó. → **Why?** Vì code không được maintain sẽ rot: dependencies cũ, patterns lỗi thời, complexity tăng — cho đến khi rewrite từ đầu là con đường duy nhất.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng bạn mua điện thoại bằng thẻ tín dụng trả góp. Bạn có điện thoại ngay hôm nay (ship feature nhanh), nhưng mỗi tháng phải trả một phần (maintenance overhead). Nếu bạn mở nhiều thẻ tín dụng cùng lúc (nhiều debt chồng chất), tiền lãi ăn hết lương, không còn tiền mua thêm gì (không thể add feature mới vì code quá phức tạp). Technical debt cần quản lý có kế hoạch — không phải ignore đến khi vỡ nợ.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

Phân loại debt:

1. **Deliberate debt**: cố ý chọn giải pháp nhanh, có plan trả sau → acceptable
2. **Accidental debt**: không biết mình đã tạo ra debt (thiếu kiến thức) → cần review
3. **Bit rot**: code tốt nhưng environment thay đổi, code cũ dần → cần track

```text
Phát hiện debt → Đo impact (cycle time tăng? bug rate tăng? cost cao?)
      ↓
Phân loại (type + interest rate: tích lãi nhanh hay chậm?)
      ↓
Ưu tiên theo risk × leverage (không theo sở thích kỹ thuật)
      ↓
Budget capacity cố định mỗi sprint (15-20%)
      ↓
Measure metric sau refactor → chứng minh ROI với stakeholder
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- ✅ Deliberate + acknowledged debt = acceptable; unknown debt = dangerous
- ❌ "Sẽ refactor sau" mà không có ticket, timeline, và owner = debt vĩnh cửu
- ⚠️ Refactor không đi kèm test suite → giải quyết một debt, tạo ra một debt mới
- 🔄 Không phải mọi debt đều cần trả — legacy code không được touch đôi khi ổn hơn refactor sai

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                         | Tại sao sai                                                           | Đúng là                                                                        |
| ----------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Coi debt là "technical issue", không nói với PM | PM không biết tại sao velocity giảm → tiếp tục giao thêm feature work | Dùng numbers: "Debt này gây ra 30% bug rate, làm chậm delivery 2 ngày/sprint"  |
| Refactor toàn bộ cùng lúc ("big bang")          | Rủi ro cao, khó review, team mất focus feature work                   | Strangler fig pattern: refactor incrementally, giữ interface cũ chạy song song |
| Không đo trước và sau refactor                  | Không biết refactor có cải thiện gì → không justify effort tiếp theo  | Measure cycle time, bug rate, build time trước và sau                          |

**🎯 Interview Pattern:**

- Khi thấy: "Bạn xử lý technical debt như thế nào?" → Nhớ đến: đo impact, phân loại, budget capacity cố định → Mở đầu: "Tôi track debt trong backlog với impact numbers cụ thể, dành 15-20% capacity mỗi sprint để trả nợ theo priority risk × leverage."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Code Review Best Practices](#7-code-review-best-practices--thực-hành-review-code)
- ➡️ Để hiểu tiếp: [Documentation Practices](#9-documentation-practices--thực-hành-tài-liệu)

### 🔴 Q: How should teams manage technical debt? `[Senior]`

**A:**

- Ghi nhận debt trong backlog với impact rõ (defects, cycle time, infra cost).
- Phân loại: deliberate debt vs accidental debt.
- Dành ngân sách capacity cố định mỗi sprint (ví dụ 15-20%).
- Trả nợ theo risk và leverage thay vì sở thích kỹ thuật.
- Theo dõi metric sau refactor để chứng minh hiệu quả.

| Debt Type  | Ví dụ                  | Hướng xử lý                        |
| ---------- | ---------------------- | ---------------------------------- |
| Code debt  | Module quá lớn         | Tách module + contract tests       |
| Test debt  | Thiếu regression tests | Bổ sung smoke + integration tests  |
| Infra debt | Pipeline chậm 45 phút  | Parallelize + cache + split stages |
| Docs debt  | Onboarding mất 2 tuần  | Viết runbook + architecture docs   |

---

## 9. Documentation Practices — Thực hành tài liệu

> 🧠 **Memory Hook:** "Bản đồ cho người sau — bạn ngày mai sẽ cảm ơn bạn hôm nay đã viết docs"

**Tại sao tồn tại? / Why does this exist?**

Kiến thức trong đầu engineer không scale — khi người đó rời team, kiến thức biến mất theo. → **Why?** Vì onboarding mới tốn 2-4 tuần thay vì 1-2 ngày khi không có docs tốt. → **Why?** Vì documentation là multiplier: một lần viết, vô số người đọc — ROI tốt nhất trong mọi engineering practices.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng bạn khám phá một thành phố lạ. Nếu có bản đồ tốt, bạn đi đến nơi nào cũng tự định hướng được. Nếu không có bản đồ, bạn phải hỏi từng người dân địa phương — mất thời gian và dễ nhận thông tin sai. Documentation là bản đồ của codebase: README cho biết "bạn đang đứng đâu", ADR cho biết "tại sao con đường này được chọn", runbook cho biết "làm gì khi lạc đường giữa đêm".

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

Các loại docs và mục đích cụ thể:

1. **README**: setup local, scripts chính, overview kiến trúc → dành cho developer mới
2. **ADR** (Architecture Decision Record): ghi lại quyết định kỹ thuật + context + alternatives rejected
3. **API Contract**: request/response schema, error codes, versioning policy → dành cho consumer
4. **Runbook**: step-by-step xử lý incident và operations → dành cho on-call
5. **Onboarding guide**: kiến trúc, conventions, release flow, contacts → dành cho hire mới

```text
Ai đọc?          Docs phù hợp
New developer  → README + Onboarding Guide
Code reviewer  → ADR (tại sao quyết định như vậy?)
On-call eng.   → Runbook (làm gì khi alert đỏ lúc 2am?)
API consumer   → API Contract + Changelog
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- ✅ Docs-as-code (trong git cùng code) → dễ review, dễ track changes, không bị stale
- ❌ Wiki không ai cập nhật → stale docs nguy hiểm hơn không có docs (mislead thay vì confuse)
- ⚠️ Over-documentation: docs quá dài, không ai đọc → zero ROI, tốn effort viết và maintain
- 🔄 Executable examples (tests, scripts chạy được) không bao giờ drift — code đúng thì example đúng

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                             | Tại sao sai                                                        | Đúng là                                                         |
| ----------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------- |
| Viết docs SAU khi release           | Không ai có thời gian sau release → docs không bao giờ được viết   | Docs là part of Definition of Done, viết cùng lúc với code      |
| Không có owner cho docs             | Không ai cảm thấy trách nhiệm → stale docs chồng chất              | Mỗi doc có owner rõ, review định kỳ trong team calendar         |
| Comment giải thích WHAT thay vì WHY | Code đã nói WHAT — comment cần giải thích WHY decision được đưa ra | `// Dùng Redis thay vì DB vì latency < 10ms là SLA requirement` |

**🎯 Interview Pattern:**

- Khi thấy: "Bạn duy trì documentation như thế nào?" → Nhớ đến: docs-as-code, owner rõ, part of DoD → Mở đầu: "Documentation là part of Definition of Done trong team tôi — API changes bắt buộc update contract, architectural decisions có ADR, và runbook được test quarterly."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Technical Debt Management](#8-technical-debt-management--quản-lý-nợ-kỹ-thuật)
- ➡️ Để hiểu tiếp: [Testing Theory](./04-testing-theory.md)

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
type UserResponse = { id: string; email: string };
const isUserResponse = (x: unknown): x is UserResponse => {
  if (typeof x !== "object" || x === null) return false;
  const v = x as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.email === "string";
};
```

### 🟡 Q: Performance test nên chạy khi nào? `[Mid]`

**A:**

- Smoke performance: trong CI cho critical endpoint.
- Load/stress test: pre-release hoặc theo lịch.
- Capacity planning: trước campaign traffic lớn.

| Test Type     | Frequency          | Mục tiêu                      |
| ------------- | ------------------ | ----------------------------- |
| Unit          | Mỗi commit         | Phát hiện lỗi logic nhanh     |
| Integration   | Mỗi commit/PR      | Đảm bảo module tương tác đúng |
| E2E smoke     | Mỗi merge vào main | Bảo vệ luồng chính            |
| Full E2E      | Nightly            | Regression toàn diện          |
| Performance   | Nightly/Release    | SLO, capacity                 |
| Security scan | Nightly/Release    | Vulnerability drift           |

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

| Section    | Nội dung bắt buộc                   |
| ---------- | ----------------------------------- |
| Summary    | Sự cố gì, phạm vi ảnh hưởng         |
| Detection  | Cách phát hiện, thời gian phát hiện |
| Response   | Cách xử lý, ai phối hợp             |
| Root Cause | Kỹ thuật + quy trình + tổ chức      |
| Actions    | Preventive + detective improvements |

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

**A:** **Agile** is a _philosophy_ (Agile Manifesto values). **Scrum** is a _framework_ that implements Agile with specific roles, events, and artifacts.

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

Vietnamese explanation: Agile = "why" và "what values." Scrum/Kanban = "how" to implement. Scrum cần mature team, clear PO, good refinement. Kanban tốt hơn cho support/maintenance work (flow-based, không theo sprint). Điểm quan trọng: demonstrate understanding of _principles_ (deliver value, adapt, collaborate) không chỉ ceremonies.

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

| Question       | Level | Key Point                                                                |
| -------------- | ----- | ------------------------------------------------------------------------ |
| Agile vs Scrum | 🟢    | Agile=philosophy; Scrum=framework; understand principles over ceremonies |
| CI/CD pipeline | 🟡    | Build→test→security→staging→prod; DORA metrics; blue/green/canary        |

---

## Self-Check / Tự Kiểm Tra

| #   | Câu hỏi tự kiểm tra                                                           | Chủ đề        | Mức độ    |
| --- | ----------------------------------------------------------------------------- | ------------- | --------- |
| 1   | Giải thích sự khác biệt giữa Agile (philosophy) và Scrum (framework)?         | Agile / Scrum | 🟢 Junior |
| 2   | Mô tả 4 DORA metrics và "elite" performance trông như thế nào cho mỗi metric? | CI/CD         | 🟡 Mid    |
| 3   | So sánh blue/green vs canary deployment — khi nào dùng cái nào?               | CI/CD         | 🔴 Senior |
| 4   | Giải thích tại sao feature flags tốt hơn long-lived feature branches?         | CI/CD         | 🔴 Senior |
| 5   | Khi nào Kanban phù hợp hơn Scrum? Cho ví dụ cụ thể từ thực tế.                | Kanban        | 🟡 Mid    |

💬 **Feynman Prompt:** Giải thích tại sao "skip CI for hotfix" là phản trực giác — và tại sao hotfix deployment thực ra _rủi ro hơn_ normal deployment, không phải ít hơn.

## Connections / Liên Kết

- ➡️ **Applied in**: [Testing Theory](./04-testing-theory.md) — automated tests are the foundation of CI
- ➡️ **Applied in**: [Code Quality](./05-code-quality-and-review.md) — code review is part of the SDLC gate
- 🔗 **Related**: [Go Testing](../../be-track/01-golang/05-testing-profiling.md) — Go-specific CI practices
- 🔗 **Related**: [Observability](../../be-track/04-be-system-design/05-observability-and-scale.md) — DORA metrics need observability to measure
