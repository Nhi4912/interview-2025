# Interview Practice 03: Frontend System Design Questions

## Overview / Tổng Quan

Frontend system design interview đánh giá khả năng thiết kế UI ở quy mô lớn: architecture, state, API contract,
performance, accessibility, reliability, và trade-off kinh doanh/kỹ thuật.

Cross-reference:
- `../../08-fe-system-design/01-architecture-patterns.md`
- `../../shared/02-system-design/system-design-theory.md`

## Frontend System Design Interview Format

1. Clarify requirements (functional + non-functional)
2. Define scope and constraints
3. Propose high-level architecture
4. Dive into state/data/API design
5. Discuss performance and accessibility
6. Evaluate trade-offs and future evolution

Giải thích: interviewer muốn xem cách bạn suy nghĩ có cấu trúc, không chỉ vẽ component tree.
Ví dụ: luôn nói rõ assumption trước khi đưa kiến trúc.

## Problem 1: Design a Chat UI

### Requirements Clarification
Giải thích:
- Liệt kê core use cases và edge cases trước khi thiết kế.
- Chốt SLO/SLA hiển thị, latency, offline requirement nếu có.
Ví dụ: chat cần delivery state (sent/delivered/read), search message, và retry khi mạng chập chờn.

### Component Architecture
Giải thích:
- Chia theo feature boundary: container, presentational, data hooks, shared primitives.
- Ưu tiên khả năng test và thay thế module.
Ví dụ: `MessageList`, `Composer`, `PresenceIndicator`, `ConnectionBanner`.

### State Management
Giải thích:
- Tách UI state, domain state, server state.
- Dùng normalized store cho entity lớn và quan hệ nhiều-nhiều.
Ví dụ: `entities.byId`, `idsByChannel`, `pendingOps` cho optimistic update.

### API Design
Giải thích:
- Định nghĩa contract rõ request/response/error shape + pagination strategy.
- Nêu rõ cơ chế realtime (SSE/WebSocket) nếu cần.
Ví dụ: `GET /items?cursor=...`, `POST /items`, `WS event:item.updated`.

### Performance Considerations
Giải thích:
- Virtualization, memoized selectors, request batching, incremental rendering.
- Budget theo p95 interaction latency.
Ví dụ: windowed list cho 50k records và debounce input 150ms.

### Accessibility
Giải thích:
- Keyboard-first navigation, ARIA semantics, focus management, screen reader announcement.
Ví dụ: role listbox/option cho autocomplete, live region cho thông báo trạng thái.

### Trade-offs
Giải thích:
- Chọn giải pháp theo complexity hiện tại và khả năng mở rộng tương lai.
- Nêu rõ rủi ro + mitigation.
Ví dụ: chọn polling thay WS ở phase 1 để giảm vận hành, sau đó nâng cấp theo growth.

### High-level Solution Summary
Giải thích: đưa ra phương án baseline có thể ship nhanh, rồi nêu roadmap scale.
Ví dụ: MVP dùng REST + polling; scale dùng WS + event dedupe + partitioned caches.

## Problem 2: Design an Autocomplete Component

### Requirements Clarification
Giải thích:
- Liệt kê core use cases và edge cases trước khi thiết kế.
- Chốt SLO/SLA hiển thị, latency, offline requirement nếu có.
Ví dụ: chat cần delivery state (sent/delivered/read), search message, và retry khi mạng chập chờn.

### Component Architecture
Giải thích:
- Chia theo feature boundary: container, presentational, data hooks, shared primitives.
- Ưu tiên khả năng test và thay thế module.
Ví dụ: `MessageList`, `Composer`, `PresenceIndicator`, `ConnectionBanner`.

### State Management
Giải thích:
- Tách UI state, domain state, server state.
- Dùng normalized store cho entity lớn và quan hệ nhiều-nhiều.
Ví dụ: `entities.byId`, `idsByChannel`, `pendingOps` cho optimistic update.

