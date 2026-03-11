# Zalo/VNG Interview Guide — Hướng Dẫn Phỏng Vấn Zalo/VNG

> Target roles: Frontend (React/TypeScript) and Backend (Go)
> Last updated: 2026
> Cross-references: `shared/`, `fe-track/`, `be-track/`

---

## 1. Company Overview / Tổng Quan Công Ty

### About Zalo/VNG
- Zalo/VNG xử lý sản phẩm quy mô 100M+ users với yêu cầu realtime và tối ưu hiệu năng rất cao.
- Go microservices + React là stack gần sát target role Frontend/Backend hiện tại.
- Quy trình có thể diễn ra bằng tiếng Việt hoặc tiếng Anh tùy team/manager.

### Engineering Culture / Văn Hóa Kỹ Thuật
- Engineering culture thực dụng, đậm chất performance và scale vận hành.
- Đề cao kỹ sư hiểu hệ thống end-to-end từ protocol đến UX responsiveness.
- VNG Gaming division thường có process riêng với algorithm weighting cao hơn.

### Hiring Signal Snapshot / Tín Hiệu Đánh Giá Nhanh
- Coding signal: cần code chạy được + giải thích complexity rõ ràng.
- Design signal: phải nêu trade-offs, failure mode, và monitoring.
- Communication signal: trình bày có cấu trúc, tách assumption và conclusion.
- Study priority (official guide): **Go + React Depth > System Design > CS Fundamentals**.

## 2. Interview Process / Quy Trình Phỏng Vấn

### Typical Rounds / Các Vòng Thường Gặp
1. Written/OA Test (60-90m): CS fundamentals + coding + đôi khi networking.
2. Technical Interview 1 (60m): Go/React deep dive theo role.
3. Technical Interview 2 (60m): system design mirror sản phẩm Zalo thực tế.
4. Manager/Architecture Round (45-60m): [Senior] có thể trình bày kiến trúc.
5. Culture/Final (30m): fit với team và execution pressure.

### Timeline & Difficulty / Thời Gian và Độ Khó
- Thường 2-6 tuần; team đang scale có thể xử lý nhanh hơn.
- Kết quả OA thường phản hồi trong 2-5 ngày làm việc.
- Offer phụ thuộc level calibration và nhu cầu cụ thể của BU.
- Difficulty map: [Junior] thiên về implementation và fundamentals; [Mid] thêm design ownership; [Senior] thêm architecture influence.

### Round-by-Round Preparation Checklist / Checklist Theo Từng Vòng
- [Junior] Chuẩn bị 2-3 câu chuyện STAR có số liệu trước/sau (latency, error rate, conversion, cost).
- [Junior] Tập giải thích approach trong 2-3 phút trước khi code.
- [Junior] Chốt lại assumption bằng ngôn ngữ rõ ràng: input size, SLA, consistency, security.
- [Mid] Chuẩn bị 2-3 câu chuyện STAR có số liệu trước/sau (latency, error rate, conversion, cost).
- [Mid] Tập giải thích approach trong 2-3 phút trước khi code.
- [Mid] Chốt lại assumption bằng ngôn ngữ rõ ràng: input size, SLA, consistency, security.
- [Senior] Chuẩn bị 2-3 câu chuyện STAR có số liệu trước/sau (latency, error rate, conversion, cost).
- [Senior] Tập giải thích approach trong 2-3 phút trước khi code.
- [Senior] Chốt lại assumption bằng ngôn ngữ rõ ràng: input size, SLA, consistency, security.

## 3. Technical Focus Areas / Trọng Tâm Kỹ Thuật

### Frontend (React/TypeScript)
- React optimization, WebSockets, mobile-web performance là trọng tâm.
- Câu hỏi có thể chạm V8 internals, event loop, rendering pipeline.
- Kỳ vọng giải thích vì sao tối ưu đó có hiệu quả trên thiết bị low-end.
- Resources: `docs/interview/fe-track/02-typescript/05-react-typescript.md`, `docs/interview/fe-track/02-typescript/04-typescript-comprehensive.md`, `docs/interview/fe-track/06-browser-performance/02-react-performance.md`, `docs/interview/fe-track/08-fe-system-design/01-architecture-patterns.md`

