# Frontend Theory 09: State Management Patterns

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Overview / Tổng Quan

Tài liệu này tổng hợp tiến hóa của state management: MVC → Flux → Redux → Context → Zustand → Signals,
kèm chiến lược local/global state, server/client state, state machine, reactive model, normalization, persistence, và sync đa tab.

Cross-reference:
- `../../03-react/05-state-management.md`
- `./17-frontend-theory-09-state-management-theory.md`

## 1) Evolution of State Management

### MVC Era
Giải thích: MVC tách model-view-controller nhưng thường bị vấn đề dữ liệu chảy hai chiều và side-effect khó trace.
Ví dụ: controller mutate model rồi trigger view update ngầm; debugging phức tạp khi app lớn.

### Flux
Giải thích: Flux áp dụng unidirectional data flow: Action → Dispatcher → Store → View.
Ví dụ: mọi cập nhật phải đi qua action nên timeline thay đổi rõ ràng hơn MVC.

### Redux
Giải thích: Redux chuẩn hóa bằng single store + pure reducer + immutable updates.
Ví dụ: action `{ type: 'todo/added' }` đi qua reducer tạo state mới, giúp time-travel/debug.

### Context API
Giải thích: React Context giảm prop drilling cho data dùng rộng nhưng không thay thế hoàn toàn external store.
Ví dụ: theme/locale/auth metadata phù hợp Context; dữ liệu update tần suất cao nên cân nhắc store khác.

### Zustand
Giải thích: store nhẹ, API tối giản, selector-based subscription giúp giảm re-render.
Ví dụ: component chỉ subscribe `state.cart.total`, không bị re-render khi `state.user` đổi.

### Signals
Giải thích: signal cập nhật theo dependency graph ở mức rất hạt mịn (fine-grained).
Ví dụ: thay đổi `count` chỉ render node phụ thuộc trực tiếp vào `count`, không render subtree lớn.

## 2) Local vs Global State

### Decision Framework
Giải thích:
- Local state: chỉ 1 component/1 subtree dùng.
- Global state: nhiều vùng app cần truy cập hoặc cần giữ nhất quán toàn app.
- Heuristic: place state as low as possible, as high as necessary.

Ví dụ: modal open/close đặt local; session user đặt global.

### Anti-patterns
Giải thích:
- Đưa toàn bộ form state lên global store gây noise và coupling.
- Duplicate state giữa local và global làm lệch dữ liệu.

Ví dụ: giữ `selectedProduct` ở component list và đồng thời ở store nhưng không sync chuẩn gây bug hiển thị.

## 3) Server State vs Client State

Giải thích:
- Server state: data authoritative trên backend, cần caching/revalidation.
- Client state: UI-only, tạm thời, không cần backend làm nguồn chân lý.

Ví dụ:
- Server state: danh sách orders từ API.
- Client state: trạng thái panel trái đang mở/đóng.

### Practical split
Giải thích: dùng React Query/SWR cho server state; Zustand/Redux/Context cho client UI state.
Ví dụ: optimistic update comment count ở query cache, còn draft text giữ local.

## 4) State Colocation

Giải thích: đặt state gần nơi dùng để giảm prop surface và cognitive load.
Ví dụ: mỗi row table có state hover local, không đưa vào global store.

## 5) State Normalization

Giải thích: lưu entity theo `byId` + `allIds` để update O(1), tránh nested mutation phức tạp.
Ví dụ: posts và comments tách bảng logic thay vì lồng comments sâu trong mỗi post.

## 6) Immutability Patterns

Giải thích: immutable update giúp so sánh reference nhanh và predictable debugging.
Ví dụ: sử dụng spread/Immer để tạo object mới thay vì mutate trực tiếp.

## 7) State Machines (XState)

Giải thích: biểu diễn luồng UI bằng trạng thái hữu hạn + transition tường minh.
Ví dụ: checkout machine `idle -> validating -> paying -> success|failure`.

## 8) Reactive State (Observables & Signals)

Giải thích:
- Observable phù hợp stream (websocket, event burst, cancellation).
- Signals phù hợp reactive graph, granular updates.