### API Design
Giải thích:
- Định nghĩa contract rõ request/response/error shape + pagination strategy.
- Nêu rõ cơ chế realtime (SSE/WebSocket) nếu cần.
Ví dụ: `GET /items?cursor=...`, `POST /items`, `WS event:item.updated`.

### Performance Considerations
Giải thích:
- Virtualization, memoized selectors, request batching, incremental rendering.
- Budget theo p95 interaction latency.
Ví dụ: windowed list cho 50k records và debounce input 150ms.

### Accessibility
Giải thích:
- Keyboard-first navigation, ARIA semantics, focus management, screen reader announcement.
Ví dụ: role listbox/option cho autocomplete, live region cho thông báo trạng thái.

### Trade-offs
Giải thích:
- Chọn giải pháp theo complexity hiện tại và khả năng mở rộng tương lai.
- Nêu rõ rủi ro + mitigation.
Ví dụ: chọn polling thay WS ở phase 1 để giảm vận hành, sau đó nâng cấp theo growth.

### High-level Solution Summary
Giải thích: đưa ra phương án baseline có thể ship nhanh, rồi nêu roadmap scale.
Ví dụ: MVP dùng REST + polling; scale dùng WS + event dedupe + partitioned caches.

## Problem 3: Design a Spreadsheet App

### Requirements Clarification
Giải thích:
- Liệt kê core use cases và edge cases trước khi thiết kế.
- Chốt SLO/SLA hiển thị, latency, offline requirement nếu có.
Ví dụ: chat cần delivery state (sent/delivered/read), search message, và retry khi mạng chập chờn.

### Component Architecture
Giải thích:
- Chia theo feature boundary: container, presentational, data hooks, shared primitives.
- Ưu tiên khả năng test và thay thế module.
Ví dụ: `MessageList`, `Composer`, `PresenceIndicator`, `ConnectionBanner`.

### State Management
Giải thích:
- Tách UI state, domain state, server state.
- Dùng normalized store cho entity lớn và quan hệ nhiều-nhiều.
Ví dụ: `entities.byId`, `idsByChannel`, `pendingOps` cho optimistic update.

### API Design
Giải thích:
- Định nghĩa contract rõ request/response/error shape + pagination strategy.
- Nêu rõ cơ chế realtime (SSE/WebSocket) nếu cần.
Ví dụ: `GET /items?cursor=...`, `POST /items`, `WS event:item.updated`.

### Performance Considerations
Giải thích:
- Virtualization, memoized selectors, request batching, incremental rendering.
- Budget theo p95 interaction latency.
Ví dụ: windowed list cho 50k records và debounce input 150ms.

### Accessibility
Giải thích:
- Keyboard-first navigation, ARIA semantics, focus management, screen reader announcement.
Ví dụ: role listbox/option cho autocomplete, live region cho thông báo trạng thái.

### Trade-offs
Giải thích:
- Chọn giải pháp theo complexity hiện tại và khả năng mở rộng tương lai.
- Nêu rõ rủi ro + mitigation.
Ví dụ: chọn polling thay WS ở phase 1 để giảm vận hành, sau đó nâng cấp theo growth.

### High-level Solution Summary
Giải thích: đưa ra phương án baseline có thể ship nhanh, rồi nêu roadmap scale.
Ví dụ: MVP dùng REST + polling; scale dùng WS + event dedupe + partitioned caches.

## Problem 4: Design a Feed/Timeline

### Requirements Clarification
Giải thích:
- Liệt kê core use cases và edge cases trước khi thiết kế.
- Chốt SLO/SLA hiển thị, latency, offline requirement nếu có.
Ví dụ: chat cần delivery state (sent/delivered/read), search message, và retry khi mạng chập chờn.

### Component Architecture
Giải thích:
- Chia theo feature boundary: container, presentational, data hooks, shared primitives.
- Ưu tiên khả năng test và thay thế module.
Ví dụ: `MessageList`, `Composer`, `PresenceIndicator`, `ConnectionBanner`.