### Backend (Go)
- Go concurrency: goroutines, mutexes, channels, race conditions.
- TCP/IP fundamentals, Redis patterns, MySQL query/index optimization.
- Thiết kế microservices chịu tải lớn cho messaging/newsfeed/notifications.
- Resources: `docs/interview/be-track/01-golang/01-language-fundamentals.md`, `docs/interview/be-track/01-golang/03-concurrency.md`, `docs/interview/be-track/02-backend-knowledge/01-api-design.md`, `docs/interview/be-track/04-be-system-design/01-design-framework.md`

### Topic-by-Level Matrix / Ma Trận Chủ Đề Theo Level
- [Junior] FE: Implement đúng + test cases cơ bản.
- [Junior] BE: Nắm fundamentals trước khi tối ưu.
- [Mid] FE: Giải bài medium/hard có giải thích trade-off.
- [Mid] BE: Design service + API + data model có monitoring.
- [Senior] FE: Dẫn dắt problem framing, tối ưu dưới constraint thật.
- [Senior] BE: Thiết kế evolution path, reliability, governance.

## 4. System Design Expectations / Yêu Cầu System Design

- System design bám use-case thực: messaging, newsfeed ranking, push fanout.
- Cần nói rõ consistency model, queueing strategy, anti-hotspot techniques.
- Senior round có thể yêu cầu trình bày architecture proposal theo format slide/whiteboard.
- Khung trả lời đề xuất: Requirements → Capacity → APIs → Data model → Architecture → Failure handling → Observability → Security/Compliance → Rollout plan.
- Dùng marker độ khó khi trình bày: [Junior] component-level, [Mid] service-level, [Senior] platform-level.

### Domain Scenarios You Should Rehearse / Kịch Bản Nên Luyện
- Scenario 1: **Messaging fanout** — phân tích bottleneck, consistency requirement, và rollback strategy.
- Scenario 2: **Newsfeed generation** — phân tích bottleneck, consistency requirement, và rollback strategy.
- Scenario 3: **Push notification platform** — phân tích bottleneck, consistency requirement, và rollback strategy.
- Scenario 4: **Realtime presence** — phân tích bottleneck, consistency requirement, và rollback strategy.
- Scenario 5: **Mini-app ecosystem** — phân tích bottleneck, consistency requirement, và rollback strategy.

## 5. Behavioral / Cultural Fit

- Behavioral vừa phải nhưng rất chú trọng execution và resilience khi sự cố.
- Nên có ví dụ debug production issue với số liệu cụ thể.
- Song ngữ VI/EN là lợi thế khi làm việc liên team.
- Bộ câu chuyện tối thiểu: conflict, ownership, deadline pressure, production incident, mentoring.
- Cấu trúc kể chuyện: Context → Constraint → Action → Result → Reflection.

## 6. Preparation Strategy / Chiến Lược Chuẩn Bị