Ví dụ: dashboard realtime dùng Observable để merge stream metrics; UI layer dùng signal để render cục bộ.

## 9) Persistence

Giải thích: chỉ persist dữ liệu cần phục hồi sau reload (preferences, draft), tránh persist data nhạy cảm.
Ví dụ: lưu theme + language vào localStorage; không lưu access token plaintext.

## 10) Cross-tab Synchronization

Giải thích: dùng `storage` event hoặc `BroadcastChannel` để đồng bộ trạng thái giữa nhiều tab.
Ví dụ: logout ở tab A thì tab B tự chuyển về login screen.

### Pattern Note 1: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 1
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 2: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 2
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 3: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 3
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 4: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 4
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 5: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 5
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 6: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 6
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 7: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 7
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 8: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 8
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 9: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 9
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 10: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 10
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 11: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 11
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 12: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 12
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 13: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 13
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 14: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 14
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 15: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 15
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 16: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 16
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 17: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 17
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 18: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 18
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 19: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 19
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 20: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 20
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 21: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 21
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 22: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 22
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 23: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 23
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 24: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 24
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 25: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 25
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 26: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 26
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 27: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 27
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 28: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 28
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 29: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 29
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 30: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 30
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 31: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 31
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 32: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 32
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 33: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 33
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 34: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 34
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 35: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 35
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 36: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 36
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 37: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 37
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 38: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 38
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 39: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 39
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

### Pattern Note 40: Practical Trade-off
Giải thích: khi chọn thư viện/state model, đánh đổi chính nằm ở mental model, tooling, perf profile, và onboarding team.
Ví dụ: team lớn cần traceability có thể ưu tiên Redux Toolkit + convention; team nhỏ cần tốc độ có thể chọn Zustand.

#### Interview angle 40
Giải thích: trả lời theo cấu trúc requirement → constraint → lựa chọn → rủi ro → mitigation để thể hiện seniority.
Ví dụ: vì update tần suất cao ở dashboard, em chọn selector granular và batching để giảm commit cost.

## Code Patterns / Mẫu Code

```ts
type Entities<T extends { id: string }> = { byId: Record<string, T>; allIds: string[] };

function upsertEntity<T extends { id: string }>(state: Entities<T>, entity: T): Entities<T> {
  const exists = Boolean(state.byId[entity.id]);
  return {
    byId: { ...state.byId, [entity.id]: entity },
    allIds: exists ? state.allIds : [...state.allIds, entity.id],
  };
}
```

Giải thích: chuẩn hóa entities giúp update nhanh và selector rõ ràng.
Ví dụ: update user name chỉ chạm `users.byId[userId]`, tránh map toàn bộ list.

```ts
type UiState = { isSaving: boolean; error?: string };
type DomainState = { draft: string; published: string[] };

type AppState = {
  ui: UiState;
  domain: DomainState;
};
```

Giải thích: tách state UI khỏi domain state giúp tránh coupling giữa loading/error với business data.
Ví dụ: reset `ui.error` không làm thay đổi `domain.published`.

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Local state khác global state thế nào?
Giải thích: Local state thuộc một component/subtree nhỏ; global state dùng cho dữ liệu cần share nhiều nơi. Hãy ưu tiên local trước rồi mới nâng lên global khi cần.
Ví dụ: `isModalOpen` là local, `currentUser` là global.

### 🟢 [Junior] Tại sao cần immutable updates?
Giải thích: Vì React/store dựa nhiều vào so sánh reference để biết khi nào re-render hoặc recompute selector.
Ví dụ: Thay vì `state.user.name = 'A'`, tạo object user mới.

### 🟡 [Mid] Khi nào dùng Context, khi nào dùng Zustand/Redux?
Giải thích: Context tốt cho config thay đổi ít; store ngoài tốt hơn khi state lớn, update thường xuyên, cần devtools/selector mạnh.
Ví dụ: Theme dùng Context; cart + filters realtime dùng Zustand.

### 🟡 [Mid] Server state và client state nên tách ra sao?
Giải thích: Server state nên giao cho thư viện fetch-cache-revalidate; client state giữ cho UI flow cục bộ. Không trộn cả hai vào một reducer monolith.
Ví dụ: Use query cache cho orders, useState cho active tab.