### State Management
Giải thích:
- Tách UI state, domain state, server state.
- Dùng normalized store cho entity lớn và quan hệ nhiều-nhiều.
Ví dụ: `entities.byId`, `idsByChannel`, `pendingOps` cho optimistic update.

### API Design
Giải thích:
- Định nghĩa contract rõ request/response/error shape + pagination strategy.
- Nêu rõ cơ chế realtime (SSE/WebSocket) nếu cần.
Ví dụ: `GET /items?cursor=...`, `POST /items`, `WS event:item.updated`.

### Performance Considerations
Giải thích:
- Virtualization, memoized selectors, request batching, incremental rendering.
- Budget theo p95 interaction latency.
Ví dụ: windowed list cho 50k records và debounce input 150ms.

### Accessibility
Giải thích:
- Keyboard-first navigation, ARIA semantics, focus management, screen reader announcement.
Ví dụ: role listbox/option cho autocomplete, live region cho thông báo trạng thái.

### Trade-offs
Giải thích:
- Chọn giải pháp theo complexity hiện tại và khả năng mở rộng tương lai.
- Nêu rõ rủi ro + mitigation.
Ví dụ: chọn polling thay WS ở phase 1 để giảm vận hành, sau đó nâng cấp theo growth.

### High-level Solution Summary
Giải thích: đưa ra phương án baseline có thể ship nhanh, rồi nêu roadmap scale.
Ví dụ: MVP dùng REST + polling; scale dùng WS + event dedupe + partitioned caches.

## Problem 5: Design a Drag-and-Drop Page Builder

### Requirements Clarification
Giải thích:
- Liệt kê core use cases và edge cases trước khi thiết kế.
- Chốt SLO/SLA hiển thị, latency, offline requirement nếu có.
Ví dụ: chat cần delivery state (sent/delivered/read), search message, và retry khi mạng chập chờn.

### Component Architecture
Giải thích:
- Chia theo feature boundary: container, presentational, data hooks, shared primitives.
- Ưu tiên khả năng test và thay thế module.
Ví dụ: `MessageList`, `Composer`, `PresenceIndicator`, `ConnectionBanner`.

### State Management
Giải thích:
- Tách UI state, domain state, server state.
- Dùng normalized store cho entity lớn và quan hệ nhiều-nhiều.
Ví dụ: `entities.byId`, `idsByChannel`, `pendingOps` cho optimistic update.

### API Design
Giải thích:
- Định nghĩa contract rõ request/response/error shape + pagination strategy.
- Nêu rõ cơ chế realtime (SSE/WebSocket) nếu cần.
Ví dụ: `GET /items?cursor=...`, `POST /items`, `WS event:item.updated`.

### Performance Considerations
Giải thích:
- Virtualization, memoized selectors, request batching, incremental rendering.
- Budget theo p95 interaction latency.
Ví dụ: windowed list cho 50k records và debounce input 150ms.

### Accessibility
Giải thích:
- Keyboard-first navigation, ARIA semantics, focus management, screen reader announcement.
Ví dụ: role listbox/option cho autocomplete, live region cho thông báo trạng thái.

### Trade-offs
Giải thích:
- Chọn giải pháp theo complexity hiện tại và khả năng mở rộng tương lai.
- Nêu rõ rủi ro + mitigation.
Ví dụ: chọn polling thay WS ở phase 1 để giảm vận hành, sau đó nâng cấp theo growth.

### High-level Solution Summary
Giải thích: đưa ra phương án baseline có thể ship nhanh, rồi nêu roadmap scale.
Ví dụ: MVP dùng REST + polling; scale dùng WS + event dedupe + partitioned caches.

## Problem 6: Design a Real-time Dashboard