### 6-Week Plan / Kế Hoạch 6 Tuần
#### Week 1 / Tuần 1
- [Junior] Mục tiêu: hoàn thành 1 checklist coding + 1 checklist communication cho tuần 1.
- [Mid] Mục tiêu: 2 mock interviews (1 coding, 1 design) và retrospective chi tiết.
- [Senior] Mục tiêu: luyện 1 design case cấp platform + 1 leadership scenario có metric tác động.
- Output bắt buộc: ghi lại lỗi lặp lại và action plan trước tuần 2.
#### Week 2 / Tuần 2
- [Junior] Mục tiêu: hoàn thành 1 checklist coding + 1 checklist communication cho tuần 2.
- [Mid] Mục tiêu: 2 mock interviews (1 coding, 1 design) và retrospective chi tiết.
- [Senior] Mục tiêu: luyện 1 design case cấp platform + 1 leadership scenario có metric tác động.
- Output bắt buộc: ghi lại lỗi lặp lại và action plan trước tuần 3.
#### Week 3 / Tuần 3
- [Junior] Mục tiêu: hoàn thành 1 checklist coding + 1 checklist communication cho tuần 3.
- [Mid] Mục tiêu: 2 mock interviews (1 coding, 1 design) và retrospective chi tiết.
- [Senior] Mục tiêu: luyện 1 design case cấp platform + 1 leadership scenario có metric tác động.
- Output bắt buộc: ghi lại lỗi lặp lại và action plan trước tuần 4.
#### Week 4 / Tuần 4
- [Junior] Mục tiêu: hoàn thành 1 checklist coding + 1 checklist communication cho tuần 4.
- [Mid] Mục tiêu: 2 mock interviews (1 coding, 1 design) và retrospective chi tiết.
- [Senior] Mục tiêu: luyện 1 design case cấp platform + 1 leadership scenario có metric tác động.
- Output bắt buộc: ghi lại lỗi lặp lại và action plan trước tuần 5.
#### Week 5 / Tuần 5
- [Junior] Mục tiêu: hoàn thành 1 checklist coding + 1 checklist communication cho tuần 5.
- [Mid] Mục tiêu: 2 mock interviews (1 coding, 1 design) và retrospective chi tiết.
- [Senior] Mục tiêu: luyện 1 design case cấp platform + 1 leadership scenario có metric tác động.
- Output bắt buộc: ghi lại lỗi lặp lại và action plan trước tuần 6.
#### Week 6 / Tuần 6
- [Junior] Mục tiêu: hoàn thành 1 checklist coding + 1 checklist communication cho tuần 6.
- [Mid] Mục tiêu: 2 mock interviews (1 coding, 1 design) và retrospective chi tiết.
- [Senior] Mục tiêu: luyện 1 design case cấp platform + 1 leadership scenario có metric tác động.
- Output bắt buộc: ghi lại lỗi lặp lại và action plan trước tuần next loop.

### Daily Routine / Nhịp Luyện Hàng Ngày (90-120 phút)
- 30-40 phút: coding timed session.
- 30-40 phút: system design notes + trade-off practice.
- 20-30 phút: behavioral story polish + English speaking drill.
- 10 phút: review lỗi và ghi flashcards.

## 7. Common Questions / Câu Hỏi Thường Gặp