### 🟡 [Mid] Normalization có lợi gì?
Giải thích: Giảm duplicate, tăng tốc update, dễ viết selector, tránh nested updates phức tạp.
Ví dụ: `posts.byId` + `comments.byId` + `postCommentIds` mapping.

### 🔴 [Senior] Bạn thiết kế strategy đồng bộ logout đa tab như nào?
Giải thích: Dùng BroadcastChannel phát sự kiện `auth/logout`; fallback `storage` event; đảm bảo idempotent handler.
Ví dụ: Tab A logout -> clear token + publish event -> tab B nhận và redirect login.

### 🔴 [Senior] Khi nào state machine đáng dùng?
Giải thích: Khi flow có nhiều trạng thái/transition và side-effect có thứ tự nghiêm ngặt; machine giúp tránh invalid state.
Ví dụ: Payment flow không cho `success` trước `authorized`.

### 🔴 [Senior] So sánh Observable và Signals trong app lớn?
Giải thích: Observable mạnh về stream composition/time operators; Signals mạnh về fine-grained UI dependency. Có thể phối hợp: stream ở data layer, signal ở view layer.
Ví dụ: WebSocket stream RxJS -> derive signal cho widgets.

### 🟢 [Junior] State management question 9
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟡 [Mid] State management question 10
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🔴 [Senior] State management question 11
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟢 [Junior] State management question 12
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟡 [Mid] State management question 13
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🔴 [Senior] State management question 14
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟢 [Junior] State management question 15
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟡 [Mid] State management question 16
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🔴 [Senior] State management question 17
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟢 [Junior] State management question 18
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟡 [Mid] State management question 19
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🔴 [Senior] State management question 20
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟢 [Junior] State management question 21
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟡 [Mid] State management question 22
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🔴 [Senior] State management question 23
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟢 [Junior] State management question 24
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟡 [Mid] State management question 25
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🔴 [Senior] State management question 26
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟢 [Junior] State management question 27
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟡 [Mid] State management question 28
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🔴 [Senior] State management question 29
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟢 [Junior] State management question 30
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟡 [Mid] State management question 31
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🔴 [Senior] State management question 32
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟢 [Junior] State management question 33
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟡 [Mid] State management question 34
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🔴 [Senior] State management question 35
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟢 [Junior] State management question 36
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟡 [Mid] State management question 37
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🔴 [Senior] State management question 38
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟢 [Junior] State management question 39
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟡 [Mid] State management question 40
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🔴 [Senior] State management question 41
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟢 [Junior] State management question 42
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟡 [Mid] State management question 43
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🔴 [Senior] State management question 44
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟢 [Junior] State management question 45
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟡 [Mid] State management question 46
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🔴 [Senior] State management question 47
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟢 [Junior] State management question 48
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟡 [Mid] State management question 49
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🔴 [Senior] State management question 50
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟢 [Junior] State management question 51
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟡 [Mid] State management question 52
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🔴 [Senior] State management question 53
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟢 [Junior] State management question 54
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟡 [Mid] State management question 55
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🔴 [Senior] State management question 56
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟢 [Junior] State management question 57
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟡 [Mid] State management question 58
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🔴 [Senior] State management question 59
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

### 🟢 [Junior] State management question 60
Giải thích: mô tả rõ bối cảnh hệ thống, điểm nghẽn re-render, và lựa chọn mô hình state phù hợp với constraint hiện tại.
Ví dụ: với bảng 10k dòng, tách selection state theo id và subscribe theo selector để tránh re-render toàn bảng.

## Study Checklist

- Xác định ranh giới local/global cho từng feature.
- Tách server/client state rõ ràng.
- Chuẩn hóa entities nếu có quan hệ 1-n, n-n.
- Thử một flow phức tạp bằng state machine.
- Thêm cơ chế persist tối thiểu cần thiết.
- Kiểm thử cross-tab sync (logout/theme).

## Related Files

- `../../03-react/05-state-management.md`
- `./17-frontend-theory-09-state-management-theory.md`
- `../08-fe-system-design/01-architecture-patterns.md`