### Requirements Clarification
Giải thích:
- Liệt kê core use cases và edge cases trước khi thiết kế.
- Chốt SLO/SLA hiển thị, latency, offline requirement nếu có.
Ví dụ: chat cần delivery state (sent/delivered/read), search message, và retry khi mạng chập chờn.

### Component Architecture
Giải thích:
- Chia theo feature boundary: container, presentational, data hooks, shared primitives.
- Ưu tiên khả năng test và thay thế module.
Ví dụ: `MessageList`, `Composer`, `PresenceIndicator`, `ConnectionBanner`.

### State Management
Giải thích:
- Tách UI state, domain state, server state.
- Dùng normalized store cho entity lớn và quan hệ nhiều-nhiều.
Ví dụ: `entities.byId`, `idsByChannel`, `pendingOps` cho optimistic update.

### API Design
Giải thích:
- Định nghĩa contract rõ request/response/error shape + pagination strategy.
- Nêu rõ cơ chế realtime (SSE/WebSocket) nếu cần.
Ví dụ: `GET /items?cursor=...`, `POST /items`, `WS event:item.updated`.

### Performance Considerations
Giải thích:
- Virtualization, memoized selectors, request batching, incremental rendering.
- Budget theo p95 interaction latency.
Ví dụ: windowed list cho 50k records và debounce input 150ms.

### Accessibility
Giải thích:
- Keyboard-first navigation, ARIA semantics, focus management, screen reader announcement.
Ví dụ: role listbox/option cho autocomplete, live region cho thông báo trạng thái.

### Trade-offs
Giải thích:
- Chọn giải pháp theo complexity hiện tại và khả năng mở rộng tương lai.
- Nêu rõ rủi ro + mitigation.
Ví dụ: chọn polling thay WS ở phase 1 để giảm vận hành, sau đó nâng cấp theo growth.

### High-level Solution Summary
Giải thích: đưa ra phương án baseline có thể ship nhanh, rồi nêu roadmap scale.
Ví dụ: MVP dùng REST + polling; scale dùng WS + event dedupe + partitioned caches.

## Problem 7: Design a Notification System UI

### Requirements Clarification
Giải thích:
- Liệt kê core use cases và edge cases trước khi thiết kế.
- Chốt SLO/SLA hiển thị, latency, offline requirement nếu có.
Ví dụ: chat cần delivery state (sent/delivered/read), search message, và retry khi mạng chập chờn.

### Component Architecture
Giải thích:
- Chia theo feature boundary: container, presentational, data hooks, shared primitives.
- Ưu tiên khả năng test và thay thế module.
Ví dụ: `MessageList`, `Composer`, `PresenceIndicator`, `ConnectionBanner`.

### State Management
Giải thích:
- Tách UI state, domain state, server state.
- Dùng normalized store cho entity lớn và quan hệ nhiều-nhiều.
Ví dụ: `entities.byId`, `idsByChannel`, `pendingOps` cho optimistic update.

### API Design
Giải thích:
- Định nghĩa contract rõ request/response/error shape + pagination strategy.
- Nêu rõ cơ chế realtime (SSE/WebSocket) nếu cần.
Ví dụ: `GET /items?cursor=...`, `POST /items`, `WS event:item.updated`.

### Performance Considerations
Giải thích:
- Virtualization, memoized selectors, request batching, incremental rendering.
- Budget theo p95 interaction latency.
Ví dụ: windowed list cho 50k records và debounce input 150ms.

### Accessibility
Giải thích:
- Keyboard-first navigation, ARIA semantics, focus management, screen reader announcement.
Ví dụ: role listbox/option cho autocomplete, live region cho thông báo trạng thái.

### Trade-offs
Giải thích:
- Chọn giải pháp theo complexity hiện tại và khả năng mở rộng tương lai.
- Nêu rõ rủi ro + mitigation.
Ví dụ: chọn polling thay WS ở phase 1 để giảm vận hành, sau đó nâng cấp theo growth.