### 7.1 Coding & Problem Solving Bank
1. [Junior] Explain your approach for problem #1 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #1.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #1.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #1.
2. [Junior] Explain your approach for problem #2 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #2.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #2.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #2.
3. [Junior] Explain your approach for problem #3 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #3.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #3.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #3.
4. [Junior] Explain your approach for problem #4 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #4.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #4.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #4.
5. [Junior] Explain your approach for problem #5 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #5.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #5.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #5.
6. [Junior] Explain your approach for problem #6 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #6.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #6.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #6.
7. [Junior] Explain your approach for problem #7 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #7.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #7.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #7.
8. [Junior] Explain your approach for problem #8 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #8.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #8.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #8.
9. [Junior] Explain your approach for problem #9 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #9.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #9.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #9.
10. [Junior] Explain your approach for problem #10 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #10.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #10.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #10.
11. [Junior] Explain your approach for problem #11 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #11.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #11.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #11.
12. [Junior] Explain your approach for problem #12 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #12.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #12.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #12.
13. [Junior] Explain your approach for problem #13 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #13.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #13.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #13.
14. [Junior] Explain your approach for problem #14 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #14.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #14.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #14.
15. [Mid] Explain your approach for problem #15 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #15.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #15.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #15.
16. [Mid] Explain your approach for problem #16 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #16.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #16.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #16.
17. [Mid] Explain your approach for problem #17 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #17.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #17.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #17.
18. [Mid] Explain your approach for problem #18 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #18.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #18.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #18.
19. [Mid] Explain your approach for problem #19 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #19.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #19.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #19.
20. [Mid] Explain your approach for problem #20 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #20.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #20.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #20.
21. [Mid] Explain your approach for problem #21 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #21.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #21.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #21.
22. [Mid] Explain your approach for problem #22 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #22.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #22.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #22.
23. [Mid] Explain your approach for problem #23 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #23.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #23.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #23.
24. [Mid] Explain your approach for problem #24 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #24.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #24.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #24.
25. [Mid] Explain your approach for problem #25 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #25.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #25.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #25.
26. [Mid] Explain your approach for problem #26 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #26.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #26.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #26.
27. [Mid] Explain your approach for problem #27 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #27.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #27.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #27.
28. [Mid] Explain your approach for problem #28 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #28.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #28.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #28.
29. [Mid] Explain your approach for problem #29 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #29.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #29.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #29.
30. [Mid] Explain your approach for problem #30 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #30.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #30.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #30.
31. [Senior] Explain your approach for problem #31 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #31.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #31.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #31.
32. [Senior] Explain your approach for problem #32 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #32.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #32.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #32.
33. [Senior] Explain your approach for problem #33 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #33.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #33.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #33.
34. [Senior] Explain your approach for problem #34 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #34.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #34.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #34.
35. [Senior] Explain your approach for problem #35 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #35.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #35.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #35.
36. [Senior] Explain your approach for problem #36 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #36.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #36.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #36.
37. [Senior] Explain your approach for problem #37 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #37.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #37.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #37.
38. [Senior] Explain your approach for problem #38 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #38.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #38.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #38.
39. [Senior] Explain your approach for problem #39 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #39.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #39.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #39.
40. [Senior] Explain your approach for problem #40 before coding in 90 seconds.
   - VN: Trình bày giả định đầu vào, độ lớn dữ liệu, và độ phức tạp kỳ vọng cho bài #40.
   - FE angle: nêu cách validate edge cases trong UI/data flow của bài #40.
   - BE angle: nêu strategy kiểm thử và failure handling cho bài #40.

### 7.2 System Design Question Bank
1. [Junior] Design scenario: Messaging fanout (variant 1).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
2. [Junior] Design scenario: Newsfeed generation (variant 2).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
3. [Junior] Design scenario: Push notification platform (variant 3).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
4. [Junior] Design scenario: Realtime presence (variant 4).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
5. [Junior] Design scenario: Mini-app ecosystem (variant 5).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
6. [Junior] Design scenario: Messaging fanout (variant 6).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
7. [Junior] Design scenario: Newsfeed generation (variant 7).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
8. [Junior] Design scenario: Push notification platform (variant 8).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
9. [Mid] Design scenario: Realtime presence (variant 9).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
10. [Mid] Design scenario: Mini-app ecosystem (variant 10).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
11. [Mid] Design scenario: Messaging fanout (variant 11).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
12. [Mid] Design scenario: Newsfeed generation (variant 12).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
13. [Mid] Design scenario: Push notification platform (variant 13).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
14. [Mid] Design scenario: Realtime presence (variant 14).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
15. [Mid] Design scenario: Mini-app ecosystem (variant 15).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
16. [Mid] Design scenario: Messaging fanout (variant 16).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
17. [Mid] Design scenario: Newsfeed generation (variant 17).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
18. [Mid] Design scenario: Push notification platform (variant 18).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
19. [Senior] Design scenario: Realtime presence (variant 19).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
20. [Senior] Design scenario: Mini-app ecosystem (variant 20).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
21. [Senior] Design scenario: Messaging fanout (variant 21).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
22. [Senior] Design scenario: Newsfeed generation (variant 22).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
23. [Senior] Design scenario: Push notification platform (variant 23).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
24. [Senior] Design scenario: Realtime presence (variant 24).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.
25. [Senior] Design scenario: Mini-app ecosystem (variant 25).
   - VN: Xác định requirement chức năng/phi chức năng, sau đó chốt SLO và capacity assumptions.
   - VN: Mô tả API contracts, storage strategy, caching, và observability tối thiểu.
   - VN: Nêu ít nhất 2 trade-off thực tế + 1 kế hoạch rollout an toàn.