### High-level Solution Summary
Giải thích: đưa ra phương án baseline có thể ship nhanh, rồi nêu roadmap scale.
Ví dụ: MVP dùng REST + polling; scale dùng WS + event dedupe + partitioned caches.

## Problem 8: Design a File Upload System

### Requirements Clarification
Giải thích:
- Liệt kê core use cases và edge cases trước khi thiết kế.
- Chốt SLO/SLA hiển thị, latency, offline requirement nếu có.
Ví dụ: chat cần delivery state (sent/delivered/read), search message, và retry khi mạng chập chờn.

### Component Architecture
Giải thích:
- Chia theo feature boundary: container, presentational, data hooks, shared primitives.
- Ưu tiên khả năng test và thay thế module.
Ví dụ: `MessageList`, `Composer`, `PresenceIndicator`, `ConnectionBanner`.

### State Management
Giải thích:
- Tách UI state, domain state, server state.
- Dùng normalized store cho entity lớn và quan hệ nhiều-nhiều.
Ví dụ: `entities.byId`, `idsByChannel`, `pendingOps` cho optimistic update.

### API Design
Giải thích:
- Định nghĩa contract rõ request/response/error shape + pagination strategy.
- Nêu rõ cơ chế realtime (SSE/WebSocket) nếu cần.
Ví dụ: `GET /items?cursor=...`, `POST /items`, `WS event:item.updated`.

### Performance Considerations
Giải thích:
- Virtualization, memoized selectors, request batching, incremental rendering.
- Budget theo p95 interaction latency.
Ví dụ: windowed list cho 50k records và debounce input 150ms.

### Accessibility
Giải thích:
- Keyboard-first navigation, ARIA semantics, focus management, screen reader announcement.
Ví dụ: role listbox/option cho autocomplete, live region cho thông báo trạng thái.

### Trade-offs
Giải thích:
- Chọn giải pháp theo complexity hiện tại và khả năng mở rộng tương lai.
- Nêu rõ rủi ro + mitigation.
Ví dụ: chọn polling thay WS ở phase 1 để giảm vận hành, sau đó nâng cấp theo growth.

### High-level Solution Summary
Giải thích: đưa ra phương án baseline có thể ship nhanh, rồi nêu roadmap scale.
Ví dụ: MVP dùng REST + polling; scale dùng WS + event dedupe + partitioned caches.

## Problem 9: Design a Collaborative Kanban Board

### Requirements Clarification
Giải thích:
- Liệt kê core use cases và edge cases trước khi thiết kế.
- Chốt SLO/SLA hiển thị, latency, offline requirement nếu có.
Ví dụ: chat cần delivery state (sent/delivered/read), search message, và retry khi mạng chập chờn.

### Component Architecture
Giải thích:
- Chia theo feature boundary: container, presentational, data hooks, shared primitives.
- Ưu tiên khả năng test và thay thế module.
Ví dụ: `MessageList`, `Composer`, `PresenceIndicator`, `ConnectionBanner`.

### State Management
Giải thích:
- Tách UI state, domain state, server state.
- Dùng normalized store cho entity lớn và quan hệ nhiều-nhiều.
Ví dụ: `entities.byId`, `idsByChannel`, `pendingOps` cho optimistic update.

### API Design
Giải thích:
- Định nghĩa contract rõ request/response/error shape + pagination strategy.
- Nêu rõ cơ chế realtime (SSE/WebSocket) nếu cần.
Ví dụ: `GET /items?cursor=...`, `POST /items`, `WS event:item.updated`.

### Performance Considerations
Giải thích:
- Virtualization, memoized selectors, request batching, incremental rendering.
- Budget theo p95 interaction latency.
Ví dụ: windowed list cho 50k records và debounce input 150ms.

### Accessibility
Giải thích:
- Keyboard-first navigation, ARIA semantics, focus management, screen reader announcement.
Ví dụ: role listbox/option cho autocomplete, live region cho thông báo trạng thái.

### Trade-offs
Giải thích:
- Chọn giải pháp theo complexity hiện tại và khả năng mở rộng tương lai.
- Nêu rõ rủi ro + mitigation.
Ví dụ: chọn polling thay WS ở phase 1 để giảm vận hành, sau đó nâng cấp theo growth.

### High-level Solution Summary
Giải thích: đưa ra phương án baseline có thể ship nhanh, rồi nêu roadmap scale.
Ví dụ: MVP dùng REST + polling; scale dùng WS + event dedupe + partitioned caches.

### Deep Dive 1: Design a Chat UI Architecture Notes
Giải thích:
- Data flow: input events -> domain actions -> async effects -> state updates -> UI render.
- Error handling: retry policy, user feedback, fallback UI.
- Observability: logs/metrics/traces trên interaction critical path.
Ví dụ: emit metric `ui.action.latency` theo action type để theo dõi regression sau release.

#### Edge Cases 1
Giải thích: luôn chuẩn bị edge case để thể hiện tư duy production-grade.
Ví dụ: duplicate events, clock skew, partial failure, stale cache, slow network.

### Deep Dive 2: Design an Autocomplete Component Architecture Notes
Giải thích:
- Data flow: input events -> domain actions -> async effects -> state updates -> UI render.
- Error handling: retry policy, user feedback, fallback UI.
- Observability: logs/metrics/traces trên interaction critical path.
Ví dụ: emit metric `ui.action.latency` theo action type để theo dõi regression sau release.

#### Edge Cases 2
Giải thích: luôn chuẩn bị edge case để thể hiện tư duy production-grade.
Ví dụ: duplicate events, clock skew, partial failure, stale cache, slow network.

### Deep Dive 3: Design a Spreadsheet App Architecture Notes
Giải thích:
- Data flow: input events -> domain actions -> async effects -> state updates -> UI render.
- Error handling: retry policy, user feedback, fallback UI.
- Observability: logs/metrics/traces trên interaction critical path.
Ví dụ: emit metric `ui.action.latency` theo action type để theo dõi regression sau release.

#### Edge Cases 3
Giải thích: luôn chuẩn bị edge case để thể hiện tư duy production-grade.
Ví dụ: duplicate events, clock skew, partial failure, stale cache, slow network.

### Deep Dive 4: Design a Feed/Timeline Architecture Notes
Giải thích:
- Data flow: input events -> domain actions -> async effects -> state updates -> UI render.
- Error handling: retry policy, user feedback, fallback UI.
- Observability: logs/metrics/traces trên interaction critical path.
Ví dụ: emit metric `ui.action.latency` theo action type để theo dõi regression sau release.

#### Edge Cases 4
Giải thích: luôn chuẩn bị edge case để thể hiện tư duy production-grade.
Ví dụ: duplicate events, clock skew, partial failure, stale cache, slow network.

### Deep Dive 5: Design a Drag-and-Drop Page Builder Architecture Notes
Giải thích:
- Data flow: input events -> domain actions -> async effects -> state updates -> UI render.
- Error handling: retry policy, user feedback, fallback UI.
- Observability: logs/metrics/traces trên interaction critical path.
Ví dụ: emit metric `ui.action.latency` theo action type để theo dõi regression sau release.

#### Edge Cases 5
Giải thích: luôn chuẩn bị edge case để thể hiện tư duy production-grade.
Ví dụ: duplicate events, clock skew, partial failure, stale cache, slow network.

### Deep Dive 6: Design a Real-time Dashboard Architecture Notes
Giải thích:
- Data flow: input events -> domain actions -> async effects -> state updates -> UI render.
- Error handling: retry policy, user feedback, fallback UI.
- Observability: logs/metrics/traces trên interaction critical path.
Ví dụ: emit metric `ui.action.latency` theo action type để theo dõi regression sau release.

#### Edge Cases 6
Giải thích: luôn chuẩn bị edge case để thể hiện tư duy production-grade.
Ví dụ: duplicate events, clock skew, partial failure, stale cache, slow network.