### 7.3 Behavioral & Collaboration Questions
1. [Junior] Tell me about a time you handled disagreement in a high-pressure release.
   - VN: Trả lời theo STAR, nhấn mạnh decision log, stakeholder communication, và outcome định lượng.
2. [Junior] Tell me about a time you handled disagreement in a high-pressure release.
   - VN: Trả lời theo STAR, nhấn mạnh decision log, stakeholder communication, và outcome định lượng.
3. [Junior] Tell me about a time you handled disagreement in a high-pressure release.
   - VN: Trả lời theo STAR, nhấn mạnh decision log, stakeholder communication, và outcome định lượng.
4. [Junior] Tell me about a time you handled disagreement in a high-pressure release.
   - VN: Trả lời theo STAR, nhấn mạnh decision log, stakeholder communication, và outcome định lượng.
5. [Junior] Tell me about a time you handled disagreement in a high-pressure release.
   - VN: Trả lời theo STAR, nhấn mạnh decision log, stakeholder communication, và outcome định lượng.
6. [Junior] Tell me about a time you handled disagreement in a high-pressure release.
   - VN: Trả lời theo STAR, nhấn mạnh decision log, stakeholder communication, và outcome định lượng.
7. [Junior] Tell me about a time you handled disagreement in a high-pressure release.
   - VN: Trả lời theo STAR, nhấn mạnh decision log, stakeholder communication, và outcome định lượng.
8. [Mid] Tell me about a time you handled disagreement in a high-pressure release.
   - VN: Trả lời theo STAR, nhấn mạnh decision log, stakeholder communication, và outcome định lượng.
9. [Mid] Tell me about a time you handled disagreement in a high-pressure release.
   - VN: Trả lời theo STAR, nhấn mạnh decision log, stakeholder communication, và outcome định lượng.
10. [Mid] Tell me about a time you handled disagreement in a high-pressure release.
   - VN: Trả lời theo STAR, nhấn mạnh decision log, stakeholder communication, và outcome định lượng.
11. [Mid] Tell me about a time you handled disagreement in a high-pressure release.
   - VN: Trả lời theo STAR, nhấn mạnh decision log, stakeholder communication, và outcome định lượng.
12. [Mid] Tell me about a time you handled disagreement in a high-pressure release.
   - VN: Trả lời theo STAR, nhấn mạnh decision log, stakeholder communication, và outcome định lượng.
13. [Mid] Tell me about a time you handled disagreement in a high-pressure release.
   - VN: Trả lời theo STAR, nhấn mạnh decision log, stakeholder communication, và outcome định lượng.
14. [Mid] Tell me about a time you handled disagreement in a high-pressure release.
   - VN: Trả lời theo STAR, nhấn mạnh decision log, stakeholder communication, và outcome định lượng.
15. [Mid] Tell me about a time you handled disagreement in a high-pressure release.
   - VN: Trả lời theo STAR, nhấn mạnh decision log, stakeholder communication, và outcome định lượng.
16. [Senior] Tell me about a time you handled disagreement in a high-pressure release.
   - VN: Trả lời theo STAR, nhấn mạnh decision log, stakeholder communication, và outcome định lượng.
17. [Senior] Tell me about a time you handled disagreement in a high-pressure release.
   - VN: Trả lời theo STAR, nhấn mạnh decision log, stakeholder communication, và outcome định lượng.
18. [Senior] Tell me about a time you handled disagreement in a high-pressure release.
   - VN: Trả lời theo STAR, nhấn mạnh decision log, stakeholder communication, và outcome định lượng.
19. [Senior] Tell me about a time you handled disagreement in a high-pressure release.
   - VN: Trả lời theo STAR, nhấn mạnh decision log, stakeholder communication, và outcome định lượng.
20. [Senior] Tell me about a time you handled disagreement in a high-pressure release.
   - VN: Trả lời theo STAR, nhấn mạnh decision log, stakeholder communication, và outcome định lượng.

## 8. Study Order / Thứ Tự Học

### Recommended Sequence / Lộ Trình Khuyến Nghị
1. `docs/interview/00-quick-start-guide.md`
2. `docs/interview/shared/01-cs-fundamentals/complexity-analysis.md`
3. `docs/interview/shared/01-cs-fundamentals/algorithms-theory.md`
4. `docs/interview/shared/01-cs-fundamentals/networking-theory.md`
5. `docs/interview/shared/02-system-design/system-design-theory.md`
6. `docs/interview/shared/02-system-design/caching-patterns.md`
7. `docs/interview/shared/02-system-design/replication-partitioning.md`
8. `docs/interview/shared/03-database/02-indexing-and-optimization.md`
9. `docs/interview/shared/03-database/03-nosql-and-newsql.md`
10. `docs/interview/shared/04-security/01-security-fundamentals.md`
11. `docs/interview/fe-track/00-study-roadmap.md`
12. `docs/interview/fe-track/02-typescript/01-typescript-basics.md`
13. `docs/interview/fe-track/02-typescript/04-typescript-comprehensive.md`
14. `docs/interview/fe-track/05-react/01-react-fundamentals.md`
15. `docs/interview/fe-track/06-browser-performance/02-react-performance.md`
16. `docs/interview/fe-track/08-fe-system-design/01-architecture-patterns.md`
17. `docs/interview/be-track/00-study-roadmap.md`
18. `docs/interview/be-track/01-golang/01-language-fundamentals.md`
19. `docs/interview/be-track/01-golang/03-concurrency.md`
20. `docs/interview/be-track/02-backend-knowledge/01-api-design.md`
21. `docs/interview/be-track/02-backend-knowledge/03-distributed-systems.md`
22. `docs/interview/be-track/04-be-system-design/01-design-framework.md`
23. `docs/interview/be-track/04-be-system-design/02-classic-problems.md`

### Company-Specific Final Sprint (7 Days) / Nước Rút 7 Ngày
- Day 1: 1 mock coding + 1 mock design + 1 behavioral rehearsal (ghi âm và tự chấm rubric).
- Day 2: 1 mock coding + 1 mock design + 1 behavioral rehearsal (ghi âm và tự chấm rubric).
- Day 3: 1 mock coding + 1 mock design + 1 behavioral rehearsal (ghi âm và tự chấm rubric).
- Day 4: 1 mock coding + 1 mock design + 1 behavioral rehearsal (ghi âm và tự chấm rubric).
- Day 5: 1 mock coding + 1 mock design + 1 behavioral rehearsal (ghi âm và tự chấm rubric).
- Day 6: 1 mock coding + 1 mock design + 1 behavioral rehearsal (ghi âm và tự chấm rubric).
- Day 7: 1 mock coding + 1 mock design + 1 behavioral rehearsal (ghi âm và tự chấm rubric).

---

## Appendix A. Rapid Self-Evaluation Rubric / Thang Tự Chấm Nhanh
- Criterion 1: Problem framing có rõ assumption không? (score 1-5).
- Criterion 2: Code có pass edge cases cơ bản không? (score 1-5).
- Criterion 3: Complexity explanation có chính xác và ngắn gọn không? (score 1-5).
- Criterion 4: Design có nêu failure mode và monitoring không? (score 1-5).
- Criterion 5: Behavioral story có số liệu tác động không? (score 1-5).
- Criterion 6: Communication có mạch lạc dưới áp lực thời gian không? (score 1-5).

## Appendix B. Final Notes / Ghi Chú Cuối
- Không học dàn trải: ưu tiên theo study priority của công ty trong tài liệu này.
- Mỗi buổi luyện phải có output đo được: số bài, tỷ lệ đúng, thời gian, lỗi lặp lại.
- Mục tiêu phỏng vấn không phải trả lời “hoàn hảo” mà là ra quyết định tốt dưới constraint.