### Deep Dive 7: Design a Notification System UI Architecture Notes
Giải thích:
- Data flow: input events -> domain actions -> async effects -> state updates -> UI render.
- Error handling: retry policy, user feedback, fallback UI.
- Observability: logs/metrics/traces trên interaction critical path.
Ví dụ: emit metric `ui.action.latency` theo action type để theo dõi regression sau release.

#### Edge Cases 7
Giải thích: luôn chuẩn bị edge case để thể hiện tư duy production-grade.
Ví dụ: duplicate events, clock skew, partial failure, stale cache, slow network.

### Deep Dive 8: Design a File Upload System Architecture Notes
Giải thích:
- Data flow: input events -> domain actions -> async effects -> state updates -> UI render.
- Error handling: retry policy, user feedback, fallback UI.
- Observability: logs/metrics/traces trên interaction critical path.
Ví dụ: emit metric `ui.action.latency` theo action type để theo dõi regression sau release.

#### Edge Cases 8
Giải thích: luôn chuẩn bị edge case để thể hiện tư duy production-grade.
Ví dụ: duplicate events, clock skew, partial failure, stale cache, slow network.

### Deep Dive 9: Design a Collaborative Kanban Board Architecture Notes
Giải thích:
- Data flow: input events -> domain actions -> async effects -> state updates -> UI render.
- Error handling: retry policy, user feedback, fallback UI.
- Observability: logs/metrics/traces trên interaction critical path.
Ví dụ: emit metric `ui.action.latency` theo action type để theo dõi regression sau release.

#### Edge Cases 9
Giải thích: luôn chuẩn bị edge case để thể hiện tư duy production-grade.
Ví dụ: duplicate events, clock skew, partial failure, stale cache, slow network.

## Reusable Answer Template

1. Clarify use cases
2. Define constraints and assumptions
3. Draw module boundaries
4. Explain state model and data flow
5. Specify API and caching strategy
6. Cover perf + a11y + observability
7. Discuss trade-offs and next iteration

Giải thích: template này giúp bạn trả lời nhất quán trong 35-45 phút interview.
Ví dụ: dùng đúng template cho mọi bài, chỉ thay domain-specific details.

## Failure Modes to Mention

- Network timeout and retries
- Partial data loading
- Out-of-order events
- Race conditions in optimistic UI
- Stale tabs and sync conflicts
- Accessibility regressions after refactor

Giải thích: chủ động nói failure modes giúp tăng điểm senior signal.
Ví dụ: realtime dashboard cần dedupe theo event id để tránh double-apply.

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Frontend system design khác coding interview thế nào?
Giải thích: Nó tập trung kiến trúc và trade-off ở scale thay vì chỉ đúng/sai thuật toán.
Ví dụ: Bạn cần nói về state, API, perf, a11y, không chỉ code component.

### 🟢 [Junior] Khi nào cần virtualization cho list?
Giải thích: Khi số item lớn làm render vượt budget frame.
Ví dụ: Feed 20k items nên dùng windowing.

### 🟡 [Mid] Thiết kế autocomplete để vừa nhanh vừa chính xác?
Giải thích: Debounce input, cache query gần nhất, cancel request cũ, prefetch kết quả phổ biến.
Ví dụ: Dùng AbortController để hủy request stale.

### 🟡 [Mid] Làm sao xử lý optimistic update an toàn?
Giải thích: Gắn client operation id, rollback khi fail, reconcile khi server confirm.
Ví dụ: Upload file hiển thị pending và chuyển sang success khi server ack.

### 🔴 [Senior] Bạn scale chat UI cho hàng triệu MAU thế nào?
Giải thích: Phân tách channel shards, incremental sync, pagination theo cursor, compact local cache.
Ví dụ: Warm cache cho active channels + background prefetch.

### 🔴 [Senior] Cân bằng performance và accessibility ra sao?
Giải thích: Không đánh đổi a11y; tối ưu bằng semantic đúng + kỹ thuật render hiệu quả.
Ví dụ: Virtualized list vẫn giữ keyboard nav và SR announcements.

### 🟡 [Mid] FE system design question 7
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🔴 [Senior] FE system design question 8
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟢 [Junior] FE system design question 9
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟡 [Mid] FE system design question 10
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🔴 [Senior] FE system design question 11
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟢 [Junior] FE system design question 12
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟡 [Mid] FE system design question 13
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🔴 [Senior] FE system design question 14
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟢 [Junior] FE system design question 15
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟡 [Mid] FE system design question 16
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🔴 [Senior] FE system design question 17
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟢 [Junior] FE system design question 18
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟡 [Mid] FE system design question 19
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🔴 [Senior] FE system design question 20
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟢 [Junior] FE system design question 21
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟡 [Mid] FE system design question 22
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🔴 [Senior] FE system design question 23
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟢 [Junior] FE system design question 24
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟡 [Mid] FE system design question 25
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🔴 [Senior] FE system design question 26
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟢 [Junior] FE system design question 27
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟡 [Mid] FE system design question 28
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🔴 [Senior] FE system design question 29
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟢 [Junior] FE system design question 30
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟡 [Mid] FE system design question 31
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🔴 [Senior] FE system design question 32
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟢 [Junior] FE system design question 33
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟡 [Mid] FE system design question 34
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🔴 [Senior] FE system design question 35
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟢 [Junior] FE system design question 36
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟡 [Mid] FE system design question 37
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🔴 [Senior] FE system design question 38
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟢 [Junior] FE system design question 39
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟡 [Mid] FE system design question 40
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🔴 [Senior] FE system design question 41
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟢 [Junior] FE system design question 42
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟡 [Mid] FE system design question 43
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🔴 [Senior] FE system design question 44
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟢 [Junior] FE system design question 45
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟡 [Mid] FE system design question 46
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🔴 [Senior] FE system design question 47
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟢 [Junior] FE system design question 48
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟡 [Mid] FE system design question 49
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🔴 [Senior] FE system design question 50
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟢 [Junior] FE system design question 51
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟡 [Mid] FE system design question 52
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🔴 [Senior] FE system design question 53
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟢 [Junior] FE system design question 54
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟡 [Mid] FE system design question 55
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🔴 [Senior] FE system design question 56
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟢 [Junior] FE system design question 57
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟡 [Mid] FE system design question 58
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🔴 [Senior] FE system design question 59
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟢 [Junior] FE system design question 60
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟡 [Mid] FE system design question 61
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🔴 [Senior] FE system design question 62
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟢 [Junior] FE system design question 63
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟡 [Mid] FE system design question 64
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🔴 [Senior] FE system design question 65
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟢 [Junior] FE system design question 66
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟡 [Mid] FE system design question 67
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🔴 [Senior] FE system design question 68
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟢 [Junior] FE system design question 69
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

### 🟡 [Mid] FE system design question 70
Giải thích: trả lời theo cấu trúc requirement -> architecture -> state -> API -> performance -> a11y -> trade-off.
Ví dụ: với file upload system, nêu chunk upload, resume, progress UI, error retry và keyboard access cho controls.

## Practice Plan (2 Weeks)

- Day 1-2: Chat UI + Autocomplete
- Day 3-4: Feed/Timeline + Notifications
- Day 5-6: File Upload + Dashboard
- Day 7: Mock interview + feedback
- Week 2: lặp lại với thời gian giới hạn 40 phút/bài

Giải thích: luyện theo lịch cố định giúp tăng phản xạ trình bày và độ chắc trade-off.
Ví dụ: record màn hình + tự chấm rubric để cải tiến vòng sau.

## Related Files

- `../../08-fe-system-design/01-architecture-patterns.md`
- `../../08-fe-system-design/02-scalability.md`
- `../../08-fe-system-design/03-caching.md`
- `../../shared/02-system-design/system-design-theory.md`
